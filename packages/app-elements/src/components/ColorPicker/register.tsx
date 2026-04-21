import { useState } from 'react';
import { ComponentRegistry } from '../../types/registry';
import { ColorPicker } from './ColorPicker';
import type { ColorPickerMode } from './ColorPicker';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './ColorPicker.scss?raw';

function ColorPickerPreview({ selected, mode }: { selected: boolean; mode: ColorPickerMode }) {
  const [color, setColor] = useState('#7D38EF');
  const [tint, setTint] = useState(50);
  const [opacity, setOpacity] = useState(100);
  return <ColorPicker color={color} onChange={setColor} tint={tint} onTintChange={setTint} opacity={opacity} onOpacityChange={setOpacity} mode={mode} selected={selected} />;
}

ComponentRegistry.register({
  id: 'color-picker',
  name: 'Color Picker',
  category: 'Widgets',
  icon: 'Palette',

  variants: {
    Mode: {
      options: ['Tint', 'Opacity'],
      default: 'Tint',
    },
  },

  properties: [
    { name: 'Selected', type: 'boolean', default: false },
  ],

  states: [],

  scss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: '--bg-fill → neutral-0' },
    { token: 'Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
  ],

  usage: `import { ColorPicker } from '@/components/ColorPicker';

// Basic color picker
<ColorPicker
  color="#7D38EF"
  onChange={(color) => console.log(color)}
  tint={50}
  onTintChange={(tint) => console.log(tint)}
/>`,

  propDocs: [
    {
      name: 'color',
      type: 'string',
      default: '"#7D38EF"',
      description: 'Current color value as hex string.',
    },
    {
      name: 'onChange',
      type: '(color: string) => void',
      default: 'undefined',
      description: 'Callback fired when color changes via saturation area, hue slider, hex input, or eyedropper.',
    },
    {
      name: 'tint',
      type: 'number',
      default: '50',
      description: 'Base color tint value (0-100). 0 = grey, 100 = fully tinted.',
    },
    {
      name: 'onTintChange',
      type: '(tint: number) => void',
      default: 'undefined',
      description: 'Callback fired when tint slider value changes.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description: 'When true, shows a blue selection outline around the picker.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, _states: StateValues) {
    return (
      <ColorPickerPreview selected={props['Selected'] as boolean} mode={variants['Mode'] as ColorPickerMode} />
    );
  },
});
