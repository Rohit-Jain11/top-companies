import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getHomeData } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomeData().catch(() => null);
  const globalRobots = home?.generalSeo?.robots ?? "index, follow";

  return {
    metadataBase: new URL(SITE_URL),
    title: "Top Companies",
    description: "Discover and compare top-rated software companies, agencies and developers.",
    robots: globalRobots,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const home = await getHomeData().catch(() => null);
  const siteName = home?.general.siteName ?? "Top Companies";
  const logo = home?.general.logo ?? null;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: SITE_URL,
    ...(logo ? { logo } : {}),
    ...(home?.general.socialLinks
      ? { sameAs: Object.values(home.general.socialLinks).filter((url): url is string => !!url) }
      : {}),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: SITE_URL,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {logo && <link rel="icon" href={logo} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <div className="flex min-h-dvh flex-col">
            <Header siteName={siteName} logo={logo} />
            <main className="flex-1">{children}</main>
            <Footer siteName={siteName} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
