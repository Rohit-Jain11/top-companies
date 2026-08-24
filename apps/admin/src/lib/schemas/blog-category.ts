import { z } from "zod";

export const blogCategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().max(220).optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),

  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  ogTitle: z.string().max(255).optional().nullable(),
  ogDescription: z.string().max(500).optional().nullable(),
  ogImage: z.string().optional().nullable(),
  robots: z.string().max(100).optional().nullable(),
});

export type BlogCategoryFormInput = z.input<typeof blogCategoryFormSchema>;
export type BlogCategoryFormValues = z.output<typeof blogCategoryFormSchema>;
