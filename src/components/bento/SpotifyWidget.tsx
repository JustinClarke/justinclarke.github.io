import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disc3, Zap, Sparkles } from 'lucide-react';
import { cn } from '@/utils';

const DIMENSIONS = [
  { id: 'valence', label: 'VALENCE', value: 0.91, color: 'var(--color-viz-spotify)' },
  { id: 'tempo', label: 'TEMPO', value: 0.65, color: 'var(--color-viz-success)' },
  { id: 'energy', label: 'ENERGY', value: 0.74, color: '#22d3a7' },
  { id: 'dance', label: 'DANCEABILITY', value: 0.82, color: 'var(--color-viz-spotify)' },
  { id: 'acoustic', label: 'ACOUSTICNESS', value: 0.12, color: '#65f0a3' },
  { id: 'live', label: 'LIVENESS', value: 0.18, color: '#3aed8d' },
];

const RECOMMENDATIONS = [
  { name: 'Holocene', artist: 'Bon Iver', cosine: 0.94, genre: 'Folk' },
  { name: 'Latch', artist: 'Disclosure', cosine: 0.89, genre: 'House' },
  { name: 'Firestarter', artist: 'The Prodigy', cosine: 0.86, genre: 'Big Beat' },
  { name: 'Flightless Bird', artist: 'Iron & Wine', cosine: 0.83, genre: 'Indie' },
  { name: 'One More Time', artist: 'Daft Punk', cosine: 0.81, genre: 'Electronic' },
];

const MODEL_FEATURES = [
  { label: 'TF-IDF Genre Vector', detail: 'Sparse term weighting across 4.2K labels' },
  { label: 'Cosine Similarity', detail: 'Normalized angular distance in 12D space' },
  { label: 'Audio Feature Joins', detail: 'Spotify API + MSD acoustic fingerprints' },
  { label: 'Cold-Start Strategy', detail: 'Genre fallback when listen data sparse' },
];

export function SpotifyWidget() {
  const [uiMode, setUiMode] = useState<'vectors' | 'recommend'>('vectors');
  const [activeRec, setActiveRec] = useState(0);
  const [dimensionTicker, setDimensionTicker] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRec(prev => (prev + 1) % RECOMMENDATIONS.length);
    }, 11000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDimensionTicker(prev => (prev + 1) % DIMENSIONS.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % MODEL_FEATURES.length);
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  const activeDimension = DIMENSIONS[dimensionTicker];
  const activeRecommendation = RECOMMENDATIONS[activeRec];

  return (
    <div className="flex flex-col h-full justify-between gap-1.5 md:gap-2 min-h-0 text-left select-none">

      {/* Header */}
      <div className="flex flex-col gap-1 w-full border-b border-white/5 pb-2 shrink-0">
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-viz-spotify" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-viz-spotify" />
          </span>
          <span className="font-mono text-[8px] sm:text-[9px] font-bold border border-viz-spotify/40 text-viz-spotify px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 bg-viz-spotify/5">
            MSC RESEARCH
          </span>
          <h3 className="font-noto text-sm xs:text-base sm:text-lg font-black tracking-tight text-white uppercase leading-none">
            SPOTIFY ENGINE
          </h3>
        </div>

        {/* Dynamic Telemetry Subheader */}
        <div className="hidden lg:flex flex-nowrap items-center gap-x-2 gap-y-0.5 font-mono text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 leading-none select-none pr-16 xs:pr-20 sm:pr-24 whitespace-nowrap">
          <span className="text-neutral-500 font-medium">MODEL OPERATIONAL</span>
          <span>•</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={dimensionTicker}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2 }}
              className="uppercase font-medium font-mono text-neutral-500"
            >
              {activeDimension.label}: {activeDimension.value.toFixed(2)}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="hidden lg:flex items-center justify-between py-1.5 px-3 bg-white/[0.02] border border-white/5 rounded-xl shrink-0 gap-3">
        <div className="flex items-center gap-2">
          <Zap size={11} className="text-viz-spotify animate-pulse" />
          <span className="font-mono text-[9px] md:text-[10px] font-bold text-neutral-400 tracking-wider uppercase">MSD-MSC · 12D Space</span>
        </div>
        <div className="bg-neutral-950 border border-white/5 p-0.5 rounded-lg flex shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setUiMode('vectors'); }}
            className={cn(
              "px-1.5 sm:px-2 py-0.5 rounded font-mono text-[9px] md:text-[10px] uppercase font-bold tracking-wider transition-all",
              uiMode === 'vectors' ? "bg-white/10 text-white" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            Vectors
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setUiMode('recommend'); }}
            className={cn(
              "px-1.5 sm:px-2 py-0.5 rounded font-mono text-[9px] md:text-[10px] uppercase font-bold tracking-wider transition-all",
              uiMode === 'recommend' ? "bg-viz-spotify/15 border border-viz-spotify/30 text-viz-spotify" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            Recommend
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="hidden lg:flex flex-grow min-h-0 flex flex-col gap-2.5">
        <AnimatePresence mode="wait">

          {uiMode === 'vectors' ? (
            <motion.div
              key="vectors-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2 flex-grow min-h-0"
            >
              {/* Dimension rail */}
              <div className="grid grid-cols-6 gap-1 bg-black/40 border border-white/5 rounded-xl p-2 shrink-0">
                {DIMENSIONS.map((d, i) => (
                  <div key={d.id} className="flex flex-col items-center gap-0.5">
                    <span
                      className={cn(
                        "font-mono text-[11px] md:text-xs font-black transition-all duration-300",
                        dimensionTicker === i ? "scale-110" : "opacity-60"
                      )}
                      style={{ color: d.color }}
                    >
                      {(d.value * 100).toFixed(0)}
                    </span>
                    <span className="font-mono text-[7px] text-neutral-600 uppercase tracking-tighter text-center leading-tight">
                      {d.id.slice(0, 3)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Active model feature */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-2.5 md:p-3 flex-grow flex flex-col justify-between min-h-[80px]">
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Model Feature</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-1 mt-1.5"
                  >
                    <span className="font-mono text-[11px] md:text-xs font-black text-white">
                      {MODEL_FEATURES[activeFeature].label}
                    </span>
                    <span className="font-mono text-[9px] md:text-[10px] text-neutral-400 leading-tight">
                      {MODEL_FEATURES[activeFeature].detail}
                    </span>
                  </motion.div>
                </AnimatePresence>
                <div className="flex gap-1 mt-2">
                  {MODEL_FEATURES.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-0.5 flex-1 rounded-full transition-all duration-300",
                        activeFeature === i ? "bg-viz-spotify" : "bg-white/10"
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="recommend-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2 flex-grow min-h-0"
            >
              {/* Active recommendation card */}
              <div className="bg-[#09090b] border border-white/10 rounded-xl p-2.5 md:p-3 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Nearest Neighbour</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeRec}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-viz-spotify/30 bg-viz-spotify/10 text-viz-spotify font-bold uppercase"
                    >
                      {activeRecommendation.genre}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeRec}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="font-mono text-[10px] md:text-xs text-white font-bold truncate mb-0.5">
                      {activeRecommendation.name}
                    </div>
                    <div className="font-mono text-[9px] text-neutral-500 truncate mb-1.5">
                      {activeRecommendation.artist}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm md:text-base font-black text-viz-spotify">{(activeRecommendation.cosine * 100).toFixed(1)}%</span>
                      <span className="font-mono text-[9px] text-neutral-500 uppercase">cos θ</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Recommendation queue */}
              <div className="flex-grow bg-black/40 border border-white/5 rounded-xl p-2 md:p-2.5 flex flex-col gap-1.5 min-h-0 overflow-hidden">
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest shrink-0">Candidate Pool · 1.2M total</span>
                {RECOMMENDATIONS.map((r, i) => (
                  <div
                    key={r.name}
                    className={cn(
                      "flex items-center justify-between gap-2 px-2 py-1 rounded-lg transition-all duration-300",
                      activeRec === i ? "bg-viz-spotify/10 border border-viz-spotify/20" : "border border-transparent"
                    )}
                  >
                    <span className={cn(
                      "font-mono text-[9px] truncate",
                      activeRec === i ? "text-white font-bold" : "text-neutral-500"
                    )}>
                      {r.name}
                    </span>
                    <span className={cn(
                      "font-mono text-[9px] font-black shrink-0",
                      activeRec === i ? "text-viz-spotify" : "text-neutral-600"
                    )}>
                      {(r.cosine * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="hidden lg:flex flex-wrap gap-x-3 gap-y-1 justify-between items-center border-t border-white/5 pt-1.5 text-neutral-400 font-mono text-[8px] md:text-[9px] shrink-0">
        <div className="flex items-center gap-1.5">
          <Disc3 size={9} className="shrink-0" />
          <span>1.2M Tracks · 12D Vector</span>
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
