import React, { useEffect, useState, useMemo } from "react";
import {
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Search,
  MessageCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";

interface FaqsPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

interface StructuredFaq {
  id: string;
  category: "Company Formation & Banking" | "Corporate Tax" | "VAT" | "Bookkeeping" | "Pricing" | "Getting Started";
  question: string;
  answer: string;
}

export const FaqsPage: React.FC<FaqsPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<string | null>("cf-1");

  const faqs: StructuredFaq[] = [
    // 1. Company Formation & Banking (From Today's Official Broadcast & Carousel)
    {
      id: "cf-1",
      category: "Company Formation & Banking",
      question: "How long does company formation take in Dubai and the UAE?",
      answer: "With Dias Accounting, digital trade license issuance takes 3 to 5 business days for Free Zones (such as SHAMS, DMCC, or DTEC) and 5 to 7 business days for Dubai Mainland (DET). Total completion, including establishment card, investor residency visa, and corporate bank account pre-approval, typically concludes within 10 to 14 business days.",
    },
    {
      id: "cf-2",
      category: "Company Formation & Banking",
      question: "Can foreign nationals own 100% of a Dubai Mainland company in 2026?",
      answer: "Yes. Following amendments to Federal Decree-Law No. 32 of 2021 on Commercial Companies, 100% foreign ownership is permitted across over 1,000 commercial and industrial mainland activities in Dubai, eliminating the historic requirement for a 51% local Emirati partner.",
    },
    {
      id: "cf-3",
      category: "Company Formation & Banking",
      question: "When must a newly incorporated UAE company register for Corporate Tax?",
      answer: "Under Federal Tax Authority Cabinet Decision No. 75 of 2023, juridical persons incorporated on or after March 1, 2024 must submit their Corporate Tax registration application within three (3) months from the date of incorporation or establishment. Failure to do so incurs an automatic AED 10,000 administrative penalty.",
    },
    {
      id: "cf-4",
      category: "Company Formation & Banking",
      question: "Why do new UAE companies struggle with corporate bank account opening, and how does Dias UAE secure priority approvals?",
      answer: "Central Bank of the UAE Anti-Money Laundering (AML) regulations require comprehensive proof of business substance, verified source-of-wealth documentation, customer/supplier counterpart contracts, and realistic cash-flow projections. Without professional financial structuring, DIY applications often face months of delays or rejection. Dias Accounting prepares bank-grade compliance dossiers to secure fast-track approvals with tier-one UAE commercial and digital banks (Emirates NBD, Wio Bank, Mashreq, FAB).",
    },
    {
      id: "cf-5",
      category: "Company Formation & Banking",
      question: "What is the difference between Dubai Mainland (DET) and Free Zone (SHAMS, DMCC) trade licenses?",
      answer: "Dubai Mainland licenses allow unrestricted commercial trading across all 7 Emirates and eligibility to bid on lucrative UAE government tenders. Free Zone licenses offer 100% foreign ownership and potential 0% Corporate Tax on Qualifying Income (QFZP), but require an onshore distributor or commercial branch to retail physical goods directly into mainland UAE.",
    },

    // 2. Corporate Tax
    {
      id: "ct-1",
      category: "Corporate Tax",
      question: "Who is subject to UAE Corporate Tax, and what is the rate?",
      answer: "Effective for financial years starting on or after June 1, 2023, UAE Corporate Tax applies to all businesses and commercial activities conducted by legal entities (LLCs, PJSCs, PSCs) and sole establishments. The standard rate is 0% on taxable net profit up to AED 375,000, and 9% on taxable net profit exceeding AED 375,000. All businesses must register on the EmaraTax portal regardless of whether their profit exceeds the threshold.",
    },
    {
      id: "ct-2",
      category: "Corporate Tax",
      question: "What is Small Business Relief (SBR) and has it been extended through 2029?",
      answer: "Under UAE Ministerial Decision No. 73 of 2023 and Cabinet extensions through December 31, 2029, UAE resident taxable persons with gross business revenue of AED 3,000,000 or less in a given tax period can elect for Small Business Relief. Under SBR, your net taxable income is treated as AED 0, resulting in zero corporate tax liability. However, mandatory Corporate Tax registration and timely annual filing remain legally enforceable.",
    },
    {
      id: "ct-3",
      category: "Corporate Tax",
      question: "Are UAE Free Zone companies completely exempt from Corporate Tax?",
      answer: "No. 100% of UAE Free Zone companies are legally required to register for Corporate Tax and file an annual tax return. To benefit from 0% Corporate Tax on Qualifying Income (QFZP status), you must maintain adequate economic substance in the Free Zone, derive qualifying income, obtain audited accounts, and comply with transfer pricing rules.",
    },
    {
      id: "ct-4",
      category: "Corporate Tax",
      question: "What is the penalty for missing the Corporate Tax registration deadline?",
      answer: "Under Cabinet Decision No. 75 of 2023, the Federal Tax Authority (FTA) enforces a mandatory administrative fine of AED 10,000 for failing to submit a Corporate Tax registration application within the designated timeframe.",
    },
    {
      id: "ct-5",
      category: "Corporate Tax",
      question: "What is the UAE E-Invoicing mandate (Peppol 5-corner model) and who does it affect?",
      answer: "The Ministry of Finance and Federal Tax Authority are implementing a decentralized Continuous Transaction Controls (CTC) Peppol 5-corner e-invoicing model for all B2B and B2G transactions. Businesses must generate structured XML/UBL digital invoices transmitted in real time through Accredited Service Providers (ASPs) to the central tax authority portal.",
    },

    // 3. VAT
    {
      id: "vat-1",
      category: "VAT",
      question: "When is a UAE business required to register for Value Added Tax (VAT)?",
      answer: "Mandatory VAT registration (5%) applies when a business's taxable supplies and imports exceed AED 375,000 over the preceding 12 months or are anticipated to exceed that amount in the next 30 days. Voluntary registration is available at AED 187,500. Operating above the mandatory threshold without registering attracts an immediate AED 10,000 penalty.",
    },
    {
      id: "vat-2",
      category: "VAT",
      question: "What is the filing deadline for UAE VAT 201 returns?",
      answer: "VAT returns and payments must be submitted electronically via the EmaraTax portal no later than the 28th day following the end of your assigned tax period (typically quarterly for most SMEs). Late filing or late payment incurs progressive percentage fines.",
    },
    {
      id: "vat-3",
      category: "VAT",
      question: "Can our business recover VAT paid on foreign software and cloud services?",
      answer: "Yes, under the Reverse Charge Mechanism (RCM), if foreign SaaS providers (e.g. AWS, Google, Microsoft, Adobe) do not charge UAE VAT directly, you declare the 5% output tax and simultaneously claim the corresponding 5% input tax recovery on your return, assuming the software is used for taxable business purposes.",
    },

    // 4. Bookkeeping & Audit
    {
      id: "bk-1",
      category: "Bookkeeping",
      question: "Is bookkeeping mandatory for UAE companies even if they make no profit?",
      answer: "Yes. Under both UAE Commercial Companies Law (Federal Decree-Law No. 32 of 2021) and the Tax Procedures Law, all businesses must keep proper, audited, or double-entry financial accounting records for a minimum of 5 years (and 7 years for corporate tax records). Failure to keep records attracts substantial FTA fines.",
    },
    {
      id: "bk-2",
      category: "Bookkeeping",
      question: "What is Backlog Bookkeeping and how quickly can Dias clean up our past books?",
      answer: "Backlog Bookkeeping involves extracting past bank statements, sales receipts, vendor invoices, and card statements for months or years where books were not maintained. Dias reconstructs your ledgers, reconciles balances, and delivers audit-ready financial statements within 5 to 7 business days.",
    },
    {
      id: "bk-3",
      category: "Bookkeeping",
      question: "Do UAE companies require an external audit to distribute dividends to shareholders?",
      answer: "Under Federal Decree-Law No. 32 of 2021 (Commercial Companies Law), dividend distributions must be made solely out of realized distributable net profits verified by balance sheets and profit & loss statements. Distributing dividends without proper accounting ledgers or while in negative equity violates statutory director fiduciary duties.",
    },
    {
      id: "bk-4",
      category: "Bookkeeping",
      question: "Which accounting software do you support?",
      answer: "We support and integrate with all major cloud accounting software, including Zoho Books, QuickBooks Online, Xero, and Wafeq. If you do not have software yet, we set up your chart of accounts and invoicing templates as part of our onboarding.",
    },

    // 5. Pricing
    {
      id: "pr-1",
      category: "Pricing",
      question: "How do your fixed-fee accounting packages work?",
      answer: "We offer transparent fixed-fee monthly packages starting at AED 500/month. There are no hidden fees, unexpected hourly invoices, or transaction surcharges. Final pricing depends on your business activity, transaction volume, and filing requirements. Book a free consultation on WhatsApp (+971 52 922 6958) for an accurate quote.",
    },
    {
      id: "pr-2",
      category: "Pricing",
      question: "Are there any hidden cancellation fees or long-term lock-in contracts?",
      answer: "No. Our monthly packages operate with total transparency. We believe in earning your trust month after month through impeccable service quality, proactive communication, and zero-penalty track records.",
    },

    // 6. Getting Started
    {
      id: "gs-1",
      category: "Getting Started",
      question: "How do we get started with Dias Accounting?",
      answer: "Getting started takes just 3 simple steps: 1) Connect on WhatsApp (+971 52 922 6958) or schedule a call; 2) Share your trade license and recent bank statements for a quick diagnostic; 3) We set up your compliance schedule and assign your dedicated senior accountant.",
    },
    {
      id: "gs-2",
      category: "Getting Started",
      question: "What documents do we need to provide to begin our tax compliance?",
      answer: "To start, we typically require: a copy of your valid Trade License, Memorandum of Association (MOA), passport and Emirates ID of authorized signatories, recent 12-month bank statements, and any existing FTA login details or VAT/Corporate Tax TRN certificates.",
    },
  ];

  const categoryList = [
    { id: "all", label: "All Questions" },
    { id: "Company Formation & Banking", label: "Company Formation & Banking" },
    { id: "Corporate Tax", label: "Corporate Tax" },
    { id: "VAT", label: "VAT" },
    { id: "Bookkeeping", label: "Bookkeeping" },
    { id: "Pricing", label: "Pricing" },
    { id: "Getting Started", label: "Getting Started" },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchQuery, selectedCategory]);

  // Generate FAQPage JSON-LD Schema
  const faqPageSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer,
        },
      })),
    };
  }, [faqs]);

  useEffect(() => {
    document.title = "Frequently Asked Questions (FAQ) | Dias Accounting & Tax Dubai";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950">
      {/* FAQPage JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      <PageNavigation
        currentPath="/faqs"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-24 border-b border-gold-500/20 overflow-hidden">
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                Clear, definitive answers to the most common tax registration, 0% Small Business Relief eligibility, audit filing, and pricing questions faced by UAE businesses.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Type a question or topic (e.g. SBR, 9% threshold, pricing, penalties)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-slate-200">
            {categoryList.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-navy-950 text-white font-bold shadow-xs"
                    : "bg-white text-slate-600 hover:text-navy-950 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion List */}
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
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-navy-950 mb-1">
                No matching answers found
              </h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto mb-4">
                Ask our senior tax advisors directly for personalized answers to your questions.
              </p>
              <a
                href={`https://wa.me/971529226958?text=${encodeURIComponent(
                  "Hello Glen Dias, I have a specific question about UAE tax compliance and company formation that was not answered in your FAQ."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer inline-flex items-center gap-1.5 transition-all shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Ask Question on WhatsApp</span>
              </a>
            </div>
          )}

          {/* Bottom Help Desk Card */}
          <div className="mt-14 p-8 rounded-3xl bg-navy-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="font-display text-xl font-bold">
                Have a specific question not covered here?
              </h3>
              <p className="text-xs text-slate-300">
                Contact Glen Dias and our FTA registered tax agents for a direct consultation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/971529226958?text=${encodeURIComponent(
                  "Hello Dias UAE Advisory Team, I have a question regarding UAE Corporate Tax, VAT, or Company Formation and would like to chat."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={`https://wa.me/971529226958?text=${encodeURIComponent(
                  "Hello Glen Dias, I would like to schedule a free 30-minute consultation regarding my UAE company setup and tax obligations."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold px-5 py-3 rounded-xl text-xs cursor-pointer flex items-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 text-navy-950" />
                <span>Schedule Consultation on WhatsApp</span>
              </a>
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
