import { useEffect, useRef } from "react";

/**
 * Detects right-edge swipe gesture for back navigation
 * Triggers on swipe from left edge to right, useful for mobile navigation
 * @param {Function} onSwipeBack - Callback when swipe back is detected
 * @param {Boolean} enabled - Whether the hook is active
 */
export function useSwipeBack(onSwipeBack, enabled = true) {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const onTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e) => {
      if (touchStartX.current === null) return;

      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);

      // Swipe: > 60px right, < 80px vertical, from left edge (< 40px)
      if (dx > 60 && dy < 80 && touchStartX.current < 40) {
        onSwipeBack();
      }

      touchStartX.current = null;
      touchStartY.current = null;
    };

    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [onSwipeBack, enabled]);
}
