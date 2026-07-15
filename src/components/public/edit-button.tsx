"use client";

import { Pencil } from "lucide-react";

/**
 * EditButton — shows a small "Edit" button on any public site section.
 * Clicking it takes you to the admin module that edits that section.
 *
 * Usage: <EditButton module="homepage" label="Edit Hero" />
 */
export function EditButton({
  module,
  label = "Edit",
}: {
  module: string;
  tab?: string;
  label?: string;
}) {
  return (
    <a
      href={`/?admin=1#${module}`}
      className="absolute top-3 right-3 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--leo-blue)] text-white text-[11px] font-semibold shadow-premium hover:bg-[var(--leo-blue)]/90 transition-colors"
    >
      <Pencil className="h-3 w-3" />
      {label}
    </a>
  );
}

/**
 * EditableSection — wraps any section with an Edit button.
 */
export function EditableSection({
  children,
  module,
  label,
  className = "",
}: {
  children: React.ReactNode;
  module: string;
  tab?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <EditButton module={module} label={label} />
      {children}
    </div>
  );
}
