import { ComponentRegistry } from '../../types/registry';
import { Form } from './Form';
import type { FormAlignment, FormSize } from './Form';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import formScss from './Form.scss?raw';

ComponentRegistry.register({
  id: 'form',
  name: 'Form',
  category: 'Data Display',
  icon: 'ClipboardList',

  variants: {
    'Layout Type': {
      options: ['Card', 'Form'],
      default: 'Card',
    },
    Alignment: {
      options: ['Left', 'Center', 'Right'],
      default: 'Left',
      showWhen: { 'Layout Type': 'Card' },
    },
    Size: {
      options: ['Normal', 'Large'],
      default: 'Normal',
      showWhen: { 'Layout Type': 'Card' },
    },
  },

  properties: [
    { name: 'Label', type: 'text', default: 'Form', showWhen: { 'Layout Type': 'Card' } },
    { name: 'Description', type: 'text', default: 'Type a description', showWhen: { 'Layout Type': 'Card' } },
    { name: 'Show Icon', type: 'boolean', default: true, showWhen: { 'Layout Type': 'Card' } },
    { name: 'Required', type: 'boolean', default: true, showWhen: { 'Layout Type': 'Card' } },
    { name: 'Selected', type: 'boolean', default: false, showWhen: { 'Layout Type': 'Card' } },
    { name: 'Shrinked', type: 'boolean', default: false, showWhen: { 'Layout Type': 'Card' } },
    { name: 'Show Border', type: 'boolean', default: true, showWhen: { 'Layout Type': 'Form' } },
    { name: 'Skeleton', type: 'boolean', default: false },
  ],

  states: [],

  scss: formScss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: '--bg-fill → neutral-0' },
    { token: 'Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
    { token: 'Icon BG', variable: '--bg-surface-brand', value: '#EDE8FE', description: '--bg-surface-brand → primary-100' },
    { token: 'Icon Color', variable: '--fg-brand', value: '#7D38EF', description: '--fg-brand → primary-600' },
    { token: 'Title', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Description', variable: '--fg-secondary', value: '#353C6A', description: '--fg-secondary → neutral-600' },
    { token: 'Badge BG', variable: '--fg-brand', value: '#7D38EF', description: '--fg-brand → primary-600' },
    { token: 'Badge Icon', variable: '--fg-inverse', value: '#FFFFFF', description: '--fg-inverse → neutral-0' },
  ],

  usage: `import { Form } from '@/components/Form';

// Default form with required badge
<Form
  label="Form"
  description="Fill out the registration form"
  required={true}
/>

// Large size, centered
<Form
  alignment="Center"
  size="Large"
  label="Survey"
  description="Share your feedback"
/>

// Without required badge
<Form
  label="Contact Form"
  description="Optional feedback"
  required={false}
/>

// Show expanded form view
<Form showForm={true} />`,

  propDocs: [
    {
      name: 'alignment',
      type: '"Left" | "Center" | "Right"',
      default: '"Left"',
      description:
        'Controls the layout direction. **Left** and **Right** render horizontally. **Center** stacks icon above text.',
    },
    {
      name: 'size',
      type: '"Normal" | "Large"',
      default: '"Normal"',
      description:
        'Controls icon and text size. **Normal**: 60px icon, 14/12px text. **Large**: 100px icon, 16/14px text.',
    },
    {
      name: 'label',
      type: 'string',
      default: '"Form"',
      description: 'The form name displayed as the primary text.',
    },
    {
      name: 'description',
      type: 'string',
      default: '"Type a description"',
      description: 'Secondary text below the label.',
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'true',
      description:
        'When `true`, shows a red circular badge with an asterisk icon indicating the form is required.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description: 'When `true`, applies a 2px `border-info` border.',
    },
    {
      name: 'shrinked',
      type: 'boolean',
      default: 'false',
      description: 'When `true`, constrains width to 300px.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, _states: StateValues): React.ReactNode {
    return (
      <Form
        alignment={variants['Alignment'] as FormAlignment}
        size={variants['Size'] as FormSize}
        label={props['Label'] as string}
        description={props['Description'] as string}
        showIcon={props['Show Icon'] as boolean}
        required={props['Required'] as boolean}
        selected={props['Selected'] as boolean}
        shrinked={props['Shrinked'] as boolean}
        skeleton={props['Skeleton'] as boolean}
        showForm={variants['Layout Type'] === 'Form'}
        showBorder={props['Show Border'] !== false}
      />
    );
  },
});
