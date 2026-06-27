// screens-b.jsx — Map/Route, CoPilot, MS, Notifications, Profile

// ═══════════════════════════════════════════════════════════
// 6) ROTA — destination city guide (mobile mirror of WebMapScreen)
// ───────────────────────────────────────────────────────────
// Real Leaflet city map + numbered POI pins + day tabs (1/2/3/Keşfet)
// + collapsible itinerary list. Day 1 plan respects the actual flight
// arrival time (arrival → hotel → activity slots). POI flyout slides
// up from the bottom when a marker or list row is tapped.
// ═══════════════════════════════════════════════════════════
function MapScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: true });
  const topPad = k === 'ios' ? 50 : 14;
  const toast = useToast();
  const [booking, , h] = useBooking();
  const destCode = booking.toCode || 'FCO';
  const dest = (typeof getDestination === 'function') ? getDestination(destCode) : null;
  const fromC = h.from || (typeof findCity === 'function' && findCity('IST')) || { code: 'IST', city: 'İstanbul' };
  const toC = h.to || (typeof findCity === 'function' && findCity(destCode)) || { code: destCode, city: destCode };

  const [dayIx, setDayIx] = React.useState(0);              // 0 | 1 | 2 | 'discover'
  const [openPoi, setOpenPoi] = React.useState(null);       // POI id for bottom-sheet
  const [discoverCat, setDiscoverCat] = React.useState('restaurant');
  const [clickedPoint, setClickedPoint] = React.useState(null);
  const [noteDraft, setNoteDraft] = React.useState('');
  // ✦ Miles&Smiles rota entegrasyonu
  const [msMapActive, setMsMapActive] = React.useState(false);   // harita altın toggle
  const [msOnly, setMsOnly] = React.useState(false);             // Keşfet ¶ Sadece M&S
  const msCount = (typeof getMSPartners === 'function') ? getMSPartners(destCode || (booking.toCode || 'FCO')).length : 0;
  const reserveMS = (partner) => {
    if (!partner) return;
    const verb = {
      stay:    u.lang === 'tr' ? 'otel'      : 'hotel',
      car:     u.lang === 'tr' ? 'araç'      : 'car',
      finance: u.lang === 'tr' ? 'kart'      : 'card',
      vip:     u.lang === 'tr' ? 'transfer'  : 'transfer',
      dining:  u.lang === 'tr' ? 'masa'      : 'table',
    }[partner.cat] || (u.lang === 'tr' ? 'rezervasyon' : 'reservation');
    toast && toast({ type: 'success', icon: '✦', children: u.lang === 'tr'
      ? `M&S üzerinden ${partner.brand} ${verb} rezervasyonuna yönlendiriliyorsun…`
      : `Redirecting to M&S for ${partner.brand} ${verb}…` });
    setOpenPoi(null);
    setTimeout(() => nav('ms'), 900);
  };
  const [shareOpen, setShareOpen] = React.useState(false);
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [cityPickerOpen, setCityPickerOpen] = React.useState(false);

  // Popüler destinasyonlar — WEB_DESTS'teki tüm şehirler
  const QUICK_DESTS = [
    { code: 'FCO', city: 'Roma',      flag: '🇮🇹', region: u.lang==='tr'?'Avrupa':'Europe' },
    { code: 'CDG', city: 'Paris',     flag: '🇫🇷', region: u.lang==='tr'?'Avrupa':'Europe' },
    { code: 'LHR', city: 'Londra',    flag: '🇬🇧', region: u.lang==='tr'?'Avrupa':'Europe' },
    { code: 'BER', city: 'Berlin',    flag: '🇩🇪', region: u.lang==='tr'?'Avrupa':'Europe' },
    { code: 'AMS', city: 'Amsterdam', flag: '🇳🇱', region: u.lang==='tr'?'Avrupa':'Europe' },
    { code: 'ATH', city: 'Atina',     flag: '🇬🇷', region: u.lang==='tr'?'Avrupa':'Europe' },
    { code: 'DXB', city: 'Dubai',     flag: '🇦🇪', region: u.lang==='tr'?'Orta Doğu':'Middle East' },
    { code: 'JFK', city: 'New York',  flag: '🇺🇸', region: u.lang==='tr'?'Amerika':'Americas' },
    { code: 'BKK', city: 'Bangkok',   flag: '🇹🇭', region: u.lang==='tr'?'Asya':'Asia' },
    { code: 'IST', city: 'İstanbul',  flag: '🇹🇷', region: u.lang==='tr'?'Türkiye':'Turkey' },
    { code: 'GNY', city: 'Şanlıurfa', flag: '🇹🇷', region: u.lang==='tr'?'Türkiye':'Turkey' },
    { code: 'NAV', city: 'Nevşehir',  flag: '🇹🇷', region: u.lang==='tr'?'Türkiye':'Turkey' },
    { code: 'AYT', city: 'Antalya',   flag: '🇹🇷', region: u.lang==='tr'?'Türkiye':'Turkey' },
    { code: 'ADB', city: 'İzmir',     flag: '🇹🇷', region: u.lang==='tr'?'Türkiye':'Turkey' },
    { code: 'TZX', city: 'Trabzon',   flag: '🇹🇷', region: u.lang==='tr'?'Türkiye':'Turkey' },
    { code: 'RZE', city: 'Rize',      flag: '🇹🇷', region: u.lang==='tr'?'Türkiye':'Turkey' },
  ];
  const edits = (typeof useRouteEdits === 'function') ? useRouteEdits(destCode) : { state: {}, isDeleted: () => false, addCustom: () => {}, getNote: () => '', addNote: () => {}, deleteNote: () => {} };
  const collab = (typeof useRouteCollab === 'function') ? useRouteCollab(destCode, edits) : null;
  const me = collab?.me;
  const shareLink = (u.lang === 'tr' ? 'thy-route.app/r/' : 'thy-route.app/r/') + (collab?.pilotId || destCode);
  const tripTitle = `${fromC.code} → ${toC.code} · ${dest?.city || destCode}`;

  // Reset draft to the saved note whenever the user opens a different POI sheet,
  // so editing one stop never bleeds into another.
  React.useEffect(() => {
    if (openPoi) setNoteDraft(edits.getNote?.(openPoi) || '');
    else setNoteDraft('');
  }, [openPoi]);

  // Defensive: if the destinations module didn't load, fall back to a notice screen.
  if (!dest || !Array.isArray(dest.days) || !Array.isArray(dest.pois)) {
    return (
      <div className="thy-screen is-dark screen-enter" style={{
        minHeight: '100%', background: '#050B14', color: '#fff',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 24, fontFamily: u.font,
      }}>
        <Icon name="location" size={32} color={u.accent.fg} />
        <div style={{ marginTop: 12, fontSize: 13, color: '#B2C0D1', textAlign: 'center' }}>
          {u.lang === 'tr' ? 'Rota verisi yüklenemedi.' : 'Route data failed to load.'}
        </div>
      </div>
    );
  }

  const day = (typeof dayIx === 'number') ? dest.days[dayIx] : dest.days[0];
  const activePois = dest.pois.filter(p => !edits.isDeleted?.(p.id));
  const customPois = edits.state?.c || [];

  // ─ Flight context (mirrors WebMapScreen day-1 timing rules) ───
  const out = booking.outbound || (() => {
    const seed = (fromC.code + toC.code).split('').reduce((s, ch) => s + ch.charCodeAt(0), 0);
    const arrMin = ((seed * 7) + 230 + ((typeof durationFor === 'function' ? durationFor(fromC.code, toC.code).totalMin : 150))) % (24*60);
    const dep = `${String(Math.floor(((seed*7)+230)%1440/60)).padStart(2,'0')}:${String(((seed*7)+230)%60).padStart(2,'0')}`;
    const arr = `${String(Math.floor(arrMin/60)).padStart(2,'0')}:${String(arrMin%60).padStart(2,'0')}`;
    return { code: 'TK 1853', dep, arr, dur: typeof durationFor === 'function' ? durationFor(fromC.code, toC.code).txt : '2h 45m', fareName: 'EcoFly' };
  })();
  const arrHr = parseInt((out.arr || '14:00').split(':')[0], 10) || 14;
  const arrMin2 = parseInt((out.arr || '14:00').split(':')[1], 10) || 0;
  const arrMinutes = arrHr * 60 + arrMin2;
  const hhmm = (m) => `${String(Math.floor((m%1440)/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
  const firstActMin = arrMinutes + 75;

  function day1Plan() {
    const slots = [];
    slots.push({
      kind: 'arrival', when: u.lang==='tr'?'VARIŞ':'ARRIVAL', hr: out.arr,
      title: `${toC.city || destCode} — ${out.code}`,
      meta: `${fromC.code} → ${toC.code} · ${out.dur}`,
    });
    slots.push({
      kind: 'hotel', when: u.lang==='tr'?'OTEL':'HOTEL', hr: hhmm(arrMinutes + 45),
      title: u.lang==='tr'?'Check-in & eşya bırak':'Check-in & drop bags',
      meta: u.lang==='tr'?'~45 dk':'~45 min',
    });
    if (arrMinutes <= 8*60+30) {
      slots.push({ kind: 'poi', when: u.lang==='tr'?'SABAH':'MORNING', hr: hhmm(firstActMin), id: day.morning });
      slots.push({ kind: 'poi', when: u.lang==='tr'?'ÖĞLE':'NOON',    hr: '13:00', id: day.noon });
      slots.push({ kind: 'poi', when: u.lang==='tr'?'AKŞAM':'EVENING', hr: '19:00', id: day.evening });
    } else if (arrMinutes <= 13*60+30) {
      slots.push({ kind: 'poi', when: u.lang==='tr'?'ÖĞLE':'NOON',    hr: hhmm(Math.max(firstActMin, 13*60)), id: day.noon });
      slots.push({ kind: 'poi', when: u.lang==='tr'?'AKŞAM':'EVENING', hr: '19:00', id: day.evening });
    } else if (arrMinutes <= 17*60+30) {
      slots.push({ kind: 'poi', when: u.lang==='tr'?'AKŞAM':'EVENING', hr: hhmm(Math.max(firstActMin, 19*60)), id: day.evening });
    } else {
      slots.push({
        kind: 'dinner', when: u.lang==='tr'?'AKŞAM YEMEĞİ':'DINNER', hr: hhmm(arrMinutes + 90),
        title: u.lang==='tr'?'Otele yakın akşam yemeği':'Dinner near the hotel',
        meta: u.lang==='tr'?'Yorgun bir gece için hafif bir tabak':'A light plate before bed',
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
  const filteredPlan = plan.filter(s => s.kind !== 'poi' || !edits.isDeleted?.(s.id));
  const dayPois = filteredPlan.filter(s => s.kind === 'poi').map(s => dest.pois.find(p => p.id === s.id)).filter(Boolean);
  const dayPoiIds = dayPois.map(p => p.id);

  // Discover tab
  const allCatPois = (typeof getDestPois === 'function') ? getDestPois(destCode) : [];
  const catPois = allCatPois.filter(p => p.cat === discoverCat);
  const discoverPois = dayIx === 'discover' ? catPois.map(p => ({
    id: 'disc_' + p.id,
    lat: (typeof poiLatLon === 'function' ? poiLatLon(p, destCode).lat : 0),
    lon: (typeof poiLatLon === 'function' ? poiLatLon(p, destCode).lon : 0),
    name: p.name, color: (POI_CATEGORIES.find(c => c.id === p.cat) || {}).color || '#7A4988',
    icon: (POI_CATEGORIES.find(c => c.id === p.cat) || {}).icon || '⚑',
    _src: p,
  })) : [];

  // ✦ M&S partner pins — gösterilir eğer harita toggle açıksa veya Keşfet'te 'Sadece M&S' aktifse
  const msMapPois = ((msMapActive || (dayIx === 'discover' && msOnly)) && typeof msPartnersAsMapPois === 'function')
    ? msPartnersAsMapPois(destCode)
    : [];
  // Birleşmiş discoverPois — normal kategori + M&S partnerleri (M&S aktifse normal pinler söner)
  const mergedDiscoverPois = (dayIx === 'discover' && msOnly)
    ? msMapPois                       // Keşfet'te yalnız M&S → sadece partner pinleri
    : [...discoverPois, ...msMapPois]; // harita toggle → mevcut pinler + M&S

  async function handleMapClick(latlng) {
    if (!latlng || typeof reverseLookup !== 'function') return;
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
    edits.addCustom?.({
      id, name: { tr: name, en: name },
      lat: clickedPoint.lat, lon: clickedPoint.lon,
      type: 'view', hours: '—', fee: '—',
      desc: { tr: clickedPoint.data.desc || '', en: clickedPoint.data.desc || '' },
      address: clickedPoint.data.address || '',
    });
    toast({ type: 'success', icon: '✓', children: u.lang==='tr'?`Rotaya eklendi: ${name}`:`Added: ${name}` });
    setClickedPoint(null);
  }

  const dayTabs = [
    ...dest.days.map((d, i) => ({ id: i, label: `Gün ${i + 1}`, en: `Day ${i + 1}`, title: u.lang==='tr' ? d.title?.tr : d.title?.en })),
    { id: 'discover', label: 'Keşfet', en: 'Discover', title: u.lang==='tr' ? 'Yakındaki yerler' : 'Nearby places' },
  ];

  return (
    <div className="thy-screen screen-enter" style={{
      position: 'relative', minHeight: '100%', overflow: 'hidden',
      background: '#FAF6EE', fontFamily: u.font,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* ── Map canvas (Editorial D: diagonal bottom-left crop for magazine torn-edge) ───── */}
      <div style={{
        position: 'relative', height: 310, overflow: 'hidden', background: '#101a2b',
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 32px 100%, 0 calc(100% - 22px))',
      }}>
        {(typeof DestLeafletMap === 'function') ? (
          <DestLeafletMap
            destCode={destCode}
            pois={activePois}
            customPois={customPois}
            discoverPois={mergedDiscoverPois}
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
        ) : null}

        {/* top bar — back + route badge + share */}
        <div style={{
          position: 'absolute', top: topPad, left: 12, right: 12, zIndex: 500,
          display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none',
        }}>
          <button onClick={() => nav('board')} style={{
            background: '#fff', border: '1px solid #E2E8F0',
            borderRadius: 10, padding: '8px 10px', color: '#0A1628', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(10,22,40,0.08)', pointerEvents: 'auto',
          }}><Icon name="arrowL" size={14} /></button>
          <div style={{
            flex: 1, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff', border: '1px solid rgba(197,160,89,0.45)',
            borderRadius: 10, color: '#0A1628',
            boxShadow: '0 6px 18px rgba(10,22,40,0.10)', pointerEvents: 'auto', minWidth: 0,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12, letterSpacing: 0.8, color: '#0A1628' }}>{fromC.code}</span>
            <span style={{ fontSize: 12, color: '#C5A059' }}>→</span>
            <button onClick={() => setCityPickerOpen(true)} style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 3,
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12, letterSpacing: 0.8, color: '#B7312C' }}>{toC.code}</span>
              <span style={{ fontSize: 8, color: '#C5A059', lineHeight: 1 }}>▾</span>
            </button>
            <div style={{ width: 1, height: 16, background: '#E2E8F0' }} />
            <button onClick={() => setCityPickerOpen(true)} style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              minWidth: 0, flex: 1, textAlign: 'left',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 800, color: '#0A1628',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{dest.city}</div>
              <div style={{
                fontSize: 9.5, color: '#94A3B8', fontStyle: 'italic',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{u.lang==='tr' ? dest.tagline?.tr : dest.tagline?.en}</div>
            </button>
          </div>
          {/* Collaborator avatar stack — tapping the stack opens the share sheet */}
          {collab && (
            <button onClick={() => setShareOpen(true)} aria-label={u.lang==='tr'?'Paylaş':'Share'} style={{
              padding: '5px 5px 5px 10px', display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#fff', border: '1px solid rgba(197,160,89,0.45)',
              borderRadius: 10, color: '#0A1628', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(10,22,40,0.08)', pointerEvents: 'auto',
            }}>
              <span style={{ fontSize: 14, color: '#C5A059', fontWeight: 700, marginRight: -2 }}>↗</span>
              <span aria-hidden style={{ display: 'inline-flex' }}>
                {collab.collaborators.slice(0, 3).map((c, i) => (
                  <span key={c.id} style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: c.color, color: '#0A1628',
                    border: '2px solid #fff', marginLeft: i === 0 ? 0 : -8,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 9,
                    letterSpacing: 0.2,
                  }}>{c.initials}</span>
                ))}
              </span>
            </button>
          )}
        </div>

        {/* ── Şehir Seçici Bottom Sheet ── */}
      {cityPickerOpen && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 900,
          background: 'rgba(10,22,40,0.55)', backdropFilter: 'blur(3px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }} onClick={() => setCityPickerOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: '16px 16px 0 0',
            padding: '0 0 32px',
            maxHeight: '72%', display: 'flex', flexDirection: 'column',
            boxShadow: '0 -8px 32px rgba(10,22,40,0.18)',
          }}>
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E2E8F0' }} />
            </div>
            {/* Başlık */}
            <div style={{
              padding: '8px 18px 12px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, color: '#0A1628' }}>
                  {u.lang==='tr' ? 'Nereye gidiyorsun?' : 'Where are you going?'}
                </div>
                <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 2 }}>
                  {u.lang==='tr' ? 'Bir şehir seç — harita ve rehber güncellensin' : 'Pick a city — map & guide will update'}
                </div>
              </div>
              <button onClick={() => setCityPickerOpen(false)} style={{
                background: '#F1F5F9', border: 'none', borderRadius: 8,
                width: 30, height: 30, cursor: 'pointer', fontSize: 14, color: '#64748B',
              }}>✕</button>
            </div>
            {/* Şehir listesi */}
            <div style={{ overflowY: 'auto', padding: '8px 0' }}>
              {(() => {
                const regions = [...new Set(QUICK_DESTS.map(d => d.region))];
                return regions.map(region => (
                  <div key={region}>
                    <div style={{
                      padding: '6px 18px 4px',
                      fontSize: 9, fontWeight: 800, letterSpacing: 1.4,
                      color: '#94A3B8', textTransform: 'uppercase',
                    }}>{region}</div>
                    {QUICK_DESTS.filter(d => d.region === region).map(d => {
                      const isActive = d.code === destCode;
                      return (
                        <button key={d.code} onClick={() => {
                          setBooking({ toCode: d.code });
                          setCityPickerOpen(false);
                          toast({ type: 'info', icon: d.flag, children:
                            (u.lang==='tr' ? d.city + ' seçildi' : d.city + ' selected') });
                        }} style={{
                          width: '100%', padding: '11px 18px',
                          background: isActive ? 'rgba(183,49,44,0.06)' : 'transparent',
                          border: 'none', borderBottom: '1px solid #F8FAFC',
                          cursor: 'pointer', textAlign: 'left',
                          display: 'flex', alignItems: 'center', gap: 12,
                        }}>
                          <span style={{ fontSize: 20, lineHeight: 1 }}>{d.flag}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontWeight: 700, fontSize: 13, color: isActive ? '#B7312C' : '#0A1628',
                              display: 'flex', alignItems: 'center', gap: 6,
                            }}>
                              {d.city}
                              {isActive && <span style={{
                                fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 800,
                                background: '#B7312C', color: '#fff',
                                padding: '1px 5px', borderRadius: 2, letterSpacing: 1,
                              }}>✓ {u.lang==='tr'?'SEÇİLİ':'ACTIVE'}</span>}
                            </div>
                            <div style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{d.code}</div>
                          </div>
                          {!isActive && <span style={{ fontSize: 14, color: '#CBD5E1' }}>→</span>}
                        </button>
                      );
                    })}
                  </div>
                ));
              })()}
            </div>
            {/* Alt link */}
            <div style={{ padding: '10px 18px 0', borderTop: '1px solid #F1F5F9' }}>
              <button onClick={() => { setCityPickerOpen(false); nav('search'); }} style={{
                width: '100%', padding: '11px', background: '#0A1628', color: '#F5F1EA',
                border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12,
                cursor: 'pointer', fontFamily: u.font,
              }}>{u.lang==='tr' ? '+ Yeni rota oluştur' : '+ Create new route'} →</button>
            </div>
          </div>
        </div>
      )}

      {/* bottom map gradient → smoother handoff to panel */}
        <div aria-hidden style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, pointerEvents: 'none',
          background: 'linear-gradient(180deg, transparent, rgba(250,246,238,0.95))', zIndex: 400,
        }} />

        {/* ✦ Miles&Smiles harita toggle — sağ alt köşe, gradient'in üstünde */}
        {typeof MSMapToggle === 'function' && (
          <div style={{
            position: 'absolute', right: 12, bottom: 10, zIndex: 500,
          }}>
            <MSMapToggle
              active={msMapActive}
              count={msCount}
              lang={u.lang}
              size="sm"
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
      </div>

      {/* ── Itinerary panel — Editorial D: magazine masthead w/ hard rule, italic Romaⁿ ── */}
      <div style={{
        marginTop: -10, position: 'relative', zIndex: 2,
        background: '#FAF6EE',
        borderTop: '2px solid #0A1628',
        padding: '12px 18px 0',
        flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
        boxShadow: '0 -8px 24px rgba(10,22,40,0.08)',
      }}>
        {/* Dateline strip */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingBottom: 6, borderBottom: '1px solid rgba(10,22,40,0.32)',
          fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: 1.6, fontWeight: 800, color: '#0A1628',
        }}>
          <span>№ 042 · {(dest.city || destCode).toUpperCase()}</span>
          <span style={{ color: '#B7312C' }}>● {dest.pois.length} {u.lang === 'tr' ? 'DURAK' : 'STOPS'}</span>
        </div>

        {thyHasPrefs && thyHasPrefs() && (
          <div style={{ marginBottom: 8 }}>
            <TravelPrefsBadge lang={u.lang} dark={false} onClick={() => nav('travelPrefs')} />
          </div>
        )}
        {/* Italic cityⁿ headline + tagline */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginTop: 8, marginBottom: 10 }}>
          <h1 style={{
            margin: 0,
            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
            fontWeight: 700, fontSize: 48, lineHeight: 0.9, letterSpacing: -1.4, color: '#0A1628',
          }}>{dest.city || destCode}<sup style={{
            fontSize: 15, color: '#B7312C', fontStyle: 'normal',
            fontFamily: 'var(--font-mono)', fontWeight: 800,
            verticalAlign: 'top', position: 'relative', top: 8, marginLeft: 2,
          }}>{dest.pois.length}</sup></h1>
          <span style={{
            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
            fontSize: 13, color: '#5B6770',
            textAlign: 'right', maxWidth: 150, lineHeight: 1.25,
          }}>{u.lang==='tr' ? (dest.tagline?.tr || '') : (dest.tagline?.en || '')}</span>
        </div>

        {/* Chapter tabs — Editorial D: italic numerals (I/II/III/∞) + red underline accent */}
        <div style={{
          display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: 0,
          marginBottom: 10, marginLeft: -18, marginRight: -18, padding: '0 18px',
          borderBottom: '1px solid rgba(10,22,40,0.16)',
          scrollSnapType: 'x mandatory',
        }}>
          {dayTabs.map((tb) => {
            const on = dayIx === tb.id;
            const numeral = tb.id === 'discover' ? '∞' : (['I','II','III','IV','V'][tb.id] || (tb.id + 1));
            return (
              <button key={tb.id} onClick={() => { setDayIx(tb.id); setOpenPoi(null); }} style={{
                flexShrink: 0, padding: '6px 14px 9px 0', marginRight: 14, cursor: 'pointer',
                background: 'transparent', border: 'none', borderRadius: 0,
                borderBottom: on ? '2px solid #B7312C' : '2px solid transparent',
                color: on ? '#0A1628' : '#64748B',
                display: 'inline-flex', alignItems: 'baseline', gap: 6,
                whiteSpace: 'nowrap', scrollSnapAlign: 'start',
                transition: 'all 200ms cubic-bezier(.16,1,.3,1)',
                marginBottom: -1,
              }}>
                <span style={{
                  fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                  fontWeight: 700, fontSize: 20, lineHeight: 1,
                  color: on ? '#B7312C' : '#94A3B8',
                }}>{numeral}</span>
                <span style={{
                  fontFamily: u.font, fontWeight: 700, fontSize: 11, letterSpacing: 0.4,
                }}>{u.lang==='tr' ? tb.label : tb.en}</span>
              </button>
            );
          })}
        </div>

        {/* Chapter eyebrow + italic title — Editorial D */}
        {typeof dayIx === 'number' && (
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 800, letterSpacing: 2, color: '#B7312C' }}>
                {(u.lang==='tr' ? 'BÖLÜM' : 'CHAPTER')} {['I','II','III','IV','V'][dayIx] || (dayIx + 1)}
              </div>
              <div style={{
                fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                fontWeight: 700, fontSize: 22, letterSpacing: -0.4,
                color: '#0A1628', marginTop: 2, lineHeight: 1.1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{u.lang==='tr' ? day.title?.tr : day.title?.en}</div>
            </div>
            <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'var(--font-mono)', letterSpacing: 1, fontWeight: 800 }}>
              {dayPois.length} {u.lang==='tr' ? 'DURAK' : 'STOPS'}
            </span>
          </div>
        )}
        {dayIx === 'discover' && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 800, letterSpacing: 2, color: '#B7312C' }}>
              ∞ {u.lang==='tr' ? 'KEŞFET' : 'DISCOVER'}
            </div>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
              fontWeight: 700, fontSize: 22, letterSpacing: -0.4,
              color: '#0A1628', marginTop: 2, lineHeight: 1.1,
            }}>{u.lang==='tr' ? 'Yakındaki yerler' : 'Nearby places'}</div>
          </div>
        )}

        {/* Scroll list */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingBottom: 12 }}>
          {typeof dayIx === 'number' && filteredPlan.map((slot, i) => {
            if (slot.kind !== 'poi') {
              const ico = slot.kind === 'arrival' ? 'plane' : slot.kind === 'hotel' ? 'bed' : 'coffee';
              return (
                <SlotRow key={i} u={u}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(197,160,89,0.14)', color: '#C5A059',
                    border: '1px solid #C5A059',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon name={ico} size={14} /></div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#B7312C', fontWeight: 800, letterSpacing: 1.6 }}>{slot.when}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#94A3B8' }}>{slot.hr}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0A1628', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{slot.title}</div>
                    <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 1 }}>{slot.meta}</div>
                  </div>
                </SlotRow>
              );
            }
            const p = dest.pois.find(po => po.id === slot.id); if (!p) return null;
            const meta = POI_TYPE_META[p.type] || POI_TYPE_META.monument;
            const pinNum = dest.pois.findIndex(po => po.id === p.id) + 1;
            const isOpen = openPoi === p.id;
            const note = edits.getNote?.(p.id);
            const author = collab?.getNoteAuthor?.(p.id);
            const votes = collab?.getVotes?.(p.id) || [];
            const voted = collab?.hasVoted?.(p.id);
            return (
              <SlotRow key={slot.id+slot.when} u={u} active={isOpen}
                onClick={() => setOpenPoi(isOpen ? null : p.id)}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: '#C5A059', color: '#0A1628',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12,
                  boxShadow: '0 4px 10px rgba(197,160,89,0.35)',
                }}>{pinNum}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#B7312C', fontWeight: 800, letterSpacing: 1.6 }}>{slot.when}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#94A3B8' }}>{slot.hr}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0A1628', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {u.lang==='tr' ? p.name.tr : p.name.en}
                  </div>
                  <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {u.lang==='tr' ? meta.tr : meta.en} · {p.hours}
                  </div>
                  {note && (
                    <div style={{
                      marginTop: 8, padding: '6px 9px',
                      background: 'rgba(197,160,89,0.10)',
                      border: '1px solid rgba(197,160,89,0.32)',
                      borderLeft: `3px solid ${author?.color || '#C5A059'}`,
                      borderRadius: 7,
                      display: 'flex', alignItems: 'flex-start', gap: 6,
                    }}>
                      {author ? (
                        <span aria-hidden style={{
                          width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                          background: author.color, color: '#0A1628',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 8,
                          letterSpacing: 0.2,
                        }}>{author.initials}</span>
                      ) : (
                        <span aria-hidden style={{ color: '#C5A059', fontSize: 11, lineHeight: 1.45, flexShrink: 0 }}>✎</span>
                      )}
                      <span style={{
                        fontSize: 11, color: '#7A5C26', fontStyle: 'italic',
                        lineHeight: 1.45, whiteSpace: 'normal',
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>{note}</span>
                    </div>
                  )}
                </div>
                {votes.length > 0 && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    padding: '3px 7px', borderRadius: 999,
                    background: voted ? 'rgba(183,49,44,0.10)' : 'rgba(0,0,0,0.04)',
                    border: '1px solid ' + (voted ? 'rgba(183,49,44,0.4)' : '#E2E8F0'),
                    color: voted ? '#B7312C' : '#64748B',
                    fontSize: 10, fontWeight: 800, fontFamily: 'var(--font-mono)',
                    flexShrink: 0,
                  }}>♥ {votes.length}</span>
                )}
                <Icon name="chevR" size={14} color="#94A3B8" />
              </SlotRow>
            );
          })}

          {/* Discover */}
          {dayIx === 'discover' && (typeof POI_CATEGORIES !== 'undefined') && (
            <div>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 6, paddingBottom: 10,
              }}>
                {/* ✦ Sadece M&S toggle chip — rail'in BAŞINDA, her zaman görünür */}
                {typeof MSOnlyChip === 'function' && (
                  <MSOnlyChip
                    active={msOnly}
                    lang={u.lang}
                    size="sm"
                    onToggle={() => setMsOnly(v => !v)}
                  />
                )}
                {POI_CATEGORIES.map(cat => {
                  const on = discoverCat === cat.id && !msOnly;
                  return (
                    <button key={cat.id} onClick={() => { setDiscoverCat(cat.id); setMsOnly(false); }} style={{
                      flexShrink: 0, padding: '7px 11px', borderRadius: 999, cursor: 'pointer',
                      background: on ? cat.color : '#fff',
                      border: '1px solid ' + (on ? cat.color : '#E2E8F0'),
                      color: on ? '#fff' : '#64748B',
                      fontFamily: u.font, fontWeight: 700, fontSize: 11,
                      display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                      opacity: msOnly ? 0.5 : 1,
                    }}>
                      <span>{cat.icon}</span>
                      <span>{u.lang==='tr' ? cat.tr : cat.en}</span>
                    </button>
                  );
                })}
              </div>
              {msOnly ? (
                /* ✦ M&S aktif: kategori başlıklı grup listesi */
                (typeof MSGroupedList === 'function') && (
                  <MSGroupedList
                    destCode={destCode}
                    lang={u.lang}
                    onOpenPartner={(p) => setOpenPoi(p.id)}
                    onReserve={reserveMS}
                  />
                )
              ) : catPois.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: 11, padding: '24px 0' }}>
                  {u.lang==='tr' ? 'Bu kategoride yer bulunamadı.' : 'No places in this category.'}
                </div>
              ) : (
                catPois.map((p, i) => {
                  const catMeta = POI_CATEGORIES.find(c => c.id === p.cat);
                  return (
                    <SlotRow key={p.id} u={u} onClick={() => setOpenPoi(p.id)}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                        background: `${catMeta.color}1F`, color: catMeta.color,
                        border: `1px solid ${catMeta.color}`,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                      }}>{catMeta.icon}</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0A1628', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {u.lang==='tr' ? p.name.tr : p.name.en}
                        </div>
                        <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 1 }}>
                          {u.lang==='tr' ? catMeta.tr : catMeta.en} · {p.hours || '—'} · {p.price || ''}
                        </div>
                      </div>
                      <Icon name="chevR" size={14} color="#94A3B8" />
                    </SlotRow>
                  );
                })
              )}
            </div>
          )}

          {/* Add stop button (only in day view) */}
          {typeof dayIx === 'number' && (
            <button onClick={() => toast({ type: 'info', icon: '+', children: u.lang==='tr' ? 'Haritada bir noktaya dokunarak ekle' : 'Tap a point on the map to add' })} style={{
              marginTop: 10, padding: '11px 14px', width: '100%',
              background: '#fff', border: '1px dashed rgba(197,160,89,0.55)',
              borderRadius: 10, color: '#B7312C', fontWeight: 700, fontSize: 11.5,
              fontFamily: u.font, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}><Icon name="plus" size={14} color={u.accent.fg} /> {u.lang==='tr' ? 'Yeni durak ekle' : 'Add a stop'}</button>
          )}

          {/* Rotayı Kaydet — plan panelinin altı */}
          <button onClick={() => {
            try {
              const id = 'TRIP-' + (fromC.code||'IST') + destCode + Date.now().toString(36).slice(-4).toUpperCase();
              const rec = {
                id,
                name: (u.lang==='tr' ? toC.city || destCode : toC.city || destCode) + ' Rotası',
                legs: [(fromC.code||'IST'), destCode],
                dates: (typeof formatDateShort==='function' && booking.depDate)
                  ? (() => { const d=formatDateShort(booking.depDate,u.lang); return d.day+' '+d.mo; })()
                  : '—',
                pax: u.lang==='tr'?'1 yetişkin':'1 adult',
                miles: '+840', price: '6\u00a0480,00',
                status: { label: u.lang==='tr'?'PLANLANIYOR':'PLANNED', tone: 'navy' },
                cabin: booking.fareFamily || 'EcoFly',
                eta: u.lang==='tr'?'Düzenlendi · haritada':'Edited · on map',
                savedAt: new Date().toISOString(),
              };
              const list = JSON.parse(localStorage.getItem('thy-route-selections-v1')||'[]');
              if (!list.some(r => r.id === id)) { list.unshift(rec); localStorage.setItem('thy-route-selections-v1', JSON.stringify(list)); }
            } catch(_) {}
            toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Rota kaydedildi → Rotalarım':'Route saved → My Routes' });
            setTimeout(() => nav('routes'), 700);
          }} style={{
            marginTop: 10, padding: '13px 14px', width: '100%',
            background: 'linear-gradient(135deg, #0A1628 0%, #1B3868 100%)',
            border: '1px solid rgba(197,160,89,0.45)',
            borderRadius: 10, color: '#E5C97A', fontWeight: 800, fontSize: 12,
            fontFamily: u.font, cursor: 'pointer', letterSpacing: 0.4,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            boxShadow: '0 6px 16px rgba(10,22,40,0.28)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {u.lang==='tr' ? 'Rotasını Kaydet' : 'Save Route'} →
          </button>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <AppTabBar active="map" onChange={(id) => nav(id === 'home' ? 'board' : id === 'search' ? 'search' : id === 'map' ? 'map' : id === 'wallet' ? 'tkpay' : 'profile')} {...u} />
        </div>
      </div>

      {/* ── ✦ M&S partner bottom sheet — mevcut sheet'ten önce, openPoi 'ms_' ile başlıyorsa */}
      {openPoi && typeof isMSPartnerId === 'function' && isMSPartnerId(openPoi) && (() => {
        const partner = getMSPartnerById(destCode, openPoi);
        if (!partner) return null;
        const catMeta = MS_CATEGORIES.find(c => c.id === partner.cat) || {};
        return (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 60,
            display: 'flex', alignItems: 'flex-end',
            background: 'rgba(10,22,40,0.40)',
            animation: 'pnrFade .25s ease',
          }} onClick={() => setOpenPoi(null)}>
            <div onClick={(e) => e.stopPropagation()} style={{
              width: '100%', padding: '18px 18px 20px',
              background: 'linear-gradient(180deg, #FFFBF1 0%, #FFFFFF 30%)',
              border: '1px solid rgba(197,160,89,0.55)',
              borderRadius: '20px 20px 0 0', color: '#0A1628',
              animation: 'qrSheet .45s cubic-bezier(.16,1,.3,1)',
              boxShadow: '0 -20px 50px rgba(197,160,89,0.25)',
              maxHeight: '70%', overflowY: 'auto',
            }}>
              <div style={{
                width: 36, height: 3, background: '#E5C97A',
                borderRadius: 2, margin: '0 auto 12px',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: catMeta.color || '#C5A059', color: '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15,
                  }}>{catMeta.icon || '✦'}</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1.8, color: '#9C7B36', fontWeight: 800 }}>
                      ✦ MILES&SMILES PARTNERİ
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#94A3B8', letterSpacing: 1 }}>
                      {(u.lang==='tr' ? catMeta.tr : catMeta.en) || ''} · {partner.brand}
                    </span>
                  </div>
                </div>
                <button onClick={() => setOpenPoi(null)} style={{
                  width: 26, height: 26, borderRadius: 8, border: 'none',
                  background: '#F1F5F9', color: '#0A1628', cursor: 'pointer', fontSize: 16, lineHeight: 1,
                }}>×</button>
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20,
                lineHeight: 1.2, marginBottom: 8, letterSpacing: -0.3, color: '#0A1628',
              }}>{partner.name}</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap',
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 10px', borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(197,160,89,0.14), rgba(197,160,89,0.06))',
                  border: '1px solid rgba(197,160,89,0.42)',
                  fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 800,
                  color: '#9C7B36', letterSpacing: 0.4,
                }}>✦ {partner.offer}</span>
                {partner.miles !== '—' && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, color: '#64748B', fontWeight: 700,
                  }}>~{partner.miles} mil/işlem</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#475569', marginBottom: 14, lineHeight: 1.5 }}>
                {u.lang === 'tr'
                  ? 'Rezervasyonu Miles&Smiles üzerinden tamamlayın, kazandığınız miller otomatik hesabınıza işlesin.'
                  : 'Complete your booking via Miles&Smiles to have the miles credited automatically.'}
              </div>
              {typeof MSReservationCTA === 'function' && (
                <MSReservationCTA partner={partner} lang={u.lang} onReserve={reserveMS} />
              )}
            </div>
          </div>
        );
      })()}

      {/* ── POI bottom sheet ─────────────────── */}
      {openPoi && !(typeof isMSPartnerId === 'function' && isMSPartnerId(openPoi)) && (() => {
        const p = dest.pois.find(po => po.id === openPoi)
          || catPois.find(po => po.id === openPoi);
        if (!p) return null;
        const meta = POI_TYPE_META[p.type] || POI_TYPE_META.monument;
        const isPlanned = dest.pois.some(po => po.id === p.id);
        return (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 60,
            display: 'flex', alignItems: 'flex-end',
            background: 'rgba(10,22,40,0.35)',
            animation: 'pnrFade .25s ease',
          }} onClick={() => setOpenPoi(null)}>
            <div onClick={(e) => e.stopPropagation()} style={{
              width: '100%', padding: '18px 18px 20px',
              background: '#fff',
              border: '1px solid rgba(197,160,89,0.45)',
              borderRadius: '20px 20px 0 0', color: '#0A1628',
              animation: 'qrSheet .45s cubic-bezier(.16,1,.3,1)',
              boxShadow: '0 -20px 50px rgba(10,22,40,0.20)',
              maxHeight: '70%', overflowY: 'auto',
            }}>
              <div style={{
                width: 36, height: 3, background: '#CBD5E1',
                borderRadius: 2, margin: '0 auto 12px',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {isPlanned && (
                    <span style={{
                      width: 26, height: 26, borderRadius: '50%', background: '#C5A059', color: '#0A1628',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12,
                      boxShadow: '0 4px 10px rgba(197,160,89,0.32)',
                    }}>{dest.pois.findIndex(po => po.id === p.id) + 1}</span>
                  )}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: 2, color: '#B7312C', fontWeight: 800 }}>
                    {((u.lang==='tr' ? meta.tr : meta.en) || '').toUpperCase()}
                  </span>
                </div>
                <button onClick={() => setOpenPoi(null)} style={{
                  width: 26, height: 26, borderRadius: 8, border: 'none',
                  background: '#F1F5F9', color: '#0A1628', cursor: 'pointer', fontSize: 16, lineHeight: 1,
                }}>×</button>
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20,
                lineHeight: 1.2, marginBottom: 8, letterSpacing: -0.3, color: '#0A1628',
              }}>{u.lang==='tr' ? p.name.tr : p.name.en}</div>
              {p.desc && (
                <div style={{ fontSize: 12.5, lineHeight: 1.55, color: '#475569', marginBottom: 12 }}>
                  {u.lang==='tr' ? (p.desc.tr || p.desc) : (p.desc.en || p.desc)}
                </div>
              )}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
                padding: '10px 12px', background: '#F8FAFC', borderRadius: 8,
                border: '1px solid #E2E8F0',
              }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, color: '#94A3B8', fontWeight: 800 }}>{u.lang==='tr'?'AÇIK':'OPEN'}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, marginTop: 2, color: '#0A1628' }}>{p.hours || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, color: '#94A3B8', fontWeight: 800 }}>{u.lang==='tr'?'GİRİŞ':'FEE'}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, marginTop: 2, color: '#0A1628' }}>{p.fee || p.price || '—'}</div>
                </div>
              </div>

              {/* ── Note editor ────────────────────────────── */}
              <div style={{ marginTop: 14 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 8, gap: 8,
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: 2,
                      color: '#C5A059', fontWeight: 800,
                    }}>✎ {u.lang==='tr' ? 'KENDİ NOTUN' : 'YOUR NOTE'}</span>
                    {(() => {
                      const a = collab?.getNoteAuthor?.(p.id);
                      if (!a) return null;
                      return (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '2px 7px 2px 2px', borderRadius: 999,
                          background: '#F1F5F9', border: '1px solid #E2E8F0',
                        }}>
                          <span style={{
                            width: 16, height: 16, borderRadius: '50%',
                            background: a.color, color: '#0A1628',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 8,
                          }}>{a.initials}</span>
                          <span style={{ fontSize: 10, color: '#475569', fontWeight: 700 }}>{a.name.split(' ')[0]}</span>
                        </span>
                      );
                    })()}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    {collab && (() => {
                      const voted = collab.hasVoted(p.id);
                      const votes = collab.getVotes(p.id);
                      return (
                        <button onClick={(e) => { e.stopPropagation(); collab.toggleVote(p.id); }} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
                          background: voted ? 'rgba(183,49,44,0.12)' : '#fff',
                          border: '1px solid ' + (voted ? '#B7312C' : '#E2E8F0'),
                          color: voted ? '#B7312C' : '#475569',
                          fontFamily: u.font, fontWeight: 700, fontSize: 11,
                          transition: 'all 200ms cubic-bezier(.16,1,.3,1)',
                        }}>♥ {votes.length} {u.lang==='tr' ? 'oy' : 'love'}</button>
                      );
                    })()}
                    {edits.getNote?.(p.id) && (
                      <button onClick={() => {
                        (collab?.deleteNote || edits.deleteNote)?.(p.id);
                        setNoteDraft('');
                        toast({ type: 'success', icon: '✓', children: u.lang==='tr' ? 'Not silindi' : 'Note removed' });
                      }} style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: '#B7312C', fontSize: 11, fontWeight: 700, padding: 0,
                      }}>{u.lang==='tr' ? 'Sil' : 'Delete'}</button>
                    )}
                  </span>
                </div>
                <textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder={u.lang==='tr' ? 'Bu durak için kendine bir not yaz… (rezervasyon kodu, ipucu, kim öneredi…)' : 'Write a personal note for this stop… (booking code, tip, who recommended…)'}
                  rows={3}
                  maxLength={240}
                  style={{
                    width: '100%', resize: 'none',
                    padding: '10px 12px', borderRadius: 10,
                    background: '#FFFBF1', color: '#0A1628',
                    border: '1px solid rgba(197,160,89,0.45)',
                    fontFamily: u.font, fontSize: 13, lineHeight: 1.5,
                    outline: 'none', boxShadow: 'inset 0 1px 2px rgba(197,160,89,0.10)',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#C5A059'; e.target.style.boxShadow = '0 0 0 3px rgba(197,160,89,0.22)'; }}
                  onBlur={(e)  => { e.target.style.borderColor = 'rgba(197,160,89,0.45)'; e.target.style.boxShadow = 'inset 0 1px 2px rgba(197,160,89,0.10)'; }}
                />
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginTop: 8, gap: 8,
                }}>
                  <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'var(--font-mono)', letterSpacing: 0.3 }}>
                    {noteDraft.length}/240
                  </span>
                  <button onClick={() => {
                    const v = noteDraft.trim();
                    if (v) {
                      (collab?.addNote || edits.addNote)?.(p.id, v);
                      toast({ type: 'success', icon: '✓', children: u.lang==='tr' ? 'Not kaydedildi' : 'Note saved' });
                    } else {
                      (collab?.deleteNote || edits.deleteNote)?.(p.id);
                    }
                    setOpenPoi(null);
                  }} style={{
                    padding: '10px 16px', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #E8C97A, #C5A059)',
                    color: '#0A1628', border: 'none', borderRadius: 10,
                    fontFamily: u.font, fontWeight: 800, fontSize: 12, letterSpacing: 0.3,
                    boxShadow: '0 6px 16px rgba(197,160,89,0.35)',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}>✎ {u.lang==='tr' ? 'Notu Kaydet' : 'Save Note'}</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Clicked-point lookup sheet ───────── */}
      {clickedPoint && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 65,
          display: 'flex', alignItems: 'flex-end',
          background: 'rgba(10,22,40,0.40)', animation: 'pnrFade .25s ease',
        }} onClick={() => setClickedPoint(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: '100%', padding: '16px 18px 18px',
            background: '#fff',
            border: '1px solid rgba(197,160,89,0.45)',
            borderRadius: '20px 20px 0 0', color: '#0A1628',
            animation: 'qrSheet .45s cubic-bezier(.16,1,.3,1)',
            boxShadow: '0 -20px 50px rgba(10,22,40,0.20)',
          }}>
            <div style={{
              width: 36, height: 3, background: '#CBD5E1',
              borderRadius: 2, margin: '0 auto 12px',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2.2, color: '#B7312C', fontWeight: 800 }}>
                {clickedPoint.loading ? (u.lang==='tr'?'ARANIYOR…':'LOOKING UP…') : (u.lang==='tr'?'YENİ NOKTA':'NEW SPOT')}
              </span>
              <button onClick={() => setClickedPoint(null)} style={{
                width: 26, height: 26, borderRadius: 8, border: 'none',
                background: '#F1F5F9', color: '#0A1628', cursor: 'pointer', fontSize: 16, lineHeight: 1,
              }}>×</button>
            </div>
            {clickedPoint.loading ? (
              <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                <span style={{
                  display: 'inline-block', width: 14, height: 14, borderRadius: '50%',
                  border: '2px solid rgba(197,160,89,0.25)', borderTopColor: '#C5A059',
                  animation: 'thy-spin 800ms linear infinite',
                }} />
                <span style={{ fontSize: 12, color: '#64748B' }}>OpenStreetMap & Wikipedia</span>
              </div>
            ) : (
              <>
                <div style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18,
                  lineHeight: 1.25, marginTop: 6, marginBottom: 4, color: '#0A1628',
                }}>{clickedPoint.data?.name || (u.lang==='tr'?'İsimsiz nokta':'Unnamed spot')}</div>
                {clickedPoint.data?.address && (
                  <div style={{ fontSize: 10.5, color: '#94A3B8', marginBottom: 8, lineHeight: 1.4 }}>{clickedPoint.data.address}</div>
                )}
                {clickedPoint.data?.desc && (
                  <div style={{
                    fontSize: 12, color: '#475569', lineHeight: 1.55, marginBottom: 12,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{clickedPoint.data.desc}</div>
                )}
                <button onClick={addClickedToRoute} style={{
                  width: '100%', background: '#B7312C', color: '#fff', border: 'none',
                  borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                  fontFamily: u.font, fontWeight: 800, fontSize: 13, letterSpacing: 0.5,
                  boxShadow: '0 6px 18px rgba(183,49,44,0.30)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>★ {u.lang==='tr'?'Rotaya Ekle':'Add to Route'}</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Share sheet — A: paylaşılabilir rota ─────────────────────── */}
      {shareOpen && collab && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 70,
          display: 'flex', alignItems: 'flex-end',
          background: 'rgba(10,22,40,0.55)',
          animation: 'pnrFade .25s ease',
        }} onClick={() => setShareOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: '100%', maxHeight: '85%', overflowY: 'auto',
            padding: '18px 18px 20px',
            background: 'linear-gradient(180deg, #fff 0%, #F8FAFC 100%)',
            border: '1px solid rgba(197,160,89,0.45)',
            borderRadius: '20px 20px 0 0', color: '#0A1628',
            animation: 'qrSheet .45s cubic-bezier(.16,1,.3,1)',
            boxShadow: '0 -20px 50px rgba(10,22,40,0.20)',
          }}>
            <div style={{
              width: 36, height: 3, background: '#CBD5E1',
              borderRadius: 2, margin: '0 auto 12px',
            }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: 2.2,
                  color: '#B7312C', fontWeight: 800,
                }}>{u.lang==='tr' ? 'ROTAYI PAYLAŞ' : 'SHARE THIS TRIP'}</div>
                <div style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18,
                  color: '#0A1628', letterSpacing: -0.2, marginTop: 4,
                }}>{tripTitle}</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                  {u.lang==='tr'
                    ? 'Davet edilen kişiler rotayı görebilir, düzenleyebilir, not ekleyebilir.'
                    : 'Invitees can view, edit, and add notes to the route.'}
                </div>
              </div>
              <button onClick={() => setShareOpen(false)} style={{
                width: 28, height: 28, borderRadius: 8, border: 'none', flexShrink: 0,
                background: '#F1F5F9', color: '#0A1628', cursor: 'pointer',
                fontSize: 16, lineHeight: 1,
              }}>×</button>
            </div>

            {/* Co-pilots row */}
            <div style={{
              marginTop: 14, padding: '10px 12px', borderRadius: 12,
              background: '#fff', border: '1px solid #E2E8F0',
            }}>
              <div style={{
                fontSize: 9, fontWeight: 800, letterSpacing: 2, color: '#94A3B8', marginBottom: 8,
              }}>{u.lang==='tr' ? 'YARDIMCI PİLOTLAR' : 'CO-PILOTS'}</div>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
                {collab.collaborators.map(c => (
                  <div key={c.id} title={c.name} style={{
                    flexShrink: 0,
                    padding: '6px 10px 6px 6px', borderRadius: 999,
                    background: c.id === me?.id ? 'rgba(197,160,89,0.14)' : '#F1F5F9',
                    border: '1px solid ' + (c.id === me?.id ? 'rgba(197,160,89,0.45)' : '#E2E8F0'),
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                  }}>
                    <span aria-hidden style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: c.color, color: '#0A1628',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 9,
                    }}>{c.initials}</span>
                    <span style={{ fontSize: 11.5, color: '#0A1628', fontWeight: 700 }}>
                      {c.name.split(' ')[0]}
                      {c.id === me?.id && (
                        <span style={{ color: '#B7312C', fontWeight: 800, fontSize: 9, marginLeft: 4 }}>
                          {u.lang==='tr' ? '· SEN' : '· YOU'}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
                <button onClick={() => nav('coPilot')} style={{
                  flexShrink: 0, padding: '6px 12px', borderRadius: 999, cursor: 'pointer',
                  background: '#fff', border: '1px dashed rgba(197,160,89,0.5)',
                  color: '#B7312C', fontFamily: u.font, fontWeight: 700, fontSize: 11.5,
                }}>+ {u.lang==='tr' ? 'Davet et' : 'Invite'}</button>
              </div>
            </div>

            {/* Share link */}
            <div style={{
              marginTop: 12, padding: '12px 14px', borderRadius: 12,
              background: '#fff', border: '1px solid rgba(197,160,89,0.45)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span aria-hidden style={{ color: '#C5A059', fontSize: 16 }}>🔗</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.6, color: '#94A3B8' }}>
                  {u.lang==='tr' ? 'PAYLAŞIM LİNKİ' : 'SHARE LINK'}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12, color: '#0A1628',
                  marginTop: 2, letterSpacing: 0.2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{shareLink}</div>
              </div>
              <button onClick={() => {
                try { navigator.clipboard?.writeText(shareLink); } catch (_) {}
                setLinkCopied(true);
                toast({ type: 'success', icon: '✓', children: u.lang==='tr' ? 'Link kopyalandı' : 'Link copied' });
                setTimeout(() => setLinkCopied(false), 1800);
              }} style={{
                padding: '8px 14px', cursor: 'pointer', flexShrink: 0,
                background: linkCopied ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #E8C97A, #C5A059)',
                color: linkCopied ? '#15803D' : '#0A1628', border: 'none', borderRadius: 9,
                fontFamily: u.font, fontWeight: 800, fontSize: 11, letterSpacing: 0.3,
                boxShadow: linkCopied ? 'none' : '0 4px 12px rgba(197,160,89,0.32)',
              }}>{linkCopied ? (u.lang==='tr'?'KOPYALANDI':'COPIED') : (u.lang==='tr'?'KOPYALA':'COPY')}</button>
            </div>

            {/* Channels */}
            <div style={{ marginTop: 12 }}>
              <div style={{
                fontSize: 9, fontWeight: 800, letterSpacing: 2, color: '#94A3B8', marginBottom: 8,
              }}>{u.lang==='tr' ? 'PAYLAŞIM KANALI' : 'SEND VIA'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { id: 'wa', label: 'WhatsApp', glyph: '🟢', tone: '#25D366' },
                  { id: 'im', label: 'iMessage', glyph: '💬', tone: '#0084FF' },
                  { id: 'em', label: u.lang==='tr'?'E-posta':'Email', glyph: '✉', tone: '#7A4988' },
                  { id: 'qr', label: 'QR',       glyph: '▦',  tone: '#0A1628' },
                ].map(ch => (
                  <button key={ch.id} onClick={() => {
                    toast({
                      type: 'success', icon: '✓',
                      children: u.lang==='tr' ? `${ch.label} ile paylaşıldı` : `Shared via ${ch.label}`,
                    });
                    if (ch.id !== 'qr') setShareOpen(false);
                  }} style={{
                    padding: '14px 6px', cursor: 'pointer', borderRadius: 12,
                    background: '#fff', border: '1px solid #E2E8F0',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    fontFamily: u.font, transition: 'all 200ms cubic-bezier(.16,1,.3,1)',
                  }}>
                    <span style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: ch.tone + '14',
                      border: '1px solid ' + ch.tone + '40',
                      color: ch.tone, fontSize: 17,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>{ch.glyph}</span>
                    <span style={{ fontSize: 10.5, color: '#475569', fontWeight: 700 }}>{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pilot ID box */}
            <div style={{
              marginTop: 12, padding: '12px 14px', borderRadius: 12,
              background: 'linear-gradient(135deg, #0A1628, #11264C)',
              border: '1px solid rgba(197,160,89,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 10, color: '#fff',
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 9, fontWeight: 800, letterSpacing: 2, color: '#C5A059',
                }}>{u.lang==='tr' ? 'PİLOT ID' : 'PILOT ID'}</div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 800,
                  letterSpacing: 1, marginTop: 2,
                }}>{collab.pilotId}</div>
                <div style={{ fontSize: 10, color: '#7A8EAF', marginTop: 2, lineHeight: 1.4 }}>
                  {u.lang==='tr'
                    ? 'Diğer cihazda bu kodu girerek aynı rotayı düzenleyin.'
                    : 'Enter this code on another device to edit the same route.'}
                </div>
              </div>
              <button onClick={() => {
                try { navigator.clipboard?.writeText(collab.pilotId); } catch (_) {}
                toast({ type: 'success', icon: '✓', children: u.lang==='tr' ? 'Pilot ID kopyalandı' : 'Pilot ID copied' });
              }} style={{
                padding: '9px 12px', cursor: 'pointer', flexShrink: 0,
                background: 'rgba(255,255,255,0.08)', color: '#C5A059',
                border: '1px solid rgba(197,160,89,0.45)', borderRadius: 9,
                fontFamily: u.font, fontWeight: 800, fontSize: 11, letterSpacing: 0.3,
              }}>{u.lang==='tr'?'KOPYALA':'COPY'}</button>
            </div>

            <button onClick={() => nav('inviteAccept')} style={{
              marginTop: 10, width: '100%',
              padding: '10px 14px', cursor: 'pointer',
              background: 'transparent', border: '1px dashed #CBD5E1',
              borderRadius: 10, color: '#64748B',
              fontFamily: u.font, fontWeight: 700, fontSize: 11,
            }}>{u.lang==='tr' ? 'Davet edilen kişinin gördüğü ekrana göz at →' : 'Preview what invitees see →'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
function SlotRow({ u, children, active = false, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 11,
      padding: '10px 12px', marginBottom: 6,
      background: active ? 'rgba(197,160,89,0.10)' : '#fff',
      border: '1px solid ' + (active ? 'rgba(197,160,89,0.45)' : '#E2E8F0'),
      borderRadius: 10, color: '#0A1628',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 200ms cubic-bezier(.16,1,.3,1)',
      boxShadow: active ? '0 4px 14px rgba(197,160,89,0.18)' : '0 1px 3px rgba(10,22,40,0.04)',
    }}>{children}</div>
  );
}

// ───────────────────────────────────────────────────────────
// 7) CO-PILOT — light, share PILOT ID + invite, illustrated
// ───────────────────────────────────────────────────────────
function CoPilotScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const toast = useToast();
  const [copied, setCopied] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const pid = 'PT-4830-RM';

  const copy = () => {
    setCopied(true);
    toast({ type: 'success', icon: '✓', children: u.lang === 'tr' ? 'Pilot ID kopyalandı' : 'Pilot ID copied' });
    setTimeout(() => setCopied(false), 1800);
  };
  const sendInvite = () => {
    if (!email) return toast({ type: 'error', icon: '!', children: u.lang === 'tr' ? 'E-posta gerekli' : 'Email required' });
    toast({ type: 'success', icon: '✈', children: u.lang === 'tr' ? `Davet ${email} adresine gönderildi` : `Invite sent to ${email}` });
    setEmail('');
  };

  return (
    <div className="thy-screen screen-enter" style={{
      minHeight: '100%', background: '#F3F5F8', fontFamily: u.font,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* hero with two avatars */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, #0A1628 0%, ${u.accent.deep} 80%, ${u.accent.bg} 100%)`,
        padding: `${topPad}px 18px 30px`, color: '#fff',
      }}>
        <RouteMapBg opacity={0.12} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => nav('board')} style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10, padding: '8px 10px', color: '#fff', cursor: 'pointer',
          }}><Icon name="arrowL" size={14} /></button>
        </div>

        <div style={{ position: 'relative', textAlign: 'center', marginTop: 20 }}>
          {/* dual avatars */}
          <div style={{ display: 'inline-flex', position: 'relative', marginBottom: 16 }}>
            <Avatar initials="A" tint={u.accent.fg} pos="left" />
            <Avatar initials="M" tint="#fff" pos="right" />
            <span style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)', zIndex: 2,
              width: 28, height: 28, borderRadius: '50%',
              background: '#fff', color: u.accent.bg,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 14px rgba(0,0,0,0.3)',
            }}><Icon name="link" size={14} /></span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800,
            margin: 0, letterSpacing: -0.3,
          }}>{u.c.coPilot}</h1>
          <p style={{ color: '#B2C0D1', fontSize: 13, margin: '6px 24px 0' }}>
            {u.c.coPilotDesc}
          </p>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* PILOT ID card */}
        <div style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
          boxShadow: '0 10px 28px rgba(10,22,40,0.10)',
          padding: 16,
        }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2.5, color: '#94A3B8' }}>{u.c.inviteCode}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <span style={{
              flex: 1, fontFamily: 'var(--font-mono)', fontWeight: 800,
              fontSize: 28, color: '#0A1628', letterSpacing: 2,
              background: '#F3F5F8', border: '1px dashed #CBD5E1',
              borderRadius: 10, padding: '12px 14px',
            }}>{pid}</span>
            <button onClick={copy} style={{
              width: 48, height: 48, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: copied ? '#16A34A' : `${u.accent.bg}14`,
              color: copied ? '#fff' : u.accent.bg,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 200ms',
            }}><Icon name={copied ? 'check' : 'copy'} size={18} /></button>
          </div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 10, lineHeight: 1.5 }}>
            {u.lang === 'tr'
              ? 'Bu kimliği paylaşın — rotanız iki cihazda da canlı eşlenecek.'
              : 'Share this ID — your route will sync live across both devices.'}
          </div>
        </div>

        {/* email invite */}
        <div style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
          padding: 14, marginTop: 12,
        }}>
          <ThyInput light
            label={u.lang === 'tr' ? 'E-POSTA İLE DAVET ET' : 'INVITE BY EMAIL'}
            placeholder="mehmet@example.com"
            icon={<Icon name="mail" size={16} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div style={{ marginTop: 10 }}>
            <ThyButton variant="primary" size="lg" fullWidth icon="✉" onClick={sendInvite}>
              {u.c.sendInvite}
            </ThyButton>
          </div>
        </div>

        {/* active co-pilots */}
        <div style={{ marginTop: 18 }}>
          <SectionLabel style={{ marginBottom: 8 }}>{u.lang === 'tr' ? 'AKTİF YARDIMCI PİLOTLAR' : 'ACTIVE CO-PILOTS'}</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <CoPilotRow u={u} name="Mehmet K." since={u.lang === 'tr' ? '2 saat aktif' : 'Active 2h'} live />
            <CoPilotRow u={u} name="Selin A." since={u.lang === 'tr' ? 'Dün katıldı' : 'Joined yesterday'} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <AppTabBar active="home" onChange={(id) => nav(id === 'home' ? 'board' : id === 'search' ? 'search' : id === 'map' ? 'map' : id === 'wallet' ? 'ms' : 'profile')} {...u} />
      </div>
    </div>
  );
}

function Avatar({ initials, tint, pos }) {
  return (
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: `linear-gradient(135deg, ${tint}, ${tint}AA)`,
      border: '3px solid #0A1628', color: '#0A1628',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 28,
      marginLeft: pos === 'right' ? -22 : 0,
      boxShadow: '0 8px 22px rgba(0,0,0,0.3)',
      position: 'relative', zIndex: pos === 'left' ? 1 : 0,
    }}>{initials}</div>
  );
}

function CoPilotRow({ u, name, since, live }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
      padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: `linear-gradient(135deg, ${u.accent.bg}, ${u.accent.deep})`,
        color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 14,
      }}>{name[0]}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0A1628' }}>{name}</div>
        <div style={{ fontSize: 11, color: '#64748B' }}>{since}</div>
      </div>
      {live ? <StatusBadge kind="success">{u.lang === 'tr' ? 'CANLI' : 'LIVE'}</StatusBadge>
            : <Icon name="chevR" size={14} color="#94A3B8" />}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// 8) MILES & SMILES — dark, miles balance, fare tier, partners
// ───────────────────────────────────────────────────────────
function MilesScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: true });
  const topPad = k === 'ios' ? 50 : 14;
  const toast = useToast();
  const [tab, setTab] = React.useState('overview');
  const [cat, setCat] = React.useState('all');
  return (
    <div className="thy-screen is-dark screen-enter" style={{
      minHeight: '100%', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(180deg, #050B14 0%, #0A1628 40%, #0F2244 100%)',
      fontFamily: u.font, display: 'flex', flexDirection: 'column',
    }}>
      <RouteMapBg opacity={0.06} />

      <div style={{ position: 'relative', padding: `${topPad}px 18px 14px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => nav('board')} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10, padding: '8px 10px', color: '#fff', cursor: 'pointer',
        }}><Icon name="arrowL" size={14} /></button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7A8EAF', letterSpacing: 2 }}>
          MILES&SMILES
        </div>
        <button style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10, padding: '8px 10px', color: '#fff', cursor: 'pointer',
        }}><Icon name="qr" size={14} /></button>
      </div>

      {/* Membership card */}
      <div style={{ padding: '8px 16px 0' }}>
        <div style={{
          position: 'relative', overflow: 'hidden', padding: '18px 18px 16px',
          borderRadius: 16, color: '#0A1628',
          background: 'linear-gradient(135deg, #E8C97A 0%, #C5A059 35%, #A0813C 75%, #C5A059 100%)',
          boxShadow: '0 14px 36px rgba(197,160,89,0.36), 0 1px 0 rgba(255,255,255,0.3) inset',
        }}>
          {/* shimmer band */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: '-30%', width: '40%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
            transform: 'skewX(-20deg)',
          }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2.5 }}>ELITE PLUS · TK</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, letterSpacing: -0.3, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Aylin Kaya
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1.5, marginTop: 2, opacity: 0.7 }}>
                4218 ····  ····  2107
              </div>
            </div>
            <Crane dark={false} size={26} />
          </div>

          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, opacity: 0.7 }}>{u.c.miles.toUpperCase()}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1 }}>
                87.420
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, opacity: 0.7 }}>{u.lang === 'tr' ? 'STATÜ' : 'STATUS'}</div>
              <div style={{ fontWeight: 800, fontSize: 13 }}>{u.lang === 'tr' ? '12.580 mil ile ELITE' : '12,580 mi to ELITE'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* TKPAY Cüzdan bridge — Mil ↔ TL */}
      <div style={{ padding: '10px 16px 0' }}>
        <button onClick={() => nav('tkpay')} style={{
          width: '100%', padding: '10px 12px', cursor: 'pointer',
          background: 'linear-gradient(135deg, rgba(197,160,89,0.16) 0%, rgba(197,160,89,0.04) 70%), rgba(255,255,255,0.04)',
          border: '1px solid rgba(197,160,89,0.4)',
          borderRadius: 12, color: '#fff', fontFamily: u.font,
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 0 14px rgba(197,160,89,0.12)',
        }}>
          <span style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'linear-gradient(135deg, #E8C97A, #C5A059)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#0A1628', flexShrink: 0,
          }}>
            <Icon name="wallet" size={15} strokeWidth={2.5} />
          </span>
          <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
            <div style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: '#C5A059',
            }}>TKPAY · {u.lang === 'tr' ? 'CÜZDAN' : 'WALLET'}</div>
            <div style={{
              fontSize: 11.5, fontWeight: 700, color: '#fff', marginTop: 1,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{u.lang === 'tr' ? 'Millerini TL’ye dönüştür, her yerde harca' : 'Convert miles to TL, spend anywhere'}</div>
          </div>
          <span style={{ color: '#C5A059', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>→</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ padding: '14px 16px 0' }}>
        <ThyTabs value={tab} onChange={setTab} items={[
          { id: 'overview', label: u.lang === 'tr' ? 'GENEL' : 'OVERVIEW' },
          { id: 'partners', label: u.lang === 'tr' ? 'PARTNERLER' : 'PARTNERS' },
          { id: 'history',  label: u.lang === 'tr' ? 'GEÇMİŞ' : 'HISTORY' },
        ]} />
      </div>

      {/* offer chip ladder */}
      <div style={{ padding: '14px 16px 4px' }}>
        <SectionLabel dark accent={u.accent} style={{ color: u.accent.fg, marginBottom: 8 }}>
          {u.lang === 'tr' ? 'HIZLI MİL KAZAN' : 'EARN QUICKLY'}
        </SectionLabel>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { i: 'plane', l: u.lang === 'tr' ? 'Uçuş' : 'Flight' },
            { i: 'bed',   l: u.lang === 'tr' ? 'Otel'  : 'Hotel' },
            { i: 'car',   l: u.lang === 'tr' ? 'Araç'  : 'Car' },
            { i: 'coffee',l: u.lang === 'tr' ? 'Yeme'  : 'Dine' },
          ].map(o => (
            <div key={o.i} style={{
              flex: 1, padding: '12px 6px', borderRadius: 10,
              background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.085)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              fontFamily: u.font, color: '#fff',
            }}>
              <Icon name={o.i} size={18} color={u.accent.fg} />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#B2C0D1' }}>{o.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Partners */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <SectionLabel dark accent={u.accent} style={{ color: u.accent.fg }}>{u.c.partners.toUpperCase()}</SectionLabel>
          <span style={{ fontSize: 10, color: '#7A8EAF', fontFamily: 'var(--font-mono)' }}>21 {u.lang === 'tr' ? 'tane' : 'partners'}</span>
        </div>

        {/* category chips */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {[
            { id: 'all',    label: u.lang==='tr'?'Tümü':'All',        icon: null },
            { id: 'hotel',  label: u.lang==='tr'?'Konaklama':'Hotels', icon: 'bed' },
            { id: 'car',    label: u.lang==='tr'?'Araç':'Cars',        icon: 'car' },
            { id: 'vip',    label: u.lang==='tr'?'VIP Transfer':'VIP', icon: 'shield' },
            { id: 'lounge', label: 'Lounge',                           icon: 'coffee' },
            { id: 'wifi',   label: u.lang==='tr'?'Hizmetler':'Services', icon: 'wifi' },
            { id: 'bank',   label: u.lang==='tr'?'Banka':'Bank',       icon: 'cardIcon' },
            { id: 'dining', label: u.lang==='tr'?'Yeme':'Dining',      icon: 'coffee' },
          ].map(c => (
            <ThyChip key={c.id} active={cat===c.id} onClick={() => setCat(c.id)}
              icon={c.icon ? <Icon name={c.icon} size={12} /> : null}>
              {c.label}
            </ThyChip>
          ))}
        </div>
        {(() => {
          const TR = u.lang === 'tr';
          const ALL_PARTNERS = [
            { name:'Marriott Bonvoy',      offer:TR?'Konaklama başına 600 Mil':'600 mi per stay',        icon:'bed',      cat:'hotel',  action:TR?'Haritada Bul':'Find' },
            { name:'Hilton Honors',        offer:TR?'Konaklama başına 500 Mil':'500 mi per stay',        icon:'bed',      cat:'hotel',  action:TR?'Haritada Bul':'Find' },
            { name:'ALL · Accor',          offer:TR?'%15 + 550 Mil/gece':'15% + 550 mi/night',           icon:'bed',      cat:'hotel',  action:TR?'Aktifleştir':'Activate' },
            { name:'Rixos Hotels',         offer:TR?'Konaklama başına 700 Mil':'700 mi per stay',        icon:'bed',      cat:'hotel',  action:TR?'Haritada Bul':'Find' },
            { name:'IHG One Rewards',      offer:TR?'Konaklama başına 650 Mil':'650 mi per stay',        icon:'bed',      cat:'hotel',  action:TR?'Aktifleştir':'Activate' },
            { name:'Booking.com',          offer:TR?'%5 mil iadesi · 400 Mil':'5% miles back',           icon:'bed',      cat:'hotel',  action:TR?'Aktifleştir':'Activate' },
            { name:'Rocketmiles',          offer:TR?'Rezervasyon başına 1.500 Mil':'1,500 mi/booking',   icon:'bed',      cat:'hotel',  action:TR?'Aktifleştir':'Activate' },
            { name:'HalalBooking',         offer:TR?'Rezervasyon başına 700 Mil':'700 mi per booking',   icon:'bed',      cat:'hotel',  action:TR?'Aktifleştir':'Activate' },
            { name:'Kaligo',               offer:TR?'Rezervasyon başına 1.800 Mil':'1,800 mi/booking',   icon:'bed',      cat:'hotel',  action:TR?'Aktifleştir':'Activate' },
            { name:'Avis',                 offer:TR?'Min. 125 Mil/kiralama':'min. 125 mi per rental',    icon:'car',      cat:'car',    action:TR?'Haritada Bul':'Find' },
            { name:'Budget',               offer:TR?'Min. 110 Mil/kiralama':'min. 110 mi per rental',    icon:'car',      cat:'car',    action:TR?'Aktifleştir':'Activate' },
            { name:'Enterprise',           offer:TR?'Min. 130 Mil/kiralama':'min. 130 mi per rental',    icon:'car',      cat:'car',    action:TR?'Aktifleştir':'Activate' },
            { name:'Sixt',                 offer:TR?'Min. 140 Mil/kiralama':'min. 140 mi per rental',    icon:'car',      cat:'car',    action:TR?'Haritada Bul':'Find' },
            { name:'ProGo VIP Transfer',   offer:TR?'Tek yön 950 Mil':'950 mi per one-way',              icon:'shield',   cat:'vip',    action:TR?'Haritada Bul':'Find' },
            { name:'Plaza Premium Lounge', offer:TR?'Lounge başına 400 Mil':'400 mi per lounge',         icon:'coffee',   cat:'lounge', action:TR?'Haritada Bul':'Find' },
            { name:'Airport WiFi Rentals', offer:TR?'Kiralama başına 100 Mil':'100 mi per rental',       icon:'wifi',     cat:'wifi',   action:TR?'Aktifleştir':'Activate' },
            { name:'Garanti BBVA',         offer:TR?'Her 5 TL\'ye 1 Mil':'1 mi per 5 TL',               icon:'cardIcon', cat:'bank',   action:TR?'Aktifleştir':'Activate' },
            { name:'Divan Brasserie',      offer:TR?'%10 + 200 Mil/menü':'10% + 200 mi/menu',            icon:'coffee',   cat:'dining', action:TR?'Haritada Bul':'Find' },
          ];
          const visible = cat === 'all' ? ALL_PARTNERS : ALL_PARTNERS.filter(p => p.cat === cat);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {visible.map(p => (
                <PartnerItem key={p.name} name={p.name} offer={p.offer}
                  icon={<Icon name={p.icon} size={16} />} actionLabel={p.action} />
              ))}
              {visible.length === 0 && (
                <div style={{ padding: '18px 0', textAlign: 'center', fontSize: 12, color: '#7A8EAF' }}>
                  {TR ? 'Bu kategoride partner yok' : 'No partners in this category'}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 14 }}>
        <AppTabBar active="wallet" onChange={(id) => nav(id === 'home' ? 'board' : id === 'search' ? 'search' : id === 'map' ? 'map' : id === 'wallet' ? 'ms' : 'profile')} {...u} />
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// 9) NOTIFICATIONS — light, list with status icons
// ───────────────────────────────────────────────────────────
function NotificationsScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const toast = useToast();
  const [filter, setFilter] = React.useState('all');
  return (
    <div className="thy-screen screen-enter" style={{
      minHeight: '100%', background: '#F3F5F8', fontFamily: u.font,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        background: '#fff', padding: `${topPad}px 16px 14px`,
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('board')} style={{
            background: '#F3F5F8', border: '1px solid #E2E8F0', borderRadius: 10,
            padding: '8px 10px', cursor: 'pointer',
          }}><Icon name="arrowL" size={14} color="#0A1628" /></button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20, color: '#0A1628', letterSpacing: -0.2 }}>
              {u.c.notifications}
            </div>
            <div style={{ fontSize: 11, color: '#64748B' }}>
              {u.lang === 'tr' ? '3 okunmamış' : '3 unread'}
            </div>
          </div>
          <button onClick={() => toast({ type: 'success', icon: '✓', children: u.lang === 'tr' ? 'Tümü okundu sayıldı' : 'Marked all as read' })} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: u.accent.bg, fontWeight: 700, fontSize: 11, fontFamily: u.font,
          }}>{u.lang === 'tr' ? 'Tümünü okundu say' : 'Mark all read'}</button>
        </div>

        {/* filter chips */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          <ThyChip light active={filter==='all'}     onClick={() => setFilter('all')}>{u.lang === 'tr' ? 'Tümü' : 'All'}</ThyChip>
          <ThyChip light active={filter==='flight'}  onClick={() => setFilter('flight')} icon={<Icon name="plane" size={12} />}>{u.lang === 'tr' ? 'Uçuş' : 'Flight'}</ThyChip>
          <ThyChip light active={filter==='miles'}   onClick={() => setFilter('miles')} icon={<Icon name="star" size={12} />}>{u.c.miles}</ThyChip>
          <ThyChip light active={filter==='social'}  onClick={() => setFilter('social')} icon={<Icon name="link" size={12} />}>{u.lang === 'tr' ? 'Sosyal' : 'Social'}</ThyChip>
        </div>
      </div>

      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SectionLabel style={{ margin: '4px 4px 6px' }}>{u.c.today.toUpperCase()}</SectionLabel>

        <NotifRow u={u} unread
          tint={u.accent}
          icon="plane"
          title={u.lang === 'tr' ? 'TK 1853 için biniş açıldı' : 'Boarding open for TK 1853'}
          body={u.lang === 'tr' ? 'Kapı A12 · 14:25 kalkış' : 'Gate A12 · departs 14:25'}
          time={u.lang === 'tr' ? '12 dk önce' : '12m ago'}
          cta={u.c.boardingPass}
          onCta={() => nav('boarding')}
        />
        <NotifRow u={u} unread
          tint={{ bg: '#C5A059', fg: '#C5A059', glow: 'rgba(197,160,89,0.4)' }}
          icon="star"
          title={u.lang === 'tr' ? '2.840 Mil hesabınıza eklendi' : '2,840 miles added to your account'}
          body={u.lang === 'tr' ? 'TK 1721 uçuşunuzdan kazanım' : 'Earned from flight TK 1721'}
          time={u.lang === 'tr' ? '1 sa önce' : '1h ago'}
        />
        <NotifRow u={u} unread
          tint={{ bg: '#16A34A', fg: '#16A34A', glow: 'rgba(34,197,94,0.4)' }}
          icon="link"
          title={u.lang === 'tr' ? 'Mehmet rotanıza katıldı' : 'Mehmet joined your route'}
          body={u.lang === 'tr' ? 'TRIP-0042 · Roma + Antalya' : 'TRIP-0042 · Rome + Antalya'}
          time={u.lang === 'tr' ? '3 sa önce' : '3h ago'}
        />

        <SectionLabel style={{ margin: '12px 4px 6px' }}>{u.c.earlier.toUpperCase()}</SectionLabel>

        <NotifRow u={u}
          tint={{ bg: '#0053A5', fg: '#0053A5', glow: 'rgba(0,83,165,0.3)' }}
          icon="bell"
          title={u.lang === 'tr' ? 'IST → AMS fiyat alarmı tetiklendi' : 'IST → AMS price alert triggered'}
          body={u.lang === 'tr' ? '4.890 TL · dün 5.640 TL idi' : '4,890 TL · was 5,640 TL yesterday'}
          time={u.lang === 'tr' ? 'Dün' : 'Yesterday'}
        />
        <NotifRow u={u}
          tint={{ bg: '#94A3B8', fg: '#64748B', glow: 'rgba(148,163,184,0.3)' }}
          icon="shield"
          title={u.lang === 'tr' ? 'Pasaport süresi 90 gün' : 'Passport expires in 90 days'}
          body={u.lang === 'tr' ? 'Belgeleriniz seyahat için uygun' : 'Documents valid for travel'}
          time="03 Haz"
        />
      </div>

      <div style={{ marginTop: 'auto' }}>
        <AppTabBar active="home" onChange={(id) => nav(id === 'home' ? 'board' : id === 'search' ? 'search' : id === 'map' ? 'map' : id === 'wallet' ? 'ms' : 'profile')} {...u} />
      </div>
    </div>
  );
}

function NotifRow({ u, tint, icon, title, body, time, unread, cta, onCta }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
      padding: '12px 12px', display: 'flex', alignItems: 'flex-start', gap: 12,
      boxShadow: unread ? '0 4px 14px rgba(10,22,40,0.06)' : 'none',
      position: 'relative',
    }}>
      {unread && <span style={{
        position: 'absolute', top: 14, right: 12, width: 7, height: 7,
        borderRadius: '50%', background: u.accent.fg,
      }} />}
      <span style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: `${tint.bg}1A`, color: tint.fg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon name={icon} size={18} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#0A1628', lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2, lineHeight: 1.4 }}>{body}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
          <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'var(--font-mono)', letterSpacing: 0.5 }}>{time}</span>
          {cta && (
            <button onClick={onCta} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: u.accent.bg, fontWeight: 700, fontSize: 11, fontFamily: u.font,
            }}>{cta} →</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// 10) PROFILE — light, hero membership, settings list
// ───────────────────────────────────────────────────────────
function ProfileScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const toast = useToast();
  const [tab, setTab] = React.useState('account');
  const [pnrOpen, setPnrOpen] = React.useState(false);
  return (
    <div className="thy-screen screen-enter" style={{
      position: 'relative',
      minHeight: '100%', background: '#F3F5F8', fontFamily: u.font,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* hero */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0A1628 0%, #0F2244 80%, #1B3868 100%)',
        padding: `${topPad}px 18px 70px`, color: '#fff',
      }}>
        <RouteMapBg opacity={0.10} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => nav('board')} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10, padding: '8px 10px', color: '#fff', cursor: 'pointer',
          }}><Icon name="arrowL" size={14} /></button>
          <button style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10, padding: '8px 10px', color: '#fff', cursor: 'pointer',
          }}><Icon name="edit" size={14} /></button>
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: `linear-gradient(135deg, ${u.accent.fg}, ${u.accent.deep})`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 28, color: '#fff',
            border: '3px solid rgba(255,255,255,0.15)',
            boxShadow: `0 8px 20px ${u.accent.glow}`,
          }}>AK</div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 800 }}>Aylin Kaya</div>
            <div style={{ fontSize: 11, color: '#B2C0D1', fontFamily: 'var(--font-mono)', marginTop: 2, letterSpacing: 0.5 }}>
              aylin.kaya@example.com
            </div>
            <div style={{ marginTop: 6 }}>
              <StatusBadge kind="gold" dark>✦ ELITE PLUS · 87.420 mi</StatusBadge>
            </div>
          </div>
        </div>
      </div>

      {/* stats strip overlapping hero */}
      <div style={{ padding: '0 16px', marginTop: -50 }}>
        <div style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
          boxShadow: '0 10px 28px rgba(10,22,40,0.08)',
          display: 'flex', justifyContent: 'space-around', padding: 16,
        }}>
          <ProfileStat label={u.lang === 'tr' ? 'Uçuş' : 'Flights'} v="42" />
          <Divider />
          <ProfileStat label={u.lang === 'tr' ? 'Ülke' : 'Countries'} v="18" />
          <Divider />
          <ProfileStat label={u.lang === 'tr' ? 'Mil' : 'Miles'} v="87.4K" />
        </div>
      </div>

      {/* Seyahat Tercihleri — featured card (yeni #28) */}
      <div style={{ padding: '14px 16px 0' }}>
        <button onClick={() => nav('travelPrefs')} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 16px', cursor: 'pointer',
          background: 'linear-gradient(135deg, #FAFAF6 0%, #F1ECDF 100%)',
          border: '1px solid #C5A05955', borderRadius: 14,
          boxShadow: '0 4px 14px rgba(197,160,89,0.12)',
          fontFamily: 'inherit', textAlign: 'left',
        }}>
          <span style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: 'linear-gradient(135deg, #B7312C 0%, #8E211D 100%)',
            color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
            boxShadow: '0 6px 14px rgba(183,49,44,0.28)',
          }}>✦</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#0A1628' }}>
                {u.lang === 'tr' ? 'Seyahat Tercihleri' : 'Travel Preferences'}
              </span>
              {thyHasPrefs && thyHasPrefs() && (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 800,
                  background: '#0E7A5F15', color: '#0E7A5F', padding: '2px 6px',
                  borderRadius: 4, letterSpacing: 1.5,
                }}>{u.lang === 'tr' ? 'AÇIK' : 'ON'}</span>
              )}
            </div>
            <div style={{ fontSize: 11.5, color: '#64748B', lineHeight: 1.4 }}>
              {u.lang === 'tr'
                ? 'Hız, ilgi, bütçe — rotalarınız buna göre düzenlenir.'
                : 'Pace, interests, budget — your routes adapt.'}
            </div>
          </div>
          <Icon name="chevR" size={13} color="#94A3B8" />
        </button>
      </div>

      {/* tabs */}
      <div style={{ padding: '20px 16px 0' }}>
        <ThyTabs light value={tab} onChange={setTab}
          style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #E2E8F0', background: '#fff' }}
          items={[
            { id: 'account',     label: u.lang === 'tr' ? 'HESAP'      : 'ACCOUNT' },
            { id: 'preferences', label: u.lang === 'tr' ? 'TERCİHLER'  : 'PREFS' },
            { id: 'security',    label: u.lang === 'tr' ? 'GÜVENLİK'   : 'SECURITY' },
          ]} />
      </div>

      {/* settings list */}
      <div style={{ padding: '14px 16px 24px' }}>
        <SectionLabel style={{ marginBottom: 10 }}>{u.lang === 'tr' ? 'HESAP' : 'ACCOUNT'}</SectionLabel>
        <div style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden',
        }}>
          <SettingRow icon="cardIcon" tint={u.accent} label={u.c.paymentMethods} sub={u.lang === 'tr' ? '2 kart kayıtlı' : '2 cards on file'} />
          <RowDivider />
          <SettingRow icon="doc" tint={u.accent} label={u.c.documents} sub={u.lang === 'tr' ? 'Pasaport · ehliyet' : 'Passport · license'} />
          <RowDivider />
          <button onClick={() => nav('routes')} style={settingRowBtn}>
            <SettingRow icon="star" tint={{ ...u.accent, bg: '#B7312C' }}
              label={u.lang === 'tr' ? 'Kayıtlı Rotalarım' : 'Saved Routes'}
              sub={u.lang === 'tr' ? '3 rota · 1 ödeme bekliyor' : '3 routes · 1 awaiting payment'} />
          </button>
          <RowDivider />
          <button onClick={() => setPnrOpen(true)} style={settingRowBtn}>
            <SettingRow icon="plane" tint={{ ...u.accent, bg: '#C5A059' }}
              label={u.lang === 'tr' ? 'Rezervasyonu hesaba ekle' : 'Link booking to account'}
              sub={u.lang === 'tr' ? 'PNR ile · 6 karakter' : 'With PNR · 6 characters'}
              badge={u.lang === 'tr' ? 'PNR' : 'PNR'}
            />
          </button>
          <RowDivider />
          <SettingRow icon="bellAlt" tint={u.accent} label={u.lang === 'tr' ? 'Bildirim ayarları' : 'Notifications'} sub={u.lang === 'tr' ? 'Uçuş & fiyat alarmları' : 'Flight & price alerts'} />
        </div>

        <SectionLabel style={{ margin: '18px 0 10px' }}>{u.c.settings.toUpperCase()}</SectionLabel>
        <div style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden',
        }}>
          <SettingRow icon="globe" tint={u.accent} label={u.c.language} sub={u.lang === 'tr' ? 'Türkçe (TR)' : 'English (EN)'} />
          <RowDivider />
          <SettingRow icon="moon" tint={u.accent} label={u.lang === 'tr' ? 'Görünüm' : 'Appearance'} sub={u.lang === 'tr' ? 'Otomatik (cihaz)' : 'Auto (device)'} />
          <RowDivider />
          <SettingRow icon="shield" tint={u.accent} label={u.c.privacy} sub={u.lang === 'tr' ? 'KVKK · veri tercihleri' : 'Data preferences'} />
        </div>

        <SectionLabel style={{ margin: '18px 0 10px' }}>{u.lang === 'tr' ? 'SEYAHAT' : 'TRAVEL'}</SectionLabel>
        <div style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden',
        }}>
          <button onClick={() => nav('travelPrefs')} style={settingRowBtn}>
            <SettingRow icon="edit" tint={{ ...u.accent, bg: '#B7312C' }}
              label={u.lang === 'tr' ? 'Seyahat Tercihleri' : 'Travel Preferences'}
              sub={u.lang === 'tr' ? 'Hız · ilgi · bütçe · konaklama' : 'Pace · interests · budget · stays'}
              badge={thyHasPrefs && thyHasPrefs() ? (u.lang === 'tr' ? 'AÇIK' : 'ON') : null}
            />
          </button>
          <RowDivider />
          <button onClick={() => nav('history')} style={settingRowBtn}>
            <SettingRow icon="history" tint={u.accent} label={u.lang === 'tr' ? 'Uçuş geçmişi' : 'Flight history'} sub="42 uçuş · 18 ülke" />
          </button>
          <RowDivider />
          <button onClick={() => nav('lounge')} style={settingRowBtn}>
            <SettingRow icon="coffee" tint={u.accent} label={u.lang === 'tr' ? 'Lounge erişimi' : 'Lounge access'} sub={u.lang === 'tr' ? 'Elite Plus · sınırsız' : 'Elite Plus · unlimited'} />
          </button>
          <RowDivider />
          <button onClick={() => nav('help')} style={settingRowBtn}>
            <SettingRow icon="headset" tint={u.accent} label={u.lang === 'tr' ? 'Yardım merkezi' : 'Help center'} sub={u.lang === 'tr' ? '7/24 destek' : 'Support 24/7'} />
          </button>
        </div>

        <ThyButton variant="secondary" size="lg" fullWidth icon="→"
          onClick={() => toast({ type: 'info', icon: '⚠', children: u.lang === 'tr' ? 'Çıkış yapıldı' : 'Signed out' })}
          style={{ marginTop: 16, color: u.accent.bg, borderColor: u.accent.bg + '55' }}
        >
          {u.c.signOut}
        </ThyButton>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 10, color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
          v2.4.1 · TRIP-0042
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <AppTabBar active="me" onChange={(id) => nav(id === 'home' ? 'board' : id === 'search' ? 'search' : id === 'map' ? 'map' : id === 'wallet' ? 'ms' : 'profile')} {...u} />
      </div>

      <PNRModal open={pnrOpen} onClose={() => setPnrOpen(false)}
        lang={u.lang} accent={u.accent} nav={nav} />
    </div>
  );
}

function ProfileStat({ label, v }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 20, color: '#0A1628', letterSpacing: -0.3 }}>{v}</div>
      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700, letterSpacing: 1, marginTop: 2, textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}
function Divider() {
  return <div style={{ width: 1, background: '#E2E8F0' }} />;
}
const settingRowBtn = {
  width: '100%', background: 'transparent', border: 'none', padding: 0,
  cursor: 'pointer', textAlign: 'left', display: 'block',
};
function SettingRow({ icon, tint, label, sub, badge }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 14px', cursor: 'pointer',
    }}>
      <span style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: `${tint.bg}14`, color: tint.bg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon name={icon} size={16} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#0A1628' }}>{label}</span>
          {badge && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 800,
              letterSpacing: 1.2, color: '#9B7E3D',
              background: 'rgba(197,160,89,0.16)',
              padding: '1px 6px', borderRadius: 4,
            }}>{badge}</span>
          )}
        </div>
        {sub && <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{sub}</div>}
      </div>
      <Icon name="chevR" size={14} color="#94A3B8" />
    </div>
  );
}

Object.assign(window, {
  MapScreen, CoPilotScreen, MilesScreen, NotificationsScreen, ProfileScreen,
});
