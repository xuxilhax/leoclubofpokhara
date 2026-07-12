# Leo Club of Pokhara — Official Digital Platform

A production-ready, integrated platform combining a public website and admin CMS for the Leo Club of Pokhara, Nepal. Built with Next.js 16, TypeScript, Tailwind CSS, Prisma, and shadcn/ui.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [CMS Usage Guide](#cms-usage-guide)
- [Security](#security)
- [Backup & Restore](#backup--restore)
- [Future Extension](#future-extension)
- [Troubleshooting](#troubleshooting)

---

## Overview

This platform serves as the official digital presence for the Leo Club of Pokhara. It consists of two integrated systems accessible from a single application:

1. **Public Website** (`/`) — The public-facing site showcasing the club's mission, projects, events, gallery, and contact information.
2. **Admin Dashboard** (`/?admin=1`) — A secure CMS where authorized club officers manage all website content.

All content is stored in a PostgreSQL-compatible database (SQLite for development) and edits made in the CMS appear instantly on the public site.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Application                   │
│                      (port 3000)                         │
│                                                          │
│  ┌──────────────┐          ┌──────────────────────────┐ │
│  │  Public Site  │          │     Admin Dashboard       │ │
│  │   (/, default)│          │   (/?admin=1)             │ │
│  │               │          │                            │ │
│  │  • Hero       │          │  • Dashboard               │ │
│  │  • About      │          │  • Members Manager         │ │
│  │  • Board      │          │  • Events Manager          │ │
│  │  • Projects   │          │  • Projects Manager        │ │
│  │  • Events     │          │  • News & Blog             │ │
│  │  • Gallery    │          │  • Gallery Manager         │ │
│  │  • Contact    │          │  • Applications            │ │
│  │  • Forms      │          │  • Audit Logs              │ │
│  │               │          │  • Settings                │ │
│  │  Reads from   │          │  • 22 modules total        │ │
│  │  database     │          │                            │ │
│  └───────┬───────┘          └────────────┬──────────────┘ │
│          │                                │                │
│          │         ┌──────────────┐       │                │
│          └────────►│   Prisma     │◄──────┘                │
│                    │   Database   │                         │
│                    │  (SQLite/PG) │                         │
│                    └──────┬───────┘                         │
│                           │                                 │
│                    ┌──────┴───────┐                         │
│                    │  API Routes  │                         │
│                    │  /api/contact│                         │
│                    │  /api/search │                         │
│                    │  /api/news.. │                         │
│                    │  /api/reg..  │                         │
│                    └──────────────┘                         │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database | Prisma ORM (SQLite dev / PostgreSQL prod) |
| Auth | Cookie-based session with bcrypt |
| Email | Mock service (swap for Resend/SendGrid) |
| PDF Export | jsPDF |
| Search | Custom server-side search |
| SEO | Dynamic metadata, JSON-LD, sitemap.xml, robots.txt |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Unified entry — switches public/admin
│   ├── layout.tsx            # Root layout with fonts + ThemeProvider
│   ├── globals.css           # Brand design system
│   ├── sitemap.ts            # XML sitemap generator
│   ├── robots.ts             # robots.txt generator
│   └── api/
│       ├── contact/route.ts  # Contact form API
│       ├── search/route.ts   # Site search API
│       ├── newsletter/route.ts
│       └── register/route.ts # Membership application API
├── components/
│   ├── admin/                # CMS dashboard components
│   │   ├── admin-shell.tsx   # Top-level admin layout
│   │   ├── admin-context.tsx # SPA routing state
│   │   ├── auth-actions.ts   # Client-callable auth
│   │   ├── layout/           # Sidebar, Topbar, CommandPalette
│   │   └── modules/          # 22 CMS module components
│   ├── public/               # Public site integration layer
│   │   ├── public-site.tsx   # Composes all sections with DB data
│   │   ├── search-overlay.tsx
│   │   └── cookie-consent.tsx
│   ├── sections/             # Phase 1 public site sections
│   │   ├── hero.tsx
│   │   ├── about.tsx
│   │   ├── navbar.tsx
│   │   └── ... (14 section components)
│   ├── brand/                # Logo components
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── auth.ts               # Server actions (login, logout)
│   ├── auth-helpers.ts       # Pure auth utilities
│   ├── actions.ts            # All CMS CRUD server actions
│   ├── public-data.ts        # Fetches public site data from DB
│   ├── email.ts              # Email templates + mock sender
│   ├── security.ts           # Rate limiting + CSRF
│   ├── search.ts             # Site-wide search logic
│   ├── pdf-export.ts         # PDF generation (members, events)
│   ├── site-config.ts        # Fallback content + navigation config
│   └── utils.ts              # Shared utilities
├── hooks/                    # Custom React hooks
└── prisma/
    └── schema.prisma         # Database schema (18 models)
```

## Database Schema

The database contains 18 Prisma models with proper relationships:

### Core Models

| Model | Purpose | Key Fields |
|-------|---------|-----------|
| `User` | Admin accounts | email, passwordHash, role |
| `BoardMember` | Executive board | name, position, bio, order, isArchived |
| `Member` | Full member database | memberId, name, email, phone, status |
| `Event` | Events | title, startDate, location, registrationLimit |
| `EventRegistration` | Event registrations | eventId, name, email |
| `Project` | Service projects | title, category, budget, volunteers, beneficiaries |
| `NewsArticle` | News & blog | title, slug, content, status, publishedAt |
| `GalleryAlbum` | Photo albums | title, category |
| `GalleryImage` | Individual images | title, url, category, albumId |
| `Testimonial` | Testimonials | quote, author, role, isApproved |
| `Sponsor` | Sponsors & partners | name, websiteUrl, category |
| `Download` | Downloadable files | title, fileUrl, fileType, version |
| `MediaAsset` | Media library | name, url, type, folder |
| `ContactMessage` | Contact form submissions | name, email, subject, message |
| `MembershipApplication` | Membership applications | name, email, motivation, status |
| `SiteSetting` | Key-value settings | key, value |
| `AuditLog` | Action tracking | userName, action, module, details |
| `Notification` | Internal notifications | title, message, type, isRead |

### Roles & Permissions

6 roles with hierarchical permissions:

1. **Super Admin** — Full access including user management
2. **President** — All content + settings + audit logs
3. **Vice President** — Content management + publishing
4. **Secretary** — Members, events, applications, news
5. **Treasurer** — View access + finance modules
6. **Editor** — Content editing (no publishing)

## Environment Setup

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL 14+ (production) or SQLite (development)

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="file:./dev.db"                    # SQLite (dev)
# DATABASE_URL="postgresql://user:pass@host:5432/leo_club"  # PostgreSQL (prod)

# Auth (generate a random 32+ character string)
AUTH_SECRET="your-random-secret-here"

# Email (optional — mock service used if not set)
RESEND_API_KEY="re_xxxxxxxxxxxx"
# or
SENDGRID_API_KEY="SG.xxxxxxxxxxxx"

# Storage (optional — local file storage used if not set)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-key"

# Analytics (optional)
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
GOOGLE_SEARCH_CONSOLE_VERIFICATION="your-verification-code"

# Site URL (used for SEO, sitemap, emails)
NEXT_PUBLIC_SITE_URL="https://leoclubofpokhara.org.np"
```

## Local Development

```bash
# Install dependencies
bun install

# Set up the database
bun run db:push

# Seed with demo data
bun run scripts/seed.ts

# Start the dev server
bun run dev
```

### Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@leo.club | admin123 | Super Admin |
| president@leo.club | leo123 | President |
| editor@leo.club | leo123 | Editor |

## Deployment

### Vercel + Supabase (Recommended)

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Copy the PostgreSQL connection string
   - Create storage buckets: `images`, `documents`, `media`

2. **Set up environment variables in Vercel**
   - Add all variables from `.env` above
   - Set `DATABASE_URL` to your Supabase PostgreSQL connection string

3. **Deploy**
   ```bash
   # Push schema to production database
   npx prisma db push

   # Deploy to Vercel
   vercel --prod
   ```

4. **Post-deployment**
   - Visit `https://your-domain/?admin=1`
   - Log in with the seeded Super Admin credentials
   - **Immediately change the admin password**
   - Configure club settings in Settings → Club Info

### Alternative: Self-hosted

```bash
# Build
bun run build

# Run the standalone server
bun run start
```

## CMS Usage Guide

### Accessing the Dashboard

1. Visit `https://leoclubofpokhara.org.np/?admin=1`
2. Or click the discreet lock icon in the bottom-left corner of the public site
3. Log in with your admin credentials

### Key Workflows

#### Adding a New Board Member
1. Navigate to **Executive Board** in the sidebar
2. Click **Add Member**
3. Fill in name, position, bio, and contact info
4. Click **Add Member** to save
5. The new member appears instantly on the public site

#### Creating an Event
1. Navigate to **Events**
2. Click **New Event**
3. Fill in title, description, date, location, and registration limit
4. Toggle **Published** to make it visible on the public site
5. Toggle **Featured** to highlight it on the homepage

#### Reviewing Membership Applications
1. Navigate to **Applications**
2. Review pending applications in the **Pending** tab
3. Click **Review** to open the application details
4. Add a review note (optional)
5. Click **Approve**, **Waitlist**, or **Reject**

#### Writing a News Article
1. Navigate to **News & Blog**
2. Click **New Article**
3. Fill in title, excerpt, and content
4. Set status to **Draft**, **Published**, or **Scheduled**
5. Add SEO title and description for search engines
6. Click **Save**

### Command Palette

Press **Cmd+K** (Mac) or **Ctrl+K** (Windows/Linux) anywhere in the dashboard to:
- Quickly navigate to any module
- Search for specific pages or actions
- Use arrow keys to navigate, Enter to select

## Security

### Implemented Measures

1. **Authentication**
   - bcrypt password hashing (10 rounds)
   - HTTP-only session cookies
   - Session expiry (1 day default, 7 days with "Remember Me")

2. **Authorization**
   - Role-based access control (6 roles, 22 permission keys)
   - Every server action checks user permissions

3. **Rate Limiting**
   - Contact form: 5 submissions per hour per IP
   - Newsletter: 3 per hour per IP
   - Applications: 2 per hour per IP

4. **Security Headers** (in `next.config.ts`)
   - Content-Security-Policy
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: SAMEORIGIN
   - Strict-Transport-Security
   - Referrer-Policy

5. **Input Validation**
   - Zod schema validation on server actions
   - Email format validation
   - Minimum length checks
   - SQL injection prevention (Prisma parameterized queries)

6. **Audit Logging**
   - Every login/logout is logged
   - Every create/update/delete is logged
   - Logs include user, action, module, timestamp, and IP

### Production Security Checklist

- [ ] Change all demo passwords immediately
- [ ] Set a strong `AUTH_SECRET` environment variable
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting at the CDN level
- [ ] Enable Supabase Row Level Security
- [ ] Review and customize the CSP policy
- [ ] Set up error monitoring (Sentry recommended)

## Backup & Restore

### Automatic Backups

- Daily automatic backups at 2:00 AM NPT (configurable)
- Backups retained for 30 days
- Stored in Supabase Storage or local filesystem

### Manual Backup

1. Navigate to **Backup & Restore** in the CMS
2. Click **Create Backup**
3. Download the backup file for offline storage

### Restore

1. Navigate to **Backup & Restore**
2. Find the backup you want to restore
3. Click **Restore**
4. Confirm the restore action

### Database Backup (CLI)

```bash
# Export database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore database
psql $DATABASE_URL < backup_20250712.sql
```

## Future Extension

The platform is designed for extensibility. To add a new module:

### 1. Add to Navigation

Edit `src/components/admin/nav-config.tsx`:
```typescript
{
  id: "attendance",  // new module ID
  label: "Attendance",
  icon: Calendar,
  description: "Track meeting attendance",
}
```

### 2. Create the Module Component

Create `src/components/admin/modules/attendance-manager.tsx`:
```typescript
"use client";
export function AttendanceManager() {
  return <div>Attendance Module</div>;
}
```

### 3. Add to Module Router

Edit `src/components/admin/admin-shell.tsx`:
```typescript
case "attendance":
  return <AttendanceManager />;
```

### 4. Add Database Model (if needed)

Edit `prisma/schema.prisma`:
```prisma
model Attendance {
  id        String   @id @default(cuid())
  memberId  String
  meetingId String
  present   Boolean
  // ...
}
```

Run `bun run db:push` to apply.

### 5. Add Server Actions

Edit `src/lib/actions.ts`:
```typescript
export async function getAttendance() {
  return db.attendance.findMany();
}
```

### Planned Future Modules

- **Attendance** — Track meeting attendance
- **Finance** — Income/expense tracking
- **Inventory** — Club asset management
- **Elections** — Board election management
- **Certificates** — Generate member certificates
- **Volunteer Hours** — Track service hours
- **Donations** — Donation management

## Troubleshooting

### Common Issues

**"Module not found" errors after adding new files**
- Restart the dev server: `bun run dev`

**Database connection issues**
- Verify `DATABASE_URL` in `.env`
- For SQLite, ensure the `db/` directory exists
- For PostgreSQL, verify the connection string format

**Admin dashboard not loading**
- Clear browser cookies for the domain
- Verify the session cookie is being set
- Check that the user exists in the database

**Public site showing stale data**
- The site uses `force-dynamic` rendering — data should be fresh
- Try a hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- Check for Prisma client caching issues

**Email not sending**
- The email service is currently a mock that logs to console
- To enable real email, set `RESEND_API_KEY` and update `src/lib/email.ts`

### Getting Help

- Check the dev server logs: `tail -f dev.log`
- Run lint: `bun run lint`
- Check Prisma Studio: `npx prisma studio`

---

## License

© 2025 Leo Club of Pokhara. All rights reserved.

Chartered August 08, 1979 · Sponsored by Lions Club of Pokhara · District 325 B2, Nepal
