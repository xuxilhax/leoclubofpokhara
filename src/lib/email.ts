/**
 * Leo Club CMS — Email Service
 * ----------------------------------------------------------------
 * Mock email service with branded HTML templates.
 * Swap the `sendEmail` function with Resend/SendGrid API call
 * in production — the templates and interface stay the same.
 */

type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

type EmailRecipient = {
  email: string;
  name?: string;
};

/** Send an email — replace with Resend/SendGrid in production */
export async function sendEmail(
  to: EmailRecipient | EmailRecipient[],
  template: EmailTemplate,
  from?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // ─── MOCK IMPLEMENTATION ──────────────────────────────────
  // In production, replace with:
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   return resend.emails.send({ from, to, subject, html, text });
  //
  // For now, we log the email and return success.
  const recipients = Array.isArray(to) ? to : [to];
  const fromAddress = from || "Leo Club of Pokhara <noreply@leoclubofpokhara.org.np>";

  console.log(`[EMAIL] From: ${fromAddress}`);
  console.log(`[EMAIL] To: ${recipients.map((r) => r.email).join(", ")}`);
  console.log(`[EMAIL] Subject: ${template.subject}`);
  console.log(`[EMAIL] Preview: ${template.text.substring(0, 100)}...`);

  return {
    success: true,
    messageId: `mock-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  };
}

// ============================================================
// EMAIL TEMPLATES
// ============================================================

const EMAIL_WRAPPER = (content: string, preview: string = "") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leo Club of Pokhara</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  ${preview ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preview}</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0F3D91 0%,#0A2A66 100%);padding:32px 40px;text-align:center;">
              <div style="font-size:22px;font-weight:700;color:#ffffff;font-family:Georgia,serif;">Leo Club of Pokhara</div>
              <div style="font-size:11px;color:#F4C542;letter-spacing:2px;text-transform:uppercase;margin-top:6px;">Leadership · Experience · Opportunity</div>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#f8f9fa;border-top:1px solid #e9ecef;text-align:center;">
              <p style="margin:0;font-size:12px;color:#6c757d;">
                Leo Club of Pokhara · Chartered August 08, 1979<br>
                Pokhara, Kaski, Gandaki Province, Nepal<br>
                <a href="https://leoclubofpokhara.org.np" style="color:#0F3D91;text-decoration:none;">leoclubofpokhara.org.np</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/** Contact form acknowledgement — sent to the person who submitted */
export function contactAcknowledgementEmail(data: {
  name: string;
  email: string;
  subject: string;
}): EmailTemplate {
  return {
    subject: `We've received your message — Leo Club of Pokhara`,
    html: EMAIL_WRAPPER(`
      <h1 style="margin:0 0 16px;font-size:22px;color:#0B1A33;font-family:Georgia,serif;">Thank you for reaching out, ${data.name}!</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#495057;">
        We've received your message regarding <strong>"${data.subject}"</strong> and wanted to confirm that it's now in our inbox.
        Our team will review your enquiry and respond within 2–3 working days.
      </p>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#495057;">
        If your enquiry is urgent, please don't hesitate to call us directly at the club office.
      </p>
      <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
        <tr>
          <td style="background:#0F3D91;border-radius:8px;padding:14px 32px;text-align:center;">
            <a href="https://leoclubofpokhara.org.np" style="color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">Visit Our Website</a>
          </td>
        </tr>
      </table>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6c757d;border-top:1px solid #e9ecef;padding-top:20px;">
        With gratitude,<br><strong>The Leo Club of Pokhara Team</strong>
      </p>
    `, `Thank you for reaching out, ${data.name}! We've received your message.`),
    text: `Thank you for reaching out, ${data.name}!

We've received your message regarding "${data.subject}" and wanted to confirm that it's now in our inbox. Our team will review your enquiry and respond within 2-3 working days.

If your enquiry is urgent, please call us directly at the club office.

With gratitude,
The Leo Club of Pokhara Team`,
  };
}

/** Admin notification — sent to club officers when a new contact message arrives */
export function contactAdminNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): EmailTemplate {
  return {
    subject: `[New Contact Message] ${data.subject}`,
    html: EMAIL_WRAPPER(`
      <h1 style="margin:0 0 16px;font-size:20px;color:#0B1A33;font-family:Georgia,serif;">New Contact Message</h1>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr><td style="padding:6px 0;color:#6c757d;width:100px;">Name:</td><td style="padding:6px 0;color:#0B1A33;font-weight:600;">${data.name}</td></tr>
        <tr><td style="padding:6px 0;color:#6c757d;">Email:</td><td style="padding:6px 0;color:#0B1A33;font-weight:600;">${data.email}</td></tr>
        ${data.phone ? `<tr><td style="padding:6px 0;color:#6c757d;">Phone:</td><td style="padding:6px 0;color:#0B1A33;font-weight:600;">${data.phone}</td></tr>` : ""}
        <tr><td style="padding:6px 0;color:#6c757d;">Subject:</td><td style="padding:6px 0;color:#0B1A33;font-weight:600;">${data.subject}</td></tr>
      </table>
      <p style="margin:20px 0 8px;font-size:13px;color:#6c757d;text-transform:uppercase;letter-spacing:1px;">Message</p>
      <div style="background:#f8f9fa;border-radius:8px;padding:16px;font-size:14px;line-height:1.6;color:#495057;">${data.message.replace(/\n/g, "<br>")}</div>
      <p style="margin:24px 0 0;font-size:13px;color:#6c757d;">
        Review and respond in the <a href="https://leoclubofpokhara.org.np/?admin=1" style="color:#0F3D91;">Admin Dashboard</a>.
      </p>
    `),
    text: `New Contact Message

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}\n` : ""}Subject: ${data.subject}

Message:
${data.message}

Review in the Admin Dashboard.`,
  };
}

/** Membership application confirmation — sent to the applicant */
export function applicationConfirmationEmail(data: {
  name: string;
  email: string;
}): EmailTemplate {
  return {
    subject: `Your membership application has been received — Leo Club of Pokhara`,
    html: EMAIL_WRAPPER(`
      <h1 style="margin:0 0 16px;font-size:22px;color:#0B1A33;font-family:Georgia,serif;">Thank you for applying, ${data.name}!</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#495057;">
        We've received your membership application to the Leo Club of Pokhara. Thank you for your interest in joining our community of young leaders committed to service.
      </p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#495057;">
        <strong>What happens next?</strong>
      </p>
      <ol style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:1.8;color:#495057;">
        <li>Our Membership Director will review your application within 7 working days.</li>
        <li>If your profile aligns with our current intake, we'll schedule an orientation session.</li>
        <li>After orientation, the Executive Board will make a final decision.</li>
        <li>Upon approval, you'll be welcomed at our next General Meeting.</li>
      </ol>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#495057;">
        We appreciate your patience and look forward to the possibility of welcoming you to the Leo family.
      </p>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6c757d;border-top:1px solid #e9ecef;padding-top:20px;">
        Warm regards,<br><strong>The Membership Team<br>Leo Club of Pokhara</strong>
      </p>
    `, `Thank you for applying, ${data.name}! We've received your membership application.`),
    text: `Thank you for applying, ${data.name}!

We've received your membership application to the Leo Club of Pokhara.

What happens next?
1. Our Membership Director will review your application within 7 working days.
2. If your profile aligns with our current intake, we'll schedule an orientation session.
3. After orientation, the Executive Board will make a final decision.
4. Upon approval, you'll be welcomed at our next General Meeting.

Warm regards,
The Membership Team, Leo Club of Pokhara`,
  };
}

/** Event registration confirmation */
export function eventRegistrationEmail(data: {
  name: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
}): EmailTemplate {
  return {
    subject: `You're registered — ${data.eventTitle}`,
    html: EMAIL_WRAPPER(`
      <h1 style="margin:0 0 16px;font-size:22px;color:#0B1A33;font-family:Georgia,serif;">You're registered, ${data.name}!</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#495057;">
        We're excited to confirm your registration for:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4fa;border-radius:12px;padding:20px;margin-bottom:24px;">
        <tr><td style="font-size:18px;font-weight:700;color:#0F3D91;font-family:Georgia,serif;padding-bottom:12px;">${data.eventTitle}</td></tr>
        <tr><td style="font-size:14px;color:#495057;padding:4px 0;"><strong>Date:</strong> ${data.eventDate}</td></tr>
        <tr><td style="font-size:14px;color:#495057;padding:4px 0;"><strong>Location:</strong> ${data.eventLocation}</td></tr>
      </table>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#495057;">
        Please arrive 15 minutes before the start time. If you have any questions or need to cancel, please contact us.
      </p>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6c757d;border-top:1px solid #e9ecef;padding-top:20px;">
        See you there!<br><strong>The Leo Club of Pokhara Team</strong>
      </p>
    `),
    text: `You're registered, ${data.name}!

Event: ${data.eventTitle}
Date: ${data.eventDate}
Location: ${data.eventLocation}

Please arrive 15 minutes before the start time. See you there!

The Leo Club of Pokhara Team`,
  };
}

/** Newsletter subscription confirmation */
export function newsletterWelcomeEmail(data: { email: string }): EmailTemplate {
  return {
    subject: `Welcome to the Leo Pokhara newsletter!`,
    html: EMAIL_WRAPPER(`
      <h1 style="margin:0 0 16px;font-size:22px;color:#0B1A33;font-family:Georgia,serif;">Welcome aboard!</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#495057;">
        Thank you for subscribing to the Leo Club of Pokhara newsletter. You'll now receive quarterly updates on our service initiatives, upcoming events, and opportunities to serve alongside us.
      </p>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#495057;">
        We send emails sparingly — about once a quarter — and we'll never share your email with anyone.
      </p>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6c757d;border-top:1px solid #e9ecef;padding-top:20px;">
        With gratitude,<br><strong>The Leo Club of Pokhara Team</strong>
      </p>
    `),
    text: `Welcome aboard!

Thank you for subscribing to the Leo Club of Pokhara newsletter. You'll receive quarterly updates on our initiatives and events.

With gratitude,
The Leo Club of Pokhara Team`,
  };
}

/** Password reset email */
export function passwordResetEmail(data: {
  name: string;
  resetUrl: string;
}): EmailTemplate {
  return {
    subject: `Reset your password — Leo Club of Pokhara`,
    html: EMAIL_WRAPPER(`
      <h1 style="margin:0 0 16px;font-size:22px;color:#0B1A33;font-family:Georgia,serif;">Password reset request</h1>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#495057;">
        Hi ${data.name}, we received a request to reset your password for the Leo Club of Pokhara admin dashboard.
      </p>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#495057;">
        Click the button below to set a new password. This link will expire in 1 hour.
      </p>
      <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
        <tr>
          <td style="background:#F13333;border-radius:8px;padding:14px 32px;text-align:center;">
            <a href="${data.resetUrl}" style="color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">Reset Password</a>
          </td>
        </tr>
      </table>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#6c757d;">
        If you didn't request a password reset, you can safely ignore this email — your password won't be changed.
      </p>
    `),
    text: `Password reset request

Hi ${data.name},

We received a request to reset your password. Click the link below to set a new password. This link expires in 1 hour.

${data.resetUrl}

If you didn't request this, you can safely ignore this email.`,
  };
}
