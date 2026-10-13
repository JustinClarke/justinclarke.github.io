/**
 * ExperimentsChapter chapter 5 on /datascope: the measured results that went
 * against the plan, and what each one changed.
 *
 * Fits in: fifth chapter of DataScopePage.
 * Note:    a ledger, not a card grid: the question, the number, the
 *          consequence, read left to right. The grounding ladder leads because
 *          it is the one that reversed a product decision outright.
 */
import { Chapter } from '../ui/Chapter';
import { SourceLink } from '../ui/SourceLink';
import { GroundingLadderChart } from './GroundingLadderChart';
import { RESULTS } from '../../data/datascopeData';

export function ExperimentsChapter() {
  return (
    <Chapter
      id="experiments"
      title="The results that went against the plan."
      lede={
        <p>
          Pass rules are written down before a run, raw prompts and outputs are kept, and a result that contradicts
          the roadmap gets reported instead of dropped. The first one below changed how the product talks to a
          model.
        </p>
      }
    >
      <GroundingLadderChart />

      <div className="mt-16">
        <div
          aria-hidden="true"
          className="hidden grid-cols-[minmax(0,1.5fr)_minmax(0,0.7fr)_minmax(0,1fr)] gap-8 border-b border-white/10 pb-3 font-jetbrains text-micro uppercase tracking-mega text-text-tertiary lg:grid"
        >
          <span>Question</span>
          <span>Measured</span>
          <span>What it changed</span>
        </div>
        <ul>
          {RESULTS.map((r) => (
            <li
              key={r.question}
              className="grid grid-cols-1 gap-x-8 gap-y-3 border-b border-white/[0.07] py-7 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.7fr)_minmax(0,1fr)]"
            >
              <div>
                <h3 className="font-grotesk text-lg font-semibold leading-snug text-text-primary">{r.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{r.detail}</p>
                <SourceLink source={r.source} className="mt-3" />
              </div>
              <p className="font-grotesk text-2xl font-semibold tracking-[-0.02em] text-ds-amber lg:pt-0.5">
                <span className="sr-only">Measured: </span>
                {r.result}
              </p>
              <p className="text-sm leading-relaxed text-text-primary lg:pt-1.5">
                <span className="sr-only">What it changed: </span>
                {r.outcome}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Chapter>
  );
}
