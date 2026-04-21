import { useState, useEffect } from 'react';
import { SearchInput } from '../../SearchInput';

const AI_ICONS = [
  'ai-arrows-rotate', 'ai-atom', 'ai-calculator-filled', 'ai-chatbot-filled',
  'ai-color', 'ai-envelope-filled', 'ai-face-smile-filled', 'ai-file-filled',
  'ai-file-magnifying-glass-filled', 'ai-filled', 'ai-image-filled',
  'ai-language-text', 'ai-language', 'ai-message-filled', 'ai-pencil-filled',
  'ai-presentation-filled', 'ai-product-agent-color', 'ai-product-agent-color-border',
  'ai-product-agent-filled', 'ai-product-agent-mono', 'ai-product-conversation-color',
  'ai-product-conversation-color-border', 'ai-product-conversation-filled',
  'ai-product-conversation-mono', 'ai-square-dashed', 'ai-square-lines-filled',
  'ai-squares-filled', 'ai-tag-filled', 'ai-text', 'ai-voice', 'user-ai',
];

const ALERTS_FEEDBACK_ICONS = [
  'bell-diagonal-filled', 'bell-diagonal-ringing-filled', 'bell-diagonal-ringing',
  'bell-diagonal', 'bell-minus-filled', 'bell-minus', 'bell-plus-filled', 'bell-plus',
  'bell-slash-filled', 'bell-slash', 'bell-vertical-filled', 'bell-vertical',
  'megaphone-filled', 'megaphone', 'notification-filled', 'notification-message-filled',
  'notification-message', 'notification-text-filled', 'notification-text', 'notification',
  'thumbs-down', 'thumbs-up-down', 'thumbs-up',
];

const ARROWS_ICONS = [
  'angle-down-circle-filled', 'angle-down-square-filled', 'angle-down',
  'angle-left-circle-filled', 'angle-left-square-filled', 'angle-left',
  'angle-right-circle-filled', 'angle-right-square-filled', 'angle-right',
  'angle-up-circle-filled', 'angle-up-square-filled', 'angle-up',
  'angles-down', 'angles-left', 'angles-right', 'angles-selector-horizontal',
  'angles-selector-slash-horizontal', 'angles-selector-vertical', 'angles-up',
  'arrow-down-circle-filled', 'arrow-down-circle', 'arrow-down-from-line',
  'arrow-down-left-circle', 'arrow-down-left-square', 'arrow-down-left',
  'arrow-down-rectangles', 'arrow-down-right-circle', 'arrow-down-right-square',
  'arrow-down-right', 'arrow-down-square-filled', 'arrow-down-square',
  'arrow-down-to-bracket', 'arrow-down-to-line-rectangles', 'arrow-down-to-line',
  'arrow-down-to-lines', 'arrow-down-to-square', 'arrow-down',
  'arrow-flip-left', 'arrow-flip-right', 'arrow-left-circle-filled',
  'arrow-left-circle', 'arrow-left-square-filled', 'arrow-left-square',
  'arrow-left-to-line', 'arrow-left', 'arrow-reverse-left', 'arrow-reverse-right',
  'arrow-right-circle-filled', 'arrow-right-circle', 'arrow-right-from-bracket',
  'arrow-right-from-square', 'arrow-right-square-filled', 'arrow-right-square',
  'arrow-right-to-bracket', 'arrow-right-to-line', 'arrow-right-to-square',
  'arrow-right', 'arrow-rotate-left', 'arrow-rotate-right',
  'arrow-turn-down-left', 'arrow-up-circle-filled', 'arrow-up-circle',
  'arrow-up-from-bracket', 'arrow-up-from-line', 'arrow-up-from-square',
  'arrow-up-left-circle', 'arrow-up-left-square', 'arrow-up-left',
  'arrow-up-rectangles', 'arrow-up-right-circle', 'arrow-up-right-from-square-sm',
  'arrow-up-right-from-square', 'arrow-up-right-square', 'arrow-up-right',
  'arrow-up-square-filled', 'arrow-up-square', 'arrow-up-to-line-rectangles',
  'arrow-up-to-line', 'arrow-up', 'arrows-4way-from-center', 'arrows-down',
  'arrows-from-center', 'arrows-left-right', 'arrows-left', 'arrows-right',
  'arrows-rotate-slash', 'arrows-rotate-xmark', 'arrows-rotate',
  'arrows-switch-curly-horizontal', 'arrows-switch-horizontal-reverse',
  'arrows-switch-horizontal', 'arrows-switch-vertical-reverse',
  'arrows-switch-vertical', 'arrows-to-center', 'arrows-to-square',
  'arrows-up-down', 'arrows-up', 'caret-down-bars', 'caret-down-bold-filled',
  'caret-down-squares', 'caret-down', 'caret-left-bold-filled', 'caret-left',
  'caret-right-bold-filled', 'caret-right-squares', 'caret-right',
  'caret-turn-down-left-bold-filled', 'caret-up-bold-filled', 'caret-up',
  'carets-from-center', 'carets-switch-horizontal-reverse',
  'carets-switch-horizontal-square-filled', 'carets-switch-horizontal',
  'carets-switch-vertical-reverse', 'carets-switch-vertical', 'carets-to-center',
  'carret-left-bars-square-filled', 'chevron-down', 'chevron-left',
  'chevron-right', 'chevron-up', 'turn-arrow-left-filled', 'turn-arrow-right-filled',
  'turn-arrow-short-right-filled', 'turn-arrows-left-filled',
];

const COMMUNICATION_ICONS = [
  'annotation-check-filled', 'annotation-ellipsis-filled', 'annotation-exclamation-filled',
  'annotation-filled', 'annotation-info-filled', 'annotation-plus-filled',
  'annotation-question-filled', 'annotation-xmark-filled',
  'chat-voice-phone-whatsapp-filled', 'earth-phone-filled',
  'envelope-closed-bell-diagonal-filled', 'envelope-closed-check-filled',
  'envelope-closed-filled', 'envelope-closed-xmark-filled', 'envelope-form-filled',
  'envelope-opened-filled', 'headset', 'inbox-arrow-down-filled',
  'inbox-arrow-up-filled', 'inbox-filled', 'inbox-xmark-filled',
  'message-check-filled', 'message-ellipsis-pencil-filled', 'message-exclamation-filled',
  'message-filled', 'message-minus-filled', 'message-plus-filled',
  'message-question-filled', 'message-smile-filled', 'message-star-filled',
  'message-xmark-filled', 'messages-filled', 'paper-plane-diagonal-filled',
  'paper-plane-diagonal-plus-filled', 'paper-plane-filled',
  'phone-arrow-down-left-filled', 'phone-arrow-up-right-filled',
  'phone-earth-filled', 'phone-filled', 'phone-pause-filled', 'phone-plus-filled',
  'phone-ringing-filled', 'phone-rotary-filled', 'phone-slash-filled',
  'phone-xmark-filled', 'rectangle-circle-filled', 'volume-filled',
  'volume-slash-filled', 'volume-xmark-filled',
];

const DOCUMENTS_ICONS = [
  'document-avi-filled', 'document-bmp-filled', 'document-clock-filled',
  'document-css-filled', 'document-csv-filled', 'document-doc-filled',
  'document-docx-filled', 'document-flv-filled', 'document-gif-filled',
  'document-html-filled', 'document-image-filled', 'document-jf-sign-filled',
  'document-jpeg-filled', 'document-jpg-filled', 'document-json-filled',
  'document-list-bullet-filled', 'document-mp3-filled', 'document-mp4-filled',
  'document-mpg-filled', 'document-music-filled', 'document-ogg-filled',
  'document-pdf-filled', 'document-pen-filled', 'document-play-filled',
  'document-png-filled', 'document-ppt-filled', 'document-rtf-filled',
  'document-simple-filled', 'document-table-filled', 'document-tif-filled',
  'document-tiff-filled', 'document-txt-filled', 'document-wav-filled',
  'document-webm-filled', 'document-wma-filled', 'document-xls-filled',
  'document-xlsx-filled', 'document-zipper-filled',
];

const EDITOR_ICONS = [
  'align-text-center', 'align-text-justify', 'align-text-left', 'align-text-right',
  'arrow-pointer-box-filled', 'arrow-pointer-click-filled', 'arrow-pointer-filled',
  'arrow-pointer-simple-filled', 'bezier-curve', 'bold-square-filled', 'bold',
  'broom', 'brush-filled', 'carets-to-dotted-line', 'command', 'contrast-filled',
  'corner-circle', 'corner-round', 'corner-square', 'crop', 'draw-perspective',
  'droplet-filled', 'eraser-filled', 'eye-dropper-filled', 'finger-circle',
  'flow-fork-corner-line', 'flow-fork-horizontal-radius-line', 'flow-fork-horizontal',
  'flow-fork-straight-line', 'flow-fork-vertical-radius-line', 'flow-fork-vertical',
  'hand', 'header-filled', 'heading-square-filled', 'heading', 'indent-left',
  'indent-right', 'italic-square-filled', 'italic', 'line-height', 'list-bullet',
  'list-check', 'list-comma', 'list-number', 'list-star-lock', 'list-star',
  'options-filled', 'paint-bucket-filled', 'paint-roller-diagonal-filled',
  'paint-roller-vertical-filled', 'paintbrush-filled', 'paintbrush', 'palette-filled',
  'paragraph-square-filled', 'paragraph-wrap', 'pen-filled', 'pen-minus',
  'pen-plus-filled', 'pen-plus', 'pen-sign-filled', 'pen', 'pencil-filled',
  'pencil-line-filled', 'pencil-line', 'pencil-tip-filled', 'pencil-wave-filled',
  'pencil-wave', 'pencil', 'print-xmark-filled', 'print-xmark', 'printer-filled',
  'printer', 'scale-arrow-filled', 'scale-filled', 'scissors-cut', 'scissors',
  'squares-wave', 'strikethrough-square-filled', 'subscript', 'subtitles-filled',
  'subtitles-slash-filled', 'subtitles', 'text-color', 'text-size',
  'type-square-filled', 'type', 'underbar-square-filled', 'underbar',
  'underline-square-filled', 'underline', 'wand-magic-filled',
];

const FINANCE_ICONS = [
  'badge-percent-filled', 'badge-percent', 'bag-shopping', 'basket-shopping-filled',
  'box-filled', 'briefcase-filled', 'calculator-filled', 'calculator-square-filled',
  'cart-shopping-filled', 'coins-filled', 'coins-hand', 'coins-stacked-filled',
  'credit-card-arrow-down-center-filled', 'credit-card-arrow-down-center',
  'credit-card-arrow-down-filled', 'credit-card-arrow-down',
  'credit-card-arrow-up-center-filled', 'credit-card-arrow-up-center',
  'credit-card-arrow-up-filled', 'credit-card-arrow-up', 'credit-card-check-filled',
  'credit-card-check', 'credit-card-filled', 'credit-card-lock-filled',
  'credit-card-lock', 'credit-card-magnifying-glass-filled',
  'credit-card-magnifying-glass', 'credit-card-minus-filled', 'credit-card-minus',
  'credit-card-pencil-filled', 'credit-card-pencil', 'credit-card-plus-filled',
  'credit-card-plus', 'credit-card-refresh-filled', 'credit-card-refresh',
  'credit-card-shield-filled', 'credit-card-shield', 'credit-card-xmark-filled',
  'credit-card-xmark', 'credit-card', 'diamond', 'dollar-refresh', 'dollar-sign',
  'euro-sign', 'free-filled', 'gift-filled', 'gift', 'landmark-filled',
  'money-bill-filled', 'piggy-bank', 'pound-sign', 'receipt-check', 'receipt',
  'ruble-sign', 'sack-dollar-filled', 'sack-filled', 'sack-percent-filled',
  'scale-unbalanced', 'tag-filled', 'tag-percent-filled', 'tag', 'tags-filled',
  'tags', 'tl-sign', 'yen-sign',
];

const FORMS_FILES_ICONS = [
  'clipboard-arrow-down-filled', 'clipboard-arrow-up-filled', 'clipboard-check-filled',
  'clipboard-filled', 'clipboard-list-filled', 'clipboard-minus-filled',
  'clipboard-paperclip-filled', 'clipboard-plus-filled', 'clipboard-xmark-filled',
  'file-arrow-down-filled', 'file-arrow-flip-right-filled', 'file-arrow-up-filled',
  'file-check-filled', 'file-dollar-sign-filled', 'file-ellipsis-filled', 'file-filled',
  'file-lock-filled', 'file-magnifying-glass-filled', 'file-minus-filled',
  'file-paperclip-filled', 'file-pencil-filled', 'file-plus-filled',
  'file-question-filled', 'file-shield-filled', 'file-xmark-filled',
  'folder-ban-filled', 'folder-broken-filled', 'folder-caret-down-filled',
  'folder-caret-left-filled', 'folder-caret-right-filled', 'folder-caret-up-filled',
  'folder-check-filled', 'folder-file-filled', 'folder-filled',
  'folder-magnifying-glass-filled', 'folder-minus-filled', 'folder-paperclip-filled',
  'folder-pencil-filled', 'folder-plus-filled', 'folder-question-filled',
  'folder-shield-filled', 'folder-xmark-filled', 'form-arrow-down-filled',
  'form-arrow-left-filled', 'form-arrow-right-filled', 'form-arrow-up-filled',
  'form-card-filled', 'form-check-filled', 'form-code-filled',
  'form-exclamation-filled', 'form-filled', 'form-magnifying-glass-filled',
  'form-paperclip-filled', 'form-pen-check-filled', 'form-pencil-filled',
  'form-plus-filled', 'form-pointer-simple-filled', 'form-report-filled',
  'form-trash-filled', 'form-xmark-filled', 'form-zero-filled', 'ftp-filled',
  'pages-filled', 'paper-arrow-down-filled', 'paper-arrow-up-filled',
  'paper-broken-filled', 'paper-check-filled', 'paper-ellipsis-filled', 'paper-filled',
  'paper-image-filled', 'paper-lock-filled', 'paper-magnifying-glass-filled',
  'paper-minus-filled', 'paper-paperclip-filled', 'paper-pencil-filled',
  'paper-plus-filled', 'paper-question-filled', 'paper-report-filled',
  'paper-shield-filled', 'paperclip-diagonal', 'paperclip-vertical', 'scroll',
  'sticker-filled',
];

const GENERAL_ICONS = [
  'anchor', 'asterisk', 'at', 'badge-check-filled', 'badge-number-filled', 'ban',
  'bars-filter', 'bars-progress-fille', 'bars-thin', 'bars', 'bell-concierge-filled',
  'bookmark-check-filled', 'bookmark-filled', 'bookmark-minus-filled',
  'bookmark-plus-filled', 'bookmark-xmark-filled', 'box-archive-arrow-down-filled',
  'box-archive-arrow-up-filled', 'box-archive-filled', 'building', 'buildings',
  'bullseye-arrow', 'bullseye', 'captcha-filled', 'car-side-filled', 'caret-down-1-9',
  'caret-down-a-z', 'caret-down-z-a', 'caret-up-1-9', 'chart-bar-filled',
  'chart-bar-horizontal-filled', 'chart-donut-filled', 'chart-line', 'chart-pie-filled',
  'check-circle-broken', 'check-circle-filled', 'check-circle', 'check-sm',
  'check-square-broken', 'check-square-filled', 'check-square', 'check',
  'circle-filled', 'circle-lg-filled', 'circle-lg', 'circle-sm-filled', 'circle-sm',
  'cloud-arrow-down', 'cloud-arrow-up', 'cloud-filled', 'cloud-slash-filled',
  'cloud-slash', 'cloud', 'conditional-branch-filled', 'copy-dotted', 'copy-filled',
  'copy-line-dotted', 'copy-line-filled', 'copy-line', 'copy', 'cup-togo-filled',
  'cup-togo', 'dice-filled', 'dice', 'divider-filled', 'divider-sm', 'divider',
  'dropdown-filled', 'ellipsis-horizontal-circle-filled', 'ellipsis-horizontal-circle',
  'ellipsis-horizontal', 'ellipsis-vertical', 'equals-slash', 'equals',
  'exclamation-circle-filled', 'exclamation-circle', 'exclamation-square-filled',
  'exclamation-square', 'exclamation-triangle-filled', 'exclamation-triangle',
  'exclamation', 'eye-filled', 'eye-slash-filled', 'fill-in-the-blank', 'flag-filled',
  'floppy-disk', 'form-title-filled', 'function-filled', 'function', 'funnel-filled',
  'funnel', 'gauge-filled', 'gauge-simple', 'gavel-filled', 'gear-circle-filled',
  'gear-filled', 'gear-square-filled', 'gears-filled', 'glossary-sign-filled',
  'google-chrome-filled', 'google-chrome', 'graduation-cap-filled',
  'grid-dots-horizontal', 'grid-dots-vertical', 'grid-dots', 'hand-heart', 'hands',
  'hashtag', 'heart-circle-filled', 'heart-circle', 'heart-filled', 'heart-pulse',
  'heart-square', 'heart', 'hearts', 'house-filled', 'icons-filled',
  'if-else-condition-filled', 'image-line-filled', 'image-text-filled',
  'info-circle-filled', 'info-circle', 'info-square-filled', 'info-square', 'info',
  'input-text-long', 'input-text-short', 'jf-pen-line', 'label-button-filled',
  'label-filled', 'label-plus-filled', 'label-send-filled', 'language', 'life-ring',
  'line-dash-horizontal', 'line-dot-horizontal', 'line-horizontal', 'line-thick-thin',
  'link-diagonal-broken', 'link-diagonal', 'link-horizontal',
  'list-check-square-filled', 'loader', 'loading', 'location-pin-filled', 'magnet',
  'magnifying-glass-minus', 'magnifying-glass-plus', 'magnifying-glass-pulse',
  'magnifying-glass', 'map-location-pin-filled', 'medical-circle-filled',
  'medical-filled', 'medical-square-filled', 'merge-filled', 'minimap',
  'minus-circle-filled', 'minus-circle', 'minus-sm', 'minus-square-filled',
  'minus-square', 'minus', 'moon-filled', 'number-square-filled', 'pencil-to-square',
  'percent-filled', 'plane-filled', 'plus-circle-filled', 'plus-circle', 'plus-sm',
  'plus-square-filled', 'plus-square', 'plus', 'puzzle-piece-filled', 'puzzle-piece',
  'question-circle-filled', 'question-circle', 'rectangle-horizontal-filled',
  'rectangle-horizontal', 'rectangle-vertical-filled', 'rectangle-vertical',
  'rectangles-a-b-filled', 'rocket-filled', 'rocket-square-broken-filled',
  'rocket-square-filled', 'scale-balanced', 'shapes-filled', 'share-nodes-filled',
  'signature', 'single-selection-filled', 'single-selection', 'slash', 'sliders',
  'split-filled', 'square-dashed-flag-filled', 'square-dashed-grid-2-filled',
  'square-dashed-square', 'square-dashed', 'square-filled', 'square',
  'squares-arrow', 'squares-check-filled', 'squares-diamond-filled', 'star-filled',
  'star-minus-filled', 'star-plus-filled', 'star', 'stars-filled',
  'stars-horizontal-filled', 'sun-filled', 'table', 'text-animation-filled',
  'text-image-filled', 'text-image', 'text-square-dashed-filled',
  'text-triangle-circle-filled', 'text', 'threads', 'thumbtack-diagonal-filled',
  'thumbtack-diagonal', 'thumbtack-vertical-filled', 'thumbtack-vertical',
  'ticket-square-filled', 'toggle', 'trash-clock-filled', 'trash-exclamation-filled',
  'trash-filled', 'triangle-filled', 'triangle', 'trophy-filled', 'truck-side-filled',
  'unplug-slash', 'wave-pulse', 'wrench-screwdriver', 'wrench',
  'xmark-circle-filled', 'xmark-circle', 'xmark-sm', 'xmark-square-filled',
  'xmark-square', 'xmark',
];

const LAYOUT_ICONS = [
  'arrows-from-line-vertical', 'arrows-left-right-to-line',
  'arrows-to-line-horizontal', 'arrows-to-line-vertical',
  'arrows-up-down-to-line', 'border-bottom', 'border-center-horizontal',
  'border-center-vertical', 'border-inner', 'border-left', 'border-none',
  'border-outer', 'border-right', 'border-top', 'box-plus-bottom', 'box-plus-left',
  'box-plus-right', 'box-plus-top', 'column-four-filled', 'column-one-filled',
  'column-three-filled', 'column-two-filled', 'compress',
  'distribute-spacing-horizontal-filled', 'distribute-spacing-vertical-filled',
  'expand', 'grid-2-filled', 'grid-3-filled', 'kanban-filled', 'layer-filled',
  'layers-filled', 'line-bottom-square-filled', 'line-left-square-filled',
  'line-right-square-filled', 'line-top-square-filled', 'masonary-filled',
  'objects-align-bottom-filled', 'objects-align-center-horizontal-filled',
  'objects-align-center-vertical-filled', 'objects-align-left--filled',
  'objects-align-right-filled', 'objects-align-top-filled', 'rectangle-1-1',
  'rectangle-arrows-from-lines', 'rectangle-arrows-left-right',
  'rectangle-arrows-up-down-left-right', 'rectangle-arrows-up-down',
  'rectangle-expand', 'row-four-filled', 'row-one-filled', 'row-three-filled',
  'row-two-filled', 'sidebar-caret-left', 'sidebar-caret-right',
  'sidebar-lines-left', 'sidebar-lines-right', 'spacer-vertical-filled',
];

const MEDIA_ICONS = [
  'bolt-circle-filled', 'bolt-circle', 'bolt-filled', 'bolt-slash-filled',
  'bolt-slash', 'bolt-square-filled', 'bolt-square', 'bolt', 'camera-filled',
  'camera-plus-filled', 'camera-rotate-filled', 'camera-slash-filled', 'circles',
  'image-arrow-down-filled', 'image-arrow-up-filled', 'image-broken-filled',
  'image-check-filled', 'image-filled', 'image-minus-filled', 'image-plus-filled',
  'image-simple-filled', 'image-slider-filled', 'images-filled', 'pause-filled',
  'play-filled', 'qr', 'triangle-circle-filled', 'video-filled',
  'video-slash-filled', 'video-slash', 'video',
];

const PRODUCTS_ICONS = [
  'logo-mark-color', 'logo-mark-filled', 'product-app-sign-color',
  'product-app-table-color', 'product-apps-color-border', 'product-apps-color',
  'product-apps-filled', 'product-apps-mono', 'product-apps-plus-filled',
  'product-boards-check-circle-filled', 'product-boards-color-border',
  'product-boards-color', 'product-boards-exclamation-triangle-filled',
  'product-boards-filled', 'product-boards-mono', 'product-boards-plus-filled',
  'product-encrypted-card-form-light-color',
  'product-encrypted-form-builder-light-color',
  'product-form-analytics-color-border', 'product-form-analytics-color',
  'product-form-analytics-filled', 'product-form-analytics-mono',
  'product-form-builder-color-border', 'product-form-builder-color',
  'product-form-builder-filled',
  'product-form-builder-magnifying-glass-color-border',
  'product-form-builder-magnifying-glass-color',
  'product-form-builder-magnifying-glass-filled',
  'product-form-builder-magnifying-glass-mono', 'product-form-builder-mono',
  'product-form-card-color-border', 'product-form-card-color',
  'product-form-card-filled', 'product-form-card-mono',
  'product-inbox-color-border', 'product-inbox-color', 'product-inbox-filled',
  'product-inbox-mono', 'product-mobile-apps-color-border',
  'product-mobile-apps-color', 'product-mobile-apps-filled',
  'product-mobile-apps-mono', 'product-pages-color-border', 'product-pages-color',
  'product-pages-filled', 'product-pages-mono',
  'product-payment-card-form-border', 'product-payment-card-form-color',
  'product-payment-card-form-filled',
  'product-payment-card-form-light-color-border',
  'product-payment-card-form-light-color', 'product-payment-form-color-border',
  'product-payment-form-color', 'product-payment-form-filled',
  'product-payment-form-light-color-border', 'product-payment-form-light-color',
  'product-payment-form-mono', 'product-pdf-editor-color-border',
  'product-pdf-editor-color', 'product-pdf-editor-filled', 'product-pdf-editor-mono',
  'product-pdf-editor-plus-filled', 'product-pdf-form-color-border',
  'product-pdf-form-color', 'product-pdf-form-filled', 'product-pdf-form-mono',
  'product-report-builder-color-border', 'product-report-builder-color',
  'product-report-builder-filled', 'product-report-builder-mono',
  'product-report-builder-plus-filled',
  'product-salesforce-card-form-builder-light-color',
  'product-salesforce-form-builder-light-color', 'product-sentbox-color-border',
  'product-sentbox-color', 'product-sentbox-filled', 'product-sentbox-mono',
  'product-sign-card-form-light-color', 'product-sign-color-border',
  'product-sign-color', 'product-sign-filled',
  'product-sign-form-builder-light-color', 'product-sign-mono',
  'product-smart-pdf-form-color-border', 'product-smart-pdf-form-color',
  'product-smart-pdf-form-filled', 'product-smart-pdf-form-mono',
  'product-store-builder-color-border', 'product-store-builder-color',
  'product-store-builder-filled', 'product-store-builder-mono',
  'product-tables-check-circle-filled', 'product-tables-color-border',
  'product-tables-color', 'product-tables-exclamation-triangle-filled',
  'product-tables-filled', 'product-tables-link-diagonal-filled',
  'product-tables-mono', 'product-tables-tab-check-circle-filled',
  'product-tables-tab-exclamation-triangle-filled', 'product-tables-tab-filled',
  'product-tables-tab-link-diagonal-filled', 'product-teams-basic-filled',
  'product-teams-color-border', 'product-teams-color', 'product-teams-filled',
  'product-teams-mono', 'product-workflows-color',
  'product-worklfows-color-border', 'product-worklfows-filled',
  'product-worklfows-mono', 'product-worklfows-plus-filled',
  'report-calender-light-color', 'report-csv-light-color',
  'report-digest-light-color', 'report-html-light-color', 'report-rss-light-color',
  'report-tables-light-color', 'report-xls-light-color',
];

const SECURITY_ICONS = [
  'bug-filled', 'face-square', 'fingerprint', 'hipaa-filled', 'key-filled', 'key',
  'label-ip-filled', 'lock-filled', 'passcode-lock-filled', 'passcode', 'scan-filled',
  'shield-bolt', 'shield-check', 'shield-filled', 'shield-lock-filled', 'shield-lock',
  'shield-plus', 'shield-slash-filled', 'shield-slash', 'shield', 'unlock-filled',
];

const TECHNOLOGY_ICONS = [
  'browser-blank-filled', 'browser-filled', 'database-filled', 'desktop-filled',
  'desktop', 'globe-arrow-pointer-simple-filled', 'headphone-filled',
  'keyboard-filled', 'keyboard', 'label-api-filled', 'laptop-filled', 'laptop',
  'lightbulb-filled', 'microphone-filled', 'microphone-slash-filled',
  'mobile-bell-filled', 'mobile-bell', 'mobile-filled', 'mobile-gear-filled',
  'mobile-gear', 'mobile-lock-filled', 'mobile-lock', 'mobile-pencil-filled',
  'mobile-pencil', 'mobile-title-filled', 'mobile-title', 'mobile', 'mouse-filled',
  'mouse', 'plug-filled', 'power-on-off', 'screencast', 'tablet-filled',
  'tablet-gear-filled', 'tablet-gear', 'tablet-lock-filled', 'tablet-lock',
  'tablet-pencil-filled', 'tablet-pencil', 'tablet', 'webhook', 'wifi-exclamation',
  'wifi-slash', 'wifi',
];

const TIME_DATE_ICONS = [
  'alarm-clock-check-filled', 'alarm-clock-check', 'alarm-clock-exclamation-filled',
  'alarm-clock-exclamation', 'alarm-clock-filled', 'alarm-clock-minus-filled',
  'alarm-clock-minus', 'alarm-clock-plus-filled', 'alarm-clock-plus',
  'alarm-clock-slash-filled', 'alarm-clock-slash', 'alarm-clock-snooze-filled',
  'alarm-clock-snooze', 'alarm-clock', 'calendar-check-broken-filled',
  'calendar-check-broken', 'calendar-check-filled', 'calendar-check',
  'calendar-event-check-filled', 'calendar-event-filled', 'calendar-event',
  'calendar-exclamation-broken-filled', 'calendar-exclamation-broken',
  'calendar-exclamation-filled', 'calendar-exclamation', 'calendar-filled',
  'calendar-heart-broken-filled', 'calendar-heart-broken', 'calendar-heart-filled',
  'calendar-heart', 'calendar-minus-broken-filled', 'calendar-minus-broken',
  'calendar-minus-filled', 'calendar-minus', 'calendar-pencil-broken-filled',
  'calendar-pencil-broken', 'calendar-plus-broken-filled', 'calendar-plus-broken',
  'calendar-plus-filled', 'calendar-plus', 'calendar-slash-filled', 'calendar-slash',
  'calendar-week-filled', 'calendar-week', 'calendar-xmark-broken-filled',
  'calendar-xmark-broken', 'calendar-xmark-filled', 'calendar-xmark', 'calendar',
  'clock-arrow-rotate-left', 'clock-arrow-rotate-right', 'clock-arrows-rotate',
  'clock-check-broken-filled', 'clock-check-broken', 'clock-ellipsis',
  'clock-exclamation-circle-filled', 'clock-exclamation-circle',
  'clock-exclamation-filled', 'clock-exclamation', 'clock-filled', 'clock',
  'earth-clock', 'hourglass-end-filled', 'hourglass-end', 'hourglass-filled',
  'hourglass-half-filled', 'hourglass-half', 'hourglass-start-filled',
  'hourglass-start', 'hourglass', 'stopwatch-filled', 'stopwatch',
];

const USERS_ICONS = [
  'circle-user-filled', 'face-smile-filled', 'face-smile', 'human-filled',
  'square-user-filled', 'user-arrow-down-filled', 'user-arrow-left-filled',
  'user-arrow-right-filled', 'user-arrow-up-filled', 'user-check-filled',
  'user-clock', 'user-ellipsis-filled', 'user-filled', 'user-heart-filled',
  'user-id-card-filled', 'user-in-rectangle-filled', 'user-lock-filled',
  'user-magnifying-glass-filled', 'user-man-filled', 'user-minus-filled',
  'user-pencil-filled', 'user-plus-filled', 'user-question-exclamation-filled',
  'user-question-filled', 'user-sack-dolar-filled', 'user-shield',
  'user-woman-filled', 'user-xmark-filled', 'users-arrow-down-filled',
  'users-arrow-left-filled', 'users-arrow-right-filled', 'users-arrow-up-filled',
  'users-check-filled', 'users-ellipsis-filled', 'users-filled',
  'users-lock-filled', 'users-magnifying-glass-filled', 'users-minus-filled',
  'users-more-filled', 'users-pencil-filled', 'users-plus-filled',
  'users-question-filled', 'users-xmark-filled',
];

const ICON_CATEGORIES: { name: string; icons: string[]; path: string }[] = [
  { name: 'AI', icons: AI_ICONS, path: 'ai' },
  { name: 'Alerts & Feedback', icons: ALERTS_FEEDBACK_ICONS, path: 'alerts-feedback' },
  { name: 'Arrows', icons: ARROWS_ICONS, path: 'arrows' },
  { name: 'Communication', icons: COMMUNICATION_ICONS, path: 'communication' },
  { name: 'Documents', icons: DOCUMENTS_ICONS, path: 'documents' },
  { name: 'Editor', icons: EDITOR_ICONS, path: 'editor' },
  { name: 'Finance', icons: FINANCE_ICONS, path: 'finance' },
  { name: 'Forms & Files', icons: FORMS_FILES_ICONS, path: 'forms-files' },
  { name: 'General', icons: GENERAL_ICONS, path: 'general' },
  { name: 'Layout', icons: LAYOUT_ICONS, path: 'layout' },
  { name: 'Media', icons: MEDIA_ICONS, path: 'media' },
  { name: 'Products', icons: PRODUCTS_ICONS, path: 'products' },
  { name: 'Security', icons: SECURITY_ICONS, path: 'security' },
  { name: 'Technology', icons: TECHNOLOGY_ICONS, path: 'technology' },
  { name: 'Time & Date', icons: TIME_DATE_ICONS, path: 'time-date' },
  { name: 'Users', icons: USERS_ICONS, path: 'users' },
];

function IconCard({ name, category }: { name: string; category: string }) {
  const [copied, setCopied] = useState(false);
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    const url = new URL(`../../../assets/icons/${category}/${name}.svg`, import.meta.url).href;
    fetch(url)
      .then((res) => res.text())
      .then((text) => setSvgContent(text));
  }, [name, category]);

  const handleCopy = () => {
    navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button className="dl-icons__card" onClick={handleCopy} title={name}>
      <div
        className="dl-icons__preview"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      <span className="dl-icons__name">{copied ? 'Copied!' : name}</span>
    </button>
  );
}

export function IconsSection() {
  const [search, setSearch] = useState('');

  return (
    <div>
      <h1 className="dl-section__title">Icons</h1>
      <p className="dl-section__description">
        Icon library from the JotForm design system. Mono icons inherit color from their parent via currentColor. Click an icon to copy its name.
      </p>

      <div className="dl-icons__search">
        <SearchInput
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          size="md"
        />
      </div>

      {ICON_CATEGORIES.map((cat) => {
        const filtered = cat.icons.filter((name) =>
          name.toLowerCase().includes(search.toLowerCase())
        );
        if (filtered.length === 0) return null;

        return (
          <div key={cat.name}>
            <h2 className="dl-section__subtitle">
              {cat.name}
              <span className="dl-icons__count">{filtered.length}</span>
            </h2>
            <div className="dl-icons__grid">
              {filtered.map((name) => (
                <IconCard key={name} name={name} category={cat.path} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
