import { useEffect } from "react";
import { Service, BlogPost } from "../types";
import { Language } from "../i18n/translations";
import {
  CORE_HOMEPAGE_FAQS,
  buildBlogPostingSchema,
  buildFAQPageSchema,
  buildServiceSchema,
  clearRouteJsonLd,
  upsertJsonLd,
} from "../lib/seo";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_NAME,
  SITE_URL,
} from "../lib/seoConfig";

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  hash: string;
  ogType?: "website" | "article";
  ogImage?: string;
}

export const SECTION_SEO_MAP_EN: Record<string, SEOConfig> = {
  home: {
    title: "DiasUAE | UAE Tax Agents & IFRS Accounting From AED 400/Mo",
    description:
      "FTA-Registered Tax Agency in Dubai & SHAMS led by Glen Dias. Monthly IFRS bookkeeping, 5% VAT, 9% Corporate Tax & dividend audits from AED 400/mo. Free 15-min review.",
    keywords:
      "DiasUAE, diasuae.ae, UAE Corporate Tax, UAE VAT Compliance, IFRS Bookkeeping Dubai, FTA Registered Tax Agent, Fixed-Fee Accounting Packages UAE, SHAMS Accounting Firm, DIFC Tax Compliance, Dias Accounting",
    hash: "#home",
    ogImage: DEFAULT_OG_IMAGE,
  },
};

export const SECTION_SEO_MAP_AR: Record<string, SEOConfig> = {
  home: {
    title: "خدمات الاستشارات الضريبية والمحاسبة في الإمارات ودبي | دياس للمحاسبة",
    description:
      "وكيل ضريبي معتمد لدى الهيئة الاتحادية للضرائب في دبي والشارقة (شمس). مسك الدفاتر وفق معايير IFRS من 400 درهم/شهرياً، وضريبة القيمة المضافة 5% وضريبة الشركات 9%.",
    keywords:
      "خدمات الاستشارات الضريبية في الإمارات, استشارات ضريبية في دبي, ضريبة الشركات الإمارات, الامتثال لضريبة القيمة المضافة, خدمات المحاسبة ومسك الدفاتر دبي",
    hash: "#home",
    ogImage: DEFAULT_OG_IMAGE,
  },
};

interface UseDynamicSEOMetadataProps {
  activeSection: string;
  selectedService?: Service | null;
  selectedBlog?: BlogPost | null;
  language?: Language;
  updateUrlHash?: boolean;
  enabled?: boolean;
}

function setMetaTag(attributeName: "name" | "property", attributeValue: string, content: string) {
  if (typeof document === "undefined") return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setCanonical(url: string) {
  if (typeof document === "undefined") return;
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);

  const hreflangEn = document.querySelector(
    'link[rel="alternate"][hreflang="en"]'
  ) as HTMLLinkElement | null;
  if (hreflangEn) hreflangEn.setAttribute("href", url);

  const hreflangDefault = document.querySelector(
    'link[rel="alternate"][hreflang="x-default"]'
  ) as HTMLLinkElement | null;
  if (hreflangDefault) hreflangDefault.setAttribute("href", url);
}

function toSafeIsoDate(raw?: string): string {
  if (!raw) return "2026-01-01";
  const parsed = Date.parse(raw);
  if (Number.isNaN(parsed)) return "2026-01-01";
  return new Date(parsed).toISOString().slice(0, 10);
}

export function useDynamicSEO({
  activeSection,
  selectedService = null,
  selectedBlog = null,
  language = "en",
  enabled = true,
}: UseDynamicSEOMetadataProps) {
  useEffect(() => {
    if (typeof document === "undefined" || !enabled) return;

    try {
      const isAr = language === "ar";
      const sectionMap = isAr ? SECTION_SEO_MAP_AR : SECTION_SEO_MAP_EN;
      let seoConfig: SEOConfig = sectionMap.home;

      if (selectedService) {
        seoConfig = {
          title: `${selectedService.title} in UAE | Dias Accounting`,
          description: selectedService.shortDesc || sectionMap.home.description,
          keywords: `${selectedService.title} UAE, ${selectedService.title} Dubai, FTA tax agent, Dias Accounting`,
          hash: `#services-${selectedService.id}`,
          ogType: "website",
          ogImage: DEFAULT_OG_IMAGE,
        };
      } else if (selectedBlog) {
        seoConfig = {
          title: `${selectedBlog.title} | Dias Accounting`,
          description: selectedBlog.summary || sectionMap.home.description,
          keywords: `UAE tax guide, ${selectedBlog.tag}, corporate tax Dubai, FTA compliance`,
          hash: `#blog-${selectedBlog.id}`,
          ogType: "article",
          ogImage: DEFAULT_OG_IMAGE,
        };
      }

      const canonicalUrl = selectedBlog
        ? `${SITE_URL}/blog/${selectedBlog.id}`
        : selectedService
          ? `${SITE_URL}/services/${selectedService.id}`
          : `${SITE_URL}/`;

      document.title = seoConfig.title;
      setMetaTag("name", "title", seoConfig.title);
      setMetaTag("name", "description", seoConfig.description);
      setMetaTag("name", "keywords", seoConfig.keywords);
      setMetaTag("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");

      setMetaTag("property", "og:site_name", SITE_NAME);
      setMetaTag("property", "og:title", seoConfig.title);
      setMetaTag("property", "og:description", seoConfig.description);
      setMetaTag("property", "og:url", canonicalUrl);
      setMetaTag("property", "og:type", seoConfig.ogType || "website");
      setMetaTag("property", "og:locale", isAr ? "ar_AE" : "en_AE");

      const resolvedOgImage = seoConfig.ogImage || DEFAULT_OG_IMAGE;
      setMetaTag("property", "og:image", resolvedOgImage);
      setMetaTag("property", "og:image:secure_url", resolvedOgImage);
      setMetaTag("property", "og:image:width", DEFAULT_OG_IMAGE_WIDTH);
      setMetaTag("property", "og:image:height", DEFAULT_OG_IMAGE_HEIGHT);
      setMetaTag("property", "og:image:alt", seoConfig.title);

      setMetaTag("name", "twitter:card", "summary_large_image");
      setMetaTag("name", "twitter:title", seoConfig.title);
      setMetaTag("name", "twitter:description", seoConfig.description);
      setMetaTag("name", "twitter:url", canonicalUrl);
      setMetaTag("name", "twitter:image", resolvedOgImage);
      setMetaTag("name", "twitter:image:alt", seoConfig.title);

      setCanonical(canonicalUrl);

      clearRouteJsonLd(["homepage-faq-jsonld"]);

      if (selectedBlog) {
        upsertJsonLd(
          "page-article-jsonld",
          buildBlogPostingSchema({
            headline: selectedBlog.title,
            description: selectedBlog.summary || seoConfig.description,
            canonicalPath: `/blog/${selectedBlog.id}`,
            datePublished: toSafeIsoDate(selectedBlog.publishedIso || selectedBlog.date),
            authorName: selectedBlog.author?.name,
            authorRole: selectedBlog.author?.role,
            articleSection: selectedBlog.tag,
            keywords: selectedBlog.keywords,
          })
        );
      } else if (selectedService) {
        upsertJsonLd(
          "page-service-jsonld",
          buildServiceSchema({
            name: selectedService.title,
            description: selectedService.shortDesc || seoConfig.description,
            canonicalPath: `/services/${selectedService.id}`,
          })
        );
      }

      upsertJsonLd(
        "homepage-faq-jsonld",
        buildFAQPageSchema(CORE_HOMEPAGE_FAQS, `${SITE_URL}/#faqs`)
      );
    } catch (err) {
      console.warn("useDynamicSEO safe bypass:", err);
    }
  }, [activeSection, selectedService, selectedBlog, language, enabled]);
}

export default useDynamicSEO;

