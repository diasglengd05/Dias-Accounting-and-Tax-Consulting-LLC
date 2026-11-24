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
      className="bg-[#070d19] text-white border-y border-[#c5a059]/25 py-14 lg:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Clean Minimal Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#c5a059]">
              <Award className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Clutch · United Arab Emirates</span>
            </div>
            <h2
              id={`${id}-heading`}
              className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight"
            >
              Official 2026 Recognition
            </h2>
          </div>

          <a
            href={CLUTCH_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start sm:self-end rounded-xl bg-[#0d1b2a] hover:bg-[#13263a] border border-[#c5a059]/35 hover:border-[#c5a059]/70 px-4 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-colors"
          >
            <ShieldCheck
              className="w-4 h-4 text-[#c5a059] shrink-0"
              aria-hidden="true"
            />
            <span>Verify on Clutch</span>
            <ArrowUpRight
              className="w-3.5 h-3.5 text-[#c5a059] shrink-0"
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
              className="group rounded-2xl bg-[#0d1b2a] border border-[#c5a059]/30 hover:border-[#c5a059]/80 hover:-translate-y-0.5 transition-all duration-200 p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 shadow-[0_12px_32px_-18px_rgba(0,0,0,0.65)] hover:shadow-[0_16px_40px_-16px_rgba(197,160,89,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059]"
            >
              {/* Official Badge PNG */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl bg-white/95 border border-[#c5a059]/40 group-hover:border-[#c5a059] p-2 flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-[1.03]">
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c5a059]">
                  {award.shortLabel}
                </p>
                <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug tracking-tight group-hover:text-[#f5e39c] transition-colors">
                  {award.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 group-hover:text-white pt-1 transition-colors">
                  <span>View verified Clutch profile</span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 text-[#c5a059] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
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
