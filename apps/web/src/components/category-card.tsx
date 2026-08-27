import Link from "next/link";
import { PublicCategorySummary } from "@/lib/types";

interface CategoryCardProps {
  category: PublicCategorySummary;
  index: number;
  total: number;
}

export function CategoryCard({ category, index, total }: CategoryCardProps) {
  const isMobileLastItem = index === total - 1;

  const isSmLastColumn = (index + 1) % 2 === 0;

  const smRemaining = total % 2;
  const smLastRowStart = smRemaining === 0 ? total - 2 : total - smRemaining;

  const isSmLastRow = index >= smLastRowStart;

  const isLgLastColumn = (index + 1) % 3 === 0;
  const lgRemaining = total % 3;
  const lgLastRowStart = lgRemaining === 0 ? total - 3 : total - lgRemaining;
  const isLgLastRow = index >= lgLastRowStart;

  return (
    <Link 
      href={`/${category.slug}`} 
      className={`
        w-full max-w-full
        py-3.75 px-3.5 xl:px-5.5
        flex items-center justify-between

        border-b border-border

        sm:basis-[50%]
        sm:shrink-0
        sm:max-w-[50%]
        sm:border-r

        lg:basis-[33.33%]
        lg:max-w-[33.33%]
        
        ${isMobileLastItem ? "border-b-0 sm:border-b" : ""}
        ${isSmLastColumn ? "sm:border-r-0 lg:border-r" : ""}
        ${isSmLastRow ? "sm:border-b-0 lg:border-b" : ""}
        ${isLgLastColumn ? "lg:border-r-0" : ""}
        ${isLgLastRow ? "lg:border-b-0" : ""}
      `}
    >
      <h3 className="text-base leading-5.5 font-semibold text-foreground">{category.name}</h3>
      <p className="bg-background-gray border border-border text-sm leading-5 text-secondary py-0.75 px-2.75 inline-block min-w-12.5 rounded-full text-center shrink-0">{category._count.companies}</p>
    </Link>
  );
}
