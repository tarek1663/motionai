import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

if (ffmpegStatic) ffmpeg.setFfmpegPath(ffmpegStatic);

const TMP = process.env.TMP_DIR || "/tmp/motionai";

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    const proto = url.startsWith("https") ? https : http;
    proto
      .get(url, (res) => {
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

export async function renderFinalVideo(params: {
  jobId: string;
  clipUrls: string[];
  voicePath: string;
  musicPath?: string;
}): Promise<string> {
  const { jobId, clipUrls, voicePath, musicPath } = params;
  const workDir = path.join(TMP, jobId);
  fs.mkdirSync(workDir, { recursive: true });

  const clipPaths: string[] = [];
  for (let i = 0; i < clipUrls.length; i++) {
    const clipPath = path.join(workDir, `clip_${i}.mp4`);
    await downloadFile(clipUrls[i], clipPath);
    clipPaths.push(clipPath);
  }

  const concatFile = path.join(workDir, "concat.txt");
  fs.writeFileSync(concatFile, clipPaths.map((p) => `file '${p}'`).join("\n"));

  const concatenatedPath = path.join(workDir, "concatenated.mp4");
  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(concatFile)
      .inputOptions(["-f concat", "-safe 0"])
      .outputOptions(["-c:v libx264", "-preset fast", "-crf 22", "-an"])
      .output(concatenatedPath)
      .on("end", () => resolve())
      .on("error", reject)
      .run();
  });

  const outputPath = path.join(workDir, "final.mp4");
  await new Promise<void>((resolve, reject) => {
    const cmd = ffmpeg(concatenatedPath).input(voicePath);

    if (musicPath && fs.existsSync(musicPath)) {
      cmd
        .input(musicPath)
        .complexFilter([
          "[1:a]volume=1.0[voice]",
          "[2:a]volume=0.15,aloop=loop=-1:size=2e+09[music]",
          "[voice][music]amix=inputs=2:duration=first[audio_out]",
        ])
        .outputOptions([
          "-map 0:v",
          "-map [audio_out]",
          "-c:v copy",
          "-c:a aac",
          "-shortest",
          "-movflags +faststart",
        ]);
    } else {
      cmd.outputOptions([
        "-map 0:v",
        "-map 1:a",
        "-c:v copy",
        "-c:a aac",
        "-shortest",
        "-movflags +faststart",
      ]);
    }

    cmd
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", reject)
      .run();
  });

  return outputPath;
}

export function cleanupJob(jobId: string) {
  const workDir = path.join(TMP, jobId);
  if (fs.existsSync(workDir)) {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}
