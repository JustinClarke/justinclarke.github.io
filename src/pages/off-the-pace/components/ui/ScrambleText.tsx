/**
 * ScrambleText reveals a word with a "decoding" effect: random characters that
 * resolve left-to-right into the real text whenever `isHovered` is true.
 *
 * Fits in: the label inside Off The Pace CTA buttons (ActionButtons,
 *          ProjectHero). The parent owns the hover boolean and passes it in.
 * Note:    Purely visual - the underlying `text` prop is always what is read by
 *          screen readers via the resolved final string.
 *
 * For beginners ----------------------------------------------------------------
 * useState holds the currently-shown (possibly scrambled) string. useRef holds
 * the id of the pending setTimeout so we can cancel it; a ref is a value that
 * survives re-renders without causing one. The effect re-runs whenever hover or
 * text changes: on hover it steps through frames, replacing more real letters
 * each frame until the word is whole; off hover it cancels and snaps back.
 * -----------------------------------------------------------------------------
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
  // LEARN: a ref is a "box" that holds a value across renders without
  //    triggering one. Here it remembers the active timer so we can clear it.
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

        // LEARN: `progress` climbs from 0 to 1 across the frames. A letter
        //    "locks in" to its real value once its position (as a fraction of
        //    the word) is behind the progress line; letters ahead of it stay
        //    random. That is what makes the reveal sweep left-to-right.
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
