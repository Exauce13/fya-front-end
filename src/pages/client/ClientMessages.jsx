import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ChatWindow from "../../components/messaging/ChatWindow";
import ConversationList from "../../components/messaging/ConversationList";
import { createComplaint } from "../../services/adminService";
import {
  createConversation,
  getConversationMessages,
  getConversations,
  sendMessage as sendConversationMessage,
  uploadMessageFile,
  uploadVoiceNote,
} from "../../services/messageService";
import { getApiMessage, getStorageUrl } from "../../services/apiClient";
import { useUserMode } from "../../context/useUserMode";
import profileAvatar from "../../assets/images/profile-avatar.svg";

const refreshIntervalMs = 1800;
const initialVisibleMessages = 35;
const visibleMessagesStep = 25;

const mediaKind = (media) => media.kind || (media.mime_type?.startsWith("video/") ? "video" : media.mime_type?.startsWith("audio/") ? "audio" : "image");

const asArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.messages)) return value.messages;
  if (Array.isArray(value?.conversations)) return value.conversations;
  return [];
};

const normalizeConversation = (conversation, currentUserId) => {
  const otherUser = (conversation.users || []).find((item) => Number(item.id) !== Number(currentUserId)) || conversation.users?.[0] || {};
  const lastMessage = conversation.last_message || {};
  const userType = otherUser.statut || otherUser.role;
  const profileId =
    otherUser.artisan?.id ||
    otherUser.artisan_p?.id ||
    otherUser.artisanP?.id ||
    otherUser.client?.id ||
    otherUser.client_id ||
    otherUser.artisan_id ||
    otherUser.id;

  return {
    id: conversation.id,
    name: otherUser.name || conversation.title || "Conversation",
    avatar: getStorageUrl(otherUser.photo) || profileAvatar,
    service: lastMessage.content || conversation.type || "",
    time: conversation.updated_at ? new Date(conversation.updated_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "",
    userId: otherUser.id,
    profileId,
    userType,
    profileState: {
      userId: otherUser.id,
      artisan: otherUser.artisan || otherUser.artisan_p || otherUser.artisanP
        ? {
            ...(otherUser.artisan || otherUser.artisan_p || otherUser.artisanP),
            userId: otherUser.id,
            name: otherUser.name,
            image: getStorageUrl(otherUser.photo) || profileAvatar,
          }
        : undefined,
      client: otherUser.client
        ? {
            ...otherUser.client,
            userId: otherUser.id,
            name: otherUser.name,
            avatar: getStorageUrl(otherUser.photo) || profileAvatar,
          }
        : undefined,
    },
    raw: conversation,
  };
};

const parseMessageMedia = (media) => {
  if (!media) return [];
  if (Array.isArray(media)) return media;
  if (typeof media === "string") {
    try {
      const parsed = JSON.parse(media);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const normalizeMessage = (message, currentUserId) => ({
  id: message.id,
  sender: Number(message.expediteur_id) === Number(currentUserId) ? "me" : "other",
  text: message.content || "",
  images: parseMessageMedia(message.media).map((media) => ({
    name: media.original_name || media.file_name || media.name || "media",
    src: media.url || getStorageUrl(media.file_path || media.path),
    type: mediaKind(media) === "voice_note" ? "audio" : mediaKind(media),
  })),
  time: message.created_at ? new Date(message.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "",
  createdAtMs: message.created_at ? new Date(message.created_at).getTime() : Date.now(),
});

const mergeMessages = (currentMessages, nextMessages) => {
  const itemsById = new Map();
  const messageSignature = (message) => [
    message.sender,
    message.text || "",
    (message.images || []).length,
    (message.images || []).map((item) => item.type || "").join(","),
  ].join("|");

  [...currentMessages, ...nextMessages].forEach((message) => {
    if (!message?.id) return;
    const duplicateLocalMessage = Array.from(itemsById.values()).find((existingMessage) => {
      if (!String(existingMessage.id).startsWith("local-")) return false;
      return messageSignature(existingMessage) === messageSignature(message);
    });

    if (duplicateLocalMessage) {
      itemsById.delete(String(duplicateLocalMessage.id));
      message = {
        ...message,
        createdAtMs: message.createdAtMs || duplicateLocalMessage.createdAtMs,
      };
    }

    itemsById.set(String(message.id), message);
  });

  return Array.from(itemsById.values()).sort((first, second) => {
    const firstTime = Number(first.createdAtMs || 0);
    const secondTime = Number(second.createdAtMs || 0);

    if (firstTime && secondTime && firstTime !== secondTime) return firstTime - secondTime;

    const firstNumber = Number(first.id);
    const secondNumber = Number(second.id);
    if (Number.isFinite(firstNumber) && Number.isFinite(secondNumber)) return firstNumber - secondNumber;
    return String(first.id).localeCompare(String(second.id));
  });
};

const messagesHaveSameShape = (firstMessages, secondMessages) => {
  if (firstMessages.length !== secondMessages.length) return false;

  return firstMessages.every((message, index) => {
    const nextMessage = secondMessages[index];
    return (
      String(message.id) === String(nextMessage.id) &&
      message.sender === nextMessage.sender &&
      message.text === nextMessage.text &&
      message.time === nextMessage.time &&
      Number(message.createdAtMs || 0) === Number(nextMessage.createdAtMs || 0) &&
      (message.images || []).length === (nextMessage.images || []).length
    );
  });
};

const conversationsHaveSameShape = (firstConversations, secondConversations) => {
  if (firstConversations.length !== secondConversations.length) return false;

  return firstConversations.every((conversation, index) => {
    const nextConversation = secondConversations[index];
    return (
      String(conversation.id) === String(nextConversation.id) &&
      conversation.name === nextConversation.name &&
      conversation.service === nextConversation.service &&
      conversation.time === nextConversation.time &&
      String(conversation.userId) === String(nextConversation.userId)
    );
  });
};

const getMessageFromPayload = (payload) => {
  if (!payload) return null;
  if (payload.id) return payload;
  if (payload.data?.id) return payload.data;
  if (payload.message?.id) return payload.message;
  return null;
};

const mergeMessagesIntoConversation = (setMessagesByConversation, conversationId, nextMessages) => {
  setMessagesByConversation((current) => {
    const currentMessages = current[conversationId] || [];
    const mergedMessages = mergeMessages(currentMessages, nextMessages);

    if (messagesHaveSameShape(currentMessages, mergedMessages)) return current;

    return {
      ...current,
      [conversationId]: mergedMessages,
    };
  });
};

export default function ClientMessages() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useUserMode();
  const { conversationId } = useParams();
  const contactId = searchParams.get("contact");
  const routeContact = location.state?.contact;
  const [conversations, setConversations] = useState([]);
  const activeConversation = conversations.find((conversation) => String(conversation.id) === conversationId);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [draft, setDraft] = useState("");
  const [images, setImages] = useState([]);
  const [panel, setPanel] = useState("");
  const [report, setReport] = useState({ reason: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [openingContact, setOpeningContact] = useState(false);
  const [visibleMessageLimits, setVisibleMessageLimits] = useState({});

  const messages = useMemo(
    () => (activeConversation ? messagesByConversation[activeConversation.id] || [] : []),
    [activeConversation, messagesByConversation]
  );
  const visibleMessageLimit = activeConversation
    ? visibleMessageLimits[activeConversation.id] || initialVisibleMessages
    : initialVisibleMessages;
  const displayedMessages = useMemo(
    () => messages.slice(Math.max(0, messages.length - visibleMessageLimit)),
    [messages, visibleMessageLimit]
  );
  const hiddenMessagesCount = Math.max(0, messages.length - displayedMessages.length);

  const loadConversations = useCallback(async () => {
    const payload = await getConversations();
    const items = asArray(payload).map((item) => normalizeConversation(item, user?.id));
    setConversations((current) => (conversationsHaveSameShape(current, items) ? current : items));
    return items;
  }, [user?.id]);

  const syncConversationMessages = useCallback(async (targetConversationId) => {
    const payload = await getConversationMessages(targetConversationId);
    const items = asArray(payload).map((item) => normalizeMessage(item, user?.id));

    mergeMessagesIntoConversation(setMessagesByConversation, targetConversationId, items);

    return items;
  }, [user?.id]);

  useEffect(() => {
    let active = true;
    let timerId;

    async function refreshConversations() {
      try {
        const items = await loadConversations();
        if (!active) return;

        if (conversationId) {
          const currentConversation = items.find((conversation) => String(conversation.id) === String(conversationId));
          const lastMessage = currentConversation?.raw?.last_message;
          if (lastMessage?.id) {
            mergeMessagesIntoConversation(setMessagesByConversation, currentConversation.id, [
              normalizeMessage(lastMessage, user?.id),
            ]);
          }
        }

        if (contactId && !conversationId) {
          const existingConversation = items.find((conversation) => String(conversation.userId) === String(contactId));
          if (existingConversation) {
            navigate(`/messages/${existingConversation.id}`, { replace: true });
          }
        }
      } catch {
        if (active) setConversations([]);
      }
    }

    refreshConversations();
    timerId = setInterval(refreshConversations, refreshIntervalMs);

    return () => {
      active = false;
      clearInterval(timerId);
    };
  }, [contactId, conversationId, loadConversations, navigate, user?.id]);

  useEffect(() => {
    if (!contactId || conversationId || openingContact) return;
    if (!user?.id) {
      navigate("/login");
      return;
    }

    const existingConversation = conversations.find((conversation) => String(conversation.userId) === String(contactId));
    if (existingConversation) {
      navigate(`/messages/${existingConversation.id}`, { replace: true });
      return;
    }

    let active = true;

    async function openContactConversation() {
      setOpeningContact(true);
      try {
        const payload = await createConversation({
          participantId: contactId,
          title: routeContact?.name ? `Discussion avec ${routeContact.name}` : "",
        });
        const conversation = normalizeConversation(payload?.conversation || payload?.data || payload, user.id);
        if (!active || !conversation.id) return;
        setConversations((current) => [conversation, ...current]);
        navigate(`/messages/${conversation.id}`, { replace: true });
      } catch (error) {
        const fallbackConversation = conversations.find((conversation) => String(conversation.userId) === String(contactId));
        if (fallbackConversation) {
          navigate(`/messages/${fallbackConversation.id}`, { replace: true });
          return;
        }
        alert(getApiMessage(error, "Impossible de démarrer la conversation. Le backend doit exposer POST /messagerie/conversations."));
      } finally {
        if (active) setOpeningContact(false);
      }
    }

    openContactConversation();

    return () => {
      active = false;
    };
  }, [contactId, conversationId, conversations, navigate, openingContact, routeContact?.name, user?.id]);

  useEffect(() => {
    if (!activeConversation) return undefined;
    let active = true;

    async function loadMessages({ silent = false } = {}) {
      if (!silent) setLoading(true);
      try {
        const payload = await getConversationMessages(activeConversation.id);
        const items = asArray(payload);
        if (active) {
          mergeMessagesIntoConversation(
            setMessagesByConversation,
            activeConversation.id,
            items.map((item) => normalizeMessage(item, user?.id))
          );
        }
      } catch {
        if (active) {
          setMessagesByConversation((current) => (
            current[activeConversation.id]
              ? current
              : { ...current, [activeConversation.id]: [] }
          ));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMessages();
    const timerId = setInterval(() => loadMessages({ silent: true }), refreshIntervalMs);

    return () => {
      active = false;
      clearInterval(timerId);
    };
  }, [activeConversation, user?.id]);

  const sendMessage = async (options = {}) => {
    const messageText = options.text ?? draft.trim();
    const messageImages = options.images ?? images;

    if (!messageText.trim() && messageImages.length === 0) return;
    if (!activeConversation) return;

    const media = [];
    const optimisticId = `local-${Date.now()}`;
    const optimisticCreatedAtMs = Date.now();
    const optimisticMessage = {
      id: optimisticId,
      sender: "me",
      text: messageText.trim(),
      images: messageImages,
      time: "maintenant",
      createdAtMs: optimisticCreatedAtMs,
    };

    setMessagesByConversation((current) => ({
      ...current,
      [activeConversation.id]: [...(current[activeConversation.id] || []), optimisticMessage],
    }));
    if (!options.keepComposer) {
      setDraft("");
      setImages([]);
    }

    try {
      for (const item of messageImages) {
        if (!item.file) continue;
        if (item.type === "audio") continue;

        const formData = new FormData();
        formData.append("media", item.file, item.name);
        const payload = await uploadMessageFile(formData);
        media.push(payload?.data || payload);
      }
    } catch (error) {
      setMessagesByConversation((current) => ({
        ...current,
        [activeConversation.id]: (current[activeConversation.id] || []).filter((message) => message.id !== optimisticId),
      }));
      alert(getApiMessage(error, "Impossible d'envoyer le fichier audio ou media."));
      return;
    }

    try {
      const messagePayload = {
        content: messageText.trim(),
        media,
      };
      const payload = await sendConversationMessage(activeConversation.id, messagePayload);

      const responseMessage = getMessageFromPayload(payload);
      const nextMessage = responseMessage
        ? normalizeMessage(responseMessage, user?.id)
        : {
            id: Date.now(),
            sender: "me",
            text: messageText.trim(),
            images: messageImages,
            time: "maintenant",
            createdAtMs: optimisticCreatedAtMs,
          };

      setMessagesByConversation((current) => ({
        ...current,
        [activeConversation.id]: mergeMessages(current[activeConversation.id] || [], [nextMessage])
          .filter((message) => message.id !== optimisticId),
      }));
      loadConversations().catch(() => {});
      syncConversationMessages(activeConversation.id).catch(() => {});
    } catch (error) {
      setMessagesByConversation((current) => ({
        ...current,
        [activeConversation.id]: (current[activeConversation.id] || []).filter((message) => message.id !== optimisticId),
      }));
      alert(getApiMessage(error, "Impossible d'envoyer le message."));
      return;
    }
  };

  const sendVoiceMessage = async (voiceNote) => {
    if (!activeConversation || !voiceNote?.file) return;

    const optimisticId = `local-voice-${Date.now()}`;
    const optimisticCreatedAtMs = Date.now();
    const optimisticMessage = {
      id: optimisticId,
      sender: "me",
      text: "",
      images: [voiceNote],
      time: "maintenant",
      createdAtMs: optimisticCreatedAtMs,
    };

    setMessagesByConversation((current) => ({
      ...current,
      [activeConversation.id]: [...(current[activeConversation.id] || []), optimisticMessage],
    }));

    try {
      const formData = new FormData();
      formData.append("voice_note", voiceNote.file, voiceNote.name);
      const uploadedVoiceNotePayload = await uploadVoiceNote(formData);
      const uploadedVoiceNote = uploadedVoiceNotePayload?.data || uploadedVoiceNotePayload;
      if (!uploadedVoiceNote?.file_path) {
        throw new Error("L'upload vocal n'a pas retourné de chemin de fichier.");
      }

      const messageFormData = new FormData();
      messageFormData.append("content", "");
      messageFormData.append("voice_note", JSON.stringify([uploadedVoiceNote]));

      const payload = await sendConversationMessage(activeConversation.id, messageFormData);
      const responseMessage = getMessageFromPayload(payload);
      const nextMessage = responseMessage
        ? normalizeMessage(responseMessage, user?.id)
        : {
            ...optimisticMessage,
            id: Date.now(),
          };

      setMessagesByConversation((current) => ({
        ...current,
        [activeConversation.id]: mergeMessages(current[activeConversation.id] || [], [nextMessage])
          .filter((message) => message.id !== optimisticId),
      }));
      loadConversations().catch(() => {});
      syncConversationMessages(activeConversation.id).catch(() => {});
    } catch (error) {
      setMessagesByConversation((current) => ({
        ...current,
        [activeConversation.id]: (current[activeConversation.id] || []).filter((message) => message.id !== optimisticId),
      }));
      alert(getApiMessage(error, "Impossible d'envoyer la note vocale."));
      throw error;
    }
  };

  const removeImage = (src) => {
    setImages((current) => current.filter((image) => image.src !== src));
  };

  const showOlderMessages = () => {
    if (!activeConversation) return;

    setVisibleMessageLimits((current) => ({
      ...current,
      [activeConversation.id]: Math.min(
        messages.length,
        (current[activeConversation.id] || initialVisibleMessages) + visibleMessagesStep
      ),
    }));
  };

  const submitReport = async () => {
    if (!activeConversation) return;
    if (!report.reason || !report.description.trim()) {
      alert("Veuillez choisir un motif et ajouter une description.");
      return;
    }

    try {
      await createComplaint({
        reason: report.reason,
        description: report.description.trim(),
        target: "user",
        targetId: activeConversation.userId,
        conversationId: activeConversation.id,
      });
      setReport({ reason: "", description: "" });
      setPanel("");
      alert("Signalement envoyé.");
    } catch (error) {
      alert(getApiMessage(error, "Impossible d'envoyer le signalement."));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-6 pb-8 pt-24 text-[#182433] sm:px-8 lg:px-10">
      {!activeConversation ? (
        <div className="overflow-hidden rounded-xl border border-[#eadfd3] bg-white shadow-sm">
          {openingContact && (
            <p className="border-b border-[#eadfd3] bg-[#eef6ff] px-5 py-3 text-sm font-extrabold text-[#145DA0]">
              Ouverture de la conversation...
            </p>
          )}
          <ConversationList
            conversations={conversations}
            activeId={null}
            onSelect={(conversation) => {
              setPanel("");
              navigate(`/messages/${conversation.id}`);
            }}
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#eadfd3] bg-white shadow-sm lg:grid lg:grid-cols-[390px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <ConversationList
              conversations={conversations}
              activeId={activeConversation.id}
              onSelect={(conversation) => {
                setPanel("");
                navigate(`/messages/${conversation.id}`);
              }}
            />
          </div>
          <div>
            <Link
              to="/messages"
              className="flex items-center gap-2 border-b border-[#eadfd3] bg-white px-5 py-3 text-sm font-extrabold text-[#145DA0] lg:hidden"
            >
              <ArrowLeft size={17} />
              Retour
            </Link>
            <ChatWindow
              conversation={activeConversation}
              messages={displayedMessages}
              hiddenMessagesCount={hiddenMessagesCount}
              loading={loading}
              draft={draft}
              images={images}
              panel={panel}
              report={report}
              onDraftChange={setDraft}
              onImagesChange={setImages}
              onRemoveImage={removeImage}
              onSend={sendMessage}
              onSendVoice={sendVoiceMessage}
              onShowOlderMessages={showOlderMessages}
              onPanelChange={setPanel}
              onReportChange={setReport}
              onSubmitReport={submitReport}
              onOpenService={() => navigate(`/messages/${activeConversation.id}/service`)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
