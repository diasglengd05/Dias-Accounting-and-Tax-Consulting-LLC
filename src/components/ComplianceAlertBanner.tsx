import React, { useState } from "react";
import { Calculator, X } from "lucide-react";

interface ComplianceAlertBannerProps {
  onOpenAudit?: () => void;
  onNavigate?: (path: string) => void;
}

export default function ComplianceAlertBanner({ onNavigate }: ComplianceAlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate("/uae-tax-planner");
    }
  };

  return (
    <aside
      aria-label="2026 UAE Tax Calculator Announcement"
      className="bg-[#0d1b2a] border-b border-[#c5a059]/45 text-white px-4 py-2 relative z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 pr-7">
        <a
          href="/uae-tax-planner"
          onClick={handleClick}
          className="inline-flex items-center justify-center gap-2 text-[11px] sm:text-xs font-semibold tracking-wide text-[#ffffff] hover:text-[#dec18c] transition-colors text-center"
        >
          <Calculator className="w-3.5 h-3.5 text-[#c5a059] shrink-0 hidden sm:inline-block" />
          <span>
            Free 2026 UAE Corporate Tax &amp; 5% VAT Calculator{" "}
            <span className="text-[#c5a059] font-bold">→ Calculate Your Tax in 30 Seconds</span>
          </span>
        </a>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
