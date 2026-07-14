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
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import type { PublicData } from "@/lib/public-data";

export function PublicSite({ data }: { data: PublicData }) {
  return (
    <>
      <Navbar navItems={data.navigationItems} content={data.content} />
      <main className="flex flex-col">
        <Hero content={data.content} />
        <About content={data.content} />
        <Stats content={data.content} />
        <ExecutiveBoardDB members={data.boardMembers} />
        <ProjectsDB projects={data.projects} />
        <EventsDB events={data.events} />
        <GalleryDB images={data.galleryImages} />
        <Membership content={data.content} />
        <TestimonialsDB testimonials={data.testimonials} />
        <SponsorsDB sponsors={data.sponsors} />
        <Contact content={data.content} />
      </main>
      <Footer content={data.content} />

      {/* Admin access link */}
      <a
        href="/?admin=1"
        className="fixed bottom-4 left-4 z-40 inline-flex items-center justify-center h-9 w-9 rounded-full glass-strong shadow-soft text-muted-foreground hover:text-primary transition-colors"
        aria-label="Admin Dashboard"
        title="Admin Dashboard"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </a>
    </>
  );
}

function ExecutiveBoardDB({ members }: { members: PublicData["boardMembers"] }) {
  if (!members || members.length === 0) return <ExecutiveBoard />;
  const dbMembers = members.map((m) => ({
    name: m.name, position: m.position, bio: m.bio,
    image: m.photoUrl || m.name.charAt(0),
    social: { facebook: "#", instagram: "#", linkedin: "#" },
  }));
  return <ExecutiveBoard overrideMembers={dbMembers} />;
}

function ProjectsDB({ projects }: { projects: PublicData["projects"] }) {
  if (!projects || projects.length === 0) return <Projects />;
  const dbProjects = projects.map((p) => ({
    title: p.title, category: p.category, description: p.description,
    impact: p.impact || `${(p.beneficiaries || 0).toLocaleString()}+ beneficiaries`,
    date: p.endDate ? `${new Date(p.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} — Ongoing` : new Date(p.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    location: p.location,
    image: p.coverImageUrl || p.category?.toLowerCase() || "service",
    featured: p.isFeatured,
  }));
  return <Projects overrideProjects={dbProjects} />;
}

function EventsDB({ events }: { events: PublicData["events"] }) {
  if (!events || events.length === 0) return <Events />;
  const upcoming = events.filter((e) => new Date(e.startDate) >= new Date());
  const past = events.filter((e) => new Date(e.startDate) < new Date());
  return <Events overrideUpcoming={upcoming.map((e) => ({ title: e.title, date: e.startDate, endDate: e.endDate || undefined, location: e.location, description: e.description, category: e.category, registrationUrl: "#membership" }))} overridePast={past.map((e) => ({ title: e.title, date: e.startDate, location: e.location, description: e.description, category: e.category }))} />;
}

function GalleryDB({ images }: { images: PublicData["galleryImages"] }) {
  if (!images || images.length === 0) return <Gallery />;
  const dbImages = images.map((img, i) => ({ id: i + 1, category: img.category, title: img.title, height: ["short", "medium", "tall"][i % 3], seed: (img.title || "").toLowerCase().replace(/\s+/g, "-") }));
  return <Gallery overrideImages={dbImages} />;
}

function TestimonialsDB({ testimonials }: { testimonials: PublicData["testimonials"] }) {
  if (!testimonials || testimonials.length === 0) return <Testimonials />;
  return <Testimonials overrideTestimonials={testimonials.map((t) => ({ quote: t.quote, author: t.author, role: t.role }))} />;
}

function SponsorsDB({ sponsors }: { sponsors: PublicData["sponsors"] }) {
  if (!sponsors || sponsors.length === 0) return <Sponsors />;
  return <Sponsors overrideSponsors={sponsors.map((s) => s.name)} />;
}
