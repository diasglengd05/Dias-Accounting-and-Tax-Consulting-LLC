import React, { useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import {
  applyPageSEO,
  buildBreadcrumbSchema,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";
import { validateEmailField, validatePhoneField } from "../lib/validation";
import { submitToGoogleSheetsDirectly } from "../lib/sheetsService";

interface ContactPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

const SERVICE_OPTIONS = [
  {
    value: "Corporate Tax Registration and Filing",
    label: "Corporate Tax Registration & Filing (9% / 0% SBR)",
  },
  {
    value: "VAT Registration and Returns",
    label: "VAT Registration & Quarterly Form 201 Returns",
  },
  {
    value: "Monthly Bookkeeping",
    label: "Monthly IFRS Bookkeeping & Accounting Packages",
  },
  {
    value: "Audit Readiness and Advisory",
    label: "Audit Readiness & Dividend Solvency Audits",
  },
  {
    value: "Backlog Accounting Cleanup",
    label: "Backlog Accounting & Historical Ledger Cleanup",
  },
  {
    value: "Free Zone 0% QFZP Structuring",
    label: "Free Zone 0% QFZP Structuring (DIFC / DTEC / SHAMS)",
  },
  {
    value: "Company Setup & Licensing",
    label: "UAE Company Setup & Corporate Bank Assistance",
  },
];

const CALL_EXPECTATIONS = [
  "Review your current Mainland or Free Zone setup and ledger readiness.",
  "Flag immediate FTA compliance gaps, filing windows, and 0% relief opportunities.",
  "Outline transparent fixed-fee retainer options—zero pressure and zero hard sell.",
];

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceInterestedIn, setServiceInterestedIn] = useState(
    "Corporate Tax Registration and Filing"
  );
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  useEffect(() => {
    applyPageSEO({
      title: "Contact Dias Accounting | Book Free UAE Tax Consultation",
      description:
        "Schedule a free consultation with FTA-Registered Tax Agent Glen Dias. SHAMS & Dubai advisory desk for UAE Corporate Tax, 5% VAT, and IFRS bookkeeping.",
      canonicalPath: "/contact",
      keywords:
        "contact tax consultant dubai, book tax consultation uae, fta tax agent phone number, dias accounting office",
    });
    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ])
    );
    window.scrollTo({ top: 0, behavior: "instant" });

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const preselected =
        params.get("service") || sessionStorage.getItem("dias_selected_service");
      if (preselected) {
        setServiceInterestedIn(preselected);
      }
    }

    return () => {
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, []);

  const clearFieldError = (field: keyof FieldErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: FieldErrors = {};
    if (name.trim().length < 2) {
      nextErrors.name = "Please enter your full name.";
    }

    const emailCheck = validateEmailField(email, "en");
    if (!emailCheck.isValid) {
      nextErrors.email = emailCheck.error;
    }

    const phoneCheck = validatePhoneField(phone, "en");
    if (!phoneCheck.isValid) {
      nextErrors.phone = phoneCheck.error;
    }

    if (message.trim().length < 6) {
      nextErrors.message =
        "Please share a brief note about your UAE company or tax question.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const lines = [
      "Hello Dias UAE Advisory Team,",
      "",
      "I would like to book a consultation:",
      `• Name: ${name.trim()}`,
      `• Company: ${companyName.trim() || "N/A"}`,
      `• Business Email: ${email.trim()}`,
      `• Phone: ${phone.trim()}`,
      `• Service Interested In: ${serviceInterestedIn}`,
      `• Message / Details: ${message.trim()}`,
    ];
    const waHref = `https://wa.me/971529226958?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
    setWhatsappUrl(waHref);

    // Sync to Google Sheets non-blockingly while preserving direct WhatsApp handoff
    try {
      await submitToGoogleSheetsDirectly({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: companyName.trim() || "Not specified",
        serviceType: serviceInterestedIn,
        message: message.trim(),
      });
    } catch {
      // Non-blocking fallback
    }

    try {
      window.open(waHref, "_blank", "noopener,noreferrer");
    } catch {
      // Handled via clickable confirmation button in success view
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const mapsApiKey = (import.meta as unknown as { env?: Record<string, string> })
    .env?.VITE_GOOGLE_MAPS_API_KEY;
  const mapQuery = "Sharjah+Media+City+(Shams)+Sharjah+UAE";
  const mapEmbedUrl = mapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${mapQuery}&center=25.3214,55.5126&zoom=14&solution_id=gmp_mcp_codeassist_v1_aistudio`
    : `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#0D1B2A] antialiased">
      <PageNavigation
        currentPath="/contact"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* 1. Clean Two-Column Executive Split */}
        <section className="bg-[#FFFFFF] pt-12 pb-20 lg:pt-20 lg:pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs sm:text-sm text-[#475569] mb-10"
            >
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:text-[#0D1B2A] transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#0D1B2A] font-medium">Contact</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
              {/* Left Column (~45%): Headline, Expectations & Direct Contact Block */}
              <div className="lg:col-span-5 space-y-10">
                <div className="space-y-4">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                    FTA-Registered Tax Agency · UAE
                  </span>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[#0D1B2A] tracking-tight leading-[1.12]">
                    Book Your Free Consultation
                  </h1>
                  <p className="text-base text-[#475569] leading-[1.65] max-w-[46ch]">
                    Speak directly with Glen Dias and our senior UAE tax team for clear guidance on Corporate Tax, VAT, and IFRS accounting.
                  </p>
                </div>

                {/* What to expect on our 15-minute call */}
                <div className="space-y-3.5 pt-2">
                  <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#0D1B2A]">
                    What to expect on our 15-minute call
                  </h2>
                  <ul className="space-y-3">
                    {CALL_EXPECTATIONS.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm sm:text-[15px] text-[#475569] leading-[1.6]"
                      >
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Clean Direct Contact Block (Monochrome Icons) */}
                <div className="pt-8 border-t border-[#E2E8F0] space-y-5">
                  <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#0D1B2A]">
                    Direct Contact
                  </h2>

                  <dl className="space-y-4 text-sm">
                    <div className="flex items-start gap-3.5">
                      <Mail
                        className="w-4 h-4 text-[#475569] mt-1 shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-xs text-[#64748B] font-medium">
                          Email
                        </dt>
                        <dd className="mt-0.5">
                          <a
                            href="mailto:info@diasuae.ae"
                            className="font-semibold text-[#0D1B2A] hover:text-[#1B4332] transition-colors"
                          >
                            info@diasuae.ae
                          </a>
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <Phone
                        className="w-4 h-4 text-[#475569] mt-1 shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-xs text-[#64748B] font-medium">
                          Phone / WhatsApp
                        </dt>
                        <dd className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <a
                            href="tel:+971529226958"
                            className="font-semibold text-[#0D1B2A] hover:text-[#1B4332] transition-colors tabular-nums"
                          >
                            +971 52 922 6958
                          </a>
                          <span className="text-slate-300" aria-hidden="true">
                            ·
                          </span>
                          <a
                            href="https://wa.me/971529226958?text=Hi%2C%20I%27d%20like%20to%20book%20a%20free%20UAE%20tax%20consultation."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-[#1B4332] hover:underline"
                          >
                            Message on WhatsApp
                          </a>
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <MapPin
                        className="w-4 h-4 text-[#475569] mt-1 shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-xs text-[#64748B] font-medium">
                          UAE Office Location
                        </dt>
                        <dd className="mt-0.5 text-[#0D1B2A] font-medium leading-relaxed">
                          Sharjah Media City (SHAMS), Al Messaned, Sharjah, UAE
                          <span className="block text-xs font-normal text-[#475569] mt-0.5">
                            P.O. Box 515000 · Serving Dubai, Sharjah &amp; all Emirates
                          </span>
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <Clock
                        className="w-4 h-4 text-[#475569] mt-1 shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-xs text-[#64748B] font-medium">
                          Working Hours (GST)
                        </dt>
                        <dd className="mt-0.5 text-[#0D1B2A] font-medium tabular-nums">
                          Mon – Fri: 9:00 AM – 6:00 PM
                          <span className="block text-xs font-normal text-[#475569] mt-0.5">
                            Saturday: 10:00 AM – 2:00 PM (By Appointment)
                          </span>
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Right Column (~55%): Elevated Consultation Form Card */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-7 sm:p-10 shadow-[0_12px_36px_-18px_rgba(13,27,42,0.12)]">
                  {submitted ? (
                    <div className="py-8 text-center space-y-5">
                      <div className="w-12 h-12 rounded-full bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-2 max-w-md mx-auto">
                        <h2 className="font-display text-2xl font-bold text-[#0D1B2A]">
                          Consultation Request Received
                        </h2>
                        <p className="text-sm sm:text-base text-[#475569] leading-[1.6]">
                          Thank you, <strong className="text-[#0D1B2A]">{name}</strong>. Your inquiry regarding{" "}
                          <strong className="text-[#0D1B2A]">{serviceInterestedIn}</strong> has been logged for our senior advisory desk.
                        </p>
                      </div>
                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                        {whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
                          >
                            <span>Continue on WhatsApp</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSubmitted(false);
                            setMessage("");
                          }}
                          className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0D1B2A] text-sm font-semibold transition-colors cursor-pointer"
                        >
                          Send Another Inquiry
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                      <div className="pb-2 border-b border-[#E2E8F0]">
                        <h2 className="font-display text-xl font-bold text-[#0D1B2A]">
                          Request Your Consultation
                        </h2>
                        <p className="text-sm text-[#475569] mt-1">
                          Share a few details so our tax advisor can prepare before we speak.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="contact-name"
                            className="block text-sm font-medium text-[#0D1B2A] mb-1.5"
                          >
                            Full Name <span className="text-[#1B4332]">*</span>
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            autoComplete="name"
                            placeholder="e.g. Tariq Mansoor"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              clearFieldError("name");
                            }}
                            aria-invalid={Boolean(errors.name)}
                            className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border text-sm text-[#0D1B2A] placeholder:text-slate-400 bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-colors ${
                              errors.name ? "border-red-500" : "border-[#E2E8F0]"
                            }`}
                          />
                          {errors.name && (
                            <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="contact-company"
                            className="block text-sm font-medium text-[#0D1B2A] mb-1.5"
                          >
                            Company Name <span className="text-[#64748B] font-normal">(Optional)</span>
                          </label>
                          <input
                            id="contact-company"
                            type="text"
                            autoComplete="organization"
                            placeholder="e.g. Apex Trading LLC"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#0D1B2A] placeholder:text-slate-400 bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="contact-email"
                            className="block text-sm font-medium text-[#0D1B2A] mb-1.5"
                          >
                            Work Email <span className="text-[#1B4332]">*</span>
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            autoComplete="email"
                            placeholder="e.g. tariq@company.ae"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              clearFieldError("email");
                            }}
                            aria-invalid={Boolean(errors.email)}
                            className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border text-sm text-[#0D1B2A] placeholder:text-slate-400 bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-colors ${
                              errors.email ? "border-red-500" : "border-[#E2E8F0]"
                            }`}
                          />
                          {errors.email && (
                            <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="contact-phone"
                            className="block text-sm font-medium text-[#0D1B2A] mb-1.5"
                          >
                            Phone / WhatsApp Number <span className="text-[#1B4332]">*</span>
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            autoComplete="tel"
                            placeholder="+971 50 123 4567"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              clearFieldError("phone");
                            }}
                            aria-invalid={Boolean(errors.phone)}
                            className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border text-sm text-[#0D1B2A] placeholder:text-slate-400 bg-[#FFFFFF] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-colors ${
                              errors.phone ? "border-red-500" : "border-[#E2E8F0]"
                            }`}
                          />
                          {errors.phone && (
                            <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-service"
                          className="block text-sm font-medium text-[#0D1B2A] mb-1.5"
                        >
                          Service Needed
                        </label>
                        <select
                          id="contact-service"
                          value={serviceInterestedIn}
                          onChange={(e) => setServiceInterestedIn(e.target.value)}
                          className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#0D1B2A] bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-colors"
                        >
                          {SERVICE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-details"
                          className="block text-sm font-medium text-[#0D1B2A] mb-1.5"
                        >
                          Brief Details <span className="text-[#1B4332]">*</span>
                        </label>
                        <textarea
                          id="contact-details"
                          rows={4}
                          placeholder="Tell us about your UAE entity type (Mainland or Free Zone), revenue range, or upcoming FTA filing deadline..."
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            clearFieldError("message");
                          }}
                          aria-invalid={Boolean(errors.message)}
                          className={`w-full px-3.5 py-3 rounded-xl border text-sm text-[#0D1B2A] placeholder:text-slate-400 bg-[#FFFFFF] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-colors ${
                            errors.message ? "border-red-500" : "border-[#E2E8F0]"
                          }`}
                        />
                        {errors.message && (
                          <p className="mt-1.5 text-xs text-red-600">{errors.message}</p>
                        )}
                      </div>

                      <div className="pt-1 space-y-3">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full min-h-[50px] px-6 py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] disabled:opacity-70 text-white text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Submitting Request...</span>
                            </>
                          ) : (
                            <span>Request Free Consultation</span>
                          )}
                        </button>
                        <p className="text-xs text-[#64748B] text-center">
                          We respond within 1 business day. Your details stay strictly confidential.
                        </p>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Minimal, Cleanly Framed Office Location Map */}
        <section className="bg-[#F8FAFC] border-t border-[#E2E8F0] py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#856422]">
                  Registered UAE Office
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0D1B2A] tracking-tight">
                  Sharjah Media City (SHAMS) · Serving Dubai &amp; UAE
                </h2>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] hover:text-[#0D1B2A] transition-colors min-h-[44px]"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#FFFFFF] h-72 sm:h-80">
              <iframe
                title="Dias Accounting Sharjah Media City Office Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
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
