// Simplified admin shell — 5 plain-English pages.
const { useState: aUS, useEffect: aUE, useMemo: aUM } = React;

const NAV = [
  { id: 'today',    label: 'Today',          icon: 'spark' },
  { id: 'bookings', label: 'Bookings',       icon: 'phone-call' },
  { id: 'repairs',  label: 'Repairs',        icon: 'package' },
  { id: 'phones',   label: 'Phones & Prices',icon: 'phone' },
  { id: 'customers',label: 'Customers',      icon: 'badge' },
];

const Sidebar = ({ active, setActive, counts }) => (
  <aside className="admin-sidebar">
    <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--line)' }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, background: 'var(--ink)',
        display: 'grid', placeItems: 'center', flexShrink: 0, position: 'relative',
      }}>
        <div style={{ width: 14, height: 22, borderRadius: 3, border: '1.5px solid #fff', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 4, left: 1, right: 1, bottom: 4, background: 'var(--accent)', borderRadius: 1 }}/>
        </div>
        <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 999, background: 'var(--accent)', border: '1.5px solid #fff' }}/>
      </div>
      <div className="sb-brand-name" style={{ lineHeight: 1.15, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', letterSpacing: '-.01em' }}>Gagan Mobile Care</div>
        <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 2 }}>Shop dashboard</div>
      </div>
    </div>

    <nav style={{ flex: 1, padding: '12px 0' }}>
      {NAV.map(it => (
        <div key={it.id} className={'sb-item' + (active === it.id ? ' active' : '')}
             onClick={() => setActive(it.id)}>
          <Icon name={it.icon} size={16} color={active === it.id ? '#fff' : 'var(--ink-2)'}/>
          <span className="sb-label">{it.label}</span>
          {counts[it.id] != null && counts[it.id] > 0 && <span className="sb-count">{counts[it.id]}</span>}
        </div>
      ))}
    </nav>

    <div style={{ padding: 12, borderTop: '1px solid var(--line)' }}>
      <a href="Homepage.html" className="sb-item" style={{ margin: 0, color: 'var(--ink-3)', textDecoration: 'none' }}>
        <Icon name="arrow-up-right" size={15} color="var(--ink-3)"/>
        <span className="sb-label">View live site</span>
      </a>
      <div className="sb-brand-name" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 4px', marginTop: 4 }}>
        <div className="avatar" style={{ width: 28, height: 28 }}>GS</div>
        <div style={{ minWidth: 0, lineHeight: 1.2 }}>
          <div style={{ fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}>Gagan Singh</div>
          <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>Shop owner</div>
        </div>
      </div>
    </div>
  </aside>
);

const TopBar = ({ active, onNewBooking }) => {
  const titles = {
    today: 'Today',
    bookings: 'Bookings',
    repairs: 'Repairs on the bench',
    phones: 'Phones & Prices',
    customers: 'Customers',
  };
  const subs = {
    today: 'A quick look at what is happening today.',
    bookings: 'People who want a repair. Call them, book them, or mark done.',
    repairs: 'Phones we are working on right now.',
    phones: 'All phone models we repair, and what we charge for each.',
    customers: 'Everyone who has ever brought a phone here.',
  };
  return (
    <div className="admin-topbar" style={{ height: 'auto', padding: '14px 24px', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-.01em' }}>{titles[active]}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{subs[active]}</div>
      </div>
      <button className="btn btn-accent" onClick={onNewBooking} style={{ alignSelf: 'center' }}>
        <Icon name="plus" size={14} color="#fff"/> New booking
      </button>
    </div>
  );
};

window.AdminShell = { Sidebar, TopBar };
