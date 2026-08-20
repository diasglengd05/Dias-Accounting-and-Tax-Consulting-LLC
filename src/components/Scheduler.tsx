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
  Shield
} from "lucide-react";
import { User } from "firebase/auth";
import { initAuth, googleSignIn, logout } from "../lib/firebase";
import { findOrCreateSpreadsheet, appendInquiryRow, InquiryData, submitToGoogleSheetsDirectly } from "../lib/sheetsService";
import { useLanguage } from "../i18n/LanguageContext";

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

  // Portal States (Only for the Owner/Advisor)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [portalInquiries, setPortalInquiries] = useState<InquiryRecord[]>([]);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  
  // State for server-side automatic background sync status
  const [serverSyncStatus, setServerSyncStatus] = useState<{
    hasToken: boolean;
    email: string | null;
    spreadsheetId: string | null;
    tokenExpired: boolean;
    updatedAt: string | null;
    unsyncedCount: number;
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
        window.location.search.includes("admin=true") ||
        window.location.search.includes("portal=true")
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

  // Fetch server-side sync status
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
      
      // Load from server-side API
      try {
        const response = await fetch("/api/admin/inquiries");
        if (response.ok) {
          const data = await response.json();
          data.forEach((item: any) => {
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
        } else {
          throw new Error("Server inquiries log API returned non-200");
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

  // Trigger inquiry load when Portal is opened or user logs in
  useEffect(() => {
    if (showPortal) {
      fetchPortalInquiries();
      fetchServerSyncStatus();
    }
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
      if (result) {
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
      }
    } catch (err: any) {
      console.error("Sign-in failed:", err);
      if (err?.code === "auth/popup-closed-by-user") {
        setError("Google Sign-In popup was closed before completing.");
      } else if (err?.code === "auth/popup-blocked") {
        setError("Sign-In popup was blocked by your browser. Please allow popups.");
      } else {
        setError("Failed to authenticate with Google. Please try again.");
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setAccessToken(null);
      setSpreadsheetId(null);
      localStorage.removeItem("dias_tax_sheet_id");
    } catch (err) {
      console.error("Sign-out failed:", err);
    }
  };

  // Public Form Submission (No Login Required)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log("Submitting consultation inquiry form directly to Google Sheet...", { name, email, phone, company, serviceType });

    if (!name || !email || !phone) {
      console.warn("Form submission rejected: missing required fields", { name, email, phone });
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitToGoogleSheetsDirectly({
        name,
        email,
        phone,
        company: company || "N/A",
        message: `Consultation Booked: ${getServiceLabel(serviceType)}`,
        serviceType: serviceType || "general"
      });

      // Save to local storage as backup
      const localRaw = localStorage.getItem("dias_local_inquiries");
      const localList = localRaw ? JSON.parse(localRaw) : [];
      localList.push({ 
        id: "local_" + Date.now(), 
        name, 
        email, 
        phone, 
        company: company || "N/A", 
        serviceType, 
        createdAt: new Date().toISOString(), 
        synced: true,
        status: "New Lead"
      });
      localStorage.setItem("dias_local_inquiries", JSON.stringify(localList));

      setIsSuccess(true);
    } catch (err: any) {
      console.error("Direct Google Sheets submission error:", err);
      setError("An error occurred while saving your inquiry directly to Sheets. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Advisor Sync Action (Only available in Advisor Portal)
  const syncToSheets = async () => {
    if (!accessToken) {
      setError("Authorized Google access token is required to write to Sheets.");
      return;
    }

    setIsSyncing(true);
    setSyncMessage("Connecting to Google Sheets...");
    setError(null);

    try {
      // 1. Find or create the Google Sheet
      const sheetId = await findOrCreateSpreadsheet(accessToken);
      setSpreadsheetId(sheetId);

      // 2. Identify unsynced records
      const unsyncedLeads = portalInquiries.filter(lead => !lead.synced);
      if (unsyncedLeads.length === 0) {
        setSyncMessage("All inquiries are already fully synced to Google Sheets!");
        setIsSyncing(false);
        return;
      }

      setSyncMessage(`Syncing ${unsyncedLeads.length} pending lead(s) to Google Sheets...`);

      // 3. Append each unsynced lead to the sheet and update status in Firestore/localStorage
      let successCount = 0;
      for (const lead of unsyncedLeads) {
        try {
          await appendInquiryRow(accessToken, sheetId, {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            company: lead.company,
            serviceType: lead.serviceType
          });

          // Update Server-side DB
          if (!lead.id.startsWith("local_")) {
            try {
              await fetch("/api/admin/mark-synced", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: lead.id })
              });
            } catch (err) {
              console.warn("Failed to mark synced on server-side:", err);
            }
          }

          // Update local storage backup list
          const localRaw = localStorage.getItem("dias_local_inquiries");
          if (localRaw) {
            const localList = JSON.parse(localRaw) as any[];
            const updatedLocalList = localList.map(item => 
              item.id === lead.id || (item.email === lead.email && item.createdAt === lead.createdAt)
                ? { ...item, synced: true }
                : item
            );
            localStorage.setItem("dias_local_inquiries", JSON.stringify(updatedLocalList));
          }

          successCount++;
        } catch (appendErr) {
          console.error(`Failed to sync lead (${lead.name}):`, appendErr);
        }
      }

      // Reload fresh list
      await fetchPortalInquiries();
      setSyncMessage(`Successfully synced ${successCount} lead(s) to Google Sheets!`);
    } catch (err: any) {
      console.error("Sheets sync process failed:", err);
      setError(err?.message || "Sheets sync failed. Please re-authenticate and try again.");
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
    setError(null);
  };

  const getServiceLabel = (type: string) => {
    if (language === "ar") {
      switch (type) {
        case "corporate-tax": return "استشارات ضريبة الشركات (الامتثال 9%)";
        case "vat-compliance": return "الامتثال لضريبة القيمة المضافة والإقرارات";
        case "accounting": return "المحاسبة ومسك الدفاتر المنتظم";
        case "incorporation": return "تأسيس الشركات وتراخيص المناطق الحرة";
        case "general": return "استشارة ضريبية ومحاسبية شاملة";
        default: return type;
      }
    }
    switch (type) {
      case "corporate-tax": return "Corporate Tax Advisory";
      case "vat-compliance": return "VAT Compliance & Audits";
      case "accounting": return "Accounting & Bookkeeping";
      case "incorporation": return "Business Setup & Licensing";
      case "general": return "Comprehensive Package";
      default: return type;
    }
  };

  const spreadsheetUrl = spreadsheetId 
    ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
    : "https://sheets.google.com";

  return (
    <div id="scheduler-portal-container" className="space-y-4">
      
      {/* 1. ADVISOR PORTAL MODAL/OVERLAY */}
      {showPortal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Portal Header */}
            <div className="bg-navy-900 px-6 py-5 flex items-center justify-between text-white border-b border-navy-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/30 text-gold-400 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight">Advisor Sheets Sync Workspace</h3>
                  <p className="text-[10px] text-slate-300 font-mono">Dias Tax Partner Portal v1.2</p>
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
                Close Portal
              </button>
            </div>

            {/* Portal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {!currentUser ? (
                /* Authenticate Advisor */
                <div className="py-8 text-center max-w-md mx-auto space-y-6">
                  <div className="w-16 h-16 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center mx-auto border border-gold-100 shadow-sm">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display text-xl font-bold text-navy-950">Secure Advisor Authorization</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Please authenticate with your Google account. This grants the workspace temporary access to automatically find or create your lead spreadsheet and write new inquiries directly.
                    </p>
                  </div>
                  
                  {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs p-3.5 rounded-xl flex items-start gap-2 text-left">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 transition-all rounded-xl py-3 px-4 shadow-sm text-sm font-semibold text-slate-700 cursor-pointer"
                  >
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                    Authorize Advisor Account
                  </button>
                </div>
              ) : (
                /* Authenticated Dashboard View */
                <div className="space-y-6">
                  
                  {/* Account Metadata Bar */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 border border-slate-100 rounded-2xl p-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Authorized Account</p>
                      <div className="flex items-center gap-2">
                        <img src={currentUser.photoURL || ""} alt="" width={20} height={20} loading="lazy" decoding="async" className="w-5 h-5 rounded-full border" referrerPolicy="no-referrer" />
                        <span className="text-xs font-bold text-navy-950">{currentUser.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2.5">
                      {spreadsheetId && (
                        <a
                          href={spreadsheetUrl}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50 py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                          View Inquiries Spreadsheet
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      
                      <button
                        onClick={handleDisconnect}
                        className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/50 py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>

                  {/* Server Automatic Sync Status Banner */}
                  <div className="bg-emerald-50/55 border border-emerald-100/80 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                        <Shield className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase text-emerald-700 font-bold tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                          Automatic Server-Side Sync Active
                        </span>
                        <p className="text-[11px] text-slate-500 max-w-2xl leading-relaxed">
                          Your Google Sheets authorization is stored securely on the server. When clients submit the inquiry form, the server immediately logs it to Firestore and appends it to your Google Sheet automatically—with zero client-side Google login required.
                        </p>
                      </div>
                    </div>
                    {serverSyncStatus?.updatedAt && (
                      <span className="text-[9px] font-mono text-slate-400 whitespace-nowrap self-end md:self-center">
                        Last saved: {new Date(serverSyncStatus.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  {/* Sync Action Area */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Metric 1 */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center shrink-0 border border-gold-100">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Inquiries</p>
                        <h5 className="text-xl font-bold text-navy-950 font-display">{portalInquiries.length}</h5>
                      </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                        <RefreshCw className="w-5 h-5 animate-spin-slow" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pending Sync</p>
                        <h5 className="text-xl font-bold text-navy-950 font-display">
                          {portalInquiries.filter(l => !l.synced).length}
                        </h5>
                      </div>
                    </div>

                    {/* Action Button Card */}
                    <button
                      onClick={syncToSheets}
                      disabled={isSyncing}
                      className="bg-navy-900 hover:bg-navy-950 text-white rounded-2xl p-4 flex items-center justify-center gap-3 font-display font-bold text-sm shadow-md transition-all border border-navy-950 cursor-pointer disabled:opacity-50"
                    >
                      {isSyncing ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Sparkles className="w-5 h-5 text-gold-400 animate-pulse" />
                      )}
                      Sync to Google Sheet
                    </button>

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

                  {/* Leads Data Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <div className="px-5 py-4 bg-slate-50/60 border-b border-slate-200/80 flex justify-between items-center">
                      <h5 className="font-display font-bold text-navy-950 text-xs flex items-center gap-2">
                        <Database className="w-4 h-4 text-navy-800" />
                        Inquiry Submissions Log
                      </h5>
                      <button 
                        onClick={fetchPortalInquiries} 
                        disabled={isPortalLoading}
                        className="text-[10px] font-bold text-gold-600 hover:text-gold-700 underline cursor-pointer"
                      >
                        {isPortalLoading ? "Refreshing..." : "Refresh Logs"}
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      {portalInquiries.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 text-xs">
                          No inquiries collected yet. Submit some using the public form.
                        </div>
                      ) : (
                        <table className="w-full text-left text-xs text-slate-600">
                          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                            <tr>
                              <th className="px-5 py-3">Inquiry Details</th>
                              <th className="px-5 py-3">Interest Type</th>
                              <th className="px-5 py-3">Submission (GST)</th>
                              <th className="px-5 py-3 text-center">Sync Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(portalInquiries || []).map((lead) => (
                              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
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
                                  {new Date(lead.createdAt).toLocaleDateString("en-AE", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    timeZone: "Asia/Dubai"
                                  })} GST
                                </td>
                                <td className="px-5 py-3.5 text-center">
                                  {lead.synced ? (
                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
                                      <Check className="w-3 h-3" />
                                      Synced to Sheet
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-100">
                                      <RefreshCw className="w-3 h-3 animate-spin-slow text-amber-600" />
                                      Pending Sync
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 2. PUBLIC INQUIRY FORM */}
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
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 text-xs">
                <span className="text-slate-500 font-medium">{language === "ar" ? "حالة الطلب:" : "Inquiry Status:"}</span>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[9px] font-bold border border-emerald-100">
                  <Check className="w-3 h-3" /> {language === "ar" ? "تم التسجيل بنجاح" : "Synced to Sheets"}
                </span>
              </div>
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

            <div className="pt-2">
              <button
                onClick={resetForm}
                className="text-slate-500 hover:text-navy-900 font-display font-bold text-xs underline cursor-pointer px-4 py-2"
              >
                {language === "ar" ? "إرسال استفسار آخر" : "Submit another inquiry"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            
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
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <LucideUser className="w-3.5 h-3.5 text-slate-400" />
                    {t.contact.fullNameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                    placeholder={t.contact.fullNamePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {t.contact.emailLabel} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                    placeholder={t.contact.emailPlaceholder}
                  />
                </div>
              </div>

              {/* Phone & Company row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {t.contact.phoneLabel} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                    placeholder={t.contact.phonePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {language === "ar" ? "اسم الشركة" : "Company Name"}
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                    placeholder={language === "ar" ? "مثال: شركتي ذ.م.م" : "e.g. My Company FZ-LLC"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  {t.contact.serviceLabel} *
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 text-slate-700 focus:bg-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none font-medium transition-all"
                >
                  <option value="corporate-tax">{language === "ar" ? "استشارات ضريبة الشركات (الامتثال بنسبة 9%)" : "Corporate Tax Advisory (9% compliance)"}</option>
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
