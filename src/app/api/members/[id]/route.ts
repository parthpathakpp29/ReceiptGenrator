// src/app/api/members/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import LoanRecord from "@/models/LoanRecord";
import { ApiResponse, ILoanRecord } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate MongoDB ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Invalid member ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const record = await LoanRecord.findById(id).lean();

    if (!record) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<ILoanRecord>>(
      { success: true, data: record as unknown as ILoanRecord },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Member fetch error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}