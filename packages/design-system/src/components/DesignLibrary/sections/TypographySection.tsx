const HEADINGS = [
  { name: 'Heading 1', var: 'h1', weight: 'Bold', size: '28px', lh: '40px', ls: '-2.1%' },
  { name: 'Heading 2', var: 'h2', weight: 'Bold', size: '24px', lh: '32px', ls: '-1.9%' },
  { name: 'Heading 3', var: 'h3', weight: 'Medium', size: '20px', lh: '28px', ls: '-1.7%' },
  { name: 'Heading 4', var: 'h4', weight: 'Medium', size: '18px', lh: '24px', ls: '-1.4%' },
  { name: 'Heading 5', var: 'h5', weight: 'Medium', size: '16px', lh: '24px', ls: '-1.1%' },
  { name: 'Heading 6', var: 'h6', weight: 'Medium', size: '14px', lh: '20px', ls: '-0.6%' },
  { name: 'Heading 7', var: 'h7', weight: 'Medium', size: '12px', lh: '16px', ls: '0%' },
];

const BODY_STYLES = [
  { name: 'Body Large', var: 'body-lg', weights: 'Book, Bold', size: '18px', lh: '24px', ls: '-1.4%' },
  { name: 'Body', var: 'body', weights: 'Book, Bold', size: '16px', lh: '24px', ls: '-1.1%' },
  { name: 'Body Small', var: 'body-sm', weights: 'Book, Bold', size: '14px', lh: '20px', ls: '-0.6%' },
  { name: 'Caption', var: 'caption', weights: 'Book, Bold', size: '12px', lh: '16px', ls: '0%' },
  { name: 'Caption Small', var: 'caption-sm', weights: 'Book, Bold', size: '10px', lh: '16px', ls: '1%' },
  { name: 'Label', var: 'label', weights: 'Book, Medium', size: '16px', lh: '16px', ls: '-1.1%' },
  { name: 'Label Small', var: 'label-sm', weights: 'Book, Medium', size: '14px', lh: '16px', ls: '-0.6%' },
];

export function TypographySection() {
  return (
    <div>
      <h1 className="dl-section__title">Typography</h1>
      <p className="dl-section__description">
        Typography tokens create hierarchy and guide users. Font family is Circular with three weights: Book (400), Medium (500), Bold (700).
      </p>

      <h2 className="dl-section__subtitle">Headings</h2>
      <div className="dl-type__list">
        {HEADINGS.map((h) => (
          <div key={h.var} className="dl-type__item">
            <div className="dl-type__meta">
              <span className="dl-type__tag">{h.size}</span>
              <span className="dl-type__tag">{h.weight}</span>
              <span className="dl-type__tag">LH: {h.lh}</span>
              <span className="dl-type__tag">LS: {h.ls}</span>
            </div>
            <p
              className="dl-type__preview"
              style={{
                fontSize: `var(--${h.var}-size)`,
                fontWeight: `var(--${h.var}-weight)`,
                lineHeight: `var(--${h.var}-line-height)`,
                letterSpacing: `var(--${h.var}-letter-spacing)`,
              }}
            >
              {h.name} — The quick brown fox jumps over the lazy dog
            </p>
          </div>
        ))}
      </div>

      <h2 className="dl-section__subtitle">Body & Labels</h2>
      <div className="dl-type__list">
        {BODY_STYLES.map((s) => (
          <div key={s.var} className="dl-type__item">
            <div className="dl-type__meta">
              <span className="dl-type__tag">{s.size}</span>
              <span className="dl-type__tag">{s.weights}</span>
              <span className="dl-type__tag">LH: {s.lh}</span>
              <span className="dl-type__tag">LS: {s.ls}</span>
            </div>
            <p
              className="dl-type__preview"
              style={{
                fontSize: `var(--${s.var}-size)`,
                lineHeight: `var(--${s.var}-line-height)`,
                letterSpacing: `var(--${s.var}-letter-spacing)`,
              }}
            >
              {s.name} — The quick brown fox jumps over the lazy dog
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
