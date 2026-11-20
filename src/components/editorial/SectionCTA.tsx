import React from "react";
import { ArrowRight } from "lucide-react";

export interface SectionCTAProps {
  variant?: "navy" | "strip";
  eyebrow?: string;
  title: string;
  description?: string;
  ctaLabel: string;
  onCtaClick: () => void;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
  className?: string;
}

export const SectionCTA: React.FC<SectionCTAProps> = ({
  variant = "navy",
  eyebrow,
  title,
  description,
  ctaLabel,
  onCtaClick,
  secondaryLabel,
  onSecondaryClick,
  className = "",
}) => {
  if (variant === "strip") {
    return (
      <section className={`bg-[#FFFFFF] border-t border-[#E2E8F0] py-16 lg:py-20 ${className}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-6 py-8 sm:px-10 sm:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              {eyebrow && (
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                  {eyebrow}
                </span>
              )}
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight">
                {title}
              </h2>
              {description && (
                <p className="text-sm sm:text-base text-[#475569] leading-[1.65] max-w-[62ch]">
                  {description}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onCtaClick}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
              {secondaryLabel && onSecondaryClick && (
                <button
                  type="button"
                  onClick={onSecondaryClick}
                  className="min-h-[48px] px-5 py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0D1B2A] text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  {secondaryLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-[#FFFFFF] border-t border-[#E2E8F0] py-16 lg:py-24 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#0D1B2A] text-white px-6 py-10 sm:px-12 sm:py-14 shadow-[0_18px_48px_-20px_rgba(13,27,42,0.35)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            {eyebrow && (
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
                {eyebrow}
              </span>
            )}
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              {title}
            </h2>
            {description && (
              <p className="text-slate-300 text-sm sm:text-base leading-[1.65] max-w-[60ch]">
                {description}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onCtaClick}
              className="min-h-[48px] px-7 py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#0D1B2A] text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap shadow-xs"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
            {secondaryLabel && onSecondaryClick && (
              <button
                type="button"
                onClick={onSecondaryClick}
                className="min-h-[44px] px-3 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionCTA;
