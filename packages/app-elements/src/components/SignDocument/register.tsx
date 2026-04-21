import { ComponentRegistry } from '../../types/registry';
import { SignDocument } from './SignDocument';
import type { SignDocumentAlignment, SignDocumentSize } from './SignDocument';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import signDocScss from './SignDocument.scss?raw';

ComponentRegistry.register({
  id: 'sign-document',
  name: 'Sign Document',
  category: 'Data Display',
  icon: 'FilePenLine',

  variants: {
    Alignment: {
      options: ['Left', 'Center', 'Right'],
      default: 'Left',
    },
    Size: {
      options: ['Normal', 'Large'],
      default: 'Normal',
    },
  },

  properties: [
    { name: 'Label', type: 'text', default: 'Sign Document' },
    { name: 'Description', type: 'text', default: 'Type a description' },
    { name: 'Show Icon', type: 'boolean', default: true },
    { name: 'Required', type: 'boolean', default: true },
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Shrinked', type: 'boolean', default: false },
    { name: 'Skeleton', type: 'boolean', default: false },
  ],

  states: [],

  scss: signDocScss,

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

  usage: `import { SignDocument } from '@/components/SignDocument';

// Default sign document with required badge
<SignDocument
  label="Sign Document"
  description="Please sign the NDA agreement"
  required={true}
/>

// Large size, centered
<SignDocument
  alignment="Center"
  size="Large"
  label="Employment Contract"
  description="Review and sign before onboarding"
/>

// Without required badge
<SignDocument
  label="Optional Waiver"
  description="Sign if applicable"
  required={false}
/>

// Right-aligned
<SignDocument
  alignment="Right"
  label="Release Form"
  description="Legal document"
/>`,

  propDocs: [
    {
      name: 'alignment',
      type: '"Left" | "Center" | "Right"',
      default: '"Left"',
      description:
        'Controls the layout direction. **Left** and **Right** render horizontally. **Center** stacks icon above text vertically.',
    },
    {
      name: 'size',
      type: '"Normal" | "Large"',
      default: '"Normal"',
      description:
        'Controls icon and text size. **Normal**: 56px icon, `Label/Medium/Bold` (14px) title, `Label/Small/Regular` (12px) desc. **Large**: 100px icon, `Label/Large/Bold` (16px) title, `Label/Medium/Regular` (14px) desc.',
    },
    {
      name: 'label',
      type: 'string',
      default: '"Sign Document"',
      description:
        'The document name displayed as the primary text.',
    },
    {
      name: 'description',
      type: 'string',
      default: '"Type a description"',
      description:
        'Secondary text below the label.',
    },
    {
      name: 'showIcon',
      type: 'boolean',
      default: 'true',
      description:
        'When `true`, shows the sign document icon with `bg-surface-brand` background.',
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'true',
      description:
        'When `true`, shows a red circular badge with an asterisk icon on the right side, indicating the document is required to be signed.',
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
        'When `true`, constrains width to 300px.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, _states: StateValues): React.ReactNode {
    return (
      <SignDocument
        alignment={variants['Alignment'] as SignDocumentAlignment}
        size={variants['Size'] as SignDocumentSize}
        label={props['Label'] as string}
        description={props['Description'] as string}
        showIcon={props['Show Icon'] as boolean}
        required={props['Required'] as boolean}
        selected={props['Selected'] as boolean}
        shrinked={props['Shrinked'] as boolean}
        skeleton={props['Skeleton'] as boolean}
      />
    );
  },
});
