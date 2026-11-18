import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export type QuoteJurisdiction = "shams-fz" | "dubai-mainland" | "difc-dtec";
export type QuoteEntityStage = "startup" | "growing" | "established";
export type QuoteServiceId =
  | "bookkeeping"
  | "vat"
  | "corporate-tax"
  | "dividend-audit"
  | "backlog";

interface ScopeInstantQuoteBuilderProps {
  id?: string;
  onNavigate: (path: string) => void;
  onSelectScopeForBooking?: (summaryLabel: string) => void;
}

const JURISDICTIONS: { id: QuoteJurisdiction; label: string; note: string }[] = [
  {
    id: "shams-fz",
    label: "SHAMS / Free Zone",
    note: "0% QFZP or AED 3M SBR review + annual audit coordination",
  },
  {
    id: "dubai-mainland",
    label: "Dubai Mainland",
    note: "DET LLC compliance · 0% up to AED 375k / 9% Corporate Tax + VAT",
  },
  {
    id: "difc-dtec",
    label: "DIFC / DTEC",
    note: "Common-law IFRS statements, 0% QFZP substance & statutory audits",
  },
];

const ENTITY_STAGES: { id: QuoteEntityStage; label: string; sub: string }[] = [
  {
    id: "startup",
    label: "New Startup / Pre-Revenue",
    sub: "New trade license, opening balances & initial EmaraTax setup",
  },
  {
    id: "growing",
    label: "Growing SME",
    sub: "Active invoicing, VAT 201 returns & monthly reconciliations",
  },
  {
    id: "established",
    label: "Established / Audited Entity",
    sub: "Multi-stream revenue, statutory audits & group reporting",
  },
];

const SERVICES: { id: QuoteServiceId; label: string; tag: string }[] = [
  {
    id: "bookkeeping",
    label: "Monthly IFRS Bookkeeping",
    tag: "P&L, Balance Sheet & Cash Flow",
  },
  {
    id: "vat",
    label: "5% UAE VAT Registration & Form 201",
    tag: "Quarterly EmaraTax Filings",
  },
  {
    id: "corporate-tax",
    label: "9% Corporate Tax & EmaraTax Filing",
    tag: "0% SBR / QFZP Assessment",
  },
  {
    id: "dividend-audit",
    label: "Statutory Dividend Audit",
    tag: "Interim & Final Solvency Audit",
  },
  {
    id: "backlog",
    label: "Backlog Bookkeeping Cleanup",
    tag: "Historical Ledger Catch-Up",
  },
];

const WhatsAppGlyph: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.156 5.281-1.375c1.469.797 3.109 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.531.078-1.203.109-1.938-.125-.453-.141-1.031-.328-1.766-.656-3.094-1.344-5.109-4.469-5.266-4.672-.156-.203-1.266-1.688-1.266-3.219 0-1.531.797-2.281 1.078-2.594.281-.313.625-.391.828-.391.203 0 .422.016.609.016.188 0 .453-.078.703.531.266.625.891 2.188.969 2.344.078.156.125.344.031.547-.094.203-.156.344-.313.516-.156.172-.328.391-.469.516-.156.141-.313.297-.141.609.172.313.781 1.297 1.672 2.094 1.156 1.031 2.125 1.359 2.438 1.516.313.156.5.125.688-.078.188-.203.797-.922 1.016-1.234.219-.313.422-.266.719-.156.297.109 1.875.891 2.203 1.047.328.156.547.234.625.375.078.141.078.813-.172 1.516z" />
  </svg>
);

export const ScopeInstantQuoteBuilder: React.FC<ScopeInstantQuoteBuilderProps> = ({
  id = "instant-quote",
  onNavigate,
  onSelectScopeForBooking,
}) => {
  const [jurisdiction, setJurisdiction] = useState<QuoteJurisdiction>("shams-fz");
  const [stage, setStage] = useState<QuoteEntityStage>("growing");
  const [selectedServices, setSelectedServices] = useState<QuoteServiceId[]>([
    "bookkeeping",
    "vat",
    "corporate-tax",
  ]);

  const toggleService = (serviceId: QuoteServiceId) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        // Keep at least one service selected so the scope never reads empty
        return prev.length > 1 ? prev.filter((item) => item !== serviceId) : prev;
      }
      return [...prev, serviceId];
    });
  };

  const jurisdictionObj =
    JURISDICTIONS.find((j) => j.id === jurisdiction) || JURISDICTIONS[0];
  const stageObj = ENTITY_STAGES.find((s) => s.id === stage) || ENTITY_STAGES[1];
  const activeServiceObjs = SERVICES.filter((s) => selectedServices.includes(s.id));

  // Match strictly to existing pricing tiers without inventing new pricing figures
  const recommendation = useMemo(() => {
    const hasVat = selectedServices.includes("vat");
    const hasCt = selectedServices.includes("corporate-tax");
    const hasDividend = selectedServices.includes("dividend-audit");
    const hasBacklog = selectedServices.includes("backlog");
    const hasOnlyBacklog = hasBacklog && selectedServices.length === 1;

    if (hasOnlyBacklog) {
      return {
        tierName: "Backlog Catch-Up Package",
        priceDisplay: "From AED 2,500",
        billingNote: "One-time fixed fee per fiscal year + 5% VAT",
        rationale:
          "Complete historical ledger reconstruction, bank reconciliations, IFRS trial balance, and overdue EmaraTax filing.",
        tierKey: "Backlog Catch-Up (From AED 2,500)",
      };
    }

    if (jurisdiction === "difc-dtec" || hasDividend || stage === "established") {
      return {
        tierName:
          jurisdiction === "difc-dtec" || hasDividend
            ? "Enterprise & DIFC / Audit Advisory"
            : "Enterprise & CFO Advisory",
        priceDisplay: "From AED 1,000/month",
        billingNote:
          "AED 1,000/mo billed annually (AED 1,250/mo monthly) · Full group/DIFC scope up to AED 2,500/mo or Custom Quote",
        rationale: hasBacklog
          ? "Pairs Enterprise CFO & audit readiness with a fixed-fee Backlog Catch-Up (from AED 2,500/FY)."
          : "Covers IFRS monthly close, 0% QFZP substance compliance, external audit facilitation & statutory dividend checks.",
        tierKey: "Enterprise & CFO Advisory (From AED 1,000/mo)",
      };
    }

    if (stage === "growing" || hasVat || (hasCt && selectedServices.length >= 2)) {
      return {
        tierName: "Corporate Growth Retainer",
        priceDisplay: "From AED 600/month",
        billingNote: "AED 600/mo billed annually (AED 750/mo monthly) + 5% VAT",
        rationale: hasBacklog
          ? "Most popular full-compliance package paired with Backlog Catch-Up cleanup (from AED 2,500/FY)."
          : "Includes monthly IFRS bookkeeping, quarterly VAT Form 201 returns, and annual 9% Corporate Tax EmaraTax filing.",
        tierKey: "Corporate Growth (From AED 600/mo)",
      };
    }

    return {
      tierName: "Business Starter Retainer",
      priceDisplay: "From AED 400/month",
      billingNote: "AED 400/mo billed annually (AED 500/mo monthly) + 5% VAT",
      rationale: hasBacklog
        ? "Essential double-entry IFRS bookkeeping + Backlog Catch-Up (from AED 2,500/FY) for new & micro-SMEs."
        : "Essential monthly double-entry IFRS bookkeeping, bank reconciliations, and annual 0% SBR Corporate Tax compliance.",
      tierKey: "Business Starter (From AED 400/mo)",
    };
  }, [jurisdiction, stage, selectedServices]);

  const scopeSummaryText = useMemo(() => {
    const serviceNames = activeServiceObjs.map((s) => s.label).join(", ");
    return `${recommendation.tierKey} | ${jurisdictionObj.label} | ${stageObj.label} | Services: ${serviceNames}`;
  }, [recommendation.tierKey, jurisdictionObj.label, stageObj.label, activeServiceObjs]);

  const handleGetQuoteClick = () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("dias_selected_service", scopeSummaryText);
        sessionStorage.setItem(
          "dias_quote_scope",
          JSON.stringify({
            jurisdiction: jurisdictionObj.label,
            stage: stageObj.label,
            services: activeServiceObjs.map((s) => s.label),
            recommendedTier: recommendation.tierName,
            priceDisplay: recommendation.priceDisplay,
          })
        );
      } catch {
        // Ignore storage errors in private mode
      }
    }

    if (onSelectScopeForBooking) {
      onSelectScopeForBooking(scopeSummaryText);
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    const quoteEl = document.getElementById("get-quote");
    if (quoteEl) {
      quoteEl.scrollIntoView({ behavior: "smooth" });
      return;
    }

    onNavigate("/#contact");
  };

  const whatsappUrl = useMemo(() => {
    const servicesList = activeServiceObjs.map((s) => `• ${s.label}`).join("\n");
    const msg = `Hi Dias Accounting, I used the Instant Scope & Quote Builder:\n• Jurisdiction: ${jurisdictionObj.label}\n• Entity Stage: ${stageObj.label}\n• Recommended Package: ${recommendation.tierName} (${recommendation.priceDisplay})\n• Services Needed:\n${servicesList}\n\nPlease share a fixed-fee engagement proposal.`;
    return `https://wa.me/971529226958?text=${encodeURIComponent(msg)}`;
  }, [activeServiceObjs, jurisdictionObj.label, stageObj.label, recommendation]);

  return (
    <section
      id={id}
      aria-labelledby="instant-quote-heading"
      className="bg-[#070d19] text-white py-16 sm:py-20 border-t border-[#c5a059]/30 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#c5a059]">
            <Layers className="w-4 h-4 text-[#c5a059]" />
            <span>INTERACTIVE SCOPE &amp; FIXED-FEE SELECTOR</span>
          </div>
          <h2
            id="instant-quote-heading"
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Match Your UAE Entity to the Right Fixed-Fee Retainer in 30 Seconds
          </h2>
          <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
            Select your jurisdiction, growth stage, and required FTA deliverables to preview your exact scope and
            lock in transparent pricing starting from AED 400/month.
          </p>
        </div>

        {/* Main Card Container (#0d1b2a + 1px solid #c5a059) */}
        <div className="bg-[#0d1b2a] border border-[#c5a059] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* LEFT COLUMN: Interactive Selectors */}
            <div className="lg:col-span-7 space-y-7">
              {/* 1. Jurisdiction */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#dec18c]">
                    1. Jurisdiction
                  </span>
                  <span className="text-[11px] text-[#cbd5e1] hidden sm:inline">
                    {jurisdictionObj.note}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {JURISDICTIONS.map((item) => {
                    const active = jurisdiction === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setJurisdiction(item.id)}
                        className={`px-4 py-3 rounded-xl text-left transition-all cursor-pointer border ${
                          active
                            ? "bg-[#c5a059] border-[#c5a059] text-[#070d19] shadow-md"
                            : "bg-[#070d19] border-white/15 text-white hover:border-[#c5a059]/60"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-display font-bold text-xs sm:text-sm">
                            {item.label}
                          </span>
                          <Building2
                            className={`w-4 h-4 shrink-0 ${
                              active ? "text-[#070d19]" : "text-[#c5a059]"
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Entity Stage */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#dec18c] block">
                  2. Entity Stage
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {ENTITY_STAGES.map((item) => {
                    const active = stage === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setStage(item.id)}
                        className={`p-3.5 rounded-xl text-left transition-all cursor-pointer border ${
                          active
                            ? "bg-[#c5a059]/15 border-[#c5a059] text-white"
                            : "bg-[#070d19] border-white/15 text-[#cbd5e1] hover:border-[#c5a059]/50 hover:text-white"
                        }`}
                      >
                        <span
                          className={`block font-display font-bold text-xs sm:text-sm ${
                            active ? "text-[#dec18c]" : "text-white"
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="block text-[11px] text-[#cbd5e1]/80 mt-1 leading-snug">
                          {item.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Services Needed (Multi-Select Checkboxes) */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#dec18c] block">
                  3. Services Needed (Select All That Apply)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SERVICES.map((service) => {
                    const checked = selectedServices.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        onClick={() => toggleService(service.id)}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          checked
                            ? "bg-[#070d19] border-[#c5a059] text-white"
                            : "bg-[#070d19]/60 border-white/10 text-[#cbd5e1] hover:border-white/30"
                        }`}
                      >
                        <span
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                            checked
                              ? "bg-[#c5a059] border-[#c5a059] text-[#070d19]"
                              : "bg-[#0d1b2a] border-white/25 text-transparent"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display font-semibold text-xs sm:text-sm text-white leading-snug">
                            {service.label}
                          </span>
                          <span className="block text-[11px] text-[#cbd5e1]/75 mt-0.5">
                            {service.tag}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Recommended Package & Conversion CTAs */}
            <div className="lg:col-span-5 bg-[#070d19] border border-[#c5a059]/60 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-widest text-[#c5a059]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>MATCHED SCOPE SUMMARY</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                    Zero Hidden Fees
                  </span>
                </div>

                <div>
                  <span className="text-xs text-[#cbd5e1] block">Recommended Retainer Tier</span>
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                    {recommendation.tierName}
                  </h3>
                  <div className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-[#c5a059] tabular-nums">
                    {recommendation.priceDisplay}
                  </div>
                  <p className="text-[11px] text-[#dec18c]/90 mt-1 leading-relaxed">
                    {recommendation.billingNote}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed bg-[#0d1b2a] border border-white/10 rounded-xl p-3.5">
                  {recommendation.rationale}
                </p>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#dec18c] block">
                    Selected Scope ({activeServiceObjs.length})
                  </span>
                  <ul className="space-y-1.5">
                    <li className="flex items-center gap-2 text-xs text-white">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                      <span>
                        <strong>Jurisdiction:</strong> {jurisdictionObj.label}
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-white">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                      <span>
                        <strong>Stage:</strong> {stageObj.label}
                      </span>
                    </li>
                    {activeServiceObjs.map((srv) => (
                      <li key={srv.id} className="flex items-center gap-2 text-xs text-[#cbd5e1]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{srv.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleGetQuoteClick}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#c5a059] hover:bg-[#dec18c] text-[#070d19] font-display font-extrabold text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/20 active:scale-[0.99]"
                >
                  <span>Get My Custom Fixed-Fee Quote</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl border border-[#c5a059]/60 hover:border-[#c5a059] hover:bg-[#c5a059]/10 text-[#dec18c] hover:text-white font-display font-semibold text-xs sm:text-sm transition-all inline-flex items-center justify-center gap-2"
                >
                  <WhatsAppGlyph className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Send Scope via WhatsApp (+971 52 922 6958)</span>
                </a>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#cbd5e1]/80 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                  <span>FTA-Registered Tax Agency · Written Fixed-Fee Proposal in 2 Hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScopeInstantQuoteBuilder;
