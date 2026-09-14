import React, { useState, useMemo } from 'react';
import type { Dish } from '../types';
import { DISHES } from '../data/dishes';

type MenuSectionProps = {
  onSelectDish: (dish: Dish) => void;
  onNavigateToLambShank?: () => void;
};

export const MenuSection: React.FC<MenuSectionProps> = ({
  onSelectDish,
  onNavigateToLambShank,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { key: 'all', label: 'ALL ITEMS', icon: '🔥' },
    { key: 'mutton', label: 'MUTTON & GOAT', icon: '🍖' },
    { key: 'beef', label: 'BEEF SPECIALS', icon: '🥩' },
    { key: 'chicken', label: 'CHARCOAL CHICKEN', icon: '🍗' },
    { key: 'sides', label: 'NAAN & SIDES', icon: '🫓' },
    { key: 'drinks', label: 'DRINKS & SWEETS', icon: '🥭' },
  ];

  const filteredDishes = useMemo(() => {
    return DISHES.filter((dish) => {
      const matchesCategory =
        selectedCategory === 'all' || dish.category === selectedCategory;
      const matchesSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section
      id="menu"
      style={{
        padding: '90px 0',
        background: 'var(--bg-cream)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
          <div
            style={{
              display: 'inline-block',
              background: 'var(--color-rust)',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            📖 SMOKEHOUSE MENU
          </div>
          <h2
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
              fontFamily: 'var(--font-woodcut)',
              color: 'var(--text-dark)',
              marginBottom: 8,
              letterSpacing: '0.04em',
            }}
          >
            FRESH PITMASTER DISHES <span style={{ color: 'var(--color-rust)' }}>ORDERABLE DAILY</span>
          </h2>
          <p className="script-accent" style={{ fontSize: '1.35rem', color: 'var(--text-muted)' }}>
            Slow-smoked overnight • No weekly waiting or subscription caps
          </p>
        </div>

        {/* Dual Option App Callout Banner (Franklin Style) */}
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto 40px',
            background: 'var(--bg-paper)',
            border: '2px solid var(--color-rust)',
            borderRadius: 'var(--radius-md)',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '1.8rem' }}>📱</span>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-woodcut)',
                  fontSize: '1.3rem',
                  letterSpacing: '0.04em',
                  color: 'var(--text-dark)',
                }}
              >
                ORDER DIRECTLY ON THE RTOM WEB APP
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                Track live smokehouse preparation & pay with card at <strong>app.rtombbq.ca</strong>
              </div>
            </div>
          </div>
          <a
            href="https://app.rtombbq.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-rust btn-sm"
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            Launch RTOM App ➔
          </a>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div style={{ marginBottom: 44, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
            <span
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.1rem',
                color: 'var(--text-dim)',
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search smokehouse dishes (e.g. Biryani, Shami, Ribs)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                background: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-dark)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Badges / Tabs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map((cat) => {
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className="btn"
                  style={{
                    padding: '8px 18px',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: active ? 'var(--text-dark)' : '#FFFFFF',
                    color: active ? '#FFFFFF' : 'var(--text-dark)',
                    border: active ? '1px solid var(--text-dark)' : '1px solid var(--border-subtle)',
                    boxShadow: active ? 'var(--shadow-sm)' : 'none',
                    fontWeight: 700,
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }}>🍗</span>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-woodcut)', marginBottom: 6 }}>
              NO DISHES FOUND
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Try searching another dish name or pick a different category.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 28,
            }}
          >
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="paper-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                }}
              >
                {/* Dish Photo & Portion Overlay */}
                <div
                  onClick={dish.id === 'rtom-lamb-shank' && onNavigateToLambShank ? onNavigateToLambShank : undefined}
                  style={{
                    position: 'relative',
                    height: 210,
                    width: '100%',
                    overflow: 'hidden',
                    cursor: dish.id === 'rtom-lamb-shank' && onNavigateToLambShank ? 'pointer' : 'default',
                  }}
                  title={dish.id === 'rtom-lamb-shank' ? 'Click to view 5-Hour Lamb Shank Feast Story' : undefined}
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to bottom, transparent 50%, rgba(26, 25, 24, 0.75) 100%)',
                    }}
                  />

                  {/* Top Badges */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      right: 12,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        background: 'rgba(26, 25, 24, 0.85)',
                        color: '#FFFFFF',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      100% HALAL
                    </span>
                    {dish.isBestSeller && (
                      <span
                        style={{
                          background: 'var(--color-rust)',
                          color: '#FFFFFF',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        ⭐ PITMASTER CHOICE
                      </span>
                    )}
                  </div>

                  {/* Special Funnel Banner on Lamb Shank Image */}
                  {dish.id === 'rtom-lamb-shank' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 48,
                        left: 12,
                        background: 'linear-gradient(135deg, #D9652B 0%, #BA4E18 100%)',
                        color: '#FFFFFF',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>🔥</span>
                      <span>CLICK IMAGE FOR FEAST STORY</span>
                    </div>
                  )}

                  {/* Portion Tag */}
                  <div
                    className="script-accent"
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      left: 12,
                      fontSize: '1rem',
                      color: '#F4F1E8',
                    }}
                  >
                    Portion: {dish.portionSize}
                  </div>
                </div>

                {/* Dish Info & Price */}
                <div
                  style={{
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h3
                      onClick={dish.id === 'rtom-lamb-shank' && onNavigateToLambShank ? onNavigateToLambShank : undefined}
                      style={{
                        fontSize: '1.45rem',
                        fontFamily: 'var(--font-woodcut)',
                        letterSpacing: '0.04em',
                        color: 'var(--text-dark)',
                        marginBottom: 6,
                        cursor: dish.id === 'rtom-lamb-shank' && onNavigateToLambShank ? 'pointer' : 'default',
                      }}
                    >
                      {dish.name}
                    </h3>
                    {dish.deliveryType === 'same-day' ? (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          background: '#E8F5E9',
                          color: '#1B5E20',
                          border: '1px solid #A5D6A7',
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          textTransform: 'uppercase',
                          marginBottom: 10,
                        }}
                      >
                        <span>⚡ SAME-DAY DELIVERY TONIGHT</span>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          background: '#FFF8E1',
                          color: '#8D6E00',
                          border: '1px solid #FFE082',
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          textTransform: 'uppercase',
                          marginBottom: 10,
                        }}
                      >
                        <span>📅 PRE-ORDER • PICK DELIVERY DAY</span>
                      </div>
                    )}
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '0.92rem',
                        color: 'var(--text-muted)',
                        marginBottom: 20,
                        lineHeight: 1.6,
                      }}
                    >
                      {dish.description}
                    </p>
                  </div>

                  {/* Price & Action Button */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: 16,
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: 'var(--color-rust)',
                      }}
                    >
                      ${dish.price.toFixed(2)}
                    </span>
                    {dish.id === 'rtom-lamb-shank' && onNavigateToLambShank ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={onNavigateToLambShank}
                          className="btn btn-primary btn-sm"
                          style={{
                            background: 'var(--color-rust)',
                            color: '#FFFFFF',
                            fontSize: '0.8rem',
                            padding: '8px 12px',
                            fontWeight: 700,
                          }}
                        >
                          <span>🔥 View Feast</span>
                        </button>
                        <button
                          onClick={() => onSelectDish(dish)}
                          className="btn btn-dark btn-sm"
                          style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                        >
                          <span>+ Customize</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onSelectDish(dish)}
                        className="btn btn-dark btn-sm"
                      >
                        <span>+ Customize & Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
