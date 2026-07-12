"use client";

import * as React from "react";
import { Copy, Eye, EyeOff, AlertCircle, Calendar, MapPin, Users, Trash2 } from "lucide-react";
import { DataTable, ModuleHeader, type Column } from "./data-table";
import { EntityDialog, Field } from "./entity-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  createEvent, updateEvent, deleteEvent, duplicateEvent, toggleEventPublish,
} from "@/lib/actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type EventItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  registrationLimit: number;
  isPublished: boolean;
  isFeatured: boolean;
  _count?: { registrations: number };
};

export function EventsManager({ initialEvents }: { initialEvents: EventItem[] }) {
  const [events, setEvents] = React.useState(initialEvents);
  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<EventItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<EventItem | null>(null);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const filtered = events.filter((e) =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<EventItem>[] = [
    {
      key: "title",
      header: "Event",
      cell: (e) => (
        <div>
          <div className="font-medium flex items-center gap-2">
            {e.title}
            {e.isFeatured && <Badge className="bg-[var(--leo-gold)]/20 text-[#8B6510] border-[var(--leo-gold)]/30 text-[10px] h-4 px-1">Featured</Badge>}
          </div>
          <div className="text-[11.5px] text-muted-foreground flex items-center gap-2 mt-0.5">
            <Calendar className="h-3 w-3" />
            {new Date(e.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      cell: (e) => (
        <div className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {e.location}
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (e) => <Badge variant="outline" className="text-[10.5px]">{e.category}</Badge>,
    },
    {
      key: "registrations",
      header: "Registrations",
      cell: (e) => (
        <div className="flex items-center gap-1.5 text-[12.5px]">
          <Users className="h-3 w-3 text-muted-foreground" />
          {e._count?.registrations || 0}
          {e.registrationLimit > 0 && <span className="text-muted-foreground">/ {e.registrationLimit}</span>}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (e) => (
        <button
          onClick={async (ev) => {
            ev.stopPropagation();
            try {
              await toggleEventPublish(e.id);
              toast({ title: e.isPublished ? "Event unpublished" : "Event published" });
              window.location.reload();
            } catch {
              toast({ title: "Failed to update", variant: "destructive" });
            }
          }}
          className="inline-flex items-center gap-1.5 text-[11.5px] font-medium hover:opacity-80"
        >
          {e.isPublished ? (
            <><span className="h-1.5 w-1.5 rounded-full bg-green-500" /><span className="text-green-700">Published</span></>
          ) : (
            <><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" /><span className="text-muted-foreground">Draft</span></>
          )}
        </button>
      ),
    },
  ];

  const handleAdd = () => { setEditing(null); setDialogOpen(true); };
  const handleEdit = (e: EventItem) => { setEditing(e); setDialogOpen(true); };

  const handleSave = async (formData: FormData) => {
    setSaving(true);
    try {
      if (editing) {
        await updateEvent(editing.id, formData);
        toast({ title: "Event updated" });
      } else {
        await createEvent(formData);
        toast({ title: "Event created" });
      }
      window.location.reload();
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDuplicate = async (e: EventItem) => {
    try {
      await duplicateEvent(e.id);
      toast({ title: "Event duplicated" });
      window.location.reload();
    } catch {
      toast({ title: "Failed to duplicate", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEvent(deleteTarget.id);
      toast({ title: "Event deleted" });
      setDeleteTarget(null);
      window.location.reload();
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div>
      <ModuleHeader
        title="Events"
        description={`${events.length} events · ${events.filter((e) => e.isPublished).length} published · ${events.filter((e) => new Date(e.startDate) > new Date()).length} upcoming`}
      />
      <DataTable
        columns={columns}
        data={filtered}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search events…"
        onAdd={handleAdd}
        addLabel="New Event"
        onEdit={handleEdit}
        onDelete={(e) => setDeleteTarget(e)}
        additionalActions={
          <Button variant="outline" size="sm" className="h-10 rounded-lg gap-1.5" onClick={() => toast({ title: "Export coming soon" })}>
            <Copy className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export Attendees</span>
          </Button>
        }
        emptyMessage="No events found. Click 'New Event' to create one."
      />

      <EntityDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Edit Event" : "Create New Event"}
        description={editing ? "Update the event details below." : "Fill in the details for the new event."}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => formRef.current?.requestSubmit()} disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">
              {saving ? "Saving…" : editing ? "Save Changes" : "Create Event"}
            </Button>
          </>
        }
      >
        <form ref={formRef} action={handleSave} className="space-y-4">
          <Field label="Event Title" required>
            <Input name="title" defaultValue={editing?.title} required className="h-10" placeholder="Annual Charter Night 2026" />
          </Field>
          <Field label="Description" required>
            <Textarea name="description" defaultValue={editing?.description} required rows={4} placeholder="Describe the event…" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category">
              <Input name="category" defaultValue={editing?.category || "General"} className="h-10" placeholder="Celebration, Health, Environment…" />
            </Field>
            <Field label="Location" required>
              <Input name="location" defaultValue={editing?.location} required className="h-10" placeholder="Pokhara, Nepal" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Start Date & Time" required>
              <Input
                name="startDate"
                type="datetime-local"
                required
                defaultValue={editing ? toLocalDateTime(new Date(editing.startDate)) : ""}
                className="h-10"
              />
            </Field>
            <Field label="End Date & Time">
              <Input
                name="endDate"
                type="datetime-local"
                defaultValue={editing?.endDate ? toLocalDateTime(new Date(editing.endDate)) : ""}
                className="h-10"
              />
            </Field>
          </div>
          <Field label="Registration Limit" hint="0 = unlimited">
            <Input name="registrationLimit" type="number" min="0" defaultValue={editing?.registrationLimit || 0} className="h-10" />
          </Field>
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch name="isFeatured" defaultChecked={editing?.isFeatured} />
              <span className="text-[13px]">Featured event</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch name="isPublished" defaultChecked={editing?.isPublished ?? true} />
              <span className="text-[13px]">Published</span>
            </label>
          </div>
        </form>
      </EntityDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[var(--leo-red)]" />
              Delete event?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget?.title}</strong> and all associated registrations.
            </AlertDialogDescription>
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

function toLocalDateTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
