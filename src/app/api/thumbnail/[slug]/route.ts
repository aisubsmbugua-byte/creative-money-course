import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchDriveThumbnail } from "@/lib/drive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { slug } = await params;
  const courseModule = await prisma.module.findUnique({ where: { slug } });
  if (!courseModule?.videoDriveId) {
    return new NextResponse("Not found", { status: 404 });
  }

  const driveRes = await fetchDriveThumbnail(courseModule.videoDriveId);
  if (!driveRes.ok) {
    return new NextResponse("Failed to load thumbnail", { status: 502 });
  }

  const headers = new Headers();
  headers.set("Content-Type", driveRes.headers.get("content-type") ?? "image/jpeg");
  headers.set("Cache-Control", "private, max-age=86400");

  return new NextResponse(driveRes.body, { status: 200, headers });
}
