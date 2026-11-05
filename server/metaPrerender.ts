/**
 * Server-Side Meta & Open Graph Prerendering Engine
 * Injects dynamic, high-ranking meta tags, canonical URLs, and Open Graph cards into HTML
 * before serving to social media crawlers (Meta/Facebook, WhatsApp, LinkedIn, X/Twitter, Telegram, Slack).
 */

import fs from "fs";
import path from "path";

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
}

const KNOWN_BLOGS: Record<string, { title: string; summary: string; author: string; role: string; tag: string; date: string }> = {
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
    author: "Michael Chen",
    role: "Corporate Services Director",
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
  const urlObj = new URL(reqUrl, `https://${host}`);
  const pathname = urlObj.pathname.toLowerCase();
  const searchParams = urlObj.searchParams;
  const isArabic = searchParams.get("lang") === "ar";
  const baseUrl = `https://${host}`;

  // 1. Direct Blog post match (/blog/:id or ?blog=:id)
  let blogId = "";
  if (pathname.startsWith("/blog/")) {
    blogId = pathname.replace("/blog/", "").replace(/\.(html|php|aspx)$/, "").trim();
  } else if (searchParams.has("blog")) {
    blogId = searchParams.get("blog") || "";
  }

  if (blogId) {
    let blog = KNOWN_BLOGS[blogId];
    let dynamicSchema: string | undefined = undefined;

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
      return {
        title: `${blog.title} | Dias Accounting Dubai`,
        description: blog.summary,
        keywords: `UAE tax guide, ${blog.tag}, corporate tax Dubai, FTA compliance, ${blog.title.toLowerCase()}`,
        url: `${baseUrl}/#blog-${blogId}`,
        ogImage: ogImg,
        ogType: "article",
        author: blog.author,
        publishedTime: `${blog.date}T09:00:00+04:00`,
        section: blog.tag,
        isArabic,
        schemaMarkup: dynamicSchema,
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

  // 3. Calculator route
  if (pathname === "/calculator" || searchParams.get("section") === "calculator") {
    return {
      title: "UAE Corporate Tax Calculator 2026 | Free 9% Tax Tool | Dias Accounting",
      description: "Calculate your UAE Corporate Tax liability instantly. Accurately estimate 9% tax above AED 375,000 threshold and verify Small Business Relief (AED 3M) eligibility.",
      url: `${baseUrl}/#calculator`,
      ogImage: `${baseUrl}/api/og?title=UAE+Corporate+Tax+Calculator+2026+(Free+9%25+Tool)&author=Glen+Dias&tag=Free+Interactive+Tool`,
      ogType: "website",
      isArabic,
    };
  }

  // 4. Pricing route
  if (pathname === "/pricing" || searchParams.get("section") === "pricing") {
    return {
      title: "Transparent Accounting Packages Dubai | From AED 400/mo",
      description: "No hidden fees. Fixed-price monthly accounting, Corporate Tax (9%) & VAT compliance packages for UAE Mainland & Free Zone businesses. View all pricing tiers!",
      keywords: "accounting solutions in uae, transparent pricing tax solutions uae, monthly accounting package dubai, fixed fee bookkeeping uae, corporate tax return fee",
      url: `${baseUrl}/pricing`,
      ogImage: `${baseUrl}/api/og?title=Fixed-Fee+UAE+Accounting+%26+Corporate+Tax+Packages&author=Dias+Tax+Team&tag=From+AED+400%2Fmo`,
      ogType: "website",
      isArabic,
    };
  }

  // 5. Dedicated SEO Service Landing Pages
  if (pathname === "/tax-services-dubai" || pathname === "/tax-services-dubai.html") {
    return {
      title: "Expert Tax Services in Dubai | VAT & Corporate Tax Agency",
      description: "Avoid penalties and stay compliant with expert tax services in Dubai. Dias Accounting and Tax Consulting LLC provides corporate tax, VAT, and tax preparation services.",
      keywords: "tax services in dubai, corporate tax agency dubai, vat compliance dubai, tax preparation services uae, fta tax agent dubai, emaratax corporate tax filing",
      url: `${baseUrl}/tax-services-dubai`,
      ogImage: `${baseUrl}/api/og?title=Expert+Tax+Services+in+Dubai&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=Tax+Agency+Dubai`,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/accounting-services-uae" || pathname === "/accounting-services-uae.html") {
    return {
      title: "Trusted Accounting Services UAE | Expert Bookkeeping",
      description: "Scale your business with premier accounting services in the UAE. From DTEC startups to established mainland firms, get accurate bookkeeping and financial reporting.",
      keywords: "accounting services uae, bookkeeping dubai, chartered accountants dubai, outsourced accounting uae, ifrs financial statements dubai, dtec accounting",
      url: `${baseUrl}/accounting-services-uae`,
      ogImage: `${baseUrl}/api/og?title=Trusted+Accounting+Services+UAE&author=Glen+Dias&role=Senior+Accounting+Advisor&tag=Bookkeeping+UAE`,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/tax-planning-difc" || pathname === "/tax-planning-difc.html") {
    return {
      title: "DIFC Tax Planning Services | Strategic Financial Advisory",
      description: "Optimize your corporate structure with specialized DIFC tax planning services. We provide strategic financial and tax advisory for businesses operating in Dubai.",
      keywords: "difc tax planning services, tax consultant in difc, qualifying free zone person difc, qfzp 0% tax dubai, transfer pricing difc, holding company tax uae",
      url: `${baseUrl}/tax-planning-difc`,
      ogImage: `${baseUrl}/api/og?title=DIFC+Tax+Planning+Services&author=Glen+Dias&role=Senior+Tax+Advisor&tag=DIFC+Advisory`,
      ogType: "website",
      isArabic,
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
    return {
      title: "Accounting Services in DTEC & DIFC Dubai | Tax Consultant & Virtual Accounting | Dias UAE",
      description: "Premier accounting services in DTEC and tax consultant in DIFC Dubai. Expert FTA tax advisory, virtual accounting services in DIFC, 0% QFZP corporate tax compliance, and tech startup bookkeeping in Dubai Silicon Oasis.",
      keywords: "accounting services in dtec, tax consultant in difc, tax and accounting services in difc, accounting services in difc, virtual accounting services in difc, difc tax services in dubai, DTEC accounting dubai, 0% QFZP free zone corporate tax",
      url: `${baseUrl}/difc-dtec-accounting`,
      ogImage: `${baseUrl}/api/og?title=Accounting+Services+in+DTEC+%26+Tax+Consultant+in+DIFC&author=Glen+Dias&tag=Free+Zone+0%25+QFZP+Advisory`,
      ogType: "website",
      isArabic,
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
    pathname === "/business-incorporation-services"
  ) {
    return {
      title: "Business Incorporation Services UAE | Company Setup Dubai & Free Zones | Dias UAE",
      description: "Premier business incorporation services in UAE. 100% foreign ownership company setup in Dubai Mainland (DET) and top Free Zones (SHAMS, DMCC, IFZA, DTEC). Fast-track trade licenses and corporate bank accounts.",
      keywords: "business incorporation services uae, business incorporation services in uae, company setup dubai, business setup uae, commercial license dubai, free zone company setup",
      url: `${baseUrl}/services/business-incorporation-services`,
      ogImage: `${baseUrl}/api/og?title=Business+Incorporation+Services+in+UAE&author=Dias+Corporate+Desk&tag=100%25+Foreign+Ownership`,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/services") {
    return {
      title: "Accounting, Corporate Tax & VAT Practice in UAE | Dias UAE",
      description: "Explore Dias Accounting's 8 comprehensive practice areas across UAE Corporate Tax (9% & 0% QFZP), VAT compliance, IFRS bookkeeping, backlog reconstruction, and E-Invoicing Phase 1 ASP onboarding.",
      keywords: "tax consulting services in uae, tax advisory services in dubai, corporate tax registration, vat returns dubai, ifrs bookkeeping uae",
      url: `${baseUrl}/services`,
      ogImage: `${baseUrl}/api/og?title=UAE+Tax+Consulting+%26+Accounting+Services&author=Glen+Dias&tag=8+Practice+Areas`,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/company-setup") {
    return {
      title: "Company Setup in Dubai & UAE Free Zones | Dias UAE",
      description: "Turnkey UAE business incorporation across SHAMS, DMCC, IFZA, DTEC, Meydan, and Dubai Mainland (DET). 100% foreign ownership, 0% QFZP tax structuring, and corporate bank accounts.",
      keywords: "company setup dubai, free zone license uae, shams incorporation, dmcc company formation, ifza visa setup",
      url: `${baseUrl}/company-setup`,
      ogImage: `${baseUrl}/api/og?title=UAE+Company+Setup+%26+Free+Zone+Hub&author=Dias+Corporate+Desk&tag=Turnkey+Incorporation`,
      ogType: "website",
      isArabic,
    };
  }

  if (pathname === "/why-choose-us" || pathname === "/about") {
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

  if (pathname === "/blogs" || pathname === "/insights") {
    return {
      title: "UAE Tax & Corporate Regulatory Insights | Dias UAE",
      description: "Authoritative legal interpretations, FTA decisions, and compliance checklists on UAE Corporate Tax, VAT, and Phase 1 E-Invoicing prepared by registered tax agents.",
      keywords: "uae tax blog, fta updates 2026, corporate tax guidelines, e-invoicing peppol mandate dubai",
      url: `${baseUrl}/blogs`,
      ogImage: `${baseUrl}/api/og?title=UAE+Tax+%26+Regulatory+Insights+Hub&author=Glen+Dias&tag=Official+Briefings`,
      ogType: "website",
      isArabic,
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
    };
  }

  if (pathname === "/faqs" || pathname === "/faq") {
    return {
      title: "UAE Tax & Accounting FAQs | Dias UAE",
      description: "Instant, authoritative answers to top questions on the 9% UAE Corporate Tax, AED 3M Small Business Relief, 0% QFZP Free Zone conditions, and VAT201 filing.",
      keywords: "uae tax faqs, corporate tax questions dubai, small business relief faq, vat compliance answers",
      url: `${baseUrl}/faqs`,
      ogImage: `${baseUrl}/api/og?title=UAE+Tax+%26+Accounting+FAQs&author=Glen+Dias&tag=Authoritative+Answers`,
      ogType: "website",
      isArabic,
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

  // 6. Default Fallback (Optimized for Homepage)
  return {
    title: isArabic
      ? "أفضل شركة استشارات ضريبية ومحاسبة في الإمارات | دياز للمحاسبة"
      : "Best Tax Consulting & Accounting Firm UAE | Dias Accounting",
    description: isArabic
      ? "استشارات ضريبية متخصصة للشركات، وامتثال لضريبة القيمة المضافة، وخدمات محاسبية لشركات البر الرئيسي والمناطق الحرة في الإمارات. احجز استشارتك المجانية."
      : "Expert corporate tax consulting, VAT compliance, and accounting services for UAE mainland & Free Zone businesses. Ensure FTA compliance. Book a free consult.",
    keywords: isArabic
      ? "خدمات المحاسبة والضرائب في دبي, شركات الضرائب في الإمارات, خدمات إعداد وتخطيط الضرائب, أفضل مكتب محاسبة في الإمارات, تدقيق مخاطر الغرامات 60 ثانية, تمثيل دفاعي الهيئة الاتحادية للضرائب, خيارات إعفاء ضريبة الشركات 0%, تسهيلات الأعمال الصغيرة 3 مليون, أفضل شركات المحاسبة في دبي, مستشار ضريبي معتمد, ضريبة الشركات دبي 9%, تسجيل ضريبة القيمة المضافة"
      : "tax and accounting services, tax accounting services, accounting services uae, tax firms in uae, tax services in dubai, tax and financial planning services, tax preparation and planning services, what tax advisory and accounting packages are available in dubai, accounting consultancy in dubai, taxation services dubai, accounting advisory services uae, accounting services for consultants dubai, tax accounting services in dubai, audit tax & pro in uae, tax and accounting services in uae, online accounting services in uae, auditing firms in sharjah, dental tax consultants, Best Accounting Firms in Dubai UAE, Best Accounting Firm in Dubai, FTA Registered Tax Agency Dubai, Chartered Accountants in Dubai",
    url: `${baseUrl}/`,
    ogImage: `${baseUrl}/api/og?title=Best+Tax+Consulting+%26+Accounting+Firm+UAE&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=Dias+Accounting&readTime=FTA+Certified`,
    ogType: "business.business",
    isArabic,
  };
}

/**
 * Injects meta tags and schema markup into HTML template
 */
export function injectMetaIntoHtml(html: string, meta: MetaOverride): string {
  let modified = html;

  if (meta.keywords) {
    modified = modified.replace(/<meta name="keywords" content="[\s\S]*?" \/>/i, `<meta name="keywords" content="${meta.keywords}" />`);
  }

  if (meta.title) {
    // Replace <title>
    modified = modified.replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);
    // Replace meta title
    modified = modified.replace(/<meta name="title" content="[\s\S]*?" \/>/i, `<meta name="title" content="${meta.title}" />`);
    // Replace og:title
    modified = modified.replace(/<meta property="og:title" content="[\s\S]*?" \/>/i, `<meta property="og:title" content="${meta.title}" />`);
    // Replace twitter:title
    modified = modified.replace(/<meta name="twitter:title" content="[\s\S]*?" \/>/i, `<meta name="twitter:title" content="${meta.title}" />`);
  }

  if (meta.description) {
    // Replace meta description
    modified = modified.replace(/<meta name="description" content="[\s\S]*?" \/>/i, `<meta name="description" content="${meta.description}" />`);
    // Replace og:description
    modified = modified.replace(/<meta property="og:description" content="[\s\S]*?" \/>/i, `<meta property="og:description" content="${meta.description}" />`);
    // Replace twitter:description
    modified = modified.replace(/<meta name="twitter:description" content="[\s\S]*?" \/>/i, `<meta name="twitter:description" content="${meta.description}" />`);
  }

  if (meta.url) {
    // Replace canonical
    modified = modified.replace(/<link rel="canonical" href="[\s\S]*?" \/>/i, `<link rel="canonical" href="${meta.url}" />`);
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

  if (meta.schemaMarkup) {
    const jsonLd = `\n  <script type="application/ld+json">\n${meta.schemaMarkup}\n  </script>\n`;
    modified = modified.replace("</head>", `${jsonLd}</head>`);
  }

  return modified;
}
