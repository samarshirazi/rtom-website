import React from 'react';

export const StorySection: React.FC = () => {
  const reviews = [
    {
      name: 'Shirazi S.',
      role: 'Regular BBQ Customer',
      quote: 'The Goat Biryani and Beef Shami Kebabs are hands down the best in town. Real smoked charcoal flavor that you can smell as soon as the bag opens!',
      rating: 5,
      date: '2 days ago',
    },
    {
      name: 'Tariq M.',
      role: 'Catering Client (120 Guests)',
      quote: 'We booked RTOM BBQ for our Eid family gathering. The smoked beef ribs were tender enough to cut with a spoon. Pitmasters showed up on time and set up everything hot!',
      rating: 5,
      date: '1 week ago',
    },
    {
      name: 'Amina K.',
      role: 'Food Enthusiast',
      quote: 'Finally authentic halal smokehouse BBQ with real wood smoke. The Garlic Butter Naan with slow-cooked Dal Makhani is pure comfort food.',
      rating: 5,
      date: '3 weeks ago',
    },
  ];

  return (
    <>
      {/* Pitmaster Story */}
      <section id="story" style={{ padding: '80px 0', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>
            <div>
              <div className="badge badge-gold" style={{ marginBottom: 16 }}>
                <span>🪵 THE PITMASTER WAY</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontFamily: 'var(--font-display)', marginBottom: 20, lineHeight: 1.2 }}>
                Overnight Wood Smoke, <span className="gradient-text-gold">Time-Honored Recipes</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: 16, lineHeight: 1.7 }}>
                At <strong>RTOM BBQ</strong>, we believe real barbecue takes time, patience, and authentic fire. Our pitmasters start before dawn, stoking hickory wood and charcoal fires to smoke hand-cut 100% Halal meats for up to 12 hours.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: 28, lineHeight: 1.7 }}>
                Infused with our signature aromatic spice rubs, every dish — from juicy charcoal chicken tikka to fragrant goat biryani — carries that unmistakable deep smoke ring and rich homestyle taste.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ borderLeft: '3px solid var(--gold-primary)', paddingLeft: 14 }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-light)' }}>100% Halal</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Certified premium meats only</div>
                </div>
                <div style={{ borderLeft: '3px solid var(--flame-red)', paddingLeft: 14 }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFA590' }}>Real Wood Smoke</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>No artificial liquid smoke</div>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-gold)',
                  border: '1px solid var(--border-gold)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                  alt="Pitmaster Smoked Ribs"
                  style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" style={{ padding: '80px 0', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
            <div className="badge badge-gold" style={{ marginBottom: 12 }}>
              <span>⭐ CUSTOMER TESTIMONIALS</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontFamily: 'var(--font-display)' }}>
              Loved by <span className="gradient-text-gold">Smokehouse BBQ Lovers</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {reviews.map((rev, i) => (
              <div
                key={i}
                className="glass-panel"
                style={{
                  padding: '28px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ color: 'var(--gold-primary)', fontSize: '1.1rem', marginBottom: 12 }}>
                    {'★'.repeat(rev.rating)}
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: 20, lineHeight: 1.6 }}>
                    "{rev.quote}"
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-light)' }}>{rev.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{rev.role}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
