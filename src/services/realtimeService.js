import Echo from "laravel-echo";
import Pusher from "pusher-js";

import { API_BASE_URL, authStorage } from "./apiClient";

export const realtimeEvents = {
  raw: "fya:realtime:raw",
  message: "fya:realtime:message",
  notification: "fya:realtime:notification",
  offerPublished: "fya:realtime:offer-published",
  offerApplication: "fya:realtime:offer-application",
  offerApplicationAccepted: "fya:realtime:offer-application-accepted",
  postLiked: "fya:realtime:post-liked",
  postCommented: "fya:realtime:post-commented",
  connected: "fya:realtime:connected",
  disconnected: "fya:realtime:disconnected",
  error: "fya:realtime:error",
};

const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, "");

const stripLeadingDot = (eventName = "") => String(eventName).replace(/^\./, "");

const asArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const emitRealtimeEvent = (eventName, detail) => {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};

const getPayloadObject = (payload) => {
  if (!payload || typeof payload !== "object") return {};
  return payload.data && typeof payload.data === "object" ? payload.data : payload;
};

const getNested = (payload, keys) => {
  const source = getPayloadObject(payload);
  for (const key of keys) {
    const value = key.split(".").reduce((current, part) => current?.[part], source);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
};

const matchesEvent = (eventName, patterns) => {
  const normalizedName = stripLeadingDot(eventName)
    .replace(/\\/g, ".")
    .replace(/[_-]/g, ".")
    .toLowerCase();

  return patterns.some((pattern) => pattern.test(normalizedName));
};

const parseJsonValue = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const resolveUserMetierId = (user) =>
  user?.artisan?.metier_id ||
  user?.artisan?.metier?.id ||
  user?.artisan_p?.metier_id ||
  user?.artisan_p?.metier?.id ||
  user?.artisanP?.metier_id ||
  user?.metier_id;

const userChannelNames = (user) => {
  const channels = [
    `private-users.${user.id}`,
    `private-user.${user.id}`,
    `private-App.Models.User.${user.id}`,
    `private-notifications.${user.id}`,
  ];
  const metierId = resolveUserMetierId(user);
  if (metierId) channels.push(`private-metier.${metierId}`);

  return channels;
};

const publicChannelNames = [
  "posts",
  "public.posts",
  "feed",
  "offers",
  "offres",
  "appels-offres",
  "appeloffres",
  "notifications",
];

const conversationChannelNames = (conversationId) => [
  `private-conversations.${conversationId}`,
  `private-conversation.${conversationId}`,
  `private-messagerie.${conversationId}`,
  `private-chat.${conversationId}`,
];

export const getRealtimeConfig = () => {
  const apiUrl = new URL(apiOrigin);
  const forceTls =
    String(import.meta.env.VITE_PUSHER_FORCE_TLS ?? import.meta.env.VITE_REVERB_SCHEME ?? apiUrl.protocol)
      .toLowerCase()
      .includes("https");

  return {
    enabled: String(import.meta.env.VITE_REALTIME_ENABLED ?? "true") !== "false",
    key: import.meta.env.VITE_PUSHER_APP_KEY || import.meta.env.VITE_REVERB_APP_KEY || "",
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || "mt1",
    host: import.meta.env.VITE_PUSHER_HOST || import.meta.env.VITE_REVERB_HOST || apiUrl.hostname,
    port: Number(import.meta.env.VITE_PUSHER_PORT || import.meta.env.VITE_REVERB_PORT || (forceTls ? 443 : 6001)),
    forceTls,
    authEndpoint: import.meta.env.VITE_PUSHER_AUTH_ENDPOINT || `${apiOrigin}/broadcasting/auth`,
  };
};

export const getRealtimeStatus = () => {
  const config = getRealtimeConfig();
  if (!config.enabled) return { available: false, reason: "disabled" };
  if (!config.key) return { available: false, reason: "missing-key" };
  return { available: true, reason: "" };
};

class RealtimeService {
  echo = null;
  userId = null;
  subscribedChannels = new Set();
  isGlobalListenerBound = false;

  connect(user) {
    if (typeof window === "undefined") return null;
    const status = getRealtimeStatus();
    if (!status.available || !user?.id) {
      this.disconnect();
      return null;
    }

    if (this.echo && String(this.userId) === String(user.id)) return this.echo;

    this.disconnect();

    const config = getRealtimeConfig();
    window.Pusher = Pusher;
    this.userId = user.id;
    this.echo = new Echo({
      broadcaster: "pusher",
      key: config.key,
      cluster: config.cluster,
      wsHost: config.host,
      wsPort: config.port,
      wssPort: config.port,
      forceTLS: config.forceTls,
      enabledTransports: ["ws", "wss"],
      authEndpoint: config.authEndpoint,
      auth: {
        headers: {
          Authorization: `Bearer ${authStorage.getToken() || ""}`,
          Accept: "application/json",
        },
      },
    });

    this.bindGlobalListener();
    this.subscribeToChannels([...userChannelNames(user), ...publicChannelNames]);
    this.bindConnectionStatus();

    return this.echo;
  }

  disconnect() {
    if (!this.echo) return;

    this.subscribedChannels.forEach((channelName) => {
      this.echo.leave(channelName.replace(/^private-/, ""));
    });
    this.subscribedChannels.clear();
    this.isGlobalListenerBound = false;
    this.echo.disconnect();
    this.echo = null;
    this.userId = null;
  }

  subscribeConversation(conversationId) {
    if (!this.echo || !conversationId) return () => {};

    const channelNames = conversationChannelNames(conversationId);
    this.subscribeToChannels(channelNames);

    return () => {
      channelNames.forEach((channelName) => {
        this.echo?.leave(channelName.replace(/^private-/, ""));
        this.subscribedChannels.delete(channelName);
      });
    };
  }

  subscribeConversations(conversationIds = []) {
    const channelNames = conversationIds.flatMap(conversationChannelNames);
    this.subscribeToChannels(channelNames);
  }

  subscribeToChannels(channelNames) {
    if (!this.echo) return;

    channelNames.forEach((channelName) => {
      if (!channelName || this.subscribedChannels.has(channelName)) return;

      let channel;
      if (channelName.startsWith("private-")) {
        channel = this.echo.private(channelName.replace(/^private-/, ""));
      } else {
        channel = this.echo.channel(channelName);
      }

      if (typeof channel?.error === "function") {
        channel.error((error) => {
          emitRealtimeEvent(realtimeEvents.error, { channelName, error });
        });
      }
      this.subscribedChannels.add(channelName);
    });
  }

  bindGlobalListener() {
    const pusher = this.echo?.connector?.pusher;
    if (!pusher || this.isGlobalListenerBound) return;

    pusher.bind_global((eventName, payload) => {
      const event = stripLeadingDot(eventName);
      const detail = { event, payload: getPayloadObject(payload), receivedAt: Date.now() };
      emitRealtimeEvent(realtimeEvents.raw, detail);
      this.routeEvent(detail);
    });
    this.isGlobalListenerBound = true;
  }

  bindConnectionStatus() {
    const connection = this.echo?.connector?.pusher?.connection;
    if (!connection) return;

    connection.bind("connected", () => emitRealtimeEvent(realtimeEvents.connected, {}));
    connection.bind("disconnected", () => emitRealtimeEvent(realtimeEvents.disconnected, {}));
    connection.bind("unavailable", () => emitRealtimeEvent(realtimeEvents.disconnected, {}));
    connection.bind("failed", () => emitRealtimeEvent(realtimeEvents.disconnected, {}));
    connection.bind("error", (error) => emitRealtimeEvent(realtimeEvents.error, error || {}));
  }

  routeEvent(detail) {
    const { event, payload } = detail;

    if (matchesEvent(event, [/notification/, /database\.notifications/])) {
      emitRealtimeEvent(realtimeEvents.notification, normalizeNotification(payload, event));
    }

    if (matchesEvent(event, [/message/, /messagerie/, /chat/])) {
      emitRealtimeEvent(realtimeEvents.message, normalizeMessage(payload, event));
    }

    if (matchesEvent(event, [/post.*(like|liked)/, /(like|liked).*post/, /publication.*(like|liked)/])) {
      emitRealtimeEvent(realtimeEvents.postLiked, normalizePostReaction(payload, event));
    }

    if (matchesEvent(event, [/post.*comment/, /comment.*post/, /publication.*comment/])) {
      emitRealtimeEvent(realtimeEvents.postCommented, normalizePostComment(payload, event));
    }

    if (matchesEvent(event, [/(appel|offer|offre).*(created|published|publie|publiee|new)/, /(created|published).*(appel|offer|offre)/])) {
      emitRealtimeEvent(realtimeEvents.offerPublished, normalizeOfferEvent(payload, event));
    }

    if (matchesEvent(event, [/(candidature|application|postul).*(created|sent|new)/, /(appel|offer|offre).*(candidature|application|postul)/])) {
      emitRealtimeEvent(realtimeEvents.offerApplication, normalizeOfferApplication(payload, event));
    }

    if (
      matchesEvent(event, [/(candidature|application).*(accepted|accepte|acceptee)/, /(accepted|accepte).*(candidature|application)/]) ||
      (
        matchesEvent(event, [/candidature.*status.*updated/, /application.*status.*updated/]) &&
        /accept|accepte|acceptee/i.test(String(payload?.candidature?.statut || payload?.statut || ""))
      )
    ) {
      emitRealtimeEvent(realtimeEvents.offerApplicationAccepted, normalizeOfferApplication(payload, event));
    }
  }
}

export const normalizeMessage = (payload, event = "message") => {
  const source = getPayloadObject(payload);
  const message = source.message || source.data?.message || source;

  return {
    event,
    raw: source,
    message,
    id: message.id || source.message_id || source.id,
    conversationId: message.conversation_id || source.conversation_id || source.conversation?.id,
    senderId: message.expediteur_id || message.sender_id || message.user_id || source.sender_id || source.user_id,
    senderName: getNested(source, ["message.user.name", "sender.name", "expediteur.name", "user.name", "author.name", "name"]) || "Quelqu'un",
    content: message.content || source.content || "",
  };
};

export const normalizeNotification = (payload, event = "notification") => {
  const source = getPayloadObject(payload);
  const notification = source.notification || source;
  const data = parseJsonValue(notification.data_json);
  const type = notification.type || source.type || event;
  const offerId = data.appel_offre_id || data.offer_id;
  const postId = data.post_id || data.publication_id;
  const conversationId = data.conversation_id;
  const targetUrlByType = {
    nouveau_message: conversationId ? `/messages/${conversationId}` : "/messages",
    nouvel_appel_offre: "/offres",
    nouvelle_candidature: offerId ? `/mes-appels-offres/${offerId}` : "/mes-appels-offres",
    candidature_acceptee: "/offres",
    post_like: postId ? `/publications/${postId}` : "",
    post_comment: postId ? `/publications/${postId}` : "",
  };

  return {
    event,
    raw: source,
    data,
    id: notification.id || source.notification_id,
    type,
    title: notification.title || data.title || data.titre || "",
    body: notification.body || notification.message || data.content || data.description || "",
    actorName:
      data.sender_name ||
      data.artisan_name ||
      data.liker_name ||
      data.commenter_name ||
      data.client_name ||
      getNested(source, ["actor.name", "user.name", "sender.name", "artisan.user.name", "client.user.name", "name"]),
    targetUrl: notification.url || notification.link || notification.target_url || targetUrlByType[type] || "",
  };
};

export const normalizePostReaction = (payload, event = "post-liked") => {
  const source = getPayloadObject(payload);
  const post = source.post || source.publication || {};

  return {
    event,
    raw: source,
    postId: source.post_id || source.publication_id || post.id,
    likesCount: source.likes_count ?? source.likesCount ?? post.likes_count ?? post.likes?.length,
    likedByUserId: source.user_id || source.liked_by_id || source.actor_id || source.user?.id,
    actorName: getNested(source, ["user.name", "actor.name", "name"]),
  };
};

export const normalizePostComment = (payload, event = "post-commented") => {
  const source = getPayloadObject(payload);
  const comment = source.comment || source.commentaire || source.data?.commentaire || source;

  return {
    event,
    raw: source,
    comment,
    commentId: comment.id || source.comment_id,
    postId: comment.post_id || source.post_id || source.publication_id || source.post?.id,
    commentsCount: source.comments_count ?? source.commentaires_count ?? source.post?.comments_count,
    actorName: getNested(source, ["user.name", "actor.name", "comment.user.name", "commentaire.user.name", "name"]),
  };
};

export const normalizeOfferEvent = (payload, event = "offer-published") => {
  const source = getPayloadObject(payload);
  const offer = source.offer || source.appel_offre || source.appelOffre || source;

  return {
    event,
    raw: source,
    offer,
    offerId: offer.id || source.offer_id || source.appel_offre_id,
    actorName: source.client_name || offer.client_name || getNested(source, ["user.name", "client.user.name", "client.name", "actor.name", "name"]),
  };
};

export const normalizeOfferApplication = (payload, event = "offer-application") => {
  const source = getPayloadObject(payload);
  const application = source.application || source.candidature || source;
  const offer = source.offer || source.appel_offre || source.appelOffre || application.appel_offre || {};

  return {
    event,
    raw: source,
    application,
    offer,
    offerId: offer.id || source.offer_id || source.appel_offre_id || application.appel_offre_id,
    applicationId: application.id || source.application_id || source.candidature_id,
    actorName: application.artisan_name || source.artisan_name || getNested(source, ["artisan.user.name", "artisan.name", "user.name", "actor.name", "name"]),
  };
};

export const onRealtimeEvent = (eventNames, callback) => {
  const names = asArray(eventNames);
  names.forEach((eventName) => window.addEventListener(eventName, callback));

  return () => {
    names.forEach((eventName) => window.removeEventListener(eventName, callback));
  };
};

export const realtimeService = new RealtimeService();

export default realtimeService;
