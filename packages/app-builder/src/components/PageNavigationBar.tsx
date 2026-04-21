import { useState, useRef, useCallback, useEffect, useMemo, type FC } from 'react'
import { createPortal } from 'react-dom'
import { Icon, Button, SearchInput } from '@jf/design-system'
import { icons as lucideIcons } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface PageTab {
  id: string
  name: string
  icon?: string
  iconCategory?: string
}

interface PageNavigationBarProps {
  pages: PageTab[]
  activePageId: string
  onPageSelect: (pageId: string) => void
  onPageReorder: (pages: PageTab[]) => void
  onPageRename: (pageId: string, name: string) => void
  onChangeIcon: (pageId: string, icon: string) => void
  onDeletePage: (pageId: string) => void
  onAddPage: () => void
}

export const DEFAULT_PAGE_ICON = 'FileText'

export function getPageIconName(page: PageTab, _index: number): string {
  return page.icon || DEFAULT_PAGE_ICON
}

function LucideIcon({ name, size = 18 }: { name: string; size?: number }) {
  const IconComp = lucideIcons[name as keyof typeof lucideIcons] as FC<{ size?: number }> | undefined
  if (!IconComp) return null
  return <IconComp size={size} />
}

const ALL_ICON_NAMES = Object.keys(lucideIcons).filter(
  (name) => name !== 'createLucideIcon' && name !== 'icons' && name !== 'default' && /^[A-Z]/.test(name)
)

const POPULAR_ICONS = [
  // Core nav
  'Home', 'Search', 'Settings', 'User', 'Heart', 'Star', 'Bell', 'ShoppingCart',
  'MessageCircle', 'Mail', 'Phone', 'MapPin', 'Navigation', 'Calendar', 'Clock',
  // Media & content
  'Camera', 'Image', 'Play', 'Music', 'Bookmark', 'Tag', 'Gift',
  'CreditCard', 'Wallet', 'QrCode', 'ScanLine', 'Barcode',
  // Data & progress
  'BarChart3', 'TrendingUp', 'PieChart', 'Activity', 'Target', 'Gauge',
  // Files & actions
  'FileText', 'Folder', 'Download', 'Upload', 'Share2', 'Send',
  // Status & info
  'CheckCircle2', 'AlertCircle', 'Info', 'HelpCircle', 'ShieldCheck',
  // Interaction
  'Plus', 'Menu', 'Filter', 'SlidersHorizontal', 'ListFilter',
  'Eye', 'Lock', 'Unlock', 'LogIn', 'LogOut',
  // Environment
  'Sun', 'Moon', 'Cloud', 'Flame', 'Zap', 'Sparkles',
  // Lifestyle
  'Coffee', 'Utensils', 'Dumbbell', 'Bike', 'Car', 'Plane', 'Train', 'Ship',
  // Work & education
  'Briefcase', 'GraduationCap', 'Stethoscope', 'Palette', 'Wrench', 'Hammer',
  // Tech
  'Code', 'Terminal', 'Database', 'Cpu', 'Smartphone', 'Laptop', 'Globe', 'Wifi',
  // People & social
  'Users', 'UserPlus', 'CircleUser', 'HandHeart', 'ThumbsUp', 'PartyPopper',
  // Shapes & layout
  'Layers', 'Grid3X3', 'LayoutDashboard', 'Compass', 'Map',
  // Rewards
  'Trophy', 'Medal', 'Crown', 'Gem', 'Rocket',
  // Objects
  'Key', 'Lightbulb', 'Megaphone', 'Newspaper', 'Package', 'Truck',
  'Store', 'Building2', 'Landmark', 'Trees', 'Flower2', 'Leaf',
  'PawPrint', 'Cat', 'Dog', 'Fish', 'Bird',
  'Shirt', 'Watch', 'Glasses', 'Umbrella',
]

const ITEM_SIZE = 42 // 40px + 2px gap
const GRID_PADDING = 8 // --ds-space-sm
const OVERSCAN = 2 // extra rows above/below viewport

function IconPickerPopover({
  value,
  anchorPos,
  onSelect,
  onClose,
}: {
  value: string
  anchorPos: { top: number; left: number }
  onSelect: (icon: string) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const [tooltip, setTooltip] = useState<{ name: string; top: number; left: number } | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const tooltipTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [cols, setCols] = useState(7)

  const filtered = useMemo(() => {
    const popularSet = new Set(POPULAR_ICONS)
    const popular = POPULAR_ICONS.filter((name) => ALL_ICON_NAMES.includes(name))
    const rest = ALL_ICON_NAMES.filter((name) => !popularSet.has(name))
    let icons = [...popular, ...rest]
    // Move current icon to the front
    if (value && icons.includes(value)) {
      icons = [value, ...icons.filter((name) => name !== value)]
    }
    if (search) {
      const q = search.toLowerCase()
      icons = icons.filter((name) => name.toLowerCase().includes(q))
    }
    return icons
  }, [search, value])

  // Measure columns from grid width
  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const measure = () => {
      const width = el.clientWidth - GRID_PADDING * 2
      setCols(Math.max(1, Math.floor(width / ITEM_SIZE)))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const totalRows = Math.ceil(filtered.length / cols)
  const totalHeight = totalRows * ITEM_SIZE
  const gridViewHeight = gridRef.current?.clientHeight ?? 300

  const startRow = Math.max(0, Math.floor(scrollTop / ITEM_SIZE) - OVERSCAN)
  const endRow = Math.min(totalRows, Math.ceil((scrollTop + gridViewHeight) / ITEM_SIZE) + OVERSCAN)

  const visibleItems = useMemo(() => {
    const items: { name: string; row: number; col: number }[] = []
    for (let row = startRow; row < endRow; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col
        if (idx < filtered.length) {
          items.push({ name: filtered[idx], row, col })
        }
      }
    }
    return items
  }, [filtered, startRow, endRow, cols])

  // Close on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [onClose])

  // Reset scroll on search/category change
  useEffect(() => {
    if (gridRef.current) gridRef.current.scrollTop = 0
    setScrollTop(0)
  }, [search])

  return (<>
    {createPortal(
    <div
      ref={popoverRef}
      className="icon-picker-popover"
      data-theme="dark"
      style={{ top: anchorPos.top, left: anchorPos.left }}
    >
      <div className="icon-picker-popover__header">
        <h2>Select Icon</h2>
        <button className="icon-picker-popover__close" onClick={onClose}>
          <LucideIcon name="X" size={18} />
        </button>
      </div>
      <div className="icon-picker-popover__search">
        <SearchInput
          size="md"
          placeholder={`Search ${filtered.length} icons...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          autoFocus={false}
        />
      </div>
      <div
        ref={gridRef}
        className="icon-picker-popover__grid"
        onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
      >
        {filtered.length === 0 && (
          <span className="icon-picker-popover__empty"><LucideIcon name="Frown" size={32} />No icons found</span>
        )}
        {filtered.length > 0 && (
          <div style={{ height: totalHeight, position: 'relative' }}>
            {visibleItems.map(({ name, row, col }) => (
              <button
                key={name}
                className={`icon-picker-popover__item${name === value ? ' icon-picker-popover__item--active' : ''}`}
                style={{
                  position: 'absolute',
                  top: row * ITEM_SIZE,
                  left: col * ITEM_SIZE,
                  width: ITEM_SIZE - 2,
                  height: ITEM_SIZE - 2,
                }}
                onClick={() => onSelect(name)}
                onMouseEnter={(e) => {
                  const target = e.currentTarget
                  if (tooltipTimer.current) clearTimeout(tooltipTimer.current)
                  tooltipTimer.current = setTimeout(() => {
                    const rect = target.getBoundingClientRect()
                    setTooltip({
                      name,
                      top: rect.top,
                      left: rect.left + rect.width / 2,
                    })
                  }, 400)
                }}
                onMouseLeave={() => {
                  if (tooltipTimer.current) clearTimeout(tooltipTimer.current)
                  setTooltip(null)
                }}
              >
                <LucideIcon name={name} size={20} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  )}
  {tooltip && createPortal(
    <div
      className="icon-picker-popover__tooltip"
      style={{ top: tooltip.top, left: tooltip.left }}
    >
      {tooltip.name}
    </div>,
    document.body
  )}
  </>)
}

function PageContextMenu({
  isFirstPage,
  onChangeIcon,
  onHidePage,
  onRequireLogin,
  onRename,
  onDelete,
}: {
  isFirstPage: boolean
  onChangeIcon: () => void
  onHidePage: () => void
  onRequireLogin: () => void
  onRename: () => void
  onDelete: () => void
}) {
  return (
    <>
      <button className="page-nav__context-item" onClick={onChangeIcon}>
        <Icon name="arrows-rotate" category="arrows" size={20} />
        <span>Change Icon</span>
      </button>
      <button className="page-nav__context-item" onClick={onHidePage}>
        <Icon name="eye-slash-filled" category="general" size={20} />
        <span>Hide Page</span>
      </button>
      <button className="page-nav__context-item" onClick={onRequireLogin}>
        <Icon name="lock-filled" category="security" size={20} />
        <span>Require Login</span>
      </button>
      <button className="page-nav__context-item" onClick={onRename}>
        <Icon name="pencil-line-filled" category="editor" size={20} />
        <span>Rename</span>
      </button>
      <button className={`page-nav__context-item${isFirstPage ? ' page-nav__context-item--disabled' : ' page-nav__context-item--danger'}`} onClick={isFirstPage ? undefined : onDelete} disabled={isFirstPage}>
        <Icon name="trash-filled" category="general" size={20} />
        <span>Delete</span>
      </button>
    </>
  )
}

function SortablePageTab({
  page,
  index,
  isActive,
  isFirstPage,
  onSelect,
  onRename,
  onChangeIcon,
  onDelete,
}: {
  page: PageTab
  index: number
  isActive: boolean
  isFirstPage: boolean
  onSelect: () => void
  onRename: (name: string) => void
  onChangeIcon: (icon: string) => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id })
  const [editing, setEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const [iconPickerOpen, setIconPickerOpen] = useState(false)
  const [iconPickerPos, setIconPickerPos] = useState({ top: 0, left: 0 })
  const nameRef = useRef<HTMLSpanElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuTriggerRef = useRef<HTMLSpanElement>(null)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const iconName = getPageIconName(page, index)

  const startEditing = () => {
    setMenuOpen(false)
    setEditing(true)
    requestAnimationFrame(() => {
      if (!nameRef.current) return
      nameRef.current.focus()
      const range = document.createRange()
      range.selectNodeContents(nameRef.current)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    })
  }

  const finishEditing = () => {
    setEditing(false)
    const text = nameRef.current?.textContent?.trim()
    if (text && text !== page.name) {
      onRename(text)
    } else if (nameRef.current) {
      nameRef.current.textContent = page.name
    }
  }

  // Close context menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        menuTriggerRef.current && !menuTriggerRef.current.contains(target)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`page-nav__tab${isActive ? ' page-nav__tab--active' : ''}${editing ? ' page-nav__tab--editing' : ''}`}
      data-page-tab={page.id}
      onClick={() => { if (!editing) onSelect() }}
    >
      <span className="page-nav__tab-icon-wrapper" {...attributes} {...listeners}>
        <span className="page-nav__tab-icon">
          <LucideIcon name={iconName} size={18} />
        </span>
        <span className="page-nav__tab-drag">
          <Icon name="grid-dots-vertical" category="general" size={18} />
        </span>
      </span>
      <span
        ref={nameRef}
        className="page-nav__tab-name"
        contentEditable={editing}
        suppressContentEditableWarning
        onClick={(e) => { e.stopPropagation(); startEditing() }}
        onBlur={finishEditing}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); finishEditing() }
          if (e.key === 'Escape') { setEditing(false); if (nameRef.current) nameRef.current.textContent = page.name; nameRef.current?.blur() }
        }}
      >
        {page.name}
      </span>
      <span
        className="page-nav__tab-menu"
        ref={menuTriggerRef}
        onClick={(e) => {
          e.stopPropagation()
          if (!menuOpen && menuTriggerRef.current) {
            const rect = menuTriggerRef.current.getBoundingClientRect()
            setMenuPos({ top: rect.top, left: rect.left + rect.width / 2 })
          }
          setMenuOpen(!menuOpen)
        }}
      >
        <Icon name="ellipsis-vertical" category="general" size={18} />
      </span>
      {menuOpen && createPortal(
        <div ref={menuRef} className="page-nav__context-menu" style={{ top: menuPos.top, left: menuPos.left }}>
          <PageContextMenu
            isFirstPage={isFirstPage}
            onChangeIcon={() => {
              setMenuOpen(false)
              if (menuTriggerRef.current) {
                const rect = menuTriggerRef.current.getBoundingClientRect()
                setIconPickerPos({ top: rect.top, left: rect.left + rect.width / 2 })
              }
              setIconPickerOpen(true)
            }}
            onHidePage={() => setMenuOpen(false)}
            onRequireLogin={() => setMenuOpen(false)}
            onRename={startEditing}
            onDelete={() => { setMenuOpen(false); onDelete() }}
          />
        </div>,
        document.body
      )}
      {iconPickerOpen && (
        <IconPickerPopover
          value={iconName}
          anchorPos={iconPickerPos}
          onSelect={(icon) => {
            onChangeIcon(icon)
            setIconPickerOpen(false)
          }}
          onClose={() => setIconPickerOpen(false)}
        />
      )}
    </div>
  )
}

function DragOverlayTab({ page, index }: { page: PageTab; index: number }) {
  const iconName = getPageIconName(page, index)
  return (
    <div className="page-nav__tab page-nav__tab--dragging">
      <span className="page-nav__tab-icon" style={{ opacity: 1 }}>
        <LucideIcon name={iconName} size={18} />
      </span>
      <span className="page-nav__tab-name">{page.name}</span>
    </div>
  )
}

export function PageNavigationBar({
  pages,
  activePageId,
  onPageSelect,
  onPageReorder,
  onPageRename,
  onChangeIcon,
  onDeletePage,
  onAddPage,
}: PageNavigationBarProps) {
  const [dragActiveId, setDragActiveId] = useState<string | null>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const pagesRef = useRef<HTMLDivElement>(null)

  const checkOverflow = useCallback(() => {
    const el = pagesRef.current
    if (!el) return
    const hasMore = el.scrollWidth - el.scrollLeft - el.clientWidth > 1
    setIsOverflowing(hasMore)
  }, [])

  useEffect(() => {
    const el = pagesRef.current
    if (!el) return
    checkOverflow()
    const observer = new ResizeObserver(checkOverflow)
    observer.observe(el)
    el.addEventListener('scroll', checkOverflow, { passive: true })
    return () => { observer.disconnect(); el.removeEventListener('scroll', checkOverflow) }
  }, [pages.length, checkOverflow])

  // Auto-scroll nav bar to show active page tab
  useEffect(() => {
    const container = pagesRef.current
    if (!container) return
    requestAnimationFrame(() => {
      const activeTab = container.querySelector(`[data-page-tab="${activePageId}"]`) as HTMLElement
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
      }
      // Re-check after scroll + layout settles
      setTimeout(checkOverflow, 400)
    })
  }, [activePageId, pages.length, checkOverflow])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDragActiveId(String(event.active.id))
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setDragActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = pages.findIndex((p) => p.id === active.id)
    const newIndex = pages.findIndex((p) => p.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      onPageReorder(arrayMove(pages, oldIndex, newIndex))
    }
  }, [pages, onPageReorder])

  const draggedPage = dragActiveId ? pages.find((p) => p.id === dragActiveId) : null
  const draggedIndex = dragActiveId ? pages.findIndex((p) => p.id === dragActiveId) : -1

  return (
    <div className="page-nav">
      <div className="page-nav__pages-wrapper">
      {isOverflowing && <div className="page-nav__fade" />}
      <div className="page-nav__pages" ref={pagesRef}>
        <DndContext
          id="page-nav-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={pages.map((p) => p.id)} strategy={horizontalListSortingStrategy}>
            {pages.map((page, index) => (
              <SortablePageTab
                key={page.id}
                page={page}
                index={index}
                isActive={page.id === activePageId}
                isFirstPage={index === 0}
                onSelect={() => onPageSelect(page.id)}
                onRename={(name) => onPageRename(page.id, name)}
                onChangeIcon={(icon) => onChangeIcon(page.id, icon)}
                onDelete={() => onDeletePage(page.id)}
              />
            ))}
          </SortableContext>
          <DragOverlay>
            {draggedPage ? (
              <DragOverlayTab page={draggedPage} index={draggedIndex} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      </div>
      <Button
        variant="ghost"
        colorScheme="secondary"
        shape="rectangle"
        size="md"
        leftIcon={<Icon name="plus-circle-filled" category="general" size={20} />}
        onClick={onAddPage}
        className="page-nav__add-page"
      >
        Add Page
      </Button>
      <div className="page-nav__end">
        <div className="page-nav__divider" />
        <Button
          variant="ghost"
          colorScheme="secondary"
          shape="rectangle"
          size="md"
          leftIcon={<Icon name="gear-filled" category="general" size={20} />}
        >
          Settings
        </Button>
      </div>
    </div>
  )
}
