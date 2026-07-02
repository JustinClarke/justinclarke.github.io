/**
 * SpotifyWidget the "Spotify Engine" bento card (an MSc research project).
 * Rather than a live demo, it previews the two things that make this project
 * distinct: the acoustic feature vector each track is fingerprinted against,
 * and the 3-model benchmark the recommender was validated against.
 *
 * Fits in: one card in the homepage featured-projects bento grid.
 * Note:    every value is static (mirrors the real numbers used on the
 *          Spotify Engine case-study page); the feature bars fill once on
 *          scroll into view rather than looping on a timer.
 *
 * For beginners ----------------------------------------------------------------
 * FEATURES/MODELS are plain data arrays rendered with `.map`. FeatureBar's
 * `whileInView` tells Framer Motion "animate this once, the first time it
 * scrolls into the viewport" - no useState/useEffect timer required.
 * -----------------------------------------------------------------------------
 */
import { motion } from 'framer-motion';
import { HardDrive, Sparkles } from 'lucide-react';
import { cn } from '@/utils';

const FEATURES = [
  { label: 'ENERGY', value: 0.74, tone: 'spotify' as const },
  { label: 'ACOUSTICNESS', value: 0.12, tone: 'teal' as const },
];

const MODELS = [
  { label: 'HIERARCHICAL', active: true },
  { label: 'AVG. HYBRID', active: false },
  { label: 'SPOTIFY BASELINE', active: false },
];

function FeatureBar({ label, value, tone, delay }: { label: string; value: number; tone: 'spotify' | 'teal'; delay: number }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[8px] md:text-[9px] uppercase font-black tracking-wider text-fg-faint">{label}</span>
        <span className={cn(
          "font-mono text-[9px] md:text-[10px] font-black tabular-nums",
          tone === 'spotify' ? 'text-viz-spotify' : 'text-viz-teal'
        )}>
          {(value * 100).toFixed(0)}
        </span>
      </div>
      <div className="h-1 w-full bg-fg/[0.06] overflow-hidden rounded-full">
        <motion.div
          className={cn("h-full rounded-full", tone === 'spotify' ? 'bg-viz-spotify' : 'bg-viz-teal')}
          initial={{ width: 0 }}
          whileInView={{ width: `${value * 100}%` }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        />
      </div>
    </div>
  );
}

export function SpotifyWidget() {
  return (
    <div className="flex flex-col h-full justify-between gap-1.5 md:gap-2 min-h-0 text-left select-none">

      {/* Header */}
      <div className="flex flex-col gap-1 w-full border-b border-edge-soft pb-2 shrink-0">
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-viz-spotify" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-viz-spotify" />
          </span>
          <span className="font-mono text-[8px] sm:text-[9px] font-bold border border-viz-spotify/40 text-viz-spotify px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 bg-viz-spotify/5">
            MSC RESEARCH
          </span>
          <h3 className="font-noto text-sm xs:text-base sm:text-lg font-black tracking-tight text-fg uppercase leading-none">
            SPOTIFY ENGINE
          </h3>
        </div>

        {/* Telemetry Subheader */}
        <div className="hidden lg:flex flex-nowrap items-center gap-x-2 gap-y-0.5 font-mono text-[9px] sm:text-[10px] text-fg-faint mt-0.5 leading-none select-none pr-16 xs:pr-20 sm:pr-24 whitespace-nowrap">
          <span className="text-fg-faint font-medium">COLD-START RESOLVED</span>
          <span>•</span>
          <span className="uppercase text-fg-faint font-medium">3 Models Benchmarked</span>
        </div>
      </div>

      {/* Description Block */}
      <div className="relative rounded-lg border-t border-r border-b border-t-edge-soft border-r-edge-soft border-b-edge-soft bg-bento-subtle backdrop-blur-sm px-3 py-2 shrink-0">
        <p className="text-[11px] sm:text-[12.5px] leading-relaxed text-fg-soft">
          End-to-end <span className="font-semibold text-fg">ML workflow</span> for <span className="font-semibold text-fg">feature extraction</span>, <span className="font-semibold text-fg">embedding generation</span>, <span className="font-semibold text-fg">nearest-neighbor retrieval</span>, and <span className="font-semibold text-viz-spotify"> ranking</span>.
        </p>
      </div>

      {/* Main Content */}
      <div className="hidden lg:flex flex-col gap-2 grow min-h-0">

        {/* Acoustic Feature Vector */}
        <div className="bg-bento-inset border border-edge-soft rounded-xl p-2.5 md:p-3 flex flex-col gap-2 shrink-0">
          <span className="font-mono text-[9px] text-fg-faint uppercase tracking-widest">Acoustic Feature Vector</span>
          <div className="flex flex-col gap-1.5">
            {FEATURES.map((f, i) => (
              <FeatureBar key={f.label} {...f} delay={i * 0.08} />
            ))}
          </div>
        </div>

        {/* 3-Model Benchmark */}
        <div className="bg-bento-inset border border-edge-soft rounded-lg p-2.5 md:p-3 flex flex-col gap-1.5 grow justify-center">
          <span className="font-mono text-[9px] text-fg-faint uppercase tracking-widest">3-Model Benchmark</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {MODELS.map((m) => (
              <span
                key={m.label}
                className={cn(
                  "font-mono text-[8px] md:text-[9px] font-black uppercase px-2 py-1 rounded-full border",
                  m.active
                    ? "text-viz-spotify border-viz-spotify/30 bg-viz-spotify/10"
                    : "text-fg-faint border-edge-soft"
                )}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="hidden lg:flex flex-wrap gap-x-3 gap-y-1 justify-between items-center border-t border-edge-soft pt-1.5 text-fg-soft font-mono text-[8px] md:text-[9px] shrink-0">
        <div className="flex items-center gap-1.5">
          <HardDrive size={9} className="shrink-0" />
          <span>&lt;200MB Runtime · Live Ingestion</span>
        </div>
        <div className="flex items-center gap-1.5 text-viz-spotify">
          <Sparkles size={9} className="shrink-0" />
          <span>TF-IDF + Cosine · MSD</span>
        </div>
      </div>

      {/* Mobile-only Tech Stack */}
      <div className="lg:hidden flex flex-wrap gap-1 mt-1 shrink-0">
        {['Python', 'Scikit-Learn', 'Vector'].map(tech => (
          <span key={tech} className="font-mono text-[8px] sm:text-[9px] px-2 py-0.5 bg-viz-spotify/10 border border-viz-spotify/30 rounded text-viz-spotify font-bold uppercase tracking-wider">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
