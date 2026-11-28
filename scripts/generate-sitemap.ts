import fs from "fs";
import path from "path";
import { servicesData } from "../src/data/staticData.ts";
import {
  mergeWithFallbackPosts,
  normalizeSnapshotPosts,
  type BloggerPost,
} from "../src/utils/bloggerFeed.ts";

/**
 * Clean Sitemap Generator for Dias Accounting & Tax Consulting LLC (https://diasuae.ae)
 * - Outputs ONLY canonical, indexable HTTP 200 absolute HTTPS URLs (no hash fragments, no aliases/redirects)
 * - Syncs /blog/<slug> URLs from public/blogger-posts.json + protected fallback (top-tax-mistakes-uae-companies-make)
 * - Omits deprecated <priority> and <changefreq> tags
 * - Emits genuine ISO YYYY-MM-DD <lastmod> dates parsed from actual published/updated dates only
 */

interface SitemapUrl {
  loc: string;
  lastmod?: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parseGenuineIsoDate(raw?: string): string | undefined {
  if (!raw || typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) return trimmed.slice(0, 10);
  const parsed = Date.parse(trimmed);
  if (Number.isNaN(parsed)) return undefined;
  const dt = new Date(parsed);
  if (dt.getUTCFullYear() < 2020 || dt.getUTCFullYear() > 2030) return undefined;
  return dt.toISOString().slice(0, 10);
}

const CANONICAL_STATIC_PATHS: string[] = [
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

function loadUnifiedBloggerSnapshot(): BloggerPost[] {
  const snapshotPath = path.join(process.cwd(), "public", "blogger-posts.json");
  if (fs.existsSync(snapshotPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(snapshotPath, "utf-8"));
      if (Array.isArray(raw)) {
        return mergeWithFallbackPosts(normalizeSnapshotPosts(raw));
      }
    } catch {
      // Fall through to built-in fallback
    }
  }
  return mergeWithFallbackPosts([]);
}

export function generateSitemapXml(domain = "https://diasuae.ae"): string {
  const cleanDomain = domain.replace(/\/+$/, "");
  const seenLocs = new Set<string>();
  const urls: SitemapUrl[] = [];

  const pushUrl = (routePath: string, lastmod?: string) => {
    const cleanPath =
      routePath === "/"
        ? "/"
        : `/${routePath.replace(/^\/+/, "").replace(/\/+$/, "")}`;
    const loc = `${cleanDomain}${cleanPath}`;
    if (seenLocs.has(loc)) return;
    seenLocs.add(loc);
    urls.push(lastmod ? { loc, lastmod } : { loc });
  };

  // 1. Canonical Core Pages, Tax Hubs & Tools
  for (const staticPath of CANONICAL_STATIC_PATHS) {
    pushUrl(staticPath);
  }

  // 2. Canonical Individual Service Pages (/services/:id)
  for (const service of servicesData) {
    if (service?.id) {
      pushUrl(`/services/${service.id}`);
    }
  }

  // 3. Unified Blogger + Protected Fallback Articles (/blog/<slug>)
  const unifiedPosts = loadUnifiedBloggerSnapshot();
  for (const post of unifiedPosts) {
    if (!post?.slug || post.slug.toLowerCase().startsWith("draft-")) continue;
    const genuineDate = parseGenuineIsoDate(
      post.updatedIso || post.publishedIso || post.publishedDate
    );
    pushUrl(`/blog/${post.slug}`, genuineDate);
  }

  const xmlEntries = urls
    .map((item) => {
      const lastmodLine = item.lastmod ? `\n    <lastmod>${item.lastmod}</lastmod>` : "";
      return `  <url>\n    <loc>${escapeXml(item.loc)}</loc>${lastmodLine}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlEntries}\n</urlset>\n`;
}

/**
 * Writes clean canonical sitemap to /public/sitemap.xml (and /dist/sitemap.xml if present).
 */
export function writeSitemapFile(): { success: boolean; path: string; totalUrls: number } {
  const xml = generateSitemapXml();
  const publicPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(publicPath, xml, "utf-8");

  const distDir = path.join(process.cwd(), "dist");
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf-8");
  }

  const urlMatches = xml.match(/<url>/g);
  const totalUrls = urlMatches ? urlMatches.length : 0;

  console.log(`[Sitemap] Successfully updated sitemap.xml with ${totalUrls} canonical URLs.`);
  return { success: true, path: publicPath, totalUrls };
}

if (process.argv[1] && process.argv[1].includes("generate-sitemap")) {
  writeSitemapFile();
}
