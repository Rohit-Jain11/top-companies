"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ColumnDef, RowSelectionState, SortingState } from "@tanstack/react-table";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table";
import { StatusSwitch } from "@/components/shared/status-switch";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useBulkDeleteBlogCategories,
  useBulkPermanentlyDeleteBlogCategories,
  useBulkRestoreBlogCategories,
  useBulkUpdateBlogCategoryStatus,
  useBlogCategoriesQuery,
  useDeleteBlogCategory,
  usePermanentlyDeleteBlogCategory,
  useRestoreBlogCategory,
  useUpdateBlogCategory,
} from "@/lib/queries/blog-categories";
import { BlogCategory, statusFilterLabel } from "@/lib/types";
import { getErrorMessage } from "@/lib/api-client";

function BlogCategoryStatusCell({ category }: { category: BlogCategory }) {
  const update = useUpdateBlogCategory(category.id);
  return <StatusSwitch status={category.status} onToggle={(next) => update.mutateAsync({ status: next })} />;
}

export default function BlogCategoriesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [deleteTarget, setDeleteTarget] = useState<BlogCategory | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<BlogCategory | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkPermanentDeleteOpen, setBulkPermanentDeleteOpen] = useState(false);

  const isDeletedView = status === "DELETED";

  const sort = sorting[0];
  const { data, isLoading } = useBlogCategoriesQuery({
    page,
    limit: 50,
    search,
    status: status || undefined,
    sortBy: sort?.id,
    sortOrder: sort ? (sort.desc ? "desc" : "asc") : undefined,
  });

  const deleteCategory = useDeleteBlogCategory();
  const restoreCategory = useRestoreBlogCategory();
  const permanentlyDeleteCategory = usePermanentlyDeleteBlogCategory();
  const bulkDelete = useBulkDeleteBlogCategories();
  const bulkRestore = useBulkRestoreBlogCategories();
  const bulkPermanentlyDelete = useBulkPermanentlyDeleteBlogCategories();
  const bulkStatus = useBulkUpdateBlogCategoryStatus();

  const columns = useMemo<ColumnDef<BlogCategory, unknown>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <Link href={`/blog-categories/${row.original.id}`} className="flex items-center gap-2">
            <span className="max-w-56 truncate font-medium hover:underline">{row.original.name}</span>
          </Link>
        ),
      },
      {
        id: "blogs",
        header: "Blogs",
        cell: ({ row }) => row.original._count?.blogs ?? 0,
        enableSorting: false,
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) =>
          isDeletedView ? (
            <span className="text-xs font-medium text-muted-foreground">Deleted</span>
          ) : (
            <BlogCategoryStatusCell category={row.original} />
          ),
        enableSorting: false,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) =>
          isDeletedView ? (
            <div className="flex justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  try {
                    await restoreCategory.mutateAsync(row.original.id);
                    toast.success("Blog Category restored");
                  } catch (error) {
                    toast.error(getErrorMessage(error));
                  }
                }}
              >
                <RotateCcw className="size-3.5" /> Restore
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => setPermanentDeleteTarget(row.original)}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href={`/blog-categories/${row.original.id}`} />}
              >
                Edit
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(row.original)}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ),
        enableSorting: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDeletedView, restoreCategory]
  );

  const handleBulkStatus = async (newStatus: "ACTIVE" | "INACTIVE") => {
    const ids = Object.keys(rowSelection).filter((id) => rowSelection[id]).map(Number);
    try {
      await bulkStatus.mutateAsync({ ids, status: newStatus });
      setRowSelection({});
      toast.success("Status updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleBulkDelete = async () => {
    const ids = Object.keys(rowSelection).filter((id) => rowSelection[id]).map(Number);
    try {
      await bulkDelete.mutateAsync(ids);
      setRowSelection({});
      setBulkDeleteOpen(false);
      toast.success("Blog Categories deleted");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleBulkRestore = async () => {
    const ids = Object.keys(rowSelection).filter((id) => rowSelection[id]).map(Number);
    try {
      await bulkRestore.mutateAsync(ids);
      setRowSelection({});
      toast.success("Blog Categories restored");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleBulkPermanentDelete = async () => {
    const ids = Object.keys(rowSelection).filter((id) => rowSelection[id]).map(Number);
    try {
      await bulkPermanentlyDelete.mutateAsync(ids);
      setRowSelection({});
      setBulkPermanentDeleteOpen(false);
      toast.success("Blog Categories permanently deleted");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blog Categories</h1>
          <p className="text-sm text-muted-foreground">Manage blog categories.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        meta={data?.meta}
        isLoading={isLoading}
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search blog categories..."
        page={page}
        onPageChange={setPage}
        sorting={sorting}
        onSortingChange={setSorting}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        emptyMessage="No blog categories found."
        filtersSlot={
          <Select
            value={status || "all"}
            onValueChange={(v) => {
              setStatus(!v || v === "all" ? "" : v);
              setRowSelection({});
              setPage(1);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status">{statusFilterLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="DELETED">Deleted</SelectItem>
            </SelectContent>
          </Select>
        }
        toolbarRight={
          !isDeletedView && (
            <Button nativeButton={false} render={<Link href="/blog-categories/new" />}>
              <Plus className="size-4" /> Add Category
            </Button>
          )
        }
        bulkActionsSlot={() =>
          isDeletedView ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleBulkRestore}>
                <RotateCcw className="size-3.5" /> Restore
              </Button>
              <Button variant="outline" size="sm" onClick={() => setBulkPermanentDeleteOpen(true)}>
                <Trash2 className="size-3.5" /> Delete Permanently
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleBulkStatus("ACTIVE")}>
                Activate
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkStatus("INACTIVE")}>
                Deactivate
              </Button>
              <Button variant="outline" size="sm" onClick={() => setBulkDeleteOpen(true)}>
                <Trash2 className="size-3.5" /> Delete
              </Button>
            </div>
          )
        }
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete blog category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? You can restore it later from the Deleted filter.`}
        isLoading={deleteCategory.isPending}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await deleteCategory.mutateAsync(deleteTarget.id);
            toast.success("Blog Category deleted");
            setDeleteTarget(null);
          } catch (error) {
            toast.error(getErrorMessage(error));
          }
        }}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title="Delete selected categories"
        description="Are you sure you want to delete the selected categories? You can restore them later from the Deleted filter."
        isLoading={bulkDelete.isPending}
        onConfirm={handleBulkDelete}
      />

      <ConfirmDialog
        open={!!permanentDeleteTarget}
        onOpenChange={(open) => !open && setPermanentDeleteTarget(null)}
        title="Permanently delete category"
        description={`This cannot be undone. Permanently delete "${permanentDeleteTarget?.name}"?`}
        confirmLabel="Delete Permanently"
        isLoading={permanentlyDeleteCategory.isPending}
        onConfirm={async () => {
          if (!permanentDeleteTarget) return;
          try {
            await permanentlyDeleteCategory.mutateAsync(permanentDeleteTarget.id);
            toast.success("Blog Category permanently deleted");
            setPermanentDeleteTarget(null);
          } catch (error) {
            toast.error(getErrorMessage(error));
          }
        }}
      />

      <ConfirmDialog
        open={bulkPermanentDeleteOpen}
        onOpenChange={setBulkPermanentDeleteOpen}
        title="Permanently delete selected categories"
        description="This cannot be undone. Permanently delete the selected categories?"
        confirmLabel="Delete Permanently"
        isLoading={bulkPermanentlyDelete.isPending}
        onConfirm={handleBulkPermanentDelete}
      />
    </div>
  );
}
