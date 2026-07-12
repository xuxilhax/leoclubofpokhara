import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getClientIP } from "@/lib/security";
import { applicationConfirmationEmail, sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const rl = rateLimit(`application:${ip}`, 2, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many applications. Please try later." }, { status: 429 });
  }

  let body: {
    name: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    occupation?: string;
    motivation: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Validate
  if (!body.name || !body.email || !body.motivation) {
    return NextResponse.json({ error: "Name, email, and motivation are required" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (body.motivation.length < 20) {
    return NextResponse.json({ error: "Please write at least 20 characters about your motivation" }, { status: 400 });
  }

  // Persist
  const app = await db.membershipApplication.create({
    data: {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || null,
      address: body.address?.trim() || null,
      occupation: body.occupation?.trim() || null,
      motivation: body.motivation.trim(),
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
    },
  });

  // Notify admins
  await db.notification.create({
    data: {
      title: "New membership application",
      message: `${body.name} submitted a membership application.`,
      type: "info",
      module: "applications",
    },
  });

  // Send confirmation email
  await sendEmail(
    { email: body.email, name: body.name },
    applicationConfirmationEmail({ name: body.name, email: body.email })
  );

  return NextResponse.json({ success: true, id: app.id });
}
