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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const textRef = useRef(text);
  
  // Keep text ref updated to avoid closure issues
  useEffect(() => {
    textRef.current = text;
  }, [text]);

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

    // Clear any existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    let i = displayedText.length;
    intervalRef.current = setInterval(() => {
      const currentText = textRef.current;
      setDisplayedText(currentText.slice(0, i + 1));
      i++;
      
      if (i >= currentText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onComplete?.();
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [started, speed, onComplete, skip]); // Removed text from deps to prevent re-runs if it doesn't change

  return <Component className={className}>{displayedText}</Component>;
});
