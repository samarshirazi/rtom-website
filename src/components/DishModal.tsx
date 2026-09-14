import React, { useState, useEffect } from 'react';
import type { Dish } from '../types';

type DishModalProps = {
  dish: Dish | null;
  onClose: () => void;
  onAddToCart: (
    dish: Dish,
    quantity: number,
    selectedOptions: { groupId: string; groupName: string; optionId: string; optionName: string; priceDelta: number }[],
    unitPrice: number
  ) => void;
};

export const DishModal: React.FC<DishModalProps> = ({ dish, onClose, onAddToCart }) => {
  if (!dish) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSelections, setSelectedSelections] = useState<Record<string, { optionId: string; optionName: string; priceDelta: number }>>(() => {
    const initial: Record<string, { optionId: string; optionName: string; priceDelta: number }> = {};
    if (dish.variationGroups) {
      for (const group of dish.variationGroups) {
        if (group.options.length > 0) {
          initial[group.id] = {
            optionId: group.options[0].id,
            optionName: group.options[0].name,
            priceDelta: group.options[0].priceDelta,
          };
        }
      }
    }
    return initial;
  });

  useEffect(() => {
    setQuantity(1);
    const initial: Record<string, { optionId: string; optionName: string; priceDelta: number }> = {};
    if (dish.variationGroups) {
      for (const group of dish.variationGroups) {
        if (group.options.length > 0) {
          initial[group.id] = {
            optionId: group.options[0].id,
            optionName: group.options[0].name,
            priceDelta: group.options[0].priceDelta,
          };
        }
      }
    }
    setSelectedSelections(initial);
  }, [dish.id]);

  const calculateUnitPrice = () => {
    let price = dish.price;
    for (const sel of Object.values(selectedSelections)) {
      price += sel.priceDelta;
    }
    return price;
  };

  const unitPrice = calculateUnitPrice();
  const totalPrice = unitPrice * quantity;

  const handleSelectOption = (groupId: string, optionId: string, optionName: string, priceDelta: number) => {
    setSelectedSelections((prev) => ({
      ...prev,
      [groupId]: { optionId, optionName, priceDelta },
    }));
  };

  const handleConfirm = () => {
    const formattedSelections = Object.entries(selectedSelections)
      .filter(([_, val]) => val.optionId !== 'none')
      .map(([groupId, val]) => {
        const group = dish.variationGroups?.find((g) => g.id === groupId);
        return {
          groupId,
          groupName: group?.name || 'Option',
          optionId: val.optionId,
          optionName: val.optionName,
          priceDelta: val.priceDelta,
        };
      });
    onAddToCart(dish, quantity, formattedSelections, unitPrice);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="paper-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          background: '#FFFFFF',
          border: '2px solid var(--border-dark)',
        }}
      >
        {/* Header Image */}
        <div style={{ position: 'relative', height: 200, borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: 20 }}>
          <img src={dish.image} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(26, 25, 24, 0.85)',
              color: '#FFF',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Dish Title & Description */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h3 style={{ fontSize: '1.7rem', fontFamily: 'var(--font-woodcut)', color: 'var(--text-dark)' }}>{dish.name}</h3>
            <span style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-rust)' }}>
              ${unitPrice.toFixed(2)}
            </span>
          </div>
          <p style={{ fontSize: '0.95rem', fontFamily: 'var(--font-serif)', color: 'var(--text-charcoal)', lineHeight: 1.6 }}>
            {dish.description}
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <span className="badge badge-rust">Portion: {dish.portionSize}</span>
            {dish.deliveryType === 'same-day' ? (
              <span style={{ background: '#E8F5E9', color: '#1B5E20', border: '1px solid #A5D6A7', padding: '4px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>
                ⚡ Same-Day Delivery Tonight
              </span>
            ) : (
              <span style={{ background: '#FFF8E1', color: '#8D6E00', border: '1px solid #FFE082', padding: '4px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>
                📅 Pre-Order • Pick Delivery Day
              </span>
            )}
          </div>
        </div>

        {/* Variation Groups */}
        {dish.variationGroups && dish.variationGroups.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
            {dish.variationGroups.map((group) => (
              <div key={group.id} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dark)', marginBottom: 10 }}>
                  {group.name} {group.required && <span style={{ color: 'var(--color-rust)' }}>*</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {group.options.map((opt) => {
                    const isSelected = selectedSelections[group.id]?.optionId === opt.id;
                    return (
                      <label
                        key={opt.id}
                        onClick={() => handleSelectOption(group.id, opt.id, opt.name, opt.priceDelta)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: isSelected ? 'var(--bg-paper)' : '#FFFFFF',
                          border: isSelected ? '2px solid var(--color-rust)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <input
                            type="radio"
                            name={`group-${group.id}`}
                            checked={isSelected}
                            onChange={() => {}}
                            style={{ accentColor: 'var(--color-rust)' }}
                          />
                          <span style={{ fontSize: '0.92rem', fontFamily: 'var(--font-heading)', fontWeight: isSelected ? 700 : 500, color: 'var(--text-dark)' }}>
                            {opt.name}
                          </span>
                        </div>
                        {opt.priceDelta !== 0 && (
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-rust)' }}>
                            {opt.priceDelta > 0 ? `+ $${opt.priceDelta.toFixed(2)}` : `- $${Math.abs(opt.priceDelta).toFixed(2)}`}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quantity Controls & Add Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-paper)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              style={{ background: 'none', border: 'none', color: 'var(--text-dark)', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', width: 28, height: 28 }}
            >
              −
            </button>
            <span style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              style={{ background: 'none', border: 'none', color: 'var(--text-dark)', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', width: 28, height: 28 }}
            >
              +
            </button>
          </div>

          <button onClick={handleConfirm} className="btn btn-rust" style={{ flex: 1, padding: '14px', fontSize: '1rem' }}>
            <span>Add to Cart</span>
            <span style={{ fontWeight: 800 }}>• ${totalPrice.toFixed(2)}</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <a
            href="https://app.rtombbq.ca"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-rust)',
              textDecoration: 'none',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>📱 Or order directly on RTOM App (app.rtombbq.ca) ➔</span>
          </a>
        </div>
      </div>
    </div>
  );
};
