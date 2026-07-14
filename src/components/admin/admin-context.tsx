"use client";

import * as React from "react";

/**
 * Admin module IDs — single source of truth for navigation, command palette,
 * and routing within the SPA admin dashboard.
 */
export type AdminModule =
  | "dashboard"
  | "homepage"
  | "board"
  | "members"
  | "events"
  | "projects"
  | "gallery"
  | "news"
  | "applications"
  | "testimonials"
  | "sponsors"
  | "downloads"
  | "media"
  | "contact"
  | "messages"
  | "seo"
  | "analytics"
  | "notifications"
  | "audit"
  | "users"
  | "settings"
  | "backup";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string | null;
};

type AdminContextValue = {
  module: AdminModule;
  setModule: (m: AdminModule) => void;
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
  user: AdminUser | null;
  setUser: (u: AdminUser | null) => void;
};

const AdminContext = React.createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [module, setModule] = React.useState<AdminModule>("dashboard");
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [user, setUser] = React.useState<AdminUser | null>({
    id: "u_admin",
    email: "admin@leo.club",
    name: "Super Admin",
    role: "SUPER_ADMIN",
    avatarUrl: null,
  });

  // Cmd+K to toggle command palette
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Restore active module from URL hash on mount
  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && isValidModule(hash)) {
      setModule(hash as AdminModule);
    }
  }, []);

  // Sync module → URL hash
  React.useEffect(() => {
    if (module === "dashboard") {
      history.replaceState(null, "", window.location.pathname);
    } else {
      history.replaceState(null, "", `#${module}`);
    }
  }, [module]);

  return (
    <AdminContext.Provider
      value={{ module, setModule, commandOpen, setCommandOpen, user, setUser }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = React.useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

const VALID_MODULES: AdminModule[] = [
  "dashboard", "homepage", "board", "members", "events", "projects",
  "gallery", "news", "applications", "testimonials", "sponsors",
  "downloads", "media", "contact", "messages", "seo", "analytics",
  "notifications", "audit", "users", "settings", "backup",
];

function isValidModule(s: string): boolean {
  return (VALID_MODULES as string[]).includes(s);
}

export type { AdminUser };
