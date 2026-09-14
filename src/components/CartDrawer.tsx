import React, { useState, useEffect } from 'react';
import type { CartItem } from '../types';
import { DISHES } from '../data/dishes';

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: string, newQty: number) => void;
  onClearCart: () => void;
};

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const hasPreOrderItems = cartItems.some((item) => {
    const dish = DISHES.find((d) => d.id === item.dishId);
    return dish?.deliveryType === 'pre-order';
  });

  const minDeliveryDate = hasPreOrderItems ? tomorrowStr : todayStr;

  const [deliveryDate, setDeliveryDate] = useState(() => (hasPreOrderItems ? tomorrowStr : todayStr));
  const [timeSlot, setTimeSlot] = useState('17:00-19:00 (Dinner)');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  useEffect(() => {
    if (hasPreOrderItems && deliveryDate < tomorrowStr) {
      setDeliveryDate(tomorrowStr);
    }
  }, [hasPreOrderItems, deliveryDate, tomorrowStr]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 40 ? 0 : 5.00;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert('Please fill out your name, phone number, and delivery address.');
      return;
    }

    const itemsSummary = cartItems
      .map((item) => {
        const dish = DISHES.find((d) => d.id === item.dishId);
        const tag = dish?.deliveryType === 'same-day' ? '[SAME-DAY]' : '[PRE-ORDER]';
        return `• ${tag} ${item.name} x${item.quantity} ($${item.itemTotal.toFixed(2)})`;
      })
      .join('\n');

    const deliveryTypeNote = hasPreOrderItems
      ? '📅 *Delivery Type: Pre-Order Scheduled (Fresh Pit Smoke)*'
      : '⚡ *Delivery Type: Same-Day Delivery Tonight*';

    const whatsappMessage = `🔥 *NEW RTOM BBQ ORDER*\n\n👤 *Customer:* ${customerName}\n📞 *Phone:* ${customerPhone}\n📍 *Address:* ${customerAddress}\n📅 *Delivery Date:* ${deliveryDate}\n⏰ *Time Slot:* ${timeSlot}\n${deliveryTypeNote}\n\n*Order Items:*\n${itemsSummary}\n\n💵 *Subtotal:* $${subtotal.toFixed(2)}\n🚚 *Delivery:* $${deliveryFee.toFixed(2)}\n💰 *Grand Total:* $${grandTotal.toFixed(2)}`;

    const encoded = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/18258238733?text=${encoded}`, '_blank');
    setOrderPlacedSuccess(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          background: '#FFFFFF',
          borderLeft: '2px solid var(--border-dark)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideLeft 0.28s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-cream)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.4rem' }}>🛒</span>
            <h3 style={{ fontSize: '1.45rem', fontFamily: 'var(--font-woodcut)', color: 'var(--text-dark)' }}>
              YOUR BBQ CART
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dark)',
              fontSize: '1.3rem',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        {orderPlacedSuccess ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</span>
            <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-woodcut)', marginBottom: 8, color: 'var(--color-rust)' }}>
              ORDER INQUIRY SENT!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.95rem', marginBottom: 24, lineHeight: 1.6 }}>
              Your order payload has been generated and WhatsApp notification opened. Our pitmaster team will confirm your delivery slot shortly.
            </p>
            <button
              onClick={() => {
                setOrderPlacedSuccess(false);
                onClearCart();
                onClose();
              }}
              className="btn btn-rust"
            >
              Back to Menu
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: '3.5rem', marginBottom: 12, opacity: 0.6 }}>🍖</span>
            <h4 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-woodcut)', marginBottom: 6 }}>
              YOUR CART IS EMPTY
            </h4>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', marginBottom: 20 }}>
              Add a 5-hour smoked lamb shank, charcoal whole leg chicken, or brisket over mac & cheese to get started.
            </p>
            <button onClick={onClose} className="btn btn-outline">
              Explore Menu
            </button>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {cartItems.map((item) => {
                const dish = DISHES.find((d) => d.id === item.dishId);
                return (
                  <div
                    key={item.cartId}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-paper)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 68, height: 68, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-woodcut)', color: 'var(--text-dark)' }}>
                              {item.name}
                            </div>
                            {dish?.deliveryType === 'same-day' ? (
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1B5E20', background: '#E8F5E9', border: '1px solid #A5D6A7', padding: '1px 6px', borderRadius: 3, display: 'inline-block', marginTop: 3 }}>
                                ⚡ Same-Day Tonight
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8D6E00', background: '#FFF8E1', border: '1px solid #FFE082', padding: '1px 6px', borderRadius: 3, display: 'inline-block', marginTop: 3 }}>
                                📅 Pre-Order Scheduled
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '1.05rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-rust)' }}>
                            ${item.itemTotal.toFixed(2)}
                          </div>
                        </div>
                        {item.selectedOptions.length > 0 && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {item.selectedOptions.map((opt) => opt.optionName).join(', ')}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
                          <button
                            onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }}
                          >
                            −
                          </button>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onUpdateQuantity(item.cartId, 0)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-rust)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dual Option: App Express Checkout */}
            <div
              style={{
                background: 'var(--bg-paper)',
                border: '2px solid var(--color-rust)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                marginBottom: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dark)' }}>
                  Option 1: Checkout on RTOM App
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', fontFamily: 'var(--font-body)', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                For real-time kitchen tracking & direct online payment, order at <strong>app.rtombbq.ca</strong>.
              </p>
              <a
                href="https://app.rtombbq.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-rust"
                style={{ width: '100%', padding: '10px', fontSize: '0.88rem', textDecoration: 'none', justifyContent: 'center' }}
              >
                📱 Order on app.rtombbq.ca ➔
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              <span>Option 2: WhatsApp Fast Order</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </div>

            {/* Delivery Form */}
            <form onSubmit={handleCheckout} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dark)', marginBottom: 12 }}>
                WhatsApp Delivery Information
              </div>

              {/* Delivery Availability Notice Banner */}
              {hasPreOrderItems ? (
                <div
                  style={{
                    background: '#FFF8E1',
                    border: '1px solid #FFE082',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    marginBottom: 16,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                  }}
                >
                  <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>📅</span>
                  <div style={{ fontSize: '0.82rem', color: '#5D4037', lineHeight: 1.45 }}>
                    <strong style={{ display: 'block', marginBottom: 2 }}>Pre-Order Items in Cart:</strong>
                    Dishes like our 8+ hr Leg of Lamb and Mac & Cheese specials are smoked fresh to order with 24h advance preparation. Earliest delivery date is <strong>tomorrow ({tomorrowStr})</strong>. Please pick your preferred date below!
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: '#E8F5E9',
                    border: '1px solid #C8E6C9',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    marginBottom: 16,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                  }}
                >
                  <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>⚡</span>
                  <div style={{ fontSize: '0.82rem', color: '#1B5E20', lineHeight: 1.45 }}>
                    <strong style={{ display: 'block', marginBottom: 2 }}>Same-Day Delivery Available:</strong>
                    Lamb Shank & Chicken Leg are smoked fresh today! You can order for delivery <strong>tonight ({todayStr})</strong> or pick any future date.
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Samar Abbas"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="(825) 823-8733"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>Delivery Address</label>
                  <input
                    type="text"
                    required
                    placeholder="123 Smokehouse Lane, Edmonton"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>Delivery Date</label>
                    <input
                      type="date"
                      min={minDeliveryDate}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>
                      Time Window <span style={{ color: 'var(--color-rust)', fontWeight: 600 }}>(Dinner Only)</span>
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      style={inputStyle}
                    >
                      <option value="17:00-19:00 (Dinner)">17:00 - 19:00 (Dinner)</option>
                      <option value="19:00-21:00 (Late Dinner)">19:00 - 21:00 (Late Dinner)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ background: 'var(--bg-paper)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                  <span>Delivery Fee {subtotal >= 40 && <span style={{ color: 'var(--color-rust)', fontWeight: 600 }}>(Free Over $40!)</span>}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>${deliveryFee.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontFamily: 'var(--font-woodcut)', color: 'var(--text-dark)', borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--color-rust)' }}>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-dark" style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}>
                🔥 Place Order via WhatsApp
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: '#FFFFFF',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-dark)',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.88rem',
  outline: 'none',
};
