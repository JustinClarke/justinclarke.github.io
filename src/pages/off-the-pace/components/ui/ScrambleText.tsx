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
