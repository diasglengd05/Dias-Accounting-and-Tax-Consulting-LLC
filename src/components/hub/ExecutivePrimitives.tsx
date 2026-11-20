import React, { useState } from "react";
import { ArrowRight, Calculator, Minus, Plus } from "lucide-react";

export interface ComplianceTableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  highlight?: boolean;
}

export interface ComplianceTableProps {
  columns: ComplianceTableColumn[];
  rows: Record<string, React.ReactNode>[];
  caption?: string;
}

export const ComplianceTable: React.FC<ComplianceTableProps> = ({
  columns,
  rows,
  caption,
}) => {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] overflow-hidden shadow-[0_6px_24px_-12px_rgba(13,27,42,0.06)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] text-left border-collapse text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="bg-[#0D1B2A] text-white">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`py-3.5 px-5 font-semibold text-xs sm:text-sm tracking-tight ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                        ? "text-center"
                        : "text-left"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {col.highlight && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {rows.map((row, idx) => (
              <tr key={idx} className="odd:bg-[#FFFFFF] even:bg-[#F8FAFC]">
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className={`py-3.5 px-5 align-top leading-relaxed tabular-nums ${
                      colIdx === 0 ? "font-semibold text-[#0D1B2A]" : "text-[#475569]"
                    } ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                          ? "text-center"
                          : "text-left"
                    }`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export interface ExecutiveCalloutProps {
  title: string;
  children: React.ReactNode;
  accent?: "gold" | "emerald";
}

export const ExecutiveCallout: React.FC<ExecutiveCalloutProps> = ({
  title,
  children,
  accent = "gold",
}) => {
  return (
    <aside
      className={`rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] border-l-[3px] p-5 sm:p-6 ${
        accent === "emerald" ? "border-l-[#1B4332]" : "border-l-[#C5A059]"
      }`}
    >
      <p className="font-display font-bold text-sm sm:text-base text-[#0D1B2A] mb-1.5">
        {title}
      </p>
      <div className="text-sm text-[#475569] leading-[1.65] max-w-[68ch] space-y-2">
        {children}
      </div>
    </aside>
  );
};

export interface AccordionItem {
  question: string;
  answer: React.ReactNode;
}

export interface ExecutiveAccordionProps {
  items: AccordionItem[];
  defaultOpenIndex?: number | null;
}

export const ExecutiveAccordion: React.FC<ExecutiveAccordionProps> = ({
  items,
  defaultOpenIndex = 0,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={item.question}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full min-h-[56px] py-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
            >
              <span className="font-semibold text-base text-[#0D1B2A] group-hover:text-[#1B4332] transition-colors leading-snug">
                {item.question}
              </span>
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[#475569] group-hover:text-[#0D1B2A] transition-colors"
                aria-hidden="true"
              >
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>
            {/* Keep content mounted in DOM for SEO indexing while collapsing smoothly */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
              aria-hidden={!isOpen}
            >
              <div className="overflow-hidden">
                <div className="pb-5 pr-6 text-sm sm:text-[15px] text-[#475569] leading-[1.65] max-w-[68ch]">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export interface CalculatorToolBridgeProps {
  title: string;
  description: string;
  ctaLabel: string;
  onAction: () => void;
}

export const CalculatorToolBridge: React.FC<CalculatorToolBridgeProps> = ({
  title,
  description,
  ctaLabel,
  onAction,
}) => {
  return (
    <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-7 shadow-[0_8px_28px_-14px_rgba(13,27,42,0.08)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#1B4332] shrink-0">
          <Calculator className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="font-display font-bold text-base text-[#0D1B2A]">{title}</p>
          <p className="text-sm text-[#475569] leading-relaxed max-w-[56ch]">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="w-full sm:w-auto shrink-0 min-h-[46px] px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
      >
        <span>{ctaLabel}</span>
        <ArrowRight className="w-4 h-4 shrink-0" />
      </button>
    </div>
  );
};

export interface ExecutiveClosingCtaProps {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  onCtaClick: () => void;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
}

export const ExecutiveClosingCta: React.FC<ExecutiveClosingCtaProps> = ({
  eyebrow,
  title,
  description,
  ctaLabel,
  onCtaClick,
  secondaryLabel,
  onSecondaryClick,
}) => {
  return (
    <section className="bg-[#FFFFFF] py-16 lg:py-20 border-t border-[#E2E8F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#0D1B2A] text-white px-6 py-10 sm:px-12 sm:py-14 shadow-[0_16px_44px_-16px_rgba(13,27,42,0.3)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#C5A059]">
              {eyebrow}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              {title}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-[1.65] max-w-[60ch]">
              {description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onCtaClick}
              className="min-h-[48px] px-7 py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#0D1B2A] text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
            {secondaryLabel && onSecondaryClick && (
              <button
                type="button"
                onClick={onSecondaryClick}
                className="min-h-[44px] px-3 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
