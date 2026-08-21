import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Blog {
    id: number;
    image: string;
    category: string;
    date: string;
    author: string;
    title: string;
    description: string;
    slug: string;
    content: string[];
}

const blogs: Blog[] = [
    {
        id: 1,
        image: "/blog1.webp",
        category: "BUSINESS",
        date: "August 1, 2026",
        author: "Admin",
        title: "12 Best Free/Open Source App Development Software Solutions",
        description: "IT companies should share industry insights, technology trends, case studies, tutorials, and expert opinions to educate audiences, build authority, and support business growth.",
        slug: "best-free-open-source-app-development-software",
        content: [
            "App development has become an important part of modern business. Companies of every size are using mobile and web applications to improve customer experiences, automate processes, and create new digital products.",

            "However, building an application does not always require expensive development software. There are many free and open-source app development solutions available that can help developers and businesses build powerful applications.",

            "Free and open-source development tools provide developers with flexibility, customization, and access to a large community of contributors. They can be especially useful for startups, small businesses, students, and independent developers.",

            "In this article, we explore some of the best free and open-source app development software solutions that developers can consider for their next project.",
        ],
    },

    {
        id: 2,
        image: "/blog2.webp",
        category: "TECHNOLOGY",
        date: "August 5, 2026",
        author: "Admin",
        title: "Top Technology Trends Every Business Should Know",
        description: "Discover the latest technology trends that are transforming businesses and creating new opportunities for growth.",
        slug: "top-technology-trends-business",
        content: [
            "Technology continues to change the way businesses operate, communicate with customers, and deliver products and services.",

            "Businesses that understand emerging technology trends can identify new opportunities, improve efficiency, and provide better experiences to their customers.",

            "From artificial intelligence and automation to cloud computing and modern web applications, businesses have access to more technology than ever before.",

            "Understanding these trends can help organizations make better technology decisions and prepare for the future.",
        ],
    },

    {
        id: 3,
        image: "/blog3.webp",
        category: "DEVELOPMENT",
        date: "August 10, 2026",
        author: "Admin",
        title: "How Modern Web Development Is Changing Businesses",
        description: "Modern web development technologies are helping businesses build faster, scalable and user-friendly digital experiences.",
        slug: "modern-web-development-business",
        content: [
            "Modern web development has changed significantly over the last few years. Businesses now expect websites to be fast, responsive, accessible, and easy to use.",

            "Frameworks such as Next.js and modern React technologies allow developers to build high-performance websites and applications while maintaining a great developer experience.",

            "A modern website is no longer just an online presence. It can become an important part of a company's sales, marketing, customer service, and business operations.",

            "Businesses that invest in a strong digital experience can improve customer engagement and create better opportunities for long-term growth.",
        ],
    },
];

const recentPosts = [
    {
        id: 1,
        image: "/blog1.webp",
        date: "August 1, 2026",
        title: "12 Best Free/Open Source App Development Software Solutions",
        slug: "best-free-open-source-app-development-software",
    },
    {
        id: 2,
        image: "/blog2.webp",
        date: "August 5, 2026",
        title: "Top Technology Trends Every Business Should Know",
        slug: "top-technology-trends-business",
    },
    {
        id: 3,
        image: "/blog3.webp",
        date: "August 10, 2026",
        title: "How Modern Web Development Is Changing Businesses",
        slug: "modern-web-development-business",
    },
];

interface BlogDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export function generateStaticParams() {
    return blogs.map((blog) => ({
        slug: blog.slug,
    }));
}

export default async function BlogDetailPage({ params, }: BlogDetailPageProps) {
    const { slug } = await params;
    const blog = blogs.find((item) => item.slug === slug);

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
                            <span className="text-sm leading-6 text-foreground block uppercase font-medium">{blog.category}</span>
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
                                    <Image src={blog.image} alt={blog.title} width={1000} height={1000} priority className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-wrap gap-2 items-center justify-between border-b border-border pb-4 xl:pb-5 mb-4 xl:mb-7.5">
                                    <span className="block text-sm leading-5 text-primary">/{blog.category}</span>
                                    <div className="text-sm leading-5 text-secondary flex items-center gap-2.5">
                                        <time dateTime={blog.date}>{blog.date}</time>
                                        <span className="block">/</span>
                                        <p>by{" "} <span className="text-foreground">{blog.author}</span></p>
                                    </div>
                                </div>
                                <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal">{blog.title}</h2>
                                <p className="text-lg leading-7 text-secondary mt-4 xl:mt-6 mb-6 xl:mb-10">{blog.description}</p>
                                <div className="space-y-6">
                                    {blog.content.map((paragraph, index) => (
                                        <p key={index} className="text-lg leading-8 text-secondary">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                <div className="mt-8 xl:mt-12">
                                    <Link href="/blog" className="text-lg leading-7 font-semibold text-foreground py-2.75 px-6.5 inline-block border border-foreground rounded-full bg-white transition-all ease-in-out duration-300 hover:bg-primary hover:border-primary hover:text-white">
                                        ← Back to Blogs
                                    </Link>
                                </div>
                            </article>
                        </div>

                        <div className="lg:basis-[calc(35%-24px)] xl:basis-[calc(33.9%-60px)] max-w-full w-full lg:max-w-[calc(35%-24px)] xl:max-w-[calc(33.9%-60px)] shrink-0 mt-10 lg:mt-0">
                            <form>
                                <div className="relative">
                                    <input type="search" placeholder="Search" className="border border-border rounded-[34px] text-lg leading-7 text-secondary font-normal w-full py-3 pl-5 pr-18 outline-none" />
                                    <button type="submit" aria-label="Search" className="w-13.5 h-13.5 flex items-center justify-center absolute top-0 right-1 cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                            <path d="M12.5653 21.35C10.8278 21.35 9.12928 20.8348 7.68459 19.8695C6.23991 18.9042 5.11391 17.5321 4.449 15.9269C3.78408 14.3216 3.61011 12.5553 3.94908 10.8511C4.28805 9.14701 5.12474 7.58167 6.35334 6.35307C7.58195 5.12447 9.14729 4.28778 10.8514 3.9488C12.5555 3.60983 14.3219 3.78381 15.9272 4.44872C17.5324 5.11364 18.9044 6.23963 19.8697 7.68432C20.835 9.129 21.3503 10.8275 21.3503 12.565C21.3503 13.7187 21.123 14.861 20.6816 15.9269C20.2401 16.9927 19.593 17.9612 18.7772 18.7769C17.9614 19.5927 16.993 20.2398 15.9272 20.6813C14.8613 21.1228 13.7189 21.35 12.565 21.35ZM12.5653 5.54167C11.1808 5.54167 9.82743 5.95221 8.67629 6.72138C7.52514 7.49055 6.62793 8.5838 6.09812 9.86288C5.56831 11.142 5.42968 12.5494 5.69978 13.9073C5.96988 15.2652 6.63656 16.5124 7.61553 17.4914C8.5945 18.4704 9.84178 19.1371 11.1996 19.4072C12.5575 19.6773 13.965 19.5386 15.2441 19.0088C16.5231 18.479 17.6164 17.5818 18.3856 16.4307C19.1547 15.2795 19.5653 13.9261 19.5653 12.5417C19.5653 10.6852 18.8278 8.90468 17.515 7.59192C16.2023 6.27917 14.4218 5.54167 12.5653 5.54167Z" fill="#555555"/>
                                            <path d="M23.3336 24.2083C23.2187 24.2089 23.1047 24.1865 22.9986 24.1424C22.8924 24.0983 22.7961 24.0335 22.7153 23.9517L17.8969 19.1333C17.7424 18.9675 17.6582 18.7481 17.6622 18.5214C17.6662 18.2947 17.7581 18.0784 17.9184 17.9181C18.0787 17.7578 18.295 17.666 18.5217 17.662C18.7484 17.658 18.9677 17.7421 19.1336 17.8967L23.952 22.715C24.1158 22.8791 24.2078 23.1015 24.2078 23.3333C24.2078 23.5652 24.1158 23.7876 23.9517C24.0335 23.8712 24.0983 23.7749 24.1424 23.6687C24.1865 23.5625 24.2089 23.4486 24.2083Z" fill="#555555" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                            <div className="mt-6 xl:mt-10">
                                <h2 className=" text-foreground text-[22px] xl:text-[28px] leading-7 xl:leading-11 tracking-[-0.56px] font-fraunces mb-4 xl:mb-6">Recent Post</h2>
                                <div className="space-y-4 xl:space-y-5">
                                    {recentPosts.map((post) => (
                                        <Link href={`/blog/${post.slug}`} key={post.id} className="rounded-[20px] p-2.5 blogGlass flex flex-wrap gap-4">
                                            <div className="basis-[41.4%] max-w-[41.4%] shrink-0 rounded-[20px] overflow-hidden self-center">
                                                <Image src={post.image} alt={post.title} width={200} height={200} className="w-full h-full object-cover" />
                                            </div>
                                            <div className=" basis-[calc(58.6%-16px)] max-w-[calc(58.6%-16px)] shrink-0 self-center">
                                                <span className="text-primary text-sm leading-5 mb-1.25 block">{post.date}</span>
                                                <h3 className="text-foreground text-base leading-5.5 font-semibold">{post.title}</h3>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
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