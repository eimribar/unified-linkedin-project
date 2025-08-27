import { useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useState } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  threshold?: number;
}

export const useSwipeGestures = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  threshold = 100
}: SwipeGestureOptions) => {
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | null>(null);

  const [{ x, y, rotate }, api] = useSpring(() => ({ 
    x: 0, 
    y: 0, 
    rotate: 0 
  }));

  const bind = useDrag(
    ({ active, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy] }) => {
      const trigger = Math.abs(mx) > threshold || Math.abs(my) > threshold;
      
      if (active) {
        // While dragging, update position and rotation
        api.start({ 
          x: mx, 
          y: my, 
          rotate: mx * 0.1,
          immediate: true 
        });
        
        // Show visual feedback for direction
        if (Math.abs(mx) > Math.abs(my)) {
          setDirection(mx > 50 ? 'right' : mx < -50 ? 'left' : null);
        } else {
          setDirection(my < -50 ? 'up' : null);
        }
      } else {
        // On release
        if (trigger) {
          // Strong swipe detected
          if (Math.abs(mx) > Math.abs(my)) {
            if (dx > 0 && mx > threshold) {
              // Swipe right - Approve
              api.start({ 
                x: window.innerWidth * 1.5, 
                rotate: 30, 
                config: { tension: 280, friction: 20 } 
              });
              setTimeout(onSwipeRight, 100);
            } else if (dx < 0 && mx < -threshold) {
              // Swipe left - Decline  
              api.start({ 
                x: -window.innerWidth * 1.5, 
                rotate: -30, 
                config: { tension: 280, friction: 20 } 
              });
              setTimeout(onSwipeLeft, 100);
            }
          } else if (dy < 0 && my < -threshold) {
            // Swipe up - Edit
            api.start({ 
              y: -window.innerHeight * 1.5, 
              config: { tension: 280, friction: 20 } 
            });
            setTimeout(onSwipeUp, 100);
          }
        } else {
          // Snap back to center
          api.start({ 
            x: 0, 
            y: 0, 
            rotate: 0, 
            config: { tension: 300, friction: 30 } 
          });
        }
        setDirection(null);
      }
    }
  );

  const resetCard = () => {
    api.start({ x: 0, y: 0, rotate: 0 });
    setDirection(null);
  };

  return {
    bind,
    style: { x, y, rotate },
    direction,
    resetCard
  };
};