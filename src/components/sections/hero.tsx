"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function Hero({ content }: { content?: Record<string, string> } = {}) {
  const reduce = useReducedMotion();
  const c = content || {};

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
    >
      {/* Background layers */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0546A0] via-[#032D6B] to-[#060B16]" />
        {/* Aurora blobs */}
        <div
          className="aurora-blob"
          style={{
            top: "-10%",
            left: "-5%",
            width: "45vw",
            height: "45vw",
            background: "#E00121",
          }}
        />
        <div
          className="aurora-blob"
          style={{
            bottom: "-20%",
            right: "-10%",
            width: "55vw",
            height: "55vw",
            background: "#F4C542",
            opacity: 0.22,
          }}
        />
        <div
          className="aurora-blob"
          style={{
            top: "30%",
            right: "20%",
            width: "30vw",
            height: "30vw",
            background: "#2E7BD3",
            opacity: 0.4,
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        {/* Bottom fade into background */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl w-full section-pad">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left — text content */}
          <div className="lg:col-span-7 text-white">
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass text-[12px] font-medium tracking-wide text-white/90"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#F4C542]" />
              <span>{c.hero_badge_text || `Chartered ${siteConfig.charterDate}`}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{siteConfig.parentOrganization}</span>
            </motion.div>

            <motion.h1
              initial={reduce ? {} : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
              className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.04] tracking-tight"
            >
              {c.hero_title || "Leo Club of Pokhara"}
            </motion.h1>

            <motion.p
              initial={reduce ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.16 }}
              className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl"
            >
              {c.hero_subtitle || "For over four decades, we have cultivated Leadership, Experience, and Opportunity through meaningful service across the Pokhara Valley."}
            </motion.p>

            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.24 }}
              className="mt-9 flex flex-col sm:flex-row gap-3"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#E00121] hover:bg-[#C8011B] text-white px-7 h-12 text-[15px] font-semibold shadow-premium"
              >
                <Link href={c.hero_button1_link || "#membership"} className="gap-2">
                  {c.hero_button1_text || "Join Us"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full glass-strong border-white/20 text-white hover:bg-white/10 hover:text-white px-7 h-12 text-[15px] font-semibold"
              >
                <Link href={c.hero_button2_link || "#projects"} className="gap-2">
                  {c.hero_button2_text || "Explore Projects"}
                  <ChevronDown className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Trust line */}
            <motion.div
              initial={reduce ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-white/60"
            >
              <span>Sponsored by {siteConfig.charterSponsor}</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>{siteConfig.district}</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>Est. {siteConfig.charterYear}</span>
            </motion.div>
          </div>

          {/* Right — visual collage */}
          <motion.div
            initial={reduce ? {} : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-5 hidden lg:block relative"
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              {/* Decorative ring */}
              <div className="absolute -inset-6 rounded-[2rem] border border-white/10" />
              <div className="absolute -inset-3 rounded-[1.6rem] border border-white/[0.06]" />

              {/* Card stack — three layered glass cards */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-3">
                {/* Big primary card — Pokhara hero image */}
                <figure className="col-span-6 row-span-4 rounded-2xl overflow-hidden shadow-premium relative group">
                  <img
                    src="https://images.unsplash.com/photo-1605649461784-8a5c8e9d4f8b?auto=format&fit=crop&w=1200&q=80"
                    alt="Phewa Lake with the Annapurna range in the background, Pokhara, Nepal"
                    loading="eager"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <figcaption className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#F4C542] font-semibold">
                      Our Home
                    </div>
                    <div className="text-base font-serif font-semibold mt-1">
                      Pokhara · Nepal
                    </div>
                  </figcaption>
                </figure>

                {/* Stats card — charter year */}
                <div className="col-span-3 row-span-2 rounded-2xl glass-strong p-4 flex flex-col justify-between shadow-soft">
                  <div className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                    Chartered
                  </div>
                  <div>
                    <div className="text-3xl font-serif font-bold text-foreground">
                      1979
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      46+ years of service
                    </div>
                  </div>
                </div>

                {/* Motto card */}
                <div className="col-span-3 row-span-2 rounded-2xl bg-[#F4C542] p-4 flex flex-col justify-between shadow-soft text-[#0B1A33]">
                  <div className="text-[10.5px] uppercase tracking-[0.16em] font-semibold opacity-70">
                    Our Motto
                  </div>
                  <div className="text-[13px] font-serif font-semibold leading-snug">
                    Leadership
                    <br />
                    Experience
                    <br />
                    Opportunity
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute -top-6 -right-4 glass-strong rounded-full pl-1.5 pr-4 py-1.5 flex items-center gap-2 shadow-premium"
                animate={reduce ? {} : { y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/logo-64.png"
                  alt="Leo Club emblem"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-xs font-semibold text-foreground">
                  Serving since 1979
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-[11px] uppercase tracking-[0.18em]">
            Scroll
          </span>
          <motion.div
            animate={reduce ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
