import { prisma } from "@/lib/prisma";

export const STRATEGY_QUESTIONNAIRE_SLUG = "creative-money-strategy-questionnaire";

export async function buildTranscriptsText(): Promise<string> {
  const modules = await prisma.module.findMany({
    where: { videoTranscript: { not: null } },
    orderBy: { order: "asc" },
    select: { title: true, videoTranscript: true },
  });

  return modules
    .map((m) => `## ${m.title}\n\n${m.videoTranscript}`)
    .join("\n\n---\n\n");
}

export async function buildStudentContextText(userId: string): Promise<string> {
  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    include: {
      workbook: {
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: {
              responses: { where: { userId } },
            },
          },
        },
      },
    },
  });

  const sections: string[] = [];
  for (const m of modules) {
    if (!m.workbook) continue;
    const answered = m.workbook.questions
      .map((q) => {
        const answer = q.responses[0]?.answer;
        if (!answer) return null;
        return `Q: ${q.prompt}\nA: ${answer}`;
      })
      .filter((x): x is string => Boolean(x));
    if (answered.length === 0) continue;
    sections.push(`### ${m.title}\n\n${answered.join("\n\n")}`);
  }

  return sections.join("\n\n---\n\n");
}
