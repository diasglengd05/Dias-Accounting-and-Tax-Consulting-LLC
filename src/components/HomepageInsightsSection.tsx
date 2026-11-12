import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { BlogPost } from "../types";
import { blogsData } from "../data/blogsData";

interface HomepageInsightsSectionProps {
  onSelectBlog: (blog: BlogPost) => void;
  onNavigate: (path: string) => void;
}

interface DisplayArticle {
  id: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  tag: string;
  image: string;
  externalUrl?: string;
  isLiveBlogger?: boolean;
  publishedIso?: string;
  internalBlogRef?: BlogPost;
}

function normalizeTitle(t: string): string {
  return (t || "")
    .toLowerCase()
    .replace(/&amp;/g, "&")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isDuplicateOfExisting(newTitle: string, existingTitles: string[]): boolean {
  const normNew = normalizeTitle(newTitle);
  const newTokens = normNew.split(" ").filter((w) => w.length > 2);
  if (newTokens.length === 0) return false;

  for (const exTitle of existingTitles) {
    const normEx = normalizeTitle(exTitle);
    if (normNew === normEx) return true;
    if (normNew.length > 15 && normEx.includes(normNew)) return true;
    if (normEx.length > 15 && normNew.includes(normEx)) return true;

    const exTokens = normEx.split(" ").filter((w) => w.length > 2);
    let overlapCount = 0;
    newTokens.forEach((t) => {
      if (exTokens.includes(t)) overlapCount++;
    });

    const overlapRatio = overlapCount / Math.min(newTokens.length, exTokens.length);
    if (overlapRatio >= 0.6) {
      return true;
    }
  }
  return false;
}

export const HomepageInsightsSection: React.FC<HomepageInsightsSectionProps> = ({
  onSelectBlog,
  onNavigate,
}) => {
  // Top 3 most recently published articles
  const initialHardcoded: DisplayArticle[] = [...blogsData]
    .sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0))
    .slice(0, 3)
    .map((b) => ({
      id: b.id,
      title: b.title,
      summary: b.summary,
      date: b.date,
      readTime: b.readTime,
      tag: b.tag,
      image: b.imageUrl || "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=700&q=80",
      internalBlogRef: b,
    }));

  const [articles, setArticles] = useState<DisplayArticle[]>(initialHardcoded);

  useEffect(() => {
    let isMounted = true;

    async function fetchBloggerFeed() {
      const feedUrl = "https://insights.diasuae.ae/feeds/posts/default?alt=json&max-results=10";
      const proxyUrl = "/api/blogger-feed";
      let data: any = null;

      try {
        const res = await fetch(feedUrl, { mode: "cors" });
        if (res.ok) {
          data = await res.json();
        } else {
          throw new Error("Direct fetch status " + res.status);
        }
      } catch (err) {
        try {
          const resProxy = await fetch(proxyUrl);
          if (resProxy.ok) {
            data = await resProxy.json();
          }
        } catch (proxyErr) {
          // silent fallback
        }
      }

      if (!isMounted || !data?.feed?.entry || !Array.isArray(data.feed.entry)) {
        return;
      }

      const existingTitles = blogsData.map((b) => b.title);
      const newBloggerArticles: DisplayArticle[] = [];

      data.feed.entry.forEach((entry: any) => {
        const rawTitle = (entry.title && entry.title.$t) || "";
        if (!rawTitle || isDuplicateOfExisting(rawTitle, existingTitles)) {
          return;
        }

        const altLink = (entry.link || []).find((l: any) => l.rel === "alternate");
        const liveUrl = altLink ? altLink.href : "https://insights.diasuae.ae/";

        let category = "Live Tax Updates";
        if (Array.isArray(entry.category) && entry.category.length > 0 && entry.category[0].term) {
          category = entry.category[0].term;
        }

        let pubDateStr = "Recent";
        if (entry.published && entry.published.$t) {
          try {
            const d = new Date(entry.published.$t);
            pubDateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          } catch (e) {}
        }

        let excerpt = "";
        const rawSummary = (entry.summary && entry.summary.$t) || (entry.content && entry.content.$t) || "";
        if (rawSummary) {
          const tmp = document.createElement("div");
          tmp.innerHTML = rawSummary;
          excerpt = (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim().substring(0, 160) + "...";
        }

        let image = "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=700&q=80";
        if (entry.media$thumbnail && entry.media$thumbnail.url) {
          image = entry.media$thumbnail.url.replace(/\/s\d+-c\//, "/s800/");
        } else if (rawSummary.includes("<img")) {
          const match = rawSummary.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (match && match[1]) image = match[1];
        }

        const blogId = "blogger-" + (entry.id && entry.id.$t ? entry.id.$t.split("post-")[1] || Math.random().toString(36).substr(2, 8) : Math.random().toString(36).substr(2, 8));

        newBloggerArticles.push({
          id: blogId,
          title: rawTitle,
          summary: excerpt || "Read the latest UAE corporate tax and compliance updates on our live Blogger portal.",
          date: pubDateStr,
          readTime: "4 min read",
          tag: category,
          image: image,
          externalUrl: liveUrl,
          isLiveBlogger: true,
          publishedIso: (entry.published && entry.published.$t) || "",
        });
      });

      // Always keep the latest published articles on the top
      if (newBloggerArticles.length > 0) {
        const combined = [...newBloggerArticles, ...initialHardcoded];
        combined.sort((a, b) => {
          const timeA = Date.parse(a.publishedIso || a.date) || 0;
          const timeB = Date.parse(b.publishedIso || b.date) || 0;
          return timeB - timeA;
        });
        setArticles(combined);
      }
    }

    fetchBloggerFeed();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="blogs" className="py-20 bg-white border-t border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200/80 pb-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-gold-600 font-bold uppercase tracking-wider block">
                LIVE TAX &amp; REGULATORY INSIGHTS
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Subdomain Connected
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-950 tracking-tight">
              UAE Corporate Tax, VAT &amp; Bookkeeping Insights
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Timely analysis, statutory decrees, and actionable compliance playbooks authored by FTA Registered Tax Agents in Dubai and Sharjah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://insights.diasuae.ae/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-navy-950 hover:bg-gold-500 hover:text-navy-950 text-white font-display font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              <span>Visit Live Blog (insights.diasuae.ae)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => onNavigate("/blogs")}
              className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-navy-950 hover:text-gold-600 transition-colors px-3 py-2 rounded-lg border border-slate-200 hover:border-gold-400 cursor-pointer"
            >
              <span>Full Archive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Articles Grid - Matching blog.html Card Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((item) => {
            const isExternal = Boolean(item.externalUrl);

            const handleClick = () => {
              if (isExternal && item.externalUrl) {
                window.open(item.externalUrl, "_blank", "noopener,noreferrer");
              } else if (item.internalBlogRef) {
                onSelectBlog(item.internalBlogRef);
              } else {
                onNavigate("/blogs");
              }
            };

            return (
              <article
                key={item.id}
                onClick={handleClick}
                className="bg-white rounded-2xl border border-slate-200 hover:border-gold-400 transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Thumbnail Wrap */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-navy-950/85 backdrop-blur-md text-gold-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-gold-400/30">
                        {item.tag}
                      </span>
                      {isExternal && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Live
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {item.readTime}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base sm:text-lg text-navy-950 group-hover:text-gold-600 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-gold-500" />
                    <span>FTA Tax Agent Verified</span>
                  </span>
                  <span className="text-xs font-display font-bold text-navy-950 group-hover:text-gold-600 flex items-center gap-1 transition-colors">
                    {isExternal ? "Read on Live Blog" : "Read Article"}
                    {isExternal ? (
                      <ExternalLink className="w-3.5 h-3.5 text-gold-600" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* 5. View All Insights on Blogger Subdomain Button */}
        <div className="mt-14 pt-8 border-t border-slate-200 text-center">
          <a
            href="https://insights.diasuae.ae/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-navy-950 hover:bg-gold-500 text-gold-400 hover:text-navy-950 border border-gold-500/80 px-8 py-4 rounded-xl font-display font-bold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-navy-950/10 hover:shadow-gold-500/20 active:scale-95"
          >
            <span>View All Insights &amp; Regulatory Briefings</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </a>
          <p className="mt-2.5 text-xs text-slate-500 font-medium">
            Live legislative updates and commentary published continuously on{" "}
            <a
              href="https://insights.diasuae.ae/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy-950 hover:text-gold-600 font-bold underline"
            >
              insights.diasuae.ae
            </a>
          </p>
        </div>

      </div>
    </section>
  );
};

export default HomepageInsightsSection;
