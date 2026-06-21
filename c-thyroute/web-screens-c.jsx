// web-screens-c.jsx — Seat, Passenger, Baggage, Checkout, Confirm (desktop)
// Each screen keeps its own visual reference, scaled up for desktop.

// Turkish landmark icon set used by the seat-memory mini-game (web).
const LANDMARK_IDS_W = ['gal','ata','bos','lik','agr','gob','kap','pam','nem','aya','sum','kiz'];
const LANDMARK_NAMES_W = {
  gal: { tr: 'Galata Kulesi',     en: 'Galata Tower' },
  ata: { tr: 'Atakule',           en: 'Atakule' },
  bos: { tr: 'Boğaz Köprüsü',     en: 'Bosphorus Bridge' },
  lik: { tr: 'Likya Mezarları',   en: 'Lycian Tombs' },
  agr: { tr: 'Ağrı Dağı',         en: 'Mt Ararat' },
  gob: { tr: 'Göbeklitepe',       en: 'Göbeklitepe' },
  kap: { tr: 'Kapadokya',         en: 'Cappadocia' },
  pam: { tr: 'Pamukkale',         en: 'Pamukkale' },
  nem: { tr: 'Nemrut Dağı',       en: 'Mt Nemrut' },
  aya: { tr: 'Ayasofya',          en: 'Hagia Sophia' },
  sum: { tr: 'Sümela Manastırı',  en: 'Sumela Monastery' },
  kiz: { tr: 'Kız Kulesi',         en: "Maiden's Tower" },
};
function LandmarkW({ id, size = 16, color = 'currentColor' }) {
  const sw = size < 18 ? 1.7 : 1.4;
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  const I = {
    gal: <g><rect x="8" y="8" width="8" height="13" rx="0.5"/><path d="M7 8 L12 3 L17 8 Z"/><line x1="10" y1="13" x2="14" y2="13"/><line x1="10" y1="17" x2="14" y2="17"/></g>,
    ata: <g><line x1="12" y1="3" x2="12" y2="21"/><circle cx="12" cy="9" r="3.5"/><line x1="8" y1="21" x2="16" y2="21"/></g>,
    bos: <g><line x1="2" y1="19" x2="22" y2="19"/><line x1="6" y1="19" x2="6" y2="6"/><line x1="18" y1="19" x2="18" y2="6"/><path d="M6 7 Q12 13 18 7"/><path d="M6 7 L18 17 M18 7 L6 17" strokeWidth={sw*0.6}/></g>,
    lik: <g><path d="M3 8 L21 8 L18 5 L6 5 Z"/><line x1="6" y1="8" x2="6" y2="20"/><line x1="10" y1="8" x2="10" y2="20"/><line x1="14" y1="8" x2="14" y2="20"/><line x1="18" y1="8" x2="18" y2="20"/><line x1="3" y1="20" x2="21" y2="20"/></g>,
    agr: <g><path d="M2 20 L9 7 L13 13 L17 5 L22 20 Z"/><path d="M7 11 L9 9 L11 11 M15 8 L17 6 L19 8" strokeWidth={sw*0.7}/></g>,
    gob: <g><rect x="4" y="4" width="16" height="4" rx="0.5"/><rect x="10" y="8" width="4" height="13"/></g>,
    kap: <g><ellipse cx="12" cy="9" rx="6" ry="5.5"/><line x1="8" y1="14" x2="10" y2="17"/><line x1="16" y1="14" x2="14" y2="17"/><line x1="12" y1="14" x2="12" y2="17"/><rect x="10" y="17" width="4" height="3"/></g>,
    pam: <g><path d="M3 20 L8 20 L8 16 L13 16 L13 11 L18 11 L18 6 L21 6"/><path d="M3 21 L21 21"/></g>,
    nem: <g><path d="M12 3 C16 3 18 7 18 11 C18 14 17 15 17 19 L7 19 C7 15 6 14 6 11 C6 7 8 3 12 3 Z"/><circle cx="10" cy="11" r="0.6" fill={color} stroke="none"/><circle cx="14" cy="11" r="0.6" fill={color} stroke="none"/><path d="M3 21 L21 21"/></g>,
    aya: <g><path d="M5 18 Q5 8 12 8 Q19 8 19 18"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="3" y1="5" x2="3" y2="18"/><line x1="21" y1="5" x2="21" y2="18"/><circle cx="3" cy="4" r="0.8" fill={color} stroke="none"/><circle cx="21" cy="4" r="0.8" fill={color} stroke="none"/><line x1="3" y1="20" x2="21" y2="20"/></g>,
    sum: <g><path d="M4 21 L4 6 L9 4 L20 4 L20 21 Z"/><rect x="7" y="10" width="2" height="3"/><rect x="11" y="10" width="2" height="3"/><rect x="15" y="10" width="2" height="3"/><path d="M2 21 Q12 23 22 21"/></g>,
    kiz: <g><circle cx="12" cy="7" r="1.5"/><line x1="12" y1="3" x2="12" y2="7"/><rect x="9.5" y="8.5" width="5" height="9"/><path d="M8 17.5 L16 17.5"/><path d="M2 20 Q7 18 12 20 Q17 22 22 20"/></g>,
  };
  return <svg {...common}>{I[id]}</svg>;
}

// 11 ─── SEAT MAP — Swiss/blueprint, two-column ─────────────────
function WebSeatMapScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const toast = useToast();

  const rows = Array.from({ length: 30 }, (_, i) => i + 1);
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const occupied = React.useMemo(() => new Set(['3A','3B','3F','4D','5A','5C','7E','8B','9F','11A','11B','12D','14A','14B','16E','17F','19C','19D','20A','22F','24B','25E','27A','27B','28D','30C']), []);
  const exitRows = new Set([12, 13, 25, 26]);

  const SYMBOLS = LANDMARK_IDS_W;
  const [seed, setSeed] = React.useState(0);
  const symbolMap = React.useMemo(() => {
    const free = [];
    for (const r of rows) for (const c of cols) {
      const id = `${r}${c}`; if (!occupied.has(id)) free.push(id);
    }
    const pairs = Math.floor(free.length / 2);
    const deck = [];
    for (let i = 0; i < pairs; i++) {
      const s = SYMBOLS[i % SYMBOLS.length]; deck.push(s, s);
    }
    while (deck.length < free.length) deck.push(SYMBOLS[0]);
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    const map = {}; free.forEach((id, i) => { map[id] = deck[i]; });
    return map;
  }, [occupied, seed]);

  const [revealed, setRevealed] = React.useState(() => new Set());
  const [matched, setMatched]   = React.useState(() => new Set());
  const [moves, setMoves]       = React.useState(0);
  const [misses, setMisses]     = React.useState(0);
  const [startedAt, setStartedAt] = React.useState(null);
  const [nowT, setNowT]         = React.useState(Date.now());
  const [busy, setBusy]         = React.useState(false);

  React.useEffect(() => {
    if (!startedAt) return;
    const id = setInterval(() => setNowT(Date.now()), 250);
    return () => clearInterval(id);
  }, [startedAt]);
  const elapsedSec = startedAt ? Math.floor((nowT - startedAt) / 1000) : 0;
  const totalPairs = Math.floor(Object.keys(symbolMap).length / 2);
  const foundPairs = matched.size / 2;

  const flip = (id) => {
    if (busy || occupied.has(id) || matched.has(id) || revealed.has(id)) return;
    if (!startedAt) setStartedAt(Date.now());
    const next = new Set(revealed); next.add(id);
    if (next.size === 1) { setRevealed(next); return; }
    setRevealed(next); setMoves(m => m + 1); setBusy(true);
    const arr = [...next];
    if (symbolMap[arr[0]] === symbolMap[arr[1]]) {
      setTimeout(() => {
        const m = new Set(matched); arr.forEach(x => m.add(x));
        setMatched(m); setRevealed(new Set()); setBusy(false);
        toast({ type: 'success', icon: '✓', children: `+10 mil · ${LANDMARK_NAMES_W[symbolMap[arr[0]]][u.lang]}` });
      }, 380);
    } else {
      setMisses(x => x + 1);
      setTimeout(() => { setRevealed(new Set()); setBusy(false); }, 800);
    }
  };
  const restart = () => {
    setRevealed(new Set()); setMatched(new Set());
    setMoves(0); setMisses(0); setStartedAt(null); setSeed(s => s + 1);
  };

  return (
    <PageShell style={{
      background: 'repeating-linear-gradient(0deg, transparent 0 23px, rgba(10,22,40,0.04) 23px 24px), repeating-linear-gradient(90deg, transparent 0 23px, rgba(10,22,40,0.04) 23px 24px), #F5F3EC',
    }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />

      {/* Technical header */}
      <div style={{ background: '#0A1628', color: '#fff', padding: '20px 32px', borderBottom: '2px solid #B7312C' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => nav('results')} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6, padding: '8px 12px', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600,
          }}>← {u.lang==='tr'?'Sonuçlar':'Results'}</button>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#7A8EAF', letterSpacing: 2 }}>
            SHEET 11/23 · SEAT MAP · DWG-001
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500, letterSpacing: -0.5 }}>TK·1853</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#B2C0D1' }}>A321neo · IST → FCO · 17 Haz · 14:25</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px',
        display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
        {/* Fuselage */}
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2.5, color: '#64748B', textTransform: 'uppercase' }}>
            {u.lang==='tr'?'KOLTUK SEÇİMİ':'SEAT SELECTION'} · 180/180 · 154 {u.lang==='tr'?'müsait':'free'}
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700,
            margin: '6px 0 4px', letterSpacing: -0.8, color: '#0A1628' }}>
            {u.lang==='tr'?'Yerinizi seçin.':'Pick your seat.'}
          </h1>
          <p style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
            fontSize: 15, color: '#64748B', margin: '0 0 14px' }}>
            {u.lang==='tr'
              ? 'Bir koltuğa dokunun · çiftleri bulun · mil kazanın'
              : 'Tap a seat · find the pairs · earn miles'}
          </p>

          <div style={{ display: 'flex', gap: 16, fontSize: 11, fontFamily: "'DM Mono', monospace", color: '#64748B', marginBottom: 14 }}>
            <Legend swatch="#fff" border="#0A1628">{u.lang==='tr'?'Müsait':'Free'}</Legend>
            <Legend swatch="#0A1628" border="#0A1628">{u.lang==='tr'?'Açık':'Up'}</Legend>
            <Legend swatch="rgba(14,122,95,0.12)" border="#0E7A5F">{u.lang==='tr'?'Eşleşti':'Matched'}</Legend>
            <Legend swatch="#E2E8F0" border="#94A3B8" hatched>{u.lang==='tr'?'Dolu':'Taken'}</Legend>
            <Legend swatch="rgba(197,160,89,0.12)" border="#C5A059">{u.lang==='tr'?'Çıkış':'Exit'}</Legend>
          </div>

          <div style={{ background: '#fff', border: '1.5px solid #0A1628',
            borderRadius: '80px 80px 24px 24px', padding: '40px 60px 20px',
            position: 'relative', boxShadow: '0 1px 0 #0A1628, 0 12px 24px rgba(10,22,40,0.08)' }}>
            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
              fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 2, color: '#64748B' }}>↑ COCKPIT</div>
            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '22px repeat(3, 1fr) 20px repeat(3, 1fr)', gap: 6, marginBottom: 8 }}>
              <span />
              {cols.slice(0,3).map(c => <ColHead key={c}>{c}</ColHead>)}
              <span />
              {cols.slice(3).map(c => <ColHead key={c}>{c}</ColHead>)}
            </div>
            {rows.map(r => (
              <div key={r} style={{ display: 'grid', gridTemplateColumns: '22px repeat(3, 1fr) 20px repeat(3, 1fr)', gap: 6, marginBottom: 6 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#64748B', textAlign: 'right', paddingRight: 4 }}>{r}</span>
                {cols.slice(0,3).map(c => (
                  <Seat key={c} id={`${r}${c}`}
                    occupied={occupied.has(`${r}${c}`)}
                    revealed={revealed.has(`${r}${c}`)}
                    matched={matched.has(`${r}${c}`)}
                    symbol={symbolMap[`${r}${c}`]}
                    flip={flip} exit={exitRows.has(r)} />
                ))}
                <span />
                {cols.slice(3).map(c => (
                  <Seat key={c} id={`${r}${c}`}
                    occupied={occupied.has(`${r}${c}`)}
                    revealed={revealed.has(`${r}${c}`)}
                    matched={matched.has(`${r}${c}`)}
                    symbol={symbolMap[`${r}${c}`]}
                    flip={flip} exit={exitRows.has(r)} />
                ))}
              </div>
            ))}
            <div style={{ marginTop: 14, textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 2, color: '#64748B' }}>↓ TAIL</div>
          </div>
        </div>

        {/* Game summary panel */}
        <div style={{ position: 'sticky', top: 90, height: 'fit-content', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: '#0A1628', color: '#fff', padding: '24px 26px',
            borderRadius: 4, boxShadow: '8px 8px 0 #B7312C',
          }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#7A8EAF', letterSpacing: 2, marginBottom: 14 }}>
              {u.lang==='tr'?'OYUN — KOLTUK EŞLEŞTİRME':'GAME — SEAT MEMORY MATCH'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 80, height: 80, border: '2px solid #C5A059',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: '#C5A059', lineHeight: 1 }}>
                {foundPairs >= totalPairs
                  ? <span style={{ fontSize: 38 }}>★</span>
                  : (foundPairs > 0
                      ? <LandmarkW id={SYMBOLS[(foundPairs - 1) % SYMBOLS.length]} size={44} color="#C5A059" />
                      : <LandmarkW id="kap" size={44} color="#C5A059" />)
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 32,
                  color: '#fff', letterSpacing: -0.5, lineHeight: 1 }}>
                  {String(Math.floor(elapsedSec/60)).padStart(2,'0')}:{String(elapsedSec%60).padStart(2,'0')}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#B2C0D1', marginTop: 6, letterSpacing: 1 }}>
                  {foundPairs}/{totalPairs} {u.lang==='tr'?'çift bulundu':'pairs found'}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <MiniStat label={u.lang==='tr'?'HAMLE':'MOVES'} value={moves} dark />
              <MiniStat label={u.lang==='tr'?'HATA':'MISS'} value={misses} dark />
              <MiniStat label={u.lang==='tr'?'+ MİL':'+ MILES'} value={`+${foundPairs * 10}`} dark />
              <MiniStat label={u.lang==='tr'?'KALAN':'LEFT'} value={totalPairs - foundPairs} dark />
            </div>
            <button onClick={restart} style={{
              marginTop: 18, width: '100%', padding: '10px 14px',
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4,
              fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 11,
              letterSpacing: 1.5, cursor: 'pointer',
            }}>↻ {u.lang==='tr'?'YENİDEN':'RESTART'}</button>
            <button onClick={() => {
              toast({ type: 'success', icon: '✈', children: u.lang==='tr'?'Koltuğunuz: 14F':'Your seat: 14F' });
              setTimeout(() => nav('passenger'), 500);
            }} style={{
              marginTop: 10, width: '100%', padding: '14px 18px',
              background: '#B7312C', color: '#fff', border: 'none',
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14,
              cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase',
            }}>{u.lang==='tr'?'Devam →':'Continue →'}</button>
          </div>
          <div style={{
            background: '#fff', border: '1px solid #E2E8F0', borderRadius: 4, padding: 18,
            fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
            fontSize: 14, color: '#525252', lineHeight: 1.55,
          }}>
            {u.lang==='tr'
              ? 'Koltuklara dokundukça altında gizli bir sembol açılır. Aynı sembolden iki tane bulun, kalsin ve mil kazanın. Yolculuğunuzun en sakin oyunu.'
              : 'Tap a seat to reveal a hidden glyph. Find two of the same to keep them open and earn miles. The calmest game of your journey.'}
            <div style={{ marginTop: 10, fontFamily: "'DM Mono', monospace", fontStyle: 'normal',
              fontSize: 10, letterSpacing: 2, color: '#94A3B8' }}>— ARGE · TK CABIN LAB</div>
          </div>
        </div>
      </div>
      <div style={{ height: 60 }} />
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}
function ColHead({ children }) {
  return <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#64748B', textAlign: 'center' }}>{children}</span>;
}
function Legend({ swatch, border, hatched, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 14, height: 14,
        background: hatched ? 'repeating-linear-gradient(45deg, #94A3B8 0 2px, transparent 2px 5px), ' + swatch : swatch,
        border: `1px solid ${border}` }} />
      {children}
    </span>
  );
}
function Seat({ id, occupied, revealed, matched, symbol, flip, exit }) {
  const isUp = revealed || matched;
  let bg = '#fff', bd = '#0A1628', col = '#0A1628', curs = 'pointer';
  if (occupied) {
    bg = 'repeating-linear-gradient(45deg, #94A3B8 0 1.5px, transparent 1.5px 4px), #E2E8F0';
    bd = '#94A3B8'; col = '#94A3B8'; curs = 'not-allowed';
  } else if (matched) {
    bg = 'rgba(14,122,95,0.12)'; bd = '#0E7A5F'; col = '#0E7A5F';
  } else if (revealed) {
    bg = '#0A1628'; bd = '#0A1628'; col = '#C5A059';
  } else if (exit) {
    bg = 'rgba(197,160,89,0.12)'; bd = '#C5A059';
  }
  return (
    <button disabled={occupied} onClick={() => flip(id)} style={{
      width: '100%', aspectRatio: '1 / 1', borderRadius: 3,
      background: bg, border: `1px solid ${bd}`, color: col, cursor: curs,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: 0,
      boxShadow: matched ? 'inset 0 0 0 1px #0E7A5F' : 'none',
      transition: 'background 200ms, color 200ms, border-color 200ms',
    }}>{isUp ? <LandmarkW id={symbol} size={15} color={col} /> : ''}</button>
  );
}
function seatTitle(id, u) {
  const r = parseInt(id, 10); const c = id.slice(-1);
  const win = ['A','F'].includes(c) ? (u.lang==='tr'?'Pencere':'Window') : null;
  const ai  = ['C','D'].includes(c) ? (u.lang==='tr'?'Koridor':'Aisle') : null;
  const mid = ['B','E'].includes(c) ? (u.lang==='tr'?'Orta':'Middle') : null;
  return `${id} · Economy · ${win || ai || mid}${r <= 8 ? ' · Comfort' : ''}`;
}
function seatPrice(id) {
  const r = parseInt(id, 10); const c = id.slice(-1);
  if (r <= 8) return '+ 380 TL';
  if (['A','F'].includes(c)) return '+ 80 TL';
  return '+ 0 TL';
}

// 12 ─── PASSENGER INFO — Editorial (Le Monde, serif underline) ──
function WebPassengerInfoScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const toast = useToast();
  const [form, setForm] = React.useState({
    title: 'Ms', first: 'Aylin', last: 'Kaya', dob: '12 / 03 / 1991',
    nationality: 'TR', passport: 'U 12 345 678', email: 'aylin.kaya@example.com', phone: '+90 555 432 18 76',
  });
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <PageShell style={{ background: '#F5F1E8' }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />
      <div style={{ borderBottom: '3px double #0A1628', padding: '32px 32px 20px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => nav('seat')} style={{
              background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
              fontFamily: "'EB Garamond', serif", fontSize: 15, fontStyle: 'italic', color: '#0A1628',
            }}>← {u.lang==='tr'?'geri':'back'}</button>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 12, letterSpacing: 5, textTransform: 'uppercase' }}>‹ N° 12 ›</div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 22 }}>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 11, letterSpacing: 6, fontStyle: 'italic' }}>
              {u.lang==='tr'?'Le Voyageur · Bölüm I':'The Traveler · Chapter I'}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 56, fontWeight: 900,
              margin: '6px 0 0', letterSpacing: -1.5, lineHeight: 1 }}>
              {u.lang==='tr'?'Kim seyahat ediyor?':'Who is travelling?'}
            </h1>
            <div style={{ marginTop: 8, fontSize: 14, fontStyle: 'italic', color: '#525252' }}>
              {u.lang==='tr'?'— Pasaportta yazdığı gibi giriniz —':'— enter exactly as on passport —'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 32px',
        display: 'grid', gridTemplateColumns: '1fr 320px', gap: 36 }}>
        <div>
          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, lineHeight: 1.6, color: '#0A1628', marginBottom: 24 }}>
            <span style={{ float: 'left', fontFamily: "'Playfair Display', serif", fontSize: 76,
              lineHeight: 0.85, color: '#B7312C', paddingRight: 10, paddingTop: 4, fontWeight: 700 }}>Y</span>
            {u.lang==='tr'
              ? 'olcu 1 / 1 — bu bilgiler bilet üzerinde gözükecek ve sınır kontrolünde sorulacaktır.'
              : 'olcu 1 / 1 — these details appear on the boarding pass and will be checked at the border.'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 24, marginBottom: 20 }}>
            <EditField label={u.lang==='tr'?'Hitap':'Title'} value={form.title} onChange={upd('title')} />
            <EditField label={u.lang==='tr'?'Ad':'First name'} value={form.first} onChange={upd('first')} />
            <EditField label={u.lang==='tr'?'Soyad':'Last name'} value={form.last} onChange={upd('last')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', gap: 24, marginBottom: 28 }}>
            <EditField label={u.lang==='tr'?'Doğum tarihi':'Birth date'} value={form.dob} onChange={upd('dob')} mono />
            <EditField label={u.lang==='tr'?'Uyruk':'Nationality'} value={form.nationality} onChange={upd('nationality')} mono />
            <EditField label={u.lang==='tr'?'Pasaport no':'Passport no.'} value={form.passport} onChange={upd('passport')} mono />
          </div>
          <div style={{ borderTop: '1px solid #0A162833', paddingTop: 20 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 18, color: '#525252', marginBottom: 16 }}>
              {u.lang==='tr'?'Sizi nasıl bulalım?':'How may we reach you?'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <EditField label="E-mail" value={form.email} onChange={upd('email')} />
              <EditField label={u.lang==='tr'?'Telefon':'Phone'} value={form.phone} onChange={upd('phone')} mono />
            </div>
          </div>

          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => {
              toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Yolcu bilgileri kaydedildi':'Passenger info saved' });
              setTimeout(() => nav('baggage'), 500);
            }} style={{
              background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
              fontSize: 22, color: '#B7312C', borderBottom: '1px solid #B7312C',
            }}>
              {u.lang==='tr'?'Bagaja geç':'On to baggage'} →
            </button>
          </div>
        </div>

        {/* Sidebar — M&S + summary */}
        <aside style={{ position: 'sticky', top: 90, height: 'fit-content',
          padding: '20px 22px', background: '#fff', border: '1px solid #D4D4C8', borderRadius: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%',
              background: 'linear-gradient(135deg, #E8C97A, #C5A059)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0A1628', fontWeight: 800,
              fontFamily: "'Playfair Display', serif", fontSize: 22 }}>✦</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700 }}>Miles&amp;Smiles</div>
              <div style={{ fontStyle: 'italic', fontSize: 12, color: '#525252' }}>Elite Plus · 87.420 mi</div>
            </div>
          </div>
          <div style={{ marginTop: 14, fontStyle: 'italic', fontSize: 12, color: '#525252', lineHeight: 1.5 }}>
            {u.lang==='tr'?'Bu uçuştan tahmini':'Estimated from this flight'}
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, color: '#0A1628', marginTop: 4, fontStyle: 'normal', fontWeight: 600 }}>
              +2 840 mi
            </div>
          </div>
          <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid #D4D4C8' }}>
            <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 11, letterSpacing: 2, color: '#525252', textTransform: 'uppercase' }}>{u.lang==='tr'?'Bilet özeti':'Ticket summary'}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, marginTop: 8, color: '#0A1628' }}>
              IST → FCO · 17 Haz · 14:25<br/>
              TK 1853 · Seat 14F · EcoFly
            </div>
          </div>
        </aside>
      </div>
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}
function EditField({ label, value, onChange, mono }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 13, fontStyle: 'italic', color: '#525252', letterSpacing: 0.5 }}>{label}</span>
      <input value={value} onChange={onChange}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          padding: '6px 0', border: 'none',
          borderBottom: `1px solid ${focus ? '#B7312C' : '#0A1628'}`,
          background: 'transparent', outline: 'none',
          fontFamily: mono ? "'DM Mono', monospace" : "'EB Garamond', serif",
          fontSize: mono ? 16 : 20, color: '#0A1628', fontWeight: mono ? 500 : 400,
        }} />
    </label>
  );
}

// 13 ─── BAGGAGE — Playful sticker pastels ──────────────────────
function WebBaggageScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const toast = useToast();
  const [bags, setBags] = React.useState({ cabin: 1, b20: 1, b30: 0, sport: 0 });
  const total = bags.b20 * 320 + bags.b30 * 520 + bags.sport * 480;

  return (
    <PageShell style={{ background: 'radial-gradient(circle at 20% 0%, #FFE9B8 0%, #FFD485 35%, #FFC468 100%)' }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px',
        display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => nav('passenger')} style={{
              background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: 999,
              padding: '8px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>← {u.lang==='tr'?'geri':'back'}</button>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3 }}>STEP 13 / 23</span>
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 92, lineHeight: 0.9,
            letterSpacing: -1.5, textTransform: 'uppercase', margin: '20px 0 8px' }}>
            {u.lang==='tr'?'BAGAJ\nNE OLSUN?':'PACK\nIT UP.'}
          </h1>
          <div style={{ fontSize: 15, color: '#1B1B1B99', fontWeight: 500, maxWidth: 380, marginBottom: 18 }}>
            {u.lang==='tr'?'Şimdi eklemek havalimanı fiyatından %30 daha ucuz.':'Add now for 30% off airport pricing.'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <BagCardWeb emoji="🎒" tag={u.lang==='tr'?'DAHİL':'INCLUDED'} tagColor="#22C55E"
              title={u.lang==='tr'?'Kabin bagajı':'Cabin bag'} desc="55 × 40 × 23 cm · 8 kg"
              price={0} count={bags.cabin} locked />
            <BagCardWeb emoji="🧳" tag={u.lang==='tr'?'POPÜLER':'POPULAR'} tagColor="#B7312C"
              title={u.lang==='tr'?'Valiz · 20 kg':'Checked · 20 kg'} desc={u.lang==='tr'?'Hafta sonu için ideal':'Weekend ready'}
              price={320} count={bags.b20} setCount={(v) => setBags({ ...bags, b20: Math.max(0, Math.min(3, v)) })} />
            <BagCardWeb emoji="🧳" tag="" title={u.lang==='tr'?'Valiz · 30 kg':'Checked · 30 kg'} desc={u.lang==='tr'?'Uzun yolculuk için':'For longer trips'}
              price={520} count={bags.b30} setCount={(v) => setBags({ ...bags, b30: Math.max(0, Math.min(3, v)) })} />
            <BagCardWeb emoji="🎿" tag={u.lang==='tr'?'YENİ':'NEW'} tagColor="#0053A5"
              title={u.lang==='tr'?'Spor ekipmanı':'Sports gear'} desc={u.lang==='tr'?'Kayak · bisiklet · sörf':'Skis · bike · surfboard'}
              price={480} count={bags.sport} setCount={(v) => setBags({ ...bags, sport: Math.max(0, Math.min(2, v)) })} />
          </div>
        </div>

        {/* Total card */}
        <aside style={{ position: 'sticky', top: 90, height: 'fit-content',
          background: '#0A1628', color: '#fff', borderRadius: 24, padding: 24 }}>
          <div style={{ fontSize: 11, color: '#7A8EAF', letterSpacing: 2, textTransform: 'uppercase' }}>
            {u.lang==='tr'?'BAGAJ TOPLAMI':'BAGGAGE TOTAL'}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, letterSpacing: 1 }}>{total.toLocaleString('tr-TR')}</span>
            <span style={{ fontSize: 14, color: '#B2C0D1' }}>TL</span>
          </div>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
            <Row label={u.lang==='tr'?'Bilet':'Ticket'} value="7 580" />
            <Row label="Seat 14F" value="80" />
            <Row label={u.lang==='tr'?'Bagaj':'Baggage'} value={total.toLocaleString('tr-TR')} />
          </div>
          <div style={{ marginTop: 18 }}>
            <ThyButton variant="gold" size="lg" fullWidth icon="→" onClick={() => {
              toast({ type: 'success', icon: '🧳', children: u.lang==='tr'?'Bagaj eklendi':'Baggage added' });
              setTimeout(() => nav('confirm'), 500);
            }}>{u.lang==='tr'?'Onaya geç':'Continue'}</ThyButton>
          </div>
        </aside>
      </div>
      <div style={{ height: 60 }} />
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}
function BagCardWeb({ emoji, tag, tagColor = '#0A1628', title, desc, price, count, setCount, locked }) {
  return (
    <div style={{
      position: 'relative', background: '#FFFBF1', borderRadius: 18,
      padding: '20px 24px 20px 110px', border: '1.5px solid rgba(0,0,0,0.06)',
      boxShadow: '0 10px 24px rgba(167,108,11,0.18)', transform: 'rotate(-0.2deg)',
    }}>
      <div style={{
        position: 'absolute', left: 22, top: '50%', transform: 'translateY(-50%) rotate(-8deg)',
        width: 72, height: 72, borderRadius: 16,
        background: '#fff', border: '2px solid #1B1B1B',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, boxShadow: '3px 3px 0 #1B1B1B',
      }}>{emoji}</div>
      {tag && (
        <div style={{ position: 'absolute', top: -10, right: 16, background: tagColor, color: '#fff',
          padding: '4px 10px', borderRadius: 4,
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 1.5,
          transform: 'rotate(3deg)' }}>{tag}</div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 20, lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 13, color: '#1B1B1B99', marginTop: 4 }}>{desc}</div>
          <div style={{ marginTop: 8, fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 14 }}>
            {price === 0 ? (count ? '— ücretsiz —' : '') : `+ ${price} TL`}
          </div>
        </div>
        {!locked && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10,
            background: '#1B1B1B', borderRadius: 999, padding: '4px 4px' }}>
            <button onClick={() => setCount(count - 1)} style={pillBtn}>−</button>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, minWidth: 18, textAlign: 'center' }}>{count}</span>
            <button onClick={() => setCount(count + 1)} style={pillBtn}>+</button>
          </div>
        )}
        {locked && (
          <span style={{ padding: '6px 14px', background: 'rgba(0,0,0,0.08)', borderRadius: 999,
            fontSize: 13, fontWeight: 700 }}>✓</span>
        )}
      </div>
    </div>
  );
}
const pillBtn = {
  width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
  background: '#fff', color: '#1B1B1B', fontWeight: 800, fontSize: 16,
};
function Row({ label, value }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span style={{ color: '#7A8EAF' }}>{label}</span>
    <span style={{ fontFamily: "'DM Mono', monospace" }}>{value} TL</span>
  </div>;
}

// 14 ─── CHECKOUT — Fintech / Stripe ───────────────────────────
function WebCheckoutScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const toast = useToast();
  const [card, setCard] = React.useState('4218');
  const [busy, setBusy] = React.useState(false);
  const pay = () => {
    setBusy(true);
    toast({ type: 'info', icon: '⟳', children: u.lang==='tr'?'Ödeme işleniyor…':'Processing…' });
    setTimeout(() => {
      setBusy(false);
      toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Ödeme onaylandı':'Payment approved' });
      setTimeout(() => nav('confirm'), 500);
    }, 1400);
  };
  return (
    <PageShell style={{ background: '#FAFAFA', color: '#0A0A0A', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px',
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
        <div>
          <button onClick={() => nav('baggage')} style={{
            background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
            color: '#737373', fontSize: 13, marginBottom: 16,
          }}>← {u.lang==='tr'?'geri':'back'}</button>

          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: 0.3, color: '#737373', textTransform: 'uppercase' }}>
            {u.lang==='tr'?'Ödeme':'Checkout'}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 56, fontWeight: 500, letterSpacing: -2 }}>8 420,00</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, color: '#737373' }}>TL</span>
          </div>
          <div style={{ fontSize: 14, color: '#737373', marginTop: 2 }}>
            TK 1853 · 1 pax · EcoFly · 17 Haz
          </div>

          {/* Express */}
          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            <button style={{ flex: 1, padding: '14px 16px', borderRadius: 10, background: '#0A0A0A', color: '#fff',
              border: '1px solid #0A0A0A', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 14 }}> Pay</button>
            <button style={{ flex: 1, padding: '14px 16px', borderRadius: 10, background: '#fff', color: '#0A0A0A',
              border: '1px solid #ECECEC', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 14 }}>G Pay</button>
            <button style={{ flex: 1, padding: '14px 16px', borderRadius: 10, background: '#fff', color: '#0A0A0A',
              border: '1px solid #ECECEC', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 14 }}>PayPal</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#A3A3A3', fontSize: 12, margin: '22px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#ECECEC' }} />
            {u.lang==='tr'?'veya kartla':'or pay with card'}
            <div style={{ flex: 1, height: 1, background: '#ECECEC' }} />
          </div>

          {/* Saved cards */}
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, color: '#737373', marginBottom: 10 }}>
            {u.lang==='tr'?'Kayıtlı kartlar':'Saved cards'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SavedCardWeb active={card==='4218'} onClick={() => setCard('4218')} brand="visa" last="4218" name="A. KAYA" exp="08/27" />
            <SavedCardWeb active={card==='9930'} onClick={() => setCard('9930')} brand="mc"   last="9930" name="A. KAYA" exp="11/26" />
            <button onClick={() => setCard('new')} style={{
              padding: '14px 16px', borderRadius: 10,
              border: '1px dashed ' + (card==='new'?'#0A0A0A':'#D4D4D4'),
              background: card==='new'?'#FAFAFA':'#fff',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
              color: '#0A0A0A', textAlign: 'left',
            }}>+ {u.lang==='tr'?'Yeni kart ekle':'Add new card'}</button>
          </div>

          <button disabled={busy} onClick={pay} style={{
            marginTop: 26, width: '100%', padding: '16px 18px', borderRadius: 10,
            background: busy ? '#737373' : '#0A0A0A', color: '#fff', border: 'none',
            cursor: busy?'wait':'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 15, letterSpacing: 0.3,
          }}>
            {busy ? (u.lang==='tr'?'İşleniyor…':'Processing…') : (u.lang==='tr'?'8 420,00 TL öde →':'Pay 8,420.00 TL →')}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontSize: 11, color: '#737373', marginTop: 12 }}>
            <Icon name="shield" size={12} color="#737373" />
            256-bit TLS · PCI DSS
          </div>
        </div>

        {/* Order summary */}
        <aside style={{ position: 'sticky', top: 90, height: 'fit-content',
          background: '#fff', border: '1px solid #ECECEC', borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, color: '#737373', marginBottom: 14 }}>
            {u.lang==='tr'?'Sipariş özeti':'Order summary'}
          </div>
          <Row2 label={u.lang==='tr'?'EcoFly bilet (1)':'EcoFly fare (1)'} value="7 580,00" />
          <Row2 label="14F · Pencere" value="80,00" />
          <Row2 label={u.lang==='tr'?'Bagaj +20kg':'Bag +20kg'} value="320,00" />
          <Row2 label={u.lang==='tr'?'Sigorta':'Insurance'} value="190,00" />
          <Row2 label="KDV" value="250,00" />
          <div style={{ borderTop: '1px solid #ECECEC', marginTop: 10, paddingTop: 10 }}>
            <Row2 total label={u.lang==='tr'?'Toplam':'Total'} value="8 420,00" />
          </div>
        </aside>
      </div>
      <div style={{ height: 60 }} />
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}
function SavedCardWeb({ active, onClick, brand, last, name, exp }) {
  const bg = brand === 'visa' ? '#1A1F71' : '#EB001B';
  const bg2= brand === 'visa' ? '#1A1F71' : '#F79E1B';
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
      border: `1.5px solid ${active?'#0A0A0A':'#ECECEC'}`,
      background: active ? '#FAFAFA' : '#fff', fontFamily: 'inherit', textAlign: 'left',
    }}>
      <div style={{ width: 52, height: 34, borderRadius: 4,
        background: brand==='visa'?bg:`linear-gradient(90deg, ${bg} 50%, ${bg2} 50%)`,
        color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 12, letterSpacing: 1, fontStyle: brand==='visa'?'italic':'normal' }}>{brand==='visa'?'VISA':''}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color: '#0A0A0A' }}>•••• {last}</div>
        <div style={{ fontSize: 12, color: '#737373', marginTop: 2 }}>{name} · {exp}</div>
      </div>
      <span style={{ width: 20, height: 20, borderRadius: '50%',
        border: `2px solid ${active?'#0A0A0A':'#D4D4D4'}`,
        background: active?'#0A0A0A':'transparent', flexShrink: 0, position: 'relative' }}>
        {active && <span style={{ position: 'absolute', inset: 4, borderRadius: '50%', background: '#fff' }} />}
      </span>
    </button>
  );
}
function Row2({ label, value, total }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between',
      padding: '5px 0', fontSize: total ? 15 : 13.5, fontWeight: total ? 700 : 500,
      color: total ? '#0A0A0A' : '#525252' }}>
      <span>{label}</span>
      <span style={{ fontFamily: "'DM Mono', monospace" }}>{value} TL</span>
    </div>
  );
}

// 15 ─── CONFIRMATION — Postcard / vintage travel ──────────────
function WebConfirmationScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const [booking, setBooking, h] = useBooking();
  const toast = useToast();
  const fromC = h.from || findCity('IST');
  const toC   = h.to   || findCity('FCO');
  const pnr = booking.pnr || makePNR(fromC.code, toC.code);
  React.useEffect(() => { if (!booking.pnr) setBooking({ pnr }); }, []);
  const depFmt = formatDateShort(booking.depDate, u.lang);
  const retFmt = formatDateShort(booking.retDate, u.lang);
  const out = booking.outbound || { code: 'TK 1853', dep: '14:25', arr: '16:50', dur: '3s 25dk', fareName: 'EcoFly' };
  const ret = booking.returnSel;
  const titleName = (booking.passenger?.name || 'Aylin');
  return (
    <PageShell style={{
      background: '#F0E4CD',
      backgroundImage: `
        radial-gradient(circle at 20% 12%, rgba(183,49,44,0.05) 0 80px, transparent 100px),
        radial-gradient(circle at 80% 92%, rgba(0,83,165,0.04) 0 100px, transparent 130px),
        repeating-linear-gradient(0deg, transparent 0 28px, rgba(50,30,10,0.02) 28px 29px)
      `,
      fontFamily: "'EB Garamond', Georgia, serif", color: '#1F1A14',
    }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />
      <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-block', padding: '8px 18px',
            border: '2px solid #B7312C', color: '#B7312C',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 8,
            transform: 'rotate(-3deg)', background: '#F0E4CD' }}>
            {u.lang==='tr'?'ONAYLANDI':'CONFIRMED'}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ fontSize: 14, letterSpacing: 4, fontStyle: 'italic' }}>★ ★ ★</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 76,
            margin: '8px 0 0', letterSpacing: -2, lineHeight: 1, color: '#1F1A14' }}>
            {u.lang==='tr'?'İyi yolculuklar,':'Bon voyage,'}<br/>
            <span style={{ fontStyle: 'italic', fontWeight: 500 }}>{titleName}.</span>
          </h1>
          <div style={{ marginTop: 14, fontSize: 17, color: '#1F1A14CC' }}>
            {u.lang==='tr'
              ? `${toC.city} sizi bekliyor — ${depFmt.day} ${depFmt.mo}, ${out.dep}.`
              : `${toC.city} awaits — ${depFmt.day} ${depFmt.mo}, ${out.dep}.`}
          </div>
        </div>

        {/* Postcard ticket */}
        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto',
          background: '#FFFAEC', border: '1px solid #1F1A14',
          padding: '32px 40px 28px', borderRadius: 2,
          boxShadow: '10px 10px 0 #1F1A14, 14px 14px 0 #B7312C' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#525252', letterSpacing: 1.5 }}>PNR</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 500, letterSpacing: 3 }}>{pnr}</div>
            </div>
            <Crane dark={false} size={36} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center', gap: 14, marginTop: 22 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 64, fontWeight: 700, lineHeight: 1 }}>{fromC.code}</div>
              <div style={{ fontSize: 14, fontStyle: 'italic', marginTop: 6 }}>{fromC.city}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, marginTop: 8 }}>{depFmt.day} {depFmt.mo.toUpperCase()} · {out.dep}</div>
            </div>
            <div style={{ position: 'relative', width: 200, height: 60 }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, borderTop: '1px dashed #1F1A14' }} />
              <span style={{ position: 'absolute', top: 'calc(50% - 15px)', left: '50%', transform: 'translateX(-50%)',
                background: '#FFFAEC', padding: '0 8px', fontSize: 26, color: '#B7312C' }}>✈</span>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center',
                fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#525252' }}>{out.dur}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 64, fontWeight: 700, lineHeight: 1 }}>{toC.code}</div>
              <div style={{ fontSize: 14, fontStyle: 'italic', marginTop: 6 }}>{toC.city}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, marginTop: 8 }}>{depFmt.day} {depFmt.mo.toUpperCase()} · {out.arr}</div>
            </div>
          </div>

          {ret && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center', gap: 14, marginTop: 18, paddingTop: 18, borderTop: '1px dashed #1F1A14' }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, lineHeight: 1 }}>{toC.code}</div>
                <div style={{ fontSize: 13, fontStyle: 'italic', marginTop: 4 }}>{toC.city}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, marginTop: 6 }}>{retFmt.day} {retFmt.mo.toUpperCase()} · {ret.dep}</div>
              </div>
              <div style={{ position: 'relative', width: 160, height: 40 }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, borderTop: '1px dashed #1F1A14' }} />
                <span style={{ position: 'absolute', top: 'calc(50% - 12px)', left: '50%', transform: 'translateX(-50%) scaleX(-1)',
                  background: '#FFFAEC', padding: '0 8px', fontSize: 20, color: '#1F1A14' }}>✈</span>
                <div style={{ position: 'absolute', bottom: -4, left: 0, right: 0, textAlign: 'center',
                  fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#525252' }}>{ret.dur} · {u.lang==='tr'?'Dönüş':'Return'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, lineHeight: 1 }}>{fromC.code}</div>
                <div style={{ fontSize: 13, fontStyle: 'italic', marginTop: 4 }}>{fromC.city}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, marginTop: 6 }}>{retFmt.day} {retFmt.mo.toUpperCase()} · {ret.arr}</div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14,
            marginTop: 22, paddingTop: 18, borderTop: '1px dashed #1F1A14' }}>
            <PostMini label={u.lang==='tr'?'Yolcu':'Pax'} value={titleName.toUpperCase() + ' KAYA'} />
            <PostMini label="Class" value={out.fareName || 'EcoFly'} />
            <PostMini label={u.lang==='tr'?'Yolculuk':'Trip'} value={ret ? (u.lang==='tr'?'Gidiş-Dönüş':'Round trip') : (u.lang==='tr'?'Tek yön':'One way')} />
            <PostMini label={u.lang==='tr'?'Bagaj':'Bag'} value="20kg" />
          </div>

          <div style={{ position: 'absolute', right: 30, bottom: 24, width: 100, height: 100,
            border: '2px solid #B7312C', borderRadius: '50%',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#B7312C', fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 13, letterSpacing: 1.5, textAlign: 'center',
            transform: 'rotate(-8deg)', lineHeight: 1.3, opacity: 0.85 }}>
            PAID<br/>17·06·26<br/>★ THY ★
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 34, flexWrap: 'wrap' }}>
          <button onClick={() => {
            toast({ type: 'success', icon: '★', children: u.lang==='tr'?'Rotaya eklendi':'Added to route' });
            setTimeout(() => nav('map'), 500);
          }} style={{
            padding: '14px 30px', background: '#B7312C', color: '#FFFAEC',
            border: '2px solid #1F1A14', borderRadius: 0,
            fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15,
            cursor: 'pointer', letterSpacing: 0.3,
            boxShadow: '6px 6px 0 #1F1A14',
            display: 'inline-flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>★</span>
            {u.lang==='tr'?'Rotaya ekle':'Add to route'}
          </button>
          <button onClick={() => nav('boarding')} style={{
            padding: '14px 28px', background: '#1F1A14', color: '#FFFAEC',
            border: '1px solid #1F1A14', borderRadius: 0,
            fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15,
            cursor: 'pointer', letterSpacing: 0.3, boxShadow: '4px 4px 0 #B7312C',
          }}>{u.lang==='tr'?'Biniş kartını gör':'View boarding pass'} →</button>
          <button onClick={() => nav('board')} style={{
            padding: '14px 28px', background: '#FFFAEC', color: '#1F1A14',
            border: '1px solid #1F1A14', borderRadius: 0,
            fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15,
            cursor: 'pointer', letterSpacing: 0.3,
          }}>{u.lang==='tr'?'Ana sayfaya dön':'Back to home'}</button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13, fontStyle: 'italic', color: '#1F1A14AA' }}>
          — {u.lang==='tr'?'Onay e-postası aylin.kaya@… adresine gönderildi':'Confirmation sent to aylin.kaya@…'} —
        </div>
      </div>
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}
function PostMini({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 11, fontStyle: 'italic', color: '#525252' }}>{label}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500, fontSize: 14 }}>{value}</div>
    </div>
  );
}

Object.assign(window, {
  WebSeatMapScreen, WebPassengerInfoScreen, WebBaggageScreen, WebCheckoutScreen, WebConfirmationScreen,
});
