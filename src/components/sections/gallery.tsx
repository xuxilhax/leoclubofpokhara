"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { SectionHeading, GoldDivider } from "@/components/section-heading";
import { galleryImages, galleryCategories, PLACEHOLDER } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/** Deterministic gradient SVG per image seed — gives every gallery item a unique look */
function GalleryArt({ seed, category }: { seed: string; category: string }) {
  // Generate a stable hash from the seed
  const hash = React.useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return h;
  }, [seed]);

  const palettes: Record<string, [string, string, string]> = {
    Service: ["#E00121", "#8B0A14", "#FFD4D4"],
    Events: ["#0546A0", "#032D6B", "#9DB8E8"],
    Fellowship: ["#2E7BD3", "#0546A0", "#A0C8F0"],
    Awards: ["#F4C542", "#8B6510", "#FFE4A0"],
    Cultural: ["#8B0A14", "#3D0F0F", "#FFB8B8"],
  };
  const [c1, c2, accent] = palettes[category] || palettes.Service;
  const variant = hash % 4;
  const id = `grad-${seed}`;

  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id})`} />

      {variant === 0 && (
        <>
          {/* Mountain silhouette */}
          <path d="M0 220 L80 140 L140 180 L220 100 L300 170 L400 130 L400 300 L0 300 Z" fill="rgba(0,0,0,0.25)" />
          <path d="M0 260 L100 200 L180 230 L260 190 L360 220 L400 200 L400 300 L0 300 Z" fill="rgba(0,0,0,0.4)" />
          <circle cx="320" cy="70" r="22" fill={accent} opacity="0.85" />
        </>
      )}
      {variant === 1 && (
        <>
          {/* People silhouettes */}
          <circle cx="120" cy="140" r="20" fill="rgba(255,255,255,0.85)" />
          <rect x="105" y="160" width="30" height="50" rx="6" fill="rgba(255,255,255,0.85)" />
          <circle cx="200" cy="135" r="22" fill="rgba(255,255,255,0.7)" />
          <rect x="183" y="157" width="34" height="55" rx="6" fill="rgba(255,255,255,0.7)" />
          <circle cx="280" cy="145" r="18" fill="rgba(255,255,255,0.85)" />
          <rect x="266" y="163" width="28" height="48" rx="6" fill="rgba(255,255,255,0.85)" />
          <rect y="230" width="400" height="70" fill="rgba(0,0,0,0.3)" />
        </>
      )}
      {variant === 2 && (
        <>
          {/* Hands / heart */}
          <path d="M200 80 Q140 100 140 160 Q140 220 200 240 Q260 220 260 160 Q260 100 200 80 Z" fill="rgba(255,255,255,0.9)" />
          <circle cx="80" cy="80" r="14" fill={accent} opacity="0.6" />
          <circle cx="330" cy="220" r="18" fill={accent} opacity="0.4" />
          <circle cx="350" cy="60" r="10" fill="rgba(255,255,255,0.5)" />
        </>
      )}
      {variant === 3 && (
        <>
          {/* Tree / leaf */}
          <circle cx="200" cy="130" r="65" fill="rgba(255,255,255,0.85)" />
          <circle cx="160" cy="160" r="40" fill="rgba(255,255,255,0.7)" />
          <circle cx="240" cy="160" r="40" fill="rgba(255,255,255,0.7)" />
          <rect x="195" y="180" width="10" height="70" rx="4" fill="rgba(0,0,0,0.4)" />
          <circle cx="60" cy="60" r="12" fill={accent} opacity="0.7" />
          <circle cx="340" cy="240" r="16" fill={accent} opacity="0.5" />
        </>
      )}
    </svg>
  );
}

const heightClasses: Record<string, string> = {
  short: "h-48 sm:h-56",
  medium: "h-64 sm:h-72",
  tall: "h-80 sm:h-96",
};

export function Gallery({ overrideImages }: { overrideImages?: typeof galleryImages } = {}) {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const allImages = overrideImages || galleryImages;

  const filtered = React.useMemo(() => {
    if (active === "All") return allImages;
    return allImages.filter((img) => img.category === active);
  }, [active, allImages]);

  // Keyboard nav in lightbox
  React.useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i === null ? i : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) =>
          i === null ? i : (i - 1 + filtered.length) % filtered.length
        );
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, filtered.length]);

  return (
    <section id="gallery" className="relative section-py bg-muted/30">
      <div className="mx-auto max-w-7xl section-pad">
        <SectionHeading
          eyebrow="Gallery"
          title={
            <>
              Moments that <span className="text-gradient-blue">tell our story.</span>
            </>
          }
          description="A visual archive of our service initiatives, fellowship moments, awards, and cultural celebrations over the years."
        />

        <GoldDivider className="mt-10" />

        {/* Category filter */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[12.5px] font-medium transition-all",
                active === cat
                  ? "bg-[var(--leo-blue)] text-white shadow-soft"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="mt-10 masonry-cols">
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.button
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                onClick={() => setLightboxIndex(i)}
                className={cn(
                  "masonry-item group relative w-full overflow-hidden rounded-2xl border border-border shadow-soft hover:shadow-premium transition-all duration-300",
                  heightClasses[img.height]
                )}
                aria-label={`Open ${img.title} in lightbox`}
              >
                <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
                  <GalleryArt seed={img.seed} category={img.category} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                {/* Hover zoom icon */}
                <div className="absolute top-3 right-3 h-8 w-8 rounded-full glass-strong flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="h-3.5 w-3.5 text-foreground" />
                </div>
                {/* Caption */}
                <div className="absolute bottom-0 inset-x-0 p-4 text-left text-white">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-[#F4C542] font-semibold">
                    {img.category}
                  </div>
                  <div className="font-serif font-semibold text-[14px] mt-0.5">
                    {img.title}
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          {PLACEHOLDER} Full gallery with album organization coming soon.
        </p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close */}
            <button
              className="absolute top-5 right-5 h-11 w-11 rounded-full glass-strong flex items-center justify-center hover:bg-muted transition-colors z-10"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 sm:left-8 h-11 w-11 rounded-full glass-strong flex items-center justify-center hover:bg-muted transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) =>
                  i === null ? i : (i - 1 + filtered.length) % filtered.length
                );
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Next */}
            <button
              className="absolute right-4 sm:right-8 h-11 w-11 rounded-full glass-strong flex items-center justify-center hover:bg-muted transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) =>
                  i === null ? i : (i + 1) % filtered.length
                );
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl w-full max-h-[80vh] aspect-[4/3] rounded-2xl overflow-hidden shadow-premium"
              onClick={(e) => e.stopPropagation()}
            >
              <GalleryArt
                seed={filtered[lightboxIndex].seed}
                category={filtered[lightboxIndex].category}
              />
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/80 to-transparent text-white">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#F4C542] font-semibold">
                  {filtered[lightboxIndex].category}
                </div>
                <div className="font-serif font-bold text-xl mt-1">
                  {filtered[lightboxIndex].title}
                </div>
                <div className="text-xs text-white/60 mt-1">
                  {lightboxIndex + 1} of {filtered.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
