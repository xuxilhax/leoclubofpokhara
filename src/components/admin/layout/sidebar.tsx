"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Sparkles } from "lucide-react";
import { navGroups } from "../nav-config";
import { useAdmin } from "../admin-context";
import { LeoLogo } from "@/components/brand/leo-logo";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function Sidebar({
  open,
  onClose,
  pendingCounts,
}: {
  open: boolean;
  onClose: () => void;
  pendingCounts?: { applications?: number; notifications?: number };
}) {
  const { module: active, setModule } = useAdmin();

  const handleNav = (id: typeof active) => {
    setModule(id);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-50 lg:z-30 h-screen w-72 shrink-0 bg-card border-r border-border flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Leo Club CMS home">
            <LeoLogo size="sm" />
            <div className="flex flex-col leading-none">
              <span className="font-serif font-bold text-[14px]">Leo Club</span>
              <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-muted-foreground">
                Admin CMS
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto scroll-premium px-3 py-4" aria-label="CMS navigation">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <div className="px-3 mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                {group.label}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = active === item.id;
                  const Icon = item.icon;
                  const badgeCount =
                    item.id === "applications"
                      ? pendingCounts?.applications
                      : item.id === "notifications"
                      ? pendingCounts?.notifications
                      : undefined;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNav(item.id)}
                        className={cn(
                          "group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-soft"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        {badgeCount && badgeCount > 0 ? (
                          <Badge
                            variant="secondary"
                            className="h-5 min-w-5 px-1.5 text-[10px] justify-center bg-[var(--leo-red)] text-white"
                          >
                            {badgeCount}
                          </Badge>
                        ) : (
                          <ChevronRight
                            className={cn(
                              "h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition-opacity",
                              isActive && "opacity-0"
                            )}
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-border shrink-0">
          <button
            onClick={() => window.open("/", "_blank")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
          >
            <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-[var(--leo-blue)] to-[var(--leo-red)] text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-[12.5px] font-semibold truncate">View Public Site</div>
              <div className="text-[11px] text-muted-foreground truncate">leoclubofpokhara.org.np</div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </aside>
    </>
  );
}
