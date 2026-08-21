import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublicCategories } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import CategoryTabs from "@/components/CategoryTabs";

export async function generateMetadata(): Promise<Metadata> {
  const categories = await getPublicCategories();
  const totalCompanies = categories.reduce((sum, c) => sum + c._count.companies, 0);

  return buildMetadata({
    seo: { metaTitle: null, metaDescription: null, canonicalUrl: null, ogTitle: null, ogDescription: null, ogImage: null, robots: null },
    path: "/categories",
    fallbackTitle: `All ${categories.length} Categories`,
    fallbackDescription: `Browse ${totalCompanies} reviewed software companies across ${categories.length} categories, ranked by delivery track record.`,
    siteName: "Top Companies",
  });
}

export default async function CategoriesPage() {
  const categories = await getPublicCategories();
  const totalCompanies = categories.reduce((sum, c) => sum + c._count.companies, 0);

  return (
    <>
      <section className='px-5 pt-10 xl:pt-24 pb-10 xl:pb-12.5 relative z-1 after:absolute after:top-[-70%] after:left-0 after:w-full after:h-full after:bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(217,43,66,1)_100%)] after:z-[-1] after:opacity-[0.2]'>
        <div className="container-8xl">
          <div className="max-w-180 mx-auto">
            <div className='flex flex-wrap items-center justify-center gap-1.5'>
              <Link href="/" className='text-sm leading-6 text-secondary block uppercase'>home</Link>
              <span className='text-sm leading-6 text-secondary block'>/</span>
              <span className='text-sm leading-6 text-foreground block uppercase font-medium'>cATEGORIES</span>
            </div>
            <h1 className='font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal my-2 xl:my-7.5 text-center'><span className="text-primary font-light italic">310+ categories.</span> One honest list.</h1>
            <p className="text-center text-lg leading-7 text-secondary mb-5 xl:mb-10">Every industry, every technology, every service. Each category is a live, AI-ranked leaderboard of the best companies, updated continuously.</p>
            <form>
              <div className='relative max-w-107 mx-auto'>
                <input type='search' placeholder='Search' className='border border-border rounded-[34px] text-lg leading-7 text-secondary font-normal w-full py-3 pl-5 pr-18 outline-none bg-white shadow-card' />
                <button type='submit' className='w-13.5 h-13.5 flex items-center justify-center absolute top-0 right-1'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M12.5653 21.35C10.8278 21.35 9.12928 20.8348 7.68459 19.8695C6.23991 18.9042 5.11391 17.5321 4.449 15.9269C3.78408 14.3216 3.61011 12.5553 3.94908 10.8511C4.28805 9.14701 5.12474 7.58167 6.35334 6.35307C7.58195 5.12447 9.14729 4.28778 10.8514 3.9488C12.5555 3.60983 14.3219 3.78381 15.9272 4.44872C17.5324 5.11364 18.9044 6.23963 19.8697 7.68432C20.835 9.129 21.3503 10.8275 21.3503 12.565C21.3503 13.7187 21.123 14.861 20.6816 15.9269C20.2401 16.9927 19.593 17.9612 18.7772 18.7769C17.9614 19.5927 16.993 20.2398 15.9272 20.6813C14.8613 21.1228 13.7189 21.35 12.5653 21.35ZM12.5653 5.54167C11.1808 5.54167 9.82743 5.95221 8.67629 6.72138C7.52514 7.49055 6.62793 8.5838 6.09812 9.86288C5.56831 11.142 5.42968 12.5494 5.69978 13.9073C5.96988 15.2652 6.63656 16.5124 7.61553 17.4914C8.5945 18.4704 9.84178 19.1371 11.1996 19.4072C12.5575 19.6773 13.965 19.5386 15.2441 19.0088C16.5231 18.479 17.6164 17.5818 18.3856 16.4307C19.1547 15.2795 19.5653 13.9261 19.5653 12.5417C19.5653 10.6852 18.8278 8.90468 17.515 7.59192C16.2023 6.27917 14.4218 5.54167 12.5653 5.54167Z" fill="#555555"/>
                    <path d="M23.3336 24.2083C23.2187 24.2089 23.1047 24.1865 22.9986 24.1424C22.8924 24.0983 22.7961 24.0335 22.7153 23.9517L17.8969 19.1333C17.7424 18.9675 17.6582 18.7481 17.6622 18.5214C17.6662 18.2947 17.7581 18.0784 17.9184 17.9181C18.0787 17.7578 18.295 17.666 18.5217 17.662C18.7484 17.658 18.9677 17.7421 19.1336 17.8967L23.952 22.715C24.1158 22.8791 24.2078 23.1015 24.2078 23.3333C24.2078 23.5652 24.1158 23.7876 23.952 23.9517C23.8712 24.0335 23.7749 24.0983 23.6687 24.1424C23.5625 24.1865 23.4486 24.2089 23.3336 24.2083Z" fill="#555555"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="px-5 pb-10 xl:pb-20 md:pt-5 xl:pt-15 relative z-[1]">
        <div className="container-8xl">
          <CategoryTabs categories={categories} />
        </div>
        <div className="absolute left-[-14%] categories_shape xl:left-0 bottom-[20%] z-[-1] hidden lg:block">
          <Image src={'../category-shape.svg'} alt="" width={189} height={255} />
        </div>
      </section>
    </>
  );
}
