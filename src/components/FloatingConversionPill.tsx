import React from "react";
import { Calculator } from "lucide-react";

interface FloatingConversionPillProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const WhatsAppGlyph: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.156 5.281-1.375c1.469.797 3.109 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.531.078-1.203.109-1.938-.125-.453-.141-1.031-.328-1.766-.656-3.094-1.344-5.109-4.469-5.266-4.672-.156-.203-1.266-1.688-1.266-3.219 0-1.531.797-2.281 1.078-2.594.281-.313.625-.391.828-.391.203 0 .422.016.609.016.188 0 .453-.078.703.531.266.625.891 2.188.969 2.344.078.156.125.344.031.547-.094.203-.156.344-.313.516-.156.172-.328.391-.469.516-.156.141-.313.297-.141.609.172.313.781 1.297 1.672 2.094 1.156 1.031 2.125 1.359 2.438 1.516.313.156.5.125.688-.078.188-.203.797-.922 1.016-1.234.219-.313.422-.266.719-.156.297.109 1.875.891 2.203 1.047.328.156.547.234.625.375.078.141.078.813-.172 1.516z" />
  </svg>
);

export const FloatingConversionPill: React.FC<FloatingConversionPillProps> = ({
  currentPath,
  onNavigate,
}) => {
  const isHome = currentPath === "/" || currentPath === "";

  const handleCalculatorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate("/uae-tax-planner");
  };

  return (
    <div
      role="region"
      aria-label="Quick Tax Calculator and WhatsApp Advisor"
      className={`fixed right-3 sm:right-5 md:right-6 z-40 flex items-center gap-1.5 p-1.5 rounded-full bg-[#070d19]/95 backdrop-blur-md border border-[#c5a059]/60 shadow-[0_12px_32px_rgba(0,0,0,0.55)] ${
        isHome ? "bottom-[76px] md:bottom-6" : "bottom-5 md:bottom-6"
      }`}
    >
      <a
        href="/uae-tax-planner"
        onClick={handleCalculatorClick}
        className="inline-flex items-center gap-1.5 rounded-full bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-extrabold text-[11px] sm:text-xs px-3.5 py-2 whitespace-nowrap transition-colors cursor-pointer"
        aria-label="Open 2026 UAE Tax Calculator"
      >
        <Calculator className="w-3.5 h-3.5 shrink-0" />
        <span>2026 Tax Calculator</span>
      </a>

      <a
        href="https://wa.me/971529226958?text=Hi%20Dias%20Accounting%2C%20I%20would%20like%20a%20consultation%20for%20my%20UAE%20business."
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-[#0d1b2a] hover:bg-emerald-600 border border-[#c5a059]/35 hover:border-emerald-400 text-white font-display font-bold text-[11px] sm:text-xs px-3.5 py-2 whitespace-nowrap transition-colors"
        aria-label="Chat on WhatsApp with Dias Accounting"
      >
        <WhatsAppGlyph className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
};

export default FloatingConversionPill;
