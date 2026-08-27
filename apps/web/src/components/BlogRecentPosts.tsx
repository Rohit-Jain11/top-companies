"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Blog } from "@/lib/types";

interface BlogRecentPostsProps {
    latestBlogs: Blog[];
}

export default function BlogRecentPosts({ latestBlogs, }: BlogRecentPostsProps) {
    const [recentSearch, setRecentSearch] = useState("");
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

    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                    <input
                        type="search"
                        value={recentSearch}
                        onChange={(e) => setRecentSearch(e.target.value)}
                        placeholder="Search"
                        className="border border-border rounded-[34px] text-lg leading-7 text-secondary font-normal w-full py-3 pl-5 pr-18 outline-none"
                    />
                    <button type="submit" className="w-13.5 h-13.5 flex items-center justify-center absolute top-0 right-1" aria-label="Search blogs">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path d="M12.5653 21.35C10.8278 21.35 9.12928 20.8348 7.68459 19.8695C6.23991 18.9042 5.11391 17.5321 4.449 15.9269C3.78408 14.3216 3.61011 12.5553 3.94908 10.8511C4.28805 9.14701 5.12474 7.58167 6.35334 6.35307C7.58195 5.12447 9.14729 4.28778 10.8514 3.9488C12.5555 3.60983 14.3219 3.78381 15.9272 4.44872C17.5324 5.11364 18.9044 6.23963 19.8697 7.68432C20.835 9.129 21.3503 10.8275 21.3503 12.565C21.3503 13.7187 21.123 14.861 20.6816 15.9269C20.2401 16.9927 19.593 17.9612 18.7772 18.7769C17.9614 19.5927 16.993 20.2398 15.9272 20.6813C14.8613 21.1228 13.7189 21.35 12.5653 21.35ZM12.5653 5.54167C11.1808 5.54167 9.82743 5.95221 8.67629 6.72138C7.52514 7.49055 6.62793 8.5838 6.09812 9.86288C5.56831 11.142 5.42968 12.5494 5.69978 13.9073C5.96988 15.2652 6.63656 16.5124 7.61553 17.4914C8.5945 18.4704 9.84178 19.1371 11.1996 19.4072C12.5575 19.6773 13.965 19.5386 15.2441 19.0088C16.5231 18.479 17.6164 17.5818 18.3856 16.4307C19.1547 15.2795 19.5653 13.9261 19.5653 12.5417C19.5653 10.6852 18.8278 8.90468 17.515 7.59192C16.2023 6.27917 14.4218 5.54167 12.5653 5.54167Z" fill="#555555" />
                            <path d="M23.3336 24.2083C23.2187 24.2089 23.1047 24.1865 22.9986 24.1424C22.8924 24.0983 22.7961 24.0335 22.7153 23.9517L17.8969 19.1333C17.7424 18.9675 17.6582 18.7481 17.6622 18.5214C17.6662 18.2947 17.7581 18.0784 17.9184 17.9181C18.0787 17.7578 18.295 17.666 18.5217 17.662C18.7484 17.658 18.9677 17.7421 19.1336 17.8967L23.952 22.715C24.1158 22.8791 24.2078 23.1015 24.2078 23.3333C24.2078 23.5652 24.1158 23.7876 23.9517C23.8712 24.0335 23.7749 24.0985 23.6687 24.1424C23.5625 24.1865 23.4486 24.2089 23.3336 24.2083Z" fill="#555555" />
                        </svg>
                    </button>
                </div>
            </form>

            <div className="mt-6 xl:mt-10">
                <h2 className="text-foreground text-[22px] xl:text-[28px] leading-7 xl:leading-11 tracking-[-0.56px] font-fraunces mb-4 xl:mb-6">Recent Post</h2>
                <div className="space-y-4 xl:space-y-5">
                    {filteredRecentPosts.length > 0 ? (filteredRecentPosts.map((post) => (
                        <Link href={`/blog/${post.slug}`} key={post.id} className="rounded-[20px] p-2.5 blogGlass flex flex-wrap gap-4">
                            <div className="basis-[41.4%] max-w-[41.4%] shrink-0 rounded-[20px] overflow-hidden self-center h-24">
                                {post.image && (
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="basis-[calc(58.6%-16px)] max-w-[calc(58.6%-16px)] shrink-0 self-center">
                                <span className="text-primary text-sm leading-5 mb-1.25 block">
                                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                                <h3 className="text-foreground text-base leading-5.5 font-semibold">
                                    {post.title}
                                </h3>
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
        </>
    );
}