import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  getAllPrerenderRoutes,
  resolveSsrRouteHead,
  type SsrRouteHead,
} from "./lib/ssrRouteMeta";

export interface RenderRouteResult {
  html: string;
  head: SsrRouteHead;
}

/**
 * Renders any live DiasUAE route into a complete static HTML string along with
 * its route-specific <head> metadata and JSON-LD structured data using native
 * React server rendering (`react-dom/server`).
 */
export function render(url: string): RenderRouteResult {
  const head = resolveSsrRouteHead(url);
  const html = renderToString(
    React.createElement(
      React.StrictMode,
      null,
      React.createElement(
        ErrorBoundary,
        null,
        React.createElement(App, { initialPath: url })
      )
    )
  );

  return { html, head };
}

export { getAllPrerenderRoutes, resolveSsrRouteHead };
