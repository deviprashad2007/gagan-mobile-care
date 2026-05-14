// "Today" page — simple summary for a small shop owner.
const { LEADS: tLEADS, REPAIRS: tREPAIRS, REPAIR_STATUSES: tRS } = window.GMC_ADMIN;
const tINR = (n) => '₹' + n.toLocaleString('en-IN');

const BigStat = ({ label, value, sub, tone }) => (
  <div className="panel panel-pad" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500 }}>{label}</div>
    <div className="serif" style={{ fontSize: 44, lineHeight: 1, letterSpacing: '-.02em', color: tone || 'var(--ink)' }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{sub}</div>}
  </div>
);

const Today = ({ goTo }) => {
  const newBookings = tLEADS.filter(l => l.status === 'new');
  const ready = tREPAIRS.filter(r => r.status === 'ready');
  const working = tREPAIRS.filter(r => r.status === 'working');
  const todayEarnings = tREPAIRS.filter(r => r.status === 'picked').reduce((a, r) => a + r.amount, 0);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Greeting */}
      <div>
        <h2 className="serif" style={{ fontSize: 36, margin: 0, letterSpacing: '-.02em' }}>
          Good morning, <em>Gagan</em>.
        </h2>
        <div style={{ color: 'var(--ink-3)', fontSize: 14, marginTop: 6 }}>
          You have <b style={{ color: 'var(--accent)' }}>{newBookings.length} new bookings</b> to call back,
          and <b>{ready.length} phones</b> ready for customers to pick up.
        </div>
      </div>

      {/* 4 simple stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <BigStat label="New bookings" value={newBookings.length} sub="Call them back today" tone="var(--accent)"/>
        <BigStat label="On the bench" value={working.length} sub="Phones being fixed now"/>
        <BigStat label="Ready to pick up" value={ready.length} sub="Tell the customer"/>
        <BigStat label="Earned today" value={tINR(todayEarnings)} sub="From picked-up repairs"/>
      </div>

      {/* Today's bookings + Ready for pickup, side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="today-cols">
        {/* New bookings */}
        <div className="panel">
          <div className="panel-h">
            <h3>New bookings to call</h3>
            <button className="btn btn-sm" onClick={() => goTo('bookings')}>See all <Icon name="arrow-right" size={12}/></button>
          </div>
          <div>
            {newBookings.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
                No new bookings 🎉 You're all caught up.
              </div>
            ) : newBookings.map(l => (
              <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: '1px solid var(--line-2)' }}>
                <div className="avatar">{l.name.split(' ').map(p => p[0]).join('').slice(0, 2)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{l.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                    {l.model} · {l.issue}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{tINR(l.price)}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>{l.time}</div>
                </div>
                <a href={'tel:+91' + l.phone.replace(/\s/g, '')} className="btn btn-icon" title="Call" onClick={e => e.stopPropagation()}>
                  <Icon name="phone-call" size={14}/>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Ready for pickup */}
        <div className="panel">
          <div className="panel-h">
            <h3>Ready to pick up</h3>
            <button className="btn btn-sm" onClick={() => goTo('repairs')}>See all <Icon name="arrow-right" size={12}/></button>
          </div>
          <div>
            {ready.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
                Nothing is ready yet.
              </div>
            ) : ready.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: '1px solid var(--line-2)' }}>
                <div className="avatar" style={{ background: 'linear-gradient(135deg, #22A06B, #1a8255)' }}>{r.cust.split(' ').map(p => p[0]).join('').slice(0, 2)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.cust}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{r.model} · {r.issue}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{tINR(r.amount)}</div>
                </div>
                <a href={'tel:+91' + r.phone.replace(/\s/g, '')} className="btn btn-icon" title="Call to inform">
                  <Icon name="phone-call" size={14}/>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* On the bench right now */}
      <div className="panel">
        <div className="panel-h">
          <h3>Working on these right now</h3>
          <button className="btn btn-sm" onClick={() => goTo('repairs')}>See all <Icon name="arrow-right" size={12}/></button>
        </div>
        <div className="scroll-x">
          <table className="tbl">
            <thead>
              <tr>
                <th>Customer</th><th>Phone model</th><th>Issue</th><th>Amount</th><th>Should be ready by</th><th></th>
              </tr>
            </thead>
            <tbody>
              {working.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))' }}>{r.cust.split(' ').map(p => p[0]).join('').slice(0, 2)}</div>
                      <div><b>{r.cust}</b><div style={{ fontSize: 11, color: 'var(--ink-3)' }} className="mono">{r.phone}</div></div>
                    </div>
                  </td>
                  <td>{r.model}</td>
                  <td><span className="pill">{r.issue}</span></td>
                  <td className="mono" style={{ fontWeight: 600 }}>{tINR(r.amount)}</td>
                  <td className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{r.eta}</td>
                  <td><Icon name="chevron-right" size={14} color="var(--ink-4)"/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

window.AdminToday = { Today };
