import React, { useState, useEffect } from 'react';
import { BUSINESS_PHONE_DISPLAY, BUSINESS_TEL } from '../lib/constants';

type LambShankDailyPopupProps = {
  onViewFeast: () => void;
  onQuickAdd: () => void;
};

export const LambShankDailyPopup: React.FC<LambShankDailyPopupProps> = ({
  onViewFeast,
  onQuickAdd,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed in current session
    if (typeof window === 'undefined') return;
    const dismissed = sessionStorage.getItem('rtom_shank_popup_dismissed');
    if (dismissed) return;

    // Show popup after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('rtom_shank_popup_dismissed', 'true');
  };

  const handleView = () => {
    handleDismiss();
    onViewFeast();
  };

  const handleAdd = () => {
    handleDismiss();
    onQuickAdd();
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(5px)',
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
    >
      <div
        style={{
          background: '#FAF8F4',
          borderRadius: '16px',
          maxWidth: '520px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          border: '2px solid #D9652B',
          position: 'relative',
          animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(26, 25, 24, 0.75)',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'background 0.2s ease',
          }}
          aria-label="Close Announcement"
        >
          ✕
        </button>

        {/* Hero Photo with Badge */}
        <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
          <img
            src="/images/dishes/lamb-shank.jpg"
            alt="Slow-Smoked Lamb Shank on Spiced Rice"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              background: '#BA4E18',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: 800,
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🔥</span>
            <span>DAILY PITMASTER SPECIAL</span>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '14px',
              background: 'rgba(26, 25, 24, 0.92)',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '1.05rem',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            $29.99 <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#DDD' }}>Complete Platter</span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px 26px 22px' }}>
          <div
            style={{
              fontFamily: 'var(--font-woodcut), Impact, sans-serif',
              fontSize: 'clamp(1.5rem, 3.5vw, 1.85rem)',
              color: '#1A1918',
              lineHeight: 1.15,
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            Did You Know? We Slow-Smoke Lamb Shank Fresh Daily!
          </div>

          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: '#555047',
              margin: '0 0 20px',
            }}
          >
            Every single day, our pitmaster crafts a limited batch of tender, fall-off-the-bone lamb shanks smoked 5 hours over seasoned hardwood. Served over a mountain of saffron spiced basmati rice with signature sauce and jus.
          </p>

          {/* Tenderness Callout */}
          <div
            style={{
              background: '#FFF8E1',
              border: '1px solid #FFE082',
              borderRadius: '8px',
              padding: '9px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px',
              fontSize: '0.82rem',
              color: '#5D4037',
              lineHeight: 1.35,
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>🥄</span>
            <div>
              <strong>100% Spoon-Tender:</strong> Soft enough for toddlers & grandparents with zero chewing effort!
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleView}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #E8743B 0%, #D9652B 50%, #BA4E18 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 20px',
                fontSize: '1.02rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(217, 101, 43, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.15s ease',
              }}
            >
              <span>🔥 View Daily Lamb Shank Feast</span>
              <span>→</span>
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleAdd}
                style={{
                  flex: 1,
                  background: '#1A1918',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '11px 16px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>+ Add to Cart ($29.99)</span>
              </button>

              <button
                onClick={handleDismiss}
                style={{
                  background: 'transparent',
                  border: '1px solid #DCD8CF',
                  color: '#66625C',
                  borderRadius: '8px',
                  padding: '11px 16px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Maybe Later
              </button>
            </div>

            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <a
                href={BUSINESS_TEL}
                style={{
                  fontSize: '0.82rem',
                  color: '#BA4E18',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>📞 Order by phone:</span>
                <span style={{ textDecoration: 'underline' }}>{BUSINESS_PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};
