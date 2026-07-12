"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Calendar, TrendingUp, ArrowUpRight } from "lucide-react";
import { SectionHeading, GoldDivider } from "@/components/section-heading";
import { featuredProjects } from "@/lib/site-config";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Deterministic gradient cover per project category */
const categoryGradients: Record<string, string> = {
  Health: "from-[#F13333] to-[#7A1A1A]",
  Education: "from-[#0F3D91] to-[#0A2A66]",
  Environment: "from-[#2D7A3D] to-[#15401E]",
  Humanitarian: "from-[#F4C542] to-[#8B6510]",
};

/** Inline SVG icons for each project for visual variety */
function ProjectIllustration({ category }: { category: string }) {
  const illustrations: Record<string, React.ReactNode> = {
    Health: (
      <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="p-health" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F13333" />
            <stop offset="100%" stopColor="#7A1A1A" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" fill="url(#p-health)" />
        <circle cx="100" cy="60" r="40" fill="rgba(255,255,255,0.08)" />
        <path d="M85 60 L95 60 L100 45 L105 75 L110 60 L120 60" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="40" cy="30" r="20" fill="rgba(255,255,255,0.06)" />
        <circle cx="170" cy="100" r="28" fill="rgba(255,255,255,0.06)" />
      </svg>
    ),
    Education: (
      <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="p-edu" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0F3D91" />
            <stop offset="100%" stopColor="#0A2A66" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" fill="url(#p-edu)" />
        <path d="M100 35 L150 55 L100 75 L50 55 Z" fill="rgba(255,255,255,0.9)" />
        <path d="M70 65 L70 90 Q100 105 130 90 L130 65" stroke="white" strokeWidth="2.5" fill="none" />
        <circle cx="160" cy="55" r="3" fill="#F4C542" />
        <line x1="160" y1="55" x2="160" y2="78" stroke="#F4C542" strokeWidth="2" />
      </svg>
    ),
    Environment: (
      <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="p-env" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2D7A3D" />
            <stop offset="100%" stopColor="#15401E" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" fill="url(#p-env)" />
        <path d="M100 30 Q70 50 70 70 Q70 90 100 90 Q130 90 130 70 Q130 50 100 30 Z" fill="rgba(255,255,255,0.85)" />
        <line x1="100" y1="90" x2="100" y2="105" stroke="rgba(255,255,255,0.6)" strokeWidth="3" />
        <circle cx="50" cy="40" r="14" fill="rgba(244,197,66,0.4)" />
        <circle cx="160" cy="85" r="18" fill="rgba(255,255,255,0.1)" />
      </svg>
    ),
    Humanitarian: (
      <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="p-hum" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4C542" />
            <stop offset="100%" stopColor="#8B6510" />
          </linearGradient>
        </defs>
        <rect width="200" height="120" fill="url(#p-hum)" />
        <path d="M100 80 Q70 60 70 45 Q70 35 80 35 Q90 35 100 45 Q110 35 120 35 Q130 35 130 45 Q130 60 100 80 Z" fill="rgba(255,255,255,0.9)" />
        <circle cx="40" cy="30" r="10" fill="rgba(255,255,255,0.15)" />
        <circle cx="165" cy="95" r="15" fill="rgba(255,255,255,0.15)" />
      </svg>
    ),
  };

  return <>{illustrations[category] || illustrations.Health}</>;
}

export function Projects({ overrideProjects }: { overrideProjects?: typeof featuredProjects } = {}) {
  const reduce = useReducedMotion();
  const allProjects = overrideProjects || featuredProjects;
  const featured = allProjects.filter((p) => p.featured);
  const rest = allProjects.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative section-py bg-muted/30">
      <div className="mx-auto max-w-7xl section-pad">
        <SectionHeading
          eyebrow="Featured Projects"
          title={
            <>
              Where compassion meets{" "}
              <span className="text-gradient-blue">consistent action.</span>
            </>
          }
          description="Our initiatives span health, education, environment, and humanitarian relief — each designed for measurable, lasting impact across the Pokhara Valley."
        />

        <GoldDivider className="mt-10" />

        {/* Featured large cards */}
        <div className="mt-14 grid md:grid-cols-2 gap-5 sm:gap-6">
          {featured.map((project, i) => (
            <motion.article
              key={project.title}
              initial={reduce ? {} : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-premium transition-all duration-300"
            >
              <div className="grid sm:grid-cols-5">
                {/* Image / illustration */}
                <div className="sm:col-span-2 relative aspect-[4/3] sm:aspect-auto overflow-hidden">
                  <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
                    <ProjectIllustration category={project.category} />
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/20 backdrop-blur text-white border-white/20 hover:bg-white/30">
                      {project.category}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="sm:col-span-3 p-6 sm:p-7 flex flex-col">
                  <h3 className="font-serif font-bold text-xl leading-tight">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  {/* Meta */}
                  <div className="mt-5 space-y-2 text-[12.5px]">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>{project.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>{project.location}</span>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="mt-auto pt-5 flex items-end justify-between">
                    <div>
                      <div className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                        Impact
                      </div>
                      <div className="font-serif font-bold text-lg text-gradient-gold">
                        {project.impact}
                      </div>
                    </div>
                    <button
                      className="inline-flex items-center gap-1 text-[12.5px] font-medium text-primary hover:gap-2 transition-all"
                      aria-label={`Learn more about ${project.title}`}
                    >
                      Learn more
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Rest of the projects */}
        {rest.length > 0 && (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {rest.map((project, i) => (
              <motion.article
                key={project.title}
                initial={reduce ? {} : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
                    <ProjectIllustration category={project.category} />
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/20 backdrop-blur text-white border-white/20 hover:bg-white/30">
                      {project.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif font-bold text-base">{project.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-[11.5px]">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <TrendingUp className="h-3 w-3 text-[var(--leo-gold)]" />
                      {project.impact}
                    </span>
                    <span className="text-muted-foreground">{project.date}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
