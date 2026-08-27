import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/lib/api";
import BlogRecentPosts from "@/components/BlogRecentPosts";

interface BlogDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}
export default async function BlogDetailPage({ params, }: BlogDetailPageProps) {
    const { slug } = await params;

    const blogData = await getBlogBySlug(slug);

    const blog = blogData.blog;
    const latestBlogs = blogData.latestBlogs.slice(0, 3);

    if (!blog) {
        notFound();
    }

    return (
        <>
            <section className="px-5 pt-10 xl:pt-24 pb-10 xl:pb-25 relative z-1 overflow-hidden after:absolute after:top-[-70%] after:left-0 after:w-full after:h-full after:bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(217,43,66,1)_100%)] after:z-[-1] after:opacity-[0.2]">
                <div className="container-8xl">
                    <div className="max-w-220 mx-auto">
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                            <Link href="/" className="text-sm leading-6 text-secondary block uppercase">home</Link>
                            <span className="text-sm leading-6 text-secondary block">/</span>
                            <Link href="/blog" className="text-sm leading-6 text-secondary block uppercase">blogs</Link>
                            <span className="text-sm leading-6 text-secondary block">/</span>
                            <span className="text-sm leading-6 text-foreground block uppercase font-medium">{blog.blogCategory?.name}</span>
                        </div>
                        <h1 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal mt-2 xl:mt-7.5 text-center">{blog.title}</h1>
                    </div>
                </div>
            </section>

            <section className="px-5 pb-10 xl:pb-25 relative z-[1] overflow-hidden">
                <div className="container-8xl">
                    <div className="flex gap-6 xl:gap-15 flex-wrap">
                        <div className="lg:basis-[65%] xl:basis-[66.1%] max-w-full w-full lg:max-w-[65%] xl:max-w-[66.1%] shrink-0">
                            <article>
                                <div className="rounded-[20px] overflow-hidden h-75 md:h-136.25 mb-6">
                                    {blog.image && (
                                        <Image
                                            src={blog.image}
                                            alt={blog.title}
                                            width={1000}
                                            height={1000}
                                            priority
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 items-center justify-between border-b border-border pb-4 xl:pb-5 mb-4 xl:mb-7.5">
                                    <span className="block text-sm leading-5 text-primary">/{blog.blogCategory?.name}</span>
                                    <div className="text-sm leading-5 text-secondary flex items-center gap-2.5">
                                        <time dateTime={blog.createdAt}>
                                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </time>
                                        <span className="block">/</span>
                                        <p>
                                            by{" "}
                                            <span className="text-foreground">
                                                Admin
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal">{blog.title}</h2>
                                <p className="text-lg leading-7 text-secondary mt-4 xl:mt-6 mb-6 xl:mb-10">{blog.content}</p>
                                <div className="mt-8 xl:mt-12">
                                    <Link href="/blog" className="text-lg leading-7 font-semibold text-foreground py-2.75 px-6.5 inline-block border border-foreground rounded-full bg-white transition-all ease-in-out duration-300 hover:bg-primary hover:border-primary hover:text-white">
                                        ← Back to Blogs
                                    </Link>
                                </div>
                            </article>
                        </div>

                        <div className="lg:basis-[calc(35%-24px)] xl:basis-[calc(33.9%-60px)] max-w-full w-full lg:max-w-[calc(35%-24px)] xl:max-w-[calc(33.9%-60px)] shrink-0 mt-10 lg:mt-0">
                            <BlogRecentPosts latestBlogs={latestBlogs} />
                        </div>
                    </div>
                </div>
                <div className="absolute left-0 top-0 z-[-1]">
                    <Image src="/blog-shape1.svg" alt="" width={116} height={224} />
                </div>
                <div className="absolute right-[-45%] md:right-[-16%] lg:right-0 top-[30%] lg:top-[65%] z-[-1]">
                    <Image src="/blog-shape2.svg" alt="" width={204} height={250} />
                </div>
            </section>
        </>
    );
}