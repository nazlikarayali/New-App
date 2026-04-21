import { ComponentRegistry } from '../../types/registry';
import { Paragraph } from './Paragraph';
import type { ParagraphSize, ParagraphAlignment, ParagraphToolbar } from './Paragraph';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import paragraphScss from './Paragraph.scss?raw';

ComponentRegistry.register({
  id: 'paragraph',
  name: 'Paragraph',
  category: 'Content',
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
    Toolbar: {
      options: ['Inline', 'Tooltip'],
      default: 'Inline',
    },
  },

  properties: [
    { name: 'Text', type: 'text', default: '' },
    { name: 'Placeholder', type: 'text', default: 'Enter your text' },
  ],

  states: [
    { name: 'Selected', default: false },
  ],

  scss: paragraphScss,

  colorTokens: [
    { token: 'Text', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Placeholder', variable: '--fg-disabled', value: '#979DC6', description: '--fg-disabled → neutral-300' },
    { token: 'Background (selected)', variable: '--bg-fill', value: '#FFFFFF', description: '--bg-fill → neutral-0' },
    { token: 'Toolbar Icon', variable: '--fg-secondary', value: '#353C6A', description: '--fg-secondary → neutral-600' },
    { token: 'Toolbar Hover', variable: '--bg-fill-hover', value: '#F3F3FE', description: '--bg-fill-hover → neutral-50' },
    { token: 'Divider', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
    { token: 'Selected Outline', variable: '--border-info', value: '#00A3E9', description: '--border-info' },
  ],

  usage: `import { Paragraph } from '@/components/Paragraph';

// Default paragraph (click to edit)
<Paragraph />

// With default text
<Paragraph defaultValue="Jotform App builds complete, cross-platform mobile apps using AI." />

// Large size, centered
<Paragraph size="Large" alignment="Center" />

// Controlled selected state
<Paragraph selected={true} />`,

  propDocs: [
    {
      name: 'size',
      type: '"Large" | "Medium" | "Small"',
      default: '"Medium"',
      description: 'Typography scale. Large uses text-lg (18px), Medium uses text-md (16px), Small uses text-sm (14px).',
    },
    {
      name: 'alignment',
      type: '"Left" | "Center" | "Right"',
      default: '"Left"',
      description: 'Text alignment. Can be cycled via the alignment button in the toolbar.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: '"Enter your text"',
      description: 'Placeholder text shown when the editor is empty.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      default: '""',
      description: 'Initial text content for the editor.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'undefined',
      description: 'Controlled selected state. When selected, shows the formatting toolbar and enables editing.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, states: StateValues) {
    return (
      <Paragraph
        size={variants['Size'] as ParagraphSize}
        alignment={variants['Alignment'] as ParagraphAlignment}
        toolbar={variants['Toolbar'] as ParagraphToolbar}
        placeholder={props['Placeholder'] as string}
        defaultValue={props['Text'] as string}
        selected={states['Selected'] ? true : undefined}
      />
    );
  },
});
