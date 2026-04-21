import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';

// Maps px values to spacing token names
const spacingTokens: Record<number, string> = {
  0: 'space-0',
  4: 'space-1',
  8: 'space-2',
  12: 'space-3',
  16: 'space-4',
  20: 'space-5',
  24: 'space-6',
  32: 'space-8',
  40: 'space-10',
  48: 'space-12',
  64: 'space-16',
  80: 'space-20',
};

function pxToNumber(value: string): number {
  return parseFloat(value) || 0;
}

function resolveToken(px: number): string {
  return spacingTokens[px] ?? `${px}px`;
}

interface SpacingItem {
  label: string;
  sides: { name: string; px: number; token: string }[];
}

interface GapRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface TooltipData {
  x: number;
  y: number;
  items: SpacingItem[];
  rect: DOMRect;
  padding: { top: number; right: number; bottom: number; left: number };
  margin: { top: number; right: number; bottom: number; left: number };
  gap: number;
  gapRects: GapRect[];
}

interface SpacingInspectTooltipProps {
  canvasRef: RefObject<HTMLDivElement | null>;
}

export function SpacingInspectTooltip({ canvasRef }: SpacingInspectTooltipProps) {
  const [data, setData] = useState<TooltipData | null>(null);
  const throttleRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - throttleRef.current < 32) return;
    throttleRef.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    if (!el || !canvas.contains(el) || el === canvas) {
      setData(null);
      return;
    }

    const computed = getComputedStyle(el);
    const items: SpacingItem[] = [];

    // Padding
    const pt = pxToNumber(computed.paddingTop);
    const pr = pxToNumber(computed.paddingRight);
    const pb = pxToNumber(computed.paddingBottom);
    const pl = pxToNumber(computed.paddingLeft);
    const padding = { top: pt, right: pr, bottom: pb, left: pl };

    if (pt || pr || pb || pl) {
      const sides: SpacingItem['sides'] = [];
      if (pt) sides.push({ name: 'T', px: pt, token: resolveToken(pt) });
      if (pr) sides.push({ name: 'R', px: pr, token: resolveToken(pr) });
      if (pb) sides.push({ name: 'B', px: pb, token: resolveToken(pb) });
      if (pl) sides.push({ name: 'L', px: pl, token: resolveToken(pl) });
      items.push({ label: 'Padding', sides });
    }

    // Margin
    const mt = pxToNumber(computed.marginTop);
    const mr = pxToNumber(computed.marginRight);
    const mb = pxToNumber(computed.marginBottom);
    const ml = pxToNumber(computed.marginLeft);
    const margin = { top: mt, right: mr, bottom: mb, left: ml };

    if (mt || mr || mb || ml) {
      const sides: SpacingItem['sides'] = [];
      if (mt) sides.push({ name: 'T', px: mt, token: resolveToken(mt) });
      if (mr) sides.push({ name: 'R', px: mr, token: resolveToken(mr) });
      if (mb) sides.push({ name: 'B', px: mb, token: resolveToken(mb) });
      if (ml) sides.push({ name: 'L', px: ml, token: resolveToken(ml) });
      items.push({ label: 'Margin', sides });
    }

    // Gap
    const gap = pxToNumber(computed.gap);
    const gapRects: GapRect[] = [];
    if (gap) {
      items.push({
        label: 'Gap',
        sides: [{ name: '', px: gap, token: resolveToken(gap) }],
      });

      // Compute gap rectangles between visible children
      const children = Array.from(el.children) as HTMLElement[];
      const visibleChildren = children.filter((child) => {
        const s = getComputedStyle(child);
        return s.display !== 'none' && s.visibility !== 'hidden';
      });

      const isRow = computed.flexDirection === 'row' || computed.flexDirection === 'row-reverse' ||
        (computed.display === 'grid');

      for (let i = 0; i < visibleChildren.length - 1; i++) {
        const a = visibleChildren[i].getBoundingClientRect();
        const b = visibleChildren[i + 1].getBoundingClientRect();

        if (isRow) {
          // Horizontal gap between items
          const gapLeft = Math.min(a.right, b.right);
          const gapRight = Math.max(a.left, b.left);
          if (gapRight > gapLeft) {
            gapRects.push({
              left: gapLeft,
              top: Math.min(a.top, b.top),
              width: gapRight - gapLeft,
              height: Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top),
            });
          }
        } else {
          // Vertical gap between items
          const gapTop = Math.min(a.bottom, b.bottom);
          const gapBottom = Math.max(a.top, b.top);
          if (gapBottom > gapTop) {
            gapRects.push({
              left: Math.min(a.left, b.left),
              top: gapTop,
              width: Math.max(a.right, b.right) - Math.min(a.left, b.left),
              height: gapBottom - gapTop,
            });
          }
        }
      }
    }

    if (items.length === 0) {
      setData(null);
      return;
    }

    const rect = el.getBoundingClientRect();

    // Position tooltip
    const offsetX = 12;
    const offsetY = 12;
    let x = e.clientX + offsetX;
    let y = e.clientY + offsetY;
    const tooltipWidth = 200;
    const tooltipHeight = items.length * 36 + 20;

    if (x + tooltipWidth > window.innerWidth) x = e.clientX - tooltipWidth - offsetX;
    if (y + tooltipHeight > window.innerHeight) y = e.clientY - tooltipHeight - offsetY;

    setData({ x, y, items, rect, padding, margin, gap, gapRects });
  }, [canvasRef]);

  const handleMouseLeave = useCallback(() => setData(null), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [canvasRef, handleMouseMove, handleMouseLeave]);

  if (!data) return null;

  const { rect, padding, margin, gapRects } = data;

  return (
    <>
      {/* Padding overlay (green) */}
      {(padding.top > 0 || padding.right > 0 || padding.bottom > 0 || padding.left > 0) && (
        <>
          {padding.top > 0 && (
            <div className="spacing-overlay spacing-overlay--padding" style={{
              position: 'fixed', left: rect.left, top: rect.top,
              width: rect.width, height: padding.top,
            }} />
          )}
          {padding.bottom > 0 && (
            <div className="spacing-overlay spacing-overlay--padding" style={{
              position: 'fixed', left: rect.left, top: rect.bottom - padding.bottom,
              width: rect.width, height: padding.bottom,
            }} />
          )}
          {padding.left > 0 && (
            <div className="spacing-overlay spacing-overlay--padding" style={{
              position: 'fixed', left: rect.left, top: rect.top + padding.top,
              width: padding.left, height: rect.height - padding.top - padding.bottom,
            }} />
          )}
          {padding.right > 0 && (
            <div className="spacing-overlay spacing-overlay--padding" style={{
              position: 'fixed', left: rect.right - padding.right, top: rect.top + padding.top,
              width: padding.right, height: rect.height - padding.top - padding.bottom,
            }} />
          )}
        </>
      )}

      {/* Margin overlay (orange) */}
      {(margin.top > 0 || margin.right > 0 || margin.bottom > 0 || margin.left > 0) && (
        <>
          {margin.top > 0 && (
            <div className="spacing-overlay spacing-overlay--margin" style={{
              position: 'fixed', left: rect.left - margin.left, top: rect.top - margin.top,
              width: rect.width + margin.left + margin.right, height: margin.top,
            }} />
          )}
          {margin.bottom > 0 && (
            <div className="spacing-overlay spacing-overlay--margin" style={{
              position: 'fixed', left: rect.left - margin.left, top: rect.bottom,
              width: rect.width + margin.left + margin.right, height: margin.bottom,
            }} />
          )}
          {margin.left > 0 && (
            <div className="spacing-overlay spacing-overlay--margin" style={{
              position: 'fixed', left: rect.left - margin.left, top: rect.top,
              width: margin.left, height: rect.height,
            }} />
          )}
          {margin.right > 0 && (
            <div className="spacing-overlay spacing-overlay--margin" style={{
              position: 'fixed', left: rect.right, top: rect.top,
              width: margin.right, height: rect.height,
            }} />
          )}
        </>
      )}

      {/* Gap overlay (purple) */}
      {gapRects.map((gr, i) => (
        <div key={`gap-${i}`} className="spacing-overlay spacing-overlay--gap" style={{
          position: 'fixed', left: gr.left, top: gr.top,
          width: gr.width, height: gr.height,
        }} />
      ))}

      {/* Tooltip */}
      <div className="spacing-inspect-tooltip" style={{ left: data.x, top: data.y }}>
        {data.items.map((item, i) => (
          <div className="spacing-inspect-tooltip__section" key={i}>
            <div className="spacing-inspect-tooltip__label">
              <span className={`spacing-inspect-tooltip__dot spacing-inspect-tooltip__dot--${item.label.toLowerCase()}`} />
              {item.label}
            </div>
            <div className="spacing-inspect-tooltip__values">
              {item.sides.map((s, j) => (
                <span className="spacing-inspect-tooltip__token" key={j}>
                  {s.name ? `${s.name}: ` : ''}{s.token} <span className="spacing-inspect-tooltip__px">({s.px}px)</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
