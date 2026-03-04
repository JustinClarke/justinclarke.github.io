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
  const [displayedText, setDisplayedText] = useState(skip ? text : '');
  const [started, setStarted] = useState(skip);
  const textRef = useRef(text);
  const onCompleteRef = useRef(onComplete);
  
  // Keep refs updated to avoid closure issues
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

