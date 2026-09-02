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
    title: "Expert Tax Consulting & Accounting in Dubai | Dias LLC",
    description: "Dias Accounting and Tax Consulting LLC provides expert UAE corporate tax registration, VAT compliance, bookkeeping, and SHAMS Free Zone setup in Dubai.",
    keywords: "Dubai accounting firm, UAE corporate tax consultant, VAT filing Dubai, Free Zone bookkeeping DMCC, FTA tax agent Dubai, Corporate tax registration EmaraTax, backlog accounting Dubai, Glen Dias accounting, business setup UAE",
    hash: "#home",
    ogImage: "/api/og?title=Expert+Tax+Consulting+%26+Accounting+in+Dubai&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=UAE+Tax+Compliance&readTime=FTA+Certified",
  },
  services: {
    title: "Corporate Tax, VAT Compliance & Bookkeeping Services | Dias Accounting Dubai",
    description: "Explore our FTA-certified accounting services: UAE Corporate Tax Filing (9%), VAT Returns & Disclosures, Free Zone QFZP 0% Tax Structuring, Cloud Bookkeeping, and Fractional CFO Advisory in Dubai.",
    keywords: "UAE corporate tax return, VAT voluntary disclosure, qualifying free zone person 0%, Xero bookkeeping Dubai, Zoho Books accountant UAE, audit financial statement Dubai, corporate tax advisory Business Bay",
    hash: "#services",
    ogImage: "/api/og?title=Corporate+Tax%2C+VAT+Filing+%26+Bookkeeping+Services&author=Glen+Dias&role=Senior+Tax+Consultant&tag=FTA+Certified+Services&readTime=Full+Service",
  },
  about: {
    title: "About Glen Dias & Our Certified Tax Team | Dias Accounting Dubai",
    description: "Led by Senior Tax Consultant Glen Dias, Dias Accounting delivers high-precision, FTA-compliant accounting, IFRS reporting, and tax advisory across Dubai & UAE.",
    keywords: "Glen Dias accountant, Dias Accounting LLC, certified tax consultant Dubai, FTA tax agent UAE, chartered accountants Business Bay Dubai, ACCA CPA accountants UAE",
    hash: "#about",
    ogImage: "/api/og?title=About+Glen+Dias+%26+Certified+Tax+Advisors+Dubai&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=Zero+Penalty+Guarantee&readTime=15%2B+Yrs+Exp",
  },
  pricing: {
    title: "Affordable Accounting & Corporate Tax Packages Dubai | Dias Accounting UAE",
    description: "Transparent, fixed-fee monthly bookkeeping and UAE corporate tax compliance packages starting from AED 500/mo for Mainland LLCs and Free Zone startups.",
    keywords: "accounting cost Dubai, corporate tax filing fees UAE, monthly bookkeeping package Dubai, FTA VAT agent cost, affordable accountant Dubai, small business bookkeeping price UAE",
    hash: "#pricing",
    ogImage: "/api/og?title=Fixed-Fee+UAE+Accounting+%26+Corporate+Tax+Packages&author=Dias+Tax+Team&role=Affordable+SME+Packages&tag=From+AED+500%2Fmo&readTime=Transparent+Pricing",
  },
  calculator: {
    title: "UAE Corporate Tax Calculator 2026 | Free 9% Tax & Small Business Relief Tool",
    description: "Calculate your UAE Corporate Tax liability instantly. Accurately estimate 9% tax above AED 375,000 threshold and verify Small Business Relief (AED 3M) eligibility.",
    keywords: "UAE corporate tax calculator, 9 percent tax calculator Dubai, small business relief calculator UAE, calculate corporate tax UAE 2026, EmaraTax tax estimator",
    hash: "#calculator",
    ogImage: "/api/og?title=UAE+Corporate+Tax+Calculator+2026+(Free+9%25+Tool)&author=Glen+Dias&role=FTA+Tax+Agent&tag=Free+Interactive+Tool&readTime=Instant+Estimate",
  },
  testimonials: {
    title: "Client Reviews & Testimonials 5.0★ | Dias Accounting Dubai",
    description: "Read genuine 5-star reviews from Dubai CEOs, founders, and finance directors who trust Dias Accounting for penalty-free corporate tax, VAT, and bookkeeping.",
    keywords: "Dias Accounting reviews, best tax consultant Dubai review, top rated accountant Dubai, corporate tax testimonials UAE, customer feedback Dias Accounting",
    hash: "#testimonials",
    ogImage: "/api/og?title=Client+Reviews+%26+5.0-Star+Ratings+Dubai+UAE&author=Verified+Clients&role=Google+Reviews+5.0%E2%98%85&tag=Trusted+by+120%2B+SMEs&readTime=Verified+Feedback",
  },
  faqs: {
    title: "UAE Corporate Tax & VAT FAQ 2026 | FTA Compliance Answers | Dias Accounting",
    description: "Get expert answers to common UAE Corporate Tax questions: 9% threshold, EmaraTax deadlines, Free Zone 0% qualification, and AED 10,000 late registration penalties.",
    keywords: "UAE corporate tax FAQ, corporate tax deadline UAE, Freezone 0 percent tax rules, FTA late registration penalty, VAT threshold UAE, Small Business Relief FAQ",
    hash: "#faqs",
    ogImage: "/api/og?title=UAE+Corporate+Tax+%26+VAT+Compliance+FAQ+2026&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=FTA+Regulations&readTime=Comprehensive+Guide",
  },
  blogs: {
    title: "UAE Tax Insights & Corporate Tax Compliance Guides | Dias Accounting Dubai",
    description: "Stay ahead of FTA regulations with expert articles on UAE Corporate Tax filing, VAT compliance, Small Business Relief, and audited financial statements.",
    keywords: "UAE tax news, corporate tax guide Dubai, FTA ministerial decisions, UAE VAT recovery rules, IFRS accounting Dubai, EmaraTax filing updates",
    hash: "#blogs",
    ogImage: "/api/og?title=UAE+Tax+Insights%2C+FTA+Guides+%26+Regulatory+Updates&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=UAE+Tax+Articles&readTime=Weekly+Insights",
  },
  contact: {
    title: "Contact Dias Accounting Dubai | Book a Free 15-Min Tax Consultation",
    description: "Contact FTA-certified tax consultant Glen Dias. Located in Business Bay, Dubai. Instant WhatsApp support (+971 52 922 6958) or book a free 15-minute consultation.",
    keywords: "contact accountant Dubai, tax consultant phone number Dubai, Glen Dias WhatsApp, accounting office Business Bay Dubai, book tax consultation UAE",
    hash: "#contact",
    ogImage: "/api/og?title=Book+Free+15-Min+UAE+Tax+Consultation+Dubai&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=Free+Assessment&readTime=Call+%2B971-52-922-6958",
  },
};

// Master Arabic SEO Metadata Dictionary
export const SECTION_SEO_MAP_AR: Record<string, SEOConfig> = {
  home: {
    title: "دياز للمحاسبة والاستشارات الضريبية | خبراء ضريبة الشركات وضريبة القيمة المضافة ومسك الدفاتر في دبي الإمارات",
    description: "مستشارون ضريبيون معتمدون لدى الهيئة الاتحادية للضرائب في دبي والإمارات. تسجيل ضريبة الشركات (9%)، إقرارات ضريبة القيمة المضافة، مسك الدفاتر، واستشارات المدير المالي.",
    keywords: "محاسب قانوني دبي, استشارات ضريبية الإمارات, ضريبة الشركات دبي 9%, تسجيل ضريبة القيمة المضافة, وكيل ضريبي معتمد دبي, محاسبة الشركات في دبي, غلين دياز للمحاسبة, تأسيس شركات الإمارات",
    hash: "#home",
    ogImage: "/api/og?title=Corporate+Tax%2C+VAT+%26+Bookkeeping+Experts+Dubai&author=Glen+Dias&role=FTA+Registered+Tax+Agent&tag=UAE+Tax+Compliance&readTime=FTA+Certified",
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

    const baseUrl = "https://diasuae.ae";
    const isAr = language === "ar";
    const sectionMap = isAr ? SECTION_SEO_MAP_AR : SECTION_SEO_MAP_EN;
    let seoConfig: SEOConfig;

    // Case 1: Specific Service Modal is open
    if (selectedService) {
      if (isAr) {
        seoConfig = {
          title: `${selectedService.title} في دبي، الإمارات | دياز للمحاسبة والاستشارات الضريبية`,
          description: `${selectedService.shortDesc} مستشارون معتمدون لدى الهيئة الاتحادية للضرائب في الخليج التجاري دبي لتقديم خدمات ${selectedService.title} وتجنب الغرامات.`,
          keywords: `${selectedService.title} دبي, ${selectedService.title} الإمارات, وكيل ضريبي معتمد, دياز للمحاسبة, ${selectedService.inclusions.slice(0, 3).join(", ")}`,
          hash: `#services-${selectedService.id}`,
          ogType: "article",
        };
      } else {
        seoConfig = {
          title: `${selectedService.title} in Dubai, UAE | Dias Accounting & Tax Consulting`,
          description: `${selectedService.shortDesc} Certified FTA tax advisors in Business Bay Dubai providing full ${selectedService.title.toLowerCase()} support. Avoid penalties with zero-error compliance.`,
          keywords: `${selectedService.title.toLowerCase()} Dubai, ${selectedService.title.toLowerCase()} UAE, FTA tax agent, Dias Accounting, ${selectedService.inclusions.slice(0, 3).join(", ").toLowerCase()}`,
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

    // 1. Update Document Title
    document.title = seoConfig.title;

    // 2. Standard Meta Tags
    setMetaTag("name", "title", seoConfig.title);
    setMetaTag("name", "description", seoConfig.description);
    setMetaTag("name", "keywords", seoConfig.keywords);

    // 3. Open Graph Tags
    setMetaTag("property", "og:title", seoConfig.title);
    setMetaTag("property", "og:description", seoConfig.description);
    setMetaTag("property", "og:url", fullUrl);
    setMetaTag("property", "og:type", seoConfig.ogType || "business.business");
    setMetaTag("property", "og:site_name", "Dias Accounting & Tax Consulting LLC");
    setMetaTag("property", "og:locale", isAr ? "ar_AE" : "en_US");
    setMetaTag("property", "og:locale:alternate", isAr ? "en_US" : "ar_AE");

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
    setMetaTag("name", "twitter:url", fullUrl);
    setMetaTag("name", "twitter:image", resolvedOgImage);
    setMetaTag("name", "twitter:image:alt", seoConfig.title);

    // 5. Advanced Search Bot Directives
    setMetaTag("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    setMetaTag("name", "googlebot", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    setMetaTag("name", "bingbot", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");

    // 6. Canonical URL
    setCanonical(fullUrl);

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
            "itemListElement": selectedService.inclusions.map((inc) => ({
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
  }, [activeSection, selectedService, selectedBlog, language, updateUrlHash]);
}

export default useDynamicSEO;
