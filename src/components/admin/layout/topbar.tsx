"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, Search, Bell, Sun, Moon, ChevronDown, LogOut, UserCircle,
  Settings as SettingsIcon, Command,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAdmin } from "../admin-context";
import { allModules, navGroups } from "../nav-config";
import { ROLE_LABELS } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Topbar({
  onMenuClick,
  pendingCounts,
  notifications,
  onNotificationRead,
}: {
  onMenuClick: () => void;
  pendingCounts?: { applications?: number; notifications?: number };
  notifications?: { id: string; title: string; message: string; type: string; isRead: boolean; createdAt: Date; link?: string | null }[];
  onNotificationRead?: (id: string) => void;
}) {
  const { setModule, setCommandOpen, user, setUser, module: useAdminModule } = useAdmin();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const currentModule = allModules.find((m) => m.id === useAdminModule);
  const currentGroup = navGroups.find((g) => g.items.some((i) => i.id === useAdminModule));

  const handleLogout = async () => { window.location.href = "/";
    await logoutAction();
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="h-full px-4 sm:px-6 flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-muted transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-[13px]">
          <span className="text-muted-foreground">{currentGroup?.label}</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-medium text-foreground">{currentModule?.label}</span>
        </div>

        {/* Search trigger */}
        <button
          onClick={() => setCommandOpen(true)}
          className="ml-auto flex items-center gap-2.5 h-9 pl-3 pr-2 rounded-full bg-muted/60 border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-[13px] w-44 sm:w-64"
          aria-label="Open command palette"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search…</span>
          <kbd className="ml-auto inline-flex items-center gap-0.5 px-1.5 h-6 rounded bg-background border border-border text-[10px] font-mono font-medium">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 hover:bg-muted"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {mounted ? (
            resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4 opacity-0" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full h-9 w-9 hover:bg-muted"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {pendingCounts?.notifications ? (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--leo-red)] ring-2 ring-background" />
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="font-serif font-semibold text-[14px]">Notifications</div>
              {pendingCounts?.notifications ? (
                <span className="text-[11px] text-muted-foreground">
                  {pendingCounts.notifications} unread
                </span>
              ) : null}
            </div>
            <div className="max-h-96 overflow-y-auto scroll-premium">
              {notifications && notifications.length > 0 ? (
                notifications.slice(0, 8).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => onNotificationRead?.(n.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 border-b border-border/60 hover:bg-muted/50 transition-colors flex gap-3",
                      !n.isRead && "bg-primary/[0.03]"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-2 w-2 rounded-full shrink-0",
                        n.type === "success" ? "bg-green-500" : n.type === "warning" ? "bg-[var(--leo-gold)]" : n.type === "error" ? "bg-[var(--leo-red)]" : "bg-[var(--leo-blue)]"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium truncate">{n.title}</div>
                      <div className="text-[12px] text-muted-foreground line-clamp-2">{n.message}</div>
                      <div className="text-[10.5px] text-muted-foreground/70 mt-1">
                        {new Date(n.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-10 text-center text-[13px] text-muted-foreground">
                  No notifications yet.
                </div>
              )}
            </div>
            <div className="border-t border-border">
              <button
                onClick={() => setModule("notifications")}
                className="w-full px-4 py-2.5 text-[12.5px] font-medium text-primary hover:bg-muted/50 transition-colors"
              >
                View all notifications
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-full hover:bg-muted transition-colors">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-to-br from-[var(--leo-blue)] to-[var(--leo-red)] text-white text-[11px] font-semibold">
                  {user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-[12.5px] font-medium">{user?.name}</span>
                <span className="text-[10.5px] text-muted-foreground">
                  {user ? ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || user.role : ""}
                </span>
              </div>
              <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-[13px] font-medium">{user?.name}</span>
                <span className="text-[11px] text-muted-foreground font-normal">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setModule("settings")}>
              <UserCircle className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setModule("settings")}>
              <SettingsIcon className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-[var(--leo-red)] focus:text-[var(--leo-red)]">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
