/**
 * Server-Side Meta & Open Graph Prerendering Engine
 * Injects dynamic, high-ranking meta tags, canonical URLs, and Open Graph cards into HTML
 * before serving to social media crawlers (Meta/Facebook, WhatsApp, LinkedIn, X/Twitter, Telegram, Slack).
 */

import fs from "fs";
import path from "path";
import { blogsData } from "../src/data/blogsData.ts";
import { draftPlaceholderPosts } from "../src/data/blogDrafts.ts";

export interface MetaOverride {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "business.business";
  author?: string;
  publishedTime?: string;
  section?: string;
  isArabic?: boolean;
  schemaMarkup?: string;
  h1?: string;
}

const KNOWN_BLOGS: Record<string, { title: string; summary: string; author: string; role: string; tag: string; date: string }> = {
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
    desc: "Certified Corporate Tax filing services in UAE. 9% return submission on EmaraTax, Small Business Relief (AED 3M) & 0% Free Zone advisory. Book review today!",
    keywords: "corporate tax filing uae, tax advisory services in dubai, tax filing services uae, tax planning services in dubai, corporate tax return emaratax, small business relief 0%, fta audit defense",
  },
  "vat-compliance": {
    title: "VAT Compliance & Filing Dubai | FTA Tax Agent | Dias UAE",
    desc: "Quarterly VAT 201 return filing, input VAT recovery, and FTA audit defense in Dubai & UAE. Eliminate fine risks with certified tax agents. Consult for free!",
    keywords: "vat compliance dubai, taxation services dubai, vat 201 return filing, vat consulting services uae, fta voluntary disclosure 211, input vat recovery, vat refund dubai",
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
    desc: "Premier business incorporation services in UAE. 100% foreign ownership company setup in Dubai Mainland (DET) and top Free Zones (SHAMS, DMCC, IFZA, DTEC). Fast-track trade licenses and corporate bank accounts.",
    keywords: "business incorporation services uae, business incorporation services in uae, company setup dubai, business setup uae, commercial license dubai, professional license uae, free zone company setup, mainland DET incorporation",
  },
  "business-incorporation-services": {
    title: "Business Incorporation Services UAE | Company Setup Dubai & Free Zones | Dias UAE",
    desc: "Premier business incorporation services in UAE. 100% foreign ownership company setup in Dubai Mainland (DET) and top Free Zones (SHAMS, DMCC, IFZA, DTEC). Fast-track trade licenses and corporate bank accounts.",
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
      const ogImg = `${baseUrl}/api/og/blog/${blogId}`;
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
              worksFor: {
                "@type": "Organization",
                name: "Dias Accounting & Tax Consulting LLC",
              },
            },
            publisher: {
              "@type": "Organization",
              name: "Dias Accounting & Tax Consulting LLC",
              url: baseUrl,
              logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/icon-192.png`,
              },
            },
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${canonicalPostUrl}#breadcrumb`,
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
              { "@type": "ListItem", position: 2, name: "Insights & Blogs", item: `${baseUrl}/blogs` },
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
    const s = KNOWN_SERVICES[serviceId];
    const encodedTitle = encodeURIComponent(s.title);
    const ogImg = `${baseUrl}/api/og?title=${encodedTitle}&author=Glen+Dias&tag=FTA+Certified+Services`;
    return {
      title: s.title,
      description: s.desc,
      keywords: s.keywords || `${s.title.toLowerCase()}, accounting Dubai, corporate tax UAE, FTA tax agent`,
      url: `${baseUrl}/services/${serviceId}`,
      ogImage: ogImg,
      ogType: "business.business",
      isArabic,
    };
  }

  // 3. UAE Tax Planner & Calculator routes
  if (
    pathname === "/uae-tax-planner" ||
    pathname === "/tax-planner" ||
    pathname === "/tax-calculator" ||
    pathname === "/calculator" ||
    searchParams.get("section") === "calculator"
  ) {
    const plannerSoftwareSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${baseUrl}/uae-tax-planner#software`,
      name: "2026 UAE Corporate Tax & 5% VAT Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: `${baseUrl}/uae-tax-planner`,
      description:
        "Free 2026 UAE Corporate Tax Calculator (Mainland 9%, 0% Small Business Relief up to AED 3M, Free Zone 0% QFZP De Minimis) and 5% UAE VAT Input Recovery Calculator by Dias Accounting and Tax Consulting LLC.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "AED",
      },
      provider: {
        "@type": "AccountingService",
        "@id": `${baseUrl}/#organization`,
        name: "Dias Accounting and Tax Consulting LLC",
      },
    });
    return {
      title: "UAE Corporate Tax & 5% VAT Calculator (2026) | Free Zone QFZP & SBR Tool | Dias Accounting",
      description: "Free 2026 UAE Corporate Tax (9%, 0% Small Business Relief & Free Zone QFZP) and 5% VAT Input Recovery Calculator by FTA-Registered Tax Agents in Dubai & Sharjah.",
      keywords: "UAE Corporate Tax Calculator 2026, 5% UAE VAT Calculator, Free Zone QFZP Calculator, Small Business Relief AED 3M, UAE VAT Input Recovery Tool, Dias Accounting",
      url: `${baseUrl}/uae-tax-planner`,
      ogImage: `${baseUrl}/api/og?title=UAE+Corporate+Tax+%26+5%25+VAT+Calculator+(2026)&author=Glen+Dias&tag=Free+Zone+QFZP+%26+SBR+Tool`,
      ogType: "website",
      isArabic,
      schemaMarkup: plannerSoftwareSchema,
      h1: "2026 UAE Corporate Tax & 5% VAT Calculator (Free Zone QFZP & SBR)",
    };
  }

  if (pathname === "/corporate-tax-calculator" || pathname === "/tax-savings" || pathname === "/tax-savings-assessment") {
    const ctCalcSoftwareSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${baseUrl}/corporate-tax-calculator#software`,
      name: "2026 UAE Corporate Tax & 5% VAT Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: `${baseUrl}/corporate-tax-calculator`,
      description:
        "Free 2026 UAE Corporate Tax Calculator (Mainland 9%, 0% Small Business Relief up to AED 3M, Free Zone 0% QFZP De Minimis) and 5% UAE VAT Input Recovery Calculator by Dias Accounting and Tax Consulting LLC.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "AED",
      },
      provider: {
        "@type": "AccountingService",
        "@id": `${baseUrl}/#organization`,
        name: "Dias Accounting and Tax Consulting LLC",
      },
    });
    return {
      title: "UAE Corporate Tax & 5% VAT Calculator (2026) | Free Zone QFZP & SBR Tool | Dias Accounting",
      description: "Free 2026 UAE Corporate Tax (9%, 0% Small Business Relief & Free Zone QFZP) and 5% VAT Input Recovery Calculator by FTA-Registered Tax Agents in Dubai & Sharjah.",
      keywords: "UAE Corporate Tax Calculator 2026, corporate tax calculator UAE, 9% tax calculator, small business relief assessment UAE, QFZP 0% corporate tax, 5% VAT calculator UAE",
      url: `${baseUrl}/corporate-tax-calculator`,
      ogImage: `${baseUrl}/api/og?title=UAE+Corporate+Tax+%26+5%25+VAT+Calculator+(2026)&author=Glen+Dias&tag=Free+Zone+QFZP+%26+SBR+Tool`,
      ogType: "website",
      isArabic,
      schemaMarkup: ctCalcSoftwareSchema,
      h1: "2026 UAE Corporate Tax & 5% VAT Calculator (Free Zone QFZP & SBR)",
    };
  }

  if (pathname === "/uae-vat-calculator" || pathname === "/vat-calculator" || pathname === "/vat-planner") {
    return {
      title: "UAE VAT Calculator & 5% Compliance Planner 2026 | Dias UAE",
      description: "Calculate net UAE 5% VAT payable or refundable for your quarterly FTA Form 201 return. Check AED 375,000 mandatory VAT registration thresholds.",
      keywords: "UAE VAT calculator, 5% VAT planner Dubai, FTA Form 201 calculator, VAT registration threshold UAE AED 375k",
      url: `${baseUrl}/uae-vat-calculator`,
      ogImage: `${baseUrl}/api/og?title=UAE+5%25+VAT+Calculator+%26+Compliance+Planner&author=Glen+Dias&tag=FTA+Form+201`,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/fta-deadlines" || pathname === "/tax-deadlines" || pathname === "/deadline-calculator") {
    return {
      title: "UAE Corporate Tax & VAT Deadlines Planner 2026 | Dias UAE",
      description: "Calculate exact FTA EmaraTax filing deadlines for UAE Corporate Tax (9-month rule) and VAT 201 returns to avoid AED 10,000 administrative fines.",
      keywords: "UAE corporate tax deadline 2026, FTA EmaraTax due dates, VAT filing calendar UAE, Cabinet Decision 75 penalty shield",
      url: `${baseUrl}/fta-deadlines`,
      ogImage: `${baseUrl}/api/og?title=UAE+Corporate+Tax+%26+VAT+Deadlines+2026&author=Glen+Dias&tag=Penalty+Prevention`,
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
          "name": "What is included in Dias Accounting's fixed-fee accounting packages in Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our monthly retainers (starting from AED 400 to AED 2,500/month) cover a dedicated chartered accountant, cloud software setup (Zoho Books, QuickBooks, Xero), monthly bank and card reconciliations, IFRS Profit & Loss and Balance Sheet statements, quarterly VAT 201 return filings, and annual Corporate Tax return preparation on EmaraTax. There are zero hourly fees or surprise billing charges."
          }
        },
        {
          "@type": "Question",
          "name": "How much does corporate tax filing cost for UAE mainland and Free Zone companies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For businesses maintaining clean monthly books with Dias Accounting, annual Corporate Tax return filing is bundled into our comprehensive tiers. For standalone Corporate Tax filing without monthly bookkeeping, our fixed preparation fee starts at AED 1,500 for entities claiming 0% Small Business Relief (SBR) up to AED 3M, and AED 2,500 to AED 4,500 for standard 9% or 0% QFZP Free Zone returns."
          }
        },
        {
          "@type": "Question",
          "name": "Are Corporate Tax returns (9%) and VAT 201 filings included in the monthly accounting fee?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Our Growth and Enterprise plans include full quarterly VAT 201 return submissions and annual Corporate Tax return filing on the FTA EmaraTax portal. Our Essential tier (from AED 400/month on annual billing) covers ongoing bookkeeping and quarterly VAT, with an optional discounted annual corporate tax filing add-on."
          }
        },
        {
          "@type": "Question",
          "name": "What are the penalties if my UAE company delays historical backlog bookkeeping?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Under Cabinet Decision No. 75 of 2023, failing to register for Corporate Tax on time incurs an automatic AED 10,000 fine. Failing to maintain required accounting records for at least 5 years triggers penalties starting at AED 10,000 for a first violation and AED 20,000 for repeats. Our Backlog Catch-Up packages (from AED 2,500/year) reconstruct missing ledgers within 5 to 7 business days to eliminate fine exposure."
          }
        },
        {
          "@type": "Question",
          "name": "Can DIFC, DTEC, and Free Zone companies choose standard SME accounting packages?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. We offer specialized Free Zone and DIFC accounting tiers that factor in annual IFRS audited accounts, 0% Qualifying Free Zone Person (QFZP) de minimis tests, and OECD Article 34 transfer pricing compliance."
          }
        }
      ]
    });
    return {
      title: "UAE Accounting & Bookkeeping Packages From AED 400/Mo | Fixed-Fee Tax Retainers",
      description: "Transparent fixed-fee monthly IFRS accounting, 5% VAT Form 201 & 9% Corporate Tax packages in Dubai & Sharjah. Zero hidden hourly fees — get an instant quote today.",
      keywords: "Corporate Tax, accounting packages dubai, monthly accounting package dubai, fixed fee bookkeeping uae, corporate tax return fee, corporate tax consultants in difc, accounting solutions in uae",
      url: `${baseUrl}/pricing`,
      ogImage: `${baseUrl}/api/og?title=UAE+Accounting+%26+Bookkeeping+Packages+From+AED+400%2FMo&author=Dias+Tax+Team&tag=Fixed-Fee+Tax+Retainers`,
      ogType: "website",
      isArabic,
      schemaMarkup: pricingFaqSchema,
      h1: "Fixed-Fee UAE Accounting, Bookkeeping & Tax Packages (From AED 400/Mo)",
    };
  }

  // 5. Dedicated SEO Service Landing Pages
  if (pathname === "/tax-services-dubai" || pathname === "/tax-services-dubai.html") {
    return {
      title: "Tax Services in Dubai & Corporate Tax Agency | Dias UAE",
      description: "Avoid penalties and stay compliant with expert Tax Services in Dubai. Dias Accounting provides Corporate Tax (9%), DIFC tax compliance, and VAT returns.",
      keywords: "tax services in dubai, corporate tax agency dubai, vat compliance dubai, corporate tax consultants in difc, tax preparation services uae, fta tax agent dubai, emaratax corporate tax filing",
      url: `${baseUrl}/tax-services-dubai`,
      ogImage: `${baseUrl}/api/og?title=Expert+Tax+Services+in+Dubai&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=Tax+Agency+Dubai`,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/accounting-services-uae" || pathname === "/accounting-services-uae.html") {
    return {
      title: "Trusted Accounting Services UAE | Expert Bookkeeping | Dias UAE",
      description: "Scale your business with premier accounting services in the UAE. From DTEC startups to established mainland firms, get accurate bookkeeping and financial reporting.",
      keywords: "accounting services uae, bookkeeping dubai, chartered accountants dubai, outsourced accounting uae, ifrs financial statements dubai, dtec accounting",
      url: `${baseUrl}/accounting-services-uae`,
      ogImage: `${baseUrl}/api/og?title=Trusted+Accounting+Services+UAE&author=Glen+Dias&role=Senior+Accounting+Advisor&tag=Bookkeeping+UAE`,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/tax-planning-difc" || pathname === "/tax-planning-difc.html") {
    const difcTitle = "DIFC & DTEC Accounting, 0% QFZP Tax & Dividend Audits Dubai | Dias Accounting";
    const difcDesc =
      "FTA-Registered Tax Agents serving DIFC & DTEC companies. Statutory interim/final dividend audits, 0% QFZP compliance & monthly IFRS bookkeeping from AED 400/mo.";
    const difcSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["AccountingService", "LocalBusiness", "ProfessionalService"],
          "@id": `${baseUrl}/#organization`,
          name: "Dias Accounting and Tax Consulting LLC",
          url: `${baseUrl}/tax-planning-difc`,
          description:
            "FTA-Registered Tax Agents headquartered in Sharjah Media City (SHAMS), serving DIFC, DTEC, and Dubai Free Zones with DIFC Corporate Tax Planning, DTEC Accounting & Bookkeeping, 0% QFZP Compliance, DIFC Interim & Final Dividend Distribution Audits, and 5% UAE VAT Filing starting from AED 400/month.",
          telephone: "+971-52-922-6958",
          email: "info@diasuae.ae",
          priceRange: "From AED 400/month",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Sharjah Media City (SHAMS), Al Messaned",
            addressLocality: "Sharjah",
            addressRegion: "Sharjah",
            postOfficeBoxNumber: "P.O. Box 515000",
            addressCountry: "AE",
          },
          areaServed: ["DIFC", "DTEC", "Dubai Free Zones", "Dubai", "Sharjah", "United Arab Emirates"],
          knowsAbout: [
            "DIFC Corporate Tax Planning",
            "DTEC Accounting & Bookkeeping",
            "0% Qualifying Free Zone Person (QFZP) Compliance",
            "DIFC Interim & Final Dividend Distribution Audits",
            "5% UAE VAT Filing",
          ],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "DIFC & DTEC Tax Planning, Accounting & Audit Services (From AED 400/month)",
            itemListElement: [
              {
                "@type": "Offer",
                price: "400",
                priceCurrency: "AED",
                itemOffered: { "@type": "Service", name: "DIFC Corporate Tax Planning" },
              },
              {
                "@type": "Offer",
                price: "400",
                priceCurrency: "AED",
                itemOffered: { "@type": "Service", name: "DTEC Accounting & Bookkeeping" },
              },
              {
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: "0% Qualifying Free Zone Person (QFZP) Compliance" },
              },
              {
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: "DIFC Interim & Final Dividend Distribution Audits" },
              },
              {
                "@type": "Offer",
                price: "400",
                priceCurrency: "AED",
                itemOffered: { "@type": "Service", name: "5% UAE VAT Filing" },
              },
            ],
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${baseUrl}/tax-planning-difc#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
            { "@type": "ListItem", position: 2, name: "Free Zone Services", item: `${baseUrl}/services` },
            {
              "@type": "ListItem",
              position: 3,
              name: "DIFC & DTEC Corporate Tax Planning, 0% QFZP & Dividend Audits",
              item: `${baseUrl}/tax-planning-difc`,
            },
          ],
        },
        {
          "@type": "FAQPage",
          "@id": `${baseUrl}/tax-planning-difc#faqs`,
          mainEntity: [
            {
              "@type": "Question",
              name: "How do DIFC & DTEC entities qualify for 0% Corporate Tax under the QFZP regime?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Under Federal Decree-Law No. 47 of 2022 and Cabinet Decision No. 55 of 2023, DIFC and DTEC entities qualify for a 0% Corporate Tax rate as a Qualifying Free Zone Person (QFZP) on Qualifying Income only if they: (1) maintain adequate economic substance and qualified personnel inside the Free Zone, (2) derive Qualifying Income from qualifying activities or other Free Zone persons, (3) keep non-qualifying revenue within the de minimis limit (lower of 5% of total revenue or AED 5,000,000), (4) comply with arm's length Transfer Pricing rules, and (5) prepare annual audited IFRS financial statements.",
              },
            },
            {
              "@type": "Question",
              name: "Are audited IFRS financial statements mandatory for DIFC and DTEC companies?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Maintaining and submitting annual financial statements prepared under International Financial Reporting Standards (IFRS) and audited by a UAE-licensed auditor is mandatory for DFSA-regulated DIFC entities, DTEC Free Zone license renewals, and all Qualifying Free Zone Persons (QFZPs) claiming the 0% Corporate Tax rate regardless of annual revenue.",
              },
            },
            {
              "@type": "Question",
              name: "How does UAE dividend audit certification work for DIFC and holding companies?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Under UAE Federal Decree-Law No. 32 of 2021 (Commercial Companies Law) and DIFC Companies Law, companies distributing dividends must verify realized distributable profits through a statutory Dividend Audit certification before passing board resolutions. Furthermore, under Article 23 of UAE Corporate Tax Law, dividends received from qualifying UAE or foreign shareholdings (at least 5% ownership held for 12 months) are exempt from Corporate Tax under the Participation Exemption.",
              },
            },
            {
              "@type": "Question",
              name: "What are the transfer pricing requirements for DIFC businesses?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Under Article 34 of the UAE Corporate Tax Law, all transactions with Related Parties and Connected Persons must satisfy the Arm's Length Principle. DIFC entities exceeding FTA thresholds must submit an annual Transfer Pricing Disclosure Form on EmaraTax and maintain Local File and Master File documentation.",
              },
            },
            {
              "@type": "Question",
              name: "Why should CFOs hire certified corporate tax consultants in DIFC and DTEC?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "DIFC common law entities and DTEC venture-backed companies must coordinate DFSA/DIFC reporting with Federal Tax Authority (FTA) EmaraTax compliance. Certified FTA-registered tax consultants prevent accidental 5-year QFZP disqualifications, audit de minimis ratios quarterly, and ensure seamless IFRS audit readiness.",
              },
            },
          ],
        },
      ],
    });
    return {
      title: difcTitle,
      description: difcDesc,
      keywords: "DIFC Corporate Tax Planning, DTEC Accounting & Bookkeeping, 0% Qualifying Free Zone Person (QFZP) Compliance, DIFC Interim & Final Dividend Distribution Audits, 5% UAE VAT Filing, DIFC Tax Compliance, Corporate Tax Consultants in DIFC",
      url: `${baseUrl}/tax-planning-difc`,
      ogImage: `${baseUrl}/api/og?title=DIFC+%26+DTEC+Corporate+Tax+Planning%2C+0%25+QFZP+%26+Dividend+Audits&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=From+AED+400%2Fmo`,
      ogType: "website",
      isArabic,
      schemaMarkup: difcSchema,
      h1: "DIFC & DTEC Corporate Tax Planning, 0% QFZP & Dividend Audits",
    };
  }

  if (pathname === "/corporate-tax-consulting-dubai" || pathname === "/corporate-tax-consulting-dubai.html") {
    return {
      title: "Corporate Tax Services UAE Mainland & Free Zone | Dias Accounting",
      description: "Navigate the UAE 9% corporate tax regime with confidence. From registration to QFZP assessments and return filing, ensure 100% FTA compliance.",
      keywords: "corporate tax consulting dubai, corporate tax uae, qfzp assessment 0% tax, uae corporate tax registration, emaratax corporate tax filing, shams free zone tax consultant",
      url: `${baseUrl}/corporate-tax-consulting-dubai`,
      ogImage: `${baseUrl}/api/og?title=Corporate+Tax+Services+UAE+Mainland+%26+Free+Zone&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=Corporate+Tax`,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/small-business-tax-relief") {
    return {
      title: "Small Business Corporate Tax Relief Dubai | Dias UAE",
      description: "Comprehensive advisory on UAE Small Business Relief (SBR) under Ministerial Decision No. 73/2023. SBR extended through Dec 31, 2029 for businesses with gross revenue up to AED 3M, 0% corporate tax rate, and EmaraTax registration support.",
      keywords: "small business tax relief dubai, UAE small business relief 2029, SBR AED 3M revenue, 0% corporate tax dubai, EmaraTax SBR registration, article 21 corporate tax UAE",
      url: `${baseUrl}/small-business-tax-relief`,
      ogImage: `${baseUrl}/api/og?title=Small+Business+Corporate+Tax+Relief+Dubai+(0%25+Tax)&author=Glen+Dias&tag=SBR+Extended+to+2029`,
      ogType: "website",
      isArabic,
    };
  }

  if (
    pathname === "/difc-dtec-accounting" ||
    pathname === "/dtec-accounting" ||
    pathname === "/accounting-services-in-dtec"
  ) {
    const difcDtecTitle = "DIFC & DTEC Tax Planning & Accounting Dubai | Dias UAE";
    const difcDtecDesc =
      "Specialist DIFC & DTEC accounting, 0% QFZP Corporate Tax structuring, DFSA compliance & dividend audit services in Dubai by FTA-registered tax agents.";
    const difcDtecSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["AccountingService", "ProfessionalService"],
          name: "Dias Accounting - DIFC & DTEC Tax Planning & Accounting",
          url: `${baseUrl}/difc-dtec-accounting`,
          description: difcDtecDesc,
          telephone: "+971-52-922-6958",
          email: "info@diasuae.ae",
          priceRange: "AED 400 - AED 4,500",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Sharjah Media City (SHAMS), Al Messaned",
            addressLocality: "Sharjah",
            addressRegion: "Sharjah",
            postOfficeBoxNumber: "P.O. Box 515000",
            addressCountry: "AE",
          },
          areaServed: ["Dubai", "Sharjah", "United Arab Emirates"],
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${baseUrl}/difc-dtec-accounting#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
            { "@type": "ListItem", position: 2, name: "Free Zone Services", item: `${baseUrl}/services` },
            { "@type": "ListItem", position: 3, name: "DIFC & DTEC Tax Planning & Accounting", item: `${baseUrl}/difc-dtec-accounting` },
          ],
        },
        {
          "@type": "FAQPage",
          "@id": `${baseUrl}/difc-dtec-accounting#faqs`,
          mainEntity: [
            {
              "@type": "Question",
              name: "How do DIFC & DTEC entities qualify for 0% Corporate Tax under the QFZP regime?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Under Federal Decree-Law No. 47 of 2022 and Cabinet Decision No. 55 of 2023, DIFC and DTEC entities qualify for a 0% Corporate Tax rate as a Qualifying Free Zone Person (QFZP) on Qualifying Income only if they: (1) maintain adequate economic substance and qualified personnel inside the Free Zone, (2) derive Qualifying Income from qualifying activities or other Free Zone persons, (3) keep non-qualifying revenue within the de minimis limit (lower of 5% of total revenue or AED 5,000,000), (4) comply with arm's length Transfer Pricing rules, and (5) prepare annual audited IFRS financial statements.",
              },
            },
            {
              "@type": "Question",
              name: "Are audited IFRS financial statements mandatory for DIFC and DTEC companies?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Maintaining and submitting annual financial statements prepared under International Financial Reporting Standards (IFRS) and audited by a UAE-licensed auditor is mandatory for DFSA-regulated DIFC entities, DTEC Free Zone license renewals, and all Qualifying Free Zone Persons (QFZPs) claiming the 0% Corporate Tax rate regardless of annual revenue.",
              },
            },
            {
              "@type": "Question",
              name: "How does UAE dividend audit certification work for DIFC and holding companies?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Under UAE Federal Decree-Law No. 32 of 2021 (Commercial Companies Law) and DIFC Companies Law, companies distributing dividends must verify realized distributable profits through a statutory Dividend Audit certification before passing board resolutions. Furthermore, under Article 23 of UAE Corporate Tax Law, dividends received from qualifying UAE or foreign shareholdings (at least 5% ownership held for 12 months) are exempt from Corporate Tax under the Participation Exemption.",
              },
            },
            {
              "@type": "Question",
              name: "What are the transfer pricing requirements for DIFC businesses?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Under Article 34 of the UAE Corporate Tax Law, all transactions with Related Parties and Connected Persons must satisfy the Arm's Length Principle. DIFC entities exceeding FTA thresholds must submit an annual Transfer Pricing Disclosure Form on EmaraTax and maintain Local File and Master File documentation.",
              },
            },
            {
              "@type": "Question",
              name: "Why should CFOs hire certified corporate tax consultants in DIFC and DTEC?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "DIFC common law entities and DTEC venture-backed companies must coordinate DFSA/DIFC reporting with Federal Tax Authority (FTA) EmaraTax compliance. Certified FTA-registered tax consultants prevent accidental 5-year QFZP disqualifications, audit de minimis ratios quarterly, and ensure seamless IFRS audit readiness.",
              },
            },
          ],
        },
      ],
    });
    return {
      title: difcDtecTitle,
      description: difcDtecDesc,
      keywords: "accounting services in dtec, tax consultant in difc, DIFC Tax Compliance, DTEC accounting Dubai, 0% QFZP Corporate Tax, DFSA audit readiness, dividend audit certification UAE",
      url: `${baseUrl}/difc-dtec-accounting`,
      ogImage: `${baseUrl}/api/og?title=DIFC+%26+DTEC+Tax+Planning+%26+Accounting+Dubai&author=Glen+Dias&tag=Free+Zone+0%25+QFZP+Advisory`,
      ogType: "website",
      isArabic,
      schemaMarkup: difcDtecSchema,
    };
  }

  if (
    pathname === "/dividends-audit" ||
    pathname === "/dividends-audit-dubai" ||
    pathname === "/dividends-audit-uae"
  ) {
    return {
      title: "Dividends Audit Dubai & UAE | Statutory Audit Services for Dividends | Dias UAE",
      description: "Statutory dividends audit Dubai and UAE. Licensed audit services for dividends under UAE Commercial Companies Law, distributable profit certification, 0% tax dividend distribution, and corporate tax compliance.",
      keywords: "dividends audit dubai, dividends audit uae, audit services for dividends uae, dividend audit Dubai, dividend distribution certification, commercial companies law dividends, 0% dividend tax UAE",
      url: `${baseUrl}/dividends-audit`,
      ogImage: `${baseUrl}/api/og?title=Dividends+Audit+Dubai+%26+UAE+(Statutory+Certification)&author=Glen+Dias&tag=Commercial+Companies+Law`,
      ogType: "website",
      isArabic,
    };
  }

  if (
    pathname === "/services/business-incorporation-services" ||
    pathname === "/services/business-incorporation" ||
    pathname === "/business-incorporation-services" ||
    pathname === "/business-incorporation"
  ) {
    const canonicalPath = pathname.startsWith("/services/") ? pathname : `/services/${pathname.replace("/", "")}`;
    return {
      title: "Business Incorporation Services UAE | Company Setup Dubai & Free Zones | Dias UAE",
      description: "Premier business incorporation services in UAE. 100% foreign ownership company setup in Dubai Mainland (DET) and top Free Zones (SHAMS, DMCC, IFZA, DTEC). Fast-track trade licenses and corporate bank accounts.",
      keywords: "business incorporation services uae, business incorporation services in uae, company setup dubai, business setup uae, commercial license dubai, professional license uae, free zone company setup, mainland DET incorporation",
      url: `${baseUrl}${canonicalPath}`,
      ogImage: `${baseUrl}/api/og?title=Business+Incorporation+Services+in+UAE&author=Dias+Corporate+Desk&tag=100%25+Foreign+Ownership`,
      ogType: "business.business",
      isArabic,
    };
  }

  if (pathname === "/services") {
    return {
      title: "Corporate Tax, VAT & Accounting Services in Dubai | Dias UAE",
      description: "Certified Corporate Tax, VAT filing, backlog bookkeeping, and DIFC tax compliance across Dubai and all 7 UAE Emirates. Schedule a free consultation today.",
      keywords: "Corporate Tax, Tax Services in Dubai, DIFC Tax Compliance, tax consulting services in uae, tax advisory services in dubai, corporate tax registration, vat returns dubai, ifrs bookkeeping uae",
      url: `${baseUrl}/services`,
      ogImage: `${baseUrl}/api/og?title=Corporate+Tax%2C+VAT+%26+Accounting+Services+in+Dubai&author=Glen+Dias&tag=8+Practice+Areas`,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/company-setup") {
    return {
      title: "SHAMS Free Zone & Dubai Mainland Company Setup + Tax Registration (2026)",
      description: "Launch your SHAMS Free Zone or Dubai Mainland LLC with full EmaraTax Corporate Tax & 5% VAT registration. Fixed-fee monthly accounting from AED 400/mo.",
      keywords: "UAE Company Setup, Corporate Tax, company setup dubai, free zone license uae, shams incorporation, dmcc company formation, ifza visa setup, 0% QFZP corporate tax uae",
      url: `${baseUrl}/company-setup`,
      ogImage: `${baseUrl}/api/og?title=SHAMS+Free+Zone+%26+Dubai+Mainland+Company+Setup&author=Dias+Corporate+Desk&tag=Tax+Registration+2026`,
      ogType: "website",
      isArabic,
      h1: "UAE Mainland & Free Zone Company Formation & Tax Registration",
    };
  }

  if (pathname === "/why-choose-us") {
    return {
      title: "Why Dias Accounting | FTA Certified Tax Agency Dubai | Dias UAE",
      description: "Discover the 6 foundational pillars that make Dias Accounting the trusted choice for 500+ UAE enterprises: FTA certified agents, unlimited transactions, and direct client WhatsApp channels.",
      keywords: "why dias accounting, fta registered tax agency, certified tax agent glen dias, corporate tax advisory firm dubai",
      url: `${baseUrl}/why-choose-us`,
      ogImage: `${baseUrl}/api/og?title=Why+Dias+Accounting+%26+Tax+Consulting&author=Glen+Dias&tag=6+Core+Pillars`,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/about") {
    return {
      title: "About Dias Accounting | Chartered Tax Consultants in Dubai & UAE",
      description: "Led by Senior Tax Advisor Glen Dias, Dias Accounting delivers high-precision Corporate Tax advisory, VAT compliance, and IFRS accounting services across Dubai, Sharjah & UAE.",
      keywords: "Glen Dias tax advisor, Dias Accounting LLC, certified tax consultant Dubai, tax consulting services in uae, tax advisory services in dubai",
      url: `${baseUrl}/about`,
      ogImage: `${baseUrl}/api/og?title=About+Glen+Dias+%26+Certified+Tax+Advisors+Dubai&author=Glen+Dias&tag=FTA+Registered+Agent`,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/blog" || pathname === "/blogs" || pathname === "/insights") {
    const blogsTitle = "UAE Corporate Tax, VAT & Accounting Insights 2026 | Dias UAE";
    const blogsDesc =
      "Latest 2026 UAE Federal Tax Authority (FTA) updates, 9% Corporate Tax guides, 5% VAT audit checklists, and IFRS accounting insights by Dias Accounting.";
    const blogsSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${baseUrl}/blogs#collection`,
          url: `${baseUrl}/blogs`,
          name: blogsTitle,
          description: blogsDesc,
          isPartOf: {
            "@type": "WebSite",
            "@id": `${baseUrl}/#website`,
            name: "Dias Accounting & Tax Consulting LLC",
            url: `${baseUrl}/`,
          },
          publisher: {
            "@type": "Organization",
            name: "Dias Accounting & Tax Consulting LLC",
            url: baseUrl,
          },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${baseUrl}/blogs#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
            { "@type": "ListItem", position: 2, name: "Insights & Blogs", item: `${baseUrl}/blogs` },
          ],
        },
      ],
    });
    return {
      title: blogsTitle,
      description: blogsDesc,
      keywords: "UAE Corporate Tax Insights 2026, FTA Updates 2026, 9% Corporate Tax Guides, 5% VAT Audit Checklists, IFRS Accounting Insights Dubai, Dias Accounting",
      url: `${baseUrl}/blogs`,
      ogImage: `${baseUrl}/api/og?title=UAE+Corporate+Tax%2C+VAT+%26+Accounting+Insights+2026&author=Glen+Dias&tag=Official+Briefings`,
      ogType: "website",
      isArabic,
      schemaMarkup: blogsSchema,
      h1: "Corporate Tax Insights, DIFC Tax Compliance & UAE Regulations Hub",
    };
  }

  if (pathname === "/testimonials" || pathname === "/reviews") {
    return {
      title: "Client Reviews & Verified 5.0★ Feedback | Dias UAE",
      description: "Verified 5.0★ Google Reviews and measurable case study outcomes from 500+ UAE mainland LLCs and free zone enterprises managed by Dias Accounting.",
      keywords: "dias accounting reviews, google reviews tax consultant dubai, fta tax agent testimonials uae",
      url: `${baseUrl}/testimonials`,
      ogImage: `${baseUrl}/api/og?title=Client+Reviews+%26+5.0+Star+Feedback&author=Dias+Accounting&tag=500%2B+Clients`,
      ogType: "website",
      isArabic,
      h1: "What UAE Founders & Business Owners Say About Dias",
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
      title: "UAE Tax & Accounting FAQs | Dias UAE",
      description: "Instant, authoritative answers to top questions on the 9% UAE Corporate Tax, AED 3M Small Business Relief, 0% QFZP Free Zone conditions, and VAT201 filing.",
      keywords: "uae tax faqs, corporate tax questions dubai, small business relief faq, vat compliance answers",
      url: `${baseUrl}/faqs`,
      ogImage: `${baseUrl}/api/og?title=UAE+Tax+%26+Accounting+FAQs&author=Glen+Dias&tag=Authoritative+Answers`,
      ogType: "website",
      isArabic,
      schemaMarkup: faqsBreadcrumbSchema,
      h1: "UAE Corporate Tax, VAT & Bookkeeping FAQs",
    };
  }

  if (pathname === "/contact" || pathname === "/book-consultation") {
    return {
      title: "Book Tax Consultation & Office Desk | Dias UAE",
      description: "Schedule a confidential consultation with Glen Dias, FTA Registered Tax Agent. Office location in SHAMS Business Center & Dubai with direct WhatsApp advisory.",
      keywords: "contact tax consultant dubai, book tax consultation uae, fta tax agent phone number, dias accounting office",
      url: `${baseUrl}/contact`,
      ogImage: `${baseUrl}/api/og?title=Schedule+Confidential+Tax+Consultation&author=Glen+Dias&tag=FTA+Registered+Agent`,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/privacy-policy" || pathname === "/privacy") {
    return {
      title: "Privacy Policy & UAE Data Protection | Dias Accounting",
      description: "Privacy Policy and UAE Federal Decree-Law No. 45 Personal Data Protection commitments for Dias Accounting & Tax Consulting LLC.",
      keywords: "Dias Accounting privacy policy, UAE PDPL compliance, client confidentiality tax advisory",
      url: `${baseUrl}/privacy-policy`,
      ogImage: `${baseUrl}/api/og?title=Privacy+Policy+%26+UAE+Data+Protection&author=Dias+Accounting&tag=Client+Confidentiality`,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/terms" || pathname === "/terms-of-service" || pathname === "/terms-and-conditions") {
    return {
      title: "Terms of Service & Engagement | Dias Accounting UAE",
      description: "Terms of Service, statutory advisory engagement scope, and compliance policies for Dias Accounting & Tax Consulting LLC in Dubai & Sharjah.",
      keywords: "Dias Accounting terms of service, UAE tax engagement terms, FTA agency compliance",
      url: `${baseUrl}/terms`,
      ogImage: `${baseUrl}/api/og?title=Terms+of+Service+%26+Engagement&author=Dias+Accounting&tag=UAE+Tax+Agency`,
      ogType: "website",
      isArabic,
    };
  }

  // 6. Default Fallback (Optimized for Homepage)
  return {
    title: isArabic
      ? "استشارات ضريبة الشركات والمحاسبة في دبي | دياس للمحاسبة الإمارات"
      : "FTA-Registered Tax Agents Dubai & Sharjah | Accounting From AED 400/Mo",
    description: isArabic
      ? "استشارات ضريبة الشركات، والامتثال لضريبة القيمة المضافة، والخدمات المحاسبية في دبي والإمارات. باقات محاسبية واضحة تبدأ من 400 درهم/شهرياً."
      : "Double-entry IFRS bookkeeping, 5% UAE VAT & 9% Corporate Tax filings by FTA-Registered Tax Agents in Dubai & Sharjah (SHAMS). Fixed fees from AED 400/mo — free 15-min check.",
    keywords: isArabic
      ? "ضريبة الشركات, خدمات المحاسبة والضرائب في دبي, شركات الضرائب في الإمارات, خدمات إعداد وتخطيط الضرائب, أفضل مكتب محاسبة في الإمارات, تدقيق مخاطر الغرامات 60 ثانية, تمثيل دفاعي الهيئة الاتحادية للضرائب, خيارات إعفاء ضريبة الشركات 0%, تسهيلات الأعمال الصغيرة 3 مليون, أفضل شركات المحاسبة في دبي, مستشار ضريبي معتمد, ضريبة الشركات دبي 9%, تسجيل ضريبة القيمة المضافة"
      : "Corporate Tax, Tax Services in Dubai, DIFC Tax Compliance, Corporate Tax Consultants in DIFC, tax and accounting services, tax accounting services, accounting services uae, tax firms in uae, tax and financial planning services, tax preparation and planning services, what tax advisory and accounting packages are available in dubai, accounting consultancy in dubai, taxation services dubai, accounting advisory services uae, accounting packages dubai, auditing firms in sharjah, Chartered Accountants in Dubai",
    url: `${baseUrl}/`,
    ogImage: `${baseUrl}/api/og?title=UAE+Corporate+Tax+%26+Accounting+Firm+Dubai&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=Dias+Accounting&readTime=FTA+Certified`,
    ogType: "business.business",
    isArabic,
    h1: isArabic
      ? "مكتب استشارات ضريبة الشركات والمحاسبة المعتمد في دبي والشارقة"
      : "FTA-Registered Tax Agents & IFRS Accounting Firm in Dubai & Sharjah",
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
    const safeDescText = escapeHtmlText(meta.description);
    const safeDescAttr = escapeHtmlAttr(meta.description);
    // Replace meta description
    modified = modified.replace(/<meta name="description" content="[\s\S]*?" \/>/i, `<meta name="description" content="${safeDescAttr}" />`);
    // Replace og:description
    modified = modified.replace(/<meta property="og:description" content="[\s\S]*?" \/>/i, `<meta property="og:description" content="${safeDescAttr}" />`);
    // Replace twitter:description
    modified = modified.replace(/<meta name="twitter:description" content="[\s\S]*?" \/>/i, `<meta name="twitter:description" content="${safeDescAttr}" />`);
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
    // Inject article tags before </head>
    const articleTags = `
    <meta property="article:author" content="${meta.author}" />
    <meta property="article:section" content="${meta.section || 'Tax Regulations'}" />
    ${meta.publishedTime ? `<meta property="article:published_time" content="${meta.publishedTime}" />` : ''}
    <meta property="article:publisher" content="https://www.linkedin.com/company/dias-accounting-and-tax-consulting" />
    `;
    modified = modified.replace("</head>", `${articleTags}\n  </head>`);
  }

  const isHomepage = meta.url === "https://diasuae.ae/" || meta.url === "https://diasuae.ae";
  const isFaqsPage = meta.url === "https://diasuae.ae/faqs";

  // Strip homepage-only JSON-LD blocks on subpages so schemas never leak onto unrelated routes
  if (!isHomepage && !isFaqsPage) {
    modified = modified.replace(/<script[^>]*id=["']homepage-faq-jsonld["'][^>]*>[\s\S]*?<\/script>/gi, "");
  }
  if (!isHomepage) {
    modified = modified.replace(/<script[^>]*id=["']homepage-howto-jsonld["'][^>]*>[\s\S]*?<\/script>/gi, "");
    modified = modified.replace(/<script[^>]*id=["']page-breadcrumb-jsonld["'][^>]*>[\s\S]*?<\/script>/gi, "");
    modified = modified.replace(/<script[^>]*id=["']homepage-webpage-jsonld["'][^>]*>[\s\S]*?<\/script>/gi, "");
    modified = modified.replace(/<script[^>]*id=["']calculator-software-jsonld["'][^>]*>[\s\S]*?<\/script>/gi, "");
  }

  if (meta.schemaMarkup) {
    const jsonLd = `\n  <script type="application/ld+json">\n${meta.schemaMarkup}\n  </script>\n`;
    modified = modified.replace("</head>", `${jsonLd}</head>`);
  }

  return modified;
}
