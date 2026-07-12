"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Clock,
} from "lucide-react";
import { SectionHeading, GoldDivider } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from "@/lib/site-config";

const socialIcons = [
  { platform: "Facebook", Icon: Facebook, href: siteConfig.social.facebook },
  { platform: "Instagram", Icon: Instagram, href: siteConfig.social.instagram },
  { platform: "Twitter", Icon: Twitter, href: siteConfig.social.twitter },
  { platform: "LinkedIn", Icon: Linkedin, href: siteConfig.social.linkedin },
  { platform: "YouTube", Icon: Youtube, href: siteConfig.social.youtube },
];

const contactCards = [
  {
    Icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    Icon: Phone,
    label: "Phone",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
  },
  {
    Icon: MapPin,
    label: "Address",
    value: siteConfig.address,
    href: "#",
  },
  {
    Icon: Clock,
    label: "Office Hours",
    value: "Sat–Thu · 10:00 AM – 5:00 PM NPT",
    href: "#",
  },
];

export function Contact() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate async submission
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Message sent.",
        description:
          "Thank you for reaching out. Our team will respond within 2–3 working days.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <section id="contact" className="relative section-py">
      <div className="mx-auto max-w-7xl section-pad">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Let's start a <span className="text-gradient-blue">conversation.</span>
            </>
          }
          description="Whether you're interested in joining, partnering, volunteering, or simply learning more — we'd love to hear from you."
        />

        <GoldDivider className="mt-10" />

        <div className="mt-14 grid lg:grid-cols-12 gap-6">
          {/* Left — contact info & map */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactCards.map(({ Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="group rounded-2xl p-5 bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all"
                >
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary/[0.08] text-primary mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                    {label}
                  </div>
                  <div className="mt-1 text-[13.5px] font-medium text-foreground leading-snug">
                    {value}
                  </div>
                </a>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-soft aspect-[4/3] bg-muted">
              {/* Stylized map background */}
              <svg
                viewBox="0 0 400 300"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <linearGradient id="map-bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#E8F0F8" />
                    <stop offset="100%" stopColor="#D5E3F0" />
                  </linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#map-bg)" />
                {/* Roads */}
                <path d="M0 200 Q 100 180, 200 195 T 400 180" stroke="#FFFFFF" strokeWidth="6" fill="none" />
                <path d="M0 200 Q 100 180, 200 195 T 400 180" stroke="#9DB8E0" strokeWidth="1.5" fill="none" strokeDasharray="6 6" />
                <path d="M50 0 Q 80 100, 100 200 T 150 300" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                <path d="M250 0 Q 280 120, 300 200 T 350 300" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                {/* Phewa Lake */}
                <ellipse cx="200" cy="220" rx="55" ry="25" fill="#7FB3DA" opacity="0.6" />
                <ellipse cx="200" cy="220" rx="55" ry="25" fill="none" stroke="#5A9BC9" strokeWidth="1" />
                {/* Buildings */}
                <rect x="80" y="80" width="14" height="14" fill="#C5D5E5" />
                <rect x="100" y="85" width="18" height="12" fill="#C5D5E5" />
                <rect x="130" y="78" width="16" height="16" fill="#C5D5E5" />
                <rect x="240" y="100" width="14" height="14" fill="#C5D5E5" />
                <rect x="260" y="105" width="20" height="14" fill="#C5D5E5" />
                <rect x="290" y="95" width="14" height="14" fill="#C5D5E5" />
                <rect x="150" y="155" width="14" height="14" fill="#C5D5E5" />
                <rect x="170" y="160" width="18" height="12" fill="#C5D5E5" />
                <rect x="240" y="160" width="14" height="14" fill="#C5D5E5" />
              </svg>

              {/* Map pin */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative">
                  <span className="absolute inset-0 rounded-full bg-[#F13333]/30 animate-ping" />
                  <span className="relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#F13333] text-white shadow-premium">
                    <MapPin className="h-5 w-5" />
                  </span>
                </div>
              </motion.div>

              {/* Caption */}
              <div className="absolute bottom-3 left-3 right-3 glass-strong rounded-xl p-3 text-[12px]">
                <div className="font-serif font-semibold">Pokhara, Nepal</div>
                <div className="text-muted-foreground text-[11px]">
                  Interactive map will replace this placeholder.
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="rounded-2xl p-5 bg-card border border-border">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-3">
                Follow Us
              </div>
              <div className="flex flex-wrap gap-2">
                {socialIcons.map(({ platform, Icon, href }) => (
                  <a
                    key={platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted hover:bg-[var(--leo-blue)] hover:text-white text-muted-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 rounded-3xl p-7 sm:p-9 bg-card border border-border shadow-soft"
          >
            <h3 className="font-serif font-bold text-2xl">Send us a message</h3>
            <p className="mt-2 text-[14px] text-muted-foreground">
              Fill in the form below and we'll respond within 2–3 working days.
            </p>

            <form onSubmit={onSubmit} className="mt-7 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[13px]">
                    Full Name <span className="text-[var(--leo-red)]">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[13px]">
                    Email <span className="text-[var(--leo-red)]">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[13px]">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+977 98XXXXXXXX"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-[13px]">
                    I'm interested in <span className="text-[var(--leo-red)]">*</span>
                  </Label>
                  <Select required>
                    <SelectTrigger id="subject" className="h-11 rounded-xl">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="membership">Becoming a member</SelectItem>
                      <SelectItem value="volunteer">Volunteering</SelectItem>
                      <SelectItem value="partnership">Partnership / sponsorship</SelectItem>
                      <SelectItem value="media">Media & press</SelectItem>
                      <SelectItem value="general">General enquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[13px]">
                  Message <span className="text-[var(--leo-red)]">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us a little about why you're reaching out..."
                  required
                  rows={5}
                  className="rounded-xl resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <p className="text-[12px] text-muted-foreground max-w-xs">
                  By submitting, you agree to be contacted by the Leo Club of
                  Pokhara. We respect your privacy.
                </p>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white px-7 h-11 gap-2 shrink-0"
                >
                  {submitting ? "Sending..." : "Send Message"}
                  {!submitting && <Send className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
