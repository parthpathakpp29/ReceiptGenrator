import { ILoanRecord } from "@/types";
import { numberToWords } from "@/lib/numberToWords";

type Props = {
  member: ILoanRecord;
  receiptNumber: string;
  receiptDate: string;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

export default function Receipt({ member, receiptNumber, receiptDate }: Props) {
  const principal = Number(member.principal || 0);
  const interest = Number(member.interest || 0);
  const total = principal + interest;
  const amountWords = numberToWords(total).replace("Rupees", "").trim();

  return (
    <div
      id="receipt-printable"
      className="mx-auto min-h-[640px] max-w-[900px] border border-gray-300 bg-white p-8 text-gray-900"
    >
      <div className="mx-auto max-w-[780px]">
        <h1 className="text-center text-2xl font-bold leading-tight">
          जम्बू ब्राह्मण साख सहकारी संस्था मर्यादित, खरगोन
        </h1>
        <h2 className="mt-2 text-center text-2xl font-bold tracking-wide">RECEIPT</h2>

        <div className="mt-6 grid grid-cols-3 gap-6 text-[16px]">
          <div className="space-y-2">
            <p>
              प. क्र. : <span className="font-medium">{receiptNumber}</span>
            </p>
            <p>
              रसीद नं.: <span className="font-medium">{member.loanAccountNumber || "-"}</span>
            </p>
            <p>
              नाम: <span className="font-medium">{member.name}</span>
            </p>
          </div>

          <div className="flex items-end">
            <p>
              पिता/पति: <span className="font-medium">{member.fatherName || "-"}</span>
            </p>
          </div>

          <div className="space-y-2 text-right">
            <p>Print Date: {receiptDate}</p>
            <p>दिनांक: {receiptDate}</p>
          </div>
        </div>

        <table className="mt-8 w-full border-collapse text-[17px]">
          <thead>
            <tr className="border-y border-gray-700">
              <th className="py-2 text-left font-semibold">विवरण</th>
              <th className="py-2 text-right font-semibold">राशि</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">मूलधन</td>
              <td className="py-2 text-right">{formatCurrency(principal)}</td>
            </tr>
            <tr>
              <td className="py-2">ब्याज</td>
              <td className="py-2 text-right">{formatCurrency(interest)}</td>
            </tr>
            <tr className="border-b border-gray-700 font-bold">
              <td className="py-2">कुल</td>
              <td className="py-2 text-right">{formatCurrency(total)}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-5 space-y-2 text-[17px]">
          <p>Rs. {amountWords} Only.</p>
          <p>ऋण शेष राशि: {Number(member.balance || 0).toFixed(2)}</p>
        </div>

        <div className="mt-24 text-left">
          <div className="mb-3 h-10 w-48 border-b border-gray-500" />
          <p className="text-[16px]">हस्ताक्षर प्राप्तकर्ता</p>
        </div>
      </div>
    </div>
  );
}
