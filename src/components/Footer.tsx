import React from 'react';

type FooterProps = {
  onNavigateSection: (sectionId: string) => void;
};

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  return (
    <footer style={{ background: '#080807', borderTop: '1px solid var(--border-gold)', padding: '60px 0 30px', color: 'var(--text-muted)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40, marginBottom: 40 }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <img
                src="/rtom-icon-512.png"
                alt="RTOM BBQ Logo"
                style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid var(--border-gold)' }}
              />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                RTOM <span style={{ color: 'var(--gold-primary)' }}>BBQ</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 16 }}>
              Authentic pitmaster smokehouse barbecue. 100% Halal meats slow-smoked over real hickory wood and charcoal. Served fresh and delivered hot.
            </p>
            <div style={{ fontSize: '0.85rem', color: 'var(--gold-light)' }}>
              📞 Call / WhatsApp: <strong>(825) 823-8733</strong>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: 16, fontFamily: 'var(--font-heading)' }}>
              Quick Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem' }}>
              <button onClick={() => onNavigateSection('hero')} style={footerLinkStyle}>Home & Highlights</button>
              <button onClick={() => onNavigateSection('menu')} style={footerLinkStyle}>Menu Catalog</button>
              <button onClick={() => onNavigateSection('catering')} style={footerLinkStyle}>Catering Calculator</button>
              <button onClick={() => onNavigateSection('story')} style={footerLinkStyle}>Pitmaster Story</button>
              <button onClick={() => onNavigateSection('reviews')} style={footerLinkStyle}>Customer Testimonials</button>
            </div>
          </div>

          {/* Delivery & Hours */}
          <div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: 16, fontFamily: 'var(--font-heading)' }}>
              Smokehouse Hours & Zone
            </h4>
            <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>📅 <strong>Monday – Sunday:</strong> 11:00 AM – 10:00 PM</div>
              <div>🛵 <strong>Delivery Zones:</strong> Calgary, Chestermere, Airdrie & Surrounding Regions</div>
              <div>🍖 <strong>Catering Booking:</strong> Minimum 48 hrs advance notice for live pit service</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: '0.82rem' }}>
          <div>© {new Date().getFullYear()} RTOM BBQ Storefront. All rights reserved. 100% Halal Certified.</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const footerLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  fontSize: '0.9rem',
  textAlign: 'left',
  padding: 0,
  cursor: 'pointer',
};
