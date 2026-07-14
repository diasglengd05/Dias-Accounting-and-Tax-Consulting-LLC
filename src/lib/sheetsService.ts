/**
 * Google Sheets Service for appending consultation inquiries.
 */

export interface InquiryData {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceType: string;
}

/**
 * Maps standard service IDs to readable, professional display names.
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
 * Searches the user's Google Drive for a spreadsheet named "Dias Tax Consultation Inquiries".
 * If not found, creates one and sets up the header row.
 * Returns the spreadsheet ID.
 */
export async function findOrCreateSpreadsheet(accessToken: string): Promise<string> {
  const targetId = "12DjTgoDGdU05oRWFiiQFJ5fLhW4G9rctepWBuOXGDuY";
  const title = "Dias Tax Consultation Inquiries";
  
  // 1. Verify and use the user's specific spreadsheet ID first
  try {
    const verifyRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${targetId}?fields=spreadsheetId`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (verifyRes.ok) {
      localStorage.setItem("dias_tax_sheet_id", targetId);
      return targetId;
    }
  } catch (err) {
    console.warn("Verification of user's target spreadsheet failed:", err);
  }

  // 2. Check local storage cache next
  const cachedId = localStorage.getItem("dias_tax_sheet_id");
  if (cachedId) {
    // Quickly verify if this ID is valid by making a metadata fetch
    try {
      const verifyRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${cachedId}?fields=spreadsheetId`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (verifyRes.ok) {
        return cachedId;
      }
    } catch {
      localStorage.removeItem("dias_tax_sheet_id");
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
        localStorage.setItem("dias_tax_sheet_id", id);
        return id;
      }
    }
  } catch (err) {
    console.error("Error searching spreadsheet in Google Drive:", err);
  }

  // Create a brand new Google Sheet
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
  localStorage.setItem("dias_tax_sheet_id", spreadsheetId);

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
 * Appends a new inquiry row to the Google Sheet.
 */
export async function appendInquiryRow(
  accessToken: string,
  spreadsheetId: string,
  data: InquiryData
) {
  // Use Dubai local time since the consultant is based in UAE (GST)
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Dubai",
    dateStyle: "medium",
    timeStyle: "medium"
  }) + " (GST)";

  const row = [
    timestamp,
    data.name,
    data.email,
    data.phone,
    data.company || "N/A",
    getServiceDisplayName(data.serviceType),
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
    const errorJson = await appendRes.ok ? {} : await appendRes.json();
    throw new Error(`Failed to append lead to Google Sheet: ${errorJson.error?.message || appendRes.statusText}`);
  }

  return await appendRes.json();
}

export interface DirectSyncPayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
  serviceType?: string;
}

/**
 * Resilient, multi-format direct sync to Google Sheets via Google Apps Script Web App.
 * Maps keys to all possible parameter formats (lowercase, CamelCase, and Spreadsheet Header names)
 * and passes them via BOTH URL query parameters and URL-encoded body, ensuring compatibility with
 * any deployed Apps Script configuration.
 */
export async function submitToGoogleSheetsDirectly(data: DirectSyncPayload): Promise<boolean> {
  const scriptUrl = (import.meta as any).env?.VITE_GOOGLE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbxDT7lUBPQAEsAJsEzSMbUq_abKJL9FWRMZya6_r-R22P5L5RfnqH39bOlh18bjouIG/exec";
  
  if (!scriptUrl) {
    console.error("Google Apps Script URL is empty.");
    return false;
  }

  // Use local Dubai Time (GST) for timezone alignment
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Dubai",
    dateStyle: "medium",
    timeStyle: "medium"
  }) + " (GST)";

  const spreadsheetId = "12DjTgoDGdU05oRWFiiQFJ5fLhW4G9rctepWBuOXGDuY";
  const name = data.name;
  const email = data.email;
  const phone = data.phone;
  const company = data.company || "N/A";
  const message = data.message || "N/A";
  const serviceType = data.serviceType || "general";

  // Build key-value mapping of ALL possible parameter variations that the sheet-sync script could expect
  const params: Record<string, string> = {
    // 1. Standard lower-case fields
    timestamp,
    name,
    email,
    phone,
    company,
    message,
    serviceType,
    spreadsheetId,

    // 2. Title/CamelCase variants
    Timestamp: timestamp,
    Name: name,
    Email: email,
    Phone: phone,
    Company: company,
    Message: message,
    ServiceType: serviceType,
    SpreadsheetId: spreadsheetId,

    // 3. Expanded/Alternate names (e.g. from standard form-to-sheets tutorials)
    fullName: name,
    "Full Name": name,
    Full_Name: name,
    workEmail: email,
    "Work Email": email,
    Work_Email: email,
    mobileNumber: phone,
    "Mobile Number": phone,
    Mobile_Number: phone,
    companyName: company,
    "Company Name": company,
    Company_Name: company,
    serviceInterest: serviceType,
    "Service Interest": serviceType,
    Service_Interest: serviceType,
    notes: message,
    Notes: message,
    comments: message,
    Comments: message,
  };

  // Build the URL containing all keys as query parameters (highly compatible with many Apps Script doGet/doPost)
  const urlObj = new URL(scriptUrl);
  Object.entries(params).forEach(([key, val]) => {
    urlObj.searchParams.append(key, val);
  });

  // Also build the URLSearchParams body (highly compatible with traditional x-www-form-urlencoded doPost e.parameter)
  const bodyData = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    bodyData.append(key, val);
  });

  console.log(`Submitting direct Sheet synchronization (single-request mode to prevent duplicates)...`);

  try {
    // We send a single POST request with mode: "no-cors" to avoid CORS blocks and preflight checks
    await fetch(urlObj.toString(), {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: bodyData
    });

    console.log("Direct Google Sheets synchronization request sent successfully.");
    return true;
  } catch (error) {
    console.error("Direct Google Sheets sync request failed:", error);
    return false;
  }
}

