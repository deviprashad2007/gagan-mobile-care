// Homepage section components.
const HB = window.GAGAN_DATA.BRANDS;
const fINR = window.GAGAN_DATA.formatINR;

// ----- NAV -----
const Nav = ({ onBook }) => {
  const [mobOpen, setMobOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  React.useEffect(() => {
    document.body.style.overflow = mobOpen ? 'hidden' : '';
  }, [mobOpen]);

  const links = [
    { id: 'how', label: 'How it works', n: '01' },
    { id: 'prices', label: 'Pricing', n: '02' },
    { id: 'post', label: 'Send by post', n: '03' },
    { id: 'stories', label: 'Stories', n: '04' },
    { id: 'faq', label: 'FAQ', n: '05' },
  ];

  return (
  <>
  <nav className="gmc-nav" style={{
    position: 'sticky', top: 0, zIndex: 40,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: scrolled ? '10px 16px' : '14px 16px',
    background: scrolled ? 'rgba(255,255,255,.92)' : 'rgba(255,255,255,.7)',
    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
    gap: 12,
    transition: 'all .25s ease',
  }}>
    <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, background: 'var(--ink)',
        display: 'grid', placeItems: 'center', flexShrink: 0, position: 'relative',
      }}>
        <div style={{ width: 14, height: 22, borderRadius: 3, border: '1.5px solid #fff', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 4, left: 1, right: 1, bottom: 4, background: 'var(--accent)', borderRadius: 1 }}/>
        </div>
        <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 999, background: 'var(--accent)', border: '1.5px solid #fff' }}/>
      </div>
      <div style={{ minWidth: 0, lineHeight: 1.1 }}>
        <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-.015em', whiteSpace: 'nowrap' }}>
          Gagan Mobile Care
        </div>
        <div className="hide-sm" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: '#22A06B', display: 'inline-block' }}/>
          Open · Lajpat Nagar
        </div>
      </div>
    </a>

    <div className="hide-sm gmc-nav-links" style={{
      display: 'flex', gap: 4, alignItems: 'center',
      background: 'rgba(245,245,245,.7)',
      border: '1px solid var(--line)',
      borderRadius: 999, padding: 4,
    }}>
      {links.map(l => (
        <a key={l.id} href={'#' + l.id}
           style={{
             padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500,
             color: 'var(--ink-2)', textDecoration: 'none',
             transition: 'all .15s',
           }}
           onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--ink)'; }}
           onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-2)'; }}>
          {l.label}
        </a>
      ))}
    </div>

    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <a href="tel:+919811200410" className="btn btn-ghost hide-md" style={{ padding: '8px 12px' }}>
        <Icon name="phone-call" size={14}/> <span style={{ fontWeight: 600 }}>98112 00410</span>
      </a>
      <button className="btn btn-dark hide-sm" onClick={() => onBook()} style={{ paddingLeft: 14 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)' }}/>
        Book repair
        <Icon name="arrow-right" size={14} color="#fff"/>
      </button>
      <button className="show-sm gmc-burger" onClick={() => setMobOpen(o => !o)}
        style={{ display: 'none', width: 42, height: 42, borderRadius: 12, border: '1px solid var(--line)', background: '#fff', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        aria-label="Menu">
        <Icon name={mobOpen ? 'close' : 'menu'} size={18}/>
      </button>
    </div>
  </nav>

  {/* Mobile fullscreen menu */}
  {mobOpen && (
    <div className="gmc-mobile-menu fade-in" style={{
      position: 'fixed', inset: 0, top: 0, zIndex: 39,
      background: 'var(--ink)', color: '#fff',
      display: 'flex', flexDirection: 'column',
      padding: '76px 24px 24px',
      overflowY: 'auto',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {links.map((l, i) => (
          <a key={l.id} href={'#' + l.id} onClick={() => setMobOpen(false)}
             style={{
               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
               padding: '18px 0', borderTop: i ? '1px solid rgba(255,255,255,.1)' : 0,
               color: '#fff', textDecoration: 'none',
             }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span className="serif" style={{ fontSize: 36, letterSpacing: '-.02em' }}>{l.label}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontFamily: 'JetBrains Mono, monospace' }}>({l.n})</span>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid rgba(255,255,255,.2)', display: 'grid', placeItems: 'center' }}>
              <Icon name="arrow-up-right" size={14} color="#fff"/>
            </div>
          </a>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 32 }}>
        <button className="btn" onClick={() => { setMobOpen(false); onBook(); }}
          style={{ background: 'var(--accent)', color: '#fff', width: '100%', justifyContent: 'center', padding: '16px', fontSize: 15 }}>
          Book a repair · free quote <Icon name="arrow-right" size={16} color="#fff"/>
        </button>
        <a href="tel:+919811200410" className="btn" style={{ marginTop: 10, width: '100%', justifyContent: 'center', padding: '14px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }}>
          <Icon name="phone-call" size={14} color="#fff"/> Call +91 98112 00410
        </a>
        <div style={{ marginTop: 24, fontSize: 11, color: 'rgba(255,255,255,.4)', letterSpacing: '.14em', textTransform: 'uppercase' }}>
          Shop 14 · Lajpat Nagar Central Market · 110024
        </div>
      </div>
    </div>
  )}
  </>
  );
};

// ----- HERO -----
const Hero = ({ onBook, onPickBrand }) => {
  return (
    <section className="hero-wrap" style={{ position: 'relative' }}>
      <div className="hero-card" style={{
        position: 'relative',
        background: '#fff',
        border: '1px solid var(--line)',
        overflow: 'hidden',
      }}>
        {/* Map background */}
        <div className="map-bg" style={{ position: 'absolute', inset: 0, opacity: .9 }}>
          <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
            {/* meandering roads */}
            <path d="M0 240 Q200 180 380 220 T800 200 T1280 280" stroke="#fff" strokeWidth="14" fill="none"/>
            <path d="M0 240 Q200 180 380 220 T800 200 T1280 280" stroke="#DAD5CC" strokeWidth="1" fill="none"/>
            <path d="M120 0 Q160 200 80 380 T220 720" stroke="#fff" strokeWidth="10" fill="none"/>
            <path d="M120 0 Q160 200 80 380 T220 720" stroke="#DAD5CC" strokeWidth="1" fill="none"/>
            <path d="M1180 0 Q1140 200 1220 380 T1080 720" stroke="#fff" strokeWidth="10" fill="none"/>
            <path d="M0 460 Q300 420 600 480 T1280 440" stroke="#fff" strokeWidth="8" fill="none"/>
            <path d="M0 580 Q200 600 400 580 T800 600 T1280 580" stroke="#fff" strokeWidth="6" fill="none"/>
          </svg>
          {/* dotted route */}
          <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
            <path d="M180 540 Q380 420 560 360 T960 220" stroke="rgba(242,92,31,.7)" strokeWidth="1.5" strokeDasharray="3 5" fill="none"/>
          </svg>
        </div>

        {/* Foreground content */}
        <div className="hero-grid" style={{ position: 'relative' }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignSelf: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
              padding: '6px 12px 6px 8px', background: '#fff', border: '1px solid var(--line)',
              borderRadius: 999, fontSize: 12, color: 'var(--ink-2)' }}>
              <span className="dot pulse"/> Open now · 1 slot left at 6:30 PM
            </div>
            <h1 className="serif hero-h1" style={{ fontSize: 68, lineHeight: 1, margin: 0, letterSpacing: '-.025em' }}>
              Cracked phone?<br/>
              <em>Walk in</em>, or just<br/>
              <em>send it</em> by post.
            </h1>
            <p style={{ fontSize: 17, color: 'var(--ink-2)', maxWidth: 480, margin: 0 }}>
              Free quote in 60 seconds. Genuine parts. 6-month warranty. We're a small Delhi shop that's quietly fixed <span style={{ color: 'var(--ink)', fontWeight: 600 }}>50,000+ phones</span> since 2014 — for everyone, anywhere in India.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-dark" onClick={() => onBook()} style={{ padding: '14px 18px' }}>
                Get free quote — 60s <Icon name="arrow-right" size={16} color="#fff"/>
              </button>
              <button className="btn btn-light" style={{ padding: '14px 18px' }}>
                <Icon name="play" size={12}/> See how post repair works
              </button>
            </div>

            {/* Brand quick-pick */}
            <div style={{ marginTop: 4 }}>
              <div className="micro" style={{ marginBottom: 10 }}>Or pick your brand</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {HB.slice(0, 8).map(b => (
                  <button key={b.id} onClick={() => onPickBrand(b)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 12px 8px 8px', background: '#fff',
                      border: '1px solid var(--line)', borderRadius: 999, cursor: 'pointer',
                      fontSize: 13, fontWeight: 500,
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--ink)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}
                  >
                    <BrandGlyph brand={b} size={22}/>{b.name}
                  </button>
                ))}
                <button onClick={() => onBook()} style={{
                  padding: '8px 14px', background: 'transparent',
                  border: '1px dashed var(--ink-4)', borderRadius: 999, cursor: 'pointer',
                  fontSize: 13, color: 'var(--ink-3)', fontWeight: 500,
                }}>+7 more</button>
              </div>
            </div>
          </div>

          {/* Right — floating cards (desktop only) */}
          <div className="hero-cards-col" style={{ position: 'relative', minHeight: 480 }}>
            {/* Phone product card */}
            <div className="card shadow-float" style={{
              position: 'absolute', top: 30, right: 0, width: 280, padding: 14,
              transform: 'rotate(-2deg)',
            }}>
              <div className="placeholder" style={{ height: 180, borderRadius: 10, marginBottom: 12 }}>
                Repair photo · phone on bench
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>iPhone 14 Pro Screen</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>Replaced in 90 mins · Today</div>
                </div>
                <div style={{ background: 'var(--accent)', color: '#fff', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>NEW</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                <div>
                  <div className="serif" style={{ fontSize: 22 }}>{fINR(8499)}</div>
                </div>
                <button className="btn btn-dark" style={{ padding: '8px 12px', fontSize: 12 }}>Book this</button>
              </div>
            </div>

            {/* "On the way" pin card */}
            <div className="card shadow-float" style={{
              position: 'absolute', top: 280, left: 8, width: 240,
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--ink)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name="check" size={14} color="#fff"/>
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.35 }}>
                <div style={{ fontWeight: 600 }}>Courier picked up</div>
                <div style={{ color: 'var(--ink-3)' }}>Aarav's Galaxy S23 · ETA Mon</div>
              </div>
            </div>

            {/* Technician chip */}
            <div className="card shadow-float" style={{
              position: 'absolute', bottom: 60, right: 24, padding: 14, width: 230,
            }}>
              <div className="micro" style={{ marginBottom: 8 }}>Your technician</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 999, background: 'linear-gradient(135deg, #d8d2c5, #b9b3a7)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 600 }}>RK</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Rakesh K.</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>9 yrs · 4,200 repairs</div>
                </div>
                <button style={{ width: 32, height: 32, border: '1px solid var(--line)', borderRadius: 999, background: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                  <Icon name="phone-call" size={14}/>
                </button>
              </div>
            </div>

            {/* Pin pulse on map */}
            <div style={{ position: 'absolute', top: 220, right: 130 }}>
              <div className="pulse" style={{ width: 16, height: 16, borderRadius: 999, background: 'var(--accent)', border: '3px solid #fff' }}/>
            </div>
            <div style={{ position: 'absolute', bottom: 200, left: 80 }}>
              <div className="pulse" style={{ width: 14, height: 14, borderRadius: 999, background: 'var(--ink)', border: '3px solid #fff' }}/>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="hero-stats" style={{
          position: 'relative', borderTop: '1px solid var(--line)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          background: '#fff',
        }}>
          {[
            ['50,000+', 'phones repaired'],
            ['4.8/5', '2,100 Google reviews'],
            ['6 months', 'warranty on parts'],
            ['90 mins', 'avg walk-in turnaround'],
          ].map(([n, l], i) => (
            <div key={i} style={{ padding: '24px 28px' }}>
              <div className="serif" style={{ fontSize: 38, lineHeight: 1, letterSpacing: '-.02em' }}>{n}</div>
              <div className="micro" style={{ marginTop: 6 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ----- HOW IT WORKS -----
const HowItWorks = () => {
  const walkin = [
    { t: 'Book a slot', d: 'Tell us the brand, model and issue. 60 seconds, no signup.' },
    { t: 'Walk in', d: 'Bring your phone to our Lajpat Nagar shop. Coffee\'s on us.' },
    { t: 'Pay & leave', d: 'Most repairs done in 90 minutes. 6-month warranty on parts.' },
  ];
  const post = [
    { t: 'We send a label', d: 'You\'ll get a printable Speed Post label and packing checklist.' },
    { t: 'Drop at any post office', d: 'Or hand to our partner courier. We track it for you.' },
    { t: 'Repaired & returned', d: 'Pay cash on delivery when you receive it back. 4–6 days door-to-door.' },
  ];

  const Col = ({ icon, badge, title, lead, steps, dark }) => (
    <div style={{
      padding: 28, borderRadius: 20,
      background: dark ? 'var(--ink)' : '#fff',
      color: dark ? '#fff' : 'var(--ink)',
      border: '1px solid ' + (dark ? 'var(--ink)' : 'var(--line)'),
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: dark ? 'rgba(255,255,255,.1)' : 'var(--bg)',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name={icon} size={20} color={dark ? '#fff' : 'var(--ink)'}/>
        </div>
        <div className="micro" style={{ color: dark ? 'rgba(255,255,255,.7)' : 'var(--ink-3)' }}>{badge}</div>
      </div>
      <h3 className="serif" style={{ fontSize: 32, lineHeight: 1.05, margin: '0 0 8px', letterSpacing: '-.02em' }}>{title}</h3>
      <p style={{ color: dark ? 'rgba(255,255,255,.7)' : 'var(--ink-3)', margin: '0 0 20px', maxWidth: 380 }}>{lead}</p>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: 'flex', gap: 16, padding: '16px 0',
            borderTop: i ? `1px solid ${dark ? 'rgba(255,255,255,.1)' : 'var(--line)'}` : 0,
          }}>
            <div className="serif" style={{ fontSize: 28, lineHeight: 1, opacity: .35, width: 32 }}>0{i + 1}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{s.t}</div>
              <div style={{ color: dark ? 'rgba(255,255,255,.65)' : 'var(--ink-3)', fontSize: 13 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="how" className="sec-pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div className="micro" style={{ marginBottom: 10 }}><span className="dot"/> &nbsp;Two ways, one promise</div>
          <h2 className="serif h-section" style={{ margin: 0, letterSpacing: '-.025em', maxWidth: 720 }}>
            Come to <em>us</em>, or your phone <em>comes to us</em>.
          </h2>
        </div>
        <div style={{ color: 'var(--ink-3)', maxWidth: 320, fontSize: 14 }}>
          Same parts, same warranty, same technicians. Pick whichever fits your day.
        </div>
      </div>

      <div className="two-col">
        <Col icon="store" badge="Walk-in repair · ⌀ 90 min" title="Drop by the shop." lead="Lajpat Nagar Central Market. We'll show you the phone, parts and bill — nothing's hidden." steps={walkin}/>
        <Col icon="package" badge="Send by post · 4–6 days" title="Mail it from anywhere." lead="No phone shop in your town? Speed Post your phone. We pay return courier when you collect." steps={post} dark/>
      </div>
    </section>
  );
};

// ----- TRUST BAR -----
const TrustBar = () => {
  const items = [
    { i: 'shield',  t: '6-month warranty', d: 'On all parts and labour' },
    { i: 'badge',   t: 'Genuine parts',    d: 'OEM-grade, never refurbished' },
    { i: 'spark',   t: 'Same-day fix',     d: 'Most repairs in 90 minutes' },
    { i: 'wallet',  t: 'No advance',       d: 'Pay only when satisfied' },
    { i: 'truck',   t: 'Pan-India post',   d: 'Free return courier' },
    { i: 'rupee',   t: 'Locked price',     d: 'Quote on call, never higher' },
  ];
  return (
    <section className="sec-pad">
      <div className="card six-col trust-bar" style={{ padding: 0, overflow: 'hidden' }}>
        {items.map((it, i) => (
          <div key={i} style={{
            padding: '20px 18px',
            display: 'flex', alignItems: 'flex-start', gap: 12,
            borderRight: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Icon name={it.i} size={16}/>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{it.t}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{it.d}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

window.HomeSections1 = { Nav, Hero, HowItWorks, TrustBar };
