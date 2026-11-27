import React, { useMemo, useState } from "react";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";

export const QUOTE_JURISDICTIONS = [
  "Dubai Mainland",
  "DIFC",
  "DTEC / IFZA",
  "SHAMS",
  "DMCC / Other Free Zone",
] as const;

export const QUOTE_SERVICES = [
  "Monthly Accounting from AED 400/mo",
  "Dividends Audit",
  "2026 Corporate Tax Filing / Waiver",
  "5% VAT Compliance",
  "Company Setup",
] as const;

export type QuoteJurisdiction = (typeof QUOTE_JURISDICTIONS)[number];
export type QuoteService = (typeof QUOTE_SERVICES)[number];

interface SameDayQuoteBoxProps {
  defaultJurisdiction?: QuoteJurisdiction;
  defaultService?: QuoteService;
  idPrefix?: string;
  className?: string;
}

export const SameDayQuoteBox: React.FC<SameDayQuoteBoxProps> = ({
  defaultJurisdiction = "Dubai Mainland",
  defaultService = "Monthly Accounting from AED 400/mo",
  idPrefix = "quote",
  className = "",
}) => {
  const [name, setName] = useState("");
  const [jurisdiction, setJurisdiction] = useState<QuoteJurisdiction>(defaultJurisdiction);
  const [service, setService] = useState<QuoteService>(defaultService);

  const whatsappUrl = useMemo(() => {
    const cleanName = name.trim();
    const intro = cleanName
      ? `Hi Dias Accounting, my name is ${cleanName}.`
      : "Hi Dias Accounting,";
    const message = `${intro} I would like a same-day fixed fee quote and free 15-min Tax Agent review.\n\n• Company Jurisdiction: ${jurisdiction}\n• Service Needed: ${service}\n\nPlease share your fixed-fee proposal.`;
    return `https://wa.me/971529226958?text=${encodeURIComponent(message)}`;
  }, [name, jurisdiction, service]);

  return (
    <div
      className={`rounded-2xl bg-white border border-[#E2E8F0] p-5 sm:p-6 lg:p-7 text-[#0D1B2A] shadow-[0_8px_28px_-12px_rgba(13,27,42,0.08)] ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2 h-2 rounded-full bg-[#C5A059] shrink-0"
            aria-hidden="true"
          />
          <h2 className="font-display text-base sm:text-lg font-bold text-[#0D1B2A] tracking-tight">
            Get a Same-Day Fixed Fee Quote (Free 15-Min Tax Agent Review)
          </h2>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#856422] shrink-0">
          1-Tap WhatsApp Dispatch
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
        {/* Field 1: Your Name */}
        <div className="lg:col-span-3">
          <label
            htmlFor={`${idPrefix}-name`}
            className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1.5"
          >
            Your Name
          </label>
          <input
            id={`${idPrefix}-name`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            autoComplete="name"
            className="w-full h-11 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#1B4332] focus:bg-white focus:outline-none px-3.5 text-sm text-[#0D1B2A] placeholder:text-slate-400 transition-colors"
          />
        </div>

        {/* Field 2: Company Jurisdiction */}
        <div className="lg:col-span-3">
          <label
            htmlFor={`${idPrefix}-jurisdiction`}
            className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1.5"
          >
            Company Jurisdiction
          </label>
          <select
            id={`${idPrefix}-jurisdiction`}
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value as QuoteJurisdiction)}
            className="w-full h-11 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#1B4332] focus:bg-white focus:outline-none px-3 text-sm text-[#0D1B2A] transition-colors cursor-pointer"
          >
            {QUOTE_JURISDICTIONS.map((item) => (
              <option key={item} value={item} className="bg-white text-[#0D1B2A]">
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Field 3: Service Needed */}
        <div className="sm:col-span-2 lg:col-span-3">
          <label
            htmlFor={`${idPrefix}-service`}
            className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1.5"
          >
            Service Needed
          </label>
          <select
            id={`${idPrefix}-service`}
            value={service}
            onChange={(e) => setService(e.target.value as QuoteService)}
            className="w-full h-11 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#1B4332] focus:bg-white focus:outline-none px-3 text-sm text-[#0D1B2A] transition-colors cursor-pointer"
          >
            {QUOTE_SERVICES.map((item) => (
              <option key={item} value={item} className="bg-white text-[#0D1B2A]">
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* CTA Button */}
        <div className="sm:col-span-2 lg:col-span-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white font-semibold text-sm px-4 inline-flex items-center justify-center gap-2 transition-colors shadow-xs whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Get Instant Quote on WhatsApp</span>
            <ArrowRight className="w-4 h-4 shrink-0 hidden xl:inline" />
          </a>
        </div>
      </div>

      {/* 1-Line Trust Strip */}
      <div className="mt-4 pt-3.5 border-t border-[#E2E8F0] flex items-center justify-center sm:justify-start gap-2 text-xs text-[#475569]">
        <ShieldCheck className="w-4 h-4 text-[#1B4332] shrink-0" aria-hidden="true" />
        <p className="leading-snug">
          FTA-Registered Tax Agent Glen Dias ·{" "}
          <span className="text-[#0D1B2A] font-semibold">5.0★ Google (48 Reviews)</span> ·{" "}
          <span className="text-[#856422] font-semibold">2x Clutch UAE Leader 2026</span>
        </p>
      </div>
    </div>
  );
};

export default SameDayQuoteBox;
