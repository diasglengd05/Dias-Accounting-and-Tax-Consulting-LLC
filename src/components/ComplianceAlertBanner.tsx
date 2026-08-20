import React, { useState } from "react";
import { AlertTriangle, ArrowRight, X, ShieldCheck, Clock } from "lucide-react";

interface ComplianceAlertBannerProps {
  onOpenAudit: () => void;
}

export default function ComplianceAlertBanner({ onOpenAudit }: ComplianceAlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border-b border-gold-500/30 text-white px-4 py-2.5 sm:py-2 relative z-50 text-xs shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Left Side: Deadline Alert */}
        <div className="flex items-center gap-2 text-center sm:text-left flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold shrink-0 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            FTA Compliance Alert
          </span>
          <span className="text-slate-200 text-xs">
            <strong className="text-white font-semibold">2026 UAE Corporate Tax Deadlines:</strong> Avoid mandatory <span className="text-red-400 font-bold">AED 10,000+</span> late filing penalties.
          </span>
        </div>

        {/* Right Side: Quick Action & Close */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAudit}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-navy-950 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Free 60s Risk Audit</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-gold-400 underline underline-offset-2 transition-colors ml-1"
          >
            <Clock className="w-3 h-3" />
            <span>Book Free 15-Min Call</span>
          </a>

          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors ml-1"
            aria-label="Dismiss alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
