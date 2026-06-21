// web-screens-a.jsx — Splash, Board, Search, Results, BoardingPass (desktop)

// 01 ─── SPLASH / LANDING ─────────────────────────────────────────
function WebSplashScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: true });
  const [booking, setBooking, h] = useBooking();
  const toast = useToast();
  const depFmt = formatDateShort(booking.depDate, u.lang);
  const retFmt = formatDateShort(booking.retDate, u.lang);
  return (
    <PageShell dark style={{ background: 'transparent' }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} dark />
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #050B14 0%, #0A1628 50%, #1B3868 100%)',
        color: '#fff', padding: '64px 48px 48px',
      }}>
        <GlobeNetworkBg opacity={0.22} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(60% 50% at 75% 30%, ${u.accent.glow} 0%, transparent 60%)`,
          opacity: 0.7, animation: 'thy-drift 12s ease-in-out infinite alternate',
        }} />
        <div style={{
          position: 'relative', maxWidth: 1280, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 3,
              color: u.accent.fg, marginBottom: 18, textTransform: 'uppercase',
            }}>✈ TURKISH AIRLINES · MILES&SMILES</div>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 900,
              fontSize: 76, lineHeight: 0.95, letterSpacing: -2.2, margin: 0,
            }}>
              {u.c.splash1}<br/>
              <span style={{
                background: `linear-gradient(120deg, ${u.accent.fg} 0%, #E8C97A 50%, ${u.accent.fg} 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{u.c.splash2}</span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: '#B2C0D1', maxWidth: 520, margin: '28px 0 36px' }}>
              {u.c.splashSub}
            </p>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <ThyButton variant="primary" size="lg" icon="✈" onClick={() => nav('board')}>
                {u.c.splashCta} →
              </ThyButton>
              <button onClick={() => nav('board')} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: '#B2C0D1', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600,
              }}>{u.c.splashSkip} →</button>
            </div>
          </div>
          {/* Floating boarding pass art */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              transform: 'rotate(6deg)', width: 420, padding: 22,
              borderRadius: 24, border: '1px solid rgba(197,160,89,0.3)',
              background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(14px)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 36px rgba(197,160,89,0.18)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: u.accent.fg, letterSpacing: 1.5, fontWeight: 700 }}>TK 1854</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, gap: 14 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 48, color: '#fff', letterSpacing: -1.5, lineHeight: 1 }}>FCO</div>
                  <div style={{ fontSize: 12, color: '#B2C0D1', marginTop: 6 }}>Roma</div>
                </div>
                <div style={{ flex: 1, position: 'relative', height: 16 }}>
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1.5px dashed rgba(197,160,89,0.45)' }} />
                  <span style={{ position: 'absolute', top: -10, left: '6%', fontSize: 22, color: u.accent.fg, animation: 'thy-plane 3.4s ease-in-out infinite' }}>✈</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 48, color: '#fff', letterSpacing: -1.5, lineHeight: 1 }}>IST</div>
                  <div style={{ fontSize: 12, color: '#B2C0D1', marginTop: 6 }}>İstanbul</div>
                </div>
              </div>
              <div style={{ marginTop: 22, paddingTop: 14, borderTop: '1px dashed rgba(255,255,255,0.18)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                <MiniStat label="GATE" value="A12" dark />
                <MiniStat label="SEAT" value="14F" dark />
                <MiniStat label="BOARDING" value="13:55" dark />
              </div>
            </div>
            <div style={{
              position: 'absolute', right: -12, top: -22, transform: 'rotate(-10deg)',
              padding: '6px 14px', background: u.accent.bg, color: '#fff', borderRadius: 4,
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, fontWeight: 700,
              boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
            }}>BOARDING PASS</div>
          </div>
        </div>
      </div>

      {/* Search strip overlap */}
      <div style={{ maxWidth: 1280, margin: '-50px auto 0', padding: '0 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, boxShadow: '0 22px 60px rgba(10,22,40,0.22)', padding: 22, color: '#0A1628' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {[u.lang==='tr'?'Gidiş-Dönüş':'Round trip', u.lang==='tr'?'Tek yön':'One way', u.lang==='tr'?'Çoklu':'Multi'].map((l, i) => (
              <ThyChip key={l} light active={i === 0}>{l}</ThyChip>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr 0.8fr auto', gap: 10 }}>
            <CityAutocomplete
              value={booking.fromCode}
              onChange={(code) => setBooking({ fromCode: code })}
              otherSide={booking.toCode}
              label={u.c.from}
              accent={u.accent} lang={u.lang}
            />
            <CityAutocomplete
              value={booking.toCode}
              onChange={(code) => setBooking({ toCode: code })}
              otherSide={booking.fromCode}
              label={u.c.to}
              accent={u.accent} lang={u.lang}
            />
            <DatePickerCell
              label={u.c.depart}
              value={booking.depDate}
              lang={u.lang}
              onChange={(iso) => {
                const patch = { depDate: iso };
                if (booking.retDate && booking.retDate < iso) patch.retDate = plusDaysISO(iso, 7);
                setBooking(patch);
              }}
            />
            <DatePickerCell
              label={u.c.return}
              value={booking.retDate}
              minISO={booking.depDate}
              lang={u.lang}
              onChange={(iso) => setBooking({ retDate: iso })}
            />
            <div style={{ padding: '14px 16px', border: '1px solid #E2E8F0', borderRadius: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: '#94A3B8' }}>{u.c.pax}</div>
              <div style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>{h.paxTotal} · Economy</div>
            </div>
            <ThyButton variant="primary" size="lg" icon="→" onClick={() => {
              if (booking.fromCode === booking.toCode) {
                toast({ type: 'error', icon: '!', children: u.lang==='tr'?'Kalkış ile varış aynı olamaz':'Origin and destination must differ' });
                return;
              }
              toast({ type: 'info', icon: '✈', children: u.lang==='tr'?'Uçuşlar aranıyor…':'Searching flights…' });
              setTimeout(() => nav('results'), 350);
            }}>
              {u.lang==='tr'?'Ara':'Search'}
            </ThyButton>
          </div>
        </div>
      </div>

      {/* Türkiye Rotası — country tour, above popüler rotalar */}
      <div style={{ maxWidth: 1280, margin: '52px auto 0', padding: '0 48px' }}>
        <SectionTitle
          eyebrow={u.lang==='tr'?'TÜRKİYE ROTASI':'TÜRKİYE ROUTE'}
          title={u.lang==='tr'?'Anavatan, baştan sona.':'Anatolia, end to end.'}
          accent={{ bg: '#B7312C', fg: '#C5A059', glow: 'rgba(197,160,89,0.35)' }}
          action={<button onClick={() => nav('turkiyeTuru')} style={{
            background: 'transparent', border: '1px solid #C5A059', color: '#8E211D',
            borderRadius: 9999, padding: '7px 14px', cursor: 'pointer',
            fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 13, fontWeight: 700,
            letterSpacing: 0.3,
          }}>{u.lang==='tr'?'Tüm rotalar →':'All routes →'}</button>}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            {
              code: 'LYC', art: 'lyc', name: u.lang==='tr'?'Likya Yolu':'Lycian Way',
              region: u.lang==='tr'?'Akdeniz · Fethiye → Antalya':'Mediterranean · Fethiye → Antalya',
              days: '9', from: '14.800',
              tag: u.lang==='tr'?'Yürüyüş':'Trekking',
              from1: '#1A6B7B', from2: '#2A8FA8', from3: '#E8D4A8',
            },
            {
              code: 'CAP', art: 'cap', name: u.lang==='tr'?'Kapadokya Şafağı':'Cappadocia Dawn',
              region: u.lang==='tr'?'İç Anadolu · Göreme':'Central Anatolia · Göreme',
              days: '4', from: '8.400',
              tag: u.lang==='tr'?'Balon · UNESCO':'Balloon · UNESCO',
              from1: '#8E211D', from2: '#C46B3A', from3: '#F4C24C',
            },
            {
              code: 'EGE', art: 'ege', name: u.lang==='tr'?'Ege Antik Rotası':'Aegean Antique',
              region: u.lang==='tr'?'Ege · Efes → Bergama → Truva':'Aegean · Ephesus → Pergamon',
              days: '7', from: '11.200',
              tag: u.lang==='tr'?'Arkeoloji':'Archaeology',
              from1: '#0B3954', from2: '#1A6B7B', from3: '#C5A059',
            },
            {
              code: 'GLB', art: 'glb', name: u.lang==='tr'?'Gelibolu & Truva':'Gallipoli & Troy',
              region: u.lang==='tr'?'Çanakkale · Tarih hattı':'Çanakkale · Memory line',
              days: '3', from: '6.900',
              tag: u.lang==='tr'?'Anıt · Tarih':'Memorial · History',
              from1: '#1F1A14', from2: '#5C2624', from3: '#B7312C',
            },
          ].map(d => <TurkiyeRouteCard key={d.code} d={d} lang={u.lang} onClick={() => nav('turkiyeTuru')} />)}
        </div>
      </div>

      {/* Destinations grid */}
      <div style={{ maxWidth: 1280, margin: '52px auto 0', padding: '0 48px' }}>
        <SectionTitle
          eyebrow={u.lang==='tr'?'POPÜLER ROTALAR':'POPULAR ROUTES'}
          title={u.lang==='tr'?'Şimdi keşfedin':'Discover now'}
          accent={u.accent}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { code: 'NRT', city: 'Tokyo',     hours: '13s 25dk', from: '5.940', color: '#0053A5', img: '🗼' },
            { code: 'BCN', city: 'Barcelona', hours: '4s 05dk',  from: '3.480', color: '#B7312C', img: '🎨' },
            { code: 'CPT', city: 'Cape Town', hours: '10s 50dk', from: '7.220', color: '#C5A059', img: '🏔️' },
            { code: 'JFK', city: 'New York',  hours: '11s 30dk', from: '8.140', color: '#0F2244', img: '🗽' },
          ].map(d => <DestCard key={d.code} d={d} lang={u.lang}/>)}
        </div>
      </div>
      <div style={{ height: 60 }} />
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}
const searchCell = { width: '100%', textAlign: 'left', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: 0, cursor: 'pointer' };
function CityCellBig({ label, code, city }) {
  return (
    <div style={{ padding: '14px 16px' }}>
      <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: '#94A3B8' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 26, color: '#0A1628', letterSpacing: 0.5 }}>{code}</span>
        <span style={{ fontSize: 15, color: '#0A1628', fontWeight: 600 }}>{city}</span>
      </div>
    </div>
  );
}
function DateCellBig({ label, day, mo, dow }) {
  return (
    <div style={{ padding: '14px 16px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10 }}>
      <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: '#94A3B8' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 26, color: '#0A1628' }}>{day}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#0A1628' }}>{mo}</span>
      </div>
      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{dow}</div>
    </div>
  );
}
function DestCard({ d, lang }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
      overflow: 'hidden', boxShadow: '0 6px 18px rgba(10,22,40,0.06)', cursor: 'pointer',
      transition: 'all .25s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 14px 30px rgba(10,22,40,0.14)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(10,22,40,0.06)'; }}
    >
      <div style={{ height: 140, background: `linear-gradient(135deg, ${d.color}, ${d.color}AA)`, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -10, bottom: -20, fontSize: 130, opacity: 0.25 }}>{d.img}</div>
        <div style={{ position: 'absolute', top: 14, left: 16, fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 22, letterSpacing: 2 }}>{d.code}</div>
        <div style={{ position: 'absolute', bottom: 12, left: 16, fontWeight: 800, fontSize: 18 }}>{d.city}</div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{lang==='tr'?'Başlangıç':'From'}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 22, color: '#0A1628' }}>{d.from}</span>
          <span style={{ fontSize: 11, color: '#64748B' }}>TL</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
          <span>{d.hours} · {lang==='tr'?'aktarmasız':'direct'}</span>
          <span style={{ color: d.color, fontWeight: 700 }}>→</span>
        </div>
      </div>
    </div>
  );
}

// ─── Editorial route illustrations (abstract / poster style) ───
function RouteArt({ kind }) {
  // shared stroke + style
  const ink = '#FFFAEC';
  const common = {
    width: '100%', height: '100%',
    minWidth: 200, maxWidth: 280,
    opacity: 0.55,
  };
  if (kind === 'lyc') {
    // Lycian Way — coastal mountains + setting sun + waves + Lycian rock tomb hint
    return (
      <svg viewBox="0 0 240 142" style={common} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        {/* sun */}
        <circle cx="68" cy="46" r="22" stroke={ink} strokeWidth="1.3" />
        <circle cx="68" cy="46" r="13" fill={ink} opacity="0.18" />
        {/* radiating */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => {
          const r = (a*Math.PI)/180;
          const x1 = 68 + Math.cos(r)*26, y1 = 46 + Math.sin(r)*26;
          const x2 = 68 + Math.cos(r)*32, y2 = 46 + Math.sin(r)*32;
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth="1.1" strokeLinecap="round" />;
        })}
        {/* layered mountain ridges */}
        <path d="M-4 110 L40 70 L80 95 L120 60 L160 88 L200 55 L244 92 L244 142 L-4 142 Z"
              fill={ink} opacity="0.16" />
        <path d="M-4 110 L40 70 L80 95 L120 60 L160 88 L200 55 L244 92"
              stroke={ink} strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M-4 124 L46 96 L92 118 L138 90 L188 116 L244 100"
              stroke={ink} strokeWidth="1.1" strokeLinejoin="round" opacity="0.8" />
        {/* Lycian rock tomb facade — tiny editorial mark */}
        <g transform="translate(178 70)" stroke={ink} strokeWidth="1" opacity="0.7">
          <path d="M0 14 L7 0 L14 14 Z" fill="none" />
          <line x1="2" y1="14" x2="12" y2="14" />
          <line x1="3" y1="14" x2="3" y2="20" />
          <line x1="11" y1="14" x2="11" y2="20" />
          <line x1="7" y1="14" x2="7" y2="20" />
        </g>
        {/* waves */}
        <path d="M-4 134 Q12 130 28 134 T60 134 T92 134 T124 134 T156 134 T188 134 T220 134 T244 134"
              stroke={ink} strokeWidth="1" opacity="0.7" />
      </svg>
    );
  }
  if (kind === 'cap') {
    // Cappadocia Dawn — 3 hot-air balloons + fairy chimneys + rising sun rays
    return (
      <svg viewBox="0 0 240 142" style={common} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        {/* sun rays from top-right */}
        <g stroke={ink} strokeWidth="0.9" opacity="0.55" strokeLinecap="round">
          {[10,25,40,55,70,85,100].map((a,i) => {
            const r = (a*Math.PI)/180;
            return <line key={i} x1="220" y1="-6" x2={220-Math.cos(r)*150} y2={-6+Math.sin(r)*150} />;
          })}
        </g>
        {/* 3 balloons */}
        <Balloon cx={56} cy={56} r={18} ink={ink} />
        <Balloon cx={130} cy={36} r={22} ink={ink} stripe />
        <Balloon cx={196} cy={64} r={15} ink={ink} />
        {/* fairy chimneys — tall pointed silhouettes */}
        <g fill={ink} opacity="0.18">
          <path d="M16 142 L20 110 Q22 100 26 110 L30 142 Z" />
          <path d="M44 142 L50 96 Q53 86 58 96 L64 142 Z" />
          <path d="M78 142 L84 118 Q86 110 90 118 L96 142 Z" />
          <path d="M118 142 L124 100 Q127 88 132 100 L138 142 Z" />
          <path d="M158 142 L165 124 Q167 116 171 124 L178 142 Z" />
          <path d="M192 142 L198 108 Q201 96 206 108 L214 142 Z" />
          <path d="M222 142 L226 120 Q228 112 232 120 L236 142 Z" />
        </g>
        <g stroke={ink} strokeWidth="1" opacity="0.7" fill="none">
          <path d="M44 142 L50 96 Q53 86 58 96 L64 142" />
          <path d="M118 142 L124 100 Q127 88 132 100 L138 142" />
          <path d="M192 142 L198 108 Q201 96 206 108 L214 142" />
          {/* cap mushroom on chimneys */}
          <ellipse cx="54" cy="95" rx="9" ry="3.5" />
          <ellipse cx="128" cy="99" rx="11" ry="4" />
          <ellipse cx="202" cy="107" rx="10" ry="3.5" />
        </g>
      </svg>
    );
  }
  if (kind === 'ege') {
    // Aegean Antique — 3 Ionic columns + sun disk + olive branch
    return (
      <svg viewBox="0 0 240 142" style={common} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        {/* sun disc behind */}
        <circle cx="184" cy="50" r="36" stroke={ink} strokeWidth="1.2" />
        <circle cx="184" cy="50" r="28" fill={ink} opacity="0.12" />
        {/* columns */}
        <Column x={60}  base={142} top={42} ink={ink} />
        <Column x={120} base={142} top={28} ink={ink} />
        <Column x={180} base={142} top={48} ink={ink} />
        {/* olive branch arching across top */}
        <g stroke={ink} strokeWidth="1.1" fill="none" opacity="0.85">
          <path d="M14 12 Q70 0 130 14 T232 24" strokeLinecap="round" />
          {/* leaves */}
          {[
            [28,11],[44,9],[60,9],[78,11],[96,12],[112,13],
            [128,14],[146,15],[164,18],[184,21],[208,23],
          ].map(([x,y],i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${(i%2?20:-20)})`}>
              <ellipse cx="0" cy="-4" rx="3" ry="6" fill={ink} opacity="0.5" />
            </g>
          ))}
        </g>
        {/* meander (Greek key) base hint */}
        <g stroke={ink} strokeWidth="0.8" opacity="0.6" fill="none">
          <path d="M0 138 L240 138" />
          <path d="M8 138 L8 132 L16 132 L16 138" />
          <path d="M28 138 L28 132 L36 132 L36 138" />
          <path d="M48 138 L48 132 L56 132 L56 138" />
          <path d="M68 138 L68 132 L76 132 L76 138" />
          <path d="M88 138 L88 132 L96 132 L96 138" />
          <path d="M108 138 L108 132 L116 132 L116 138" />
          <path d="M128 138 L128 132 L136 132 L136 138" />
          <path d="M148 138 L148 132 L156 132 L156 138" />
          <path d="M168 138 L168 132 L176 132 L176 138" />
          <path d="M188 138 L188 132 L196 132 L196 138" />
          <path d="M208 138 L208 132 L216 132 L216 138" />
        </g>
      </svg>
    );
  }
  if (kind === 'glb') {
    // Gallipoli & Troy — Trojan horse silhouette + sea + crescent/stars
    return (
      <svg viewBox="0 0 240 142" style={common} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        {/* moon */}
        <g transform="translate(40 30)">
          <circle cx="0" cy="0" r="14" stroke={ink} strokeWidth="1.1" />
          <circle cx="5" cy="-2" r="11" fill="url(#mask-cut)" />
        </g>
        {/* tiny stars */}
        <g fill={ink} opacity="0.7">
          <path d="M68 20 L70 26 L76 28 L70 30 L68 36 L66 30 L60 28 L66 26 Z" />
          <path d="M210 22 L211.5 26 L216 27 L211.5 28 L210 32 L208.5 28 L204 27 L208.5 26 Z" />
        </g>
        {/* Trojan horse */}
        <g transform="translate(118 50)" stroke={ink} strokeWidth="1.3" fill="none" opacity="0.92">
          {/* platform */}
          <rect x="-46" y="50" width="92" height="6" fill={ink} opacity="0.18" />
          <line x1="-46" y1="50" x2="46" y2="50" />
          {/* wheels */}
          <circle cx="-32" cy="62" r="5" />
          <circle cx="32" cy="62" r="5" />
          <line x1="-32" y1="57" x2="-32" y2="67" />
          <line x1="32" y1="57" x2="32" y2="67" />
          {/* body */}
          <path d="M-44 20 L-44 48 L44 48 L44 14 Q44 4 32 6 L0 12 L-30 8 Q-44 6 -44 20 Z" fill={ink} fillOpacity="0.22" />
          <path d="M-44 20 L-44 48 L44 48 L44 14 Q44 4 32 6 L0 12 L-30 8 Q-44 6 -44 20 Z" />
          {/* legs */}
          <line x1="-32" y1="48" x2="-32" y2="58" />
          <line x1="-12" y1="48" x2="-12" y2="58" />
          <line x1="12"  y1="48" x2="12"  y2="58" />
          <line x1="32"  y1="48" x2="32"  y2="58" />
          {/* head + neck */}
          <path d="M40 14 L60 -4 L72 -8 L78 -2 L72 6 L58 12 L48 18 Z" fill={ink} fillOpacity="0.22" />
          <path d="M40 14 L60 -4 L72 -8 L78 -2 L72 6 L58 12 L48 18 Z" />
          {/* mane */}
          <line x1="58" y1="-3" x2="55" y2="-12" />
          <line x1="64" y1="-2" x2="62" y2="-12" />
          <line x1="70" y1="-3" x2="69" y2="-12" />
          {/* eye */}
          <circle cx="70" cy="0" r="1" fill={ink} />
          {/* tail */}
          <path d="M-44 26 Q-58 32 -62 44" />
          <path d="M-44 30 Q-56 36 -58 46" />
          <path d="M-44 34 Q-52 40 -54 48" />
        </g>
        {/* sea waves */}
        <g stroke={ink} strokeWidth="1" opacity="0.85" fill="none">
          <path d="M-4 124 Q12 119 28 124 T60 124 T92 124 T124 124 T156 124 T188 124 T220 124 T244 124" />
          <path d="M-4 134 Q14 129 32 134 T68 134 T104 134 T140 134 T176 134 T212 134 T244 134" opacity="0.7" />
        </g>
      </svg>
    );
  }
  return null;
}
function Balloon({ cx, cy, r, ink, stripe }) {
  return (
    <g stroke={ink} strokeWidth="1.2" fill="none" opacity="0.92">
      {/* envelope */}
      <ellipse cx={cx} cy={cy} rx={r} ry={r*1.05} fill={ink} fillOpacity="0.18" />
      <ellipse cx={cx} cy={cy} rx={r} ry={r*1.05} />
      {/* vertical stripe / panels */}
      <line x1={cx} y1={cy - r*1.05} x2={cx} y2={cy + r*1.05} opacity="0.75" />
      {stripe && <line x1={cx - r*0.6} y1={cy - r} x2={cx - r*0.6} y2={cy + r} opacity="0.6" />}
      {stripe && <line x1={cx + r*0.6} y1={cy - r} x2={cx + r*0.6} y2={cy + r} opacity="0.6" />}
      {/* ropes */}
      <line x1={cx - r*0.5} y1={cy + r*0.95} x2={cx - r*0.32} y2={cy + r*1.5} />
      <line x1={cx + r*0.5} y1={cy + r*0.95} x2={cx + r*0.32} y2={cy + r*1.5} />
      {/* basket */}
      <rect x={cx - r*0.4} y={cy + r*1.5} width={r*0.8} height={r*0.4} fill={ink} fillOpacity="0.3" />
      <rect x={cx - r*0.4} y={cy + r*1.5} width={r*0.8} height={r*0.4} />
    </g>
  );
}
function Column({ x, base, top, ink }) {
  return (
    <g stroke={ink} strokeWidth="1.1" fill="none" opacity="0.9">
      {/* capital (Ionic volutes — simplified) */}
      <rect x={x - 12} y={top - 4} width={24} height={6} fill={ink} fillOpacity="0.22" />
      <path d={`M${x - 10} ${top} q-4 -4 0 -8 q4 -2 6 2`} />
      <path d={`M${x + 10} ${top} q4 -4 0 -8 q-4 -2 -6 2`} />
      {/* shaft + flutes */}
      <rect x={x - 7} y={top + 2} width={14} height={base - top - 6} fill={ink} fillOpacity="0.18" />
      <line x1={x - 4} y1={top + 4} x2={x - 4} y2={base - 4} opacity="0.5" />
      <line x1={x}     y1={top + 4} x2={x}     y2={base - 4} opacity="0.5" />
      <line x1={x + 4} y1={top + 4} x2={x + 4} y2={base - 4} opacity="0.5" />
      <rect x={x - 7} y={top + 2} width={14} height={base - top - 6} />
      {/* base */}
      <rect x={x - 10} y={base - 6} width={20} height={4} fill={ink} fillOpacity="0.24" />
    </g>
  );
}

// ─── Türkiye Rotası card (postcard / vintage) ──────────────────
function TurkiyeRouteCard({ d, lang, onClick }) {
  return (
    <div onClick={onClick} style={{
      position: 'relative', overflow: 'hidden',
      background: '#FFFAEC', border: '1px solid #1F1A14',
      borderRadius: 4, cursor: 'pointer',
      boxShadow: '4px 4px 0 #1F1A14, 7px 7px 0 #C5A059',
      transition: 'all .25s cubic-bezier(.16,1,.3,1)',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translate(-2px, -2px)';
        e.currentTarget.style.boxShadow = '6px 6px 0 #1F1A14, 9px 9px 0 #C5A059';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '4px 4px 0 #1F1A14, 7px 7px 0 #C5A059';
      }}
    >
      <div style={{
        position: 'relative', height: 142,
        background: `linear-gradient(135deg, ${d.from1} 0%, ${d.from2} 50%, ${d.from3} 100%)`,
        color: '#FFFAEC', overflow: 'hidden',
        borderBottom: '1px solid #1F1A14',
      }}>
        <span aria-hidden style={{
          position: 'absolute', top: 8, right: 8, width: 44, height: 52,
          border: '1.5px dashed rgba(255,250,236,0.5)',
          borderRadius: 3, transform: 'rotate(8deg)',
        }} />
        {/* artist illustration — editorial / vintage poster style */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end',
          pointerEvents: 'none',
        }}>
          <RouteArt kind={d.art} />
        </div>
        <div style={{
          position: 'absolute', top: 14, left: 16,
          fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 13,
          letterSpacing: 3, color: '#FFFAEC',
        }}>★ {d.code}</div>
        <div style={{
          position: 'absolute', bottom: 14, left: 16,
          padding: '4px 10px',
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,250,236,0.4)',
          fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
          fontSize: 11, letterSpacing: 1, color: '#FFFAEC',
        }}>{d.tag}</div>
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 800, fontStyle: 'italic',
          fontSize: 21, letterSpacing: -0.3, color: '#1F1A14', lineHeight: 1.05,
        }}>{d.name}</div>
        <div style={{
          fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
          fontSize: 12, color: '#5C4A3A', marginTop: 4,
        }}>{d.region}</div>
        <div style={{
          marginTop: 12, paddingTop: 12, borderTop: '1px dashed #1F1A14',
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.8, color: '#8C6A24' }}>
              {lang==='tr'?'BAŞLANGIÇ':'FROM'}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 800, fontSize: 18, color: '#1F1A14' }}>{d.from}</span>
              <span style={{ fontSize: 11, color: '#5C4A3A' }}>TL</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.8, color: '#8C6A24' }}>
              {lang==='tr'?'SÜRE':'DAYS'}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 800, fontSize: 18, color: '#1F1A14' }}>{d.days}</span>
              <span style={{ fontSize: 11, color: '#5C4A3A' }}>{lang==='tr'?'gün':'days'}</span>
            </div>
          </div>
          <span style={{
            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
            fontSize: 22, color: '#B7312C', fontWeight: 700,
          }}>→</span>
        </div>
      </div>
    </div>
  );
}

// 02 ─── DASHBOARD / FLIGHT BOARD ─────────────────────────────────
function WebFlightBoardScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  return (
    <PageShell>
      <WebTopNav active="board" onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />
      <HeroBand
        eyebrow={u.c.boardEyebrow}
        title={u.c.welcome + '.'}
        sub={u.lang==='tr'?'Yaklaşan uçuşunuz 3 gün, 4 saat sonra.':'Your next flight is in 3 days, 4 hours.'}
        accent={u.accent} height={240}
      />
      <div style={{ maxWidth: 1280, margin: '-30px auto 0', padding: '0 32px', position: 'relative', zIndex: 5 }}>
        {/* Section eyebrow — explains what these tiles are */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
          padding: '0 4px',
        }}>
          <span style={{
            display: 'inline-block', width: 18, height: 1.5,
            background: u.accent?.bg || '#C5A059',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2,
            fontWeight: 800, color: '#fff',
          }}>{u.lang==='tr' ? 'HESAP ÖZETİ' : 'ACCOUNT SNAPSHOT'}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
            {u.lang==='tr' ? '· Miles&Smiles ve seyahat istatistikleriniz' : '· Your Miles&Smiles and travel stats'}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <KPIStat
            label={u.lang==='tr'?'Miles&Smiles bakiyesi':'Miles&Smiles balance'}
            value="87.420" valueSuffix={u.lang==='tr'?'mil':'miles'}
            hint={u.lang==='tr'?'↑ +2.840 bu ay kazanıldı':'↑ +2.840 earned this month'}
            icon="✦" accent={u.accent} />
          <KPIStat
            label={u.lang==='tr'?'Üyelik statünüz':'Your status tier'}
            value="Elite+"
            hint={u.lang==='tr'?'ELITE\'a 12.580 mil kaldı':'12,580 miles to ELITE'}
            icon="★" accent={u.accent} />
          <KPIStat
            label={u.lang==='tr'?'Yaklaşan uçuş':'Next flight'}
            value="3 gün" valueSuffix={u.lang==='tr'?'kaldı':'left'}
            hint="IST → FCO · TK 1853"
            icon="⏱" accent={u.accent} />
          <KPIStat
            label={u.lang==='tr'?'Bu yıl uçtuğunuz':'This year flown'}
            value="42" valueSuffix={u.lang==='tr'?'uçuş':'flights'}
            hint={u.lang==='tr'?'18 ülke · 87.400 mil':'18 countries · 87,400 miles'}
            icon="✈" accent={u.accent} />
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: '32px auto 0', padding: '0 32px',
        display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <UpcomingFlightLarge u={u} nav={nav} />
          <button onClick={() => nav('turkiyeTuru')} style={{
            background: 'linear-gradient(120deg, #B7372A 0%, #E5712C 60%, #F4C24C 100%)',
            border: 'none', borderRadius: 14, padding: '22px 26px', cursor: 'pointer',
            color: '#FAF6E9', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 22,
          }}>
            <div style={{
              width: 84, height: 84, borderRadius: '50%', border: '3px solid #FAF6E9',
              flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 1,
              transform: 'rotate(-6deg)', textAlign: 'center', lineHeight: 1,
            }}>TÜR<br/>KİYE</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 12, letterSpacing: 2.5, opacity: 0.9 }}>YENİ · 14 GÜN</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontStyle: 'italic', fontSize: 28, letterSpacing: -0.5, marginTop: 4 }}>
                Türkiye baştan sona.
              </div>
              <div style={{ fontSize: 13.5, opacity: 0.9, marginTop: 4 }}>
                {u.lang==='tr'?'7 şehir · 4 hafta · 32.400 TL\'den':'7 cities, 4 weeks, from 32,400 TL'}
              </div>
            </div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 2, padding: '10px 18px', border: '1px solid #FAF6E9' }}>OPEN →</span>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 18 }}>
            <SectionTitle eyebrow={u.lang==='tr'?'HIZLI':'QUICK'} title={u.lang==='tr'?'Bir tık':'One click'} accent={u.accent} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {[
                { i: 'qr', l: 'Check-in', s: 'checkin' },
                { i: 'bell', l: u.lang==='tr'?'Fiyat alarmı':'Price alert', s: 'priceAlert' },
                { i: 'coffee', l: 'Lounge', s: 'lounge' },
                { i: 'link', l: 'Co-Pilot', s: 'copilot' },
              ].map(q => (
                <button key={q.i} onClick={() => nav(q.s)} style={{
                  background: '#F3F5F8', border: '1px solid transparent', borderRadius: 10,
                  padding: '12px', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ width: 32, height: 32, borderRadius: 8, background: `${u.accent.bg}1A`, color: u.accent.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={q.i} size={15} />
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0A1628' }}>{q.l}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 18 }}>
            <SectionTitle eyebrow="ÖNEMLİ" title={u.c.notifications} accent={u.accent}
              action={<button onClick={() => nav('notifications')} style={{ background: 'transparent', border: 'none', color: u.accent.bg, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{u.lang==='tr'?'Tümü →':'All →'}</button>} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <NotifMini u={u} tint={u.accent} icon="plane" title={u.lang==='tr'?'TK 1853 için biniş açıldı':'Boarding open'} time="12dk" />
              <NotifMini u={u} tint={{ bg: '#C5A059', fg: '#C5A059' }} icon="star" title={u.lang==='tr'?'2.840 mil eklendi':'2,840 mi added'} time="1sa" />
              <NotifMini u={u} tint={{ bg: '#16A34A', fg: '#16A34A' }} icon="link" title={u.lang==='tr'?'Mehmet katıldı':'Mehmet joined'} time="3sa" />
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #1B3868, #0F2244)', borderRadius: 12, padding: 18, color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: 14, top: 14, fontSize: 38 }}>☀️</div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: u.accent.fg }}>FCO · ROMA</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 32, marginTop: 4, letterSpacing: -0.5 }}>26°</div>
            <div style={{ fontSize: 12, color: '#B2C0D1', marginTop: 4 }}>{u.lang==='tr'?'Açık · 17 Haz varışında':'Clear · 17 Jun at arrival'}</div>
          </div>
        </div>
      </div>
      <div style={{ height: 60 }} />
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}
function UpcomingFlightLarge({ u, nav }) {
  return (
    <div onClick={() => nav('boarding')} style={{
      background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
      padding: '24px 26px', cursor: 'pointer', boxShadow: '0 10px 28px rgba(10,22,40,0.08)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThyBadge variant="status">{u.c.onTime}</ThyBadge>
          <ThyBadge variant="mono">TK 1853 · A321neo</ThyBadge>
        </div>
        <span style={{ fontSize: 11, color: u.accent.bg, fontWeight: 700 }}>{u.c.boardingPass} →</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', alignItems: 'center', gap: 20 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 56, color: '#0A1628', letterSpacing: -2, lineHeight: 1 }}>IST</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 8, fontWeight: 700 }}>{u.lang==='tr'?'İstanbul Hav.':'Istanbul Airport'}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#0A1628', marginTop: 14 }}>14:25</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>17 Haz · Salı</div>
        </div>
        <div>
          <div style={{ position: 'relative', height: 28, marginBottom: 8 }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: '#E2E8F0' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, height: 2, width: '40%', background: u.accent.bg }} />
            <span style={{ position: 'absolute', top: -3, left: -5, width: 10, height: 10, borderRadius: '50%', background: u.accent.bg }} />
            <span style={{ position: 'absolute', top: -3, right: -5, width: 10, height: 10, borderRadius: '50%', background: '#94A3B8' }} />
            <span style={{ position: 'absolute', top: -16, left: '36%', fontSize: 22, transform: 'rotate(45deg)', color: u.accent.bg }}>✈</span>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#64748B', fontWeight: 600 }}>3s 25dk · {u.lang==='tr'?'Aktarmasız':'Direct'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 56, color: '#0A1628', letterSpacing: -2, lineHeight: 1 }}>FCO</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 8, fontWeight: 700 }}>Roma · Fiumicino</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#0A1628', marginTop: 14 }}>16:50</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>+2 lokal</div>
        </div>
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px dashed #CBD5E1',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <MiniStat label={u.c.gate} value="A12" />
        <MiniStat label={u.c.seat} value="14F" />
        <MiniStat label="BOARDING" value="13:55" />
        <MiniStat label="PNR" value="EBHHN3" />
      </div>
    </div>
  );
}
function NotifMini({ u, tint, icon, title, time }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: `${tint.bg}1A`, color: tint.fg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={14} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0A1628', lineHeight: 1.35 }}>{title}</div>
        <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{time}</div>
      </div>
    </div>
  );
}

// 03 ─── SEARCH ────────────────────────────────────────────────
function WebSearchScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const [booking, setBooking, h] = useBooking();
  const [trip, setTrip] = React.useState(booking.tripType || 'round');
  const toast = useToast();
  React.useEffect(() => { setBooking({ tripType: trip }); }, [trip]);
  const depFmt = formatDateShort(booking.depDate, u.lang);
  const retFmt = formatDateShort(booking.retDate, u.lang);
  return (
    <PageShell>
      <WebTopNav active="search" onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />
      <HeroBand
        eyebrow={u.lang==='tr'?'✈ YENİ UÇUŞ':'✈ NEW FLIGHT'}
        title={u.c.search + '.'}
        sub={u.lang==='tr'?'Rotanızı belirleyin, biletinizi seçin.':'Pick your route, choose your fare.'}
        accent={u.accent} height={240}
      />
      <div style={{ maxWidth: 1280, margin: '-50px auto 0', padding: '0 32px', position: 'relative', zIndex: 1 }}>
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
          boxShadow: '0 22px 50px rgba(10,22,40,0.18)', padding: 24 }}>
          <div style={{ display: 'inline-flex', background: '#F3F5F8', borderRadius: 999, padding: 4, marginBottom: 20 }}>
            {[
              { id: 'round', l: u.lang==='tr'?'Gidiş-Dönüş':'Round' },
              { id: 'one',   l: u.lang==='tr'?'Tek yön':'One way' },
              { id: 'multi', l: u.lang==='tr'?'Çoklu':'Multi' },
            ].map(o => (
              <button key={o.id} onClick={() => setTrip(o.id)} style={{
                padding: '9px 18px', borderRadius: 999, border: 'none',
                background: trip === o.id ? '#fff' : 'transparent',
                color: trip === o.id ? '#0A1628' : '#64748B',
                fontWeight: 700, fontSize: 12, cursor: 'pointer',
                boxShadow: trip === o.id ? '0 1px 4px rgba(10,22,40,0.08)' : 'none',
              }}>{o.l}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            <CityAutocomplete
              value={booking.fromCode}
              onChange={(code) => setBooking({ fromCode: code })}
              otherSide={booking.toCode}
              label={u.c.from}
              accent={u.accent} lang={u.lang}
            />
            <CityAutocomplete
              value={booking.toCode}
              onChange={(code) => setBooking({ toCode: code })}
              otherSide={booking.fromCode}
              label={u.c.to}
              accent={u.accent} lang={u.lang}
            />
            <DatePickerCell
              label={u.c.depart}
              value={booking.depDate}
              lang={u.lang}
              onChange={(iso) => {
                const patch = { depDate: iso };
                if (booking.retDate && booking.retDate < iso) patch.retDate = plusDaysISO(iso, 7);
                setBooking(patch);
              }}
            />
            <DatePickerCell
              label={u.c.return}
              value={booking.retDate}
              minISO={booking.depDate}
              lang={u.lang}
              disabled={trip === 'one'}
              onChange={(iso) => setBooking({ retDate: iso })}
            />
          </div>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 12 }}>
            <div style={{ padding: '12px 14px', border: '1px solid #E2E8F0', borderRadius: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: '#94A3B8' }}>{u.c.pax}</div>
              <div style={{ fontWeight: 800, fontSize: 14, marginTop: 2 }}>1 {u.lang==='tr'?'Yetişkin':'Adult'}</div>
            </div>
            <div style={{ padding: '12px 14px', border: '1px solid #E2E8F0', borderRadius: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: '#94A3B8' }}>{u.lang==='tr'?'KABIN':'CABIN'}</div>
              <div style={{ fontWeight: 800, fontSize: 14, marginTop: 2 }}>Economy</div>
            </div>
            <ThyButton variant="search" size="lg" fullWidth onClick={() => {
              if (booking.fromCode === booking.toCode) {
                toast({ type: 'error', icon: '!', children: u.lang==='tr'?'Kalkış ile varış aynı olamaz':'Origin and destination must differ' });
                return;
              }
              toast({ type: 'info', icon: '✈', children: u.lang==='tr'?'Uçuşlar aranıyor…':'Searching flights…' });
              setTimeout(() => nav('results'), 350);
            }}>{u.c.searchCta}</ThyButton>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '40px auto 0', padding: '0 32px',
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        <div>
          <SectionTitle eyebrow={u.lang==='tr'?'SON ARAMALARINIZ':'YOUR RECENT'} title={u.lang==='tr'?'Tekrar bakın':'Take another look'} accent={u.accent} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { f: 'IST', t: 'AMS', d: '28 Haz · 1 yetişkin', p: '4.890' },
              { f: 'AYT', t: 'LHR', d: '03 Tem · 2 yetişkin', p: '8.220' },
              { f: 'IST', t: 'BCN', d: '15 Tem · 1 yetişkin', p: '3.480' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14,
                background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                <Icon name="history" size={16} color="#94A3B8" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 16, color: '#0A1628' }}>{r.f}</span>
                    <Icon name="arrowR" size={12} color="#94A3B8" />
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 16, color: '#0A1628' }}>{r.t}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>{r.d}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 16, color: '#0A1628' }}>{r.p}</div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>TL</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle eyebrow={u.lang==='tr'?'FİYAT TAKVİMİ':'PRICE CALENDAR'} title="IST → FCO · Haziran" accent={u.accent} />
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {Array.from({ length: 28 }, (_, i) => {
                const day = i + 1;
                const price = 3900 + ((day * 117) % 2400);
                const cheap = price < 4800;
                return (
                  <div key={day} style={{
                    padding: '8px 4px', textAlign: 'center', borderRadius: 6,
                    background: cheap ? 'rgba(34,197,94,0.08)' : '#F8FAFC',
                    border: '1px solid ' + (cheap ? 'rgba(34,197,94,0.3)' : 'transparent'),
                    cursor: 'pointer',
                  }}>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>{day}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11, color: cheap ? '#16A34A' : '#0A1628', marginTop: 2 }}>
                      {(price / 1000).toFixed(1)}K
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: 60 }} />
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}

// 04 ─── RESULTS ──────────────────────────────────────────────
function WebResultsScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const [booking, setBooking, h] = useBooking();
  const toast = useToast();
  const [sort, setSort] = React.useState('price');
  const [direct, setDirect] = React.useState(true);
  const [leg, setLeg] = React.useState('out');

  const fromC = h.from || findCity('IST');
  const toC   = h.to   || findCity('FCO');
  const dur   = durationFor(fromC.code, toC.code);
  const basePrice = priceFor(fromC.code, toC.code, 1800);
  const depFmt = formatDateShort(booking.depDate, u.lang);
  const retFmt = formatDateShort(booking.retDate, u.lang);

  // deterministic departures per route
  const seedNum = (fromC.code + toC.code).split('').reduce((s, ch) => s + ch.charCodeAt(0), 0);
  const timeAt = (offsetMin) => {
    const total = ((seedNum * 7) + offsetMin) % (24*60);
    return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
  };
  const addMin = (tt, min) => {
    const [hh,mm] = tt.split(':').map(Number);
    const tot = (hh*60 + mm + min) % (24*60);
    return `${String(Math.floor(tot/60)).padStart(2,'0')}:${String(tot%60).padStart(2,'0')}`;
  };
  const flights = [
    { id: 0, dep: timeAt(0),   code: 'TK ' + (1800 + seedNum%200), plane: 'A321neo', stops: 0, tag: 'cheap', delta: -380, extra: 0 },
    { id: 1, dep: timeAt(230), code: 'TK ' + (1820 + seedNum%200), plane: 'A330',    stops: 0, delta: 0,    extra: 0 },
    { id: 2, dep: timeAt(560), code: 'TK ' + (1840 + seedNum%200), plane: 'B777',    stops: 0, tag: 'gold', delta: 420,  extra: 0 },
    { id: 3, dep: timeAt(770), code: 'TK ' + (1860 + seedNum%200), plane: 'A321',    stops: 1, tag: 'night', delta: -120, extra: 135 },
  ].map(f => ({
    ...f,
    arr: addMin(f.dep, dur.totalMin + f.extra),
    dur: f.stops === 0 ? dur.txt : `${dur.h+2}s ${String(dur.m).padStart(2,'0')}dk`,
  }));
  let filtered = flights.filter(f => !direct || f.stops === 0);
  if (sort === 'price')         filtered = [...filtered].sort((a,b) => a.delta - b.delta);
  else if (sort === 'time')     filtered = [...filtered].sort((a,b) => a.dep.localeCompare(b.dep));
  else if (sort === 'duration') filtered = [...filtered].sort((a,b) => a.dur.localeCompare(b.dur));
  const fares = [
    { name: 'EcoFly',        delta: 0,    color: '#4CA7BB' },
    { name: 'ExtraFly',      delta: 740,  color: '#0066CC' },
    { name: 'PrimeFly',      delta: 2360, color: '#88594A' },
    { name: 'BusinessPrime', delta: 8000, color: '#3F2D24' },
  ];

  return (
    <PageShell>
      <WebTopNav active="search" onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />

      {/* breadcrumb / route */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '20px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => nav('search')} style={{ background: '#F3F5F8', border: '1px solid #E2E8F0', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', color: '#0A1628', fontSize: 12, fontWeight: 700 }}>← {u.lang==='tr'?'Aramayı düzenle':'Edit search'}</button>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 22, color: '#0A1628', letterSpacing: 1 }}>{fromC.code} → {toC.code}</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>{depFmt.day} {depFmt.mo} · {h.paxTotal} {u.lang==='tr'?'Yetişkin':'Adult'} · Economy</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px',
        display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>
        {/* Sidebar filters */}
        <aside style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 18, height: 'fit-content', position: 'sticky', top: 80 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#64748B', textTransform: 'uppercase', marginBottom: 14 }}>{u.lang==='tr'?'FİLTRELER':'FILTERS'}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>{u.lang==='tr'?'Sıralama':'Sort'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
            {[
              { id: 'price', l: u.c.sortPrice },
              { id: 'time',  l: u.c.sortTime },
              { id: 'duration', l: u.c.sortDuration },
            ].map(o => (
              <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#0A1628' }}>
                <input type="radio" name="sort" checked={sort===o.id} onChange={() => setSort(o.id)} style={{ accentColor: u.accent.bg }} />
                {o.l}
              </label>
            ))}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>{u.lang==='tr'?'Aktarma':'Stops'}</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#0A1628', marginBottom: 18 }}>
            <input type="checkbox" checked={direct} onChange={() => setDirect(!direct)} style={{ accentColor: u.accent.bg }} />
            {u.c.onlyDirect}
          </label>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>{u.lang==='tr'?'Fiyat aralığı':'Price range'}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#64748B', marginBottom: 6 }}>3.900 – 14.500 TL</div>
          <div style={{ height: 4, background: '#E2E8F0', borderRadius: 4, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '5%', right: '20%', top: 0, bottom: 0, background: u.accent.bg, borderRadius: 4 }} />
          </div>
        </aside>

        {/* Main */}
        <div>
          {/* Leg tabs */}
          <ThyTabs light value={leg} onChange={setLeg} style={{ marginBottom: 16, borderRadius: 10, overflow: 'hidden', border: '1px solid #E2E8F0', background: '#fff' }}
            items={[
              { id: 'out',    label: (u.lang==='tr'?'Gidiş · ':'Outbound · ') + depFmt.day + ' ' + depFmt.mo },
              { id: 'return', label: (u.lang==='tr'?'Dönüş · ':'Return · ')   + retFmt.day + ' ' + retFmt.mo },
            ]} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map((f, idx) => (
              <DSFlightCard key={f.id} lang={u.lang}
                depTime={f.dep} arrTime={f.arr} depCode={fromC.code} arrCode={toC.code}
                duration={f.dur} code={f.code} plane={f.plane} stops={f.stops}
                tag={f.tag === 'cheap' ? <ThyBadge variant="red" style={{ fontSize: 8.5 }}>{u.lang==='tr'?'EN UCUZ':'CHEAPEST'}</ThyBadge>
                  : f.tag === 'gold' ? <ThyBadge variant="gold">B777</ThyBadge>
                  : f.tag === 'night' ? <ThyBadge variant="outbound">{u.lang==='tr'?'GECE':'NIGHT'}</ThyBadge>
                  : null}
                fares={fares.map(fa => ({ ...fa, price: formatPriceTL(basePrice + fa.delta + f.delta) }))}
                onSelectFare={(fa) => {
                  const flightInfo = {
                    code: f.code, dep: f.dep, arr: f.arr, dur: f.dur, plane: f.plane,
                    fareName: fa.name, price: fa.price,
                  };
                  if (leg === 'out') {
                    setBooking({ outbound: flightInfo, fareFamily: fa.name, selectedFlightId: f.code });
                    if (booking.tripType === 'one') {
                      toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Uçuş seçildi':'Flight selected' });
                      setTimeout(() => nav('confirm'), 500);
                    } else {
                      toast({ type: 'info', icon: '→', children: u.lang==='tr'?'Şimdi dönüş uçuşunu seçin':'Now choose your return' });
                      setLeg('return');
                      // scroll to top of results area
                      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                    }
                  } else {
                    setBooking({ returnSel: flightInfo });
                    toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Dönüş seçildi':'Return selected' });
                    setTimeout(() => nav('confirm'), 500);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div style={{ height: 60 }} />
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}

// 05 ─── BOARDING PASS ─────────────────────────────────────────
function WebBoardingPassScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: true });
  const toast = useToast();
  return (
    <PageShell dark style={{ background: 'linear-gradient(180deg, #050B14 0%, #0A1628 50%, #0F2244 100%)' }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} dark />
      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '40px 32px 60px' }}>
        <GlobeNetworkBg opacity={0.07} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <ThyBadge variant="gold">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8C97A', display: 'inline-block', marginRight: 4, animation: 'thy-pulse 1.8s ease-out infinite' }} />
              {u.c.boardingNow}
            </ThyBadge>
            <ThyBadge variant="mono">EBHHN3</ThyBadge>
            <ThyBadge variant="mono">TK 1853 · A321neo</ThyBadge>
            <button onClick={() => { toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Biniş kartı kopyalandı':'Boarding pass copied' }); }} style={{
              marginLeft: 'auto', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, padding: '8px 12px', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name="copy" size={14} /> {u.lang==='tr'?'Paylaş':'Share'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
            {/* Main ticket */}
            <div style={{
              position: 'relative', overflow: 'hidden',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.025) 100%)',
              border: '1px solid rgba(197,160,89,0.25)', borderRadius: 18,
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 24px rgba(197,160,89,0.12)',
              backdropFilter: 'blur(10px)', padding: 32,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <img src={(window.__resources?.logoLight) || 'assets/logo.png'} alt="" style={{ height: 26 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: u.accent.fg, letterSpacing: 2, fontWeight: 700 }}>
                  BOARDING PASS · DOMESTIC
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 72, lineHeight: 1, color: '#fff', letterSpacing: -2 }}>IST</div>
                  <div style={{ fontSize: 13, color: '#B2C0D1', marginTop: 8 }}>İstanbul Havalimanı</div>
                </div>
                <div style={{ flex: 1, position: 'relative', height: 36 }}>
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, borderTop: '1.5px dashed rgba(197,160,89,0.5)' }} />
                  <span style={{ position: 'absolute', top: -3, left: '6%', fontSize: 24, color: u.accent.fg, animation: 'thy-plane 3.2s ease-in-out infinite' }}>✈</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 72, lineHeight: 1, color: '#fff', letterSpacing: -2 }}>FCO</div>
                  <div style={{ fontSize: 13, color: '#B2C0D1', marginTop: 8 }}>Roma · Fiumicino</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <MiniStat label="PASSENGER" value="A. KAYA" dark />
                <MiniStat label="CLASS" value="Economy" dark />
                <MiniStat label="GATE" value="A12" dark />
                <MiniStat label="SEAT" value="14F" dark />
                <MiniStat label="BOARDING" value="13:55" dark />
                <MiniStat label="DEPARTS" value="14:25" dark />
              </div>
            </div>

            {/* QR + actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{
                background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(197,160,89,0.25)',
                borderRadius: 18, padding: 28, textAlign: 'center',
              }}>
                <div style={{
                  width: 220, height: 220, background: '#fff', borderRadius: 12,
                  margin: '0 auto', padding: 12,
                  boxShadow: `0 0 30px ${u.accent.glow}`,
                }}>
                  <QRGlyph size={196} />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#fff', marginTop: 14, letterSpacing: 2, fontWeight: 700 }}>
                  EBHHN3
                </div>
                <div style={{ fontSize: 11, color: '#B2C0D1', marginTop: 4 }}>
                  {u.lang==='tr'?'Kapı görevlisine gösterin':'Show to gate agent'}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <ThyButton variant="gold" size="md" icon="✈" onClick={() => nav('checkin')}>{u.lang==='tr'?'Check-in':'Check-in'}</ThyButton>
                <ThyButton variant="secondary" size="md" icon="☕" onClick={() => nav('lounge')}>Lounge</ThyButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}
function QRGlyph({ size = 196 }) {
  const N = 21;
  const cells = React.useMemo(() => {
    const out = []; let seed = 421;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      seed = (seed * 9301 + 49297) % 233280;
      out.push({ x, y, on: (seed / 233280) > 0.5 });
    }
    return out;
  }, []);
  const corner = (cx, cy) => (
    <g key={`c-${cx}-${cy}`}>
      <rect x={cx} y={cy} width="7" height="7" fill="#0A1628" />
      <rect x={cx+1} y={cy+1} width="5" height="5" fill="#fff" />
      <rect x={cx+2} y={cy+2} width="3" height="3" fill="#0A1628" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges">
      <rect width={N} height={N} fill="#fff" />
      {cells.map((c, i) => {
        const inC = (c.x < 7 && c.y < 7) || (c.x >= N - 7 && c.y < 7) || (c.x < 7 && c.y >= N - 7);
        if (inC) return null;
        return c.on ? <rect key={i} x={c.x} y={c.y} width="1" height="1" fill="#0A1628" /> : null;
      })}
      {corner(0,0)}{corner(N-7,0)}{corner(0,N-7)}
    </svg>
  );
}

Object.assign(window, {
  WebSplashScreen, WebFlightBoardScreen, WebSearchScreen, WebResultsScreen, WebBoardingPassScreen,
});
