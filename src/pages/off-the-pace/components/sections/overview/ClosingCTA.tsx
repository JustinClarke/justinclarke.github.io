import { ExternalLink, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LINKS } from '../../../data/projectStats';

export function ClosingCTA() {
  const navigate = useNavigate();

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 p-8 md:p-12 lg:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8 transition-all duration-500 hover:border-slate-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
      {/* Background Glow */}
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-f1-red/10 rounded-full blur-[80px] pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

      {/* Cyberpunk corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-f1-red rounded-tl-xl transition-colors duration-300" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-f1-red rounded-br-xl transition-colors duration-300" />

      <div className="relative z-10 flex flex-col gap-3.5 max-w-lg">
        <span className="font-jetbrains text-[9px] text-f1-red uppercase tracking-[0.2em] font-semibold">
          Next steps
        </span>
        <h2 className="text-2xl md:text-3xl font-noto font-black text-white uppercase tracking-tighter">
          Seen the pitch.<br />Now see the proof.
        </h2>
        <p className="font-jetbrains text-sm text-slate-400 leading-relaxed">
          The Architecture view walks through the engineering  - the DAG architecture, the CI gates,
          the science behind the seven-term identity, and the full validation ledger.
        </p>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-3.5 shrink-0 font-jetbrains">
        <a
          href={LINKS.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 uppercase tracking-wider font-semibold hover:bg-slate-850 hover:text-white hover:border-slate-700 transition-all duration-300"
        >
          <ExternalLink className="w-4 h-4 text-slate-500" />
          Repo
        </a>
        <a
          href={LINKS.docs}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 uppercase tracking-wider font-semibold hover:bg-slate-850 hover:text-white hover:border-slate-700 transition-all duration-300"
        >
          <BookOpen className="w-4 h-4 text-slate-500" />
          Docs
        </a>
        <button
          onClick={() => {
            navigate('/off-the-pace');
          }}
          className="flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-red-600 to-f1-red rounded-xl text-xs text-white uppercase tracking-wider font-bold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_20px_rgba(225,6,0,0.35)] hover:shadow-[0_6px_30px_rgba(225,6,0,0.55)] cursor-pointer"
        >
          View the architecture
        </button>
      </div>
    </div>
  );
}
