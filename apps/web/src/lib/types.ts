export interface SeoBlock {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  robots: string | null;
}

export interface SocialLinks {
  facebook?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  youtube?: string | null;
}

export interface PublicCompany {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  coverImage: string | null;
  shortDescription: string | null;
  foundedYear: number | null;
  headOffice: string | null;
  website: string | null;
  verified: boolean;
  featured: boolean;
  score: number | null;
  country: { name: string; iso2: string; flag: string | null } | null;
  employeeRange: { title: string } | null;
  hourlyRateRange: { title: string } | null;
  techStacks: { techStack: { name: string; slug: string; icon: string | null } }[];
}

export interface PublicCategorySummary {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  icon: string | null;
  _count: { companies: number };
  // Only populated by /public/categories - /public/home's featured list
  // omits it since the home page doesn't show subcategory chips.
  children?: { id: number; name: string; slug: string; _count: { companies: number } }[];
}

export interface PublicCategoryDetail {
  id: number;
  name: string;
  slug: string;
  heroDescription: string | null;
  description: string | null;
  image: string | null;
  icon: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  robots: string | null;
  parent: { id: number; name: string; slug: string } | null;
  children: { id: number; name: string; slug: string }[];
  faqs: { question: string; answer: string }[];
  companies: PublicCompany[];
}

export interface HomeStats {
  totalCompanies: number;
  totalCategories: number;
  totalCountries: number;
  totalTechStacks: number;
}

export interface SpotlightCategory {
  id: number;
  name: string;
  slug: string;
  companies: PublicCompany[];
}

export interface HomeTopCompaniesCategory {
  id: number;
  name: string;
  slug: string;
}
export interface HomeTopCompaniesData {
  category: HomeTopCompaniesCategory;
  companies: PublicCompany[];
  updateIntervalHours: number;
}

export interface HomeData {
  general: { siteName: string | null; logo: string | null; socialLinks: SocialLinks | null };
  seo: SeoBlock;
  stats: HomeStats;
  featuredCategories: PublicCategorySummary[];
  featuredCompanies: PublicCompany[];
  spotlightCategory: SpotlightCategory | null;
}

export interface homeFaqData {
  question: string;
  answer: string;
  sortOrder: number | null;
}

export interface AboutData {
  general: {
    contactEmail: string | null;
    phone: string | null;
    address: string | null;
    socialLinks: SocialLinks | null;
    homeFaqs: homeFaqData[];
  };
  seo: SeoBlock;
  aboutContent: string | null;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}


export interface Blog {
  id: number;
  title: string;
  content: string | null;
  slug: string;
  image: string | null;
  status: string;
  publishedAt: string | null;
  blogCategoryId: number;
  createdAt: string;
  updatedAt: string;
  blogCategory?: BlogCategory;
}
export interface BlogMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface BlogListData {
  data: Blog[];
  meta: BlogMeta;
}
export interface LatestBlog {
  id: number;
  title: string;
  content: string | null;
  slug: string;
  image: string | null;
  status: string;
  publishedAt: string | null;
  blogCategoryId: number;
  createdAt: string;
  updatedAt: string;
}
export interface AllBlogData {
  blogs: BlogListData;
  latestBlogs: LatestBlog[];
}
