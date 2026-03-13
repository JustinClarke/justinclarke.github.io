import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CARD_META, type CardId } from '@/data/bento';
import { ProjectIcon } from './ProjectIcon';

interface BentoCardProps {
  id: CardId;
  isActive: boolean;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  boxShadow: string;
  borderColor: string;
  gradientFrom: string;
}

export function BentoCard({
  id,
  isActive,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onClick,
  className = '',
  children,
  boxShadow,
  borderColor,
  gradientFrom,
}: BentoCardProps) {
  const meta = CARD_META[id];
  const filmVisible = !isActive && !isHovered;

  const [particles, setParticles] = useState<{ id: number; angle: number; distance: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    if (isHovered) {
      // Reduced to 4 particles with longer intervals and gentler speed
      const newParticles = Array.from({ length: 4 }).map((_, i) => ({
        id: i,
        angle: (i * (360 / 4)) + Math.random() * 45,
        distance: 25 + Math.random() * 35,
        delay: Math.random() * 0.4,
        size: 1.5 + Math.random() * 2,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isHovered]);

  return (
    <div
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
      className={`relative flex flex-col ${className}`}
    >
      <motion.div
        className="rounded-3xl bg-neutral-900/40 border border-white/5 p-3 md:p-4 backdrop-blur-2xl transition-[background-color] duration-500 relative flex flex-col justify-between overflow-visible shadow-2xl group cursor-pointer z-10 w-full h-full flex-grow"
        style={{
          borderColor: isActive ? `${meta.accent}33` : 'rgba(255,255,255,0.05)',
        }}
        animate={
          isHovered
            ? {
              scale: 1.02,
              y: -5,
              borderColor: [
                `${meta.accent}33`,
                `${meta.accent}b3`,
                `${meta.accent}33`,
              ],
              boxShadow: [
                `0 10px 30px -15px ${meta.accent}20, inset 0 0 20px ${meta.accent}05`,
                `0 15px 40px -10px ${meta.accent}70, inset 0 0 25px ${meta.accent}20`,
                `0 10px 30px -15px ${meta.accent}20, inset 0 0 20px ${meta.accent}05`,
              ],
            }
            : isActive
              ? {
                scale: 1,
                y: 0,
                borderColor: [
                  `${meta.accent}1a`,
                  `${meta.accent}55`,
                  `${meta.accent}1a`,
                ],
                boxShadow: [
                  `0 8px 25px -12px ${meta.accent}10, inset 0 0 15px ${meta.accent}02`,
                  `0 12px 30px -10px ${meta.accent}30, inset 0 0 20px ${meta.accent}08`,
                  `0 8px 25px -12px ${meta.accent}10, inset 0 0 15px ${meta.accent}02`,
                ],
              }
              : {
                scale: 1,
                y: 0,
                borderColor: 'rgba(255,255,255,0.05)',
                boxShadow: 'none',
              }
        }
        whileTap={{ scale: 0.98 }}
        transition={{
          borderColor: {
            repeat: Infinity,
            duration: isHovered ? 2 : 3.5,
            ease: "easeInOut",
          },
          boxShadow: {
            repeat: Infinity,
            duration: isHovered ? 2 : 3.5,
            ease: "easeInOut",
          },
          default: {
            type: "spring",
            stiffness: 350,
            damping: 25,
          },
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-3xl"
          style={{
            background: `linear-gradient(to bottom right, ${gradientFrom} 0%, transparent 60%)`,
            opacity: isHovered ? 0.5 : 0.3,
          }}
        />

        <div className="relative z-10 flex flex-col h-full min-h-0 w-full flex-grow">
          <div className="flex flex-col flex-grow min-h-0">
            {children}
          </div>

          {/* Persistent Tap Affordance for Mobile (visible only below lg) */}
          <div className="lg:hidden w-full pt-2.5 mt-2.5 border-t border-white/5 flex items-center justify-between shrink-0 pointer-events-none select-none group-active:opacity-70 transition-opacity">
            <span
              className="font-mono text-[9px] font-black tracking-widest uppercase"
              style={{ color: meta.accent }}
            >
              {meta.label}
            </span>
            <ArrowUpRight size={12} className="stroke-[2.5px] shrink-0" style={{ color: meta.accent }} />
          </div>
        </div>

        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 rounded-3xl hidden lg:block"
          style={{
            background: 'rgba(5,5,5,0.50)', // Dropped to 50% opacity from 72% for natural spotlight focus
            opacity: filmVisible ? 1 : 0,
            zIndex: 20,
          }}
        />

        {/* Sci-Fi Energy Ripple & Particle Emitter Container */}
        {isHovered && (
          <div className="absolute -top-3 right-10 pointer-events-none" style={{ zIndex: 40 }}>
            {/* Energy Ripple */}
            <motion.div
              className="absolute rounded-full border pointer-events-none"
              style={{
                width: 40,
                height: 40,
                borderColor: meta.accent,
                borderWidth: '1.5px',
                x: '-50%',
                y: '-50%',
                boxShadow: `0 0 12px ${meta.accent}, inset 0 0 8px ${meta.accent}`,
              }}
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 3.5],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
                repeat: Infinity,
                repeatDelay: 0.2,
              }}
            />

            {/* Particle Emitter */}
            {particles.map((p) => {
              const rad = (p.angle * Math.PI) / 180;
              const x = Math.cos(rad) * p.distance;
              const y = Math.sin(rad) * p.distance;
              return (
                <motion.div
                  key={p.id}
                  className="absolute rounded-full pointer-events-none bg-white"
                  style={{
                    width: p.size,
                    height: p.size,
                    x: '-50%',
                    y: '-50%',
                    filter: `drop-shadow(0 0 6px ${meta.accent})`,
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{
                    x,
                    y,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.6, // Longer duration for gentler pace
                    ease: [0.16, 1, 0.3, 1],
                    delay: p.delay,
                    repeat: Infinity,
                    repeatDelay: 0.8, // Longer delay interval to save CPU/GPU cycles
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Tech-Aesthetic Action Pill */}
        {isHovered && (
          <motion.div
            className="absolute -top-4 -right-2 sm:-top-5 sm:-right-4 pointer-events-none select-none rounded-3xl flex items-center gap-3 px-4 py-2 sm:px-4 sm:py-2.5 overflow-hidden backdrop-blur-xl border"
            style={{
              zIndex: 45,
              background: 'rgba(5, 5, 5, 0.85)',
              borderColor: `${meta.accent}40`,
              color: meta.accent,
              boxShadow: `
                0 8px 32px -4px rgba(0,0,0,0.5),
                0 4px 20px -2px ${meta.accent}40,
                inset 0 0 12px ${meta.accent}15
              `,
            }}
            initial={{ y: 15, scale: 0.9, opacity: 0 }}
            animate={{
              y: 0,
              scale: 1,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            {/* Project Specific Animation Icon */}
            <ProjectIcon id={id} accent={meta.accent} />

            {/* Text Label */}
            <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase subpixel-antialiased">
              {meta.label}
            </span>

            {/* Arrow Icon */}
            <ArrowUpRight size={14} className="shrink-0 stroke-[2.5px]" style={{ color: meta.accent, filter: `drop-shadow(0 0 4px ${meta.accent})` }} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
