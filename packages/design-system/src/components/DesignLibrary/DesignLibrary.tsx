import { useState } from 'react';
import logoLight from '../../assets/jf-design-system-logo-light.svg';
import logoDark from '../../assets/jf-design-system-logo.svg';
import { ColorsSection } from './sections/ColorsSection';
import { TypographySection } from './sections/TypographySection';
import { SpacingSection } from './sections/SpacingSection';
import { ShadowsSection } from './sections/ShadowsSection';
import { RadiusSection } from './sections/RadiusSection';
import { IconsSection } from './sections/IconsSection';
import { ButtonSection, ButtonPanel, defaultButtonState } from './sections/ButtonSection';
import type { ButtonPanelState } from './sections/ButtonSection';
import { InputSection, InputPanel, defaultSearchInputState } from './sections/InputSection';
import type { SearchInputPanelState } from './sections/InputSection';
import { BasicInputSection, BasicInputPanel, defaultBasicInputState } from './sections/BasicInputSection';
import type { BasicInputPanelState } from './sections/BasicInputSection';
import { DateInputSection, DateInputPanel, defaultDateInputState } from './sections/DateInputSection';
import type { DateInputPanelState } from './sections/DateInputSection';
import { UrlInputSection, UrlInputPanel, defaultUrlInputState } from './sections/UrlInputSection';
import type { UrlInputPanelState } from './sections/UrlInputSection';
import { NumberInputSection, NumberInputPanel, defaultNumberInputState } from './sections/NumberInputSection';
import type { NumberInputPanelState } from './sections/NumberInputSection';
import { ColorInputSection, ColorInputPanel, defaultColorInputState } from './sections/ColorInputSection';
import type { ColorInputPanelState } from './sections/ColorInputSection';
import { TextAreaSection, TextAreaPanel, defaultTextAreaState } from './sections/TextAreaSection';
import type { TextAreaPanelState } from './sections/TextAreaSection';
import { RadioButtonSection, RadioButtonPanel, defaultRadioButtonState } from './sections/RadioButtonSection';
import type { RadioButtonPanelState } from './sections/RadioButtonSection';
import { CheckboxSection, CheckboxPanel, defaultCheckboxState } from './sections/CheckboxSection';
import type { CheckboxPanelState } from './sections/CheckboxSection';
import { DropdownSection, DropdownPanel, defaultDropdownState } from './sections/DropdownSection';
import type { DropdownPanelState } from './sections/DropdownSection';
import { ToggleSection, TogglePanel, defaultToggleState } from './sections/ToggleSection';
import type { TogglePanelState } from './sections/ToggleSection';
import { ModalSection, ModalPanel, defaultModalState } from './sections/ModalSection';
import type { ModalPanelState } from './sections/ModalSection';
import { LinkSection, LinkPanel, defaultLinkState } from './sections/LinkSection';
import type { LinkPanelState } from './sections/LinkSection';
import { BadgeSection, BadgePanel, defaultBadgeState } from './sections/BadgeSection';
import type { BadgePanelState } from './sections/BadgeSection';
import { IndicatorSection, IndicatorPanel, defaultIndicatorState } from './sections/IndicatorSection';
import type { IndicatorPanelState } from './sections/IndicatorSection';
import './DesignLibrary.scss';

const FOUNDATIONS = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'shadows', label: 'Shadows' },
  { id: 'radius', label: 'Border Radius' },
  { id: 'icons', label: 'Icons' },
] as const;

const COMPONENTS = [
  { id: 'button', label: 'Button' },
  { id: 'basic-input', label: 'Input' },
  { id: 'date-input', label: 'Date Input' },
  { id: 'color-input', label: 'Color Input' },
  { id: 'number-input', label: 'Number Input' },
  { id: 'textarea', label: 'Text Area' },
  { id: 'url-input', label: 'URL Input' },
  { id: 'search-input', label: 'Search Input' },
  { id: 'radio-button', label: 'Radio Button' },
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'dropdown', label: 'Dropdown' },
  { id: 'toggle', label: 'Toggle' },
  { id: 'modal', label: 'Modal' },
  { id: 'link', label: 'Link' },
  { id: 'badge', label: 'Badge' },
  { id: 'indicator', label: 'Indicator' },
] as const;

const ALL_ITEMS = [...FOUNDATIONS, ...COMPONENTS] as const;
type SectionId = (typeof ALL_ITEMS)[number]['id'];

const COMPONENT_IDS = new Set<string>(COMPONENTS.map((c) => c.id));

export function DesignLibrary() {
  const [activeSection, setActiveSection] = useState<SectionId>('colors');
  const [navOpen, setNavOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [buttonState, setButtonState] = useState<ButtonPanelState>(defaultButtonState);
  const [basicInputState, setBasicInputState] = useState<BasicInputPanelState>(defaultBasicInputState);
  const [dateInputState, setDateInputState] = useState<DateInputPanelState>(defaultDateInputState);
  const [urlInputState, setUrlInputState] = useState<UrlInputPanelState>(defaultUrlInputState);
  const [colorInputState, setColorInputState] = useState<ColorInputPanelState>(defaultColorInputState);
  const [numberInputState, setNumberInputState] = useState<NumberInputPanelState>(defaultNumberInputState);
  const [textAreaState, setTextAreaState] = useState<TextAreaPanelState>(defaultTextAreaState);
  const [searchInputState, setSearchInputState] = useState<SearchInputPanelState>(defaultSearchInputState);
  const [radioButtonState, setRadioButtonState] = useState<RadioButtonPanelState>(defaultRadioButtonState);
  const [checkboxState, setCheckboxState] = useState<CheckboxPanelState>(defaultCheckboxState);
  const [dropdownState, setDropdownState] = useState<DropdownPanelState>(defaultDropdownState);
  const [toggleState, setToggleState] = useState<TogglePanelState>(defaultToggleState);
  const [modalState, setModalState] = useState<ModalPanelState>(defaultModalState);
  const [linkState, setLinkState] = useState<LinkPanelState>(defaultLinkState);
  const [badgeState, setBadgeState] = useState<BadgePanelState>(defaultBadgeState);
  const [indicatorState, setIndicatorState] = useState<IndicatorPanelState>(defaultIndicatorState);

  const hasPanel = COMPONENT_IDS.has(activeSection as string);

  const renderSection = () => {
    switch (activeSection) {
      case 'colors':
        return <ColorsSection />;
      case 'typography':
        return <TypographySection />;
      case 'spacing':
        return <SpacingSection />;
      case 'shadows':
        return <ShadowsSection />;
      case 'radius':
        return <RadiusSection />;
      case 'icons':
        return <IconsSection />;
      case 'button':
        return <ButtonSection panelState={buttonState} />;
      case 'basic-input':
        return <BasicInputSection state={basicInputState} />;
      case 'date-input':
        return <DateInputSection state={dateInputState} />;
      case 'color-input':
        return <ColorInputSection state={colorInputState} />;
      case 'number-input':
        return <NumberInputSection state={numberInputState} />;
      case 'textarea':
        return <TextAreaSection state={textAreaState} />;
      case 'url-input':
        return <UrlInputSection state={urlInputState} />;
      case 'search-input':
        return <InputSection searchState={searchInputState} />;
      case 'radio-button':
        return <RadioButtonSection state={radioButtonState} />;
      case 'checkbox':
        return <CheckboxSection state={checkboxState} />;
      case 'dropdown':
        return <DropdownSection state={dropdownState} />;
      case 'toggle':
        return <ToggleSection state={toggleState} />;
      case 'modal':
        return <ModalSection state={modalState} />;
      case 'link':
        return <LinkSection state={linkState} />;
      case 'badge':
        return <BadgeSection state={badgeState} />;
      case 'indicator':
        return <IndicatorSection state={indicatorState} />;
    }
  };

  const renderPanel = () => {
    switch (activeSection) {
      case 'button':
        return <ButtonPanel state={buttonState} onChange={setButtonState} />;
      case 'basic-input':
        return <BasicInputPanel state={basicInputState} onChange={setBasicInputState} />;
      case 'date-input':
        return <DateInputPanel state={dateInputState} onChange={setDateInputState} />;
      case 'color-input':
        return <ColorInputPanel state={colorInputState} onChange={setColorInputState} />;
      case 'number-input':
        return <NumberInputPanel state={numberInputState} onChange={setNumberInputState} />;
      case 'textarea':
        return <TextAreaPanel state={textAreaState} onChange={setTextAreaState} />;
      case 'url-input':
        return <UrlInputPanel state={urlInputState} onChange={setUrlInputState} />;
      case 'search-input':
        return (
          <InputPanel
            searchState={searchInputState}
            onSearchStateChange={setSearchInputState}
          />
        );
      case 'radio-button':
        return <RadioButtonPanel state={radioButtonState} onChange={setRadioButtonState} />;
      case 'checkbox':
        return <CheckboxPanel state={checkboxState} onChange={setCheckboxState} />;
      case 'dropdown':
        return <DropdownPanel state={dropdownState} onChange={setDropdownState} />;
      case 'toggle':
        return <TogglePanel state={toggleState} onChange={setToggleState} />;
      case 'modal':
        return <ModalPanel state={modalState} onChange={setModalState} />;
      case 'link':
        return <LinkPanel state={linkState} onChange={setLinkState} />;
      case 'badge':
        return <BadgePanel state={badgeState} onChange={setBadgeState} />;
      case 'indicator':
        return <IndicatorPanel state={indicatorState} onChange={setIndicatorState} />;
      default:
        return null;
    }
  };

  const activeLabel = ALL_ITEMS.find((i) => i.id === activeSection)?.label ?? '';

  const rootClass = [
    'dl',
    hasPanel && 'dl--has-panel',
    navOpen && 'dl--nav-open',
    panelOpen && hasPanel && 'dl--panel-open',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      <header className="dl__topbar">
        <button
          type="button"
          className="dl__topbar-btn"
          aria-label="Open navigation"
          onClick={() => setNavOpen(true)}
        >
          <span className="dl__hamburger" />
        </button>
        <span className="dl__topbar-title">{activeLabel}</span>
        {hasPanel && (
          <button
            type="button"
            className="dl__topbar-btn"
            aria-label="Open properties"
            onClick={() => setPanelOpen(true)}
          >
            <span className="dl__gear" />
          </button>
        )}
      </header>
      <div
        className="dl__scrim"
        onClick={() => {
          setNavOpen(false);
          setPanelOpen(false);
        }}
      />
      <aside className="dl__sidebar">
        <div className="dl__logo">
          <img src={logoLight} alt="JotForm Design System" className="dl__logo-img dl__logo-img--light" />
          <img src={logoDark} alt="JotForm Design System" className="dl__logo-img dl__logo-img--dark" />
        </div>
        <nav className="dl__nav">
          <p className="dl__nav-title">Foundations</p>
          {FOUNDATIONS.map((item) => (
            <button
              key={item.id}
              className={`dl__nav-item ${activeSection === item.id ? 'dl__nav-item--active' : ''}`}
              onClick={() => {
                setActiveSection(item.id);
                setNavOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
          <p className="dl__nav-title">Components</p>
          {COMPONENTS.map((item) => (
            <button
              key={item.id}
              className={`dl__nav-item ${activeSection === item.id ? 'dl__nav-item--active' : ''}`}
              onClick={() => {
                setActiveSection(item.id);
                setNavOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="dl__content">
        {renderSection()}
      </main>

      {hasPanel && (
        <aside className="dl__panel">
          <h3 className="dl__panel-title">Properties</h3>
          {renderPanel()}
        </aside>
      )}
    </div>
  );
}
