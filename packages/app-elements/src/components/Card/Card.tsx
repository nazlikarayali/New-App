import type React from 'react';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button';
import './Card.scss';

// ============================================
// Types
// ============================================
export type CardImageStyle = 'Square' | 'Circle' | 'Icon' | 'None';
export type CardLayout = 'Horizontal' | 'Vertical';
export type CardAction = 'None' | 'Icon' | 'Button';

export interface CardProps {
  imageStyle?: CardImageStyle;
  layout?: CardLayout;
  action?: CardAction;
  actionIconFilled?: boolean;
  iconName?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  selected?: boolean;
  shrinked?: boolean;
  hover?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
}

// ============================================
// Sub-components
// ============================================

const ImagePlaceholder: React.FC = () => (
  <Icon name="Image" size={48} />
);

const DynamicCardIcon: React.FC<{ name: string; size?: number }> = ({ name, size = 32 }) => {
  if (!name || name === 'none') return <ImagePlaceholder />;
  return <Icon name={name} size={size} />;
};

// ============================================
// Card Image
// ============================================
interface CardImageProps {
  imageStyle: CardImageStyle;
  layout: CardLayout;
  iconName: string;
}

const CardImage: React.FC<CardImageProps> = ({ imageStyle, layout, iconName }) => {
  if (imageStyle === 'None') return null;

  const iconContent = imageStyle === 'Icon'
    ? <div className="jf-card__image-icon"><DynamicCardIcon name={iconName} /></div>
    : <div className="jf-card__image-icon"><ImagePlaceholder /></div>;

  if (layout === 'Horizontal') {
    const modClass = imageStyle === 'Square' ? 'square'
      : imageStyle === 'Circle' ? 'circle'
      : 'icon';
    return <div className={`jf-card__image jf-card__image--${modClass}`}>{iconContent}</div>;
  }

  if (imageStyle === 'Square') {
    return <div className="jf-card__image jf-card__image--square-header">{iconContent}</div>;
  }
  if (imageStyle === 'Circle') {
    return <div className="jf-card__image jf-card__image--circle-card">{iconContent}</div>;
  }
  if (imageStyle === 'Icon') {
    return <div className="jf-card__image jf-card__image--icon-card">{iconContent}</div>;
  }

  return null;
};

// ============================================
// Card Content
// ============================================
interface CardContentProps {
  title: string;
  description: string;
  centered?: boolean;
}

const CardContent: React.FC<CardContentProps> = ({ title, description, centered }) => (
  <div className={`jf-card__content${centered ? ' jf-card__content--centered' : ''}`}>
    <div className="jf-card__title">{title}</div>
    <div className="jf-card__description">{description}</div>
  </div>
);

// ============================================
// Card Action
// ============================================
interface CardActionProps {
  action: CardAction;
  actionIconFilled: boolean;
  buttonLabel: string;
  fullWidth?: boolean;
}

const CardAction: React.FC<CardActionProps> = ({ action, actionIconFilled, buttonLabel, fullWidth }) => {
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
    <button className={`jf-card__action-button${fullWidth ? ' jf-card__action-button--full' : ''}`}>
      {buttonLabel}
    </button>
  );
};

// ============================================
// Card Component
// ============================================
export const Card: React.FC<CardProps> = ({
  imageStyle = 'Square',
  layout = 'Horizontal',
  action = 'None',
  actionIconFilled = true,
  iconName = 'Heart',
  title = 'Card Title',
  description = 'Card description',
  buttonLabel = 'Edit',
  selected = false,
  shrinked = false,
  hover = false,
  skeleton = false,
  skeletonAnimation = 'pulse',
}) => {
  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  if (skeleton) {
    const classes = [
      'jf-card',
      'jf-card--skeleton',
      layout === 'Vertical' ? 'jf-card--vertical' : 'jf-card--horizontal',
      shrinked && 'jf-card--shrinked',
    ].filter(Boolean).join(' ');

    const imageModClass = imageStyle === 'Square'
      ? (layout === 'Vertical' ? 'square-header' : 'square')
      : imageStyle === 'Circle'
      ? (layout === 'Vertical' ? 'circle-card' : 'circle')
      : 'icon';

    const skeletonBg = { background: 'var(--bg-surface)' };

    return (
      <div className={classes} style={skeletonBg}>
        {imageStyle !== 'None' && (
          <div className={`jf-card__image jf-card__image--${imageModClass} jf-skeleton__bone ${animClass}`} />
        )}
        {layout === 'Vertical' ? (
          <div className="jf-card__body" style={skeletonBg}>
            <div className="jf-card__content">
              <div className={`jf-skeleton__line jf-skeleton__line--lg ${animClass}`} style={{ width: '60%' }} />
              <div className={`jf-skeleton__line jf-skeleton__line--sm ${animClass}`} style={{ width: '80%' }} />
            </div>
          </div>
        ) : (
          <div className="jf-card__content">
            <div className={`jf-skeleton__line jf-skeleton__line--lg ${animClass}`} style={{ width: '60%' }} />
            <div className={`jf-skeleton__line jf-skeleton__line--sm ${animClass}`} style={{ width: '80%' }} />
          </div>
        )}
      </div>
    );
  }

  const classes = [
    'jf-card',
    layout === 'Vertical' ? 'jf-card--vertical' : 'jf-card--horizontal',
    selected && 'jf-card--selected',
    shrinked && 'jf-card--shrinked',
    hover && 'jf-card--hover',
  ]
    .filter(Boolean)
    .join(' ');

  const isCentered = layout === 'Vertical' && (imageStyle === 'Circle' || imageStyle === 'Icon');

  if (layout === 'Horizontal') {
    return (
      <div className={classes}>
        <CardImage imageStyle={imageStyle} layout={layout} iconName={iconName} />
        <CardContent title={title} description={description} />
        <CardAction action={action} actionIconFilled={actionIconFilled} buttonLabel={buttonLabel} />
      </div>
    );
  }

  if (imageStyle === 'Square') {
    return (
      <div className={classes}>
        <CardImage imageStyle={imageStyle} layout={layout} iconName={iconName} />
        {action === 'None' ? (
          <div className="jf-card__body">
            <CardContent title={title} description={description} />
          </div>
        ) : action === 'Icon' ? (
          <div className="jf-card__body jf-card__body--row">
            <CardContent title={title} description={description} />
            <CardAction action={action} actionIconFilled={actionIconFilled} buttonLabel={buttonLabel} />
          </div>
        ) : (
          <div className="jf-card__body">
            <CardContent title={title} description={description} centered />
            <CardAction action={action} actionIconFilled={actionIconFilled} buttonLabel={buttonLabel} fullWidth />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={classes}>
      <CardImage imageStyle={imageStyle} layout={layout} iconName={iconName} />
      {action === 'Icon' ? (
        <div className="jf-card__body jf-card__body--row">
          <CardContent title={title} description={description} centered={isCentered} />
          <CardAction action={action} actionIconFilled={actionIconFilled} buttonLabel={buttonLabel} />
        </div>
      ) : action === 'Button' ? (
        <div className="jf-card__body">
          <CardContent title={title} description={description} centered={isCentered} />
          <CardAction action={action} actionIconFilled={actionIconFilled} buttonLabel={buttonLabel} fullWidth />
        </div>
      ) : (
        <div className="jf-card__body">
          <CardContent title={title} description={description} centered={isCentered} />
        </div>
      )}
    </div>
  );
};

export default Card;
