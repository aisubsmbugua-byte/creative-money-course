"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getModuleForUser } from "@/lib/access";

export async function signOutAction() {
  await signOut({ redirect: false });
  redirect("/login");
}

export async function markVideoWatched(moduleId: string, slug: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const found = await getModuleForUser(session.user.id, slug);
  if (!found || found.module.id !== moduleId || found.module.status === "locked") {
    throw new Error("Module is locked");
  }

  await prisma.moduleProgress.upsert({
    where: { userId_moduleId: { userId: session.user.id, moduleId } },
    create: { userId: session.user.id, moduleId, videoWatchedAt: new Date(), videoPosition: 0 },
    update: { videoWatchedAt: new Date(), videoPosition: 0 },
  });

  revalidatePath(`/course/${slug}`);
  revalidatePath("/course");
}

export async function saveVideoPosition(moduleId: string, slug: string, seconds: number) {
  const session = await auth();
  if (!session?.user?.id) return;

  const found = await getModuleForUser(session.user.id, slug);
  if (!found || found.module.id !== moduleId || found.module.status === "locked") return;

  const position = Math.max(0, Math.floor(seconds));

  await prisma.moduleProgress.upsert({
    where: { userId_moduleId: { userId: session.user.id, moduleId } },
    create: { userId: session.user.id, moduleId, videoPosition: position },
    update: { videoPosition: position },
  });
}

export async function submitWorkbook(
  moduleId: string,
  slug: string,
  answers: Record<string, string>,
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const found = await getModuleForUser(session.user.id, slug);
  if (!found || found.module.id !== moduleId || found.module.status === "locked") {
    throw new Error("Module is locked");
  }

  const workbook = found.module.workbook;
  if (!workbook) throw new Error("This module has no workbook");

  await prisma.$transaction([
    ...Object.entries(answers).map(([questionId, answer]) =>
      prisma.workbookResponse.upsert({
        where: { userId_questionId: { userId: session.user!.id!, questionId } },
        create: { userId: session.user!.id!, questionId, answer },
        update: { answer },
      }),
    ),
    prisma.moduleProgress.upsert({
      where: { userId_moduleId: { userId: session.user.id, moduleId } },
      create: {
        userId: session.user.id,
        moduleId,
        workbookCompletedAt: new Date(),
      },
      update: { workbookCompletedAt: new Date() },
    }),
  ]);

  revalidatePath(`/course/${slug}`);
  revalidatePath("/course");
}
