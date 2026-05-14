// Mock data for the simplified shop dashboard.

const LEAD_STATUSES = [
  { id: 'new',     label: 'New',     tone: '#E63329' },
  { id: 'called',  label: 'Called',  tone: '#0A66C2' },
  { id: 'booked',  label: 'Booked',  tone: '#22A06B' },
  { id: 'lost',    label: 'Lost',    tone: '#A8A8A8' },
];

const REPAIR_STATUSES = [
  { id: 'received', label: 'Received',     tone: '#A8A8A8' },
  { id: 'working',  label: 'Working on it',tone: '#E63329' },
  { id: 'ready',    label: 'Ready',        tone: '#22A06B' },
  { id: 'picked',   label: 'Picked up',    tone: '#0A0A0A' },
];

const LEADS = [
  { id: 'B-1023', name: 'Aarav Sharma',    phone: '98765 43210', model: 'iPhone 14 Pro',     issue: 'Cracked screen',        price: 8499,  status: 'new',    method: 'walkin', time: '10:24 AM' },
  { id: 'B-1022', name: 'Priya Mehta',     phone: '99220 18374', model: 'Pixel 7',           issue: 'Charging port loose',   price: 999,   status: 'new',    method: 'post',   time: '09:18 AM' },
  { id: 'B-1021', name: 'Rahul Khanna',    phone: '98123 65432', model: 'Nothing Phone (2)', issue: 'Speaker not working',   price: 1099,  status: 'new',    method: 'walkin', time: '08:42 AM' },
  { id: 'B-1020', name: 'Manish Kumar',    phone: '98113 22311', model: 'Redmi Note 13 Pro+',issue: 'Screen + back camera',  price: 5499,  status: 'new',    method: 'walkin', time: '08:10 AM' },
  { id: 'B-1019', name: 'Rohini Subbaiah', phone: '98201 45667', model: 'Galaxy S22',        issue: 'Battery drain',         price: 1899,  status: 'called', method: 'post',   time: 'Yesterday' },
  { id: 'B-1018', name: 'Sahil Joshi',     phone: '99110 22938', model: 'OnePlus 9',         issue: 'Battery swelling',      price: 1799,  status: 'booked', method: 'walkin', time: 'Yesterday' },
  { id: 'B-1017', name: 'Kavya Reddy',     phone: '98444 91823', model: 'iPhone 13',         issue: 'Back glass cracked',    price: 3299,  status: 'booked', method: 'post',   time: 'Yesterday' },
  { id: 'B-1016', name: 'Devika Iyer',     phone: '90034 87156', model: 'iPhone 15 Pro Max', issue: 'Back glass + charging', price: 6499,  status: 'lost',   method: 'post',   time: '2 days ago' },
];

const REPAIRS = [
  { id: 'R-2041', cust: 'Anita R.',     phone: '98201 13456', model: 'iPhone 13 Pro',     issue: 'Screen',          status: 'working',  amount: 7499,  intake: 'Today, 8:30 AM',  eta: 'Today, 11:30 AM' },
  { id: 'R-2040', cust: 'Sania Khan',   phone: '99887 22345', model: 'Galaxy S24',        issue: 'Screen + back',   status: 'working',  amount: 11999, intake: 'Today, 7:45 AM',  eta: 'Today, 1:00 PM' },
  { id: 'R-2039', cust: 'Joel Mathew',  phone: '95437 81203', model: 'Pixel 8 Pro',       issue: 'Battery',         status: 'working',  amount: 2299,  intake: 'Today, 9:10 AM',  eta: 'Today, 4:00 PM' },
  { id: 'R-2038', cust: 'Naveen S.',    phone: '94321 87765', model: 'iPhone 12',         issue: 'Water damage',    status: 'working',  amount: 4299,  intake: 'Today, 8:00 AM',  eta: 'Tomorrow' },
  { id: 'R-2037', cust: 'Pradeep V.',   phone: '98654 33212', model: 'OnePlus 11',        issue: 'Charging port',   status: 'ready',    amount: 999,   intake: 'Yesterday',       eta: 'Ready now' },
  { id: 'R-2036', cust: 'Geeta L.',     phone: '98112 87654', model: 'Galaxy A54',        issue: 'Screen',          status: 'ready',    amount: 3499,  intake: 'Yesterday',       eta: 'Ready now' },
  { id: 'R-2035', cust: 'Sameer T.',    phone: '98654 99211', model: 'iPhone 15 Pro',     issue: 'Screen + battery',status: 'ready',    amount: 12499, intake: 'Today, 7:00 AM',  eta: 'Ready now' },
  { id: 'R-2034', cust: 'Renu Saxena',  phone: '99220 11923', model: 'iPhone 14 Pro Max', issue: 'Back glass',      status: 'received', amount: 3999,  intake: 'Today, 10:15 AM', eta: 'Wed' },
  { id: 'R-2033', cust: 'Lalit P.',     phone: '98212 33445', model: 'Vivo X90',          issue: 'Power button',    status: 'received', amount: 799,   intake: 'Today, 10:20 AM', eta: 'Today, 3:00 PM' },
  { id: 'R-2032', cust: 'Mona Desai',   phone: '93428 17655', model: 'Nothing Phone (2a)',issue: 'Battery',         status: 'picked',   amount: 1299,  intake: 'Yesterday',       eta: 'Done' },
  { id: 'R-2031', cust: 'Tanvi Kapoor', phone: '99880 11192', model: 'iPhone 14',         issue: 'Camera',          status: 'picked',   amount: 3699,  intake: 'Yesterday',       eta: 'Done' },
];

const CUSTOMERS = [
  { id: 'C-091', name: 'Aarav Sharma',    phone: '98765 43210', visits: 3, spend: 14299, last: 'Today' },
  { id: 'C-078', name: 'Priya Mehta',     phone: '99220 18374', visits: 1, spend: 999,   last: 'Today' },
  { id: 'C-066', name: 'Rohini Subbaiah', phone: '98201 45667', visits: 2, spend: 9499,  last: 'Yesterday' },
  { id: 'C-054', name: 'Sahil Joshi',     phone: '99110 22938', visits: 4, spend: 18999, last: 'Yesterday' },
  { id: 'C-042', name: 'Kavya Reddy',     phone: '98444 91823', visits: 1, spend: 3299,  last: '2 days ago' },
  { id: 'C-033', name: 'Vikram Singh',    phone: '99887 12390', visits: 2, spend: 11998, last: '3 days ago' },
  { id: 'C-028', name: 'Manish Kumar',    phone: '98113 22311', visits: 5, spend: 24111, last: '4 days ago' },
];

window.GMC_ADMIN = { LEAD_STATUSES, REPAIR_STATUSES, LEADS, REPAIRS, CUSTOMERS };
