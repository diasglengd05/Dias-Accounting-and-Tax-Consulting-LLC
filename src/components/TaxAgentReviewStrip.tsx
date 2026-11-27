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
      className={`bg-[#F8FAFC] border-t border-[#E2E8F0] py-5 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 text-center text-xs sm:text-sm text-[#475569]">
          <BadgeCheck
            className="w-4 h-4 text-[#1B4332] shrink-0"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            <span className="font-semibold text-[#0D1B2A]">
              Reviewed by Glen Dias, FTA-Registered Tax Agent
            </span>{" "}
            <span className="text-[#C5A059]" aria-hidden="true">·</span>{" "}
            <span>DiasUAE (Dias Accounting and Tax Consulting LLC)</span>{" "}
            <span className="text-[#C5A059]" aria-hidden="true">·</span>{" "}
            <span className="text-[#64748B]">Last Updated: November 2026</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TaxAgentReviewStrip;
