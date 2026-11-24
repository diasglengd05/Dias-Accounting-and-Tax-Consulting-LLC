import React from "react";
import { Star } from "lucide-react";

export interface ReviewCardProps {
  quote: string;
  authorName: string;
  authorRole?: string;
  authorCompany?: string;
  location?: string;
  serviceTag?: string;
  rating?: number;
  relativeTime?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  quote,
  authorName,
  authorRole,
  authorCompany,
  location,
  serviceTag,
  rating = 5,
  relativeTime,
}) => {
  const starCount = Math.max(1, Math.min(5, Math.round(rating)));
  const industryJurisdiction = [authorCompany, location].filter(Boolean).join(", ");
  const attributionLine = [authorRole, industryJurisdiction].filter(Boolean).join(" · ");

  return (
    <article className="h-full rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-7 sm:p-8 shadow-[0_6px_24px_-16px_rgba(13,27,42,0.08)] flex flex-col justify-between transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(13,27,42,0.12)]">
      <div>
        <div className="flex items-center justify-between gap-3 mb-5">
          <div
            className="flex items-center gap-1"
            aria-label={`${starCount} out of 5 stars`}
          >
            {Array.from({ length: starCount }).map((_, idx) => (
              <Star
                key={idx}
                className="w-4 h-4 fill-[#C5A059] text-[#C5A059]"
                aria-hidden="true"
              />
            ))}
          </div>
          {serviceTag && (
            <span className="text-xs font-medium text-[#64748B] truncate">
              {serviceTag}
            </span>
          )}
        </div>

        <blockquote className="text-[15px] sm:text-base text-[#334155] leading-[1.6] font-normal">
          &ldquo;{quote}&rdquo;
        </blockquote>
      </div>

      <footer className="mt-7 pt-5 border-t border-[#E2E8F0] flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="font-display font-bold text-sm sm:text-[15px] text-[#0D1B2A] truncate">
            {authorName}
          </p>
          {attributionLine && (
            <p className="text-xs sm:text-[13px] text-[#475569] mt-1 leading-snug">
              {attributionLine}
            </p>
          )}
        </div>
        {relativeTime && (
          <span className="text-xs text-[#94A3B8] tabular-nums shrink-0">
            {relativeTime}
          </span>
        )}
      </footer>
    </article>
  );
};

export default ReviewCard;
