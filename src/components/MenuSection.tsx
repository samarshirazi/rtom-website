import React, { useState } from 'react';
import type { Category, Dish } from '../types';
import { DISHES } from '../data/dishes';

type MenuSectionProps = {
  onSelectDish: (dish: Dish) => void;
};

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectDish }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { key: Category; label: string; icon: string }[] = [
    { key: 'all', label: 'All Items', icon: '🔥' },
    { key: 'mutton', label: 'Mutton & Goat', icon: '🍖' },
    { key: 'beef', label: 'Beef Specials', icon: '🥩' },
    { key: 'chicken', label: 'Charcoal Chicken', icon: '🍗' },
    { key: 'sides', label: 'Naan & Sides', icon: '🫓' },
    { key: 'drinks', label: 'Drinks & Sweets', icon: '🥭' },
  ];

  const filteredDishes = DISHES.filter((dish) => {
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" style={{ padding: '80px 0', background: 'var(--bg-dark)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>
            <span>📖 OUR SMOKEHOUSE MENU</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontFamily: 'var(--font-display)', marginBottom: 12 }}>
            Fresh Pitmaster Dishes <span className="gradient-text-gold">Orderable Daily</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            No weekly menu waiting or subscription caps — pick your favorite smoked specialties and get them delivered straight to your door.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div style={{ marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '460px' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', color: 'var(--text-dim)' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search dishes (e.g. Biryani, Shami, Ribs)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                outline: 'none',
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
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
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
                    fontSize: '0.88rem',
                    borderRadius: 'var(--radius-full)',
                    background: active ? 'var(--gold-primary)' : 'var(--bg-card)',
                    color: active ? '#0E0D0C' : 'var(--text-main)',
                    border: active ? '1px solid var(--gold-light)' : '1px solid var(--border-subtle)',
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dual Option App Callout Banner */}
        <div
          style={{
            maxWidth: '840px',
            margin: '0 auto 36px',
            background: 'linear-gradient(135deg, rgba(212, 163, 56, 0.1) 0%, rgba(211, 72, 38, 0.12) 100%)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '1.6rem' }}>📱</span>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                Prefer ordering on our web app?
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Track smokehouse orders in real-time & checkout with card at <strong>app.rtombbq.ca</strong>
              </div>
            </div>
          </div>
          <a
            href="https://app.rtombbq.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-flame btn-sm"
            style={{ textDecoration: 'none', padding: '10px 18px', fontSize: '0.88rem' }}
          >
            Launch RTOM App ➔
          </a>
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-gold)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }}>🍗</span>
            <h3 style={{ fontSize: '1.3rem', marginBottom: 6 }}>No dishes found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Try clearing your search query or selecting another category.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="glass-panel card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {/* Image & Badges */}
                <div style={{ position: 'relative', height: 210, width: '100%', overflow: 'hidden' }}>
                  <img
                    src={dish.image}
                    alt={dish.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to bottom, transparent 40%, rgba(14, 13, 12, 0.9) 100%)',
                    }}
                  />

                  {/* Top Badges */}
                  <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                      {dish.dietary.toUpperCase()}
                    </span>
                    {dish.isBestSeller && (
                      <span className="badge badge-flame" style={{ fontSize: '0.7rem' }}>
                        ⭐ PITMASTER POPULAR
                      </span>
                    )}
                  </div>

                  {/* Portion Tag */}
                  <div style={{ position: 'absolute', bottom: 12, left: 12, fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.65)', padding: '3px 8px', borderRadius: 4 }}>
                    Portion: {dish.portionSize}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: 6 }}>{dish.name}</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
                      {dish.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                      ${dish.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onSelectDish(dish)}
                      className="btn btn-primary btn-sm"
                    >
                      <span>+ Customize & Add</span>
                    </button>
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
