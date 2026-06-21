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
  { id: 'stay',     icon: '🏨', tr: 'Konaklama',      en: 'Stays',           color: '#0053A5' },
  { id: 'car',      icon: '🚗', tr: 'Araç Kiralama',  en: 'Car Rental',      color: '#5B6770' },
  { id: 'finance',  icon: '💳', tr: 'Finans',         en: 'Finance',         color: '#1A8E5A' },
  { id: 'vip',      icon: '🛡',  tr: 'VIP Transfer',   en: 'VIP Transfer',    color: '#0A1628' },
  { id: 'dining',   icon: '🍽',  tr: 'Yeme & İçme',    en: 'Dining',          color: '#B7312C' },
];

// helper to declare one partner concisely
const msp = (id, cat, brand, name, offer, miles, x, y) => ({
  id: 'ms_' + id, cat, brand, name, offer, miles, x, y, isMS: true,
});

// Generic-but-believable fallbacks. Each city gets a curated set so the map feels
// hand-tuned (5–10 pins per destination, well distributed across categories).
const MS_PARTNERS = {
  FCO: [
    msp('h-hilton-fco',   'stay',    'Hilton',          'Hilton Rome Airport',         'Konaklama başına 500 Mil', '500', 45, 62),
    msp('h-conrad-fco',   'stay',    'Conrad',          'Conrad Roma Trevi',           'Konaklama başına 750 Mil', '750', 55, 38),
    msp('h-doubletree',   'stay',    'DoubleTree',      'DoubleTree by Hilton Rome',   '%15 + 350 Mil/gece',       '350', 38, 52),
    msp('c-avis',         'car',     'Avis',            'Avis · FCO Havalimanı',       'Min. 125 Mil/kiralama',    '125', 48, 64),
    msp('c-sixt',         'car',     'Sixt',            'Sixt · Termini İstasyonu',    'Min. 150 Mil/kiralama',    '150', 58, 44),
    msp('f-garanti',      'finance', 'Garanti BBVA',    'Bonus Miles ATM',             'Her 5 TL = 1 Mil',         '—',   62, 56),
    msp('v-merc-vclass',  'vip',     'Mercedes V-Class','Premium VIP Transfer',        'Tek yön 1.200 Mil',        '1200',49, 68),
    msp('v-blacklane',    'vip',     'Blacklane',       'Şehir içi transfer',          'Tek yön 850 Mil',          '850', 52, 50),
    msp('d-divan',        'dining',  'Divan',           'Divan Brasserie Roma',        '%10 + 200 Mil/menü',       '200', 56, 41),
    msp('d-istanbulgrill','dining',  'İstanbul Grill',  'Türk Steakhouse',             '300 Mil + welcome çay',    '300', 60, 47),
  ],
  NRT: [
    msp('h-conrad-tyo',   'stay',    'Conrad',          'Conrad Tokyo Shiodome',       'Konaklama başına 800 Mil', '800', 54, 48),
    msp('h-hilton-tyo',   'stay',    'Hilton',          'Hilton Tokyo Odaiba',         'Konaklama başına 550 Mil', '550', 60, 58),
    msp('h-marriott-tyo', 'stay',    'Marriott',        'Tokyo Marriott Hotel',        '%20 + 400 Mil/gece',       '400', 48, 53),
    msp('c-avis-tyo',     'car',     'Avis',            'Avis · Narita Havalimanı',    'Min. 200 Mil/kiralama',    '200', 50, 64),
    msp('c-sixt-tyo',     'car',     'Sixt',            'Sixt · Shibuya',              'Min. 180 Mil/kiralama',    '180', 56, 51),
    msp('f-garanti-tyo',  'finance', 'Garanti BBVA',    'Bonus Worldwide',             'Her 5 TL = 1.5 Mil (yurt dışı)', '—', 52, 56),
    msp('v-vip-narita',   'vip',     'Mercedes V-Class','NRT → Hotel Transfer',        'Tek yön 1.800 Mil',        '1800',45, 67),
    msp('d-turkrest',     'dining',  'İstanbul Sofrası','Türk Restoranı · Roppongi',   '%15 + 300 Mil/kişi',       '300', 58, 49),
  ],
  BCN: [
    msp('h-hilton-bcn',   'stay',    'Hilton',          'Hilton Diagonal Mar',         'Konaklama başına 500 Mil', '500', 62, 48),
    msp('h-conrad-bcn',   'stay',    'Conrad',          'Conrad Barcelona',            'Konaklama başına 700 Mil', '700', 50, 42),
    msp('c-avis-bcn',     'car',     'Avis',            'Avis · El Prat Havalimanı',   'Min. 125 Mil/kiralama',    '125', 36, 66),
    msp('c-sixt-bcn',     'car',     'Sixt',            'Sixt · Sants İstasyonu',      'Min. 140 Mil/kiralama',    '140', 45, 56),
    msp('f-garanti-bcn',  'finance', 'Garanti BBVA',    'Bonus Worldwide',             'Her 5 TL = 1 Mil',         '—',   54, 50),
    msp('v-vip-bcn',      'vip',     'Mercedes V-Class','El Prat → Şehir Transfer',    'Tek yön 950 Mil',          '950', 40, 64),
    msp('d-tapas',        'dining',  'Cal Pep',         'Premium Tapas',               '%15 + 250 Mil',            '250', 52, 46),
  ],
  AYT: [
    msp('h-hilton-ayt',   'stay',    'Hilton',          'Hilton Dalaman Resort',       'Konaklama başına 500 Mil', '500', 42, 58),
    msp('h-divan-ayt',    'stay',    'Divan',           'Divan Antalya Talya',         '%20 + 400 Mil/gece',       '400', 50, 52),
    msp('h-rixos',        'stay',    'Rixos',           'Rixos Premium Belek',         '700 Mil + welcome paketi', '700', 64, 60),
    msp('c-avis-ayt',     'car',     'Avis',            'Avis · AYT Havalimanı',       'Min. 100 Mil/kiralama',    '100', 38, 64),
    msp('f-garanti-ayt',  'finance', 'Garanti BBVA',    'Bonus Miles ATM',             'Her 5 TL = 1 Mil',         '—',   46, 50),
    msp('v-vip-ayt',      'vip',     'Mercedes V-Class','AYT → Otel Transfer',         'Tek yön 600 Mil',          '600', 40, 60),
    msp('d-7mehmet',      'dining',  '7 Mehmet',        'Geleneksel Türk Mutfağı',     '%10 + 200 Mil',            '200', 56, 48),
  ],
  __GENERIC__: [
    msp('h-hilton-gen',   'stay',    'Hilton',          'Hilton City Center',          'Konaklama başına 500 Mil', '500', 52, 48),
    msp('h-conrad-gen',   'stay',    'Conrad',          'Conrad Premium',              'Konaklama başına 750 Mil', '750', 46, 42),
    msp('h-doubletree-gen','stay',   'DoubleTree',      'DoubleTree by Hilton',        '%15 + 300 Mil/gece',       '300', 58, 54),
    msp('c-avis-gen',     'car',     'Avis',            'Avis · Havalimanı Şubesi',    'Min. 125 Mil/kiralama',    '125', 44, 62),
    msp('c-sixt-gen',     'car',     'Sixt',            'Sixt · Şehir Merkezi',        'Min. 140 Mil/kiralama',    '140', 56, 50),
    msp('f-garanti-gen',  'finance', 'Garanti BBVA',    'Bonus Miles ATM',             'Her 5 TL = 1 Mil',         '—',   62, 56),
    msp('v-merc-gen',     'vip',     'Mercedes V-Class','VIP Havalimanı Transfer',     'Tek yön 950 Mil',          '950', 40, 65),
    msp('v-bl-gen',       'vip',     'Blacklane',       'Şehir içi Premium Transfer',  'Tek yön 700 Mil',          '700', 50, 58),
    msp('d-divan-gen',    'dining',  'Divan',           'Divan Brasserie',             '%10 + 200 Mil/menü',       '200', 54, 46),
    msp('d-tk-gen',       'dining',  'İstanbul Grill',  'Türk Steakhouse',             '300 Mil + welcome çay',    '300', 60, 50),
  ],
};

function getMSPartners(code) {
  return MS_PARTNERS[code] || MS_PARTNERS.__GENERIC__;
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
    stay:    lang === 'tr' ? 'Otel rezervasyonu' : 'Hotel reservation',
    car:     lang === 'tr' ? 'Araç rezervasyonu' : 'Car reservation',
    finance: lang === 'tr' ? 'Kart başvurusu'   : 'Card application',
    vip:     lang === 'tr' ? 'Transfer rezervasyonu' : 'Transfer reservation',
    dining:  lang === 'tr' ? 'Masa rezervasyonu' : 'Table reservation',
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
      <span style={{
        width: 28, height: 28, borderRadius: 8,
        background: 'linear-gradient(135deg, #C5A059, #E5C97A)',
        color: '#1A1206', fontWeight: 800, fontSize: 13,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>✦</span>
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
                display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center',
                padding: '10px 12px', borderRadius: 10,
                background: dark ? 'rgba(255,255,255,0.045)' : '#fff',
                border: '1px solid ' + (dark ? 'rgba(197,160,89,0.22)' : 'rgba(197,160,89,0.28)'),
                cursor: 'pointer',
              }} onClick={() => onOpenPartner && onOpenPartner(p)}>
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
  getMSPartners, getMSPartnersBy, getMSPartnerById, isMSPartnerId,
  msPartnersAsMapPois,
  MSMapToggle, MSReservationCTA, MSOnlyChip, MSGroupedList,
});
