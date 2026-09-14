import React, { useState } from 'react';
import type { Dish } from '../types';
import { DISHES } from '../data/dishes';

// Authentic Feast Constants
export const FEAST_DETAILS = {
  PRICE: '$29.99',
  PRICE_NUM: 29.99,
  PORTION: 'Generous 18–20 oz Bone-In Shank with Rice & Sides (Serves 1–2)',
  GARLIC_SAUCE: 'House-Whipped Garlic Toum & Smoked Rosemary Pan Jus',
  DELIVERY_NOTICE: 'Delivered Fresh & Steaming Hot Across Edmonton Metro',
};

type LambShankFunnelPageProps = {
  onBackToMenu: () => void;
  onAddToCart: (
    dish: Dish,
    quantity: number,
    selectedOptions: { groupId: string; groupName: string; optionId: string; optionName: string; priceDelta: number }[],
    unitPrice: number
  ) => void;
  cartItemCount?: number;
  onOpenCart?: () => void;
};

export const LambShankFunnelPage: React.FC<LambShankFunnelPageProps> = ({
  onBackToMenu,
  onAddToCart,
  cartItemCount = 0,
  onOpenCart,
}) => {
  // Find lamb shank dish from dataset
  const lambShankDish = DISHES.find((d) => d.id === 'rtom-lamb-shank') || DISHES[0];

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedAddon, setSelectedAddon] = useState<'none' | 'extra-shank' | 'mac-cheese'>('none');

  // Calculate dynamic price based on feast upgrade
  const calculateTotal = () => {
    if (selectedAddon === 'extra-shank') return 29.99 + 19.99;
    if (selectedAddon === 'mac-cheese') return 29.99 + 9.99;
    return 29.99;
  };

  const currentPriceFormatted = `$${calculateTotal().toFixed(2)}`;

  const handleOrderNow = () => {
    const options: { groupId: string; groupName: string; optionId: string; optionName: string; priceDelta: number }[] = [];
    let unitPrice = lambShankDish.price;

    if (selectedAddon === 'extra-shank') {
      options.push({
        groupId: 'feast-addon',
        groupName: 'Feast Upgrade',
        optionId: 'extra-shank',
        optionName: 'Extra 5-Hour Smoked Shank',
        priceDelta: 19.99,
      });
      unitPrice += 19.99;
    } else if (selectedAddon === 'mac-cheese') {
      options.push({
        groupId: 'feast-addon',
        groupName: 'Feast Upgrade',
        optionId: 'mac-side',
        optionName: 'Skillet Smoked Mac & Cheese',
        priceDelta: 9.99,
      });
      unitPrice += 9.99;
    }

    onAddToCart(lambShankDish, 1, options, unitPrice);
  };

  const scrollToStack = () => {
    const el = document.getElementById('feast-offer-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#FAF8F4', color: '#1A1918', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {/* 1. SMOKEHOUSE STICKY HEADER */}
      <div
        style={{
          background: '#BA4E18',
          color: '#FFFFFF',
          padding: '10px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 110,
          boxShadow: '0 3px 12px rgba(0,0,0,0.22)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left: Brand Identity / Back button */}
        <div
          onClick={onBackToMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          title="Back to RTOM BBQ Full Menu"
        >
          <img
            src="/rtom-icon-512.png"
            alt="RTOM Barbecue"
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.8)' }}
          />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontFamily: 'var(--font-woodcut), Impact, sans-serif', fontSize: '1.05rem', letterSpacing: '0.05em' }}>
              RTOM BARBECUE
            </div>
            <div style={{ fontSize: '0.68rem', opacity: 0.9, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              ← Return to Full Menu
            </div>
          </div>
        </div>

        {/* Center: Genuine Smokehouse Batch Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ animation: 'pulse 1.5s infinite', fontSize: '1rem' }}>🔥</span>
          <span style={{ fontSize: '0.84rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            DAILY PITMASTER SMOKE: 5-HOUR SLOW-CRAFTED BATCH
          </span>
          <span style={{ background: 'rgba(0,0,0,0.25)', padding: '3px 9px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: 700 }}>
            LIMITED QUANTITIES DAILY
          </span>
        </div>

        {/* Right: Quick Navigation & Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onBackToMenu}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.5)',
              color: '#FFFFFF',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>←</span> Full Menu
          </button>

          {onOpenCart && (
            <button
              onClick={onOpenCart}
              style={{
                background: '#1A1918',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}
            >
              <span>🛒</span>
              <span>Cart</span>
              {cartItemCount > 0 ? (
                <span
                  style={{
                    background: '#D9652B',
                    color: '#FFF',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.72rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                  }}
                >
                  {cartItemCount}
                </span>
              ) : null}
            </button>
          )}
        </div>
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
          The 5-Hour Slow-Smoked Lamb Shank That Pulls Off The Bone{' '}
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
          Resting on a mountain of fragrant aged basmati rice bloomed in saffron, pure ghee, and whole roasted spices. 
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
            🔥 5-HR HARDWOOD SMOKE • 100% HALAL
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
            {FEAST_DETAILS.PRICE} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>(Complete Feast)</span>
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
            How We Perfected The 5-Hour Clean-Bone Pull
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
            By hour five, the connective tissue completely liquefies into rich, savory gelatin. When you hold the bone, the tender meat gently slides right off with zero knife required.
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
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>5-Hour Hardwood Smoke & Braise</h3>
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

      {/* 6. THE GENUINE SMOKEHOUSE FEAST PLATTER */}
      <section id="feast-offer-section" style={{ padding: '80px 20px', maxWidth: '880px', margin: '0 auto' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '2px solid #D9652B',
            borderRadius: '16px',
            padding: 'clamp(24px, 5vw, 48px)',
            boxShadow: '0 16px 45px rgba(217, 101, 43, 0.12)',
            position: 'relative',
          }}
        >
          {/* Badge at top of card */}
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
              padding: '6px 22px',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            🔥 THE COMPLETE SMOKEHOUSE FEAST
          </div>

          <h2
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-woodcut), Impact, sans-serif',
              fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              marginBottom: '10px',
              marginTop: '10px',
            }}
          >
            What Comes In Tonight's Feast Platter:
          </h2>
          <p style={{ textAlign: 'center', color: '#66625C', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto 32px' }}>
            A generous, multi-course smoked banquet prepared fresh daily by our pitmaster. No shortcuts, no reheated leftovers.
          </p>

          {/* Genuine Inclusions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '16px 20px',
                background: '#FAF8F4',
                borderRadius: '10px',
                border: '1px solid #EAE6D9',
              }}
            >
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>🍖</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A1918', marginBottom: '4px' }}>
                  5-Hour Hardwood Slow-Smoked Lamb Shank (18–20 oz)
                </div>
                <div style={{ fontSize: '0.92rem', color: '#66625C', lineHeight: 1.5 }}>
                  Full bone-in shank, slow-smoked at 225°F over hickory wood until the connective tissue liquefies into savory gelatin and the meat glides off the bone.
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '16px 20px',
                background: '#FAF8F4',
                borderRadius: '10px',
                border: '1px solid #EAE6D9',
              }}
            >
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>🍚</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A1918', marginBottom: '4px' }}>
                  Mountain of Saffron & Clarified Ghee Spiced Basmati Rice
                </div>
                <div style={{ fontSize: '0.92rem', color: '#66625C', lineHeight: 1.5 }}>
                  Long-grain basmati toasted in pure ghee, bloomed with saffron, cardamom, and cinnamon, infused with the rich pan juices from the smoking pit.
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '16px 20px',
                background: '#FAF8F4',
                borderRadius: '10px',
                border: '1px solid #EAE6D9',
              }}
            >
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>🧄</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A1918', marginBottom: '4px' }}>
                  House-Whipped Garlic Toum & Smoked Lamb Pan Jus
                </div>
                <div style={{ fontSize: '0.92rem', color: '#66625C', lineHeight: 1.5 }}>
                  Traditional airy garlic condiment whipped fresh from scratch, paired with our savory pan-dripping reduction jus to spoon over the meat and rice.
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '16px 20px',
                background: '#FAF8F4',
                borderRadius: '10px',
                border: '1px solid #EAE6D9',
              }}
            >
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>🧅</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A1918', marginBottom: '4px' }}>
                  Sumac Pickled Red Onions & Blistered Green Chili
                </div>
                <div style={{ fontSize: '0.92rem', color: '#66625C', lineHeight: 1.5 }}>
                  A crisp, tangy citrus bite with a hint of warm smoke to refresh the palate between savory mouthfuls.
                </div>
              </div>
            </div>
          </div>

          {/* Honest Value Comparison */}
          <div
            style={{
              background: '#F7F5F0',
              border: '1px solid #E2DED5',
              borderRadius: '10px',
              padding: '18px 22px',
              marginBottom: '28px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.95rem', color: '#4A4640', lineHeight: 1.6 }}>
              💡 <strong>Edmonton Dining Comparison:</strong> A slow-braised lamb shank entrée at a downtown steakhouse typically runs <strong>$45–$55+</strong>. We deliver pitmaster-grade hardwood smoked craftsmanship directly to your home for just <strong>$29.99</strong>.
            </div>
          </div>

          {/* Pricing & Add-on Selection */}
          <div style={{ borderTop: '2px solid #EAE6D9', paddingTop: '28px', marginBottom: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#777169', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                COMPLETE SMOKEHOUSE BANQUET
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-woodcut), Impact, sans-serif',
                  fontSize: 'clamp(2.8rem, 6vw, 3.8rem)',
                  color: '#BA4E18',
                  lineHeight: 1.1,
                  letterSpacing: '0.02em',
                }}
              >
                {currentPriceFormatted}
              </div>
              <div style={{ fontSize: '0.92rem', color: '#66625C', marginTop: '6px' }}>
                Full Meal (Serves 1–2 generously) • 100% Halal Certified
              </div>
            </div>

            {/* Optional Feast Upgrade Cards */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1A1918', marginBottom: '10px' }}>
                Customize Your Feast (Optional Upgrades):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div
                  onClick={() => setSelectedAddon('none')}
                  style={{
                    border: selectedAddon === 'none' ? '2px solid #D9652B' : '1px solid #DCD8CF',
                    background: selectedAddon === 'none' ? '#FFF9F5' : '#FFFFFF',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.95rem' }}>Standard Feast</strong>
                    <span style={{ fontWeight: 800, color: '#BA4E18' }}>$29.99</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#66625C' }}>
                    1 Shank + Full Rice & Sides
                  </div>
                </div>

                <div
                  onClick={() => setSelectedAddon('extra-shank')}
                  style={{
                    border: selectedAddon === 'extra-shank' ? '2px solid #D9652B' : '1px solid #DCD8CF',
                    background: selectedAddon === 'extra-shank' ? '#FFF9F5' : '#FFFFFF',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.95rem' }}>Add 2nd Shank</strong>
                    <span style={{ fontWeight: 800, color: '#BA4E18' }}>+$19.99</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#66625C' }}>
                    Two 5-hr shanks (Best for 2 people)
                  </div>
                </div>

                <div
                  onClick={() => setSelectedAddon('mac-cheese')}
                  style={{
                    border: selectedAddon === 'mac-cheese' ? '2px solid #D9652B' : '1px solid #DCD8CF',
                    background: selectedAddon === 'mac-cheese' ? '#FFF9F5' : '#FFFFFF',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.95rem' }}>Add Smoked Mac</strong>
                    <span style={{ fontWeight: 800, color: '#BA4E18' }}>+$9.99</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#66625C' }}>
                    3-Cheese Skillet Mac & Cheese
                  </div>
                </div>
              </div>
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
              padding: '20px 30px',
              fontSize: 'clamp(1.15rem, 2.6vw, 1.4rem)',
              fontFamily: 'var(--font-heading), sans-serif',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(217, 101, 43, 0.35)',
              transition: 'transform 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            ORDER YOUR LAMB SHANK FEAST ({currentPriceFormatted}) →
          </button>

          {/* Genuine Delivery Logistics Note */}
          <div
            style={{
              marginTop: '20px',
              padding: '14px 18px',
              background: '#FAF8F4',
              borderRadius: '8px',
              border: '1px solid #EAE6D9',
              textAlign: 'center',
              fontSize: '0.88rem',
              color: '#4A4640',
            }}
          >
            🚚 <strong>Hot & Fresh Delivery:</strong> Freshly sealed in insulated thermal steam-lock packaging and dispatched hot to your door anywhere in the Edmonton metro area.
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
            We back our 5-hour hardwood smoking process with zero hesitation. When your Lamb Shank arrives, take hold of the bone and gently pull. 
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
              "Arrived sizzling hot. The smoke flavor is real hardwood, not artificial liquid smoke like other places. You can tell they put in 5 honest hours over real wood."
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
                a: 'Yes, absolutely. All our meats are 100% hand-slaughtered Halal certified, seasoned with pure whole spices, and smoked over dedicated hardwood embers.',
              },
              {
                q: 'How large is the portion?',
                a: 'The portion includes a full, meaty bone-in lamb shank (18–20 oz before slow-cooking) resting atop a generous mountain of spiced saffron basmati rice. It generously satisfies one very hungry adult or can easily be shared between two.',
              },
              {
                q: 'How does it stay hot during delivery?',
                a: 'We package every order in heavy-duty, thermal-locking foil containers that trap steam and heat during transport. Your meal arrives piping hot and ready to enjoy immediately.',
              },
              {
                q: 'What sauces are included with the feast?',
                a: 'Every feast includes our fresh House-Whipped Garlic Toum alongside savory smokehouse pan reduction jus and pickled sumac onions.',
              },
              {
                q: 'Can I order for tonight or pre-order for tomorrow?',
                a: 'Because our pit batches take 5 full hours of low-and-slow hardwood smoking, daily quantities are limited. We recommend ordering early in the evening before the daily pit batch runs out.',
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

      {/* 12. FINAL SMOKEHOUSE CALL-TO-ACTION */}
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
          Taste Edmonton's Most Tender Lamb Feast Tonight
        </h2>
        <p style={{ fontSize: '1.15rem', color: '#66625C', marginBottom: '32px' }}>
          Slow-smoked for 5 hours over authentic hardwood embers. Handcrafted and delivered fresh to your door.
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
          ORDER YOUR 5-HR LAMB SHANK FEAST ({currentPriceFormatted}) →
        </button>
      </section>

      {/* 13. STICKY BOTTOM ORDER BAR (Clean, Transparent & Responsive) */}
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
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>5-Hour Lamb Shank Feast Platter</div>
            <div style={{ color: '#E8743B', fontWeight: 700, fontSize: '0.9rem' }}>
              {currentPriceFormatted} <span style={{ fontSize: '0.8rem', color: '#B8B3A8', fontWeight: 500 }}>• Complete Meal Platter</span>
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
              padding: '12px 22px',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 14px rgba(217, 101, 43, 0.4)',
              whiteSpace: 'nowrap',
            }}
          >
            ORDER FEAST ({currentPriceFormatted}) →
          </button>
        </div>
      </div>

    </div>
  );
};
