// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import LoanRecord from "@/models/LoanRecord";
import { parseExcelBuffer } from "@/lib/parseExcel";
import { ApiResponse } from "@/types";
import UploadHistory from "@/models/UploadHistory";

export async function POST(req: NextRequest) {
  let fileName = "unknown";
  try {
    // ── 1. Parse the multipart form ──────────────────────────
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }
    fileName = file.name;

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Only .xlsx or .xls files are allowed" },
        { status: 400 }
      );
    }

    // Limit: 10 MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "File size must be under 10 MB" },
        { status: 400 }
      );
    }

    // ── 2. Convert File → Buffer ──────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ── 3. Parse Excel rows ───────────────────────────────────
    const { records, missingHeaders } = parseExcelBuffer(buffer);

    if (missingHeaders.length > 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: `Missing required columns: ${missingHeaders.join(", ")}`,
        },
        { status: 422 }
      );
    }

    if (records.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error:
            "No valid records found. Check that your Excel has the correct column headers: MEMBER_NAME, FATHER_NAME, LOAN_ACCOUNT_NUMBER, LOAN_START_DATE, PRINCIPLE_AMOUNT, INTEREST_AMOUNT, DUE_AMOUNT, BALANCE_AMOUNT",
        },
        { status: 422 }
      );
    }

    // ── 4. Connect to DB ──────────────────────────────────────
    await connectDB();

    // ── 5. Bulk upsert (update if account number exists, else insert) ──
    // This means re-uploading the same file won't create duplicates
    const bulkOps = records.map((record) => {
      const { _id: _ignored, ...recordWithoutId } = record;
      return {
        updateOne: {
          filter: {
            // Match by account number if available, else by name
            ...(record.loanAccountNumber
              ? { loanAccountNumber: record.loanAccountNumber }
              : { name: record.name }),
          },
          update: { $set: recordWithoutId },
          upsert: true, // insert if not found
        },
      };
    });

    const result = await LoanRecord.bulkWrite(bulkOps, {
      ordered: false,
      bypassDocumentValidation: false,
    });

    await UploadHistory.create({
      fileName,
      totalParsed: records.length,
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
      status: "success",
    });

    return NextResponse.json<ApiResponse<object>>(
      {
        success: true,
        message: `Upload successful`,
        data: {
          totalParsed: records.length,
          inserted: result.upsertedCount,
          updated: result.modifiedCount,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Upload error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";

    try {
      await connectDB();
      await UploadHistory.create({
        fileName,
        totalParsed: 0,
        inserted: 0,
        updated: 0,
        status: "failed",
        errorMessage: message,
      });
    } catch {
      // Ignore logging failure so original error can still be returned.
    }

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}