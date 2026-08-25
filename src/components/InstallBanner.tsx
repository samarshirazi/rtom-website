import React, { useState, useEffect } from 'react';

type DeferredPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isIOSSafari, setIsIOSSafari] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already in standalone / installed mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.startsWith('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if previously dismissed in session
    const dismissed = sessionStorage.getItem('rtom_install_banner_dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    const ua = navigator.userAgent || '';
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const safari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|YaBrowser/.test(ua);

    setIsIOS(ios);
    setIsIOSSafari(safari);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as DeferredPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      sessionStorage.setItem('rtom_install_banner_dismissed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Install prompt error:', err);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('rtom_install_banner_dismissed', 'true');
  };

  if (isInstalled || isDismissed) {
    return null;
  }

  // If on desktop and no beforeinstallprompt, or not iOS, only show if prompt is available or on mobile
  const showBanner = Boolean(deferredPrompt) || isIOS;

  if (!showBanner) {
    return null;
  }

  return (
    <aside
      aria-label="Install application banner"
      style={{
        background: 'var(--color-rust)',
        color: '#FFFFFF',
        padding: '10px 16px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '0.88rem',
        fontFamily: 'var(--font-heading)',
        letterSpacing: '0.03em',
        zIndex: 1000,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '260px' }}>
        <span style={{ fontSize: '1.2rem' }}>📱</span>
        <span>
          {isIOS ? (
            isIOSSafari ? (
              <>
                <strong>Install RTOM BBQ:</strong> Tap <span style={{ textDecoration: 'underline' }}>Share</span> (⎋) then <strong>'Add to Home Screen'</strong> for 1-tap ordering.
              </>
            ) : (
              <>
                <strong>Install RTOM BBQ:</strong> Open in Safari, tap <span style={{ textDecoration: 'underline' }}>Share</span> and <strong>'Add to Home Screen'</strong>.
              </>
            )
          ) : (
            <>
              <strong>Install RTOM BBQ App</strong> for faster 1-tap smokehouse ordering & live updates.
            </>
          )}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {deferredPrompt && (
          <button
            onClick={handleInstallClick}
            style={{
              background: '#1A1918',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 14px',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            Install App
          </button>
        )}

        <button
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '1.1rem',
            cursor: 'pointer',
            padding: '2px 6px',
            opacity: 0.85,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>
    </aside>
  );
};
