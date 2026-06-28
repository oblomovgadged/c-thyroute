// web-screens-d.jsx — PriceAlert, AirportPicker, TurkiyeTuru, TurkiyeRoute, CheckIn

// 16 ─── PRICE ALERT — Bloomberg terminal, full-width ──────────
// ─── Elegant gold slider — drag the thumb to set target ─────────
function WebElegantSlider({ min, max, step = 100, value, onChange }) {
  const railRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const updateFromX = (clientX) => {
    const rail = railRef.current; if (!rail) return;
    const rect = rail.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    const snapped = Math.round(raw / step) * step;
    onChange(Math.max(min, Math.min(max, snapped)));
  };
  React.useEffect(() => {
    if (!dragging) return;
    const move = (e) => updateFromX(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [dragging]);
  return (
    <div ref={railRef}
      onPointerDown={(e) => { setDragging(true); updateFromX(e.clientX); }}
      style={{ position: 'relative', height: 52, cursor: 'pointer', userSelect: 'none',
        padding: '22px 0', touchAction: 'none' }}>
      {/* Rail bg */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 22, height: 8, borderRadius: 999,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(197,160,89,0.18)',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }} />
      {/* Filled */}
      <div style={{ position: 'absolute', left: 0, top: 22, height: 8, width: `${pct}%`, borderRadius: 999,
        background: 'linear-gradient(90deg, #B7312C 0%, #C5A059 55%, #E5C97A 100%)',
        boxShadow: '0 0 16px rgba(197,160,89,0.45)' }} />
      {/* Tick marks */}
      {[0, 25, 50, 75, 100].map(p => (
        <div key={p} style={{
          position: 'absolute', left: `calc(${p}% - 0.5px)`, top: 18, width: 1, height: 16,
          background: p <= pct ? 'rgba(229,201,122,0.55)' : 'rgba(255,255,255,0.10)',
        }} />
      ))}
      {/* Thumb */}
      <div style={{
        position: 'absolute', left: `calc(${pct}% - 14px)`, top: 12,
        width: 28, height: 28, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #FFF1C4 0%, #E5C97A 40%, #C5A059 70%, #9C7B36 100%)',
        border: '2px solid #1A1206',
        boxShadow: '0 4px 14px rgba(0,0,0,0.55), 0 0 24px rgba(197,160,89,0.55)',
        cursor: dragging ? 'grabbing' : 'grab',
        transition: dragging ? 'none' : 'transform 160ms cubic-bezier(.16,1,.3,1)',
        transform: dragging ? 'scale(1.15)' : 'scale(1)',
      }} />
    </div>
  );
}

// Format & breakdown helpers
function fmtTL(n) { return Math.round(n).toLocaleString('tr-TR'); }
function priceBreakdown(route) {
  // "12 840,00" → 12840
  const total = parseInt(String(route.price).replace(/[^\d]/g, ''), 10) / 100;
  const isBiz = /business|prime/i.test(route.cabin || '');
  const flightRatio = isBiz ? 0.73 : 0.62;
  const hotelRatio  = isBiz ? 0.22 : 0.31;
  const vipRatio    = 1 - flightRatio - hotelRatio;
  return {
    total,
    flight: Math.round(total * flightRatio),
    hotel:  Math.round(total * hotelRatio),
    vip:    Math.round(total * vipRatio),
  };
}

function WebActiveAlarmsList({ lang, nav }) {
  const [alarms, setAlarms] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('thy-route-alarms-v1') || '[]'); }
    catch (_) { return []; }
  });
  const removeAlarm = (idx) => {
    const next = alarms.filter((_, i) => i !== idx);
    setAlarms(next);
    try { localStorage.setItem('thy-route-alarms-v1', JSON.stringify(next)); } catch (_) {}
  };
  if (!alarms.length) return null;
  return (
    <div style={{
      background: 'linear-gradient(160deg, rgba(34,197,94,0.06) 0%, rgba(10,22,40,0.3) 60%)',
      border: '1px solid rgba(34,197,94,0.28)',
      borderRadius: 4, padding: '16px 22px', marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
        <span style={{ fontSize: 11, color: '#22C55E', letterSpacing: 1.8, fontWeight: 800 }}>
          {lang === 'tr' ? `KURULU ALARMLAR · ${alarms.length}` : `ACTIVE ALERTS · ${alarms.length}`}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#5B8773', letterSpacing: 1.4 }}>
          {lang === 'tr' ? 'FİYAT HEDEFİNİ TUTUNCA BİLDİRİLİR' : 'NOTIFIED WHEN TARGET HITS'}
        </span>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {alarms.map((a, i) => {
          const setAt = new Date(a.setAt);
          const dateStr = `${setAt.getDate().toString().padStart(2,'0')}.${(setAt.getMonth()+1).toString().padStart(2,'0')}.${setAt.getFullYear()}`;
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr auto', gap: 16, alignItems: 'center',
              padding: '12px 16px', borderRadius: 3,
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(34,197,94,0.18)',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 13, color: '#E5F3EA', fontWeight: 600 }}>
                  {(a.legs || []).join(' → ')}
                </span>
                <span style={{ fontSize: 10.5, color: '#5B8773', letterSpacing: 0.6 }}>
                  {a.routeName} · {dateStr}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 9.5, color: '#5B8773', letterSpacing: 1.4, fontWeight: 800 }}>
                  {lang === 'tr' ? 'GÜNCEL' : 'CURRENT'}
                </span>
                <span style={{ fontSize: 14, color: '#E5F3EA' }}>
                  {Math.round(a.currentTL).toLocaleString('tr-TR')} <span style={{ fontSize: 10, color: '#5B8773' }}>TL</span>
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 9.5, color: '#C5A059', letterSpacing: 1.4, fontWeight: 800 }}>
                  ✦ {lang === 'tr' ? 'HEDEF' : 'TARGET'}
                </span>
                <span style={{ fontSize: 14, color: '#E5C97A', fontWeight: 700 }}>
                  {Math.round(a.targetTL).toLocaleString('tr-TR')} <span style={{ fontSize: 10, color: '#C5A059' }}>TL</span>
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 9.5, color: '#5B8773', letterSpacing: 1.4, fontWeight: 800 }}>
                  {lang === 'tr' ? 'TASARRUF' : 'SAVINGS'}
                </span>
                <span style={{ fontSize: 14, color: '#22C55E', fontWeight: 700 }}>
                  −{Math.round(a.savingsTL || 0).toLocaleString('tr-TR')} <span style={{ fontSize: 10, color: '#5B8773' }}>TL</span>
                </span>
              </div>
              <button onClick={() => removeAlarm(i)} title={lang === 'tr' ? 'Alarmı kaldır' : 'Remove alert'} style={{
                width: 32, height: 32, borderRadius: 3, cursor: 'pointer',
                background: 'transparent', border: '1px solid rgba(239,111,102,0.32)',
                color: '#EF6F66', fontSize: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>×</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WebPriceAlertScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: true });
  const toast = useToast();

  // Route mode — saved-route alarm; null = default ticker (IST·FCO)
  const routeData = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('thy-route-alarm-target-v1');
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }, []);
  const routeMode = !!routeData;
  const breakdown = routeMode ? priceBreakdown(routeData) : null;
  const totalTL = breakdown ? breakdown.total : 5640;

  // Slider range adapts to total
  const sliderMin = routeMode ? Math.round(totalTL * 0.70 / 500) * 500 : 3900;
  const sliderMax = routeMode ? Math.round(totalTL * 1.05 / 500) * 500 : 6800;
  const sliderStep = routeMode ? (totalTL > 50000 ? 500 : totalTL > 10000 ? 100 : 50) : 50;
  const initialTarget = routeMode
    ? Math.round((totalTL * 0.88) / sliderStep) * sliderStep
    : 4500;
  const [target, setTarget] = React.useState(initialTarget);

  const data = React.useMemo(() => {
    if (!routeMode) {
      const out = []; let v = 5640;
      for (let i = 0; i < 30; i++) {
        v += (Math.sin(i * 0.6) * 120) + ((i % 5 === 0) ? -180 : 60);
        out.push(Math.max(3900, Math.min(6800, Math.round(v))));
      }
      return out;
    }
    const out = []; const base = totalTL;
    for (let i = 0; i < 30; i++) {
      const noise = Math.sin(i * 0.6) * (base * 0.06)
                  + Math.cos(i * 0.31) * (base * 0.035)
                  + ((i % 5 === 0) ? -base * 0.03 : base * 0.012);
      out.push(Math.round(Math.max(base * 0.78, Math.min(base * 1.12, base + noise))));
    }
    // Force the last point to be the actual total so "current" matches breakdown
    out[out.length - 1] = base;
    return out;
  }, [routeMode, totalTL]);

  const cMin = Math.min(...data), cMax = Math.max(...data);
  const cur = data[data.length - 1];
  const delta = cur - data[0];
  const W = 1200, H = 280;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - cMin) / (cMax - cMin || 1)) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const targetClamped = Math.max(cMin, Math.min(cMax, target));
  const targetY = H - ((targetClamped - cMin) / (cMax - cMin || 1)) * H;

  const legsLabel = routeMode ? (routeData.legs || []).join('·') : 'IST·FCO';
  const subLabel  = routeMode
    ? `${routeData.dates || ''} · ${routeData.cabin || ''} · ${routeData.pax || ''}`
    : (u.lang === 'tr' ? '30G · ORTA · Ekonomi' : '30D · MID · Economy');
  const savingsAbs = Math.max(0, cur - target);
  const savingsPct = cur > 0 ? ((1 - target / cur) * 100) : 0;

  return (
    <PageShell dark style={{ background: '#08120D', fontFamily: "'DM Mono', monospace", color: '#E5F3EA' }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} dark />
      {/* Terminal header */}
      <div style={{ padding: '20px 32px', background: '#0B1A14', borderBottom: '1px solid #1A3326',
        display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => nav(routeMode ? 'routes' : 'search')} style={{
          background: '#1A3326', border: '1px solid #2A4D3A', color: '#E5F3EA',
          padding: '7px 12px', borderRadius: 2, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12,
        }}>← {routeMode ? (u.lang === 'tr' ? 'ROTALARIM' : 'ROUTES') : 'BACK'}</button>
        <span style={{ fontSize: 11, color: '#5B8773', letterSpacing: 1.5 }}>
          TERM·16 / {routeMode ? `ROUTE ALERT · ${routeData.id}` : 'PRICE ALERT'}
        </span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
          <span style={{ fontSize: 11, color: '#22C55E' }}>LIVE · UTC 14:32:08</span>
        </span>
      </div>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 32px' }}>
        {/* Kurulu alarmlar listesi */}
        <WebActiveAlarmsList lang={u.lang} nav={nav} />
        {/* Route breakdown panel (route mode only) */}
        {routeMode && (
          <div style={{
            background: 'linear-gradient(160deg, rgba(197,160,89,0.08) 0%, rgba(10,22,40,0.4) 60%)',
            border: '1px solid rgba(197,160,89,0.32)',
            borderRadius: 4, padding: '18px 22px', marginBottom: 20,
            display: 'grid', gridTemplateColumns: '1.4fr auto auto auto auto', gap: 24, alignItems: 'center',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 10, letterSpacing: 1.8, color: '#C5A059', fontWeight: 800 }}>
                ✦ {u.lang === 'tr' ? 'KAYITLI ROTA · TOPLAM' : 'SAVED ROUTE · TOTAL'}
              </span>
              <span style={{
                fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700,
                color: '#F4EBD9', letterSpacing: -0.3,
              }}>{routeData.name}</span>
              <span style={{ fontSize: 11, color: '#5B8773' }}>{legsLabel} · {subLabel}</span>
            </div>
            {[
              { l: u.lang === 'tr' ? 'UÇUŞ' : 'FLIGHT',   v: breakdown.flight, icon: '✈' },
              { l: u.lang === 'tr' ? 'OTEL'  : 'HOTEL',    v: breakdown.hotel,  icon: '🏨' },
              { l: u.lang === 'tr' ? 'VIP TRANSFER' : 'VIP TRANSFER', v: breakdown.vip, icon: '🚘' },
            ].filter(x => x.v > 0).map(item => (
              <div key={item.l} style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right' }}>
                <span style={{ fontSize: 9.5, letterSpacing: 1.6, color: '#5B8773', fontWeight: 800 }}>
                  {item.icon} {item.l}
                </span>
                <span style={{ fontSize: 17, color: '#E5F3EA', fontWeight: 600 }}>
                  {fmtTL(item.v)} <span style={{ fontSize: 11, color: '#5B8773' }}>TL</span>
                </span>
              </div>
            ))}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right',
              paddingLeft: 18, borderLeft: '1px solid rgba(197,160,89,0.32)',
            }}>
              <span style={{ fontSize: 9.5, letterSpacing: 1.6, color: '#C5A059', fontWeight: 800 }}>
                = TOPLAM
              </span>
              <span style={{
                fontSize: 24, color: '#E5C97A', fontWeight: 700, letterSpacing: -0.5,
              }}>
                {fmtTL(breakdown.total)} <span style={{ fontSize: 12, color: '#C5A059' }}>TL</span>
              </span>
            </div>
          </div>
        )}

        {/* Ticker */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <span style={{ fontSize: 16, color: '#5B8773' }}>{legsLabel}</span>
            <span style={{ fontSize: 12, color: '#5B8773', marginLeft: 16 }}>{subLabel}</span>
          </div>
          <span style={{ fontSize: 11, color: '#5B8773' }}>
            {u.lang === 'tr' ? 'SON 30G FİYAT HAREKETİ' : 'LAST 30D PRICE MOVEMENT'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 64, fontWeight: 500, letterSpacing: -2, color: '#fff' }}>
            {cur.toLocaleString('tr-TR')}
          </span>
          <span style={{ fontSize: 18, color: '#5B8773' }}>TL</span>
          <span style={{
            marginLeft: 18, padding: '6px 12px',
            background: delta >= 0 ? 'rgba(239,46,31,0.15)' : 'rgba(34,197,94,0.15)',
            color:      delta >= 0 ? '#EF6F66' : '#22C55E',
            borderRadius: 2, fontSize: 14, fontWeight: 600,
          }}>{delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toLocaleString('tr-TR')} ({(delta/(data[0]||1)*100).toFixed(2)}%)</span>
        </div>

        {/* Chart */}
        <div style={{ position: 'relative' }}>
          <svg viewBox={`0 0 ${W} ${H + 18}`} width="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
            {[0,1,2,3,4].map(i => (
              <line key={i} x1="0" x2={W} y1={(i/4)*H} y2={(i/4)*H}
                stroke="#1A3326" strokeWidth="0.5" strokeDasharray="2 3" />
            ))}
            <polygon points={`0,${H} ${points} ${W},${H}`} fill="url(#grad-w)" />
            <defs>
              <linearGradient id="grad-w" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" x2={W} y1={targetY} y2={targetY} stroke="#C5A059" strokeWidth="1.5" strokeDasharray="6 4" />
            <rect x={W - 110} y={targetY - 14} width="110" height="22" fill="#C5A059" />
            <text x={W - 55} y={targetY + 1} fill="#0A1628" fontSize="13" textAnchor="middle" fontWeight="700">
              {u.lang === 'tr' ? 'HEDEF' : 'TARGET'}
            </text>
            <polyline points={points} fill="none" stroke="#22C55E" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={W} cy={H - ((cur - cMin)/(cMax - cMin || 1))*H} r="5" fill="#22C55E" />
            <circle cx={W} cy={H - ((cur - cMin)/(cMax - cMin || 1))*H} r="10" fill="#22C55E" opacity="0.25">
              <animate attributeName="r" values="5;14;5" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
          borderTop: '1px solid #1A3326', borderBottom: '1px solid #1A3326', margin: '8px 0' }}>
          <TermStat label={u.lang === 'tr' ? 'EN DÜŞÜK' : 'LOW'}   value={cMin.toLocaleString('tr-TR')} />
          <TermStat label={u.lang === 'tr' ? 'EN YÜKSEK' : 'HIGH'} value={cMax.toLocaleString('tr-TR')} />
          <TermStat label={u.lang === 'tr' ? 'ORTALAMA' : 'AVG'}   value={Math.round(data.reduce((a,b) => a+b, 0)/data.length).toLocaleString('tr-TR')} />
          <TermStat label={u.lang === 'tr' ? 'GÜNCEL' : 'CUR'}      value={cur.toLocaleString('tr-TR')} />
          <TermStat label={u.lang === 'tr' ? 'TASARRUF' : 'SAVE'}   value={savingsAbs > 0 ? '-' + fmtTL(savingsAbs) : '—'} />
          <TermStat label={u.lang === 'tr' ? 'HEDEF' : 'TGT'}       value={target.toLocaleString('tr-TR')} last />
        </div>

        {/* Target slider + freq */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 32, marginTop: 22 }}>
          <div style={{
            background: 'rgba(197,160,89,0.04)',
            border: '1px solid rgba(197,160,89,0.20)',
            borderRadius: 4, padding: '18px 22px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#C5A059', letterSpacing: 1.5, fontWeight: 800 }}>
              <span>✦ {u.lang === 'tr' ? 'HEDEF FİYATI ÇUBUKLA AYARLA' : 'DRAG THE BAR TO SET TARGET'}</span>
              <span style={{ color: '#5B8773' }}>
                {u.lang === 'tr' ? 'ARALIK' : 'RANGE'} {fmtTL(sliderMin)} – {fmtTL(sliderMax)} TL
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10 }}>
              <span style={{
                fontSize: 56, color: '#E5C97A', fontWeight: 600, letterSpacing: -1.5,
                fontFamily: "'Playfair Display', serif",
              }}>
                {target.toLocaleString('tr-TR')}
              </span>
              <span style={{ fontSize: 16, color: '#C5A059' }}>TL</span>
              <span style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                <span style={{ fontSize: 11, color: '#5B8773', letterSpacing: 1.4 }}>
                  {u.lang === 'tr' ? 'GÜNCELDEN' : 'FROM CURRENT'}
                </span>
                <span style={{ fontSize: 18, color: savingsAbs > 0 ? '#22C55E' : '#EF6F66', fontWeight: 700 }}>
                  {savingsAbs > 0 ? '−' : '+'}{fmtTL(Math.abs(cur - target))} TL
                  <span style={{ fontSize: 12, color: '#5B8773', marginLeft: 6 }}>
                    ({savingsAbs > 0 ? '-' : '+'}{Math.abs(savingsPct).toFixed(1)}%)
                  </span>
                </span>
              </span>
            </div>
            <WebElegantSlider
              min={sliderMin} max={sliderMax} step={sliderStep}
              value={target} onChange={setTarget}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: '#5B8773', letterSpacing: 1.2 }}>
              <span>{fmtTL(sliderMin)} TL</span>
              <span>{fmtTL(sliderMax)} TL</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#5B8773', marginBottom: 8, letterSpacing: 1.5 }}>
              {u.lang === 'tr' ? 'BİLDİRİM SIKLIĞI' : 'ALERT FREQUENCY'}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { id: 'inst', l: u.lang==='tr'?'Anında':'Instant',  on: true },
                { id: 'day',  l: u.lang==='tr'?'Günde':'Daily' },
                { id: 'wk',   l: u.lang==='tr'?'Haftada':'Weekly' },
              ].map(o => (
                <button key={o.id} style={{
                  flex: 1, padding: '12px 6px', borderRadius: 2,
                  background: o.on ? '#1A3326' : 'transparent',
                  color: o.on ? '#22C55E' : '#5B8773',
                  border: '1px solid ' + (o.on ? '#22C55E' : '#1A3326'),
                  fontFamily: 'inherit', fontSize: 12, cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: 1.5,
                }}>{o.l}</button>
              ))}
            </div>
            <button onClick={() => {
              try {
                const list = JSON.parse(localStorage.getItem('thy-route-alarms-v1') || '[]');
                const entry = {
                  routeId: routeData?.id || null,
                  routeName: routeData?.name || (u.lang === 'tr' ? 'IST → FCO' : 'IST → FCO'),
                  legs: routeData?.legs || ['IST','FCO'],
                  currentTL: cur, targetTL: target,
                  savingsTL: Math.max(0, cur - target),
                  setAt: new Date().toISOString(),
                };
                list.unshift(entry);
                localStorage.setItem('thy-route-alarms-v1', JSON.stringify(list.slice(0, 50)));
                localStorage.removeItem('thy-route-alarm-target-v1');
              } catch (_) {}
              toast({ type: 'success', icon: '🔔', children: u.lang==='tr'
                ? `Alarm kuruldu · ${target.toLocaleString('tr-TR')} TL · tasarruf ${fmtTL(savingsAbs)} TL`
                : `Alert set · ${target.toLocaleString('tr-TR')} TL · save ${fmtTL(savingsAbs)} TL` });
              setTimeout(() => nav(routeMode ? 'routes' : 'notifications'), 700);
            }} style={{
              width: '100%', marginTop: 12, padding: '16px',
              background: 'linear-gradient(135deg, #C5A059 0%, #E5C97A 100%)',
              color: '#1A1206', border: 'none', borderRadius: 4,
              fontFamily: 'inherit', fontWeight: 800, fontSize: 14, cursor: 'pointer', letterSpacing: 1.5,
              boxShadow: '0 8px 22px rgba(197,160,89,0.45)',
            }}>
              ✦ {u.lang === 'tr' ? 'ALARMI KUR' : 'EXECUTE · SET ALERT'} →
            </button>
            <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 4,
              background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.18)',
              fontSize: 11, color: '#5B8773', lineHeight: 1.5,
            }}>
              {u.lang === 'tr'
                ? <>Fiyat <strong style={{ color: '#22C55E' }}>{target.toLocaleString('tr-TR')} TL</strong> veya altına düşerse bildirim alacaksın. Hedef güncelden <strong style={{ color: savingsAbs > 0 ? '#22C55E' : '#EF6F66' }}>{savingsAbs > 0 ? '-' : '+'}{Math.abs(savingsPct).toFixed(1)}%</strong>.</>
                : <>You'll be notified when the price drops to <strong style={{ color: '#22C55E' }}>{target.toLocaleString('tr-TR')} TL</strong> or below. Target is <strong style={{ color: savingsAbs > 0 ? '#22C55E' : '#EF6F66' }}>{savingsAbs > 0 ? '-' : '+'}{Math.abs(savingsPct).toFixed(1)}%</strong> from current.</>}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
function TermStat({ label, value, last }) {
  return (
    <div style={{ padding: '14px 12px', textAlign: 'center', borderRight: last ? 'none' : '1px solid #1A3326' }}>
      <div style={{ fontSize: 10, color: '#5B8773', letterSpacing: 1.5 }}>{label}</div>
      <div style={{ fontSize: 16, color: '#E5F3EA', fontWeight: 500, marginTop: 4 }}>{value}</div>
    </div>
  );
}

// 17 ─── AIRPORT PICKER — iOS modal feel inside browser ────────
function WebAirportPickerScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const toast = useToast();
  const [query, setQuery] = React.useState('');

  const recent = [
    { code: 'IST', city: 'İstanbul', country: 'Türkiye',     name: 'Havalimanı',    flag: '🇹🇷' },
    { code: 'SAW', city: 'İstanbul', country: 'Türkiye',     name: 'Sabiha Gökçen', flag: '🇹🇷' },
    { code: 'AYT', city: 'Antalya',  country: 'Türkiye',     name: 'Havalimanı',    flag: '🇹🇷' },
  ];
  const popular = [
    { code: 'FCO', city: 'Roma',      country: 'İtalya',      name: 'Fiumicino',     flag: '🇮🇹' },
    { code: 'AMS', city: 'Amsterdam', country: 'Hollanda',    name: 'Schiphol',      flag: '🇳🇱' },
    { code: 'LHR', city: 'Londra',    country: 'Birleşik K.', name: 'Heathrow',      flag: '🇬🇧' },
    { code: 'JFK', city: 'New York',  country: 'ABD',         name: 'JFK',           flag: '🇺🇸' },
    { code: 'NRT', city: 'Tokyo',     country: 'Japonya',     name: 'Narita',        flag: '🇯🇵' },
    { code: 'CPT', city: 'Cape Town', country: 'G. Afrika',   name: 'International', flag: '🇿🇦' },
    { code: 'DXB', city: 'Dubai',     country: 'BAE',         name: 'International', flag: '🇦🇪' },
    { code: 'CDG', city: 'Paris',     country: 'Fransa',      name: 'Charles de G.', flag: '🇫🇷' },
  ];
  const q = query.toLowerCase();
  const filtered = popular.filter(p => !q || p.code.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.country.toLowerCase().includes(q));
  const pick = (a) => {
    toast({ type: 'success', icon: '✓', children: `${a.city} (${a.code}) ${u.lang==='tr'?'seçildi':'picked'}` });
    setTimeout(() => nav('search'), 500);
  };

  return (
    <PageShell style={{ background: '#F2F2F7' }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />
      <div style={{ position: 'relative', minHeight: 'calc(100vh - 130px)', overflow: 'hidden' }}>
        <img src={(window.__resources?.routeMap) || 'assets/AnaEkran.png'} alt="" aria-hidden
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: '20% 30%', filter: 'saturate(0.6) brightness(1.05)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(242,242,247,0.55) 0%, rgba(242,242,247,0.92) 60%, #F2F2F7 100%)' }} />

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto', padding: '40px 32px 60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <button onClick={() => nav('search')} style={{
              background: 'transparent', border: 'none', color: '#007AFF',
              fontSize: 17, fontWeight: 500, padding: 0, cursor: 'pointer', fontFamily: "-apple-system, system-ui, sans-serif",
            }}>{u.lang==='tr'?'Vazgeç':'Cancel'}</button>
            <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 17, color: '#0A1628' }}>
              {u.lang==='tr'?'Nereden':'From'}
            </div>
            <span style={{ width: 60 }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 18px', background: 'rgba(118,118,128,0.15)', borderRadius: 12,
            backdropFilter: 'blur(20px)' }}>
            <Icon name="search" size={18} color="#8E8E93" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder={u.lang==='tr'?'Şehir, havalimanı veya IATA kodu':'City, airport or IATA code'}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontFamily: "-apple-system, system-ui, sans-serif", fontSize: 16, color: '#0A1628' }} />
            {query && (
              <button onClick={() => setQuery('')} style={{
                background: 'rgba(120,120,128,0.4)', color: '#fff',
                border: 'none', width: 22, height: 22, borderRadius: '50%',
                cursor: 'pointer', fontSize: 12,
              }}>×</button>
            )}
          </div>

          {/* Near me */}
          <button onClick={() => pick({ code: 'IST', city: 'İstanbul' })} style={{
            width: '100%', marginTop: 16,
            background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(18px)',
            border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 14,
            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
            cursor: 'pointer', fontFamily: "-apple-system, system-ui, sans-serif", textAlign: 'left',
          }}>
            <span style={{ width: 38, height: 38, borderRadius: '50%', background: '#007AFF',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Icon name="location" size={18} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{u.lang==='tr'?'Bulunduğum konum':'Use my location'}</div>
              <div style={{ fontSize: 13, color: '#8E8E93' }}>IST · İstanbul Havalimanı</div>
            </div>
            <Icon name="chevR" size={16} color="#8E8E93" />
          </button>

          {!query && (
            <>
              <ListHeaderWeb>{u.lang==='tr'?'Son aramalar':'Recents'}</ListHeaderWeb>
              <GlassListWeb items={recent} onPick={pick} />
            </>
          )}
          <ListHeaderWeb style={{ marginTop: query ? 16 : 22 }}>
            {query ? `"${query}" · ${filtered.length} ${u.lang==='tr'?'sonuç':'results'}` : (u.lang==='tr'?'Popüler':'Popular')}
          </ListHeaderWeb>
          <GlassListWeb items={filtered} onPick={pick} />
        </div>
      </div>
    </PageShell>
  );
}
function ListHeaderWeb({ children, style = {} }) {
  return (
    <div style={{
      fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5,
      color: '#3C3C43', opacity: 0.6, padding: '14px 6px 8px',
      fontFamily: "-apple-system, system-ui, sans-serif", ...style,
    }}>{children}</div>
  );
}
function GlassListWeb({ items, onPick }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(18px)',
      border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 14, overflow: 'hidden',
    }}>
      {items.map((a, i) => (
        <button key={a.code} onClick={() => onPick(a)} style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 18px', width: '100%', textAlign: 'left',
          background: 'transparent', border: 'none', cursor: 'pointer',
          borderBottom: i < items.length - 1 ? '0.5px solid rgba(60,60,67,0.12)' : 'none',
          fontFamily: "-apple-system, system-ui, sans-serif",
        }}>
          <span style={{ fontSize: 28 }}>{a.flag}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{a.city}</div>
            <div style={{ fontSize: 13, color: '#8E8E93' }}>{a.name} · {a.country}</div>
          </div>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600,
            color: '#3C3C43', background: 'rgba(120,120,128,0.16)',
            padding: '4px 10px', borderRadius: 4,
          }}>{a.code}</span>
        </button>
      ))}
    </div>
  );
}

// 18 ─── TÜRKİYE TURU — NatGeo cover, full-bleed ───────────────
function WebTurkiyeTuruScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: true });
  const goToTour = (tour) => { thyBuildSelection(tour); nav('turkiyeRoute'); };
  return (
    <PageShell dark style={{ background: '#0E0E0E', color: '#F4EBD9', fontFamily: "'EB Garamond', Georgia, serif" }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} dark />

      {/* Hero cover */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 720 }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 50% at 50% 30%, #E5712C 0%, #B7372A 35%, #6F1E1A 65%, #1F0907 100%)` }}>
          <img src={(window.__resources?.routeMap) || 'assets/AnaEkran.png'} alt="" aria-hidden
            style={{ width: '100%', height: '100%', objectFit: 'cover',
              mixBlendMode: 'overlay', opacity: 0.4, filter: 'sepia(0.6) saturate(1.2)' }} />
          <div style={{ position: 'absolute', inset: 0,
            background: 'repeating-radial-gradient(circle at 30% 40%, rgba(0,0,0,0.05) 0 1.5px, transparent 1.5px 4px)',
            mixBlendMode: 'multiply' }} />
        </div>

        {/* yellow frame */}
        <div style={{ position: 'absolute', top: 20, left: 32, right: 32, bottom: 20,
          border: '6px solid #F4C24C', pointerEvents: 'none' }} />

        {/* big block bottom-anchored */}
        <div style={{
          position: 'absolute', bottom: 50, left: 70, right: 70,
          display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 50, alignItems: 'flex-end',
        }}>
          <div>
            <div style={{ fontStyle: 'italic', fontSize: 16, letterSpacing: 4, color: '#F4C24C' }}>
              THY ROUTE EXPEDITION · VOL. XXIV
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900,
              fontSize: 168, lineHeight: 0.85, letterSpacing: -6,
              margin: '14px 0 0', color: '#F4EBD9',
              textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
              {u.lang==='tr'?'Türkiye':'Türkiye'}
              <br/>
              <span style={{ fontStyle: 'italic', fontWeight: 500, fontSize: 116, color: '#F4C24C' }}>
                {u.lang==='tr'?'baştan sona.':'end to end.'}
              </span>
            </h1>
            <div style={{ marginTop: 18, fontSize: 18, lineHeight: 1.5, color: '#F4EBD9CC', maxWidth: 540 }}>
              {u.lang==='tr'
                ? 'Yedi şehir, dört hafta. İstanbul\'dan Karadeniz\'e, oradan Kapadokya\'nın balonlarına ve Akdeniz\'in masmavi koylarına.'
                : 'Seven cities, four weeks. From Istanbul to the Black Sea, through Cappadocia\'s balloon dawns to the turquoise coves of the Mediterranean.'}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 96, color: '#F4C24C', letterSpacing: 1, lineHeight: 0.9,
              }}>8</span>
              <span style={{
                fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                fontSize: 28, color: '#F4EBD9', lineHeight: 1,
              }}>journeys —</span>
            </div>
            <div style={{
              fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
              fontSize: 16, color: '#F4EBD9CC', lineHeight: 1.4, maxWidth: 320,
            }}>{u.lang==='tr'
              ? 'Likya kıyısından Göbekli Tepe\'ye, Nemrut\'un tanrı heykellerinden Karadeniz yaylalarına. Aşağıda hepsi.'
              : 'From the Lycian coast to Göbekli Tepe, from Mount Nemrut\'s god-statues to the Black Sea highlands. All eight, below.'}</div>
            <button onClick={() => goToTour(WEB_TR_TOURS[0])} style={{
              background: '#F4C24C', border: 'none', borderRadius: 0,
              padding: '18px 26px', fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 22, letterSpacing: 3, color: '#0E0E0E', cursor: 'pointer',
              boxShadow: '6px 6px 0 #B7312C', marginTop: 8,
            }}>{u.lang==='tr'?'TURU PLANLA →':'PLAN TOUR →'}</button>
          </div>
        </div>
      </div>

      {/* EIGHT JOURNEYS — 4×2 grid section on cream paper */}
      <div style={{
        background: '#F4EBD9', color: '#0E0E0E', padding: '70px 50px 50px',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 28px, rgba(50,30,10,0.025) 28px 29px)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            paddingBottom: 20, borderBottom: '3px double #1F1A14', marginBottom: 32,
          }}>
            <div>
              <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 13, letterSpacing: 4 }}>
                ✦ EIGHT JOURNEYS ✦
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic',
                fontSize: 64, lineHeight: 1, letterSpacing: -1.5, margin: '8px 0 0', color: '#1F1A14',
              }}>{u.lang==='tr'?'Sekiz rota, bir ülke.':'Eight routes, one country.'}</h2>
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#525252',
              letterSpacing: 1.5, textAlign: 'right',
            }}>VOLUMES I — VIII<br/>{u.lang==='tr'?'KATALOG · 2026':'CATALOGUE · 2026'}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {WEB_TR_TOURS.map(tr => (
              <TourCardWeb key={tr.id} tour={tr} lang={u.lang} onClick={() => goToTour(tr)} />
            ))}
          </div>

          <div style={{
            marginTop: 26, padding: '14px 18px', background: '#1F1A14', color: '#F4EBD9',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 14,
          }}>
            <span>★ {u.lang==='tr'?'Tüm rotalar Miles&Smiles ile mil kazandırır':'All routes earn Miles&Smiles miles'} ★</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontStyle: 'normal', fontSize: 11, letterSpacing: 2, color: '#F4C24C' }}>VAT INCL · TL</span>
          </div>
        </div>
      </div>

      {/* Below the cover — editorial 3-column lede */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 50px', background: '#F4EBD9', color: '#0E0E0E' }}>
        <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 14, letterSpacing: 3, textAlign: 'center' }}>
          ✦ THE FOREWORD ✦
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic',
          fontSize: 56, lineHeight: 1, letterSpacing: -1.5, textAlign: 'center', margin: '14px 0 32px' }}>
          {u.lang==='tr'?'Yedi durak, sonsuz hikâye.':'Seven stops, endless stories.'}
        </h2>
        <div style={{ columnCount: 3, columnGap: 36, fontSize: 16, lineHeight: 1.7,
          fontFamily: "'EB Garamond', serif", color: '#1F1A14' }}>
          <p style={{ marginTop: 0 }}>
            <span style={{ float: 'left', fontFamily: "'Playfair Display', serif", fontSize: 84,
              lineHeight: 0.85, color: '#B7312C', paddingRight: 8, fontWeight: 700 }}>İ</span>
            stanbul'un Bizans surlarından başlayan bir hat var ki, Kapadokya'nın peri bacalarından
            geçip Antalya'nın güneşine ulaşır. Türk Hava Yolları'nın "Türkiye Turu" işte bu hattı
            tek bir bilet altında topluyor.
          </p>
          <p>
            Dört haftada altı havaalanı, bir iç hat boarding pass'ı, ve Miles&amp;Smiles partneri 21
            otelin tüm kapıları. Geleneksel kahvaltıdan Akdeniz'in mezelerine, Karadeniz'in
            yaylalarından Pamukkale'nin travertenlerine.
          </p>
          <p>
            Her sabah uyandığınızda yeni bir şehrin sokakları — ama aynı sadakat puanları, aynı kabin
            sınıfı, aynı concierge. THY Route'un Yardımcı Pilot özelliği, sevdiklerinizle rotanızı
            canlı senkronize tutar. Bir tur değil, bir hatıra defteri.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
// 8 Türkiye tours — same data shape as mobile, optimized for desktop card
// Each tour now carries its `stops` so the Tur Rotası page can render dynamically.
const WEB_TR_TOURS = [
  { id: 'grand',      vol: 'I',    color: '#B7312C', glyph: '✦', route: 'IST·NAV·AYT·ADB', destCode: 'IST',
    title: { tr: 'Klasik Grand Tour',     en: 'The Grand Tour' },
    blurb: { tr: 'Yedi şehir, dört hafta — İstanbul\'dan Akdeniz\'e tek bir biletle.',
             en: 'Seven cities, four weeks — Istanbul to the Mediterranean, one ticket.' },
    days:  { tr: '14 gün', en: '14 days' }, baseDays: 14, basePax: 2, basePrice: 32400, badge: 'BESTSELLER',
    stops: [
      { time: '14:25', city: { tr: 'İstanbul',  en: 'Istanbul'   }, code: 'IST', nights: 3, notes: { tr: 'Boğaz · Topkapı · Çarşı',         en: 'Bosphorus · Topkapı · Bazaar' } },
      { time: '08:10', city: { tr: 'Kapadokya', en: 'Cappadocia' }, code: 'NAV', nights: 2, notes: { tr: 'Balon · Göreme · Avanos',         en: 'Balloons · Göreme · Avanos' } },
      { time: '11:35', city: { tr: 'Pamukkale', en: 'Pamukkale'  }, code: 'DNZ', nights: 1, notes: { tr: 'Travertenler · Hierapolis',      en: 'Travertines · Hierapolis' } },
      { time: '16:50', city: { tr: 'Antalya',   en: 'Antalya'    }, code: 'AYT', nights: 4, notes: { tr: 'Kaleiçi · Olimpos · plaj',       en: 'Kaleiçi · Olympos · beach' } },
      { time: '09:20', city: { tr: 'İzmir',     en: 'İzmir'      }, code: 'ADB', nights: 2, notes: { tr: 'Efes · Çeşme · Alaçatı',         en: 'Ephesus · Çeşme · Alaçatı' } },
      { time: '13:00', city: { tr: 'Trabzon',   en: 'Trabzon'    }, code: 'TZX', nights: 2, notes: { tr: 'Sumela · yayla',                 en: 'Sumela · highlands' } },
    ] },
  { id: 'lycian',     vol: 'II',   color: '#2A8B9E', glyph: '⛰', route: 'AYT·KAŞ·DLM', destCode: 'AYT',
    title: { tr: 'Likya Yolu',            en: 'The Lycian Way' },
    blurb: { tr: '500 km Akdeniz kıyı yürüyüşü · antik Likya köyleri.',
             en: '500 km of Mediterranean coast trail · ancient Lycian villages.' },
    days:  { tr: '9 gün',  en: '9 days' },  baseDays: 9, basePax: 2, basePrice: 24800, badge: 'YENİ · NEW',
    stops: [
      { time: '10:20', city: { tr: 'Antalya', en: 'Antalya'   }, code: 'AYT', nights: 2, notes: { tr: 'Kaleiçi · Konyaaltı',          en: 'Kaleiçi · Konyaaltı' } },
      { time: '08:50', city: { tr: 'Kaş',     en: 'Kaş'       }, code: 'KZR', nights: 4, notes: { tr: 'Antiphellos · Kekova · dalış',  en: 'Antiphellos · Kekova · diving' } },
      { time: '11:10', city: { tr: 'Fethiye', en: 'Fethiye'   }, code: 'DLM', nights: 2, notes: { tr: 'Ölüdeniz · Butterfly · Patara', en: 'Ölüdeniz · Butterfly · Patara' } },
      { time: '15:30', city: { tr: 'Dalyan',  en: 'Dalyan'    }, code: 'DLM', nights: 1, notes: { tr: 'Kaunos · İztuzu plajı',         en: 'Kaunos · İztuzu beach' } },
    ] },
  { id: 'gobekli',    vol: 'III',  color: '#B6552E', glyph: '𓊐', route: 'GZT·ŞFQ·MRD', destCode: 'GNY',
    title: { tr: 'Göbekli Tepe',          en: 'Göbekli Tepe' },
    blurb: { tr: 'Dünyanın bilinen en eski tapınağı · Şanlıurfa, Mardin.',
             en: 'World\'s oldest known temple · Şanlıurfa, Mardin.' },
    days:  { tr: '5 gün',  en: '5 days' },  baseDays: 5, basePax: 2, basePrice: 16400, badge: '12.000 YR',
    stops: [
      { time: '12:40', city: { tr: 'Gaziantep',  en: 'Gaziantep'  }, code: 'GZT', nights: 1, notes: { tr: 'Zeugma · bakırcılar · Antep mutfağı', en: 'Zeugma · coppersmiths · Antep cuisine' } },
      { time: '09:30', city: { tr: 'Şanlıurfa',  en: 'Şanlıurfa'  }, code: 'GNY', nights: 2, notes: { tr: 'Göbeklitepe · Balıklıgöl · Harran',    en: 'Göbeklitepe · Balıklıgöl · Harran' } },
      { time: '15:10', city: { tr: 'Mardin',     en: 'Mardin'     }, code: 'MQM', nights: 2, notes: { tr: 'Eski Şehir · Deyrulzafaran · Midyat',  en: 'Old City · Deyrulzafaran · Midyat' } },
    ] },
  { id: 'nemrut',     vol: 'IV',   color: '#C5A059', glyph: '☉', route: 'GZT·ADF', destCode: 'ADF',
    title: { tr: 'Nemrut Dağı',           en: 'Mount Nemrut' },
    blurb: { tr: 'Komagene tanrı heykelleri arasında gün doğumu.',
             en: 'Sunrise among the Commagene god statues.' },
    days:  { tr: '4 gün',  en: '4 days' },  baseDays: 4, basePax: 2, basePrice: 14200, badge: 'UNESCO',
    stops: [
      { time: '12:40', city: { tr: 'Gaziantep', en: 'Gaziantep' }, code: 'GZT', nights: 1, notes: { tr: 'Zeugma · Antep mutfağı',           en: 'Zeugma · Antep cuisine' } },
      { time: '14:20', city: { tr: 'Adıyaman',  en: 'Adıyaman'  }, code: 'ADF', nights: 3, notes: { tr: 'Nemrut gün doğumu · Cendere · Kahta', en: 'Nemrut sunrise · Cendere · Kahta' } },
    ] },
  { id: 'aegean',     vol: 'V',    color: '#6B8FAA', glyph: '◔', route: 'ADB·BJV·DNZ', destCode: 'ADB',
    title: { tr: 'Ege Antik Rotası',      en: 'Aegean Ancient Route' },
    blurb: { tr: 'Efes · Bergama · Afrodisias · Hierapolis · Milet.',
             en: 'Ephesus · Pergamon · Aphrodisias · Hierapolis · Miletus.' },
    days:  { tr: '8 gün',  en: '8 days' },  baseDays: 8, basePax: 2, basePrice: 21600, badge: 'CLASSIC',
    stops: [
      { time: '11:00', city: { tr: 'İzmir',     en: 'İzmir'      }, code: 'ADB', nights: 2, notes: { tr: 'Efes · Selçuk · Şirince',         en: 'Ephesus · Selçuk · Şirince' } },
      { time: '09:40', city: { tr: 'Bergama',   en: 'Pergamon'   }, code: 'BJV', nights: 1, notes: { tr: 'Akropol · Asklepion',             en: 'Acropolis · Asclepion' } },
      { time: '14:25', city: { tr: 'Pamukkale', en: 'Pamukkale'  }, code: 'DNZ', nights: 3, notes: { tr: 'Pamukkale · Hierapolis · Afrodisias', en: 'Pamukkale · Hierapolis · Aphrodisias' } },
      { time: '10:15', city: { tr: 'Milet',     en: 'Miletus'    }, code: 'ADB', nights: 2, notes: { tr: 'Milet · Didim · Priene',          en: 'Miletus · Didyma · Priene' } },
    ] },
  { id: 'cappadocia', vol: 'VI',   color: '#E5712C', glyph: '◯', route: 'NAV·ASR', destCode: 'NAV',
    title: { tr: 'Kapadokya Şafağı',      en: 'Cappadocia Sunrise' },
    blurb: { tr: 'Balonda gün doğumu · Göreme · Avanos · peri bacaları.',
             en: 'Balloons at dawn · Göreme · Avanos · fairy chimneys.' },
    days:  { tr: '3 gün',  en: '3 days' },  baseDays: 3, basePax: 2, basePrice: 11800, badge: 'ICONIC',
    stops: [
      { time: '08:10', city: { tr: 'Nevşehir', en: 'Nevşehir' }, code: 'NAV', nights: 2, notes: { tr: 'Balon · Göreme · Avanos · Uçhisar', en: 'Balloon · Göreme · Avanos · Uçhisar' } },
      { time: '13:55', city: { tr: 'Kayseri',  en: 'Kayseri'  }, code: 'ASR', nights: 1, notes: { tr: 'Ihlara · Soğanlı vadisi',          en: 'Ihlara · Soğanlı valley' } },
    ] },
  { id: 'gallipoli',  vol: 'VII',  color: '#6E7B45', glyph: '✚', route: 'IST·ÇKL', destCode: 'IST',
    title: { tr: 'Gelibolu & Truva',      en: 'Gallipoli & Troy' },
    blurb: { tr: 'ANZAC anısı · Troya\'nın taşları · Çanakkale Boğazı.',
             en: 'ANZAC memorial · stones of Troy · Dardanelles.' },
    days:  { tr: '4 gün',  en: '4 days' },  baseDays: 4, basePax: 2, basePrice: 13500, badge: 'HERITAGE',
    stops: [
      { time: '09:00', city: { tr: 'İstanbul',  en: 'Istanbul'   }, code: 'IST', nights: 1, notes: { tr: 'Son hazırlıklar · feribot',     en: 'Final prep · ferry' } },
      { time: '11:45', city: { tr: 'Gelibolu',  en: 'Gallipoli'  }, code: 'ÇKL', nights: 2, notes: { tr: 'Anzac Koyu · Conkbayırı · Şehitlik', en: 'Anzac Cove · Chunuk Bair · Memorial' } },
      { time: '10:30', city: { tr: 'Çanakkale', en: 'Çanakkale'  }, code: 'ÇKL', nights: 1, notes: { tr: 'Truva · Bozcaada',              en: 'Troy · Bozcaada' } },
    ] },
  { id: 'blackSea',   vol: 'VIII', color: '#1F4D3F', glyph: '◭', route: 'TZX·RZE', destCode: 'RZE',
    title: { tr: 'Karadeniz Yaylaları',   en: 'Black Sea Highlands' },
    blurb: { tr: 'Sumela Manastırı · Ayder · sis ve çay tarlaları.',
             en: 'Sumela Monastery · Ayder · mist and tea plantations.' },
    days:  { tr: '6 gün',  en: '6 days' },  baseDays: 6, basePax: 2, basePrice: 18900, badge: 'YENİ · NEW',
    stops: [
      { time: '10:15', city: { tr: 'Trabzon', en: 'Trabzon' }, code: 'TZX', nights: 2, notes: { tr: 'Sumela Manastırı · Uzungöl',       en: 'Sumela Monastery · Uzungöl' } },
      { time: '13:40', city: { tr: 'Rize',    en: 'Rize'    }, code: 'RZE', nights: 4, notes: { tr: 'Ayder · Çamlıhemşin · Fırtına Vadisi · çay', en: 'Ayder · Çamlıhemşin · Fırtına Valley · tea' } },
    ] },
];

// ── Tour-selection store (module-level — survives screen swaps) ──────
window.__thyTourSelection = window.__thyTourSelection || null;
function thyGetTourSelection() { return window.__thyTourSelection; }
function thyEnsureSelection(fallbackId = 'grand') {
  if (window.__thyTourSelection) return window.__thyTourSelection;
  const fallback = WEB_TR_TOURS.find(x => x.id === fallbackId) || WEB_TR_TOURS[0];
  return thyBuildSelection(fallback);
}
function thyBuildSelection(tour, { startISO, days, pax } = {}) {
  const d0 = startISO ? new Date(startISO) : new Date('2026-09-15');
  const D = days || tour.baseDays;
  const P = pax  || tour.basePax  || 2;
  // Distribute extra/missing nights across stops proportionally
  const baseNights = tour.stops.reduce((s, x) => s + x.nights, 0);
  const delta = D - baseNights;
  const stops = tour.stops.map(s => ({ ...s }));
  if (delta !== 0 && stops.length) {
    // distribute delta to longest-stay stop(s) for simplicity
    let remaining = delta;
    const order = stops.map((_, i) => i).sort((a, b) => stops[b].nights - stops[a].nights);
    let idx = 0;
    while (remaining !== 0 && idx < 200) {
      const i = order[idx % order.length];
      if (remaining > 0)        { stops[i].nights += 1; remaining -= 1; }
      else if (stops[i].nights > 1) { stops[i].nights -= 1; remaining += 1; }
      idx += 1;
    }
  }
  // assign date per stop
  let cursor = new Date(d0);
  stops.forEach(s => {
    s.startDate = new Date(cursor);
    cursor.setDate(cursor.getDate() + s.nights);
  });
  const endDate = new Date(cursor);
  const totalPrice = Math.round(tour.basePrice * (D / tour.baseDays) * (P / (tour.basePax || 2)));
  const sel = {
    tourId: tour.id, tour,
    startDate: d0, endDate, days: D, pax: P,
    stops, totalPrice,
  };
  window.__thyTourSelection = sel;
  return sel;
}
const _THY_MONTHS_TR = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
const _THY_MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function thyFmtDate(d, lang) {
  if (!(d instanceof Date)) d = new Date(d);
  const dd = String(d.getDate()).padStart(2, '0');
  const mo = (lang === 'en' ? _THY_MONTHS_EN : _THY_MONTHS_TR)[d.getMonth()];
  return `${dd} ${mo}`;
}
function thyFmtMonoDate(d) {
  if (!(d instanceof Date)) d = new Date(d);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}·${mm}`;
}
function thyFmtPrice(n) {
  return Math.round(n).toLocaleString('tr-TR');
}

function TourCardWeb({ tour, lang, onClick }) {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        textAlign: 'left', padding: 0, background: '#FFFBF1',
        color: '#0E0E0E', border: '1.5px solid #0E0E0E', borderRadius: 0,
        boxShadow: h ? '6px 6px 0 #B7312C, 9px 9px 0 #F4C24C' : '4px 4px 0 #B7312C',
        transform: h ? 'translate(-2px, -2px)' : 'none',
        transition: 'all 220ms cubic-bezier(.4,0,.2,1)',
        cursor: 'pointer', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        fontFamily: "'EB Garamond', Georgia, serif",
      }}>
      {/* colored top cover */}
      <div style={{
        position: 'relative', height: 138, padding: '12px 14px',
        background: `linear-gradient(135deg, ${tour.color} 0%, ${tour.color}E6 50%, ${tour.color}99 100%)`,
        color: '#F4EBD9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, opacity: 0.9,
          }}>VOL · {tour.vol}</span>
          <span style={{
            padding: '2px 8px', background: '#F4C24C', color: '#0E0E0E',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, letterSpacing: 1.5,
          }}>{tour.badge}</span>
        </div>
        {/* giant glyph */}
        <div style={{
          position: 'absolute', right: -10, bottom: -32,
          fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
          fontSize: 168, lineHeight: 1, color: '#F4EBD9', opacity: 0.32,
          pointerEvents: 'none',
        }}>{tour.glyph}</div>
        {/* route ribbon */}
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1.5,
          opacity: 0.95, position: 'relative', zIndex: 1,
        }}>↳ {tour.route}</div>
      </div>
      {/* body */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5,
          color: '#525252', textTransform: 'uppercase',
        }}>{tour.days[lang]}</div>
        <div style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 700,
          fontSize: 22, marginTop: 2, lineHeight: 1.08, color: '#0E0E0E',
        }}>{tour.title[lang]}</div>
        <div style={{
          marginTop: 8, fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
          fontSize: 13.5, color: '#525252', lineHeight: 1.45, flex: 1,
        }}>{tour.blurb[lang]}</div>
        <div style={{
          marginTop: 14, paddingTop: 12, borderTop: '1px dashed #0E0E0E44',
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 10, fontStyle: 'italic', color: '#525252' }}>{lang==='tr'?'kişi başı':'per person'}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, letterSpacing: 0.5, color: '#0E0E0E', lineHeight: 1 }}>
                {thyFmtPrice(tour.basePrice)}
              </span>
              <span style={{ fontSize: 12, color: '#525252' }}>TL</span>
            </div>
          </div>
          <span style={{
            color: tour.color, fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 16, letterSpacing: 2, transform: h ? 'translateX(4px)' : 'none',
            transition: 'transform 220ms', whiteSpace: 'nowrap',
          }}>{lang==='tr'?'AÇ':'OPEN'} →</span>
        </div>
      </div>
    </button>
  );
}

// inline helper used by the route page's "Adjust plan" strip
const inlineStep = {
  width: 26, height: 26, border: 'none', background: 'transparent',
  color: '#F0E4CD', cursor: 'pointer',
  fontFamily: "'Playfair Display', serif", fontSize: 17, lineHeight: 1,
};

// 20 ─── TÜRKİYE TURU ROUTE — Railway timetable, driven by selection ──────
function WebTurkiyeRouteScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const toast = useToast();
  const [, setBooking] = useBooking();
  const initial = thyEnsureSelection();
  const tour = initial.tour;
  const isTR = u.lang === 'tr';

  // Local state — editable inline above the timetable.
  const [startDate, setStartDate] = React.useState(() => initial.startDate);
  const [days, setDays] = React.useState(() => initial.days);
  const [pax, setPax]   = React.useState(() => initial.pax);

  // Recompute the selection (and persist to window) whenever inputs change.
  const sel = React.useMemo(() => thyBuildSelection(tour, {
    startISO: startDate.toISOString(), days, pax,
  }), [tour, startDate, days, pax]);
  const stops = sel.stops;

  // 4 preset start dates (every two weeks from 15 Sep 2026)
  const presets = React.useMemo(() => {
    const out = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date('2026-09-15'); d.setDate(d.getDate() + i * 14);
      out.push(d);
    }
    return out;
  }, []);

  // Build a saveable route record matching the WEB_KR_ROUTES schema
  const buildSaveRecord = (status) => {
    const id = 'TRIP-' + (Math.floor(Math.random() * 9000) + 1000);
    const pnr = 'TK-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const legs = stops.map(s => s.code);
    // dedupe consecutive duplicates
    const dedup = legs.filter((c, i) => i === 0 || c !== legs[i - 1]);
    return {
      id, pnr,
      name: tour.title[isTR ? 'tr' : 'en'] + ' · ' + sel.days + (isTR ? ' gün' : ' days'),
      legs: dedup.slice(0, 4),
      dates: thyFmtDate(sel.startDate, u.lang) + ' – ' + thyFmtDate(sel.endDate, u.lang) + ' 2026',
      pax: sel.pax + (isTR ? ' yetişkin' : ' adult' + (sel.pax > 1 ? 's' : '')),
      miles: '+' + thyFmtPrice(sel.totalPrice / 8),
      price: thyFmtPrice(sel.totalPrice) + ',00',
      status: status || { label: isTR ? 'PLANLANIYOR' : 'PLANNED', tone: 'navy' },
      cabin: 'EcoFly',
      eta: isTR ? 'Yardımcı Pilot davet edilebilir' : 'Co-pilot invitable',
      tourId: tour.id,
    };
  };

  const saveToMyRoutes = (record) => {
    try {
      const key = 'thy-route-extra-saved-v1';
      const cur = JSON.parse(localStorage.getItem(key) || '[]');
      // dedupe by tourId+dates so a second click doesn't pile up duplicates
      const sig = record.tourId + '|' + record.dates;
      if (!cur.some(r => (r.tourId + '|' + r.dates) === sig)) {
        cur.unshift(record);
        localStorage.setItem(key, JSON.stringify(cur));
      }
    } catch (_) {}
  };

  // Push tour destination into the global booking so the Rota / Boarding Pass
  // pages render content about the tour’s entry city (not the previous booking).
  const syncBookingToTour = () => {
    setBooking({
      fromCode: 'IST',
      toCode:   tour.destCode || 'IST',
      depDate:  startDate.toISOString().slice(0, 10),
      retDate:  sel.endDate.toISOString().slice(0, 10),
      tripType: 'round',
      tourId:   tour.id,
      tourTitle: tour.title[isTR ? 'tr' : 'en'],
      tourStops: sel.stops,
      tourColor: tour.color,
      tourRoute: tour.route,
    });
  };

  const handleReserve = () => {
    syncBookingToTour();
    const rec = buildSaveRecord({ label: isTR ? 'PLANLANIYOR' : 'PLANNED', tone: 'navy' });
    saveToMyRoutes(rec);
    toast({ type: 'success', icon: '✓', children: isTR ? 'Rota “Kayıtlı Rotalarım”\'a eklendi' : 'Saved to your routes' });
    setTimeout(() => nav('map'), 600);
  };
  const handleBoardingPass = () => {
    syncBookingToTour();
    const rec = buildSaveRecord({ label: isTR ? 'BİNİŞ KARTI HAZIR' : 'READY TO BOARD', tone: 'gold' });
    saveToMyRoutes(rec);
    toast({ type: 'success', icon: '✈', children: isTR ? 'Rota kaydedildi · biniş kartı açılıyor' : 'Saved · opening boarding pass' });
    setTimeout(() => nav('boarding'), 600);
  };

  return (
    <PageShell style={{
      background: '#F0E4CD',
      backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 28px, rgba(50,30,10,0.04) 28px 29px)',
      fontFamily: "'EB Garamond', Georgia, serif", color: '#1F1A14',
    }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />
      <div style={{ borderBottom: '3px double #1F1A14', padding: '32px 32px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontStyle: 'italic', fontSize: 14, letterSpacing: 4 }}>
            ✦ TÜRK HAVA YOLLARI · VOL {tour.vol} · {tour.route} ✦
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 56, fontWeight: 900,
            margin: '8px 0 0', letterSpacing: -1, fontStyle: 'italic' }}>
            {tour.title[isTR ? 'tr' : 'en']} · {sel.days} {isTR ? 'Gün' : 'Days'}
          </h1>
          <div style={{ marginTop: 8, fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#525252', letterSpacing: 2 }}>
            {thyFmtDate(sel.startDate, u.lang).toUpperCase()} 2026 — {thyFmtDate(sel.endDate, u.lang).toUpperCase()} 2026 · FORM N° {String(WEB_TR_TOURS.findIndex(x => x.id === tour.id) + 17).padStart(2, '0')}
          </div>
          <div style={{
            marginTop: 14, display: 'inline-flex', gap: 18, padding: '8px 18px',
            border: '1px dashed #1F1A1466', fontFamily: "'DM Mono', monospace", fontSize: 11,
            letterSpacing: 1.5, color: '#525252',
          }}>
            <span>{isTR ? 'YOLCU' : 'PAX'} · {sel.pax}</span>
            <span>·</span>
            <span>{isTR ? 'KONAKLAMA' : 'NIGHTS'} · {sel.stops.reduce((s, x) => s + x.nights, 0)}</span>
            <span>·</span>
            <span>{isTR ? 'DURAK' : 'STOPS'} · {sel.stops.length}</span>
          </div>
        </div>
      </div>

      {/* ── Inline plan editor — small "adjust this trip" strip ───────── */}
      <div style={{
        maxWidth: 1100, margin: '20px auto 0', padding: '0 32px',
      }}>
        <div style={{
          background: '#1F1A14', color: '#F0E4CD', padding: '14px 18px',
          boxShadow: '4px 4px 0 #C5A059',
          display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 22,
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 13,
            letterSpacing: 2, color: '#C5A059',
          }}>✦ {isTR ? 'PLANI DÜZENLE' : 'ADJUST PLAN'} ✦</span>

          {/* Date presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1.6, color: '#F4C24C', fontWeight: 700 }}>
              {isTR ? 'TARİH' : 'DATE'}
            </span>
            {presets.map(p => {
              const isSel = p.toDateString() === startDate.toDateString();
              return (
                <button key={p.toISOString()} onClick={() => setStartDate(p)} style={{
                  padding: '5px 9px', border: '1px solid ' + (isSel ? '#F4C24C' : '#F0E4CD55'),
                  background: isSel ? '#F4C24C' : 'transparent',
                  color: isSel ? '#1F1A14' : '#F0E4CD',
                  fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1, cursor: 'pointer',
                  transition: 'all 180ms cubic-bezier(.4,0,.2,1)',
                }}>
                  {String(p.getDate()).padStart(2, '0')} {(isTR ? _THY_MONTHS_TR : _THY_MONTHS_EN)[p.getMonth()].toUpperCase()}
                </button>
              );
            })}
            <input type="date" value={startDate.toISOString().slice(0, 10)}
              min="2026-06-01" max="2027-06-01"
              onChange={(e) => e.target.value && setStartDate(new Date(e.target.value))}
              style={{
                marginLeft: 4, padding: '4px 6px', background: 'transparent',
                border: '1px dashed #F0E4CD55', color: '#F0E4CD',
                fontFamily: "'DM Mono', monospace", fontSize: 10,
                colorScheme: 'dark',
              }} />
          </div>

          {/* Duration stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1.6, color: '#F4C24C', fontWeight: 700 }}>
              {isTR ? 'SÜRE' : 'DAYS'}
            </span>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 0,
              border: '1px solid #F0E4CD55', background: 'rgba(244,235,217,0.05)',
            }}>
              <button onClick={() => setDays(Math.max(tour.baseDays - 2, days - 1))} style={inlineStep}>−</button>
              <span style={{
                minWidth: 50, textAlign: 'center',
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#F0E4CD',
                padding: '0 6px', letterSpacing: 1,
              }}>{days}<span style={{ fontSize: 11, color: '#C5A059', marginLeft: 4 }}>{isTR ? 'gün' : 'd'}</span></span>
              <button onClick={() => setDays(Math.min(tour.baseDays + 5, days + 1))} style={inlineStep}>+</button>
            </div>
          </div>

          {/* Pax stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1.6, color: '#F4C24C', fontWeight: 700 }}>
              {isTR ? 'YOLCU' : 'PAX'}
            </span>
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              border: '1px solid #F0E4CD55', background: 'rgba(244,235,217,0.05)',
            }}>
              <button onClick={() => setPax(Math.max(1, pax - 1))} style={inlineStep}>−</button>
              <span style={{
                minWidth: 36, textAlign: 'center',
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#F0E4CD',
                padding: '0 4px', letterSpacing: 1,
              }}>{pax}</span>
              <button onClick={() => setPax(Math.min(6, pax + 1))} style={inlineStep}>+</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 32px',
        display: 'grid', gridTemplateColumns: '1fr 320px', gap: 30 }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 80px 1fr 80px',
            gap: 14, paddingBottom: 10, borderBottom: '2px solid #1F1A14',
            fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: '#525252' }}>
            <span>DATE</span><span>DEP</span><span>STATION</span><span style={{ textAlign: 'right' }}>NIGHTS</span>
          </div>
          {stops.map((s, i) => (
            <div key={i + s.code} style={{
              display: 'grid', gridTemplateColumns: '80px 80px 1fr 80px',
              gap: 14, padding: '16px 0',
              borderBottom: i < stops.length - 1 ? '1px dashed #1F1A1455' : 'none',
              alignItems: 'flex-start',
            }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500 }}>
                {thyFmtMonoDate(s.startDate)}
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#525252' }}>{s.time}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: tour.color, display: 'inline-block' }} />
                  <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 24, lineHeight: 1 }}>
                    {s.city[isTR ? 'tr' : 'en']}
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#525252', letterSpacing: 1 }}>{s.code}</span>
                </div>
                <div style={{ fontSize: 14, fontStyle: 'italic', color: '#525252', marginLeft: 20, marginTop: 4 }}>
                  {s.notes[isTR ? 'tr' : 'en']}
                </div>
              </div>
              <span style={{ textAlign: 'right', fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 28, color: tour.color }}>{s.nights}</span>
            </div>
          ))}
        </div>

        <aside style={{ position: 'sticky', top: 90, height: 'fit-content',
          padding: '20px 22px', background: '#1F1A14', color: '#F0E4CD',
          position: 'relative', boxShadow: '6px 6px 0 #B7312C' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 18 }}>
            <PostMini label="STOPS"   value={String(stops.length)} />
            <PostMini label="NIGHTS"  value={String(stops.reduce((s, x) => s + x.nights, 0))} />
            <PostMini label="FLIGHTS" value={String(Math.max(stops.length - 1, 1))} />
            <PostMini label="MILES"   value={thyFmtPrice(sel.totalPrice / 8)} />
          </div>
          <div style={{ paddingTop: 14, borderTop: '1px solid #C5A05955' }}>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 11, fontStyle: 'italic', color: '#C5A059' }}>TOTAL</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, letterSpacing: 1, marginTop: 4 }}>
              {thyFmtPrice(sel.totalPrice)} <span style={{ fontSize: 18 }}>TL</span>
            </div>
          </div>

          <button onClick={handleReserve} style={{
            marginTop: 18, width: '100%',
            background: '#F0E4CD', color: '#1F1A14', border: '1px solid #F0E4CD',
            padding: '14px 18px', borderRadius: 0,
            fontFamily: "'Playfair Display', serif", fontWeight: 700, fontStyle: 'italic',
            fontSize: 15, cursor: 'pointer',
          }}>{isTR ? 'Rotayı rezerve et' : 'Reserve route'} →</button>

          <button onClick={handleBoardingPass} style={{
            marginTop: 10, width: '100%',
            background: 'transparent', color: '#F0E4CD', border: '1px dashed #C5A059',
            padding: '12px 18px', borderRadius: 0,
            fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
            fontSize: 13, cursor: 'pointer', letterSpacing: 0.5,
          }}>✈ {isTR ? 'Biniş kartını gör' : 'See boarding pass'} →</button>

          <button onClick={() => nav('copilot')} style={{
            marginTop: 8, width: '100%',
            background: 'transparent', color: '#C5A059', border: 'none',
            padding: '8px 0', cursor: 'pointer',
            fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2,
          }}>⧉ {isTR ? 'YARDIMCI PİLOT DAVET ET' : 'INVITE CO-PILOT'}</button>
        </aside>
      </div>
      <div style={{ height: 60 }} />
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}

// 20 ─── CHECK-IN — Japanese minimal, centered ─────────────────
function WebCheckInScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const toast = useToast();
  const [stage, setStage] = React.useState('intro');
  return (
    <PageShell style={{ background: '#FAFAFA', color: '#0A0A0A', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />
      <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 40px',
        minHeight: 'calc(100vh - 130px)' }}>
        {/* Left vertical roman label */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed',
            fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
            fontSize: 12, letterSpacing: 5, color: '#A3A3A3' }}>
            ONLINE · CHECK · IN · TK 1853
          </div>
        </div>

        {/* Center stage */}
        <div style={{ display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
          <div style={{ fontSize: 12, letterSpacing: 6, color: '#737373', textTransform: 'uppercase' }}>
            {stage === 'done' ? (u.lang==='tr'?'tamam':'done') : (u.lang==='tr'?'hazır mısınız':'ready')}
          </div>

          <div style={{ position: 'relative', width: 280, height: 280, marginTop: 32 }}>
            {stage === 'scan' && [0, 1, 2].map(i => (
              <span key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%',
                border: '1.5px solid #B7312C',
                animation: `nfcRing 2.2s ${i*0.7}s ease-out infinite` }} />
            ))}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
              background: stage === 'done' ? 'linear-gradient(135deg, #C5A059, #E8C97A)' : '#B7312C',
              boxShadow: stage === 'scan'
                ? '0 0 80px rgba(183,49,44,0.5), inset 0 0 40px rgba(0,0,0,0.15)'
                : '0 40px 80px rgba(183,49,44,0.25), inset 0 0 40px rgba(0,0,0,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FAFAFA', transition: 'all .4s' }}>
              {stage === 'intro' && <Icon name="qr"    size={86} strokeWidth={1.5} color="#FAFAFA" />}
              {stage === 'scan'  && <Icon name="wifi"  size={86} strokeWidth={1.5} color="#FAFAFA" />}
              {stage === 'done'  && <Icon name="check" size={86} strokeWidth={2}   color="#FAFAFA" />}
            </div>
          </div>

          <h1 style={{ marginTop: 40, textAlign: 'center',
            fontFamily: "'Playfair Display', serif", fontWeight: 500,
            fontSize: 44, letterSpacing: -0.5, lineHeight: 1.15, color: '#0A0A0A', maxWidth: 540 }}>
            {stage === 'intro' && (u.lang==='tr'?'Biniş kartınızın QR kodunu okutun.':'Scan your boarding pass QR code.')}
            {stage === 'scan'  && (u.lang==='tr'?'Okunuyor…':'Reading…')}
            {stage === 'done'  && (u.lang==='tr'?'Hoş geldiniz, Aylin.':'Welcome aboard, Aylin.')}
          </h1>
          <p style={{ marginTop: 14, textAlign: 'center',
            fontSize: 14, color: '#737373', maxWidth: 420, fontStyle: 'italic' }}>
            {stage === 'intro' && (u.lang==='tr'?'Kameranızı QR koda doğrultun. Biniş bilgileriniz otomatik okunur.':'Point your camera at the QR code. Boarding details will be read automatically.')}
            {stage === 'scan'  && (u.lang==='tr'?'Lütfen sabit tutun. Bu işlem ~3 saniye sürer.':'Please hold steady. About 3 seconds.')}
            {stage === 'done'  && (u.lang==='tr'?'14F sizin · biniş 13:55 · kapı A12':'Seat 14F · boarding 13:55 · gate A12')}
          </p>

          <div style={{ marginTop: 50, width: '100%', maxWidth: 360 }}>
            {stage === 'intro' && (
              <button onClick={() => { setStage('scan'); setTimeout(() => setStage('done'), 2400); }} style={{
                width: '100%', padding: '18px', background: '#0A0A0A', color: '#FAFAFA',
                border: 'none', borderRadius: 999, fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                letterSpacing: 1.5, cursor: 'pointer', textTransform: 'uppercase',
              }}>{u.lang==='tr'?'Taramayı başlat':'Begin scan'}</button>
            )}
            {stage === 'scan' && (
              <div style={{ textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#737373' }}>
                ◴ {u.lang==='tr'?'işleniyor':'processing'}…
              </div>
            )}
            {stage === 'done' && (
              <button onClick={() => {
                toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Check-in tamam':'Check-in complete' });
                setTimeout(() => nav('boarding'), 500);
              }} style={{
                width: '100%', padding: '18px', background: '#B7312C', color: '#FAFAFA',
                border: 'none', borderRadius: 999, fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                letterSpacing: 1.5, cursor: 'pointer', textTransform: 'uppercase',
              }}>{u.lang==='tr'?'Biniş kartını aç':'Open boarding pass'} →</button>
            )}
          </div>
        </div>

        {/* Right empty spacer */}
        <div />
      </div>
    </PageShell>
  );
}

Object.assign(window, {
  WebPriceAlertScreen, WebAirportPickerScreen, WebTurkiyeTuruScreen, WebTurkiyeRouteScreen, WebCheckInScreen,
});
