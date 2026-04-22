import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ComponentRegistry,
  AppHeader,
  AppDesigner,
  applyDefaultTheme,
  BottomNavigation,
  EmptyState,
  BottomSheet,
  type RegisteredComponent,
  type VariantValues,
  type PropertyValues,
  type StateValues,
} from '@jf/app-elements'
import { Icon, Button as DSButton } from '@jf/design-system'
import phoneHomeIndicator from '@jf/design-system/src/assets/phone-home-indicator.svg'
import { PhoneStatusBar } from '../components/PhoneStatusBar'
import { PageNavigationBar, getPageIconName } from '../components/PageNavigationBar'
import { MobileBottomBar } from '../components/MobileBottomBar'
import podoAvatar from '../assets/podo-chat-avatar.png'
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview'
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element'
import DropIndicator from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box'

interface CanvasElement {
  id: string
  componentId: string
  variants: VariantValues
  properties: PropertyValues
  states: StateValues
}

interface AppPage {
  id: string
  name: string
  icon?: string
  elements: CanvasElement[]
}

function nextNumericId(prefix: string, existingIds: string[]): string {
  const re = new RegExp(`^${prefix}-(\\d+)$`)
  const max = existingIds.reduce((m, id) => {
    const match = id.match(re)
    const n = match ? parseInt(match[1], 10) : 0
    return n > m ? n : m
  }, 0)
  return `${prefix}-${max + 1}`
}

const ELEMENT_ICON_MAP: Record<string, { icon: string; iconCategory: string }> = {
  'form': { icon: 'form-filled', iconCategory: 'forms-files' },
  'heading': { icon: 'heading-square-filled', iconCategory: 'editor' },
  'list': { icon: 'list-bullet', iconCategory: 'editor' },
  'paragraph': { icon: 'text-image', iconCategory: 'general' },
  'card': { icon: 'grid-2-filled', iconCategory: 'layout' },
  'sign-document': { icon: 'document-jf-sign-filled', iconCategory: 'documents' },
  'document': { icon: 'file-filled', iconCategory: 'forms-files' },
  'button': { icon: 'label-button-filled', iconCategory: 'general' },
  'social-follow': { icon: 'share-nodes-filled', iconCategory: 'general' },
  'product-list': { icon: 'cart-shopping-filled', iconCategory: 'finance' },
  'donation-box': { icon: 'heart-filled', iconCategory: 'general' },
  'image-gallery': { icon: 'images-filled', iconCategory: 'media' },
  'table': { icon: 'table', iconCategory: 'general' },
  'testimonial': { icon: 'message-star-filled', iconCategory: 'communication' },
  'login-signup': { icon: 'form-filled', iconCategory: 'forms-files' },
  'chart': { icon: 'form-report-filled', iconCategory: 'forms-files' },
  'daily-task-manager': { icon: 'table', iconCategory: 'general' },
  'progress-indicator': { icon: 'list-check-square-filled', iconCategory: 'general' },
  'spacer': { icon: 'spacer-vertical-filled', iconCategory: 'layout' },
}

interface PanelGroup {
  label?: string
  elementIds: string[]
}

const BASIC_GROUPS: PanelGroup[] = [
  { elementIds: ['form', 'heading', 'list', 'paragraph', 'card', 'sign-document', 'document', 'image-gallery', 'button', 'spacer'] },
  { label: 'PAYMENT ELEMENTS', elementIds: ['product-list', 'donation-box'] },
  { label: 'FEATURED WIDGETS', elementIds: ['social-follow', 'testimonial'] },
  { label: 'DATA ELEMENTS', elementIds: ['table'] },
]

const WIDGETS_GROUPS: PanelGroup[] = [
  { elementIds: ['chart', 'daily-task-manager', 'login-signup', 'progress-indicator'] },
]

interface MockWidget {
  id: string
  name: string
  bg: string
  render: () => React.ReactNode
}

const MOCK_WIDGETS: MockWidget[] = [
  {
    id: 'data-grid',
    name: 'Data Grid',
    bg: 'linear-gradient(135deg, #F4A7B9, #E8828B)',
    render: () => (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="8" height="8" rx="1.5" fill="#B85A63" />
        <rect x="14" y="4" width="10" height="8" rx="1.5" fill="#FFD2B5" />
        <rect x="4" y="14" width="10" height="10" rx="1.5" fill="#FFD2B5" />
        <rect x="16" y="14" width="8" height="10" rx="1.5" fill="#B85A63" />
      </svg>
    ),
  },
  {
    id: 'pdf-embedder',
    name: 'PDF Embedder',
    bg: '#FFF1F0',
    render: () => (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M6 5h10l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" fill="#FFE4E1" stroke="#D94F3F" strokeWidth="1.2"/>
        <path d="M16 5v5h5" fill="#D94F3F" opacity=".25"/>
        <text x="14" y="20" textAnchor="middle" fontSize="7" fontWeight="700" fill="#D94F3F">PDF</text>
      </svg>
    ),
  },
  {
    id: 'fit-text',
    name: 'Fit Text',
    bg: 'linear-gradient(135deg, #FFE07A, #3AC6C6)',
    render: () => (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <text x="14" y="20" textAnchor="middle" fontSize="14" fontWeight="800" fill="#222">FT</text>
      </svg>
    ),
  },
  {
    id: 'iframe-embed',
    name: 'Iframe Embed',
    bg: '#2B3544',
    render: () => (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <text x="14" y="19" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="700" fill="#E85A4F">{'</>'}</text>
      </svg>
    ),
  },
  {
    id: 'facebook-follow',
    name: 'Facebook Follow Box\n(Formerly Like Box)',
    bg: '#E7F0FB',
    render: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
        <path d="M2 12v6a2 2 0 0 0 2 2h3v-8H3v-2l2-.5V8a3 3 0 0 1 3-3h2v3H9c-.6 0-1 .4-1 1v1h3l-.5 2H8v8h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" opacity=".15"/>
        <path d="M13 9V7.5c0-1.4.8-2.5 2.2-2.5h1.8v2.5h-1.4c-.4 0-.6.2-.6.6V9h2l-.3 2.5H15V20h-2.5v-8.5H10V9h3z"/>
      </svg>
    ),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    bg: 'linear-gradient(135deg, #F58529, #DD2A7B 50%, #8134AF)',
    render: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1.2" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: 'show-map',
    name: 'Show Map Location',
    bg: 'linear-gradient(135deg, #B9D5EC, #6CA0C6)',
    render: () => (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <path d="M13 4C9 4 6 7 6 11c0 4.5 7 11 7 11s7-6.5 7-11c0-4-3-7-7-7z" fill="#1E6FB8" opacity=".65"/>
        <circle cx="13" cy="11" r="3" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: 'qr-code',
    name: 'QR Code',
    bg: '#FFFFFF',
    render: () => (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="#111" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8"/><rect x="5" y="5" width="4" height="4" fill="#fff"/>
        <rect x="17" y="3" width="8" height="8"/><rect x="19" y="5" width="4" height="4" fill="#fff"/>
        <rect x="3" y="17" width="8" height="8"/><rect x="5" y="19" width="4" height="4" fill="#fff"/>
        <rect x="14" y="14" width="3" height="3"/><rect x="19" y="14" width="3" height="3"/>
        <rect x="14" y="19" width="3" height="3"/><rect x="22" y="22" width="3" height="3"/>
      </svg>
    ),
  },
  {
    id: 'animated-heading',
    name: 'Animated Heading',
    bg: '#FFF4F1',
    render: () => (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#E8536E" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M4 18c2-6 6-6 8 0s6 6 8 0M14 10c1-2 2-2 3 0"/>
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Button',
    bg: '#E7F6EC',
    render: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.9-1.4A10 10 0 1 0 12 2zm5.6 14.2c-.2.6-1.2 1.2-1.7 1.3-.5.1-1.1.1-3.5-.8-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.3.2-.2.5-.3.7-.3h.5c.2 0 .5-.1.7.5.2.6.8 2 .9 2.1.1.1.1.3 0 .5-.1.2-.1.3-.3.4l-.4.5c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.7.9.8 1.7 1.1 2 1.2.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1l2 1c.3.1.4.2.5.4 0 .1 0 .7-.1 1.3z"/>
      </svg>
    ),
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    bg: '#FFF1E6',
    render: () => (
      <svg width="28" height="22" viewBox="0 0 28 22" fill="#FF7700" aria-hidden="true">
        <rect x="1" y="10" width="2" height="8" rx="1"/>
        <rect x="4" y="7" width="2" height="11" rx="1"/>
        <rect x="7" y="4" width="2" height="14" rx="1"/>
        <rect x="10" y="2" width="2" height="16" rx="1"/>
        <path d="M13 2h10a4 4 0 0 1 0 16H13V2z" fill="#FF7700"/>
      </svg>
    ),
  },
]

const HIDDEN_ELEMENTS = ['empty-state', 'app-header', 'bottom-navigation', 'color-picker', 'camper-card']

function createCanvasElement(comp: RegisteredComponent, id: string): CanvasElement {
  const variants: VariantValues = {}
  for (const [group, config] of Object.entries(comp.variants)) {
    variants[group] = config.default || config.options[0]
  }

  const properties: PropertyValues = {}
  for (const prop of comp.properties) {
    properties[prop.name] = prop.default
  }

  const states: StateValues = {}
  for (const state of comp.states) {
    states[state.name] = state.default || false
  }

  return {
    id,
    componentId: comp.id,
    variants,
    properties,
    states,
  }
}

function nextElementId(pages: AppPage[]): string {
  return nextNumericId('element', pages.flatMap((p) => p.elements.map((el) => el.id)))
}

const INLINE_EDITABLE_MAP: Record<string, { selector: string; property: string }[]> = {
  card: [
    { selector: '.jf-card__title', property: 'Title' },
    { selector: '.jf-card__description', property: 'Description' },
  ],
  button: [
    { selector: '.jf-btn__label', property: 'Label' },
  ],
  heading: [
    { selector: '.jf-heading__title', property: 'Heading' },
    { selector: '.jf-heading__subtitle', property: 'Subheading' },
  ],
  form: [
    { selector: '.jf-form__title', property: 'Label' },
    { selector: '.jf-form__desc', property: 'Description' },
  ],
  table: [
    { selector: '.jf-table__title', property: 'Label' },
    { selector: '.jf-table__desc', property: 'Description' },
  ],
  document: [
    { selector: '.jf-doc__title', property: 'File Name' },
    { selector: '.jf-doc__desc', property: 'Description' },
  ],
  'sign-document': [
    { selector: '.jf-sign-doc__title', property: 'Label' },
    { selector: '.jf-sign-doc__desc', property: 'Description' },
  ],
  list: [
    { selector: '.jf-list__title', property: 'Title' },
    { selector: '.jf-list__subtitle', property: 'Subtitle' },
  ],
  'product-list': [
    { selector: '.jf-product-list__title', property: 'Title' },
    { selector: '.jf-product-list__subtitle', property: 'Subtitle' },
  ],
  'donation-box': [
    { selector: '.jf-donation__title', property: 'Title' },
    { selector: '.jf-donation__description', property: 'Description' },
  ],
}

type DragSourceData =
  | { type: 'panel'; componentId: string }
  | { type: 'canvas'; elementId: string; componentId: string }

function isComponentShrinkable(componentId: string): boolean {
  const comp = ComponentRegistry.get(componentId)
  return !!comp?.properties.some((p) => p.name === 'Shrinked')
}

function isElementShrinked(el: CanvasElement): boolean {
  return el.properties['Shrinked'] === true
}

// Returns the pair partner's index within page.elements, or -1 if unpaired.
// Pairing: consecutive shrinked elements group into 2-column rows; element at column 0
// pairs with column 1 if present. Column-1 is always paired with column-0.
function pairPartnerIndex(elements: CanvasElement[], index: number): number {
  const el = elements[index]
  if (!el || !isElementShrinked(el)) return -1
  let start = index
  while (start > 0 && isElementShrinked(elements[start - 1])) start--
  const k = index - start
  if (k % 2 === 0) {
    const next = elements[index + 1]
    return next && isElementShrinked(next) ? index + 1 : -1
  }
  return index - 1
}

function PanelDragOverlay({ componentId }: { componentId: string }) {
  const iconInfo = ELEMENT_ICON_MAP[componentId]
  const comp = ComponentRegistry.get(componentId)
  if (!comp) return null

  return (
    <div className="build-page__element-item build-page__panel-overlay">
      <div className="build-page__element-icon">
        {iconInfo ? (
          <Icon name={iconInfo.icon} category={iconInfo.iconCategory} size={24} />
        ) : (
          <Icon name="grid-2-filled" category="layout" size={24} />
        )}
      </div>
      <div className="build-page__element-content">
        <span className="build-page__element-name">{comp.name}</span>
      </div>
    </div>
  )
}

const SortableElement = memo(function SortableElement({
  element,
  pageId,
  isSelected,
  hideDuringDrag,
  isPaired,
  pairPartnerId,
  partnerSwapEdge,
  onSelect,
  onPropertyChange,
  onOpenProperties,
  onRemove,
}: {
  element: CanvasElement
  pageId: string
  isSelected: boolean
  hideDuringDrag: boolean
  isPaired: boolean
  pairPartnerId: string | null
  partnerSwapEdge: Edge | null
  onSelect: (id: string) => void
  onPropertyChange: (elementId: string, property: string, value: string | boolean | number) => void
  onOpenProperties: (id: string) => void
  onRemove: (id: string) => void
}) {
  const comp = ComponentRegistry.get(element.componentId)
  const isShrinked = element.properties['Shrinked'] === true
  const sectionRef = useRef<HTMLElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [dropEdge, setDropEdge] = useState<Edge | null>(null)
  const isPairedRef = useRef(isPaired)
  const pairPartnerIdRef = useRef(pairPartnerId)
  const partnerSwapEdgeRef = useRef(partnerSwapEdge)
  useEffect(() => { isPairedRef.current = isPaired }, [isPaired])
  useEffect(() => { pairPartnerIdRef.current = pairPartnerId }, [pairPartnerId])
  useEffect(() => { partnerSwapEdgeRef.current = partnerSwapEdge }, [partnerSwapEdge])
  const selfShrinkable = isComponentShrinkable(element.componentId)

  useEffect(() => {
    const section = sectionRef.current
    const handle = handleRef.current
    if (!section) return
    return combine(
      draggable({
        element: section,
        dragHandle: handle ?? undefined,
        getInitialData: (): Record<string, unknown> => ({
          type: 'canvas',
          elementId: element.id,
          pageId,
          componentId: element.componentId,
        }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({ x: '16px', y: '16px' }),
            render: ({ container }) => {
              const root = createRoot(container)
              root.render(<PanelDragOverlay componentId={element.componentId} />)
              return () => root.unmount()
            },
          })
        },
      }),
      dropTargetForElements({
        element: section,
        canDrop: ({ source }) => {
          const data = source.data as DragSourceData
          if (data.type === 'canvas' && data.elementId === element.id) return false
          return true
        },
        getData: ({ input, source, element: target }) => {
          const data = source.data as DragSourceData
          const sourceIsMyPartner =
            data.type === 'canvas' && data.elementId === pairPartnerIdRef.current
          let allowedEdges: Edge[]
          if (sourceIsMyPartner) {
            // In-pair swap: only allow dropping on the opposite side of the partner.
            // Vertical edges still work so the user can break the pair.
            allowedEdges = partnerSwapEdgeRef.current
              ? ['top', 'bottom', partnerSwapEdgeRef.current]
              : ['top', 'bottom']
          } else {
            const sourceShrinkable = isComponentShrinkable(data.componentId)
            const allowHorizontal =
              sourceShrinkable && selfShrinkable && !isPairedRef.current
            allowedEdges = allowHorizontal
              ? ['top', 'bottom', 'left', 'right']
              : ['top', 'bottom']
          }
          return attachClosestEdge(
            { type: 'element', elementId: element.id, pageId },
            { input, element: target, allowedEdges }
          )
        },
        onDrag: ({ self, source }) => {
          const data = source.data as DragSourceData
          if (data.type === 'canvas' && data.elementId === element.id) {
            setDropEdge(null)
            return
          }
          const edge = extractClosestEdge(self.data)
          setDropEdge(edge)
        },
        onDragLeave: () => setDropEdge(null),
        onDrop: () => setDropEdge(null),
      })
    )
  }, [element.id, element.componentId, pageId, selfShrinkable])

  useEffect(() => {
    const container = contentRef.current
    if (!container || !comp) return

    const editableFields = INLINE_EDITABLE_MAP[element.componentId] || []
    const cleanups: (() => void)[] = []

    for (const field of editableFields) {
      const el = container.querySelector(field.selector) as HTMLElement | null
      if (!el) continue

      if (isSelected) {
        el.contentEditable = 'true'
        el.style.outline = 'none'
        el.style.cursor = 'text'
        const propDef = ComponentRegistry.get(element.componentId)?.properties.find((p) => p.name === field.property)
        const defaultValue = String(propDef?.default || '')
        const placeholderText = defaultValue || field.property
        el.dataset.placeholder = placeholderText

        if (!el.textContent) {
          el.classList.add('build-page__inline-placeholder')
        }

        const handleFocus = () => {
          if (defaultValue && el.textContent === defaultValue) {
            el.textContent = ''
            el.classList.add('build-page__inline-placeholder')
          }
          if (!el.textContent) {
            el.classList.add('build-page__inline-placeholder')
          }
        }

        const handleInput = () => {
          if (el.textContent) {
            el.classList.remove('build-page__inline-placeholder')
          } else {
            el.classList.add('build-page__inline-placeholder')
          }
        }

        const handleBlur = () => {
          const newText = el.textContent || ''
          el.classList.remove('build-page__inline-placeholder')
          if (newText) {
            onPropertyChange(element.id, field.property, newText)
          } else {
            onPropertyChange(element.id, field.property, defaultValue)
            el.textContent = defaultValue
          }
        }

        const handleMouseDown = (e: MouseEvent) => {
          if (isSelected) e.stopPropagation()
        }

        el.addEventListener('focus', handleFocus)
        el.addEventListener('input', handleInput)
        el.addEventListener('blur', handleBlur)
        el.addEventListener('mousedown', handleMouseDown)
        cleanups.push(() => {
          el.contentEditable = 'false'
          el.style.cursor = ''
          el.classList.remove('build-page__inline-placeholder')
          delete el.dataset.placeholder
          el.removeEventListener('focus', handleFocus)
          el.removeEventListener('input', handleInput)
          el.removeEventListener('blur', handleBlur)
          el.removeEventListener('mousedown', handleMouseDown)
        })
      } else {
        el.contentEditable = 'false'
        el.style.cursor = ''
      }
    }

    if (isSelected && element.componentId === 'paragraph') {
      const editor = container.querySelector('.jf-paragraph__editor') as HTMLElement | null
      if (editor) {
        requestAnimationFrame(() => editor.click())
      }
    }

    return () => cleanups.forEach((fn) => fn())
  }, [isSelected, element.componentId, element.id, comp, onPropertyChange])

  if (!comp) return null

  return (
    <section
      ref={sectionRef}
      className={`themes-view__section build-page__canvas-element ${isSelected ? 'build-page__canvas-element--selected' : ''} ${isShrinked ? 'build-page__canvas-element--shrinked' : ''}`}
      data-element-id={element.id}
      data-component-id={element.componentId}
      style={hideDuringDrag ? { display: 'none' } : undefined}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(element.id)
      }}
    >
      <div ref={handleRef} className="build-page__drag-handle">
        <Icon name="grid-dots-vertical" category="general" size={24} />
      </div>
      <div ref={contentRef} className="build-page__canvas-element-content">
        {comp.render(element.variants, element.properties, element.states, (name, value) => onPropertyChange(element.id, name, value))}
      </div>
      {isSelected && element.componentId === 'camper-card' && (
        <div className="widget-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="widget-actions__btn widget-actions__btn--ai"
            aria-label="Edit Widget"
          >
            <Icon name="ai-pencil-filled" category="ai" size={20} />
            <span className="widget-actions__label">Edit Widget</span>
          </button>
          <button
            type="button"
            className="widget-actions__btn widget-actions__btn--settings"
            onClick={() => onOpenProperties(element.id)}
            aria-label="Open properties"
          >
            <Icon name="gear-filled" category="general" size={20} />
          </button>
          <button
            type="button"
            className="widget-actions__btn widget-actions__btn--delete"
            onClick={() => onRemove(element.id)}
            aria-label="Delete widget"
          >
            <Icon name="trash-filled" category="general" size={20} />
          </button>
        </div>
      )}
      {dropEdge && <DropIndicator edge={dropEdge} gap="16px" />}
    </section>
  )
})

function DraggablePanelItem({
  comp,
  children,
}: {
  comp: RegisteredComponent
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    return draggable({
      element: el,
      getInitialData: (): Record<string, unknown> => ({
        type: 'panel',
        componentId: comp.id,
      }),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        setCustomNativeDragPreview({
          nativeSetDragImage,
          getOffset: pointerOutsideOfPreview({ x: '16px', y: '16px' }),
          render: ({ container }) => {
            const root = createRoot(container)
            root.render(<PanelDragOverlay componentId={comp.id} />)
            return () => root.unmount()
          },
        })
      },
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })
  }, [comp.id])

  return (
    <div
      ref={ref}
      className={isDragging ? 'build-page__element-item--dragging' : ''}
    >
      {children}
    </div>
  )
}

function DroppablePage({
  pageId,
  showEmptyState,
  onEmptyStateClick,
  children,
}: {
  pageId: string
  showEmptyState: boolean
  onEmptyStateClick: (e: React.MouseEvent) => void
  children?: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isOverEmpty, setIsOverEmpty] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    return dropTargetForElements({
      element: el,
      getData: () => ({ type: 'page', pageId }),
      getIsSticky: () => false,
      onDragEnter: () => setIsOverEmpty(true),
      onDragLeave: () => setIsOverEmpty(false),
      onDrop: () => setIsOverEmpty(false),
    })
  }, [pageId])

  return (
    <div
      ref={ref}
      data-page-id={pageId}
      className={`themes-view__app ${showEmptyState && isOverEmpty ? 'build-page__droppable--over' : ''}`}
    >
      {showEmptyState && (
        <section
          className="themes-view__section themes-view__section--center build-page__empty-state"
          onClick={onEmptyStateClick}
        >
          <EmptyState mobile={window.matchMedia('(max-width: 768px)').matches} />
        </section>
      )}
      {children}
    </div>
  )
}

function AiWidgetCard({ onClick }: { onClick?: () => void }) {
  return (
    <div className="build-page__ai-widget">
      <button type="button" className="build-page__ai-widget-card" onClick={onClick}>
        <img src={podoAvatar} alt="" className="build-page__ai-widget-avatar" />
        <div className="build-page__ai-widget-text">
          <div className="build-page__ai-widget-title-row">
            <span className="build-page__ai-widget-title">Create widget with</span>
            <span className="build-page__ai-widget-badge">AI</span>
          </div>
          <span className="build-page__ai-widget-subtitle">Tell your need, get it instantly</span>
        </div>
        <Icon name="angle-right" category="arrows" size={24} />
      </button>
    </div>
  )
}

type AiWidgetTab = 'general' | 'data' | 'condition'

interface AiWidgetConnectedTable {
  id: string
  label: string
  tableName: string
}

const CAMPER_CARD_TABLES: AiWidgetConnectedTable[] = [
  { id: 't1', label: 'Registered Children', tableName: 'Registered Children' },
  { id: 't2', label: 'Camper Registration', tableName: 'Camper Registration' },
  { id: 't3', label: 'Camper Registration', tableName: 'Camper Immunization Record' },
  { id: 't4', label: 'Camper Healthcare Information', tableName: 'Camper Healthcare Information' },
]

function AiWidgetPropertiesPanel({
  element,
  component,
  onClose,
  onPropertyChange,
  onDuplicate,
}: {
  element: CanvasElement
  component: RegisteredComponent
  onClose: () => void
  onPropertyChange: (elementId: string, property: string, value: string | boolean | number) => void
  onDuplicate: () => void
}) {
  const [activeTab, setActiveTab] = useState<AiWidgetTab>('general')
  const shrinked = element.properties['Shrinked'] === true
  const canShrink = component.properties.some((p) => p.name === 'Shrinked')

  return (
    <div className="ai-props">
      <div className="ai-props__header">
        <h2 className="ai-props__title">AI Widget Properties</h2>
        <button type="button" className="ai-props__close" onClick={onClose} aria-label="Close">
          <Icon name="xmark" category="general" size={20} />
        </button>
      </div>

      <div className="ai-props__widget-info">
        <div className="ai-props__widget-icon">
          <div className="ai-props__widget-icon-inner" />
          <div className="ai-props__widget-icon-gear">
            <Icon name="gear-filled" category="general" size={14} />
          </div>
        </div>
        <div className="ai-props__widget-meta">
          <div className="ai-props__widget-name">{component.name}</div>
          <div className="ai-props__widget-subtitle">Manage Availability</div>
        </div>
      </div>

      <div className="ai-props__tabs" role="tablist">
        {(['general', 'data', 'condition'] as AiWidgetTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            className={`ai-props__tab${activeTab === tab ? ' ai-props__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
            aria-selected={activeTab === tab}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="ai-props__body">
        {activeTab === 'general' && (
          <>
            {canShrink && (
              <div className="ai-props__row">
                <div className="ai-props__row-text">
                  <div className="ai-props__row-title">Shrink</div>
                  <div className="ai-props__row-desc">Make element smaller.</div>
                </div>
                <button
                  type="button"
                  className={`ai-props__toggle${shrinked ? ' ai-props__toggle--on' : ''}`}
                  onClick={() => onPropertyChange(element.id, 'Shrinked', !shrinked)}
                  aria-pressed={shrinked}
                >
                  <span className="ai-props__toggle-handle" />
                  <span className="ai-props__toggle-label">{shrinked ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            )}
            <div className="ai-props__row ai-props__row--block">
              <div className="ai-props__row-text">
                <div className="ai-props__row-title">Duplicate Element</div>
                <div className="ai-props__row-desc">Clone selected elements with all saved properties.</div>
              </div>
              <button type="button" className="ai-props__duplicate-btn" onClick={onDuplicate}>
                <Icon name="copy-filled" category="general" size={16} />
                <span>Duplicate</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'data' && (
          <div className="ai-props__data">
            <div className="ai-props__row-text">
              <div className="ai-props__section-title">Connected Tables</div>
              <div className="ai-props__row-desc">This widget shows data from Tables</div>
            </div>
            {CAMPER_CARD_TABLES.map((t) => (
              <div key={t.id} className="ai-props__table-group">
                <div className="ai-props__table-label">{t.label}</div>
                <div className="ai-props__table-card">
                  <div className="ai-props__table-card-top">
                    <div className="ai-props__table-icon">
                      <Icon name="table" category="general" size={18} />
                    </div>
                    <div className="ai-props__table-name">{t.tableName}</div>
                    <button type="button" className="ai-props__table-open" aria-label="Open table">
                      <Icon name="arrow-up-right-from-square-sm" category="arrows" size={14} />
                    </button>
                  </div>
                  <div className="ai-props__table-actions">
                    <button type="button" className="ai-props__btn ai-props__btn--primary">Match Fields</button>
                    <button type="button" className="ai-props__btn ai-props__btn--ghost">Change Table</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'condition' && (
          <div className="ai-props__empty">
            <div className="ai-props__row-desc">No conditions set.</div>
          </div>
        )}
      </div>
    </div>
  )
}

function GeneratingWidgetBanner() {
  return (
    <div className="generating-widget-banner" role="status" aria-live="polite">
      <img src={podoAvatar} alt="" className="generating-widget-banner__avatar" />
      <span className="generating-widget-banner__text">Generating widget with AI...</span>
    </div>
  )
}

function AiSparkleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10.83 2.5 12 6.67 16.17 7.83 12 9 10.83 13.17 9.67 9 5.5 7.83 9.67 6.67z" fill="currentColor"/>
      <path d="M4.58 12.5 5.17 14.42 7.08 15 5.17 15.58 4.58 17.5 4 15.58 2.08 15 4 14.42z" fill="currentColor"/>
      <path d="M15.42 12.08 15.83 13.33 17.08 13.75 15.83 14.17 15.42 15.42 15 14.17 13.75 13.75 15 13.33z" fill="currentColor"/>
    </svg>
  )
}

function AiWidgetModal({ open, onClose, onGenerate }: { open: boolean; onClose: () => void; onGenerate: (prompt: string) => void }) {
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) setDescription('')
  }, [open])

  if (!open) return null

  const canGenerate = description.trim().length > 0

  const handleGenerate = () => {
    if (!canGenerate) return
    onGenerate(description.trim())
  }

  return (
    <div className="ai-widget-modal__overlay" onClick={onClose}>
      <div className="ai-widget-modal" role="dialog" aria-modal="true" aria-label="Create widget with AI" onClick={(e) => e.stopPropagation()}>
        <div className="ai-widget-modal__header">
          <img src={podoAvatar} alt="" className="ai-widget-modal__avatar" />
          <div className="ai-widget-modal__header-text">
            <div className="ai-widget-modal__title-row">
              <span className="ai-widget-modal__title">Create widget with</span>
              <span className="build-page__ai-widget-badge">AI</span>
            </div>
            <span className="ai-widget-modal__subtitle">Tell your need, get it instantly</span>
          </div>
          <button type="button" className="ai-widget-modal__close" onClick={onClose} aria-label="Close">
            <Icon name="xmark" category="general" size={20} />
          </button>
        </div>
        <div className="ai-widget-modal__body">
          <label className="ai-widget-modal__label" htmlFor="ai-widget-description">Describe your Widget</label>
          <textarea
            id="ai-widget-description"
            className="ai-widget-modal__textarea"
            placeholder="e.g A widget with a checkbox list that tracks completion progress automatically"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="ai-widget-modal__footer">
          <button
            type="button"
            className="ai-widget-modal__generate"
            disabled={!canGenerate}
            onClick={handleGenerate}
          >
            <AiSparkleIcon size={20} />
            <span>Generate</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function TabMenu({ activeTab, onTabChange }: { activeTab: 'basic' | 'widgets'; onTabChange: (tab: 'basic' | 'widgets') => void }) {
  return (
    <div className="build-page__tab-menu">
      <button
        className={`build-page__tab${activeTab === 'basic' ? ' build-page__tab--active' : ''}`}
        onClick={() => onTabChange('basic')}
      >
        BASIC
      </button>
      <button
        className={`build-page__tab${activeTab === 'widgets' ? ' build-page__tab--active' : ''}`}
        onClick={() => onTabChange('widgets')}
      >
        WIDGETS
      </button>
    </div>
  )
}

function AddPageDivider({ onClick }: { onClick: () => void }) {
  return (
    <div className="add-page-divider" onClick={(e) => e.stopPropagation()}>
      <div className="add-page-divider__line" />
      <button className="add-page-divider__btn" onClick={onClick}>
        <Icon name="plus-sm" category="general" size={24} />
        <span>Add a Page</span>
      </button>
      <div className="add-page-divider__line" />
    </div>
  )
}

type RightPanelMode = 'preview' | 'designer' | 'properties'

export function BuildPage({ previewMode = true, appTitle: appTitleProp = 'App Title', onAppTitleChange }: { previewMode?: boolean; appTitle?: string; onAppTitleChange?: (title: string) => void }) {
  const [rightPanel, setRightPanel] = useState<RightPanelMode>('preview')
  const [components, setComponents] = useState<RegisteredComponent[]>(ComponentRegistry.getAll())
  const [pages, setPages] = useState<AppPage[]>([
    { id: 'page-1', name: 'Home', icon: 'House', elements: [] },
  ])
  const [activePageId, setActivePageId] = useState('page-1')
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [dragSession, setDragSession] = useState<DragSourceData | null>(null)
  const isDragging = dragSession !== null
  const draggedCanvasId = dragSession?.type === 'canvas' ? dragSession.elementId : null
  const [leftPanelOpen, setLeftPanelOpen] = useState(false)
  const [mobileElementsSheet, setMobileElementsSheet] = useState(false)
  const [forceTargetPageId, setForceTargetPageId] = useState<string | null>(null)
  const [isMobileView, setIsMobileView] = useState(() => window.matchMedia('(max-width: 768px)').matches)
  const canvasRef = useRef<HTMLElement>(null)

  const pagesRef = useRef<AppPage[]>([])
  useEffect(() => { pagesRef.current = pages }, [pages])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e: MediaQueryListEvent) => setIsMobileView(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const appTitle = appTitleProp
  const setAppTitle = (title: string) => onAppTitleChange?.(title)
  const [appSubtitle, setAppSubtitle] = useState('')
  const appHeaderRef = useRef<HTMLDivElement>(null)
  const designBtnRef = useRef<HTMLButtonElement>(null)
  const [designBtnOnHeader, setDesignBtnOnHeader] = useState(true)

  useEffect(() => {
    return ComponentRegistry.subscribe(() => {
      setComponents(ComponentRegistry.getAll())
    })
  }, [])

  const handleCloseDesigner = useCallback(() => {
    setRightPanel('preview')
  }, [])

  useEffect(() => {
    applyDefaultTheme()
  }, [])

  useEffect(() => {
    const builder = document.querySelector('.builder')
    if (!builder) return
    if (rightPanel === 'designer' && isMobileView) {
      builder.classList.add('builder--design-mode')
    } else {
      builder.classList.remove('builder--design-mode')
    }
  }, [rightPanel, isMobileView])

  useEffect(() => {
    const canvas = document.querySelector('.build-page__canvas')
    if (!canvas || !appHeaderRef.current || !designBtnRef.current) return
    const check = () => {
      const headerRect = appHeaderRef.current!.getBoundingClientRect()
      const btnRect = designBtnRef.current!.getBoundingClientRect()
      setDesignBtnOnHeader(btnRect.top + btnRect.height / 2 < headerRect.bottom)
    }
    check()
    canvas.addEventListener('scroll', check, { passive: true })
    return () => canvas.removeEventListener('scroll', check)
  }, [])

  useEffect(() => {
    const builder = document.querySelector('.builder')
    if (!builder) return
    if (mobileElementsSheet && isMobileView) {
      builder.classList.add('builder--elements-sheet')
    } else {
      builder.classList.remove('builder--elements-sheet')
    }
  }, [mobileElementsSheet, isMobileView])

  useEffect(() => {
    const container = appHeaderRef.current
    if (!container) return

    const titleEl = container.querySelector('.jf-app-header__title') as HTMLElement | null
    const subtitleEl = container.querySelector('.jf-app-header__subtitle') as HTMLElement | null

    const fields = [
      { el: titleEl, defaultValue: 'App Title', setter: setAppTitle },
      { el: subtitleEl, defaultValue: '', setter: setAppSubtitle },
    ]

    const cleanups: (() => void)[] = []

    for (const { el, defaultValue, setter } of fields) {
      if (!el) continue

      el.contentEditable = 'true'
      el.style.outline = 'none'
      el.style.cursor = 'text'
      const placeholderText = defaultValue || (el.className.includes('subtitle') ? 'Subtitle' : 'Title')
      el.dataset.placeholder = placeholderText


      const handleFocus = () => {
        if (!el.className.includes('subtitle')) {
          const sub = container.querySelector('.jf-app-header__subtitle') as HTMLElement | null
          if (sub && sub.classList.contains('jf-app-header__subtitle--empty')) {
            sub.classList.remove('jf-app-header__subtitle--empty')
            sub.classList.add('build-page__inline-placeholder')
          }
        }
        if (el.className.includes('subtitle--empty')) {
          el.classList.remove('jf-app-header__subtitle--empty')
        }
        if (defaultValue && el.textContent === defaultValue) {
          el.textContent = ''
          el.classList.add('build-page__inline-placeholder')
        }
        if (!el.textContent) {
          el.classList.add('build-page__inline-placeholder')
        }
      }

      const handleInput = () => {
        if (el.textContent) {
          el.classList.remove('build-page__inline-placeholder')
        } else {
          el.classList.add('build-page__inline-placeholder')
        }
      }

      const handleBlur = () => {
        const newText = el.textContent || ''
        el.classList.remove('build-page__inline-placeholder')
        if (newText) {
          setter(newText)
        } else {
          setter(defaultValue)
          if (defaultValue) {
            el.textContent = defaultValue
          } else if (el.className.includes('subtitle')) {
            el.classList.add('jf-app-header__subtitle--empty')
          }
        }
        if (!el.className.includes('subtitle')) {
          const sub = container.querySelector('.jf-app-header__subtitle') as HTMLElement | null
          if (sub && !sub.textContent) {
            sub.classList.remove('build-page__inline-placeholder')
            sub.classList.add('jf-app-header__subtitle--empty')
          }
        }
      }

      el.addEventListener('focus', handleFocus)
      el.addEventListener('input', handleInput)
      el.addEventListener('blur', handleBlur)
      cleanups.push(() => {
        el.removeEventListener('focus', handleFocus)
        el.removeEventListener('input', handleInput)
        el.removeEventListener('blur', handleBlur)
      })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [appTitle, appSubtitle])

  const [activeTab, setActiveTab] = useState<'basic' | 'widgets'>('basic')
  const [aiWidgetModalOpen, setAiWidgetModalOpen] = useState(false)
  const [generatingWidget, setGeneratingWidget] = useState(false)

  const handleAiGenerate = useCallback((_prompt: string) => {
    setAiWidgetModalOpen(false)
    setGeneratingWidget(true)
    window.setTimeout(() => {
      setGeneratingWidget(false)
      const comp = ComponentRegistry.get('camper-card')
      if (!comp) return
      const element = createCanvasElement(comp, nextElementId(pagesRef.current))
      setPages((prev) => prev.map((page) =>
        page.id === activePageId
          ? { ...page, elements: [...page.elements, element] }
          : page
      ))
      setSelectedElementId(element.id)
    }, 4000)
  }, [activePageId])

  const componentMap = components.reduce<Record<string, RegisteredComponent>>((acc, comp) => {
    if (!HIDDEN_ELEMENTS.includes(comp.id)) acc[comp.id] = comp
    return acc
  }, {})

  const activeGroups = activeTab === 'basic' ? BASIC_GROUPS : WIDGETS_GROUPS

  const handleAddElement = useCallback((comp: RegisteredComponent) => {
    const element = createCanvasElement(comp, nextElementId(pagesRef.current))
    setPages((prev) => {
      let targetPageId = activePageId
      if (forceTargetPageId) {
        targetPageId = forceTargetPageId
      } else if (selectedElementId) {
        const selectedPage = prev.find((p) => p.elements.some((el) => el.id === selectedElementId))
        if (selectedPage) targetPageId = selectedPage.id
      }
      return prev.map((page) => {
        if (page.id !== targetPageId) return page
        const selectedIdx = selectedElementId && !forceTargetPageId
          ? page.elements.findIndex((el) => el.id === selectedElementId)
          : -1
        if (selectedIdx !== -1) {
          const newElements = [...page.elements]
          newElements.splice(selectedIdx + 1, 0, element)
          return { ...page, elements: newElements }
        }
        return { ...page, elements: [...page.elements, element] }
      })
    })
    setForceTargetPageId(null)
    setSelectedElementId(element.id)
    if (!mobileElementsSheet) {
      setRightPanel('properties')
    }
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.querySelector(`[data-element-id="${element.id}"]`)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const scrollContainer = isMobileView
          ? document.querySelector('.builder')
          : document.querySelector('.build-page__canvas')
        if (!scrollContainer) return
        const containerRect = scrollContainer.getBoundingClientRect()
        const targetY = scrollContainer.scrollTop + rect.top - containerRect.top - containerRect.height / 2 + rect.height / 2
        const start = scrollContainer.scrollTop
        const distance = targetY - start
        const duration = 500
        let startTime: number | null = null
        const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const progress = Math.min((timestamp - startTime) / duration, 1)
          scrollContainer.scrollTop = start + distance * ease(progress)
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }, 100)
    })
  }, [activePageId, isMobileView, mobileElementsSheet, selectedElementId, forceTargetPageId])

  const handleSelectElement = useCallback((elementId: string) => {
    setSelectedElementId(elementId)
    setMobileElementsSheet(false)
    const page = pagesRef.current.find((p) => p.elements.some((el) => el.id === elementId))
    const el = page?.elements.find((e) => e.id === elementId)
    if (el?.componentId !== 'camper-card') {
      setRightPanel('properties')
    }
  }, [])

  const handleOpenProperties = useCallback((elementId: string) => {
    setSelectedElementId(elementId)
    setRightPanel('properties')
  }, [])

  const handleRemoveElement = useCallback((elementId: string) => {
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        elements: page.elements.filter((el) => el.id !== elementId),
      }))
    )
    setSelectedElementId((prev) => (prev === elementId ? null : prev))
    setRightPanel('preview')
  }, [])

  const handleAddPage = useCallback((afterPageId: string) => {
    const pageId = nextNumericId('page', pagesRef.current.map((p) => p.id))
    const pageNum = pageId.replace(/^page-/, '')
    const newPage: AppPage = {
      id: pageId,
      name: `Page ${pageNum}`,
      elements: [],
    }
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.id === afterPageId)
      const next = [...prev]
      next.splice(idx + 1, 0, newPage)
      return next
    })
    setActivePageId(newPage.id)
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.querySelector(`[data-page-id="${newPage.id}"]`)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const scrollContainer = isMobileView
          ? document.querySelector('.builder')
          : document.querySelector('.build-page__canvas')
        if (!scrollContainer) return
        const containerRect = scrollContainer.getBoundingClientRect()
        const targetY = scrollContainer.scrollTop + rect.top - containerRect.top - containerRect.height / 2 + rect.height / 2
        const start = scrollContainer.scrollTop
        const distance = targetY - start
        const duration = 500
        let startTime: number | null = null
        const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const progress = Math.min((timestamp - startTime) / duration, 1)
          scrollContainer.scrollTop = start + distance * ease(progress)
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }, 200)
    })
  }, [isMobileView])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElementId) return
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        handleRemoveElement(selectedElementId)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedElementId, handleRemoveElement])

  const handleDuplicateElement = useCallback((elementId: string) => {
    setPages((prev) => prev.map((page) => {
      const idx = page.elements.findIndex((el) => el.id === elementId)
      if (idx === -1) return page
      const orig = page.elements[idx]
      const dup: CanvasElement = {
        ...orig,
        id: nextElementId(prev),
        properties: { ...orig.properties },
        variants: { ...orig.variants },
        states: { ...orig.states },
      }
      const elements = [...page.elements]
      elements.splice(idx + 1, 0, dup)
      return { ...page, elements }
    }))
  }, [])

  const handlePropertyChange = useCallback((elementId: string, name: string, value: string | boolean | number) => {
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        elements: page.elements.map((el) =>
          el.id === elementId
            ? { ...el, properties: { ...el.properties, [name]: value } }
            : el
        ),
      }))
    )
  }, [])

  const handleVariantChange = useCallback((elementId: string, group: string, value: string) => {
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        elements: page.elements.map((el) =>
          el.id === elementId
            ? { ...el, variants: { ...el.variants, [group]: value } }
            : el
        ),
      }))
    )
  }, [])

  useEffect(() => {
    return monitorForElements({
      onDragStart: ({ source }) => {
        const data = source.data as DragSourceData
        setDragSession(data)
        if (data.type === 'panel') {
          setSelectedElementId(null)
          setRightPanel('preview')
        }
      },
      onDrop: ({ source, location }) => {
        setDragSession(null)
        const data = source.data as DragSourceData
        const innerTarget = location.current.dropTargets[0]
        if (!innerTarget) return

        const targetData = innerTarget.data as
          | { type: 'element'; elementId: string; pageId: string }
          | { type: 'page'; pageId: string }

        const edge = targetData.type === 'element' ? extractClosestEdge(innerTarget.data) : null
        const isHorizontal = edge === 'left' || edge === 'right'

        const withShrinked = (el: CanvasElement, shrinked: boolean): CanvasElement => ({
          ...el,
          properties: { ...el.properties, Shrinked: shrinked },
        })

        if (data.type === 'panel') {
          const comp = ComponentRegistry.get(data.componentId)
          if (!comp) return
          const newEl = createCanvasElement(comp, nextElementId(pagesRef.current))
          const targetPageId = targetData.pageId

          setPages((prev) =>
            prev.map((page) => {
              if (page.id !== targetPageId) return page
              if (targetData.type === 'page') {
                return { ...page, elements: [...page.elements, newEl] }
              }
              const idx = page.elements.findIndex((el) => el.id === targetData.elementId)
              if (idx === -1) return { ...page, elements: [...page.elements, newEl] }
              const elements = [...page.elements]
              if (isHorizontal) {
                elements[idx] = withShrinked(elements[idx], true)
                const insertAt = edge === 'right' ? idx + 1 : idx
                elements.splice(insertAt, 0, withShrinked(newEl, true))
              } else {
                const insertAt = edge === 'bottom' ? idx + 1 : idx
                elements.splice(insertAt, 0, newEl)
              }
              return { ...page, elements }
            })
          )
          setSelectedElementId(newEl.id)
          setActivePageId(targetPageId)
          setRightPanel('properties')
          return
        }

        // canvas drag
        if (data.type !== 'canvas') return
        const sourceId = data.elementId
        const currentPages = pagesRef.current
        const sourcePage = currentPages.find((p) =>
          p.elements.some((el) => el.id === sourceId)
        )
        if (!sourcePage) return
        const movingEl = sourcePage.elements.find((el) => el.id === sourceId)
        if (!movingEl) return
        const targetPageId = targetData.pageId

        if (targetData.type === 'element' && targetData.elementId === sourceId) return

        const sourceEl = withShrinked(movingEl, isHorizontal)

        setPages((prev) => {
          let insertIdx: number | null = null
          const withoutSource = prev.map((page) => {
            if (page.id !== sourcePage.id) return page
            const srcIdx = page.elements.findIndex((el) => el.id === sourceId)
            const partnerIdx = pairPartnerIndex(page.elements, srcIdx)
            const elements = page.elements
              .map((el, i) => (i === partnerIdx ? withShrinked(el, false) : el))
              .filter((el) => el.id !== sourceId)
            return { ...page, elements }
          })
          const next = withoutSource.map((page) => {
            if (page.id !== targetPageId) return page
            if (targetData.type === 'page') {
              insertIdx = page.elements.length
              return { ...page, elements: [...page.elements, sourceEl] }
            }
            const idx = page.elements.findIndex((el) => el.id === targetData.elementId)
            if (idx === -1) {
              insertIdx = page.elements.length
              return { ...page, elements: [...page.elements, sourceEl] }
            }
            const elements = [...page.elements]
            if (isHorizontal) {
              elements[idx] = withShrinked(elements[idx], true)
              const insertAt = edge === 'right' ? idx + 1 : idx
              elements.splice(insertAt, 0, sourceEl)
              insertIdx = insertAt
            } else {
              const insertAt = edge === 'bottom' ? idx + 1 : idx
              elements.splice(insertAt, 0, sourceEl)
              insertIdx = insertAt
            }
            return { ...page, elements }
          })
          if (insertIdx === null) return prev
          if (next.length > 1 && next[0].elements.length === 0) {
            const filtered = next.slice(1)
            setActivePageId((cur) => (cur === next[0].id ? filtered[0].id : cur))
            return filtered
          }
          return next
        })
      },
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    return autoScrollForElements({ element: canvas })
  }, [])

  let selectedElement: CanvasElement | null = null
  let selectedComponent: RegisteredComponent | null = null
  for (const page of pages) {
    const found = page.elements.find((el) => el.id === selectedElementId)
    if (found) {
      selectedElement = found
      selectedComponent = ComponentRegistry.get(found.componentId) || null
      break
    }
  }

  return (
    <>
    <div className="build-page">
      {/* Left Panel - App Elements */}
      <aside className={`build-page__left${leftPanelOpen ? '' : ' build-page__left--hidden'}`}>
        <div className="build-page__left-header">
          <h2>App Elements</h2>
          <button className="build-page__left-close" onClick={() => setLeftPanelOpen(false)}>
            <Icon name="xmark" size={24} />
          </button>
        </div>
        <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="build-page__elements">
          {activeTab === 'widgets' && <AiWidgetCard onClick={() => setAiWidgetModalOpen(true)} />}
          {activeTab === 'widgets' && (
            <>
              <div className="build-page__separator">WIDGETS</div>
              <hr className="build-page__element-divider" />
              {MOCK_WIDGETS.map((w, i) => (
                <div key={w.id}>
                  <div className="build-page__element-item build-page__element-item--widget">
                    <div className="build-page__element-icon build-page__element-icon--color" style={{ background: w.bg }}>
                      {w.render()}
                    </div>
                    <div className="build-page__element-content">
                      <span className="build-page__element-name">{w.name}</span>
                    </div>
                  </div>
                  {i < MOCK_WIDGETS.length - 1 && <hr className="build-page__element-divider" />}
                </div>
              ))}
            </>
          )}
          {activeTab === 'basic' && activeGroups.map((group, groupIndex) => {
            const validItems = group.elementIds
              .map((id) => componentMap[id])
              .filter(Boolean)
            if (validItems.length === 0) return null

            return (
              <div key={group.label || groupIndex}>
                {groupIndex > 0 && <hr className="build-page__element-divider" />}
                {group.label && (
                  <div className="build-page__separator">{group.label}</div>
                )}
                {group.label && <hr className="build-page__element-divider" />}
                {validItems.map((comp, itemIndex) => {
                  const iconInfo = ELEMENT_ICON_MAP[comp.id]
                  return (
                    <div key={comp.id}>
                      <DraggablePanelItem comp={comp}>
                        <div
                          className="build-page__element-item"
                          onClick={() => handleAddElement(comp)}
                        >
                          <div className="build-page__element-icon">
                            {iconInfo ? (
                              <Icon name={iconInfo.icon} category={iconInfo.iconCategory} size={24} />
                            ) : (
                              <Icon name="grid-2-filled" category="layout" size={24} />
                            )}
                          </div>
                          <div className="build-page__element-content">
                            <span className="build-page__element-name">{comp.name}</span>
                          </div>
                        </div>
                      </DraggablePanelItem>
                      {itemIndex < validItems.length - 1 && (
                        <hr className="build-page__element-divider" />
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </aside>

      {/* Canvas - App Preview */}
      <div className={`build-page__canvas-wrapper${isDragging ? ' build-page__canvas--dragging' : ''}`}>
      <main ref={canvasRef} className="build-page__canvas" onClick={() => {
        setSelectedElementId(null)
        setRightPanel('preview')
      }}>
          {/* Floating Buttons */}
          <div className="build-page__floating-buttons">
            <button className={`build-page__add-element-btn${leftPanelOpen ? ' build-page__add-element-btn--hidden' : ''}`} onClick={(e) => { e.stopPropagation(); if (isMobileView) { setMobileElementsSheet(true); } else { setLeftPanelOpen(true); } }}>
              <Icon name="plus" category="general" size={24} />
              <span className="build-page__add-element-btn-tooltip">Add Element</span>
            </button>
            <button ref={designBtnRef} className={`build-page__design-btn${rightPanel === 'designer' ? ' build-page__design-btn--hidden' : ''}${!designBtnOnHeader ? ' build-page__design-btn--brand' : ''}`} onClick={(e) => {
              e.stopPropagation()
              setSelectedElementId(null)
              setRightPanel('designer')
            }}>
              <Icon name="paint-roller-vertical-filled" category="editor" size={32} />
              <span className="build-page__design-btn-tooltip">App Designer</span>
            </button>
          </div>
          <div className="app-scope">
            <div className="themes-view__device">
              <div ref={appHeaderRef}>
                <AppHeader layout="Center" title={appTitle} subtitle={appSubtitle} />
              </div>

              {pages.map((page, pageIndex) => (
                <div key={page.id}>
                  <div
                    className={`themes-view__canvas ${pageIndex === 0 ? 'themes-view__canvas--first' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActivePageId(page.id)
                      if (e.target === e.currentTarget) {
                        setSelectedElementId(null)
                        setRightPanel('preview')
                      }
                    }}
                  >
                    {(() => {
                      const visibleCount = draggedCanvasId
                        ? page.elements.filter((el) => el.id !== draggedCanvasId).length
                        : page.elements.length
                      const virtuallyEmpty = visibleCount === 0
                      return (
                        <DroppablePage
                          pageId={page.id}
                          showEmptyState={virtuallyEmpty}
                          onEmptyStateClick={(e) => {
                            e.stopPropagation()
                            setActivePageId(page.id)
                            setForceTargetPageId(page.id)
                            setSelectedElementId(null)
                            if (isMobileView) {
                              if (rightPanel === 'designer') setRightPanel('preview')
                              setMobileElementsSheet(true)
                            } else {
                              setLeftPanelOpen(true)
                            }
                          }}
                        >
                          {page.elements.map((element, idx) => {
                            const partnerIdx = pairPartnerIndex(page.elements, idx)
                            const partnerId = partnerIdx !== -1 ? page.elements[partnerIdx].id : null
                            const swapEdge: Edge | null = partnerIdx === -1
                              ? null
                              : partnerIdx < idx
                                ? 'right'
                                : 'left'
                            return (
                              <SortableElement
                                key={element.id}
                                element={element}
                                pageId={page.id}
                                isSelected={selectedElementId === element.id}
                                hideDuringDrag={element.id === draggedCanvasId}
                                isPaired={partnerIdx !== -1}
                                pairPartnerId={partnerId}
                                partnerSwapEdge={swapEdge}
                                onSelect={handleSelectElement}
                                onPropertyChange={handlePropertyChange}
                                onOpenProperties={handleOpenProperties}
                                onRemove={handleRemoveElement}
                              />
                            )
                          })}
                          {generatingWidget && page.id === activePageId && (
                            <section className="themes-view__section themes-view__section--center build-page__generating-slot">
                              <GeneratingWidgetBanner />
                            </section>
                          )}
                        </DroppablePage>
                      )
                    })()}
                  </div>

                  {(pageIndex > 0 || page.elements.length > 0 || isDragging) && (
                    <AddPageDivider onClick={() => handleAddPage(page.id)} />
                  )}
                </div>
              ))}
            </div>
          </div>

      </main>

      {/* Page Navigation Bar */}
      {!isMobileView && pages.length > 1 && (
        <PageNavigationBar
          pages={pages}
          activePageId={activePageId}
          onPageSelect={(pageId) => {
            setActivePageId(pageId)
            requestAnimationFrame(() => {
              const el = document.querySelector(`[data-page-id="${pageId}"]`)
              const scrollContainer = document.querySelector('.build-page__canvas')
              if (!el || !scrollContainer) return
              const containerRect = scrollContainer.getBoundingClientRect()
              const elRect = el.getBoundingClientRect()
              const targetY = scrollContainer.scrollTop + elRect.top - containerRect.top - containerRect.height / 2 + elRect.height / 2
              scrollContainer.scrollTo({ top: targetY, behavior: 'smooth' })
            })
          }}
          onPageReorder={(reordered) => setPages(reordered as AppPage[])}
          onPageRename={(pageId, name) => setPages((prev) => prev.map((p) => p.id === pageId ? { ...p, name } : p))}
          onChangeIcon={(pageId, icon) => setPages((prev) => prev.map((p) => p.id === pageId ? { ...p, icon } : p))}
          onDeletePage={(pageId) => {
            setPages((prev) => {
              const filtered = prev.filter((p) => p.id !== pageId)
              if (filtered.length === 0) return prev
              return filtered
            })
            if (activePageId === pageId) {
              const idx = pages.findIndex((p) => p.id === pageId)
              const next = pages[idx - 1] || pages[idx + 1]
              if (next) setActivePageId(next.id)
            }
          }}
          onAddPage={() => handleAddPage(pages[pages.length - 1].id)}
        />
      )}
      </div>

      {/* Right Panel - Designer/Properties or Live Preview */}
      <aside className={`build-page__right ${previewMode || rightPanel === 'designer' ? '' : 'build-page__right--hidden'}`}>

        {/* Sliding content wrapper */}
        <div className={`build-page__right-slider${rightPanel === 'designer' || !previewMode ? ' build-page__right-slider--designer' : ''}`}>

          {/* Slide 1: Live Preview / Properties */}
          <div className="build-page__right-slide">
            {/* Properties Panel */}
            {rightPanel === 'properties' && selectedElement && selectedComponent && selectedComponent.id === 'camper-card' ? (
              <AiWidgetPropertiesPanel
                element={selectedElement}
                component={selectedComponent}
                onClose={() => {
                  setRightPanel('preview')
                  setSelectedElementId(null)
                }}
                onPropertyChange={handlePropertyChange}
                onDuplicate={() => handleDuplicateElement(selectedElement.id)}
              />
            ) : rightPanel === 'properties' && selectedElement && selectedComponent ? (
              <div className="build-page__properties">
                <div className="build-page__panel-header">
                  <h2>{selectedComponent.name}</h2>
                  <button
                    className="build-page__panel-close"
                    onClick={() => {
                      setRightPanel('preview')
                      setSelectedElementId(null)
                    }}
                  >
                    &times;
                  </button>
                </div>

                {/* Variants */}
                {Object.entries(selectedComponent.variants)
                  .filter(([, config]) => {
                    if (!config.showWhen) return true
                    return Object.entries(config.showWhen).every(
                      ([key, val]) => selectedElement.variants[key] === val
                    )
                  })
                  .map(([group, config]) => (
                  <div key={group} className="build-page__prop-group">
                    <label className="build-page__prop-label">{group}</label>
                    <div className="build-page__prop-options">
                      {config.options.map((opt) => (
                        <button
                          key={opt}
                          className={`build-page__prop-option ${selectedElement.variants[group] === opt ? 'build-page__prop-option--active' : ''}`}
                          onClick={() => handleVariantChange(selectedElement.id, group, opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Properties */}
                {selectedComponent.properties
                  .filter((prop) => prop.name !== 'Selected' && prop.name !== 'Skeleton')
                  .filter((prop) => {
                    if (!prop.showWhen) return true
                    return Object.entries(prop.showWhen).every(
                      ([key, val]) => selectedElement.variants[key] === val || selectedElement.properties[key] === val
                    )
                  })
                  .map((prop) => (
                  <div key={prop.name} className="build-page__prop-group">
                    <label className="build-page__prop-label">{prop.name}</label>
                    {prop.type === 'boolean' ? (
                      <label className="build-page__prop-toggle">
                        <input
                          type="checkbox"
                          checked={selectedElement.properties[prop.name] as boolean}
                          onChange={(e) =>
                            handlePropertyChange(selectedElement.id, prop.name, e.target.checked)
                          }
                        />
                        <span>{selectedElement.properties[prop.name] ? 'On' : 'Off'}</span>
                      </label>
                    ) : prop.type === 'number' ? (
                      <div className="build-page__prop-number-wrap">
                        <input
                          type="number"
                          className="build-page__prop-number"
                          min={prop.min ?? 0}
                          max={prop.max ?? 200}
                          value={Number(selectedElement.properties[prop.name]) || 0}
                          onChange={(e) =>
                            handlePropertyChange(selectedElement.id, prop.name, Number(e.target.value))
                          }
                        />
                        <span className="build-page__prop-unit">px</span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="build-page__prop-input"
                        value={String(selectedElement.properties[prop.name] || '')}
                        onChange={(e) =>
                          handlePropertyChange(selectedElement.id, prop.name, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="live-preview">
                <div className="live-preview__header">
                  <span className="live-preview__title">Live Preview</span>
                  <div className="live-preview__toolbar">
                    <button className="live-preview__dropdown">
                      <Icon name="mobile" category="technology" size={16} />
                      <span>Phone</span>
                      <Icon name="angle-down" category="arrows" size={16} />
                    </button>
                    <button className="live-preview__tool-btn">
                      <Icon name="magnifying-glass-plus" size={16} />
                    </button>
                    <button className="live-preview__tool-btn">
                      <Icon name="qr" category="media" size={16} />
                    </button>
                  </div>
                </div>
                <div className="live-preview__body">
                  <div className="live-preview__phone">
                    {/* Layer 1: Gray shell */}
                    <div className="live-preview__phone-shell app-scope" />
                    {/* Layer 3: Black bezel */}
                    <div className="live-preview__phone-bezel" />
                    {/* Layer 4: Screen */}
                    <div className="live-preview__phone-screen">
                      <div className={`live-preview__status-bar-bg app-scope${activePageId === pages[0]?.id ? ' live-preview__status-bar-bg--header' : ''}`} />
                      <PhoneStatusBar className={`live-preview__status-bar app-scope${activePageId === pages[0]?.id ? ' live-preview__status-bar--header' : ''}`} style={{ color: activePageId === pages[0]?.id ? 'var(--fg-inverse)' : 'var(--fg-primary, #000)' }} />
                      <div className="live-preview__content-scaler app-scope">
                        <div className="live-preview__content app-scope">
                          {(() => {
                            const activePage = pages.find((p) => p.id === activePageId) || pages[0]
                            const isFirstPage = activePage?.id === pages[0]?.id
                            return activePage ? (
                              <>
                              {isFirstPage && <AppHeader layout="Center" title={appTitle} subtitle={appSubtitle} />}
                              <div className={`themes-view__canvas${isFirstPage ? ' themes-view__canvas--first' : ''}`}>
                                <div className="themes-view__app">
                                  {activePage.elements.map((element) => {
                                    const comp = ComponentRegistry.get(element.componentId)
                                    if (!comp) return null
                                    const previewProps = {
                                      ...element.properties,
                                      'Add New Card': false,
                                      // Strip Shrinked in mobile preview so elements stretch full-width.
                                      // Button keeps its shrinked state — a full-width button is worse than a compact one.
                                      Shrinked: element.componentId === 'button' ? element.properties['Shrinked'] : false,
                                    }
                                    const isButtonShrinked = element.componentId === 'button' && element.properties['Shrinked'] === true
                                    return (
                                      <section key={element.id} className={`themes-view__section${isButtonShrinked ? ' themes-view__section--shrinked' : ''}`}>
                                        {comp.render(element.variants, previewProps, element.states)}
                                      </section>
                                    )
                                  })}
                                </div>
                              </div>
                              </>
                            ) : null
                          })()}
                        </div>
                      </div>
                      {pages.length > 1 && (
                        <div className="live-preview__bottom-nav app-scope">
                          <BottomNavigation
                            items={pages.slice(0, 5).map((p, i) => ({ icon: getPageIconName(p, i), label: p.name }))}
                            activeIndex={pages.slice(0, 5).findIndex((p) => p.id === activePageId)}
                            onItemClick={(index) => setActivePageId(pages[index].id)}
                          />
                        </div>
                      )}
                      <img src={phoneHomeIndicator} alt="" className="live-preview__home-indicator" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Slide 2: App Designer */}
          <div className="build-page__right-slide build-page__right-slide--designer" data-theme="dark">
            <AppDesigner
              onClose={handleCloseDesigner}
              targetSelector=".app-scope"
              isMobile={isMobileView}
              visible={rightPanel === 'designer'}
              renderIcon={(name, size) => <Icon name={name} category="editor" size={size} />}
              doneButton={<DSButton variant="filled" colorScheme="primary" shape="rounded" size="md" onClick={handleCloseDesigner}>Done</DSButton>}
            />
          </div>

        </div>
      </aside>
    </div>

    {/* Mobile: Bottom Bar (replaces floating buttons) */}
    {isMobileView && (
      <MobileBottomBar
        onElementsClick={() => {
          if (rightPanel === 'designer') setRightPanel('preview')
          setMobileElementsSheet(true)
        }}
        onDesignClick={() => {
          setMobileElementsSheet(false)
          setSelectedElementId(null)
          setRightPanel('designer')
        }}
        onPagesClick={() => {
          /* placeholder */
        }}
        onPreviewClick={() => {
          /* placeholder */
        }}
      />
    )}

    {/* Mobile: Add Element Bottom Sheet */}
    <BottomSheet
      open={mobileElementsSheet}
      onClose={() => setMobileElementsSheet(false)}
      title="App Elements"
      noOverlay
      dark
      renderCloseButton={(onClose) => (
        <button className="sidebar-panel__close" onClick={onClose}>
          <Icon name="xmark" category="general" size={20} />
        </button>
      )}
    >
      <div className="mobile-elements-sheet v2-sheet">
        <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'widgets' && <AiWidgetCard onClick={() => { setMobileElementsSheet(false); setAiWidgetModalOpen(true) }} />}
        {activeTab === 'widgets' && (
          <div className="mobile-elements-grid">
            {MOCK_WIDGETS.map((w) => (
              <button key={w.id} type="button" className="mobile-elements-grid__item">
                <div className="mobile-elements-grid__icon mobile-elements-grid__icon--color" style={{ background: w.bg }}>
                  {w.render()}
                </div>
                <span className="mobile-elements-grid__label">{w.name.replace('\n', ' ')}</span>
              </button>
            ))}
          </div>
        )}
        {activeTab === 'basic' && activeGroups.map((group, groupIndex) => {
          const validItems = group.elementIds.map((id) => componentMap[id]).filter(Boolean)
          if (validItems.length === 0) return null
          return (
            <div key={group.label || groupIndex}>
              {group.label && (
                <div className="mobile-elements-grid__separator">{group.label}</div>
              )}
              <div className="mobile-elements-grid">
                {validItems.map((comp) => {
                  const iconInfo = ELEMENT_ICON_MAP[comp.id]
                  return (
                    <button
                      key={comp.id}
                      className="mobile-elements-grid__item"
                      onClick={() => { handleAddElement(comp); }}
                    >
                      <div className="mobile-elements-grid__icon">
                        {iconInfo ? (
                          <Icon name={iconInfo.icon} category={iconInfo.iconCategory} size={24} />
                        ) : (
                          <Icon name="grid-2-filled" category="layout" size={24} />
                        )}
                      </div>
                      <span className="mobile-elements-grid__label">{comp.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </BottomSheet>

    <AiWidgetModal open={aiWidgetModalOpen} onClose={() => setAiWidgetModalOpen(false)} onGenerate={handleAiGenerate} />

    </>
  )
}
