import Link from "next/link";
import { auth } from "@/lib/auth";
import { getModulesWithStatus, type ModuleWithStatus } from "@/lib/access";

function StatusBadge({ status }: { status: ModuleWithStatus["status"] }) {
  if (status === "completed") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-moss-light px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-moss">
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
          <path
            d="M3 8.5L6.2 11.5L13 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Sealed
      </span>
    );
  }
  if (status === "unlocked") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brass px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-brass">
        In progress
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-paper-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-text-muted">
      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
        <rect x="4" y="7" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.3" />
      </svg>
      Locked
    </span>
  );
}

export default async function CoursePage() {
  const session = await auth();
  const modules = await getModulesWithStatus(session!.user.id);

  const completedCount = modules.filter((m) => m.status === "completed").length;
  const currentModule = modules.find((m) => m.status !== "completed");
  const allDone = !currentModule && modules.length > 0;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
      <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
        Creative Money
      </p>
      <h1 className="mt-2 font-display text-4xl text-text">
        {allDone
          ? "You've completed the course"
          : completedCount === 0
            ? "Welcome back"
            : "Keep going"}
      </h1>
      <p className="mt-3 text-text-muted">
        {allDone
          ? "Every module is sealed. Revisit any lesson below whenever you need to."
          : currentModule
              ? `You're on ${currentModule.title}. ${completedCount} of ${modules.length} modules complete so far.`
              : "Your modules will appear here once they're ready."}
      </p>

      {currentModule && (
        <Link
          href={`/course/${currentModule.slug}`}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-3 font-sans text-sm font-medium text-cream-text transition-colors hover:bg-ink-light"
        >
          {completedCount === 0 ? "Start" : "Continue"}: {currentModule.title}
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}

      <div className="mt-12 border-t border-paper-line pt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
          All modules
        </p>
        <ol className="mt-4 space-y-2">
          {modules.map((m, i) => {
            const locked = m.status === "locked";
            const row = (
              <div
                className={`flex items-center gap-4 rounded-lg border border-paper-line bg-paper-raised p-3 transition-colors ${
                  locked ? "" : "hover:border-brass"
                }`}
              >
                <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md bg-ink">
                  {m.videoDriveId && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/thumbnail/${m.slug}`}
                      alt=""
                      className={`h-full w-full object-cover ${locked ? "opacity-40 grayscale" : ""}`}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p
                    className={`truncate font-display text-base ${
                      locked ? "text-text-muted" : "text-text"
                    }`}
                  >
                    {m.title}
                  </p>
                </div>
                <StatusBadge status={m.status} />
              </div>
            );

            return (
              <li key={m.id}>
                {locked ? row : <Link href={`/course/${m.slug}`}>{row}</Link>}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
