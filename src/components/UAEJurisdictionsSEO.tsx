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
  category: "Dubai Mainland" | "Abu Dhabi" | "Sharjah & Northern" | "Dubai Free Zones" | "Financial Centers";
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
    id: "abu-dhabi-mainland",
    name: "Abu Dhabi Mainland (ADDED) & KEZAD",
    nameAr: "أبوظبي البر الرئيسي (دائرة التنمية الاقتصادية) وكيزاد",
    category: "Abu Dhabi",
    categoryAr: "أبوظبي",
    taxRate: "0% up to AED 375k | 9% Standard | SBR 0% up to AED 3M",
    auditRequirement: "Required for commercial license renewal and government procurement (ICV)",
    auditRequirementAr: "مطلوب لتجديد الرخصة والمناقصات الحكومية وتصديق برنامج القيمة المحلية المضافة (ICV)",
    qfzpEligible: false,
    keyHighlight: "Federal capital hub with extensive infrastructure, energy, defense, and government procurement ecosystems.",
    keyHighlightAr: "عاصمة الدولة ومركز المشاريع الحكومية، الطاقة، والبنية التحتية مع متطلبات برنامج ICV.",
    description: "Full-service accounting, VAT returns, Corporate Tax filings, and In-Country Value (ICV) accounting audit preparation for enterprises licensed under the Abu Dhabi Department of Economic Development (ADDED) and Khalifa Economic Zones (KEZAD).",
    descriptionAr: "خدمات محاسبية متكاملة، إقرارات القيمة المضافة، التسجيل والتقديم لضريبة الشركات، وتجهيز الدفاتر لبرنامج القيمة المحلية المضافة (ICV) في إمارة أبوظبي.",
    coverageAreas: ["Abu Dhabi Island", "Al Ain", "Al Dhafra", "KEZAD", "Masdar City", "Mussafah Industrial Area"]
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
    name: "RAKEZ, Ajman (AFZA), UAQ & Fujairah",
    nameAr: "راكز (رأس الخيمة)، عجمان (AFZA)، أم القيوين، والفجيرة",
    category: "Sharjah & Northern",
    categoryAr: "الشارقة والمناطق الشمالية",
    taxRate: "0% QFZP on Industrial / Export Trade | 9% Standard | SBR 0%",
    auditRequirement: "Mandatory at annual license renewal & FTA audits",
    auditRequirementAr: "إلزامي عند تجديد الرخصة والتدقيق الضريبي",
    qfzpEligible: true,
    keyHighlight: "Cost-effective manufacturing, trading, and maritime export hubs across the Northern Emirates.",
    keyHighlightAr: "مراكز صناعية ولوجستية وتجارية عالية الكفاءة التكلفية تغطي كافة الإمارات الشمالية.",
    description: "End-to-end accounting, VAT refund claims, corporate tax filings, and Transfer Pricing compliance for manufacturers, maritime logistics, and service companies across Ras Al Khaimah (RAKEZ), Ajman Free Zone (AFZA), Umm Al Quwain (UAQ FTZ), and Fujairah Creative City.",
    descriptionAr: "خدمات استرداد ضريبة القيمة المضافة، الهيكلة الضريبية، ومسك الدفاتر للمصانع والشركات في رأس الخيمة، عجمان، أم القيوين، والفجيرة.",
    coverageAreas: ["RAKEZ Business Zones", "Al Hamra Industrial", "Ajman Free Zone (AFZA)", "UAQ Free Trade Zone", "Fujairah Creative City"]
  }
];

export function UAEJurisdictionsSEO() {
  const { language } = useLanguage();
  const [activeJurisdiction, setActiveJurisdiction] = useState<JurisdictionInfo>(JURISDICTIONS[0]);

  return (
    <section id="jurisdictions" className="py-8 sm:py-10 bg-gradient-to-b from-navy-950 via-slate-900 to-navy-950 text-white border-t border-b border-white/10 relative overflow-hidden scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Compact Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-[11px] font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>{language === "ar" ? "تغطية كافة إمارات الدولة والمناطق الحرة" : "UAE Nationwide Jurisdictions & Free Zones"}</span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {language === "ar" ? (
              <>خبرة ضريبية ومحاسبية في <span className="text-gold-400">كافة إمارات الدولة والـ 40+ منطقة حرة</span></>
            ) : (
              <>Tax & Audit Compliance Across <span className="text-gold-400">All 7 Emirates & 40+ Free Zones</span></>
            )}
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm">
            {language === "ar"
              ? "مسك دفاتر معتمد، هيكلة ضريبة الشركات بنسبة 0%، وتمثيل كامل أمام الهيئة الاتحادية للضرائب لجميع الرخص."
              : "Certified bookkeeping, 0% QFZP tax structuring, and audit compliance across Dubai, Abu Dhabi, and Northern Emirates."}
          </p>
        </div>

        {/* Compact Horizontal Jurisdiction Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none justify-start sm:justify-center">
          {JURISDICTIONS.map((j) => {
            const isActive = activeJurisdiction.id === j.id;
            return (
              <button
                key={j.id}
                onClick={() => setActiveJurisdiction(j)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-gold-500 text-navy-950 font-bold shadow-sm"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10"
                }`}
              >
                {language === "ar" ? j.nameAr.split(" (")[0] : j.name.split(" (")[0]}
              </button>
            );
          })}
        </div>

        {/* Streamlined Single Focus Card */}
        <div className="bg-navy-900/80 border border-gold-500/30 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-md space-y-4">
          {/* Card Top Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-gold-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{language === "ar" ? activeJurisdiction.categoryAr : activeJurisdiction.category}</span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {language === "ar" ? activeJurisdiction.nameAr : activeJurisdiction.name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-gold-400/20 text-gold-300 border border-gold-500/30">
                {activeJurisdiction.qfzpEligible ? "0% QFZP Eligible" : "Mainland SBR 0% / 9%"}
              </span>
              <div className="hidden sm:flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                <ShieldCheck className="w-3 h-3" />
                <span>FTA Compliant</span>
              </div>
            </div>
          </div>

          {/* Key Highlight / Description */}
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {language === "ar" ? activeJurisdiction.descriptionAr : activeJurisdiction.description}
          </p>

          {/* 3-Column Quick Metric Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-slate-950/60 border border-white/10 rounded-xl p-2.5">
              <div className="flex items-center gap-1.5 text-gold-400 font-bold mb-1">
                <Percent className="w-3 h-3" />
                <span className="text-[11px]">{language === "ar" ? "ضريبة الشركات" : "Corporate Tax Rate"}</span>
              </div>
              <p className="text-slate-200 text-[11px] font-medium leading-snug truncate" title={activeJurisdiction.taxRate}>
                {activeJurisdiction.taxRate}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-white/10 rounded-xl p-2.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                <FileCheck className="w-3 h-3" />
                <span className="text-[11px]">{language === "ar" ? "التدقيق المالي" : "Audit Requirement"}</span>
              </div>
              <p className="text-slate-200 text-[11px] font-medium leading-snug truncate" title={language === "ar" ? activeJurisdiction.auditRequirementAr : activeJurisdiction.auditRequirement}>
                {language === "ar" ? activeJurisdiction.auditRequirementAr : activeJurisdiction.auditRequirement}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-white/10 rounded-xl p-2.5">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold mb-1">
                <Building2 className="w-3 h-3" />
                <span className="text-[11px]">{language === "ar" ? "أبرز المناطق" : "Key Covered Districts"}</span>
              </div>
              <p className="text-slate-200 text-[11px] font-medium leading-snug truncate" title={activeJurisdiction.coverageAreas.join(", ")}>
                {activeJurisdiction.coverageAreas.slice(0, 3).join(", ")}...
              </p>
            </div>
          </div>

          {/* Compact CTA Footer */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span>
                {language === "ar"
                  ? "استشارة أولية مجانية لتقييم الامتثال الضريبي لشركتك"
                  : "Free 30-min compliance & tax assessment for your license"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/971529226958?text=Hello%20Glen,%20I%20have%20an%20inquiry%20regarding%20accounting%20and%20corporate%20tax%20for%20my%20company%20in%20${encodeURIComponent(activeJurisdiction.name)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-1 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
              >
                <span>{language === "ar" ? "حجز استشارة" : "Book Assessment"}</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default UAEJurisdictionsSEO;
