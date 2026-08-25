import React, { useState } from 'react';

type CateringCalculatorProps = {
  onOpenInquiry: (summary: string) => void;
};

export const CateringCalculator: React.FC<CateringCalculatorProps> = ({ onOpenInquiry }) => {
  const [guestCount, setGuestCount] = useState(30);
  const [selectedMeats, setSelectedMeats] = useState<string[]>(['Goat Biryani', 'Beef Shami Kebab', 'Chicken Tikka']);
  const [selectedSides, setSelectedSides] = useState<string[]>(['Garlic Naan', 'Raita & Chutney']);
  const [serviceStyle, setServiceStyle] = useState<'buffet' | 'individual' | 'live-pit'>('buffet');

  const meatPrices: Record<string, number> = {
    'Goat Biryani': 7.50,
    'Beef Shami Kebab': 3.50,
    'Pitmaster Beef Ribs': 14.00,
    'Chicken Tikka': 6.00,
    'Smoked Malai Boti': 7.00,
  };

  const sidePrices: Record<string, number> = {
    'Garlic Naan': 2.00,
    'Dal Makhani': 3.00,
    'Mango Lassi': 3.50,
    'Raita & Chutney': 1.50,
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
    <section id="catering" style={{ padding: '80px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <div className="badge badge-flame" style={{ marginBottom: 12 }}>
            <span>🍖 CUSTOM EVENT CATERING</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontFamily: 'var(--font-display)', marginBottom: 12 }}>
            Pitmaster BBQ Catering <span className="gradient-text-flame">Estimator</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Planning a wedding, corporate party, or family event? Calculate your instant price estimate and get live pitmasters or catered trays delivered hot.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 36, alignItems: 'start' }}>
          {/* Controls Box */}
          <div className="glass-panel" style={{ padding: '32px', background: 'var(--bg-card)' }}>
            {/* Guest Count Slider */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-light)' }}>Number of Guests</label>
                <span className="badge badge-gold" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
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
                style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4 }}>
                <span>10 Guests</span>
                <span>150 Guests</span>
                <span>300+ Guests</span>
              </div>
            </div>

            {/* Meat Selections */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-light)', display: 'block', marginBottom: 12 }}>
                Select BBQ & Meats
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
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: checked ? 'rgba(211, 72, 38, 0.18)' : 'var(--bg-surface)',
                        border: checked ? '1px solid var(--flame-red)' : '1px solid var(--border-subtle)',
                        color: checked ? '#FFBBAE' : 'var(--text-main)',
                        fontSize: '0.85rem',
                        fontWeight: checked ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>{meat}</span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>+${price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sides Selections */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-light)', display: 'block', marginBottom: 12 }}>
                Select Naan & Sides
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
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: checked ? 'rgba(212, 163, 56, 0.18)' : 'var(--bg-surface)',
                        border: checked ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                        color: checked ? 'var(--gold-light)' : 'var(--text-main)',
                        fontSize: '0.85rem',
                        fontWeight: checked ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>{side}</span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>+${price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Service Style */}
            <div>
              <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-light)', display: 'block', marginBottom: 12 }}>
                Service & Setup Style
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setServiceStyle('buffet')}
                  className="btn btn-sm"
                  style={{
                    flex: 1,
                    background: serviceStyle === 'buffet' ? 'var(--gold-primary)' : 'var(--bg-surface)',
                    color: serviceStyle === 'buffet' ? '#0E0D0C' : 'var(--text-main)',
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
                    background: serviceStyle === 'individual' ? 'var(--gold-primary)' : 'var(--bg-surface)',
                    color: serviceStyle === 'individual' ? '#0E0D0C' : 'var(--text-main)',
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
                    background: serviceStyle === 'live-pit' ? 'var(--gold-primary)' : 'var(--bg-surface)',
                    color: serviceStyle === 'live-pit' ? '#0E0D0C' : 'var(--text-main)',
                  }}
                >
                  Live Charcoal Pitmasters (+ $5/p)
                </button>
              </div>
            </div>
          </div>

          {/* Estimate Display Box */}
          <div
            className="glass-panel"
            style={{
              padding: '32px',
              background: 'linear-gradient(135deg, rgba(31, 29, 27, 0.95) 0%, rgba(23, 22, 20, 0.98) 100%)',
              border: '1px solid var(--border-gold)',
              boxShadow: 'var(--shadow-gold)',
              position: 'sticky',
              top: '100px',
            }}
          >
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 20, marginBottom: 20 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Estimated Catering Total
              </div>
              <div style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold-primary)', margin: '4px 0' }}>
                ${totalPrice.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Roughly <span style={{ color: 'var(--gold-light)', fontWeight: 700 }}>${perPersonPrice.toFixed(2)}</span> per person for {guestCount} guests
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28, fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Selected Meats ({selectedMeats.length}):</span>
                <span style={{ color: 'var(--text-main)' }}>{selectedMeats.join(', ') || 'None'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Selected Sides ({selectedSides.length}):</span>
                <span style={{ color: 'var(--text-main)' }}>{selectedSides.join(', ') || 'None'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Setup Style:</span>
                <span style={{ color: 'var(--gold-light)', textTransform: 'capitalize' }}>{serviceStyle.replace('-', ' ')}</span>
              </div>
            </div>

            <button
              onClick={handleInquirySubmit}
              className="btn btn-flame"
              style={{ width: '100%', padding: '14px', fontSize: '1.05rem', justifyContent: 'center' }}
            >
              <span>📩 Submit Catering Inquiry</span>
            </button>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: 12 }}>
              No immediate payment required — our pitmaster team will contact you to finalize menu & logistics.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
