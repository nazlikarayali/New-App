import { ComponentRegistry } from '../../types/registry';
import { Heading } from './Heading';
import type { HeadingSize, HeadingAlignment } from './Heading';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import headingScss from './Heading.scss?raw';

ComponentRegistry.register({
  id: 'heading',
  name: 'Heading',
  category: 'Typography',
  icon: 'Type',

  variants: {
    Size: {
      options: ['Large', 'Medium', 'Small'],
      default: 'Medium',
    },
    Alignment: {
      options: ['Left', 'Center', 'Right'],
      default: 'Left',
    },
  },

  properties: [
    { name: 'Heading', type: 'text', default: 'Heading' },
    { name: 'Subheading', type: 'text', default: '' },
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Shrinked', type: 'boolean', default: false },
    { name: 'Skeleton', type: 'boolean', default: false },
  ],

  states: [],

  scss: headingScss,

  colorTokens: [
    { token: 'Heading', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Subheading', variable: '--fg-secondary', value: '#353C6A', description: '--fg-secondary → neutral-600' },
  ],

  usage: `import { Heading } from '@/components/Heading';

// Large heading, left-aligned (default)
<Heading
  size="Large"
  alignment="Left"
  heading="Welcome to Our Store"
  subheading="Discover the best products curated just for you."
/>

// Medium heading, centered
<Heading
  size="Medium"
  alignment="Center"
  heading="About Us"
  subheading="Learn more about our mission and values."
/>

// Small heading, right-aligned
<Heading
  size="Small"
  alignment="Right"
  heading="Contact"
  subheading="Get in touch with our support team."
/>

// Without subheading
<Heading
  size="Large"
  heading="Section Title"
  subheading=""
/>`,

  propDocs: [
    {
      name: 'size',
      type: '"Large" | "Medium" | "Small"',
      default: '"Large"',
      description:
        'Controls the heading typography scale. **Large** uses `Heading/H4/Bold` (28px, -0.56px letter-spacing). **Medium** uses `Heading/H5/Bold` (24px, -0.48px). **Small** uses `Heading/H6/Bold` (20px, -0.4px).',
    },
    {
      name: 'alignment',
      type: '"Left" | "Center" | "Right"',
      default: '"Left"',
      description:
        'Sets the text alignment for both heading and subheading.',
    },
    {
      name: 'heading',
      type: 'string',
      default: '"Heading"',
      description:
        'The main heading text. Rendered with semibold weight and `fg-primary` color.',
    },
    {
      name: 'subheading',
      type: 'string',
      default: '"Subheading"',
      description:
        'Secondary text below the heading. Rendered with `Label/Large/Regular` typography (16px, regular weight, `neutral-500` color). Pass an empty string to hide it.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, applies a 2px `border-info` border around the heading element.',
    },
    {
      name: 'shrinked',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, constrains the width to 300px instead of 616px.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, _states: StateValues): React.ReactNode {
    return (
      <Heading
        size={variants['Size'] as HeadingSize}
        alignment={variants['Alignment'] as HeadingAlignment}
        heading={props['Heading'] as string}
        subheading={props['Subheading'] as string}
        selected={props['Selected'] as boolean}
        shrinked={props['Shrinked'] as boolean}
        skeleton={props['Skeleton'] as boolean}
      />
    );
  },
});
