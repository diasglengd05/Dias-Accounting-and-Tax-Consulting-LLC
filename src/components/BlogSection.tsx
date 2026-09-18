import React, { useState, useMemo } from "react";
import { ArrowRight, BookOpen, Sparkles, Mail, CheckCircle2, ExternalLink } from "lucide-react";
import { BlogPost } from "../types";

interface BlogSectionProps {
  blogs: BlogPost[];
  onSelectBlog: (blog: BlogPost) => void;
  onOpenSeoEngine?: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  blogs,
  onSelectBlog,
  onOpenSeoEngine,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filtered posts
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory = selectedCategory === "All" || blog.tag === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        blog.title.toLowerCase().includes(query) ||
        blog.summary.toLowerCase().includes(query) ||
        blog.tag.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
  };

  return (
    <section id="blogs" className="py-20 bg-slate-50/50 border-t border-slate-100 scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs text-gold-600 font-bold uppercase tracking-widest block">
            UAE Corporate Finance &amp; Tax Intelligence
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">
            Insights &amp; Updates
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Navigating UAE corporate finance, Federal Tax Authority compliance, VAT procedures, and small business tax exemptions with executive clarity.
          </p>
        </div>

        {/* Layout Grid: 8 Columns Blog Grid + 4 Columns Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column: Blog Cards */}
          <div className="lg:col-span-8 space-y-6">
            
            {filteredBlogs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center space-y-3 shadow-sm">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-display text-lg font-bold text-navy-950">No matching articles found</h3>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                  Try adjusting your search terms or select "All" categories to view all published guides and briefings.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-2 px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold hover:bg-navy-950 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBlogs.map((blog, idx) => (
                  <a
                    key={blog.id}
                    href={`/blog.html#${blog.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-white border ${
                      idx === 0
                        ? "border-gold-400/80 shadow-md ring-1 ring-gold-400/20"
                        : "border-slate-200/80 shadow-sm"
                    } rounded-3xl overflow-hidden hover:shadow-xl hover:border-gold-400 transition-all hover:-translate-y-1 flex flex-col group cursor-pointer text-left`}
                  >
                    {/* Visual Card Top */}
                    <div className="bg-gradient-to-br from-navy-900 via-navy-950 to-slate-900 p-6 flex flex-col justify-between h-48 relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                        <BookOpen className="w-40 h-40 transform translate-x-10 translate-y-10 text-gold-400" />
                      </div>
                      
                      {/* Top Badges */}
                      <div className="flex items-center justify-between z-10 w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-white/15 text-gold-300 font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
                            {blog.tag}
                          </span>
                          {blog.isAiGenerated ? (
                            <span className="text-[10px] bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Live Update
                            </span>
                          ) : idx === 0 ? (
                            <span className="text-[10px] bg-gradient-to-r from-amber-400 to-gold-400 text-navy-950 font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                              Featured Post
                            </span>
                          ) : null}
                        </div>

                        {/* Direct new tab shortcut indicator */}
                        <span
                          className="p-1.5 text-slate-400 group-hover:text-gold-300 group-hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
                          title="Open article in a new tab"
                          aria-label="Open article in a new tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      {/* Date & Read Time */}
                      <div className="text-xs text-slate-400 font-medium flex justify-between items-center z-10">
                        <span>{blog.date}</span>
                        <span>•</span>
                        <span>{blog.readTime}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-display text-base sm:text-lg font-bold text-navy-950 group-hover:text-gold-600 transition-colors line-clamp-2 leading-snug">
                          {blog.title}
                        </h3>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {blog.summary}
                        </p>
                      </div>

                      {/* Author detail & Read More CTA */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={blog.author.avatar}
                            alt={blog.author.name}
                            width={32}
                            height={32}
                            loading="lazy"
                            decoding="async"
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div className="leading-tight">
                            <span className="block text-[11px] font-bold text-navy-900">{blog.author.name}</span>
                            <span className="text-[9px] text-slate-400 font-medium">{blog.author.role}</span>
                          </div>
                        </div>
                        <span
                          className="text-xs font-display font-bold text-gold-600 group-hover:text-gold-700 transition-all flex items-center gap-1.5 group-hover:translate-x-1"
                        >
                          <span>Read More</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Column: 4 Columns */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Newsletter Subscription */}
            <div className="bg-gradient-to-br from-navy-950 to-navy-900 rounded-3xl border border-gold-500/30 p-6 text-white shadow-md space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest block">
                  Free Briefing
                </span>
                <h4 className="font-display text-base font-bold text-white">
                  UAE Tax &amp; Corporate Newsletter
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Join 2,500+ UAE business founders receiving monthly regulatory alerts, FTA deadline reminders, and tax mitigation strategies.
                </p>
              </div>

              {newsletterSubscribed ? (
                <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-semibold">
                    Subscribed! You'll receive our next corporate finance briefing.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    placeholder="Enter your corporate email"
                    className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-400 transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-display font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Subscribe Free</span>
                  </button>
                </form>
              )}
            </div>

          </aside>

        </div>

      </div>
    </section>
  );
};
export default BlogSection;
