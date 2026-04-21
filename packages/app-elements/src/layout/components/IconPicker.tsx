import { useState, useMemo, useRef, useEffect } from 'react';
import { useIconLibrary } from '../../context/IconLibraryContext';
import { getIconsForPicker, resolveIcon } from '../../utils/iconRegistry';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label: string;
}

export function IconPicker({ value, onChange, label }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const { library, iconStyle } = useIconLibrary();

  const allIcons = useMemo(() => getIconsForPicker(library, iconStyle), [library, iconStyle]);
  const iconNames = useMemo(() => Object.keys(allIcons), [allIcons]);

  const filtered = useMemo(() => {
    if (!search) return iconNames.slice(0, 60);
    const q = search.toLowerCase();
    return iconNames.filter((n) => n.toLowerCase().includes(q)).slice(0, 60);
  }, [search, iconNames]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedResolved = value && value !== 'none' ? resolveIcon(value, library, iconStyle) : null;

  return (
    <div className="icon-picker" ref={ref}>
      <div className="icon-picker__label">{label}</div>
      <button
        className="icon-picker__trigger"
        onClick={() => { setOpen(!open); setSearch(''); }}
      >
        {selectedResolved ? (
          <>
            <selectedResolved.component size={16} />
            <span className="icon-picker__name">{value}</span>
          </>
        ) : (
          <span className="icon-picker__name icon-picker__name--none">None</span>
        )}
        <svg className="icon-picker__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="icon-picker__dropdown">
          <input
            className="icon-picker__search"
            type="text"
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="icon-picker__grid">
            <button
              className={`icon-picker__item${!value || value === 'none' ? ' active' : ''}`}
              onClick={() => { onChange('none'); setOpen(false); }}
              title="None"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {filtered.map((name) => {
              const IconComp = allIcons[name];
              if (!IconComp) return null;
              return (
                <button
                  key={name}
                  className={`icon-picker__item${value === name ? ' active' : ''}`}
                  onClick={() => { onChange(name); setOpen(false); }}
                  title={name}
                >
                  <IconComp size={16} />
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="icon-picker__empty">No icons found</div>
          )}
        </div>
      )}
    </div>
  );
}
