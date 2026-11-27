import React from "react";

interface DiasEmblemLogoProps {
  className?: string;
  alt?: string;
}

export const DiasEmblemLogo: React.FC<DiasEmblemLogoProps> = ({
  className = "w-full h-full",
  alt = "DiasUAE — Dias Accounting and Tax Consulting LLC",
}) => {
  return (
    <img
      src="/logo.png"
      alt={alt}
      decoding="async"
      className={`object-contain ${className}`}
    />
  );
};

export default DiasEmblemLogo;
