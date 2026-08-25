import React, { useState } from 'react';
import type { Dish } from '../types';

type DishModalProps = {
  dish: Dish | null;
  onClose: () => void;
  onAddToCart: (dish: Dish, quantity: number, selectedOptions: { groupId: string; groupName: string; optionId: string; optionName: string; priceDelta: number }[], unitPrice: number) => void;
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
    const formattedSelections = Object.entries(selectedSelections).map(([groupId, val]) => {
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
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-gold)',
        }}
      >
        {/* Header Image */}
        <div style={{ position: 'relative', height: 200, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 20 }}>
          <img src={dish.image} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(0,0,0,0.65)',
              color: '#FFF',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              fontSize: '1.2rem',
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
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>{dish.name}</h3>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-primary)' }}>${unitPrice.toFixed(2)}</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{dish.description}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <span className="badge badge-gold">Portion: {dish.portionSize}</span>
            {dish.prepTimeMinutes && <span className="badge badge-flame">⏱ {dish.prepTimeMinutes} mins prep</span>}
          </div>
        </div>

        {/* Variation Groups */}
        {dish.variationGroups && dish.variationGroups.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
            {dish.variationGroups.map((group) => (
              <div key={group.id} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: 10 }}>
                  {group.name} {group.required && <span style={{ color: 'var(--flame-red)' }}>*</span>}
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
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: isSelected ? 'rgba(212, 163, 56, 0.15)' : 'var(--bg-surface)',
                          border: isSelected ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <input
                            type="radio"
                            name={`group-${group.id}`}
                            checked={isSelected}
                            onChange={() => {}}
                            style={{ accentColor: 'var(--gold-primary)' }}
                          />
                          <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? 700 : 500 }}>{opt.name}</span>
                        </div>
                        {opt.priceDelta !== 0 && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--gold-light)' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', width: 28, height: 28 }}
            >
              −
            </button>
            <span style={{ fontSize: '1rem', fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', width: 28, height: 28 }}
            >
              +
            </button>
          </div>

          <button onClick={handleConfirm} className="btn btn-primary" style={{ flex: 1, padding: '14px', fontSize: '1rem' }}>
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
              fontSize: '0.8rem',
              color: 'var(--gold-light)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              opacity: 0.9,
            }}
          >
            <span>📱 Or order directly on RTOM App (app.rtombbq.ca) ➔</span>
          </a>
        </div>
      </div>
    </div>
  );
};
