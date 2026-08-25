import React from 'react';

export const StorySection: React.FC = () => {
  const reviews = [
    {
      name: 'Shirazi S.',
      role: 'Regular Smokehouse Customer',
      quote: 'The Goat Biryani and Beef Shami Kebabs are hands down the best in town. Real smoked charcoal aroma that hits you as soon as you open the container!',
      rating: 5,
      date: '2 days ago',
    },
    {
      name: 'Tariq M.',
      role: 'Catering Client (120 Guests)',
      quote: 'We booked RTOM BBQ for our Eid family gathering. The smoked beef ribs were tender enough to pull apart with a spoon. The team delivered everything hot and on time!',
      rating: 5,
      date: '1 week ago',
    },
    {
      name: 'Amina K.',
      role: 'Calgary Foodie',
      quote: 'Finally authentic halal smokehouse BBQ with real wood smoke. The Garlic Butter Naan with slow-simmered Dal Makhani is pure comfort food.',
      rating: 5,
      date: '3 weeks ago',
    },
  ];

  return (
    <>
      {/* 1. Franklin BBQ Iconic Full-Width Seafoam Turquoise Band */}
      <section
        id="story"
        style={{
          background: 'var(--bg-seafoam)',
          padding: '90px 0',
          color: '#FFFFFF',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 54,
              alignItems: 'center',
            }}
          >
            {/* Left: Rounded Smokehouse Photo Card */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: '0 18px 40px rgba(0, 0, 0, 0.22)',
                  border: '4px solid rgba(255, 255, 255, 0.35)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                  alt="Pitmaster Smoked Meats"
                  style={{
                    width: '100%',
                    height: '460px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            {/* Right: Woodcut Headline & Editorial Serif Story */}
            <div>
              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 18,
                }}
              >
                🪵 THE PITMASTER STORY
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-woodcut)',
                  fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
                  lineHeight: 1.12,
                  color: '#FFFFFF',
                  marginBottom: 22,
                  letterSpacing: '0.04em',
                }}
              >
                AT RTOM BBQ, WE BELIEVE GREAT BARBECUE STARTS LONG BEFORE IT HITS THE SMOKER — IT STARTS WITH THE INGREDIENTS.
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: '#F4F1E8',
                  marginBottom: 20,
                }}
              >
                That's why we source only naturally raised, premium certified 100% Halal meats with exceptional tenderness and marbling. Our pitmasters spend overnight tending active hickory wood and charcoal pits to produce that deep smoke ring and authentic homestyle flavor.
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                  color: 'rgba(244, 241, 232, 0.9)',
                  marginBottom: 32,
                }}
              >
                No artificial liquid smoke or shortcuts. Just honest wood smoke, handcrafted family spice rubs, and the patience required to serve the finest barbecue in the region.
              </p>

              {/* Badges on Seafoam Band */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.18)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase' }}>
                    100% Halal Certified
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Strictly hand-slaughtered premium meats</div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.18)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase' }}>
                    Real Hickory Wood Pit
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Slow-cooked 12 hours for peak tenderness</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Customer Reviews Section on Cream Paper */}
      <section
        id="reviews"
        style={{
          padding: '80px 0',
          background: 'var(--bg-paper)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-woodcut)',
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                color: 'var(--text-dark)',
                marginBottom: 8,
              }}
            >
              UPCOMING PRAISE & REVIEWS
            </h2>
            <div className="script-accent" style={{ fontSize: '1.3rem' }}>
              What our smokehouse regulars & event guests have to say
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {reviews.map((rev, i) => (
              <div
                key={i}
                className="paper-card"
                style={{
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#FFFFFF',
                }}
              >
                <div>
                  <div style={{ color: 'var(--color-rust)', fontSize: '1.2rem', marginBottom: 14, letterSpacing: '2px' }}>
                    {'★'.repeat(rev.rating)}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.02rem',
                      color: 'var(--text-charcoal)',
                      fontStyle: 'italic',
                      lineHeight: 1.7,
                      marginBottom: 24,
                    }}
                  >
                    “{rev.quote}”
                  </p>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase' }}>
                      {rev.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {rev.role}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    {rev.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
