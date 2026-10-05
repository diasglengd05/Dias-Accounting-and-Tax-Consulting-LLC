import React from "react";

/**
 * Strips raw markdown syntax characters (*, #) and converts inline formatting
 * (bold, italic, links, inline code) into clean, accessible React elements.
 */
export function renderFormattedInline(text: string): React.ReactNode {
  if (!text) return null;

  // Clean any leading markdown heading hashes or bullet asterisks if passed directly
  const cleanedText = text.replace(/^[*#]+\s*/, "");

  // Tokenize by inline markdown tokens:
  // 1. [text](url)
  // 2. ***bold italic***
  // 3. **bold**
  // 4. *italic*
  // 5. `code`
  const regex = /(\[[^\]]+\]\([^)]+\)|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = cleanedText.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1].replace(/[*#]/g, "");
      const linkUrl = linkMatch[2];
      return (
        <a
          key={index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold-600 hover:text-gold-700 underline font-medium"
        >
          {linkText}
        </a>
      );
    }

    // Bold-italic: ***text***
    const boldItalicMatch = part.match(/^\*\*\*([^*]+)\*\*\*$/);
    if (boldItalicMatch) {
      const content = boldItalicMatch[1].replace(/[*#]/g, "");
      return (
        <strong key={index} className="font-bold text-navy-950">
          <em>{content}</em>
        </strong>
      );
    }

    // Bold: **text**
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      const content = boldMatch[1].replace(/[*#]/g, "");
      return (
        <strong key={index} className="font-semibold text-navy-950">
          {content}
        </strong>
      );
    }

    // Italic: *text*
    const italicMatch = part.match(/^\*([^*]+)\*$/);
    if (italicMatch) {
      const content = italicMatch[1].replace(/[*#]/g, "");
      return (
        <em key={index} className="italic text-slate-800">
          {content}
        </em>
      );
    }

    // Inline code: `code`
    const codeMatch = part.match(/^`([^`]+)`$/);
    if (codeMatch) {
      return (
        <code key={index} className="bg-slate-100 text-navy-900 text-xs px-1.5 py-0.5 rounded font-mono">
          {codeMatch[1]}
        </code>
      );
    }

    // Plain text: safely remove any remaining stray * or # symbols
    const sanitized = part.replace(/[*#]/g, "");
    return <React.Fragment key={index}>{sanitized}</React.Fragment>;
  });
}

interface ArticleContentRendererProps {
  content: string;
}

/**
 * ArticleContentRenderer transforms raw markdown articles into beautifully
 * styled typography without showing any raw '#' (hashes) or '*' (asterisks).
 */
export const ArticleContentRenderer: React.FC<ArticleContentRendererProps> = ({ content }) => {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // Horizontal Rule: --- or *** or ___
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      elements.push(<hr key={`hr-${i}`} className="my-6 border-slate-200" />);
      i++;
      continue;
    }

    // Markdown Table: lines starting and ending with |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerCells = tableLines[0]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        const isSeparator = /^\|(\s*:?-+:?\s*\|)+$/.test(tableLines[1]);
        const bodyLines = isSeparator ? tableLines.slice(2) : tableLines.slice(1);

        elements.push(
          <div key={`table-${i}`} className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-navy-950 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  {headerCells.map((cell, cIdx) => (
                    <th key={cIdx} className="px-3.5 py-3 border-r border-slate-200/60 last:border-r-0">
                      {renderFormattedInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {bodyLines.map((rowLine, rIdx) => {
                  const cells = rowLine
                    .split("|")
                    .slice(1, -1)
                    .map((c) => c.trim());
                  return (
                    <tr key={rIdx} className={rIdx % 2 === 1 ? "bg-slate-50/50 hover:bg-slate-50" : "hover:bg-slate-50"}>
                      {cells.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3.5 py-2.5 border-r border-slate-100 last:border-r-0 leading-normal">
                          {renderFormattedInline(cell)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Headings (strip all '#' symbols and render cleanly styled headings)
    if (/^#\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^#\s+/, "");
      elements.push(
        <h2 key={`h1-${i}`} className="font-display text-xl sm:text-2xl font-bold text-navy-950 mt-7 mb-3 tracking-tight">
          {renderFormattedInline(headingText)}
        </h2>
      );
      i++;
      continue;
    }

    if (/^##\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^##\s+/, "");
      elements.push(
        <h2 key={`h2-${i}`} className="font-display text-lg sm:text-xl font-bold text-navy-950 mt-6 mb-3 tracking-tight">
          {renderFormattedInline(headingText)}
        </h2>
      );
      i++;
      continue;
    }

    if (/^###\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^###\s+/, "");
      elements.push(
        <h3 key={`h3-${i}`} className="font-display text-base sm:text-lg font-bold text-navy-950 mt-5 mb-2.5">
          {renderFormattedInline(headingText)}
        </h3>
      );
      i++;
      continue;
    }

    if (/^#{4,}\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^#{4,}\s+/, "");
      elements.push(
        <h4 key={`h4-${i}`} className="font-display text-sm sm:text-base font-bold text-navy-900 mt-4 mb-2">
          {renderFormattedInline(headingText)}
        </h4>
      );
      i++;
      continue;
    }

    // Blockquote: starts with '>'
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-4 border-gold-500 bg-amber-50/70 p-4 rounded-r-xl my-4 text-slate-800 text-sm sm:text-base leading-relaxed italic"
        >
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx} className={qIdx > 0 ? "mt-2" : ""}>
              {renderFormattedInline(ql)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Bullet List: lines starting with '*' or '-' or '+' or '•'
    // Strips the bullet symbol completely so no '*' appears
    if (/^(\*|-|\+|\•)\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^(\*|-|\+|\•)\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^(\*|-|\+|\•)\s+/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-3 space-y-2 list-none pl-1">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx} className="flex items-start gap-2.5 text-sm sm:text-base leading-relaxed text-slate-700">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" aria-hidden="true" />
              <div className="flex-1">{renderFormattedInline(item)}</div>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered List: lines starting with '1. ', '2. ', etc.
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: { num: string; text: string }[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const m = lines[i].trim().match(/^(\d+)\.\s+(.*)$/);
        if (m) {
          listItems.push({ num: m[1], text: m[2] });
        }
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-3 space-y-2 list-none pl-1">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx} className="flex items-start gap-2.5 text-sm sm:text-base leading-relaxed text-slate-700">
              <span className="font-bold text-xs text-navy-900 mt-0.5 shrink-0 bg-slate-100 border border-slate-200/80 rounded px-1.5 py-0.5 min-w-[22px] text-center">
                {item.num}
              </span>
              <div className="flex-1">{renderFormattedInline(item.text)}</div>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Standard Paragraph
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(\#{1,6}\s+|---|\*{3,}|_{3,}|\||>|\*|-|\+|\•|\d+\.)/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i].trim());
      i++;
    }

    if (paragraphLines.length > 0) {
      elements.push(
        <p key={`p-${i}`} className="text-sm sm:text-base leading-relaxed text-slate-700 mb-3.5">
          {renderFormattedInline(paragraphLines.join(" "))}
        </p>
      );
    } else {
      i++;
    }
  }

  return <div className="article-body space-y-2">{elements}</div>;
};

export default ArticleContentRenderer;
