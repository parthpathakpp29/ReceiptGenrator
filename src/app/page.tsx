// src/app/page.tsx
import Link from "next/link";

export default function Dashboard() {
  const cards = [
    {
      href: "/upload",
      icon: "Upload",
      title: "Upload Excel",
      desc: "Import loan master data from your .xlsx or .xls file.",
      color: "from-blue-500/15 to-blue-50 border-blue-200",
    },
    {
      href: "/members",
      icon: "Search",
      title: "Search Members",
      desc: "Find members quickly and open printable receipts.",
      color: "from-emerald-500/15 to-emerald-50 border-emerald-200",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="section-card p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Loan Receipt Generator</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Simple workflow: upload Excel once, search members by name/account number,
          and print the receipt in traditional format.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {cards.map(({ href, icon, title, desc, color }) => (
          <Link
            key={href}
            href={href}
            className={`group rounded-xl border bg-gradient-to-br p-6 transition hover:-translate-y-0.5 hover:shadow-md ${color}`}
          >
            <div className="inline-flex rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
              {icon}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-800">{title}</h2>
            <p className="mt-1 text-sm text-slate-600">{desc}</p>
            <p className="mt-4 text-sm font-medium text-slate-800 group-hover:underline">
              Open section →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}