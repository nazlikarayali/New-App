import type { FC } from 'react';
import './ImageGallery.scss';

export type GalleryLayout = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export interface ImageGalleryProps {
  layout?: GalleryLayout;
  selected?: boolean;
  shrinked?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
}

// Sample placeholder images with different colors
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop',
];

// Grid definitions per layout
const LAYOUT_CONFIG: Record<GalleryLayout, {
  cols: string;
  rows: string;
  cells: { col: string; row: string }[];
  aspectRatio?: string;
}> = {
  // Layout 1: 1col × 2row — 2 images stacked
  '1': {
    cols: 'repeat(1, 1fr)',
    rows: 'repeat(2, 1fr)',
    cells: [
      { col: '1', row: '1' },
      { col: '1', row: '2' },
    ],
    aspectRatio: '1 / 2',
  },
  // Layout 2: 2col × 2row — 4 equal images
  '2': {
    cols: 'repeat(2, 1fr)',
    rows: 'repeat(2, 1fr)',
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1' },
      { col: '1', row: '2' },
      { col: '2', row: '2' },
    ],
  },
  // Layout 3: 3col × 2row — 6 equal images
  '3': {
    cols: 'repeat(3, 1fr)',
    rows: 'repeat(2, 1fr)',
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1' },
      { col: '3', row: '1' },
      { col: '1', row: '2' },
      { col: '2', row: '2' },
      { col: '3', row: '2' },
    ],
    aspectRatio: '3 / 2',
  },
  // Layout 4: left full height, right 2 stacked
  '4': {
    cols: 'repeat(2, 1fr)',
    rows: 'repeat(2, 1fr)',
    cells: [
      { col: '1', row: '1 / span 2' },
      { col: '2', row: '1' },
      { col: '2', row: '2' },
    ],
  },
  // Layout 5: right full height, left 2 stacked
  '5': {
    cols: 'repeat(2, 1fr)',
    rows: 'repeat(2, 1fr)',
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1 / span 2' },
      { col: '1', row: '2' },
    ],
  },
  // Layout 6: top full width, bottom 2 side by side
  '6': {
    cols: 'repeat(2, 1fr)',
    rows: 'repeat(2, 1fr)',
    cells: [
      { col: '1 / span 2', row: '1' },
      { col: '1', row: '2' },
      { col: '2', row: '2' },
    ],
  },
  // Layout 7: top 2 side by side, bottom full width
  '7': {
    cols: 'repeat(2, 1fr)',
    rows: 'repeat(2, 1fr)',
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1' },
      { col: '1 / span 2', row: '2' },
    ],
  },
  // Layout 8: 4×4 grid — top-left small, bottom-left big, top-right big, bottom-right small
  '8': {
    cols: 'repeat(4, 1fr)',
    rows: 'repeat(4, 1fr)',
    cells: [
      { col: '1 / span 2', row: '1' },
      { col: '1 / span 2', row: '2 / span 3' },
      { col: '3 / span 2', row: '1 / span 3' },
      { col: '3 / span 2', row: '4' },
    ],
  },
  // Layout 9: 4×4 grid — top-left big, top-right small, bottom-left small, bottom-right big
  '9': {
    cols: 'repeat(4, 1fr)',
    rows: 'repeat(4, 1fr)',
    cells: [
      { col: '1 / span 3', row: '1 / span 2' },
      { col: '1', row: '3 / span 2' },
      { col: '4', row: '1 / span 2' },
      { col: '2 / span 3', row: '3 / span 2' },
    ],
  },
};

export const ImageGallery: FC<ImageGalleryProps> = ({
  layout = '2',
  selected = false,
  shrinked = false,
  skeleton = false,
  skeletonAnimation = 'pulse',
}) => {
  const config = LAYOUT_CONFIG[layout];

  const rootClasses = [
    'jf-gallery',
    selected && 'jf-gallery--selected',
    shrinked && 'jf-gallery--shrinked',
  ].filter(Boolean).join(' ');

  const gridStyle = {
    gridTemplateColumns: config.cols,
    gridTemplateRows: config.rows,
    ...(config.aspectRatio ? { aspectRatio: config.aspectRatio } : {}),
  };

  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  if (skeleton) {
    return (
      <div
        className={rootClasses}
        style={{ ...gridStyle, background: 'var(--bg-surface)' }}
      >
        {config.cells.map((cell, i) => (
          <div
            key={i}
            className={`jf-gallery__cell jf-skeleton__bone ${animClass}`}
            style={{
              gridColumn: cell.col,
              gridRow: cell.row,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={rootClasses}
      style={gridStyle}
    >
      {config.cells.map((cell, i) => (
        <div
          key={i}
          className="jf-gallery__cell"
          style={{
            gridColumn: cell.col,
            gridRow: cell.row,
          }}
        >
          <img
            className="jf-gallery__img"
            src={SAMPLE_IMAGES[i % SAMPLE_IMAGES.length]}
            alt={`Gallery image ${i + 1}`}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
