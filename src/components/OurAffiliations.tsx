import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  ShieldCheck,
  X,
  MessageCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Award,
  Globe2,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface AffiliationItem {
  id: string;
  nameEn: string;
  nameAr: string;
  shortTagEn: string;
  shortTagAr: string;
  categoryEn: string;
  categoryAr: string;
  taglineEn: string;
  taglineAr: string;
  descriptionEn: string;
  descriptionAr: string;
  benefitsEn: string[];
  benefitsAr: string[];
  corporateTaxEn: string;
  corporateTaxAr: string;
  whatsappMessageEn: string;
  whatsappMessageAr: string;
  accentBadge: string;
  logoComponent: React.ReactNode;
}

export const OurAffiliations: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const isAr = language === "ar";
  const [selectedAffiliation, setSelectedAffiliation] = useState<AffiliationItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const affiliations: AffiliationItem[] = [
    {
      id: "meydan",
      nameEn: "Meydan Free Zone",
      nameAr: "منطقة ميدان الحرة",
      shortTagEn: "Dubai Downtown Proximity",
      shortTagAr: "قرب استراتيجي من وسط دبي",
      categoryEn: "Free Zone • Dubai",
      categoryAr: "منطقة حرة • دبي",
      taglineEn: "Dubai to the World • Premium Meydan Hotel Location",
      taglineAr: "دبي إلى العالم • موقع متميز في فندق ميدان",
      descriptionEn:
        "Meydan Free Zone offers a prestigious address near Downtown Dubai with guaranteed digital banking setup, flexible flexi-desk solutions, and 100% foreign ownership for modern entrepreneurs.",
      descriptionAr:
        "توفر منطقة ميدان الحرة عنواناً مرموقاً بالقرب من وسط مدينة دبي، مع حلول مصرفية مرنة ومكاتب افتراضية وملكية أجنبية بنسبة 100% لرواد الأعمال والشركات الناشئة.",
      benefitsEn: [
        "100% foreign business ownership & zero personal income tax",
        "Guaranteed digital IBAN and corporate bank account support",
        "Over 1,500+ commercial, consulting & e-commerce activities",
        "Fast-track visa processing with VIP medical concierge",
      ],
      benefitsAr: [
        "ملكية أجنبية بنسبة 100% وإعفاء كامل من ضريبة الدخل الشخصي",
        "دعم فتح الحسابات المصرفية الرقمية والتجارية في كبرى بنوك الإمارات",
        "أكثر من 1500 نشاط تجاري واستشاري وتجارة إلكترونية",
        "إصدار سريع لتأشيرات الإقامة مع خدمة الفحص الطبي VIP",
      ],
      corporateTaxEn: "Eligible for 0% Qualifying Free Zone Person (QFZP) status subject to qualifying income rules.",
      corporateTaxAr: "مؤهلة لنسبة 0% كشخص مؤهل في المنطقة الحرة (QFZP) وفق معايير الدخل المؤهل.",
      whatsappMessageEn:
        "Hi Dias Accounting, I would like to know more about company formation, accounting, and tax compliance for Meydan Free Zone.",
      whatsappMessageAr:
        "مرحباً دياس للمحاسبة، أود معرفة المزيد حول تأسيس الشركات والمحاسبة والامتثال الضريبي في منطقة ميدان الحرة.",
      accentBadge: "Dubai Hub",
      logoComponent: (
        <div className="flex flex-col items-center justify-center text-center select-none py-1">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-navy-950 font-display">
              meydan
            </span>
            <span className="text-blue-600 text-xl font-bold">:</span>
            <div className="w-9 h-9 rounded-full border-2 border-lime-500 flex items-center justify-center bg-white shadow-xs">
              <span className="text-xs font-black text-navy-950 tracking-wider">FZ</span>
              <span className="text-[6.5px] text-lime-600 font-bold absolute translate-x-3 -translate-y-2">TM</span>
            </div>
          </div>
          <span className="text-[8px] sm:text-[9px] font-bold tracking-widest text-slate-500 uppercase mt-1">
            Dubai to the World
          </span>
        </div>
      ),
    },
    {
      id: "rakez",
      nameEn: "Rakez Free Zone",
      nameAr: "منطقة راكز الحرة",
      shortTagEn: "Industrial & Cost-Effective",
      shortTagAr: "المركز الصناعي والتجاري الأكثر توفيراً",
      categoryEn: "Free Zone • Ras Al Khaimah",
      categoryAr: "منطقة حرة • رأس الخيمة",
      taglineEn: "Ras Al Khaimah Economic Zone • Modular Warehouses",
      taglineAr: "هيئة مناطق رأس الخيمة الاقتصادية • تراخيص مرنة ومستودعات حديثة",
      descriptionEn:
        "RAKEZ is a powerhouse hub supporting over 15,000 businesses across commercial, industrial, and service sectors with ultra-competitive operational costs and modular warehouses.",
      descriptionAr:
        "تعتبر راكز من أكبر المناطق الاقتصادية الداعمة لأكثر من 15,000 شركة في القطاعات التجارية والصناعية والخدمية بأقل تكاليف تشغيلية ومستودعات متطورة.",
      benefitsEn: [
        "Highly cost-effective packages for startups and manufacturing SMEs",
        "Customizable warehouses, industrial plots of land, and executive offices",
        "Dual license availability (Free Zone + Mainland branch)",
        "Zero customs duties on re-exported goods and raw materials",
      ],
      benefitsAr: [
        "باقات اقتصادية تنافسية للشركات الناشئة والمصانع",
        "مستودعات قابلة للتهيئة ومساحات أراضٍ صناعية ومكاتب تنفيذية",
        "إمكانية الحصول على ترخيص مزدوج (منطقة حرة + فرع محلي)",
        "إعفاء جمركي كامل على إعادة التصدير والمواد الخام",
      ],
      corporateTaxEn: "Corporate tax optimization with qualifying industrial and manufacturing concessions under FTA law.",
      corporateTaxAr: "تخطيط ضريبي متقدم للأنشطة الصناعية والتصنيعية المؤهلة بموجب قانون ضريبة الشركات.",
      whatsappMessageEn:
        "Hi Dias Accounting, I would like to explore RAKEZ (Ras Al Khaimah Economic Zone) business setup and tax filing solutions.",
      whatsappMessageAr:
        "مرحباً دياس للمحاسبة، أود استكشاف حلول تأسيس الشركات والإقرارات الضريبية في منطقة راكز (RAKEZ).",
      accentBadge: "Cost Leader",
      logoComponent: (
        <div className="flex flex-col items-center justify-center text-center select-none py-1">
          <div className="relative w-10 h-8 mb-1 flex items-center justify-center">
            <svg viewBox="0 0 100 85" className="w-10 h-8" fill="none">
              <path
                d="M50 5 L92 78 L72 78 L50 38 L28 78 L8 78 Z"
                stroke="#0284c7"
                strokeWidth="10"
                strokeLinejoin="round"
              />
              <path
                d="M50 35 L70 72 L30 72 Z"
                stroke="#38bdf8"
                strokeWidth="6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-navy-950 lowercase font-display">
            rakez
          </span>
          <span className="text-[7px] font-bold tracking-wider text-sky-700 uppercase">
            Ras Al Khaimah Economic Zone
          </span>
        </div>
      ),
    },
    {
      id: "ifza",
      nameEn: "IFZA Free Zone",
      nameAr: "منطقة إيفزا الحرة",
      shortTagEn: "International Dynamic Hub",
      shortTagAr: "المنطقة الحرة الدولية الأكثر نمواً",
      categoryEn: "Free Zone • Silicon Oasis",
      categoryAr: "منطقة حرة • واحة دبي للسيليكون",
      taglineEn: "International Free Zone Authority • Dubai Silicon Oasis",
      taglineAr: "هيئة المنطقة الحرة الدولية • واحة دبي للسيليكون",
      descriptionEn:
        "IFZA Dubai is the premier dynamic ecosystem for global entrepreneurs, offering multi-activity licensing, luxury office suites at Dubai Silicon Oasis, and international investor networking.",
      descriptionAr:
        "إيفزا دبي هي الخيار الأول للمستثمرين الدوليين، حيث تتيح دمج عدة أنشطة في ترخيص واحد مع مكاتب حديثة في واحة دبي للسيليكون وإجراءات سريعة 100% عن بُعد.",
      benefitsEn: [
        "Combine professional, commercial, and consulting activities in 1 license",
        "100% remote setup without physical travel requirements",
        "Modern corporate offices & co-working spaces at DSO Dubai",
        "Comprehensive health insurance and family residency options",
      ],
      benefitsAr: [
        "دمج الأنشطة المهنية والتجارية والاستشارية في رخصة واحدة",
        "تأسيس كامل للشركة عن بُعد دون اشتراط التواجد الشخصي",
        "مكاتب ومساحات عمل مشتركة فاخرة في واحة دبي للسيليكون",
        "باقات تأمين صحي شامل وتأشيرات إقامة للمستثمر والعائلة",
      ],
      corporateTaxEn: "Free zone relief structure and compliant bookkeeping under UAE Corporate Tax Law.",
      corporateTaxAr: "هيكلة ضريبية متوافقة مع متطلبات الـ 0% ومسك دفاتر مؤهل لمعايير الهيئة الاتحادية.",
      whatsappMessageEn:
        "Hi Dias Accounting, I would like to consult about IFZA Dubai Free Zone incorporation and tax compliance.",
      whatsappMessageAr:
        "مرحباً دياس للمحاسبة، أود استشارة حول تأسيس شركة والامتثال الضريبي في منطقة إيفزا دبي (IFZA).",
      accentBadge: "Global Choice",
      logoComponent: (
        <div className="flex flex-col items-center justify-center text-center select-none py-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 p-0.5 shadow-xs mb-1 flex items-center justify-center">
            <div className="w-full h-full rounded-full border border-white/40 flex items-center justify-center">
              <div className="w-4 h-2 border-b-2 border-white rounded-b-full transform -translate-y-0.5" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-wider text-navy-950 uppercase font-display">
            IFZA
          </span>
          <span className="text-[6.5px] font-bold text-slate-500 leading-tight block">
            هيئة المنطقة الحرة الدولية
          </span>
          <span className="text-[6px] font-semibold text-slate-400 uppercase tracking-tighter">
            International Free Zone Authority
          </span>
        </div>
      ),
    },
    {
      id: "shams",
      nameEn: "Sharjah Media City (Shams)",
      nameAr: "مدينة الشارقة للإعلام (شمس)",
      shortTagEn: "Media & Digital Hub",
      shortTagAr: "المركز الرقمي والإعلامي الرائد",
      categoryEn: "Free Zone • Sharjah",
      categoryAr: "منطقة حرة • الشارقة",
      taglineEn: "Media, E-commerce & Creative Services Leader",
      taglineAr: "عاصمة الابتكار الإعلامي والتجارة الرقمية والإبداع",
      descriptionEn:
        "Shams Free Zone is the creative and digital epicenter of the Northern Emirates, empowering media pioneers, digital agencies, tech startups, and e-commerce companies with fast setup and cost-effective multi-visa packages.",
      descriptionAr:
        "تعد مدينة الشارقة للإعلام (شمس) المركز الإبداعي والرقمي الرائد في الإمارات الشمالية، حيث تقدم حلولاً مرنة لرواد الإعلام والتقنية والتجارة الإلكترونية مع باقات تأشيرات متعددة واقتصادية.",
      benefitsEn: [
        "Designed specifically for media, IT, digital agencies & e-commerce",
        "Issue up to 6 visas on a shared flexi-desk package",
        "Quick company incorporation within 24–48 hours",
        "Minimal corporate documentation and 100% capital repatriation",
      ],
      benefitsAr: [
        "مصممة خصيصاً لقطاعات الإعلام والتسويق الرقمي وتكنولوجيا المعلومات",
        "إمكانية إصدار حتى 6 تأشيرات إقامة على باقة المكتب المرن المشترك",
        "إصدار الترخيص وسجل الشركة خلال 24 إلى 48 ساعة فقط",
        "تحويل كامل للأرباح ورأس المال للخارج مع إجراءات ورقية ميسرة",
      ],
      corporateTaxEn: "Eligible for small business relief (SBR) up to AED 3,000,000 revenue or Free Zone 0% QFZP.",
      corporateTaxAr: "مؤهلة للاستفادة من تسهيلات الأعمال الصغيرة حتى 3 ملايين د.إ أو نسبة 0% للشركات المؤهلة.",
      whatsappMessageEn:
        "Hi Dias Accounting, I would like to inquire about Sharjah Media City (Shams) company registration and bookkeeping services.",
      whatsappMessageAr:
        "مرحباً دياس للمحاسبة، أود الاستفسار حول تأسيس شركة وخدمات مسك الدفاتر في مدينة الشارقة للإعلام (شمس).",
      accentBadge: "Creative & Tech",
      logoComponent: (
        <div className="flex flex-col items-center justify-center text-center select-none py-1">
          {/* Shams Creative Polygon Logo */}
          <div className="relative w-9 h-8 mb-1 flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 via-amber-500 to-gold-400 transform rotate-45 flex items-center justify-center shadow-xs">
              <span className="text-white font-extrabold text-[10px] transform -rotate-45 tracking-widest">
                S
              </span>
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-navy-950 uppercase font-display">
            shams
          </span>
          <span className="text-[6.5px] font-bold text-rose-700 uppercase tracking-wider">
            Sharjah Media City
          </span>
        </div>
      ),
    },
    {
      id: "afza",
      nameEn: "Ajman Free Zone (AFZA)",
      nameAr: "منطقة عجمان الحرة",
      shortTagEn: "Strategic Maritime & Trade",
      shortTagAr: "موقع بحري وتجاري استراتيجي",
      categoryEn: "Free Zone • Ajman",
      categoryAr: "منطقة حرة • عجمان",
      taglineEn: "Established Gateway • Flexible Installments",
      taglineAr: "بوابة تجارية عريقة • تسهيلات دفع بالتقسيط",
      descriptionEn:
        "Established in 1988, Ajman Free Zone offers prime sea-port proximity, flexible installment payment options, and state-of-the-art warehouses ideal for international trading, warehousing, and commercial enterprises.",
      descriptionAr:
        "تأسست منطقة عجمان الحرة عام 1988 وتوفر موقعاً استراتيجياً مطلاً على ميناء عجمان، مع خيارات مرنة للسداد بالتقسيط ومستودعات متطورة للتجارة والتخزين الدولي.",
      benefitsEn: [
        "Flexible installment payment facilities (up to 4 cheques)",
        "Direct access to Ajman Port and international shipping lanes",
        "Comprehensive eco-friendly industrial & commercial warehouses",
        "Streamlined licensing for international import/export operations",
      ],
      benefitsAr: [
        "تسهيلات سداد رسوم الترخيص على دفعات ميسرة (حتى 4 شيكات)",
        "اتصال مباشر بميناء عجمان والممرات الملاحية الدولية",
        "مستودعات تجارية وصناعية حديثة ومجهزة وصديقة للبيئة",
        "تراخيص فورية ومبسطة لعمليات الاستيراد والتصدير وإعادة الشحن",
      ],
      corporateTaxEn: "0% Corporate Tax potential for qualifying Free Zone logistics and manufacturing operations.",
      corporateTaxAr: "إمكانية الاستفادة من نسبة 0% لضريبة الشركات في الأنشطة اللوجستية والتصنيعية المؤهلة.",
      whatsappMessageEn:
        "Hi Dias Accounting, I would like to consult on Ajman Free Zone (AFZA) license formation and VAT compliance.",
      whatsappMessageAr:
        "مرحباً دياس للمحاسبة، أود استشارة حول تأسيس ترخيص منطقة عجمان الحرة (AFZA) والامتثال لضريبة القيمة المضافة.",
      accentBadge: "Logistics Hub",
      logoComponent: (
        <div className="flex flex-col items-center justify-center text-center select-none py-1">
          {/* AFZA Maritime Shield Logo */}
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 bg-emerald-50 flex items-center justify-center mb-1 shadow-xs">
            <span className="text-emerald-800 font-extrabold text-[9px] tracking-tight">
              AFZ
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-navy-950 uppercase font-display">
            AJMAN FZ
          </span>
          <span className="text-[6.5px] font-bold text-emerald-700 uppercase tracking-wider">
            Ajman Free Zone Authority
          </span>
        </div>
      ),
    },
    {
      id: "mainland",
      nameEn: "Mainland - Dubai",
      nameAr: "البر الرئيسي - دبي",
      shortTagEn: "Direct Local Market Access",
      shortTagAr: "دائرة الاقتصاد والسياحة (DED)",
      categoryEn: "Mainland • Dubai DET",
      categoryAr: "البر الرئيسي • اقتصاد دبي",
      taglineEn: "Economy & Tourism • 100% Direct UAE Local Market Access",
      taglineAr: "اقتصاد وسياحة دبي • تجارة مباشرة 100% في السوق المحلي",
      descriptionEn:
        "Dubai Mainland licenses issued by the Department of Economy and Tourism (DET) grant unrestricted access to trade directly across the UAE local market, government tenders, and unlimited branch expansions.",
      descriptionAr:
        "تمنح رخصة دبي التجارية الصادرة عن دائرة الاقتصاد والسياحة حرية التجارة المباشرة داخل السوق المحلي الإماراتي والمشاركة في المناقصات الحكومية وفتح الفروع بلا قيود.",
      benefitsEn: [
        "100% foreign ownership across 1,000+ commercial & industrial activities",
        "Direct local trading across all 7 Emirates without a local service agent",
        "Eligibility to bid for lucrative UAE government and municipal tenders",
        "No geographic restrictions on office or warehouse locations across Dubai",
      ],
      benefitsAr: [
        "ملكية أجنبية 100% في أكثر من 1000 نشاط تجاري وصناعي",
        "حرية التجارة والتوزيع المباشر في كافة إمارات الدولة بدون وكيل مواطن",
        "الأهلية للمشاركة في المناقصات والعقود الحكومية الكبرى",
        "حرية اختيار موقع المقر أو المستودعات في أي منطقة داخل دبي",
      ],
      corporateTaxEn: "Standard UAE Corporate Tax compliance (0% up to AED 375k, 9% standard, SBR relief up to AED 3M).",
      corporateTaxAr: "امتثال ضريبي قياسي (0% حتى 375 ألف د.إ، و9% لما زاد، مع تطبيق إعفاء SBR حتى 3 مليون د.إ).",
      whatsappMessageEn:
        "Hi Dias Accounting, I am interested in Dubai Mainland (DET) licensing, VAT registration, and corporate tax compliance.",
      whatsappMessageAr:
        "مرحباً دياس للمحاسبة، أنا مهتم برخصة البر الرئيسي في دبي (دائرة الاقتصاد والسياحة) وتسجيل VAT وضريبة الشركات.",
      accentBadge: "Local Market",
      logoComponent: (
        <div className="flex flex-col items-center justify-center text-center select-none py-1">
          <div className="text-2xl sm:text-3xl font-black text-teal-800 tracking-tight flex items-center justify-center font-display">
            <span className="tracking-widest uppercase">DUBAI</span>
          </div>
          <div className="text-[8px] sm:text-[9px] font-bold text-teal-600 leading-tight mt-0.5">
            للاقتصاد والسياحة
          </div>
          <div className="text-[7px] font-semibold text-teal-800 uppercase tracking-wider">
            Economy and Tourism
          </div>
        </div>
      ),
    },
  ];

  const handleOpenWhatsApp = (aff: AffiliationItem) => {
    const phoneNumber = "971529226958";
    const text = isAr ? aff.whatsappMessageAr : aff.whatsappMessageEn;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="affiliations" className="py-10 sm:py-14 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Architectural Glow and Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1e293b,transparent_70%)] pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-[11px] font-bold uppercase tracking-widest font-mono">
            <Award className="w-3 h-3 text-gold-400" />
            <span>{isAr ? "شراكات واعتمادات رسمية" : "Official UAE Jurisdictions"}</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isAr ? (
              <>
                شراكاتنا <span className="text-gold-400">واعتماداتنا</span>
              </>
            ) : (
              <>
                Our <span className="text-gold-400">Affiliations</span>
              </>
            )}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            {isAr
              ? "معتمدون لدى كبرى الهيئات والمناطق الحرة في دولة الإمارات لتأسيس الشركات، مسك الدفاتر المؤهل، والامتثال لضريبة الشركات وضريبة القيمة المضافة."
              : "Officially registered and authorized partner for company setup, compliant accounting, FTA tax filings, and 0% Free Zone tax eligibility across the UAE."}
          </p>
        </div>

        {/* Crisp Unified 6-Card Strip Layout (Desktop: 6 Columns) */}
        <div className="hidden xl:block relative max-w-6xl mx-auto">
          <div className="bg-navy-950/90 border border-slate-700/70 rounded-3xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="grid grid-cols-6 gap-3 relative z-10">
              {affiliations.map((aff) => {
                const name = isAr ? aff.nameAr : aff.nameEn;
                const category = isAr ? aff.categoryAr : aff.categoryEn;

                return (
                  <div
                    key={aff.id}
                    className="bg-navy-900 border border-slate-700/80 hover:border-gold-500/60 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 group"
                  >
                    {/* Top: Crisp White Logo Tile */}
                    <div className="h-28 bg-white p-2.5 flex flex-col items-center justify-center relative overflow-hidden">
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-slate-100 text-[7.5px] font-extrabold uppercase tracking-wider text-slate-600">
                        {aff.accentBadge}
                      </span>
                      <div className="transform scale-90">
                        {aff.logoComponent}
                      </div>
                    </div>

                    {/* Bottom: Compact Solid Navy/Gold Action Block */}
                    <div className="p-3 flex flex-col justify-between gap-2.5 text-center text-white flex-1 border-t border-slate-800">
                      <div className="space-y-0.5">
                        <span className="text-[8.5px] uppercase tracking-wider text-gold-400 font-mono block truncate">
                          {category}
                        </span>
                        <h3 className="font-display text-xs font-bold tracking-tight text-white line-clamp-1">
                          {name}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedAffiliation(aff)}
                        className="w-full py-1.5 rounded-lg border border-gold-400/80 text-gold-400 hover:bg-gold-500 hover:text-navy-950 text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1"
                      >
                        <span>{isAr ? "اكتشف المزيد" : "KNOW MORE"}</span>
                        <ChevronRight className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Medium Screens (Tablets / Laptops): 3x2 Bento Grid */}
        <div className="hidden sm:grid xl:hidden grid-cols-2 lg:grid-cols-3 gap-3.5 max-w-4xl mx-auto">
          {affiliations.map((aff) => {
            const name = isAr ? aff.nameAr : aff.nameEn;
            const category = isAr ? aff.categoryAr : aff.categoryEn;

            return (
              <div
                key={aff.id}
                className="bg-navy-950 border border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between transition-all duration-300 hover:border-gold-500/50 group"
              >
                {/* White Logo Banner */}
                <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-center min-h-[95px] relative">
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-slate-100 text-[8px] font-extrabold uppercase tracking-wider text-slate-700">
                    {aff.accentBadge}
                  </span>
                  <div className="transform scale-90">
                    {aff.logoComponent}
                  </div>
                </div>

                {/* Dark Action Block */}
                <div className="p-3 space-y-2.5 flex flex-col justify-between flex-grow">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gold-400 block">
                      {category}
                    </span>
                    <h3 className="font-display text-sm font-bold text-white">
                      {name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedAffiliation(aff)}
                    className="w-full py-1.5 rounded-lg border border-gold-400 text-gold-400 hover:bg-gold-500 hover:text-navy-950 text-[11px] font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-98 text-center flex items-center justify-center gap-1"
                  >
                    <span>{isAr ? "اكتشف المزيد" : "KNOW MORE"}</span>
                    <ChevronRight className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Screens: Compact 2-column Cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:hidden">
          {affiliations.map((aff) => {
            const name = isAr ? aff.nameAr : aff.nameEn;
            const category = isAr ? aff.categoryAr : aff.categoryEn;

            return (
              <div
                key={aff.id}
                className="bg-navy-950 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="p-2.5 bg-white flex items-center justify-center min-h-[85px] relative">
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-slate-100 text-[7px] font-extrabold uppercase tracking-wider text-slate-700">
                    {aff.accentBadge}
                  </span>
                  <div className="transform scale-80">
                    {aff.logoComponent}
                  </div>
                </div>

                <div className="p-2.5 bg-navy-900 flex flex-col justify-between gap-2 flex-1">
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-mono tracking-wider text-gold-400 block truncate">
                      {category}
                    </span>
                    <h3 className="font-display text-xs font-bold text-white line-clamp-1">
                      {name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedAffiliation(aff)}
                    className="w-full py-1.5 rounded-md bg-gold-500 hover:bg-gold-400 text-navy-950 text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    {isAr ? "تفاصيل" : "KNOW MORE"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Fast CTA Strip */}
        <div className="bg-navy-950/80 border border-slate-800 rounded-xl p-3 sm:p-4 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <h4 className="font-display text-xs sm:text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-gold-400" />
              <span>
                {isAr ? "هل تبحث عن ترخيص أو استشارة لمنطقة أخرى؟" : "Looking for Setup or Tax Filing in Another Jurisdiction?"}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {isAr
                ? "نوفر الدعم والمحاسبة القانونية عبر كافة المناطق الحرة والتراخيص التجارية في دبي والإمارات."
                : "We support formation, bookkeeping, and tax compliance across all UAE Free Zones and Mainland authorities."}
            </p>
          </div>

          <a
            href="https://wa.me/971529226958"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-display font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0 transition-all active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 text-navy-950" />
            <span>{isAr ? "تحدث مع مستشارنا" : "Talk to an Advisor"}</span>
          </a>
        </div>
      </div>

      {/* Interactive Detail Modal for "KNOW MORE" */}
      {selectedAffiliation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            {/* Modal Header: Website Navy & Gold */}
            <div className="p-6 bg-navy-950 text-white flex items-start justify-between relative border-b border-gold-500/30">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 block">
                  {isAr ? selectedAffiliation.categoryAr : selectedAffiliation.categoryEn}
                </span>
                <h3 className="font-display text-2xl font-bold text-white">
                  {isAr ? selectedAffiliation.nameAr : selectedAffiliation.nameEn}
                </h3>
                <p className="text-xs text-slate-300">
                  {isAr ? selectedAffiliation.taglineAr : selectedAffiliation.taglineEn}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAffiliation(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Logo & Description */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-24 shrink-0 flex items-center justify-center bg-white p-2 rounded-xl shadow-xs">
                  {selectedAffiliation.logoComponent}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isAr ? selectedAffiliation.descriptionAr : selectedAffiliation.descriptionEn}
                </p>
              </div>

              {/* Key Advantages */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-navy-950 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gold-600" />
                  <span>{isAr ? "أبرز المزايا والتسهيلات:" : "Key Authority Advantages:"}</span>
                </h4>
                <div className="space-y-2">
                  {(isAr ? selectedAffiliation.benefitsAr : selectedAffiliation.benefitsEn).map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-tight">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corporate Tax / FTA Highlight */}
              <div className="bg-gold-500/10 border border-gold-500/30 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-navy-950 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                  {isAr ? "الامتثال لضريبة الشركات في الإمارات:" : "UAE Corporate Tax & 0% Treatment:"}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {isAr ? selectedAffiliation.corporateTaxAr : selectedAffiliation.corporateTaxEn}
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenWhatsApp(selectedAffiliation);
                    setSelectedAffiliation(null);
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-navy-950 hover:bg-navy-900 text-gold-400 hover:text-white font-display font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? "استفسر عبر واتساب" : "Inquire on WhatsApp"}</span>
                </button>

                <a
                  href="#contact"
                  onClick={() => setSelectedAffiliation(null)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl border border-slate-200 hover:border-slate-300 text-navy-950 font-display font-bold text-xs text-center cursor-pointer transition-colors"
                >
                  {isAr ? "حجز استشارة" : "Book Meeting"}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OurAffiliations;
