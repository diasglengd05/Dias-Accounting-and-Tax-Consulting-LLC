import React, { useEffect, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  MessageCircle,
  Shield,
  Calendar,
  CheckCircle2,
  Send,
  Building,
  ExternalLink,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { applyPageSEO } from "../lib/seo";

interface ContactPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  // Form fields
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceInterestedIn, setServiceInterestedIn] = useState("Corporate Tax Registration and Filing");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    applyPageSEO({
      title: "Book Tax Consultation & Office Desk | Dias UAE",
      description:
        "Schedule a confidential consultation with Glen Dias, FTA Registered Tax Agent. Office location in SHAMS Business Center & Dubai with direct WhatsApp advisory.",
      canonicalPath: "/contact",
      keywords:
        "contact tax consultant dubai, book tax consultation uae, fta tax agent phone number, dias accounting office",
      ogImage: "/api/og?title=Schedule+Confidential+Tax+Consultation&author=Glen+Dias&tag=FTA+Registered+Agent",
    });
    window.scrollTo({ top: 0, behavior: "instant" });

    // Preselect service if passed via URL or session
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("service") || sessionStorage.getItem("dias_selected_service");
      if (s) {
        setServiceInterestedIn(s);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "Hello Dias UAE Advisory Team,",
      "",
      "I would like to book a consultation:",
      `• Name: ${name || "N/A"}`,
      `• Company: ${companyName || "N/A"}`,
      `• Business Email: ${email || "N/A"}`,
      `• Phone: ${phone || "N/A"}`,
      `• Service Interested In: ${serviceInterestedIn || "General Advisory"}`,
      `• Message / Details: ${message || "N/A"}`,
    ];
    const text = lines.join("\n");
    const waUrl = `https://wa.me/971529226958?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-gold-500/30 selection:text-navy-950">
      <PageNavigation
        currentPath="/contact"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-20 border-b border-gold-500/20 overflow-hidden">
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
              <span className="text-white">Contact &amp; Consultation Desk</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>FTA Registered Tax Agency · Confidential Review</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                Book Your Free UAE Tax &amp; Accounting Consultation
              </h1>
              <p className="text-slate-300 text-base leading-relaxed">
                Connect directly with Glen Dias, FTA Registered Tax Agent. Whether you need corporate tax assessment, VAT compliance, backlog accounting cleanup, or company incorporation, our senior advisory team is ready to help your business stay compliant.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Desk & Form Grid */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left 5 Cols: Direct Contact Details & Location */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-mono font-bold text-gold-600 uppercase tracking-wider">
                  DIRECT ADVISORY CHANNELS
                </span>
                <h2 className="font-display text-2xl font-bold text-navy-950 mt-1 mb-2">
                  Get in Touch Directly
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Fast response times across phone, WhatsApp, email, or in-person meetings at our Dubai and Sharjah offices.
                </p>
              </div>

              {/* Direct Channels Cards */}
              <div className="space-y-3.5">
                {/* Tap to Call */}
                <a
                  href="tel:+971529226958"
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4 hover:border-gold-400 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                      Direct Advisory Phone (Tap to Call)
                    </span>
                    <span className="font-display text-sm sm:text-base font-bold text-navy-950">
                      +971 52 922 6958
                    </span>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/971529226958?text=Hi,%20I'd%20like%20to%20know%20more%20about%20your%20tax%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 shadow-xs flex items-center gap-4 hover:border-emerald-400 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold tracking-wider block">
                      Direct WhatsApp Live Channel
                    </span>
                    <span className="font-display text-sm sm:text-base font-bold text-emerald-950">
                      +971 52 922 6958
                    </span>
                  </div>
                </a>

                {/* Mailto */}
                <a
                  href="mailto:info@diasuae.ae"
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4 hover:border-gold-400 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                      Official Client Desk Email
                    </span>
                    <span className="font-display text-sm sm:text-base font-bold text-navy-950">
                      info@diasuae.ae
                    </span>
                  </div>
                </a>

                {/* Office Address */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                      Registered Office
                    </span>
                    <p className="font-bold text-navy-950">
                      Dias Accounting &amp; Tax Consulting LLC
                    </p>
                    <p>
                      Sharjah Media City (SHAMS), Al Messaned, Sharjah, United Arab Emirates
                    </p>
                    <p className="text-[11px] text-slate-500">
                      P.O. Box 515000 · Serving Dubai, Sharjah &amp; UAE clients remotely &amp; on-site
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-slate-600">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                      Business Hours (GST)
                    </span>
                    <p className="font-bold text-navy-950 mt-0.5">
                      Monday to Friday: 9:00 AM – 6:00 PM
                    </p>
                    <p className="text-slate-500">
                      Saturday: 10:00 AM – 2:00 PM (By Appointment)
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Sunday: Closed (Emergency WhatsApp Desk Active)
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Maps Location Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                  Office Location (Sharjah Media City)
                </span>
                <div className="aspect-video rounded-xl bg-navy-950 text-white border border-slate-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center mb-2">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="font-display font-bold text-sm text-white">
                    Sharjah Media City (SHAMS)
                  </span>
                  <span className="text-xs text-slate-400 mt-1 max-w-xs">
                    Sharjah Media City (SHAMS), Al Messaned, Sharjah, United Arab Emirates — serving Dubai, Sharjah &amp; UAE clients remotely and on-site.
                  </span>
                  <a
                    href="https://maps.google.com/?q=Sharjah+Media+City+SHAMS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-gold-500 hover:text-navy-950 text-gold-300 text-xs font-mono font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Complete Contact & Consultation Booking Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-gold-600 uppercase font-bold mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>CONSULTATION INQUIRY</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950 mb-2">
                  Send Your Inquiry
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mb-8 leading-relaxed">
                  Fill in the details below. Our senior tax consultant will review your business standing and respond within 24 hours.
                </p>

                {submitted ? (
                  <div className="p-8 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-center space-y-4">
                    <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                    <h3 className="font-display font-extrabold text-xl text-emerald-950">
                      Thank You! Your Inquiry Has Been Received.
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-md mx-auto">
                      Thank you, <strong>{name}</strong>. Your consultation request for <strong>{serviceInterestedIn}</strong> has been prepared and opened in WhatsApp (+971 52 922 6958).
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <a
                        href={`https://wa.me/971529226958?text=${encodeURIComponent(
                          `Hello Dias UAE Advisory Team,\n\nFollowing up on my consultation inquiry:\n• Name: ${name || "Client"}\n• Company: ${companyName || "N/A"}\n• Service: ${serviceInterestedIn}\n• Phone: ${phone || "N/A"}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Re-open WhatsApp Message</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="bg-navy-950 text-white font-display font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-gold-500 hover:text-navy-950 cursor-pointer transition-colors"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Tariq Mansoor"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Apex Trading LLC"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Business Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. tariq@apex.ae"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Phone Number / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +971 52 922 6958"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                      </div>
                    </div>

                    {/* Service Interested In Dropdown */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Service Interested In *
                      </label>
                      <select
                        value={serviceInterestedIn}
                        onChange={(e) => setServiceInterestedIn(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                      >
                        <option value="Corporate Tax Registration and Filing">
                          Corporate Tax Registration and Filing (9% / SBR)
                        </option>
                        <option value="VAT Registration and Returns">
                          VAT Registration and Returns (5% Quarterly Filing)
                        </option>
                        <option value="Monthly Bookkeeping">
                          Monthly Bookkeeping &amp; Accounting Packages
                        </option>
                        <option value="Audit Readiness and Advisory">
                          Audit Readiness and Statutory Advisory
                        </option>
                        <option value="Backlog Accounting Cleanup">
                          Backlog Accounting &amp; Historical Ledger Cleanup
                        </option>
                        <option value="Free Zone 0% QFZP Structuring">
                          Free Zone 0% Qualifying Free Zone Person (QFZP)
                        </option>
                        <option value="Company Setup &amp; Licensing">
                          UAE Company Setup &amp; Bank Account Assistance
                        </option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Your Message / Specific Requirements *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about your company structure, annual revenue range, or specific tax deadlines you are facing..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-emerald-600 text-white font-display font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/25 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send Consultation Inquiry via WhatsApp</span>
                    </button>
                    <p className="text-[11px] text-slate-500 text-center">
                      Opens WhatsApp message directly to our senior advisor at <strong>+971 52 922 6958</strong>.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>

      <PageFooter
        onNavigate={onNavigate}
        onOpenPrivacy={onOpenPrivacy}
        onOpenGooglePreferred={onOpenGooglePreferred}
      />
    </div>
  );
};

export default ContactPage;
