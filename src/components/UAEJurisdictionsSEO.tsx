import React, { useState } from "react";
import {
  MapPin,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Percent,
  FileCheck,
  HelpCircle,
  Phone,
  Sparkles
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface JurisdictionInfo {
  id: string;
  name: string;
  nameAr: string;
  category: "Dubai Mainland" | "Sharjah & Northern" | "Dubai Free Zones" | "Financial Centers";
  categoryAr: string;
  taxRate: string;
  auditRequirement: string;
  auditRequirementAr: string;
  qfzpEligible: boolean;
  keyHighlight: string;
  keyHighlightAr: string;
  description: string;
  descriptionAr: string;
  coverageAreas: string[];
}

const JURISDICTIONS: JurisdictionInfo[] = [
  {
    id: "dubai-mainland",
    name: "Dubai Mainland (DET / DED)",
    nameAr: "دبي البر الرئيسي (دائرة الاقتصاد والسياحة)",
    category: "Dubai Mainland",
    categoryAr: "دبي البر الرئيسي",
    taxRate: "0% up to AED 375k | 9% Standard | SBR 0% up to AED 3M",
    auditRequirement: "Required for Corporate Tax filing & turnover > AED 50M",
    auditRequirementAr: "مطلوب لإقرارات ضريبة الشركات وللشركات التي تتجاوز إيراداتها 50 مليون درهم",
    qfzpEligible: false,
    keyHighlight: "100% foreign ownership available for 1,000+ commercial activities with unlimited local UAE trading.",
    keyHighlightAr: "ملكية أجنبية 100% لأكثر من 1000 نشاط تجاري مع حرية تامة في التجارة داخل الإمارات.",
    description: "Dias Accounting handles end-to-end accounting, quarterly VAT returns (5%), and EmaraTax corporate tax filings for businesses licensed under Dubai Department of Economy and Tourism (DET).",
    descriptionAr: "تقدم دياس للاستشارات المحاسبية خدمات مسك الدفاتر الشاملة، وإقرارات ضريبة القيمة المضافة، والتسجيل في ضريبة الشركات عبر منصة إمارات تاكس للشركات المرخصة في دبي.",
    coverageAreas: ["Business Bay", "Downtown Dubai", "Deira", "Bur Dubai", "Al Quoz", "Jumeirah", "Dubai Marina", "Al Barsha"]
  },
  {
    id: "shams-sharjah",
    name: "Sharjah Media City (SHAMS) & SAIF Zone",
    nameAr: "مدينة الشارقة للإعلام (شمس) والمنطقة الحرة بمطار الشارقة",
    category: "Sharjah & Northern",
    categoryAr: "الشارقة والمناطق الشمالية",
    taxRate: "0% Qualifying Free Zone Person (QFZP) | 9% Non-Qualifying",
    auditRequirement: "Mandatory for 0% QFZP status & annual license renewal",
    auditRequirementAr: "إلزامي للحصول على نسبة 0% وتجديد الرخصة السنوية",
    qfzpEligible: true,
    keyHighlight: "Our registered corporate home jurisdiction. Fast-track company setup, cost-effective licensing, and 0% tax structuring.",
    keyHighlightAr: "مقرنا الرئيسي المرخص. تأسيس شركات سريع، تكاليف تنافسية، وهيكلة ضريبية متوافقة بنسبة 0%.",
    description: "Centrally located at Sharjah Media City (SHAMS License: 2646813.01), we provide specialized local tax agency services, corporate bank account setup, and annual audit certification for SHAMS, SAIF Zone, and SPC entities.",
    descriptionAr: "بصفتنا مرخصين في مدينة الشارقة للإعلام، نوفر خدمات وكيل الضريبة المعتمد، فتح الحسابات البنكية، والتدقيق المالي السنوي المعتمد.",
    coverageAreas: ["SHAMS Media City", "SAIF Zone Sharjah", "Sharjah Publishing City (SPC)", "Al Messaned", "Sharjah Industrial Areas"]
  },
  {
    id: "dmcc-jlt",
    name: "DMCC & JLT Free Zone Dubai",
    nameAr: "مركز دبي للسلع المتعددة وأبراج بحيرات جميرا (DMCC / JLT)",
    category: "Dubai Free Zones",
    categoryAr: "المناطق الحرة في دبي",
    taxRate: "0% on Qualifying Commodities / Free Zone Trade | 9% Local",
    auditRequirement: "Strictly Mandatory by DMCC Authority by Dec 31 each year",
    auditRequirementAr: "إلزامي سنوياً وفق لوائح سلطة مركز دبي للسلع المتعددة",
    qfzpEligible: true,
    keyHighlight: "Global hub for trading, commodities, crypto, and technology with mandatory annual DMCC approved audits.",
    keyHighlightAr: "مركز عالمي للتجارة والسلع والعملات الرقمية مع اشتراط التدقيق المالي السنوي المعتمد.",
    description: "Dias Accounting delivers DMCC-compliant audit preparation, Transfer Pricing documentation, and Corporate Tax 0% QFZP substance verification for businesses in Jumeirah Lakes Towers (JLT).",
    descriptionAr: "إعداد تقارير التدقيق المالي المتوافقة مع DMCC، توثيق تسعير المعاملات (Transfer Pricing)، وإثبات التواجد الاقتصادي لنسبة 0%.",
    coverageAreas: ["Jumeirah Lakes Towers (JLT)", "DMCC Crypto Centre", "Uptown Dubai", "One JLT"]
  },
  {
    id: "ifza-meydan",
    name: "IFZA Dubai, Meydan & DAFZA",
    nameAr: "إفزا دبي، ميدان، والمنطقة الحرة بمطار دبي (DAFZA)",
    category: "Dubai Free Zones",
    categoryAr: "المناطق الحرة في دبي",
    taxRate: "0% QFZP Qualifying Income | SBR 0% up to AED 3,000,000",
    auditRequirement: "Required for QFZP tax exemptions & corporate banking",
    auditRequirementAr: "مطلوب للاستفادة من إعفاءات المنطقة الحرة 0% وللحسابات البنكية",
    qfzpEligible: true,
    keyHighlight: "Popular hubs for digital agencies, e-commerce, consulting, and international holding companies.",
    keyHighlightAr: "الوجهة المفضلة للشركات الرقمية، التجارة الإلكترونية، والاستشارات العالمية.",
    description: "We help IFZA and Meydan startups navigate EmaraTax registration, apply for Small Business Relief (SBR) to pay 0% tax, and maintain monthly IFRS bookkeeping for bank compliance.",
    descriptionAr: "نساعد الشركات الناشئة في إفزا وميدان على التسجيل في إمارات تاكس، وتطبيق تسهيلات الشركات الصغيرة (0%)، وإدارة الدفاتر المحاسبية.",
    coverageAreas: ["Dubai Silicon Oasis (IFZA)", "Meydan Free Zone (Nad Al Sheba)", "DAFZA (Dubai Airport)", "Dubai Internet City"]
  },
  {
    id: "difc-adgm",
    name: "DIFC Dubai & ADGM Abu Dhabi",
    nameAr: "مركز دبي المالي العالمي (DIFC) وسوق أبوظبي العالمي (ADGM)",
    category: "Financial Centers",
    categoryAr: "المراكز المالية الدولية",
    taxRate: "0% Qualifying Financial Services | Common Law Jurisdiction",
    auditRequirement: "Mandatory statutory audit under DFSA / ADGM FSRA regulations",
    auditRequirementAr: "تدقيق قانوني إلزامي وفق متطلبات سلطة دبي للخدمات المالية (DFSA)",
    qfzpEligible: true,
    keyHighlight: "Premier financial jurisdictions operating under English Common Law for funds, fintech, and asset managers.",
    keyHighlightAr: "المراكز المالية الرائدة الخاضعة للقانون العام الإنجليزي لإدارة الأصول وصناديق الاستثمار.",
    description: "Specialized IFRS accounting, AML/goAML framework implementation, and Fractional CFO advisory for DFSA/ADGM regulated and non-regulated entities.",
    descriptionAr: "خدمات محاسبية متقدمة متوافقة مع معايير IFRS، تطبيق أنظمة مكافحة غسل الأموال goAML، وإدارة مالية تنفيذية (CFO).",
    coverageAreas: ["DIFC Gate Precinct", "Al Maryah Island (ADGM)", "Reem Island", "Abu Dhabi Global Market"]
  },
  {
    id: "rakez-northern",
    name: "RAKEZ (Ras Al Khaimah) & Northern Emirates",
    nameAr: "راكز (رأس الخيمة) والمناطق الحرة الأخرى",
    category: "Sharjah & Northern",
    categoryAr: "الشارقة والمناطق الشمالية",
    taxRate: "0% QFZP on Industrial / Export Trade | 9% Standard",
    auditRequirement: "Mandatory at annual license renewal & FTA audits",
    auditRequirementAr: "إلزامي عند تجديد الرخصة والتدقيق الضريبي",
    qfzpEligible: true,
    keyHighlight: "Industrial and cost-effective trading hub with favorable economic substance frameworks.",
    keyHighlightAr: "مركز صناعي وتجاري تنافسي مع بنية قوية لاشتراطات الأنشطة المؤهلة.",
    description: "End-to-end accounting, VAT refund claims, and corporate tax structuring for manufacturers, traders, and service providers across RAKEZ, Ajman Free Zone (AFZA), and UAQ FTZ.",
    descriptionAr: "خدمات استرداد ضريبة القيمة المضافة، الهيكلة الضريبية، ومسك الدفاتر للمصانع والشركات في رأس الخيمة وعجمان وأم القيوين.",
    coverageAreas: ["RAKEZ Business Zones", "Al Hamra Industrial", "Ajman Free Zone", "UAQ Free Trade Zone"]
  }
];

export function UAEJurisdictionsSEO() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeJurisdiction, setActiveJurisdiction] = useState<JurisdictionInfo>(JURISDICTIONS[0]);

  const categories = [
    { id: "All", name: language === "ar" ? "جميع المناطق" : "All Jurisdictions" },
    { id: "Dubai Mainland", name: language === "ar" ? "دبي البر الرئيسي" : "Dubai Mainland (DET)" },
    { id: "Dubai Free Zones", name: language === "ar" ? "المناطق الحرة في دبي" : "Dubai Free Zones (DMCC/IFZA)" },
    { id: "Sharjah & Northern", name: language === "ar" ? "الشارقة والمناطق الشمالية" : "Sharjah & SHAMS" },
    { id: "Financial Centers", name: language === "ar" ? "المراكز المالية" : "DIFC & ADGM" },
  ];

  const filtered = selectedCategory === "All"
    ? JURISDICTIONS
    : JURISDICTIONS.filter(j => j.category === selectedCategory);

  return (
    <section id="jurisdictions" className="py-16 md:py-24 bg-gradient-to-b from-navy-950 via-slate-900 to-navy-950 text-white border-t border-b border-white/10 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>{language === "ar" ? "تغطية شاملة لجميع مناطق وإمارات الدولة" : "UAE Jurisdiction & Free Zone Tax Authority"}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {language === "ar" ? (
              <>
                خبرة ضريبية ومحاسبية متخصصة في <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-emerald-300">دبي، الشارقة، وجميع المناطق الحرة</span>
              </>
            ) : (
              <>
                Tailored Tax & Accounting Compliance Across <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-emerald-300">Dubai, Sharjah & UAE Free Zones</span>
              </>
            )}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {language === "ar"
              ? "سواء كانت شركتك مرخصة في البر الرئيسي لدبي (DET)، أو مدينة الشارقة للإعلام (SHAMS)، أو مركز دبي للسلع المتعددة (DMCC)، نضمن لك الاستفادة القصوى من الإعفاءات القانونية وتجنب غرامات الهيئة الاتحادية للضرائب."
              : "Whether your entity operates in Dubai Mainland (DET), Sharjah Media City (SHAMS), or DMCC/IFZA Free Zones, we architect bulletproof bookkeeping, 0% Corporate Tax structuring, and statutory audit compliance."}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-gold-500 text-navy-950 font-bold shadow-lg shadow-gold-500/20 scale-105"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Interactive Jurisdiction Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Selection Cards */}
          <div className="lg:col-span-5 space-y-3">
            {filtered.map((jurisdiction) => {
              const isActive = activeJurisdiction.id === jurisdiction.id;
              return (
                <div
                  key={jurisdiction.id}
                  onClick={() => setActiveJurisdiction(jurisdiction)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer text-left rtl:text-right ${
                    isActive
                      ? "bg-navy-900/95 border-gold-400 shadow-xl shadow-gold-500/10 scale-[1.02]"
                      : "bg-navy-950/60 border-white/10 hover:border-white/25 hover:bg-navy-900/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-display font-bold text-sm sm:text-base text-white">
                      {language === "ar" ? jurisdiction.nameAr : jurisdiction.name}
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-300 border border-gold-500/30 shrink-0">
                      {jurisdiction.qfzpEligible ? "0% QFZP" : "Mainland"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {language === "ar" ? jurisdiction.keyHighlightAr : jurisdiction.keyHighlight}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Detailed Jurisdiction Spotlight */}
          <div className="lg:col-span-7 bg-navy-900/90 border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left rtl:text-right backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>{language === "ar" ? activeJurisdiction.categoryAr : activeJurisdiction.category}</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {language === "ar" ? activeJurisdiction.nameAr : activeJurisdiction.name}
                </h3>
              </div>

              <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>FTA Compliant</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              {language === "ar" ? activeJurisdiction.descriptionAr : activeJurisdiction.description}
            </p>

            {/* Tax & Audit Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-gold-400 text-xs font-bold">
                  <Percent className="w-4 h-4" />
                  <span>{language === "ar" ? "نسبة ضريبة الشركات" : "Corporate Tax Rate"}</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  {activeJurisdiction.taxRate}
                </p>
              </div>

              <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <FileCheck className="w-4 h-4" />
                  <span>{language === "ar" ? "متطلبات التدقيق المالي" : "Annual Audit Mandate"}</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  {language === "ar" ? activeJurisdiction.auditRequirementAr : activeJurisdiction.auditRequirement}
                </p>
              </div>
            </div>

            {/* Coverage Areas Tag Cloud */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-semibold block">
                {language === "ar" ? "المناطق المشمولة بالدعم الميداني والرقمي:" : "Key Covered Business Districts & Hubs:"}
              </span>
              <div className="flex flex-wrap gap-2">
                {activeJurisdiction.coverageAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white/10 border border-white/15 hover:border-gold-400/50 text-slate-200 px-3 py-1 rounded-lg"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
                <span>
                  {language === "ar"
                    ? "استشارة أولية مجانية لتقييم الالتزام الضريبي لمنطقتك"
                    : "Free 30-min compliance & tax optimization assessment"}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href="#contact"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-navy-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer"
                >
                  <span>{language === "ar" ? "احجز استشارة المنطقة" : "Book Assessment"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`https://wa.me/971529226958?text=Hello%20Glen,%20I%20have%20an%20inquiry%20regarding%20accounting%20and%20corporate%20tax%20for%20my%20company%20in%20${encodeURIComponent(activeJurisdiction.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all"
                  title="WhatsApp Direct Consultation"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default UAEJurisdictionsSEO;
