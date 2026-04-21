import { ComponentRegistry } from '../../types/registry';
import { SocialFollow } from './SocialFollow';
import type { SocialLayout } from './SocialFollow';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import socialScss from './SocialFollow.scss?raw';

ComponentRegistry.register({
  id: 'social-follow',
  name: 'Social Follow',
  category: 'Actions',
  icon: 'Share2',

  variants: {
    Layout: {
      options: ['Horizontal', 'Wrap'],
      default: 'Horizontal',
    },
    Filled: {
      options: ['Yes', 'No'],
      default: 'Yes',
    },
  },

  properties: [
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Shrinked', type: 'boolean', default: false },
    { name: 'Skeleton', type: 'boolean', default: false },
  ],

  states: [],

  scss: socialScss,

  colorTokens: [
    { token: 'Icon BG', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600', variants: { Filled: 'Yes' } },
    { token: 'Icon Color', variable: '--fg-inverse', value: '#FFFFFF', description: '--fg-inverse → neutral-0', variants: { Filled: 'Yes' } },
    { token: 'Icon Color', variable: '--fg-brand', value: '#7D38EF', description: '--fg-brand → primary-600', variants: { Filled: 'No' } },
  ],

  usage: `import { SocialFollow } from '@/components/SocialFollow';

// Default horizontal layout with filled icons
<SocialFollow
  layout="Horizontal"
  filled={true}
/>

// Wrap layout for narrow containers
<SocialFollow
  layout="Wrap"
  filled={true}
  shrinked={true}
/>

// Ghost (unfilled) style
<SocialFollow
  filled={false}
/>

// Custom platforms
<SocialFollow
  platforms={[
    { icon: "Youtube", label: "YouTube" },
    { icon: "Twitter", label: "X" },
    { icon: "Facebook", label: "Facebook" },
    { icon: "Github", label: "GitHub" },
    { icon: "Twitch", label: "Twitch" },
  ]}
/>`,

  propDocs: [
    {
      name: 'layout',
      type: '"Horizontal" | "Wrap"',
      default: '"Horizontal"',
      description:
        'Controls the icon arrangement. **Horizontal** aligns icons in a single row. **Wrap** allows icons to wrap to multiple lines, centered.',
    },
    {
      name: 'filled',
      type: 'boolean',
      default: 'true',
      description:
        'When `true`, icons have a solid `bg-fill-brand` background with white icon. When `false`, icons are ghost style with `fg-brand` color and no background.',
    },
    {
      name: 'platforms',
      type: 'SocialPlatform[]',
      default: '[YouTube, X, LinkedIn, Instagram]',
      description:
        'Array of social platforms. Each has an `icon` (Lucide icon name) and `label` (display name). Uses the shared Button component in icon-only mode with rounded corners.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, applies a 2px `border-info` border.',
    },
    {
      name: 'shrinked',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, constrains width to 300px and forces wrap layout.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, _states: StateValues): React.ReactNode {
    return (
      <SocialFollow
        layout={variants['Layout'] as SocialLayout}
        filled={variants['Filled'] === 'Yes'}
        selected={props['Selected'] as boolean}
        shrinked={props['Shrinked'] as boolean}
        skeleton={props['Skeleton'] as boolean}
      />
    );
  },
});
