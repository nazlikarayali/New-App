import { useState, type FC, type DragEvent } from 'react';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button';
import './Document.scss';

export type DocumentAlignment = 'Left' | 'Center' | 'Right';
export type DocumentSize = 'Normal' | 'Large';

export interface DocumentProps {
  alignment?: DocumentAlignment;
  size?: DocumentSize;
  fileName?: string;
  description?: string;
  showIcon?: boolean;
  hasFile?: boolean;
  selected?: boolean;
  shrinked?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
}

export const Document: FC<DocumentProps> = ({
  alignment = 'Left',
  size = 'Normal',
  fileName = 'File Name',
  description = 'Add Description',
  showIcon = true,
  hasFile = true,
  selected = false,
  shrinked = false,
  skeleton = false,
  skeletonAnimation = 'pulse',
}) => {
  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';
  const [isDragging, setIsDragging] = useState(false);

  // =====================
  // Skeleton state
  // =====================
  if (skeleton && hasFile) {
    const isCenter = alignment === 'Center';
    const isNormal = size === 'Normal';
    const iconSize = isNormal ? 60 : 100;

    const rootClasses = [
      'jf-doc',
      isCenter ? 'jf-doc--center' : 'jf-doc--horizontal',
      alignment === 'Right' && 'jf-doc--right',
      shrinked && 'jf-doc--shrinked',
    ].filter(Boolean).join(' ');

    return (
      <div className={rootClasses}>
        {showIcon && (
          <div className={`jf-doc__icon jf-skeleton__bone ${animClass}`} style={{ width: iconSize, height: iconSize }} />
        )}
        <div className="jf-doc__content">
          <div className={`jf-skeleton__line jf-skeleton__line--lg ${animClass}`} style={{ width: '60%' }} />
          <div className={`jf-skeleton__line jf-skeleton__line--sm ${animClass}`} style={{ width: '80%' }} />
        </div>
      </div>
    );
  }

  if (skeleton && !hasFile) {
    const builderClasses = [
      'jf-doc-builder',
      shrinked && 'jf-doc-builder--shrinked',
    ].filter(Boolean).join(' ');

    return (
      <div className={builderClasses}>
        <div className={`jf-skeleton__bone ${animClass}`} style={{ width: 32, height: 32, borderRadius: '50%' }} />
        <div className={`jf-skeleton__line jf-skeleton__line--lg ${animClass}`} style={{ width: '40%' }} />
        <div className={`jf-skeleton__line jf-skeleton__line--sm ${animClass}`} style={{ width: '60%' }} />
      </div>
    );
  }

  // =====================
  // Builder state (no file uploaded)
  // =====================
  if (!hasFile) {
    const builderClasses = [
      'jf-doc-builder',
      isDragging && 'jf-doc-builder--active',
      selected && 'jf-doc-builder--selected',
      shrinked && 'jf-doc-builder--shrinked',
    ].filter(Boolean).join(' ');

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    return (
      <div
        className={builderClasses}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isDragging ? (
          <>
            <Icon name="CirclePlus" size={20} className="jf-doc-builder__drop-icon" />
            <span className="jf-doc-builder__hint">DRAG AND DROP HERE</span>
          </>
        ) : (
          <>
            <Icon name="FileText" size={32} className="jf-doc-builder__icon" />
            <Button
              variant="Default"
              corner="Default"
              size="Small"
              label="Upload File"
              leftIcon="Upload"
              rightIcon="none"
              shrinked
            />
            <span className="jf-doc-builder__hint">OR DRAG AND DROP HERE</span>
          </>
        )}
      </div>
    );
  }

  // =====================
  // Document with file
  // =====================
  const isCenter = alignment === 'Center';
  const isNormal = size === 'Normal';

  const iconSize = isNormal ? 60 : 100;
  const iconInner = isNormal ? 32 : 52;

  const rootClasses = [
    'jf-doc',
    isCenter ? 'jf-doc--center' : 'jf-doc--horizontal',
    alignment === 'Right' && 'jf-doc--right',
    selected && 'jf-doc--selected',
    shrinked && 'jf-doc--shrinked',
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      {showIcon && (
        <div className="jf-doc__icon" style={{ width: iconSize, height: iconSize }}>
          <Icon name="FileText" size={iconInner} />
        </div>
      )}
      <div className="jf-doc__content">
        <div className={`jf-doc__title jf-doc__title--${isNormal ? 'normal' : 'large'}`}>
          {fileName}
        </div>
        <div className={`jf-doc__desc jf-doc__desc--${isNormal ? 'normal' : 'large'}`}>
          {description}
        </div>
      </div>
    </div>
  );
};

export default Document;
