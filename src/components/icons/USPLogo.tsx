"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface USPLogoProps {
  className?: string;
  size?: number | string;
}

/**
 * USPLogo - Logotipo Oficial da Universidade de São Paulo.
 */
export function USPLogo({ className, size = 32 }: USPLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-current", className)}
    >
      {/* Representação Tipográfica do Bloco USP */}
      <g fill="currentColor">
        {/* U */}
        <path d="M10 5h6v18c0 3.3-2.7 6-6 6s-6-2.7-6-6V5h6v18c0 .6.4 1 1 1s1-.4 1-1V5z" />
        {/* S */}
        <path d="M35 15c0-5.5-4.5-10-10-10H20v6h5c2.2 0 4 1.8 4 4s-1.8 4-4 4h-5c-5.5 0-10 4.5-10 10s4.5 10 10 10h5V33h-5c-2.2 0-4-1.8-4-4s1.8-4 4-4h5c5.5 0 10-4.5 10-10z" />
        {/* P */}
        <path d="M45 5h10c5.5 0 10 4.5 10 10s-4.5 10-10 10h-4v14h-6V5zm10 14c2.2 0 4-1.8 4-4s-1.8-4-4-4h-4v8h4z" />
      </g>
    </svg>
  );
}
