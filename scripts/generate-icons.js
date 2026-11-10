import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 1. Official Vibe Clube Brand Emblem SVG (512x512)
// Features: Pure pitch-black canvas (#000000) with deep ambient glow,
// the signature stylized dynamic "V" with the 4-color gradient:
// Electric Blue (#00c6ff) -> Vivid Purple (#7928ca) -> Hot Pink (#ff007f) -> Sunset Orange (#ff6a00),
// sleek inner core gloss accent stroke, and interconnected 3-friend community silhouettes.
const emblemSvg = (scale = 1.0, yOffset = 0) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Main Vibe Gradient: Electric Blue -> Vivid Purple -> Hot Pink -> Sunset Orange -->
    <linearGradient id="vibeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00c6ff" />
      <stop offset="30%" stop-color="#7928ca" />
      <stop offset="68%" stop-color="#ff007f" />
      <stop offset="100%" stop-color="#ff6a00" />
    </linearGradient>

    <!-- Secondary Accented Gradient for People Silhouettes -->
    <linearGradient id="peopleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#f97316" />
    </linearGradient>

    <!-- Rich Ambient Glow Behind V -->
    <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7928ca" stop-opacity="0.45" />
      <stop offset="45%" stop-color="#ff007f" stop-opacity="0.2" />
      <stop offset="75%" stop-color="#00c6ff" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Solid Pitch Black Background -->
  <rect width="512" height="512" fill="#000000" />

  <!-- Ambient Glow centered behind emblem -->
  <circle cx="256" cy="${256 + yOffset}" r="220" fill="url(#ambientGlow)" />

  <!-- Central Emblem: Centered precisely in canvas with optional scaling -->
  <g transform="translate(256, ${256 + yOffset}) scale(${scale})">
    <!-- Stylized Dynamic 'V' -->
    <path d="M-135 -120 C-120 -120, -100 -105, -85 -70 L-25 70 C-15 95, -3 108, 0 108 C3 108, 15 95, 25 70 L85 -70 C100 -105, 120 -120, 135 -120 C152 -120, 158 -100, 145 -75 L70 105 C46 150, -46 150, -70 105 L-145 -75 C-158 -100, -152 -120, -135 -120 Z" fill="url(#vibeGrad)" />

    <!-- Sleek Internal Gloss Accent Stroke / Core -->
    <path d="M-85 -70 L-20 80 C-10 102, 10 102, 20 80 L85 -70 C92 -88, 78 -98, 62 -88 L12 40 C6 52, -6 52, -12 40 L-62 -88 C-78 -98, -92 -88, -85 -70 Z" fill="#ffffff" opacity="0.95" />

    <!-- Community / People Silhouettes Icon Beside V (Interconnected 3 Friends) -->
    <!-- Center Person -->
    <circle cx="88" cy="-45" r="16" fill="url(#peopleGrad)" />
    <path d="M66 -22 C66 -32, 75 -34, 88 -34 C101 -34, 110 -32, 110 -22 L110 -8 C110 -4, 106 0, 102 0 L74 0 C70 0, 66 -4, 66 -8 Z" fill="url(#peopleGrad)" />

    <!-- Left Person (Cyan) -->
    <circle cx="56" cy="-34" r="12" fill="#38bdf8" />
    <path d="M39 -15 C39 -22, 46 -24, 56 -24 C63 -24, 68 -22, 70 -17 L70 -7 C70 -4, 67 -2, 64 -2 L45 -2 C41 -2, 39 -4, 39 -7 Z" fill="#38bdf8" opacity="0.92" />

    <!-- Right Person (Orange) -->
    <circle cx="120" cy="-34" r="12" fill="#f97316" />
    <path d="M106 -17 C108 -22, 113 -24, 120 -24 C131 -24, 137 -22, 137 -15 L137 -7 C137 -4, 135 -2, 131 -2 L112 -2 C109 -2, 106 -4, 106 -7 Z" fill="#f97316" opacity="0.92" />
  </g>
</svg>`;

// Standard icon: Emblem scaled at 1.05 for bold presence on app launchers
const standardSvg = emblemSvg(1.05, 0);

// Maskable icon: Emblem safely placed inside inner 72% circle (safe zone with 14% margin around all sides)
const maskableSvg = emblemSvg(0.76, 0);

function createIco(png32Buffer) {
  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(1, 4); // count of images = 1

  // Directory entry: 16 bytes
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0); // width 32
  entry.writeUInt8(32, 1); // height 32
  entry.writeUInt8(0, 2);  // color palette
  entry.writeUInt8(0, 3);  // reserved
  entry.writeUInt16LE(1, 4);  // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png32Buffer.length, 8); // image size in bytes
  entry.writeUInt32LE(22, 12); // image offset (6 + 16 = 22)

  return Buffer.concat([header, entry, png32Buffer]);
}

async function generate() {
  const publicDir = path.resolve('public');
  const distDir = path.resolve('dist');

  // Save standard SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);
  console.log('Saved public/icon.svg');

  // Save maskable SVG
  fs.writeFileSync(path.join(publicDir, 'icon-maskable.svg'), maskableSvg);
  console.log('Saved public/icon-maskable.svg');

  // Generate 512x512 standard PNG
  await sharp(Buffer.from(standardSvg))
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('Generated public/icon-512.png');

  // Generate 192x192 standard PNG
  await sharp(Buffer.from(standardSvg))
    .resize(192, 192)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('Generated public/icon-192.png');

  // Generate maskable 512x512 PNG
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-maskable-512.png'));
  console.log('Generated public/icon-maskable-512.png');

  // Generate maskable 192x192 PNG
  await sharp(Buffer.from(maskableSvg))
    .resize(192, 192)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-maskable-192.png'));
  console.log('Generated public/icon-maskable-192.png');

  // Generate pwa-* alias files (for universal PWA compliance)
  fs.copyFileSync(path.join(publicDir, 'icon-512.png'), path.join(publicDir, 'pwa-512x512.png'));
  fs.copyFileSync(path.join(publicDir, 'icon-192.png'), path.join(publicDir, 'pwa-192x192.png'));
  fs.copyFileSync(path.join(publicDir, 'icon-maskable-512.png'), path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Generate apple-touch-icon.png (180x180)
  await sharp(Buffer.from(standardSvg))
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated public/apple-touch-icon.png');

  // Generate favicons (32x32 and 16x16)
  const png32Buffer = await sharp(Buffer.from(standardSvg))
    .resize(32, 32)
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32.png'), png32Buffer);

  const png16Buffer = await sharp(Buffer.from(standardSvg))
    .resize(16, 16)
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-16.png'), png16Buffer);

  // Generate real favicon.ico containing PNG data
  const icoBuffer = createIco(png32Buffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated public/favicon.ico');

  // If dist directory exists, copy all icons over so static previews also have latest icons
  if (fs.existsSync(distDir)) {
    const iconFiles = [
      'icon.svg',
      'icon-maskable.svg',
      'icon-512.png',
      'icon-192.png',
      'icon-maskable-512.png',
      'icon-maskable-192.png',
      'pwa-512x512.png',
      'pwa-192x192.png',
      'pwa-maskable-512x512.png',
      'apple-touch-icon.png',
      'favicon-32.png',
      'favicon-16.png',
      'favicon.ico',
    ];
    for (const file of iconFiles) {
      const srcPath = path.join(publicDir, file);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, path.join(distDir, file));
      }
    }
    console.log('Synchronized icon files to dist/');
  }
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
