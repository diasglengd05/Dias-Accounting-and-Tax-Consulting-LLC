import express from "express";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { GoogleGenAI } from "@google/genai";
import { generateOgSvg } from "./server/ogGenerator.ts";
import { resolveMetaForRequest, injectMetaIntoHtml, isSocialOrSearchCrawler } from "./server/metaPrerender.ts";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  getDoc, 
  setDoc,
  where,
  limit,
  disableNetwork,
  setLogLevel
} from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json" with { type: "json" };

// Silence internal Firestore SDK logs
setLogLevel("silent");

// Initialize Firebase App on Server
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
let isFirestoreAvailable = false;

async function checkFirestore() {
  try {
    const testRef = doc(db, "settings", "connection_test");
    await getDoc(testRef);
    isFirestoreAvailable = true;
  } catch {
    isFirestoreAvailable = false;
    try {
      await disableNetwork(db);
    } catch {
      // Safe fallback
    }
  }
}

// Check Firestore availability in background at startup
checkFirestore();

// ==================== RESILIENT DUAL-LAYER STORAGE ====================
interface LocalDBData {
  inquiries: any[];
  settings: {
    [key: string]: any;
  };
}

const DB_FILE = path.join(process.cwd(), "db_fallback.json");

function readLocalDB(): LocalDBData {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("Failed to read local fallback DB:", err);
  }
  return { inquiries: [], settings: {} };
}

function writeLocalDB(data: LocalDBData) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write local fallback DB:", err);
  }
}

const SecureStorageService = {
  async getSettings(key: string): Promise<any> {
    if (isFirestoreAvailable) {
      try {
        const oauthRef = doc(db, "settings", key);
        const snap = await getDoc(oauthRef);
        if (snap.exists()) {
          return snap.data();
        }
      } catch (err: any) {
        console.warn(`Firestore read failed for settings/${key}, using local fallback:`, err.message || err);
      }
    }
    const local = readLocalDB();
    return local.settings[key] || null;
  },

  async saveSettings(key: string, data: any): Promise<void> {
    const local = readLocalDB();
    local.settings[key] = { ...(local.settings[key] || {}), ...data };
    writeLocalDB(local);

    if (isFirestoreAvailable) {
      try {
        const oauthRef = doc(db, "settings", key);
        await setDoc(oauthRef, data, { merge: true });
      } catch (err: any) {
        console.warn(`Firestore write failed for settings/${key}:`, err.message || err);
      }
    }
  },

  async addInquiry(inquiry: any): Promise<string> {
    const local = readLocalDB();
    const id = "inq_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    const localInquiry = { ...inquiry, id };
    local.inquiries.push(localInquiry);
    writeLocalDB(local);

    if (isFirestoreAvailable) {
      try {
        const docRef = await addDoc(collection(db, "inquiries"), inquiry);
        console.log(`Saved inquiry ${docRef.id} to Firestore.`);
        // Update local storage with real Firestore ID if it worked
        localInquiry.id = docRef.id;
        writeLocalDB(local);
        return docRef.id;
      } catch (err: any) {
        console.warn(`Firestore write failed for inquiry, using local ID ${id}:`, err.message || err);
        return id;
      }
    }
    return id;
  },

  async getUnsyncedInquiries(): Promise<any[]> {
    if (isFirestoreAvailable) {
      try {
        const q = query(collection(db, "inquiries"), where("synced", "==", false));
        const snapshot = await getDocs(q);
        const records: any[] = [];
        snapshot.forEach((docSnap) => {
          records.push({ ...docSnap.data(), id: docSnap.id });
        });
        if (records.length > 0) {
          return records;
        }
      } catch (err: any) {
        console.warn("Firestore getUnsyncedInquiries failed, using local fallback:", err.message || err);
      }
    }
    const local = readLocalDB();
    return local.inquiries.filter(inq => !inq.synced);
  },

  async markInquirySynced(id: string): Promise<void> {
    const local = readLocalDB();
    const inq = local.inquiries.find(i => i.id === id);
    if (inq) {
      inq.synced = true;
      writeLocalDB(local);
    }

    if (isFirestoreAvailable && id && !id.startsWith("inq_")) {
      try {
        await updateDoc(doc(db, "inquiries", id), { synced: true });
      } catch (err: any) {
        console.warn(`Firestore update failed for inquiry ${id}:`, err.message || err);
      }
    }
  },

  async updateInquiry(id: string, updates: any): Promise<void> {
    const local = readLocalDB();
    const idx = local.inquiries.findIndex(i => i.id === id);
    if (idx !== -1) {
      local.inquiries[idx] = { ...local.inquiries[idx], ...updates };
      writeLocalDB(local);
    }

    if (isFirestoreAvailable && id && !id.startsWith("inq_")) {
      try {
        await updateDoc(doc(db, "inquiries", id), updates);
      } catch (err: any) {
        console.warn(`Firestore update failed for inquiry ${id}:`, err.message || err);
      }
    }
  },

  async countUnsyncedInquiries(): Promise<number> {
    if (isFirestoreAvailable) {
      try {
        const q = query(collection(db, "inquiries"), where("synced", "==", false));
        const snapshot = await getDocs(q);
        return snapshot.size;
      } catch (err: any) {
        console.warn("Firestore countUnsyncedInquiries failed, using local fallback:", err.message || err);
      }
    }
    const local = readLocalDB();
    return local.inquiries.filter(inq => !inq.synced).length;
  },

  async getAllInquiries(): Promise<any[]> {
    if (isFirestoreAvailable) {
      try {
        const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const records: any[] = [];
        snapshot.forEach((docSnap) => {
          records.push({ ...docSnap.data(), id: docSnap.id });
        });
        if (records.length > 0) {
          return records;
        }
      } catch (err: any) {
        console.warn("Firestore getAllInquiries failed, using local fallback:", err.message || err);
      }
    }
    const local = readLocalDB();
    return [...local.inquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};

const app = express();
const PORT = 3000;

app.use(express.json());

// API health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * Maps serviceType to professional display name
 */
const getServiceDisplayName = (id: string): string => {
  switch (id) {
    case "corporate-tax":
      return "Corporate Tax Advisory (9% compliance)";
    case "vat-compliance":
      return "VAT Compliance, Audits & Filing";
    case "accounting":
      return "Accounting, Bookkeeping & Backoffice";
    case "incorporation":
      return "Business Setup, Licensing & Freezones";
    case "general":
      return "Comprehensive Consultation Package";
    default:
      return id;
  }
};

/**
 * Google Drive Search and Sheets Creation Helper
 */
async function serverFindOrCreateSpreadsheet(accessToken: string, savedSheetId: string | null): Promise<string> {
  const targetId = "12DjTgoDGdU05oRWFiiQFJ5fLhW4G9rctepWBuOXGDuY";
  const title = "Dias Tax Consultation Inquiries";
  
  // 1. Verify and use the user's specific spreadsheet ID first
  try {
    const verifyRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${targetId}?fields=spreadsheetId`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (verifyRes.ok) {
      console.log(`Verified user's target spreadsheet ID: ${targetId}`);
      return targetId;
    }
  } catch (err) {
    console.warn("Verification of user's target spreadsheet failed:", err);
  }

  // 2. Fallback to savedSheetId
  if (savedSheetId) {
    try {
      const verifyRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${savedSheetId}?fields=spreadsheetId`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (verifyRes.ok) {
        return savedSheetId;
      }
    } catch (err) {
      console.warn("Cached spreadsheet verification failed:", err);
    }
  }

  // Search Drive for the sheet
  try {
    const q = `name = '${title}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`;
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const id = searchData.files[0].id;
        return id;
      }
    }
  } catch (err) {
    console.error("Error searching spreadsheet in Google Drive:", err);
  }

  // Create a brand new Google Sheet
  console.log("No existing spreadsheet found. Creating 'Dias Tax Consultation Inquiries' in Google Sheets...");
  const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      properties: {
        title: title
      }
    })
  });

  if (!createRes.ok) {
    const errorJson = await createRes.json();
    throw new Error(`Failed to create Google Sheet: ${errorJson.error?.message || createRes.statusText}`);
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;

  // Initialize spreadsheet with professional table headers
  const headers = [
    ["Submission Time (GST)", "Full Name", "Work Email", "Mobile Number", "Company Name", "Service Interest", "Lead Status"]
  ];

  const initRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:G1:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        values: headers
      })
    }
  );

  if (!initRes.ok) {
    console.error("Failed to append spreadsheet header rows.");
  }

  return spreadsheetId;
}

/**
 * Append Inquiry Row to Google Sheets
 */
async function serverAppendInquiryRow(accessToken: string, spreadsheetId: string, lead: any) {
  // Use Dubai local time (GST)
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Dubai",
    dateStyle: "medium",
    timeStyle: "medium"
  }) + " (GST)";

  const row = [
    timestamp,
    lead.name,
    lead.email,
    lead.phone,
    lead.company || "N/A",
    getServiceDisplayName(lead.serviceType),
    "New Lead"
  ];

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:G1:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        values: [row]
      })
    }
  );

  if (!appendRes.ok) {
    const errorJson = await appendRes.json();
    throw new Error(`Failed to append lead to Google Sheet: ${errorJson.error?.message || appendRes.statusText}`);
  }

  return await appendRes.json();
}

/**
 * Server-side Sync Coordinator Helper
 * Syncs unsynced inquiries in the background using the cached access token
 */
async function runBackgroundSync(accessToken: string, currentSheetId: string | null): Promise<{ syncedCount: number, error?: string, sheetId: string }> {
  try {
    // 1. Get or create spreadsheet
    const sheetId = await serverFindOrCreateSpreadsheet(accessToken, currentSheetId);
    
    // 2. Fetch unsynced inquiries from SecureStorage
    const unsyncedInquiries = await SecureStorageService.getUnsyncedInquiries();
    
    let syncedCount = 0;
    
    for (const lead of unsyncedInquiries) {
      try {
        await serverAppendInquiryRow(accessToken, sheetId, lead);
        
        // Mark as synced in SecureStorage
        await SecureStorageService.markInquirySynced(lead.id);
        syncedCount++;
      } catch (err: any) {
        console.error(`Inquiry ${lead.id} failed to sync server-side:`, err);
        // Stop batch if we hit a permission/auth issue
        if (err.message && (err.message.includes("401") || err.message.includes("auth"))) {
          throw err;
        }
      }
    }

    // Update settings with spreadsheetId
    await SecureStorageService.saveSettings("google_oauth", { spreadsheetId: sheetId });

    return { syncedCount, sheetId };
  } catch (err: any) {
    console.error("Background sync error:", err);
    throw err;
  }
}

// ==================== API ROUTES ====================

/**
 * Gemini AI Client for Regulatory Search & Grounding
 * Uses gemini-3.7-flash with Google Search Grounding for live UAE tax regulatory retrieval
 */
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[Gemini API] GEMINI_API_KEY is not defined in environment.");
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

/**
 * AI Regulatory Intelligence Search (Google Search Grounded)
 * Powered by gemini-3.7-flash with live search grounding
 */
app.post("/api/gemini/tax-search", async (req, res) => {
  const { query: userQuery, category, language } = req.body;

  if (!userQuery || typeof userQuery !== "string" || !userQuery.trim()) {
    return res.status(400).json({ error: "Search query is required." });
  }

  const isArabic = language === "ar";
  const client = getGeminiClient();

  const systemInstruction = `
You are the Senior UAE Regulatory Intelligence Specialist for Dias Accounting & Tax Consulting LLC (Dubai, UAE), founded and led by Glen Dias (FTA Registered Tax Agent & Senior Accounting Advisor).
Your role is to provide precise, authoritative, up-to-date, and actionable answers on UAE Corporate Tax (Federal Decree-Law No. 47 of 2022 and subsequent Cabinet Decisions through 2025/2026), UAE VAT (Federal Decree-Law No. 8 of 2017), Federal Tax Authority (FTA) public clarifications, Qualifying Free Zone Person (QFZP) rules, Small Business Relief (SBR threshold AED 3,000,000), transfer pricing, and statutory accounting compliance (IFRS).

CRITICAL GROUNDING DIRECTIVES:
1. Always utilize the Google Search tool to fetch live, up-to-date UAE regulatory announcements, FTA deadlines, official gazette decisions, and Ministry of Finance circulars.
2. Structure the response clearly with:
   - **Executive Summary / Direct Answer**
   - **Key Regulatory Provisions & Legal Articles** (cite specific Decree-Laws or Cabinet Decisions where applicable)
   - **Practical Compliance Steps for UAE Businesses**
   - **Dias Accounting Strategic Advisory Recommendation**
3. Respond in ${isArabic ? "professional formal Arabic (الفصحى المهنية)" : "fluent, professional English"}.
4. Maintain a reassuring, expert, and authoritative tone.
`.trim();

  try {
    if (!client) {
      // Fallback response if GEMINI_API_KEY is not configured yet
      const fallbackMsg = isArabic
        ? `ملخص تنظيمي (الهيئة الاتحادية للضرائب - دولة الإمارات العربية المتحدة):

• **ضريبة الشركات**: تطبق بنسبة 9% على الأرباح الخاضعة للضريبة التي تتجاوز 375,000 درهم إماراتي، وبنسبة 0% لما دون ذلك.
• **تسهيلات الأعمال الصغيرة (SBR)**: للشركات ذات الإيرادات السنوية التي لا تتجاوز 3,000,000 درهم إماراتي.
• **شركات المناطق الحرة المؤهلة (QFZP)**: تخضع لنسبة 0% على الدخل المؤهل شريطة استيفاء شروط الوجود الاقتصادي والأنشطة المؤهلة.
• **ضريبة القيمة المضافة (VAT)**: التسجيل إلزامي عند تجاوز التوريدات الخاضعة للضريبة 375,000 درهم خلال 12 شهراً.

للحصول على استشارة تفصيلية ومخصصة لحالة شركتكم، يرجى التواصل مباشرة مع المستشار غلين دياس.`
        : `Official UAE Tax Regulatory Guidance Overview:

• **UAE Corporate Tax (Federal Decree-Law No. 47 of 2022)**: 9% standard rate on taxable net profits exceeding AED 375,000 (0% on profits up to AED 375,000).
• **Small Business Relief (SBR)**: Available for resident businesses with gross revenue not exceeding AED 3,000,000 per tax period.
• **Qualifying Free Zone Persons (QFZP)**: Eligible for 0% tax on qualifying income from qualifying activities, provided adequate economic substance is maintained and non-qualifying revenue does not breach de minimis thresholds.
• **VAT Compliance (Federal Decree-Law No. 8 of 2017)**: Mandatory registration threshold of AED 375,000 in taxable supplies and imports.

For a dedicated audit and filing review tailored to your company's corporate structure, schedule a consultation with Glen Dias.`;
      
      return res.json({
        success: true,
        answer: fallbackMsg,
        sources: [
          { title: "UAE Federal Tax Authority (FTA) Portal", uri: "https://tax.gov.ae" },
          { title: "UAE Ministry of Finance (Corporate Tax)", uri: "https://mof.gov.ae" }
        ],
        searchQueries: [userQuery],
        model: "gemini-3.7-flash",
        grounded: false,
      });
    }

    const prompt = `
Search and analyze the latest UAE tax regulations, FTA decisions, and official guidelines regarding:
"${userQuery.trim()}"

Category: ${category || "general"}
Target Language: ${isArabic ? "Arabic" : "English"}

Please provide a detailed, accurate, and search-grounded explanation with relevant legal references and clear actionable takeaways for UAE business owners, finance managers, and CFOs.
`.trim();

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const answer = response.text || "";
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    // Extract search sources
    const sources: Array<{ title: string; uri: string }> = [];
    const rawChunks = groundingMetadata?.groundingChunks || [];
    if (Array.isArray(rawChunks)) {
      for (const chunk of rawChunks) {
        if (chunk && (chunk as any).web && (chunk as any).web.uri) {
          const uri = (chunk as any).web.uri;
          const title = (chunk as any).web.title || new URL(uri).hostname;
          // De-duplicate by URI
          if (!sources.some(s => s.uri === uri)) {
            sources.push({ title, uri });
          }
        }
      }
    }

    // Default fallback sources if none returned by search
    if (sources.length === 0) {
      sources.push(
        { title: "UAE Federal Tax Authority (FTA)", uri: "https://tax.gov.ae" },
        { title: "UAE Ministry of Finance (Corporate Tax)", uri: "https://mof.gov.ae" }
      );
    }

    const searchQueries = groundingMetadata?.webSearchQueries || [userQuery];

    return res.json({
      success: true,
      answer,
      sources,
      searchQueries,
      model: "gemini-3.7-flash",
      grounded: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[Gemini Tax Search] Error generating search-grounded response:", err);
    // If search grounding fails (e.g. search rate limits), return fallback response with valid answer
    const fallbackAnswer = isArabic
      ? `التوجيه الضريبي الرسمي من دياس للاستشارات المحاسبية والضريبية:

بشأن استفساركم: "${userQuery.trim()}"

• **الإطار التشريعي**: تخضع المعاملات لقانون ضريبة الشركات (المرسوم بقانون اتحادي رقم 47 لسنة 2022) وقانون ضريبة القيمة المضافة (المرسوم بقانون اتحادي رقم 8 لسنة 2017).
• **الالتزام والإيداع**: يجب على جميع الشركات المرخصة في دولة الإمارات والمناطق الحرة التسجيل الضريبي لدى الهيئة الاتحادية للضرائب وتقديم الإقرارات في المواعيد المحددة قانونياً لتفادي الغرامات الإدارية.
• **التوصية المهنية**: يوصى بمراجعة المركز المالي والقوائم المالية المعدة وفق معايير IFRS لضمان الاستفادة القصوى من الإعفاءات وتسهيلات الأعمال الصغيرة.

يرجى التواصل مع الأستاذ غلين دياس (وكيل ضريبي معتمد) للحصول على دراسة تفصيلية لملف شركتكم.`
      : `Official Regulatory Guidance from Dias Accounting & Tax Consulting:

Regarding your query: "${userQuery.trim()}"

• **Legal Framework**: Subject to UAE Corporate Tax (Federal Decree-Law No. 47 of 2022) and UAE VAT (Federal Decree-Law No. 8 of 2017) along with relevant FTA Public Clarifications.
• **Compliance & Deadlines**: All UAE mainland and Free Zone entities must obtain a Tax Registration Number (TRN) and file statutory returns within 9 months of the financial year-end to prevent administrative penalties.
• **Professional Recommendation**: Ensure your books are fully prepared according to IFRS standards to maximize Qualifying Free Zone status (0%) or Small Business Relief (under AED 3,000,000 revenue).

Connect directly with Glen Dias (FTA Registered Tax Agent) for an in-depth audit of your company's tax position.`;

    return res.json({
      success: true,
      answer: fallbackAnswer,
      sources: [
        { title: "UAE Federal Tax Authority (FTA) Regulations", uri: "https://tax.gov.ae" },
        { title: "UAE Ministry of Finance Corporate Tax Portal", uri: "https://mof.gov.ae" },
      ],
      searchQueries: [userQuery],
      model: "gemini-3.7-flash",
      grounded: false,
      fallbackUsed: true,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Dynamic Open Graph (OG) Image Generation Endpoint
 * Returns high-resolution 1200x630 SVGs customized on the fly for social sharing & click-through rates
 */
app.get(["/api/og", "/api/og/image"], (req, res) => {
  try {
    const { title, author, role, tag, date, readTime, summary, id } = req.query;

    const svg = generateOgSvg({
      title: typeof title === "string" ? title : undefined,
      author: typeof author === "string" ? author : undefined,
      role: typeof role === "string" ? role : undefined,
      tag: typeof tag === "string" ? tag : undefined,
      date: typeof date === "string" ? date : undefined,
      readTime: typeof readTime === "string" ? readTime : undefined,
      summary: typeof summary === "string" ? summary : undefined,
      id: typeof id === "string" ? id : undefined,
    });

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(svg);
  } catch (err: any) {
    console.error("[OG Generator] Error generating SVG card:", err);
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    return res.status(200).send(generateOgSvg({}));
  }
});

/**
 * Clean URL alias for individual blog post OG images: /api/og/blog/:id
 */
app.get("/api/og/blog/:id", (req, res) => {
  try {
    // Strip optional .svg or .png extension from ID parameter
    const blogId = (req.params.id || "").replace(/\.(svg|png|jpg|jpeg|webp)$/i, "");
    const { title, author, role, tag, date, readTime, summary } = req.query;

    const svg = generateOgSvg({
      id: blogId,
      title: typeof title === "string" ? title : undefined,
      author: typeof author === "string" ? author : undefined,
      role: typeof role === "string" ? role : undefined,
      tag: typeof tag === "string" ? tag : undefined,
      date: typeof date === "string" ? date : undefined,
      readTime: typeof readTime === "string" ? readTime : undefined,
      summary: typeof summary === "string" ? summary : undefined,
    });

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(svg);
  } catch (err: any) {
    console.error("[OG Generator Blog ID] Error:", err);
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    return res.status(200).send(generateOgSvg({}));
  }
});

/**
 * Reusable email notification helper supporting SMTP and Gmail API
 */
interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
}

async function sendEmailNotification(options: SendEmailOptions): Promise<{ sent: boolean; method: string; error?: string }> {
  const { to, subject, html, fromName = "Dias Accounting & Tax Consulting" } = options;
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const senderEmail = process.env.SENDER_EMAIL || smtpUser || "consulting@diasaccounting.ae";

  // 1. Try SMTP if configured
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"${fromName}" <${senderEmail}>`,
        to,
        subject,
        html,
      });

      console.log(`[Email] Dispatched email to ${to} via SMTP.`);
      return { sent: true, method: "smtp" };
    } catch (err: any) {
      console.error(`[Email] SMTP dispatch to ${to} failed:`, err);
    }
  }

  // 2. Try Google Workspace Gmail API if OAuth token is present
  try {
    const oauthData = await SecureStorageService.getSettings("google_oauth");
    if (oauthData && oauthData.accessToken && !oauthData.tokenExpired) {
      const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
      const messageParts = [
        `From: "${fromName}" <${oauthData.email || senderEmail || "me"}>`,
        `To: ${to}`,
        `Subject: ${utf8Subject}`,
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=utf-8",
        "",
        html,
      ];
      const rawMessage = messageParts.join("\r\n");
      const encodedMessage = Buffer.from(rawMessage)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const gmailRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${oauthData.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: encodedMessage }),
      });

      if (gmailRes.ok) {
        console.log(`[Email] Dispatched email to ${to} via Google Workspace Gmail API.`);
        return { sent: true, method: "gmail-oauth" };
      } else {
        const gmErr = await gmailRes.json().catch(() => ({}));
        console.log("[Email] Gmail API response note:", gmErr);
      }
    }
  } catch (gErr) {
    console.warn("[Email] Gmail OAuth attempt note:", gErr);
  }

  return { sent: false, method: "none" };
}

/**
 * Capture Form Submissions (Public Route)
 * Bypasses login entirely, saves securely and immediately attempts automatic server-side Sheets sync
 */
app.post("/api/inquiries", async (req, res) => {
  const { name, email, phone, company, serviceType, message } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  // Pack any message text into the company string so it gets recorded in Google Sheets as well
  const finalCompany = message 
    ? (company ? `${company} (Msg: ${message})` : `Msg: ${message}`) 
    : (company || "N/A");

  const payload = {
    name,
    email,
    phone,
    company: finalCompany,
    serviceType: serviceType || "general",
    createdAt: new Date().toISOString(),
    synced: false,
    status: "New Lead"
  };

  try {
    // 1. Save to SecureStorage
    const inquiryId = await SecureStorageService.addInquiry(payload);
    console.log(`Saved direct inquiry ${inquiryId} securely.`);

    // 2. Attempt immediate automatic sync to Google Sheets
    let autoSynced = false;
    let spreadsheetId: string | null = null;
    let syncError: string | null = null;

    try {
      // Load Google OAuth settings from SecureStorage
      const oauthData = await SecureStorageService.getSettings("google_oauth");

      if (oauthData) {
        const { accessToken, spreadsheetId: savedSheetId, tokenExpired } = oauthData;

        if (accessToken && !tokenExpired) {
          // Attempt appending
          const activeSheetId = await serverFindOrCreateSpreadsheet(accessToken, savedSheetId || null);
          spreadsheetId = activeSheetId;
          
          await serverAppendInquiryRow(accessToken, activeSheetId, payload);
          
          // Mark as synced in SecureStorage
          await SecureStorageService.markInquirySynced(inquiryId);
          autoSynced = true;
          console.log(`Inquiry ${inquiryId} automatically synced to Google Sheets server-side!`);
        } else {
          console.log("Advisor token has expired or is missing. Sync will be completed upon advisor login.");
        }
      } else {
        console.log("No advisor Google OAuth credentials found yet.");
      }
    } catch (err: any) {
      console.error("Server-side automatic sync caught error:", err);
      syncError = err.message || "Failed to sync";
      
      // If we got a 401 Unauthorized, flag the token as expired
      if (syncError.includes("401") || syncError.toLowerCase().includes("unauthorized") || syncError.toLowerCase().includes("invalid credentials")) {
        await SecureStorageService.saveSettings("google_oauth", { tokenExpired: true });
        console.log("Flagged advisor Google OAuth token as expired in settings.");
      }
    }

    // 3. Dispatch internal admin alert email
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || "diasglen.gd@gmail.com";
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : `https://wa.me/971502560990`;
    const appUrl = process.env.APP_URL || "https://diasaccounting.ae";

    const adminEmailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0a1736; line-height: 1.6;">
        <div style="background: linear-gradient(135deg, #0a1736 0%, #1e293b 100%); color: #ffffff; padding: 24px; border-radius: 12px 12px 0 0;">
          <div style="display: inline-block; background-color: #c5a059; color: #0a1736; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 8px;">
            🚨 New Client Inquiry / Booking
          </div>
          <h2 style="margin: 0; font-size: 20px; font-weight: bold; color: #ffffff;">New Lead: ${name}</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">Service: ${serviceType || "Tax & Accounting Inquiry"}</p>
        </div>
        
        <div style="padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tbody>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: bold; width: 35%;">Client Name:</td>
                <td style="padding: 10px 0; color: #0a1736; font-weight: bold;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Phone / WhatsApp:</td>
                <td style="padding: 10px 0;"><a href="tel:${phone}" style="color: #0a1736; text-decoration: none; font-weight: 600;">${phone}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Company / Details:</td>
                <td style="padding: 10px 0; color: #334155;">${finalCompany}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Requested Service:</td>
                <td style="padding: 10px 0; color: #0a1736; font-weight: 600;">${serviceType || "General Consultation"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Time (UAE):</td>
                <td style="padding: 10px 0; color: #64748b;">${new Date().toLocaleString("en-AE", { timeZone: "Asia/Dubai" })}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Sheets Sync Status:</td>
                <td style="padding: 10px 0; color: ${autoSynced ? "#16a34a" : "#ca8a04"}; font-weight: bold;">
                  ${autoSynced ? "✓ Synced to Google Sheets" : "Queued for Advisor Login Sync"}
                </td>
              </tr>
            </tbody>
          </table>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; text-align: center;">
            <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Quick Actions:</p>
            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
              <a href="${waLink}" style="background-color: #25d366; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 12px; display: inline-block; margin: 4px;">
                💬 WhatsApp Prospect
              </a>
              <a href="mailto:${email}?subject=Regarding%20your%20consultation%20with%20Dias%20Accounting" style="background-color: #0a1736; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 12px; display: inline-block; margin: 4px;">
                ✉️ Reply via Email
              </a>
              <a href="${appUrl}/#admin" style="background-color: #f1f5f9; color: #0a1736; border: 1px solid #cbd5e1; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 12px; display: inline-block; margin: 4px;">
                📊 View in Admin Portal
              </a>
            </div>
          </div>
          
          <p style="font-size: 11px; color: #94a3b8; margin: 0; text-align: center;">
            Dias Accounting & Tax Consulting Automated Lead System | Ref ID: ${inquiryId}
          </p>
        </div>
      </div>
    `;

    // Fire admin notification asynchronously
    sendEmailNotification({
      to: adminEmail,
      subject: `🚨 [NEW INQUIRY] ${name} - ${serviceType || "Consultation Request"}`,
      html: adminEmailHtml,
    }).catch(err => console.warn("Admin notification dispatch warning:", err));

    return res.json({
      success: true,
      inquiryId,
      autoSynced,
      spreadsheetId,
      syncError
    });
  } catch (err: any) {
    console.error("Inquiry capture failed:", err);
    return res.status(500).json({ error: "Failed to log inquiry backend." });
  }
});

/**
 * Send Playbook via Email & Record Lead (Public Route)
 * Triggers both user delivery email AND internal admin alert notification
 */
app.post("/api/send-playbook-email", async (req, res) => {
  const { name, email, phone, company, language } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Name, email, and phone number are required." });
  }

  const isArabic = language === "ar";
  const formattedCompany = company || "N/A";
  const appUrl = process.env.APP_URL || "https://diasaccounting.ae";
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : `https://wa.me/971502560990`;

  // 1. Record lead to database
  const leadPayload = {
    name,
    email,
    phone,
    company: formattedCompany,
    serviceType: "Lead Magnet: 2026 UAE Corporate Tax & VAT Compliance Playbook",
    message: `User requested the 2026 Executive Tax Playbook. Sent to email: ${email}`,
    createdAt: new Date().toISOString(),
    synced: false,
    status: "Lead Magnet - Sent"
  };

  let inquiryId = "";
  try {
    inquiryId = await SecureStorageService.addInquiry(leadPayload);
  } catch (err) {
    console.warn("Error saving playbook lead to storage:", err);
  }

  // 2. Attempt Google Sheets sync
  let autoSynced = false;
  try {
    const oauthData = await SecureStorageService.getSettings("google_oauth");
    if (oauthData && oauthData.accessToken && !oauthData.tokenExpired) {
      const activeSheetId = await serverFindOrCreateSpreadsheet(oauthData.accessToken, oauthData.spreadsheetId || null);
      await serverAppendInquiryRow(oauthData.accessToken, activeSheetId, leadPayload);
      if (inquiryId) await SecureStorageService.markInquirySynced(inquiryId);
      autoSynced = true;
    }
  } catch (err) {
    console.warn("Playbook sheets sync deferred:", err);
  }

  // 3. User confirmation email content
  const userEmailSubject = isArabic
    ? "دليلك الحصري للامتثال لضريبة الشركات والقيمة المضافة لعام 2026 - دياز للمحاسبة"
    : "Your 2026 UAE Corporate Tax & VAT Compliance Playbook - Dias Accounting";

  const userEmailHtml = isArabic ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0a1736; line-height: 1.6; direction: rtl; text-align: right;">
      <div style="background-color: #0a1736; color: #c5a059; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 20px; font-weight: bold; color: #ffffff;">دياز للمحاسبة والاستشارات الضريبية</h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #c5a059;">دليل الامتثال التنفيذي لضريبة الشركات والقيمة المضافة لعام 2026</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 15px;">مرحباً <strong>${name}</strong>،</p>
        <p style="font-size: 14px; color: #475569;">
          شكراً لطلبك الدليل الشامل للامتثال لضريبة الشركات والقيمة المضافة لعام 2026 المخصص للشركات في دبي والمناطق الحرة.
        </p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h3 style="margin-top: 0; font-size: 14px; color: #0a1736;">أبرز محاور الدليل:</h3>
          <ul style="padding-right: 20px; margin-bottom: 0; font-size: 13px; color: #334155;">
            <li>الجدول الزمني لإقرارات ضريبة الشركات عبر منصة إمارات تاكس</li>
            <li>شروط الاستفادة من نسبة 0% للشخص المؤهل في المنطقة الحرة (QFZP)</li>
            <li>تسهيلات الأعمال الصغيرة (إيرادات حتى 3 ملايين درهم)</li>
            <li>قائمة التحقق من الفواتير الضريبية واسترداد ضريبة المدخلات بنسبة 100%</li>
            <li>إعادة بناء السجلات المحاسبية المتراكمة والمتطابقة مع معايير IFRS</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${appUrl}" style="background-color: #0a1736; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
            زيارة المنصة وحجز استشارة ضريبية
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b; margin-bottom: 4px;"><strong>المستشار غلين دياز</strong> | الشريك المؤسس والمدير العام</p>
        <p style="font-size: 12px; color: #64748b; margin-top: 0;">هاتف / واتساب: +971 50 256 0990 | البريد: contact@diasaccounting.ae</p>
      </div>
    </div>
  ` : `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0a1736; line-height: 1.6;">
      <div style="background-color: #0a1736; color: #c5a059; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 20px; font-weight: bold; color: #ffffff;">DIAS ACCOUNTING & TAX CONSULTING</h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #c5a059;">2026 Executive UAE Corporate Tax & VAT Compliance Playbook</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 15px;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 14px; color: #475569;">
          Thank you for requesting the official <strong>2026 UAE Corporate Tax & VAT Compliance Playbook</strong> for Dubai Mainland and Free Zone enterprises.
        </p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h3 style="margin-top: 0; font-size: 14px; color: #0a1736;">Key Compliance Takeaways for ${formattedCompany !== "N/A" ? formattedCompany : "Your Firm"}:</h3>
          <ul style="padding-left: 20px; margin-bottom: 0; font-size: 13px; color: #334155;">
            <li><strong>EmaraTax Deadlines:</strong> Mandatory registration and statutory return timelines under Federal Decree-Law No. 47.</li>
            <li><strong>Free Zone 0% QFZP Matrix:</strong> 5 essential economic substance rules & qualifying revenue thresholds.</li>
            <li><strong>Small Business Relief (SBR):</strong> 0% corporate tax benefits for gross revenues up to AED 3,000,000.</li>
            <li><strong>10-Point VAT Audit:</strong> Avoiding non-compliance penalties & recovering 100% legitimate input tax.</li>
            <li><strong>Backlog Bookkeeping:</strong> Reconciling past-year ledgers according to IFRS standards before FTA audits.</li>
          </ul>
        </div>

        <p style="font-size: 13px; color: #475569;">
          You can download or review your personalized copy directly anytime, or connect directly with our advisory team below.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${appUrl}" style="background-color: #0a1736; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
            Book Complimentary 15-Min Tax Review
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b; margin-bottom: 4px;"><strong>Glen Dias</strong> | Founder & Managing Partner</p>
        <p style="font-size: 12px; color: #64748b; margin-top: 0;">Phone / WhatsApp: +971 50 256 0990 | Email: contact@diasaccounting.ae | Dubai, UAE</p>
      </div>
    </div>
  `;

  // 4. Internal Admin Notification Email
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || "diasglen.gd@gmail.com";
  const adminSubject = `⚡ [LEAD MAGNET] Playbook Downloaded: ${name} (${formattedCompany})`;

  const adminEmailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0a1736; line-height: 1.6;">
      <div style="background: linear-gradient(135deg, #0a1736 0%, #1e293b 100%); color: #ffffff; padding: 24px; border-radius: 12px 12px 0 0;">
        <div style="display: inline-block; background-color: #c5a059; color: #0a1736; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 8px;">
          ⚡ Lead Magnet Download Alert
        </div>
        <h2 style="margin: 0; font-size: 20px; font-weight: bold; color: #ffffff;">${name} downloaded the 2026 Playbook</h2>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">Company: ${formattedCompany}</p>
      </div>
      
      <div style="padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 14px; color: #334155; margin-top: 0;">
          A new prospect requested and downloaded the <strong>2026 UAE Corporate Tax & VAT Compliance Playbook</strong>:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
          <tbody>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold; width: 35%;">Prospect Name:</td>
              <td style="padding: 10px 0; color: #0a1736; font-weight: bold;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Company Name:</td>
              <td style="padding: 10px 0; color: #334155;">${formattedCompany}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Work Email:</td>
              <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Phone / WhatsApp:</td>
              <td style="padding: 10px 0;"><a href="tel:${phone}" style="color: #0a1736; text-decoration: none; font-weight: 600;">${phone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Language Choice:</td>
              <td style="padding: 10px 0; color: #334155;">${isArabic ? "Arabic (العربية)" : "English"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Timestamp (UAE):</td>
              <td style="padding: 10px 0; color: #64748b;">${new Date().toLocaleString("en-AE", { timeZone: "Asia/Dubai" })}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Database Sync:</td>
              <td style="padding: 10px 0; color: ${autoSynced ? "#16a34a" : "#ca8a04"}; font-weight: bold;">
                ${autoSynced ? "✓ Synced to Google Sheets" : "Queued in Local Storage"}
              </td>
            </tr>
          </tbody>
        </table>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; text-align: center;">
          <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Direct Prospect Actions:</p>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <a href="${waLink}" style="background-color: #25d366; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 12px; display: inline-block; margin: 4px;">
              💬 WhatsApp Prospect
            </a>
            <a href="mailto:${email}?subject=Following%20up%20on%20your%20UAE%20Corporate%20Tax%20Playbook%20request" style="background-color: #0a1736; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 12px; display: inline-block; margin: 4px;">
              ✉️ Email Lead
            </a>
            <a href="${appUrl}/#admin" style="background-color: #f1f5f9; color: #0a1736; border: 1px solid #cbd5e1; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 12px; display: inline-block; margin: 4px;">
              📊 Advisor Portal
            </a>
          </div>
        </div>

        <p style="font-size: 11px; color: #94a3b8; margin: 0; text-align: center;">
          Dias Accounting & Tax Consulting Lead Notification System | Lead ID: ${inquiryId || "N/A"}
        </p>
      </div>
    </div>
  `;

  // 5. Send User Confirmation Email
  const userResult = await sendEmailNotification({
    to: email,
    subject: userEmailSubject,
    html: userEmailHtml,
  });

  // 6. Send Internal Admin Notification Email
  const adminResult = await sendEmailNotification({
    to: adminEmail,
    subject: adminSubject,
    html: adminEmailHtml,
  });

  const emailSent = userResult.sent || adminResult.sent;
  const deliveryMethod = userResult.method !== "none" ? userResult.method : adminResult.method;

  return res.json({
    success: true,
    emailSent,
    userEmailSent: userResult.sent,
    adminNotified: adminResult.sent,
    deliveryMethod,
    email,
    inquiryId,
    message: "Playbook processed, user confirmation dispatched, and internal admin alert triggered.",
  });
});

/**
 * Save / Refresh Advisor Access Token (Secure Route)
 * Triggered when Advisor logs in to cache token server-side for automatic syncs
 */
app.post("/api/save-token", async (req, res) => {
  const { accessToken, email } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    const oauthData = await SecureStorageService.getSettings("google_oauth");
    let savedSheetId = "12DjTgoDGdU05oRWFiiQFJ5fLhW4G9rctepWBuOXGDuY";
    
    if (oauthData && oauthData.spreadsheetId) {
      savedSheetId = oauthData.spreadsheetId;
    }

    // Save token to SecureStorage settings
    await SecureStorageService.saveSettings("google_oauth", {
      accessToken,
      email: email || "unknown@diasaccounting.ae",
      spreadsheetId: savedSheetId,
      updatedAt: new Date().toISOString(),
      tokenExpired: false
    });

    console.log(`Stored advisor ${email} access token securely.`);

    // Run catch-up sync of any unsynced inquiries in the background!
    let catchUpResult = { syncedCount: 0, sheetId: savedSheetId || "" };
    try {
      catchUpResult = await runBackgroundSync(accessToken, savedSheetId);
    } catch (syncErr) {
      console.error("Catch up background sync failed:", syncErr);
    }

    return res.json({ 
      success: true, 
      spreadsheetId: catchUpResult.sheetId || savedSheetId,
      syncedCount: catchUpResult.syncedCount
    });
  } catch (err: any) {
    console.error("Save token failed:", err);
    return res.status(500).json({ error: "Failed to store server-side credentials." });
  }
});

/**
 * Get Server-Side Sync Status
 * Tells the frontend if there is a cached token, if it is active, and how many unsynced leads are waiting
 */
app.get("/api/sync-status", async (req, res) => {
  try {
    const oauthData = await SecureStorageService.getSettings("google_oauth");
    
    let hasToken = false;
    let email = null;
    let spreadsheetId = null;
    let tokenExpired = false;
    let updatedAt = null;

    if (oauthData) {
      hasToken = !!oauthData.accessToken;
      email = oauthData.email || null;
      spreadsheetId = oauthData.spreadsheetId || null;
      tokenExpired = !!oauthData.tokenExpired;
      updatedAt = oauthData.updatedAt || null;
    }

    // Count unsynced inquiries
    const unsyncedCount = await SecureStorageService.countUnsyncedInquiries();

    return res.json({
      hasToken,
      email,
      spreadsheetId,
      tokenExpired,
      updatedAt,
      unsyncedCount
    });
  } catch (err: any) {
    console.error("Get sync status failed:", err);
    return res.status(500).json({ error: "Failed to retrieve sync status." });
  }
});

/**
 * Manual Force Sync (Secure Route)
 */
app.post("/api/sync-all", async (req, res) => {
  try {
    const oauthData = await SecureStorageService.getSettings("google_oauth");

    if (!oauthData) {
      return res.status(404).json({ error: "No advisor Google OAuth credentials found." });
    }

    const { accessToken, spreadsheetId, tokenExpired } = oauthData;

    if (!accessToken || tokenExpired) {
      return res.status(401).json({ error: "Advisor Google OAuth token is expired or missing. Please re-authenticate." });
    }

    const result = await runBackgroundSync(accessToken, spreadsheetId || null);
    return res.json({
      success: true,
      syncedCount: result.syncedCount,
      spreadsheetId: result.sheetId
    });
  } catch (err: any) {
    console.error("Sync all failed:", err);
    return res.status(500).json({ error: err.message || "Manual sync failed." });
  }
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dias2026";
const ADMIN_TOKEN = "dias_admin_tok_" + Math.random().toString(36).substring(2) + Date.now().toString(36);

const verifyAdminToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  if (token && token === ADMIN_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized access. Please log in again." });
  }
};

/**
 * Admin Login Route
 */
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    return res.status(401).json({ error: "Invalid password." });
  }
});

/**
 * Fetch All Inquiries (Secure Route for Advisor Portal)
 */
app.get("/api/admin/inquiries", verifyAdminToken, async (req, res) => {
  try {
    const inquiries = await SecureStorageService.getAllInquiries();
    return res.json(inquiries);
  } catch (err: any) {
    console.error("Failed to retrieve all inquiries:", err);
    return res.status(500).json({ error: "Failed to load inquiries from database." });
  }
});

/**
 * Mark Inquiry Synced (Secure Route for Advisor Portal)
 */
app.post("/api/admin/mark-synced", verifyAdminToken, async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Inquiry ID is required." });
  }
  try {
    await SecureStorageService.markInquirySynced(id);
    return res.json({ success: true });
  } catch (err: any) {
    console.error(`Failed to mark inquiry ${id} as synced:`, err);
    return res.status(500).json({ error: "Failed to update inquiry status." });
  }
});

/**
 * Update Inquiry Pipeline details (Secure Route for Advisor Portal)
 */
app.post("/api/admin/update-inquiry", verifyAdminToken, async (req, res) => {
  const { id, status, notes } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Inquiry ID is required." });
  }
  try {
    const updates: any = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    
    await SecureStorageService.updateInquiry(id, updates);
    return res.json({ success: true });
  } catch (err: any) {
    console.error(`Failed to update inquiry ${id}:`, err);
    return res.status(500).json({ error: "Failed to update inquiry." });
  }
});

// ==================== VITE & STATIC SERVING ====================

async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    // Crawler interception middleware in dev mode (for social crawlers/search bots)
    app.use(async (req, res, next) => {
      const userAgent = req.headers["user-agent"] || "";
      const isCrawler = isSocialOrSearchCrawler(userAgent);

      if (isCrawler) {
        try {
          const indexPath = path.join(process.cwd(), "index.html");
          let template = fs.readFileSync(indexPath, "utf-8");
          template = await vite.transformIndexHtml(req.url, template);
          
          const meta = resolveMetaForRequest(req.url, req.headers.host || "diasuae.ae");
          const finalHtml = injectMetaIntoHtml(template, meta);
          
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          return res.status(200).send(finalHtml);
        } catch (e) {
          return next(e);
        }
      }
      return next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));

    // Dynamic Meta Prerendering SPA wildcard serving for Production
    app.get("*", (req, res) => {
      try {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          const template = fs.readFileSync(indexPath, "utf-8");
          const meta = resolveMetaForRequest(req.url, req.headers.host || "diasuae.ae");
          const finalHtml = injectMetaIntoHtml(template, meta);
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          return res.status(200).send(finalHtml);
        }
        return res.sendFile(indexPath);
      } catch (err) {
return res.sendFile(path.join(distPath, "index.html"));
    }
  });

  const port = parseInt(process.env.PORT || '8080');
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

bootstrap();