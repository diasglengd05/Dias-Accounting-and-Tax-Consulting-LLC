const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "public/blog.html");
const staticDataPath = path.join(__dirname, "src/data/staticData.ts");

const staticFile = fs.readFileSync(staticDataPath, "utf8");
const startIdx = staticFile.indexOf("export const blogsData: BlogPost[] = [");
const endIdx = staticFile.indexOf("export const pricingTiers");
const sliceText = staticFile.slice(startIdx, endIdx);
eval(sliceText.replace("export const blogsData: BlogPost[] =", "global.blogsData ="));

function mdToHtml(md) {
  if (!md) return "";
  const lines = md.split("\n");
  let res = [];
  let inList = false;

  lines.forEach(line => {
    let l = line.trim();
    if (!l) {
      if (inList) { res.push("</ul>"); inList = false; }
      return;
    }
    if (l.startsWith("### ")) {
      if (inList) { res.push("</ul>"); inList = false; }
      res.push("<h3 style=\"color: var(--color-navy-950); font-family: var(--font-display); margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 1.25rem;\">" + l.slice(4) + "</h3>");
    } else if (l.startsWith("## ")) {
      if (inList) { res.push("</ul>"); inList = false; }
      res.push("<h2 style=\"color: var(--color-navy-950); font-family: var(--font-display); margin-top: 1.75rem; margin-bottom: 0.75rem; font-size: 1.4rem;\">" + l.slice(3) + "</h2>");
    } else if (l.startsWith("> ")) {
      if (inList) { res.push("</ul>"); inList = false; }
      res.push("<blockquote style=\"border-left: 4px solid var(--color-gold-500); padding: 0.75rem 1rem; margin: 1rem 0; background: #faf7ee; border-radius: 0 8px 8px 0;\">" + l.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") + "</blockquote>");
    } else if (l.startsWith("* ") || l.startsWith("- ") || /^\d+\.\s+/.test(l)) {
      if (!inList) { res.push("<ul style=\"margin: 0.75rem 0; padding-left: 1.5rem;\">"); inList = true; }
      const content = l.replace(/^(\*|-|\d+\.)\s+/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      res.push("<li style=\"margin-bottom: 0.35rem;\">" + content + "</li>");
    } else if (l === "---") {
      if (inList) { res.push("</ul>"); inList = false; }
      res.push("<hr style=\"margin: 1.5rem 0; border: 0; border-top: 1px solid var(--color-slate-200);\" />");
    } else {
      if (inList) { res.push("</ul>"); inList = false; }
      res.push("<p style=\"margin-bottom: 0.9rem; line-height: 1.7;\">" + l.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>") + "</p>");
    }
  });
  if (inList) res.push("</ul>");
  return res.join("\n");
}

const posts = global.blogsData.map(b => ({
  id: b.id,
  category: b.tag,
  date: b.date,
  readTime: b.readTime,
  title: b.title,
  excerpt: b.summary,
  image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=700&q=80",
  fullContent: mdToHtml(b.content)
}));

// Backwards compatibility aliases
posts.push({
  id: "small-business-relief-extension-2029",
  category: "Tax Updates",
  date: "September 15, 2026",
  readTime: "5 min read",
  title: "Understanding the UAE Small Business Relief Extension to 2029",
  excerpt: "The Ministry of Finance has extended the Small Business Relief (SBR) regime to tax periods ending in 2029.",
  image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=700&q=80",
  fullContent: mdToHtml(global.blogsData[0].content)
});

let html = fs.readFileSync(htmlPath, "utf8");
const startTag = "  <!-- JavaScript: Dynamic Search, Category Filtering, and Modal Logic -->";
const endTag = "</body>";

const scriptCode = `  <!-- JavaScript: Dynamic Search, Category Filtering, and Modal Logic -->
  <script>
    // Comprehensive Article Catalog (Synchronized with staticData.ts & dynamic AI pipeline)
    let POSTS_DATA = ${JSON.stringify(posts, null, 2)};

    function mdToHtml(md) {
      if (!md) return "";
      const lines = md.split("\\n");
      let res = [];
      let inList = false;
      lines.forEach(line => {
        let l = line.trim();
        if (!l) {
          if (inList) { res.push("</ul>"); inList = false; }
          return;
        }
        if (l.startsWith("### ")) {
          if (inList) { res.push("</ul>"); inList = false; }
          res.push("<h3 style=\\"color: var(--color-navy-950); font-family: var(--font-display); margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 1.25rem;\\">" + l.slice(4) + "</h3>");
        } else if (l.startsWith("## ")) {
          if (inList) { res.push("</ul>"); inList = false; }
          res.push("<h2 style=\\"color: var(--color-navy-950); font-family: var(--font-display); margin-top: 1.75rem; margin-bottom: 0.75rem; font-size: 1.4rem;\\">" + l.slice(3) + "</h2>");
        } else if (l.startsWith("> ")) {
          if (inList) { res.push("</ul>"); inList = false; }
          res.push("<blockquote style=\\"border-left: 4px solid var(--color-gold-500); padding: 0.75rem 1rem; margin: 1rem 0; background: #faf7ee; border-radius: 0 8px 8px 0;\\">" + l.slice(2).replace(/\\*\\*(.*?)\\*\\*/g, "<strong>$1</strong>") + "</blockquote>");
        } else if (l.startsWith("* ") || l.startsWith("- ") || /^\\d+\\.\\s+/.test(l)) {
          if (!inList) { res.push("<ul style=\\"margin: 0.75rem 0; padding-left: 1.5rem;\\">"); inList = true; }
          const content = l.replace(/^(\\*|-|\\d+\\.)\\s+/, "").replace(/\\*\\*(.*?)\\*\\*/g, "<strong>$1</strong>");
          res.push("<li style=\\"margin-bottom: 0.35rem;\\">" + content + "</li>");
        } else if (l === "---") {
          if (inList) { res.push("</ul>"); inList = false; }
          res.push("<hr style=\\"margin: 1.5rem 0; border: 0; border-top: 1px solid var(--color-slate-200);\\" />");
        } else {
          if (inList) { res.push("</ul>"); inList = false; }
          res.push("<p style=\\"margin-bottom: 0.9rem; line-height: 1.7;\\">" + l.replace(/\\*\\*(.*?)\\*\\*/g, "<strong>$1</strong>").replace(/\\*(.*?)\\*/g, "<em>$1</em>") + "</p>");
        }
      });
      if (inList) res.push("</ul>");
      return res.join("\\n");
    }

    let activeCategory = "All";
    let searchQuery = "";

    const blogGrid = document.getElementById("blogGrid");
    const noResults = document.getElementById("noResults");
    const categoryList = document.getElementById("categoryList");
    const searchInput = document.getElementById("searchInput");
    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterSuccess = document.getElementById("newsletterSuccess");
    const articleModal = document.getElementById("articleModal");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const modalTag = document.getElementById("modalTag");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const modalNewTabBtn = document.getElementById("modalNewTabBtn");

    function renderCategories() {
      const categories = ["All", ...new Set(POSTS_DATA.map(p => p.category))];
      categoryList.innerHTML = categories.map(cat => {
        const count = cat === "All" ? POSTS_DATA.length : POSTS_DATA.filter(p => p.category === cat).length;
        const isActive = cat === activeCategory;
        return '<li class="category-item ' + (isActive ? 'active' : '') + '">' +
          '<button type="button" onclick="setCategory(\\'' + cat + '\\')">' +
            '<span>' + cat + '</span>' +
            '<span class="count-badge">' + count + '</span>' +
          '</button>' +
        '</li>';
      }).join("");
    }

    function renderPosts() {
      const filtered = POSTS_DATA.filter(post => {
        const matchesCategory = activeCategory === "All" || post.category === activeCategory;
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = !query || 
          post.title.toLowerCase().includes(query) || 
          post.excerpt.toLowerCase().includes(query) || 
          post.category.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        blogGrid.innerHTML = "";
        noResults.style.display = "block";
        return;
      }

      noResults.style.display = "none";
      blogGrid.innerHTML = filtered.map(post => {
        return '<article class="blog-card" style="cursor: pointer;" onclick="openArticle(\\'' + post.id + '\\')">' +
          '<div class="card-thumb-wrap">' +
            '<img class="card-thumb" src="' + post.image + '" alt="' + post.title + '" loading="lazy" />' +
            '<span class="category-tag">' + post.category + '</span>' +
          '</div>' +
          '<div class="card-content">' +
            '<div class="card-meta">' +
              '<span>' + post.date + '</span>' +
              '<span>•</span>' +
              '<span>' + post.readTime + '</span>' +
            '</div>' +
            '<h2 class="card-title">' + post.title + '</h2>' +
            '<p class="card-excerpt">' + post.excerpt + '</p>' +
            '<button type="button" class="read-more-btn" onclick="event.stopPropagation(); openArticle(\\'' + post.id + '\\')">' +
              'Read Article' +
              '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>' +
              '</svg>' +
            '</button>' +
          '</div>' +
        '</article>';
      }).join("");
    }

    window.setCategory = function(cat) {
      activeCategory = cat;
      renderCategories();
      renderPosts();
    };

    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderPosts();
    });

    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletterEmail").value;
      if (!email) return;
      newsletterForm.style.display = "none";
      newsletterSuccess.style.display = "block";
    });

    window.openArticle = function(id) {
      if (!id) return;
      const cleanId = id.toString().replace(/^#/, "").replace(/^blog-/, "").trim().toLowerCase();
      
      const post = POSTS_DATA.find(p => {
        const pid = p.id.toLowerCase();
        return pid === cleanId || pid.includes(cleanId) || cleanId.includes(pid);
      });

      if (!post) {
        console.warn("Article not found for ID:", id);
        return;
      }

      modalTag.textContent = post.category;
      modalTitle.textContent = post.title;
      modalBody.innerHTML = '<div style="font-size: 0.8rem; color: var(--color-slate-500); margin-bottom: 1.25rem; display: flex; gap: 0.75rem; align-items: center; border-bottom: 1px solid var(--color-slate-200); padding-bottom: 0.75rem;">' +
        '<span>Published: ' + post.date + '</span>' +
        '<span>•</span>' +
        '<span>Reading Time: ' + post.readTime + '</span>' +
        '<span>•</span>' +
        '<span style="color: var(--color-gold-600); font-weight: 600;">FTA Approved Tax Practice</span>' +
      '</div>' +
      '<div class="article-rich-content" style="line-height: 1.8; color: var(--color-slate-700); font-size: 0.95rem;">' +
        post.fullContent +
      '</div>' +
      '<div style="margin-top: 2.5rem; padding: 1.75rem; background: #faf7ee; border: 1px solid #aa821d33; border-radius: 16px; display: flex; flex-direction: column; gap: 0.75rem;">' +
        '<h4 style="color: #0a1526; font-family: var(--font-display); font-size: 1.15rem; margin: 0; font-weight: 700;">Require FTA-Compliant Tax Advisory in Dubai?</h4>' +
        '<p style="font-size: 0.85rem; color: #475569; margin: 0; line-height: 1.6;">Dias Accounting and Tax Consulting LLC provides certified corporate tax filings, EmaraTax Small Business Relief elections, and quarterly VAT audit protection.</p>' +
        '<a href="/#contact" style="align-self: flex-start; display: inline-flex; align-items: center; gap: 0.5rem; background: #0a1526; color: #d4af37; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 700; font-size: 0.85rem; text-decoration: none; margin-top: 0.35rem; transition: background 0.2s;">' +
          'Book a Free 30-Min Tax Consultation →' +
        '</a>' +
      '</div>';

      if (modalNewTabBtn) {
        modalNewTabBtn.href = '/blog.html#' + post.id;
      }

      articleModal.classList.add("active");
      document.body.style.overflow = "hidden";
      window.history.replaceState(null, "", '#' + post.id);
      articleModal.scrollTo({ top: 0, behavior: "smooth" });
    };

    function closeModal() {
      articleModal.classList.remove("active");
      document.body.style.overflow = "auto";
      window.history.replaceState(null, "", window.location.pathname);
    }

    modalCloseBtn.addEventListener("click", closeModal);
    articleModal.addEventListener("click", (e) => {
      if (e.target === articleModal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && articleModal.classList.contains("active")) closeModal();
    });

    function checkInitialTarget() {
      const urlParams = new URLSearchParams(window.location.search);
      const paramId = urlParams.get("id") || urlParams.get("blog");
      const hashId = window.location.hash ? window.location.hash.replace(/^#/, "").replace(/^blog-/, "") : "";
      const targetId = paramId || hashId;
      if (targetId) {
        setTimeout(() => window.openArticle(targetId), 50);
      }
    }

    renderCategories();
    renderPosts();
    checkInitialTarget();
    window.addEventListener("hashchange", checkInitialTarget);

    fetch("/api/blogs")
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
          data.blogs.forEach(dyn => {
            if (!POSTS_DATA.some(p => p.id === dyn.id)) {
              POSTS_DATA.unshift({
                id: dyn.id,
                category: dyn.tag || "Tax Updates",
                date: dyn.date || "Recent",
                readTime: dyn.readTime || "5 min read",
                title: dyn.title,
                excerpt: dyn.summary,
                image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=700&q=80",
                fullContent: mdToHtml(dyn.content || dyn.summary)
              });
            }
          });
          renderCategories();
          renderPosts();
          checkInitialTarget();
        }
      })
      .catch(err => {
        console.log("Static catalog active, dynamic fetch skipped:", err);
      });
  </script>`;

const sIdx = html.indexOf(startTag);
const eIdx = html.indexOf(endTag);

if (sIdx !== -1 && eIdx !== -1) {
  const updatedHtml = html.slice(0, sIdx) + scriptCode + "\n" + html.slice(eIdx);
  fs.writeFileSync(htmlPath, updatedHtml, "utf8");
  console.log("Successfully updated public/blog.html!");
} else {
  console.error("Could not find delimiters in public/blog.html: sIdx=" + sIdx + ", eIdx=" + eIdx);
}
