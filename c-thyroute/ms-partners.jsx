// ms-partners.jsx — Miles&Smiles rota entegrasyonu
//
// Provides:
//   MS_CATEGORIES         — 5 kategori (konaklama / arac / finans / vip / yemeIcme)
//   MS_PARTNERS           — { destCode: [{ id, cat, brand, name, offer, miles, x, y }, ...] }
//   getMSPartners(code)   — bir destinasyon kodu için partner listesi
//   getMSPartnersBy(code, cat?) — kategoriye göre filtrelenmiş
//   isMSPartner(id)       — POI id'si M&S partner mı (id 'ms_' ile başlar)
//   <MSMapToggle>         — harita üzeri altın toggle butonu
//   <MSReservationCTA>    — POI flyout içinde "Rezervasyon" satırı
//   <MSGroupedList>       — Keşfet'te kategori başlıklı grup listesi
//
// Veri jenerik — gerçek M&S API'sine bağlanacakmış gibi yapılandırılmış.
// Her partnerin x/y (0-100) koordinatları mevcut poiLatLon() ile uyumlu.

const MS_CATEGORIES = [
  { id: 'stay',            icon: '🏨', tr: 'Konaklama',          en: 'Stays',           color: '#0053A5' },
  { id: 'car',             icon: '🚗', tr: 'Araç Kiralama',      en: 'Car Rental',      color: '#5B6770' },
  { id: 'vip',             icon: '🚘', tr: 'VIP Transfer',       en: 'VIP Transfer',    color: '#0A1628' },
  { id: 'lounge',          icon: '🛋', tr: 'Lounge',             en: 'Lounge',          color: '#7A4988' },
  { id: 'travel_services', icon: '📶', tr: 'Seyahat Hizmetleri', en: 'Travel Services', color: '#2A8FB0' },
  { id: 'finance',         icon: '💳', tr: 'Finans',             en: 'Finance',         color: '#1A8E5A' },
  { id: 'dining',          icon: '🍽',  tr: 'Yeme & İçme',        en: 'Dining',          color: '#B7312C' },
];

// helper to declare one partner concisely
const msp = (id, cat, brand, name, offer, miles, x, y, logo) => ({
  id: 'ms_' + id, cat, brand, name, offer, miles, x, y, logo: logo || null, isMS: true,
});

// Generic-but-believable fallbacks. Each city gets a curated set so the map feels
// hand-tuned (5–10 pins per destination, well distributed across categories).
const PROGO_LOGO = 'assets/progo-logo.png';

const MS_PARTNERS = {
  // ─── FCO · Roma ───────────────────────────────────────────
  FCO: [
    msp('mb-rome-park',    'stay',            'Marriott Bonvoy', 'Rome Marriott Park Hotel',              'Konaklama başına 600 Mil',     '600',  44, 58),
    msp('hh-rome-airport', 'stay',            'Hilton Honors',   'Hilton Rome Airport',                   'Konaklama başına 500 Mil',     '500',  46, 64),
    msp('all-rome',        'stay',            'ALL · Accor',     'Sofitel Roma Villa Borghese',           '%15 + 550 Mil/gece',           '550',  56, 36),
    msp('ihg-rome',        'stay',            'IHG One Rewards', 'InterContinental Rome Ambasciatori',    'Konaklama başına 650 Mil',     '650',  52, 42),
    msp('book-rome',       'stay',            'Booking.com',     'Trastevere Boutique · Booking',         '%5 mil iadesi · 400 Mil/gece', '400',  60, 50),
    msp('rocket-rome',     'stay',            'Rocketmiles',     'Rocketmiles · Roma seçkisi',            'Rezervasyon başına 1.500 Mil', '1500', 38, 52),
    msp('avis-fco',        'car',             'Avis',            'Avis · FCO Havalimanı',                 'Min. 125 Mil/kiralama',        '125',  48, 66),
    msp('sixt-fco',        'car',             'Sixt',            'Sixt · Termini İstasyonu',              'Min. 150 Mil/kiralama',        '150',  58, 44),
    msp('progo-fco',       'vip',             'ProGo',           'ProGo VIP Transfer · FCO ↔ Şehir',      'Tek yön 1.200 Mil',            '1200', 49, 68, PROGO_LOGO),
    msp('plaza-fco',       'lounge',          'Plaza Premium',   'Plaza Premium Lounge · FCO Terminal 3', 'Lounge başına 400 Mil',        '400',  47, 70),
    msp('wifi-fco',        'travel_services', 'Airport WiFi Rentals', 'Pocket WiFi · FCO Pickup',          'Kiralama başına 100 Mil',      '100',  50, 68),
    msp('garanti-fco',     'finance',         'Garanti BBVA',    'Bonus Miles ATM · Termini',             'Her 5 TL = 1 Mil',             '—',    62, 56),
    msp('divan-fco',       'dining',          'Divan',           'Divan Brasserie Roma',                  '%10 + 200 Mil/menü',           '200',  56, 41),
  ],
  // ─── NRT · Tokyo ──────────────────────────────────────────
  NRT: [
    msp('mb-tyo',          'stay',            'Marriott Bonvoy', 'Tokyo Marriott Hotel · Shinagawa',      'Konaklama başına 700 Mil',     '700',  48, 53),
    msp('hh-tyo',          'stay',            'Hilton Honors',   'Hilton Tokyo Odaiba',                   'Konaklama başına 550 Mil',     '550',  60, 58),
    msp('ihg-tyo',         'stay',            'IHG One Rewards', 'InterContinental Tokyo Bay',            'Konaklama başına 700 Mil',     '700',  62, 52),
    msp('all-tyo',         'stay',            'ALL · Accor',     'Pullman Tokyo Tamachi',                 '%15 + 500 Mil/gece',           '500',  54, 48),
    msp('rocket-tyo',      'stay',            'Rocketmiles',     'Rocketmiles · Tokyo seçkisi',           'Rezervasyon başına 1.800 Mil', '1800', 50, 44),
    msp('kaligo-tyo',      'stay',            'Kaligo',          'Kaligo · Aman Tokyo',                   'Rezervasyon başına 2.000 Mil', '2000', 46, 50),
    msp('avis-nrt',        'car',             'Avis',            'Avis · Narita Havalimanı',              'Min. 200 Mil/kiralama',        '200',  50, 64),
    msp('sixt-tyo',        'car',             'Sixt',            'Sixt · Shibuya',                        'Min. 180 Mil/kiralama',        '180',  56, 51),
    msp('progo-nrt',       'vip',             'ProGo',           'ProGo VIP Transfer · NRT ↔ Otel',       'Tek yön 1.800 Mil',            '1800', 45, 67, PROGO_LOGO),
    msp('plaza-nrt',       'lounge',          'Plaza Premium',   'Plaza Premium Lounge · NRT Terminal 2', 'Lounge başına 500 Mil',        '500',  48, 66),
    msp('wifi-nrt',        'travel_services', 'Airport WiFi Rentals', 'Pocket WiFi · NRT Pickup',          'Kiralama başına 150 Mil',      '150',  51, 65),
    msp('garanti-tyo',     'finance',         'Garanti BBVA',    'Bonus Worldwide',                       'Her 5 TL = 1,5 Mil (yurt dışı)','—',   52, 56),
    msp('divan-tyo',       'dining',          'İstanbul Sofrası','Türk Restoranı · Roppongi',             '%15 + 300 Mil/kişi',           '300',  58, 49),
  ],
  // ─── BCN · Barcelona ──────────────────────────────────────
  BCN: [
    msp('mb-bcn',          'stay',            'Marriott Bonvoy', 'AC Hotel Barcelona Forum',              'Konaklama başına 600 Mil',     '600',  60, 50),
    msp('hh-bcn',          'stay',            'Hilton Honors',   'Hilton Diagonal Mar',                   'Konaklama başına 500 Mil',     '500',  62, 48),
    msp('all-bcn',         'stay',            'ALL · Accor',     'Sofitel Barcelona Skipper',             '%15 + 600 Mil/gece',           '600',  56, 52),
    msp('ihg-bcn',         'stay',            'IHG One Rewards', 'InterContinental Barcelona',            'Konaklama başına 650 Mil',     '650',  48, 44),
    msp('book-bcn',        'stay',            'Booking.com',     'Gotik Bölge Boutique · Booking',        '%5 mil iadesi · 400 Mil/gece', '400',  52, 47),
    msp('kaligo-bcn',      'stay',            'Kaligo',          'Kaligo · Hotel Arts Barcelona',         'Rezervasyon başına 1.800 Mil', '1800', 54, 42),
    msp('avis-bcn',        'car',             'Avis',            'Avis · El Prat Havalimanı',             'Min. 125 Mil/kiralama',        '125',  36, 66),
    msp('enter-bcn',       'car',             'Enterprise',      'Enterprise · Sants İstasyonu',          'Min. 130 Mil/kiralama',        '130',  44, 56),
    msp('progo-bcn',       'vip',             'ProGo',           'ProGo VIP Transfer · El Prat ↔ Şehir',  'Tek yön 950 Mil',              '950',  40, 64, PROGO_LOGO),
    msp('plaza-bcn',       'lounge',          'Plaza Premium',   'Plaza Premium Lounge · BCN Terminal 1', 'Lounge başına 400 Mil',        '400',  38, 68),
    msp('wifi-bcn',        'travel_services', 'Airport WiFi Rentals', 'Pocket WiFi · BCN Pickup',          'Kiralama başına 100 Mil',      '100',  40, 66),
    msp('garanti-bcn',     'finance',         'Garanti BBVA',    'Bonus Worldwide',                       'Her 5 TL = 1 Mil',             '—',    54, 50),
    msp('tapas-bcn',       'dining',          'Cal Pep',         'Premium Tapas · El Born',               '%15 + 250 Mil',                '250',  52, 46),
  ],
  // ─── AYT · Antalya ────────────────────────────────────────
  AYT: [
    msp('rixos-ayt',       'stay',            'Rixos Hotels',    'Rixos Premium Belek',                   'Konaklama başına 700 Mil',     '700',  64, 60),
    msp('mb-ayt',          'stay',            'Marriott Bonvoy', 'Le Méridien Antalya',                   'Konaklama başına 600 Mil',     '600',  46, 54),
    msp('hh-ayt',          'stay',            'Hilton Honors',   'Hilton Dalaman Resort & Spa',           'Konaklama başına 500 Mil',     '500',  42, 58),
    msp('all-ayt',         'stay',            'ALL · Accor',     'Swissôtel Çamyuva Beach',               '%15 + 550 Mil/gece',           '550',  68, 62),
    msp('halal-ayt',       'stay',            'HalalBooking',    'HalalBooking · Lara Premium',           'Rezervasyon başına 700 Mil',   '700',  56, 56),
    msp('book-ayt',        'stay',            'Booking.com',     'Kaleiçi Butik · Booking',               '%5 mil iadesi · 350 Mil/gece', '350',  50, 50),
    msp('avis-ayt',        'car',             'Avis',            'Avis · AYT Havalimanı',                 'Min. 100 Mil/kiralama',        '100',  38, 64),
    msp('budget-ayt',      'car',             'Budget',          'Budget · Lara Şubesi',                  'Min. 110 Mil/kiralama',        '110',  52, 58),
    msp('progo-ayt',       'vip',             'ProGo',           'ProGo VIP Transfer · AYT ↔ Otel',       'Tek yön 600 Mil',              '600',  40, 60, PROGO_LOGO),
    msp('plaza-ayt',       'lounge',          'Plaza Premium',   'Plaza Premium Lounge · AYT Domestic',   'Lounge başına 350 Mil',        '350',  36, 62),
    msp('wifi-ayt',        'travel_services', 'Airport WiFi Rentals', 'Pocket WiFi · AYT Pickup',          'Kiralama başına 80 Mil',       '80',   38, 64),
    msp('garanti-ayt',     'finance',         'Garanti BBVA',    'Bonus Miles ATM',                       'Her 5 TL = 1 Mil',             '—',    46, 50),
    msp('7mehmet-ayt',     'dining',          '7 Mehmet',        'Geleneksel Türk Mutfağı',               '%10 + 200 Mil',                '200',  56, 48),
  ],
  // ─── __GENERIC__ · fallback (her markadan en az 1) ────────
  __GENERIC__: [
    msp('mb-gen',          'stay',            'Marriott Bonvoy', 'Marriott City Center',                  'Konaklama başına 600 Mil',     '600',  46, 44),
    msp('hh-gen',          'stay',            'Hilton Honors',   'Hilton Premium',                        'Konaklama başına 500 Mil',     '500',  52, 48),
    msp('all-gen',         'stay',            'ALL · Accor',     'Sofitel Premium',                       '%15 + 550 Mil/gece',           '550',  58, 42),
    msp('rixos-gen',       'stay',            'Rixos Hotels',    'Rixos Resort',                          'Konaklama başına 700 Mil',     '700',  40, 48),
    msp('ihg-gen',         'stay',            'IHG One Rewards', 'InterContinental',                      'Konaklama başına 650 Mil',     '650',  44, 50),
    msp('book-gen',        'stay',            'Booking.com',     'Booking Partner Otel',                  '%5 mil iadesi',                '400',  60, 50),
    msp('rocket-gen',      'stay',            'Rocketmiles',     'Rocketmiles · Mil Avantajlı',           'Rezervasyon başına 1.500 Mil', '1500', 54, 36),
    msp('halal-gen',       'stay',            'HalalBooking',    'HalalBooking · Halal Friendly',         'Rezervasyon başına 600 Mil',   '600',  62, 40),
    msp('kaligo-gen',      'stay',            'Kaligo',          'Kaligo · Lüks Miller',                  'Rezervasyon başına 1.800 Mil', '1800', 48, 38),
    msp('avis-gen',        'car',             'Avis',            'Avis · Havalimanı Şubesi',              'Min. 125 Mil/kiralama',        '125',  44, 62),
    msp('budget-gen',      'car',             'Budget',          'Budget · Şehir Merkezi',                'Min. 110 Mil/kiralama',        '110',  48, 58),
    msp('enter-gen',       'car',             'Enterprise',      'Enterprise · Tren Garı',                'Min. 130 Mil/kiralama',        '130',  56, 60),
    msp('sixt-gen',        'car',             'Sixt',            'Sixt · Premium Filo',                   'Min. 140 Mil/kiralama',        '140',  60, 56),
    msp('progo-gen',       'vip',             'ProGo',           'ProGo VIP Transfer',                    'Tek yön 950 Mil',              '950',  40, 65, PROGO_LOGO),
    msp('plaza-gen',       'lounge',          'Plaza Premium',   'Plaza Premium Lounge · Havalimanı',     'Lounge başına 400 Mil',        '400',  42, 66),
    msp('wifi-gen',        'travel_services', 'Airport WiFi Rentals', 'Pocket WiFi · Havalimanı Pickup',   'Kiralama başına 100 Mil',      '100',  50, 64),
    msp('garanti-gen',     'finance',         'Garanti BBVA',    'Bonus Miles ATM',                       'Her 5 TL = 1 Mil',             '—',    62, 56),
    msp('divan-gen',       'dining',          'Divan',           'Divan Brasserie',                       '%10 + 200 Mil/menü',           '200',  54, 46),
  ],
};

/* ────────────────────────────────────────────────────────────────────
   ✦ DİNAMİK PARTNER ÜRETİMİ
   Hand-curated (FCO/NRT/BCN/AYT) yoksa şehir tipine göre üretilir.
   Şehir grupları (WEB_CITIES.group + iso + code) tier'a eşlenir;
   her tier bir marka anahtarı listesi tutar; her marka için bir
   "template" var (brand adı, mil teklifi, isim formatı, ikon, logo).
   Böylece Şanlıurfa (GNY) → Hilton + Divan + Avis + ProGo …
   Bangkok (BKK) → Marriott + IHG + Kaligo + Sixt + Plaza …
   ──────────────────────────────────────────────────────────────────── */

// Her marka için tek bir şablon — name'i şehir adına göre üretir.
// `name` fn(city, code) → string; offer & miles statik kalır.
const MS_BRAND_TEMPLATES = {
  // ─── Konaklama ─────────────────────────────────────────────────
  mb:     { cat: 'stay', brand: 'Marriott Bonvoy',
            name: (c) => `Marriott · ${c}`,
            offer: 'Konaklama başına 600 Mil', miles: '600' },
  hh:     { cat: 'stay', brand: 'Hilton Honors',
            name: (c) => `Hilton · ${c}`,
            offer: 'Konaklama başına 500 Mil', miles: '500' },
  hgi:    { cat: 'stay', brand: 'Hilton Honors',
            name: (c) => `Hilton Garden Inn · ${c}`,
            offer: 'Konaklama başına 400 Mil', miles: '400' },
  all:    { cat: 'stay', brand: 'ALL · Accor',
            name: (c) => `Sofitel / Pullman · ${c}`,
            offer: '%15 + 550 Mil/gece', miles: '550' },
  ibis:   { cat: 'stay', brand: 'ALL · Accor',
            name: (c) => `ibis · ${c}`,
            offer: 'Konaklama başına 300 Mil', miles: '300' },
  rixos:  { cat: 'stay', brand: 'Rixos Hotels',
            name: (c) => `Rixos · ${c}`,
            offer: 'Konaklama başına 700 Mil', miles: '700' },
  ihg:    { cat: 'stay', brand: 'IHG One Rewards',
            name: (c) => `InterContinental · ${c}`,
            offer: 'Konaklama başına 650 Mil', miles: '650' },
  hi:     { cat: 'stay', brand: 'IHG One Rewards',
            name: (c) => `Holiday Inn · ${c}`,
            offer: 'Konaklama başına 350 Mil', miles: '350' },
  book:   { cat: 'stay', brand: 'Booking.com',
            name: (c) => `Booking · ${c} seçkisi`,
            offer: '%5 mil iadesi · 400 Mil/gece', miles: '400' },
  rocket: { cat: 'stay', brand: 'Rocketmiles',
            name: (c) => `Rocketmiles · ${c} fırsatları`,
            offer: 'Rezervasyon başına 1.500 Mil', miles: '1500' },
  halal:  { cat: 'stay', brand: 'HalalBooking',
            name: (c) => `HalalBooking · ${c}`,
            offer: 'Rezervasyon başına 600 Mil', miles: '600' },
  kaligo: { cat: 'stay', brand: 'Kaligo',
            name: (c) => `Kaligo · ${c} lüks otel`,
            offer: 'Rezervasyon başına 1.800 Mil', miles: '1800' },

  // ─── Araç Kiralama ─────────────────────────────────────────────
  avis:   { cat: 'car', brand: 'Avis',
            name: (c, code, airport) => `Avis · ${airport || code + ' Havalimanı'}`,
            offer: 'Min. 125 Mil/kiralama', miles: '125' },
  budget: { cat: 'car', brand: 'Budget',
            name: (c) => `Budget · ${c}`,
            offer: 'Min. 110 Mil/kiralama', miles: '110' },
  enter:  { cat: 'car', brand: 'Enterprise',
            name: (c) => `Enterprise · ${c}`,
            offer: 'Min. 130 Mil/kiralama', miles: '130' },
  sixt:   { cat: 'car', brand: 'Sixt',
            name: (c, code, airport) => `Sixt · ${airport || c}`,
            offer: 'Min. 140 Mil/kiralama', miles: '140' },

  // ─── VIP Transfer ──────────────────────────────────────────────
  progo:  { cat: 'vip', brand: 'ProGo',
            name: (c, code) => `ProGo VIP Transfer · ${code} ↔ ${c}`,
            offer: 'Tek yön 950 Mil', miles: '950', logo: PROGO_LOGO },

  // ─── Lounge ────────────────────────────────────────────────────
  plaza:  { cat: 'lounge', brand: 'Plaza Premium',
            name: (c, code, airport) => `Plaza Premium Lounge · ${airport || code}`,
            offer: 'Lounge başına 400 Mil', miles: '400' },

  // ─── Seyahat Hizmetleri ────────────────────────────────────────
  wifi:   { cat: 'travel_services', brand: 'Airport WiFi Rentals',
            name: (c, code) => `Pocket WiFi · ${code} Pickup`,
            offer: 'Kiralama başına 100 Mil', miles: '100' },

  // ─── Finans ────────────────────────────────────────────────────
  garanti:{ cat: 'finance', brand: 'Garanti BBVA',
            name: (c) => `Garanti BBVA Bonus · ${c}`,
            offer: 'Her 5 TL = 1 Mil', miles: '—' },

  // ─── Yeme & İçme ───────────────────────────────────────────────
  divan:  { cat: 'dining', brand: 'Divan',
            name: (c) => `Divan Brasserie · ${c}`,
            offer: '%10 + 200 Mil/menü', miles: '200' },
  local_tr: { cat: 'dining', brand: 'Yerel Mutfak',
            name: (c) => `Geleneksel Türk Mutfağı · ${c}`,
            offer: '%10 + 200 Mil', miles: '200' },
};

// Şehir tier'ına göre hangi markalar listede olur.
// Tek bir tier, marka anahtarlarının sıralı listesi (sıra = görüntü sırası).
const MS_TIER_BRANDS = {
  // Türkiye iç hat — büyük metro (IST, SAW, ESB, ADB)
  tr_metro:    ['mb','hh','all','ibis','book','rocket','divan','avis','sixt','progo','plaza','wifi','garanti'],
  // Türkiye iç hat — sahil/resort (BJV, DLM, AYT)
  tr_resort:   ['rixos','hh','all','halal','book','avis','budget','progo','plaza','wifi','divan','garanti'],
  // Türkiye iç hat — Anadolu / butik (GZT, TZX, NAV, ASR, GNY, MQM, ADF, RZE, CKZ)
  tr_anatolia: ['hgi','halal','ibis','book','divan','local_tr','avis','budget','progo','garanti'],
  // Avrupa metro
  eu_metro:    ['mb','hh','all','ihg','book','rocket','kaligo','avis','sixt','enter','progo','plaza','wifi','garanti'],
  // Orta Doğu (Müslüman çoğunluklu — HalalBooking iyi sinyal)
  me:          ['mb','hh','ihg','all','halal','book','rocket','avis','sixt','progo','plaza','wifi','garanti'],
  // Afrika
  af:          ['mb','hh','all','book','avis','budget','progo','plaza','wifi','garanti'],
  // Asya / Pasifik
  as_metro:    ['mb','hh','ihg','all','book','rocket','kaligo','avis','sixt','progo','plaza','wifi','garanti'],
  // Amerika
  am_metro:    ['mb','hh','ihg','all','book','rocket','avis','budget','enter','sixt','progo','plaza','wifi','garanti'],
};

function cityTier(city) {
  if (!city) return 'eu_metro';
  if (city.iso === 'TR') {
    if (['IST','SAW','ESB','ADB'].includes(city.code)) return 'tr_metro';
    if (['AYT','BJV','DLM'].includes(city.code))       return 'tr_resort';
    return 'tr_anatolia';
  }
  if (city.group === 'eu') return 'eu_metro';
  if (city.group === 'me') return 'me';
  if (city.group === 'af') return 'af';
  if (city.group === 'as') return 'as_metro';
  if (city.group === 'am') return 'am_metro';
  return 'eu_metro';
}

// Deterministik x/y — her marka şehir merkezi etrafında farklı bir noktada.
// Aynı şehir için her zaman aynı x/y → harita pin'leri sabit kalır.
function brandXY(brandKey, idx) {
  let seed = idx * 73;
  for (let i = 0; i < brandKey.length; i++) seed = (seed * 31 + brandKey.charCodeAt(i)) % 1000;
  const angle  = (seed / 1000) * Math.PI * 2;
  const radius = 14 + ((seed * 7) % 22); // 14–35 (%)
  return {
    x: Math.round(50 + Math.cos(angle) * radius),
    y: Math.round(50 + Math.sin(angle) * radius),
  };
}

function generateMSPartnersFor(code) {
  const city = (typeof window !== 'undefined' && window.findCity) ? window.findCity(code) : null;
  const tier = cityTier(city);
  const keys = MS_TIER_BRANDS[tier] || MS_TIER_BRANDS.eu_metro;
  const cityName = city?.city || code;
  const airport  = city?.airport || (code + ' Havalimanı');
  return keys.map((k, i) => {
    const tpl = MS_BRAND_TEMPLATES[k];
    if (!tpl) return null;
    const xy = brandXY(k, i);
    const name = (typeof tpl.name === 'function') ? tpl.name(cityName, code, airport) : tpl.name;
    return msp(`${k}-${code.toLowerCase()}-auto`, tpl.cat, tpl.brand, name, tpl.offer, tpl.miles, xy.x, xy.y, tpl.logo);
  }).filter(Boolean);
}

function getMSPartners(code) {
  // 1) Hand-curated — eski 4 şehirde elle ayarlı listeleri korur
  if (MS_PARTNERS[code]) return MS_PARTNERS[code];
  // 2) Dinamik üretim — şehir bilinmiyorsa __GENERIC__'e düş
  if (typeof window !== 'undefined' && window.findCity && window.findCity(code)) {
    return generateMSPartnersFor(code);
  }
  return MS_PARTNERS.__GENERIC__;
}

function getMSPartnersBy(code, catId) {
  const list = getMSPartners(code);
  if (!catId || catId === 'all') return list;
  return list.filter(p => p.cat === catId);
}

function isMSPartnerId(id) {
  return typeof id === 'string' && id.startsWith('ms_');
}

function getMSPartnerById(code, id) {
  return getMSPartners(code).find(p => p.id === id);
}

/* ────────────────────────────────────────────────────────────────────
   UI: Harita üzeri altın "Miles&Smiles" toggle butonu
   Sağ alt köşede positioned; toggle açıkken altın dolgu + sayaç chip
   ──────────────────────────────────────────────────────────────────── */
function MSMapToggle({ active, count, onToggle, lang = 'tr', size = 'md' }) {
  const w = size === 'sm' ? 'auto' : 'auto';
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: size === 'sm' ? '7px 12px' : '9px 14px',
        borderRadius: 999, cursor: 'pointer',
        background: active
          ? 'linear-gradient(135deg, #C5A059 0%, #E5C97A 50%, #C5A059 100%)'
          : 'rgba(10,22,40,0.78)',
        color: active ? '#1A1206' : '#F5E9CB',
        border: '1.5px solid ' + (active ? '#E5C97A' : 'rgba(197,160,89,0.55)'),
        boxShadow: active
          ? '0 8px 22px rgba(197,160,89,0.45), 0 0 0 4px rgba(197,160,89,0.12)'
          : '0 6px 16px rgba(10,22,40,0.32)',
        fontFamily: 'var(--font-mono)', fontSize: size === 'sm' ? 10 : 11,
        fontWeight: 800, letterSpacing: 1.4,
        transition: 'transform .18s cubic-bezier(.4,0,.2,1)',
      }}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 18, height: 18, borderRadius: 999,
        background: active ? '#1A1206' : 'rgba(197,160,89,0.18)',
        color: active ? '#E5C97A' : '#E5C97A',
        fontSize: 11, fontWeight: 800,
      }}>✦</span>
      <span style={{ whiteSpace: 'nowrap' }}>
        {lang === 'tr' ? 'MILES&SMILES' : 'MILES&SMILES'}
      </span>
      {typeof count === 'number' && (
        <span style={{
          padding: '1px 7px', borderRadius: 999,
          background: active ? '#1A1206' : '#C5A059',
          color: active ? '#E5C97A' : '#1A1206',
          fontSize: 10, fontWeight: 800,
          minWidth: 18, textAlign: 'center',
        }}>{count}</span>
      )}
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────────
   UI: POI flyout içinde Rezervasyon bandı
   - Açıldığında: partner adı + mil teklifi + altın "REZERVASYON" CTA
   - CTA tıkla → toast + nav('ms') → Miles&Smiles ekranı açılır
   ──────────────────────────────────────────────────────────────────── */
function MSReservationCTA({ partner, onReserve, lang = 'tr', dark = false }) {
  if (!partner) return null;
  const verb = {
    stay:            lang === 'tr' ? 'Otel rezervasyonu'     : 'Hotel reservation',
    car:             lang === 'tr' ? 'Araç rezervasyonu'     : 'Car reservation',
    vip:             lang === 'tr' ? 'Transfer rezervasyonu' : 'Transfer reservation',
    lounge:          lang === 'tr' ? 'Lounge erişimi'        : 'Lounge access',
    travel_services: lang === 'tr' ? 'Hizmet rezervasyonu'   : 'Service booking',
    finance:         lang === 'tr' ? 'Kart başvurusu'        : 'Card application',
    dining:          lang === 'tr' ? 'Masa rezervasyonu'     : 'Table reservation',
  }[partner.cat] || (lang === 'tr' ? 'Rezervasyon' : 'Reservation');

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', borderRadius: 10,
      background: dark
        ? 'linear-gradient(135deg, rgba(197,160,89,0.10), rgba(197,160,89,0.04))'
        : 'linear-gradient(135deg, rgba(197,160,89,0.12), rgba(197,160,89,0.05))',
      border: '1px solid rgba(197,160,89,0.42)',
    }}>
      {partner.logo ? (
        <span style={{
          width: 32, height: 32, borderRadius: 8,
          background: '#fff', padding: 3,
          border: '1px solid rgba(197,160,89,0.42)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <img src={partner.logo} alt={partner.brand} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </span>
      ) : (
        <span style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg, #C5A059, #E5C97A)',
          color: '#1A1206', fontWeight: 800, fontSize: 13,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>✦</span>
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1.8,
          color: dark ? '#E5C97A' : '#9C7B36', fontWeight: 800,
        }}>
          {lang === 'tr' ? 'MILES&SMILES PARTNERİ' : 'MILES&SMILES PARTNER'}
        </span>
        <span style={{
          fontSize: 12, fontWeight: 700, lineHeight: 1.2,
          color: dark ? '#F5E9CB' : '#1A1206',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{partner.offer}</span>
      </div>
      <button
        onClick={() => onReserve && onReserve(partner)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #C5A059, #E5C97A)',
          color: '#1A1206', fontFamily: 'var(--font-mono)',
          fontSize: 10, fontWeight: 800, letterSpacing: 1.2,
          boxShadow: '0 6px 14px rgba(197,160,89,0.40)',
          whiteSpace: 'nowrap',
        }}>
        {verb} →
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   UI: Keşfet sekmesinde "✦ Sadece M&S" toggle chip
   Kategori chip rail'inin sonuna eklenir.
   ──────────────────────────────────────────────────────────────────── */
function MSOnlyChip({ active, onToggle, lang = 'tr', size = 'md' }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      style={{
        flexShrink: 0,
        padding: size === 'sm' ? '6px 10px' : '7px 12px',
        borderRadius: 999, cursor: 'pointer',
        background: active
          ? 'linear-gradient(135deg, #C5A059 0%, #E5C97A 50%, #C5A059 100%)'
          : 'rgba(197,160,89,0.08)',
        color: active ? '#1A1206' : '#C5A059',
        border: '1.5px solid ' + (active ? '#E5C97A' : 'rgba(197,160,89,0.42)'),
        boxShadow: active ? '0 4px 12px rgba(197,160,89,0.32)' : 'none',
        fontWeight: 800, fontSize: size === 'sm' ? 10 : 11,
        letterSpacing: 0.4,
        display: 'inline-flex', alignItems: 'center', gap: 5,
        whiteSpace: 'nowrap',
      }}>
      <span style={{ fontSize: 12 }}>✦</span>
      {lang === 'tr' ? 'Sadece M&S' : 'M&S only'}
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────────
   UI: Kategori başlıklı M&S liste (Keşfet'te M&S aktifken)
   ──────────────────────────────────────────────────────────────────── */
function MSGroupedList({ destCode, lang = 'tr', dark = false, onOpenPartner, onReserve }) {
  const all = getMSPartners(destCode);
  if (!all.length) {
    return (
      <div style={{
        padding: '14px 16px', borderRadius: 10,
        background: dark ? 'rgba(255,255,255,0.04)' : '#F3F5F8',
        border: '1px dashed ' + (dark ? 'rgba(255,255,255,0.12)' : '#E2E8F0'),
        textAlign: 'center', fontSize: 12, color: dark ? '#B2C0D1' : '#64748B',
      }}>
        {lang === 'tr' ? 'Bu destinasyonda henüz anlaşmalı yer yok.' : 'No partner venues for this destination yet.'}
      </div>
    );
  }
  const grouped = MS_CATEGORIES
    .map(cat => ({ cat, items: all.filter(p => p.cat === cat.id) }))
    .filter(g => g.items.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {grouped.map(g => (
        <div key={g.cat.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '4px 0',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 22, height: 22, borderRadius: 6,
              background: g.cat.color, color: '#fff',
              fontSize: 11,
            }}>{g.cat.icon}</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1.8,
              fontWeight: 800, color: dark ? '#E5C97A' : '#9C7B36',
              textTransform: 'uppercase',
            }}>
              {(lang === 'tr' ? g.cat.tr : g.cat.en).toUpperCase()}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9.5, color: dark ? '#7A8EAF' : '#94A3B8',
            }}>· {g.items.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {g.items.map(p => (
              <div key={p.id} style={{
                display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 10, alignItems: 'center',
                padding: '10px 12px', borderRadius: 10,
                background: dark ? 'rgba(255,255,255,0.045)' : '#fff',
                border: '1px solid ' + (dark ? 'rgba(197,160,89,0.22)' : 'rgba(197,160,89,0.28)'),
                cursor: 'pointer',
              }} onClick={() => onOpenPartner && onOpenPartner(p)}>
                {p.logo ? (
                  <span style={{
                    width: 30, height: 30, borderRadius: 6,
                    background: '#fff', padding: 2,
                    border: '1px solid ' + (dark ? 'rgba(255,255,255,0.18)' : '#E2E8F0'),
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <img src={p.logo} alt={p.brand} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </span>
                ) : (
                  <span style={{
                    width: 30, height: 30, borderRadius: 6,
                    background: g.cat.color, color: '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, flexShrink: 0,
                  }}>{g.cat.icon}</span>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: 11.5, fontWeight: 700,
                      color: dark ? '#F4EBD9' : '#0A1628',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{p.name}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9,
                      color: dark ? '#7A8EAF' : '#94A3B8', letterSpacing: 0.6,
                    }}>· {p.brand}</span>
                  </div>
                  <div style={{
                    fontSize: 10.5, color: dark ? '#C5A059' : '#9C7B36', fontWeight: 600,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{p.offer}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onReserve && onReserve(p); }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '7px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #C5A059, #E5C97A)',
                    color: '#1A1206', fontFamily: 'var(--font-mono)',
                    fontSize: 9.5, fontWeight: 800, letterSpacing: 1,
                    whiteSpace: 'nowrap',
                  }}>
                  {lang === 'tr' ? 'REZERVASYON' : 'BOOK'} →
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Convert MS partner list to the "discoverPois" shape that DestLeafletMap
   expects (id/lat/lon/name/color/icon/_src). The `poiLatLon` helper from
   web-route-map.jsx maps x/y → real lat/lon based on the city center.
   ──────────────────────────────────────────────────────────────────── */
function msPartnersAsMapPois(destCode) {
  if (typeof poiLatLon !== 'function') return [];
  return getMSPartners(destCode).map(p => {
    const ll = poiLatLon({ x: p.x, y: p.y }, destCode);
    const catMeta = MS_CATEGORIES.find(c => c.id === p.cat) || {};
    return {
      id: p.id,            // 'ms_' prefix — onPoiClick can detect it
      lat: ll.lat, lon: ll.lon,
      name: p.name,
      color: '#C5A059',    // all M&S pins are gold-rimmed
      icon: catMeta.icon || '✦',
      _src: p,
    };
  });
}

Object.assign(window, {
  MS_CATEGORIES, MS_PARTNERS,
  MS_BRAND_TEMPLATES, MS_TIER_BRANDS, cityTier, generateMSPartnersFor,
  getMSPartners, getMSPartnersBy, getMSPartnerById, isMSPartnerId,
  msPartnersAsMapPois,
  MSMapToggle, MSReservationCTA, MSOnlyChip, MSGroupedList,
});
