import React, { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Tag,
  Share2,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Mail,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { blogsData } from "../data/blogsData";
import { BlogPost } from "../types";
import BlogModal from "../components/BlogModal";

interface BlogsPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const BlogsPage: React.FC<BlogsPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>(blogsData);

  // Lead Magnet Download Form State
  const [checklistEmail, setChecklistEmail] = useState("");
  const [checklistName, setChecklistName] = useState("");
  const [checklistSuccess, setChecklistSuccess] = useState(false);

  useEffect(() => {
    const title = "Corporate Tax Insights & UAE Tax Regulations Hub | Dias UAE";
    const desc = "Authoritative UAE Corporate Tax guides, DIFC tax compliance briefings, VAT filing rules, and accounting strategies by FTA registered tax agents in Dubai.";
    document.title = title;
    window.scrollTo({ top: 0, behavior: "instant" });

    const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    upsertMeta("name", "description", desc);
    upsertMeta("name", "keywords", "Corporate Tax, DIFC Tax Compliance, Tax Services in Dubai, UAE Corporate Tax Guide, FTA EmaraTax, Free Zone 0% QFZP, VAT filing Dubai");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:url", "https://diasuae.ae/blogs");

    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
          const dynamicIds = new Set(data.blogs.map((b: BlogPost) => b.id));
          const merged = [
            ...data.blogs,
            ...blogsData.filter((b) => !dynamicIds.has(b.id)),
          ];
          merged.sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0));
          setAllPosts(merged);
        }
      })
      .catch(() => {});
  }, []);

  // 5 exact required categories
  const categories = [
    { id: "all", label: "All Insights" },
    { id: "corporate-tax", label: "Corporate Tax" },
    { id: "vat", label: "VAT" },
    { id: "free-zone", label: "Free Zone" },
    { id: "bookkeeping", label: "Bookkeeping" },
    { id: "compliance-penalties", label: "Compliance and Penalties" },
  ];

  // 5 Draft Placeholder Posts with headings & outlines only
  const draftAuthor = {
    name: "Glen Dias",
    role: "FTA Registered Tax Agent",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120",
  };

  const draftPlaceholderPosts: BlogPost[] = [
    {
      id: "draft-claim-small-business-relief",
      title: "How to Claim UAE Small Business Relief (0% Corporate Tax up to AED 3M) [DRAFT OUTLINE]",
      summary: "A practical guide for UAE resident businesses on electing for SBR under Ministerial Decision No. 73 of 2023. Covers revenue thresholds, eligible entities, and EmaraTax election steps.",
      date: "Upcoming Article",
      readTime: "Outline Draft",
      tag: "Corporate Tax",
      author: draftAuthor,
      content: `## Executive Overview

### 1. Introduction: What is Small Business Relief (SBR)?
- Statutory basis under Article 21 of Federal Decree-Law No. 47 of 2022 and Ministerial Decision No. 73 of 2023.
- SBR relief has been officially extended by the Ministry of Finance through December 31, 2029.

### 2. Eligibility Criteria
- Gross business turnover cap of AED 3,000,000 across current and prior fiscal periods.
- Applicable exclusively to UAE Resident taxable persons; explicit exclusions apply to Qualifying Free Zone Persons (QFZPs) and members of Multinational Enterprise (MNE) groups.

### 3. Step-by-Step Election on EmaraTax
- Electing for SBR directly in the annual Corporate Tax return on the EmaraTax portal.
- Simplified transfer pricing compliance and relief from full Local File/Master File preparation.

### 4. Mandatory Record-Keeping Requirements
- Statutory requirement to maintain complete IFRS-compliant accounting ledgers and financial statements for 7 years despite 0% tax liability.

### 5. Frequently Asked Questions & Action Plan
- **Can I elect for SBR if I am registered for VAT?** Yes, VAT and Corporate Tax are separate regimes; an entity can have a VAT TRN and simultaneously elect for 0% SBR.
- Use the free Dias UAE Tax Planner to verify your Small Business Relief eligibility in 60 seconds.`,
    },
    {
      id: "draft-vat-registration-checklist",
      title: "The Complete UAE VAT Registration Checklist for Growing Businesses",
      summary: "Understand mandatory (AED 375k) vs voluntary (AED 187.5k) VAT thresholds, required corporate documentation, and how to avoid the AED 10,000 late registration fine.",
      date: "Upcoming Article",
      readTime: "Outline Draft",
      tag: "VAT",
      author: draftAuthor,
      content: `## Executive Overview

### 1. The Two Statutory Thresholds
- Mandatory registration threshold: Taxable supplies and imports exceeding AED 375,000 over the prior 12 months or projected in next 30 days.
- Voluntary registration threshold: Taxable supplies, imports, or business expenses exceeding AED 187,500.

### 2. Documents Required for FTA EmaraTax VAT Registration
- Valid UAE Commercial Trade License, Certificate of Incorporation, and Memorandum of Association (MOA).
- Passport and Emirates ID copies of authorized managers and signatories.
- Historical 12-month sales turnover spreadsheet with supporting bank statements and sample sales invoices.
- Projected 30-day turnover forecast and business model summary.

### 3. Common VAT Registration Pitfalls & Administrative Fines
- The mandatory AED 10,000 late registration penalty under Cabinet Decision No. 40 of 2017.
- Failure to account for reverse charge VAT on imported foreign digital services and SaaS software subscriptions.

### 4. Action Plan & Support
- Contact Dias Accounting for complete, penalty-free VAT registration and quarterly Form 201 return filings.`,
    },
    {
      id: "draft-free-zone-qualifying-income",
      title: "Free Zone Qualifying Income: How to Keep Your 0% Corporate Tax Status",
      summary: "A roadmap to Qualifying Free Zone Person (QFZP) status under Cabinet Decision No. 55/2023 and Ministerial Decision No. 139/2023. Economic substance, de minimis rule, and audited accounts.",
      date: "Upcoming Article",
      readTime: "Outline Draft",
      tag: "Free Zone",
      author: draftAuthor,
      content: `## Executive Overview

### 1. Free Zone Myths vs Statutory Realities
- Free Zone companies are not automatically exempt from Corporate Tax: 100% of Free Zone legal entities must register on EmaraTax and submit annual returns.

### 2. The 5 Core Requirements for 0% QFZP Treatment
- 1. Maintain adequate economic substance (full-time qualified employees, local operational expenditure, adequate office premises) in a designated Free Zone.
- 2. Derive Qualifying Income exclusively from Qualifying Activities or transactions with other Free Zone entities.
- 3. Comply with the De Minimis threshold (non-qualifying revenue must not exceed the lower of 5% of total revenue or AED 5,000,000).
- 4. Adhere strictly to arm's length Transfer Pricing rules and related-party documentation.
- 5. Prepare audited annual financial statements compliant with IFRS.

### 3. Consequences of Breaching QFZP Conditions
- Loss of 0% tax treatment for the breach year and the subsequent 4 tax periods (resulting in standard 9% tax on all corporate profits for 5 continuous years).

### 4. Professional Assistance
- Book a comprehensive Free Zone substance and contract review with Dias Accounting.`,
    },
    {
      id: "draft-backlog-bookkeeping-penalty-shield",
      title: "Why Catching Up on Backlog Bookkeeping Saves You Thousands in FTA Penalties",
      summary: "Unrecorded transactions and missing bank reconciliations create compounding tax risks. Learn how reconstructing historical books shields your UAE entity from fines.",
      date: "Upcoming Article",
      readTime: "Outline Draft",
      tag: "Bookkeeping",
      author: draftAuthor,
      content: `## Executive Overview

### 1. The Compounding Risks of Delayed Books
- Unmaintained accounting ledgers lead to missed Corporate Tax and VAT filing deadlines, triggering compounding administrative fines.
- UAE Commercial Companies Law mandates retention of proper books of accounts for a minimum of 5 years (and 7 years under Tax Law).

### 2. The Backlog Reconstruction Workflow
- Extracting 12 to 36 months of bank statements, credit cards, and payment gateway logs (Stripe, Amazon, Noon).
- Resolving suspense balances, unrecorded expenses, director loans, and historical tax invoices.
- Preparing certified opening balance sheets and trial balances formatted for statutory audit.

### 3. Strategic Benefits of a Cleaned-Up Ledger
- Maximizing legitimate tax-deductible commercial expenses under UAE Corporate Tax Law.
- Smooth commercial license renewals and seamless banking KYC and credit facility reviews.

### 4. Fixed-Fee Solutions
- Dias Accounting provides fixed-fee historical Backlog Catch-Up packages starting at AED 2,500 per fiscal year.`,
    },
    {
      id: "draft-top-tax-mistakes-uae-companies-make",
      title: "Top 7 Common Tax Mistakes UAE Companies Make (and How to Avoid Them)",
      summary: "From commingling personal and business funds to ignoring connected person rules, discover the top fiscal compliance errors UAE businesses commit and how to fix them.",
      date: "Upcoming Article",
      readTime: "Outline Draft",
      tag: "Compliance and Penalties",
      author: draftAuthor,
      content: `## Executive Overview

### The 7 Critical Mistakes UAE Businesses Make:
1. Assuming Free Zone entities are exempt from Corporate Tax registration (mandatory for all commercial licenses).
2. Commingling shareholder personal finances with corporate bank accounts, disallowing major tax deductions.
3. Missing designated FTA Corporate Tax registration windows (attracting an immediate AED 10,000 fine).
4. Over-claiming client entertainment expenses (statutorily restricted to 50% deductibility under Article 32).
5. Non-arm's length compensation, management charges, and bonuses paid to Connected Persons or family relatives.
6. Overlooking reverse charge VAT on overseas software licenses, cloud hosting, and marketing platforms.
7. Relying on disconnected spreadsheets instead of double-entry cloud accounting platforms (Zoho Books, QuickBooks, Xero).

### Proactive Next Steps
- Take the free Dias 60-Second Penalty Risk Audit or book a consultation with Senior Tax Advisor Glen Dias.`,
    },
  ];

  // Combine live articles and 5 draft outlines
  const combinedPosts = [...allPosts, ...draftPlaceholderPosts];

  const filteredPosts = combinedPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tag && post.tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "corporate-tax" && post.tag.toLowerCase().includes("corporate tax")) ||
      (selectedCategory === "vat" && post.tag.toLowerCase().includes("vat")) ||
      (selectedCategory === "free-zone" && (post.tag.toLowerCase().includes("free zone") || post.tag.toLowerCase().includes("incorporation"))) ||
      (selectedCategory === "bookkeeping" && post.tag.toLowerCase().includes("bookkeeping")) ||
      (selectedCategory === "compliance-penalties" && (post.tag.toLowerCase().includes("compliance") || post.tag.toLowerCase().includes("penalties")));

    return matchesSearch && matchesCategory;
  });

  const handleChecklistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChecklistSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950">
      <PageNavigation
        currentPath="/blogs"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-24 border-b border-gold-500/20 overflow-hidden">
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-4">
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:underline cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">Tax &amp; Accounting Blog</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <BookOpen className="w-3.5 h-3.5 text-gold-400" />
                <span>FTA Regulatory Briefings · Practical Accounting Insights</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                Corporate Tax Insights, DIFC Tax Compliance &amp; UAE Regulations Hub
              </h1>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                Authoritative legislative interpretations, ministerial decrees, practical compliance guides, and draft outlines prepared by FTA Registered Tax Agents in Dubai and Sharjah.
              </p>

              {/* General Information Disclaimer */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs leading-relaxed flex items-start gap-2.5 mb-6">
                <AlertCircle className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Disclaimer:</strong> This content is general information, not tax or legal advice. Consult a qualified professional before acting on it.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-xl">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles by keyword (e.g. SBR, VAT registration, QFZP, penalties)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading & Category Filter Tabs */}
          <div className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-navy-950 mb-2">
              What Are the Latest Corporate Tax, VAT &amp; Free Zone Regulatory Updates in Dubai?
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Filter by regulatory category or search by topic to explore authoritative FTA compliance briefings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-slate-200">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-navy-950 text-white font-bold shadow-xs"
                    : "bg-white text-slate-600 hover:text-navy-950 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid Layout: Articles + Lead Magnet Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left 8 Cols: Articles Grid */}
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => {
                  const isDraft = post.id.startsWith("draft-");
                  return (
                    <article
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-gold-400 transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isDraft ? "bg-amber-100 text-amber-800" : "bg-gold-50 text-gold-800"
                          }`}>
                            {post.tag}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                          </span>
                        </div>

                        <h2 className="font-display font-bold text-base sm:text-lg text-navy-950 group-hover:text-gold-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {post.summary}
                        </p>
                      </div>

                      <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {post.author.name}
                        </span>
                        <span className="text-xs font-display font-bold text-navy-950 group-hover:text-gold-600 flex items-center gap-1">
                          {isDraft ? "View Outline" : "Read Article"}
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-display text-lg font-bold text-navy-950">
                    No articles found matching your search
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">
                    Try another search term or click "All Insights" to view all tax guides.
                  </p>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Lead Magnet Box & CTAs */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* DOWNLOADABLE LEAD MAGNET SIGNUP */}
              <div className="bg-gradient-to-br from-navy-950 to-navy-900 border border-gold-500/30 rounded-3xl p-6 sm:p-7 text-white shadow-xl space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-400/40 flex items-center justify-center">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gold-400 uppercase font-bold tracking-wider block mb-1">
                    FREE COMPLIANCE RESOURCE
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold">
                    Download the 2026 UAE Tax Compliance Checklist
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    A comprehensive, 10-point checklist covering Corporate Tax registration deadlines, 0% SBR requirements, VAT filing cycles, and penalty risk shields.
                  </p>
                </div>

                {checklistSuccess ? (
                  <div className="p-4 bg-emerald-500/20 border border-emerald-400/50 rounded-2xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-xs font-bold text-white">
                      Checklist Dispatched!
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Check your inbox at <strong>{checklistEmail}</strong> to download your checklist.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleChecklistSubmit} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={checklistName}
                      onChange={(e) => setChecklistName(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Work Email"
                      value={checklistEmail}
                      onChange={(e) => setChecklistEmail(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                    >
                      Download Free Checklist
                    </button>
                    <span className="text-[10px] text-slate-400 text-center block">
                      Instant PDF access · Zero spam policy
                    </span>
                  </form>
                )}
              </div>

              {/* Sidebar Quick Consultation CTA */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <span className="text-[11px] font-mono text-gold-600 font-bold uppercase tracking-wider block">
                  TALK TO AN EXPERT
                </span>
                <h4 className="font-display font-bold text-base text-navy-950">
                  Need Immediate Advice on Corporate Tax or VAT?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connect with Glen Dias, FTA Registered Tax Agent, for a confidential 30-minute review.
                </p>
                <div className="space-y-2 pt-2">
                  <a
                    href={`https://wa.me/971529226958?text=${encodeURIComponent(
                      "Hello Glen Dias, I was reading your UAE tax insights and would like to book a confidential consultation."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-navy-950 hover:bg-gold-500 hover:text-navy-950 text-white font-display font-bold text-xs uppercase transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Book Free Consultation</span>
                  </a>
                  <a
                    href="https://wa.me/971529226958?text=Hi,%20I'd%20like%20to%20know%20more%20about%20your%20tax%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 font-display font-bold text-xs text-center block transition-colors"
                  >
                    Direct WhatsApp Desk
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Core Services Internal Linking Hub */}
        <section className="py-14 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-[10px] font-mono text-gold-600 uppercase font-bold tracking-wider block mb-1">
                EXPLORE TAX &amp; FORMATION ADVISORY
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-950">
                Turn UAE Regulatory Knowledge Into Compliant Business Growth
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2">
                Connect directly with certified tax agents and corporate structuring specialists in Dubai.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                onClick={() => onNavigate("/tax-planning-difc")}
                className="p-6 rounded-2xl border border-slate-200 hover:border-gold-400 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-600 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-navy-950 text-base group-hover:text-gold-600 mb-2">
                    DIFC Tax Compliance
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Corporate tax planning, DFSA statutory audit coordination, and 0% QFZP structuring in DIFC and DTEC.
                  </p>
                </div>
                <span className="text-xs font-semibold text-gold-600 flex items-center gap-1 mt-4">
                  Learn More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              <div
                onClick={() => onNavigate("/pricing")}
                className="p-6 rounded-2xl border border-slate-200 hover:border-gold-400 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-navy-950/10 text-navy-950 flex items-center justify-center mb-4">
                    <Tag className="w-5 h-5 text-navy-900" />
                  </div>
                  <h3 className="font-display font-bold text-navy-950 text-base group-hover:text-gold-600 mb-2">
                    Fixed-Fee Packages
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Transparent monthly accounting, VAT filings, and annual Corporate Tax returns with zero surprise fees.
                  </p>
                </div>
                <span className="text-xs font-semibold text-gold-600 flex items-center gap-1 mt-4">
                  View Packages <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              <div
                onClick={() => onNavigate("/company-setup")}
                className="p-6 rounded-2xl border border-slate-200 hover:border-gold-400 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-600 flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5 text-gold-600" />
                  </div>
                  <h3 className="font-display font-bold text-navy-950 text-base group-hover:text-gold-600 mb-2">
                    UAE Company Setup
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Fast-track Free Zone &amp; Mainland licensing with 100% foreign ownership and corporate bank accounts.
                  </p>
                </div>
                <span className="text-xs font-semibold text-gold-600 flex items-center gap-1 mt-4">
                  Start Formation <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              <div
                onClick={() => onNavigate("/uae-tax-planner")}
                className="p-6 rounded-2xl border border-slate-200 hover:border-gold-400 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-navy-950/10 text-navy-950 flex items-center justify-center mb-4">
                    <FileText className="w-5 h-5 text-navy-900" />
                  </div>
                  <h3 className="font-display font-bold text-navy-950 text-base group-hover:text-gold-600 mb-2">
                    Tax Planner Tool
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Simulate your Corporate Tax liability, test 0% Small Business Relief eligibility, and avoid penalties.
                  </p>
                </div>
                <span className="text-xs font-semibold text-gold-600 flex items-center gap-1 mt-4">
                  Calculate Tax <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Post Reader Modal */}
        {selectedPost && (
          <BlogModal
            blog={selectedPost}
            onClose={() => setSelectedPost(null)}
            onContact={() => {
              setSelectedPost(null);
              onNavigate("/contact");
            }}
          />
        )}
      </main>

      <PageFooter
        onNavigate={onNavigate}
        onOpenPrivacy={onOpenPrivacy}
        onOpenGooglePreferred={onOpenGooglePreferred}
      />
    </div>
  );
};

export default BlogsPage;
