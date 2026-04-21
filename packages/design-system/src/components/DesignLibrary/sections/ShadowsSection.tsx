const SHADOWS = [
  { token: 'shadow-xs', label: 'X-Small', usage: 'Cards, Badges' },
  { token: 'shadow-sm', label: 'Small', usage: 'Menus, Sub Menus' },
  { token: 'shadow-md', label: 'Medium', usage: 'Card Raised' },
  { token: 'shadow-lg', label: 'Large', usage: 'Dialogs' },
  { token: 'shadow-xl', label: 'X-Large', usage: 'Modals' },
];

export function ShadowsSection() {
  return (
    <div>
      <h1 className="dl-section__title">Shadows</h1>
      <p className="dl-section__description">
        Shadow tokens provide depth and elevation. Light and dark variants are available, with dark mode shadows using deeper opacity values.
      </p>

      <h2 className="dl-section__subtitle">Light</h2>
      <div className="dl-shadows__grid">
        {SHADOWS.map((s) => (
          <div key={s.token} className="dl-shadows__item">
            <div
              className="dl-shadows__box"
              style={{ boxShadow: `var(--${s.token})` }}
            />
            <div className="dl-shadows__label">{s.label}</div>
            <div className="dl-shadows__usage">{s.usage}</div>
          </div>
        ))}
      </div>

      <h2 className="dl-section__subtitle">Dark</h2>
      <div className="dl-shadows__dark-wrapper">
        <div className="dl-shadows__dark-grid">
          {SHADOWS.map((s) => (
            <div key={`dark-${s.token}`} className="dl-shadows__item">
              <div
                className="dl-shadows__dark-box"
                style={{
                  boxShadow: s.token === 'shadow-xs'
                    ? '0px 0px 1px 0px rgba(10,11,13,0.04), 0px 2px 4px 0px rgba(10,11,13,0.32)'
                    : s.token === 'shadow-sm'
                    ? '0px 0px 2px 0px rgba(10,11,13,0.04), 0px 4px 8px 0px rgba(10,11,13,0.32)'
                    : s.token === 'shadow-md'
                    ? '0px 2px 4px 0px rgba(10,11,13,0.04), 0px 8px 16px 0px rgba(10,11,13,0.32)'
                    : s.token === 'shadow-lg'
                    ? '0px 2px 8px 0px rgba(10,11,13,0.04), 0px 16px 24px 0px rgba(10,11,13,0.32)'
                    : '0px 2px 8px 0px rgba(10,11,13,0.08), 0px 20px 32px 0px rgba(10,11,13,0.32)',
                }}
              />
              <div className="dl-shadows__dark-label">{s.label}</div>
              <div className="dl-shadows__dark-usage">{s.usage}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
