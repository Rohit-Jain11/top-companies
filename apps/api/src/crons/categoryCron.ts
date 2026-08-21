import cron from "node-cron";
import { prisma } from "@/lib/prisma";
import { env } from "@/config/env";

// In-memory variable to store the current spotlight category
export let currentSpotlightCategoryId: number | null = null;

export const initCrons = () => {
  // Use the interval specified in the environment file (e.g., every 2 hours)
  const cronSchedule = `0 */${env.CATEGORY_CRON_INTERVAL_HOURS} * * *`;

  cron.schedule(cronSchedule, async () => {
    try {
      console.log("[Cron] Running random category picker...");

      // Get all active categories
      const categories = await prisma.category.findMany({
        where: { status: "ACTIVE", deletedAt: null },
        select: { id: true, name: true, slug: true },
      });

      if (!categories.length) {
        console.log("[Cron] No active categories found.");
        return;
      }

      // Pick a random category
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];

      // Save it in memory so the API can use it
      currentSpotlightCategoryId = randomCategory.id;

      console.log(`[Cron] Picked category: ${randomCategory.name} (${randomCategory.slug})`);

      // Fetch companies with details for this category
      const companies = await prisma.company.findMany({
        where: {
          status: "ACTIVE",
          deletedAt: null,
          categories: {
            some: {
              categoryId: randomCategory.id
            }
          }
        },
        include: {
          detail: true,
          country: true,
        }
      });

      console.log(`[Cron] Found ${companies.length} companies in category ${randomCategory.name}.`);
      companies.forEach((company) => {
        console.log(`- Company: ${company.name}, Website: ${company.website}, Tagline: ${company.detail?.tagline || "N/A"}`);
      });
    } catch (error) {
      console.error("[Cron] Error running category cron:", error);
    }
  });

  console.log("Cron jobs initialized.");
};
