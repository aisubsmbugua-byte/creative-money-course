import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getModuleForUser } from "@/lib/access";
import { fetchDriveFile } from "@/lib/drive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { slug } = await params;
  const found = await getModuleForUser(session.user.id, slug);
  if (!found || found.module.status === "locked" || !found.module.videoDriveId) {
    return new NextResponse("Not found", { status: 404 });
  }

  const driveRes = await fetchDriveFile(found.module.videoDriveId, req.headers.get("range"));

  if (!driveRes.ok && driveRes.status !== 206) {
    return new NextResponse("Failed to load video", { status: 502 });
  }

  const headers = new Headers();
  headers.set("Content-Type", driveRes.headers.get("content-type") ?? "video/mp4");
  headers.set("Accept-Ranges", "bytes");
  const contentRange = driveRes.headers.get("content-range");
  if (contentRange) headers.set("Content-Range", contentRange);
  const contentLength = driveRes.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new NextResponse(driveRes.body, { status: driveRes.status, headers });
}
