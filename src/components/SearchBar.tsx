"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2">
        <span className="pr-2 text-slate-400">🔎</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name or loan account number..."
          className="w-full border-0 bg-transparent text-sm text-slate-700 focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
