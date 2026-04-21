import { useState, useCallback, useRef, useEffect } from 'react';
import './Spacer.scss';

export interface SpacerProps {
  height?: number;
  selected?: boolean;
  shrinked?: boolean;
  onHeightChange?: (height: number) => void;
}

export const Spacer: React.FC<SpacerProps> = ({
  height = 48,
  selected = false,
  shrinked = false,
  onHeightChange,
}) => {
  const [dragging, setDragging] = useState(false);
  const [dragHeight, setDragHeight] = useState(height);
  const startY = useRef(0);
  const startHeight = useRef(0);

  useEffect(() => {
    if (!dragging) setDragHeight(height);
  }, [height, dragging]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!onHeightChange) return;
    e.preventDefault();
    e.stopPropagation();
    startY.current = e.clientY;
    startHeight.current = height;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [height, onHeightChange]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const delta = e.clientY - startY.current;
    const newHeight = Math.round(Math.max(1, Math.min(200, startHeight.current + delta)));
    setDragHeight(newHeight);
  }, [dragging]);

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    onHeightChange?.(dragHeight);
  }, [dragging, dragHeight, onHeightChange]);

  // Desktop: ignore touch on body, Mobile: ignore mouse on body
  const handleBodyPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    handlePointerDown(e);
  }, [handlePointerDown]);

  const displayHeight = dragging ? dragHeight : height;

  const rootClasses = [
    'jf-spacer',
    selected && 'jf-spacer--selected',
    shrinked && 'jf-spacer--shrinked',
    dragging && 'jf-spacer--dragging',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={rootClasses}
      style={{ '--spacer-height': `${displayHeight}px` } as React.CSSProperties}
      onPointerDown={onHeightChange ? handleBodyPointerDown : undefined}
      onPointerMove={onHeightChange ? handlePointerMove : undefined}
      onPointerUp={onHeightChange ? handlePointerUp : undefined}
    >
      <span className={`jf-spacer__label${dragging ? ' jf-spacer__label--visible' : ''}`}>{Math.round(displayHeight)}px</span>
      {onHeightChange && (
        <div
          className="jf-spacer__handle"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      )}
    </div>
  );
};

export default Spacer;
