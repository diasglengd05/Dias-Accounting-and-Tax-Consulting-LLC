import React, { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Tag,
  Share2,
} from "lucide-react";
import PageNavigation from "../components/PageNavigation";
import PageFooter from "../components/PageFooter";
import { blogsData } from "../data/blogsData";
import { BlogPost } from "../types";
import BlogModal from "../components/BlogModal";

interface BlogsPageProps {
  onNavigate: (path: string) => void;
  onOpenAudit?: () => void;
  onOpenPrivacy?: () => void;
  onOpenGooglePreferred?: () => void;
}

export const BlogsPage: React.FC<BlogsPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenPrivacy,
  onOpenGooglePreferred,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>(blogsData);

  useEffect(() => {
    document.title = "UAE Tax & Corporate Regulatory Insights | Dias UAE";
    window.scrollTo({ top: 0, behavior: "instant" });

    // Fetch any dynamic blog posts published via CMS
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
          const dynamicIds = new Set(data.blogs.map((b: BlogPost) => b.id));
          const merged = [
            ...data.blogs,
            ...blogsData.filter((b) => !dynamicIds.has(b.id)),
          ];
          merged.sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0));
          setAllPosts(merged);
        }
      })
      .catch(() => {});
  }, []);

  const categories = [
    { id: "all", label: "All Insights" },
    { id: "corporate tax", label: "Corporate Tax (9%)" },
    { id: "vat & compliance", label: "VAT & E-Invoicing" },
    { id: "incorporation", label: "Free Zone Setup" },
  ];

  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tag && post.tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      selectedCategory === "all" ||
      post.tag.toLowerCase().includes(selectedCategory);

    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <PageNavigation
        currentPath="/blogs"
        onNavigate={onNavigate}
        onOpenAudit={onOpenAudit}
      />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 lg:py-24 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs font-mono text-gold-400 mb-4">
              <button
                type="button"
                onClick={() => onNavigate("/")}
                className="hover:underline cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white">Tax &amp; Regulatory Insights</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <BookOpen className="w-3.5 h-3.5 text-gold-400" />
                <span>FTA Regulatory Briefings · 2026 Mandates</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                UAE Corporate Tax, VAT &amp; E-Invoicing Insights
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                Authoritative legal interpretations, ministerial decisions, Cabinet decrees, and practical implementation roadmaps prepared by FTA Registered Tax Agents.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles by keyword (e.g. E-Invoicing, SBR, QFZP)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-slate-200">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-navy-950 text-white font-bold shadow-xs"
                    : "bg-white text-slate-600 hover:text-navy-950 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-gold-400/60 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-gold-50 text-gold-700 font-mono text-[11px] font-bold uppercase tracking-wider">
                        {post.tag}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="font-display text-lg font-bold text-navy-950 mb-3 group-hover:text-gold-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-gold-600" />
                    <span>{typeof post.author === "string" ? post.author : (post.author?.name || "Glen Dias")}</span>
                  </div>
                  <span className="font-bold text-navy-950 group-hover:text-gold-600 flex items-center gap-1 transition-colors">
                    Read Article →
                  </span>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-navy-950 mb-1">
                No matching articles found
              </h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto mb-4">
                Try searching with different keywords or reset your category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-xs font-bold text-gold-600 hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>
      </main>

      <PageFooter
        onNavigate={onNavigate}
        onOpenPrivacy={onOpenPrivacy}
        onOpenGooglePreferred={onOpenGooglePreferred}
      />

      {selectedPost && (
        <BlogModal
          blog={selectedPost}
          onClose={() => setSelectedPost(null)}
          onContact={() => {
            setSelectedPost(null);
            onNavigate("/contact");
          }}
        />
      )}
    </div>
  );
};

export default BlogsPage;
