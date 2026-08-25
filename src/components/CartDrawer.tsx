import React, { useState } from 'react';
import type { CartItem } from '../types';

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

  const [deliveryDate, setDeliveryDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('17:00-19:00 (Dinner)');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

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
      .map((item) => `• ${item.name} x${item.quantity} ($${item.itemTotal.toFixed(2)})`)
      .join('\n');

    const whatsappMessage = `🔥 *NEW RTOM BBQ ORDER*\n\n👤 *Customer:* ${customerName}\n📞 *Phone:* ${customerPhone}\n📍 *Address:* ${customerAddress}\n📅 *Delivery Date:* ${deliveryDate}\n⏰ *Time Slot:* ${timeSlot}\n\n*Order Items:*\n${itemsSummary}\n\n💵 *Subtotal:* $${subtotal.toFixed(2)}\n🚚 *Delivery:* $${deliveryFee.toFixed(2)}\n💰 *Grand Total:* $${grandTotal.toFixed(2)}`;

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
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-gold)',
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
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.3rem' }}>🛒</span>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>Your BBQ Cart</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.4rem',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        {orderPlacedSuccess ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</span>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: 8, color: 'var(--gold-light)' }}>
              Order Inquiry Sent!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 24, lineHeight: 1.5 }}>
              Your order payload has been generated and WhatsApp notification opened. Our pitmaster team will confirm your delivery slot shortly.
            </p>
            <button
              onClick={() => {
                setOrderPlacedSuccess(false);
                onClearCart();
                onClose();
              }}
              className="btn btn-primary"
            >
              Back to Menu
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: '3.5rem', marginBottom: 12, opacity: 0.6 }}>🍖</span>
            <h4 style={{ fontSize: '1.2rem', marginBottom: 6 }}>Your cart is empty</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
              Add some tender goat biryani, beef shami kebabs, or charcoal chicken tikka to get started.
            </p>
            <button onClick={onClose} className="btn btn-outline">
              Explore Menu
            </button>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
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
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                          ${item.itemTotal.toFixed(2)}
                        </div>
                      </div>
                      {item.selectedOptions.length > 0 && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 2 }}>
                          {item.selectedOptions.map((opt) => opt.optionName).join(', ')}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }}
                        >
                          −
                        </button>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onUpdateQuantity(item.cartId, 0)}
                        style={{ background: 'none', border: 'none', color: 'var(--flame-red)', fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dual Option: App Express Checkout */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(212, 163, 56, 0.12) 0%, rgba(211, 72, 38, 0.15) 100%)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                  Option 1: Checkout on RTOM App
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                For real-time kitchen tracking & direct online payment, launch our app platform.
              </p>
              <a
                href="https://app.rtombbq.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-flame"
                style={{ width: '100%', padding: '10px', fontSize: '0.9rem', textDecoration: 'none', justifyContent: 'center' }}
              >
                📱 Order on app.rtombbq.ca ➔
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              <span>Option 2: WhatsApp Fast Order</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </div>

            {/* Delivery Form */}
            <form onSubmit={handleCheckout} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: 12 }}>
                WhatsApp Delivery Information
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: 4 }}>Full Name</label>
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
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: 4 }}>Phone Number</label>
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
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: 4 }}>Delivery Address</label>
                  <input
                    type="text"
                    required
                    placeholder="123 Smokehouse Lane, Calgary / Edmonton"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: 4 }}>Delivery Date</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: 4 }}>Time Window</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      style={inputStyle}
                    >
                      <option value="12:00-14:00 (Lunch)">12:00 - 14:00 (Lunch)</option>
                      <option value="17:00-19:00 (Dinner)">17:00 - 19:00 (Dinner)</option>
                      <option value="19:00-21:00 (Late Dinner)">19:00 - 21:00 (Late)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                  <span>Delivery Fee {subtotal >= 40 && <span style={{ color: 'var(--gold-light)' }}>(Free Over $40!)</span>}</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-primary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                  <span>Total Amount</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-flame" style={{ width: '100%', padding: '14px', fontSize: '1.05rem', justifyContent: 'center' }}>
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
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-main)',
  fontSize: '0.88rem',
  outline: 'none',
};
