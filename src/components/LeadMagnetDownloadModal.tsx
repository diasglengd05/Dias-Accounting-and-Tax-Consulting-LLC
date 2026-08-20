import React, { useState } from "react";
import { X, Download, FileText, CheckCircle2, ShieldCheck, Mail, Phone, Building2, User, Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import { submitToGoogleSheetsDirectly } from "../lib/sheetsService";
import { useLanguage } from "../i18n/LanguageContext";

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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) return;

    setIsSubmitting(true);

    try {
      await submitToGoogleSheetsDirectly({
        name: fullName,
        email: email,
        phone: phone,
        company: company || "N/A",
        serviceType: "Lead Magnet: 2026 UAE Tax Compliance Checklist",
        message: `Requested 2026 UAE Corporate Tax & VAT Compliance Playbook. Lead: ${fullName}, ${email}, ${phone}, Company: ${company}`,
      });
    } catch (err) {
      console.warn("Lead magnet submission sync:", err);
    }

    setIsSubmitting(false);
    setIsDownloaded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
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
              
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight">
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
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    {isAr ? "الاسم الكامل *" : "Full Name *"}
                  </label>
                  <div className="relative">
                    <User className={`w-3.5 h-3.5 text-slate-400 absolute top-3 ${isRTL ? "right-3" : "left-3"}`} />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isAr ? "محمد الهاشمي" : "Glen Dias"}
                      className={`w-full text-xs py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none ${isRTL ? "pr-8 pl-3" : "pl-8 pr-3"}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    {isAr ? "اسم الشركة" : "Company Name"}
                  </label>
                  <div className="relative">
                    <Building2 className={`w-3.5 h-3.5 text-slate-400 absolute top-3 ${isRTL ? "right-3" : "left-3"}`} />
                    <input
                      type="text"
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
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    {isAr ? "البريد الإلكتروني المهني *" : "Work Email *"}
                  </label>
                  <div className="relative">
                    <Mail className={`w-3.5 h-3.5 text-slate-400 absolute top-3 ${isRTL ? "right-3" : "left-3"}`} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className={`w-full text-xs py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none ${isRTL ? "pr-8 pl-3" : "pl-8 pr-3"}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    {isAr ? "رقم الواتساب / الهاتف *" : "WhatsApp / Mobile *"}
                  </label>
                  <div className="relative">
                    <Phone className={`w-3.5 h-3.5 text-slate-400 absolute top-3 ${isRTL ? "right-3" : "left-3"}`} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className={`w-full text-xs py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none font-mono ${isRTL ? "pr-8 pl-3" : "pl-8 pr-3"}`}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-navy-950 hover:bg-navy-900 text-white font-display font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span>{isAr ? "جاري تجهيز التحميل..." : "Preparing Your Download..."}</span>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-gold-400" />
                    <span>{isAr ? "تحميل الدليل الشامل مجاناً (PDF فوري)" : "Download Free Compliance Playbook (Instant PDF)"}</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                {isAr ? "تسليم فوري. نحن نحترم خصوصيتك بالكامل." : "Instant delivery. We never share your data."}
              </p>
            </form>

          </div>
        ) : (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-navy-950">
                {isAr ? "دليلك الإرشادي جاهز!" : "Your Playbook is Ready!"}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                {isAr ? (
                  <>تم إرسال نسخة إلى <strong className="text-navy-950">{email}</strong>. يمكنك أيضاً تنزيل أو حفظ الدليل الآن.</>
                ) : (
                  <>A copy has been sent to <strong className="text-navy-950">{email}</strong>. You can also view or save the compliance checklist right now.</>
                )}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left text-xs space-y-2">
              <span className="font-bold text-navy-950 block">
                {isAr ? "هل تحتاج لمساعدة في تطبيق هذه المتطلبات على شركتك؟" : "Need help implementing this in your company?"}
              </span>
              <p className="text-slate-600">
                {isAr 
                  ? "يمكن للمستشار غلين دياز وفريق دياز للمحاسبة إجراء تقييم أولي مجاني لملفات شركتك الضريبية وإقرارات القيمة المضافة."
                  : "Glen Dias and the team at Dias Accounting can perform a complimentary initial assessment of your company's corporate tax and VAT filings."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
