import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getModuleForUser } from "@/lib/access";
import { markVideoWatched, submitWorkbook } from "@/app/course/actions";
import { VideoPlayer } from "@/app/course/[slug]/VideoPlayer";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const found = await getModuleForUser(session!.user.id, slug);

  if (!found) notFound();
  if (found.module.status === "locked") redirect("/course");

  const { module, index, all } = found;
  const nextModule = all[index + 1];
  const onMarkWatched = markVideoWatched.bind(null, module.id, slug);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:px-10 sm:py-16">
      <Link
        href="/course"
        className="font-mono text-xs uppercase tracking-wide text-text-muted transition-colors hover:text-text"
      >
        ← Course home
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
          {String(index + 1).padStart(2, "0")} / {String(all.length).padStart(2, "0")}
        </span>
        {module.status === "completed" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-moss-light px-2.5 py-0.5 font-mono text-xs uppercase tracking-wide text-moss">
            Sealed
          </span>
        )}
      </div>

      <h1 className="mt-3 font-display text-3xl text-text sm:text-4xl">
        {module.title}
      </h1>

      {module.description && (
        <div className="mt-6 rounded-lg border-l-2 border-brass bg-paper-raised px-5 py-4">
          <p className="font-mono text-xs uppercase tracking-widest text-brass">
            What to expect
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
            {module.description}
          </p>
        </div>
      )}

      <section className="mt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
          Lesson
        </p>
        <div className="mt-3">
          {module.videoDriveId ? (
            <VideoPlayer
              src={`/api/stream/${slug}`}
              initiallyWatched={module.videoDone}
              onMarkWatched={onMarkWatched}
            />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-paper-line text-sm text-text-muted">
              Video coming soon
            </div>
          )}
        </div>
      </section>

      {module.resources.length > 0 && (
        <section className="mt-8">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
            Resources
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {module.resources.map((r) => (
              <li key={r.id}>
                <a
                  href={`/api/resource/${r.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-paper-line bg-paper-raised px-3.5 py-2 text-sm text-text transition-colors hover:border-brass hover:text-brass"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                    <path
                      d="M8 2v8m0 0L5 7m3 3l3-3M3 12.5h10"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {module.workbook && (() => {
        const questionIds = new Set(module.workbook.questions.map((q) => q.id));
        return (
        <section className="mt-12 border-t border-paper-line pt-10">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              Workbook
            </p>
            {module.workbookDone && (
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-moss">
                Saved
              </span>
            )}
          </div>
          <h2 className="mt-2 font-display text-xl text-text">
            {module.workbook.title}
          </h2>

          <form
            action={async (formData: FormData) => {
              "use server";
              const answers: Record<string, string> = {};
              for (const [key, value] of formData.entries()) {
                if (questionIds.has(key) && typeof value === "string") {
                  answers[key] = value;
                }
              }
              await submitWorkbook(module.id, slug, answers);
            }}
            className="mt-6 space-y-6"
          >
            {module.workbook.questions
              .sort((a, b) => a.order - b.order)
              .map((q, i) => (
                <div
                  key={q.id}
                  className="rounded-lg border border-paper-line bg-paper-raised p-5"
                >
                  <label className="flex gap-3 text-sm font-medium text-text">
                    <span className="font-mono text-text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{q.prompt}</span>
                  </label>
                  {q.type === "SHORT_TEXT" ? (
                    <input
                      type="text"
                      name={q.id}
                      required={q.required}
                      className="mt-3 w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm text-text focus:border-brass focus:outline-none"
                    />
                  ) : q.type === "CHECKBOX" ? (
                    <label className="mt-3 flex items-center gap-2 text-sm text-text-muted">
                      <input
                        type="checkbox"
                        name={q.id}
                        required={q.required}
                        className="h-4 w-4 accent-brass"
                      />
                      Done
                    </label>
                  ) : (
                    <textarea
                      name={q.id}
                      required={q.required}
                      rows={4}
                      className="mt-3 w-full rounded-md border border-paper-line bg-white px-3 py-2 text-sm text-text focus:border-brass focus:outline-none"
                    />
                  )}
                </div>
              ))}

            <button
              type="submit"
              className="rounded-lg bg-brass px-5 py-3 font-sans text-sm font-medium text-ink transition-colors hover:bg-brass-light"
            >
              {module.workbookDone ? "Update my answers" : "Save my answers"}
            </button>
          </form>
        </section>
        );
      })()}

      {module.status === "completed" && nextModule && (
        <div className="mt-12 border-t border-paper-line pt-8">
          <Link
            href={`/course/${nextModule.slug}`}
            className="group flex items-center justify-between rounded-lg border border-paper-line bg-paper-raised px-5 py-4 transition-colors hover:border-brass"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                Next up
              </p>
              <p className="mt-1 font-display text-lg text-text">{nextModule.title}</p>
            </div>
            <svg
              viewBox="0 0 16 16"
              className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-brass"
              fill="none"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
