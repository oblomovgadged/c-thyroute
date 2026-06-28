// web-screens-b.jsx — Map, CoPilot, Miles, Notifications, Profile (desktop)

// 06 ─── ROTA — Real destination guide (reads booking.toCode) ──
// Shows the picked destination city: stylised SVG city map, numbered POIs,
// a 3-day itinerary panel, and a flyout detail for any POI clicked.
function WebMapScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: true });
  const [booking, setBooking, h] = useBooking();
  const dest = getDestination(booking.toCode || 'FCO');
  const fromC = h.from || findCity('IST');
  const toC = h.to || findCity(booking.toCode || 'FCO');
  const [dayIx, setDayIx] = React.useState(0);  // 0|1|2 | 'discover'
  const [openPoi, setOpenPoi] = React.useState(null);
  const [editingNote, setEditingNote] = React.useState(null);
  const [noteDraft, setNoteDraft] = React.useState('');
  const [clickedPoint, setClickedPoint] = React.useState(null);
  const [discoverCat, setDiscoverCat] = React.useState('restaurant');
  const [addModal, setAddModal] = React.useState(null); // { poi } when adding to route
  const [sendOpen, setSendOpen] = React.useState(false); // Co-Pilot'a gönder menuü
  const toast = useToast();
  // ✦ Miles&Smiles rota entegrasyonu
  const [msMapActive, setMsMapActive] = React.useState(false);
  const [msOnly, setMsOnly] = React.useState(false);
  const destCodeForMS = booking.toCode || 'FCO';
  const msCount = (typeof getMSPartners === 'function') ? getMSPartners(destCodeForMS).length : 0;
  const reserveMS = (partner) => {
    if (!partner) return;
    const verb = {
      stay:            u.lang === 'tr' ? 'otel'     : 'hotel',
      car:             u.lang === 'tr' ? 'araç'     : 'car',
      vip:             u.lang === 'tr' ? 'transfer' : 'transfer',
      lounge:          u.lang === 'tr' ? 'lounge'   : 'lounge',
      travel_services: u.lang === 'tr' ? 'hizmet'   : 'service',
      finance:         u.lang === 'tr' ? 'kart'     : 'card',
      dining:          u.lang === 'tr' ? 'masa'     : 'table',
    }[partner.cat] || (u.lang === 'tr' ? 'rezervasyon' : 'reservation');
    toast && toast({ type: 'success', icon: '✦', children: u.lang === 'tr'
      ? `M&S üzerinden ${partner.brand} ${verb} rezervasyonuna yönlendiriliyorsun…`
      : `Redirecting to M&S for ${partner.brand} ${verb}…` });
    setOpenPoi(null);
    setTimeout(() => nav('ms'), 900);
  };
  const edits = useRouteEdits(booking.toCode || 'FCO');
  const isShared = edits.isShared();
  const day = (typeof dayIx === 'number') ? dest.days[dayIx] : dest.days[0];

  // Categorised POIs for this city (from web-destinations-poi.jsx)
  const allCatPois = (typeof getDestPois === 'function') ? getDestPois(booking.toCode || 'FCO') : [];
  const catPois = allCatPois.filter(p => p.cat === discoverCat);

  // ─ Flight context: arrival time → day-1 dynamics ─────────────────────────────
  // outbound is set by Results → Confirmation flow. Fallback: deterministic time per route.
  const out = booking.outbound || (() => {
    const seed = (fromC.code + toC.code).split('').reduce((s, ch) => s + ch.charCodeAt(0), 0);
    const arrMin = ((seed * 7) + 230 + (durationFor(fromC.code, toC.code).totalMin)) % (24*60);
    const dep = `${String(Math.floor(((seed*7)+230)%1440/60)).padStart(2,'0')}:${String(((seed*7)+230)%60).padStart(2,'0')}`;
    const arr = `${String(Math.floor(arrMin/60)).padStart(2,'0')}:${String(arrMin%60).padStart(2,'0')}`;
    return { code: 'TK 1853', dep, arr, dur: durationFor(fromC.code, toC.code).txt, fareName: 'EcoFly' };
  })();
  const fareName = out.fareName || booking.fareFamily || 'EcoFly';
  const arrHr = parseInt((out.arr || '14:00').split(':')[0], 10) || 14;
  const arrMin2 = parseInt((out.arr || '14:00').split(':')[1], 10) || 0;
  const arrMinutes = arrHr * 60 + arrMin2;

  // Plan-slot model: which meals of Day 1 actually happen, and at what time?
  // Rule:  arrive ≤ 08:30 → full day (sabah/öğle/akşam)
  //        arrive ≤ 13:30 → öğle + akşam (sabah = check-in / dinlenme)
  //        arrive ≤ 17:30 → sadece akşam (gün yarısı kayboldu)
  //        arrive  > 17:30 → sadece akşam yemeği yakınında, hafif (büyük POI yok)
  // Helper to add minutes → "HH:MM"
  const hhmm = (m) => `${String(Math.floor((m%1440)/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
  // "check-in / hotel" is ~45 min after landing; first real activity 30 min after that.
  const firstActMin  = arrMinutes + 75;
  function day1Plan() {
    const slots = [];
    // arrival row — always shown on day 1
    slots.push({
      kind: 'arrival', when: u.lang==='tr'?'VARIŞ':'ARRIVAL',
      hr: out.arr, title: u.lang==='tr'?`${toC.city} — ${out.code}`:`${toC.city} — ${out.code}`,
      meta: u.lang==='tr'?`${fromC.code} → ${toC.code} · ${out.dur}`:`${fromC.code} → ${toC.code} · ${out.dur}`,
      bookingPoi: null,
    });
    // hotel check-in row
    slots.push({
      kind: 'hotel', when: u.lang==='tr'?'OTEL':'HOTEL',
      hr: hhmm(arrMinutes + 45),
      title: u.lang==='tr'?'Check-in & eşya bırak':'Check-in & drop bags',
      meta: u.lang==='tr'?'~45 dk':'~45 min',
      bookingPoi: null,
    });
    if (arrMinutes <= 8*60+30) {
      // full day
      slots.push({ kind: 'poi', when: u.lang==='tr'?'SABAH':'MORNING', hr: hhmm(firstActMin), id: day.morning });
      slots.push({ kind: 'poi', when: u.lang==='tr'?'ÖĞLE':'NOON',    hr: '13:00', id: day.noon });
      slots.push({ kind: 'poi', when: u.lang==='tr'?'AKŞAM':'EVENING', hr: '19:00', id: day.evening });
    } else if (arrMinutes <= 13*60+30) {
      // noon + evening
      slots.push({ kind: 'poi', when: u.lang==='tr'?'ÖĞLE':'NOON',    hr: hhmm(Math.max(firstActMin, 13*60)), id: day.noon });
      slots.push({ kind: 'poi', when: u.lang==='tr'?'AKŞAM':'EVENING', hr: '19:00', id: day.evening });
    } else if (arrMinutes <= 17*60+30) {
      // evening only
      slots.push({ kind: 'poi', when: u.lang==='tr'?'AKŞAM':'EVENING', hr: hhmm(Math.max(firstActMin, 19*60)), id: day.evening });
    } else {
      // late: dinner near hotel only
      slots.push({
        kind: 'dinner', when: u.lang==='tr'?'AKŞAM YEMEĞİ':'DINNER',
        hr: hhmm(arrMinutes + 90),
        title: u.lang==='tr'?'Otele yakın akşam yemeği':'Dinner near the hotel',
        meta: u.lang==='tr'?'Yorgun bir gece için hafif bir tabak':'A light plate before bed',
        bookingPoi: null,
      });
    }
    return slots;
  }
  function fullDayPlan() {
    return [
      { kind: 'poi', when: u.lang==='tr'?'SABAH':'MORNING', hr: '09:00', id: day.morning },
      { kind: 'poi', when: u.lang==='tr'?'ÖĞLE':'NOON',    hr: '13:00', id: day.noon },
      { kind: 'poi', when: u.lang==='tr'?'AKŞAM':'EVENING', hr: '19:00', id: day.evening },
    ];
  }
  const plan = (dayIx === 0) ? day1Plan() : (typeof dayIx === 'number') ? fullDayPlan() : [];
  const filteredPlan = plan.filter(s => s.kind !== 'poi' || !edits.isDeleted(s.id));
  const dayPois = filteredPlan.filter(s => s.kind === 'poi').map(s => dest.pois.find(p => p.id === s.id)).filter(Boolean);
  const activePois = dest.pois.filter(p => !edits.isDeleted(p.id));
  const customPois = edits.state.c || [];
  const dayPoiIds = dayPois.map(p => p.id);

  async function handleMapClick(latlng) {
    if (isShared) return;
    setClickedPoint({ lat: latlng.lat, lon: latlng.lng, loading: true, data: null });
    try {
      const data = await reverseLookup(latlng.lat, latlng.lng, u.lang);
      setClickedPoint({ lat: latlng.lat, lon: latlng.lng, loading: false, data });
    } catch (e) {
      setClickedPoint({ lat: latlng.lat, lon: latlng.lng, loading: false, data: { name: u.lang==='tr'?'Bilinmeyen yer':'Unknown spot', desc: '', address: '' } });
    }
  }
  function addClickedToRoute() {
    if (!clickedPoint?.data) return;
    const id = 'cust_' + Date.now().toString(36);
    const name = clickedPoint.data.name || (u.lang==='tr'?'Yeni durak':'New stop');
    edits.addCustom({
      id, name: { tr: name, en: name },
      lat: clickedPoint.lat, lon: clickedPoint.lon,
      type: 'view',
      hours: '—', fee: '—',
      desc: { tr: clickedPoint.data.desc || '', en: clickedPoint.data.desc || '' },
      photo: clickedPoint.data.photo || '',
      address: clickedPoint.data.address || '',
      wiki: clickedPoint.data.wiki || '',
    });
    toast({ type: 'success', icon: '✓', children: u.lang==='tr'?`Rotaya eklendi: ${name}`:`Added: ${name}` });
    setClickedPoint(null);
  }

  return (
    <PageShell dark style={{ background: '#050B14' }}>
      <WebTopNav active="map" onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} dark />
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 420px', height: 'calc(100vh - 64px)',
        minHeight: 720,
      }}>
        {/* ── City map canvas ─────────────────────────────────── */}
        <div style={{ position: 'relative', overflow: 'hidden', background: '#101a2b' }}>
          <DestLeafletMap
            destCode={booking.toCode || 'FCO'}
            pois={activePois}
            customPois={customPois}
            discoverPois={(() => {
              const base = dayIx === 'discover' ? catPois.map(p => ({
                id: 'disc_' + p.id, lat: poiLatLon(p, booking.toCode || 'FCO').lat, lon: poiLatLon(p, booking.toCode || 'FCO').lon,
                name: p.name, color: (POI_CATEGORIES.find(c => c.id === p.cat) || {}).color || '#7A4988',
                icon: (POI_CATEGORIES.find(c => c.id === p.cat) || {}).icon || '⚑',
                _src: p,
              })) : [];
              const showMS = msMapActive || (dayIx === 'discover' && msOnly);
              const msPins = (showMS && typeof msPartnersAsMapPois === 'function')
                ? msPartnersAsMapPois(destCodeForMS) : [];
              if (dayIx === 'discover' && msOnly) return msPins;
              return [...base, ...msPins];
            })()}
            dayPoiIds={dayPoiIds}
            openPoiId={openPoi}
            onPoiClick={(id) => {
              if (id && id.startsWith('ms_')) setOpenPoi(id);
              else if (id && id.startsWith('disc_')) setOpenPoi(id.replace('disc_', ''));
              else setOpenPoi(prev => prev === id ? null : id);
            }}
            onMapClick={handleMapClick}
            accent={u.accent}
            mapStyle="voyager"
          />

          {/* top-left: route badge */}
          <div style={{ position: 'absolute', top: 24, left: 24, padding: '12px 16px',
            background: 'rgba(10,22,40,0.86)', border: '1px solid rgba(197,160,89,0.3)',
            borderRadius: 10, backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', gap: 12, color: '#fff',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 18, letterSpacing: 1 }}>{fromC.code}</span>
            <span style={{ fontSize: 16, color: u.accent.fg }}>→</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 18, letterSpacing: 1 }}>{toC.code}</span>
            <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{dest.city}</div>
              <div style={{ fontSize: 10, color: u.accent.fg, fontStyle: 'italic' }}>{u.lang==='tr' ? dest.tagline.tr : dest.tagline.en}</div>
            </div>
          </div>

          {/* ✦ Miles&Smiles harita toggle — sağ üst köşe */}
          {typeof MSMapToggle === 'function' && (
            <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 600 }}>
              <MSMapToggle
                active={msMapActive}
                count={msCount}
                lang={u.lang}
                onToggle={() => {
                  const next = !msMapActive;
                  setMsMapActive(next);
                  toast && toast({ type: 'info', icon: '✦', children: u.lang === 'tr'
                    ? (next ? `${msCount} M&S anlaşmalı yer haritada` : 'M&S katmanı kapatıldı')
                    : (next ? `${msCount} M&S partners on map` : 'M&S layer off') });
                }}
              />
            </div>
          )}

          {/* map zoom controls */}
          <div style={{ position: 'absolute', top: 80, right: 24, display: 'none', flexDirection: 'column', gap: 8 }}>
            {[ 'plus', 'minus', 'location' ].map(i => (
              <button key={i} style={{
                width: 42, height: 42, borderRadius: 10,
                background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', cursor: 'pointer', backdropFilter: 'blur(8px)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon name={i === 'minus' ? 'minus' : i} size={16} /></button>
            ))}
          </div>

          {/* Selected POI flyout — anchored bottom-left */}
          {openPoi && typeof isMSPartnerId === 'function' && isMSPartnerId(openPoi) && (() => {
            /* ✦ M&S partner flyout */
            const partner = getMSPartnerById(destCodeForMS, openPoi);
            if (!partner) return null;
            const catMeta = MS_CATEGORIES.find(c => c.id === partner.cat) || {};
            return (
              <div style={{
                position: 'absolute', left: 24, bottom: 24, width: 400, maxWidth: 'calc(100% - 48px)',
                background: 'linear-gradient(180deg, rgba(20,15,8,0.94), rgba(10,22,40,0.94))',
                border: '1px solid rgba(197,160,89,0.55)',
                borderRadius: 14, padding: 18, color: '#F5E9CB',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 30px rgba(197,160,89,0.32)',
                backdropFilter: 'blur(14px)',
                animation: 'thy-fade-up 350ms cubic-bezier(.16,1,.3,1) both',
                zIndex: 700,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: catMeta.color || '#C5A059', color: '#fff',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15,
                    }}>{catMeta.icon || '✦'}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: '#E5C97A', fontWeight: 800 }}>
                        ✦ MILES&SMILES PARTNERİ
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#B2C0D1', letterSpacing: 1 }}>
                        {(u.lang==='tr' ? catMeta.tr : catMeta.en) || ''} · {partner.brand}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setOpenPoi(null)} style={{
                    width: 28, height: 28, borderRadius: 8, border: 'none',
                    background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer',
                    fontSize: 16, lineHeight: 1,
                  }}>×</button>
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, lineHeight: 1.2, marginBottom: 8, color: '#F5E9CB' }}>
                  {partner.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '5px 10px', borderRadius: 999,
                    background: 'linear-gradient(135deg, rgba(197,160,89,0.18), rgba(197,160,89,0.06))',
                    border: '1px solid rgba(197,160,89,0.48)',
                    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 800,
                    color: '#E5C97A', letterSpacing: 0.4,
                  }}>✦ {partner.offer}</span>
                  {partner.miles !== '—' && (
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#94A3B8', fontWeight: 700,
                    }}>~{partner.miles} mil/işlem</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#C5D4EA', marginBottom: 14, lineHeight: 1.55 }}>
                  {u.lang === 'tr'
                    ? 'Rezervasyonu Miles&Smiles üzerinden tamamlayın, kazandığınız miller otomatik hesabınıza işlesin.'
                    : 'Complete your booking via Miles&Smiles to have the miles credited automatically.'}
                </div>
                {typeof MSReservationCTA === 'function' && (
                  <MSReservationCTA partner={partner} lang={u.lang} dark onReserve={reserveMS} />
                )}
              </div>
            );
          })()}

          {/* Selected POI flyout — anchored bottom-left */}
          {openPoi && !(typeof isMSPartnerId === 'function' && isMSPartnerId(openPoi)) && (() => {
            const p = dest.pois.find(po => po.id === openPoi); if (!p) return null;
            const meta = POI_TYPE_META[p.type] || POI_TYPE_META.monument;
            return (
              <div style={{
                position: 'absolute', left: 24, bottom: 24, width: 380, maxWidth: 'calc(100% - 48px)',
                background: 'rgba(10,22,40,0.92)', border: '1px solid rgba(197,160,89,0.32)',
                borderRadius: 14, padding: 18, color: '#fff',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 30px rgba(197,160,89,0.18)',
                backdropFilter: 'blur(14px)',
                animation: 'thy-fade-up 350ms cubic-bezier(.16,1,.3,1) both',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: u.accent.fg,
                      color: '#0A1628', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 13 }}>{dest.pois.findIndex(po => po.id === p.id) + 1}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: u.accent.fg, fontWeight: 800 }}>
                      {(u.lang==='tr' ? meta.tr : meta.en).toUpperCase()}
                    </span>
                  </div>
                  <button onClick={() => setOpenPoi(null)} style={{
                    width: 28, height: 28, borderRadius: 8, border: 'none',
                    background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer',
                    fontSize: 16, lineHeight: 1,
                  }}>×</button>
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, lineHeight: 1.2, marginBottom: 8 }}>
                  {u.lang==='tr' ? p.name.tr : p.name.en}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: '#B2C0D1', marginBottom: 14 }}>
                  {u.lang==='tr' ? p.desc.tr : p.desc.en}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
                  padding: '10px 12px', background: 'rgba(255,255,255,0.045)', borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 1.5, color: '#7A8EAF', fontWeight: 800 }}>{u.lang==='tr'?'AÇIK':'OPEN'}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 2 }}>{p.hours}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 1.5, color: '#7A8EAF', fontWeight: 800 }}>{u.lang==='tr'?'GİRİŞ':'FEE'}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 2 }}>{p.fee}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Click-to-add lookup card (overlays bottom-left) */}
          {clickedPoint && (
            <div style={{
              position: 'absolute', left: 24, bottom: 24, width: 380, maxWidth: 'calc(100% - 48px)',
              background: 'rgba(10,22,40,0.95)', border: '1px solid rgba(197,160,89,0.32)',
              borderRadius: 14, color: '#fff', overflow: 'hidden', zIndex: 1000,
              boxShadow: '0 24px 60px rgba(0,0,0,0.55), 0 0 24px rgba(197,160,89,0.18)',
              backdropFilter: 'blur(14px)',
              animation: 'thy-fade-up 350ms cubic-bezier(.16,1,.3,1) both',
            }}>
              {clickedPoint.data?.photo && (
                <div style={{ position: 'relative', height: 140, background: '#0F2244' }}>
                  <img src={clickedPoint.data.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, transparent 30%, rgba(10,22,40,0.85) 100%)' }} />
                </div>
              )}
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, color: u.accent.fg }}>⚑</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: u.accent.fg, letterSpacing: 2, fontWeight: 800 }}>
                      {clickedPoint.loading ? (u.lang==='tr'?'ARANIYOR…':'LOOKING UP…') : (u.lang==='tr'?'YENİ NOKTA':'NEW SPOT')}
                    </span>
                  </div>
                  <button onClick={() => setClickedPoint(null)} style={{
                    width: 26, height: 26, borderRadius: 6, border: 'none',
                    background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 14,
                  }}>×</button>
                </div>
                {clickedPoint.loading ? (
                  <div style={{ marginTop: 12, padding: '16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      display: 'inline-block', width: 14, height: 14, borderRadius: '50%',
                      border: '2px solid rgba(197,160,89,0.3)', borderTopColor: u.accent.fg,
                      animation: 'thy-spin 800ms linear infinite',
                    }} />
                    <span style={{ fontSize: 12, color: '#B2C0D1' }}>OpenStreetMap & Wikipedia</span>
                  </div>
                ) : (
                  <>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20,
                      lineHeight: 1.2, marginTop: 8, marginBottom: 6 }}>
                      {clickedPoint.data?.name || (u.lang==='tr'?'İsimsiz nokta':'Unnamed spot')}
                    </div>
                    {clickedPoint.data?.address && (
                      <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 10, lineHeight: 1.4 }}>
                        {clickedPoint.data.address}
                      </div>
                    )}
                    {clickedPoint.data?.desc && (
                      <div style={{ fontSize: 12.5, color: '#D8E0EC', lineHeight: 1.55, marginBottom: 12,
                        maxHeight: 95, overflow: 'hidden',
                        display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical',
                      }}>{clickedPoint.data.desc}</div>
                    )}
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button onClick={addClickedToRoute} style={{
                        flex: 1, background: u.accent.bg, color: '#fff',
                        border: 'none', borderRadius: 8, padding: '10px 14px',
                        fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 12, letterSpacing: 0.5,
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        boxShadow: `0 0 20px ${u.accent.glow}`,
                      }}>★ {u.lang==='tr'?'Rotaya Ekle':'Add to Route'}</button>
                      {clickedPoint.data?.wiki && (
                        <a href={clickedPoint.data.wiki} target="_blank" rel="noreferrer" style={{
                          background: 'rgba(255,255,255,0.06)', color: '#fff',
                          border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 14px',
                          fontSize: 12, fontWeight: 700, cursor: 'pointer', textDecoration: 'none',
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                        }}>W ↗</a>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Right side: itinerary panel ─────────────────────── */}
        <aside style={{
          background: 'linear-gradient(180deg, rgba(15,34,68,0.98) 0%, rgba(10,22,40,1) 60%)',
          borderLeft: '1px solid rgba(197,160,89,0.2)', padding: '24px 22px',
          overflowY: 'auto', backdropFilter: 'blur(14px)',
        }}>
          {/* Shared / collaboration banner */}
          {isShared ? (
            <div style={{
              marginBottom: 14, padding: '10px 12px',
              background: 'rgba(197,160,89,0.14)', border: '1px solid rgba(197,160,89,0.4)',
              borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 14, color: u.accent.fg }}>👁</span>
              <div style={{ flex: 1, fontSize: 11.5, color: '#E8DDC4', lineHeight: 1.4 }}>
                {u.lang==='tr'?'Paylaşılan rota görünümü · Salt okur':'Shared route view · Read-only'}
              </div>
              <button onClick={() => { try { window.history.replaceState(null, '', window.location.pathname); window.location.reload(); } catch (e) {} }} style={{
                background: 'transparent', border: '1px solid rgba(197,160,89,0.4)',
                color: u.accent.fg, borderRadius: 6, padding: '4px 8px', fontSize: 10, fontWeight: 700,
                cursor: 'pointer',
              }}>{u.lang==='tr'?'ÇIK':'EXIT'}</button>
            </div>
          ) : (
            <div style={{ marginBottom: 14, display: 'flex', gap: 6, position: 'relative' }}>
              <button onClick={() => setSendOpen(v => !v)} style={{
                flex: 1, padding: '8px 12px', borderRadius: 8,
                background: sendOpen ? 'rgba(197,160,89,0.22)' : 'rgba(197,160,89,0.12)',
                border: '1px solid rgba(197,160,89,0.4)',
                color: u.accent.fg, fontWeight: 800, fontSize: 11, letterSpacing: 1, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>✈ {u.lang==='tr'?"Co-Pilot'a gönder":'Send to Co-Pilot'}</button>
              {((edits.state.c?.length || 0) + Object.keys(edits.state.n || {}).length + ((edits.state.d || []).length)) > 0 ? (
                <button onClick={() => { if (window.confirm(u.lang==='tr'?'Notları, silmeleri ve eklenen yerleri sıfırla?':'Reset notes, deletions and added stops?')) { edits.reset(); toast({ type: 'info', icon: '↻', children: u.lang==='tr'?'Sıfırlandı':'Reset' }); } }} style={{
                  padding: '8px 12px', borderRadius: 8,
                  background: 'transparent', border: '1px solid rgba(183,49,44,0.4)',
                  color: '#FF8580', fontWeight: 800, fontSize: 11, letterSpacing: 1, cursor: 'pointer',
                }}>↻</button>
              ) : null}

              {/* Co-Pilot'a gönder popover */}
              {sendOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 50,
                  background: 'rgba(15,28,52,0.96)',
                  border: '1px solid rgba(197,160,89,0.32)',
                  borderRadius: 12, padding: 12,
                  boxShadow: '0 18px 40px rgba(0,0,0,0.55), 0 0 24px rgba(197,160,89,0.18)',
                  backdropFilter: 'blur(14px)',
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1.8, color: '#C5A059', fontWeight: 800, marginBottom: 4 }}>
                    ✦ {u.lang==='tr'?"DAVETİ NASIL GÖNDERELİM?":'HOW TO INVITE?'}
                  </div>
                  {[
                    { id: 'wa', icon: '💬', label: 'WhatsApp', sub: u.lang==='tr'?'Sohbet üzerinden':'via chat',
                      action: () => { const link = edits.shareLink(); const msg = (u.lang==='tr'?'Rotama yardımcı pilot olarak katılır mısın? ':"Want to co-pilot my route? ") + link; window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank'); } },
                    { id: 'mail', icon: '✉', label: u.lang==='tr'?'E-posta':'Email', sub: u.lang==='tr'?'Outlook · Gmail':'Outlook · Gmail',
                      action: () => { const link = edits.shareLink(); const subject = u.lang==='tr'?'Rotama yardımcı pilot olarak katıl':'Join my route as co-pilot'; const body = (u.lang==='tr'?'Birlikte planlayalım:\n\n':'Let\'s plan together:\n\n') + link; window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); } },
                    { id: 'sms', icon: '📲', label: 'SMS', sub: u.lang==='tr'?'Kısa mesaj':'Text message',
                      action: () => { const link = edits.shareLink(); window.location.href = 'sms:?body=' + encodeURIComponent((u.lang==='tr'?'Rota davetim: ':'My route invite: ') + link); } },
                    { id: 'copy', icon: '🔗', label: u.lang==='tr'?'Linki kopyala':'Copy link', sub: u.lang==='tr'?'Panoya kopyalanır':'Copies to clipboard',
                      action: async () => { const link = edits.shareLink(); try { await navigator.clipboard.writeText(link); toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Davet linki kopyalandı':'Invite link copied' }); } catch (e) { window.prompt(u.lang==='tr'?'Kopyala:':'Copy:', link); } } },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => { opt.action(); setSendOpen(false); }} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', cursor: 'pointer',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                      color: '#F4EBD9', textAlign: 'left',
                      transition: 'all 180ms cubic-bezier(.16,1,.3,1)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197,160,89,0.14)'; e.currentTarget.style.borderColor = 'rgba(197,160,89,0.45)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                      <span style={{ fontSize: 18, lineHeight: 1, width: 22, textAlign: 'center' }}>{opt.icon}</span>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <span style={{ fontWeight: 700, fontSize: 12.5 }}>{opt.label}</span>
                        <span style={{ fontSize: 10.5, color: '#7A8EAF', fontFamily: 'var(--font-mono)', letterSpacing: 0.4 }}>{opt.sub}</span>
                      </div>
                      <span style={{ color: u.accent.fg, fontSize: 14 }}>→</span>
                    </button>
                  ))}
                  <button onClick={() => setSendOpen(false)} style={{
                    marginTop: 4, padding: '7px 10px', background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                    color: '#7A8EAF', fontSize: 10.5, fontWeight: 800, letterSpacing: 1.2,
                    cursor: 'pointer', fontFamily: 'var(--font-mono)',
                  }}>{u.lang==='tr'?'KAPAT':'CLOSE'}</button>
                </div>
              )}
            </div>
          )}

          {/* Mini Boarding Pass — above the route guide header */}
          <div style={{
            marginBottom: 18,
            background: 'linear-gradient(135deg, rgba(0,83,165,0.32) 0%, rgba(15,34,68,0.6) 100%)',
            border: '1px solid rgba(197,160,89,0.28)', borderRadius: 12,
            padding: '12px 14px 14px', position: 'relative', overflow: 'hidden',
          }}>
            <div aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, left: 'calc(50% + 18px)',
              borderLeft: '1px dashed rgba(255,255,255,0.18)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, color: u.accent.fg }}>✈</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: u.accent.fg, letterSpacing: 2, fontWeight: 800 }}>
                  {u.lang==='tr'?'BİNİŞ KARTI':'BOARDING PASS'}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#fff', fontWeight: 700 }}>{out.code}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 10, marginTop: 6 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: '#fff', fontWeight: 800, letterSpacing: 1, lineHeight: 1 }}>{fromC.code}</div>
                <div style={{ fontSize: 9.5, color: '#94A3B8', marginTop: 3 }}>{fromC.city}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: u.accent.fg, fontWeight: 700, marginTop: 4 }}>{out.dep}</div>
              </div>
              <div aria-hidden style={{ position: 'relative', width: 56 }}>
                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.25)' }} />
                <span style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                  background: '#0F2244', padding: '0 4px', fontSize: 12, color: u.accent.fg }}>➝</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: '#fff', fontWeight: 800, letterSpacing: 1, lineHeight: 1 }}>{toC.code}</div>
                <div style={{ fontSize: 9.5, color: '#94A3B8', marginTop: 3 }}>{toC.city}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: u.accent.fg, fontWeight: 700, marginTop: 4 }}>{out.arr}</div>
              </div>
            </div>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed rgba(255,255,255,0.12)',
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div>
                <div style={{ fontSize: 8.5, color: '#7A8EAF', letterSpacing: 1.5, fontWeight: 800 }}>PNR</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#fff', fontWeight: 700, marginTop: 2, letterSpacing: 1.5 }}>{booking.pnr || '— —'}</div>
              </div>
              <div>
                <div style={{ fontSize: 8.5, color: '#7A8EAF', letterSpacing: 1.5, fontWeight: 800 }}>{u.lang==='tr'?'SÜRE':'DUR'}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#fff', fontWeight: 700, marginTop: 2 }}>{out.dur}</div>
              </div>
              <div>
                <div style={{ fontSize: 8.5, color: '#7A8EAF', letterSpacing: 1.5, fontWeight: 800 }}>{u.lang==='tr'?'TARİFE':'FARE'}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: u.accent.fg, fontWeight: 700, marginTop: 2 }}>{fareName}</div>
              </div>
            </div>
          </div>

          {/* Editorial D — dateline strip */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingBottom: 8, marginBottom: 12,
            borderBottom: '1px solid rgba(197,160,89,0.32)',
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1.8, fontWeight: 800, color: '#C5A059',
          }}>
            <span>№ 042 · {(dest.city || booking.toCode || 'ROMA').toUpperCase()} · {(toC?.country || (u.lang==='tr'?'ITALYA':'ITALIA')).toUpperCase()}</span>
            <span style={{ color: '#EF2E1F' }}>● {dest.pois.length} {u.lang==='tr'?'DURAK':'STOPS'}</span>
          </div>

          {booking.tourId && booking.tourTitle && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 10px',
              marginBottom: 12,
              background: 'linear-gradient(135deg, rgba(244,194,76,0.18), rgba(183,49,44,0.18))',
              border: '1px solid rgba(244,194,76,0.55)',
              fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: 2, fontWeight: 800, color: '#F4C24C',
            }}>
              <span style={{ fontSize: 11 }}>✦</span>
              <span>{u.lang==='tr' ? 'TUR MOD' : 'TOUR MODE'}</span>
              <span style={{ color: '#C5A059', fontWeight: 600 }}>·</span>
              <span style={{ color: '#F4EBD9', letterSpacing: 1, fontWeight: 700 }}>{booking.tourTitle.toUpperCase()}</span>
            </div>
          )}

          {thyHasPrefs && thyHasPrefs() && (
            <div style={{ marginBottom: 12, marginLeft: booking.tourId ? 8 : 0, display: 'inline-block' }}>
              <TravelPrefsBadge lang={u.lang} dark onClick={() => nav('travelPrefs')} />
            </div>
          )}
          {/* Editorial D — massive italic city + sup count */}
          <h2 style={{
            margin: '0 0 4px',
            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
            fontWeight: 700, fontSize: 56, lineHeight: 0.88, letterSpacing: -1.6, color: '#F4EBD9',
          }}>
            {dest.city}<sup style={{
              fontSize: 18, color: '#EF2E1F', fontStyle: 'normal',
              fontFamily: 'var(--font-mono)', fontWeight: 800,
              verticalAlign: 'top', position: 'relative', top: 10, marginLeft: 3,
            }}>{dest.pois.length}</sup>
          </h2>
          <div style={{
            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
            fontSize: 14, color: '#C5A059', marginBottom: 14, marginTop: 4,
          }}>
            {u.lang==='tr' ? dest.tagline.tr : dest.tagline.en}
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#B2C0D1', marginBottom: 22 }}>
            {u.lang==='tr' ? dest.summary.tr : dest.summary.en}
          </div>

          {/* Editorial D — chapter tabs (italic numerals + bottom-rule accent) */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 0, marginBottom: 14,
            borderBottom: '1px solid rgba(197,160,89,0.22)',
          }}>
            {dest.days.map((d, i) => {
              const on = i === dayIx;
              const numeral = ['I','II','III','IV','V'][i] || String(i + 1);
              return (
                <button key={i} onClick={() => setDayIx(i)} style={{
                  padding: '8px 0 10px', marginRight: 22, cursor: 'pointer',
                  background: 'transparent', border: 'none', borderRadius: 0,
                  borderBottom: on ? '2px solid #EF2E1F' : '2px solid transparent',
                  color: on ? '#F4EBD9' : '#7A8EAF',
                  display: 'inline-flex', alignItems: 'baseline', gap: 7,
                  marginBottom: -1,
                  transition: 'all 200ms cubic-bezier(.16,1,.3,1)',
                }}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                    fontWeight: 700, fontSize: 22, lineHeight: 1,
                    color: on ? '#EF2E1F' : '#94A3B8',
                  }}>{numeral}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 11, letterSpacing: 1.2,
                  }}>{u.lang==='tr'?`GÜN ${i+1}`:`DAY ${i+1}`}</span>
                </button>
              );
            })}
            <button onClick={() => setDayIx('discover')} style={{
              padding: '8px 0 10px', marginRight: 22, cursor: 'pointer',
              background: 'transparent', border: 'none', borderRadius: 0,
              borderBottom: dayIx === 'discover' ? '2px solid #EF2E1F' : '2px solid transparent',
              color: dayIx === 'discover' ? '#F4EBD9' : '#7A8EAF',
              display: 'inline-flex', alignItems: 'baseline', gap: 7,
              marginBottom: -1,
              transition: 'all 200ms cubic-bezier(.16,1,.3,1)',
            }}>
              <span style={{
                fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                fontWeight: 700, fontSize: 22, lineHeight: 1,
                color: dayIx === 'discover' ? '#EF2E1F' : '#94A3B8',
              }}>∞</span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 11, letterSpacing: 1.2,
              }}>{u.lang==='tr'?'KEŞFET':'DISCOVER'}</span>
            </button>
          </div>
          {/* Chapter eyebrow + italic chapter title */}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 800,
            letterSpacing: 2, color: '#EF2E1F', marginBottom: 4,
          }}>
            {(u.lang==='tr'?'BÖLÜM':'CHAPTER')} {dayIx === 'discover' ? '∞' : (['I','II','III','IV','V'][dayIx] || String(dayIx + 1))}
          </div>
          <div style={{
            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
            fontWeight: 700, fontSize: 24, color: '#F4EBD9', marginBottom: 16, letterSpacing: -0.4, lineHeight: 1.1,
          }}>
            {dayIx === 'discover'
              ? (u.lang==='tr'?'Yakınlarda ne var?':'What\'s nearby?')
              : (u.lang==='tr' ? day.title.tr : day.title.en)}
          </div>

          {/* ─── DISCOVER TAB ─────────────────────────────────────────────────────── */}
          {dayIx === 'discover' && (typeof POI_CATEGORIES !== 'undefined') && (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {/* ✦ Sadece M&S toggle chip — rail'in BAŞINDA */}
                {typeof MSOnlyChip === 'function' && (
                  <MSOnlyChip
                    active={msOnly}
                    lang={u.lang}
                    onToggle={() => setMsOnly(v => !v)}
                  />
                )}
                {POI_CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => { setDiscoverCat(c.id); setMsOnly(false); }} style={{
                    padding: '7px 11px', borderRadius: 999,
                    background: (discoverCat === c.id && !msOnly) ? c.color : 'rgba(255,255,255,0.04)',
                    border: '1px solid ' + ((discoverCat === c.id && !msOnly) ? c.color : 'rgba(255,255,255,0.1)'),
                    color: (discoverCat === c.id && !msOnly) ? '#fff' : '#B2C0D1',
                    fontWeight: 700, fontSize: 11, letterSpacing: 0.5, cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    opacity: msOnly ? 0.5 : 1,
                  }}>
                    <span>{c.icon}</span>
                    <span>{u.lang==='tr' ? c.tr : c.en}</span>
                  </button>
                ))}
              </div>
              {msOnly ? (
                /* ✦ M&S aktif: kategori başlıklı grup listesi */
                (typeof MSGroupedList === 'function') && (
                  <MSGroupedList
                    destCode={destCodeForMS}
                    lang={u.lang}
                    dark
                    onOpenPartner={(p) => setOpenPoi(p.id)}
                    onReserve={reserveMS}
                  />
                )
              ) : catPois.length === 0 ? (
                <div style={{ padding: '20px 14px', background: 'rgba(255,255,255,0.03)',
                  borderRadius: 10, color: '#94A3B8', fontSize: 12, textAlign: 'center', fontStyle: 'italic' }}>
                  {u.lang==='tr'?'Bu kategoride henüz öneri yok.':'No suggestions in this category yet.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {catPois.map((p, i) => {
                    const isOpen = openPoi === p.id;
                    const catMeta = POI_CATEGORIES.find(c => c.id === p.cat);
                    return (
                      <div key={p.id} style={{
                        padding: '11px 12px',
                        background: isOpen ? `${catMeta.color}22` : 'rgba(255,255,255,0.04)',
                        border: '1px solid ' + (isOpen ? catMeta.color + '88' : 'rgba(255,255,255,0.08)'),
                        borderRadius: 10, color: '#fff',
                      }}>
                        <div onClick={() => setOpenPoi(isOpen ? null : p.id)} style={{
                          display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 10, alignItems: 'center', cursor: 'pointer',
                        }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: catMeta.color, color: '#fff',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13,
                          }}>{catMeta.icon}</div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {u.lang==='tr' ? p.name.tr : p.name.en}
                            </div>
                            <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>
                              {p.hours} · {p.price}
                            </div>
                          </div>
                          <div style={{ color: '#7A8EAF', fontSize: 14 }}>{isOpen ? '−' : '+'}</div>
                        </div>
                        {isOpen && (
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed rgba(255,255,255,0.12)' }}>
                            <div style={{ fontSize: 12, color: '#D8E0EC', lineHeight: 1.5, marginBottom: 10 }}>
                              {u.lang==='tr' ? p.desc.tr : p.desc.en}
                            </div>
                            {!isShared && (
                              <button onClick={() => setAddModal({ poi: p })} style={{
                                width: '100%', padding: '8px 12px', borderRadius: 8,
                                background: catMeta.color, color: '#fff',
                                border: 'none', cursor: 'pointer',
                                fontWeight: 800, fontSize: 11.5, letterSpacing: 0.5,
                              }}>★ {u.lang==='tr'?'Rotaya Ekle':'Add to Route'}</button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Day plan — dynamic by arrival time on day 1 */}
          {typeof dayIx === 'number' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredPlan.map((slot, ix) => {
              if (slot.kind !== 'poi') {
                // arrival / hotel / dinner row
                const ico = slot.kind === 'arrival' ? '✈' : slot.kind === 'hotel' ? '⌬' : '🍽';
                return (
                  <div key={'sys'+ix} style={{
                    display: 'grid', gridTemplateColumns: '38px 1fr auto', gap: 12, alignItems: 'center',
                    padding: '12px 14px',
                    background: 'rgba(0,83,165,0.16)',
                    border: '1px solid rgba(197,160,89,0.22)',
                    borderRadius: 10, color: '#fff',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'rgba(197,160,89,0.18)', color: u.accent.fg,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, border: `1px solid ${u.accent.fg}`,
                    }}>{ico}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: u.accent.fg, fontWeight: 800, letterSpacing: 2 }}>{slot.when}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#7A8EAF' }}>{slot.hr}</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {slot.title}
                      </div>
                      <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 1 }}>{slot.meta}</div>
                    </div>
                  </div>
                );
              }
              const p = dest.pois.find(po => po.id === slot.id); if (!p) return null;
              const meta = POI_TYPE_META[p.type] || POI_TYPE_META.monument;
              const pinNum = dest.pois.findIndex(po => po.id === p.id) + 1;
              const isOpen = openPoi === p.id;
              const note = edits.getNote(p.id);
              const isEditingThis = editingNote === p.id;
              return (
                <div key={slot.id+slot.when} style={{
                  padding: '12px 14px',
                  background: isOpen ? 'rgba(197,160,89,0.12)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid ' + (isOpen ? 'rgba(197,160,89,0.4)' : 'rgba(255,255,255,0.08)'),
                  borderRadius: 10, color: '#fff',
                }}>
                  <div onClick={() => setOpenPoi(isOpen ? null : p.id)} style={{
                    display: 'grid', gridTemplateColumns: '38px 1fr auto', gap: 12, alignItems: 'center', cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: u.accent.fg, color: '#0A1628',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 14,
                    }}>{pinNum}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: u.accent.fg, fontWeight: 800, letterSpacing: 2 }}>{slot.when}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#7A8EAF' }}>{slot.hr}</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {u.lang==='tr' ? p.name.tr : p.name.en}
                      </div>
                      <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 1 }}>
                        {u.lang==='tr' ? meta.tr : meta.en} · {p.hours.split('—')[0].trim() || p.hours}
                      </div>
                    </div>
                    <div style={{ color: '#7A8EAF', fontSize: 16 }}>{isOpen ? '−' : '+'}</div>
                  </div>
                  {/* Note line — displayed if exists, or being edited */}
                  {(note || isEditingThis) && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed rgba(255,255,255,0.12)' }}>
                      {isEditingThis ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <input
                            type="text"
                            autoFocus
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder={u.lang==='tr'?'Bir not yaz…':'Write a note…'}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                if (noteDraft.trim()) edits.addNote(p.id, noteDraft.trim());
                                else edits.deleteNote(p.id);
                                setEditingNote(null);
                              } else if (e.key === 'Escape') { setEditingNote(null); }
                            }}
                            style={{
                              flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(197,160,89,0.4)',
                              borderRadius: 6, color: '#fff', padding: '6px 10px', fontSize: 12, outline: 'none',
                              fontFamily: 'var(--font-ui)',
                            }}
                          />
                          <button onClick={() => {
                            if (noteDraft.trim()) edits.addNote(p.id, noteDraft.trim());
                            else edits.deleteNote(p.id);
                            setEditingNote(null);
                          }} style={{
                            background: u.accent.fg, color: '#0A1628', border: 'none', borderRadius: 6,
                            padding: '6px 10px', fontWeight: 800, fontSize: 11, cursor: 'pointer',
                          }}>{u.lang==='tr'?'KAYDET':'SAVE'}</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <span style={{ color: u.accent.fg, fontSize: 11 }}>✎</span>
                          <div style={{ flex: 1, fontSize: 12, color: '#E8DDC4', fontStyle: 'italic', lineHeight: 1.45 }}>{note}</div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Actions row — hidden in shared view */}
                  {!isShared && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button onClick={() => { setEditingNote(p.id); setNoteDraft(note); }}
                        title={u.lang==='tr'?'Not ekle / düzenle':'Add / edit note'}
                        style={{
                          background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
                          color: '#B2C0D1', borderRadius: 6, padding: '4px 8px', fontSize: 10.5, fontWeight: 700,
                          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
                        }}>✎ {note ? (u.lang==='tr'?'Notu düzenle':'Edit note') : (u.lang==='tr'?'Not ekle':'Add note')}</button>
                      <button onClick={() => {
                        edits.deletePoi(p.id);
                        toast({ type: 'info', icon: '↑', children: u.lang==='tr'?'Plandan kaldırıldı':'Removed from plan' });
                      }}
                        title={u.lang==='tr'?'Plandan kaldır':'Remove from plan'}
                        style={{
                          background: 'transparent', border: '1px solid rgba(183,49,44,0.4)',
                          color: '#FF8580', borderRadius: 6, padding: '4px 8px', fontSize: 10.5, fontWeight: 700,
                          cursor: 'pointer',
                        }}>🗑</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          )}

          {/* User-added (custom) POIs */}
          {customPois.length > 0 && (
            <>
              <div style={{ marginTop: 24, fontSize: 10, fontWeight: 800, letterSpacing: 2, color: u.accent.fg,
                display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>★</span>
                <span>{u.lang==='tr'?'EKLENEN YERLER':'YOUR ADDED STOPS'} · {customPois.length}</span>
              </div>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {customPois.map((cp, i) => (
                  <div key={cp.id} style={{
                    display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 10, alignItems: 'center',
                    padding: '8px 10px', background: 'rgba(183,49,44,0.12)',
                    border: '1px solid rgba(183,49,44,0.3)', borderRadius: 8, color: '#fff',
                  }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%', background: '#B7312C', color: '#fff',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 10,
                    }}>★{i+1}</span>
                    <button onClick={() => setOpenPoi(cp.id)} style={{
                      background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left',
                      fontSize: 12, fontWeight: 600, padding: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{cp.name?.tr || cp.name?.en || (u.lang==='tr'?'İsimsiz':'Unnamed')}</button>
                    {!isShared && (
                      <button onClick={() => { edits.removeCustom(cp.id); toast({ type: 'info', icon: '↑', children: u.lang==='tr'?'Kaldırıldı':'Removed' }); }}
                        style={{
                          background: 'transparent', border: 'none', color: '#FF8580',
                          cursor: 'pointer', fontSize: 12, padding: '2px 4px',
                        }}>🗑</button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* All POIs */}
          <div style={{ marginTop: 24, fontSize: 10, fontWeight: 800, letterSpacing: 2, color: u.accent.fg }}>
            {u.lang==='tr'?'TÜM GEZİLECEK YERLER':'ALL SIGHTS'} · {dest.pois.length}
          </div>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {dest.pois.map((p, i) => {
              const meta = POI_TYPE_META[p.type] || POI_TYPE_META.monument;
              const isOpen = openPoi === p.id;
              return (
                <button key={p.id} onClick={() => setOpenPoi(isOpen ? null : p.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px', textAlign: 'left',
                  background: isOpen ? 'rgba(197,160,89,0.12)' : 'rgba(255,255,255,0.035)',
                  border: '1px solid ' + (isOpen ? 'rgba(197,160,89,0.4)' : 'rgba(255,255,255,0.07)'),
                  borderRadius: 8, cursor: 'pointer', color: '#fff',
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', background: u.accent.fg, color: '#0A1628',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 10,
                  }}>{i+1}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.lang==='tr' ? p.name.tr : p.name.en}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <button onClick={() => nav('boarding')} style={{
            marginTop: 22, padding: '14px 16px', width: '100%',
            background: u.accent.bg, color: '#fff',
            border: 'none', borderRadius: 12, cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 13, letterSpacing: 0.5,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: `0 0 22px ${u.accent.glow}`,
          }}>
            ✈ {u.lang==='tr'?'Biniş kartını gör':'View boarding pass'} →
          </button>
        </aside>
      </div>

      {/* Add-to-Route modal — asks day + slot */}
      {addModal && (
        <div onClick={() => setAddModal(null)} style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(5, 11, 20, 0.78)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'thy-fade-up 250ms ease-out',
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: 440, maxWidth: 'calc(100% - 32px)',
            background: 'linear-gradient(160deg, #0F2244 0%, #0A1628 100%)',
            border: '1px solid rgba(197,160,89,0.35)', borderRadius: 16,
            padding: 26, color: '#fff',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 24px rgba(197,160,89,0.18)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: u.accent.fg, letterSpacing: 2, fontWeight: 800 }}>
                  ★ {u.lang==='tr'?'ROTAYA EKLE':'ADD TO ROUTE'}
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginTop: 4, lineHeight: 1.15 }}>
                  {u.lang==='tr' ? addModal.poi.name.tr : addModal.poi.name.en}
                </div>
                <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 3 }}>
                  {((POI_CATEGORIES.find(c => c.id === addModal.poi.cat) || {})[u.lang==='tr' ? 'tr' : 'en']) || ''} · {addModal.poi.hours} · {addModal.poi.price}
                </div>
              </div>
              <button onClick={() => setAddModal(null)} style={{
                width: 30, height: 30, borderRadius: 8, border: 'none',
                background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: 16,
              }}>×</button>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#94A3B8', marginBottom: 8 }}>
                {u.lang==='tr'?'HANGİ GÜN?':'WHICH DAY?'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                {dest.days.map((d, i) => (
                  <button key={i} onClick={() => setAddModal(m => ({ ...m, day: i }))} style={{
                    padding: '10px 12px', borderRadius: 8,
                    background: addModal.day === i ? u.accent.fg : 'rgba(255,255,255,0.06)',
                    border: '1px solid ' + (addModal.day === i ? u.accent.fg : 'rgba(255,255,255,0.1)'),
                    color: addModal.day === i ? '#0A1628' : '#fff',
                    fontWeight: 800, fontSize: 12, cursor: 'pointer',
                  }}>{u.lang==='tr' ? `Gün ${i+1}` : `Day ${i+1}`}</button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#94A3B8', marginBottom: 8 }}>
                {u.lang==='tr'?'HANGİ VAKİT?':'WHICH SLOT?'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                {[
                  { id: 'morning', tr: 'Sabah', en: 'Morning', icon: '☀' },
                  { id: 'noon',    tr: 'Öğle',  en: 'Noon',    icon: '☼' },
                  { id: 'evening', tr: 'Akşam', en: 'Evening', icon: '☾' },
                ].map(s => (
                  <button key={s.id} onClick={() => setAddModal(m => ({ ...m, slot: s.id }))} style={{
                    padding: '10px 12px', borderRadius: 8,
                    background: addModal.slot === s.id ? u.accent.fg : 'rgba(255,255,255,0.06)',
                    border: '1px solid ' + (addModal.slot === s.id ? u.accent.fg : 'rgba(255,255,255,0.1)'),
                    color: addModal.slot === s.id ? '#0A1628' : '#fff',
                    fontWeight: 700, fontSize: 11.5, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  }}>
                    <span>{s.icon}</span>
                    <span>{u.lang==='tr' ? s.tr : s.en}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 22, display: 'flex', gap: 8 }}>
              <button onClick={() => setAddModal(null)} style={{
                flex: 1, padding: '12px 14px', borderRadius: 8,
                background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                color: '#B2C0D1', fontWeight: 700, fontSize: 12, cursor: 'pointer',
              }}>{u.lang==='tr'?'İptal':'Cancel'}</button>
              <button
                disabled={addModal.day == null || !addModal.slot}
                onClick={() => {
                  const p = addModal.poi;
                  const cat = POI_CATEGORIES.find(c => c.id === p.cat) || {};
                  const ll = poiLatLon(p, booking.toCode || 'FCO');
                  const id = `slot_${Date.now().toString(36)}`;
                  edits.addCustom({
                    id, name: p.name, lat: ll.lat, lon: ll.lon,
                    type: 'discover', category: p.cat,
                    hours: p.hours, fee: p.price,
                    desc: p.desc,
                    slotDay: addModal.day, slotWhen: addModal.slot,
                    color: cat.color,
                  });
                  const dayLbl = u.lang==='tr' ? `Gün ${addModal.day+1}` : `Day ${addModal.day+1}`;
                  const slotLbl = ({ morning:{tr:'Sabah',en:'Morning'}, noon:{tr:'Öğle',en:'Noon'}, evening:{tr:'Akşam',en:'Evening'} })[addModal.slot][u.lang==='tr'?'tr':'en'];
                  const nm = u.lang==='tr' ? p.name.tr : p.name.en;
                  toast({ type: 'success', icon: '★', children: `${nm} → ${dayLbl}, ${slotLbl}` });
                  setAddModal(null);
                  setDayIx(addModal.day);
                }}
                style={{
                  flex: 2, padding: '12px 14px', borderRadius: 8,
                  background: (addModal.day != null && addModal.slot) ? u.accent.bg : 'rgba(183,49,44,0.3)',
                  color: '#fff', border: 'none', fontWeight: 800, fontSize: 12, letterSpacing: 0.5,
                  cursor: (addModal.day != null && addModal.slot) ? 'pointer' : 'not-allowed',
                  boxShadow: (addModal.day != null && addModal.slot) ? `0 0 20px ${u.accent.glow}` : 'none',
                }}>★ {u.lang==='tr'?'Rotaya Ekle':'Add to Route'}</button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

// ─── Stylised SVG city map ───────────────────────────────────────
// Generic abstract "old-paper" map: water curve on one side, block grid,
// a winding road / river, and numbered POI pins at each city's x/y %.
function CityMapArt({ palette, pois, dayPois = [], accent, openPoi, onOpenPoi }) {
  const dayIds = new Set(dayPois.map(p => p.id));
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* paper texture base */}
      <div style={{ position: 'absolute', inset: 0, background: palette.land,
        backgroundImage: `
          radial-gradient(circle at 18% 16%, rgba(0,0,0,0.04) 0 60px, transparent 80px),
          radial-gradient(circle at 84% 78%, rgba(0,0,0,0.05) 0 80px, transparent 100px),
          repeating-linear-gradient(0deg, transparent 0 32px, rgba(0,0,0,0.018) 32px 33px)
        `,
      }} />
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {/* sea */}
        <path d="M0 0 L0 220 Q120 200 240 230 Q360 260 460 220 Q540 190 640 230 Q720 260 800 240 L800 0 Z"
          fill={palette.sea} opacity="0.92" />
        <path d="M0 220 Q120 200 240 230 Q360 260 460 220 Q540 190 640 230 Q720 260 800 240"
          stroke={palette.line} strokeWidth="1.5" fill="none" opacity="0.4" />
        {/* secondary water (river) */}
        <path d="M500 600 Q480 520 520 460 Q560 400 540 320 Q520 260 560 200"
          stroke={palette.sea} strokeWidth="22" fill="none" opacity="0.55" strokeLinecap="round" />
        <path d="M500 600 Q480 520 520 460 Q560 400 540 320 Q520 260 560 200"
          stroke={palette.line} strokeWidth="1.2" fill="none" opacity="0.35" strokeDasharray="3 5" />
        {/* block grid — gives the map "city" feel */}
        <g opacity="0.18" stroke={palette.line} strokeWidth="0.8" fill="none">
          {[...Array(14)].map((_,i) => (
            <line key={'h'+i} x1="40" y1={290 + i*22} x2="760" y2={290 + i*22} />
          ))}
          {[...Array(28)].map((_,i) => (
            <line key={'v'+i} x1={40 + i*26} y1="290" x2={40 + i*26} y2="592" />
          ))}
        </g>
        {/* parks */}
        <rect x="120" y="370" width="90" height="60" rx="8" fill="#A8C99A" opacity="0.6" />
        <rect x="600" y="420" width="120" height="80" rx="10" fill="#A8C99A" opacity="0.55" />
        {/* roads — main */}
        <g stroke={palette.line} strokeWidth="2.2" fill="none" opacity="0.45" strokeLinecap="round">
          <path d="M0 360 Q200 340 400 380 T800 360" />
          <path d="M260 600 Q280 460 320 360 Q360 280 400 240" />
          <path d="M680 600 Q660 480 640 380 Q620 300 600 240" />
        </g>
        {/* compass rose, top-right */}
        <g transform="translate(720 90)" opacity="0.5">
          <circle cx="0" cy="0" r="22" fill="none" stroke={palette.line} strokeWidth="1.2" />
          <path d="M0 -24 L4 0 L0 24 L-4 0 Z" fill={palette.line} />
          <path d="M-24 0 L0 4 L24 0 L0 -4 Z" fill={palette.line} opacity="0.5" />
          <text x="0" y="-30" textAnchor="middle" fontFamily="serif" fontSize="11" fill={palette.line} fontStyle="italic">N</text>
        </g>
        {/* legend, bottom-right */}
        <g transform="translate(656 558)" opacity="0.65">
          <text x="0" y="0" fontFamily="serif" fontStyle="italic" fontSize="11" fill={palette.line}>★ 1:25,000</text>
        </g>
      </svg>

      {/* POI pins */}
      {pois.map((p, i) => {
        const isDay = dayIds.has(p.id);
        const isOpen = openPoi === p.id;
        return (
          <button key={p.id} onClick={() => onOpenPoi(isOpen ? null : p.id)}
            style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              transform: 'translate(-50%, -100%)',
              background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
              zIndex: isOpen ? 5 : (isDay ? 4 : 3),
            }}>
            <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                padding: '4px 9px',
                background: isOpen ? accent.bg : (isDay ? accent.fg : 'rgba(10,22,40,0.88)'),
                color: isOpen ? '#fff' : (isDay ? '#0A1628' : '#fff'),
                border: '1.5px solid ' + (isOpen ? '#fff' : (isDay ? accent.bg : 'rgba(255,255,255,0.2)')),
                borderRadius: 6,
                fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 11, letterSpacing: 0.5,
                whiteSpace: 'nowrap',
                boxShadow: isOpen
                  ? `0 0 18px ${accent.glow}, 0 6px 16px rgba(0,0,0,0.35)`
                  : isDay ? `0 6px 14px rgba(0,0,0,0.25)` : '0 4px 10px rgba(0,0,0,0.25)',
                transition: 'all 200ms cubic-bezier(.16,1,.3,1)',
              }}>{i+1}</div>
              <div style={{
                width: 0, height: 0, marginTop: -1,
                borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                borderTop: '7px solid ' + (isOpen ? accent.bg : (isDay ? accent.fg : 'rgba(10,22,40,0.88)')),
              }} />
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: isOpen ? accent.bg : (isDay ? accent.fg : '#0A1628'),
                marginTop: 1,
                boxShadow: isOpen ? `0 0 14px ${accent.glow}` : 'none',
              }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function RouteStop({ u, city, code, date, kind, mile }) {
  const isActive = kind === 'active';
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <div style={{ width: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch' }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%',
          background: isActive ? u.accent.fg : kind === 'end' ? '#fff' : 'transparent',
          border: '2px solid ' + (isActive ? u.accent.fg : 'rgba(255,255,255,0.5)'),
          boxShadow: isActive ? `0 0 10px ${u.accent.glow}` : 'none', flexShrink: 0 }} />
        {kind !== 'end' && <div style={{ flex: 1, width: 1, background: 'rgba(255,255,255,0.18)' }} />}
      </div>
      <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.045)',
        border: '1px solid ' + (isActive ? 'rgba(197,160,89,0.3)' : 'rgba(255,255,255,0.085)'),
        borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: 0.5 }}>{code}</span>
            <span style={{ fontSize: 12, color: '#B2C0D1' }}>{city}</span>
          </div>
          <div style={{ fontSize: 10, color: '#7A8EAF', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{date}</div>
        </div>
        {mile && <MileChip value={`+${mile} mi`} />}
      </div>
    </div>
  );
}

// 07 ─── CO-PILOT — split layout: invite | active sessions ─────
function WebCoPilotScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const toast = useToast();
  const [copied, setCopied] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const pid = 'PT-4830-RM';

  const copy = () => {
    setCopied(true);
    toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Pilot ID kopyalandı':'Pilot ID copied' });
    setTimeout(() => setCopied(false), 1800);
  };
  const sendInvite = () => {
    if (!email) return toast({ type: 'error', icon: '!', children: u.lang==='tr'?'E-posta gerekli':'Email required' });
    toast({ type: 'success', icon: '✈', children: u.lang==='tr'?`Davet ${email} adresine gönderildi`:`Invite sent to ${email}` });
    setEmail('');
  };

  return (
    <PageShell>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />
      <HeroBand
        eyebrow={u.lang==='tr'?'CO-PILOT':'CO-PILOT'}
        title={u.c.coPilot + '.'}
        sub={u.c.coPilotDesc}
        accent={u.accent} height={220}
        bg={`linear-gradient(135deg, #0A1628 0%, ${u.accent.deep} 80%, ${u.accent.bg} 100%)`}
      />
      <div style={{ maxWidth: 1280, margin: '-40px auto 0', padding: '0 32px',
        display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24 }}>
        {/* Pilot ID + email invite */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
            padding: 24, boxShadow: '0 10px 28px rgba(10,22,40,0.10)' }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2.5, color: '#94A3B8' }}>{u.c.inviteCode}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
              <span style={{
                flex: 1, fontFamily: 'var(--font-mono)', fontWeight: 800,
                fontSize: 40, color: '#0A1628', letterSpacing: 4,
                background: '#F3F5F8', border: '1px dashed #CBD5E1',
                borderRadius: 12, padding: '20px 18px', textAlign: 'center',
              }}>{pid}</span>
              <button onClick={copy} style={{
                width: 60, height: 60, borderRadius: 14, border: 'none', cursor: 'pointer',
                background: copied ? '#16A34A' : `${u.accent.bg}14`,
                color: copied ? '#fff' : u.accent.bg,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon name={copied ? 'check' : 'copy'} size={22} /></button>
            </div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 14, lineHeight: 1.6 }}>
              {u.lang==='tr'
                ? 'Bu kimliği paylaşın — rotanız iki cihazda da canlı eşlenecek. Düzenleme yetkisi sizdedir.'
                : 'Share this ID — your route syncs live across both devices. You keep edit control.'}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 22 }}>
            <ThyInput light
              label={u.lang==='tr'?'E-POSTA İLE DAVET ET':'INVITE BY EMAIL'}
              placeholder="mehmet@example.com"
              icon={<Icon name="mail" size={16} />}
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <div style={{ marginTop: 14 }}>
              <ThyButton variant="primary" size="lg" fullWidth icon="✈" onClick={sendInvite}>
                {u.c.sendInvite}
              </ThyButton>
            </div>
          </div>
        </div>

        {/* Active co-pilots */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 22 }}>
          <SectionTitle eyebrow={u.lang==='tr'?'AKTİF':'ACTIVE'} title={u.lang==='tr'?'Yardımcı pilotlar':'Co-pilots'} accent={u.accent} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <CoPilotRowWeb u={u} name="Mehmet K." since={u.lang==='tr'?'2 saat aktif':'Active 2h'} live />
            <CoPilotRowWeb u={u} name="Selin A."  since={u.lang==='tr'?'Dün katıldı':'Joined yesterday'} />
            <CoPilotRowWeb u={u} name="Ege D."    since={u.lang==='tr'?'3 gün önce':'3 days ago'} />
          </div>
          <div style={{
            marginTop: 18, padding: 14, background: 'linear-gradient(135deg, #FAF6E9 0%, #F4EBD9 100%)',
            border: '1px solid #C5A05955', borderRadius: 10,
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#9B7E3D' }}>{u.lang==='tr'?'İPUCU':'TIP'}</div>
            <div style={{ fontSize: 13, color: '#0A1628', marginTop: 4, lineHeight: 1.5 }}>
              {u.lang==='tr'
                ? 'Co-Pilot ile rotanız canlı eşlenir. Tarayıcı sekmesi açıkken birlikte düzenleyebilirsiniz.'
                : 'Co-Pilot syncs your route live. With both tabs open you can edit together.'}
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: 60 }} />
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}
function CoPilotRowWeb({ u, name, since, live }) {
  return (
    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12,
      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 42, height: 42, borderRadius: '50%',
        background: `linear-gradient(135deg, ${u.accent.bg}, ${u.accent.deep})`,
        color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 16 }}>{name[0]}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0A1628' }}>{name}</div>
        <div style={{ fontSize: 11.5, color: '#64748B' }}>{since}</div>
      </div>
      {live
        ? <ThyBadge variant="status">{u.lang==='tr'?'CANLI':'LIVE'}</ThyBadge>
        : <Icon name="chevR" size={16} color="#94A3B8" />}
    </div>
  );
}

// 08 ─── MILES & SMILES — gold card hero + tabs + partner grid ──
function WebMilesScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: true });
  const [tab, setTab] = React.useState('overview');
  const [cat, setCat] = React.useState('all');
  return (
    <PageShell dark style={{ background: 'linear-gradient(180deg, #050B14 0%, #0A1628 40%, #0F2244 100%)' }}>
      <WebTopNav active="ms" onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} dark />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px',
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        {/* Gold card */}
        <div style={{ position: 'relative', overflow: 'hidden', padding: '32px 32px 28px',
          borderRadius: 18, color: '#0A1628',
          background: 'linear-gradient(135deg, #E8C97A 0%, #C5A059 35%, #A0813C 75%, #C5A059 100%)',
          boxShadow: '0 14px 36px rgba(197,160,89,0.36), 0 1px 0 rgba(255,255,255,0.3) inset' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '-30%', width: '40%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
            transform: 'skewX(-20deg)' }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3 }}>ELITE PLUS · TK</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 800, letterSpacing: -0.5, marginTop: 8 }}>
                Aylin Kaya
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: 2, marginTop: 4, opacity: 0.7 }}>
                4218 ····  ····  2107
              </div>
            </div>
            <Crane dark={false} size={36} />
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginTop: 36 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, opacity: 0.7 }}>{u.c.miles.toUpperCase()}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 44, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>
                87.420
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, opacity: 0.7 }}>{u.lang==='tr'?'STATÜ':'STATUS'}</div>
              <div style={{ fontWeight: 800, fontSize: 16, marginTop: 4 }}>{u.lang==='tr'?'12.580 mil ile ELITE':'12,580 mi to ELITE'}</div>
              <div style={{ marginTop: 8, height: 6, background: 'rgba(0,0,0,0.15)', borderRadius: 3, overflow: 'hidden', width: 200, marginLeft: 'auto' }}>
                <div style={{ width: '64%', height: '100%', background: '#0A1628' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick earn */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { i: 'plane', l: u.lang==='tr'?'Uçuş':'Flight',  v: '+2.840' },
            { i: 'bed',   l: u.lang==='tr'?'Otel':'Hotel',   v: '+500' },
            { i: 'car',   l: u.lang==='tr'?'Araç':'Car',     v: '+125' },
            { i: 'coffee', l: u.lang==='tr'?'Yeme':'Dine',   v: '+80' },
          ].map(o => (
            <div key={o.i} style={{
              padding: '16px 16px', borderRadius: 12,
              background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.085)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ width: 38, height: 38, borderRadius: 10,
                background: `${u.accent.fg}22`, color: u.accent.fg,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={o.i} size={18} />
              </span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{o.l}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: u.accent.fg, fontWeight: 700 }}>{o.v} mi</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TKPAY bridge banner */}
      <div style={{ maxWidth: 1280, margin: '8px auto 0', padding: '0 32px' }}>
        <button onClick={() => nav('tkpay')} style={{
          width: '100%', padding: '18px 22px', cursor: 'pointer',
          background: `
            linear-gradient(135deg, rgba(197,160,89,0.18) 0%, rgba(197,160,89,0.04) 70%),
            rgba(255,255,255,0.045)
          `,
          border: '1px solid rgba(197,160,89,0.4)',
          borderRadius: 14, color: '#fff', fontFamily: u.font,
          display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left',
          boxShadow: '0 0 22px rgba(197,160,89,0.15)',
          transition: 'all 220ms cubic-bezier(.16,1,.3,1)',
        }}>
          <span style={{
            width: 52, height: 52, borderRadius: 13, flexShrink: 0,
            background: 'linear-gradient(135deg, #F2D78B, #C5A059)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#0A1628',
            boxShadow: '0 6px 18px rgba(197,160,89,0.4)',
          }}>
            <Icon name="wallet" size={24} strokeWidth={2.5} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 2.5, color: '#C5A059',
            }}>TKPAY · {u.lang === 'tr' ? 'CÜZDAN & ÖDEME' : 'WALLET & PAYMENTS'}</div>
            <div style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18,
              color: '#fff', letterSpacing: -0.2, marginTop: 4,
            }}>{u.lang === 'tr' ? 'Millerini TL\'ye dönüştür, her yerde özgürce harca' : 'Convert your miles to TL and spend anywhere'}</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, color: '#B2C0D1',
              marginTop: 4, letterSpacing: 0.3,
            }}>87.420 mi → <span style={{ color: '#C5A059', fontWeight: 700 }}>13.113 TL</span> · 1 mi ≈ 0,15 TL</div>
          </div>
          <span style={{
            padding: '10px 18px', borderRadius: 10,
            background: 'linear-gradient(135deg, #E8C97A, #C5A059)',
            color: '#0A1628', fontWeight: 800, fontSize: 13, letterSpacing: 0.3,
            boxShadow: '0 6px 18px rgba(197,160,89,0.4)', flexShrink: 0,
          }}>{u.lang === 'tr' ? 'TKPAY Cüzdan' : 'TKPAY Wallet'} →</span>
        </button>
      </div>

      {/* Tabs + partners */}
      <div style={{ maxWidth: 1280, margin: '8px auto 0', padding: '0 32px' }}>
        <ThyTabs value={tab} onChange={setTab} items={[
          { id: 'overview', label: u.lang==='tr'?'GENEL':'OVERVIEW' },
          { id: 'partners', label: u.lang==='tr'?'PARTNERLER':'PARTNERS' },
          { id: 'history',  label: u.lang==='tr'?'GEÇMİŞ':'HISTORY' },
        ]} />

        <div style={{ display: 'flex', gap: 8, margin: '20px 0', flexWrap: 'wrap' }}>
          <ThyChip active={cat==='all'}    onClick={() => setCat('all')}>{u.lang==='tr'?'Tümü':'All'}</ThyChip>
          <ThyChip active={cat==='hotel'}  onClick={() => setCat('hotel')} icon={<Icon name="bed" size={12} />}>{u.lang==='tr'?'Konaklama':'Hotels'}</ThyChip>
          <ThyChip active={cat==='car'}    onClick={() => setCat('car')} icon={<Icon name="car" size={12} />}>{u.lang==='tr'?'Araç':'Cars'}</ThyChip>
          <ThyChip active={cat==='vip'}    onClick={() => setCat('vip')} icon={<Icon name="shield" size={12} />}>{u.lang==='tr'?'VIP Transfer':'VIP'}</ThyChip>
          <ThyChip active={cat==='lounge'} onClick={() => setCat('lounge')} icon={<Icon name="coffee" size={12} />}>{u.lang==='tr'?'Lounge':'Lounge'}</ThyChip>
          <ThyChip active={cat==='wifi'}   onClick={() => setCat('wifi')} icon={<Icon name="wifi" size={12} />}>{u.lang==='tr'?'Hizmetler':'Services'}</ThyChip>
          <ThyChip active={cat==='bank'}   onClick={() => setCat('bank')} icon={<Icon name="cardIcon" size={12} />}>{u.lang==='tr'?'Banka':'Bank'}</ThyChip>
          <ThyChip active={cat==='dining'} onClick={() => setCat('dining')} icon={<Icon name="coffee" size={12} />}>{u.lang==='tr'?'Yeme':'Dining'}</ThyChip>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {/* ─── Konaklama ─── */}
          <PartnerItem name="Marriott Bonvoy"      offer={u.lang==='tr'?'Konaklama başına 600 Mil':'600 mi per stay'}        icon={<Icon name="bed" size={16} />}      actionLabel={u.lang==='tr'?'Haritada Bul':'Find'} />
          <PartnerItem name="Hilton Honors"        offer={u.lang==='tr'?'Konaklama başına 500 Mil':'500 mi per stay'}        icon={<Icon name="bed" size={16} />}      actionLabel={u.lang==='tr'?'Haritada Bul':'Find'} />
          <PartnerItem name="ALL · Accor"          offer={u.lang==='tr'?'%15 + 550 Mil/gece':'15% + 550 mi/night'}            icon={<Icon name="bed" size={16} />}      actionLabel={u.lang==='tr'?'Aktifleştir':'Activate'} />
          <PartnerItem name="Rixos Hotels"         offer={u.lang==='tr'?'Konaklama başına 700 Mil':'700 mi per stay'}        icon={<Icon name="bed" size={16} />}      actionLabel={u.lang==='tr'?'Haritada Bul':'Find'} />
          <PartnerItem name="IHG One Rewards"      offer={u.lang==='tr'?'Konaklama başına 650 Mil':'650 mi per stay'}        icon={<Icon name="bed" size={16} />}      actionLabel={u.lang==='tr'?'Aktifleştir':'Activate'} />
          <PartnerItem name="Booking.com"          offer={u.lang==='tr'?'Konaklama başına %5 mil iadesi':'5% miles back'}    icon={<Icon name="bed" size={16} />}      actionLabel={u.lang==='tr'?'Aktifleştir':'Activate'} />
          <PartnerItem name="Rocketmiles"          offer={u.lang==='tr'?'Rezervasyon başına 1.500 Mil':'1,500 mi per booking'} icon={<Icon name="bed" size={16} />}    actionLabel={u.lang==='tr'?'Aktifleştir':'Activate'} />
          <PartnerItem name="HalalBooking"         offer={u.lang==='tr'?'Rezervasyon başına 700 Mil':'700 mi per booking'}  icon={<Icon name="bed" size={16} />}      actionLabel={u.lang==='tr'?'Aktifleştir':'Activate'} />
          <PartnerItem name="Kaligo"               offer={u.lang==='tr'?'Rezervasyon başına 1.800 Mil':'1,800 mi per booking'} icon={<Icon name="bed" size={16} />}    actionLabel={u.lang==='tr'?'Aktifleştir':'Activate'} />
          {/* ─── Araç Kiralama ─── */}
          <PartnerItem name="Avis"                 offer={u.lang==='tr'?'Kiralama başına min. 125 Mil':'min. 125 mi per rental'} icon={<Icon name="car" size={16} />} actionLabel={u.lang==='tr'?'Haritada Bul':'Find'} />
          <PartnerItem name="Budget"               offer={u.lang==='tr'?'Kiralama başına min. 110 Mil':'min. 110 mi per rental'} icon={<Icon name="car" size={16} />} actionLabel={u.lang==='tr'?'Aktifleştir':'Activate'} />
          <PartnerItem name="Enterprise"           offer={u.lang==='tr'?'Kiralama başına min. 130 Mil':'min. 130 mi per rental'} icon={<Icon name="car" size={16} />} actionLabel={u.lang==='tr'?'Aktifleştir':'Activate'} />
          <PartnerItem name="Sixt"                 offer={u.lang==='tr'?'Kiralama başına min. 140 Mil':'min. 140 mi per rental'} icon={<Icon name="car" size={16} />} actionLabel={u.lang==='tr'?'Haritada Bul':'Find'} />
          {/* ─── VIP Transfer / Lounge / Hizmetler ─── */}
          <PartnerItem name="ProGo VIP Transfer"   offer={u.lang==='tr'?'Tek yön 950 Mil':'950 mi per one-way'}              icon={<Icon name="shield" size={16} />}   actionLabel={u.lang==='tr'?'Haritada Bul':'Find'} />
          <PartnerItem name="Plaza Premium Lounge" offer={u.lang==='tr'?'Lounge başına 400 Mil':'400 mi per lounge'}        icon={<Icon name="coffee" size={16} />}   actionLabel={u.lang==='tr'?'Haritada Bul':'Find'} />
          <PartnerItem name="Airport WiFi Rentals" offer={u.lang==='tr'?'Kiralama başına 100 Mil':'100 mi per rental'}      icon={<Icon name="wifi" size={16} />}     actionLabel={u.lang==='tr'?'Aktifleştir':'Activate'} />
          {/* ─── Finans / Dining ─── */}
          <PartnerItem name="Garanti BBVA"         offer={u.lang==='tr'?'Her 5 TL\'ye 1 Mil':'1 mi per 5 TL'}                icon={<Icon name="cardIcon" size={16} />} actionLabel={u.lang==='tr'?'Aktifleştir':'Activate'} />
          <PartnerItem name="Divan Brasserie"      offer={u.lang==='tr'?'%10 + 200 Mil/menü':'10% + 200 mi/menu'}            icon={<Icon name="coffee" size={16} />}   actionLabel={u.lang==='tr'?'Haritada Bul':'Find'} />
        </div>
      </div>
      <div style={{ height: 60 }} />
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}

// 09 ─── NOTIFICATIONS — full-width list w/ filter sidebar ─────
function WebNotificationsScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const toast = useToast();
  const [filter, setFilter] = React.useState('all');

  const items = [
    { id: 1, group: 'today',   tint: u.accent, icon: 'plane', title: u.lang==='tr'?'TK 1853 için biniş açıldı':'Boarding open for TK 1853', body: u.lang==='tr'?'Kapı A12 · 14:25 kalkış':'Gate A12 · departs 14:25', time: '12dk', unread: true, kind: 'flight' },
    { id: 2, group: 'today',   tint: { bg: '#C5A059', fg: '#C5A059' }, icon: 'star', title: u.lang==='tr'?'2.840 Mil hesabınıza eklendi':'2,840 miles added', body: u.lang==='tr'?'TK 1721 uçuşunuzdan':'Earned from TK 1721', time: '1sa', unread: true, kind: 'miles' },
    { id: 3, group: 'today',   tint: { bg: '#16A34A', fg: '#16A34A' }, icon: 'link', title: u.lang==='tr'?'Mehmet rotanıza katıldı':'Mehmet joined your route', body: 'TRIP-0042 · Roma + Antalya', time: '3sa', unread: true, kind: 'social' },
    { id: 4, group: 'earlier', tint: { bg: '#0053A5', fg: '#0053A5' }, icon: 'bell', title: u.lang==='tr'?'IST → AMS fiyat alarmı tetiklendi':'IST → AMS price alert triggered', body: '4.890 TL · ↓ 750 TL', time: u.lang==='tr'?'Dün':'Yesterday', kind: 'flight' },
    { id: 5, group: 'earlier', tint: { bg: '#94A3B8', fg: '#64748B' }, icon: 'shield', title: u.lang==='tr'?'Pasaport süresi 90 gün':'Passport expires in 90 days', body: u.lang==='tr'?'Belgeleriniz seyahat için uygun':'Documents valid for travel', time: '03 Haz', kind: 'flight' },
  ];
  const visible = items.filter(i => filter === 'all' || i.kind === filter);
  const today = visible.filter(i => i.group === 'today');
  const earlier = visible.filter(i => i.group === 'earlier');

  return (
    <PageShell>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px',
        display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
        <aside style={{ height: 'fit-content' }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#64748B', marginBottom: 12 }}>{u.lang==='tr'?'FİLTRELER':'FILTERS'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { id: 'all',    l: u.lang==='tr'?'Tümü':'All',    c: items.length },
              { id: 'flight', l: u.lang==='tr'?'Uçuş':'Flight', c: items.filter(i => i.kind === 'flight').length },
              { id: 'miles',  l: u.c.miles,                     c: items.filter(i => i.kind === 'miles').length },
              { id: 'social', l: u.lang==='tr'?'Sosyal':'Social', c: items.filter(i => i.kind === 'social').length },
            ].map(o => (
              <button key={o.id} onClick={() => setFilter(o.id)} style={{
                padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: filter === o.id ? `${u.accent.bg}14` : 'transparent',
                color: filter === o.id ? u.accent.bg : '#0A1628', textAlign: 'left',
                fontWeight: filter === o.id ? 700 : 500, fontSize: 13,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span>{o.l}</span>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>{o.c}</span>
              </button>
            ))}
          </div>
          <button onClick={() => toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Tümü okundu sayıldı':'Marked all as read' })} style={{
            marginTop: 20, width: '100%', padding: '10px 14px',
            background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10,
            cursor: 'pointer', color: u.accent.bg, fontWeight: 700, fontSize: 12,
          }}>{u.lang==='tr'?'Tümünü okundu say':'Mark all as read'}</button>
        </aside>

        <div>
          <SectionTitle title={u.c.notifications} eyebrow={visible.filter(i => i.unread).length + ' ' + (u.lang==='tr'?'okunmamış':'unread')} accent={u.accent} />
          {today.length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#64748B', margin: '6px 0 10px' }}>
                {u.c.today.toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                {today.map(n => <NotifRowWeb key={n.id} n={n} u={u} />)}
              </div>
            </>
          )}
          {earlier.length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#64748B', margin: '6px 0 10px' }}>
                {u.c.earlier.toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {earlier.map(n => <NotifRowWeb key={n.id} n={n} u={u} />)}
              </div>
            </>
          )}
        </div>
      </div>
      <div style={{ height: 60 }} />
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}
function NotifRowWeb({ n, u }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
      padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14,
      boxShadow: n.unread ? '0 4px 14px rgba(10,22,40,0.06)' : 'none', position: 'relative' }}>
      {n.unread && <span style={{ position: 'absolute', top: 16, right: 16, width: 8, height: 8, borderRadius: '50%', background: u.accent.bg }} />}
      <span style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: `${n.tint.bg}1A`, color: n.tint.fg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={n.icon} size={20} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#0A1628' }}>{n.title}</div>
        <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 2, lineHeight: 1.4 }}>{n.body}</div>
        <div style={{ fontSize: 10.5, color: '#94A3B8', fontFamily: 'var(--font-mono)', letterSpacing: 0.5, marginTop: 6 }}>{n.time}</div>
      </div>
    </div>
  );
}

// 10 ─── PROFILE — sidebar + content with tabs ─────────────────
function WebProfileScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const toast = useToast();
  const [tab, setTab] = React.useState('account');
  const [pnrOpen, setPnrOpen] = React.useState(false);
  return (
    <PageShell style={{ position: 'relative' }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />
      <HeroBand
        eyebrow={u.lang==='tr'?'HESAP':'ACCOUNT'}
        title="Aylin Kaya"
        sub={null}
        accent={u.accent} height={200}
      >
        <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
          <ThyBadge variant="gold">✦ ELITE PLUS · 87.420 mi</ThyBadge>
          <ThyBadge variant="mono">aylin.kaya@example.com</ThyBadge>
        </div>
      </HeroBand>

      {/* KPI strip */}
      <div style={{ maxWidth: 1280, margin: '-30px auto 0', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <KPIStat label={u.lang==='tr'?'Uçuş':'Flights'}     value="42"   accent={u.accent} />
          <KPIStat label={u.lang==='tr'?'Ülke':'Countries'}   value="18"   accent={u.accent} />
          <KPIStat label={u.lang==='tr'?'Mil':'Miles'}        value="87,4K" accent={u.accent} />
          <KPIStat label={u.lang==='tr'?'Co-pilot':'Co-pilots'} value="3"   accent={u.accent} />
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '32px auto 0', padding: '0 32px',
        display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
        <aside>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { id: 'account', l: u.lang==='tr'?'Hesap':'Account', i: 'user' },
              { id: 'preferences', l: u.lang==='tr'?'Tercihler':'Preferences', i: 'edit' },
              { id: 'security', l: u.lang==='tr'?'Güvenlik':'Security', i: 'shield' },
            ].map(o => (
              <button key={o.id} onClick={() => setTab(o.id)} style={{
                padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: tab === o.id ? `${u.accent.bg}14` : 'transparent',
                color: tab === o.id ? u.accent.bg : '#0A1628', textAlign: 'left',
                fontWeight: tab === o.id ? 700 : 500, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Icon name={o.i} size={15} />
                {o.l}
              </button>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #E2E8F0', marginTop: 16, paddingTop: 16,
            display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { id: 'history',    l: u.lang==='tr'?'Uçuş geçmişi':'Flight history', i: 'history' },
              { id: 'travelPrefs',l: u.lang==='tr'?'Seyahat Tercihleri':'Travel preferences', i: 'edit' },
              { id: 'lounge',     l: 'Lounge', i: 'coffee' },
              { id: 'priceAlert', l: u.lang==='tr'?'Fiyat alarmı':'Price alert', i: 'bell' },
              { id: 'help',       l: u.lang==='tr'?'Yardım':'Help', i: 'headset' },
            ].map(o => (
              <button key={o.id} onClick={() => nav(o.id)} style={{
                padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'transparent', color: '#64748B', textAlign: 'left',
                fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Icon name={o.i} size={14} />
                {o.l}
                <Icon name="chevR" size={12} color="#94A3B8" style={{ marginLeft: 'auto' }} />
              </button>
            ))}
          </div>
        </aside>

        <div>
          {tab === 'account' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Seyahat Tercihleri — featured card (yeni #28) */}
              <button onClick={() => nav('travelPrefs')} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                padding: '18px 20px', cursor: 'pointer',
                background: 'linear-gradient(135deg, #FAFAF6 0%, #F1ECDF 100%)',
                border: '1px solid #C5A05955', borderRadius: 12,
                boxShadow: '0 4px 14px rgba(197,160,89,0.12)',
                fontFamily: 'inherit', textAlign: 'left',
                transition: 'all 200ms cubic-bezier(.16,1,.3,1)',
              }}>
                <span style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                  background: 'linear-gradient(135deg, #B7312C 0%, #8E211D 100%)',
                  color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                  boxShadow: '0 8px 20px rgba(183,49,44,0.28)',
                }}>✦</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#0A1628' }}>
                      {u.lang === 'tr' ? 'Seyahat Tercihleri' : 'Travel Preferences'}
                    </span>
                    {thyHasPrefs && thyHasPrefs() && (
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 800,
                        background: '#0E7A5F15', color: '#0E7A5F', padding: '2px 7px',
                        borderRadius: 4, letterSpacing: 1.5,
                      }}>{u.lang === 'tr' ? 'AÇIK' : 'ON'}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.45 }}>
                    {u.lang === 'tr'
                      ? 'Hız, ilgi alanları, bütçe — rotalarınız bu tercihlere göre özelleştirilir.'
                      : 'Pace, interests, budget — your routes get tailored to these.'}
                  </div>
                </div>
                <Icon name="chevR" size={14} color="#94A3B8" />
              </button>

              <PanelBlock title={u.lang==='tr'?'Kişisel bilgi':'Personal info'}>
                <FormRow label={u.lang==='tr'?'Ad Soyad':'Full name'} value="Aylin Kaya" />
                <FormRow label="E-posta" value="aylin.kaya@example.com" />
                <FormRow label={u.lang==='tr'?'Telefon':'Phone'} value="+90 555 432 18 76" />
                <FormRow label={u.lang==='tr'?'Doğum tarihi':'Birth date'} value="12.03.1991" />
              </PanelBlock>
              <PanelBlock title={u.lang==='tr'?'Rezervasyon bağlama':'Booking link'}>
                <button onClick={() => setPnrOpen(true)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', background: 'linear-gradient(135deg, #FAF6E9 0%, #F4EBD9 100%)',
                  border: '1px solid #C5A05955', borderRadius: 10, cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left',
                }}>
                  <span style={{
                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                    background: '#C5A059', color: '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(197,160,89,0.32)',
                  }}><Icon name="plane" size={18} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#0A1628' }}>
                        {u.lang==='tr' ? 'Rezervasyonu hesabıma ekle' : 'Link a booking to my account'}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 800,
                        letterSpacing: 1.5, color: '#9B7E3D',
                        background: 'rgba(197,160,89,0.22)',
                        padding: '2px 7px', borderRadius: 4,
                      }}>PNR</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                      {u.lang==='tr'
                        ? 'Acente üzerinden alınan veya hediye edilen biletleri PNR ile bağlayın'
                        : 'Link tickets bought via agency or received as a gift, using the PNR code'}
                    </div>
                  </div>
                  <span style={{ color: u.accent.bg, fontWeight: 800, fontSize: 12 }}>
                    {u.lang==='tr'?'Aç':'Open'} →
                  </span>
                </button>
              </PanelBlock>
              <PanelBlock title={u.lang==='tr'?'Kayıtlı Rotalarım':'Saved Routes'}>
                <button onClick={() => nav('routes')} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                  background: 'transparent', border: '1px solid #E2E8F0',
                  padding: '14px 16px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                }}>
                  <span style={{
                    width: 40, height: 40, borderRadius: 10, background: '#B7312C',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', boxShadow: '0 0 14px rgba(183,49,44,0.30)',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.1 8.6 22 9.3 17 14.1 18.5 21 12 17.3 5.5 21 7 14.1 2 9.3 8.9 8.6 12 2"/></svg>
                  </span>
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0A1628' }}>
                      {u.lang === 'tr' ? '3 kayıtlı rota' : '3 saved routes'}
                    </span>
                    <span style={{ fontSize: 11, color: '#64748B' }}>
                      {u.lang === 'tr' ? '1 rota ödeme bekliyor · son güncelleme 2 dk önce' : '1 route awaiting payment · updated 2m ago'}
                    </span>
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1.4, fontWeight: 800, color: '#B7312C' }}>
                    {u.lang === 'tr' ? 'AÇ →' : 'OPEN →'}
                  </span>
                </button>
              </PanelBlock>
              <PanelBlock title={u.lang==='tr'?'Ödeme yöntemleri':'Payment methods'}>
                <PayRow brand="VISA" last="4218" name="A. KAYA · 08/27" />
                <PayRow brand="MC"   last="9930" name="A. KAYA · 11/26" />
                <button style={{ background: 'transparent', border: '1px dashed #CBD5E1',
                  padding: '12px 16px', borderRadius: 10, cursor: 'pointer', color: u.accent.bg,
                  fontSize: 12, fontWeight: 700, marginTop: 6 }}>+ {u.lang==='tr'?'Yeni kart ekle':'Add new card'}</button>
              </PanelBlock>
              <PanelBlock title={u.lang==='tr'?'Pasaport & belgeler':'Passport & documents'}>
                <FormRow label="Passport" value="U 12 345 678 · 90 days valid" />
                <FormRow label={u.lang==='tr'?'Ehliyet':'Driver license'} value={u.lang==='tr'?'Yüklenmedi':'Not uploaded'} />
              </PanelBlock>
            </div>
          )}
          {tab === 'preferences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PanelBlock title={u.lang==='tr'?'Dil & bölge':'Language & region'}>
                <FormRow label={u.c.language} value={u.lang==='tr'?'Türkçe (TR)':'English (EN)'} />
                <FormRow label={u.lang==='tr'?'Para birimi':'Currency'} value="TRY ₺" />
                <FormRow label={u.lang==='tr'?'Bölge':'Region'} value="Avrupa · İstanbul" />
              </PanelBlock>
              <PanelBlock title={u.lang==='tr'?'Bildirimler':'Notifications'}>
                <FormRow label="E-posta" value={u.lang==='tr'?'Açık · uçuş & mil':'On · flight & miles'} />
                <FormRow label="SMS"     value={u.lang==='tr'?'Sadece kritik':'Critical only'} />
                <FormRow label="Push"    value={u.lang==='tr'?'Tüm bildirimler':'All notifications'} />
              </PanelBlock>
            </div>
          )}
          {tab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PanelBlock title="Login">
                <FormRow label={u.lang==='tr'?'Parola':'Password'} value={u.lang==='tr'?'12 gün önce değiştirildi':'Changed 12 days ago'} />
                <FormRow label="2FA" value={u.lang==='tr'?'Authenticator + SMS':'Authenticator + SMS'} />
              </PanelBlock>
              <PanelBlock title={u.lang==='tr'?'Cihazlar':'Devices'}>
                <FormRow label="MacBook Pro · Safari" value={u.lang==='tr'?'Şu an aktif':'Active now'} />
                <FormRow label="iPhone 15 · Safari" value={u.lang==='tr'?'2 saat önce':'2 hours ago'} />
              </PanelBlock>
              <PanelBlock title={u.c.privacy}>
                <FormRow label={u.lang==='tr'?'KVKK / veri tercihleri':'Data preferences'} value={u.lang==='tr'?'Yönet →':'Manage →'} />
                <FormRow label={u.lang==='tr'?'Veri indir':'Download data'} value="JSON · CSV" />
              </PanelBlock>
            </div>
          )}
          <div style={{ marginTop: 24 }}>
            <ThyButton variant="secondary" size="md" icon="↩" onClick={() => toast({ type: 'info', icon: '⚠', children: u.lang==='tr'?'Çıkış yapıldı':'Signed out' })}>
              {u.c.signOut}
            </ThyButton>
          </div>
        </div>
      </div>
      <div style={{ height: 60 }} />
      <WebFooter lang={u.lang} accent={u.accent} />

      <PNRModal open={pnrOpen} onClose={() => setPnrOpen(false)}
        lang={u.lang} accent={u.accent} nav={nav} />
    </PageShell>
  );
}
function PanelBlock({ title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 22 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#0A1628', marginBottom: 14 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  );
}
function FormRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 12px', background: '#F8FAFC', borderRadius: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#0A1628' }}>{value}</span>
    </div>
  );
}
function PayRow({ brand, last, name }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 12px', background: '#F8FAFC', borderRadius: 8 }}>
      <div style={{ width: 44, height: 28, background: brand === 'VISA' ? '#1A1F71' : '#EB001B',
        color: '#fff', borderRadius: 4, fontWeight: 800, fontSize: 11, letterSpacing: 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        fontStyle: brand === 'VISA' ? 'italic' : 'normal' }}>{brand}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: '#0A1628' }}>•••• {last}</div>
        <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{name}</div>
      </div>
      <Icon name="chevR" size={14} color="#94A3B8" />
    </div>
  );
}

Object.assign(window, {
  WebMapScreen, WebCoPilotScreen, WebMilesScreen, WebNotificationsScreen, WebProfileScreen,
});
