import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Search, 
  SlidersHorizontal, 
  Loader2, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clipboard, 
  Check, 
  Calendar, 
  X, 
  ChevronRight, 
  FileSpreadsheet, 
  Building, 
  Edit, 
  Save, 
  ArrowLeft,
  User,
  ExternalLink,
  Plus
} from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceType: string;
  message: string;
  createdAt: string;
  synced: boolean;
  status: string;
  notes?: string;
}

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPortal({ isOpen, onClose }: AdminPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Inquiries and UI state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [serviceFilter, setServiceFilter] = useState<string>("All");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Detail panel editing state
  const [editingNotes, setEditingNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Load token from sessionStorage to persist session within browser tab life
  useEffect(() => {
    const savedToken = sessionStorage.getItem("dias_admin_token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch inquiries once authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchInquiries();
    }
  }, [isAuthenticated, token]);

  const fetchInquiries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/inquiries", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        handleLogout();
        throw new Error("Session expired. Please log in again.");
      }
      if (!response.ok) {
        let errMsg = "Failed to fetch inquiries";
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const errJson = await response.json();
            errMsg = errJson.error || errMsg;
          } catch (_) {}
        } else {
          const rawText = await response.text();
          errMsg = rawText || errMsg;
        }
        throw new Error(errMsg);
      }

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const rawText = await response.text();
        throw new Error(`Invalid response format from server: ${rawText.substring(0, 100)}`);
      }
      setInquiries(data);
    } catch (err: any) {
      setError(err.message || "Could not load pipeline data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        let errMsg = "Incorrect password.";
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const errJson = await response.json();
            errMsg = errJson.error || errMsg;
          } catch (_) {}
        } else {
          const rawText = await response.text();
          errMsg = rawText || errMsg;
        }
        throw new Error(errMsg);
      }

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const rawText = await response.text();
        throw new Error(`Invalid response format from server: ${rawText.substring(0, 100)}`);
      }
      setToken(data.token);
      sessionStorage.setItem("dias_admin_token", data.token);
      setIsAuthenticated(true);
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    sessionStorage.removeItem("dias_admin_token");
    setInquiries([]);
    setSelectedInquiry(null);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingStatus(id);
    try {
      const response = await fetch("/api/admin/update-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (!response.ok) throw new Error("Failed to update status");

      // Update locally
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err: any) {
      alert("Error updating lead status: " + err.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setSavingNotes(true);
    try {
      const response = await fetch("/api/admin/update-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: selectedInquiry.id, notes: editingNotes })
      });

      if (!response.ok) throw new Error("Failed to save internal advisor notes");

      // Update locally
      setInquiries(prev => prev.map(inq => inq.id === selectedInquiry.id ? { ...inq, notes: editingNotes } : inq));
      setSelectedInquiry(prev => prev ? { ...prev, notes: editingNotes } : null);
      
      const el = document.getElementById("notes-saved-success");
      if (el) {
        el.classList.remove("opacity-0");
        setTimeout(() => el.classList.add("opacity-0"), 2000);
      }
    } catch (err: any) {
      alert("Error saving notes: " + err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSyncInquiry = async (id: string) => {
    try {
      const response = await fetch("/api/admin/mark-synced", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) throw new Error("Failed to sync inquiry");

      // Update locally
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, synced: true } : inq));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, synced: true } : null);
      }
    } catch (err: any) {
      alert("Sync failed: " + err.message);
    }
  };

  const handleManualSyncAll = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const response = await fetch("/api/sync-all", {
        method: "POST"
      });
      if (!response.ok) {
        let errMsg = "Sync execution failed.";
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const errJson = await response.json();
            errMsg = errJson.error || errMsg;
          } catch (_) {}
        } else {
          const rawText = await response.text();
          errMsg = rawText || errMsg;
        }
        throw new Error(errMsg);
      }

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const rawText = await response.text();
        throw new Error(`Invalid response format from server: ${rawText.substring(0, 100)}`);
      }
      setSyncMessage(`Successfully synchronized ${data.syncedCount || 0} unsynced inquiries with Google Sheets!`);
      fetchInquiries();
    } catch (err: any) {
      setSyncMessage(`Sync error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Pre-select or load note input when selectedInquiry changes
  useEffect(() => {
    if (selectedInquiry) {
      setEditingNotes(selectedInquiry.notes || "");
    }
  }, [selectedInquiry]);

  if (!isOpen) return null;

  // Status List options
  const pipelineStatuses = ["New Lead", "Contacted", "In Progress", "Converted", "Archived"];

  // Helper to map status to beautiful styling classes
  const getStatusBadgeClass = (statusStr: string) => {
    const s = statusStr || "New Lead";
    if (s === "Converted") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "In Progress") return "bg-sky-50 text-sky-700 border-sky-200";
    if (s === "Contacted") return "bg-amber-50 text-amber-700 border-amber-200";
    if (s === "Archived") return "bg-slate-100 text-slate-600 border-slate-200";
    return "bg-navy-50 text-navy-700 border-navy-200"; // New Lead
  };

  // Helper to format Date beautifully
  const formatDate = (isoStr: string) => {
    if (!isoStr) return "N/A";
    const date = new Date(isoStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Filter & Search Logic
  const filteredInquiries = inquiries.filter(inq => {
    const matchesStatus = statusFilter === "All" || inq.status === statusFilter;
    const matchesService = serviceFilter === "All" || inq.serviceType === serviceFilter;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (inq.name || "").toLowerCase().includes(query) ||
      (inq.company || "").toLowerCase().includes(query) ||
      (inq.email || "").toLowerCase().includes(query) ||
      (inq.phone || "").toLowerCase().includes(query) ||
      (inq.message || "").toLowerCase().includes(query) ||
      (inq.serviceType || "").toLowerCase().includes(query);

    return matchesStatus && matchesService && matchesSearch;
  });

  // Calculate Pipeline statistics
  const stats = {
    total: inquiries.length,
    newLeads: inquiries.filter(i => !i.status || i.status === "New Lead").length,
    inProgress: inquiries.filter(i => i.status === "In Progress").length,
    converted: inquiries.filter(i => i.status === "Converted").length,
    unsynced: inquiries.filter(i => !i.synced).length
  };

  return (
    <div id="admin-portal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-navy-950/85 backdrop-blur-md animate-fadeIn">
      
      <div className="w-full h-full max-w-7xl bg-white md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
        
        {/* Header bar */}
        <div className="bg-navy-950 text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base md:text-lg text-white">Advisor Portal</h3>
              <p className="text-[10px] text-slate-400 font-medium">Dias Private Lead & Client Acquisition Pipeline</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
              >
                Log Out
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer focus:outline-none"
              aria-label="Close Admin Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth / Main layout */}
        {!isAuthenticated ? (
          <div className="flex-1 bg-slate-50 flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="p-6 md:p-8 space-y-6">
                
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-navy-900" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-navy-950">Secure Access Portal</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Please provide the Dias Advisor passcode to manage the UAE corporate registration and taxation pipelines.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="passcode" className="text-xs font-semibold text-slate-700">Advisor Passcode</label>
                    <input 
                      id="passcode"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900 transition-all text-center tracking-widest font-mono font-bold"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-navy-900 hover:bg-navy-950 text-white font-display font-bold py-3 px-4 rounded-xl text-xs tracking-tight transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-gold-400" />
                        Unlock Dashboard
                      </>
                    )}
                  </button>
                </form>

              </div>
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium">
                Authorized Personnel Only • IP & Access Logs Active
              </div>
            </div>
          </div>
        ) : (
          /* Main Authenticated Dashboard Panel */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            
            {/* Lead Stats Widgets Bar */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 grid grid-cols-2 md:grid-cols-5 gap-3 shrink-0">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">All Leads</span>
                <span className="text-2xl font-extrabold text-navy-950 mt-1 font-mono">{stats.total}</span>
              </div>
              <div className="p-3 bg-navy-50/50 border border-navy-100 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wider">New</span>
                <span className="text-2xl font-extrabold text-navy-900 mt-1 font-mono">{stats.newLeads}</span>
              </div>
              <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">In Progress</span>
                <span className="text-2xl font-extrabold text-sky-900 mt-1 font-mono">{stats.inProgress}</span>
              </div>
              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Converted</span>
                <span className="text-2xl font-extrabold text-emerald-900 mt-1 font-mono">{stats.converted}</span>
              </div>
              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl flex flex-col justify-between col-span-2 md:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Unsynced</span>
                  {stats.unsynced > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </div>
                <span className="text-2xl font-extrabold text-amber-900 mt-1 font-mono">{stats.unsynced}</span>
              </div>
            </div>

            {/* Main Interactive Work Area */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Column: Leads List & Controls */}
              <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200">
                
                {/* Search & Filter Bar */}
                <div className="bg-white p-4 border-b border-slate-200 flex flex-col gap-3 shrink-0">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Search by client name, company, message details..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-950 focus:border-navy-950 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                    </div>
                    {["All", ...pipelineStatuses].map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer focus:outline-none shrink-0 ${
                          statusFilter === status 
                            ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Leads Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                  
                  {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 text-navy-900 animate-spin" />
                      <span className="text-xs font-medium text-slate-400">Retrieving active lead pipelines...</span>
                    </div>
                  ) : filteredInquiries.length === 0 ? (
                    <div className="py-20 text-center bg-white border border-slate-150 rounded-2xl p-6">
                      <p className="text-sm font-semibold text-slate-700">No leads match your selection</p>
                      <p className="text-xs text-slate-400 mt-1">Try resetting the status filter or clearing your search.</p>
                    </div>
                  ) : (
                    filteredInquiries.map((inq) => {
                      const isSelected = selectedInquiry?.id === inq.id;
                      return (
                        <div 
                          key={inq.id}
                          onClick={() => setSelectedInquiry(inq)}
                          className={`bg-white rounded-2xl border transition-all p-4 cursor-pointer relative hover:shadow-md ${
                            isSelected 
                              ? "border-navy-900 ring-1 ring-navy-900/10 shadow" 
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-display font-bold text-sm text-navy-950">{inq.name}</h5>
                                {inq.company && (
                                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5 max-w-[150px] truncate">
                                    <Building className="w-2.5 h-2.5 shrink-0" /> {inq.company}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 font-mono">{inq.email}</p>
                            </div>
                            
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border shrink-0 ${getStatusBadgeClass(inq.status)}`}>
                              {inq.status || "New Lead"}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                            {inq.message}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-3.5 pt-3 border-t border-slate-100">
                            <span className="flex items-center gap-1 font-mono">
                              <Calendar className="w-3 h-3 text-slate-300" /> {formatDate(inq.createdAt)}
                            </span>
                            <div className="flex items-center gap-2">
                              {inq.synced ? (
                                <span className="flex items-center gap-0.5 text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                  <FileSpreadsheet className="w-2.5 h-2.5" /> Synced
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5 text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                  <AlertCircle className="w-2.5 h-2.5 animate-pulse" /> Unsynced
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                </div>

                {/* Footer Controls / Google Sheet Sync Trigger */}
                <div className="bg-white p-4 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-navy-950 flex items-center gap-1">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Google Sheets Integration
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Unsynced inquiries will automatically be pushed on this execution.
                    </p>
                  </div>

                  <button
                    onClick={handleManualSyncAll}
                    disabled={isSyncing || inquiries.length === 0}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-display font-semibold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isSyncing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    Sync Pipeline Now
                  </button>
                </div>

                {syncMessage && (
                  <div className="bg-emerald-50 border-t border-emerald-200 px-6 py-2 text-xs text-emerald-800 font-semibold shrink-0 text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{syncMessage}</span>
                  </div>
                )}

              </div>

              {/* Right Column: Detailed Pipeline Lead View */}
              <div className="hidden lg:flex w-[460px] bg-white flex-col overflow-hidden">
                {selectedInquiry ? (
                  <div className="h-full flex flex-col overflow-hidden">
                    
                    {/* Detail Header */}
                    <div className="p-6 border-b border-slate-100 shrink-0 space-y-2 bg-slate-50/50">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold text-navy-900 bg-navy-50 border border-navy-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Active Lead Detail
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-500">Status:</span>
                          <select
                            value={selectedInquiry.status || "New Lead"}
                            onChange={(e) => handleUpdateStatus(selectedInquiry.id, e.target.value)}
                            disabled={updatingStatus !== null}
                            className="bg-white border border-slate-200 rounded-lg text-xs font-bold py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-navy-950 text-slate-700 cursor-pointer"
                          >
                            {pipelineStatuses.map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <h4 className="font-display font-extrabold text-xl text-navy-950 tracking-tight pt-1">
                        {selectedInquiry.name}
                      </h4>
                      
                      {selectedInquiry.company && (
                        <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" /> 
                          <span>{selectedInquiry.company}</span>
                        </p>
                      )}
                    </div>

                    {/* Scrollable details */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      
                      {/* Client Contact Block */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Contact Details
                        </h5>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <span className="text-xs font-mono font-medium text-slate-700">{selectedInquiry.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => copyToClipboard(selectedInquiry.email, "email")}
                                className="p-1 text-slate-400 hover:text-navy-950 hover:bg-slate-200 rounded transition-all cursor-pointer focus:outline-none"
                                title="Copy Email"
                              >
                                {copiedId === "email" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clipboard className="w-3.5 h-3.5" />}
                              </button>
                              <a 
                                href={`mailto:${selectedInquiry.email}`}
                                className="p-1 text-slate-400 hover:text-navy-950 hover:bg-slate-200 rounded transition-all"
                                title="Send Email"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <span className="text-xs font-mono font-medium text-slate-700">{selectedInquiry.phone || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {selectedInquiry.phone && (
                                <>
                                  <button 
                                    onClick={() => copyToClipboard(selectedInquiry.phone, "phone")}
                                    className="p-1 text-slate-400 hover:text-navy-950 hover:bg-slate-200 rounded transition-all cursor-pointer focus:outline-none"
                                    title="Copy Phone"
                                  >
                                    {copiedId === "phone" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clipboard className="w-3.5 h-3.5" />}
                                  </button>
                                  <a 
                                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}`}
                                    target="_blank" 
                                    referrerPolicy="no-referrer"
                                    className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-all flex items-center gap-0.5 text-[10px] font-bold"
                                    title="Message via WhatsApp"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" /> Direct WA
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Service request details */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Service Practice
                        </h5>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[11px] font-bold text-navy-950 bg-gold-400/20 text-gold-950 border border-gold-300/30 px-2 py-0.5 rounded">
                            {selectedInquiry.serviceType}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-semibold mt-2">
                            SUBMITTED ON {formatDate(selectedInquiry.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Message details */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Inquiry Message
                        </h5>
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                          {selectedInquiry.message}
                        </div>
                      </div>

                      {/* Internal Advisor Notes */}
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Internal Advisor Notes
                          </h5>
                          <span id="notes-saved-success" className="text-[10px] font-bold text-emerald-600 opacity-0 transition-opacity flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Saved Notes
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          <textarea
                            rows={4}
                            placeholder="Add internal pipeline updates, meeting logs, call outcomes, or consultation schedules here..."
                            value={editingNotes}
                            onChange={(e) => setEditingNotes(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-950 focus:border-navy-950 transition-all leading-relaxed"
                          />
                          
                          <button
                            onClick={handleSaveNotes}
                            disabled={savingNotes}
                            className="w-full bg-navy-900 hover:bg-navy-950 disabled:opacity-50 text-white font-display font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            {savingNotes ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Save className="w-3.5 h-3.5 text-gold-400" />
                            )}
                            Save Advisor Notes
                          </button>
                        </div>
                      </div>

                      {/* Google sheets single sync status */}
                      {!selectedInquiry.synced && (
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3">
                          <div className="space-y-0.5">
                            <p className="text-[11px] font-bold text-amber-900">Lead is unsynced</p>
                            <p className="text-[10px] text-amber-700">Push this client data record directly into the Google Sheet.</p>
                          </div>
                          <button 
                            onClick={() => handleSyncInquiry(selectedInquiry.id)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm shrink-0"
                          >
                            <FileSpreadsheet className="w-3 h-3" /> Force Push
                          </button>
                        </div>
                      )}

                    </div>

                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/30">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <ChevronRight className="w-8 h-8 text-slate-300" />
                    </div>
                    <h5 className="font-display font-bold text-sm text-slate-700">No Lead Selected</h5>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Click on any inquiry from the pipeline on the left to inspect, manage status, direct contact, or save advisor notes.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
