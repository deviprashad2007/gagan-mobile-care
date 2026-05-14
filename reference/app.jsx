// Main app — composes the homepage and booking flow.
const { useState: uS } = React;
const { Nav, Hero, HowItWorks, TrustBar } = window.HomeSections1;
const { PopularRepairs, PostFlow, Testimonials, Faq, Footer } = window.HomeSections2;

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#E63329",
  "heroLayout": "map",
  "headline": "post",
  "showFloatingCards": true,
  "darkPostSection": true
}/*EDITMODE-END*/;

const App = () => {
  const [bookingOpen, setBookingOpen] = uS(false);
  const [initialBrand, setInitialBrand] = uS(null);
  const [tweaks, setTweak] = window.useTweaks(DEFAULTS);

  // Apply accent live
  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', tweaks.accent);
    // mix soft variant
    document.documentElement.style.setProperty('--accent-soft', tweaks.accent + '22');
  }, [tweaks.accent]);

  const openBooking = (brand = null) => {
    setInitialBrand(brand);
    setBookingOpen(true);
  };

  return (
    <>
      <Nav onBook={() => openBooking()}/>
      <Hero onBook={() => openBooking()} onPickBrand={openBooking}/>
      <HowItWorks/>
      <TrustBar/>
      <PopularRepairs onBook={() => openBooking()}/>
      <PostFlow/>
      <Testimonials/>
      <Faq/>
      <Footer onBook={() => openBooking()}/>

      {/* Mobile sticky bottom CTA */}
      <div className="bottom-cta">
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Get a free quote</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)' }}>60 seconds · No advance</div>
        </div>
        <button onClick={() => openBooking()} className="btn btn-accent" style={{ padding: '10px 14px', fontSize: 13 }}>
          Book repair <span style={{ display: 'inline-flex' }}><Icon name="arrow-right" size={14} color="#fff"/></span>
        </button>
      </div>

      {bookingOpen && (
        <window.BookingFlow
          initialBrand={initialBrand}
          onClose={() => setBookingOpen(false)}
        />
      )}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection title="Accent">
          <window.TweakColor label="Accent color" value={tweaks.accent}
            onChange={v => setTweak('accent', v)}/>
        </window.TweakSection>
        <window.TweakSection title="Headline tone">
          <window.TweakRadio
            value={tweaks.headline}
            onChange={v => setTweak('headline', v)}
            options={[
              { value: 'post', label: 'Post-led' },
              { value: 'walkin', label: 'Walk-in' },
              { value: 'price', label: 'Price-led' },
            ]}/>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 6 }}>
            Headline copy is a content variant — applied via Tweaks state on reload.
          </div>
        </window.TweakSection>
        <window.TweakSection title="Hero">
          <window.TweakToggle label="Floating cards" checked={tweaks.showFloatingCards}
            onChange={v => setTweak('showFloatingCards', v)}/>
          <window.TweakToggle label="Dark post section" checked={tweaks.darkPostSection}
            onChange={v => setTweak('darkPostSection', v)}/>
        </window.TweakSection>
        <window.TweakSection title="Quick actions">
          <window.TweakButton onClick={() => openBooking()}>Open booking flow</window.TweakButton>
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
