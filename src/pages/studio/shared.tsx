/**
 * shared.tsx small pieces shared between the studio case-study pages
 * (CrescendoPage, StrokTalkPage) that would otherwise be copy-pasted.
 */

export function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8 md:mb-12">
      <span className="font-mono text-micro md:text-xs font-bold tracking-[0.5em] text-text-ghost">
        {number}
      </span>
      <div className="h-px flex-grow bg-gradient-to-r from-white/10 to-transparent" />
      <span className="font-mono text-micro md:text-micro tracking-[0.4em] uppercase text-text-tertiary">
        {title}
      </span>
    </div>
  );
}
