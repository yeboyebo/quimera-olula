import { useEffect, useRef } from "react";
import { useEsMovil } from "../maestro/useEsMovil.ts";

export function useIsMobile(breakpoint = 640) {
  return useEsMovil(breakpoint);
}

export function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void
): React.RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let x0: number | null = null;
    function onTouchStart(e: TouchEvent) {
      x0 = e.touches[0].clientX;
    }
    function onTouchEnd(e: TouchEvent) {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) {
        if (dx < 0) onSwipeLeft();
        else onSwipeRight();
      }
      x0 = null;
    }
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight]);
  return ref;
}