import { ComponentRegistry } from '../../types/registry';
import { ProductList, type ProductItem } from './ProductList';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import productListScss from './ProductList.scss?raw';

ComponentRegistry.register({
  id: 'product-list',
  name: 'Product List',
  category: 'Data Display',
  icon: 'ShoppingCart',

  variants: {
    Layout: {
      options: ['List', 'Grid'],
      default: 'Grid',
    },
  },

  properties: [
    { name: 'Title', type: 'text', default: 'Products' },
    { name: 'Subtitle', type: 'text', default: '' },
    { name: 'Currency', type: 'text', default: '$' },
    { name: 'Search Placeholder', type: 'text', default: 'Search Products' },
    { name: 'Button Label', type: 'text', default: 'Add to Cart' },
    { name: 'Show Toolbar', type: 'boolean', default: true },
    { name: 'Show Images', type: 'boolean', default: false },
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Add New Card', type: 'boolean', default: true },
    { name: 'Skeleton', type: 'boolean', default: false },
    { name: 'Products', type: 'text', default: JSON.stringify([{ name: 'Product Name', price: '10.00' }]) },
  ],

  states: [],

  scss: productListScss,

  colorTokens: [
    { token: 'Title', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Search Placeholder', variable: '--fg-disabled', value: '#979DC6', description: '--fg-disabled → neutral-300' },
    { token: 'Layout Icon', variable: '--fg-disabled', value: '#979DC6', description: '--fg-disabled → neutral-300' },
    { token: 'Layout Active', variable: '--fg-brand', value: '#7D38EF', description: '--fg-brand → primary-600' },
    { token: 'Item Border', variable: '--border', value: '#DADEF3', description: '--border → neutral-100' },
    { token: 'Image BG', variable: '--bg-surface-brand', value: '#EDE8FE', description: '--bg-surface-brand → primary-100' },
    { token: 'Product Name', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
    { token: 'Like Icon', variable: '--fg-primary', value: '#091141', description: '--fg-primary → neutral-900' },
  ],

  usage: `import { ProductList } from '@/components/ProductList';

// Two-column card grid with title and search
<ProductList
  layout="TwoColumns"
  title="Products"
  products={[
    { name: "Wireless Headphones", price: "$59.99" },
    { name: "USB-C Cable", price: "$12.00" },
    { name: "Phone Case", price: "$24.99" },
    { name: "Power Bank", price: "$35.00" },
  ]}
/>

// Three-column grid
<ProductList
  layout="ThreeColumns"
  title="Featured Items"
  buttonLabel="Buy Now"
  products={[
    { name: "Sneakers", price: "$89.00" },
    { name: "T-Shirt", price: "$29.00" },
    { name: "Jacket", price: "$120.00" },
  ]}
/>

// Single-column horizontal list
<ProductList
  layout="SingleColumn"
  title="Plans"
  searchPlaceholder="Search plans..."
  products={[
    { name: "Premium Plan", price: "$9.99/mo" },
    { name: "Basic Plan", price: "$4.99/mo" },
  ]}
/>`,

  propDocs: [
    {
      name: 'layout',
      type: '"ThreeColumns" | "TwoColumns" | "SingleColumn"',
      default: '"TwoColumns"',
      description:
        'Controls the grid layout. **ThreeColumns** and **TwoColumns** render vertical product cards with image on top. **SingleColumn** renders horizontal rows. Users can switch layout via the toolbar icons.',
    },
    {
      name: 'title',
      type: 'string',
      default: '"Products"',
      description:
        'The heading text above the search bar. Rendered with `Paragraph/Large/Bold` (18px, semibold, `fg-primary`).',
    },
    {
      name: 'searchPlaceholder',
      type: 'string',
      default: '"Search Products"',
      description:
        'Placeholder text shown in the search input field.',
    },
    {
      name: 'products',
      type: 'ProductItem[]',
      default: '[{name, price}, ...]',
      description:
        'Array of product objects. Each item has a `name` (`Paragraph/Medium/Medium`, 16px) and `price` (`Paragraph/Large/Bold`, 18px). Includes a heart/like button and an "Add to Cart" action button.',
    },
    {
      name: 'buttonLabel',
      type: 'string',
      default: '"Add to Cart"',
      description:
        'Text on the action button for each product. Uses the shared `Button` component.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, applies a 2px `border-info` border around the entire product list.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, _states: StateValues, onPropertyChange?: (name: string, value: string | boolean | number) => void): React.ReactNode {
    const showImages = props['Show Images'] as boolean;
    let products: ProductItem[] | undefined;
    try {
      products = JSON.parse(props['Products'] as string);
    } catch {
      products = undefined;
    }
    if (showImages) {
      products = (products || []).map((p) => ({
        ...p,
        image: p.image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop`,
      }));
    }
    return (
      <ProductList
        layout={variants['Layout'] === 'List' ? 'SingleColumn' : 'TwoColumns'}
        title={props['Title'] as string}
        subtitle={props['Subtitle'] as string}
        currency={props['Currency'] as string}
        showToolbar={props['Show Toolbar'] as boolean}
        searchPlaceholder={props['Search Placeholder'] as string}
        buttonLabel={props['Button Label'] as string}
        selected={props['Selected'] as boolean}
        products={products}
        showAddNew={props['Add New Card'] as boolean}
        skeleton={props['Skeleton'] as boolean}
        onProductsChange={onPropertyChange ? (newProducts) => onPropertyChange('Products', JSON.stringify(newProducts)) : undefined}
      />
    );
  },
});
