import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { currentSpotlightCategoryId } from "@/crons/categoryCron";
import { env } from "@/config/env";
import { attachAuditNames } from "@/lib/audit";

const activeFilter = { status: "ACTIVE" as const, deletedAt: null };

const publicCompanySelect = {
  id: true,
  name: true,
  slug: true,
  logo: true,
  coverImage: true,
  shortDescription: true,
  foundedYear: true,
  headOffice: true,
  website: true,
  verified: true,
  featured: true,
  score: true,
  country: { select: { name: true, iso2: true, flag: true } },
  employeeRange: { select: { title: true } },
  hourlyRateRange: { select: { title: true } },
  techStacks: { select: { techStack: { select: { name: true, slug: true, icon: true } } } },
};

export const getHomeData = async () => {
  const [
    settings,
    homeSeo,
    generalSeo,
    featuredCategories,
    featuredCompanies,
    totals,
    spotlightCategoryRow,
  ] = await Promise.all([
    prisma.settings.upsert({ where: { id: 1 }, create: { id: 1 }, update: {} }),
    prisma.seoMeta.upsert({ where: { page: "HOME" }, create: { page: "HOME" }, update: {} }),
    prisma.seoMeta.upsert({ where: { page: "GENERAL" }, create: { page: "GENERAL" }, update: {} }),
    prisma.category.findMany({
      where: { ...activeFilter, featured: true, parentId: null },
      orderBy: { displayOrder: "asc" },
      take: 8,
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        icon: true,
        _count: { select: { companies: true } },
      },
    }),
    prisma.company.findMany({
      where: { ...activeFilter },
      orderBy: [{ score: "desc" }, { id: "desc" }],
      take: 8,
      select: publicCompanySelect,
    }),
    Promise.all([
      prisma.company.count({ where: activeFilter }),
      prisma.category.count({ where: activeFilter }),
      prisma.country.count({ where: activeFilter }),
      prisma.techStack.count({ where: activeFilter }),
    ]),
    prisma.category.findFirst({
      where: currentSpotlightCategoryId
        ? { id: currentSpotlightCategoryId, ...activeFilter }
        : { ...activeFilter, featured: true },
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        companies: {
          where: { company: activeFilter },
          orderBy: { displayOrder: "asc" },
          take: 6,
          select: { company: { select: publicCompanySelect } },
        },
      },
    }),
  ]);
 
  const [totalCompanies, totalCategories, totalCountries, totalTechStacks] = totals;
 
  const spotlightCategory = spotlightCategoryRow
    ? {
      id: spotlightCategoryRow.id,
      name: spotlightCategoryRow.name,
      slug: spotlightCategoryRow.slug,
      companies: spotlightCategoryRow.companies.map((c) => c.company),
    }
    : null;
 
  return {
    general: { siteName: settings.siteName, logo: settings.logo, socialLinks: settings.socialLinks },
    seo: homeSeo,
    generalSeo,
    stats: { totalCompanies, totalCategories, totalCountries, totalTechStacks },
    featuredCategories,
    featuredCompanies,
    spotlightCategory,
    updateIntervalHours: env.HOME_DATA_CRON_INTERVAL_HOURS,
  };
};

export const getPublicCategories = async () => {
  return prisma.category.findMany({
    where: { ...activeFilter, parentId: null },
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      icon: true,
      _count: { select: { companies: true } },
      children: {
        where: activeFilter,
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { companies: true } },
        },
      },
    },
  });
};

export const getPublicCategoryBySlug = async (slug: string) => {
  const category = await prisma.category.findFirst({
    where: { slug, ...activeFilter },
    select: {
      id: true,
      name: true,
      slug: true,
      heroDescription: true,
      description: true,
      image: true,
      icon: true,
      metaTitle: true,
      metaDescription: true,
      canonicalUrl: true,
      ogTitle: true,
      ogDescription: true,
      ogImage: true,
      robots: true,
      parent: { select: { id: true, name: true, slug: true } },
      children: {
        where: activeFilter,
        orderBy: { displayOrder: "asc" },
        select: { id: true, name: true, slug: true },
      },
      faqs: {
        orderBy: { sortOrder: "asc" },
        select: { question: true, answer: true },
      },
      companies: {
        where: { company: activeFilter },
        orderBy: { company: { score: "desc" } },
        select: { company: { select: publicCompanySelect } },
      },
    },
  });
 
  if (!category) throw new NotFoundError("Category not found");
 
  const stats = await getCategoryStatsBySlug(slug);
 
  return { ...category, companies: category.companies.map((c) => c.company), stats, updateIntervalHours: env.HOME_DATA_CRON_INTERVAL_HOURS };
};
 
export const getAllCategorySlugs = async () => {
  return prisma.category.findMany({
    where: activeFilter,
    select: { slug: true },
  });
};

export const getCompaniesByCategorySlug = async (slug: string) => {
  const category = await prisma.category.findFirst({
    where: { slug, ...activeFilter },
    select: { id: true, name: true, slug: true },
  });

  if (!category) throw new NotFoundError("Category not found");

  const companies = await prisma.company.findMany({
    where: {
      status: "ACTIVE",
      deletedAt: null,
      categories: { some: { categoryId: category.id } },
    },
    include: {
      detail: true,
      country: true,
      employeeRange: true,
      hourlyRateRange: true,
      techStacks: { include: { techStack: true } },
    },
  });

  return {
    category,
    companies,
  };
};

export const getSpotlightCompanies = async () => {
  // Try to find the category picked by cron, otherwise fallback to the first featured category
  const category = await prisma.category.findFirst({
    where: currentSpotlightCategoryId
      ? { id: currentSpotlightCategoryId, ...activeFilter }
      : { ...activeFilter, featured: true },
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true, slug: true },
  });

  if (!category) throw new NotFoundError("No spotlight category found");

  const companies = await prisma.company.findMany({
    where: {
      status: "ACTIVE",
      deletedAt: null,
      categories: { some: { categoryId: category.id } },
    },
    orderBy: [{ score: "desc" }, { id: "desc" }],
    take: 5,
    include: {
      detail: true,
      country: true,
      employeeRange: true,
      hourlyRateRange: true,
      techStacks: { include: { techStack: true } },
    },
  });

  return {
    category,
    companies,
    updateIntervalHours: env.CATEGORY_CRON_INTERVAL_HOURS,
  };
};

export const getPublicAbout = async () => {
  const [general, home, about] = await Promise.all([
    prisma.settings.upsert({ where: { id: 1 }, create: { id: 1 }, update: {} }),
    prisma.seoMeta.upsert({ where: { page: "HOME" }, create: { page: "HOME" }, update: {} }),
    prisma.seoMeta.upsert({ where: { page: "ABOUT" }, create: { page: "ABOUT" }, update: {} }),
  ]);

  return { general: await attachAuditNames(general), seo: { home, about } };
};

export const getCategoryStatsBySlug = async (slug: string) => {
  const category = await prisma.category.findFirst({
    where: { slug, ...activeFilter },
    select: { id: true }
  });
 
  if (!category) throw new NotFoundError("Category not found");
 
  const companies = await prisma.company.findMany({
    where: {
      categories: { some: { categoryId: category.id } },
      ...activeFilter
    },
    select: { score: true, countryId: true }
  });
 
  let topScore = 0;
  const uniqueCountries = new Set<number>();
 
  for (const c of companies) {
    if (c.score && c.score > topScore) topScore = c.score;
    if (c.countryId) uniqueCountries.add(c.countryId);
  }
 
  return {
    companiesRanked: companies.length,
    countriesCovered: uniqueCountries.size,
    lastUpdated: env.CATEGORY_CRON_INTERVAL_HOURS || 2,
    topScore
  };
};
