import { useEffect, useState } from 'react';

export interface IconProps {
  name: string;
  category?: string;
  size?: number;
  className?: string;
}

const cache = new Map<string, string>();

export function Icon({
  name,
  category = 'general',
  size = 24,
  className,
}: IconProps) {
  const key = `${category}/${name}`;
  const [svg, setSvg] = useState(() => cache.get(key) || '');

  useEffect(() => {
    if (cache.has(key)) {
      setSvg(cache.get(key)!);
      return;
    }

    const url = new URL(
      `../../assets/icons/${category}/${name}.svg`,
      import.meta.url
    ).href;

    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        cache.set(key, text);
        setSvg(text);
      });
  }, [key, category, name]);

  return (
    <span
      className={`jf-icon ${className || ''}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
