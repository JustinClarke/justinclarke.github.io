/**
 * F1TelemetryWidget bento card entry point for the F1 telemetry simulation.
 * Fits in: BentoCard within the homepage bento grid.
 * Note: all simulation state lives in useF1Telemetry; this component is a
 *   pure renderer. The logContainerRef auto-scroll effect stays here because it needs
 *   a DOM reference that the hook cannot hold.
 */
import { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Activity, Database, Sparkles, Cpu } from 'lucide-react';
import { cn } from '@/utils';
import { useF1Telemetry } from '@/hooks/useF1Telemetry';
import { HudHeader } from './f1/HudHeader';
import { ControlsBar } from './f1/ControlsBar';
import { TrackMap } from './f1/TrackMap';
import { TelemetryPanel } from './f1/TelemetryPanel';
import { CausalPanel } from './f1/CausalPanel';

export function F1TelemetryWidget() {
  const telemetry = useF1Telemetry();
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Scroll the log console to the latest entry whenever a new line arrives
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
        tyreAge={telemetry.tyreAge}
      />

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
      />

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
          <div className="hidden md:flex flex-col justify-between flex-grow bg-[#09090b] border border-white/10 rounded-2xl p-2.5 md:p-3 min-h-0 relative">
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1.5 shrink-0">
              <span className="font-mono text-[9px] md:text-[10px] text-neutral-500 tracking-wider flex items-center gap-1.5">
                <Cpu size={11} className="shrink-0" /> dbt CONSOLE
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); runDbtTests(); }}
                disabled={isTesting}
                className={cn(
                  "font-mono text-[8px] md:text-[9px] px-1.5 py-0.5 rounded font-black uppercase border transition-all flex items-center gap-1",
                  isTesting
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 active:scale-95"
                )}
              >
                {isTesting ? 'Running tests...' : 'Run tests'}
              </button>
            </div>
            <div
              ref={logContainerRef}
              className="flex-grow font-mono text-[8px] xs:text-[9px] md:text-[10px] text-neutral-400 overflow-y-auto leading-tight flex flex-col gap-0.5 pr-1 min-h-[90px] md:min-h-[110px]"
            >
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
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-between items-center border-t border-white/5 pt-1.5 text-neutral-400 font-mono text-[9px] md:text-[10px] shrink-0">
        <div className="flex items-center gap-1.5">
          <Database size={10} className="shrink-0" />
          <span>2.4M Telemetry Rows</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity size={10} className="shrink-0" />
          <span>Fabric + dbt + DuckDB</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-500 animate-pulse">
          <Sparkles size={10} className="shrink-0" />
          <span>Causal Regression Model</span>
        </div>
      </div>

    </div>
  );
}
