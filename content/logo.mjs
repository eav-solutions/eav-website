// The EAV Solutions logo: building blocks, four rounded tiles with the top-right one being lifted into place.
// Used by build.mjs (header and favicon) and scripts/make-brand.mjs (PNG files for email signatures and so on).
export const BLUE = '#2347C5';
export const INK = '#161E2C';

export function logo(bg, ink, { square = false } = {}) {
  return `<rect width="32" height="32" rx="${square ? 0 : 7.5}" fill="${bg}"/>`
    + `<g fill="${ink}">`
    + `<rect x="6.5" y="16.5" width="9" height="9" rx="2.2"/>`
    + `<rect x="16.5" y="16.5" width="9" height="9" rx="2.2"/>`
    + `<rect x="6.5" y="6.5" width="9" height="9" rx="2.2"/>`
    + `<rect x="17.2" y="5.2" width="9" height="9" rx="2.2" transform="rotate(14 21.7 9.7)" opacity=".75"/>`
    + `</g>`;
}

export const logoSVG = (bg = BLUE, ink = '#FFFFFF', opts) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${logo(bg, ink, opts)}</svg>\n`;
