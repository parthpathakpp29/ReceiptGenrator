import UploadForm from "@/components/UploadForm";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="section-card p-7">
        <h1 className="text-2xl font-bold text-slate-900">Upload Loan Excel</h1>
        <p className="mt-2 text-sm text-slate-600">
          Use the same column names from your source file. Existing members are updated,
          new rows are inserted automatically.
        </p>
        <div className="mt-6">
          <UploadForm />
        </div>
      </div>
    </div>
  );
}
