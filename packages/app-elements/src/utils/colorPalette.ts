/**
 * Color Palette Generator
 * Generates a full shade palette (50-950) from a single base color.
 * Similar to uicolors.app approach using HSL manipulation.
 */

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface PaletteShade {
  key: string;
  hex: string;
  hsl: HSL;
}

// Target lightness values for each shade (based on typical design systems)
const SHADE_LIGHTNESS: Record<string, number> = {
  '50': 97,
  '100': 93,
  '200': 86,
  '300': 76,
  '400': 63,
  '500': 53,
  '600': 45,
  '700': 38,
  '800': 31,
  '900': 25,
  '950': 15,
};

// Dark mode: inverted — low shades are dark, high shades are light
const SHADE_LIGHTNESS_DARK: Record<string, number> = {
  '50': 12,
  '100': 17,
  '200': 23,
  '300': 30,
  '400': 42,
  '500': 53,
  '600': 63,
  '700': 73,
  '800': 83,
  '900': 90,
  '950': 95,
};

const SHADE_KEYS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

function hexToHSL(hex: string): HSL {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/**
 * Find which shade the input color is closest to based on lightness
 */
function findClosestShade(l: number): string {
  let closest = '500';
  let minDiff = Infinity;
  for (const [key, targetL] of Object.entries(SHADE_LIGHTNESS)) {
    const diff = Math.abs(l - targetL);
    if (diff < minDiff) {
      minDiff = diff;
      closest = key;
    }
  }
  return closest;
}

/**
 * Generate a full palette from a single hex color.
 * The algorithm:
 * 1. Convert to HSL
 * 2. Keep the hue
 * 3. Adjust saturation: higher for mid-tones, lower for extremes
 * 4. Map lightness across the shade spectrum
 */
export function generatePalette(baseHex: string, darkMode = false): PaletteShade[] {
  const base = hexToHSL(baseHex);
  const lightnessMap = darkMode ? SHADE_LIGHTNESS_DARK : SHADE_LIGHTNESS;

  return SHADE_KEYS.map((key) => {
    const targetL = lightnessMap[key];

    // Saturation adjustment: boost in mid-range, reduce at extremes
    let satAdj = 0;
    if (targetL > 85) {
      satAdj = -Math.round(base.s * 0.3); // lighter = less saturated
    } else if (targetL < 25) {
      satAdj = -Math.round(base.s * 0.15); // darker = slightly less saturated
    } else if (targetL >= 40 && targetL <= 60) {
      satAdj = Math.round(base.s * 0.05); // mid-range = slight boost
    }

    const s = Math.max(0, Math.min(100, base.s + satAdj));
    const hex = hslToHex(base.h, s, targetL);

    return {
      key,
      hex,
      hsl: { h: base.h, s, l: targetL },
    };
  });
}

export function getClosestShadeKey(baseHex: string): string {
  const base = hexToHSL(baseHex);
  return findClosestShade(base.l);
}

/**
 * Generate a secondary palette and apply it to the DOM as --secondary-50 through --secondary-950.
 */
export function applySecondaryPaletteToDOM(palette: PaletteShade[]) {
  const root = document.documentElement;
  const map: Record<string, string> = {};
  for (const shade of palette) {
    root.style.setProperty(`--secondary-${shade.key}`, shade.hex);
    map[shade.key] = shade.hex;
  }
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  root.style.setProperty('--fg-secondary-brand', map[dark ? '400' : '600']);
  root.style.setProperty('--bg-surface-secondary', map[dark ? '950' : '50']);
  root.style.setProperty('--bg-fill-secondary-brand', map[dark ? '400' : '600']);
}

/**
 * Remove all secondary CSS variables from the DOM.
 */
export function resetSecondaryPalette() {
  const root = document.documentElement;
  SHADE_KEYS.forEach((key) => root.style.removeProperty(`--secondary-${key}`));
  root.style.removeProperty('--fg-secondary-brand');
  root.style.removeProperty('--bg-surface-secondary');
  root.style.removeProperty('--bg-fill-secondary-brand');
}

export { SHADE_KEYS, hexToHSL, hslToHex };
export type { PaletteShade };
