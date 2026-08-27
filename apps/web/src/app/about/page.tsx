import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getPublicAbout } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getPublicAbout();
  return buildMetadata({
    seo: about.seo,
    path: "/about",
    fallbackTitle: "About - Top Companies",
    fallbackDescription: "How Top Companies reviews, scores and ranks software companies.",
    siteName: "Top Companies",
  });
}

const PRINCIPLES = [
  {
    label: "P/01",
    title: "Earned, not bought",
    body: "A company's position in a category reflects its review, not its ad spend. There is no paid placement.",
  },
  {
    label: "P/02",
    title: "Reviewed by people",
    body: "Every listing is checked by our team - portfolio, delivery history, client feedback - before it earns a score.",
  },
  {
    label: "P/03",
    title: "Always current",
    body: "Companies are re-reviewed over time, so a ranking reflects how a company is doing now, not just when it joined.",
  },
  {
    label: "P/04",
    title: "Built for both sides",
    body: "Useful whether you're comparing companies to hire, or you run one and want to be found.",
  },
];

export default async function AboutPage() {
  const about = await getPublicAbout();
  const { general } = about;
  const hasContactInfo = general.contactEmail || general.phone || general.address;

  return (
    <>
      <section className='px-5 pt-10 xl:pt-24 pb-10 xl:pb-12.5 relative z-1 after:absolute after:top-[-70%] after:left-0 after:w-full after:h-full after:bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(217,43,66,1)_100%)] after:z-[-1] after:opacity-[0.2]'>
        <div className="container-8xl">
          <div className="max-w-180 mx-auto">
            <div className='flex flex-wrap items-center justify-center gap-1.5'>
              <Link href="/" className='text-sm leading-6 text-secondary block uppercase'>home</Link>
              <span className='text-sm leading-6 text-secondary block'>/</span>
              <span className='text-sm leading-6 text-foreground block uppercase font-medium'>About</span>
            </div>
            <h1 className='font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal my-2 xl:my-7.5 text-center'>A directory built to be trusted, <span className="text-primary font-light italic">not sold</span></h1>
            <p className="text-center text-lg leading-7 text-secondary">Top Companies exists to make finding a good software company as easy as reading a well-organized list - curated by hand, scored consistently, and never for sale.</p>
          </div>
        </div>
      </section>

      <section className="px-5 pt-10 xl:pt-12.5 pb-10 xl:pb-12.5 relative z-1 overflow-hidden">
        <div className="container-8xl">
          <div className="max-w-227.5 mx-auto text-center">
            <span className="text-secondary text-sm leading-6 uppercase flex items-center gap-1 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.23549 0L7.99825 4.47124L12.4695 6.23549L7.99825 7.99825L6.23549 12.4695L4.47124 7.99825L0 6.23549L4.47124 4.47124L6.23549 0Z" fill="#111827"></path>
              </svg>
              Our story
            </span>
            <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mt-2 xl:mt-4 mb-4 xl:mb-10">
              The <span className="text-primary font-light italic inline-block">journey</span> that shaped us
            </h2>
            {about.aboutContent ? (
              <div className="text-secondary text-lg leading-7 prose-content" dangerouslySetInnerHTML={{ __html: about.aboutContent }} />
            ) : (
              <p className="text-secondary text-lg leading-7">More information coming soon.</p>
            )}
          </div>
        </div>
      </section>
      
      <section className="px-5 pt-10 xl:pt-12.5 pb-10 xl:pb-25 relative z-[1] overflow-hidden">
        <div className="container-8xl">
          <span className="text-secondary text-sm leading-6 uppercase flex items-center gap-1 justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.23549 0L7.99825 4.47124L12.4695 6.23549L7.99825 7.99825L6.23549 12.4695L4.47124 7.99825L0 6.23549L4.47124 4.47124L6.23549 0Z" fill="#111827"/>
            </svg>
            What we believe
          </span>
          <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 max-w-175 mx-auto tracking-[-1.62px] font-normal mt-2 xl:mt-4 mb-8 xl:mb-15 text-center">
            The rules we hold <span className="text-primary font-light italic inline-block">ourselves</span> to
          </h2>
          <div className="glass2 rounded-[20px] pt-5 pb-5 xl:pb-9 px-5 xl:px-7.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-6">
              {PRINCIPLES.map((principle) => (
                <div key={principle.label} className="rounded-[20px] py-4 xl:py-5 px-5 xl:px-7.5 innerGlass2">
                  <p className="block text-[20px] xl:text-2xl leading-8 xl:leading-9.5 font-medium font-fraunces text-primary mb-2.5">{principle.label}</p>
                  <h3 className="text-base leading-5.5 font-semibold text-foreground mb-1">{principle.title}</h3>
                  <p className="text-sm leading-5 text-secondary">{principle.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute right-[-15%] xl:right-0 top-[27%] z-[-1]">
          <Image src={'/rank-shape.svg'} alt="" width={278} height={557} />
        </div>
      </section>

      <section className="py-10 xl:py-25 bg-background-gray px-5">
        <div className="container-8xl">
          <div className="max-w-227.5 mx-auto text-center">
            <span className="text-secondary text-sm leading-6 uppercase flex items-center gap-1 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.23549 0L7.99825 4.47124L12.4695 6.23549L7.99825 7.99825L6.23549 12.4695L4.47124 7.99825L0 6.23549L4.47124 4.47124L6.23549 0Z" fill="#111827"></path>
              </svg>
              How it works
            </span>
            <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mt-2 xl:mt-4 mb-4 xl:mb-10">
              Scoring, in <span className="text-primary font-light italic inline-block">plain terms</span>
            </h2>
            <p className="text-secondary text-lg leading-7">
              Every company is scored from 0 to 10 across three things: technical expertise, delivery track record, and value for money. Companies are grouped into categories - some with subcategories - so you can compare like with like instead of scrolling through everything at once.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 xl:py-25 px-5">
        <div className="container-8xl">
          <div className="max-w-227.5 mx-auto text-center">
            <span className="text-secondary text-sm leading-6 uppercase flex items-center gap-1 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.23549 0L7.99825 4.47124L12.4695 6.23549L7.99825 7.99825L6.23549 12.4695L4.47124 7.99825L0 6.23549L4.47124 4.47124L6.23549 0Z" fill="#111827"></path>
              </svg>
              Who it&apos;s for
            </span>
            <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mt-2 xl:mt-4 mb-4 xl:mb-10">
              Two <span className="text-primary font-light italic inline-block">audiences,</span> one <span className="text-primary font-light italic inline-block">directory</span> 
            </h2>
            <p className="text-secondary text-lg leading-7 mb-4">
              <span className="font-medium text-foreground">If you&apos;re hiring:</span> browse a category, compare
              scores and details side by side, and go straight to a company&apos;s own site when you&apos;re ready to
              reach out.
            </p>
            <p className="text-secondary text-lg leading-7">
              <span className="font-medium text-foreground">If you run a company:</span> get in touch using the details
              below to be considered for a category that fits your work.
            </p>
          </div>
        </div>
      </section>

      {hasContactInfo && (
        <section className="bg-background-gray relative z-[1] py-10 xl:py-25 overflow-hidden px-5">
          <div className="container-8xl">
            <div className="text-center">
              <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mb-4 xl:mb-8">Get in <span className="text-primary font-light italic inline-block">touch</span></h2>
              <p className="text-secondary text-lg leading-7 mb-4 xl:mb-6 max-w-175 mx-auto">Have a question, want to suggest a company, or interested in having your business considered for our directory? We’d love to hear from you.</p>
              <div className="flex items-center flex-wrap justify-center gap-3 text-secondary">
                {general.contactEmail && (
                  <Link href={`mailto:${general.contactEmail}`} className="text-secondary hover:text-foreground flex items-center gap-1">
                    <Mail className="size-4 shrink-0" />
                    {general.contactEmail}
                  </Link>
                )}
                |
                {general.phone && (
                  <Link href={`tel:${general.phone}`} className="text-secondary hover:text-foreground flex items-center gap-1">
                    <Phone className="size-4 shrink-0" /> {general.phone}
                  </Link>
                )}
                |
                {general.address && (
                  <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(general.address)}`} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-foreground flex items-center gap-1">
                    <MapPin className="size-4 shrink-0" /> {general.address}
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="absolute left-0 top-0 z-[-1]">
            <Image src={'/rank-shape-bottom.svg'} alt="" width={528} height={528} />
          </div>
        </section>
      )}
    </>
  );
}
