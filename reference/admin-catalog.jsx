// Phones & Prices — combined catalog + pricing page.
// Designed for a non-technical shop owner: brand list left, models with inline prices right.
const { CUSTOMERS: cCUST } = window.GMC_ADMIN;
const cBRANDS = window.GAGAN_DATA.BRANDS;
const cMODELS = window.GAGAN_DATA.MODELS;
const cINR = (n) => '₹' + n.toLocaleString('en-IN');

// Default issues we charge for — kept short and plain
const REPAIR_ISSUES = [
  { id: 'screen',   label: 'Screen' },
  { id: 'battery',  label: 'Battery' },
  { id: 'back',     label: 'Back glass' },
  { id: 'charging', label: 'Charging port' },
];

// Modal helper (kept simple)
const Modal = ({ title, onClose, children, footer }) => (
  <div className="modal-bg" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{title}</h3>
        <button className="btn btn-icon btn-ghost" onClick={onClose}><Icon name="close" size={14}/></button>
      </div>
      <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>{children}</div>
      {footer && <div style={{ padding: 16, borderTop: '1px solid var(--line)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>{footer}</div>}
    </div>
  </div>
);

// Seed default price for a model+issue pair (deterministic)
const seedPrice = (mId, iId) => {
  const ranges = { screen: 6000, battery: 1500, back: 3000, charging: 800 };
  const base = ranges[iId] || 1000;
  const hash = (mId + iId).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.round(base * (0.7 + ((hash % 100) / 100) * 0.6) / 100) * 100;
};

const PhonesAndPrices = () => {
  const [brands, setBrands] = aUS(cBRANDS);
  const [models, setModels] = aUS(cMODELS);
  const [selId, setSelId] = aUS(cBRANDS[0].id);
  const [prices, setPrices] = aUS({});
  const [addBrandOpen, setAddBrandOpen] = aUS(false);
  const [addModelOpen, setAddModelOpen] = aUS(false);
  const [newBrand, setNewBrand] = aUS({ name: '', glyph: '' });
  const [newModel, setNewModel] = aUS({ name: '', year: 2026 });
  const [search, setSearch] = aUS('');

  const sel = brands.find(b => b.id === selId) || brands[0];
  const series = models[selId] || [];
  const allModels = series.flatMap(s => s.items);
  const filtered = allModels.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  const getPrice = (mId, iId) => prices[mId + ':' + iId] ?? seedPrice(mId, iId);
  const setPrice = (mId, iId, v) => setPrices(prev => ({ ...prev, [mId + ':' + iId]: v }));

  const addBrand = () => {
    if (!newBrand.name) return;
    const id = newBrand.name.toLowerCase().replace(/\s+/g, '');
    const b = { id, name: newBrand.name, glyph: newBrand.glyph || newBrand.name[0].toUpperCase(), tone: '#0A0A0A' };
    setBrands(prev => [...prev, b]);
    setModels(prev => ({ ...prev, [id]: [{ series: 'All models', items: [] }] }));
    setSelId(id);
    setNewBrand({ name: '', glyph: '' });
    setAddBrandOpen(false);
  };

  const addModel = () => {
    if (!newModel.name) return;
    const mid = newModel.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) + '-' + Date.now().toString(36).slice(-3);
    setModels(prev => {
      const bs = prev[selId] && prev[selId].length ? [...prev[selId]] : [{ series: 'All models', items: [] }];
      bs[0] = { ...bs[0], items: [...bs[0].items, { id: mid, name: newModel.name, year: +newModel.year }] };
      return { ...prev, [selId]: bs };
    });
    setNewModel({ name: '', year: 2026 });
    setAddModelOpen(false);
  };

  const removeModel = (mId) => {
    if (!confirm('Remove this phone model? You can always add it back later.')) return;
    setModels(prev => ({
      ...prev,
      [selId]: prev[selId].map(s => ({ ...s, items: s.items.filter(m => m.id !== mId) })),
    }));
  };

  const removeBrand = (bid) => {
    const b = brands.find(b => b.id === bid);
    if (!confirm(`Remove "${b.name}" and all its phone models?`)) return;
    setBrands(prev => prev.filter(b => b.id !== bid));
    setModels(prev => { const cp = { ...prev }; delete cp[bid]; return cp; });
    if (selId === bid) setSelId(brands.find(b => b.id !== bid)?.id);
  };

  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 14 }}>
      {/* Brand list */}
      <div className="panel" style={{ alignSelf: 'flex-start', position: 'sticky', top: 24, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        <div className="panel-h">
          <h3>Brands</h3>
          <button className="btn btn-sm btn-accent" onClick={() => setAddBrandOpen(true)}>
            <Icon name="plus" size={12} color="#fff"/> Add
          </button>
        </div>
        <div>
          {brands.map(b => {
            const active = selId === b.id;
            const count = (models[b.id]?.reduce((a, s) => a + s.items.length, 0)) || 0;
            return (
              <div key={b.id} onClick={() => setSelId(b.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderBottom: '1px solid var(--line-2)',
                  cursor: 'pointer',
                  background: active ? 'var(--bg-soft)' : 'transparent',
                  borderLeft: '3px solid ' + (active ? 'var(--accent)' : 'transparent'),
                }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, background: '#fff',
                  border: '1px solid var(--line)',
                  display: 'grid', placeItems: 'center',
                  fontSize: 11, fontWeight: 700, color: b.tone, letterSpacing: '-.02em',
                  flexShrink: 0,
                }}>{b.glyph}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{count} model{count !== 1 ? 's' : ''}</div>
                </div>
                <button className="btn btn-icon btn-ghost" onClick={(e) => { e.stopPropagation(); removeBrand(b.id); }}
                  title="Remove brand" style={{ opacity: active ? 1 : 0, padding: 4 }}>
                  <Icon name="close" size={11} color="var(--ink-4)"/>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Models + inline prices */}
      <div className="panel">
        <div className="panel-h" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, background: '#fff',
              border: '1px solid var(--line)',
              display: 'grid', placeItems: 'center',
              fontSize: 14, fontWeight: 700, color: sel.tone,
            }}>{sel.glyph}</div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18 }}>{sel.name}</h3>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{allModels.length} phone models · click a price to edit</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ maxWidth: 200 }}>
              <Icon name="search" size={13} color="var(--ink-3)"/>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${sel.name}…`}/>
            </div>
            <button className="btn btn-dark" onClick={() => setAddModelOpen(true)}>
              <Icon name="plus" size={13} color="#fff"/> Add a phone model
            </button>
          </div>
        </div>

        {/* Header row */}
        {filtered.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr) 40px',
            padding: '10px 18px', borderBottom: '1px solid var(--line)',
            background: 'var(--bg-soft)', fontSize: 11, fontWeight: 600,
            color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.08em',
          }}>
            <div>Phone model</div>
            {REPAIR_ISSUES.map(i => <div key={i.id} style={{ textAlign: 'right' }}>{i.label}</div>)}
            <div></div>
          </div>
        )}

        {/* Rows */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--bg-soft)', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
                <Icon name="phone" size={24} color="var(--ink-3)"/>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                {search ? 'No phone models match your search.' : 'No phone models for ' + sel.name + ' yet.'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 16 }}>
                {search ? 'Try a different search.' : 'Add your first one to start charging repairs.'}
              </div>
              {!search && (
                <button className="btn btn-dark" onClick={() => setAddModelOpen(true)}>
                  <Icon name="plus" size={13} color="#fff"/> Add a phone model
                </button>
              )}
            </div>
          ) : filtered.map(m => (
            <div key={m.id} style={{
              display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr) 40px',
              padding: '12px 18px', borderBottom: '1px solid var(--line-2)',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div style={{ width: 26, height: 36, borderRadius: 4, border: '1.5px solid var(--ink-5)', position: 'relative', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', inset: 3, background: 'var(--bg-soft)', borderRadius: 2 }}/>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Released {m.year}</div>
                </div>
              </div>
              {REPAIR_ISSUES.map(i => (
                <div key={i.id} style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--ink-3)' }}>
                    <span>₹</span>
                    <input
                      value={getPrice(m.id, i.id)}
                      onChange={e => setPrice(m.id, i.id, +e.target.value.replace(/\D/g, '') || 0)}
                      style={{
                        width: 80, padding: '6px 8px', border: '1px solid transparent',
                        borderRadius: 6, background: 'transparent', textAlign: 'right',
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                        fontVariantNumeric: 'tabular-nums', color: 'var(--ink)', fontWeight: 600,
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--ink)'}
                      onBlur={e => e.target.style.borderColor = 'transparent'}
                    />
                  </div>
                </div>
              ))}
              <button className="btn btn-icon btn-ghost" onClick={() => removeModel(m.id)} title="Remove this phone">
                <Icon name="close" size={13} color="var(--ink-4)"/>
              </button>
            </div>
          ))}
        </div>

        {/* Help footer */}
        <div style={{ padding: 16, borderTop: '1px solid var(--line)', background: 'var(--bg-soft)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="sparkle" size={16} color="var(--accent)"/>
          <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>
            <b>Tip · </b>
            When a new phone launches (like the iPhone 16), just click <b>Add a phone model</b>. You can set the screen, battery, back glass and charging port repair prices in one place. Changes save automatically and show on your website.
          </div>
        </div>
      </div>

      {/* Add brand modal */}
      {addBrandOpen && (
        <Modal title="Add a new brand"
          onClose={() => setAddBrandOpen(false)}
          footer={<>
            <button className="btn" onClick={() => setAddBrandOpen(false)}>Cancel</button>
            <button className="btn btn-dark" onClick={addBrand}>Save brand</button>
          </>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 6, fontWeight: 500 }}>Brand name</div>
              <input className="input" autoFocus value={newBrand.name} onChange={e => setNewBrand({ ...newBrand, name: e.target.value })} placeholder="e.g. Tecno"/>
            </label>
            <label>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 6, fontWeight: 500 }}>Short letter (for icon)</div>
              <input className="input" value={newBrand.glyph} onChange={e => setNewBrand({ ...newBrand, glyph: e.target.value.slice(0, 2) })} placeholder="T" maxLength={2} style={{ maxWidth: 100 }}/>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>Just 1 or 2 letters — like "S" for Samsung.</div>
            </label>
          </div>
        </Modal>
      )}

      {/* Add model modal */}
      {addModelOpen && (
        <Modal title={`Add a new ${sel.name} phone`}
          onClose={() => setAddModelOpen(false)}
          footer={<>
            <button className="btn" onClick={() => setAddModelOpen(false)}>Cancel</button>
            <button className="btn btn-dark" onClick={addModel}>Save phone</button>
          </>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 6, fontWeight: 500 }}>Phone name</div>
              <input className="input" autoFocus value={newModel.name} onChange={e => setNewModel({ ...newModel, name: e.target.value })} placeholder={`e.g. ${sel.name} 16 Pro`}/>
            </label>
            <label>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 6, fontWeight: 500 }}>Release year</div>
              <input className="input" type="number" value={newModel.year} onChange={e => setNewModel({ ...newModel, year: e.target.value })} style={{ maxWidth: 140 }}/>
            </label>
            <div style={{ background: 'var(--bg-soft)', borderRadius: 8, padding: 12, fontSize: 12, color: 'var(--ink-2)' }}>
              We'll automatically set the standard repair prices. You can change them after saving.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── Customers ───────────────────────────────────────────────────────────
const Customers = () => {
  const [search, setSearch] = aUS('');
  const filtered = cCUST.filter(c => (c.name + c.phone).toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div className="input-group" style={{ maxWidth: 280 }}>
          <Icon name="search" size={14} color="var(--ink-3)"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone…"/>
        </div>
      </div>
      <div className="panel" style={{ overflow: 'hidden' }}>
        <div className="scroll-x">
          <table className="tbl">
            <thead>
              <tr>
                <th>Name</th><th>Phone number</th>
                <th style={{ textAlign: 'right' }}>Visits</th>
                <th style={{ textAlign: 'right' }}>Total spend</th>
                <th>Last visit</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar">{c.name.split(' ').map(p => p[0]).join('').slice(0, 2)}</div>
                      <b>{c.name}</b>
                    </div>
                  </td>
                  <td className="mono" style={{ fontSize: 12 }}>+91 {c.phone}</td>
                  <td className="mono" style={{ textAlign: 'right' }}>{c.visits}</td>
                  <td className="mono" style={{ textAlign: 'right', fontWeight: 600 }}>{cINR(c.spend)}</td>
                  <td style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.last}</td>
                  <td>
                    <a href={'tel:+91' + c.phone.replace(/\s/g, '')} className="btn btn-icon">
                      <Icon name="phone-call" size={13}/>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

window.AdminCatalog = { PhonesAndPrices, Customers };
