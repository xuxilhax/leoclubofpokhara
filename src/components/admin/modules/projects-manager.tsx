"use client";

import * as React from "react";
import { AlertCircle, MapPin, Calendar, Users, Target, DollarSign, Trash2 } from "lucide-react";
import { DataTable, ModuleHeader, type Column } from "./data-table";
import { EntityDialog, Field } from "./entity-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { createProject, updateProject, deleteProject } from "@/lib/actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  budget: number;
  volunteers: number;
  beneficiaries: number;
  impact: string | null;
  isFeatured: boolean;
  isPublished: boolean;
};

export function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = React.useState(initialProjects);
  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Project | null>(null);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const filtered = projects.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Project>[] = [
    {
      key: "title",
      header: "Project",
      cell: (p) => (
        <div>
          <div className="font-medium flex items-center gap-2">
            {p.title}
            {p.isFeatured && <Badge className="bg-[var(--leo-gold)]/20 text-[#8B6510] border-[var(--leo-gold)]/30 text-[10px] h-4 px-1">Featured</Badge>}
          </div>
          <div className="text-[11.5px] text-muted-foreground line-clamp-1 mt-0.5">{p.description}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (p) => <Badge variant="outline" className="text-[10.5px]">{p.category}</Badge>,
    },
    {
      key: "location",
      header: "Location",
      cell: (p) => (
        <div className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
          <MapPin className="h-3 w-3" /> {p.location}
        </div>
      ),
    },
    {
      key: "volunteers",
      header: "Volunteers",
      cell: (p) => (
        <div className="flex items-center gap-1.5 text-[12.5px]">
          <Users className="h-3 w-3 text-muted-foreground" /> {p.volunteers}
        </div>
      ),
    },
    {
      key: "beneficiaries",
      header: "Beneficiaries",
      cell: (p) => (
        <div className="flex items-center gap-1.5 text-[12.5px]">
          <Target className="h-3 w-3 text-muted-foreground" /> {p.beneficiaries.toLocaleString()}
        </div>
      ),
    },
    {
      key: "budget",
      header: "Budget",
      cell: (p) => (
        <div className="flex items-center gap-1.5 text-[12.5px]">
          <DollarSign className="h-3 w-3 text-muted-foreground" /> NPR {p.budget.toLocaleString()}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (p) => (
        <Badge variant="outline" className={p.isPublished ? "text-green-700 border-green-500/30" : "text-muted-foreground"}>
          {p.isPublished ? "Published" : "Draft"}
        </Badge>
      ),
    },
  ];

  const handleSave = async (formData: FormData) => {
    setSaving(true);
    try {
      if (editing) {
        await updateProject(editing.id, formData);
        toast({ title: "Project updated" });
      } else {
        await createProject(formData);
        toast({ title: "Project created" });
      }
      window.location.reload();
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <div>
      <ModuleHeader
        title="Projects"
        description={`${projects.length} projects · ${projects.filter((p) => p.isPublished).length} published`}
      />
      <DataTable
        columns={columns}
        data={filtered}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search projects…"
        onAdd={() => { setEditing(null); setDialogOpen(true); }}
        addLabel="New Project"
        onEdit={(p) => { setEditing(p); setDialogOpen(true); }}
        onDelete={(p) => setDeleteTarget(p)}
        emptyMessage="No projects found."
      />

      <EntityDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Edit Project" : "Create New Project"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white">
              {saving ? "Saving…" : editing ? "Save Changes" : "Create Project"}
            </Button>
          </>
        }
      >
        <form ref={formRef} onSubmit={(e: any) => { e.preventDefault(); handleSave(new FormData(e.currentTarget as HTMLFormElement)); }} className="space-y-4">
          <Field label="Project Title" required>
            <Input name="title" defaultValue={editing?.title} required className="h-10" />
          </Field>
          <Field label="Description" required>
            <Textarea name="description" defaultValue={editing?.description} required rows={4} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category">
              <Input name="category" defaultValue={editing?.category || "Service"} className="h-10" placeholder="Service, Fundraiser, Awareness…" />
            </Field>
            <Field label="Location" required>
              <Input name="location" defaultValue={editing?.location} required className="h-10" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Start Date" required>
              <Input name="startDate" type="date" required defaultValue={editing ? new Date(editing.startDate).toISOString().split("T")[0] : ""} className="h-10" />
            </Field>
            <Field label="End Date">
              <Input name="endDate" type="date" defaultValue={editing?.endDate ? new Date(editing.endDate).toISOString().split("T")[0] : ""} className="h-10" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Budget (NPR)">
              <Input name="budget" type="number" min="0" defaultValue={editing?.budget || 0} className="h-10" />
            </Field>
            <Field label="Volunteers">
              <Input name="volunteers" type="number" min="0" defaultValue={editing?.volunteers || 0} className="h-10" />
            </Field>
            <Field label="Beneficiaries">
              <Input name="beneficiaries" type="number" min="0" defaultValue={editing?.beneficiaries || 0} className="h-10" />
            </Field>
          </div>
          <Field label="Impact Summary" hint="e.g., '1,200+ units collected'">
            <Input name="impact" defaultValue={editing?.impact || ""} className="h-10" />
          </Field>
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch name="isFeatured" defaultChecked={editing?.isFeatured} />
              <span className="text-[13px]">Featured</span>
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
              <AlertCircle className="h-5 w-5 text-[var(--leo-red)]" /> Delete project?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget?.title}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => { if (deleteTarget) { await deleteProject(deleteTarget.id); toast({ title: "Project deleted" }); setDeleteTarget(null); window.location.reload(); } }} className="bg-[var(--leo-red)] hover:bg-[var(--leo-red)]/90 text-white">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
