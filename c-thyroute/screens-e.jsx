// screens-e.jsx — B-group screens 19–21.
//
// 19 FlightHistory — Passport stamp scrapbook (textured paper, rotated stamps)
// 20 HelpSupport   — Notion-clean docs
// 21 Lounge        — Black & gold concierge

// =================================================================
// 19 ▸ FLIGHT HISTORY — Passport stamp scrapbook
// =================================================================
// Destination passport stamp info — each city's destination country.
// THY flies to 340+ destinations in 130+ countries internationally + 52 domestic cities.
const DEST_INFO = {
  AMS: { code3: 'NLD', name: 'NETHERLANDS',    glyph: '⚘', color: '#21468B', flag: '🇳🇱' },
  LHR: { code3: 'GBR', name: 'UNITED KINGDOM', glyph: '♛', color: '#C8102E', flag: '🇬🇧' },
  DXB: { code3: 'ARE', name: 'EMIRATES',       glyph: '☪', color: '#00732F', flag: '🇦🇪' },
  JFK: { code3: 'USA', name: 'UNITED STATES',  glyph: '★', color: '#3C3B6E', flag: '🇺🇸' },
  NRT: { code3: 'JPN', name: 'JAPAN',          glyph: '⛩', color: '#BC002D', flag: '🇯🇵' },
  IST: { code3: 'TR',  name: 'TÜRKİYE',        color: '#E30A17', flag: '🇹🇷', domestic: true, cityCode: 'IST' },
  AYT: { code3: 'TR',  name: 'TÜRKİYE',        color: '#E30A17', flag: '🇹🇷', domestic: true, cityCode: 'AYT' },
  ADB: { code3: 'TR',  name: 'TÜRKİYE',        color: '#E30A17', flag: '🇹🇷', domestic: true, cityCode: 'ADB' },
};
function destOf(route) { return route.split('→')[1]?.trim() || ''; }

function FlightHistoryScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;

  const flights = [
    { d: '12·05·26', route: 'IST → AMS', code: 'TK 1953', km: 2.205, rot: -4, n: '042' },
    { d: '01·05·26', route: 'AYT → IST', code: 'TK 2317', km:   485, rot:  3, n: '041' },
    { d: '14·03·26', route: 'IST → LHR', code: 'TK 1979', code2: 'JOINED ★ELITE',
      km: 2.519, rot: -2, n: '040', special: true },
    { d: '22·02·26', route: 'IST → DXB', code: 'TK 0762', km: 3.020, rot: 5, n: '039' },
    { d: '08·01·26', route: 'IST → JFK', code: 'TK 0001', km: 8.040, rot: -3, n: '038' },
    { d: '24·11·25', route: 'IST → NRT', code: 'TK 0050', km: 8.880, rot: 2, n: '037' },
  ];

  return (
    <div className="screen-enter" style={{
      minHeight: '100%',
      background: '#EFE6CE',
      backgroundImage: `
        radial-gradient(ellipse 600px 200px at 50% 0%, rgba(0,0,0,0.06), transparent),
        repeating-linear-gradient(45deg, rgba(0,0,0,0.018) 0 2px, transparent 2px 5px)
      `,
      fontFamily: "'EB Garamond', Georgia, serif", color: '#1F1A14',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: `${topPad}px 18px 6px` }}>
        <button onClick={() => nav('profile')} style={{
          background: 'transparent', border: '1px solid #1F1A14',
          padding: '6px 10px', fontFamily: 'inherit', fontSize: 12, cursor: 'pointer',
          color: '#1F1A14',
        }}>← {u.lang==='tr'?'Profil':'Profile'}</button>
      </div>

      {/* passport cover-page header */}
      <div style={{ padding: '10px 22px 8px' }}>
        <div style={{
          fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
          fontSize: 11, letterSpacing: 4, color: '#B7312C',
        }}>★ PASAPORT — TRAVEL JOURNAL ★</div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 900, fontStyle: 'italic',
          fontSize: 40, letterSpacing: -1, lineHeight: 1, margin: '4px 0 0',
        }}>
          {u.lang==='tr'?'Geçmiş':'Past'} <br/>
          <span style={{ fontWeight: 500, fontSize: 30 }}>{u.lang==='tr'?'uçuşlar':'flights'}</span>
        </h1>
        <div style={{
          marginTop: 8, fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#525252', letterSpacing: 1,
        }}>
          42 {u.lang==='tr'?'uçuş':'flights'} · 18 {u.lang==='tr'?'ülke':'countries'} · 87 420 mil
        </div>
        <div style={{
          marginTop: 4, fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 10.5, color: '#525252AA',
        }}>
          {u.lang==='tr'
            ? '— THY\'nin 130+ ülke, 340+ varma noktası ağından'
            : '— from THY\'s network of 340+ destinations in 130+ countries'}
        </div>
      </div>

      {/* year strip */}
      <div style={{ padding: '10px 22px 4px', display: 'flex', gap: 8, fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#525252' }}>
        {['2026','2025','2024','All'].map((y, i) => (
          <span key={y} style={{
            padding: '4px 10px', border: '1px solid #1F1A14',
            background: i === 0 ? '#1F1A14' : 'transparent',
            color: i === 0 ? '#EFE6CE' : '#1F1A14', letterSpacing: 1,
          }}>{y}</span>
        ))}
      </div>

      {/* stamps */}
      <div style={{ padding: '10px 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {flights.map((f) => <StampCard key={f.n} f={f} lang={u.lang}/>)}
      </div>

      <div style={{
        margin: '4px 22px 22px', textAlign: 'center',
        fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 12, color: '#525252',
      }}>
        — {u.lang==='tr'?'sayfa sonu':'end of page'} 1 / 4 —
      </div>
    </div>
  );
}
function StampCard({ f, lang }) {
  return (
    <div style={{
      position: 'relative',
      background: '#F5ECD3', padding: '14px 14px 12px',
      border: '1px dashed #1F1A1466', borderRadius: 2,
      boxShadow: '4px 4px 0 rgba(31,26,20,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* round stamp */}
        <CountryStamp info={DEST_INFO[destOf(f.route)] || { color: '#525252', code3: destOf(f.route) }}
          date={f.d} rot={f.rot} size={84} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#525252', letterSpacing: 1 }}>
            JOURNAL N° {f.n}
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, marginTop: 2, lineHeight: 1 }}>
            {f.route}
          </div>
          <div style={{ marginTop: 6, fontSize: 12, fontStyle: 'italic', color: '#525252' }}>
            {f.code} · {f.km.toLocaleString('tr-TR')} km · {(f.km * 1).toLocaleString('tr-TR')} mil
          </div>
          {f.special && (
            <div style={{
              marginTop: 8, display: 'inline-block', padding: '3px 10px',
              background: 'linear-gradient(135deg, #C5A059, #E8C97A)',
              color: '#1F1A14', fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 12, letterSpacing: 2,
              transform: 'rotate(-2deg)',
            }}>{f.code2}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Round, ink-stamp visual for destination country (international) or city
// (domestic). "ENTRY" arc top, glyph or city code center, country/city name + date below.
function CountryStamp({ info, date, rot, size }) {
  const dom = info.domestic;
  const color = info.color || '#525252';
  return (
    <div style={{
      position: 'relative', width: size, height: size, flexShrink: 0,
      transform: `rotate(${rot}deg)`,
    }}>
      <div style={{
        position: 'relative', width: size, height: size,
        border: `2.5px solid ${color}`, borderRadius: '50%',
        background: `${color}06`,
        color: color, opacity: 0.94,
        fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', lineHeight: 1,
      }}>
        <span style={{
          position: 'absolute', inset: 5,
          border: `1px solid ${color}66`, borderRadius: '50%', pointerEvents: 'none',
        }} />
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: 1.5,
          color: `${color}CC`, marginTop: 6,
        }}>{dom ? 'DOMESTIC' : 'ENTRY'}</span>
        {dom
          ? (
            <span style={{
              fontFamily: "'DM Mono', monospace", fontWeight: 700,
              fontSize: 22, letterSpacing: 2, color, marginTop: 2,
            }}>{info.cityCode}</span>
          ) : (
            <span style={{ fontSize: 24, lineHeight: 1, marginTop: 1, marginBottom: 1, color }}>{info.glyph}</span>
          )
        }
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: dom ? 10 : 9,
          letterSpacing: dom ? 2 : 1.2, color, marginTop: 1,
          padding: '0 6px', maxWidth: '100%',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{dom ? 'TÜRKİYE' : info.code3}</span>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 8,
          color: `${color}DD`, marginTop: 1,
        }}>{date}</span>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 7,
          letterSpacing: 2.5, color: `${color}AA`, marginTop: 1, marginBottom: 4,
        }}>★ THY ★</span>
      </div>
      <span style={{
        position: 'absolute', right: -4, bottom: -4,
        fontSize: 16, lineHeight: 1,
        background: '#F5ECD3', padding: 2, borderRadius: 4,
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        transform: `rotate(${-rot}deg)`,
      }}>{info.flag}</span>
    </div>
  );
}

// =================================================================
// 20 ▸ HELP & SUPPORT — Notion-clean docs
// =================================================================
function HelpSupportScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const toast = useToast();
  const [open, setOpen] = React.useState('change');

  const faqs = [
    { id: 'change',  q: u.lang==='tr'?'Biletimi nasıl değiştiririm?':'How do I change my ticket?',
      a: u.lang==='tr'
        ? 'Cüzdan > biletinizi açın > "Değiştir". Tarife farkı ve ücretsiz iade penceresi otomatik hesaplanır. Elite+ üyeler ilk değişikliği ücretsiz yapar.'
        : 'Wallet > open ticket > "Change". Fare difference and free-cancel window are auto-calculated. Elite+ members get the first change for free.' },
    { id: 'refund',  q: u.lang==='tr'?'İade kaç gün sürer?':'How long do refunds take?',
      a: u.lang==='tr'?'Kredi kartı: 5-7 iş günü. Banka havalesi: 3 iş günü. Miles iadesi anında.':'Credit card: 5-7 business days. Bank transfer: 3 business days. Miles refund is instant.' },
    { id: 'bag',     q: u.lang==='tr'?'Bagajım kaybolursa?':'What if my baggage is lost?',
      a: u.lang==='tr'?'Bildirim > "Bagaj sorun bildir" ya da varış havalimanı kaybolan eşya bankosu. Etiket numaranızla 24/7 takip edebilirsiniz.':'Notifications > "Report baggage issue" or visit the lost-and-found desk at arrival. Track with your tag number 24/7.' },
    { id: 'meals',   q: u.lang==='tr'?'Özel yemek talep edebilir miyim?':'Can I request a special meal?',
      a: u.lang==='tr'?'Evet. Uçuştan en az 24 saat önce bilet detayından seçebilirsiniz: vejetaryen, vegan, helal, glütensiz, çocuk menüsü.':'Yes. Request from ticket details at least 24h before departure: vegetarian, vegan, halal, gluten-free, child.' },
    { id: 'wifi',    q: u.lang==='tr'?'Uçakta WiFi var mı?':'Is WiFi available onboard?',
      a: u.lang==='tr'?'Geniş gövdeli uçuşlarda ücretsiz mesajlaşma, ücretli premium WiFi. Elite Plus üyeler için tüm uçuşlar ücretsiz.':'Free messaging on wide-body flights, paid premium WiFi. Free for Elite Plus on all flights.' },
  ];

  return (
    <div className="screen-enter" style={{
      minHeight: '100%', background: '#fff',
      fontFamily: "'Inter', system-ui, sans-serif", color: '#37352F',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: `${topPad}px 22px 0` }}>
        <button onClick={() => nav('profile')} style={{
          background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
          color: '#37352F99', fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
        }}>← {u.lang==='tr'?'Profil':'Profile'}</button>
      </div>

      <div style={{ padding: '18px 22px 6px' }}>
        <div style={{ fontSize: 50, lineHeight: 1, marginBottom: 8 }}>📔</div>
        <h1 style={{
          fontFamily: 'inherit', fontWeight: 700, fontSize: 32, letterSpacing: -0.8,
          margin: 0, color: '#37352F',
        }}>{u.lang==='tr'?'Yardım merkezi':'Help center'}</h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: '#37352F99', lineHeight: 1.5 }}>
          {u.lang==='tr'?'Aradığınızı 30 saniyede bulun. Bulamazsanız 7/24 yanınızdayız.':'Find what you need in 30 seconds. If not, we are here 24/7.'}
        </p>
      </div>

      {/* search */}
      <div style={{ padding: '14px 22px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 12px', background: '#F7F6F3',
          borderRadius: 6, border: '1px solid #E9E9E7',
        }}>
          <Icon name="search" size={15} color="#9B9A97" />
          <input placeholder={u.lang==='tr'?'Soru yazın veya konu arayın…':'Ask a question or search a topic…'}
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontFamily: 'inherit', fontSize: 14, color: '#37352F',
            }} />
          <span style={{
            padding: '2px 6px', background: '#E9E9E7', color: '#787774',
            borderRadius: 3, fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
          }}>⌘ K</span>
        </div>
      </div>

      {/* quick cards */}
      <div style={{ padding: '16px 22px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <NotionCard emoji="✈️" title={u.lang==='tr'?'Bilet':'Tickets'} count="12" />
        <NotionCard emoji="🧳" title={u.lang==='tr'?'Bagaj':'Baggage'} count="8" />
        <NotionCard emoji="✦"   title="Miles" count="14" />
        <NotionCard emoji="🛂"  title={u.lang==='tr'?'Vize & belge':'Visa & docs'} count="6" />
      </div>

      <div style={{ padding: '8px 22px 4px', fontSize: 12, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {u.lang==='tr'?'Sıkça sorulanlar':'Frequently asked'}
      </div>
      <div style={{ padding: '0 22px 18px' }}>
        {faqs.map(f => (
          <div key={f.id} style={{ borderTop: '1px solid #E9E9E7' }}>
            <button onClick={() => setOpen(open === f.id ? null : f.id)} style={{
              width: '100%', textAlign: 'left', padding: '12px 0',
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'inherit', color: '#37352F', fontSize: 14, fontWeight: 500,
            }}>
              <span style={{
                width: 18, color: '#9B9A97',
                transform: open === f.id ? 'rotate(90deg)' : 'none',
                transition: 'transform .2s',
              }}>›</span>
              <span style={{ flex: 1 }}>{f.q}</span>
            </button>
            {open === f.id && (
              <div className="screen-enter" style={{
                padding: '0 0 14px 26px', fontSize: 13.5, lineHeight: 1.6, color: '#37352FCC',
              }}>
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* contact strip */}
      <div style={{
        margin: '8px 22px 22px', padding: '16px 16px',
        background: '#F7F6F3', borderRadius: 6, border: '1px solid #E9E9E7',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#37352F', marginBottom: 4 }}>
          {u.lang==='tr'?'Hâlâ yardım gerekli mi?':'Still need help?'}
        </div>
        <div style={{ fontSize: 12.5, color: '#37352F99', lineHeight: 1.5 }}>
          {u.lang==='tr'?'Bizimle 7/24 iletişime geçebilirsiniz.':'Reach us anytime, 7 days a week.'}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={() => toast({ type: 'info', icon: '✆', children: u.lang==='tr'?'Sohbet açılıyor…':'Opening chat…' })}
            style={notionBtn(true)}>
            <Icon name="headset" size={14} /> {u.lang==='tr'?'Canlı destek':'Live chat'}
          </button>
          <button onClick={() => toast({ type: 'info', icon: '☎', children: '+90 850 250 0 849' })}
            style={notionBtn(false)}>
            <Icon name="bell" size={14} /> {u.lang==='tr'?'Bizi arayın':'Call us'}
          </button>
        </div>
      </div>
    </div>
  );
}
function NotionCard({ emoji, title, count }) {
  return (
    <button style={{
      background: '#F7F6F3', border: '1px solid #E9E9E7', borderRadius: 6,
      padding: '12px 12px', display: 'flex', alignItems: 'center', gap: 10,
      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
    }}>
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#37352F' }}>{title}</div>
        <div style={{ fontSize: 11, color: '#9B9A97', marginTop: 1 }}>{count} {/* en kısa */}</div>
      </div>
    </button>
  );
}
function notionBtn(primary) {
  return {
    flex: 1, padding: '9px 12px',
    background: primary ? '#37352F' : '#fff',
    color: primary ? '#fff' : '#37352F',
    border: '1px solid ' + (primary ? '#37352F' : '#E9E9E7'),
    borderRadius: 6, cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  };
}

// =================================================================
// 21 ▸ LOUNGE — Black & gold luxury concierge
// =================================================================
function LoungeScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: true });
  const topPad = k === 'ios' ? 50 : 14;
  const toast = useToast();

  return (
    <div className="screen-enter" style={{
      position: 'relative', minHeight: '100%', overflow: 'hidden',
      background: 'radial-gradient(circle at 50% 0%, #1A1410 0%, #050302 60%, #000 100%)',
      color: '#E8C97A',
      fontFamily: "'Playfair Display', Georgia, serif",
      display: 'flex', flexDirection: 'column',
    }}>
      {/* subtle gold pattern */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: `
          repeating-conic-gradient(from 30deg at 50% 50%, rgba(232,201,122,0.03) 0deg 10deg, transparent 10deg 30deg)
        `,
        opacity: 0.5, pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 1, padding: `${topPad}px 22px 4px`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button onClick={() => nav('boarding')} style={{
          background: 'transparent', border: '1px solid #C5A05955',
          borderRadius: 0, padding: '7px 12px', color: '#E8C97A',
          fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 12, cursor: 'pointer',
        }}>← {u.lang==='tr'?'bilet':'pass'}</button>
        <span style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 11, letterSpacing: 3, color: '#C5A059AA' }}>
          ✦ TWENTY—ONE ✦
        </span>
        <span style={{ width: 60 }} />
      </div>

      {/* ornamental rule */}
      <Ornament />

      {/* title */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '6px 24px 0' }}>
        <div style={{
          fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 13, letterSpacing: 6,
          color: '#C5A059', textTransform: 'uppercase',
        }}>maison thy</div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 700, fontStyle: 'italic',
          fontSize: 46, letterSpacing: -1, lineHeight: 0.95, margin: '8px 0 0',
          color: '#F4EBD9',
        }}>
          The Cıp <br/>
          <span style={{ fontWeight: 500 }}>Lounge.</span>
        </h1>
        <div style={{ marginTop: 10, fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 13, color: '#C5A059CC' }}>
          IST · Terminal A · Gate A12
        </div>
      </div>

      <Ornament />

      {/* live status */}
      <div style={{ position: 'relative', zIndex: 1, padding: '4px 22px' }}>
        <div style={{
          padding: '14px 16px',
          background: 'rgba(232,201,122,0.06)',
          border: '1px solid #C5A05933',
          borderRadius: 0,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
        }}>
          <LMini label={u.lang==='tr'?'BUGÜN':'TODAY'}    value="OPEN · 22:00" />
          <LMini label={u.lang==='tr'?'YOĞUNLUK':'BUSY'}  value="42 %" />
          <LMini label={u.lang==='tr'?'YÜRÜYÜŞ':'WALK'}   value="6 min" />
        </div>
      </div>

      {/* services */}
      <div style={{ position: 'relative', zIndex: 1, padding: '14px 22px 0' }}>
        <div style={{
          fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 11, letterSpacing: 3,
          color: '#C5A059', marginBottom: 8, textAlign: 'center',
        }}>— LES SERVICES —</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Lserv  ic="coffee" label={u.lang==='tr'?'Şef menüsü':'Chef menu'}        sub={u.lang==='tr'?'24 saat':'24h'} />
          <Lserv  ic="bed"    label={u.lang==='tr'?'Sessiz oda':'Nap suite'}        sub={u.lang==='tr'?'+ 90 dk':'+ 90 min'} />
          <Lserv  ic="shield" label="Spa & duş"                                      sub={u.lang==='tr'?'ücretsiz':'complimentary'} />
          <Lserv  ic="wifi"   label="Premium WiFi"                                   sub="1 Gbps" />
        </div>
      </div>

      {/* concierge cta */}
      <div style={{ position: 'relative', zIndex: 1, padding: '18px 22px 16px' }}>
        <div style={{
          padding: '14px 16px', background: '#0A0604',
          border: '1px solid #C5A05955', borderRadius: 0,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, #E8C97A, #C5A059, #8B6F3E)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#000', fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
            fontWeight: 700, fontSize: 22, flexShrink: 0,
            boxShadow: '0 0 24px rgba(197,160,89,0.4)',
          }}>S</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 14, color: '#F4EBD9' }}>
              Sophie · concierge
            </div>
            <div style={{
              fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
              fontSize: 12, color: '#C5A059CC', lineHeight: 1.4,
            }}>
              {u.lang==='tr'
                ? '«Bonjour Aylin, masanız 19:30 için ayrıldı.»'
                : '«Bonjour Aylin, your table is held for 19:30.»'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={() => toast({ type: 'success', icon: '✓', children: u.lang==='tr'?'Lounge erişimi onaylandı':'Lounge access confirmed' })}
            style={loungeBtn(true)}>
            {u.lang==='tr'?'Girişi onayla':'Confirm entry'} →
          </button>
          <button onClick={() => toast({ type: 'info', icon: '✿', children: u.lang==='tr'?'Sophie\'yle yazışma açıldı':'Chat with Sophie opened' })}
            style={loungeBtn(false)}>
            {u.lang==='tr'?'Mesaj':'Message'}
          </button>
        </div>

        <div style={{
          textAlign: 'center', marginTop: 18,
          fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
          fontSize: 11, color: '#C5A05966', letterSpacing: 2,
        }}>★ ELITE PLUS · COMPLIMENTARY ACCESS ★</div>
      </div>
    </div>
  );
}
function Ornament() {
  return (
    <div style={{ position: 'relative', zIndex: 1, padding: '14px 22px 4px', textAlign: 'center', color: '#C5A05988' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
        ── ✦ ──
      </span>
    </div>
  );
}
function LMini({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: "'EB Garamond', serif", fontStyle: 'italic',
        fontSize: 9, letterSpacing: 2, color: '#C5A05999', textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#E8C97A',
        fontWeight: 500, marginTop: 4, letterSpacing: 0.5,
      }}>{value}</div>
    </div>
  );
}
function Lserv({ ic, label, sub }) {
  return (
    <div style={{
      padding: '12px 14px',
      background: 'rgba(232,201,122,0.04)',
      border: '1px solid #C5A05922', borderRadius: 0,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{
        width: 30, height: 30, borderRadius: '50%',
        border: '1px solid #C5A05966',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#C5A059',
      }}><Icon name={ic} size={14} /></span>
      <div>
        <div style={{
          fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 600, color: '#F4EBD9',
        }}>{label}</div>
        <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 11, color: '#C5A05999' }}>{sub}</div>
      </div>
    </div>
  );
}
function loungeBtn(primary) {
  return {
    flex: 1, padding: '13px 16px', borderRadius: 0,
    background: primary ? 'linear-gradient(135deg, #C5A059, #E8C97A)' : 'transparent',
    color: primary ? '#0A0604' : '#E8C97A',
    border: '1px solid ' + (primary ? '#E8C97A' : '#C5A05966'),
    fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: primary ? 700 : 500,
    fontSize: 13, cursor: 'pointer', letterSpacing: 1,
  };
}

Object.assign(window, {
  FlightHistoryScreen, HelpSupportScreen, LoungeScreen,
});
