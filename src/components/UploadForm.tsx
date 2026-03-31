"use client";

import { FormEvent, useState } from "react";

type UploadResponse = {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    totalParsed: number;
    inserted: number;
    updated: number;
  };
};

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setResult({ success: false, error: "Please choose an Excel file." });
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as UploadResponse;
      setResult(data);
    } catch {
      setResult({ success: false, error: "Upload failed. Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">Excel file</label>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-black"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Uploading..." : "Upload & Save"}
      </button>

      {result && (
        <div
          className={`rounded-md p-3 text-sm ${
            result.success
              ? "border border-green-200 bg-green-50 text-green-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {result.success ? (
            <div className="space-y-1">
              <p>{result.message || "Upload completed."}</p>
              {result.data && (
                <p>
                  Parsed: {result.data.totalParsed} | Inserted: {result.data.inserted} |
                  Updated: {result.data.updated}
                </p>
              )}
            </div>
          ) : (
            <p>{result.error || "Something went wrong."}</p>
          )}
        </div>
      )}
    </form>
  );
}
