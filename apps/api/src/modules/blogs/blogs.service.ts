import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { generateUniqueSlug, slugifyText } from "@/lib/slug";
import { buildMeta, parsePagination } from "@/lib/pagination";
import { attachAuditNames } from "@/lib/audit";
import { CreateBlogInput, UpdateBlogInput } from "@/modules/blogs/blogs.validation";

const SORTABLE_FIELDS = ["title", "createdAt", "updatedAt", "publishedAt"] as const;

const slugExists = (excludeId?: number) => async (slug: string) => {
  const existing = await prisma.blog.findFirst({ where: { slug, deletedAt: null } });
  return Boolean(existing && existing.id !== excludeId);
};

export const listBlogs = async (query: Record<string, unknown>) => {
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

  if (query.blogCategoryId) {
    where.blogCategoryId = Number(query.blogCategoryId);
  }

  if (query.search && String(query.search).trim()) {
    where.title = { contains: String(query.search).trim() };
  }

  const [data, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: { blogCategory: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.blog.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
};

export const getBlogById = async (id: number) => {
  const blog = await prisma.blog.findFirst({ 
    where: { id },
    include: { blogCategory: { select: { id: true, name: true, slug: true } } }
  });
  if (!blog) throw new NotFoundError("Blog not found");
  return attachAuditNames(blog);
};

export const getBlogsWithLatestByCategory = async (categoryId: number, query: Record<string, unknown>) => {
  const categoryExists = await prisma.blogCategory.findUnique({
    where: { id: categoryId },
  });
  if (!categoryExists) {
    throw new NotFoundError("Blog Category not found");
  }

  const { page, limit, skip, take } = parsePagination(query);
  const sortBy = SORTABLE_FIELDS.includes(query.sortBy as (typeof SORTABLE_FIELDS)[number])
    ? (query.sortBy as string)
    : "createdAt";
  const sortOrder = String(query.sortOrder ?? "desc").toLowerCase() === "asc" ? "asc" : "desc";
  
  const where: any = {
    blogCategoryId: categoryId,
    deletedAt: null,
    status: "ACTIVE"
  };

  if (query.search && String(query.search).trim()) {
    where.title = { contains: String(query.search).trim() };
  }

  const [data, total, latestBlogsRaw] = await Promise.all([
    prisma.blog.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: { blogCategory: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.blog.count({ where }),
    prisma.blog.findMany({
      where: {
        blogCategoryId: categoryId,
        deletedAt: null,
        status: "ACTIVE"
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    })
  ]);

  const latestBlogs = latestBlogsRaw.map(({ deletedAt, ...rest }) => rest);

  return {
    blogs: { data, meta: buildMeta(page, limit, total) },
    latestBlogs
  };
};

export const createBlog = async (input: CreateBlogInput, adminId: number) => {
  const slug = await generateUniqueSlug(input.slug || input.title, slugExists());

  const blog = await prisma.blog.create({
    data: { ...input, slug, createdById: adminId, updatedById: adminId },
  });

  return getBlogById(blog.id);
};

export const updateBlog = async (id: number, input: UpdateBlogInput, adminId: number) => {
  const existing = await prisma.blog.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new NotFoundError("Blog not found");

  let slug: string | undefined;
  if (input.slug) {
    slug = await generateUniqueSlug(slugifyText(input.slug), slugExists(id));
  } else if (input.title && input.title !== existing.title) {
    slug = await generateUniqueSlug(slugifyText(input.title), slugExists(id));
  }

  await prisma.blog.update({
    where: { id },
    data: { ...input, ...(slug ? { slug } : {}), updatedById: adminId },
  });

  return getBlogById(id);
};

export const deleteBlog = async (id: number, adminId: number) => {
  const existing = await prisma.blog.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new NotFoundError("Blog not found");

  await prisma.blog.update({ where: { id }, data: { deletedAt: new Date(), deletedById: adminId } });
};

export const restoreBlog = async (id: number, adminId: number) => {
  const existing = await prisma.blog.findFirst({ where: { id, deletedAt: { not: null } } });
  if (!existing) throw new NotFoundError("Deleted blog not found");
  await prisma.blog.update({
    where: { id },
    data: { deletedAt: null, deletedById: null, updatedById: adminId },
  });
};

export const permanentlyDeleteBlog = async (id: number) => {
  const existing = await prisma.blog.findFirst({ where: { id, deletedAt: { not: null } } });
  if (!existing) throw new NotFoundError("Deleted blog not found");

  await prisma.blog.delete({ where: { id } });
};

export const bulkDeleteBlogs = async (ids: number[], adminId: number) => {
  await prisma.blog.updateMany({
    where: { id: { in: ids }, deletedAt: null },
    data: { deletedAt: new Date(), deletedById: adminId },
  });
};

export const bulkRestoreBlogs = async (ids: number[], adminId: number) => {
  await prisma.blog.updateMany({
    where: { id: { in: ids }, deletedAt: { not: null } },
    data: { deletedAt: null, deletedById: null, updatedById: adminId },
  });
};

export const bulkPermanentlyDeleteBlogs = async (ids: number[]) => {
  await prisma.blog.deleteMany({ where: { id: { in: ids }, deletedAt: { not: null } } });
};

export const bulkUpdateBlogStatus = async (ids: number[], status: "ACTIVE" | "INACTIVE", adminId: number) => {
  await prisma.blog.updateMany({
    where: { id: { in: ids }, deletedAt: null },
    data: { status, updatedById: adminId },
  });
};
