import Link from "next/link";

export function Footer({ siteName }: { siteName: string; }) {

  return (
    <footer className="border-t border-border bg-foreground pt-10 xl:pt-15 px-5">
      <div className="container-8xl">
        <div className="flex flex-wrap justify-between items-center mb-6 xl:mb-10">
          <div className="md:basis-[320px] md:shrink-0 md:max-w-[320px]">
            <h2 className="text-2xl leading-9.5 tracking-[-0.48px] font-normal text-white mb-2 md:mb-3 font-fraunces">Top Development Companies</h2>
            <p className="text-sm leading-5.75 text-white">The AI-powered intelligence platform ranking the world&apos;s best agencies, studios, and service providers across 500+ categories.</p>
          </div>
          <div className="basis-80 lg:basis-107.5 md:shrink-0 max-w-80 lg:max-w-107.5 mt-5 md:mt-0">
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <Link href="/" className="text-[13px] leading-5.25 text-white font-normal inline-block hover:text-primary transition-all ease-in-out duration-200">
                Home
              </Link>
              <Link href="/about" className="text-[13px] leading-5.25 text-white font-normal inline-block hover:text-primary transition-all ease-in-out duration-200">
                About
              </Link>
              <Link href="/categories" className="text-[13px] leading-5.25 text-white font-normal inline-block hover:text-primary transition-all ease-in-out duration-200">
                Category
              </Link>
              <Link href="/blog" className="text-[13px] leading-5.25 text-white font-normal inline-block hover:text-primary transition-all ease-in-out duration-200">
                Blogs
              </Link>
              <Link href="#" className="text-[13px] leading-5.25 text-white font-normal inline-block hover:text-primary transition-all ease-in-out duration-200">
                Companies
              </Link>
            </nav>
          </div>
        </div>
        <div className="border-t border-t-secondary pt-6 pb-7.5 flex flex-wrap flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-border text-xs leading-4 font-normal text-center md:text-left">&copy; {new Date().getFullYear()} {siteName}. Ranked by data, not deals.</p>
          <div className="flex flex-wrap items-center text-border gap-1">
            <Link href="/privacy-policy" title="Privacy" className="text-border text-xs leading-4 font-normal hover:text-primary transition-all ease-in-out duration-200">Privacy</Link>
            <span className="inline-block leading-4">·</span>
            <Link href="/terms-and-conditions" title="Terms" className="text-border text-xs leading-4 font-normal hover:text-primary transition-all ease-in-out duration-200">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
