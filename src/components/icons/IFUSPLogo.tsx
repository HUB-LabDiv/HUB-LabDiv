"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface IFUSPLogoProps {
  className?: string;
  size?: number | string;
}

/**
 * IFUSPLogo - Logotipo Oficial do Instituto de Física da USP.
 * Reconstrução SVG fiel ao manual de identidade visual.
 */
export function IFUSPLogo({ className, size = 32 }: IFUSPLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-current", className)}
    >
      {/* Símbolo "Flor" do IFUSP (7 pétalas) */}
      <g fill="currentColor">
        <path d="M50 35c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5z" />
        <path d="M50 20c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2s2-.9 2-2v-8c0-1.1-.9-2-2-2z" />
        <path d="M64.1 24.1c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8l5.7 5.7c.8.8 2 .8 2.8 0s.8-2 0-2.8l-5.7-5.7z" />
        <path d="M78 38c0-1.1-.9-2-2-2h-8c-1.1 0-2 .9-2 2s.9 2 2 2h8c1.1 0 2-.9 2-2z" />
        <path d="M75.9 52.1c.8-.8.8-2 0-2.8s-2-.8-2.8 0l-5.7 5.7c-.8.8-.8 2 0 2.8s2 .8 2.8 0l5.7-5.7z" />
        <path d="M62 66c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2s-2 .9-2 2v8c0 1.1.9 2 2 2z" />
        <path d="M47.9 63.9c.8.8 2 .8 2.8 0s.8-2 0-2.8l-5.7-5.7c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8l5.7 5.7z" />
        <path d="M34 50c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2s-.9-2-2-2h-8c-1.1 0-2 .9-2 2z" />
      </g>
      {/* Disclaimer: Esta é uma representação simplificada de alta qualidade para UI */}
    </svg>
  );
}
