import type React from 'react';
import { Icon } from '../Icon/Icon';
import './AppHeader.scss';

export type AppHeaderLayout = 'Left' | 'Center' | 'Right';

export interface AppHeaderProps {
  layout?: AppHeaderLayout;
  icon?: string;
  title?: string;
  subtitle?: string;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  layout = 'Center',
  icon = 'Leaf',
  title = 'Urban Jungle',
  subtitle = "Istanbul's Rare Plant Haven",
  skeleton = false,
  skeletonAnimation = 'pulse',
}) => {
  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  if (skeleton) {
    return (
      <div className={`jf-app-header jf-app-header--${layout.toLowerCase()} jf-app-header--skeleton`}>
        <div className="jf-app-header__inner">
          <div className={`jf-app-header__icon-skeleton ${animClass}`} />
          <div className="jf-app-header__text">
            <div className={`jf-app-header__title-skeleton ${animClass}`} style={{ width: 160 }} />
            <div className={`jf-app-header__subtitle-skeleton ${animClass}`} style={{ width: 200 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`jf-app-header jf-app-header--${layout.toLowerCase()}`}>
      <div className="jf-app-header__inner">
        <div className="jf-app-header__icon">
          <Icon name={icon} size={48} />
        </div>
        <div className="jf-app-header__text">
          <h1 className="jf-app-header__title">{title}</h1>
          <p className={`jf-app-header__subtitle ${!subtitle ? 'jf-app-header__subtitle--empty' : ''}`}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
