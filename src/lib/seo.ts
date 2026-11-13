export const CANONICAL_DOMAIN = "https://diasuae.ae";

export interface PageSEOOptions {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "business.business";
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

  // Self-referencing non-www canonical tag
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", canonicalUrl);

  // Alternate hreflang links aligned to canonicalUrl
  let hreflangEn = document.querySelector('link[rel="alternate"][hreflang="en"]') as HTMLLinkElement | null;
  if (hreflangEn) hreflangEn.setAttribute("href", canonicalUrl);

  let hreflangDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]') as HTMLLinkElement | null;
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
