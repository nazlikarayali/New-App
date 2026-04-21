import { ComponentRegistry } from '../../types/registry';
import { Spacer } from './Spacer';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import spacerScss from './Spacer.scss?raw';

ComponentRegistry.register({
  id: 'spacer',
  name: 'Spacer',
  category: 'Layout',
  icon: 'SeparatorHorizontal',

  variants: {},

  properties: [
    { name: 'Height', type: 'number', default: 48, min: 1, max: 200, step: 4 },
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Shrinked', type: 'boolean', default: false },
  ],

  states: [],

  scss: spacerScss,

  colorTokens: [],

  usage: `import { Spacer } from '@/components/Spacer';

// Default spacer (48px)
<Spacer />

// Custom height
<Spacer height={80} />

// Shrinked width
<Spacer height={32} shrinked />`,

  propDocs: [
    {
      name: 'height',
      type: 'number',
      default: '48',
      description:
        'Vertical height in pixels. Adjustable from the properties panel.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description:
        'When true, applies a 2px border-info outline around the spacer.',
    },
    {
      name: 'shrinked',
      type: 'boolean',
      default: 'false',
      description:
        'When true, constrains the width to 300px.',
    },
  ],

  render(_variants: VariantValues, props: PropertyValues, _states: StateValues, onPropertyChange?: (name: string, value: string | boolean | number) => void): React.ReactNode {
    return (
      <Spacer
        height={props['Height'] as number}
        selected={props['Selected'] as boolean}
        shrinked={props['Shrinked'] as boolean}
        onHeightChange={onPropertyChange ? (h) => onPropertyChange('Height', h) : undefined}
      />
    );
  },
});
