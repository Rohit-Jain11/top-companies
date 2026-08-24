import BlogContent from '@/components/BlogContent';
import { getBlogCategory, getBlogData } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default async function Blog() {
    const categoryName = await getBlogCategory();

    // Initial page
    const blogData = await getBlogData(1, 2);

    return (
        <>
            <section className='px-5 pt-10 xl:pt-24 pb-10 xl:pb-25 relative z-1 overflow-hidden after:absolute after:top-[-70%] after:left-0 after:w-full after:h-full after:bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(217,43,66,1)_100%)] after:z-[-1] after:opacity-[0.2]'>
                <div className="container-8xl">
                    <div className='flex flex-wrap items-center justify-center gap-1.5'>
                        <Link href="/" className='text-sm leading-6 text-secondary block uppercase'>home</Link>
                        <span className='text-sm leading-6 text-secondary block'>/</span>
                        <span className='text-sm leading-6 text-foreground block uppercase font-medium'>Blogs</span>
                    </div>
                    <h1 className='font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mt-2 xl:mt-7.5 text-center'>Latest <span className="text-primary font-light italic">Blogs</span></h1>
                </div>
            </section>

            <section className='px-5 pb-10 xl:pb-25 relative z-[1] overflow-hidden'>
                <div className="container-8xl">
                    {/* <div className='text-center mb-8 xl:mb-15'>
                        <ul className='flex items-center border border-border rounded-2xl p-2.5 max-w-fit mx-auto overflow-x-auto bg-white'>
                            {categoryName?.map((category, index) => (
                                <li 
                                    key={category.id}
                                    className={`relative ${index !== categoryName?.length - 1 ? 'after:content-[""] after:absolute after:top-1/2 after:right-0 after:-translate-y-1/2 after:w-0.5 after:h-8 after:bg-border' : ''}`}
                                >
                                    <button type='button' className={`text-base leading-5.5 min-w-27.5 lg:min-w-38 px-2.5 lg:px-4 py-2.5 rounded-2xl cursor-pointer ${index === 0 ? 'text-white bg-foreground' : 'text-secondary'}`}>{category.name}</button>
                                </li>
                            ))}
                        </ul>
                    </div> */}
                    {/* <BlogContent blogData={blogData} currentPage={1} categories={categoryName} /> */}
                    <BlogContent
                        blogData={blogData}
                        currentPage={1}
                        categories={categoryName}
                        currentCategory={null}
                    />
                </div>

                <div className="absolute left-0 top-0 z-[-1]">
                    <Image src={'../blog-shape1.svg'} alt="" width={116} height={224} />
                </div>
                <div className="absolute right-[-45%] md:right-[-16%] lg:right-0 top-[30%] lg:top-[65%] z-[-1]">
                    <Image src={'../blog-shape2.svg'} alt="" width={204} height={250} />
                </div>
            </section>
        </>
    );
};
