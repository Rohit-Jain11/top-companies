import { AboutData, HomeData, PublicCategoryDetail, PublicCategorySummary, HomeTopCompaniesData, BlogCategory, AllBlogData, BlogDetailData } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";


// Public pages are SEO-facing but backed by admin-edited data, not
// request-time state - ISR (revalidate every 60s) is the right fit rather
// than fully static or fully dynamic rendering.
const REVALIDATE_SECONDS = 60;

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

async function fetchPublicApi<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Public API request failed: ${path} (${res.status})`);

  const json: ApiEnvelope<T> = await res.json();
  return json.data;
}

export const getHomeData = async (): Promise<HomeData> => {
  const data = await fetchPublicApi<HomeData>("/public/home");
  if (!data) throw new Error("Failed to load home data");
  return data;
};

export const getTopCompaniesData = async (): Promise<HomeTopCompaniesData> => {
  const data = await fetchPublicApi<HomeTopCompaniesData>("/public/spotlight-companies");
  if (!data) throw new Error("Failed to load top companies data");
  return data;
};

export const getPublicCategories = async (): Promise<PublicCategorySummary[]> => {
  const data = await fetchPublicApi<PublicCategorySummary[]>("/public/categories");
  return data ?? [];
};

export const getPublicCategoryBySlug = async (slug: string): Promise<PublicCategoryDetail | null> =>
  fetchPublicApi<PublicCategoryDetail>(`/public/categories/${encodeURIComponent(slug)}`);

export const getPublicAbout = async (): Promise<AboutData> => {
  const data = await fetchPublicApi<AboutData>("/public/about");
  if (!data) throw new Error("Failed to load about data");
  return data;
};

export const getBlogCategory = async (): Promise<BlogCategory[]> => {
  const data = await fetchPublicApi<BlogCategory[]>("/public/blog-categories");
  if (!data) throw new Error("Failed to load blog categories");
  return data;
};

export const getBlogData = async (page = 1, limit = 2, categorySlug?: string | null): Promise<AllBlogData> => {
  const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
  });
  if (categorySlug) {
      params.append("category", categorySlug);
  }
  const data = await fetchPublicApi<AllBlogData>(`/public/blogs?${params.toString()}`);
  if (!data) {
      throw new Error("Failed to load blogs");
  }
  return data;
};

export const getBlogCategoryData = async (categorySlug: string, page = 1, limit = 2): Promise<AllBlogData> => {
  const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
  });
  const data = await fetchPublicApi<AllBlogData>(`/public/blogs/category/${categorySlug}?${params.toString()}`);
  if (!data) {
      throw new Error("Failed to load category blogs");
  }
  return data;
};

export const getBlogBySlug = async (slug: string): Promise<BlogDetailData> => {
  const data = await fetchPublicApi<BlogDetailData>(`/public/blogs/${encodeURIComponent(slug)}`);
  if (!data) {
    throw new Error("Failed to load blog");
  }
  return data;
};
