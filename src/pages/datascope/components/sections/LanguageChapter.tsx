/**
 * LanguageChapter chapter 3 on /datascope: how a question becomes SQL, and what
 * stands between the model and the database.
 *
 * Fits in: third chapter of DataScopePage.
 * Note:    two projects meet here and the copy keeps them apart. DataScope's
 *          own path (modes, the small-model ladder) comes first; DuckChat is
 *          the separate lab where the repair layer lives and was measured.
 *          DataScope does not ship DuckChat's repairs, and nothing here says so.
 */
import { Chapter } from '../ui/Chapter';
import { SourceLink } from '../ui/SourceLink';
import { RepairViewer } from './RepairViewer';
import { AI_MODES, DATASCOPE_REPO_URL, QUESTION_PATH, REPAIR_STATS } from '../../data/datascopeData';

function Eyebrow({ children }: { children: string }) {
  return <p className="font-jetbrains text-fine uppercase tracking-mega text-text-tertiary">{children}</p>;
}

export function LanguageChapter() {
  return (
    <Chapter
      id="language"
      title="The model writes the SQL. Code decides what runs."
      lede={
        <p>
          DataScope turns a plain-English question into SQL through a staged pipeline, and every step shows up in a
          trace you can open in the app. The repair layer and most of the numbers below come from DuckChat, a
          separate Node lab I built to find out what actually helps a small model write SQL that's correct.
        </p>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="rounded-xl border border-white/10 bg-ds-panel p-5 sm:p-6">
          <Eyebrow>DataScope · three modes</Eyebrow>
          <table className="mt-4 w-full text-left text-sm">
            <caption className="sr-only">DataScope's AI modes and what each sends over the network</caption>
            <thead>
              <tr className="border-b border-white/10 font-jetbrains text-micro uppercase tracking-mega text-text-tertiary">
                <th scope="col" className="pb-2 pr-4 font-normal">Mode</th>
                <th scope="col" className="pb-2 pr-4 font-normal">What runs</th>
                <th scope="col" className="pb-2 font-normal">Network</th>
              </tr>
            </thead>
            <tbody>
              {AI_MODES.map((m) => (
                <tr key={m.mode} className="border-b border-white/[0.06] last:border-0 align-top">
                  <th scope="row" className="py-3 pr-4 font-medium whitespace-nowrap text-text-primary">
                    {m.mode}
                  </th>
                  <td className="py-3 pr-4 leading-relaxed text-text-secondary">{m.detail}</td>
                  <td className="py-3 font-jetbrains text-fine whitespace-nowrap text-ds-ok">{m.network}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <SourceLink source="README.md" href={`${DATASCOPE_REPO_URL}/blob/main/README.md`} className="mt-4" />
        </div>

        <div className="rounded-xl border border-white/10 bg-ds-panel p-5 sm:p-6">
          <Eyebrow>DataScope · why there's a ladder</Eyebrow>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            The pinned small model, Qwen2.5-Coder 1.5B, never emits structured tool calls. It writes the call as
            prose, a JSON blob or fenced SQL, so control flow can't be left to it. A model that does emit
            structured calls drives itself. One that doesn't gets a deterministic ladder whose follow-up budget only
            shrinks and whose last rung is answer-only, so every turn ends.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            In the SQL console, a statement that would change a source table is stopped and asks first.
          </p>
          <div className="mt-4 flex flex-col gap-1.5">
            <SourceLink
              source="src/services/toolLadder.ts"
              href={`${DATASCOPE_REPO_URL}/blob/main/src/services/toolLadder.ts`}
            />
            <SourceLink
              source="src/services/transforms.ts"
              href={`${DATASCOPE_REPO_URL}/blob/main/src/services/transforms.ts`}
            />
          </div>
        </div>
      </div>

      <div className="mt-20">
        <Eyebrow>DuckChat · one question, six steps</Eyebrow>
        <h3 className="mt-3 max-w-2xl font-grotesk text-2xl font-semibold tracking-[-0.02em] text-text-primary">
          A small lab with a single job: measure what helps.
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
          DuckChat loads CSVs and personal data exports into DuckDB-WASM in Node and asks a model for SQL. Every
          baseline it records carries the model id and the git commit it ran at. The repository is private.
        </p>
        <ol className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {QUESTION_PATH.map((s, i) => (
            <li key={s.step} className="border-t border-white/10 pt-4">
              <p className="flex items-baseline gap-3">
                <span className="font-jetbrains text-fine text-ds-amber tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-grotesk text-lg font-semibold text-text-primary">{s.step}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-20">
        <Eyebrow>DuckChat · the repair layer</Eyebrow>
        <h3 className="mt-3 max-w-2xl font-grotesk text-2xl font-semibold tracking-[-0.02em] text-text-primary">
          Eight faults that are wrong by definition, fixed before the query runs.
        </h3>
        <p className="mt-3 mb-8 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Each pair below is a real case from the repo's own guard file. Detection is timid by design: a repair that
          fails to fire leaves a wrong answer wrong, but one that fires on the wrong column turns a right answer
          wrong in a query that still runs clean.
        </p>
        <RepairViewer />
      </div>

      <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
        {REPAIR_STATS.map((stat) => (
          <div key={stat.value} className="flex flex-col bg-ds-canvas p-6">
            <dt className="order-2 mt-3 text-sm leading-relaxed text-text-secondary">{stat.label}</dt>
            <dd className="order-1 flex items-baseline gap-2">
              <span className="font-grotesk text-3xl font-semibold tabular-nums tracking-[-0.02em] text-text-primary">
                {stat.value}
              </span>
              <span className="font-jetbrains text-fine text-text-tertiary">{stat.unit}</span>
            </dd>
            <dd className="order-3 mt-auto pt-4">
              <SourceLink source={stat.source} />
            </dd>
          </div>
        ))}
      </dl>

      <figure className="mt-20 max-w-4xl border-l-2 border-ds-amber pl-6 sm:pl-8">
        <blockquote className="text-balance font-grotesk text-2xl font-medium leading-snug tracking-[-0.02em] text-text-primary sm:text-3xl">
          A repair only fires on SQL that already runs, a retry only on SQL that doesn't, and neither one can tell
          whether the answer is correct.
        </blockquote>
        <figcaption className="mt-4">
          <SourceLink source="duckchat/README.md · How it works" />
        </figcaption>
      </figure>
    </Chapter>
  );
}
