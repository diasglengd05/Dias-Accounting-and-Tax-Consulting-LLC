import React, { useEffect, useState } from "react";
import {
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Search,
  MessageCircle,
  Phone,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { faqsData } from "../data/staticData";

interface FaqsPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const FaqsPage: React.FC<FaqsPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(faqsData[0]?.id || null);

  useEffect(() => {
    document.title = "UAE Tax & Accounting FAQs | Dias Accounting Dubai";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const filteredFaqs = faqsData.filter((faq) => {
    return (
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <PageNavigation
        currentPath="/faqs"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-24 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-4">
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:underline cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">Frequently Asked Questions</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <HelpCircle className="w-3.5 h-3.5 text-gold-400" />
                <span>Authoritative Legal &amp; Accounting Guidance</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                UAE Corporate Tax, VAT &amp; Bookkeeping FAQs
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                Clear, definitive answers to the most common tax registration, 0% relief eligibility, audit filing, and penalty prevention questions faced by UAE businesses.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Type a question or topic (e.g. 9% threshold, SBR, audit)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Accordion Grid */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-gold-400/60 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                        {faq.category}
                      </span>
                      <h2 className="font-display text-base sm:text-lg font-bold text-navy-950">
                        {faq.question}
                      </h2>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-gold-600" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      <p className="whitespace-pre-line">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-navy-950 mb-1">
                No matching answers found
              </h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto mb-4">
                Ask our senior tax advisor directly for custom advice tailored to your company.
              </p>
              <button
                type="button"
                onClick={() => onNavigate("/contact")}
                className="bg-gold-500 text-navy-950 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-gold-400 cursor-pointer"
              >
                Ask Glen Dias Directly
              </button>
            </div>
          )}
        </section>

        {/* Still Have Questions Box */}
        <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-navy-950 to-navy-900 rounded-3xl p-8 sm:p-10 text-white border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-display text-xl font-bold">
                Have a specific tax scenario or deadline?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-md">
                Our FTA registered agents provide confidential 1-on-1 consultations via Zoom, phone, or in person in Dubai.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href="https://wa.me/971529226958"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Advisor (+971 52 922 6958)</span>
              </a>
              <button
                type="button"
                onClick={() => onNavigate("/contact")}
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-5 py-3 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Book Free Call
              </button>
            </div>
          </div>
        </section>
      </main>

      <PageFooter
        onNavigate={onNavigate}
        onOpenPrivacy={onOpenPrivacy}
        onOpenGooglePreferred={onOpenGooglePreferred}
      />
    </div>
  );
};

export default FaqsPage;
