import React, { useState, useEffect } from "react";
import { 
  User as LucideUser, 
  Mail, 
  CheckCircle2, 
  Building, 
  HelpCircle, 
  ArrowRight, 
  Phone, 
  AlertCircle, 
  ExternalLink, 
  LogOut, 
  Lock, 
  RefreshCw, 
  Database, 
  FileSpreadsheet, 
  Users, 
  ChevronRight,
  Sparkles,
  Search,
  Check,
  Shield,
  Copy,
  Download,
  Settings,
  MessageSquare,
  Key,
  Code
} from "lucide-react";
import { User } from "firebase/auth";
import { initAuth, googleSignIn, logout, getAccessToken } from "../lib/firebase";
import { findOrCreateSpreadsheet, appendInquiryRow, InquiryData, submitToGoogleSheetsDirectly, GOOGLE_APPS_SCRIPT_TEMPLATE } from "../lib/sheetsService";
import { useLanguage } from "../i18n/LanguageContext";
import { validateContactForm, validateEmailField, validatePhoneField } from "../lib/validation";

interface SchedulerProps {
  preselectedService?: string;
}

interface InquiryRecord extends InquiryData {
  id: string;
  createdAt: string;
  synced: boolean;
  status: string;
}

export default function Scheduler({ preselectedService = "" }: SchedulerProps) {
  const { t, language, isRTL } = useLanguage();
  // Public Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [serviceType, setServiceType] = useState(preselectedService || "corporate-tax");
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPortal, setShowPortal] = useState(false);

  // Field validation states for client-side feedback
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
  }>({});

  const handleNameChange = (val: string) => {
    setName(val);
    if (touched.name) {
      setFieldErrors(prev => ({
        ...prev,
        name: val.trim() ? undefined : (language === "ar" ? "الاسم الكامل مطلوب" : "Full name is required.")
      }));
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (touched.email) {
      const res = validateEmailField(val, language === "ar" ? "ar" : "en");
      setFieldErrors(prev => ({
        ...prev,
        email: res.isValid ? undefined : res.error
      }));
    }
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (touched.phone) {
      const res = validatePhoneField(val, language === "ar" ? "ar" : "en");
      setFieldErrors(prev => ({
        ...prev,
        phone: res.isValid ? undefined : res.error
      }));
    }
  };

  const handleBlur = (field: "name" | "email" | "phone") => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === "name") {
      setFieldErrors(prev => ({
        ...prev,
        name: name.trim() ? undefined : (language === "ar" ? "الاسم الكامل مطلوب" : "Full name is required.")
      }));
    } else if (field === "email") {
      const res = validateEmailField(email, language === "ar" ? "ar" : "en");
      setFieldErrors(prev => ({ ...prev, email: res.isValid ? undefined : res.error }));
    } else if (field === "phone") {
      const res = validatePhoneField(phone, language === "ar" ? "ar" : "en");
      setFieldErrors(prev => ({ ...prev, phone: res.isValid ? undefined : res.error }));
    }
  };

  // Portal States (Only for the Owner/Advisor)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [portalInquiries, setPortalInquiries] = useState<InquiryRecord[]>([]);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const DEFAULT_SPREADSHEET_ID = "12DjTgoDGdU05oRWFiiQFJ5fLhW4G9rctepWBuOXGDuY";
  const [spreadsheetId, setSpreadsheetId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dias_tax_sheet_id") || DEFAULT_SPREADSHEET_ID;
    }
    return DEFAULT_SPREADSHEET_ID;
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingSheetId, setIsEditingSheetId] = useState(false);
  const [customSheetInput, setCustomSheetInput] = useState("");
  const [customAppsScriptInput, setCustomAppsScriptInput] = useState("");
  const [showAppsScriptGuide, setShowAppsScriptGuide] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [submissionSynced, setSubmissionSynced] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);
  const [syncingLeadId, setSyncingLeadId] = useState<string | null>(null);
  
  // State for server-side automatic background sync status
  const [serverSyncStatus, setServerSyncStatus] = useState<{
    hasToken: boolean;
    email: string | null;
    spreadsheetId: string | null;
    spreadsheetUrl?: string | null;
    tokenExpired: boolean;
    updatedAt: string | null;
    unsyncedCount: number;
    appsScriptUrl?: string | null;
  } | null>(null);

  // Sync serviceType when prop changes
  useEffect(() => {
    if (preselectedService) {
      setServiceType(preselectedService);
    }
  }, [preselectedService]);

  // Listen for Auth changes (for the Advisor Portal)
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        setIsAuthLoading(false);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
        setIsAuthLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Hidden triggers to open the Advisor Sheets Sync Workspace (kept secret from public)
  useEffect(() => {
    const checkHashOrQuery = () => {
      if (
        window.location.hash === "#admin" || 
        window.location.hash === "#portal" ||
        window.location.hash === "#inquiries" ||
        window.location.hash === "#inquiry-sheet" ||
        window.location.search.includes("admin=true") ||
        window.location.search.includes("portal=true") ||
        window.location.search.includes("sheet=true")
      ) {
        setShowPortal(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret key shortcut: Alt + A or Ctrl + Shift + A
      if ((e.altKey && e.key.toLowerCase() === "a") || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a")) {
        e.preventDefault();
        setShowPortal(true);
      }
    };

    checkHashOrQuery();
    window.addEventListener("hashchange", checkHashOrQuery);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("hashchange", checkHashOrQuery);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Fetch server-side sync status and sheet config
  const fetchServerSyncStatus = async () => {
    try {
      const res = await fetch("/api/sync-status");
      if (res.ok) {
        const data = await res.json();
        setServerSyncStatus(data);
        if (data.spreadsheetId) {
          setSpreadsheetId(data.spreadsheetId);
          localStorage.setItem("dias_tax_sheet_id", data.spreadsheetId);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch server-side sync status:", err);
    }
  };

  // Fetch inquiries from server when Advisor Portal is open
  const fetchPortalInquiries = async () => {
    setIsPortalLoading(true);
    setError(null);
    try {
      const records: InquiryRecord[] = [];
      
      // Load from server-side API (both /api/inquiries and /api/admin/inquiries)
      try {
        let response = await fetch("/api/inquiries");
        if (!response.ok) {
          response = await fetch("/api/admin/inquiries");
        }
        if (response.ok) {
          const resData = await response.json();
          const items = Array.isArray(resData) ? resData : (resData.inquiries || []);
          items.forEach((item: any) => {
            records.push({
              id: item.id || "",
              name: item.name || "",
              email: item.email || "",
              phone: item.phone || "",
              company: item.company || "",
              serviceType: item.serviceType || "",
              createdAt: item.createdAt || "",
              synced: !!item.synced,
              status: item.status || "New Lead"
            });
          });
        }
      } catch (apiErr) {
        console.warn("API inquiries fetch failed, using local fallback:", apiErr);
      }

      // Merge with any local submissions from localStorage to ensure absolutely zero data loss
      const localRaw = localStorage.getItem("dias_local_inquiries");
      if (localRaw) {
        const localItems = JSON.parse(localRaw) as InquiryRecord[];
        localItems.forEach((localItem) => {
          if (!records.some(r => r.email === localItem.email && r.createdAt === localItem.createdAt)) {
            records.unshift(localItem);
          }
        });
      }

      // Sort by creation time descending
      records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPortalInquiries(records);
    } catch (err: any) {
      console.error("Failed to load inquiries:", err);
      setError("Failed to fetch inquiries. Please check your network connection.");
    } finally {
      setIsPortalLoading(false);
    }
  };

  // Trigger inquiry load on mount and when Portal is opened or user logs in
  useEffect(() => {
    fetchPortalInquiries();
    fetchServerSyncStatus();
    // Also check if spreadsheet ID is in localStorage
    const savedSheetId = localStorage.getItem("dias_tax_sheet_id");
    if (savedSheetId) {
      setSpreadsheetId(savedSheetId);
    }
  }, [showPortal, currentUser]);

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const result = await googleSignIn();
      if (!result) {
        // User closed or dismissed the popup cleanly
        return null;
      }

      setCurrentUser(result.user);
      setAccessToken(result.accessToken);

      // Server-side integration: Cache advisor token for automated background sync
      try {
        const saveRes = await fetch("/api/save-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: result.accessToken,
            email: result.user.email
          })
        });
        const saveData = await saveRes.json();
        if (saveRes.ok) {
          console.log("Cached access token server-side successfully!");
          if (saveData.spreadsheetId) {
            setSpreadsheetId(saveData.spreadsheetId);
            localStorage.setItem("dias_tax_sheet_id", saveData.spreadsheetId);
          }
          if (saveData.syncedCount > 0) {
            setSyncMessage(`Authorized! Server automatically synced ${saveData.syncedCount} pending inquiry(s) to your Google Sheet.`);
          }
        }
      } catch (saveErr) {
        console.warn("Failed to cache token server-side:", saveErr);
      }

      await fetchPortalInquiries();
      await fetchServerSyncStatus();
      return result;
    } catch (err: any) {
      const code = err?.code || "";
      const msg = String(err?.message || err || "");
      if (
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request" ||
        msg.includes("popup-closed-by-user") ||
        msg.includes("cancelled-popup-request")
      ) {
        // User closed or dismissed popup cleanly - no error
        return null;
      }
      if (code === "auth/popup-blocked" || msg.includes("popup-blocked")) {
        setError("Sign-In popup was blocked by your browser. Please allow popups for this site.");
        return null;
      }
      console.warn("Sign-in notice:", msg);
      setError("Sign-in could not be completed. Please try again.");
      return null;
    }
  };

  const syncSingleInquiry = async (id: string) => {
    let token = accessToken;
    if (!token) {
      const authRes = await handleGoogleSignIn();
      if (!authRes) return;
      token = authRes.accessToken;
    }

    setSyncingLeadId(id);
    setSyncMessage("Syncing inquiry to Google Sheet...");
    try {
      const res = await fetch(`/api/inquiries/${id}/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ accessToken: token })
      });

      if (res.ok) {
        setSyncMessage("Inquiry successfully synced and recorded in Google Sheet!");
        setTimeout(() => setSyncMessage(null), 4000);
      } else {
        // Direct browser Sheets API fallback
        const targetLead = portalInquiries.find(l => l.id === id);
        if (targetLead) {
          const sheetId = await findOrCreateSpreadsheet(token);
          await appendInquiryRow(token, sheetId, {
            name: targetLead.name,
            email: targetLead.email,
            phone: targetLead.phone,
            company: targetLead.company,
            serviceType: targetLead.serviceType
          });
          await fetch("/api/admin/mark-synced", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
          }).catch(() => {});
          setSyncMessage("Inquiry successfully synced and recorded in Google Sheet!");
          setTimeout(() => setSyncMessage(null), 4000);
        }
      }
      await fetchPortalInquiries();
      await fetchServerSyncStatus();
    } catch (err: any) {
      console.error("Single lead sync failed:", err);
      setError("Failed to sync lead: " + (err.message || "Unknown error"));
    } finally {
      setSyncingLeadId(null);
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setAccessToken(null);
      setSpreadsheetId(null);
      localStorage.removeItem("dias_tax_sheet_id");
      await fetchServerSyncStatus();
    } catch (err) {
      console.error("Sign-out failed:", err);
    }
  };

  // Public Form Submission (No Login Required)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate fields client-side before proceeding
    const validation = validateContactForm(
      { name, email, phone },
      language === "ar" ? "ar" : "en"
    );

    setTouched({ name: true, email: true, phone: true });

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setError(
        validation.errors.email ||
        validation.errors.phone ||
        validation.errors.name ||
        t.contact.validationErrorAlert
      );

      // Focus first invalid field for better UX
      if (validation.errors.name) {
        document.getElementById("scheduler-name-input")?.focus();
      } else if (validation.errors.email) {
        document.getElementById("scheduler-email-input")?.focus();
      } else if (validation.errors.phone) {
        document.getElementById("scheduler-phone-input")?.focus();
      }
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setSubmissionSynced(false);
    console.log("Submitting consultation inquiry form...", { name, email, phone, company, serviceType });

    try {
      let activeToken = accessToken;
      if (!activeToken) {
        try {
          activeToken = await getAccessToken();
        } catch {}
      }

      let wasSynced = false;
      let recordedId = "local_" + Date.now();

      // 1. Submit to server-side API to record in database and trigger admin alerts
      try {
        const res = await fetch("/api/inquiries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {})
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            company: company || "N/A",
            serviceType: serviceType || "general",
            message: `Consultation Booked: ${getServiceLabel(serviceType)}`,
            accessToken: activeToken || undefined
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.inquiryId) recordedId = data.inquiryId;
          if (data.autoSynced) wasSynced = true;
        }
      } catch (backendErr) {
        console.warn("Server-side inquiry save warning:", backendErr);
      }

      // 2. Client-side Google Sheets REST sync if token is available and not yet marked synced
      if (activeToken && !wasSynced) {
        try {
          const sheetId = await findOrCreateSpreadsheet(activeToken);
          setSpreadsheetId(sheetId);
          await appendInquiryRow(activeToken, sheetId, {
            name,
            email,
            phone,
            company: company || "N/A",
            serviceType: serviceType || "general"
          });
          wasSynced = true;
          // Mark synced on server
          if (!recordedId.startsWith("local_")) {
            await fetch(`/api/inquiries/${recordedId}/sync`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${activeToken}`
              },
              body: JSON.stringify({ accessToken: activeToken })
            }).catch(() => {});
          }
        } catch (sheetsErr) {
          console.warn("Direct Google Sheets sync warning:", sheetsErr);
        }
      }

      // 3. Fallback direct Apps Script sync
      if (!wasSynced) {
        try {
          const directRes = await submitToGoogleSheetsDirectly({
            name,
            email,
            phone,
            company: company || "N/A",
            message: `Consultation Booked: ${getServiceLabel(serviceType)}`,
            serviceType: serviceType || "general"
          });
          if (directRes) wasSynced = true;
        } catch (directErr) {
          console.warn("Apps Script sync attempt note:", directErr);
        }
      }

      // Save to local storage as backup
      const localRaw = localStorage.getItem("dias_local_inquiries");
      const localList = localRaw ? JSON.parse(localRaw) : [];
      localList.unshift({ 
        id: recordedId, 
        name, 
        email, 
        phone, 
        company: company || "N/A", 
        serviceType, 
        createdAt: new Date().toISOString(), 
        synced: wasSynced,
        status: "New Lead"
      });
      localStorage.setItem("dias_local_inquiries", JSON.stringify(localList));

      setLastSubmittedId(recordedId);
      setSubmissionSynced(wasSynced);
      setIsSuccess(true);

      // Refresh inquiries and status
      fetchPortalInquiries();
      fetchServerSyncStatus();
    } catch (err: any) {
      console.error("Direct Google Sheets submission error:", err);
      setError("An error occurred while saving your inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Advisor Sync Action (Only available in Advisor Portal or Quick Bar)
  const syncToSheets = async () => {
    let activeToken = accessToken;
    if (!activeToken) {
      setSyncMessage("Connecting with Google to authorize Sheets write access...");
      const signInRes = await handleGoogleSignIn();
      if (!signInRes) {
        return;
      }
      activeToken = signInRes.accessToken;
    }

    setIsSyncing(true);
    setSyncMessage("Synchronizing inquiries with Google Sheets...");
    setError(null);

    try {
      let syncedCount = 0;

      // 1. Try server-side batch sync
      try {
        const syncRes = await fetch("/api/sync-all", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeToken}`
          },
          body: JSON.stringify({ accessToken: activeToken })
        });
        if (syncRes.ok) {
          const syncData = await syncRes.json();
          syncedCount = syncData.syncedCount || 0;
          if (syncData.spreadsheetId) {
            setSpreadsheetId(syncData.spreadsheetId);
          }
        }
      } catch (err) {
        console.warn("Server sync-all deferred to client:", err);
      }

      // 2. Client-side fallback: check unsynced records
      const sheetId = await findOrCreateSpreadsheet(activeToken);
      setSpreadsheetId(sheetId);

      const unsyncedLeads = portalInquiries.filter(lead => !lead.synced);
      for (const lead of unsyncedLeads) {
        try {
          await appendInquiryRow(activeToken, sheetId, {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            company: lead.company,
            serviceType: lead.serviceType
          });

          await fetch(`/api/inquiries/${lead.id}/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${activeToken}`
            },
            body: JSON.stringify({ accessToken: activeToken })
          }).catch(() => {});

          syncedCount++;
        } catch (leadErr) {
          console.warn(`Lead ${lead.name} sync note:`, leadErr);
        }
      }

      // Update local storage backup list to synced
      const localRaw = localStorage.getItem("dias_local_inquiries");
      if (localRaw) {
        const localList = JSON.parse(localRaw) as any[];
        const updatedLocalList = localList.map(item => ({ ...item, synced: true }));
        localStorage.setItem("dias_local_inquiries", JSON.stringify(updatedLocalList));
      }

      setSubmissionSynced(true);
      await fetchPortalInquiries();
      await fetchServerSyncStatus();
      setSyncMessage(`Successfully synced ${syncedCount > 0 ? syncedCount : "all"} inquiry(s) to your Google Sheet!`);
      setTimeout(() => setSyncMessage(null), 5000);
    } catch (err: any) {
      console.error("Sheets sync process failed:", err);
      setError(err?.message || "Sheets sync failed. Please check permissions and try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setFieldErrors({});
    setTouched({});
    setError(null);
  };

  const getServiceLabel = (type: string) => {
    if (language === "ar") {
      switch (type) {
        case "corporate-tax": return "استشارات ضريبة الشركات (الامتثال 9%)";
        case "corporate-tax-sbr":
        case "Corporate Tax SBR Filing (AED 500)":
          return "إقرار ضريبة الشركات (تسهيلات الأعمال الصغيرة SBR - 500 د.إ)";
        case "vat-compliance": return "الامتثال لضريبة القيمة المضافة والإقرارات";
        case "vat-return-filing":
        case "VAT Return Filing (AED 750/Qtr)":
          return "تقديم إقرار ضريبة القيمة المضافة (750 د.إ / ربع سنوي)";
        case "accounting": return "المحاسبة ومسك الدفاتر المنتظم";
        case "audit":
        case "Financial Audit Preparation & Scoping":
          return "تدقيق الحسابات والجاهزية المالية (عرض سعر مخصص)";
        case "incorporation": return "تأسيس الشركات وتراخيص المناطق الحرة";
        case "general": return "استشارة ضريبية ومحاسبية شاملة";
        default: return type;
      }
    }
    switch (type) {
      case "corporate-tax": return "Corporate Tax Advisory";
      case "corporate-tax-sbr":
      case "Corporate Tax SBR Filing (AED 500)":
        return "Corporate Tax SBR Filing (AED 500)";
      case "vat-compliance": return "VAT Compliance & Audits";
      case "vat-return-filing":
      case "VAT Return Filing (AED 750/Qtr)":
        return "VAT Return Filing (AED 750/Qtr)";
      case "accounting": return "Accounting & Bookkeeping";
      case "audit":
      case "Financial Audit Preparation & Scoping":
        return "Financial Audit Scoping & Readiness";
      case "incorporation": return "Business Setup & Licensing";
      case "general": return "Comprehensive Package";
      default: return type;
    }
  };

  const spreadsheetUrl = spreadsheetId 
    ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
    : `https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/edit`;

  const handleCopySheetLink = () => {
    navigator.clipboard.writeText(spreadsheetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadCsv = () => {
    window.open("/api/inquiries/export-csv", "_blank");
  };

  const handleCopyAppsScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleSaveCustomSheet = async () => {
    if (!customSheetInput.trim() && !customAppsScriptInput.trim()) return;
    try {
      const bodyPayload: any = {};
      if (customSheetInput.trim()) bodyPayload.spreadsheetUrl = customSheetInput.trim();
      if (customAppsScriptInput.trim()) bodyPayload.appsScriptUrl = customAppsScriptInput.trim();

      const res = await fetch("/api/sheet-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.spreadsheetId) {
          setSpreadsheetId(data.spreadsheetId);
          localStorage.setItem("dias_tax_sheet_id", data.spreadsheetId);
        }
        setIsEditingSheetId(false);
        setCustomSheetInput("");
        setCustomAppsScriptInput("");
        setSyncMessage("Configuration updated successfully!");
        setTimeout(() => setSyncMessage(null), 3000);
        await fetchServerSyncStatus();
      }
    } catch (err) {
      console.warn("Failed to update custom sheet:", err);
    }
  };

  const filteredInquiries = portalInquiries.filter(lead => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (lead.name && lead.name.toLowerCase().includes(term)) ||
      (lead.email && lead.email.toLowerCase().includes(term)) ||
      (lead.phone && lead.phone.toLowerCase().includes(term)) ||
      (lead.company && lead.company.toLowerCase().includes(term)) ||
      (lead.serviceType && lead.serviceType.toLowerCase().includes(term))
    );
  });

  return (
    <div id="scheduler-portal-container" className="space-y-4">
      
      {/* 1. ADVISOR PORTAL MODAL/OVERLAY */}
      {showPortal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Portal Header */}
            <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 px-6 py-5 flex items-center justify-between text-white border-b border-navy-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight flex items-center gap-2">
                    <span>Advisor Inquiry Sheet &amp; Leads Hub</span>
                    <span className="text-[10px] bg-gold-500/20 text-gold-300 font-mono px-2 py-0.5 rounded-full border border-gold-500/30">
                      Live
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300 font-mono">
                    Dias Tax Practice • Glen Dias (FTA Registered Tax Agent)
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setShowPortal(false);
                  setError(null);
                  setSyncMessage(null);
                }}
                className="text-slate-400 hover:text-white transition-colors p-2 text-sm font-semibold hover:bg-white/10 rounded-xl cursor-pointer"
              >
                Close Hub
              </button>
            </div>

            {/* Portal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">

              {/* Top Banner: Direct Access to Google Sheet */}
              <div className="bg-gradient-to-r from-emerald-900/90 via-slate-900 to-navy-950 text-white rounded-2xl p-5 border border-emerald-500/30 shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                        Primary Client Inquiries Spreadsheet
                      </span>
                    </div>
                    <h4 className="font-display text-base font-bold text-white">
                      Dias Tax Consultation Inquiries (Google Sheets)
                    </h4>
                    <p className="text-xs text-slate-300 max-w-xl font-mono truncate">
                      ID: {spreadsheetId}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                    <a
                      href={spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      referrerPolicy="no-referrer"
                      className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-display font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Open Live Google Sheet</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={handleCopySheetLink}
                      className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      title="Copy spreadsheet link to clipboard"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-300">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-300" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleDownloadCsv}
                      className="inline-flex items-center gap-1.5 bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-400/30 py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      title="Download inquiries directly as CSV for Excel/Numbers"
                    >
                      <Download className="w-4 h-4 text-gold-400" />
                      <span>Export CSV</span>
                    </button>

                    <button
                      onClick={() => setIsEditingSheetId(prev => !prev)}
                      className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      title="Change or connect custom sheet ID"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Config</span>
                    </button>
                  </div>
                </div>

                {/* Optional Custom Sheet ID & Webhook Config Editor */}
                {isEditingSheetId && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-300 font-semibold block">
                        Target Google Spreadsheet URL or ID:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. https://docs.google.com/spreadsheets/d/12DjTgoDGdU05oRWFiiQFJ5fLhW4G9rctepWBuOXGDuY/edit"
                          value={customSheetInput}
                          onChange={(e) => setCustomSheetInput(e.target.value)}
                          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-300 font-semibold block">
                          Optional: Direct Google Apps Script Webhook URL (For zero-login public sync):
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowAppsScriptGuide(prev => !prev)}
                          className="text-[11px] text-gold-400 hover:text-gold-300 underline cursor-pointer inline-flex items-center gap-1"
                        >
                          <Code className="w-3 h-3" />
                          {showAppsScriptGuide ? "Hide Script Guide" : "Get 1-Minute Setup Code"}
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="https://script.google.com/macros/s/.../exec"
                        value={customAppsScriptInput}
                        onChange={(e) => setCustomAppsScriptInput(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                      />
                    </div>

                    {showAppsScriptGuide && (
                      <div className="bg-slate-950/80 border border-gold-500/30 rounded-xl p-3.5 space-y-2 text-xs text-slate-200">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="font-bold text-gold-400">Zero-Login Google Sheet Webhook Code:</span>
                          <button
                            type="button"
                            onClick={handleCopyAppsScript}
                            className="bg-gold-500 hover:bg-gold-400 text-navy-950 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedScript ? "Copied!" : "Copy Code"}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          <strong>3 Easy Steps:</strong> 1. Open your Google Sheet &gt; Extensions &gt; Apps Script. 2. Replace code with the copied snippet and Save. 3. Click <em>Deploy &gt; New deployment &gt; Web app</em>, set <strong>Who has access: Anyone</strong>, deploy, and paste the URL above!
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => setIsEditingSheetId(false)}
                        className="bg-white/10 hover:bg-white/20 text-slate-300 px-3.5 py-2 rounded-xl text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCustomSheet}
                        className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-sm"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </div>
                )}

                {/* Google Sheet Permissions Notice */}
                <div className="mt-3.5 pt-3 border-t border-white/10 flex items-start gap-2 text-[11px] text-slate-300/90 leading-relaxed">
                  <Shield className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Google Drive Access Note:</strong> If Google Sheets displays <em>"You need access"</em>, verify you are logged into Google with the practice email (e.g. <code>diasglen.gd@gmail.com</code> or <code>info@diasuae.ae</code>), or set the Google Sheet permissions in Drive to <em>"Anyone with the link can edit"</em>. You can also export the CSV above to view all data instantly without Google login.
                  </p>
                </div>
              </div>

              {/* Status and Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Metric 1: Total Inquiries */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center shrink-0 border border-gold-100">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Inquiries</p>
                    <h5 className="text-xl font-bold text-navy-950 font-display">{portalInquiries.length}</h5>
                  </div>
                </div>

                {/* Metric 2: Pending Sync */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                    <RefreshCw className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pending Sheets Sync</p>
                    <h5 className="text-xl font-bold text-navy-950 font-display">
                      {portalInquiries.filter(l => !l.synced).length}
                    </h5>
                  </div>
                </div>

                {/* Metric 3: Sync Actions */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col justify-center gap-2">
                  {currentUser ? (
                    <button
                      onClick={syncToSheets}
                      disabled={isSyncing}
                      className="w-full bg-navy-900 hover:bg-navy-950 text-white rounded-xl py-2 px-3 flex items-center justify-center gap-2 font-display font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSyncing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-gold-400" />
                      )}
                      Sync to Google Sheet Now
                    </button>
                  ) : (
                    <button
                      onClick={handleGoogleSignIn}
                      className="w-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all cursor-pointer"
                    >
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-3.5 h-3.5 shrink-0">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                      <span>Authorize Google Sync</span>
                    </button>
                  )}
                  {currentUser && (
                    <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                      <span className="truncate max-w-[140px] font-medium">{currentUser.email}</span>
                      <button onClick={handleDisconnect} className="text-rose-600 hover:underline cursor-pointer">
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Operational Status / Sync Messaging */}
              {syncMessage && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3.5 rounded-xl flex items-center gap-2.5 font-medium animate-pulse">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{syncMessage}</span>
                </div>
              )}

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs p-3.5 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {/* Leads Data Table with Live Filter */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="px-5 py-4 bg-slate-50/60 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-navy-800" />
                    <h5 className="font-display font-bold text-navy-950 text-xs">
                      Live Inquiries Log ({filteredInquiries.length})
                    </h5>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search by name, email, company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
                      />
                    </div>

                    <button 
                      onClick={fetchPortalInquiries} 
                      disabled={isPortalLoading}
                      className="text-xs font-bold text-gold-600 hover:text-gold-700 bg-gold-50 border border-gold-200/60 rounded-xl px-3 py-1.5 cursor-pointer whitespace-nowrap"
                    >
                      {isPortalLoading ? "Refreshing..." : "Refresh"}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {filteredInquiries.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-xs space-y-2">
                      <p>No inquiries found matching your filter criteria.</p>
                      <p className="text-[11px] text-slate-400">
                        Total stored inquiries: {portalInquiries.length}
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-3">Client Details</th>
                          <th className="px-5 py-3">Service Interest</th>
                          <th className="px-5 py-3">Submission (GST)</th>
                          <th className="px-5 py-3 text-center">Sync Status</th>
                          <th className="px-5 py-3 text-right">Direct Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredInquiries.map((lead) => {
                          const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, "") : "";
                          const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : "";
                          return (
                            <tr key={lead.id || `${lead.email}_${lead.createdAt}`} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-5 py-3.5 space-y-0.5">
                                <div className="font-bold text-navy-950">{lead.name}</div>
                                <div className="text-[10px] text-slate-400">{lead.email} • {lead.phone}</div>
                                {lead.company && lead.company !== "N/A" && (
                                  <div className="text-[10px] text-slate-500 font-medium">🏢 {lead.company}</div>
                                )}
                              </td>
                              <td className="px-5 py-3.5 font-medium text-navy-900">
                                {getServiceLabel(lead.serviceType)}
                              </td>
                              <td className="px-5 py-3.5 text-slate-400 font-mono text-[10px]">
                                {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("en-AE", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  timeZone: "Asia/Dubai"
                                }) : "N/A"} GST
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                {lead.synced ? (
                                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
                                    <Check className="w-3 h-3" />
                                    Synced
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-100">
                                    <RefreshCw className="w-3 h-3 animate-spin-slow text-amber-600" />
                                    Pending Sync
                                  </span>
                                )}
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  {!lead.synced && (
                                    <button
                                      type="button"
                                      onClick={() => syncSingleInquiry(lead.id)}
                                      disabled={syncingLeadId === lead.id || isSyncing}
                                      className="p-1.5 bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold rounded-lg text-[10px] inline-flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                                      title="Sync this inquiry immediately to Google Sheet"
                                    >
                                      {syncingLeadId === lead.id ? (
                                        <div className="w-2.5 h-2.5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <Sparkles className="w-2.5 h-2.5" />
                                      )}
                                      <span>Sync</span>
                                    </button>
                                  )}
                                  {waUrl && (
                                    <a
                                      href={waUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[10px] font-bold transition-colors"
                                      title="WhatsApp prospect"
                                    >
                                      WhatsApp
                                    </a>
                                  )}
                                  <a
                                    href={`mailto:${lead.email}?subject=Consultation%20Inquiry%20-%20Dias%20Accounting`}
                                    className="p-1.5 bg-navy-50 text-navy-800 hover:bg-navy-100 rounded-lg text-[10px] font-bold transition-colors"
                                    title="Email prospect"
                                  >
                                    Email
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      {/* PUBLIC INQUIRY FORM */}
      <div id="lead-form-container" className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden transition-all hover:shadow-2xl">
        {isSuccess ? (
          <div className="p-8 md:p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h4 className="font-display text-2xl font-bold text-navy-950">{t.contact.successTitle}</h4>
              <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                {t.contact.successMessage}
              </p>
            </div>

            <div className="max-w-md mx-auto bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-3">
              {/* Only show sync controls if admin session */}
              {(currentUser || (typeof window !== "undefined" && (window.location.search.includes("admin=true") || window.location.hash.includes("admin") || window.location.hash.includes("portal")))) && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/60 pb-2 text-xs gap-2">
                  <span className="text-slate-500 font-medium">{language === "ar" ? "حالة المزامنة مع Google Sheets:" : "Google Sheet Sync Status:"}</span>
                  {submissionSynced ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
                      <Check className="w-3 h-3 text-emerald-600" /> {language === "ar" ? "تمت المزامنة مع الشيت بنجاح" : "Synced to Google Sheet"}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-200">
                        <RefreshCw className="w-2.5 h-2.5 animate-spin-slow text-amber-600" />
                        {language === "ar" ? "مسجل وبانتظار المزامنة" : "Saved • Pending Sheets Sync"}
                      </span>
                      <button
                        type="button"
                        onClick={syncToSheets}
                        disabled={isSyncing}
                        className="bg-navy-900 hover:bg-navy-950 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-gold-400" />
                        {language === "ar" ? "مزامنة للشيت الآن" : "Sync to Sheet Now"}
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 text-xs">
                <span className="text-slate-500 font-medium">{t.contact.fullNameLabel}:</span>
                <span className="font-bold text-navy-950">{name}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 text-xs">
                <span className="text-slate-500 font-medium">{t.contact.emailLabel}:</span>
                <span className="font-bold text-navy-950">{email}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{t.contact.serviceLabel}:</span>
                <span className="font-bold text-gold-600">
                  {getServiceLabel(serviceType)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {(currentUser || (typeof window !== "undefined" && (window.location.search.includes("admin=true") || window.location.hash.includes("admin") || window.location.hash.includes("portal")))) && (
                <a
                  href={spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-display font-bold text-xs py-2 px-3.5 rounded-xl transition-all cursor-pointer hover:bg-emerald-100"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Open Google Sheet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <button
                onClick={resetForm}
                className="text-slate-500 hover:text-navy-900 font-display font-bold text-xs underline cursor-pointer px-4 py-2"
              >
                {language === "ar" ? "إرسال استفسار آخر" : "Submit another inquiry"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="p-6 md:p-8 space-y-6">
            
            {/* Header Section */}
            <div className="space-y-1.5 border-b border-slate-100 pb-4">
              <span className="text-[10px] text-gold-600 font-bold uppercase tracking-widest block">{t.contact.badge}</span>
              <h4 className="font-display text-xl font-bold text-navy-950">{t.contact.formTitle}</h4>
              <p className="text-slate-500 text-xs">
                {t.contact.subtitle}
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name & Email row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="scheduler-name-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <LucideUser className="w-3.5 h-3.5 text-slate-500" />
                      {t.contact.fullNameLabel} *
                    </span>
                    {touched.name && !fieldErrors.name && name.trim() && (
                      <span className="text-[10px] text-emerald-600 font-semibold inline-flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </label>
                  <input
                    id="scheduler-name-input"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-invalid={touched.name && !!fieldErrors.name}
                    aria-describedby={touched.name && fieldErrors.name ? "scheduler-name-error" : undefined}
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className={`w-full px-4 py-2.5 text-xs border rounded-xl outline-none transition-all ${
                      touched.name && fieldErrors.name
                        ? "border-rose-400 bg-rose-50/20 text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-400"
                        : touched.name && name.trim()
                        ? "border-emerald-300 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
                        : "border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-gold-500"
                    }`}
                    placeholder={t.contact.fullNamePlaceholder}
                  />
                  {touched.name && fieldErrors.name && (
                    <p id="scheduler-name-error" className="mt-1.5 text-[11px] font-medium text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="scheduler-email-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {t.contact.emailLabel} *
                    </span>
                    {touched.email && !fieldErrors.email && email.trim() && (
                      <span className="text-[10px] text-emerald-600 font-semibold inline-flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> {language === "ar" ? "صالح" : "Valid"}
                      </span>
                    )}
                  </label>
                  <input
                    id="scheduler-email-input"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-invalid={touched.email && !!fieldErrors.email}
                    aria-describedby={touched.email && fieldErrors.email ? "scheduler-email-error" : undefined}
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={`w-full px-4 py-2.5 text-xs border rounded-xl outline-none transition-all ${
                      touched.email && fieldErrors.email
                        ? "border-rose-400 bg-rose-50/20 text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-400"
                        : touched.email && !fieldErrors.email && email.trim()
                        ? "border-emerald-300 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
                        : "border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-gold-500"
                    }`}
                    placeholder={t.contact.emailPlaceholder}
                  />
                  {touched.email && fieldErrors.email && (
                    <p id="scheduler-email-error" className="mt-1.5 text-[11px] font-medium text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.email}</span>
                    </p>
                  )}
                  {touched.email && !fieldErrors.email && email.trim() && (
                    <p className="mt-1 text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3 shrink-0" />
                      <span>{language === "ar" ? "صيغة بريد إلكتروني صالحة" : "Valid email format"}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Phone & Company row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="scheduler-phone-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {t.contact.phoneLabel} *
                    </span>
                    {touched.phone && !fieldErrors.phone && phone.trim() && (
                      <span className="text-[10px] text-emerald-600 font-semibold inline-flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> {language === "ar" ? "صالح" : "Valid"}
                      </span>
                    )}
                  </label>
                  <input
                    id="scheduler-phone-input"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    aria-invalid={touched.phone && !!fieldErrors.phone}
                    aria-describedby={touched.phone && fieldErrors.phone ? "scheduler-phone-error" : undefined}
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    className={`w-full px-4 py-2.5 text-xs border rounded-xl outline-none transition-all ${
                      touched.phone && fieldErrors.phone
                        ? "border-rose-400 bg-rose-50/20 text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-400"
                        : touched.phone && !fieldErrors.phone && phone.trim()
                        ? "border-emerald-300 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
                        : "border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-gold-500"
                    }`}
                    placeholder={t.contact.phonePlaceholder}
                  />
                  {touched.phone && fieldErrors.phone && (
                    <p id="scheduler-phone-error" className="mt-1.5 text-[11px] font-medium text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.phone}</span>
                    </p>
                  )}
                  {touched.phone && !fieldErrors.phone && phone.trim() && (
                    <p className="mt-1 text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3 shrink-0" />
                      <span>{language === "ar" ? "رقم هاتف صحيح" : "Valid phone number format"}</span>
                    </p>
                  )}
                  {!touched.phone && (
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {language === "ar" ? "مثال: 4567 123 50 971+ أو 0501234567" : "e.g. +971 50 123 4567 or international with country code"}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="scheduler-company-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    {language === "ar" ? "اسم الشركة" : "Company Name"}
                  </label>
                  <input
                    id="scheduler-company-input"
                    name="organization"
                    type="text"
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                    placeholder={language === "ar" ? "مثال: شركتي ذ.م.م" : "e.g. My Company FZ-LLC"}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="scheduler-service-select" className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  {t.contact.serviceLabel} *
                </label>
                <select
                  id="scheduler-service-select"
                  name="serviceType"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 text-slate-700 focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none font-medium transition-all"
                >
                  <option value="corporate-tax">{language === "ar" ? "استشارات ضريبة الشركات (الامتثال بنسبة 9%)" : "Corporate Tax Advisory (9% compliance)"}</option>
                  <option value="Corporate Tax SBR Filing (AED 500)">{language === "ar" ? "إقرار ضريبة الشركات (تسهيلات الأعمال الصغيرة SBR - 500 د.إ)" : "Corporate Tax (SBR) Filing - AED 500"}</option>
                  <option value="VAT Return Filing (AED 750/Qtr)">{language === "ar" ? "تقديم إقرار ضريبة القيمة المضافة (750 د.إ / ربع سنوي)" : "VAT Return Filing - AED 750 / Quarter"}</option>
                  <option value="Financial Audit Preparation & Scoping">{language === "ar" ? "تدقيق الحسابات والجاهزية المالية (عرض سعر مخصص)" : "Audit Readiness & Liaison (Custom Quote)"}</option>
                  <option value="vat-compliance">{language === "ar" ? "الامتثال لضريبة القيمة المضافة والإقرارات" : "VAT Compliance, Audits & Filing"}</option>
                  <option value="accounting">{language === "ar" ? "المحاسبة ومسك الدفاتر المنتظم" : "Accounting, Bookkeeping & Backoffice"}</option>
                  <option value="incorporation">{language === "ar" ? "تأسيس الشركات والتراخيص والمناطق الحرة" : "Business Setup, Licensing & Freezones"}</option>
                  <option value="general">{language === "ar" ? "استشارة ضريبية ومحاسبية شاملة" : "Comprehensive Consultation Package"}</option>
                </select>
              </div>
            </div>

            {/* Feedback & Errors */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-navy-900 hover:bg-navy-950 text-white hover:text-gold-300 font-display font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{t.contact.submitBtn}</span>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>

    </div>
  );
}
