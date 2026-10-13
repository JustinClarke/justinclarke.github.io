/**
 * FrontierChapter chapter 6 on /datascope, the most technical: where small models
 * stop writing correct SQL, the failure nothing in the stack can see, and
 * how the evidence behind every number on this page is kept honest.
 *
 * Fits in: last chapter of DataScopePage, before the closing band.
 * Note:    the matrix is a real table of meters (pass rate as a thin bar plus
 *          the exact fraction), sequential in one hue, because the job is
 *          magnitude and the fraction text carries the value on its own.
 */
import type { CSSProperties } from 'react';
import { cn } from '@/utils';
import { Chapter } from '../ui/Chapter';
import { Code } from '../ui/Code';
import { SourceLink } from '../ui/SourceLink';
import { DATASCOPE_REPO_URL, FRONTIER, NESTED_GRAIN, PRACTICES, STACK } from '../../data/datascopeData';

function Meter({ n, of, note }: { n: number; of: number; note?: string }) {
  const share = n / of;
  return (
    <div className="min-w-[7.5rem]">
      <p className="flex items-baseline gap-1.5">
        <span className="font-grotesk text-xl font-semibold text-text-primary">
          {n}/{of}
        </span>
        {note && <span className="font-jetbrains text-micro text-text-tertiary">{note}</span>}
      </p>
      <div aria-hidden="true" className="mt-2 h-1.5 w-full rounded-full bg-ds-amber/15">
        <div
          style={{ '--w': `${share * 100}%` } as CSSProperties}
          className={cn('h-full w-(--w) rounded-full', share === 1 ? 'bg-ds-amber' : 'bg-ds-amber/70')}
        />
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: string }) {
  return <p className="font-jetbrains text-fine uppercase tracking-mega text-text-tertiary">{children}</p>;
}

export function FrontierChapter() {
  return (
    <Chapter
      id="frontier"
      title="Where small models stop."
      lede={
        <p>
          Experiment 16 asked whether a model small enough to run in a browser tab can write correct SQL as schemas
          get harder. After fifteen probes across five models, scored only on execution-verified answers, the
          ceiling tracks model capacity. The failure left over is one no retry can see.
        </p>
      }
    >
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-ds-panel">
        <table className="w-full min-w-[36rem] text-left">
          <caption className="px-5 pt-5 text-left sm:px-7 sm:pt-7">
            <span className="block font-grotesk text-lg font-semibold text-text-primary">
              Correct SQL by model and schema shape
            </span>
            <span className="mt-1 block text-sm text-text-tertiary">
              8 questions per schema, three repeats each, checked against gold results
            </span>
          </caption>
          <thead>
            <tr className="font-jetbrains text-micro uppercase tracking-mega text-text-tertiary">
              <th scope="col" className="px-5 pt-6 pb-3 font-normal sm:px-7">Model</th>
              {FRONTIER.fixtures.map((f) => (
                <th key={f} scope="col" className="px-4 pt-6 pb-3 font-normal">{f}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FRONTIER.models.map((m) => (
              <tr key={m.name} className="border-t border-white/[0.07]">
                <th scope="row" className="px-5 py-5 align-top font-normal sm:px-7">
                  <span className="block text-sm font-medium text-text-primary">{m.name}</span>
                  <span className="block font-jetbrains text-fine text-text-tertiary">{m.note}</span>
                </th>
                {m.cells.map((c, i) => (
                  <td key={FRONTIER.fixtures[i]} className="px-4 py-5 align-top">
                    <Meter n={c.n} of={c.of} note={'single' in c ? 'one run' : undefined} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] px-5 py-4 sm:px-7">
          <p className="text-xs leading-relaxed text-text-tertiary">
            The 1.7B clears all three on the real WebGPU build. Gemini Nano wrote valid SQL for 8 of 8 four-table
            questions; about 6 were right.
          </p>
          <SourceLink source="experiment 16 · probes 1 to 15" href={FRONTIER.href} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-ds-panel p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-center">
        <div>
          <Eyebrow>A fourth axis · stacked aggregation</Eyebrow>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Stacking two or three aggregation levels on the same four tables is the first shape Qwen3 1.7B doesn't
            clear. It also caught the product's own prompt: the bare schema block beat it, and dropping the
            semantic labels beat both.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {NESTED_GRAIN.map((arm) => {
            const [n, of] = arm.score.split('/').map(Number);
            return (
              <li key={arm.arm}>
                <p className="mb-2 text-sm text-text-secondary">{arm.arm}</p>
                <Meter n={n} of={of} />
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-ds-amber/30 bg-linear-to-b from-ds-amber/[0.05] to-transparent p-5 sm:p-7">
          <Eyebrow>The open problem</Eyebrow>
          <h3 className="mt-3 font-grotesk text-2xl font-semibold leading-snug tracking-[-0.02em] text-text-primary">
            SQL that runs cleanly and returns the wrong number.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            The retry fires on an error, and a grain error raises none. A triple-hop average of averages computed
            this at item grain in every prompt arm:
          </p>
          <Code code={'SUM(price * qty) / COUNT(*)\n-- returned 272.9; the gold answer is 818.7'} lang="sql" className="mt-4" />
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            An error isn't always enough either. Given an ambiguous customer_id inside a nested subquery, the retry
            rung recovered 0 times in 3, with the model looping until it ran out of tokens, at 4,096 tokens just as
            at 2,048. Experiment 20 exists to go after this class.
          </p>
          <SourceLink source="experiment 16 · probes 14 and 15, sub-experiment 16b" href={FRONTIER.href} className="mt-5" />
        </article>

        <article className="rounded-2xl border border-ds-violet/30 bg-linear-to-b from-ds-violet/[0.06] to-transparent p-5 sm:p-7">
          <Eyebrow>The design principle</Eyebrow>
          <h3 className="mt-3 font-grotesk text-2xl font-semibold leading-snug tracking-[-0.02em] text-text-primary">
            The model decides what's interesting. It never decides what's true.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            In the evidence loop, a local 7B model picks analysis probes from a constrained grammar but can't write
            SQL. DuckDB compiles and runs every probe, and a validator strips any claim whose numbers don't appear in
            the evidence it cites.
          </p>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="font-grotesk text-3xl font-semibold text-text-primary">40/40</span>
            <span className="text-sm text-text-secondary">trials passed first-pass citation validity</span>
          </p>
          <SourceLink
            source="eval/chat/12-verified-claims"
            href={`${DATASCOPE_REPO_URL}/tree/main/eval/chat/12-verified-claims`}
            className="mt-5"
          />
        </article>
      </div>

      <div className="mt-20">
        <Eyebrow>How the numbers on this page stay honest</Eyebrow>
        <dl className="mt-8 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
          {PRACTICES.map((p) => (
            <div key={p.term}>
              <dt className="font-grotesk text-lg font-semibold text-text-primary">{p.term}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-text-secondary">{p.body}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-20 rounded-2xl border border-white/10 bg-ds-panel p-5 sm:p-7">
        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col">
            <dt className="order-2 mt-1 text-sm text-text-secondary">
              lines of TypeScript under src/, about 45% of it tests
            </dt>
            <dd className="order-1 font-grotesk text-4xl font-semibold tracking-[-0.03em] text-text-primary">66.5k</dd>
          </div>
          <div className="flex flex-col">
            <dt className="order-2 mt-1 text-sm text-text-secondary">tests across 231 files, run by Vitest</dt>
            <dd className="order-1 font-grotesk text-4xl font-semibold tracking-[-0.03em] text-text-primary">2,500+</dd>
          </div>
          <div className="flex flex-col">
            <dt className="order-2 mt-1 text-sm text-text-secondary">experiments designed, 12 built as harnesses</dt>
            <dd className="order-1 font-grotesk text-4xl font-semibold tracking-[-0.03em] text-text-primary">20</dd>
          </div>
        </dl>
        <p className="mt-8 border-t border-white/[0.07] pt-6 text-sm leading-relaxed text-text-secondary">
          The edge layer is opt-in: a Cloudflare Worker with an AI router, a CORS relay, a key vault, synthesis,
          persistence and an MCP endpoint, rate-limited by a Durable Object. The client core never needs it.
          Terraform owns the account resources and Wrangler owns the worker code.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack">
          {STACK.map((s) => (
            <li
              key={s}
              className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-jetbrains text-fine text-text-secondary"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </Chapter>
  );
}
