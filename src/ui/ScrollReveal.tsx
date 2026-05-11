import React, { useState, useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  once?: boolean;
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 12,
  once = true,
  threshold = 0.12,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.disconnect(); };
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      data-reveal={isVisible ? 'visible' : 'hidden'}
      data-reveal-dir={direction}
      style={{
        ['--reveal-delay' as any]: `${delay * 1000}ms`,
        ['--reveal-dist' as any]: `${distance}px`,
      }}
    >
      {children}
    </div>
  );
};
