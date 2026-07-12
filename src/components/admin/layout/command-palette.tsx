"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import { useAdmin } from "../admin-context";
import { allModules } from "../nav-config";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const { commandOpen, setCommandOpen, setModule } = useAdmin();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    if (!query) return allModules;
    const q = query.toLowerCase();
    return allModules.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    );
  }, [query]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  React.useEffect(() => {
    if (commandOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [commandOpen]);

  const handleSelect = (id: string) => {
    setModule(id as never);
    setCommandOpen(false);
    setQuery("");
  };

  // Keyboard nav
  React.useEffect(() => {
    if (!commandOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) handleSelect(filtered[selectedIndex].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commandOpen, filtered, selectedIndex]);

  return (
    <AnimatePresence>
      {commandOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          onClick={() => setCommandOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.96, y: -8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: -8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl bg-card rounded-2xl border border-border shadow-premium overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search modules, pages, or actions…"
                className="flex-1 bg-transparent py-4 text-[14.5px] outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden sm:inline-flex items-center px-1.5 h-5 rounded bg-muted text-[10px] font-mono">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto scroll-premium p-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-10 text-center text-[13px] text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filtered.map((item, i) => {
                  const Icon = item.icon;
                  const isSelected = i === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => setSelectedIndex(i)}
                      onClick={() => handleSelect(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-left",
                        isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
                      <div className="flex-1 min-w-0">
                        <div className={cn("text-[13.5px] font-medium", isSelected ? "text-primary-foreground" : "text-foreground")}>
                          {item.label}
                        </div>
                        <div className={cn("text-[11.5px] truncate", isSelected ? "text-primary-foreground/70" : "text-muted-foreground")}>
                          {item.description}
                        </div>
                      </div>
                      {isSelected && <CornerDownLeft className="h-3.5 w-3.5 text-primary-foreground/70" />}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  <ArrowDown className="h-3 w-3" />
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <CornerDownLeft className="h-3 w-3" />
                  to select
                </span>
              </div>
              <span>Leo Club CMS</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
