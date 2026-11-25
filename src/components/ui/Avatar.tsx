'use client';

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


import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { getAvatarUrl } from '@/lib/utils';
import { getRadiationTier } from '@/lib/radiation';

interface AvatarProps {
    src?: string | null;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
    className?: string;
    customSize?: string;
    xp?: number;
    level?: number;
    isLabDiv?: boolean;
    userId?: string;
    onClick?: (e: React.MouseEvent) => void;
}

const sizeClasses = {
    xs: 'size-6',
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
    xl: 'size-20',
    custom: '',
};

const badgeSizeClasses = {
    xs: 'w-2.5 h-3',
    sm: 'w-3.5 h-4',
    md: 'w-4 h-[18px]',
    lg: 'w-5 h-[22px]',
    xl: 'w-6 h-7',
    custom: 'w-4 h-[18px]',
};

type TierFamily = 'plastico' | 'cobre' | 'aluminio' | 'ferro' | 'aco' | 'diamante' | 'materia_escura';

function getTierFamily(tierId: string): TierFamily {
    if (tierId.startsWith('materia_escura')) return 'materia_escura';
    if (tierId.startsWith('diamante')) return 'diamante';
    if (tierId.startsWith('aco')) return 'aco';
    if (tierId.startsWith('ferro')) return 'ferro';
    if (tierId.startsWith('aluminio')) return 'aluminio';
    if (tierId.startsWith('cobre')) return 'cobre';
    return 'plastico';
}

function TierLapelCrest({
    tierId,
    hex,
    sizeClass,
    title,
}: {
    tierId: string;
    hex: string;
    sizeClass: string;
    title: string;
}) {
    const family = getTierFamily(tierId);
    const isTopTwo = tierId === 'diamante_vi' || tierId === 'materia_escura';

    return (
        <div
            className={`absolute bottom-0 right-0 ${sizeClass} z-10 flex items-center justify-center translate-x-[14%] translate-y-[14%] pointer-events-none select-none`}
            title={title}
        >
            <svg
                viewBox="0 0 24 26"
                className={`w-full h-full overflow-visible ${isTopTwo ? 'drop-shadow-[0_0_4px_rgba(168,85,247,0.75)]' : 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]'}`}
                aria-hidden="true"
            >
                {/* Escudo / Brasão de Lapela encaixado */}
                <path
                    d="M12 1.5L21 4.5V12.5C21 18.2 17.1 22.7 12 24.5C6.9 22.7 3 18.2 3 12.5V4.5L12 1.5Z"
                    fill={hex}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path
                    d="M12 3.2L19.2 5.6V12.4C19.2 17 16 20.8 12 22.4C8 20.8 4.8 17 4.8 12.4V5.6L12 3.2Z"
                    fill="rgba(15, 23, 42, 0.28)"
                />

                {/* Ícone minimalista por família */}
                {family === 'plastico' && (
                    <circle cx="12" cy="12.5" r="4" fill="none" stroke="#FFFFFF" strokeWidth="1.9" />
                )}

                {family === 'cobre' && (
                    <path
                        d="M7.5 10.5C9 8.5 11 8.5 12 10.5C13 12.5 15 12.5 16.5 10.5M7.5 14.5C9 12.5 11 12.5 12 14.5C13 16.5 15 16.5 16.5 14.5"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                    />
                )}

                {family === 'aluminio' && (
                    <polygon
                        points="12,7.8 16.2,10.2 16.2,14.8 12,17.2 7.8,14.8 7.8,10.2"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                    />
                )}

                {family === 'ferro' && (
                    <g stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" fill="none">
                        <circle cx="12" cy="12.5" r="2.7" />
                        <path d="M12 7.6V9.2M12 15.8V17.4M7.1 12.5H8.7M15.3 12.5H16.9M8.5 9L9.7 10.2M14.3 14.8L15.5 16M15.5 9L14.3 10.2M9.7 14.8L8.5 16" />
                    </g>
                )}

                {family === 'aco' && (
                    <g fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinejoin="round">
                        <polygon points="12,7.6 16.6,15.8 7.4,15.8" />
                        <line x1="12" y1="7.6" x2="12" y2="15.8" strokeWidth="1.2" opacity="0.8" />
                    </g>
                )}

                {family === 'diamante' && (
                    <g fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round">
                        <polygon points="9,8.4 15,8.4 17.2,11.3 12,17.3 6.8,11.3" />
                        <line x1="6.8" y1="11.3" x2="17.2" y2="11.3" strokeWidth="1.2" />
                        <polyline points="9,8.4 12,11.3 15,8.4" strokeWidth="1.1" />
                    </g>
                )}

                {family === 'materia_escura' && (
                    <g fill="none" stroke="#FFFFFF" strokeWidth="1.35">
                        <ellipse cx="12" cy="12.5" rx="5.2" ry="2.1" transform="rotate(-32 12 12.5)" />
                        <ellipse cx="12" cy="12.5" rx="5.2" ry="2.1" transform="rotate(32 12 12.5)" />
                        <circle cx="12" cy="12.5" r="1.5" fill="#FFFFFF" stroke="none" />
                    </g>
                )}
            </svg>
        </div>
    );
}

export const Avatar = ({ src, name = 'Usuário', size = 'md', className = '', customSize, xp, level, isLabDiv, userId, onClick }: AvatarProps) => {
    const [currentSrc, setCurrentSrc] = useState<string>(() => getAvatarUrl(src));
    const [fallbackStep, setFallbackStep] = useState<0 | 1 | 2>(0);
    const [error, setError] = useState(false);

    // Reseta estado sempre que a URL prop 'src' mudar
    useEffect(() => {
        setCurrentSrc(getAvatarUrl(src));
        setFallbackStep(0);
        setError(false);
    }, [src]);

    const handleImageError = () => {
        if (fallbackStep === 0 && src && currentSrc !== src) {
            setFallbackStep(1);
            setCurrentSrc(src);
            return;
        }
        if (fallbackStep < 2 && src && src.startsWith('https://')) {
            setFallbackStep(2);
            setCurrentSrc(`/api/avatar?url=${encodeURIComponent(src)}`);
            return;
        }
        setError(true);
    };

    // Tier calculations
    const tier = xp !== undefined ? getRadiationTier(xp) : null;
    const isDarkMatter = tier?.id === 'materia_escura';
    const isDiamondSix = tier?.id === 'diamante_vi';

    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 3;
    const placeholderColors = [
        'bg-brand-blue/10 text-brand-blue',
        'bg-brand-yellow/10 text-brand-yellow',
        'bg-brand-red/10 text-brand-red',
    ];

    const sizeClass = size === 'custom' ? customSize : sizeClasses[size];
    const badgeSize = badgeSizeClasses[size];

    const renderContent = () => {
        if (currentSrc && !error) {
            return (
                <img
                    src={currentSrc}
                    alt={name}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                />
            );
        }

        return (
            <div className={`w-full h-full rounded-full flex items-center justify-center font-black uppercase tracking-tighter ${placeholderColors[colorIndex]}`}>
                {initials || <User className="w-1/2 h-1/2 opacity-50" />}
            </div>
        );
    };

    // Construct the split ring style
    const ringStyle = isLabDiv ? {
        background: `conic-gradient(
            from 270deg,
            #0F4780 0deg,
            #F14343 90deg,
            #FFCC00 180deg,
            ${tier?.hex || '#6B7280'} 180deg 360deg
        )`
    } : tier ? {
        backgroundColor: tier.hex
    } : {
        backgroundColor: '#D1D5DB' // gray-300
    };

    const content = (
        <div 
            className={`relative shrink-0 ${sizeClass} ${className} ${onClick || userId ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''}`}
            onClick={onClick}
        >
            {/* The Ring Container */}
            <div 
                className={`w-full h-full rounded-full p-[3px] transition-all
                    ${isDarkMatter ? 'shadow-[0_0_16px_rgba(168,85,247,0.6)] ring-1 ring-purple-400/70' : isDiamondSix ? 'shadow-[0_0_12px_rgba(196,181,253,0.45)] ring-1 ring-violet-300/60' : 'shadow-md'}
                `}
                style={ringStyle}
            >
                {/* The Inner Content */}
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-background-dark ring-1 ring-inset ring-black/15 dark:ring-white/15">
                    {renderContent()}
                </div>
            </div>

            {/* Tier Lapel Crest (Proposta D: Escudo/Brasão encaixado na curva da moldura) */}
            {tier && (
                <TierLapelCrest
                    tierId={tier.id}
                    hex={tier.hex}
                    sizeClass={badgeSize}
                    title={`${tier.name} (Lvl ${level || tier.level})`}
                />
            )}
        </div>
    );

    if (userId && !onClick) {
        return (
            <Link href={`/lab-pessoal/${userId}`} className="block shrink-0">
                {content}
            </Link>
        );
    }

    return content;
};
