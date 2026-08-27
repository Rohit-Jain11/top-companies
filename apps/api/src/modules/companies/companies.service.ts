import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { generateUniqueSlug, slugifyText } from "@/lib/slug";
import { buildMeta, parsePagination } from "@/lib/pagination";
import { attachAuditNames } from "@/lib/audit";
import { CreateCompanyInput, UpdateCompanyInput } from "@/modules/companies/companies.validation";

const SORTABLE_FIELDS = ["name", "createdAt", "updatedAt", "foundedYear", "score"] as const;

const companyInclude = {
  country: { select: { id: true, name: true, iso2: true, flag: true } },
  employeeRange: { select: { id: true, title: true } },
  hourlyRateRange: { select: { id: true, title: true } },
  techStacks: { include: { techStack: { select: { id: true, name: true, slug: true, icon: true } } } },
  detail: true,
  services: { include: { service: true } },
  industries: { include: { industry: true } },
  locations: { include: { location: true } },
};

const slugExists = (excludeId?: number) => async (slug: string) => {
  const existing = await prisma.company.findFirst({ where: { slug, deletedAt: null } });
  return Boolean(existing && existing.id !== excludeId);
};

export const listCompanies = async (query: Record<string, unknown>) => {
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

  if (query.countryId) where.countryId = Number(query.countryId);
  if (query.employeeRangeId) where.employeeRangeId = Number(query.employeeRangeId);
  if (query.hourlyRateRangeId) where.hourlyRateRangeId = Number(query.hourlyRateRangeId);
  if (query.featured !== undefined) where.featured = query.featured === "true" || query.featured === true;
  if (query.verified !== undefined) where.verified = query.verified === "true" || query.verified === true;
  if (query.techStackId) {
    where.techStacks = { some: { techStackId: Number(query.techStackId) } };
  }

  if (query.search && String(query.search).trim()) {
    const search = String(query.search).trim();
    where.OR = [
      { name: { contains: search } },
      { shortDescription: { contains: search } },
      { headOffice: { contains: search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.company.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: companyInclude,
    }),
    prisma.company.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
};

export const getCompanyById = async (id: number) => {
  const company = await prisma.company.findFirst({
    where: { id },
    include: companyInclude,
  });
  if (!company) throw new NotFoundError("Company not found");
  return attachAuditNames(company);
};

export const createCompany = async (
  input: CreateCompanyInput,
  adminId: number,
) => {
  const {
    techStackIds,
    countryId,
    employeeRangeId,
    hourlyRateRangeId,
    detail,
    ...rest
  } = input;

  const slug = await generateUniqueSlug(
    input.slug || input.name,
    slugExists(),
  );

  const company = await prisma.$transaction(async (tx) => {
    const created = await tx.company.create({
      data: {
        ...rest,
        slug,

        country:
          countryId != null
            ? { connect: { id: countryId } }
            : undefined,

        employeeRange:
          employeeRangeId != null
            ? { connect: { id: employeeRangeId } }
            : undefined,

        hourlyRateRange:
          hourlyRateRangeId != null
            ? { connect: { id: hourlyRateRangeId } }
            : undefined,

        detail:
          detail != null
            ? { create: detail }
            : undefined,

        createdById: adminId,
        updatedById: adminId,

        techStacks: techStackIds?.length
          ? {
              create: techStackIds.map((techStackId) => ({
                techStackId,
              })),
            }
          : undefined,
      },
    });

    return created;
  });

  return getCompanyById(company.id);
};

export const updateCompany = async (id: number, input: UpdateCompanyInput, adminId: number) => {
  const existing = await prisma.company.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new NotFoundError("Company not found");

  const { techStackIds, detail, ...rest } = input;

  let slug: string | undefined;
  if (rest.slug) {
    slug = await generateUniqueSlug(slugifyText(rest.slug), slugExists(id));
  }

  await prisma.$transaction(async (tx) => {
    await tx.company.update({
      where: { id },
      data: { ...rest, ...(slug ? { slug } : {}), updatedById: adminId },
    });

    if (techStackIds !== undefined) {
      await tx.companyTechStack.deleteMany({ where: { companyId: id } });
      if (techStackIds.length) {
        await tx.companyTechStack.createMany({
          data: techStackIds.map((techStackId) => ({ companyId: id, techStackId })),
        });
      }
    }

    if (detail) {
      await tx.companyDetail.upsert({
        where: { companyId: id },
        update: detail,
        create: { ...detail, companyId: id },
      });
    }
  });

  return getCompanyById(id);
};

export const deleteCompany = async (id: number, adminId: number) => {
  const existing = await prisma.company.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new NotFoundError("Company not found");
  await prisma.company.update({ where: { id }, data: { deletedAt: new Date(), deletedById: adminId } });
};

export const restoreCompany = async (id: number, adminId: number) => {
  const existing = await prisma.company.findFirst({ where: { id, deletedAt: { not: null } } });
  if (!existing) throw new NotFoundError("Deleted company not found");
  await prisma.company.update({
    where: { id },
    data: { deletedAt: null, deletedById: null, updatedById: adminId },
  });
};

export const permanentlyDeleteCompany = async (id: number) => {
  const existing = await prisma.company.findFirst({ where: { id, deletedAt: { not: null } } });
  if (!existing) throw new NotFoundError("Deleted company not found");
  await prisma.company.delete({ where: { id } });
};

export const bulkDeleteCompanies = async (ids: number[], adminId: number) => {
  await prisma.company.updateMany({
    where: { id: { in: ids }, deletedAt: null },
    data: { deletedAt: new Date(), deletedById: adminId },
  });
};

export const bulkRestoreCompanies = async (ids: number[], adminId: number) => {
  await prisma.company.updateMany({
    where: { id: { in: ids }, deletedAt: { not: null } },
    data: { deletedAt: null, deletedById: null, updatedById: adminId },
  });
};

export const bulkPermanentlyDeleteCompanies = async (ids: number[]) => {
  await prisma.company.deleteMany({ where: { id: { in: ids }, deletedAt: { not: null } } });
};

export const bulkUpdateCompanyStatus = async (ids: number[], status: "ACTIVE" | "INACTIVE", adminId: number) => {
  await prisma.company.updateMany({
    where: { id: { in: ids }, deletedAt: null },
    data: { status, updatedById: adminId },
  });
};

export const addCompanyDetail = async (url: string, page: number, perPage: number = 50, adminId: number) => {
  let importedCount = 0;
  let skippedCount = 0;

  // 1. Fetch data from third-party API
  const fetchUrl = new URL(url);
  fetchUrl.searchParams.set("page", page.toString());
  fetchUrl.searchParams.set("per_page", perPage.toString());

  const response = await fetch(fetchUrl.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch from third party API: ${response.statusText}`);
  }

  const responseJson = (await response.json()) as any;
  const data = responseJson.data;

  if (!data || !Array.isArray(data)) {
    throw new Error("Invalid response from third-party API. Expected 'data' array.");
  }

  // Pre-fetch existing employee ranges from the database to map dynamically
  const existingRanges = await prisma.employeeRange.findMany();
  const parsedRanges = existingRanges
    .map((r) => {
      const nums = r.title.match(/\d+/g);
      let maxBound = nums ? Math.max(...nums.map(Number)) : 0;
      if (r.title.toLowerCase().includes('k')) maxBound *= 1000;
      return { title: r.title, maxBound };
    })
    .filter((r) => r.maxBound > 0)
    .sort((a, b) => a.maxBound - b.maxBound);

  const getMappedRangeTitle = (inputStr: string): string => {
    if (!inputStr) return "";
    const str = inputStr.toLowerCase().replace(/,/g, "").trim();
    const nums = str.match(/\d+/g);
    if (!nums || nums.length === 0) return inputStr;

    let maxVal = Math.max(...nums.map(Number));
    if (str.includes("k")) maxVal *= 1000;

    // Check against local database ranges
    for (const r of parsedRanges) {
      // If the incoming value is within this DB range's max bound, snap to it
      if (maxVal <= r.maxBound) {
        return r.title;
      }
    }

    // Fallbacks for extremely large numbers that exceed current local DB ranges
    if (maxVal < 5000) return "1k+";
    if (maxVal < 10000) return "5k+";
    return "10k+";
  };

  for (const item of data) {
    const slug = item.slug || slugifyText(item.title);

    // Skip if already exists
    const existingCompany = await prisma.company.findUnique({ where: { slug } });
    if (existingCompany) {
      skippedCount++;
      continue;
    }

    await prisma.$transaction(async (tx) => {
      // 1. Resolve Services
      const serviceIds: number[] = [];
      if (item.acf?.services?.length) {
        for (const s of item.acf.services) {
          const sSlug = s.slug || slugifyText(s.name);
          let srv = await tx.service.findUnique({ where: { slug: sSlug } });
          if (!srv) {
            srv = await tx.service.create({ data: { name: s.name, slug: sSlug } });
          }
          serviceIds.push(srv.id);
        }
      }

      // 2. Resolve Industries
      const industryIds: number[] = [];
      if (item.acf?.industry?.length) {
        for (const i of item.acf.industry) {
          const iSlug = i.slug || slugifyText(i.name);
          let ind = await tx.industry.findUnique({ where: { slug: iSlug } });
          if (!ind) {
            ind = await tx.industry.create({ data: { name: i.name, slug: iSlug } });
          }
          industryIds.push(ind.id);
        }
      }

      // 3. Resolve Locations
      const locationIds: number[] = [];
      if (item.acf?.location?.length) {
        for (const l of item.acf.location) {
          const lSlug = l.slug || slugifyText(l.name);
          let loc = await tx.location.findUnique({ where: { slug: lSlug } });
          if (!loc) {
            loc = await tx.location.create({ data: { name: l.name, slug: lSlug } });
          }
          locationIds.push(loc.id);
        }
      }

      // 4. Resolve Employee Range using smart dynamic mapping
      let employeeRangeId: number | null = null;
      if (item.acf?.total_employees) {
        const mappedRange = getMappedRangeTitle(item.acf.total_employees);
        let er = await tx.employeeRange.findFirst({ where: { title: mappedRange } });
        if (!er) {
          er = await tx.employeeRange.create({
            data: { title: mappedRange, createdById: adminId, updatedById: adminId },
          });
        }
        employeeRangeId = er.id;
      }

      // 5. Resolve Hourly Rate Range
      let hourlyRateRangeId: number | null = null;
      if (item.acf?.purse) {
        let hr = await tx.hourlyRateRange.findFirst({ where: { title: item.acf.purse } });
        if (!hr) {
          hr = await tx.hourlyRateRange.create({
            data: { title: item.acf.purse, createdById: adminId, updatedById: adminId },
          });
        }
        hourlyRateRangeId = hr.id;
      }

      // 5.5 Resolve Country ID
      let countryId: number | null = null;
      if (item.acf?.location?.length) {
        const firstLocName = item.acf.location[0].name;
        let country = await tx.country.findFirst({
          where: { name: firstLocName }
        });

        if (!country && firstLocName && firstLocName.length >= 2) {
          // Fallback to create the country if it doesn't exist
          let iso2 = firstLocName.substring(0, 2).toUpperCase();
          let existingIso = await tx.country.findUnique({ where: { iso2 } });
          
          if (existingIso) {
            iso2 = (firstLocName[0] + firstLocName[firstLocName.length - 1]).toUpperCase();
            existingIso = await tx.country.findUnique({ where: { iso2 } });
          }
          if (existingIso) {
            iso2 = (firstLocName[0] + firstLocName[Math.floor(firstLocName.length / 2)]).toUpperCase();
            existingIso = await tx.country.findUnique({ where: { iso2 } });
          }
          
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          while (existingIso) {
             iso2 = chars.charAt(Math.floor(Math.random() * 26)) + chars.charAt(Math.floor(Math.random() * 26));
             existingIso = await tx.country.findUnique({ where: { iso2 } });
          }
          
          country = await tx.country.create({
            data: { name: firstLocName, iso2, createdById: adminId, updatedById: adminId }
          });
        }

        if (country) {
          countryId = country.id;
        }
      }

      // 6. Create Company
      const companyData = {
        name: item.title,
        slug,
        status: (item.status === "publish" ? "ACTIVE" : "INACTIVE") as "ACTIVE" | "INACTIVE",
        description: item.content || null,
        shortDescription: item.excerpt?.substring(0, 500) || null,
        foundedYear: item.acf?.founding_year ? parseInt(item.acf.founding_year) : null,
        website: item.acf?.company_website || null,
        logo: typeof item.featured_image === "string" ? item.featured_image : (item.acf?.company_logo || null),
        headOffice: item.acf?.street || null,
        countryId,
        employeeRangeId,
        hourlyRateRangeId,
        createdById: adminId,
        updatedById: adminId,
      };

      const company = await tx.company.create({ data: companyData });
      importedCount++;

      // 7. Create Company Detail
      const detailData = {
        tagline: item.acf?.tagline || null,
        salesEmail: item.acf?.sales_email || null,
        contactPhone: item.acf?.admin_contact_phone || null,
        minProjectSize: item.acf?.rate || null,
        reviews: item.acf?.reviews || null,
        agencyStatus: item.acf?.agency_status || null,
        utmSourceEnable: item.acf?.utm_source_enable || false,
      };

      await tx.companyDetail.create({
        data: { ...detailData, companyId: company.id },
      });

      // 8. Link many-to-many
      if (serviceIds.length) {
        await tx.companyService.createMany({
          data: serviceIds.map((serviceId) => ({ companyId: company.id, serviceId })),
        });
      }
      if (industryIds.length) {
        await tx.companyIndustry.createMany({
          data: industryIds.map((industryId) => ({ companyId: company.id, industryId })),
        });
      }
      if (locationIds.length) {
        await tx.companyLocation.createMany({
          data: locationIds.map((locationId) => ({ companyId: company.id, locationId })),
        });
      }
    });
  }

  return {
    imported: importedCount,
    skipped: skippedCount,
    totalReceived: data.length,
    totalPages: responseJson.total_pages || 1,
    currentPage: responseJson.page || page
  };
};
