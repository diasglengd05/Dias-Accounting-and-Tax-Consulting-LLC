/**
 * Dynamic Open Graph (OG) Image & Meta Tags Utility
 * Generates on-the-fly customized social sharing previews for blog articles & pages.
 */

export interface OgImageOptions {
  id?: string;
  title: string;
  authorName?: string;
  authorRole?: string;
  tag?: string;
  date?: string;
  readTime?: string;
  summary?: string;
}

/**
 * Builds the dynamic OG image URL for a blog post or custom page
 */
export function getBlogOgImageUrl(options: OgImageOptions, baseUrl?: string): string {
  const origin = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  
  const params = new URLSearchParams();
  if (options.id) params.set("id", options.id);
  if (options.title) params.set("title", options.title);
  if (options.authorName) params.set("author", options.authorName);
  if (options.authorRole) params.set("role", options.authorRole);
  if (options.tag) params.set("tag", options.tag);
  if (options.date) params.set("date", options.date);
  if (options.readTime) params.set("readTime", options.readTime);
  if (options.summary) params.set("summary", options.summary.slice(0, 160));

  return `${origin}/api/og?${params.toString()}`;
}

/**
 * Returns the default primary brand OG image URL
 */
export function getDefaultOgImageUrl(baseUrl?: string): string {
  const origin = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const params = new URLSearchParams({
    title: "Corporate Tax, VAT & Bookkeeping Experts Dubai UAE",
    author: "Glen Dias",
    role: "FTA Registered Tax Agent & Senior Advisor",
    tag: "UAE Tax Compliance",
    date: "2025/2026 Regulations",
    readTime: "FTA Certified",
    summary: "Premier FTA-certified tax consultants in Dubai. UAE Corporate Tax (9%), VAT compliance, backlog bookkeeping & Free Zone optimization.",
  });
  return `${origin}/api/og?${params.toString()}`;
}

/**
 * Dynamically updates document metadata & Open Graph tags in the DOM
 * This ensures dynamic previews when links are copied or shared
 */
export function updateDocumentOgMeta(meta: {
  title: string;
  description: string;
  ogImage: string;
  url?: string;
  author?: string;
  type?: string;
}): () => void {
  if (typeof document === "undefined") return () => {};

  // Store previous attributes to allow clean restoration
  const previousTitle = document.title;
  const previousTags: Record<string, string | null> = {};

  const setMetaTag = (selector: string, attribute: "content" | "href", value: string) => {
    let el = document.querySelector(selector);
    if (el) {
      previousTags[selector] = el.getAttribute(attribute);
      el.setAttribute(attribute, value);
    } else {
      previousTags[selector] = null;
      const isProperty = selector.includes("property=");
      const isName = selector.includes("name=");
      const isRel = selector.includes("rel=");
      
      const newEl = document.createElement(isRel ? "link" : "meta");
      if (isProperty) {
        const prop = selector.match(/property="([^"]+)"/)?.[1];
        if (prop) newEl.setAttribute("property", prop);
      } else if (isName) {
        const name = selector.match(/name="([^"]+)"/)?.[1];
        if (name) newEl.setAttribute("name", name);
      } else if (isRel) {
        const rel = selector.match(/rel="([^"]+)"/)?.[1];
        if (rel) newEl.setAttribute("rel", rel);
      }
      newEl.setAttribute(attribute, value);
      document.head.appendChild(newEl);
    }
  };

  // Update Page Title
  document.title = `${meta.title} | Dias Accounting & Tax Consulting Dubai`;

  // Standard Meta Tags
  setMetaTag('meta[name="title"]', "content", `${meta.title} | Dias Accounting`);
  setMetaTag('meta[name="description"]', "content", meta.description);
  if (meta.author) {
    setMetaTag('meta[name="author"]', "content", meta.author);
  }

  // Open Graph
  setMetaTag('meta[property="og:title"]', "content", meta.title);
  setMetaTag('meta[property="og:description"]', "content", meta.description);
  setMetaTag('meta[property="og:image"]', "content", meta.ogImage);
  setMetaTag('meta[property="og:image:secure_url"]', "content", meta.ogImage);
  setMetaTag('meta[property="og:image:type"]', "content", "image/svg+xml");
  setMetaTag('meta[property="og:image:width"]', "content", "1200");
  setMetaTag('meta[property="og:image:height"]', "content", "630");
  setMetaTag('meta[property="og:image:alt"]', "content", meta.title);
  setMetaTag('meta[property="og:type"]', "content", meta.type || "article");
  if (meta.url) {
    setMetaTag('meta[property="og:url"]', "content", meta.url);
    setMetaTag('link[rel="canonical"]', "href", meta.url);
  }

  // Twitter Cards
  setMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
  setMetaTag('meta[name="twitter:title"]', "content", meta.title);
  setMetaTag('meta[name="twitter:description"]', "content", meta.description);
  setMetaTag('meta[name="twitter:image"]', "content", meta.ogImage);
  setMetaTag('meta[name="twitter:image:alt"]', "content", meta.title);
  if (meta.url) {
    setMetaTag('meta[name="twitter:url"]', "content", meta.url);
  }

  // Return cleanup function to restore default site metadata
  return () => {
    document.title = previousTitle;
    Object.entries(previousTags).forEach(([selector, prevVal]) => {
      const el = document.querySelector(selector);
      if (el) {
        if (prevVal !== null) {
          const attribute = selector.startsWith("link") ? "href" : "content";
          el.setAttribute(attribute, prevVal);
        }
      }
    });
  };
}

/**
 * Generate Share URLs for social media platforms
 */
export function getSocialShareUrls(url: string, title: string, summary?: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary || title);

  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=UAETax,CorporateTax,DubaiAccounting,DiasAccounting`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedSummary}%0A%0ARead%20more%20here:%20${encodedUrl}`,
  };
}
