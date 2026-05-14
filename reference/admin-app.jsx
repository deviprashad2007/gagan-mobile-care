// Admin app — 5 simple pages.
const ASidebar = window.AdminShell.Sidebar;
const ATopBar = window.AdminShell.TopBar;
const AToday = window.AdminToday.Today;
const ABookings = window.AdminLeads.Bookings;
const ARepairs = window.AdminLeads.Repairs;
const APhones = window.AdminCatalog.PhonesAndPrices;
const ACustomers = window.AdminCatalog.Customers;
const ANewBookingModal = window.AdminMisc.NewBookingModal;

const AdminApp = () => {
  const [active, setActive] = aUS('today');
  const [newOpen, setNewOpen] = aUS(false);

  const { LEADS, REPAIRS } = window.GMC_ADMIN;
  const counts = {
    bookings: LEADS.filter(l => l.status === 'new').length,
    repairs:  REPAIRS.filter(r => r.status === 'ready').length,
  };

  const handleCreate = (data) => {
    console.log('Created booking', data);
    setActive('bookings');
  };

  let view;
  switch (active) {
    case 'today':     view = <AToday goTo={setActive}/>; break;
    case 'bookings':  view = <ABookings/>; break;
    case 'repairs':   view = <ARepairs/>; break;
    case 'phones':    view = <APhones/>; break;
    case 'customers': view = <ACustomers/>; break;
    default:          view = <AToday goTo={setActive}/>;
  }

  return (
    <div className="admin-layout">
      <ASidebar active={active} setActive={setActive} counts={counts}/>
      <div className="admin-main">
        <ATopBar active={active} onNewBooking={() => setNewOpen(true)}/>
        <div className="admin-content">{view}</div>
      </div>
      {newOpen && <ANewBookingModal onClose={() => setNewOpen(false)} onCreate={handleCreate}/>}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp/>);
