"use client";

import * as React from "react";
import { Trash2, AlertCircle } from "lucide-react";
import { DataTable, ModuleHeader, type Column } from "./data-table";
import { EntityDialog, Field } from "./entity-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  createMember, updateMember, deleteMember,
} from "@/lib/actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type Member = {
  id: string;
  memberId: string;
  name: string;
  email: string;
  phone: string | null;
  position: string | null;
  joinDate: Date;
  status: string;
  membershipType: string;
  notes: string | null;
  address: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-500/15 text-green-700 border-green-500/30",
  INACTIVE: "bg-muted text-muted-foreground border-border",
  ALUMNI: "bg-[var(--leo-blue)]/15 text-[var(--leo-blue)] border-[var(--leo-blue)]/30",
  RESIGNED: "bg-[var(--leo-red)]/15 text-[var(--leo-red)] border-[var(--leo-red)]/30",
};

export function MembersManager({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = React.useState(initialMembers);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Member | null>(null);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const filtered = React.useMemo(() => {
    return members.filter((m) => {
      const matchesSearch = !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.memberId.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [members, search, statusFilter]);

  const columns: Column<Member>[] = [
    {
      key: "name",
      header: "Member",
      cell: (m) => (
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-[var(--leo-blue)] to-[var(--leo-red)] text-white font-serif font-bold text-[13px] shrink-0">
            {m.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">{m.name}</div>
            <div className="text-[11.5px] text-muted-foreground truncate">{m.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "memberId",
      header: "Member ID",
      cell: (m) => <span className="font-mono text-[12px]">{m.memberId}</span>,
    },
    {
      key: "position",
      header: "Position",
      cell: (m) => <span className="text-[12.5px]">{m.position || "—"}</span>,
    },
    {
      key: "phone",
      header: "Phone",
      cell: (m) => <span className="text-[12.5px] text-muted-foreground">{m.phone || "—"}</span>,
    },
    {
      key: "joinDate",
      header: "Joined",
      cell: (m) => <span className="text-[12.5px] text-muted-foreground">{new Date(m.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (m) => (
        <Badge variant="outline" className={`text-[10.5px] h-5 ${STATUS_COLORS[m.status] || ""}`}>
          {m.status.toLowerCase()}
        </Badge>
      ),
    },
  ];

  const handleAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (m: Member) => {
    setEditing(m);
    setDialogOpen(true);
  };

  const handleSave = async (formData: FormData) => {
    setSaving(true);
    try {
      if (editing) {
        await updateMember(editing.id, formData);
        toast({ title: "Member updated" });
      } else {
        await createMember(formData);
        toast({ title: "Member added" });
      }
      // Refresh data
      window.location.reload();
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMember(deleteTarget.id);
      toast({ title: "Member deleted" });
      setDeleteTarget(null);
      window.location.reload();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    // Build CSV
    const headers = ["Member ID", "Name", "Email", "Phone", "Position", "Status", "Join Date"];
    const rows = filtered.map((m) => [
      m.memberId, m.name, m.email, m.phone || "", m.position || "", m.status,
      new Date(m.joinDate).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leo-members-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported to CSV" });
  };

  return (
    <div>
      <ModuleHeader
        title="Members"
        description={`${members.length} members in the database · ${members.filter((m) => m.status === "ACTIVE").length} active`}
      />
      <DataTable
        columns={columns}
        data={filtered}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email, or member ID…"
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
              { label: "Alumni", value: "ALUMNI" },
              { label: "Resigned", value: "RESIGNED" },
            ],
          },
        ]}
        activeFilter={{ status: statusFilter }}
        onFilterChange={(_, v) => setStatusFilter(v)}
        onAdd={handleAdd}
        addLabel="Add Member"
        onEdit={handleEdit}
        onDelete={(m) => setDeleteTarget(m)}
        onBulkExport={handleExport}
        emptyMessage="Try adjusting your search or filters."
      />

      <EntityDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Edit Member" : "Add New Member"}
        description={editing ? "Update the member's information below." : "Fill in the details for the new member."}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => formRef.current?.requestSubmit()}
              disabled={saving}
              className="bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white"
            >
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Member"}
            </Button>
          </>
        }
      >
        <form ref={formRef} action={handleSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <Input name="name" defaultValue={editing?.name} required className="h-10" placeholder="Aarav Sharma" />
            </Field>
            <Field label="Member ID" required>
              <Input name="memberId" defaultValue={editing?.memberId || `LCP-2025-${String(members.length + 1).padStart(3, "0")}`} required className="h-10 font-mono" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email" required>
              <Input name="email" type="email" defaultValue={editing?.email} required className="h-10" placeholder="member@leo.club" />
            </Field>
            <Field label="Phone">
              <Input name="phone" defaultValue={editing?.phone || ""} className="h-10" placeholder="+977 98XXXXXXXX" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Position">
              <Input name="position" defaultValue={editing?.position || ""} className="h-10" placeholder="Director — Service" />
            </Field>
            <Field label="Join Date" required>
              <Input
                name="joinDate"
                type="date"
                required
                defaultValue={editing ? new Date(editing.joinDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
                className="h-10"
              />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Status">
              <Select name="status" defaultValue={editing?.status || "ACTIVE"}>
                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="ALUMNI">Alumni</SelectItem>
                  <SelectItem value="RESIGNED">Resigned</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Membership Type">
              <Select name="membershipType" defaultValue={editing?.membershipType || "STANDARD"}>
                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="LIFE">Life</SelectItem>
                  <SelectItem value="HONORARY">Honorary</SelectItem>
                  <SelectItem value="CHARTER">Charter</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Address">
            <Input name="address" defaultValue={editing?.address || ""} className="h-10" placeholder="Lakeside, Pokhara" />
          </Field>
          <Field label="Notes">
            <Textarea name="notes" defaultValue={editing?.notes || ""} rows={3} placeholder="Internal notes about this member…" />
          </Field>
        </form>
      </EntityDialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[var(--leo-red)]" />
              Delete member?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-[var(--leo-red)] hover:bg-[var(--leo-red)]/90 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
