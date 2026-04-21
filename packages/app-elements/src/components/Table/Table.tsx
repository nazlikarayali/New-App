import type { FC } from 'react';
import { Icon } from '../Icon/Icon';
import './Table.scss';

export type TableAlignment = 'Left' | 'Center' | 'Right';
export type TableSize = 'Normal' | 'Large';

export interface TableProps {
  alignment?: TableAlignment;
  size?: TableSize;
  label?: string;
  description?: string;
  showIcon?: boolean;
  required?: boolean;
  selected?: boolean;
  shrinked?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
}

export const Table: FC<TableProps> = ({
  alignment = 'Left',
  size = 'Normal',
  label = 'Table',
  description = 'Type a description',
  showIcon = true,
  required = true,
  selected = false,
  shrinked = false,
  skeleton = false,
  skeletonAnimation = 'pulse',
}) => {
  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';
  const isCenter = alignment === 'Center';
  const isNormal = size === 'Normal';

  const iconSize = isNormal ? 60 : 100;
  const iconInner = isNormal ? 32 : 52;

  if (skeleton) {
    const rootClasses = [
      'jf-table',
      isCenter ? 'jf-table--center' : 'jf-table--horizontal',
      alignment === 'Right' && 'jf-table--right',
      shrinked && 'jf-table--shrinked',
    ].filter(Boolean).join(' ');

    return (
      <div className={rootClasses}>
        {showIcon && (
          <div className={`jf-table__icon jf-skeleton__bone ${animClass}`} style={{ width: iconSize, height: iconSize }} />
        )}
        <div className="jf-table__content">
          <div className={`jf-skeleton__line jf-skeleton__line--lg ${animClass}`} style={{ width: '60%' }} />
          <div className={`jf-skeleton__line jf-skeleton__line--sm ${animClass}`} style={{ width: '80%' }} />
        </div>
      </div>
    );
  }

  const rootClasses = [
    'jf-table',
    isCenter ? 'jf-table--center' : 'jf-table--horizontal',
    alignment === 'Right' && 'jf-table--right',
    selected && 'jf-table--selected',
    shrinked && 'jf-table--shrinked',
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      {showIcon && (
        <div className="jf-table__icon" style={{ width: iconSize, height: iconSize }}>
          <Icon name="Table2" size={iconInner} />
        </div>
      )}
      <div className="jf-table__content">
        <div className={`jf-table__title jf-table__title--${isNormal ? 'normal' : 'large'}`}>
          {label}
        </div>
        <div className={`jf-table__desc jf-table__desc--${isNormal ? 'normal' : 'large'}`}>
          {description}
        </div>
      </div>
      {required && (
        <div className="jf-table__badge">
          <Icon name="Asterisk" size={20} />
        </div>
      )}
    </div>
  );
};

export default Table;
