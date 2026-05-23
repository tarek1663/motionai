import fs from "fs";
import path from "path";
import https from "https";

const LOGOS: { domain: string; size?: number }[] = [
  { domain: "google.com" },
  { domain: "apple.com" },
  { domain: "nike.com" },
  { domain: "adidas.com" },
  { domain: "spotify.com" },
  { domain: "netflix.com" },
  { domain: "amazon.com" },
  { domain: "microsoft.com" },
  { domain: "meta.com" },
  { domain: "tesla.com" },
  { domain: "samsung.com" },
  { domain: "airbnb.com" },
  { domain: "uber.com" },
  { domain: "stripe.com" },
  { domain: "notion.so" },
  { domain: "slack.com" },
  { domain: "figma.com" },
  { domain: "linkedin.com" },
  { domain: "youtube.com" },
  { domain: "tiktok.com" },
  { domain: "discord.com" },
  { domain: "shopify.com" },
  { domain: "adobe.com" },
  { domain: "paypal.com" },
  { domain: "snapchat.com" },
  { domain: "twitter.com" },
];

function download(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);

    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "image/webp,image/png,image/*,*/*",
        "Referer": "https://clearbit.com",
      },
    };

    const req = https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        download(res.headers.location!, dest).then(resolve);
        return;
      }

      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        resolve(false);
        return;
      }

      res.pipe(file);
      file.on("finish", () => {
        file.close();
        // Vérifier que le fichier n'est pas vide
        const stats = fs.statSync(dest);
        resolve(stats.size > 100);
      });
    });

    req.on("error", () => {
      fs.existsSync(dest) && fs.unlinkSync(dest);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      fs.existsSync(dest) && fs.unlinkSync(dest);
      resolve(false);
    });
  });
}

// Sources alternatives pour les logos
function getLogoUrls(domain: string): string[] {
  const name = domain.split(".")[0];
  return [
    // Clearbit avec taille
    `https://logo.clearbit.com/${domain}?size=200`,
    // Brandfetch
    `https://cdn.brandfetch.io/${domain}/w/400/h/400`,
    // Favicon haute résolution
    `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
    // Logo.dev
    `https://img.logo.dev/${domain}?token=pk_X7BhXEyxR9iJ1VZjrgd-aA&size=200`,
  ];
}

async function downloadWithFallback(domain: string, dest: string): Promise<boolean> {
  const urls = getLogoUrls(domain);
  for (const url of urls) {
    const success = await download(url, dest);
    if (success) return true;
  }
  return false;
}

async function main() {
  const dir = path.join(process.cwd(), "public", "logos");
  fs.mkdirSync(dir, { recursive: true });

  // Supprimer les fichiers vides existants
  const existing = fs.readdirSync(dir);
  for (const file of existing) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      fs.unlinkSync(filePath);
    }
  }

  let success = 0;
  let failed: string[] = [];

  for (const { domain } of LOGOS) {
    const filename = domain.replace(/\./g, "_") + ".png";
    const dest = path.join(dir, filename);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
      console.log(`⏭️  ${domain} (déjà téléchargé)`);
      success++;
      continue;
    }

    const ok = await downloadWithFallback(domain, dest);
    if (ok) {
      const size = fs.statSync(dest).size;
      console.log(`✓ ${domain} (${size} bytes)`);
      success++;
    } else {
      console.error(`✗ ${domain}`);
      failed.push(domain);
    }

    // Petit délai pour éviter le rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n✅ ${success} logos téléchargés`);
  if (failed.length > 0) {
    console.log(`❌ Échecs: ${failed.join(", ")}`);
  }
}

main().catch(console.error);
