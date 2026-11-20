import React, { useEffect, useState, useMemo } from "react";
import {
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Search,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import SectionCTA from "../components/editorial/SectionCTA";
import {
  applyPageSEO,
  CORE_HOMEPAGE_FAQS,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  upsertJsonLd,
  removeJsonLd,
} from "../lib/seo";

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
  const [openFaq, setOpenFaq] = useState<string | null>("core-1");

  const faqs: StructuredFaq[] = [
    // 0. Core UAE Tax & Accounting FAQs (Synchronized with Homepage & FAQPage Rich Results)
    {
      id: "core-1",
      category: "Corporate Tax",
      question: CORE_HOMEPAGE_FAQS[0].question,
      answer: CORE_HOMEPAGE_FAQS[0].answer,
    },
    {
      id: "core-2",
      category: "Corporate Tax",
      question: CORE_HOMEPAGE_FAQS[1].question,
      answer: CORE_HOMEPAGE_FAQS[1].answer,
    },
    {
      id: "core-3",
      category: "VAT",
      question: CORE_HOMEPAGE_FAQS[2].question,
      answer: CORE_HOMEPAGE_FAQS[2].answer,
    },
    {
      id: "core-4",
      category: "Bookkeeping",
      question: CORE_HOMEPAGE_FAQS[3].question,
      answer: CORE_HOMEPAGE_FAQS[3].answer,
    },
    {
      id: "core-5",
      category: "Pricing",
      question: CORE_HOMEPAGE_FAQS[4].question,
      answer: CORE_HOMEPAGE_FAQS[4].answer,
    },
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
      answer: "We offer transparent fixed-fee monthly packages from AED 400/month. There are no hidden fees, unexpected hourly invoices, or transaction surcharges. Final pricing depends on your business activity, transaction volume, and filing requirements. Book a free consultation on WhatsApp (+971 52 922 6958) for an accurate quote.",
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

  // Generate FAQPage JSON-LD Schema matching 100% of visible FAQs on /faqs
  const faqPageSchema = useMemo(
    () => buildFAQPageSchema(faqs, "https://diasuae.ae/faqs#faqpage"),
    [faqs]
  );

  useEffect(() => {
    applyPageSEO({
      title: "UAE Corporate Tax, VAT & Accounting FAQs | Dias UAE",
      description:
        "Clear answers to top UAE tax questions: 9% Corporate Tax, AED 3M Small Business Relief, 0% QFZP Free Zone rules, VAT 201 filing, and fixed-fee pricing.",
      canonicalPath: "/faqs",
      keywords:
        "uae tax faqs, corporate tax questions dubai, small business relief faq, vat compliance answers",
    });

    upsertJsonLd("page-faq-jsonld", faqPageSchema);
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "FAQs", path: "/faqs" },
      ])
    );

    window.scrollTo({ top: 0, behavior: "instant" });

    return () => {
      removeJsonLd("page-faq-jsonld");
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, [faqPageSchema]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] font-sans text-[#0D1B2A] antialiased">
      <PageNavigation
        currentPath="/faqs"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content" className="flex-1">
        {/* Executive Light Hero */}
        <section className="bg-[#FFFFFF] border-b border-[#E2E8F0] pt-12 pb-14 lg:pt-16 lg:pb-18">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-[#64748B] mb-8"
            >
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:text-[#0D1B2A] transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#0D1B2A] font-medium">FAQs</span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                Authoritative UAE Tax &amp; Accounting Guidance
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D1B2A] tracking-tight leading-[1.12]">
                UAE Corporate Tax, VAT &amp; Bookkeeping FAQs
              </h1>
              <p className="text-base sm:text-lg text-[#475569] leading-[1.65] max-w-[62ch]">
                Clear, definitive answers to the most common tax registration, 0% Small Business Relief eligibility, audit filing, and pricing questions faced by UAE businesses.
              </p>

              {/* Search Bar */}
              <div className="pt-3 max-w-xl">
                <label htmlFor="faqs-search" className="sr-only">
                  Search UAE tax and accounting FAQs
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="faqs-search"
                    type="search"
                    placeholder="Search a topic (e.g. SBR, 9% threshold, pricing, penalties)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full min-h-[48px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-11 pr-4 py-3 text-sm text-[#0D1B2A] placeholder:text-slate-400 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="bg-[#F8FAFC] py-14 lg:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter Tabs */}
            <div
              role="tablist"
              aria-label="Filter FAQs by category"
              className="flex flex-wrap items-center gap-2 mb-10 pb-5 border-b border-[#E2E8F0]"
            >
              {categoryList.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`min-h-[44px] py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#1B4332] text-white"
                        : "bg-[#FFFFFF] text-[#475569] hover:text-[#0D1B2A] border border-[#E2E8F0] hover:border-slate-300"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Accordion List */}
            <div className="space-y-3.5">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-[0_4px_16px_-12px_rgba(13,27,42,0.06)] transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      aria-expanded={isOpen}
                      className="w-full min-h-[60px] p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                          {faq.category}
                        </span>
                        <h2 className="font-display text-base sm:text-lg font-bold text-[#0D1B2A] leading-snug">
                          {faq.question}
                        </h2>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#1B4332]" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-3 text-sm sm:text-[15px] text-[#475569] leading-[1.65] border-t border-slate-100">
                        <p className="whitespace-pre-line max-w-[68ch]">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-14 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-8 space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-[#0D1B2A]">
                  No matching answers found
                </h2>
                <p className="text-[#475569] text-sm max-w-sm mx-auto">
                  Speak directly with our FTA-registered tax advisors for guidance tailored to your entity.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate("/contact")}
                    className="min-h-[44px] inline-flex items-center justify-center rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white font-semibold px-5 py-2.5 text-sm transition-colors cursor-pointer"
                  >
                    Ask a Tax Advisor
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Unified Single-CTA Footer Strip */}
        <SectionCTA
          eyebrow="Direct Advisory Support"
          title="Have a specific UAE tax question not covered here?"
          description="Speak directly with Glen Dias and our FTA-registered tax agents for clear guidance on Corporate Tax, VAT, and IFRS compliance."
          ctaLabel="Book Free Consultation"
          onCtaClick={() => onNavigate("/contact")}
          secondaryLabel="Try 2026 Tax Calculator"
          onSecondaryClick={() => onNavigate("/uae-tax-planner")}
          variant="navy"
        />
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
