import React from "react";
import { Check, ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface StandaloneServiceCard {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  priceEn: string;
  priceAr: string;
  isCustomQuote?: boolean;
  unitEn: string;
  unitAr: string;
  whoIsThisForEn: string;
  whoIsThisForAr: string;
  inclusionsEn: string[];
  inclusionsAr: string[];
  serviceBookingName: string;
  whatsappMessageEn: string;
  whatsappMessageAr: string;
}

const STANDALONE_SERVICES: StandaloneServiceCard[] = [
  {
    id: "vat-return-filing",
    titleEn: "VAT RETURN FILING",
    titleAr: "تقديم إقرار ضريبة القيمة المضافة",
    subtitleEn: "Stay compliant with accurate, on-time quarterly VAT filing",
    subtitleAr: "حافظ على امتثالك التام مع تقديم دقيق وفي الموعد لإقرارات VAT ربع السنوية",
    priceEn: "750",
    priceAr: "750",
    unitEn: "Per Quarter",
    unitAr: "لكل ربع سنوي",
    whoIsThisForEn: "One job, done right, your VAT sorted every quarter!",
    whoIsThisForAr: "مهمة واحدة، ننجزها باحترافية، ونتولى إقراراتك الضريبية كل ربع سنة!",
    inclusionsEn: [
      "Quarterly VAT Computation",
      "Quarterly VAT Return Submission",
      "Advisory on VAT Matters",
      "FTA-Compliant Documentation",
    ],
    inclusionsAr: [
      "احتساب ضريبة القيمة المضافة ربع السنوية بدقة",
      "تقديم الإقرار الضريبي عبر منصة إماراتاكس (FTA)",
      "استشارات فورية حول معالجات ضريبة القيمة المضافة",
      "توثيق وسجلات متوافقة مع متطلبات الهيئة الاتحادية",
    ],
    serviceBookingName: "VAT Return Filing (AED 750/Qtr)",
    whatsappMessageEn:
      "Hi Dias Accounting, I would like to get started with your VAT Return Filing service (AED 750 / Quarter). Please assist me with the onboarding details.",
    whatsappMessageAr:
      "مرحباً دياس للمحاسبة، أود البدء في خدمة تقديم إقرار ضريبة القيمة المضافة (750 درهم / ربع سنوي). يرجى تزويدي بالخطوات وتفاصيل البدء.",
  },
  {
    id: "corporate-tax-sbr",
    titleEn: "CORPORATE TAX (SBR)",
    titleAr: "إقرار ضريبة الشركات (تسهيلات الأعمال الصغيرة SBR)",
    subtitleEn: "Detailed Corporate Tax return filing under Small Business Relief",
    subtitleAr: "إعداد وتقديم إقرار ضريبة الشركات السنوي تحت مظلة تسهيلات الأعمال الصغيرة",
    priceEn: "500",
    priceAr: "500",
    unitEn: "One-time / Annual Filing",
    unitAr: "إقرار سنوي لمرة واحدة",
    whoIsThisForEn: "Your books, our filing, teamwork that just works!",
    whoIsThisForAr: "دفاترك جاهزة، وعلينا التقديم القانوني المتقن والآمن!",
    inclusionsEn: [
      "Small Business Relief Eligibility Check",
      "Detailed Corporate Tax Return Preparation",
      "Corporate Tax Return Filing with FTA",
      "Advisory on SBR Conditions & Compliance",
    ],
    inclusionsAr: [
      "التحقق من أهلية تسهيلات الأعمال الصغيرة (حتى 3 مليون د.إ)",
      "إعداد وتدقيق الإقرار السنوي لضريبة الشركات بالتفصيل",
      "تقديم الإقرار النهائي لدى الهيئة الاتحادية للضرائب (EmaraTax)",
      "استشارات حول شروط الامتثال واستمرارية الإعفاء",
    ],
    serviceBookingName: "Corporate Tax SBR Filing (AED 500)",
    whatsappMessageEn:
      "Hi Dias Accounting, I would like to get started with your Corporate Tax Small Business Relief (SBR) filing service (AED 500). Please guide me on submitting our documents.",
    whatsappMessageAr:
      "مرحباً دياس للمحاسبة، أود البدء في خدمة إعداد وتقديم إقرار ضريبة الشركات لتسهيلات الأعمال الصغيرة SBR (500 درهم). يرجى إرشادي حول تقديم المستندات.",
  },
  {
    id: "audit-readiness",
    titleEn: "AUDIT",
    titleAr: "تدقيق الحسابات والجاهزية المالية",
    subtitleEn: "Audit-ready financials, backed by a team that knows what auditors expect",
    subtitleAr: "قوائم مالية جاهزة للتدقيق معتمدين على فريق يدرك تماماً متطلبات المدققين الخارجيين",
    priceEn: "Custom Quote",
    priceAr: "عرض سعر مخصص",
    isCustomQuote: true,
    unitEn: "Scoped to your business & audit requirements",
    unitAr: "يتم تسعيره وفق حجم أعمالك ومتطلبات التدقيق القانوني",
    whoIsThisForEn: "Every business is different, so is every audit. Let's scope it together.",
    whoIsThisForAr: "كل شركة لها طبيعتها الخاصة وكل تدقيق له متطلباته. دعنا نحدد النطاق معاً.",
    inclusionsEn: [
      "Audit readiness assessment",
      "Liaison with external auditors",
      "Audit findings remediation",
      "Financial statement preparation for audit",
    ],
    inclusionsAr: [
      "تقييم شامل للجاهزية للتدقيق الخارجي والامتثال",
      "التنسيق المباشر والتعاون مع مدققي الحسابات القانونيين",
      "معالجة وتسوية الملاحظات ومخرجات التدقيق",
      "إعداد وتجهيز القوائم المالية الكاملة متوافقة مع معايير IFRS",
    ],
    serviceBookingName: "Financial Audit Preparation & Scoping",
    whatsappMessageEn:
      "Hi Dias Accounting, I would like to request a Custom Quote for Financial Audit Preparation & Readiness. Please connect me with a senior advisor to scope our requirements.",
    whatsappMessageAr:
      "مرحباً دياس للمحاسبة، أود الحصول على عرض سعر مخصص لخدمة تدقيق الحسابات والجاهزية للقوائم المالية. يرجى ربطي بمستشار مالي لتحديد النطاق.",
  },
];

interface StandalonePricingCardsProps {
  onSelectService?: (serviceName: string) => void;
}

export const StandalonePricingCards: React.FC<StandalonePricingCardsProps> = () => {
  const { language, isRTL } = useLanguage();
  const isAr = language === "ar";

  const handleDirectWhatsApp = (card: StandaloneServiceCard) => {
    const phoneNumber = "971529226958";
    const text = isAr ? card.whatsappMessageAr : card.whatsappMessageEn;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full space-y-6">
      {/* Outer Card Wrapper with site brand palette */}
      <div className="bg-slate-50/90 border border-slate-200/90 rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-navy-950/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Heading */}
        <div className="text-center space-y-2 mb-8 max-w-2xl mx-auto relative z-10">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-700 bg-gold-500/15 px-3.5 py-1 rounded-full border border-gold-500/30 inline-block font-mono">
            {isAr ? "خدمات مستقلة بدون اشتراك شهري" : "Fixed-Fee Standalone Services"}
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            {isAr
              ? "أسعار الإقرارات المستقلة وتدقيق الحسابات"
              : "Standalone Tax Returns & Audit Services"}
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            {isAr
              ? "حلول مخصصة لإنجاز مهام الامتثال الضريبي والتدقيق بأسعار ثابتة ومباشرة عبر واتساب."
              : "Direct, fixed-price regulatory filings and audit support when you need a single job handled with zero errors."}
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch relative z-10">
          {STANDALONE_SERVICES.map((card) => {
            const title = isAr ? card.titleAr : card.titleEn;
            const subtitle = isAr ? card.subtitleAr : card.subtitleEn;
            const price = isAr ? card.priceAr : card.priceEn;
            const unit = isAr ? card.unitAr : card.unitEn;
            const whoIsThisFor = isAr ? card.whoIsThisForAr : card.whoIsThisForEn;
            const inclusions = isAr ? card.inclusionsAr : card.inclusionsEn;

            return (
              <div
                key={card.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-gold-500/40 relative group"
              >
                {/* Top Info */}
                <div className="space-y-4">
                  {/* Title & Subtitle */}
                  <div className="space-y-1.5 min-h-[64px]">
                    <h4 className="font-display text-base sm:text-lg font-extrabold text-navy-950 uppercase tracking-tight">
                      {title}
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {subtitle}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="pt-2 pb-4 border-b border-slate-100 min-h-[90px] flex flex-col justify-end">
                    {card.isCustomQuote ? (
                      <div className="space-y-1">
                        <div className="text-2xl sm:text-3xl font-extrabold font-display text-navy-950 tracking-tight">
                          {price}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {unit}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            AED
                          </span>
                          <span className="text-3xl sm:text-4xl font-extrabold font-mono text-navy-950 tracking-tight">
                            {price}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {unit}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button -> WhatsApp */}
                  <button
                    type="button"
                    onClick={() => handleDirectWhatsApp(card)}
                    className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-xs sm:text-sm text-center transition-all cursor-pointer border-2 border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-gold-400 bg-white shadow-sm hover:shadow-md active:scale-98 flex items-center justify-center gap-2 group/btn"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600 group-hover/btn:text-emerald-400" />
                    <span>{isAr ? "ابدأ عبر واتساب" : "Get Started on WhatsApp"}</span>
                  </button>

                  {/* "WHO IS THIS FOR" Pill Box with website gold/slate theme */}
                  <div className="bg-gold-500/10 border border-gold-500/25 rounded-2xl p-3.5 space-y-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-gold-800 block">
                      {isAr ? "لمن هذه الخدمة:" : "WHO IS THIS FOR"}
                    </span>
                    <p className="text-slate-800 text-xs font-medium leading-relaxed">
                      {whoIsThisFor}
                    </p>
                  </div>

                  {/* "What's Included" List */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[11px] font-extrabold text-navy-950 uppercase tracking-wider block">
                      {isAr ? "ما تشمله الخدمة:" : "What's Included"}
                    </span>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {inclusions.map((item, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <Check className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                          <span className="leading-tight text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Subtext CTA -> WhatsApp */}
                <div className="pt-6 mt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleDirectWhatsApp(card)}
                    className="text-[11px] font-semibold text-navy-900 hover:text-gold-600 flex items-center justify-between w-full group/inq cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      {isAr ? "حجز واستفسار سريع عبر واتساب" : "Fast Inquiry on WhatsApp"}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 text-gold-600 transition-transform group-hover/inq:translate-x-1 ${isRTL ? "rotate-180 group-hover/inq:-translate-x-1" : ""}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Contact Line */}
        <p className="text-center text-xs text-slate-500 italic mt-8 pt-4 border-t border-slate-200/60 relative z-10">
          {isAr ? (
            <>
              جميع الخدمات المستقلة يمكن دمجها مع أي باقة محاسبية. تواصل معنا مباشرة عبر واتساب على{" "}
              <a
                href="https://wa.me/971529226958"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy-900 font-semibold underline not-italic hover:text-gold-600"
              >
                +971 52 922 6958
              </a>{" "}
              أو عبر البريد الإلكتروني{" "}
              <a
                href="mailto:info@diasuae.ae"
                className="text-navy-900 font-semibold underline not-italic hover:text-gold-600"
              >
                info@diasuae.ae
              </a>.
            </>
          ) : (
            <>
              All standalone services can be combined with any package. Contact us directly on WhatsApp at{" "}
              <a
                href="https://wa.me/971529226958"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy-900 font-semibold underline not-italic hover:text-gold-600"
              >
                +971 52 922 6958
              </a>{" "}
              or email{" "}
              <a
                href="mailto:info@diasuae.ae"
                className="text-navy-900 font-semibold underline not-italic hover:text-gold-600"
              >
                info@diasuae.ae
              </a>.
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default StandalonePricingCards;
