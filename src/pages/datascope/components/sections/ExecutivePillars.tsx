/**
 * ExecutivePillars.tsx
 * The three Apple-style Keynote value pillars tailored for recruiters,
 * VPs of Engineering, and hiring managers.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { EXECUTIVE_PILLARS } from '../../data/datascopeData';
import { Shield, Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

const ICONS = [Shield, Sparkles, Cpu];

export function ExecutivePillars() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
      {/* Section header — plain-spoken, no marketing badges */}
      <div className="flex flex-col max-w-2xl mb-14">
        <h2 className="font-noto text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
          Engineered to run{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #863bff 0%, #00d4ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            however they'd like.
          </span>
        </h2>
        <p className="font-jetbrains text-xs text-white/50 mt-4 leading-relaxed uppercase tracking-[0.1em] max-w-xl">
          On-device, offline-first, or edge-deployed. The architecture ships as a static bundle with
          no mandatory cloud dependency — compliance by topology, not by promise.
        </p>
      </div>

      {/* Three Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {EXECUTIVE_PILLARS.map((pillar, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div
              key={pillar.id}
              initial={reduce ? undefined : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative rounded-3xl bg-[#090b11]/80 border border-white/10 hover:border-white/20 p-6 sm:p-8 backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden"
            >
              {/* Ambient Hover Glow behind card */}
              <div
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: pillar.accent }}
              />

              <div>
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300"
                    style={{
                      backgroundColor: `${pillar.accent}15`,
                      borderColor: `${pillar.accent}30`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: pillar.accent }} />
                  </div>
                  <span className="font-mono text-2xl font-black text-text-muted group-hover:text-text-secondary transition-colors">
                    {pillar.number}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="font-noto text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                  {pillar.title}
                </h3>
                <p
                  className="font-jetbrains text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ color: pillar.accent }}
                >
                  {pillar.tagline}
                </p>

                {/* Description Body */}
                <p className="font-sans text-sm text-white/70 leading-relaxed mb-6">
                  {pillar.description}
                </p>
              </div>

              {/* Bottom Feature Capsule */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="font-jetbrains text-xs font-bold text-white/90">
                  {pillar.highlight}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-white/60">
                  {pillar.badge}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
