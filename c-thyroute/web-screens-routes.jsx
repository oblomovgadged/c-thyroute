/* deploy/web-screens-routes.jsx — Web entegrasyon
   WebSavedRoutesScreen + WebPaymentOptionsScreen
   Props: ({ t, setTweak, nav }) — diğer web-screens-*.jsx ile aynı. */

const WEB_KR_ROUTES = [
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

function WebKRPill({ tone, label }) {
  const palette = {
    gold: { bg: 'rgba(197,160,89,0.16)', bd: 'rgba(197,160,89,0.45)', fg: '#C5A059' },
    blue: { bg: 'rgba(0,83,165,0.12)',   bd: 'rgba(0,83,165,0.32)',   fg: '#7AB1FF' },
    navy: { bg: 'rgba(255,255,255,0.06)',bd: 'rgba(255,255,255,0.16)',fg: '#B2C0D1' },
  }[tone] || { bg: '#F1F5F9', bd: '#E2E8F0', fg: '#0A1628' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      background: palette.bg, border: `1px solid ${palette.bd}`,
      fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: 1.6,
      fontWeight: 800, color: palette.fg, textTransform: 'uppercase',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 999, background: palette.fg }} />
      {label}
    </span>
  );
}

function WebKRSegBar({ codes }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      {codes.map((c, i) => (
        <React.Fragment key={c + i}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 13,
            letterSpacing: 1.4, color: '#F4EBD9',
            padding: '4px 9px', borderRadius: 6,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}>{c}</span>
          {i < codes.length - 1 && (
            <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true">
              <path d="M 1 5 L 18 5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeDasharray="2 2" />
              <path d="M 18 5 L 14 2 M 18 5 L 14 8" stroke="#C5A059" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   23 · Kayıtlı Rotalarım (Web) — dark glass cockpit
   ──────────────────────────────────────────────────────────────────── */

function WebSavedRoutesScreen({ t, setTweak, nav }) {
  const u = useThyTweaks(t, { dark: true });
  const toast = (typeof useToast === 'function') ? useToast() : null;
  const [items, setItems] = React.useState(() => {
    let extra = [];
    try { extra = JSON.parse(localStorage.getItem('thy-route-extra-saved-v1') || '[]'); } catch (_) {}
    return [...extra, ...WEB_KR_ROUTES];
  });
  const [confirmId, setConfirmId] = React.useState(null);

  const remove = (id) => {
    setItems(items.filter(x => x.id !== id));
    // also strip from localStorage so removed routes don't reappear
    try {
      const extra = JSON.parse(localStorage.getItem('thy-route-extra-saved-v1') || '[]');
      localStorage.setItem('thy-route-extra-saved-v1', JSON.stringify(extra.filter(x => x.id !== id)));
    } catch (_) {}
    setConfirmId(null);
    toast && toast({ type: 'success', icon: '✓', children: u.lang === 'tr' ? 'Rota silindi' : 'Route deleted' });
  };
  const share = (pnr) => {
    toast && toast({ type: 'success', icon: '🔗', children: u.lang === 'tr' ? `Bağlantı kopyalandı · thy.r/${pnr.toLowerCase()}` : `Link copied · thy.r/${pnr.toLowerCase()}` });
  };
  const payNow = (route) => {
    try { localStorage.setItem('thy-route-pay-target-v1', JSON.stringify(route)); } catch (_) {}
    nav('payment');
  };

  return (
    <PageShell dark style={{
      background: 'radial-gradient(1200px 700px at 80% -10%, rgba(183,49,44,0.18), transparent 60%),'
                 + 'radial-gradient(900px 600px at 5% 110%, rgba(0,83,165,0.18), transparent 55%),'
                 + 'linear-gradient(160deg,#050B14 0%,#0A1628 50%,#102544 100%)',
      color: '#F4EBD9', minHeight: '100%',
    }}>
      <WebTopNav active={'routes'} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} dark />

      <div style={{
        maxWidth: 1440, margin: '0 auto', padding: '32px 36px 36px',
        display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24,
      }}>
        {/* LEFT — Routes */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: 2.4, color: '#C5A059', fontWeight: 800 }}>
                ✦ {u.lang === 'tr' ? 'PROFİL · KAYITLI ROTALARIM' : 'PROFILE · SAVED ROUTES'}
              </span>
              <h1 style={{
                margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 700,
                fontSize: 40, letterSpacing: -0.6, color: '#F4EBD9',
              }}>
                {u.lang === 'tr' ? 'Kayıtlı Rotalarım' : 'Saved Routes'}
              </h1>
              <span style={{ fontSize: 13, color: '#B2C0D1' }}>
                {items.length} {u.lang === 'tr' ? 'rota · cihazlar arası eşitlendi · son güncelleme 2 dk önce' : 'routes · synced across devices · updated 2m ago'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={webKRGhost()}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
                {u.lang === 'tr' ? 'Filtrele' : 'Filter'}
              </button>
              <button onClick={() => nav('search')} style={{
                ...webKRGhost(),
                background: '#B7312C', color: '#fff', border: '1px solid #B7312C',
                boxShadow: '0 8px 22px rgba(183,49,44,0.32)',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                {u.lang === 'tr' ? 'Yeni rota' : 'New route'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {(u.lang === 'tr'
              ? [`Tümü · ${items.length}`, 'Planlanan · ' + items.filter(r => r.status.tone === 'navy').length, 'Ödeme bekleyen · ' + items.filter(r => r.status.tone === 'gold').length, 'Tamamlanan · 0']
              : [`All · ${items.length}`, 'Planned · ' + items.filter(r => r.status.tone === 'navy').length, 'Awaiting payment · ' + items.filter(r => r.status.tone === 'gold').length, 'Completed · 0']
            ).map((tab, i) => (
              <span key={tab} style={{
                padding: '7px 13px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                background: i === 0 ? 'rgba(197,160,89,0.18)' : 'rgba(255,255,255,0.04)',
                border: i === 0 ? '1px solid rgba(197,160,89,0.5)' : '1px solid rgba(255,255,255,0.08)',
                color: i === 0 ? '#C5A059' : '#B2C0D1',
              }}>{tab}</span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(r => (
              <article key={r.id} style={{
                background: 'rgba(255,255,255,0.045)',
                border: '1px solid rgba(255,255,255,0.085)',
                borderRadius: 12, padding: 18,
                display: 'grid', gridTemplateColumns: '1.5fr 1fr auto', gap: 18, alignItems: 'center',
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                  background: r.status.tone === 'gold' ? '#C5A059' : r.status.tone === 'blue' ? '#0053A5' : '#7A8EAF',
                  boxShadow: r.status.tone === 'gold' ? '0 0 14px rgba(197,160,89,0.5)' : 'none',
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <WebKRPill tone={r.status.tone} label={r.status.label} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1.6, color: '#7A8EAF' }}>
                      {r.id} · {r.pnr}
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 21, fontWeight: 700, color: '#F4EBD9', letterSpacing: -0.2 }}>
                    {r.name}
                  </h3>
                  <WebKRSegBar codes={r.legs} />
                  <div style={{ fontSize: 12, color: '#B2C0D1' }}>
                    {r.dates} · {r.pax} · {r.cabin}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', textAlign: 'right' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1.8, color: '#7A8EAF', fontWeight: 800 }}>
                      {u.lang === 'tr' ? 'TOPLAM' : 'TOTAL'}
                    </span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#F4EBD9', lineHeight: 1 }}>
                      {r.price} <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#B2C0D1', fontWeight: 700 }}>TL</span>
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: r.status.tone === 'gold' ? '#EF2E1F' : '#B2C0D1' }}>
                    {r.eta}
                  </span>
                  {/* MİL KAZANCI — bottom-right corner */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, marginTop: 'auto' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1.8, color: '#C5A059', fontWeight: 800 }}>
                      {u.lang === 'tr' ? '✦ MİL KAZANCI' : '✦ MILES EARNED'}
                    </span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'baseline', gap: 5,
                      padding: '4px 10px', borderRadius: 6,
                      background: 'rgba(197,160,89,0.12)', border: '1px solid rgba(197,160,89,0.42)',
                      fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#E5C97A',
                      boxShadow: '0 0 14px rgba(197,160,89,0.18)',
                    }}>
                      <span style={{ fontSize: 14 }}>{r.miles}</span>
                      <span style={{ fontSize: 9.5, letterSpacing: 1.2, color: '#C5A059' }}>{u.lang === 'tr' ? 'MİL' : 'MILES'}</span>
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
                  <button onClick={() => nav('map')} style={{
                    padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
                    background: 'rgba(197,160,89,0.10)',
                    border: '1px solid rgba(197,160,89,0.45)',
                    color: '#E5C97A', fontSize: 13, fontWeight: 800,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    transition: 'all 200ms cubic-bezier(.16,1,.3,1)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197,160,89,0.18)'; e.currentTarget.style.borderColor = '#C5A059'; e.currentTarget.style.boxShadow = '0 0 18px rgba(197,160,89,0.28)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(197,160,89,0.10)'; e.currentTarget.style.borderColor = 'rgba(197,160,89,0.45)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {u.lang === 'tr' ? 'Rotaya git →' : 'Open route →'}
                  </button>
                  <button onClick={() => payNow(r)} style={{
                    padding: '11px 14px', border: 'none', borderRadius: 10, cursor: 'pointer',
                    background: '#B7312C', color: '#fff', fontSize: 13, fontWeight: 800,
                    boxShadow: '0 8px 20px rgba(183,49,44,0.32)',
                  }}>{u.lang === 'tr' ? 'Öde →' : 'Pay →'}</button>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => share(r.pnr)} style={webKRGlassMini()}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>
                      {u.lang === 'tr' ? 'Paylaş' : 'Share'}
                    </button>
                    <button onClick={() => setConfirmId(r.id)} style={{ ...webKRGlassMini(), color: '#EF2E1F', borderColor: 'rgba(239,46,31,0.32)' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                      {u.lang === 'tr' ? 'Sil' : 'Delete'}
                    </button>
                  </div>
                </div>

                {confirmId === r.id && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(10,22,40,0.88)',
                    backdropFilter: 'blur(6px)', borderRadius: 12,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    gap: 10,
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: '#EF2E1F', fontWeight: 800 }}>
                      {u.lang === 'tr' ? 'ROTAYI SİL' : 'DELETE ROUTE'}
                    </span>
                    <span style={{ fontSize: 15, color: '#F4EBD9', fontWeight: 600 }}>"{r.name}"?</span>
                    <span style={{ fontSize: 12, color: '#B2C0D1' }}>{u.lang === 'tr' ? 'Geri alınamaz.' : 'Cannot be undone.'}</span>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                      <button onClick={() => setConfirmId(null)} style={webKRGlassMini()}>{u.lang === 'tr' ? 'Vazgeç' : 'Cancel'}</button>
                      <button onClick={() => remove(r.id)} style={{
                        background: '#B7312C', color: '#fff', border: 'none', borderRadius: 10,
                        padding: '9px 18px', fontSize: 13, fontWeight: 800, cursor: 'pointer',
                      }}>{u.lang === 'tr' ? 'Sil' : 'Delete'}</button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* RIGHT — entry-point + promos */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.085)',
            borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: '#C5A059', fontWeight: 800 }}>
              ✦ {u.lang === 'tr' ? 'ÖDEME SAYFASINA NEREDEN GEÇİLİR' : 'HOW TO REACH PAYMENT'}
            </span>
            <WebKREntryRow num="1" label={u.lang === 'tr' ? 'Üst menü · Rotalarım' : 'Top menu · Routes'} sub="Profil > Kayıtlı Rotalarım" />
            <WebKREntryRow num="2" label={u.lang === 'tr' ? 'Rota kartı · Öde →' : 'Route card · Pay →'} sub={u.lang === 'tr' ? 'Her kayıtlı rotada kırmızı CTA' : 'Red CTA on every saved route'} />
            <WebKREntryRow num="3" label={u.lang === 'tr' ? 'Ödeme · Miles&Smiles / TK Pay' : 'Payment · Miles&Smiles / TK Pay'} sub={u.lang === 'tr' ? 'Önerilen yöntemler önde' : 'Recommended methods first'} />
          </div>

          <div style={{
            position: 'relative', overflow: 'hidden', borderRadius: 12, padding: 18,
            background: 'linear-gradient(135deg, #0A1628 0%, #122E55 60%, #B7312C 140%)',
            border: '1px solid rgba(239,46,31,0.32)',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.6,
              background: 'radial-gradient(120% 80% at 100% 110%, rgba(239,46,31,0.45), transparent 55%)',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2.4, color: '#C5A059', fontWeight: 800, position: 'relative' }}>
              ✦ {u.lang === 'tr' ? 'YENİ · THY DİJİTAL CÜZDAN' : 'NEW · THY DIGITAL WALLET'}
            </span>
            <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#fff', position: 'relative' }}>
              TK <span style={{ color: '#EF2E1F' }}>Pay</span> {u.lang === 'tr' ? 'ile tek dokunuş' : '· one-tap pay'}
            </h3>
            <p style={{ margin: 0, fontSize: 12.5, color: '#C5D4EA', lineHeight: 1.5, position: 'relative' }}>
              {u.lang === 'tr'
                ? '3D Secure\'suz, 2 saniyede iade, biriken miller anında cüzdanınıza. Üstelik %2 mil iadesi.'
                : 'No 3D Secure, 2-second refunds, miles in your wallet instantly. Plus 2% miles back.'}
            </p>
          </div>

          <div style={{
            position: 'relative', overflow: 'hidden', borderRadius: 12, padding: 18,
            background: 'linear-gradient(135deg, #2A1F0E 0%, #4A3618 55%, #6B4C1B 100%)',
            border: '1px solid rgba(197,160,89,0.45)',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2.4, color: '#E5C97A', fontWeight: 800 }}>
              TURKISH AIRLINES
            </span>
            <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#F5E9CB' }}>
              Miles<span style={{ color: '#C5A059' }}>&</span>Smiles
            </h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800, color: '#F5E9CB' }}>48 720</span>
              <span style={{ fontSize: 11, color: '#E5C97A' }}>{u.lang === 'tr' ? 'mil mevcut' : 'miles available'}</span>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: '#E5C97A', opacity: 0.9, lineHeight: 1.5 }}>
              {u.lang === 'tr'
                ? 'Bu rotayı tamamen mil ile karşılayabilir ya da kısmi mil + kart kombinasyonu kullanabilirsin.'
                : 'Cover this route fully with miles, or combine partial miles + card.'}
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function WebKREntryRow({ num, label, sub }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0' }}>
      <span style={{
        width: 24, height: 24, borderRadius: 999,
        background: '#B7312C', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 10.5,
        boxShadow: '0 0 10px rgba(183,49,44,0.35)',
      }}>{num}</span>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: '#F4EBD9' }}>{label}</span>
        <span style={{ fontSize: 10.5, color: '#7A8EAF', fontFamily: 'var(--font-mono)', letterSpacing: 0.6 }}>{sub}</span>
      </div>
    </div>
  );
}
function webKRGhost() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '9px 14px', borderRadius: 10,
    background: 'rgba(255,255,255,0.04)', color: '#F4EBD9',
    border: '1px solid rgba(255,255,255,0.10)',
    fontSize: 12, fontWeight: 700, cursor: 'pointer',
  };
}
function webKRGlassMini() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '8px 10px', borderRadius: 8,
    background: 'rgba(255,255,255,0.04)', color: '#F4EBD9',
    border: '1px solid rgba(255,255,255,0.10)',
    fontSize: 11.5, fontWeight: 700, cursor: 'pointer', flex: 1, justifyContent: 'center',
  };
}

/* ────────────────────────────────────────────────────────────────────
   24 · Ödeme (Web) — Miles&Smiles + TK Pay vurgulu
   ──────────────────────────────────────────────────────────────────── */

function WebPaymentOptionsScreen({ t, setTweak, nav }) {
  const u = useThyTweaks(t, { dark: true });
  const toast = (typeof useToast === 'function') ? useToast() : null;
  const [method, setMethod] = React.useState('miles');

  const trip = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('thy-route-pay-target-v1');
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return WEB_KR_ROUTES[0];
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
    <PageShell dark style={{
      background: 'radial-gradient(1200px 700px at 80% -10%, rgba(183,49,44,0.18), transparent 60%),'
                 + 'radial-gradient(900px 600px at 5% 110%, rgba(0,83,165,0.18), transparent 55%),'
                 + 'linear-gradient(160deg,#050B14 0%,#0A1628 50%,#102544 100%)',
      color: '#F4EBD9', minHeight: '100%',
    }}>
      <WebTopNav active={'routes'} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} dark />

      <div style={{
        maxWidth: 1440, margin: '0 auto', padding: '28px 36px 36px',
        display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 28,
      }}>
        {/* LEFT */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1.8, color: '#7A8EAF',
          }}>
            <button onClick={() => nav('routes')} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
              color: '#F4EBD9', borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1.4, fontWeight: 800,
            }}>← {u.lang === 'tr' ? 'ROTALARIM' : 'ROUTES'}</button>
            <span>/</span>
            <span>{u.lang === 'tr' ? 'ÖDEME' : 'PAYMENT'} · {trip.id} · {trip.pnr}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2.4, color: '#C5A059', fontWeight: 800 }}>
              ✦ {u.lang === 'tr' ? 'ÖDEME YÖNTEMİ SEÇİN' : 'CHOOSE A PAYMENT METHOD'}
            </span>
            <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 38, letterSpacing: -0.6, color: '#F4EBD9' }}>
              {trip.name}
            </h1>
            <span style={{ fontSize: 13, color: '#B2C0D1' }}>
              {trip.dates} · {trip.pax} · {trip.cabin}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: '#C5A059', fontWeight: 800 }}>
                ✦ {u.lang === 'tr' ? 'SİZE ÖZEL ÖNERİLEN' : 'RECOMMENDED FOR YOU'}
              </span>
              <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(197,160,89,0.4), transparent)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {/* Miles */}
              <button onClick={() => setMethod('miles')} style={webKRCardBtn()}>
                <div style={{
                  position: 'relative', overflow: 'hidden',
                  borderRadius: 14, padding: 20,
                  background: 'linear-gradient(135deg, #1A1206 0%, #3B2A11 55%, #6B4C1B 100%)',
                  border: method === 'miles' ? '1.5px solid #C5A059' : '1.5px solid rgba(197,160,89,0.32)',
                  boxShadow: method === 'miles' ? '0 14px 32px rgba(197,160,89,0.30)' : '0 8px 20px rgba(0,0,0,0.22)',
                  display: 'flex', flexDirection: 'column', gap: 12, color: '#F5E9CB', minHeight: 170,
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(140% 70% at 90% -20%, rgba(255,220,140,0.4), transparent 60%)',
                    pointerEvents: 'none',
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: 2.4, color: '#E5C97A', fontWeight: 800 }}>
                        TURKISH AIRLINES
                      </div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: '#F5E9CB', letterSpacing: -0.3 }}>
                        Miles<span style={{ color: '#C5A059' }}>&</span>Smiles
                      </div>
                    </div>
                    <span style={{
                      padding: '5px 10px', borderRadius: 999,
                      background: '#C5A059', color: '#1A1206',
                      fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 800, letterSpacing: 1.4,
                    }}>{u.lang === 'tr' ? 'ÖNERİLEN' : 'RECOMMENDED'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
                    <div>
                      <div style={{ fontSize: 11.5, color: '#E5C97A' }}>{u.lang === 'tr' ? 'Kullanılabilir mil' : 'Available miles'}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 800, color: '#F5E9CB', lineHeight: 1 }}>48 720</div>
                      <div style={{ fontSize: 10.5, color: '#E5C97A', opacity: 0.85, marginTop: 4 }}>
                        ≈ 13 460 TL · {u.lang === 'tr' ? 'bu rota için yeterli' : 'enough for this route'}
                      </div>
                    </div>
                    <div style={webKRRadioOuter('#C5A059', method === 'miles')}>
                      {method === 'miles' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1A1206" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  </div>
                </div>
              </button>

              {/* TK Pay */}
              <button onClick={() => setMethod('tkpay')} style={webKRCardBtn()}>
                <div style={{
                  position: 'relative', overflow: 'hidden',
                  borderRadius: 14, padding: 20,
                  background: 'linear-gradient(135deg, #050B14 0%, #0A1628 55%, #B7312C 145%)',
                  border: method === 'tkpay' ? '1.5px solid #EF2E1F' : '1.5px solid rgba(255,255,255,0.10)',
                  boxShadow: method === 'tkpay' ? '0 14px 32px rgba(183,49,44,0.30)' : '0 8px 20px rgba(0,0,0,0.22)',
                  display: 'flex', flexDirection: 'column', gap: 12, color: '#F4EBD9', minHeight: 170,
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(120% 80% at 100% 110%, rgba(239,46,31,0.40), transparent 55%)',
                    pointerEvents: 'none',
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 12,
                        background: '#B7312C', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 18px rgba(239,46,31,0.5)',
                      }}>
                        <svg viewBox="0 0 100 100" width="24" height="24" fill="none" aria-hidden="true">
                          <path d="M15 55 Q35 35 55 45 L75 38 Q82 36 88 42 L92 50 L78 52 Q70 56 60 55 L45 60 Q30 64 18 60 Z" fill="#fff"/>
                          <circle cx="86" cy="46" r="2.5" fill="#B7312C"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: 2.4, color: '#C5A059', fontWeight: 800 }}>
                          {u.lang === 'tr' ? 'THY DİJİTAL CÜZDAN' : 'THY DIGITAL WALLET'}
                        </div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>
                          TK <span style={{ color: '#EF2E1F' }}>Pay</span>
                        </div>
                      </div>
                    </div>
                    <span style={{
                      padding: '5px 10px', borderRadius: 999,
                      background: '#EF2E1F', color: '#fff',
                      fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 800, letterSpacing: 1.4,
                    }}>{u.lang === 'tr' ? 'HIZLI' : 'FAST'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
                    <div>
                      <div style={{ fontSize: 11.5, color: '#C5D4EA' }}>{u.lang === 'tr' ? 'TK Pay bakiye' : 'TK Pay balance'}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1 }}>4 250,00 <span style={{ fontSize: 12, opacity: 0.7 }}>TL</span></div>
                      <div style={{ fontSize: 10.5, color: '#C5D4EA', opacity: 0.85, marginTop: 4 }}>
                        {u.lang === 'tr' ? 'Tek dokunuş · 3D secure\'suz · 2 sn iade' : 'One tap · no 3D · 2s refunds'}
                      </div>
                    </div>
                    <div style={webKRRadioOuter('#EF2E1F', method === 'tkpay')}>
                      {method === 'tkpay' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Other methods */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.085)',
            borderRadius: 14, padding: '6px 4px',
          }}>
            <div style={{ padding: '10px 14px 4px', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: '#7A8EAF', fontWeight: 800 }}>
              {u.lang === 'tr' ? 'DİĞER ÖDEME YÖNTEMLERİ' : 'OTHER PAYMENT METHODS'}
            </div>
            <WebKRPayRow active={method === 'card'} onClick={() => setMethod('card')}
              brand={<div style={webKRBrandChip('#0053A5')}>VISA</div>}
              title={u.lang === 'tr' ? 'Kayıtlı kart · •••• 4218' : 'Saved card · •••• 4218'}
              sub={u.lang === 'tr' ? 'A. KAYA · 08/27 · varsayılan' : 'A. KAYA · 08/27 · default'} />
            <WebKRPayRow active={method === 'mc'} onClick={() => setMethod('mc')}
              brand={<div style={webKRBrandChip('#0A1628')}>MC</div>}
              title="Mastercard · •••• 9930" sub="A. KAYA · 11/26" />
            <WebKRPayRow active={method === 'applepay'} onClick={() => setMethod('applepay')}
              brand={<div style={{ ...webKRBrandChip('#fff'), color: '#0A1628' }}><span style={{ fontFamily: '-apple-system,sans-serif', fontSize: 12, fontWeight: 600 }}> Pay</span></div>}
              title="Apple Pay" sub={u.lang === 'tr' ? 'Face ID ile cihazınızdan onay' : 'Approve with Face ID'} />
            <WebKRPayRow active={method === 'bank'} onClick={() => setMethod('bank')}
              brand={<div style={webKRBrandChip('#16A34A')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M3 21h18M5 21V11l7-6 7 6v10M9 21v-6h6v6"/></svg></div>}
              title={u.lang === 'tr' ? 'Banka havalesi · FAST' : 'Bank transfer · FAST'}
              sub={u.lang === 'tr' ? '24 saat içinde manuel onay' : 'Manual approval in 24h'} />
          </div>
        </section>

        {/* RIGHT — summary */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.085)',
            borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: '#C5A059', fontWeight: 800 }}>
              ✦ {u.lang === 'tr' ? 'ROTA ÖZETİ' : 'ROUTE SUMMARY'}
            </span>
            <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#F4EBD9' }}>
              {trip.name}
            </h3>
            <WebKRSegBar codes={trip.legs} />
            <div style={{ fontSize: 12.5, color: '#B2C0D1' }}>
              {trip.dates} · {trip.pax} · {trip.cabin}
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <WebKRBill label={u.lang === 'tr' ? 'Bilet ücreti' : 'Fare'} value={`${fareStr} TL`} />
            <WebKRBill label={u.lang === 'tr' ? 'Vergi ve harçlar' : 'Taxes & fees'} value={`${taxes} TL`} />
            <WebKRBill label={u.lang === 'tr' ? 'Miles&Smiles iadesi' : 'Miles&Smiles back'} value={`✦ ${trip.miles}`} accent="#C5A059" />
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, color: '#B2C0D1', fontWeight: 700 }}>{u.lang === 'tr' ? 'Toplam' : 'Total'}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: '#F4EBD9' }}>
                {trip.price} <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: '#B2C0D1' }}>TL</span>
              </span>
            </div>
            <button onClick={pay} style={{
              marginTop: 4, padding: '14px 18px', border: 'none', borderRadius: 12, cursor: 'pointer',
              background: '#B7312C', color: '#fff', fontSize: 14, fontWeight: 800,
              boxShadow: '0 14px 30px rgba(183,49,44,0.36)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, letterSpacing: 0.2,
            }}>
              {u.lang === 'tr'
                ? (method === 'miles' ? 'Miles ile Öde' : method === 'tkpay' ? 'TK Pay ile Öde' : 'Ödemeyi Tamamla')
                : (method === 'miles' ? 'Pay with Miles' : method === 'tkpay' ? 'Pay with TK Pay' : 'Complete Payment')
              } · {trip.price} TL
            </button>
            <div style={{ textAlign: 'center', fontSize: 10.5, color: '#7A8EAF' }}>
              🛡 KVKK · 3D Secure · 256-bit
            </div>
          </div>

          <div style={{
            background: 'rgba(197,160,89,0.06)', border: '1px dashed rgba(197,160,89,0.32)',
            borderRadius: 12, padding: 14, fontSize: 11.5, color: '#E5C97A', lineHeight: 1.5,
          }}>
            ✦ {u.lang === 'tr'
              ? <>Bu rota için <strong>Miles&Smiles</strong> ile öderseniz iade süresi <strong>2 saniye</strong>, <strong>TK Pay</strong> ile öderseniz toplamın <strong>%2'si</strong> hesabınıza mil olarak yatar.</>
              : <>If you pay with <strong>Miles&Smiles</strong>, refunds settle in <strong>2 seconds</strong>; <strong>TK Pay</strong> earns you <strong>2%</strong> miles back.</>}
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function webKRCardBtn() {
  return { textAlign: 'left', cursor: 'pointer', border: 'none', padding: 0, background: 'transparent', borderRadius: 14 };
}
function webKRRadioOuter(color, active) {
  return {
    width: 26, height: 26, borderRadius: 999, border: '2px solid ' + color,
    background: active ? color : 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
}
function WebKRPayRow({ active, onClick, brand, title, sub }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 14px', cursor: 'pointer', borderRadius: 10,
      background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {brand}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F4EBD9' }}>{title}</span>
          <span style={{ fontSize: 11, color: '#7A8EAF' }}>{sub}</span>
        </div>
      </div>
      <div style={{
        width: 18, height: 18, borderRadius: 999,
        border: '2px solid ' + (active ? '#EF2E1F' : 'rgba(255,255,255,0.25)'),
        background: active ? '#EF2E1F' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {active && <div style={{ width: 6, height: 6, borderRadius: 999, background: '#fff' }} />}
      </div>
    </div>
  );
}
function webKRBrandChip(bg) {
  return {
    width: 44, height: 28, borderRadius: 6, background: bg, color: '#fff',
    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 800,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 0.5,
  };
}
function WebKRBill({ label, value, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
      <span style={{ color: '#B2C0D1' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: accent || '#F4EBD9' }}>{value}</span>
    </div>
  );
}

Object.assign(window, { WebSavedRoutesScreen, WebPaymentOptionsScreen });
