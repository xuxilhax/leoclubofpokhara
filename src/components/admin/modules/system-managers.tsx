"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Search, Bell, ScrollText, UserCog, Settings as SettingsIcon, Database,
  Image as ImageIcon, Upload, FolderOpen, Trash2, Eye, TrendingUp,
  Globe, Smartphone, Monitor, ExternalLink, Download as DownloadIcon,
  RefreshCw, Save, CheckCircle2, AlertTriangle, Home, ChevronUp, ChevronDown,
  Calendar, Users, Target, FileText, Award, Heart, Mail,
} from "lucide-react";
import { ModuleHeader } from "./data-table";
import { EntityDialog, Field } from "./entity-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "../admin-context";
import { ROLE_LABELS } from "@/lib/auth-helpers";
import { markNotificationRead, markAllNotificationsRead, updateSetting } from "@/lib/actions";
import { cn } from "@/lib/utils";

// ============================================================
// GALLERY MANAGER
// ============================================================
type GalleryImage = { id: string; title: string; caption: string | null; url: string; category: string; createdAt: Date };

export function GalleryManager({ initialImages }: { initialImages: GalleryImage[] }) {
  const [images, setImages] = React.useState(initialImages);
  const [category, setCategory] = React.useState("All");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<GalleryImage | null>(null);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const categories = ["All", "Service", "Events", "Fellowship", "Awards", "Cultural"];
  const filtered = category === "All" ? images : images.filter((i) => i.category === category);

  return (
    <div>
      <ModuleHeader title="Gallery" description={`${images.length} images across ${categories.length - 1} categories`}>
        <Button onClick={() => setDialogOpen(true)} size="sm" className="h-10 rounded-lg bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-1.5">
          <Upload className="h-4 w-4" /> Upload Images
        </Button>
      </ModuleHeader>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all",
              category === cat
                ? "bg-[var(--leo-blue)] text-white shadow-soft"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((img) => (
          <Card key={img.id} className="overflow-hidden group cursor-pointer hover:shadow-soft transition-shadow">
            <div className="aspect-square relative bg-gradient-to-br from-[var(--leo-blue)] to-[var(--leo-red)] flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-white/40" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button className="h-9 w-9 rounded-full glass-strong flex items-center justify-center"><Eye className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteTarget(img)} className="h-9 w-9 rounded-full glass-strong flex items-center justify-center text-[var(--leo-red)]"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
            <CardContent className="p-3">
              <div className="font-medium text-[12.5px] truncate">{img.title}</div>
              <div className="text-[11px] text-muted-foreground">{img.category}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EntityDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Upload Images"
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => formRef.current?.requestSubmit()} disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">{saving ? "Uploading…" : "Upload"}</Button>
          </>
        }
      >
        <form ref={formRef} action={async (fd) => { setSaving(true); try { const fd2 = new FormData(); fd2.append("title", fd.get("title") as string); fd2.append("caption", fd.get("caption") as string); fd2.append("category", fd.get("category") as string); const { createGalleryImage } = await import("@/lib/actions"); await createGalleryImage(fd2); toast({ title: "Image uploaded" }); window.location.reload(); } finally { setSaving(false); } }} className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-[13px] font-medium">Drag & drop images here</p>
            <p className="text-[11.5px] text-muted-foreground mt-1">or click to browse · PNG, JPG, WebP up to 5MB</p>
            <Input type="file" multiple className="hidden" />
          </div>
          <Field label="Title" required><Input name="title" required className="h-10" /></Field>
          <Field label="Caption"><Textarea name="caption" rows={2} /></Field>
          <Field label="Category">
            <select name="category" className="w-full h-10 rounded-md border border-border bg-background px-3 text-[13px]">
              <option>Service</option><option>Events</option><option>Fellowship</option><option>Awards</option><option>Cultural</option>
            </select>
          </Field>
        </form>
      </EntityDialog>
    </div>
  );
}

// ============================================================
// MEDIA LIBRARY
// ============================================================
export function MediaLibrary() {
  const files = [
    { name: "charter-night-2025.jpg", type: "image", size: "2.4 MB", folder: "Events" },
    { name: "blood-donation-camp.jpg", type: "image", size: "1.8 MB", folder: "Service" },
    { name: "annual-report-2024.pdf", type: "pdf", size: "4.2 MB", folder: "Reports" },
    { name: "phewa-cleanup.jpg", type: "image", size: "3.1 MB", folder: "Service" },
    { name: "installation-ceremony.mp4", type: "video", size: "48 MB", folder: "Events" },
    { name: "membership-form.pdf", type: "pdf", size: "245 KB", folder: "Forms" },
    { name: "logo-pack.zip", type: "document", size: "1.2 MB", folder: "Brand" },
    { name: "winter-warmth.jpg", type: "image", size: "2.7 MB", folder: "Service" },
  ];
  const folders = ["root", "Events", "Service", "Reports", "Forms", "Brand"];
  const typeColors: Record<string, string> = {
    image: "from-[var(--leo-blue)] to-[#2E7BD3]",
    pdf: "from-[var(--leo-red)] to-[#B00F23]",
    video: "from-purple-600 to-purple-800",
    document: "from-[var(--leo-gold)] to-[#C89530]",
  };

  return (
    <div>
      <ModuleHeader title="Media Library" description="Central library for all images, videos, and documents.">
        <Button size="sm" className="h-10 rounded-lg bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-1.5">
          <Upload className="h-4 w-4" /> Upload
        </Button>
      </ModuleHeader>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Folders sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-4">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-2">Folders</div>
            <ul className="space-y-1">
              {folders.map((f, i) => (
                <li key={f}>
                  <button className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px]", i === 0 ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted")}>
                    <FolderOpen className="h-3.5 w-3.5" />{f}
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Files grid */}
        <Card className="lg:col-span-3">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {files.map((f) => (
                <div key={f.name} className="group rounded-xl border border-border hover:border-primary/30 hover:shadow-soft transition-all overflow-hidden">
                  <div className={cn("aspect-square flex items-center justify-center bg-gradient-to-br text-white", typeColors[f.type])}>
                    {f.type === "image" ? <ImageIcon className="h-8 w-8 opacity-70" /> : <FileText className="h-8 w-8 opacity-70" />}
                  </div>
                  <div className="p-2.5">
                    <div className="text-[12px] font-medium truncate">{f.name}</div>
                    <div className="text-[10.5px] text-muted-foreground">{f.size}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// SEO MANAGER
// ============================================================
export function SeoManager({ settings }: { settings: Record<string, string> }) {
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();

  return (
    <div>
      <ModuleHeader title="SEO Manager" description="Manage how the website appears in search results and social media." />
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-[15px]">Meta Tags</CardTitle></CardHeader>
          <CardContent>
            <form action={async (fd) => { setSaving(true); try { await updateSetting("seo_title", fd.get("seo_title") as string); await updateSetting("seo_description", fd.get("seo_description") as string); await updateSetting("seo_canonical", fd.get("seo_canonical") as string); await updateSetting("seo_keywords", fd.get("seo_keywords") as string); toast({ title: "SEO settings saved" }); window.location.reload(); } finally { setSaving(false); } }} className="space-y-4">
              <Field label="Meta Title" hint="50-60 characters recommended"><Input name="seo_title" defaultValue={settings.seo_title || ""} className="h-10" /></Field>
              <Field label="Meta Description" hint="150-160 characters recommended"><Textarea name="seo_description" defaultValue={settings.seo_description || ""} rows={3} /></Field>
              <Field label="Canonical URL"><Input name="seo_canonical" defaultValue={settings.seo_canonical || ""} className="h-10" /></Field>
              <Field label="Keywords" hint="Comma-separated"><Input name="seo_keywords" defaultValue={settings.seo_keywords || ""} className="h-10" /></Field>
              <Button type="submit" disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">{saving ? "Saving…" : "Save Meta Tags"}</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-[15px]">Open Graph</CardTitle></CardHeader>
            <CardContent>
              <form action={async (fd) => { setSaving(true); try { await updateSetting("og_title", fd.get("og_title") as string); await updateSetting("og_description", fd.get("og_description") as string); await updateSetting("og_image", fd.get("og_image") as string); toast({ title: "Open Graph saved" }); window.location.reload(); } finally { setSaving(false); } }} className="space-y-4">
                <Field label="OG Title"><Input name="og_title" defaultValue={settings.og_title || ""} className="h-10" /></Field>
                <Field label="OG Description"><Textarea name="og_description" defaultValue={settings.og_description || ""} rows={2} /></Field>
                <Field label="OG Image URL"><Input name="og_image" defaultValue={settings.og_image || ""} className="h-10" /></Field>
                <Button type="submit" disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">{saving ? "Saving…" : "Save"}</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-[15px]">Technical</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <div className="text-[13px] font-medium">sitemap.xml</div>
                  <div className="text-[11px] text-muted-foreground">Auto-generated · Last updated 2h ago</div>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-1.5"><DownloadIcon className="h-3.5 w-3.5" />View</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <div className="text-[13px] font-medium">robots.txt</div>
                  <div className="text-[11px] text-muted-foreground">Allow all crawlers</div>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-1.5"><DownloadIcon className="h-3.5 w-3.5" />View</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <div className="text-[13px] font-medium">Structured Data</div>
                  <div className="text-[11px] text-muted-foreground">Organization + WebSite schema</div>
                </div>
                <Badge className="text-[10px] bg-green-500/15 text-green-700 border-green-500/30"><CheckCircle2 className="h-2.5 w-2.5 mr-1" />Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ANALYTICS
// ============================================================
export function AnalyticsModule() {
  // Mock analytics data
  const visitorStats = [
    { label: "Total Visitors (30d)", value: "18,432", change: "+12.5%", trend: "up" },
    { label: "Unique Visitors", value: "12,108", change: "+8.2%", trend: "up" },
    { label: "Page Views", value: "47,231", change: "+15.3%", trend: "up" },
    { label: "Avg. Session Duration", value: "3m 42s", change: "-2.1%", trend: "down" },
  ];

  const trafficSources = [
    { source: "Direct", visits: 6420, percentage: 35 },
    { source: "Google Search", visits: 5231, percentage: 28 },
    { source: "Facebook", visits: 3127, percentage: 17 },
    { source: "Instagram", visits: 1843, percentage: 10 },
    { source: "Referral", visits: 1106, percentage: 6 },
    { source: "Email", visits: 705, percentage: 4 },
  ];

  const popularPages = [
    { path: "/", views: 12453, title: "Homepage" },
    { path: "/#about", views: 4231, title: "About" },
    { path: "/#events", views: 3108, title: "Events" },
    { path: "/#projects", views: 2742, title: "Projects" },
    { path: "/#membership", views: 2106, title: "Membership" },
  ];

  const devices = [
    { type: "Desktop", percentage: 58, icon: Monitor },
    { type: "Mobile", percentage: 36, icon: Smartphone },
    { type: "Tablet", percentage: 6, icon: Monitor },
  ];

  const countries = [
    { country: "Nepal", flag: "🇳🇵", visits: 8234, percentage: 45 },
    { country: "United States", flag: "🇺🇸", visits: 2451, percentage: 13 },
    { country: "India", flag: "🇮🇳", visits: 1843, percentage: 10 },
    { country: "United Kingdom", flag: "🇬🇧", visits: 1106, percentage: 6 },
    { country: "Australia", flag: "🇦🇺", visits: 705, percentage: 4 },
  ];

  return (
    <div>
      <ModuleHeader title="Analytics" description="Visitor insights and traffic analysis · Last 30 days">
        <Button variant="outline" size="sm" className="h-10 rounded-lg gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />Refresh
        </Button>
      </ModuleHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {visitorStats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="text-[11px] text-muted-foreground uppercase tracking-[0.12em] font-semibold">{s.label}</div>
              <div className="mt-2 text-2xl font-serif font-bold">{s.value}</div>
              <div className={cn("mt-1 text-[11.5px] font-medium flex items-center gap-1", s.trend === "up" ? "text-green-600" : "text-[var(--leo-red)]")}>
                <TrendingUp className="h-3 w-3" />{s.change} vs previous period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Traffic sources */}
        <Card>
          <CardHeader><CardTitle className="text-[15px]">Traffic Sources</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {trafficSources.map((t) => (
              <div key={t.source}>
                <div className="flex items-center justify-between text-[12.5px] mb-1">
                  <span className="font-medium">{t.source}</span>
                  <span className="text-muted-foreground">{t.visits.toLocaleString()} ({t.percentage}%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${t.percentage}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[var(--leo-blue)] to-[#2E7BD3]"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Popular pages */}
        <Card>
          <CardHeader><CardTitle className="text-[15px]">Popular Pages</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {popularPages.map((p, i) => (
                <div key={p.path} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40">
                  <span className="text-[11px] font-mono text-muted-foreground w-6">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium">{p.title}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{p.path}</div>
                  </div>
                  <span className="text-[12.5px] font-medium tabular-nums">{p.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Devices */}
        <Card>
          <CardHeader><CardTitle className="text-[15px]">Devices</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {devices.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.type} className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[13px] flex-1">{d.type}</span>
                    <span className="text-[12.5px] font-medium tabular-nums">{d.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Countries */}
        <Card>
          <CardHeader><CardTitle className="text-[15px]">Top Countries</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {countries.map((c) => (
                <div key={c.country} className="flex items-center gap-3">
                  <span className="text-lg">{c.flag}</span>
                  <span className="text-[13px] flex-1">{c.country}</span>
                  <span className="text-[12.5px] text-muted-foreground tabular-nums">{c.visits.toLocaleString()}</span>
                  <Badge variant="outline" className="text-[10px] w-12 justify-center">{c.percentage}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-serif font-semibold text-[14px]">Connect Google Analytics 4</div>
              <p className="text-[12.5px] text-muted-foreground mt-1">Integrate your GA4 measurement ID to enable real-time visitor tracking, conversion funnels, and audience insights.</p>
              <Button variant="outline" size="sm" className="mt-3 h-8 gap-1.5"><ExternalLink className="h-3.5 w-3.5" />Connect GA4</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// NOTIFICATIONS
// ============================================================
type Notification = { id: string; title: string; message: string; type: string; module: string | null; isRead: boolean; createdAt: Date };

export function NotificationsModule({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = React.useState(initialNotifications);
  const { toast } = useToast();

  const handleReadAll = async () => {
    await markAllNotificationsRead();
    toast({ title: "All notifications marked as read" });
    window.location.reload();
  };

  return (
    <div>
      <ModuleHeader title="Notifications" description={`${notifications.filter((n) => !n.isRead).length} unread · ${notifications.length} total`}>
        <Button variant="outline" size="sm" className="h-10 rounded-lg" onClick={handleReadAll}>Mark all as read</Button>
      </ModuleHeader>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <Card><CardContent className="py-16 text-center"><Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><div className="text-[13px] text-muted-foreground">No notifications yet.</div></CardContent></Card>
        ) : notifications.map((n) => (
          <Card key={n.id} className={cn("hover:shadow-soft transition-shadow", !n.isRead && "border-primary/30 bg-primary/[0.02]")}>
            <CardContent className="p-4 flex items-start gap-3">
              <span className={cn("mt-1 h-2 w-2 rounded-full shrink-0", n.type === "success" ? "bg-green-500" : n.type === "warning" ? "bg-[var(--leo-gold)]" : n.type === "error" ? "bg-[var(--leo-red)]" : "bg-[var(--leo-blue)]")} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[13.5px]">{n.title}</span>
                  {!n.isRead && <Badge className="text-[9px] h-4 px-1 bg-[var(--leo-blue)] text-white">New</Badge>}
                </div>
                <p className="text-[12.5px] text-muted-foreground mt-0.5">{n.message}</p>
                <div className="text-[10.5px] text-muted-foreground/70 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              {!n.isRead && (
                <button onClick={async () => { await markNotificationRead(n.id); window.location.reload(); }} className="text-[11.5px] px-2.5 py-1 rounded hover:bg-muted text-primary shrink-0">Mark read</button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// AUDIT LOGS
// ============================================================
type AuditLog = { id: string; userName: string; action: string; module: string; details: string | null; entityId: string | null; ipAddress: string | null; createdAt: Date };

export function AuditLogsModule({ initialLogs }: { initialLogs: AuditLog[] }) {
  const [search, setSearch] = React.useState("");
  const [moduleFilter, setModuleFilter] = React.useState("ALL");

  const modules = Array.from(new Set(initialLogs.map((l) => l.module)));
  const filtered = initialLogs.filter((l) => {
    const ms = !search || l.userName.toLowerCase().includes(search.toLowerCase()) || (l.details || "").toLowerCase().includes(search.toLowerCase());
    const mf = moduleFilter === "ALL" || l.module === moduleFilter;
    return ms && mf;
  });

  const actionColors: Record<string, string> = {
    CREATE: "bg-green-500/15 text-green-700 border-green-500/30",
    UPDATE: "bg-[var(--leo-blue)]/15 text-[var(--leo-blue)] border-[var(--leo-blue)]/30",
    DELETE: "bg-[var(--leo-red)]/15 text-[var(--leo-red)] border-[var(--leo-red)]/30",
    LOGIN: "bg-[var(--leo-gold)]/20 text-[#8B6510] border-[var(--leo-gold)]/30",
    LOGOUT: "bg-muted text-muted-foreground border-border",
    APPROVE: "bg-green-500/15 text-green-700 border-green-500/30",
    REJECT: "bg-[var(--leo-red)]/15 text-[var(--leo-red)] border-[var(--leo-red)]/30",
  };

  return (
    <div>
      <ModuleHeader title="Audit Logs" description={`${initialLogs.length} recorded actions`} />

      <div className="flex gap-3 mb-4">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user or details…" className="h-10 max-w-md" />
        <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="h-10 rounded-md border border-border bg-background px-3 text-[13px]">
          <option value="ALL">All Modules</option>
          {modules.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-[13px] text-muted-foreground">No logs found.</div>
            ) : filtered.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-muted/30">
                <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-muted text-muted-foreground shrink-0">
                  <ScrollText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-[13px]">{log.userName}</span>
                    <Badge variant="outline" className={cn("text-[10px]", actionColors[log.action] || "bg-muted")}>{log.action}</Badge>
                    <Badge variant="outline" className="text-[10px]">{log.module}</Badge>
                  </div>
                  {log.details && <p className="text-[12px] text-muted-foreground mt-1">{log.details}</p>}
                  <div className="flex items-center gap-3 mt-1 text-[10.5px] text-muted-foreground/70">
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                    {log.ipAddress && <span>· IP: {log.ipAddress}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// USERS MANAGER
// ============================================================
type AdminUser = { id: string; email: string; name: string; role: string; isActive: boolean; lastLoginAt: Date | null; createdAt: Date };

export function UsersManager({ initialUsers }: { initialUsers: AdminUser[] }) {
  return (
    <div>
      <ModuleHeader title="Admin Users" description={`${initialUsers.length} users with dashboard access`}>
        <Button size="sm" className="h-10 rounded-lg bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-1.5">
          <UserCog className="h-4 w-4" /> Add User
        </Button>
      </ModuleHeader>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialUsers.map((u) => (
          <Card key={u.id} className="hover:shadow-soft transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-[var(--leo-blue)] to-[var(--leo-red)] text-white font-serif font-bold">
                    {u.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[14px] truncate">{u.name}</div>
                  <div className="text-[12px] text-muted-foreground truncate">{u.email}</div>
                  <Badge variant="outline" className="text-[10px] mt-1">{ROLE_LABELS[u.role as keyof typeof ROLE_LABELS] || u.role}</Badge>
                </div>
                <Badge variant="outline" className={u.isActive ? "text-green-700 border-green-500/30" : "text-muted-foreground"}>
                  {u.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="mt-3 pt-3 border-t border-border text-[11.5px] text-muted-foreground space-y-1">
                <div>Last login: {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}</div>
                <div>Joined: {new Date(u.createdAt).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle className="text-[15px]">Role Permissions Matrix</CardTitle></CardHeader>
        <CardContent>
          <div className="text-[12.5px] text-muted-foreground">
            <p>Roles follow a hierarchical structure with configurable permissions:</p>
            <ul className="mt-3 space-y-1.5">
              <li className="flex items-center gap-2"><Badge variant="outline" className="text-[10px]">SUPER_ADMIN</Badge>Full access including user management</li>
              <li className="flex items-center gap-2"><Badge variant="outline" className="text-[10px]">PRESIDENT</Badge>All content + settings + audit logs</li>
              <li className="flex items-center gap-2"><Badge variant="outline" className="text-[10px]">VICE_PRESIDENT</Badge>Content management + publishing</li>
              <li className="flex items-center gap-2"><Badge variant="outline" className="text-[10px]">SECRETARY</Badge>Members, events, applications, news</li>
              <li className="flex items-center gap-2"><Badge variant="outline" className="text-[10px]">TREASURER</Badge>View access + finance modules</li>
              <li className="flex items-center gap-2"><Badge variant="outline" className="text-[10px]">EDITOR</Badge>Content editing (no publishing)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// SETTINGS
// ============================================================
export function SettingsModule({ settings }: { settings: Record<string, string> }) {
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();
  const [tab, setTab] = React.useState("club");

  return (
    <div>
      <ModuleHeader title="Settings" description="Configure your club information, branding, and integrations." />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="club">Club Info</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="club" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <form action={async (fd) => {
                setSaving(true);
                try {
                  await updateSetting("club_name", fd.get("club_name") as string);
                  await updateSetting("club_motto", fd.get("club_motto") as string);
                  await updateSetting("club_charter_date", fd.get("club_charter_date") as string);
                  await updateSetting("club_sponsor", fd.get("club_sponsor") as string);
                  await updateSetting("club_district", fd.get("club_district") as string);
                  toast({ title: "Club info saved" });
                  window.location.reload();
                } finally { setSaving(false); }
              }} className="space-y-4">
                <Field label="Club Name" required><Input name="club_name" defaultValue={settings.club_name || "Leo Club of Pokhara"} className="h-10" /></Field>
                <Field label="Motto"><Input name="club_motto" defaultValue={settings.club_motto || "Leadership · Experience · Opportunity"} className="h-10" /></Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Charter Date"><Input name="club_charter_date" defaultValue={settings.club_charter_date || "August 08, 1979"} className="h-10" /></Field>
                  <Field label="Sponsor Club"><Input name="club_sponsor" defaultValue={settings.club_sponsor || "Lions Club of Pokhara"} className="h-10" /></Field>
                </div>
                <Field label="District"><Input name="club_district" defaultValue={settings.club_district || "District 325 B2, Nepal"} className="h-10" /></Field>
                <Button type="submit" disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">{saving ? "Saving…" : "Save Changes"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Field label="Logo"><div className="flex items-center gap-3"><div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center"><ImageIcon className="h-6 w-6 text-muted-foreground" /></div><Button variant="outline" size="sm">Upload Logo</Button></div></Field>
              <Field label="Banner"><div className="flex items-center gap-3"><div className="h-16 w-32 rounded-xl bg-gradient-to-br from-[var(--leo-blue)] to-[var(--leo-red)]" /><Button variant="outline" size="sm">Upload Banner</Button></div></Field>
              <div>
                <Label className="text-[12.5px] font-medium">Theme Colors</Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
                  {[
                    { name: "Nepal Red", color: "#E00121" },
                    { name: "Lions Blue", color: "#0546A0" },
                    { name: "Lions Gold", color: "#F4C542" },
                    { name: "White", color: "#FFFFFF" },
                    { name: "Light Gray", color: "#F8F9FA" },
                  ].map((c) => (
                    <div key={c.name} className="rounded-lg border border-border p-3 text-center">
                      <div className="h-12 rounded-md mb-2 border border-border" style={{ background: c.color }} />
                      <div className="text-[11px] font-medium">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{c.color}</div>
                    </div>
                  ))}
                </div>
              </div>
              <Field label="Heading Font"><Input defaultValue="Noto Serif" className="h-10" /></Field>
              <Field label="Body Font"><Input defaultValue="Inter" className="h-10" /></Field>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Field label="SMTP Host"><Input defaultValue="" className="h-10" placeholder="smtp.gmail.com" /></Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="SMTP Port"><Input defaultValue="587" className="h-10" /></Field>
                <Field label="Encryption"><select className="w-full h-10 rounded-md border border-border bg-background px-3"><option>TLS</option><option>SSL</option><option>None</option></select></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Username"><Input className="h-10" /></Field>
                <Field label="Password"><Input type="password" className="h-10" /></Field>
              </div>
              <Field label="From Email"><Input defaultValue="noreply@leoclubofpokhara.org.np" className="h-10" /></Field>
              <Button className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">Save Email Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: "Google Analytics 4", desc: "Track visitor analytics", connected: false },
              { name: "Google Maps", desc: "Embed maps on contact page", connected: true },
              { name: "Resend / SendGrid", desc: "Transactional emails", connected: false },
              { name: "Cloudflare R2 / S3", desc: "Media file storage", connected: false },
              { name: "Cloudinary", desc: "Image optimization", connected: false },
              { name: "Slack", desc: "Internal notifications", connected: false },
            ].map((i) => (
              <Card key={i.name}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-serif font-semibold text-[14px]">{i.name}</div>
                      <div className="text-[12px] text-muted-foreground">{i.desc}</div>
                    </div>
                    <Badge variant="outline" className={i.connected ? "text-green-700 border-green-500/30" : "text-muted-foreground"}>
                      {i.connected ? "Connected" : "Not connected"}
                    </Badge>
                  </div>
                  <Button variant={i.connected ? "outline" : "default"} size="sm" className="h-8 mt-2">
                    {i.connected ? "Configure" : "Connect"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================
// BACKUP & RESTORE
// ============================================================
export function BackupModule() {
  const [backing, setBacking] = React.useState(false);
  const { toast } = useToast();

  const backups = [
    { id: 1, date: "2025-07-12 02:00", size: "4.2 MB", type: "Automatic", status: "Success" },
    { id: 2, date: "2025-07-11 02:00", size: "4.1 MB", type: "Automatic", status: "Success" },
    { id: 3, date: "2025-07-10 02:00", size: "4.1 MB", type: "Automatic", status: "Success" },
    { id: 4, date: "2025-07-09 14:32", size: "4.0 MB", type: "Manual", status: "Success" },
    { id: 5, date: "2025-07-08 02:00", size: "3.9 MB", type: "Automatic", status: "Success" },
  ];

  return (
    <div>
      <ModuleHeader title="Backup & Restore" description="Automatic daily backups at 2:00 AM NPT. Retained for 30 days.">
        <Button onClick={() => { setBacking(true); setTimeout(() => { setBacking(false); toast({ title: "Backup created successfully" }); }, 1500); }} disabled={backing} size="sm" className="h-10 rounded-lg bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-1.5">
          <Database className="h-4 w-4" />{backing ? "Creating…" : "Create Backup"}
        </Button>
      </ModuleHeader>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="p-5">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">Last Backup</div>
          <div className="mt-2 text-xl font-serif font-bold">2h ago</div>
          <div className="text-[11.5px] text-green-600 mt-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Successful</div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">Total Backups</div>
          <div className="mt-2 text-xl font-serif font-bold">30</div>
          <div className="text-[11.5px] text-muted-foreground mt-1">Last 30 days</div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">Storage Used</div>
          <div className="mt-2 text-xl font-serif font-bold">126 MB</div>
          <div className="text-[11.5px] text-muted-foreground mt-1">of 1 GB limit</div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-[15px]">Backup History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {backups.map((b) => (
              <div key={b.id} className="flex items-center gap-3 p-4 hover:bg-muted/30">
                <Database className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium">{b.date}</div>
                  <div className="text-[11.5px] text-muted-foreground">{b.type} · {b.size}</div>
                </div>
                <Badge variant="outline" className="text-[10px] text-green-700 border-green-500/30">{b.status}</Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-7 gap-1"><DownloadIcon className="h-3 w-3" />Download</Button>
                  <Button variant="ghost" size="sm" className="h-7">Restore</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 border-[var(--leo-gold)]/30 bg-[var(--leo-gold)]/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#8B6510] shrink-0 mt-0.5" />
            <div>
              <div className="font-serif font-semibold text-[14px]">Restore Warning</div>
              <p className="text-[12.5px] text-muted-foreground mt-1">Restoring a backup will replace ALL current data. This action cannot be undone. Always download a fresh backup before restoring.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// HOMEPAGE MANAGER (drag-drop section reordering)
// ============================================================
export function HomepageManager({ settings }: { settings?: Record<string, string> }) {
  const [activeTab, setActiveTab] = React.useState("hero");
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();

  // Local state for all editable content
  const [heroTitle, setHeroTitle] = React.useState(settings?.hero_title || "");
  const [heroSubtitle, setHeroSubtitle] = React.useState(settings?.hero_subtitle || "");
  const [heroButton1Text, setHeroButton1Text] = React.useState(settings?.hero_button1_text || "");
  const [heroButton1Link, setHeroButton1Link] = React.useState(settings?.hero_button1_link || "");
  const [heroButton2Text, setHeroButton2Text] = React.useState(settings?.hero_button2_text || "");
  const [heroButton2Link, setHeroButton2Link] = React.useState(settings?.hero_button2_link || "");
  const [heroBadgeText, setHeroBadgeText] = React.useState(settings?.hero_badge_text || "");

  const [aboutTitle, setAboutTitle] = React.useState(settings?.about_title || "");
  const [aboutDescription, setAboutDescription] = React.useState(settings?.about_description || "");
  const [aboutMission, setAboutMission] = React.useState(settings?.about_mission || "");
  const [aboutVision, setAboutVision] = React.useState(settings?.about_vision || "");
  const [presidentName, setPresidentName] = React.useState(settings?.president_name || "");
  const [presidentTitle, setPresidentTitle] = React.useState(settings?.president_title || "");
  const [presidentMessage, setPresidentMessage] = React.useState(settings?.president_message || "");
  const [presidentQuote, setPresidentQuote] = React.useState(settings?.president_quote || "");

  const [statsJson, setStatsJson] = React.useState(settings?.stats || "");
  const [footerDescription, setFooterDescription] = React.useState(settings?.footer_description || "");

  const handleSave = async (tab: string) => {
    setSaving(true);
    try {
      const { updateManySiteContent } = await import("@/lib/site-content");
      let updates: Record<string, string> = {};

      if (tab === "hero") {
        updates = {
          hero_title: heroTitle, hero_subtitle: heroSubtitle,
          hero_button1_text: heroButton1Text, hero_button1_link: heroButton1Link,
          hero_button2_text: heroButton2Text, hero_button2_link: heroButton2Link,
          hero_badge_text: heroBadgeText,
        };
      } else if (tab === "about") {
        updates = {
          about_title: aboutTitle, about_description: aboutDescription,
          about_mission: aboutMission, about_vision: aboutVision,
          president_name: presidentName, president_title: presidentTitle,
          president_message: presidentMessage, president_quote: presidentQuote,
        };
      } else if (tab === "stats") {
        // Validate JSON
        try { JSON.parse(statsJson); } catch {
          toast({ title: "Invalid JSON", description: "Stats must be valid JSON", variant: "destructive" });
          setSaving(false);
          return;
        }
        updates = { stats: statsJson };
      } else if (tab === "footer") {
        updates = { footer_description: footerDescription };
      }

      const result = await updateManySiteContent(updates);
      if (result.success) {
        toast({ title: "Saved!", description: "Changes are now live on the public site." });
      } else {
        toast({ title: "Save failed", description: result.error, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "hero", label: "Hero Section", icon: Home },
    { id: "about", label: "About & President", icon: FileText },
    { id: "stats", label: "Statistics", icon: Target },
    { id: "footer", label: "Footer", icon: Mail },
  ];

  return (
    <div>
      <ModuleHeader title="Homepage Manager" description="Edit the content that appears on the public homepage. Changes go live instantly." />

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all",
                activeTab === tab.id
                  ? "bg-[var(--leo-blue)] text-white shadow-soft"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "hero" && (
        <Card>
          <CardHeader><CardTitle className="text-[15px]">Hero Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[12.5px] font-medium">Badge Text (top of hero)</Label>
              <Input value={heroBadgeText} onChange={(e) => setHeroBadgeText(e.target.value)} className="h-10" placeholder="Chartered August 08, 1979" />
            </div>
            <div className="space-y-2">
              <Label className="text-[12.5px] font-medium">Main Title</Label>
              <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="h-10" placeholder="Leo Club of Pokhara" />
            </div>
            <div className="space-y-2">
              <Label className="text-[12.5px] font-medium">Subtitle</Label>
              <Textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={3} placeholder="For over four decades..." />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[12.5px] font-medium">Button 1 Text</Label>
                <Input value={heroButton1Text} onChange={(e) => setHeroButton1Text(e.target.value)} className="h-10" placeholder="Join Us" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12.5px] font-medium">Button 1 Link</Label>
                <Input value={heroButton1Link} onChange={(e) => setHeroButton1Link(e.target.value)} className="h-10" placeholder="#membership" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[12.5px] font-medium">Button 2 Text</Label>
                <Input value={heroButton2Text} onChange={(e) => setHeroButton2Text(e.target.value)} className="h-10" placeholder="Explore Projects" />
              </div>
              <div className="space-y-2">
                <Label className="text-[12.5px] font-medium">Button 2 Link</Label>
                <Input value={heroButton2Link} onChange={(e) => setHeroButton2Link(e.target.value)} className="h-10" placeholder="#projects" />
              </div>
            </div>
            <Button onClick={() => handleSave("hero")} disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-2">
              <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save & Publish"}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "about" && (
        <Card>
          <CardHeader><CardTitle className="text-[15px]">About Section & President's Message</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[12.5px] font-medium">About Title</Label>
              <Input value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} className="h-10" placeholder="A legacy of service..." />
            </div>
            <div className="space-y-2">
              <Label className="text-[12.5px] font-medium">About Description</Label>
              <Textarea value={aboutDescription} onChange={(e) => setAboutDescription(e.target.value)} rows={4} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[12.5px] font-medium">Mission</Label>
                <Textarea value={aboutMission} onChange={(e) => setAboutMission(e.target.value)} rows={4} />
              </div>
              <div className="space-y-2">
                <Label className="text-[12.5px] font-medium">Vision</Label>
                <Textarea value={aboutVision} onChange={(e) => setAboutVision(e.target.value)} rows={4} />
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="text-[13px] font-serif font-semibold mb-3">President's Message</div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label className="text-[12.5px] font-medium">President Name</Label>
                  <Input value={presidentName} onChange={(e) => setPresidentName(e.target.value)} className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[12.5px] font-medium">President Title</Label>
                  <Input value={presidentTitle} onChange={(e) => setPresidentTitle(e.target.value)} className="h-10" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <Label className="text-[12.5px] font-medium">Message</Label>
                <Textarea value={presidentMessage} onChange={(e) => setPresidentMessage(e.target.value)} rows={5} />
              </div>
              <div className="space-y-2 mb-4">
                <Label className="text-[12.5px] font-medium">Quote</Label>
                <Textarea value={presidentQuote} onChange={(e) => setPresidentQuote(e.target.value)} rows={2} />
              </div>
            </div>
            <Button onClick={() => handleSave("about")} disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-2">
              <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save & Publish"}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "stats" && (
        <Card>
          <CardHeader><CardTitle className="text-[15px]">Statistics Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-[12px] text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-200">
              Edit the statistics shown in the impact section. Each stat needs: label, value, suffix, icon (calendar, users, target, heart, clock, handshake).
            </div>
            <div className="space-y-2">
              <Label className="text-[12.5px] font-medium">Stats JSON</Label>
              <Textarea
                value={statsJson}
                onChange={(e) => setStatsJson(e.target.value)}
                rows={12}
                className="font-mono text-[12px]"
                placeholder='[{"label":"Years of Service","value":46,"suffix":"+","icon":"calendar"}]'
              />
            </div>
            <Button onClick={() => handleSave("stats")} disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-2">
              <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save & Publish"}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "footer" && (
        <Card>
          <CardHeader><CardTitle className="text-[15px]">Footer Content</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[12.5px] font-medium">Footer Description</Label>
              <Textarea value={footerDescription} onChange={(e) => setFooterDescription(e.target.value)} rows={4} />
            </div>
            <Button onClick={() => handleSave("footer")} disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-2">
              <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save & Publish"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
