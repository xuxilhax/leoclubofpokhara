"use server";

import { db } from "@/lib/db";
import { getCurrentUser, recordAudit } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ============================================================
// DASHBOARD STATS
// ============================================================

export async function getDashboardStats() {
  const [
    members,
    activeProjects,
    upcomingEvents,
    pendingApplications,
    galleryImages,
    publishedNews,
    sponsors,
    unreadNotifications,
    recentAuditLogs,
    recentApplications,
    upcomingEventsList,
  ] = await Promise.all([
    db.member.count({ where: { status: "ACTIVE" } }),
    db.project.count({ where: { isPublished: true } }),
    db.event.count({ where: { startDate: { gte: new Date() } } }),
    db.membershipApplication.count({ where: { status: "PENDING" } }),
    db.galleryImage.count(),
    db.newsArticle.count({ where: { status: "PUBLISHED" } }),
    db.sponsor.count({ where: { isActive: true } }),
    db.notification.count({ where: { isRead: false } }),
    db.auditLog.findMany({ take: 8, orderBy: { createdAt: "desc" } }),
    db.membershipApplication.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    db.event.findMany({
      where: { startDate: { gte: new Date() } },
      take: 5,
      orderBy: { startDate: "asc" },
    }),
  ]);

  return {
    members,
    activeProjects,
    upcomingEvents,
    pendingApplications,
    galleryImages,
    publishedNews,
    sponsors,
    unreadNotifications,
    recentAuditLogs,
    recentApplications,
    upcomingEventsList,
    // Mock visitor count — would come from analytics
    visitors: 18432,
    visitorChange: 12.5,
  };
}

// ============================================================
// MEMBERS
// ============================================================

const memberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  memberId: z.string().min(1),
  joinDate: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE", "ALUMNI", "RESIGNED"]),
  membershipType: z.enum(["STANDARD", "LIFE", "HONORARY", "CHARTER"]),
  notes: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export async function getMembers(search?: string, status?: string) {
  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { memberId: { contains: search } },
      { phone: { contains: search } },
    ];
  }
  if (status && status !== "ALL") {
    where.status = status;
  }
  return db.member.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function createMember(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || null,
    position: (formData.get("position") as string) || null,
    memberId: formData.get("memberId") as string,
    joinDate: formData.get("joinDate") as string,
    status: formData.get("status") as "ACTIVE" | "INACTIVE" | "ALUMNI" | "RESIGNED",
    membershipType: formData.get("membershipType") as "STANDARD" | "LIFE" | "HONORARY" | "CHARTER",
    notes: (formData.get("notes") as string) || null,
    address: (formData.get("address") as string) || null,
  };

  const parsed = memberSchema.parse(data);
  await db.member.create({
    data: {
      ...parsed,
      joinDate: new Date(parsed.joinDate),
    },
  });
  await recordAudit(user, "CREATE", "members", `Created member ${parsed.name}`, undefined, parsed.name);
  revalidatePath("/");
}

export async function updateMember(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || null,
    position: (formData.get("position") as string) || null,
    memberId: formData.get("memberId") as string,
    joinDate: formData.get("joinDate") as string,
    status: formData.get("status") as "ACTIVE" | "INACTIVE" | "ALUMNI" | "RESIGNED",
    membershipType: formData.get("membershipType") as "STANDARD" | "LIFE" | "HONORARY" | "CHARTER",
    notes: (formData.get("notes") as string) || null,
    address: (formData.get("address") as string) || null,
  };
  const parsed = memberSchema.parse(data);
  await db.member.update({
    where: { id },
    data: { ...parsed, joinDate: new Date(parsed.joinDate) },
  });
  await recordAudit(user, "UPDATE", "members", `Updated member ${parsed.name}`, id, parsed.name);
  revalidatePath("/");
}

export async function deleteMember(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const member = await db.member.delete({ where: { id } });
  await recordAudit(user, "DELETE", "members", `Deleted member ${member.name}`, id, member.name);
  revalidatePath("/");
}

// ============================================================
// EVENTS
// ============================================================

export async function getEvents() {
  return db.event.findMany({
    orderBy: { startDate: "desc" },
    include: { _count: { select: { registrations: true } } },
  });
}

export async function createEvent(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const title = formData.get("title") as string;
  await db.event.create({
    data: {
      title,
      description: formData.get("description") as string,
      category: (formData.get("category") as string) || "General",
      startDate: new Date(formData.get("startDate") as string),
      endDate: formData.get("endDate")
        ? new Date(formData.get("endDate") as string)
        : null,
      location: formData.get("location") as string,
      registrationLimit: parseInt((formData.get("registrationLimit") as string) || "0"),
      isFeatured: formData.get("isFeatured") === "true",
      isPublished: formData.get("isPublished") !== "false",
    },
  });
  await recordAudit(user, "CREATE", "events", `Created event ${title}`, undefined, title);
  revalidatePath("/");
}

export async function updateEvent(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const title = formData.get("title") as string;
  await db.event.update({
    where: { id },
    data: {
      title,
      description: formData.get("description") as string,
      category: (formData.get("category") as string) || "General",
      startDate: new Date(formData.get("startDate") as string),
      endDate: formData.get("endDate")
        ? new Date(formData.get("endDate") as string)
        : null,
      location: formData.get("location") as string,
      registrationLimit: parseInt((formData.get("registrationLimit") as string) || "0"),
      isFeatured: formData.get("isFeatured") === "true",
      isPublished: formData.get("isPublished") !== "false",
    },
  });
  await recordAudit(user, "UPDATE", "events", `Updated event ${title}`, id, title);
  revalidatePath("/");
}

export async function deleteEvent(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const event = await db.event.delete({ where: { id } });
  await recordAudit(user, "DELETE", "events", `Deleted event ${event.title}`, id, event.title);
  revalidatePath("/");
}

export async function duplicateEvent(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const event = await db.event.findUnique({ where: { id } });
  if (!event) return;
  await db.event.create({
    data: {
      ...event,
      id: undefined,
      title: `${event.title} (Copy)`,
      isPublished: false,
      createdAt: undefined,
      updatedAt: undefined,
    },
  });
  await recordAudit(user, "CREATE", "events", `Duplicated event ${event.title}`, undefined, `${event.title} (Copy)`);
  revalidatePath("/");
}

export async function toggleEventPublish(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const event = await db.event.findUnique({ where: { id } });
  if (!event) return;
  const updated = await db.event.update({
    where: { id },
    data: { isPublished: !event.isPublished },
  });
  await recordAudit(user, "UPDATE", "events", `${updated.isPublished ? "Published" : "Unpublished"} event ${event.title}`, id, event.title);
  revalidatePath("/");
}

// ============================================================
// PROJECTS
// ============================================================

export async function getProjects() {
  return db.project.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createProject(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const title = formData.get("title") as string;
  await db.project.create({
    data: {
      title,
      description: formData.get("description") as string,
      category: (formData.get("category") as string) || "Service",
      startDate: new Date(formData.get("startDate") as string),
      endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : null,
      location: formData.get("location") as string,
      budget: parseFloat((formData.get("budget") as string) || "0"),
      volunteers: parseInt((formData.get("volunteers") as string) || "0"),
      beneficiaries: parseInt((formData.get("beneficiaries") as string) || "0"),
      impact: (formData.get("impact") as string) || null,
      isFeatured: formData.get("isFeatured") === "true",
      isPublished: formData.get("isPublished") !== "false",
    },
  });
  await recordAudit(user, "CREATE", "projects", `Created project ${title}`, undefined, title);
  revalidatePath("/");
}

export async function updateProject(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const title = formData.get("title") as string;
  await db.project.update({
    where: { id },
    data: {
      title,
      description: formData.get("description") as string,
      category: (formData.get("category") as string) || "Service",
      startDate: new Date(formData.get("startDate") as string),
      endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : null,
      location: formData.get("location") as string,
      budget: parseFloat((formData.get("budget") as string) || "0"),
      volunteers: parseInt((formData.get("volunteers") as string) || "0"),
      beneficiaries: parseInt((formData.get("beneficiaries") as string) || "0"),
      impact: (formData.get("impact") as string) || null,
      isFeatured: formData.get("isFeatured") === "true",
      isPublished: formData.get("isPublished") !== "false",
    },
  });
  await recordAudit(user, "UPDATE", "projects", `Updated project ${title}`, id, title);
  revalidatePath("/");
}

export async function deleteProject(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const project = await db.project.delete({ where: { id } });
  await recordAudit(user, "DELETE", "projects", `Deleted project ${project.title}`, id, project.title);
  revalidatePath("/");
}

// ============================================================
// BOARD MEMBERS
// ============================================================

export async function getBoardMembers(includeArchived = false) {
  return db.boardMember.findMany({
    where: includeArchived ? {} : { isArchived: false },
    orderBy: [{ isArchived: "asc" }, { order: "asc" }],
  });
}

export async function createBoardMember(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const name = formData.get("name") as string;
  const count = await db.boardMember.count();
  await db.boardMember.create({
    data: {
      name,
      position: formData.get("position") as string,
      bio: formData.get("bio") as string,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      boardYear: (formData.get("boardYear") as string) || "2025-2026",
      order: count,
    },
  });
  await recordAudit(user, "CREATE", "board", `Added board member ${name}`, undefined, name);
  revalidatePath("/");
}

export async function updateBoardMember(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const name = formData.get("name") as string;
  await db.boardMember.update({
    where: { id },
    data: {
      name,
      position: formData.get("position") as string,
      bio: formData.get("bio") as string,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      boardYear: (formData.get("boardYear") as string) || "2025-2026",
    },
  });
  await recordAudit(user, "UPDATE", "board", `Updated board member ${name}`, id, name);
  revalidatePath("/");
}

export async function deleteBoardMember(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const member = await db.boardMember.delete({ where: { id } });
  await recordAudit(user, "DELETE", "board", `Deleted board member ${member.name}`, id, member.name);
  revalidatePath("/");
}

export async function archiveBoardMember(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const member = await db.boardMember.update({
    where: { id },
    data: { isArchived: true },
  });
  await recordAudit(user, "UPDATE", "board", `Archived board member ${member.name}`, id, member.name);
  revalidatePath("/");
}

export async function reorderBoardMembers(ids: string[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  for (let i = 0; i < ids.length; i++) {
    await db.boardMember.update({
      where: { id: ids[i] },
      data: { order: i },
    });
  }
  revalidatePath("/");
}

// ============================================================
// NEWS
// ============================================================

export async function getNewsArticles() {
  return db.newsArticle.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createNewsArticle(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  await db.newsArticle.create({
    data: {
      title,
      slug,
      excerpt: (formData.get("excerpt") as string) || null,
      content: (formData.get("content") as string) || "",
      category: (formData.get("category") as string) || "General",
      tags: (formData.get("tags") as string) || "",
      status: (formData.get("status") as string) || "DRAFT",
      isFeatured: formData.get("isFeatured") === "true",
      seoTitle: (formData.get("seoTitle") as string) || null,
      seoDescription: (formData.get("seoDescription") as string) || null,
      authorId: user.id,
      publishedAt: formData.get("status") === "PUBLISHED" ? new Date() : null,
    },
  });
  await recordAudit(user, "CREATE", "news", `Created article ${title}`, undefined, title);
  revalidatePath("/");
}

export async function updateNewsArticle(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const title = formData.get("title") as string;
  const status = formData.get("status") as string;
  const existing = await db.newsArticle.findUnique({ where: { id } });
  const publishedAt = status === "PUBLISHED" && !existing?.publishedAt ? new Date() : existing?.publishedAt;
  await db.newsArticle.update({
    where: { id },
    data: {
      title,
      slug: (formData.get("slug") as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      excerpt: (formData.get("excerpt") as string) || null,
      content: (formData.get("content") as string) || "",
      category: (formData.get("category") as string) || "General",
      tags: (formData.get("tags") as string) || "",
      status,
      isFeatured: formData.get("isFeatured") === "true",
      seoTitle: (formData.get("seoTitle") as string) || null,
      seoDescription: (formData.get("seoDescription") as string) || null,
      publishedAt,
    },
  });
  await recordAudit(user, "UPDATE", "news", `Updated article ${title}`, id, title);
  revalidatePath("/");
}

export async function deleteNewsArticle(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const article = await db.newsArticle.delete({ where: { id } });
  await recordAudit(user, "DELETE", "news", `Deleted article ${article.title}`, id, article.title);
  revalidatePath("/");
}

// ============================================================
// GALLERY
// ============================================================

export async function getGalleryImages(category?: string) {
  return db.galleryImage.findMany({
    where: category && category !== "All" ? { category } : {},
    orderBy: { order: "asc" },
  });
}

export async function createGalleryImage(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const title = formData.get("title") as string;
  await db.galleryImage.create({
    data: {
      title,
      caption: (formData.get("caption") as string) || null,
      url: (formData.get("url") as string) || `/gallery/${Date.now()}`,
      category: (formData.get("category") as string) || "Service",
    },
  });
  await recordAudit(user, "CREATE", "gallery", `Uploaded image ${title}`, undefined, title);
  revalidatePath("/");
}

export async function deleteGalleryImage(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const image = await db.galleryImage.delete({ where: { id } });
  await recordAudit(user, "DELETE", "gallery", `Deleted image ${image.title}`, id, image.title);
  revalidatePath("/");
}

// ============================================================
// MEMBERSHIP APPLICATIONS
// ============================================================

export async function getApplications() {
  return db.membershipApplication.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function reviewApplication(id: string, status: "APPROVED" | "REJECTED" | "WAITLISTED", note: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const app = await db.membershipApplication.update({
    where: { id },
    data: {
      status,
      reviewNote: note,
      reviewedAt: new Date(),
      reviewedBy: user.id,
    },
  });
  await recordAudit(user, status === "APPROVED" ? "APPROVE" : status === "REJECTED" ? "REJECT" : "UPDATE", "applications", `${status.toLowerCase()} application from ${app.name}`, id, app.name);
  revalidatePath("/");
}

export async function createApplication(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || null,
    address: (formData.get("address") as string) || null,
    occupation: (formData.get("occupation") as string) || null,
    motivation: (formData.get("motivation") as string) || "",
    dateOfBirth: formData.get("dateOfBirth") ? new Date(formData.get("dateOfBirth") as string) : null,
  };
  await db.membershipApplication.create({ data });
  await db.notification.create({
    data: {
      title: "New membership application",
      message: `${data.name} submitted a membership application.`,
      type: "info",
      module: "applications",
    },
  });
  revalidatePath("/");
}

// ============================================================
// TESTIMONIALS
// ============================================================

export async function getTestimonials() {
  return db.testimonial.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createTestimonial(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const author = formData.get("author") as string;
  await db.testimonial.create({
    data: {
      quote: formData.get("quote") as string,
      author,
      role: formData.get("role") as string,
      category: (formData.get("category") as string) || "Member",
      isApproved: formData.get("isApproved") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    },
  });
  await recordAudit(user, "CREATE", "testimonials", `Added testimonial from ${author}`, undefined, author);
  revalidatePath("/");
}

export async function updateTestimonial(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const author = formData.get("author") as string;
  await db.testimonial.update({
    where: { id },
    data: {
      quote: formData.get("quote") as string,
      author,
      role: formData.get("role") as string,
      category: (formData.get("category") as string) || "Member",
      isApproved: formData.get("isApproved") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    },
  });
  await recordAudit(user, "UPDATE", "testimonials", `Updated testimonial from ${author}`, id, author);
  revalidatePath("/");
}

export async function deleteTestimonial(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const t = await db.testimonial.delete({ where: { id } });
  await recordAudit(user, "DELETE", "testimonials", `Deleted testimonial from ${t.author}`, id, t.author);
  revalidatePath("/");
}

// ============================================================
// SPONSORS
// ============================================================

export async function getSponsors() {
  return db.sponsor.findMany({ orderBy: { order: "asc" } });
}

export async function createSponsor(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const name = formData.get("name") as string;
  const count = await db.sponsor.count();
  await db.sponsor.create({
    data: {
      name,
      websiteUrl: (formData.get("websiteUrl") as string) || null,
      category: (formData.get("category") as string) || "Partner",
      isActive: formData.get("isActive") !== "false",
      order: count,
    },
  });
  await recordAudit(user, "CREATE", "sponsors", `Added sponsor ${name}`, undefined, name);
  revalidatePath("/");
}

export async function updateSponsor(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const name = formData.get("name") as string;
  await db.sponsor.update({
    where: { id },
    data: {
      name,
      websiteUrl: (formData.get("websiteUrl") as string) || null,
      category: (formData.get("category") as string) || "Partner",
      isActive: formData.get("isActive") !== "false",
    },
  });
  await recordAudit(user, "UPDATE", "sponsors", `Updated sponsor ${name}`, id, name);
  revalidatePath("/");
}

export async function deleteSponsor(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const s = await db.sponsor.delete({ where: { id } });
  await recordAudit(user, "DELETE", "sponsors", `Deleted sponsor ${s.name}`, id, s.name);
  revalidatePath("/");
}

// ============================================================
// DOWNLOADS
// ============================================================

export async function getDownloads() {
  return db.download.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createDownload(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const title = formData.get("title") as string;
  await db.download.create({
    data: {
      title,
      description: (formData.get("description") as string) || null,
      fileUrl: (formData.get("fileUrl") as string) || `/downloads/${title.toLowerCase().replace(/\s+/g, "-")}`,
      fileType: (formData.get("fileType") as string) || "pdf",
      category: (formData.get("category") as string) || "Document",
      version: (formData.get("version") as string) || "1.0",
      isPublished: formData.get("isPublished") !== "false",
    },
  });
  await recordAudit(user, "CREATE", "downloads", `Added download ${title}`, undefined, title);
  revalidatePath("/");
}

export async function deleteDownload(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const d = await db.download.delete({ where: { id } });
  await recordAudit(user, "DELETE", "downloads", `Deleted download ${d.title}`, id, d.title);
  revalidatePath("/");
}

// ============================================================
// CONTACT MESSAGES
// ============================================================

export async function getContactMessages() {
  return db.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function markMessageRead(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  await db.contactMessage.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/");
}

export async function deleteContactMessage(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  await db.contactMessage.delete({ where: { id } });
  revalidatePath("/");
}

// ============================================================
// NOTIFICATIONS
// ============================================================

export async function getNotifications() {
  return db.notification.findMany({ orderBy: { createdAt: "desc" }, take: 30 });
}

export async function markNotificationRead(id: string) {
  await db.notification.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/");
}

export async function markAllNotificationsRead() {
  await db.notification.updateMany({ where: { isRead: false }, data: { isRead: true } });
  revalidatePath("/");
}

// ============================================================
// AUDIT LOGS
// ============================================================

export async function getAuditLogs() {
  return db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
}

// ============================================================
// USERS (admin management)
// ============================================================

export async function getUsers() {
  return db.user.findMany({
    select: { id: true, email: true, name: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
}

// ============================================================
// SETTINGS
// ============================================================

export async function getSettings() {
  const settings = await db.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;
  return map;
}

export async function updateSetting(key: string, value: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  await db.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  await recordAudit(user, "UPDATE", "settings", `Updated setting ${key}`, undefined, key);
  revalidatePath("/");
}
