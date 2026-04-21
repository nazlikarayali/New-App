import type React from 'react';
import { Icon } from '../Icon/Icon';
import './BottomNavigation.scss';

// ============================================
// Types
// ============================================
export interface NavItem {
  icon: string;
  label: string;
}

export interface BottomNavigationProps {
  items?: NavItem[];
  activeIndex?: number;
  selected?: boolean;
  onItemClick?: (index: number) => void;
}

const DEFAULT_ITEMS: NavItem[] = [
  { icon: 'House', label: 'Home' },
  { icon: 'ShoppingBag', label: 'Shop' },
  { icon: 'CalendarCheck', label: 'Workshops' },
  { icon: 'FileText', label: 'Blog' },
];

// ============================================
// BottomNavigation Component
// ============================================
export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items = DEFAULT_ITEMS,
  activeIndex = 0,
  selected,
  onItemClick,
}) => {
  return (
    <nav className={`bottom-nav${selected ? ' component-selected' : ''}`}>
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={index}
            className={`bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`}
            onClick={() => onItemClick?.(index)}
          >
            <Icon name={item.icon} size={20} forceStyle={isActive ? 'fill' : undefined} />
            <span className="bottom-nav__label">{item.label}</span>
            {isActive && <span className="bottom-nav__indicator" />}
          </div>
        );
      })}
    </nav>
  );
};
