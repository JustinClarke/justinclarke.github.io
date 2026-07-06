/**
 * MethodologyStrip a bento grid of five "rigour" cards (causal identification,
 * CI invariants, reproducibility, docs, ML validation).
 *
 * Fits in: the overview, after the headline numbers.
 * Note:    Each card carries its own Tailwind class strings (`colSpan`, gradient,
 *          hover glow) in its data object, so one block of JSX styles all five.
 */
import { FlaskConical, TestTube, Box, BookOpen, BarChart2 } from 'lucide-react';
import { STATS, LINKS } from '../../../data/projectStats';

const cards = [
  {
    icon: FlaskConical,
    title: 'Causal identification',
    body: 'Frisch-Waugh-Lovell partialling + lagged instruments for endogenous dirty-air. Each term has a causal interpretation, not just a statistical fit.',
    accent: 'text-violet-400',
    boxDefault: 'bg-transparent border-2 border-violet-500/60',
    boxHover: 'group-hover:bg-violet-500 group-hover:border-violet-500 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]',
    iconColor: 'text-violet-500 group-hover:text-white',
    border: 'border-white/5 group-hover:border-violet-500/30',
    colSpan: 'md:col-span-8',
    bgClasses: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/20 via-graphite-850 to-graphite-850',
  },
  {
    icon: TestTube,
    title: `${STATS.tests} CI invariants`,
    body: 'Every model is guarded by a singular SQL assertion. The additive-identity test fires if any term drifts by > 0.0001s. Build fails before bad data reaches ML.',
    accent: 'text-emerald-400',
    boxDefault: 'bg-transparent border-2 border-emerald-500/60',
    boxHover: 'group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    iconColor: 'text-emerald-500 group-hover:text-white',
    border: 'border-white/5 group-hover:border-emerald-500/30',
    colSpan: 'md:col-span-4',
    bgClasses: 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/20 via-graphite-850 to-graphite-850',
  },
  {
    icon: Box,
    title: 'Reproducible locally',
    body: 'DuckDB on-disk warehouse, FastF1 via pip, dbt-core - no cloud account required. The full pipeline runs on a laptop. Zero vendor lock-in.',
    accent: 'text-amber-400',
    boxDefault: 'bg-transparent border-2 border-amber-500/60',
    boxHover: 'group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    iconColor: 'text-amber-500 group-hover:text-white',
    border: 'border-white/5 group-hover:border-amber-500/30',
    colSpan: 'md:col-span-4',
    bgClasses: 'bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-900/10 via-graphite-850 to-graphite-850',
  },
  {
    icon: BookOpen,
    title: 'Fully documented',
    body: "Auto-generated reference docs from dbt manifests. Every model, column, and test is described and versioned. Docs can't drift from the code.",
    href: LINKS.docs,
    accent: 'text-sky-400',
    boxDefault: 'bg-transparent border-2 border-sky-500/60',
    boxHover: 'group-hover:bg-sky-500 group-hover:border-sky-500 group-hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]',
    iconColor: 'text-sky-500 group-hover:text-white',
    border: 'border-white/5 group-hover:border-sky-500/30',
    colSpan: 'md:col-span-4',
    bgClasses: 'bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-sky-900/10 via-graphite-850 to-graphite-850',
  },
  {
    icon: BarChart2,
    title: 'ML layer validated',
    body: `Five XGBoost models with conformal calibration (0.804 empirical @ 0.80 nominal). ONNX parity proven to atol=1e-5. Leakage probe confirmed race_year recoverable at 99.99% excluded. SHAP + permutation importance shipped. ${STATS.mlTests} ML tests on CI.`,
    accent: 'text-blue-400',
    boxDefault: 'bg-transparent border-2 border-blue-500/60',
    boxHover: 'group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]',
    iconColor: 'text-blue-500 group-hover:text-white',
    border: 'border-white/5 group-hover:border-blue-500/30',
    colSpan: 'md:col-span-4',
    bgClasses: 'bg-graphite-850',
  },
];

export function MethodologyStrip() {
  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-xl">
        <span className="font-jetbrains text-micro text-text-tertiary uppercase tracking-mega mb-4 block font-semibold">
          Methodology
        </span>
        <h2 className="text-3xl md:text-4xl font-noto font-black text-white uppercase tracking-tighter mb-4">
          Rigour by design.
        </h2>
        <p className="text-text-tertiary text-sm font-jetbrains leading-relaxed">
          The architecture is built around the assumption that someone will try to break it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const inner = (
            <div
              className={`group flex flex-col gap-5 p-7 md:p-8 ${card.bgClasses} border ${card.border} rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-500 h-full ${'href' in card && card.href ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${card.boxDefault} ${card.boxHover}`}>
                  <Icon className={`w-6 h-6 ${card.iconColor} transition-colors duration-500`} />
                </div>

                {/* PASS invariant test status light */}
                <div className="flex items-center gap-1.5 text-micro text-emerald-400 font-mono font-bold bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  PASS
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1 justify-center">
                <h3 className="font-noto text-xl font-bold text-text-primary group-hover:text-white transition-colors">{card.title}</h3>
                <p className="font-jetbrains text-xs text-text-tertiary leading-relaxed md:leading-loose">{card.body}</p>
              </div>
              {'href' in card && card.href && (
                <span className={`font-jetbrains text-micro ${card.accent} uppercase tracking-wider font-semibold mt-auto flex items-center gap-2 group-hover:translate-x-1 transition-transform`}>
                  Read the docs <span className="text-lg leading-none">→</span>
                </span>
              )}
            </div>
          );

          return (
            <div key={card.title} className={card.colSpan}>
              {'href' in card && card.href ? (
                <a href={card.href} target="_blank" rel="noopener noreferrer" className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-2xl">
                  {inner}
                </a>
              ) : (
                <div className="h-full">{inner}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
