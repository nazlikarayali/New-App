import { icons as lucideIcons } from 'lucide-react';
import { createElement, type ComponentType } from 'react';

export type IconLibrary = 'lucide' | 'phosphor' | 'tabler';
export type IconStyle = 'outline' | 'fill';

export const ICON_LIBRARIES: { value: IconLibrary; label: string; hasFill: boolean }[] = [
  { value: 'lucide', label: 'Lucide', hasFill: false },
  { value: 'phosphor', label: 'Phosphor', hasFill: true },
  { value: 'tabler', label: 'Tabler', hasFill: true },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComp = ComponentType<any>;

// Cross-library name mapping: Lucide canonical → library-native export name
const NAME_MAP: Record<string, Partial<Record<IconLibrary, string>>> = {
  // Navigation
  ArrowRight: { phosphor: 'ArrowRight', tabler: 'IconArrowRight' },
  ArrowLeft: { phosphor: 'ArrowLeft', tabler: 'IconArrowLeft' },
  ArrowUp: { phosphor: 'ArrowUp', tabler: 'IconArrowUp' },
  ArrowDown: { phosphor: 'ArrowDown', tabler: 'IconArrowDown' },
  ArrowUpRight: { phosphor: 'ArrowUpRight', tabler: 'IconArrowUpRight' },
  ChevronRight: { phosphor: 'CaretRight', tabler: 'IconChevronRight' },
  ChevronLeft: { phosphor: 'CaretLeft', tabler: 'IconChevronLeft' },
  ChevronDown: { phosphor: 'CaretDown', tabler: 'IconChevronDown' },
  ChevronUp: { phosphor: 'CaretUp', tabler: 'IconChevronUp' },
  ExternalLink: { phosphor: 'ArrowSquareOut', tabler: 'IconExternalLink' },

  // Actions
  Plus: { phosphor: 'Plus', tabler: 'IconPlus' },
  Minus: { phosphor: 'Minus', tabler: 'IconMinus' },
  X: { phosphor: 'X', tabler: 'IconX' },
  Check: { phosphor: 'Check', tabler: 'IconCheck' },
  Search: { phosphor: 'MagnifyingGlass', tabler: 'IconSearch' },
  Edit: { phosphor: 'PencilSimple', tabler: 'IconEdit' },
  Trash2: { phosphor: 'Trash', tabler: 'IconTrash' },
  Copy: { phosphor: 'Copy', tabler: 'IconCopy' },
  Download: { phosphor: 'DownloadSimple', tabler: 'IconDownload' },
  Upload: { phosphor: 'UploadSimple', tabler: 'IconUpload' },
  Share: { phosphor: 'ShareNetwork', tabler: 'IconShare' },
  Send: { phosphor: 'PaperPlaneRight', tabler: 'IconSend' },
  RefreshCw: { phosphor: 'ArrowsClockwise', tabler: 'IconRefresh' },
  Filter: { phosphor: 'Funnel', tabler: 'IconFilter' },
  MoreHorizontal: { phosphor: 'DotsThree', tabler: 'IconDots' },
  MoreVertical: { phosphor: 'DotsThreeVertical', tabler: 'IconDotsVertical' },
  Save: { phosphor: 'FloppyDisk', tabler: 'IconDeviceFloppy' },
  Undo: { phosphor: 'ArrowCounterClockwise', tabler: 'IconArrowBackUp' },

  // Files & Data
  CirclePlus: { phosphor: 'PlusCircle', tabler: 'IconCirclePlus' },
  FileText: { phosphor: 'FileText', tabler: 'IconFileText' },
  ClipboardList: { phosphor: 'ClipboardText', tabler: 'IconClipboardList' },
  Asterisk: { phosphor: 'Asterisk', tabler: 'IconAsterisk' },
  CloudUpload: { phosphor: 'CloudArrowUp', tabler: 'IconCloudUpload' },
  Table2: { phosphor: 'Table', tabler: 'IconTable' },
  FilePenLine: { phosphor: 'PencilLine', tabler: 'IconFilePencil' },
  File: { phosphor: 'File', tabler: 'IconFile' },
  Folder: { phosphor: 'Folder', tabler: 'IconFolder' },
  Database: { phosphor: 'Database', tabler: 'IconDatabase' },
  BookOpen: { phosphor: 'BookOpen', tabler: 'IconBook' },
  Bookmark: { phosphor: 'BookmarkSimple', tabler: 'IconBookmark' },
  Paperclip: { phosphor: 'Paperclip', tabler: 'IconPaperclip' },
  Link: { phosphor: 'Link', tabler: 'IconLink' },
  Archive: { phosphor: 'Archive', tabler: 'IconArchive' },

  // Communication
  MessageCircle: { phosphor: 'ChatCircle', tabler: 'IconMessageCircle' },
  MessageSquare: { phosphor: 'ChatSquare', tabler: 'IconMessage' },
  Mail: { phosphor: 'Envelope', tabler: 'IconMail' },
  Phone: { phosphor: 'Phone', tabler: 'IconPhone' },
  Video: { phosphor: 'VideoCamera', tabler: 'IconVideo' },
  Bell: { phosphor: 'Bell', tabler: 'IconBell' },
  Globe: { phosphor: 'Globe', tabler: 'IconWorld' },
  AtSign: { phosphor: 'At', tabler: 'IconAt' },
  Inbox: { phosphor: 'Tray', tabler: 'IconInbox' },

  // People
  User: { phosphor: 'User', tabler: 'IconUser' },
  Users: { phosphor: 'Users', tabler: 'IconUsers' },
  UserPlus: { phosphor: 'UserPlus', tabler: 'IconUserPlus' },

  // Social
  Heart: { phosphor: 'Heart', tabler: 'IconHeart' },
  Star: { phosphor: 'Star', tabler: 'IconStar' },
  ThumbsUp: { phosphor: 'ThumbsUp', tabler: 'IconThumbUp' },

  // Social Media
  Youtube: { phosphor: 'YoutubeLogo', tabler: 'IconBrandYoutube' },
  Twitter: { phosphor: 'TwitterLogo', tabler: 'IconBrandTwitter' },
  Linkedin: { phosphor: 'LinkedinLogo', tabler: 'IconBrandLinkedin' },
  Instagram: { phosphor: 'InstagramLogo', tabler: 'IconBrandInstagram' },
  Facebook: { phosphor: 'FacebookLogo', tabler: 'IconBrandFacebook' },
  Github: { phosphor: 'GithubLogo', tabler: 'IconBrandGithub' },

  // Commerce
  ShoppingCart: { phosphor: 'ShoppingCart', tabler: 'IconShoppingCart' },
  CreditCard: { phosphor: 'CreditCard', tabler: 'IconCreditCard' },
  DollarSign: { phosphor: 'CurrencyDollar', tabler: 'IconCurrencyDollar' },
  Package: { phosphor: 'Package', tabler: 'IconPackage' },
  Tag: { phosphor: 'Tag', tabler: 'IconTag' },
  Gift: { phosphor: 'Gift', tabler: 'IconGift' },

  IdentificationCard: { phosphor: 'IdentificationCard', tabler: 'IconIdBadge2' },

  // Interface
  Home: { phosphor: 'House', tabler: 'IconHome' },
  Menu: { phosphor: 'List', tabler: 'IconMenu2' },
  Settings: { phosphor: 'Gear', tabler: 'IconSettings' },
  Sliders: { phosphor: 'SlidersHorizontal', tabler: 'IconAdjustments' },
  Eye: { phosphor: 'Eye', tabler: 'IconEye' },
  EyeOff: { phosphor: 'EyeSlash', tabler: 'IconEyeOff' },
  Lock: { phosphor: 'Lock', tabler: 'IconLock' },
  Unlock: { phosphor: 'LockOpen', tabler: 'IconLockOpen' },
  Key: { phosphor: 'Key', tabler: 'IconKey' },
  Shield: { phosphor: 'Shield', tabler: 'IconShield' },
  AlertCircle: { phosphor: 'WarningCircle', tabler: 'IconAlertCircle' },
  AlertTriangle: { phosphor: 'Warning', tabler: 'IconAlertTriangle' },
  Info: { phosphor: 'Info', tabler: 'IconInfoCircle' },
  HelpCircle: { phosphor: 'Question', tabler: 'IconHelp' },
  CircleCheck: { phosphor: 'CheckCircle', tabler: 'IconCircleCheck' },
  XCircle: { phosphor: 'XCircle', tabler: 'IconCircleX' },

  // Layout & Design
  AlignJustify: { phosphor: 'TextAlignJustify', tabler: 'IconAlignJustified' },
  List: { phosphor: 'List', tabler: 'IconList' },
  AlignLeft: { phosphor: 'TextAlignLeft', tabler: 'IconAlignLeft' },
  AlignCenter: { phosphor: 'TextAlignCenter', tabler: 'IconAlignCenter' },
  AlignRight: { phosphor: 'TextAlignRight', tabler: 'IconAlignRight' },
  Grid2x2: { phosphor: 'GridFour', tabler: 'IconLayoutGrid' },
  Palette: { phosphor: 'Palette', tabler: 'IconPalette' },
  Type: { phosphor: 'TextAa', tabler: 'IconTypography' },
  Contrast: { phosphor: 'CircleHalf', tabler: 'IconContrast' },
  Layers: { phosphor: 'Stack', tabler: 'IconStack2' },
  Layout: { phosphor: 'Layout', tabler: 'IconLayout' },
  Columns: { phosphor: 'Columns', tabler: 'IconColumns' },
  Maximize: { phosphor: 'ArrowsOut', tabler: 'IconMaximize' },
  Minimize: { phosphor: 'ArrowsIn', tabler: 'IconMinimize' },
  Move: { phosphor: 'ArrowsOutCardinal', tabler: 'IconArrowsMove' },
  Pointer: { phosphor: 'Cursor', tabler: 'IconPointer' },

  // Dev
  Code: { phosphor: 'Code', tabler: 'IconCode' },
  Terminal: { phosphor: 'Terminal', tabler: 'IconTerminal2' },
  Zap: { phosphor: 'Lightning', tabler: 'IconBolt' },
  Bug: { phosphor: 'Bug', tabler: 'IconBug' },

  // Media
  Image: { phosphor: 'Image', tabler: 'IconPhoto' },
  Camera: { phosphor: 'Camera', tabler: 'IconCamera' },
  Play: { phosphor: 'Play', tabler: 'IconPlayerPlay' },
  Pause: { phosphor: 'Pause', tabler: 'IconPlayerPause' },
  Music: { phosphor: 'MusicNotes', tabler: 'IconMusic' },
  Mic: { phosphor: 'Microphone', tabler: 'IconMicrophone' },
  Volume2: { phosphor: 'SpeakerHigh', tabler: 'IconVolume' },

  // Nature & Time
  Calendar: { phosphor: 'Calendar', tabler: 'IconCalendar' },
  Clock: { phosphor: 'Clock', tabler: 'IconClock' },
  MapPin: { phosphor: 'MapPin', tabler: 'IconMapPin' },
  Navigation: { phosphor: 'NavigationArrow', tabler: 'IconNavigation' },
  Sun: { phosphor: 'Sun', tabler: 'IconSun' },
  Moon: { phosphor: 'Moon', tabler: 'IconMoon' },
  Cloud: { phosphor: 'Cloud', tabler: 'IconCloud' },
  Wifi: { phosphor: 'WifiHigh', tabler: 'IconWifi' },

  // Misc
  Sparkles: { phosphor: 'Sparkle', tabler: 'IconSparkles' },
  Lightbulb: { phosphor: 'Lightbulb', tabler: 'IconBulb' },
  Flag: { phosphor: 'Flag', tabler: 'IconFlag' },
  Award: { phosphor: 'Trophy', tabler: 'IconAward' },
  Printer: { phosphor: 'Printer', tabler: 'IconPrinter' },
  QrCode: { phosphor: 'QrCode', tabler: 'IconQrcode' },
};

// Tabler filled name mapping: outline name → filled name
// Tabler filled icons use "Filled" suffix: IconHeart → IconHeartFilled
const TABLER_FILLED_MAP: Record<string, string> = {};
for (const [, mappings] of Object.entries(NAME_MAP)) {
  const tablerName = mappings.tabler;
  if (tablerName) {
    TABLER_FILLED_MAP[tablerName] = tablerName + 'Filled';
  }
}

// Build reverse maps: library-native-name → lucide-canonical-name
const reverseMaps: Partial<Record<IconLibrary, Record<string, string>>> = {};
for (const [lucideName, mappings] of Object.entries(NAME_MAP)) {
  for (const [lib, nativeName] of Object.entries(mappings)) {
    const libKey = lib as IconLibrary;
    if (!reverseMaps[libKey]) reverseMaps[libKey] = {};
    reverseMaps[libKey]![nativeName] = lucideName;
  }
}

// Cached registries — pre-load lucide so icons render on first frame
const registryCache: Partial<Record<string, Record<string, IconComp>>> = {
  'lucide:outline': lucideIcons as unknown as Record<string, IconComp>,
};

function cacheKey(lib: IconLibrary, style: IconStyle = 'outline'): string {
  return `${lib}:${style}`;
}

function isIconExport(key: string, val: unknown): boolean {
  if (!/^[A-Z]/.test(key)) return false;
  if (typeof val === 'function') return true;
  if (typeof val === 'object' && val !== null && '$$typeof' in val) return true;
  return false;
}

const NON_ICON_EXPORTS = new Set([
  'IconContext', 'IconBase', 'SSR', 'IconWeight',
  'createReactComponent', 'default',
]);

export async function loadLibrary(lib: IconLibrary, style: IconStyle = 'outline'): Promise<void> {
  const key = cacheKey(lib, style);
  if (registryCache[key]) return;

  switch (lib) {
    case 'lucide':
      registryCache[key] = lucideIcons as unknown as Record<string, IconComp>;
      break;
    case 'phosphor': {
      // Phosphor uses weight prop for fill — load same module, wrap with weight
      const mod = await import('@phosphor-icons/react');
      const icons: Record<string, IconComp> = {};
      for (const [iconKey, val] of Object.entries(mod)) {
        if (isIconExport(iconKey, val) && !NON_ICON_EXPORTS.has(iconKey)) {
          if (style === 'fill') {
            // Wrap with weight="fill"
            const BaseIcon = val as IconComp;
            const FilledIcon: IconComp = (props) => createElement(BaseIcon, { ...props, weight: 'fill' });
            FilledIcon.displayName = `${iconKey}Fill`;
            icons[iconKey] = FilledIcon;
          } else {
            icons[iconKey] = val as IconComp;
          }
        }
      }
      registryCache[key] = icons;
      break;
    }
    case 'tabler': {
      const mod = await import('@tabler/icons-react');
      const allExports = Object.entries(mod);
      const icons: Record<string, IconComp> = {};

      if (style === 'fill') {
        // First collect all filled icons
        const filledIcons: Record<string, IconComp> = {};
        for (const [iconKey, val] of allExports) {
          if (isIconExport(iconKey, val) && iconKey.startsWith('Icon') && iconKey.endsWith('Filled') && !NON_ICON_EXPORTS.has(iconKey)) {
            filledIcons[iconKey] = val as IconComp;
          }
        }
        // For each outline icon, use filled if available, otherwise outline
        for (const [iconKey, val] of allExports) {
          if (isIconExport(iconKey, val) && iconKey.startsWith('Icon') && iconKey.length > 4 && !iconKey.endsWith('Filled') && !NON_ICON_EXPORTS.has(iconKey)) {
            const filledName = iconKey + 'Filled';
            icons[iconKey] = (filledIcons[filledName] || val) as IconComp;
          }
        }
      } else {
        for (const [iconKey, val] of allExports) {
          if (isIconExport(iconKey, val) && iconKey.startsWith('Icon') && iconKey.length > 4 && !iconKey.endsWith('Filled') && !NON_ICON_EXPORTS.has(iconKey)) {
            icons[iconKey] = val as IconComp;
          }
        }
      }
      registryCache[key] = icons;
      break;
    }
  }
}

export function resolveIcon(
  lucideName: string,
  library: IconLibrary,
  style: IconStyle = 'outline',
): { component: IconComp } | null {
  if (!lucideName || lucideName === 'none') return null;

  const key = cacheKey(library, style);
  const registry = registryCache[key];

  // If library isn't loaded yet, fall back to Lucide
  if (!registry) {
    const comp = registryCache['lucide:outline']?.[lucideName] as IconComp | undefined;
    return comp ? { component: comp } : null;
  }

  // For lucide, direct lookup
  if (library === 'lucide') {
    const comp = registry[lucideName];
    return comp ? { component: comp } : null;
  }

  // Check cross-library mapping
  const mapping = NAME_MAP[lucideName];
  if (mapping?.[library]) {
    const comp = registry[mapping[library]!];
    if (comp) return { component: comp };
  }

  // Fallback: try same name in the library registry
  if (registry[lucideName]) {
    return { component: registry[lucideName] };
  }

  // Final fallback: Lucide
  const lucideComp = registryCache['lucide:outline']?.[lucideName] as IconComp | undefined;
  return lucideComp ? { component: lucideComp } : null;
}

// Get all icons for IconPicker
export function getIconsForPicker(library: IconLibrary, style: IconStyle = 'outline'): Record<string, IconComp> {
  const key = cacheKey(library, style);
  const registry = registryCache[key];
  if (!registry) return (registryCache['lucide:outline'] || {}) as Record<string, IconComp>;
  if (library === 'lucide') return registry;

  const result: Record<string, IconComp> = {};
  const reverseMap = reverseMaps[library] || {};

  for (const [nativeName, component] of Object.entries(registry)) {
    const lucName = reverseMap[nativeName];
    result[lucName || nativeName] = component;
  }

  return result;
}
