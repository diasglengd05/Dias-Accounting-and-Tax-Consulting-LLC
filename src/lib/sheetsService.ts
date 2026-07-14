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
  const title = "Dias Tax Consultation Inquiries";
  
  // Check local storage cache first to save network requests
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
    const errorJson = await appendRes.json();
    throw new Error(`Failed to append lead to Google Sheet: ${errorJson.error?.message || appendRes.statusText}`);
  }

  return await appendRes.json();
}
