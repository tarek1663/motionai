import fs from "fs";
import path from "path";
import https from "https";

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: { "User-Agent": "Mozilla/5.0" }
    };
    https.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        downloadFile(response.headers.location!, dest).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// URLs directes GitHub raw — animations Lottie vérifiées
const LOTTIE_LIBRARY = [
  // ICÔNES
  { id: "icons/rocket", url: "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/adg-player/animation/LottieLogo1.json" },
  { id: "icons/checkmark", url: "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/adg-player/animation/LottieLogo2.json" },

  // DÉCORATIFS
  { id: "decorative/confetti", url: "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/adg-player/animation/LottieLogo3.json" },
];

// On va plutôt créer des animations Lottie synthétiques valides
const SYNTHETIC_LOTTIE: Record<string, object> = {
  "icons/rocket": createLottie("rocket", "#ff8c00"),
  "icons/checkmark": createLottie("check", "#30d158"),
  "icons/trophy": createLottie("trophy", "#ff9f0a"),
  "icons/star-rating": createLottie("star", "#ff9f0a"),
  "icons/crown": createLottie("crown", "#ff9f0a"),
  "icons/money": createLottie("money", "#30d158"),
  "icons/target": createLottie("target", "#ff2d55"),
  "icons/thumbs-up": createLottie("thumbs", "#2997ff"),
  "icons/fire-emoji": createLottie("fire", "#ff6b00"),
  "decorative/confetti": createParticleLottie("#ff2d55"),
  "decorative/stars": createParticleLottie("#ff9f0a"),
  "decorative/sparkle": createParticleLottie("#ffffff"),
  "decorative/particles": createParticleLottie("#2997ff"),
  "decorative/energy-wave": createWaveLottie("#30d158"),
  "decorative/music-wave": createWaveLottie("#bf5af2"),
  "decorative/heartbeat": createWaveLottie("#ff2d55"),
  "data/progress-bar": createProgressLottie("#2997ff"),
  "data/graph-up": createGraphLottie("#30d158"),
  "tech/network": createNetworkLottie("#2997ff"),
  "tech/circuit": createNetworkLottie("#30d158"),
  "social/like-heart": createLottie("heart", "#ff2d55"),
  "social/notification": createLottie("bell", "#ff9f0a"),
  "cta/arrow-right": createArrowLottie("#ffffff"),
  "cta/swipe-up": createArrowLottie("#2997ff"),
};

function createLottie(type: string, color: string): object {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  return {
    v: "5.9.0",
    fr: 60,
    ip: 0,
    op: 120,
    w: 200,
    h: 200,
    nm: type,
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0, ind: 1, ty: 4, nm: type, sr: 1,
        ks: {
          o: { a: 1, k: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0] }, { t: 20, s: [100] }] },
          r: { a: 1, k: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0] }, { t: 60, s: [360] }] },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0, 0, 100] }, { t: 20, s: [100, 100, 100] }] },
        },
        ao: 0, ip: 0, op: 120, st: 0, bm: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "el", s: { a: 0, k: [80, 80] }, p: { a: 0, k: [0, 0] } },
              { ty: "fl", c: { a: 0, k: [r, g, b, 1] }, o: { a: 0, k: 100 } },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
          },
        ],
      },
    ],
  };
}

function createParticleLottie(color: string): object {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const particles = Array.from({ length: 8 }, (_, i) => ({
    ddd: 0, ind: i + 1, ty: 4, nm: `particle_${i}`, sr: 1,
    ks: {
      o: { a: 1, k: [{ t: 0, s: [0] }, { t: 10, s: [100] }, { t: 90, s: [100] }, { t: 120, s: [0] }] },
      p: {
        a: 1, k: [
          { t: 0, s: [100, 100, 0], i: { x: 0.5, y: 1 }, o: { x: 0.5, y: 0 } },
          { t: 120, s: [100 + Math.cos(i * 45 * Math.PI / 180) * 80, 100 + Math.sin(i * 45 * Math.PI / 180) * 80, 0] }
        ]
      },
      s: { a: 1, k: [{ t: 0, s: [100, 100, 100] }, { t: 120, s: [20, 20, 100] }] },
    },
    ao: 0, ip: 0, op: 120, st: 0, bm: 0,
    shapes: [
      {
        ty: "gr",
        it: [
          { ty: "el", s: { a: 0, k: [16, 16] }, p: { a: 0, k: [0, 0] } },
          { ty: "fl", c: { a: 0, k: [r, g, b, 1] }, o: { a: 0, k: 100 } },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
        ],
      },
    ],
  }));

  return { v: "5.9.0", fr: 60, ip: 0, op: 120, w: 200, h: 200, nm: "particles", ddd: 0, assets: [], layers: particles };
}

function createWaveLottie(color: string): object {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const bars = Array.from({ length: 7 }, (_, i) => ({
    ddd: 0, ind: i + 1, ty: 4, nm: `bar_${i}`, sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      p: { a: 0, k: [20 + i * 28, 100, 0] },
      s: { a: 1, k: [{ t: 0, s: [100, 20 + i * 10, 100] }, { t: 30 + i * 5, s: [100, 80 + i * 10, 100] }, { t: 60 + i * 5, s: [100, 20 + i * 10, 100] }, { t: 120, s: [100, 80, 100] }] },
    },
    ao: 0, ip: 0, op: 120, st: 0, bm: 0,
    shapes: [
      {
        ty: "gr",
        it: [
          { ty: "rc", s: { a: 0, k: [16, 60] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 4 } },
          { ty: "fl", c: { a: 0, k: [r, g, b, 1] }, o: { a: 0, k: 100 } },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
        ],
      },
    ],
  }));

  return { v: "5.9.0", fr: 60, ip: 0, op: 120, w: 200, h: 200, nm: "wave", ddd: 0, assets: [], layers: bars };
}

function createProgressLottie(color: string): object {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  return {
    v: "5.9.0", fr: 60, ip: 0, op: 120, w: 400, h: 60, nm: "progress", ddd: 0, assets: [],
    layers: [
      {
        ddd: 0, ind: 1, ty: 4, nm: "track", sr: 1,
        ks: { o: { a: 0, k: 30 }, p: { a: 0, k: [200, 30, 0] }, s: { a: 0, k: [100, 100, 100] } },
        ao: 0, ip: 0, op: 120, st: 0, bm: 0,
        shapes: [{ ty: "gr", it: [{ ty: "rc", s: { a: 0, k: [380, 12] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 6 } }, { ty: "fl", c: { a: 0, k: [r, g, b, 1] }, o: { a: 0, k: 100 } }, { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }] }],
      },
      {
        ddd: 0, ind: 2, ty: 4, nm: "fill", sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          p: { a: 0, k: [10, 30, 0] },
          s: { a: 1, k: [{ t: 0, s: [0, 100, 100] }, { t: 90, s: [100, 100, 100] }] },
        },
        ao: 0, ip: 0, op: 120, st: 0, bm: 0,
        shapes: [{ ty: "gr", it: [{ ty: "rc", s: { a: 0, k: [380, 12] }, p: { a: 0, k: [190, 0] }, r: { a: 0, k: 6 } }, { ty: "fl", c: { a: 0, k: [r, g, b, 1] }, o: { a: 0, k: 100 } }, { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }] }],
      },
    ],
  };
}

function createGraphLottie(color: string): object {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const bars = [30, 50, 40, 70, 60, 90, 80].map((h, i) => ({
    ddd: 0, ind: i + 1, ty: 4, nm: `bar_${i}`, sr: 1,
    ks: {
      o: { a: 1, k: [{ t: i * 8, s: [0] }, { t: i * 8 + 15, s: [100] }] },
      p: { a: 0, k: [20 + i * 26, 160, 0] },
      s: { a: 1, k: [{ t: i * 8, s: [100, 0, 100] }, { t: i * 8 + 20, s: [100, 100, 100] }] },
    },
    ao: 0, ip: 0, op: 120, st: 0, bm: 0,
    shapes: [{ ty: "gr", it: [{ ty: "rc", s: { a: 0, k: [18, h] }, p: { a: 0, k: [0, -h / 2] }, r: { a: 0, k: 3 } }, { ty: "fl", c: { a: 0, k: [r, g, b, 1] }, o: { a: 0, k: 100 } }, { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }] }],
  }));

  return { v: "5.9.0", fr: 60, ip: 0, op: 120, w: 200, h: 200, nm: "graph", ddd: 0, assets: [], layers: bars };
}

function createNetworkLottie(color: string): object {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const nodes = Array.from({ length: 6 }, (_, i) => ({
    ddd: 0, ind: i + 1, ty: 4, nm: `node_${i}`, sr: 1,
    ks: {
      o: { a: 1, k: [{ t: i * 6, s: [0] }, { t: i * 6 + 12, s: [100] }] },
      p: { a: 0, k: [100 + Math.cos(i * 60 * Math.PI / 180) * 70, 100 + Math.sin(i * 60 * Math.PI / 180) * 70, 0] },
      s: { a: 1, k: [{ t: 0, s: [80, 80, 100] }, { t: 60, s: [120, 120, 100] }, { t: 120, s: [80, 80, 100] }] },
    },
    ao: 0, ip: 0, op: 120, st: 0, bm: 0,
    shapes: [{ ty: "gr", it: [{ ty: "el", s: { a: 0, k: [20, 20] }, p: { a: 0, k: [0, 0] } }, { ty: "fl", c: { a: 0, k: [r, g, b, 1] }, o: { a: 0, k: 100 } }, { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }] }],
  }));

  return { v: "5.9.0", fr: 60, ip: 0, op: 120, w: 200, h: 200, nm: "network", ddd: 0, assets: [], layers: nodes };
}

function createArrowLottie(color: string): object {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  return {
    v: "5.9.0", fr: 60, ip: 0, op: 60, w: 200, h: 200, nm: "arrow", ddd: 0, assets: [],
    layers: [{
      ddd: 0, ind: 1, ty: 4, nm: "arrow", sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 1, k: [{ t: 0, s: [60, 100, 0], i: { x: 0.5, y: 1 }, o: { x: 0.5, y: 0 } }, { t: 60, s: [140, 100, 0] }] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0, ip: 0, op: 60, st: 0, bm: 0,
      shapes: [{
        ty: "gr", it: [
          { ty: "sr", sy: 1, d: 1, pt: { a: 0, k: 3 }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 90 }, ir: { a: 0, k: 20 }, is: { a: 0, k: 0 }, or: { a: 0, k: 40 }, os: { a: 0, k: 0 } },
          { ty: "fl", c: { a: 0, k: [r, g, b, 1] }, o: { a: 0, k: 100 } },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
        ],
      }],
    }],
  };
}

async function generateLottieLibrary() {
  console.log(`🎨 Génération de ${Object.keys(SYNTHETIC_LOTTIE).length} animations Lottie...\n`);
  let success = 0;

  for (const [id, data] of Object.entries(SYNTHETIC_LOTTIE)) {
    const dir = path.join(process.cwd(), "public", "lottie", path.dirname(id));
    const file = path.join(process.cwd(), "public", "lottie", `${id}.json`);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data));
    console.log(`✓ ${id}`);
    success++;
  }

  // Index
  const index = Object.keys(SYNTHETIC_LOTTIE).reduce((acc, id) => {
    acc[id] = `/lottie/${id}.json`;
    return acc;
  }, {} as Record<string, string>);

  fs.writeFileSync(
    path.join(process.cwd(), "public", "lottie", "index.json"),
    JSON.stringify(index, null, 2)
  );

  console.log(`\n✅ ${success} animations générées`);
  console.log(`📋 Index: public/lottie/index.json`);
}

generateLottieLibrary().catch(console.error);
