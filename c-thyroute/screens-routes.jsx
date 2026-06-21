/* deploy/screens-routes.jsx — Mobil entegrasyon
   SavedRoutesScreen (Kayıtlı Rotalarım) + PaymentOptionsScreen (Ödeme)
   Her ekran props: ({ t, setTweak, nav, k }) — diğer screens-*.jsx ile aynı kontrat. */

const KR_ROUTES_DATA = [
  {
    id: 'TRIP-0042', name: 'Roma + Antalya Yaz Turu',
    legs: ['IST', 'FCO', 'AYT'], dates: '17 – 24 Haz 2026',
    pax: '2 yetişkin', pnr: 'TK-X9K2P', miles: '+3 960',
    price: '12 840,00', status: { label: 'ÖDEME BEKLİYOR', tone: 'gold' },
    cabin: 'EcoFly', eta: 'Son ödeme · 30 Haz 23:59',
  },
  {
    id: 'TRIP-0039', name: 'Tokyo İş Seyahati',
    legs: ['IST', 'HND'], dates: '04 – 11 Tem 2026',
    pax: '1 yetişkin', pnr: 'TK-7H4LDQ', miles: '+11 280',
    price: '38 250,00', status: { label: 'TASLAK', tone: 'blue' },
    cabin: 'BusinessPrime', eta: 'Fiyat değişebilir',
  },
  {
    id: 'TRIP-0037', name: 'Kapadokya Hafta Sonu',
    legs: ['SAW', 'ASR'], dates: '12 – 14 Eyl 2026',
    pax: '2 yetişkin · 1 çocuk', pnr: 'TK-M2N8RB', miles: '+ 840',
    price: '6 480,00', status: { label: 'PLANLANIYOR', tone: 'navy' },
    cabin: 'EcoFly', eta: 'Fiyat alarmı aktif',
  },
];

function KRPill({ tone, label }) {
  const palette = {
    gold: { bg: 'rgba(197,160,89,0.16)', bd: 'rgba(197,160,89,0.45)', fg: '#9C7B36' },
    blue: { bg: 'rgba(0,83,165,0.10)',   bd: 'rgba(0,83,165,0.32)',   fg: '#0053A5' },
    navy: { bg: 'rgba(10,22,40,0.06)',   bd: 'rgba(10,22,40,0.16)',   fg: '#0A1628' },
  }[tone] || { bg: '#F1F5F9', bd: '#E2E8F0', fg: '#0A1628' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 999,
      background: palette.bg, border: `1px solid ${palette.bd}`,
      fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: 1.4,
      fontWeight: 800, color: palette.fg, textTransform: 'uppercase',
    }}>
      <span style={{ width: 4, height: 4, borderRadius: 999, background: palette.fg }} />
      {label}
    </span>
  );
}

function KRSegBar({ codes }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      {codes.map((c, i) => (
        <React.Fragment key={c + i}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12,
            letterSpacing: 1.2, color: '#0A1628',
            padding: '3px 7px', borderRadius: 5,
            background: '#F3F5F8', border: '1px solid #E2E8F0',
          }}>{c}</span>
          {i < codes.length - 1 && (
            <svg width="18" height="9" viewBox="0 0 22 10" aria-hidden="true">
              <path d="M 1 5 L 17 5" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="2 2" />
              <path d="M 17 5 L 13 2 M 17 5 L 13 8" stroke="#B7312C" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   24 · Kayıtlı Rotalarım (Mobil) — light, screen 24
   ──────────────────────────────────────────────────────────────────── */

function SavedRoutesScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const [items, setItems] = React.useState(KR_ROUTES_DATA);
  const [confirmId, setConfirmId] = React.useState(null);
  const [sharedId, setSharedId] = React.useState(null);
  const toast = (typeof useToast === 'function') ? useToast() : null;

  const remove = (id) => {
    setItems(items.filter(x => x.id !== id));
    setConfirmId(null);
    toast && toast({ type: 'success', icon: '✓', children: u.lang === 'tr' ? 'Rota silindi' : 'Route deleted' });
  };
  const share = (id, pnr) => {
    setSharedId(id);
    toast && toast({ type: 'success', icon: '🔗', children: u.lang === 'tr' ? `Bağlantı kopyalandı · thy.r/${pnr.toLowerCase()}` : `Link copied · thy.r/${pnr.toLowerCase()}` });
    setTimeout(() => setSharedId(null), 1600);
  };
  const payNow = (route) => {
    // Persist selected route in localStorage so the Payment screen reads it
    try {
      localStorage.setItem('thy-route-pay-target-v1', JSON.stringify(route));
    } catch (_) {}
    nav('payment');
  };

  return (
    <div className="thy-screen is-light screen-enter" style={{
      position: 'relative', minHeight: '100%',
      background: '#F7F8FB', color: '#0A1628',
      fontFamily: u.font, paddingTop: topPad,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{ padding: '8px 14px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => nav('profile')} style={krIconBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A1628" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: 2, color: '#C5A059', fontWeight: 800 }}>
            ✦ {u.lang === 'tr' ? 'PROFİL · ROTALARIM' : 'PROFILE · ROUTES'}
          </span>
        </div>
        <button style={krIconBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A1628" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: '4px 18px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 700,
          fontSize: 24, margin: 0, lineHeight: 1.1, letterSpacing: -0.4,
        }}>
          {u.lang === 'tr' ? 'Kayıtlı Rotalarım' : 'Saved Routes'}
        </h1>
        <div style={{ fontSize: 10.5, color: '#64748B' }}>
          {items.length} {u.lang === 'tr' ? 'rota · senkronlandı 2 dk önce' : 'routes · synced 2 min ago'}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '8px 14px 4px', overflow: 'auto', flexShrink: 0 }}>
        {(u.lang === 'tr'
          ? ['Tümü', 'Planlanan', 'Ödeme bekleyen', 'Tamamlanan']
          : ['All', 'Planned', 'Awaiting payment', 'Completed']
        ).map((tab, i) => (
          <span key={tab} style={{
            padding: '5px 9px', borderRadius: 999, fontSize: 10, fontWeight: 700,
            background: i === 0 ? '#0A1628' : '#fff',
            color: i === 0 ? '#fff' : '#64748B',
            border: i === 0 ? '1px solid #0A1628' : '1px solid #E2E8F0',
            whiteSpace: 'nowrap',
          }}>{tab}</span>
        ))}
      </div>

      {/* List */}
      <div style={{
        flex: 1, overflow: 'auto', padding: '4px 12px 12px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {items.map(r => (
          <article key={r.id} style={{
            background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
            padding: 12, boxShadow: '0 4px 14px rgba(10,22,40,0.05)',
            display: 'flex', flexDirection: 'column', gap: 9, position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <KRPill tone={r.status.tone} label={u.lang === 'tr' ? r.status.label : r.status.label} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: '#94A3B8', letterSpacing: 1.2 }}>
                {r.id}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, letterSpacing: -0.2, color: '#0A1628' }}>
                {r.name}
              </h3>
              <div style={{ fontSize: 10, color: '#64748B' }}>
                {r.dates} · {r.pax} · {r.cabin}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <KRSegBar codes={r.legs} />
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                padding: '3px 7px', borderRadius: 5,
                background: 'rgba(197,160,89,0.10)', border: '1px solid rgba(197,160,89,0.35)',
                fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 800,
                color: '#9C7B36', letterSpacing: 0.4,
              }}>✦ {r.miles} mil</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              borderTop: '1px dashed #E2E8F0', paddingTop: 8,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 9, color: '#94A3B8', letterSpacing: 1.2, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {u.lang === 'tr' ? 'TOPLAM' : 'TOTAL'}
                </span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#0A1628', lineHeight: 1 }}>
                  {r.price} <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>TL</span>
                </span>
              </div>
              <span style={{ fontSize: 9.5, color: r.status.tone === 'gold' ? '#B7312C' : '#64748B', fontWeight: 600, textAlign: 'right', maxWidth: 120 }}>
                {r.eta}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 5 }}>
              <button onClick={() => share(r.id, r.pnr)} style={krMiniBtn}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>
                {u.lang === 'tr' ? 'Paylaş' : 'Share'}
              </button>
              <button onClick={() => setConfirmId(r.id)} style={{ ...krMiniBtn, color: '#B7312C' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                {u.lang === 'tr' ? 'Sil' : 'Delete'}
              </button>
              <button onClick={() => payNow(r)} style={{
                flex: 1.4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                background: '#B7312C', color: '#fff', border: 'none', borderRadius: 8,
                padding: '9px 10px', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 6px 14px rgba(183,49,44,0.30)',
              }}>
                {u.lang === 'tr' ? 'Öde →' : 'Pay →'}
              </button>
            </div>

            {confirmId === r.id && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.94)',
                backdropFilter: 'blur(4px)', borderRadius: 12,
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                padding: 14, gap: 8, textAlign: 'center',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1.8, color: '#B7312C', fontWeight: 800 }}>
                  {u.lang === 'tr' ? 'ROTAYI SİL' : 'DELETE ROUTE'}
                </span>
                <span style={{ fontSize: 12, color: '#0A1628', fontWeight: 600 }}>"{r.name}"?</span>
                <span style={{ fontSize: 10, color: '#64748B' }}>{u.lang === 'tr' ? 'Geri alınamaz.' : 'Cannot be undone.'}</span>
                <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                  <button onClick={() => setConfirmId(null)} style={krMiniBtn}>
                    {u.lang === 'tr' ? 'Vazgeç' : 'Cancel'}
                  </button>
                  <button onClick={() => remove(r.id)} style={{
                    background: '#B7312C', color: '#fff', border: 'none', borderRadius: 8,
                    padding: '8px 14px', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                  }}>{u.lang === 'tr' ? 'Sil' : 'Delete'}</button>
                </div>
              </div>
            )}
          </article>
        ))}

        <button onClick={() => nav('search')} style={{
          marginTop: 2, padding: '10px 12px',
          background: 'transparent', border: '1.5px dashed #CBD5E1',
          borderRadius: 10, color: '#64748B', fontSize: 11, fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          {u.lang === 'tr' ? 'Yeni rota oluştur' : 'Create new route'}
        </button>
      </div>
    </div>
  );
}

const krIconBtn = {
  width: 28, height: 28, borderRadius: 9, background: '#fff',
  border: '1px solid #E2E8F0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};
const krMiniBtn = {
  flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
  background: '#F3F5F8', color: '#0A1628', border: '1px solid #E2E8F0',
  borderRadius: 8, padding: '8px 6px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
};

/* ────────────────────────────────────────────────────────────────────
   25 · Ödeme (Mobil) — Miles&Smiles + TK Pay vurgulu
   ──────────────────────────────────────────────────────────────────── */

function PaymentOptionsScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const [method, setMethod] = React.useState('miles');
  const toast = (typeof useToast === 'function') ? useToast() : null;

  // Read selected route (from SavedRoutesScreen) — fallback default
  const trip = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('thy-route-pay-target-v1');
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return KR_ROUTES_DATA[0];
  }, []);

  const fareNum = (parseFloat(String(trip.price).replace(/[^\d,]/g, '').replace(',', '.')) || 0);
  const taxes = '1 245,00';
  const fareStr = (fareNum - 1245).toLocaleString('tr-TR', { minimumFractionDigits: 2 });

  const pay = () => {
    toast && toast({ type: 'info', icon: '⟳', children: u.lang === 'tr' ? 'Ödeme işleniyor…' : 'Processing payment…' });
    setTimeout(() => {
      toast && toast({ type: 'success', icon: '✓', children: u.lang === 'tr' ? 'Ödeme onaylandı' : 'Payment approved' });
      setTimeout(() => nav('confirm'), 700);
    }, 1400);
  };

  return (
    <div className="thy-screen is-light screen-enter" style={{
      position: 'relative', minHeight: '100%',
      background: '#F7F8FB', color: '#0A1628',
      fontFamily: u.font, paddingTop: topPad,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{ padding: '8px 14px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => nav('routes')} style={krIconBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A1628" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: 2, color: '#C5A059', fontWeight: 800 }}>
            ✦ {u.lang === 'tr' ? 'ROTALARIM · ÖDEME' : 'ROUTES · PAYMENT'}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: '#94A3B8', letterSpacing: 1.4 }}>
            {trip.id} · {trip.pnr}
          </span>
        </div>
        <div style={{ width: 28 }} />
      </div>

      {/* Hero */}
      <div style={{ padding: '6px 18px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: 2.2, color: '#64748B', fontWeight: 800 }}>
          {u.lang === 'tr' ? 'ÖDENECEK TUTAR' : 'AMOUNT DUE'}
        </span>
        <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 30, letterSpacing: -1, lineHeight: 1 }}>
          {trip.price} <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#64748B', fontWeight: 700 }}>TL</span>
        </h1>
        <KRSegBar codes={trip.legs} />
        <div style={{ fontSize: 10, color: '#64748B' }}>
          {trip.name} · {trip.pax} · {trip.cabin}
        </div>
      </div>

      {/* Methods scroll */}
      <div style={{ flex: 1, overflow: 'auto', padding: '10px 12px 10px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: 1.8, color: '#C5A059', fontWeight: 800 }}>
            ✦ {u.lang === 'tr' ? 'SİZE ÖZEL ÖNERİLEN' : 'RECOMMENDED FOR YOU'}
          </span>
          <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(197,160,89,0.4), transparent)' }} />
        </div>

        {/* Miles&Smiles */}
        <button onClick={() => setMethod('miles')} style={krBigCardBtn()}>
          <div style={{
            borderRadius: 12, padding: '12px 12px',
            background: method === 'miles'
              ? 'linear-gradient(135deg, #1A1206 0%, #3B2A11 55%, #6B4C1B 100%)'
              : 'linear-gradient(135deg, #2A1F0E 0%, #4A3618 55%, #6B4C1B 100%)',
            border: method === 'miles' ? '1.5px solid #C5A059' : '1.5px solid rgba(197,160,89,0.3)',
            boxShadow: method === 'miles' ? '0 10px 22px rgba(197,160,89,0.30)' : '0 4px 14px rgba(0,0,0,0.18)',
            color: '#F5E9CB', display: 'flex', flexDirection: 'column', gap: 8,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.55,
              background: 'radial-gradient(140% 70% at 90% -20%, rgba(255,220,140,0.35), transparent 60%)',
              pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 2, color: '#E5C97A', fontWeight: 800 }}>
                  TURKISH AIRLINES
                </span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 800, color: '#F5E9CB', letterSpacing: -0.2 }}>
                  Miles<span style={{ color: '#C5A059' }}>&</span>Smiles
                </span>
              </div>
              <span style={{
                padding: '3px 7px', borderRadius: 999,
                background: '#C5A059', color: '#1A1206',
                fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 800, letterSpacing: 1.2,
              }}>{u.lang === 'tr' ? 'ÖNERİLEN' : 'RECOMMENDED'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 9.5, color: '#E5C97A' }}>
                  {u.lang === 'tr' ? 'Kullanılabilir mil' : 'Available miles'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 800, color: '#F5E9CB' }}>
                  48 720
                </span>
                <span style={{ fontSize: 9, color: '#E5C97A', opacity: 0.85 }}>
                  ≈ 13 460 TL · {u.lang === 'tr' ? 'bu rota için yeterli' : 'enough for this route'}
                </span>
              </div>
              <div style={krRadioOuter('#C5A059', method === 'miles')}>
                {method === 'miles' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1A1206" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            </div>
          </div>
        </button>

        {/* TK Pay */}
        <button onClick={() => setMethod('tkpay')} style={krBigCardBtn()}>
          <div style={{
            borderRadius: 12, padding: '12px 12px',
            background: method === 'tkpay'
              ? 'linear-gradient(135deg, #050B14 0%, #0A1628 55%, #B7312C 145%)'
              : 'linear-gradient(135deg, #0A1628 0%, #122E55 55%, #1A3766 100%)',
            border: method === 'tkpay' ? '1.5px solid #EF2E1F' : '1.5px solid rgba(255,255,255,0.10)',
            boxShadow: method === 'tkpay' ? '0 10px 22px rgba(183,49,44,0.28)' : '0 4px 14px rgba(0,0,0,0.18)',
            color: '#F4EBD9', display: 'flex', flexDirection: 'column', gap: 8,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.55,
              background: 'radial-gradient(120% 70% at 100% 110%, rgba(239,46,31,0.35), transparent 55%)',
              pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: '#B7312C', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(239,46,31,0.5)',
                }}>
                  <svg viewBox="0 0 100 100" width="18" height="18" fill="none" aria-hidden="true">
                    <path d="M15 55 Q35 35 55 45 L75 38 Q82 36 88 42 L92 50 L78 52 Q70 56 60 55 L45 60 Q30 64 18 60 Z" fill="#fff"/>
                    <circle cx="86" cy="46" r="2.5" fill="#B7312C"/>
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 2, color: '#C5A059', fontWeight: 800 }}>
                    {u.lang === 'tr' ? 'THY DİJİTAL CÜZDAN' : 'THY DIGITAL WALLET'}
                  </span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: -0.2 }}>
                    TK <span style={{ color: '#EF2E1F' }}>Pay</span>
                  </span>
                </div>
              </div>
              <span style={{
                padding: '3px 7px', borderRadius: 999,
                background: '#EF2E1F', color: '#fff',
                fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 800, letterSpacing: 1.2,
              }}>{u.lang === 'tr' ? 'HIZLI' : 'FAST'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 9.5, color: '#C5D4EA' }}>
                  {u.lang === 'tr' ? 'TK Pay bakiye' : 'TK Pay balance'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 800, color: '#fff' }}>
                  4 250,00 <span style={{ fontSize: 9, opacity: 0.7 }}>TL</span>
                </span>
                <span style={{ fontSize: 9, color: '#C5D4EA', opacity: 0.85 }}>
                  {u.lang === 'tr' ? 'Tek dokunuş · 3D secure\'suz · %2 mil iadesi' : 'One tap · no 3D · 2% miles back'}
                </span>
              </div>
              <div style={krRadioOuter('#EF2E1F', method === 'tkpay')}>
                {method === 'tkpay' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            </div>
          </div>
        </button>

        {/* Other methods */}
        <div style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
          padding: '4px 0',
        }}>
          <div style={{ padding: '6px 10px 2px', fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: 1.8, color: '#64748B', fontWeight: 800 }}>
            {u.lang === 'tr' ? 'DİĞER YÖNTEMLER' : 'OTHER METHODS'}
          </div>
          <KRPayRow active={method === 'card'} onClick={() => setMethod('card')}
            brand={<div style={krBrandChip('#0053A5')}>VISA</div>}
            title={u.lang === 'tr' ? 'Kayıtlı kart · •••• 4218' : 'Saved card · •••• 4218'}
            sub="A. KAYA · 08/27" />
          <KRRowDivider />
          <KRPayRow active={method === 'apple'} onClick={() => setMethod('apple')}
            brand={<div style={krBrandChip('#000')}><span style={{ fontFamily: '-apple-system,sans-serif', fontSize: 10, fontWeight: 600 }}> Pay</span></div>}
            title="Apple Pay" sub={u.lang === 'tr' ? 'Face ID ile onaylayın' : 'Approve with Face ID'} />
          <KRRowDivider />
          <KRPayRow active={method === 'bank'} onClick={() => setMethod('bank')}
            brand={<div style={krBrandChip('#16A34A')}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M3 21h18M5 21V11l7-6 7 6v10M9 21v-6h6v6"/></svg></div>}
            title={u.lang === 'tr' ? 'Banka havalesi · FAST' : 'Bank transfer · FAST'}
            sub={u.lang === 'tr' ? '24 saat içinde onay' : 'Approved in 24h'} />
        </div>

        {/* Bill */}
        <div style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
          padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <KRBillRow label={u.lang === 'tr' ? 'Bilet ücreti' : 'Fare'} value={`${fareStr} TL`} />
          <KRBillRow label={u.lang === 'tr' ? 'Vergi ve harçlar' : 'Taxes & fees'} value={`${taxes} TL`} />
          <KRBillRow label={u.lang === 'tr' ? 'Miles&Smiles iadesi' : 'Miles&Smiles back'} value={`✦ ${trip.miles}`} accent="#C5A059" />
          <div style={{ height: 1, background: '#E2E8F0', margin: '4px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 11, fontWeight: 700 }}>{u.lang === 'tr' ? 'Toplam' : 'Total'}</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700 }}>
              {trip.price} <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#64748B' }}>TL</span>
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '8px 12px 14px', background: '#F7F8FB', borderTop: '1px solid #E2E8F0' }}>
        <button onClick={pay} style={{
          width: '100%', padding: '12px 14px', borderRadius: 11, border: 'none', cursor: 'pointer',
          background: '#B7312C', color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 0.2,
          boxShadow: '0 8px 22px rgba(183,49,44,0.32)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {u.lang === 'tr'
            ? (method === 'miles' ? 'Miles ile Öde' : method === 'tkpay' ? 'TK Pay ile Öde' : 'Ödemeyi Tamamla')
            : (method === 'miles' ? 'Pay with Miles' : method === 'tkpay' ? 'Pay with TK Pay' : 'Complete Payment')
          } · {trip.price} TL
        </button>
        <div style={{ textAlign: 'center', marginTop: 6, fontSize: 9, color: '#64748B' }}>
          🛡 KVKK · 3D Secure · 256-bit
        </div>
      </div>
    </div>
  );
}

function krBigCardBtn() {
  return { textAlign: 'left', cursor: 'pointer', border: 'none', padding: 0, background: 'transparent', borderRadius: 12 };
}
function krRadioOuter(color, active) {
  return {
    width: 20, height: 20, borderRadius: 999, border: '2px solid ' + color,
    background: active ? color : 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
}
function KRRowDivider() { return <div style={{ height: 1, background: '#F1F5F9', margin: '0 10px' }} />; }
function KRPayRow({ active, onClick, brand, title, sub }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 10px', cursor: 'pointer', borderRadius: 8,
      background: active ? '#F3F5F8' : 'transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {brand}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 11.5, fontWeight: 700 }}>{title}</span>
          <span style={{ fontSize: 10, color: '#64748B' }}>{sub}</span>
        </div>
      </div>
      <div style={{
        width: 16, height: 16, borderRadius: 999,
        border: '2px solid ' + (active ? '#0A1628' : '#CBD5E1'),
        background: active ? '#0A1628' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {active && <div style={{ width: 5, height: 5, borderRadius: 999, background: '#fff' }} />}
      </div>
    </div>
  );
}
function krBrandChip(bg) {
  return {
    width: 34, height: 22, borderRadius: 5, background: bg, color: '#fff',
    fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 800,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 0.4,
  };
}
function KRBillRow({ label, value, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
      <span style={{ color: '#64748B' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: accent || '#0A1628' }}>{value}</span>
    </div>
  );
}

Object.assign(window, { SavedRoutesScreen, PaymentOptionsScreen });
