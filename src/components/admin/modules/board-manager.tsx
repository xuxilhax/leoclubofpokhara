"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Archive, AlertCircle, Trash2, GripVertical, Crown } from "lucide-react";
import { ModuleHeader } from "./data-table";
import { EntityDialog, Field } from "./entity-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  createBoardMember, updateBoardMember, deleteBoardMember, archiveBoardMember,
} from "@/lib/actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type BoardMember = {
  id: string;
  name: string;
  position: string;
  bio: string;
  email: string | null;
  phone: string | null;
  order: number;
  isArchived: boolean;
  boardYear: string;
};

export function BoardManager({ initialMembers }: { initialMembers: BoardMember[] }) {
  const [members, setMembers] = React.useState(initialMembers);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<BoardMember | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<BoardMember | null>(null);
  const [showArchived, setShowArchived] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const visible = members.filter((m) => showArchived ? true : !m.isArchived);
  const active = visible.filter((m) => !m.isArchived);
  const archived = visible.filter((m) => m.isArchived);

  const handleSave = async (formData: FormData) => {
    setSaving(true);
    try {
      if (editing) {
        await updateBoardMember(editing.id, formData);
        toast({ title: "Board member updated" });
      } else {
        await createBoardMember(formData);
        toast({ title: "Board member added" });
      }
      window.location.reload();
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <div>
      <ModuleHeader
        title="Executive Board"
        description={`${active.length} active members · ${archived.length} archived`}
      >
        <Button variant="outline" size="sm" className="h-10 rounded-lg" onClick={() => setShowArchived((v) => !v)}>
          {showArchived ? "Hide Archived" : "Show Archived"}
        </Button>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} size="sm" className="h-10 rounded-lg bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-1.5">
          <Crown className="h-4 w-4" /> Add Member
        </Button>
      </ModuleHeader>

      {active.length > 0 && (
        <div className="mb-6">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-3">
            Current Board · 2025–2026
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map((m, i) => (
              <Card key={m.id} className="p-5 hover:shadow-soft transition-shadow group">
                <div className="flex items-start gap-3">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--leo-blue)] to-[var(--leo-red)] text-white font-serif font-bold shrink-0">
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[14px] truncate">{m.name}</div>
                    <div className="text-[12px] text-primary">{m.position}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{m.email || "—"}</div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={() => { setEditing(m); setDialogOpen(true); }}
                      className="text-[11.5px] px-2 py-1 rounded hover:bg-muted text-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => { await archiveBoardMember(m.id); toast({ title: "Member archived" }); window.location.reload(); }}
                      className="text-[11.5px] px-2 py-1 rounded hover:bg-muted text-muted-foreground"
                      aria-label="Archive"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-[12.5px] text-muted-foreground line-clamp-2">{m.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {showArchived && archived.length > 0 && (
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-3">
            Archived Boards
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-70">
            {archived.map((m) => (
              <Card key={m.id} className="p-5 grayscale">
                <div className="flex items-start gap-3">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-muted text-muted-foreground font-serif font-bold shrink-0">
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[14px] truncate">{m.name}</div>
                    <div className="text-[12px] text-muted-foreground">{m.position}</div>
                    <Badge variant="outline" className="mt-1 text-[10px]">{m.boardYear}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <EntityDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Edit Board Member" : "Add Board Member"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => formRef.current?.requestSubmit()} disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Member"}
            </Button>
          </>
        }
      >
        <form ref={formRef} action={handleSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <Input name="name" defaultValue={editing?.name} required className="h-10" />
            </Field>
            <Field label="Position" required>
              <Input name="position" defaultValue={editing?.position} required className="h-10" placeholder="President, Secretary…" />
            </Field>
          </div>
          <Field label="Bio" required>
            <Textarea name="bio" defaultValue={editing?.bio} required rows={4} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email">
              <Input name="email" type="email" defaultValue={editing?.email || ""} className="h-10" />
            </Field>
            <Field label="Phone">
              <Input name="phone" defaultValue={editing?.phone || ""} className="h-10" />
            </Field>
          </div>
          <Field label="Board Year">
            <Input name="boardYear" defaultValue={editing?.boardYear || "2025-2026"} className="h-10" />
          </Field>
        </form>
      </EntityDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[var(--leo-red)]" /> Delete board member?
            </AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete <strong>{deleteTarget?.name}</strong>.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => { if (deleteTarget) { await deleteBoardMember(deleteTarget.id); toast({ title: "Member deleted" }); setDeleteTarget(null); window.location.reload(); } }} className="bg-[var(--leo-red)] hover:bg-[var(--leo-red)]/90 text-white">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
