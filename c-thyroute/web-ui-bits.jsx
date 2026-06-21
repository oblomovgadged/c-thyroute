// web-ui-bits.jsx — shared atoms for the web prototype.
// Exports to window: WebTopNav, WebFooter, PageShell, HeroBand, SectionTitle,
//                    KPIStat, GlobeNetworkBg.

// ── Top navigation (turkishairlines.com mantığı) ────────────
function WebTopNav({ active, onNavigate, t, accent, c, lang, dark = false, compact = false }) {
  const items = [
    { id: 'board',     label: c.home,         icon: 'plane' },
    { id: 'search',    label: c.srh,          icon: 'search' },
    { id: 'map',       label: c.mapTab,       icon: 'map' },
    { id: 'ms',        label: c.wallet,       icon: 'wallet' },
    { id: 'tkpay',     label: 'TKPAY',        icon: 'cardIcon' },
    { id: 'turkiyeTuru', label: lang === 'tr' ? 'Türkiye Turu' : 'Türkiye Tour', icon: 'sparkles' },
  ];
  const moreItems = [
    { id: 'routes',     label: lang === 'tr' ? 'Kayıtlı Rotalarım' : 'Saved Routes', icon: 'star' },
    { id: 'payment',    label: lang === 'tr' ? 'Ödeme' : 'Payment',                   icon: 'wallet' },
    { id: 'history',  label: lang === 'tr' ? 'Geçmiş'  : 'History',  icon: 'history' },
    { id: 'priceAlert', label: lang === 'tr' ? 'Fiyat Alarmı' : 'Price Alert', icon: 'bell' },
    { id: 'lounge',   label: 'Lounge',                                icon: 'coffee' },
    { id: 'help',     label: lang === 'tr' ? 'Yardım'  : 'Help',     icon: 'headset' },
  ];
  const [moreOpen, setMoreOpen] = React.useState(false);

  const bg     = dark ? 'rgba(10,22,40,0.92)' : '#FFFFFF';
  const border = dark ? 'rgba(255,255,255,0.08)' : '#E2E8F0';
  const text   = dark ? '#F4EBD9' : '#0A1628';
  const dim    = dark ? '#7A8EAF' : '#64748B';
  const hover  = dark ? 'rgba(255,255,255,0.06)' : '#F3F5F8';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: bg, borderBottom: `1px solid ${border}`,
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: compact ? 14 : 28,
        padding: compact ? '12px 22px' : '14px 32px',
        maxWidth: 1440, margin: '0 auto',
      }}>
        {/* Logo slot — intentionally empty per user request */}
        <div style={{ width: 1, height: 36 }} aria-hidden="true"></div>

        {/* Primary nav */}
        <nav style={{ display: 'flex', gap: compact ? 4 : 8, alignItems: 'center' }}>
          {items.map(it => {
            const on = active === it.id;
            const isTurkiye = it.id === 'turkiyeTuru';
            const gold = '#C5A059';
            return (
              <button key={it.id} onClick={() => onNavigate(it.id)} style={{
                background: on ? hover : 'transparent', border: 'none',
                padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
                fontFamily: isTurkiye
                  ? "'Playfair Display', Georgia, serif"
                  : 'var(--font-ui)',
                fontStyle: isTurkiye ? 'italic' : 'normal',
                fontSize: isTurkiye ? 15 : 13,
                fontWeight: isTurkiye ? 700 : (on ? 700 : 500),
                letterSpacing: isTurkiye ? 0.2 : 0,
                color: isTurkiye ? gold : (on ? accent.bg : text),
                textShadow: isTurkiye ? `0 0 16px ${gold}33` : 'none',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                position: 'relative', transition: 'all 180ms',
              }}>
                <Icon name={it.icon} size={isTurkiye ? 15 : 14} color={isTurkiye ? gold : 'currentColor'} />
                {it.label}
                {on && <span style={{
                  position: 'absolute', bottom: -15, left: '20%', right: '20%', height: 2,
                  background: isTurkiye ? gold : accent.bg, borderRadius: 9999,
                  boxShadow: `0 0 8px ${isTurkiye ? gold + '99' : accent.glow}`,
                }} />}
              </button>
            );
          })}
          {/* More dropdown */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMoreOpen(!moreOpen)} style={{
              background: moreOpen ? hover : 'transparent', border: 'none',
              padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: text,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              {lang === 'tr' ? 'Daha fazla' : 'More'}
              <span style={{ fontSize: 10, transform: moreOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
            </button>
            {moreOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                minWidth: 200, background: '#fff', border: '1px solid #E2E8F0',
                borderRadius: 10, padding: 6, zIndex: 40,
                boxShadow: '0 18px 40px rgba(10,22,40,0.16)',
              }}>
                {moreItems.map(it => (
                  <button key={it.id} onClick={() => { onNavigate(it.id); setMoreOpen(false); }} style={{
                    width: '100%', textAlign: 'left',
                    padding: '9px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500,
                    color: '#0A1628', display: 'flex', alignItems: 'center', gap: 8,
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F3F5F8'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <Icon name={it.icon} size={14} color={accent.bg} />
                    {it.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Right cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Language */}
          <button style={iconBtn(dark, text)} onClick={() => {}}>
            <Icon name="globe" size={14} /> <span style={{ fontWeight: 700, fontSize: 11 }}>{lang.toUpperCase()}</span>
          </button>
          {/* Notifications */}
          <button style={{ ...iconBtn(dark, text), position: 'relative' }} onClick={() => onNavigate('notifications')}>
            <Icon name="bell" size={14} />
            <span style={{
              position: 'absolute', top: 6, right: 6, width: 7, height: 7,
              borderRadius: '50%', background: accent.bg, boxShadow: `0 0 8px ${accent.glow}`,
            }} />
          </button>
          {/* Help */}
          <button style={iconBtn(dark, text)} onClick={() => onNavigate('help')}>
            <Icon name="headset" size={14} />
          </button>

          <div style={{ width: 1, height: 24, background: border, margin: '0 4px' }} />

          {/* Avatar */}
          <button onClick={() => onNavigate('profile')} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 4px 4px 10px',
            borderRadius: 999,
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = hover}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <div style={{ textAlign: 'right', lineHeight: 1.2 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: text }}>Aylin K.</div>
              <div style={{ fontSize: 10, color: '#C5A059', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                ✦ ELITE PLUS · 87.420
              </div>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: `linear-gradient(135deg, ${accent.fg}, ${accent.deep})`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 14,
              border: '2px solid ' + (dark ? 'rgba(255,255,255,0.15)' : '#fff'),
              boxShadow: `0 4px 10px ${accent.glow}`,
            }}>AK</div>
          </button>
        </div>
      </div>
    </header>
  );
}
function iconBtn(dark, color) {
  return {
    background: 'transparent', border: 'none', cursor: 'pointer',
    width: 36, height: 36, borderRadius: 8,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
    color: color, transition: 'background .18s',
  };
}

// ── Page shell wrapper (every web screen renders inside this) ──
function PageShell({ children, dark = false, bg, style = {} }) {
  return (
    <div className="web-screen-enter" style={{
      minHeight: 'calc(100% - 60px)',
      background: bg || (dark ? '#0A1628' : '#F3F5F8'),
      color: dark ? '#fff' : '#0A1628',
      fontFamily: 'var(--font-ui)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Hero band (dark navy w/ map watermark, gold eyebrow) ────
function HeroBand({ eyebrow, title, sub, accent, children, dark = true, height = 280, bg, style = {} }) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: bg || 'linear-gradient(135deg, #0A1628 0%, #0F2244 60%, #1B3868 100%)',
      color: '#fff', padding: '54px 48px 36px',
      minHeight: height,
      ...style,
    }}>
      <img src={(window.__resources?.routeMap) || 'assets/AnaEkran.png'} alt="" aria-hidden
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.12, filter: 'saturate(0.4)', pointerEvents: 'none',
        }} />
      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto' }}>
        {eyebrow && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 2.5,
            color: accent?.fg || '#C5A059', textTransform: 'uppercase', marginBottom: 10,
          }}>{eyebrow}</div>
        )}
        {title && (
          <h1 style={{
            margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 44,
            letterSpacing: -1, lineHeight: 1.05, maxWidth: 720,
          }}>{title}</h1>
        )}
        {sub && (
          <p style={{ marginTop: 10, color: '#B2C0D1', fontSize: 16, maxWidth: 560, lineHeight: 1.5 }}>
            {sub}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

// ── Section title (for content blocks) ─────────────────────
function SectionTitle({ eyebrow, title, action, accent, dark = false }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      marginBottom: 16,
    }}>
      <div>
        {eyebrow && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2,
            color: dark ? (accent?.fg || '#C5A059') : '#64748B',
            textTransform: 'uppercase', marginBottom: 4,
          }}>{eyebrow}</div>
        )}
        <h2 style={{
          margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 800,
          fontSize: 22, color: dark ? '#fff' : '#0A1628', letterSpacing: -0.3,
        }}>{title}</h2>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── KPI tile ───────────────────────────────────────────────
function KPIStat({ label, value, valueSuffix, hint, icon, accent, dark = false }) {
  return (
    <div style={{
      padding: '16px 18px 18px', borderRadius: 12,
      background: dark ? 'rgba(255,255,255,0.045)' : '#fff',
      border: '1px solid ' + (dark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'),
      boxShadow: dark ? 'none' : '0 6px 22px rgba(10,22,40,0.08)',
      position: 'relative',
    }}>
      {/* Top row: icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
        {icon && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 22, height: 22, borderRadius: 6,
            background: accent?.bg || '#C5A059', color: '#fff',
            fontSize: 11, fontWeight: 800, lineHeight: 1,
          }}>{icon}</span>
        )}
        <div style={{
          fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6,
          color: dark ? '#B2C0D1' : '#475569', lineHeight: 1.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          flex: 1,
        }}>{label}</div>
      </div>
      {/* Value + suffix on the same baseline */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 800,
          color: dark ? '#fff' : '#0A1628', letterSpacing: -0.5, lineHeight: 1,
        }}>{value}</span>
        {valueSuffix && (
          <span style={{
            fontSize: 12, fontWeight: 700,
            color: dark ? '#7A8EAF' : '#64748B', letterSpacing: 0.2,
          }}>{valueSuffix}</span>
        )}
      </div>
      {hint && (
        <div style={{
          fontSize: 11, color: accent?.bg || '#0053A5',
          marginTop: 8, fontWeight: 700,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{hint}</div>
      )}
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────────
function WebFooter({ lang, accent }) {
  const isTR = lang === 'tr';
  const cols = [
    {
      title: isTR ? 'THY Route' : 'THY Route',
      links: [
        isTR ? 'Hakkımızda' : 'About', isTR ? 'Kariyer' : 'Careers',
        isTR ? 'Basın' : 'Press', isTR ? 'Yatırımcı' : 'Investors',
      ],
    },
    {
      title: isTR ? 'Yardım' : 'Help',
      links: [
        isTR ? 'Yardım merkezi' : 'Help center', isTR ? 'İletişim' : 'Contact',
        isTR ? 'Lounge' : 'Lounge', isTR ? 'Bagaj' : 'Baggage',
      ],
    },
    {
      title: isTR ? 'Programlar' : 'Programs',
      links: [
        'Miles&Smiles', isTR ? 'Co-Pilot' : 'Co-Pilot',
        isTR ? 'Türkiye Turu' : 'Türkiye Tour', isTR ? 'Kurumsal' : 'Corporate',
      ],
    },
    {
      title: isTR ? 'Yasal' : 'Legal',
      links: [
        isTR ? 'KVKK' : 'Privacy', isTR ? 'Çerezler' : 'Cookies',
        isTR ? 'Kullanım Şartları' : 'Terms', isTR ? 'Erişilebilirlik' : 'Accessibility',
      ],
    },
  ];
  return (
    <footer style={{
      background: '#0A1628', color: '#B2C0D1',
      padding: '50px 32px 28px', marginTop: 'auto',
      borderTop: `2px solid ${accent.bg}`,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.4fr repeat(4, 1fr)',
          gap: 36, marginBottom: 32,
        }}>
          <div>
            <img src={(window.__resources?.logoLight) || 'assets/logo.png'} alt="" style={{ height: 28, marginBottom: 14 }} />
            <p style={{ fontSize: 12, lineHeight: 1.5, color: '#7A8EAF', maxWidth: 280 }}>
              {isTR
                ? 'Avrupa\'nın en iyi havayoluyla bir seyahat planlama deneyimi.'
                : 'Travel planning with the best airline in Europe.'}
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <span style={socialBtn}>𝕏</span>
              <span style={socialBtn}>ⓘ</span>
              <span style={socialBtn}>f</span>
              <span style={socialBtn}>▶</span>
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: 2,
                color: accent.fg, textTransform: 'uppercase', marginBottom: 12,
              }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.links.map(l => (
                  <a key={l} href="#" style={{
                    color: '#B2C0D1', textDecoration: 'none', fontSize: 13,
                  }}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 18, display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', fontSize: 11, color: '#7A8EAF',
        }}>
          <span>© 2026 THY Route · {isTR ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>v2.4.1 · build 3892</span>
        </div>
      </div>
    </footer>
  );
}
const socialBtn = {
  width: 32, height: 32, borderRadius: '50%',
  background: 'rgba(255,255,255,0.06)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  color: '#B2C0D1', cursor: 'pointer', fontSize: 14, fontWeight: 700,
};

// ── Route-network world map background ────────────────────
function GlobeNetworkBg({ opacity = 0.22, style = {} }) {
  return (
    <img
      src={(window.__resources?.routeMap) || 'assets/AnaEkran.png'}
      alt="" aria-hidden
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        // Cover (fills the hero edge-to-edge again), anchored to TOP so the
        // baked-in THY logo at the top of the PNG isn't clipped — then nudged
        // down a touch so the logo sits with a bit of air above it.
        objectFit: 'cover',
        objectPosition: 'center top',
        transform: 'translateY(8px)',
        opacity, pointerEvents: 'none', filter: 'saturate(0.4)',
        ...style,
      }}
    />
  );
}

Object.assign(window, {
  WebTopNav, WebFooter, PageShell, HeroBand, SectionTitle, KPIStat, GlobeNetworkBg,
});
