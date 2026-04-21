import { useState, useCallback } from 'react';
import { Form } from '../Form';
import { Icon } from '../Icon/Icon';
import './ProgressIndicator.scss';

export interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
}

export interface ProgressIndicatorProps {
  title?: string;
  subtitle?: string;
  steps?: ProgressStep[];
  selected?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
}

const DEFAULT_STEPS: ProgressStep[] = [
  { id: '1', label: 'Personal Information', description: 'Basic contact details', completed: true },
  { id: '2', label: 'Upload Documents', description: 'Required files and photos', completed: false },
  { id: '3', label: 'Review & Submit', description: 'Final review before submission', completed: false },
];

export function ProgressIndicator({
  title = 'Complete Your Profile',
  subtitle = 'Fill out the forms below to complete your registration.',
  steps: initialSteps,
  selected = false,
  skeleton = false,
  skeletonAnimation = 'pulse',
}: ProgressIndicatorProps) {
  const [steps, setSteps] = useState<ProgressStep[]>(initialSteps ?? DEFAULT_STEPS);

  const toggleStep = useCallback((id: string) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  }, []);

  const classes = [
    'jf-progress-indicator',
    selected && 'jf-progress-indicator--selected',
  ].filter(Boolean).join(' ');

  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  if (skeleton) {
    return (
      <div className={classes}>
        <div className={`jf-progress-indicator__header ${animClass}`}>
          <div className="jf-skeleton__bone jf-skeleton__line jf-skeleton__line--lg" />
          <div className="jf-skeleton__bone jf-skeleton__line jf-skeleton__line--md" />
        </div>
        <div className={`jf-progress-indicator__segments ${animClass}`}>
          {steps.map((_, i) => (
            <div key={i} className="jf-progress-indicator__segment jf-skeleton__bone" />
          ))}
        </div>
        <div className={`jf-progress-indicator__list ${animClass}`}>
          {steps.map((_, i) => (
            <div key={i} className="jf-progress-indicator__item">
              <Form skeleton skeletonAnimation={skeletonAnimation} shrinked />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={classes}>
      {/* Header */}
      <div className="jf-progress-indicator__header">
        <h3 className="jf-progress-indicator__title">{title}</h3>
        <p className="jf-progress-indicator__subtitle">{subtitle}</p>
      </div>

      {/* Segmented Progress Bar */}
      <div className="jf-progress-indicator__segments">
        {steps.map(step => (
          <div
            key={step.id}
            className={`jf-progress-indicator__segment${step.completed ? ' jf-progress-indicator__segment--completed' : ''}`}
          />
        ))}
      </div>

      {/* Steps List — each item is a Form resource card */}
      <div className="jf-progress-indicator__list">
        {steps.map(step => (
          <button
            key={step.id}
            className={`jf-progress-indicator__item${step.completed ? ' jf-progress-indicator__item--completed' : ''}`}
            onClick={() => toggleStep(step.id)}
          >
            <div className="jf-progress-indicator__form-card">
              <Form
                label={step.label}
                description={step.description ?? ''}
                size="Normal"
                alignment="Left"
                required={false}
                shrinked
              />
            </div>
            {step.completed && (
              <div className="jf-progress-indicator__check-badge">
                <Icon name="Check" size={16} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProgressIndicator;
