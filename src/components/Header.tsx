import React, { useState, useEffect } from 'react';

type HeaderProps = {
  cartItemCount: number;
  onOpenCart: () => void;
  onNavigateSection: (sectionId: string) => void;
};

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  onOpenCart,
  onNavigateSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isScrolled ? 'rgba(14, 13, 12, 0.94)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(212, 163, 56, 0.2)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: '16px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('hero')}
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
        >
          <img
            src="/rtom-icon-512.png"
            alt="RTOM BBQ Logo"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              boxShadow: '0 0 16px rgba(212, 163, 56, 0.35)',
              border: '2px solid rgba(212, 163, 56, 0.5)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                lineHeight: 1.1,
                color: 'var(--text-main)',
              }}
            >
              RTOM <span style={{ color: 'var(--gold-primary)' }}>BBQ</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Smokehouse BBQ, Delivered
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <button
            onClick={() => handleNavClick('menu')}
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Menu Catalog
          </button>
          <button
            onClick={() => handleNavClick('catering')}
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Catering Calculator
          </button>
          <button
            onClick={() => handleNavClick('story')}
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Pitmaster Story
          </button>
          <button
            onClick={() => handleNavClick('reviews')}
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Reviews
          </button>
        </nav>

        {/* Right Actions: Phone + App Button + Cart Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a
            href="tel:18258238733"
            className="phone-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--gold-light)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            <span>📞</span>
            <span className="phone-number">(825) 823-8733</span>
          </a>

          {/* App Direct Order Link */}
          <a
            href="https://app.rtombbq.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="app-order-btn btn btn-flame"
            style={{
              padding: '9px 15px',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
            }}
          >
            <span>📱 Order on App</span>
          </a>

          <button
            onClick={onOpenCart}
            className="btn btn-primary"
            style={{ position: 'relative', padding: '9px 16px', fontSize: '0.88rem' }}
          >
            <span>🛒 Cart</span>
            {cartItemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  background: 'var(--flame-red)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(211, 72, 38, 0.6)',
                }}
              >
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '1.6rem',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-gold)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            marginTop: 10,
          }}
        >
          <a
            href="https://app.rtombbq.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-flame"
            style={{ textAlign: 'center', padding: '12px', textDecoration: 'none', justifyContent: 'center' }}
          >
            📱 Order on RTOM App (app.rtombbq.ca)
          </a>
          <button onClick={() => handleNavClick('menu')} style={mobileBtnStyle}>🔥 Menu Catalog</button>
          <button onClick={() => handleNavClick('catering')} style={mobileBtnStyle}>🍖 BBQ Catering Calculator</button>
          <button onClick={() => handleNavClick('story')} style={mobileBtnStyle}>🪵 Pitmaster Story</button>
          <button onClick={() => handleNavClick('reviews')} style={mobileBtnStyle}>⭐ Customer Reviews</button>
        </div>
      )}

      <style>{`
        @media (max-width: 868px) {
          .desktop-nav { display: none !important; }
          .phone-number { display: none; }
          .mobile-hamburger { display: block !important; }
        }
      `}</style>
    </header>
  );
};

const mobileBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-main)',
  fontSize: '1.05rem',
  fontWeight: 600,
  textAlign: 'left',
  padding: '8px 0',
  cursor: 'pointer',
};
