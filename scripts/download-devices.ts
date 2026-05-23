import fs from "fs";
import path from "path";
import https from "https";

const DEVICES = [
  // iPhone 15 Pro frame — open source
  {
    name: "iphone",
    url: "https://raw.githubusercontent.com/nicktindall/cyclo/master/public/iphone-frame.png",
  },
  // MacBook frame
  {
    name: "macbook",
    url: "https://raw.githubusercontent.com/nicktindall/cyclo/master/public/macbook-frame.png",
  },
];

// On va créer des devices SVG premium directement
function createIphoneSVG(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" width="390" height="844">
  <defs>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2a2a2a"/>
      <stop offset="40%" style="stop-color:#1a1a1a"/>
      <stop offset="100%" style="stop-color:#0d0d0d"/>
    </linearGradient>
    <linearGradient id="sideGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3a3a3a"/>
      <stop offset="50%" style="stop-color:#555"/>
      <stop offset="100%" style="stop-color:#2a2a2a"/>
    </linearGradient>
    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#000010"/>
    </linearGradient>
    <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.15)"/>
      <stop offset="100%" style="stop-color:rgba(255,255,255,0)"/>
    </linearGradient>
    <clipPath id="screenClip">
      <rect x="20" y="20" width="350" height="804" rx="44" ry="44"/>
    </clipPath>
    <filter id="shadow">
      <feDropShadow dx="0" dy="20" stdDeviation="30" flood-color="rgba(0,0,0,0.6)"/>
    </filter>
  </defs>

  <!-- Corps principal -->
  <rect x="0" y="0" width="390" height="844" rx="54" ry="54" fill="url(#bodyGrad)" filter="url(#shadow)"/>

  <!-- Bords métalliques -->
  <rect x="1" y="1" width="388" height="842" rx="53" ry="53" fill="none" stroke="url(#sideGrad)" stroke-width="2"/>

  <!-- Écran -->
  <rect x="20" y="20" width="350" height="804" rx="44" ry="44" fill="#000"/>

  <!-- Dynamic Island -->
  <rect x="155" y="32" width="80" height="28" rx="14" ry="14" fill="#000"/>

  <!-- Highlight haut gauche -->
  <path d="M 54 0 Q 0 0 0 54 L 0 200 Q 60 160 80 0 Z" fill="url(#highlightGrad)" opacity="0.4"/>

  <!-- Reflet droite -->
  <path d="M 390 54 Q 390 0 336 0 L 310 0 Q 330 80 390 200 Z" fill="rgba(255,255,255,0.04)"/>
</svg>`;
}

function createMacbookSVG(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900">
  <defs>
    <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2d2d2d"/>
      <stop offset="100%" style="stop-color:#1a1a1a"/>
    </linearGradient>
    <linearGradient id="baseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3a3a3a"/>
      <stop offset="100%" style="stop-color:#2a2a2a"/>
    </linearGradient>
    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a1a"/>
      <stop offset="100%" style="stop-color:#000"/>
    </linearGradient>
    <filter id="macShadow">
      <feDropShadow dx="0" dy="30" stdDeviation="40" flood-color="rgba(0,0,0,0.7)"/>
    </filter>
    <clipPath id="screenClip">
      <rect x="120" y="40" width="1200" height="750" rx="8" ry="8"/>
    </clipPath>
  </defs>

  <!-- Écran lid -->
  <rect x="60" y="20" width="1320" height="820" rx="16" ry="16" fill="url(#lidGrad)" filter="url(#macShadow)"/>

  <!-- Bezel -->
  <rect x="80" y="36" width="1280" height="788" rx="10" ry="10" fill="#111"/>

  <!-- Écran -->
  <rect x="120" y="40" width="1200" height="750" rx="6" ry="6" fill="#000"/>

  <!-- Highlight lid haut -->
  <rect x="60" y="20" width="1320" height="2" rx="2" fill="rgba(255,255,255,0.15)"/>

  <!-- Logo Apple centré -->
  <circle cx="720" cy="808" r="12" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

  <!-- Base / keyboard area -->
  <rect x="0" y="840" width="1440" height="60" rx="6" ry="6" fill="url(#baseGrad)"/>

  <!-- Trackpad -->
  <rect x="560" y="850" width="320" height="38" rx="6" ry="6" fill="#333" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>

  <!-- Highlight base -->
  <rect x="0" y="840" width="1440" height="1" fill="rgba(255,255,255,0.1)"/>
</svg>`;
}

async function main() {
  const dir = path.join(process.cwd(), "public", "devices");
  fs.mkdirSync(dir, { recursive: true });

  // Créer iPhone SVG
  fs.writeFileSync(path.join(dir, "iphone.svg"), createIphoneSVG());
  console.log("✓ iphone.svg créé");

  // Créer MacBook SVG
  fs.writeFileSync(path.join(dir, "macbook.svg"), createMacbookSVG());
  console.log("✓ macbook.svg créé");

  console.log("\n✅ Devices créés dans public/devices/");
}

main();
