import { ComponentRegistry } from '../../types/registry';
import { Testimonial } from './Testimonial';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import testimonialScss from './Testimonial.scss?raw';

ComponentRegistry.register({
  id: 'testimonial',
  name: 'Testimonial',
  category: 'Data Display',
  icon: 'Quote',

  variants: {},

  properties: [
    { name: 'Show Avatars', type: 'boolean', default: false },
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Skeleton', type: 'boolean', default: false },
  ],

  states: [],

  scss: testimonialScss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: '--bg-fill → neutral-0' },
    { token: 'Avatar BG', variable: '--bg-surface-brand', value: '#EDE8FE', description: '--bg-surface-brand → primary-100' },
    { token: 'Avatar Icon', variable: '--fg-brand', value: '#7D38EF', description: '--fg-brand → primary-600' },
    { token: 'Name', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Quote', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Nav BG', variable: '--fg-primary', value: '#091141', description: 'color-mix(--fg-primary 8%, --bg-fill)' },
  ],

  usage: `import { Testimonial } from '@/components/Testimonial';

// Default testimonial carousel
<Testimonial />

// Custom testimonials
<Testimonial
  items={[
    { name: "Jane Doe", text: "\u201CAbsolutely amazing product!\u201D" },
    { name: "John Smith", text: "\u201CChanged how we work.\u201D" },
    { name: "Sarah Lee", text: "\u201CHighly recommended.\u201D" },
  ]}
/>`,

  propDocs: [
    {
      name: 'items',
      type: 'TestimonialItem[]',
      default: '[3 default items]',
      description:
        'Array of testimonials. Each has `name` (H6/Bold, 20px) and `text` (Paragraph/XSmall, 12px). Navigated with chevron buttons.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description: 'When `true`, applies a 2px `border-info` border.',
    },
  ],

  render(_variants: VariantValues, props: PropertyValues, _states: StateValues): React.ReactNode {
    const showAvatars = props['Show Avatars'] as boolean;
    const items = showAvatars
      ? [
          { name: 'Sarah Johnson', text: '\u201CThis platform transformed how we collect donations. The interface is intuitive and our donors love it.\u201D', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' },
          { name: 'Michael Chen', text: '\u201CSetup was incredibly easy. We were up and running in minutes, not days.\u201D', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
          { name: 'Emily Davis', text: '\u201CThe best investment we made for our nonprofit. Highly recommended!\u201D', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
        ]
      : undefined;
    return (
      <Testimonial
        items={items}
        selected={props['Selected'] as boolean}
        skeleton={props['Skeleton'] as boolean}
      />
    );
  },
});
