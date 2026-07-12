"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Brand logo for Leo Club of Pokhara.
 * Uses the official Leo Club logo PNG.
 *
 * - Compact: just the emblem (for mobile nav)
 * - Full: emblem + wordmark
 *
 * Sizes:
 * - sm: 32px — mobile nav, admin sidebar
 * - md: 44px — public navbar, footer
 * - lg: 56px — login screen, hero
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
  const dim = size === "sm" ? 32 : size === "lg" ? 56 : 44;
  const wordmarkSize = size === "sm" ? "text-[13px]" : size === "lg" ? "text-[18px]" : "text-[15px]";
  const subtextSize = size === "sm" ? "text-[9.5px]" : size === "lg" ? "text-[12px]" : "text-[11px]";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoEmblem width={dim} height={dim} />
      {variant === "full" && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-serif font-bold tracking-tight", wordmarkSize)}>
            Leo Club
          </span>
          <span className={cn("font-medium tracking-[0.14em] uppercase text-muted-foreground", subtextSize)}>
            of Pokhara
          </span>
        </span>
      )}
    </span>
  );
}

/**
 * LogoEmblem — the official Leo Club logo image.
 * Uses next/image with explicit width/height to prevent layout shift.
 */
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
    <Image
      src="/logo-128.png"
      alt="Leo Club of Pokhara emblem"
      width={width}
      height={height}
      className={cn("object-contain rounded-lg", className)}
      priority
    />
  );
}

/**
 * LogoFull — the full logo image (emblem only, larger format)
 * for use in hero sections, login screens, and about pages.
 */
export function LogoFull({
  width = 128,
  height = 128,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src="/logo-256.png"
      alt="Leo Club of Pokhara"
      width={width}
      height={height}
      className={cn("object-contain", className)}
      priority
    />
  );
}

/**
 * LogoTransparent — logo with white background removed,
 * for use on dark/colored backgrounds (hero, footer, login).
 */
export function LogoTransparent({
  width = 44,
  height = 44,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src="/logo-transparent-128.png"
      alt="Leo Club of Pokhara emblem"
      width={width}
      height={height}
      className={cn("object-contain", className)}
      priority
    />
  );
}
