import React from "react";
import StickyActionCtaBar from "./StickyActionCtaBar";

interface StickyMobileLeadBarProps {
  onOpenAudit: () => void;
  onNavigate?: (path: string) => void;
}

export default function StickyMobileLeadBar({ onOpenAudit, onNavigate }: StickyMobileLeadBarProps) {
  return <StickyActionCtaBar onOpenAudit={onOpenAudit} onNavigate={onNavigate} />;
}
