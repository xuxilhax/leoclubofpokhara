"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Newspaper, Calendar, Target, Users, Download } from "lucide-react";

type SearchResult = {
  id: string;
  type: "news" | "event" | "project" | "member" | "download" | "page";
  title: string;
  description: string;
  url: string;
  date?: string;
  category?: string;
};

const typeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  news: { icon: Newspaper, label: "News", color: "text-[var(--leo-blue)]" },
  event: { icon: Calendar, label: "Event", color: "text-[var(--leo-red)]" },
  project: { icon: Target, label: "Project", color: "text-green-600" },
  member: { icon: Users, label: "Member", color: "text-[#8B6510]" },
  download: { icon: Download, label: "Download", color: "text-purple-600" },
  page: { icon: ArrowRight, label: "Page", color: "text-muted-foreground" },
};

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // Debounced search
  React.useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setSelectedIndex(0);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard nav
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        window.location.href = results[selectedIndex].url;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, selectedIndex]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.96, y: -8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: -8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-card rounded-2xl border border-border shadow-premium overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search news, events, projects, members…"
                className="flex-1 bg-transparent py-4 text-[15px] outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto scroll-premium p-2">
              {loading && (
                <div className="px-4 py-8 text-center text-[13px] text-muted-foreground">
                  Searching…
                </div>
              )}
              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <div className="px-4 py-12 text-center">
                  <div className="text-[14px] font-medium text-foreground mb-1">No results found</div>
                  <div className="text-[12.5px] text-muted-foreground">
                    Try different keywords or check your spelling.
                  </div>
                </div>
              )}
              {!loading && results.length > 0 && (
                results.map((r, i) => {
                  const config = typeConfig[r.type] || typeConfig.page;
                  const Icon = config.icon;
                  const isSelected = i === selectedIndex;
                  return (
                    <a
                      key={`${r.type}-${r.id}`}
                      href={r.url}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isSelected ? "bg-primary/[0.06]" : "hover:bg-muted/50"}`}
                    >
                      <div className={`inline-flex items-center justify-center h-9 w-9 rounded-lg bg-muted shrink-0 ${config.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13.5px] font-medium truncate">{r.title}</span>
                          <span className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                            {config.label}
                          </span>
                        </div>
                        <div className="text-[12px] text-muted-foreground truncate mt-0.5">{r.description}</div>
                      </div>
                      {r.date && (
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </a>
                  );
                })
              )}
              {!loading && query.trim().length < 2 && (
                <div className="px-4 py-12 text-center text-[13px] text-muted-foreground">
                  Type at least 2 characters to search across news, events, projects, and members.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-muted/30 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span>esc close</span>
              </div>
              <span>Powered by Leo Club CMS</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
