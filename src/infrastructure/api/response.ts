import { NextResponse } from "next/server";

export function successResponse(data: any, meta: Record<string, any> = {}, status = 200) {
  return NextResponse.json(
    {
      data,
      meta,
    },
    { status }
  );
}

export function errorResponse(code: string, message: string, details: any[] = [], status = 400) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}
