import { Search } from "lucide-react";

export default function ConversationList({ conversations, activeId, onSelect }) {
  return (
    <aside className="rounded-l-xl border-r border-[#eadfd3] bg-white">
      <div className="border-b border-[#eadfd3] p-6">
        <h1 className="text-2xl font-extrabold text-[#182433]">Messagerie</h1>
        <label className="mt-6 flex min-h-12 items-center gap-3 rounded-lg border border-[#eadfd3] px-4 text-sm text-gray-500">
          <Search size={18} />
          <input
            className="w-full bg-transparent outline-none"
            placeholder="Rechercher une conversation..."
          />
        </label>
      </div>

      <div className="p-3">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation)}
            className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
              activeId === conversation.id ? "bg-[#eef6ff]" : "hover:bg-[#fbfaf8]"
            }`}
          >
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="h-14 w-14 rounded-full object-cover"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-3">
                <strong className="truncate text-sm text-[#182433]">{conversation.name}</strong>
                <span className="text-xs font-semibold text-gray-400">{conversation.time}</span>
              </span>
              <span className="mt-1 block truncate text-xs font-semibold text-gray-500">
                {conversation.service}
              </span>
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
