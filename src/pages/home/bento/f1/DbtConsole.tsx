/**
 * DbtConsole the live dbt pipeline execution console & interactive test runner.
 *
 * Fits in: the bottom half of the right column in F1TelemetryWidget, filling
 *          the vertical space below TelemetryPanel / CausalPanel.
 * Note:    auto-scrolls to newest log entry on update. Interactive "Run tests"
 *          button triggers a simulated 5-stage dbt validation suite.
 */
import { useEffect, useRef } from 'react';
import { Play, Terminal, Loader2 } from 'lucide-react';
import { cn } from '@/utils';

interface DbtConsoleProps {
  pipelineLogs: string[];
  isTesting: boolean;
  runDbtTests: () => void;
}

export function DbtConsole({ pipelineLogs, isTesting, runDbtTests }: DbtConsoleProps) {
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Pin the console scroll position to newest entry on log updates
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [pipelineLogs]);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-black/40 border border-[rgba(255,255,255,0.06)] rounded-2xl p-2 md:p-2.5 relative shadow-inner overflow-hidden text-left">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-1.5 mb-1.5 shrink-0 gap-2 overflow-hidden">
        <div className="flex items-center gap-1.5 shrink-0 min-w-0">
          <Terminal size={11} className="text-orange-400 shrink-0" />
          <span className="font-mono text-micro text-neutral-400 font-bold tracking-wider whitespace-nowrap">
            dbt
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            runDbtTests();
          }}
          disabled={isTesting}
          className={cn(
            "font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap shrink-0 border",
            isTesting
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 cursor-not-allowed shadow-[0_0_8px_rgba(245,158,11,0.15)]"
              : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/50 hover:text-emerald-300 active:scale-95 shadow-[0_0_10px_rgba(16,185,129,0.12)]"
          )}
        >
          {isTesting ? (
            <>
              <Loader2 size={10} className="animate-spin shrink-0 text-amber-400" />
              <span>TESTING...</span>
            </>
          ) : (
            <>
              <Play size={9} className="shrink-0 fill-current text-emerald-400" />
              <span>RUN</span>
            </>
          )}
        </button>
      </div>

      {/* Log Output Stream */}
      <div
        ref={logContainerRef}
        className="flex-1 font-mono text-micro text-neutral-400 overflow-y-auto flex flex-col gap-1 pr-1 min-h-0 select-text"
      >
        {pipelineLogs.map((log, index) => {
          // Parse timestamp if present (e.g. [13:49:10] or [4:48:34 PM])
          const match = log.match(/^\[(.*?)\]\s*(.*)$/);
          const timestamp = match ? match[1].replace(/\s[AP]M$/i, '') : null;
          const body = match ? match[2] : log;

          const isSuccess = body.includes('SUCCESS') || body.includes('PASS') || body.includes('✅');
          const isDuck = body.includes('DuckDB');
          const isDbt = body.includes('dbt');
          const isXgb = body.includes('XGBoost');
          const isTestHeader = body.includes('TEST');

          return (
            <div key={index} className="flex items-center gap-1.5 text-micro leading-normal shrink-0 whitespace-nowrap overflow-hidden">
              {timestamp ? (
                <span className="text-neutral-500 font-mono text-micro shrink-0">
                  {timestamp}
                </span>
              ) : (
                <span className="text-neutral-600 select-none shrink-0">›</span>
              )}
              <span
                className={cn(
                  "truncate font-mono",
                  isSuccess
                    ? "text-emerald-400 font-medium"
                    : isTestHeader
                      ? "text-amber-300 font-medium"
                      : isDuck
                        ? "text-purple-400"
                        : isDbt
                          ? "text-orange-400"
                          : isXgb
                            ? "text-blue-400"
                            : "text-neutral-400"
                )}
              >
                {body}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
