import { ComponentRegistry } from '../../types/registry';
import { CamperCard } from './CamperCard';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './CamperCard.scss?raw';

ComponentRegistry.register({
  id: 'camper-card',
  name: 'Camper Card',
  category: 'Widgets',
  icon: 'UserCheck',

  variants: {},

  properties: [
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Skeleton', type: 'boolean', default: false },
    { name: 'Name', type: 'string', default: 'Emma Johnson' },
    { name: 'Meta', type: 'string', default: 'Age 10 · Cabin Firefly' },
  ],

  states: [],

  scss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: '--bg-fill → neutral-0' },
    { token: 'Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
    { token: 'Name', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Meta', variable: '--fg-secondary', value: '#353C6A', description: '--fg-secondary → neutral-600' },
    { token: 'Progress Fill', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600' },
    { token: 'Completed', variable: '--bg-fill-success', value: '#19A44B', description: '--bg-fill-success' },
    { token: 'Pending', variable: '--bg-fill-warning', value: '#E8AB19', description: '--bg-fill-warning' },
    { token: 'Open Button', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600' },
    { token: 'Row Surface', variable: '--bg-surface', value: '#F7F8FD', description: '--bg-surface → neutral-50' },
  ],

  usage: `import { CamperCard } from '@/components/CamperCard';

<CamperCard
  name="Emma Johnson"
  meta="Age 10 · Cabin Firefly"
  completionPercent={80}
  completedCount={4}
  totalCount={5}
/>`,

  propDocs: [
    { name: 'name', type: 'string', default: '"Emma Johnson"', description: 'Camper name shown in the header.' },
    { name: 'meta', type: 'string', default: '"Age 10 · Cabin Firefly"', description: 'Secondary line beneath the name.' },
    { name: 'completionPercent', type: 'number', default: '80', description: 'Overall completion percentage (0–100).' },
    { name: 'forms', type: 'CamperForm[]', default: 'registration preset', description: 'List of forms with completion status.' },
    { name: 'selected', type: 'boolean', default: 'false', description: 'When true, shows a selection outline.' },
  ],

  render(_variants: VariantValues, props: PropertyValues, _states: StateValues) {
    return (
      <CamperCard
        name={props['Name'] as string}
        meta={props['Meta'] as string}
        selected={props['Selected'] as boolean}
      />
    );
  },
});
