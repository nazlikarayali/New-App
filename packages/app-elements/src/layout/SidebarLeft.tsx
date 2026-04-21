import { useState } from 'react';
import { Icon } from '../components/Icon/Icon';
import type { RegisteredComponent } from '../types/registry';

interface SidebarLeftProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  components: RegisteredComponent[];
  foundationPage?: string | null;
  onFoundationSelect?: (page: string) => void;
}

function ComponentIcon({ name }: { name: string }) {
  return <Icon name={name} size={16} />;
}

export function SidebarLeft({ selectedId, onSelect, components, foundationPage, onFoundationSelect }: SidebarLeftProps) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? components.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.category.toLowerCase().includes(search.toLowerCase())
      )
    : components;

  const categories: Record<string, typeof filtered> = {};
  for (const comp of filtered) {
    const cat = comp.category || 'General';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(comp);
  }

  return (
    <aside className="sidebar-left">
      <div className="sidebar-left__search">
        <input
          type="text"
          placeholder="Search components..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <nav className="component-list">
        {/* Foundations */}
        {!search && (
          <div className="component-list__category">
            <div className="component-list__category-title">Foundations</div>
            <button
              className={`component-list__item${foundationPage === 'colors' ? ' active' : ''}`}
              onClick={() => onFoundationSelect?.('colors')}
            >
              <span className="component-list__item-icon">
                <Icon name="Palette" size={16} />
              </span>
              Colors
            </button>
            <button
              className={`component-list__item${foundationPage === 'spacing' ? ' active' : ''}`}
              onClick={() => onFoundationSelect?.('spacing')}
            >
              <span className="component-list__item-icon">
                <Icon name="Ruler" size={16} />
              </span>
              Spacing
            </button>
            <button
              className={`component-list__item${foundationPage === 'radius' ? ' active' : ''}`}
              onClick={() => onFoundationSelect?.('radius')}
            >
              <span className="component-list__item-icon">
                <Icon name="RectangleHorizontal" size={16} />
              </span>
              Radius
            </button>
            <button
              className={`component-list__item${foundationPage === 'typography' ? ' active' : ''}`}
              onClick={() => onFoundationSelect?.('typography')}
            >
              <span className="component-list__item-icon">
                <Icon name="Type" size={16} />
              </span>
              Typography
            </button>
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>{search ? 'No matching components.' : 'No components yet.'}</p>
            <p className="empty-state__hint">
              Components will appear here as they are added from Figma designs.
            </p>
          </div>
        ) : (
          Object.entries(categories).map(([category, comps]) => (
            <div className="component-list__category" key={category}>
              <div className="component-list__category-title">{category}</div>
              {comps.map((comp) => (
                <button
                  key={comp.id}
                  className={`component-list__item${comp.id === selectedId ? ' active' : ''}`}
                  onClick={() => onSelect(comp.id)}
                >
                  <span className="component-list__item-icon">
                    <ComponentIcon name={comp.icon} />
                  </span>
                  {comp.name}
                </button>
              ))}
            </div>
          ))
        )}
      </nav>
    </aside>
  );
}
