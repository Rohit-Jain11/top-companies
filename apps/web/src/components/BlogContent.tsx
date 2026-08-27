"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AllBlogData, BlogCategory } from "@/lib/types";
import { getBlogData, getBlogCategoryData } from "@/lib/api";

interface BlogContentProps {
    blogData: AllBlogData;
    currentPage: number;
    categories: BlogCategory[];
    currentCategory: string | null;
}

export default function BlogContent({ blogData, currentPage, categories, currentCategory, }: BlogContentProps) {
    const [recentSearch, setRecentSearch] = useState("");
    const [blogsData, setBlogsData] = useState(blogData);
    const [page, setPage] = useState(currentPage);
    const [loading, setLoading] = useState(false);
    const blogs = blogsData?.blogs?.data ?? [];
    // Only latest 3 posts
    const latestBlogs = (blogsData?.latestBlogs ?? []).slice(0, 3);

    const filteredRecentPosts = latestBlogs.filter((post) => {
        const searchValue = recentSearch.trim().toLowerCase();
        if (!searchValue) {
            return true;
        }
        return (
            post.title.toLowerCase().includes(searchValue) ||
            post.content?.toLowerCase().includes(searchValue)
        );
    });
    const totalPages = blogsData?.blogs?.meta?.totalPages ?? 1;

    const handlePageChange = async (newPage: number) => {
        if (
            newPage < 1 || newPage > totalPages || newPage === page || loading
        ) {
            return;
        }
        try {
            setLoading(true);
            const data = currentCategory ? await getBlogCategoryData(currentCategory, newPage, 2) : await getBlogData(newPage, 2);
            setBlogsData(data);
            setPage(newPage);
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (error) {
            console.error("Failed to load blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='text-center mb-8 xl:mb-15'>
                <ul className='flex items-center border border-border rounded-2xl p-2.5 max-w-fit mx-auto overflow-x-auto bg-white [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#e5e5e5] [&::-webkit-scrollbar-thumb]:rounded-full'>
                    <li className={`relative ${categories?.length ? 'after:content-[""] after:absolute after:top-1/2 after:right-0 after:-translate-y-1/2 after:w-0.5 after:h-8 after:bg-border' : ''}`}>
                        <Link href="/blog" className={`text-base leading-5.5 min-w-27.5 lg:min-w-38 w-max px-2.5 lg:px-4 py-2.5 rounded-2xl inline-block ${currentCategory === null ? "text-white bg-foreground" : "text-secondary"}`}>
                            All
                        </Link>
                    </li>
                    {categories?.map((category, index) => (
                        <li key={category.id} className={`relative ${index !== categories.length - 1 ? 'after:content-[""] after:absolute after:top-1/2 after:right-0 after:-translate-y-1/2 after:w-0.5 after:h-8 after:bg-border' : ''}`}>
                            <Link href={`/blog/category/${category.slug}`} className={`text-base leading-5.5 min-w-27.5 lg:min-w-38 w-max px-2.5 lg:px-4 py-2.5 rounded-2xl inline-block ${currentCategory === category.slug ? "text-white bg-foreground" : "text-secondary"}`}>
                                {category.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='flex gap-6 xl:gap-15 flex-wrap'>
                <div className='lg:basis-[65%] xl:basis-[66.1%] max-w-full w-full lg:max-w-[65%] xl:max-w-[66.1%] shrink-0'>
                    <div className='space-y-6 xl:space-y-15'>
                        {blogs.length > 0 ? (blogs.map((blog) => (
                            <article key={blog.id} className='space-y-6'>
                                <div className='rounded-[20px] overflow-hidden h-75 md:h-136.25'>
                                    {blog.image && (
                                        <Image src={blog.image} alt={blog.title} width={1000} height={1000} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div>
                                    <div className='flex flex-wrap gap-2 items-center justify-between border-b border-border pb-4 xl:pb-5 mb-4 xl:mb-7.5'>
                                        <span className='block text-sm leading-5 text-primary'>
                                            /{blog.blogCategory?.name}
                                        </span>
                                        <div className='text-sm leading-5 text-secondary flex items-center gap-2.5'>
                                            <span className='block'>
                                                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span className='block'>/</span>
                                            <p>by{" "} <span className='text-foreground'>Admin</span></p>
                                        </div>
                                    </div>
                                    <h2 className='font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal'>
                                        <Link href={`/blog/${blog.slug}`} className='block'>
                                            {blog.title}
                                        </Link>
                                    </h2>
                                    <p className='text-lg leading-7 text-secondary mt-4 xl:mt-6 mb-4 xl:mb-7.5'>{blog.content}</p>
                                    <Link href={`/blog/${blog.slug}`} className='text-lg leading-7 font-semibold text-foreground py-2.75 px-6.5 inline-block border border-foreground rounded-full bg-white transition-all ease-in-out duration-300 hover:bg-primary hover:border-primary hover:text-white'>
                                        Read more
                                    </Link>
                                </div>
                            </article>
                        ))
                        ) : (
                            <p className="text-secondary text-lg text-center">No blogs found.</p>
                        )}
                    </div>

                    <ul className='flex flex-wrap justify-center gap-3.5 mt-8 xl:mt-15'>
                        <li>
                            <button
                                type="button"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1 || loading}
                                className={`w-13 h-13 border border-border rounded-full flex items-center justify-center ${page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.72447 11.4745C7.58387 11.6151 7.50488 11.8058 7.50488 12.0047C7.50488 12.2036 7.58387 12.3943 7.72447 12.535L15.2245 20.035C15.3659 20.1716 15.5554 20.2472 15.752 20.2455C15.9487 20.2438 16.1368 20.1649 16.2758 20.0258C16.4149 19.8868 16.4938 19.6987 16.4955 19.502C16.4972 19.3054 16.4216 19.1159 16.285 18.9745L9.30997 11.9995L16.285 5.02445C16.4216 4.883 16.4972 4.69355 16.4955 4.4969C16.4938 4.30025 16.4149 4.11214 16.2758 3.97309C16.1368 3.83403 15.9487 3.75516 15.752 3.75345C15.5554 3.75174 15.3659 3.82733 15.2245 3.96395L7.72447 11.464L7.72447 11.4745Z" fill="#111827" />
                                </svg>
                            </button>
                        </li>
                        {Array.from({ length: totalPages, },
                            (_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <li key={pageNumber}>
                                        <button
                                            type="button"
                                            onClick={() => handlePageChange(pageNumber)}
                                            disabled={loading}
                                            className={`w-13 h-13 border rounded-full flex items-center justify-center cursor-pointer ${page === pageNumber ? "bg-foreground border-foreground text-white" : "border-border text-foreground"}`}
                                        >
                                            {pageNumber}
                                        </button>
                                    </li>
                                );
                            }
                        )}

                        <li>
                            <button
                                type="button"
                                onClick={() => handlePageChange(page + 1)}
                                disabled={ page === totalPages || loading }
                                className={`w-13 h-13 border border-border rounded-full flex items-center justify-center ${page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M16.2755 11.4745C16.4161 11.6151 16.4951 11.8058 16.4951 12.0047C16.4951 12.2036 16.4161 12.3943 16.2755 12.535L8.77553 20.035C8.63408 20.1716 8.44462 20.2472 8.24798 20.2455C8.05133 20.2438 7.86322 20.1649 7.72416 20.0258C7.58511 19.8868 7.50623 19.6987 7.50452 19.502C7.50281 19.3054 7.57841 19.1159 7.71503 18.9745L14.69 11.9995L7.71503 5.02445C7.57841 4.883 7.50281 4.69355 7.50452 4.4969C7.50623 4.30025 7.58511 4.11214 7.72416 3.9517L16.2755 11.464L16.2755 11.4745Z" fill="#111827" />
                                </svg>
                            </button>
                        </li>
                    </ul>
                </div>

                <div className='lg:basis-[calc(35%-24px)] xl:basis-[calc(33.9%-60px)] max-w-full w-full lg:max-w-[calc(35%-24px)] xl:max-w-[calc(33.9%-60px)] shrink-0 mt-10 lg:mt-0'>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className='relative'>
                            <input type='search' value={recentSearch} onChange={(e) => setRecentSearch(e.target.value)} placeholder='Search' className='border border-border rounded-[34px] text-lg leading-7 text-secondary font-normal w-full py-3 pl-5 pr-18 outline-none' />
                            <button type='submit' className='w-13.5 h-13.5 flex items-center justify-center absolute top-0 right-1' aria-label="Search blogs">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <path d="M12.5653 21.35C10.8278 21.35 9.12928 20.8348 7.68459 19.8695C6.23991 18.9042 5.11391 17.5321 4.449 15.9269C3.78408 14.3216 3.61011 12.5553 3.94908 10.8511C4.28805 9.14701 5.12474 7.58167 6.35334 6.35307C7.58195 5.12447 9.14729 4.28778 10.8514 3.9488C12.5555 3.60983 14.3219 3.78381 15.9272 4.44872C17.5324 5.11364 18.9044 6.23963 19.8697 7.68432C20.835 9.129 21.3503 10.8275 21.3503 12.565C21.3503 13.7187 21.123 14.861 20.6816 15.9269C20.2401 16.9927 19.593 17.9612 18.7772 18.7769C17.9614 19.5927 16.993 20.2398 15.9272 20.6813C14.8613 21.1228 13.7189 21.35 12.5653 21.35ZM12.5653 5.54167C11.1808 5.54167 9.82743 5.95221 8.67629 6.72138C7.52514 7.49055 6.62793 8.5838 6.09812 9.86288C5.56831 11.142 5.42968 12.5494 5.69978 13.9073C5.96988 15.2652 6.63656 16.5124 7.61553 17.4914C8.5945 18.4704 9.84178 19.1371 11.1996 19.4072C12.5575 19.6773 13.965 19.5386 15.2441 19.0088C16.5231 18.479 17.6164 17.5818 18.3856 16.4307C19.1547 15.2795 19.5653 13.9261 19.5653 12.5417C19.5653 10.6852 18.8278 8.90468 17.515 7.59192C16.2023 6.27917 14.4218 5.54167 12.5653 5.54167Z" fill="#555555" />
                                    <path d="M23.3336 24.2083C23.2187 24.2089 23.1047 24.1865 22.9986 24.1424C22.8924 24.0983 22.7961 24.0335 22.7153 23.9517L17.8969 19.1333C17.7424 18.9675 17.6582 18.7481 17.6622 18.5214C17.6662 18.2947 17.7581 18.0784 17.9184 17.9181C18.0787 17.7578 18.295 17.666 18.5217 17.662C18.7484 17.658 18.9677 17.7421 19.1336 17.8967L23.952 22.715C24.1158 22.8791 24.2078 23.1015 24.2078 23.3333C24.2078 23.5652 24.1158 23.7876 23.9517C23.8712 24.0335 23.7749 24.0985 23.6687 24.1424C23.5625 24.1865 23.4486 24.2089 23.3336 24.2083Z" fill="#555555" />
                                </svg>
                            </button>
                        </div>
                    </form>
                    <div className='mt-6 xl:mt-10'>
                        <h2 className='text-foreground text-[22px] xl:text-[28px] leading-7 xl:leading-11 tracking-[-0.56px] font-fraunces mb-4 xl:mb-6'>Recent Post</h2>
                        <div className='space-y-4 xl:space-y-5'>
                            {filteredRecentPosts.length > 0 ? (filteredRecentPosts.map((post) => (
                                <Link href={`/blog/${post.slug}`} key={post.id} className='rounded-[20px] p-2.5 blogGlass flex flex-wrap gap-4'>
                                    <div className='basis-[41.4%] max-w-[41.4%] shrink-0 rounded-[20px] overflow-hidden self-center h-24'>
                                        {post.image && (
                                            <Image src={post.image} alt={post.title} width={200} height={200} className='w-full h-full object-cover' />
                                        )}
                                    </div>
                                    <div className='basis-[calc(58.6%-16px)] max-w-[calc(58.6%-16px)] shrink-0 self-center'>
                                        <span className='text-primary text-sm leading-5 mb-1.25 block'>
                                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                        <h2 className='text-foreground text-base leading-5.5 font-semibold'>
                                            {post.title}
                                        </h2>
                                    </div>
                                </Link>
                            ))
                            ) : (
                                <p className="text-secondary text-base text-center">
                                    No recent posts found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}