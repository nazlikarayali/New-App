import { ComponentRegistry } from '../../types/registry';
import { EmptyState } from './EmptyState';
import type { EmptyStateVariant } from './EmptyState';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import emptyStateScss from './EmptyState.scss?raw';

ComponentRegistry.register({
  id: 'empty-state',
  name: 'Empty State',
  category: 'Feedback',
  icon: 'Move',

  variants: {
    Variant: {
      options: ['Default', 'Loading'],
      default: 'Default',
    },
  },

  properties: [
    { name: 'Message', type: 'text', default: 'Drag your first element here from left.' },
    { name: 'Mobile', type: 'boolean', default: false },
  ],

  states: [],

  scss: emptyStateScss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: '--bg-fill → neutral-0 (mixed with --bg-fill-brand)' },
    { token: 'Text', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600 (mixed with --fg-primary)' },
  ],

  usage: `import { EmptyState } from '@/components/EmptyState';

// Default empty state
<EmptyState />

// Custom message
<EmptyState message="No items yet. Add your first one!" />`,

  propDocs: [
    {
      name: 'message',
      type: 'string',
      default: '"Drag your first element here from left."',
      description:
        'The instructional text displayed next to the move icon.',
    },
  ],

  render(_variants: VariantValues, props: PropertyValues, _states: StateValues): React.ReactNode {
    return (
      <EmptyState
        variant={_variants['Variant'] as EmptyStateVariant}
        message={props['Message'] as string}
        mobile={props['Mobile'] as boolean}
      />
    );
  },
});
