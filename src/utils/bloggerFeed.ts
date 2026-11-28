import { BlogPost } from "../types";

export const BLOGGER_FEED_URL =
  "https://insights.diasuae.ae/feeds/posts/default";

export interface BloggerPost {
  slug: string;
  id: string;
  title: string;
  publishedIso: string;
  publishedDate: string;
  updatedIso: string;
  updatedDate: string;
  categories: string[];
  primaryCategory: string;
  summary: string;
  featuredImage?: string;
  contentHtml: string;
  contentFormat?: "html" | "markdown";
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  keywords: string[];
  isFallback?: boolean;
}

const DEFAULT_AUTHOR = {
  name: "Glen Dias",
  role: "Managing Director & FTA Registered Tax Agent",
  avatar:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120",
};

/**
 * Local fallback ONLY for our existing #1 ranking post (`top-tax-mistakes-uae-companies-make`)
 * when that slug does not exist in Blogger yet.
 */
export const TOP_TAX_MISTAKES_FALLBACK_POST: BloggerPost = {
  slug: "top-tax-mistakes-uae-companies-make",
  id: "top-tax-mistakes-uae-companies-make",
  title:
    "Top 7 Common Tax Mistakes UAE Companies Make in 2026 (And How to Avoid FTA Penalties)",
  publishedIso: "2026-11-12T08:00:00.000Z",
  publishedDate: "Nov 12, 2026",
  updatedIso: "2026-11-12T08:00:00.000Z",
  updatedDate: "Nov 12, 2026",
  categories: ["Compliance & Penalties", "Corporate Tax", "VAT Compliance"],
  primaryCategory: "Compliance & Penalties",
  summary:
    "Avoid costly UAE Federal Tax Authority (FTA) fines in 2026. Learn the 7 most common Corporate Tax, 5% VAT, Free Zone QFZP, Connected Person, and IFRS bookkeeping mistakes UAE companies make—and how to fix them before filing.",
  contentFormat: "markdown",
  contentHtml: `## Executive Overview: Why 2026 FTA Enforcement Demands Precision

Under **UAE Federal Decree-Law No. 47 of 2022 (Corporate Tax)** and **Federal Decree-Law No. 8 of 2017 (5% VAT)**, administrative compliance in Dubai, Sharjah, and across all seven Emirates has shifted from voluntary recordkeeping to strict EmaraTax enforcement. Even profitable, well-intentioned Mainland LLCs and Free Zone entities routinely trigger avoidable Federal Tax Authority (FTA) penalties due to structural misunderstandings.

Below are the **7 most common tax mistakes UAE companies make in 2026**—along with practical steps to safeguard your company before your next filing deadline.

---

### 1. Assuming Free Zone Entities Are Exempt from Corporate Tax Registration
One of the costliest misconceptions in the UAE is believing that a Free Zone company (SHAMS, DIFC, DTEC, DMCC, IFZA, or RAKEZ) does not need to register for Corporate Tax. **Every UAE juridical person—Mainland and Free Zone alike—must register on EmaraTax and submit an annual Corporate Tax return**, even when claiming the **0% Qualifying Free Zone Person (QFZP)** rate or **0% Small Business Relief (SBR)**.

### 2. Missing Designated FTA Registration Windows (AED 10,000 Penalty)
Under Cabinet Decision No. 75 of 2023, late Corporate Tax registration carries an automatic **AED 10,000 administrative penalty**. Newly incorporated entities must register within 3 months of incorporation. If your company has already incurred a late-registration fine, consult an FTA-Registered Tax Agent immediately to assess eligibility under the FTA's 7-month first-return penalty waiver initiative.

### 3. Commingling Personal Shareholder Finances with Corporate Bank Accounts
Paying personal rent, family travel, or private credit card bills directly from the corporate bank account creates audit exposure and causes legitimate commercial expenses to be disallowed. Maintain strict separation between shareholder drawings, director salaries, and corporate operating expenses backed by valid UAE tax invoices.

### 4. Over-Claiming Client Entertainment Expenses (50% Statutory Cap)
Under Article 32 of the UAE Corporate Tax Law, client hospitality, meals, and entertainment expenses are strictly capped at **50% tax deductibility** (and input VAT on client entertainment is generally blocked from recovery). Failing to apply the mandatory 50% add-back in your Corporate Tax computation leads to understated taxable income and audit reassessment penalties.

### 5. Non-Arm's Length Payments to Connected Persons & Related Parties
Under Article 36 of the Corporate Tax Law, salaries, bonuses, management fees, and director benefits paid to shareholders, directors, or relatives (**Connected Persons**) are deductible only to the extent they reflect **Fair Market Value** on an arm's length basis. Maintain board resolutions, employment contracts, and benchmark documentation to defend owner compensation during an FTA review.

### 6. Overlooking Reverse Charge VAT on Overseas Software & Digital Services
Many UAE businesses fail to self-account for **5% Reverse Charge Mechanism (RCM) VAT** on Box 3 and Box 10 of Form VAT 201 when purchasing overseas SaaS subscriptions, cloud hosting, Google/Meta advertising, or foreign consulting services. Leaving RCM imports unreported triggers Voluntary Disclosure (Form 211) obligations and fixed administrative fines.

### 7. Relying on Disconnected Spreadsheets Instead of IFRS Cloud Bookkeeping
Both the UAE Commercial Companies Law and Tax Procedures Law mandate retaining proper, auditable IFRS accounting records for 5 to 7 years. Disconnected Excel spreadsheets create unreconciled suspense balances and delay annual filings. Migrating to FTA-ready cloud platforms (Zoho Books, Xero, QuickBooks, or Wafeq) ensures clean monthly Profit & Loss and Balance Sheet statements all year round.

---

### Protect Your Business Before Your Next EmaraTax Deadline

Want to verify your exact 2026 UAE Corporate Tax, Small Business Relief (0% up to AED 3M), and 5% VAT position? Try our free [2026 UAE Corporate Tax & 5% VAT Calculator](/uae-tax-planner) or explore our transparent [fixed-fee monthly IFRS accounting and tax packages from AED 400/month](/pricing).`,
  readTime: "7 min read",
  author: DEFAULT_AUTHOR,
  keywords: [
    "UAE corporate tax mistakes",
    "FTA penalties UAE 2026",
    "UAE VAT compliance errors",
    "Free Zone QFZP mistakes",
    "AED 10,000 late registration penalty UAE",
    "Connected Persons UAE corporate tax",
    "FTA Registered Tax Agent Dubai",
  ],
  isFallback: true,
};

export function normalizeSlugParam(raw: string): string {
  let value = String(raw || "").trim();
  if (!value) return "";

  try {
    value = decodeURIComponent(value);
  } catch {
    // Keep original value if URI decoding fails on malformed escape sequences
  }

  // Strip protocol/domain if a full URL was passed
  value = value.replace(/^https?:\/\/[^/]+/i, "");
  // Strip query string and hash fragment (e.g. ?m=1 from Blogger mobile redirects)
  value = value.split("?")[0].split("#")[0];
  // Trim leading/trailing slashes
  value = value.replace(/^\/+|\/+$/g, "");
  // Strip optional /blog/ or /blogs/ prefix
  value = value.replace(/^blogs?\//i, "");
  // Strip Blogger /YYYY/MM/ archive prefix if preserved in a redirect
  value = value.replace(/^\d{4}\/\d{2}\//, "");
  // Strip trailing slashes again and .html/.htm suffix
  value = value.replace(/\/+$/g, "").replace(/\.html?$/i, "");
  // Keep only the final path segment if extra slashes remain
  if (value.includes("/")) {
    const segments = value.split("/").filter(Boolean);
    value = segments[segments.length - 1] || "";
  }

  return value
    .toLowerCase()
    .replace(/\.html?$/i, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeSlug(raw: string): string {
  return normalizeSlugParam(raw);
}

/**
 * Extracts each post's exact URL slug from its `rel="alternate"` Blogger link
 * by stripping the domain, `/YYYY/MM/` prefix, `.html` suffix, query params,
 * and trailing slashes, then lowercasing. Falls back to `entry.title.$t`.
 */
export function extractBloggerSlug(altUrl?: string, fallbackTitle?: string): string {
  if (altUrl && typeof altUrl === "string" && altUrl.trim()) {
    try {
      const parsed = new URL(altUrl.trim());
      const cleanPath = parsed.pathname.replace(/^\/+|\/+$/g, "");
      if (/\.html?$/i.test(cleanPath) || /^\d{4}\/\d{2}\//.test(cleanPath)) {
        const stripped = cleanPath
          .replace(/^\d{4}\/\d{2}\//, "")
          .replace(/\.html?$/i, "")
          .replace(/\/+$/g, "");
        const fromUrl = normalizeSlugParam(stripped);
        if (fromUrl) return fromUrl;
      }
    } catch {
      const noQuery = altUrl.split("?")[0].split("#")[0].replace(/\/+$/g, "");
      if (/\.html?$/i.test(noQuery) || /\/\d{4}\/\d{2}\//.test(noQuery)) {
        const fromFallbackUrl = normalizeSlugParam(noQuery);
        if (fromFallbackUrl) return fromFallbackUrl;
      }
    }
  }
  return normalizeSlugParam(fallbackTitle || "uae-tax-briefing");
}

export function formatBloggerDate(iso?: string): string {
  if (!iso) return "Recent";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Recent";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&rarr;/gi, "→")
    .replace(/&rsquo;/gi, "'")
    .replace(/&lsquo;/gi, "'")
    .replace(/&rdquo;/gi, '"')
    .replace(/&ldquo;/gi, '"');
}

/**
 * Extracts a clean plain-text summary excerpt from raw HTML or text.
 */
export function buildCleanExcerpt(rawHtml: string, maxLength = 170): string {
  if (!rawHtml) return "";

  const plainText = decodeHtmlEntities(
    rawHtml
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) return "";
  if (plainText.length <= maxLength) return plainText;

  const sliced = plainText.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  const cleanCut = lastSpace > maxLength - 35 ? sliced.slice(0, lastSpace) : sliced;
  return `${cleanCut.replace(/[.,;:!?\-–—]+$/, "").trim()}...`;
}

function estimateReadTime(rawHtml: string): string {
  const plain = rawHtml
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = plain ? plain.split(" ").length : 0;
  const mins = Math.max(3, Math.round(words / 220));
  return `${mins} min read`;
}

function validateSafeImageUrl(rawUrl?: string): string | undefined {
  if (!rawUrl || typeof rawUrl !== "string") return undefined;
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (!/^https:\/\//i.test(trimmed)) return undefined;
  return trimmed
    .replace(/\/s\d+-c\//i, "/s1200/")
    .replace(/\/w\d+-h\d+[^/]*\//i, "/s1200/")
    .replace(/=s\d+-c$/i, "=s1200");
}

function extractFirstImageFromHtml(rawHtml: string): string | undefined {
  const match = rawHtml.match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);
  if (!match?.[1]) return undefined;
  return validateSafeImageUrl(match[1]);
}

function inferPrimaryCategory(categories: string[], title: string): string {
  if (categories.length > 0) {
    const preferred = categories.find(
      (c) =>
        !/^diasuae$/i.test(c) &&
        !/^dias accounting$/i.test(c) &&
        !/^fta tax agent$/i.test(c)
    );
    if (preferred) return preferred;
    return categories[0];
  }
  const lower = title.toLowerCase();
  if (lower.includes("vat") || lower.includes("e-invoic")) return "VAT Compliance";
  if (lower.includes("dividend") || lower.includes("audit")) return "Dividends & Audit";
  if (lower.includes("difc") || lower.includes("dtec") || lower.includes("free zone") || lower.includes("shams")) {
    return "Free Zone & DIFC";
  }
  if (lower.includes("ifrs") || lower.includes("bookkeeping") || lower.includes("accounting")) {
    return "Accounting & IFRS";
  }
  return "UAE Corporate Tax";
}

/**
 * Harmonizes legacy dark-navy inline styles inside Blogger HTML posts into our
 * unified light executive theme (`#FFFFFF` / `#F8FAFC` surfaces, `#0D1B2A` text,
 * `#1B4332` emerald primary buttons, `#856422` gold accents) so every synced post
 * renders natively without dark navy blocks or low-contrast white-on-light text.
 */
function harmonizeInlineStyleToLightTheme(rawStyle: string): string {
  let style = rawStyle;

  // Detect whether this element is a gold primary CTA button (convert to emerald #1B4332)
  const isGoldButton =
    /background(?:-color)?\s*:\s*(?:linear-gradient\([^)]*#c5a059[^)]*\)|#c5a059|#dec18c)/i.test(
      style
    ) && /padding\s*:/i.test(style);

  // Detect whether this element is a dark-mode transparent outlined gold button
  const isGhostGoldButton =
    /background(?:-color)?\s*:\s*transparent/i.test(style) &&
    /border[^;]*#c5a059/i.test(style);

  if (isGoldButton) {
    style = style
      .replace(
        /background(?:-color)?\s*:\s*[^;]+/gi,
        "background: #1b4332"
      )
      .replace(/(?:^|;)\s*color\s*:\s*[^;]+/gi, (m) =>
        m.startsWith(";") ? "; color: #ffffff" : "color: #ffffff"
      )
      .replace(/border(?:-color)?\s*:\s*[^;]+/gi, "border: 1px solid #1b4332");
    return style;
  }

  if (isGhostGoldButton) {
    style = style
      .replace(/background(?:-color)?\s*:\s*transparent/gi, "background: #ffffff")
      .replace(/(?:^|;)\s*color\s*:\s*[^;]+/gi, (m) =>
        m.startsWith(";") ? "; color: #0d1b2a" : "color: #0d1b2a"
      )
      .replace(/border\s*:\s*[^;]+/gi, "border: 1px solid #cbd5e1");
    return style;
  }

  // Replace dark navy / dark slate inline backgrounds with clean light #f8fafc surface
  style = style.replace(
    /background(?:-color)?\s*:\s*(?:linear-gradient\([^;]*?(?:#070d19|#0d1b2a|#0f172a|#0a1526|#111827|#1e293b)[^;]*?\)|#070d19|#0d1b2a|#0f172a|#0a1526|#111827|#1e293b|#0b132b)/gi,
    "background: #f8fafc"
  );

  // Replace dark borders with clean light slate border
  style = style.replace(
    /border(?:-color)?\s*:\s*([^;]*?)(?:#334155|#1e293b|#0f172a)/gi,
    "border: $1#e2e8f0"
  );

  // Replace pale/white text colors intended for dark backgrounds with high-contrast light-theme text
  style = style
    .replace(
      /(^|;)\s*color\s*:\s*(?:#ffffff|#fff|#f8fafc|#f1f5f9|white)\b/gi,
      "$1 color: #0d1b2a"
    )
    .replace(
      /(^|;)\s*color\s*:\s*(?:#cbd5e1|#e2e8f0|#94a3b8|#d1d5db)\b/gi,
      "$1 color: #475569"
    )
    .replace(
      /(^|;)\s*color\s*:\s*(?:#dec18c|#c5a059|#d4af37|#eab308)\b/gi,
      "$1 color: #856422"
    );

  // Keep max-width fluid inside our ArticleLayout container
  style = style.replace(/max-width\s*:\s*\d+px\s*;?/gi, "");

  return style.trim();
}

/**
 * Sanitizes Blogger HTML content safely for React rendering:
 * - Removes dangerous tags (<script>, <style>, <iframe>, <object>, <embed>, <form>, <svg>, etc.)
 * - Removes inline event handlers (on*) and javascript:/vbscript:/data: URIs
 * - Downgrades embedded <h1> tags to <h2> so each /blog/:slug page keeps strictly ONE <h1>
 * - Rewrites any `insights.diasuae.ae` links to native `/blog/<slug>` or `/blog` paths
 * - Harmonizes legacy dark inline styles to our light executive DiasUAE theme
 */
export function sanitizeBloggerHtml(rawHtml: string): string {
  if (!rawHtml) return "";

  let html = String(rawHtml);

  // 1. Strip dangerous/non-content tags including embedded JSON-LD <script> blocks
  html = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, "")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object\b[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/<form\b[\s\S]*?<\/form>/gi, "")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, "")
    .replace(/<(?:meta|link|base)\b[^>]*>/gi, "");

  // 2. Strip inline event handler attributes (onclick, onerror, onload, etc.)
  html = html.replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  // 3. Neutralize javascript:, vbscript:, or unsafe data: URLs in href/src
  html = html.replace(
    /\b(href|src)\s*=\s*(["'])\s*(?:javascript|vbscript|data):[^"']*\2/gi,
    '$1="#"'
  );

  // 4. Downgrade any <h1> inside article content to <h2> to guarantee a single <h1>
  html = html.replace(/<(\/?)h1\b/gi, "<$1h2");

  // 5. Rewrite any outbound insights.diasuae.ae links to native diasuae.ae /blog paths
  html = html.replace(
    /href=(["'])https?:\/\/insights\.diasuae\.ae\/\d{4}\/\d{2}\/([^"'/?#]+)\.html(?:[?#][^"']*)?\1/gi,
    (_m, quote, rawSlug) => `href=${quote}/blog/${sanitizeSlug(rawSlug)}${quote}`
  );
  html = html.replace(
    /href=(["'])https?:\/\/insights\.diasuae\.ae\/?(?:[?#][^"']*)?\1/gi,
    (_m, quote) => `href=${quote}/blog${quote}`
  );
  // Rewrite https://diasuae.ae/... links to internal relative paths for seamless SPA routing
  html = html.replace(
    /href=(["'])https?:\/\/(?:www\.)?diasuae\.ae(\/[^"']*)?\1/gi,
    (_m, quote, p) => `href=${quote}${p || "/"}${quote}`
  );

  // 6. Harmonize inline dark-navy styles to light theme
  html = html.replace(
    /\bstyle=(["'])([^"']*)\1/gi,
    (_m, quote, cssText) => `style=${quote}${harmonizeInlineStyleToLightTheme(cssText)}${quote}`
  );

  return html.trim();
}

export function parseBloggerFeedEntries(data: unknown): BloggerPost[] {
  const feedObj = (data as { feed?: { entry?: unknown[] } })?.feed;
  const entries = Array.isArray(feedObj?.entry) ? feedObj.entry : [];
  const posts: BloggerPost[] = [];
  const seenSlugs = new Set<string>();

  for (const rawEntry of entries) {
    const entry = rawEntry as Record<string, any>;
    const title = decodeHtmlEntities(String(entry?.title?.$t || "").trim());
    if (!title) continue;

    const links = Array.isArray(entry?.link) ? entry.link : [];
    const altLink = links.find(
      (l: any) => l?.rel === "alternate" && typeof l?.href === "string"
    );
    const slug = extractBloggerSlug(altLink?.href, title);
    if (!slug || slug.startsWith("draft-") || seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const publishedIso = String(entry?.published?.$t || "");
    const updatedIso = String(entry?.updated?.$t || publishedIso);
    const rawHtml = String(entry?.content?.$t || entry?.summary?.$t || "");
    const contentHtml = sanitizeBloggerHtml(rawHtml);

    const categories: string[] = Array.isArray(entry?.category)
      ? entry.category
          .map((c: any) => String(c?.term || "").trim())
          .filter(Boolean)
      : [];

    const summary =
      buildCleanExcerpt(rawHtml, 165) ||
      `${title} — UAE Corporate Tax, 5% VAT & IFRS compliance briefing by FTA-Registered Tax Agents at DiasUAE.`;

    const featuredImage =
      validateSafeImageUrl(entry?.media$thumbnail?.url) ||
      extractFirstImageFromHtml(rawHtml);

    const authorName =
      String(entry?.author?.[0]?.name?.$t || "").trim() || DEFAULT_AUTHOR.name;

    posts.push({
      slug,
      id: slug,
      title,
      publishedIso,
      publishedDate: formatBloggerDate(publishedIso),
      updatedIso,
      updatedDate: formatBloggerDate(updatedIso),
      categories,
      primaryCategory: inferPrimaryCategory(categories, title),
      summary,
      featuredImage,
      contentHtml,
      contentFormat: "html",
      readTime: estimateReadTime(rawHtml),
      author: {
        ...DEFAULT_AUTHOR,
        name:
          authorName.toLowerCase().includes("dias") ||
          authorName.toLowerCase() === "unknown"
            ? DEFAULT_AUTHOR.name
            : authorName,
      },
      keywords:
        categories.length > 0
          ? categories
          : ["UAE Corporate Tax", "UAE VAT Compliance", "IFRS Bookkeeping", "DiasUAE"],
    });
  }

  return sortPostsNewestFirst(posts);
}

/**
 * Normalizes a post loaded from `public/blogger-posts.json` (compact deterministic
 * schema `{ id, slug, title, published, updated, labels, excerpt, image, contentHtml }`
 * OR full `BloggerPost`) into a complete `BloggerPost` object.
 */
export function normalizeSnapshotPost(raw: unknown): BloggerPost | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, any>;

  const title = decodeHtmlEntities(String(item.title || "").trim());
  const slug = normalizeSlugParam(String(item.slug || item.id || title || ""));
  if (!title || !slug || slug.startsWith("draft-")) return null;

  const publishedIso = String(item.publishedIso || item.published || "").trim();
  const updatedIso = String(item.updatedIso || item.updated || publishedIso).trim();
  const publishedDate =
    typeof item.publishedDate === "string" && item.publishedDate.trim()
      ? item.publishedDate.trim()
      : formatBloggerDate(publishedIso);
  const updatedDate =
    typeof item.updatedDate === "string" && item.updatedDate.trim()
      ? item.updatedDate.trim()
      : formatBloggerDate(updatedIso);

  const rawCategories = Array.isArray(item.categories)
    ? item.categories
    : Array.isArray(item.labels)
      ? item.labels
      : [];
  const categories: string[] = Array.from(
    new Set(rawCategories.map((c: unknown) => String(c || "").trim()).filter(Boolean))
  );

  const contentFormat: "html" | "markdown" =
    item.contentFormat === "markdown" ? "markdown" : "html";
  const rawContentHtml = String(item.contentHtml || "");
  const contentHtml =
    contentFormat === "markdown"
      ? rawContentHtml
      : sanitizeBloggerHtml(rawContentHtml);

  const summary =
    String(item.summary || item.excerpt || "").trim() ||
    buildCleanExcerpt(contentHtml, 165) ||
    `${title} — UAE Corporate Tax, 5% VAT & IFRS compliance briefing by FTA-Registered Tax Agents at DiasUAE.`;

  const featuredImage = validateSafeImageUrl(
    typeof item.featuredImage === "string"
      ? item.featuredImage
      : typeof item.image === "string"
        ? item.image
        : undefined
  );

  const primaryCategory =
    typeof item.primaryCategory === "string" && item.primaryCategory.trim()
      ? item.primaryCategory.trim()
      : inferPrimaryCategory(categories, title);

  const readTime =
    typeof item.readTime === "string" && item.readTime.trim()
      ? item.readTime.trim()
      : estimateReadTime(contentHtml);

  const author =
    item.author && typeof item.author === "object" && item.author.name
      ? {
          name: String(item.author.name),
          role: String(item.author.role || DEFAULT_AUTHOR.role),
          avatar: String(item.author.avatar || DEFAULT_AUTHOR.avatar),
        }
      : DEFAULT_AUTHOR;

  const keywords =
    Array.isArray(item.keywords) && item.keywords.length > 0
      ? item.keywords.map((k: unknown) => String(k || "").trim()).filter(Boolean)
      : categories.length > 0
        ? categories
        : ["UAE Corporate Tax", "UAE VAT Compliance", "IFRS Bookkeeping", "DiasUAE"];

  return {
    slug,
    id: slug,
    title,
    publishedIso,
    publishedDate,
    updatedIso,
    updatedDate,
    categories,
    primaryCategory,
    summary,
    featuredImage,
    contentHtml,
    contentFormat,
    readTime,
    author,
    keywords,
    isFallback: Boolean(item.isFallback),
  };
}

export function normalizeSnapshotPosts(rawList: unknown): BloggerPost[] {
  if (!Array.isArray(rawList)) return [];
  const normalized: BloggerPost[] = [];
  for (const item of rawList) {
    const post = normalizeSnapshotPost(item);
    if (post) normalized.push(post);
  }
  return sortPostsNewestFirst(normalized);
}

export function sortPostsNewestFirst(posts: BloggerPost[]): BloggerPost[] {
  return [...posts].sort((a, b) => {
    const timeA = Date.parse(a.publishedIso || a.updatedIso || "") || 0;
    const timeB = Date.parse(b.publishedIso || b.updatedIso || "") || 0;
    if (timeB !== timeA) return timeB - timeA;
    return a.slug.localeCompare(b.slug);
  });
}

/**
 * Merges synced Blogger posts with our single #1-ranking local fallback
 * (`top-tax-mistakes-uae-companies-make`) ONLY when that slug does not yet exist
 * in Blogger, removes any `draft-*` entries, deduplicates by slug, and sorts newest-first.
 */
export function mergeWithFallbackPosts(posts: BloggerPost[]): BloggerPost[] {
  const bySlug = new Map<string, BloggerPost>();

  for (const post of posts) {
    if (!post?.slug) continue;
    const cleanSlug = sanitizeSlug(post.slug);
    if (!cleanSlug || cleanSlug.startsWith("draft-")) continue;
    if (!bySlug.has(cleanSlug)) {
      bySlug.set(cleanSlug, { ...post, slug: cleanSlug, id: cleanSlug });
    }
  }

  if (!bySlug.has(TOP_TAX_MISTAKES_FALLBACK_POST.slug)) {
    bySlug.set(
      TOP_TAX_MISTAKES_FALLBACK_POST.slug,
      TOP_TAX_MISTAKES_FALLBACK_POST
    );
  }

  return sortPostsNewestFirst(Array.from(bySlug.values()));
}

export function bloggerPostToBlogPost(post: BloggerPost): BlogPost {
  return {
    id: post.slug,
    title: post.title,
    summary: post.summary,
    content: post.contentHtml,
    date: post.publishedDate,
    readTime: post.readTime,
    tag: post.primaryCategory,
    author: post.author,
    keywords: post.keywords,
    imageUrl: post.featuredImage,
    categories: post.categories,
    publishedIso: post.publishedIso,
    isLiveBlogger: !post.isFallback,
  };
}

// ============================================================================
// SSR + Browser Instant Snapshot + Live JSONP Sync Cache
// ============================================================================

declare global {
  interface Window {
    __DIAS_BLOGGER_POSTS__?: BloggerPost[];
  }
}

let ssrInjectedPosts: BloggerPost[] | null = null;
let memoryCachedPosts: BloggerPost[] | null = null;
let liveSyncCompleted = false;
let inflightSyncPromise: Promise<BloggerPost[]> | null = null;

/**
 * Called by `entry-server.tsx` during build-time SSG prerendering so `/blog`,
 * `/blog/:slug`, and homepage cards render real Blogger posts into static HTML.
 */
export function setSsrBloggerPosts(posts: BloggerPost[] | null): void {
  ssrInjectedPosts = posts ? mergeWithFallbackPosts(posts) : null;
}

/**
 * Returns immediately available posts synchronously (SSR data, inline pre-rendered
 * snapshot, or in-memory cache), falling back to our #1 ranking post until async
 * static snapshot / JSONP resolves.
 */
export function getInitialBloggerPosts(): BloggerPost[] {
  if (ssrInjectedPosts && ssrInjectedPosts.length > 0) {
    return ssrInjectedPosts;
  }
  if (memoryCachedPosts && memoryCachedPosts.length > 0) {
    return memoryCachedPosts;
  }
  if (
    typeof window !== "undefined" &&
    Array.isArray(window.__DIAS_BLOGGER_POSTS__) &&
    window.__DIAS_BLOGGER_POSTS__.length > 0
  ) {
    memoryCachedPosts = mergeWithFallbackPosts(window.__DIAS_BLOGGER_POSTS__);
    return memoryCachedPosts;
  }
  return [TOP_TAX_MISTAKES_FALLBACK_POST];
}

let jsonpCallbackSequence = 0;

/**
 * Cross-origin safe JSONP loader for Blogger's `alt=json-in-script` endpoint
 * (zero CORS errors in static hosting and browsers; never calls plain fetch() on insights.diasuae.ae).
 * Cleans up both the injected <script> tag and window callback, with an 8-second timeout fallback.
 */
export function fetchBloggerPostsJsonp(
  maxResults = 100,
  timeoutMs = 8000
): Promise<BloggerPost[]> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      reject(new Error("Browser DOM unavailable for JSONP"));
      return;
    }

    jsonpCallbackSequence += 1;
    const cacheTs = Date.now();
    const callbackName =
      jsonpCallbackSequence === 1
        ? `__diasBloggerCb_${cacheTs}`
        : `__diasBloggerCb_${cacheTs}_${jsonpCallbackSequence}`;
    const script = document.createElement("script");
    let settled = false;

    const cleanup = () => {
      window.clearTimeout(timerId);
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
      reject(new Error("Blogger JSONP request timed out after 8s"));
    }, timeoutMs);

    (window as unknown as Record<string, (payload: unknown) => void>)[
      callbackName
    ] = (payload: unknown) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(parseBloggerFeedEntries(payload));
    };

    script.src = `${BLOGGER_FEED_URL}?alt=json-in-script&max-results=${maxResults}&callback=${encodeURIComponent(
      callbackName
    )}&_t=${cacheTs}`;
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
 * Loads the build-time static fallback snapshot (`/blogger-posts.json`) so `/blog`
 * and `/blog/:slug` render instantaneously before JSONP completes or when JSONP times out.
 */
export async function loadStaticBloggerSnapshot(): Promise<BloggerPost[]> {
  if (typeof window === "undefined") {
    return getInitialBloggerPosts();
  }

  try {
    const res = await fetch("/blogger-posts.json", { cache: "no-cache" });
    if (!res.ok) return [];
    const data = await res.json();
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.posts)
        ? data.posts
        : [];
    const normalized = normalizeSnapshotPosts(rawList);
    if (normalized.length === 0) return [];
    const merged = mergeWithFallbackPosts(normalized);
    if (!liveSyncCompleted) {
      memoryCachedPosts = merged;
    }
    return merged;
  } catch {
    return [];
  }
}

/**
 * Unified client sync:
 * 1. Loads same-origin static snapshot (`/blogger-posts.json`) in parallel with live JSONP.
 * 2. Performs live browser JSONP sync against
 *    `https://insights.diasuae.ae/feeds/posts/default?alt=json-in-script&max-results=100`
 *    with an 8-second timeout fallback to `/blogger-posts.json`.
 * 3. Resolves only after BOTH static snapshot and live JSONP have settled so `/blog/:slug`
 *    never prematurely shows "Article Not Found" while either source is still in flight.
 */
export async function syncUnifiedBloggerPosts(
  options?: {
    maxResults?: number;
    forceRefresh?: boolean;
    onSnapshot?: (posts: BloggerPost[]) => void;
  }
): Promise<BloggerPost[]> {
  const maxResults = options?.maxResults ?? 100;

  if (liveSyncCompleted && memoryCachedPosts && !options?.forceRefresh) {
    return memoryCachedPosts;
  }

  if (inflightSyncPromise && !options?.forceRefresh) {
    return inflightSyncPromise;
  }

  const run = async (): Promise<BloggerPost[]> => {
    const snapshotPromise = loadStaticBloggerSnapshot().then((snapshot) => {
      if (snapshot.length > 0 && !liveSyncCompleted) {
        memoryCachedPosts = snapshot;
        options?.onSnapshot?.(snapshot);
      }
      return snapshot;
    });

    const jsonpPromise = fetchBloggerPostsJsonp(maxResults, 8000).catch(
      () => [] as BloggerPost[]
    );

    const [livePosts, snapshot] = await Promise.all([
      jsonpPromise,
      snapshotPromise,
    ]);

    if (livePosts.length > 0) {
      // Live Blogger posts take priority; merge any snapshot/fallback posts so nothing disappears
      const merged = mergeWithFallbackPosts([...livePosts, ...snapshot]);
      memoryCachedPosts = merged;
      liveSyncCompleted = true;
      return merged;
    }

    if (snapshot.length > 0) {
      memoryCachedPosts = snapshot;
      return snapshot;
    }

    const fallback = mergeWithFallbackPosts([]);
    memoryCachedPosts = fallback;
    return fallback;
  };

  inflightSyncPromise = run().finally(() => {
    inflightSyncPromise = null;
  });

  return inflightSyncPromise;
}

/**
 * Matches a URL `:slug` parameter against loaded Blogger posts:
 * 1. Normalizes the incoming slug (URI decode, strip trailing `/`, strip `.html`, strip `/YYYY/MM/`, lowercase).
 * 2. Tries exact slug match first.
 * 3. Falls back to prefix / partial slug match (handles Blogger auto-truncated permalinks).
 */
export function findBloggerPostBySlug(
  slug: string,
  posts: BloggerPost[]
): BloggerPost | null {
  const clean = normalizeSlugParam(slug);
  if (!clean || clean.startsWith("draft-")) return null;

  // 1. Exact match
  const exact = posts.find((p) => normalizeSlugParam(p.slug) === clean);
  if (exact) return exact;

  // 2. Prefix match (either direction — handles Blogger permalink truncation)
  if (clean.length >= 6) {
    const prefixMatch = posts.find((p) => {
      const candidate = normalizeSlugParam(p.slug);
      return (
        candidate.length >= 6 &&
        (candidate.startsWith(clean) || clean.startsWith(candidate))
      );
    });
    if (prefixMatch) return prefixMatch;
  }

  // 3. Partial containment match for longer slugs
  if (clean.length >= 10) {
    const partialMatch = posts.find((p) => {
      const candidate = normalizeSlugParam(p.slug);
      return (
        candidate.length >= 10 &&
        (candidate.includes(clean) || clean.includes(candidate))
      );
    });
    if (partialMatch) return partialMatch;
  }

  return null;
}
