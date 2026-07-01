/**
 * BehaviouralRiskWidget the "HR Analysis" bento card: a self-running mini
 * dashboard that walks a 4-stage data pipeline and rotates through a few
 * AI-style insight lines. The numbers are fixed; the movement is decorative.
 *
 * Fits in: one card in the homepage featured-projects bento grid.
 * Note:    two independent timers drive it one advances the pipeline stage,
 *          one rotates the insight. Neither touches real data.
 *
 * For beginners ----------------------------------------------------------------
 * `useState` is this card's memory and `useEffect` runs the timers that change it.
 * Framer Motion's <AnimatePresence> animates an element as it appears or leaves;
 * giving it a changing `key` makes it cross-fade from the old value to the new.
 * -----------------------------------------------------------------------------
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, TrendingDown, AlertTriangle, Users } from 'lucide-react';
import { cn } from '@/utils';

export function BehaviouralRiskWidget() {
  // LEARN: two counters held in state. Each timer below nudges one of them, and
  //    every change re-renders the card so the highlighted step / insight moves.
  const [animationPhase, setAnimationPhase] = useState(0);
  const [pipelineStep, setPipelineStep] = useState(0);

  // LEARN: plain data objects/arrays. Keeping the content here (not buried in the
  //    markup) means the JSX below can just loop over it see the `.map` calls.
  const codebaseStats = {
    totalResponses: 127,
    avgEngagement: 5.4,
    dominantArchetype: 'The Frustrated Visionary',
    dominantCount: 24,
    atRiskPercent: 42,
    burnoutPercent: 18,
    silentBurnoutCases: 8,
    totalMetricsTracked: 7
  };

  const pipelineStages = [
    { label: 'COLLECT RESPONSES', icon: '◆', color: 'text-blue-400' },
    { label: 'MAP ARCHETYPE', icon: '⚡', color: 'text-acc-bi' },
    { label: 'ANALYZE SIGNALS', icon: '◇', color: 'text-amber-400' },
    { label: 'GENERATE INSIGHTS', icon: '●', color: 'text-emerald-400' }
  ];

  const insights = [
    `${codebaseStats.silentBurnoutCases} high performers show workload misalignment.`,
    `Dominant: ${codebaseStats.dominantArchetype} (${codebaseStats.dominantCount} cases).`,
    `${codebaseStats.burnoutPercent}% of active responses show burnout signals.`
  ];

  // LEARN: useEffect with `[]` runs once on mount. setInterval ticks forever, so
  //    we MUST return a cleanup that clears it otherwise the timer keeps firing
  //    after the card is gone. `% 4` wraps 0→1→2→3→0… in a loop.
  useEffect(() => {
    const interval = setInterval(() => {
      setPipelineStep((prev) => (prev + 1) % 4);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % insights.length);
    }, 16000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between gap-1.5 md:gap-2 min-h-0 text-left select-none">

      {/* Header */}
      <div className="flex flex-col gap-1 w-full border-b border-edge-soft pb-2 shrink-0">
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-acc-bi" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-acc-bi" />
          </span>
          <span className="font-mono text-[8px] sm:text-[9px] font-bold border border-acc-bi/40 text-acc-bi px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 bg-acc-bi/5">
            BEHAVIOURAL AI
          </span>
          <h3 className="font-noto text-sm xs:text-base sm:text-lg font-black tracking-tight text-fg uppercase leading-none">
            HR ANALYSIS
          </h3>
        </div>

        {/* Dynamic Telemetry Subheader */}
        <div className="hidden lg:flex flex-nowrap items-center gap-x-2 gap-y-0.5 font-mono text-[9px] sm:text-[10px] text-fg-faint mt-0.5 leading-none select-none pr-16 xs:pr-20 sm:pr-24 whitespace-nowrap">
          <span className="text-fg-faint font-medium">FLIGHT RISK DETECTION</span>
          <span>•</span>
          <span className="uppercase text-fg-faint font-medium">8 Archetypes</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="hidden lg:flex flex-col gap-2 grow min-h-0">

        {/* Data Pipeline Flow */}
        <div className="bg-bento-inset border border-edge-soft rounded-xl p-3 md:p-2.5 lg:p-3 shrink-0">
          <div className="flex items-center justify-between gap-1.5 md:gap-1">
            {/* LEARN: `.map` turns the data array into one element per item the
                React way to render a list. Each needs a unique `key` so React can
                track items across re-renders; here the index `i` is fine because
                the list never reorders. */}
            {pipelineStages.map((stage, i) => (
              <div key={i} className="relative flex flex-col items-center gap-1 flex-1 min-w-0">
                {/* Stage dot + arrow */}
                {/* LEARN: cn(...) joins class names and drops any that are false.
                    Here it picks a different look depending on whether this stage
                    is the current one, already passed, or still upcoming. */}
                <motion.div
                  className={cn(
                    "w-5 h-5 md:w-6 md:h-6 rounded-full border flex items-center justify-center text-[9px] md:text-[10px] font-bold shrink-0",
                    pipelineStep === i
                      ? `${stage.color} bg-fg/10 border-edge animate-pulse`
                      : pipelineStep > i
                        ? `${stage.color} bg-fg/[0.06] border-edge`
                        : "bg-fg/[0.03] border-edge-soft text-fg-faint"
                  )}
                  animate={pipelineStep === i ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.8 }}
                >
                  {stage.icon}
                </motion.div>

                {/* Stage label */}
                <span className={cn(
                  "font-mono text-[8px] md:text-[9px] uppercase tracking-tighter text-center leading-tight font-black",
                  pipelineStep >= i ? "text-fg/80" : "text-fg-faint"
                )}>
                  {stage.label.split(' ')[0]}
                </span>

                {/* Arrow to next */}
                {i < pipelineStages.length - 1 && (
                  <div className="absolute right-0 top-2.5 md:top-3 transform translate-x-1/2 -translate-y-1/2 text-fg/10 text-xs md:text-sm">→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 md:gap-2.5 shrink-0">
          {/* Avg Risk Score */}
          <div className="bg-bento-inset border border-edge-soft rounded-lg p-2.5 md:p-3 flex flex-col items-start gap-1.5">
            <div className="flex items-center gap-1.5 w-full">
              <AlertTriangle size={10} className="text-amber-400 shrink-0" />
              <span className="font-mono text-[9px] md:text-[10px] text-fg-faint uppercase tracking-wider font-bold">Tracked Metrics</span>
            </div>
            <span className="font-mono text-sm md:text-base font-black text-amber-400">
              {codebaseStats.totalMetricsTracked}<span className="text-[9px] md:text-[10px] text-fg-soft font-bold"> dimensions</span>
            </span>
          </div>

          {/* Engagement Level */}
          <div className="bg-bento-inset border border-edge-soft rounded-lg p-2.5 md:p-3 flex flex-col items-start gap-1.5">
            <div className="flex items-center gap-1.5 w-full">
              <Flame size={10} className="text-orange-400 shrink-0" />
              <span className="font-mono text-[9px] md:text-[10px] text-fg-faint uppercase tracking-wider font-bold">Avg Engagement</span>
            </div>
            <span className="font-mono text-sm md:text-base font-black text-orange-400">
              {codebaseStats.avgEngagement}<span className="text-[9px] md:text-[10px] text-fg-soft font-bold">/10</span>
            </span>
          </div>
        </div>

        {/* Live Insight from Gemini */}
        <div className="bg-bento-inset border border-edge-soft rounded-lg p-2.5 md:p-3 grow min-h-15 md:min-h-0 flex flex-col justify-center">
          {/* LEARN: because the inner key={animationPhase} changes each tick,
              AnimatePresence treats it as "old one left, new one arrived" and
              cross-fades between insights. mode="wait" finishes the exit first. */}
          <AnimatePresence mode="wait">
            <motion.div
              key={animationPhase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-1.5"
            >
              <Sparkles size={11} className="text-acc-bi shrink-0 mt-0.5" />
              <p className="font-mono text-[9px] md:text-[10px] text-fg-soft leading-tight">
                {insights[animationPhase % insights.length]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="hidden lg:flex flex-wrap gap-x-2.5 gap-y-1 items-center border-t border-edge-soft pt-1.5 text-fg-soft font-mono text-[8px] md:text-[9px] shrink-0">
        <div className="flex items-center gap-1">
          <Users size={9} className="shrink-0" />
          <span>{codebaseStats.totalResponses} Analyzed</span>
        </div>
        <span className="text-fg/10">•</span>
        <div className="flex items-center gap-1">
          <TrendingDown size={9} className="shrink-0" />
          <span>8 Archetypes • Engagement scoring • Risk modeling</span>
        </div>
      </div>

      {/* Mobile-only Tech Stack */}
      <div className="lg:hidden flex flex-wrap gap-1 mt-1 shrink-0">
        {['Gemini AI', 'Firestore', 'React'].map(tech => (
          <span key={tech} className="font-mono text-[8px] sm:text-[9px] px-2 py-0.5 bg-acc-bi/10 border border-acc-bi/30 rounded text-acc-bi font-bold uppercase tracking-wider">
            {tech}
          </span>
        ))}
      </div>

    </div>
  );
}