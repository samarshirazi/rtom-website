import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { CartItem, Dish } from '../types';
import { DISHES } from '../data/dishes';
import { BUSINESS_PHONE_DISPLAY, BUSINESS_TEL, BUSINESS_WHATSAPP } from '../lib/constants';
import { useGoogleAddressAutocomplete } from '../lib/addressAutocomplete';
import { pushOrderToGhl } from '../lib/ghl';
import { pushOrderToSupabase } from '../lib/supabaseOrders';
import { fetchLiveDeliverySlots, type DeliverySlotRow } from '../lib/supabaseDishes';

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: string, newQty: number) => void;
  onClearCart: () => void;
  dishes?: Dish[];
};

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  dishes = DISHES,
}) => {
  if (!isOpen) return null;

  const findDish = (dishId: string) =>
    dishes.find((d) => d.id === dishId) || DISHES.find((d) => d.id === dishId);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const cartDishes = useMemo(() => {
    return cartItems.map((item) => findDish(item.dishId)).filter(Boolean) as Dish[];
  }, [cartItems]);

  const isSideDish = (dish: Dish) => {
    return dish.category === 'sides' || dish.category === 'drinks';
  };

  const hasMainDish = useMemo(() => {
    return cartDishes.some((dish) => !isSideDish(dish));
  }, [cartDishes]);

  const hasOnlySides = useMemo(() => {
    return cartItems.length > 0 && !hasMainDish;
  }, [cartItems, hasMainDish]);

  const hasPreOrderItems = useMemo(() => {
    return cartDishes.some((dish) => dish.deliveryType === 'pre-order' || (dish.leadTimeDays && dish.leadTimeDays > 0));
  }, [cartDishes]);

  // Generate list of allowed dates for the next 35 days based on lead times and day availability
  const selectableDeliveryDates = useMemo(() => {
    const dates: Array<{ iso: string; label: string }> = [];
    const now = new Date();

    for (let offset = 1; offset <= 35; offset++) {
      const candidate = new Date(now);
      candidate.setDate(now.getDate() + offset);
      const iso = candidate.toISOString().split('T')[0];
      const dow = candidate.getDay() === 0 ? 7 : candidate.getDay(); // 1=Mon..7=Sun

      const isValid = cartDishes.every((dish) => {
        const minLead = Math.max(1, dish.leadTimeDays ?? 1);
        if (offset < minLead) return false;
        if (Array.isArray(dish.availableDays) && dish.availableDays.length > 0) {
          if (!dish.availableDays.includes(dow)) return false;
        }
        return true;
      });

      if (isValid) {
        const isTomorrow = offset === 1;
        const formatted = candidate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        let badge = '';
        if (isTomorrow) badge = ' (Tomorrow - Earliest)';
        else if (dates.length === 0) badge = ' (Earliest Available)';
        else if (dow === 6 || dow === 7) badge = ' (Weekend)';

        dates.push({
          iso,
          label: `${formatted}${badge}`,
        });
      }
    }
    return dates;
  }, [cartDishes]);

  const earliestAllowedDate = selectableDeliveryDates[0]?.label || tomorrowStr;

  const [deliveryDate, setDeliveryDate] = useState(() => selectableDeliveryDates[0]?.iso || tomorrowStr);
  const [timeSlot, setTimeSlot] = useState('17:00-19:00 (Dinner)');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  // Google Address Autocomplete
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const addressStatus = useGoogleAddressAutocomplete({
    inputRef: addressInputRef,
    enabled: isOpen,
    onAddressSelected: (selection) => {
      setCustomerAddress(selection.formattedAddress);
    },
  });

  useEffect(() => {
    if (selectableDeliveryDates.length > 0 && !selectableDeliveryDates.some((d) => d.iso === deliveryDate)) {
      setDeliveryDate(selectableDeliveryDates[0].iso);
    }
  }, [selectableDeliveryDates, deliveryDate]);

  // Day of week: 1=Mon, ..., 5=Fri, 6=Sat, 7=Sun
  const selectedDayOfWeek = useMemo(() => {
    if (!deliveryDate) return 1;
    const [y, m, d] = deliveryDate.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const day = dt.getDay();
    return day === 0 ? 7 : day;
  }, [deliveryDate]);

  // Live delivery slots from Supabase
  const [liveSlots, setLiveSlots] = useState<DeliverySlotRow[]>([]);

  useEffect(() => {
    fetchLiveDeliverySlots().then((slots) => {
      if (slots && slots.length > 0) {
        setLiveSlots(slots);
      }
    });
  }, []);

  const isWeekend = selectedDayOfWeek >= 5;

  const availableSlots: { id: string; label: string }[] = useMemo(() => {
    if (liveSlots.length > 0) {
      const activeForDay = liveSlots.filter((slot) => {
        const days = Array.isArray(slot.active_days) && slot.active_days.length > 0
          ? slot.active_days
          : [1, 2, 3, 4, 5, 6, 7];
        return days.includes(selectedDayOfWeek);
      });
      if (activeForDay.length > 0) {
        return activeForDay.map((s) => ({
          id: `${s.start_time.slice(0, 5)}-${s.end_time.slice(0, 5)} (${s.label})`,
          label: `${s.label} (${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)})`,
        }));
      }
    }
    // Fallback if network/offline
    if (isWeekend) {
      return [
        { id: '10:00-14:00 (Lunch)', label: 'Lunch (10:00 - 14:00)' },
        { id: '17:00-20:50 (Dinner)', label: 'Dinner (17:00 - 20:50)' },
      ];
    }
    return [
      { id: '17:00-20:50 (Dinner)', label: 'Dinner (17:00 - 20:50)' },
    ];
  }, [liveSlots, selectedDayOfWeek, isWeekend]);

  useEffect(() => {
    if (!availableSlots.some((s) => s.id === timeSlot)) {
      setTimeSlot(availableSlots[0]?.id || '17:00-20:50 (Dinner)');
    }
  }, [availableSlots, timeSlot]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 40 ? 0 : 5.00;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasOnlySides) {
      alert('Please add at least one main barbecue dish. Smokehouse sides (Rice, Mac & Cheese, Garlic Toum) cannot be ordered alone.');
      return;
    }
    if (!customerName || !customerPhone || !customerAddress) {
      alert('Please fill out your name, phone number, and delivery address.');
      return;
    }

    const itemsSummary = cartItems
      .map((item) => {
        const dish = findDish(item.dishId);
        const tag = dish?.category === 'sides' ? '[SIDE]' : '[ARTISAN-FEAST]';
        return `• ${tag} ${item.name} x${item.quantity} ($${item.itemTotal.toFixed(2)})`;
      })
      .join('\n');

    const deliveryTypeNote = '🪵 *Order Policy: Advance Artisan Feast (Min. 1-Day Notice)*';

    // 1. Push directly into Supabase (orders, order_items, addresses, profiles) for Chef Sam & Rider Routing
    pushOrderToSupabase({
      customerName,
      customerPhone,
      customerAddress,
      deliveryDate,
      timeSlot,
      items: cartItems.map((ci) => ({
        dishId: ci.dishId,
        name: ci.name,
        quantity: ci.quantity,
        unitPrice: ci.unitPrice,
        selectedOptions: ci.selectedOptions,
      })),
      subtotal,
      deliveryFee,
      grandTotal,
      notes: deliveryTypeNote,
    });

    // 2. Push lead & order to GoHighLevel CRM (fire-and-forget)
    pushOrderToGhl({
      customerName,
      customerPhone,
      customerAddress,
      deliveryDate,
      timeSlot,
      itemsSummary,
      subtotal,
      deliveryFee,
      grandTotal,
      deliveryType: hasPreOrderItems ? 'pre-order' : 'same-day',
    });

    // 2. Open WhatsApp order dispatch
    const whatsappMessage = `🔥 *NEW RTOM BBQ ORDER*\n\n👤 *Customer:* ${customerName}\n📞 *Phone:* ${customerPhone}\n📍 *Address:* ${customerAddress}\n📅 *Delivery Date:* ${deliveryDate}\n⏰ *Time Slot:* ${timeSlot}\n${deliveryTypeNote}\n\n*Order Items:*\n${itemsSummary}\n\n💵 *Subtotal:* $${subtotal.toFixed(2)}\n🚚 *Delivery:* $${deliveryFee.toFixed(2)}\n💰 *Grand Total:* $${grandTotal.toFixed(2)}`;

    const encoded = encodeURIComponent(whatsappMessage);
    window.open(`${BUSINESS_WHATSAPP}?text=${encoded}`, '_blank');
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
              ORDER RECEIVED & DISPATCHED!
            </h3>
            <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', color: '#1B5E20', padding: '10px 14px', borderRadius: 6, fontSize: '0.84rem', fontWeight: 600, marginBottom: 16 }}>
              ✓ Synced with Smokehouse Kitchen Schedule
            </div>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.92rem', marginBottom: 24, lineHeight: 1.6 }}>
              Your order is securely registered in our kitchen database and WhatsApp dispatch receipt has been opened. Our pitmaster team will prepare your slow-smoked cuts for your scheduled slot.
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
                const dish = findDish(item.dishId);
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
                            {dish?.category === 'sides' ? (
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#334155', background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '1px 6px', borderRadius: 3, display: 'inline-block', marginTop: 3 }}>
                                🫓 Side Dish
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8D6E00', background: '#FFF8E1', border: '1px solid #FFE082', padding: '1px 6px', borderRadius: 3, display: 'inline-block', marginTop: 3 }}>
                                🪵 Artisan Delicacy • Min. 1 Day Notice
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>🎁</span>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-rust)' }}>
                    VIP App: 5% BBQ Cashback
                  </div>
                </div>
                <span style={{ background: 'var(--color-rust)', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                  Rewards
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', fontFamily: 'var(--font-body)', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Earn <strong>5% BBQ Cashback</strong>, enjoy wallet reload bonuses & track your pitmaster delivery live on <strong>app.rtombbq.ca</strong>.
              </p>
              <a
                href="https://app.rtombbq.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-rust"
                style={{ width: '100%', padding: '10px', fontSize: '0.88rem', textDecoration: 'none', justifyContent: 'center', fontWeight: 700 }}
              >
                📱 Order on App & Earn Rewards ➔
              </a>
            </div>

            {/* Direct Call to Order Banner */}
            <div
              style={{
                background: '#FFF8E1',
                border: '1px solid #FFE082',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                marginBottom: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  📞 Prefer to Order by Phone?
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Call pitmaster directly: <strong>{BUSINESS_PHONE_DISPLAY}</strong>
                </div>
              </div>
              <a
                href={BUSINESS_TEL}
                className="btn btn-dark btn-sm"
                style={{ fontSize: '0.82rem', padding: '8px 14px', whiteSpace: 'nowrap' }}
              >
                Call Now
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
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🪵</span>
                <div style={{ fontSize: '0.82rem', color: '#5D4037', lineHeight: 1.45 }}>
                  <strong style={{ display: 'block', marginBottom: 2 }}>
                    {cartDishes.some((d) => d.id === 'rtom-leg-of-lamb')
                      ? 'Weekend Smoked Feast in Cart (Saturday & Sunday Only):'
                      : 'Artisan Delicacy Smoked to Order (Min. 1 Day Notice):'}
                  </strong>
                  {cartDishes.some((d) => d.id === 'rtom-leg-of-lamb')
                    ? `Our 8+ hr whole Leg of Lamb is slow-roasted exclusively on weekends. Earliest delivery date is ${earliestAllowedDate}. Please pick your preferred weekend below!`
                    : `Every order is slow-smoked over seasoned hardwood coals with advance notice for parties, celebrations, and gatherings. Earliest delivery date is ${earliestAllowedDate}. Please select your date and time below!`}
                </div>
              </div>

              {/* Smokehouse Difference Explainer */}
              <div
                style={{
                  background: 'rgba(217, 101, 43, 0.05)',
                  border: '1px dashed rgba(217, 101, 43, 0.35)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  marginBottom: 16,
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>🪵</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-charcoal)', lineHeight: 1.4 }}>
                  <strong>Why No 30-Min Rush Delivery?</strong> Real craft barbecue takes 10–14 hours of slow hardwood smoke and cambro resting. Zero heat lamps or microwaves—batches are smoked fresh for your scheduled delivery slot.
                </span>
              </div>

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
                    placeholder="(825) 250-8534"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
                      Delivery Address
                    </label>
                    {addressStatus === 'ready' && (
                      <span style={{ fontSize: '0.7rem', color: '#2E7D32', fontWeight: 600 }}>
                        📍 Google Autocomplete Active
                      </span>
                    )}
                  </div>
                  <input
                    ref={addressInputRef}
                    type="text"
                    required
                    autoComplete="street-address"
                    placeholder="Start typing your street address (e.g. 104 St NW, Edmonton)..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>
                      Delivery Date
                    </label>
                    <select
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      style={inputStyle}
                    >
                      {selectableDeliveryDates.map((d) => (
                        <option key={d.iso} value={d.iso}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>
                      Time Window <span style={{ color: 'var(--color-rust)', fontWeight: 600 }}>({availableSlots.map((s) => s.label.split(' ')[0]).join(' & ') || 'Available Slots'})</span>
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      style={inputStyle}
                    >
                      {availableSlots.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
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

              {hasOnlySides && (
                <div
                  style={{
                    background: '#FFF3E0',
                    border: '1.5px solid #FFB74D',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    marginBottom: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#E65100', fontWeight: 700, fontSize: '0.88rem' }}>
                    <span>⚠️</span> Main Meat Dish Required
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#5D4037', lineHeight: 1.45 }}>
                    Smokehouse sides (Rice, Mac & Cheese, Garlic Toum) are freshly crafted alongside our pit-smoked meats and cannot be ordered alone. Please add at least one main barbecue dish to checkout.
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-outline btn-sm"
                    style={{ alignSelf: 'flex-start', marginTop: 4, padding: '6px 14px', fontSize: '0.78rem' }}
                  >
                    + Add Main Barbecue Dish
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={hasOnlySides}
                className="btn btn-dark"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  justifyContent: 'center',
                  opacity: hasOnlySides ? 0.5 : 1,
                  cursor: hasOnlySides ? 'not-allowed' : 'pointer',
                }}
              >
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
