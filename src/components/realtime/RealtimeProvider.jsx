import { useEffect, useMemo, useState } from "react";
import { Bell, Briefcase, CheckCircle2, Heart, MessageCircle, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { getNotifications } from "../../services/adminService";
import realtimeService, { onRealtimeEvent, realtimeEvents } from "../../services/realtimeService";

const maxToasts = 4;
const notificationPollIntervalMs = 5000;
const initialNotificationWindowMs = 5 * 60 * 1000;
const seenNotificationIdsKey = "fya-seen-popup-notification-ids";

const makeToast = ({ type, title, body = "", targetUrl = "", icon: Icon = Bell }) => ({
  id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  type,
  title,
  body,
  targetUrl,
  Icon,
});

const actor = (value) => value || "Quelqu'un";

const asArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.notifications)) return value.notifications;
  return [];
};

const readSeenNotificationIds = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(`${seenNotificationIdsKey}:${userId}`) || "[]").map(String);
  } catch {
    return [];
  }
};

const writeSeenNotificationIds = (userId, ids) => {
  localStorage.setItem(
    `${seenNotificationIdsKey}:${userId}`,
    JSON.stringify(Array.from(new Set(ids.map(String))).slice(0, 300))
  );
};

const parseNotificationData = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const normalizeStoredNotification = (notification) => {
  const data = parseNotificationData(notification.data_json);
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
    id: notification.id,
    type: notification.type,
    data,
    title: data.title || data.titre || "",
    body: data.content || data.description || "",
    actorName: data.sender_name || data.artisan_name || data.liker_name || data.commenter_name || data.client_name || "",
    targetUrl: targetUrlByType[notification.type] || "",
  };
};

const emitNotification = (detail) => {
  window.dispatchEvent(new CustomEvent(realtimeEvents.notification, { detail }));
};

const getActiveConversationId = (pathname) => {
  const match = pathname.match(/^\/messages\/([^/]+)/);
  return match?.[1] || "";
};

const isViewingConversation = (pathname, conversationId) =>
  Boolean(conversationId) && String(getActiveConversationId(pathname)) === String(conversationId);

const isRecentNotification = (notification) => {
  const createdAt = Date.parse(notification.created_at || notification.updated_at || "");
  if (!Number.isFinite(createdAt)) return true;
  return Date.now() - createdAt <= initialNotificationWindowMs;
};

export default function RealtimeProvider({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    realtimeService.connect(user);

    return () => {
      realtimeService.disconnect();
    };
  }, [user]);

  const handlers = useMemo(() => ({
    [realtimeEvents.message]: (detail) => {
      if (isViewingConversation(location.pathname, detail.conversationId)) return null;

      return makeToast({
        type: "message",
        title: `${actor(detail.senderName)} vous a envoyé un message`,
        body: detail.content,
        targetUrl: detail.conversationId ? `/messages/${detail.conversationId}` : "/messages",
        icon: MessageCircle,
      });
    },
    [realtimeEvents.offerPublished]: (detail) => makeToast({
      type: "offer-published",
      title: `${actor(detail.actorName)} a publié un appel d'offre`,
      targetUrl: detail.offerId ? `/offres` : "/offres",
      icon: Briefcase,
    }),
    [realtimeEvents.offerApplication]: (detail) => makeToast({
      type: "offer-application",
      title: `${actor(detail.actorName)} a postulé à votre appel d'offre`,
      targetUrl: detail.offerId ? `/mes-appels-offres/${detail.offerId}` : "/mes-appels-offres",
      icon: Briefcase,
    }),
    [realtimeEvents.offerApplicationAccepted]: (detail) => makeToast({
      type: "offer-application-accepted",
      title: `${actor(detail.actorName)} a accepté votre candidature à son appel d'offre`,
      targetUrl: detail.offerId ? `/offres` : "/offres",
      icon: CheckCircle2,
    }),
    [realtimeEvents.notification]: (detail) => {
      if (detail.type === "nouveau_message") {
        if (isViewingConversation(location.pathname, detail.data?.conversation_id)) return null;

        return makeToast({
          type: "message",
          title: `${actor(detail.actorName)} vous a envoyé un message`,
          body: detail.body,
          targetUrl: detail.targetUrl || "/messages",
          icon: MessageCircle,
        });
      }

      if (detail.type === "nouvel_appel_offre") {
        return makeToast({
          type: "offer-published",
          title: `${actor(detail.actorName || "Un client")} a publié un appel d'offre`,
          targetUrl: detail.targetUrl || "/offres",
          icon: Briefcase,
        });
      }

      if (detail.type === "nouvelle_candidature") {
        return makeToast({
          type: "offer-application",
          title: `${actor(detail.actorName)} a postulé à votre appel d'offre`,
          targetUrl: detail.targetUrl || "/mes-appels-offres",
          icon: Briefcase,
        });
      }

      if (detail.type === "candidature_acceptee") {
        return makeToast({
          type: "offer-application-accepted",
          title: `${actor(detail.actorName || "Le client")} a accepté votre candidature à son appel d'offre`,
          targetUrl: detail.targetUrl || "/offres",
          icon: CheckCircle2,
        });
      }

      if (detail.type === "post_like") {
        return makeToast({
          type: "post-liked",
          title: `${actor(detail.actorName)} a aimé votre publication`,
          targetUrl: detail.targetUrl,
          icon: Heart,
        });
      }

      if (detail.type === "post_comment") {
        return makeToast({
          type: "post-commented",
          title: `${actor(detail.actorName)} a commenté votre publication`,
          targetUrl: detail.targetUrl,
          icon: MessageCircle,
        });
      }

      if (!detail.body && !detail.title) return null;

      return makeToast({
        type: "notification",
        title: detail.title || detail.body,
        body: detail.title ? detail.body : "",
        targetUrl: detail.targetUrl,
        icon: Bell,
      });
    },
  }), [location.pathname]);

  const pushToast = (toast) => {
    if (!toast) return;

    setToasts((current) => [toast, ...current].slice(0, maxToasts));
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== toast.id));
    }, 6500);
  };

  useEffect(() => {
    if (!user?.id) return undefined;

    return onRealtimeEvent(Object.keys(handlers), (event) => {
      const toast = handlers[event.type]?.(event.detail || {});
      pushToast(toast);
    });
  }, [handlers, user?.id]);

  useEffect(() => {
    if (!user?.id) return undefined;

    let active = true;
    let initialized = false;
    let seenIds = readSeenNotificationIds(user.id);

    async function pollNotifications() {
      try {
        const payload = await getNotifications();
        if (!active) return;

        const notifications = asArray(payload)
          .filter((notification) => notification?.id)
          .sort((first, second) => Number(first.id) - Number(second.id));
        const currentIds = notifications.map((notification) => String(notification.id));
        const unseenNotifications = notifications.filter((notification) => !seenIds.includes(String(notification.id)));

        if (!initialized) {
          initialized = true;
        unseenNotifications
            .filter((notification) => !notification.read_at && isRecentNotification(notification))
            .slice(-maxToasts)
            .forEach((notification) => {
              const normalized = normalizeStoredNotification(notification);
              emitNotification(normalized);
            });
          seenIds = Array.from(new Set([...seenIds, ...currentIds]));
          writeSeenNotificationIds(user.id, seenIds);
          return;
        }

        if (!unseenNotifications.length) return;

        unseenNotifications.forEach((notification) => {
          const normalized = normalizeStoredNotification(notification);
          emitNotification(normalized);
        });
        seenIds = Array.from(new Set([...seenIds, ...unseenNotifications.map((notification) => String(notification.id))]));
        writeSeenNotificationIds(user.id, seenIds);
      } catch {
        // Le WebSocket reste prioritaire; le polling ne doit jamais bloquer l'interface.
      }
    }

    pollNotifications();
    const timerId = window.setInterval(pollNotifications, notificationPollIntervalMs);

    return () => {
      active = false;
      window.clearInterval(timerId);
    };
  }, [handlers, user?.id]);

  const closeToast = (toastId) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId));
  };

  const openToast = (toast) => {
    closeToast(toast.id);
    if (toast.targetUrl) navigate(toast.targetUrl);
  };

  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 top-24 z-[90] flex w-[min(380px,calc(100vw-32px))] flex-col gap-3">
      {toasts.map((toast) => (
        <article
          key={toast.id}
          className="relative overflow-hidden rounded-lg border border-[#eadfd3] bg-white shadow-lg shadow-[#182433]/10"
        >
          <button
            type="button"
            onClick={() => openToast(toast)}
            className="flex w-full items-start gap-3 px-4 py-3 text-left"
          >
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eef6ff] text-[#145DA0]">
              <toast.Icon size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-sm font-extrabold leading-5 text-[#182433]">
                {toast.title}
              </strong>
              {toast.body && (
                <span className="mt-1 line-clamp-2 block text-xs font-semibold leading-5 text-gray-500">
                  {toast.body}
                </span>
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={() => closeToast(toast.id)}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full text-gray-400 transition hover:bg-[#f6f2ed] hover:text-[#182433]"
            aria-label="Fermer la notification"
          >
            <X size={15} />
          </button>
        </article>
      ))}
    </div>
  );
}
