import { ComponentRegistry } from '../../types/registry';
import { Card } from './Card';
import type { CardImageStyle, CardLayout, CardAction } from './Card';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import cardScss from './Card.scss?raw';

ComponentRegistry.register({
  id: 'card',
  name: 'Card',
  category: 'Data Display',
  icon: 'RectangleHorizontal',

  variants: {
    'Image Style': {
      options: ['Square', 'Circle', 'Icon', 'None'],
      default: 'Square',
    },
    Layout: {
      options: ['Horizontal', 'Vertical'],
      default: 'Horizontal',
    },
    Action: {
      options: ['None', 'Icon', 'Button'],
      default: 'None',
    },
    'Icon Filled': {
      options: ['Yes', 'No'],
      default: 'No',
      showWhen: { Action: 'Icon' },
    },
  },

  properties: [
    { name: 'Title', type: 'text', default: 'Card Title' },
    { name: 'Description', type: 'text', default: 'Card description' },
    { name: 'Icon', type: 'icon', default: 'Heart', showWhen: { 'Image Style': 'Icon' } },
    { name: 'Button Label', type: 'text', default: 'Edit' },
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Shrinked', type: 'boolean', default: false },
    { name: 'Skeleton', type: 'boolean', default: false },
  ],

  states: [{ name: 'Hover', default: false }],

  scss: cardScss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: '--bg-fill → neutral-0' },
    { token: 'Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
    { token: 'Image BG', variable: '--bg-surface-brand', value: '#EDE8FE', description: '--bg-surface-brand → primary-100' },
    { token: 'Title', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Description', variable: '--fg-secondary', value: '#353C6A', description: '--fg-secondary → neutral-600' },
    { token: 'Action BG', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600' },
    { token: 'Action Hover', variable: '--bg-fill-brand-hover', value: '#6D29D8', description: '--bg-fill-brand-hover → primary-700' },
    { token: 'Action Text', variable: '--fg-inverse', value: '#FFFFFF', description: '--fg-inverse → neutral-0' },
  ],

  usage: `import { Card } from '@/components/Card';

// Basic card with square image
<Card
  imageStyle="Square"
  layout="Basic"
  title="Product Overview"
  description="View detailed product information"
/>

// Vertical card layout with circle image and action button
<Card
  imageStyle="Circle"
  layout="Card"
  action="Button"
  title="User Profile"
  description="Manage your account settings"
  buttonLabel="Edit Profile"
/>

// Compact card with icon and chevron action
<Card
  imageStyle="Icon"
  layout="Basic"
  action="Icon"
  title="Notifications"
  description="You have 3 unread messages"
/>

// Selected state with shrinked width
<Card
  imageStyle="Square"
  layout="Basic"
  title="Selected Item"
  description="This card is currently active"
  selected={true}
  shrinked={true}
/>

// Minimal card without image
<Card
  imageStyle="None"
  layout="Basic"
  action="Button"
  title="Quick Action"
  description="Tap to get started"
  buttonLabel="Start"
/>`,

  propDocs: [
    {
      name: 'imageStyle',
      type: '"Square" | "Circle" | "Icon" | "None"',
      default: '"Square"',
      description:
        'Determines the image/thumbnail style. **Square** renders a rounded-rectangle thumbnail, **Circle** renders a circular avatar, **Icon** renders a small icon badge, and **None** hides the image area entirely.',
    },
    {
      name: 'layout',
      type: '"Basic" | "Card"',
      default: '"Basic"',
      description:
        'Controls the overall layout direction. **Basic** arranges content horizontally (image left, text right). **Card** stacks content vertically with the image on top.',
    },
    {
      name: 'action',
      type: '"None" | "Icon" | "Button"',
      default: '"None"',
      description:
        'Defines the action element on the card. **None** shows no action. **Icon** renders a small circular icon button (chevron). **Button** renders a labeled text button — full-width in Card layout, inline in Basic layout.',
    },
    {
      name: 'title',
      type: 'string',
      default: '"Card Title"',
      description:
        'The primary text of the card. Rendered with `Label/Large/Bold` typography (16px, semibold). Truncated with ellipsis on overflow.',
    },
    {
      name: 'description',
      type: 'string',
      default: '"Card description"',
      description:
        'Secondary descriptive text below the title. Rendered with `Paragraph/Small/Regular` typography (14px, regular). Truncated with ellipsis on overflow.',
    },
    {
      name: 'buttonLabel',
      type: 'string',
      default: '"Edit"',
      description:
        'Text displayed inside the action button. Only visible when `action` is set to `"Button"`.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, applies a 2px `border-info` (#00A3E9) border around the card to indicate the selected/active state.',
    },
    {
      name: 'shrinked',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, constrains the card to a maximum width of 300px. Useful for compact grid or sidebar placements.',
    },
    {
      name: 'hover',
      type: 'boolean',
      default: 'false',
      description:
        'Programmatically applies the hover visual state (`shadow-md`). Useful for demo/preview purposes without requiring actual mouse interaction.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, states: StateValues): React.ReactNode {
    return (
      <Card
        imageStyle={variants['Image Style'] as CardImageStyle}
        layout={variants['Layout'] as CardLayout}
        action={variants['Action'] as CardAction}
        actionIconFilled={variants['Icon Filled'] === 'Yes'}
        iconName={props['Icon'] as string}
        title={props['Title'] as string}
        description={props['Description'] as string}
        buttonLabel={props['Button Label'] as string}
        selected={props['Selected'] as boolean}
        shrinked={props['Shrinked'] as boolean}
        skeleton={props['Skeleton'] as boolean}
        hover={states['Hover'] as boolean}
      />
    );
  },
});
