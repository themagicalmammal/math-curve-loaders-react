/**
 * Generate animated GIFs for all 21 curves.
 *
 * Steps:
 * 1. Build the gallery app
 * 2. Serve the build with a static server
 * 3. For each curve, use Puppeteer to take 30 frames (250ms apart) from the individual
 *    capture page for that curve
 * 4. Assemble frames into a GIF with ImageMagick
 *
 * Usage: node scripts/capture-gifs.mjs
 */

import { execSync, spawn } from "child_process";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "apps/capture/dist");
const GIF_DIR = join(ROOT, "docs/gifs");
const FRAMES_DIR = join(ROOT, "tmp/gif-frames");
const FRAME_COUNT = 30;
const FRAME_MS = 250; // ~4fps
const SIZE = 160;

// Curve name → filename (lowercase, no spaces)
const NAME_TO_FILE = {
  "Butterfly Phase": "butterflyphase.gif",
  "Cardioid Glow": "cardioidglow.gif",
  "Cardioid Heart": "cardioidheart.gif",
  "Five-Petal Spiral": "fivepetalspiral.gif",
  "Four-Petal Spiral": "fourpetalspiral.gif",
  "Fourier Flow": "fourierflow.gif",
  "Heart Wave": "heartwave.gif",
  "Hypotrochoid Loop": "hypotrochoidloop.gif",
  "Lemniscate Bloom": "lemniscatebloom.gif",
  "Lissajous Drift": "lissajousdrift.gif",
  "Original Thinking": "originalthinking.gif",
  "Rose Curve": "rosecurve.gif",
  "Rose Four": "rosefour.gif",
  "Rose Orbit": "roseorbit.gif",
  "Rose Three": "rosethree.gif",
  "Rose Two": "rosetwo.gif",
  "Six-Petal Spiral": "sixpetalspiral.gif",
  "Spiral Search": "spiralsearch.gif",
  "Thinking Five": "thinkingfive.gif",
  "Thinking Nine": "thinkingnine.gif",
  "Three-Petal Spiral": "threepetalspiral.gif",
};

function log(msg) {
  console.log(`\x1b[36m[capture]\x1b[0m ${msg}`);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Build capture app (bypass pnpm to avoid puppeteer build-script check)
async function build() {
  log("Building capture...");
  const CAPTURE_DIR = join(ROOT, "apps/capture");
  console.log("\x1b[36m[capture]\x1b[0m Running tsc...");
  execSync("npx tsc", { cwd: CAPTURE_DIR, stdio: "inherit" });
  console.log("\x1b[36m[capture]\x1b[0m Running vite build...");
  execSync("npx vite build", { cwd: CAPTURE_DIR, stdio: "inherit" });
  log("Build succeeded.");
}

// Start a static file server and return its port
function startServer() {
  log("Starting static server...");
  const child = spawn(
    "npx",
    ["serve", DIST, "-p", "0", "--no-clipboard"],
    { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] },
  );
  return { child };
}

// Wait until the server is responding; returns the port it's listening on
async function waitForServer(child, maxWait = 15000) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), maxWait);

    const onData = (chunk) => {
      const text = chunk.toString();
      const match = text.match(/:(\d+)/);
      if (match) {
        const port = parseInt(match[1], 10);
        child.stdout.removeListener("data", onData);
        clearTimeout(timeout);
        try {
          execSync(
            `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:${port}/`,
            {
              stdio: "pipe",
            },
          );
          resolve(port);
        } catch {
          resolve(null);
        }
      }
    };
    child.stdout.on("data", onData);
  });
}

async function main() {
  // Ensure directories exist
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
  fs.mkdirSync(GIF_DIR, { recursive: true });

  // Step 1: Build
  await build();

  // Step 2: Start server and wait for it to be ready
  const { child } = startServer();
  const port = await waitForServer(child);
  if (!port) {
    throw new Error("Server failed to start within 15s");
  }
  log(`Server ready on port ${port}.`);

  // Step 3: Launch browser and generate GIFs
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
    headless: "new",
  });

  const page = await browser.newPage();
  await page.setViewport({ height: SIZE, width: SIZE });

  for (const [name, filename] of Object.entries(NAME_TO_FILE)) {
    const file = filename.replace(".gif", "");
    const pageUrl = `http://127.0.0.1:${port}/capture-${file}.html`;
    log(`Processing ${name}...`);

    // Navigate to the individual capture page for this curve
    await page.goto(pageUrl, { waitUntil: "networkidle0" });
    // Wait for the curve to render
    await sleep(1000);

    // Set body background to transparent for clean captures
    await page.evaluate(() => {
      document.body.style.background = "transparent";
    });

    const frameFiles = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const f = join(FRAMES_DIR, `${name}-frame-${i}.png`);
      frameFiles.push(f);
    }

    // Take frames with transparent background (clipped to 160x160)
    for (let i = 0; i < FRAME_COUNT; i++) {
      await page.screenshot({
        clip: { x: 0, y: 0, width: SIZE, height: SIZE },
        path: frameFiles[i],
        transparent: true,
      });
      if (i < FRAME_COUNT - 1) {
        await sleep(FRAME_MS);
      }
    }

    // Encode GIF using ImageMagick
    const outputGif = join(GIF_DIR, filename);
    const framePaths = frameFiles.map((f) => `"${f}"`).join(" ");
    execSync(`magick ${framePaths} -delay 10 -loop 0 "${outputGif}" 2>&1`, {
      stdio: "pipe",
    });

    console.log(`  ✓ ${name}`);
  }

  // Cleanup
  await browser.close();
  child.kill();

  // Clean up temp frames
  fs.rmSync(FRAMES_DIR, { force: true, recursive: true });

  log("Done! Generated GIFs in docs/gifs/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
