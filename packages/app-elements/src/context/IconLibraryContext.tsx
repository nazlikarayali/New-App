import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { loadLibrary, type IconLibrary, type IconStyle } from '../utils/iconRegistry';

interface IconLibraryContextType {
  library: IconLibrary;
  iconStyle: IconStyle;
  setLibrary: (lib: IconLibrary) => void;
  setIconStyle: (style: IconStyle) => void;
}

const IconLibraryContext = createContext<IconLibraryContextType>({
  library: 'lucide',
  iconStyle: 'outline',
  setLibrary: () => {},
  setIconStyle: () => {},
});

export function IconLibraryProvider({ children }: { children: ReactNode }) {
  const [library, setLibraryState] = useState<IconLibrary>('lucide');
  const [iconStyle, setIconStyleState] = useState<IconStyle>('outline');

  const setLibrary = useCallback(async (lib: IconLibrary) => {
    await loadLibrary(lib, iconStyle);
    setLibraryState(lib);
  }, [iconStyle]);

  const setIconStyle = useCallback(async (style: IconStyle) => {
    await loadLibrary(library, style);
    setIconStyleState(style);
  }, [library]);

  useEffect(() => {
    loadLibrary('lucide', 'outline');
  }, []);

  return (
    <IconLibraryContext.Provider value={{ library, iconStyle, setLibrary, setIconStyle }}>
      {children}
    </IconLibraryContext.Provider>
  );
}

export function useIconLibrary() {
  return useContext(IconLibraryContext);
}

export type { IconLibrary, IconStyle };
