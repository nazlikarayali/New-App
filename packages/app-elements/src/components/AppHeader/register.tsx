import { ComponentRegistry } from '../../types/registry';
import { AppHeader } from './AppHeader';
import type { AppHeaderLayout } from './AppHeader';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import appHeaderScss from './AppHeader.scss?raw';

ComponentRegistry.register({
  id: 'app-header',
  name: 'App Header',
  category: 'Layout',
  icon: 'Layout',

  variants: {
    Layout: {
      options: ['Center', 'Left', 'Right'],
      default: 'Center',
    },
  },

  properties: [
    { name: 'Icon', type: 'icon', default: 'Leaf' },
    { name: 'Title', type: 'text', default: 'Urban Jungle' },
    { name: 'Subtitle', type: 'text', default: "Istanbul's Rare Plant Haven" },
    { name: 'Skeleton', type: 'boolean', default: false },
  ],

  states: [],

  scss: appHeaderScss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600' },
    { token: 'Title', variable: '--fg-inverse', value: '#FFFFFF', description: '--fg-inverse → white' },
    { token: 'Subtitle', variable: '--fg-inverse', value: '#FFFFFF', description: '--fg-inverse → white (50% opacity)' },
  ],

  usage: `import { AppHeader } from '@/components/AppHeader';

// Center layout (default)
<AppHeader
  layout="Center"
  title="Urban Jungle"
  subtitle="Istanbul's Rare Plant Haven"
/>

// Left-aligned
<AppHeader
  layout="Left"
  title="My Store"
  subtitle="Best products for you"
/>

// Right-aligned
<AppHeader
  layout="Right"
  title="Portfolio"
  subtitle="Creative works"
/>

// Without subtitle
<AppHeader
  title="Simple Header"
  subtitle=""
/>`,

  propDocs: [
    {
      name: 'layout',
      type: '"Left" | "Center" | "Right"',
      default: '"Center"',
      description: 'Controls the alignment of the icon, title, and subtitle within the header.',
    },
    {
      name: 'title',
      type: 'string',
      default: '"Urban Jungle"',
      description: 'The main title text. Rendered with Heading/H4/Bold typography and fg-inverse color.',
    },
    {
      name: 'subtitle',
      type: 'string',
      default: '"Istanbul\'s Rare Plant Haven"',
      description: 'Secondary text below the title. Rendered with Label/Large/Regular typography, fg-inverse color at 50% opacity. Pass an empty string to hide.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, _states: StateValues): React.ReactNode {
    return (
      <AppHeader
        layout={variants['Layout'] as AppHeaderLayout}
        icon={props['Icon'] as string}
        title={props['Title'] as string}
        subtitle={props['Subtitle'] as string}
        skeleton={props['Skeleton'] as boolean}
      />
    );
  },
});
