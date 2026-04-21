import { useState, type FC } from 'react';
import { Icon } from '../Icon/Icon';
import './Testimonial.scss';

export interface TestimonialItem {
  name: string;
  text: string;
  avatar?: string;
}

export interface TestimonialProps {
  items?: TestimonialItem[];
  selected?: boolean;
  shrinked?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
}

const DEFAULT_ITEMS: TestimonialItem[] = [
  { name: 'First Testimonial', text: '\u201CLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\u201D' },
  { name: 'Second Testimonial', text: '\u201CUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\u201D' },
  { name: 'Third Testimonial', text: '\u201CDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\u201D' },
];

export const Testimonial: FC<TestimonialProps> = ({
  items = DEFAULT_ITEMS,
  selected = false,
  shrinked = false,
  skeleton = false,
  skeletonAnimation = 'pulse',
}) => {
  const [active, setActive] = useState(0);

  const handlePrev = () => setActive((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  const handleNext = () => setActive((prev) => (prev === items.length - 1 ? 0 : prev + 1));

  const current = items[active];

  const rootClasses = [
    'jf-testimonial',
    shrinked && 'jf-testimonial--shrinked',
    selected && 'jf-testimonial--selected',
  ].filter(Boolean).join(' ');

  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  if (skeleton) {
    return (
      <div className={rootClasses}>
        <div className={`jf-testimonial__card ${animClass}`}>
          <div className={`jf-testimonial__content${shrinked ? ' jf-testimonial__content--vertical' : ''}`}>
            <div className="jf-testimonial__avatar jf-skeleton__bone" style={{ borderRadius: '50%' }} />
            <div className="jf-testimonial__text">
              <div className="jf-skeleton__bone jf-skeleton__line jf-skeleton__line--lg" />
              <div className="jf-skeleton__bone jf-skeleton__line jf-skeleton__line--md" />
              <div className="jf-skeleton__bone jf-skeleton__line jf-skeleton__line--md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={rootClasses}>
      <div className="jf-testimonial__card">
        <div className={`jf-testimonial__content${shrinked ? ' jf-testimonial__content--vertical' : ''}`}>
          <div className="jf-testimonial__avatar">
            {current.avatar ? <img src={current.avatar} alt={current.name} className="jf-testimonial__avatar-img" /> : <Icon name="User" size={40} />}
          </div>
          <div className="jf-testimonial__text">
            <h4 className="jf-testimonial__name">{current.name}</h4>
            <p className="jf-testimonial__quote">{current.text}</p>
          </div>
        </div>
        {items.length > 1 && (
          <div className="jf-testimonial__nav">
            <button className="jf-testimonial__nav-btn" onClick={handlePrev}>
              <Icon name="ChevronLeft" size={16} />
            </button>
            <button className="jf-testimonial__nav-btn" onClick={handleNext}>
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonial;
