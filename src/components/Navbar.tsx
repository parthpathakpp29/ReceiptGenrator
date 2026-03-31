// src/components/Navbar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/",        label: "Dashboard" },
  { href: "/upload",  label: "Upload Excel" },
  { href: "/members", label: "Members" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur print:hidden">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏦</span>
          <span className="font-semibold text-slate-800">Loan Receipt System</span>
        </div>

        <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                pathname === href
                  ? "bg-white text-slate-900 shadow-sm font-medium"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}