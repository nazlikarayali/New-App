import type { PropDoc } from '../../types/component';

interface PropTableProps {
  propDocs: PropDoc[];
}

function renderDescription(text: string) {
  // Simple inline markdown: **bold** and `code`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="prop-table__inline-code">{part.slice(1, -1)}</code>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function PropTable({ propDocs }: PropTableProps) {
  if (propDocs.length === 0) return null;

  return (
    <div className="prop-table">
      <h3 className="prop-table__title">Props</h3>
      <div className="prop-table__grid">
        <div className="prop-table__row prop-table__row--header">
          <div className="prop-table__cell">Prop</div>
          <div className="prop-table__cell">Type</div>
          <div className="prop-table__cell">Default</div>
          <div className="prop-table__cell">Description</div>
        </div>
        {propDocs.map((prop) => (
          <div className="prop-table__row" key={prop.name}>
            <div className="prop-table__cell">
              <code className="prop-table__prop-name">{prop.name}</code>
            </div>
            <div className="prop-table__cell">
              <code className="prop-table__type">{prop.type}</code>
            </div>
            <div className="prop-table__cell">
              <code className="prop-table__default">{prop.default}</code>
            </div>
            <div className="prop-table__cell prop-table__cell--desc">
              {renderDescription(prop.description)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
