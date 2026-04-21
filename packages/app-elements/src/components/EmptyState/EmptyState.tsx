import type { FC } from 'react';
import { Icon } from '../Icon/Icon';
import './EmptyState.scss';

export type EmptyStateVariant = 'Default' | 'Loading';

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  message?: string;
  mobileMessage?: string;
  mobile?: boolean;
}

export const EmptyState: FC<EmptyStateProps> = ({
  variant = 'Default',
  message = 'Drag your first element here from left.',
  mobileMessage = 'Tap to select your first element.',
  mobile = false,
}) => {
  const isLoading = variant === 'Loading';

  return (
    <div className="jf-empty-state">
      {isLoading ? (
        <div className="jf-empty-state__spinner" />
      ) : (
        <Icon name={mobile ? 'Pointer' : 'Move'} size={24} />
      )}
      <span className={`jf-empty-state__message${isLoading ? ' jf-empty-state__message--shimmer' : ''}`}>
        {isLoading ? 'Podo is building... Hang tight!' : (mobile ? mobileMessage : message)}
      </span>
    </div>
  );
};

export default EmptyState;
