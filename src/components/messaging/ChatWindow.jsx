import { MoreHorizontal } from "lucide-react";

import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import UserNameLink from "../ui/UserNameLink";

export default function ChatWindow({
  conversation,
  messages,
  hiddenMessagesCount = 0,
  draft,
  images,
  panel,
  report,
  loading = false,
  onDraftChange,
  onImagesChange,
  onRemoveImage,
  onSend,
  onSendVoice,
  onShowOlderMessages,
  onPanelChange,
  onReportChange,
  onSubmitReport,
  onOpenService,
}) {
  if (!conversation) {
    return (
      <section className="grid min-h-[640px] place-items-center rounded-r-xl bg-white text-sm font-semibold text-gray-500">
        Sélectionnez une conversation.
      </section>
    );
  }

  return (
    <section className="flex h-[calc(100vh-7.5rem)] min-h-[620px] flex-col rounded-r-xl bg-white">
      <header className="relative flex items-center justify-between border-b border-[#eadfd3] px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={conversation.avatar} alt={conversation.name} className="h-14 w-14 rounded-full object-cover" />
          <div>
            <h2 className="text-xl font-extrabold text-[#182433]">
              <UserNameLink
                name={conversation.name}
                id={conversation.profileId || conversation.userId}
                type={conversation.userType}
                state={conversation.profileState || { userId: conversation.userId }}
              >
                {conversation.name}
              </UserNameLink>
            </h2>
          </div>
        </div>
        <button
          onClick={() => onPanelChange(panel === "menu" ? "" : "menu")}
          className="grid h-10 w-10 place-items-center rounded-lg text-gray-600 transition hover:bg-[#fbfaf8]"
        >
          <MoreHorizontal />
        </button>

        {panel === "menu" && (
          <div className="absolute right-6 top-16 z-10 w-56 rounded-lg border border-[#eadfd3] bg-white p-2 shadow-xl">
            <button
              onClick={() => {
                onPanelChange("");
                onOpenService();
              }}
              className="w-full rounded-md px-3 py-2 text-left text-sm font-extrabold text-[#182433] hover:bg-[#fbfaf8]"
            >
              Service
            </button>
            <button
              onClick={() => onPanelChange("report")}
              className="w-full rounded-md px-3 py-2 text-left text-sm font-extrabold text-red-600 hover:bg-red-50"
            >
              Signaler l'utilisateur
            </button>
          </div>
        )}
      </header>

      {panel === "report" && (
        <div className="border-b border-[#eadfd3] p-5">
          <ReportForm
            report={report}
            onReportChange={onReportChange}
            onSubmitReport={onSubmitReport}
          />
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto bg-[#fffdf9] p-4 sm:p-6">
        {hiddenMessagesCount > 0 && (
          <div className="sticky top-0 z-[1] flex justify-center pb-2">
            <button
              type="button"
              onClick={onShowOlderMessages}
              className="rounded-full border border-[#d9e8f4] bg-white/95 px-4 py-2 text-xs font-extrabold text-[#145DA0] shadow-sm backdrop-blur transition hover:border-[#145DA0] hover:bg-[#eef6ff]"
            >
              Voir plus de messages
            </button>
          </div>
        )}
        {loading && messages.length === 0 && (
          <p className="rounded-lg bg-white px-4 py-3 text-sm font-bold text-gray-500 shadow-sm">
            Chargement des messages...
          </p>
        )}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <ChatInput
        text={draft}
        images={images}
        onTextChange={onDraftChange}
        onImagesChange={onImagesChange}
        onRemoveImage={onRemoveImage}
        onSend={onSend}
        onSendVoice={onSendVoice}
      />
    </section>
  );
}

function ReportForm({ report, onReportChange, onSubmitReport }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmitReport();
      }}
      className="max-w-md rounded-xl border border-red-100 bg-white p-4"
    >
      <h3 className="text-lg font-extrabold text-red-600">Signaler un utilisateur</h3>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-extrabold text-[#182433]">Motif du signalement</span>
        <select
          value={report.reason}
          onChange={(event) => onReportChange({ ...report, reason: event.target.value })}
          className="h-11 w-full rounded-lg border border-[#eadfd3] px-3 text-sm outline-none focus:border-red-500"
        >
          <option value="">Sélectionnez un motif</option>
          <option value="spam">Spam ou comportement abusif</option>
          <option value="fraude">Suspicion de fraude</option>
          <option value="harcelement">Harcèlement</option>
          <option value="autre">Autre</option>
        </select>
      </label>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-extrabold text-[#182433]">Description</span>
        <textarea
          value={report.description}
          onChange={(event) => onReportChange({ ...report, description: event.target.value })}
          rows={4}
          className="w-full resize-none rounded-lg border border-[#eadfd3] px-3 py-3 text-sm outline-none focus:border-red-500"
          placeholder="Décrivez le problème rencontré..."
        />
      </label>
      <button className="mt-4 min-h-11 w-full rounded-lg bg-red-600 text-sm font-extrabold text-white transition hover:bg-red-700">
        Envoyer le signalement
      </button>
    </form>
  );
}
