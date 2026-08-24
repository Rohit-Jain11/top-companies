import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().max(255).optional(),
  content: z.string().optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE"),
  publishedAt: z.coerce.date().optional().nullable(),
  blogCategoryId: z.coerce.number().int().positive().optional().nullable(),

  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  canonicalUrl: z.string().max(500).optional().nullable(),
  ogTitle: z.string().max(255).optional().nullable(),
  ogDescription: z.string().max(500).optional().nullable(),
  ogImage: z.string().max(500).optional().nullable(),
  robots: z.string().max(100).optional().nullable(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const bulkDeleteBlogsSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1, "Select at least one blog"),
});

export const bulkStatusBlogsSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1, "Select at least one blog"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
