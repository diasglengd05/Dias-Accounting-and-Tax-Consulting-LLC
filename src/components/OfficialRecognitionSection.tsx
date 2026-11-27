import React from "react";
import { Award, ArrowUpRight, ShieldCheck } from "lucide-react";
import { CLUTCH_PROFILE_URL } from "./ClutchBadges";

interface OfficialAwardItem {
  id: string;
  title: string;
  shortLabel: string;
  imageSrc: string;
  imageAlt: string;
}

const OFFICIAL_2026_AWARDS: OfficialAwardItem[] = [
  {
    id: "clutch-risk-advisory-2026",
    title:
      "Top Financial Risk Advisory Consultants Company — United Arab Emirates (2026)",
    shortLabel: "Top Financial Risk Advisory Consultants · UAE 2026",
    imageSrc: "/awards/clutch-risk-advisory-2026.png",
    imageAlt:
      "Clutch Official 2026 Award Badge: Top Financial Risk Advisory Consultants Company — United Arab Emirates (2026)",
  },
  {
    id: "clutch-financial-forecast-2026",
    title:
      "Top Financial Forecast Consultants Company — United Arab Emirates (2026)",
    shortLabel: "Top Financial Forecast Consultants · UAE 2026",
    imageSrc: "/awards/clutch-financial-forecast-2026.png",
    imageAlt:
      "Clutch Official 2026 Award Badge: Top Financial Forecast Consultants Company — United Arab Emirates (2026)",
  },
];

interface OfficialRecognitionSectionProps {
  id?: string;
}

export const OfficialRecognitionSection: React.FC<
  OfficialRecognitionSectionProps
> = ({ id = "official-2026-recognition" }) => {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#FFFFFF] text-[#0D1B2A] border-y border-[#E2E8F0] py-14 lg:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Clean Minimal Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#856422]">
              <Award className="w-4 h-4 text-[#C5A059] shrink-0" aria-hidden="true" />
              <span>Clutch · United Arab Emirates</span>
            </div>
            <h2
              id={`${id}-heading`}
              className="font-display text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight leading-tight"
            >
              Official 2026 Recognition
            </h2>
          </div>

          <a
            href={CLUTCH_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start sm:self-end rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#1B4332]/50 px-4 py-2 text-xs sm:text-sm font-semibold text-[#0D1B2A] hover:text-[#1B4332] transition-colors shadow-xs"
          >
            <ShieldCheck
              className="w-4 h-4 text-[#1B4332] shrink-0"
              aria-hidden="true"
            />
            <span>Verify on Clutch</span>
            <ArrowUpRight
              className="w-3.5 h-3.5 text-[#1B4332] shrink-0"
              aria-hidden="true"
            />
          </a>
        </div>

        {/* Two Clickable Side-by-Side Award Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OFFICIAL_2026_AWARDS.map((award) => (
            <a
              key={award.id}
              href={CLUTCH_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${award.title} — View verified Clutch profile`}
              className="group rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#C5A059] hover:-translate-y-0.5 transition-all duration-200 p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 shadow-[0_6px_24px_-12px_rgba(13,27,42,0.08)] hover:shadow-[0_14px_34px_-14px_rgba(197,160,89,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
            >
              {/* Official Badge PNG */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] group-hover:border-[#C5A059]/60 p-2 flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-[1.03]">
                <img
                  src={award.imageSrc}
                  alt={award.imageAlt}
                  width={128}
                  height={128}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Clean, Uncluttered Award Details */}
              <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#856422]">
                  {award.shortLabel}
                </p>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#0D1B2A] leading-snug tracking-tight group-hover:text-[#1B4332] transition-colors">
                  {award.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#475569] group-hover:text-[#1B4332] pt-1 transition-colors">
                  <span>View verified Clutch profile</span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 text-[#1B4332] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfficialRecognitionSection;
