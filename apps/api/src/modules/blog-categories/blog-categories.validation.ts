import { z } from "zod";

export const createBlogCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().max(220).optional(),
  description: z.string().optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE"),

  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  canonicalUrl: z.string().max(500).optional().nullable(),
  ogTitle: z.string().max(255).optional().nullable(),
  ogDescription: z.string().max(500).optional().nullable(),
  ogImage: z.string().max(500).optional().nullable(),
  robots: z.string().max(100).optional().nullable(),
});

export const updateBlogCategorySchema = createBlogCategorySchema.partial();

export const bulkDeleteBlogCategoriesSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1, "Select at least one category"),
});

export const bulkStatusBlogCategoriesSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1, "Select at least one category"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type CreateBlogCategoryInput = z.infer<typeof createBlogCategorySchema>;
export type UpdateBlogCategoryInput = z.infer<typeof updateBlogCategorySchema>;
