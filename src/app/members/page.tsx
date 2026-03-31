"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import MemberCard from "@/components/MemberCard";
import { ILoanRecord } from "@/types";

type MemberApiResponse = {
  success: boolean;
  data?: {
    data: ILoanRecord[];
    total: number;
    page: number;
    limit: number;
  };
  error?: string;
};

export default function MembersPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<ILoanRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `/api/members?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
          {
          signal: controller.signal,
          }
        );
        const json = (await res.json()) as MemberApiResponse;
        if (!json.success || !json.data) {
          setMembers([]);
          setTotal(0);
          setError(json.error || "Unable to fetch members.");
          return;
        }
        setMembers(json.data.data);
        setTotal(json.data.total);
      } catch {
        if (!controller.signal.aborted) {
          setError("Unable to fetch members.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="section-card p-6">
        <h1 className="text-2xl font-bold text-slate-900">Members</h1>
        <p className="mt-1 text-sm text-slate-600">
          Search by member name, father name, or loan account number.
        </p>
        <div className="mt-4">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        {loading && <p className="mt-4 text-sm text-slate-600">Loading members...</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {!error && (
          <p className="mt-4 text-sm text-slate-600">
            Showing {members.length} of {total} members (Page {page} of {totalPages})
          </p>
        )}

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {members.map((member) => (
            <MemberCard key={member._id} member={member} />
          ))}
        </div>

        {!error && totalPages > 1 && (
          <div className="mt-6 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1 || loading}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages || loading}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {!loading && !error && members.length === 0 && (
          <p className="mt-6 text-sm text-slate-500">No members found.</p>
        )}
      </div>
    </div>
  );
}
