// web-booking-store.jsx — central booking state, cities DB, autocomplete input.
// Loaded BEFORE web-screens-*.jsx so every screen can read/write the same booking.
//
// Exports to window:
//   WEB_CITIES               — array of city objects (~30 popular THY destinations)
//   useBooking()             — hook → [booking, setBooking, helpers]
//   CityAutocomplete         — <CityAutocomplete value, onChange, label, side, otherSide, accent, lang />
//   formatDateShort(iso, lang)
//   priceFor(fromCode, toCode, basePriceTL)
//   distanceFor(fromCode, toCode)  → km
//   makePNR(from, to)        — deterministic 6-char PNR

// ─── Cities database ─────────────────────────────────────────────
// lat/lon → so we can compute great-circle distance and produce
// price/duration variation per route. group lets us section the list.
const WEB_CITIES = [
  // Turkey (domestic)
  { code: 'IST', city: 'İstanbul',  airport: 'İstanbul Havalimanı',         country: 'Türkiye',     iso: 'TR', lat: 41.262, lon: 28.728, group: 'tr', tags: ['ist','istanbul'] },
  { code: 'SAW', city: 'İstanbul',  airport: 'Sabiha Gökçen',               country: 'Türkiye',     iso: 'TR', lat: 40.898, lon: 29.309, group: 'tr', tags: ['saw','sabiha'] },
  { code: 'ESB', city: 'Ankara',    airport: 'Esenboğa',                    country: 'Türkiye',     iso: 'TR', lat: 40.128, lon: 32.995, group: 'tr', tags: ['esb','ankara'] },
  { code: 'AYT', city: 'Antalya',   airport: 'Antalya Havalimanı',          country: 'Türkiye',     iso: 'TR', lat: 36.899, lon: 30.800, group: 'tr', tags: ['ayt','antalya'] },
  { code: 'ADB', city: 'İzmir',     airport: 'Adnan Menderes',              country: 'Türkiye',     iso: 'TR', lat: 38.292, lon: 27.157, group: 'tr', tags: ['adb','izmir'] },
  { code: 'GZT', city: 'Gaziantep', airport: 'Oğuzeli',                     country: 'Türkiye',     iso: 'TR', lat: 36.947, lon: 37.479, group: 'tr', tags: ['gzt','gaziantep','antep'] },
  { code: 'TZX', city: 'Trabzon',   airport: 'Trabzon Havalimanı',          country: 'Türkiye',     iso: 'TR', lat: 40.995, lon: 39.789, group: 'tr', tags: ['tzx','trabzon'] },
  { code: 'DLM', city: 'Dalaman',   airport: 'Dalaman Havalimanı',          country: 'Türkiye',     iso: 'TR', lat: 36.713, lon: 28.793, group: 'tr', tags: ['dlm','dalaman','fethiye'] },
  { code: 'BJV', city: 'Bodrum',    airport: 'Milas-Bodrum',                country: 'Türkiye',     iso: 'TR', lat: 37.250, lon: 27.664, group: 'tr', tags: ['bjv','bodrum','milas'] },

  // Turkey (tour hubs added for THY Route tour flow)
  { code: 'NAV', city: 'Kapadokya', airport: 'Nevşehir Kapadokya',          country: 'Türkiye',     iso: 'TR', lat: 38.772, lon: 34.534, group: 'tr', tags: ['nav','kapadokya','nevsehir','cappadocia','goreme'] },
  { code: 'ASR', city: 'Kayseri',   airport: 'Erkilet',                     country: 'Türkiye',     iso: 'TR', lat: 38.770, lon: 35.494, group: 'tr', tags: ['asr','kayseri'] },
  { code: 'GNY', city: 'Şanlıurfa', airport: 'GAP Şanlıurfa',                country: 'Türkiye',     iso: 'TR', lat: 37.094, lon: 38.847, group: 'tr', tags: ['gny','urfa','sanliurfa'] },
  { code: 'MQM', city: 'Mardin',    airport: 'Mardin Havalimanı',           country: 'Türkiye',     iso: 'TR', lat: 37.223, lon: 40.632, group: 'tr', tags: ['mqm','mardin'] },
  { code: 'ADF', city: 'Adıyaman',  airport: 'Adıyaman Havalimanı',         country: 'Türkiye',     iso: 'TR', lat: 37.732, lon: 38.469, group: 'tr', tags: ['adf','adiyaman','nemrut','kahta'] },
  { code: 'RZE', city: 'Rize',      airport: 'Rize-Artvin',                 country: 'Türkiye',     iso: 'TR', lat: 41.156, lon: 40.819, group: 'tr', tags: ['rze','rize','ayder','firtina'] },
  { code: 'CKZ', city: 'Çanakkale', airport: 'Çanakkale Havalimanı',         country: 'Türkiye',     iso: 'TR', lat: 40.138, lon: 26.427, group: 'tr', tags: ['ckz','canakkale','gelibolu','truva','troy'] },

  // Europe
  { code: 'FCO', city: 'Roma',      airport: 'Fiumicino',                   country: 'İtalya',      iso: 'IT', lat: 41.800, lon: 12.239, group: 'eu', tags: ['fco','roma','rome'] },
  { code: 'CDG', city: 'Paris',     airport: 'Charles de Gaulle',           country: 'Fransa',      iso: 'FR', lat: 49.010, lon: 2.548,  group: 'eu', tags: ['cdg','paris'] },
  { code: 'LHR', city: 'Londra',    airport: 'Heathrow',                    country: 'Birleşik Krallık', iso: 'GB', lat: 51.470, lon: -0.454, group: 'eu', tags: ['lhr','londra','london'] },
  { code: 'AMS', city: 'Amsterdam', airport: 'Schiphol',                    country: 'Hollanda',    iso: 'NL', lat: 52.309, lon: 4.764,  group: 'eu', tags: ['ams','amsterdam'] },
  { code: 'BER', city: 'Berlin',    airport: 'Brandenburg',                 country: 'Almanya',     iso: 'DE', lat: 52.367, lon: 13.503, group: 'eu', tags: ['ber','berlin'] },
  { code: 'FRA', city: 'Frankfurt', airport: 'Frankfurt am Main',           country: 'Almanya',     iso: 'DE', lat: 50.037, lon: 8.562,  group: 'eu', tags: ['fra','frankfurt'] },
  { code: 'MAD', city: 'Madrid',    airport: 'Barajas',                     country: 'İspanya',     iso: 'ES', lat: 40.472, lon: -3.561, group: 'eu', tags: ['mad','madrid'] },
  { code: 'BCN', city: 'Barselona', airport: 'El Prat',                     country: 'İspanya',     iso: 'ES', lat: 41.297, lon: 2.078,  group: 'eu', tags: ['bcn','barselona','barcelona'] },
  { code: 'ATH', city: 'Atina',     airport: 'Eleftherios Venizelos',       country: 'Yunanistan',  iso: 'GR', lat: 37.937, lon: 23.945, group: 'eu', tags: ['ath','atina','athens'] },
  { code: 'VIE', city: 'Viyana',    airport: 'Schwechat',                   country: 'Avusturya',   iso: 'AT', lat: 48.110, lon: 16.570, group: 'eu', tags: ['vie','viyana','vienna'] },
  { code: 'ZRH', city: 'Zürih',     airport: 'Zürich',                      country: 'İsviçre',     iso: 'CH', lat: 47.464, lon: 8.549,  group: 'eu', tags: ['zrh','zurich','zurih'] },

  // Middle East / Africa
  { code: 'DXB', city: 'Dubai',     airport: 'Dubai Intl',                  country: 'BAE',         iso: 'AE', lat: 25.252, lon: 55.364, group: 'me', tags: ['dxb','dubai'] },
  { code: 'DOH', city: 'Doha',      airport: 'Hamad Intl',                  country: 'Katar',       iso: 'QA', lat: 25.273, lon: 51.608, group: 'me', tags: ['doh','doha'] },
  { code: 'CAI', city: 'Kahire',    airport: 'Cairo Intl',                  country: 'Mısır',       iso: 'EG', lat: 30.111, lon: 31.413, group: 'me', tags: ['cai','kahire','cairo'] },
  { code: 'JNB', city: 'Johannesburg', airport: 'O.R. Tambo',               country: 'G. Afrika',   iso: 'ZA', lat: -26.139, lon: 28.246, group: 'af', tags: ['jnb','johannesburg'] },
  { code: 'CPT', city: 'Cape Town', airport: 'Cape Town Intl',              country: 'G. Afrika',   iso: 'ZA', lat: -33.969, lon: 18.602, group: 'af', tags: ['cpt','cape','town'] },

  // Asia / Americas
  { code: 'NRT', city: 'Tokyo',     airport: 'Narita',                      country: 'Japonya',     iso: 'JP', lat: 35.765, lon: 140.386, group: 'as', tags: ['nrt','tokyo','tokyo'] },
  { code: 'BKK', city: 'Bangkok',   airport: 'Suvarnabhumi',                country: 'Tayland',     iso: 'TH', lat: 13.690, lon: 100.750, group: 'as', tags: ['bkk','bangkok'] },
  { code: 'SIN', city: 'Singapur',  airport: 'Changi',                      country: 'Singapur',    iso: 'SG', lat: 1.359,   lon: 103.989, group: 'as', tags: ['sin','singapur','singapore'] },
  { code: 'JFK', city: 'New York',  airport: 'John F. Kennedy',             country: 'ABD',         iso: 'US', lat: 40.640, lon: -73.779, group: 'am', tags: ['jfk','new','york','newyork'] },
  { code: 'LAX', city: 'Los Angeles', airport: 'LAX',                       country: 'ABD',         iso: 'US', lat: 33.943, lon: -118.408, group: 'am', tags: ['lax','los','angeles'] },
  { code: 'GRU', city: 'São Paulo', airport: 'Guarulhos',                   country: 'Brezilya',    iso: 'BR', lat: -23.430, lon: -46.475, group: 'am', tags: ['gru','sao','paulo'] },
];

const GROUP_LABELS = {
  tr: { tr: 'TÜRKİYE',         en: 'TÜRKİYE' },
  eu: { tr: 'AVRUPA',          en: 'EUROPE' },
  me: { tr: 'ORTA DOĞU',       en: 'MIDDLE EAST' },
  af: { tr: 'AFRİKA',          en: 'AFRICA' },
  as: { tr: 'ASYA & PASİFİK',  en: 'ASIA & PACIFIC' },
  am: { tr: 'AMERİKALAR',      en: 'AMERICAS' },
};

function findCity(code) {
  return WEB_CITIES.find(c => c.code === code) || null;
}

// ─── Great-circle distance & price model ─────────────────────────
function distanceFor(fromCode, toCode) {
  const a = findCity(fromCode), b = findCity(toCode);
  if (!a || !b) return 1500;
  const R = 6371;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const sin1 = Math.sin(dLat/2), sin2 = Math.sin(dLon/2);
  const c = 2 * Math.asin(Math.sqrt(sin1*sin1 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*sin2*sin2));
  return Math.round(R * c);
}
function durationFor(fromCode, toCode) {
  const km = distanceFor(fromCode, toCode);
  // ~750 km/h + 30 min taxi/turnaround
  const totalMin = Math.round((km / 750) * 60 + 30);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return { h, m, totalMin, txt: `${h}s ${String(m).padStart(2,'0')}dk` };
}
function priceFor(fromCode, toCode, basePriceTL = 1800) {
  // Base + per-km, plus a deterministic per-route variation (no random per render).
  const km = distanceFor(fromCode, toCode);
  const code = (fromCode || '') + (toCode || '');
  const seed = [...code].reduce((s, ch) => s + ch.charCodeAt(0), 0);
  const variance = (seed % 800) - 400; // -400..+399 TL
  return Math.max(900, Math.round(basePriceTL + km * 2.2 + variance));
}
function formatPriceTL(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
function makePNR(from, to) {
  const src = (from || '?') + (to || '?') + new Date().toISOString().slice(0,10);
  let h = 0;
  for (let i = 0; i < src.length; i++) h = (h * 31 + src.charCodeAt(i)) & 0xffffff;
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) { out += A[h & 31]; h >>= 5; if (!h) h = (src.charCodeAt(i % src.length) * (i+1)) & 0xffffff; }
  return out;
}

// ─── Date helpers ────────────────────────────────────────────────
function todayISO() { return new Date().toISOString().slice(0,10); }
function plusDaysISO(iso, days) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0,10);
}
const MONTH_TR = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
const MONTH_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOW_TR = ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];
const DOW_EN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function formatDateShort(iso, lang = 'tr') {
  if (!iso) return { day: '—', mo: '', dow: '—' };
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return { day: '—', mo: '', dow: '—' };
  const mo = (lang === 'tr' ? MONTH_TR : MONTH_EN)[d.getMonth()];
  const dow = (lang === 'tr' ? DOW_TR : DOW_EN)[d.getDay()];
  return { day: String(d.getDate()).padStart(2, '0'), mo, dow };
}

// ─── Store: localStorage-backed booking ──────────────────────────
const BOOKING_KEY = 'thy-route-booking-v1';
const DEFAULT_BOOKING = () => {
  const dep = plusDaysISO(todayISO(), 7);
  const ret = plusDaysISO(dep, 7);
  return {
    fromCode: 'IST',
    toCode:   'FCO',
    depDate:  dep,
    retDate:  ret,
    tripType: 'round', // round | one | multi
    passengers: { adt: 1, chd: 0, inf: 0 },
    cabin: 'economy', // economy | business | first
    fareFamily: null, // EcoFly | ExtraFly | PrimeFly | BusinessPrime
    selectedFlightId: null,
    outbound: null,   // { code, dep, arr, dur, fareName, price }
    returnSel: null,  // same shape, null for one-way
    pnr: null,
    seat: null,
    bags: 0,
    pendingPnr: '', // for PNR modal input
  };
};
function loadBooking() {
  try {
    const raw = localStorage.getItem(BOOKING_KEY);
    if (!raw) return DEFAULT_BOOKING();
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_BOOKING(), ...parsed };
  } catch (e) { return DEFAULT_BOOKING(); }
}
function saveBooking(b) {
  try { localStorage.setItem(BOOKING_KEY, JSON.stringify(b)); } catch (e) {}
}

// Cross-component sync: any setBooking notifies every useBooking() consumer
const __bookingListeners = new Set();
function __notifyBooking(b) { __bookingListeners.forEach(fn => { try { fn(b); } catch (e) {} }); }

function useBooking() {
  const [booking, _setBooking] = React.useState(() => loadBooking());
  React.useEffect(() => {
    const onChange = (b) => _setBooking(b);
    __bookingListeners.add(onChange);
    return () => __bookingListeners.delete(onChange);
  }, []);
  const setBooking = React.useCallback((patch) => {
    _setBooking(prev => {
      const next = (typeof patch === 'function') ? patch(prev) : { ...prev, ...patch };
      saveBooking(next);
      // notify others on next tick to avoid setState-during-render
      Promise.resolve().then(() => __notifyBooking(next));
      return next;
    });
  }, []);
  const helpers = React.useMemo(() => ({
    setRoute: (from, to) => setBooking(b => ({ ...b, fromCode: from, toCode: to })),
    swap:     () => setBooking(b => ({ ...b, fromCode: b.toCode, toCode: b.fromCode })),
    reset:    () => { const fresh = DEFAULT_BOOKING(); saveBooking(fresh); _setBooking(fresh); Promise.resolve().then(() => __notifyBooking(fresh)); },
    paxTotal: (booking.passengers.adt + booking.passengers.chd + booking.passengers.inf),
    from: findCity(booking.fromCode),
    to:   findCity(booking.toCode),
  }), [booking, setBooking]);
  return [booking, setBooking, helpers];
}

// ─── City autocomplete input ─────────────────────────────────────
// Used in: homepage hero search strip, search page, anywhere the user
// has to pick "from" or "to". Dropdown opens on focus, filters as user types,
// keyboard-navigable (↑/↓/Enter/Esc).
function CityAutocomplete({
  value, onChange, label, side = 'from', otherSide,
  accent = { bg: '#B7312C', fg: '#C5A059', glow: 'rgba(183,49,44,0.25)' },
  lang = 'tr', dark = false, compact = false,
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const wrapRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const selected = findCity(value);

  // close on outside click
  React.useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  // filter cities
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = WEB_CITIES.filter(c => c.code !== otherSide);
    if (!q) return base;
    return base.filter(c => {
      if (c.code.toLowerCase().includes(q)) return true;
      if (c.city.toLowerCase().includes(q)) return true;
      if (c.country.toLowerCase().includes(q)) return true;
      if (c.airport.toLowerCase().includes(q)) return true;
      return c.tags.some(tag => tag.startsWith(q));
    });
  }, [query, otherSide]);

  // group filtered by region
  const grouped = React.useMemo(() => {
    const g = {};
    filtered.forEach(c => { (g[c.group] = g[c.group] || []).push(c); });
    return ['tr','eu','me','af','as','am'].filter(k => g[k] && g[k].length).map(k => ({ key: k, label: GROUP_LABELS[k][lang === 'tr' ? 'tr' : 'en'], items: g[k] }));
  }, [filtered, lang]);

  // flatten for keyboard nav
  const flat = React.useMemo(() => grouped.flatMap(g => g.items), [grouped]);

  React.useEffect(() => { if (active >= flat.length) setActive(0); }, [flat, active]);

  function pick(c) {
    onChange?.(c.code);
    setOpen(false);
    setQuery('');
    inputRef.current?.blur();
  }
  function onKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(flat.length-1, a+1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a-1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (flat[active]) pick(flat[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
  }

  const containerStyle = {
    position: 'relative',
    padding: compact ? '10px 14px' : '14px 16px',
    border: dark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #E2E8F0',
    borderRadius: 10,
    background: dark ? 'rgba(255,255,255,0.04)' : '#fff',
    cursor: 'text',
    outline: open ? `2px solid ${accent.fg}` : 'none',
    outlineOffset: -1,
    transition: 'outline 150ms',
  };
  const labelStyle = {
    fontSize: 9, fontWeight: 800, letterSpacing: 1.8,
    color: dark ? '#94A3B8' : '#94A3B8',
    textTransform: 'uppercase',
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div style={containerStyle} onClick={() => { setOpen(true); inputRef.current?.focus(); }}>
        <div style={labelStyle}>{label}</div>
        {open ? (
          <input
            ref={inputRef}
            type="text"
            autoFocus
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder={selected ? `${selected.code} · ${selected.city}` : (lang === 'tr' ? 'Şehir veya havalimanı' : 'City or airport')}
            style={{
              width: '100%', border: 'none', background: 'transparent', outline: 'none',
              marginTop: 4, padding: 0,
              fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 700,
              color: dark ? '#fff' : '#0A1628',
            }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
            {selected ? <>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: compact ? 22 : 26, color: dark ? '#fff' : '#0A1628', letterSpacing: 0.5 }}>{selected.code}</span>
              <span style={{ fontSize: compact ? 13 : 15, color: dark ? '#fff' : '#0A1628', fontWeight: 600 }}>{selected.city}</span>
            </> : <span style={{ fontSize: 14, color: '#94A3B8' }}>{lang === 'tr' ? 'Seçin' : 'Select'}</span>}
          </div>
        )}
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, zIndex: 50,
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10,
          boxShadow: '0 20px 60px rgba(10,22,40,0.18)',
          maxHeight: 360, overflowY: 'auto',
          color: '#0A1628',
        }}>
          {flat.length === 0 ? (
            <div style={{ padding: '20px 16px', fontSize: 13, color: '#94A3B8', textAlign: 'center' }}>
              {lang === 'tr' ? 'Sonuç yok' : 'No matches'}
            </div>
          ) : grouped.map(g => (
            <div key={g.key}>
              <div style={{
                padding: '10px 14px 6px', fontSize: 9, fontWeight: 800, letterSpacing: 2,
                color: '#94A3B8', textTransform: 'uppercase',
                background: '#F8FAFC', borderBottom: '1px solid #F1F5F9',
              }}>{g.label}</div>
              {g.items.map((c) => {
                const idx = flat.indexOf(c);
                const isActive = idx === active;
                return (
                  <button key={c.code} type="button" onClick={() => pick(c)}
                    onMouseEnter={() => setActive(idx)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px', border: 'none',
                      background: isActive ? `${accent.glow}` : 'transparent',
                      cursor: 'pointer', textAlign: 'left',
                    }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 14,
                      color: isActive ? accent.bg : '#0A1628', letterSpacing: 1,
                      width: 40,
                    }}>{c.code}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0A1628' }}>{c.city}</div>
                      <div style={{ fontSize: 10.5, color: '#64748B' }}>{c.airport} · {c.country}</div>
                    </div>
                    {isActive && <span style={{ color: accent.bg, fontWeight: 700 }}>↵</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Date picker cell ────────────────────────────────────────────
// Shows a labelled day/month/dow chip. Click → opens a calendar dropdown.
// `minISO` lets you forbid earlier dates (e.g. return ≥ depart).
// `disabledText` (e.g. "—") collapses the cell to a placeholder for one-way.
function DatePickerCell({ label, value, onChange, lang = 'tr', minISO, disabled = false, disabledText = '—', dark = false }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const fmt = formatDateShort(value, lang);
  const labelStyle = { fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: '#94A3B8', textTransform: 'uppercase' };

  if (disabled) {
    return (
      <div style={{ padding: '14px 16px', background: dark ? 'rgba(255,255,255,0.04)' : '#fff', border: dark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #E2E8F0', borderRadius: 10, opacity: 0.55 }}>
        <div style={labelStyle}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 26, color: dark ? '#fff' : '#0A1628' }}>{disabledText}</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        display: 'block', width: '100%', textAlign: 'left',
        padding: '14px 16px',
        background: dark ? 'rgba(255,255,255,0.04)' : '#fff',
        border: dark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #E2E8F0',
        borderRadius: 10, cursor: 'pointer',
        outline: open ? '2px solid #C5A059' : 'none', outlineOffset: -1,
      }}>
        <div style={labelStyle}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 26, color: dark ? '#fff' : '#0A1628' }}>{fmt.day}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: dark ? '#fff' : '#0A1628' }}>{fmt.mo}</span>
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{fmt.dow}</div>
      </button>
      {open && (
        <CalendarPopover
          value={value}
          minISO={minISO || todayISO()}
          lang={lang}
          onPick={(iso) => { onChange?.(iso); setOpen(false); }}
        />
      )}
    </div>
  );
}

function CalendarPopover({ value, minISO, lang, onPick }) {
  const init = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(value + 'T00:00:00') : new Date();
  const [view, setView] = React.useState({ y: init.getFullYear(), m: init.getMonth() });
  function monthsShift(n) { setView(v => {
    const d = new Date(v.y, v.m + n, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  }); }
  const first = new Date(view.y, view.m, 1);
  const startDow = (first.getDay() + 6) % 7; // Mon-first
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  const monthName = (lang === 'tr' ? ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'] : ['January','February','March','April','May','June','July','August','September','October','November','December'])[view.m];
  const dowH = lang === 'tr' ? ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'] : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const min = new Date((minISO || todayISO()) + 'T00:00:00');
  const sel = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(value + 'T00:00:00') : null;

  return (
    <div style={{
      position: 'absolute', top: '100%', left: 0, marginTop: 6, zIndex: 60,
      background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
      boxShadow: '0 22px 60px rgba(10,22,40,0.22)',
      padding: 14, width: 300, color: '#0A1628',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button type="button" onClick={() => monthsShift(-1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer', color: '#0A1628', fontWeight: 700 }}>‹</button>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 14 }}>{monthName} {view.y}</div>
        <button type="button" onClick={() => monthsShift(1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer', color: '#0A1628', fontWeight: 700 }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
        {dowH.map(d => <div key={d} style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 800, letterSpacing: 1, textAlign: 'center', textTransform: 'uppercase' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((d, i) => {
          if (d == null) return <div key={i} />;
          const date = new Date(view.y, view.m, d);
          const iso = date.toISOString().slice(0,10);
          const isDisabled = date < min;
          const isSelected = sel && date.toDateString() === sel.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <button key={i} type="button"
              disabled={isDisabled}
              onClick={() => onPick(iso)}
              style={{
                padding: '8px 0', borderRadius: 6, border: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                background: isSelected ? '#B7312C' : (isToday ? 'rgba(197,160,89,0.18)' : 'transparent'),
                color: isSelected ? '#fff' : isDisabled ? '#CBD5E1' : '#0A1628',
                outline: isToday && !isSelected ? '1px solid #C5A059' : 'none',
                outlineOffset: -1,
              }}>{d}</button>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, {
  WEB_CITIES, findCity, distanceFor, durationFor, priceFor, formatPriceTL,
  makePNR, todayISO, plusDaysISO, formatDateShort,
  useBooking, CityAutocomplete, DatePickerCell,
});
