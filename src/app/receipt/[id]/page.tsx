import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import LoanRecord from "@/models/LoanRecord";
import Receipt from "@/components/Receipt";
import PrintButton from "@/components/PrintButton";

type Props = {
  params: Promise<{ id: string }>;
};

function todayDDMMYYYY() {
  const date = new Date();
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export default async function ReceiptPage({ params }: Props) {
  const { id } = await params;
  await connectDB();

  const member = await LoanRecord.findById(id).lean();
  if (!member) notFound();

  const receiptNumber = `NMR/KRGN/${member.loanAccountNumber || member._id.toString().slice(-6)}`;
  const receiptDate = todayDDMMYYYY();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Receipt Preview</h1>
          <p className="text-sm text-slate-600">Verify details, then print or download PDF.</p>
        </div>
        <PrintButton />
      </div>
      <Receipt
        member={{
          _id: member._id.toString(),
          name: member.name,
          fatherName: member.fatherName,
          loanAccountNumber: member.loanAccountNumber,
          loanStartDate: member.loanStartDate,
          principal: member.principal,
          interest: member.interest,
          dueAmount: member.dueAmount,
          balance: member.balance,
        }}
        receiptNumber={receiptNumber}
        receiptDate={receiptDate}
      />
    </div>
  );
}
