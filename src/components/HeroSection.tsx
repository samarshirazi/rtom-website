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
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(180deg, rgba(14, 13, 12, 0.4) 0%, rgba(14, 13, 12, 0.95) 100%), url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat`,
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-gold)',
      }}
    >
      {/* Glow Effect */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(212, 163, 56, 0.22) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(211, 72, 38, 0.22) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, padding: '60px 24px' }}>
        <div style={{ maxWidth: '780px' }}>
          {/* Badge */}
          <div className="badge badge-gold" style={{ marginBottom: 20 }}>
            <span>🔥</span>
            <span>PITMASTER SMOKEHOUSE SPECIALISTS</span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 20,
              letterSpacing: '-0.02em',
            }}
          >
            Authentic Smokehouse BBQ.{' '}
            <span className="gradient-text-gold">Slow-Smoked Over Hickory & Charcoal.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-muted)',
              marginBottom: 36,
              maxWidth: '650px',
              lineHeight: 1.6,
            }}
          >
            From 12-hour hickory smoked beef ribs and tender goat biryani to melt-in-your-mouth shami kebabs and charcoal chicken tikka. Order online for instant delivery or book custom BBQ catering for your event.
          </p>

          {/* Call to Actions */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
            <button onClick={onExploreMenu} className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '14px 30px' }}>
              🔥 Explore Menu Catalog
            </button>
            <button onClick={onOpenCatering} className="btn btn-outline" style={{ fontSize: '1.05rem', padding: '14px 30px' }}>
              🍖 Calculate Catering Order
            </button>
          </div>

          {/* Feature Highlights Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              background: 'rgba(23, 22, 20, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.8rem' }}>🥩</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold-light)' }}>100% Halal Meats</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Hand-cut, premium cuts</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.8rem' }}>🪵</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold-light)' }}>12-Hr Wood Smoked</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Real hickory & pit coal</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.8rem' }}>🛵</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold-light)' }}>Fresh & Hot Delivery</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Thermal sealed packaging</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
