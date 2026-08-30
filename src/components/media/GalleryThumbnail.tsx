"use client";

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


import React, { useState } from 'react';
import { FileText, Play, Heart, MessageSquare, X } from 'lucide-react';
import { PostDTO } from '@/dtos/media';
import { parseMediaUrl, getOptimizedUrl, getYoutubeThumbnail } from '@/lib/media-utils';
import { motion, AnimatePresence } from 'framer-motion';

export function GalleryThumbnail({ post, showMetrics = false }: { post: PostDTO, showMetrics?: boolean }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const urls = parseMediaUrl(post.mediaUrl);
    let firstMedia = urls[0] || '';
    if (post.mediaType === 'pdf' && firstMedia.toLowerCase().endsWith('.pdf')) {
        firstMedia = firstMedia.replace(/\.pdf$/i, '.jpg');
    }
    const isVideo = post.mediaType === 'video';
    const isImage = !isVideo && !!firstMedia;

    let thumbUrl = '';
    if (isImage && firstMedia) {
        thumbUrl = getOptimizedUrl(firstMedia, 400, 70, post.category, 'image');
    } else if (isVideo && firstMedia) {
        thumbUrl = getYoutubeThumbnail(firstMedia);
    }

    const isArt = post.category === 'Arte';

    const handleClick = (e: React.MouseEvent) => {
        if (isArt) {
            e.preventDefault();
            setIsModalOpen(true);
        }
    };

    const Wrapper = isArt ? 'div' : 'a';
    const wrapperProps = isArt ? { onClick: handleClick } : { href: `/arquivo/${post.id}` };

    return (
        <>
            <Wrapper {...wrapperProps} className="group relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-2xl cursor-pointer border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all block">
                {thumbUrl ? (
                    <>
                        <img
                            src={thumbUrl}
                            alt={post.title}
                            className="w-full h-full object-contain bg-background-dark/5 dark:bg-white/5 group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                    const fallback = parent.querySelector('.fallback-container') as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                }
                            }}
                        />
                        <div className="fallback-container hidden w-full h-full flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                            <FileText className="w-12 h-12 text-gray-400/50 dark:text-white/10" />
                        </div>
                        {isVideo && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background-dark/20 group-hover:bg-background-dark/40 transition-colors">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                    <Play className="w-6 h-6 text-white fill-current" />
                                </div>
                            </div>
                        )}
                    </>
                ) : post.mediaType === 'pdf' ? (
                    <div className="w-full h-full bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/5 dark:from-brand-yellow/10 dark:to-brand-yellow/5 flex flex-col items-center justify-center p-4 text-center">
                        <FileText className="w-12 h-12 text-brand-yellow/50" />
                    </div>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-blue/20 to-brand-blue/5 dark:from-brand-blue/10 dark:to-brand-blue/5 flex flex-col items-center justify-center p-4 text-center">
                        <FileText className="w-12 h-12 text-brand-blue/50" />
                    </div>
                )}

                {showMetrics && (
                    <div className="absolute inset-0 bg-background-dark/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white z-10 pointer-events-none">
                        <div className="flex items-center gap-1.5 font-bold">
                            <Heart className="w-5 h-5 fill-current" />
                            <span>{post.likeCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold">
                            <MessageSquare className="w-5 h-5 fill-current" />
                            <span>{post.commentCount || 0}</span>
                        </div>
                    </div>
                )}
            </Wrapper>

            {/* Modal para visualização em tela cheia da Arte */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-background-dark/90 p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <button 
                            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        {thumbUrl ? (
                            <motion.img 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 20 }}
                                src={getOptimizedUrl(firstMedia, 1200, 90, post.category, 'image')}
                                alt={post.title}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <div className="w-full max-w-lg aspect-square bg-gray-900 rounded-lg flex items-center justify-center">
                                <FileText className="w-24 h-24 text-gray-700" />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
