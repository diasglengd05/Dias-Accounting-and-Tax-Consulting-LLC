import React, { useState } from "react";
import { X, Download, FileText, CheckCircle2, Mail, Phone, Building2, User, ArrowRight, RefreshCw, Send, Check, Eye, AlertCircle } from "lucide-react";
import { submitToGoogleSheetsDirectly } from "../lib/sheetsService";
import { downloadCompliancePlaybook } from "../lib/playbookPdfGenerator";
import { useLanguage } from "../i18n/LanguageContext";
import { validateContactForm, validateEmailField, validatePhoneField } from "../lib/validation";

interface LeadMagnetDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadMagnetDownloadModal({ isOpen, onClose }: LeadMagnetDownloadModalProps) {
  const { language, isRTL } = useLanguage();
  const isAr = language === "ar";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState<boolean | null>(null);
  const [isReSending, setIsReSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setFullName(val);
    if (touched.name) {
      setFieldErrors(prev => ({
        ...prev,
        name: val.trim() ? undefined : (isAr ? "الاسم الكامل مطلوب" : "Full name is required.")
      }));
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (touched.email) {
      const res = validateEmailField(val, isAr ? "ar" : "en");
      setFieldErrors(prev => ({ ...prev, email: res.isValid ? undefined : res.error }));
    }
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (touched.phone) {
      const res = validatePhoneField(val, isAr ? "ar" : "en");
      setFieldErrors(prev => ({ ...prev, phone: res.isValid ? undefined : res.error }));
    }
  };

  const handleBlur = (field: "name" | "email" | "phone") => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === "name") {
      setFieldErrors(prev => ({
        ...prev,
        name: fullName.trim() ? undefined : (isAr ? "الاسم الكامل مطلوب" : "Full name is required.")
      }));
    } else if (field === "email") {
      const res = validateEmailField(email, isAr ? "ar" : "en");
      setFieldErrors(prev => ({ ...prev, email: res.isValid ? undefined : res.error }));
    } else if (field === "phone") {
      const res = validatePhoneField(phone, isAr ? "ar" : "en");
      setFieldErrors(prev => ({ ...prev, phone: res.isValid ? undefined : res.error }));
    }
  };

  if (!isOpen) return null;

  const triggerDownload = async () => {
    return await downloadCompliancePlaybook({
      name: fullName.trim() || (isAr ? "الرئيس التنفيذي" : "Executive"),
      email: email.trim(),
      company: company.trim() || "N/A",
      phone: phone.trim(),
      language: isAr ? "ar" : "en",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateContactForm(
      { name: fullName, email, phone },
      isAr ? "ar" : "en"
    );
    setTouched({ name: true, email: true, phone: true });

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setSubmitError(
        validation.errors.email ||
        validation.errors.phone ||
        validation.errors.name ||
        (isAr ? "يرجى التحقق من صحة البريد ورقم الهاتف قبل المتابعة." : "Please provide a valid phone number and email format.")
      );
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    // 1. Immediately trigger the dynamic PDF download to the user's device
    await triggerDownload();

    // 2. Dispatch email request to backend
    try {
      const emailRes = await fetch("/api/send-playbook-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: email,
          phone: phone,
          company: company || "N/A",
          language: isAr ? "ar" : "en",
        }),
      });

      if (emailRes.ok) {
        const data = await emailRes.json();
        setEmailSentStatus(data.emailSent || false);
      } else {
        setEmailSentStatus(false);
      }
    } catch (err) {
      console.warn("Backend email dispatch note:", err);
      setEmailSentStatus(false);
    }

    // 3. Sync to Google Sheets
    try {
      await submitToGoogleSheetsDirectly({
        name: fullName,
        email: email,
        phone: phone,
        company: company || "N/A",
        serviceType: "Lead Magnet: 2026 UAE Corporate Tax & VAT Compliance Playbook",
        message: `Requested 2026 UAE Corporate Tax & VAT Compliance Playbook. Lead: ${fullName}, ${email}, ${phone}, Company: ${company}`,
      });
    } catch (err) {
      console.warn("Lead magnet sheets submission sync:", err);
    }

    setIsSubmitting(false);
    setIsDownloaded(true);
  };

  const handleResendEmail = async () => {
    if (!email) return;
    setIsReSending(true);
    try {
      const emailRes = await fetch("/api/send-playbook-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: email,
          phone: phone,
          company: company || "N/A",
          language: isAr ? "ar" : "en",
        }),
      });
      if (emailRes.ok) {
        setEmailSentStatus(true);
      }
    } catch (err) {
      console.warn("Resend email failed:", err);
    } finally {
      setIsReSending(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-magnet-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 ${isRTL ? "left-5" : "right-5"} p-2 rounded-full text-slate-400 hover:text-navy-950 hover:bg-slate-100 transition-colors z-10`}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isDownloaded ? (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-700 text-xs font-bold">
                <FileText className="w-3.5 h-3.5" />
                <span>{isAr ? "دليل تنفيذي مجاني لعام 2026" : "Free 2026 Executive Guide"}</span>
              </div>
              
              <h3 id="lead-magnet-modal-title" className="font-display text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight">
                {isAr ? "دليل الامتثال لضريبة الشركات والقيمة المضافة لعام 2026" : "2026 UAE Corporate Tax & VAT Compliance Playbook"}
              </h3>
              
              <p className="text-slate-600 text-xs sm:text-sm">
                {isAr 
                  ? "احصل على الدليل الإرشادي الرسمي المكون من 15 صفحة من إعداد دياز للمحاسبة للرؤساء التنفيذيين والمديرين الماليين وأصحاب الأعمال في دبي والمناطق الحرة."
                  : "Get the official 15-page handbook prepared by Dias Accounting for Dubai Mainland and Free Zone CEOs, CFOs, and business owners."}
              </p>
            </div>

            {/* Checklist highlights preview */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 text-xs text-slate-700">
              <span className="font-bold text-navy-950 uppercase tracking-wider text-[11px] block">
                {isAr ? "ما يحتويه هذا الدليل:" : "What is included in this guide:"}
              </span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? "الجدول الزمني لتسجيل وإقرارات ضريبة الشركات عبر منصة إمارات تاكس 2026" : "2026 EmaraTax Corporate Tax registration & return timeline"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? "اختبار الدخل المؤهل لنسبة 0% للمناطق الحرة (QFZP) ومتطلبات الوجود الفعلي" : "Free Zone 0% Qualifying Income (QFZP) test & substance rules"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? "قائمة التحقق خطوة بخطوة لتسهيلات الأعمال الصغيرة (حتى 3 ملايين درهم)" : "Small Business Relief (AED 3M) step-by-step checklist"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? "دليل فحص الفواتير الضريبية واسترداد ضريبة المدخلات بنسبة 100%" : "10-Point VAT invoice audit & 100% input tax recovery guide"}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="lead-magnet-fullname" className="text-[10px] font-bold text-slate-700 uppercase block">
                      {isAr ? "الاسم الكامل *" : "Full Name *"}
                    </label>
                    {touched.name && !fieldErrors.name && fullName.trim() && (
                      <span className="text-[10px] text-emerald-600 font-semibold inline-flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <User className={`w-3.5 h-3.5 text-slate-400 absolute top-3 ${isRTL ? "right-3" : "left-3"}`} />
                    <input
                      id="lead-magnet-fullname"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      aria-invalid={touched.name && !!fieldErrors.name}
                      value={fullName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      onBlur={() => handleBlur("name")}
                      placeholder={isAr ? "محمد الهاشمي" : "Glen Dias"}
                      className={`w-full text-xs py-2 border rounded-xl outline-none transition-all ${
                        touched.name && fieldErrors.name
                          ? "border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400"
                          : touched.name && fullName.trim()
                          ? "border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-500"
                          : "border-slate-200 focus:ring-2 focus:ring-gold-500"
                      } ${isRTL ? "pr-8 pl-3" : "pl-8 pr-3"}`}
                    />
                  </div>
                  {touched.name && fieldErrors.name && (
                    <p className="mt-1 text-[10px] font-medium text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{fieldErrors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lead-magnet-company" className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
                    {isAr ? "اسم الشركة" : "Company Name"}
                  </label>
                  <div className="relative">
                    <Building2 className={`w-3.5 h-3.5 text-slate-400 absolute top-3 ${isRTL ? "right-3" : "left-3"}`} />
                    <input
                      id="lead-magnet-company"
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={isAr ? "شركتي ذ.م.م" : "My Business LLC"}
                      className={`w-full text-xs py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none ${isRTL ? "pr-8 pl-3" : "pl-8 pr-3"}`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="lead-magnet-email" className="text-[10px] font-bold text-slate-700 uppercase block">
                      {isAr ? "البريد الإلكتروني المهني *" : "Work Email *"}
                    </label>
                    {touched.email && !fieldErrors.email && email.trim() && (
                      <span className="text-[10px] text-emerald-600 font-semibold inline-flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> {isAr ? "صالح" : "Valid"}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className={`w-3.5 h-3.5 text-slate-400 absolute top-3 ${isRTL ? "right-3" : "left-3"}`} />
                    <input
                      id="lead-magnet-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      aria-invalid={touched.email && !!fieldErrors.email}
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="name@company.com"
                      className={`w-full text-xs py-2 border rounded-xl outline-none transition-all ${
                        touched.email && fieldErrors.email
                          ? "border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400"
                          : touched.email && !fieldErrors.email && email.trim()
                          ? "border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-500"
                          : "border-slate-200 focus:ring-2 focus:ring-gold-500"
                      } ${isRTL ? "pr-8 pl-3" : "pl-8 pr-3"}`}
                    />
                  </div>
                  {touched.email && fieldErrors.email && (
                    <p className="mt-1 text-[10px] font-medium text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{fieldErrors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="lead-magnet-phone" className="text-[10px] font-bold text-slate-700 uppercase block">
                      {isAr ? "رقم الواتساب / الهاتف *" : "WhatsApp / Mobile *"}
                    </label>
                    {touched.phone && !fieldErrors.phone && phone.trim() && (
                      <span className="text-[10px] text-emerald-600 font-semibold inline-flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> {isAr ? "صالح" : "Valid"}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Phone className={`w-3.5 h-3.5 text-slate-400 absolute top-3 ${isRTL ? "right-3" : "left-3"}`} />
                    <input
                      id="lead-magnet-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      aria-invalid={touched.phone && !!fieldErrors.phone}
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="+971 50 123 4567"
                      className={`w-full text-xs py-2 border rounded-xl outline-none font-mono transition-all ${
                        touched.phone && fieldErrors.phone
                          ? "border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400"
                          : touched.phone && !fieldErrors.phone && phone.trim()
                          ? "border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-500"
                          : "border-slate-200 focus:ring-2 focus:ring-gold-500"
                      } ${isRTL ? "pr-8 pl-3" : "pl-8 pr-3"}`}
                    />
                  </div>
                  {touched.phone && fieldErrors.phone && (
                    <p className="mt-1 text-[10px] font-medium text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{fieldErrors.phone}</span>
                    </p>
                  )}
                  {!touched.phone && (
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      {isAr ? "7-15 رقماً مع رمز الدولة" : "7-15 digits (e.g. +971 50 123 4567)"}
                    </span>
                  )}
                </div>
              </div>

              {submitError && (
                <div className="text-[11px] text-rose-700 bg-rose-50 border border-rose-100 p-2 rounded-lg font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-navy-950 hover:bg-navy-900 text-white font-display font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span>{isAr ? "جاري تجهيز التحميل وإرسال النسخة..." : "Preparing PDF & Sending Copy..."}</span>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-gold-400" />
                    <span>{isAr ? "تحميل الدليل الشامل فوراً (PDF وإرسال للبريد)" : "Download Free Compliance Playbook (Instant PDF + Email)"}</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                {isAr ? "تحميل فوري مباشر ونسخة على البريد. نحن نحترم خصوصيتك بالكامل." : "Instant PDF download to your device + email backup. We respect your privacy."}
              </p>
            </form>

          </div>
        ) : (
          <div className="space-y-5 text-center py-2">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display text-2xl font-bold text-navy-950">
                {isAr ? "تم تجهيز وتحميل دليلك بنجاح!" : "Your Playbook is Ready & Downloaded!"}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                {isAr ? (
                  <>تم تنزيل ملف PDF مباشرة على جهازك، كما تم إرسال نسخة إلى <strong className="text-navy-950">{email}</strong>.</>
                ) : (
                  <>Your official 2026 Compliance Playbook PDF has been downloaded. A copy was also sent to <strong className="text-navy-950">{email}</strong>.</>
                )}
              </p>
            </div>

            {/* Delivery Action Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-[11px]">
                  <div className="font-bold text-emerald-950">{isAr ? "تم تنزيل PDF" : "PDF Generated"}</div>
                  <div className="text-emerald-700 text-[10px]">{isAr ? "تم الحفظ على جهازك" : "Saved to your device"}</div>
                </div>
              </div>

              <div className="bg-navy-50/70 border border-navy-200/80 rounded-2xl p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-[11px]">
                    <div className="font-bold text-navy-950">{isAr ? "نسخة البريد" : "Email Backup"}</div>
                    <div className="text-slate-600 text-[10px] truncate max-w-[120px]">{email}</div>
                  </div>
                </div>
                
                <button
                  onClick={handleResendEmail}
                  disabled={isReSending}
                  title="Resend email"
                  className="p-1.5 text-xs text-navy-700 hover:text-navy-950 hover:bg-navy-100 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReSending ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Download Again Button */}
            <button
              onClick={triggerDownload}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4 text-gold-600" />
              <span>{isAr ? "إعادة تنزيل ملف PDF مرة أخرى" : "Download Playbook PDF Again"}</span>
            </button>

            {/* Consulting CTA Box */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left text-xs space-y-2">
              <span className="font-bold text-navy-950 block">
                {isAr ? "هل تحتاج لمساعدة في تطبيق هذه المتطلبات على شركتك؟" : "Need help implementing this in your company?"}
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {isAr 
                  ? "يمكن للمستشار غلين دياز وفريق دياز للمحاسبة إجراء تقييم أولي مجاني لملفات شركتك الضريبية وإقرارات القيمة المضافة."
                  : "Glen Dias and the team at Dias Accounting can perform a complimentary initial assessment of your company's corporate tax and VAT filings."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <a
                href="#contact"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>{isAr ? "احجز مراجعة مجانية لمدة 15 دقيقة" : "Book 15-Min Free Review"}</span>
                <ArrowRight className={`w-4 h-4 text-gold-400 ${isRTL ? "rotate-180" : ""}`} />
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-semibold text-xs py-3 px-5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {isAr ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
