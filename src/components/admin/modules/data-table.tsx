"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Search, Download, Upload, MoreHorizontal, Pencil, Trash2, Eye, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
};

export type FilterOption = {
  label: string;
  value: string;
};

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading,
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  onFilterChange,
  activeFilter,
  onAdd,
  addLabel,
  onEdit,
  onDelete,
  onView,
  onBulkExport,
  onBulkImport,
  bulkActions,
  emptyMessage = "No records found.",
  additionalActions,
}: {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  search?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  filters?: { key: string; label: string; options: FilterOption[] }[];
  onFilterChange?: (key: string, value: string) => void;
  activeFilter?: Record<string, string>;
  onAdd?: () => void;
  addLabel?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  onBulkExport?: () => void;
  onBulkImport?: () => void;
  bulkActions?: React.ReactNode;
  emptyMessage?: string;
  additionalActions?: React.ReactNode;
}) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const toggleAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.map((d) => d.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        {/* Search */}
        {onSearchChange && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder || "Search…"}
              className="pl-10 h-10 rounded-lg"
            />
          </div>
        )}

        {/* Filters */}
        {filters && filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Select
                key={f.key}
                value={activeFilter?.[f.key] || "ALL"}
                onValueChange={(v) => onFilterChange?.(f.key, v)}
              >
                <SelectTrigger className="h-10 w-40 rounded-lg">
                  <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder={f.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All {f.label}</SelectItem>
                  {f.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
            <span className="text-[12.5px] font-medium text-primary">{selected.size} selected</span>
            {bulkActions}
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())} className="h-7 text-[12px]">Clear</Button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onBulkImport && (
            <Button variant="outline" size="sm" onClick={onBulkImport} className="h-10 rounded-lg gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Import</span>
            </Button>
          )}
          {onBulkExport && (
            <Button variant="outline" size="sm" onClick={onBulkExport} className="h-10 rounded-lg gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}
          {additionalActions}
          {onAdd && (
            <Button onClick={onAdd} size="sm" className="h-10 rounded-lg bg-[var(--leo-blue)] hover:bg-[var(--leo-blue)]/90 text-white gap-1.5">
              <Plus className="h-4 w-4" />
              {addLabel || "Add New"}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selected.size === data.length}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-border accent-[var(--leo-blue)] cursor-pointer"
                    aria-label="Select all"
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "text-left px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground whitespace-nowrap",
                      col.className
                    )}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      {col.header}
                      {col.sortable && <ArrowUpDown className="h-3 w-3 opacity-50" />}
                    </div>
                  </th>
                ))}
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/60">
                    <td className="px-4 py-3"><Skeleton className="h-4 w-4" /></td>
                    {columns.map((col, j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full max-w-[120px]" /></td>
                    ))}
                    <td className="px-4 py-3"></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="px-4 py-16 text-center">
                    <div className="text-[14px] font-medium text-foreground mb-1">No records found</div>
                    <div className="text-[12.5px] text-muted-foreground">{emptyMessage}</div>
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.3) }}
                    className={cn(
                      "border-b border-border/60 hover:bg-muted/30 transition-colors group",
                      selected.has(row.id) && "bg-primary/[0.03]"
                    )}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleOne(row.id)}
                        className="h-4 w-4 rounded border-border accent-[var(--leo-blue)] cursor-pointer"
                        aria-label="Select row"
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-4 py-3 text-[13px]", col.className)}>
                        {col.cell(row)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="inline-flex items-center justify-center h-7 w-7 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                            aria-label="Row actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(row)}>
                              <Eye className="h-3.5 w-3.5 mr-2" /> View
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(row)}>
                              <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(row)}
                              className="text-[var(--leo-red)] focus:text-[var(--leo-red)]"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        {!loading && data.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border text-[12.5px] text-muted-foreground">
            <span>Showing {data.length} of {data.length} records</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7" disabled>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="icon" className="h-7 w-7" disabled>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

/** Reusable page header for module pages */
export function ModuleHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-serif font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-[13.5px] text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
