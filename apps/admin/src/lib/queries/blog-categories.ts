import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toQueryParams, type ListParams } from "@/lib/list-params";
import { ApiItemResponse, ApiListResponse, BlogCategory } from "@/lib/types";

const KEY = "blog-categories";

export const useBlogCategoriesQuery = (params: ListParams) =>
  useQuery({
    queryKey: [KEY, params],
    queryFn: async () => {
      const res = await api.get<ApiListResponse<BlogCategory>>("/admin/blog-categories", {
        params: toQueryParams(params),
      });
      return res.data;
    },
  });

export const useAllBlogCategoriesQuery = () =>
  useQuery({
    queryKey: [KEY, "all"],
    queryFn: async () => {
      const res = await api.get<ApiListResponse<BlogCategory>>("/admin/blog-categories", {
        params: { limit: 200, status: "ACTIVE" },
      });
      return res.data.data;
    },
  });

export const useBlogCategoryQuery = (id: number | undefined) =>
  useQuery({
    queryKey: [KEY, id],
    queryFn: async () => {
      const res = await api.get<ApiItemResponse<BlogCategory>>(`/admin/blog-categories/${id}`);
      return res.data.data;
    },
    enabled: id !== undefined,
  });

export const useCreateBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await api.post<ApiItemResponse<BlogCategory>>("/admin/blog-categories", payload);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useUpdateBlogCategory = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await api.patch<ApiItemResponse<BlogCategory>>(`/admin/blog-categories/${id}`, payload);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useDeleteBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/blog-categories/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useRestoreBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.post(`/admin/blog-categories/${id}/restore`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const usePermanentlyDeleteBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/blog-categories/${id}/permanent`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useBulkDeleteBlogCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await api.post("/admin/blog-categories/bulk-delete", { ids });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useBulkRestoreBlogCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await api.post("/admin/blog-categories/bulk-restore", { ids });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useBulkPermanentlyDeleteBlogCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await api.post("/admin/blog-categories/bulk-permanent-delete", { ids });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useBulkUpdateBlogCategoryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, status }: { ids: number[]; status: "ACTIVE" | "INACTIVE" }) => {
      await api.post("/admin/blog-categories/bulk-status", { ids, status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};
