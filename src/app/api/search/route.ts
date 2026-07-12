import { NextRequest, NextResponse } from "next/server";
import { searchSite } from "@/lib/search";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  if (q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }
  const results = await searchSite(q);
  // Serialize dates
  const serialized = results.map((r) => ({
    ...r,
    date: r.date ? new Date(r.date).toISOString() : undefined,
  }));
  return NextResponse.json({ results: serialized });
}
