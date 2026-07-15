"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { siteConfig, PLACEHOLDER } from "@/lib/site-config";

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Please enter a valid email",
        description: "We couldn't recognize that email address.",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        setSubmitted(true);
        toast({
          title: data.alreadySubscribed ? "You're already subscribed!" : "You're subscribed.",
          description: "Welcome to the Leo Pokhara newsletter.",
        });
        setEmail("");
      } else {
        const err = await res.json();
        toast({ title: "Subscription failed", description: err.error || "Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", description: "Please check your connection.", variant: "destructive" });
    }
  };

  return (
    <section id="newsletter" className="relative py-20 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-5xl section-pad">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-border shadow-premium"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0546A0] via-[#032D6B] to-[#060B16]" />
          <div className="absolute inset-0 bg-grid opacity-15" />
          <div
            className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl"
            style={{ background: "#F4C542", opacity: 0.2 }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-3xl"
            style={{ background: "#E00121", opacity: 0.18 }}
          />

          <div className="relative p-8 sm:p-12 lg:p-16 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-[#F4C542] mb-6">
              <Mail className="h-6 w-6" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Stay in the loop.
            </h2>
            <p className="mt-4 text-white/75 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Receive quarterly updates on our initiatives, upcoming events, and
              opportunities to serve with the Leo Club of Pokhara.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/15 border border-white/20 backdrop-blur text-white"
              >
                <Check className="h-4 w-4 text-[#F4C542]" />
                <span className="text-sm font-medium">
                  You're subscribed — thank you!
                </span>
              </motion.div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="mt-8 flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur focus-visible:ring-[#F4C542]/40 focus-visible:border-[#F4C542]/40"
                  aria-label="Email address"
                  required
                />
                <Button
                  type="submit"
                  className="h-12 px-6 rounded-full bg-[#F4C542] hover:bg-[#E8B534] text-[#0B1A33] font-semibold gap-1.5 shrink-0"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            )}

            <p className="mt-5 text-[12px] text-white/50">
              We respect your privacy. Unsubscribe anytime. {PLACEHOLDER}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
