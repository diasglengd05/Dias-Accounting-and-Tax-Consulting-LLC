import React, { useState } from "react";
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { validatePhoneField } from "../lib/validation";
import { getAccessToken } from "../lib/firebase";
import { submitToGoogleSheetsDirectly } from "../lib/sheetsService";

export type LeadQuoteVariant = "pricing" | "difc";

interface LeadQuoteSectionProps {
  variant: LeadQuoteVariant;
}

const JURISDICTION_OPTIONS = [
  "Dubai Mainland",
  "DIFC / DTEC",
  "SHAMS Free Zone",
  "IFZA / DMCC / Meydan",
  "New Business Setup",
  "Other UAE",
] as const;

const SERVICE_OPTIONS = [
  "Monthly IFRS Bookkeeping + VAT + CT (From AED 400/mo)",
  "9% Corporate Tax & 0% SBR Filing",
  "DIFC / DTEC 0% QFZP & Dividend Audit",
  "UAE E-Invoicing & ERP Setup (Zoho/Wafeq/Xero)",
  "New Company Formation + Tax Registration",
] as const;

const DIRECT_WHATSAPP_URL =
  "https://wa.me/971529226958?text=Hi%20Dias%20Accounting%2C%20I%20would%20like%20a%20quote%20for%20UAE%20accounting%20and%20tax%20compliance.";

const VARIANT_COPY: Record<
  LeadQuoteVariant,
  {
    eyebrow: string;
    heading: string;
    subtext: string;
    defaultJurisdiction: string;
    defaultService: string;
    sourceLabel: string;
  }
> = {
  pricing: {
    eyebrow: "TRANSPARENT FIXED-FEE RETAINERS · FROM AED 400/MONTH",
    heading: "Get a Custom UAE Accounting & Tax Package Quote in 60 Seconds",
    subtext:
      "FTA-Registered Tax Agents in Sharjah (SHAMS) & Dubai. Zero hidden hourly fees.",
    defaultJurisdiction: "Dubai Mainland",
    defaultService: "Monthly IFRS Bookkeeping + VAT + CT (From AED 400/mo)",
    sourceLabel: "Pricing Page (#get-quote)",
  },
  difc: {
    eyebrow: "DIFC & DTEC COMPLIANCE · 0% QFZP & DIVIDEND AUDITS",
    heading: "Book a Free 15-Minute DIFC / DTEC Corporate Tax & Audit Review",
    subtext:
      "Protect your 0% Qualifying Free Zone status, connected-person schedules, and dividend distributions.",
    defaultJurisdiction: "DIFC / DTEC",
    defaultService: "DIFC / DTEC 0% QFZP & Dividend Audit",
    sourceLabel: "DIFC / DTEC Tax Planning Page (#get-quote)",
  },
};

const WhatsAppSvgIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.156 5.281-1.375c1.469.797 3.109 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.531.078-1.203.109-1.938-.125-.453-.141-1.031-.328-1.766-.656-3.094-1.344-5.109-4.469-5.266-4.672-.156-.203-1.266-1.688-1.266-3.219 0-1.531.797-2.281 1.078-2.594.281-.313.625-.391.828-.391.203 0 .422.016.609.016.188 0 .453-.078.703.531.266.625.891 2.188.969 2.344.078.156.125.344.031.547-.094.203-.156.344-.313.516-.156.172-.328.391-.469.516-.156.141-.313.297-.141.609.172.313.781 1.297 1.672 2.094 1.156 1.031 2.125 1.359 2.438 1.516.313.156.5.125.688-.078.188-.203.797-.922 1.016-1.234.219-.313.422-.266.719-.156.297.109 1.875.891 2.203 1.047.328.156.547.234.625.375.078.141.078.813-.172 1.516z" />
  </svg>
);

export const LeadQuoteSection: React.FC<LeadQuoteSectionProps> = ({ variant }) => {
  const copy = VARIANT_COPY[variant];

  const [fullName, setFullName] = useState("");
  const [jurisdiction, setJurisdiction] = useState<string>(copy.defaultJurisdiction);
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<string>(copy.defaultService);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();

    if (trimmedName.length < 2) {
      setErrorMsg("Please enter your full name (at least 2 characters).");
      return;
    }

    const phoneValidation = validatePhoneField(trimmedPhone, "en");
    if (!phoneValidation.isValid) {
      setErrorMsg(phoneValidation.error || "Please enter a valid WhatsApp / mobile number.");
      return;
    }

    setIsSubmitting(true);
    let recordedId = "quote_" + Date.now();
    let backendSucceeded = false;

    const inquiryPayload = {
      name: trimmedName,
      email: "Quick Quote (WhatsApp / Phone Callback)",
      phone: trimmedPhone,
      company: jurisdiction,
      serviceType: service,
      message: `${copy.sourceLabel} | Jurisdiction: ${jurisdiction} | Primary Service: ${service}`,
    };

    try {
      let activeToken: string | null = null;
      try {
        activeToken = await getAccessToken();
      } catch {
        // Public submission does not require login
      }

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          ...inquiryPayload,
          accessToken: activeToken || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.inquiryId) recordedId = data.inquiryId;
        backendSucceeded = true;
      }
    } catch {
      // Fall through to Apps Script / local / mailto backup
    }

    if (!backendSucceeded) {
      try {
        const sheetFallbackOk = await submitToGoogleSheetsDirectly({
          name: inquiryPayload.name,
          email: inquiryPayload.email,
          phone: inquiryPayload.phone,
          company: inquiryPayload.company,
          serviceType: inquiryPayload.serviceType,
          message: inquiryPayload.message,
        });
        if (sheetFallbackOk) backendSucceeded = true;
      } catch {
        // Silent fallback
      }
    }

    try {
      const localRaw = localStorage.getItem("dias_local_inquiries");
      const localList = localRaw ? JSON.parse(localRaw) : [];
      localList.unshift({
        id: recordedId,
        ...inquiryPayload,
        createdAt: new Date().toISOString(),
        synced: backendSucceeded,
        status: "New Lead",
      });
      localStorage.setItem("dias_local_inquiries", JSON.stringify(localList));
    } catch {
      // Ignore storage quota issues
    }

    if (!backendSucceeded && typeof window !== "undefined") {
      const mailSubject = `UAE Accounting & Tax Quote Request - ${trimmedName} (${jurisdiction})`;
      const mailBody = [
        `Full Name: ${trimmedName}`,
        `Company / Jurisdiction: ${jurisdiction}`,
        `WhatsApp / Mobile: ${trimmedPhone}`,
        `Primary Service Needed: ${service}`,
        `Source: ${copy.sourceLabel}`,
      ].join("\n");
      const mailtoAnchor = document.createElement("a");
      mailtoAnchor.href = `mailto:info@diasuae.ae?subject=${encodeURIComponent(
        mailSubject
      )}&body=${encodeURIComponent(mailBody)}`;
      mailtoAnchor.click();
    }

    setReferenceId(recordedId);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <section
      id="get-quote"
      aria-labelledby={`get-quote-heading-${variant}`}
      className="bg-[#070d19] py-16 lg:py-20 border-t border-[#c5a059]/30"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="bg-[#0d1b2a] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl"
          style={{ border: "1px solid #c5a059" }}
        >
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8 sm:mb-10">
            <span className="inline-block font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#dec18c]">
              {copy.eyebrow}
            </span>
            <h2
              id={`get-quote-heading-${variant}`}
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#ffffff] leading-tight"
            >
              {copy.heading}
            </h2>
            <p className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
              {copy.subtext}
            </p>
          </div>

          {isSubmitted ? (
            <div
              role="status"
              aria-live="polite"
              className="rounded-2xl bg-[#070d19] border border-[#c5a059] p-6 sm:p-8 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#dec18c]">
                Quote &amp; Tax Check Request Received
              </h3>
              <p className="text-sm text-[#cbd5e1] max-w-xl mx-auto leading-relaxed">
                Thank you, <strong className="text-[#ffffff]">{fullName}</strong>. Our FTA-registered advisory desk has logged your request for{" "}
                <strong className="text-[#dec18c]">{service}</strong> ({jurisdiction}) and will message you on{" "}
                <strong className="text-[#ffffff]">{phone}</strong> within 15 minutes during UAE business hours.
              </p>
              {referenceId && (
                <p className="text-[11px] font-mono text-[#dec18c]/80">
                  Reference ID: {referenceId}
                </p>
              )}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={DIRECT_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-display font-bold text-sm text-[#ffffff] hover:bg-[#c5a059]/15 transition-colors"
                  style={{ border: "1px solid #c5a059" }}
                >
                  <WhatsAppSvgIcon className="w-4 h-4 text-[#25D366]" />
                  <span>Chat on WhatsApp (+971 52 922 6958)</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFullName("");
                    setPhone("");
                  }}
                  className="text-xs font-semibold text-[#cbd5e1] hover:text-[#dec18c] underline cursor-pointer py-2 px-3"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {errorMsg && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl bg-rose-950/60 border border-rose-400/50 px-4 py-3 text-xs sm:text-sm text-rose-200"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* 1. Full Name */}
                <div>
                  <label
                    htmlFor={`quote-fullname-${variant}`}
                    className="block text-xs font-semibold uppercase tracking-wider text-[#dec18c] mb-2"
                  >
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id={`quote-fullname-${variant}`}
                    name="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tariq Al Mansoor"
                    className="w-full rounded-xl bg-[#070d19] border border-[#c5a059]/45 focus:border-[#c5a059] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/40 px-4 py-3 text-sm text-[#ffffff] placeholder:text-slate-400 transition-colors"
                  />
                </div>

                {/* 2. Company Name or Jurisdiction */}
                <div>
                  <label
                    htmlFor={`quote-jurisdiction-${variant}`}
                    className="block text-xs font-semibold uppercase tracking-wider text-[#dec18c] mb-2"
                  >
                    Company Name or Jurisdiction
                  </label>
                  <select
                    id={`quote-jurisdiction-${variant}`}
                    name="jurisdiction"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full rounded-xl bg-[#070d19] border border-[#c5a059]/45 focus:border-[#c5a059] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/40 px-4 py-3 text-sm text-[#ffffff] transition-colors"
                  >
                    {JURISDICTION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#070d19] text-[#ffffff]">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. WhatsApp / Mobile Number */}
                <div>
                  <label
                    htmlFor={`quote-phone-${variant}`}
                    className="block text-xs font-semibold uppercase tracking-wider text-[#dec18c] mb-2"
                  >
                    WhatsApp / Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id={`quote-phone-${variant}`}
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 000 0000"
                    className="w-full rounded-xl bg-[#070d19] border border-[#c5a059]/45 focus:border-[#c5a059] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/40 px-4 py-3 text-sm text-[#ffffff] placeholder:text-slate-400 transition-colors"
                  />
                </div>

                {/* 4. Primary Service Needed */}
                <div>
                  <label
                    htmlFor={`quote-service-${variant}`}
                    className="block text-xs font-semibold uppercase tracking-wider text-[#dec18c] mb-2"
                  >
                    Primary Service Needed
                  </label>
                  <select
                    id={`quote-service-${variant}`}
                    name="service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full rounded-xl bg-[#070d19] border border-[#c5a059]/45 focus:border-[#c5a059] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/40 px-4 py-3 text-sm text-[#ffffff] transition-colors"
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#070d19] text-[#ffffff]">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions Row: Gold Submit + Secondary Outline WhatsApp CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#c5a059] hover:bg-[#dec18c] disabled:opacity-70 text-[#070d19] font-display font-extrabold text-sm px-6 py-4 transition-all shadow-lg shadow-[#c5a059]/20 cursor-pointer"
                >
                  <span>{isSubmitting ? "Submitting Request..." : "Request Free Quote & Tax Check"}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <a
                  href={DIRECT_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-xl bg-transparent hover:bg-[#c5a059]/12 text-[#ffffff] font-display font-bold text-sm px-6 py-4 transition-all text-center"
                  style={{ border: "1px solid #c5a059" }}
                >
                  <WhatsAppSvgIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>Chat on WhatsApp (+971 52 922 6958)</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-1 text-[11px] text-[#cbd5e1]/80">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>FTA Registered Tax Agency</span>
                </span>
                <span>•</span>
                <span>SHAMS HQ &amp; Dubai Advisory</span>
                <span>•</span>
                <span>Confidential Consultation</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default LeadQuoteSection;
