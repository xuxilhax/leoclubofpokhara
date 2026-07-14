"use client";

import * as React from "react";
import Image from "next/image";
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

export function Footer({ content }: { content?: Record<string, string> } = {}) {
  const c = content || {};
  const socialIcons = [
    { Icon: Facebook, href: c.social_facebook || siteConfig.social.facebook, label: "Facebook" },
    { Icon: Instagram, href: c.social_instagram || siteConfig.social.instagram, label: "Instagram" },
    { Icon: Twitter, href: c.social_twitter || siteConfig.social.twitter, label: "Twitter" },
    { Icon: Linkedin, href: c.social_linkedin || siteConfig.social.linkedin, label: "LinkedIn" },
    { Icon: Youtube, href: c.social_youtube || siteConfig.social.youtube, label: "YouTube" },
  ];
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
              {c.footer_description || `A youth service organization chartered on ${c.club_charter_date || siteConfig.charterDate}, under the sponsorship of the ${c.club_sponsor || siteConfig.charterSponsor}. Cultivating leadership, experience, and opportunity through service since ${siteConfig.charterYear}.`}
            </p>

            {/* Motto */}
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#F4C542]">
              <span className="w-1 h-1 rounded-full bg-[#F4C542]" />
              {c.club_motto || siteConfig.motto}
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
                href={`mailto:${c.contact_email || siteConfig.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                {c.contact_email || siteConfig.email}
              </a>
              <a
                href={`tel:${(c.contact_phone || siteConfig.phone).replace(/\s/g, "")}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                {c.contact_phone || siteConfig.phone}
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>{c.contact_address || siteConfig.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/50 text-center sm:text-left">
            © {new Date().getFullYear()} {c.club_name || siteConfig.name}. All rights reserved. ·
            Chartered {c.club_charter_date || siteConfig.charterDate} · {c.club_district || siteConfig.district}
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

/** Logo emblem for the footer — uses the official Leo Club logo PNG */
function LogoEmblemLight({
  width = 44,
  height = 44,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src="/logo-128.png"
      alt="Leo Club of Pokhara emblem"
      width={width}
      height={height}
      className="object-contain rounded-lg"
    />
  );
}
