import type React from 'react';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button';
import './DonationBox.scss';

export type DonationHeadingAlignment = 'Left' | 'Center' | 'Right';
export type DonationSize = 'Web' | 'Mobile';

export interface DonationBoxProps {
  headingAlignment?: DonationHeadingAlignment;
  size?: DonationSize;
  title?: string;
  description?: string;
  showGoal?: boolean;
  raisedAmount?: string;
  goalAmount?: string;
  goalProgress?: number;
  amounts?: string[];
  showCustomAmount?: boolean;
  currencySymbol?: string;
  buttonLabel?: string;
  selected?: boolean;
}

export const DonationBox: React.FC<DonationBoxProps> = ({
  headingAlignment = 'Left',
  size = 'Web',
  title = 'Support us!',
  description = 'Your donation will help us change the lives of those in need.',
  showGoal = true,
  raisedAmount = '$2,150',
  goalAmount = '$5,000',
  goalProgress = 43,
  amounts = ['$10.00', '$25.00', '$50.00'],
  showCustomAmount = true,
  currencySymbol = '$',
  buttonLabel = 'Donate Now',
  selected = false,
}) => {
  const rootClasses = [
    'jf-donation',
    `jf-donation--${size.toLowerCase()}`,
    selected && 'jf-donation--selected',
  ].filter(Boolean).join(' ');

  const headingClasses = [
    'jf-donation__heading',
    `jf-donation__heading--${headingAlignment.toLowerCase()}`,
  ].join(' ');

  const isWeb = size === 'Web';

  return (
    <div className={rootClasses}>
      {/* Heading */}
      <div className={headingClasses}>
        <h3 className="jf-donation__title">{title}</h3>
        <p className="jf-donation__description">{description}</p>
      </div>

      {/* Goal Progress */}
      {showGoal && (
        <div className="jf-donation__goal">
          <div className="jf-donation__goal-labels">
            <span>{raisedAmount} Raised</span>
            <span>{goalAmount} Goal</span>
          </div>
          <div className="jf-donation__goal-track">
            <div
              className="jf-donation__goal-fill"
              style={{ width: `${Math.min(goalProgress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Amounts */}
      <div className="jf-donation__amounts-section">
        <div className={`jf-donation__amounts ${isWeb ? 'jf-donation__amounts--web' : 'jf-donation__amounts--mobile'}`}>
          {amounts.map((amount, i) => (
            <div className="jf-donation__amount-item" key={i}>
              <span className="jf-donation__amount-value">{amount}</span>
            </div>
          ))}
        </div>

        {/* Add New Amount - only visible in selected/edit state */}
        {selected && (
          <button className="jf-donation__add-amount">
            <Icon name="CirclePlus" size={20} />
            <span>Add New Amount</span>
          </button>
        )}

        {/* Custom Amount */}
        {showCustomAmount && (
          <div className="jf-donation__custom-amount">
            <span className="jf-donation__custom-symbol">{currencySymbol}</span>
            <input
              className="jf-donation__custom-input"
              type="text"
              placeholder="Custom Amount"
            />
          </div>
        )}
      </div>

      {/* Donate Button - uses shared Button component */}
      <div className="jf-donation__button-wrapper">
        <Button
          variant="Default"
          corner="Default"
          label={buttonLabel}
          leftIcon="none"
          rightIcon="none"
          fullWidth
          shrinked
        />
      </div>
    </div>
  );
};

export default DonationBox;
