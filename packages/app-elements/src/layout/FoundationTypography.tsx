import { useEffect, useState } from 'react';

interface FontToken {
  name: string;
  variable: string;
}

interface FontCategory {
  title: string;
  tokens: FontToken[];
  preview?: string;
}

const fontFamilies: FontToken[] = [
  { name: 'font-family', variable: '--font-family' },
  { name: 'font-family-heading', variable: '--font-family-heading' },
];

const fontWeights: FontToken[] = [
  { name: 'Regular (400)', variable: '--font-weight-regular' },
  { name: 'Medium (500)', variable: '--font-weight-medium' },
  { name: 'Bold (600)', variable: '--font-weight-bold' },
];

const typographyCategories: FontCategory[] = [
  {
    title: 'Heading',
    preview: 'The quick brown fox',
    tokens: [
      { name: 'XXL — 40px / 48px', variable: '--font-size-heading-xxl' },
      { name: 'XL — 36px / 44px', variable: '--font-size-heading-xl' },
      { name: 'LG — 32px / 40px', variable: '--font-size-heading-lg' },
      { name: 'MD — 28px / 36px', variable: '--font-size-heading-md' },
      { name: 'SM — 24px / 32px', variable: '--font-size-heading-sm' },
      { name: 'XS — 20px / 28px', variable: '--font-size-heading-xs' },
    ],
  },
  {
    title: 'Paragraph',
    preview: 'The quick brown fox jumps over the lazy dog',
    tokens: [
      { name: 'LG — 18px / 28px', variable: '--font-size-paragraph-lg' },
      { name: 'MD — 16px / 24px', variable: '--font-size-paragraph-md' },
      { name: 'SM — 14px / 20px', variable: '--font-size-paragraph-sm' },
      { name: 'XS — 12px / 20px', variable: '--font-size-paragraph-xs' },
    ],
  },
  {
    title: 'Label',
    preview: 'Label text',
    tokens: [
      { name: 'LG — 16px / 24px', variable: '--font-size-label-lg' },
      { name: 'MD — 14px / 20px', variable: '--font-size-label-md' },
      { name: 'SM — 12px / 16px', variable: '--font-size-label-sm' },
      { name: 'XS — 10px / 14px', variable: '--font-size-label-xs' },
    ],
  },
];

function resolveLineHeight(variable: string): string {
  const temp = document.createElement('div');
  temp.style.lineHeight = `var(${variable})`;
  document.documentElement.appendChild(temp);
  const value = getComputedStyle(temp).lineHeight;
  document.documentElement.removeChild(temp);
  return value;
}

function resolveValue(variable: string): string {
  const temp = document.createElement('div');
  temp.style.setProperty('font-size', `var(${variable})`);
  document.documentElement.appendChild(temp);
  const value = getComputedStyle(temp).fontSize;
  document.documentElement.removeChild(temp);
  return value;
}

function resolveFontFamily(variable: string): string {
  const temp = document.createElement('div');
  temp.style.fontFamily = `var(${variable})`;
  document.documentElement.appendChild(temp);
  const value = getComputedStyle(temp).fontFamily;
  document.documentElement.removeChild(temp);
  return value;
}

const TypeColGroup = () => (
  <colgroup>
    <col style={{ width: '30%' }} />
    <col style={{ width: '10%' }} />
    <col style={{ width: '60%' }} />
  </colgroup>
);

const TypeScaleColGroup = () => (
  <colgroup>
    <col style={{ width: '25%' }} />
    <col style={{ width: '10%' }} />
    <col style={{ width: '10%' }} />
    <col style={{ width: '55%' }} />
  </colgroup>
);

export function FoundationTypography() {
  const [resolved, setResolved] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const map = new Map<string, string>();
    for (const token of fontFamilies) {
      map.set(token.variable, resolveFontFamily(token.variable));
    }
    for (const token of fontWeights) {
      const temp = document.createElement('div');
      temp.style.fontWeight = `var(${token.variable})`;
      document.documentElement.appendChild(temp);
      map.set(token.variable, getComputedStyle(temp).fontWeight);
      document.documentElement.removeChild(temp);
    }
    for (const cat of typographyCategories) {
      for (const token of cat.tokens) {
        map.set(token.variable, resolveValue(token.variable));
        const lhVar = token.variable.replace('font-size', 'line-height');
        map.set(lhVar, resolveLineHeight(lhVar));
      }
    }
    setResolved(map);
  }, []);

  return (
    <main className="main-content">
      <div className="component-view">
        <div className="component-view__toolbar">
          <div className="component-view__name">
            <h2>Typography</h2>
            <span className="component-view__tag">Foundations</span>
          </div>
        </div>
        <div className="foundation-tokens">
          {/* Font Families */}
          <div className="foundation-tokens__section">
            <h3 className="foundation-tokens__section-title">Font Family</h3>
            <table className="foundation-tokens__table">
              <TypeColGroup />
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Value</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {fontFamilies.map((token) => {
                  const value = resolved.get(token.variable) ?? '';
                  const short = value.split(',')[0]?.replace(/['"]/g, '').trim() || value;
                  return (
                    <tr key={token.variable}>
                      <td className="foundation-tokens__table-token"><code>{token.variable}</code></td>
                      <td className="foundation-tokens__table-value">{short}</td>
                      <td>
                        <span style={{ fontFamily: `var(${token.variable})`, fontSize: 16 }}>
                          Aa Bb Cc 123
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Font Weights */}
          <div className="foundation-tokens__section">
            <h3 className="foundation-tokens__section-title">Font Weight</h3>
            <table className="foundation-tokens__table">
              <TypeColGroup />
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Value</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {fontWeights.map((token) => (
                  <tr key={token.variable}>
                    <td className="foundation-tokens__table-token"><code>{token.variable}</code></td>
                    <td className="foundation-tokens__table-value">{resolved.get(token.variable) ?? ''}</td>
                    <td>
                      <span style={{ fontWeight: `var(${token.variable})` as unknown as number, fontSize: 16, fontFamily: 'var(--font-family)' }}>
                        The quick brown fox
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Type Scale */}
          {typographyCategories.map((cat) => (
            <div key={cat.title} className="foundation-tokens__section">
              <h3 className="foundation-tokens__section-title">{cat.title}</h3>
              <table className="foundation-tokens__table">
                <TypeScaleColGroup />
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Size</th>
                    <th>Line Height</th>
                    <th>Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.tokens.map((token) => {
                    const lineHeightVar = token.variable.replace('font-size', 'line-height');
                    return (
                      <tr key={token.variable}>
                        <td className="foundation-tokens__table-token"><code>{token.variable}</code></td>
                        <td className="foundation-tokens__table-value">{resolved.get(token.variable) ?? ''}</td>
                        <td className="foundation-tokens__table-value">{resolved.get(lineHeightVar) ?? ''}</td>
                        <td>
                          <span style={{
                            fontSize: `var(${token.variable})`,
                            lineHeight: `var(${lineHeightVar})`,
                            fontFamily: cat.title === 'Heading' ? 'var(--font-family-heading)' : 'var(--font-family)',
                            fontWeight: cat.title === 'Heading' ? 'var(--font-weight-bold)' as unknown as number : undefined,
                          }}>
                            {cat.preview}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
