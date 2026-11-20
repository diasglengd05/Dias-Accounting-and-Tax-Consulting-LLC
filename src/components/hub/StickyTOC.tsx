import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";

export interface TocItem {
  id: string;
  label: string;
}

interface StickyTOCProps {
  items: TocItem[];
  onBookConsultation: () => void;
  guidancePrompt?: string;
}

export const useActiveSection = (items: TocItem[]) => {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");

  useEffect(() => {
    if (typeof window === "undefined" || items.length === 0) return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-110px 0px -65% 0px",
        threshold: 0.05,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return { activeId, setActiveId };
};

export const MobileJumpBar: React.FC<{
  items: TocItem[];
  activeId: string;
  onJump: (id: string) => void;
}> = ({ items, activeId, onJump }) => {
  const [open, setOpen] = useState(false);
  const currentLabel = items.find((i) => i.id === activeId)?.label || items[0]?.label || "Jump to section";

  return (
    <div className="lg:hidden sticky top-[72px] z-30 bg-[#FFFFFF]/95 backdrop-blur border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="w-full min-h-[48px] py-2.5 flex items-center justify-between gap-3 text-left cursor-pointer"
        >
          <span className="text-xs font-semibold text-[#475569] shrink-0">Jump to section:</span>
          <span className="text-sm font-semibold text-[#0D1B2A] truncate flex-1">{currentLabel}</span>
          <ChevronDown
            className={`w-4 h-4 text-[#475569] shrink-0 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <nav
            aria-label="Jump to section"
            className="pb-3 pt-1 border-t border-[#E2E8F0] flex flex-col gap-0.5"
          >
            {items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onJump(item.id);
                    setOpen(false);
                  }}
                  className={`min-h-[44px] px-3 py-2 text-left text-sm rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#F8FAFC] text-[#0D1B2A] font-semibold border-l-2 border-[#C5A059]"
                      : "text-[#475569] hover:text-[#0D1B2A]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};

export const StickyTOC: React.FC<StickyTOCProps & { activeId: string; onJump: (id: string) => void }> = ({
  items,
  activeId,
  onJump,
  onBookConsultation,
  guidancePrompt = "Speak directly with an FTA-registered specialist for tailored UAE compliance advice.",
}) => {
  return (
    <aside className="hidden lg:block lg:sticky lg:top-24 space-y-6">
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#475569] mb-4">
          On This Page
        </p>
        <nav aria-label="Table of contents" className="border-l border-[#E2E8F0] space-y-1">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onJump(item.id)}
                className={`w-full text-left pl-4 pr-2 py-2 text-sm transition-colors cursor-pointer -ml-[1px] border-l-2 ${
                  isActive
                    ? "border-[#C5A059] text-[#0D1B2A] font-semibold"
                    : "border-transparent text-[#475569] hover:text-[#0D1B2A] hover:border-slate-300"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quiet Single Consultation Card */}
      <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-6 space-y-4">
        <div className="flex items-center gap-2 text-[#1B4332]">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <p className="font-display font-bold text-sm text-[#0D1B2A]">Need FTA Guidance?</p>
        </div>
        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">{guidancePrompt}</p>
        <button
          type="button"
          onClick={onBookConsultation}
          className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
        >
          <span>Book Consultation</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </aside>
  );
};

export default StickyTOC;
