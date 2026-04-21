/**
 * Neutral Tint Generator using OKLCH color space
 *
 * Uses native CSS oklch() for perceptually uniform neutral palettes.
 * Tint slider controls chroma (color intensity) while keeping
 * lightness consistent across hues.
 */

interface NeutralShade {
  key: string;
  css: string;
}

// OKLCH lightness and max chroma per shade
// L: 0-1 (perceptual lightness), C: 0-0.4 (chroma/saturation)
const NEUTRAL_SHADES: { key: string; l: number; maxC: number }[] = [
  { key: '0',   l: 1.00,  maxC: 0 },
  { key: '50',  l: 0.965, maxC: 0.008 },
  { key: '100', l: 0.905, maxC: 0.014 },
  { key: '200', l: 0.845, maxC: 0.018 },
  { key: '300', l: 0.695, maxC: 0.025 },
  { key: '400', l: 0.545, maxC: 0.03 },
  { key: '500', l: 0.42,  maxC: 0.028 },
  { key: '600', l: 0.35,  maxC: 0.025 },
  { key: '700', l: 0.29,  maxC: 0.022 },
  { key: '800', l: 0.21,  maxC: 0.02 },
  { key: '900', l: 0.18,  maxC: 0.018 },
  { key: '950', l: 0.12,  maxC: 0.015 },
];

/**
 * Extract OKLCH hue from hex color via RGB → linear RGB → OKLab → OKLCH
 */
function hexToOklchHue(hex: string): number {
  hex = hex.replace('#', '');
  // sRGB to linear RGB
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const r = toLinear(parseInt(hex.substring(0, 2), 16) / 255);
  const g = toLinear(parseInt(hex.substring(2, 4), 16) / 255);
  const b = toLinear(parseInt(hex.substring(4, 6), 16) / 255);

  // Linear RGB → LMS (using OKLab matrix)
  const l_ = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m_ = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s_ = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  // LMS → LMS (cube root)
  const l1 = Math.cbrt(l_);
  const m1 = Math.cbrt(m_);
  const s1 = Math.cbrt(s_);

  // LMS → OKLab
  const a = 1.9779984951 * l1 - 2.4285922050 * m1 + 0.4505937099 * s1;
  const bOk = 0.0259040371 * l1 + 0.7827717662 * m1 - 0.8086757660 * s1;

  // OKLab → OKLCH hue
  let hue = Math.atan2(bOk, a) * (180 / Math.PI);
  if (hue < 0) hue += 360;

  return Math.round(hue);
}

// Dark mode: inverted lightness scale
const NEUTRAL_SHADES_DARK: { key: string; l: number; maxC: number }[] = [
  { key: '0',   l: 0.13,  maxC: 0.015 },
  { key: '50',  l: 0.17,  maxC: 0.015 },
  { key: '100', l: 0.22,  maxC: 0.015 },
  { key: '200', l: 0.28,  maxC: 0.018 },
  { key: '300', l: 0.48,  maxC: 0.02 },
  { key: '400', l: 0.58,  maxC: 0.025 },
  { key: '500', l: 0.67,  maxC: 0.025 },
  { key: '600', l: 0.75,  maxC: 0.02 },
  { key: '700', l: 0.82,  maxC: 0.018 },
  { key: '800', l: 0.88,  maxC: 0.015 },
  { key: '900', l: 0.93,  maxC: 0.01 },
  { key: '950', l: 0.97,  maxC: 0.005 },
];

/**
 * Generate tinted neutral palette using OKLCH
 * @param brandHex - Brand color hex to extract hue from
 * @param tintAmount - 0 (pure grey) to 100 (fully tinted)
 * @param darkMode - Whether to use inverted lightness for dark mode
 * @returns Array of shades with oklch() CSS values
 */
function generateNeutralPalette(brandHex: string, tintAmount: number, darkMode = false): NeutralShade[] {
  const hue = hexToOklchHue(brandHex);
  const tint = Math.max(0, Math.min(100, tintAmount)) / 100;
  const shades = darkMode ? NEUTRAL_SHADES_DARK : NEUTRAL_SHADES;

  return shades.map(({ key, l, maxC }) => {
    const chroma = maxC * tint;
    const css = chroma === 0
      ? `oklch(${l} 0 0)`
      : `oklch(${l} ${chroma.toFixed(4)} ${hue})`;
    return { key, css };
  });
}

/**
 * Apply neutral palette to CSS custom properties
 */
function applyNeutralToDOM(palette: NeutralShade[], brandHex?: string, tintAmount?: number) {
  const root = document.documentElement;
  for (const shade of palette) {
    root.style.setProperty(`--neutral-${shade.key}`, shade.css);
  }
  // Tooltip tokens always use light-mode neutrals (theme-tinted but never inverted)
  if (brandHex !== undefined && tintAmount !== undefined) {
    const lightPalette = generateNeutralPalette(brandHex, tintAmount, false);
    const bg = lightPalette.find(s => s.key === '900');
    const fg = lightPalette.find(s => s.key === '0');
    if (bg) root.style.setProperty('--tooltip-bg', bg.css);
    if (fg) root.style.setProperty('--tooltip-fg', fg.css);
  }
}

function resetNeutral() {
  const root = document.documentElement;
  NEUTRAL_SHADES.forEach(({ key }) => {
    root.style.removeProperty(`--neutral-${key}`);
  });
}

export { generateNeutralPalette, applyNeutralToDOM, resetNeutral, hexToOklchHue };
export type { NeutralShade };
