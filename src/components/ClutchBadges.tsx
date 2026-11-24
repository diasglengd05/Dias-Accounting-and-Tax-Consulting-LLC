import React, { useEffect } from "react";
import { Award, ArrowUpRight } from "lucide-react";

declare global {
  interface Window {
    CLUTCHCO?: {
      Init?: () => void;
    };
  }
}

export const CLUTCH_PROFILE_URL =
  "https://clutch.co/profile/dias-accounting-tax-consulting";

export const CLUTCH_AWARD_CAPTION =
  "Recognized by Clutch as a Top Financial Risk Advisory Consultants Company and Top Financial Forecast Consultants Company in the United Arab Emirates (2026).";

export const ClutchRatingWidget: React.FC = () => {
  useEffect(() => {
    try {
      window.CLUTCHCO?.Init?.();
    } catch {
      // Ignore third-party widget initialization errors
    }
  }, []);

  return (
    <a
      href={CLUTCH_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="2x Clutch UAE Leader 2026 — View verified Dias Accounting profile on Clutch"
      className="group inline-flex items-center gap-1.5 rounded-full bg-[#0d1b2a] hover:bg-[#070d19] border border-[#c5a059]/50 hover:border-[#c5a059] px-3 py-1 text-xs font-semibold text-white transition-all shadow-xs"
    >
      <Award
        className="w-3.5 h-3.5 text-[#c5a059] shrink-0"
        aria-hidden="true"
      />
      <span>2x Clutch UAE Leader 2026</span>
      <ArrowUpRight
        className="w-3.5 h-3.5 text-[#c5a059] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
        aria-hidden="true"
      />
    </a>
  );
};

export const ClutchAwardBadge: React.FC = () => {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <a
        href={CLUTCH_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Clutch Top Financial Risk Advisory Consultants — UAE 2026 (Opens Clutch profile)"
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/95 border border-[#c5a059]/40 hover:border-[#c5a059] hover:-translate-y-0.5 p-1.5 flex items-center justify-center shadow-xs transition-all"
      >
        <img
          src="/awards/clutch-risk-advisory-2026.png"
          alt="Clutch Top Financial Risk Advisory Consultants Company — United Arab Emirates (2026)"
          width={80}
          height={80}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain"
        />
      </a>
      <a
        href={CLUTCH_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Clutch Top Financial Forecast Consultants — UAE 2026 (Opens Clutch profile)"
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/95 border border-[#c5a059]/40 hover:border-[#c5a059] hover:-translate-y-0.5 p-1.5 flex items-center justify-center shadow-xs transition-all"
      >
        <img
          src="/awards/clutch-financial-forecast-2026.png"
          alt="Clutch Top Financial Forecast Consultants Company — United Arab Emirates (2026)"
          width={80}
          height={80}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain"
        />
      </a>
    </div>
  );
};

export default ClutchAwardBadge;
