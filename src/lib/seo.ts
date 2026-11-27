import {
  BUSINESS_ENTITY,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_NAME,
  SITE_URL,
} from "./seoConfig";

export const CANONICAL_DOMAIN = SITE_URL;

export interface PageSEOOptions {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  articleSection?: string;
  robots?: string;
}

export interface FAQSchemaItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface BlogPostingSchemaInput {
  headline: string;
  description: string;
  canonicalPath: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
  authorRole?: string;
  articleSection?: string;
  keywords?: string[];
}

/**
 * Route-scoped JSON-LD script IDs cleared automatically on route transitions
 * so schemas never leak or duplicate across SPA navigation.
 */
const ROUTE_SCOPED_JSONLD_IDS = [
  "homepage-faq-jsonld",
  "homepage-howto-jsonld",
  "homepage-webpage-jsonld",
  "page-faq-jsonld",
  "page-breadcrumb-jsonld",
  "page-article-jsonld",
  "page-webapp-jsonld",
  "page-service-jsonld",
  "page-collection-jsonld",
  "calculator-software-jsonld",
  "pricing-faq-jsonld",
  "faqs-page-jsonld",
  "faqs-breadcrumb-jsonld",
  "schema-blogs-hub",
  "schema-blog-detail",
  "schema-blog-posting",
  "schema-difc-dtec",
  "schema-difc-faq",
  "schema-difc-breadcrumb",
  "schema-dividends-audit",
  "service-schema-jsonld",
  "dynamic-seo-jsonld",
  "ssr-route-jsonld",
];

/**
 * 5 Core UAE Tax & Accounting FAQs shared verbatim between
 * Homepage (#faqs), /faqs page, and FAQPage JSON-LD schema.
 */
export const CORE_HOMEPAGE_FAQS: FAQSchemaItem[] = [
  {
    question: "What is the UAE Corporate Tax rate in 2026?",
    answer:
      "Under UAE Federal Decree-Law No. 47 of 2022, the UAE Corporate Tax rate in 2026 is 0% on taxable net profit up to AED 375,000 and 9% on taxable profit exceeding AED 375,000. Eligible UAE resident businesses with gross revenue up to AED 3,000,000 can also elect for 0% Small Business Relief (extended through 31 December 2029), while Qualifying Free Zone Persons benefit from a 0% Corporate Tax rate on Qualifying Income.",
  },
  {
    question: "What is the penalty for late UAE Corporate Tax registration?",
    answer:
      "Failing to register for UAE Corporate Tax within the Federal Tax Authority (FTA) deadline triggers an automatic AED 10,000 administrative penalty under Cabinet Decision No. 75 of 2023. However, under the FTA penalty waiver initiative, this AED 10,000 late registration penalty can be waived or refunded if the business files its first Corporate Tax return within 7 months from the end of its first tax period.",
  },
  {
    question: "When is VAT registration mandatory in the UAE?",
    answer:
      "VAT registration (5%) in the UAE is mandatory when a business's taxable supplies and imports exceed AED 375,000 over the preceding 12 months or are expected to exceed AED 375,000 in the next 30 days. Voluntary VAT registration is available once taxable supplies, imports, or taxable business expenses exceed AED 187,500.",
  },
  {
    question: "Do UAE companies need audited financial statements?",
    answer:
      "Yes. Audited financial statements prepared under IFRS are mandatory for all Qualifying Free Zone Persons (QFZPs) regardless of revenue to retain their 0% Corporate Tax status, and for Mainland or non-qualifying UAE entities with annual revenue exceeding AED 50 million. Statutory audit certification is also required for UAE Dividend Distribution audits under Federal Decree-Law No. 32 of 2021 and many Free Zone license renewals (including DIFC, DMCC, and DTEC).",
  },
  {
    question: "What accounting and tax packages does Dias Accounting offer in Dubai and Sharjah?",
    answer:
      "Dias Accounting offers transparent, fixed-fee monthly accounting and tax packages in Dubai and Sharjah from AED 400/month. Packages include a dedicated chartered accountant, IFRS-compliant double-entry bookkeeping (Zoho Books, Xero, QuickBooks, or Wafeq), monthly financial statements, quarterly 5% VAT 201 return filing, and annual 9% or 0% Corporate Tax return submission on EmaraTax.",
  },
];

/**
 * Strips raw HTML tags and markdown syntax for clean JSON-LD plain text fields.
 */
export function stripMarkup(input: string): string {
  return (input || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalizes a route path to canonical format: leading slash, no trailing slash (except "/"),
 * no query params or hash fragments.
 */
export function normalizeCanonicalPath(canonicalPath: string): string {
  if (!canonicalPath || canonicalPath === "/") return "/";
  const stripped = canonicalPath
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  return stripped ? `/${stripped}` : "/";
}

export function buildCanonicalUrl(canonicalPath: string): string {
  return `${CANONICAL_DOMAIN}${normalizeCanonicalPath(canonicalPath)}`;
}

/**
 * Recursively removes undefined values from JSON-LD objects before serialization.
 */
function sanitizeJsonLd<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined && item !== null)
      .map((item) => sanitizeJsonLd(item)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined && v !== null) {
        cleaned[k] = sanitizeJsonLd(v);
      }
    }
    return cleaned as T;
  }
  return value;
}

export function buildAccountingServiceSchema() {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": BUSINESS_ENTITY.id,
    name: BUSINESS_ENTITY.name,
    legalName: BUSINESS_ENTITY.legalName,
    alternateName: BUSINESS_ENTITY.alternateName,
    url: BUSINESS_ENTITY.url,
    logo: BUSINESS_ENTITY.logo,
    description: BUSINESS_ENTITY.description,
    telephone: BUSINESS_ENTITY.telephone,
    priceRange: BUSINESS_ENTITY.priceRange,
    founder: {
      "@type": "Person",
      name: BUSINESS_ENTITY.founder.name,
      jobTitle: BUSINESS_ENTITY.founder.jobTitle,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_ENTITY.address.streetAddress,
      addressLocality: BUSINESS_ENTITY.address.addressLocality,
      addressRegion: BUSINESS_ENTITY.address.addressRegion,
      postalCode: BUSINESS_ENTITY.address.postalCode,
      addressCountry: BUSINESS_ENTITY.address.addressCountry,
    },
    hasMap: BUSINESS_ENTITY.hasMap,
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_ENTITY.geo.latitude,
      longitude: BUSINESS_ENTITY.geo.longitude,
    },
    areaServed: BUSINESS_ENTITY.areaServed,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS_ENTITY.aggregateRating.ratingValue,
      reviewCount: BUSINESS_ENTITY.aggregateRating.reviewCount,
      bestRating: BUSINESS_ENTITY.aggregateRating.bestRating,
    },
    award: BUSINESS_ENTITY.award,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Fixed-Fee UAE Accounting & Tax Retainers",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Monthly IFRS Bookkeeping, VAT 201 & Corporate Tax Package",
          price: "400",
          priceCurrency: "AED",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "400",
            priceCurrency: "AED",
            unitText: "MONTH",
          },
        },
      ],
    },
    sameAs: BUSINESS_ENTITY.sameAs,
  });
}

export function buildFAQPageSchema(items: FAQSchemaItem[], schemaId?: string) {
  const validItems = items
    .map((item) => ({
      question: stripMarkup(item.question),
      answer: stripMarkup(item.answer),
    }))
    .filter((item) => item.question.length > 0 && item.answer.length > 0);

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(schemaId ? { "@id": schemaId } : {}),
    mainEntity: validItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[], schemaId?: string) {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(schemaId ? { "@id": schemaId } : {}),
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: stripMarkup(crumb.name),
      item: buildCanonicalUrl(crumb.path),
    })),
  });
}

export function buildServiceSchema(options: {
  name: string;
  description: string;
  canonicalPath: string;
  serviceType?: string;
}) {
  const url = buildCanonicalUrl(options.canonicalPath);
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: stripMarkup(options.name),
    description: stripMarkup(options.description),
    serviceType: options.serviceType ? stripMarkup(options.serviceType) : stripMarkup(options.name),
    url,
    provider: {
      "@id": BUSINESS_ENTITY.id,
    },
    areaServed: BUSINESS_ENTITY.areaServed,
  });
}

export function buildBlogPostingSchema(input: BlogPostingSchemaInput) {
  const canonicalUrl = buildCanonicalUrl(input.canonicalPath);
  const resolvedImage = input.image
    ? input.image.startsWith("http")
      ? input.image
      : `${CANONICAL_DOMAIN}${input.image.startsWith("/") ? "" : "/"}${input.image}`
    : DEFAULT_OG_IMAGE;

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: stripMarkup(input.headline),
    description: stripMarkup(input.description),
    image: resolvedImage,
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author: {
      "@type": "Person",
      name: input.authorName || BUSINESS_ENTITY.founder.name,
      jobTitle: input.authorRole || BUSINESS_ENTITY.founder.jobTitle,
      worksFor: {
        "@id": BUSINESS_ENTITY.id,
      },
    },
    publisher: {
      "@id": BUSINESS_ENTITY.id,
    },
    articleSection: input.articleSection || "UAE Tax & Accounting",
    keywords: input.keywords && input.keywords.length > 0 ? input.keywords.join(", ") : undefined,
    inLanguage: "en-AE",
  });
}

export function buildWebApplicationSchema(options?: {
  name?: string;
  description?: string;
  canonicalPath?: string;
}) {
  const canonicalUrl = buildCanonicalUrl(options?.canonicalPath || "/uae-tax-planner");
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${canonicalUrl}#webapp`,
    name: options?.name || "2026 UAE Corporate Tax & 5% VAT Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    url: canonicalUrl,
    description:
      options?.description ||
      "Free interactive 2026 UAE Corporate Tax Calculator (Mainland 9%, AED 375,000 0% band, AED 3,000,000 Small Business Relief, Free Zone 0% QFZP De Minimis) and 5% UAE VAT Input Recovery Calculator.",
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
    provider: {
      "@id": BUSINESS_ENTITY.id,
    },
    inLanguage: "en-AE",
  });
}

export function upsertJsonLd(id: string, payload: unknown) {
  if (typeof document === "undefined") return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  const serialized =
    typeof payload === "string" ? payload : JSON.stringify(sanitizeJsonLd(payload));
  el.textContent = serialized;
}

export function removeJsonLd(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

export function clearRouteJsonLd(keepIds: string[] = []) {
  if (typeof document === "undefined") return;
  const keepSet = new Set(keepIds);
  for (const id of ROUTE_SCOPED_JSONLD_IDS) {
    if (!keepSet.has(id)) {
      removeJsonLd(id);
    }
  }
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(attr: "name" | "property", key: string) {
  if (typeof document === "undefined") return;
  const el = document.querySelector(`meta[${attr}="${key}"]`);
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

/**
 * Applies page-level SEO metadata, Open Graph tags, Twitter Card tags,
 * and a strict self-referencing canonical URL (https://diasuae.ae/...).
 */
export function applyPageSEO({
  title,
  description,
  canonicalPath,
  keywords,
  ogImage,
  ogImageAlt,
  ogType = "website",
  publishedTime,
  modifiedTime,
  authorName,
  articleSection,
  robots = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
}: PageSEOOptions) {
  if (typeof document === "undefined") return;

  const cleanPath = normalizeCanonicalPath(canonicalPath);
  const canonicalUrl = `${CANONICAL_DOMAIN}${cleanPath}`;
  const cleanTitle = stripMarkup(title);
  const cleanDescription = stripMarkup(description);

  // Clear route-scoped schemas so previous page schemas never leak
  clearRouteJsonLd();

  document.title = cleanTitle;

  upsertMeta("name", "title", cleanTitle);
  upsertMeta("name", "description", cleanDescription);
  upsertMeta("name", "robots", robots);
  if (keywords) {
    upsertMeta("name", "keywords", keywords);
  }

  // Self-referencing canonical tag (no trailing slash except root "/")
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", canonicalUrl);

  // Align hreflang links with canonical URL
  const hreflangEn = document.querySelector(
    'link[rel="alternate"][hreflang="en"]'
  ) as HTMLLinkElement | null;
  if (hreflangEn) hreflangEn.setAttribute("href", canonicalUrl);

  const hreflangDefault = document.querySelector(
    'link[rel="alternate"][hreflang="x-default"]'
  ) as HTMLLinkElement | null;
  if (hreflangDefault) hreflangDefault.setAttribute("href", canonicalUrl);

  // Resolve social image (always absolute HTTPS PNG/JPEG; defaults to /og-image.png)
  const resolvedOgImage = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${CANONICAL_DOMAIN}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`
    : DEFAULT_OG_IMAGE;
  const resolvedOgAlt = ogImageAlt || cleanTitle || DEFAULT_OG_IMAGE_ALT;

  // Open Graph tags
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:type", ogType);
  upsertMeta("property", "og:locale", "en_AE");
  upsertMeta("property", "og:title", cleanTitle);
  upsertMeta("property", "og:description", cleanDescription);
  upsertMeta("property", "og:url", canonicalUrl);
  upsertMeta("property", "og:image", resolvedOgImage);
  upsertMeta("property", "og:image:secure_url", resolvedOgImage);
  upsertMeta("property", "og:image:width", DEFAULT_OG_IMAGE_WIDTH);
  upsertMeta("property", "og:image:height", DEFAULT_OG_IMAGE_HEIGHT);
  upsertMeta("property", "og:image:alt", resolvedOgAlt);
  removeMeta("property", "og:image:type");

  // Article-specific Open Graph tags
  if (ogType === "article") {
    if (publishedTime) upsertMeta("property", "article:published_time", publishedTime);
    if (modifiedTime || publishedTime) {
      upsertMeta("property", "article:modified_time", modifiedTime || publishedTime || "");
    }
    if (authorName) upsertMeta("property", "article:author", authorName);
    if (articleSection) upsertMeta("property", "article:section", articleSection);
    upsertMeta("property", "article:publisher", "https://ae.linkedin.com/company/diasaccounting");
  } else {
    removeMeta("property", "article:published_time");
    removeMeta("property", "article:modified_time");
    removeMeta("property", "article:author");
    removeMeta("property", "article:section");
    removeMeta("property", "article:publisher");
  }

  // Twitter / X Card tags
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", cleanTitle);
  upsertMeta("name", "twitter:description", cleanDescription);
  upsertMeta("name", "twitter:url", canonicalUrl);
  upsertMeta("name", "twitter:image", resolvedOgImage);
  upsertMeta("name", "twitter:image:alt", resolvedOgAlt);
}
