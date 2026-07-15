-- ============================================================
-- Leo Club of Pokhara — Supabase Database Migration
-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- This creates ALL tables, indexes, and RLS policies.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. ADMIN USERS & ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'EDITOR',
  "avatarUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. SITE SETTINGS (key-value store for all dynamic content)
-- ============================================================
CREATE TABLE IF NOT EXISTS "SiteSetting" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);

-- ============================================================
-- 3. NAVIGATION MENU
-- ============================================================
CREATE TABLE IF NOT EXISTS "NavigationItem" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  "parentId" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NavigationItem_parent_fk" FOREIGN KEY ("parentId") REFERENCES "NavigationItem"(id) ON DELETE SET NULL
);

-- ============================================================
-- 4. HERO SLIDES
-- ============================================================
CREATE TABLE IF NOT EXISTS "HeroSlide" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  subtitle TEXT,
  "imageUrl" TEXT,
  "button1Text" TEXT,
  "button1Link" TEXT,
  "button2Text" TEXT,
  "button2Link" TEXT,
  "badgeText" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. EXECUTIVE BOARD
-- ============================================================
CREATE TABLE IF NOT EXISTS "BoardMember" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT NOT NULL,
  "photoUrl" TEXT,
  email TEXT,
  phone TEXT,
  social TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isArchived" BOOLEAN NOT NULL DEFAULT false,
  "boardYear" TEXT NOT NULL DEFAULT '2025-2026',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 6. MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS "Member" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "memberId" TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  "photoUrl" TEXT,
  position TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  "joinDate" TIMESTAMP(3) NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  "membershipType" TEXT NOT NULL DEFAULT 'STANDARD',
  notes TEXT,
  address TEXT,
  "dateOfBirth" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. EVENTS & REGISTRATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS "Event" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3),
  location TEXT NOT NULL,
  "coverImageUrl" TEXT,
  "registrationLimit" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "EventRegistration" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "eventId" TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EventRegistration_event_fk" FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE
);

-- ============================================================
-- 8. PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS "Project" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Service',
  "coverImageUrl" TEXT,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3),
  location TEXT NOT NULL,
  budget DOUBLE PRECISION NOT NULL DEFAULT 0,
  volunteers INTEGER NOT NULL DEFAULT 0,
  beneficiaries INTEGER NOT NULL DEFAULT 0,
  impact TEXT,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 9. NEWS & BLOG
-- ============================================================
CREATE TABLE IF NOT EXISTS "NewsArticle" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  "coverImageUrl" TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "scheduledAt" TIMESTAMP(3),
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "authorId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NewsArticle_author_fk" FOREIGN KEY ("authorId") REFERENCES "User"(id) ON DELETE SET NULL
);

-- ============================================================
-- 10. GALLERY
-- ============================================================
CREATE TABLE IF NOT EXISTS "GalleryAlbum" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Service',
  "coverImage" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "GalleryImage" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "albumId" TEXT,
  title TEXT NOT NULL,
  caption TEXT,
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Service',
  width INTEGER NOT NULL DEFAULT 0,
  height INTEGER NOT NULL DEFAULT 0,
  size INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GalleryImage_album_fk" FOREIGN KEY ("albumId") REFERENCES "GalleryAlbum"(id) ON DELETE SET NULL
);

-- ============================================================
-- 11. MEMBERSHIP APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS "MembershipApplication" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  "dateOfBirth" TIMESTAMP(3),
  address TEXT,
  occupation TEXT,
  motivation TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  "reviewedBy" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "reviewNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MembershipApplication_reviewer_fk" FOREIGN KEY ("reviewedBy") REFERENCES "User"(id) ON DELETE SET NULL
);

-- ============================================================
-- 12. TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS "Testimonial" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  role TEXT NOT NULL,
  "photoUrl" TEXT,
  category TEXT NOT NULL DEFAULT 'Member',
  "isApproved" BOOLEAN NOT NULL DEFAULT false,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 13. SPONSORS
-- ============================================================
CREATE TABLE IF NOT EXISTS "Sponsor" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  "logoUrl" TEXT,
  "websiteUrl" TEXT,
  category TEXT NOT NULL DEFAULT 'Partner',
  "order" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 14. DOWNLOADS
-- ============================================================
CREATE TABLE IF NOT EXISTS "Download" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  "fileUrl" TEXT NOT NULL,
  "fileType" TEXT NOT NULL DEFAULT 'pdf',
  "fileSize" INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Document',
  version TEXT NOT NULL DEFAULT '1.0',
  "downloadCount" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 15. MEDIA LIBRARY
-- ============================================================
CREATE TABLE IF NOT EXISTS "MediaAsset" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image',
  "mimeType" TEXT,
  size INTEGER NOT NULL DEFAULT 0,
  width INTEGER NOT NULL DEFAULT 0,
  height INTEGER NOT NULL DEFAULT 0,
  folder TEXT NOT NULL DEFAULT 'root',
  tags TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 16. CONTACT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS "ContactMessage" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "isReplied" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 17. AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS "AuditLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT,
  "userName" TEXT NOT NULL,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  "entityId" TEXT,
  "entityName" TEXT,
  details TEXT,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_user_fk" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE SET NULL
);

-- ============================================================
-- 18. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS "Notification" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  module TEXT,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 19. ANNOUNCEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS "Announcement" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES (for performance)
-- ============================================================
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "Member_email_idx" ON "Member"("email");
CREATE INDEX IF NOT EXISTS "Member_memberId_idx" ON "Member"("memberId");
CREATE INDEX IF NOT EXISTS "Event_startDate_idx" ON "Event"("startDate");
CREATE INDEX IF NOT EXISTS "NewsArticle_status_idx" ON "NewsArticle"("status");
CREATE INDEX IF NOT EXISTS "NewsArticle_slug_idx" ON "NewsArticle"("slug");
CREATE INDEX IF NOT EXISTS "GalleryImage_albumId_idx" ON "GalleryImage"("albumId");
CREATE INDEX IF NOT EXISTS "EventRegistration_eventId_idx" ON "EventRegistration"("eventId");
CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "ContactMessage_isRead_idx" ON "ContactMessage"("isRead");
CREATE INDEX IF NOT EXISTS "SiteSetting_key_idx" ON "SiteSetting"("key");

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteSetting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NavigationItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HeroSlide" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BoardMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Member" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EventRegistration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NewsArticle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GalleryAlbum" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GalleryImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MembershipApplication" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Testimonial" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Sponsor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Download" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MediaAsset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Announcement" ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read published content" ON "BoardMember" FOR SELECT USING (true);
CREATE POLICY "Public can read published events" ON "Event" FOR SELECT USING ("isPublished" = true);
CREATE POLICY "Public can read published projects" ON "Project" FOR SELECT USING ("isPublished" = true);
CREATE POLICY "Public can read published news" ON "NewsArticle" FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public can read gallery" ON "GalleryImage" FOR SELECT USING (true);
CREATE POLICY "Public can read approved testimonials" ON "Testimonial" FOR SELECT USING ("isApproved" = true);
CREATE POLICY "Public can read active sponsors" ON "Sponsor" FOR SELECT USING ("isActive" = true);
CREATE POLICY "Public can read published downloads" ON "Download" FOR SELECT USING ("isPublished" = true);
CREATE POLICY "Public can read settings" ON "SiteSetting" FOR SELECT USING (true);
CREATE POLICY "Public can read navigation" ON "NavigationItem" FOR SELECT USING ("isActive" = true);
CREATE POLICY "Public can read hero slides" ON "HeroSlide" FOR SELECT USING ("isActive" = true);
CREATE POLICY "Public can read announcements" ON "Announcement" FOR SELECT USING ("isActive" = true);

-- Public can create contact messages and applications
CREATE POLICY "Public can create contact messages" ON "ContactMessage" FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create applications" ON "MembershipApplication" FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create event registrations" ON "EventRegistration" FOR INSERT WITH CHECK (true);

-- NOTE: For admin write access, use the service role key in server actions
-- (bypasses RLS). The anon/publishable key can only read published content
-- and create new submissions.

-- ============================================================
-- DONE — All tables created!
-- ============================================================
-- Next: Run the seed script to populate with data:
--   bash scripts/setup-supabase.sh
-- ============================================================
