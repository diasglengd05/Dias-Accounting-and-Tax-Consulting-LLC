import React from "react";
import { ShieldCheck } from "lucide-react";

interface QuickSummaryBoxProps {
  children: React.ReactNode;
  label?: string;
  variant?: "dark" | "light";
  className?: string;
}

export const QuickSummaryBox: React.FC<QuickSummaryBoxProps> = ({
  children,
  label = "Quick Summary · Verified UAE Tax & Accounting Practice",
  variant = "light",
  className = "",
}) => {
  void variant;
  return (
    <aside
      aria-label="Quick Summary"
      className={`rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] border-l-[3px] border-l-[#C5A059] px-5 py-4 text-left rtl:text-right max-w-[68ch] shadow-[0_1px_3px_rgba(13,27,42,0.04)] ${className}`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#856422] mb-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-[#1B4332] shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <p className="text-[13.5px] sm:text-sm text-[#475569] leading-[1.65]">
        {children}
      </p>
    </aside>
  );
};

export default QuickSummaryBox;
