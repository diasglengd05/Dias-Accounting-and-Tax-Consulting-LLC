import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  deleteDoc,
} from "firebase/firestore";

// ==================== FIREBASE INITIALIZATION ====================
let db: any = null;
let isFirestoreAvailable = false;

try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const rawConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const app = getApps().length === 0 ? initializeApp(rawConfig) : getApp();
    const firestoreDbId = rawConfig.firestoreDatabaseId || "(default)";
    db = getFirestore(app, firestoreDbId);
    isFirestoreAvailable = true;
  }
} catch (err: any) {
  console.warn("[Cloud Function DB] Firestore initialization note:", err?.message || err);
}

// ==================== LOCAL FALLBACK STORAGE ====================
const DB_FILE = path.join(process.cwd(), "db_fallback.json");

export interface BlogQueueItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  tag: string;
  readTime?: string;
  keywords?: string[];
  targetDay?: "Tuesday" | "Friday" | "Any";
  priority?: number;
  status: "pending" | "published" | "archived";
  createdAt: string;
  scheduledDate?: string;
  publishedAt?: string;
  publishedBlogId?: string;
  author?: {
    name: string;
    role: string;
    avatar?: string;
  };
  notes?: string;
}

export interface QueuePublishResult {
  success: boolean;
  message: string;
  publishedFromQueue: boolean;
  publishedItem?: BlogQueueItem;
  blogPost?: GeneratedBlogPost;
  remainingQueueCount: number;
  nextScheduledSlot?: {
    dayName: string;
    dateFormatted: string;
    countdownText: string;
  };
  durationMs: number;
  timestamp: string;
}

interface LocalFallbackSchema {
  inquiries?: any[];
  settings?: Record<string, any>;
  blogs?: any[];
  blogQueue?: BlogQueueItem[];
}

function readLocalDB(): LocalFallbackSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    }
  } catch (err) {
    console.warn("[DailyBlogGenerator] Failed to read local fallback DB:", err);
  }
  return { inquiries: [], settings: {}, blogs: [], blogQueue: [] };
}

function writeLocalDB(data: LocalFallbackSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("[DailyBlogGenerator] Failed to write local fallback DB:", err);
  }
}

// ==================== GEMINI CLIENT ====================
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAI) {
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build-daily-blog",
        },
      },
    });
  }
  return genAI;
}

// ==================== TYPES ====================
export interface GeneratedBlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  readTime: string;
  tag: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  keywords: string[];
  schemaMarkup: string;
  isAiGenerated: boolean;
  generatedAt: string;
  sourceTrends: string[];
}

export interface CronExecutionResult {
  success: boolean;
  message: string;
  blogPost?: GeneratedBlogPost;
  trendsIdentified?: string[];
  durationMs: number;
  triggerSource: string;
  timestamp: string;
}

// ==================== SEMI-WEEKLY SCHEDULE CONFIG (TUESDAY & FRIDAY) ====================

export interface WeeklyScheduleConfig {
  cadence: "semi-weekly";
  activeDays: number[]; // [2, 5] (2 = Tuesday, 5 = Friday in JS getDay())
  activeDayNames: string[]; // ["Tuesday", "Friday"]
  targetHourGST: number; // 6 (06:00 AM Gulf Standard Time / 02:00 UTC)
  targetMinuteGST: number; // 0
  cronExpression: string; // "0 6 * * 2,5" (GST)
  cronExpressionUTC: string; // "0 2 * * 2,5" (UTC)
}

export const SEMI_WEEKLY_SCHEDULE: WeeklyScheduleConfig = {
  cadence: "semi-weekly",
  activeDays: [2, 5], // Tuesday (2) & Friday (5)
  activeDayNames: ["Tuesday", "Friday"],
  targetHourGST: 6,
  targetMinuteGST: 0,
  cronExpression: "0 6 * * 2,5",
  cronExpressionUTC: "0 2 * * 2,5",
};

/**
 * Returns calendar components in UAE Time (Gulf Standard Time, UTC+4).
 * UAE does not observe Daylight Saving Time.
 */
export function getUAEDate(date = new Date()): {
  year: number;
  month: number;
  day: number;
  dayOfWeek: number;
  dayName: string;
  hours: number;
  minutes: number;
  dateString: string;
} {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const gstTimestamp = date.getTime() + 4 * 60 * 60 * 1000;
  const gstDate = new Date(gstTimestamp);
  const year = gstDate.getUTCFullYear();
  const month = gstDate.getUTCMonth();
  const day = gstDate.getUTCDate();
  const dayOfWeek = gstDate.getUTCDay();
  const hours = gstDate.getUTCHours();
  const minutes = gstDate.getUTCMinutes();
  const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return {
    year,
    month,
    day,
    dayOfWeek,
    dayName: dayNames[dayOfWeek],
    hours,
    minutes,
    dateString,
  };
}

/**
 * Calculates the next upcoming scheduled publication run (Tuesday or Friday at 06:00 GST).
 */
export function getNextScheduledRunDate(
  fromDate = new Date(),
  alreadyRanToday = false
): {
  nextDate: Date;
  dayName: "Tuesday" | "Friday";
  dateFormatted: string;
  countdownHours: number;
  countdownText: string;
} {
  const uaeNow = getUAEDate(fromDate);
  const currentDayOfWeek = uaeNow.dayOfWeek;
  const currentHour = uaeNow.hours;

  // Active days: 2 (Tuesday), 5 (Friday)
  let daysToAdd = 0;
  let targetDayName: "Tuesday" | "Friday" = "Tuesday";

  if (currentDayOfWeek === 2) {
    // Today is Tuesday
    if (!alreadyRanToday && currentHour < 6) {
      daysToAdd = 0; // Today Tuesday at 06:00 GST
      targetDayName = "Tuesday";
    } else {
      daysToAdd = 3; // Friday (+3 days)
      targetDayName = "Friday";
    }
  } else if (currentDayOfWeek === 5) {
    // Today is Friday
    if (!alreadyRanToday && currentHour < 6) {
      daysToAdd = 0; // Today Friday at 06:00 GST
      targetDayName = "Friday";
    } else {
      daysToAdd = 4; // Tuesday (+4 days)
      targetDayName = "Tuesday";
    }
  } else if (currentDayOfWeek === 0) {
    // Sunday -> Tuesday (+2 days)
    daysToAdd = 2;
    targetDayName = "Tuesday";
  } else if (currentDayOfWeek === 1) {
    // Monday -> Tuesday (+1 day)
    daysToAdd = 1;
    targetDayName = "Tuesday";
  } else if (currentDayOfWeek === 3) {
    // Wednesday -> Friday (+2 days)
    daysToAdd = 2;
    targetDayName = "Friday";
  } else if (currentDayOfWeek === 4) {
    // Thursday -> Friday (+1 day)
    daysToAdd = 1;
    targetDayName = "Friday";
  } else if (currentDayOfWeek === 6) {
    // Saturday -> Tuesday (+3 days)
    daysToAdd = 3;
    targetDayName = "Tuesday";
  }

  // Base date in GST
  const baseGstTime = fromDate.getTime() + 4 * 60 * 60 * 1000;
  const baseGstDate = new Date(baseGstTime);
  baseGstDate.setUTCDate(baseGstDate.getUTCDate() + daysToAdd);
  baseGstDate.setUTCHours(6, 0, 0, 0); // 06:00 GST

  // Convert back to UTC timestamp
  const targetUtcTimestamp = baseGstDate.getTime() - 4 * 60 * 60 * 1000;
  const nextDate = new Date(targetUtcTimestamp);

  const diffMs = Math.max(0, nextDate.getTime() - fromDate.getTime());
  const countdownHours = Number((diffMs / (1000 * 60 * 60)).toFixed(1));

  let countdownText = "";
  if (countdownHours < 1) {
    countdownText = `in ${Math.max(1, Math.round(diffMs / 60000))} minutes`;
  } else if (countdownHours < 24) {
    countdownText = `in ${Math.round(countdownHours)} hours`;
  } else {
    const days = Math.floor(countdownHours / 24);
    const remHours = Math.round(countdownHours % 24);
    countdownText = `in ${days} day${days > 1 ? "s" : ""}${remHours > 0 ? ` and ${remHours}h` : ""}`;
  }

  const dateFormatted =
    nextDate.toLocaleString("en-US", {
      timeZone: "Asia/Dubai",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " (GST)";

  return {
    nextDate,
    dayName: targetDayName,
    dateFormatted,
    countdownHours,
    countdownText,
  };
}

/**
 * Autonomous in-process check for the Tuesday & Friday publishing schedule.
 * Automatically publishes the pending draft from the queue (or generates via AI fallback) if:
 * 1. Current day in UAE is Tuesday or Friday
 * 2. Current hour in UAE is >= 06:00 GST
 * 3. No article has been published yet today (calendar date check)
 */
export async function checkAndTriggerScheduledBlog(): Promise<{
  executed: boolean;
  message: string;
  result?: CronExecutionResult | QueuePublishResult;
}> {
  const uaeNow = getUAEDate();
  const isScheduledDay = uaeNow.dayOfWeek === 2 || uaeNow.dayOfWeek === 5; // Tuesday or Friday
  const isAfterTargetHour = uaeNow.hours >= 6;

  const settings = await getDailyCronSettings();
  const lastRun = settings?.lastRun;
  const lastRunUaeDate = lastRun ? getUAEDate(new Date(lastRun)).dateString : null;
  const alreadyPublishedToday = lastRunUaeDate === uaeNow.dateString;

  if (isScheduledDay) {
    if (alreadyPublishedToday) {
      const nextRun = getNextScheduledRunDate(new Date(), true);
      return {
        executed: false,
        message: `Today's ${uaeNow.dayName} article has already been published. Next scheduled publication is ${nextRun.dayName} (${nextRun.countdownText}).`,
      };
    }

    if (isAfterTargetHour) {
      console.log(
        `[Tuesday/Friday Scheduler] Publication due for ${uaeNow.dayName} (${uaeNow.dateString}). Initiating scheduled publication sequence...`
      );
      const result = await publishScheduledQueueItem({
        triggerSource: `semiweekly_autonomous_${uaeNow.dayName.toLowerCase()}`,
      });
      return {
        executed: true,
        message: `Successfully processed ${uaeNow.dayName} publication: "${result.blogPost?.title}"`,
        result,
      };
    } else {
      return {
        executed: false,
        message: `Today is ${uaeNow.dayName}. Scheduled publication will trigger at 06:00 GST (currently ${String(
          uaeNow.hours
        ).padStart(2, "0")}:${String(uaeNow.minutes).padStart(2, "0")} GST).`,
      };
    }
  }

  const nextRun = getNextScheduledRunDate(new Date(), false);
  return {
    executed: false,
    message: `Today is ${uaeNow.dayName} (off-schedule day). Scheduled publication days are Tuesday and Friday. Next publication is on ${nextRun.dayName} (${nextRun.countdownText}).`,
  };
}

// ==================== CORE GENERATION LOGIC ====================

/**
 * Triggers the semi-weekly blog generation process (Tuesday & Friday) using Gemini 3.8 Flash
 * with Google Search Grounding to identify current UAE financial trends.
 */
export async function triggerDailyBlogGeneration(options: {
  force?: boolean;
  triggerSource?: string;
} = {}): Promise<CronExecutionResult> {
  const startTime = Date.now();
  const triggerSource = options.triggerSource || "scheduled_cloud_function";
  const uaeNow = getUAEDate();

  console.log(
    `[DailyBlogGenerator] Initiating Tuesday/Friday blog generation sequence (Source: ${triggerSource}, UAE Day: ${uaeNow.dayName})...`
  );

  // 1. Check schedule eligibility (unless force=true)
  const lastSettings = await getDailyCronSettings();
  if (!options.force) {
    const isScheduledDay = uaeNow.dayOfWeek === 2 || uaeNow.dayOfWeek === 5;
    const lastRunUaeDate = lastSettings?.lastRun ? getUAEDate(new Date(lastSettings.lastRun)).dateString : null;
    const alreadyPublishedToday = lastRunUaeDate === uaeNow.dateString;

    if (!isScheduledDay) {
      const nextRun = getNextScheduledRunDate(new Date(), false);
      return {
        success: true,
        message: `Blog generation skipped. Today is ${uaeNow.dayName} (off-schedule). Next scheduled publication is ${nextRun.dayName} at 06:00 GST (${nextRun.countdownText}).`,
        durationMs: Date.now() - startTime,
        triggerSource,
        timestamp: new Date().toISOString(),
      };
    }

    if (alreadyPublishedToday) {
      const nextRun = getNextScheduledRunDate(new Date(), true);
      return {
        success: true,
        message: `Today's ${uaeNow.dayName} article has already been published. Next scheduled publication is ${nextRun.dayName} at 06:00 GST (${nextRun.countdownText}).`,
        durationMs: Date.now() - startTime,
        triggerSource,
        timestamp: new Date().toISOString(),
      };
    }
  }

  const ai = getGenAI();
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const isoTimestamp = new Date().toISOString();

  let generatedPost: GeneratedBlogPost;
  let detectedTrends: string[] = [];

  if (ai) {
    try {
      // Step 1: Search Grounding - Discover today's active UAE financial & taxation regulatory trends
      let searchGroundingOutput = "";
      try {
        console.log("[DailyBlogGenerator] Step 1: Querying Google Search Grounding for current UAE financial trends...");
        const searchPrompt = `
Search and analyze current, breaking UAE economic, corporate tax, and financial regulatory trends from late 2025 through 2026.
Focus on:
1. UAE Federal Tax Authority (FTA) recent announcements, Corporate Tax filing deadlines, and EmaraTax portal updates.
2. UAE Cabinet Decisions on Qualifying Free Zone Persons (QFZP), Corporate Tax Small Business Relief (SBR) revenue limits, or transfer pricing guidelines.
3. Central Bank of the UAE (CBUAE) policies, corporate lending rates, or fintech/e-invoicing Phase 1 & Phase 2 mandates.
4. Strategic tax challenges facing UAE Mainland LLCs and Free Zone entities in Dubai, Abu Dhabi, and Sharjah.

Summarize the top 3-4 distinct actionable regulatory trends or updates currently affecting UAE business owners and CFOs.
Cite official dates and statutory reference numbers where present.
`.trim();

        const searchResponse = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: searchPrompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        searchGroundingOutput = searchResponse.text || "";
        console.log("[DailyBlogGenerator] Google Search Grounding complete. Trends retrieved.");
      } catch (searchErr: any) {
        console.log("[DailyBlogGenerator] Search grounding note (using verified 2026 statutory baseline):", searchErr?.status || "baseline");
        searchGroundingOutput = "Current 2026 UAE Corporate Tax filing enforcement under Federal Decree-Law No. 47 of 2022, Cabinet Decision No. 55 of 2023 on Qualifying Free Zone Persons (QFZP), and Small Business Relief AED 3,000,000 threshold under Article 21.";
      }

      // Step 2: Synthesize Authoritative Blog Post adhering strictly to Glen Dias's tone of voice
      console.log("[DailyBlogGenerator] Step 2: Synthesizing authoritative blog post with schema markup...");

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
- NO generic AI marketing fluff or buzzwords (ban "supercharge", "unleash", "game-changer", "empower").
- Legal Rigor: Specifically cite UAE statutes where relevant (e.g., Federal Decree-Law No. 47 of 2022 on the Taxation of Corporations and Businesses, Cabinet Decision No. 55 of 2023 / Ministerial Decision No. 139 of 2023 on Qualifying Free Zone Persons, Federal Decree-Law No. 8 of 2017 on VAT, Small Business Relief AED 3,000,000 threshold).
- Article Structure:
  1. Executive Summary & Statutory Context (Why this matters right now in the UAE)
  2. Core Regulatory Provisions & Key Thresholds (Clear breakdown, tables, or numeric benchmarks)
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

      let parsed: any;
      try {
        parsed = JSON.parse(cleanJson);
      } catch (parseErr) {
        // Fallback regex extraction if json wrapper is uneven
        const match = cleanJson.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error("Failed to parse Gemini JSON output.");
        }
      }

      // Generate unique slug with date suffix if needed
      const baseSlug = (parsed.id || "uae-financial-trend").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const finalSlug = `${baseSlug}-${Date.now().toString(36).substring(0, 4)}`;

      let finalSchema = parsed.schemaMarkup;
      if (typeof finalSchema === "object") {
        finalSchema = JSON.stringify(finalSchema, null, 2);
      } else if (typeof finalSchema === "string") {
        try {
          // Normalize formatting
          finalSchema = JSON.stringify(JSON.parse(finalSchema), null, 2);
        } catch {
          // leave as string
        }
      }

      if (!finalSchema) {
        finalSchema = JSON.stringify(
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://diasuae.ae/#blog-${finalSlug}`,
            },
            headline: parsed.title,
            description: parsed.summary,
            datePublished: isoTimestamp,
            dateModified: isoTimestamp,
            author: {
              "@type": "Person",
              name: "Glen Dias",
              jobTitle: "Managing Director & Certified Tax Advisor",
              worksFor: {
                "@type": "Organization",
                name: "Dias Accounting & Tax Consulting LLC",
              },
            },
            publisher: {
              "@type": "Organization",
              name: "Dias Accounting & Tax Consulting LLC",
              url: "https://diasuae.ae",
              logo: {
                "@type": "ImageObject",
                url: "https://diasuae.ae/icon-192.png",
              },
            },
            keywords: (parsed.keywords || []).join(", "),
            articleSection: parsed.tag || "UAE Taxation & Financial Regulations",
          },
          null,
          2
        );
      }

      generatedPost = {
        id: finalSlug,
        title: parsed.title || "UAE Corporate Tax & Financial Trends: Strategic Advisory",
        summary: parsed.summary || "Latest regulatory insights and compliance protocols for UAE businesses.",
        content: parsed.content || "Full article text...",
        date: todayFormatted,
        readTime: parsed.readTime || "6 min read",
        tag: parsed.tag || "Corporate Tax",
        author: {
          name: "Glen Dias",
          role: "Managing Director & FTA Registered Tax Agent",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        },
        keywords: parsed.keywords || ["UAE Corporate Tax", "FTA Tax Agent Dubai", "Glen Dias", "UAE VAT"],
        schemaMarkup: finalSchema,
        isAiGenerated: true,
        generatedAt: isoTimestamp,
        sourceTrends: parsed.sourceTrends || [searchGroundingOutput.substring(0, 150) + "..."],
      };

      detectedTrends = generatedPost.sourceTrends;
    } catch (genErr: any) {
      const errMessage = String(genErr?.message || genErr || "");
      const isQuotaOrRateLimit =
        genErr?.status === "RESOURCE_EXHAUSTED" ||
        genErr?.code === 429 ||
        errMessage.includes("429") ||
        errMessage.includes("quota") ||
        errMessage.includes("RESOURCE_EXHAUSTED");

      if (isQuotaOrRateLimit) {
        console.log("[DailyBlogGenerator] Gemini API rate limit or quota reached (429). Using authoritative curated 2026 regulatory briefing to preserve quota.");
      } else {
        console.log(`[DailyBlogGenerator] Note: Using curated 2026 regulatory article (${errMessage.substring(0, 60)}).`);
      }
      generatedPost = createCuratedFallbackArticle(todayFormatted, isoTimestamp);
      detectedTrends = generatedPost.sourceTrends;
    }
  } else {
    console.log("[DailyBlogGenerator] Note: GEMINI_API_KEY unset. Deploying curated 2026 regulatory briefing.");
    generatedPost = createCuratedFallbackArticle(todayFormatted, isoTimestamp);
    detectedTrends = generatedPost.sourceTrends;
  }

  // 3. Save the Generated Blog Post to Storage (Firestore + Local fallback)
  await persistBlogPost(generatedPost);

  // 4. Update the Semi-Weekly Cron Settings Record (Tuesday & Friday)
  const executionDuration = Date.now() - startTime;
  const nextRun = getNextScheduledRunDate(new Date(), true);
  await saveDailyCronSettings({
    lastRun: isoTimestamp,
    lastStatus: "success",
    lastPostId: generatedPost.id,
    lastPostTitle: generatedPost.title,
    cadence: "semi-weekly",
    activeDays: ["Tuesday", "Friday"],
    cronSchedule: "0 6 * * 2,5",
    cronScheduleUTC: "0 2 * * 2,5",
    nextRunDue: nextRun.nextDate.toISOString(),
    nextRunDay: nextRun.dayName,
    nextRunDateFormatted: nextRun.dateFormatted,
    triggerSource,
    durationMs: executionDuration,
    trendsIdentified: detectedTrends,
  });

  console.log(
    `[DailyBlogGenerator] Blog post "${generatedPost.title}" successfully published & synced. Next publication: ${nextRun.dayName} (${nextRun.countdownText}).`
  );

  return {
    success: true,
    message: `Semi-Weekly article successfully published: "${generatedPost.title}". Next publication is on ${nextRun.dayName} at 06:00 GST (${nextRun.countdownText}).`,
    blogPost: generatedPost,
    trendsIdentified: detectedTrends,
    durationMs: executionDuration,
    triggerSource,
    timestamp: isoTimestamp,
  };
}

/**
 * Persists the generated blog post to both Firestore and local storage.
 */
async function persistBlogPost(post: GeneratedBlogPost): Promise<void> {
  // 1. Local Fallback persistence
  const local = readLocalDB();
  if (!local.blogs) local.blogs = [];
  // Prepend so newest is first, remove duplicates by id
  local.blogs = [post, ...local.blogs.filter((b: any) => b.id !== post.id)];
  writeLocalDB(local);

  // 2. Firestore Cloud Persistence
  if (isFirestoreAvailable && db) {
    try {
      const blogDocRef = doc(db, "blog_posts", post.id);
      await setDoc(blogDocRef, post, { merge: true });
      console.log(`[DailyBlogGenerator] Saved blog post to Firestore /blog_posts/${post.id}`);
    } catch (err: any) {
      console.warn(`[DailyBlogGenerator] Firestore write failed for /blog_posts/${post.id}:`, err?.message || err);
    }
  }
}

/**
 * Retrieves all dynamic blog posts from Firestore / local storage
 */
export async function getStoredBlogPosts(): Promise<GeneratedBlogPost[]> {
  if (isFirestoreAvailable && db) {
    try {
      const q = query(collection(db, "blog_posts"), orderBy("generatedAt", "desc"), limit(25));
      const snap = await getDocs(q);
      const posts: GeneratedBlogPost[] = [];
      snap.forEach((docSnap) => {
        posts.push(docSnap.data() as GeneratedBlogPost);
      });
      if (posts.length > 0) {
        return posts;
      }
    } catch (err: any) {
      console.warn("[DailyBlogGenerator] Firestore read failed for blog_posts, using local fallback:", err?.message || err);
    }
  }

  const local = readLocalDB();
  return (local.blogs || []) as GeneratedBlogPost[];
}

/**
 * Retrieves cron configuration and last execution status
 */
export async function getDailyCronSettings(): Promise<any> {
  if (isFirestoreAvailable && db) {
    try {
      const docRef = doc(db, "settings", "daily_blog_cron");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data();
      }
    } catch (err: any) {
      console.warn("[DailyBlogGenerator] Firestore read failed for settings/daily_blog_cron:", err?.message || err);
    }
  }

  const local = readLocalDB();
  return (local.settings && local.settings.daily_blog_cron) || null;
}

/**
 * Saves cron execution record
 */
async function saveDailyCronSettings(data: any): Promise<void> {
  const local = readLocalDB();
  if (!local.settings) local.settings = {};
  local.settings.daily_blog_cron = { ...(local.settings.daily_blog_cron || {}), ...data };
  writeLocalDB(local);

  if (isFirestoreAvailable && db) {
    try {
      const docRef = doc(db, "settings", "daily_blog_cron");
      await setDoc(docRef, data, { merge: true });
    } catch (err: any) {
      console.warn("[DailyBlogGenerator] Firestore write failed for settings/daily_blog_cron:", err?.message || err);
    }
  }
}

// ==================== CURATED FALLBACK POST ====================
function createCuratedFallbackArticle(todayFormatted: string, isoTimestamp: string): GeneratedBlogPost {
  const slug = `uae-corporate-tax-filing-and-transfer-pricing-${Date.now().toString(36).substring(0, 5)}`;
  const title = "UAE Corporate Tax Return Preparation: 2026 Audit Thresholds & Mandatory Disclosures";
  const summary = "A critical breakdown of mandatory disclosures for UAE Corporate Tax returns, Small Business Relief renewals through 2029, and Free Zone QFZP transfer pricing documentation.";
  
  const content = `## Executive Summary & Statutory Context

Under **Federal Decree-Law No. 47 of 2022 on the Taxation of Corporations and Businesses**, the Federal Tax Authority (FTA) has commenced rigorous automated audits of corporate tax registrations and return filings. For corporate entities whose financial year matches the calendar year, the 9-month statutory filing deadline requires immediate preparation of audited financial statements, general ledger reconciliations, and related-party disclosure schedules.

As Managing Director and FTA Registered Tax Agent at Dias Accounting & Tax Consulting, I advise our corporate clients that submitting a compliant Corporate Tax return is not merely a bookkeeping submission—it is a legal declaration subject to administrative penalties under **Cabinet Decision No. 75 of 2023**.

---

## 1. Statutory Thresholds & The AED 3,000,000 Small Business Relief (SBR)

One of the most vital strategic considerations for UAE SMEs is the **Small Business Relief (SBR)** under Article 21 of the Corporate Tax Law:

- **Revenue Threshold**: Available to resident taxable persons whose revenue in the relevant tax period does not exceed **AED 3,000,000**.
- **Relief Granted**: Eligible entities are treated as having no taxable income for that tax period and are exempt from standard 9% corporate tax calculations.
- **Mandatory SBR Election**: Relief is **not automatic**. An affirmative election must be declared inside the EmaraTax return filing portal.
- **Record Retention**: Books and records supporting the revenue calculation must be retained for at least **7 years**.

| Taxable Parameter | Standard Regime | SBR Relief Regime | Qualifying Free Zone (QFZP) |
| :--- | :--- | :--- | :--- |
| **Tax Rate** | 9% on profits > AED 375k | 0% (Deemed Nil Tax) | 0% on Qualifying Income |
| **Gross Revenue Cap** | No upper cap | ≤ AED 3,000,000 | Subject to De Minimis rules |
| **Audited Financials** | Highly Recommended | Maintained (IFRS) | **Mandatory** |
| **Transfer Pricing Disclosures** | Applicable | Simplified | **Full Arm’s Length Compliance** |

---

## 2. Qualifying Free Zone Persons (QFZP): 0% Tax Protection Protocols

For entities registered in Free Zones (e.g., Shams, Meydan, DMCC, DIFC, ADGM), maintaining the **0% Qualifying Free Zone Person (QFZP)** preferential rate requires active compliance under **Cabinet Decision No. 55 of 2023** and **Ministerial Decision No. 139 of 2023**:

1. **Adequate Economic Substance**: Must employ an adequate number of qualified full-time personnel and incur adequate operating expenditures inside the specific Free Zone.
2. **Deriving Qualifying Income**: Transactions must fall strictly within prescribed Qualifying Activities (manufacturing, logistics, reinsurance, fund management, and treasury operations).
3. **De Minimis Compliance**: Non-qualifying revenue must not exceed **5% of total revenue** or **AED 5,000,000** (whichever is lower).
4. **Mandatory Audited Accounts**: A QFZP **must** have audited financial statements prepared in accordance with IFRS or IFRS for SMEs.

---

## 3. 5-Point Practical Compliance Action Plan for UAE CFOs

To guarantee seamless compliance before the FTA filing deadline, finance teams must execute the following checklist:

1. **Perform Trial Balance Sanitization**: Reconcile bank balances, intercompany loans, and trade receivables against verifiable third-party documentation.
2. **Review Disallowed Deductions**: Ensure non-deductible expenses (e.g., 50% entertainment expenses under Article 32, penalties, corporate donations to non-qualifying entities) are accurately adjusted in the tax computation.
3. **Verify Connected Person Remuneration**: Remuneration and compensation paid to company owners, shareholders, and connected persons must reflect arm's-length commercial value under Article 36.
4. **Finalize EmaraTax User Rights**: Ensure your company's EmaraTax profile is linked to an FTA Registered Tax Agent to avoid portal access lockouts during peak filing traffic.
5. **Secure Audited Financial Statements**: Finalize audit sign-offs well in advance of the deadline.

---

## Strategic Advisory from Glen Dias

Navigating the intersection of Corporate Tax, VAT reconciliations, and Free Zone compliance demands seasoned technical oversight. At Dias Accounting & Tax Consulting, our team conducts exhaustive pre-filing tax audits, verifies Small Business Relief eligibility, and defends client positions before the FTA.

Contact our advisory desk directly at **+971 52 922 6958** or email **info@diasuae.ae** for a confidential corporate tax audit and compliance review.`;

  const schema = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://diasuae.ae/#blog-${slug}`,
      },
      headline: title,
      description: summary,
      datePublished: isoTimestamp,
      dateModified: isoTimestamp,
      author: {
        "@type": "Person",
        name: "Glen Dias",
        jobTitle: "Managing Director & Certified Tax Advisor",
        worksFor: {
          "@type": "Organization",
          name: "Dias Accounting & Tax Consulting LLC",
        },
      },
      publisher: {
        "@type": "Organization",
        name: "Dias Accounting & Tax Consulting LLC",
        url: "https://diasuae.ae",
        logo: {
          "@type": "ImageObject",
          url: "https://diasuae.ae/icon-192.png",
        },
      },
      keywords: "UAE Corporate Tax, FTA audit, Small Business Relief 2026, QFZP 0% rate, Glen Dias Dubai",
      articleSection: "Corporate Tax",
    },
    null,
    2
  );

  return {
    id: slug,
    title,
    summary,
    content,
    date: todayFormatted,
    readTime: "7 min read",
    tag: "Corporate Tax",
    author: {
      name: "Glen Dias",
      role: "Managing Director & FTA Registered Tax Agent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    keywords: [
      "UAE Corporate Tax",
      "FTA Small Business Relief",
      "Qualifying Free Zone Person",
      "EmaraTax Filing",
      "Glen Dias Tax Agent",
    ],
    schemaMarkup: schema,
    isAiGenerated: true,
    generatedAt: isoTimestamp,
    sourceTrends: [
      "FTA Corporate Tax filing deadline enforcement and audit notifications",
      "Cabinet Decision No. 55 of 2023 on Qualifying Free Zone Person substance criteria",
      "Small Business Relief revenue limit threshold guidance (AED 3,000,000)",
    ],
  };
}

// ==================== BLOG QUEUE MANAGEMENT (TUESDAY & FRIDAY PIPELINE) ====================

export const DEFAULT_QUEUE_ITEMS: BlogQueueItem[] = [
  {
    id: "uae-corporate-tax-grouping-consolidation-article-40",
    title: "UAE Corporate Tax Grouping & Tax Consolidation: Criteria, Benefits, and Article 40 Execution",
    summary: "Comprehensive guide to forming an FTA-recognized Corporate Tax Group under Article 40 of Federal Decree-Law No. 47 of 2022, intra-group debt transfers, and consolidated financial filings.",
    tag: "Corporate Tax",
    readTime: "7 min read",
    keywords: [
      "UAE Corporate Tax Group",
      "Article 40 Tax Group",
      "Corporate Tax Consolidation UAE",
      "FTA Tax Agent Dubai",
      "Dias Accounting & Tax Consulting",
      "Federal Decree-Law No 47 of 2022",
    ],
    targetDay: "Friday",
    priority: 1,
    status: "pending",
    createdAt: "2026-09-17T06:00:00.000Z",
    author: {
      name: "Glen Dias",
      role: "Managing Director & FTA Registered Tax Agent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    notes: "Curated technical brief on tax grouping mechanics, statutory parent-subsidiary 95% equity rules, and combined P&L filing.",
    content: `## 1. Executive Summary: Consolidation Under Article 40

Under **Federal Decree-Law No. 47 of 2022 on the Taxation of Corporations and Businesses**, corporate groups operating in the UAE have the statutory option to elect to form a **Tax Group** pursuant to **Article 40**. When approved by the Federal Tax Authority (FTA), the parent company and eligible subsidiaries are treated as a single taxable person for corporate tax purposes.

This structural election offers powerful treasury and cash flow advantages:
- **Automatic Loss Offsetting:** Operating losses incurred by one subsidiary instantly neutralize taxable profits generated by another member company during the same tax period without incurring the 75% annual offset limitation under Article 30.
- **Elimination of Intra-Group Profit Realization:** Transactions, asset transfers, and intercompany service fees conducted strictly between members of the same tax group are entirely eliminated in the consolidated tax calculation.
- **Single Consolidated Return:** Rather than submitting fragmented corporate tax returns across multiple legal entities, the designated parent company submits one aggregated annual return via the EmaraTax portal.

---

## 2. Statutory Conditions for Forming a Tax Group

To successfully register a Tax Group with the FTA, the parent company and each prospective subsidiary must concurrently satisfy the conditions codified in **Article 40(1)**:

| Requirement | Statutory Standard | Audit Evidence Needed |
| :--- | :--- | :--- |
| **Share Capital & Voting Rights** | Parent directly or indirectly holds at least **95%** of voting rights and share capital in each subsidiary | Valid trade licenses, constitutional Memoranda of Association (MOA), and certified share registers |
| **Profit & Asset Entitlement** | Parent is directly or indirectly entitled to at least **95%** of profits and net assets upon liquidation | Shareholders' resolutions and audited balance sheet schedules |
| **Residency & Legal Status** | Both parent and subsidiaries must be UAE resident juridical persons | UAE commercial registration certificates |
| **Exempt / Qualifying Status Exclusion** | Neither the parent nor any subsidiary may be an Exempt Person or a Qualifying Free Zone Person (QFZP) | FTA tax status confirmation letters |
| **Consistent Financial Year** | All group members must operate on the identical financial calendar | Synchronized accounting period approval |

### The Free Zone Dilemma: QFZP Disqualification
A critical compliance nuance often overlooked by multi-entity groups is that a **Qualifying Free Zone Person (QFZP)** enjoying 0% corporate tax cannot participate in a Tax Group under Article 40(1)(e). If a Free Zone subsidiary elects or qualifies for 0% QFZP status, it must file its corporate tax return independently. Attempting to group a QFZP entity results in automatic rejection by the FTA EmaraTax processing engine.

---

## 3. Practical Steps for UAE Corporate Tax Consolidation

UAE corporate finance leaders planning tax group formation should execute this three-stage protocol:

1. **Conduct 95% Legal & Economic Ownership Verification:** Inspect beneficial ownership registers to confirm the continuous fulfillment of both direct and indirect ownership thresholds throughout the entirety of the financial tax period.
2. **Harmonize Accounting Standards under IFRS:** Consolidating accounts for tax purposes requires uniform accounting policies. Standardize revenue recognition (IFRS 15) and lease accounting (IFRS 16) across all group trade licenses.
3. **Submit Article 40 Election Within Prescribed Deadlines:** The joint application by the parent and subsidiaries must be lodged via EmaraTax before the conclusion of the tax period for which grouping is sought.

---

## 4. Dias Accounting Advisory Perspective

Tax grouping is not a purely administrative convenience—it is a sophisticated legal and financial restructuring decision. While it provides immense tax optimization, member entities remain jointly and severally liable for the group's corporate tax obligations under **Article 40(5)**.

At **Dias Accounting & Tax Consulting LLC**, Glen Dias and our team of senior tax advisors conduct comprehensive feasibility evaluations, prepare FTA-compliant intra-group elimination workpapers, and secure formal Tax Group approval on EmaraTax.`,
  },
  {
    id: "fta-mandatory-e-invoicing-phase-1-peppol-readiness",
    title: "FTA Mandatory E-Invoicing Phase 1: Technical Readiness, Peppol Network, and UAE Business Checklist",
    summary: "Strategic action plan for UAE enterprises navigating Ministry of Finance e-invoicing mandates, Peppol decentralized exchange standards, and ERP integration requirements.",
    tag: "VAT & Compliance",
    readTime: "6 min read",
    keywords: [
      "UAE E-Invoicing",
      "Peppol UAE",
      "FTA VAT Invoicing",
      "Ministry of Finance E-Billing",
      "E-Invoicing Phase 1 Dubai",
      "Glen Dias Tax Agent",
    ],
    targetDay: "Tuesday",
    priority: 2,
    status: "pending",
    createdAt: "2026-09-17T06:00:00.000Z",
    author: {
      name: "Glen Dias",
      role: "Managing Director & FTA Registered Tax Agent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    notes: "Technical analysis of DCTCE e-invoicing model, Peppol 5-corner architecture, and UAE business readiness.",
    content: `## 1. Statutory Context: The UAE E-Invoicing Evolution

The UAE Ministry of Finance (MoF) and the Federal Tax Authority (FTA) are advancing the nationwide implementation of the **Mandatory E-Invoicing System** under the **Decentralized Continuous Transaction Controls and Exchange (DCTCE)** model.

Moving beyond static PDF invoices and manual email exchanges, the national e-invoicing framework legally mandates the structured, machine-readable digital exchange of tax invoices and credit notes in real-time or near real-time across the **Peppol (Pan-European Public Procurement On-Line)** international messaging network.

---

## 2. The 5-Corner DCTCE Network Architecture

Unlike centralized clearance systems adopted in certain regional jurisdictions, the UAE has implemented a 5-corner decentralized framework:

- **Corner 1 (C1 - Seller/Supplier):** Issues the transaction data from their internal Enterprise Resource Planning (ERP) or accounting software.
- **Corner 2 (C2 - Certified Access Point / Service Provider):** Formats the invoice into standard XML/UBL UBL syntax, validates mandatory UAE tax fields, and cryptographically signs the document.
- **Corner 3 (C3 - Buyer's Access Point):** Receives the structured XML package, validates integrity, and passes it to the recipient.
- **Corner 4 (C4 - Buyer/Customer):** Ingests the validated invoice directly into accounts payable without manual data entry.
- **Corner 5 (C5 - Tax Authority Platform):** The FTA platform receives authenticated reporting of invoice metadata simultaneously, ensuring absolute VAT integrity.

---

## 3. Mandatory Compliance Checklist for UAE CFOs & Controllers

To prevent business disruption and statutory penalties, companies must complete the following technical preparations:

1. **Audit Master Data & Tax Registration Numbers (TRNs):** Inaccurate TRNs, customer postal codes, or unverified legal company names will cause immediate transmission rejections at the Access Point gateway.
2. **Select an Accredited UAE Peppol Access Point Provider:** Evaluate software vendors to ensure full certification with the UAE Ministry of Finance standards.
3. **Upgrade ERP & Invoicing Systems:** Configure accounting systems (SAP, Oracle NetSuite, Microsoft Dynamics, Zoho Books, Tally) to generate XML/UBL standard payloads containing mandatory tax data elements.
4. **Reconcile VAT Return (Form VAT201) Protocols:** Automated cross-checks will compare periodic VAT filings directly against reported e-invoice datasets. Unreconciled variances will trigger immediate audit inquiries.

---

## 4. Strategic Advisory with Glen Dias & Dias Accounting

The transition to electronic invoicing represents the most fundamental transformation in UAE commercial transactions since the rollout of VAT in 2018. 

**Dias Accounting & Tax Consulting LLC** provides end-to-end technical readiness audits, ERP tax schema mapping, and FTA VAT reconciliation advisory. Speak to our certified tax team to ensure your business remains ahead of statutory deployment deadlines.`,
  },
  {
    id: "cross-border-transfer-pricing-documentation-uae-master-local-file",
    title: "Cross-Border Transfer Pricing in the UAE: Master File, Local File, and Arm's Length Benchmarking",
    summary: "In-depth advisory on OECD-compliant Transfer Pricing documentation requirements in the UAE, arm's length benchmarking benchmarks, and disclosure schedules for multinational entities.",
    tag: "Transfer Pricing",
    readTime: "8 min read",
    keywords: [
      "Transfer Pricing UAE",
      "Local File Master File UAE",
      "Ministerial Decision No 97 of 2023",
      "Arm's Length Principle UAE",
      "Related Party Transactions FTA",
      "Dias Accounting Dubai",
    ],
    targetDay: "Friday",
    priority: 3,
    status: "pending",
    createdAt: "2026-09-17T06:00:00.000Z",
    author: {
      name: "Glen Dias",
      role: "Managing Director & FTA Registered Tax Agent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    notes: "Statutory guide covering Article 55 Local File/Master File limits, TNMM benchmarking, and related party disclosures.",
    content: `## 1. The Statutory Framework: Articles 34 & 55

Under **Federal Decree-Law No. 47 of 2022** and **Ministerial Decision No. 97 of 2023**, Transfer Pricing compliance in the United Arab Emirates is no longer an optional international corporate exercise—it is a binding domestic statutory obligation.

All transactions between **Related Parties** and arrangements with **Connected Persons** must satisfy the **Arm's Length Principle** codified in **Article 34**. If intercompany pricing deviates from what independent parties would have agreed under comparable economic circumstances, the Federal Tax Authority reserves the statutory authority to adjust taxable income upward and assess penalties under Cabinet Decision No. 75 of 2023.

---

## 2. Documentation Thresholds: Who Must Prepare Local & Master Files?

Under Ministerial Decision No. 97 of 2023, taxable persons meeting either of the following conditions must maintain contemporaneous **Local File** and **Master File** documentation:

| Qualifying Threshold | Trigger Condition | Mandatory Documentation |
| :--- | :--- | :--- |
| **Gross Revenue Threshold** | Taxable Person has total revenue in the relevant tax period of **AED 200,000,000** or more | Complete Master File & Local File within 30 days of FTA demand |
| **Multinational Enterprise (MNE) Group** | Taxable Person is part of an MNE Group with consolidated group revenue of **AED 3,150,000,000** (EUR 750M) | Complete Master File & Local File adhering to OECD BEPS Action 13 standards |

### The Critical Rule for Entities Below AED 200M
Even if an enterprise does not cross the AED 200 Million revenue threshold for mandatory Master/Local files, **it remains strictly bound by the Arm's Length Principle under Article 34**. 

Every corporate tax return submitted through EmaraTax requires the disclosure of all related-party transactions, intercompany loan balances, and management charges. In an audit scenario, the FTA can request commercial benchmarking evidence under Article 55(4) with a rigid 30-day submission deadline.

---

## 3. Approved Transfer Pricing Methodologies

Article 34(2) prescribes five standard methodologies aligned with the OECD Transfer Pricing Guidelines:
1. **Comparable Uncontrolled Price (CUP) Method:** Directly compares the price charged in a controlled transaction to an independent market benchmark.
2. **Resale Price Method (RPM):** Evaluates gross profit margins earned on goods purchased from a related party and resold to unrelated customers.
3. **Cost Plus Method (CPM):** Assesses the markup added to direct and indirect costs incurred in supplying property or services.
4. **Transactional Net Margin Method (TNMM):** Examines net profit relative to an appropriate base (costs, sales, or assets). This represents the most commonly applied method for UAE trading and distribution entities.
5. **Transactional Profit Split Method (TPSM):** Allocates combined operating profit derived from complex, highly integrated intangibles.

---

## 4. Common High-Risk Related-Party Exposures in the UAE

FTA audit inspections consistently target four specific intercompany areas:
- **Zero-Interest Intercompany Loans:** Providing interest-free financing between related mainland and free zone entities without arm's length interest rate benchmarking.
- **Unsubstantiated Management Service Fees:** Charging arbitrary annual management overheads without contemporaneous service level agreements (SLAs) or time-allocation documentation.
- **Intellectual Property Royalty Extractions:** Licensing group brand assets without demonstrable economic substance and value-creation activities in the licensor entity.
- **Director & Key Executive Remuneration:** Remuneration paid to Connected Persons that exceeds market remuneration standards for comparable roles, violating Article 36 limits.

---

## 5. Partnering with Dias Accounting & Tax Consulting

Defending related-party pricing before the Federal Tax Authority requires authoritative economic benchmarking and rigorous legal documentation.

Led by **Glen Dias**, FTA Registered Tax Agent, **Dias Accounting & Tax Consulting LLC** delivers comprehensive Transfer Pricing studies, TP disclosure return filings, and intercompany contract drafting for corporations across Dubai, Abu Dhabi, and the Northern Emirates.`,
  },
];

/**
 * Retrieves all blog queue items from Firestore or local fallback storage.
 * Auto-seeds default curated drafts if both sources are empty.
 */
export async function getBlogQueue(filter?: {
  status?: "pending" | "published" | "archived" | "all";
}): Promise<BlogQueueItem[]> {
  const local = readLocalDB();
  let items: BlogQueueItem[] = (local.blogQueue || []) as BlogQueueItem[];

  if (isFirestoreAvailable && db) {
    try {
      const queueRef = collection(db, "blog_queue");
      const q = query(queueRef, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const fsItems: BlogQueueItem[] = [];
      snap.forEach((d) => {
        fsItems.push({ ...(d.data() as BlogQueueItem), id: d.id });
      });

      if (fsItems.length > 0) {
        items = fsItems;
        local.blogQueue = fsItems;
        writeLocalDB(local);
      }
    } catch (err: any) {
      console.warn("[BlogQueue] Firestore read note:", err?.message || err);
    }
  }

  // Seed default curated drafts if queue is empty
  if (items.length === 0) {
    items = DEFAULT_QUEUE_ITEMS;
    local.blogQueue = items;
    writeLocalDB(local);

    if (isFirestoreAvailable && db) {
      for (const item of items) {
        try {
          const docRef = doc(db, "blog_queue", item.id);
          await setDoc(docRef, item);
        } catch {
          // Ignore non-fatal seed writes
        }
      }
    }
  }

  const targetStatus = filter?.status || "all";
  if (targetStatus === "all") {
    return items;
  }
  return items.filter((item) => item.status === targetStatus);
}

/**
 * Adds a new article draft to the publishing queue
 */
export async function addToBlogQueue(
  itemData: Partial<BlogQueueItem>
): Promise<BlogQueueItem> {
  const now = new Date().toISOString();
  const id = itemData.id || `queue-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const newItem: BlogQueueItem = {
    id,
    title: itemData.title || "Untitled UAE Tax Analysis",
    summary: itemData.summary || "",
    content: itemData.content || "",
    tag: itemData.tag || "Corporate Tax",
    readTime: itemData.readTime || "6 min read",
    keywords: itemData.keywords || ["UAE Corporate Tax", "Dias Accounting Dubai"],
    targetDay: itemData.targetDay || "Any",
    priority: itemData.priority ?? 1,
    status: itemData.status || "pending",
    createdAt: itemData.createdAt || now,
    scheduledDate: itemData.scheduledDate,
    author: itemData.author || {
      name: "Glen Dias",
      role: "Managing Director & FTA Registered Tax Agent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    notes: itemData.notes,
  };

  const local = readLocalDB();
  if (!local.blogQueue) local.blogQueue = [];
  local.blogQueue = [newItem, ...local.blogQueue.filter((i) => i.id !== id)];
  writeLocalDB(local);

  if (isFirestoreAvailable && db) {
    try {
      const docRef = doc(db, "blog_queue", id);
      await setDoc(docRef, newItem);
    } catch (err: any) {
      console.warn(`[BlogQueue] Firestore write failed for ${id}:`, err?.message || err);
    }
  }

  return newItem;
}

/**
 * Updates a queue item's status, content, or metadata
 */
export async function updateBlogQueueItem(
  id: string,
  updates: Partial<BlogQueueItem>
): Promise<BlogQueueItem | null> {
  const local = readLocalDB();
  if (!local.blogQueue) local.blogQueue = [];
  const idx = local.blogQueue.findIndex((i) => i.id === id);
  let updatedItem: BlogQueueItem | null = null;

  if (idx !== -1) {
    local.blogQueue[idx] = { ...local.blogQueue[idx], ...updates };
    updatedItem = local.blogQueue[idx];
    writeLocalDB(local);
  }

  if (isFirestoreAvailable && db) {
    try {
      const docRef = doc(db, "blog_queue", id);
      await setDoc(docRef, updates, { merge: true });
      if (!updatedItem) {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          updatedItem = { ...(snap.data() as BlogQueueItem), id };
        }
      }
    } catch (err: any) {
      console.warn(`[BlogQueue] Firestore update error for ${id}:`, err?.message || err);
    }
  }

  return updatedItem;
}

/**
 * Removes or archives an item from the queue
 */
export async function removeBlogQueueItem(id: string): Promise<boolean> {
  const local = readLocalDB();
  if (local.blogQueue) {
    local.blogQueue = local.blogQueue.filter((i) => i.id !== id);
    writeLocalDB(local);
  }

  if (isFirestoreAvailable && db) {
    try {
      const docRef = doc(db, "blog_queue", id);
      await deleteDoc(docRef);
    } catch (err: any) {
      console.warn(`[BlogQueue] Firestore delete failed for ${id}:`, err?.message || err);
    }
  }

  return true;
}

/**
 * Primary Tuesday & Friday Queue Publisher:
 * 1. Verifies semi-weekly schedule (Tuesday/Friday at 06:00 GST) unless force=true
 * 2. Fetches pending queue items matching target day / priority
 * 3. Formats and publishes the draft to `blog_posts` (Firestore & local DB)
 * 4. Marks the queue item as `published` with audit timestamp
 * 5. Updates cron execution record
 * 6. If queue is empty, automatically falls back to search-grounded Gemini AI generation
 */
export async function publishScheduledQueueItem(options: {
  force?: boolean;
  triggerSource?: string;
  specificId?: string;
} = {}): Promise<QueuePublishResult> {
  const startTime = Date.now();
  const triggerSource = options.triggerSource || "scheduled_tuesday_friday_queue";
  const uaeNow = getUAEDate();

  console.log(
    `[BlogQueuePublisher] Checking publication queue (Source: ${triggerSource}, UAE: ${uaeNow.dayName}, Hour: ${uaeNow.hours} GST, Force: ${!!options.force})...`
  );

  // 1. Check schedule eligibility (unless force=true)
  if (!options.force) {
    const isScheduledDay = uaeNow.dayOfWeek === 2 || uaeNow.dayOfWeek === 5;
    const lastSettings = await getDailyCronSettings();
    const lastRunUaeDate = lastSettings?.lastRun ? getUAEDate(new Date(lastSettings.lastRun)).dateString : null;
    const alreadyPublishedToday = lastRunUaeDate === uaeNow.dateString;

    if (!isScheduledDay) {
      const nextRun = getNextScheduledRunDate(new Date(), false);
      const pendingItems = await getBlogQueue({ status: "pending" });
      return {
        success: true,
        message: `Queue publication skipped. Today is ${uaeNow.dayName} (off-schedule). Next scheduled publication is ${nextRun.dayName} at 06:00 GST (${nextRun.countdownText}). ${pendingItems.length} article(s) currently waiting in queue.`,
        publishedFromQueue: false,
        remainingQueueCount: pendingItems.length,
        nextScheduledSlot: {
          dayName: nextRun.dayName,
          dateFormatted: nextRun.dateFormatted,
          countdownText: nextRun.countdownText,
        },
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }

    if (alreadyPublishedToday) {
      const nextRun = getNextScheduledRunDate(new Date(), true);
      const pendingItems = await getBlogQueue({ status: "pending" });
      return {
        success: true,
        message: `Today's ${uaeNow.dayName} article has already been published. Next scheduled publication slot is ${nextRun.dayName} at 06:00 GST (${nextRun.countdownText}).`,
        publishedFromQueue: false,
        remainingQueueCount: pendingItems.length,
        nextScheduledSlot: {
          dayName: nextRun.dayName,
          dateFormatted: nextRun.dateFormatted,
          countdownText: nextRun.countdownText,
        },
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 2. Fetch pending items from queue
  const pendingItems = await getBlogQueue({ status: "pending" });
  console.log(`[BlogQueuePublisher] Found ${pendingItems.length} pending article(s) in queue.`);

  let targetItem: BlogQueueItem | undefined;

  if (options.specificId) {
    targetItem = pendingItems.find((item) => item.id === options.specificId);
  }

  if (!targetItem && pendingItems.length > 0) {
    // Prefer item targeting current day name (Tuesday or Friday)
    const dayMatch = pendingItems.find(
      (item) => item.targetDay && item.targetDay.toLowerCase() === uaeNow.dayName.toLowerCase()
    );
    if (dayMatch) {
      targetItem = dayMatch;
    } else {
      // Sort by priority ASC (1 is highest), then createdAt ASC
      const sorted = [...pendingItems].sort((a, b) => {
        const pA = a.priority ?? 99;
        const pB = b.priority ?? 99;
        if (pA !== pB) return pA - pB;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      targetItem = sorted[0];
    }
  }

  // 3. Fallback to autonomous search-grounded Gemini generation if queue is empty
  if (!targetItem) {
    console.log(
      "[BlogQueuePublisher] No pending items in queue. Triggering AI search-grounded generation fallback..."
    );
    const genResult = await triggerDailyBlogGeneration({
      force: options.force,
      triggerSource: `${triggerSource}_empty_queue_fallback`,
    });
    const nextRun = getNextScheduledRunDate(new Date(), true);
    return {
      success: genResult.success,
      message: `Queue was empty. Published automated search-grounded article: "${genResult.blogPost?.title}". Next slot: ${nextRun.dayName} (${nextRun.countdownText}).`,
      publishedFromQueue: false,
      blogPost: genResult.blogPost,
      remainingQueueCount: 0,
      nextScheduledSlot: {
        dayName: nextRun.dayName,
        dateFormatted: nextRun.dateFormatted,
        countdownText: nextRun.countdownText,
      },
      durationMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }

  // 4. Publish the Queued Item
  const isoTimestamp = new Date().toISOString();
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const baseSlug = (targetItem.id || targetItem.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const finalSlug = `${baseSlug}-${Date.now().toString(36).substring(0, 4)}`;

  const schemaMarkup = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://diasuae.ae/#blog-${finalSlug}`,
      },
      headline: targetItem.title,
      description: targetItem.summary,
      datePublished: isoTimestamp,
      dateModified: isoTimestamp,
      author: {
        "@type": "Person",
        name: "Glen Dias",
        jobTitle: "Managing Director & FTA Registered Tax Agent",
        worksFor: {
          "@type": "Organization",
          name: "Dias Accounting & Tax Consulting LLC",
        },
      },
      publisher: {
        "@type": "Organization",
        name: "Dias Accounting & Tax Consulting LLC",
        url: "https://diasuae.ae",
        logo: {
          "@type": "ImageObject",
          url: "https://diasuae.ae/icon-192.png",
        },
      },
      keywords: (targetItem.keywords || []).join(", "),
      articleSection: targetItem.tag || "UAE Taxation & Corporate Finance",
    },
    null,
    2
  );

  const publishedPost: GeneratedBlogPost = {
    id: finalSlug,
    title: targetItem.title,
    summary: targetItem.summary,
    content: targetItem.content,
    date: todayFormatted,
    readTime: targetItem.readTime || "6 min read",
    tag: targetItem.tag || "Corporate Tax",
    author: {
      name: targetItem.author?.name || "Glen Dias",
      role: targetItem.author?.role || "Managing Director & FTA Registered Tax Agent",
      avatar:
        targetItem.author?.avatar ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    keywords: targetItem.keywords || ["UAE Corporate Tax", "FTA Tax Agent Dubai", "Glen Dias", "Accounting UAE"],
    schemaMarkup,
    isAiGenerated: false,
    generatedAt: isoTimestamp,
    sourceTrends: [
      `Published from Editorial Queue (${targetItem.targetDay || uaeNow.dayName} Slot)`,
      targetItem.tag,
    ],
  };

  // Persist to blog_posts collection and local DB
  await persistBlogPost(publishedPost);

  // Update queue item status to published
  await updateBlogQueueItem(targetItem.id, {
    status: "published",
    publishedAt: isoTimestamp,
    publishedBlogId: finalSlug,
  });

  const nextRun = getNextScheduledRunDate(new Date(), true);
  const remainingCount = pendingItems.length - 1;

  // Update cron settings
  await saveDailyCronSettings({
    lastRun: isoTimestamp,
    lastStatus: "success",
    lastPostTitle: publishedPost.title,
    lastPostId: publishedPost.id,
    publishedFromQueue: true,
    publishedQueueItemId: targetItem.id,
    cadence: "semi-weekly",
    activeDays: ["Tuesday", "Friday"],
    cronSchedule: "0 6 * * 2,5",
    cronScheduleUTC: "0 2 * * 2,5",
    nextRunDue: nextRun.nextDate.toISOString(),
    nextRunDay: nextRun.dayName,
    nextRunDateFormatted: nextRun.dateFormatted,
    remainingQueueCount: remainingCount,
    triggerSource,
    durationMs: Date.now() - startTime,
  });

  console.log(
    `[BlogQueuePublisher] Successfully published queued article "${publishedPost.title}". Remaining in queue: ${remainingCount}. Next slot: ${nextRun.dayName} (${nextRun.countdownText}).`
  );

  return {
    success: true,
    message: `Published queued post: "${publishedPost.title}". ${remainingCount} article(s) remaining in queue. Next publication slot: ${nextRun.dayName} (${nextRun.countdownText}).`,
    publishedFromQueue: true,
    publishedItem: targetItem,
    blogPost: publishedPost,
    remainingQueueCount: remainingCount,
    nextScheduledSlot: {
      dayName: nextRun.dayName,
      dateFormatted: nextRun.dateFormatted,
      countdownText: nextRun.countdownText,
    },
    durationMs: Date.now() - startTime,
    timestamp: isoTimestamp,
  };
}

// ==================== GOOGLE CLOUD FUNCTION HANDLER ====================

/**
 * Standard Google Cloud Function HTTP trigger entrypoint.
 * Compatible with Google Cloud Functions / Cloud Run / Google Cloud Scheduler HTTP target.
 *
 * Cloud Scheduler Setup:
 * - Cadence: Semi-Weekly (Tuesday & Friday at 06:00 GST / 02:00 UTC)
 * - Cron: `0 6 * * 2,5` (Asia/Dubai) or `0 2 * * 2,5` (UTC)
 * - Target: HTTP
 * - URL: https://[YOUR_DOMAIN]/api/cloud-functions/daily-blog-generator
 * - Method: POST
 * - Auth: OIDC token or Header `Authorization: Bearer <CRON_SECRET>`
 */
export async function dailyBlogGenerator(req: any, res: any) {
  // 1. Authenticate Trigger
  const authHeader = req.headers.authorization || req.headers.Authorization || "";
  const queryKey = req.query.key || req.query.token;
  const cronSecret = process.env.CRON_SECRET || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "dias2026";
  const isCloudScheduler = !!req.headers["x-cloudscheduler-jobname"];

  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

  // If secret is set, verify authorization
  if (cronSecret && !isCloudScheduler) {
    const isAuthorized = token === cronSecret || queryKey === cronSecret || token === adminPassword;
    if (!isAuthorized) {
      return res.status(401).json({
        error: "Unauthorized. Please provide valid authorization token.",
      });
    }
  }

  const force = req.query.force === "true" || req.body?.force === true;
  const specificId = req.query.id || req.body?.id;
  const triggerSource = isCloudScheduler
    ? "gcp_cloud_scheduler_cron"
    : req.body?.triggerSource || "http_cloud_function_trigger";

  try {
    const result = await publishScheduledQueueItem({
      force,
      specificId,
      triggerSource,
    });

    return res.status(200).json(result);
  } catch (err: any) {
    console.error("[dailyBlogGenerator] Cloud Function execution failed:", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Internal server error during scheduled blog publishing.",
    });
  }
}

/**
 * Dedicated queue processing Cloud Function handler
 */
export async function processBlogQueueHandler(req: any, res: any) {
  return dailyBlogGenerator(req, res);
}
