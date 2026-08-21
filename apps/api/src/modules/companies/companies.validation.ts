import { z } from "zod";
import { optionalUrl } from "@/lib/validation";

const currentYear = new Date().getFullYear();

export const createCompanySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().max(220).optional(),
  website: optionalUrl("Website must be a valid URL"),
  logo: z.string().max(500).optional().nullable(),
  coverImage: z.string().max(500).optional().nullable(),
  shortDescription: z.string().max(500).optional().nullable(),
  description: z.string().optional().nullable(),
  foundedYear: z.coerce.number().int().min(1800).max(currentYear).optional().nullable(),
  headOffice: z.string().max(255).optional().nullable(),
  countryId: z.coerce.number().int().positive().optional().nullable(),
  employeeRangeId: z.coerce.number().int().positive().optional().nullable(),
  hourlyRateRangeId: z.coerce.number().int().positive().optional().nullable(),
  techStackIds: z.array(z.coerce.number().int().positive()).optional().default([]),
  verified: z.coerce.boolean().optional().default(false),
  featured: z.coerce.boolean().optional().default(false),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE"),
  score: z.coerce.number().min(0).max(10).optional().nullable(),
  detail: z.object({
    tagline: z.string().max(255).optional().nullable(),
    salesEmail: z.string().email().optional().nullable(),
    contactPhone: z.string().max(50).optional().nullable(),
    minProjectSize: z.string().max(100).optional().nullable(),
    reviews: z.string().optional().nullable(), // Or z.coerce.number() if it's stored as numeric? Wait, let's check schema.prisma
    agencyStatus: z.string().max(100).optional().nullable(),
    utmSourceEnable: z.coerce.boolean().optional().default(false),
  }).optional().nullable(),
});

export const updateCompanySchema = createCompanySchema.partial();

export const bulkDeleteCompaniesSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1, "Select at least one company"),
});

export const bulkStatusCompaniesSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1, "Select at least one company"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;

export const importCompaniesSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().default(50),
});

export type ImportCompaniesInput = z.infer<typeof importCompaniesSchema>;
