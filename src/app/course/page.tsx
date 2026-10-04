import Link from "next/link";
import { auth } from "@/lib/auth";
import { getModulesWithStatus } from "@/lib/access";

export default async function CoursePage() {
  const session = await auth();
  const modules = await getModulesWithStatus(session!.user.id);

  const completedCount = modules.filter((m) => m.status === "completed").length;
  const currentModule = modules.find((m) => m.status !== "completed");
  const allDone = !currentModule && modules.length > 0;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-10">
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
          ? "Every module is sealed. Revisit any lesson from the list on the left whenever you need to."
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
    </div>
  );
}
