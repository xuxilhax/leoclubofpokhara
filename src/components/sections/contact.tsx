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

export function Contact({ content }: { content?: Record<string, string> } = {}) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const c = content || {};

  const contactCards = [
    {
      Icon: Mail,
      label: "Email",
      value: c.contact_email || siteConfig.email,
      href: `mailto:${c.contact_email || siteConfig.email}`,
    },
    {
      Icon: Phone,
      label: "Phone",
      value: c.contact_phone || siteConfig.phone,
      href: `tel:${(c.contact_phone || siteConfig.phone).replace(/\s/g, "")}`,
    },
    {
      Icon: MapPin,
      label: "Address",
      value: c.contact_address || siteConfig.address,
      href: "#",
    },
    {
      Icon: Clock,
      label: "Office Hours",
      value: c.contact_hours || "Sat–Thu · 10:00 AM – 5:00 PM NPT",
      href: "#",
    },
  ];

  const socialIcons = [
    { platform: "Facebook", Icon: Facebook, href: c.social_facebook || siteConfig.social.facebook },
    { platform: "Instagram", Icon: Instagram, href: c.social_instagram || siteConfig.social.instagram },
    { platform: "Twitter", Icon: Twitter, href: c.social_twitter || siteConfig.social.twitter },
    { platform: "LinkedIn", Icon: Linkedin, href: c.social_linkedin || siteConfig.social.linkedin },
    { platform: "YouTube", Icon: Youtube, href: c.social_youtube || siteConfig.social.youtube },
  ];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };
    if (!data.name || !data.email || !data.message) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast({
          title: "Message sent.",
          description: "Thank you for reaching out. Our team will respond within 2–3 working days.",
        });
        form.reset();
      } else {
        const err = await res.json();
        toast({ title: "Failed to send", description: err.error || "Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", description: "Please check your connection and try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
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

            {/* Google Maps embed of Pokhara, Nepal */}
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-soft aspect-[4/3] bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3514.7728506669017!2d83.99012!3d28.20962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39959580fffffffff%3A0x6d4b5f3e2a5c5b5b!2sPokhara!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0, position: "absolute", inset: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pokhara, Nepal - Leo Club Location"
              />
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
                  {mounted ? (
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
                ) : (
                  <select required name="subject" className="w-full h-11 rounded-xl border border-input bg-background px-3 text-[13px]">
                    <option value="">Select a topic</option>
                    <option value="membership">Becoming a member</option>
                    <option value="volunteer">Volunteering</option>
                    <option value="partnership">Partnership / sponsorship</option>
                    <option value="media">Media & press</option>
                    <option value="general">General enquiry</option>
                  </select>
                )}
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
