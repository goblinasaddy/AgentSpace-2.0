import { NextRequest } from "next/server";
import { getVerificationReport } from "@/modules/verification/service";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const report = await getVerificationReport(id);

    if (!report) {
      return errorResponse("NOT_FOUND", "Verification report not found", [], 404);
    }

    return successResponse(report);
  } catch (err: any) {
    return errorResponse("FETCH_REPORT_FAILED", err.message || "Failed to fetch verification report", [], 500);
  }
}
