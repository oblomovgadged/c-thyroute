// admin-data.jsx — mock KPI data + i18n strings for THY Route Executive Dashboard
//
// Numbers are illustrative business-case figures (CEO/CFO pitch deck mode),
// not pulled from any real THY system. Kept in one place so the design can
// iterate without hunting through panels.

const ADMIN_COPY = {
  tr: {
    appName: 'THY Route',
    panel: 'EXECUTIVE COCKPIT',
    subtitle: 'Yönetici İstihbarat Paneli',
    asOf: 'Son güncelleme',
    range: 'YTD · 2026',
    badge: 'CANLI',
    sections: {
      overview:  'Genel Bakış',
      intent:    'Seyahat Niyeti',
      loyalty:   'Yolcu & Sadakat',
      partner:   'Partner İstihbaratı',
      marketing: 'Pazarlama',
      ms:        'Miles & Smiles',
      layover:   'Smart Layover',
      tkpay:     'TKPAY',
      ai:        'AI Insights',
    },
    kpi: {
      activeUsers:     'Toplam Aktif Kullanıcı',
      extraPax:        'Ek Kazanılan Yolcu',
      extraRev:        'Ek Gelir',
      roi:             'ROI',
      adSavings:       'Reklam Tasarrufu',
      msActivation:    'M&S Aktivasyonu',
      repeatRate:      'Tekrar Uçuş Oranı',
      nps:             'Net Promoter Score',
    },
    intent: {
      title:    'İnsanlar nereye gitmek istiyor?',
      top:      'Top 10 Destinasyon',
      hot:      'Gelecek Talep Haritası',
      combos:   'Oluşturulan Popüler Kombinasyonlar',
      search:   'Arama',
      save:     'Kayıt',
      city:     'Şehir',
    },
    loyalty: {
      title:    'Yolcu Profili & Sadakat',
      normal:   'Normal yolcu',
      route:    'THY Route kullanıcısı',
      flightsYr:'uçuş / yıl',
      stolen:   'Rakiplerden gelen yeni yolcular',
      referral: 'Arkadaş daveti',
      nps:      'Net Promoter Score',
      uplift:   'kullanıcı başına',
    },
    partner: {
      title:    'Partner Yoğunluğu & Fırsat',
      density:  'Partner Yoğunluğu',
      gap:      'Partner Eksik Bölgeler',
      opp:      'Partner Fırsat Skoru',
      hotel:    'Otel', car: 'Araç Kiralama', resto: 'Restoran',
      fin:      'Finans', vip: 'VIP',
    },
    marketing: {
      title:    'Pazarlama Verimliliği',
      cac:      'Müşteri Edinme Maliyeti (CAC)',
      cacFrom:  '42$',
      cacTo:    '31$',
      adSave:   'Reklam Tasarrufu',
      push:     'Push Bildirim Dönüşümü',
      alarm:    'Fiyat Alarmı Satışları',
      viral:    'Viral Büyüme',
      viralFrom:'1 kullanıcı',
      viralTo:  '1.27 kullanıcı',
    },
    ms: {
      title:    'Miles & Smiles İstihbaratı',
      spent:    'Toplam Harcanan Mil',
      earned:   'Toplam Kazanılan Mil',
      partner:  'Partner Bazında Mil Kullanımı',
      liab:     'Mil Yükümlülüğündeki Azalma',
    },
    layover: {
      title:    'İstanbul Aktarmaları',
      transit:  'Transit Yolcular',
      touri:    'Touristanbul Katılımı',
      vipx:     'VIP Transfer Kullanımı',
      avg:      'Ortalama Harcama',
      extra:    'İstanbul\'da Ek Gelir',
    },
    tkpay: {
      title:    'TKPAY İstihbaratı',
      sub:      'Cüzdan & Sanal POS performansı',
      vol:      'İşlem Hacmi',
      wallets:  'Aktif Cüzdan',
      m2tl:     'Mil → TL Dönüşümü',
      pos:      'Sanal POS Üye İşyeri',
      avgBasket:'Ortalama Sepet',
      gross:    'Brüt Gelir',
      mix:      'Ödeme Karmaşımı',
      partners: 'Anlaşmalı Marka Yoğunluğu',
    },
    ai: {
      title:    'AI Executive Insights',
      sub:      'Sistem otomatik yorum üretir',
      askLabel: 'Soru sor',
      askHint:  'Örn. "Bali partner açığını kapat"',
    },
    actions: {
      pdf:     'PDF Olarak Al',
      share:   'Paylaş',
      filter:  'Filtre',
      board:   'Board Modu',
    },
  },
  en: {
    appName: 'THY Route',
    panel: 'EXECUTIVE COCKPIT',
    subtitle: 'Executive Intelligence Dashboard',
    asOf: 'Last update',
    range: 'YTD · 2026',
    badge: 'LIVE',
    sections: {
      overview:  'Overview',
      intent:    'Travel Intent',
      loyalty:   'Pax & Loyalty',
      partner:   'Partner Intel',
      marketing: 'Marketing',
      ms:        'Miles & Smiles',
      layover:   'Smart Layover',
      tkpay:     'TKPAY',
      ai:        'AI Insights',
    },
    kpi: {
      activeUsers:     'Active Users',
      extraPax:        'Extra Passengers',
      extraRev:        'Extra Revenue',
      roi:             'ROI',
      adSavings:       'Ad Savings',
      msActivation:    'M&S Activation',
      repeatRate:      'Repeat Flight Rate',
      nps:             'Net Promoter Score',
    },
    intent: {
      title:    'Where do people want to go?',
      top:      'Top 10 Destinations',
      hot:      'Future Demand Heatmap',
      combos:   'Most-built Combinations',
      search:   'Searches', save: 'Saves', city: 'City',
    },
    loyalty: {
      title:    'Passenger Profile & Loyalty',
      normal:   'Average pax',
      route:    'THY Route user',
      flightsYr:'flights / yr',
      stolen:   'Carriers we win pax from',
      referral: 'Friend referrals',
      nps:      'Net Promoter Score',
      uplift:   'per user',
    },
    partner: {
      title:    'Partner Density & Opportunity',
      density:  'Partner Density',
      gap:      'Partner Gap Regions',
      opp:      'Partner Opportunity Score',
      hotel:    'Hotel', car: 'Car Rental', resto: 'Restaurant',
      fin:      'Finance', vip: 'VIP',
    },
    marketing: {
      title:    'Marketing Efficiency',
      cac:      'Customer Acquisition Cost (CAC)',
      cacFrom:  '$42',
      cacTo:    '$31',
      adSave:   'Ad Savings',
      push:     'Push Conversion',
      alarm:    'Price-Alert Sales',
      viral:    'Viral Growth',
      viralFrom:'1 user',
      viralTo:  '1.27 user',
    },
    ms: {
      title:    'Miles & Smiles Intelligence',
      spent:    'Miles Burned',
      earned:   'Miles Earned',
      partner:  'Miles by Partner',
      liab:     'Mileage Liability Decrease',
    },
    layover: {
      title:    'Istanbul Layovers',
      transit:  'Transit Passengers',
      touri:    'Touristanbul Joins',
      vipx:     'VIP Transfer Use',
      avg:      'Avg. Spend',
      extra:    'Extra Revenue in IST',
    },
    tkpay: {
      title:    'TKPAY Intelligence',
      sub:      'Wallet & Virtual POS performance',
      vol:      'Transaction Volume',
      wallets:  'Active Wallets',
      m2tl:     'Miles → TL Conversion',
      pos:      'Virtual POS Merchants',
      avgBasket:'Average Basket',
      gross:    'Gross Revenue',
      mix:      'Payment Mix',
      partners: 'Partner-brand Density',
    },
    ai: {
      title:    'AI Executive Insights',
      sub:      'System-generated commentary',
      askLabel: 'Ask',
      askHint:  'e.g. "Close the Bali partner gap"',
    },
    actions: {
      pdf:     'Save as PDF',
      share:   'Share',
      filter:  'Filter',
      board:   'Boardroom mode',
    },
  },
};

// ─ KPI heros (8 tiles) ───────────────────────────────────────
const KPI_TILES = [
  { key: 'activeUsers',  value: '4.8M',     deltaText: '+1.2M', deltaDir: 'up',   accent: 'gold',  spark: [12,18,22,28,34,42,52,60,68,76,88,100], note: '+34% YoY' },
  { key: 'extraPax',     value: '+185.000', deltaText: '+12%',  deltaDir: 'up',   accent: 'red',   spark: [10,12,18,24,30,38,46,54,68,78,86,100], note: 'Q1→Q2' },
  { key: 'extraRev',     value: '$126M',    deltaText: '+24%',  deltaDir: 'up',   accent: 'green', spark: [8,14,22,30,38,44,52,62,72,84,92,100],  note: 'YTD' },
  { key: 'roi',          value: '1.850%',   deltaText: '+220 pp', deltaDir: 'up', accent: 'gold',  spark: [40,48,52,60,68,72,80,86,92,96,98,100], note: 'vs. 1.630% LY' },
  { key: 'adSavings',    value: '$58M',     deltaText: '+18%',  deltaDir: 'up',   accent: 'red',   spark: [22,28,34,40,48,54,60,68,76,82,90,100], note: 'organic + earned' },
  { key: 'msActivation', value: '+17%',     deltaText: '+3.2 pp', deltaDir: 'up', accent: 'gold',  spark: [50,54,58,62,66,70,72,76,80,84,88,92],  note: '12 ay' },
  { key: 'repeatRate',   value: '+24%',     deltaText: '+4.1 pp', deltaDir: 'up', accent: 'green', spark: [30,36,40,46,50,56,60,66,70,76,80,86],  note: 'repeat ≤ 90d' },
  { key: 'nps',          value: '63',       deltaText: '+9',    deltaDir: 'up',   accent: 'gold',  spark: [40,42,46,48,50,52,55,57,58,60,61,63],  note: 'world-class >50' },
];

// ─ Top 10 destinations ───────────────────────────────────────
const TOP_DESTINATIONS = [
  { city: 'Tokyo',     code: 'NRT', search: 124, save: 89,  fire: 5 },
  { city: 'Bali',      code: 'DPS', search: 111, save: 74,  fire: 5 },
  { city: 'Roma',      code: 'FCO', search:  92, save: 61,  fire: 4 },
  { city: 'Seul',      code: 'ICN', search:  87, save: 54,  fire: 4 },
  { city: 'Paris',     code: 'CDG', search:  81, save: 49,  fire: 3 },
  { city: 'New York',  code: 'JFK', search:  76, save: 42,  fire: 3 },
  { city: 'Bangkok',   code: 'BKK', search:  68, save: 41,  fire: 4 },
  { city: 'Barselona', code: 'BCN', search:  64, save: 38,  fire: 3 },
  { city: 'Dubai',     code: 'DXB', search:  58, save: 31,  fire: 2 },
  { city: 'Londra',    code: 'LHR', search:  51, save: 28,  fire: 2 },
];

const HOT_REGIONS = [
  { region: 'Japonya',   delta: '+24%', fire: 5 },
  { region: 'Bali',      delta: '+19%', fire: 5 },
  { region: 'Vietnam',   delta: '+17%', fire: 4 },
  { region: 'Sri Lanka', delta: '+15%', fire: 4 },
  { region: 'Filipinler',delta: '+12%', fire: 3 },
  { region: 'Gürcistan', delta: '+10%', fire: 3 },
];

const COMBOS = [
  { a: 'Tokyo',  b: 'Kyoto',     count: 38 },
  { a: 'Roma',   b: 'Floransa',  count: 31 },
  { a: 'Paris',  b: 'Amsterdam', count: 27 },
  { a: 'Bali',   b: 'Singapur',  count: 22 },
  { a: 'Seul',   b: 'Busan',     count: 19 },
  { a: 'Madrid', b: 'Lizbon',    count: 16 },
];

// ─ Partner intel ────────────────────────────────────────────
const PARTNER_DENSITY = [
  { k: 'hotel', count: 412, share: 38, color: '#0053A5' },
  { k: 'car',   count: 168, share: 16, color: '#C5A059' },
  { k: 'resto', count: 326, share: 30, color: '#B7312C' },
  { k: 'fin',   count:  84, share:  8, color: '#1E8E5A' },
  { k: 'vip',   count:  82, share:  8, color: '#7A4988' },
];

const PARTNER_GAPS = [
  { city: 'Tokyo',     gap: 'Restoran',   score: 94 },
  { city: 'Bali',      gap: 'Restoran',   score: 89 },
  { city: 'Marrakech', gap: 'Otel + VIP', score: 86 },
  { city: 'Tiflis',    gap: 'Araç',       score: 82 },
  { city: 'Hanoi',     gap: 'Finans',     score: 78 },
];

// ─ Miles & Smiles partners ──────────────────────────────────
const MS_PARTNERS = [
  { name: 'Hilton',    miles: 41, color: '#0053A5' },
  { name: 'Marriott',  miles: 38, color: '#C5A059' },
  { name: 'Sixt',      miles: 22, color: '#FF6B00' },
  { name: 'Avis',      miles: 19, color: '#B7312C' },
  { name: 'Restoran',  miles: 28, color: '#1E8E5A' },
  { name: 'Finans',    miles: 14, color: '#7A4988' },
];

// ─ Loyalty stolen-from carriers ─────────────────────────────
const STOLEN_CARRIERS = [
  { name: 'Emirates',  share: 38, color: '#D71921' },
  { name: 'Qatar',     share: 27, color: '#5C0F33' },
  { name: 'Lufthansa', share: 21, color: '#05164D' },
  { name: 'Diğer',     share: 14, color: '#64748B' },
];

// ─ TKPAY ────────────────────────────────────────────────────
const TKPAY_KPI = [
  { key: 'vol',       value: '₺3.42B',   delta: '+42%', spark: [10,16,22,28,38,48,58,68,78,86,92,100] },
  { key: 'wallets',   value: '1.84M',    delta: '+28%', spark: [20,26,32,40,48,54,62,70,78,84,90,96] },
  { key: 'm2tl',      value: '₺412M',    delta: '+61%', spark: [4,8,14,22,32,42,52,62,72,82,92,100] },
  { key: 'pos',       value: '8.620',    delta: '+19%', spark: [40,44,48,52,58,62,68,72,76,80,84,88] },
  { key: 'avgBasket', value: '₺143,50',  delta: '+4%',  spark: [60,62,64,66,64,68,70,72,74,76,78,80] },
  { key: 'gross',     value: '₺218M',    delta: '+37%', spark: [12,18,26,34,42,50,58,66,74,82,90,98] },
];

const TKPAY_MIX = [
  { name: 'Cüzdan',  pct: 42, color: '#C5A059' },
  { name: 'Sanal POS', pct: 31, color: '#B7312C' },
  { name: 'Mil → TL', pct: 18, color: '#0053A5' },
  { name: 'Partner',  pct:  9, color: '#1E8E5A' },
];

const TKPAY_PARTNERS = [
  { name: 'Migros',     vol: 86 },
  { name: 'Shell',      vol: 74 },
  { name: 'D&R',        vol: 52 },
  { name: 'MediaMarkt', vol: 46 },
  { name: 'Trendyol',   vol: 41 },
  { name: 'BIM',        vol: 38 },
  { name: 'Boyner',     vol: 30 },
  { name: 'Starbucks',  vol: 24 },
];

// ─ Smart layover ────────────────────────────────────────────
const LAYOVER_KPI = [
  { key: 'transit', value: '12.4M',   delta: '+8%'  },
  { key: 'touri',   value: '218k',    delta: '+24%' },
  { key: 'vipx',    value: '46.2k',   delta: '+31%' },
  { key: 'avg',     value: '$184',    delta: '+12%' },
  { key: 'extra',   value: '$72M',    delta: '+18%' },
];

// ─ AI insights ──────────────────────────────────────────────
const AI_INSIGHTS = {
  tr: [
    { tag: 'TREND',      icon: '↗', text: 'Japonya talebi son 90 günde %24 arttı. Tokyo + Kyoto kombinasyonu en sık oluşturulan plan.' },
    { tag: 'BOŞLUK',     icon: '◆', text: 'Bali bölgesinde restoran partner eksikliği tespit edildi — fırsat skoru 89, hızlı kapatılmalı.' },
    { tag: 'DAVRANIŞ',   icon: '☑', text: 'Price Alert kullanıcılarının tekrar rezervasyon oranı %18 daha yüksek.' },
    { tag: 'CLV',        icon: '★', text: 'THY Route kullanıcılarının CLV\'si normal yolculara göre %31 daha yüksek.' },
    { tag: 'TKPAY',      icon: '◐', text: 'Mil → TL dönüşümü Q1\'e göre %61 arttı; Miles&Smiles aktivasyonunu doğrudan besliyor.' },
    { tag: 'LAYOVER',    icon: '✈', text: 'Touristanbul katılımı %24 arttı; transit yolcu başına IST harcaması $184\'e ulaştı.' },
  ],
  en: [
    { tag: 'TREND',    icon: '↗', text: 'Japan demand up 24% in last 90 days. Tokyo + Kyoto is the most-built combo.' },
    { tag: 'GAP',      icon: '◆', text: 'Bali shows a restaurant-partner gap — opportunity score 89; close it fast.' },
    { tag: 'BEHAVIOR', icon: '☑', text: 'Price-Alert users rebook 18% more often.' },
    { tag: 'CLV',      icon: '★', text: 'THY Route users\' CLV is 31% higher than average pax.' },
    { tag: 'TKPAY',    icon: '◐', text: 'Miles → TL conversion up 61% vs Q1; directly feeds Miles&Smiles activation.' },
    { tag: 'LAYOVER',  icon: '✈', text: 'Touristanbul joins up 24%; per-transit-pax IST spend reached $184.' },
  ],
};

Object.assign(window, {
  ADMIN_COPY, KPI_TILES, TOP_DESTINATIONS, HOT_REGIONS, COMBOS,
  PARTNER_DENSITY, PARTNER_GAPS, MS_PARTNERS, STOLEN_CARRIERS,
  TKPAY_KPI, TKPAY_MIX, TKPAY_PARTNERS, LAYOVER_KPI, AI_INSIGHTS,
});
