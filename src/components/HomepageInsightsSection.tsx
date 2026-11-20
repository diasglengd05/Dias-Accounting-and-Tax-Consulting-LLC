import React, { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BlogPost } from "../types";
import { blogsData } from "../data/blogsData";
import { fetchLiveBloggerPosts } from "../lib/bloggerFeed";

interface HomepageInsightsSectionProps {
  onSelectBlog: (blog: BlogPost) => void;
  onNavigate: (path: string) => void;
}

interface DisplayArticle {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  externalUrl?: string;
  internalBlogRef?: BlogPost;
}

export const HomepageInsightsSection: React.FC<HomepageInsightsSectionProps> = ({
  onSelectBlog,
  onNavigate,
}) => {
  const fallbackStatic: DisplayArticle[] = [...blogsData]
    .sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0))
    .slice(0, 3)
    .map((b) => ({
      id: b.id,
      title: b.title,
      summary: b.summary,
      date: b.date,
      category: b.tag || "Tax Guide",
      internalBlogRef: b,
    }));

  const [articles, setArticles] = useState<DisplayArticle[]>(fallbackStatic);

  useEffect(() => {
    let isMounted = true;

    async function loadLatest() {
      try {
        const livePosts = await fetchLiveBloggerPosts(3);
        if (!isMounted || livePosts.length === 0) return;

        const mapped: DisplayArticle[] = livePosts.slice(0, 3).map((post) => ({
          id: post.id,
          title: post.title,
          summary: post.excerpt,
          date: post.publishedDate,
          category: post.primaryCategory,
          externalUrl: post.url,
        }));

        if (mapped.length < 3) {
          const needed = 3 - mapped.length;
          setArticles([...mapped, ...fallbackStatic.slice(0, needed)]);
        } else {
          setArticles(mapped);
        }
      } catch {
        // Silently retain clean static guides
      }
    }

    loadLatest();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="blogs"
      className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Clean Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1B2A] tracking-tight">
              UAE Tax &amp; Regulatory Insights
            </h2>
            <p className="text-base sm:text-lg text-[#475569] leading-[1.6] max-w-[60ch]">
              Practical FTA regulatory updates, Corporate Tax guides, and VAT checklists prepared by our registered tax agents.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 text-sm font-semibold">
            <a
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("/blog");
              }}
              className="inline-flex items-center gap-1.5 text-[#1B4332] hover:text-[#143326] transition-colors"
            >
              <span>All guides</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://insights.diasuae.ae/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#475569] hover:text-[#0D1B2A] transition-colors"
            >
              <span>Live briefings</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>

        {/* 3 Clean Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((item) => {
            const isExternal = Boolean(item.externalUrl);
            const href = isExternal && item.externalUrl ? item.externalUrl : `/blog/${item.id}`;

            return (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-slate-300 p-7 flex flex-col justify-between transition-all shadow-xs hover:shadow-sm group"
              >
                <div className="space-y-3">
                  {/* Quiet Unboxed Metadata */}
                  <div className="flex items-center gap-2 text-xs text-[#475569] tabular-nums">
                    <span className="font-semibold text-[#1B4332]">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0D1B2A] leading-snug group-hover:text-[#1B4332] transition-colors line-clamp-2">
                    <a
                      href={href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        if (!isExternal) {
                          e.preventDefault();
                          if (item.internalBlogRef) {
                            onSelectBlog(item.internalBlogRef);
                          } else {
                            onNavigate("/blog");
                          }
                        }
                      }}
                    >
                      {item.title}
                    </a>
                  </h3>

                  <p className="text-sm text-[#475569] leading-[1.6] line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (!isExternal) {
                        e.preventDefault();
                        if (item.internalBlogRef) {
                          onSelectBlog(item.internalBlogRef);
                        } else {
                          onNavigate("/blog");
                        }
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D1B2A] group-hover:text-[#1B4332] transition-colors"
                  >
                    <span>{isExternal ? "Read briefing" : "Read guide"}</span>
                    {isExternal ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomepageInsightsSection;
