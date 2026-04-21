import { useEffect, useState } from 'react';

interface TokenDef {
  name: string;
  variable: string;
}

const spacingTokens: TokenDef[] = [
  { name: '0', variable: '--space-0' },
  { name: '1', variable: '--space-1' },
  { name: '2', variable: '--space-2' },
  { name: '3', variable: '--space-3' },
  { name: '4', variable: '--space-4' },
  { name: '5', variable: '--space-5' },
  { name: '6', variable: '--space-6' },
  { name: '8', variable: '--space-8' },
  { name: '10', variable: '--space-10' },
  { name: '12', variable: '--space-12' },
  { name: '16', variable: '--space-16' },
  { name: '20', variable: '--space-20' },
];

function resolveValue(variable: string): string {
  const temp = document.createElement('div');
  temp.style.width = `var(${variable})`;
  document.documentElement.appendChild(temp);
  const value = getComputedStyle(temp).width;
  document.documentElement.removeChild(temp);
  return value;
}

export function FoundationSpacing() {
  const [resolved, setResolved] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const map = new Map<string, string>();
    for (const token of spacingTokens) {
      map.set(token.variable, resolveValue(token.variable));
    }
    setResolved(map);
  }, []);

  return (
    <main className="main-content">
      <div className="component-view">
        <div className="component-view__toolbar">
          <div className="component-view__name">
            <h2>Spacing</h2>
            <span className="component-view__tag">Foundations</span>
          </div>
        </div>
        <div className="foundation-tokens">
          <div className="foundation-tokens__section">
            <h3 className="foundation-tokens__section-title">Spacing Scale</h3>
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
                {spacingTokens.map((token) => {
                  const value = resolved.get(token.variable);
                  return (
                    <tr key={token.variable}>
                      <td className="foundation-tokens__table-name">{token.name}</td>
                      <td className="foundation-tokens__table-token"><code>{token.variable}</code></td>
                      <td className="foundation-tokens__table-value">{value ?? ''}</td>
                      <td>
                        <div
                          className="foundation-tokens__spacing-bar"
                          style={{ width: `var(${token.variable})` }}
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
