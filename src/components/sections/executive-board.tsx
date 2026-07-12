"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import { SectionHeading, GoldDivider } from "@/components/section-heading";
import { executiveBoard } from "@/lib/site-config";

/** Deterministic avatar — generates a colored monogram avatar from a name */
function MonogramAvatar({ name, position }: { name: string; position: string }) {
  // Take initials from the bracketed placeholder, e.g. "Leo [President Name]" -> "PN"
  const match = name.match(/\[(.*?)\]/);
  const inner = match ? match[1] : name.replace(/^Leo\s+/, "");
  const initials = inner
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase();

  // Deterministic gradient based on initials
  const gradients = [
    "from-[#0546A0] to-[#2E7BD3]",
    "from-[#E00121] to-[#B00F23]",
    "from-[#F4C542] to-[#C89530]",
    "from-[#2E7BD3] to-[#0546A0]",
    "from-[#0546A0] to-[#4A90E2]",
    "from-[#C89530] to-[#F4C542]",
  ];
  const hash =
    initials.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
    gradients.length;

  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradients[hash]} relative overflow-hidden`}
    >
      {/* Decorative ring */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 rounded-t-3xl border-t border-x border-white/20" />
      </div>
      {/* Monogram */}
      <span className="font-serif font-bold text-3xl sm:text-4xl text-white drop-shadow-lg">
        {initials || "L"}
      </span>
      {/* Position label at bottom */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/40 to-transparent h-1/2" />
    </div>
  );
}

function SocialIcon({ platform, href }: { platform: string; href: string }) {
  const icons: Record<string, React.ElementType> = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
  };
  const Icon = icons[platform] || Mail;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${platform} profile`}
      className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-background/80 backdrop-blur border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
    >
      <Icon className="h-3.5 w-3.5" />
    </a>
  );
}

export function ExecutiveBoard({ overrideMembers }: { overrideMembers?: { name: string; position: string; bio: string; image: string; social: { facebook: string; instagram: string; linkedin: string } }[] } = {}) {
  const reduce = useReducedMotion();
  const members = overrideMembers || executiveBoard;

  return (
    <section id="board" className="relative section-py">
      <div className="mx-auto max-w-7xl section-pad">
        <SectionHeading
          eyebrow="Executive Board"
          title={
            <>
              The team carrying the{" "}
              <span className="text-gradient-blue">legacy forward.</span>
            </>
          }
          description="The Leoistic Year 2025–2026 Executive Board — a dedicated group of volunteers responsible for steering the club's vision, operations, and service initiatives."
        />

        <GoldDivider className="mt-10" />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {members.map((member, i) => (
            <motion.article
              key={`${member.name}-${i}`}
              initial={reduce ? {} : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="group relative rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
            >
              {/* Photo / Monogram */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
                  <MonogramAvatar name={member.name} position={member.position} />
                </div>
                {/* Position badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider glass-strong text-foreground">
                    <span className="w-1 h-1 rounded-full bg-[var(--leo-gold)]" />
                    {member.position.split(" — ")[0]}
                  </span>
                </div>
                {/* Social icons — slide up on hover */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {Object.entries(member.social).map(([platform, href]) => (
                    <SocialIcon
                      key={platform}
                      platform={platform}
                      href={href as string}
                    />
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-serif font-bold text-[15.5px] leading-tight">
                  {member.name}
                </h3>
                <p className="mt-1 text-[12.5px] font-medium text-primary">
                  {member.position}
                </p>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted-foreground line-clamp-3">
                  {member.bio}
                </p>
              </div>

              {/* Bottom gold accent on hover */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--leo-gold)] via-[var(--leo-red)] to-[var(--leo-blue)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.article>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Board members are elected annually at the General Meeting. For
          directory updates, please contact the Club Secretary.
        </p>
      </div>
    </section>
  );
}
