import React from 'react';

type HeroSectionProps = {
  onExploreMenu: () => void;
  onOpenCatering: () => void;
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMenu,
  onOpenCatering,
}) => {
  return (
    <section id="hero" style={{ background: 'var(--bg-cream)' }}>
      {/* 1. Edge-to-Edge Top-Down Smokehouse Platter Hero */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(320px, 50vw, 560px)',
          overflow: 'hidden',
          backgroundColor: '#1E1D1B',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=2000&q=85"
          alt="RTOM Barbecue Smokehouse Platter"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 24,
            background: 'rgba(26, 25, 24, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          🔥 100% Halal Certified Pitmaster BBQ • Edmonton Delivery
        </div>
      </div>

      {/* 2. Franklin BBQ Iconic Statement Press Quote Banner */}
      <div className="franklin-quote-banner">
        <div className="container">
          <h2>“SERVING AUTHENTIC 100% HALAL SMOKEHOUSE BBQ IN ALBERTA.”</h2>
          <div className="attribution">— RTOM Pitmaster Smokehouse</div>
        </div>
      </div>

      {/* 3. Smokehouse Overview & Action Bar */}
      <div style={{ padding: '60px 0 70px', background: 'var(--bg-paper)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-woodcut)',
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                lineHeight: 1.15,
                color: 'var(--text-dark)',
                marginBottom: 16,
              }}
            >
              SMOKED LOW & SLOW OVER REAL HICKORY & CHARCOAL
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.12rem',
                color: 'var(--text-charcoal)',
                lineHeight: 1.75,
                marginBottom: 36,
              }}
            >
              From 12-hour hickory smoked beef ribs and tender goat biryani to melt-in-your-mouth beef shami kebabs and charcoal chicken tikka. Order online for daily delivery or book custom BBQ catering for weddings, family feasts, and corporate events.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: 48,
              }}
            >
              <a
                href="https://app.rtombbq.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-rust"
                style={{ fontSize: '1rem', padding: '14px 30px' }}
              >
                📱 Order on App (app.rtombbq.ca)
              </a>
              <button
                onClick={onExploreMenu}
                className="btn btn-dark"
                style={{ fontSize: '1rem', padding: '14px 28px' }}
              >
                🔥 Smokehouse Menu
              </button>
              <button
                onClick={onOpenCatering}
                className="btn btn-outline"
                style={{ fontSize: '1rem', padding: '14px 28px' }}
              >
                🍖 Catering Calculator
              </button>
            </div>

            {/* Smokehouse Feature Badges */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 20,
                textAlign: 'left',
              }}
            >
              <div
                className="paper-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <span style={{ fontSize: '2rem' }}>🥩</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    100% Halal Meats
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Hand-cut, premium quality cuts
                  </div>
                </div>
              </div>

              <div
                className="paper-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <span style={{ fontSize: '2rem' }}>🪵</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    12-Hr Wood Smoked
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Hickory coals & slow pit fires
                  </div>
                </div>
              </div>

              <div
                className="paper-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <span style={{ fontSize: '2rem' }}>🛵</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Fresh & Hot Delivery
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Edmonton region
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
