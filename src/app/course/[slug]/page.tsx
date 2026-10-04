import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getModuleForUser } from "@/lib/access";
import { markVideoWatched, submitWorkbook } from "@/app/course/actions";

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

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/course" className="text-sm text-neutral-500 hover:underline">
        ← All modules
      </Link>

      <p className="mt-4 text-xs uppercase tracking-wide text-neutral-400">
        Module {index + 1}
      </p>
      <h1 className="text-2xl font-semibold text-neutral-900">
        {module.title}
      </h1>
      {module.description && (
        <p className="mt-2 text-sm text-neutral-600">{module.description}</p>
      )}

      <section className="mt-8">
        {module.videoDriveId ? (
          <div className="aspect-video overflow-hidden rounded-lg border border-neutral-200 bg-black">
            <video
              controls
              preload="metadata"
              className="h-full w-full"
              src={`/api/stream/${slug}`}
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-neutral-300 text-sm text-neutral-400">
            Video coming soon
          </div>
        )}

        <form
          action={async () => {
            "use server";
            await markVideoWatched(module.id, slug);
          }}
          className="mt-4"
        >
          <button
            type="submit"
            disabled={module.videoDone}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {module.videoDone ? "Video watched ✓" : "Mark video as watched"}
          </button>
        </form>
      </section>

      {module.resources.length > 0 && (
        <section className="mt-8 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm font-medium text-neutral-800">Resources</p>
          <ul className="mt-2 space-y-1">
            {module.resources.map((r) => (
              <li key={r.id}>
                <a
                  href={`/api/resource/${r.id}`}
                  className="text-sm text-neutral-600 underline hover:text-neutral-900"
                >
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {module.workbook && (
        <section className="mt-12 border-t border-neutral-200 pt-8">
          <h2 className="text-lg font-semibold text-neutral-900">
            {module.workbook.title}
          </h2>

          <form
            action={async (formData: FormData) => {
              "use server";
              const answers: Record<string, string> = {};
              for (const [key, value] of formData.entries()) {
                if (typeof value === "string") answers[key] = value;
              }
              await submitWorkbook(module.id, slug, answers);
            }}
            className="mt-4 space-y-5"
          >
            {module.workbook.questions
              .sort((a, b) => a.order - b.order)
              .map((q) => (
                <div key={q.id}>
                  <label className="block text-sm font-medium text-neutral-800">
                    {q.prompt}
                  </label>
                  {q.type === "SHORT_TEXT" ? (
                    <input
                      type="text"
                      name={q.id}
                      required={q.required}
                      className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    />
                  ) : q.type === "CHECKBOX" ? (
                    <input
                      type="checkbox"
                      name={q.id}
                      required={q.required}
                      className="mt-2"
                    />
                  ) : (
                    <textarea
                      name={q.id}
                      required={q.required}
                      rows={4}
                      className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    />
                  )}
                </div>
              ))}

            <button
              type="submit"
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
            >
              {module.workbookDone ? "Update workbook" : "Submit workbook"}
            </button>
          </form>
        </section>
      )}

      {module.status === "completed" && nextModule && (
        <div className="mt-10">
          <Link
            href={`/course/${nextModule.slug}`}
            className="text-sm font-medium text-neutral-900 hover:underline"
          >
            Next: {nextModule.title} →
          </Link>
        </div>
      )}
    </div>
  );
}
