import { Icon } from '../Icon/Icon';
import './CamperCard.scss';

export interface CamperForm {
  id: string;
  label: string;
  status: 'completed' | 'pending';
  hasAction?: boolean;
}

export interface CamperCardProps {
  name?: string;
  meta?: string;
  avatar?: string;
  completionPercent?: number;
  completedCount?: number;
  totalCount?: number;
  forms?: CamperForm[];
  selected?: boolean;
}

const DEFAULT_FORMS: CamperForm[] = [
  { id: '1', label: 'Camper Registration form', status: 'completed' },
  { id: '2', label: 'Camper Health record', status: 'completed' },
  { id: '3', label: 'Camper Immunization Record', status: 'completed' },
  { id: '4', label: 'Camper Healthcare Information', status: 'pending', hasAction: true },
  { id: '5', label: 'Camper Transportation Planning', status: 'completed' },
];

export function CamperCard({
  name = 'Emma Johnson',
  meta = 'Age 10 · Cabin Firefly',
  avatar = '👧',
  completionPercent = 80,
  completedCount = 4,
  totalCount = 5,
  forms = DEFAULT_FORMS,
  selected = false,
}: CamperCardProps) {
  const classes = [
    'jf-camper-card',
    selected && 'jf-camper-card--selected',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="jf-camper-card__header">
        <div className="jf-camper-card__avatar" aria-hidden="true">{avatar}</div>
        <div className="jf-camper-card__header-text">
          <div className="jf-camper-card__name">{name}</div>
          <div className="jf-camper-card__meta">{meta}</div>
        </div>
        <div className="jf-camper-card__percent-badge">{completionPercent}%</div>
      </div>

      <div className="jf-camper-card__progress">
        <div className="jf-camper-card__progress-label">Registration progress: {completionPercent}%</div>
        <div className="jf-camper-card__progress-track">
          <div
            className="jf-camper-card__progress-fill"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <div className="jf-camper-card__progress-count">
          {completedCount} of {totalCount} items completed
        </div>
      </div>

      <div className="jf-camper-card__forms">
        {forms.map((form) => (
          <div key={form.id} className="jf-camper-card__form-row">
            <span className="jf-camper-card__form-label">{form.label}</span>
            <div className="jf-camper-card__form-actions">
              <span className={`jf-camper-card__status jf-camper-card__status--${form.status}`}>
                {form.status === 'completed' ? 'Completed' : 'Pending'}
              </span>
              {form.hasAction && (
                <button type="button" className="jf-camper-card__open-btn">
                  <Icon name="ExternalLink" size={14} />
                  <span>Open Form</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CamperCard;
