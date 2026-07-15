import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://pbvxnimctxwmpxlqkcsm.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidnhuaW1jdHh3bXB4bHFrY3NtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzg4NDc4OCwiZXhwIjoyMDk5NDYwNzg4fQ.0LaWkyfs8N2k3NCeD0_3OCPdSGPM6HXpHTrO4USJI14";

const headers: Record<string, string> = {
  "apikey": SERVICE_KEY,
  "Authorization": `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation",
};

const baseUrl = `${SUPABASE_URL}/rest/v1`;

async function supabaseFetch<T = any>(table: string, options: {
  select?: string; filter?: string; order?: string; limit?: number; method?: string; body?: any;
} = {}): Promise<T> {
  const { select = "*", filter, order, limit, method = "GET", body } = options;
  let url = `${baseUrl}/${table}?select=${encodeURIComponent(select)}`;
  if (filter) url += `&${filter}`;
  if (order) url += `&order=${encodeURIComponent(order)}`;
  if (limit) url += `&limit=${limit}`;
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) { const e = await res.text(); throw new Error(`Supabase: ${e}`); }
  if (method === "DELETE") return [] as T;
  return res.json();
}

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
      return NextResponse.json({ success: true, data: map });
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
