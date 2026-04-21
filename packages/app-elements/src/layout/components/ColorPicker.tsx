import { useState, useRef, useCallback, useEffect } from 'react';
import { hexToOklchHue } from '../../utils/neutralTint';
import { Icon } from '../../components/Icon/Icon';

type ColorPickerMode = 'solid' | 'gradient';
type GradientStop = 'start' | 'end';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  tint: number;
  onTintChange: (tint: number) => void;
  hideTint?: boolean;
  opacity?: number;
  onOpacityChange?: (opacity: number) => void;
  showTabs?: boolean;
  mode?: ColorPickerMode;
  onModeChange?: (mode: ColorPickerMode) => void;
  gradientStart?: string;
  gradientEnd?: string;
  onGradientChange?: (start: string, end: string) => void;
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

function useDrag(onMove: (e: { clientX: number; clientY: number }) => void) {
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

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    dragging.current = true;
    onMove(e.touches[0]);

    const handleTouchMove = (ev: TouchEvent) => {
      ev.preventDefault();
      if (dragging.current) onMove(ev.touches[0]);
    };
    const handleTouchEnd = () => {
      dragging.current = false;
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  }, [onMove]);

  return { onMouseDown, onTouchStart };
}

export function ColorPicker({ color, onChange, tint, onTintChange, hideTint, opacity = 100, onOpacityChange, showTabs, mode = 'solid', onModeChange, gradientStart: gradientStartProp, gradientEnd: gradientEndProp, onGradientChange }: ColorPickerProps) {
  const [hsv, setHsv] = useState(() => hexToHsv(color));
  const [hexInput, setHexInput] = useState(color.toUpperCase());
  const satAreaRef = useRef<HTMLDivElement>(null);
  const hueBarRef = useRef<HTMLDivElement>(null);
  const tintBarRef = useRef<HTMLDivElement>(null);

  // Gradient state
  const [activeStop, setActiveStop] = useState<GradientStop>('start');
  const [gradientStart, setGradientStart] = useState(gradientStartProp || color);
  const [gradientEnd, setGradientEnd] = useState(gradientEndProp || '#FFFFFF');
  const [gradientStartInput, setGradientStartInput] = useState((gradientStartProp || color).toUpperCase());
  const [gradientEndInput, setGradientEndInput] = useState((gradientEndProp || '#FFFFFF').toUpperCase());

  // Sync gradient props from parent
  useEffect(() => {
    if (gradientStartProp) {
      setGradientStart(gradientStartProp);
      setGradientStartInput(gradientStartProp.toUpperCase());
    }
  }, [gradientStartProp]);

  useEffect(() => {
    if (gradientEndProp) {
      setGradientEnd(gradientEndProp);
      setGradientEndInput(gradientEndProp.toUpperCase());
    }
  }, [gradientEndProp]);

  // When switching to gradient mode, initialize both stops from current solid color
  const prevModeRef = useRef(mode);
  useEffect(() => {
    if (mode === 'gradient' && prevModeRef.current === 'solid') {
      setGradientStart(color);
      setGradientStartInput(color.toUpperCase());
      setGradientEnd(color);
      setGradientEndInput(color.toUpperCase());
      setActiveStop('start');
      onGradientChange?.(color, color);
    }
    prevModeRef.current = mode;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // When active stop changes in gradient mode, sync sliders
  useEffect(() => {
    if (mode === 'gradient') {
      const activeColor = activeStop === 'start' ? gradientStart : gradientEnd;
      const newHsv = hexToHsv(activeColor);
      if (newHsv.s < 0.01) {
        setHsv((prev) => ({ ...newHsv, h: prev.h }));
      } else {
        setHsv(newHsv);
      }
      setHexInput(activeColor.toUpperCase());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStop]);

  // Sync from external color prop (solid mode)
  useEffect(() => {
    if (mode !== 'gradient') {
      const newHsv = hexToHsv(color);
      if (newHsv.s < 0.01) {
        setHsv((prev) => ({ ...newHsv, h: prev.h }));
      } else {
        setHsv(newHsv);
      }
      setHexInput(color.toUpperCase());
    }
  }, [color, mode]);

  const updateColor = useCallback((h: number, s: number, v: number) => {
    setHsv({ h, s, v });
    const hex = hsvToHex(h, s, v);
    setHexInput(hex);

    if (mode === 'gradient') {
      if (activeStop === 'start') {
        setGradientStart(hex);
        setGradientStartInput(hex);
        onGradientChange?.(hex, gradientEnd);
      } else {
        setGradientEnd(hex);
        setGradientEndInput(hex);
        onGradientChange?.(gradientStart, hex);
      }
    } else {
      onChange(hex);
    }
  }, [onChange, mode, activeStop, gradientStart, gradientEnd, onGradientChange]);

  // Saturation/brightness area drag
  const onSatMove = useCallback((e: { clientX: number; clientY: number }) => {
    const rect = satAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const v = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    updateColor(hsv.h, s, v);
  }, [hsv.h, updateColor]);

  const { onMouseDown: onSatDown, onTouchStart: onSatTouch } = useDrag(onSatMove);

  // Hue bar drag
  const onHueMove = useCallback((e: { clientX: number; clientY: number }) => {
    const rect = hueBarRef.current?.getBoundingClientRect();
    if (!rect) return;
    const h = Math.max(0, Math.min(360, (e.clientX - rect.left) / rect.width * 360));
    updateColor(h, hsv.s, hsv.v);
  }, [hsv.s, hsv.v, updateColor]);

  const { onMouseDown: onHueDown, onTouchStart: onHueTouch } = useDrag(onHueMove);

  // Tint bar drag
  const onTintMove = useCallback((e: { clientX: number; clientY: number }) => {
    const rect = tintBarRef.current?.getBoundingClientRect();
    if (!rect) return;
    const t = Math.max(0, Math.min(100, Math.round((e.clientX - rect.left) / rect.width * 100)));
    onTintChange(t);
  }, [onTintChange]);

  const { onMouseDown: onTintDown, onTouchStart: onTintTouch } = useDrag(onTintMove);

  // Opacity bar drag
  const opacityBarRef = useRef<HTMLDivElement>(null);
  const onOpacityMove = useCallback((e: { clientX: number; clientY: number }) => {
    const rect = opacityBarRef.current?.getBoundingClientRect();
    if (!rect) return;
    const o = Math.max(0, Math.min(100, Math.round((e.clientX - rect.left) / rect.width * 100)));
    onOpacityChange?.(o);
  }, [onOpacityChange]);

  const { onMouseDown: onOpacityDown, onTouchStart: onOpacityTouch } = useDrag(onOpacityMove);

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
    <div className={`color-picker${showTabs ? ' color-picker--has-tabs' : ''}`}>
      {showTabs && (
        <div className="color-picker__tabs">
          <button
            className={`color-picker__tab${mode === 'solid' ? ' color-picker__tab--active' : ''}`}
            type="button"
            onClick={() => onModeChange?.('solid')}
          >
            Solid
          </button>
          <button
            className={`color-picker__tab${mode === 'gradient' ? ' color-picker__tab--active' : ''}`}
            type="button"
            onClick={() => onModeChange?.('gradient')}
          >
            Gradient
          </button>
        </div>
      )}
      <div className="color-picker__body">
      {/* Saturation/Brightness area */}
      <div
        ref={satAreaRef}
        className="color-picker__saturation"
        style={{ backgroundColor: currentHueColor }}
        onMouseDown={onSatDown}
        onTouchStart={onSatTouch}
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
                if (result?.sRGBHex) {
                  const hex = result.sRGBHex.toUpperCase();
                  if (mode === 'gradient') {
                    const newHsv = hexToHsv(hex);
                    setHsv(newHsv);
                    setHexInput(hex);
                    if (activeStop === 'start') {
                      setGradientStart(hex);
                      setGradientStartInput(hex);
                      onGradientChange?.(hex, gradientEnd);
                    } else {
                      setGradientEnd(hex);
                      setGradientEndInput(hex);
                      onGradientChange?.(gradientStart, hex);
                    }
                  } else {
                    onChange(hex);
                  }
                }
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
          onTouchStart={onHueTouch}
        >
          <div
            className="color-picker__handle"
            style={{ left: clampLeft((hsv.h / 360) * 100), top: '50%', backgroundColor: currentHueColor }}
          />
        </div>

        {/* Tint slider */}
        {!hideTint && (
          <div
            ref={tintBarRef}
            className="color-picker__tint"
            style={{
              background: `linear-gradient(to right, #808080, oklch(0.55 0.15 ${Math.round(oklchHue)}))`,
            }}
            onMouseDown={onTintDown}
            onTouchStart={onTintTouch}
          >
            <div
              className="color-picker__handle"
              style={{ left: clampLeft(tint), top: '50%', backgroundColor: `oklch(0.55 ${0.15 * tint / 100} ${Math.round(oklchHue)})` }}
            />
          </div>
        )}
        {/* Opacity slider */}
        {onOpacityChange && (
          <div
            ref={opacityBarRef}
            className="color-picker__opacity"
            style={{
              backgroundImage: `linear-gradient(to right, transparent, ${currentColor}), linear-gradient(45deg, rgba(128,128,128,0.4) 25%, rgba(128,128,128,0.15) 25%, rgba(128,128,128,0.15) 75%, rgba(128,128,128,0.4) 75%), linear-gradient(45deg, rgba(128,128,128,0.4) 25%, rgba(128,128,128,0.15) 25%, rgba(128,128,128,0.15) 75%, rgba(128,128,128,0.4) 75%)`,
              backgroundSize: '100% 100%, 12px 12px, 12px 12px',
              backgroundPosition: '0 0, 0 0, 6px 6px',
            }}
            onMouseDown={onOpacityDown}
            onTouchStart={onOpacityTouch}
          >
            <div
              className="color-picker__handle"
              style={{ left: clampLeft(opacity), top: '50%', backgroundColor: currentColor }}
            />
          </div>
        )}
        </div>
      </div>

      {/* Hex input(s) */}
      {mode === 'gradient' ? (
        <div className="color-picker__gradient-inputs">
          <div
            className={`color-picker__input-row${activeStop === 'start' ? ' color-picker__input-row--active' : ''}`}
            onClick={() => setActiveStop('start')}
          >
            <div className="color-picker__color-box" style={{ backgroundColor: gradientStart }} />
            <input
              className="color-picker__hex-input"
              value={gradientStartInput}
              onChange={(e) => setGradientStartInput(e.target.value.toUpperCase())}
              onFocus={() => setActiveStop('start')}
              onBlur={() => {
                const cleaned = gradientStartInput.replace('#', '');
                if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
                  const hex = `#${cleaned.toUpperCase()}`;
                  setGradientStart(hex);
                  setGradientStartInput(hex);
                  const newHsv = hexToHsv(hex);
                  setHsv(newHsv);
                  onGradientChange?.(hex, gradientEnd);
                } else {
                  setGradientStartInput(gradientStart.toUpperCase());
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              }}
              spellCheck={false}
            />
          </div>
          <div
            className={`color-picker__input-row${activeStop === 'end' ? ' color-picker__input-row--active' : ''}`}
            onClick={() => setActiveStop('end')}
          >
            <div className="color-picker__color-box" style={{ backgroundColor: gradientEnd }} />
            <input
              className="color-picker__hex-input"
              value={gradientEndInput}
              onChange={(e) => setGradientEndInput(e.target.value.toUpperCase())}
              onFocus={() => setActiveStop('end')}
              onBlur={() => {
                const cleaned = gradientEndInput.replace('#', '');
                if (/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
                  const hex = `#${cleaned.toUpperCase()}`;
                  setGradientEnd(hex);
                  setGradientEndInput(hex);
                  const newHsv = hexToHsv(hex);
                  setHsv(newHsv);
                  onGradientChange?.(gradientStart, hex);
                } else {
                  setGradientEndInput(gradientEnd.toUpperCase());
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              }}
              spellCheck={false}
            />
          </div>
        </div>
      ) : (
        <div className="color-picker__input-row">
          <div className="color-picker__color-box" style={{ backgroundColor: hexInput.startsWith('#') ? hexInput : `#${hexInput}` }} />
          <input
            className="color-picker__hex-input"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value.toUpperCase())}
            onBlur={handleHexSubmit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleHexSubmit(); }}
            spellCheck={false}
          />
        </div>
      )}
      </div>
    </div>
  );
}
