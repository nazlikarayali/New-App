import { ComponentRegistry } from '../../types/registry';
import { DailyTaskManager } from './DailyTaskManager';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './DailyTaskManager.scss?raw';

ComponentRegistry.register({
  id: 'daily-task-manager',
  name: 'Task Manager',
  category: 'Widgets',
  icon: 'SquareCheckBig',

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
    { token: 'Count', variable: '--fg-disabled', value: '#979DC6', description: '--fg-disabled → neutral-300' },
    { token: 'Progress Track', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600 (15% mix)' },
    { token: 'Progress Fill', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600' },
    { token: 'Checkbox Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
    { token: 'Checkbox Active', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600' },
    { token: 'Task Text', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Completed Text', variable: '--fg-disabled', value: '#979DC6', description: '--fg-disabled → neutral-300' },
    { token: 'Input Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
    { token: 'Add Button', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600' },
  ],

  usage: `import { DailyTaskManager } from '@/components/DailyTaskManager';

// Default with preset tasks
<DailyTaskManager />

// With custom tasks
<DailyTaskManager tasks={[
  { id: '1', text: 'Buy groceries', completed: false },
  { id: '2', text: 'Clean house', completed: true },
]} />

// Selected state
<DailyTaskManager selected />`,

  propDocs: [
    {
      name: 'tasks',
      type: 'TaskItem[]',
      default: '5 preset tasks',
      description: 'Array of task objects with id, text, and completed status. If not provided, shows default tasks.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description: 'When true, shows a blue selection outline around the widget.',
    },
  ],

  render(_variants: VariantValues, props: PropertyValues, _states: StateValues) {
    return (
      <DailyTaskManager
        selected={props['Selected'] as boolean}
        skeleton={props['Skeleton'] as boolean}
      />
    );
  },
});
