"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeading, GoldDivider } from "@/components/section-heading";
import { testimonials } from "@/lib/site-config";

export function Testimonials() {
  const reduce = useReducedMotion();

  return (
    <section className="relative section-py bg-muted/30">
      <div className="mx-auto max-w-7xl section-pad">
        <SectionHeading
          eyebrow="Voices"
          title={
            <>
              In their <span className="text-gradient-blue">own words.</span>
            </>
          }
          description="Members, alumni, and partners — on what the Leo Club of Pokhara has meant to them and to the community we serve."
        />

        <GoldDivider className="mt-10" />

        <div className="mt-14 grid md:grid-cols-2 gap-5 sm:gap-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={i}
              initial={reduce ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              className="relative rounded-3xl p-7 sm:p-8 bg-card border border-border shadow-soft overflow-hidden group"
            >
              <Quote className="absolute top-6 right-6 h-12 w-12 text-[var(--leo-gold)]/15 group-hover:text-[var(--leo-gold)]/25 transition-colors" />
              <blockquote className="relative font-serif text-[16px] sm:text-[17px] leading-relaxed text-foreground/90 pr-12">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                <div className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gradient-to-br from-[var(--leo-blue)] to-[var(--leo-red)] text-white font-serif font-bold">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="font-serif font-semibold text-[14px]">
                    {t.author}
                  </div>
                  <div className="text-[12px] text-muted-foreground">
                    {t.role}
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
