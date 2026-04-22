// Icon Library Provider
export { IconLibraryProvider } from './context/IconLibraryContext';

// Component Registry & Types
export { ComponentRegistry } from './types/registry';
export type { RegisteredComponent } from './types/registry';
export type {
  ComponentDefinition,
  VariantGroup,
  ComponentProperty,
  ComponentState,
  PropDoc,
  ColorToken,
  VariantValues,
  PropertyValues,
  StateValues,
} from './types/component';

// Register all components (side-effect imports)
import './components/Card/register';
import './components/Button/register';
import './components/DonationBox/register';
import './components/ProductList/register';
import './components/Heading/register';
import './components/List/register';
import './components/Document/register';
import './components/SignDocument/register';
import './components/ImageGallery/register';
import './components/SocialFollow/register';
import './components/Form/register';
import './components/Table/register';
import './components/Testimonial/register';
import './components/DailyTaskManager/register';
import './components/ColorPicker/register';
import './components/EmptyState/register';
import './components/Chart/register';
import './components/AppHeader/register';
import './components/LoginSignup/register';
import './components/BottomNavigation/register';
import './components/Paragraph/register';
import './components/ProgressIndicator/register';
import './components/CamperCard/register';
import './components/Spacer/register';

// Individual component exports
export { Button } from './components/Button';
export { Card } from './components/Card';
export { Heading } from './components/Heading';
export { Form } from './components/Form';
export { Table } from './components/Table';
export { List } from './components/List';
export { Chart } from './components/Chart';
export { Paragraph } from './components/Paragraph';
export { AppHeader } from './components/AppHeader';
export { BottomNavigation } from './components/BottomNavigation';
export { LoginSignup } from './components/LoginSignup';
export { ProductList } from './components/ProductList';
export { ImageGallery } from './components/ImageGallery';
export { Document } from './components/Document';
export { SignDocument } from './components/SignDocument';
export { DonationBox } from './components/DonationBox';
export { EmptyState } from './components/EmptyState';
export { Testimonial } from './components/Testimonial';
export { SocialFollow } from './components/SocialFollow';
export { DailyTaskManager } from './components/DailyTaskManager';
export { ProgressIndicator } from './components/ProgressIndicator';
export { CamperCard } from './components/CamperCard';
export { Spacer } from './components/Spacer';

// Layout
export { AppDesigner, applyDefaultTheme } from './layout/AppDesigner';
export { BottomSheet } from './layout/components/BottomSheet';
