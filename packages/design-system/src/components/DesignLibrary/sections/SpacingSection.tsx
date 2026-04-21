const SPACINGS = [
  { token: 'spacing-3xs', value: '2px' },
  { token: 'spacing-2xs', value: '4px' },
  { token: 'spacing-xs', value: '8px' },
  { token: 'spacing-sm', value: '12px' },
  { token: 'spacing-md', value: '16px' },
  { token: 'spacing-lg', value: '20px' },
  { token: 'spacing-xl', value: '24px' },
  { token: 'spacing-2xl', value: '32px' },
  { token: 'spacing-3xl', value: '40px' },
  { token: 'spacing-4xl', value: '64px' },
];

export function SpacingSection() {
  return (
    <div>
      <h1 className="dl-section__title">Spacing</h1>
      <p className="dl-section__description">
        Spacing tokens define consistent padding and margins across all components. Based on a progressive scale.
      </p>

      <h2 className="dl-section__subtitle">Scale</h2>
      <div className="dl-spacing__list">
        {SPACINGS.map((s) => (
          <div key={s.token} className="dl-spacing__item">
            <span className="dl-spacing__label">{s.token.replace('spacing-', '')}</span>
            <span className="dl-spacing__value">{s.value}</span>
            <div
              className="dl-spacing__bar"
              style={{ width: `var(--${s.token})` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
