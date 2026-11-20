import React from "react";
import { ArrowRight } from "lucide-react";
import { RelatedResourceItem } from "../../lib/internalLinks";

export interface RelatedResourcesProps {
  eyebrow?: string;
  heading?: string;
  items: RelatedResourceItem[];
  onNavigate: (path: string) => void;
  background?: "white" | "neutral";
}

/**
 * Clean, low-density internal linking module (max 3 crisp cards).
 * Uses native <a> tags with SPA interception so search engine crawlers discover every link.
 */
export const RelatedResources: React.FC<RelatedResourcesProps> = ({
  eyebrow = "Related UAE Tax & Compliance Resources",
  heading = "Recommended Next Steps",
  items,
  onNavigate,
  background = "neutral",
}) => {
  const visibleItems = items.slice(0, 3);
  if (visibleItems.length === 0) return null;

  const bgClass = background === "white" ? "bg-[#FFFFFF]" : "bg-[#F8FAFC]";

  return (
    <section
      aria-label={heading}
      className={`${bgClass} py-14 lg:py-16 border-t border-[#E2E8F0]`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8 space-y-1.5">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
            {eyebrow}
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight">
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {visibleItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.path);
              }}
              className="group rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#0D1B2A] p-6 transition-all shadow-[0_6px_24px_-16px_rgba(13,27,42,0.06)] hover:shadow-[0_12px_30px_-16px_rgba(13,27,42,0.12)] flex flex-col justify-between gap-5 no-underline"
            >
              <div className="space-y-2">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#856422]">
                  {item.eyebrow}
                </span>
                <h3 className="font-display text-base font-bold text-[#0D1B2A] group-hover:text-[#1B4332] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-[#475569] leading-[1.6]">
                  {item.description}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] group-hover:text-[#0D1B2A] transition-colors">
                <span>{item.anchorLabel}</span>
                <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedResources;
