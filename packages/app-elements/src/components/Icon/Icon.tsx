import { type FC, useState, useEffect } from 'react';
import { useIconLibrary } from '../../context/IconLibraryContext';
import { resolveIcon, loadLibrary, type IconStyle } from '../../utils/iconRegistry';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  forceStyle?: IconStyle;
}

export const Icon: FC<IconProps> = ({ name, size = 20, className, forceStyle }) => {
  const { library, iconStyle } = useIconLibrary();
  const effectiveStyle = forceStyle ?? iconStyle;
  const [, setLoaded] = useState(0);

  // If forceStyle requires a different style than what's active, ensure it's loaded
  useEffect(() => {
    if (forceStyle && forceStyle !== iconStyle) {
      loadLibrary(library, forceStyle).then(() => setLoaded(v => v + 1));
    }
  }, [library, forceStyle, iconStyle]);

  if (!name || name === 'none') return null;
  const result = resolveIcon(name, library, effectiveStyle);
  if (!result) return null;
  const { component: IconComp } = result;
  return <IconComp size={size} className={className} />;
};
