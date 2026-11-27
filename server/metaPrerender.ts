/**
 * Server-Side Meta & Open Graph Prerendering Engine
 * Injects dynamic, high-ranking meta tags, canonical URLs, and Open Graph cards into HTML
 * before serving to social media crawlers (Meta/Facebook, WhatsApp, LinkedIn, X/Twitter, Telegram, Slack).
 */

import fs from "fs";
import path from "path";
import { blogsData } from "../src/data/blogsData.ts";
import { draftPlaceholderPosts } from "../src/data/blogDrafts.ts";
import { buildFAQPageSchema, fitMetaDescription } from "../src/lib/seo.ts";
import {
  ALL_CORPORATE_TAX_SCHEMA_FAQS,
  ALL_DIVIDEND_SCHEMA_FAQS,
  ALL_VAT_COMPLIANCE_SCHEMA_FAQS,
  DIFC_DTEC_FAQS,
} from "../src/data/pageFaqs.ts";

const DEFAULT_OG_IMAGE = "https://diasuae.ae/og-image.png";

export interface MetaOverride {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  author?: string;
  publishedTime?: string;
  section?: string;
  isArabic?: boolean;
  schemaMarkup?: string;
  h1?: string;
  robots?: string;
}

const KNOWN_BLOGS: Record<string, { title: string; summary: string; author: string; role: string; tag: string; date: string }> = {
  "claim-small-business-relief": {
    title: "How to Claim UAE Small Business Relief (0% Corporate Tax up to AED 3M) in 2026 | Dias Accounting",
    summary: "Step-by-step 2026 guide to electing UAE Small Business Relief (SBR) under Article 21 and Ministerial Decision No. 73 of 2023. Covers the AED 3,000,000 revenue cap, EmaraTax filing steps, VAT interaction, and mandatory 7-year IFRS records.",
    author: "Glen Dias",
    role: "Managing Director & FTA Registered Tax Agent",
    tag: "Corporate Tax",
    date: "2026-11-12",
  },
  "free-zone-qualifying-income": {
    title: "Free Zone Qualifying Income in 2026: How to Keep Your 0% UAE Corporate Tax Status | Dias Accounting",
    summary: "Complete 2026 roadmap to Qualifying Free Zone Person (QFZP) 0% Corporate Tax status under Cabinet Decision No. 55 and Ministerial Decision No. 139. Covers economic substance, De Minimis thresholds, Transfer Pricing, and mandatory IFRS audits.",
    author: "Glen Dias",
    role: "Managing Director & FTA Registered Tax Agent",
    tag: "Free Zone",
    date: "2026-11-12",
  },
  "top-tax-mistakes-uae-companies-make": {
    title: "Top 7 Common Tax Mistakes UAE Companies Make in 2026 | Dias Accounting",
    summary: "Avoid costly UAE Federal Tax Authority (FTA) fines in 2026. Learn the 7 most common Corporate Tax, 5% VAT, Free Zone QFZP, Connected Person, and IFRS bookkeeping mistakes UAE companies make—and how to fix them before filing.",
    author: "Glen Dias",
    role: "Managing Director & FTA Registered Tax Agent",
    tag: "Compliance & Penalties",
    date: "2026-11-12",
  },
  "precision-accounting-bookkeeping-transforming-financial-operations-uae": {
    title: "Precision Accounting & Bookkeeping Services Dubai | Dias",
    summary: "Eliminate operational drag and ensure FTA compliance. Dias Consulting delivers end-to-end bookkeeping and tax-ready financials across the UAE.",
    author: "Glen Dias",
    role: "Managing Director & FTA Registered Tax Agent",
    tag: "Bookkeeping",
    date: "2026-11-11",
  },
  "why-spreadsheets-fail-uae-bookkeeping-compliance-statutory-shift": {
    title: "Why Spreadsheets Fail UAE Statutory Bookkeeping | Dias",
    summary: "Relying on Excel for UAE corporate accounting breaches Federal Decree-Law No. 32 and FTA rules. Discover mandatory IFRS compliance and 7-year archival laws.",
    author: "Glen Dias",
    role: "Managing Director & FTA Registered Tax Agent",
    tag: "Compliance & Statutory Bookkeeping",
    date: "2026-11-11",
  },
  "seamless-uae-company-formation-complete-setup-guide-2026": {
    title: "Seamless UAE Company Formation 2026: Dubai Mainland & Free Zone Setup Guide | Dias UAE",
    summary: "The definitive 2026 guide to seamless UAE company formation by Glen Dias, FTA Registered Tax Agent. Fast-track Mainland & Free Zone trade licenses, priority tier-1 corporate banking, and Day-1 EmaraTax compliance.",
    author: "Glen Dias",
    role: "Managing Director & FTA Registered Tax Agent",
    tag: "Company Formation & Banking",
    date: "2026-11-10",
  },
  "uae-corporate-tax-2026-sbr-relief-penalty-shield-guide": {
    title: "UAE Corporate Tax 2026: 9% Rates, Small Business Relief & Penalty Shield | Dias UAE",
    summary: "Master UAE Corporate Tax 2026. Learn 9% thresholds, Small Business Relief (0% to 2029), and avoid the AED 10,000 FTA fine with the free Dias UAE Tax Planner.",
    author: "Glen Dias",
    role: "Managing Director & FTA Registered Tax Agent",
    tag: "Corporate Tax 2026",
    date: "2026-11-08",
  },
  "dias-accounting-uae-financial-compliance-excellence": {
    title: "The Gold Standard in UAE Financial Compliance | Dias Accounting Dubai",
    summary: "Partner with Dias Accounting & Tax Consulting LLC, an FTA Registered Tax Agency in Dubai & Sharjah. Fixed-fee SME accounting, VAT & 9% Corporate Tax compliance.",
    author: "Glen Dias",
    role: "Managing Director & FTA Registered Tax Agent",
    tag: "Corporate Excellence & Compliance",
    date: "2026-11-06",
  },
  "fixed-fee-accounting-packages-uae-sme-pricing": {
    title: "Fixed-Fee Accounting for UAE SMEs: Complete Tax & Bookkeeping Packages from AED 400/Month",
    summary: "No hidden fees. Fixed-fee UAE SME accounting from AED 400/month. Backlog books, VAT & 9% Corporate Tax by an FTA Registered Tax Agency. See plans at diasuae.ae/pricing!",
    author: "Glen Dias",
    role: "Managing Director & FTA Registered Tax Agent",
    tag: "Fixed-Fee Accounting & Pricing",
    date: "2026-11-06",
  },
  "uae-tax-deadlines-corporate-tax-vat-bookkeeping-guide-2026": {
    title: "UAE Tax Deadlines Approaching: The 2026 Executive Guide to 9% Corporate Tax Readiness, VAT Filing & Bookkeeping in Dubai & UAE",
    summary: "Struggling with UAE Tax Deadlines? From quarterly VAT returns to the 9% Corporate Tax, compliance is critical. Learn how to maintain audit-ready bookkeeping under IFRS, execute seamless EmaraTax registration, claim 0% Small Business Relief, and avoid severe FTA penalties with Glen Dias.",
    author: "Glen Dias",
    role: "Founder & Managing Director | Certified Tax Advisor",
    tag: "Corporate Tax & VAT Deadlines",
    date: "2026-11-04",
  },
  "accounting-services-dtec-difc-dividends-audit-dubai-guide": {
    title: "Accounting Services in DTEC & DIFC: 2026 Founder's Guide to Double-Entry Compliance, Dividends Audit & Corporate Tax in Dubai & Sharjah",
    summary: "Authoritative guide to accounting services in DTEC, tax consultant in DIFC, double-entry tax consultant offices in Dubai and Sharjah, and statutory Dividends Audit certification.",
    author: "Glen Dias",
    role: "Managing Director & FTA Registered Tax Agent",
    tag: "DTEC & DIFC Accounting",
    date: "2026-10-30",
  },
  "pricing-and-tax-solutions-uae-2026-executive-guide": {
    title: "Pricing & Tax Solutions in UAE: The 2026 Executive Guide to Fixed-Fee Accounting, Corporate Tax (9%), VAT & Backlog Bookkeeping Costs in Dubai",
    summary: "The definitive 2026 executive blueprint to transparent Pricing & Tax Solutions in the United Arab Emirates. Detailed fee schedules for monthly bookkeeping from AED 400/mo and backlog clean-ups from AED 2,500.",
    author: "Glen Dias",
    role: "Managing Director & FTA Registered Tax Agent",
    tag: "Pricing & Tax Solutions",
    date: "2026-10-30",
  },
  "fta-mandatory-e-invoicing-phase-1-peppol-readiness-muut": {
    title: "FTA Mandatory E-Invoicing Phase 1: Technical Readiness, Peppol Network, and UAE Business Checklist",
    summary: "Strategic action plan for UAE enterprises navigating Ministry of Finance e-invoicing mandates, Peppol decentralized exchange standards, and ERP integration requirements.",
    author: "Glen Dias",
    role: "Managing Director & FTA Registered Tax Agent",
    tag: "VAT & Compliance",
    date: "2026-10-05",
  },
  "fta-mandatory-e-invoicing-phase-1-peppol-readiness": {
    title: "FTA Mandatory E-Invoicing Phase 1: Technical Readiness, Peppol Network, and UAE Business Checklist",
    summary: "Strategic action plan for UAE enterprises navigating Ministry of Finance e-invoicing mandates, Peppol decentralized exchange standards, and ERP integration requirements.",
    author: "Glen Dias",
    role: "Managing Director & FTA Registered Tax Agent",
    tag: "VAT & Compliance",
    date: "2026-10-05",
  },
  "uae-2026-tax-update-latest-fta-guidelines": {
    title: "2026 Tax Update: Latest UAE Federal Tax Authority Guidelines & Strategic Roadmap",
    summary: "The definitive 2026 UAE Corporate Tax and VAT regulatory briefing from the Federal Tax Authority (FTA). Comprehensive coverage of the Small Business Relief (SBR) extension to 2029, Qualifying Free Zone Person (QFZP) de minimis compliance, Cabinet Decision No. 75 penalty mitigation, Voluntary Disclosures (Form 211), and the Phase 1 National E-Invoicing mandate.",
    author: "Glen Dias",
    role: "Managing Director & Certified Tax Advisor",
    tag: "2026 Tax Update",
    date: "2026-10-02",
  },
  "uae-corporate-tax-post-deadline-penalty-waiver-guide-2026": {
    title: "Post-Deadline UAE Corporate Tax Guide: Late Filing, Penalty Relief & Audit Readiness",
    summary: "Crucial advisory for UAE companies following the September 30 filing deadline. How to submit late returns on EmaraTax, apply for FTA penalty reconsiderations, file Voluntary Disclosures (Form 211), and maintain IFRS audit readiness for 2026–2027.",
    author: "Glen Dias",
    role: "Managing Director & Certified Tax Advisor",
    tag: "Corporate Tax Regularization",
    date: "2026-10-01",
  },
  "uae-corporate-tax-guide": {
    title: "Understanding UAE Corporate Tax: A Comprehensive Guide for SMEs",
    summary: "Learn the fundamentals of the new 9% corporate tax regime, including the AED 375,000 threshold, exemptions, and Small Business Relief eligibility.",
    author: "Glen Dias",
    role: "Managing Director & FTA Registered Tax Agent",
    tag: "Corporate Tax",
    date: "2026-07-02",
  },
  "vat-compliance-checklist": {
    title: "Top Tax Advisory & VAT Compliance Checklist for UAE SMEs and Free Zone Companies",
    summary: "Authoritative tax advisory and VAT compliance checklist for UAE SMEs and Free Zones. Actionable guidance on tax invoices, input VAT recoveries, 5% return filing, and eliminating FTA fines.",
    author: "Glen Dias",
    role: "Senior Tax Consultant",
    tag: "VAT Compliance",
    date: "2026-06-18",
  },
  "choosing-uae-jurisdiction": {
    title: "Choosing the Right Business Jurisdiction: Mainland vs. Free Zone",
    summary: "Evaluating corporate tax implications, 0% Qualifying Free Zone Person (QFZP) rules, ownership structures, and commercial flexibility.",
    author: "Glen Dias",
    role: "Managing Director & Certified Tax Advisor",
    tag: "Incorporation",
    date: "2026-05-29",
  },
};

const KNOWN_SERVICES: Record<string, { title: string; desc: string; keywords?: string }> = {
  "accounting-bookkeeping": {
    title: "Accounting Services UAE | Bookkeeping Dubai | Dias UAE",
    desc: "IFRS-compliant accounting services in the UAE. Dedicated senior accountants, monthly P&L reporting, bank reconciliations & software setup. Request a quote!",
    keywords: "accounting services uae, accounting consulting dubai, accounting service in uae, accounting solutions in uae, bookkeeping dubai, chartered accountants dubai, outsourced accounting uae",
  },
  "corporate-tax-advisory": {
    title: "Corporate Tax Filing UAE | Tax Advisory Dubai | Dias UAE",
    desc: "9% UAE Corporate Tax registration, 0% Small Business Relief, EmaraTax filing & AED 10,000 penalty waiver support in Dubai & SHAMS. Fixed monthly packages.",
    keywords: "corporate tax filing uae, tax advisory services in dubai, tax filing services uae, tax planning services in dubai, corporate tax return emaratax, small business relief 0%, fta audit defense",
  },
  "vat-compliance": {
    title: "UAE VAT Compliance, Form 201 Filing & FTA Audit Support | From AED 400/Mo",
    desc: "5% UAE VAT registration, quarterly Form 201 filing, input VAT recovery & FTA audit defense in Dubai & SHAMS. Monthly VAT & accounting from AED 400/mo.",
    keywords: "uae vat compliance, vat form 201 filing dubai, fta decision 13 input tax recovery, vat audit support uae, vat registration threshold aed 375000, fta voluntary disclosure 211",
  },
  "auditing-assurance": {
    title: "Auditing Firms in Sharjah & Dubai | Statutory Audit UAE",
    desc: "Approved statutory audit services for Dubai Mainland and Free Zones (DMCC, SHAMS, IFZA, Meydan). IFRS financial verification and corporate tax audit defense.",
    keywords: "auditing firms in sharjah, audit services in dubai, statutory audit uae, free zone approved auditor, dmcc approved auditor",
  },
  "backlog-accounting": {
    title: "Backlog Accounting & Cleanup Dubai | Reconcile Fast | Dias UAE",
    desc: "Fast historical bookkeeping reconstruction, missing invoice reconciliations, and opening balance sheets for overdue Corporate Tax & VAT filings in the UAE.",
    keywords: "backlog accounting dubai, financial record cleanup uae, historical bookkeeping reconstruction, overdue corporate tax filing",
  },
  "transfer-pricing": {
    title: "Transfer Pricing Services UAE | Local & Master File Dubai",
    desc: "Complete transfer pricing documentation, OECD benchmark studies, and EmaraTax TP Disclosure Form filing under FTA Ministerial Decision No. 97 of 2023.",
    keywords: "transfer pricing services uae, transfer pricing local file dubai, related party benchmarking, connected persons remuneration, emaratax tp disclosure",
  },
  "business-incorporation": {
    title: "Business Incorporation Services UAE | Company Setup Dubai & Free Zones | Dias UAE",
    desc: "100% foreign ownership company setup in Dubai Mainland (DET) and top UAE Free Zones (SHAMS, DMCC, IFZA, DTEC) with trade licensing & Day-1 tax setup.",
    keywords: "business incorporation services uae, business incorporation services in uae, company setup dubai, business setup uae, commercial license dubai, professional license uae, free zone company setup, mainland DET incorporation",
  },
  "business-incorporation-services": {
    title: "Business Incorporation Services UAE | Company Setup Dubai & Free Zones | Dias UAE",
    desc: "100% foreign ownership company setup in Dubai Mainland (DET) and top UAE Free Zones (SHAMS, DMCC, IFZA, DTEC) with trade licensing & Day-1 tax setup.",
    keywords: "business incorporation services uae, business incorporation services in uae, company setup dubai, business setup uae, commercial license dubai, professional license uae, free zone company setup, mainland DET incorporation",
  },
  "cfo-advisory": {
    title: "Outsourced CFO & Strategic Financial Advisory UAE | Dias UAE",
    desc: "Strategic CFO advisory, cash flow forecasting, 0% QFZP free zone substantiation, and statutory audit file preparation for expanding UAE corporate groups.",
    keywords: "fractional cfo dubai, outsourced cfo uae, virtual cfo services, strategic financial management dubai, cfo advisory uae",
  },
};

const CRAWLER_USER_AGENTS = [
  /facebookexternalhit/i,
  /facebot/i,
  /whatsapp/i,
  /twitterbot/i,
  /linkedinbot/i,
  /telegrambot/i,
  /slackbot/i,
  /discordbot/i,
  /pinterest/i,
  /skypeuripreview/i,
  /googlebot/i,
  /bingbot/i,
  /applebot/i,
  /baiduspider/i,
  /yandex/i,
  /duckduckbot/i,
  /vkshare/i,
  /redditbot/i,
  /embedly/i,
  /gptbot/i,
  /oai-searchbot/i,
  /chatgpt-user/i,
  /claudebot/i,
  /claude-web/i,
  /perplexitybot/i,
  /google-extended/i,
  /meta-externalagent/i,
];

/**
 * Checks if incoming request is from a search engine or social media preview crawler
 */
export function isSocialOrSearchCrawler(userAgent: string = ""): boolean {
  if (!userAgent) return false;
  return CRAWLER_USER_AGENTS.some((pattern) => pattern.test(userAgent));
}

/**
 * Resolves metadata parameters for a given request path / query
 */
export function resolveMetaForRequest(reqUrl: string, host: string = "diasuae.ae"): MetaOverride {
  const safeHost = host && !host.includes("localhost") && !host.includes("127.0.0.1") ? host : "diasuae.ae";
  const urlObj = new URL(reqUrl, `https://${safeHost}`);
  const rawPathname = urlObj.pathname.toLowerCase();
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/+$/, "") : rawPathname;
  const searchParams = urlObj.searchParams;
  const isArabic = searchParams.get("lang") === "ar";
  // Enforce strict non-www canonical domain (https://diasuae.ae) across every page
  const baseUrl = "https://diasuae.ae";

  // 1. Direct Blog post match (/blog/:id, /blogs/:id, or ?blog=:id)
  let blogId = "";
  if (pathname.startsWith("/blog/")) {
    blogId = pathname.replace("/blog/", "").replace(/\.(html|php|aspx)$/, "").trim();
  } else if (pathname.startsWith("/blogs/")) {
    blogId = pathname.replace("/blogs/", "").replace(/\.(html|php|aspx)$/, "").trim();
  } else if (searchParams.has("blog")) {
    blogId = searchParams.get("blog") || "";
  }

  if (blogId) {
    let blog = KNOWN_BLOGS[blogId];
    let dynamicSchema: string | undefined = undefined;

    if (!blog) {
      const staticMatch =
        blogsData.find((b) => b.id.toLowerCase() === blogId) ||
        draftPlaceholderPosts.find((b) => b.id.toLowerCase() === blogId);
      if (staticMatch) {
        blog = {
          title: staticMatch.title,
          summary: staticMatch.summary,
          author: staticMatch.author?.name || "Glen Dias",
          role: staticMatch.author?.role || "Managing Director & FTA Registered Tax Agent",
          tag: staticMatch.tag || "Corporate Tax",
          date: staticMatch.publishedIso || staticMatch.date || "2026-11-01",
        };
      }
    }

    if (!blog) {
      try {
        const dbFile = path.join(process.cwd(), "db_fallback.json");
        if (fs.existsSync(dbFile)) {
          const dbData = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
          if (Array.isArray(dbData.blogs)) {
            const found = dbData.blogs.find((b: any) => b.id === blogId);
            if (found) {
              blog = {
                title: found.title,
                summary: found.summary,
                author: found.author?.name || "Glen Dias",
                role: found.author?.role || "Managing Director & FTA Registered Tax Agent",
                tag: found.tag || "Corporate Tax",
                date: found.date,
              };
              dynamicSchema = found.schemaMarkup;
            }
          }
        }
      } catch (err) {
        // silent fallback
      }
    }

    if (blog) {
      const ogImg = DEFAULT_OG_IMAGE;
      const canonicalPostUrl = `${baseUrl}/blog/${blogId}`;
      const publishedIso = blog.date.includes("T") ? blog.date : `${blog.date}T09:00:00+04:00`;
      const normalizedBlogSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BlogPosting",
            "@id": `${canonicalPostUrl}#blogposting`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalPostUrl,
            },
            headline: blog.title,
            description: blog.summary,
            image: ogImg,
            datePublished: publishedIso,
            dateModified: publishedIso,
            author: {
              "@type": "Person",
              name: blog.author || "Glen Dias",
              jobTitle: blog.role || "Managing Director & FTA Registered Tax Agent",
              worksFor: { "@id": `${baseUrl}/#organization` },
            },
            publisher: { "@id": `${baseUrl}/#organization` },
            inLanguage: "en-AE",
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${canonicalPostUrl}#breadcrumb`,
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
              { "@type": "ListItem", position: 2, name: "Insights", item: `${baseUrl}/blog` },
              { "@type": "ListItem", position: 3, name: blog.title, item: canonicalPostUrl },
            ],
          },
        ],
      });

      return {
        title: /\|\s*dias/i.test(blog.title) ? blog.title : `${blog.title} | Dias Accounting`,
        description: blog.summary,
        keywords: `UAE tax guide, ${blog.tag}, corporate tax Dubai, FTA compliance, ${blog.title.toLowerCase()}`,
        url: canonicalPostUrl,
        ogImage: ogImg,
        ogType: "article",
        author: blog.author,
        publishedTime: publishedIso,
        section: blog.tag,
        isArabic,
        schemaMarkup: normalizedBlogSchema,
        h1: blog.title,
      };
    }
  }

  // 2. Direct Service match (/services/:id or ?service=:id)
  let serviceId = "";
  if (pathname.startsWith("/services/")) {
    serviceId = pathname.replace("/services/", "").replace(/\.(html|php|aspx)$/, "").trim();
  } else if (searchParams.has("service")) {
    serviceId = searchParams.get("service") || "";
  }

  if (serviceId && KNOWN_SERVICES[serviceId]) {
    const canonicalServiceId =
      serviceId === "business-incorporation-services" ? "business-incorporation" : serviceId;
    const s = KNOWN_SERVICES[canonicalServiceId] || KNOWN_SERVICES[serviceId];
    let serviceFaqSchema: string | undefined;

    if (canonicalServiceId === "vat-compliance") {
      const vatUrl = `${baseUrl}/services/vat-compliance`;
      serviceFaqSchema = JSON.stringify(
        buildFAQPageSchema(ALL_VAT_COMPLIANCE_SCHEMA_FAQS, `${vatUrl}#faqs`, {
          url: vatUrl,
          name: "Questions About VAT Registration and Returns",
          description: s.desc,
        })
      );
    } else if (canonicalServiceId === "corporate-tax-advisory") {
      const ctUrl = `${baseUrl}/services/corporate-tax-advisory`;
      serviceFaqSchema = JSON.stringify(
        buildFAQPageSchema(ALL_CORPORATE_TAX_SCHEMA_FAQS, `${ctUrl}#faqs`, {
          url: ctUrl,
          name: "Questions About Corporate Tax Advisory",
          description: s.desc,
        })
      );
    }

    return {
      title: s.title,
      description: s.desc,
      keywords: s.keywords || `${s.title.toLowerCase()}, accounting Dubai, corporate tax UAE, FTA tax agent`,
      url: `${baseUrl}/services/${canonicalServiceId}`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
      ...(serviceFaqSchema ? { schemaMarkup: serviceFaqSchema } : {}),
    };
  }

  // 3. UAE Tax Planner & Calculator routes
  if (
    pathname === "/uae-tax-planner" ||
    pathname === "/tax-planner" ||
    pathname === "/tax-calculator" ||
    pathname === "/calculator" ||
    pathname === "/corporate-tax-calculator" ||
    pathname === "/tax-savings" ||
    pathname === "/tax-savings-assessment" ||
    searchParams.get("section") === "calculator"
  ) {
    const plannerWebAppSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": `${baseUrl}/uae-tax-planner#webapp`,
          name: "2026 UAE Corporate Tax & 5% VAT Calculator",
          applicationCategory: "FinanceApplication",
          operatingSystem: "All",
          browserRequirements: "Requires JavaScript",
          url: `${baseUrl}/uae-tax-planner`,
          description:
            "Free interactive 2026 UAE Corporate Tax Calculator (Mainland 9%, 0% Small Business Relief up to AED 3M, Free Zone 0% QFZP De Minimis) and 5% UAE VAT Input Recovery Calculator.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "AED",
          },
          featureList: [
            "9% UAE Corporate Tax calculation with AED 375,000 0% profit band",
            "AED 3,000,000 Small Business Relief (0% SBR) eligibility assessment",
            "0% Qualifying Free Zone Person (QFZP) De Minimis compliance check",
            "5% UAE VAT extraction, blocked input screening, and Form 201 recovery estimate",
          ],
          provider: { "@id": `${baseUrl}/#organization` },
          inLanguage: "en-AE",
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${baseUrl}/uae-tax-planner#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
            { "@type": "ListItem", position: 2, name: "2026 UAE Corporate Tax Calculator", item: `${baseUrl}/uae-tax-planner` },
          ],
        },
      ],
    });
    return {
      title: "2026 UAE Corporate Tax & VAT Calculator | Dias Accounting",
      description: "Free 2026 UAE Corporate Tax (9%, 0% Small Business Relief & Free Zone QFZP) and 5% VAT calculator built by FTA-registered tax agents in Dubai.",
      keywords: "UAE Corporate Tax Calculator 2026, 5% UAE VAT Calculator, Free Zone QFZP Calculator, Small Business Relief AED 3M, UAE VAT Input Recovery Tool, Dias Accounting",
      url: `${baseUrl}/uae-tax-planner`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
      schemaMarkup: plannerWebAppSchema,
      h1: "2026 UAE Corporate Tax & 5% VAT Calculator",
    };
  }

  if (pathname === "/uae-vat-calculator" || pathname === "/vat-calculator" || pathname === "/vat-planner") {
    return {
      title: "UAE 5% VAT Hub & Form 201 Compliance Guide | Dias UAE",
      description: "Calculate net UAE 5% VAT payable or refundable for your quarterly FTA Form 201 return. Check AED 375,000 mandatory VAT registration thresholds.",
      keywords: "UAE VAT calculator, 5% VAT planner Dubai, FTA Form 201 calculator, VAT registration threshold UAE AED 375k",
      url: `${baseUrl}/uae-vat-calculator`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/fta-deadlines" || pathname === "/tax-deadlines" || pathname === "/deadline-calculator") {
    return {
      title: "UAE Corporate Tax & VAT Deadlines 2026 | Dias Accounting",
      description: "Check exact FTA EmaraTax filing deadlines for UAE Corporate Tax (9-month rule) and VAT 201 returns to prevent AED 10,000 administrative fines.",
      keywords: "UAE corporate tax deadline 2026, FTA EmaraTax due dates, VAT filing calendar UAE, Cabinet Decision 75 penalty shield",
      url: `${baseUrl}/fta-deadlines`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
    };
  }

  // 4. Pricing route
  if (pathname === "/pricing" || searchParams.get("section") === "pricing") {
    const pricingFaqSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${baseUrl}/pricing#faqs`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much do accounting and tax services cost for a small business in Dubai & UAE in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In 2026, fixed-fee monthly IFRS bookkeeping, 5% UAE VAT Form 201 returns, and EmaraTax Corporate Tax filings start from AED 400/month (Starter), AED 600–750/month (Growth VAT + CT), and AED 1,250/month (QFZP Audit-Ready), all managed by FTA-Registered Tax Agents with zero hourly surprises."
          }
        },
        {
          "@type": "Question",
          "name": "What is included in Dias Accounting's AED 400/month package?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Dias Accounting's AED 400/month Starter package includes monthly IFRS double-entry bookkeeping, bank and card reconciliation, monthly Profit & Loss and Balance Sheet statements, 0% Small Business Relief (SBR) election for revenue up to AED 3,000,000, and annual Corporate Tax return filing on EmaraTax."
          }
        },
        {
          "@type": "Question",
          "name": "What is included in Dias Accounting's fixed-fee accounting packages in Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our monthly retainers (starting from AED 400 to AED 1,250/month) cover a dedicated chartered accountant, cloud software setup (Zoho Books, QuickBooks, Xero), monthly bank and card reconciliations, IFRS Profit & Loss and Balance Sheet statements, quarterly VAT 201 return filings on applicable tiers, and annual Corporate Tax return preparation on EmaraTax. There are zero hourly fees or surprise billing charges."
          }
        },
        {
          "@type": "Question",
          "name": "How much does corporate tax filing cost for UAE Mainland and Free Zone companies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For businesses maintaining clean monthly books with Dias Accounting, annual Corporate Tax return filing is bundled into our monthly retainers. For standalone filings without monthly bookkeeping, our MicroBiz SBR filing is a flat AED 500, and our QFZP Shield Pro Free Zone structuring review is AED 1,499."
          }
        },
        {
          "@type": "Question",
          "name": "Are Corporate Tax returns (9%) and VAT 201 filings included in the monthly fee?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Our Corporate Growth and Enterprise plans include full quarterly VAT 201 return submissions and annual Corporate Tax return filing on the FTA EmaraTax portal. Business Starter (from AED 400/month billed annually) covers ongoing IFRS bookkeeping and annual Corporate Tax filing, with quarterly VAT available as an add-on."
          }
        },
        {
          "@type": "Question",
          "name": "What are the penalties if my UAE company delays historical backlog bookkeeping?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Under Cabinet Decision No. 75 of 2023, failing to register for Corporate Tax on time incurs an automatic AED 10,000 fine, and failing to maintain proper accounting records triggers penalties starting at AED 10,000. Our Backlog Catch-Up packages (from AED 2,500/year) reconstruct missing ledgers within 5 to 7 business days."
          }
        },
        {
          "@type": "Question",
          "name": "Can DIFC, DTEC, and Free Zone companies use these fixed-fee packages?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Our Enterprise & CFO Advisory tier and QFZP Shield Pro package are built for Free Zone, DIFC, and DTEC entities requiring annual IFRS audited financial statements, 0% QFZP De Minimis monitoring, and Transfer Pricing compliance."
          }
        }
      ]
    });
    return {
      title: "UAE Monthly Accounting, VAT & Corporate Tax Packages | From AED 400/Mo — DiasUAE",
      description: "Fixed-fee UAE monthly accounting, 5% VAT & 9% Corporate Tax packages. Business Starter from AED 400/mo & Corporate Growth for UAE SMEs. Get a quick quote.",
      keywords: "Corporate Tax, accounting packages dubai, monthly accounting package dubai, fixed fee bookkeeping uae, corporate tax return fee, corporate tax consultants in difc, accounting solutions in uae",
      url: `${baseUrl}/pricing`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
      schemaMarkup: pricingFaqSchema,
      h1: "Fixed-Fee UAE Accounting, VAT & Corporate Tax Packages (Business Starter & Corporate Growth)",
    };
  }

  // 5. Dedicated SEO Service Landing Pages & Consolidated Aliases
  if (pathname === "/tax-services-dubai" || pathname === "/tax-services-dubai.html") {
    return {
      title: "Corporate Tax Filing UAE | Tax Advisory Dubai | Dias UAE",
      description: "Certified Corporate Tax filing services in UAE. 9% return submission on EmaraTax, Small Business Relief (AED 3M) & 0% Free Zone advisory.",
      keywords: "tax services in dubai, corporate tax agency dubai, vat compliance dubai, corporate tax consultants in difc, fta tax agent dubai",
      url: `${baseUrl}/services/corporate-tax-advisory`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/accounting-services-uae" || pathname === "/accounting-services-uae.html") {
    return {
      title: "Accounting Services UAE | Bookkeeping Dubai | Dias UAE",
      description: "IFRS-compliant accounting services in the UAE. Dedicated senior accountants, monthly P&L reporting, bank reconciliations & cloud software setup.",
      keywords: "accounting services uae, bookkeeping dubai, chartered accountants dubai, outsourced accounting uae, ifrs financial statements dubai",
      url: `${baseUrl}/services/accounting-bookkeeping`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
    };
  }

  if (
    pathname === "/tax-planning-difc" ||
    pathname === "/tax-planning-difc.html" ||
    pathname === "/difc-dtec-accounting" ||
    pathname === "/dtec-accounting" ||
    pathname === "/accounting-services-in-dtec"
  ) {
    const difcTitle = "DIFC & DTEC Accounting, 0% QFZP Tax & Virtual Bookkeeping | Dias UAE";
    const difcDesc =
      "FTA-Registered Tax Agents for DIFC & DTEC companies. 0% QFZP compliance, audited IFRS books, 5% VAT & virtual bookkeeping from AED 400/mo. 2x Clutch 2026.";
    const difcSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "@id": `${baseUrl}/tax-planning-difc#service`,
          name: "DIFC & DTEC Corporate Tax Planning, 0% QFZP & Accounting",
          url: `${baseUrl}/tax-planning-difc`,
          description: difcDesc,
          provider: { "@id": `${baseUrl}/#organization` },
          areaServed: ["DIFC", "DTEC", "Dubai", "Sharjah", "United Arab Emirates"],
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${baseUrl}/tax-planning-difc#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
            { "@type": "ListItem", position: 2, name: "Services", item: `${baseUrl}/services` },
            {
              "@type": "ListItem",
              position: 3,
              name: "DIFC & DTEC Tax Planning",
              item: `${baseUrl}/tax-planning-difc`,
            },
          ],
        },
        buildFAQPageSchema(DIFC_DTEC_FAQS, `${baseUrl}/tax-planning-difc#faqs`, {
          url: `${baseUrl}/tax-planning-difc`,
          name: "DIFC & DTEC Tax Compliance FAQs",
          description: difcDesc,
        }),
      ],
    });
    return {
      title: difcTitle,
      description: difcDesc,
      keywords: "DIFC Corporate Tax Planning, DTEC Accounting & Bookkeeping, 0% Qualifying Free Zone Person (QFZP) Compliance, DIFC Dividend Audits, 5% UAE VAT Filing",
      url: `${baseUrl}/tax-planning-difc`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
      schemaMarkup: difcSchema,
      h1: "DIFC & DTEC Corporate Tax Planning, 0% QFZP & Dividend Audits",
    };
  }

  if (pathname === "/corporate-tax-consulting-dubai" || pathname === "/corporate-tax-consulting-dubai.html") {
    return {
      title: "Corporate Tax Filing UAE | Tax Advisory Dubai | Dias UAE",
      description: "Navigate the UAE 9% corporate tax regime with confidence. From EmaraTax registration to QFZP assessments and return filing, ensure FTA compliance.",
      keywords: "corporate tax consulting dubai, corporate tax uae, qfzp assessment 0% tax, uae corporate tax registration, emaratax corporate tax filing",
      url: `${baseUrl}/services/corporate-tax-advisory`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/small-business-tax-relief") {
    return {
      title: "UAE Small Business Tax Relief (AED 3M, 0%) | Dias UAE",
      description: "Check eligibility for 0% UAE Small Business Relief (revenue up to AED 3M, extended to 2029). IFRS bookkeeping & Corporate Tax filing from AED 400/mo.",
      keywords: "small business tax relief dubai, UAE small business relief, SBR AED 3M revenue, 0% corporate tax dubai, EmaraTax SBR registration",
      url: `${baseUrl}/small-business-tax-relief`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
    };
  }

  if (
    pathname === "/dividends-audit" ||
    pathname === "/dividends-audit-dubai" ||
    pathname === "/dividends-audit-uae"
  ) {
    const dividendsUrl = `${baseUrl}/dividends-audit`;
    const dividendsDesc =
      "Fast 5-day statutory interim & final dividends audits in Dubai, DIFC & UAE Free Zones under IFRS. Protect 0% dividend tax status. Same-day fixed quote.";
    const dividendsFaqSchema = JSON.stringify(
      buildFAQPageSchema(ALL_DIVIDEND_SCHEMA_FAQS, `${dividendsUrl}#faqs`, {
        url: dividendsUrl,
        name: "UAE Dividend Distribution FAQs",
        description: dividendsDesc,
      })
    );
    return {
      title: "Dividends Audit Dubai & UAE | Fast Statutory Sign-Off (FTA Tax Agents)",
      description: "Fast 5-day statutory interim & final dividends audits in Dubai, DIFC & UAE Free Zones under IFRS. Protect 0% dividend tax status. Same-day fixed quote.",
      keywords: "dividends audit dubai, dividends audit uae, audit services for dividends uae, dividend distribution certification",
      url: `${baseUrl}/dividends-audit`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
      schemaMarkup: dividendsFaqSchema,
    };
  }

  if (
    pathname === "/services/business-incorporation-services" ||
    pathname === "/services/business-incorporation" ||
    pathname === "/business-incorporation-services" ||
    pathname === "/business-incorporation"
  ) {
    return {
      title: "UAE Business Incorporation & Company Setup | Dias UAE",
      description: "100% foreign ownership company setup in Dubai Mainland (DET) and top UAE Free Zones (SHAMS, DMCC, IFZA, DTEC) with trade licensing & Day-1 tax setup.",
      keywords: "business incorporation services uae, company setup dubai, free zone company setup, mainland DET incorporation",
      url: `${baseUrl}/services/business-incorporation`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/services") {
    return {
      title: "UAE Corporate Tax, VAT & Accounting Services | Dias UAE",
      description: "Certified UAE Corporate Tax, 5% VAT filing, IFRS bookkeeping, audit readiness, and DIFC tax compliance across Dubai and Sharjah. Book a free review.",
      keywords: "Corporate Tax, Tax Services in Dubai, DIFC Tax Compliance, tax consulting services in uae, vat returns dubai, ifrs bookkeeping uae",
      url: `${baseUrl}/services`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/company-setup") {
    return {
      title: "UAE Company Setup & Day-1 Tax Registration | Dias UAE",
      description: "Launch your SHAMS Free Zone or Dubai Mainland LLC with full EmaraTax Corporate Tax & 5% VAT registration. Fixed-fee monthly accounting from AED 400/mo.",
      keywords: "UAE Company Setup, company setup dubai, free zone license uae, shams incorporation, dmcc company formation, ifza visa setup",
      url: `${baseUrl}/company-setup`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
      h1: "UAE Mainland & Free Zone Company Formation & Tax Registration",
    };
  }

  if (pathname === "/why-choose-us") {
    return {
      title: "Why Choose Dias Accounting | FTA Tax Agency Dubai & UAE",
      description: "Discover why UAE founders choose Dias Accounting: FTA-registered agents, fixed-fee IFRS accounting, EmaraTax compliance, and direct senior advisory.",
      keywords: "why dias accounting, fta registered tax agency, certified tax agent glen dias, corporate tax advisory firm dubai",
      url: `${baseUrl}/why-choose-us`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/about") {
    return {
      title: "About Dias Accounting | FTA Tax Consultants Dubai & UAE",
      description: "Led by FTA-Registered Tax Agent Glen Dias, Dias Accounting delivers Corporate Tax advisory, VAT compliance, and IFRS bookkeeping across Dubai & Sharjah.",
      keywords: "Glen Dias tax advisor, Dias Accounting LLC, certified tax consultant Dubai, tax consulting services in uae",
      url: `${baseUrl}/about`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/blog" || pathname === "/blogs" || pathname === "/insights") {
    const blogsTitle = "UAE Corporate Tax & VAT Insights 2026 | Dias Accounting";
    const blogsDesc =
      "FTA regulatory updates, 9% UAE Corporate Tax guides, 5% VAT Form 201 checklists, and IFRS accounting insights by FTA-registered advisors at Dias.";
    const blogsSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${baseUrl}/blog#collection`,
          url: `${baseUrl}/blog`,
          name: blogsTitle,
          description: blogsDesc,
          isPartOf: { "@id": `${baseUrl}/#website` },
          publisher: { "@id": `${baseUrl}/#organization` },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${baseUrl}/blog#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
            { "@type": "ListItem", position: 2, name: "Insights", item: `${baseUrl}/blog` },
          ],
        },
      ],
    });
    return {
      title: blogsTitle,
      description: blogsDesc,
      keywords: "UAE Corporate Tax Insights 2026, FTA Updates 2026, 9% Corporate Tax Guides, 5% VAT Audit Checklists, IFRS Accounting Insights Dubai",
      url: `${baseUrl}/blog`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
      schemaMarkup: blogsSchema,
      h1: "UAE Tax & Accounting Insights",
    };
  }

  if (pathname === "/testimonials" || pathname === "/reviews") {
    return {
      title: "Client Reviews & 5.0★ Google Rating | Dias Accounting",
      description: "Read verified 5.0★ Google Reviews from UAE Mainland LLCs and Free Zone businesses advised by Dias Accounting on Corporate Tax, VAT, and IFRS bookkeeping.",
      keywords: "dias accounting reviews, google reviews tax consultant dubai, fta tax agent testimonials uae",
      url: `${baseUrl}/testimonials`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
      h1: "Trusted by UAE Founders & Finance Teams",
    };
  }

  if (pathname === "/faqs" || pathname === "/faq") {
    const faqsBreadcrumbSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}/faqs#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
        { "@type": "ListItem", position: 2, name: "FAQs", item: `${baseUrl}/faqs` },
      ],
    });
    return {
      title: "UAE Corporate Tax, VAT & Accounting FAQs | Dias UAE",
      description: "Clear answers to top UAE tax questions: 9% Corporate Tax, AED 3M Small Business Relief, 0% QFZP Free Zone rules, VAT 201 filing, and fixed-fee pricing.",
      keywords: "uae tax faqs, corporate tax questions dubai, small business relief faq, vat compliance answers",
      url: `${baseUrl}/faqs`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
      schemaMarkup: faqsBreadcrumbSchema,
      h1: "UAE Corporate Tax, VAT & Bookkeeping FAQs",
    };
  }

  if (pathname === "/partners") {
    const partnersBreadcrumbSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}/partners#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "UAE Business Ecosystem & Partners",
          item: `${baseUrl}/partners`,
        },
      ],
    });
    return {
      title: "UAE Business Setup Partners & Free Tax Calculator Widget | Dias Accounting",
      description:
        "Partner with DiasUAE across Dubai, DIFC, DTEC & SHAMS for company setup, PRO referrals, and our free embeddable 2026 UAE Corporate Tax & VAT Calculator.",
      keywords:
        "UAE company formation partners, Dubai business setup partners, embed UAE corporate tax calculator, PRO agency accounting partner UAE, DIFC DTEC SHAMS tax partner",
      url: `${baseUrl}/partners`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
      schemaMarkup: partnersBreadcrumbSchema,
      h1: "UAE Business Setup Partners & Free Tax Calculator Widget",
    };
  }

  if (pathname === "/contact" || pathname === "/book-consultation") {
    return {
      title: "Contact Dias Accounting | Book Free UAE Tax Consultation",
      description: "Schedule a free consultation with FTA-Registered Tax Agent Glen Dias. SHAMS & Dubai advisory desk for UAE Corporate Tax, 5% VAT, and IFRS bookkeeping.",
      keywords: "contact tax consultant dubai, book tax consultation uae, fta tax agent phone number, dias accounting office",
      url: `${baseUrl}/contact`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/privacy-policy" || pathname === "/privacy") {
    return {
      title: "Privacy Policy & UAE PDPL Compliance | Dias Accounting",
      description: "Privacy Policy and UAE Federal Decree-Law No. 45 Personal Data Protection (PDPL) commitments for Dias Accounting & Tax Consulting LLC in Sharjah & Dubai.",
      keywords: "Dias Accounting privacy policy, UAE PDPL compliance, client confidentiality tax advisory",
      url: `${baseUrl}/privacy-policy`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
      robots: "index, follow",
    };
  }

  if (pathname === "/terms" || pathname === "/terms-of-service" || pathname === "/terms-and-conditions") {
    return {
      title: "Terms of Service & Engagement | Dias Accounting UAE",
      description: "Standard Terms of Service, professional engagement scope, confidentiality, and UAE tax compliance policies for Dias Accounting & Tax Consulting LLC.",
      keywords: "Dias Accounting terms of service, UAE tax engagement terms, FTA agency compliance",
      url: `${baseUrl}/terms`,
      ogImage: DEFAULT_OG_IMAGE,
      ogType: "website",
      isArabic,
    };
  }

  // 6. Default Fallback (Optimized for Homepage)
  return {
    title: isArabic
      ? "استشارات ضريبة الشركات والمحاسبة في دبي | دياس للمحاسبة الإمارات"
      : "Dias Accounting UAE | 2x Clutch 2026 Winner · Tax & IFRS From AED 400/Mo",
    description: isArabic
      ? "استشارات ضريبة الشركات، والامتثال لضريبة القيمة المضافة، والخدمات المحاسبية في دبي والإمارات. باقات محاسبية واضحة تبدأ من 400 درهم/شهرياً."
      : "FTA-Registered Tax Agency in Dubai & SHAMS. Monthly IFRS bookkeeping, 5% VAT Form 201 & 9% Corporate Tax packages from AED 400/mo. 2x Clutch 2026 Winner.",
    keywords: isArabic
      ? "ضريبة الشركات, خدمات المحاسبة والضرائب في دبي, شركات الضرائب في الإمارات, تسجيل ضريبة القيمة المضافة"
      : "UAE Corporate Tax, Tax Services in Dubai, DIFC Tax Compliance, Accounting Services UAE, VAT Filing Dubai, FTA Registered Tax Agent",
    url: `${baseUrl}/`,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: "website",
    isArabic,
    h1: isArabic
      ? "المحاسبة والاستشارات الضريبية في الإمارات المصممة لنمو الأعمال"
      : "UAE Accounting & Tax Advisory Built for Growing Businesses",
  };
}

function escapeHtmlText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlAttr(text: string): string {
  return escapeHtmlText(text).replace(/"/g, "&quot;");
}

/**
 * Injects meta tags, semantic SSR H1, and schema markup into HTML template
 */
export function injectMetaIntoHtml(html: string, meta: MetaOverride): string {
  let modified = html;

  if (meta.keywords) {
    const safeKeywords = escapeHtmlAttr(meta.keywords);
    modified = modified.replace(/<meta name="keywords" content="[\s\S]*?" \/>/i, `<meta name="keywords" content="${safeKeywords}" />`);
  }

  if (meta.robots) {
    const safeRobots = escapeHtmlAttr(meta.robots);
    modified = modified.replace(/<meta name="robots" content="[\s\S]*?" \/>/i, `<meta name="robots" content="${safeRobots}" />`);
  }

  if (meta.title) {
    const safeTitleText = escapeHtmlText(meta.title);
    const safeTitleAttr = escapeHtmlAttr(meta.title);
    // Replace <title>
    modified = modified.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitleText}</title>`);
    // Replace meta title
    modified = modified.replace(/<meta name="title" content="[\s\S]*?" \/>/i, `<meta name="title" content="${safeTitleAttr}" />`);
    // Replace og:title
    modified = modified.replace(/<meta property="og:title" content="[\s\S]*?" \/>/i, `<meta property="og:title" content="${safeTitleAttr}" />`);
    // Replace twitter:title
    modified = modified.replace(/<meta name="twitter:title" content="[\s\S]*?" \/>/i, `<meta name="twitter:title" content="${safeTitleAttr}" />`);
  }

  if (meta.description) {
    const normalizedDesc = meta.isArabic
      ? meta.description
      : fitMetaDescription(meta.description);
    const safeDescText = escapeHtmlText(normalizedDesc);
    const safeDescAttr = escapeHtmlAttr(normalizedDesc);

    // Replace meta description (deduplicating any stray duplicate tags)
    let descReplaced = false;
    modified = modified.replace(/<meta\s+name="description"[^>]*\/?>/gi, () => {
      if (descReplaced) return "";
      descReplaced = true;
      return `<meta name="description" content="${safeDescAttr}" />`;
    });
    if (!descReplaced) {
      modified = modified.replace("</head>", `  <meta name="description" content="${safeDescAttr}" />\n  </head>`);
    }

    // Replace og:description (deduplicating any stray duplicate tags)
    let ogDescReplaced = false;
    modified = modified.replace(/<meta\s+property="og:description"[^>]*\/?>/gi, () => {
      if (ogDescReplaced) return "";
      ogDescReplaced = true;
      return `<meta property="og:description" content="${safeDescAttr}" />`;
    });

    // Replace twitter:description (deduplicating any stray duplicate tags)
    let twDescReplaced = false;
    modified = modified.replace(/<meta\s+name="twitter:description"[^>]*\/?>/gi, () => {
      if (twDescReplaced) return "";
      twDescReplaced = true;
      return `<meta name="twitter:description" content="${safeDescAttr}" />`;
    });

    // Sync SSR preloader subtitle
    modified = modified.replace(
      /(<p id="ssr-page-subtitle"[^>]*>)[\s\S]*?(<\/p>)/i,
      `$1${safeDescText}$2`
    );
  }

  const resolvedH1 = meta.h1 || meta.title;
  if (resolvedH1) {
    modified = modified.replace(
      /(<h1 id="ssr-page-h1"[^>]*>)[\s\S]*?(<\/h1>)/i,
      `$1${escapeHtmlText(resolvedH1)}$2`
    );
  }

  if (meta.url) {
    // Replace canonical & hreflang
    modified = modified.replace(/<link rel="canonical" href="[\s\S]*?" \/>/i, `<link rel="canonical" href="${meta.url}" />`);
    modified = modified.replace(/<link rel="alternate" hreflang="en" href="[\s\S]*?" \/>/i, `<link rel="alternate" hreflang="en" href="${meta.url}" />`);
    modified = modified.replace(/<link rel="alternate" hreflang="x-default" href="[\s\S]*?" \/>/i, `<link rel="alternate" hreflang="x-default" href="${meta.url}" />`);
    // Replace og:url
    modified = modified.replace(/<meta property="og:url" content="[\s\S]*?" \/>/i, `<meta property="og:url" content="${meta.url}" />`);
    // Replace twitter:url
    modified = modified.replace(/<meta name="twitter:url" content="[\s\S]*?" \/>/i, `<meta name="twitter:url" content="${meta.url}" />`);
  }

  if (meta.ogImage) {
    // Replace og:image
    modified = modified.replace(/<meta property="og:image" content="[\s\S]*?" \/>/i, `<meta property="og:image" content="${meta.ogImage}" />`);
    // Replace og:image:secure_url
    modified = modified.replace(/<meta property="og:image:secure_url" content="[\s\S]*?" \/>/i, `<meta property="og:image:secure_url" content="${meta.ogImage}" />`);
    // Replace twitter:image
    modified = modified.replace(/<meta name="twitter:image" content="[\s\S]*?" \/>/i, `<meta name="twitter:image" content="${meta.ogImage}" />`);
  }

  if (meta.ogType) {
    modified = modified.replace(/<meta property="og:type" content="[\s\S]*?" \/>/i, `<meta property="og:type" content="${meta.ogType}" />`);
  }

  if (meta.author && meta.ogType === "article") {
    const safeAuthor = escapeHtmlAttr(meta.author);
    const safeSection = escapeHtmlAttr(meta.section || "Tax Regulations");
    const articleTags = `
    <meta property="article:author" content="${safeAuthor}" />
    <meta property="article:section" content="${safeSection}" />
    ${meta.publishedTime ? `<meta property="article:published_time" content="${escapeHtmlAttr(meta.publishedTime)}" />` : ""}
    <meta property="article:publisher" content="https://www.linkedin.com/company/diasaccounting/" />
    `;
    modified = modified.replace("</head>", `${articleTags}\n  </head>`);
  }

  const isHomepage = meta.url === "https://diasuae.ae/" || meta.url === "https://diasuae.ae";

  // Strip homepage-only JSON-LD blocks on subpages so schemas never leak onto unrelated routes
  if (!isHomepage) {
    modified = modified.replace(/<script[^>]*id=["']homepage-faq-jsonld["'][^>]*>[\s\S]*?<\/script>/gi, "");
    modified = modified.replace(/<script[^>]*id=["']homepage-howto-jsonld["'][^>]*>[\s\S]*?<\/script>/gi, "");
    modified = modified.replace(/<script[^>]*id=["']page-breadcrumb-jsonld["'][^>]*>[\s\S]*?<\/script>/gi, "");
    modified = modified.replace(/<script[^>]*id=["']homepage-webpage-jsonld["'][^>]*>[\s\S]*?<\/script>/gi, "");
    modified = modified.replace(/<script[^>]*id=["']calculator-software-jsonld["'][^>]*>[\s\S]*?<\/script>/gi, "");
  }

  if (meta.schemaMarkup) {
    const jsonLd = `\n  <script type="application/ld+json" id="ssr-route-jsonld">\n${meta.schemaMarkup}\n  </script>\n`;
    modified = modified.replace("</head>", `${jsonLd}</head>`);
  }

  return modified;
}
