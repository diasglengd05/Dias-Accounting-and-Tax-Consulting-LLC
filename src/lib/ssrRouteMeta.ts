import { servicesData } from "../data/staticData";
import { blogsData } from "../data/blogsData";
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildServiceSchema,
  buildWebApplicationSchema,
  FAQSchemaItem,
  fitMetaDescription,
} from "./seo";
import {
  DEFAULT_OG_IMAGE,
  SITE_URL,
} from "./seoConfig";

function toCanonicalUrl(canonicalPath: string): string {
  const cleaned = (canonicalPath || "/").trim().replace(/\/+$/, "");
  if (!cleaned || cleaned === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${cleaned.startsWith("/") ? cleaned : `/${cleaned}`}`;
}
import { ALL_PRICING_SCHEMA_FAQS } from "../pages/PricingPage";
import { PRICING_OFFER_CATALOG_JSONLD } from "../components/PricingSection";
import {
  ALL_DIVIDEND_SCHEMA_FAQS,
  DIFC_DTEC_FAQS,
  getServiceDetailFaqs,
} from "../data/pageFaqs";
import { SBR_FAQS } from "../pages/SmallBusinessTaxReliefPage";
import { COMPANY_SETUP_FAQS } from "../pages/CompanySetupPage";
import { TAX_PLANNER_FAQS } from "../pages/TaxPlannerPage";
import { VAT_FAQS } from "../pages/VatPlannerPage";
import { DEADLINES_FAQS } from "../pages/FtaDeadlinesPage";
import { FAQS_PAGE_JSONLD } from "../pages/FaqsPage";

export interface SsrJsonLdBlock {
  id: string;
  data: Record<string, unknown>;
}

export interface SsrRouteHead {
  routePath: string;
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string;
  robots: string;
  ogType: "website" | "article";
  ogImage: string;
  ogImageAlt: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  articleSection?: string;
  keepHomepageFaq: boolean;
  jsonLdScripts: SsrJsonLdBlock[];
}

const DEFAULT_ROBOTS =
  "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

const STATIC_PRERENDER_ROUTES: string[] = [
  "/",
  "/pricing",
  "/services",
  "/small-business-tax-relief",
  "/tax-planning-difc",
  "/dividends-audit",
  "/company-setup",
  "/uae-tax-planner",
  "/uae-vat-calculator",
  "/fta-deadlines",
  "/blog",
  "/testimonials",
  "/faqs",
  "/contact",
  "/about",
  "/why-choose-us",
  "/partners",
  "/privacy-policy",
  "/terms",
];

function toSafeIsoDate(raw?: string): string {
  if (!raw) return "2026-01-01";
  const parsed = Date.parse(raw);
  if (Number.isNaN(parsed)) return "2026-01-01";
  return new Date(parsed).toISOString().slice(0, 10);
}

/**
 * Returns the complete, deduplicated list of all live routes to statically pre-render
 * into standalone HTML files during `npm run build`.
 */
export function getAllPrerenderRoutes(): string[] {
  const routes = new Set<string>(STATIC_PRERENDER_ROUTES);

  for (const service of servicesData) {
    if (service?.id) {
      routes.add(`/services/${service.id}`);
    }
  }

  for (const post of blogsData) {
    if (!post?.id) continue;
    if (post.id.toLowerCase().startsWith("draft-")) continue;
    routes.add(`/blog/${post.id}`);
  }

  return Array.from(routes);
}

// Service detail FAQs are imported from ../data/pageFaqs (single source of truth).

/**
 * Resolves exact route-level <head> metadata, canonical URL, Open Graph tags,
 * and JSON-LD structured data for build-time static pre-rendering (1:1 parity
 * with each React page's applyPageSEO and upsertJsonLd calls).
 */
export function resolveSsrRouteHead(rawPath: string): SsrRouteHead {
  const head = resolveRawSsrRouteHead(rawPath);
  return {
    ...head,
    description: fitMetaDescription(head.description),
  };
}

function resolveRawSsrRouteHead(rawPath: string): SsrRouteHead {
  const cleanPath = (rawPath || "/").split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";

  if (cleanPath === "/") {
    const title = "DiasUAE | UAE Tax Agents & IFRS Accounting From AED 400/Mo";
    return {
      routePath: "/",
      title,
      description:
        "FTA-Registered Tax Agency in Dubai & SHAMS. Monthly IFRS bookkeeping, 5% VAT Form 201 & 9% Corporate Tax packages from AED 400/mo. 2x Clutch 2026 Winner.",
      canonicalUrl: `${SITE_URL}/`,
      keywords:
        "DiasUAE, diasuae.ae, UAE Corporate Tax, UAE VAT Compliance, IFRS Bookkeeping Dubai, FTA Registered Tax Agent, Fixed-Fee Accounting Packages UAE, SHAMS Accounting Firm, DIFC Tax Compliance, Dias Accounting",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt:
        "DiasUAE (Dias Accounting and Tax Consulting LLC) — UAE Corporate Tax, VAT & Fixed-Fee IFRS Accounting",
      keepHomepageFaq: true,
      jsonLdScripts: [],
    };
  }

  if (cleanPath === "/pricing") {
    const title =
      "UAE Monthly Accounting, VAT & Corporate Tax Packages | From AED 400/Mo — DiasUAE";
    const description =
      "Fixed-fee UAE monthly accounting, 5% VAT & 9% Corporate Tax packages. Business Starter from AED 400/mo & Corporate Growth for UAE SMEs. Get a quick quote.";
    return {
      routePath: cleanPath,
      title,
      description,
      canonicalUrl: toCanonicalUrl(cleanPath),
      keywords:
        "UAE monthly accounting packages, Dubai bookkeeping pricing from AED 400, UAE VAT Form 201 and Corporate Tax package, Business Starter accounting UAE, Corporate Growth SME tax package",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-pricing-offers-jsonld",
          data: PRICING_OFFER_CATALOG_JSONLD,
        },
        {
          id: "page-faq-jsonld",
          data: buildFAQPageSchema(ALL_PRICING_SCHEMA_FAQS, `${SITE_URL}/pricing#faqs`),
        },
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Pricing", path: "/pricing" },
            ],
            `${SITE_URL}/pricing#breadcrumb`
          ),
        },
      ],
    };
  }

  if (cleanPath === "/dividends-audit") {
    const title = "Dividends Audit Dubai & UAE | Fast Statutory Sign-Off (FTA Tax Agents)";
    const description =
      "Fast 5-day statutory interim & final dividends audits in Dubai, DIFC & UAE Free Zones under IFRS. Protect 0% dividend tax status. Same-day fixed quote.";
    const pageUrl = toCanonicalUrl(cleanPath);
    return {
      routePath: cleanPath,
      title,
      description,
      canonicalUrl: pageUrl,
      keywords:
        "dividends audit dubai, dividends audit uae, audit services for dividends uae, dividend distribution certification, commercial companies law dividend audit",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-service-jsonld",
          data: buildServiceSchema({
            name: "Statutory Dividend Audit & Distributable Profit Certification",
            description,
            canonicalPath: cleanPath,
          }),
        },
        {
          id: "page-faq-jsonld",
          data: buildFAQPageSchema(ALL_DIVIDEND_SCHEMA_FAQS, `${pageUrl}#faqs`, {
            url: pageUrl,
            name: "UAE Dividend Distribution FAQs",
            description,
          }),
        },
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "Statutory Dividend Audit", path: cleanPath },
            ],
            `${pageUrl}#breadcrumb`
          ),
        },
      ],
    };
  }

  if (cleanPath === "/tax-planning-difc") {
    const title = "DIFC & DTEC Accounting, 0% QFZP Tax & Virtual Bookkeeping | Dias UAE";
    const description =
      "FTA-Registered Tax Agents for DIFC & DTEC companies. 0% QFZP compliance, audited IFRS books, 5% VAT & virtual bookkeeping from AED 400/mo. 2x Clutch 2026.";
    const pageUrl = toCanonicalUrl(cleanPath);
    return {
      routePath: cleanPath,
      title,
      description,
      canonicalUrl: pageUrl,
      keywords:
        "DIFC Corporate Tax Planning, DTEC Accounting & Bookkeeping, 0% Qualifying Free Zone Person (QFZP) Compliance, DIFC Dividend Audits, 5% UAE VAT Filing",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-service-jsonld",
          data: buildServiceSchema({
            name: "DIFC & DTEC Accounting, 0% QFZP Corporate Tax & Dividend Audits",
            description,
            canonicalPath: cleanPath,
          }),
        },
        {
          id: "page-faq-jsonld",
          data: buildFAQPageSchema(DIFC_DTEC_FAQS, `${pageUrl}#faqs`, {
            url: pageUrl,
            name: "DIFC & DTEC Tax Compliance FAQs",
            description,
          }),
        },
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "DIFC & DTEC Tax Planning", path: cleanPath },
            ],
            `${pageUrl}#breadcrumb`
          ),
        },
      ],
    };
  }

  if (cleanPath === "/small-business-tax-relief") {
    const title = "UAE Small Business Tax Relief (AED 3M) | Dias Accounting";
    const description =
      "Check eligibility for 0% UAE Small Business Relief (revenue up to AED 3M, extended to 2029). IFRS bookkeeping & Corporate Tax filing from AED 400/mo.";
    const pageUrl = toCanonicalUrl(cleanPath);
    return {
      routePath: cleanPath,
      title,
      description,
      canonicalUrl: pageUrl,
      keywords:
        "Small Business Corporate Tax Relief Dubai, UAE small business relief 2029, 0% corporate tax UAE, Ministerial Decision 73 of 2023, EmaraTax SBR election",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-faq-jsonld",
          data: buildFAQPageSchema(SBR_FAQS, `${pageUrl}#faqs`),
        },
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Tax Compliance Hubs", path: "/uae-tax-planner" },
              { name: "Small Business Tax Relief", path: cleanPath },
            ],
            `${pageUrl}#breadcrumb`
          ),
        },
      ],
    };
  }

  if (cleanPath === "/company-setup") {
    const title = "UAE Mainland & Free Zone Company Setup | Dias Accounting";
    const description =
      "Launch your SHAMS Free Zone, IFZA, DMCC, or Dubai Mainland LLC with Day-1 EmaraTax Corporate Tax & 5% VAT registration. Fixed accounting from AED 400/mo.";
    const pageUrl = toCanonicalUrl(cleanPath);
    return {
      routePath: cleanPath,
      title,
      description,
      canonicalUrl: pageUrl,
      keywords:
        "UAE Company Setup, SHAMS free zone formation, Dubai Mainland DET license, 0% QFZP structuring, EmaraTax registration",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-faq-jsonld",
          data: buildFAQPageSchema(
            COMPANY_SETUP_FAQS.map((item) => ({ question: item.q, answer: item.a })),
            `${pageUrl}#faqs`
          ),
        },
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Company Setup", path: cleanPath },
            ],
            `${pageUrl}#breadcrumb`
          ),
        },
      ],
    };
  }

  if (cleanPath === "/uae-tax-planner") {
    const title = "2026 UAE Corporate Tax & VAT Calculator | Dias Accounting";
    const description =
      "Free 2026 UAE Corporate Tax (9%, 0% Small Business Relief & Free Zone QFZP) and 5% VAT Input Recovery Calculator by FTA-Registered Tax Agents in UAE.";
    const pageUrl = toCanonicalUrl(cleanPath);
    return {
      routePath: cleanPath,
      title,
      description,
      canonicalUrl: pageUrl,
      keywords:
        "UAE Corporate Tax Calculator 2026, 5% UAE VAT Calculator, Free Zone QFZP Calculator, Small Business Relief AED 3M, UAE VAT Input Recovery Tool, Dias Accounting",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-webapp-jsonld",
          data: buildWebApplicationSchema({
            name: "2026 UAE Corporate Tax & 5% VAT Calculator",
            description,
            canonicalPath: cleanPath,
          }),
        },
        {
          id: "page-faq-jsonld",
          data: buildFAQPageSchema(
            TAX_PLANNER_FAQS.map((item) => ({ question: item.q, answer: item.a })),
            `${pageUrl}#faqs`
          ),
        },
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "2026 UAE Tax Calculator", path: cleanPath },
            ],
            `${pageUrl}#breadcrumb`
          ),
        },
      ],
    };
  }

  if (cleanPath === "/uae-vat-calculator") {
    const title = "UAE 5% VAT Hub & Form 201 Calculator | Dias Accounting";
    const description =
      "Calculate net UAE 5% VAT payable or refundable for FTA Form 201 returns. Check AED 375,000 mandatory registration thresholds and blocked input VAT rules.";
    const pageUrl = toCanonicalUrl(cleanPath);
    return {
      routePath: cleanPath,
      title,
      description,
      canonicalUrl: pageUrl,
      keywords:
        "UAE VAT calculator, 5% VAT planner Dubai, FTA Form 201 calculator, VAT registration threshold UAE AED 375k",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-faq-jsonld",
          data: buildFAQPageSchema(VAT_FAQS, `${pageUrl}#faqs`),
        },
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Tax Compliance Hubs", path: "/uae-tax-planner" },
              { name: "UAE VAT Compliance Hub", path: cleanPath },
            ],
            `${pageUrl}#breadcrumb`
          ),
        },
      ],
    };
  }

  if (cleanPath === "/fta-deadlines") {
    const title = "2026 UAE FTA Tax Deadlines & Penalties | Dias Accounting";
    const description =
      "Calculate your 9-month UAE Corporate Tax filing deadline and quarterly VAT Form 201 due dates on EmaraTax to avoid Cabinet Decision No. 75 penalties.";
    const pageUrl = toCanonicalUrl(cleanPath);
    return {
      routePath: cleanPath,
      title,
      description,
      canonicalUrl: pageUrl,
      keywords:
        "UAE corporate tax deadline 2026, FTA EmaraTax due dates, VAT filing calendar UAE, Cabinet Decision 75 penalties",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-faq-jsonld",
          data: buildFAQPageSchema(DEADLINES_FAQS, `${pageUrl}#faqs`),
        },
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Tax Compliance Hubs", path: "/uae-tax-planner" },
              { name: "FTA Tax Deadlines", path: cleanPath },
            ],
            `${pageUrl}#breadcrumb`
          ),
        },
      ],
    };
  }

  if (cleanPath === "/services") {
    const title = "UAE Corporate Tax, VAT & Accounting Services | Dias";
    const description =
      "FTA-Registered Corporate Tax, 5% VAT filing, fixed-fee IFRS bookkeeping, backlog cleanup, and DIFC/DTEC tax services across Dubai & all 7 UAE Emirates.";
    return {
      routePath: cleanPath,
      title,
      description,
      canonicalUrl: toCanonicalUrl(cleanPath),
      keywords:
        "Corporate Tax UAE, VAT compliance Dubai, IFRS bookkeeping UAE, DIFC tax compliance, backlog accounting Dubai",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Services", path: cleanPath },
            ],
            `${SITE_URL}/services#breadcrumb`
          ),
        },
      ],
    };
  }

  if (cleanPath.startsWith("/services/")) {
    const serviceId = cleanPath.replace(/^\/services\//, "").trim();
    const currentService =
      servicesData.find((s) => s.id === serviceId || s.id.toLowerCase() === serviceId.toLowerCase()) ||
      servicesData[0];

    let title = `${currentService.title} in Dubai & UAE | Dias Accounting & Tax`;
    let desc = currentService.shortDesc;
    let keywords = `${currentService.title.toLowerCase()} dubai, ${currentService.title.toLowerCase()} uae, fta tax agent`;

    if (currentService.id === "corporate-tax-advisory") {
      title = "Corporate Tax Filing UAE | Tax Advisory Dubai | Dias UAE";
      desc =
        "9% UAE Corporate Tax registration, 0% Small Business Relief, EmaraTax filing & AED 10,000 penalty waiver support in Dubai & SHAMS. Fixed monthly packages.";
      keywords =
        "corporate tax filing uae, tax advisory services in dubai, tax filing services uae, tax planning services in dubai, corporate tax return emaratax, small business relief 0%, fta audit defense";
    } else if (currentService.id === "accounting-bookkeeping") {
      title = "Accounting Services UAE | Bookkeeping Dubai | Dias UAE";
      desc =
        "IFRS-compliant accounting services in the UAE. Dedicated senior accountants, monthly P&L reporting, bank reconciliations & software setup. Request a quote!";
      keywords =
        "accounting services uae, accounting consulting dubai, accounting service in uae, accounting solutions in uae, bookkeeping dubai, chartered accountants dubai, outsourced accounting uae";
    } else if (currentService.id === "vat-compliance") {
      title = "UAE VAT Compliance, Form 201 Filing & FTA Audit Support | From AED 400/Mo";
      desc =
        "5% UAE VAT registration, quarterly Form 201 filing, input VAT recovery & FTA audit defense in Dubai & SHAMS. Monthly VAT & accounting from AED 400/mo.";
      keywords =
        "uae vat compliance, vat form 201 filing dubai, fta decision 13 input tax recovery, vat audit support uae, vat registration threshold aed 375000, fta voluntary disclosure 211";
    } else if (currentService.id === "business-incorporation") {
      title = "UAE Business Incorporation & Setup | Dias Accounting";
      desc =
        "100% foreign ownership company formation in Dubai Mainland (DET) and UAE Free Zones (SHAMS, DMCC, IFZA, DTEC) with Day-1 Corporate Tax registration.";
      keywords =
        "business incorporation services uae, company setup dubai, free zone company formation, mainland DET incorporation, shams company setup";
    } else if (currentService.id === "auditing-assurance") {
      title = "UAE Statutory Auditing & Assurance | Dias Accounting";
      desc =
        "Approved statutory audit coordination for Dubai Mainland and Free Zones (DIFC, DMCC, SHAMS, IFZA, DTEC), QFZP 0% verification, and IFRS compliance.";
    } else if (currentService.id === "backlog-accounting") {
      title = "Backlog Accounting Cleanup Dubai | Dias Accounting";
      desc =
        "Fast multi-year backlog accounting and ledger reconstruction in Dubai & UAE. Clean IFRS financial statements for overdue Corporate Tax & VAT filings.";
    } else if (currentService.id === "transfer-pricing") {
      title = "UAE Transfer Pricing Advisory & Filing | Dias Accounting";
      desc =
        "UAE Transfer Pricing Local File, Master File, OECD benchmarking, Connected Persons reviews, and EmaraTax TP Disclosure Forms under Decree-Law No. 47.";
    } else if (currentService.id === "aml-goaml-compliance") {
      title = "UAE AML & goAML Compliance Advisory | Dias Accounting";
      desc =
        "UAE FIU goAML registration, KYC/CDD frameworks, and annual AML risk assessments for DNFBPs, real estate brokerages, and corporate service providers.";
    } else if (currentService.id === "cfo-advisory") {
      title = "Outsourced CFO Advisory Dubai & UAE | Dias Accounting";
      desc =
        "Fractional CFO advisory for UAE SMEs and corporate groups: cash flow forecasting, board reporting, QFZP tax governance, and audit-ready financials.";
    }

    const canonicalPath = `/services/${currentService.id}`;
    const canonicalUrl = toCanonicalUrl(canonicalPath);
    const serviceFaqs = getServiceDetailFaqs(currentService.id, currentService.title);

    return {
      routePath: canonicalPath,
      title,
      description: desc,
      canonicalUrl,
      keywords,
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-service-jsonld",
          data: buildServiceSchema({
            name: currentService.title,
            description: desc,
            canonicalPath,
          }),
        },
        {
          id: "page-faq-jsonld",
          data: buildFAQPageSchema(serviceFaqs, `${canonicalUrl}#faqs`, {
            url: canonicalUrl,
            name: `Questions About ${currentService.title}`,
            description: desc,
          }),
        },
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: currentService.title, path: canonicalPath },
            ],
            `${canonicalUrl}#breadcrumb`
          ),
        },
      ],
    };
  }

  if (cleanPath === "/blog") {
    const title = "UAE Corporate Tax, VAT & IFRS Insights | Dias Accounting";
    const description =
      "Latest 2026 UAE Federal Tax Authority (FTA) briefings, 9% Corporate Tax guides, 5% VAT checklists, and IFRS accounting insights by Dias Accounting.";
    return {
      routePath: cleanPath,
      title,
      description,
      canonicalUrl: toCanonicalUrl(cleanPath),
      keywords:
        "UAE Corporate Tax Insights 2026, FTA Updates 2026, 9% Corporate Tax Guides, 5% VAT Audit Checklists, IFRS Accounting Insights Dubai",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-collection-jsonld",
          data: {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${SITE_URL}/blog#collection`,
            url: `${SITE_URL}/blog`,
            name: title,
            description,
            isPartOf: { "@id": `${SITE_URL}/#website` },
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
        },
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Insights", path: "/blog" },
            ],
            `${SITE_URL}/blog#breadcrumb`
          ),
        },
      ],
    };
  }

  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.replace(/^\/blog\//, "").trim();
    const post = blogsData.find((p) => p.id === slug || p.id.toLowerCase() === slug.toLowerCase());
    if (post) {
      const canonicalPath = `/blog/${post.id}`;
      const canonicalUrl = toCanonicalUrl(canonicalPath);
      const publishedIso = toSafeIsoDate(post.publishedIso || post.date);
      const resolvedPostImage =
        post.imageUrl && post.imageUrl.trim()
          ? post.imageUrl.startsWith("http")
            ? post.imageUrl
            : `${SITE_URL}${post.imageUrl.startsWith("/") ? "" : "/"}${post.imageUrl}`
          : DEFAULT_OG_IMAGE;

      return {
        routePath: canonicalPath,
        title: `${post.title} | Dias Accounting`,
        description: post.summary,
        canonicalUrl,
        keywords:
          post.keywords && post.keywords.length > 0
            ? post.keywords.join(", ")
            : `UAE tax guide, ${post.tag}, corporate tax Dubai, FTA compliance`,
        robots: DEFAULT_ROBOTS,
        ogType: "article",
        ogImage: resolvedPostImage,
        ogImageAlt: post.title,
        publishedTime: publishedIso,
        modifiedTime: publishedIso,
        authorName: post.author?.name || "Glen Dias",
        articleSection: post.tag || "UAE Tax & Accounting",
        keepHomepageFaq: false,
        jsonLdScripts: [
          {
            id: "page-article-jsonld",
            data: buildBlogPostingSchema({
              headline: post.title,
              description: post.summary,
              canonicalPath,
              datePublished: publishedIso,
              dateModified: publishedIso,
              image: resolvedPostImage,
              authorName: post.author?.name,
              authorRole: post.author?.role,
              articleSection: post.tag,
              keywords: post.keywords,
            }),
          },
          {
            id: "page-breadcrumb-jsonld",
            data: buildBreadcrumbSchema(
              [
                { name: "Home", path: "/" },
                { name: "Insights", path: "/blog" },
                { name: post.title, path: canonicalPath },
              ],
              `${canonicalUrl}#breadcrumb`
            ),
          },
        ],
      };
    }
  }

  if (cleanPath === "/testimonials") {
    const title = "Client Reviews & 5.0★ Google Rating | Dias Accounting";
    return {
      routePath: cleanPath,
      title,
      description:
        "Read verified 5.0★ Google Reviews from UAE Mainland LLCs and Free Zone businesses advised by Dias Accounting on Corporate Tax, VAT, and IFRS bookkeeping.",
      canonicalUrl: toCanonicalUrl(cleanPath),
      keywords:
        "dias accounting reviews, google reviews tax consultant dubai, fta tax agent testimonials uae",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Client Reviews", path: "/testimonials" },
          ]),
        },
      ],
    };
  }

  if (cleanPath === "/faqs") {
    const title = "UAE Corporate Tax, VAT & Accounting FAQs | Dias UAE";
    return {
      routePath: cleanPath,
      title,
      description:
        "Clear answers to top UAE tax questions: 9% Corporate Tax, AED 3M Small Business Relief, 0% QFZP Free Zone rules, VAT 201 filing, and fixed-fee pricing.",
      canonicalUrl: toCanonicalUrl(cleanPath),
      keywords:
        "uae tax faqs, corporate tax questions dubai, small business relief faq, vat compliance answers",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-faq-jsonld",
          data: FAQS_PAGE_JSONLD,
        },
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "FAQs", path: "/faqs" },
            ],
            `${SITE_URL}/faqs#breadcrumb`
          ),
        },
      ],
    };
  }

  if (cleanPath === "/contact") {
    const title = "Contact Dias Accounting | Book Free UAE Tax Consultation";
    return {
      routePath: cleanPath,
      title,
      description:
        "Schedule a free consultation with FTA-Registered Tax Agent Glen Dias. SHAMS & Dubai advisory desk for UAE Corporate Tax, 5% VAT, and IFRS bookkeeping.",
      canonicalUrl: toCanonicalUrl(cleanPath),
      keywords:
        "contact tax consultant dubai, book tax consultation uae, fta tax agent phone number, dias accounting office",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        },
      ],
    };
  }

  if (cleanPath === "/about") {
    const title = "About Dias Accounting | FTA Tax Consultants Dubai & UAE";
    return {
      routePath: cleanPath,
      title,
      description:
        "Led by FTA-Registered Tax Agent Glen Dias, Dias Accounting delivers Corporate Tax advisory, VAT compliance, and IFRS bookkeeping across Dubai & Sharjah.",
      canonicalUrl: toCanonicalUrl(cleanPath),
      keywords:
        "Glen Dias tax advisor, Dias Accounting LLC, certified tax consultant Dubai, tax consulting services in uae, tax advisory services in dubai",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
          ]),
        },
      ],
    };
  }

  if (cleanPath === "/why-choose-us") {
    const title = "Why Choose Dias Accounting | FTA Tax Agency Dubai & UAE";
    return {
      routePath: cleanPath,
      title,
      description:
        "Discover why UAE founders choose Dias Accounting: FTA-registered agents, fixed-fee IFRS accounting, EmaraTax compliance, and direct senior advisory.",
      canonicalUrl: toCanonicalUrl(cleanPath),
      keywords:
        "why dias accounting, fta registered tax agency, certified tax agent glen dias, corporate tax advisory firm dubai",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
            { name: "Why Choose Dias", path: "/why-choose-us" },
          ]),
        },
      ],
    };
  }

  if (cleanPath === "/partners") {
    const title = "UAE Business Setup Partners & Free Tax Calculator Widget | Dias Accounting";
    return {
      routePath: cleanPath,
      title,
      description:
        "Partner with DiasUAE across Dubai, DIFC, DTEC & SHAMS for company setup, PRO referrals, and our free embeddable 2026 UAE Corporate Tax & VAT Calculator.",
      canonicalUrl: toCanonicalUrl(cleanPath),
      keywords:
        "UAE company formation partners, Dubai business setup referral partners, embed UAE corporate tax calculator, PRO agency accounting partner UAE, DIFC DTEC SHAMS tax partner",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "UAE Business Ecosystem & Partners", path: cleanPath },
            ],
            `${SITE_URL}/partners#breadcrumb`
          ),
        },
      ],
    };
  }

  if (cleanPath === "/privacy-policy") {
    const title = "Privacy Policy & UAE PDPL Compliance | Dias Accounting";
    return {
      routePath: cleanPath,
      title,
      description:
        "Privacy Policy and UAE Federal Decree-Law No. 45 Personal Data Protection (PDPL) commitments for Dias Accounting & Tax Consulting LLC in Sharjah & Dubai.",
      canonicalUrl: toCanonicalUrl(cleanPath),
      keywords:
        "Dias Accounting privacy policy, UAE PDPL compliance, client confidentiality tax advisory",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: "/privacy-policy" },
          ]),
        },
      ],
    };
  }

  if (cleanPath === "/terms") {
    const title = "Terms of Service & Engagement | Dias Accounting UAE";
    return {
      routePath: cleanPath,
      title,
      description:
        "Standard Terms of Service, professional engagement scope, confidentiality, and UAE tax compliance policies for Dias Accounting & Tax Consulting LLC.",
      canonicalUrl: toCanonicalUrl(cleanPath),
      keywords:
        "Dias Accounting terms of service, UAE tax engagement terms, FTA agency compliance",
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageAlt: title,
      keepHomepageFaq: false,
      jsonLdScripts: [
        {
          id: "page-breadcrumb-jsonld",
          data: buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Terms of Engagement", path: "/terms" },
          ]),
        },
      ],
    };
  }

  // Safe fallback for any additional route
  const fallbackTitle = "DiasUAE | UAE Tax Agents & IFRS Accounting From AED 400/Mo";
  return {
    routePath: cleanPath,
    title: fallbackTitle,
    description:
      "FTA-Registered Tax Agency in Dubai & SHAMS. Monthly IFRS bookkeeping, 5% VAT Form 201 & 9% Corporate Tax packages from AED 400/mo. 2x Clutch 2026 Winner.",
    canonicalUrl: toCanonicalUrl(cleanPath),
    keywords:
      "DiasUAE, UAE Corporate Tax, UAE VAT Compliance, IFRS Bookkeeping Dubai, FTA Registered Tax Agent",
    robots: DEFAULT_ROBOTS,
    ogType: "website",
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: fallbackTitle,
    keepHomepageFaq: false,
    jsonLdScripts: [],
  };
}
