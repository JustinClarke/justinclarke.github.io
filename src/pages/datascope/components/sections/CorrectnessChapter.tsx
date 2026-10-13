/**
 * CorrectnessChapter chapter 4 on /datascope: why "the SQL ran" is not a score.
 *
 * Fits in: fourth chapter of DataScopePage.
 * Note:    each of the four levels carries a failure that was measured
 *          between it and the next one, so the ladder is evidence rather than
 *          a framework slide. The harness below it is DataScope's own.
 */
import { Chapter } from '../ui/Chapter';
import { SourceLink } from '../ui/SourceLink';
import { HarnessChart } from './HarnessChart';
import { HARNESS, LEVELS } from '../../data/datascopeData';

export function CorrectnessChapter() {
  return (
    <Chapter
      id="correctness"
      title="A query that runs can still be wrong."
      lede={
        <p>
          Plenty of text-to-SQL demos stop at "it didn't crash". Here an answer is scored at four levels, and passing
          one never implies passing the next. Each gap on this ladder comes from a measured run.
        </p>
      }
    >
      <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {LEVELS.map((item, i) => (
          <li key={item.level} className="flex flex-col rounded-xl border border-white/10 bg-ds-panel p-5">
            <div aria-hidden="true" className="flex gap-1">
              {LEVELS.map((_, j) => (
                <span key={j} className={j <= i ? 'h-1 flex-1 rounded-full bg-ds-amber' : 'h-1 flex-1 rounded-full bg-white/10'} />
              ))}
            </div>
            <p className="mt-4 font-jetbrains text-fine text-text-tertiary">Level {i + 1}</p>
            <h3 className="mt-1 font-grotesk text-lg font-semibold leading-snug text-text-primary">{item.level}</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.gap}</p>
            <SourceLink source={item.source} className="mt-auto pt-5" />
          </li>
        ))}
      </ol>

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
        <HarnessChart />
        <div className="space-y-4 text-sm leading-relaxed text-text-secondary lg:pt-2">
          <p>
            The two controls are there so a contender's number means something. A keyword template that can't
            reason scores 19%, and a mock that returns the gold SQL scores 100%.
          </p>
          <p>
            Between them, a 1.5B model running in the browser beat the hosted route on correctness, 72% to 53%,
            while executing less often.
          </p>
          <p>
            The hosted route used to score 83% and dropped to 53% after an architecture change. The build log
            records that drop as real rather than deploy skew, and it hasn't been diagnosed yet.
          </p>
          <SourceLink source={`${HARNESS.source} (gitignored run output)`} />
        </div>
      </div>
    </Chapter>
  );
}
