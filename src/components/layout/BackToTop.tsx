/**
 * BackToTop a floating button that appears after you scroll down and jumps
 * back to the top, with a ring that fills to show scroll progress.
 *
 * Fits in: rendered once in App.tsx, fixed to the bottom-right of the viewport.
 * Note:    the progress ring is an SVG circle. We animate `strokeDashoffset` a
 *          dashed outline where the visible dash length shrinks as you scroll,
 *          revealing more of the ring.
 *
 * For beginners ----------------------------------------------------------------
 * useState gives the component memory (is it visible? hovered? how far scrolled?).
 * useEffect subscribes to the window's scroll event when the component appears
 * and unsubscribes when it leaves (the returned function). `{ passive: true }`
 * tells the browser we won't block scrolling, which keeps it smooth.
 * -----------------------------------------------------------------------------
 */
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

  // LEARN: circle maths. circumference is the full length of the ring's outline;
  //    offsetting the dash by "how far you've NOT scrolled" makes the visible arc
  //    grow from 0% to 100% as you scroll down the page.
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
