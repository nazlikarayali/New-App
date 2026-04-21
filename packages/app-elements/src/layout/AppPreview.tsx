import { useState } from 'react';
import { Icon } from '../components/Icon/Icon';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Heading } from '../components/Heading';
import { List } from '../components/List';
import { ProductList } from '../components/ProductList';
import { Form } from '../components/Form';
import { DailyTaskManager } from '../components/DailyTaskManager/DailyTaskManager';
import { DonationBox } from '../components/DonationBox';
import { Chart } from '../components/Chart/Chart';
import { Testimonial } from '../components/Testimonial';
import './AppPreview.scss';

type AppPage = 'home' | 'menu' | 'orders' | 'loyalty' | 'profile';

const NAV_ITEMS: { id: AppPage; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'menu', label: 'Menu', icon: 'Coffee' },
  { id: 'orders', label: 'Orders', icon: 'ClipboardList' },
  { id: 'loyalty', label: 'Loyalty', icon: 'Heart' },
  { id: 'profile', label: 'Profile', icon: 'User' },
];

function HomePage() {
  return (
    <div className="app-preview__page">
      <Heading size="Large" alignment="Left" heading="Good Morning, Sarah" subheading="What would you like to order today?" />

      <ProductList />

      <Heading size="Small" alignment="Left" heading="Today's Tasks" subheading="Track your daily goals" />
      <DailyTaskManager />
    </div>
  );
}

function MenuPage() {
  return (
    <div className="app-preview__page">
      <Heading size="Medium" alignment="Left" heading="Our Menu" subheading="Freshly brewed, just for you" />

      <Card imageStyle="Icon" layout="Horizontal" action="Button" iconName="Coffee" title="Caramel Latte" description="Rich espresso with caramel and steamed milk" buttonLabel="Add to Cart" />
      <Card imageStyle="Icon" layout="Horizontal" action="Button" iconName="Coffee" title="Cappuccino" description="Espresso with steamed milk foam" buttonLabel="Add to Cart" />
      <Card imageStyle="Icon" layout="Horizontal" action="Button" iconName="Coffee" title="Cold Brew" description="Smooth cold-steeped coffee served over ice" buttonLabel="Add to Cart" />
      <Card imageStyle="Icon" layout="Horizontal" action="Button" iconName="Cookie" title="Croissant" description="Freshly baked buttery pastry" buttonLabel="Add to Cart" />
    </div>
  );
}

function OrdersPage() {
  return (
    <div className="app-preview__page">
      <Heading size="Medium" alignment="Left" heading="My Orders" subheading="Track and view your orders" />

      <Chart type="Bar" title="Weekly Orders" description="Your ordering activity" iconName="ShoppingCart" />

      <Heading size="Small" alignment="Left" heading="Recent Orders" subheading="Your order history" />
      <List
        layout="Basic"
        imageStyle="Square"
        size="Compact"
        action="Icon"
        actionIconFilled={false}
        items={[
          { title: 'Caramel Latte x2', description: 'Mar 28 — $10.98 — Delivered' },
          { title: 'Cold Brew, Muffin', description: 'Mar 25 — $7.98 — Delivered' },
          { title: 'Cappuccino x3', description: 'Mar 22 — $14.37 — Delivered' },
        ]}
      />
    </div>
  );
}

function LoyaltyPage() {
  return (
    <div className="app-preview__page">
      <Heading size="Medium" alignment="Left" heading="Loyalty Rewards" subheading="Earn points with every purchase" />

      <DonationBox />

      <Chart type="Line" title="Points Earned" description="Monthly loyalty points" iconName="TrendingUp" />

      <Testimonial
        items={[
          { name: 'Emma Wilson', text: '"The loyalty program is amazing! Free drinks every month."' },
        ]}
      />
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="app-preview__page">
      <Heading size="Medium" alignment="Left" heading="Sarah Johnson" subheading="sarah.johnson@email.com" />

      <Form label="Edit Profile" description="Update your information" />

      <List
        layout="Basic"
        imageStyle="None"
        size="Regular"
        action="Icon"
        actionIconFilled={false}
        items={[
          { title: 'Payment Methods', description: 'Manage your cards' },
          { title: 'Delivery Addresses', description: '2 saved addresses' },
          { title: 'Notifications', description: 'Push & email preferences' },
          { title: 'Help & Support', description: 'FAQ and contact us' },
        ]}
      />

      <Button variant="Outlined" size="Default" label="Sign Out" leftIcon="LogOut" rightIcon="none" />
    </div>
  );
}

export function AppPreview() {
  const [activePage, setActivePage] = useState<AppPage>('home');

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <HomePage />;
      case 'menu': return <MenuPage />;
      case 'orders': return <OrdersPage />;
      case 'loyalty': return <LoyaltyPage />;
      case 'profile': return <ProfilePage />;
    }
  };

  return (
    <div className="app-preview">
      <div className="app-preview__frame">
        <div className="app-preview__statusbar">
          <span className="app-preview__statusbar-time">9:41</span>
          <div className="app-preview__statusbar-icons">
            <Icon name="Wifi" size={14} />
            <Icon name="Battery" size={14} />
          </div>
        </div>

        <div className="app-preview__content">
          {renderPage()}
        </div>

        <nav className="app-preview__nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`app-preview__nav-item${activePage === item.id ? ' app-preview__nav-item--active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon name={item.icon} size={20} />
              <span className="app-preview__nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
