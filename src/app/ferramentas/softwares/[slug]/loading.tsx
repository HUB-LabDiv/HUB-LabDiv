import React from 'react';
import { SkeletonArticle } from '@/components/ui/SkeletonArticle';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';

export default function Loading() {
    return (
        <MainLayoutWrapper focusMode>
            <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pt-24">
                <SkeletonArticle />
            </div>
        </MainLayoutWrapper>
    );
}
