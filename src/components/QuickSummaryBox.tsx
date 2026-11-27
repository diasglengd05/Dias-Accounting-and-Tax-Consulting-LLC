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
  variant = "dark",
  className = "",
}) => {
  if (variant === "light") {
    return (
      <aside
        aria-label="Quick Summary"
        className={`rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] border-l-[3px] border-l-[#C5A059] px-5 py-4 text-left rtl:text-right max-w-[62ch] shadow-[0_1px_3px_rgba(13,27,42,0.04)] ${className}`}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9A742B] mb-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] shrink-0" aria-hidden="true" />
          <span>{label}</span>
        </div>
        <p className="text-[13.5px] sm:text-sm text-[#334155] leading-[1.65]">
          {children}
        </p>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Quick Summary"
      className={`rounded-xl bg-[#070d19] border border-[#c5a059]/35 border-l-4 border-l-[#c5a059] px-5 py-4 text-left rtl:text-right shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#c5a059] mb-1.5">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed">
        {children}
      </p>
    </aside>
  );
};

export default QuickSummaryBox;
