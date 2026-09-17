import React from 'react';
import { BUSINESS_PHONE_DISPLAY, BUSINESS_TEL } from '../lib/constants';

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
          🪵 100% Halal Artisan Pitmaster BBQ • Delicacies for Celebrations & Events
        </div>
      </div>

      {/* 2. Franklin BBQ Iconic Statement Press Quote Banner */}
      <div className="franklin-quote-banner">
        <div className="container">
          <h2>“ARTISAN SLOW-SMOKED DELICACIES FOR CELEBRATIONS, PARTIES & SPECIAL GATHERINGS.”</h2>
          <div className="attribution">— RTOM Pitmaster Smokehouse • Edmonton Metro</div>
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
              SLOW-SMOKED DELICACIES FOR MEMORABLE CELEBRATIONS
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
              Real wood-fired smokehouse barbecue crafted with patience over seasoned hardwood coals. Every feast is smoked fresh to order with a <strong>minimum of 1 day advance notice</strong> for family celebrations, dinner parties, weekend gatherings, and special events. Fall-off-the-bone lamb shanks, whole charcoal chicken, and legendary pit platters.
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
              <button
                onClick={onExploreMenu}
                className="btn btn-rust"
                style={{ fontSize: '1rem', padding: '14px 28px' }}
              >
                🔥 View Delicacy Menu
              </button>
              <a
                href={BUSINESS_TEL}
                className="btn btn-dark"
                style={{ fontSize: '1rem', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 6 }}
                title="Call to Order directly"
              >
                <span>📞</span>
                <span>Call to Reserve: <strong>{BUSINESS_PHONE_DISPLAY}</strong></span>
              </a>
              <button
                onClick={onOpenCatering}
                className="btn btn-outline"
                style={{ fontSize: '1rem', padding: '14px 24px' }}
              >
                🍖 Party & Event Calculator
              </button>
              <a
                href="https://app.rtombbq.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ fontSize: '1rem', padding: '14px 24px' }}
              >
                📱 RTOM App
              </a>
            </div>

            {/* Smokehouse Feature Badges */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
                textAlign: 'left',
              }}
            >
              <div
                className="paper-card"
                style={{
                  padding: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>🥩</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.92rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    100% Halal Certified
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Hand-selected premium cuts
                  </div>
                </div>
              </div>

              <div
                className="paper-card"
                style={{
                  padding: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>🪵</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.92rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Artisan Delicacy
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Real oak & hickory smoke
                  </div>
                </div>
              </div>

              <div
                className="paper-card"
                style={{
                  padding: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>📅</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.92rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Min. 1 Day Notice
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Smoked to order for your date
                  </div>
                </div>
              </div>

              <div
                className="paper-card"
                style={{
                  padding: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>🥂</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.92rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Parties & Events
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Celebration dining in Edmonton
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
