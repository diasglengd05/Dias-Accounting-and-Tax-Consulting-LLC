import fs from "fs";
import path from "path";
import { servicesData, blogsData } from "../src/data/staticData.ts";

/**
 * Clean Sitemap Generator for Dias Accounting & Tax Consulting LLC (https://diasuae.ae)
 * - Outputs ONLY canonical, indexable HTTP 200 absolute HTTPS URLs (no hash fragments, no aliases/redirects)
 * - Omits deprecated <priority> and <changefreq> tags
 * - Emits genuine ISO YYYY-MM-DD <lastmod> dates parsed from actual published post dates only
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
  "/services",
  "/tax-planning-difc",
  "/dividends-audit",
  "/company-setup",
  "/pricing",
  "/uae-tax-planner",
  "/uae-vat-calculator",
  "/small-business-tax-relief",
  "/fta-deadlines",
  "/blog",
  "/about",
  "/why-choose-us",
  "/testimonials",
  "/faqs",
  "/partners",
  "/contact",
  "/privacy-policy",
  "/terms",
];

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

  // 3. Deduplicated Published Insights Articles (/blog/:id) with genuine ISO publication dates
  const normTitle = (t: string) =>
    (t || "")
      .toLowerCase()
      .replace(/&amp;/g, "and")
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const seenBlogIds = new Set<string>();
  const seenBlogTitles = new Set<string>();
  let seenAuditThresholds = false;
  let seenEnforcement = false;
  const combinedBlogs: Array<{
    id: string;
    title: string;
    date?: string;
    publishedIso?: string;
  }> = [];

  const pushUniqueBlog = (post: any) => {
    if (!post || !post.id || !post.title) return;
    if (String(post.id).startsWith("draft-")) return;
    const norm = normTitle(post.title);
    const isAuditThresholds =
      norm.includes("uae corporate tax return preparation") && norm.includes("audit threshold");
    const isEnforcement = norm.includes("uae corporate tax enforcement");
    if (seenBlogIds.has(post.id) || seenBlogTitles.has(norm)) return;
    if (isAuditThresholds && seenAuditThresholds) return;
    if (isEnforcement && seenEnforcement) return;
    seenBlogIds.add(post.id);
    seenBlogTitles.add(norm);
    if (isAuditThresholds) seenAuditThresholds = true;
    if (isEnforcement) seenEnforcement = true;
    combinedBlogs.push(post);
  };

  blogsData.forEach(pushUniqueBlog);

  try {
    const rootFallbackPath = path.join(process.cwd(), "db_fallback.json");
    const serverFallbackPath = path.join(process.cwd(), "server", "db_fallback.json");
    const targetPath = fs.existsSync(rootFallbackPath) ? rootFallbackPath : serverFallbackPath;
    if (fs.existsSync(targetPath)) {
      const fallbackRaw = fs.readFileSync(targetPath, "utf-8");
      const fallbackData = JSON.parse(fallbackRaw);
      const rawList = Array.isArray(fallbackData.blogs)
        ? fallbackData.blogs
        : fallbackData.blog_posts && typeof fallbackData.blog_posts === "object"
          ? Object.values(fallbackData.blog_posts)
          : [];
      rawList.forEach(pushUniqueBlog);
    }
  } catch {
    // Graceful fallback when local db_fallback.json is absent
  }

  for (const blog of combinedBlogs) {
    const genuineDate = parseGenuineIsoDate(blog.publishedIso || blog.date);
    pushUrl(`/blog/${blog.id}`, genuineDate);
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
