import React, { useState, useEffect, useRef } from "react";

interface LazyMountProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  minHeight?: string | number;
  className?: string;
  priority?: boolean;
  sectionId?: string;
}

/**
 * LazyMount defers rendering of heavy below-the-fold components
 * until they are approaching the user's viewport.
 * This ensures the initial page opens instantly (<200ms) and keeps
 * initial CPU, main-thread JS, and network bandwidth minimal.
 */
export default function LazyMount({
  children,
  fallback,
  rootMargin = "400px 0px",
  minHeight = "180px",
  className = "",
  priority = false,
  sectionId,
}: LazyMountProps) {
  const [isMounted, setIsMounted] = useState(priority);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (priority || isMounted) return;

    // Check if the URL hash already targets this section or a child inside
    const checkHashMatch = () => {
      if (typeof window === "undefined") return false;
      const hash = window.location.hash ? window.location.hash.replace("#", "") : "";
      if (hash && (hash === sectionId || containerRef.current?.id === hash || containerRef.current?.querySelector(`#${hash}`))) {
        setIsMounted(true);
        return true;
      }
      return false;
    };

    if (checkHashMatch()) return;

    // Listen for hash change (e.g. clicking nav links like #contact or #calculator)
    window.addEventListener("hashchange", checkHashMatch);

    // If IntersectionObserver is unavailable, mount immediately
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsMounted(true);
      return () => window.removeEventListener("hashchange", checkHashMatch);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    const el = containerRef.current;
    if (el) {
      observer.observe(el);
    }

    // Idle safety fallback: load after 3 seconds of user inactivity so everything is warm
    const idleTimer = setTimeout(() => {
      setIsMounted(true);
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(idleTimer);
      window.removeEventListener("hashchange", checkHashMatch);
    };
  }, [priority, isMounted, rootMargin, sectionId]);

  if (!isMounted) {
    return (
      <div
        id={sectionId}
        ref={containerRef}
        className={className}
        style={{ minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight }}
      >
        {fallback || (
          <div className="w-full flex items-center justify-center py-12 text-slate-400 text-xs animate-pulse">
            <div className="h-4 w-32 bg-slate-100 rounded-md" />
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
