// Draws the logo as PNG files into static/assets/brand/ (and the iPhone home-screen icon into static/).
// Needs Google Chrome. Run: node scripts/make-brand.mjs, then node build.mjs.
import { writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { logo, logoSVG, BLUE, INK } from '../content/logo.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'static/assets/brand');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const fonts = pathToFileURL(join(ROOT, 'static/assets/fonts.css')).href;
const tmp = mkdtempSync(join(tmpdir(), 'eav-brand-'));
mkdirSync(OUT, { recursive: true });

function shoot(name, w, h, body, { transparent = true, out = OUT } = {}) {
  const page = join(tmp, name + '.html');
  writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${fonts}">
<style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:transparent}svg{display:block}</style></head>
<body>${body}</body></html>`);
  execFileSync(CHROME, ['--headless', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    `--user-data-dir=${join(tmp, 'profile')}`, `--window-size=${w},${h}`,
    ...(transparent ? ['--default-background-color=00000000'] : []),
    '--virtual-time-budget=2000', `--screenshot=${join(out, name + '.png')}`, pathToFileURL(page).href], { stdio: 'ignore' });
  console.log(`${name}.png  ${w}×${h}`);
}

const icon = (size, opts) => `<svg width="${size}" height="${size}" viewBox="0 0 32 32">${logo(BLUE, '#FFFFFF', opts)}</svg>`;

// The square logo with rounded corners, transparent outside them.
for (const s of [64, 128, 256, 512]) shoot(`eav-logo-${s}`, s, s, icon(s));

// The iPhone home-screen icon: square, because iOS rounds the corners itself.
shoot('apple-touch-icon', 180, 180, icon(180, { square: true }), { transparent: false, out: join(ROOT, 'static') });

// The logo with the name beside it, drawn at twice its displayed size so it's sharp on high-resolution screens.
// Show it at half these sizes (e.g. width 240) in an email signature.
const lockup = (text, bg) => `<div style="display:flex;align-items:center;gap:22px;height:100%;padding:0 ${bg ? 28 : 0}px;box-sizing:border-box;background:${bg || 'transparent'};border-radius:${bg ? 20 : 0}px">
${icon(88)}<span style="font:800 54px/1 'Bricolage Grotesque',system-ui;letter-spacing:-.01em;color:${text};white-space:nowrap">EAV Solutions</span></div>`;
shoot('eav-lockup', 458, 88, lockup(INK));
shoot('eav-lockup-light', 458, 88, lockup('#FFFFFF'));
shoot('eav-lockup-on-white', 514, 136, lockup(INK, '#FFFFFF'), { transparent: false });

writeFileSync(join(OUT, 'eav-logo.svg'), logoSVG());
rmSync(tmp, { recursive: true, force: true });
