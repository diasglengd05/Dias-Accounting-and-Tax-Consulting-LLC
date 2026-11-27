import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import PageMainTransition from "../components/PageMainTransition";
import MonthlyPackageConversionStrip from "../components/MonthlyPackageConversionStrip";
import ArticleContentRenderer from "../components/ArticleContentRenderer";
import ArticleLayout from "../components/editorial/ArticleLayout";
import { BlogPost } from "../types";
import {
  applyPageSEO,
  buildArticleSchema,
  buildBreadcrumbSchema,
  fitMetaDescription,
  removeJsonLd,
  upsertJsonLd,
} from "../lib/seo";
import {
  BloggerPost,
  bloggerPostToBlogPost,
  findBloggerPostBySlug,
  getInitialBloggerPosts,
  mergeWithFallbackPosts,
  sanitizeBloggerHtml,
  syncUnifiedBloggerPosts,
} from "../utils/bloggerFeed";

interface BlogDetailPageProps {
  blogSlug: string;
  initialPosts?: BloggerPost[];
  allBlogs?: BlogPost[];
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

function toIsoDate(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  const parsed = Date.parse(dateStr);
  if (Number.isNaN(parsed)) return new Date().toISOString().split("T")[0];
  return new Date(parsed).toISOString();
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({
  blogSlug,
  initialPosts,
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [posts, setPosts] = useState<BloggerPost[]>(() =>
    initialPosts && initialPosts.length > 0
      ? mergeWithFallbackPosts(initialPosts)
      : getInitialBloggerPosts()
  );
  const [loadingRemote, setLoadingRemote] = useState<boolean>(() => {
    const initialList =
      initialPosts && initialPosts.length > 0
        ? mergeWithFallbackPosts(initialPosts)
        : getInitialBloggerPosts();
    return !findBloggerPostBySlug(blogSlug, initialList);
  });
  const [copiedLink, setCopiedLink] = useState(false);

  const post = useMemo(
    () => findBloggerPostBySlug(blogSlug, posts),
    [blogSlug, posts]
  );

  useEffect(() => {
    const alreadyFound = Boolean(findBloggerPostBySlug(blogSlug, posts));
    if (!alreadyFound) {
      setLoadingRemote(true);
    }

    let active = true;
    syncUnifiedBloggerPosts({
      maxResults: 50,
      onSnapshot: (snapshotPosts) => {
        if (!active || snapshotPosts.length === 0) return;
        setPosts(snapshotPosts);
        if (findBloggerPostBySlug(blogSlug, snapshotPosts)) {
          setLoadingRemote(false);
        }
      },
    })
      .then((livePosts) => {
        if (!active) return;
        if (livePosts.length > 0) {
          setPosts(livePosts);
        }
      })
      .finally(() => {
        if (active) setLoadingRemote(false);
      });

    return () => {
      active = false;
    };
  }, [blogSlug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    if (!post) {
      if (!loadingRemote) {
        applyPageSEO({
          title: "Article Not Found | UAE Tax Insights | DiasUAE",
          description:
            "Browse authoritative UAE Corporate Tax, 5% VAT, DIFC/DTEC audit, and IFRS accounting guides by FTA-Registered Tax Agents in Dubai & Sharjah.",
          canonicalPath: "/blog",
          ogType: "website",
        });
      }
      return;
    }

    const canonicalPath = `/blog/${post.slug}`;
    const canonicalUrl = `https://diasuae.ae${canonicalPath}`;
    const publishedIso = toIsoDate(post.publishedIso || post.publishedDate);
    const modifiedIso = toIsoDate(post.updatedIso || post.publishedIso);
    const trimmedDesc = fitMetaDescription(post.summary);
    const resolvedPostImage =
      post.featuredImage && post.featuredImage.trim()
        ? post.featuredImage.startsWith("http")
          ? post.featuredImage
          : `https://diasuae.ae${post.featuredImage.startsWith("/") ? "" : "/"}${post.featuredImage}`
        : undefined;

    applyPageSEO({
      title: `${post.title} | DiasUAE`,
      description: trimmedDesc,
      canonicalPath,
      ogType: "article",
      ogImage: resolvedPostImage,
      ogImageAlt: post.title,
      publishedTime: publishedIso,
      modifiedTime: modifiedIso,
      authorName: post.author?.name || "Glen Dias",
      articleSection: post.primaryCategory || "UAE Tax & Accounting",
      keywords:
        post.keywords && post.keywords.length > 0
          ? post.keywords.join(", ")
          : `UAE tax guide, ${post.primaryCategory}, corporate tax Dubai, FTA compliance`,
    });

    upsertJsonLd(
      "page-article-jsonld",
      buildArticleSchema({
        headline: post.title,
        description: trimmedDesc,
        canonicalPath,
        datePublished: publishedIso,
        dateModified: modifiedIso,
        image: resolvedPostImage,
        authorName: post.author?.name,
        authorRole: post.author?.role,
        articleSection: post.primaryCategory,
        keywords: post.keywords,
      })
    );

    upsertJsonLd(
      "page-breadcrumb-jsonld",
      buildBreadcrumbSchema(
        [
          { name: "Home", path: "/" },
          { name: "Insights", path: "/blog" },
          { name: post.title, path: canonicalPath },
        ],
        `${canonicalUrl}#breadcrumb`
      )
    );

    return () => {
      removeJsonLd("page-article-jsonld");
      removeJsonLd("page-breadcrumb-jsonld");
    };
  }, [post, loadingRemote]);

  const relatedPosts: BlogPost[] = useMemo(() => {
    const others = posts.filter(
      (item) => item.slug !== post?.slug && !item.slug.startsWith("draft-")
    );
    if (!post) return others.slice(0, 3).map(bloggerPostToBlogPost);

    const tagLower = (post.primaryCategory || "").toLowerCase();
    const firstToken = tagLower.split(" ")[0] || "";
    const sameTopic = firstToken
      ? others.filter((item) =>
          (item.primaryCategory || "").toLowerCase().includes(firstToken)
        )
      : [];
    const remainder = others.filter((item) => !sameTopic.includes(item));
    return [...sameTopic, ...remainder].slice(0, 3).map(bloggerPostToBlogPost);
  }, [post, posts]);

  const handleCopyShareLink = async () => {
    if (!post || typeof window === "undefined") return;
    const shareUrl = `https://diasuae.ae/blog/${post.slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // Ignore clipboard failures silently
    }
  };

  /**
   * Intercept clicks on internal `/...` anchors inside sanitized Blogger HTML
   * so readers navigate smoothly via SPA routing without full page reloads.
   */
  const handleArticleBodyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement | null)?.closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href) return;
    if (
      href.startsWith("/") &&
      !href.startsWith("//") &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey
    ) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  const isHtmlContent = Boolean(
    post &&
      post.contentFormat !== "markdown" &&
      post.contentHtml &&
      (post.contentHtml.trim().startsWith("<") ||
        post.contentHtml.includes("</div>") ||
        post.contentHtml.includes("</p>"))
  );

  const sanitizedHtml = useMemo(() => {
    if (!post || !isHtmlContent) return "";
    return sanitizeBloggerHtml(post.contentHtml);
  }, [post, isHtmlContent]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#0D1B2A] antialiased">
      <PageNavigation
        currentPath={post ? `/blog/${post.slug}` : `/blog/${blogSlug}`}
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <PageMainTransition id="main-content">
        {loadingRemote ? (
          <section className="bg-[#FFFFFF] py-28">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
              <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-[#475569] font-medium">
                Loading regulatory briefing...
              </p>
            </div>
          </section>
        ) : !post ? (
          <section className="bg-[#FFFFFF] py-24 border-b border-[#E2E8F0]">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
              <BookOpen className="w-10 h-10 text-[#C5A059] mx-auto" />
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0D1B2A] tracking-tight">
                Article Not Found
              </h1>
              <p className="text-sm sm:text-base text-[#475569] leading-[1.65]">
                The briefing you requested may have moved or been updated. Explore all UAE Corporate Tax, 5% VAT, and IFRS accounting guides in our insights archive.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate("/blog")}
                  className="min-h-[46px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Browse All Insights</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("/")}
                  className="min-h-[46px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0D1B2A] text-sm font-semibold transition-colors cursor-pointer"
                >
                  <span>Return Home</span>
                </button>
              </div>
            </div>
          </section>
        ) : (
          <ArticleLayout
            articlePath={`/blog/${post.slug}`}
            category={post.primaryCategory}
            title={post.title}
            summary={post.summary}
            authorName={post.author?.name || "Glen Dias"}
            authorRole={
              post.author?.role || "Managing Director & FTA Registered Tax Agent"
            }
            date={post.publishedDate}
            readTime={post.readTime}
            copiedLink={copiedLink}
            onCopyShareLink={handleCopyShareLink}
            onNavigate={onNavigate}
            keywords={post.keywords}
            relatedPosts={relatedPosts}
          >
            {/* Optional Featured Image */}
            {post.featuredImage && (
              <figure className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] aspect-[16/9]">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </figure>
            )}

            {/* Focused Light-Theme Editorial Body */}
            <div className="pt-2">
              {isHtmlContent ? (
                <div
                  onClick={handleArticleBodyClick}
                  className="article-body text-[15px] sm:text-base leading-[1.75] text-[#475569] space-y-4 [&_p]:mb-4 [&_h2]:font-display [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:text-[#0D1B2A] [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#0D1B2A] [&_h3]:mt-6 [&_h3]:mb-2.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_a]:text-[#1B4332] [&_a]:font-medium [&_a]:underline [&_blockquote]:rounded-xl [&_blockquote]:bg-[#F8FAFC] [&_blockquote]:border [&_blockquote]:border-[#E2E8F0] [&_blockquote]:border-l-[3px] [&_blockquote]:border-l-[#C5A059] [&_blockquote]:p-5 [&_blockquote]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:text-sm [&_table_th]:bg-[#F8FAFC] [&_table_th]:text-[#0D1B2A] [&_table_th]:border-b [&_table_th]:border-[#E2E8F0] [&_table_th]:p-3.5 [&_table_th]:text-left [&_table_td]:border-b [&_table_td]:border-[#E2E8F0] [&_table_td]:p-3.5 [&_img]:rounded-2xl [&_img]:border [&_img]:border-[#E2E8F0] [&_img]:my-6 [&_img]:max-w-full [&_img]:h-auto"
                  dangerouslySetInnerHTML={{
                    __html: sanitizedHtml,
                  }}
                />
              ) : (
                <ArticleContentRenderer
                  content={post.contentHtml}
                  onNavigate={onNavigate}
                />
              )}
            </div>

            {/* Bottom Monthly Package Conversion Strip (Business Starter AED 400/mo & Corporate Growth VAT + CT) */}
            <MonthlyPackageConversionStrip onNavigate={onNavigate} compact />
          </ArticleLayout>
        )}
      </PageMainTransition>

      <PageFooter
        onNavigate={onNavigate}
        onOpenPrivacy={onOpenPrivacy}
        onOpenGooglePreferred={onOpenGooglePreferred}
      />
    </div>
  );
};

export default BlogDetailPage;
