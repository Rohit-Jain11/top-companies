import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toQueryParams, type ListParams } from "@/lib/list-params";
import { ApiItemResponse, ApiListResponse, Blog } from "@/lib/types";

const KEY = "blogs";

export const useBlogsQuery = (params: ListParams) =>
  useQuery({
    queryKey: [KEY, params],
    queryFn: async () => {
      const res = await api.get<ApiListResponse<Blog>>("/admin/blogs", {
        params: toQueryParams(params),
      });
      return res.data;
    },
  });

export const useBlogQuery = (id: number | undefined) =>
  useQuery({
    queryKey: [KEY, id],
    queryFn: async () => {
      const res = await api.get<ApiItemResponse<Blog>>(`/admin/blogs/${id}`);
      return res.data.data;
    },
    enabled: id !== undefined,
  });

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await api.post<ApiItemResponse<Blog>>("/admin/blogs", payload);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useUpdateBlog = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await api.patch<ApiItemResponse<Blog>>(`/admin/blogs/${id}`, payload);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/blogs/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useRestoreBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.post(`/admin/blogs/${id}/restore`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const usePermanentlyDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/blogs/${id}/permanent`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useBulkDeleteBlogs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await api.post("/admin/blogs/bulk-delete", { ids });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useBulkRestoreBlogs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await api.post("/admin/blogs/bulk-restore", { ids });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useBulkPermanentlyDeleteBlogs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await api.post("/admin/blogs/bulk-permanent-delete", { ids });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useBulkUpdateBlogStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, status }: { ids: number[]; status: "ACTIVE" | "INACTIVE" }) => {
      await api.post("/admin/blogs/bulk-status", { ids, status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
};
