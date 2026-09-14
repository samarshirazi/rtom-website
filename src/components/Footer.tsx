import React from 'react';

type FooterProps = {
  onNavigateSection: (sectionId: string) => void;
};

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  return (
    <footer
      style={{
        background: '#1A1918',
        borderTop: '3px solid var(--color-rust)',
        padding: '70px 0 35px',
        color: '#D8D4C7',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <img
                src="/rtom-icon-512.png"
                alt="RTOM Barbecue Logo"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  border: '2px solid var(--color-rust)',
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-woodcut)',
                    fontSize: '1.6rem',
                    letterSpacing: '0.06em',
                    color: '#FFFFFF',
                    lineHeight: 1,
                  }}
                >
                  RTOM BARBECUE
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.72rem',
                    color: 'var(--color-rust)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  100% HALAL SMOKEHOUSE
                </div>
              </div>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.92rem',
                lineHeight: 1.7,
                color: '#BDB9AC',
                marginBottom: 20,
              }}
            >
              Authentic pitmaster smokehouse barbecue. Hand-cut 100% Halal meats slow-smoked over real hickory wood and charcoal fires. Delivered fresh and piping hot.
            </p>

            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.92rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
              📞 CALL / WHATSAPP: <strong style={{ color: 'var(--color-rust)' }}>(825) 823-8733</strong>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4
              style={{
                fontSize: '1.25rem',
                color: '#FFFFFF',
                marginBottom: 20,
                letterSpacing: '0.06em',
              }}
            >
              QUICK NAVIGATION
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => onNavigateSection('hero')} style={footerLinkStyle}>
                VISIT US & HIGHLIGHTS
              </button>
              <button onClick={() => onNavigateSection('menu')} style={footerLinkStyle}>
                SMOKEHOUSE MENU
              </button>
              <button onClick={() => onNavigateSection('catering')} style={footerLinkStyle}>
                BBQ CATERING ESTIMATOR
              </button>
              <button onClick={() => onNavigateSection('story')} style={footerLinkStyle}>
                PITMASTER STORY
              </button>
              <button onClick={() => onNavigateSection('reviews')} style={footerLinkStyle}>
                CUSTOMER REVIEWS
              </button>
              <a
                href="https://app.rtombbq.ca"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...footerLinkStyle, color: 'var(--color-rust)', fontWeight: 700 }}
              >
                📱 ORDER ON APP (APP.RTOMBBQ.CA) ➔
              </a>
            </div>
          </div>

          {/* Smokehouse Hours & Zones */}
          <div>
            <h4
              style={{
                fontSize: '1.25rem',
                color: '#FFFFFF',
                marginBottom: 20,
                letterSpacing: '0.06em',
              }}
            >
              SMOKE SCHEDULE & COVERAGE
            </h4>
            <div style={{ fontSize: '0.9rem', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: 10, color: '#BDB9AC' }}>
              <div>
                <strong style={{ color: '#FFFFFF', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Daily Service:</strong>
                <div>Tuesday – Sunday: 11:00 AM until Sold Out</div>
              </div>
              <div>
                <strong style={{ color: '#FFFFFF', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Delivery Areas:</strong>
                <div>Edmonton, Sherwood Park, St. Albert & Leduc</div>
              </div>
              <div>
                <strong style={{ color: '#FFFFFF', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Catering Advance Notice:</strong>
                <div>Minimum 48 hours notice for live pit service</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: '0.82rem',
            color: '#8E8A83',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <div>
            © {new Date().getFullYear()} RTOM Barbecue. 100% Halal Certified. Built with pride.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Pitmasters</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const footerLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#D8D4C7',
  fontFamily: 'var(--font-heading)',
  fontSize: '0.92rem',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textAlign: 'left',
  padding: 0,
  cursor: 'pointer',
  textTransform: 'uppercase',
  textDecoration: 'none',
  transition: 'color 0.15s ease',
};
