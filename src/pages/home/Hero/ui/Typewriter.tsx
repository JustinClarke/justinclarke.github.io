/**
 * Typewriter reveals a string one character at a time, like text being typed
 * into a terminal.
 *
 * Fits in: used throughout the hero terminal to "type out" command output.
 * Note:    the reveal is driven by the clock, not a fixed per-character timer, so
 *          it stays smooth and finishes on time even if the browser stutters.
 *
 * For beginners ----------------------------------------------------------------
 * Two ideas worth knowing here. (1) `as: Component = 'span'` lets the CALLER pick
 * which HTML tag to render (<p>, <h1>, …) the capital `Component` is what makes
 * JSX treat the variable as a tag. (2) The `...Ref` values exist to dodge a
 * classic React trap: a function created once (our animation loop) "remembers"
 * the props it was born with. Storing the latest `text`/`onComplete` in a ref and
 * reading `.current` lets that long-lived loop always see fresh values.
 * -----------------------------------------------------------------------------
 */
import React, { useState, useEffect, memo, useRef } from 'react';

// LEARN: The `?` makes a prop optional; the `= 15` style defaults below fill them
//    in when a caller omits them. `onComplete?: () => void` is an optional callback
//    the parent can pass to be notified the moment typing finishes.
interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
  as?: 'p' | 'span' | 'div' | 'h1';
  skip?: boolean;
}

export const Typewriter = memo(({
  text,
  speed = 15,
  delay = 0,
  onComplete,
  className,
  as: Component = 'span',  // LEARN: rename `as` → `Component` so JSX can render <Component>
  skip = false
}: TypewriterProps) => {
  // LEARN: `displayedText` is what's currently on screen; it grows from '' to the
  //    full string. `skip` short-circuits the animation (show it all at once).
  const [displayedText, setDisplayedText] = useState(skip ? text : '');
  const [started, setStarted] = useState(skip);
  const textRef = useRef(text);
  const onCompleteRef = useRef(onComplete);

  // Keep refs updated to avoid closure issues
  // LEARN: These two effects copy the latest props into the refs whenever they
  //    change, so the animation loop below (which captured the refs once) reads
  //    today's text and callback rather than the stale ones it was created with.
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (skip) {
      setDisplayedText(text);
      setStarted(true);
      return;
    }
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay, skip, text]);

  // LEARN: The typing loop. `requestAnimationFrame` runs `animate` before each repaint
  //    (~60x/sec). Instead of revealing one char per frame, we compute how many chars
  //    SHOULD be visible from the elapsed time (`elapsed / speed`) that keeps the
  //    speed honest even if frames are dropped. When done, we call the optional
  //    onComplete via `?.()` and stop scheduling frames. Cleanup cancels any pending
  //    frame so a half-finished animation doesn't keep running after unmount.
  useEffect(() => {
    if (!started || skip) return;

    let animationFrameId: number;
    let startTime: number | null = null;
    const targetText = textRef.current;
    const totalChars = targetText.length;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Calculate character count based on elapsed time and speed
      const targetCount = Math.min(
        totalChars,
        Math.floor(elapsed / speed)
      );

      setDisplayedText(targetText.slice(0, targetCount));

      if (targetCount < totalChars) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // LEARN: `?.()` calls onComplete only if one was provided no crash if not.
        onCompleteRef.current?.();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [started, speed, skip]);

  return <Component className={className}>{displayedText}</Component>;
});

