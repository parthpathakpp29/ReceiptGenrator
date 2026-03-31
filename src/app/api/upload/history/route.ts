import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UploadHistory from "@/models/UploadHistory";
import { ApiResponse } from "@/types";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      UploadHistory.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UploadHistory.countDocuments({}),
    ]);

    return NextResponse.json<ApiResponse<object>>(
      {
        success: true,
        data: {
          data: items,
          total,
          page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
