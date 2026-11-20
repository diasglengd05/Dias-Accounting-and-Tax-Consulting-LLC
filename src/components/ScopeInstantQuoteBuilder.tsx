import React, { useMemo, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

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
    note: "0% QFZP or AED 3M SBR eligibility + audit readiness",
  },
  {
    id: "dubai-mainland",
    label: "Dubai Mainland",
    note: "DET LLC compliance · 0% to AED 375k / 9% Corporate Tax + VAT",
  },
  {
    id: "difc-dtec",
    label: "DIFC / DTEC",
    note: "Common-law IFRS reporting, 0% QFZP substance & statutory audits",
  },
];

const ENTITY_STAGES: { id: QuoteEntityStage; label: string; sub: string }[] = [
  {
    id: "startup",
    label: "New Startup",
    sub: "New trade license & initial EmaraTax setup",
  },
  {
    id: "growing",
    label: "Growing SME",
    sub: "Active invoicing, VAT returns & monthly close",
  },
  {
    id: "established",
    label: "Established / Audited",
    sub: "Statutory audits, multi-stream revenue or group reporting",
  },
];

const SERVICES: { id: QuoteServiceId; label: string }[] = [
  { id: "bookkeeping", label: "Monthly IFRS Bookkeeping" },
  { id: "vat", label: "5% VAT Registration & Form 201" },
  { id: "corporate-tax", label: "9% Corporate Tax & EmaraTax Filing" },
  { id: "dividend-audit", label: "Statutory Dividend Audit" },
  { id: "backlog", label: "Backlog Bookkeeping Catch-Up" },
];

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
        return prev.length > 1 ? prev.filter((item) => item !== serviceId) : prev;
      }
      return [...prev, serviceId];
    });
  };

  const jurisdictionObj =
    JURISDICTIONS.find((j) => j.id === jurisdiction) || JURISDICTIONS[0];
  const stageObj = ENTITY_STAGES.find((s) => s.id === stage) || ENTITY_STAGES[1];
  const activeServiceObjs = SERVICES.filter((s) => selectedServices.includes(s.id));

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
          "AED 1,000/mo billed annually (AED 1,250/mo monthly) + 5% VAT",
        rationale: hasBacklog
          ? "Pairs Enterprise CFO & audit readiness with fixed-fee Backlog Catch-Up (from AED 2,500/FY)."
          : "Covers IFRS monthly close, 0% QFZP substance compliance, external audit facilitation, and statutory dividend checks.",
        tierKey: "Enterprise & CFO Advisory (From AED 1,000/mo)",
      };
    }

    if (stage === "growing" || hasVat || (hasCt && selectedServices.length >= 2)) {
      return {
        tierName: "Corporate Growth Retainer",
        priceDisplay: "From AED 600/month",
        billingNote: "AED 600/mo billed annually (AED 750/mo monthly) + 5% VAT",
        rationale: hasBacklog
          ? "Full compliance retainer paired with fixed-fee Backlog Catch-Up cleanup (from AED 2,500/FY)."
          : "Includes monthly IFRS bookkeeping, quarterly VAT Form 201 returns, and annual 9% Corporate Tax EmaraTax filing.",
        tierKey: "Corporate Growth (From AED 600/mo)",
      };
    }

    return {
      tierName: "Business Starter Retainer",
      priceDisplay: "From AED 400/month",
      billingNote: "AED 400/mo billed annually (AED 500/mo monthly) + 5% VAT",
      rationale: hasBacklog
        ? "Essential double-entry IFRS bookkeeping plus Backlog Catch-Up (from AED 2,500/FY)."
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
      } catch {
        // Ignore storage restrictions
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

  return (
    <section
      id={id}
      aria-labelledby="instant-quote-heading"
      className="bg-slate-50 py-20 lg:py-24 border-t border-slate-200 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 space-y-3">
          <h2
            id="instant-quote-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          >
            Not sure which package fits your company?
          </h2>
          <p className="text-base text-slate-600 leading-[1.6] max-w-[60ch]">
            Select your jurisdiction, stage, and compliance deliverables below to match your business to the right fixed-fee tier.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Step-by-Step Controls */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1 */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <span className="text-sm font-semibold text-slate-900">
                    1. Select your jurisdiction
                  </span>
                  <span className="text-xs text-slate-500">{jurisdictionObj.note}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {JURISDICTIONS.map((item) => {
                    const active = jurisdiction === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setJurisdiction(item.id)}
                        className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all cursor-pointer border ${
                          active
                            ? "bg-emerald-50 border-emerald-700 text-emerald-900 font-semibold"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-3">
                <span className="text-sm font-semibold text-slate-900 block">
                  2. Current business stage
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
                            ? "bg-emerald-50 border-emerald-700"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span
                          className={`block text-sm font-semibold ${
                            active ? "text-emerald-900" : "text-slate-900"
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="block text-xs text-slate-500 mt-1 leading-snug">
                          {item.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-3">
                <span className="text-sm font-semibold text-slate-900 block">
                  3. Required deliverables
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                          checked
                            ? "bg-emerald-50/70 border-emerald-700 text-slate-900 font-medium"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                            checked
                              ? "bg-emerald-700 border-emerald-700 text-white"
                              : "bg-white border-slate-300 text-transparent"
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                        <span className="leading-snug">{service.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Matched Scope Summary */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6">
              <div className="space-y-2 pb-5 border-b border-slate-200">
                <span className="text-xs font-medium text-emerald-700 block">
                  Recommended match
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {recommendation.tierName}
                </h3>
                <div className="text-3xl font-bold text-slate-900 tabular-nums pt-1">
                  {recommendation.priceDisplay}
                </div>
                <p className="text-xs text-slate-500">{recommendation.billingNote}</p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {recommendation.rationale}
              </p>

              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{jurisdictionObj.label}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{stageObj.label}</span>
                </li>
                {activeServiceObjs.map((srv) => (
                  <li key={srv.id} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{srv.label}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleGetQuoteClick}
                  className="w-full py-3.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span>Request Fixed-Fee Proposal</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <p className="text-xs text-center text-slate-500">
                  Written scope &amp; fixed quote within 2 business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScopeInstantQuoteBuilder;
