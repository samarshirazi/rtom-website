import { useState, useEffect } from 'react';
import type { CartItem, Dish } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { DishModal } from './components/DishModal';
import { CateringCalculator } from './components/CateringCalculator';
import { StorySection } from './components/StorySection';
import { CartDrawer } from './components/CartDrawer';
import { InstallBanner } from './components/InstallBanner';
import { Footer } from './components/Footer';
import { LambShankFunnelPage } from './components/LambShankFunnelPage';
import { LambShankDailyPopup } from './components/LambShankDailyPopup';
import { DISHES } from './data/dishes';
import { BUSINESS_WHATSAPP } from './lib/constants';
import { pushCateringToGhl } from './lib/ghl';

export function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedDishModal, setSelectedDishModal] = useState<Dish | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Routing state: 'home' or 'lamb-shank'
  const [currentView, setCurrentView] = useState<'home' | 'lamb-shank'>(() => {
    if (typeof window === 'undefined') return 'home';
    const p = window.location.pathname.toLowerCase();
    const h = window.location.hash.toLowerCase();
    return p === '/lamb-shank' || p === '/lamb-shank-on-rice' || h === '#lamb-shank'
      ? 'lamb-shank'
      : 'home';
  });

  // Sync browser back/forward buttons and hash navigation
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      if (p === '/lamb-shank' || p === '/lamb-shank-on-rice' || h === '#lamb-shank') {
        setCurrentView('lamb-shank');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleNavigateToLambShank = () => {
    window.history.pushState(null, '', '/lamb-shank');
    setCurrentView('lamb-shank');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    window.history.pushState(null, '', '/');
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    if (currentView !== 'home') {
      handleBackToHome();
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (
    dish: Dish,
    quantity: number,
    selectedOptions: { groupId: string; groupName: string; optionId: string; optionName: string; priceDelta: number }[],
    unitPrice: number
  ) => {
    const cartId = `${dish.id}-${selectedOptions.map((o) => o.optionId).sort().join('-') || 'default'}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartId === cartId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: newQty * unitPrice,
        };
        return updated;
      }

      const newItem: CartItem = {
        cartId,
        dishId: dish.id,
        name: dish.name,
        basePrice: dish.price,
        unitPrice,
        quantity,
        selectedOptions,
        portionSize: dish.portionSize,
        itemTotal: quantity * unitPrice,
        image: dish.image,
      };
      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.cartId === cartId ? { ...item, quantity: newQty, itemTotal: newQty * item.unitPrice } : item))
      );
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenCateringInquiry = (summary: string) => {
    pushCateringToGhl({
      customerName: 'Catering Lead',
      customerPhone: '',
      guestCount: 0,
      notes: summary,
    });
    const encoded = encodeURIComponent(summary);
    window.open(`${BUSINESS_WHATSAPP}?text=${encoded}`, '_blank');
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-cream)' }}>
      {/* Install Banner */}
      <InstallBanner />

      {/* Header: Rendered on home view; Funnel Page uses its own unified sticky funnel header to prevent double-header collisions */}
      {currentView === 'home' && (
        <Header
          cartItemCount={cartItemCount}
          onOpenCart={() => setIsCartOpen(true)}
          onNavigateSection={handleNavigateSection}
        />
      )}

      {/* Main Content: Either Funnel Page OR Storefront */}
      {currentView === 'lamb-shank' ? (
        <main style={{ flex: 1 }}>
          <LambShankFunnelPage
            onBackToMenu={handleBackToHome}
            onAddToCart={handleAddToCart}
            cartItemCount={cartItemCount}
            onOpenCart={() => setIsCartOpen(true)}
          />
        </main>
      ) : (
        <main style={{ flex: 1 }}>
          <HeroSection
            onExploreMenu={() => handleNavigateSection('menu')}
            onOpenCatering={() => handleNavigateSection('catering')}
          />

          <MenuSection
            onSelectDish={(dish) => setSelectedDishModal(dish)}
            onNavigateToLambShank={handleNavigateToLambShank}
          />

          <CateringCalculator onOpenInquiry={handleOpenCateringInquiry} />

          <StorySection />
        </main>
      )}

      {/* Footer */}
      <Footer onNavigateSection={handleNavigateSection} />

      {/* Dish Customization Modal */}
      <DishModal
        dish={selectedDishModal}
        onClose={() => setSelectedDishModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />

      {/* Daily Lamb Shank Special Popup Announcement */}
      {currentView === 'home' && (
        <LambShankDailyPopup
          onViewFeast={handleNavigateToLambShank}
          onQuickAdd={() => {
            const shank = DISHES.find((d) => d.id === 'rtom-lamb-shank') || DISHES[0];
            handleAddToCart(shank, 1, [], shank.price);
          }}
        />
      )}
    </div>
  );
}

export default App;
