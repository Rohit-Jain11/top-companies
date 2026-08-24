import { z } from "zod";

export const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().max(255).optional().nullable(),
  content: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  publishedAt: z.union([z.string(), z.date()]).optional().nullable(),
  blogCategoryId: z.string().optional().nullable(), // Form selects usually return strings

  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  ogTitle: z.string().max(255).optional().nullable(),
  ogDescription: z.string().max(500).optional().nullable(),
  ogImage: z.string().optional().nullable(),
  robots: z.string().max(100).optional().nullable(),
});

export type BlogFormInput = z.input<typeof blogFormSchema>;
export type BlogFormValues = z.output<typeof blogFormSchema>;
