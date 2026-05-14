// Domain data for the booking flow

const BRANDS = [
  { id: 'apple',     name: 'Apple',     glyph: 'A', tone: '#0E0E10' },
  { id: 'samsung',   name: 'Samsung',   glyph: 'S', tone: '#1428A0' },
  { id: 'oneplus',   name: 'OnePlus',   glyph: '1+', tone: '#EB0029' },
  { id: 'xiaomi',    name: 'Xiaomi',    glyph: 'Mi', tone: '#FF6900' },
  { id: 'realme',    name: 'Realme',    glyph: 'R', tone: '#FFC915' },
  { id: 'vivo',      name: 'Vivo',      glyph: 'V', tone: '#415FFF' },
  { id: 'oppo',      name: 'Oppo',      glyph: 'O', tone: '#1BA94C' },
  { id: 'pixel',     name: 'Google Pixel', glyph: 'G', tone: '#4285F4' },
  { id: 'motorola',  name: 'Motorola',  glyph: 'M', tone: '#5C92FA' },
  { id: 'nothing',   name: 'Nothing',   glyph: '·', tone: '#0E0E10' },
  { id: 'iqoo',      name: 'iQOO',      glyph: 'iQ', tone: '#1F2A66' },
  { id: 'poco',      name: 'Poco',      glyph: 'P', tone: '#E8C500' },
  { id: 'honor',     name: 'Honor',     glyph: 'H', tone: '#0066FF' },
  { id: 'asus',      name: 'Asus',      glyph: 'A', tone: '#1A4FA0' },
  { id: 'infinix',   name: 'Infinix',   glyph: 'iN', tone: '#0F3CA0' },
];

const MODELS = {
  apple: [
    { series: 'iPhone 15 Series', items: [
      { id: 'i15pm', name: 'iPhone 15 Pro Max', year: 2023 },
      { id: 'i15p',  name: 'iPhone 15 Pro',     year: 2023 },
      { id: 'i15+',  name: 'iPhone 15 Plus',    year: 2023 },
      { id: 'i15',   name: 'iPhone 15',         year: 2023 },
    ]},
    { series: 'iPhone 14 Series', items: [
      { id: 'i14pm', name: 'iPhone 14 Pro Max', year: 2022 },
      { id: 'i14p',  name: 'iPhone 14 Pro',     year: 2022 },
      { id: 'i14',   name: 'iPhone 14',         year: 2022 },
    ]},
    { series: 'iPhone 13 Series', items: [
      { id: 'i13pm', name: 'iPhone 13 Pro Max', year: 2021 },
      { id: 'i13',   name: 'iPhone 13',         year: 2021 },
      { id: 'i13m',  name: 'iPhone 13 mini',    year: 2021 },
    ]},
    { series: 'iPhone 12 Series', items: [
      { id: 'i12p',  name: 'iPhone 12 Pro',     year: 2020 },
      { id: 'i12',   name: 'iPhone 12',         year: 2020 },
    ]},
  ],
  samsung: [
    { series: 'Galaxy S24 Series', items: [
      { id: 's24u', name: 'Galaxy S24 Ultra', year: 2024 },
      { id: 's24+', name: 'Galaxy S24+',      year: 2024 },
      { id: 's24',  name: 'Galaxy S24',       year: 2024 },
    ]},
    { series: 'Galaxy S23 Series', items: [
      { id: 's23u', name: 'Galaxy S23 Ultra', year: 2023 },
      { id: 's23',  name: 'Galaxy S23',       year: 2023 },
    ]},
    { series: 'Galaxy A Series', items: [
      { id: 'a54',  name: 'Galaxy A54 5G',    year: 2023 },
      { id: 'a34',  name: 'Galaxy A34 5G',    year: 2023 },
    ]},
  ],
  oneplus: [
    { series: 'OnePlus 12 Series', items: [
      { id: 'op12',  name: 'OnePlus 12',     year: 2024 },
      { id: 'op12r', name: 'OnePlus 12R',    year: 2024 },
    ]},
    { series: 'OnePlus 11 Series', items: [
      { id: 'op11',  name: 'OnePlus 11',     year: 2023 },
    ]},
    { series: 'Nord Series', items: [
      { id: 'nord3', name: 'OnePlus Nord 3', year: 2023 },
      { id: 'nordce', name: 'Nord CE 3 Lite', year: 2023 },
    ]},
  ],
  xiaomi: [
    { series: 'Xiaomi 14 Series', items: [
      { id: 'x14',   name: 'Xiaomi 14',       year: 2024 },
      { id: 'x14u',  name: 'Xiaomi 14 Ultra', year: 2024 },
    ]},
    { series: 'Redmi Note Series', items: [
      { id: 'rn13p', name: 'Redmi Note 13 Pro+', year: 2024 },
      { id: 'rn13',  name: 'Redmi Note 13',     year: 2024 },
    ]},
  ],
  realme: [
    { series: 'Realme GT Series', items: [
      { id: 'gt5',  name: 'Realme GT 5 Pro',  year: 2024 },
      { id: 'gtne', name: 'Realme GT Neo 5',  year: 2023 },
    ]},
    { series: 'Number Series', items: [
      { id: 'r12p', name: 'Realme 12 Pro+',   year: 2024 },
      { id: 'r12',  name: 'Realme 12',        year: 2024 },
    ]},
  ],
  vivo: [{ series: 'X Series', items: [
    { id: 'vx100', name: 'Vivo X100 Pro', year: 2024 },
    { id: 'vx90',  name: 'Vivo X90',      year: 2023 },
  ]}],
  oppo: [{ series: 'Find Series', items: [
    { id: 'find7', name: 'Oppo Find X7', year: 2024 },
    { id: 'reno11', name: 'Oppo Reno 11 Pro', year: 2024 },
  ]}],
  pixel: [{ series: 'Pixel', items: [
    { id: 'p8p', name: 'Pixel 8 Pro', year: 2023 },
    { id: 'p8',  name: 'Pixel 8',     year: 2023 },
    { id: 'p7a', name: 'Pixel 7a',    year: 2023 },
  ]}],
  motorola: [{ series: 'Edge Series', items: [
    { id: 'edge50', name: 'Edge 50 Pro', year: 2024 },
    { id: 'g84',    name: 'Moto G84',    year: 2023 },
  ]}],
  nothing: [{ series: 'Phone Series', items: [
    { id: 'np2',  name: 'Nothing Phone (2)',  year: 2023 },
    { id: 'np2a', name: 'Nothing Phone (2a)', year: 2024 },
  ]}],
  iqoo: [{ series: 'Number Series', items: [
    { id: 'iq12', name: 'iQOO 12', year: 2023 },
    { id: 'iqn9', name: 'iQOO Neo 9 Pro', year: 2024 },
  ]}],
  poco: [{ series: 'F & X Series', items: [
    { id: 'pf6',  name: 'Poco F6 Pro', year: 2024 },
    { id: 'px6',  name: 'Poco X6 Pro', year: 2024 },
  ]}],
  honor: [{ series: 'Magic Series', items: [
    { id: 'hm6p', name: 'Honor Magic 6 Pro', year: 2024 },
  ]}],
  asus: [{ series: 'ROG / Zenfone', items: [
    { id: 'rog8', name: 'ROG Phone 8 Pro', year: 2024 },
    { id: 'zen10', name: 'Zenfone 10', year: 2023 },
  ]}],
  infinix: [{ series: 'Note / Zero', items: [
    { id: 'n40p', name: 'Infinix Note 40 Pro', year: 2024 },
    { id: 'z30', name: 'Infinix Zero 30', year: 2023 },
  ]}],
};

const ISSUES = [
  { id: 'screen',    name: 'Screen / Display',  desc: 'Cracked, black, lines, touch issues',  range: [1499, 12999], common: true },
  { id: 'battery',   name: 'Battery',           desc: 'Quick drain, overheating, swelling',   range: [799, 4499],   common: true },
  { id: 'charging',  name: 'Charging Port',     desc: 'Loose, slow or no charging',           range: [499, 1799] },
  { id: 'fcam',      name: 'Front Camera',      desc: 'Blurry, black, autofocus failure',     range: [899, 3999] },
  { id: 'bcam',      name: 'Back Camera',       desc: 'Cracked lens, focus, distortion',      range: [1299, 5999], common: true },
  { id: 'speaker',   name: 'Speaker',           desc: 'No sound, distortion, low volume',     range: [499, 1999] },
  { id: 'mic',       name: 'Microphone',        desc: 'Not picking voice on calls',           range: [499, 1499] },
  { id: 'water',     name: 'Water Damage',      desc: 'Liquid contact, no power',             range: [1999, 8999] },
  { id: 'back',      name: 'Back Glass',        desc: 'Cracked rear panel',                   range: [999, 4999] },
  { id: 'software',  name: 'Software',          desc: 'Stuck, boot loops, slow',              range: [299, 999] },
  { id: 'power',     name: 'Power Button',      desc: 'Stuck, unresponsive',                  range: [499, 1499] },
  { id: 'volume',    name: 'Volume Button',     desc: 'Stuck or not working',                 range: [399, 1299] },
  { id: 'other',     name: 'Other',             desc: 'Tell us in the call',                  range: [299, 4999] },
];

const formatINR = (n) => '₹' + n.toLocaleString('en-IN');

window.GAGAN_DATA = { BRANDS, MODELS, ISSUES, formatINR };
