const CORE_PALETTES = [
  {
    name: 'Blue',
    colors: [
      { token: 'blue-100', hex: '#EDF8FF' },
      { token: 'blue-200', hex: '#77CFFF' },
      { token: 'blue-300', hex: '#4DBEFC' },
      { token: 'blue-400', hex: '#0099FF' },
      { token: 'blue-500', hex: '#0075E3' },
      { token: 'blue-600', hex: '#0066C3' },
    ],
  },
  {
    name: 'Green',
    colors: [
      { token: 'green-100', hex: '#EDFED1' },
      { token: 'green-200', hex: '#CBFB7B' },
      { token: 'green-300', hex: '#A8EB38' },
      { token: 'green-400', hex: '#7FCA00' },
      { token: 'green-500', hex: '#64B200' },
      { token: 'green-600', hex: '#529300' },
    ],
  },
  {
    name: 'Yellow',
    colors: [
      { token: 'yellow-100', hex: '#FFF5D2' },
      { token: 'yellow-200', hex: '#FFDC7B' },
      { token: 'yellow-300', hex: '#FFC42C' },
      { token: 'yellow-400', hex: '#FFB629' },
      { token: 'yellow-500', hex: '#F9A400' },
      { token: 'yellow-600', hex: '#F49200' },
    ],
  },
  {
    name: 'Orange',
    colors: [
      { token: 'orange-100', hex: '#FFE4CC' },
      { token: 'orange-200', hex: '#FEC48E' },
      { token: 'orange-300', hex: '#FFA34F' },
      { token: 'orange-400', hex: '#FF7B1C' },
      { token: 'orange-500', hex: '#FF6100' },
      { token: 'orange-600', hex: '#E55300' },
    ],
  },
  {
    name: 'Red',
    colors: [
      { token: 'red-100', hex: '#FEF2F2' },
      { token: 'red-200', hex: '#FECACA' },
      { token: 'red-300', hex: '#F87171' },
      { token: 'red-400', hex: '#DC2626' },
      { token: 'red-500', hex: '#C90909' },
      { token: 'red-600', hex: '#AB0101' },
    ],
  },
  {
    name: 'Purple',
    colors: [
      { token: 'purple-100', hex: '#F3E2FF' },
      { token: 'purple-200', hex: '#E0B7FD' },
      { token: 'purple-300', hex: '#BF78F0' },
      { token: 'purple-400', hex: '#9C4DD3' },
      { token: 'purple-500', hex: '#892DCA' },
      { token: 'purple-600', hex: '#6915A4' },
    ],
  },
  {
    name: 'Navy',
    colors: [
      { token: 'navy-10', hex: '#F9F9FF' },
      { token: 'navy-25', hex: '#F3F3FE' },
      { token: 'navy-50', hex: '#E3E5F5' },
      { token: 'navy-75', hex: '#DADEF3' },
      { token: 'navy-100', hex: '#C8CEED' },
      { token: 'navy-200', hex: '#979DC6' },
      { token: 'navy-300', hex: '#6C73A8' },
      { token: 'navy-400', hex: '#454E80' },
      { token: 'navy-500', hex: '#343C6A' },
      { token: 'navy-600', hex: '#252D5B' },
      { token: 'navy-700', hex: '#0A1551' },
      { token: 'navy-800', hex: '#091141' },
      { token: 'navy-900', hex: '#050C34' },
    ],
  },
  {
    name: 'Gray',
    colors: [
      { token: 'gray-25', hex: '#F1F1F4' },
      { token: 'gray-50', hex: '#E2E3E9' },
      { token: 'gray-75', hex: '#D3D6DE' },
      { token: 'gray-100', hex: '#BFC3CE' },
      { token: 'gray-200', hex: '#A0A6B6' },
      { token: 'gray-300', hex: '#7F859C' },
      { token: 'gray-400', hex: '#4C536F' },
      { token: 'gray-500', hex: '#434A60' },
      { token: 'gray-600', hex: '#33384A' },
      { token: 'gray-700', hex: '#292D3C' },
      { token: 'gray-800', hex: '#131620' },
      { token: 'gray-900', hex: '#08090B' },
    ],
  },
];

const SEMANTIC_GROUPS = [
  {
    title: 'Brand',
    colors: [
      { label: 'Brand White', token: '--brand-white', ref: 'core-white' },
      { label: 'Brand Blue', token: '--brand-blue', ref: 'blue-400' },
      { label: 'Brand Yellow', token: '--brand-yellow', ref: 'yellow-400' },
      { label: 'Brand Orange', token: '--brand-orange', ref: 'orange-500' },
      { label: 'Brand Dark', token: '--brand-dark', ref: 'navy-700' },
    ],
  },
  {
    title: 'Text (Primary)',
    colors: [
      { label: 'Text White', token: '--text-white', ref: 'core-white' },
      { label: 'Text Lightest', token: '--text-lightest', ref: 'navy-50' },
      { label: 'Text Light', token: '--text-light', ref: 'navy-100' },
      { label: 'Text Medium', token: '--text-medium', ref: 'navy-300' },
      { label: 'Text Dark', token: '--text-dark', ref: 'navy-500' },
      { label: 'Text Darkest', token: '--text-darkest', ref: 'navy-700' },
    ],
  },
  {
    title: 'Background (Primary)',
    colors: [
      { label: 'BG White', token: '--background-white', ref: 'core-white' },
      { label: 'BG Lightest', token: '--background-lightest', ref: 'navy-25' },
      { label: 'BG Light', token: '--background-light', ref: 'navy-75' },
      { label: 'BG Medium', token: '--background-medium', ref: 'navy-100' },
      { label: 'BG Dark', token: '--background-dark', ref: 'navy-300' },
      { label: 'BG Darkest', token: '--background-darkest', ref: 'navy-700' },
    ],
  },
  {
    title: 'Border (Primary)',
    colors: [
      { label: 'Border Light', token: '--border-light', ref: 'navy-50' },
      { label: 'Border Medium', token: '--border-medium', ref: 'navy-100' },
      { label: 'Border Dark', token: '--border-dark', ref: 'navy-500' },
      { label: 'Border Darkest', token: '--border-darkest', ref: 'navy-700' },
    ],
  },
  {
    title: 'Text (Secondary)',
    colors: [
      { label: 'Sec. Text White', token: '--secondary-text-white', ref: 'core-white' },
      { label: 'Sec. Text Lightest', token: '--secondary-text-lightest', ref: 'gray-100' },
      { label: 'Sec. Text Light', token: '--secondary-text-light', ref: 'gray-200' },
      { label: 'Sec. Text Medium', token: '--secondary-text-medium', ref: 'gray-400' },
      { label: 'Sec. Text Dark', token: '--secondary-text-dark', ref: 'gray-600' },
      { label: 'Sec. Text Darkest', token: '--secondary-text-darkest', ref: 'gray-700' },
    ],
  },
  {
    title: 'Background (Secondary)',
    colors: [
      { label: 'Sec. BG White', token: '--secondary-background-white', ref: 'core-white' },
      { label: 'Sec. BG Lightest', token: '--secondary-background-lightest', ref: 'gray-400' },
      { label: 'Sec. BG Light', token: '--secondary-background-light', ref: 'gray-500' },
      { label: 'Sec. BG Medium', token: '--secondary-background-medium', ref: 'gray-600' },
      { label: 'Sec. BG Dark', token: '--secondary-background-dark', ref: 'gray-700' },
      { label: 'Sec. BG Darkest', token: '--secondary-background-darkest', ref: 'gray-800' },
    ],
  },
  {
    title: 'Border (Secondary)',
    colors: [
      { label: 'Sec. Border Light', token: '--secondary-border-light', ref: 'gray-200' },
      { label: 'Sec. Border Medium', token: '--secondary-border-medium', ref: 'gray-400' },
      { label: 'Sec. Border Dark', token: '--secondary-border-dark', ref: 'gray-700' },
    ],
  },
  {
    title: 'Accent',
    colors: [
      { label: 'Accent Lightest', token: '--accent-lightest', ref: 'blue-100' },
      { label: 'Accent Light', token: '--accent-light', ref: 'blue-300' },
      { label: 'Accent Default', token: '--accent-default', ref: 'blue-500' },
      { label: 'Accent Dark', token: '--accent-dark', ref: 'blue-600' },
    ],
  },
  {
    title: 'Success',
    colors: [
      { label: 'Success Lightest', token: '--success-lightest', ref: 'green-100' },
      { label: 'Success Light', token: '--success-light', ref: 'green-200' },
      { label: 'Success Default', token: '--success-default', ref: 'green-500' },
      { label: 'Success Dark', token: '--success-dark', ref: 'green-600' },
    ],
  },
  {
    title: 'Error',
    colors: [
      { label: 'Error Lightest', token: '--error-lightest', ref: 'red-100' },
      { label: 'Error Light', token: '--error-light', ref: 'red-200' },
      { label: 'Error Default', token: '--error-default', ref: 'red-400' },
      { label: 'Error Dark', token: '--error-dark', ref: 'red-600' },
    ],
  },
  {
    title: 'Product Colors',
    colors: [
      { label: 'Apps (Active)', token: '--product-default', ref: 'purple-400' },
      { label: 'Apps Light', token: '--product-light', ref: 'purple-300' },
      { label: 'Apps Dark', token: '--product-dark', ref: 'purple-500' },
      { label: 'AI', token: '--product-ai-default', ref: '#7923DD' },
      { label: 'Analytics', token: '--product-analytics-default', ref: '#8F96CC' },
      { label: 'Approvals', token: '--product-approvals-default', ref: '#007862' },
      { label: 'Boards', token: '--product-boards-default', ref: 'blue-500' },
      { label: 'Forms', token: '--product-forms-default', ref: 'orange-500' },
      { label: 'Inbox', token: '--product-inbox-default', ref: '#249BB4' },
      { label: 'Tables', token: '--product-tables-default', ref: '#049E38' },
      { label: 'Pages', token: '--product-pages-default', ref: '#034F96' },
      { label: 'PDF Editor', token: '--product-pdf-default', ref: '#3E62C8' },
      { label: 'Reports', token: '--product-reports-default', ref: '#5369AB' },
      { label: 'Sign', token: '--product-sign-default', ref: '#7BB60F' },
      { label: 'Teams', token: '--product-teams-default', ref: '#18235C' },
    ],
  },
];

export function ColorsSection() {
  return (
    <div>
      <h1 className="dl-section__title">Colors</h1>
      <p className="dl-section__description">
        Color tokens from the JotForm design system. Core palette provides primitive values, semantic tokens reference primitives for specific use cases.
      </p>

      {SEMANTIC_GROUPS.map((group) => (
        <div key={group.title}>
          <h2 className="dl-section__subtitle">{group.title}</h2>
          <div className="dl-colors__semantic-grid">
            {group.colors.map((c) => (
              <div key={c.token} className="dl-colors__semantic-item">
                <div
                  className="dl-colors__semantic-dot"
                  style={{ background: `var(${c.token})` }}
                />
                <div>
                  <div className="dl-colors__semantic-label">{c.label}</div>
                  <div className="dl-colors__semantic-ref">{c.ref}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {CORE_PALETTES.map((palette) => (
        <div key={palette.name}>
          <h2 className="dl-section__subtitle">{palette.name}</h2>
          <div className="dl-colors__grid">
            {palette.colors.map((color) => (
              <div key={color.token} className="dl-colors__swatch">
                <div
                  className="dl-colors__preview"
                  style={{ background: `var(--${color.token})` }}
                />
                <div className="dl-colors__info">
                  <div className="dl-colors__name">{color.token}</div>
                  <div className="dl-colors__value">{color.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
