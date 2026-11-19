export interface LiveBloggerPost {
  id: string;
  title: string;
  publishedDate: string;
  publishedIso: string;
  url: string;
  excerpt: string;
  categories: string[];
  primaryCategory: string;
  thumbnail?: string;
}

const BLOGGER_FEED_BASE = "https://insights.diasuae.ae/feeds/posts/default";

function formatPublishedDate(iso?: string): string {
  if (!iso) return "Recent";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Recent";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Strips all HTML tags, <script>, and <style> blocks using DOMParser with regex fallback,
 * normalizes whitespace, and truncates cleanly to ~160 characters with "...".
 */
export function buildCleanExcerpt(rawHtml: string, maxLength = 160): string {
  if (!rawHtml) return "";

  let plainText = "";
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, "text/html");
      doc.querySelectorAll("script, style, noscript, iframe, svg").forEach((el) => el.remove());
      plainText = doc.body?.textContent || "";
    } catch {
      plainText = "";
    }
  }

  if (!plainText) {
    plainText = rawHtml
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">");
  }

  const normalized = plainText.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const sliced = normalized.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  const cleanCut = lastSpace > maxLength - 35 ? sliced.slice(0, lastSpace) : sliced;
  return `${cleanCut.replace(/[.,;:!?\-–—]+$/, "").trim()}...`;
}

function upgradeThumbnailUrl(rawUrl?: string): string | undefined {
  if (!rawUrl || !rawUrl.startsWith("http")) return undefined;
  return rawUrl
    .replace(/\/s\d+-c\//i, "/s640/")
    .replace(/\/w\d+-h\d+[^/]*\//i, "/s640/")
    .replace(/=s\d+-c$/i, "=s640");
}

function inferPrimaryCategory(rawCategories: string[], title: string): string {
  if (rawCategories.length > 0) return rawCategories[0];
  const lower = title.toLowerCase();
  if (lower.includes("vat") || lower.includes("e-invoic")) return "VAT & E-Invoicing";
  if (lower.includes("free zone") || lower.includes("shams") || lower.includes("setup") || lower.includes("formation")) {
    return "Free Zone Setup";
  }
  if (lower.includes("ifrs") || lower.includes("bookkeeping") || lower.includes("accounting")) {
    return "Bookkeeping & IFRS";
  }
  if (lower.includes("penalty") || lower.includes("audit") || lower.includes("compliance")) {
    return "Compliance & Penalties";
  }
  return "Corporate Tax (9%)";
}

export function parseBloggerFeed(data: any): LiveBloggerPost[] {
  const entries = data?.feed?.entry;
  if (!Array.isArray(entries)) return [];

  const posts: LiveBloggerPost[] = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const title = String(entry?.title?.$t || "").trim();
    if (!title) continue;

    const publishedIso = String(entry?.published?.$t || "");
    const publishedDate = formatPublishedDate(publishedIso);

    const links = Array.isArray(entry?.link) ? entry.link : [];
    const altLink = links.find((l: any) => l?.rel === "alternate" && typeof l?.href === "string");
    const url = altLink?.href || "https://insights.diasuae.ae/";

    const rawHtml = String(entry?.content?.$t || entry?.summary?.$t || "");
    const excerpt =
      buildCleanExcerpt(rawHtml, 160) ||
      "Read the latest UAE Corporate Tax, 5% VAT, and Federal Tax Authority compliance briefing on insights.diasuae.ae.";

    const categories: string[] = Array.isArray(entry?.category)
      ? entry.category.map((c: any) => String(c?.term || "").trim()).filter(Boolean)
      : [];

    const thumbnail = upgradeThumbnailUrl(entry?.media$thumbnail?.url);

    const rawId = String(entry?.id?.$t || "");
    const extractedId = rawId.includes("post-") ? rawId.split("post-")[1] : `${i}-${Date.now()}`;

    posts.push({
      id: `insights-${extractedId}`,
      title,
      publishedDate,
      publishedIso,
      url,
      excerpt,
      categories,
      primaryCategory: inferPrimaryCategory(categories, title),
      thumbnail,
    });
  }

  return posts;
}

/**
 * Cross-origin safe JSONP loader for Blogger's `alt=json-in-script` feed endpoint
 * with automatic <script> cleanup and timeout protection.
 */
function fetchBloggerViaJsonp(maxResults = 12, timeoutMs = 8000): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      reject(new Error("Browser DOM unavailable for JSONP"));
      return;
    }

    const callbackName = `__diasBloggerFeed_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const script = document.createElement("script");
    let settled = false;

    const cleanup = () => {
      if (timerId) window.clearTimeout(timerId);
      try {
        delete (window as unknown as Record<string, unknown>)[callbackName];
      } catch {
        (window as unknown as Record<string, unknown>)[callbackName] = undefined;
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    const timerId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("Blogger JSONP request timed out"));
    }, timeoutMs);

    (window as unknown as Record<string, (payload: unknown) => void>)[callbackName] = (payload: unknown) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(payload);
    };

    script.src = `${BLOGGER_FEED_BASE}?alt=json-in-script&max-results=${maxResults}&callback=${encodeURIComponent(callbackName)}`;
    script.async = true;
    script.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("Blogger JSONP script failed to load"));
    };

    (document.head || document.body).appendChild(script);
  });
}

/**
 * Fetches latest posts from insights.diasuae.ae via JSONP first (CORS-safe),
 * falling back to server proxy (/api/blogger-feed) and direct fetch(?alt=json).
 */
export async function fetchLiveBloggerPosts(maxResults = 12): Promise<LiveBloggerPost[]> {
  // 1. Primary: Cross-origin safe JSONP (works on static hosting + Firebase + browsers)
  try {
    const jsonpData = await fetchBloggerViaJsonp(maxResults, 7500);
    const parsed = parseBloggerFeed(jsonpData);
    if (parsed.length > 0) return parsed;
  } catch {
    // Proceed to fetch fallbacks
  }

  // 2. Fallback A: Same-origin server proxy
  try {
    const proxyRes = await fetch(`/api/blogger-feed?max-results=${maxResults}`);
    if (proxyRes.ok) {
      const proxyData = await proxyRes.json();
      const parsed = parseBloggerFeed(proxyData);
      if (parsed.length > 0) return parsed;
    }
  } catch {
    // Proceed to direct fetch fallback
  }

  // 3. Fallback B: Direct Blogger JSON fetch
  const directRes = await fetch(`${BLOGGER_FEED_BASE}?alt=json&max-results=${maxResults}`, {
    mode: "cors",
  });
  if (!directRes.ok) {
    throw new Error(`Blogger feed returned ${directRes.status}`);
  }
  const directData = await directRes.json();
  return parseBloggerFeed(directData);
}
