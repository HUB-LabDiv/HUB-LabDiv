'use client';

import React from 'react';
import { useSwipe } from '@/hooks/useSwipe';
import { useRouter, usePathname } from 'next/navigation';

interface SwipeWrapperProps {
    children: React.ReactNode;
    routes: string[];
}

export function SwipeWrapper({ children, routes }: SwipeWrapperProps) {
    const router = useRouter();
    const pathname = usePathname();

    const swipeHandlers = useSwipe({
        onSwipedLeft: () => {
            const currentIndex = routes.indexOf(pathname);
            if (currentIndex !== -1 && currentIndex < routes.length - 1) {
                router.push(routes[currentIndex + 1]);
            }
        },
        onSwipedRight: () => {
            const currentIndex = routes.indexOf(pathname);
            if (currentIndex !== -1 && currentIndex > 0) {
                router.push(routes[currentIndex - 1]);
            }
        }
    });

    return (
        <div {...swipeHandlers} className="w-full h-full flex flex-col flex-1">
            {children}
        </div>
    );
}
