import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderStrategyPdf } from "@/lib/strategy-pdf";
import type { StrategyDoc } from "@/lib/strategy-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const strategy = await prisma.studentStrategy.findUnique({
    where: { userId: session.user.id },
  });
  if (!strategy) return new NextResponse("Not found", { status: 404 });

  const doc = strategy.content as unknown as StrategyDoc;
  const studentName = session.user.name || session.user.email || "You";
  const pdf = await renderStrategyPdf(doc, studentName, strategy.updatedAt);

  return new NextResponse(pdf as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Creative Money Strategy.pdf"`,
    },
  });
}
