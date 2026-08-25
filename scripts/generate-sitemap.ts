import fs from "fs";
import path from "path";
import { servicesData, blogsData } from "../src/data/staticData.ts";

/**
 * Automated Sitemap Generator for Dias Accounting & Tax Consulting LLC
 * Generates an SEO-compliant XML sitemap based on the latest service definitions,
 * knowledge base articles, and core landing endpoints.
 */

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: string;
  comment?: string;
}

export function generateSitemapXml(domain = "https://www.diasuae.ae"): string {
  const today = new Date().toISOString().split("T")[0];

  const urls: SitemapUrl[] = [
    // 1. Core Homepage & High-Priority Landing Views
    {
      loc: `${domain}/`,
      lastmod: today,
      changefreq: "weekly",
      priority: "1.00",
      comment: "Primary Homepage & Company Authority Hub",
    },
    {
      loc: `${domain}/#services`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.95",
      comment: "Core Accounting, Tax, and CFO Advisory Services",
    },
    {
      loc: `${domain}/#service-comparison`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.90",
      comment: "Standard Accounting vs. CFO Advisory Matrix",
    },
    {
      loc: `${domain}/#calculator`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.90",
      comment: "Interactive UAE 9% Corporate Tax Estimator",
    },
    {
      loc: `${domain}/#pricing`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.85",
      comment: "Transparent Monthly & Annual Accounting Tiers",
    },
    {
      loc: `${domain}/#reviews`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.85",
      comment: "Verified 5.0 Google Business Reviews & Client Testimonials",
    },
    {
      loc: `${domain}/#faqs`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.80",
      comment: "UAE Corporate Tax & VAT Regulatory FAQs",
    },
    {
      loc: `${domain}/#blogs`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.85",
      comment: "UAE Tax Knowledge Base & Regulatory News",
    },
    {
      loc: `${domain}/#contact`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.95",
      comment: "Consultation Scheduler & Lead Capture",
    },
  ];

  // 2. Individual Service Sections & Anchors
  servicesData.forEach((service) => {
    urls.push({
      loc: `${domain}/#${service.id}`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.90",
      comment: `Service: ${service.title}`,
    });
  });

  // 3. Knowledge Base / Blog Articles
  blogsData.forEach((blog) => {
    urls.push({
      loc: `${domain}/#blog-${blog.id}`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.80",
      comment: `Guide: ${blog.title}`,
    });
  });

  // Build formatted XML
  const xmlEntries = urls
    .map((item) => {
      const commentBlock = item.comment ? `\n  <!-- ${item.comment} -->` : "";
      return `${commentBlock}
  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlEntries}

</urlset>
`;
}

/**
 * Write sitemap to /public/sitemap.xml
 */
export function writeSitemapFile(): { success: boolean; path: string; totalUrls: number } {
  const xml = generateSitemapXml();
  const publicPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(publicPath, xml, "utf-8");

  // Also write to dist/sitemap.xml if dist folder exists
  const distDir = path.join(process.cwd(), "dist");
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf-8");
  }

  const urlMatches = xml.match(/<url>/g);
  const totalUrls = urlMatches ? urlMatches.length : 0;

  console.log(`[Sitemap] Successfully updated sitemap.xml with ${totalUrls} URLs.`);
  return { success: true, path: publicPath, totalUrls };
}

// Execute standalone if executed directly via tsx/node
if (process.argv[1] && process.argv[1].includes("generate-sitemap")) {
  writeSitemapFile();
}
