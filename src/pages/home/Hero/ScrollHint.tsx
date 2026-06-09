/**
 * ScrollHint the little "SCROLL TO EXPLORE" cue with the animated mouse-wheel,
 * pinned under the hero terminal.
 *
 * Fits in: rendered by the Hero (src/pages/home/Hero/index.tsx). Purely visual —
 *          it has no behaviour of its own, it just reacts to one prop.
 * Note:    all of the motion lives in the <style> block below as CSS keyframes.
 *          The component's only job is to switch a class on/off so the hint
 *          fades away once the visitor starts scrolling.
 *
 * For beginners ----------------------------------------------------------------
 * This is a "presentational" component: data comes in through props, HTML goes
 * out, and that is the whole story. The big `<style>` tag is ordinary CSS the
 * same @keyframes you would put in a .css file written inline so this one cue
 * carries its own animations. Nothing here talks to the rest of the app.
 * -----------------------------------------------------------------------------
 */
import React from 'react';

// LEARN: An `interface` is TypeScript's way of describing the SHAPE of an object.
//    Here it says: "anything calling <ScrollHint> must pass a `hasScrolled`
//    that is a true/false value." It is a compile-time contract, not real code —
//    it disappears entirely once the app is built.
interface ScrollHintProps {
  hasScrolled: boolean;
}

// LEARN: `React.FC<ScrollHintProps>` types this as a Function Component whose
//    props match the interface above. `({ hasScrolled })` pulls that one prop
//    straight out of the props object ("destructuring") so we can use it by name.
export const ScrollHint: React.FC<ScrollHintProps> = ({ hasScrolled }) => {
  // LEARN: `<>...</>` is a "fragment" an invisible wrapper that lets a component
  //    return two siblings (the <style> block and the <div>) without adding an
  //    extra element to the page. JSX components must return one root, and a
  //    fragment satisfies that rule while rendering nothing of its own.
  return (
    <>
      <style>{`
        @keyframes scrollTextIntro {
          0%, 50% {
            color: transparent;
            filter: drop-shadow(0 0 0px transparent);
          }
          55%, 65% {
            color: #2e3033; /* dark grey */
            filter: drop-shadow(0 0 0px transparent);
          }
          75%, 85% {
            color: var(--color-light-bg); /* white */
            filter: drop-shadow(0 0 6px rgba(255,255,255,0.45));
          }
          95%, 100% {
            color: var(--color-brand-primary); /* teal */
            filter: drop-shadow(0 0 8px rgba(0,200,180,0.6));
          }
        }
        @keyframes scrollBorderIntro {
          0%, 50% {
            border-color: transparent;
            box-shadow: inset 0 0 0px transparent;
          }
          55%, 65% {
            border-color: rgba(63, 63, 70, 0.35); /* dark grey */
            box-shadow: inset 0 0 0px transparent;
          }
          75%, 85% {
            border-color: rgba(255, 255, 255, 0.5); /* white */
            box-shadow: inset 0 0 6px rgba(255,255,255,0.15), 0 0 8px rgba(255,255,255,0.2);
          }
          95%, 100% {
            border-color: rgba(0,200,180,0.65); /* teal */
            box-shadow: inset 0 0 8px rgba(0,200,180,0.1), 0 0 10px rgba(0,200,180,0.15);
          }
        }
        @keyframes scrollDotIntro {
          0%, 50% {
            background-color: transparent;
            box-shadow: 0 0 0px transparent;
          }
          55%, 65% {
            background-color: #2e3033;
            box-shadow: 0 0 0px transparent;
          }
          75%, 85% {
            background-color: var(--color-light-bg);
            box-shadow: 0 0 8px rgba(255,255,255,0.95);
          }
          95%, 100% {
            background-color: var(--color-brand-primary);
            box-shadow: 0 0 12px rgba(0,200,180,1);
          }
        }
        @keyframes scrollWheel {
          0% { transform: translateY(0); opacity: 0.15; }
          30% { opacity: 1; }
          60% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0.15; }
        }
        @keyframes scrollBlink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
        .animate-scroll-text {
          color: transparent;
          opacity: 1;
          animation: scrollTextIntro 10s ease-in-out forwards;
        }
        .animate-scroll-border {
          border-color: transparent;
          animation: scrollBorderIntro 10s ease-in-out forwards;
        }
        .animate-scroll-dot {
          background-color: transparent;
          animation: scrollDotIntro 10s ease-in-out forwards,
                     scrollWheel 2.2s cubic-bezier(0.16, 1, 0.3, 1) 5s infinite;
        }
        .animate-scroll-blink {
          animation: scrollBlink 1.8s ease-in-out infinite 10s;
        }
        .scroll-hint-container {
          transform: translate(-50%, 0);
          transition: opacity 1s ease-out, transform 1s ease-out;
        }
        .scroll-hint-container.has-scrolled {
          opacity: 0 !important;
          transform: translate(-50%, -16px);
        }
        @media (min-width: 768px) {
          .scroll-hint-container.has-scrolled {
            transform: translate(-50%, 16px);
          }
        }
      `}</style>

      {/* Scroll hint retro terminal style, starts dark grey, turns light teal, blinks if idle, disappears in other sections */}
      {/* LEARN: `aria-hidden="true"` hides this purely-decorative cue from screen
            readers, so assistive tech does not announce "scroll to explore".
          LEARN: the className is built with a template string (backticks). The
            `${hasScrolled ? 'has-scrolled' : ''}` part adds the `has-scrolled`
            class only when the prop is true that single class is what triggers
            the CSS fade-out defined above. This is how a boolean in JS becomes a
            visible change on screen. */}
      <div
        aria-hidden="true"
        className={`scroll-hint-container ${hasScrolled ? 'has-scrolled' : ''} pointer-events-none absolute bottom-full mb-3 md:bottom-auto md:top-[calc(100%+20px)] left-1/2 flex flex-col items-center z-20`}
      >
        <div className="animate-scroll-blink flex flex-col items-center gap-1.5">
          <div className="animate-scroll-text flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.25em] pl-[0.25em] whitespace-nowrap">
            <span className="opacity-45">[</span>
            <span className="md:hidden opacity-70">↓</span>
            <span>SCROLL TO EXPLORE</span>
            <span className="md:hidden opacity-70">↓</span>
            <span className="opacity-45">]</span>
          </div>
          <div className="animate-scroll-border relative w-[18px] h-[28px] border rounded-full flex justify-center p-[3px] hidden md:flex">
            <div className="animate-scroll-dot w-[3px] h-[5px] rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
};
