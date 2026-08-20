import { useEffect } from "react";
import { Service, BlogPost } from "../types";

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  hash: string;
  ogType?: string;
  ogImage?: string;
}

// Master SEO keyword-rich metadata dictionary tailored for UAE FTA compliance & search indexing
export const SECTION_SEO_MAP: Record<string, SEOConfig> = {
  home: {
    title: "Dias Accounting & Tax Consulting | Corporate Tax, VAT & Bookkeeping Experts Dubai UAE",
    description: "Premier FTA-certified tax consultants in Dubai & UAE. Expert UAE Corporate Tax registration (9%), VAT compliance, backlog bookkeeping, and CFO advisory.",
    keywords: "Dubai accounting firm, UAE corporate tax consultant, VAT filing Dubai, Free Zone bookkeeping DMCC, FTA tax agent Dubai, Corporate tax registration EmaraTax, backlog accounting Dubai, Glen Dias accounting, business setup UAE",
    hash: "#home",
    ogImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
  },
  services: {
    title: "Corporate Tax, VAT Compliance & Bookkeeping Services | Dias Accounting Dubai",
    description: "Explore our FTA-certified accounting services: UAE Corporate Tax Filing (9%), VAT Returns & Disclosures, Free Zone QFZP 0% Tax Structuring, Cloud Bookkeeping, and Fractional CFO Advisory in Dubai.",
    keywords: "UAE corporate tax return, VAT voluntary disclosure, qualifying free zone person 0%, Xero bookkeeping Dubai, Zoho Books accountant UAE, audit financial statement Dubai, corporate tax advisory Business Bay",
    hash: "#services",
    ogImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
  },
  about: {
    title: "About Glen Dias & Our Certified Tax Team | Dias Accounting Dubai",
    description: "Led by Senior Tax Consultant Glen Dias, Dias Accounting delivers high-precision, FTA-compliant accounting, IFRS reporting, and tax advisory across Dubai & UAE.",
    keywords: "Glen Dias accountant, Dias Accounting LLC, certified tax consultant Dubai, FTA tax agent UAE, chartered accountants Business Bay Dubai, ACCA CPA accountants UAE",
    hash: "#about",
    ogImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200",
  },
  pricing: {
    title: "Affordable Accounting & Corporate Tax Packages Dubai | Dias Accounting UAE",
    description: "Transparent, fixed-fee monthly bookkeeping and UAE corporate tax compliance packages starting from AED 950/mo for Mainland LLCs and Free Zone startups.",
    keywords: "accounting cost Dubai, corporate tax filing fees UAE, monthly bookkeeping package Dubai, FTA VAT agent cost, affordable accountant Dubai, small business bookkeeping price UAE",
    hash: "#pricing",
    ogImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200",
  },
  calculator: {
    title: "UAE Corporate Tax Calculator 2026 | Free 9% Tax & Small Business Relief Tool",
    description: "Calculate your UAE Corporate Tax liability instantly. Accurately estimate 9% tax above AED 375,000 threshold and verify Small Business Relief (AED 3M) eligibility.",
    keywords: "UAE corporate tax calculator, 9 percent tax calculator Dubai, small business relief calculator UAE, calculate corporate tax UAE 2026, EmaraTax tax estimator",
    hash: "#calculator",
    ogImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200",
  },
  testimonials: {
    title: "Client Reviews & Testimonials 5.0★ | Dias Accounting Dubai",
    description: "Read genuine 5-star reviews from Dubai CEOs, founders, and finance directors who trust Dias Accounting for penalty-free corporate tax, VAT, and bookkeeping.",
    keywords: "Dias Accounting reviews, best tax consultant Dubai review, top rated accountant Dubai, corporate tax testimonials UAE, customer feedback Dias Accounting",
    hash: "#testimonials",
    ogImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
  },
  faqs: {
    title: "UAE Corporate Tax & VAT FAQ 2026 | FTA Compliance Answers | Dias Accounting",
    description: "Get expert answers to common UAE Corporate Tax questions: 9% threshold, EmaraTax deadlines, Free Zone 0% qualification, and AED 10,000 late registration penalties.",
    keywords: "UAE corporate tax FAQ, corporate tax deadline UAE, Freezone 0 percent tax rules, FTA late registration penalty, VAT threshold UAE, Small Business Relief FAQ",
    hash: "#faqs",
    ogImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200",
  },
  blogs: {
    title: "UAE Tax Insights & Corporate Tax Compliance Guides | Dias Accounting Dubai",
    description: "Stay ahead of FTA regulations with expert articles on UAE Corporate Tax filing, VAT compliance, Small Business Relief, and audited financial statements.",
    keywords: "UAE tax news, corporate tax guide Dubai, FTA ministerial decisions, UAE VAT recovery rules, IFRS accounting Dubai, EmaraTax filing updates",
    hash: "#blogs",
    ogImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
  },
  contact: {
    title: "Contact Dias Accounting Dubai | Book a Free 15-Min Tax Consultation",
    description: "Contact FTA-certified tax consultant Glen Dias. Located in Business Bay, Dubai. Instant WhatsApp support (+971 52 922 6958) or book a free 15-minute consultation.",
    keywords: "contact accountant Dubai, tax consultant phone number Dubai, Glen Dias WhatsApp, accounting office Business Bay Dubai, book tax consultation UAE",
    hash: "#contact",
    ogImage: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=1200",
  },
};

interface UseDynamicSEOMetadataProps {
  activeSection: string;
  selectedService?: Service | null;
  selectedBlog?: BlogPost | null;
  updateUrlHash?: boolean;
}

/**
 * Helper to update or create a `<meta>` element by name or property
 */
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

/**
 * Helper to update or create the canonical link tag
 */
function setCanonical(url: string) {
  if (typeof document === "undefined") return;

  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

/**
 * Custom React Hook to dynamically synchronize document title and SEO meta tags
 * (title, description, keywords, Open Graph, Twitter cards, and canonical URL)
 * based on the user's currently active view/section or open service/blog modal.
 */
export function useDynamicSEO({
  activeSection,
  selectedService = null,
  selectedBlog = null,
  updateUrlHash = true,
}: UseDynamicSEOMetadataProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const baseUrl = "https://diasuae.ae";
    let seoConfig: SEOConfig;

    // Case 1: Specific Service Modal is open
    if (selectedService) {
      seoConfig = {
        title: `${selectedService.title} in Dubai, UAE | Dias Accounting & Tax Consulting`,
        description: `${selectedService.shortDesc} Certified FTA tax advisors in Business Bay Dubai providing full ${selectedService.title.toLowerCase()} support. Avoid penalties with zero-error compliance.`,
        keywords: `${selectedService.title.toLowerCase()} Dubai, ${selectedService.title.toLowerCase()} UAE, FTA tax agent, Dias Accounting, ${selectedService.inclusions.slice(0, 3).join(", ").toLowerCase()}`,
        hash: `#services-${selectedService.id}`,
        ogType: "article",
      };
    }
    // Case 2: Specific Blog Post Reader is open
    else if (selectedBlog) {
      seoConfig = {
        title: `${selectedBlog.title} | UAE Tax Insights | Dias Accounting`,
        description: selectedBlog.summary || "Read the latest UAE Corporate Tax and VAT regulatory insights from Dias Accounting Dubai.",
        keywords: `UAE tax guide, ${selectedBlog.tag}, corporate tax Dubai, FTA compliance, ${selectedBlog.title.toLowerCase()}`,
        hash: `#blog-${selectedBlog.id}`,
        ogType: "article",
      };
    }
    // Case 3: Active Section on the landing page
    else {
      seoConfig = SECTION_SEO_MAP[activeSection] || SECTION_SEO_MAP.home;
    }

    const fullUrl = seoConfig.hash === "#home" ? `${baseUrl}/` : `${baseUrl}/${seoConfig.hash}`;

    // 1. Update Document Title
    document.title = seoConfig.title;

    // 2. Standard Meta Tags
    setMetaTag("name", "title", seoConfig.title);
    setMetaTag("name", "description", seoConfig.description);
    setMetaTag("name", "keywords", seoConfig.keywords);

    // 3. Open Graph Tags
    setMetaTag("property", "og:title", seoConfig.title);
    setMetaTag("property", "og:description", seoConfig.description);
    setMetaTag("property", "og:url", fullUrl);
    setMetaTag("property", "og:type", seoConfig.ogType || "business.business");
    if (seoConfig.ogImage) {
      setMetaTag("property", "og:image", seoConfig.ogImage);
    }

    // 4. Twitter Card Tags
    setMetaTag("name", "twitter:title", seoConfig.title);
    setMetaTag("name", "twitter:description", seoConfig.description);
    setMetaTag("name", "twitter:url", fullUrl);
    if (seoConfig.ogImage) {
      setMetaTag("name", "twitter:image", seoConfig.ogImage);
    }

    // 5. Canonical URL
    setCanonical(fullUrl);

    // 6. Non-intrusive URL Hash synchronization (without triggering browser scroll jumps)
    if (updateUrlHash && typeof window !== "undefined" && window.history && window.history.replaceState) {
      const currentHash = window.location.hash;
      const targetHash = seoConfig.hash === "#home" ? "" : seoConfig.hash;
      
      if (currentHash !== targetHash && !(currentHash === "" && targetHash === "")) {
        const newUrl = targetHash ? `${window.location.pathname}${targetHash}` : window.location.pathname;
        window.history.replaceState(null, "", newUrl);
      }
    }
  }, [activeSection, selectedService, selectedBlog, updateUrlHash]);
}

export default useDynamicSEO;
