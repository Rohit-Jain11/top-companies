import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, Gauge, RefreshCw, ScanSearch, ShieldCheck, Sparkles, Users } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { CompanyRankCard } from "@/components/company-rank-card";
import { StatsBar } from "@/components/stats-bar";
import { getHomeData, getTopCompaniesData, getPublicAbout } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import { FaqAccordion } from "@/components/faq-accordion";
import HowWeRank from "@/components/howWeRank";

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomeData();

  return buildMetadata({
    seo: home.seo,
    path: "/",
    fallbackTitle: home.general.siteName ?? "Top Companies",
    fallbackDescription:
      "A hand-reviewed directory of software companies, ranked by real delivery track record - not by who pays the most.",
    fallbackImage: home.general.logo,
    siteName: home.general.siteName ?? "Top Companies",
  });
}

const blogs = [
  {
    id: 1,
    image: "/blog1.webp",
    category: "Trending this week",
    title: "How to Choose a Development Agency Without Getting Burned",
    readTime: "6 min read",
    date: "Jul 2026",
  },
  {
    id: 2,
    image: "/blog2.webp",
    category: "Comparison",
    title: "Top 10 Game Development Studios in India, Ranked",
    readTime: "8 min read",
    date: "Jul 2026",
  },
  {
    id: 3,
    image: "/blog3.webp",
    category: "Industry Trend",
    title: "Why AI-Driven Rankings Are Replacing Pay-to-Rank Directories",
    readTime: "5 min read",
    date: "Jul 2026",
  },
];

export default async function HomePage() {
  const home = await getHomeData();
  const faqs = await getPublicAbout();
  const homeCompany = await getTopCompaniesData();
  const spotlight = home.spotlightCategory;

  const home_faqs = faqs?.general?.homeFaqs;

  const getScoreLabel = (score: number | null) => {
    if (score === null) return "";

    if (score >= 9) return "Excellent";
    if (score >= 7.5) return "Proven";
    if (score >= 6) return "Strong";

    return "High";
  };

  const INITIAL_BG_COLORS = ["#F5B840", "#ED6A3A", "#3AA37A", "#D4A017", "#7C5CFF", "#E58B6B", "#72C7C0", "#B39DDB",];
  

  return (
    <>
      {/* Hero Section */}
      <section className="relative z-1 overflow-hidden after:absolute after:top-[-70%] after:left-0 after:w-full after:h-full after:bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(217,43,66,1)_100%)] after:z-[-1] after:opacity-[0.2] py-10 xl:py-25 px-5">
        <div className="container-8xl">
          <div className="text-center">
            <span className="text-secondary text-sm leading-6 uppercase flex items-center gap-1 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.23549 0L7.99825 4.47124L12.4695 6.23549L7.99825 7.99825L6.23549 12.4695L4.47124 7.99825L0 6.23549L4.47124 4.47124L6.23549 0Z" fill="#111827"/>
              </svg>
              TOP COMPANIES
            </span>
            <h1 className="font-fraunces text-foreground text-[40px] xl:text-[88px] leading-12 xl:leading-23.75 max-w-232.5 mx-auto tracking-[-2px] font-normal mt-3 xl:mt-6">
              <span className="text-primary font-light italic inline-block">Stop guessing.</span> Start with who's actually good.
            </h1>
            <p className="mx-auto my-4 xl:my-7.5 max-w-175.75 text-lg text-secondary">
              {home.seo.metaDescription ??
                "We don't sell rankings. Our crawler pulls reviews, portfolios, and reputation signals from across the web and scores 310+ categories on facts — not who paid for placement."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/categories"
              className="flex items-center justify-center gap-2 rounded-full bg-foreground px-6.5 py-3 text-lg font-semibold text-white hover:bg-primary transition-all ease-in-out duration-250 w-full sm:w-auto"
            >
              Explore categories <ArrowRight className="size-5" />
            </Link>
            {spotlight && (
              <Link
                href={`/categories/${spotlight.slug}`}
                className="flex items-center justify-center gap-2 rounded-full bg-white px-6.5 py-2.75 text-lg font-semibold text-foreground hover:text-white hover:bg-primary transition-all ease-in-out duration-250 border border-border hover:border-primary w-full sm:w-auto"
              >
                Watch live rankings
              </Link>
            )}
          </div>
          <div className="rounded-[25px] max-w-304 mx-auto mt-8 xl:mt-20 p-5 xl:p-5.5 glass">
            <div className="flex flex-wrap gap-2 items-center justify-between border-b border-b-border pb-3.5 mb-4.5">
              <span className="text-sm leading-5 text-secondary uppercase inline-block">/ TOP {homeCompany?.category?.name}</span>
              <span className="text-sm leading-5 text-[#178A4C] bg-[#E7F5EC] rounded-[100px] inline-block py-1 pr-2.5 pl-5.5 relative before:content-[''] before:absolute before:left-2.5 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#178A4C]">Live index · Updated every {homeCompany?.updateIntervalHours} hrs</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {homeCompany?.companies?.map((company, index) => {
                const rank = String(index + 1).padStart(2, "0");

                const initials = company.name
                  .replace(/-/g, " ")
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase();

                const status = getScoreLabel(company.score);
                const initialsBg = INITIAL_BG_COLORS[index % INITIAL_BG_COLORS.length];

                return (
                  <div key={company.id} className="rounded-[10px] p-5 innerGlass">
                    <span className="block text-base leading-6.25 font-medium font-fraunces text-secondary">{rank}</span>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-foreground text-sm leading-5.5 font-bold my-3" style={{ backgroundColor:  initialsBg}}>{initials}</div>
                    <h5 className="text-foreground text-sm leading-5 font-semibold">{company.name}</h5>
                    <p className="text-xs leading-4 text-secondary flex items-center gap-1 flex-wrap">{company?.country?.name} <span className="block -translate-y-0.5">.</span> {company.employeeRange?.title}</p>
                    <span className="font-fraunces inline-block text-base leading-6.5 text-primary mt-2.5 italic font-normal">{status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="absolute left-0 bottom-0 z-[-1]">
          <Image src={'../hero-shape1.svg'} alt="" width={150} height={317} />
        </div>
        <div className="absolute right-[-50%] sm:right-[-20%] xl:right-0 top-[25%] z-[-1]">
          <Image src={'../hero-shape2.svg'} alt="" width={296} height={403} />
        </div>
      </section>

      {/* About Section */}
      <section className="pt-10 xl:pt-12.5 pb-10 xl:pb-25 px-5">
        <div className="container-8xl">
          <h2 className="max-w-272.5 mx-auto text-foreground text-[22px] xl:text-[28px] leading-7.5 xl:leading-11 tracking-[-1.62px] text-center mb-8 xl:mb-15 font-fraunces font-normal">NipsApp Game Studios is the world's leading game development studio, with an unmatched portfolio of award-winning titles across mobile, PC, console, VR, and the metaverse. Trusted by global publishers and indie founders, the Trivandrum-based team combines AAA-grade production with breakthrough creative direction. This is the reason NipsApp consistently ranks #1 across every gaming category we track.</h2>
          <div className="">
            <StatsBar stats={home.stats} />
          </div>
        </div>
      </section>

      {/* How We Rank leaderboard */}
      {spotlight && spotlight.companies.length > 0 && (
        <section className="pt-10 xl:pt-12.5 pb-10 xl:pb-25 relative z-1 overflow-hidden px-5">
          <div className="container-8xl">
            <span className="text-secondary text-sm leading-6 uppercase flex items-center gap-1 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.23549 0L7.99825 4.47124L12.4695 6.23549L7.99825 7.99825L6.23549 12.4695L4.47124 7.99825L0 6.23549L4.47124 4.47124L6.23549 0Z" fill="#111827"/>
              </svg>
              How we rank
            </span>
            <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 max-w-175 mx-auto tracking-[-1.62px] font-normal mt-2 xl:mt-4 mb-8 xl:mb-15 text-center">
              The categories seeing the <span className="text-primary font-light italic inline-block">biggest shifts,</span> based on our last <span className="text-primary font-light italic inline-block">crawl cycle.</span>
            </h2>
            <div className="glass2 rounded-[20px] pt-5 pb-5 xl:pb-9 px-5 xl:px-7.5">
              <div className="mb-4 xl:mb-6.5 flex flex-wrap gap-2 items-center justify-between">
                <h3 className="font-fraunces text-foreground text-[22px] xl:text-[28px] leading-7 xl:leading-11 tracking-[-0.56px] font-normal">The 2026 leaderboard</h3>
                <span className="inline-block bg-[#E7F5EC] text-[#178A4C] text-sm leading-5 font-normal rounded-full px-2.5 py-1">13 Signals · Updated 6 hrs ago</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-6">
                {spotlight.companies.map((company, index) => (
                  <CompanyRankCard key={company.id} company={company} rank={index + 1} />
                ))}
              </div>
            </div>
            <div className="mt-8 xl:mt-15 flex justify-center">
              <Link
                href={`/categories/${spotlight.slug}`}
                className="flex items-center gap-2 rounded-full bg-foreground px-6.5 py-3 text-lg font-semibold text-white hover:bg-primary transition-all ease-in-out duration-250"
              >
                View full ranking <ArrowRight className="size-5" />
              </Link>
             </div>
          </div>
          <div className="absolute right-0 top-[27%] z-[-1]">
            <Image src={'../rank-shape.svg'} alt="" width={278} height={557} />
          </div>
        </section>
      )}

      {/* Categories Lists */}
      {home.featuredCategories.length > 0 && (
        <section className="pt-10 xl:pt-12.5 pb-10 xl:pb-25 px-5">
          <div className="container-8xl">
            <div className="mb-8 xl:mb-15 flex flex-wrap items-end justify-between gap-5">
              <div className="">
                <span className="text-secondary text-sm leading-6 uppercase flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M6.23549 0L7.99825 4.47124L12.4695 6.23549L7.99825 7.99825L6.23549 12.4695L4.47124 7.99825L0 6.23549L4.47124 4.47124L6.23549 0Z" fill="#111827"/>
                  </svg>
                  Browse the directory
                </span>
                <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mt-2 xl:mt-4">
                  <span className="text-primary font-light italic inline-block">310+ categories.</span> One honest list.
                </h2>
              </div>
              <Link href="/categories" className="text-lg leading-7 font-semibold text-foreground rounded-full px-6.5 py-2.75 inline-block hover:text-white hover:bg-primary transition-all ease-in-out duration-250 border border-border hover:border-primary min-w-3xs text-center w-full sm:w-auto sm:min-w-auto">
                See all
              </Link>
            </div>
            <div className="border border-border rounded-2xl overflow-hidden flex flex-wrap">
              {home.featuredCategories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} total={home.featuredCategories.length} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How We Rank */}
      <section className="py-10 xl:py-25 bg-background-gray px-5">
        <div className="container-8xl">
          <div className="mb-6 xl:mb-15">
            <span className="text-secondary text-sm leading-6 uppercase flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.23549 0L7.99825 4.47124L12.4695 6.23549L7.99825 7.99825L6.23549 12.4695L4.47124 7.99825L0 6.23549L4.47124 4.47124L6.23549 0Z" fill="#111827"/>
              </svg>
              How we rank
            </span>
            <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mt-2 xl:mt-4">
              No sponsored spots. No
              <span className="text-primary font-light italic sm:block"> pay-to-rank.</span>
            </h2>
          </div>
          <HowWeRank />
        </div>
      </section>

      {/* Worth Reading/Blog Section */}
      <section className="py-10 xl:py-25 relative z-[1] px-5 bg-white">
        <div className="container-8xl">
          <div className="mb-8 xl:mb-15 flex flex-wrap items-end justify-between gap-5">
            <div className="md:basis-[54%] max-w-full w-full md:max-w-[54%]">
              <span className="text-secondary text-sm leading-6 uppercase flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.23549 0L7.99825 4.47124L12.4695 6.23549L7.99825 7.99825L6.23549 12.4695L4.47124 7.99825L0 6.23549L4.47124 4.47124L6.23549 0Z" fill="#111827"/>
                </svg>
                Worth reading
              </span>
              <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mt-2 xl:mt-4">
                Comparisons, <span className="text-primary font-light italic">hiring playbooks,</span> and what's <span className="text-primary font-light italic">moving in the industry.</span>
              </h2>
            </div>
            <Link
              href="/blog"
              className="flex items-center gap-2.5 rounded-full bg-foreground px-6.5 py-3 text-lg font-semibold text-white hover:bg-primary transition-all ease-in-out duration-250"
            >
              Read more articles <ArrowRight className="size-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white border border-border rounded-2xl p-4 xl:p-7 hover:shadow-card transition-all ease-in-out duration-300">
                <div className="h-63.25 overflow-hidden rounded-2xl">
                  <Image src={blog.image} alt={blog.title} width={500} height={500} className="w-full h-full object-cover" />
                </div>
                <div className="mt-4.5">
                  <span className="uppercase text-secondary text-xs leading-4.75 tracking-[1.2px] block">{blog.category}</span>
                  <h3 className="my-2 text-lg leading-7 font-bold text-foreground">{blog.title}</h3>
                  <p className="text-secondary text-sm leading-5.25">{blog.readTime} · {blog.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute right-0 bottom-9 z-[-1]">
          <Image src={'../blog-shape.svg'} alt="" width={140} height={159} />
        </div>
      </section>

      {/* Faqs */}
      <section className="pt-10 xl:pt-12.5 pb-10 xl:pb-25 px-5">
        <div className="container-8xl">
          <div className="flex flex-wrap">
            <div className="lg:max-w-90 lg:basis-90 lg:shrink-0">
              <span className="text-secondary text-sm leading-6 uppercase flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.23549 0L7.99825 4.47124L12.4695 6.23549L7.99825 7.99825L6.23549 12.4695L4.47124 7.99825L0 6.23549L4.47124 4.47124L6.23549 0Z" fill="#111827"></path></svg>
                FAQ
              </span>
              <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mt-2 xl:mt-4">Before you <span className="text-primary font-light italic inline-block">ask</span></h2>
            </div>
            <div className="max-w-full w-full lg:max-w-[calc(100%-360px)] lg:basis-[calc(100%-360px)] lg:shrink-0 lg:pl-15 mt-6 lg:mt-0">
              <FaqAccordion faqs={home_faqs} />
            </div>
          </div>
        </div>
      </section>

      {/* Your Work Speaks */}
      <section className="bg-background-gray relative z-[1] py-10 xl:py-22.5 overflow-hidden px-5">
        <div className="container-8xl">
          <div className="max-w-175 mx-auto text-center">
            <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mb-4">Your work <span className="text-primary font-light italic inline-block">speaks.</span> Let it <span className="block">get <span className="text-primary font-light italic inline-block">ranked.</span></span></h2>
            <p className="text-secondary text-lg leading-7 mb-6 xl:mb-8">Submit your company and our crawler takes it from there — reviews, portfolio, reputation, all scored automatically.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <Link
                href="#"
                className="flex items-center justify-center gap-2 rounded-full bg-foreground px-6.5 py-3 text-lg font-semibold text-white hover:bg-primary transition-all ease-in-out duration-250 w-full sm:w-auto"
              >
                Submit your project
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center gap-2 rounded-full bg-transparent px-6.5 py-2.75 text-lg leading-7 font-semibold text-foreground hover:text-white hover:bg-primary transition-all ease-in-out duration-250 border border-border hover:border-primary w-full sm:w-auto "
              >
                Get listed
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 z-[-1]">
          <Image src={'../rank-shape-bottom.svg'} alt="" width={528} height={528} />
        </div>
        <div className="absolute right-[-5%] top-[23%] z-[-1]">
          <Image src={'../rank-shape-bottom.svg'} alt="" width={528} height={528} />
        </div>
      </section>
    </>
  );
}
