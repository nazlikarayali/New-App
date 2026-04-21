import { ComponentRegistry } from '../../types/registry';
import { Table } from './Table';
import type { TableAlignment, TableSize } from './Table';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import tableScss from './Table.scss?raw';

ComponentRegistry.register({
  id: 'table',
  name: 'Table',
  category: 'Data Display',
  icon: 'Table2',

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
    { name: 'Label', type: 'text', default: 'Table' },
    { name: 'Description', type: 'text', default: 'Type a description' },
    { name: 'Show Icon', type: 'boolean', default: true },
    { name: 'Required', type: 'boolean', default: true },
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Shrinked', type: 'boolean', default: false },
    { name: 'Skeleton', type: 'boolean', default: false },
  ],

  states: [],

  scss: tableScss,

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

  usage: `import { Table } from '@/components/Table';

// Default table with required badge
<Table
  label="Table"
  description="View and manage data entries"
  required={true}
/>

// Large size, centered
<Table
  alignment="Center"
  size="Large"
  label="Submissions"
  description="Review all form submissions"
/>

// Without required badge
<Table
  label="Products"
  description="Product inventory list"
  required={false}
/>`,

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
      default: '"Table"',
      description: 'The table name displayed as the primary text.',
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
        'When `true`, shows a red circular badge with an asterisk icon indicating the table is required.',
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
      <Table
        alignment={variants['Alignment'] as TableAlignment}
        size={variants['Size'] as TableSize}
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
