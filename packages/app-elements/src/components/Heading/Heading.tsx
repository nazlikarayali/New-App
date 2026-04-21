import type React from 'react';
import './Heading.scss';

export type HeadingSize = 'Large' | 'Medium' | 'Small';
export type HeadingAlignment = 'Left' | 'Center' | 'Right';

export interface HeadingProps {
  size?: HeadingSize;
  alignment?: HeadingAlignment;
  heading?: string;
  subheading?: string;
  selected?: boolean;
  shrinked?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
}

export const Heading: React.FC<HeadingProps> = ({
  size = 'Large',
  alignment = 'Left',
  heading = 'Heading',
  subheading = '',
  selected = false,
  shrinked = false,
  skeleton = false,
  skeletonAnimation = 'pulse',
}) => {
  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  if (skeleton) {
    const rootClasses = [
      'jf-heading',
      `jf-heading--${alignment.toLowerCase()}`,
      shrinked && 'jf-heading--shrinked',
    ].filter(Boolean).join(' ');

    return (
      <div className={rootClasses}>
        <div className={`jf-skeleton__line jf-skeleton__line--lg ${animClass}`} style={{ width: '50%' }} />
        <div className={`jf-skeleton__line jf-skeleton__line--sm ${animClass}`} style={{ width: '70%' }} />
      </div>
    );
  }

  const rootClasses = [
    'jf-heading',
    `jf-heading--${alignment.toLowerCase()}`,
    selected && 'jf-heading--selected',
    shrinked && 'jf-heading--shrinked',
  ].filter(Boolean).join(' ');

  const Tag = size === 'Large' ? 'h2' : size === 'Medium' ? 'h3' : 'h4';

  return (
    <div className={rootClasses}>
      <Tag className={`jf-heading__title jf-heading__title--${size.toLowerCase()}`}>
        {heading}
      </Tag>
      <p className={`jf-heading__subtitle ${!subheading ? 'jf-heading__subtitle--empty' : ''}`}>{subheading}</p>
    </div>
  );
};

export default Heading;
