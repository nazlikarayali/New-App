import { ComponentRegistry } from '../../types/registry';
import { LoginSignup } from './LoginSignup';
import type { LoginSignupMode, LoginSignupLayout } from './LoginSignup';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import loginSignupScss from './LoginSignup.scss?raw';

ComponentRegistry.register({
  id: 'login-signup',
  name: 'Login',
  category: 'Data Display',
  icon: 'LogIn',

  variants: {
    Mode: {
      options: ['Login', 'Signup'],
      default: 'Login',
    },
    Layout: {
      options: ['Left', 'Center'],
      default: 'Left',
    },
  },

  properties: [
    { name: 'Title', type: 'text', default: '' },
    { name: 'Subtitle', type: 'text', default: '' },
    { name: 'Button Label', type: 'text', default: '' },
    { name: 'Input Icons', type: 'boolean', default: true },
  ],

  states: [
    { name: 'Skeleton', default: false },
  ],

  scss: loginSignupScss,

  colorTokens: [
    // Surface & borders
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: '--bg-fill → neutral-0' },
    { token: 'Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
    { token: 'Hover Shadow', variable: '--shadow-lg', value: 'elevation-lg', description: '--shadow-lg → card elevation on hover' },
    // Header text
    { token: 'Title', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Subtitle', variable: '--fg-secondary', value: '#555E93', description: '--fg-secondary → neutral-500' },
    // Input
    { token: 'Input BG', variable: '--bg-surface', value: '#F8F8FF', description: '--bg-surface → neutral-25' },
    { token: 'Input Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
    { token: 'Input Focus', variable: '--bg-fill-brand', value: '#7D38EF', description: '--bg-fill-brand → primary-600' },
    { token: 'Placeholder', variable: '--fg-disabled', value: '#979DC6', description: '--fg-disabled → neutral-300' },
    // Labels
    { token: 'Label', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Forgot Link', variable: '--fg-brand', value: '#7D38EF', description: '--fg-brand → primary-600' },
    // Footer
    { token: 'Footer Text', variable: '--fg-secondary', value: '#555E93', description: '--fg-secondary → neutral-500' },
    { token: 'Footer Link', variable: '--fg-brand', value: '#7D38EF', description: '--fg-brand → primary-600' },
  ],

  usage: `import { LoginSignup } from '@/components/LoginSignup';

// Default login form
<LoginSignup mode="Login" />

// Signup form
<LoginSignup mode="Signup" />

// Center aligned header
<LoginSignup mode="Login" layout="Center" />

// Custom labels
<LoginSignup
  mode="Signup"
  title="Get Started"
  subtitle="Create your free account"
  buttonLabel="Register"
/>

// Skeleton loading
<LoginSignup skeleton />`,

  propDocs: [
    {
      name: 'mode',
      type: '"Login" | "Signup"',
      default: '"Login"',
      description:
        'Controls the form mode. **Login** shows email and password fields with a "Forgot password?" link. **Signup** adds first/last name fields and a confirm password field.',
    },
    {
      name: 'layout',
      type: '"Left" | "Center"',
      default: '"Left"',
      description:
        'Controls the header alignment. **Left** aligns title and subtitle to the left. **Center** centers the header text.',
    },
    {
      name: 'title',
      type: 'string',
      default: '"Welcome back" (Login) / "Create account" (Signup)',
      description:
        'The main heading text. Defaults are mode-aware: "Welcome back" for Login, "Create account" for Signup.',
    },
    {
      name: 'subtitle',
      type: 'string',
      default: '"Sign in to your account" (Login) / "Sign up to get started" (Signup)',
      description:
        'The subtitle text below the heading. Defaults are mode-aware.',
    },
    {
      name: 'buttonLabel',
      type: 'string',
      default: '"Sign In" (Login) / "Create Account" (Signup)',
      description:
        'The label for the primary submit button. Defaults are mode-aware.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, renders a 2px info-colored outline around the component (used in the app builder for selection state).',
    },
    {
      name: 'skeleton',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, renders a loading skeleton placeholder instead of the form content.',
    },
    {
      name: 'skeletonAnimation',
      type: '"pulse" | "shimmer"',
      default: '"pulse"',
      description:
        'Controls the skeleton loading animation style. **pulse** uses a fading effect, **shimmer** uses a horizontal sweep.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, states: StateValues): React.ReactNode {
    return (
      <LoginSignup
        mode={variants['Mode'] as LoginSignupMode}
        layout={variants['Layout'] as LoginSignupLayout}
        title={props['Title'] as string}
        subtitle={props['Subtitle'] as string}
        buttonLabel={props['Button Label'] as string}
        showInputIcons={props['Input Icons'] as boolean}
        skeleton={states['Skeleton']}
      />
    );
  },
});
