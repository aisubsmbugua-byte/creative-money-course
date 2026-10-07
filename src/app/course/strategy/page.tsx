import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { StrategyDoc } from "@/lib/strategy-schema";

const WHEN_LABEL: Record<string, string> = {
  now: "Start now",
  soon: "Soon",
  later: "Later",
};

const WHEN_DOT: Record<string, string> = {
  now: "bg-moss",
  soon: "bg-brass",
  later: "bg-text-muted",
};

function healthForMargin(marginPct: number) {
  if (marginPct < 0) {
    return { text: "text-[#a1522f]", bg: "bg-[#f3e4dc]", label: "You're behind" };
  }
  if (marginPct < 0.15) {
    return { text: "text-brass", bg: "bg-[#f6ecd9]", label: "Thin cushion" };
  }
  return { text: "text-moss", bg: "bg-moss-light", label: "Healthy margin" };
}

function MoneyBarChart({
  currency,
  moneyIn,
  moneyOut,
}: {
  currency: string;
  moneyIn: number;
  moneyOut: number;
}) {
  const max = Math.max(moneyIn, moneyOut, 1);
  const fmt = (n: number) => `${currency} ${Math.abs(n).toLocaleString()}`;
  const surplus = moneyIn - moneyOut;
  const marginPct = moneyIn > 0 ? surplus / moneyIn : 0;
  const health = healthForMargin(marginPct);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="w-32 shrink-0 text-xs font-medium text-text">Money coming in</span>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-paper-line">
          <div
            className="h-full rounded-full bg-moss"
            style={{ width: `${Math.max((moneyIn / max) * 100, 4)}%` }}
          />
        </div>
        <span className="w-24 shrink-0 text-right font-mono text-xs text-text">{fmt(moneyIn)}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-32 shrink-0 text-xs font-medium text-text">Money going out</span>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-paper-line">
          <div
            className="h-full rounded-full bg-brass"
            style={{ width: `${Math.max((moneyOut / max) * 100, 4)}%` }}
          />
        </div>
        <span className="w-24 shrink-0 text-right font-mono text-xs text-text">{fmt(moneyOut)}</span>
      </div>
      <div className={`flex items-center gap-3 rounded-lg p-3 ${health.bg}`}>
        <span className={`font-display text-xl font-semibold ${health.text}`}>
          {surplus >= 0 ? "+" : "-"}
          {fmt(surplus)}
        </span>
        <span className="text-xs text-text-muted">
          <span className={`font-medium ${health.text}`}>{health.label}.</span> What&apos;s left
          over each month, after expenses.
        </span>
      </div>
    </div>
  );
}

export default async function StrategyPage() {
  const session = await auth();
  const strategy = await prisma.studentStrategy.findUnique({
    where: { userId: session!.user.id },
  });

  const doc = strategy?.content as unknown as StrategyDoc | undefined;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:px-10 sm:py-16">
      <Link
        href="/course"
        className="font-mono text-xs uppercase tracking-wide text-text-muted transition-colors hover:text-text"
      >
        ← Course home
      </Link>

      {!doc ? (
        <>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-brass">
            Your strategy
          </p>
          <h1 className="mt-2 font-display text-3xl text-text sm:text-4xl">
            Creative Money Strategy
          </h1>
          <p className="mt-6 text-sm text-text-muted">
            Complete the Creative Money Strategy Questionnaire at the end of the
            course to generate yours.
          </p>
        </>
      ) : (
        <article className="mt-8 space-y-10 text-sm leading-relaxed text-text">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brass">
                Your strategy
              </p>
              <h1 className="mt-2 font-display text-3xl text-text sm:text-4xl">{doc.title}</h1>
              <p className="mt-3 text-text-muted">{doc.oneLineSummary}</p>
            </div>
          </div>

          <a
            href="/api/strategy/pdf"
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-cream-text transition-colors hover:bg-ink-light"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
              <path
                d="M8 2v8m0 0L5 7m3 3l3-3M3 12.5h10"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download as PDF
          </a>

          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              Who you are
            </p>
            <div className="mt-3 space-y-3">
              {doc.whoYouAre.split(/\n\s*\n/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              The big idea
            </p>
            <h2 className="mt-2 font-display text-xl text-text">{doc.theBigIdea.heading}</h2>
            <div className="mt-3 space-y-3 rounded-lg border-l-2 border-brass bg-paper-raised px-5 py-4">
              {doc.theBigIdea.body.split(/\n\s*\n/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {doc.moneyPicture && (
            <section>
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                Your money picture
              </p>
              <div className="mt-3">
                <MoneyBarChart
                  currency={doc.moneyPicture.currency}
                  moneyIn={doc.moneyPicture.monthlyMoneyIn}
                  moneyOut={doc.moneyPicture.monthlyMoneyOut}
                />
                <p className="mt-3 text-text-muted">{doc.moneyPicture.note}</p>
              </div>
            </section>
          )}

          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              What to focus on
            </p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {(["now", "soon", "later"] as const).map((when) => (
                <div key={when}>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-text-muted">
                    <span className={`h-1.5 w-1.5 rounded-full ${WHEN_DOT[when]}`} />
                    {WHEN_LABEL[when]}
                  </span>
                  <div className="mt-2 space-y-2">
                    {doc.priorities
                      .filter((p) => p.when === when)
                      .map((p, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-paper-line bg-paper-raised p-3"
                        >
                          <p className="text-sm font-medium text-text">{p.name}</p>
                          <p className="mt-1 text-xs text-text-muted">{p.why}</p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              Your plan
            </p>
            <div className="mt-3 space-y-6">
              {doc.plan.map((phase, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brass font-mono text-xs font-medium text-ink">
                      {i + 1}
                    </span>
                    {i < doc.plan.length - 1 && (
                      <span className="mt-1 w-px flex-1 bg-paper-line" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="font-display text-lg text-text">{phase.phaseName}</p>
                    <p className="mt-0.5 text-xs italic text-text-muted">{phase.phaseGoal}</p>
                    <ul className="mt-3 space-y-1.5">
                      {phase.steps.map((step, j) => (
                        <li
                          key={j}
                          className={`flex gap-2 text-sm ${
                            step.isKeyStep ? "-mx-2 rounded-md bg-moss-light px-2 py-1" : ""
                          }`}
                        >
                          <span className="text-moss">{step.isKeyStep ? "★" : "•"}</span>
                          <span className={step.isKeyStep ? "font-semibold" : undefined}>
                            {step.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              Things to watch for
            </p>
            <div className="mt-3 space-y-3">
              {[...doc.thingsToWatch]
                .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "urgent" ? -1 : 1))
                .map((flag, i) => (
                  <div
                    key={i}
                    className={`rounded-lg px-4 py-3 ${
                      flag.severity === "urgent"
                        ? "border-l-2 border-[#a1522f] bg-paper-raised"
                        : "border-l-2 border-paper-line bg-paper-raised"
                    }`}
                  >
                    <span
                      className={`inline-block rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
                        flag.severity === "urgent"
                          ? "bg-[#a1522f] text-cream-text"
                          : "border border-paper-line text-text-muted"
                      }`}
                    >
                      {flag.severity === "urgent" ? "Fix this first" : "Keep an eye on this"}
                    </span>
                    <p className="mt-1.5 font-medium text-text">{flag.heading}</p>
                    <p className="mt-1 text-text-muted">{flag.body}</p>
                  </div>
                ))}
            </div>
          </section>

          <p className="border-t border-paper-line pt-6 text-center italic text-text-muted">
            {doc.closingNote}
          </p>
        </article>
      )}
    </div>
  );
}
