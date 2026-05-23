const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const RENDERS_DIR = path.join(__dirname, "renders");
fs.mkdirSync(RENDERS_DIR, { recursive: true });

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Lancer un rendu
app.post("/render", async (req, res) => {
  const jobId = uuidv4();
  const {
    scenes,
    sceneDurations,
    totalFrames,
    format,
    audioUrl,
    musicUrl,
    musicVolume,
    prompt,
    duration,
    accentColor,
    formatName,
  } = req.body;

  const outPath = path.join(RENDERS_DIR, `${jobId}.mp4`);
  const metaPath = path.join(RENDERS_DIR, `${jobId}.meta.json`);
  const errPath = path.join(RENDERS_DIR, `${jobId}.error`);

  // Sauvegarder les metadata
  fs.writeFileSync(
    metaPath,
    JSON.stringify({
      prompt,
      format,
      duration,
      accentColor,
      formatName,
    })
  );

  // Sauvegarder les props
  const propsPath = path.join(RENDERS_DIR, `${jobId}.props.json`);
  fs.writeFileSync(
    propsPath,
    JSON.stringify({
      scenes,
      sceneDurations,
      totalFrames,
      format: format || "9:16",
      audioSrc: audioUrl || null,
      musicSrc: musicUrl || null,
      musicVolume: musicVolume || 0.07,
    })
  );

  const getDimensions = (fmt) => {
    if (fmt === "16:9") return { width: 1920, height: 1080 };
    if (fmt === "1:1") return { width: 1080, height: 1080 };
    return { width: 1080, height: 1920 };
  };
  const { width, height } = getDimensions(format || "9:16");

  const cmd = [
    "npx remotion render",
    "../remotion/Root.tsx",
    "MotionVideo",
    `"${outPath}"`,
    `--props="${propsPath}"`,
    `--width=${width}`,
    `--height=${height}`,
    "--codec=h264",
    "--crf=18",
  ].join(" ");

  // Lancer le rendu en arrière-plan
  exec(
    cmd,
    {
      cwd: path.join(__dirname, ".."),
      maxBuffer: 1024 * 1024 * 500,
    },
    (err) => {
      if (err) {
        fs.writeFileSync(errPath, err.message);
      }
    }
  );

  res.json({ jobId });
});

// Status du rendu
app.get("/render/:jobId", (req, res) => {
  const { jobId } = req.params;
  const outPath = path.join(RENDERS_DIR, `${jobId}.mp4`);
  const errPath = path.join(RENDERS_DIR, `${jobId}.error`);

  if (fs.existsSync(errPath)) {
    return res.json({ status: "error", error: fs.readFileSync(errPath, "utf-8") });
  }

  if (fs.existsSync(outPath)) {
    const videoUrl = `${process.env.RENDER_SERVER_URL}/video/${jobId}.mp4`;
    return res.json({ status: "done", videoUrl });
  }

  res.json({ status: "rendering" });
});

// Récupérer les metadata
app.get("/meta/:jobId", (req, res) => {
  const metaPath = path.join(RENDERS_DIR, `${req.params.jobId}.meta.json`);
  if (fs.existsSync(metaPath)) {
    return res.json(JSON.parse(fs.readFileSync(metaPath, "utf-8")));
  }
  res.json({});
});

// Servir les vidéos
app.use("/video", express.static(RENDERS_DIR));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🎬 Render server running on port ${PORT}`);
});
