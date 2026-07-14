"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AlertCircle, Trash2, Newspaper, Eye, Clock, CheckCircle2, Calendar,
  Tag, Star, Upload, FileText, Mail, Phone, MapPin, Heart, Award,
  Download as DownloadIcon, ExternalLink,
} from "lucide-react";
import { ModuleHeader } from "./data-table";
import { EntityDialog, Field } from "./entity-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  createNewsArticle, updateNewsArticle, deleteNewsArticle,
  reviewApplication,
  createTestimonial, updateTestimonial, deleteTestimonial,
  createSponsor, updateSponsor, deleteSponsor,
  createDownload, deleteDownload,
  markMessageRead, deleteContactMessage,
  saveContent,
} from "@/lib/admin-api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

// ============================================================
// NEWS MANAGER
// ============================================================
type NewsArticle = {
  id: string; title: string; slug: string; excerpt: string | null;
  content: string; category: string; tags: string; status: string;
  publishedAt: Date | null; scheduledAt: Date | null; isFeatured: boolean;
  seoTitle: string | null; seoDescription: string | null; createdAt: Date;
};

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: "bg-green-500/15 text-green-700 border-green-500/30",
  DRAFT: "bg-muted text-muted-foreground border-border",
  SCHEDULED: "bg-[var(--leo-gold)]/20 text-[#8B6510] border-[var(--leo-gold)]/30",
};

export function NewsManager({ initialArticles }: { initialArticles: NewsArticle[] }) {
  const [articles, setArticles] = React.useState(initialArticles);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<NewsArticle | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<NewsArticle | null>(null);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const filtered = articles.filter((a) => {
    const ms = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "ALL" || a.status === statusFilter;
    return ms && mf;
  });

  return (
    <div>
      <ModuleHeader title="News & Blog" description={`${articles.length} articles · ${articles.filter((a) => a.status === "PUBLISHED").length} published`}>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} size="sm" className="h-10 rounded-lg bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-1.5">
          <Newspaper className="h-4 w-4" /> New Article
        </Button>
      </ModuleHeader>

      <div className="flex gap-3 mb-4">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles…" className="h-10 max-w-md" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card><CardContent className="py-16 text-center text-[13px] text-muted-foreground">No articles found.</CardContent></Card>
        ) : filtered.map((a) => (
          <Card key={a.id} className="hover:shadow-soft transition-shadow group">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary shrink-0">
                <Newspaper className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif font-semibold text-[15px]">{a.title}</h3>
                  {a.isFeatured && <Badge className="bg-[var(--leo-gold)]/20 text-[#8B6510] border-[var(--leo-gold)]/30 text-[10px]"><Star className="h-2.5 w-2.5 mr-1" />Featured</Badge>}
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11.5px] text-muted-foreground">
                  <Badge variant="outline" className={cn("text-[10px]", STATUS_COLORS[a.status])}>{a.status.toLowerCase()}</Badge>
                  <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{a.category}</span>
                  {a.publishedAt && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(a.publishedAt).toLocaleDateString()}</span>}
                </div>
                {a.excerpt && <p className="mt-2 text-[12.5px] text-muted-foreground line-clamp-2">{a.excerpt}</p>}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditing(a); setDialogOpen(true); }} className="text-[12px] px-2.5 py-1 rounded hover:bg-muted text-primary">Edit</button>
                <button onClick={() => setDeleteTarget(a)} className="text-[12px] px-2.5 py-1 rounded hover:bg-muted text-[var(--leo-red)]">Delete</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EntityDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Edit Article" : "New Article"}
        size="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">
              {saving ? "Saving…" : "Save"}
            </Button>
          </>
        }
      >
        <form ref={formRef} onSubmit={(e: any) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); (async (fd: FormData) => { setSaving(true); try { if (editing) { await updateNewsArticle(editing.id, fd); toast({ title: "Article updated" }); } else { await createNewsArticle(fd); toast({ title: "Article created" }); } window.location.reload(); } catch (e) { toast({ title: "Save failed", description: e instanceof Error ? e.message : "", variant: "destructive" }); } finally { setSaving(false); } })(fd); }} className="space-y-4">
          <Field label="Title" required>
            <Input name="title" defaultValue={editing?.title} required className="h-10" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Slug" hint="Auto-generated from title if left empty">
              <Input name="slug" defaultValue={editing?.slug} className="h-10 font-mono" />
            </Field>
            <Field label="Category">
              <Input name="category" defaultValue={editing?.category || "General"} className="h-10" />
            </Field>
          </div>
          <Field label="Excerpt">
            <Textarea name="excerpt" defaultValue={editing?.excerpt || ""} rows={2} />
          </Field>
          <Field label="Content" hint="Rich text content (HTML or markdown)">
            <Textarea name="content" defaultValue={editing?.content} rows={8} className="font-mono text-[12.5px]" />
          </Field>
          <Field label="Tags" hint="Comma-separated">
            <Input name="tags" defaultValue={editing?.tags} className="h-10" placeholder="service, health, 2025" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Status">
              <Select name="status" defaultValue={editing?.status || "DRAFT"}>
                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Featured">
              <label className="flex items-center gap-2 h-10">
                <Switch name="isFeatured" defaultChecked={editing?.isFeatured} />
                <span className="text-[13px]">Feature this article</span>
              </label>
            </Field>
          </div>
          <div className="pt-3 border-t border-border">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-3">SEO</div>
            <div className="space-y-3">
              <Field label="SEO Title">
                <Input name="seoTitle" defaultValue={editing?.seoTitle || ""} className="h-10" />
              </Field>
              <Field label="SEO Description">
                <Textarea name="seoDescription" defaultValue={editing?.seoDescription || ""} rows={2} />
              </Field>
            </div>
          </div>
        </form>
      </EntityDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-[var(--leo-red)]" />Delete article?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete <strong>{deleteTarget?.title}</strong>.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => { if (deleteTarget) { await deleteNewsArticle(deleteTarget.id); toast({ title: "Article deleted" }); setDeleteTarget(null); window.location.reload(); } }} className="bg-[var(--leo-red)] hover:bg-[var(--leo-red)]/90 text-white"><Trash2 className="h-4 w-4 mr-2" />Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================
// APPLICATIONS MANAGER
// ============================================================
type Application = {
  id: string; name: string; email: string; phone: string | null;
  address: string | null; occupation: string | null; motivation: string;
  status: string; reviewNote: string | null; createdAt: Date;
  reviewedAt: Date | null; dateOfBirth: Date | null;
};

const APP_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-[var(--leo-gold)]/20 text-[#8B6510] border-[var(--leo-gold)]/30",
  APPROVED: "bg-green-500/15 text-green-700 border-green-500/30",
  REJECTED: "bg-[var(--leo-red)]/15 text-[var(--leo-red)] border-[var(--leo-red)]/30",
  WAITLISTED: "bg-[var(--leo-blue)]/15 text-[var(--leo-blue)] border-[var(--leo-blue)]/30",
};

export function ApplicationsManager({ initialApps }: { initialApps: Application[] }) {
  const [apps, setApps] = React.useState(initialApps);
  const [tab, setTab] = React.useState("PENDING");
  const [viewing, setViewing] = React.useState<Application | null>(null);
  const [reviewNote, setReviewNote] = React.useState("");
  const [reviewing, setReviewing] = React.useState(false);
  const { toast } = useToast();

  const filtered = apps.filter((a) => tab === "ALL" || a.status === tab);

  const handleReview = async (status: "APPROVED" | "REJECTED" | "WAITLISTED") => {
    if (!viewing) return;
    setReviewing(true);
    try {
      await reviewApplication(viewing.id, status, reviewNote);
      toast({ title: `Application ${status.toLowerCase()}` });
      setViewing(null);
      setReviewNote("");
      window.location.reload();
    } catch (e) {
      toast({ title: "Failed", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally { setReviewing(false); }
  };

  const exportApps = () => {
    const headers = ["Name", "Email", "Phone", "Occupation", "Status", "Applied On"];
    const rows = apps.map((a) => [a.name, a.email, a.phone || "", a.occupation || "", a.status, new Date(a.createdAt).toLocaleDateString()]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `applications-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported" });
  };

  return (
    <div>
      <ModuleHeader title="Membership Applications" description={`${apps.filter((a) => a.status === "PENDING").length} pending · ${apps.length} total`}>
        <Button variant="outline" size="sm" className="h-10 rounded-lg gap-1.5" onClick={exportApps}><DownloadIcon className="h-3.5 w-3.5" />Export</Button>
      </ModuleHeader>

      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="PENDING">Pending ({apps.filter((a) => a.status === "PENDING").length})</TabsTrigger>
          <TabsTrigger value="APPROVED">Approved ({apps.filter((a) => a.status === "APPROVED").length})</TabsTrigger>
          <TabsTrigger value="WAITLISTED">Waitlisted ({apps.filter((a) => a.status === "WAITLISTED").length})</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected ({apps.filter((a) => a.status === "REJECTED").length})</TabsTrigger>
          <TabsTrigger value="ALL">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card><CardContent className="py-16 text-center text-[13px] text-muted-foreground">No applications in this category.</CardContent></Card>
        ) : filtered.map((a) => (
          <Card key={a.id} className="hover:shadow-soft transition-shadow">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--leo-blue)] to-[var(--leo-red)] text-white font-serif font-bold shrink-0">
                {a.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif font-semibold text-[15px]">{a.name}</h3>
                  <Badge variant="outline" className={cn("text-[10px]", APP_STATUS_COLORS[a.status])}>{a.status.toLowerCase()}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-[11.5px] text-muted-foreground">
                  <span>{a.email}</span>
                  {a.phone && <span>· {a.phone}</span>}
                  {a.occupation && <span>· {a.occupation}</span>}
                  <span>· Applied {new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 text-[12.5px] text-muted-foreground line-clamp-2">{a.motivation}</p>
              </div>
              <Button variant="outline" size="sm" className="h-9 shrink-0" onClick={() => { setViewing(a); setReviewNote(a.reviewNote || ""); }}>
                <Eye className="h-3.5 w-3.5 mr-1.5" /> Review
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <EntityDialog
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="Review Application"
        size="lg"
        footer={
          viewing?.status === "PENDING" || viewing?.status === "WAITLISTED" ? (
            <>
              <Button variant="outline" onClick={() => handleReview("REJECTED")} disabled={reviewing} className="text-[var(--leo-red)] border-[var(--leo-red)]/30 hover:bg-[var(--leo-red)]/10">
                <Heart className="h-4 w-4 mr-1.5" />Reject
              </Button>
              <Button variant="outline" onClick={() => handleReview("WAITLISTED")} disabled={reviewing}>
                Waitlist
              </Button>
              <Button onClick={() => handleReview("APPROVED")} disabled={reviewing} className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle2 className="h-4 w-4 mr-1.5" />Approve
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
          )
        }
      >
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-[var(--leo-blue)] to-[var(--leo-red)] text-white font-serif font-bold text-lg shrink-0">
                {viewing.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg">{viewing.name}</h3>
                <Badge variant="outline" className={cn("text-[10px] mt-1", APP_STATUS_COLORS[viewing.status])}>{viewing.status.toLowerCase()}</Badge>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-[13px]">
              <div><div className="text-[11px] uppercase text-muted-foreground font-semibold mb-0.5">Email</div>{viewing.email}</div>
              <div><div className="text-[11px] uppercase text-muted-foreground font-semibold mb-0.5">Phone</div>{viewing.phone || "—"}</div>
              <div><div className="text-[11px] uppercase text-muted-foreground font-semibold mb-0.5">Occupation</div>{viewing.occupation || "—"}</div>
              <div><div className="text-[11px] uppercase text-muted-foreground font-semibold mb-0.5">Date of Birth</div>{viewing.dateOfBirth ? new Date(viewing.dateOfBirth).toLocaleDateString() : "—"}</div>
              <div className="sm:col-span-2"><div className="text-[11px] uppercase text-muted-foreground font-semibold mb-0.5">Address</div>{viewing.address || "—"}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase text-muted-foreground font-semibold mb-1.5">Motivation</div>
              <p className="text-[13px] leading-relaxed bg-muted/30 rounded-lg p-4">{viewing.motivation}</p>
            </div>
            {(viewing.status === "PENDING" || viewing.status === "WAITLISTED") && (
              <Field label="Review Note (optional)">
                <Textarea value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} rows={2} placeholder="Add a note about this decision…" />
              </Field>
            )}
            {viewing.reviewNote && (
              <div>
                <div className="text-[11px] uppercase text-muted-foreground font-semibold mb-1">Previous Review Note</div>
                <p className="text-[13px] italic text-muted-foreground">{viewing.reviewNote}</p>
              </div>
            )}
          </div>
        )}
      </EntityDialog>
    </div>
  );
}

// ============================================================
// TESTIMONIALS MANAGER
// ============================================================
type Testimonial = {
  id: string; quote: string; author: string; role: string;
  category: string; isApproved: boolean; isFeatured: boolean; createdAt: Date;
};

export function TestimonialsManager({ initialItems }: { initialItems: Testimonial[] }) {
  const [items, setItems] = React.useState(initialItems);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Testimonial | null>(null);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <div>
      <ModuleHeader title="Testimonials" description={`${items.length} total · ${items.filter((t) => t.isApproved).length} approved · ${items.filter((t) => !t.isApproved).length} pending`}>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} size="sm" className="h-10 rounded-lg bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-1.5">
          <Heart className="h-4 w-4" /> Add Testimonial
        </Button>
      </ModuleHeader>

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((t) => (
          <Card key={t.id} className="hover:shadow-soft transition-shadow group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className={cn("text-[10px]", t.isApproved ? "text-green-700 border-green-500/30" : "text-[var(--leo-gold)] border-[var(--leo-gold)]/30")}>
                  {t.isApproved ? "Approved" : "Pending"}
                </Badge>
                {t.isFeatured && <Badge className="bg-[var(--leo-gold)]/20 text-[#8B6510] border-[var(--leo-gold)]/30 text-[10px]"><Star className="h-2.5 w-2.5 mr-1" />Featured</Badge>}
              </div>
              <p className="text-[13px] italic leading-relaxed text-foreground/90">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <div className="font-serif font-semibold text-[13px]">{t.author}</div>
                  <div className="text-[11px] text-muted-foreground">{t.role}</div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button onClick={() => { setEditing(t); setDialogOpen(true); }} className="text-[11.5px] px-2 py-1 rounded hover:bg-muted text-primary">Edit</button>
                  <button onClick={() => setDeleteTarget(t)} className="text-[11.5px] px-2 py-1 rounded hover:bg-muted text-[var(--leo-red)]">Delete</button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EntityDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Edit Testimonial" : "Add Testimonial"}
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">{saving ? "Saving…" : "Save"}</Button>
          </>
        }
      >
        <form ref={formRef} onSubmit={(e: any) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); (async (fd: FormData) => { setSaving(true); try { if (editing) { await updateTestimonial(editing.id, fd); toast({ title: "Testimonial updated" }); } else { await createTestimonial(fd); toast({ title: "Testimonial added" }); } window.location.reload(); } finally { setSaving(false); } })(fd); }} className="space-y-4">
          <Field label="Quote" required><Textarea name="quote" defaultValue={editing?.quote} required rows={4} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Author Name" required><Input name="author" defaultValue={editing?.author} required className="h-10" /></Field>
            <Field label="Author Role" required><Input name="role" defaultValue={editing?.role} required className="h-10" placeholder="Past President, Community Partner…" /></Field>
          </div>
          <Field label="Category">
            <Select name="category" defaultValue={editing?.category || "Member"}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Community">Community</SelectItem>
                <SelectItem value="Partner">Partner</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer"><Switch name="isApproved" defaultChecked={editing?.isApproved} /><span className="text-[13px]">Approved</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><Switch name="isFeatured" defaultChecked={editing?.isFeatured} /><span className="text-[13px]">Featured</span></label>
          </div>
        </form>
      </EntityDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-[var(--leo-red)]" />Delete testimonial?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the testimonial from <strong>{deleteTarget?.author}</strong>.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => { if (deleteTarget) { await deleteTestimonial(deleteTarget.id); toast({ title: "Testimonial deleted" }); setDeleteTarget(null); window.location.reload(); } }} className="bg-[var(--leo-red)] hover:bg-[var(--leo-red)]/90 text-white"><Trash2 className="h-4 w-4 mr-2" />Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================
// SPONSORS MANAGER
// ============================================================
type Sponsor = { id: string; name: string; websiteUrl: string | null; category: string; order: number; isActive: boolean };

export function SponsorsManager({ initialSponsors }: { initialSponsors: Sponsor[] }) {
  const [sponsors, setSponsors] = React.useState(initialSponsors);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Sponsor | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Sponsor | null>(null);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <div>
      <ModuleHeader title="Sponsors & Partners" description={`${sponsors.length} organizations · ${sponsors.filter((s) => s.isActive).length} active`}>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} size="sm" className="h-10 rounded-lg bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-1.5">
          <Award className="h-4 w-4" /> Add Sponsor
        </Button>
      </ModuleHeader>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sponsors.map((s) => (
          <Card key={s.id} className="hover:shadow-soft transition-shadow group">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--leo-blue)]/20 to-[var(--leo-gold)]/20 text-primary font-serif font-bold shrink-0">
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[14px] truncate">{s.name}</div>
                  <Badge variant="outline" className="text-[10px] mt-0.5">{s.category}</Badge>
                </div>
                <Badge variant="outline" className={s.isActive ? "text-green-700 border-green-500/30" : "text-muted-foreground"}>
                  {s.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              {s.websiteUrl && (
                <a href={s.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1.5 text-[12px] text-primary hover:underline truncate">
                  <ExternalLink className="h-3 w-3" />{s.websiteUrl}
                </a>
              )}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditing(s); setDialogOpen(true); }} className="text-[11.5px] px-2 py-1 rounded hover:bg-muted text-primary">Edit</button>
                <button onClick={() => setDeleteTarget(s)} className="text-[11.5px] px-2 py-1 rounded hover:bg-muted text-[var(--leo-red)]">Delete</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EntityDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Edit Sponsor" : "Add Sponsor"}
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">{saving ? "Saving…" : "Save"}</Button>
          </>
        }
      >
        <form ref={formRef} onSubmit={(e: any) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); (async (fd: FormData) => { setSaving(true); try { if (editing) { await updateSponsor(editing.id, fd); toast({ title: "Sponsor updated" }); } else { await createSponsor(fd); toast({ title: "Sponsor added" }); } window.location.reload(); } finally { setSaving(false); } })(fd); }} className="space-y-4">
          <Field label="Sponsor Name" required><Input name="name" defaultValue={editing?.name} required className="h-10" /></Field>
          <Field label="Website URL"><Input name="websiteUrl" type="url" defaultValue={editing?.websiteUrl || ""} className="h-10" placeholder="https://example.com" /></Field>
          <Field label="Category">
            <Select name="category" defaultValue={editing?.category || "Partner"}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Sponsor">Sponsor</SelectItem>
                <SelectItem value="Partner">Partner</SelectItem>
                <SelectItem value="Supporter">Supporter</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <label className="flex items-center gap-2 cursor-pointer"><Switch name="isActive" defaultChecked={editing?.isActive ?? true} /><span className="text-[13px]">Active</span></label>
        </form>
      </EntityDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-[var(--leo-red)]" />Delete sponsor?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete <strong>{deleteTarget?.name}</strong>.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => { if (deleteTarget) { await deleteSponsor(deleteTarget.id); toast({ title: "Sponsor deleted" }); setDeleteTarget(null); window.location.reload(); } }} className="bg-[var(--leo-red)] hover:bg-[var(--leo-red)]/90 text-white"><Trash2 className="h-4 w-4 mr-2" />Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================
// DOWNLOADS MANAGER
// ============================================================
type Download = { id: string; title: string; description: string | null; fileUrl: string; fileType: string; fileSize: number; category: string; version: string; downloadCount: number; isPublished: boolean; createdAt: Date };

export function DownloadsManager({ initialDownloads }: { initialDownloads: Download[] }) {
  const [items, setItems] = React.useState(initialDownloads);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Download | null>(null);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <div>
      <ModuleHeader title="Downloads" description={`${items.length} files · ${items.reduce((sum, d) => sum + d.downloadCount, 0)} total downloads`}>
        <Button onClick={() => setDialogOpen(true)} size="sm" className="h-10 rounded-lg bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-1.5">
          <Upload className="h-4 w-4" /> Add File
        </Button>
      </ModuleHeader>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((d) => (
          <Card key={d.id} className="hover:shadow-soft transition-shadow group">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--leo-red)]/10 text-[var(--leo-red)] shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[14px] truncate">{d.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{d.fileType.toUpperCase()} · {d.version} · {(d.fileSize / 1024).toFixed(0)} KB</div>
                  <Badge variant="outline" className="text-[10px] mt-1">{d.category}</Badge>
                </div>
              </div>
              {d.description && <p className="mt-3 text-[12px] text-muted-foreground line-clamp-2">{d.description}</p>}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11.5px] text-muted-foreground">{d.downloadCount} downloads</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setDeleteTarget(d)} className="text-[11.5px] px-2 py-1 rounded hover:bg-muted text-[var(--leo-red)]">Delete</button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EntityDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Add Download"
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">{saving ? "Saving…" : "Add"}</Button>
          </>
        }
      >
        <form ref={formRef} onSubmit={(e: any) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); (async (fd: FormData) => { setSaving(true); try { await createDownload(fd); toast({ title: "File added" }); window.location.reload(); } finally { setSaving(false); } })(fd); }} className="space-y-4">
          <Field label="Title" required><Input name="title" required className="h-10" /></Field>
          <Field label="Description"><Textarea name="description" rows={2} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="File URL" required><Input name="fileUrl" required className="h-10" placeholder="/downloads/..." /></Field>
            <Field label="File Type"><Input name="fileType" defaultValue="pdf" className="h-10" /></Field>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Category">
              <Select name="category" defaultValue="Document">
                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Document">Document</SelectItem>
                  <SelectItem value="Form">Form</SelectItem>
                  <SelectItem value="Report">Report</SelectItem>
                  <SelectItem value="Newsletter">Newsletter</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Version"><Input name="version" defaultValue="1.0" className="h-10" /></Field>
            <Field label="File Size (bytes)"><Input name="fileSize" type="number" defaultValue="0" className="h-10" /></Field>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><Switch name="isPublished" defaultChecked /><span className="text-[13px]">Published</span></label>
        </form>
      </EntityDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-[var(--leo-red)]" />Delete file?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete <strong>{deleteTarget?.title}</strong>.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => { if (deleteTarget) { await deleteDownload(deleteTarget.id); toast({ title: "File deleted" }); setDeleteTarget(null); window.location.reload(); } }} className="bg-[var(--leo-red)] hover:bg-[var(--leo-red)]/90 text-white"><Trash2 className="h-4 w-4 mr-2" />Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================
// CONTACT MESSAGES MANAGER
// ============================================================
type ContactMessage = { id: string; name: string; email: string; phone: string | null; subject: string; message: string; isRead: boolean; isReplied: boolean; createdAt: Date };

export function MessagesManager({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = React.useState(initialMessages);
  const [viewing, setViewing] = React.useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ContactMessage | null>(null);
  const { toast } = useToast();

  return (
    <div>
      <ModuleHeader title="Contact Messages" description={`${messages.length} messages · ${messages.filter((m) => !m.isRead).length} unread`} />

      <div className="space-y-2">
        {messages.length === 0 ? (
          <Card><CardContent className="py-16 text-center text-[13px] text-muted-foreground">No messages yet.</CardContent></Card>
        ) : messages.map((m) => (
          <Card key={m.id} className={cn("hover:shadow-soft transition-shadow cursor-pointer", !m.isRead && "border-primary/30 bg-primary/[0.02]")} onClick={() => { setViewing(m); if (!m.isRead) { markMessageRead(m.id); } }}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("h-2 w-2 rounded-full shrink-0", m.isRead ? "bg-transparent" : "bg-[var(--leo-blue)]")} />
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[var(--leo-blue)] to-[var(--leo-red)] text-white font-serif font-bold text-[13px] shrink-0">
                {m.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[13.5px]">{m.name}</span>
                  <span className="text-[11.5px] text-muted-foreground">· {m.subject}</span>
                </div>
                <p className="text-[12px] text-muted-foreground line-clamp-1 mt-0.5">{m.message}</p>
              </div>
              <span className="text-[11px] text-muted-foreground shrink-0">{new Date(m.createdAt).toLocaleDateString()}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <EntityDialog
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="Message Details"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
            <Button onClick={() => { window.location.href = `mailto:${viewing?.email}`; }} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">
              <Mail className="h-4 w-4 mr-1.5" />Reply
            </Button>
            <Button variant="outline" onClick={() => setDeleteTarget(viewing)} className="text-[var(--leo-red)] border-[var(--leo-red)]/30 hover:bg-[var(--leo-red)]/10">
              <Trash2 className="h-4 w-4 mr-1.5" />Delete
            </Button>
          </>
        }
      >
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-[var(--leo-blue)] to-[var(--leo-red)] text-white font-serif font-bold shrink-0">
                {viewing.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-serif font-bold text-[15px]">{viewing.name}</h3>
                <div className="text-[12px] text-muted-foreground mt-0.5">{new Date(viewing.createdAt).toLocaleString()}</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-[13px]">
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{viewing.email}</div>
              {viewing.phone && <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{viewing.phone}</div>}
            </div>
            <div>
              <div className="text-[11px] uppercase text-muted-foreground font-semibold mb-1.5">Subject</div>
              <div className="font-medium text-[14px]">{viewing.subject}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase text-muted-foreground font-semibold mb-1.5">Message</div>
              <p className="text-[13.5px] leading-relaxed bg-muted/30 rounded-lg p-4 whitespace-pre-wrap">{viewing.message}</p>
            </div>
          </div>
        )}
      </EntityDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-[var(--leo-red)]" />Delete message?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the message from <strong>{deleteTarget?.name}</strong>.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => { if (deleteTarget) { await deleteContactMessage(deleteTarget.id); toast({ title: "Message deleted" }); setDeleteTarget(null); setViewing(null); window.location.reload(); } }} className="bg-[var(--leo-red)] hover:bg-[var(--leo-red)]/90 text-white"><Trash2 className="h-4 w-4 mr-2" />Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================
// CONTACT INFO MANAGER
// ============================================================
export function ContactManager({ settings }: { settings: Record<string, string> }) {
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();

  const fields = [
    { key: "contact_phone", label: "Phone Number", icon: Phone, placeholder: "+977 9800000000" },
    { key: "contact_email", label: "Email Address", icon: Mail, placeholder: "info@leoclubofpokhara.org.np" },
    { key: "contact_address", label: "Address", icon: MapPin, placeholder: "Pokhara, Kaski, Gandaki, Nepal" },
    { key: "contact_hours", label: "Office Hours", icon: Clock, placeholder: "Sat–Thu · 10:00 AM – 5:00 PM NPT" },
    { key: "social_facebook", label: "Facebook URL", icon: ExternalLink, placeholder: "https://facebook.com/..." },
    { key: "social_instagram", label: "Instagram URL", icon: ExternalLink, placeholder: "https://instagram.com/..." },
    { key: "social_twitter", label: "Twitter URL", icon: ExternalLink, placeholder: "https://twitter.com/..." },
    { key: "social_linkedin", label: "LinkedIn URL", icon: ExternalLink, placeholder: "https://linkedin.com/..." },
    { key: "social_youtube", label: "YouTube URL", icon: ExternalLink, placeholder: "https://youtube.com/..." },
    { key: "map_embed", label: "Google Maps Embed URL", icon: MapPin, placeholder: "https://www.google.com/maps/embed?..." },
  ];

  return (
    <div>
      <ModuleHeader title="Contact Information" description="Update the contact details shown on the public website." />
      <Card>
        <CardContent className="p-6">
          <form onSubmit={(e: any) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); (async (fd: FormData) => {
            setSaving(true);
            try {
              for (const f of fields) {
                const val = fd.get(f.key) as string;
                if (val !== undefined) { const updates: Record<string,string> = {}; updates[f.key] = val; await saveContent(updates); }
              }
              toast({ title: "Contact info saved" });
              window.location.reload();
            } catch (e) {
              toast({ title: "Save failed", description: e instanceof Error ? e.message : "", variant: "destructive" });
            } finally { setSaving(false); }
          })(fd); }} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {fields.map((f) => {
                const Icon = f.icon;
                return (
                  <Field key={f.key} label={f.label}>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input name={f.key} defaultValue={settings[f.key] || ""} className="h-10 pl-10" placeholder={f.placeholder} />
                    </div>
                  </Field>
                );
              })}
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
