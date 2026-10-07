import { GoogleAuth } from "google-auth-library";
import { readFileSync, writeFileSync, unlinkSync, existsSync, statSync } from "fs";
import { execFileSync } from "child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const env = Object.fromEntries(
  readFileSync(".env", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1).replace(/^"|"$/g, "")];
    }),
);

const auth = new GoogleAuth({
  credentials: {
    client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const MODEL = "mlx-community/whisper-large-v3-turbo";
const PATH_WITH_TOOLS = `/tmp/ffmpeg-bin:/Users/kanjii/Library/Python/3.9/bin:${process.env.PATH}`;

async function downloadVideo(fileId, destPath) {
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) throw new Error(`Drive download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(destPath, buf);
}

async function main() {
  const modules = await prisma.module.findMany({
    where: { videoDriveId: { not: null }, videoTranscript: null },
    orderBy: { order: "asc" },
  });

  console.log(`${modules.length} module(s) need transcription.\n`);

  for (const m of modules) {
    const t0 = Date.now();
    console.log(`=== ${m.title} (${m.slug}) ===`);

    const videoPath = `/tmp/transcribe-${m.id}.mp4`;
    const wavPath = `/tmp/transcribe-${m.id}.wav`;
    const txtPath = `/tmp/transcribe-${m.id}.txt`;

    try {
      console.log("  downloading...");
      await downloadVideo(m.videoDriveId, videoPath);
      console.log(`  downloaded (${(statSync(videoPath).size / 1e6).toFixed(0)}MB)`);

      console.log("  extracting audio...");
      execFileSync(
        "/tmp/ffmpeg-bin/ffmpeg",
        ["-y", "-i", videoPath, "-vn", "-ar", "16000", "-ac", "1", "-f", "wav", wavPath],
        { stdio: ["ignore", "ignore", "ignore"] },
      );
      unlinkSync(videoPath);

      console.log("  transcribing (this is the slow part)...");
      execFileSync(
        "mlx_whisper",
        [wavPath, "--model", MODEL, "--output-format", "txt", "--output-dir", "/tmp", "--output-name", `transcribe-${m.id}`],
        { env: { ...process.env, PATH: PATH_WITH_TOOLS }, stdio: ["ignore", "ignore", "ignore"] },
      );
      unlinkSync(wavPath);

      const transcript = existsSync(txtPath) ? readFileSync(txtPath, "utf8").trim() : "";
      unlinkSync(txtPath);

      await prisma.module.update({
        where: { id: m.id },
        data: { videoTranscript: transcript || null },
      });

      const mins = ((Date.now() - t0) / 60000).toFixed(1);
      console.log(`  done in ${mins}min — ${transcript.length} chars\n`);
    } catch (err) {
      console.error(`  FAILED: ${err.message}\n`);
      for (const p of [videoPath, wavPath, txtPath]) {
        if (existsSync(p)) unlinkSync(p);
      }
    }
  }

  console.log("All done.");
  await prisma.$disconnect();
}

main();
