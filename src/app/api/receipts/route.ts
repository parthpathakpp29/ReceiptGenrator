// src/app/api/receipts/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ReceiptHistory from "@/models/ReceiptHistory";
import { ApiResponse, IReceipt } from "@/types";
import { numberToWords } from "@/lib/numberToWords";
import Counter from "@/models/Counter";

// ── Auto receipt number generator ────────────────────────────
// Format: RCP-YYYYMMDD-XXXX  e.g. RCP-20260331-0042
async function generateReceiptNumber(): Promise<string> {
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, "");
  const counterKey = `receipt:${datePart}`;

  const counter = await Counter.findOneAndUpdate(
    { key: counterKey },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  const seq = String(counter?.seq ?? 1).padStart(4, "0");
  return `RCP-${datePart}-${seq}`;
}

function normalizeDate(date: string | undefined): string {
  if (!date) {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }
  return date;
}

// ── POST: Save a new receipt ──────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      loanRecordId,
      memberName,
      fatherName,
      loanAccountNumber,
      date,
      principal,
      interest,
      balance,
    } = body;

    // Basic validation
    if (!loanRecordId || !memberName) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "loanRecordId and memberName are required" },
        { status: 400 }
      );
    }

    const principalAmount = Number(principal);
    const interestAmount = Number(interest);
    const balanceAmount = Number(balance);
    if (
      Number.isNaN(principalAmount) ||
      Number.isNaN(interestAmount) ||
      Number.isNaN(balanceAmount)
    ) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "principal, interest, and balance must be numbers" },
        { status: 400 }
      );
    }

    const total = principalAmount + interestAmount;
    const amountInWords = numberToWords(total);
    const receiptNumber = await generateReceiptNumber();
    const receiptDate = normalizeDate(date);

    const receipt = await ReceiptHistory.create({
      loanRecordId,
      receiptNumber,
      memberName,
      fatherName,
      loanAccountNumber,
      date: receiptDate,
      principal: principalAmount,
      interest: interestAmount,
      total,
      balance: balanceAmount,
      amountInWords,
    });

    return NextResponse.json<ApiResponse<IReceipt>>(
      {
        success: true,
        message: "Receipt saved successfully",
        data: receipt.toObject() as unknown as IReceipt,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Receipt save error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── GET: Fetch receipt history (date filter + pagination) ─────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const loanRecordId = searchParams.get("loanRecordId") || "";
    const from         = searchParams.get("from") || ""; // YYYY-MM-DD
    const to           = searchParams.get("to")   || "";
    const page         = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit        = Math.min(50, parseInt(searchParams.get("limit") || "10"));
    const skip         = (page - 1) * limit;

    // Build filter dynamically
    const filter: Record<string, unknown> = {};

    if (loanRecordId) filter.loanRecordId = loanRecordId;

    if (from || to) {
      filter.createdAt = {
        ...(from ? { $gte: new Date(from) } : {}),
        ...(to   ? { $lte: new Date(to + "T23:59:59") } : {}),
      };
    }

    const [receipts, total] = await Promise.all([
      ReceiptHistory.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReceiptHistory.countDocuments(filter),
    ]);

    return NextResponse.json<ApiResponse<object>>(
      {
        success: true,
        data: { receipts, total, page, limit },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Receipt history error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}