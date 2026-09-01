import React, { useState, useEffect } from "react";
import { X, Check, ExternalLink, BookmarkPlus, Sparkles, RefreshCw } from "lucide-react";
import { GOOGLE_BUSINESS_URL } from "../data/staticData";
import { useLanguage } from "../i18n/LanguageContext";
import DiasEmblemLogo from "./DiasEmblemLogo";

interface GooglePreferredSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName?: string;
}

export const GooglePreferredSourceModal: React.FC<GooglePreferredSourceModalProps> = ({
  isOpen,
  onClose,
  businessName = "Dias Accounting",
}) => {
  const { language, isRTL } = useLanguage();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Initialize preference status from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dias_google_preferred_source");
      if (saved === "true") {
        setIsAdded(true);
      }
    } catch {
      // ignore storage access restrictions
    }
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleAdd = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newState = !isAdded;
      setIsAdded(newState);
      setIsLoading(false);
      try {
        localStorage.setItem("dias_google_preferred_source", String(newState));
      } catch {
        // ignore
      }
      if (newState) {
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 5000);
      }
    }, 450);
  };

  const handleOpenGoogleSearch = () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      `${businessName} UAE Corporate Tax Accounting Sharjah`
    )}`;
    window.open(searchUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-preferred-title"
    >
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Google Modal Card */}
      <div
        className="relative w-full max-w-[540px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden z-10 flex flex-col transform transition-all duration-300 animate-in fade-in zoom-in-95"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Google Logo & Account Profile */}
        <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100/80">
          {/* Google Multi-Color Wordmark */}
          <div className="flex items-center gap-1.5 select-none">
            <svg
              className="h-6 sm:h-7 w-auto"
              viewBox="0 0 272 92"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Google"
            >
              <path
                d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.3 81.24 25 93.5 25s22.25 9.3 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
                fill="#EA4335"
              />
              <path
                d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.88 9.99-22.18 22.25-22.18s22.25 9.3 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
                fill="#FBBC05"
              />
              <path
                d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.18 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.62h9.44zm-8.73 21.01c0-7.81-5.21-13.44-11.93-13.44-6.72 0-12.18 5.63-12.18 13.44 0 7.73 5.46 13.44 12.18 13.44 6.72 0 11.93-5.71 11.93-13.44z"
                fill="#4285F4"
              />
              <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853" />
              <path
                d="M262.02 54.49l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-13.86-8.23l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
                fill="#EA4335"
              />
              <path
                d="M35.29 41.41V32H67.8c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.83 9.66C16.05 69.35 0 53.8 0 34.68 0 15.55 16.05 0 35.29 0c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.96-6.72-13.78 0-24.53 11.09-24.53 24.87 0 13.78 10.75 24.87 24.53 24.87 8.9 0 14.03-3.53 17.22-6.72 1.76-1.76 2.94-4.28 3.44-7.73H35.29v-.29z"
                fill="#4285F4"
              />
            </svg>
          </div>

          {/* User Profile Avatar & Close button */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" title="Signed in with Google">
              <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 via-red-400 to-amber-400">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
                  alt="Google Account User"
                  className="w-full h-full rounded-full object-cover border border-white"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Center Body */}
        <div className="px-6 sm:px-10 py-8 text-center flex flex-col items-center">
          {/* Dias Golden & Emerald 3D Brand Logo */}
          <div className="mb-6 relative flex items-center justify-center group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-white via-amber-50/30 to-slate-50 border border-slate-100 p-2.5 flex items-center justify-center shadow-[0_8px_30px_rgba(180,130,40,0.15)] ring-1 ring-gold-200/50">
              <DiasEmblemLogo className="w-full h-full transform transition-transform duration-300 group-hover:scale-105" />
            </div>
            {isAdded && (
              <span className="absolute -top-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white animate-bounce">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            )}
          </div>

          {/* Heading */}
          <h2
            id="google-preferred-title"
            className="text-2xl sm:text-[26px] font-semibold text-slate-900 tracking-tight leading-snug mb-3 font-display"
          >
            {language === "ar"
              ? "إضافة كمصدر مفضل على Google"
              : "Add as a Preferred Source on Google"}
          </h2>

          {/* Subheading with interactive business link */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-[420px] mb-8 font-normal">
            {language === "ar" ? (
              <>
                أضف{" "}
                <button
                  type="button"
                  onClick={handleOpenGoogleSearch}
                  className="font-medium text-[#1a73e8] hover:text-[#1557b0] underline decoration-[#1a73e8] underline-offset-2 transition-colors cursor-pointer"
                >
                  {businessName}
                </button>{" "}
                كمصدر مفضل للاطلاع على المزيد من محتواها وإرشاداتها الضريبية على بحث Google.
              </>
            ) : (
              <>
                Add{" "}
                <button
                  type="button"
                  onClick={handleOpenGoogleSearch}
                  className="font-medium text-[#0b57d0] hover:text-[#0842a0] underline decoration-[#0b57d0] underline-offset-2 transition-colors cursor-pointer inline"
                >
                  {businessName}
                </button>{" "}
                as a Preferred Source to see more of their content on Google Search.
              </>
            )}
          </p>

          {/* Primary Action Button (Add / Added) */}
          <div className="w-full max-w-[420px] space-y-3">
            <button
              type="button"
              id="btn-google-modal-add"
              onClick={handleToggleAdd}
              disabled={isLoading}
              className={`w-full py-3.5 px-6 rounded-full font-medium text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer shadow-md active:scale-[0.98] ${
                isAdded
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400"
                  : "bg-[#0b57d0] hover:bg-[#0842a0] text-white shadow-blue-700/20 hover:shadow-lg hover:shadow-blue-700/30"
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>
                    {language === "ar" ? "جاري التحديث..." : "Updating..."}
                  </span>
                </>
              ) : isAdded ? (
                <>
                  <Check className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                  <span className="font-semibold text-emerald-800">
                    {language === "ar"
                      ? "تمت الإضافة كمصدر مفضل ✓"
                      : "Added to Preferred Sources ✓"}
                  </span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-5 h-5 fill-current" />
                  <span className="font-medium">
                    {language === "ar" ? "إضافة" : "Add"}
                  </span>
                </>
              )}
            </button>

            {/* If Added: Show Google Search quick launch button */}
            {isAdded && (
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleOpenGoogleSearch}
                  className="w-full py-2.5 px-4 rounded-full text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  <span>
                    {language === "ar"
                      ? "عرض أحدث مقالات دياز للمحاسبة على بحث Google"
                      : "View Dias Accounting updates on Google Search"}
                  </span>
                </button>

                <p className="text-[11px] text-emerald-700 font-medium bg-emerald-50/80 py-1.5 px-3 rounded-lg border border-emerald-100/80">
                  {language === "ar"
                    ? "ستظهر لك الآن تحديثات ضريبة الشركات والقيمة المضافة الصادرة عن دياز للمحاسبة في مقدمة نتائج بحثك."
                    : "Google will now prioritize official UAE Corporate Tax & VAT advisory publications from Dias Accounting in your feed."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info note */}
        <div className="bg-slate-50/90 px-6 py-3.5 border-t border-slate-100 text-center text-[11px] sm:text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            {language === "ar"
              ? "يساعد هذا التفضيل في تخصيص نتائج البحث وتقديم التحليلات المحاسبية الأكثر ملاءمة لأعمالك."
              : "Your preferences help customize search results across your signed-in Google account."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GooglePreferredSourceModal;
