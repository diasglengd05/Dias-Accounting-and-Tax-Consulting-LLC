export const CANONICAL_DOMAIN = "https://diasuae.ae";

export interface PageSEOOptions {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "business.business";
}

export interface FAQSchemaItem {
  question: string;
  answer: string;
}

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

export function buildFAQPageSchema(items: FAQSchemaItem[], schemaId?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(schemaId ? { "@id": schemaId } : {}),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
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
  el.textContent = typeof payload === "string" ? payload : JSON.stringify(payload);
}

export function removeJsonLd(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
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

/**
 * Applies page-level SEO metadata, Open Graph tags, Twitter Card tags,
 * and a strict self-referencing non-www canonical URL (https://diasuae.ae/...).
 */
export function applyPageSEO({
  title,
  description,
  canonicalPath,
  keywords,
  ogImage,
  ogType = "website",
}: PageSEOOptions) {
  if (typeof document === "undefined") return;

  // Ensure leading slash and strip any trailing slash (except root "/") or hash/query
  const cleanPath =
    canonicalPath === "/" || canonicalPath === ""
      ? "/"
      : `/${canonicalPath.replace(/^\/+/, "").replace(/\/+$/, "").split("?")[0].split("#")[0]}`;

  const canonicalUrl = `${CANONICAL_DOMAIN}${cleanPath}`;

  document.title = title;

  upsertMeta("name", "title", title);
  upsertMeta("name", "description", description);
  if (keywords) {
    upsertMeta("name", "keywords", keywords);
  }

  // Ensure homepage-specific schemas do not leak onto unrelated subpages
  if (cleanPath !== "/" && cleanPath !== "/faqs") {
    removeJsonLd("homepage-faq-jsonld");
  }
  if (cleanPath !== "/") {
    removeJsonLd("homepage-howto-jsonld");
    removeJsonLd("page-breadcrumb-jsonld");
  }

  // Self-referencing non-www canonical tag
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", canonicalUrl);

  // Alternate hreflang links aligned to canonicalUrl
  const hreflangEn = document.querySelector('link[rel="alternate"][hreflang="en"]') as HTMLLinkElement | null;
  if (hreflangEn) hreflangEn.setAttribute("href", canonicalUrl);

  const hreflangDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]') as HTMLLinkElement | null;
  if (hreflangDefault) hreflangDefault.setAttribute("href", canonicalUrl);

  // Open Graph tags
  upsertMeta("property", "og:type", ogType);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:url", canonicalUrl);

  // Twitter / X Card tags
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:url", canonicalUrl);

  if (ogImage) {
    const resolvedOgImage = ogImage.startsWith("http")
      ? ogImage
      : `${CANONICAL_DOMAIN}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`;
    upsertMeta("property", "og:image", resolvedOgImage);
    upsertMeta("property", "og:image:secure_url", resolvedOgImage);
    upsertMeta("name", "twitter:image", resolvedOgImage);
  }
}
