import { TouchEvent, WheelEvent, useRef } from 'react';

interface SwipeInput {
    onSwipedLeft: () => void;
    onSwipedRight: () => void;
    minDistance?: number;
    wheelThreshold?: number;
}

export function useSwipe({ 
    onSwipedLeft, 
    onSwipedRight, 
    minDistance = 40,
    wheelThreshold = 80
}: SwipeInput) {
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);

    const lastWheelTime = useRef<number>(0);
    const wheelAccumulator = useRef<number>(0);
    const wheelCooldown = useRef<boolean>(false);

    const onTouchStart = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        if (target && typeof target.closest === 'function' && target.closest('.overflow-x-auto, .scroll-x, .no-swipe, input, textarea, select')) {
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

        if (isHorizontalSwipe) {
            const isLeftSwipe = distanceX > minDistance;
            const isRightSwipe = distanceX < -minDistance;

            if (isLeftSwipe) {
                onSwipedLeft();
            } else if (isRightSwipe) {
                onSwipedRight();
            }
        }

        touchStartX.current = null;
        touchEndX.current = null;
        touchStartY.current = null;
        touchEndY.current = null;
    };

    const onTouchCancelHandler = () => {
        touchStartX.current = null;
        touchEndX.current = null;
        touchStartY.current = null;
        touchEndY.current = null;
    };

    const onWheelHandler = (e: WheelEvent) => {
        const target = e.target as HTMLElement;
        if (target && typeof target.closest === 'function' && target.closest('.overflow-x-auto, .scroll-x, .no-swipe, input, textarea, select')) {
            return;
        }

        const now = Date.now();
        if (now - lastWheelTime.current > 350) {
            wheelAccumulator.current = 0;
        }
        lastWheelTime.current = now;

        if (wheelCooldown.current) return;

        // Ensure horizontal intent on touchpad (deltaX significantly larger than deltaY)
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 8) {
            wheelAccumulator.current += e.deltaX;

            if (Math.abs(wheelAccumulator.current) >= wheelThreshold) {
                if (wheelAccumulator.current > 0) {
                    onSwipedLeft();
                } else {
                    onSwipedRight();
                }
                wheelCooldown.current = true;
                wheelAccumulator.current = 0;
                setTimeout(() => {
                    wheelCooldown.current = false;
                }, 600);
            }
        } else if (Math.abs(e.deltaY) > Math.abs(e.deltaX) * 1.5) {
            // Reset horizontal accumulator on distinct vertical scrolling
            wheelAccumulator.current = 0;
        }
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd: onTouchEndHandler,
        onTouchCancel: onTouchCancelHandler,
        onWheel: onWheelHandler
    };
}

