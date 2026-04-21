import { Fragment, type FC } from 'react';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button';
import { Card } from '../Card';
import type { CardImageStyle, CardLayout, CardAction } from '../Card';
import './List.scss';

export type ListImageStyle = 'Square' | 'Circle' | 'None';
export type ListSize = 'Regular' | 'Compact';
export type ListLayout = 'Basic' | 'Card';
export type ListAction = 'None' | 'Icon' | 'Button';

export interface ListItemData {
  title: string;
  description: string;
}

export type CardSize = 'Small' | 'Medium' | 'Large';

export interface ListProps {
  layout?: ListLayout;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  // Basic layout props
  imageStyle?: ListImageStyle;
  size?: ListSize;
  action?: ListAction;
  actionIconFilled?: boolean;
  buttonLabel?: string;
  // Card layout props
  cardImageStyle?: CardImageStyle;
  cardLayout?: CardLayout;
  cardAction?: CardAction;
  cardActionIconFilled?: boolean;
  cardButtonLabel?: string;
  cardSize?: CardSize;
  // Common
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
  selected?: boolean;
  items?: ListItemData[];
}

// ============================================
// Image Placeholder
// ============================================
const ImagePlaceholder: FC<{ size: number }> = ({ size: s }) => (
  <Icon name="Image" size={s} />
);

// ============================================
// Action element (matches Card component style)
// ============================================
const ListActionEl: FC<{ action: ListAction; actionIconFilled: boolean; buttonLabel: string }> = ({ action, actionIconFilled, buttonLabel }) => {
  if (action === 'None') return null;
  if (action === 'Icon') {
    return (
      <Button
        iconOnly
        iconOnlyIcon="ChevronRight"
        iconOnlyFilled={actionIconFilled}
        corner="Default"
      />
    );
  }
  return (
    <button className="jf-card__action-button">
      {buttonLabel}
    </button>
  );
};

// ============================================
// Basic List Item
// ============================================
const BasicListItem: FC<{
  item: ListItemData;
  imageStyle: ListImageStyle;
  size: ListSize;
  action: ListAction;
  actionIconFilled: boolean;
  buttonLabel: string;
}> = ({ item, imageStyle, size, action, actionIconFilled, buttonLabel }) => {
  const isCompact = size === 'Compact';
  const imgSize = isCompact ? 60 : 104;
  const iconSize = isCompact ? 32 : 48;
  const hasImage = imageStyle !== 'None';

  return (
    <div className={`jf-list-item jf-list-item--basic${isCompact ? ' jf-list-item--compact' : ''}`}>
      {hasImage && (
        <div className={`jf-list-item__image jf-list-item__image--${imageStyle.toLowerCase()}`} style={{ width: imgSize, height: imgSize }}>
          <ImagePlaceholder size={iconSize} />
        </div>
      )}
      <div className="jf-list-item__content">
        <div className="jf-list-item__info">
          <div className="jf-list-item__title">{item.title}</div>
          <div className="jf-list-item__desc">{item.description}</div>
        </div>
        <ListActionEl action={action} actionIconFilled={actionIconFilled} buttonLabel={buttonLabel} />
      </div>
    </div>
  );
};

// ============================================
// Skeleton List Item (Basic)
// ============================================
const SkeletonListItem: FC<{ imageStyle: ListImageStyle; size: ListSize; animClass: string }> = ({ imageStyle, size, animClass }) => {
  const isCompact = size === 'Compact';
  const imgSize = isCompact ? 60 : 104;
  const hasImage = imageStyle !== 'None';

  return (
    <div className={`jf-list-item jf-list-item--basic ${animClass}${isCompact ? ' jf-list-item--compact' : ''}`}>
      {hasImage && (
        <div
          className={`jf-list-item__image jf-list-item__image--${imageStyle.toLowerCase()} jf-skeleton__bone`}
          style={{ width: imgSize, height: imgSize }}
        />
      )}
      <div className="jf-list-item__content">
        <div className="jf-list-item__info">
          <div className="jf-skeleton__bone jf-skeleton__bone jf-skeleton__line jf-skeleton__line--lg" />
          <div className="jf-skeleton__bone jf-skeleton__bone jf-skeleton__line jf-skeleton__line--sm" />
        </div>
      </div>
    </div>
  );
};

// ============================================
// Skeleton Card Item
// ============================================
const SkeletonCardItem: FC<{ cardImageStyle: CardImageStyle; cardLayout: CardLayout; animClass: string }> = ({ cardImageStyle, cardLayout, animClass }) => {
  const isVertical = cardLayout === 'Vertical';
  const hasImage = cardImageStyle !== 'None';

  const imageClass = cardImageStyle === 'Circle'
    ? (isVertical ? 'circle-card' : 'circle')
    : cardImageStyle === 'Icon'
    ? (isVertical ? 'icon-card' : 'icon')
    : (isVertical ? 'square-header' : 'square');

  if (isVertical) {
    return (
      <div className={`jf-card jf-card--skeleton jf-card--vertical ${animClass}`} style={{ background: 'var(--bg-surface)' }}>
        {hasImage && <div className={`jf-card__image jf-card__image--${imageClass} jf-skeleton__bone`} />}
        <div className="jf-card__body" style={{ background: 'var(--bg-surface)' }}>
          <div className="jf-card__content">
            <div className="jf-skeleton__bone jf-skeleton__bone jf-skeleton__line jf-skeleton__line--lg" />
            <div className="jf-skeleton__bone jf-skeleton__bone jf-skeleton__line jf-skeleton__line--sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`jf-card jf-card--skeleton jf-card--horizontal ${animClass}`} style={{ background: 'var(--bg-surface)' }}>
      {hasImage && <div className={`jf-card__image jf-card__image--${imageClass} jf-skeleton__bone`} />}
      <div className="jf-card__content">
        <div className="jf-skeleton__bone jf-skeleton__bone jf-skeleton__line jf-skeleton__line--lg" />
        <div className="jf-skeleton__bone jf-skeleton__bone jf-skeleton__line jf-skeleton__line--sm" />
      </div>
    </div>
  );
};

// ============================================
// List Component
// ============================================
const DEFAULT_ITEMS: ListItemData[] = [
  { title: 'Card Title', description: 'Description' },
  { title: 'Card Title', description: 'Description' },
  { title: 'Card Title', description: 'Description' },
  { title: 'Card Title', description: 'Description' },
];

export const List: FC<ListProps> = ({
  layout = 'Basic',
  title = 'List',
  subtitle = '',
  showHeader = true,
  imageStyle = 'Square',
  size = 'Regular',
  action = 'None',
  actionIconFilled = true,
  buttonLabel = 'Edit',
  cardImageStyle = 'Square',
  cardLayout = 'Horizontal',
  cardAction = 'None',
  cardActionIconFilled = true,
  cardButtonLabel = 'Edit',
  cardSize = 'Medium',
  skeleton = false,
  skeletonAnimation = 'pulse',
  selected = false,
  items = DEFAULT_ITEMS,
}) => {
  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  const header = showHeader ? (
    <div className="jf-list__heading">
      <h3 className="jf-list__title">{title}</h3>
      <p className={`jf-list__subtitle ${!subtitle ? 'jf-list__subtitle--empty' : ''}`}>{subtitle}</p>
    </div>
  ) : null;

  if (skeleton && layout === 'Card') {
    const isVertical = cardLayout === 'Vertical';
    const gridClass = isVertical
      ? `jf-list__card-grid--${cardSize.toLowerCase()}`
      : '';

    return (
      <div className={`jf-list jf-list--card${selected ? ' jf-list--selected' : ''}`}>
        {header}
        <div className={`jf-list__card-grid ${gridClass}`}>
          {items.map((_, i) => (
            <SkeletonCardItem key={i} cardImageStyle={cardImageStyle} cardLayout={cardLayout} animClass={animClass} />
          ))}
        </div>
      </div>
    );
  }

  if (skeleton) {
    return (
      <div className={`jf-list jf-list--basic${selected ? ' jf-list--selected' : ''}`}>
        {header}
        {items.map((_, i) => (
          <Fragment key={i}>
            <SkeletonListItem imageStyle={imageStyle} size={size} animClass={animClass} />
            {i < items.length - 1 && <div className="jf-list__divider" />}
          </Fragment>
        ))}
      </div>
    );
  }

  if (layout === 'Card') {
    const isVertical = cardLayout === 'Vertical';
    const gridClass = isVertical
      ? `jf-list__card-grid--${cardSize.toLowerCase()}`
      : '';

    return (
      <div className={`jf-list jf-list--card${selected ? ' jf-list--selected' : ''}`}>
        {header}
        <div className={`jf-list__card-grid ${gridClass}`}>
          {items.map((item, i) => (
            <Card
              key={i}
              imageStyle={cardImageStyle}
              layout={cardLayout}
              action={cardAction}
              actionIconFilled={cardActionIconFilled}
              title={item.title}
              description={item.description}
              buttonLabel={cardButtonLabel}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`jf-list jf-list--basic${selected ? ' jf-list--selected' : ''}`}>
      {header}
      {items.map((item, i) => (
        <Fragment key={i}>
          <BasicListItem item={item} imageStyle={imageStyle} size={size} action={action} actionIconFilled={actionIconFilled} buttonLabel={buttonLabel} />
          {i < items.length - 1 && <div className="jf-list__divider" />}
        </Fragment>
      ))}
    </div>
  );
};

export default List;
