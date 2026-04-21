import { useState, useEffect, useCallback, useRef, type ReactNode, type MutableRefObject } from 'react';
import { toPng } from 'html-to-image';
import { Icon } from '../components/Icon/Icon';
import { useIconLibrary, type IconLibrary, type IconStyle } from '../context/IconLibraryContext';
import { loadLibrary } from '../utils/iconRegistry';
import { BottomSheet } from './components/BottomSheet';
import { generatePalette, applySecondaryPaletteToDOM, resetSecondaryPalette } from '../utils/colorPalette';
import type { PaletteShade } from '../utils/colorPalette';
import { generateNeutralPalette, applyNeutralToDOM, resetNeutral } from '../utils/neutralTint';
import { ColorPicker } from './components/ColorPicker';
import { ColorPicker as TokenColorPicker } from '../components/ColorPicker/ColorPicker';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import type { ButtonVariant } from '../components/Button';
import { Heading } from '../components/Heading';
import { DonationBox } from '../components/DonationBox';
import { Testimonial } from '../components/Testimonial';
import { Document } from '../components/Document';
import { SignDocument } from '../components/SignDocument';
import { Form } from '../components/Form';
import { Table } from '../components/Table';
import { SocialFollow } from '../components/SocialFollow';
import { List } from '../components/List';
import { ProductList } from '../components/ProductList';
import { DailyTaskManager } from '../components/DailyTaskManager/DailyTaskManager';
import { Chart } from '../components/Chart/Chart';
import { EmptyState } from '../components/EmptyState';
import { LoginSignup } from '../components/LoginSignup';
import { AppHeader } from '../components/AppHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { Paragraph } from '../components/Paragraph';

const DEFAULT_COLOR = '#7D38EF';
const DEFAULT_FONT = 'Inter';
const DEFAULT_HEADING_FONT = '';
const DEFAULT_RADIUS = 'Medium';
const DEFAULT_TINT = 50;
const DEFAULT_HARMONY = 150;

type RadiusScale = 'Small' | 'Medium' | 'Large' | 'XLarge';

const RADIUS_MODES: { scale: RadiusScale; lg: string }[] = [
  { scale: 'Small', lg: '6px' },
  { scale: 'Medium', lg: '12px' },
  { scale: 'Large', lg: '16px' },
  { scale: 'XLarge', lg: '24px' },
];

function applyRadius(scale: RadiusScale, canvas: HTMLElement | null) {
  if (!canvas) return;
  if (scale === 'Medium') {
    canvas.removeAttribute('data-radius');
  } else {
    canvas.setAttribute('data-radius', scale.toLowerCase());
  }
}

function resetRadius(canvas: HTMLElement | null) {
  if (canvas) canvas.removeAttribute('data-radius');
}


interface ColorScheme {
  brand: string;
  surface: string;
  text: string;
}

interface ThemePreset {
  name: string;
  color: string;
  font: string;
  headingFont: string;
  iconLibrary: IconLibrary;
  radius: RadiusScale;
  tint: number;
  mode: 'light' | 'dark';
  harmonyOffset: number;
  scheme: ColorScheme;
}

// Light presets (top row: custom + 4 light)
const LIGHT_PRESETS: ThemePreset[] = [
  { name: 'Default', color: '#7D38EF', font: 'Inter', headingFont: '', iconLibrary: 'lucide', radius: 'Medium', tint: 50, mode: 'light', harmonyOffset: 150, scheme: { brand: '#7D38EF', surface: '#EDE8FE', text: '#7D38EF' } },
  { name: 'Ocean Breeze', color: '#0385C8', font: 'DM Sans', headingFont: 'Playfair Display', iconLibrary: 'lucide', radius: 'Large', tint: 30, mode: 'light', harmonyOffset: 150, scheme: { brand: '#0385C8', surface: '#D3E9FF', text: '#0385C8' } },
  { name: 'Sunset', color: '#F97101', font: 'Bricolage Grotesque', headingFont: '', iconLibrary: 'lucide', radius: 'Large', tint: 60, mode: 'light', harmonyOffset: 180, scheme: { brand: '#F97101', surface: '#FEF3C5', text: '#F97101' } },
  { name: 'Forest', color: '#19A44B', font: 'Public Sans', headingFont: 'Lora', iconLibrary: 'tabler', radius: 'Small', tint: 40, mode: 'light', harmonyOffset: 120, scheme: { brand: '#19A44B', surface: '#DDFBE8', text: '#19A44B' } },
];

// Dark presets (bottom row: 5 dark)
const DARK_PRESETS: ThemePreset[] = [
  { name: 'Dark Elegance', color: '#8D5DF9', font: 'Figtree', headingFont: 'Playfair Display', iconLibrary: 'phosphor', radius: 'XLarge', tint: 70, mode: 'dark', harmonyOffset: 160, scheme: { brand: '#8D5DF9', surface: '#F0EBFE', text: '#8D5DF9' } },
  { name: 'Cherry Night', color: '#DF2125', font: 'Instrument Sans', headingFont: 'Merriweather', iconLibrary: 'lucide', radius: 'Medium', tint: 35, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#DF2125', surface: '#FDE8E8', text: '#DF2125' } },
  { name: 'Aqua Night', color: '#00B5D4', font: 'JetBrains Mono', headingFont: '', iconLibrary: 'lucide', radius: 'Medium', tint: 25, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#00B5D4', surface: '#DDF3FF', text: '#00B5D4' } },
  { name: 'Cozy', color: '#8B5E3C', font: 'Lora', headingFont: 'Playfair Display', iconLibrary: 'lucide', radius: 'Large', tint: 80, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#8B5E3C', surface: '#F5EDE6', text: '#8B5E3C' } },
  { name: 'Monochrome', color: '#5A6180', font: 'IBM Plex Mono', headingFont: '', iconLibrary: 'tabler', radius: 'Small', tint: 0, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#5A6180', surface: '#DADEF3', text: '#5A6180' } },
];

const THEME_PRESETS: ThemePreset[] = [...LIGHT_PRESETS, ...DARK_PRESETS];

const COMPONENT_NAMES: Record<string, string> = {
  'hero-heading': 'Heading',
  'card-1': 'Card', 'card-2': 'Card', 'card-3': 'Card',
  'daily-tasks': 'Daily Tasks',
  'chart-bar': 'Bar Chart', 'chart-line': 'Line Chart',
  'list': 'List',
  'updates-heading': 'Heading',
  'form-1': 'Form', 'form-2': 'Form',
  'table': 'Table',
  'resources-heading': 'Heading', 'reg-heading': 'Heading',
  'doc-1': 'Document', 'sign-doc': 'Sign Document',
  'document': 'Document',
  'donation': 'Donation Box',
  'testimonial': 'Testimonial',
  'services-heading': 'Heading',
  'social-follow': 'Social Follow',
  'social': 'Social Follow',
  'products': 'Product List',
  'btn-primary': 'Button',
  'btn-outlined': 'Button',
  'login': 'Login / Signup',
};

const COMPONENT_VARIANTS: Record<string, { name: string; options: string[]; default: string }[]> = {
  Button: [
    { name: 'Variant', options: ['Default', 'Secondary', 'Outlined'], default: 'Default' },
  ],
};

interface ComponentColorGroup {
  title: string;
  tokens: Array<{ variable: string; label: string; fallback: string }>;
}

const GENERAL_TOKENS = { variable: '--fg-primary', label: 'Title', fallback: '#000000' };
const BG_TOKEN = { variable: '--bg-fill', label: 'Background', fallback: '#FFFFFF' };
const BORDER_TOKEN = { variable: '--border', label: 'Border', fallback: '#DADEF3' };
const ICON_COLOR = { variable: '--fg-brand', label: 'Color', fallback: '#7D38EF' };
const ICON_BG = { variable: '--bg-surface-brand', label: 'Background', fallback: '#EDE8FE' };
const BTN_TEXT = { variable: '--fg-inverse', label: 'Text', fallback: '#FFFFFF' };
const BTN_FILL = { variable: '--bg-fill-brand', label: 'Fill', fallback: '#7D38EF' };
const SECONDARY_TEXT = { variable: '--fg-secondary', label: 'Description', fallback: '#353C6A' };

const COMPONENT_COLOR_GROUPS: Record<string, ComponentColorGroup[]> = {
  'Heading': [
    { title: 'General', tokens: [GENERAL_TOKENS, SECONDARY_TEXT] },
  ],
  'Button': [
    { title: 'General', tokens: [BTN_TEXT, BTN_FILL] },
  ],
  'Card': [
    { title: 'General', tokens: [GENERAL_TOKENS, SECONDARY_TEXT, BG_TOKEN, BORDER_TOKEN] },
    { title: 'Icon', tokens: [ICON_COLOR, ICON_BG] },
    { title: 'Button', tokens: [BTN_TEXT, BTN_FILL] },
  ],
  'Daily Tasks': [
    { title: 'General', tokens: [GENERAL_TOKENS, SECONDARY_TEXT, BG_TOKEN, BORDER_TOKEN] },
    { title: 'Icon', tokens: [ICON_COLOR, ICON_BG] },
    { title: 'Button', tokens: [BTN_TEXT, BTN_FILL] },
  ],
  'Bar Chart': [
    { title: 'General', tokens: [GENERAL_TOKENS, SECONDARY_TEXT, BG_TOKEN, BORDER_TOKEN] },
    { title: 'Icon', tokens: [ICON_COLOR, ICON_BG] },
  ],
  'Line Chart': [
    { title: 'General', tokens: [GENERAL_TOKENS, SECONDARY_TEXT, BG_TOKEN, BORDER_TOKEN] },
    { title: 'Icon', tokens: [ICON_COLOR, ICON_BG] },
  ],
  'List': [
    { title: 'General', tokens: [GENERAL_TOKENS, SECONDARY_TEXT, BG_TOKEN] },
    { title: 'Icon & Action', tokens: [ICON_COLOR, ICON_BG] },
  ],
  'Form': [
    { title: 'General', tokens: [GENERAL_TOKENS, SECONDARY_TEXT, BG_TOKEN, BORDER_TOKEN] },
    { title: 'Icon', tokens: [ICON_COLOR, ICON_BG] },
    { title: 'Badge', tokens: [BTN_TEXT, BTN_FILL] },
  ],
  'Table': [
    { title: 'General', tokens: [GENERAL_TOKENS, SECONDARY_TEXT, BG_TOKEN, BORDER_TOKEN] },
    { title: 'Icon', tokens: [ICON_COLOR, ICON_BG] },
    { title: 'Badge', tokens: [BTN_TEXT, BTN_FILL] },
  ],
  'Document': [
    { title: 'General', tokens: [GENERAL_TOKENS, SECONDARY_TEXT, BG_TOKEN, BORDER_TOKEN] },
    { title: 'Icon', tokens: [ICON_COLOR, ICON_BG] },
  ],
  'Sign Document': [
    { title: 'General', tokens: [GENERAL_TOKENS, SECONDARY_TEXT, BG_TOKEN, BORDER_TOKEN] },
    { title: 'Icon', tokens: [ICON_COLOR, ICON_BG] },
    { title: 'Badge', tokens: [BTN_TEXT, BTN_FILL] },
  ],
  'Donation Box': [
    { title: 'General', tokens: [GENERAL_TOKENS, SECONDARY_TEXT, BG_TOKEN, BORDER_TOKEN] },
    { title: 'Button', tokens: [BTN_TEXT, BTN_FILL] },
  ],
  'Testimonial': [
    { title: 'General', tokens: [GENERAL_TOKENS, BG_TOKEN] },
    { title: 'Icon', tokens: [ICON_COLOR, ICON_BG] },
  ],
  'Login / Signup': [
    { title: 'General', tokens: [GENERAL_TOKENS, SECONDARY_TEXT, BG_TOKEN, BORDER_TOKEN] },
    { title: 'Button', tokens: [BTN_TEXT, BTN_FILL] },
  ],
  'Social Follow': [
    { title: 'Icon', tokens: [ICON_COLOR, ICON_BG] },
  ],
  'Product List': [
    { title: 'General', tokens: [GENERAL_TOKENS, SECONDARY_TEXT, BG_TOKEN] },
    { title: 'Icon', tokens: [ICON_COLOR, ICON_BG] },
    { title: 'Button', tokens: [BTN_TEXT, BTN_FILL] },
  ],
};

const FONT_OPTIONS = [
  'Inter',
  'Frances',
  'IBM Plex Mono',
  'Fredoka',
  'JetBrains Mono',
  'Instrument Sans',
  'Figtree',
  'Hanken Grotesk',
  'Geist',
  'DM Sans',
  'Public Sans',
  'Google Sans',
  'Bricolage Grotesque',
  'Varela Round',
];

const HEADING_FONT_OPTIONS = [
  'Playfair Display',
  'Merriweather',
  'Lora',
  'Libre Baskerville',
  'Fraunces',
  'DM Serif Display',
  'Bitter',
  'Sora',
  'Space Grotesk',
  'Outfit',
  ...FONT_OPTIONS,
];

interface FontPairing {
  heading: string;
  body: string;
  tags: string[];
}

const FONT_PAIRINGS: FontPairing[] = [
  { heading: 'Playfair Display', body: 'DM Sans', tags: ['sophisticated', 'editorial'] },
  { heading: 'Playfair Display', body: 'Source Serif 4', tags: ['elegant', 'traditional'] },
  { heading: 'DM Serif Display', body: 'Libre Baskerville', tags: ['literary', 'warm'] },
  { heading: 'Cormorant Garamond', body: 'Raleway', tags: ['elegant', 'dramatic'] },
  { heading: 'Cormorant Garamond', body: 'Lora', tags: ['dramatic', 'literary'] },
  { heading: 'EB Garamond', body: 'Inter', tags: ['academic', 'refined'] },
  { heading: 'EB Garamond', body: 'Crimson Text', tags: ['scholarly', 'literary'] },
  { heading: 'Merriweather', body: 'Mulish', tags: ['reliable', 'readable'] },
  { heading: 'Lora', body: 'Nunito Sans', tags: ['warm', 'approachable'] },
  { heading: 'Bitter', body: 'Open Sans', tags: ['reliable', 'editorial'] },
  { heading: 'Bitter', body: 'Lora', tags: ['warm', 'narrative'] },
  { heading: 'Space Grotesk', body: 'DM Sans', tags: ['playful', 'startup'] },
  { heading: 'Sora', body: 'Public Sans', tags: ['modern', 'confident'] },
  { heading: 'Outfit', body: 'Libre Baskerville', tags: ['structured', 'professional'] },
  { heading: 'Outfit', body: 'IBM Plex Sans', tags: ['trustworthy', 'precise'] },
  { heading: 'Montserrat', body: 'Karla', tags: ['modern', 'bold'] },
  { heading: 'Plus Jakarta Sans', body: 'PT Serif', tags: ['curated', 'contemporary'] },
  { heading: 'Plus Jakarta Sans', body: 'Inter', tags: ['friendly', 'professional'] },
  { heading: 'Manrope', body: 'DM Sans', tags: ['analytical', 'clear'] },
  { heading: 'Urbanist', body: 'Libre Franklin', tags: ['clean', 'startup'] },
  { heading: 'Bricolage Grotesque', body: 'Figtree', tags: ['creative', 'geometric'] },
  { heading: 'Oswald', body: 'Barlow', tags: ['commanding', 'editorial'] },
  { heading: 'Anton', body: 'Work Sans', tags: ['bold', 'impactful'] },
  { heading: 'Josefin Sans', body: 'Raleway', tags: ['elegant', 'sophisticated'] },
  { heading: 'Quicksand', body: 'Cabin', tags: ['playful', 'approachable'] },
  { heading: 'Poppins', body: 'Hind', tags: ['friendly', 'warm'] },
  { heading: 'Nunito', body: 'Nunito Sans', tags: ['friendly', 'approachable'] },
  { heading: 'Roboto Slab', body: 'Roboto', tags: ['systematic', 'professional'] },
  { heading: 'Archivo Black', body: 'Archivo', tags: ['raw', 'brutalist'] },
  { heading: 'Barlow Condensed', body: 'Barlow', tags: ['efficient', 'modern'] },
  { heading: 'Fjalla One', body: 'Josefin Sans', tags: ['impactful', 'commanding'] },
  { heading: 'Figtree', body: 'Overpass', tags: ['calm', 'clear'] },
  { heading: 'Geist', body: 'Geist', tags: ['modern', 'minimal'] },
  { heading: 'Inter', body: 'Inter', tags: ['clean', 'neutral'] },
];

function loadGoogleFont(fontName: string) {
  const id = `gfont-${fontName.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

/**
 * Convert hex to OKLab components
 */
function hexToOklab(hex: string): { L: number; C: number; H: number } {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const R = toLinear(r), G = toLinear(g), B = toLinear(b);
  const l = 0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B;
  const m = 0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B;
  const s = 0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bv = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  const C = Math.sqrt(a * a + bv * bv);
  let H = Math.atan2(bv, a) * 180 / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

/**
 * Calculate relative luminance and return brand-tinted contrast color
 */
function getContrastColor(hex: string, brandHex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  if (luminance > 0.4) {
    // Dark text: use brand hue with very low lightness
    const { H } = hexToOklab(brandHex);
    return `oklch(0.20 0.08 ${Math.round(H)})`;
  }
  return '#FFFFFF';
}

function applyPaletteToDOM(palette: PaletteShade[]) {
  const root = document.documentElement;
  const map: Record<string, string> = {};
  for (const shade of palette) {
    map[shade.key] = shade.hex;
  }

  // Only set primitive palette — semantic tokens reference these via var()
  root.style.setProperty('--primary-50', map['50']);
  root.style.setProperty('--primary-100', map['100']);
  root.style.setProperty('--primary-200', map['200']);
  root.style.setProperty('--primary-300', map['300']);
  root.style.setProperty('--primary-400', map['400']);
  root.style.setProperty('--primary-500', map['500']);
  root.style.setProperty('--primary-600', map['600']);
  root.style.setProperty('--primary-700', map['700']);
  root.style.setProperty('--primary-800', map['800']);
  root.style.setProperty('--primary-900', map['900']);
  root.style.setProperty('--primary-950', map['950']);

  // Auto-contrast: set fg-inverse based on button bg luminance
  // Light mode uses primary-600, dark mode uses primary-400
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const btnBgShade = dark ? map['400'] : map['600'];
  root.style.setProperty('--fg-inverse', getContrastColor(btnBgShade, map['600']));
}

function hslHueToHex(h: number): string {
  // Fixed saturation 75%, lightness 45% for vibrant brand colors
  const s = 0.75;
  const l = 0.45;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function hexToHslHue(hex: string): number {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    const d = max - min;
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return Math.round(h * 360);
}

function resetPalette() {
  const root = document.documentElement;
  const props = [
    '--primary-50', '--primary-100', '--primary-200', '--primary-300', '--primary-400',
    '--primary-500', '--primary-600', '--primary-700', '--primary-800', '--primary-900', '--primary-950',
    '--fg-inverse',
  ];
  props.forEach(p => root.style.removeProperty(p));
}

function isDarkMode(): boolean {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

// --- Token Editor definitions ---

interface SemanticToken {
  variable: string;
  label: string;
}

interface TokenCategory {
  name: string;
  tokens: SemanticToken[];
}

const TOKEN_CATEGORIES: TokenCategory[] = [
  {
    name: 'Background',
    tokens: [
      { variable: '--bg-page', label: 'Main' },
      { variable: '--bg-surface', label: 'Page' },
      { variable: '--bg-fill', label: 'Card' },
    ],
  },
  {
    name: 'Brand',
    tokens: [
      { variable: '--bg-surface-brand', label: 'Icon Background' },
      { variable: '--bg-fill-brand', label: 'Button' },
      { variable: '--fg-brand', label: 'Icon & Link' },
    ],
  },
  {
    name: 'Text',
    tokens: [
      { variable: '--fg-primary', label: 'Heading' },
      { variable: '--fg-secondary', label: 'Body' },
      { variable: '--fg-tertiary', label: 'Subtle' },
    ],
  },
  {
    name: 'Border',
    tokens: [
      { variable: '--border', label: 'Border' },
      { variable: '--border-hover', label: 'Divider' },
    ],
  },
];

/**
 * Resolve a CSS custom property to a hex color.
 * Uses a canvas to convert any CSS color format (oklch, rgb, hsl, etc.) to hex.
 */
const _tokenCanvas = document.createElement('canvas');
_tokenCanvas.width = 1;
_tokenCanvas.height = 1;
const _tokenCtx = _tokenCanvas.getContext('2d', { willReadFrequently: true })!;

function resolveTokenColor(variable: string): string {
  const temp = document.createElement('div');
  temp.style.color = `var(${variable})`;
  document.documentElement.appendChild(temp);
  const resolved = getComputedStyle(temp).color;
  document.documentElement.removeChild(temp);
  _tokenCtx.clearRect(0, 0, 1, 1);
  _tokenCtx.fillStyle = '#000000';
  _tokenCtx.fillStyle = resolved;
  _tokenCtx.fillRect(0, 0, 1, 1);
  const [r, g, b] = _tokenCtx.getImageData(0, 0, 1, 1).data;
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

function TokenSwatch({ variable, label, color, gradient, isEditing, onEdit }: {
  variable: string;
  label: string;
  color: string;
  gradient?: string;
  isEditing: boolean;
  onEdit: (variable: string, rect: DOMRect) => void;
}) {
  return (
    <button
      className={`edit-theme-panel__row${isEditing ? ' edit-theme-panel__row--editing' : ''}`}
      onClick={(e) => onEdit(variable, e.currentTarget.getBoundingClientRect())}
      title={`${label} (${variable})`}
    >
      <span
        className="edit-theme-panel__row-color"
        style={{ background: gradient || color }}
      />
      <span className="edit-theme-panel__row-label">{label}</span>
      <span className="edit-theme-panel__row-hex">{gradient ? 'Gradient' : color}</span>
    </button>
  );
}



function FontDropdown({ fonts, active, onChange }: { fonts: string[]; active: string; onChange: (f: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fonts.forEach(loadGoogleFont);
  }, [fonts]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="preset-dropdown" ref={ref}>
      <button className="preset-dropdown__trigger" onClick={() => setOpen(!open)}>
        <span className="preset-dropdown__label font-preview" style={{ fontFamily: `'${active}', sans-serif` }}>{active}</span>
        <Icon name="ChevronDown" size={16} className={`preset-dropdown__chevron${open ? ' open' : ''}`} />
      </button>
      {open && (
        <div className="preset-dropdown__menu">
          {fonts.map((f) => (
            <button
              key={f}
              className={`preset-dropdown__item font-preview${f === active ? ' active' : ''}`}
              style={{ fontFamily: `'${f}', sans-serif` }}
              onClick={() => { onChange(f); setOpen(false); }}
            >
              <span className="preset-dropdown__item-label font-preview">{f}</span>
              {f === active && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="preset-dropdown__check"><path d="M20 6 9 17l-5-5"/></svg>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FontPairingDropdown({ pairings, activeHeading, activeBody, onSelect }: {
  pairings: FontPairing[];
  activeHeading: string;
  activeBody: string;
  onSelect: (p: FontPairing) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pairings.forEach(p => { loadGoogleFont(p.heading); loadGoogleFont(p.body); });
  }, [pairings]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const activePairing = pairings.find(p => p.heading === activeHeading && p.body === activeBody);

  return (
    <div className="preset-dropdown" ref={ref}>
      <button className="preset-dropdown__trigger" onClick={() => setOpen(!open)}>
        <span className="preset-dropdown__label">
          {activePairing ? (
            <span className="font-pairing-label">
              <span className="font-preview" style={{ fontFamily: `'${activePairing.heading}', sans-serif`, fontWeight: 600 }}>{activePairing.heading}</span>
              <span className="font-pairing-label__sep">+</span>
              <span className="font-preview" style={{ fontFamily: `'${activePairing.body}', sans-serif` }}>{activePairing.body}</span>
            </span>
          ) : 'Select a pairing'}
        </span>
        <Icon name="ChevronDown" size={16} className={`preset-dropdown__chevron${open ? ' open' : ''}`} />
      </button>
      {open && (
        <div className="preset-dropdown__menu font-pairing-menu">
          {pairings.map((p, i) => {
            const isActive = p.heading === activeHeading && p.body === activeBody;
            return (
              <button
                key={i}
                className={`preset-dropdown__item font-pairing-item${isActive ? ' active' : ''}`}
                onClick={() => { onSelect(p); setOpen(false); }}
              >
                <div className="font-pairing-item__fonts">
                  <span className="font-pairing-item__heading font-preview" style={{ fontFamily: `'${p.heading}', sans-serif` }}>{p.heading}</span>
                  <span className="font-pairing-item__body font-preview" style={{ fontFamily: `'${p.body}', sans-serif` }}>{p.body}</span>
                </div>
                {isActive && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="preset-dropdown__check"><path d="M20 6 9 17l-5-5"/></svg>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getSecondaryColor(primaryHex: string, offsetDegrees: number): string {
  const primaryHue = hexToHslHue(primaryHex);
  const secondaryHue = (primaryHue + offsetDegrees) % 360;
  return hslHueToHex(secondaryHue);
}

interface ThemesViewProps {
  onDone?: () => void;
  previewDevice?: 'desktop' | 'mobile';
  onDownloadRef?: MutableRefObject<(() => void) | null>;
}

export function ThemesView({ onDone, previewDevice = 'desktop', onDownloadRef }: ThemesViewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);

  const handleDownloadScreenshot = useCallback(async () => {
    const isMobile = previewDevice === 'mobile';
    const el = isMobile ? deviceRef.current : canvasRef.current;
    if (!el) return;
    try {
      // --- Pre-capture: fix SVG styles ---
      const inlineSvgStyles = (node: Element) => {
        if (node instanceof SVGElement) {
          const cs = getComputedStyle(node);
          node.style.fill = cs.fill;
          node.style.stroke = cs.stroke;
          if (cs.opacity !== '1') node.style.opacity = cs.opacity;
        }
        for (const child of node.children) inlineSvgStyles(child);
      };
      const svgs = el.querySelectorAll('svg');
      const svgBackup = Array.from(svgs).map((s) => ({ html: s.innerHTML, style: s.getAttribute('style') }));
      svgs.forEach((s) => inlineSvgStyles(s));

      // --- Pre-capture: fix placeholders ---
      const fgDisabled = getComputedStyle(document.documentElement).getPropertyValue('--fg-disabled').trim();
      const phBackup: { el: HTMLInputElement; v: string; c: string }[] = [];
      el.querySelectorAll<HTMLInputElement>('input[placeholder],textarea[placeholder]').forEach((inp) => {
        if (!inp.value) {
          phBackup.push({ el: inp, v: inp.value, c: inp.style.color });
          inp.value = inp.placeholder;
          inp.style.color = fgDisabled;
        }
      });

      // --- Fake scroll position via DOM manipulation ---
      const scrollY = el.scrollTop;
      const h = el.clientHeight;
      const origStyles = el.getAttribute('style') || '';

      el.style.overflow = 'hidden';
      el.style.height = `${h}px`;

      // Shift content children up by scrollY, skip bottom-nav
      const bottomNav = el.querySelector('.bottom-nav') as HTMLElement | null;
      const children = Array.from(el.children) as HTMLElement[];
      const childTransforms: string[] = [];
      children.forEach((child) => {
        childTransforms.push(child.style.transform);
        if (child !== bottomNav) {
          child.style.transform = `translateY(-${scrollY}px)`;
        }
      });

      // Pin bottom-nav to bottom
      const navOrigStyle = bottomNav?.getAttribute('style') || '';
      if (bottomNav) {
        bottomNav.style.position = 'absolute';
        bottomNav.style.bottom = '0';
        bottomNav.style.left = '0';
        bottomNav.style.right = '0';
      }

      el.style.position = 'relative';
      el.scrollTop = 0;

      // --- Single capture ---
      const dataUrl = await toPng(el, {
        pixelRatio: isMobile ? 3 : (window.devicePixelRatio || 1),
        style: { borderRadius: '0' },
      });

      // --- Restore everything ---
      el.setAttribute('style', origStyles);
      el.scrollTop = scrollY;
      children.forEach((child, i) => {
        child.style.transform = childTransforms[i];
      });
      if (bottomNav) bottomNav.setAttribute('style', navOrigStyle);
      svgs.forEach((s, i) => {
        s.innerHTML = svgBackup[i].html;
        if (svgBackup[i].style) s.setAttribute('style', svgBackup[i].style!);
        else s.removeAttribute('style');
      });
      phBackup.forEach(({ el: inp, v, c }) => { inp.value = v; inp.style.color = c; });

      // --- Download ---
      const link = document.createElement('a');
      link.download = `theme-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Screenshot failed:', err);
    }
  }, [previewDevice]);

  useEffect(() => {
    if (onDownloadRef) onDownloadRef.current = handleDownloadScreenshot;
    return () => { if (onDownloadRef) onDownloadRef.current = null; };
  }, [onDownloadRef, handleDownloadScreenshot]);

  // No JS scale needed — CSS handles mobile device sizing
  const { library: activeIconLibrary, iconStyle: activeIconStyle, setLibrary: setIconLibrary, setIconStyle } = useIconLibrary();
  const [activeTab, setActiveTab] = useState<'colors' | 'style' | 'font' | null>(null);
  const [colorMode, setColorMode] = useState<'light' | 'dark' | 'system'>(() => {
    const stored = localStorage.getItem('jf-lib-theme');
    if (stored === 'system') return 'system';
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  });
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [tint, setTint] = useState(DEFAULT_TINT);
  const [font, setFont] = useState(DEFAULT_FONT);
  const [headingFont, setHeadingFont] = useState(DEFAULT_HEADING_FONT);
  const [radius, setRadius] = useState<RadiusScale>(DEFAULT_RADIUS as RadiusScale);
  const [, setPalette] = useState<PaletteShade[]>(() => generatePalette(DEFAULT_COLOR, isDarkMode()));
  const [harmonyOffset, setHarmonyOffset] = useState(DEFAULT_HARMONY);
  const [secondaryEnabled] = useState(false);
  const [activePreset, setActivePreset] = useState('Default');

  const applySecondary = useCallback((primaryColor: string, offset: number, dark: boolean) => {
    const secondaryColor = getSecondaryColor(primaryColor, offset);
    const secondaryPalette = generatePalette(secondaryColor, dark);
    applySecondaryPaletteToDOM(secondaryPalette);
  }, []);

  const applyHeadingFontToDOM = useCallback((hFont: string, bodyFont: string) => {
    if (hFont) {
      loadGoogleFont(hFont);
      document.documentElement.style.setProperty('--font-family-heading', `'${hFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
    } else {
      document.documentElement.style.setProperty('--font-family-heading', `'${bodyFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
    }
  }, []);

  const applyPreset = useCallback((preset: ThemePreset) => {
    setActivePreset(preset.name);
    // Clear any token overrides when applying a preset
    for (const cat of TOKEN_CATEGORIES) {
      for (const tok of cat.tokens) {
        document.documentElement.style.removeProperty(tok.variable);
      }
    }
    // Clear derived overrides
    document.documentElement.style.removeProperty('--fg-disabled');
    // Clear gradient
    document.documentElement.style.removeProperty('--bg-page-gradient');
    setColorPickerMode('solid');
    setTokenOverrides({});
    setComponentOverrides({});
    setComponentRadius({});
    setSelectedPreviewItem(null);
    setEditingToken(null);
    setTokenEditorOpen(false);
    setColor(preset.color);
    const newPalette = generatePalette(preset.color, preset.mode === 'dark');
    setPalette(newPalette);
    applyPaletteToDOM(newPalette);
    setHarmonyOffset(preset.harmonyOffset);
    if (secondaryEnabled) {
      applySecondary(preset.color, preset.harmonyOffset, preset.mode === 'dark');
    }
    setTint(preset.tint);
    applyNeutralToDOM(generateNeutralPalette(preset.color, preset.tint, preset.mode === 'dark'));
    setFont(preset.font);
    loadGoogleFont(preset.font);
    document.documentElement.style.setProperty('--font-family', `'${preset.font}', -apple-system, BlinkMacSystemFont, sans-serif`);
    setHeadingFont(preset.headingFont);
    applyHeadingFontToDOM(preset.headingFont, preset.font);
    setRadius(preset.radius);
    applyRadius(preset.radius, canvasRef.current);
    loadLibrary(preset.iconLibrary, 'outline').then(() => {
      setIconLibrary(preset.iconLibrary);
      setIconStyle('outline');
    });
    setColorMode(preset.mode);
    if (preset.mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('jf-lib-theme', preset.mode);
  }, [secondaryEnabled, applySecondary, applyHeadingFontToDOM, setIconLibrary, setIconStyle]);

  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor);
    const newPalette = generatePalette(newColor, isDarkMode());
    setPalette(newPalette);
    applyPaletteToDOM(newPalette);
    if (secondaryEnabled) {
      applySecondary(newColor, harmonyOffset, isDarkMode());
    }
    applyNeutralToDOM(generateNeutralPalette(newColor, tint, isDarkMode()));
    // Global change — clear component overrides
    setComponentOverrides({});
    setComponentRadius({});
    setSelectedPreviewItem(null);
  }, [tint, harmonyOffset, secondaryEnabled, applySecondary]);

  const handleGradientChange = useCallback((start: string, end: string) => {
    setGradientStart(start);
    setGradientEnd(end);
    document.documentElement.style.setProperty('--bg-page-gradient', `linear-gradient(to bottom, ${start}, ${end})`);
  }, []);

  const handleTintChange = useCallback((newTint: number) => {
    setTint(newTint);
    const neutralPalette = generateNeutralPalette(color, newTint, isDarkMode());
    applyNeutralToDOM(neutralPalette);
  }, [color]);

  const handleFontChange = useCallback((newFont: string) => {
    setFont(newFont);
    loadGoogleFont(newFont);
    document.documentElement.style.setProperty('--font-family', `'${newFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
    setHeadingFont((prev) => {
      if (!prev) {
        document.documentElement.style.setProperty('--font-family-heading', `'${newFont}', -apple-system, BlinkMacSystemFont, sans-serif`);
      }
      return prev;
    });
  }, []);

  const handleHeadingFontChange = useCallback((newFont: string) => {
    setHeadingFont(newFont);
    setFont((currentBody) => {
      applyHeadingFontToDOM(newFont, currentBody);
      return currentBody;
    });
  }, [applyHeadingFontToDOM]);

  const handlePairingSelect = useCallback((pairing: FontPairing) => {
    setFont(pairing.body);
    loadGoogleFont(pairing.body);
    document.documentElement.style.setProperty('--font-family', `'${pairing.body}', -apple-system, BlinkMacSystemFont, sans-serif`);
    setHeadingFont(pairing.heading);
    applyHeadingFontToDOM(pairing.heading, pairing.body);
  }, [applyHeadingFontToDOM]);

  const handleIconLibraryChange = useCallback(async (lib: IconLibrary) => {
    await loadLibrary(lib, 'outline');
    setIconLibrary(lib);
    setIconStyle('outline');
  }, [setIconLibrary, setIconStyle]);

  const handleIconStyleChange = useCallback(async (style: IconStyle) => {
    await loadLibrary(activeIconLibrary, style);
    setIconStyle(style);
  }, [activeIconLibrary, setIconStyle]);

  const handleRadiusChange = useCallback((scale: RadiusScale) => {
    setRadius(scale);
    applyRadius(scale, canvasRef.current);
  }, []);

  const handleColorModeChange = useCallback((mode: 'light' | 'dark' | 'system') => {
    setColorMode(mode);
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    } else if (mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('jf-lib-theme', mode);
  }, []);

  const handleTabToggle = useCallback((tab: 'colors' | 'style' | 'font') => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  }, []);

  // Apply palette + neutrals + secondary whenever dependencies change, and on theme toggle
  useEffect(() => {
    const palette = generatePalette(color, isDarkMode());
    applyPaletteToDOM(palette);
    if (secondaryEnabled) {
      applySecondary(color, harmonyOffset, isDarkMode());
    } else {
      resetSecondaryPalette();
    }
    applyNeutralToDOM(generateNeutralPalette(color, tint, isDarkMode()));

    const observer = new MutationObserver(() => {
      applyPaletteToDOM(generatePalette(color, isDarkMode()));
      if (secondaryEnabled) {
        applySecondary(color, harmonyOffset, isDarkMode());
      }
      applyNeutralToDOM(generateNeutralPalette(color, tint, isDarkMode()));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      observer.disconnect();
    };
  }, [color, tint, harmonyOffset, secondaryEnabled, applySecondary]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetPalette();
      resetSecondaryPalette();
      resetNeutral();
      resetRadius(canvasRef.current);
      document.documentElement.style.removeProperty('--font-family');
      document.documentElement.style.removeProperty('--font-family-heading');
      // Clean up token overrides
      for (const cat of TOKEN_CATEGORIES) {
        for (const tok of cat.tokens) {
          document.documentElement.style.removeProperty(tok.variable);
        }
      }
    };
  }, []);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<string | null>(null);
  const [componentOverrides, setComponentOverrides] = useState<Record<string, Record<string, string>>>({});
  const [componentRadius, setComponentRadius] = useState<Record<string, RadiusScale>>({});
  const [componentVariants, setComponentVariants] = useState<Record<string, Record<string, string>>>({});
  const togglePreviewSelect = useCallback((id: string) => {
    setSelectedPreviewItem((prev) => (prev === id ? null : id));
    setTokenEditorOpen(false);
    setEditingToken(null);
  }, []);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const [mobilePickerOpen, setMobilePickerOpen] = useState(false);
  const [mobileFontSheet, setMobileFontSheet] = useState<'pairing' | 'heading' | 'body' | null>(null);
  // Sidebar version: 'v1' | 'v2' — change here to switch
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sidebarVersion] = useState<'v1' | 'v2'>('v2');
  const pickerRef = useRef<HTMLDivElement>(null);
  const customBtnRef = useRef<HTMLButtonElement>(null);

  // Token editor state
  const [tokenEditorOpen, setTokenEditorOpen] = useState(false);
  const [tokenOverrides, setTokenOverrides] = useState<Record<string, string>>({});
  const [editingToken, setEditingToken] = useState<string | null>(null);
  const [resolvedTokenColors, setResolvedTokenColors] = useState<Record<string, string>>({});
  const [tokenPickerPos, setTokenPickerPos] = useState({ top: 0, left: 0 });
  const [tokenOpacity, setTokenOpacity] = useState(100);
  const [colorPickerMode, setColorPickerMode] = useState<'solid' | 'gradient'>('solid');
  const [gradientStart, setGradientStart] = useState(color);
  const [gradientEnd, setGradientEnd] = useState('#FFFFFF');
  const tokenPickerRef = useRef<HTMLDivElement>(null);

  // Reposition picker if it overflows viewport bottom
  useEffect(() => {
    if (editingToken && tokenPickerRef.current) {
      requestAnimationFrame(() => {
        const el = tokenPickerRef.current;
        if (!el) return;
        const pickerRect = el.getBoundingClientRect();
        if (pickerRect.bottom > window.innerHeight) {
          // Move up: picker bottom aligns with swatch top (8px gap)
          const swatchTop = tokenPickerPos.top - 8; // tokenPickerPos.top = rect.bottom + 8
          const newTop = swatchTop - pickerRect.height - 8;
          el.style.top = `${Math.max(8, newTop)}px`;
        }
      });
    }
  }, [editingToken, tokenPickerPos]);

  // Resolve all token colors when editor opens or theme changes
  const resolveAllTokens = useCallback(() => {
    const colors: Record<string, string> = {};
    for (const category of TOKEN_CATEGORIES) {
      for (const token of category.tokens) {
        colors[token.variable] = resolveTokenColor(token.variable);
      }
    }
    setResolvedTokenColors(colors);
  }, []);

  useEffect(() => {
    if (tokenEditorOpen || selectedPreviewItem) {
      resolveAllTokens();
    }
  }, [tokenEditorOpen, selectedPreviewItem, colorMode, color, tint, resolveAllTokens]);

  // Also re-resolve when data-theme changes
  useEffect(() => {
    if (!tokenEditorOpen && !selectedPreviewItem) return;
    const observer = new MutationObserver(() => {
      resolveAllTokens();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [tokenEditorOpen, resolveAllTokens]);

  const handleTokenColorChange = useCallback((variable: string, newColor: string) => {
    document.documentElement.style.setProperty(variable, newColor);
    setTokenOverrides((prev) => ({ ...prev, [variable]: newColor }));
    setResolvedTokenColors((prev) => ({ ...prev, [variable]: newColor }));
    // Clear gradient when bg-page is set as solid color
    if (variable === '--bg-page') {
      document.documentElement.style.removeProperty('--bg-page-gradient');
    }
    // Tertiary also drives disabled text
    if (variable === '--fg-tertiary') {
      document.documentElement.style.setProperty('--fg-disabled', newColor);
    }
    // Brand fill → regenerate entire primary palette
    if (variable === '--bg-fill-brand') {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newPalette = generatePalette(newColor, isDark);
      applyPaletteToDOM(newPalette);
      // Override fg-inverse based on actual brand fill color (not palette shade)
      document.documentElement.style.setProperty('--fg-inverse', getContrastColor(newColor, newColor));
      // Re-apply existing token overrides on top of new palette
      setTokenOverrides((prev) => {
        for (const [v, c] of Object.entries(prev)) {
          if (v !== variable) {
            document.documentElement.style.setProperty(v, c);
          }
        }
        return prev;
      });
    }
  }, []);

  const handleResetTokenOverrides = useCallback(() => {
    for (const variable of Object.keys(tokenOverrides)) {
      document.documentElement.style.removeProperty(variable);
    }
    document.documentElement.style.removeProperty('--fg-disabled');
    setTokenOverrides({});
    setEditingToken(null);
    // Re-resolve after reset
    setTimeout(() => resolveAllTokens(), 50);
  }, [tokenOverrides, resolveAllTokens]);

  // Close token picker on outside click
  useEffect(() => {
    if (!editingToken) return;
    const handleClick = (e: MouseEvent) => {
      if (tokenPickerRef.current && !tokenPickerRef.current.contains(e.target as Node)) {
        setEditingToken(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [editingToken]);

  // Close picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [pickerOpen]);

  const sidebarContent: ReactNode = (
    <>
        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Themes</h3>
          <div className="color-theme-grid">
            {/* Custom color button */}
            <div className="color-theme-grid__custom-wrapper" ref={pickerRef}>
              <button
                ref={customBtnRef}
                className={`color-theme-grid__custom${activePreset === '' ? ' active customized' : ''}`}
                style={activePreset === '' ? { background: color } : undefined}
                onClick={() => {
                  if (activePreset !== '') {
                    setActivePreset('');
                  }
                  if (!pickerOpen && customBtnRef.current) {
                    const rect = customBtnRef.current.getBoundingClientRect();
                    const sidebar = customBtnRef.current.closest('.themes-view__sidebar');
                    const sidebarRect = sidebar?.getBoundingClientRect();
                    const left = sidebarRect ? sidebarRect.left + 16 : rect.left;
                    setPickerPos({ top: rect.bottom + 8, left });
                  }
                  setPickerOpen(!pickerOpen);
                }}
                title="Custom color"
              >
                <div className="color-theme-grid__custom-inner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </button>
              {pickerOpen && (
                <div className="color-theme-grid__picker-popup" style={{ top: pickerPos.top, left: pickerPos.left }}>
                  <ColorPicker color={color} onChange={handleColorChange} tint={tint} onTintChange={handleTintChange} />
                </div>
              )}
            </div>
            {THEME_PRESETS.map((preset) => {
              loadGoogleFont(preset.headingFont || preset.font);
              return (
              <button
                key={preset.name}
                className={`color-theme-grid__item${activePreset === preset.name ? ' active' : ''}`}
                onClick={() => { applyPreset(preset); setPickerOpen(false); }}
                title={preset.name}
              >
                <div className="color-theme-grid__outer" style={{ backgroundColor: preset.color }} />
              </button>
              );
            })}
          </div>
        </div>

        {/* Secondary color section hidden for now */}

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Appearing</h3>
          <div className="themes-view__appearing-options">
            {(['light', 'dark'] as const).map((mode) => (
              <button
                key={mode}
                className={`themes-view__appearing-btn${colorMode === mode ? ' active' : ''}`}
                onClick={() => handleColorModeChange(mode)}
              >
                {mode === 'light' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
                <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Font Pairing</h3>
          <FontPairingDropdown
            pairings={FONT_PAIRINGS}
            activeHeading={headingFont || font}
            activeBody={font}
            onSelect={handlePairingSelect}
          />
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Heading Font</h3>
          <FontDropdown fonts={HEADING_FONT_OPTIONS} active={headingFont || font} onChange={handleHeadingFontChange} />
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Body Font</h3>
          <FontDropdown fonts={FONT_OPTIONS} active={font} onChange={handleFontChange} />
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Border Radius</h3>
          <div className="themes-view__radius-options">
            {RADIUS_MODES.map(({ scale, lg }) => {
              const r = parseInt(lg);
              return (
                <button
                  key={scale}
                  className={`themes-view__radius-btn${radius === scale ? ' active' : ''}`}
                  onClick={() => handleRadiusChange(scale)}
                  title={scale}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={`M4 24 V${r} Q4 4 ${r} 4 H24`} strokeLinecap="round" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        <div className="themes-view__sidebar-section">
          <h3 className="themes-view__sidebar-title">Icon Style</h3>
          <div className="themes-view__icon-library-options themes-view__icon-library-options--4col">
            {([
              { lib: 'lucide' as const, style: 'outline' as const, svg: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              )},
              { lib: 'phosphor' as const, style: 'outline' as const, svg: (
                <svg width="24" height="24" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="32" y="48" width="192" height="160" rx="8"/><circle cx="96" cy="112" r="20"/><path d="M224,168l-44.69-44.69a8,8,0,0,0-11.31,0L100.69,190.6,83.31,173.31a8,8,0,0,0-11.31,0L32,213.09"/>
                </svg>
              )},
              { lib: 'tabler' as const, style: 'outline' as const, svg: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 8h.01"/><rect width="16" height="16" x="4" y="4" rx="3"/><path d="m4 15 4-4a3 5 0 0 1 3 0l5 5"/><path d="m14 14 1-1a3 5 0 0 1 3 0l2 2"/>
                </svg>
              )},
              { lib: 'phosphor' as const, style: 'fill' as const, svg: (
                <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm-60,64a12,12,0,1,1,12,12A12,12,0,0,1,156,104ZM40,200V172l52-52,80,80Zm176,0H194.63l-56-56,20-20L216,181.38Z"/>
                </svg>
              )},
            ]).map(({ lib, style, svg }) => {
              const isActive = activeIconLibrary === lib && activeIconStyle === style;
              return (
                <button
                  key={`${lib}-${style}`}
                  className={`themes-view__icon-library-btn${isActive ? ' active' : ''}`}
                  onClick={() => { handleIconLibraryChange(lib); handleIconStyleChange(style); }}
                >
                  {svg}
                </button>
              );
            })}
          </div>
        </div>

    </>
  );

  const PRESET_SHORT_NAMES: Record<string, string> = {
    'Default': 'Default',
    'Ocean Breeze': 'Sky',
    'Sunset': 'Sunset',
    'Forest': 'Mint',
    'Dark Elegance': 'Elegance',
    'Cherry Night': 'Cherry',
    'Aqua Night': 'Aqua',
    'Cozy': 'Cozy',
    'Monochrome': 'Mono',
  };


  const [designerTab, setDesignerTab] = useState<'general' | 'layout'>('general');
  const [mobileEditThemeOpen, setMobileEditThemeOpen] = useState(false);
  const [mobileTokenPickerOpen, setMobileTokenPickerOpen] = useState(false);
  const mobileEditThemeScrollRef = useRef(0);

  const sidebarContentV2: ReactNode = tokenEditorOpen ? (
    <div className="edit-theme-panel">
      <div className="edit-theme-panel__header">
        <button
          className="edit-theme-panel__back"
          onClick={() => {
            setTokenEditorOpen(false);
            setEditingToken(null);
          }}
        >
          <Icon name="ArrowLeft" size={18} />
        </button>
        <span className="edit-theme-panel__title">Edit Theme</span>
      </div>
      <div className="edit-theme-panel__body">
        {TOKEN_CATEGORIES.map((category) => (
          <div key={category.name} className="edit-theme-panel__category">
            <h4 className="edit-theme-panel__category-title">{category.name}</h4>
            <div className="edit-theme-panel__tokens">
              {category.tokens.map((token) => {
                const currentColor = tokenOverrides[token.variable] || resolvedTokenColors[token.variable] || '#000000';
                return (
                  <TokenSwatch
                    key={token.variable}
                    variable={token.variable}
                    label={token.label}
                    color={currentColor}
                    gradient={token.variable === '--bg-page' && colorPickerMode === 'gradient' ? `linear-gradient(to bottom, ${gradientStart}, ${gradientEnd})` : undefined}
                    isEditing={editingToken === token.variable}
                    onEdit={(v, rect) => {
                      const opening = editingToken !== v;
                      setEditingToken(opening ? v : null);
                      if (opening) {
                        setPickerOpen(false);
                        setTokenPickerPos({ top: rect.bottom + 8, left: rect.left });
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
        {Object.keys(tokenOverrides).length > 0 && (
          <div className="edit-theme-panel__reset-wrapper">
            <button className="edit-theme-panel__reset-btn" onClick={handleResetTokenOverrides}>
              <Icon name="RotateCcw" size={14} />
              <span>Reset All Overrides</span>
            </button>
          </div>
        )}
      </div>
      {editingToken && (
        <div className="color-theme-grid__picker-popup" ref={tokenPickerRef} style={{ top: tokenPickerPos.top, left: tokenPickerPos.left }}>
          {editingToken === '--bg-page' ? (
            <ColorPicker
              color={tokenOverrides[editingToken] || resolvedTokenColors[editingToken] || '#000000'}
              onChange={(newColor) => handleTokenColorChange(editingToken, newColor)}
              tint={tint}
              onTintChange={handleTintChange}
              hideTint
              opacity={tokenOpacity}
              onOpacityChange={setTokenOpacity}
              showTabs
              mode={colorPickerMode}
              onModeChange={setColorPickerMode}
              gradientStart={gradientStart}
              gradientEnd={gradientEnd}
              onGradientChange={handleGradientChange}
            />
          ) : (
            <TokenColorPicker
              color={tokenOverrides[editingToken] || resolvedTokenColors[editingToken] || '#000000'}
              onChange={(newColor) => handleTokenColorChange(editingToken, newColor)}
              tint={tint}
              onTintChange={handleTintChange}
              mode="Opacity"
              opacity={tokenOpacity}
              onOpacityChange={setTokenOpacity}
            />
          )}
        </div>
      )}
    </div>
  ) : selectedPreviewItem ? (
    <div className="edit-theme-panel">
      <div className="sidebar-panel__header">
        <span className="sidebar-panel__title">{COMPONENT_NAMES[selectedPreviewItem] || selectedPreviewItem} Properties</span>
        <button className="sidebar-panel__close" onClick={() => setSelectedPreviewItem(null)}>
          <Icon name="X" size={20} />
        </button>
      </div>
      <div className="edit-theme-panel__body">
        {/* Colors */}
          {(COMPONENT_COLOR_GROUPS[COMPONENT_NAMES[selectedPreviewItem] || ''] || [
            { title: 'General', tokens: [GENERAL_TOKENS, BG_TOKEN] },
          ]).map(({ title, tokens }) => (
            <div key={title} className="edit-theme-panel__category">
              <h4 className="edit-theme-panel__category-title">{title}</h4>
              <div className="edit-theme-panel__tokens">
                {tokens.map(({ variable, label, fallback }) => (
                  <TokenSwatch
                    key={variable}
                    variable={variable}
                    label={label}
                    color={componentOverrides[selectedPreviewItem]?.[variable] || resolvedTokenColors[variable] || fallback}
                    isEditing={editingToken === `comp:${selectedPreviewItem}:${variable}`}
                    onEdit={(_v, rect) => {
                      const key = `comp:${selectedPreviewItem}:${variable}`;
                      const opening = editingToken !== key;
                      setEditingToken(opening ? key : null);
                      if (opening) {
                        setPickerOpen(false);
                        setTokenPickerPos({ top: rect.bottom + 8, left: rect.left });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        {/* Variants */}
        {COMPONENT_VARIANTS[COMPONENT_NAMES[selectedPreviewItem] || ''] && (
          COMPONENT_VARIANTS[COMPONENT_NAMES[selectedPreviewItem] || ''].map(({ name, options, default: def }) => (
            <div key={name} className="edit-theme-panel__category">
              <h4 className="edit-theme-panel__category-title">{name}</h4>
              <div className="v2-segmented">
                {options.map((opt) => (
                  <button
                    key={opt}
                    className={`v2-segmented__btn${(componentVariants[selectedPreviewItem!]?.[name] || def) === opt ? ' v2-segmented__btn--active' : ''}`}
                    onClick={() => setComponentVariants((prev) => ({
                      ...prev,
                      [selectedPreviewItem!]: { ...prev[selectedPreviewItem!], [name]: opt },
                    }))}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
        {/* Corner Style */}
        <div className="edit-theme-panel__category">
          <h4 className="edit-theme-panel__category-title">Corner Style</h4>
          <div className="v2-segmented">
            {([
              { scale: 'Small' as RadiusScale, r: 6 },
              { scale: 'Medium' as RadiusScale, r: 12 },
              { scale: 'Large' as RadiusScale, r: 16 },
              { scale: 'XLarge' as RadiusScale, r: 24 },
            ]).map(({ scale, r }) => (
              <button
                key={scale}
                className={`v2-segmented__btn${(componentRadius[selectedPreviewItem] || radius) === scale ? ' v2-segmented__btn--active' : ''}`}
                onClick={() => setComponentRadius((prev) => ({ ...prev, [selectedPreviewItem!]: scale }))}
                title={scale}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={`M4 24 V${r} Q4 4 ${r} 4 H24`} strokeLinecap="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        {/* Reset */}
        {(Object.keys(componentOverrides[selectedPreviewItem] || {}).length > 0 || componentRadius[selectedPreviewItem] || Object.keys(componentVariants[selectedPreviewItem] || {}).length > 0) && (
          <div className="edit-theme-panel__reset-wrapper">
            <button className="edit-theme-panel__reset-btn" onClick={() => {
              setComponentOverrides((prev) => {
                const next = { ...prev };
                delete next[selectedPreviewItem!];
                return next;
              });
              setComponentRadius((prev) => {
                const next = { ...prev };
                delete next[selectedPreviewItem!];
                return next;
              });
              setComponentVariants((prev) => {
                const next = { ...prev };
                delete next[selectedPreviewItem!];
                return next;
              });
              setEditingToken(null);
            }}>
              <Icon name="RotateCcw" size={14} />
              <span>Reset All Overrides</span>
            </button>
          </div>
        )}
      </div>
      {/* Color picker popup for component overrides */}
      {editingToken?.startsWith('comp:') && (() => {
        const parts = editingToken.split(':');
        const compId = parts[1];
        const variable = parts[2];
        const currentColor = componentOverrides[compId]?.[variable] || resolvedTokenColors[variable] || '#000000';
        return (
          <div className="color-theme-grid__picker-popup" ref={tokenPickerRef} style={{ top: tokenPickerPos.top, left: tokenPickerPos.left }}>
            <TokenColorPicker
              color={currentColor}
              onChange={(newColor) => {
                setComponentOverrides((prev) => {
                  const updated = { ...prev[compId], [variable]: newColor };
                  // Derive hover/contrast when brand fill changes
                  if (variable === '--bg-fill-brand') {
                    const hex = newColor.replace('#', '');
                    const r = Math.max(0, Math.round(parseInt(hex.substring(0, 2), 16) * 0.88));
                    const g = Math.max(0, Math.round(parseInt(hex.substring(2, 4), 16) * 0.88));
                    const b = Math.max(0, Math.round(parseInt(hex.substring(4, 6), 16) * 0.88));
                    updated['--bg-fill-brand-hover'] = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
                    updated['--fg-inverse'] = getContrastColor(newColor, newColor);
                  }
                  return { ...prev, [compId]: updated };
                });
              }}
              tint={tint}
              onTintChange={handleTintChange}
              mode="Opacity"
              opacity={tokenOpacity}
              onOpacityChange={setTokenOpacity}
            />
          </div>
        );
      })()}
    </div>
  ) : (
    <>
        {/* Sidebar Header */}
        <div className="sidebar-panel__header">
          <span className="sidebar-panel__title">App Designer</span>
          <button className="sidebar-panel__close">
            <Icon name="X" size={20} />
          </button>
        </div>
        {/* Tab Bar */}
        <div className="sidebar-panel__tabs">
          <button
            className={`sidebar-panel__tab${designerTab === 'general' ? ' sidebar-panel__tab--active' : ''}`}
            onClick={() => setDesignerTab('general')}
          >
            General
          </button>
          <button
            className={`sidebar-panel__tab${designerTab === 'layout' ? ' sidebar-panel__tab--active' : ''}`}
            onClick={() => setDesignerTab('layout')}
          >
            Layout
          </button>
        </div>
        {/* Color Themes */}
        <div className="v2-section v2-section--color-themes">
          <h3 className="v2-section__title">Themes</h3>
          <div className="v2-preset-grid">
            {THEME_PRESETS.map((preset) => {
              const isActive = activePreset === preset.name;
              loadGoogleFont(preset.headingFont || preset.font);
              return (
                <div key={preset.name} className="v2-preset-grid__item">
                  <button
                    className={`color-theme-grid__item${isActive ? ' active' : ''}`}
                    onClick={() => { applyPreset(preset); setPickerOpen(false); }}
                    title={preset.name}
                  >
                    <div className="color-theme-grid__outer" style={{ background: `linear-gradient(145deg, color-mix(in srgb, ${preset.color}, #fff 20%) 0%, ${preset.color} 50%, color-mix(in srgb, ${preset.color}, #000 25%) 100%)` }} />
                  </button>
                  <span className={`v2-preset-grid__label${isActive ? ' v2-preset-grid__label--active' : ''}`}>{PRESET_SHORT_NAMES[preset.name] || preset.name}</span>
                </div>
              );
            })}
            {/* Custom color button */}
            <div className="v2-preset-grid__item">
              <div className="color-theme-grid__custom-wrapper" ref={pickerRef}>
                <button
                  ref={customBtnRef}
                  className={`color-theme-grid__custom${activePreset === '' ? ' active customized' : ''}`}
                  style={activePreset === '' ? { background: color } : undefined}
                  onClick={() => {
                    if (activePreset !== '') setActivePreset('');
                    if (!pickerOpen && customBtnRef.current) {
                      const rect = customBtnRef.current.getBoundingClientRect();
                      setPickerPos({ top: rect.bottom + 8, left: rect.right - 268 });
                    }
                    setPickerOpen(!pickerOpen);
                  }}
                  title="Custom color"
                >
                  <div className="color-theme-grid__custom-inner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </button>
                {pickerOpen && (
                  <div className="color-theme-grid__picker-popup" style={{ top: pickerPos.top, left: pickerPos.left }}>
                    <ColorPicker color={color} onChange={handleColorChange} tint={tint} onTintChange={handleTintChange} />
                  </div>
                )}
              </div>
              <span className={`v2-preset-grid__label${activePreset === '' ? ' v2-preset-grid__label--active' : ''}`}>Custom</span>
            </div>
          </div>
          <button className="v2-edit-theme-btn" onClick={() => {
            if (activePreset !== '') setActivePreset('');
            setTokenEditorOpen(true);
            setPickerOpen(false);
            resolveAllTokens();
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M3.333 4.167c0-.46.373-.834.834-.834H10c.46 0 .833-.373.833-.833S10.46 1.667 10 1.667H4.167A2.5 2.5 0 001.667 4.167v11.666a2.5 2.5 0 002.5 2.5h11.666a2.5 2.5 0 002.5-2.5V10c0-.46-.373-.833-.833-.833s-.833.373-.833.833v5.833c0 .461-.373.834-.834.834H4.167a.833.833 0 01-.834-.834V4.167zM9.033 7.642a1.667 1.667 0 01.507-1.17l4.536-4.536a2.083 2.083 0 012.926 0l.724.725a2.083 2.083 0 010 2.926l-4.536 4.536c-.232.232-.517.406-.83.506l-1.927.62a1.667 1.667 0 01-2.02-2.02l.62-1.928zm1.685.35a.833.833 0 00-.098.16l-.584 1.815 1.815-.584a.833.833 0 00.161-.098l2.76-2.76-1.294-1.294-2.76 2.76zm5.83-3.243l-.598.597-1.293-1.293.597-.598a.417.417 0 01.57 0l.724.725a.417.417 0 010 .569z"/></svg>
            <span>Edit Theme</span>
          </button>
        </div>

        {/* Color Mode */}
        <div className="v2-section">
          <h3 className="v2-section__title">Color Mode</h3>
          <div className="v2-segmented">
            <button
              className={`v2-segmented__btn${colorMode === 'light' ? ' v2-segmented__btn--active' : ''}`}
              onClick={() => handleColorModeChange('light')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              <span>Light</span>
            </button>
            <button
              className={`v2-segmented__btn${colorMode === 'dark' ? ' v2-segmented__btn--active' : ''}`}
              onClick={() => handleColorModeChange('dark')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              <span>Dark</span>
            </button>
          </div>
        </div>

        {/* Corners */}
        <div className="v2-section">
          <h3 className="v2-section__title">Corner Style</h3>
          <div className="v2-segmented">
            {([
              { scale: 'Small' as RadiusScale, r: 6 },
              { scale: 'Medium' as RadiusScale, r: 12 },
              { scale: 'Large' as RadiusScale, r: 16 },
              { scale: 'XLarge' as RadiusScale, r: 24 },
            ]).map(({ scale, r }) => (
              <button
                key={scale}
                className={`v2-segmented__btn${radius === scale ? ' v2-segmented__btn--active' : ''}`}
                onClick={() => handleRadiusChange(scale)}
                title={scale}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={`M4 24 V${r} Q4 4 ${r} 4 H24`} strokeLinecap="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Heading Font */}
        <div className="v2-section">
          <h3 className="v2-section__title">Heading Font</h3>
          <FontDropdown fonts={HEADING_FONT_OPTIONS} active={headingFont || font} onChange={handleHeadingFontChange} />
        </div>

        {/* Body Font */}
        <div className="v2-section">
          <h3 className="v2-section__title">Body Font</h3>
          <FontDropdown fonts={FONT_OPTIONS} active={font} onChange={handleFontChange} />
        </div>
    </>
  );

  const getWrapperProps = useCallback((id: string) => {
    const overrides = componentOverrides[id];
    const compRadius = componentRadius[id];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const style: any = { cursor: 'pointer' };
    if (overrides) {
      Object.assign(style, overrides);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props: any = {
      onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); togglePreviewSelect(id); },
      style,
    };
    if (compRadius && compRadius !== 'Medium') {
      props['data-radius'] = compRadius.toLowerCase();
    }
    return props;
  }, [componentOverrides, componentRadius, togglePreviewSelect]);

  const handleCanvasClick = useCallback((e: { target: EventTarget | null; currentTarget: EventTarget | null }) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.themes-view__app') === e.target) {
      setSelectedPreviewItem(null);
    }
  }, []);

  return (
    <div className="themes-view">
      {/* Mobile: top bar */}
      <div className="themes-top-bar" data-theme="dark">
        <div className="themes-top-bar__left">
          <Icon name="Palette" size={24} />
          <span className="themes-top-bar__title">Design</span>
        </div>
        {onDone && (
          <button className="themes-top-bar__done" onClick={onDone}>
            Done
          </button>
        )}
      </div>

      {/* Left: Settings Panel (desktop) */}
      <aside className={`themes-view__sidebar${sidebarVersion === 'v2' ? ' themes-view__sidebar--v2' : ''}`} data-theme="dark">
        {sidebarVersion === 'v1' ? sidebarContent : sidebarContentV2}
      </aside>

      {/* Mobile: bottom tab bar + bottom sheets */}
      {sidebarVersion === 'v1' && <><div className="themes-bottom-bar" data-theme="dark">
        <button
          className={`themes-bottom-bar__tab${activeTab === 'colors' ? ' active' : ''}`}
          onClick={() => handleTabToggle('colors')}
        >
          <Icon name="Palette" size={20} />
          <span>Colors</span>
        </button>
        <button
          className={`themes-bottom-bar__tab${activeTab === 'style' ? ' active' : ''}`}
          onClick={() => handleTabToggle('style')}
        >
          <Icon name="Contrast" size={20} />
          <span>Style</span>
        </button>
        <button
          className={`themes-bottom-bar__tab${activeTab === 'font' ? ' active' : ''}`}
          onClick={() => handleTabToggle('font')}
        >
          <Icon name="Type" size={20} />
          <span>Font</span>
        </button>
      </div>

      <BottomSheet open={activeTab === 'colors'} onClose={() => setActiveTab(null)} title="Colors" noOverlay dark>
        <div className="themes-sheet-content">
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Themes</h3>
            <div className="color-theme-grid">
              <button
                className={`color-theme-grid__custom${activePreset === '' ? ' active customized' : ''}`}
                style={activePreset === '' ? { background: color } : undefined}
                onClick={() => { setActivePreset(''); setMobilePickerOpen(true); }}
              >
                <div className="color-theme-grid__custom-inner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </button>
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  className={`color-theme-grid__item${activePreset === preset.name ? ' active' : ''}`}
                  onClick={() => { applyPreset(preset); }}
                  title={preset.name}
                >
                  <div className="color-theme-grid__outer" style={{ backgroundColor: preset.color }} />
                </button>
              ))}
            </div>
          </div>
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Appearing</h3>
            <div className="themes-view__appearing-options">
              {(['light', 'dark'] as const).map((mode) => (
                <button
                  key={mode}
                  className={`themes-view__appearing-btn${colorMode === mode ? ' active' : ''}`}
                  onClick={() => handleColorModeChange(mode)}
                >
                  {mode === 'light' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  )}
                  <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet open={activeTab === 'style'} onClose={() => setActiveTab(null)} title="Style" noOverlay dark>
        <div className="themes-sheet-content">
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Border Radius</h3>
            <div className="themes-view__radius-options">
              {RADIUS_MODES.map(({ scale, lg }) => {
                const r = parseInt(lg);
                return (
                  <button
                    key={scale}
                    className={`themes-view__radius-btn${radius === scale ? ' active' : ''}`}
                    onClick={() => handleRadiusChange(scale)}
                    title={scale}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={`M4 24 V${r} Q4 4 ${r} 4 H24`} strokeLinecap="round" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Icon Style</h3>
            <div className="themes-view__icon-library-options themes-view__icon-library-options--4col">
              {([
                { lib: 'lucide' as const, style: 'outline' as const, svg: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                )},
                { lib: 'phosphor' as const, style: 'outline' as const, svg: (
                  <svg width="24" height="24" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="32" y="48" width="192" height="160" rx="8"/><circle cx="96" cy="112" r="20"/><path d="M224,168l-44.69-44.69a8,8,0,0,0-11.31,0L100.69,190.6,83.31,173.31a8,8,0,0,0-11.31,0L32,213.09"/>
                  </svg>
                )},
                { lib: 'tabler' as const, style: 'outline' as const, svg: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 8h.01"/><rect width="16" height="16" x="4" y="4" rx="3"/><path d="m4 15 4-4a3 5 0 0 1 3 0l5 5"/><path d="m14 14 1-1a3 5 0 0 1 3 0l2 2"/>
                  </svg>
                )},
                { lib: 'phosphor' as const, style: 'fill' as const, svg: (
                  <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm-60,64a12,12,0,1,1,12,12A12,12,0,0,1,156,104ZM40,200V172l52-52,80,80Zm176,0H194.63l-56-56,20-20L216,181.38Z"/>
                  </svg>
                )},
              ]).map(({ lib, style, svg }) => {
                const isActive = activeIconLibrary === lib && activeIconStyle === style;
                return (
                  <button
                    key={`${lib}-${style}`}
                    className={`themes-view__icon-library-btn${isActive ? ' active' : ''}`}
                    onClick={() => { handleIconLibraryChange(lib); handleIconStyleChange(style); }}
                  >
                    {svg}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet open={activeTab === 'font'} onClose={() => setActiveTab(null)} title="Typography" noOverlay dark>
        <div className="themes-sheet-content">
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Font Pairing</h3>
            <button className="themes-sheet-content__font-trigger" onClick={() => setMobileFontSheet('pairing')}>
              <span className="font-preview" style={{ fontFamily: `'${headingFont || font}', sans-serif`, fontWeight: 600 }}>{headingFont || font}</span>
              <span style={{ color: 'var(--fg-tertiary)' }}>+</span>
              <span className="font-preview" style={{ fontFamily: `'${font}', sans-serif` }}>{font}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Heading Font</h3>
            <button className="themes-sheet-content__font-trigger" onClick={() => setMobileFontSheet('heading')}>
              <span className="font-preview" style={{ fontFamily: `'${headingFont || font}', sans-serif` }}>{headingFont || font}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          <div className="themes-sheet-content__section">
            <h3 className="themes-view__sidebar-title">Body Font</h3>
            <button className="themes-sheet-content__font-trigger" onClick={() => setMobileFontSheet('body')}>
              <span className="font-preview" style={{ fontFamily: `'${font}', sans-serif` }}>{font}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Font Pairing Sheet */}
      <BottomSheet open={mobileFontSheet === 'pairing'} onClose={() => setMobileFontSheet(null)} title="Font Pairing" noOverlay dark>
        <div className="themes-sheet-content themes-sheet-content--font-list">
          {FONT_PAIRINGS.map((p, i) => {
            const isActive = p.heading === (headingFont || font) && p.body === font;
            loadGoogleFont(p.heading);
            loadGoogleFont(p.body);
            return (
              <button
                key={i}
                className={`themes-sheet-content__font-item${isActive ? ' active' : ''}`}
                onClick={() => handlePairingSelect(p)}
              >
                <div className="themes-sheet-content__font-item-text">
                  <span className="font-preview" style={{ fontFamily: `'${p.heading}', sans-serif`, fontWeight: 600, fontSize: 16, color: '#e8e9ed' }}>{p.heading}</span>
                  <span className="font-preview" style={{ fontFamily: `'${p.body}', sans-serif`, fontSize: 13, color: '#8b90a8' }}>{p.body}</span>
                </div>
                {isActive && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary)', flexShrink: 0 }}><path d="M20 6 9 17l-5-5"/></svg>
                )}
              </button>
            );
          })}
        </div>
      </BottomSheet>

      {/* Heading Font Sheet */}
      <BottomSheet open={mobileFontSheet === 'heading'} onClose={() => setMobileFontSheet(null)} title="Heading Font" noOverlay dark>
        <div className="themes-sheet-content themes-sheet-content--font-list">
          {HEADING_FONT_OPTIONS.map((f) => {
            const isActive = f === (headingFont || font);
            loadGoogleFont(f);
            return (
              <button
                key={f}
                className={`themes-sheet-content__font-item${isActive ? ' active' : ''}`}
                onClick={() => handleHeadingFontChange(f)}
              >
                <span className="font-preview" style={{ fontFamily: `'${f}', sans-serif`, color: '#e8e9ed' }}>{f}</span>
                {isActive && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary)', flexShrink: 0 }}><path d="M20 6 9 17l-5-5"/></svg>
                )}
              </button>
            );
          })}
        </div>
      </BottomSheet>

      {/* Body Font Sheet */}
      <BottomSheet open={mobileFontSheet === 'body'} onClose={() => setMobileFontSheet(null)} title="Body Font" noOverlay dark>
        <div className="themes-sheet-content themes-sheet-content--font-list">
          {FONT_OPTIONS.map((f) => {
            const isActive = f === font;
            loadGoogleFont(f);
            return (
              <button
                key={f}
                className={`themes-sheet-content__font-item${isActive ? ' active' : ''}`}
                onClick={() => handleFontChange(f)}
              >
                <span className="font-preview" style={{ fontFamily: `'${f}', sans-serif`, color: '#e8e9ed' }}>{f}</span>
                {isActive && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary)', flexShrink: 0 }}><path d="M20 6 9 17l-5-5"/></svg>
                )}
              </button>
            );
          })}
        </div>
      </BottomSheet>

      <BottomSheet open={mobilePickerOpen} onClose={() => setMobilePickerOpen(false)} title="Custom Color" noOverlay dark>
        <div className="themes-sheet-content themes-sheet-content--picker">
          <ColorPicker color={color} onChange={handleColorChange} tint={tint} onTintChange={handleTintChange} />
        </div>
      </BottomSheet></>}

      {/* V2 Mobile: bottom tab bar + bottom sheets */}
      {sidebarVersion === 'v2' && <>
      <div className="themes-bottom-bar themes-bottom-bar--v2" data-theme="dark">
        <button
          className={`themes-bottom-bar__tab${activeTab === 'colors' ? ' active' : ''}`}
          onClick={() => handleTabToggle('colors')}
        >
          <Icon name="Palette" size={20} />
          <span>Themes</span>
        </button>
        <button
          className={`themes-bottom-bar__tab${activeTab === 'style' ? ' active' : ''}`}
          onClick={() => handleTabToggle('style')}
        >
          <Icon name="Contrast" size={20} />
          <span>Style</span>
        </button>
        <button
          className={`themes-bottom-bar__tab${activeTab === 'font' ? ' active' : ''}`}
          onClick={() => handleTabToggle('font')}
        >
          <Icon name="Type" size={20} />
          <span>Font</span>
        </button>
      </div>

      <BottomSheet open={activeTab === 'colors'} onClose={() => setActiveTab(null)} title="Themes" noOverlay dark>
        <div className="themes-sheet-content v2-sheet">
          <div className="themes-sheet-content__section">
            <div className="v2-scroll-wrapper" ref={(el) => {
              if (!el) return;
              const scrollEl = el.querySelector('.v2-preset-grid--scroll');
              if (!scrollEl) return;
              const check = () => {
                const atEnd = scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth - 5;
                el.classList.toggle('scrolled-end', atEnd);
              };
              scrollEl.addEventListener('scroll', check, { passive: true });
              check();
            }}>
            <div className="v2-preset-grid v2-preset-grid--scroll">
              <div className="v2-preset-grid__item">
                <button
                  className={`color-theme-grid__custom${activePreset === '' ? ' active customized' : ''}`}
                  style={activePreset === '' ? { background: color } : undefined}
                  onClick={() => { setActivePreset(''); setMobilePickerOpen(true); }}
                >
                  <div className="color-theme-grid__custom-inner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </button>
                <span className={`v2-preset-grid__label${activePreset === '' ? ' v2-preset-grid__label--active' : ''}`}>Custom</span>
              </div>
              {THEME_PRESETS.map((preset) => {
                const isActive = activePreset === preset.name;
                return (
                  <div key={preset.name} className="v2-preset-grid__item">
                    <button
                      className={`color-theme-grid__item${isActive ? ' active' : ''}`}
                      onClick={() => { applyPreset(preset); }}
                      title={preset.name}
                    >
                      <div className="color-theme-grid__outer" style={{ background: `linear-gradient(145deg, color-mix(in srgb, ${preset.color}, #fff 20%) 0%, ${preset.color} 50%, color-mix(in srgb, ${preset.color}, #000 25%) 100%)` }} />
                    </button>
                    <span className={`v2-preset-grid__label${isActive ? ' v2-preset-grid__label--active' : ''}`}>{PRESET_SHORT_NAMES[preset.name] || preset.name}</span>
                  </div>
                );
              })}
            </div>
            </div>
            <button className="v2-edit-theme-btn" onClick={() => {
              setActivePreset('');
              setMobileEditThemeOpen(true);
              resolveAllTokens();
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M3.333 4.167c0-.46.373-.834.834-.834H10c.46 0 .833-.373.833-.833S10.46 1.667 10 1.667H4.167A2.5 2.5 0 001.667 4.167v11.666a2.5 2.5 0 002.5 2.5h11.666a2.5 2.5 0 002.5-2.5V10c0-.46-.373-.833-.833-.833s-.833.373-.833.833v5.833c0 .461-.373.834-.834.834H4.167a.833.833 0 01-.834-.834V4.167zM9.033 7.642a1.667 1.667 0 01.507-1.17l4.536-4.536a2.083 2.083 0 012.926 0l.724.725a2.083 2.083 0 010 2.926l-4.536 4.536c-.232.232-.517.406-.83.506l-1.927.62a1.667 1.667 0 01-2.02-2.02l.62-1.928zm1.685.35a.833.833 0 00-.098.16l-.584 1.815 1.815-.584a.833.833 0 00.161-.098l2.76-2.76-1.294-1.294-2.76 2.76zm5.83-3.243l-.598.597-1.293-1.293.597-.598a.417.417 0 01.57 0l.724.725a.417.417 0 010 .569z"/></svg>
              <span>Edit Theme</span>
            </button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet open={activeTab === 'style'} onClose={() => setActiveTab(null)} title="Style" noOverlay dark>
        <div className="themes-sheet-content v2-sheet">
          <div className="themes-sheet-content__section">
            <h3 className="v2-section__title">Color Mode</h3>
            <div className="v2-segmented">
              <button
                className={`v2-segmented__btn${colorMode === 'light' ? ' v2-segmented__btn--active' : ''}`}
                onClick={() => handleColorModeChange('light')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
                <span>Light</span>
              </button>
              <button
                className={`v2-segmented__btn${colorMode === 'dark' ? ' v2-segmented__btn--active' : ''}`}
                onClick={() => handleColorModeChange('dark')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
                <span>Dark</span>
              </button>
            </div>
          </div>
          <div className="themes-sheet-content__section">
            <h3 className="v2-section__title">Corner Style</h3>
            <div className="v2-segmented">
              {([
                { scale: 'Small' as RadiusScale, r: 6 },
                { scale: 'Medium' as RadiusScale, r: 12 },
                { scale: 'Large' as RadiusScale, r: 16 },
                { scale: 'XLarge' as RadiusScale, r: 24 },
              ]).map(({ scale, r }) => (
                <button
                  key={scale}
                  className={`v2-segmented__btn${radius === scale ? ' v2-segmented__btn--active' : ''}`}
                  onClick={() => handleRadiusChange(scale)}
                  title={scale}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={`M4 24 V${r} Q4 4 ${r} 4 H24`} strokeLinecap="round" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet open={activeTab === 'font'} onClose={() => setActiveTab(null)} title="Font" noOverlay dark>
        <div className="themes-sheet-content v2-sheet">
          <div className="themes-sheet-content__section">
            <h3 className="v2-section__title">Heading Font</h3>
            <button className="themes-sheet-content__font-trigger" onClick={() => setMobileFontSheet('heading')}>
              <span className="font-preview" style={{ fontFamily: `'${headingFont || font}', sans-serif` }}>{headingFont || font}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          <div className="themes-sheet-content__section">
            <h3 className="v2-section__title">Body Font</h3>
            <button className="themes-sheet-content__font-trigger" onClick={() => setMobileFontSheet('body')}>
              <span className="font-preview" style={{ fontFamily: `'${font}', sans-serif` }}>{font}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet open={mobileFontSheet === 'heading'} onClose={() => setMobileFontSheet(null)} title="Heading Font" noOverlay dark>
        <div className="themes-sheet-content themes-sheet-content--font-list v2-sheet">
          {HEADING_FONT_OPTIONS.map((f) => {
            const isActive = f === (headingFont || font);
            loadGoogleFont(f);
            return (
              <button
                key={f}
                className={`themes-sheet-content__font-item${isActive ? ' active' : ''}`}
                onClick={() => handleHeadingFontChange(f)}
              >
                <span className="font-preview" style={{ fontFamily: `'${f}', sans-serif`, color: '#e8e9ed' }}>{f}</span>
                {isActive && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0066C3', flexShrink: 0 }}><path d="M20 6 9 17l-5-5"/></svg>
                )}
              </button>
            );
          })}
        </div>
      </BottomSheet>

      <BottomSheet open={mobileFontSheet === 'body'} onClose={() => setMobileFontSheet(null)} title="Body Font" noOverlay dark>
        <div className="themes-sheet-content themes-sheet-content--font-list v2-sheet">
          {FONT_OPTIONS.map((f) => {
            const isActive = f === font;
            loadGoogleFont(f);
            return (
              <button
                key={f}
                className={`themes-sheet-content__font-item${isActive ? ' active' : ''}`}
                onClick={() => handleFontChange(f)}
              >
                <span className="font-preview" style={{ fontFamily: `'${f}', sans-serif`, color: '#e8e9ed' }}>{f}</span>
                {isActive && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0066C3', flexShrink: 0 }}><path d="M20 6 9 17l-5-5"/></svg>
                )}
              </button>
            );
          })}
        </div>
      </BottomSheet>

      <BottomSheet open={mobilePickerOpen} onClose={() => setMobilePickerOpen(false)} title="Custom Color" noOverlay dark>
        <div className="themes-sheet-content themes-sheet-content--picker v2-sheet">
          <ColorPicker color={color} onChange={handleColorChange} tint={tint} onTintChange={handleTintChange} />
        </div>
      </BottomSheet>
      <BottomSheet open={mobileEditThemeOpen} onClose={() => { setMobileEditThemeOpen(false); setEditingToken(null); }} title="Edit Theme" noOverlay dark>
        <div className="themes-sheet-content v2-sheet v2-sheet--edit-theme" style={{ padding: 0 }} ref={(el) => {
          if (el && mobileEditThemeScrollRef.current) {
            const body = el.closest('.bottom-sheet')?.querySelector('.bottom-sheet__body');
            if (body) requestAnimationFrame(() => { body.scrollTop = mobileEditThemeScrollRef.current; });
          }
        }}>
          <div className="edit-theme-panel__body" style={{ padding: 0 }}>
            {TOKEN_CATEGORIES.map((category) => (
              <div key={category.name} className="edit-theme-panel__category">
                <h4 className="edit-theme-panel__category-title">{category.name}</h4>
                <div className="edit-theme-panel__tokens">
                  {category.tokens.map((token) => {
                    const currentColor = tokenOverrides[token.variable] || resolvedTokenColors[token.variable] || '#000000';
                    return (
                      <TokenSwatch
                        key={token.variable}
                        variable={token.variable}
                        label={token.label}
                        color={currentColor}
                        isEditing={editingToken === token.variable}
                        onEdit={(v) => {
                          setEditingToken(editingToken === v ? null : v);
                          if (editingToken !== v) {
                            const body = document.querySelector('.v2-sheet--edit-theme')?.closest('.bottom-sheet')?.querySelector('.bottom-sheet__body');
                            if (body) mobileEditThemeScrollRef.current = body.scrollTop;
                            setMobileEditThemeOpen(false);
                            setMobileTokenPickerOpen(true);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            {Object.keys(tokenOverrides).length > 0 && (
              <div className="edit-theme-panel__reset-wrapper">
                <button className="edit-theme-panel__reset-btn" onClick={handleResetTokenOverrides}>
                  <Icon name="RotateCcw" size={14} />
                  <span>Reset All Overrides</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </BottomSheet>
      <BottomSheet
        open={mobileTokenPickerOpen && !!editingToken}
        onClose={() => { setMobileTokenPickerOpen(false); setEditingToken(null); setMobileEditThemeOpen(true); }}
        title={TOKEN_CATEGORIES.flatMap((c) => c.tokens).find((t) => t.variable === editingToken)?.label || 'Color'}
        noOverlay
        dark
      >
        <div className="themes-sheet-content themes-sheet-content--picker v2-sheet">
          {editingToken && (
            <ColorPicker
              color={tokenOverrides[editingToken] || resolvedTokenColors[editingToken] || '#000000'}
              onChange={(newColor) => handleTokenColorChange(editingToken, newColor)}
              tint={tint}
              onTintChange={handleTintChange}
            />
          )}
        </div>
      </BottomSheet>
      </>}

      {/* Right: Preview as App Page */}
      <main className={`themes-view__preview${previewDevice === 'mobile' ? ' themes-view__preview--mobile-device' : ''}`} ref={canvasRef}>
        {/* Preview device wrapper */}
        <div ref={deviceRef} className={`themes-view__device${previewDevice === 'mobile' ? ' themes-view__device--mobile' : ''}`}>
        {/* App Header - full width, outside canvas */}
        <AppHeader layout="Center" title="Urban Jungle" subtitle="Istanbul's Rare Plant Haven" />
        <div className="themes-view__canvas" onClick={handleCanvasClick}>
        <div className="themes-view__app">
          {/* Hero Section */}
          <section className="themes-view__section">
            <div {...getWrapperProps('hero-heading')}>
              <Heading selected={selectedPreviewItem === 'hero-heading'} size="Medium" alignment="Center" heading="Welcome to Our Store" subheading="Discover amazing products and support our mission." />
            </div>
            <Paragraph key={activePreset} toolbar="Inline" defaultValue="Jotform App builds complete, cross-platform mobile apps using AI. Build your own app in minutes." />
            <div className="themes-view__btn-row">
              <div {...getWrapperProps('btn-primary')}>
                <Button
                  variant={(componentVariants['btn-primary']?.Variant as ButtonVariant) || 'Default'}
                  label="Get Started" leftIcon="ArrowRight" rightIcon="none" shrinked
                  selected={selectedPreviewItem === 'btn-primary'}
                  fullWidth
                />
              </div>
              <div {...getWrapperProps('btn-outlined')}>
                <Button
                  variant={(componentVariants['btn-outlined']?.Variant as ButtonVariant) || 'Outlined'}
                  label="Learn More" leftIcon="none" rightIcon="none" shrinked
                  selected={selectedPreviewItem === 'btn-outlined'}
                  fullWidth
                />
              </div>
            </div>
          </section>

          {/* Products */}
          <section className="themes-view__section">
            <div {...getWrapperProps('products')}>
              <ProductList selected={selectedPreviewItem === 'products'} title="Featured Products" buttonLabel="Add to Cart" showAddNew={false} products={[
                { name: 'Wireless Headphones', price: '$79.99', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop' },
                { name: 'Smart Watch', price: '$199.99', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop' },
                { name: 'Leather Bag', price: '$129.99', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop' },
                { name: 'Running Shoes', price: '$149.99', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop' },
              ]} />
            </div>
          </section>

          {/* Cards Row */}
          <section className="themes-view__section">
            <div {...getWrapperProps('services-heading')}>
              <Heading selected={selectedPreviewItem === 'services-heading'} size="Small" heading="Our Services" subheading="What we offer" />
            </div>
            <div {...getWrapperProps('card-1')}>
              <Card selected={selectedPreviewItem === 'card-1'} imageStyle="Icon" layout="Horizontal" action="Button" iconName="MessageCircle" title="Consulting" description="Expert guidance for your business" buttonLabel="Book Now" />
            </div>
            <div {...getWrapperProps('card-2')}>
              <Card selected={selectedPreviewItem === 'card-2'} imageStyle="Icon" layout="Horizontal" action="Button" iconName="Palette" title="Design" description="Beautiful interfaces that convert" buttonLabel="View Work" />
            </div>
            <div {...getWrapperProps('card-3')}>
              <Card selected={selectedPreviewItem === 'card-3'} imageStyle="Icon" layout="Horizontal" action="Button" iconName="Code" title="Development" description="Scalable solutions built to last" buttonLabel="Start Project" />
            </div>
            <div {...getWrapperProps('daily-tasks')}>
              <DailyTaskManager selected={selectedPreviewItem === 'daily-tasks'} />
            </div>
            <div {...getWrapperProps('chart-bar')}>
              <Chart type="Bar" iconName="ShoppingCart" selected={selectedPreviewItem === 'chart-bar'} />
            </div>
            <div {...getWrapperProps('chart-line')}>
              <Chart type="Line" iconName="DollarSign" selected={selectedPreviewItem === 'chart-line'} />
            </div>
          </section>

          {/* List Section */}
          <section className="themes-view__section">
            <div {...getWrapperProps('updates-heading')}>
              <Heading selected={selectedPreviewItem === 'updates-heading'} size="Small" heading="Recent Updates" subheading="Stay up to date" />
            </div>
            <div {...getWrapperProps('list')}>
              <List selected={selectedPreviewItem === 'list'} layout="Basic" imageStyle="Square" size="Compact" action="Icon" actionIconFilled={false} items={[
                { title: 'New feature release v2.5', description: 'Performance improvements and bug fixes' },
                { title: 'Community meetup next week', description: 'Join us for the monthly gathering' },
                { title: 'Partnership announcement', description: 'Exciting collaboration coming soon' },
              ]} />
            </div>
          </section>

          {/* Documents & Forms Row */}
          <section className="themes-view__section">
            <div {...getWrapperProps('resources-heading')}>
              <Heading selected={selectedPreviewItem === 'resources-heading'} size="Small" heading="Resources" subheading="Forms and documents" />
            </div>
            <div className="themes-view__docs-row">
              <div {...getWrapperProps('form-1')}>
                <Form selected={selectedPreviewItem === 'form-1'} label="Contact Form" description="Get in touch with us" />
              </div>
              <div {...getWrapperProps('sign-doc')}>
                <SignDocument selected={selectedPreviewItem === 'sign-doc'} label="Terms of Service" description="Required before proceeding" />
              </div>
              <div {...getWrapperProps('table')}>
                <Table selected={selectedPreviewItem === 'table'} label="Submissions" description="View all form responses" />
              </div>
              <div {...getWrapperProps('document')}>
                <Document selected={selectedPreviewItem === 'document'} alignment="Left" size="Normal" fileName="Brand Guidelines.pdf" description="4.2 MB - PDF Document" />
              </div>
            </div>
          </section>

          {/* Login / Signup */}
          <section className="themes-view__section">
            <div {...getWrapperProps('login')}>
              <LoginSignup selected={selectedPreviewItem === 'login'} layout="Left" />
            </div>
          </section>

          {/* Open Form */}
          <section className="themes-view__section">
            <div {...getWrapperProps('reg-heading')}>
              <Heading selected={selectedPreviewItem === 'reg-heading'} size="Small" heading="Registration" subheading="Fill out the form below" />
            </div>
            <div {...getWrapperProps('form-2')}>
              <Form selected={selectedPreviewItem === 'form-2'} showForm />
            </div>
          </section>

          {/* Testimonial */}
          <section className="themes-view__section">
            <div {...getWrapperProps('testimonial')}>
              <Testimonial selected={selectedPreviewItem === 'testimonial'} items={[
                { name: 'Sarah Johnson', text: '\u201CThis platform transformed how we collect donations. The interface is intuitive and our donors love it.\u201D', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' },
                { name: 'Michael Chen', text: '\u201CSetup was incredibly easy. We were up and running in minutes, not days.\u201D', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
                { name: 'Emily Davis', text: '\u201CThe best investment we made for our nonprofit. Highly recommended!\u201D', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
              ]} />
            </div>
          </section>

          {/* Donation */}
          <section className="themes-view__section themes-view__section--center">
            <div {...getWrapperProps('donation')}>
              <DonationBox
                selected={selectedPreviewItem === 'donation'}
                size={previewDevice === 'mobile' ? 'Mobile' : 'Web'}
                headingAlignment="Center"
                title="Support Our Cause"
                description="Every contribution makes a difference in someone's life."
                amounts={['$10.00', '$25.00', '$50.00', '$100.00']}
                showCustomAmount
                buttonLabel="Donate Now"
                goalProgress={72}
                raisedAmount="$7,200"
                goalAmount="$10,000"
              />
            </div>
          </section>

          {/* Footer: Social + Buttons */}
          <section className="themes-view__section themes-view__section--center themes-view__section--footer">
            <div {...getWrapperProps('social')}>
              <SocialFollow selected={selectedPreviewItem === 'social'} filled />
            </div>
          </section>

          {/* Empty States */}
          <section className="themes-view__section">
            <EmptyState />
            <EmptyState mobile />
            <EmptyState variant="Loading" />
          </section>

          {/* Skeleton Lists */}
          <section className="themes-view__section">
            <List layout="Basic" imageStyle="Square" size="Regular" skeleton skeletonAnimation="shimmer" />
            <List layout="Card" cardImageStyle="Square" cardLayout="Vertical" cardSize="Medium" skeleton skeletonAnimation="shimmer" />
          </section>
        </div>
        </div>
        {previewDevice === 'mobile' && <BottomNavigation />}
        </div>
      </main>
    </div>
  );
}
