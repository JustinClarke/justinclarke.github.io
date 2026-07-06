/**
 * Typewriter reveals a string one character at a time, like text being typed
 * into a terminal.
 *
 * Fits in: used throughout the hero terminal to "type out" command output.
 * Note:    the reveal is driven by the clock, not a fixed per-character timer, so
 *          it stays smooth and finishes on time even if the browser stutters.
 */
import React, { useState, useEffect, memo, useRef } from 'react';

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
  as: Component = 'span',
  skip = false
}: TypewriterProps) => {
  // Grows from '' to the full string; `skip` short-circuits and shows it all at once.
  const [displayedText, setDisplayedText] = useState(skip ? text : '');
  const [started, setStarted] = useState(skip);
  const textRef = useRef(text);
  const onCompleteRef = useRef(onComplete);

  // Mirror the latest props into refs so the animation loop (which captures refs
  // once) reads current text/callback instead of stale closure values.
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

  // Typing loop. Rather than one char per frame, it computes how many chars SHOULD
  // be visible from elapsed time (elapsed / speed), keeping the speed honest even
  // when frames drop.
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

