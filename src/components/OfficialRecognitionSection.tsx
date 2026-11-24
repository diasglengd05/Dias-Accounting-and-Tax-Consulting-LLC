import React from "react";
import { Award, ShieldCheck } from "lucide-react";

interface OfficialAwardItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
}

const OFFICIAL_2026_AWARDS: OfficialAwardItem[] = [
  {
    id: "clutch-risk-advisory-2026",
    title: "Top Financial Risk Advisory Consultants Company — United Arab Emirates (2026)",
    issuer: "Clutch",
    year: "2026",
    imageSrc: "/awards/clutch-risk-advisory-2026.png",
    imageAlt:
      "Clutch Official 2026 Award Badge: Top Financial Risk Advisory Consultants Company — United Arab Emirates (2026)",
    description:
      "Recognized for partner-led UAE Corporate Tax governance, FTA audit readiness, internal financial controls, and penalty-free regulatory compliance.",
  },
  {
    id: "clutch-financial-forecast-2026",
    title: "Top Financial Forecast Consultants Company — United Arab Emirates (2026)",
    issuer: "Clutch",
    year: "2026",
    imageSrc: "/awards/clutch-financial-forecast-2026.png",
    imageAlt:
      "Clutch Official 2026 Award Badge: Top Financial Forecast Consultants Company — United Arab Emirates (2026)",
    description:
      "Recognized for IFRS financial modeling, rolling cash-flow forecasting, 9% Corporate Tax scenario planning, and Fractional CFO advisory across Dubai & Sharjah.",
  },
];

interface OfficialRecognitionSectionProps {
  id?: string;
}

export const OfficialRecognitionSection: React.FC<OfficialRecognitionSectionProps> = ({
  id = "official-2026-recognition",
}) => {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="bg-[#070d19] text-white border-y border-[#c5a059]/25 py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#c5a059]">
              <Award className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Official 2026 Recognition</span>
            </div>
            <h2
              id={`${id}-heading`}
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight"
            >
              Official 2026 Recognition
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-[62ch]">
              Independently awarded by Clutch in the United Arab Emirates for verified client outcomes in financial risk advisory, IFRS forecasting, and UAE Corporate Tax governance.
            </p>
          </div>

          <div className="inline-flex items-center gap-2.5 self-start lg:self-end rounded-xl bg-[#0d1b2a] border border-[#c5a059]/30 px-4 py-2.5 text-xs sm:text-sm text-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#c5a059] shrink-0" aria-hidden="true" />
            <span>FTA-Registered Tax Agency · SHAMS Licence 2646813.01</span>
          </div>
        </div>

        {/* Two Award Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {OFFICIAL_2026_AWARDS.map((award) => (
            <article
              key={award.id}
              className="rounded-2xl bg-[#0d1b2a] border border-[#c5a059]/30 hover:border-[#c5a059]/60 transition-colors p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-[0_12px_36px_-18px_rgba(0,0,0,0.65)]"
            >
              {/* Official Badge Image Plate */}
              <div className="w-32 h-32 sm:w-36 sm:h-36 shrink-0 rounded-2xl bg-white/95 border border-[#c5a059]/40 p-2.5 flex items-center justify-center shadow-md">
                <img
                  src={award.imageSrc}
                  alt={award.imageAlt}
                  width={144}
                  height={144}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Award Details */}
              <div className="space-y-2.5 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c5a059]">
                  <span>Awarded by {award.issuer}</span>
                  <span aria-hidden="true" className="text-[#c5a059]/50">
                    ·
                  </span>
                  <span className="tabular-nums">{award.year} UAE Leader</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug tracking-tight">
                  {award.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {award.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfficialRecognitionSection;
