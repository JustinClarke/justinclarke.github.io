import { useState, useEffect } from 'react';
import { cn } from '@/utils';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = winHeightPx > 0 ? (scrollPx / winHeightPx) * 100 : 0;
      
      setScrollProgress(scrollPercent);
      setIsVisible(scrollPx > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed bottom-8 right-8 md:bottom-12 md:right-12 z-[100] flex items-center justify-center p-3 rounded-full transition-all duration-700 outline-none",
        "backdrop-blur-md border shadow-2xl overflow-hidden group",
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-90 pointer-events-none",
        isHovered
          ? "bg-black/80 border-brand-primary/50 text-brand-primary shadow-[0_0_30px_rgba(0,200,180,0.25)]"
          : "bg-black/60 border-white/10 text-white/70"
      )}
      aria-label="Back to top"
    >
      {/* SVG Scroll Progress Ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 52 52">
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-white/5"
        />
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-300 ease-out",
            isHovered ? "text-brand-primary" : "text-white/30"
          )}
        />
      </svg>

      {/* Internal Icon Masking Container */}
      <div className="relative overflow-hidden w-6 h-6 flex items-center justify-center z-10">
        <svg
          className={cn(
            "absolute transition-transform duration-500 ease-in-out",
            isHovered ? "-translate-y-[150%]" : "translate-y-0"
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
        <svg
          className={cn(
            "absolute transition-transform duration-500 ease-in-out text-brand-primary",
            isHovered ? "translate-y-0" : "translate-y-[150%]"
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </div>

      {/* Hover Pulse Effect (Background) */}
      <div className={cn(
        "absolute inset-0 rounded-full bg-brand-primary transition-opacity duration-500 -z-10",
        isHovered ? "opacity-20 animate-ping" : "opacity-0"
      )} />
    </button>
  );
}
