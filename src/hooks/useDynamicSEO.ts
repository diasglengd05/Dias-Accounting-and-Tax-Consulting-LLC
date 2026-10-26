import { useEffect } from "react";
import { Service, BlogPost } from "../types";
import { Language } from "../i18n/translations";
import { getBlogOgImageUrl } from "../lib/ogImage";

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  hash: string;
  ogType?: string;
  ogImage?: string;
}

// Master English SEO Metadata Dictionary
export const SECTION_SEO_MAP_EN: Record<string, SEOConfig> = {
  home: {
    title: "Tax Consulting Services in UAE & Tax Advisory Dubai | Dias UAE",
    description: "Premier tax consulting services in UAE and tax advisory services in Dubai. FTA-certified Corporate Tax advisory (9% & 0% QFZP), VAT compliance, IFRS accounting services, backlog accounting, and Free Zone support.",
    keywords: "tax consulting services in uae, tax advisory services in dubai, corporate tax advisory dubai, vat compliance uae, accounting services in dubai, tax consulting in uae, FTA registered tax agency dubai, corporate tax filing uae 9%, small business relief uae aed 3m, qualifying free zone person 0% qfzp, backlog accounting dubai, ifrs bookkeeping uae, shams free zone company setup, dmcc ifza difc tax consultant",
    hash: "#home",
    ogImage: "/api/og?title=Tax+Consulting+Services+in+UAE+%26+Tax+Advisory+Dubai&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=Corporate+Tax+%26+VAT+Advisory&readTime=FTA+Certified",
  },
  services: {
    title: "Corporate Tax Advisory, VAT Compliance & Accounting Services | Dias UAE",
    description: "Comprehensive tax consulting in UAE & Dubai: Corporate Tax Advisory (9% & 0% SBR/QFZP), Value Added Tax (5% VAT) compliance, IFRS Accounting Services, Backlog Accounting, and Free Zone business support.",
    keywords: "corporate tax advisory uae, vat compliance dubai, accounting services uae, tax consulting services in uae, tax advisory services in dubai, qualifying free zone person 0%, backlog accounting dubai, statutory audit free zone uae",
    hash: "#services",
    ogImage: "/api/og?title=Corporate+Tax+Advisory%2C+VAT+Compliance+%26+Accounting+Services&author=Glen+Dias&role=Senior+Tax+Consultant&tag=FTA+Certified+Services&readTime=Full+Service",
  },
  "company-setup": {
    title: "UAE Free Zone & Mainland Business Setup & Tax Structuring | Dias UAE",
    description: "Turnkey company incorporation and tax advisory services in Dubai Mainland (DET), SHAMS Free Zone, DMCC, IFZA, Meydan, and DIFC with 0% QFZP corporate tax structuring.",
    keywords: "free zone business setup uae, shams free zone company formation, dubai mainland det license, tax structuring dubai, 0% free zone corporate tax uae",
    hash: "#company-setup",
    ogImage: "/api/og?title=UAE+Free+Zone+%26+Mainland+Company+Setup+%26+Tax+Structuring&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=Business+Incorporation&readTime=Turnkey+Setup",
  },
  "why-choose-us": {
    title: "Why Choose Dias Accounting | Tax Advisory Services in Dubai & UAE",
    description: "Discover why 500+ UAE enterprises trust Dias Accounting for FTA-accredited tax consulting services in UAE, IFRS accuracy, and cloud accounting automation.",
    keywords: "why choose dias accounting, best tax advisory services in dubai, fta certified tax consultants uae, ifrs accounting firm dubai",
    hash: "#why-choose-us",
    ogImage: "/api/og?title=6+Core+Pillars+of+Institutional+Tax+%26+Accounting+Excellence&author=Glen+Dias&role=Managing+Partner&tag=Why+Choose+Dias&readTime=100%25+Compliance",
  },
  about: {
    title: "About Dias Accounting | Chartered Tax Consultants in Dubai & UAE",
    description: "Led by Senior Tax Advisor Glen Dias, Dias Accounting delivers high-precision Corporate Tax advisory, VAT compliance, and IFRS accounting services across Dubai, Sharjah & UAE.",
    keywords: "Glen Dias tax advisor, Dias Accounting LLC, certified tax consultant Dubai, tax consulting services in uae, tax advisory services in dubai",
    hash: "#about",
    ogImage: "/api/og?title=About+Glen+Dias+%26+Certified+Tax+Advisors+Dubai&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=Zero+Penalty+Guarantee&readTime=15%2B+Yrs+Exp",
  },
  pricing: {
    title: "Transparent Accounting & Corporate Tax Advisory Fees UAE | Dias UAE",
    description: "Flat-fee monthly accounting services, VAT compliance, backlog accounting, and UAE Corporate Tax advisory packages starting from AED 500 for Mainland and Free Zone companies.",
    keywords: "tax consulting fees uae, accounting services cost dubai, corporate tax filing fee uae, backlog accounting package dubai, monthly bookkeeping price uae",
    hash: "#pricing",
    ogImage: "/api/og?title=Fixed-Fee+UAE+Accounting+%26+Corporate+Tax+Packages&author=Dias+Tax+Team&role=Transparent+Fee+Schedule&tag=From+AED+500&readTime=Zero+Hidden+Fees",
  },
  jurisdictions: {
    title: "Dubai & UAE Free Zone Tax Compliance | SHAMS, DMCC, IFZA, DIFC | Dias UAE",
    description: "Specialized tax advisory services in Dubai Mainland (DET), SHAMS Sharjah, DMCC, IFZA, Meydan, and DIFC. Ensure 0% QFZP tax and IFRS audit compliance.",
    keywords: "tax advisory services in dubai, shams free zone tax agent sharjah, dmcc accounting firm dubai, ifza corporate tax filing, difc tax compliance",
    hash: "#jurisdictions",
    ogImage: "/api/og?title=UAE+Jurisdictions+%26+Free+Zone+Tax+Authority&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=All+7+Emirates&readTime=Local+Compliance",
  },
  caseStudies: {
    title: "Client Case Studies & Proven Tax Savings | Dias Accounting UAE",
    description: "See how Dias Accounting helps UAE businesses optimize corporate tax, claim Small Business Relief, and clear historical accounting backlogs with zero FTA penalties.",
    keywords: "uae corporate tax case study, vat compliance dubai results, backlog accounting case study uae",
    hash: "#case-studies",
    ogImage: "/api/og?title=Proven+UAE+Tax+Savings+%26+Client+Case+Studies&author=Dias+Tax+Team&role=E-E-A-T+Verified&tag=AED+180k%2B+Saved&readTime=Case+Studies",
  },
  calculator: {
    title: "UAE Corporate Tax Calculator 2026 | 9% Tax & 0% Relief Estimator | Dias UAE",
    description: "Calculate your UAE Corporate Tax liability instantly. Estimate 9% corporate tax above AED 375,000 and verify 0% Small Business Relief (AED 3M) or Free Zone QFZP eligibility.",
    keywords: "UAE corporate tax calculator, 9 percent tax calculator Dubai, small business relief calculator UAE, calculate corporate tax UAE 2026",
    hash: "#calculator",
    ogImage: "/api/og?title=UAE+Corporate+Tax+Calculator+2026+(Free+9%25+Tool)&author=Glen+Dias&role=FTA+Tax+Agent&tag=Free+Interactive+Tool&readTime=Instant+Estimate",
  },
  testimonials: {
    title: "Verified Client Reviews (5.0★ Google Rating) | Dias Tax Consulting UAE",
    description: "Read verified 5.0-star Google reviews from UAE managing directors and founders who rely on Dias Accounting for Corporate Tax advisory, VAT compliance, and backlog accounting.",
    keywords: "Dias Accounting reviews, tax consultant Dubai reviews, corporate tax advisory testimonials UAE",
    hash: "#testimonials",
    ogImage: "/api/og?title=Client+Reviews+%26+5.0-Star+Ratings+Dubai+UAE&author=Verified+Clients&role=Google+Reviews+5.0%E2%98%85&tag=Trusted+by+500%2B+SMEs&readTime=Verified+Feedback",
  },
  faqs: {
    title: "UAE Corporate Tax, VAT Compliance & Accounting FAQ | Dias UAE",
    description: "Expert answers to UAE Corporate Tax (9%), 0% Free Zone QFZP rules, Small Business Relief (AED 3M), mandatory VAT registration, and backlog accounting deadlines.",
    keywords: "UAE corporate tax FAQ, VAT compliance rules UAE, Freezone 0 percent tax rules, FTA late registration penalty",
    hash: "#faqs",
    ogImage: "/api/og?title=UAE+Corporate+Tax+%26+VAT+Compliance+FAQ+2026&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=FTA+Regulations&readTime=Comprehensive+Guide",
  },
  blogs: {
    title: "UAE Corporate Tax, VAT & Free Zone Regulatory Insights | Dias UAE",
    description: "Authoritative regulatory briefings on UAE Corporate Tax, VAT compliance, IFRS accounting services, and Free Zone company formation by Senior Tax Advisor Glen Dias.",
    keywords: "UAE tax insights, corporate tax guide Dubai, FTA ministerial decisions, SHAMS free zone tax guide, accounting and bookkeeping UAE",
    hash: "#blogs",
    ogImage: "/api/og?title=UAE+Tax+Insights%2C+FTA+Guides+%26+Regulatory+Updates&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=UAE+Tax+Articles&readTime=Weekly+Insights",
  },
  contact: {
    title: "Book a Free Tax Consultation | Tax Advisory Services in Dubai & UAE | Dias",
    description: "Schedule a complimentary consultation with Dias Accounting & Tax Consulting. Serving Dubai, Sharjah (SHAMS), Abu Dhabi, and all UAE Emirates (+971 52 922 6958).",
    keywords: "contact tax consultant Dubai, book tax consultation UAE, tax advisory services in dubai contact, Dias Accounting phone number",
    hash: "#contact",
    ogImage: "/api/og?title=Book+Free+UAE+Tax+%26+Accounting+Consultation&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=Free+Assessment&readTime=Call+%2B971-52-922-6958",
  },
};

// Master Arabic SEO Metadata Dictionary
export const SECTION_SEO_MAP_AR: Record<string, SEOConfig> = {
  home: {
    title: "خدمات الاستشارات الضريبية في الإمارات ودبي | دياس للمحاسبة والاستشارات الضريبية",
    description: "أفضل خدمات الاستشارات الضريبية في الإمارات ودبي. استشارات ضريبة الشركات (9% وإعفاء 0% للمناطق الحرة)، الامتثال لضريبة القيمة المضافة، مسك الدفاتر، وإغلاق المتأخرات المحاسبية.",
    keywords: "خدمات الاستشارات الضريبية في الإمارات, استشارات ضريبية في دبي, ضريبة الشركات الإمارات, الامتثال لضريبة القيمة المضافة, خدمات المحاسبة ومسك الدفاتر دبي, تأسيس شركات المنطقة الحرة شمس",
    hash: "#home",
    ogImage: "/api/og?title=Tax+Consulting+Services+in+UAE+%26+Dubai&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=UAE+Tax+Compliance&readTime=FTA+Certified",
  },
  services: {
    title: "خدمات ضريبة الشركات والقيمة المضافة ومسك الدفاتر | دياز للمحاسبة دبي",
    description: "استكشف خدماتنا المحاسبية المعتمدة: إقرارات ضريبة الشركات 9%، ضريبة القيمة المضافة، استشارات نسبة 0% للمناطق الحرة المؤهلة، مسك الدفاتر السحابي، واستشارات CFO في دبي.",
    keywords: "إقرار ضريبة الشركات الإمارات, الإفصاح الطوعي ضريبة القيمة المضافة, الشخص المؤهل في المنطقة الحرة 0%, محاسب برنامج وافق دبي, محاسب زوهو بوكس الإمارات, تدقيق القوائم المالية دبي",
    hash: "#services",
    ogImage: "/api/og?title=Corporate+Tax%2C+VAT+Filing+%26+Bookkeeping+Services&author=Glen+Dias&role=Senior+Tax+Consultant&tag=FTA+Certified+Services&readTime=Full+Service",
  },
  about: {
    title: "عن المستشار غلين دياز وفريقنا المحاسبي المعتمد | دياز للمحاسبة دبي",
    description: "بقيادة المستشار الضريبي الأول غلين دياز، تقدم دياز للمحاسبة حلولاً محاسبية عالية الدقة متوافقة مع أنظمة الهيئة الاتحادية للضرائب ومعايير التقارير المالية الدولية IFRS.",
    keywords: "المستشار غلين دياز, شركة دياز للمحاسبة, مستشار ضريبي معتمد دبي, وكيل ضريبي الإمارات, محاسبون قانونيون الخليج التجاري دبي, محاسب معتمد CPA ACCA دبي",
    hash: "#about",
    ogImage: "/api/og?title=About+Glen+Dias+%26+Certified+Tax+Advisors+Dubai&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=Zero+Penalty+Guarantee&readTime=15%2B+Yrs+Exp",
  },
  pricing: {
    title: "باقات وأسعار خدمات المحاسبة وضريبة الشركات في دبي | دياز للمحاسبة",
    description: "باقات محاسبة شهرية واضحة ومحددة لضريبة الشركات ومسك الدفاتر تبدأ من 500 درهم/شهرياً لشركات البر الرئيسي والمناطق الحرة والشركات الناشئة في دبي.",
    keywords: "تكلفة المحاسبة في دبي, رسوم إقرار ضريبة الشركات الإمارات, باقات مسك الدفاتر الشهرية دبي, أسعار الوكيل الضريبي دبي, محاسب شركات بأسعار مناسبة دبي",
    hash: "#pricing",
    ogImage: "/api/og?title=Fixed-Fee+UAE+Accounting+%26+Corporate+Tax+Packages&author=Dias+Tax+Team&role=Affordable+SME+Packages&tag=From+AED+500%2Fmo&readTime=Transparent+Pricing",
  },
  jurisdictions: {
    title: "الامتثال لضريبة الشركات في دبي والمناطق الحرة | شمس، DMCC، إفزا | دياز",
    description: "استشارات ضريبية ومحاسبية متخصصة في دبي البر الرئيسي، مدينة الشارقة للإعلام شمس، ومركز دبي للسلع المتعددة. ضمان نسبة 0% للشخص المؤهل والتدقيق المالي.",
    keywords: "مستشار ضريبي الخليج التجاري دبي, مكتب محاسبة DMCC JLT, وكيل ضريبي مدينة الشارقة للإعلام شمس, ضريبة شركات إفزا, محاسبة ميدان",
    hash: "#jurisdictions",
    ogImage: "/api/og?title=UAE+Jurisdictions+%26+Free+Zone+Tax+Authority&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=All+7+Emirates&readTime=Local+Compliance",
  },
  caseStudies: {
    title: "دراسات حالة موثقة ووفورات ضريبية للعملاء | دياز للمحاسبة دبي",
    description: "اكتشف كيف ساعدت دياز للمحاسبة شركات الإمارات في توفير أكثر من 180,000 درهم في ضريبة الشركات وإسقاط الغرامات عبر الإفصاح الطوعي المعتمد لدى الهيئة.",
    keywords: "دراسة حالة ضريبة الشركات الإمارات, إسقاط غرامات القيمة المضافة دبي, إفصاح طوعي الهيئة الاتحادية للضرائب, تقييمات عملاء دياز",
    hash: "#case-studies",
    ogImage: "/api/og?title=Proven+UAE+Tax+Savings+%26+Client+Case+Studies&author=Dias+Tax+Team&role=E-E-A-T+Verified&tag=AED+180k%2B+Saved&readTime=Case+Studies",
  },
  calculator: {
    title: "حاسبة ضريبة الشركات الإماراتية 2026 | أداة حساب ضريبة 9% وتسهيلات المشاريع الصغيرة",
    description: "احسب التزام ضريبة الشركات التقديري لشركتك فوراً بدقة. احسب نسبة 9% لما فوق 375,000 درهم وتحقق من أهليتك لتسهيلات الأعمال الصغيرة حتى 3 مليون درهم.",
    keywords: "حاسبة ضريبة الشركات الإمارات, حساب ضريبة 9 بالمئة دبي, حاسبة تسهيلات الأعمال الصغيرة الإمارات, حساب الضريبة التقديرية 2026, حاسبة منصة إماراتاكس",
    hash: "#calculator",
    ogImage: "/api/og?title=UAE+Corporate+Tax+Calculator+2026+(Free+9%25+Tool)&author=Glen+Dias&role=FTA+Tax+Agent&tag=Free+Interactive+Tool&readTime=Instant+Estimate",
  },
  testimonials: {
    title: "آراء وتقييمات العملاء 5.0★ موثقة على Google | دياز للمحاسبة دبي",
    description: "اقرأ تقييمات موثقة من مدراء ومؤسسي الشركات في دبي الذين يعتمدون على دياز للمحاسبة لتجنب الغرامات والامتثال لضريبة الشركات والقيمة المضافة.",
    keywords: "تقييمات شركة دياز للمحاسبة, أفضل مستشار ضريبي دبي تقييمات, أفضل محاسب في دبي, مراجعات عملاء دياز للضرائب, خدمات ضريبية موثوقة الإمارات",
    hash: "#testimonials",
    ogImage: "/api/og?title=Client+Reviews+%26+5.0-Star+Ratings+Dubai+UAE&author=Verified+Clients&role=Google+Reviews+5.0%E2%98%85&tag=Trusted+by+120%2B+SMEs&readTime=Verified+Feedback",
  },
  faqs: {
    title: "الأسئلة الشائعة حول ضريبة الشركات والقيمة المضافة في الإمارات 2026 | دياز للمحاسبة",
    description: "إجابات الخبراء عن أهم استفسارات ضريبة الشركات في الإمارات: حد الـ 9%، مواعيد التسجيل الإلزامية في إماراتاكس، شروط إعفاء 0% للمناطق الحرة، وتجنب غرامة 10,000 درهم.",
    keywords: "أسئلة شائعة ضريبة الشركات الإمارات, الموعد النهائي لضريبة الشركات, شروط ضريبة الصفر للمنطقة الحرة, غرامة تأخير التسجيل الضريبي 10 آلاف, حد التسجيل في القيمة المضافة",
    hash: "#faqs",
    ogImage: "/api/og?title=UAE+Corporate+Tax+%26+VAT+Compliance+FAQ+2026&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=FTA+Regulations&readTime=Comprehensive+Guide",
  },
  blogs: {
    title: "المقالات والأدلة الضريبية والأنظمة المالية في الإمارات | دياز للمحاسبة دبي",
    description: "دليلك للبقاء على اطلاع دائم بأنظمة وقرارات الهيئة الاتحادية للضرائب، والامتثال لضريبة الشركات، واسترداد ضريبة القيمة المضافة، والقوائم المالية المدققة.",
    keywords: "أخبار الضرائب في الإمارات, دليل ضريبة الشركات دبي, قرارات مجلس الوزراء الضريبية, شروط استرداد القيمة المضافة, المحاسبة القانونية دبي",
    hash: "#blogs",
    ogImage: "/api/og?title=UAE+Tax+Insights%2C+FTA+Guides+%26+Regulatory+Updates&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=UAE+Tax+Articles&readTime=Weekly+Insights",
  },
  contact: {
    title: "تواصل مع دياز للمحاسبة دبي | احجز استشارة ضريبية مجانية 15 دقيقة",
    description: "تواصل مباشرة مع المستشار الضريبي المعتمد غلين دياز في الخليج التجاري، دبي. دعم فوري عبر واتساب (+971 52 922 6958) أو احجز استشارة مجانية.",
    keywords: "رقم محاسب في دبي, رقم مستشار ضريبي دبي, واتساب غلين دياز, مكتب محاسبة الخليج التجاري دبي, حجز استشارة ضريبية الإمارات",
    hash: "#contact",
    ogImage: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=1200",
  },
};

interface UseDynamicSEOMetadataProps {
  activeSection: string;
  selectedService?: Service | null;
  selectedBlog?: BlogPost | null;
  language?: Language;
  updateUrlHash?: boolean;
}

/**
 * Helper to update or create a `<meta>` element by name or property
 */
function setMetaTag(attributeName: "name" | "property", attributeValue: string, content: string) {
  if (typeof document === "undefined") return;

  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

/**
 * Helper to update or create the canonical link tag
 */
function setCanonical(url: string) {
  if (typeof document === "undefined") return;

  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

/**
 * Custom React Hook to dynamically synchronize document title and SEO meta tags
 * (title, description, keywords, Open Graph, Twitter cards, locale, and canonical URL)
 * based on the user's currently active view/section, language, or open service/blog modal.
 */
export function useDynamicSEO({
  activeSection,
  selectedService = null,
  selectedBlog = null,
  language = "en",
  updateUrlHash = true,
}: UseDynamicSEOMetadataProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    try {
      const baseUrl = "https://diasuae.ae";
      const isAr = language === "ar";
      const sectionMap = isAr ? SECTION_SEO_MAP_AR : SECTION_SEO_MAP_EN;
      let seoConfig: SEOConfig;

      // Case 1: Specific Service Modal is open
      if (selectedService) {
        const inclusions = Array.isArray(selectedService.inclusions) ? selectedService.inclusions : [];
        if (isAr) {
          seoConfig = {
            title: `${selectedService.title} في دبي، الإمارات | دياز للمحاسبة والاستشارات الضريبية`,
            description: `${selectedService.shortDesc || ""} مستشارون معتمدون لدى الهيئة الاتحادية للضرائب في الخليج التجاري دبي لتقديم خدمات ${selectedService.title} وتجنب الغرامات.`,
            keywords: `${selectedService.title} دبي, ${selectedService.title} الإمارات, وكيل ضريبي معتمد, دياز للمحاسبة, ${inclusions.slice(0, 3).join(", ")}`,
            hash: `#services-${selectedService.id}`,
            ogType: "article",
          };
        } else {
          seoConfig = {
            title: `${selectedService.title} in Dubai, UAE | Dias Accounting & Tax Consulting`,
            description: `${selectedService.shortDesc || ""} Certified FTA tax advisors in Business Bay Dubai providing full ${(selectedService.title || "").toLowerCase()} support. Avoid penalties with zero-error compliance.`,
            keywords: `${(selectedService.title || "").toLowerCase()} Dubai, ${(selectedService.title || "").toLowerCase()} UAE, FTA tax agent, Dias Accounting, ${inclusions.slice(0, 3).join(", ").toLowerCase()}`,
            hash: `#services-${selectedService.id}`,
            ogType: "article",
          };
        }
      }
    // Case 2: Specific Blog Post Reader is open (Uses on-the-fly generated dynamic OG image)
    else if (selectedBlog) {
      const dynamicBlogOg = getBlogOgImageUrl({
        id: selectedBlog.id,
        title: selectedBlog.title,
        authorName: selectedBlog.author?.name || "Glen Dias",
        authorRole: selectedBlog.author?.role || "Senior Tax Consultant",
        tag: selectedBlog.tag || "UAE Tax Insights",
        date: selectedBlog.date,
        readTime: selectedBlog.readTime,
        summary: selectedBlog.summary,
      }, baseUrl);

      if (isAr) {
        seoConfig = {
          title: `${selectedBlog.title} | مقالات الضرائب في الإمارات | دياز للمحاسبة`,
          description: selectedBlog.summary || "اقرأ أحدث الرؤى والأنظمة حول ضريبة الشركات وضريبة القيمة المضافة في دولة الإمارات من خبراء دياز للمحاسبة.",
          keywords: `دليل الضرائب الإمارات, ${selectedBlog.tag}, ضريبة الشركات دبي, الامتثال الضريبي, ${selectedBlog.title}`,
          hash: `#blog-${selectedBlog.id}`,
          ogType: "article",
          ogImage: dynamicBlogOg,
        };
      } else {
        seoConfig = {
          title: `${selectedBlog.title} | UAE Tax Insights | Dias Accounting`,
          description: selectedBlog.summary || "Read the latest UAE Corporate Tax and VAT regulatory insights from Dias Accounting Dubai.",
          keywords: `UAE tax guide, ${selectedBlog.tag}, corporate tax Dubai, FTA compliance, ${selectedBlog.title.toLowerCase()}`,
          hash: `#blog-${selectedBlog.id}`,
          ogType: "article",
          ogImage: dynamicBlogOg,
        };
      }
    }
    // Case 3: Active Section on the landing page
    else {
      seoConfig = sectionMap[activeSection] || sectionMap.home;
    }

    const fullUrl = seoConfig.hash === "#home" ? `${baseUrl}/` : `${baseUrl}/${seoConfig.hash}`;
    const cleanPath = typeof window !== "undefined" && window.location.pathname && window.location.pathname !== "/"
      ? window.location.pathname
      : "/";
    const canonicalUrl = `${baseUrl}${cleanPath}`;

    // 1. Update Document Title
    document.title = seoConfig.title;

    // 2. Standard Meta Tags
    setMetaTag("name", "title", seoConfig.title);
    setMetaTag("name", "description", seoConfig.description);
    setMetaTag("name", "keywords", seoConfig.keywords);

    // 3. Open Graph Tags
    setMetaTag("property", "og:title", seoConfig.title);
    setMetaTag("property", "og:description", seoConfig.description);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", seoConfig.ogType || "website");
    setMetaTag("property", "og:site_name", "Dias Accounting & Tax Consulting LLC");
    setMetaTag("property", "og:locale", isAr ? "ar_AE" : "en_US");
    setMetaTag("property", "og:locale:alternate", isAr ? "en_US" : "ar_AE");

    // Local Business Geographic Meta Tags (Targeting Dubai & UAE authority)
    setMetaTag("property", "business:contact_data:street_address", "Sharjah Media City (SHAMS) & Business Bay");
    setMetaTag("property", "business:contact_data:locality", "Dubai");
    setMetaTag("property", "business:contact_data:region", "Dubai");
    setMetaTag("property", "business:contact_data:postal_code", "00000");
    setMetaTag("property", "business:contact_data:country_name", "United Arab Emirates");
    setMetaTag("property", "place:location:latitude", "25.2048");
    setMetaTag("property", "place:location:longitude", "55.2708");
    setMetaTag("name", "geo.region", "AE-DU");
    setMetaTag("name", "geo.placename", "Dubai");
    setMetaTag("name", "geo.position", "25.2048;55.2708");
    setMetaTag("name", "ICBM", "25.2048, 55.2708");

    const resolvedOgImage = seoConfig.ogImage
      ? (seoConfig.ogImage.startsWith("http") ? seoConfig.ogImage : `${baseUrl}${seoConfig.ogImage}`)
      : `${baseUrl}/api/og?title=Corporate+Tax%2C+VAT+%26+Bookkeeping+Experts+Dubai&author=Glen+Dias&tag=UAE+Tax+Compliance`;

    setMetaTag("property", "og:image", resolvedOgImage);
    setMetaTag("property", "og:image:secure_url", resolvedOgImage);
    setMetaTag("property", "og:image:type", "image/svg+xml");
    setMetaTag("property", "og:image:width", "1200");
    setMetaTag("property", "og:image:height", "630");
    setMetaTag("property", "og:image:alt", seoConfig.title);

    // Article Specific Meta (For Facebook, LinkedIn & Pinterest)
    if (selectedBlog) {
      setMetaTag("property", "article:published_time", selectedBlog.date ? `${selectedBlog.date}T09:00:00+04:00` : new Date().toISOString());
      setMetaTag("property", "article:author", selectedBlog.author?.name || "Glen Dias");
      setMetaTag("property", "article:section", selectedBlog.tag || "Tax Compliance");
      setMetaTag("property", "article:tag", selectedBlog.tag || "Corporate Tax");
      setMetaTag("property", "article:publisher", "https://www.linkedin.com/company/dias-accounting-and-tax-consulting");
    }

    // 4. Twitter / X Card Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:site", "@DiasAccounting");
    setMetaTag("name", "twitter:creator", "@glendias");
    setMetaTag("name", "twitter:domain", "diasuae.ae");
    setMetaTag("name", "twitter:title", seoConfig.title);
    setMetaTag("name", "twitter:description", seoConfig.description);
    setMetaTag("name", "twitter:url", canonicalUrl);
    setMetaTag("name", "twitter:image", resolvedOgImage);
    setMetaTag("name", "twitter:image:alt", seoConfig.title);

    // 5. Advanced Search Bot Directives
    setMetaTag("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    setMetaTag("name", "googlebot", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    setMetaTag("name", "bingbot", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");

    // 6. Canonical URL (Clean preferred domain URL without hash fragment)
    setCanonical(canonicalUrl);

    // 7. Dynamic JSON-LD Structured Data Schema for Rich Results
    if (typeof document !== "undefined") {
      let dynamicSchemaScript = document.getElementById("dynamic-seo-jsonld") as HTMLScriptElement | null;
      if (!dynamicSchemaScript) {
        dynamicSchemaScript = document.createElement("script");
        dynamicSchemaScript.id = "dynamic-seo-jsonld";
        dynamicSchemaScript.type = "application/ld+json";
        document.head.appendChild(dynamicSchemaScript);
      }

      if (selectedBlog) {
        dynamicSchemaScript.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": `${fullUrl}#article`,
          "headline": selectedBlog.title,
          "description": selectedBlog.summary || seoConfig.description,
          "image": [resolvedOgImage],
          "datePublished": selectedBlog.date ? `${selectedBlog.date}T09:00:00+04:00` : "2026-01-01T09:00:00+04:00",
          "dateModified": new Date().toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": fullUrl
          },
          "author": {
            "@type": "Person",
            "name": selectedBlog.author?.name || "Glen Dias",
            "jobTitle": selectedBlog.author?.role || "Senior Tax Consultant",
            "worksFor": {
              "@type": "AccountingService",
              "name": "Dias Accounting and Tax Consulting LLC",
              "url": baseUrl
            }
          },
          "publisher": {
            "@type": "Organization",
            "name": "Dias Accounting and Tax Consulting LLC",
            "url": baseUrl,
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/assets/logo.png`
            }
          },
          "articleSection": selectedBlog.tag || "Tax Regulations",
          "inLanguage": isAr ? "ar" : "en"
        });
      } else if (selectedService) {
        dynamicSchemaScript.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${fullUrl}#service`,
          "name": selectedService.title,
          "description": selectedService.shortDesc || seoConfig.description,
          "serviceType": selectedService.title,
          "provider": {
            "@type": "AccountingService",
            "name": "Dias Accounting and Tax Consulting LLC",
            "url": baseUrl,
            "telephone": "+971-52-922-6958"
          },
          "areaServed": {
            "@type": "Country",
            "name": "United Arab Emirates"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": selectedService.title,
            "itemListElement": (Array.isArray(selectedService.inclusions) ? selectedService.inclusions : []).map((inc) => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": inc
              }
            }))
          }
        });
      } else {
        dynamicSchemaScript.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": `${baseUrl}/`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": activeSection ? activeSection.charAt(0).toUpperCase() + activeSection.slice(1) : "Home",
              "item": fullUrl
            }
          ]
        });
      }
    }

    // 8. Non-intrusive URL Hash synchronization
    if (updateUrlHash && typeof window !== "undefined" && window.history && window.history.replaceState) {
      const currentHash = window.location.hash;
      const targetHash = seoConfig.hash === "#home" ? "" : seoConfig.hash;
      
      if (currentHash !== targetHash && !(currentHash === "" && targetHash === "")) {
        const newUrl = targetHash ? `${window.location.pathname}${targetHash}` : window.location.pathname;
        window.history.replaceState(null, "", newUrl);
      }
    }
  } catch (err) {
    console.warn("useDynamicSEO safe bypass:", err);
  }
  }, [activeSection, selectedService, selectedBlog, language, updateUrlHash]);
}

export default useDynamicSEO;
