export interface VariantGroup {
  options: string[];
  default: string;
  showWhen?: Record<string, string | boolean>;
}

export interface ComponentProperty {
  name: string;
  type: 'text' | 'select' | 'boolean' | 'color' | 'number' | 'icon';
  default: string | boolean | number;
  options?: string[];
  showWhen?: Record<string, string | boolean>;
  min?: number;
  max?: number;
  step?: number;
}

export interface ComponentState {
  name: string;
  default: boolean;
}

export interface PropDoc {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface ColorToken {
  token: string;
  variable: string;
  value: string;
  description: string;
  variants?: Record<string, string>;
}

export interface ComponentDefinition {
  id: string;
  name: string;
  category: string;
  icon: string;
  variants: Record<string, VariantGroup>;
  properties: ComponentProperty[];
  states: ComponentState[];
  scss: string;
  usage: string;
  propDocs: PropDoc[];
  colorTokens?: ColorToken[];
}

export type VariantValues = Record<string, string>;
export type PropertyValues = Record<string, string | boolean | number>;
export type StateValues = Record<string, boolean>;
