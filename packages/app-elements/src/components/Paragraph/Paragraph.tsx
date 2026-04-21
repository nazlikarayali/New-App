import { useState, useRef, useEffect, useCallback, type FC } from 'react';
import { createPortal } from 'react-dom';
import {
  Bold, Italic, Underline, Baseline,
  Link2, AlignLeft, AlignCenter, AlignRight,
  Check, ChevronDown, ChevronRight, Sparkles, ALargeSmall,
} from 'lucide-react';
import './Paragraph.scss';

export type ParagraphSize = 'Large' | 'Medium' | 'Small';
export type ParagraphAlignment = 'Left' | 'Center' | 'Right';
export type ParagraphToolbar = 'Inline' | 'Tooltip';

export interface ParagraphProps {
  size?: ParagraphSize;
  alignment?: ParagraphAlignment;
  toolbar?: ParagraphToolbar;
  placeholder?: string;
  defaultValue?: string;
  selected?: boolean;
  onClickOutside?: () => void;
}

const ALIGN_ICON: Record<ParagraphAlignment, FC<{ size?: number; strokeWidth?: number }>> = {
  Left: AlignLeft,
  Center: AlignCenter,
  Right: AlignRight,
};

export const Paragraph: FC<ParagraphProps> = ({
  size = 'Medium',
  alignment = 'Left',
  toolbar = 'Inline',
  placeholder = 'Enter your text',
  defaultValue = '',
  selected: controlledSelected,
  onClickOutside,
}) => {
  const [internalSelected, setInternalSelected] = useState(false);
  const selected = controlledSelected ?? internalSelected;
  const [align, setAlign] = useState<ParagraphAlignment>(alignment);
  const [currentSize, setCurrentSize] = useState<ParagraphSize>(size);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);
  const [aiPickerOpen, setAiPickerOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const subMenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [activeColor, setActiveColor] = useState<string | null>('--neutral-900');
  const savedSelection = useRef<Range | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const colorBtnRef = useRef<HTMLButtonElement>(null);
  const [isEmpty, setIsEmpty] = useState(!defaultValue);
  const [tooltipX, setTooltipX] = useState<number | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [mobileSheetType, setMobileSheetType] = useState<'size' | 'ai' | 'ai-tone' | 'color' | null>(null);
  const deviceContainerRef = useRef<HTMLElement | null>(null);
  const isTooltip = toolbar === 'Tooltip';
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateFormatStates = useCallback(() => {
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
    setIsUnderline(document.queryCommandState('underline'));
  }, []);

  useEffect(() => {
    if (rootRef.current) {
      const device = rootRef.current.closest('.themes-view__device--mobile') as HTMLElement | null;
      const isMobile = !!device || window.matchMedia('(max-width: 480px)').matches;
      setIsMobileDevice(isMobile);
      deviceContainerRef.current = device || rootRef.current.closest('.themes-view') as HTMLElement || document.body;
    }
  }, [selected]);

  useEffect(() => {
    if (editorRef.current && defaultValue && !editorRef.current.textContent) {
      editorRef.current.textContent = defaultValue;
      setIsEmpty(false);
    }
  }, [defaultValue]);

  const handleInput = useCallback(() => {
    const text = editorRef.current?.textContent || '';
    setIsEmpty(!text.trim());
    updateFormatStates();
  }, [updateFormatStates]);

  const handleSelect = useCallback((e: React.MouseEvent) => {
    if (controlledSelected === undefined) {
      if (!internalSelected && toolbar === 'Tooltip' && rootRef.current) {
        const rect = rootRef.current.getBoundingClientRect();
        setTooltipX(e.clientX - rect.left);
      }
      setInternalSelected(true);
    }
  }, [controlledSelected, internalSelected, toolbar]);

  useEffect(() => {
    if (!selected) {
      setColorPickerOpen(false);
      setSizePickerOpen(false);
      setAiPickerOpen(false);
      setSubMenuOpen(false);
      setMobileSheetType(null);
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        if (controlledSelected === undefined) setInternalSelected(false);
        setColorPickerOpen(false);
        setTooltipX(null);
        onClickOutside?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selected, controlledSelected, onClickOutside]);

  useEffect(() => {
    if (selected && editorRef.current) {
      editorRef.current.focus();
    }
  }, [selected]);

  // Clamp tooltip within paragraph bounds
  useEffect(() => {
    if (!selected || !isTooltip || !toolbarRef.current || !rootRef.current || tooltipX === null) return;
    const tb = toolbarRef.current;
    const root = rootRef.current;
    const tbW = tb.offsetWidth;
    const rootW = root.offsetWidth;
    const halfTb = tbW / 2;
    const clamped = Math.max(halfTb, Math.min(tooltipX, rootW - halfTb));
    if (clamped !== tooltipX) setTooltipX(clamped);
  }, [selected, isTooltip, tooltipX]);

  useEffect(() => {
    if (!selected) return;
    const onSelChange = () => updateFormatStates();
    document.addEventListener('selectionchange', onSelChange);
    return () => document.removeEventListener('selectionchange', onSelChange);
  }, [selected, updateFormatStates]);

  const execCommand = useCallback((command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
    updateFormatStates();
  }, [updateFormatStates]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && savedSelection.current) {
      sel.removeAllRanges();
      sel.addRange(savedSelection.current);
    }
  }, []);

  const applyColor = useCallback((color: string) => {
    restoreSelection();
    document.execCommand('foreColor', false, color);
    setActiveColor(color);
    setColorPickerOpen(false);
    editorRef.current?.focus();
  }, [restoreSelection]);

  const cssColorToHex = useCallback((cssColor: string) => {
    const cvs = document.createElement('canvas');
    cvs.width = cvs.height = 1;
    const ctx = cvs.getContext('2d')!;
    ctx.fillStyle = cssColor;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }, []);

  const NEUTRAL_VARS = ['--neutral-900', '--neutral-600', '--neutral-400', '--neutral-200', '--neutral-100', '--neutral-0'];

  const FIXED_COLORS = [
    '#0099FF',
    '#FCB900',
    '#DC2626',
    '#64B200',
    '#892DCA',
  ];

  const openSubMenu = useCallback(() => {
    if (subMenuTimer.current) clearTimeout(subMenuTimer.current);
    setSubMenuOpen(true);
  }, []);

  const closeSubMenu = useCallback((delay = 300) => {
    if (subMenuTimer.current) clearTimeout(subMenuTimer.current);
    subMenuTimer.current = setTimeout(() => setSubMenuOpen(false), delay);
  }, []);

  const cycleAlign = useCallback(() => {
    const order: ParagraphAlignment[] = ['Left', 'Center', 'Right'];
    setAlign((prev) => {
      const next = order[(order.indexOf(prev) + 1) % order.length];
      if (editorRef.current) editorRef.current.style.textAlign = next.toLowerCase();
      return next;
    });
  }, []);

  const classes = [
    'jf-paragraph',
    `jf-paragraph--${currentSize.toLowerCase()}`,
    selected && !isTooltip && 'jf-paragraph--selected',
    isTooltip && 'jf-paragraph--tooltip-mode',
  ].filter(Boolean).join(' ');

  return (
    <div ref={rootRef} className={classes} onClick={handleSelect}>
      <div
        ref={editorRef}
        className={`jf-paragraph__editor${isEmpty ? ' jf-paragraph__editor--empty' : ''}`}
        contentEditable={selected}
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{ textAlign: align.toLowerCase() as 'left' | 'center' | 'right' }}
      />
      {selected && (
        <div
          ref={toolbarRef}
          className={`jf-paragraph__toolbar${isTooltip ? ' jf-paragraph__toolbar--tooltip' : ''}`}
          style={isTooltip && tooltipX !== null ? { left: tooltipX, transform: 'translateX(-50%)' } : undefined}
        >
          <div className="jf-paragraph__size-wrap">
            <button
              className={`jf-paragraph__tool jf-paragraph__tool--size${sizePickerOpen ? ' jf-paragraph__tool--active' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault(); saveSelection();
                if (isMobileDevice) { setMobileSheetType(mobileSheetType === 'size' ? null : 'size'); }
                else { setSizePickerOpen(!sizePickerOpen); }
              }}
            >
              <ALargeSmall size={18} strokeWidth={2.5} className="jf-paragraph__mobile-only" />
              <span className="jf-paragraph__desktop-only">{currentSize}</span>
              <ChevronDown size={14} strokeWidth={2.5} className="jf-paragraph__chevron" />
            </button>
            {sizePickerOpen && !isMobileDevice && (
              <div className="jf-paragraph__size-picker">
                {(['Large', 'Medium', 'Small'] as ParagraphSize[]).map((s) => (
                  <button
                    key={s}
                    className={`jf-paragraph__size-option${currentSize === s ? ' jf-paragraph__size-option--active' : ''}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setCurrentSize(s); setSizePickerOpen(false); editorRef.current?.focus(); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="jf-paragraph__divider" />
          <button className={`jf-paragraph__tool${isBold ? ' jf-paragraph__tool--active' : ''}`} onClick={() => execCommand('bold')} title="Bold">
            <Bold size={18} strokeWidth={2.5} />
          </button>
          <button className={`jf-paragraph__tool${isItalic ? ' jf-paragraph__tool--active' : ''}`} onClick={() => execCommand('italic')} title="Italic">
            <Italic size={18} strokeWidth={2.5} />
          </button>
          <button className={`jf-paragraph__tool${isUnderline ? ' jf-paragraph__tool--active' : ''}`} onClick={() => execCommand('underline')} title="Underline">
            <Underline size={18} strokeWidth={2.5} />
          </button>
          <span className="jf-paragraph__divider" />
          <div className="jf-paragraph__color-wrap">
            <button
              ref={colorBtnRef}
              className={`jf-paragraph__tool${colorPickerOpen ? ' jf-paragraph__tool--active' : ''}`}
              title="Text color"
              onMouseDown={(e) => {
                e.preventDefault(); saveSelection();
                if (isMobileDevice) { setMobileSheetType(mobileSheetType === 'color' ? null : 'color'); }
                else { setColorPickerOpen(!colorPickerOpen); }
              }}
            >
              <Baseline size={18} strokeWidth={2.5} />
            </button>
            {colorPickerOpen && !isMobileDevice && (
              <div className="jf-paragraph__color-picker">
                <div className="jf-paragraph__color-row">
                  {NEUTRAL_VARS.map((v) => (
                    <button
                      key={v}
                      className={`jf-paragraph__color-swatch${activeColor === v ? ' jf-paragraph__color-swatch--active' : ''}`}
                      style={{ background: `var(${v})` }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => { applyColor(cssColorToHex(getComputedStyle(e.currentTarget).backgroundColor)); setActiveColor(v); }}
                      title={v}
                    >
                      {activeColor === v && <Check size={14} strokeWidth={3} color="#fff" />}
                    </button>
                  ))}
                  {FIXED_COLORS.map((c) => (
                    <button
                      key={c}
                      className={`jf-paragraph__color-swatch${activeColor === c ? ' jf-paragraph__color-swatch--active' : ''}`}
                      style={{ background: c }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyColor(c)}
                    >
                      {activeColor === c && <Check size={14} strokeWidth={3} color="#fff" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="jf-paragraph__tool" onClick={() => {
            const url = prompt('Enter URL');
            if (url) document.execCommand('createLink', false, url);
            editorRef.current?.focus();
          }} title="Link">
            <Link2 size={18} strokeWidth={2.5} />
          </button>
          <button className="jf-paragraph__tool" onClick={cycleAlign} title="Alignment">
            {(() => { const AlignIcon = ALIGN_ICON[align]; return <AlignIcon size={18} strokeWidth={2.5} />; })()}
          </button>
          <span className="jf-paragraph__divider" />
          <div className="jf-paragraph__ai-wrap">
            <button
              className={`jf-paragraph__tool jf-paragraph__tool--size${aiPickerOpen ? ' jf-paragraph__tool--active' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault(); saveSelection();
                if (isMobileDevice) { setMobileSheetType(mobileSheetType === 'ai' ? null : 'ai'); }
                else { setAiPickerOpen(!aiPickerOpen); }
              }}
            >
              <Sparkles size={16} strokeWidth={2.5} />
              <span className="jf-paragraph__desktop-only">AI Edit</span>
              <ChevronDown size={14} strokeWidth={2.5} className="jf-paragraph__chevron" />
            </button>
            {aiPickerOpen && !isMobileDevice && (
              <div className="jf-paragraph__ai-menu">
                <button
                  className="jf-paragraph__ai-option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setAiPickerOpen(false); editorRef.current?.focus(); }}
                >
                  Improve
                </button>
                <div
                  className="jf-paragraph__ai-submenu-wrap"
                  onMouseEnter={openSubMenu}
                  onMouseLeave={() => closeSubMenu()}
                >
                  <button className={`jf-paragraph__ai-option jf-paragraph__ai-option--has-sub${subMenuOpen ? ' jf-paragraph__ai-option--hover' : ''}`}>
                    <span>Change tone</span>
                    <ChevronRight size={16} strokeWidth={2.5} className="jf-paragraph__chevron" />
                  </button>
                  {subMenuOpen && (
                    <div
                      className="jf-paragraph__ai-submenu"
                      onMouseEnter={openSubMenu}
                      onMouseLeave={() => closeSubMenu(150)}
                    >
                      {['Neutral', 'Friendly', 'Professional', 'Casual'].map((tone) => (
                        <button
                          key={tone}
                          className="jf-paragraph__ai-option"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setAiPickerOpen(false); setSubMenuOpen(false); editorRef.current?.focus(); }}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="jf-paragraph__ai-option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setAiPickerOpen(false); editorRef.current?.focus(); }}
                >
                  Simplify
                </button>
                <button
                  className="jf-paragraph__ai-option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setAiPickerOpen(false); editorRef.current?.focus(); }}
                >
                  Expand
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet — portal into device container */}
      {isMobileDevice && mobileSheetType && deviceContainerRef.current && createPortal(
        <div className="jf-paragraph__sheet-overlay" onClick={() => setMobileSheetType(null)}>
          <div className="jf-paragraph__sheet" onClick={(e) => e.stopPropagation()}>
            <div className="jf-paragraph__sheet-handle" />

            {mobileSheetType === 'size' && (
              <>
                <div className="jf-paragraph__sheet-title">Text Size</div>
                <div className="jf-paragraph__sheet-options">
                  {(['Large', 'Medium', 'Small'] as ParagraphSize[]).map((s) => (
                    <button
                      key={s}
                      className={`jf-paragraph__sheet-option${currentSize === s ? ' jf-paragraph__sheet-option--active' : ''}`}
                      onClick={() => { setCurrentSize(s); setMobileSheetType(null); editorRef.current?.focus(); }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {mobileSheetType === 'color' && (
              <>
                <div className="jf-paragraph__sheet-title">Text Color</div>
                <div className="jf-paragraph__sheet-colors">
                  {NEUTRAL_VARS.map((v) => (
                    <button
                      key={v}
                      className={`jf-paragraph__color-swatch${activeColor === v ? ' jf-paragraph__color-swatch--active' : ''}`}
                      style={{ background: `var(${v})` }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => { applyColor(cssColorToHex(getComputedStyle(e.currentTarget).backgroundColor)); setActiveColor(v); setMobileSheetType(null); }}
                    >
                      {activeColor === v && <Check size={14} strokeWidth={3} color="#fff" />}
                    </button>
                  ))}
                  {FIXED_COLORS.map((c) => (
                    <button
                      key={c}
                      className={`jf-paragraph__color-swatch${activeColor === c ? ' jf-paragraph__color-swatch--active' : ''}`}
                      style={{ background: c }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { applyColor(c); setMobileSheetType(null); }}
                    >
                      {activeColor === c && <Check size={14} strokeWidth={3} color="#fff" />}
                    </button>
                  ))}
                </div>
              </>
            )}

            {mobileSheetType === 'ai' && (
              <>
                <div className="jf-paragraph__sheet-title">AI Edit</div>
                <div className="jf-paragraph__sheet-options">
                  <button className="jf-paragraph__sheet-option" onClick={() => { setMobileSheetType(null); editorRef.current?.focus(); }}>
                    Improve
                  </button>
                  <button className="jf-paragraph__sheet-option" onClick={() => setMobileSheetType('ai-tone')}>
                    Change tone
                    <ChevronRight size={16} strokeWidth={2.5} className="jf-paragraph__chevron" />
                  </button>
                  <button className="jf-paragraph__sheet-option" onClick={() => { setMobileSheetType(null); editorRef.current?.focus(); }}>
                    Simplify
                  </button>
                  <button className="jf-paragraph__sheet-option" onClick={() => { setMobileSheetType(null); editorRef.current?.focus(); }}>
                    Expand
                  </button>
                </div>
              </>
            )}

            {mobileSheetType === 'ai-tone' && (
              <>
                <div className="jf-paragraph__sheet-title">Change Tone</div>
                <div className="jf-paragraph__sheet-options">
                  {['Neutral', 'Friendly', 'Professional', 'Casual'].map((tone) => (
                    <button
                      key={tone}
                      className="jf-paragraph__sheet-option"
                      onClick={() => { setMobileSheetType(null); editorRef.current?.focus(); }}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>,
        deviceContainerRef.current,
      )}
    </div>
  );
};
