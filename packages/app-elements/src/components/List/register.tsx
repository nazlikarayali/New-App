import { ComponentRegistry } from '../../types/registry';
import { List } from './List';
import type { ListImageStyle, ListSize, ListAction, CardSize } from './List';
import type { CardImageStyle, CardLayout, CardAction } from '../Card';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import listScss from './List.scss?raw';

ComponentRegistry.register({
  id: 'list',
  name: 'List',
  category: 'Data Display',
  icon: 'List',

  variants: {
    Layout: {
      options: ['Basic', 'Card'],
      default: 'Basic',
    },
    // Basic layout variants
    'Image Style': {
      options: ['Square', 'Circle', 'None'],
      default: 'Square',
      showWhen: { Layout: 'Basic' },
    },
    Size: {
      options: ['Regular', 'Compact'],
      default: 'Regular',
      showWhen: { Layout: 'Basic' },
    },
    Action: {
      options: ['None', 'Icon', 'Button'],
      default: 'None',
      showWhen: { Layout: 'Basic' },
    },
    'Icon Filled': {
      options: ['Yes', 'No'],
      default: 'No',
      showWhen: { Layout: 'Basic', Action: 'Icon' },
    },
    // Card layout variants
    'Card Image Style': {
      options: ['Square', 'Circle', 'Icon', 'None'],
      default: 'Square',
      showWhen: { Layout: 'Card' },
    },
    'Card Layout': {
      options: ['Horizontal', 'Vertical'],
      default: 'Horizontal',
      showWhen: { Layout: 'Card' },
    },
    'Card Size': {
      options: ['Small', 'Medium', 'Large'],
      default: 'Medium',
      showWhen: { Layout: 'Card', 'Card Layout': 'Vertical' },
    },
    'Card Action': {
      options: ['None', 'Icon', 'Button'],
      default: 'None',
      showWhen: { Layout: 'Card' },
    },
    'Card Icon Filled': {
      options: ['Yes', 'No'],
      default: 'No',
      showWhen: { Layout: 'Card', 'Card Action': 'Icon' },
    },
  },

  properties: [
    { name: 'Title', type: 'text', default: 'List' },
    { name: 'Subtitle', type: 'text', default: '' },
    { name: 'Show Header', type: 'boolean', default: true },
    { name: 'Button Label', type: 'text', default: 'Edit' },
    { name: 'Skeleton', type: 'boolean', default: false },
    { name: 'Skeleton Animation', type: 'select', options: ['Pulse', 'Shimmer'], default: 'Pulse' },
    { name: 'Selected', type: 'boolean', default: false },
  ],

  states: [],

  scss: listScss,

  colorTokens: [
    { token: 'Image BG', variable: '--bg-surface-brand', value: '#EDE8FE', description: '--bg-surface-brand → primary-100' },
    { token: 'Title', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Description', variable: '--fg-secondary', value: '#353C6A', description: '--fg-secondary → neutral-600' },
    { token: 'Divider', variable: '--border', value: '#DADEF3', description: '--border → neutral-100', variants: { Layout: 'Basic' } },
    { token: 'Action BG', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600' },
    { token: 'Card Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100', variants: { Layout: 'Card' } },
  ],

  usage: `import { List } from '@/components/List';

// Basic list with square images (data source connected)
<List
  layout="Basic"
  imageStyle="Square"
  size="Regular"
  items={data.map(row => ({
    title: row.name,
    description: row.email,
  }))}
/>

// Card layout - uses Card component settings
<List
  layout="Card"
  cardImageStyle="Square"
  cardLayout="Card"
  cardAction="Button"
  cardButtonLabel="Edit"
/>

// Compact basic list with icon actions
<List
  layout="Basic"
  imageStyle="Circle"
  size="Compact"
  action="Icon"
/>

// No image basic list
<List
  layout="Basic"
  imageStyle="None"
  action="Button"
  buttonLabel="View"
/>`,

  propDocs: [
    {
      name: 'layout',
      type: '"Basic" | "Card"',
      default: '"Basic"',
      description:
        'Top-level layout switch. **Basic** renders horizontal rows separated by dividers with its own Image Style, Size, and Action settings. **Card** renders each item using the shared Card component with Card-specific variant settings.',
    },
    {
      name: 'imageStyle',
      type: '"Square" | "Circle" | "None"',
      default: '"Square"',
      description:
        'Image thumbnail shape for Basic layout. **Square** uses `radius-md`. **Circle** uses `radius-rounded`. **None** hides the image.',
    },
    {
      name: 'size',
      type: '"Regular" | "Compact"',
      default: '"Regular"',
      description:
        'Item size for Basic layout. **Regular** uses 104px image and `space-4` (16px) padding. **Compact** uses 64px image and `space-3` (12px) padding.',
    },
    {
      name: 'action',
      type: '"None" | "Icon" | "Button"',
      default: '"None"',
      description:
        'Action element for Basic layout rows.',
    },
    {
      name: 'cardImageStyle / cardLayout / cardAction',
      type: 'Card variant types',
      default: '"Square" / "Basic" / "None"',
      description:
        'When `layout="Card"`, these control the Card component variants for each list item. Same options as the standalone Card component.',
    },
    {
      name: 'items',
      type: 'ListItemData[]',
      default: '[{title, description}, ...]',
      description:
        'Array of list items from a connected data source. Each has a `title` and `description`.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, applies a 2px `border-info` border around the list.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, _states: StateValues): React.ReactNode {
    const isCard = variants['Layout'] === 'Card';

    return (
      <List
        layout={variants['Layout'] as 'Basic' | 'Card'}
        title={props['Title'] as string}
        subtitle={props['Subtitle'] as string}
        showHeader={props['Show Header'] as boolean}
        // Basic layout props
        imageStyle={variants['Image Style'] as ListImageStyle}
        size={variants['Size'] as ListSize}
        action={variants['Action'] as ListAction}
        actionIconFilled={variants['Icon Filled'] === 'Yes'}
        buttonLabel={props['Button Label'] as string}
        // Card layout props
        cardImageStyle={isCard ? variants['Card Image Style'] as CardImageStyle : undefined}
        cardLayout={isCard ? variants['Card Layout'] as CardLayout : undefined}
        cardAction={isCard ? variants['Card Action'] as CardAction : undefined}
        cardActionIconFilled={variants['Card Icon Filled'] === 'Yes'}
        cardSize={isCard ? variants['Card Size'] as CardSize : undefined}
        cardButtonLabel={props['Button Label'] as string}
        // Common
        skeleton={props['Skeleton'] as boolean}
        skeletonAnimation={(props['Skeleton Animation'] as string)?.toLowerCase() as 'pulse' | 'shimmer'}
        selected={props['Selected'] as boolean}
      />
    );
  },
});
