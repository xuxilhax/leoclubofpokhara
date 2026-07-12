"use client";

import { cn } from "@/lib/utils";

/**
 * Brand logo for Leo Club of Pokhara.
 * - Compact: just the emblem (for mobile nav)
 * - Full: emblem + wordmark
 */
export function LeoLogo({
  variant = "full",
  className,
  size = "md",
}: {
  variant?: "full" | "compact";
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? 36 : size === "lg" ? 56 : 44;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoEmblem width={dim} height={dim} />
      {variant === "full" && (
        <span className="flex flex-col leading-none">
          <span className="font-serif font-bold text-[15px] tracking-tight">
            Leo Club
          </span>
          <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-muted-foreground">
            of Pokhara
          </span>
        </span>
      )}
    </span>
  );
}

export function LogoEmblem({
  width = 44,
  height = 44,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Leo Club of Pokhara emblem"
    >
      <defs>
        <linearGradient id="leo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F3D91" />
          <stop offset="100%" stopColor="#1E6FBA" />
        </linearGradient>
        <linearGradient id="leo-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4C542" />
          <stop offset="100%" stopColor="#C89530" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#leo-bg)" />
      <circle
        cx="32"
        cy="32"
        r="22"
        fill="none"
        stroke="url(#leo-gold)"
        strokeWidth="2.5"
      />
      <path
        d="M22 18 L22 46 L42 46 L42 40 L29 40 L29 18 Z"
        fill="#FFFFFF"
      />
      <circle cx="32" cy="13" r="2.4" fill="url(#leo-gold)" />
      <circle cx="32" cy="51" r="2.4" fill="url(#leo-gold)" />
    </svg>
  );
}
