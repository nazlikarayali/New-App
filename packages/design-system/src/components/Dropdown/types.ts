import type { ReactNode } from 'react';

export type DropdownSize = 'sm' | 'md' | 'lg';
export type DropdownStatus = 'default' | 'error' | 'readonly';

export interface DropdownOption {
  value: string;
  label: string;
  leading?: ReactNode;
}

export interface DropdownBaseProps {
  size?: DropdownSize;
  status?: DropdownStatus;
  disabled?: boolean;
  placeholder?: string;
  title?: string;
  description?: string;
  required?: boolean;
  helperText?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  showHelpText?: boolean;
  className?: string;
}
