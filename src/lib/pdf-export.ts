/**
 * Leo Club CMS — PDF Export Utility
 * ----------------------------------------------------------------
 * Generates branded PDF documents for members, events, and reports.
 * Uses jsPDF for client-side PDF generation.
 */
import { jsPDF } from "jspdf";

const BRAND_BLUE: [number, number, number] = [15, 61, 145];
const BRAND_RED: [number, number, number] = [241, 51, 51];
const BRAND_GOLD: [number, number, number] = [244, 197, 66];
const TEXT_DARK: [number, number, number] = [11, 26, 51];
const MUTED: [number, number, number] = [91, 101, 115];

/** Add branded header to a PDF document */
function addBrandedHeader(doc: jsPDF, title: string, subtitle?: string) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Blue banner
  doc.setFillColor(...BRAND_BLUE);
  doc.rect(0, 0, pageWidth, 32, "F");

  // Gold accent line
  doc.setFillColor(...BRAND_GOLD);
  doc.rect(0, 32, pageWidth, 2, "F");

  // Club name
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Leo Club of Pokhara", 14, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...BRAND_GOLD as [number, number, number]);
  doc.text("Leadership · Experience · Opportunity", 14, 22);

  // Document title (right side)
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(title, pageWidth - 14, 18, { align: "right" });

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(subtitle, pageWidth - 14, 26, { align: "right" });
  }

  // Reset for body
  doc.setTextColor(...TEXT_DARK);
  doc.setFontSize(10);
}

/** Add footer with page number and date */
function addFooter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 220);
    doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      14,
      pageHeight - 8
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 8, { align: "right" });
  }
}

export type MemberExportRow = {
  memberId: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: string;
  joinDate: Date;
  membershipType: string;
};

/** Generate a PDF of all members */
export function exportMembersPDF(members: MemberExportRow[]) {
  const doc = new jsPDF();
  addBrandedHeader(doc, "Members Directory", `${members.length} members`);

  let y = 46;

  // Table header
  doc.setFillColor(245, 247, 250);
  doc.rect(14, y - 4, doc.internal.pageSize.getWidth() - 28, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND_BLUE);
  doc.text("Member ID", 16, y + 2);
  doc.text("Name", 50, y + 2);
  doc.text("Position", 100, y + 2);
  doc.text("Status", 145, y + 2);
  doc.text("Joined", 175, y + 2);
  y += 10;

  // Rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_DARK);

  for (const m of members) {
    if (y > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      y = 46;
    }

    doc.text(m.memberId, 16, y);
    doc.text(m.name.substring(0, 22), 50, y);
    doc.text((m.position || "—").substring(0, 20), 100, y);

    const statusColor: [number, number, number] =
      m.status === "ACTIVE" ? [34, 139, 34] :
      m.status === "ALUMNI" ? BRAND_BLUE :
      m.status === "RESIGNED" ? BRAND_RED :
      MUTED;
    doc.setTextColor(...statusColor);
    doc.text(m.status, 145, y);
    doc.setTextColor(...TEXT_DARK);

    doc.text(new Date(m.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }), 175, y);
    y += 8;
  }

  addFooter(doc);
  doc.save(`leo-members-${new Date().toISOString().split("T")[0]}.pdf`);
}

export type EventExportRow = {
  title: string;
  category: string;
  startDate: Date;
  location: string;
  registrations: number;
  registrationLimit: number;
  isPublished: boolean;
};

/** Generate a PDF of all events */
export function exportEventsPDF(events: EventExportRow[]) {
  const doc = new jsPDF();
  addBrandedHeader(doc, "Events Report", `${events.length} events`);

  let y = 46;

  doc.setFillColor(245, 247, 250);
  doc.rect(14, y - 4, doc.internal.pageSize.getWidth() - 28, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND_BLUE);
  doc.text("Event Title", 16, y + 2);
  doc.text("Category", 90, y + 2);
  doc.text("Date", 120, y + 2);
  doc.text("Location", 145, y + 2);
  doc.text("Regs", 185, y + 2);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_DARK);

  for (const e of events) {
    if (y > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      y = 46;
    }

    doc.text(e.title.substring(0, 35), 16, y);
    doc.text(e.category, 90, y);
    doc.text(new Date(e.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" }), 120, y);
    doc.text(e.location.substring(0, 20), 145, y);
    doc.text(`${e.registrations}${e.registrationLimit > 0 ? `/${e.registrationLimit}` : ""}`, 185, y);
    y += 8;
  }

  addFooter(doc);
  doc.save(`leo-events-${new Date().toISOString().split("T")[0]}.pdf`);
}
