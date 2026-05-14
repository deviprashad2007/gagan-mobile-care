// Bookings (simplified leads) and Repairs (simplified kanban) — plain-English version.
const { LEADS: bLEADS, REPAIRS: bREPAIRS, LEAD_STATUSES: bLS, REPAIR_STATUSES: bRS } = window.GMC_ADMIN;
const bINR = (n) => '₹' + n.toLocaleString('en-IN');

// ─── Bookings ────────────────────────────────────────────────────────────
const Bookings = () => {
  const [leads, setLeads] = aUS(bLEADS);
  const [filter, setFilter] = aUS('all');
  const [search, setSearch] = aUS('');

  const filtered = leads.filter(l => {
    if (filter !== 'all' && l.status !== filter) return false;
    if (search && !(l.name + l.model + l.issue).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: leads.length,
    ...Object.fromEntries(bLS.map(s => [s.id, leads.filter(l => l.status === s.id).length])),
  };

  const setStatus = (id, status) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {[{ id: 'all', label: 'All' }, ...bLS].map(s => (
          <button key={s.id} onClick={() => setFilter(s.id)}
            style={{
              padding: '7px 14px', borderRadius: 999, fontSize: 12,
              border: '1px solid', cursor: 'pointer',
              borderColor: filter === s.id ? 'var(--ink)' : 'var(--line)',
              background: filter === s.id ? 'var(--ink)' : '#fff',
              color: filter === s.id ? '#fff' : 'var(--ink-2)',
              fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
            {s.tone && <span className="dot" style={{ background: s.tone }}/>}
            {s.label}
            <span style={{ fontSize: 10, opacity: .7, fontFamily: 'JetBrains Mono, monospace' }}>{counts[s.id]}</span>
          </button>
        ))}
        <div className="input-group" style={{ marginLeft: 'auto', maxWidth: 240 }}>
          <Icon name="search" size={14} color="var(--ink-3)"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or phone…"/>
        </div>
      </div>

      <div className="panel" style={{ overflow: 'hidden' }}>
        <div className="scroll-x">
          <table className="tbl">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone model</th>
                <th>Issue</th>
                <th>Estimated price</th>
                <th>How</th>
                <th>When</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40, color: 'var(--ink-3)' }}>No bookings match this filter.</td></tr>
              )}
              {filtered.map(l => {
                const st = bLS.find(s => s.id === l.status);
                return (
                  <tr key={l.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar">{l.name.split(' ').map(p => p[0]).join('').slice(0, 2)}</div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{l.name}</div>
                          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{l.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>{l.model}</td>
                    <td><span className="pill">{l.issue}</span></td>
                    <td className="mono" style={{ fontWeight: 600 }}>{bINR(l.price)}</td>
                    <td>
                      <span className="pill" style={{ background: l.method === 'post' ? 'var(--info-soft)' : 'var(--violet-soft)', color: l.method === 'post' ? 'var(--info)' : 'var(--violet)' }}>
                        <Icon name={l.method === 'post' ? 'package' : 'store'} size={11}/> {l.method === 'post' ? 'By post' : 'Walk-in'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--ink-3)' }}>{l.time}</td>
                    <td>
                      <select value={l.status} onChange={e => setStatus(l.id, e.target.value)}
                        style={{
                          padding: '5px 10px', borderRadius: 999, border: '1px solid',
                          borderColor: st.tone, background: st.tone + '15', color: st.tone,
                          fontSize: 12, fontWeight: 500, cursor: 'pointer', appearance: 'none',
                          paddingRight: 20, backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(st.tone)}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center',
                        }}>
                        {bLS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <a href={'tel:+91' + l.phone.replace(/\s/g, '')} className="btn btn-icon" title="Call">
                          <Icon name="phone-call" size={13}/>
                        </a>
                        <a href={'https://wa.me/91' + l.phone.replace(/\s/g, '')} className="btn btn-icon" title="WhatsApp" style={{ color: '#25D366' }}>
                          <Icon name="whatsapp" size={13}/>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help footer */}
      <div className="panel panel-pad" style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg-soft)' }}>
        <div style={{ width: 32, height: 32, borderRadius: 999, background: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Icon name="sparkle" size={16} color="var(--accent)"/>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>
          <b>Tip · </b>
          Change the status dropdown to track each booking.
          When you confirm the price, mark it <b>Booked</b>. After the phone is fixed and picked up, you can move it to <b>Repairs</b>.
        </div>
      </div>
    </div>
  );
};

// ─── Repairs ─────────────────────────────────────────────────────────────
const Repairs = () => {
  const [repairs, setRepairs] = aUS(bREPAIRS);
  const [view, setView] = aUS('board');
  const [search, setSearch] = aUS('');

  const byStatus = (sid) => repairs.filter(r => r.status === sid && r.cust.toLowerCase().includes(search.toLowerCase()));

  const setStatus = (id, status) => setRepairs(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  // Get the next status for one-click advance
  const next = (cur) => {
    const idx = bRS.findIndex(s => s.id === cur);
    return idx < bRS.length - 1 ? bRS[idx + 1] : null;
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'inline-flex', background: 'var(--bg-soft)', borderRadius: 8, padding: 3, gap: 2 }}>
          {[['board', 'Board'], ['list', 'List']].map(([v, l]) => (
            <button key={v} onClick={() => setView(v)}
              style={{
                padding: '6px 14px', fontSize: 12, fontWeight: 500,
                border: 0, borderRadius: 6, cursor: 'pointer',
                background: view === v ? '#fff' : 'transparent',
                color: view === v ? 'var(--ink)' : 'var(--ink-3)',
                boxShadow: view === v ? '0 1px 2px rgba(0,0,0,.06)' : 'none',
              }}>{l}</button>
          ))}
        </div>
        <div className="input-group" style={{ marginLeft: 'auto', maxWidth: 240 }}>
          <Icon name="search" size={14} color="var(--ink-3)"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer…"/>
        </div>
      </div>

      {view === 'board' ? (
        <div className="kanban" style={{ gridTemplateColumns: 'repeat(4, minmax(240px, 1fr))' }}>
          {bRS.map(col => {
            const items = byStatus(col.id);
            const nxt = next(col.id);
            return (
              <div key={col.id} className="kanban-col">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                    <span className="dot" style={{ background: col.tone, width: 8, height: 8 }}/>
                    {col.label}
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--ink-3)', fontWeight: 500 }}>{items.length}</span>
                  </div>
                </div>
                {items.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 8px', color: 'var(--ink-4)', fontSize: 12 }}>Nothing here</div>
                )}
                {items.map(r => (
                  <div key={r.id} className="kanban-card">
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{r.cust}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>{r.model}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                      <span className="pill" style={{ fontSize: 10 }}>{r.issue}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--line-2)' }}>
                      <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{bINR(r.amount)}</div>
                      {nxt ? (
                        <button onClick={() => setStatus(r.id, nxt.id)} className="btn btn-sm"
                          style={{ background: nxt.tone, color: '#fff', borderColor: nxt.tone, fontSize: 11, padding: '4px 10px' }}>
                          {nxt.label} <Icon name="arrow-right" size={11} color="#fff"/>
                        </button>
                      ) : (
                        <span className="pill" style={{ background: 'var(--bg-soft)' }}>Done</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="panel" style={{ overflow: 'hidden' }}>
          <div className="scroll-x">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Customer</th><th>Phone model</th><th>Issue</th>
                  <th>Status</th><th>Brought in</th><th>Ready by</th><th>Amount</th><th></th>
                </tr>
              </thead>
              <tbody>
                {repairs.filter(r => r.cust.toLowerCase().includes(search.toLowerCase())).map(r => {
                  const st = bRS.find(s => s.id === r.status);
                  return (
                    <tr key={r.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar">{r.cust.split(' ').map(p => p[0]).join('').slice(0, 2)}</div>
                          <div>
                            <b>{r.cust}</b>
                            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{r.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td>{r.model}</td>
                      <td><span className="pill">{r.issue}</span></td>
                      <td>
                        <select value={r.status} onChange={e => setStatus(r.id, e.target.value)}
                          style={{
                            padding: '5px 10px', borderRadius: 999, border: '1px solid',
                            borderColor: st.tone, background: st.tone + '15', color: st.tone,
                            fontSize: 12, fontWeight: 500, cursor: 'pointer', appearance: 'none',
                            paddingRight: 20, backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(st.tone)}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center',
                          }}>
                          {bRS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--ink-3)' }}>{r.intake}</td>
                      <td style={{ fontSize: 12, color: 'var(--ink-3)' }}>{r.eta}</td>
                      <td className="mono" style={{ fontWeight: 600 }}>{bINR(r.amount)}</td>
                      <td>
                        <a href={'tel:+91' + r.phone.replace(/\s/g, '')} className="btn btn-icon">
                          <Icon name="phone-call" size={13}/>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

window.AdminLeads = { Bookings, Repairs };
