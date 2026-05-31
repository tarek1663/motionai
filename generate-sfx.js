const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "public", "sfx");

const sounds = [
  {
    name: "whoosh",
    cmd: `ffmpeg -f lavfi -i "sine=frequency=800:duration=0.12" -af "afade=t=in:st=0:d=0.02,afade=t=out:st=0.08:d=0.04,volume=0.15,highpass=f=400,lowpass=f=2000" -ar 44100 "${path.join(outDir, "whoosh.mp3")}" -y`,
  },
  {
    name: "click",
    cmd: `ffmpeg -f lavfi -i "sine=frequency=1200:duration=0.06" -af "afade=t=in:st=0:d=0.005,afade=t=out:st=0.02:d=0.04,volume=0.12" -ar 44100 "${path.join(outDir, "click.mp3")}" -y`,
  },
  {
    name: "ding",
    cmd: `ffmpeg -f lavfi -i "sine=frequency=1046:duration=0.3" -af "afade=t=in:st=0:d=0.01,afade=t=out:st=0.15:d=0.15,volume=0.1" -ar 44100 "${path.join(outDir, "ding.mp3")}" -y`,
  },
  {
    name: "swoosh",
    cmd: `ffmpeg -f lavfi -i "sine=frequency=600:duration=0.18" -af "afade=t=in:st=0:d=0.03,afade=t=out:st=0.1:d=0.08,volume=0.12,highpass=f=300" -ar 44100 "${path.join(outDir, "swoosh.mp3")}" -y`,
  },
];

fs.mkdirSync(outDir, { recursive: true });

sounds.forEach((s) => {
  console.log(`Generating ${s.name}...`);
  try {
    execSync(s.cmd, { stdio: "inherit" });
    console.log(`✅ ${s.name}.mp3 generated`);
  } catch (err) {
    console.error(`❌ ${s.name} failed:`, err.message);
  }
});
