import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  getAllPrerenderRoutes,
  resolveSsrRouteHead,
  type SsrRouteHead,
} from "./lib/ssrRouteMeta";
import {
  type BloggerPost,
  mergeWithFallbackPosts,
  parseBloggerFeedEntries,
  setSsrBloggerPosts,
  TOP_TAX_MISTAKES_FALLBACK_POST,
} from "./utils/bloggerFeed";

export interface RenderRouteResult {
  html: string;
  head: SsrRouteHead;
}

export interface RenderRouteOptions {
  bloggerPosts?: BloggerPost[];
}

/**
 * Renders any live DiasUAE route into a complete static HTML string along with
 * its route-specific <head> metadata and JSON-LD structured data using native
 * React server rendering (`react-dom/server`).
 */
export function render(
  url: string,
  options?: RenderRouteOptions
): RenderRouteResult {
  const posts =
    options?.bloggerPosts && options.bloggerPosts.length > 0
      ? options.bloggerPosts
      : undefined;
  setSsrBloggerPosts(posts || null);

  const head = resolveSsrRouteHead(url, posts);
  const html = renderToString(
    React.createElement(
      React.StrictMode,
      null,
      React.createElement(
        ErrorBoundary,
        null,
        React.createElement(App, {
          initialPath: url,
          initialBloggerPosts: posts,
        })
      )
    )
  );

  return { html, head };
}

export {
  getAllPrerenderRoutes,
  resolveSsrRouteHead,
  parseBloggerFeedEntries,
  mergeWithFallbackPosts,
  TOP_TAX_MISTAKES_FALLBACK_POST,
};
