import { ComponentRegistry } from '../../types/registry';
import { Document } from './Document';
import type { DocumentAlignment, DocumentSize } from './Document';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import documentScss from './Document.scss?raw';

ComponentRegistry.register({
  id: 'document',
  name: 'Document',
  category: 'Data Display',
  icon: 'FileText',

  variants: {
    'Has File': {
      options: ['Yes', 'No'],
      default: 'Yes',
    },
    Alignment: {
      options: ['Left', 'Center', 'Right'],
      default: 'Left',
      showWhen: { 'Has File': 'Yes' },
    },
    Size: {
      options: ['Normal', 'Large'],
      default: 'Normal',
      showWhen: { 'Has File': 'Yes' },
    },
  },

  properties: [
    { name: 'File Name', type: 'text', default: 'File Name', showWhen: { 'Has File': 'Yes' } },
    { name: 'Description', type: 'text', default: 'Add Description', showWhen: { 'Has File': 'Yes' } },
    { name: 'Show Icon', type: 'boolean', default: true, showWhen: { 'Has File': 'Yes' } },
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Shrinked', type: 'boolean', default: false },
    { name: 'Skeleton', type: 'boolean', default: false },
  ],

  states: [],

  scss: documentScss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: '--bg-fill → neutral-0' },
    { token: 'Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100', variants: { 'Has File': 'Yes' } },
    { token: 'Icon BG', variable: '--bg-surface-brand', value: '#EDE8FE', description: '--bg-surface-brand → primary-100', variants: { 'Has File': 'Yes' } },
    { token: 'Icon Color', variable: '--fg-brand', value: '#7D38EF', description: '--fg-brand → primary-600', variants: { 'Has File': 'Yes' } },
    { token: 'Title', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900', variants: { 'Has File': 'Yes' } },
    { token: 'Description', variable: '--fg-secondary', value: '#353C6A', description: '--fg-secondary → neutral-600', variants: { 'Has File': 'Yes' } },
    { token: 'Builder Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100', variants: { 'Has File': 'No' } },
    { token: 'Builder Icon', variable: '--fg-tertiary', value: '#6C73A8', description: '--fg-tertiary → neutral-400', variants: { 'Has File': 'No' } },
    { token: 'Builder Hint', variable: '--fg-secondary', value: '#353C6A', description: '--fg-secondary → neutral-600', variants: { 'Has File': 'No' } },
  ],

  usage: `import { Document } from '@/components/Document';

// Left-aligned document, normal size
<Document
  alignment="Left"
  size="Normal"
  fileName="annual-report.pdf"
  description="2.4 MB - PDF Document"
/>

// Center-aligned, large size
<Document
  alignment="Center"
  size="Large"
  fileName="presentation.pptx"
  description="12.1 MB - PowerPoint"
/>

// Right-aligned
<Document
  alignment="Right"
  size="Normal"
  fileName="invoice.pdf"
  description="340 KB"
/>

// Builder state (no file uploaded)
<Document hasFile={false} />

// Without icon
<Document
  fileName="data.csv"
  description="Export file"
  showIcon={false}
/>`,

  propDocs: [
    {
      name: 'alignment',
      type: '"Left" | "Center" | "Right"',
      default: '"Left"',
      description:
        'Controls the layout direction. **Left** and **Right** render horizontally with icon beside text. **Center** stacks icon above text vertically.',
    },
    {
      name: 'size',
      type: '"Normal" | "Large"',
      default: '"Normal"',
      description:
        'Controls the icon and typography size. **Normal** uses 60px icon, `Label/Medium/Bold` (14px) title, `Label/Small/Regular` (12px) description. **Large** uses 100px icon, `Label/Large/Bold` (16px) title, `Label/Medium/Regular` (14px) description.',
    },
    {
      name: 'fileName',
      type: 'string',
      default: '"File Name"',
      description:
        'The document file name displayed as the primary text.',
    },
    {
      name: 'description',
      type: 'string',
      default: '"Add Description"',
      description:
        'Secondary text below the file name (e.g. file size, type).',
    },
    {
      name: 'showIcon',
      type: 'boolean',
      default: 'true',
      description:
        'When `true`, shows the document icon with `bg-surface-brand` background.',
    },
    {
      name: 'hasFile',
      type: 'boolean',
      default: 'true',
      description:
        'When `false`, renders the builder/upload state with a dashed border, document icon, "Upload File" button, and drag-and-drop hint.',
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
    const hasFile = variants['Has File'] === 'Yes';

    return (
      <Document
        hasFile={hasFile}
        alignment={hasFile ? variants['Alignment'] as DocumentAlignment : undefined}
        size={hasFile ? variants['Size'] as DocumentSize : undefined}
        fileName={props['File Name'] as string}
        description={props['Description'] as string}
        showIcon={props['Show Icon'] as boolean}
        selected={props['Selected'] as boolean}
        shrinked={props['Shrinked'] as boolean}
        skeleton={props['Skeleton'] as boolean}
      />
    );
  },
});
