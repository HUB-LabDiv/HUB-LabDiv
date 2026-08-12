'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Este programa é software livre sob os termos da AGPLv3.
 */

import React, { useState, useEffect, useRef } from 'react';

interface SdocxHeroImageProps {
    src: string;
    alt: string;
    allowBlob?: boolean;
}

/** Hero image para posts sdocx — client-side para suportar onError. */
export function SdocxHeroImage({ src, alt, allowBlob = false }: SdocxHeroImageProps) {
    const [failed, setFailed] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete && imgRef.current.naturalHeight === 0) {
            setFailed(true);
        }
    }, [src]);

    if (failed || !src || (!allowBlob && src.startsWith('blob:'))) return null;

    return (
        <div className="bg-background-dark flex items-center justify-center min-h-[300px] md:min-h-[500px] relative overflow-hidden">
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className="w-full h-full object-cover absolute inset-0"
                onError={() => setFailed(true)}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent" />
        </div>
    );
}

interface SdocxInlineImageProps {
    src: string;
    altText?: string;
}

/** Imagem inline dentro de blocos sdocx — client-side para suportar onError. */
export function SdocxInlineImage({ src, altText }: SdocxInlineImageProps) {
    const [failed, setFailed] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete && imgRef.current.naturalHeight === 0) {
            setFailed(true);
        }
    }, [src]);

    if (!src || src.startsWith('blob:') || failed) {
        return (
            <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 my-8 w-full flex flex-col items-center justify-center p-8 text-gray-400 gap-2">
                <span className="material-symbols-outlined text-4xl">broken_image</span>
                <span className="text-sm">{altText || 'Imagem não disponível'}</span>
            </div>
        );
    }

    return (
        <div className="relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-8 w-full flex flex-col items-center justify-center p-4">
            <img
                ref={imgRef}
                src={src}
                alt={altText || 'Imagem do bloco'}
                className="w-full h-auto max-h-[600px] object-contain rounded-lg"
                loading="lazy"
                onError={() => setFailed(true)}
            />
            {altText && (
                <p className="text-xs text-gray-400 mt-3 text-center italic">{altText}</p>
            )}
        </div>
    );
}
