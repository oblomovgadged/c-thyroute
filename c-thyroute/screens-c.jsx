// screens-c.jsx — B-group screens 9–13. Each screen runs its own aesthetic.
//
// 09 SeatMap         — Swiss / architectural blueprint (paper, grid, mono)
// 10 Checkout        — Fintech / Stripe (white, hairline, monospaced totals)
// 11 PassengerInfo   — Editorial / Le Monde (serif, underline inputs, asymmetric)
// 12 Baggage         — Playful illustrative (sticker pastels, big counters)
// 13 Confirmation    — Vintage travel postcard (warm paper, deco rules, stamp)
//
// Brand: THY red / navy / gold + crane logo are preserved as accents.

// =================================================================
// 09 ▸ SEAT MAP — Architectural blueprint
// =================================================================

// Turkish landmark icon set used by the seat-memory mini-game.
// Each glyph is a tiny line-icon that renders crisply at 12–40px.
const LANDMARK_IDS = ['gal','ata','bos','lik','agr','gob','kap','pam','nem','aya','sum','kiz'];
const LANDMARK_NAMES = {
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
function Landmark({ id, size = 14, color = 'currentColor' }) {
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

function SeatMapScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const toast = useToast();

  // 1-30 rows × A B C aisle D E F columns
  const rows = Array.from({ length: 30 }, (_, i) => i + 1);
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];

  // pre-occupied seats (hatched, not playable)
  const occupied = React.useMemo(() => new Set([
    '3A','3B','3F','4D','5A','5C','7E','8B','9F','11A','11B','12D',
    '14A','14B','16E','17F','19C','19D','20A','22F','24B','25E','27A','27B',
    '28D','30C'
  ]), []);
  const exitRows = new Set([12, 13, 25, 26]);

  // Glyph deck for the mini-game — each pair is a Turkish landmark.
  const SYMBOLS = LANDMARK_IDS;
  const [seed, setSeed] = React.useState(0);
  const symbolMap = React.useMemo(() => {
    const free = [];
    for (const r of rows) for (const c of cols) {
      const id = `${r}${c}`; if (!occupied.has(id)) free.push(id);
    }
    const pairs = Math.floor(free.length / 2);
    const deck = [];
    for (let i = 0; i < pairs; i++) {
      const s = SYMBOLS[i % SYMBOLS.length];
      deck.push(s, s);
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
        toast({ type: 'success', icon: '✓', children: `+10 mil · ${LANDMARK_NAMES[symbolMap[arr[0]]][u.lang]}` });
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
    <div className="screen-enter" style={{
      minHeight: '100%',
      background: 'repeating-linear-gradient(0deg, transparent 0 23px, rgba(10,22,40,0.04) 23px 24px), repeating-linear-gradient(90deg, transparent 0 23px, rgba(10,22,40,0.04) 23px 24px), #F5F3EC',
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      color: '#0A1628', display: 'flex', flexDirection: 'column',
    }}>
      {/* technical drawing header */}
      <div style={{
        background: '#0A1628', color: '#fff',
        padding: `${topPad}px 16px 10px`, borderBottom: '2px solid #B7312C',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => nav('results')} style={navBtnDark}>
            <Icon name="arrowL" size={14} />
          </button>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#7A8EAF', letterSpacing: 2 }}>
            SHEET 9/21 · SEAT MAP
          </div>
          <span style={{ width: 32 }} />
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500, letterSpacing: -0.5 }}>TK·1853</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#B2C0D1', letterSpacing: 1 }}>A321neo · IST → FCO · {u.lang==='tr'?'17 Haz · 14:25':'17 Jun · 14:25'}</span>
        </div>
      </div>

      {/* title block */}
      <div style={{ padding: '14px 16px 6px' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2.5, color: '#64748B', textTransform: 'uppercase' }}>
          DWG-001 · {u.lang==='tr'?'KOLTUK SEÇİMİ':'SEAT SELECTION'}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, letterSpacing: -0.5 }}>
          {u.lang==='tr'?'Yerinizi seçin.':'Pick your seat.'}
        </div>
        <div style={{ fontSize: 11, color: '#64748B', marginTop: 4, fontStyle: 'italic' }}>
          {u.lang==='tr'
            ? 'Bir koltuğa dokun · çiftleri bul · mil kazan'
            : 'Tap a seat · find the pairs · earn miles'}
        </div>
        <div style={{ fontSize: 11, color: '#64748B', marginTop: 4, fontFamily: "'DM Mono', monospace" }}>
          {u.lang==='tr'?'180 koltuk · 26 dolu · 154 müsait':'180 seats · 26 taken · 154 free'}
        </div>
      </div>

      {/* legend */}
      <div style={{ padding: '6px 16px 4px', display: 'flex', gap: 14, fontSize: 10, fontFamily: "'DM Mono', monospace", color: '#64748B' }}>
        <Legend swatch="#fff" border="#0A1628">{u.lang==='tr'?'Müsait':'Free'}</Legend>
        <Legend swatch="#0A1628" border="#0A1628" color="#fff">{u.lang==='tr'?'Açık':'Up'}</Legend>
        <Legend swatch="rgba(14,122,95,0.12)" border="#0E7A5F">{u.lang==='tr'?'Eşleşti':'Matched'}</Legend>
        <Legend swatch="#E2E8F0" border="#94A3B8" hatched>{u.lang==='tr'?'Dolu':'Taken'}</Legend>
        <Legend swatch="rgba(197,160,89,0.12)" border="#C5A059">{u.lang==='tr'?'Çıkış':'Exit'}</Legend>
      </div>

      {/* fuselage */}
      <div style={{ padding: '6px 16px 10px', position: 'relative' }}>
        <div style={{
          position: 'relative',
          background: '#fff', border: '1.5px solid #0A1628',
          borderRadius: '60px 60px 24px 24px',
          padding: '36px 12px 12px',
          boxShadow: '0 1px 0 #0A1628, 0 12px 24px rgba(10,22,40,0.08)',
        }}>
          {/* cockpit nose */}
          <div style={{
            position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
            fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2,
            color: '#64748B',
          }}>↑ COCKPIT</div>

          {/* column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '18px repeat(3, 1fr) 14px repeat(3, 1fr)', gap: 4, marginBottom: 6 }}>
            <span />
            {cols.slice(0,3).map(c => <ColHead key={c}>{c}</ColHead>)}
            <span />
            {cols.slice(3).map(c => <ColHead key={c}>{c}</ColHead>)}
          </div>

          {rows.map(r => (
            <div key={r} style={{
              display: 'grid', gridTemplateColumns: '18px repeat(3, 1fr) 14px repeat(3, 1fr)',
              gap: 4, marginBottom: 4, alignItems: 'center',
            }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#64748B', textAlign: 'right', paddingRight: 2 }}>{r}</span>
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

          {/* tail */}
          <div style={{
            marginTop: 8, textAlign: 'center',
            fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: '#64748B',
          }}>↓ TAIL</div>
        </div>
      </div>

      {/* game stats summary */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          background: '#0A1628', color: '#fff', padding: '14px 16px',
          borderRadius: 4, display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '6px 6px 0 #B7312C',
        }}>
          <div style={{
            width: 48, height: 48, border: '2px solid #C5A059',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#C5A059', lineHeight: 1,
          }}>{foundPairs >= totalPairs
              ? <span style={{ fontSize: 22 }}>★</span>
              : (foundPairs > 0
                  ? <Landmark id={SYMBOLS[(foundPairs - 1) % SYMBOLS.length]} size={28} color="#C5A059" />
                  : <Landmark id="kap" size={28} color="#C5A059" />)
            }</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: '#7A8EAF', fontFamily: "'DM Mono', monospace", letterSpacing: 1.5 }}>
              {u.lang==='tr'?'OYUN — koltuk eşleştirme':'GAME — seat memory match'}
            </div>
            <div style={{
              fontWeight: 700, fontSize: 14, marginTop: 2,
              fontFamily: "'DM Mono', monospace", letterSpacing: 0.5,
            }}>
              {String(Math.floor(elapsedSec/60)).padStart(2,'0')}:{String(elapsedSec%60).padStart(2,'0')}
              {' · '}{foundPairs}/{totalPairs} {u.lang==='tr'?'çift':'pairs'}
              {' · '}{moves} {u.lang==='tr'?'hamle':'moves'}
            </div>
            <div style={{ fontSize: 10, color: '#B2C0D1', marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
              +{foundPairs * 10} {u.lang==='tr'?'mil kazanıldı':'miles earned'} · {misses} {u.lang==='tr'?'hata':'miss'}
            </div>
          </div>
          <button onClick={restart} title={u.lang==='tr'?'Yeniden':'Restart'} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff', cursor: 'pointer', padding: '10px 12px', borderRadius: 4,
            fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
          }}>↻</button>
          <ThyButton variant="primary" size="md" onClick={() => {
            toast({ type: 'success', icon: '✈', children: u.lang==='tr'?'Koltuğunuz: 14F':'Your seat: 14F' });
            setTimeout(() => nav('passenger'), 500);
          }}>{u.lang==='tr'?'Devam →':'Continue →'}</ThyButton>
        </div>
      </div>
    </div>
  );
}
const navBtnDark = {
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 6, padding: '8px 10px', color: '#fff', cursor: 'pointer',
};
function ColHead({ children }) {
  return <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#64748B', textAlign: 'center' }}>{children}</span>;
}
function Legend({ swatch, border, color, hatched, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        width: 14, height: 14,
        background: hatched
          ? 'repeating-linear-gradient(45deg, #94A3B8 0 2px, transparent 2px 5px), ' + swatch
          : swatch,
        border: `1px solid ${border}`,
        color: color || 'inherit',
      }}/>
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
      padding: 0, position: 'relative',
      boxShadow: matched ? 'inset 0 0 0 1px #0E7A5F' : 'none',
      transition: 'background 200ms, color 200ms, border-color 200ms',
    }}>{isUp ? <Landmark id={symbol} size={11} color={col} /> : ''}</button>
  );
}
function seatTitle(id, u) {
  const r = parseInt(id, 10); const c = id.slice(-1);
  const window = ['A','F'].includes(c) ? (u.lang==='tr'?'Pencere':'Window') : null;
  const aisle  = ['C','D'].includes(c) ? (u.lang==='tr'?'Koridor':'Aisle') : null;
  const middle = ['B','E'].includes(c) ? (u.lang==='tr'?'Orta':'Middle') : null;
  return `${id} · Economy · ${window || aisle || middle}${r <= 8 ? ' · Comfort' : ''}`;
}
function seatPrice(id) {
  const r = parseInt(id, 10); const c = id.slice(-1);
  if (r <= 8) return '+ 380 TL';
  if (['A','F'].includes(c)) return '+ 80 TL';
  return '+ 0 TL';
}

// =================================================================
// 10 ▸ CHECKOUT — Fintech / Stripe
// =================================================================
function CheckoutScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const toast = useToast();
  const [card, setCard] = React.useState('4218');
  const [num, setNum] = React.useState('');
  const [exp, setExp] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const pay = () => {
    setBusy(true);
    toast({ type: 'info', icon: '⟳', children: u.lang==='tr'?'Ödeme işleniyor…':'Processing payment…' });
    setTimeout(() => {
      setBusy(false);
      toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Ödeme onaylandı':'Payment approved' });
      setTimeout(() => nav('confirm'), 500);
    }, 1400);
  };

  return (
    <div className="screen-enter" style={{
      minHeight: '100%', background: '#FAFAFA',
      fontFamily: "'Inter', system-ui, sans-serif", color: '#0A0A0A',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: `${topPad}px 18px 12px`, background: '#fff', borderBottom: '1px solid #ECECEC' }}>
        <button onClick={() => nav('passenger')} style={navBtnLight}><Icon name="arrowL" size={14}/></button>
        <div style={{ marginTop: 14, fontSize: 11, fontWeight: 500, letterSpacing: 0.3, color: '#737373', textTransform: 'uppercase' }}>
          {u.lang==='tr'?'Ödeme':'Checkout'}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 36, fontWeight: 500, letterSpacing: -1.5 }}>8 420,00</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#737373' }}>TL</span>
        </div>
        <div style={{ fontSize: 12, color: '#737373', marginTop: 2 }}>
          {u.lang==='tr'?'TK 1853 · 1 yolcu · EcoFly':'TK 1853 · 1 pax · EcoFly'}
        </div>
      </div>

      <div style={{ padding: '14px 18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* express pay */}
        <div style={{ display: 'flex', gap: 8 }}>
          <ExpressPayBtn label={k === 'ios' ? '\u{F8FF} Pay' : 'G Pay'} primary />
          <ExpressPayBtn label="Paypal" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#A3A3A3', fontSize: 11 }}>
          <div style={{ flex: 1, height: 1, background: '#ECECEC' }} />
          {u.lang==='tr'?'veya kartla':'or pay with card'}
          <div style={{ flex: 1, height: 1, background: '#ECECEC' }} />
        </div>

        {/* saved cards */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, color: '#737373', marginBottom: 8 }}>
            {u.lang==='tr'?'Kayıtlı kartlar':'Saved cards'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SavedCard active={card==='4218'} onClick={() => setCard('4218')}
              brand="visa" last="4218" name="A. KAYA" exp="08/27" />
            <SavedCard active={card==='9930'} onClick={() => setCard('9930')}
              brand="mc" last="9930" name="A. KAYA" exp="11/26" />
            <button onClick={() => setCard('new')} style={{
              padding: '12px 14px', borderRadius: 8,
              border: '1px dashed ' + (card==='new'?'#0A0A0A':'#D4D4D4'),
              background: card==='new'?'#FAFAFA':'#fff',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
              color: '#0A0A0A', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>+ {u.lang==='tr'?'Yeni kart ekle':'Add new card'}</button>
          </div>
        </div>

        {card === 'new' && (
          <div className="screen-enter" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <FintechField label={u.lang==='tr'?'Kart numarası':'Card number'} value={num} onChange={(v) => setNum(v)} placeholder="•••• •••• •••• ••••" mono />
            <div style={{ display: 'flex', gap: 10 }}>
              <FintechField label={u.lang==='tr'?'Son kullanma':'Expiry'} value={exp} onChange={setExp} placeholder="MM / YY" mono style={{ flex: 1 }} />
              <FintechField label="CVV" value={cvv} onChange={setCvv} placeholder="•••" mono style={{ flex: 1 }} />
            </div>
          </div>
        )}

        {/* order summary */}
        <div style={{ background: '#fff', border: '1px solid #ECECEC', borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, color: '#737373', marginBottom: 10 }}>
            {u.lang==='tr'?'Sipariş özeti':'Order summary'}
          </div>
          <Row label={u.lang==='tr'?'EcoFly bilet (1)':'EcoFly fare (1)'} value="7 580,00" />
          <Row label="14F · Pencere" value="80,00" />
          <Row label={u.lang==='tr'?'Bagaj +20kg':'Baggage +20kg'} value="320,00" />
          <Row label={u.lang==='tr'?'Sigorta':'Insurance'} value="190,00" />
          <Row label="KDV" value="250,00" />
          <div style={{ borderTop: '1px solid #ECECEC', marginTop: 8, paddingTop: 8 }}>
            <Row total label={u.lang==='tr'?'Toplam':'Total'} value="8 420,00" />
          </div>
        </div>

        <button disabled={busy} onClick={pay} style={{
          width: '100%', padding: '15px 18px', borderRadius: 10,
          background: busy ? '#737373' : '#0A0A0A', color: '#fff',
          border: '1px solid #0A0A0A', cursor: busy?'wait':'pointer',
          fontFamily: 'inherit', fontWeight: 600, fontSize: 14, letterSpacing: 0.2,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: busy ? 'none' : '0 4px 14px rgba(10,10,10,0.18)',
          transition: 'all .2s',
        }}>
          {busy ? (u.lang==='tr'?'İşleniyor…':'Processing…') : (
            <>
              <span>{u.lang==='tr'?'8 420,00 TL öde':'Pay 8,420.00 TL'}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", opacity: 0.6, fontSize: 11 }}>→</span>
            </>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 10.5, color: '#737373' }}>
          <Icon name="shield" size={12} color="#737373" />
          {u.lang==='tr'?'256-bit TLS · PCI DSS uyumlu':'256-bit TLS · PCI DSS compliant'}
        </div>
      </div>
    </div>
  );
}
const navBtnLight = {
  background: '#fff', border: '1px solid #ECECEC',
  borderRadius: 8, padding: '8px 10px', color: '#0A0A0A', cursor: 'pointer',
};
function ExpressPayBtn({ label, primary }) {
  return (
    <button style={{
      flex: 1, padding: '12px 14px', borderRadius: 10,
      background: primary ? '#0A0A0A' : '#fff',
      color: primary ? '#fff' : '#0A0A0A',
      border: `1px solid ${primary?'#0A0A0A':'#ECECEC'}`,
      cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
    }}>{label}</button>
  );
}
function SavedCard({ active, onClick, brand, last, name, exp }) {
  const bg = brand === 'visa' ? '#1A1F71' : '#EB001B';
  const bg2= brand === 'visa' ? '#1A1F71' : '#F79E1B';
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 12px', borderRadius: 10, cursor: 'pointer',
      border: `1.5px solid ${active?'#0A0A0A':'#ECECEC'}`,
      background: active ? '#FAFAFA' : '#fff', fontFamily: 'inherit',
      textAlign: 'left',
    }}>
      <div style={{
        width: 44, height: 30, borderRadius: 4,
        background: brand==='visa'?bg:`linear-gradient(90deg, ${bg} 50%, ${bg2} 50%)`,
        color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 11, letterSpacing: 1, fontStyle: brand==='visa'?'italic':'normal',
      }}>{brand==='visa'?'VISA':''}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, color: '#0A0A0A' }}>
          •••• {last}
        </div>
        <div style={{ fontSize: 11, color: '#737373', marginTop: 2 }}>{name} · {exp}</div>
      </div>
      <span style={{
        width: 18, height: 18, borderRadius: '50%',
        border: `2px solid ${active?'#0A0A0A':'#D4D4D4'}`,
        background: active?'#0A0A0A':'transparent', flexShrink: 0,
        position: 'relative',
      }}>
        {active && <span style={{
          position: 'absolute', inset: 4, borderRadius: '50%', background: '#fff',
        }}/>}
      </span>
    </button>
  );
}
function FintechField({ label, value, onChange, placeholder, mono, style = {} }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 5, ...style }}>
      <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, color: '#737373' }}>{label}</span>
      <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{
        padding: '12px 14px', borderRadius: 8, border: '1px solid #ECECEC',
        background: '#fff', fontFamily: mono ? "'DM Mono', monospace" : 'inherit',
        fontSize: 14, fontWeight: 500, outline: 'none', color: '#0A0A0A',
      }} />
    </label>
  );
}
function Row({ label, value, total }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '4px 0', fontSize: total ? 14 : 12.5,
      fontWeight: total ? 700 : 500,
      color: total ? '#0A0A0A' : '#525252',
    }}>
      <span>{label}</span>
      <span style={{ fontFamily: "'DM Mono', monospace", letterSpacing: -0.2 }}>{value} TL</span>
    </div>
  );
}

// =================================================================
// 11 ▸ PASSENGER INFO — Editorial (Le Monde / serif underline form)
// =================================================================
function PassengerInfoScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const toast = useToast();
  const [form, setForm] = React.useState({
    title: 'Ms', first: 'Aylin', last: 'Kaya', dob: '12 / 03 / 1991',
    nationality: 'TR', passport: 'U 12 345 678', email: 'aylin.kaya@example.com', phone: '+90 555 432 18 76',
  });
  const update = (k2) => (e) => setForm({ ...form, [k2]: e.target.value });

  return (
    <div className="screen-enter" style={{
      minHeight: '100%', background: '#F5F1E8',
      fontFamily: "'EB Garamond', Georgia, serif", color: '#0A1628',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* masthead */}
      <div style={{
        padding: `${topPad}px 22px 12px`,
        borderBottom: '3px double #0A1628',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => nav('seat')} style={{
            background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
            fontFamily: "'EB Garamond', serif", fontSize: 13, fontStyle: 'italic', color: '#0A1628',
          }}>← {u.lang==='tr'?'geri':'back'}</button>
          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 11, letterSpacing: 4, textTransform: 'uppercase' }}>
            ‹ N° 11 ›
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 10, letterSpacing: 5, fontStyle: 'italic' }}>
            {u.lang==='tr' ? 'Le Voyageur · Bölüm I' : 'The Traveler · Chapter I'}
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 900,
            margin: '4px 0 0', letterSpacing: -1, lineHeight: 1,
          }}>
            {u.lang==='tr' ? 'Kim seyahat ediyor?' : 'Who is travelling?'}
          </h1>
          <div style={{ marginTop: 6, fontSize: 12, fontStyle: 'italic', color: '#525252' }}>
            {u.lang==='tr' ? '— Pasaportta yazdığı gibi giriniz —' : '— enter exactly as on passport —'}
          </div>
        </div>
      </div>

      {/* drop cap intro */}
      <div style={{ padding: '16px 22px 6px', fontSize: 14, lineHeight: 1.55 }}>
        <span style={{
          float: 'left', fontFamily: "'Playfair Display', serif", fontSize: 56, lineHeight: 0.85,
          color: '#B7312C', paddingRight: 8, paddingTop: 4, fontWeight: 700,
        }}>Y</span>
        {u.lang==='tr'
          ? 'olcu 1 / 1 — bu bilgiler bilet üzerinde gözükecek ve sınır kontrolünde sorulacaktır.'
          : 'olcu 1 / 1 — these details appear on the boarding pass and will be checked at the border.'}
      </div>

      {/* form */}
      <div style={{ padding: '14px 22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <EditorialField label={u.lang==='tr'?'Hitap':'Title'}    value={form.title}    onChange={update('title')}    width={64} />
          <EditorialField label={u.lang==='tr'?'Ad':'First name'}   value={form.first}    onChange={update('first')}    flex />
        </div>
        <EditorialField label={u.lang==='tr'?'Soyad':'Last name'}   value={form.last}     onChange={update('last')} />
        <EditorialField label={u.lang==='tr'?'Doğum tarihi':'Birth date'} value={form.dob} onChange={update('dob')} mono />
        <div style={{ display: 'flex', gap: 16 }}>
          <EditorialField label={u.lang==='tr'?'Uyruk':'Nationality'} value={form.nationality} onChange={update('nationality')} width={70} mono />
          <EditorialField label={u.lang==='tr'?'Pasaport no':'Passport no.'} value={form.passport} onChange={update('passport')} flex mono />
        </div>

        <div style={{ borderTop: '1px solid #0A162833', paddingTop: 16 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 14, color: '#525252', marginBottom: 12 }}>
            {u.lang==='tr' ? 'Sizi nasıl bulalım?' : 'How may we reach you?'}
          </div>
          <EditorialField label="E-mail" value={form.email} onChange={update('email')} />
          <div style={{ height: 16 }} />
          <EditorialField label={u.lang==='tr'?'Telefon':'Phone'} value={form.phone} onChange={update('phone')} mono />
        </div>

        {/* M&S */}
        <div style={{
          marginTop: 8, padding: '14px 16px',
          background: '#fff', border: '1px solid #D4D4C8',
          borderRadius: 2, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #E8C97A, #C5A059)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0A1628', fontWeight: 800,
            fontFamily: "'Playfair Display', serif",
          }}>✦</div>
          <div style={{ flex: 1, fontSize: 13, lineHeight: 1.4 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700 }}>Miles&amp;Smiles · Elite Plus</div>
            <div style={{ color: '#525252', fontSize: 12, fontStyle: 'italic' }}>
              {u.lang==='tr' ? 'Bu uçuştan tahmini 2 840 mil' : 'Approx 2,840 mi from this flight'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
          <button onClick={() => { toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Yolcu bilgileri kaydedildi':'Passenger info saved' }); setTimeout(() => nav('baggage'), 500); }} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
            fontSize: 18, color: '#B7312C', padding: 0,
            borderBottom: '1px solid #B7312C',
          }}>
            {u.lang==='tr' ? 'Bagaja geç' : 'On to baggage'} →
          </button>
        </div>
      </div>
    </div>
  );
}
function EditorialField({ label, value, onChange, mono, flex, width }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{
      display: 'flex', flexDirection: 'column', gap: 2,
      flex: flex ? 1 : undefined, width: width || undefined,
    }}>
      <span style={{
        fontFamily: "'EB Garamond', serif", fontSize: 11, fontStyle: 'italic',
        color: '#525252', letterSpacing: 0.5,
      }}>{label}</span>
      <input value={value} onChange={onChange}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          padding: '4px 0', border: 'none',
          borderBottom: `1px solid ${focus ? '#B7312C' : '#0A1628'}`,
          background: 'transparent', outline: 'none',
          fontFamily: mono ? "'DM Mono', monospace" : "'EB Garamond', serif",
          fontSize: mono ? 14 : 17, color: '#0A1628', fontWeight: mono ? 500 : 400,
          width: '100%',
        }} />
    </label>
  );
}

// =================================================================
// 12 ▸ BAGGAGE — Playful illustrative (pastel stickers + counters)
// =================================================================
function BaggageScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const toast = useToast();
  const [bags, setBags] = React.useState({ cabin: 1, b20: 1, b30: 0, sport: 0 });
  const total = bags.b20 * 320 + bags.b30 * 520 + bags.sport * 480;

  return (
    <div className="screen-enter" style={{
      minHeight: '100%',
      background: 'radial-gradient(circle at 20% 0%, #FFE9B8 0%, #FFD485 35%, #FFC468 100%)',
      fontFamily: "'Space Grotesk', system-ui, sans-serif", color: '#1B1B1B',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: `${topPad}px 18px 6px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => nav('passenger')} style={{
          background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: 999,
          padding: '8px 14px', fontFamily: 'inherit', fontWeight: 700, fontSize: 12, cursor: 'pointer',
        }}>← {u.lang==='tr'?'geri':'back'}</button>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3 }}>STEP 12 / 21</span>
      </div>

      <div style={{ padding: '14px 18px 8px' }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 0.9,
          letterSpacing: -1, textTransform: 'uppercase',
        }}>
          {u.lang==='tr' ? 'BAGAJ\nNE OLSUN?' : 'PACK\nIT UP.'}
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: '#1B1B1B99', fontWeight: 500 }}>
          {u.lang==='tr' ? 'Şimdi eklemek %30 daha ucuz.' : 'Add now for 30% off airport pricing.'}
        </div>
      </div>

      <div style={{ padding: '10px 18px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <BagCard
          color="#FFFBF1"
          emoji="🎒"
          tag={u.lang==='tr'?'DAHİL':'INCLUDED'}
          tagColor="#22C55E"
          title={u.lang==='tr'?'Kabin bagajı':'Cabin bag'}
          desc="55 × 40 × 23 cm · 8 kg"
          price={0}
          count={bags.cabin}
          setCount={(v) => setBags({ ...bags, cabin: Math.max(1, Math.min(1, v)) })}
          locked
        />
        <BagCard
          color="#FFFBF1"
          emoji="🧳"
          tag={u.lang==='tr'?'POPÜLER':'POPULAR'}
          tagColor="#B7312C"
          title={u.lang==='tr'?'Valiz · 20 kg':'Checked · 20 kg'}
          desc={u.lang==='tr'?'Hafta sonu için ideal':'Just right for a weekend'}
          price={320}
          count={bags.b20}
          setCount={(v) => setBags({ ...bags, b20: Math.max(0, Math.min(3, v)) })}
        />
        <BagCard
          color="#FFFBF1"
          emoji="🧳"
          tag=""
          title={u.lang==='tr'?'Valiz · 30 kg':'Checked · 30 kg'}
          desc={u.lang==='tr'?'Uzun yolculuk için':'For longer trips'}
          price={520}
          count={bags.b30}
          setCount={(v) => setBags({ ...bags, b30: Math.max(0, Math.min(3, v)) })}
        />
        <BagCard
          color="#FFFBF1"
          emoji="🎿"
          tag={u.lang==='tr'?'YENİ':'NEW'}
          tagColor="#0053A5"
          title={u.lang==='tr'?'Spor ekipmanı':'Sports gear'}
          desc={u.lang==='tr'?'Kayak · bisiklet · sörf':'Skis · bike · surfboard'}
          price={480}
          count={bags.sport}
          setCount={(v) => setBags({ ...bags, sport: Math.max(0, Math.min(2, v)) })}
        />
      </div>

      {/* footer total */}
      <div style={{
        marginTop: 'auto', padding: '14px 18px 18px',
        background: '#0A1628', color: '#fff',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: '#7A8EAF', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {u.lang==='tr'?'Bagaj toplamı':'Baggage total'}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, letterSpacing: 1 }}>{total.toLocaleString('tr-TR')}</span>
            <span style={{ fontSize: 12, color: '#B2C0D1' }}>TL</span>
          </div>
        </div>
        <ThyButton variant="gold" size="lg" icon="→" onClick={() => {
          toast({ type: 'success', icon: '🧳', children: u.lang==='tr'?'Bagaj eklendi':'Baggage added' });
          setTimeout(() => nav('confirm'), 500);
        }}>{u.lang==='tr'?'Onaya geç':'Continue'}</ThyButton>
      </div>
    </div>
  );
}
function BagCard({ color, emoji, tag, tagColor = '#0A1628', title, desc, price, count, setCount, locked }) {
  return (
    <div style={{
      position: 'relative',
      background: color, borderRadius: 18, padding: '14px 14px 14px 80px',
      border: '1.5px solid rgba(0,0,0,0.06)',
      boxShadow: '0 10px 24px rgba(167,108,11,0.18)',
      transform: 'rotate(-0.25deg)',
    }}>
      {/* sticker */}
      <div style={{
        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%) rotate(-8deg)',
        width: 56, height: 56, borderRadius: 14,
        background: '#fff', border: '2px solid #1B1B1B',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, boxShadow: '3px 3px 0 #1B1B1B',
      }}>{emoji}</div>
      {tag && (
        <div style={{
          position: 'absolute', top: -8, right: 12,
          background: tagColor, color: '#fff',
          padding: '3px 8px', borderRadius: 4,
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, letterSpacing: 1.5,
          transform: 'rotate(3deg)',
        }}>{tag}</div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 12, color: '#1B1B1B99', marginTop: 2 }}>{desc}</div>
          <div style={{ marginTop: 6, fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 13 }}>
            {price === 0 ? (count ? '— ücretsiz —' : '') : `+ ${price} TL`}
          </div>
        </div>
        {!locked && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#1B1B1B', borderRadius: 999, padding: '4px 4px',
          }}>
            <button onClick={() => setCount(count - 1)} style={pillBtn}>−</button>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16, minWidth: 16, textAlign: 'center' }}>{count}</span>
            <button onClick={() => setCount(count + 1)} style={pillBtn}>+</button>
          </div>
        )}
        {locked && (
          <span style={{
            padding: '4px 10px', background: 'rgba(0,0,0,0.08)', borderRadius: 999,
            fontSize: 11, fontWeight: 700,
          }}>✓</span>
        )}
      </div>
    </div>
  );
}
const pillBtn = {
  width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
  background: '#fff', color: '#1B1B1B', fontWeight: 800, fontSize: 14,
};

// =================================================================
// 13 ▸ CONFIRMATION — Vintage travel postcard
// =================================================================
function ConfirmationScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const toast = useToast();
  const topPad = k === 'ios' ? 50 : 14;

  return (
    <div className="screen-enter" style={{
      position: 'relative', minHeight: '100%', overflow: 'hidden',
      background: '#F0E4CD',
      backgroundImage: `
        radial-gradient(circle at 20% 12%, rgba(183,49,44,0.06) 0 60px, transparent 80px),
        radial-gradient(circle at 80% 92%, rgba(0,83,165,0.05) 0 80px, transparent 100px),
        repeating-linear-gradient(0deg, transparent 0 24px, rgba(50,30,10,0.025) 24px 25px)
      `,
      fontFamily: "'EB Garamond', Georgia, serif", color: '#1F1A14',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* corner stamps */}
      <CornerStamp pos="tl" />
      <CornerStamp pos="tr" />
      <CornerStamp pos="bl" />
      <CornerStamp pos="br" />

      <div style={{ padding: `${topPad}px 18px 0`, position: 'relative', zIndex: 1 }}>
        <button onClick={() => nav('board')} style={{
          background: 'transparent', border: '1px solid #1F1A14', borderRadius: 0,
          padding: '6px 12px', fontFamily: 'inherit', fontSize: 12, cursor: 'pointer',
          color: '#1F1A14',
        }}>← {u.lang==='tr'?'Ana sayfa':'Home'}</button>
      </div>

      {/* big check */}
      <div style={{ textAlign: 'center', padding: '20px 18px 8px', position: 'relative' }}>
        <div style={{
          display: 'inline-block', padding: '6px 14px',
          border: '2px solid #B7312C', color: '#B7312C',
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 6,
          transform: 'rotate(-3deg)',
          background: '#F0E4CD',
        }}>
          {u.lang==='tr'?'ONAYLANDI':'CONFIRMED'}
        </div>
      </div>

      {/* headline */}
      <div style={{ textAlign: 'center', padding: '8px 22px 4px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, fontStyle: 'italic' }}>
          ★ ★ ★
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 42,
          margin: '6px 0 0', letterSpacing: -1, lineHeight: 1, color: '#1F1A14',
        }}>
          {u.lang==='tr'?'Buon viaggio,':'Bon voyage,'}
          <br/>
          <span style={{ fontStyle: 'italic', fontWeight: 500 }}>Aylin.</span>
        </h1>
        <div style={{ marginTop: 10, fontSize: 14, color: '#1F1A14CC' }}>
          {u.lang==='tr'
            ? 'Roma sizi bekliyor — 17 Haziran, 14:25.'
            : 'Rome awaits — 17 June, 14:25.'}
        </div>
      </div>

      {/* postcard ticket */}
      <div style={{ padding: '18px 18px 12px', position: 'relative', zIndex: 1 }}>
        <div style={{
          position: 'relative',
          background: '#FFFAEC', border: '1px solid #1F1A14',
          padding: '14px 16px 12px', borderRadius: 2,
          boxShadow: '6px 6px 0 #1F1A14, 8px 8px 0 #B7312C',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#525252', letterSpacing: 1.5 }}>PNR</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 500, letterSpacing: 2 }}>EBHHN3</div>
            </div>
            <Crane dark={false} size={26} />
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center', gap: 8, marginTop: 12,
          }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700, lineHeight: 1 }}>IST</div>
              <div style={{ fontSize: 12, fontStyle: 'italic', marginTop: 4 }}>Istanbul</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, marginTop: 6 }}>17 JUN · 14:25</div>
            </div>
            <div style={{ position: 'relative', height: 50, padding: '0 4px' }}>
              <div style={{
                position: 'absolute', top: '50%', left: 0, right: 0, height: 1, borderTop: '1px dashed #1F1A14',
              }} />
              <span style={{
                position: 'absolute', top: 'calc(50% - 12px)', left: '50%', transform: 'translateX(-50%)',
                background: '#FFFAEC', padding: '0 6px', fontSize: 18, color: '#B7312C',
              }}>✈</span>
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center',
                fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#525252',
              }}>3h 25m</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700, lineHeight: 1 }}>FCO</div>
              <div style={{ fontSize: 12, fontStyle: 'italic', marginTop: 4 }}>Roma</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, marginTop: 6 }}>17 JUN · 16:50</div>
            </div>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10,
            marginTop: 14, paddingTop: 12, borderTop: '1px dashed #1F1A14',
          }}>
            <PostMini label={u.lang==='tr'?'Yolcu':'Pax'} value="A. KAYA" />
            <PostMini label="Class" value="EcoFly" />
            <PostMini label="Seat" value="14F" />
            <PostMini label={u.lang==='tr'?'Bagaj':'Bag'} value="20kg" />
          </div>

          {/* round stamp */}
          <div style={{
            position: 'absolute', right: 22, bottom: 18, width: 76, height: 76,
            border: '2px solid #B7312C', borderRadius: '50%',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#B7312C', fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 10, letterSpacing: 1.5, textAlign: 'center',
            transform: 'rotate(-8deg)', lineHeight: 1.2, opacity: 0.85,
          }}>
            PAID<br/>17·06·26<br/>★ THY ★
          </div>
        </div>
      </div>

      {/* actions */}
      <div style={{ padding: '6px 18px 12px', display: 'flex', gap: 10, position: 'relative', zIndex: 1 }}>
        <button onClick={() => nav('boarding')} style={postBtn(true)}>
          {u.lang==='tr'?'Biniş kartını gör':'View boarding pass'} →
        </button>
        <button onClick={() => nav('board')} style={postBtn(false)}>
          {u.lang==='tr'?'Cüzdana ekle':'Add to wallet'}
        </button>
      </div>

      {/* Rotaya Ekle — sends the journey to Map / route panel */}
      <div style={{ padding: '0 18px 18px', position: 'relative', zIndex: 1 }}>
        <button onClick={() => {
          toast({ type: 'success', icon: '★', children: u.lang==='tr'?'Rotaya eklendi':'Added to route' });
          setTimeout(() => nav('map'), 500);
        }} style={{
          width: '100%', padding: '14px 16px',
          background: '#B7312C', color: '#FFFAEC',
          border: '2px solid #1F1A14', borderRadius: 0,
          fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15,
          letterSpacing: 0.4, cursor: 'pointer',
          boxShadow: '4px 4px 0 #1F1A14',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>★</span>
          {u.lang==='tr'?'Rotaya ekle':'Add to route'}
        </button>
      </div>

      <div style={{
        textAlign: 'center', fontSize: 11, fontStyle: 'italic',
        color: '#1F1A14AA', padding: '0 22px 18px', position: 'relative', zIndex: 1,
      }}>
        — {u.lang==='tr'?'Onay e-postası aylin.kaya@… adresine gönderildi':'Confirmation sent to aylin.kaya@…'} —
      </div>
    </div>
  );
}
function CornerStamp({ pos }) {
  const cssPos = {
    tl: { top: 10,  left: 10,  transform: 'rotate(-12deg)' },
    tr: { top: 10,  right: 10, transform: 'rotate(8deg)'   },
    bl: { bottom:10, left: 10, transform: 'rotate(6deg)'   },
    br: { bottom:10, right:10, transform: 'rotate(-10deg)' },
  }[pos];
  return (
    <div aria-hidden style={{
      position: 'absolute', width: 60, height: 70,
      ...cssPos,
      background: 'repeating-linear-gradient(45deg, #B7312C0a 0 4px, transparent 4px 8px)',
      border: '1.5px dashed #B7312C66', borderRadius: 4,
      pointerEvents: 'none', opacity: 0.6,
    }} />
  );
}
function PostMini({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 10, fontStyle: 'italic', color: '#525252' }}>{label}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500, fontSize: 12 }}>{value}</div>
    </div>
  );
}
function postBtn(primary) {
  return {
    flex: 1, padding: '12px 14px',
    background: primary ? '#1F1A14' : '#FFFAEC',
    color: primary ? '#FFFAEC' : '#1F1A14',
    border: '1px solid #1F1A14', borderRadius: 0,
    fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 13,
    cursor: 'pointer', letterSpacing: 0.3,
    boxShadow: primary ? '3px 3px 0 #B7312C' : 'none',
  };
}

Object.assign(window, {
  SeatMapScreen, CheckoutScreen, PassengerInfoScreen, BaggageScreen, ConfirmationScreen,
});
