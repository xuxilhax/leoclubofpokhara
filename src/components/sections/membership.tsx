"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Crown,
  HeartHandshake,
  Globe,
  TrendingUp,
  Users,
  Award,
  Check,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { SectionHeading, GoldDivider } from "@/components/section-heading";
import {
  membershipBenefits,
  membershipEligibility,
  membershipFaqs,
} from "@/lib/site-config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const benefitIcons: Record<string, React.ElementType> = {
  crown: Crown,
  "heart-handshake": HeartHandshake,
  globe: Globe,
  "trending-up": TrendingUp,
  users: Users,
  award: Award,
};

export function Membership() {
  const reduce = useReducedMotion();

  return (
    <section id="membership" className="relative section-py overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-[35vw] h-[35vw] bg-[var(--leo-gold)]/[0.07] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-[var(--leo-red)]/[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl section-pad">
        <SectionHeading
          eyebrow="Membership"
          title={
            <>
              Become part of a{" "}
              <span className="text-gradient-blue">46-year legacy.</span>
            </>
          }
          description="Leo membership is more than volunteering — it's a structured journey of leadership, fellowship, and service that shapes who you become."
        />

        <GoldDivider className="mt-10" />

        {/* Benefits */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {membershipBenefits.map((benefit, i) => {
            const Icon = benefitIcons[benefit.icon] || Award;
            return (
              <motion.div
                key={benefit.title}
                initial={reduce ? {} : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                className="group rounded-2xl p-6 bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--leo-blue)]/10 to-[var(--leo-gold)]/10 text-primary group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[15.5px]">
                      {benefit.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Eligibility + Application CTA */}
        <div className="mt-12 grid lg:grid-cols-2 gap-6">
          {/* Eligibility list */}
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-7 sm:p-8 bg-card border border-border shadow-soft"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[var(--leo-blue)]/10 text-[var(--leo-blue)]">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-serif font-bold text-xl">Eligibility</h3>
            </div>
            <ul className="space-y-3">
              {membershipEligibility.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px]">
                  <span className="mt-0.5 flex-shrink-0 inline-flex items-center justify-center h-5 w-5 rounded-full bg-[var(--leo-gold)]/20 text-[#8B6510]">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-muted-foreground leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Application CTA */}
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="relative rounded-3xl p-7 sm:p-8 bg-gradient-to-br from-[var(--leo-blue)] to-[#0A2A66] text-white shadow-premium overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid opacity-15" />
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl"
              style={{ background: "#F4C542", opacity: 0.25 }}
            />
            <div className="relative">
              <Badge className="bg-white/15 text-white border-white/20 backdrop-blur">
                Apply Now
              </Badge>
              <h3 className="mt-4 text-2xl sm:text-3xl font-serif font-bold leading-tight">
                Ready to start your Leo journey?
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/80">
                Submit your expression of interest and our Membership Director
                will reach out within 7 working days to schedule an orientation
                session.
              </p>

              <div className="mt-6 space-y-2.5">
                {[
                  "Fill out the membership enquiry form",
                  "Attend an orientation session",
                  "Meet the Executive Board",
                  "Begin your Leoistic journey",
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#F4C542] text-[#0B1A33] font-serif font-bold text-xs">
                      {i + 1}
                    </span>
                    <span className="text-[13.5px] text-white/90">{step}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                className="mt-7 w-full sm:w-auto rounded-full bg-[#F4C542] hover:bg-[#E8B534] text-[#0B1A33] font-semibold px-7"
              >
                <a href="#contact" className="gap-2">
                  Submit Enquiry
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* FAQs */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="FAQs"
            title="Questions, answered."
            description="Everything you need to know before you consider joining the Leo Club of Pokhara."
          />

          <div className="mt-10 max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {membershipFaqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="rounded-2xl px-5 sm:px-6 bg-card border border-border shadow-soft data-[state=open]:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="text-left text-[15px] font-serif font-semibold hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[13.5px] leading-relaxed text-muted-foreground pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
