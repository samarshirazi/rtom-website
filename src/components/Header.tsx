import React, { useState } from 'react';
import { BUSINESS_PHONE_DISPLAY, BUSINESS_TEL } from '../lib/constants';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        background: 'var(--bg-cream)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* VIP Rewards & App Announcement Bar */}
      <div
        style={{
          background: 'var(--color-rust)',
          color: '#fff',
          padding: '6px 12px',
          textAlign: 'center',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          textTransform: 'uppercase',
          flexWrap: 'wrap',
        }}
      >
        <span>🎁 RTOM VIP Rewards: Earn 5% BBQ Cashback & Track Orders Live</span>
        <a
          href="https://app.rtombbq.ca"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#FFE0B2',
            textDecoration: 'underline',
            fontWeight: 700,
          }}
        >
          Order on App →
        </a>
      </div>
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 14,
          paddingBottom: 14,
        }}
      >
        {/* Brand Identity / Logo */}
        <div
          onClick={() => handleNavClick('hero')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <img
            src="/rtom-icon-512.png"
            alt="RTOM Barbecue Logo"
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--text-dark)',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-woodcut)',
                fontSize: '1.75rem',
                lineHeight: 1,
                letterSpacing: '0.06em',
                color: 'var(--text-dark)',
              }}
            >
              RTOM BARBECUE
            </div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-rust)',
                marginTop: 2,
              }}
            >
              100% HALAL SMOKEHOUSE • EST. EDMONTON
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 26,
          }}
        >
          <button onClick={() => handleNavClick('hero')} style={navLinkStyle}>
            VISIT US
          </button>
          <button onClick={() => handleNavClick('menu')} style={navLinkStyle}>
            MENU
          </button>

          <button onClick={() => handleNavClick('catering')} style={navLinkStyle}>
            CATERING
          </button>
          <button onClick={() => handleNavClick('story')} style={navLinkStyle}>
            PITMASTER STORY
          </button>
          <button onClick={() => handleNavClick('reviews')} style={navLinkStyle}>
            REVIEWS
          </button>
        </nav>

        {/* Right Actions: Phone + Franklin Chevron Order Button + Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a
            href={BUSINESS_TEL}
            className="phone-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--text-dark)',
              textDecoration: 'none',
              fontSize: '0.92rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              letterSpacing: '0.03em',
              background: '#FFF8E1',
              border: '1px solid #FFE082',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
            }}
            title="Call Pitmaster to Order"
          >
            <span>📞</span>
            <span className="phone-number">CALL: {BUSINESS_PHONE_DISPLAY}</span>
          </a>

          {/* Franklin-Style Chevron Arrow Button for App Order */}
          <a
            href="https://app.rtombbq.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-chevron desktop-order-btn"
            title="Order online at app.rtombbq.ca"
          >
            Order on App
          </a>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="btn btn-dark"
            style={{
              position: 'relative',
              padding: '10px 18px',
              fontSize: '0.85rem',
            }}
          >
            <span>🛒 Cart</span>
            {cartItemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  background: 'var(--color-rust)',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(217, 101, 43, 0.5)',
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
              color: 'var(--text-dark)',
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
            background: 'var(--bg-paper)',
            borderBottom: '2px solid var(--border-dark)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <a
            href="https://app.rtombbq.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-rust"
            style={{
              textAlign: 'center',
              padding: '12px',
              textDecoration: 'none',
              justifyContent: 'center',
              fontFamily: 'var(--font-script)',
              fontSize: '1.25rem',
            }}
          >
            Order in Advance on App ➔
          </a>
          <a
            href={BUSINESS_TEL}
            className="btn btn-dark"
            style={{
              textAlign: 'center',
              padding: '12px',
              textDecoration: 'none',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 700,
            }}
          >
            📞 Call to Order: {BUSINESS_PHONE_DISPLAY}
          </a>
          <button onClick={() => handleNavClick('hero')} style={mobileBtnStyle}>
            VISIT US
          </button>
          <button onClick={() => handleNavClick('menu')} style={mobileBtnStyle}>
            SMOKEHOUSE MENU
          </button>

          <button onClick={() => handleNavClick('catering')} style={mobileBtnStyle}>
            BBQ CATERING CALCULATOR
          </button>
          <button onClick={() => handleNavClick('story')} style={mobileBtnStyle}>
            PITMASTER STORY
          </button>
          <button onClick={() => handleNavClick('reviews')} style={mobileBtnStyle}>
            CUSTOMER REVIEWS
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .desktop-nav { display: none !important; }
          .phone-number { display: none; }
          .desktop-order-btn { display: none !important; }
          .mobile-hamburger { display: block !important; }
        }
      `}</style>
    </header>
  );
};

const navLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-dark)',
  fontFamily: 'var(--font-heading)',
  fontSize: '0.98rem',
  fontWeight: 600,
  letterSpacing: '0.06em',
  cursor: 'pointer',
  padding: '6px 2px',
  transition: 'all 0.18s ease',
  textTransform: 'uppercase',
};

const mobileBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-dark)',
  fontFamily: 'var(--font-heading)',
  fontSize: '1.1rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textAlign: 'left',
  padding: '8px 0',
  cursor: 'pointer',
  textTransform: 'uppercase',
  borderBottom: '1px dashed var(--border-subtle)',
};
