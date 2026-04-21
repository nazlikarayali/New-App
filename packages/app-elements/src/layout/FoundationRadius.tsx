import { useEffect, useState } from 'react';

interface TokenDef {
  name: string;
  variable: string;
}

const radiusTokens: TokenDef[] = [
  { name: 'none', variable: '--radius-none' },
  { name: 'sm', variable: '--radius-sm' },
  { name: 'md', variable: '--radius-md' },
  { name: 'lg', variable: '--radius-lg' },
  { name: 'xl', variable: '--radius-xl' },
  { name: 'xxl', variable: '--radius-xxl' },
  { name: 'rounded', variable: '--radius-rounded' },
];

function resolveValue(variable: string): string {
  const temp = document.createElement('div');
  temp.style.borderRadius = `var(${variable})`;
  document.documentElement.appendChild(temp);
  const value = getComputedStyle(temp).borderRadius;
  document.documentElement.removeChild(temp);
  return value;
}

export function FoundationRadius() {
  const [resolved, setResolved] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const map = new Map<string, string>();
    for (const token of radiusTokens) {
      map.set(token.variable, resolveValue(token.variable));
    }
    setResolved(map);
  }, []);

  return (
    <main className="main-content">
      <div className="component-view">
        <div className="component-view__toolbar">
          <div className="component-view__name">
            <h2>Radius</h2>
            <span className="component-view__tag">Foundations</span>
          </div>
        </div>
        <div className="foundation-tokens">
          <div className="foundation-tokens__section">
            <h3 className="foundation-tokens__section-title">Border Radius</h3>
            <table className="foundation-tokens__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Token</th>
                  <th>Value</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {radiusTokens.map((token) => {
                  const value = resolved.get(token.variable);
                  return (
                    <tr key={token.variable}>
                      <td className="foundation-tokens__table-name">{token.name}</td>
                      <td className="foundation-tokens__table-token"><code>{token.variable}</code></td>
                      <td className="foundation-tokens__table-value">{value ?? ''}</td>
                      <td>
                        <div
                          className="foundation-tokens__radius-box"
                          style={{ borderRadius: `var(${token.variable})` }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
