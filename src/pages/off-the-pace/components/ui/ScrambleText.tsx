/**
 * ScrambleText reveals a word with a "decoding" effect: random characters that
 * resolve left-to-right into the real text whenever `isHovered` is true.
 *
 * Fits in: the label inside Off The Pace CTA buttons (ActionButtons,
 *          ProjectHero). The parent owns the hover boolean and passes it in.
 * Note:    Purely visual - the underlying `text` prop is always what is read by
 *          screen readers via the resolved final string.
 */
import { useState, useEffect, useRef } from 'react';

interface ScrambleTextProps {
  text: string;
  isHovered: boolean;
  prefix?: string;
  suffix?: string;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({ text, isHovered, prefix = '', suffix = '' }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-/=[]{}<>^~_';
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isHovered) {
      if (animationRef.current) clearTimeout(animationRef.current);

      let frame = 0;
      const maxFrames = 16;
      const frameDelay = 35;

      const animate = () => {
        frame++;
        if (frame >= maxFrames) {
          setDisplayText(text);
          return;
        }

        // A letter locks in once its position (as a fraction of the word) is
        // behind the progress line; letters ahead stay random - sweeps left-to-right.
        const scrambled = text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            const progress = frame / maxFrames;
            if (index / text.length < progress) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        setDisplayText(scrambled);
        animationRef.current = setTimeout(animate, frameDelay);
      };

      animate();
    } else {
      if (animationRef.current) clearTimeout(animationRef.current);
      setDisplayText(text);
    }

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [isHovered, text]);

  return (
    <span className="font-jetbrains">
      {prefix && <span className="opacity-60 mr-1">{prefix}</span>}
      <span>{displayText}</span>
      {suffix && <span className="opacity-60 ml-1">{suffix}</span>}
    </span>
  );
};

export default ScrambleText;
