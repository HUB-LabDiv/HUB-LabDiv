import { TouchEvent, useState, WheelEvent, useRef } from 'react';

interface SwipeInput {
    onSwipedLeft: () => void;
    onSwipedRight: () => void;
}

export function useSwipe({ onSwipedLeft, onSwipedRight }: SwipeInput) {
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);

    const lastSwipeTime = useRef<number>(0);
    const wheelAccumulator = useRef<number>(0);
    const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

    // Minimum distance in pixels to trigger a swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        if (target && typeof target.closest === 'function' && target.closest('.overflow-x-auto, .scroll-x, .masonry-item, .no-swipe, a, button, input')) {
            return;
        }
        
        touchEndX.current = null;
        touchEndY.current = null;
        touchStartX.current = e.targetTouches[0].clientX;
        touchStartY.current = e.targetTouches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
        touchEndY.current = e.targetTouches[0].clientY;
    };

    const onTouchEndHandler = () => {
        if (
            touchStartX.current === null ||
            touchEndX.current === null ||
            touchStartY.current === null ||
            touchEndY.current === null
        ) return;
        
        const distanceX = touchStartX.current - touchEndX.current;
        const distanceY = touchStartY.current - touchEndY.current;
        
        // Ensure the swipe is mostly horizontal (X distance is greater than Y distance)
        const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

        if (!isHorizontalSwipe) return;

        const isLeftSwipe = distanceX > minSwipeDistance;
        const isRightSwipe = distanceX < -minSwipeDistance;

        if (isLeftSwipe) {
            onSwipedLeft();
        }
        if (isRightSwipe) {
            onSwipedRight();
        }

        touchStartX.current = null;
        touchEndX.current = null;
        touchStartY.current = null;
        touchEndY.current = null;
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd: onTouchEndHandler
    };
}

