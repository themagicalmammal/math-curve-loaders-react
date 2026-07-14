/**
 * Generate animated GIFs for all 21 curves.
 *
 * Steps:
 * 1. Build the gallery app
 * 2. Serve the build with a static server
 * 3. For each curve, use Puppeteer to take 10 frames (100ms apart = 10fps, 1s total)
 * 4. Assemble frames into a GIF with ImageMagick
 *
 * Usage: node scripts/capture-gifs.mjs
 */

import { spawn, execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "apps/gallery/dist");
const GIF_DIR = join(ROOT, "docs/gifs");
const FRAMES_DIR = join(ROOT, "tmp/gif-frames");
const FRAME_COUNT = 30;
const FRAME_MS = 250; // 4fps
const SIZE = 160;

// Curve name → filename (lowercase, no spaces)
const NAME_TO_FILE = {
  "Original Thinking": "originalthinking.gif",
  "Thinking Five": "thinkingfive.gif",
  "Thinking Nine": "thinkingnine.gif",
  "Rose Orbit": "roseorbit.gif",
  "Rose Curve": "rosecurve.gif",
  "Rose Two": "rosetwo.gif",
  "Rose Three": "rosethree.gif",
  "Rose Four": "rosefour.gif",
  "Lissajous Drift": "lissajousdrift.gif",
  "Lemniscate Bloom": "lemniscatebloom.gif",
  "Hypotrochoid Loop": "hypotrochoidloop.gif",
  "Three-Petal Spiral": "threepetalspiral.gif",
  "Four-Petal Spiral": "fourpetalspiral.gif",
  "Five-Petal Spiral": "fivepetalspiral.gif",
  "Six-Petal Spiral": "sixpetalspiral.gif",
  "Butterfly Phase": "butterflyphase.gif",
  "Cardioid Glow": "cardioidglow.gif",
  "Cardioid Heart": "cardioidheart.gif",
  "Heart Wave": "heartwave.gif",
  "Spiral Search": "spiralsearch.gif",
  "Fourier Flow": "fourierflow.gif",
};

// Map curve names to their CSS selector index on the capture page
const CURVE_NAMES = Object.keys(NAME_TO_FILE);

function log(msg) {
  console.log(`\x1b[36m[capture]\x1b[0m ${msg}`);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Build the gallery (bypass pnpm to avoid puppeteer build-script check)
async function build() {
  log("Building gallery...");
  const GALLERY_DIR = join(ROOT, "apps/gallery");
  console.log("\x1b[36m[capture]\x1b[0m Running tsc...");
  execSync("npx tsc", { cwd: GALLERY_DIR, stdio: "inherit" });
  console.log("\x1b[36m[capture]\x1b[0m Running vite build...");
  execSync("npx vite build", { cwd: GALLERY_DIR, stdio: "inherit" });
  log("Build succeeded.");
}

// Start a static file server and return its port
function startServer() {
  log("Starting static server...");
  const child = spawn(
    "npx",
    ["serve", "-s", DIST, "-p", "0", "--no-clipboard"],
    { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] }
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
          execSync(`curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:${port}/`, {
            stdio: "pipe",
          });
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
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Pre-load the capture page once
  await page.goto(`http://127.0.0.1:${port}/capture.html`, {
    waitUntil: "networkidle0",
  });
  // Wait for all curves to initialize
  await sleep(2000);

  const COLS = 7;
  const SLOT_SIZE = 180;
  const GAP = 32;

  for (const [name, filename] of Object.entries(NAME_TO_FILE)) {
    const cssIndex = CURVE_NAMES.indexOf(name);
    const col = cssIndex % COLS;
    const row = Math.floor(cssIndex / COLS);
    const x = col * (SLOT_SIZE + GAP) + 80;
    const y = row * (SLOT_SIZE + GAP) + 80;

    const frameFiles = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const f = join(FRAMES_DIR, `${name}-frame-${i}.png`);
      frameFiles.push(f);
    }

    // Take frames
    for (let i = 0; i < FRAME_COUNT; i++) {
      await page.screenshot({
        path: frameFiles[i],
        clip: { x, y, width: SIZE, height: SIZE },
      });
      if (i < FRAME_COUNT - 1) {
        await sleep(FRAME_MS);
      }
    }

    // Encode GIF using ImageMagick (reliable for 160x160 GIFs)
    const outputGif = join(GIF_DIR, filename);
    // Build space-separated list of frame paths
    const framePaths = frameFiles.map((f) => `"${f}"`).join(" ");
    execSync(
      `magick ${framePaths} -delay 10 -loop 0 "${outputGif}" 2>&1`,
      { stdio: "pipe" }
    );

    console.log(`  ✓ ${name}`);
  }

  // Cleanup
  await browser.close();
  child.kill();

  // Clean up temp frames
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });

  log("Done! Generated GIFs in docs/gifs/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
