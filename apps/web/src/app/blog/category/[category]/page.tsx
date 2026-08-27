import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import BlogContent from '@/components/BlogContent';
import { getBlogCategory, getBlogCategoryData, } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface BlogCategoryPageProps {
    params: Promise<{
        category: string;
    }>;
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
    const { category } = await params;
    const categories = await getBlogCategory();
    const categoryData = categories.find(c => c.slug === category);

    if (!categoryData) {
        return {};
    }

    return buildMetadata({
        seo: {
            metaTitle: categoryData.metaTitle ?? null,
            metaDescription: categoryData.metaDescription ?? null,
            canonicalUrl: categoryData.canonicalUrl ?? null,
            ogTitle: categoryData.ogTitle ?? null,
            ogDescription: categoryData.ogDescription ?? null,
            ogImage: categoryData.ogImage ?? null,
            robots: categoryData.robots ?? null,
        },
        path: `/blog/category/${category}`,
        fallbackTitle: `${categoryData.name} Blogs`,
        fallbackDescription: `Read our latest blogs in ${categoryData.name}`,
        siteName: 'Top Companies',
    });
}

export default async function BlogCategoryPage({ params, }: BlogCategoryPageProps) {
    const { category } = await params;
    const categoryName = await getBlogCategory();
    const blogData = await getBlogCategoryData(category, 1, 2);

    return (
        <>
            <section className='px-5 pt-10 xl:pt-24 pb-10 xl:pb-25 relative z-1 overflow-hidden after:absolute after:top-[-70%] after:left-0 after:w-full after:h-full after:bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(217,43,66,1)_100%)] after:z-[-1] after:opacity-[0.2]'>
                <div className="container-8xl">
                    <div className='flex flex-wrap items-center justify-center gap-1.5'>
                        <Link href="/" className='text-sm leading-6 text-secondary block uppercase'>home</Link>
                        <span className='text-sm leading-6 text-secondary block'>/</span>
                        <Link href="/blog" className='text-sm leading-6 text-secondary block uppercase'>Blogs</Link>
                        <span className='text-sm leading-6 text-secondary block'>/</span>
                        <span className='text-sm leading-6 text-foreground block uppercase font-medium'>{category}</span>
                    </div>
                    <h1 className='font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mt-2 xl:mt-7.5 text-center'>
                        Latest{' '}<span className="text-primary font-light italic">Blogs</span>
                    </h1>
                </div>
            </section>

            <section className='px-5 pb-10 xl:pb-25 relative z-[1] overflow-hidden'>
                <div className="container-8xl">
                    <BlogContent
                        blogData={blogData}
                        currentPage={1}
                        categories={categoryName}
                        currentCategory={category}
                    />
                </div>
                <div className="absolute left-0 top-0 z-[-1]">
                    <Image src={'../../../../blog-shape1.svg'} alt="" width={116} height={224} />
                </div>
                <div className="absolute right-[-45%] md:right-[-16%] lg:right-0 top-[30%] lg:top-[65%] z-[-1]">
                    <Image src={'../../../../blog-shape2.svg'} alt="" width={204} height={250} />
                </div>
            </section>
        </>
    );
}