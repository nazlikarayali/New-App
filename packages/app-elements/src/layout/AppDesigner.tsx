import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../components/Icon/Icon';
import { useIconLibrary, type IconLibrary } from '../context/IconLibraryContext';
import { loadLibrary } from '../utils/iconRegistry';
import { generatePalette, applySecondaryPaletteToDOM, resetSecondaryPalette } from '../utils/colorPalette';
import type { PaletteShade } from '../utils/colorPalette';
import { generateNeutralPalette, applyNeutralToDOM } from '../utils/neutralTint';
import { ColorPicker } from './components/ColorPicker';
import { ColorPicker as TokenColorPicker } from '../components/ColorPicker/ColorPicker';
import { BottomSheet } from './components/BottomSheet';

// ── Constants ──────────────────────────────────────────────────────────

const DEFAULT_COLOR = '#0385C8';
const DEFAULT_FONT = 'DM Sans';
const DEFAULT_HEADING_FONT = 'DM Sans';
const DEFAULT_RADIUS = 'Large';
const DEFAULT_TINT = 30;
const DEFAULT_HARMONY = 150;

type RadiusScale = 'Small' | 'Medium' | 'Large' | 'XLarge';

const FONT_OPTIONS = [
  'Bricolage Grotesque',
  'DM Sans',
  'Figtree',
  'Frances',
  'Fredoka',
  'Geist',
  'Google Sans',
  'Hanken Grotesk',
  'IBM Plex Mono',
  'Instrument Sans',
  'Inter',
  'JetBrains Mono',
  'Public Sans',
  'Varela Round',
];

const HEADING_FONT_OPTIONS = [
  'Bitter',
  'DM Serif Display',
  'Fraunces',
  'Libre Baskerville',
  'Lora',
  'Merriweather',
  'Outfit',
  'Playfair Display',
  'Sora',
  'Space Grotesk',
  ...FONT_OPTIONS,
].sort();

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

const LIGHT_PRESETS: ThemePreset[] = [
  { name: 'Default', color: '#0385C8', font: 'DM Sans', headingFont: 'DM Sans', iconLibrary: 'lucide', radius: 'Large', tint: 30, mode: 'light', harmonyOffset: 150, scheme: { brand: '#0385C8', surface: '#D3E9FF', text: '#0385C8' } },
  { name: 'Amethyst', color: '#7D38EF', font: 'Inter', headingFont: '', iconLibrary: 'lucide', radius: 'Medium', tint: 50, mode: 'light', harmonyOffset: 150, scheme: { brand: '#7D38EF', surface: '#EDE8FE', text: '#7D38EF' } },
  { name: 'Sunset', color: '#F97101', font: 'Bricolage Grotesque', headingFont: '', iconLibrary: 'lucide', radius: 'Large', tint: 60, mode: 'light', harmonyOffset: 180, scheme: { brand: '#F97101', surface: '#FEF3C5', text: '#F97101' } },
  { name: 'Forest', color: '#19A44B', font: 'Public Sans', headingFont: 'Lora', iconLibrary: 'tabler', radius: 'Small', tint: 40, mode: 'light', harmonyOffset: 120, scheme: { brand: '#19A44B', surface: '#DDFBE8', text: '#19A44B' } },
];

const DARK_PRESETS: ThemePreset[] = [
  { name: 'Dark Elegance', color: '#8D5DF9', font: 'Figtree', headingFont: 'Playfair Display', iconLibrary: 'phosphor', radius: 'XLarge', tint: 70, mode: 'dark', harmonyOffset: 160, scheme: { brand: '#8D5DF9', surface: '#F0EBFE', text: '#8D5DF9' } },
  { name: 'Cherry Night', color: '#DF2125', font: 'Instrument Sans', headingFont: 'Merriweather', iconLibrary: 'lucide', radius: 'Medium', tint: 35, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#DF2125', surface: '#FDE8E8', text: '#DF2125' } },
  { name: 'Aqua Night', color: '#00B5D4', font: 'JetBrains Mono', headingFont: '', iconLibrary: 'lucide', radius: 'Medium', tint: 25, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#00B5D4', surface: '#DDF3FF', text: '#00B5D4' } },
  { name: 'Cozy', color: '#8B5E3C', font: 'Lora', headingFont: 'Playfair Display', iconLibrary: 'lucide', radius: 'Large', tint: 80, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#8B5E3C', surface: '#F5EDE6', text: '#8B5E3C' } },
  { name: 'Monochrome', color: '#5A6180', font: 'IBM Plex Mono', headingFont: '', iconLibrary: 'tabler', radius: 'Small', tint: 0, mode: 'dark', harmonyOffset: 150, scheme: { brand: '#5A6180', surface: '#DADEF3', text: '#5A6180' } },
];

const THEME_PRESETS: ThemePreset[] = [...LIGHT_PRESETS, ...DARK_PRESETS];

const PRESET_SHORT_NAMES: Record<string, string> = {
  'Default': 'Sky',
  'Amethyst': 'Amethyst',
  'Sunset': 'Sunset',
  'Forest': 'Mint',
  'Dark Elegance': 'Elegance',
  'Cherry Night': 'Cherry',
  'Aqua Night': 'Aqua',
  'Cozy': 'Cozy',
  'Monochrome': 'Mono',
};

// ── Token Editor ───────────────────────────────────────────────────────

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

// ── Utility Functions ──────────────────────────────────────────────────

function loadGoogleFont(fontName: string) {
  const id = `gfont-${fontName.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

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

function getContrastColor(hex: string, brandHex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  if (luminance > 0.4) {
    const { H } = hexToOklab(brandHex);
    return `oklch(0.20 0.08 ${Math.round(H)})`;
  }
  return '#FFFFFF';
}

function applyPaletteToDOM(palette: PaletteShade[], lightPalette?: PaletteShade[]) {
  const root = document.documentElement;
  const map: Record<string, string> = {};
  for (const shade of palette) {
    map[shade.key] = shade.hex;
  }
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
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const btnBgShade = dark ? map['400'] : map['600'];
  root.style.setProperty('--fg-inverse', getContrastColor(btnBgShade, map['600']));

  // Light-mode-locked tokens for floating buttons (never inverted)
  if (lightPalette) {
    const lightMap: Record<string, string> = {};
    for (const shade of lightPalette) {
      lightMap[shade.key] = shade.hex;
    }
    root.style.setProperty('--btn-primary-bg', lightMap['950']);
    root.style.setProperty('--btn-primary-fg', lightMap['50']);
    root.style.setProperty('--btn-brand', lightMap['600']);
  }
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

function hslHueToHex(h: number): string {
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

function getSecondaryColor(primaryHex: string, offsetDegrees: number): string {
  const primaryHue = hexToHslHue(primaryHex);
  const secondaryHue = (primaryHue + offsetDegrees) % 360;
  return hslHueToHex(secondaryHue);
}

function isDarkMode(): boolean {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function applyRadius(scale: RadiusScale, targets: NodeListOf<HTMLElement> | null) {
  if (!targets || targets.length === 0) return;
  targets.forEach((target) => {
    if (scale === 'Medium') {
      target.removeAttribute('data-radius');
    } else {
      target.setAttribute('data-radius', scale.toLowerCase());
    }
  });
}

/**
 * Apply the Default preset theme to the DOM.
 * Call this on app initialization so components are styled before AppDesigner opens.
 */
export function applyDefaultTheme() {
  const dark = isDarkMode();
  const palette = generatePalette(DEFAULT_COLOR, dark);
  const lightPalette = generatePalette(DEFAULT_COLOR, false);
  applyPaletteToDOM(palette, lightPalette);
  applyNeutralToDOM(generateNeutralPalette(DEFAULT_COLOR, DEFAULT_TINT, dark), DEFAULT_COLOR, DEFAULT_TINT);
  loadGoogleFont(DEFAULT_FONT);
  const headingFamily = DEFAULT_HEADING_FONT || DEFAULT_FONT;
  if (DEFAULT_HEADING_FONT) loadGoogleFont(DEFAULT_HEADING_FONT);
  document.documentElement.style.setProperty('--font-family', `'${DEFAULT_FONT}', -apple-system, BlinkMacSystemFont, sans-serif`);
  document.documentElement.style.setProperty('--font-family-heading', `'${headingFamily}', -apple-system, BlinkMacSystemFont, sans-serif`);
}

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

// ── Sub-components ─────────────────────────────────────────────────────

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

// ── Main Component ─────────────────────────────────────────────────────

interface AppDesignerProps {
  onClose?: () => void;
  targetSelector?: string;
  isMobile?: boolean;
  visible?: boolean;
  renderIcon?: (name: string, size: number) => React.ReactNode;
  doneButton?: React.ReactNode;
}

export function AppDesigner({ onClose, targetSelector = '.app-scope', isMobile, renderIcon, doneButton, visible = true }: AppDesignerProps) {
  const { setLibrary: setIconLibrary, setIconStyle } = useIconLibrary();

  // Theme state
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [tint, setTint] = useState(DEFAULT_TINT);
  const [font, setFont] = useState(DEFAULT_FONT);
  const [headingFont, setHeadingFont] = useState(DEFAULT_HEADING_FONT);
  const [radius, setRadius] = useState<RadiusScale>(DEFAULT_RADIUS as RadiusScale);
  const [, setPalette] = useState<PaletteShade[]>(() => generatePalette(DEFAULT_COLOR, isDarkMode()));
  const [harmonyOffset, setHarmonyOffset] = useState(DEFAULT_HARMONY);
  const [secondaryEnabled] = useState(false);
  const [activePreset, setActivePreset] = useState('Default');
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  });
  const [designerTab, setDesignerTab] = useState<'general' | 'layout'>('general');

  // Picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const pickerPopupRef = useRef<HTMLDivElement>(null);
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

  // Mobile state
  const [activeTab, setActiveTab] = useState<'themes' | 'style' | 'font' | null>(null);
  const [mobileFontSheet, setMobileFontSheet] = useState<'heading' | 'body' | null>(null);
  const [mobilePickerOpen, setMobilePickerOpen] = useState(false);
  const [mobileEditThemeOpen, setMobileEditThemeOpen] = useState(false);
  const [mobileTokenPickerOpen, setMobileTokenPickerOpen] = useState(false);
  const mobileEditThemeScrollRef = useRef(0);

  const handleTabToggle = useCallback((tab: 'themes' | 'style' | 'font') => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  }, []);

  // Reset mobile sheets when panel is hidden
  useEffect(() => {
    if (!visible && isMobile) {
      setActiveTab(null);
      setMobileFontSheet(null);
      setMobilePickerOpen(false);
      setMobileEditThemeOpen(false);
      setMobileTokenPickerOpen(false);
      setEditingToken(null);
    }
  }, [visible, isMobile]);

  const resetMobileState = useCallback(() => {
    setActiveTab(null);
    setMobileFontSheet(null);
    setMobilePickerOpen(false);
    setMobileEditThemeOpen(false);
    setMobileTokenPickerOpen(false);
    setEditingToken(null);
  }, []);

  // ── Target element for radius ──

  const getTargets = useCallback(() => {
    return document.querySelectorAll<HTMLElement>(targetSelector);
  }, [targetSelector]);

  // ── Callbacks ──

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
    for (const cat of TOKEN_CATEGORIES) {
      for (const tok of cat.tokens) {
        document.documentElement.style.removeProperty(tok.variable);
      }
    }
    document.documentElement.style.removeProperty('--fg-disabled');
    document.documentElement.style.removeProperty('--bg-page-gradient');
    setColorPickerMode('solid');
    setTokenOverrides({});
    setEditingToken(null);
    setTokenEditorOpen(false);
    setColor(preset.color);
    const newPalette = generatePalette(preset.color, preset.mode === 'dark');
    setPalette(newPalette);
    applyPaletteToDOM(newPalette, generatePalette(preset.color, false));
    setHarmonyOffset(preset.harmonyOffset);
    if (secondaryEnabled) {
      applySecondary(preset.color, preset.harmonyOffset, preset.mode === 'dark');
    }
    setTint(preset.tint);
    applyNeutralToDOM(generateNeutralPalette(preset.color, preset.tint, preset.mode === 'dark'), preset.color, preset.tint);
    setFont(preset.font);
    loadGoogleFont(preset.font);
    document.documentElement.style.setProperty('--font-family', `'${preset.font}', -apple-system, BlinkMacSystemFont, sans-serif`);
    setHeadingFont(preset.headingFont);
    applyHeadingFontToDOM(preset.headingFont, preset.font);
    setRadius(preset.radius);
    applyRadius(preset.radius, getTargets());
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
  }, [secondaryEnabled, applySecondary, applyHeadingFontToDOM, setIconLibrary, setIconStyle, getTargets]);

  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor);
    const newPalette = generatePalette(newColor, isDarkMode());
    setPalette(newPalette);
    applyPaletteToDOM(newPalette, generatePalette(newColor, false));
    if (secondaryEnabled) {
      applySecondary(newColor, harmonyOffset, isDarkMode());
    }
    applyNeutralToDOM(generateNeutralPalette(newColor, tint, isDarkMode()), newColor, tint);
  }, [tint, harmonyOffset, secondaryEnabled, applySecondary]);

  const handleGradientChange = useCallback((start: string, end: string) => {
    setGradientStart(start);
    setGradientEnd(end);
    document.documentElement.style.setProperty('--bg-page-gradient', `linear-gradient(to bottom, ${start}, ${end})`);
  }, []);

  const handleTintChange = useCallback((newTint: number) => {
    setTint(newTint);
    const neutralPalette = generateNeutralPalette(color, newTint, isDarkMode());
    applyNeutralToDOM(neutralPalette, color, newTint);
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

  const handleRadiusChange = useCallback((scale: RadiusScale) => {
    setRadius(scale);
    applyRadius(scale, getTargets());
  }, [getTargets]);

  const handleColorModeChange = useCallback((mode: 'light' | 'dark') => {
    setColorMode(mode);
    if (mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('jf-lib-theme', mode);
  }, []);

  // ── Token editor callbacks ──

  const resolveAllTokens = useCallback(() => {
    const colors: Record<string, string> = {};
    for (const category of TOKEN_CATEGORIES) {
      for (const token of category.tokens) {
        colors[token.variable] = resolveTokenColor(token.variable);
      }
    }
    setResolvedTokenColors(colors);
  }, []);

  const handleTokenColorChange = useCallback((variable: string, newColor: string) => {
    document.documentElement.style.setProperty(variable, newColor);
    setTokenOverrides((prev) => ({ ...prev, [variable]: newColor }));
    setResolvedTokenColors((prev) => ({ ...prev, [variable]: newColor }));
    if (variable === '--bg-page') {
      document.documentElement.style.removeProperty('--bg-page-gradient');
    }
    if (variable === '--fg-tertiary') {
      document.documentElement.style.setProperty('--fg-disabled', newColor);
    }
    if (variable === '--bg-fill-brand') {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newPalette = generatePalette(newColor, isDark);
      applyPaletteToDOM(newPalette, generatePalette(newColor, false));
      document.documentElement.style.setProperty('--fg-inverse', getContrastColor(newColor, newColor));
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
    setTimeout(() => resolveAllTokens(), 50);
  }, [tokenOverrides, resolveAllTokens]);

  // ── Effects ──

  // Apply palette + neutrals + secondary on changes and theme toggle
  useEffect(() => {
    const lightPalette = generatePalette(color, false);
    const palette = generatePalette(color, isDarkMode());
    applyPaletteToDOM(palette, lightPalette);
    if (secondaryEnabled) {
      applySecondary(color, harmonyOffset, isDarkMode());
    } else {
      resetSecondaryPalette();
    }
    applyNeutralToDOM(generateNeutralPalette(color, tint, isDarkMode()), color, tint);

    const observer = new MutationObserver(() => {
      applyPaletteToDOM(generatePalette(color, isDarkMode()), lightPalette);
      if (secondaryEnabled) {
        applySecondary(color, harmonyOffset, isDarkMode());
      }
      applyNeutralToDOM(generateNeutralPalette(color, tint, isDarkMode()), color, tint);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [color, tint, harmonyOffset, secondaryEnabled, applySecondary]);

  // No cleanup on unmount — theme changes persist after closing the panel

  // Resolve tokens when editor opens or theme changes
  useEffect(() => {
    if (tokenEditorOpen) {
      resolveAllTokens();
    }
  }, [tokenEditorOpen, colorMode, color, tint, resolveAllTokens]);

  // Re-resolve on data-theme attribute change
  useEffect(() => {
    if (!tokenEditorOpen) return;
    const observer = new MutationObserver(() => resolveAllTokens());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [tokenEditorOpen, resolveAllTokens]);

  // Reposition token picker if it overflows viewport
  useEffect(() => {
    if (editingToken && tokenPickerRef.current) {
      requestAnimationFrame(() => {
        const el = tokenPickerRef.current;
        if (!el) return;
        const pickerRect = el.getBoundingClientRect();
        if (pickerRect.bottom > window.innerHeight) {
          const swatchTop = tokenPickerPos.top - 8;
          const newTop = swatchTop - pickerRect.height - 8;
          el.style.top = `${Math.max(8, newTop)}px`;
        }
      });
    }
  }, [editingToken, tokenPickerPos]);

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

  // Close color picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        pickerRef.current && !pickerRef.current.contains(target) &&
        pickerPopupRef.current && !pickerPopupRef.current.contains(target)
      ) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [pickerOpen]);

  // ── Render ──

  const editThemePanel = (
    <div className="edit-theme-panel">
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
      {editingToken && createPortal(
        <div className="color-theme-grid__picker-popup" ref={tokenPickerRef} data-theme="dark" style={{ top: tokenPickerPos.top, left: tokenPickerPos.left }}>
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
        </div>,
        document.body
      )}
    </div>
  );

  // ── Mobile Render ──

  const sheetCloseButton = (onSheetClose: () => void) => (
    <button className="sidebar-panel__close" onClick={onSheetClose}>
      <Icon name="X" size={20} />
    </button>
  );

  if (isMobile) {
    return (
      <>
        {/* Top Bar */}
        <div className="design-top-bar" data-theme="dark">
          <div className="design-top-bar__left">
            <span className="design-top-bar__title">App Designer</span>
          </div>
          <span onClick={resetMobileState}>{doneButton}</span>
        </div>

        {/* Bottom Tab Bar — hidden when a sheet is open */}
        <div className={`design-bottom-bar${activeTab ? ' design-bottom-bar--sheet-open' : ''}`} data-theme="dark">
          <button
            className={`design-bottom-bar__tab${activeTab === 'themes' ? ' active' : ''}`}
            onClick={() => handleTabToggle('themes')}
          >
            {renderIcon?.('palette-filled', 20)}
            <span>Themes</span>
          </button>
          <button
            className={`design-bottom-bar__tab${activeTab === 'style' ? ' active' : ''}`}
            onClick={() => handleTabToggle('style')}
          >
            {renderIcon?.('contrast-filled', 20)}
            <span>Style</span>
          </button>
          <button
            className={`design-bottom-bar__tab${activeTab === 'font' ? ' active' : ''}`}
            onClick={() => handleTabToggle('font')}
          >
            {renderIcon?.('type', 20)}
            <span>Font</span>
          </button>
        </div>

        {/* Themes BottomSheet */}
        <BottomSheet open={activeTab === 'themes'} onClose={() => setActiveTab(null)} title="Themes" noOverlay dark renderCloseButton={sheetCloseButton}>
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

        {/* Style BottomSheet */}
        <BottomSheet open={activeTab === 'style'} onClose={() => setActiveTab(null)} title="Style" noOverlay dark renderCloseButton={sheetCloseButton}>
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

        {/* Font BottomSheet */}
        <BottomSheet open={activeTab === 'font'} onClose={() => setActiveTab(null)} title="Font" noOverlay dark renderCloseButton={sheetCloseButton}>
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

        {/* Heading Font List */}
        <BottomSheet open={mobileFontSheet === 'heading'} onClose={() => setMobileFontSheet(null)} title="Heading Font" noOverlay dark renderCloseButton={sheetCloseButton}>
          <div className="themes-sheet-content themes-sheet-content--font-list themes-sheet-content--font-grid v2-sheet">
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

        {/* Body Font List */}
        <BottomSheet open={mobileFontSheet === 'body'} onClose={() => setMobileFontSheet(null)} title="Body Font" noOverlay dark renderCloseButton={sheetCloseButton}>
          <div className="themes-sheet-content themes-sheet-content--font-list themes-sheet-content--font-grid v2-sheet">
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

        {/* Custom Color Picker */}
        <BottomSheet open={mobilePickerOpen} onClose={() => setMobilePickerOpen(false)} title="Custom Color" noOverlay dark renderCloseButton={sheetCloseButton}>
          <div className="themes-sheet-content themes-sheet-content--picker v2-sheet">
            <ColorPicker color={color} onChange={handleColorChange} tint={tint} onTintChange={handleTintChange} />
          </div>
        </BottomSheet>

        {/* Edit Theme */}
        <BottomSheet open={mobileEditThemeOpen} onClose={() => { setMobileEditThemeOpen(false); setEditingToken(null); }} title="Edit Theme" noOverlay dark renderCloseButton={sheetCloseButton}>
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

        {/* Token Color Picker */}
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
      </>
    );
  }

  // ── Desktop Render ──

  return (
    <>
      {/* Header */}
      <div className="sidebar-panel__header">
        <div className="sidebar-panel__header-left">
          {tokenEditorOpen && (
            <button className="sidebar-panel__back" onClick={() => { setTokenEditorOpen(false); setEditingToken(null); }}>
              <Icon name="ArrowLeft" size={18} />
            </button>
          )}
          <span className="sidebar-panel__title">{tokenEditorOpen ? 'Edit Theme' : 'App Designer'}</span>
        </div>
        {onClose && (
          <button className="sidebar-panel__close" onClick={onClose}>
            <Icon name="X" size={20} />
          </button>
        )}
      </div>

      {/* Sliding content wrapper */}
      <div className={`sidebar-panel__slider${tokenEditorOpen ? ' sidebar-panel__slider--editor' : ''}`}>

      {/* Slide 1: Designer */}
      <div className="sidebar-panel__slide">
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
                    setPickerPos({ top: rect.bottom + 8, left: rect.right - 272 });
                  }
                  setPickerOpen(!pickerOpen);
                }}
                title="Custom color"
              >
                <div className="color-theme-grid__custom-inner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </button>
              {pickerOpen && createPortal(
                <div className="color-theme-grid__picker-popup" ref={pickerPopupRef} data-theme="dark" style={{ top: pickerPos.top, left: pickerPos.left }}>
                  <ColorPicker color={color} onChange={handleColorChange} tint={tint} onTintChange={handleTintChange} />
                </div>,
                document.body
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
      <div className="v2-section v2-section--color-mode">
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
      <div className="v2-section v2-section--corners">
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
      <div className="v2-section v2-section--heading-font">
        <h3 className="v2-section__title">Heading Font</h3>
        <FontDropdown fonts={HEADING_FONT_OPTIONS} active={headingFont || font} onChange={handleHeadingFontChange} />
      </div>

      {/* Body Font */}
      <div className="v2-section v2-section--body-font">
        <h3 className="v2-section__title">Body Font</h3>
        <FontDropdown fonts={FONT_OPTIONS} active={font} onChange={handleFontChange} />
      </div>

      </div>{/* end Slide 1 */}

      {/* Slide 2: Edit Theme */}
      <div className="sidebar-panel__slide sidebar-panel__slide--editor">
        {editThemePanel}
      </div>

      </div>{/* end slider */}
    </>
  );
}
