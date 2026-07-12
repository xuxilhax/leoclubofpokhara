"use client";

import * as React from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
} from "lucide-react";
import { LeoLogo } from "@/components/brand/leo-logo";
import { siteConfig, footerLinks } from "@/lib/site-config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const socialIcons = [
  { Icon: Facebook, href: siteConfig.social.facebook, label: "Facebook" },
  { Icon: Instagram, href: siteConfig.social.instagram, label: "Instagram" },
  { Icon: Twitter, href: siteConfig.social.twitter, label: "Twitter" },
  { Icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
  { Icon: Youtube, href: siteConfig.social.youtube, label: "YouTube" },
];

export function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Please enter a valid email",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail("");
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-auto bg-gradient-to-br from-[#060B16] via-[#0A1322] to-[#060B16] text-white overflow-hidden">
      {/* Decorative grid */}
      <div className="absolute inset-0 bg-grid opacity-[0.04]" />
      {/* Top gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--leo-gold)]/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl section-pad py-14 lg:py-20">
        {/* Top section */}
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Brand + description */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <LogoEmblemLight width={44} height={44} />
              <div className="flex flex-col leading-none">
                <span className="font-serif font-bold text-[15px]">Leo Club</span>
                <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-white/60">
                  of Pokhara
                </span>
              </div>
            </div>

            <p className="mt-5 text-[13.5px] leading-relaxed text-white/65 max-w-sm">
              A youth service organization chartered on {siteConfig.charterDate},
              under the sponsorship of the {siteConfig.charterSponsor}. Cultivating
              leadership, experience, and opportunity through service since{" "}
              {siteConfig.charterYear}.
            </p>

            {/* Motto */}
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#F4C542]">
              <span className="w-1 h-1 rounded-full bg-[#F4C542]" />
              {siteConfig.motto}
            </div>

            {/* Social */}
            <div className="mt-6 flex flex-wrap gap-2">
              {socialIcons.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/5 hover:bg-[var(--leo-blue)] border border-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links — 3 columns */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <FooterColumn title="The Club" links={footerLinks.club} />
            <FooterColumn title="Engage" links={footerLinks.engage} />
            <FooterColumn title="Connect" links={footerLinks.connect} />
          </div>

          {/* Newsletter mini */}
          <div className="lg:col-span-3">
            <h4 className="font-serif font-semibold text-[14px] mb-3">
              Newsletter
            </h4>
            <p className="text-[12.5px] text-white/60 leading-relaxed mb-4">
              Quarterly updates on our service initiatives and events.
            </p>
            <form onSubmit={onSubscribe} className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="h-10 rounded-full bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Button
                type="submit"
                className="w-full h-10 rounded-full bg-[var(--leo-gold)] hover:bg-[#E8B534] text-[#0B1A33] font-semibold text-[13px]"
              >
                Subscribe
              </Button>
            </form>

            {/* Contact mini */}
            <div className="mt-6 space-y-2 text-[12px] text-white/60">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                {siteConfig.email}
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                {siteConfig.phone}
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>{siteConfig.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/50 text-center sm:text-left">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved. ·
            Chartered {siteConfig.charterDate} · {siteConfig.district}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-[12px] text-white/50 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-[12px] text-white/50 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <button
              onClick={scrollTop}
              aria-label="Back to top"
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/5 hover:bg-[var(--leo-blue)] border border-white/10 text-white/70 hover:text-white transition-colors"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-serif font-semibold text-[14px] mb-3.5">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[12.5px] text-white/60 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Light-on-dark variant of the logo emblem for the footer */
function LogoEmblemLight({
  width = 44,
  height = 44,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Leo Club of Pokhara emblem"
    >
      <defs>
        <linearGradient id="footer-leo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F3D91" />
          <stop offset="100%" stopColor="#1E6FBA" />
        </linearGradient>
        <linearGradient id="footer-leo-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4C542" />
          <stop offset="100%" stopColor="#C89530" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#footer-leo-bg)" />
      <circle
        cx="32"
        cy="32"
        r="22"
        fill="none"
        stroke="url(#footer-leo-gold)"
        strokeWidth="2.5"
      />
      <path
        d="M22 18 L22 46 L42 46 L42 40 L29 40 L29 18 Z"
        fill="#FFFFFF"
      />
      <circle cx="32" cy="13" r="2.4" fill="url(#footer-leo-gold)" />
      <circle cx="32" cy="51" r="2.4" fill="url(#footer-leo-gold)" />
    </svg>
  );
}
