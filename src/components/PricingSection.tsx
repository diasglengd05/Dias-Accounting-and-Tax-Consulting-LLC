import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { BUSINESS_ENTITY, SITE_URL } from "../lib/seoConfig";

export interface PricingSectionProps {
  headingLevel?: "h1" | "h2";
  billingPeriod?: "monthly" | "annual";
  setBillingPeriod?: (period: "monthly" | "annual") => void;
  pricingPath?: "prospective" | "retrospective";
  setPricingPath?: (path: "prospective" | "retrospective") => void;
  onNavigate: (path: string) => void;
  language?: "en" | "ar";
  onPreselectedCallBooking?: (serviceTitle?: string) => void;
  showFullPricingLink?: boolean;
}

type PricingTab = "retainers" | "backlog" | "standalone";

interface PricingCardItem {
  id: string;
  name: string;
  bestFor: string;
  price: string;
  unit: string;
  billingNote: string;
  featured?: boolean;
  bullets: string[];
  ctaLabel: string;
  bookingTitle: string;
}

/**
 * Structured OfferCatalog JSON-LD derived directly from the single-source-of-truth
 * Homepage pricing tiers so `/pricing` structured data always matches the live cards verbatim.
 */
export const PRICING_OFFER_CATALOG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/pricing#pricing-catalog`,
  name: "Transparent, Fixed-Fee UAE Accounting, VAT & Corporate Tax Packages",
  description:
    "Predictable retainers and standalone filings with zero surprise hourly billing. Packages start from AED 400/month.",
  url: `${SITE_URL}/pricing`,
  provider: {
    "@id": BUSINESS_ENTITY.id,
  },
  areaServed: BUSINESS_ENTITY.areaServed,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "DiasUAE Fixed-Fee Accounting & Tax Packages",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Business Starter",
        description:
          "Best for startups, solo founders, and micro-SMEs. Monthly IFRS double-entry bookkeeping, bank & corporate card reconciliation (up to 50 txns/mo), monthly Balance Sheet and Profit & Loss statements, annual Corporate Tax filing & 0% SBR election, and dedicated Senior Accountant support.",
        price: "400",
        priceCurrency: "AED",
        url: `${SITE_URL}/pricing`,
        priceSpecification: [
          {
            "@type": "UnitPriceSpecification",
            name: "Annual Billing (AED 4,000/year + 5% VAT)",
            price: "400",
            priceCurrency: "AED",
            unitText: "MONTH",
          },
          {
            "@type": "UnitPriceSpecification",
            name: "Monthly Billing (AED 500/mo + 5% VAT)",
            price: "500",
            priceCurrency: "AED",
            unitText: "MONTH",
          },
        ],
      },
      {
        "@type": "Offer",
        name: "Corporate Growth",
        description:
          "Best for active UAE SMEs with VAT & 9% Corporate Tax. Includes everything in Business Starter plus quarterly VAT Form 201 preparation & EmaraTax filing, input VAT recovery checks, annual Corporate Tax return & 9% statutory adjustments, UAE E-Invoicing Phase 1 readiness, and priority FTA tax specialist access.",
        price: "600",
        priceCurrency: "AED",
        url: `${SITE_URL}/pricing`,
        priceSpecification: [
          {
            "@type": "UnitPriceSpecification",
            name: "Annual Billing (AED 6,000/year + 5% VAT)",
            price: "600",
            priceCurrency: "AED",
            unitText: "MONTH",
          },
          {
            "@type": "UnitPriceSpecification",
            name: "Monthly Billing (AED 750/mo + 5% VAT)",
            price: "750",
            priceCurrency: "AED",
            unitText: "MONTH",
          },
        ],
      },
      {
        "@type": "Offer",
        name: "Enterprise & CFO",
        description:
          "Best for DIFC, QFZP Free Zones & multi-entity groups. Includes everything in Corporate Growth plus monthly fractional CFO review & cash flow forecasting, 0% Free Zone (QFZP) substance & de minimis compliance, statutory audit file preparation, TRC & ESR support, and direct Senior Tax Partner access.",
        price: "1000",
        priceCurrency: "AED",
        url: `${SITE_URL}/pricing`,
        priceSpecification: [
          {
            "@type": "UnitPriceSpecification",
            name: "Annual Billing (AED 10,000/year + 5% VAT)",
            price: "1000",
            priceCurrency: "AED",
            unitText: "MONTH",
          },
          {
            "@type": "UnitPriceSpecification",
            name: "Monthly Billing (AED 1,250/mo + 5% VAT)",
            price: "1250",
            priceCurrency: "AED",
            unitText: "MONTH",
          },
        ],
      },
      {
        "@type": "Offer",
        name: "Single Fiscal Year (Backlog Catch-Up)",
        description:
          "Best for entities catching up 1 overdue fiscal year. Fixed one-time fee per fiscal year + 5% VAT.",
        price: "2500",
        priceCurrency: "AED",
        url: `${SITE_URL}/pricing`,
      },
      {
        "@type": "Offer",
        name: "Multi-Year Catch-Up (2 FYs)",
        description:
          "Best for 2 consecutive years of ledger reconstruction. Covers both years (AED 2,400/yr) + 5% VAT.",
        price: "4800",
        priceCurrency: "AED",
        url: `${SITE_URL}/pricing`,
      },
      {
        "@type": "Offer",
        name: "E-Commerce & High Volume (Backlog Catch-Up)",
        description:
          "Best for Stripe, Shopify, Amazon & multi-currency books. Fixed fee per complex fiscal year + 5% VAT.",
        price: "7500",
        priceCurrency: "AED",
        url: `${SITE_URL}/pricing`,
      },
      {
        "@type": "Offer",
        name: "MicroBiz CT Filing (0% SBR)",
        description:
          "Best for UAE SMEs under AED 3M revenue electing 0% SBR. Flat fee per annual EmaraTax filing + 5% VAT.",
        price: "500",
        priceCurrency: "AED",
        url: `${SITE_URL}/pricing`,
      },
      {
        "@type": "Offer",
        name: "QFZP 0% Free Zone Review",
        description:
          "Best for DIFC, DMCC, IFZA & SHAMS Free Zone entities. Fixed annual review & structuring fee + 5% VAT.",
        price: "1499",
        priceCurrency: "AED",
        url: `${SITE_URL}/pricing`,
      },
    ],
  },
};

export const PricingSection: React.FC<PricingSectionProps> = ({
  headingLevel = "h2",
  billingPeriod: controlledBillingPeriod,
  setBillingPeriod: controlledSetBillingPeriod,
  pricingPath: controlledPricingPath,
  setPricingPath: controlledSetPricingPath,
  onNavigate,
  language = "en",
  onPreselectedCallBooking,
  showFullPricingLink,
}) => {
  const isAr = language === "ar";
  const [internalBillingPeriod, setInternalBillingPeriod] = useState<"monthly" | "annual">(
    "annual"
  );
  const [internalPricingPath, setInternalPricingPath] = useState<"prospective" | "retrospective">(
    "prospective"
  );

  const billingPeriod = controlledBillingPeriod ?? internalBillingPeriod;
  const setBillingPeriod = controlledSetBillingPeriod ?? setInternalBillingPeriod;
  const pricingPath = controlledPricingPath ?? internalPricingPath;
  const setPricingPath = controlledSetPricingPath ?? setInternalPricingPath;

  const [activeTab, setActiveTab] = useState<PricingTab>(
    pricingPath === "retrospective" ? "backlog" : "retainers"
  );

  const shouldShowFullPricingLink = showFullPricingLink ?? headingLevel === "h2";

  const handleTabChange = (tab: PricingTab) => {
    setActiveTab(tab);
    if (tab === "backlog") {
      setPricingPath("retrospective");
    } else if (tab === "retainers") {
      setPricingPath("prospective");
    }
  };

  const handleChoosePlan = (bookingTitle: string) => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("dias_selected_service", bookingTitle);
      } catch {
        // Ignore storage restrictions
      }
    }
    if (onPreselectedCallBooking) {
      onPreselectedCallBooking(bookingTitle);
    } else {
      onNavigate("/#contact");
    }
  };

  const retainerCards: PricingCardItem[] = [
    {
      id: "starter",
      name: isAr ? "باقة الأعمال للمبتدئين" : "Business Starter",
      bestFor: isAr
        ? "للشركات الناشئة ورواد الأعمال دون حد القيمة المضافة"
        : "Best for startups, solo founders, and micro-SMEs",
      price: billingPeriod === "annual" ? "400" : "500",
      unit: isAr ? "/ شهر" : "/ month",
      billingNote:
        billingPeriod === "annual"
          ? isAr
            ? "4,000 درهم سنوياً (توفير 2,000 درهم) + 5% ضريبة"
            : "Billed AED 4,000/year (save AED 2,000) + 5% VAT"
          : isAr
          ? "تدفع شهرياً 500 درهم + 5% ضريبة"
          : "Billed monthly at AED 500/mo + 5% VAT",
      bullets: isAr
        ? [
            "مسك الدفاتر المحاسبية شهرياً وفق معايير IFRS",
            "تسوية الحسابات البنكية والبطاقات (حتى 50 معاملة/شهر)",
            "إصدار الميزانية العمومية وقائمة الأرباح والخسائر شهرياً",
            "إقرار ضريبة الشركات السنوي وتفعيل إعفاء الأعمال الصغيرة 0%",
            "دعم مباشر عبر البريد الإلكتروني مع محاسب أول",
          ]
        : [
            "Monthly IFRS double-entry bookkeeping & ledger close",
            "Bank & corporate card reconciliation (up to 50 txns/mo)",
            "Monthly Balance Sheet and Profit & Loss statements",
            "Annual Corporate Tax filing & 0% SBR election",
            "Dedicated Senior Accountant support",
          ],
      ctaLabel: isAr ? "اختر باقة المبتدئين" : "Choose Starter",
      bookingTitle: `Business Starter (${billingPeriod === "annual" ? "AED 400/mo annual" : "AED 500/mo monthly"})`,
    },
    {
      id: "growth",
      name: isAr ? "باقة نمو الشركات" : "Corporate Growth",
      bestFor: isAr
        ? "للشركات النامية المسجلة في القيمة المضافة وضريبة الشركات"
        : "Best for active UAE SMEs with VAT & 9% Corporate Tax",
      price: billingPeriod === "annual" ? "600" : "750",
      unit: isAr ? "/ شهر" : "/ month",
      billingNote:
        billingPeriod === "annual"
          ? isAr
            ? "6,000 درهم سنوياً (توفير 3,000 درهم) + 5% ضريبة"
            : "Billed AED 6,000/year (save AED 3,000) + 5% VAT"
          : isAr
          ? "تدفع شهرياً 750 درهم + 5% ضريبة"
          : "Billed monthly at AED 750/mo + 5% VAT",
      featured: true,
      bullets: isAr
        ? [
            "كل ما تشمله باقة Business Starter بالكامل",
            "إعداد وتقديم إقرارات VAT 201 ربع السنوية عبر EmaraTax",
            "تحسين استرداد ضريبة المدخلات ومراجعة الفواتير الضريبية",
            "إقرار ضريبة الشركات السنوي والتسويات القانونية لـ 9%",
            "الجاهزية للفوترة الإلكترونية المرحلة الأولى وإعداد ASP",
            "دعم استشاري ذو أولوية مع فريق الضرائب",
          ]
        : [
            "Everything included in Business Starter",
            "Quarterly VAT Form 201 preparation & EmaraTax filing",
            "Input VAT recovery & tax invoice compliance checks",
            "Annual Corporate Tax return & 9% statutory adjustments",
            "UAE E-Invoicing Phase 1 readiness & ASP guidance",
            "Priority advisory access with FTA tax specialists",
          ],
      ctaLabel: isAr ? "اختر باقة النمو" : "Choose Growth",
      bookingTitle: `Corporate Growth (${billingPeriod === "annual" ? "AED 600/mo annual" : "AED 750/mo monthly"})`,
    },
    {
      id: "enterprise",
      name: isAr ? "باقة المؤسسات وCFO" : "Enterprise & CFO",
      bestFor: isAr
        ? "لمجموعات الشركات وشركات المناطق الحرة المؤهلة (QFZP)"
        : "Best for DIFC, QFZP Free Zones & multi-entity groups",
      price: billingPeriod === "annual" ? "1,000" : "1,250",
      unit: isAr ? "/ شهر" : "/ month",
      billingNote:
        billingPeriod === "annual"
          ? isAr
            ? "10,000 درهم سنوياً (توفير 5,000 درهم) + 5% ضريبة"
            : "Billed AED 10,000/year (save AED 5,000) + 5% VAT"
          : isAr
          ? "تدفع شهرياً 1,250 درهم + 5% ضريبة"
          : "Billed monthly at AED 1,250/mo + 5% VAT",
      bullets: isAr
        ? [
            "كل ما تشمله باقة Corporate Growth بالكامل",
            "مراجعة مالية شهرية وتوقعات تدفقات نقدية مع CFO",
            "هيكلة ومتابعة امتثال 0% للمناطق الحرة المؤهلة (QFZP)",
            "تنسيق التدقيق القانوني الخارجي وتجهيز ملفات المدققين",
            "دعم شهادة الإقامة الضريبية (TRC) وتقارير ESR",
            "تواصل مباشر مع الشريك الضريبي الأول",
          ]
        : [
            "Everything included in Corporate Growth",
            "Monthly fractional CFO review & cash flow forecasting",
            "0% Free Zone (QFZP) substance & de minimis compliance",
            "Statutory audit file preparation & auditor liaison",
            "Tax Residency Certificate (TRC) & ESR support",
            "Direct access to Senior Tax Partner",
          ],
      ctaLabel: isAr ? "اختر باقة المؤسسات" : "Choose Enterprise",
      bookingTitle: `Enterprise & CFO (${billingPeriod === "annual" ? "AED 1,000/mo annual" : "AED 1,250/mo monthly"})`,
    },
  ];

  const backlogCards: PricingCardItem[] = [
    {
      id: "backlog-1yr",
      name: isAr ? "إغلاق متأخرات سنة مالية واحدة" : "Single Fiscal Year",
      bestFor: isAr
        ? "للشركات ذات دفاتر متأخرة لسنة مالية واحدة قبل تقديم الإقرار"
        : "Best for entities catching up 1 overdue fiscal year",
      price: "2,500",
      unit: isAr ? "دفعة واحدة" : "one-time",
      billingNote: isAr
        ? "رسوم ثابتة لسنة مالية واحدة + 5% ضريبة"
        : "Fixed one-time fee per fiscal year + 5% VAT",
      bullets: isAr
        ? [
            "تسوية كامل كشوفات الحسابات البنكية للسنة",
            "تنظيم فواتير المبيعات والمشتريات والمصروفات",
            "إعداد ميزان المراجعة والقوائم المالية وفق IFRS",
            "مراجعة الأهلية لإعفاء الأعمال الصغيرة 0%",
            "تقديم إقرار ضريبة الشركات عبر منصة EmaraTax",
          ]
        : [
            "Full bank & card statement reconciliations for 1 FY",
            "Invoice, receipt, and expense ledger categorization",
            "IFRS Trial Balance, P&L, and Balance Sheet build",
            "0% Small Business Relief eligibility review",
            "Overdue Corporate Tax filing on EmaraTax",
          ],
      ctaLabel: isAr ? "احجز إغلاق سنة واحدة" : "Book Single FY Catch-Up",
      bookingTitle: "Backlog Catch-Up — Single Fiscal Year (AED 2,500)",
    },
    {
      id: "backlog-2yr",
      name: isAr ? "إغلاق متأخرات سنتين ماليتين" : "Multi-Year Catch-Up (2 FYs)",
      bestFor: isAr
        ? "للشركات التي تحتاج إعادة بناء سنتين ماليتين وتجهيز التدقيق"
        : "Best for 2 consecutive years of ledger reconstruction",
      price: "4,800",
      unit: isAr ? "دفعة واحدة" : "one-time",
      billingNote: isAr
        ? "يشمل عامين كاملين (2,400 درهم/سنة) + 5% ضريبة"
        : "Covers both years (AED 2,400/yr) + 5% VAT",
      featured: true,
      bullets: isAr
        ? [
            "إعادة بناء الأستاذ العام بالكامل لسنتين متتاليتين",
            "تصنيف الأصول الثابتة والمصروفات الرأسمالية",
            "إعداد قوائم مالية مقارنة جاهزة للتدقيق الخارجي",
            "تقديم إقراري ضريبة الشركات للعامين على EmaraTax",
            "مراجعة مخاطر غرامات الهيئة الاتحادية للضرائب",
          ]
        : [
            "Complete 2-year general ledger reconstruction",
            "Fixed asset & capital expenditure schedule build",
            "Comparative IFRS statements ready for external audit",
            "Submission of 2 Corporate Tax returns on EmaraTax",
            "FTA penalty mitigation & voluntary disclosure review",
          ],
      ctaLabel: isAr ? "احجز إغلاق سنتين" : "Book 2-Year Catch-Up",
      bookingTitle: "Backlog Catch-Up — Multi-Year 2 FYs (AED 4,800)",
    },
    {
      id: "backlog-ecom",
      name: isAr ? "المتاجر الإلكترونية وحجم المعاملات العالي" : "E-Commerce & High Volume",
      bestFor: isAr
        ? "لمتاجر Stripe وShopify وAmazon متعددة العملات"
        : "Best for Stripe, Shopify, Amazon & multi-currency books",
      price: "7,500",
      unit: isAr ? "دفعة واحدة" : "one-time",
      billingNote: isAr
        ? "سنة مالية عالية المعاملات + 5% ضريبة"
        : "Fixed fee per complex fiscal year + 5% VAT",
      bullets: isAr
        ? [
            "مطابقة بوابات الدفع (Stripe وTabby وTamara) وPOS",
            "تقييم المخزون واحتساب تكلفة البضاعة المباعة (COGS)",
            "تسوية المعاملات متعددة العملات وفروق الصرف",
            "قوائم مالية كاملة وفق معايير IFRS",
            "إقرار ضريبة الشركات مع ملف جاهزية التدقيق",
          ]
        : [
            "Payment gateway reconciliations (Stripe, Amazon, Tabby)",
            "Inventory valuation & accurate COGS tracking",
            "Multi-currency payout & FX gain/loss reconciliation",
            "Audit-ready IFRS financial statements",
            "Corporate Tax filing & full audit readiness dossier",
          ],
      ctaLabel: isAr ? "احجز باقة المتاجر" : "Book High-Volume Catch-Up",
      bookingTitle: "Backlog Catch-Up — E-Commerce & High Volume (AED 7,500)",
    },
  ];

  const standaloneCards: PricingCardItem[] = [
    {
      id: "microbiz-ct",
      name: isAr ? "إقرار ضريبة الشركات (SBR 0%)" : "MicroBiz CT Filing (0% SBR)",
      bestFor: isAr
        ? "للشركات الصغيرة بإيرادات أقل من 3 مليون درهم سنوياً"
        : "Best for UAE SMEs under AED 3M revenue electing 0% SBR",
      price: "500",
      unit: isAr ? "سنوياً" : "one-time",
      billingNote: isAr
        ? "رسوم ثابتة لإقرار واحد + 5% ضريبة"
        : "Flat fee per annual EmaraTax filing + 5% VAT",
      bullets: isAr
        ? [
            "التحقق من أهلية تسهيلات الأعمال الصغيرة (SBR)",
            "إعداد ومراجعة إقرار ضريبة الشركات السنوي",
            "تقديم اختيار ضريبة 0% عبر منصة EmaraTax",
            "تأكيد استلام الهيئة لتفادي غرامات التأخير",
            "توجيه واضح بالمستندات المطلوبة للحفظ 7 سنوات",
          ]
        : [
            "Small Business Relief (AED 3M) eligibility verification",
            "Annual Corporate Tax return preparation",
            "0% SBR election & submission on EmaraTax",
            "FTA confirmation receipt & penalty protection",
            "7-year statutory recordkeeping checklist",
          ],
      ctaLabel: isAr ? "احجز تقديم الإقرار" : "Book CT Filing",
      bookingTitle: "Standalone — MicroBiz CT Filing 0% SBR (AED 500)",
    },
    {
      id: "qfzp-shield",
      name: isAr ? "هيكلة 0% للمناطق الحرة (QFZP)" : "QFZP 0% Free Zone Review",
      bestFor: isAr
        ? "لشركات DIFC وDMCC وIFZA وSHAMS المستهدفة لنسبة 0%"
        : "Best for DIFC, DMCC, IFZA & SHAMS Free Zone entities",
      price: "1,499",
      unit: isAr ? "سنوياً" : "annual review",
      billingNote: isAr
        ? "هيكلة ومراجعة سنوية ثابتة + 5% ضريبة"
        : "Fixed annual review & structuring fee + 5% VAT",
      featured: true,
      bullets: isAr
        ? [
            "تصنيف الإيرادات المؤهلة وغير المؤهلة بدقة قانونية",
            "اختبار قاعدة الحد الأدنى De Minimis (5% أو 5 مليون)",
            "التحقق من متطلبات الجوهر الاقتصادي الكافي",
            "مواءمة الإفصاح عن تسعير المعاملات (Transfer Pricing)",
            "تقرير مكتوب بالتوصيات قبل تقديم الإقرار السنوي",
          ]
        : [
            "Qualifying vs. non-qualifying income classification",
            "De Minimis rule test (5% or AED 5M threshold)",
            "Adequate economic substance verification",
            "Transfer Pricing (TP) disclosure alignment",
            "Written compliance memo ahead of annual filing",
          ],
      ctaLabel: isAr ? "احجز مراجعة QFZP" : "Book QFZP Review",
      bookingTitle: "Standalone — QFZP 0% Free Zone Review (AED 1,499)",
    },
    {
      id: "audit-readiness",
      name: isAr ? "الجاهزية للتدقيق وتوزيع الأرباح" : "Statutory & Dividend Audit",
      bestFor: isAr
        ? "لشركات البر الرئيسي والمناطق الحرة المطالبة بتدقيق معتمد"
        : "Best for license renewals, banks & dividend distributions",
      price: isAr ? "عرض مخصص" : "Custom",
      unit: "",
      billingNote: isAr
        ? "يتم التسعير حسب حجم الدفاتر وجهة الترخيص"
        : "Fixed quote scoped to your entity & licensing authority",
      bullets: isAr
        ? [
            "مراجعة وتنقية الدفاتر ومطابقتها لمعايير IFRS",
            "تدقيق الأرباح القابلة للتوزيع (المرحلي والنهائي)",
            "التنسيق المباشر مع مدققي الحسابات المعتمدين في الإمارات",
            "معالجة قيود التسوية وملاحظات المدقق الخارجي",
            "تسليم قوائم مالية مدققة جاهزة للتجديد أو البنوك",
          ]
        : [
            "Pre-audit ledger scrub & IFRS compliance check",
            "Interim & final dividend solvency audit preparation",
            "Direct liaison with UAE-approved external auditors",
            "Remediation of audit findings & adjusting entries",
            "Signed financials ready for authority renewal",
          ],
      ctaLabel: isAr ? "اطلب عرض سعر" : "Request Audit Quote",
      bookingTitle: "Standalone — Statutory & Dividend Audit Readiness",
    },
  ];

  const activeCards =
    activeTab === "retainers"
      ? retainerCards
      : activeTab === "backlog"
      ? backlogCards
      : standaloneCards;

  const headingText = isAr
    ? "باقات محاسبية وضريبية ثابتة وواضحة"
    : "Transparent, Fixed-Fee Pricing";

  return (
    <section
      id="pricing"
      className="py-20 lg:py-28 bg-white border-t border-slate-200 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          {headingLevel === "h1" ? (
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#0D1B2A] tracking-tight"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {headingText}
            </h1>
          ) : (
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#0D1B2A] tracking-tight"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {headingText}
            </h2>
          )}
          <p className="text-base sm:text-lg text-[#475569] leading-[1.6] max-w-[60ch] mx-auto">
            {isAr
              ? "رسوم شهرية أو سنوية واضحة بدون فواتير ساعات مفاجئة. تبدأ باقاتنا من 400 درهم شهرياً."
              : "Predictable retainers and standalone filings with zero surprise hourly billing. Packages start from AED 400/month."}
          </p>
        </div>

        {/* Clean Tab Toggles + Billing Switch */}
        <div className="flex flex-col items-center gap-5">
          <div
            role="tablist"
            aria-label="Pricing Categories"
            className="inline-flex flex-wrap justify-center p-1 rounded-xl bg-slate-100 border border-[#E2E8F0] gap-1"
          >
            {(
              [
                { id: "retainers", label: isAr ? "الباقات الشهرية" : "Monthly Retainers" },
                { id: "backlog", label: isAr ? "إغلاق المتأخرات" : "Backlog Catch-Up" },
                { id: "standalone", label: isAr ? "الإقرارات المستقلة" : "Standalone Filings" },
              ] as { id: PricingTab; label: string }[]
            ).map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleTabChange(tab.id)}
                  className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-white text-[#0D1B2A] shadow-xs"
                      : "text-[#475569] hover:text-[#0D1B2A]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "retainers" && (
            <div className="flex items-center gap-3 text-sm">
              <span
                className={
                  billingPeriod === "monthly"
                    ? "font-semibold text-[#0D1B2A]"
                    : "text-[#475569]"
                }
              >
                {isAr ? "دفع شهري" : "Monthly"}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={billingPeriod === "annual"}
                aria-label="Toggle annual billing"
                onClick={() =>
                  setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")
                }
                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                  billingPeriod === "annual" ? "bg-[#1B4332]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                    billingPeriod === "annual" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={
                  billingPeriod === "annual"
                    ? "font-semibold text-[#0D1B2A]"
                    : "text-[#475569]"
                }
              >
                {isAr ? "دفع سنوي" : "Annual"}{" "}
                <span className="text-[#1B4332] font-medium">
                  {isAr ? "(وفر حتى 33%)" : "(Save up to 33%)"}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* 3 Clean Side-by-Side Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {activeCards.map((card) => (
            <div
              key={card.id}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all ${
                card.featured
                  ? "bg-white border-2 border-[#1B4332] shadow-md shadow-slate-900/5"
                  : "bg-white border border-[#E2E8F0] hover:border-slate-300 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl font-bold text-[#0D1B2A] tracking-tight">
                    {card.name}
                  </h3>
                  {card.featured && (
                    <span className="text-xs font-semibold text-[#1B4332] whitespace-nowrap">
                      {isAr ? "الأكثر اختياراً" : "Recommended"}
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#475569] leading-relaxed mb-6">
                  {card.bestFor}
                </p>

                {/* Price */}
                <div className="py-6 border-y border-slate-100 mb-6">
                  <div className="flex items-baseline gap-1.5">
                    {card.price !== "Custom" && card.price !== "عرض مخصص" && (
                      <span className="text-sm font-semibold text-[#475569]">AED</span>
                    )}
                    <span className="text-4xl font-bold text-[#0D1B2A] tracking-tight tabular-nums">
                      {card.price}
                    </span>
                    {card.unit && (
                      <span className="text-sm text-[#475569]">{card.unit}</span>
                    )}
                  </div>
                  <p className="text-xs text-[#475569] mt-1.5 tabular-nums">{card.billingNote}</p>
                </div>

                {/* Checkmark Bullets */}
                <ul className="space-y-3 mb-8 text-sm text-[#0D1B2A]">
                  {card.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#1B4332] shrink-0 mt-1" />
                      <span className="leading-snug">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Single Clean CTA Button */}
              <button
                type="button"
                onClick={() => handleChoosePlan(card.bookingTitle)}
                className={`w-full min-h-[46px] py-3 px-4 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  card.featured
                    ? "bg-[#1B4332] hover:bg-[#143326] text-white"
                    : "bg-[#0D1B2A] hover:bg-[#1a2c42] text-white"
                }`}
              >
                {card.ctaLabel}
              </button>
            </div>
          ))}
        </div>

        {/* Quiet Footer Note & Full Pricing Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-sm text-[#475569] border-t border-slate-100">
          <p className="max-w-[65ch] text-center sm:text-left">
            {isAr
              ? "يعتمد العرض النهائي على حجم المعاملات ونشاط الرخصة. احجز استشارة مجانية لعرض سعر مكتوب."
              : "Final fees depend on monthly transaction volume and licensing scope. Request a written quote in minutes."}
          </p>
          {shouldShowFullPricingLink ? (
            <a
              href="/pricing"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("/pricing");
              }}
              className="inline-flex items-center gap-1.5 font-semibold text-[#1B4332] hover:text-[#143326] whitespace-nowrap shrink-0"
            >
              <span>{isAr ? "مقارنة تفصيلية للباقات" : "Compare all package features"}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>
          ) : (
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("/contact");
              }}
              className="inline-flex items-center gap-1.5 font-semibold text-[#1B4332] hover:text-[#143326] whitespace-nowrap shrink-0"
            >
              <span>{isAr ? "اطلب عرض سعر مكتوب" : "Request a written quote"}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
