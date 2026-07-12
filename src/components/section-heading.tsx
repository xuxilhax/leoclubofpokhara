"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SectionHeading — reusable, premium, eyebrow + title + optional description.
 * Used across every major section for typographic consistency.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 max-w-3xl",
        align === "center" ? "items-center text-center mx-auto" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase text-primary/80 border border-primary/15 bg-primary/[0.04]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--leo-gold)]" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}

/** Decorative divider with a gold accent */
export function GoldDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--leo-gold)]/60" />
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--leo-gold)]" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--leo-gold)]/60" />
    </div>
  );
}
