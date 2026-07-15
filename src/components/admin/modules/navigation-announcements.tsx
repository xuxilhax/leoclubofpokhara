"use client";

import * as React from "react";
import { Trash2, Plus, Menu, Eye, EyeOff, AlertCircle } from "lucide-react";
import { ModuleHeader } from "./data-table";
import { EntityDialog, Field } from "./entity-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { createRecord, deleteRecord, fetchRecords } from "@/lib/admin-api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type NavItem = { id: string; label: string; href: string; order: number; isActive: boolean };

export function NavigationManager() {
  const [items, setItems] = React.useState<NavItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<NavItem | null>(null);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    fetchRecords("NavigationItem").then((data) => {
      setItems(data as NavItem[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (formData: FormData) => {
    setSaving(true);
    try {
      await createRecord("NavigationItem", { label: formData.get("label"), href: formData.get("href"), isActive: formData.get("isActive") !== "false" });
      toast({ title: "Navigation item added!" });
      setDialogOpen(false);
      const data = await fetchRecords("NavigationItem");
      setItems(data as NavItem[]);
    } catch (err) {
      toast({ title: "Failed", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRecord("NavigationItem", deleteTarget.id);
      toast({ title: "Deleted" });
      setDeleteTarget(null);
      const data = await fetchRecords("NavigationItem");
      setItems(data as NavItem[]);
    } catch {
      toast({ title: "Failed", variant: "destructive" });
    }
  };

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading…</div>;

  return (
    <div>
      <ModuleHeader title="Navigation Menu" description="Edit the links that appear in the website navbar.">
        <Button onClick={() => setDialogOpen(true)} size="sm" className="h-10 rounded-lg bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-1.5">
          <Plus className="h-4 w-4" /> Add Link
        </Button>
      </ModuleHeader>

      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="py-16 text-center text-[13px] text-muted-foreground">No navigation items. Click "Add Link" to create one.</div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 p-4 hover:bg-muted/30">
                  <Menu className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[11px] font-mono text-muted-foreground w-6">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[14px]">{item.label}</div>
                    <div className="text-[12px] text-muted-foreground font-mono">{item.href}</div>
                  </div>
                  <Badge variant="outline" className={item.isActive ? "text-green-700 border-green-500/30" : "text-muted-foreground"}>
                    {item.isActive ? "Active" : "Hidden"}
                  </Badge>
                  <button onClick={() => setDeleteTarget(item)} className="text-[12px] px-2.5 py-1 rounded hover:bg-muted text-[var(--leo-red)]">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EntityDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Add Navigation Link"
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => { const f = formRef.current; if (!f) return; handleSave(new FormData(f)); }} disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">
              {saving ? "Saving…" : "Add Link"}
            </Button>
          </>
        }
      >
        <form ref={formRef} onSubmit={(e: any) => e.preventDefault()} className="space-y-4">
          <Field label="Link Label" required>
            <Input name="label" required className="h-10" placeholder="Home, About, Events…" />
          </Field>
          <Field label="Link URL" required>
            <Input name="href" required className="h-10" placeholder="#home, #about, #events…" />
          </Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch name="isActive" defaultChecked />
            <span className="text-[13px]">Active (visible on site)</span>
          </label>
        </form>
      </EntityDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-[var(--leo-red)]" />Delete this link?</AlertDialogTitle>
            <AlertDialogDescription>This will remove "{deleteTarget?.label}" from the navigation menu.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-[var(--leo-red)] hover:bg-[var(--leo-red)]/90 text-white">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================
// ANNOUNCEMENTS MANAGER
// ============================================================
type Announcement = { id: string; title: string; message: string; type: string; isActive: boolean; createdAt: Date };

export function AnnouncementsManager() {
  const [items, setItems] = React.useState<Announcement[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Announcement | null>(null);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    fetchRecords("Announcement").then((data) => {
      setItems(data as Announcement[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (formData: FormData) => {
    setSaving(true);
    try {
      
      await createRecord("Announcement", { title: formData.get("title"), message: formData.get("message"), type: formData.get("type") || "info", isActive: formData.get("isActive") !== "false" });
      toast({ title: "Announcement created!" });
      setDialogOpen(false);
      
      const data = await fetchRecords("Announcement");
      setItems(data as Announcement[]);
    } catch (err) {
      toast({ title: "Failed", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      
      await deleteRecord("Announcement", deleteTarget.id);
      toast({ title: "Deleted" });
      setDeleteTarget(null);
      
      const data = await fetchRecords("Announcement");
      setItems(data as Announcement[]);
    } catch {
      toast({ title: "Failed", variant: "destructive" });
    }
  };

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading…</div>;

  const typeColors: Record<string, string> = {
    info: "bg-[var(--leo-blue)]/15 text-[var(--leo-blue)] border-[var(--leo-blue)]/30",
    success: "bg-green-500/15 text-green-700 border-green-500/30",
    warning: "bg-[var(--leo-gold)]/20 text-[#8B6510] border-[var(--leo-gold)]/30",
    error: "bg-[var(--leo-red)]/15 text-[var(--leo-red)] border-[var(--leo-red)]/30",
  };

  return (
    <div>
      <ModuleHeader title="Announcements" description="Site-wide announcement banners shown to visitors.">
        <Button onClick={() => setDialogOpen(true)} size="sm" className="h-10 rounded-lg bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-1.5">
          <Plus className="h-4 w-4" /> New Announcement
        </Button>
      </ModuleHeader>

      <div className="space-y-3">
        {items.length === 0 ? (
          <Card><CardContent className="py-16 text-center text-[13px] text-muted-foreground">No announcements yet.</CardContent></Card>
        ) : (
          items.map((a) => (
            <Card key={a.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif font-semibold text-[15px]">{a.title}</h3>
                      <Badge variant="outline" className={cn("text-[10px]", typeColors[a.type] || "")}>{a.type}</Badge>
                      <Badge variant="outline" className={a.isActive ? "text-green-700 border-green-500/30" : "text-muted-foreground"}>
                        {a.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-[13px] text-muted-foreground">{a.message}</p>
                  </div>
                  <button onClick={() => setDeleteTarget(a)} className="text-[12px] px-2.5 py-1 rounded hover:bg-muted text-[var(--leo-red)] shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <EntityDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="New Announcement"
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => { const f = formRef.current; if (!f) return; handleSave(new FormData(f)); }} disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">
              {saving ? "Saving…" : "Create"}
            </Button>
          </>
        }
      >
        <form ref={formRef} onSubmit={(e: any) => e.preventDefault()} className="space-y-4">
          <Field label="Title" required>
            <Input name="title" required className="h-10" placeholder="Important announcement" />
          </Field>
          <Field label="Message" required>
            <Input name="message" required className="h-10" placeholder="Details of the announcement…" />
          </Field>
          <Field label="Type">
            <select name="type" className="w-full h-10 rounded-md border border-border bg-background px-3 text-[13px]">
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch name="isActive" defaultChecked />
            <span className="text-[13px]">Active (visible on site)</span>
          </label>
        </form>
      </EntityDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-[var(--leo-red)]" />Delete announcement?</AlertDialogTitle>
            <AlertDialogDescription>This will remove "{deleteTarget?.title}".</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-[var(--leo-red)] hover:bg-[var(--leo-red)]/90 text-white">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
