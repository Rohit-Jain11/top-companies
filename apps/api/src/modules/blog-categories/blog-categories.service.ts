import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { generateUniqueSlug, slugifyText } from "@/lib/slug";
import { buildMeta, parsePagination } from "@/lib/pagination";
import { attachAuditNames } from "@/lib/audit";
import { CreateBlogCategoryInput, UpdateBlogCategoryInput } from "@/modules/blog-categories/blog-categories.validation";

const SORTABLE_FIELDS = ["name", "createdAt", "updatedAt"] as const;

const slugExists = (excludeId?: number) => async (slug: string) => {
  const existing = await prisma.blogCategory.findFirst({ where: { slug, deletedAt: null } });
  return Boolean(existing && existing.id !== excludeId);
};

export const listBlogCategories = async (query: Record<string, unknown>) => {
  const { page, limit, skip, take } = parsePagination(query);
  const sortBy = SORTABLE_FIELDS.includes(query.sortBy as (typeof SORTABLE_FIELDS)[number])
    ? (query.sortBy as string)
    : "createdAt";
  const sortOrder = String(query.sortOrder ?? "desc").toLowerCase() === "asc" ? "asc" : "desc";

  const where: Record<string, unknown> = {};

  if (query.status === "DELETED") {
    where.deletedAt = { not: null };
  } else {
    where.deletedAt = null;
    if (query.status === "ACTIVE" || query.status === "INACTIVE") where.status = query.status;
  }

  if (query.search && String(query.search).trim()) {
    where.name = { contains: String(query.search).trim() };
  }

  const [data, total] = await Promise.all([
    prisma.blogCategory.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: { _count: { select: { blogs: true } } },
    }),
    prisma.blogCategory.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
};

export const getBlogCategoryById = async (id: number) => {
  const category = await prisma.blogCategory.findFirst({ where: { id } });
  if (!category) throw new NotFoundError("Blog Category not found");
  return attachAuditNames(category);
};

export const createBlogCategory = async (input: CreateBlogCategoryInput, adminId: number) => {
  const slug = await generateUniqueSlug(input.slug || input.name, slugExists());

  const category = await prisma.blogCategory.create({
    data: { ...input, slug, createdById: adminId, updatedById: adminId },
  });

  return getBlogCategoryById(category.id);
};

export const updateBlogCategory = async (id: number, input: UpdateBlogCategoryInput, adminId: number) => {
  const existing = await prisma.blogCategory.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new NotFoundError("Blog Category not found");

  let slug: string | undefined;
  if (input.slug) {
    slug = await generateUniqueSlug(slugifyText(input.slug), slugExists(id));
  } else if (input.name && input.name !== existing.name) {
    slug = await generateUniqueSlug(slugifyText(input.name), slugExists(id));
  }

  await prisma.blogCategory.update({
    where: { id },
    data: { ...input, ...(slug ? { slug } : {}), updatedById: adminId },
  });

  return getBlogCategoryById(id);
};

export const deleteBlogCategory = async (id: number, adminId: number) => {
  const existing = await prisma.blogCategory.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new NotFoundError("Blog Category not found");

  const blogCount = await prisma.blog.count({ where: { blogCategoryId: id, deletedAt: null } });
  if (blogCount > 0) {
    throw new ValidationError("Cannot delete a category that has blogs. Reassign or delete them first.");
  }

  await prisma.blogCategory.update({ where: { id }, data: { deletedAt: new Date(), deletedById: adminId } });
};

export const restoreBlogCategory = async (id: number, adminId: number) => {
  const existing = await prisma.blogCategory.findFirst({ where: { id, deletedAt: { not: null } } });
  if (!existing) throw new NotFoundError("Deleted blog category not found");
  await prisma.blogCategory.update({
    where: { id },
    data: { deletedAt: null, deletedById: null, updatedById: adminId },
  });
};

export const permanentlyDeleteBlogCategory = async (id: number) => {
  const existing = await prisma.blogCategory.findFirst({ where: { id, deletedAt: { not: null } } });
  if (!existing) throw new NotFoundError("Deleted blog category not found");

  const blogCount = await prisma.blog.count({ where: { blogCategoryId: id } });
  if (blogCount > 0) {
    throw new ValidationError(
      "Cannot permanently delete a category that still has blogs. Permanently delete or reassign them first."
    );
  }

  await prisma.blogCategory.delete({ where: { id } });
};

export const bulkDeleteBlogCategories = async (ids: number[], adminId: number) => {
  await prisma.blogCategory.updateMany({
    where: { id: { in: ids }, deletedAt: null },
    data: { deletedAt: new Date(), deletedById: adminId },
  });
};

export const bulkRestoreBlogCategories = async (ids: number[], adminId: number) => {
  await prisma.blogCategory.updateMany({
    where: { id: { in: ids }, deletedAt: { not: null } },
    data: { deletedAt: null, deletedById: null, updatedById: adminId },
  });
};

export const bulkPermanentlyDeleteBlogCategories = async (ids: number[]) => {
  const withBlogs = await prisma.blog.findMany({
    where: { blogCategoryId: { in: ids } },
    select: { blogCategoryId: true },
    distinct: ["blogCategoryId"],
  });
  const blockedIds = new Set(withBlogs.map((b) => b.blogCategoryId));
  const deletableIds = ids.filter((id) => !blockedIds.has(id));

  if (deletableIds.length) {
    await prisma.blogCategory.deleteMany({ where: { id: { in: deletableIds }, deletedAt: { not: null } } });
  }
};

export const bulkUpdateBlogCategoryStatus = async (ids: number[], status: "ACTIVE" | "INACTIVE", adminId: number) => {
  await prisma.blogCategory.updateMany({
    where: { id: { in: ids }, deletedAt: null },
    data: { status, updatedById: adminId },
  });
};
