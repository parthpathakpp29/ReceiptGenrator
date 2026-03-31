import Link from "next/link";
import { ILoanRecord } from "@/types";

type Props = {
  member: ILoanRecord;
};

export default function MemberCard({ member }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
      <p className="mt-1 text-sm text-slate-600">Father: {member.fatherName || "-"}</p>
      <p className="text-sm text-slate-600">Loan A/C: {member.loanAccountNumber || "-"}</p>
      <p className="mt-2 inline-block rounded bg-slate-100 px-2 py-1 text-sm font-medium text-slate-700">
        Balance: Rs. {member.balance?.toFixed(2) ?? "0.00"}
      </p>

      
    

<div className="mt-3">
  <Link
    href={`/receipt/${member._id}`}
    className="inline-block rounded-md bg-slate-800 px-3 py-1.5 text-sm font-semibold !text-white hover:bg-black"
  >
    Generate Receipt
  </Link>
</div>
    </div>
  );
}
