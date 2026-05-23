import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getErrorMessage } from "@/lib/utils";

function runRender(propsPath: string, outputPath: string, cwd: string, width: number, height: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const cmd = [
      "npx remotion render",
      "remotion/Root.tsx",
      "MotionVideo",
      `"${outputPath}"`,
      `--props="${propsPath}"`,
      `--width=${width}`,
      `--height=${height}`,
      "--codec=h264",
      "--crf=16",
      "--jpeg-quality=100",
      "--scale=1",
    ].join(" ");
    exec(cmd, { cwd, maxBuffer: 1024 * 1024 * 500 }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || err.message));
      else resolve();
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const { scenes, sceneDurations, totalFrames, format, audioUrl, musicUrl, musicVolume, prompt, duration, accentColor, formatName } = await req.json();

    console.log("📐 Format reçu:", format);

    const getDimensions = (fmt: string) => {
      if (fmt === "16:9") return { width: 1920, height: 1080 };
      if (fmt === "1:1")  return { width: 1080, height: 1080 };
      return { width: 1080, height: 1920 }; // 9:16
    };

    const { width, height } = getDimensions(format || "9:16");
    console.log("📐 Dimensions:", width, "x", height);

    if (!scenes?.length) return NextResponse.json({ error: "Scenes requis" }, { status: 400 });

    const jobId   = uuidv4();
    const outDir  = path.join(process.cwd(), "public", "renders");
    const outPath = path.join(outDir, `${jobId}.mp4`);
    const propsPath = path.join(outDir, `${jobId}.json`);
    fs.mkdirSync(outDir, { recursive: true });

    const props = {
      scenes,
      sceneDurations: sceneDurations || scenes.map(() => Math.round(totalFrames / scenes.length)),
      totalFrames: totalFrames || (scenes.length * 120),
      audioSrc: audioUrl || null,
      musicSrc: musicUrl || null,
      musicVolume: musicVolume || 0.12,
      format: format || "9:16",
    };
    console.log("🎵 musicSrc dans props:", props.musicSrc);
    console.log("🎵 musicVolume:", props.musicVolume);
    fs.writeFileSync(propsPath, JSON.stringify(props));

    const jobMeta = {
      prompt:      prompt      || "",
      format:      format      || "9:16",
      duration:    duration    || 30,
      audioUrl:    audioUrl    || null,
      accentColor: scenes?.[0]?.accentColor || null,
      formatName:  formatName  || null,
    };

    const metaPath = path.join(outDir, `${jobId}.meta.json`);
    fs.writeFileSync(metaPath, JSON.stringify(jobMeta));
    console.log("📝 Meta écrit:", metaPath, JSON.stringify(jobMeta).slice(0, 100));

    (async () => {
      try {
        await runRender(propsPath, outPath, process.cwd(), width, height);
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        console.error("Render error:", message);
        fs.writeFileSync(path.join(outDir, `${jobId}.error`), message);
      } finally {
        if (fs.existsSync(propsPath)) fs.unlinkSync(propsPath);
      }
    })();

    return NextResponse.json({ jobId, status: "rendering" });
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
