// src/app/api/members/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import LoanRecord from "@/models/LoanRecord";
import { ApiResponse, SearchResult } from "@/types";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const query  = searchParams.get("q")?.trim() || "";
    const page   = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit  = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const skip   = (page - 1) * limit;

    // ── Build the MongoDB filter ──────────────────────────────
    // Use regex search for better Hindi/Unicode support.
    let filter: object = {};

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const queryRegex = new RegExp(escapedQuery, "i");

    if (query.length > 0) {
      filter = {
        $or: [
          { name: queryRegex },
          { fatherName: queryRegex },
          { loanAccountNumber: queryRegex },
        ],
      };
    }
    // Empty query → return all records (paginated)

    const [records, total] = await Promise.all([
      LoanRecord.find(filter)
        .select("name fatherName loanAccountNumber loanStartDate balance")
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(), // lean() returns plain objects — faster, less memory
      LoanRecord.countDocuments(filter),
    ]);

    return NextResponse.json<ApiResponse<SearchResult>>(
      {
        success: true,
        data: {
          data: records as never,
          total,
          page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Members search error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}