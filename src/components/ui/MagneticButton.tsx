/**
 * @fileoverview Generic button wrapper to apply hover scale effects.
 */

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/shared/utils';
import { HOVER } from '@/config/animations';

export interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  /** The content of the button */
  children: React.ReactNode;
  /** Optional Tailwind classes for extending styles */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * A highly reusable interactive button component that utilizes Framer Motion
 * to create a 'magnetic' visual scale effect on hover and press.
 * 
 * @param {MagneticButtonProps} props - Properties including children, style extensions, and handlers.
 * @param {React.ForwardedRef<HTMLButtonElement>} ref - Ref forwarded to the DOM element.
 * @returns {JSX.Element} A cleanly styled, animated button element.
 */
export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className = '', onClick, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: HOVER.scale_standard.scale }}
        whileTap={HOVER.tap}
        className={cn(
          "relative px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10",
          "text-white font-medium rounded-full overflow-hidden group transition-colors",
          "hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';
