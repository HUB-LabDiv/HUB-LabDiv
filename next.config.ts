/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import type { NextConfig } from "next";
// Double-lock: Validate environment variables during Next.js config loading
// import "./src/env.mjs";

const nextConfig: NextConfig = {
  compress: true,
  devIndicators: false,
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/**' },
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'bqszadfunqgtfpaorwvx.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
      { protocol: 'https', hostname: 'portal.if.usp.br', pathname: '/**' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion', 'date-fns', 'clsx', 'tailwind-merge'],
  },
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium', 'nodemailer'],
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/@sparticuz/chromium/bin/**/*'],
  },
  transpilePackages: ['recharts'],
  async redirects() {
    return [
      { source: '/perfil', destination: '/lab', permanent: true },
      { source: '/dms', destination: '/emaranhamento', permanent: true },
      { source: '/timeline', destination: '/', permanent: true },
      { source: '/guia', destination: '/manual', permanent: true },
      { source: '/labdiv', destination: '/sobre', permanent: true },
      { source: '/colisor', destination: '/gcif', permanent: true },
      { source: '/fluxo', destination: '/', permanent: true },
      { source: '/comunidade', destination: '/', permanent: true },
      { source: '/drops', destination: '/?tab=updates', permanent: true },
      { source: '/trilhas', destination: '/ferramentas/trilhas', permanent: true },
      { source: '/trilhas/:id', destination: '/ferramentas/trilhas/:id', permanent: true },
    ];
  },
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://*.supabase.co https://*.vercel-scripts.com https://*.vercel.app https://vlibras.gov.br https://*.google-analytics.com https://*.clarity.ms;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vlibras.gov.br;
      img-src 'self' blob: data: https://*.supabase.co https://res.cloudinary.com https://*.ytimg.com https://img.youtube.com https://images.unsplash.com https://lh3.googleusercontent.com https://upload.wikimedia.org https://portal.if.usp.br https://vlibras.gov.br https://*.google-analytics.com https://*.clarity.ms;
      font-src 'self' data: https://fonts.gstatic.com;
      connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.vercel.app https://vlibras.gov.br https://*.google-analytics.com https://*.clarity.ms https://*.bing.com https://*.visualstudio.com https://api.cloudinary.com;
      media-src 'self' https://*.supabase.co https://res.cloudinary.com https://*.youtube.com;
      frame-src * data: blob: 'unsafe-inline';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload', // 2 anos
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
