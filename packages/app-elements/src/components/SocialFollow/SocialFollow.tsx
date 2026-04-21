import type { FC } from 'react';
import { Button } from '../Button';
import './SocialFollow.scss';

export type SocialLayout = 'Horizontal' | 'Wrap';

export interface SocialPlatform {
  icon: string;
  label: string;
}

export interface SocialFollowProps {
  layout?: SocialLayout;
  filled?: boolean;
  platforms?: SocialPlatform[];
  selected?: boolean;
  shrinked?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
}

const DEFAULT_PLATFORMS: SocialPlatform[] = [
  { icon: 'Youtube', label: 'YouTube' },
  { icon: 'Twitter', label: 'X' },
  { icon: 'Linkedin', label: 'LinkedIn' },
  { icon: 'Instagram', label: 'Instagram' },
];

export const SocialFollow: FC<SocialFollowProps> = ({
  layout = 'Horizontal',
  filled = true,
  platforms = DEFAULT_PLATFORMS,
  selected = false,
  shrinked = false,
  skeleton = false,
  skeletonAnimation = 'pulse',
}) => {
  const rootClasses = [
    'jf-social',
    layout === 'Wrap' ? 'jf-social--wrap' : 'jf-social--horizontal',
    selected && 'jf-social--selected',
    shrinked && 'jf-social--shrinked',
  ].filter(Boolean).join(' ');

  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  if (skeleton) {
    return (
      <div className={rootClasses}>
        {platforms.map((_, i) => (
          <div
            key={i}
            className={`jf-skeleton__bone ${animClass}`}
            style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={rootClasses}>
      {platforms.map((platform, i) => (
        <Button
          key={i}
          iconOnly
          iconOnlyIcon={platform.icon}
          iconOnlyFilled={filled}
          corner="Rounded"
        />
      ))}
    </div>
  );
};

export default SocialFollow;
