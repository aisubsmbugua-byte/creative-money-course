import Link from "next/link";
import { auth } from "@/lib/auth";
import { getModulesWithStatus } from "@/lib/access";

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  unlocked: "In progress",
  locked: "Locked",
};

export default async function CoursePage() {
  const session = await auth();
  const modules = await getModulesWithStatus(session!.user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold text-neutral-900">
        Creative Money
      </h1>

      {modules.length === 0 && (
        <p className="text-sm text-neutral-500">
          Course content is being added. Check back soon.
        </p>
      )}

      <ol className="space-y-3">
        {modules.map((module, i) => {
          const locked = module.status === "locked";
          const content = (
            <div
              className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                locked
                  ? "border-neutral-200 bg-neutral-50 text-neutral-400"
                  : "border-neutral-200 bg-white hover:border-neutral-400"
              }`}
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">
                  Module {i + 1}
                </p>
                <p className="font-medium">{module.title}</p>
              </div>
              <span className="text-xs text-neutral-500">
                {STATUS_LABEL[module.status]}
              </span>
            </div>
          );

          return (
            <li key={module.id}>
              {locked ? (
                content
              ) : (
                <Link href={`/course/${module.slug}`}>{content}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
