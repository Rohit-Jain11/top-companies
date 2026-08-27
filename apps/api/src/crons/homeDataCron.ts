import cron from "node-cron";
import { env } from "@/config/env";
import { getHomeData, getAllCategorySlugs, getPublicCategoryBySlug } from "@/modules/public/public.service";
 
export let cachedHomeData: any = null;
export const cachedCategoryDetails = new Map<string, any>();
 
const refreshCategoryCache = async () => {
  try {
    const categories = await getAllCategorySlugs();
    for (const cat of categories) {
      const details = await getPublicCategoryBySlug(cat.slug);
      cachedCategoryDetails.set(cat.slug, details);
    }
    console.log(`[Cron] Cached ${categories.length} category pages.`);
  } catch (error) {
    console.error("[Cron] Error updating category cache:", error);
  }
};
 
export const initHomeDataCron = async () => {
  const cronSchedule = `0 */${env.HOME_DATA_CRON_INTERVAL_HOURS} * * *`;
 
  // Initial fetch on server start
  try {
    console.log("[Cron] Initializing home data cache...");
    cachedHomeData = await getHomeData();
    await refreshCategoryCache();
    console.log("[Cron] Home and Category data cache initialized successfully.");
  } catch (error) {
    console.error("[Cron] Error initializing home data cache:", error);
  }
 
  cron.schedule(cronSchedule, async () => {
    try {
      console.log("[Cron] Running home data update...");
      cachedHomeData = await getHomeData();
      await refreshCategoryCache();
      console.log("[Cron] Home and Category data updated successfully.");
    } catch (error) {
      console.error("[Cron] Error updating home data cron:", error);
    }
  });
 
  console.log("Home Data Cron job initialized.");
};