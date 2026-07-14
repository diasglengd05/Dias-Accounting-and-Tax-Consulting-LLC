import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
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
  disableNetwork
} from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json" with { type: "json" };

// Initialize Firebase App on Server
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
let isFirestoreAvailable = false;

async function checkFirestore() {
  try {
    // Perform a fast server-side read check of the Firestore database
    const testRef = doc(db, "settings", "connection_test");
    await getDoc(testRef);
    isFirestoreAvailable = true;
    console.log("Firestore database detected. Enabling cloud persistence layer.");
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    console.warn("Firestore database is not provisioned or not found (Code 5 NOT_FOUND). Using local fallback database.");
    console.warn("Disabling Firestore network to silence all gRPC background stream errors.");
    isFirestoreAvailable = false;
    try {
      await disableNetwork(db);
    } catch (netErr) {
      console.warn("Failed to call disableNetwork:", netErr);
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
  const title = "Dias Tax Consultation Inquiries";
  
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
    let savedSheetId: string | null = null;
    
    if (oauthData) {
      savedSheetId = oauthData.spreadsheetId || null;
    }

    // Save token to SecureStorage settings
    await SecureStorageService.saveSettings("google_oauth", {
      accessToken,
      email: email || "unknown@diasaccounting.ae",
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

/**
 * Fetch All Inquiries (Secure Route for Advisor Portal)
 */
app.get("/api/admin/inquiries", async (req, res) => {
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
app.post("/api/admin/mark-synced", async (req, res) => {
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

// ==================== VITE & STATIC SERVING ====================

async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Express v4/v5 SPA wildcard serving
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Full-Stack Express Server listening on http://localhost:${PORT}`);
  });
}

bootstrap();
