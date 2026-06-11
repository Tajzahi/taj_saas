import { NextResponse } from "next/server";

export async function GET() {
  console.log("Memicu server-side error untuk Sentry...");
  throw new Error("Sentry Server-Side Test Error dari Customer App!");
  return NextResponse.json({ success: true });
}
