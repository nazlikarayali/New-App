import { ComponentRegistry } from '../../types/registry';
import { ProgressIndicator } from './ProgressIndicator';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './ProgressIndicator.scss?raw';

ComponentRegistry.register({
  id: 'progress-indicator',
  name: 'Progress',
  category: 'Widgets',
  icon: 'ListChecks',

  variants: {},

  properties: [
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Skeleton', type: 'boolean', default: false },
  ],

  states: [],

  scss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: '--bg-fill → neutral-0' },
    { token: 'Title', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Subtitle', variable: '--fg-secondary', value: '#353C6A', description: '--fg-secondary → neutral-600' },
    { token: 'Segment Track', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600 (15% mix)' },
    { token: 'Segment Filled', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600' },
    { token: 'Step Icon', variable: '--bg-surface-brand', value: '#EDE8FE', description: '--bg-surface-brand → primary-100' },
    { token: 'Step Icon Active', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600' },
    { token: 'Step Label', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Checkmark', variable: '--bg-fill-success', value: '#19A44B', description: '--bg-fill-success' },
    { token: 'Chevron', variable: '--fg-tertiary', value: '#6C73A8', description: '--fg-tertiary → neutral-400' },
    { token: 'Item Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
  ],

  usage: `import { ProgressIndicator } from '@/components/ProgressIndicator';

// Default with 3 steps
<ProgressIndicator />

// Custom title and steps
<ProgressIndicator
  title="Get set up for success"
  subtitle="Complete these steps to get started."
  steps={[
    { id: '1', label: 'Personal Information', completed: true },
    { id: '2', label: 'Upload Documents', completed: false },
    { id: '3', label: 'Review & Submit', completed: false },
  ]}
/>

// Selected state
<ProgressIndicator selected />`,

  propDocs: [
    {
      name: 'title',
      type: 'string',
      default: '"Complete Your Profile"',
      description: 'Heading text shown above the progress bar.',
    },
    {
      name: 'subtitle',
      type: 'string',
      default: '"Fill out the forms below..."',
      description: 'Description text below the title.',
    },
    {
      name: 'steps',
      type: 'ProgressStep[]',
      default: '3 preset steps',
      description: 'Array of step objects with id, label, and completed status.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description: 'When true, shows a selection outline around the widget.',
    },
  ],

  render(_variants: VariantValues, props: PropertyValues, _states: StateValues) {
    return (
      <ProgressIndicator
        selected={props['Selected'] as boolean}
        skeleton={props['Skeleton'] as boolean}
      />
    );
  },
});
