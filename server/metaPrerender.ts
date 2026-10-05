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
    title: "The Ultimate VAT Compliance Checklist for UAE Businesses",
    summary: "Avoid severe FTA fines. Review our actionable checklist covering tax invoices, output VAT, input VAT recoveries, and record keeping rules.",
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

const KNOWN_SERVICES: Record<string, { title: string; desc: string }> = {
  "accounting-bookkeeping": {
    title: "Accounting & Bookkeeping Services Dubai",
    desc: "IFRS-compliant monthly bookkeeping, financial statement preparation, and account reconciliation for UAE businesses.",
  },
  "corporate-tax-advisory": {
    title: "UAE Corporate Tax Advisory & Return Filing",
    desc: "Corporate tax impact assessments, EmaraTax registration, 0% QFZP Free Zone structuring, and annual tax return filing.",
  },
  "vat-compliance": {
    title: "VAT Registration & Compliance Dubai",
    desc: "Full VAT advisory, quarterly return filing, voluntary disclosures, and FTA tax audit representation in the UAE.",
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
      title: `${s.title} | Dias Accounting & Tax Consulting Dubai`,
      description: s.desc,
      keywords: `${s.title.toLowerCase()}, accounting Dubai, corporate tax UAE, FTA tax agent`,
      url: `${baseUrl}/#services-${serviceId}`,
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
      title: "Affordable Accounting & Corporate Tax Packages Dubai | Dias Accounting UAE",
      description: "Transparent, fixed-fee monthly bookkeeping and UAE corporate tax compliance packages starting from AED 500/mo for Mainland LLCs and Free Zone startups.",
      url: `${baseUrl}/#pricing`,
      ogImage: `${baseUrl}/api/og?title=Fixed-Fee+UAE+Accounting+%26+Corporate+Tax+Packages&author=Dias+Tax+Team&tag=From+AED+500%2Fmo`,
      ogType: "website",
      isArabic,
    };
  }

  // 5. Default Fallback
  return {
    title: isArabic
      ? "أفضل مكاتب المحاسبة في دبي الإمارات | دياز للمحاسبة والاستشارات الضريبية"
      : "Best Accounting Firm in Dubai UAE | Dias Tax Consulting",
    description: isArabic
      ? "أفضل مكاتب المحاسبة في دبي الإمارات. استشارات ضريبية معتمدة ومسك الدفاتر وحساب ضريبة الشركات وتدقيق مخاطر الغرامات في 60 ثانية لكافة الإمارات."
      : "Best Accounting Firms in Dubai UAE. Top-rated FTA tax consultants & accountants in Dubai. Instant Free 60s Penalty Risk Audit, FTA audit defense, 0% Corporate Tax relief & monthly bookkeeping across all 7 Emirates.",
    keywords: isArabic
      ? "أفضل مكتب محاسبة في الإمارات, تدقيق مخاطر الغرامات 60 ثانية, تمثيل دفاعي الهيئة الاتحادية للضرائب, خيارات إعفاء ضريبة الشركات 0%, تسهيلات الأعمال الصغيرة 3 مليون, أفضل شركات المحاسبة في دبي, كبرى مكاتب المحاسبين القانونيين في دبي, الاستعانة بمصادر خارجية للمحاسبة ومسك الدفاتر, مستشار ضريبي معتمد, ضريبة الشركات دبي 9%, تسجيل ضريبة القيمة المضافة, وكيل ضريبي معتمد دبي, محاسبة الشركات في دبي, تسعير المعاملات الإمارات, تأسيس شركات الإمارات"
      : "Best Accounting Firms in Dubai UAE, Best Accounting Firm in Dubai, Top CA Firms in Dubai, Top Tax Consultant in Dubai, Best Tax Consultants in UAE, FTA Registered Tax Agency Dubai, FTA Certified Tax Agent UAE, Chartered Accountants in Dubai Business Bay, Corporate Tax Consultant Dubai, UAE Corporate Tax 9%, Corporate Tax Filing 2026, EmaraTax Return Filing, Small Business Relief UAE AED 3M, Qualifying Free Zone Person 0%, QFZP Corporate Tax Compliance, VAT Registration Dubai, VAT Filing UAE 5%, VAT Voluntary Disclosure Form 211, Transfer Pricing Services Dubai, Audited Financial Statements Free Zone UAE, Bookkeeping Services Dubai, Outsource Accounting UAE, Business Setup Dubai Mainland, how to file corporate tax in uae without penalty, who is the best tax consultant in dubai",
    url: `${baseUrl}/`,
    ogImage: `${baseUrl}/api/og?title=Best+Accounting+Firms+in+Dubai+UAE&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=UAE+Tax+Compliance&readTime=FTA+Certified`,
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
