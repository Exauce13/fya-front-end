import { ChevronDown } from "lucide-react";

export default function SearchFilters({ title, children }) {
  return (
    <div className="border-b border-[#eadfd3] py-5 last:border-b-0">
      <button className="flex w-full items-center justify-between text-left text-sm font-extrabold text-[#182433]">
        {title}
        <ChevronDown size={16} className="text-gray-400" />
      </button>
      <div className="mt-4 space-y-3 text-sm text-gray-600">{children}</div>
    </div>
  );
}

export function SelectFilter({ label, value = "", options = [], onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="min-h-11 w-full appearance-none rounded-lg border border-[#eadfd3] bg-white px-3 pr-9 text-sm font-medium text-gray-600 outline-none focus:border-[#C96B2C]"
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}

export function RadioFilter({ label, active = false }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <span
        className={`grid h-4 w-4 place-items-center rounded-full border ${
          active ? "border-[#C96B2C]" : "border-gray-300"
        }`}
      >
        {active && <span className="h-2 w-2 rounded-full bg-[#C96B2C]" />}
      </span>
      <span>{label}</span>
    </label>
  );
}

export function CheckboxFilter({ label, checked = false, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <span
        className={`grid h-5 w-5 place-items-center rounded-md border ${
          checked ? "border-[#C96B2C] bg-[#C96B2C]" : "border-gray-300 bg-white"
        }`}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-sm bg-white" />}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        className="sr-only"
      />
      <span>{label}</span>
    </label>
  );
}
