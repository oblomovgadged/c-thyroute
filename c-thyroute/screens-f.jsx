// screens-f.jsx — Screen 24: QR Tara (QR Scanner)
//
// Full-bleed black "camera viewfinder" with corner brackets, animated scan
// line, and a slide-up result sheet that fakes detection after ~2.2s. The
// payload rotates through realistic THY Route scan targets (boarding gate,
// baggage tag, partner offer, lounge entry) so the demo feels alive.

function QRScannerScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: true });
  const topPad = k === 'ios' ? 52 : 14;
  const [stage, setStage] = React.useState('scan'); // 'scan' | 'found'
  const [flash, setFlash] = React.useState(false);
  const [payload, setPayload] = React.useState(null);
  const [showHint, setShowHint] = React.useState(true);

  // Catalog of believable scan payloads
  const PAYLOADS = React.useMemo(() => ([
    {
      kind: 'gate',
      icon: 'plane', tint: u.accent.fg,
      title: { tr: 'Biniş Kapısı · A12', en: 'Boarding Gate · A12' },
      code: 'TK1853-A12-EBHHN3',
      lines: [
        { l: u.lang === 'tr' ? 'Uçuş' : 'Flight',     v: 'TK 1853 · IST → FCO' },
        { l: u.lang === 'tr' ? 'Koltuk' : 'Seat',      v: '14F · Economy' },
        { l: u.lang === 'tr' ? 'Biniş'  : 'Boarding',  v: '13:55' },
      ],
      cta:  { tr: 'Check-in başlat', en: 'Begin check-in' },
      goto: 'checkin',
    },
    {
      kind: 'partner',
      icon: 'star', tint: '#C5A059',
      title: { tr: 'Miles&Smiles · Hilton', en: 'Miles&Smiles · Hilton' },
      code: 'MS-HILTON-EU-500',
      lines: [
        { l: u.lang === 'tr' ? 'Kazanım' : 'Reward', v: '+ 500 mil' },
        { l: u.lang === 'tr' ? 'Geçerli' : 'Valid',  v: '12 Eyl 2026' },
        { l: u.lang === 'tr' ? 'Konum'   : 'Where',  v: 'Roma · Cavalieri' },
      ],
      cta:  { tr: 'Mili hesaba ekle', en: 'Credit miles' },
      goto: 'ms',
    },
    {
      kind: 'bag',
      icon: 'shield', tint: '#0E7A5F',
      title: { tr: 'Bagaj Etiketi · 20kg', en: 'Baggage Tag · 20kg' },
      code: 'BAG-0042-TK1853',
      lines: [
        { l: 'TAG',                                  v: 'TK 0042-9871' },
        { l: u.lang === 'tr' ? 'Durum'  : 'Status',  v: u.lang === 'tr' ? 'Bantta · 17:04' : 'On belt · 17:04' },
        { l: u.lang === 'tr' ? 'Bant'   : 'Belt',    v: u.lang === 'tr' ? '7 numara' : 'Belt 7' },
      ],
      cta:  { tr: 'Bagajı takip et', en: 'Track bag' },
      goto: 'notifications',
    },
    {
      kind: 'lounge',
      icon: 'coffee', tint: '#C5A059',
      title: { tr: 'CIP Lounge · Giriş', en: 'Lounge · Entry' },
      code: 'LNG-IST-A-CIP-2207',
      lines: [
        { l: u.lang === 'tr' ? 'Üyelik' : 'Status', v: 'Elite Plus' },
        { l: u.lang === 'tr' ? 'Misafir' : 'Guests', v: '+1' },
        { l: u.lang === 'tr' ? 'Kalan'  : 'Hold',  v: u.lang === 'tr' ? '4 saat' : '4 hours' },
      ],
      cta:  { tr: 'Girişi onayla', en: 'Confirm entry' },
      goto: 'lounge',
    },
  ]), [u.lang, u.accent.fg]);

  // Auto-detect after ~2.2s in the scan stage
  React.useEffect(() => {
    if (stage !== 'scan') return;
    const tId = setTimeout(() => {
      const p = PAYLOADS[Math.floor(Math.random() * PAYLOADS.length)];
      setPayload(p);
      setStage('found');
      // tiny haptic-style flash
      setShowHint(false);
    }, 2200);
    return () => clearTimeout(tId);
  }, [stage, PAYLOADS]);

  const rescan = () => { setPayload(null); setStage('scan'); setShowHint(true); };

  return (
    <div className="screen-enter" style={{
      position: 'relative', minHeight: '100%', overflow: 'hidden',
      background: '#000', color: '#fff', fontFamily: u.font,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Faux "camera feed" — very dark gradient + subtle film grain */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 70% 60% at 50% 45%, rgba(40,55,80,0.45) 0%, rgba(10,15,25,0.95) 60%, #000 100%)
        `,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 2.5px)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 25%, rgba(120,140,180,0.06) 0 220px, transparent 240px)',
        }} />
      </div>

      {/* Flash flare */}
      {flash && (
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.16) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Top app bar */}
      <div style={{
        position: 'relative', zIndex: 3,
        padding: `${topPad}px 16px 12px`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button onClick={() => nav('board')} style={iconChip}>✕</button>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3,
          color: '#C5A059', fontWeight: 800,
        }}>QR · {u.lang === 'tr' ? 'TARA' : 'SCAN'}</div>
        <button onClick={() => setFlash(!flash)} aria-pressed={flash} style={{
          ...iconChip,
          background: flash ? 'rgba(255,209,102,0.18)' : 'rgba(255,255,255,0.06)',
          color: flash ? '#FFD166' : '#fff',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={flash ? '#FFD166' : 'none'}
            stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
          </svg>
        </button>
      </div>

      {/* Viewfinder cut-out via box-shadow trick */}
      <div style={{
        position: 'relative', zIndex: 2, flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          position: 'relative', width: 248, height: 248, borderRadius: 28,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.72)',
          transition: 'box-shadow .35s ease',
        }}>
          {/* corner brackets */}
          {['tl','tr','bl','br'].map(c => (
            <Bracket key={c} corner={c} color={stage === 'found' ? '#22C55E' : u.accent.fg} />
          ))}

          {/* animated scan line */}
          {stage === 'scan' && (
            <div aria-hidden style={{
              position: 'absolute', left: 12, right: 12, height: 2, top: 0,
              background: `linear-gradient(90deg, transparent, ${u.accent.fg} 50%, transparent)`,
              boxShadow: `0 0 14px ${u.accent.glow}, 0 0 28px ${u.accent.glow}`,
              animation: 'qrScan 2s ease-in-out infinite alternate',
              borderRadius: 2,
            }} />
          )}

          {/* success pulse */}
          {stage === 'found' && (
            <div aria-hidden style={{
              position: 'absolute', inset: 0, borderRadius: 28,
              background: 'rgba(34,197,94,0.12)',
              boxShadow: '0 0 60px rgba(34,197,94,0.45) inset',
              animation: 'qrFoundPulse .6s ease-out',
            }} />
          )}

          {/* center crosshair */}
          {stage === 'scan' && (
            <div aria-hidden style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: 4, height: 4, borderRadius: '50%',
              background: u.accent.fg, opacity: 0.6,
            }} />
          )}
        </div>
      </div>

      {/* Status text below viewfinder */}
      <div style={{
        position: 'relative', zIndex: 3, padding: '0 24px 14px', textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18,
          color: stage === 'found' ? '#22C55E' : '#fff', letterSpacing: -0.2,
          transition: 'color .25s',
        }}>
          {stage === 'found'
            ? (u.lang === 'tr' ? 'QR algılandı' : 'QR detected')
            : (u.lang === 'tr' ? 'QR kodu çerçeveye getirin' : 'Frame the QR code')}
        </div>
        <div style={{
          marginTop: 4, fontSize: 12, color: '#B2C0D1', lineHeight: 1.4,
        }}>
          {stage === 'found'
            ? (u.lang === 'tr' ? 'Aşağıdaki kart detayları gösteriyor.' : 'Card below shows the details.')
            : (u.lang === 'tr' ? 'Otomatik tanıma açık · sabit tutun' : 'Auto-detect on · hold steady')}
        </div>
      </div>

      {/* Hint chips */}
      {showHint && (
        <div style={{
          position: 'relative', zIndex: 3, display: 'flex', gap: 6,
          justifyContent: 'center', flexWrap: 'wrap', padding: '0 16px 20px',
        }}>
          {[
            { e: '✈', l: u.lang === 'tr' ? 'Biniş kapısı' : 'Boarding gate' },
            { e: '🧳', l: u.lang === 'tr' ? 'Bagaj etiketi' : 'Baggage tag' },
            { e: '✦', l: u.lang === 'tr' ? 'Partner kuponu' : 'Partner offer' },
            { e: '☕', l: 'Lounge' },
          ].map(h => (
            <span key={h.l} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '6px 10px', borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: 10.5, fontWeight: 600, color: '#B2C0D1', letterSpacing: 0.2,
              backdropFilter: 'blur(8px)',
            }}>
              <span>{h.e}</span>{h.l}
            </span>
          ))}
        </div>
      )}

      {/* Bottom result sheet — slides up when found */}
      {stage === 'found' && payload && (
        <div style={{
          position: 'absolute', left: 12, right: 12, bottom: 18,
          padding: '16px 16px 14px', zIndex: 4,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
          border: '1px solid rgba(197,160,89,0.32)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 18, color: '#fff',
          boxShadow: '0 18px 50px rgba(0,0,0,0.6), 0 0 24px rgba(34,197,94,0.18)',
          animation: 'qrSheet .45s cubic-bezier(.16,1,.3,1)',
        }}>
          {/* drag handle */}
          <div style={{
            width: 34, height: 3, background: 'rgba(255,255,255,0.25)',
            borderRadius: 2, margin: '0 auto 12px',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: `${payload.tint}22`, color: payload.tint,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 16px ${payload.tint}44`,
            }}>
              <Icon name={payload.icon} size={20} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 9, fontWeight: 800, letterSpacing: 2,
                color: '#22C55E', textTransform: 'uppercase',
              }}>✓ {u.lang === 'tr' ? 'Algılandı' : 'Detected'}</div>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15,
                color: '#fff', letterSpacing: -0.1, marginTop: 1,
              }}>{payload.title[u.lang]}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7A8EAF',
                letterSpacing: 1, marginTop: 1,
              }}>{payload.code}</div>
            </div>
          </div>

          {/* details grid */}
          <div style={{
            marginTop: 12, paddingTop: 10, borderTop: '1px dashed rgba(255,255,255,0.12)',
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
          }}>
            {payload.lines.map(line => (
              <MiniStat key={line.l} label={line.l} value={line.v} dark />
            ))}
          </div>

          {/* actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={rescan} style={{
              flex: 1, padding: '12px 12px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12,
              fontFamily: u.font, fontWeight: 700, fontSize: 12,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              {u.lang === 'tr' ? 'Tekrar tara' : 'Re-scan'}
            </button>
            <button onClick={() => nav(payload.goto)} style={{
              flex: 1.4, padding: '12px 14px', cursor: 'pointer',
              background: `linear-gradient(135deg, ${payload.tint}, ${payload.tint}CC)`,
              color: payload.tint === '#C5A059' ? '#0A1628' : '#fff',
              border: 'none', borderRadius: 12,
              fontFamily: u.font, fontWeight: 800, fontSize: 12,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: `0 6px 18px ${payload.tint}66`, letterSpacing: 0.3,
            }}>
              {payload.cta[u.lang]} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Bracket({ corner, color }) {
  const base = {
    position: 'absolute', width: 26, height: 26,
    borderColor: color, borderStyle: 'solid', borderWidth: 0,
    transition: 'border-color .25s ease',
    filter: `drop-shadow(0 0 6px ${color}88)`,
  };
  const pos = {
    tl: { top: -2, left: -2, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 12 },
    tr: { top: -2, right: -2, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 12 },
    bl: { bottom: -2, left: -2, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 12 },
    br: { bottom: -2, right: -2, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 12 },
  }[corner];
  return <div style={{ ...base, ...pos }} />;
}

const iconChip = {
  width: 40, height: 40, borderRadius: 12, cursor: 'pointer',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
};

// ═══════════════════════════════════════════════════════════
// 24) TKPAY — dijital cüzdan ekranı
// ───────────────────────────────────────────────────────────
// "Ödemenin iyi yolu" — Türk Hava Yolları'nın TKPAY (tkpay.com) dijital
// cüzdan ürününü THY Route içine gömüyoruz. Premium fintech / cockpit
// aurası: navy + altın, sanal kart hero, mil → TL dönüştürücü, hızlı
// aksiyonlar, son işlemler. M&S ekranıyla aynı dünyada ama "wallet"
// sekmesinin kendi sayfası.
// ═══════════════════════════════════════════════════════════
function TKPayScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: true });
  const topPad = k === 'ios' ? 50 : 14;
  const toast = useToast();
  const [segment, setSegment] = React.useState('individual'); // 'individual' | 'business'
  const [convertOpen, setConvertOpen] = React.useState(false);

  // Animated tagline — tkpay.com'daki "İYİ / KOLAY / AVANTAJLI YOLU" rotasyonu
  const taglines = u.lang === 'tr'
    ? ['İYİ YOLU', 'KOLAY YOLU', 'AVANTAJLI YOLU']
    : ['SMART WAY', 'EASY WAY', 'REWARDING WAY'];
  const [tagIx, setTagIx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTagIx(i => (i + 1) % taglines.length), 2400);
    return () => clearInterval(id);
  }, [taglines.length]);

  // Mil → TL — gerçekçi katsayı: 1 mil ≈ 0,15 TL
  const totalMiles = 12580;
  const convertedTL = Math.round(totalMiles * 0.15);
  const fmtTL = (n) => n.toLocaleString('tr-TR');

  return (
    <div className="thy-screen is-dark screen-enter" style={{
      minHeight: '100%', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(180deg, #050B14 0%, #0A1628 38%, #0F2244 100%)',
      fontFamily: u.font, display: 'flex', flexDirection: 'column',
    }}>
      <RouteMapBg opacity={0.05} />

      {/* Top app bar */}
      <div style={{
        position: 'relative', padding: `${topPad}px 18px 10px`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button onClick={() => nav('ms')} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10, padding: '8px 10px', color: '#fff', cursor: 'pointer',
        }}><Icon name="arrowL" size={14} /></button>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
          <span style={{
            fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 16,
            color: '#fff', letterSpacing: 2.4,
          }}>TKPAY</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2,
            color: '#C5A059', fontWeight: 800,
          }}>· {u.lang === 'tr' ? 'CÜZDAN' : 'WALLET'}</span>
        </div>
        <button onClick={() => nav('qrScanner')} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10, padding: '8px 10px', color: '#fff', cursor: 'pointer',
        }}><Icon name="qr" size={14} /></button>
      </div>

      {/* Hero tagline (rotating) — tkpay.com style */}
      <div style={{ position: 'relative', padding: '4px 18px 12px' }}>
        <div style={{
          fontSize: 9, fontWeight: 800, letterSpacing: 2.5,
          color: '#7A8EAF', textTransform: 'uppercase',
        }}>
          {u.lang === 'tr' ? 'ÖDEMENİN' : 'PAYMENT,'}
        </div>
        <div key={tagIx} style={{
          fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 28,
          letterSpacing: -0.6, lineHeight: 1.05, marginTop: 2,
          background: 'linear-gradient(95deg, #E8C97A 0%, #C5A059 55%, #A0813C 100%)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          animation: 'thy-fadeUp .55s cubic-bezier(.16,1,.3,1)',
        }}>
          {taglines[tagIx]}
        </div>
      </div>

      {/* Bireysel / Ticari segmented control */}
      <div style={{ padding: '0 18px 12px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: 4,
          background: 'rgba(255,255,255,0.045)',
          border: '1px solid rgba(255,255,255,0.085)',
          borderRadius: 12,
        }}>
          {[
            { id: 'individual', tr: 'Bireysel', en: 'Individual' },
            { id: 'business',   tr: 'Ticari',   en: 'Business' },
          ].map(seg => {
            const on = segment === seg.id;
            return (
              <button key={seg.id} onClick={() => setSegment(seg.id)} style={{
                padding: '9px 10px', cursor: 'pointer',
                background: on ? 'linear-gradient(135deg, #C5A059, #A0813C)' : 'transparent',
                border: 'none', borderRadius: 9,
                color: on ? '#0A1628' : '#B2C0D1',
                fontFamily: u.font, fontWeight: on ? 800 : 600, fontSize: 11,
                letterSpacing: 0.3,
                boxShadow: on ? '0 4px 14px rgba(197,160,89,0.35)' : 'none',
                transition: 'all 250ms cubic-bezier(.16,1,.3,1)',
              }}>{u.lang === 'tr' ? seg.tr : seg.en}</button>
            );
          })}
        </div>
      </div>

      {/* TKPAY virtual card */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          position: 'relative', overflow: 'hidden',
          padding: '20px 18px 18px', borderRadius: 18,
          color: '#fff',
          background: `
            radial-gradient(120% 80% at 0% 0%, rgba(197,160,89,0.32) 0%, transparent 55%),
            radial-gradient(110% 70% at 100% 100%, rgba(183,49,44,0.30) 0%, transparent 60%),
            linear-gradient(135deg, #0F2244 0%, #0A1628 45%, #050B14 100%)
          `,
          border: '1px solid rgba(197,160,89,0.35)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.55), 0 0 24px rgba(197,160,89,0.18), 0 1px 0 rgba(255,255,255,0.08) inset',
        }}>
          {/* contactless icon (top-right) */}
          <div aria-hidden style={{
            position: 'absolute', top: 18, right: 18, color: '#C5A059', opacity: 0.85,
            transform: 'rotate(90deg)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8a10 10 0 0 1 14 0" />
              <path d="M8 11a6 6 0 0 1 8 0" />
              <path d="M11 14a2 2 0 0 1 2 0" />
            </svg>
          </div>

          {/* shimmer band */}
          <div aria-hidden style={{
            position: 'absolute', top: 0, bottom: 0, left: '-30%', width: '35%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
            transform: 'skewX(-22deg)',
          }} />

          <div style={{ position: 'relative' }}>
            <div style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 2.5, color: '#C5A059',
              textTransform: 'uppercase',
            }}>TKPAY · {segment === 'business' ? (u.lang === 'tr' ? 'TİCARİ' : 'BUSINESS') : (u.lang === 'tr' ? 'BİREYSEL' : 'INDIVIDUAL')}</div>

            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: 1.8, color: '#7A8EAF',
              textTransform: 'uppercase', marginTop: 16,
            }}>{u.lang === 'tr' ? 'BAKİYE' : 'BALANCE'}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 800,
                letterSpacing: -0.8, lineHeight: 1, color: '#fff',
              }}>4.218,75</span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                color: '#C5A059', letterSpacing: 0.5,
              }}>TL</span>
            </div>

            {/* card number + name row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              marginTop: 18, gap: 10,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12, color: '#B2C0D1',
                  letterSpacing: 2, marginBottom: 4,
                }}>5188 ····  ····  4218</div>
                <div style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13,
                  color: '#fff', letterSpacing: 0.4, textTransform: 'uppercase',
                }}>Aylin Kaya</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: 8, fontWeight: 800, letterSpacing: 1.5, color: '#7A8EAF',
                }}>MILES&SMILES</div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 800,
                  color: '#C5A059', marginTop: 2, letterSpacing: 0.5,
                }}>TK · ELITE+</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions row */}
      <div style={{ padding: '14px 16px 4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { id: 'topup', icon: 'plus',     tr: 'Yükle',  en: 'Top up' },
            { id: 'send',  icon: 'arrowR',   tr: 'Gönder', en: 'Send' },
            { id: 'pay',   icon: 'cardIcon', tr: 'Öde',    en: 'Pay' },
            { id: 'scan',  icon: 'qr',       tr: 'Tara',   en: 'Scan' },
          ].map(a => (
            <button key={a.id} onClick={() => {
              if (a.id === 'scan') return nav('qrScanner');
              toast({
                type: 'success', icon: '✓',
                children: (u.lang === 'tr'
                  ? `${a.tr} hazırlanıyor`
                  : `${a.en} ready`),
              });
            }} style={{
              padding: '12px 6px', borderRadius: 12, cursor: 'pointer',
              background: 'rgba(255,255,255,0.045)',
              border: '1px solid rgba(255,255,255,0.085)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              color: '#fff', fontFamily: u.font,
              transition: 'all 200ms cubic-bezier(.16,1,.3,1)',
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'rgba(197,160,89,0.14)',
                border: '1px solid rgba(197,160,89,0.32)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: '#C5A059',
              }}>
                <Icon name={a.icon} size={16} />
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#B2C0D1' }}>
                {u.lang === 'tr' ? a.tr : a.en}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Miles → TL converter — TKPAY'in ana mesajı */}
      <div style={{ padding: '14px 16px 8px' }}>
        <div style={{
          position: 'relative', overflow: 'hidden',
          padding: '14px 14px 14px 16px', borderRadius: 14,
          background: `
            linear-gradient(135deg, rgba(197,160,89,0.18) 0%, rgba(197,160,89,0.05) 70%),
            rgba(255,255,255,0.045)
          `,
          border: '1px solid rgba(197,160,89,0.45)',
          boxShadow: '0 0 20px rgba(197,160,89,0.18)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #E8C97A, #C5A059)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#0A1628', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(197,160,89,0.4)',
          }}>
            <Icon name="sparkles" size={20} strokeWidth={2.5} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 2, color: '#C5A059',
            }}>{u.lang === 'tr' ? 'MIL → TL' : 'MILES → TL'}</div>
            <div style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14,
              color: '#fff', letterSpacing: -0.1, marginTop: 1,
            }}>{u.lang === 'tr' ? 'Millerini TL\'ye dönüştür' : 'Convert miles to TL'}</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: '#B2C0D1',
              marginTop: 2, letterSpacing: 0.3,
            }}>
              {fmtTL(totalMiles)} mil ≈ <span style={{ color: '#C5A059', fontWeight: 700 }}>{fmtTL(convertedTL)} TL</span>
            </div>
          </div>
          <button onClick={() => setConvertOpen(true)} style={{
            padding: '10px 12px', cursor: 'pointer',
            background: 'linear-gradient(135deg, #E8C97A, #C5A059)',
            color: '#0A1628', border: 'none', borderRadius: 10,
            fontFamily: u.font, fontWeight: 800, fontSize: 11, letterSpacing: 0.3,
            flexShrink: 0, boxShadow: '0 4px 14px rgba(197,160,89,0.4)',
          }}>{u.lang === 'tr' ? 'Dönüştür' : 'Convert'} →</button>
        </div>
      </div>

      {/* Avantajlı markalar (anlaşmalı) */}
      <div style={{ padding: '8px 16px 6px' }}>
        <SectionLabel dark accent={u.accent} style={{ color: '#C5A059', marginBottom: 8 }}>
          {u.lang === 'tr' ? 'ANLAŞMALI MARKALAR' : 'PARTNER BRANDS'}
        </SectionLabel>
        <div style={{
          display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2,
        }}>
          {[
            { n: 'Migros',     d: '%5', t: u.lang === 'tr' ? 'iade' : 'cashback' },
            { n: 'Shell',      d: '%8', t: u.lang === 'tr' ? 'akaryakıt' : 'fuel' },
            { n: 'D&R',        d: '%10',t: u.lang === 'tr' ? 'iade' : 'cashback' },
            { n: 'Vodafone',   d: '+250',t: 'mil' },
            { n: 'MediaMarkt', d: '%6', t: u.lang === 'tr' ? 'iade' : 'cashback' },
          ].map(b => (
            <div key={b.n} style={{
              flex: '0 0 auto', width: 88, padding: '10px 8px', borderRadius: 12,
              background: 'rgba(255,255,255,0.045)',
              border: '1px solid rgba(255,255,255,0.085)',
              textAlign: 'center',
            }}>
              <div style={{
                width: 28, height: 28, margin: '0 auto', borderRadius: 8,
                background: 'rgba(197,160,89,0.14)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: '#C5A059', fontSize: 13, fontWeight: 800, fontFamily: u.font,
              }}>{b.n[0]}</div>
              <div style={{
                fontSize: 10, fontWeight: 700, color: '#fff', marginTop: 6,
              }}>{b.n}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, color: '#C5A059',
                marginTop: 2, letterSpacing: 0.3, fontWeight: 700,
              }}>{b.d} {b.t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Son işlemler */}
      <div style={{ padding: '10px 16px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 6,
        }}>
          <SectionLabel dark accent={u.accent} style={{ color: '#C5A059' }}>
            {u.lang === 'tr' ? 'SON İŞLEMLER' : 'RECENT'}
          </SectionLabel>
          <span style={{ fontSize: 10, color: '#7A8EAF', fontFamily: 'var(--font-mono)' }}>
            {u.lang === 'tr' ? 'son 7 gün' : 'last 7d'}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { ic: 'plane',    tint: '#1E6FCB', t: u.lang === 'tr' ? 'TK 1853 · IST → FCO' : 'TK 1853 · IST → FCO', s: u.lang === 'tr' ? 'Uçuş ödemesi · 14:25'  : 'Flight payment · 14:25', v: -2480, d: u.lang === 'tr' ? 'Bugün'    : 'Today' },
            { ic: 'coffee',   tint: '#C5A059', t: 'Starbucks · IST',                                                                      s: u.lang === 'tr' ? 'Anlaşmalı · +35 mil' : 'Partner · +35 mi',     v: -127,  d: u.lang === 'tr' ? 'Bugün'    : 'Today' },
            { ic: 'plus',     tint: '#22C55E', t: u.lang === 'tr' ? 'Cüzdana yükleme'    : 'Wallet top-up',                                  s: 'Garanti BBVA · 1234',                                          v: 2000,  d: u.lang === 'tr' ? 'Dün'      : 'Yesterday' },
            { ic: 'bed',      tint: '#C5A059', t: 'Hilton Rome',                                                                          s: u.lang === 'tr' ? 'Partner · +500 mil'  : 'Partner · +500 mi',    v: -3140, d: '14 Haz' },
          ].map((tx, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: `${tx.tint}1F`, color: tx.tint,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={tx.ic} size={15} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12.5, fontWeight: 700, color: '#fff',
                  letterSpacing: -0.1, whiteSpace: 'nowrap', overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>{tx.t}</div>
                <div style={{
                  fontSize: 10.5, color: '#7A8EAF', marginTop: 1,
                }}>{tx.s}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 800,
                  color: tx.v > 0 ? '#22C55E' : '#fff', letterSpacing: -0.2,
                }}>{tx.v > 0 ? '+' : '−'}{fmtTL(Math.abs(tx.v))} TL</div>
                <div style={{
                  fontSize: 9.5, color: '#7A8EAF', marginTop: 1,
                  fontFamily: 'var(--font-mono)', letterSpacing: 0.4,
                }}>{tx.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tagline footer */}
      <div style={{
        padding: '14px 18px 12px', textAlign: 'center',
      }}>
        <div style={{
          fontSize: 9.5, color: '#7A8EAF', letterSpacing: 1.5, fontWeight: 600,
        }}>
          {u.lang === 'tr'
            ? 'Türk Hava Yolları güvencesiyle · TCMB yetkili'
            : 'Backed by Turkish Airlines · CBRT authorized'}
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <AppTabBar active="wallet" onChange={(id) => nav(id === 'home' ? 'board' : id === 'search' ? 'search' : id === 'map' ? 'map' : id === 'wallet' ? 'tkpay' : 'profile')} {...u} />
      </div>

      {/* Convert sheet */}
      {convertOpen && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          background: 'rgba(0,0,0,0.55)',
          animation: 'pnrFade .25s ease',
        }} onClick={() => setConvertOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: '100%', padding: '20px 18px 18px',
            background: 'linear-gradient(180deg, #0F2244, #0A1628)',
            border: '1px solid rgba(197,160,89,0.35)',
            borderRadius: '20px 20px 0 0', color: '#fff',
            animation: 'qrSheet .45s cubic-bezier(.16,1,.3,1)',
            boxShadow: '0 -20px 60px rgba(0,0,0,0.6)',
          }}>
            <div style={{
              width: 36, height: 3, background: 'rgba(255,255,255,0.25)',
              borderRadius: 2, margin: '0 auto 14px',
            }} />
            <div style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 2.5, color: '#C5A059',
            }}>{u.lang === 'tr' ? 'MİL DÖNÜŞTÜRME' : 'MILES CONVERSION'}</div>
            <div style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20,
              color: '#fff', letterSpacing: -0.3, marginTop: 4,
            }}>{u.lang === 'tr' ? 'Millerini TL’ye dönüştür' : 'Convert miles to TL'}</div>

            <div style={{
              marginTop: 14, padding: 14, borderRadius: 12,
              background: 'rgba(255,255,255,0.045)',
              border: '1px solid rgba(255,255,255,0.085)',
              display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10,
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: '#7A8EAF' }}>
                  {u.lang === 'tr' ? 'MEVCUT' : 'AVAILABLE'}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 2 }}>
                  {fmtTL(totalMiles)}
                </div>
                <div style={{ fontSize: 10, color: '#7A8EAF' }}>mil</div>
              </div>
              <div style={{ color: '#C5A059', fontSize: 18 }}>→</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: '#7A8EAF' }}>
                  {u.lang === 'tr' ? 'KARŞILIĞI' : 'EQUIV.'}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: '#C5A059', marginTop: 2 }}>
                  {fmtTL(convertedTL)}
                </div>
                <div style={{ fontSize: 10, color: '#7A8EAF' }}>TL</div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: '#B2C0D1', marginTop: 10, lineHeight: 1.5 }}>
              {u.lang === 'tr'
                ? 'Dönüştürülen tutar anında TKPAY cüzdanına yüklenir. Her yerde harcayabilirsin.'
                : 'Converted amount is loaded into your TKPAY wallet instantly. Spend it anywhere.'}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button onClick={() => setConvertOpen(false)} style={{
                flex: 1, padding: '12px', cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', borderRadius: 12,
                fontFamily: u.font, fontWeight: 700, fontSize: 12,
              }}>{u.lang === 'tr' ? 'Vazgeç' : 'Cancel'}</button>
              <button onClick={() => {
                setConvertOpen(false);
                toast({
                  type: 'success', icon: '✓',
                  children: (u.lang === 'tr'
                    ? `${fmtTL(convertedTL)} TL cüzdanına yüklendi`
                    : `${fmtTL(convertedTL)} TL loaded to wallet`),
                });
              }} style={{
                flex: 1.4, padding: '12px', cursor: 'pointer',
                background: 'linear-gradient(135deg, #E8C97A, #C5A059)',
                color: '#0A1628', border: 'none', borderRadius: 12,
                fontFamily: u.font, fontWeight: 800, fontSize: 12, letterSpacing: 0.3,
                boxShadow: '0 6px 18px rgba(197,160,89,0.4)',
              }}>{u.lang === 'tr' ? 'Hemen Dönüştür' : 'Convert now'} →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 26) INVITE ACCEPT — paylaşılan rotaya katılım ekranı
// ───────────────────────────────────────────────────────────
// Davet linki açıldığında / "Önizle"den gelindiğinde gösterilen
// "Ahmet seni Roma rotasına davet etti" ekranı. Hero büyük avatar +
// ülke bayrağı, rota özet kartı, üç eylem (Katıl / Önizle / Reddet).
// ═══════════════════════════════════════════════════════════
function InviteAcceptScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: true });
  const topPad = k === 'ios' ? 50 : 14;
  const toast = useToast();
  const [booking, , h] = useBooking();
  const destCode = booking.toCode || 'FCO';
  const toC = h.to || (typeof findCity === 'function' ? findCity(destCode) : { code: destCode, city: destCode });
  const fromC = h.from || (typeof findCity === 'function' ? findCity('IST') : { code: 'IST', city: 'İstanbul' });

  // Mock inviter — in real life the link decodes the inviter id
  const inviter = { name: 'Ahmet Kaya', initials: 'AK', color: '#C5A059' };
  const tripName = `${toC.city || destCode} ${u.lang==='tr'?'Rotası':'Trip'}`;

  return (
    <div className="thy-screen is-dark screen-enter" style={{
      position: 'relative', minHeight: '100%', overflow: 'hidden',
      background: 'linear-gradient(180deg, #050B14 0%, #0A1628 38%, #0F2244 100%)',
      fontFamily: u.font, color: '#fff',
      display: 'flex', flexDirection: 'column',
    }}>
      <RouteMapBg opacity={0.07} />

      {/* Close X */}
      <div style={{ position: 'relative', padding: `${topPad}px 16px 8px`, display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => nav('board')} style={{
          width: 32, height: 32, borderRadius: 10,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          color: '#fff', cursor: 'pointer', fontSize: 18, lineHeight: 1,
        }}>×</button>
      </div>

      {/* Hero — sender avatar + tagline */}
      <div style={{
        position: 'relative', padding: '8px 22px 18px', textAlign: 'center',
      }}>
        <div style={{
          width: 96, height: 96, margin: '0 auto', borderRadius: '50%',
          background: `linear-gradient(135deg, ${inviter.color}, ${inviter.color}AA)`,
          color: '#0A1628',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 36,
          letterSpacing: -1,
          boxShadow: `0 12px 36px ${inviter.color}55, 0 0 0 4px rgba(255,255,255,0.05)`,
          position: 'relative',
        }}>
          {inviter.initials}
          {/* small plane glyph orbit */}
          <span aria-hidden style={{
            position: 'absolute', top: -2, right: -6,
            width: 28, height: 28, borderRadius: '50%',
            background: '#B7312C', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid #0A1628',
            boxShadow: '0 4px 10px rgba(183,49,44,0.4)',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1L15 22v-1.5L13 19v-5.5L21 16z"/>
            </svg>
          </span>
        </div>

        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 2.5, color: '#C5A059',
          marginTop: 16,
        }}>{u.lang==='tr' ? 'ROTA DAVETİ' : 'TRIP INVITATION'}</div>

        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 24,
          color: '#fff', letterSpacing: -0.4, lineHeight: 1.25,
          margin: '8px 22px 0',
        }}>
          <span style={{ color: inviter.color }}>{inviter.name.split(' ')[0]}</span>{' '}
          {u.lang==='tr' ? 'seni bir rotaya davet etti' : 'invited you to a trip'}
        </h1>

        <p style={{ fontSize: 12, color: '#B2C0D1', marginTop: 8, lineHeight: 1.5, padding: '0 18px' }}>
          {u.lang==='tr'
            ? 'Katıldığında rotayı görür, durakları düzenleyebilir, notlar yazabilirsin. Tüm değişiklikler anlık senkronlanır.'
            : 'When you join, you can view the trip, edit stops and write notes. All changes sync in real time.'}
        </p>
      </div>

      {/* Trip card */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          position: 'relative', overflow: 'hidden',
          padding: '16px 18px', borderRadius: 16,
          background: `
            radial-gradient(120% 70% at 0% 0%, rgba(197,160,89,0.22) 0%, transparent 55%),
            rgba(255,255,255,0.045)
          `,
          border: '1px solid rgba(197,160,89,0.4)',
          boxShadow: '0 14px 36px rgba(0,0,0,0.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2.2,
              color: '#C5A059', fontWeight: 800,
            }}>TRIP · {String(Math.floor(Math.random()*9000)+1000)}</span>
            <span style={{
              padding: '3px 8px', borderRadius: 999,
              background: 'rgba(34,197,94,0.14)', border: '1px solid rgba(34,197,94,0.32)',
              fontSize: 9, fontWeight: 800, color: '#22C55E',
              fontFamily: 'var(--font-mono)', letterSpacing: 1.4,
            }}>{u.lang==='tr' ? 'CANLI' : 'LIVE'}</span>
          </div>

          <div style={{
            fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20,
            color: '#fff', marginTop: 8, letterSpacing: -0.3,
          }}>{tripName}</div>

          {/* Route line */}
          <div style={{
            marginTop: 14, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: 0.8 }}>{fromC.code}</div>
              <div style={{ fontSize: 10.5, color: '#7A8EAF', marginTop: 2 }}>{fromC.city || fromC.code}</div>
            </div>
            <div style={{ flex: 1, position: 'relative', height: 24 }}>
              <svg width="100%" height="24" viewBox="0 0 200 24" preserveAspectRatio="none">
                <path d="M 0 16 Q 100 0 200 16" fill="none" stroke="#C5A059"
                  strokeWidth="2" strokeLinecap="round" strokeDasharray="3 4" />
              </svg>
              <span aria-hidden style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', color: '#C5A059',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1L15 22v-1.5L13 19v-5.5L21 16z"/>
                </svg>
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 16, color: '#B7312C', letterSpacing: 0.8 }}>{toC.code}</div>
              <div style={{ fontSize: 10.5, color: '#7A8EAF', marginTop: 2 }}>{toC.city || toC.code}</div>
            </div>
          </div>

          {/* mini stats */}
          <div style={{
            marginTop: 14, padding: '10px 12px', borderRadius: 10,
            background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.05)',
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
          }}>
            {[
              { l: u.lang==='tr'?'GÜN':'DAYS',    v: '3' },
              { l: u.lang==='tr'?'DURAK':'STOPS', v: '12' },
              { l: u.lang==='tr'?'PİLOT':'PILOTS', v: '3' },
            ].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: '#7A8EAF' }}>{s.l}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 2, letterSpacing: -0.4 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Co-pilots already in */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          fontSize: 9, fontWeight: 800, letterSpacing: 2.2, color: '#C5A059',
          marginBottom: 10,
        }}>{u.lang==='tr' ? 'PİLOTLAR' : 'CO-PILOTS'}</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {[
            { id: 'AK', name: 'Ahmet',   initials: 'AK', color: '#C5A059', host: true },
            { id: 'SY', name: 'Selin',   initials: 'SY', color: '#0053A5' },
            { id: 'MD', name: 'Mert',    initials: 'MD', color: '#1E8E5A' },
          ].map(c => (
            <div key={c.id} style={{
              flexShrink: 0, padding: '6px 12px 6px 6px', borderRadius: 999,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'inline-flex', alignItems: 'center', gap: 7,
            }}>
              <span aria-hidden style={{
                width: 24, height: 24, borderRadius: '50%',
                background: c.color, color: '#0A1628',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 10,
              }}>{c.initials}</span>
              <span style={{ fontSize: 11.5, color: '#fff', fontWeight: 700 }}>
                {c.name}
                {c.host && (
                  <span style={{ color: '#C5A059', fontWeight: 800, fontSize: 8.5, marginLeft: 5, letterSpacing: 0.5 }}>
                    HOST
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* CTA stack */}
      <div style={{
        padding: '14px 16px 22px',
        background: 'linear-gradient(180deg, transparent, rgba(10,22,40,0.6) 60%)',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <button onClick={() => {
          toast({ type: 'success', icon: '✓', children: u.lang==='tr' ? `${tripName}'ne katıldın` : `Joined ${tripName}` });
          setTimeout(() => nav('map'), 600);
        }} style={{
          padding: '14px 18px', cursor: 'pointer',
          background: 'linear-gradient(135deg, #EF2E1F, #B7312C)',
          color: '#fff', border: 'none', borderRadius: 12,
          fontFamily: u.font, fontWeight: 800, fontSize: 14, letterSpacing: 0.3,
          boxShadow: '0 10px 28px rgba(183,49,44,0.45)',
        }}>{u.lang==='tr' ? 'Rotaya Katıl' : 'Join Trip'} →</button>

        <button onClick={() => nav('map')} style={{
          padding: '12px 16px', cursor: 'pointer',
          background: 'rgba(255,255,255,0.06)', color: '#fff',
          border: '1px solid rgba(255,255,255,0.18)', borderRadius: 12,
          fontFamily: u.font, fontWeight: 700, fontSize: 13,
        }}>{u.lang==='tr' ? 'Önce Önizle' : 'Preview first'}</button>

        <button onClick={() => nav('board')} style={{
          marginTop: 4, padding: '8px', cursor: 'pointer',
          background: 'transparent', color: '#7A8EAF', border: 'none',
          fontFamily: u.font, fontWeight: 600, fontSize: 11.5,
        }}>{u.lang==='tr' ? 'Şimdi değil' : 'Not now'}</button>
      </div>
    </div>
  );
}

Object.assign(window, { QRScannerScreen, TKPayScreen, InviteAcceptScreen });
