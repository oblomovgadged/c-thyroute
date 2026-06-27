// screens-a.jsx — Splash, FlightBoard, Search, Results, BoardingPass
// Each screen accepts: ({ t, setTweak, nav, k }) where:
//   t = tweaks state, nav = function(screenId), k = 'ios'|'android' (for tiny variants)

// ───────────────────────────────────────────────────────────
// 1) SPLASH — Editorial Departure (Awwwards-tier)
//    Cream zemin, dev italic Playfair manşet, JetBrains Mono ticker,
//    siyah çerçevesiz tek primary CTA. Fashion-magazine vibe.
// ───────────────────────────────────────────────────────────
function SplashScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 54 : 18;
  const lang = u.lang;

  // Bilingual editorial copy
  const copy = lang === 'tr'
    ? {
        eyebrow: '● KALKIŞ · 21 HAZ 2026', volume: 'İSTANBUL',
        line1: 'Avrupa\'nın', line2a: 'en ', line2b: 'iyisi', line2c: 'yle',
        line3: 'uçun.',
        statCountry: 'ÜLKE', statRoute: 'HAT', statInf: 'ROTA',
        todayPre: 'bugün', todayCity: 'Roma\'yı', todayPost: 'seçtik',
        ticker: 'ZAMANINDA', flight: 'TK 1853 · IST → FCO', flightTime: '14:25',
        cta: 'Rotanı yarat', existingMember: 'ZATEN ÜYE',
        legalA: 'KAYIT 60 SN', legalB: '● MILES&SMILES PARTNER',
      }
    : {
        eyebrow: '● DEPARTURE · JUN 21 2026', volume: 'ISTANBUL',
        line1: 'Fly with', line2a: 'Europe\'s ', line2b: 'finest', line2c: '',
        line3: 'airline.',
        statCountry: 'COUNTRIES', statRoute: 'ROUTES', statInf: 'TRIPS',
        todayPre: 'today,', todayCity: 'Rome', todayPost: 'awaits',
        ticker: 'ON TIME', flight: 'TK 1853 · IST → FCO', flightTime: '14:25',
        cta: 'Craft your route', existingMember: 'SIGN IN',
        legalA: 'SIGNUP 60 S', legalB: '● MILES&SMILES PARTNER',
      };

  return (
    <div className="thy-screen is-light screen-enter" style={{
      position: 'relative', minHeight: '100%', overflow: 'hidden',
      background: '#F5F1EA',
      fontFamily: u.font, color: '#0A1628', paddingTop: topPad,
    }}>
      {/* Subtle paper grain */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none',
        background:
          'radial-gradient(0.6px 0.6px at 18px 22px, rgba(10,22,40,0.22), transparent),'
          + 'radial-gradient(0.5px 0.5px at 54px 78px, rgba(10,22,40,0.18), transparent),'
          + 'radial-gradient(0.6px 0.6px at 96px 36px, rgba(10,22,40,0.20), transparent)',
        backgroundSize: '110px 110px',
      }} />

      {/* Header — minimal brand + sign-in */}
      <div style={{ position: 'relative', padding: '8px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 28, height: 28, borderRadius: 999, background: '#B7312C',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(183,49,44,0.32)',
          }}>
            <svg viewBox="0 0 100 100" width="17" height="17" fill="none" aria-hidden="true">
              <path d="M15 55 Q35 35 55 45 L75 38 Q82 36 88 42 L92 50 L78 52 Q70 56 60 55 L45 60 Q30 64 18 60 Z" fill="#fff"/>
              <circle cx="86" cy="46" r="2.5" fill="#B7312C"/>
            </svg>
          </span>
          <div style={{ lineHeight: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 11, letterSpacing: 2, color: '#0A1628' }}>
              THY ROUTE
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 1.6, color: '#9C7B36', fontWeight: 800 }}>
              EST. 1933
            </span>
          </div>
        </div>
        <button onClick={() => nav('board')} style={{
          padding: '6px 12px', borderRadius: 999, border: '1px solid #0A1628',
          background: 'transparent', color: '#0A1628', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: 1.4, fontWeight: 800,
        }}>{copy.existingMember}</button>
      </div>

      {/* Eyebrow */}
      <div style={{
        position: 'relative', padding: '20px 24px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2.4, fontWeight: 800,
      }}>
        <span style={{ color: '#B7312C' }}>{copy.eyebrow}</span>
        <span style={{ color: '#94A3B8' }}>{copy.volume}</span>
      </div>

      {/* Massive italic editorial headline */}
      <div style={{ position: 'relative', padding: '14px 24px 0' }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 500, fontStyle: 'italic',
          fontSize: 60, lineHeight: 0.94, letterSpacing: -1.8, color: '#0A1628',
        }}>
          {copy.line1}<br/>
          <span>{copy.line2a}<span style={{ color: '#B7312C' }}>{copy.line2b}</span>{copy.line2c}</span><br/>
          <span style={{ fontStyle: 'normal', fontWeight: 700, fontSize: 56 }}>{copy.line3}</span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Ticker — between two hairlines */}
      <div style={{
        position: 'relative', margin: '18px 24px 0', padding: '12px 0',
        borderTop: '1px solid #0A1628', borderBottom: '1px solid #0A1628',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1.4, fontWeight: 700, color: '#0A1628',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: '#1A8E5A', boxShadow: '0 0 6px rgba(26,142,90,0.5)' }} />
          {copy.ticker}
        </span>
        <span>{copy.flight}</span>
        <span>{copy.flightTime}</span>
      </div>

      {/* Triple stat */}
      <div style={{
        position: 'relative', margin: '0 24px',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
      }}>
        {[
          { n: '47', l: copy.statCountry },
          { n: '360', l: copy.statRoute },
          { n: '∞', l: copy.statInf },
        ].map((s, i) => (
          <div key={s.l} style={{
            padding: '14px 6px', textAlign: 'center',
            borderRight: i < 2 ? '1px solid rgba(10,22,40,0.18)' : 'none',
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 30, lineHeight: 1, color: '#0A1628' }}>{s.n}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: 1.6, fontWeight: 800, color: '#64748B', marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Italic destination teaser */}
      <div style={{
        position: 'relative', margin: '10px 24px 0',
        display: 'flex', alignItems: 'baseline', gap: 8,
        fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
      }}>
        <span style={{ fontSize: 16, color: '#94A3B8' }}>{copy.todayPre}</span>
        <span style={{ fontSize: 24, color: '#0A1628', fontWeight: 700 }}>{copy.todayCity}</span>
        <span style={{ fontSize: 16, color: '#94A3B8' }}>{copy.todayPost}</span>
      </div>

      {/* Primary CTA — square black */}
      <div style={{ position: 'relative', padding: '16px 24px 18px' }}>
        <button onClick={() => nav('search')} style={{
          width: '100%', padding: '17px 22px',
          background: '#0A1628', color: '#F5F1EA', border: 'none',
          borderRadius: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, fontStyle: 'italic',
        }}>
          <span>{copy.cta}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontStyle: 'normal' }}>→</span>
        </button>
        <div style={{
          marginTop: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1.4, fontWeight: 700, color: '#64748B',
        }}>
          <span>{copy.legalA}</span>
          <span>{copy.legalB}</span>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// 2) FLIGHT BOARD (Home) — light, upcoming flight card, quick actions
// ───────────────────────────────────────────────────────────
function FlightBoardScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const isiOS = k === 'ios';
  const topPad = isiOS ? 64 : 20;
  return (
    <div className="thy-screen screen-enter" style={{
      minHeight: '100%', background: '#F3F5F8',
      fontFamily: u.font, display: 'flex', flexDirection: 'column',
    }}>
      {/* Header — navy strip with crane */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0A1628 0%, #0F2244 70%, #1B3868 100%)',
        padding: `${topPad}px 18px 32px`, color: '#fff',
      }}>
        <RouteMapBg opacity={0.12} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <SectionLabel dark accent={u.accent} style={{ marginBottom: 6, color: u.accent.fg }}>
              {u.c.boardEyebrow}
            </SectionLabel>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 19, letterSpacing: -0.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {u.c.welcome}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: u.accent.fg, marginTop: 4, letterSpacing: 1, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              ✦ 87.420 {u.c.miles} · {u.c.eliteCard}
            </div>
          </div>
          <button onClick={() => nav('notifications')} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            width: 40, height: 40, borderRadius: 12, color: '#fff', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            <Icon name="bell" size={18} />
            <span style={{
              position: 'absolute', top: 8, right: 8, width: 7, height: 7,
              borderRadius: '50%', background: u.accent.fg,
              boxShadow: `0 0 8px ${u.accent.glow}`,
            }} />
          </button>
        </div>
      </div>

      {/* Upcoming flight card overlapping header */}
      <div style={{ padding: '0 16px', marginTop: -22 }}>
        <UpcomingFlightCard u={u} onOpen={() => nav('boarding')} />
      </div>

      {/* Quick actions */}
      <div style={{ padding: '20px 16px 8px' }}>
        <SectionLabel style={{ marginBottom: 10 }}>{u.lang === 'tr' ? 'HIZLI İŞLEMLER' : 'QUICK ACTIONS'}</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {[
            { i: 'search', l: u.lang === 'tr' ? 'Ara'      : 'Search',   s: 'search' },
            { i: 'map',    l: u.lang === 'tr' ? 'Rota'     : 'Route',    s: 'map' },
            { i: 'qr',     l: u.lang === 'tr' ? 'QR Tara'  : 'QR Scan',  s: 'qrScanner' },
            { i: 'bell',   l: u.lang === 'tr' ? 'Alarm'    : 'Alert',    s: 'priceAlert' },
          ].map((q) => (
            <button key={q.i} onClick={() => nav(q.s)} style={{
              background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
              padding: '12px 6px', cursor: 'pointer', fontFamily: u.font,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              boxShadow: '0 2px 8px rgba(10,22,40,0.04)',
              transition: 'transform 180ms ease, box-shadow 180ms ease',
            }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
              onMouseUp={(e)   => e.currentTarget.style.transform = 'none'}
              onMouseLeave={(e)=> e.currentTarget.style.transform = 'none'}
            >
              <span style={{
                width: 36, height: 36, borderRadius: 10,
                background: `linear-gradient(135deg, ${u.accent.bg}1A, ${u.accent.bg}33)`,
                color: u.accent.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon name={q.i} size={18} /></span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0A1628' }}>{q.l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Türkiye Turu — editorial promo strip */}
      <div style={{ padding: '14px 16px 4px' }}>
        <button onClick={() => nav('turkiyeTuru')} style={{
          width: '100%', padding: 0, border: 'none', cursor: 'pointer',
          borderRadius: 14, overflow: 'hidden', position: 'relative',
          background: `linear-gradient(120deg, #B7372A 0%, #E5712C 60%, #F4C24C 100%)`,
          color: '#FAF6E9', textAlign: 'left',
          boxShadow: '0 10px 28px rgba(183,55,42,0.25)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
          }}>
            <div style={{
              width: 56, height: 56, flexShrink: 0,
              border: '3px solid #FAF6E9', borderRadius: '50%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1,
              transform: 'rotate(-6deg)', textAlign: 'center', lineHeight: 1,
            }}>TÜR<br/>KİYE</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 11, letterSpacing: 2.5, opacity: 0.9 }}>
                YENİ · 14 GÜN
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontStyle: 'italic', fontSize: 19, letterSpacing: -0.3, lineHeight: 1.1, marginTop: 2 }}>
                Türkiye baştan sona.
              </div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
                {u.lang === 'tr' ? '7 şehir · 4 hafta · 32 400 TL\'den' : '7 cities · 4 weeks · from 32,400 TL'}
              </div>
            </div>
            <span style={{ fontSize: 24, opacity: 0.9 }}>→</span>
          </div>
        </button>
      </div>

      {/* Inspire — destination cards */}
      <div style={{ padding: '14px 16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <SectionLabel>{u.lang === 'tr' ? 'POPÜLER ROTALAR' : 'POPULAR ROUTES'}</SectionLabel>
          <span style={{ fontSize: 11, fontWeight: 700, color: u.accent.bg, cursor: 'pointer' }}>
            {u.lang === 'tr' ? 'Tümü ›' : 'See all ›'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -16px', padding: '0 16px 8px', scrollbarWidth: 'none' }}>
          {[
            { code: 'NRT', city: 'Tokyo',     hours: '13s 25dk', from: '5.940', accent: '#0053A5' },
            { code: 'BCN', city: 'Barcelona', hours: '4s 05dk',  from: '3.480', accent: '#B7312C' },
            { code: 'CPT', city: 'Cape Town', hours: '10s 50dk', from: '7.220', accent: '#C5A059' },
          ].map(d => (
            <div key={d.code} style={{
              minWidth: 158, background: '#fff', border: '1px solid #E2E8F0',
              borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 14px rgba(10,22,40,0.06)',
              fontFamily: u.font,
            }}>
              <div style={{
                height: 76, background: `linear-gradient(135deg, ${d.accent}, ${d.accent}AA)`,
                display: 'flex', alignItems: 'flex-end', padding: 10, color: '#fff', position: 'relative',
              }}>
                <Icon name="location" size={14} color="#fff" style={{ marginRight: 4 }} />
                <span style={{ fontWeight: 800, fontSize: 13 }}>{d.city}</span>
                <span style={{
                  position: 'absolute', top: 8, right: 10,
                  fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 800, letterSpacing: 1,
                }}>{d.code}</span>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, letterSpacing: 0.5 }}>{u.lang === 'tr' ? 'Başlangıç' : 'From'}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 16, color: '#0A1628' }}>{d.from}</span>
                  <span style={{ fontSize: 10, color: '#64748B' }}>TL</span>
                </div>
                <div style={{ marginTop: 2, fontSize: 10, color: '#64748B' }}>{d.hours} · aktarmasız</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* footer tab bar */}
      <div style={{ marginTop: 'auto' }}>
        <AppTabBar active="home" onChange={(id) => nav(id === 'home' ? 'board' : id === 'search' ? 'search' : id === 'map' ? 'map' : id === 'wallet' ? 'ms' : 'profile')} {...u} />
      </div>
    </div>
  );
}

function UpcomingFlightCard({ u, onOpen }) {
  const [booking,, h] = useBooking();
  const out = booking.outbound;
  const ret = booking.returnSel;
  const hasReal = !!out;

  const fromC = h.from || findCity('IST');
  const toC = h.to || findCity('FCO');
  const depFmt = formatDateShort(booking.depDate, u.lang);

  const code = out?.code || 'TK 1853';
  const depT = out?.dep || '14:25';
  const arrT = out?.arr || '16:50';
  const dur  = out?.dur || '3s 25dk';
  const plane = out?.plane || 'A321neo';

  return (
    <div onClick={onOpen} style={{
      position: 'relative', overflow: 'hidden', cursor: 'pointer',
      background: 'linear-gradient(135deg, #ffffff 0%, #FAFBFC 100%)',
      border: '1px solid #E2E8F0', borderRadius: 16,
      boxShadow: '0 10px 30px rgba(10,22,40,0.10)',
      padding: '14px 16px 16px',
      fontFamily: u.font,
    }}>
      {/* status row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <ThyBadge variant="status">{hasReal ? (u.lang==='tr'?'ONAYLANDI':'CONFIRMED') : u.c.onTime}</ThyBadge>
        <ThyBadge variant="mono">{code}</ThyBadge>
      </div>

      {/* route */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 30, color: '#0A1628', letterSpacing: -0.5, lineHeight: 1 }}>{fromC.code}</div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 4, fontWeight: 600 }}>{fromC.city}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: '#0A1628', marginTop: 8 }}>{depT}</div>
          <div style={{ fontSize: 10, color: '#94A3B8' }}>{depFmt.dow} · {depFmt.day} {depFmt.mo}</div>
        </div>

        <div style={{ flex: 1.2, paddingTop: 8 }}>
          <div style={{ position: 'relative', height: 18, marginBottom: 6 }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: '#E2E8F0' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, height: 2, width: '38%', background: u.accent.bg }} />
            <span style={{ position: 'absolute', top: -2, left: -4, width: 8, height: 8, borderRadius: '50%', background: u.accent.bg }} />
            <span style={{ position: 'absolute', top: -2, right: -4, width: 8, height: 8, borderRadius: '50%', background: '#94A3B8' }} />
            <span style={{ position: 'absolute', top: -10, left: '34%', fontSize: 16, transform: 'rotate(45deg)', color: u.accent.bg }}>✈</span>
          </div>
          <div style={{ textAlign: 'center', fontSize: 10, color: '#64748B', fontWeight: 600 }}>{dur} · {plane}</div>
          {ret && (
            <div style={{ textAlign: 'center', fontSize: 9, color: u.accent.fg, fontWeight: 800, letterSpacing: 1, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              ↩ {u.lang==='tr'?'GİDİŞ-DÖNÜŞ':'ROUND TRIP'}
            </div>
          )}
        </div>

        <div style={{ flex: 1, textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 30, color: '#0A1628', letterSpacing: -0.5, lineHeight: 1 }}>{toC.code}</div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 4, fontWeight: 600 }}>{toC.city}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: '#0A1628', marginTop: 8 }}>{arrT}</div>
          <div style={{ fontSize: 10, color: '#94A3B8' }}>{u.lang==='tr'?'lokal':'local'}</div>
        </div>
      </div>

      {/* perforated divider */}
      <div style={{ position: 'relative', margin: '14px -16px 12px', height: 1, background: 'transparent' }}>
        <div style={{
          height: 1, borderTop: '1.5px dashed #CBD5E1', margin: '0 16px',
        }} />
        <div style={{ position: 'absolute', left: -8, top: -8, width: 16, height: 16, borderRadius: '50%', background: '#F3F5F8' }} />
        <div style={{ position: 'absolute', right: -8, top: -8, width: 16, height: 16, borderRadius: '50%', background: '#F3F5F8' }} />
      </div>

      {/* gate / seat / boarding */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
        <MiniStat label={u.c.gate} value={hasReal ? '—' : 'A12'} />
        <MiniStat label={u.c.seat} value={booking.seat || (hasReal ? '—' : '14F')} />
        <MiniStat label={u.lang === 'tr' ? 'BİNİŞ' : 'BOARD'} value={hasReal ? '—' : '13:55'} />
        <span style={{
          fontSize: 11, fontWeight: 800, color: u.accent.bg,
          display: 'inline-flex', alignItems: 'center', gap: 2, whiteSpace: 'nowrap',
        }}>{u.lang === 'tr' ? 'Karta git' : 'Open'} <Icon name="chevR" size={12} /></span>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// 3) FLIGHT SEARCH — light, swap, dates, pax, gradient hero
// ───────────────────────────────────────────────────────────
function SearchScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 54 : 18;
  const toast = useToast();
  const [booking, setBooking, h] = useBooking();
  const trip = booking.tripType || 'round';
  const setTrip = (id) => setBooking({ tripType: id });
  const pax = h.paxTotal || 1;
  const setPax = (n) => setBooking({ passengers: { adt: Math.max(1, Math.min(9, n)), chd: 0, inf: 0 } });

  const swap = () => h.swap();
  const depFmt = formatDateShort(booking.depDate, u.lang);
  const retFmt = formatDateShort(booking.retDate, u.lang);

  return (
    <div className="thy-screen screen-enter" style={{
      minHeight: '100%', background: '#F3F5F8',
      fontFamily: u.font, display: 'flex', flexDirection: 'column',
    }}>
      {/* hero */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, #0A1628 0%, #0F2244 40%, ${u.accent.deep} 100%)`,
        padding: `${topPad}px 22px 100px`, color: '#fff',
      }}>
        <RouteMapBg opacity={0.14} />
        <div style={{ position: 'relative' }}>
          <button onClick={() => nav('board')} style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10, padding: '8px 10px', color: '#fff', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: u.font, fontSize: 12, fontWeight: 600,
          }}><Icon name="arrowL" size={14} /></button>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2.5,
            color: u.accent.fg, marginTop: 18, fontWeight: 700,
          }}>✈ {u.lang === 'tr' ? 'YENİ UÇUŞ' : 'NEW FLIGHT'}</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, margin: '6px 0 0', letterSpacing: -0.5 }}>
            {u.c.search}
          </h1>
          <p style={{ color: '#B2C0D1', fontSize: 13, margin: '6px 0 0' }}>
            {u.lang === 'tr' ? 'Rotanızı belirleyin, biletinizi seçin.' : 'Set your route, pick your fare.'}
          </p>
        </div>
      </div>

      {/* Search card overlap */}
      <div style={{ padding: '0 16px', marginTop: -76 }}>
        <div style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
          boxShadow: '0 16px 36px rgba(10,22,40,0.14)',
          padding: 14, fontFamily: u.font,
        }}>
          {/* trip type segmented */}
          <div style={{
            display: 'inline-flex', background: '#F3F5F8', borderRadius: 999,
            padding: 3, marginBottom: 14,
          }}>
            {[
              { id: 'round', l: u.lang === 'tr' ? 'Gidiş-Dönüş' : 'Round trip' },
              { id: 'one',   l: u.lang === 'tr' ? 'Tek yön'     : 'One way' },
            ].map(o => (
              <button key={o.id} onClick={() => setTrip(o.id)} style={{
                padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: trip === o.id ? '#fff' : 'transparent',
                color: trip === o.id ? '#0A1628' : '#64748B',
                fontWeight: 700, fontSize: 11, fontFamily: u.font,
                boxShadow: trip === o.id ? '0 1px 4px rgba(10,22,40,0.08)' : 'none',
                transition: 'all 150ms',
              }}>{o.l}</button>
            ))}
          </div>

          {/* from / to with swap (autocomplete) */}
          <div style={{ position: 'relative' }}>
            <div style={{ marginBottom: 8 }}>
              <CityAutocomplete
                value={booking.fromCode}
                onChange={(code) => setBooking({ fromCode: code })}
                otherSide={booking.toCode}
                label={u.c.from}
                accent={u.accent} lang={u.lang}
                compact
              />
            </div>
            <CityAutocomplete
              value={booking.toCode}
              onChange={(code) => setBooking({ toCode: code })}
              otherSide={booking.fromCode}
              label={u.c.to}
              accent={u.accent} lang={u.lang}
              compact
            />
            <button onClick={swap} aria-label="swap" style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              width: 32, height: 32, borderRadius: '50%', background: '#fff',
              border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(10,22,40,0.1)',
              cursor: 'pointer', color: u.accent.bg, zIndex: 2,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name="swapV" size={14} /></button>
          </div>

          {/* dates */}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <div style={{ flex: 1 }}>
              <DatePickerCell
                label={u.c.depart}
                value={booking.depDate}
                lang={u.lang}
                popoverAlign="left"
                compact
                onChange={(iso) => {
                  const patch = { depDate: iso };
                  if (booking.retDate && booking.retDate < iso) patch.retDate = plusDaysISO(iso, 7);
                  setBooking(patch);
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <DatePickerCell
                label={u.c.return}
                value={booking.retDate}
                minISO={booking.depDate}
                lang={u.lang}
                popoverAlign="right"
                compact
                disabled={trip === 'one'}
                onChange={(iso) => setBooking({ retDate: iso })}
              />
            </div>
          </div>

          {/* pax */}
          <div style={{
            marginTop: 10, padding: '12px 14px', border: '1px solid #E2E8F0',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: '#94A3B8' }}>{u.c.pax}</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#0A1628' }}>
                {pax} {u.lang === 'tr' ? 'Yetişkin' : 'Adult'} · Economy
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setPax(pax - 1)} style={paxBtn}>−</button>
              <button onClick={() => setPax(pax + 1)} style={paxBtn}>+</button>
            </div>
          </div>

          {/* search */}
          <div style={{ marginTop: 14 }}>
            <ThyButton variant="search" size="lg" fullWidth icon="→" onClick={() => {
              if (booking.fromCode === booking.toCode) {
                toast && toast({ type: 'error', icon: '!', children: u.lang === 'tr' ? 'Kalkış ile varış aynı olamaz' : 'Origin and destination must differ' });
                return;
              }
              toast && toast({ type: 'info', icon: '✈', children: u.lang === 'tr' ? 'Uçuşlar aranıyor…' : 'Searching flights…' });
              setTimeout(() => nav('results'), 350);
            }}>
              {u.c.searchCta}
            </ThyButton>
          </div>
        </div>
      </div>

      {/* recent searches */}
      <div style={{ padding: '20px 16px 14px' }}>
        <SectionLabel style={{ marginBottom: 10 }}>{u.lang === 'tr' ? 'SON ARAMALARINIZ' : 'RECENT SEARCHES'}</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { f: 'IST', t: 'AMS', d: u.lang === 'tr' ? '28 Haz · 1 yolcu' : 'Jun 28 · 1 pax' },
            { f: 'AYT', t: 'LHR', d: u.lang === 'tr' ? '03 Tem · 2 yolcu' : 'Jul 03 · 2 pax' },
          ].map((r, i) => (
            <button key={i} onClick={() => setBooking({ fromCode: r.f, toCode: r.t })} style={{
              background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10,
              padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, fontFamily: u.font,
              cursor: 'pointer', width: '100%', textAlign: 'left',
            }}>
              <Icon name="search" size={16} color="#94A3B8" />
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12, color: '#0A1628', letterSpacing: 1 }}>
                {r.f} → {r.t}
              </span>
              <span style={{ fontSize: 11, color: '#64748B', flex: 1 }}>{r.d}</span>
              <Icon name="chevR" size={14} color="#94A3B8" />
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <AppTabBar active="search" onChange={(id) => nav(id === 'home' ? 'board' : id === 'search' ? 'search' : id === 'map' ? 'map' : id === 'wallet' ? 'ms' : 'profile')} {...u} />
      </div>
    </div>
  );
}

const paxBtn = {
  width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0',
  background: '#F3F5F8', cursor: 'pointer', fontWeight: 800, fontSize: 16, color: '#0A1628',
};
const cityCellBtn = {
  width: '100%', textAlign: 'left', background: 'transparent', border: 'none',
  padding: 0, cursor: 'pointer', display: 'block',
};

function CityCell({ label, code, city }) {
  return (
    <div style={{ padding: '12px 14px', position: 'relative' }}>
      <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: '#94A3B8' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 22, color: '#0A1628', letterSpacing: 0.5 }}>{code}</span>
        <span style={{ fontSize: 13, color: '#64748B' }}>{city}</span>
      </div>
    </div>
  );
}

function DateCell({ label, day, mo, dow, muted }) {
  return (
    <div style={{
      flex: 1, padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: 10,
      background: muted ? '#FAFBFC' : '#fff',
    }}>
      <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: '#94A3B8' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 22, color: muted ? '#94A3B8' : '#0A1628' }}>{day}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: muted ? '#94A3B8' : '#0A1628' }}>{mo}</span>
      </div>
      <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>{dow}</div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// 4) FLIGHT RESULTS — light, list of flights with mini fare picker
// ───────────────────────────────────────────────────────────
function ResultsScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const toast = useToast();
  const [booking, setBooking, h] = useBooking();
  const [leg, setLeg] = React.useState('out');
  const [sort, setSort] = React.useState('price');
  const [direct, setDirect] = React.useState(true);
  const [selected, setSelected] = React.useState(0);

  const fromC = h.from || findCity('IST');
  const toC = h.to || findCity('FCO');
  const dur = durationFor(fromC.code, toC.code);
  const basePrice = priceFor(fromC.code, toC.code, 1800);
  const depFmt = formatDateShort(booking.depDate, u.lang);
  const retFmt = formatDateShort(booking.retDate, u.lang);

  // Deterministic per-route flight times
  const seedNum = (fromC.code + toC.code + leg).split('').reduce((s, ch) => s + ch.charCodeAt(0), 0);
  const timeAt = (offsetMin) => {
    const total = ((seedNum * 7) + offsetMin) % (24*60);
    return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
  };
  const addMin = (tt, min) => {
    const [hh,mm] = tt.split(':').map(Number);
    const tot = (hh*60 + mm + min) % (24*60);
    return `${String(Math.floor(tot/60)).padStart(2,'0')}:${String(tot%60).padStart(2,'0')}`;
  };

  const fares = [
    { name: 'EcoFly',        delta: 0,    color: '#4CA7BB' },
    { name: 'ExtraFly',      delta: 740,  color: '#0066CC' },
    { name: 'PrimeFly',      delta: 2360, color: '#88594A' },
    { name: 'BusinessPrime', delta: 8000, color: '#3F2D24' },
  ];

  const flights = [
    { id: 0, dep: timeAt(0),   code: 'TK ' + (1800 + seedNum%200), plane: 'A321neo', stops: 0, tag: 'cheap',   delta: -380, extra: 0 },
    { id: 1, dep: timeAt(230), code: 'TK ' + (1820 + seedNum%200), plane: 'A330',    stops: 0, tag: null,      delta: 0,    extra: 0 },
    { id: 2, dep: timeAt(560), code: 'TK ' + (1840 + seedNum%200), plane: 'B777',    stops: 0, tag: 'gold',    delta: 420,  extra: 0 },
    { id: 3, dep: timeAt(770), code: 'TK ' + (1860 + seedNum%200), plane: 'A321',    stops: 1, tag: 'night',   delta: -120, extra: 135 },
  ].map(f => ({
    ...f,
    arr: addMin(f.dep, dur.totalMin + f.extra),
    dur: f.stops === 0 ? dur.txt : `${dur.h+2}s ${String(dur.m).padStart(2,'0')}dk`,
  }));

  let filtered = flights.filter(f => !direct || f.stops === 0);
  if (sort === 'price')         filtered = [...filtered].sort((a,b) => a.delta - b.delta);
  else if (sort === 'time')     filtered = [...filtered].sort((a,b) => a.dep.localeCompare(b.dep));
  else if (sort === 'duration') filtered = [...filtered].sort((a,b) => a.dur.localeCompare(b.dur));

  // Display leg specifics
  const legFromCode = leg === 'out' ? fromC.code : toC.code;
  const legToCode   = leg === 'out' ? toC.code   : fromC.code;
  const legFromCity = leg === 'out' ? fromC.city : toC.city;
  const legToCity   = leg === 'out' ? toC.city   : fromC.city;
  const legDate     = leg === 'out' ? depFmt     : retFmt;

  return (
    <div className="thy-screen screen-enter" style={{
      minHeight: '100%', background: '#F3F5F8', fontFamily: u.font,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* top bar */}
      <div style={{
        background: '#fff', padding: `${topPad}px 16px 12px`,
        borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 5,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('search')} style={{
            background: '#F3F5F8', border: '1px solid #E2E8F0', borderRadius: 10,
            padding: '8px 10px', cursor: 'pointer',
          }}><Icon name="arrowL" size={14} color="#0A1628" /></button>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 14,
              color: '#0A1628', letterSpacing: 0.5,
            }}>{legFromCode} → {legToCode}</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>
              {legDate.day} {legDate.mo} · {h.paxTotal} {u.lang === 'tr' ? 'Yetişkin' : 'Adult'} · Economy
            </div>
          </div>
          <button onClick={() => nav('search')} style={{
            background: '#F3F5F8', border: '1px solid #E2E8F0', borderRadius: 10,
            padding: '8px 10px', cursor: 'pointer',
          }}><Icon name="edit" size={14} color="#0A1628" /></button>
        </div>

        {/* leg tabs — only when round-trip */}
        {booking.tripType !== 'one' && (
          <ThyTabs light value={leg} onChange={setLeg}
            style={{ marginTop: 14, marginLeft: -16, marginRight: -16, marginBottom: -12 }}
            items={[
              { id: 'out',
                label: (u.lang === 'tr' ? 'Gidiş • ' : 'Outbound • ') + `${fromC.code} → ${toC.code}` + (booking.outbound ? ' ✓' : '') },
              { id: 'return',
                label: (u.lang === 'tr' ? 'Dönüş • ' : 'Return • ') + `${toC.code} → ${fromC.code}` + (booking.returnSel ? ' ✓' : '') },
            ]} />
        )}

        {/* sort + filter */}
        <div style={{ display: 'flex', gap: 6, marginTop: booking.tripType !== 'one' ? 22 : 14, flexWrap: 'wrap' }}>
          <ThyChip light active={sort==='price'}    onClick={() => setSort('price')}>↑ {u.c.sortPrice}</ThyChip>
          <ThyChip light active={sort==='time'}     onClick={() => setSort('time')}>↑ {u.c.sortTime}</ThyChip>
          <ThyChip light active={sort==='duration'} onClick={() => setSort('duration')}>↑ {u.c.sortDuration}</ThyChip>
          <span style={{ marginLeft: 'auto' }} />
          <ThyChip light active={direct} onClick={() => setDirect(!direct)}>{direct ? '✓ ' : ''}{u.c.onlyDirect}</ThyChip>
        </div>
      </div>

      {/* flight list */}
      <div style={{ padding: '14px 16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((f, idx) => (
          <DSFlightCard
            key={f.id}
            lang={u.lang}
            depTime={f.dep} arrTime={f.arr}
            depCode={legFromCode} arrCode={legToCode}
            duration={f.dur} code={f.code} plane={f.plane} stops={f.stops}
            tag={
              f.tag === 'cheap'   ? <ThyBadge variant="red" style={{ fontSize: 8.5 }}>{u.lang === 'tr' ? 'EN UCUZ' : 'CHEAPEST'}</ThyBadge> :
              f.tag === 'gold'    ? <ThyBadge variant="gold">B777</ThyBadge> :
              f.tag === 'night'   ? <ThyBadge variant="outbound">{u.lang === 'tr' ? 'GECE' : 'NIGHT'}</ThyBadge> :
              null
            }
            fares={fares.map(fa => ({ ...fa, price: formatPriceTL(basePrice + fa.delta + f.delta) }))}
            onSelectFare={(fa) => {
              setSelected(f.id);
              const flightInfo = {
                code: f.code, dep: f.dep, arr: f.arr, dur: f.dur, plane: f.plane,
                fareName: fa.name, price: fa.price,
              };
              if (leg === 'out') {
                setBooking({ outbound: flightInfo, fareFamily: fa.name, selectedFlightId: f.code });
                if (booking.tripType === 'one') {
                  toast({ type: 'success', icon: '✓', children: u.lang === 'tr' ? 'Uçuş seçildi' : 'Flight selected' });
                  setTimeout(() => nav('confirm'), 600);
                } else {
                  toast({ type: 'info', icon: '→', children: u.lang === 'tr' ? 'Şimdi dönüş uçuşunu seçin' : 'Now pick your return' });
                  setLeg('return');
                  setSelected(null);
                  // scroll back to top of the list
                  setTimeout(() => {
                    const el = document.querySelector('.thy-screen');
                    if (el) el.scrollTop = 0;
                  }, 50);
                }
              } else {
                setBooking({ returnSel: flightInfo });
                toast({ type: 'success', icon: '✓', children: u.lang === 'tr' ? 'Dönüş seçildi' : 'Return selected' });
                setTimeout(() => nav('confirm'), 600);
              }
            }}
          />
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <AppTabBar active="search" onChange={(id) => nav(id === 'home' ? 'board' : id === 'search' ? 'search' : id === 'map' ? 'map' : id === 'wallet' ? 'ms' : 'profile')} {...u} />
      </div>
    </div>
  );
}

function FlightResultRow({ f, u, selected, onSelect, onBook }) {
  return (
    <div onClick={onSelect} style={{
      background: '#fff', border: '1px solid ' + (selected ? u.accent.bg : '#E2E8F0'),
      borderRadius: 12, padding: '14px 14px 12px', cursor: 'pointer',
      boxShadow: selected ? `0 8px 24px ${u.accent.glow}` : '0 2px 8px rgba(10,22,40,0.04)',
      transition: 'all 200ms cubic-bezier(.4,0,.2,1)',
      fontFamily: u.font,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 18, color: '#0A1628', letterSpacing: -0.3 }}>{f.dep}</span>
            <span style={{ flex: 1, height: 1, background: '#CBD5E1', position: 'relative' }}>
              <span style={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', fontSize: 11, color: u.accent.bg }}>✈</span>
              {f.stops === 0 ? null : <span style={{
                position: 'absolute', top: -2, left: '40%', width: 4, height: 4,
                borderRadius: '50%', background: '#FF8C00',
              }} />}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 18, color: '#0A1628', letterSpacing: -0.3 }}>{f.arr}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 11, color: '#64748B', alignItems: 'center' }}>
            <span style={{ fontWeight: 700 }}>{f.dur}</span>
            <span style={{ color: '#CBD5E1' }}>·</span>
            <span>{f.stops === 0 ? (u.lang === 'tr' ? 'Aktarmasız' : 'Direct') : (u.lang === 'tr' ? '1 aktarma' : '1 stop')}</span>
            <span style={{ color: '#CBD5E1' }}>·</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{f.code}</span>
            {f.tag === 'success' && <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 800, color: '#16A34A', background: 'rgba(34,197,94,0.12)', padding: '1px 6px', borderRadius: 4, letterSpacing: 0.5 }}>{u.lang === 'tr' ? 'EN UCUZ' : 'CHEAPEST'}</span>}
            {f.tag === 'gold' && <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 800, color: '#9B7E3D', background: 'rgba(197,160,89,0.16)', padding: '1px 6px', borderRadius: 4, letterSpacing: 0.5 }}>{u.lang === 'tr' ? 'B777' : 'B777'}</span>}
            {f.tag === 'warning' && <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 800, color: '#C2570A', background: 'rgba(255,140,0,0.12)', padding: '1px 6px', borderRadius: 4, letterSpacing: 0.5 }}>{u.lang === 'tr' ? 'GECE' : 'NIGHT'}</span>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#4CA7BB', letterSpacing: 1, textTransform: 'uppercase' }}>{f.fare}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 18, color: '#0A1628' }}>{f.price}</span>
            <span style={{ fontSize: 10, color: '#64748B' }}>TL</span>
          </div>
        </div>
      </div>

      {selected && (
        <div className="screen-enter" style={{
          marginTop: 12, paddingTop: 12, borderTop: '1px dashed #CBD5E1',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ flex: 1, fontSize: 11, color: '#64748B' }}>
            <span style={{ fontWeight: 700, color: '#0A1628' }}>{f.plane}</span> · {u.lang === 'tr' ? 'Yemek dahil · Bagaj 20kg' : 'Meal incl · 20kg bag'}
          </div>
          <AccentCTA accent={u.accent} full={false} onClick={(e) => { e.stopPropagation(); onBook(); }} style={{ padding: '10px 18px', fontSize: 12 }}>
            {u.lang === 'tr' ? 'Seç →' : 'Select →'}
          </AccentCTA>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// 5) BOARDING PASS — dark navy, QR, gate, panorama
// ───────────────────────────────────────────────────────────
function BoardingPassScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: true });
  const topPad = k === 'ios' ? 50 : 14;
  const toast = useToast();
  return (
    <div className="thy-screen is-dark screen-enter" style={{
      position: 'relative', minHeight: '100%', overflow: 'hidden',
      background: 'linear-gradient(180deg, #050B14 0%, #0A1628 50%, #0F2244 100%)',
      fontFamily: u.font, display: 'flex', flexDirection: 'column',
    }}>
      <RouteMapBg opacity={0.08} />

      {/* top */}
      <div style={{ position: 'relative', padding: `${topPad}px 18px 14px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => nav('board')} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10, padding: '8px 10px', color: '#fff', cursor: 'pointer',
        }}><Icon name="arrowL" size={14} /></button>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7A8EAF', letterSpacing: 2,
        }}>BOARDING PASS</div>
        <button onClick={() => {
          toast({ type: 'success', icon: '✓', children: u.lang === 'tr' ? 'Biniş kartı panoya kopyalandı' : 'Boarding pass copied' });
        }} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10, padding: '8px 10px', color: '#fff', cursor: 'pointer',
        }}><Icon name="copy" size={14} /></button>
      </div>

      {/* status pulse */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6, gap: 8 }}>
        <ThyBadge variant="gold">
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#E8C97A',
            display: 'inline-block', marginRight: 4,
            animation: 'thy-pulse 1.8s ease-out infinite',
          }} />
          {u.c.boardingNow}
        </ThyBadge>
        <ThyBadge variant="mono">EBHHN3</ThyBadge>
      </div>

      {/* ticket */}
      <div style={{ padding: '16px 18px 0', position: 'relative' }}>
        <div style={{
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.025) 100%)',
          border: '1px solid rgba(197,160,89,0.25)',
          borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 24px rgba(197,160,89,0.12)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        }}>
          {/* top strip */}
          <div style={{ padding: '14px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Crane dark size={20} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
              color: u.accent.fg, letterSpacing: 1.5,
            }}>TK 1853 · A321neo</span>
          </div>
          <div style={{ height: 1, background: 'rgba(197,160,89,0.2)' }} />

          {/* big route */}
          <div style={{ padding: '20px 18px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 38, lineHeight: 1, color: '#fff', letterSpacing: -1 }}>IST</div>
              <div style={{ fontSize: 11, color: '#B2C0D1', marginTop: 4 }}>İstanbul</div>
            </div>
            <div style={{ flex: 1, position: 'relative', height: 24 }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, borderTop: '1.5px dashed rgba(197,160,89,0.5)' }} />
              <span style={{
                position: 'absolute', top: -5, left: '6%', fontSize: 18, color: u.accent.fg,
                animation: 'thy-plane 3.2s ease-in-out infinite',
              }}>✈</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 38, lineHeight: 1, color: '#fff', letterSpacing: -1 }}>FCO</div>
              <div style={{ fontSize: 11, color: '#B2C0D1', marginTop: 4 }}>Roma</div>
            </div>
          </div>

          {/* mini stats grid */}
          <div style={{
            padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 12, borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <MiniStat label={u.lang === 'tr' ? 'YOLCU' : 'PASSENGER'} value="A. KAYA" dark />
            <MiniStat label={u.c.gate} value="A12" dark />
            <MiniStat label={u.c.seat} value="14F" dark />
            <MiniStat label={u.lang === 'tr' ? 'BİNİŞ' : 'BOARDING'} value="13:55" dark />
            <MiniStat label={u.lang === 'tr' ? 'KALKIŞ' : 'DEP'} value="14:25" dark />
            <MiniStat label="GROUP" value="3" dark />
          </div>

          {/* perforation */}
          <div style={{ position: 'relative', height: 2 }}>
            <div style={{ height: 1, borderTop: '1.5px dashed rgba(197,160,89,0.35)', margin: '0 16px' }} />
            <div style={{ position: 'absolute', left: -10, top: -7, width: 18, height: 18, borderRadius: '50%', background: '#050B14' }} />
            <div style={{ position: 'absolute', right: -10, top: -7, width: 18, height: 18, borderRadius: '50%', background: '#050B14' }} />
          </div>

          {/* QR section */}
          <div style={{ padding: '18px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 96, height: 96, borderRadius: 10, background: '#fff',
              padding: 8, position: 'relative', flexShrink: 0,
              boxShadow: `0 0 20px ${u.accent.glow}`,
            }}>
              <QRGlyph size={80} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: u.accent.fg, letterSpacing: 2 }}>{u.lang === 'tr' ? 'BAĞLANTILI' : 'CONNECTED'}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#fff', marginTop: 4, fontWeight: 700, letterSpacing: 1 }}>
                EBHHN3
              </div>
              <div style={{ fontSize: 10.5, color: '#B2C0D1', marginTop: 8, lineHeight: 1.4 }}>
                {u.lang === 'tr'
                  ? 'Kapıya 13:55\'te varın. Kabin ekibi sizi bekliyor.'
                  : 'Be at the gate by 13:55. Cabin crew is waiting.'}
              </div>
            </div>
          </div>
        </div>

        {/* secondary actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <SecondaryAct icon="qr"    label={u.lang === 'tr' ? 'Check-in' : 'Check-in'} dark accent={u.accent} onClick={() => nav('checkin')} />
          <SecondaryAct icon="coffee" label="Lounge" dark accent={u.accent} onClick={() => nav('lounge')} />
          <SecondaryAct icon="map"   label={u.c.loungeRoute} dark accent={u.accent} />
        </div>
      </div>

      {/* panorama footer */}
      <div style={{
        marginTop: 'auto', height: 84, position: 'relative', overflow: 'hidden',
        background: 'transparent',
      }}>
        <img src={(typeof window !== 'undefined' && window.__resources?.panorama) || 'assets/panorama.png'} alt=""
          style={{
            position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '120%', maxWidth: 'none', opacity: 0.18, filter: 'brightness(2) saturate(0)',
          }}/>
      </div>
    </div>
  );
}

function SecondaryAct({ icon, label, dark, accent, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '10px 8px', borderRadius: 12,
      background: dark ? 'rgba(255,255,255,0.045)' : '#fff',
      border: '1px solid ' + (dark ? 'rgba(255,255,255,0.085)' : '#E2E8F0'),
      color: dark ? '#fff' : '#0A1628', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
      fontFamily: 'inherit', fontSize: 10.5, fontWeight: 700, letterSpacing: 0.2,
    }}>
      <Icon name={icon} size={16} color={accent.fg} />
      {label}
    </button>
  );
}

function QRGlyph({ size = 80 }) {
  // Deterministic pseudo-QR pattern, 21×21 grid
  const N = 21;
  const cells = React.useMemo(() => {
    const out = [];
    let seed = 421;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      seed = (seed * 9301 + 49297) % 233280;
      const on = (seed / 233280) > 0.5;
      out.push({ x, y, on });
    }
    return out;
  }, []);
  const corner = (cx, cy) => (
    <g key={`c-${cx}-${cy}`}>
      <rect x={cx} y={cy} width="7" height="7" fill="#0A1628" />
      <rect x={cx + 1} y={cy + 1} width="5" height="5" fill="#fff" />
      <rect x={cx + 2} y={cy + 2} width="3" height="3" fill="#0A1628" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges">
      <rect width={N} height={N} fill="#fff" />
      {cells.map((c, i) => {
        const inCorner =
          (c.x < 7 && c.y < 7) ||
          (c.x >= N - 7 && c.y < 7) ||
          (c.x < 7 && c.y >= N - 7);
        if (inCorner) return null;
        return c.on ? <rect key={i} x={c.x} y={c.y} width="1" height="1" fill="#0A1628" /> : null;
      })}
      {corner(0, 0)}
      {corner(N - 7, 0)}
      {corner(0, N - 7)}
    </svg>
  );
}

Object.assign(window, {
  SplashScreen, FlightBoardScreen, SearchScreen, ResultsScreen, BoardingPassScreen,
});
