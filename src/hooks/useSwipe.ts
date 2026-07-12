import { TouchEvent, useState, WheelEvent, useRef } from 'react';

interface SwipeInput {
    onSwipedLeft: () => void;
    onSwipedRight: () => void;
}

export function useSwipe({ onSwipedLeft, onSwipedRight }: SwipeInput) {
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const [touchEndY, setTouchEndY] = useState<number | null>(null);

    const lastSwipeTime = useRef<number>(0);
    const wheelAccumulator = useRef<number>(0);
    const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

    // Minimum distance in pixels to trigger a swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e: TouchEvent) => {
        setTouchEndX(null);
        setTouchEndY(null);
        setTouchStartX(e.targetTouches[0].clientX);
        setTouchStartY(e.targetTouches[0].clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
        setTouchEndX(e.targetTouches[0].clientX);
        setTouchEndY(e.targetTouches[0].clientY);
    };

    const onTouchEndHandler = () => {
        if (!touchStartX || !touchEndX || !touchStartY || !touchEndY) return;
        
        const distanceX = touchStartX - touchEndX;
        const distanceY = touchStartY - touchEndY;
        
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
    };

    const onWheel = (e: WheelEvent) => {
        // Cooldown of 600ms between swipes to prevent multiple triggers from a single trackpad swipe
        if (Date.now() - lastSwipeTime.current < 600) return;

        // Ensure the wheel event is primarily horizontal
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            wheelAccumulator.current += e.deltaX;

            if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
            wheelTimeout.current = setTimeout(() => {
                wheelAccumulator.current = 0;
            }, 150);

            if (wheelAccumulator.current > 80) {
                onSwipedLeft();
                lastSwipeTime.current = Date.now();
                wheelAccumulator.current = 0;
            } else if (wheelAccumulator.current < -80) {
                onSwipedRight();
                lastSwipeTime.current = Date.now();
                wheelAccumulator.current = 0;
            }
        }
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd: onTouchEndHandler,
        onWheel
    };
}
