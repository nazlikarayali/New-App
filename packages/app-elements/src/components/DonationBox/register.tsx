import { ComponentRegistry } from '../../types/registry';
import { DonationBox } from './DonationBox';
import type { DonationHeadingAlignment, DonationSize } from './DonationBox';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import donationScss from './DonationBox.scss?raw';

ComponentRegistry.register({
  id: 'donation-box',
  name: 'Donation Box',
  category: 'Data Display',
  icon: 'Heart',

  variants: {
    'Heading Alignment': {
      options: ['Left', 'Center', 'Right'],
      default: 'Left',
    },
    Size: {
      options: ['Web', 'Mobile'],
      default: 'Web',
    },
  },

  properties: [
    { name: 'Title', type: 'text', default: 'Support us!' },
    { name: 'Description', type: 'text', default: 'Your donation will help us change the lives of those in need.' },
    { name: 'Show Goal', type: 'boolean', default: true },
    { name: 'Raised Amount', type: 'text', default: '$2,150' },
    { name: 'Goal Amount', type: 'text', default: '$5,000' },
    { name: 'Goal Progress', type: 'number', default: 43 },
    { name: 'Show Custom Amount', type: 'boolean', default: true },
    { name: 'Currency Symbol', type: 'text', default: '$' },
    { name: 'Button Label', type: 'text', default: 'Donate Now' },
    { name: 'Selected', type: 'boolean', default: false },
  ],

  states: [],

  scss: donationScss,

  colorTokens: [
    { token: 'Title', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Description', variable: '--fg-disabled', value: '#979DC6', description: '--fg-disabled → neutral-300' },
    { token: 'Goal Labels', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Progress Track', variable: '--bg-page', value: '#F3F3FE', description: '--bg-page → neutral-50' },
    { token: 'Progress Fill', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600' },
    { token: 'Amount Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
    { token: 'Add Amount BG', variable: '--bg-surface-info', value: '#DDF3FF', description: '--bg-surface-info → sky-100' },
    { token: 'Add Amount Text', variable: '--fg-info', value: '#0385C8', description: '--fg-info → sky-600' },
    { token: 'Button BG', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600' },
  ],

  usage: `import { DonationBox } from '@/components/DonationBox';

// Basic donation box with left-aligned heading
<DonationBox
  headingAlignment="Left"
  title="Support us!"
  description="Your donation will help us change the lives of those in need."
/>

// Center-aligned with custom amounts
<DonationBox
  headingAlignment="Center"
  title="Help Build a School"
  description="Every dollar counts toward education."
  amounts={["$25.00", "$50.00", "$100.00"]}
  goalProgress={65}
  raisedAmount="$6,500"
  goalAmount="$10,000"
/>

// Mobile size without goal progress
<DonationBox
  size="Mobile"
  title="Emergency Relief Fund"
  description="Urgent help needed."
  showGoal={false}
  buttonLabel="Contribute Now"
/>

// Right-aligned without custom amount input
<DonationBox
  headingAlignment="Right"
  showCustomAmount={false}
  amounts={["$10.00", "$20.00", "$50.00", "$100.00"]}
/>`,

  propDocs: [
    {
      name: 'headingAlignment',
      type: '"Left" | "Center" | "Right"',
      default: '"Left"',
      description:
        'Controls the text alignment of the title and description. **Left** aligns to the start, **Center** centers the text, **Right** aligns to the end.',
    },
    {
      name: 'size',
      type: '"Web" | "Mobile"',
      default: '"Web"',
      description:
        'Sets the layout width. **Web** renders at 616px with horizontal amount buttons. **Mobile** renders at 408px with vertically stacked amount buttons.',
    },
    {
      name: 'title',
      type: 'string',
      default: '"Support us!"',
      description:
        'The main heading of the donation box. Rendered with `Heading/H5/Bold` typography (24px, semibold, -0.48px letter-spacing).',
    },
    {
      name: 'description',
      type: 'string',
      default: '"Your donation will help us..."',
      description:
        'Subheading text below the title. Rendered with `Paragraph/Small/Medium` typography (14px, medium, `fg-disabled`).',
    },
    {
      name: 'showGoal',
      type: 'boolean',
      default: 'true',
      description:
        'When `true`, shows the donation goal section with raised/goal labels and a progress bar.',
    },
    {
      name: 'raisedAmount',
      type: 'string',
      default: '"$2,150"',
      description:
        'The amount raised so far, displayed on the left side of the goal labels.',
    },
    {
      name: 'goalAmount',
      type: 'string',
      default: '"$5,000"',
      description:
        'The target goal amount, displayed on the right side of the goal labels.',
    },
    {
      name: 'goalProgress',
      type: 'number',
      default: '43',
      description:
        'The percentage (0–100) of the progress bar fill. Mapped to `bg-fill-brand` color.',
    },
    {
      name: 'amounts',
      type: 'string[]',
      default: '["$10.00", "$25.00", "$50.00"]',
      description:
        'Array of preset donation amounts. Each renders as a selectable button with `border-active` border and `Paragraph/Large/Bold` typography (18px, semibold).',
    },
    {
      name: 'showCustomAmount',
      type: 'boolean',
      default: 'true',
      description:
        'When `true`, shows the custom amount input field below the preset amounts.',
    },
    {
      name: 'currencySymbol',
      type: 'string',
      default: '"$"',
      description:
        'Currency symbol shown in the custom amount field.',
    },
    {
      name: 'buttonLabel',
      type: 'string',
      default: '"Donate Now"',
      description:
        'Text on the primary action button. Rendered with `Label/Medium/Bold` (14px, semibold) on `fg-brand` background.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, applies a 2px `border-info` (#00A3E9) border around the entire donation box.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, _states: StateValues): React.ReactNode {
    return (
      <DonationBox
        headingAlignment={variants['Heading Alignment'] as DonationHeadingAlignment}
        size={variants['Size'] as DonationSize}
        title={props['Title'] as string}
        description={props['Description'] as string}
        showGoal={props['Show Goal'] as boolean}
        raisedAmount={props['Raised Amount'] as string}
        goalAmount={props['Goal Amount'] as string}
        goalProgress={props['Goal Progress'] as number}
        showCustomAmount={props['Show Custom Amount'] as boolean}
        currencySymbol={props['Currency Symbol'] as string}
        buttonLabel={props['Button Label'] as string}
        selected={props['Selected'] as boolean}
      />
    );
  },
});
