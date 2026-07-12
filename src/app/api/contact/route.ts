import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getClientIP } from "@/lib/security";
import {
  contactAcknowledgementEmail,
  contactAdminNotificationEmail,
  sendEmail,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);

  // Rate limit: 5 submissions per hour per IP
  const rl = rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  let body: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Validate
  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (body.message.length < 10) {
    return NextResponse.json({ error: "Message must be at least 10 characters" }, { status: 400 });
  }

  // Persist to database
  const msg = await db.contactMessage.create({
    data: {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || null,
      subject: (body.subject || "General enquiry").trim(),
      message: body.message.trim(),
    },
  });

  // Create admin notification
  await db.notification.create({
    data: {
      title: "New contact message",
      message: `${body.name} sent a message about "${body.subject}"`,
      type: "info",
      module: "contact",
    },
  });

  // Send emails (non-blocking)
  await Promise.allSettled([
    sendEmail({ email: body.email, name: body.name }, contactAcknowledgementEmail({ name: body.name, email: body.email, subject: body.subject })),
    sendEmail({ email: "info@leoclubofpokhara.org.np", name: "Leo Club Admin" }, contactAdminNotificationEmail({ name: body.name, email: body.email, phone: body.phone, subject: body.subject, message: body.message })),
  ]);

  return NextResponse.json({ success: true, id: msg.id });
}
