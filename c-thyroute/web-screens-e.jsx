// web-screens-e.jsx — History, Help, Lounge (desktop)

// 21 ─── FLIGHT HISTORY — passport scrapbook ───────────────────
// Destination passport stamp info — each city's destination country.
// THY flies to 340+ destinations in 130+ countries internationally + 52 domestic cities.
const DEST_INFO_WEB = {
  AMS: { code3: 'NLD', name: { tr: 'HOLLANDA',      en: 'NETHERLANDS' },    glyph: '⚘', color: '#21468B', flag: '🇳🇱' },
  LHR: { code3: 'GBR', name: { tr: 'BİRLEŞİK KRALLIK', en: 'UNITED KINGDOM' }, glyph: '♛', color: '#C8102E', flag: '🇬🇧' },
  DXB: { code3: 'ARE', name: { tr: 'BİRLEŞİK ARAP EM.',  en: 'EMIRATES' },        glyph: '☪', color: '#00732F', flag: '🇦🇪' },
  JFK: { code3: 'USA', name: { tr: 'AMERİKA',       en: 'UNITED STATES' },   glyph: '★', color: '#3C3B6E', flag: '🇺🇸' },
  NRT: { code3: 'JPN', name: { tr: 'JAPONYA',       en: 'JAPAN' },           glyph: '⛩', color: '#BC002D', flag: '🇯🇵' },
  IST: { code3: 'TR',  name: { tr: 'TÜRKİYE',       en: 'TÜRKİYE' },         color: '#E30A17', flag: '🇹🇷', domestic: true, cityCode: 'IST' },
  AYT: { code3: 'TR',  name: { tr: 'TÜRKİYE',       en: 'TÜRKİYE' },         color: '#E30A17', flag: '🇹🇷', domestic: true, cityCode: 'AYT' },
  ADB: { code3: 'TR',  name: { tr: 'TÜRKİYE',       en: 'TÜRKİYE' },         color: '#E30A17', flag: '🇹🇷', domestic: true, cityCode: 'ADB' },
};
function destOfWeb(route) { return route.split('→')[1]?.trim() || ''; }

function WebFlightHistoryScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const flights = [
    { d: '12·05·26', route: 'IST → AMS', code: 'TK 1953', km: 2.205, rot: -4, n: '042' },
    { d: '01·05·26', route: 'AYT → IST', code: 'TK 2317', km:   485, rot:  3, n: '041' },
    { d: '14·03·26', route: 'IST → LHR', code: 'TK 1979', code2: 'JOINED ★ELITE', km: 2.519, rot: -2, n: '040', special: true },
    { d: '22·02·26', route: 'IST → DXB', code: 'TK 0762', km: 3.020, rot: 5, n: '039' },
    { d: '08·01·26', route: 'IST → JFK', code: 'TK 0001', km: 8.040, rot: -3, n: '038' },
    { d: '24·11·25', route: 'IST → NRT', code: 'TK 0050', km: 8.880, rot: 2, n: '037' },
  ];
  return (
    <PageShell style={{
      background: '#EFE6CE',
      backgroundImage: `
        radial-gradient(ellipse 800px 250px at 50% 0%, rgba(0,0,0,0.06), transparent),
        repeating-linear-gradient(45deg, rgba(0,0,0,0.018) 0 2px, transparent 2px 5px)
      `,
      fontFamily: "'EB Garamond', Georgia, serif", color: '#1F1A14',
    }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontStyle: 'italic', fontSize: 13, letterSpacing: 5, color: '#B7312C' }}>
            ★ PASAPORT — TRAVEL JOURNAL ★
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic',
            fontSize: 80, letterSpacing: -2, lineHeight: 1, margin: '8px 0 0' }}>
            {u.lang==='tr'?'Geçmiş ':'Past '}<span style={{ fontWeight: 500, fontSize: 64 }}>{u.lang==='tr'?'uçuşlar':'flights'}</span>
          </h1>
          <div style={{ marginTop: 12, fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#525252', letterSpacing: 1.5 }}>
            42 {u.lang==='tr'?'uçuş':'flights'} · 18 {u.lang==='tr'?'ülke':'countries'} · 87 420 mil
          </div>
          <div style={{ marginTop: 6, fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 13, color: '#525252AA' }}>
            {u.lang==='tr'
              ? '— THY\'nin 130+ ülke, 340+ varma noktası ağından'
              : '— from THY\'s network of 340+ destinations in 130+ countries'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 26,
          fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#525252' }}>
          {['2026','2025','2024','All'].map((y, i) => (
            <span key={y} style={{ padding: '6px 14px', border: '1px solid #1F1A14',
              background: i === 0 ? '#1F1A14' : 'transparent',
              color: i === 0 ? '#EFE6CE' : '#1F1A14', letterSpacing: 1.5 }}>{y}</span>
          ))}
        </div>

        {/* Two-column scrapbook */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {flights.map(f => <StampCardWeb key={f.n} f={f} lang={u.lang} />)}
        </div>

        <div style={{ marginTop: 24, textAlign: 'center', fontStyle: 'italic', fontSize: 13, color: '#525252' }}>
          — {u.lang==='tr'?'sayfa sonu':'end of page'} 1 / 4 —
        </div>
      </div>
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}
function StampCardWeb({ f, lang }) {
  const info = DEST_INFO_WEB[destOfWeb(f.route)] || { color: '#525252', code3: destOfWeb(f.route) };
  return (
    <div style={{
      position: 'relative', background: '#F5ECD3',
      padding: '20px 22px', border: '1px dashed #1F1A1466', borderRadius: 2,
      boxShadow: '6px 6px 0 rgba(31,26,20,0.08)',
      display: 'flex', alignItems: 'center', gap: 22,
    }}>
      <CountryStampWeb info={info} date={f.d} rot={f.rot} size={108} lang={lang} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#525252', letterSpacing: 1.2 }}>
          JOURNAL N° {f.n}
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 30, marginTop: 4, lineHeight: 1 }}>
          {f.route}
        </div>
        <div style={{ marginTop: 8, fontSize: 14, fontStyle: 'italic', color: '#525252' }}>
          {f.code} · {f.km.toLocaleString('tr-TR')} km · {(f.km * 1).toLocaleString('tr-TR')} mil
        </div>
        {f.special && (
          <div style={{
            marginTop: 12, display: 'inline-block', padding: '5px 14px',
            background: 'linear-gradient(135deg, #C5A059, #E8C97A)',
            color: '#1F1A14', fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 14, letterSpacing: 2,
            transform: 'rotate(-2deg)',
          }}>{f.code2}</div>
        )}
      </div>
    </div>
  );
}

function CountryStampWeb({ info, date, rot, size, lang }) {
  const dom = info.domestic;
  const color = info.color || '#525252';
  return (
    <div style={{
      position: 'relative', width: size, height: size, flexShrink: 0,
      transform: `rotate(${rot}deg)`,
    }}>
      <div style={{
        position: 'relative', width: size, height: size,
        border: `3px solid ${color}`, borderRadius: '50%',
        background: `${color}06`,
        color: color, opacity: 0.94,
        fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', lineHeight: 1,
      }}>
        <span style={{
          position: 'absolute', inset: 7,
          border: `1px solid ${color}66`, borderRadius: '50%', pointerEvents: 'none',
        }} />
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 8.5, letterSpacing: 2,
          color: `${color}CC`, marginTop: 8,
        }}>{dom ? 'DOMESTIC' : 'ENTRY'}</span>
        {dom
          ? (
            <span style={{
              fontFamily: "'DM Mono', monospace", fontWeight: 700,
              fontSize: 28, letterSpacing: 2.5, color: color, marginTop: 4, marginBottom: 2,
            }}>{info.cityCode}</span>
          ) : (
            <span style={{ fontSize: 32, lineHeight: 1, marginTop: 3, marginBottom: 3, color: color }}>{info.glyph}</span>
          )
        }
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: dom ? 13 : 12,
          letterSpacing: dom ? 2.5 : 1.5, color: color,
          padding: '0 8px', maxWidth: '100%',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{dom ? 'TÜRKİYE' : info.code3}</span>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10,
          color: `${color}DD`, marginTop: 3,
        }}>{date}</span>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 9,
          letterSpacing: 3, color: `${color}AA`, marginTop: 3, marginBottom: 6,
        }}>★ THY ★</span>
      </div>
      <span style={{
        position: 'absolute', right: -6, bottom: -6,
        fontSize: 22, lineHeight: 1,
        background: '#F5ECD3', padding: 3, borderRadius: 6,
        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
        transform: `rotate(${-rot}deg)`,
      }}>{info.flag}</span>
    </div>
  );
}

// 22 ─── HELP & SUPPORT — Notion docs ──────────────────────────
function WebHelpSupportScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const toast = useToast();
  const [open, setOpen] = React.useState('change');

  const faqs = [
    { id: 'change', q: u.lang==='tr'?'Biletimi nasıl değiştiririm?':'How do I change my ticket?',
      a: u.lang==='tr'
        ? 'Cüzdan > biletinizi açın > "Değiştir". Tarife farkı ve ücretsiz iade penceresi otomatik hesaplanır. Elite+ üyeler ilk değişikliği ücretsiz yapar.'
        : 'Wallet > open ticket > "Change". Fare diff and free-cancel window auto-calculated. Elite+ members get the first change for free.' },
    { id: 'refund', q: u.lang==='tr'?'İade kaç gün sürer?':'How long do refunds take?',
      a: u.lang==='tr'?'Kredi kartı: 5-7 iş günü. Banka havalesi: 3 iş günü. Miles iadesi anında.':'Credit card: 5-7 business days. Bank transfer: 3 business days. Miles refund is instant.' },
    { id: 'bag', q: u.lang==='tr'?'Bagajım kaybolursa?':'What if my baggage is lost?',
      a: u.lang==='tr'?'Bildirim > "Bagaj sorun bildir" ya da varış havalimanı kaybolan eşya bankosu. Etiket numaranızla 24/7 takip edebilirsiniz.':'Notifications > "Report baggage issue" or visit the lost-and-found desk at arrival. Track with your tag number 24/7.' },
    { id: 'meals', q: u.lang==='tr'?'Özel yemek talep edebilir miyim?':'Can I request a special meal?',
      a: u.lang==='tr'?'Evet. Uçuştan en az 24 saat önce bilet detayından seçebilirsiniz: vejetaryen, vegan, helal, glütensiz, çocuk menüsü.':'Yes. Request from ticket details at least 24h before departure: vegetarian, vegan, halal, gluten-free, child.' },
    { id: 'wifi', q: u.lang==='tr'?'Uçakta WiFi var mı?':'Is WiFi available onboard?',
      a: u.lang==='tr'?'Geniş gövdeli uçuşlarda ücretsiz mesajlaşma, ücretli premium WiFi. Elite Plus üyeler için tüm uçuşlar ücretsiz.':'Free messaging on wide-body flights, paid premium WiFi. Free for Elite Plus on all flights.' },
  ];

  return (
    <PageShell style={{ background: '#fff', fontFamily: "'Inter', system-ui, sans-serif", color: '#37352F' }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 60px',
        display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40 }}>
        {/* Sidebar TOC */}
        <aside style={{ position: 'sticky', top: 90, height: 'fit-content' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            {u.lang==='tr'?'KATEGORİLER':'CATEGORIES'}
          </div>
          {[
            { e: '✈️', l: u.lang==='tr'?'Bilet':'Tickets', c: 12 },
            { e: '🧳', l: u.lang==='tr'?'Bagaj':'Baggage', c: 8 },
            { e: '✦',  l: 'Miles', c: 14 },
            { e: '🛂', l: u.lang==='tr'?'Vize & belge':'Visa & docs', c: 6 },
            { e: '👤', l: u.lang==='tr'?'Hesap':'Account', c: 9 },
            { e: '💳', l: u.lang==='tr'?'Ödeme':'Payment', c: 7 },
          ].map(o => (
            <button key={o.l} style={{
              padding: '8px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: 'transparent', textAlign: 'left',
              fontFamily: 'inherit', fontSize: 13, color: '#37352F',
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F7F6F3'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: 15 }}>{o.e}</span>
              <span style={{ flex: 1 }}>{o.l}</span>
              <span style={{ fontSize: 11, color: '#9B9A97' }}>{o.c}</span>
            </button>
          ))}
          <button onClick={() => toast({ type: 'info', icon: '✆', children: u.lang==='tr'?'Sohbet açılıyor…':'Opening chat…' })} style={{
            marginTop: 22, width: '100%', padding: '10px 12px',
            background: '#37352F', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}><Icon name="headset" size={14} /> {u.lang==='tr'?'Canlı destek':'Live chat'}</button>
        </aside>

        <div>
          <div style={{ fontSize: 60, lineHeight: 1, marginBottom: 12 }}>📔</div>
          <h1 style={{ fontFamily: 'inherit', fontWeight: 700, fontSize: 48, letterSpacing: -1.2,
            margin: 0, color: '#37352F' }}>{u.lang==='tr'?'Yardım merkezi':'Help center'}</h1>
          <p style={{ margin: '8px 0 22px', fontSize: 16, color: '#37352F99', lineHeight: 1.5 }}>
            {u.lang==='tr'?'Aradığınızı 30 saniyede bulun. Bulamazsanız 7/24 yanınızdayız.':'Find what you need in 30 seconds. If not, we are here 24/7.'}
          </p>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 16px', background: '#F7F6F3',
            borderRadius: 8, border: '1px solid #E9E9E7', marginBottom: 26,
          }}>
            <Icon name="search" size={18} color="#9B9A97" />
            <input placeholder={u.lang==='tr'?'Soru yazın veya konu arayın…':'Ask a question or search a topic…'}
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none',
                fontFamily: 'inherit', fontSize: 15, color: '#37352F' }} />
            <span style={{ padding: '3px 8px', background: '#E9E9E7', color: '#787774',
              borderRadius: 4, fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>⌘ K</span>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
            {u.lang==='tr'?'Sıkça sorulanlar':'Frequently asked'}
          </div>
          <div>
            {faqs.map(f => (
              <div key={f.id} style={{ borderTop: '1px solid #E9E9E7' }}>
                <button onClick={() => setOpen(open === f.id ? null : f.id)} style={{
                  width: '100%', textAlign: 'left', padding: '14px 0',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontFamily: 'inherit', color: '#37352F', fontSize: 15, fontWeight: 500,
                }}>
                  <span style={{ width: 18, color: '#9B9A97',
                    transform: open === f.id ? 'rotate(90deg)' : 'none',
                    transition: 'transform .2s' }}>›</span>
                  <span style={{ flex: 1 }}>{f.q}</span>
                </button>
                {open === f.id && (
                  <div style={{ padding: '0 0 16px 30px', fontSize: 14, lineHeight: 1.6, color: '#37352FCC' }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact strip */}
          <div style={{
            marginTop: 32, padding: 22, background: '#F7F6F3',
            borderRadius: 8, border: '1px solid #E9E9E7',
            display: 'flex', gap: 18, alignItems: 'center',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#37352F' }}>
                {u.lang==='tr'?'Hâlâ yardım gerekli mi?':'Still need help?'}
              </div>
              <div style={{ fontSize: 13, color: '#37352F99', marginTop: 4 }}>
                {u.lang==='tr'?'Bizimle 7/24 iletişime geçebilirsiniz.':'Reach us anytime, 7 days a week.'}
              </div>
            </div>
            <button onClick={() => toast({ type: 'info', icon: '☎', children: '+90 850 250 0 849' })} style={{
              padding: '10px 18px', background: '#fff', color: '#37352F',
              border: '1px solid #E9E9E7', borderRadius: 6, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            }}>+90 850 250 0 849</button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// 23 ─── LOUNGE — black & gold maison ──────────────────────────
function WebLoungeScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: true });
  const toast = useToast();
  return (
    <PageShell dark style={{
      background: 'radial-gradient(circle at 50% 0%, #1A1410 0%, #050302 60%, #000 100%)',
      color: '#E8C97A', fontFamily: "'Playfair Display', Georgia, serif",
    }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} dark />
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 64px)' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0,
          background: 'repeating-conic-gradient(from 30deg at 50% 50%, rgba(232,201,122,0.03) 0deg 10deg, transparent 10deg 30deg)',
          opacity: 0.5, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '40px 32px 60px' }}>
          {/* Title block */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Ornament />
            <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 14, letterSpacing: 8,
              color: '#C5A059', textTransform: 'uppercase' }}>maison thy</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontStyle: 'italic',
              fontSize: 96, letterSpacing: -2, lineHeight: 0.95, margin: '12px 0 0', color: '#F4EBD9' }}>
              The Cıp <span style={{ fontWeight: 500 }}>Lounge.</span>
            </h1>
            <div style={{ marginTop: 14, fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 16, color: '#C5A059CC' }}>
              IST · Terminal A · Gate A12
            </div>
            <Ornament />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
            {/* Left — status + services */}
            <div>
              <div style={{ padding: '24px 28px', background: 'rgba(232,201,122,0.06)',
                border: '1px solid #C5A05933',
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                <LMiniWeb label={u.lang==='tr'?'BUGÜN':'TODAY'}      value="OPEN · 22:00" />
                <LMiniWeb label={u.lang==='tr'?'YOĞUNLUK':'BUSY'}    value="42 %" />
                <LMiniWeb label={u.lang==='tr'?'YÜRÜYÜŞ':'WALK'}     value="6 min" />
                <LMiniWeb label={u.lang==='tr'?'KAPI':'GATE'}        value="A12" />
              </div>

              <div style={{ marginTop: 26, fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 13,
                letterSpacing: 4, color: '#C5A059', textAlign: 'center' }}>— LES SERVICES —</div>

              <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <LservWeb ic="coffee" label={u.lang==='tr'?'Şef menüsü':'Chef menu'}     sub="24 saat" />
                <LservWeb ic="bed"    label={u.lang==='tr'?'Sessiz oda':'Nap suite'}     sub="+ 90 dk" />
                <LservWeb ic="shield" label="Spa & duş"                                   sub={u.lang==='tr'?'ücretsiz':'complimentary'} />
                <LservWeb ic="wifi"   label="Premium WiFi"                                sub="1 Gbps" />
              </div>

              <div style={{ marginTop: 22, textAlign: 'center', fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
                fontSize: 12, color: '#C5A05966', letterSpacing: 2 }}>★ ELITE PLUS · COMPLIMENTARY ACCESS ★</div>
            </div>

            {/* Right — concierge card */}
            <div style={{
              padding: '28px 28px', background: '#0A0604',
              border: '1px solid #C5A05955',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E8C97A, #C5A059, #8B6F3E)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: '#000', fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                  fontWeight: 700, fontSize: 32, flexShrink: 0,
                  boxShadow: '0 0 30px rgba(197,160,89,0.4)' }}>S</div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 18, color: '#F4EBD9' }}>
                    Sophie · concierge
                  </div>
                  <div style={{ fontStyle: 'italic', fontSize: 13, color: '#C5A05999' }}>
                    {u.lang==='tr'?'7/24 hizmetinizde':'24/7 at your service'}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 22, padding: '14px 16px',
                background: 'rgba(232,201,122,0.04)', borderLeft: '2px solid #C5A059',
                fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
                fontSize: 15, color: '#C5A059CC', lineHeight: 1.5 }}>
                {u.lang==='tr'
                  ? '«Bonjour Aylin, masanız 19:30 için ayrıldı. Otomobiliniz hazır olacak.»'
                  : '«Bonjour Aylin, your table is held for 19:30. Your car will be ready.»'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
                <button onClick={() => toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Lounge erişimi onaylandı':'Lounge access confirmed' })} style={{
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, #C5A059, #E8C97A)',
                  color: '#0A0604', border: '1px solid #E8C97A', borderRadius: 0,
                  fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700,
                  fontSize: 15, cursor: 'pointer', letterSpacing: 1,
                }}>{u.lang==='tr'?'Girişi onayla':'Confirm entry'} →</button>
                <button onClick={() => toast({ type: 'info', icon: '✿', children: u.lang==='tr'?'Sophie\'yle yazışma açıldı':'Chat with Sophie opened' })} style={{
                  padding: '14px 20px', background: 'transparent', color: '#E8C97A',
                  border: '1px solid #C5A05966', borderRadius: 0,
                  fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 500,
                  fontSize: 15, cursor: 'pointer', letterSpacing: 1,
                }}>{u.lang==='tr'?'Sophie\'ye yaz':'Message Sophie'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
function Ornament() {
  return (
    <div style={{ padding: '14px 0', textAlign: 'center', color: '#C5A05988' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 16 }}>
        ────── ✦ ──────
      </span>
    </div>
  );
}
function LMiniWeb({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 10, letterSpacing: 2,
        color: '#C5A05999', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, color: '#E8C97A',
        fontWeight: 500, marginTop: 5, letterSpacing: 0.5 }}>{value}</div>
    </div>
  );
}
function LservWeb({ ic, label, sub }) {
  return (
    <div style={{ padding: '16px 18px', background: 'rgba(232,201,122,0.04)',
      border: '1px solid #C5A05922',
      display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ width: 36, height: 36, borderRadius: '50%',
        border: '1px solid #C5A05966',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#C5A059' }}>
        <Icon name={ic} size={16} />
      </span>
      <div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600, color: '#F4EBD9' }}>{label}</div>
        <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 12, color: '#C5A05999' }}>{sub}</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  WebFlightHistoryScreen, WebHelpSupportScreen, WebLoungeScreen,
});
