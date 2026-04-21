import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';

interface ColorItem {
  label: string;
  varName: string;
  primitiveRef: string;
  hex: string;
}

interface TooltipData {
  x: number;
  y: number;
  items: ColorItem[];
}

interface ColorInspectTooltipProps {
  canvasRef: RefObject<HTMLDivElement | null>;
}

const _canvas = document.createElement('canvas');
_canvas.width = 1;
_canvas.height = 1;
const _ctx = _canvas.getContext('2d', { willReadFrequently: true })!;

function rgbToHex(color: string): string {
  // Try rgb() parse first
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
  }
  // Fallback: canvas pixel read for oklch/hsl/etc.
  _ctx.clearRect(0, 0, 1, 1);
  _ctx.fillStyle = '#000000';
  _ctx.fillStyle = color;
  _ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = _ctx.getImageData(0, 0, 1, 1).data;
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

function isTransparent(color: string): boolean {
  return (
    color === 'transparent' ||
    color === 'rgba(0, 0, 0, 0)' ||
    (color.includes('rgba') && color.endsWith(', 0)'))
  );
}

function formatVarName(varName: string): string {
  // --primary-600 → "Primary · 600"
  // --fg-brand → "fg-brand"
  // --neutral-200 → "Neutral · 200"
  const name = varName.replace(/^--/, '');
  const parts = name.split('-');

  // Check if last part is a number (shade)
  const lastPart = parts[parts.length - 1];
  if (/^\d+$/.test(lastPart) && parts.length >= 2) {
    const prefix = parts.slice(0, -1).join('-');
    const capitalized = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    return `${capitalized} · ${lastPart}`;
  }

  return name;
}

interface ColorMapEntry {
  semantic: string;
  primitive: string;
}

function buildColorMap(): Map<string, ColorMapEntry> {
  const map = new Map<string, ColorMapEntry>();
  const root = document.documentElement;

  const semanticVars = [
    '--fg-primary', '--fg-secondary', '--fg-tertiary', '--fg-disabled', '--fg-brand', '--fg-inverse',
    '--fg-error', '--fg-success', '--fg-warning', '--fg-info',
    '--bg-surface', '--bg-fill', '--bg-page', '--bg-surface-brand', '--bg-fill-brand',
    '--bg-surface-hover', '--bg-fill-hover', '--bg-surface-active', '--bg-fill-active',
    '--bg-fill-brand-hover', '--bg-fill-brand-disabled',
    '--border', '--border-active', '--border-hover', '--border-error',
  ];

  const primitiveVars = [
    '--primary-50', '--primary-100', '--primary-200', '--primary-300', '--primary-400',
    '--primary-500', '--primary-600', '--primary-700', '--primary-800', '--primary-900', '--primary-950',
    '--secondary-50', '--secondary-100', '--secondary-200', '--secondary-300', '--secondary-400',
    '--secondary-500', '--secondary-600', '--secondary-700', '--secondary-800', '--secondary-900', '--secondary-950',
    '--neutral-0', '--neutral-50', '--neutral-100', '--neutral-200', '--neutral-300',
    '--neutral-400', '--neutral-500', '--neutral-600', '--neutral-700', '--neutral-800', '--neutral-900', '--neutral-950',
  ];

  // Build primitive hex→name lookup
  const primitiveMap = new Map<string, string>();
  for (const name of primitiveVars) {
    const temp = document.createElement('div');
    temp.style.color = `var(${name})`;
    root.appendChild(temp);
    const resolved = getComputedStyle(temp).color;
    root.removeChild(temp);
    if (resolved && !isTransparent(resolved)) {
      const hex = rgbToHex(resolved);
      if (hex.startsWith('#')) primitiveMap.set(hex, name);
    }
  }

  // Build semantic hex→entry with primitive reference
  for (const name of semanticVars) {
    const temp = document.createElement('div');
    temp.style.color = `var(${name})`;
    root.appendChild(temp);
    const resolved = getComputedStyle(temp).color;
    root.removeChild(temp);
    if (resolved && !isTransparent(resolved)) {
      const hex = rgbToHex(resolved);
      if (hex.startsWith('#')) {
        map.set(hex, {
          semantic: name,
          primitive: primitiveMap.get(hex) || '',
        });
      }
    }
  }

  // Add primitives that don't map to any semantic token
  for (const [hex, name] of primitiveMap) {
    if (!map.has(hex)) {
      map.set(hex, { semantic: '', primitive: name });
    }
  }

  return map;
}

export function ColorInspectTooltip({ canvasRef }: ColorInspectTooltipProps) {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const hoveredElRef = useRef<HTMLElement | null>(null);
  const colorMapRef = useRef<Map<string, ColorMapEntry> | null>(null);
  const throttleRef = useRef<number>(0);

  // Build color map once on mount
  useEffect(() => {
    colorMapRef.current = buildColorMap();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - throttleRef.current < 32) return; // ~30fps throttle
    throttleRef.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    if (!el || !canvas.contains(el) || el === canvas) {
      hoveredElRef.current = null;
      setTooltipData(null);
      return;
    }

    hoveredElRef.current = el;

    const computed = getComputedStyle(el);
    const colorMap = colorMapRef.current;
    const items: ColorItem[] = [];

    const resolveEntry = (hex: string) => colorMap?.get(hex);

    // Background color
    const bg = computed.backgroundColor;
    if (bg && !isTransparent(bg)) {
      const hex = rgbToHex(bg);
      const entry = resolveEntry(hex);
      items.push({
        label: 'Background',
        varName: entry ? formatVarName(entry.semantic || entry.primitive) : '',
        primitiveRef: entry?.primitive && entry?.semantic ? formatVarName(entry.primitive) : '',
        hex,
      });
    }

    // Border color (only if border exists)
    const borderWidth = parseFloat(computed.borderTopWidth);
    if (borderWidth > 0) {
      const borderColor = computed.borderTopColor;
      if (borderColor && !isTransparent(borderColor)) {
        const hex = rgbToHex(borderColor);
        const entry = resolveEntry(hex);
        items.push({
          label: 'Border',
          varName: entry ? formatVarName(entry.semantic || entry.primitive) : '',
          primitiveRef: entry?.primitive && entry?.semantic ? formatVarName(entry.primitive) : '',
          hex,
        });
      }
    }

    // Text / Icon color
    const tagName = el.tagName.toLowerCase();
    const isSvgEl = tagName === 'svg' || tagName === 'path' || tagName === 'line' || tagName === 'circle' || tagName === 'rect' || tagName === 'polyline' || tagName === 'polygon' || tagName === 'ellipse' || el.closest('svg') !== null;
    const hasText = el.childNodes.length > 0 && Array.from(el.childNodes).some(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
    );
    if (hasText || isSvgEl) {
      const textColor = computed.color;
      if (textColor && !isTransparent(textColor)) {
        const hex = rgbToHex(textColor);
        const entry = resolveEntry(hex);
        items.push({
          label: isSvgEl && !hasText ? 'Icon' : 'Text',
          varName: entry ? formatVarName(entry.semantic || entry.primitive) : '',
          primitiveRef: entry?.primitive && entry?.semantic ? formatVarName(entry.primitive) : '',
          hex,
        });
      }
      // SVG stroke color
      if (isSvgEl) {
        const stroke = computed.stroke;
        if (stroke && !isTransparent(stroke) && stroke !== 'none') {
          const strokeHex = rgbToHex(stroke);
          const colorHex = textColor ? rgbToHex(textColor) : '';
          if (strokeHex !== colorHex) {
            const entry = resolveEntry(strokeHex);
            items.push({
              label: 'Stroke',
              varName: entry ? formatVarName(entry.semantic || entry.primitive) : '',
              primitiveRef: entry?.primitive && entry?.semantic ? formatVarName(entry.primitive) : '',
              hex: strokeHex,
            });
          }
        }
      }
    }

    if (items.length === 0) {
      setTooltipData(null);
      return;
    }

    // Position tooltip near cursor, keep within viewport
    const offsetX = 12;
    const offsetY = 12;
    let x = e.clientX + offsetX;
    let y = e.clientY + offsetY;
    const tooltipWidth = 220;
    const tooltipHeight = items.length * 42 + 20;

    if (x + tooltipWidth > window.innerWidth) {
      x = e.clientX - tooltipWidth - offsetX;
    }
    if (y + tooltipHeight > window.innerHeight) {
      y = e.clientY - tooltipHeight - offsetY;
    }

    setTooltipData({ x, y, items });
  }, [canvasRef]);

  const handleMouseLeave = useCallback(() => {
    hoveredElRef.current = null;
    setTooltipData(null);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      hoveredElRef.current = null;
    };
  }, [canvasRef, handleMouseMove, handleMouseLeave]);

  if (!tooltipData) return null;

  return (
    <div
      className="color-inspect-tooltip"
      style={{ left: tooltipData.x, top: tooltipData.y }}
    >
      {tooltipData.items.map((item, i) => (
        <div className="color-inspect-tooltip__section" key={i}>
          <div className="color-inspect-tooltip__label">{item.label}</div>
          <div className="color-inspect-tooltip__value">
            <span
              className="color-inspect-tooltip__swatch"
              style={{ backgroundColor: item.hex }}
            />
            <span>
              {item.varName ? `${item.varName}` : ''}
              {item.primitiveRef ? ` → ${item.primitiveRef}` : ''}
              {` · ${item.hex}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
