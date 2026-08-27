"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Category = {
    id: number;
    name: string;
    slug: string;
    image?: string | null;
    _count: {
        companies: number;
    };
    children?: Category[];
};

interface CategoryTabsProps {
    categories: Category[];
}

export default function CategoryTabs({ categories, }: CategoryTabsProps) {
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
        categories[0]?.id ?? null
    );

    const activeCategory = categories.find(
        (category) => category.id === activeCategoryId
    );

    if (!categories.length) {
        return (
            <p className="text-muted-foreground">
                No categories are available yet.
            </p>
        );
    }

    return (
        <div className="flex flex-wrap">
            <div className="basis-full max-w-full md:basis-55.5 md:max-w-55.5 md:shrink-0">
                <div className="sticky top-20">
                    <ul className="w-full">
                        {categories.map((category) => {
                            const isActive = category.id === activeCategoryId;
                            return (
                                <li key={category.id}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveCategoryId(category.id)}
                                        //aria-selected={isActive}
                                        className={`text-lg leading-7 py-3 border-b block w-full text-left cursor-pointer transition-colors ${
                                        isActive
                                            ? "text-primary border-primary font-semibold"
                                            : "text-secondary border-primary/10 font-normal hover:text-primary"
                                        }`}
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className="basis-full max-w-full md:basis-[calc(100%-222px)] md:max-w-[calc(100%-222px)] md:shrink-0 mt-8 md:mt-0 md:pl-10 xl:pl-25">
                {activeCategory && (
                    <div className="bg-white shadow-card rounded-2xl p-5 xl:p-7.5">
                        <div className="flex items-center justify-between gap-2 mb-4 xl:mb-7">
                            <h2 className="font-fraunces text-foreground text-[22px] xl:text-[28px] leading-7 xl:leading-11 tracking-[-0.56px] font-normal">
                                {activeCategory.name}
                            </h2>
                            <Link href={`/${activeCategory.slug}`} className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline">
                                <span className="hidden sm:inline-block">View All</span>
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>

                        {activeCategory.children && activeCategory.children.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 xl:gap-x-4.5 gap-y-1">
                                {activeCategory.children.map((child) => (
                                    <Link
                                        key={child.id}
                                        href={`/${child.slug}`}
                                        className="py-1.5 sm:py-2.75 transition-all text-base leading-5.5 text-secondary px-3.5 relative before:content-[''] before:absolute before:left-0 before:top-3.5 sm:before:top-4.75 before:w-1 before:h-1 before:bg-secondary before:opacity-20 before:rounded-full hover:text-primary hover:before:bg-primary hover:before:opacity-100 hover:underline"
                                    >
                                        {child.name}
                                    </Link>
                                ))}
                            </div>
                            ) : (
                            <div className="">
                                <p className="text-secondary text-base leading-5.5 text-center">No subcategories available for {activeCategory.name}.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}