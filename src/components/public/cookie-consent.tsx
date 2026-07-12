"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "leo-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Show after a short delay
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: false, date: new Date().toISOString() }));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[440px] z-[90] rounded-2xl bg-card border border-border shadow-premium overflow-hidden"
        >
          <div className="p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[var(--leo-gold)]/15 text-[#8B6510] shrink-0">
                <Cookie className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-bold text-[14px]">We value your privacy</h3>
                <p className="mt-1 text-[12px] text-muted-foreground leading-relaxed">
                  We use cookies to improve your experience, analyze traffic, and remember your preferences.
                  You can choose to accept or decline non-essential cookies.
                </p>
              </div>
              <button
                onClick={handleDecline}
                className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-muted transition-colors shrink-0"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAccept}
                size="sm"
                className="flex-1 h-9 rounded-full bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white text-[12.5px]"
              >
                Accept all
              </Button>
              <Button
                onClick={handleDecline}
                variant="outline"
                size="sm"
                className="flex-1 h-9 rounded-full text-[12.5px]"
              >
                Decline
              </Button>
            </div>
            <p className="mt-2.5 text-[10.5px] text-muted-foreground text-center">
              By accepting, you agree to our use of cookies. Read our{" "}
              <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
