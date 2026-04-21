import { ComponentRegistry } from '../../types/registry';
import { ImageGallery } from './ImageGallery';
import type { GalleryLayout } from './ImageGallery';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import galleryScss from './ImageGallery.scss?raw';

ComponentRegistry.register({
  id: 'image-gallery',
  name: 'Image Gallery',
  category: 'Media',
  icon: 'Images',

  variants: {
    Layout: {
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      default: '2',
    },
  },

  properties: [
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Skeleton', type: 'boolean', default: false },
  ],

  states: [],

  scss: galleryScss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: '--bg-fill → neutral-0' },
    { token: 'Cell BG', variable: '--bg-fill-hover', value: '#F3F3FE', description: '--bg-fill-hover → neutral-50 (placeholder)' },
  ],

  usage: `import { ImageGallery } from '@/components/ImageGallery';

// 2x2 equal grid (default)
<ImageGallery layout="2" />

// 3x2 grid (6 images)
<ImageGallery layout="3" />

// Left hero + 2 right stacked
<ImageGallery layout="4" />

// Top hero + 2 bottom
<ImageGallery layout="6" />

// Asymmetric 4-cell layout
<ImageGallery layout="9" />`,

  propDocs: [
    {
      name: 'layout',
      type: '"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"',
      default: '"2"',
      description:
        'Selects the grid layout. **1**: 1×2 vertical stack. **2**: 2×2 equal grid. **3**: 3×2 (6 cells). **4**: left hero + 2 right. **5**: right hero + 2 left. **6**: top hero + 2 bottom. **7**: 2 top + bottom hero. **8**: 4×4 asymmetric (diagonal small). **9**: 4×4 asymmetric (diagonal big).',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, applies a 2px `border-info` border.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, _states: StateValues): React.ReactNode {
    return (
      <ImageGallery
        layout={variants['Layout'] as GalleryLayout}
        selected={props['Selected'] as boolean}
        skeleton={props['Skeleton'] as boolean}
      />
    );
  },
});
