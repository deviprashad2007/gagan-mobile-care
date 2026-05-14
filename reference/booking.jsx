// Five-step booking flow rendered as a full-screen overlay.
const { useState, useEffect, useMemo, useRef } = React;
// BRANDS, MODELS, ISSUES, formatINR are global from data.js

// Brand glyph "logo" — a circular tile with the brand initial. Generic, original.
const BrandGlyph = ({ brand, size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: '#fff', border: '1px solid var(--line)',
    display: 'grid', placeItems: 'center',
    fontWeight: 700, fontSize: size * 0.36, letterSpacing: '-.02em',
    color: brand.tone, fontFamily: 'Inter, sans-serif',
  }}>{brand.glyph}</div>
);

// Tiny generic phone illustration
const PhoneSilhouette = ({ w = 36, h = 56 }) => (
  <svg width={w} height={h} viewBox="0 0 36 56" fill="none">
    <rect x="2" y="2" width="32" height="52" rx="6" fill="#F4F2EE" stroke="#E2DFD9"/>
    <rect x="6" y="9" width="24" height="38" rx="2" fill="#fff" stroke="#E2DFD9"/>
    <circle cx="18" cy="51" r="1.5" fill="#E2DFD9"/>
    <rect x="14" y="5" width="8" height="2" rx="1" fill="#E2DFD9"/>
  </svg>
);

const StepDots = ({ step, total, labels }) => (
  <div style={{ display: 'flex', gap: 4, alignItems: 'center', flex: 1 }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{
        flex: 1, height: 3, borderRadius: 2,
        background: i < step ? 'var(--ink)' : i === step ? 'var(--accent)' : 'var(--line)',
        transition: 'background .3s'
      }}/>
    ))}
  </div>
);

// ---------- STEP 1: Brand ----------
const StepBrand = ({ onPick }) => {
  const [q, setQ] = useState('');
  const filtered = BRANDS.filter(b => b.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="micro" style={{ marginBottom: 8 }}>Step 1 of 5 — Pick brand</div>
        <h2 className="serif booking-h2" style={{ fontSize: 44, lineHeight: 1.05, margin: 0, letterSpacing: '-.02em' }}>
          Which brand made <em>your</em> phone?
        </h2>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#fff', border: '1px solid var(--line)', borderRadius: 12,
        padding: '12px 14px', marginBottom: 18, maxWidth: 420,
      }}>
        <Icon name="search" size={18} color="var(--ink-3)"/>
        <input value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search brand…"
          style={{ flex: 1, border: 0, background: 'transparent', fontSize: 14 }}/>
        <span className="kbd">/</span>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10,
      }}>
        {filtered.map(b => (
          <button key={b.id} onClick={() => onPick(b)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 14px', borderRadius: 14,
              border: '1px solid var(--line)', background: '#fff',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all .15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = ''; }}
          >
            <BrandGlyph brand={b} size={36}/>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{b.name}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{(MODELS[b.id]?.flatMap(s => s.items).length) || 8}+ models</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ---------- STEP 2: Model ----------
const StepModel = ({ brand, onPick }) => {
  const [q, setQ] = useState('');
  const series = MODELS[brand.id] || [];
  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="micro" style={{ marginBottom: 8 }}>Step 2 of 5 · {brand.name}</div>
        <h2 className="serif booking-h2" style={{ fontSize: 44, lineHeight: 1.05, margin: 0, letterSpacing: '-.02em' }}>
          Pick your <em>exact</em> model.
        </h2>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#fff', border: '1px solid var(--line)', borderRadius: 12,
        padding: '12px 14px', marginBottom: 18, maxWidth: 420,
      }}>
        <Icon name="search" size={18} color="var(--ink-3)"/>
        <input value={q} onChange={e => setQ(e.target.value)}
          placeholder={`Search ${brand.name} models…`}
          style={{ flex: 1, border: 0, background: 'transparent', fontSize: 14 }}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {series.map(s => {
          const items = s.items.filter(m => m.name.toLowerCase().includes(q.toLowerCase()));
          if (!items.length) return null;
          return (
            <div key={s.series}>
              <div className="micro" style={{ marginBottom: 10 }}>{s.series}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                {items.map(m => (
                  <button key={m.id} onClick={() => onPick(m)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', borderRadius: 12,
                      border: '1px solid var(--line)', background: '#fff',
                      cursor: 'pointer', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--ink)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}
                  >
                    <PhoneSilhouette w={22} h={34}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{m.year}</div>
                    </div>
                    <Icon name="chevron-right" size={14} color="var(--ink-4)"/>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- STEP 3: Issues ----------
const issueIconMap = {
  screen: 'screen', battery: 'battery', charging: 'spark',
  fcam: 'cam', bcam: 'cam', speaker: 'speaker', mic: 'mic',
  water: 'drop', back: 'box', software: 'cpu', power: 'phone',
  volume: 'phone', other: 'plus',
};
const StepIssues = ({ selected, onToggle, onContinue }) => (
  <div className="fade-in">
    <div style={{ marginBottom: 24 }}>
      <div className="micro" style={{ marginBottom: 8 }}>Step 3 of 5 · Pick one or many</div>
      <h2 className="serif booking-h2" style={{ fontSize: 44, lineHeight: 1.05, margin: 0, letterSpacing: '-.02em' }}>
        What's <em>wrong</em> with it?
      </h2>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
      {ISSUES.map(iss => {
        const on = selected.includes(iss.id);
        return (
          <button key={iss.id} onClick={() => onToggle(iss.id)}
            style={{
              position: 'relative',
              display: 'flex', flexDirection: 'column', gap: 10,
              padding: 16, borderRadius: 14,
              border: `1px solid ${on ? 'var(--ink)' : 'var(--line)'}`,
              background: on ? 'var(--ink)' : '#fff',
              color: on ? '#fff' : 'var(--ink)',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all .15s',
            }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: on ? 'rgba(255,255,255,.12)' : 'var(--bg)',
              display: 'grid', placeItems: 'center',
            }}>
              <Icon name={issueIconMap[iss.id] || 'plus'} size={18} color={on ? '#fff' : 'var(--ink)'}/>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                {iss.name}
                {iss.common && !on && (
                  <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>· Common</span>
                )}
              </div>
              <div style={{ fontSize: 12, opacity: on ? .75 : 1, color: on ? 'rgba(255,255,255,.8)' : 'var(--ink-3)', marginTop: 2 }}>{iss.desc}</div>
              <div style={{ fontSize: 12, marginTop: 8, fontWeight: 500, color: on ? 'var(--accent)' : 'var(--ink)' }}>
                {formatINR(iss.range[0])} – {formatINR(iss.range[1])}
              </div>
            </div>
            {on && (
              <div style={{ position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderRadius: 999, background: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
                <Icon name="check" size={14} color="#fff"/>
              </div>
            )}
          </button>
        );
      })}
    </div>
    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
        {selected.length === 0 ? 'Pick at least one issue.' : `${selected.length} ${selected.length === 1 ? 'issue' : 'issues'} selected`}
      </div>
      <button className="btn btn-dark" disabled={!selected.length} onClick={onContinue}
        style={{ opacity: selected.length ? 1 : .4 }}>
        Continue <Icon name="arrow-right" size={16} color="#fff"/>
      </button>
    </div>
  </div>
);

// ---------- STEP 4: Service type ----------
const StepService = ({ selectedIssues, model, brand, service, onPick }) => {
  const issues = ISSUES.filter(i => selectedIssues.includes(i.id));
  const [lo, hi] = issues.reduce(([a, b], i) => [a + i.range[0], b + i.range[1]], [0, 0]);
  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="micro" style={{ marginBottom: 8 }}>Step 4 of 5 · How should we get the phone?</div>
        <h2 className="serif booking-h2" style={{ fontSize: 44, lineHeight: 1.05, margin: 0, letterSpacing: '-.02em' }}>
          Walk in, or <em>send by post</em>.
        </h2>
      </div>

      {/* Estimate */}
      <div className="card shadow-soft" style={{ padding: 18, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div className="micro">Your estimate</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <div className="serif" style={{ fontSize: 38, lineHeight: 1 }}>
                {formatINR(lo)} <span style={{ color: 'var(--ink-4)' }}>–</span> {formatINR(hi)}
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>
              {brand.name} {model.name} · final quote on call · no hidden charges
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220 }}>
            {issues.map(i => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--ink-3)' }}>{i.name}</span>
                <span className="mono">{formatINR(i.range[0])}–{formatINR(i.range[1])}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {/* Walk in */}
        <button onClick={() => onPick('walkin')}
          style={{
            position: 'relative', textAlign: 'left', cursor: 'pointer',
            padding: 0, border: `1px solid ${service === 'walkin' ? 'var(--ink)' : 'var(--line)'}`,
            background: '#fff', borderRadius: 16, overflow: 'hidden',
          }}>
          <div className="map-bg" style={{ height: 120, position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 320 120" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
              <path d="M0 80 Q80 40 160 70 T320 50" stroke="#fff" strokeWidth="6" fill="none"/>
              <path d="M40 0 Q60 60 120 80 T220 120" stroke="#fff" strokeWidth="4" fill="none"/>
            </svg>
            <div style={{ position: 'absolute', left: '50%', top: '55%', transform: 'translate(-50%, -50%)' }}>
              <div className="pulse" style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
                <Icon name="store" size={16} color="#fff"/>
              </div>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.12em' }}>Walk-in repair</div>
                <div style={{ fontWeight: 600, fontSize: 18, marginTop: 4 }}>Visit our store</div>
              </div>
              {service === 'walkin' && <Icon name="check-circle" size={22} color="var(--ink)"/>}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6 }}>
              Shop 14, Lajpat Nagar Central Market, New Delhi 110024
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 12, color: 'var(--ink-3)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="clock" size={13}/> 10am–9pm</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="compass" size={13}/> 4 km away</span>
            </div>
          </div>
        </button>

        {/* Send by post */}
        <button onClick={() => onPick('post')}
          style={{
            position: 'relative', textAlign: 'left', cursor: 'pointer',
            padding: 0, border: `1px solid ${service === 'post' ? 'var(--ink)' : 'var(--line)'}`,
            background: '#fff', borderRadius: 16, overflow: 'hidden',
          }}>
          <div style={{ height: 120, position: 'relative', background: '#0E0E10', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 320 120" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
              <path d="M-10 90 Q60 40 160 60 T330 50" stroke="rgba(255,255,255,.12)" strokeDasharray="4 6" strokeWidth="1.5" fill="none"/>
              <path d="M30 110 Q120 30 200 80 T320 30" stroke="rgba(242,92,31,.9)" strokeDasharray="3 5" strokeWidth="1.5" fill="none"/>
            </svg>
            <div style={{ position: 'absolute', left: 24, top: 38, width: 12, height: 12, borderRadius: 999, background: '#fff', boxShadow: '0 0 0 4px rgba(255,255,255,.15)' }}/>
            <div style={{ position: 'absolute', right: 28, bottom: 22, color: 'var(--accent)' }}>
              <Icon name="package" size={28}/>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.12em' }}>Send by post</div>
                <div style={{ fontWeight: 600, fontSize: 18, marginTop: 4 }}>Speed Post / Courier</div>
              </div>
              {service === 'post' && <Icon name="check-circle" size={22} color="var(--ink)"/>}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6 }}>
              We'll guide you on packing, send shipping label, and pay return courier on us.
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 12, color: 'var(--ink-3)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="truck" size={13}/> Pan-India</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="wallet" size={13}/> COD on return</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

// ---------- STEP 5: Form ----------
const StepForm = ({ summary, onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const valid = name.trim().length >= 2 && /^\d{10}$/.test(phone.replace(/\D/g, ''));
  return (
    <div className="fade-in booking-form-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28 }}>
      <div>
        <div className="micro" style={{ marginBottom: 8 }}>Step 5 of 5 · Almost there</div>
        <h2 className="serif booking-h2" style={{ fontSize: 44, lineHeight: 1.05, margin: 0, letterSpacing: '-.02em' }}>
          We'll call you in <em>15 minutes</em>.
        </h2>
        <div style={{ color: 'var(--ink-3)', marginTop: 10, fontSize: 14, maxWidth: 440 }}>
          A real human, not a bot. They'll confirm the issue, lock the price, and book your slot.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24, maxWidth: 440 }}>
          <label>
            <div className="micro" style={{ marginBottom: 6 }}>Your name</div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Aarav Sharma"
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--line)', background: '#fff', borderRadius: 12, fontSize: 15 }}/>
          </label>
          <label>
            <div className="micro" style={{ marginBottom: 6 }}>Phone number</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--line)', background: '#fff', borderRadius: 12 }}>
              <span style={{ padding: '14px 12px', borderRight: '1px solid var(--line)', fontSize: 15, color: 'var(--ink-3)' }}>+91</span>
              <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="98765 43210"
                style={{ flex: 1, padding: '14px 12px', border: 0, background: 'transparent', fontSize: 15 }}/>
            </div>
          </label>

          <button onClick={() => valid && onSubmit({ name, phone })}
            className="btn btn-dark" style={{
              padding: '16px 20px', fontSize: 15, marginTop: 8, justifyContent: 'center',
              opacity: valid ? 1 : .5, cursor: valid ? 'pointer' : 'not-allowed',
            }}>
            <Icon name="phone-call" size={16} color="#fff"/>
            Get free callback in 15 minutes
            <Icon name="arrow-right" size={16} color="#fff"/>
          </button>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="shield" size={13}/> Your number stays private. No spam, ever.
          </div>
        </div>
      </div>

      {/* Summary card */}
      <div className="card booking-summary" style={{ padding: 22, alignSelf: 'start', position: 'sticky', top: 24 }}>
        <div className="micro" style={{ marginBottom: 14 }}>Booking summary</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--line)' }}>
          <BrandGlyph brand={summary.brand} size={36}/>
          <div>
            <div style={{ fontWeight: 600 }}>{summary.model.name}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{summary.brand.name} · {summary.model.year}</div>
          </div>
        </div>
        <div className="micro" style={{ marginBottom: 8 }}>Repairs</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--line)' }}>
          {summary.issues.map(i => (
            <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span>{i.name}</span>
              <span className="mono" style={{ color: 'var(--ink-3)' }}>{formatINR(i.range[0])}–{formatINR(i.range[1])}</span>
            </div>
          ))}
        </div>
        <div className="micro" style={{ marginBottom: 6 }}>Service</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Icon name={summary.service === 'walkin' ? 'store' : 'package'} size={16}/>
          <span style={{ fontSize: 14 }}>{summary.service === 'walkin' ? 'Walk-in at Lajpat Nagar' : 'Send by Speed Post'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 14, borderTop: '1px solid var(--line)' }}>
          <div className="micro">Total estimate</div>
          <div className="serif" style={{ fontSize: 22 }}>{formatINR(summary.total[0])}–{formatINR(summary.total[1])}</div>
        </div>
      </div>
    </div>
  );
};

// ---------- Confirmation ----------
const Confirmation = ({ booking, onClose }) => {
  const [secs, setSecs] = useState(15 * 60);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return (
    <div className="fade-in" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', paddingTop: 12 }}>
      <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--ink)', margin: '0 auto', display: 'grid', placeItems: 'center' }}>
        <Icon name="check" size={36} color="#fff" stroke={2}/>
      </div>
      <h2 className="serif" style={{ fontSize: 52, lineHeight: 1.05, margin: '20px 0 6px', letterSpacing: '-.02em' }}>
        Booking received.
      </h2>
      <div style={{ color: 'var(--ink-3)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
        Hi {booking.name.split(' ')[0]}, our team will call <span className="mono" style={{ color: 'var(--ink)' }}>+91 {booking.phone}</span> within 15 minutes.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 12, marginTop: 28 }}>
        <div className="card" style={{ padding: 16, textAlign: 'left' }}>
          <div className="micro">Booking ID</div>
          <div className="mono" style={{ fontSize: 18, marginTop: 4 }}>{booking.id}</div>
        </div>
        <div className="card" style={{ padding: 16, textAlign: 'left' }}>
          <div className="micro">Callback in</div>
          <div className="mono" style={{ fontSize: 18, marginTop: 4 }}>{mm}:{ss}</div>
        </div>
        <div className="card" style={{ padding: 16, textAlign: 'left' }}>
          <div className="micro">Estimate</div>
          <div className="serif" style={{ fontSize: 18, marginTop: 4 }}>{formatINR(booking.total[0])}–{formatINR(booking.total[1])}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
        <button className="btn" style={{ background: '#25D366', color: '#fff' }}>
          <Icon name="whatsapp" size={16} color="#fff"/> Chat on WhatsApp
        </button>
        <button className="btn btn-light">
          <Icon name="compass" size={16}/> Track repair
        </button>
        <button className="btn btn-ghost" onClick={onClose}>
          Back to home
        </button>
      </div>
    </div>
  );
};

// ---------- Container ----------
const BookingFlow = ({ initialBrand, onClose }) => {
  const [step, setStep] = useState(initialBrand ? 1 : 0);
  const [brand, setBrand] = useState(initialBrand || null);
  const [model, setModel] = useState(null);
  const [issues, setIssues] = useState([]);
  const [service, setService] = useState(null);
  const [booking, setBooking] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const issueObjs = ISSUES.filter(i => issues.includes(i.id));
  const total = issueObjs.reduce(([a, b], i) => [a + i.range[0], b + i.range[1]], [0, 0]);

  const stepLabels = ['Brand', 'Model', 'Issue', 'Service', 'Details'];

  const back = () => {
    if (step === 0) onClose();
    else setStep(s => s - 1);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 100,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div className="booking-topbar" style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 28px', borderBottom: '1px solid var(--line)',
        background: 'rgba(244,242,238,.92)', backdropFilter: 'blur(8px)',
      }}>
        <button className="btn btn-light" onClick={back} style={{ padding: '8px 12px' }}>
          <Icon name="arrow-left" size={14}/> {step === 0 ? 'Close' : 'Back'}
        </button>
        <div style={{ flex: 1, maxWidth: 480 }}>
          <StepDots step={confirmed ? 5 : step} total={5}/>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
          {confirmed ? 'Done' : `${step + 1} of 5 · ${stepLabels[step]}`}
        </div>
        <button className="btn btn-ghost" onClick={onClose} style={{ padding: '8px' }}>
          <Icon name="close" size={16}/>
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div className="booking-body" style={{ maxWidth: 1080, margin: '0 auto', padding: '36px 28px 80px' }}>
          {confirmed && booking ? (
            <Confirmation booking={booking} onClose={onClose}/>
          ) : step === 0 ? (
            <StepBrand onPick={b => { setBrand(b); setStep(1); }}/>
          ) : step === 1 ? (
            <StepModel brand={brand} onPick={m => { setModel(m); setStep(2); }}/>
          ) : step === 2 ? (
            <StepIssues
              selected={issues}
              onToggle={id => setIssues(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])}
              onContinue={() => setStep(3)}
            />
          ) : step === 3 ? (
            <StepService brand={brand} model={model} selectedIssues={issues}
              service={service}
              onPick={s => { setService(s); setTimeout(() => setStep(4), 240); }}/>
          ) : (
            <StepForm
              summary={{ brand, model, issues: issueObjs, service, total }}
              onSubmit={({ name, phone }) => {
                const id = 'GMC-' + Math.random().toString(36).slice(2, 7).toUpperCase();
                setBooking({ name, phone, id, total });
                setConfirmed(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

window.BookingFlow = BookingFlow;
window.BrandGlyph = BrandGlyph;
window.PhoneSilhouette = PhoneSilhouette;
