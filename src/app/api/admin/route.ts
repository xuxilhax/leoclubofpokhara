import { NextRequest, NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase-db";
import { DEFAULT_CONTENT } from "@/lib/site-content-defaults";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, table, data, id } = body;

    if (action === "saveContent") {
      for (const [key, value] of Object.entries(data)) {
        const existing = await supabaseFetch("SiteSetting", { filter: `key=eq.${key}`, select: "id" });
        if (existing.length > 0) {
          await supabaseFetch("SiteSetting", { method: "PATCH", filter: `key=eq.${key}`, body: { value: String(value) } });
        } else {
          await supabaseFetch("SiteSetting", { method: "POST", body: { key, value: String(value) } });
        }
      }
      return NextResponse.json({ success: true });
    }

    if (action === "create") {
      const result = await supabaseFetch(table, { method: "POST", body: data });
      return NextResponse.json({ success: true, data: result });
    }

    if (action === "update") {
      const result = await supabaseFetch(table, { method: "PATCH", filter: `id=eq.${id}`, body: data });
      return NextResponse.json({ success: true, data: result });
    }

    if (action === "delete") {
      await supabaseFetch(table, { method: "DELETE", filter: `id=eq.${id}` });
      return NextResponse.json({ success: true });
    }

    if (action === "getSettings") {
      const rows = await supabaseFetch("SiteSetting");
      const map: Record<string, string> = {};
      for (const r of rows) map[r.key] = r.value;
      return NextResponse.json({ success: true, data: { ...DEFAULT_CONTENT, ...map } });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[Admin API] Error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const table = request.nextUrl.searchParams.get("table");
  if (!table) return NextResponse.json({ error: "Missing table" }, { status: 400 });
  try {
    const result = await supabaseFetch(table, { order: "createdAt.desc" });
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}
