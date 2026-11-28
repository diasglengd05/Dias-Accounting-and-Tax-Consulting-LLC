#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Standalone Blogger Feed Sync Script (Node 20+ native fetch, zero external dependencies)
 *
 * Fetches the latest posts from `https://insights.diasuae.ae/feeds/posts/default?alt=json&max-results=100`,
 * sanitizes HTML & harmonizes legacy dark inline styles to the light DiasUAE theme, extracts clean
 * normalized slugs, sorts newest-first deterministically, and writes `public/blogger-posts.json`.
 *
 * Deterministic output: no random timestamps or volatile fields so `git diff --quiet public/blogger-posts.json`
 * reports zero changes when no Blogger posts have been added or updated.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_SNAPSHOT_PATH = path.join(ROOT_DIR, "public", "blogger-posts.json");

export const BLOGGER_JSON_FEED_URL =
  "https://insights.diasuae.ae/feeds/posts/default?alt=json&max-results=100";

function decodeHtmlEntities(str) {
  return String(str || "")
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

export function normalizeSlug(raw) {
  let value = String(raw || "").trim();
  if (!value) return "";

  try {
    value = decodeURIComponent(value);
  } catch {
    // Keep original if malformed URI encoding
  }

  value = value
    .replace(/^https?:\/\/[^/]+/i, "")
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "")
    .replace(/^blogs?\//i, "")
    .replace(/^\d{4}\/\d{2}\//, "")
    .replace(/\/+$/g, "")
    .replace(/\.html?$/i, "");

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

export function extractBloggerSlug(altUrl, fallbackTitle) {
  if (altUrl && typeof altUrl === "string" && altUrl.trim()) {
    try {
      const parsed = new URL(altUrl.trim());
      const cleanPath = parsed.pathname.replace(/^\/+|\/+$/g, "");
      if (/\.html?$/i.test(cleanPath) || /^\d{4}\/\d{2}\//.test(cleanPath)) {
        const stripped = cleanPath
          .replace(/^\d{4}\/\d{2}\//, "")
          .replace(/\.html?$/i, "")
          .replace(/\/+$/g, "");
        const fromUrl = normalizeSlug(stripped);
        if (fromUrl) return fromUrl;
      }
    } catch {
      const noQuery = altUrl.split("?")[0].split("#")[0].replace(/\/+$/g, "");
      if (/\.html?$/i.test(noQuery) || /\/\d{4}\/\d{2}\//.test(noQuery)) {
        const fromFallback = normalizeSlug(noQuery);
        if (fromFallback) return fromFallback;
      }
    }
  }
  return normalizeSlug(fallbackTitle || "uae-tax-briefing");
}

function buildCleanExcerpt(rawHtml, maxLength = 165) {
  if (!rawHtml) return "";

  const plainText = decodeHtmlEntities(
    String(rawHtml)
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

function validateSafeImageUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (!/^https:\/\//i.test(trimmed)) return null;
  return trimmed
    .replace(/\/s\d+-c\//i, "/s1200/")
    .replace(/\/w\d+-h\d+[^/]*\//i, "/s1200/")
    .replace(/=s\d+-c$/i, "=s1200");
}

function extractFirstImageFromHtml(rawHtml) {
  const match = String(rawHtml || "").match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);
  if (!match?.[1]) return null;
  return validateSafeImageUrl(match[1]);
}

function harmonizeInlineStyleToLightTheme(rawStyle) {
  let style = String(rawStyle || "");

  const isGoldButton =
    /background(?:-color)?\s*:\s*(?:linear-gradient\([^)]*#c5a059[^)]*\)|#c5a059|#dec18c)/i.test(
      style
    ) && /padding\s*:/i.test(style);

  const isGhostGoldButton =
    /background(?:-color)?\s*:\s*transparent/i.test(style) &&
    /border[^;]*#c5a059/i.test(style);

  if (isGoldButton) {
    return style
      .replace(/background(?:-color)?\s*:\s*[^;]+/gi, "background: #1b4332")
      .replace(/(?:^|;)\s*color\s*:\s*[^;]+/gi, (m) =>
        m.startsWith(";") ? "; color: #ffffff" : "color: #ffffff"
      )
      .replace(/border(?:-color)?\s*:\s*[^;]+/gi, "border: 1px solid #1b4332")
      .trim();
  }

  if (isGhostGoldButton) {
    return style
      .replace(/background(?:-color)?\s*:\s*transparent/gi, "background: #ffffff")
      .replace(/(?:^|;)\s*color\s*:\s*[^;]+/gi, (m) =>
        m.startsWith(";") ? "; color: #0d1b2a" : "color: #0d1b2a"
      )
      .replace(/border\s*:\s*[^;]+/gi, "border: 1px solid #cbd5e1")
      .trim();
  }

  style = style
    .replace(
      /background(?:-color)?\s*:\s*(?:linear-gradient\([^;]*?(?:#070d19|#0d1b2a|#0f172a|#0a1526|#111827|#1e293b)[^;]*?\)|#070d19|#0d1b2a|#0f172a|#0a1526|#111827|#1e293b|#0b132b)/gi,
      "background: #f8fafc"
    )
    .replace(
      /border(?:-color)?\s*:\s*([^;]*?)(?:#334155|#1e293b|#0f172a)/gi,
      "border: $1#e2e8f0"
    )
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
    )
    .replace(/max-width\s*:\s*\d+px\s*;?/gi, "");

  return style.trim();
}

export function sanitizeBloggerHtml(rawHtml) {
  if (!rawHtml) return "";

  let html = String(rawHtml);

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
    .replace(/<(?:meta|link|base)\b[^>]*>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(
      /\b(href|src)\s*=\s*(["'])\s*(?:javascript|vbscript|data):[^"']*\2/gi,
      '$1="#"'
    )
    .replace(/<(\/?)h1\b/gi, "<$1h2")
    .replace(
      /href=(["'])https?:\/\/insights\.diasuae\.ae\/\d{4}\/\d{2}\/([^"'/?#]+)\.html(?:[?#][^"']*)?\1/gi,
      (_m, quote, rawSlug) => `href=${quote}/blog/${normalizeSlug(rawSlug)}${quote}`
    )
    .replace(
      /href=(["'])https?:\/\/insights\.diasuae\.ae\/?(?:[?#][^"']*)?\1/gi,
      (_m, quote) => `href=${quote}/blog${quote}`
    )
    .replace(
      /href=(["'])https?:\/\/(?:www\.)?diasuae\.ae(\/[^"']*)?\1/gi,
      (_m, quote, p) => `href=${quote}${p || "/"}${quote}`
    )
    .replace(
      /\bstyle=(["'])([^"']*)\1/gi,
      (_m, quote, cssText) => `style=${quote}${harmonizeInlineStyleToLightTheme(cssText)}${quote}`
    );

  return html.trim();
}

export function parseBloggerFeed(payload) {
  const entries = Array.isArray(payload?.feed?.entry) ? payload.feed.entry : [];
  const posts = [];
  const seenSlugs = new Set();

  for (const entry of entries) {
    const title = decodeHtmlEntities(String(entry?.title?.$t || "").trim());
    if (!title) continue;

    const links = Array.isArray(entry?.link) ? entry.link : [];
    const altLink = links.find(
      (l) => l?.rel === "alternate" && typeof l?.href === "string"
    );
    const slug = extractBloggerSlug(altLink?.href, title);
    if (!slug || slug.startsWith("draft-") || seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const published = String(entry?.published?.$t || "").trim();
    const updated = String(entry?.updated?.$t || published).trim();
    const rawHtml = String(entry?.content?.$t || entry?.summary?.$t || "");
    const contentHtml = sanitizeBloggerHtml(rawHtml);

    const labels = Array.isArray(entry?.category)
      ? Array.from(
          new Set(
            entry.category
              .map((c) => String(c?.term || "").trim())
              .filter(Boolean)
          )
        )
      : [];

    const excerpt =
      buildCleanExcerpt(rawHtml, 165) ||
      `${title} — UAE Corporate Tax, 5% VAT & IFRS compliance briefing by FTA-Registered Tax Agents at DiasUAE.`;

    const image =
      validateSafeImageUrl(entry?.media$thumbnail?.url) ||
      extractFirstImageFromHtml(rawHtml);

    const rawId = String(entry?.id?.$t || "").trim();
    const postIdMatch = rawId.match(/post-(\d+)$/);
    const id = postIdMatch?.[1] || slug;

    posts.push({
      id,
      slug,
      title,
      published,
      updated,
      labels,
      excerpt,
      image,
      contentHtml,
    });
  }

  // Deterministic newest-first sort with alphabetical slug tie-breaker
  posts.sort((a, b) => {
    const timeDiff = (Date.parse(b.published) || 0) - (Date.parse(a.published) || 0);
    if (timeDiff !== 0) return timeDiff;
    return a.slug.localeCompare(b.slug);
  });

  return posts;
}

export async function syncBloggerToPublicJson({
  outputPath = PUBLIC_SNAPSHOT_PATH,
  timeoutMs = 15000,
  allowOfflineFallback = false,
} = {}) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(BLOGGER_JSON_FEED_URL, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
        "User-Agent": "DiasUAE-Auto-Sync/2026 (+https://diasuae.ae)",
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} fetching Blogger feed`);
    }

    const payload = await res.json();
    const posts = parseBloggerFeed(payload);

    if (posts.length === 0) {
      throw new Error("Blogger feed returned zero valid posts");
    }

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const formatted = `${JSON.stringify(posts, null, 2)}\n`;
    fs.writeFileSync(outputPath, formatted, "utf-8");

    console.log(
      `\n[Sync Blogger] Synced ${posts.length} live Blogger posts to ${path.relative(ROOT_DIR, outputPath)}:`
    );
    posts.forEach((post, idx) => {
      console.log(`  [${String(idx + 1).padStart(2, "0")}] /blog/${post.slug}`);
    });
    console.log("");

    return posts;
  } catch (err) {
    if (allowOfflineFallback && fs.existsSync(outputPath)) {
      console.warn(
        `[Sync Blogger] Live fetch unavailable (${err instanceof Error ? err.message : String(err)}). Using existing ${path.relative(ROOT_DIR, outputPath)}.`
      );
      try {
        const cached = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
        if (Array.isArray(cached)) return cached;
      } catch {
        // Ignore malformed cache
      }
    }
    throw err;
  }
}

const isDirectCli =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(__filename);

if (isDirectCli) {
  syncBloggerToPublicJson().catch((err) => {
    console.error("[Sync Blogger] Fatal error:", err);
    process.exit(1);
  });
}
