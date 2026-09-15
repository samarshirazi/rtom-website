import React, { useState, useMemo, useEffect } from 'react';
import type { Dish } from '../types';
import { DISHES } from '../data/dishes';
import { fetchLiveSameDayStock } from '../lib/supabaseDishes';
import { SUPABASE_DISH_MAP } from '../lib/supabaseOrders';

type MenuSectionProps = {
  dishes?: Dish[];
  onSelectDish: (dish: Dish) => void;
  onNavigateToLambShank?: () => void;
  todayStock?: Record<string, number>;
};

export const MenuSection: React.FC<MenuSectionProps> = ({
  dishes = DISHES,
  onSelectDish,
  onNavigateToLambShank,
  todayStock: propTodayStock,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [internalStock, setInternalStock] = useState<Record<string, number>>({});

  useEffect(() => {
    if (propTodayStock) return;
    let mounted = true;
    fetchLiveSameDayStock().then((stock) => {
      if (mounted && stock) setInternalStock(stock);
    });
    return () => {
      mounted = false;
    };
  }, [propTodayStock]);

  const liveStock = propTodayStock || internalStock;

  const getDishRemainingStock = (dish: Dish): number | null => {
    if (!liveStock) return null;
    if (liveStock[dish.id] !== undefined) {
      return liveStock[dish.id];
    }
    const uuid = SUPABASE_DISH_MAP[dish.id];
    if (uuid && liveStock[uuid] !== undefined) {
      return liveStock[uuid];
    }
    const lower = dish.name.toLowerCase();
    for (const [stockDishId, remaining] of Object.entries(liveStock)) {
      if (lower.includes('lamb shank') && !lower.includes('beef shank') && stockDishId === '8626cb5f-58d5-4317-ab52-4b1726b10fd0') {
        return remaining;
      }
      if (lower.includes('chicken') && stockDishId === '0c614cf5-5352-4dad-aa0d-a603c185e634') {
        return remaining;
      }
    }
    return null;
  };

  const isLambShankDish = (d: Dish): boolean =>
    d.id === 'rtom-lamb-shank' ||
    d.id === '8626cb5f-58d5-4317-ab52-4b1726b10fd0' ||
    (d.name.toLowerCase().includes('lamb shank') && !d.name.toLowerCase().includes('beef'));

  const categories = [
    { key: 'all', label: 'ALL DISHES', icon: '🔥' },
    { key: 'daily', label: 'DAILY AVAILABLE (ORDER NOW)', icon: '⚡' },
    { key: 'preorder', label: 'ADVANCE PRE-ORDER', icon: '📅' },
    { key: 'sides', label: 'SMOKEHOUSE SIDES', icon: '🫓' },
    { key: 'mutton', label: 'MUTTON & LAMB', icon: '🍖' },
    { key: 'beef', label: 'BEEF SPECIALS', icon: '🥩' },
    { key: 'chicken', label: 'CHARCOAL CHICKEN', icon: '🍗' },
  ];

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      let matchesCategory = true;
      if (selectedCategory === 'daily') {
        matchesCategory = dish.deliveryType === 'same-day' && dish.category !== 'sides';
      } else if (selectedCategory === 'preorder') {
        matchesCategory = dish.deliveryType === 'pre-order';
      } else if (selectedCategory !== 'all') {
        matchesCategory = dish.category === selectedCategory;
      }
      const matchesSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [dishes, selectedCategory, searchQuery]);

  const dailyDishes = useMemo(() => {
    return dishes.filter((d) => d.deliveryType === 'same-day' && d.category !== 'sides');
  }, [dishes]);

  const preOrderDishes = useMemo(() => {
    return dishes.filter((d) => d.deliveryType === 'pre-order');
  }, [dishes]);

  const sideDishes = useMemo(() => {
    return dishes.filter((d) => d.category === 'sides');
  }, [dishes]);

  const renderDishCard = (dish: Dish) => {
    const remaining = getDishRemainingStock(dish);
    const isSoldOut = remaining !== null && remaining === 0;
    const showScarcity = remaining !== null && remaining > 0 && remaining < 5;

    return (
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
                  onClick={isLambShankDish(dish) && onNavigateToLambShank ? onNavigateToLambShank : undefined}
                  style={{
                    position: 'relative',
                    height: 210,
                    width: '100%',
                    overflow: 'hidden',
                    cursor: isLambShankDish(dish) && onNavigateToLambShank ? 'pointer' : 'default',
                  }}
                  title={isLambShankDish(dish) ? 'Click to view 5-Hour Lamb Shank Feast Story' : undefined}
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
                  {isLambShankDish(dish) && (
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
                      onClick={isLambShankDish(dish) && onNavigateToLambShank ? onNavigateToLambShank : undefined}
                      style={{
                        fontSize: '1.45rem',
                        fontFamily: 'var(--font-woodcut)',
                        letterSpacing: '0.04em',
                        color: 'var(--text-dark)',
                        marginBottom: 6,
                        cursor: isLambShankDish(dish) && onNavigateToLambShank ? 'pointer' : 'default',
                      }}
                    >
                      {dish.name}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                      {/* Scarcity badge: ONLY shown when less than 5 items remain! If >= 5 or unset, customer sees nothing */}
                      {isSoldOut ? (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            background: '#FFEBEE',
                            color: '#C62828',
                            border: '1px solid #EF9A9A',
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase',
                          }}
                        >
                          <span>Sold out today</span>
                        </div>
                      ) : showScarcity ? (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            background: '#FBE9E7',
                            color: '#C0392B',
                            border: '1px solid #FFAB91',
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase',
                          }}
                        >
                          <span>🔥 Only {remaining} left today!</span>
                        </div>
                      ) : null}

                      {dish.deliveryType === 'same-day' && dish.category !== 'sides' ? (
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
                          }}
                        >
                          <span>⚡ AVAILABLE DAILY • READY TONIGHT</span>
                        </div>
                      ) : dish.category === 'sides' ? (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            background: '#F1F5F9',
                            color: '#334155',
                            border: '1px solid #CBD5E1',
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase',
                          }}
                        >
                          <span>🫓 SMOKEHOUSE SIDE • PAIR WITH MAINS</span>
                        </div>
                      ) : dish.id === 'rtom-beef-shank-mac' || dish.id === 'rtom-leg-of-lamb' ? (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            background: '#FFF3E0',
                            color: '#C2410C',
                            border: '1px solid #FFCC80',
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase',
                          }}
                        >
                          <span>📅 WEEKEND PRE-ORDER (SAT & SUN)</span>
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
                          }}
                        >
                          <span>📅 24H PRE-ORDER • PICK DELIVERY DAY</span>
                        </div>
                      )}
                    </div>
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
                    {isSoldOut ? (
                      <button
                        disabled
                        className="btn btn-sm"
                        style={{
                          fontSize: '0.8rem',
                          padding: '8px 14px',
                          background: '#E2E8F0',
                          color: '#64748B',
                          cursor: 'not-allowed',
                          border: 'none',
                          fontWeight: 700,
                        }}
                      >
                        <span>Sold Out Today</span>
                      </button>
                    ) : isLambShankDish(dish) && onNavigateToLambShank ? (
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
    );
  };

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

        {/* Smokehouse Craft Explainer Banner */}
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto 40px',
            background: 'var(--bg-paper)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '24px 28px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--color-rust)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              🪵 The Smokehouse Difference
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-woodcut)',
                fontSize: '1.45rem',
                color: 'var(--text-dark)',
                margin: 0,
                letterSpacing: '0.04em',
              }}
            >
              WHY REAL CRAFT BBQ CANNOT BE DELIVERED IN 30 MINUTES
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                fontFamily: 'var(--font-serif)',
                color: 'var(--text-muted)',
                margin: '8px auto 0',
                maxWidth: '680px',
                lineHeight: 1.55,
              }}
            >
              Unlike fast-food restaurants that microwave pre-cooked food on demand, authentic Texas-style barbecue is a slow, unhurried art. Here is why we schedule orders in advance:
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: 18,
              textAlign: 'left',
            }}
          >
            <div style={{ background: 'var(--bg-cream)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: 6 }}>⏳</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 4, textTransform: 'uppercase' }}>
                10–14 Hours Low & Slow
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                No shortcuts or flash-frying. Briskets and short ribs smoke through the night over seasoned hardwood embers to develop deep smoke rings and peppery bark.
              </p>
            </div>

            <div style={{ background: 'var(--bg-cream)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: 6 }}>🚫</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 4, textTransform: 'uppercase' }}>
                Zero Warming Trays
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                We never store meats under drying buffet heat lamps. Advance scheduling allows our pitmaster to smoke exact batch quantities so your meat is pulled fresh for your slot.
              </p>
            </div>

            <div style={{ background: 'var(--bg-cream)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: 6 }}>♨️</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 4, textTransform: 'uppercase' }}>
                The Essential Rest
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                Slicing hot meat straight off the pit drains its moisture. Our roasts rest for hours in thermal cambros so collagen melts into silky, spoon-tender juices.
              </p>
            </div>
          </div>
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
              placeholder="Search smokehouse dishes (e.g. Lamb Shank, Brisket, Ribs, Chicken)..."
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
        ) : selectedCategory === "all" && !searchQuery ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {/* 1. Daily Available Dishes */}
            {dailyDishes.length > 0 && (
              <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div
                  style={{
                    padding: "20px 24px",
                    background: "linear-gradient(135deg, rgba(6, 95, 70, 0.08) 0%, rgba(16, 185, 129, 0.12) 100%)",
                    border: "1.5px solid rgba(16, 185, 129, 0.35)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                    <span
                      style={{
                        background: "#065F46",
                        color: "#FFFFFF",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        padding: "3px 9px",
                        borderRadius: "var(--radius-sm)",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      ⚡ AVAILABLE DAILY • READY TONIGHT
                    </span>
                    <span style={{ fontSize: "0.88rem", color: "#047857", fontWeight: 700 }}>
                      Same-Day Dinner Delivery
                    </span>
                  </div>
                  <h3
                    style={{
                      margin: "0 0 4px",
                      fontSize: "1.45rem",
                      fontFamily: "var(--font-woodcut)",
                      color: "var(--text-dark)",
                    }}
                  >
                    DAILY AVAILABLE SMOKEHOUSE DISHES (ORDER NOW)
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
                    Slow-smoked fresh each morning over hardwood embers. Order by 2 PM for delivery tonight (or schedule any future date).
                  </p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: 28,
                  }}
                >
                  {dailyDishes.map(renderDishCard)}
                </div>
              </section>
            )}

            {/* 2. Advance Pre-Order Dishes */}
            {preOrderDishes.length > 0 && (
              <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div
                  style={{
                    padding: "20px 24px",
                    background: "linear-gradient(135deg, rgba(120, 53, 15, 0.08) 0%, rgba(245, 158, 11, 0.12) 100%)",
                    border: "1.5px solid rgba(245, 158, 11, 0.35)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                    <span
                      style={{
                        background: "#7C2D12",
                        color: "#FFFFFF",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        padding: "3px 9px",
                        borderRadius: "var(--radius-sm)",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      📅 ADVANCE PRE-ORDER • PITMASTER SPECIALS
                    </span>
                    <span style={{ fontSize: "0.88rem", color: "#B45309", fontWeight: 700 }}>
                      14-Hour Low & Slow Smokes
                    </span>
                  </div>
                  <h3
                    style={{
                      margin: "0 0 4px",
                      fontSize: "1.45rem",
                      fontFamily: "var(--font-woodcut)",
                      color: "var(--text-dark)",
                    }}
                  >
                    PRE-ORDER DISHES (SELECT YOUR DELIVERY DATE)
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
                    Artisan barbecue prepared in limited small batches. Beef Shank & Leg of Lamb are smoked fresh for weekend delivery (Saturday & Sunday).
                  </p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: 28,
                  }}
                >
                  {preOrderDishes.map(renderDishCard)}
                </div>
              </section>
            )}

            {/* 3. Smokehouse Sides & Sauces */}
            {sideDishes.length > 0 && (
              <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div
                  style={{
                    padding: "20px 24px",
                    background: "linear-gradient(135deg, rgba(30, 41, 59, 0.05) 0%, rgba(71, 85, 105, 0.08) 100%)",
                    border: "1.5px solid rgba(100, 116, 139, 0.3)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                    <span
                      style={{
                        background: "#1E293B",
                        color: "#F8FAFC",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "3px 9px",
                        borderRadius: "var(--radius-sm)",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      🫓 SMOKEHOUSE SIDES & SAUCES
                    </span>
                    <span style={{ fontSize: "0.88rem", color: "#475569", fontWeight: 600 }}>
                      Pair with any main barbecue dish
                    </span>
                  </div>
                  <h3
                    style={{
                      margin: "0 0 4px",
                      fontSize: "1.45rem",
                      fontFamily: "var(--font-woodcut)",
                      color: "var(--text-dark)",
                    }}
                  >
                    ARTISAN SIDES & SAUCES
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
                    Fragrant spiced basmati rice, slow-baked sharp cheddar mac & cheese, signature smoked meat jus, and cold-emulsified garlic toum.
                  </p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: 28,
                  }}
                >
                  {sideDishes.map(renderDishCard)}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 28,
            }}
          >
            {filteredDishes.map(renderDishCard)}
          </div>
        )}
      </div>
    </section>
  );
};