import { useState } from 'react';
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

export function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedDishModal, setSelectedDishModal] = useState<Dish | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleNavigateSection = (sectionId: string) => {
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
    const encoded = encodeURIComponent(summary);
    window.open(`https://wa.me/18258238733?text=${encoded}`, '_blank');
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-cream)' }}>
      {/* Install Banner */}
      <InstallBanner />

      {/* Header */}
      <Header
        cartItemCount={cartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <HeroSection
          onExploreMenu={() => handleNavigateSection('menu')}
          onOpenCatering={() => handleNavigateSection('catering')}
        />

        <MenuSection onSelectDish={(dish) => setSelectedDishModal(dish)} />

        <CateringCalculator onOpenInquiry={handleOpenCateringInquiry} />

        <StorySection />
      </main>

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
    </div>
  );
}

export default App;
