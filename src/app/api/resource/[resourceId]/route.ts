import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getModuleForUser } from "@/lib/access";
import { fetchDriveFile } from "@/lib/drive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { resourceId } = await params;
  const resource = await prisma.moduleResource.findUnique({
    where: { id: resourceId },
    include: { module: true },
  });
  if (!resource) return new NextResponse("Not found", { status: 404 });

  const found = await getModuleForUser(session.user.id, resource.module.slug);
  if (!found || found.module.status === "locked") {
    return new NextResponse("Not found", { status: 404 });
  }

  const driveRes = await fetchDriveFile(resource.driveFileId, null);
  if (!driveRes.ok) {
    return new NextResponse("Failed to load file", { status: 502 });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    driveRes.headers.get("content-type") ?? "application/octet-stream",
  );
  headers.set("Content-Disposition", `attachment; filename="${resource.title}"`);
  const contentLength = driveRes.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new NextResponse(driveRes.body, { status: 200, headers });
}
