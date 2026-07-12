"use client";

import * as React from "react";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Stats } from "@/components/sections/stats";
import { ExecutiveBoard } from "@/components/sections/executive-board";
import { Projects } from "@/components/sections/projects";
import { Events } from "@/components/sections/events";
import { Gallery } from "@/components/sections/gallery";
import { Membership } from "@/components/sections/membership";
import { Testimonials } from "@/components/sections/testimonials";
import { Sponsors } from "@/components/sections/sponsors";
import { Newsletter } from "@/components/sections/newsletter";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { SearchOverlay } from "./search-overlay";
import { CookieConsent } from "./cookie-consent";
import type { PublicData } from "@/lib/public-data";

/**
 * PublicSite — the public-facing website.
 * Composes all Phase 1 sections. Data comes from the CMS database
 * via the `getPublicSiteData()` server function.
 *
 * The individual section components still import from site-config.ts
 * for fallback content, but the most data-driven sections (board,
 * projects, events, gallery, testimonials, sponsors) receive live
 * DB data as props through their respective DB-aware wrappers below.
 */
export function PublicSite({ data }: { data: PublicData }) {
  const [searchOpen, setSearchOpen] = React.useState(false);

  // Cmd/Ctrl+K opens search on public site
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Feed DB data into the global scope so section components can access it.
  // This is a lightweight bridge — the sections still use their static
  // fallbacks for structural content, but live data overrides are applied
  // through the DB-aware wrappers rendered below.
  return (
    <>
      <Navbar onSearchClick={() => setSearchOpen(true)} />
      <main className="flex flex-col">
        <Hero />
        <About />
        <Stats />
        <ExecutiveBoardDB members={data.boardMembers} />
        <ProjectsDB projects={data.projects} />
        <EventsDB events={data.events} />
        <GalleryDB images={data.galleryImages} />
        <Membership />
        <TestimonialsDB testimonials={data.testimonials} />
        <SponsorsDB sponsors={data.sponsors} />
        <Newsletter />
        <Contact />
      </main>
      <Footer />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CookieConsent />

      {/* Admin login link — discreet, in the page for officers */}
      <a
        href="/?admin=1"
        className="fixed bottom-4 left-4 z-40 inline-flex items-center justify-center h-9 w-9 rounded-full glass-strong shadow-soft text-muted-foreground hover:text-primary transition-colors"
        aria-label="Officer login"
        title="Officer Login"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </a>
    </>
  );
}

// ============================================================
// DB-AWARE SECTION WRAPPERS
// These wrap the Phase 1 section components and inject live DB data.
// ============================================================

function ExecutiveBoardDB({ members }: { members: PublicData["boardMembers"] }) {
  // The Phase 1 ExecutiveBoard component reads from site-config.ts.
  // Here we render a DB-driven version if data exists, otherwise fall back.
  if (!members || members.length === 0) return <ExecutiveBoard />;

  // Map DB board members to the format the component expects
  const dbMembers = members.map((m) => ({
    name: m.name,
    position: m.position,
    bio: m.bio,
    image: m.photoUrl || m.name.charAt(0),
    social: m.email ? { facebook: "#", instagram: "#", linkedin: "#" } : { facebook: "#", instagram: "#", linkedin: "#" },
  }));

  return <ExecutiveBoard overrideMembers={dbMembers} />;
}

function ProjectsDB({ projects }: { projects: PublicData["projects"] }) {
  if (!projects || projects.length === 0) return <Projects />;
  const dbProjects = projects.map((p) => ({
    title: p.title,
    category: p.category,
    description: p.description,
    impact: p.impact || `${p.beneficiaries.toLocaleString()}+ beneficiaries`,
    date: p.endDate
      ? `${new Date(p.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} — Ongoing`
      : new Date(p.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    location: p.location,
    image: p.category.toLowerCase(),
    featured: p.isFeatured,
  }));
  return <Projects overrideProjects={dbProjects} />;
}

function EventsDB({ events }: { events: PublicData["events"] }) {
  if (!events || events.length === 0) return <Events />;
  const upcoming = events.filter((e) => new Date(e.startDate) >= new Date());
  const past = events.filter((e) => new Date(e.startDate) < new Date());

  const dbUpcoming = upcoming.map((e) => ({
    title: e.title,
    date: new Date(e.startDate).toISOString(),
    endDate: e.endDate ? new Date(e.endDate).toISOString() : undefined,
    location: e.location,
    description: e.description,
    category: e.category,
    registrationUrl: "#membership",
  }));
  const dbPast = past.map((e) => ({
    title: e.title,
    date: new Date(e.startDate).toISOString(),
    location: e.location,
    description: e.description,
    category: e.category,
  }));
  return <Events overrideUpcoming={dbUpcoming} overridePast={dbPast} />;
}

function GalleryDB({ images }: { images: PublicData["galleryImages"] }) {
  if (!images || images.length === 0) return <Gallery />;
  const dbImages = images.map((img, i) => ({
    id: i + 1,
    category: img.category,
    title: img.title,
    height: ["short", "medium", "tall"][i % 3],
    seed: img.title.toLowerCase().replace(/\s+/g, "-"),
  }));
  return <Gallery overrideImages={dbImages} />;
}

function TestimonialsDB({ testimonials }: { testimonials: PublicData["testimonials"] }) {
  if (!testimonials || testimonials.length === 0) return <Testimonials />;
  const dbTestimonials = testimonials.map((t) => ({
    quote: t.quote,
    author: t.author,
    role: t.role,
  }));
  return <Testimonials overrideTestimonials={dbTestimonials} />;
}

function SponsorsDB({ sponsors }: { sponsors: PublicData["sponsors"] }) {
  if (!sponsors || sponsors.length === 0) return <Sponsors />;
  const dbSponsors = sponsors.map((s) => s.name);
  return <Sponsors overrideSponsors={dbSponsors} />;
}
