import Image from "next/image";
import { ArrowUpRight, BadgeCheck, DollarSign, MapPin, Users } from "lucide-react";
import { PublicCompany } from "@/lib/types";
import Link from "next/link";

export function CompanyRankCard({ company, rank }: { company: PublicCompany; rank: number }) {
  const initials = company.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const stacks = company.techStacks.map((t) => t.techStack);
  const visibleStacks = stacks.slice(0, 4);
  const extraCount = stacks.length - visibleStacks.length;

  const getScoreLabel = (score: number | null) => {
    if (score === null) return "";

    if (score >= 9) return "Excellent";
    if (score >= 7.5) return "Proven";
    if (score >= 6) return "Strong";

    return "High";
  };

  return (
    <div className="rounded-[20px] py-4 xl:py-5 px-5 xl:px-7.5 innerGlass2">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-5">
          <span className="block text-[20px] xl:text-2xl leading-8 xl:leading-9.5 font-medium font-fraunces text-primary">{String(rank).padStart(2, "0")}</span>
          {rank === 1 && (
            <span className="bg-foreground rounded-full text-xs leading-4 py-0.5 px-2 inline-block text-white"># 1 Pick</span>
          )}
        </div>
        {company.score !== null && (
        <span className="font-fraunces inline-block text-base leading-6.5 text-primary italic font-semibold">
          {getScoreLabel(company.score)}
        </span>
        )}
      </div>
      <h4 className="text-base leading-5.5 font-semibold text-foreground mb-1">{company.name}</h4>
      {company.shortDescription && (
        <p className="text-sm leading-5 text-secondary mb-4 xl:mb-6">{company.shortDescription}</p>
      )}
      <div className="flex flex-wrap items-end justify-between gap-y-2.5 gap-x-5">
        <div className="w-full lg:w-auto">
          <span className="text-sm leading-5 text-foreground font-normal block">{company.headOffice}</span>
          <p className="text-sm leading-5 text-secondary font-normal py-1">{company?.employeeRange?.title} · {company?.hourlyRateRange?.title}</p>
          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm leading-5 text-primary font-normal flex w-max">
              {company.website
                .replace(/^https?:\/\/(www\.)?/, "")
                .replace(/\/$/, "")
              }
            </a>
          )}
        </div>
        {visibleStacks.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center">
            {visibleStacks.map((stack) => (
              <span key={stack.slug} className="text-sm leading-5 text-secondary font-normal bg-background-gray border border-border rounded-full py-0.75 px-2.25 inline-block">
                {stack.name}
              </span>
            ))}
            {extraCount > 0 && <span className="text-xs text-muted-foreground">+{extraCount}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
