import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DIST_SSR_DIR = path.join(ROOT_DIR, "dist-ssr");

const SITE_DOMAIN = "https://diasuae.ae";
const BLOGGER_JSON_FEED_URL =
  "https://insights.diasuae.ae/feeds/posts/default?alt=json&max-results=100";

function escapeHtmlAttr(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlText(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function serializeJsonLd(data) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function parseGenuineIsoDate(raw) {
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

function replaceMetaByName(html, name, value) {
  const escaped = escapeHtmlAttr(value);
  const regex = new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]*"\\s*/?>`, "gi");
  if (regex.test(html)) {
    let replacedFirst = false;
    return html.replace(regex, () => {
      if (replacedFirst) return "";
      replacedFirst = true;
      return `<meta name="${name}" content="${escaped}" />`;
    });
  }
  return html.replace(
    "</head>",
    () => `    <meta name="${name}" content="${escaped}" />\n  </head>`
  );
}

function replaceMetaByProperty(html, property, value) {
  const escaped = escapeHtmlAttr(value);
  const regex = new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]*"\\s*/?>`, "gi");
  if (regex.test(html)) {
    let replacedFirst = false;
    return html.replace(regex, () => {
      if (replacedFirst) return "";
      replacedFirst = true;
      return `<meta property="${property}" content="${escaped}" />`;
    });
  }
  return html.replace(
    "</head>",
    () => `    <meta property="${property}" content="${escaped}" />\n  </head>`
  );
}

function stripTagsAndDecode(raw) {
  return String(raw || "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?(?:strong|em|b|i|u|span|a|code|small|sup|sub|mark)\b[^>]*>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractH1Matches(html) {
  const matches = [];
  const regex = /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.push(stripTagsAndDecode(match[1]));
  }
  return matches;
}

/**
 * Fetches live Blogger posts directly in Node during `npm run build`.
 * Falls back gracefully to the existing static snapshot `public/blogger-posts.json`
 * if offline, and always merges via `mergeWithFallbackPosts` so
 * `top-tax-mistakes-uae-companies-make` stays safe when absent from Blogger.
 */
async function fetchLiveBloggerPostsInNode(parseBloggerFeedEntries, mergeWithFallbackPosts) {
  const snapshotPath = path.join(PUBLIC_DIR, "blogger-posts.json");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(BLOGGER_JSON_FEED_URL, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
        "User-Agent": "DiasUAE-SSG-Prerender/2026 (+https://diasuae.ae)",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} fetching Blogger feed`);
    }

    const payload = await res.json();
    const entries = payload?.feed?.entry;
    if (!Array.isArray(entries) || entries.length === 0) {
      throw new Error("Blogger feed returned zero entries");
    }

    const parsed = parseBloggerFeedEntries(payload);
    const unified = mergeWithFallbackPosts(parsed);
    console.log(
      `\n[SSG Prerender] Live Blogger sync succeeded: fetched ${parsed.length} Blogger posts -> ${unified.length} unified blog articles:`
    );
    parsed.forEach((post, idx) => {
      console.log(`  [${String(idx + 1).padStart(2, "0")}] /blog/${post.slug}`);
    });
    return unified;
  } catch (err) {
    console.warn(
      `[SSG Prerender] Live Blogger fetch unavailable (${err instanceof Error ? err.message : String(err)}). Using local snapshot fallback.`
    );
    if (fs.existsSync(snapshotPath)) {
      try {
        const cached = JSON.parse(fs.readFileSync(snapshotPath, "utf-8"));
        if (Array.isArray(cached) && cached.length > 0) {
          return mergeWithFallbackPosts(cached);
        }
      } catch {
        // Ignore malformed snapshot and fall through to built-in fallback
      }
    }
    return mergeWithFallbackPosts([]);
  }
}

/**
 * Builds and writes `dist/sitemap.xml` and `public/sitemap.xml` with all
 * canonical static routes, service pages, and live synced `/blog/<slug>` URLs.
 */
function writeUnifiedSitemap(routes, bloggerPosts) {
  const postByRoute = new Map();
  for (const post of bloggerPosts) {
    if (!post?.slug) continue;
    postByRoute.set(
      `/blog/${post.slug}`,
      parseGenuineIsoDate(post.updatedIso || post.publishedIso || post.publishedDate)
    );
  }

  const seenLocs = new Set();
  const entries = [];

  for (const route of routes) {
    const cleanPath =
      route === "/" ? "/" : `/${String(route).replace(/^\/+/, "").replace(/\/+$/, "")}`;
    if (/^\/blog\/draft-/i.test(cleanPath)) continue;
    const loc = `${SITE_DOMAIN}${cleanPath}`;
    if (seenLocs.has(loc)) continue;
    seenLocs.add(loc);
    const lastmod = postByRoute.get(cleanPath);
    entries.push({ loc, lastmod });
  }

  const xmlItems = entries
    .map((item) => {
      const lastmodLine = item.lastmod ? `\n    <lastmod>${item.lastmod}</lastmod>` : "";
      return `  <url>\n    <loc>${escapeXml(item.loc)}</loc>${lastmodLine}\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlItems}\n</urlset>\n`;

  fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), xml, "utf-8");
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), xml, "utf-8");

  return entries.length;
}

function buildRouteDocument(template, appHtml, head, hydratedPosts) {
  let doc = template;

  // 1. Update <title> and primary <meta> tags
  doc = doc.replace(
    /<title>[\s\S]*?<\/title>/i,
    () => `<title>${escapeHtmlText(head.title)}</title>`
  );
  doc = replaceMetaByName(doc, "title", head.title);
  doc = replaceMetaByName(doc, "description", head.description);
  doc = replaceMetaByName(doc, "keywords", head.keywords);
  doc = replaceMetaByName(doc, "robots", head.robots);

  // 2. Update Canonical & hreflang alternates
  const escapedCanonical = escapeHtmlAttr(head.canonicalUrl);
  doc = doc.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    () => `<link rel="canonical" href="${escapedCanonical}" />`
  );
  doc = doc.replace(
    /<link\s+rel="alternate"\s+hreflang="en"\s+href="[^"]*"\s*\/?>/i,
    () => `<link rel="alternate" hreflang="en" href="${escapedCanonical}" />`
  );
  doc = doc.replace(
    /<link\s+rel="alternate"\s+hreflang="x-default"\s+href="[^"]*"\s*\/?>/i,
    () => `<link rel="alternate" hreflang="x-default" href="${escapedCanonical}" />`
  );

  // 3. Update Open Graph & Twitter tags
  doc = replaceMetaByProperty(doc, "og:type", head.ogType);
  doc = replaceMetaByProperty(doc, "og:url", head.canonicalUrl);
  doc = replaceMetaByProperty(doc, "og:title", head.title);
  doc = replaceMetaByProperty(doc, "og:description", head.description);
  doc = replaceMetaByProperty(doc, "og:image", head.ogImage);
  doc = replaceMetaByProperty(doc, "og:image:secure_url", head.ogImage);
  doc = replaceMetaByProperty(doc, "og:image:alt", head.ogImageAlt || head.title);

  doc = replaceMetaByName(doc, "twitter:url", head.canonicalUrl);
  doc = replaceMetaByName(doc, "twitter:title", head.title);
  doc = replaceMetaByName(doc, "twitter:description", head.description);
  doc = replaceMetaByName(doc, "twitter:image", head.ogImage);
  doc = replaceMetaByName(doc, "twitter:image:alt", head.ogImageAlt || head.title);

  if (head.ogType === "article") {
    const articleTags = [
      head.publishedTime
        ? `    <meta property="article:published_time" content="${escapeHtmlAttr(head.publishedTime)}" />`
        : "",
      head.modifiedTime
        ? `    <meta property="article:modified_time" content="${escapeHtmlAttr(head.modifiedTime)}" />`
        : "",
      head.authorName
        ? `    <meta property="article:author" content="${escapeHtmlAttr(head.authorName)}" />`
        : "",
      head.articleSection
        ? `    <meta property="article:section" content="${escapeHtmlAttr(head.articleSection)}" />`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
    if (articleTags) {
      doc = doc.replace("</head>", () => `${articleTags}\n  </head>`);
    }
  }

  // 4. Keep homepage FAQPage schema strictly on `/` and strip it on subpages
  if (!head.keepHomepageFaq) {
    doc = doc.replace(
      /\s*<!--\s*JSON-LD Structured Data:\s*Homepage FAQPage[\s\S]*?-->\s*<script\s+type="application\/ld\+json"\s+id="homepage-faq-jsonld">[\s\S]*?<\/script>/i,
      ""
    );
    doc = doc.replace(
      /\s*<script\s+type="application\/ld\+json"\s+id="homepage-faq-jsonld">[\s\S]*?<\/script>/i,
      ""
    );
  }

  // 5. Inject route-specific JSON-LD scripts into <head>
  if (Array.isArray(head.jsonLdScripts) && head.jsonLdScripts.length > 0) {
    const scriptBlock = head.jsonLdScripts
      .map(
        (item) =>
          `    <script type="application/ld+json" id="${escapeHtmlAttr(item.id)}">${serializeJsonLd(item.data)}</script>`
      )
      .join("\n");
    doc = doc.replace("</head>", () => `${scriptBlock}\n  </head>`);
  }

  // 6. Replace the dev preloader inside <div id="root">...</div> with SSR-rendered HTML
  const rootDivPattern = /<div\s+id="root">[\s\S]*<\/div>(?=\s*(?:<script\b|<\/body>))/i;
  if (!rootDivPattern.test(doc)) {
    throw new Error(
      `Could not locate <div id="root">...</div> anchor in dist/index.html for route ${head.routePath}`
    );
  }

  const hydrationSnippet =
    Array.isArray(hydratedPosts) && hydratedPosts.length > 0
      ? `\n    <script>window.__DIAS_BLOGGER_POSTS__=${serializeJsonLd(hydratedPosts)};</script>`
      : "";

  doc = doc.replace(
    rootDivPattern,
    () => `<div id="root" data-ssr="true">${appHtml}</div>${hydrationSnippet}`
  );

  return doc;
}

async function runPrerender() {
  const templatePath = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(templatePath)) {
    throw new Error("dist/index.html not found. Run `vite build` before prerendering.");
  }

  const ssrEntryCandidates = [
    path.join(DIST_SSR_DIR, "entry-server.js"),
    path.join(DIST_SSR_DIR, "entry-server.mjs"),
    path.join(DIST_SSR_DIR, "entry-server.cjs"),
  ];
  const ssrEntryPath = ssrEntryCandidates.find((candidate) => fs.existsSync(candidate));
  if (!ssrEntryPath) {
    throw new Error(
      `SSR bundle not found in ${DIST_SSR_DIR}. Run \`vite build --ssr src/entry-server.tsx --outDir dist-ssr\` first.`
    );
  }

  const template = fs.readFileSync(templatePath, "utf-8");
  const serverModule = await import(pathToFileURL(ssrEntryPath).href);
  const {
    render,
    getAllPrerenderRoutes,
    parseBloggerFeedEntries,
    mergeWithFallbackPosts,
  } = serverModule;

  if (
    typeof render !== "function" ||
    typeof getAllPrerenderRoutes !== "function" ||
    typeof parseBloggerFeedEntries !== "function" ||
    typeof mergeWithFallbackPosts !== "function"
  ) {
    throw new Error(
      "SSR entry bundle must export `render`, `getAllPrerenderRoutes`, `parseBloggerFeedEntries`, and `mergeWithFallbackPosts`."
    );
  }

  // 1. Sync live Blogger posts at build time and persist static JSON snapshot
  const bloggerPosts = await fetchLiveBloggerPostsInNode(
    parseBloggerFeedEntries,
    mergeWithFallbackPosts
  );

  const snapshotJson = JSON.stringify(bloggerPosts, null, 2);
  fs.writeFileSync(path.join(PUBLIC_DIR, "blogger-posts.json"), snapshotJson, "utf-8");
  fs.writeFileSync(path.join(DIST_DIR, "blogger-posts.json"), snapshotJson, "utf-8");

  const postBySlug = new Map(bloggerPosts.map((p) => [p.slug.toLowerCase(), p]));

  // 2. Pre-render all static routes, service routes, and live /blog/<slug> routes
  const routes = getAllPrerenderRoutes(bloggerPosts);
  const report = [];
  const blogReport = [];

  for (const route of routes) {
    const { html: appHtml, head } = render(route, { bloggerPosts });
    const h1Matches = extractH1Matches(appHtml);

    if (h1Matches.length !== 1) {
      throw new Error(
        `SSG H1 audit failed for route "${route}": expected exactly 1 <h1>, found ${h1Matches.length} (${JSON.stringify(h1Matches)})`
      );
    }

    // Hydrate the active post on /blog/:slug pages to prevent any client flash
    let hydratedPosts = undefined;
    if (route.startsWith("/blog/")) {
      const slug = route.replace(/^\/blog\//, "").trim().toLowerCase();
      const activePost = postBySlug.get(slug);
      if (activePost) {
        hydratedPosts = [activePost];
      }
    }

    const finalDocument = buildRouteDocument(template, appHtml, head, hydratedPosts);

    // Strict Bing & Google Webmaster Tools audit: exactly 1 <meta name="description"> within 120–155 chars
    const descMatches = [
      ...finalDocument.matchAll(/<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/gi),
    ];
    if (descMatches.length !== 1) {
      throw new Error(
        `SSG Meta Description audit failed for route "${route}": expected exactly 1 <meta name="description">, found ${descMatches.length}`
      );
    }
    const decodedDesc = stripTagsAndDecode(descMatches[0][1]);
    if (decodedDesc.length < 120 || decodedDesc.length > 155) {
      throw new Error(
        `SSG Meta Description length audit failed for route "${route}": length is ${decodedDesc.length} chars (must be 120–155): "${decodedDesc}"`
      );
    }

    // Strict JSON-LD syntax, array nesting, and FAQPage vs visible HTML parity audit across ALL routes
    const allJsonLdMatches = [
      ...finalDocument.matchAll(
        /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
      ),
    ];
    const faqNodes = [];
    for (let sIdx = 0; sIdx < allJsonLdMatches.length; sIdx++) {
      const rawJson = allJsonLdMatches[sIdx][1].trim();
      if (/,\s*[}\]]/.test(rawJson)) {
        throw new Error(
          `SSG JSON-LD audit failed on "${route}" (script #${sIdx}): trailing comma detected`
        );
      }
      let parsed;
      try {
        parsed = JSON.parse(rawJson);
      } catch (err) {
        throw new Error(
          `SSG JSON-LD audit failed on "${route}" (script #${sIdx}): invalid JSON (${err.message})`
        );
      }
      const visit = (node) => {
        if (!node || typeof node !== "object") return;
        if (Array.isArray(node)) {
          node.forEach(visit);
          return;
        }
        if (node["@type"] === "FAQPage") {
          faqNodes.push({ node, context: node["@context"] || parsed["@context"] });
        }
        if (Array.isArray(node["@graph"])) {
          node["@graph"].forEach(visit);
        }
      };
      visit(parsed);
    }

    if (faqNodes.length > 1) {
      throw new Error(
        `SSG FAQPage audit failed for route "${route}": expected at most 1 FAQPage schema per page, found ${faqNodes.length}`
      );
    }

    if (faqNodes.length === 1) {
      const { node: faqNode, context } = faqNodes[0];
      if (context !== "https://schema.org") {
        throw new Error(
          `SSG FAQPage audit failed for route "${route}": invalid @context "${context}"`
        );
      }
      const mainEntity = faqNode.mainEntity;
      if (!Array.isArray(mainEntity) || mainEntity.length === 0) {
        throw new Error(
          `SSG FAQPage audit failed for route "${route}": mainEntity must be a non-empty array`
        );
      }

      const visiblePlainText = stripTagsAndDecode(appHtml);
      const seenQuestions = new Set();
      for (let qIdx = 0; qIdx < mainEntity.length; qIdx++) {
        const qa = mainEntity[qIdx];
        if (!qa || typeof qa !== "object" || Array.isArray(qa) || qa["@type"] !== "Question") {
          throw new Error(
            `SSG FAQPage audit failed on "${route}" (item #${qIdx}): invalid Question object or array nesting`
          );
        }
        const ans = qa.acceptedAnswer;
        if (!ans || typeof ans !== "object" || Array.isArray(ans) || ans["@type"] !== "Answer") {
          throw new Error(
            `SSG FAQPage audit failed on "${route}" (item #${qIdx}): invalid acceptedAnswer object`
          );
        }
        const qText = stripTagsAndDecode(qa.name || "");
        const aText = stripTagsAndDecode(ans.text || "");
        if (!qText || !aText) {
          throw new Error(
            `SSG FAQPage audit failed on "${route}" (item #${qIdx}): empty question or answer text`
          );
        }
        const qKey = qText.toLowerCase();
        if (seenQuestions.has(qKey)) {
          throw new Error(
            `SSG FAQPage audit failed on "${route}": duplicate Question "${qText}"`
          );
        }
        seenQuestions.add(qKey);
        if (!visiblePlainText.includes(qText)) {
          throw new Error(
            `SSG FAQPage parity failed on "${route}": Question not found verbatim in visible HTML: "${qText}"`
          );
        }
        if (!visiblePlainText.includes(aText)) {
          throw new Error(
            `SSG FAQPage parity failed on "${route}": Answer not found verbatim in visible HTML: "${aText}"`
          );
        }
      }
    }

    // Strict path confinement: reject any slug attempting directory traversal outside dist/
    const relativeOutPath =
      route === "/"
        ? "index.html"
        : path.join(route.replace(/^\/+/, ""), "index.html");
    const resolvedOutPath = path.resolve(DIST_DIR, relativeOutPath);
    const rootIndexFile = path.join(DIST_DIR, "index.html");
    if (
      resolvedOutPath !== rootIndexFile &&
      !resolvedOutPath.startsWith(DIST_DIR + path.sep)
    ) {
      throw new Error(
        `SSG path safety violation for route "${route}": resolved path escapes dist/`
      );
    }

    fs.mkdirSync(path.dirname(resolvedOutPath), { recursive: true });
    fs.writeFileSync(resolvedOutPath, finalDocument, "utf-8");

    const entry = {
      route,
      file: `dist/${relativeOutPath.replace(/\\/g, "/")}`,
      title: head.title,
      h1: h1Matches[0],
      descLength: decodedDesc.length,
      jsonLdCount: (head.keepHomepageFaq ? 4 : 3) + (head.jsonLdScripts?.length || 0),
    };
    report.push(entry);
    if (route.startsWith("/blog/")) {
      blogReport.push(entry);
    }
  }

  // 3. Generate unified sitemap.xml in both dist/ and public/
  const totalSitemapUrls = writeUnifiedSitemap(routes, bloggerPosts);

  // Remove stale root-level .html stubs copied from public/ that collide with SSG directories under Firebase cleanUrls
  const collidingStubs = ["blog.html", "tax-planning-difc.html"];
  for (const stub of collidingStubs) {
    const stubPath = path.join(DIST_DIR, stub);
    if (fs.existsSync(stubPath)) {
      fs.rmSync(stubPath, { force: true });
    }
  }

  // Clean up temporary dist-ssr build artifacts
  fs.rmSync(DIST_SSR_DIR, { recursive: true, force: true });

  console.log(`\n[SSG Prerender] Successfully generated ${report.length} static HTML pages:\n`);
  for (const item of report) {
    console.log(
      `  ✔ ${item.file.padEnd(76)} | desc:${String(item.descLength).padStart(3)}c | <h1>: ${item.h1}`
    );
  }
  console.log(
    `\n[SSG Prerender] Pre-rendered ${blogReport.length} unified /blog/<slug> pages, wrote public/blogger-posts.json & dist/blogger-posts.json, and updated sitemap.xml (${totalSitemapUrls} canonical URLs).`
  );
  console.log(`[SSG Prerender] Cleaned temporary dist-ssr directory.\n`);
}

runPrerender().catch((err) => {
  console.error("\n[SSG Prerender] Fatal error:", err);
  process.exit(1);
});
