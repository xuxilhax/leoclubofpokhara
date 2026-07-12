"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { sponsors } from "@/lib/site-config";

export function Sponsors({ overrideSponsors }: { overrideSponsors?: string[] } = {}) {
  // Duplicate the list for seamless marquee
  const sponsorList = overrideSponsors || sponsors;
  const doubled = [...sponsorList, ...sponsorList];

  return (
    <section className="py-16 sm:py-20 border-y border-border bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl section-pad">
        <SectionHeading
          eyebrow="Partners & Sponsors"
          title="Serving alongside trusted partners."
          description="The Leo Club of Pokhara is proud to serve in partnership with these institutions across the Pokhara Valley and beyond."
        />

        {/* Marquee */}
        <div className="mt-12 relative">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden">
            <motion.div
              className="flex shrink-0 items-center gap-10 pr-10"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {doubled.map((sponsor, i) => (
                <div
                  key={`${sponsor}-${i}`}
                  className="flex items-center gap-3 shrink-0"
                >
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-muted border border-border text-primary font-serif font-bold text-sm">
                    {sponsor.charAt(0)}
                  </span>
                  <span className="font-serif text-[15px] font-semibold whitespace-nowrap text-foreground/80">
                    {sponsor}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
