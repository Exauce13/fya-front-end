import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ChatWindow from "../../components/messaging/ChatWindow";
import ConversationList from "../../components/messaging/ConversationList";
import { conversations, initialMessages } from "../../data/conversationsData";

export default function ClientMessages() {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const activeConversation = conversations.find(
    (conversation) => String(conversation.id) === conversationId
  );
  const [messagesByConversation, setMessagesByConversation] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [images, setImages] = useState([]);
  const [panel, setPanel] = useState("");
  const [report, setReport] = useState({ reason: "", description: "" });

  const messages = activeConversation
    ? messagesByConversation[activeConversation.id] || []
    : [];

  const sendMessage = () => {
    if (!draft.trim() && images.length === 0) return;

    const nextMessage = {
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

  const submitReport = () => {
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
              messages={messages}
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
