import React, { useState, useEffect } from 'react';
import type { Dish } from '../types';
import { DISHES } from '../data/dishes';

/* -------------------------------------------------------------------------- */
/* OPEN DECISION PLACEHOLDERS                                                 */
/* Flagged as requested for business lock-in before going live:               */
/* 1. PRICE_PLACEHOLDER: Featured sale price vs total value stack             */
/* 2. GARLIC_SAUCE_PLACEHOLDER: Condiment pairing (Toum / Mint Chutney)       */
/* 3. NIGHT_DELIVERY_PLACEHOLDER: Late night cutoff & Edmonton delivery radius*/
/* 4. IMPULSE_ORDER_PLACEHOLDER: 1-click upsell / add-on configuration        */
/* -------------------------------------------------------------------------- */
export const FUNNEL_PLACEHOLDERS = {
  PRICE: '$29.99', // [PRICE_PLACEHOLDER]
  PRICE_LABEL: '[PRICE_PLACEHOLDER: $29.99]',
  GARLIC_SAUCE: '[GARLIC_SAUCE_PLACEHOLDER: House Garlic Toum & Herb Infusion]',
  NIGHT_DELIVERY: '[NIGHT_DELIVERY_PLACEHOLDER: Edmonton Metro Night Delivery (7 PM - 1 AM)]',
  IMPULSE_ORDER: '[IMPULSE_ORDER_PLACEHOLDER: 1-Click Add-on: Extra Shank or Skillet Mac & Cheese]',
};

type LambShankFunnelPageProps = {
  onBackToMenu: () => void;
  onAddToCart: (
    dish: Dish,
    quantity: number,
    selectedOptions: { groupId: string; groupName: string; optionId: string; optionName: string; priceDelta: number }[],
    unitPrice: number
  ) => void;
};

export const LambShankFunnelPage: React.FC<LambShankFunnelPageProps> = ({
  onBackToMenu,
  onAddToCart,
}) => {
  // Find lamb shank dish from dataset
  const lambShankDish = DISHES.find((d) => d.id === 'rtom-lamb-shank') || DISHES[0];

  // Scarcity countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [includeUpsell, setIncludeUpsell] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOrderNow = () => {
    // Add Lamb Shank to cart and open checkout drawer
    onAddToCart(lambShankDish, 1, [], lambShankDish.price);
  };

  const scrollToStack = () => {
    const el = document.getElementById('value-stack-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#FAF8F4', color: '#1A1918', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {/* 1. SCARCITY STICKY HEADER (Russell Brunson Top Bar) */}
      <div
        style={{
          background: '#BA4E18',
          color: '#FFFFFF',
          padding: '10px 16px',
          textAlign: 'center',
          fontSize: '0.88rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          position: 'sticky',
          top: 0,
          zIndex: 110,
          boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ animation: 'pulse 1.5s infinite', display: 'inline-block' }}>🔥</span>
          <span>TODAY'S PIT BATCH: <strong>ONLY 14 OF 45 SHANKS REMAINING</strong></span>
        </div>
        <div
          style={{
            background: 'rgba(0,0,0,0.25)',
            padding: '4px 12px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            fontSize: '0.9rem',
          }}
        >
          PIT CUTOFF IN: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <button
          onClick={onBackToMenu}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.4)',
            color: '#FFFFFF',
            padding: '3px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.78rem',
            marginLeft: '8px',
          }}
        >
          ← Back to Main Menu
        </button>
      </div>

      {/* 2. THE HOOK / ABOVE THE FOLD */}
      <section style={{ padding: '50px 20px 40px', maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Pre-Headline */}
        <div
          style={{
            display: 'inline-block',
            background: '#D9652B',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.82rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '6px 16px',
            borderRadius: '4px',
            marginBottom: '18px',
            boxShadow: '0 3px 8px rgba(217, 101, 43, 0.3)',
          }}
        >
          ⭐ ATTENTION EDMONTON SMOKEHOUSE & MEAT LOVERS ⭐
        </div>

        {/* Big Bold Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-woodcut), Impact, sans-serif',
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            lineHeight: 1.08,
            color: '#1A1918',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          The 8-Hour Slow-Smoked Lamb Shank That Pulls Off The Bone{' '}
          <span style={{ color: '#D9652B', textDecoration: 'underline' }}>With Just A Spoon...</span>
        </h1>

        {/* Agitated Sub-headline */}
        <p
          style={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: 'clamp(1.1rem, 2.4vw, 1.35rem)',
            lineHeight: 1.5,
            color: '#4A4640',
            maxWidth: '780px',
            margin: '0 auto 32px',
            fontStyle: 'italic',
          }}
        >
          Resting on a mountain of 24-hour spiced basmati rice bloomed in saffron, ghee, and whole roasted spices. 
          Zero dry takeout. Zero rubbery meat. Just gelatinous, fall-apart smokehouse royalty delivered piping hot to your door.
        </p>

        {/* Hero Visual Card */}
        <div
          style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 18px 45px rgba(0,0,0,0.18)',
            border: '4px solid #FFFFFF',
            marginBottom: '36px',
          }}
        >
          <img
            src="/images/dishes/lamb-shank.jpg"
            alt="Slow-braised roasted lamb shank served over spiced basmati rice"
            style={{
              width: '100%',
              maxHeight: '520px',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {/* Visual Badges Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: 'rgba(26, 25, 24, 0.92)',
              color: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            🔥 8-HR HARDWOOD SMOKE • 100% HALAL
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              background: '#D9652B',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '1.2rem',
              fontWeight: 800,
              boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
            }}
          >
            {FUNNEL_PLACEHOLDERS.PRICE} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>(Complete Feast)</span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div style={{ maxWidth: '580px', margin: '0 auto 20px' }}>
          <button
            onClick={scrollToStack}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #E8743B 0%, #D9652B 50%, #BA4E18 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '20px 28px',
              fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
              fontFamily: 'var(--font-heading), sans-serif',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 10px 28px rgba(217, 101, 43, 0.45)',
              transition: 'transform 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <span>👉 CLAIM MY LAMB SHANK FEAST NOW</span>
            <span style={{ fontSize: '1.4rem' }}>→</span>
          </button>
          <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#777169' }}>
            🔒 100% "Clean Bone Pull" Guarantee • Thermal-Sealed Heat Retention
          </div>
        </div>

        {/* Trust Badges Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            padding: '20px 0',
            borderTop: '1px solid #E2DED5',
            borderBottom: '1px solid #E2DED5',
            marginTop: '30px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
            <span style={{ color: '#2E7D32', fontSize: '1.2rem' }}>✓</span> 100% Hand-Slaughtered Halal
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
            <span style={{ color: '#2E7D32', fontSize: '1.2rem' }}>✓</span> Authentic Hardwood Pit Smoke
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
            <span style={{ color: '#2E7D32', fontSize: '1.2rem' }}>✓</span> Aged Basmati Rice Bed Included
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
            <span style={{ color: '#2E7D32', fontSize: '1.2rem' }}>✓</span> Delivered Piping Hot
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM / AGITATION (The Villain: Cheap Takeout) */}
      <section style={{ background: '#1E1D1B', color: '#F4F1E8', padding: '60px 20px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ color: '#D9652B', fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.85rem' }}>
              THE HARD TRUTH ABOUT TAKEOUT LAMB
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-woodcut), Impact, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                marginTop: '8px',
              }}
            >
              Why Most Takeout Lamb In Edmonton Is An Expensive Letdown
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginBottom: '36px',
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '24px',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚫</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: '#E8743B' }}>
                Rushed & Boiled Shortcuts
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#B8B3A8', lineHeight: 1.5 }}>
                Most restaurants pressure-cook or boil their lamb to save hours. The result? Greasy, rubbery meat where the flavor never penetrates the bone.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '24px',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🍚</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: '#E8743B' }}>
                Bland, Dry Filler Rice
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#B8B3A8', lineHeight: 1.5 }}>
                Standard takeout gives you clumped white or generic yellow rice cooked in water with zero meat pan drippings or real aromatics.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '24px',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🥶</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: '#E8743B' }}>
                Lukewarm On Delivery
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#B8B3A8', lineHeight: 1.5 }}>
                Thin plastic containers leak heat on the drive, turning what could have been a feast into a cold, congealed disappointment.
              </p>
            </div>
          </div>

          <div
            style={{
              background: '#2A2724',
              borderLeft: '4px solid #D9652B',
              padding: '20px 24px',
              borderRadius: '0 8px 8px 0',
              fontStyle: 'italic',
              fontSize: '1.05rem',
            }}
          >
            "We believe when you order a lamb feast, you deserve a restaurant-quality centerpiece that commands respect on your dining table." — The RTOM Pitmaster
          </div>
        </div>
      </section>

      {/* 4. THE EPIPHANY BRIDGE STORY (Russell Brunson Framework) */}
      <section style={{ padding: '70px 20px', maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ color: '#D9652B', fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.82rem' }}>
            BEHIND THE SMOKE
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-woodcut), Impact, sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            How We Perfected The 8-Hour Clean-Bone Pull
          </h2>
        </div>

        <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#33302C' }}>
          <p style={{ marginBottom: '18px' }}>
            Two years ago, our pitmaster noticed something frustrating in Edmonton: people craved grand, banquet-style smoked meats at home, but could only find fast-food shortcuts or bland catering trays.
          </p>
          <p style={{ marginBottom: '18px' }}>
            Lamb shank is notoriously stubborn. Cook it too fast, and it’s tough as leather. Cook it with boiling water, and you wash away the rich essence.
          </p>
          <p style={{ marginBottom: '18px' }}>
            We made a commitment: <strong>no shortcuts, no speed dials, no boiling pots</strong>. We dialed in our custom smoker at 225°F using seasoned local hardwoods. We tested dozens of dry rub blends before creating our 24-hour yogurt and toasted spice marinade that tenderizes deep into the bone marrow.
          </p>
          <p style={{ marginBottom: '18px' }}>
            By hour eight, the connective tissue completely liquefies into rich, savory gelatin. When you hold the bone, the tender meat gently slides right off with zero knife required.
          </p>
          <p>
            And because great meat deserves an equally legendary base, our basmati rice is toasted in clarified ghee, bloomed with saffron threads, cardamom pods, and infused with the rich smoked pan drippings. Every grain tells a story.
          </p>
        </div>
      </section>

      {/* 5. THE 3-STAGE MECHANISM */}
      <section style={{ background: '#F0ECE1', padding: '60px 20px', borderTop: '1px solid #DFD9CB', borderBottom: '1px solid #DFD9CB' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-woodcut), Impact, sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              marginBottom: '40px',
            }}
          >
            The 3-Stage RTOM Smokehouse Infusion
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '12px', border: '1px solid #E2DED5' }}>
              <div style={{ color: '#D9652B', fontWeight: 900, fontSize: '1.8rem', marginBottom: '8px' }}>01</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>24-Hr Deep Marination</h3>
              <p style={{ fontSize: '0.92rem', color: '#66625C', lineHeight: 1.6 }}>
                Infused with whole toasted cumin, coriander seeds, cracked black pepper, garlic, and Greek yogurt to naturally break down fibers and embed deep flavor.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '12px', border: '1px solid #E2DED5' }}>
              <div style={{ color: '#D9652B', fontWeight: 900, fontSize: '1.8rem', marginBottom: '8px' }}>02</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>8-Hour Hardwood Smoke</h3>
              <p style={{ fontSize: '0.92rem', color: '#66625C', lineHeight: 1.6 }}>
                Bathed in rolling hickory smoke inside our pitmaster smoker until a dark mahogany bark forms and the meat softens into pure melt-in-your-mouth bliss.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '12px', border: '1px solid #E2DED5' }}>
              <div style={{ color: '#D9652B', fontWeight: 900, fontSize: '1.8rem', marginBottom: '8px' }}>03</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Steam-Lock Rice Bed Plating</h3>
              <p style={{ fontSize: '0.92rem', color: '#66625C', lineHeight: 1.6 }}>
                Rested directly over a heaping bed of spiced saffron basmati rice so every drop of rich natural jus soaks straight into the rice grains before delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RUSSELL BRUNSON VALUE STACK ("THE STACK SLIDE") */}
      <section id="value-stack-section" style={{ padding: '80px 20px', maxWidth: '860px', margin: '0 auto' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '3px solid #D9652B',
            borderRadius: '16px',
            padding: 'clamp(24px, 5vw, 48px)',
            boxShadow: '0 20px 50px rgba(217, 101, 43, 0.15)',
            position: 'relative',
          }}
        >
          {/* Badge at top of stack */}
          <div
            style={{
              position: 'absolute',
              top: '-16px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#BA4E18',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.82rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '6px 20px',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            🔥 THE COMPLETE SMOKEHOUSE EXPERIENCE STACK
          </div>

          <h2
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-woodcut), Impact, sans-serif',
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              marginBottom: '10px',
              marginTop: '10px',
            }}
          >
            Here's Everything You Get In Tonight's Feast:
          </h2>
          <p style={{ textAlign: 'center', color: '#66625C', fontSize: '1rem', marginBottom: '32px' }}>
            Handcrafted fresh by our pitmaster. No cheap fillers.
          </p>

          {/* The Stacked Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                background: '#FAF8F4',
                borderRadius: '8px',
                border: '1px solid #EAE6D9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>🍖</span>
                <div>
                  <strong>8-Hour Hardwood Slow-Smoked Lamb Shank</strong>
                  <div style={{ fontSize: '0.85rem', color: '#777169' }}>Full bone-in shank, fall-apart tender with rich gelatinous bark</div>
                </div>
              </div>
              <div style={{ fontWeight: 700, color: '#BA4E18', fontSize: '1.1rem' }}>$38.00 Value</div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                background: '#FAF8F4',
                borderRadius: '8px',
                border: '1px solid #EAE6D9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>🍚</span>
                <div>
                  <strong>Heaping Bed of 24-Hr Spiced Saffron Basmati Rice</strong>
                  <div style={{ fontSize: '0.85rem', color: '#777169' }}>Steeped in clarified ghee, cardamom, cinnamon, and pan drippings</div>
                </div>
              </div>
              <div style={{ fontWeight: 700, color: '#BA4E18', fontSize: '1.1rem' }}>$14.00 Value</div>
            </div>

            {/* GARLIC SAUCE PLACEHOLDER ITEM */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                background: '#FFF8F2',
                borderRadius: '8px',
                border: '1px dashed #D9652B',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>🧄</span>
                <div>
                  <strong>{FUNNEL_PLACEHOLDERS.GARLIC_SAUCE}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#D9652B' }}>
                    Fresh whipped garlic condiment & aromatic lamb reduction jus
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: 700, color: '#BA4E18', fontSize: '1.1rem' }}>$8.00 Value</div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                background: '#FAF8F4',
                borderRadius: '8px',
                border: '1px solid #EAE6D9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>🧅</span>
                <div>
                  <strong>Sumac Red Onions, Blistered Chili & Fresh Herbs</strong>
                  <div style={{ fontSize: '0.85rem', color: '#777169' }}>Bright citrus crunch that cuts through the rich, buttery smoke</div>
                </div>
              </div>
              <div style={{ fontWeight: 700, color: '#BA4E18', fontSize: '1.1rem' }}>$5.00 Value</div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                background: '#FAF8F4',
                borderRadius: '8px',
                border: '1px solid #EAE6D9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>📦</span>
                <div>
                  <strong>Heavy-Duty Insulated Thermal Heat-Lock Packaging</strong>
                  <div style={{ fontSize: '0.85rem', color: '#777169' }}>Keeps your shank and rice sizzling hot on delivery</div>
                </div>
              </div>
              <div style={{ fontWeight: 700, color: '#BA4E18', fontSize: '1.1rem' }}>$5.00 Value</div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                background: '#FAF8F4',
                borderRadius: '8px',
                border: '1px solid #EAE6D9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>📜</span>
                <div>
                  <strong>Pitmaster Plating & Reheating Secret Card</strong>
                  <div style={{ fontSize: '0.85rem', color: '#777169' }}>Simple 2-minute trick to restore fresh-out-of-the-smoker bark</div>
                </div>
              </div>
              <div style={{ fontWeight: 700, color: '#BA4E18', fontSize: '1.1rem' }}>$3.00 Value</div>
            </div>
          </div>

          {/* Total Value vs Price Breakdown */}
          <div
            style={{
              borderTop: '2px solid #E2DED5',
              paddingTop: '24px',
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            <div style={{ fontSize: '1.2rem', color: '#66625C', textDecoration: 'line-through', marginBottom: '6px' }}>
              Total Real-World Value: $73.00
            </div>
            
            {/* PRICE PLACEHOLDER BANNER */}
            <div style={{ display: 'inline-block', background: '#FFF3E8', border: '1px dashed #D9652B', padding: '6px 16px', borderRadius: '6px', marginBottom: '14px' }}>
              <span style={{ color: '#BA4E18', fontWeight: 800, fontSize: '0.9rem' }}>
                🏷️ {FUNNEL_PLACEHOLDERS.PRICE_LABEL}
              </span>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-woodcut), Impact, sans-serif',
                fontSize: 'clamp(2.8rem, 6vw, 4rem)',
                color: '#BA4E18',
                lineHeight: 1,
                letterSpacing: '0.02em',
              }}
            >
              TODAY ONLY: {FUNNEL_PLACEHOLDERS.PRICE}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#2E7D32', fontWeight: 700, marginTop: '8px' }}>
              🎉 YOU SAVE OVER 58% OFF SEPARATE A LA CARTE VALUE
            </div>
          </div>

          {/* 7. IMPULSE-ORDER / UPSELL PLACEHOLDER MODULE */}
          <div
            style={{
              background: '#FFF8ED',
              border: '2px solid #C98A2C',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '30px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <input
                type="checkbox"
                id="upsell-check"
                checked={includeUpsell}
                onChange={(e) => setIncludeUpsell(e.target.checked)}
                style={{ width: '22px', height: '22px', accentColor: '#D9652B', marginTop: '3px', cursor: 'pointer' }}
              />
              <label htmlFor="upsell-check" style={{ cursor: 'pointer', flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1A1918' }}>
                  ⚡ ONE-TIME IMPULSE OFFER: {FUNNEL_PLACEHOLDERS.IMPULSE_ORDER}
                </div>
                <div style={{ fontSize: '0.88rem', color: '#555', marginTop: '4px', lineHeight: 1.5 }}>
                  Feed the whole family or save lunch for tomorrow. Check this box to add our signature Skillet Mac & Cheese or a 2nd Smoked Shank to your feast at special pit pricing!
                </div>
              </label>
            </div>
          </div>

          {/* Order Button */}
          <button
            onClick={handleOrderNow}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #E8743B 0%, #D9652B 50%, #BA4E18 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '22px 30px',
              fontSize: 'clamp(1.2rem, 2.8vw, 1.5rem)',
              fontFamily: 'var(--font-heading), sans-serif',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(217, 101, 43, 0.45)',
              transition: 'transform 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            🔥 YES! ADD MY LAMB SHANK FEAST TO CART NOW ({FUNNEL_PLACEHOLDERS.PRICE}) →
          </button>

          {/* 8. NIGHT-DELIVERY PLACEHOLDER LOGISTICS */}
          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              background: '#FAF8F4',
              borderRadius: '8px',
              border: '1px solid #EAE6D9',
              textAlign: 'center',
              fontSize: '0.88rem',
              color: '#4A4640',
            }}
          >
            🚚 <strong>DELIVERY NOTICE:</strong> {FUNNEL_PLACEHOLDERS.NIGHT_DELIVERY}
            <div style={{ fontSize: '0.8rem', color: '#777169', marginTop: '4px' }}>
              Dispatched directly in heat-retaining thermal packaging to ensure it reaches your doorstep steaming hot.
            </div>
          </div>
        </div>
      </section>

      {/* 9. THE RISK REVERSAL: 100% "CLEAN BONE PULL" GUARANTEE */}
      <section style={{ background: '#FFFFFF', padding: '60px 20px', borderTop: '1px solid #E2DED5', borderBottom: '1px solid #E2DED5' }}>
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            textAlign: 'center',
            background: '#FAF8F4',
            padding: '40px 32px',
            borderRadius: '16px',
            border: '2px solid #EAE6D9',
          }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🛡️</div>
          <h2
            style={{
              fontFamily: 'var(--font-woodcut), Impact, sans-serif',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              marginBottom: '14px',
            }}
          >
            The 100% "Clean Bone Pull" Pitmaster Guarantee
          </h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#4A4640', marginBottom: '20px' }}>
            We back our 8-hour hardwood smoking process with zero hesitation. When your Lamb Shank arrives, take hold of the bone and gently pull. 
            If it does not slide clean out with zero resistance, or if it isn't the single most tender, flavorful lamb you've ever eaten in Edmonton, 
            <strong> we will replace it or refund 100% of your meal</strong>. No hassle, no interrogation.
          </p>
          <div style={{ fontWeight: 800, color: '#BA4E18', letterSpacing: '0.05em' }}>
            YOU EITHER LOVE EVERY SINGLE BITE, OR YOU PAY NOTHING.
          </div>
        </div>
      </section>

      {/* 10. SOCIAL PROOF / EDMONTON TESTIMONIALS */}
      <section style={{ padding: '70px 20px', maxWidth: '880px', margin: '0 auto' }}>
        <h2
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-woodcut), Impact, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            marginBottom: '40px',
          }}
        >
          What Edmonton Smokehouse Fans Are Saying
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2DED5', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ color: '#C98A2C', fontSize: '1.2rem', marginBottom: '8px' }}>★★★★★</div>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: '#33302C', marginBottom: '14px', lineHeight: 1.6 }}>
              "I didn't believe the 'clean bone pull' until I tried it with just a soup spoon. The meat literally fell apart. The rice alone is worth ordering twice."
            </p>
            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>— Tariq K. (Edmonton, AB)</div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2DED5', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ color: '#C98A2C', fontSize: '1.2rem', marginBottom: '8px' }}>★★★★★</div>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: '#33302C', marginBottom: '14px', lineHeight: 1.6 }}>
              "Arrived sizzling hot. The smoke flavor is real hardwood, not artificial liquid smoke like other places. You can tell they put in 8 honest hours."
            </p>
            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>— Sarah M. (Downtown Edmonton)</div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2DED5', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ color: '#C98A2C', fontSize: '1.2rem', marginBottom: '8px' }}>★★★★★</div>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: '#33302C', marginBottom: '14px', lineHeight: 1.6 }}>
              "Portion size is huge. Easily fed two of us after a long shift. Will definitely be a regular order every weekend."
            </p>
            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>— Omar H. (South Edmonton)</div>
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION (Overcoming Objections) */}
      <section style={{ background: '#F0ECE1', padding: '70px 20px', borderTop: '1px solid #DFD9CB' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-woodcut), Impact, sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              marginBottom: '36px',
            }}
          >
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              {
                q: 'Is the lamb 100% Halal certified?',
                a: 'Yes, absolutely. All our meats are 100% hand-slaughtered Halal certified, seasoned with pure spices, and smoked over dedicated hardwood embers.',
              },
              {
                q: 'How large is the portion?',
                a: 'The portion includes a full, meaty bone-in lamb shank (over 1 lb before cooking) resting atop a generous, oversized bed of spiced basmati rice. It generously satisfies one hungry adult or can be shared between two.',
              },
              {
                q: 'How does it stay hot during delivery?',
                a: `We package every order in insulated, thermal-locking foil containers that seal in steam and heat during transport. Dispatched under ${FUNNEL_PLACEHOLDERS.NIGHT_DELIVERY}.`,
              },
              {
                q: 'What sauce is included with the feast?',
                a: `Every feast includes our ${FUNNEL_PLACEHOLDERS.GARLIC_SAUCE} along with savory smokehouse pan reduction jus and pickled sumac onions.`,
              },
              {
                q: 'Can I order for tonight or pre-order for tomorrow?',
                a: 'Because our pit batches take 8 full hours of smoking, daily quantities are limited to 45 shanks. We recommend ordering early before the daily batch sells out.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #E2DED5',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '18px 20px',
                    background: 'transparent',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#1A1918',
                  }}
                >
                  <span>{item.q}</span>
                  <span style={{ color: '#D9652B', fontSize: '1.3rem' }}>{activeFaq === idx ? '−' : '+'}</span>
                </button>
                {activeFaq === idx && (
                  <div style={{ padding: '0 20px 20px', fontSize: '0.95rem', color: '#555047', lineHeight: 1.6 }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FINAL URGENCY CALL-TO-ACTION */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'var(--font-woodcut), Impact, sans-serif',
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            lineHeight: 1.1,
            marginBottom: '16px',
          }}
        >
          Don't Wait Until Tonight's Pit Batch Is Gone
        </h2>
        <p style={{ fontSize: '1.15rem', color: '#66625C', marginBottom: '32px' }}>
          Once the last shank is pulled from the smoker, tonight's orders are closed until tomorrow morning.
        </p>

        <button
          onClick={handleOrderNow}
          style={{
            background: 'linear-gradient(135deg, #E8743B 0%, #D9652B 50%, #BA4E18 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '22px 36px',
            fontSize: 'clamp(1.2rem, 2.8vw, 1.5rem)',
            fontFamily: 'var(--font-heading), sans-serif',
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 12px 35px rgba(217, 101, 43, 0.45)',
          }}
        >
          🔥 CLAIM MY 8-HR LAMB SHANK FEAST ({FUNNEL_PLACEHOLDERS.PRICE}) →
        </button>
      </section>

      {/* 13. STICKY BOTTOM ORDER BAR (High-Converting Mobile/Desktop Anchor) */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(26, 25, 24, 0.96)',
          backdropFilter: 'blur(8px)',
          color: '#FFFFFF',
          padding: '12px 20px',
          zIndex: 100,
          borderTop: '2px solid #D9652B',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/images/dishes/lamb-shank.jpg"
            alt="Lamb Shank Thumbnail"
            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>8-Hour Lamb Shank on Spiced Rice</div>
            <div style={{ color: '#E8743B', fontWeight: 700, fontSize: '0.9rem' }}>
              {FUNNEL_PLACEHOLDERS.PRICE} <span style={{ fontSize: '0.75rem', color: '#AAA', textDecoration: 'line-through' }}>$73 Value</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleOrderNow}
            style={{
              background: '#D9652B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '12px 20px',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 14px rgba(217, 101, 43, 0.4)',
              whiteSpace: 'nowrap',
            }}
          >
            ORDER FEAST NOW →
          </button>
        </div>
      </div>

    </div>
  );
};
