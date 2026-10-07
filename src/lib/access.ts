import { prisma } from "@/lib/prisma";

export type ModuleStatus = "locked" | "unlocked" | "completed";

export type ModuleWithStatus = Awaited<
  ReturnType<typeof getModulesWithStatus>
>[number];

export async function getModulesWithStatus(userId: string) {
  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    include: {
      workbook: { include: { questions: true } },
      resources: true,
      progress: { where: { userId } },
    },
  });

  let previousComplete = true;

  return modules.map((module) => {
    const progress = module.progress[0];
    const videoDone = module.videoDriveId
      ? Boolean(progress?.videoWatchedAt)
      : true;
    const workbookDone = module.workbook
      ? Boolean(progress?.workbookCompletedAt)
      : true;
    const isComplete = videoDone && workbookDone;

    const status: ModuleStatus = isComplete
      ? "completed"
      : previousComplete
        ? "unlocked"
        : "locked";

    previousComplete = isComplete;

    return {
      ...module,
      status,
      videoDone,
      workbookDone,
    };
  });
}

export async function getModuleForUser(userId: string, slug: string) {
  const modules = await getModulesWithStatus(userId);
  const index = modules.findIndex((m) => m.slug === slug);
  if (index === -1) return null;
  return { module: modules[index], index, all: modules };
}
