/**
 * ArchitectureTopology.tsx
 * AWS Summit Keynote "Reference Architecture" Interactive Diagram.
 * Showcases the five load-bearing seams of the DataScope + DuckChat runtime.
 */
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ARCHITECTURE_TOPOLOGY, type ArchitectureNode } from '../../data/datascopeData';
import { Layers, ChevronRight, CheckCircle2, Terminal, Code2, ArrowDown } from 'lucide-react';

export function ArchitectureTopology() {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode>(ARCHITECTURE_TOPOLOGY[3]); // Default to DuckChat
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
      {/* Header */}
      <div className="flex flex-col max-w-2xl mx-auto mb-14">
        <h2 className="font-noto text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
          Five decoupled seams.{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #863bff 0%, #00d4ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Zero monolithic lock-in.
          </span>
        </h2>
        <p className="font-jetbrains text-xs text-white/50 mt-4 leading-relaxed uppercase tracking-[0.1em] max-w-xl">
          Every capability produces or consumes an existing TypeScript contract.
          Profilers never import DuckDB directly. The UI never executes raw model strings.
          DuckChat is a compiler pass over the SQL AST.
        </p>
      </div>

      {/* Interactive Topology Seam Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: 5 Pipeline Seams */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {ARCHITECTURE_TOPOLOGY.map((node, index) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`group text-left p-4 rounded-2xl border transition-all duration-300 relative flex items-center justify-between ${
                  isSelected
                    ? 'bg-white/[0.08] border-[#863bff]/60 shadow-[0_0_25px_rgba(134,59,255,0.25)]'
                    : 'bg-[#090b11]/60 border-white/10 hover:border-white/20 hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-[#863bff] text-white border-transparent'
                        : 'bg-white/5 text-text-muted border-white/10 group-hover:text-white'
                    }`}
                  >
                    0{index + 1}
                  </div>
                  <div>
                    <div className="font-jetbrains font-bold text-sm text-white flex items-center gap-2">
                      <span>{node.name}</span>
                      {node.id === 'duckchat' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#863bff]/20 text-viz-accent border border-[#863bff]/30">
                          AI Engine
                        </span>
                      )}
                    </div>
                    <div className="font-sans text-xs text-white/50">{node.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-micro text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {node.latency}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-datascope translate-x-1' : 'text-text-muted'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Deep-Dive Blueprint Inspector */}
        <div className="lg:col-span-7 rounded-3xl bg-[#090b11]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#863bff]/30 to-datascope/20 border border-white/10 flex items-center justify-center text-datascope">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-noto text-xl font-bold text-white">
                  {selectedNode.name}
                </h3>
                <span className="font-jetbrains text-micro text-white/50">
                  {selectedNode.tech}
                </span>
              </div>
            </div>

            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
              Contract Verified
            </span>
          </div>

          {/* Details list */}
          <div className="mb-6 space-y-2.5">
            <div className="font-jetbrains text-micro uppercase tracking-wider text-text-tertiary mb-1">
              Architectural Constraints & Guarantees
            </div>
            {selectedNode.details.map((detail, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80">
                <CheckCircle2 className="w-4 h-4 text-datascope shrink-0 mt-0.5" />
                <span className="font-sans leading-relaxed">{detail}</span>
              </div>
            ))}
          </div>

          {/* TypeScript Contract Seam Preview */}
          <div className="rounded-2xl bg-black/70 border border-white/10 overflow-hidden font-jetbrains">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.02] text-micro text-white/50">
              <span className="flex items-center gap-1.5 text-white/70 font-mono">
                <Code2 className="w-3.5 h-3.5 text-[#863bff]" />
                <span>seams/{selectedNode.id}.contract.ts</span>
              </span>
              <span>TypeScript Strict Contract</span>
            </div>
            <pre className="p-4 text-xs text-viz-accent leading-relaxed overflow-x-auto">
              <code>{selectedNode.contractSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
