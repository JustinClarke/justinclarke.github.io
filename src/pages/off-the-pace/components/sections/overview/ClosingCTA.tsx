import { useLocation, useNavigate } from 'react-router-dom';
import { STATS, LINKS } from '../../../data/projectStats';

export function ClosingCTA() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isOverview = pathname === '/f1';

  return (
    <section className="relative z-10 text-center py-12 px-6 overflow-hidden border-t border-white/5 bg-graphite-900 text-white w-full">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_bottom,rgba(225,6,0,0.08)_0%,transparent_75%)] pointer-events-none" />
      <h2 className="text-4xl md:text-5xl font-noto font-black text-white uppercase tracking-tighter mb-6 leading-none">
        Lap times lie.<br />You can now know why.
      </h2>
      <p className="font-jetbrains text-xs md:text-sm text-text-tertiary max-w-2xl mx-auto mb-10 leading-relaxed">
        A causal engine built from first principles. {STATS.racesIngested} races ingested. {STATS.seasons} seasons. {STATS.tests} dbt tests + {STATS.mlTests} ML tests. 5 XGBoost models. No cloud required.
      </p>
      <div className="w-full max-w-sm sm:max-w-2xl lg:max-w-3xl flex flex-col gap-3 mx-auto mt-4 items-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full">
          <a
            href={LINKS.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-f1-red text-white font-jetbrains text-xs font-bold uppercase tracking-wider px-4 py-3 rounded hover:bg-red-700 transition-all duration-200 shadow-[0_0_20px_rgba(225,6,0,0.2)]"
          >
            ↗ View on GitHub
          </a>
          <a
            href={LINKS.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-white/10 text-text-secondary hover:text-white font-jetbrains text-xs font-semibold uppercase tracking-wider px-4 py-3 rounded hover:border-white/20 hover:bg-white/[0.02] transition-all duration-200"
          >
            Read the Docs →
          </a>
          {isOverview ? (
            <button
              onClick={() => navigate('/off-the-pace')}
              className="inline-flex items-center justify-center gap-2 border border-white/10 text-text-tertiary hover:text-text-secondary font-jetbrains text-xs font-semibold uppercase tracking-wider px-4 py-3 rounded hover:border-white/20 hover:bg-white/[0.02] transition-all duration-200 cursor-pointer"
            >
              See the Architecture ↗
            </button>
          ) : (
            <button
              onClick={() => navigate('/f1')}
              className="inline-flex items-center justify-center gap-2 border border-white/10 text-text-tertiary hover:text-text-secondary font-jetbrains text-xs font-semibold uppercase tracking-wider px-4 py-3 rounded hover:border-white/20 hover:bg-white/[0.02] transition-all duration-200 cursor-pointer"
            >
              See the Overview ↗
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
