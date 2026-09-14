import React, { useState } from 'react';

type CateringCalculatorProps = {
  onOpenInquiry: (summary: string) => void;
};

export const CateringCalculator: React.FC<CateringCalculatorProps> = ({ onOpenInquiry }) => {
  const [guestCount, setGuestCount] = useState(30);
  const [selectedMeats, setSelectedMeats] = useState<string[]>([
    'Smoked Lamb Shank',
    'Charcoal Whole Leg Chicken',
  ]);
  const [selectedSides, setSelectedSides] = useState<string[]>([
    'Fragrant Saffron Basmati Rice',
    'House-Whipped Garlic Toum',
  ]);
  const [serviceStyle, setServiceStyle] = useState<'buffet' | 'individual' | 'live-pit'>('buffet');

  const meatPrices: Record<string, number> = {
    'Smoked Lamb Shank': 14.50,
    'Charcoal Whole Leg Chicken': 8.50,
    '14-Hour Hickory Brisket': 13.50,
    'Smoked Beef Short Ribs': 14.00,
    'Slow-Smoked Beef Shank': 13.50,
    'Pitmaster Leg of Lamb': 16.00,
  };

  const sidePrices: Record<string, number> = {
    'Fragrant Saffron Basmati Rice': 3.50,
    'Skillet 3-Cheese Mac & Cheese': 4.50,
    'House-Whipped Garlic Toum': 2.00,
    'Smoked Rosemary Pan Jus': 1.50,
    'Sumac Pickled Onions & Chilis': 1.50,
  };

  const serviceStyleAddon: Record<string, number> = {
    'buffet': 0,
    'individual': 2.00,
    'live-pit': 5.00,
  };

  const calculatePerPerson = () => {
    let price = 0;
    for (const m of selectedMeats) price += meatPrices[m] || 0;
    for (const s of selectedSides) price += sidePrices[s] || 0;
    price += serviceStyleAddon[serviceStyle] || 0;
    return price;
  };

  const perPersonPrice = calculatePerPerson();
  const totalPrice = perPersonPrice * guestCount;

  const toggleMeat = (meat: string) => {
    setSelectedMeats((prev) =>
      prev.includes(meat) ? prev.filter((m) => m !== meat) : [...prev, meat]
    );
  };

  const toggleSide = (side: string) => {
    setSelectedSides((prev) =>
      prev.includes(side) ? prev.filter((s) => s !== side) : [...prev, side]
    );
  };

  const handleInquirySubmit = () => {
    const summary = `Hi RTOM BBQ team! I'd like a catering quote for:\n\n👥 Guests: ${guestCount}\n🥩 Meats: ${selectedMeats.join(', ') || 'None'}\n🫓 Sides: ${selectedSides.join(', ') || 'None'}\n🔥 Service Style: ${serviceStyle.toUpperCase()}\n💰 Estimated Price: $${totalPrice.toFixed(2)} ($${perPersonPrice.toFixed(2)}/person)`;
    onOpenInquiry(summary);
  };

  return (
    <section
      id="catering"
      style={{
        padding: '90px 0',
        background: 'var(--bg-paper)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
          <div
            style={{
              display: 'inline-block',
              background: 'var(--color-rust)',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            🍖 PRIVATE EVENTS & CATERING
          </div>
          <h2
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
              fontFamily: 'var(--font-woodcut)',
              color: 'var(--text-dark)',
              marginBottom: 8,
              letterSpacing: '0.04em',
            }}
          >
            PITMASTER BBQ <span style={{ color: 'var(--color-rust)' }}>CATERING ESTIMATOR</span>
          </h2>
          <p className="script-accent" style={{ fontSize: '1.35rem', color: 'var(--text-muted)' }}>
            Hot tray delivery or live charcoal pitmasters for 10 to 300+ guests
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 36,
            alignItems: 'start',
          }}
        >
          {/* Controls Box */}
          <div className="paper-card" style={{ padding: '36px', background: '#FFFFFF' }}>
            {/* Guest Count Slider */}
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <label
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Number of Guests
                </label>
                <span
                  style={{
                    background: 'var(--color-rust)',
                    color: '#FFFFFF',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                  }}
                >
                  👥 {guestCount} Guests
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-rust)', cursor: 'pointer' }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  marginTop: 6,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span>10 Guests</span>
                <span>150 Guests</span>
                <span>300+ Guests</span>
              </div>
            </div>

            {/* Meat Selections */}
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'block',
                  marginBottom: 12,
                }}
              >
                Select BBQ Meats
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {Object.entries(meatPrices).map(([meat, price]) => {
                  const checked = selectedMeats.includes(meat);
                  return (
                    <button
                      key={meat}
                      type="button"
                      onClick={() => toggleMeat(meat)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: checked ? 'var(--color-rust)' : 'var(--bg-paper)',
                        border: checked ? '1px solid var(--color-rust-dark)' : '1px solid var(--border-subtle)',
                        color: checked ? '#FFFFFF' : 'var(--text-dark)',
                        fontSize: '0.88rem',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: checked ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'var(--transition)',
                      }}
                    >
                      <span>{meat}</span>
                      <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>+${price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sides Selections */}
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'block',
                  marginBottom: 12,
                }}
              >
                Select Smokehouse Sides & Accompaniments
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {Object.entries(sidePrices).map(([side, price]) => {
                  const checked = selectedSides.includes(side);
                  return (
                    <button
                      key={side}
                      type="button"
                      onClick={() => toggleSide(side)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: checked ? 'var(--text-dark)' : 'var(--bg-paper)',
                        border: checked ? '1px solid var(--text-dark)' : '1px solid var(--border-subtle)',
                        color: checked ? '#FFFFFF' : 'var(--text-dark)',
                        fontSize: '0.88rem',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: checked ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'var(--transition)',
                      }}
                    >
                      <span>{side}</span>
                      <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>+${price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Service Style */}
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'block',
                  marginBottom: 12,
                }}
              >
                Service & Setup Style
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setServiceStyle('buffet')}
                  className="btn btn-sm"
                  style={{
                    flex: 1,
                    background: serviceStyle === 'buffet' ? 'var(--color-rust)' : 'var(--bg-paper)',
                    color: serviceStyle === 'buffet' ? '#FFFFFF' : 'var(--text-dark)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  Warm Buffet Trays
                </button>
                <button
                  type="button"
                  onClick={() => setServiceStyle('individual')}
                  className="btn btn-sm"
                  style={{
                    flex: 1,
                    background: serviceStyle === 'individual' ? 'var(--color-rust)' : 'var(--bg-paper)',
                    color: serviceStyle === 'individual' ? '#FFFFFF' : 'var(--text-dark)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  Individual Meal Boxes
                </button>
                <button
                  type="button"
                  onClick={() => setServiceStyle('live-pit')}
                  className="btn btn-sm"
                  style={{
                    flex: 1,
                    background: serviceStyle === 'live-pit' ? 'var(--color-rust)' : 'var(--bg-paper)',
                    color: serviceStyle === 'live-pit' ? '#FFFFFF' : 'var(--text-dark)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  Live Charcoal Pitmasters (+ $5/p)
                </button>
              </div>
            </div>
          </div>

          {/* Estimate Display Box */}
          <div
            className="paper-card"
            style={{
              padding: '36px',
              background: '#FFFFFF',
              border: '2px solid var(--color-rust)',
              position: 'sticky',
              top: '100px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 20, marginBottom: 20 }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Estimated Catering Total
              </div>
              <div
                style={{
                  fontSize: '3.6rem',
                  fontFamily: 'var(--font-woodcut)',
                  color: 'var(--color-rust)',
                  lineHeight: 1,
                  margin: '8px 0',
                }}
              >
                ${totalPrice.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-charcoal)', fontFamily: 'var(--font-body)' }}>
                Approximately <strong>${perPersonPrice.toFixed(2)}</strong> per person for {guestCount} guests
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                marginBottom: 30,
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: 'var(--text-muted)' }}>
                <span style={{ whiteSpace: 'nowrap' }}>Selected Meats ({selectedMeats.length}):</span>
                <span style={{ color: 'var(--text-dark)', fontWeight: 600, textAlign: 'right' }}>{selectedMeats.join(', ') || 'None'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: 'var(--text-muted)' }}>
                <span style={{ whiteSpace: 'nowrap' }}>Selected Sides ({selectedSides.length}):</span>
                <span style={{ color: 'var(--text-dark)', fontWeight: 600, textAlign: 'right' }}>{selectedSides.join(', ') || 'None'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Setup Style:</span>
                <span style={{ color: 'var(--color-rust)', fontWeight: 700, textTransform: 'capitalize' }}>
                  {serviceStyle.replace('-', ' ')}
                </span>
              </div>
            </div>

            <button
              onClick={handleInquirySubmit}
              className="btn btn-rust"
              style={{ width: '100%', padding: '16px', fontSize: '1.05rem', justifyContent: 'center' }}
            >
              <span>📩 Submit Catering Inquiry</span>
            </button>
            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                marginTop: 14,
                fontFamily: 'var(--font-body)',
              }}
            >
              No immediate charge — our pitmaster team will contact you to confirm timing & menu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
