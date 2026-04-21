import { useState, useRef, useCallback, useEffect } from 'react';
import { hexToOklchHue } from '../../utils/neutralTint';
import { Icon } from '../Icon/Icon';
import './ColorPicker.scss';

export type ColorPickerMode = 'Tint' | 'Opacity';

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  tint: number;
  onTintChange: (tint: number) => void;
  opacity?: number;
  onOpacityChange?: (opacity: number) => void;
  mode?: ColorPickerMode;
  selected?: boolean;
}

// --- Color conversion utilities ---

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  const s = max === 0 ? 0 : d / max;
  return { h: h * 360, s, v: max };
}

function hsvToHex(h: number, s: number, v: number): string {
  h = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }

  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hueToHex(h: number): string {
  return hsvToHex(h, 1, 1);
}

// --- Dragging hook ---

function useDrag(onMove: (e: MouseEvent) => void) {
  const dragging = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    onMove(e.nativeEvent);

    const handleMove = (ev: MouseEvent) => {
      if (dragging.current) onMove(ev);
    };
    const handleUp = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [onMove]);

  return onMouseDown;
}

export function ColorPicker({ color, onChange, tint, onTintChange, opacity = 100, onOpacityChange, mode = 'Tint', selected = false }: ColorPickerProps) {
  const [hsv, setHsv] = useState(() => hexToHsv(color));
  const [hexInput, setHexInput] = useState(color.toUpperCase());
  const satAreaRef = useRef<HTMLDivElement>(null);
  const hueBarRef = useRef<HTMLDivElement>(null);
  const tintBarRef = useRef<HTMLDivElement>(null);

  // Sync from external color prop
  useEffect(() => {
    const newHsv = hexToHsv(color);
    setHsv(newHsv);
    setHexInput(color.toUpperCase());
  }, [color]);

  const updateColor = useCallback((h: number, s: number, v: number) => {
    setHsv({ h, s, v });
    const hex = hsvToHex(h, s, v);
    setHexInput(hex);
    onChange(hex);
  }, [onChange]);

  // Saturation/brightness area drag
  const onSatMove = useCallback((e: MouseEvent) => {
    const rect = satAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const v = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    updateColor(hsv.h, s, v);
  }, [hsv.h, updateColor]);

  const onSatDown = useDrag(onSatMove);

  // Hue bar drag
  const onHueMove = useCallback((e: MouseEvent) => {
    const rect = hueBarRef.current?.getBoundingClientRect();
    if (!rect) return;
    const h = Math.max(0, Math.min(360, (e.clientX - rect.left) / rect.width * 360));
    updateColor(h, hsv.s, hsv.v);
  }, [hsv.s, hsv.v, updateColor]);

  const onHueDown = useDrag(onHueMove);

  // Tint bar drag
  const onTintMove = useCallback((e: MouseEvent) => {
    const rect = tintBarRef.current?.getBoundingClientRect();
    if (!rect) return;
    const t = Math.max(0, Math.min(100, Math.round((e.clientX - rect.left) / rect.width * 100)));
    onTintChange(t);
  }, [onTintChange]);

  const onTintDown = useDrag(onTintMove);

  // Opacity bar drag
  const opacityBarRef = useRef<HTMLDivElement>(null);
  const onOpacityMove = useCallback((e: MouseEvent) => {
    const rect = opacityBarRef.current?.getBoundingClientRect();
    if (!rect) return;
    const o = Math.max(0, Math.min(100, Math.round((e.clientX - rect.left) / rect.width * 100)));
    onOpacityChange?.(o);
  }, [onOpacityChange]);

  const onOpacityDown = useDrag(onOpacityMove);

  // Hex input
  const handleHexSubmit = useCallback(() => {
    const cleaned = hexInput.replace('#', '');
    if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
      const hex = `#${cleaned.toUpperCase()}`;
      const newHsv = hexToHsv(hex);
      setHsv(newHsv);
      onChange(hex);
    } else {
      setHexInput(hsvToHex(hsv.h, hsv.s, hsv.v));
    }
  }, [hexInput, hsv, onChange]);

  const currentHueColor = hueToHex(hsv.h);
  const currentColor = hsvToHex(hsv.h, hsv.s, hsv.v);
  const oklchHue = hexToOklchHue(currentColor);

  // Clamp handle position so it stays within slider bounds
  const clampLeft = (pct: number) => `clamp(9px, ${pct}%, calc(100% - 9px))`;

  return (
    <div className={`color-picker${selected ? ' color-picker--selected' : ''}`}>
      {/* Saturation/Brightness area */}
      <div
        ref={satAreaRef}
        className="color-picker__saturation"
        style={{ backgroundColor: currentHueColor }}
        onMouseDown={onSatDown}
      >
        <div className="color-picker__saturation-white" />
        <div className="color-picker__saturation-black" />
        <div
          className="color-picker__handle"
          style={{
            left: clampLeft(hsv.s * 100),
            top: `clamp(9px, ${(1 - hsv.v) * 100}%, calc(100% - 9px))`,
            backgroundColor: currentColor,
          }}
        />
      </div>

      {/* Sliders row with eyedropper */}
      <div className="color-picker__sliders-row">
        <button
          className="color-picker__eyedropper"
          type="button"
          title="Pick color from screen"
          onClick={async () => {
            if ('EyeDropper' in window) {
              try {
                // @ts-expect-error EyeDropper API
                const dropper = new window.EyeDropper();
                const result = await dropper.open();
                if (result?.sRGBHex) onChange(result.sRGBHex.toUpperCase());
              } catch { /* user cancelled */ }
            }
          }}
        >
          <Icon name="Pipette" size={20} />
        </button>
        <div className="color-picker__sliders">
        {/* Hue slider */}
        <div
          ref={hueBarRef}
          className="color-picker__hue"
          style={{
            background: 'linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))',
          }}
          onMouseDown={onHueDown}
        >
          <div
            className="color-picker__handle"
            style={{ left: clampLeft((hsv.h / 360) * 100), top: '50%', backgroundColor: currentHueColor }}
          />
        </div>

        {/* Second slider: Tint or Opacity */}
        {mode === 'Tint' ? (
        <div
          ref={tintBarRef}
          className="color-picker__tint"
          style={{
            background: `linear-gradient(to right, #808080, oklch(0.55 0.15 ${Math.round(oklchHue)}))`,
          }}
          onMouseDown={onTintDown}
        >
          <div
            className="color-picker__handle"
            style={{ left: clampLeft(tint), top: '50%', backgroundColor: `oklch(0.55 ${0.15 * tint / 100} ${Math.round(oklchHue)})` }}
          />
        </div>
        ) : (
        <div
          ref={opacityBarRef}
          className="color-picker__opacity"
          style={{
            backgroundImage: `linear-gradient(to right, transparent, ${currentColor}), linear-gradient(45deg, rgba(128,128,128,0.4) 25%, rgba(128,128,128,0.15) 25%, rgba(128,128,128,0.15) 75%, rgba(128,128,128,0.4) 75%), linear-gradient(45deg, rgba(128,128,128,0.4) 25%, rgba(128,128,128,0.15) 25%, rgba(128,128,128,0.15) 75%, rgba(128,128,128,0.4) 75%)`,
            backgroundSize: '100% 100%, 12px 12px, 12px 12px',
            backgroundPosition: '0 0, 0 0, 6px 6px',
          }}
          onMouseDown={onOpacityDown}
        >
          <div
            className="color-picker__handle"
            style={{ left: clampLeft(opacity), top: '50%', backgroundColor: currentColor }}
          />
        </div>
        )}
        </div>
      </div>

      {/* Hex input */}
      <div className="color-picker__input-row">
        <div className="color-picker__color-box" style={{ backgroundColor: currentColor }} />
        <input
          className="color-picker__hex-input"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value.toUpperCase())}
          onBlur={handleHexSubmit}
          onKeyDown={(e) => { if (e.key === 'Enter') handleHexSubmit(); }}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
