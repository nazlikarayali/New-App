const RADII = [
  { token: 'radius-none', value: '0px' },
  { token: 'radius-sm', value: '4px' },
  { token: 'radius-md', value: '8px' },
  { token: 'radius-lg', value: '12px' },
  { token: 'radius-xl', value: '16px' },
  { token: 'radius-xxl', value: '24px' },
  { token: 'radius-rounded', value: '9999px' },
];

export function RadiusSection() {
  return (
    <div>
      <h1 className="dl-section__title">Border Radius</h1>
      <p className="dl-section__description">
        Border radius tokens control the roundness of elements across the design system.
      </p>

      <h2 className="dl-section__subtitle">Scale</h2>
      <div className="dl-radius__grid">
        {RADII.map((r) => (
          <div key={r.token} className="dl-radius__item">
            <div
              className="dl-radius__box"
              style={{ borderRadius: `var(--${r.token})` }}
            />
            <div className="dl-radius__label">{r.token.replace('radius-', '')}</div>
            <div className="dl-radius__value">{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
