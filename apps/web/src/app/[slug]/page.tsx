import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompanyRankCard } from "@/components/company-rank-card";
import { FaqAccordion } from "@/components/faq-accordion";
import { getPublicCategoryBySlug } from "@/lib/api";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getPublicCategoryBySlug(slug);
  if (!category) return {};

  return buildMetadata({
    seo: category,
    path: `/${category.slug}`,
    fallbackTitle: `${category.name} - Top Companies`,
    fallbackDescription:
      category.heroDescription ?? `Compare the top-reviewed ${category.name.toLowerCase()} companies, ranked 0-10.`,
    fallbackImage: category.image,
    siteName: "Top Companies",
  });
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getPublicCategoryBySlug(slug);

  console.log("category", category);

  if (!category) notFound();

  const breadcrumbItems = [
    { name: "Home", url: absoluteUrl("/") },
    { name: "Categories", url: absoluteUrl("/categories") },
    ...(category.parent ? [{ name: category.parent.name, url: absoluteUrl(`/${category.parent.slug}`) }] : []),
    { name: category.name, url: absoluteUrl(`/${category.slug}`) },
  ];

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Top ${category.name} Companies`,
    itemListElement: category.companies.map((company, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: company.name,
      url: company.website ?? undefined,
    })),
  };

  const faqJsonLd = category.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: category.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
    {faqJsonLd && (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    )}

    <section className='px-5 py-10 xl:py-25 relative z-1 after:absolute after:top-[-70%] after:left-0 after:w-full after:h-full after:bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(217,43,66,1)_100%)] after:z-[-1] after:opacity-[0.2]'>
      <div className="container-8xl">
        <div className="max-w-180 mx-auto">
          <div className='flex flex-wrap items-center justify-center gap-1.5'>
            <Link href="/" className='text-sm leading-6 text-secondary block uppercase'>home</Link>
            <span className='text-sm leading-6 text-secondary block'>/</span>
            <Link href="/categories" className="text-sm leading-6 text-secondary block uppercase">Categories</Link>
            {category.parent && (
              <>
                <span className='text-sm leading-6 text-secondary block'>/</span>
                <Link href={`/${category.parent.slug}`} className="text-sm leading-6 text-secondary block uppercase">
                  {category.parent.name}
                </Link>
              </>
            )}
            <span className='text-sm leading-6 text-secondary block'>/</span>
            <span className='text-sm leading-6 text-foreground block uppercase font-medium'>{category.name}</span>
          </div>
          <h1 className='font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal my-2 xl:my-7.5 text-center'>Top <span className="text-primary font-light italic">{category.name}</span> Companies</h1>
          {category.heroDescription &&
            <p className="text-center text-lg leading-7 text-secondary">{category.heroDescription}</p>
          }
        </div>
      </div>
    </section>

    <section className="py-10 xl:py-12.5 px-5 border-t border-b border-border">
      <div className="container-8xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-7.5 xl:px-7">
          <div className="rounded-2xl py-3.5 px-4 xl:px-7 flex items-center gap-x-5 gap-y-2 bg-white shadow-card flex-col sm:flex-row text-center sm:text-left">
            <span className="font-fraunces text-[28px] xl:text-[42px] leading-9 xl:leading-16.25 tracking-[-1.26px] text-primary shrink-0">{category.stats.companiesRanked}</span>
            <p className="text-lg leading-7 text-secondary">Companies <br />Ranked</p>
          </div>
          <div className="rounded-2xl py-3.5 px-4 xl:px-7 flex items-center gap-x-5 gap-y-2 bg-white shadow-card flex-col sm:flex-row text-center sm:text-left">
            <span className="font-fraunces text-[28px] xl:text-[42px] leading-9 xl:leading-16.25 tracking-[-1.26px] text-primary shrink-0">{category.stats.countriesCovered}</span>
            <p className="text-lg leading-7 text-secondary">Countries <br />Covered</p>
          </div>
          <div className="rounded-2xl py-3.5 px-4 xl:px-7 flex items-center gap-x-5 gap-y-2 bg-white shadow-card flex-col sm:flex-row text-center sm:text-left">
            <span className="font-fraunces text-[28px] xl:text-[42px] leading-9 xl:leading-16.25 tracking-[-1.26px] text-primary shrink-0 inline-flex gap-1.5 items-baseline">{category.stats.lastUpdated}h <span className="text-[30px] leading-8">ago</span></span>
            <p className="text-lg leading-7 text-secondary">Last <br />Updated</p>
          </div>
          <div className="rounded-2xl py-3.5 px-4 xl:px-7 flex items-center gap-x-5 gap-y-2 bg-white shadow-card flex-col sm:flex-row text-center sm:text-left">
            <span className="font-fraunces text-[28px] xl:text-[42px] leading-9 xl:leading-16.25 tracking-[-1.26px] text-primary shrink-0">{category.stats.topScore}</span>
            <p className="text-lg leading-7 text-secondary">Top <br />Score</p>
          </div>
        </div>
      </div>
    </section>

    <section className="pb-10 xl:pb-25 pt-10 xl:pt-12.5 bg-white overflow-hidden z-[1] relative px-5">
      <div className="container-8xl">
        <div className="mb-4 xl:mb-6.5 flex flex-wrap gap-2 items-center justify-between">
          <h3 className="font-fraunces text-foreground text-[22px] xl:text-[28px] leading-7 xl:leading-11 tracking-[-0.56px] font-normal">The 2026 leaderboard</h3>
          <span className="inline-block bg-[#E7F5EC] text-[#178A4C] text-sm leading-5 font-normal rounded-full px-2.5 py-1">Updated {category.updateIntervalHours} hrs ago</span>
        </div>
        <div>
          {category.companies.length === 0 ? (
            <p className="text-secondary text-center text-base leading-7">No companies are listed in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-6">
              {category.companies.map((company, index) => (
                <CompanyRankCard key={company.id} company={company} rank={index + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="absolute right-[-22%] sm:right-[-15%] lg::right-[-10%] xl:right-0 bottom-[30%] z-[-1]">
        <Image src={'../category-detail-shape.svg'} alt="" width={199} height={243} />
      </div>
    </section>

    <section className="px-5 pt-0 pb-10 lg:py-10 xl:py-25">
      <div className="container-8xl">
        <div className="flex flex-wrap items-center lg:gap-15">
          <div className="lg:basis-[63%] lg:max-w-[63%] lg:shrink-0">
            <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mb-8 xl:mb-15">Editorial <span className="text-primary font-light italic">summary</span></h2>
            <div className="whitespace-pre-wrap">
              <p>
                The top 3 web development companies in 2026 are Innofied, RV Technologies, Algoworks. Together they represent the leading edge of web development delivery,  with combined portfolios spanning hundreds of clients across India, the  United States, and Europe. <br/><br/>

                The web development market in 2026 is increasingly bifurcated  between large enterprise-focused firms with 1,000+ employees and  specialized boutique studios with deeper craft and faster turnarounds.  Top Companies tracks both, so buyers can compare a India-based leader  against a US-based competitor on equal footing.<br/><br/>

                For procurement teams shortlisting web development partners,  the most reliable signals are verified client outcomes, recency of  shipped work, and consistency of reviews across multiple independent  platforms. The Top Companies score weights these three signals more  heavily than raw review counts or paid awards.
              </p>
            </div>
          </div>
          <div className="lg:basis-[calc(37%-60px)] lg:max-w-[calc(37%-60px)] lg:shrink-0 text-center -order-1 lg:order-1">
            <Image src={'/editorial-summary.webp'} alt="Editorial summary" width={501} height={486} />
          </div>
        </div>
      </div>
    </section>

    <section className="px-5 pb-10 xl:pb-25 pt-10 xl:pt-12.5">
      <div className="container-8xl">
        <div className="mb-8 xl:mb-15">
          <span className="text-secondary text-sm leading-6 uppercase flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.23549 0L7.99825 4.47124L12.4695 6.23549L7.99825 7.99825L6.23549 12.4695L4.47124 7.99825L0 6.23549L4.47124 4.47124L6.23549 0Z" fill="#111827"></path></svg>
            FAQ
          </span>
          <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mt-2 xl:mt-4">Before you <span className="text-primary font-light italic inline-block">ask</span></h2>
        </div>
        <div className="flex flex-wrap">
          <div className="lg:max-w-106.75 lg:basis-106.75 lg:shrink-0 bg-background-gray rounded-[25px] py-5 xl:py-12.5 pl-5 xl:pl-8 pr-5 xl:pr-7.5 relative z-[1] overflow-hidden">
            <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mb-4">Your work <span className="text-primary font-light italic inline-block">speaks.</span> Let it get <span className="text-primary font-light italic inline-block">ranked.</span></h2>
            <p className="text-lg leading-7 text-secondary mb-8">Submit your company and our crawler takes it from there — reviews, portfolio, reputation, all scored automatically.</p>
            <Link href={'#'} className="rounded-full bg-foreground px-6.5 py-3 text-lg leading-7 font-semibold text-white hover:bg-primary transition-all ease-in-out duration-250 inline-block">Submit your project</Link>
            <div className="absolute right-0 bottom-0 z-[-1]">
              <Image src={'../cate-deatil-faq.svg'} alt="" width={270} height={167} />
            </div>
          </div>
          <div className="max-w-full w-full lg:max-w-[calc(100%-427px)] lg:basis-[calc(100%-427px)] lg:shrink-0 lg:pl-15 mt-6 lg:mt-0">
            <FaqAccordion faqs={category.faqs} />
          </div>
        </div>
      </div>
    </section>

    <section className="px-5 py-10 xl:py-25 bg-background-gray">
      <div className="container-8xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-8 xl:mb-15">
          <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal shrink-0">Related <span className="text-primary font-light italic inline-block">categories</span></h2>
          <Link href={'/categories'} className="flex items-center justify-center gap-2 rounded-full bg-transparent px-6.5 py-2.75 text-lg leading-7 font-semibold text-foreground hover:text-white hover:bg-primary transition-all ease-in-out duration-250 border border-border hover:border-primary w-full sm:w-auto shrink-0">See all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
          {category.children?.length > 0 ? (
            category.children.map((child) => (
              <Link
                key={child.id}
                href={`/${child.slug}`}
                className="relative flex min-h-41.25 flex-col flex-wrap justify-end rounded-[10px] border border-white bg-[#E8E6DD]/10 p-5 text-lg font-semibold leading-7 text-foreground shadow-[inset_6px_0px_8px_rgba(0,0,0,0.02)] before:absolute before:left-5 before:top-5 before:h-0.5 before:w-6 before:rounded-[3px] before:bg-primary before:opacity-0 before:content-[''] hover:shadow-[inset_6px_0px_8px_rgba(0,0,0,0.02),0_40px_88px_rgb(31_42_60/0.1)] hover:before:opacity-100"
              >
                {child.name}
                <span className="mt-2.5 block text-sm font-normal leading-5 text-secondary">
                  245 ranked · Development
                </span>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-secondary capitalize">
              No related categories available for {category.name}
            </p>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
