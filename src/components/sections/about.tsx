"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Target, Eye, Quote, Compass, Shield, Crown, Users } from "lucide-react";
import { SectionHeading, GoldDivider } from "@/components/section-heading";
import { missionVision, presidentMessage, historyTimeline, siteConfig } from "@/lib/site-config";

const valueIcons: Record<string, React.ElementType> = {
  Compass,
  Shield,
  Crown,
  Users,
};

export function About() {
  const reduce = useReducedMotion();

  return (
    <section id="about" className="relative section-py overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[var(--leo-gold)]/[0.05] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-[var(--leo-blue)]/[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl section-pad">
        {/* Heading */}
        <SectionHeading
          eyebrow="About the Club"
          title={
            <>
              A legacy of service, <br className="hidden sm:block" />
              <span className="text-gradient-blue">a future of impact.</span>
            </>
          }
          description={siteConfig.description}
        />

        <GoldDivider className="mt-10" />

        {/* Mission & Vision */}
        <div className="mt-16 grid md:grid-cols-2 gap-6 lg:gap-8">
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl p-7 sm:p-9 bg-card border border-border shadow-soft overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--leo-blue)]/[0.06] rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-[var(--leo-blue)]/10 text-[var(--leo-blue)] mb-5">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-serif font-bold">Our Mission</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {missionVision.mission}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="relative rounded-3xl p-7 sm:p-9 bg-card border border-border shadow-soft overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--leo-gold)]/[0.10] rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-[var(--leo-gold)]/15 text-[#C89530] mb-5">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-serif font-bold">Our Vision</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {missionVision.vision}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {missionVision.values.map((value, i) => {
            const Icon = valueIcons[value.title.split(" ")[0]] || Compass;
            return (
              <motion.div
                key={value.title}
                initial={reduce ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-2xl p-5 bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary/[0.08] text-primary mb-3">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-serif font-semibold text-[15px]">{value.title}</h4>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* President's Message */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-20 relative rounded-3xl overflow-hidden border border-border shadow-premium"
        >
          <div className="grid lg:grid-cols-12">
            {/* Left — portrait & meta */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[var(--leo-blue)] to-[#032D6B] p-8 sm:p-10 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="relative">
                <div className="aspect-square w-32 sm:w-40 rounded-2xl overflow-hidden border-2 border-white/20 shadow-premium mb-6 bg-white/10 flex items-center justify-center p-3">
                  {/* Leo Club logo */}
                  <Image
                    src="/logo-transparent-128.png"
                    alt="Leo Club emblem"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#F4C542] font-semibold">
                  President's Message
                </div>
                <h3 className="mt-2 text-xl font-serif font-bold">
                  {presidentMessage.presidentName}
                </h3>
                <p className="text-sm text-white/70 mt-1">
                  {presidentMessage.presidentTitle}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  {presidentMessage.presidentialTerm}
                </p>
              </div>
            </div>

            {/* Right — message */}
            <div className="lg:col-span-8 p-8 sm:p-10 bg-card">
              <Quote className="h-9 w-9 text-[var(--leo-gold)]/40 mb-4" />
              <p className="text-lg sm:text-xl leading-relaxed font-serif text-foreground/90">
                {presidentMessage.message}
              </p>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-base sm:text-lg font-serif italic text-primary">
                  &ldquo;{presidentMessage.quote}&rdquo;
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  — {presidentMessage.presidentName}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* History timeline */}
        <div className="mt-24">
          <SectionHeading
            eyebrow="Our History"
            title="Four decades of quiet, consistent service"
            description="From our charter in 1979 to today — milestones that have shaped the Leo Club of Pokhara into the institution it is now."
          />

          <div className="mt-14 relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] sm:left-1/2 top-0 bottom-0 w-px bg-border sm:-translate-x-1/2" />

            <div className="space-y-10">
              {historyTimeline.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={item.year}
                    initial={reduce ? {} : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.04 }}
                    className={`relative pl-10 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-12 ${
                      isLeft ? "" : "sm:[direction:rtl]"
                    }`}
                  >
                    {/* Marker */}
                    <span className="absolute left-0 sm:left-1/2 top-1.5 sm:top-2 h-4 w-4 -translate-x-0 sm:-translate-x-1/2 rounded-full bg-background border-2 border-[var(--leo-gold)] flex items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--leo-gold)]" />
                    </span>

                    <div
                      className={`sm:[direction:ltr] ${
                        isLeft ? "sm:text-right sm:pr-8" : "sm:col-start-2 sm:pl-8"
                      }`}
                    >
                      <div className="rounded-2xl p-5 bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300">
                        <div className="text-2xl font-serif font-bold text-gradient-gold">
                          {item.year}
                        </div>
                        <h4 className="mt-1.5 font-serif font-semibold text-base">
                          {item.title}
                        </h4>
                        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
