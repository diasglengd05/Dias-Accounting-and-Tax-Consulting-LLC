const { GoogleGenAI } = require("@google/genai");
const admin = require("firebase-admin");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (err) {
    console.warn("Firebase Admin initialize warning:", err.message);
  }
}

/**
 * Google Cloud Function HTTP Trigger: dailyBlogGenerator
 * Scheduled via Google Cloud Scheduler every 24 hours (cron: 0 6 * * *)
 * 
 * Flow:
 * 1. Executes Google Search Grounding to identify today's active UAE financial, corporate tax, and regulatory trends.
 * 2. Prompts Gemini 3.8 Flash to author an authoritative, SEO-optimized blog article adhering to Glen Dias's professional voice.
 * 3. Generates valid JSON-LD schema markup of type "BlogPosting".
 * 4. Stores the publication in Firestore collection `blog_posts`.
 */
exports.dailyBlogGenerator = async (req, res) => {
  // CORS Handling
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(204).send("");
  }

  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Missing GEMINI_API_KEY environment variable in Cloud Function configuration.",
    });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    console.log("[Cloud Function] Step 1: Performing Google Search Grounding for current UAE financial trends...");

    const searchPrompt = `
Search and identify breaking UAE financial, corporate tax, and economic regulatory trends from late 2025 through 2026.
Focus on:
1. Federal Tax Authority (FTA) Corporate Tax filing announcements, EmaraTax portal updates, and audit clarifications.
2. Cabinet Decisions on Qualifying Free Zone Persons (QFZP), Small Business Relief (SBR) revenue limits, or transfer pricing rules.
3. Central Bank of the UAE (CBUAE) monetary decisions, lending rates, and mandatory e-invoicing Phase 1 & 2 frameworks.
4. Strategic challenges facing UAE Mainland LLCs and Free Zone entities in Dubai, Abu Dhabi, and Sharjah.

Summarize the top 3-4 distinct actionable regulatory trends currently impacting UAE businesses and CFOs.
Cite statutory references and dates where available.
`.trim();

    const searchResponse = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: searchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const searchGroundingOutput = searchResponse.text || "Current UAE corporate tax compliance and statutory audit preparation under Federal Decree-Law No. 47 of 2022.";
    console.log("[Cloud Function] Step 1 complete. Search Grounding intelligence gathered.");

    console.log("[Cloud Function] Step 2: Authoring SEO blog post and schema markup adhering to Glen Dias's persona...");

    const synthesisPrompt = `
You are Glen Dias, Managing Director, Senior Accounting Advisor & FTA Registered Tax Agent at Dias Accounting & Tax Consulting LLC (Dubai and Sharjah, UAE).
You write authoritative, technically precise, and actionable regulatory insights for UAE business founders, CFOs, and finance directors.

GROUNDED TREND INTELLIGENCE RETRIEVED FROM GOOGLE SEARCH:
"""
${searchGroundingOutput}
"""

TASK:
Write a comprehensive, publication-ready, SEO-optimized blog article based on the most pressing UAE financial trend identified above.

MANDATORY TONE & STYLE GUIDELINES:
- Voice: Authoritative, pragmatic, and mathematically rigorous. Speak directly as Glen Dias (FTA Registered Tax Agent).
- NO generic AI marketing fluff (ban "supercharge", "unleash", "game-changer", "empower").
- Legal Rigor: Specifically cite UAE statutes where relevant (e.g., Federal Decree-Law No. 47 of 2022 on the Taxation of Corporations and Businesses, Cabinet Decision No. 55 of 2023 / Ministerial Decision No. 139 of 2023 on Qualifying Free Zone Persons, Federal Decree-Law No. 8 of 2017 on VAT, Small Business Relief AED 3,000,000 threshold).
- Article Structure:
  1. Executive Summary & Statutory Context
  2. Core Regulatory Provisions & Key Thresholds
  3. Strategic Impact: Mainland LLCs vs. Free Zone Persons (QFZP 0% qualifying income nuances)
  4. 5-Point Practical Compliance Action Plan for UAE Finance Teams
  5. Glen Dias & Dias Accounting Strategic Advisory Conclusion (with CTA to schedule an audit assessment)

MANDATORY SCHEMA MARKUP (JSON-LD):
Generate complete, valid JSON-LD schema markup of type "BlogPosting" conforming to Schema.org standards.
- headline: High-converting, SEO-optimized title (max 110 chars)
- description: 150-160 character meta description
- author: Person entity {"@type": "Person", "name": "Glen Dias", "jobTitle": "Managing Director & Certified Tax Advisor", "worksFor": {"@type": "Organization", "name": "Dias Accounting & Tax Consulting LLC"}}
- publisher: Organization entity {"@type": "Organization", "name": "Dias Accounting & Tax Consulting LLC", "url": "https://diasuae.ae", "logo": {"@type": "ImageObject", "url": "https://diasuae.ae/icon-192.png"}}
- datePublished: ISO 8601 string
- dateModified: ISO 8601 string
- keywords: 6-8 comma-separated high-intent SEO keywords

OUTPUT FORMAT:
Respond with a strict, valid JSON object only (no extra markdown explanation before or after, wrap in \`\`\`json ... \`\`\`):
{
  "id": "slug-hyphenated-lowercase-max-60-chars",
  "title": "Clear, Professional Article Title",
  "summary": "150-180 character meta summary describing the immediate regulatory impact.",
  "content": "Full Markdown content with headers (##, ###), bullet points, and tables. Length: 700-1100 words.",
  "tag": "Corporate Tax" | "VAT Compliance" | "Free Zone Strategy" | "Regulatory Audit",
  "readTime": "6 min read",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "sourceTrends": ["Trend 1 brief summary", "Trend 2 brief summary"],
  "schemaMarkup": "{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"BlogPosting\\",...}"
}
`.trim();

    const articleResponse = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: synthesisPrompt,
    });

    const responseText = articleResponse.text || "{}";
    const cleanJson = responseText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    
    let parsed;
    try {
      parsed = JSON.parse(cleanJson);
    } catch {
      const match = cleanJson.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error("Failed to parse Gemini output into JSON.");
    }

    const todayFormatted = new Date().toLocaleDateString("en-US", {
      timeZone: "Asia/Dubai",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const isoTimestamp = new Date().toISOString();
    const baseSlug = (parsed.id || "uae-financial-trend").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const finalSlug = `${baseSlug}-${Date.now().toString(36).substring(0, 4)}`;

    let finalSchema = parsed.schemaMarkup;
    if (typeof finalSchema === "object") {
      finalSchema = JSON.stringify(finalSchema, null, 2);
    }

    const blogPost = {
      id: finalSlug,
      title: parsed.title,
      summary: parsed.summary,
      content: parsed.content,
      date: todayFormatted,
      readTime: parsed.readTime || "6 min read",
      tag: parsed.tag || "Corporate Tax",
      author: {
        name: "Glen Dias",
        role: "Managing Director & FTA Registered Tax Agent",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      },
      keywords: parsed.keywords || ["UAE Corporate Tax", "FTA Compliance", "Glen Dias", "Dubai Tax Agent"],
      schemaMarkup: finalSchema,
      isAiGenerated: true,
      generatedAt: isoTimestamp,
      sourceTrends: parsed.sourceTrends || [searchGroundingOutput.substring(0, 150) + "..."],
    };

    // Store in Firestore if Firebase Admin is configured
    try {
      const db = admin.firestore();
      await db.collection("blog_posts").doc(blogPost.id).set(blogPost, { merge: true });
      console.log(`[Cloud Function] Successfully saved to Firestore /blog_posts/${blogPost.id}`);

      // Update cron settings
      await db.collection("settings").doc("daily_blog_cron").set({
        lastRun: isoTimestamp,
        lastStatus: "success",
        lastPostId: blogPost.id,
        lastPostTitle: blogPost.title,
        nextRunDue: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        triggerSource: "gcp_cloud_function",
        durationMs: Date.now() - startTime,
        trendsIdentified: blogPost.sourceTrends,
      }, { merge: true });
    } catch (dbErr) {
      console.warn("[Cloud Function] Firestore write skipped/failed:", dbErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `24-Hour AI Blog published: "${blogPost.title}"`,
      blogPost,
      durationMs: Date.now() - startTime,
      timestamp: isoTimestamp,
    });
  } catch (error) {
    console.error("[Cloud Function Error]:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal error during daily blog generation.",
    });
  }
};
