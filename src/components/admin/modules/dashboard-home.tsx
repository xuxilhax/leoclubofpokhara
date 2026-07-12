"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Users, Calendar, Target, FileText, Image as ImageIcon, Newspaper,
  Award, Eye, TrendingUp, TrendingDown, ArrowUpRight, Bell,
  Clock, ChevronRight, Activity, UserPlus, Mail, CheckCircle2,
} from "lucide-react";
import { useAdmin } from "../admin-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Stats = {
  members: number;
  activeProjects: number;
  upcomingEvents: number;
  pendingApplications: number;
  galleryImages: number;
  publishedNews: number;
  sponsors: number;
  unreadNotifications: number;
  visitors: number;
  visitorChange: number;
  recentAuditLogs: { id: string; userName: string; action: string; module: string; details: string | null; createdAt: Date }[];
  recentApplications: { id: string; name: string; email: string; createdAt: Date; status: string }[];
  upcomingEventsList: { id: string; title: string; startDate: Date; location: string; category: string }[];
};

const STAT_CARDS = [
  { key: "visitors", label: "Website Visitors", icon: Eye, changeKey: "visitorChange", color: "from-[#0F3D91] to-[#1E6FBA]" },
  { key: "members", label: "Total Members", icon: Users, color: "from-[#F13333] to-[#C82525]" },
  { key: "activeProjects", label: "Active Projects", icon: Target, color: "from-[#2D7A3D] to-[#15401E]" },
  { key: "upcomingEvents", label: "Upcoming Events", icon: Calendar, color: "from-[#F4C542] to-[#C89530]" },
  { key: "pendingApplications", label: "Pending Applications", icon: FileText, color: "from-[#7A1A1A] to-[#3D0F0F]" },
  { key: "galleryImages", label: "Gallery Images", icon: ImageIcon, color: "from-[#0F3D91] to-[#0A2A66]" },
  { key: "publishedNews", label: "Published News", icon: Newspaper, color: "from-[#7B2D8E] to-[#3D1647]" },
  { key: "sponsors", label: "Active Sponsors", icon: Award, color: "from-[#1E6FBA] to-[#0F3D91]" },
] as const;

const QUICK_ACTIONS = [
  { module: "events", label: "New Event", icon: Calendar, color: "bg-[var(--leo-blue)]/10 text-[var(--leo-blue)]" },
  { module: "members", label: "Add Member", icon: UserPlus, color: "bg-[var(--leo-red)]/10 text-[var(--leo-red)]" },
  { module: "news", label: "Write Article", icon: Newspaper, color: "bg-[var(--leo-gold)]/10 text-[#C89530]" },
  { module: "gallery", label: "Upload Photos", icon: ImageIcon, color: "bg-green-500/10 text-green-600" },
] as const;

export function DashboardHome({ stats }: { stats: Stats }) {
  const { setModule } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[var(--leo-blue)] via-[#0A2A66] to-[#060B16] text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl" style={{ background: "#F4C542", opacity: 0.2 }} />
        <div className="relative">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#F4C542] font-semibold">
            Leoistic Year 2025–2026
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-serif font-bold">
            Welcome back to the Leo Pokhara dashboard.
          </h1>
          <p className="mt-2 text-[14px] text-white/70 max-w-2xl">
            Here&apos;s a snapshot of your club today — {stats.members} active members,
            {" "}{stats.upcomingEvents} upcoming events, and {stats.pendingApplications} membership
            applications awaiting review.
          </p>
        </div>
      </motion.div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => {
          const Icon = card.icon;
          const value = stats[card.key as keyof Stats] as number;
          const change = (card as { changeKey?: string }).changeKey
            ? (stats[(card as { changeKey: string }).changeKey as keyof Stats] as number)
            : null;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Card className="overflow-hidden hover:shadow-premium transition-shadow group cursor-pointer" onClick={() => setModule(card.key === "visitors" ? "analytics" : card.key === "pendingApplications" ? "applications" : card.key === "galleryImages" ? "gallery" : card.key === "publishedNews" ? "news" : card.key === "sponsors" ? "sponsors" : card.key === "upcomingEvents" ? "events" : card.key === "activeProjects" ? "projects" : "members")}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className={cn("inline-flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br text-white", card.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {change !== null && (
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded",
                        change >= 0 ? "text-green-600 bg-green-500/10" : "text-[var(--leo-red)] bg-[var(--leo-red)]/10"
                      )}>
                        {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(change)}%
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl sm:text-3xl font-serif font-bold tracking-tight tabular-nums">
                      {value.toLocaleString("en-US")}
                    </div>
                    <div className="mt-1 text-[12.5px] text-muted-foreground">{card.label}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[15px]">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => setModule(action.module as never)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all group text-left"
                >
                  <span className={cn("inline-flex items-center justify-center h-10 w-10 rounded-lg", action.color)}>
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-[13px] font-medium flex-1">{action.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Two-column: Recent Activity + Upcoming Events */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent activity */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-[15px] flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Recent Activity
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setModule("audit")} className="text-[12px] h-7 gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {stats.recentAuditLogs.length === 0 ? (
                <div className="text-center py-8 text-[13px] text-muted-foreground">No recent activity.</div>
              ) : (
                stats.recentAuditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 py-2.5 px-2 -mx-2 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className="mt-0.5 inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary shrink-0">
                      <Activity className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px]">
                        <span className="font-medium">{log.userName}</span>{" "}
                        <span className="text-muted-foreground">{log.action.toLowerCase()}</span>{" "}
                        <Badge variant="outline" className="ml-1 text-[10px] h-4 px-1">{log.module}</Badge>
                      </div>
                      {log.details && (
                        <div className="text-[11.5px] text-muted-foreground truncate mt-0.5">{log.details}</div>
                      )}
                      <div className="text-[10.5px] text-muted-foreground/70 mt-0.5">
                        {formatRelativeTime(log.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming events */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-[15px] flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Upcoming Events
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setModule("events")} className="text-[12px] h-7 gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.upcomingEventsList.length === 0 ? (
                <div className="text-center py-8 text-[13px] text-muted-foreground">No upcoming events.</div>
              ) : (
                stats.upcomingEventsList.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-all">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex flex-col items-center justify-center">
                      <span className="text-[10px] uppercase font-semibold leading-none">
                        {new Date(event.startDate).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="font-serif font-bold text-lg leading-none mt-0.5">
                        {new Date(event.startDate).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium truncate">{event.title}</div>
                      <div className="text-[11.5px] text-muted-foreground truncate">{event.location}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px] h-5">{event.category}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending applications */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-[15px] flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-muted-foreground" />
            Recent Membership Applications
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setModule("applications")} className="text-[12px] h-7 gap-1">
            Review all <ChevronRight className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.recentApplications.length === 0 ? (
              <div className="text-center py-8 text-[13px] text-muted-foreground">No recent applications.</div>
            ) : (
              stats.recentApplications.map((app) => (
                <div key={app.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-all">
                  <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-[var(--leo-blue)] to-[var(--leo-red)] text-white font-serif font-bold text-[13px]">
                    {app.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate">{app.name}</div>
                    <div className="text-[11.5px] text-muted-foreground truncate">{app.email}</div>
                  </div>
                  <div className="text-[11px] text-muted-foreground hidden sm:block">
                    {formatRelativeTime(app.createdAt)}
                  </div>
                  <Badge
                    className={
                      app.status === "PENDING" ? "bg-[var(--leo-gold)]/20 text-[#8B6510] border-[var(--leo-gold)]/30" :
                      app.status === "APPROVED" ? "bg-green-500/15 text-green-700 border-green-500/30" :
                      app.status === "REJECTED" ? "bg-[var(--leo-red)]/15 text-[var(--leo-red)] border-[var(--leo-red)]/30" :
                      "bg-muted text-muted-foreground"
                    }
                    variant="outline"
                  >
                    {app.status.toLowerCase()}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}
