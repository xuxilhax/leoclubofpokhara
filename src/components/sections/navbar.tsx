"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, Search } from "lucide-react";
import { mainNav, siteConfig } from "@/lib/site-config";
import { LeoLogo } from "@/components/brand/leo-logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar({ onSearchClick, navItems, content }: { onSearchClick?: () => void; navItems?: { label: string; href: string }[]; content?: Record<string, string> } = {}) {
  const c = content || {};
  const nav = navItems && navItems.length > 0 ? navItems : mainNav;
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("home");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // Track scroll position for the glass/background transition
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track the active section to highlight the nav item
  React.useEffect(() => {
    const sections = nav
      .map((n) => n.href.replace("#", ""))
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "py-2.5 bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-soft"
            : "py-4 bg-transparent"
        )}
      >
        <nav
          className="mx-auto max-w-7xl section-pad flex items-center justify-between gap-4"
          aria-label="Primary"
        >
          {/* Brand */}
          <Link
            href="#home"
            className="flex items-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
            aria-label={`${c.club_name || siteConfig.name} home`}
          >
            <LeoLogo />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {nav.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative px-3.5 py-2 text-[13.5px] font-medium rounded-full transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-primary/[0.08] border border-primary/15 -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {onSearchClick && (
              <button
                onClick={onSearchClick}
                className="hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-full bg-muted/60 border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-[12.5px]"
                aria-label="Search"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search</span>
                <kbd className="ml-1 px-1 py-0.5 rounded bg-background border border-border text-[9px] font-mono">⌘K</kbd>
              </button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-9 w-9 hover:bg-primary/[0.08]"
              aria-label="Toggle dark mode"
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )
              ) : (
                <Sun className="h-4 w-4 opacity-0" />
              )}
            </Button>

            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex rounded-full h-9 px-5 bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white shadow-soft"
            >
              <Link href="#membership">Join Us</Link>
            </Button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-primary/[0.08] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
              className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-background border-l border-border shadow-premium flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <LeoLogo size="sm" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ul className="flex flex-col p-3 overflow-y-auto scroll-premium">
                {nav.map((item, i) => {
                  const isActive = activeSection === item.href.replace("#", "");
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i + 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block px-4 py-3.5 rounded-xl text-[15px] font-medium transition-colors",
                          isActive
                            ? "bg-primary/[0.08] text-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="mt-auto p-5 border-t border-border space-y-3">
                <Button
                  asChild
                  className="w-full rounded-full bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white"
                >
                  <Link href="#membership" onClick={() => setMobileOpen(false)}>
                    Join the Club
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {c.club_motto || siteConfig.motto}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
