import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getModulesWithStatus, type ModuleWithStatus } from "@/lib/access";
import { signOutAction } from "@/app/course/actions";

function Seal({ status }: { status: ModuleWithStatus["status"] }) {
  if (status === "completed") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-moss text-cream-text">
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
          <path
            d="M3 8.5L6.2 11.5L13 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (status === "unlocked") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-brass">
        <span className="h-1.5 w-1.5 rounded-full bg-brass" />
      </span>
    );
  }
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink-line text-cream-text-muted">
      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
        <rect x="4" y="7" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    </span>
  );
}

function ModuleList({
  modules,
  currentIndex,
}: {
  modules: ModuleWithStatus[];
  currentIndex: number;
}) {
  return (
    <nav className="flex flex-col gap-0.5">
      {modules.map((m, i) => {
        const locked = m.status === "locked";
        const isNextUp = locked && i === currentIndex + 1;
        const row = (
          <div
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
              i === currentIndex
                ? "bg-ink-light"
                : locked
                  ? ""
                  : "hover:bg-ink-light"
            }`}
          >
            <Seal status={m.status} />
            <div className="min-w-0">
              <p
                className={`truncate font-sans text-sm ${
                  locked ? "text-cream-text-muted" : "text-cream-text"
                }`}
              >
                {m.title}
              </p>
              {isNextUp && (
                <p className="mt-0.5 truncate font-mono text-xs uppercase tracking-wide text-cream-text-muted">
                  Unlocks after {modules[currentIndex].title}
                </p>
              )}
            </div>
          </div>
        );

        return (
          <div key={m.id}>
            {locked ? row : <Link href={`/course/${m.slug}`}>{row}</Link>}
          </div>
        );
      })}
    </nav>
  );
}

export default async function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const modules = await getModulesWithStatus(session!.user.id);
  const strategy = await prisma.studentStrategy.findUnique({
    where: { userId: session!.user.id },
    select: { id: true },
  });
  const completedCount = modules.filter((m) => m.status === "completed").length;
  const pct = modules.length ? Math.round((completedCount / modules.length) * 100) : 0;
  const currentIndex = modules.findIndex((m) => m.status !== "completed");

  const header = (
    <div>
      <p className="font-display text-2xl text-cream-text">Creative Money</p>
      <p className="mt-1 font-mono text-xs font-medium uppercase tracking-wider text-cream-text-muted">
        with Kanjii Mbugua
      </p>
    </div>
  );

  const progress = (
    <div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-ink-light">
        <div
          className="h-full rounded-full bg-brass transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 font-mono text-xs text-cream-text-muted">
        {completedCount} / {modules.length} complete
      </p>
    </div>
  );

  const strategyLink = strategy && (
    <Link
      href="/course/strategy"
      className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brass transition-colors hover:text-brass-light"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
        <path
          d="M3 2.5h7l3 3v8a.5.5 0 0 1-.5.5h-9.5a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5z"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path d="M5.5 8h5M5.5 10.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      My strategy
    </Link>
  );

  const signOut = (
    <form action={signOutAction}>
      <button
        type="submit"
        className="font-mono text-xs uppercase tracking-wider text-cream-text-muted transition-colors hover:text-cream-text"
      >
        Sign out
      </button>
    </form>
  );

  return (
    <div className="flex flex-col lg:h-screen lg:flex-row lg:overflow-hidden">
      <header className="border-b border-ink-line bg-ink px-5 py-4 lg:hidden">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            {header}
            <svg
              viewBox="0 0 16 16"
              className="h-4 w-4 shrink-0 text-cream-text-muted transition-transform group-open:rotate-180"
              fill="none"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </summary>
          <div className="mt-4 flex flex-col gap-4">
            {progress}
            <ModuleList modules={modules} currentIndex={currentIndex} />
            {strategyLink}
            {signOut}
          </div>
        </details>
      </header>

      <aside className="hidden shrink-0 bg-ink lg:block lg:w-80 lg:overflow-y-auto">
        <div className="flex min-h-full flex-col gap-6 p-6">
          {header}
          {progress}
          {modules.length === 0 ? (
            <p className="font-mono text-xs text-cream-text-muted">
              No modules yet.
            </p>
          ) : (
            <ModuleList modules={modules} currentIndex={currentIndex} />
          )}
          <div className="mt-auto flex flex-col gap-3 pt-6">
            {strategyLink}
            {signOut}
          </div>
        </div>
      </aside>

      <main className="flex-1 bg-paper lg:overflow-y-auto">{children}</main>
    </div>
  );
}
