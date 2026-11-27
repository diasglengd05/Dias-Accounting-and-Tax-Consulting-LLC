import React from "react";
import { BadgeCheck } from "lucide-react";

interface TaxAgentReviewStripProps {
  className?: string;
}

export const TaxAgentReviewStrip: React.FC<TaxAgentReviewStripProps> = ({
  className = "",
}) => {
  return (
    <section
      aria-label="Tax Agent Verification"
      className={`bg-[#070d19] border-t border-[#c5a059]/35 py-5 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 text-center text-xs sm:text-sm text-slate-200">
          <BadgeCheck
            className="w-4 h-4 text-[#c5a059] shrink-0"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            <span className="font-semibold text-white">
              Reviewed by Glen Dias, FTA-Registered Tax Agent
            </span>{" "}
            <span className="text-[#c5a059]" aria-hidden="true">·</span>{" "}
            <span>DiasUAE (Dias Accounting and Tax Consulting LLC)</span>{" "}
            <span className="text-[#c5a059]" aria-hidden="true">·</span>{" "}
            <span className="text-slate-300">Last Updated: November 2026</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TaxAgentReviewStrip;
