import React, { useEffect } from "react";
import { Award } from "lucide-react";

declare global {
  interface Window {
    CLUTCHCO?: {
      Init?: () => void;
    };
  }
}

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
    <div className="inline-flex items-center gap-2 rounded-lg bg-[#0d1b2a] border border-[#c5a059]/35 px-3 py-1.5 text-xs font-semibold text-white">
      <Award className="w-3.5 h-3.5 text-[#c5a059] shrink-0" aria-hidden="true" />
      <span>Clutch 2026 UAE Top Consultants</span>
      <span className="text-[#c5a059] tabular-nums">5.0 ★</span>
    </div>
  );
};

export const ClutchAwardBadge: React.FC = () => {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/95 border border-[#c5a059]/35 p-1.5 flex items-center justify-center shadow-xs">
        <img
          src="/awards/clutch-risk-advisory-2026.png"
          alt="Clutch Top Financial Risk Advisory Consultants Company — United Arab Emirates (2026)"
          width={80}
          height={80}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/95 border border-[#c5a059]/35 p-1.5 flex items-center justify-center shadow-xs">
        <img
          src="/awards/clutch-financial-forecast-2026.png"
          alt="Clutch Top Financial Forecast Consultants Company — United Arab Emirates (2026)"
          width={80}
          height={80}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default ClutchAwardBadge;
