/**
 * F1TelemetryWidget the F1 "Off the Pace" bento card. It owns no logic itself;
 * it just lays out the header, controls, track map, telemetry/causal panel, and
 * the dbt log console, feeding each child a slice of the simulation.
 *
 * Fits in: one card in the homepage featured-projects bento grid.
 * Note:    ALL the moving state lives in the useF1Telemetry hook this component
 *          is a pure renderer. The one exception is the log auto-scroll effect,
 *          which stays here because it needs a DOM ref the hook can't hold.
 */
import { useRef, useEffect, Fragment } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Activity, Database, Sparkles, Cpu } from 'lucide-react';
import { cn } from '@/utils';
import { useF1Telemetry } from './useF1Telemetry';
import { HudHeader } from './f1/HudHeader';
import { ControlsBar } from './f1/ControlsBar';
import { TrackMap } from './f1/TrackMap';
import { TelemetryPanel } from './f1/TelemetryPanel';
import { CausalPanel } from './f1/CausalPanel';

export function F1TelemetryWidget() {
  const telemetry = useF1Telemetry();
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Pin the dbt console to its newest line whenever the log list grows.
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [telemetry.pipelineLogs]);

  const { uiMode, pipelineLogs, isTesting, runDbtTests } = telemetry;

  return (
    <div data-theme-lock="dark" className="flex flex-col h-full justify-between gap-1.5 md:gap-2 select-none text-left">

      <HudHeader
        isPlaying={telemetry.isPlaying}
        isCliffRisk={telemetry.isCliffRisk}
        currentLap={telemetry.currentLap}
      />

      {/* Pipeline flow the five-stage architecture as a *running* circuit: a
          bright data packet hops stage→stage (see .f1-flow-packet in index.css)
          so a recruiter reads a live system, not a logo row. Verb sublabels keep
          the story legible to non-technical readers while the tech names flex the
          stack. Shown on mobile too (horizontal scroll) recruiter traffic is
          often a phone. Packets freeze via `f1-flow-paused` when the sim pauses. */}
      <div className={cn(
        "flex items-center justify-between py-2.5 px-3 md:px-4 bg-white/[0.02] border border-[rgba(255,255,255,0.05)] rounded-xl shrink-0 select-none overflow-hidden",
        !telemetry.isPlaying && "f1-flow-paused"
      )}>
        {[
          {
            icon: (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M14.25.18c-.98-.08-1.97-.03-2.96-.03-.89.03-1.78-.05-2.66.12A6.52 6.52 0 003.88 5c-.75 1.54-.7 3.32-.7 4.97V11h3.1v-1.12c.03-1.6.86-3.23 2.45-3.66.92-.25 1.9-.12 2.85-.16h3.48c1.3-.04 2.47.88 2.68 2.18.23 1.45-.63 2.89-2.07 3.2-1 .2-2.03.11-3.04.12H9.08c-1.74.03-3.53.53-4.8 1.77a6.22 6.22 0 00-1.74 4.88c.07 1.63.76 3.23 2 4.25A7 7 0 009 23.95c1.47-.07 2.95 0 4.42-.03.73-.04 1.46.03 2.18-.1a6.38 6.38 0 004.55-4.43c.72-1.63.66-3.46.67-5.2V13h-3.1v1.17c-.03 1.5-.78 3.02-2.22 3.51-.9.3-1.89.17-2.83.2H9.17c-1.32.04-2.52-.89-2.73-2.2-.24-1.48.65-2.94 2.12-3.23 1.05-.2 2.12-.11 3.19-.12h3.58c1.8-.02 3.68-.53 4.96-1.86a6.39 6.39 0 001.7-5.08 6.46 6.46 0 00-2.32-4.7A7.32 7.32 0 0014.25.18zM8.34 3.03a1.16 1.16 0 11.02 2.33 1.16 1.16 0 01-.02-2.33zm7.32 15.61a1.16 1.16 0 11.02 2.33 1.16 1.16 0 01-.02-2.33z" />
              </svg>
            ),
            label: 'PYTHON',
            color: 'text-teal-400'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm0-21.75c-5.38 0-9.75 4.37-9.75 9.75a9.72 9.72 0 0 0 2.22 6.17l.08.1.02.02c2.03 2.33 4.97 3.46 7.43 3.46 5.38 0 9.75-4.37 9.75-9.75 0-2.58-1.01-4.94-2.86-6.79A9.7 9.7 0 0 0 12 2.25zm0 13.5a3.75 3.75 0 1 1 3.75-3.75 3.75 0 0 1-3.75 3.75z" />
              </svg>
            ),
            label: 'DBT + SQL',
            color: 'text-dbt'
          },
          {
            icon: (
              <svg viewBox="0 0 1024 1024" className="w-3.5 h-3.5 fill-current">
                <path d="M624.4 780.1c-9.1 0-17.8-3.6-24.3-10.1L299.6 469.5c-13.4-13.4-13.4-35.1 0-48.5l300.6-300.6c13.4-13.4 35.1-13.4 48.5 0s13.4 35.1 0 48.5L372.4 445.3l252 252 252-252-113-113c-13.4-13.4-13.4-35.1 0-48.5s35.1-13.4 48.5 0L949.3 421c6.4 6.4 10.1 15.2 10.1 24.3 0 9.1-3.6 17.8-10.1 24.3L648.7 770.1c-6.4 6.4-15.2 10-24.3 10zM235.7 379.2c-8.8 0-17.6-3.4-24.3-10.1l-136-136C62 219.7 62 198 75.4 184.6s35.1-13.4 48.5 0l136.1 136c13.4 13.4 13.4 35.1 0 48.5-6.7 6.8-15.5 10.1-24.3 10.1zM89.6 727.1c-8.8 0-17.6-3.4-24.3-10.1-13.4-13.4-13.4-35.1 0-48.5l136.1-136.1c13.4-13.4 35.1-13.4 48.5 0s13.4 35.1 0 48.5L113.8 717c-6.7 6.7-15.4 10.1-24.2 10.1z" />
              </svg>
            ),
            label: 'XGBOOST ML',
            color: 'text-purple-400'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path fillRule="evenodd" clipRule="evenodd" d="M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.03a6.717 6.717 0 0 0 4.077 1.356h5.173l.03.03h5.192c6.687.053 9.376-8.605 3.835-12.35a9.365 9.365 0 0 0-2.821-4.552l-.043.043.006-.05A9.344 9.344 0 0 0 12.19 2.38zm-.358 4.146c1.244-.04 2.518.368 3.486 1.15a5.186 5.186 0 0 1 1.862 4.078v.518c3.53-.07 3.53 5.262 0 5.193h-5.193l-.008.009v-.04H6.785a2.59 2.59 0 0 1-1.067-.23h.001a2.597 2.597 0 1 1 3.437-3.437l3.013-3.012A6.747 6.747 0 0 0 8.11 8.24c.018-.01.04-.026.054-.023a5.186 5.186 0 0 1 3.67-1.69z" />
              </svg>
            ),
            label: 'GCS CLOUD',
            color: 'text-blue-400'
          }
        ].map((stage, i, arr) => (
          <Fragment key={stage.label}>
            <div
              className={cn(
                "flex items-center gap-1.5 transition-all duration-300",
                "hover:scale-[1.03] hover:-translate-y-px cursor-default shrink-0",
                stage.color,
                "animate-f1-aura"
              )}
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <span className="text-micro md:text-fine leading-none shrink-0">{stage.icon}</span>
              <span className="font-mono text-micro md:text-micro font-black tracking-[0.08em] leading-none shrink-0">{stage.label}</span>
            </div>
            {i < arr.length - 1 && (
              // Connector with a data packet sliding across; staggered per hop so
              // the packets chain into one continuous left→right flow.
              <span className="relative flex-grow h-px min-w-[12px] bg-white/10 mx-2 md:mx-4">
                <span
                  className="f1-flow-packet h-1 w-1 rounded-full bg-brand-primary shadow-[0_0_6px_var(--color-brand-primary)]"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              </span>
            )}
          </Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 flex-grow min-h-0">

        <TrackMap
          activeSector={telemetry.activeSector}
          airState={telemetry.airState}
          isCliffRisk={telemetry.isCliffRisk}
          getTrackViewBox={telemetry.getTrackViewBox}
          getTrackPath={telemetry.getTrackPath}
          activeTrack={telemetry.activeTrack}
          isPlaying={telemetry.isPlaying}
          setActiveTrack={telemetry.setActiveTrack}
          thermalSurface={telemetry.thermalSurface}
          thermalBulk={telemetry.thermalBulk}
        />

        <div className="md:col-span-2 flex flex-col gap-1.5 min-h-0">

          <ControlsBar
            isPlaying={telemetry.isPlaying}
            setIsPlaying={telemetry.setIsPlaying}
            uiMode={telemetry.uiMode}
            setUiMode={telemetry.setUiMode}
            selectedCompound={telemetry.selectedCompound}
            setSelectedCompound={telemetry.setSelectedCompound}
            setTyreAge={telemetry.setTyreAge}
            setCurrentLap={telemetry.setCurrentLap}
            setFuelWeight={telemetry.setFuelWeight}
            isCliffRisk={telemetry.isCliffRisk}
            currentLap={telemetry.currentLap}
            tyreAge={telemetry.tyreAge}
          />

          {/* Distinct keys let AnimatePresence cross-fade the two panels as uiMode
              flips between 'telemetry' and 'causal'. */}
          <AnimatePresence mode="wait">
            {uiMode === 'telemetry' ? (
              <TelemetryPanel
                key="telemetry-panel"
                liveSpeed={telemetry.liveSpeed}
                liveThrottle={telemetry.liveThrottle}
                liveBrake={telemetry.liveBrake}
              />
            ) : (
              <CausalPanel
                key="causal-panel"
                decomp={telemetry.decomp}
                fuelWeight={telemetry.fuelWeight}
              />
            )}
          </AnimatePresence>

          {/* dbt console log stream + interactive test runner */}
          <div className="hidden md:flex flex-col justify-between flex-grow bg-bento-panel border border-[rgba(255,255,255,0.1)] rounded-2xl p-2.5 md:p-3 min-h-0 relative">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] pb-1.5 mb-1.5 shrink-0">
              <span className="font-mono text-micro md:text-micro text-neutral-500 tracking-wider flex items-center gap-1.5">
                <Cpu size={11} className="shrink-0" /> dbt CONSOLE
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); runDbtTests(); }}
                disabled={isTesting}
                className={cn(
                  "font-mono text-micro md:text-micro px-1.5 py-0.5 rounded font-black uppercase border transition-all flex items-center gap-1",
                  isTesting
                    ? "bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)] text-amber-400"
                    : "bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.3)] text-emerald-400 hover:bg-[rgba(16,185,129,0.2)] active:scale-95"
                )}
              >
                {isTesting ? 'Running tests...' : 'Run tests'}
              </button>
            </div>
            <div
              ref={logContainerRef}
              className="flex-grow font-mono text-micro xs:text-micro md:text-micro text-neutral-400 overflow-y-auto leading-tight flex flex-col gap-0.5 pr-1 min-h-[90px] md:min-h-[110px]"
            >
              {/* Colour-code each log line by keyword syntax-highlight without parsing. */}
              {pipelineLogs.map((log, index) => {
                const isSuccess = log.includes('SUCCESS') || log.includes('PASS');
                const isDuck = log.includes('DuckDB');
                const isDbt = log.includes('dbt');
                return (
                  <div key={index} className="truncate">
                    <span className={cn(
                      isSuccess ? "text-emerald-400 font-semibold" :
                        isDuck ? "text-purple-400" :
                          isDbt ? "text-orange-400" : "text-neutral-400"
                    )}>
                      {log}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Footer metrics */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-between items-center pt-1.5 text-neutral-400 font-mono text-micro md:text-micro shrink-0">
        <div className="flex items-center gap-1.5">
          <Database size={10} className="shrink-0" />
          <span>90M+ Telemetry Rows / Season</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-500 animate-pulse">
          <Sparkles size={10} className="shrink-0" />
          <span>Causal Regression Model</span>
        </div>
      </div>

    </div>
  );
}
