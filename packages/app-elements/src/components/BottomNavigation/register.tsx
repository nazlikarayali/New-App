import { ComponentRegistry } from '../../types/registry';
import { BottomNavigation } from './BottomNavigation';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import bottomNavScss from './BottomNavigation.scss?raw';

ComponentRegistry.register({
  id: 'bottom-navigation',
  name: 'Bottom Navigation',
  category: 'Navigation',
  icon: 'PanelBottom',

  variants: {},

  properties: [
    { name: 'Active Index', type: 'text', default: '0' },
  ],

  states: [],

  scss: bottomNavScss,

  colorTokens: [
    { token: 'Background', variable: '--bg-surface', value: '#FFFFFF', description: '--bg-surface → neutral-0' },
    { token: 'Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
    { token: 'Active Icon & Label', variable: '--fg-brand', value: '#7D38EF', description: '--fg-brand → primary-600' },
    { token: 'Active Hover', variable: '--fg-brand-hover', value: '#6D29D8', description: '--fg-brand-hover → primary-700' },
    { token: 'Default Icon & Label', variable: '--fg-tertiary', value: '#6C73A8', description: '--fg-tertiary → neutral-400' },
    { token: 'Hover Icon & Label', variable: '--fg-secondary', value: '#353C6A', description: '--fg-secondary → neutral-600' },
    { token: 'Indicator', variable: '--fg-brand', value: '#7D38EF', description: '--fg-brand → primary-600' },
  ],

  usage: `import { BottomNavigation } from '@/components/BottomNavigation';

// Default bottom navigation (first item active)
<BottomNavigation />

// With custom active item
<BottomNavigation activeIndex={2} />

// With custom items
<BottomNavigation
  items={[
    { icon: 'House', label: 'Home' },
    { icon: 'Search', label: 'Search' },
    { icon: 'Heart', label: 'Favorites' },
    { icon: 'User', label: 'Profile' },
  ]}
  activeIndex={0}
/>`,

  propDocs: [
    {
      name: 'items',
      type: 'NavItem[]',
      default: '[Home, Shop, Workshops, Blog]',
      description:
        'Array of navigation items. Each item has an `icon` (Lucide icon name) and a `label` (display text).',
    },
    {
      name: 'activeIndex',
      type: 'number',
      default: '0',
      description:
        'Index of the currently active/selected navigation item. The active item displays in `fg-brand` color with a 2px indicator line at the top.',
    },
  ],

  render(_variants: VariantValues, props: PropertyValues, _states: StateValues) {
    const activeIndex = parseInt(props['Active Index'] as string, 10) || 0;

    return (
      <BottomNavigation
        activeIndex={activeIndex}
      />
    );
  },
});
