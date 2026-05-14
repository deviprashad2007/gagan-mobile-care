// Homepage section components — part 2
const fINR2 = window.GAGAN_DATA.formatINR;

// ----- POPULAR REPAIRS -----
const PopularRepairs = ({ onBook }) => {
  const featured = [
  { id: 'screen', label: 'Screen replacement', from: 1499, models: 'iPhone, Galaxy, OnePlus, Pixel' },
  { id: 'battery', label: 'Battery swap', from: 799, models: 'All major brands' },
  { id: 'bcam', label: 'Back camera repair', from: 1299, models: 'iPhone 13–15, Galaxy S' },
  { id: 'water', label: 'Water damage recovery', from: 1999, models: 'Liquid contact, deep clean' },
  { id: 'back', label: 'Back glass replace', from: 999, models: 'iPhone 11–15, Galaxy S22+' },
  { id: 'charging', label: 'Charging port fix', from: 499, models: 'Type-C, Lightning, micro-USB' }];

  return (
    <section id="prices" className="sec-pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div className="micro" style={{ marginBottom: 8 }}>Popular fixes · transparent pricing</div>
          <h2 className="serif h-section" style={{ margin: 0, letterSpacing: '-.025em', maxWidth: 600 }}>
            Real prices for the things that <em>actually break</em>.
          </h2>
        </div>
        <button className="btn btn-light">See all 50+ repairs <Icon name="arrow-up-right" size={14} /></button>
      </div>

      <div className="three-col">
        {featured.map((f) =>
        <div key={f.id} className="card" style={{ padding: 22, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 17 }}>{f.label}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{f.models}</div>
              </div>
              <div style={{ width: 40, height: 40, background: 'var(--bg)', borderRadius: 10, display: 'grid', placeItems: 'center' }}>
                <Icon name={{ screen: 'screen', battery: 'battery', bcam: 'cam', water: 'drop', back: 'box', charging: 'spark' }[f.id]} size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 28 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.1em' }}>From</div>
                <div className="serif" style={{ fontSize: 32 }}>{fINR2(f.from)}</div>
              </div>
              <button onClick={() => onBook()} className="btn btn-light" style={{ padding: '8px 14px', fontSize: 12 }}>
                Book <Icon name="arrow-right" size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>);

};

// ----- POST FLOW DETAILED -----
const PostFlow = () => {
  const steps = [
  { n: '01', t: 'Book online', d: 'Pick brand, model, issue. Get a quote and a packing checklist within 60 seconds.' },
  { n: '02', t: 'Pack safely', d: 'Bubble-wrap the phone, put it in a box. We send a printable Speed Post label by WhatsApp.' },
  { n: '03', t: 'Drop & track', d: 'Hand it in at any India Post counter. We track your parcel and update you daily.' },
  { n: '04', t: 'Repair & QC', d: 'Our techs diagnose, replace parts, and run a 32-point quality check.' },
  { n: '05', t: 'Cash on return', d: 'Speed Post brings it back. Pay the postman the locked-in amount. Done.' }];

  return (
    <section id="post" className="sec-pad">
      <div className="card post-card" style={{ background: 'var(--ink)', color: '#fff', borderColor: 'var(--ink)', padding: 28, position: 'relative', overflow: 'hidden' }}>
        {/* Map decoration */}
        <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, opacity: .3 }}>
          <path d="M-50 380 Q200 200 480 280 T960 200 T1400 320" stroke="rgba(242,92,31,.6)" strokeWidth="1.5" strokeDasharray="3 5" fill="none" />
          <path d="M0 480 Q300 380 600 460 T1200 360" stroke="rgba(255,255,255,.15)" strokeWidth="1" strokeDasharray="2 4" fill="none" />
        </svg>
        <div className="post-grid" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
          <div>
            <div className="micro" style={{ color: 'rgba(255,255,255,.6)', marginBottom: 12 }}>Send by post — anywhere in India</div>
            <h2 className="serif h-section" style={{ margin: 0, letterSpacing: '-.025em' }}>
              From <em>Kohima</em><br />
              to <em>Kanyakumari</em>.
            </h2>
            <p style={{ color: 'rgba(255,255,255,.7)', marginTop: 18, maxWidth: 380 }}>
              No service in your city? You don't have to settle for the local guy. India Post's Speed Post reaches every PIN code, and we cover the return courier on every repair.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 22 }}>
              <button className="btn btn-accent">
                <Icon name="download" size={14} color="#fff" /> Download packing guide
              </button>
              <button className="btn" style={{ border: '1px solid rgba(255,255,255,.2)', color: "rgb(0, 0, 0)" }}>
                <Icon name="whatsapp" size={14} color="#fff" /> Chat with us
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {steps.map((s, i) =>
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 20, alignItems: 'center',
              padding: '18px 0', borderTop: i ? '1px solid rgba(255,255,255,.12)' : 0
            }}>
                <div className="serif" style={{ fontSize: 32, color: 'rgba(255,255,255,.4)' }}>{s.n}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 17 }}>{s.t}</div>
                  <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 13, marginTop: 2 }}>{s.d}</div>
                </div>
                <Icon name="chevron-right" size={16} color="rgba(255,255,255,.4)" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

};

// ----- TESTIMONIALS -----
const Testimonials = () => {
  const reviews = [
  { name: 'Priya M.', city: 'Guwahati', stars: 5, text: 'Sent my Pixel 7 from Assam. Got it back in 5 days, charging port fixed, paid on delivery. Genuinely surprised this exists.', method: 'post' },
  { name: 'Aman K.', city: 'Delhi · Walk-in', stars: 5, text: 'Cracked screen on my iPhone 13. Walked in at 11, picked up at 1 PM. Honest pricing, no upselling. Will recommend.', method: 'walkin' },
  { name: 'Rohini S.', city: 'Bangalore', stars: 5, text: 'Galaxy S22 wouldn\'t turn on after a fall. They gave me a fixed quote on call, no hidden charges. Phone\'s been perfect for 4 months.', method: 'post' },
  { name: 'Sahil J.', city: 'Delhi · Walk-in', stars: 4, text: 'Battery on OnePlus 9 was draining in 4 hours. Replaced same day. Could be faster, but result is great.', method: 'walkin' }];

  return (
    <section id="stories" className="sec-pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div className="micro" style={{ marginBottom: 8 }}><span className="dot" />&nbsp; What people say</div>
          <h2 className="serif h-section" style={{ margin: 0, letterSpacing: '-.025em', maxWidth: 600 }}>
            2,143 Google reviews. <em>Most start with "honest"</em>.
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 1 }}>
            {[1, 2, 3, 4, 5].map((i) => <Icon key={i} name="star" size={20} color="var(--accent)" />)}
          </div>
          <div style={{ fontWeight: 600 }}>4.8</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>average</div>
        </div>
      </div>
      <div className="four-col">
        {reviews.map((r, i) =>
        <div key={i} className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 1, marginBottom: 14 }}>
              {Array.from({ length: 5 }).map((_, j) =>
            <Icon key={j} name="star" size={14} color={j < r.stars ? 'var(--accent)' : 'var(--line)'} />
            )}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.5, flex: 1, textWrap: 'pretty' }}>"{r.text}"</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: 'linear-gradient(135deg, #d8d2c5, #b9b3a7)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600 }}>
                {r.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{r.city}</div>
              </div>
              <div style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: 'var(--bg)', color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>
                {r.method === 'post' ? 'Post' : 'Walk-in'}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>);

};

// ----- FAQ -----
const Faq = () => {
  const [open, setOpen] = React.useState(0);
  const items = [
  { q: 'How long does a walk-in repair take?', a: 'Most repairs (screen, battery, charging port) are done within 90 minutes while you wait. Complex repairs like water damage or motherboard work may take 1–2 days.' },
  { q: 'What if my city doesn\'t have a phone repair shop?', a: 'That\'s exactly what our post service is for. Speed Post your phone to us; we repair and ship it back. The whole round trip takes 4–6 days, and you pay cash on delivery — no upfront payment needed.' },
  { q: 'Are the parts genuine?', a: 'We use OEM-grade parts for all repairs. For Apple, Samsung and OnePlus screens, we offer two grades (original and OEM-equivalent) with different price points and the same 6-month warranty.' },
  { q: 'What if you can\'t fix my phone?', a: 'No fix, no fee. If our technicians can\'t solve the problem, we ship the phone back to you for free, with a full diagnostic report.' },
  { q: 'Do you offer pickup and drop in Delhi NCR?', a: 'Yes — within 8 km of Lajpat Nagar, our courier picks up and drops free. Beyond that, the post option is faster and cheaper.' }];

  return (
    <section id="faq" className="sec-pad">
      <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
        <div>
          <div className="micro" style={{ marginBottom: 8 }}>Common questions</div>
          <h2 className="serif h-section" style={{ margin: 0, letterSpacing: '-.025em' }}>
            Quick answers, <em>before you commit</em>.
          </h2>
          <p style={{ color: 'var(--ink-3)', marginTop: 18, maxWidth: 320 }}>
            Can't find your question? Ping us on WhatsApp — we usually reply within 8 minutes during shop hours.
          </p>
          <button className="btn btn-light" style={{ marginTop: 14 }}>
            <Icon name="whatsapp" size={14} /> Ask on WhatsApp
          </button>
        </div>
        <div className="card" style={{ padding: '4px 24px' }}>
          {items.map((it, i) =>
          <div key={i} style={{ borderBottom: i < items.length - 1 ? '1px solid var(--line)' : 0 }}>
              <button onClick={() => setOpen(open === i ? -1 : i)}
            style={{ width: '100%', textAlign: 'left', padding: '20px 0', background: 'transparent', border: 0, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 500 }}>{it.q}</span>
                <Icon name={open === i ? 'minus' : 'plus'} size={16} color="var(--ink-3)" />
              </button>
              {open === i &&
            <div className="fade-in" style={{ paddingBottom: 20, color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.6, maxWidth: 560 }}>
                  {it.a}
                </div>
            }
            </div>
          )}
        </div>
      </div>
    </section>);

};

// ----- CTA + FOOTER -----
const Footer = ({ onBook }) =>
<footer className="sec-pad">
    <div className="card footer-card" style={{ background: 'var(--ink)', color: '#fff', borderColor: 'var(--ink)', padding: 28, position: 'relative', overflow: 'hidden' }}>
      <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28 }}>
        <div>
          <h3 className="serif" style={{ fontSize: 44, lineHeight: 1, margin: 0, letterSpacing: '-.025em' }}>
            Get your phone fixed.<br /><em>Today, or by Friday.</em>
          </h3>
          <p style={{ color: 'rgba(255,255,255,.65)', marginTop: 18, maxWidth: 360 }}>
            Free quote in 60 seconds. No advance payment. Genuine parts. 6-month warranty.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            <button className="btn btn-accent" onClick={() => onBook()}>Book a repair <Icon name="arrow-right" size={14} color="#fff" /></button>
            <button className="btn" style={{ border: '1px solid rgba(255,255,255,.2)', color: "rgb(0, 0, 0)" }}>+91 98112 00410</button>
          </div>
        </div>
        {[
      { t: 'Repairs', l: ['Screen replacement', 'Battery swap', 'Water damage', 'Camera fix', 'See all 50+'] },
      { t: 'Brands', l: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'See all 15+'] },
      { t: 'Company', l: ['About', 'Track repair', 'Warranty terms', 'Privacy', 'Contact'] }].
      map((c) =>
      <div key={c.t}>
            <div className="micro" style={{ color: 'rgba(255,255,255,.5)', marginBottom: 16 }}>{c.t}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              {c.l.map((x) => <a key={x} style={{ color: 'rgba(255,255,255,.85)' }}>{x}</a>)}
            </div>
          </div>
      )}
      </div>
      <div className="footer-bottom" style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'rgba(255,255,255,.5)', flexWrap: 'wrap', gap: 12 }}>
        <div>© 2026 Gagan Mobile Care · Shop 14, Lajpat Nagar Central Market, New Delhi 110024</div>
        <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="Admin.html" style={{ color: 'rgba(255,255,255,.7)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="shield" size={11} color="rgba(255,255,255,.7)"/> Admin
          </a>
          <span>GST 07ABCDE1234F1Z5 · GMC-WEB-v2026.04</span>
        </div>
      </div>
    </div>
  </footer>;


window.HomeSections2 = { PopularRepairs, PostFlow, Testimonials, Faq, Footer };