/**
 * MagneticButton a button that gently scales up on hover and down on tap.
 *
 * Fits in: a reusable call-to-action button used across the site.
 * Note:    `as` lets the SAME effect wrap a <button>, <div>, or <span> useful
 *          when the thing you want to animate isn't semantically a button.
 *
 * For beginners ----------------------------------------------------------------
 * `forwardRef` lets a parent reach the real DOM node inside this component
 * (needed for focus/measure). `whileHover`/`whileTap` are Framer Motion props:
 * you describe the END state ({ scale: 1.05 }) and it animates there for you.
 * -----------------------------------------------------------------------------
 */
import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils';
import { HOVER } from '@/config/animations';

export interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  /** The content of the button */
  children: React.ReactNode;
  /** Optional Tailwind classes for extending styles */
  className?: string;
  /** Element type to render as */
  as?: 'button' | 'div' | 'span';
  /** Click handler */
  onClick?: () => void;
}

/**
 * A highly reusable interactive button component that utilizes Framer Motion
 * to create a 'magnetic' visual scale effect on hover and press.
 */
export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className = '', as = 'button', onClick, ...props }, ref) => {
    // LEARN: pick which animated element to render based on the `as` prop. A
    //    capitalised variable (Component) can be used as a JSX tag: <Component />.
    const Component = (as === 'div' ? motion.div : as === 'span' ? motion.span : motion.button) as any;
    
    return (
      <Component
        ref={ref}
        whileHover={{ scale: HOVER.scale_standard.scale }}
        whileTap={HOVER.tap}
        className={cn(
          as === 'button' ? "relative px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10" : "relative inline-block",
          "text-white font-medium rounded-full overflow-hidden group transition-colors",
          as === 'button' ? "hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Component>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';
