import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ChatWindow from "../../components/messaging/ChatWindow";
import ConversationList from "../../components/messaging/ConversationList";
import { createComplaint } from "../../services/adminService";
import {
  getConversationMessages,
  getConversations,
  sendMessage as sendConversationMessage,
  uploadMessageFile,
  uploadVoiceNote,
} from "../../services/messageService";
import { getStorageUrl } from "../../services/apiClient";
import { useUserMode } from "../../context/useUserMode";
import profileAvatar from "../../assets/images/profile-avatar.svg";

const mediaKind = (media) => media.kind || (media.mime_type?.startsWith("video/") ? "video" : media.mime_type?.startsWith("audio/") ? "audio" : "image");

const normalizeConversation = (conversation, currentUserId) => {
  const otherUser = (conversation.users || []).find((item) => Number(item.id) !== Number(currentUserId)) || conversation.users?.[0] || {};
  const lastMessage = conversation.last_message || {};

  return {
    id: conversation.id,
    name: otherUser.name || conversation.title || "Conversation",
    avatar: getStorageUrl(otherUser.photo) || profileAvatar,
    service: lastMessage.content || conversation.type || "",
    time: conversation.updated_at ? new Date(conversation.updated_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "",
    userId: otherUser.id,
    userType: otherUser.statut || otherUser.role,
    raw: conversation,
  };
};

const normalizeMessage = (message, currentUserId) => ({
  id: message.id,
  sender: Number(message.expediteur_id) === Number(currentUserId) ? "me" : "other",
  text: message.content || "",
  images: (message.media || []).map((media) => ({
    name: media.original_name || media.file_name || media.name || "media",
    src: media.url || getStorageUrl(media.file_path || media.path),
    type: mediaKind(media) === "voice_note" ? "audio" : mediaKind(media),
  })),
  time: message.created_at ? new Date(message.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "",
});

export default function ClientMessages() {
  const navigate = useNavigate();
  const { user } = useUserMode();
  const { conversationId } = useParams();
  const [conversations, setConversations] = useState([]);
  const activeConversation = conversations.find((conversation) => String(conversation.id) === conversationId);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [draft, setDraft] = useState("");
  const [images, setImages] = useState([]);
  const [panel, setPanel] = useState("");
  const [report, setReport] = useState({ reason: "", description: "" });
  const [loading, setLoading] = useState(false);

  const messages = activeConversation
    ? messagesByConversation[activeConversation.id] || []
    : [];

  useEffect(() => {
    let active = true;

    async function loadConversations() {
      try {
        const payload = await getConversations();
        const items = Array.isArray(payload) ? payload : payload?.data || [];
        if (active) setConversations(items.map((item) => normalizeConversation(item, user?.id)));
      } catch {
        if (active) setConversations([]);
      }
    }

    loadConversations();

    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!activeConversation) return undefined;
    let active = true;

    async function loadMessages() {
      setLoading(true);
      try {
        const payload = await getConversationMessages(activeConversation.id);
        const items = Array.isArray(payload) ? payload : payload?.data || [];
        if (active) {
          setMessagesByConversation((current) => ({
            ...current,
            [activeConversation.id]: items.map((item) => normalizeMessage(item, user?.id)),
          }));
        }
      } catch {
        if (active) {
          setMessagesByConversation((current) => ({ ...current, [activeConversation.id]: [] }));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMessages();

    return () => {
      active = false;
    };
  }, [activeConversation, user?.id]);

  const sendMessage = async () => {
    if (!draft.trim() && images.length === 0) return;
    if (!activeConversation) return;

    const media = [];
    const voiceNotes = [];

    for (const item of images) {
      if (!item.file) continue;
      const formData = new FormData();
      formData.append(item.type === "audio" ? "voice_note" : "media", item.file, item.name);
      const payload = item.type === "audio"
        ? await uploadVoiceNote(formData)
        : await uploadMessageFile(formData);

      if (item.type === "audio") {
        voiceNotes.push(payload?.data || payload);
      } else {
        media.push(payload?.data || payload);
      }
    }

    const payload = await sendConversationMessage(activeConversation.id, {
      content: draft.trim(),
      media,
      voice_note: voiceNotes,
    });

    const nextMessage = payload?.data
      ? normalizeMessage(payload.data, user?.id)
      : {
          id: Date.now(),
          sender: "me",
          text: draft.trim(),
          images,
          time: "maintenant",
        };

    setMessagesByConversation((current) => ({
      ...current,
      [activeConversation.id]: [...(current[activeConversation.id] || []), nextMessage],
    }));
    setDraft("");
    setImages([]);
  };

  const removeImage = (src) => {
    setImages((current) => current.filter((image) => image.src !== src));
  };

  const submitReport = async () => {
    if (!activeConversation) return;

    await createComplaint({
      reason: report.reason,
      description: report.description,
      target: "user",
      targetId: activeConversation.userId,
    });
    setReport({ reason: "", description: "" });
    setPanel("");
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-6 pb-8 pt-24 text-[#182433] sm:px-8 lg:px-10">
      {!activeConversation ? (
        <div className="overflow-hidden rounded-xl border border-[#eadfd3] bg-white shadow-sm">
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
              messages={loading ? [] : messages}
              draft={draft}
              images={images}
              panel={panel}
              report={report}
              onDraftChange={setDraft}
              onImagesChange={setImages}
              onRemoveImage={removeImage}
              onSend={sendMessage}
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
