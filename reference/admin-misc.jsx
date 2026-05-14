// Simple New Booking modal — for walk-ins or phone enquiries.

const NewBookingModal = ({ onClose, onCreate }) => {
  const [data, setData] = aUS({ name: '', phone: '', model: '', issue: 'Screen', method: 'walkin', price: '' });
  const valid = data.name && data.phone && data.model;
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Add a new booking</h3>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>For walk-ins or phone enquiries.</div>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><Icon name="close" size={14}/></button>
        </div>
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 6, fontWeight: 500 }}>Customer name</div>
              <input className="input" autoFocus value={data.name} onChange={e => setData({ ...data, name: e.target.value })} placeholder="Full name"/>
            </label>
            <label>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 6, fontWeight: 500 }}>Phone number</div>
              <div className="input-group">
                <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>+91</span>
                <input value={data.phone} onChange={e => setData({ ...data, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="98765 43210"/>
              </div>
            </label>
            <label>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 6, fontWeight: 500 }}>Phone model</div>
              <input className="input" value={data.model} onChange={e => setData({ ...data, model: e.target.value })} placeholder="e.g. iPhone 14 Pro"/>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <label>
                <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 6, fontWeight: 500 }}>What's the issue?</div>
                <select className="input" value={data.issue} onChange={e => setData({ ...data, issue: e.target.value })}>
                  {['Screen', 'Battery', 'Charging port', 'Back glass', 'Camera', 'Speaker', 'Water damage', 'Other'].map(o => <option key={o}>{o}</option>)}
                </select>
              </label>
              <label>
                <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 6, fontWeight: 500 }}>How did they reach you?</div>
                <select className="input" value={data.method} onChange={e => setData({ ...data, method: e.target.value })}>
                  <option value="walkin">Walked in</option>
                  <option value="post">Will send by post</option>
                </select>
              </label>
            </div>
            <label>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 6, fontWeight: 500 }}>Estimated price (optional)</div>
              <div className="input-group" style={{ maxWidth: 200 }}>
                <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>₹</span>
                <input value={data.price} onChange={e => setData({ ...data, price: e.target.value.replace(/\D/g, '') })} placeholder="1499"/>
              </div>
            </label>
          </div>
        </div>
        <div style={{ padding: 16, borderTop: '1px solid var(--line)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-dark" disabled={!valid} onClick={() => { onCreate(data); onClose(); }} style={{ opacity: valid ? 1 : .5 }}>
            Save booking <Icon name="check" size={13} color="#fff"/>
          </button>
        </div>
      </div>
    </div>
  );
};

window.AdminMisc = { NewBookingModal };
