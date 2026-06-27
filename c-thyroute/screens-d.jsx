// screens-d.jsx — B-group screens 14–18.
//
// 14 PriceAlert       — Bloomberg / trading terminal (mono, mini chart)
// 15 AirportPicker    — iOS-style search sheet with map glass
// 16 TurkiyeTuru      — National Geographic editorial cover
// 17 TurkiyeTuruRoute — Railway timetable / vintage map
// 18 CheckIn          — Japanese minimalist (NFC tap, brand red dot)

// =================================================================
// 14 ▸ PRICE ALERT — Trading terminal
// =================================================================
// fmtTL helper (mobil)
function fmtTL(n) { return Math.round(n).toLocaleString('tr-TR'); }

// Rota fiyatını kabin tipine göre bileşenlerine ayırır
function mobileBreakdown(route) {
  const total = parseInt(String(route.price || '0').replace(/[^\d]/g, ''), 10) / 100 || 0;
  const isBiz = /business|prime/i.test(route.cabin || '');
  return {
    total,
    flight: Math.round(total * (isBiz ? 0.73 : 0.62)),
    hotel:  Math.round(total * (isBiz ? 0.22 : 0.31)),
    vip:    Math.round(total * (isBiz ? 0.05 : 0.07)),
  };
}

function PriceAlertScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: true });
  const topPad = k === 'ios' ? 50 : 14;
  const toast = useToast();

  // Route mode — Kayıtlı Rotalarım'dan alarm butonu ile gelindiğinde
  const routeData = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('thy-route-alarm-target-v1');
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }, []);
  const routeMode = !!routeData;
  const breakdown = routeMode ? mobileBreakdown(routeData) : null;
  const totalTL   = breakdown ? breakdown.total : 5640;

  // Adaptif slider aralığı
  const sliderMin  = routeMode ? Math.round(totalTL * 0.70 / 500) * 500 : 3900;
  const sliderMax  = routeMode ? Math.round(totalTL * 1.05 / 500) * 500 : 6800;
  const sliderStep = routeMode ? (totalTL > 50000 ? 500 : totalTL > 10000 ? 100 : 50) : 50;
  const initTarget = routeMode ? Math.round(totalTL * 0.88 / sliderStep) * sliderStep : 4500;
  const [target, setTarget] = React.useState(initTarget);

  // 30 günlük simüle fiyat hareketi
  const data = React.useMemo(() => {
    const out = []; const base = totalTL;
    for (let i = 0; i < 30; i++) {
      const noise = Math.sin(i * 0.6) * (base * 0.06) + Math.cos(i * 0.31) * (base * 0.035)
                  + ((i % 5 === 0) ? -base * 0.03 : base * 0.012);
      out.push(Math.round(Math.max(base * 0.78, Math.min(base * 1.12, base + noise))));
    }
    out[out.length - 1] = base; // son nokta = gerçek toplam
    return out;
  }, [totalTL]);

  const cMin = Math.min(...data), cMax = Math.max(...data);
  const cur = data[data.length - 1];
  const delta = cur - data[0];
  const savingsAbs = Math.max(0, cur - target);
  const savingsPct = cur > 0 ? ((1 - target / cur) * 100) : 0;

  const W = 320, H = 110;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - cMin) / (cMax - cMin || 1)) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const targetClamped = Math.max(cMin, Math.min(cMax, target));
  const targetY = H - ((targetClamped - cMin) / (cMax - cMin || 1)) * H;

  const legsLabel = routeMode ? (routeData.legs || []).join('·') : 'IST·FCO';

  const handleSetAlarm = () => {
    try {
      const list = JSON.parse(localStorage.getItem('thy-route-alarms-v1') || '[]');
      list.unshift({
        routeId:   routeData?.id || null,
        routeName: routeData?.name || 'IST → FCO',
        legs:      routeData?.legs || ['IST','FCO'],
        currentTL: cur, targetTL: target,
        savingsTL: savingsAbs,
        setAt:     new Date().toISOString(),
      });
      localStorage.setItem('thy-route-alarms-v1', JSON.stringify(list.slice(0, 50)));
      localStorage.removeItem('thy-route-alarm-target-v1');
    } catch (_) {}
    toast({ type: 'success', icon: '🔔', children: u.lang === 'tr'
      ? `Alarm kuruldu · ${fmtTL(target)} TL · tasarruf ${fmtTL(savingsAbs)} TL`
      : `Alert set · ${fmtTL(target)} TL · save ${fmtTL(savingsAbs)} TL` });
    setTimeout(() => nav(routeMode ? 'routes' : 'notifications'), 700);
  };

  return (
    <div className="screen-enter" style={{
      minHeight: '100%', background: '#08120D',
      fontFamily: "'DM Mono', monospace", color: '#E5F3EA',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* terminal header */}
      <div style={{
        padding: `${topPad}px 14px 10px`, background: '#0B1A14',
        borderBottom: '1px solid #1A3326', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={() => nav(routeMode ? 'routes' : 'search')} style={{
          background: '#1A3326', border: '1px solid #2A4D3A',
          color: '#E5F3EA', padding: '6px 10px', borderRadius: 2,
          cursor: 'pointer', fontFamily: 'inherit', fontSize: 11,
        }}>← {routeMode ? (u.lang === 'tr' ? 'ROTALARIM' : 'ROUTES') : 'BACK'}</button>
        <span style={{ fontSize: 10, color: '#5B8773', letterSpacing: 1 }}>
          {routeMode ? `ROUTE ALERT · ${routeData.id || ''}` : 'PRICE ALERT'}
        </span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
          <span style={{ fontSize: 10, color: '#22C55E' }}>LIVE</span>
        </span>
      </div>

      {/* Rota kırılım paneli — sadece route mode */}
      {routeMode && (
        <div style={{
          margin: '10px 14px 0',
          background: 'linear-gradient(135deg, rgba(197,160,89,0.10) 0%, rgba(10,22,40,0.3) 100%)',
          border: '1px solid rgba(197,160,89,0.35)', borderRadius: 6, padding: '12px 14px',
        }}>
          <div style={{ fontSize: 9, letterSpacing: 1.8, color: '#C5A059', fontWeight: 800, marginBottom: 6 }}>
            ✦ {u.lang === 'tr' ? 'KAYITLI ROTA · TOPLAM' : 'SAVED ROUTE · TOTAL'}
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: '#F4EBD9', marginBottom: 8 }}>
            {routeData.name}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 8 }}>
            {[
              { l: u.lang==='tr'?'UÇUŞ':'FLIGHT',   v: breakdown.flight, icon: '✈' },
              { l: u.lang==='tr'?'OTEL':'HOTEL',    v: breakdown.hotel,  icon: '🏨' },
              { l: u.lang==='tr'?'VIP':'VIP',       v: breakdown.vip,    icon: '🚘' },
            ].map(item => (
              <div key={item.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 8.5, color: '#5B8773', letterSpacing: 1.4, fontWeight: 800 }}>{item.icon} {item.l}</div>
                <div style={{ fontSize: 12, color: '#E5F3EA', fontWeight: 600, marginTop: 2 }}>{fmtTL(item.v)}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            paddingTop: 8, borderTop: '1px solid rgba(197,160,89,0.25)' }}>
            <span style={{ fontSize: 9, color: '#C5A059', fontWeight: 800, letterSpacing: 1.4 }}>= TOPLAM</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: '#E5C97A', fontWeight: 700 }}>
              {fmtTL(breakdown.total)} <span style={{ fontSize: 10, color: '#C5A059' }}>TL</span>
            </span>
          </div>
        </div>
      )}

      {/* ticker */}
      <div style={{ padding: '12px 14px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: '#5B8773' }}>{legsLabel}</span>
          <span style={{ fontSize: 10, color: '#5B8773' }}>{u.lang==='tr'?'SON 30G':'LAST 30D'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 36, fontWeight: 500, letterSpacing: -1, color: '#fff' }}>
            {fmtTL(cur)}
          </span>
          <span style={{ fontSize: 12, color: '#5B8773' }}>TL</span>
          <span style={{
            marginLeft: 'auto', padding: '3px 7px',
            background: delta >= 0 ? 'rgba(239,46,31,0.15)' : 'rgba(34,197,94,0.15)',
            color: delta >= 0 ? '#EF6F66' : '#22C55E',
            borderRadius: 2, fontSize: 10, fontWeight: 600,
          }}>{delta >= 0 ? '▲' : '▼'} {fmtTL(Math.abs(delta))}</span>
        </div>
      </div>

      {/* chart */}
      <div style={{ padding: '10px 0 4px', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${W} ${H + 18}`} width="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
          {[0,1,2,3,4].map(i => (
            <line key={i} x1="0" x2={W} y1={(i/4)*H} y2={(i/4)*H}
              stroke="#1A3326" strokeWidth="0.5" strokeDasharray="2 3" />
          ))}
          <polygon points={`0,${H} ${points} ${W},${H}`} fill="url(#grad-m)" />
          <defs>
            <linearGradient id="grad-m" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" x2={W} y1={targetY} y2={targetY} stroke="#C5A059" strokeWidth="1.2" strokeDasharray="4 3" />
          <rect x={W - 52} y={targetY - 9} width="52" height="14" fill="#C5A059" />
          <text x={W - 26} y={targetY + 1} fill="#0A1628" fontSize="9" textAnchor="middle" fontWeight="800">
            {u.lang==='tr'?'HEDEF':'TARGET'}
          </text>
          <polyline points={points} fill="none" stroke="#22C55E" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={W} cy={H - ((cur - cMin)/(cMax - cMin || 1))*H} r="3.5" fill="#22C55E" />
          <circle cx={W} cy={H - ((cur - cMin)/(cMax - cMin || 1))*H} r="7" fill="#22C55E" opacity="0.25">
            <animate attributeName="r" values="3.5;9;3.5" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* mini stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop: '1px solid #1A3326', borderBottom: '1px solid #1A3326', margin: '4px 0' }}>
        <TermStat label={u.lang==='tr'?'DÜŞÜK':'LOW'}   value={fmtTL(cMin)} />
        <TermStat label={u.lang==='tr'?'YÜKSEK':'HIGH'} value={fmtTL(cMax)} />
        <TermStat label={u.lang==='tr'?'GÜNCEL':'CUR'}  value={fmtTL(cur)} />
        <TermStat label={u.lang==='tr'?'HEDEF':'TGT'}   value={fmtTL(target)} last />
      </div>

      {/* target slider */}
      <div style={{ padding: '14px 14px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: '#C5A059', fontWeight: 800, letterSpacing: 1.4 }}>
          <span>✦ {u.lang==='tr'?'HEDEF FİYATI AYARLA':'SET TARGET PRICE'}</span>
          <span style={{ color: '#5B8773' }}>{fmtTL(sliderMin)}–{fmtTL(sliderMax)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
          <span style={{ fontSize: 34, color: '#E5C97A', fontWeight: 600, letterSpacing: -1 }}>
            {fmtTL(target)}
          </span>
          <span style={{ fontSize: 12, color: '#C5A059' }}>TL</span>
          <span style={{ marginLeft: 'auto', fontSize: 11,
            color: savingsAbs > 0 ? '#22C55E' : '#EF6F66', fontWeight: 700 }}>
            {savingsAbs > 0 ? '−' : '+'}{fmtTL(Math.abs(cur - target))} TL
            <span style={{ color: '#5B8773', fontWeight: 400, marginLeft: 3 }}>
              ({savingsAbs > 0 ? '-' : '+'}{Math.abs(savingsPct).toFixed(1)}%)
            </span>
          </span>
        </div>
        <input type="range" min={sliderMin} max={sliderMax} step={sliderStep}
          value={target} onChange={(e) => setTarget(parseInt(e.target.value, 10))}
          style={{ width: '100%', marginTop: 10, accentColor: '#C5A059' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#5B8773', marginTop: 2 }}>
          <span>{fmtTL(sliderMin)} TL</span><span>{fmtTL(sliderMax)} TL</span>
        </div>
      </div>

      {/* freq chips */}
      <div style={{ padding: '2px 14px 12px', display: 'flex', gap: 6 }}>
        {[
          { id: 'inst', l: u.lang==='tr'?'Anında':'Instant', on: true },
          { id: 'day',  l: u.lang==='tr'?'Günde':'Daily' },
          { id: 'wk',   l: u.lang==='tr'?'Haftada':'Weekly' },
        ].map(o => (
          <button key={o.id} style={{
            flex: 1, padding: '9px 4px', borderRadius: 2,
            background: o.on ? '#1A3326' : 'transparent',
            color: o.on ? '#22C55E' : '#5B8773',
            border: '1px solid ' + (o.on ? '#22C55E' : '#1A3326'),
            fontFamily: 'inherit', fontSize: 10.5, cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: 1,
          }}>{o.l}</button>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '0 14px 22px', marginTop: 'auto' }}>
        <button onClick={handleSetAlarm} style={{
          width: '100%', padding: '15px',
          background: 'linear-gradient(135deg, #C5A059 0%, #E5C97A 100%)',
          color: '#1A1206', border: 'none', borderRadius: 4,
          fontFamily: 'inherit', fontWeight: 800, fontSize: 13, cursor: 'pointer', letterSpacing: 1.2,
          boxShadow: '0 8px 22px rgba(197,160,89,0.40)',
        }}>✦ {u.lang==='tr'?'ALARMI KUR':'SET ALERT'} →</button>
        {savingsAbs > 0 && (
          <div style={{ marginTop: 10, fontSize: 10.5, color: '#5B8773', textAlign: 'center', lineHeight: 1.5 }}>
            {u.lang==='tr'
              ? `Fiyat ${fmtTL(target)} TL altına düşünce bildirim alırsın · tasarruf ${fmtTL(savingsAbs)} TL`
              : `Alert when price drops below ${fmtTL(target)} TL · save ${fmtTL(savingsAbs)} TL`}
          </div>
        )}
      </div>
    </div>
  );
}
function TermStat({ label, value, last }) {
  return (
    <div style={{
      padding: '10px 6px 8px', textAlign: 'center',
      borderRight: last ? 'none' : '1px solid #1A3326',
    }}>
      <div style={{ fontSize: 9, color: '#5B8773', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#E5F3EA', fontWeight: 500, marginTop: 2 }}>{value}</div>
    </div>
  );
}

// =================================================================
// 15 ▸ AIRPORT PICKER — iOS-style glass sheet
// =================================================================
function AirportPickerScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const toast = useToast();
  const [query, setQuery] = React.useState('');

  const recent = [
    { code: 'IST', city: 'İstanbul', country: 'Türkiye',     name: 'Havalimanı', flag: '🇹🇷' },
    { code: 'SAW', city: 'İstanbul', country: 'Türkiye',     name: 'Sabiha Gökçen', flag: '🇹🇷' },
    { code: 'AYT', city: 'Antalya',  country: 'Türkiye',     name: 'Havalimanı', flag: '🇹🇷' },
  ];
  const popular = [
    { code: 'FCO', city: 'Roma',     country: 'İtalya',      name: 'Fiumicino',     flag: '🇮🇹' },
    { code: 'AMS', city: 'Amsterdam',country: 'Hollanda',    name: 'Schiphol',      flag: '🇳🇱' },
    { code: 'LHR', city: 'Londra',   country: 'Birleşik K.',  name: 'Heathrow',      flag: '🇬🇧' },
    { code: 'JFK', city: 'New York', country: 'ABD',         name: 'JFK',           flag: '🇺🇸' },
    { code: 'NRT', city: 'Tokyo',    country: 'Japonya',     name: 'Narita',        flag: '🇯🇵' },
    { code: 'CPT', city: 'Cape Town',country: 'Güney Afrika',name: 'International', flag: '🇿🇦' },
  ];
  const q = query.toLowerCase();
  const filteredPopular = popular.filter(p =>
    !q || p.code.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.country.toLowerCase().includes(q)
  );

  const pickHandler = (a) => {
    toast({ type: 'success', icon: '✓', children: u.lang==='tr'?`${a.city} (${a.code}) seçildi`:`${a.city} (${a.code}) picked` });
    setTimeout(() => nav('search'), 500);
  };

  return (
    <div className="screen-enter" style={{
      position: 'relative', minHeight: '100%', overflow: 'hidden',
      fontFamily: "-apple-system, system-ui, sans-serif",
      color: '#0A1628', display: 'flex', flexDirection: 'column',
      background: '#F2F2F7',
    }}>
      {/* map backdrop */}
      <img src={(window.__resources?.routeMap) || 'assets/AnaEkran.png'} alt="" aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                 objectFit: 'cover', objectPosition: '20% 30%', filter: 'saturate(0.6) brightness(1.05)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(242,242,247,0.6) 0%, rgba(242,242,247,0.85) 50%, #F2F2F7 80%)' }} />

      {/* top bar */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: `${topPad}px 16px 8px`, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={() => nav('search')} style={{
          background: 'transparent', border: 'none', color: '#007AFF',
          fontSize: 17, fontWeight: 500, padding: 0, cursor: 'pointer',
        }}>{u.lang==='tr'?'Vazgeç':'Cancel'}</button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 17, color: '#0A1628' }}>
          {u.lang==='tr'?'Nereden':'From'}
        </div>
        <span style={{ width: 56 }} />
      </div>

      {/* search field */}
      <div style={{ position: 'relative', zIndex: 2, padding: '6px 14px 10px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', background: 'rgba(118,118,128,0.15)',
          borderRadius: 10, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        }}>
          <Icon name="search" size={16} color="#8E8E93" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={u.lang==='tr'?'Şehir, havalimanı veya IATA kodu':'City, airport or IATA code'}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontFamily: 'inherit', fontSize: 15, color: '#0A1628',
            }} />
          {query && (
            <button onClick={() => setQuery('')} style={{
              background: 'rgba(120,120,128,0.4)', color: '#fff',
              border: 'none', width: 18, height: 18, borderRadius: '50%',
              cursor: 'pointer', fontSize: 11,
            }}>×</button>
          )}
        </div>
      </div>

      {/* "near me" quick action */}
      <div style={{ position: 'relative', zIndex: 2, padding: '4px 14px 6px' }}>
        <button onClick={() => pickHandler({ code: 'IST', city: 'İstanbul' })} style={{
          width: '100%', background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
          border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 12,
          padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        }}>
          <span style={{
            width: 34, height: 34, borderRadius: '50%', background: '#007AFF',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
          }}><Icon name="location" size={16} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{u.lang==='tr'?'Bulunduğum konum':'Use my location'}</div>
            <div style={{ fontSize: 12, color: '#8E8E93' }}>IST · İstanbul Havalimanı</div>
          </div>
          <Icon name="chevR" size={14} color="#8E8E93" />
        </button>
      </div>

      {/* lists */}
      <div style={{ position: 'relative', zIndex: 2, padding: '8px 14px 18px', flex: 1, overflowY: 'auto' }}>
        {!query && (
          <>
            <ListHeader>{u.lang==='tr'?'Son aramalar':'Recents'}</ListHeader>
            <GlassList items={recent} onPick={pickHandler} />
          </>
        )}
        <ListHeader style={{ marginTop: query ? 0 : 14 }}>
          {query ? (u.lang==='tr'?`"${query}" sonuçları`:`Results for "${query}"`) : (u.lang==='tr'?'Popüler':'Popular')}
        </ListHeader>
        <GlassList items={filteredPopular} onPick={pickHandler} />
      </div>
    </div>
  );
}
function ListHeader({ children, style = {} }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5,
      color: '#3C3C43', opacity: 0.6, padding: '6px 6px 6px',
      ...style,
    }}>{children}</div>
  );
}
function GlassList({ items, onPick }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 12,
      overflow: 'hidden',
    }}>
      {items.map((a, i) => (
        <button key={a.code} onClick={() => onPick(a)} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '11px 14px', width: '100%', textAlign: 'left',
          background: 'transparent', border: 'none', cursor: 'pointer',
          borderBottom: i < items.length - 1 ? '0.5px solid rgba(60,60,67,0.12)' : 'none',
          fontFamily: 'inherit',
        }}>
          <span style={{ fontSize: 24 }}>{a.flag}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{a.city}</div>
            <div style={{ fontSize: 12, color: '#8E8E93' }}>{a.name} · {a.country}</div>
          </div>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600,
            color: '#3C3C43', background: 'rgba(120,120,128,0.16)',
            padding: '3px 8px', borderRadius: 4,
          }}>{a.code}</span>
        </button>
      ))}
    </div>
  );
}

// =================================================================
// 16 ▸ TÜRKİYE TURU — National Geographic editorial cover
// =================================================================
function TurkiyeTuruScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 14;

  return (
    <div className="screen-enter" style={{
      position: 'relative', minHeight: '100%', overflow: 'hidden',
      background: '#0E0E0E', color: '#F4EBD9',
      fontFamily: "'EB Garamond', Georgia, serif",
      display: 'flex', flexDirection: 'column',
    }}>
      {/* cover photo (Cappadocia-feel using radial warm + map) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 70% 50% at 50% 30%, #E5712C 0%, #B7372A 35%, #6F1E1A 65%, #1F0907 100%)
        `,
      }}>
        <img src={(window.__resources?.routeMap) || 'assets/AnaEkran.png'} alt="" aria-hidden
          style={{ width: '100%', height: '100%', objectFit: 'cover',
                   mixBlendMode: 'overlay', opacity: 0.4, filter: 'sepia(0.6) saturate(1.2)' }} />
        {/* grain */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-radial-gradient(circle at 30% 40%, rgba(0,0,0,0.05) 0 1.5px, transparent 1.5px 4px)',
          mixBlendMode: 'multiply',
        }} />
      </div>

      {/* top frame — yellow border like Nat Geo */}
      <div style={{
        position: 'absolute', top: topPad - 6, left: 12, right: 12, bottom: 12,
        border: '4px solid #F4C24C', pointerEvents: 'none', zIndex: 1,
      }} />

      {/* masthead bar */}
      <div style={{
        position: 'relative', zIndex: 2, margin: '0 12px',
        padding: `${topPad + 4}px 14px 6px`,
      }}>
        <button onClick={() => nav('board')} style={{
          background: '#F4C24C', border: 'none', borderRadius: 0,
          padding: '6px 10px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 12,
          letterSpacing: 1, color: '#0E0E0E', cursor: 'pointer',
        }}>← BACK</button>
      </div>

      {/* huge title block, bottom-anchored */}
      <div style={{
        position: 'relative', zIndex: 2, marginTop: 'auto',
        padding: '180px 24px 28px',
      }}>
        {/* small eyebrow */}
        <div style={{
          fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
          fontSize: 13, letterSpacing: 2, color: '#F4C24C',
        }}>
          THY ROUTE EXPEDITION · VOL. XXIV
        </div>
        {/* MASTHEAD */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 900,
          fontSize: 64, lineHeight: 0.88, letterSpacing: -2.5,
          margin: '8px 0 0', color: '#F4EBD9',
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}>
          {u.lang==='tr'?'Türkiye':'Türkiye'}
          <br/>
          <span style={{ fontStyle: 'italic', fontWeight: 500, fontSize: 44, color: '#F4C24C' }}>
            {u.lang==='tr'?'baştan sona.':'end to end.'}
          </span>
        </h1>

        <div style={{
          marginTop: 16, fontSize: 14, lineHeight: 1.5,
          color: '#F4EBD9CC', maxWidth: 320, fontWeight: 400,
        }}>
          {u.lang==='tr'
            ? 'Yedi şehir, dört hafta. İstanbul\'dan Karadeniz\'e, oradan Kapadokya\'nın balonlarına ve Akdeniz\'in masmavi koylarına.'
            : 'Seven cities, four weeks. From Istanbul to the Black Sea, through Cappadocia\'s balloon dawns to the turquoise coves of the Mediterranean.'}
        </div>

        {/* tour packages strip — 8 journeys, horizontal scroll */}
        <div style={{
          marginTop: 6, fontFamily: "'Bebas Neue', sans-serif", fontSize: 13,
          letterSpacing: 3, color: '#F4C24C',
        }}>
          ★ EIGHT JOURNEYS · {u.lang==='tr'?'SEKIZ ROTA':'EIGHT ROUTES'} ★
        </div>
        <div style={{
          marginTop: 12, display: 'flex', gap: 10, overflowX: 'auto', margin: '12px -24px 0', padding: '0 24px 4px',
          scrollSnapType: 'x mandatory',
        }}>
          {TR_TOURS.map(tr => (
            <TourCard key={tr.id} tour={tr} lang={u.lang} onSelect={() => {
              if (typeof thyBuildSelection === 'function') thyBuildSelection(tr);
              nav('turkiyeRoute');
            }} />
          ))}
        </div>

        <div style={{
          marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#F4C24C', letterSpacing: 2 }}>$ 09 ·  6.10.26</div>
            <div style={{ fontSize: 12, color: '#F4EBD9AA', fontStyle: 'italic', marginTop: 2 }}>
              {u.lang==='tr'?'photographs by THY Route':'photographs by THY Route'}
            </div>
          </div>
          <button onClick={() => nav('turkiyeRoute')} style={{
            background: '#F4C24C', border: 'none', borderRadius: 0,
            padding: '14px 22px', fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 18, letterSpacing: 2, color: '#0E0E0E', cursor: 'pointer',
            boxShadow: '4px 4px 0 #B7312C',
          }}>OPEN ROUTE →</button>
        </div>
      </div>
    </div>
  );
}
// 8 Türkiye tour packages — colored editorial cards, mobile-friendly
const TR_TOURS = [
  { id: 'grand',      vol: 'I',    color: '#B7312C', glyph: '✦', route: 'IST·NAV·AYT·ADB',
    title: { tr: 'Klasik Grand Tour',     en: 'The Grand Tour' },
    blurb: { tr: 'Yedi şehir, dört hafta.', en: 'Seven cities, four weeks.' },
    days:  { tr: '14 gün', en: '14 days' }, price: '32.400', badge: 'BESTSELLER' },
  { id: 'lycian',     vol: 'II',   color: '#2A8B9E', glyph: '⛰', route: 'AYT·KAŞ·DLM',
    title: { tr: 'Likya Yolu',            en: 'The Lycian Way' },
    blurb: { tr: '500 km Akdeniz kıyı yürüyüşü.', en: '500 km of Mediterranean coast trail.' },
    days:  { tr: '9 gün',  en: '9 days' },  price: '24.800', badge: 'YENİ' },
  { id: 'gobekli',    vol: 'III',  color: '#B6552E', glyph: '𓊐', route: 'GZT·ŞFQ·MRD',
    title: { tr: 'Göbekli Tepe',          en: 'Göbekli Tepe' },
    blurb: { tr: 'Dünyanın bilinen en eski tapınağı.', en: 'World\'s oldest known temple.' },
    days:  { tr: '5 gün',  en: '5 days' },  price: '16.400', badge: '12.000 YIL' },
  { id: 'nemrut',     vol: 'IV',   color: '#C5A059', glyph: '☉', route: 'GZT·ADF',
    title: { tr: 'Nemrut Dağı',           en: 'Mount Nemrut' },
    blurb: { tr: 'Tanrı heykelleri arasında gün doğumu.', en: 'Sunrise among the god statues.' },
    days:  { tr: '4 gün',  en: '4 days' },  price: '14.200', badge: 'UNESCO' },
  { id: 'aegean',     vol: 'V',    color: '#6B8FAA', glyph: '◔', route: 'ADB·BJV·DNZ',
    title: { tr: 'Ege Antik Rotası',      en: 'Aegean Ancient Route' },
    blurb: { tr: 'Efes · Bergama · Afrodisias · Hierapolis.', en: 'Ephesus · Pergamon · Aphrodisias.' },
    days:  { tr: '8 gün',  en: '8 days' },  price: '21.600', badge: 'CLASSIC' },
  { id: 'cappadocia', vol: 'VI',   color: '#E5712C', glyph: '◯', route: 'NAV·ASR',
    title: { tr: 'Kapadokya Şafağı',      en: 'Cappadocia Sunrise' },
    blurb: { tr: 'Balonda gün doğumu · Göreme · Avanos.', en: 'Balloons at dawn · Göreme · Avanos.' },
    days:  { tr: '3 gün',  en: '3 days' },  price: '11.800', badge: 'ICONIC' },
  { id: 'gallipoli',  vol: 'VII',  color: '#6E7B45', glyph: '✚', route: 'IST·ÇKL',
    title: { tr: 'Gelibolu & Truva',      en: 'Gallipoli & Troy' },
    blurb: { tr: 'ANZAC anısı · Troya\'nın taşları.', en: 'ANZAC memorial · stones of Troy.' },
    days:  { tr: '4 gün',  en: '4 days' },  price: '13.500', badge: 'HERITAGE' },
  { id: 'blackSea',   vol: 'VIII', color: '#1F4D3F', glyph: '◭', route: 'TZX·RZE',
    title: { tr: 'Karadeniz Yaylaları',   en: 'Black Sea Highlands' },
    blurb: { tr: 'Sumela · Ayder · sis ve çay.', en: 'Sumela · Ayder · mist and tea.' },
    days:  { tr: '6 gün',  en: '6 days' },  price: '18.900', badge: 'YENİ' },
];

function TourCard({ tour, lang, onSelect }) {
  return (
    <div onClick={onSelect} style={{
      minWidth: 178, maxWidth: 178, scrollSnapAlign: 'start',
      background: '#F4EBD9', color: '#0E0E0E',
      border: '1.5px solid #0E0E0E', borderRadius: 0,
      boxShadow: '3px 3px 0 #F4C24C',
      flexShrink: 0, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      cursor: onSelect ? 'pointer' : 'default',
      transition: 'transform 120ms ease, box-shadow 120ms ease',
    }}
    onMouseEnter={e => { if (onSelect) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='3px 5px 0 #F4C24C'; } }}
    onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='3px 3px 0 #F4C24C'; }}
    >
      {/* colored top cover with big glyph + volume */}
      <div style={{
        position: 'relative', height: 78, padding: '8px 10px',
        background: `linear-gradient(135deg, ${tour.color}, ${tour.color}DD 70%, ${tour.color}99)`,
        color: '#F4EBD9',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 8.5,
            letterSpacing: 1.5, opacity: 0.85,
          }}>VOL · {tour.vol}</span>
          <span style={{
            padding: '1px 5px', background: '#F4C24C', color: '#0E0E0E',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 9, letterSpacing: 1,
          }}>{tour.badge}</span>
        </div>
        <div style={{
          position: 'absolute', right: -6, bottom: -14,
          fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
          fontSize: 72, lineHeight: 1, color: '#F4EBD9', opacity: 0.32,
        }}>{tour.glyph}</div>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1.2,
          opacity: 0.95, position: 'relative',
        }}>{tour.route}</div>
      </div>
      {/* body */}
      <div style={{ padding: '10px 11px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1.5, color: '#525252' }}>{tour.days[lang]}</div>
        <div style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 700,
          fontSize: 15, marginTop: 2, lineHeight: 1.1, color: '#0E0E0E',
        }}>{tour.title[lang]}</div>
        <div style={{
          marginTop: 6, fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
          fontSize: 11, color: '#525252', lineHeight: 1.3, flex: 1,
        }}>{tour.blurb[lang]}</div>
        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          paddingTop: 6, borderTop: '1px dashed #0E0E0E44',
        }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 0.5, color: '#0E0E0E' }}>
            {tour.price} <span style={{ fontSize: 9 }}>TL</span>
          </span>
          <span style={{ color: tour.color, fontSize: 14, fontWeight: 700 }}>→</span>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// 17 ▸ TÜRKİYE TURU ROUTE — Railway timetable / vintage map
// =================================================================
function TurkiyeRouteScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const toast = useToast();

  const stops = [
    { d: '02·06', time: '14:25', city: 'İstanbul',  code: 'IST', nights: 3, notes: 'Boğaz · Topkapı · Çarşı', color: '#B7312C' },
    { d: '05·06', time: '08:10', city: 'Kapadokya', code: 'NAV', nights: 2, notes: 'Balon · Göreme · Avanos',  color: '#C5A059' },
    { d: '07·06', time: '11:35', city: 'Pamukkale', code: 'DNZ', nights: 1, notes: 'Travertenler · Hierapolis', color: '#7BB6E8' },
    { d: '08·06', time: '16:50', city: 'Antalya',   code: 'AYT', nights: 4, notes: 'Kaleiçi · Olimpos · plaj', color: '#0E7A5F' },
    { d: '12·06', time: '09:20', city: 'İzmir',     code: 'ADB', nights: 2, notes: 'Efes · Çeşme · Alaçatı',  color: '#E58A2C' },
    { d: '14·06', time: '13:00', city: 'Trabzon',   code: 'TZX', nights: 2, notes: 'Sumela · yayla',         color: '#1F4D80' },
  ];

  // Duraklar arası hava yolu belirleyici
  function airlineFor(fromCode, toCode, idx) {
    const SHORT = new Set(['NAV-DNZ','DNZ-NAV','DNZ-AYT','AYT-DNZ','AYT-ADB','ADB-AYT','ADB-DNZ']);
    const isShort = SHORT.has(fromCode + '-' + toCode);
    const seed = (fromCode.charCodeAt(0) + toCode.charCodeAt(0) + idx * 7) % 900;
    return isShort
      ? { code: 'AJ', name: 'AnadoluJet', color: '#E8450A', flight: 'AJ\u00a0' + (1100 + seed) }
      : { code: 'TK', name: 'THY',        color: '#B7312C', flight: 'TK\u00a0' + (1800 + seed) };
  }

  return (
    <div className="screen-enter" style={{
      minHeight: '100%',
      background: '#F0E4CD',
      backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 28px, rgba(50,30,10,0.04) 28px 29px)',
      fontFamily: "'EB Garamond', Georgia, serif", color: '#1F1A14',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: `${topPad}px 18px 8px`, borderBottom: '3px double #1F1A14' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => nav('turkiyeTuru')} style={{
            background: 'transparent', border: '1px solid #1F1A14', borderRadius: 0,
            padding: '6px 10px', fontFamily: 'inherit', fontSize: 12, cursor: 'pointer', color: '#1F1A14',
          }}>← {u.lang==='tr'?'Tur':'Tour'}</button>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 3 }}>FORM N° 17</div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 12, letterSpacing: 3 }}>
            ✦ TÜRK HAVA YOLLARI · GRAND TOUR ✦
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900,
            margin: '4px 0 0', letterSpacing: -0.5, lineHeight: 1, fontStyle: 'italic',
          }}>Tarifeli Rota · 14 Gün</h1>
          <div style={{
            marginTop: 6, fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#525252', letterSpacing: 1.5,
          }}>02 JUN 2026 — 16 JUN 2026</div>
        </div>
      </div>

      {/* timetable */}
      <div style={{ padding: '14px 18px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '54px 50px 1fr 36px',
          gap: 8, paddingBottom: 6, borderBottom: '1px solid #1F1A14',
          fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1.5, color: '#525252',
        }}>
          <span>DATE</span><span>DEP</span><span>STATION</span><span style={{ textAlign: 'right' }}>N</span>
        </div>
        {stops.map((s, i) => (
          <React.Fragment key={s.code}>
            <div style={{
              display: 'grid', gridTemplateColumns: '54px 50px 1fr 36px',
              gap: 8, padding: '10px 0', borderBottom: i < stops.length-1 ? '1px dashed #1F1A1455' : 'none',
              alignItems: 'flex-start',
            }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500 }}>{s.d}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#525252' }}>{s.time}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block',
                  }} />
                  <span style={{
                    fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, lineHeight: 1,
                  }}>{s.city}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#525252', letterSpacing: 1 }}>{s.code}</span>
                </div>
                <div style={{ fontSize: 12, fontStyle: 'italic', color: '#525252', marginLeft: 16, marginTop: 2 }}>
                  {s.notes}
                </div>
              </div>
              <span style={{
                textAlign: 'right', fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 20, color: s.color,
              }}>{s.nights}</span>
            </div>
            {/* Duraklar arası uçuş bağlantısı */}
            {i < stops.length - 1 && (() => {
              const al = airlineFor(s.code, stops[i+1].code, i);
              return (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 0 6px 16px', margin: '0 0 0 4px',
                  borderLeft: '2px dashed ' + al.color + '55',
                }}>
                  <span style={{
                    padding: '2px 6px', borderRadius: 2,
                    background: al.color + '14', border: '1px solid ' + al.color + '44',
                    fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 800,
                    color: al.color, letterSpacing: 1.4,
                  }}>{al.flight}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#525252', letterSpacing: 1 }}>
                    {al.name}
                  </span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill={al.color} style={{ marginLeft: 2 }}>
                    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1L15 22v-1.5L13 19v-5.5z"/>
                  </svg>
                </div>
              );
            })()}
          </React.Fragment>
        ))}
      </div>

      {/* footer summary */}
      <div style={{
        margin: '6px 18px 18px',
        padding: '14px 16px', background: '#1F1A14', color: '#F0E4CD',
        position: 'relative', boxShadow: '5px 5px 0 #B7312C',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          <PostMini label="STOPS" value="6" />
          <PostMini label="NIGHTS" value="14" />
          <PostMini label="FLIGHTS" value="5" />
          <PostMini label="MILES" value="4.820" />
        </div>
        <div style={{
          marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
        }}>
          <div>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 10, fontStyle: 'italic', color: '#C5A059' }}>TOTAL</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, letterSpacing: 1 }}>32.400 <span style={{ fontSize: 14 }}>TL</span></div>
          </div>
          <button onClick={() => {
            try {
              const rec = {
                id: 'TRIP-' + stops.map(s=>s.code[0]).join('') + Date.now().toString(36).slice(-3).toUpperCase(),
                name: u.lang==='tr'?'Türkiye Grand Turu':'Türkiye Grand Tour',
                legs: stops.map(s=>s.code).slice(0,4),
                dates: stops[0].d + ' – ' + stops[stops.length-1].d,
                pax: u.lang==='tr'?'1 yetişkin':'1 adult',
                miles: '+4.820', price: '32\u00a0400,00',
                status: { label: u.lang==='tr'?'PLANLANIYOR':'PLANNED', tone: 'navy' },
                cabin: 'EcoFly',
                eta: u.lang==='tr'?'Rota hazır':'Route ready',
              };
              const list = JSON.parse(localStorage.getItem('thy-route-selections-v1')||'[]');
              if (!list.some(r=>r.id===rec.id)) { list.unshift(rec); }
              localStorage.setItem('thy-route-selections-v1', JSON.stringify(list));
            } catch(_) {}
            toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Rota kaydedildi':'Route saved' });
            setTimeout(() => nav('map'), 600);
          }} style={{
            background: '#F0E4CD', color: '#1F1A14', border: '1px solid #F0E4CD',
            padding: '12px 18px', borderRadius: 0,
            fontFamily: "'Playfair Display', serif", fontWeight: 700, fontStyle: 'italic',
            fontSize: 14, cursor: 'pointer',
          }}>{u.lang==='tr'?'Rotasını rezerve et':'Reserve route'} →</button>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// 18 ▸ CHECK-IN — Japanese minimalist (single red dot, NFC tap)
// =================================================================
function CheckInScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const toast = useToast();
  const [stage, setStage] = React.useState('intro'); // intro | scan | done

  return (
    <div className="screen-enter" style={{
      minHeight: '100%', background: '#FAFAFA',
      fontFamily: "'Space Grotesk', system-ui, sans-serif", color: '#0A0A0A',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: `${topPad}px 22px 0`, display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => nav('boarding')} style={{
          background: 'transparent', border: 'none', padding: 0,
          fontFamily: 'inherit', fontSize: 13, color: '#0A0A0A', cursor: 'pointer',
        }}>← {u.lang==='tr'?'Kart':'Pass'}</button>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: '#737373',
        }}>18 ／ 21</span>
      </div>

      {/* vertical kana-like label */}
      <div style={{
        position: 'absolute', left: 18, top: '20%',
        writingMode: 'vertical-rl', textOrientation: 'mixed',
        fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
        fontSize: 11, letterSpacing: 4, color: '#A3A3A3',
      }}>
        ONLINE · CHECK · IN · TK 1853
      </div>

      {/* center stage */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '20px 32px',
        position: 'relative',
      }}>
        <div style={{
          fontSize: 11, letterSpacing: 5, color: '#737373', textTransform: 'uppercase',
        }}>{stage === 'done' ? (u.lang==='tr'?'tamam':'done') : (u.lang==='tr'?'hazır mısınız':'ready')}</div>

        {/* sun disc — single red dot */}
        <div style={{
          position: 'relative', width: 200, height: 200, marginTop: 22,
        }}>
          {/* concentric rings */}
          {stage === 'scan' && [0, 1, 2].map(i => (
            <span key={i} style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '1px solid #B7312C',
              animation: `nfcRing 2.2s ${i*0.7}s ease-out infinite`,
            }} />
          ))}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: stage === 'done'
              ? 'linear-gradient(135deg, #C5A059, #E8C97A)'
              : '#B7312C',
            boxShadow: stage === 'scan'
              ? '0 0 60px rgba(183,49,44,0.5), inset 0 0 30px rgba(0,0,0,0.15)'
              : '0 30px 60px rgba(183,49,44,0.25), inset 0 0 30px rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FAFAFA', fontSize: 60,
            transition: 'all .35s ease',
          }}>
            {stage === 'intro' && <Icon name="qr"    size={60} strokeWidth={1.5} color="#FAFAFA" />}
            {stage === 'scan'  && <Icon name="wifi"  size={60} strokeWidth={1.5} color="#FAFAFA" />}
            {stage === 'done'  && <Icon name="check" size={60} strokeWidth={2}   color="#FAFAFA" />}
          </div>
        </div>

        <h1 style={{
          marginTop: 30, textAlign: 'center',
          fontFamily: "'Playfair Display', serif", fontWeight: 500,
          fontSize: 30, letterSpacing: -0.5, lineHeight: 1.15, color: '#0A0A0A',
        }}>
          {stage === 'intro' && (u.lang==='tr'?'Biniş kartınızın QR kodunu okutun.':'Scan your boarding pass QR code.')}
          {stage === 'scan'  && (u.lang==='tr'?'Okunuyor…':'Reading…')}
          {stage === 'done'  && (u.lang==='tr'?'Hoş geldiniz, Aylin.':'Welcome aboard, Aylin.')}
        </h1>
        <p style={{
          marginTop: 10, textAlign: 'center',
          fontSize: 12, color: '#737373', maxWidth: 280, fontStyle: 'italic',
        }}>
          {stage === 'intro' && (u.lang==='tr'?'Kameranızı biniş kartınızdaki QR koduna doğrultun. Bilgileriniz cihazınızdan çıkmaz.':'Point your camera at the QR code on your boarding pass. No data leaves your device.')}
          {stage === 'scan'  && (u.lang==='tr'?'Lütfen sabit tutun. Bu işlem ~3 saniye sürer.':'Please hold steady. This takes about 3 seconds.')}
          {stage === 'done'  && (u.lang==='tr'?'14F sizin · biniş 13:55 · kapı A12':'Seat 14F · boarding 13:55 · gate A12')}
        </p>
      </div>

      {/* action */}
      <div style={{ padding: '0 28px 32px' }}>
        {stage === 'intro' && (
          <button onClick={() => { setStage('scan'); setTimeout(() => setStage('done'), 2400); }} style={{
            width: '100%', padding: '16px 18px',
            background: '#0A0A0A', color: '#FAFAFA', border: 'none', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 14, fontWeight: 500, letterSpacing: 1,
            cursor: 'pointer', textTransform: 'uppercase',
          }}>{u.lang==='tr'?'QR\'ı Tara':'Scan QR Code'}</button>
        )}
        {stage === 'scan' && (
          <div style={{ textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#737373' }}>
            ◴ {u.lang==='tr'?'işleniyor':'processing'}…
          </div>
        )}
        {stage === 'done' && (
          <button onClick={() => {
            toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Check-in tamam':'Check-in complete' });
            setTimeout(() => nav('boarding'), 500);
          }} style={{
            width: '100%', padding: '16px 18px',
            background: '#B7312C', color: '#FAFAFA', border: 'none', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 14, fontWeight: 500, letterSpacing: 1,
            cursor: 'pointer', textTransform: 'uppercase',
          }}>{u.lang==='tr'?'Biniş kartını aç':'Open boarding pass'} →</button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  PriceAlertScreen, AirportPickerScreen, TurkiyeTuruScreen, TurkiyeRouteScreen, CheckInScreen,
});

// Add a few extra icons used here
(function extendIcons() {
  // wifi icon — added via shadowing not strictly needed; using paths inline above where used.
})();
