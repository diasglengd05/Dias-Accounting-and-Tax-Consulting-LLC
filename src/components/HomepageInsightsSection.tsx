import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { BlogPost } from "../types";
import {
  BloggerPost,
  bloggerPostToBlogPost,
  getInitialBloggerPosts,
  mergeWithFallbackPosts,
  syncUnifiedBloggerPosts,
} from "../utils/bloggerFeed";

interface HomepageInsightsSectionProps {
  initialPosts?: BloggerPost[];
  onSelectBlog?: (blog: BlogPost) => void;
  onNavigate: (path: string) => void;
}

export const HomepageInsightsSection: React.FC<HomepageInsightsSectionProps> = ({
  initialPosts,
  onSelectBlog,
  onNavigate,
}) => {
  const [articles, setArticles] = useState<BloggerPost[]>(() => {
    const seed =
      initialPosts && initialPosts.length > 0
        ? mergeWithFallbackPosts(initialPosts)
        : getInitialBloggerPosts();
    return seed.slice(0, 3);
  });

  useEffect(() => {
    let active = true;

    syncUnifiedBloggerPosts({
      maxResults: 100,
      onSnapshot: (snapshot) => {
        if (!active || snapshot.length === 0) return;
        setArticles(snapshot.slice(0, 3));
      },
    }).then((livePosts) => {
      if (!active || livePosts.length === 0) return;
      setArticles(livePosts.slice(0, 3));
    });

    return () => {
      active = false;
    };
  }, []);

  const openArticle = (e: React.MouseEvent, post: BloggerPost) => {
    e.preventDefault();
    if (onSelectBlog) {
      onSelectBlog(bloggerPostToBlogPost(post));
    } else {
      onNavigate(`/blog/${post.slug}`);
    }
  };

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
              <span>View all insights</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 3 Clean Editorial Cards — All Native to diasuae.ae/blog/<slug> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((item) => {
            const href = `/blog/${item.slug}`;

            return (
              <article
                key={item.slug}
                className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#C5A059] p-7 flex flex-col justify-between transition-all shadow-xs hover:shadow-sm group"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#475569] tabular-nums">
                    <span className="font-semibold text-[#1B4332]">
                      {item.primaryCategory}
                    </span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={item.publishedIso || undefined}>
                      {item.publishedDate}
                    </time>
                  </div>

                  <h3 className="text-lg font-bold text-[#0D1B2A] leading-snug group-hover:text-[#1B4332] transition-colors line-clamp-2">
                    <a
                      href={href}
                      onClick={(e) => openArticle(e, item)}
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
                    onClick={(e) => openArticle(e, item)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D1B2A] group-hover:text-[#1B4332] transition-colors"
                  >
                    <span>Read guide</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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
