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
  badgeEn?: string;
  badgeAr?: string;
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
    id: "microbiz-ct-assist",
    titleEn: "BUSINESS STARTER (MICROBIZ CT)",
    titleAr: "باقة بداية الأعمال (MicroBiz CT)",
    subtitleEn: "Small Business Relief (SBR up to AED 3M) & FTA Corporate Tax filing",
    subtitleAr: "تقديم إقرار ضريبة الشركات وتسهيلات الأعمال الصغيرة SBR حتى 3 مليون درهم",
    priceEn: "500",
    priceAr: "500",
    badgeEn: "★ Business Starter - Flat AED 500",
    badgeAr: "★ باقة بداية الأعمال - رسم ثابت 500 درهم",
    unitEn: "One-time / Annual Filing (Zero Sticker Shock)",
    unitAr: "إقرار سنوي لمرة واحدة (بدون رسوم خفية)",
    whoIsThisForEn: "SMEs & Startups earning under AED 3M seeking 0% tax & zero penalties!",
    whoIsThisForAr: "الشركات الناشئة والصغيرة ذات الإيرادات دون 3 مليون درهم للاستفادة من ضريبة 0%!",
    inclusionsEn: [
      "Small Business Relief (SBR) Eligibility Check",
      "EmaraTax Corporate Tax Return Preparation",
      "0% Tax Election Submission with FTA",
      "100% Late Registration Penalty Protection",
    ],
    inclusionsAr: [
      "التحقق من أهلية تسهيلات الأعمال الصغيرة (حتى 3 مليون د.إ)",
      "إعداد وتدقيق الإقرار السنوي لضريبة الشركات بالتفصيل",
      "تقديم الإقرار النهائي واختيار نسبة 0% لدى الهيئة (EmaraTax)",
      "حماية كاملة وتجنب غرامة التأخير البالغة 10,000 درهم",
    ],
    serviceBookingName: "MicroBiz CT Assist (AED 500)",
    whatsappMessageEn:
      "Hi Dias Accounting, I would like to get started with the MicroBiz CT Assist package (AED 500 flat fee for SBR Corporate Tax filing). Please guide me on required documents.",
    whatsappMessageAr:
      "مرحباً دياس للمحاسبة، أود البدء في باقة MicroBiz CT Assist (500 درهم لإقرار ضريبة الشركات وتسهيلات الأعمال الصغيرة). يرجى إرشادي بالخطوات والمستندات المطلوبة.",
  },
  {
    id: "qfzp-shield-pro",
    titleEn: "QFZP SHIELD PRO",
    titleAr: "باقة حماية الشخص المؤهل QFZP Shield",
    subtitleEn: "0% Free Zone Corporate Tax structuring, de minimis test & substance audit",
    subtitleAr: "هيكلة نسبة 0% للمناطق الحرة، فحص دي مينيميس والجوهر الاقتصادي والامتثال",
    priceEn: "1,499",
    priceAr: "1,499",
    unitEn: "Annual Review & Structuring",
    unitAr: "هيكلة ومراجعة سنوية شاملة",
    whoIsThisForEn: "Free Zone companies (DMCC, IFZA, Meydan, SHAMS, DAFZA) targeting 0% tax.",
    whoIsThisForAr: "شركات المناطق الحرة الساعية لتطبيق نسبة 0% لضريبة الشركات مع حماية كاملة.",
    inclusionsEn: [
      "Qualifying vs Non-Qualifying Income Classification",
      "De Minimis Rule Calculation (5% / AED 5M Test)",
      "Adequate Substance & Physical Office Verification",
      "Transfer Pricing (TP) Disclosure Form Alignment",
    ],
    inclusionsAr: [
      "تصنيف الإيرادات المؤهلة وغير المؤهلة بدقة تشريعية",
      "اختبار قاعدة الحد الأدنى De Minimis (أقل من 5% أو 5 مليون)",
      "التحقق من الجوهر الاقتصادي ووجود العمليات المؤهلة",
      "مواءمة متطلبات الإفصاح عن تسعير المعاملات (TP)",
    ],
    serviceBookingName: "QFZP Shield Pro (AED 1,499)",
    whatsappMessageEn:
      "Hi Dias Accounting, I would like to book the QFZP Shield Pro package (AED 1,499) for our Free Zone 0% Corporate Tax structuring and compliance. Please connect me with a senior advisor.",
    whatsappMessageAr:
      "مرحباً دياس للمحاسبة، أود الاستفادة من باقة QFZP Shield Pro (1,499 درهم) لهيكلة ضريبة الشركات بنسبة 0% لشركتنا في المنطقة الحرة. يرجى التواصل للبدء.",
  },
  {
    id: "outsource-accounting-bookkeeping",
    titleEn: "OUTSOURCE ACCOUNTING",
    titleAr: "الاستعانة بالمحاسبة ومسك الدفاتر",
    subtitleEn: "Dedicated CA, monthly IFRS ledgers, and quarterly VAT return filing",
    subtitleAr: "محاسب قانوني مخصص، دفاتر شهرية وفق IFRS، وإقرارات القيمة المضافة",
    priceEn: "750",
    priceAr: "750",
    unitEn: "Per Month (Retainer)",
    unitAr: "شهرياً (اشتراك مرن)",
    whoIsThisForEn: "Businesses needing hands-off, monthly IFRS books and quarterly VAT filed.",
    whoIsThisForAr: "للشركات التي تبحث عن راحة البال التامة ودفاتر محاسبية شهرية مدققة.",
    inclusionsEn: [
      "Monthly Ledger & Bank Account Reconciliation",
      "Quarterly VAT Return Computation & Filing",
      "Monthly Profit & Loss and Balance Sheet Reports",
      "Dedicated Senior Chartered Accountant (CA)",
    ],
    inclusionsAr: [
      "تسوية حسابات البنوك والقيود المحاسبية الشهرية",
      "احتساب وتقديم إقرارات ضريبة القيمة المضافة ربع السنوية",
      "تقارير شهرية للأرباح والخسائر والميزانية العمومية",
      "محاسب قانوني أول مخصص لمتابعة أعمالك واستشاراتك",
    ],
    serviceBookingName: "Outsource Accounting Retainer (AED 750/mo)",
    whatsappMessageEn:
      "Hi Dias Accounting, I would like to discuss your Outsource Accounting & Bookkeeping retainer (AED 750/month). Please share the onboarding process.",
    whatsappMessageAr:
      "مرحباً دياس للمحاسبة، أود الاستفسار والبدء في باقة الاستعانة بمصادر خارجية للمحاسبة ومسك الدفاتر (750 درهم / شهر). يرجى مشاركة تفاصيل الانضمام.",
  },
  {
    id: "audit-readiness",
    titleEn: "AUDIT READINESS & SCOPING",
    titleAr: "تدقيق الحسابات والجاهزية المالية",
    subtitleEn: "Audit-ready financials, backed by a team that knows what auditors expect",
    subtitleAr: "قوائم مالية جاهزة للتدقيق بالتنسيق مع مدققين معتمدين في كافة إمارات الدولة",
    priceEn: "Custom Quote",
    priceAr: "عرض سعر مخصص",
    isCustomQuote: true,
    unitEn: "Scoped to your business & licensing requirements",
    unitAr: "يتم تسعيره وفق حجم أعمالك وجهة الترخيص",
    whoIsThisForEn: "Mainland & Free Zone companies needing certified statutory financial audits.",
    whoIsThisForAr: "لشركات البر الرئيسي والمناطق الحرة المطالبة بتقديم تقرير تدقيق قانوني معتمد.",
    inclusionsEn: [
      "Pre-Audit Ledger Scrub & IFRS Compliance Review",
      "Direct Liaison with Approved UAE External Auditors",
      "Audit Findings Remediation & Adjusting Entries",
      "Verified, Signed Financial Statements for Renewal",
    ],
    inclusionsAr: [
      "مراجعة وتنقية القيود ومطابقتها لمعايير IFRS الدولية",
      "التنسيق المباشر والتعاون مع مدققي الحسابات المعتمدين في الدولة",
      "معالجة وتسوية الملاحظات وقيود التسوية الناتجة عن التدقيق",
      "تجهيز القوائم المالية النهائية الموقعة لتجديد الرخصة",
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

        {/* 4-Card Grid for Transparent Institutional Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch relative z-10">
          {STANDALONE_SERVICES.map((card) => {
            const title = isAr ? card.titleAr : card.titleEn;
            const subtitle = isAr ? card.subtitleAr : card.subtitleEn;
            const price = isAr ? card.priceAr : card.priceEn;
            const unit = isAr ? card.unitAr : card.unitEn;
            const whoIsThisFor = isAr ? card.whoIsThisForAr : card.whoIsThisForEn;
            const inclusions = isAr ? card.inclusionsAr : card.inclusionsEn;

            const badge = isAr ? card.badgeAr : card.badgeEn;

            return (
              <div
                key={card.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-gold-400 relative group"
              >
                {/* Top Info */}
                <div className="space-y-4">
                  {badge && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-black tracking-wide shadow-xs mb-1">
                      {badge}
                    </div>
                  )}
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
