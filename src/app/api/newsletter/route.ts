import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getClientIP } from "@/lib/security";
import { newsletterWelcomeEmail, sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const rl = rateLimit(`newsletter:${ip}`, 3, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try later." }, { status: 429 });
  }

  let body: { email: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Check if already subscribed (upsert)
  const existing = await db.siteSetting.findUnique({ where: { key: `newsletter_${body.email.toLowerCase()}` } });
  if (existing) {
    return NextResponse.json({ success: true, alreadySubscribed: true });
  }

  await db.siteSetting.create({
    data: {
      key: `newsletter_${body.email.toLowerCase()}`,
      value: JSON.stringify({ email: body.email, subscribedAt: new Date().toISOString() }),
    },
  });

  await sendEmail({ email: body.email }, newsletterWelcomeEmail({ email: body.email }));

  return NextResponse.json({ success: true });
}
