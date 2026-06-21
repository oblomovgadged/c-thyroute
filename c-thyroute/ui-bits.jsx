// ui-bits.jsx — shared atoms used across all THY Route mobile screens.
// Exports to window: Icon, AppTabBar, StatusBadge, MiniStat, Crane, RouteMapBg,
//                    SectionLabel, MileChip, COPY, useThyTweaks, AccentCTA, RowDivider

// ── i18n strings (TR ⇄ EN) ──────────────────────────────────
const COPY = {
  tr: {
    appName: 'THY Route',
    boardEyebrow: 'UÇUŞ PANOSU',
    welcome: 'Hoş geldiniz, Aylin',
    upcomingFlight: 'Yaklaşan uçuşunuz',
    inFlight: 'YOLDA',
    onTime: 'ZAMANINDA',
    boarding: 'BİNİŞ AÇIK',
    gate: 'KAPI',
    seat: 'KOLTUK',
    flight: 'UÇUŞ',
    miles: 'Mil',
    classic: 'Classic',
    eliteCard: 'Elite Plus',
    boardingPass: 'Biniş Kartı',
    search: 'Uçuş ara',
    from: 'NEREDEN', to: 'NEREYE',
    depart: 'GİDİŞ', return: 'DÖNÜŞ',
    pax: 'YOLCU',
    searchCta: 'Uçuş ara →',
    results: 'Uçuş Sonuçları',
    onlyDirect: 'Sadece aktarmasız',
    sortPrice: 'Fiyat',
    sortTime: 'Saat',
    sortDuration: 'Süre',
    boardingNow: 'BİNİŞ AÇILDI',
    boardingIn: 'Biniş başlıyor',
    cabinCrew: 'Kabin ekibiniz', loungeRoute: 'Lounge yönü',
    coPilot: 'Yardımcı Pilot',
    coPilotDesc: 'Seyahatinizi bir yakınınızla canlı düzenleyin.',
    inviteCode: 'PİLOT KİMLİĞİ',
    sendInvite: 'Davet gönder',
    msPanel: 'Miles&Smiles',
    msDesc: 'Partner ağından mil kazanın.',
    partners: 'Partnerler',
    notifications: 'Bildirimler',
    today: 'Bugün',
    earlier: 'Daha önce',
    profile: 'Profil',
    settings: 'Ayarlar',
    paymentMethods: 'Ödeme yöntemleri',
    documents: 'Pasaport & belgeler',
    privacy: 'Gizlilik & KVKK',
    language: 'Dil',
    signOut: 'Çıkış yap',
    routePlan: 'Rota planınız',
    addStop: 'Durak ekle',
    domesticLeg: 'İç hat bağlantısı',
    splash1: 'Avrupa\'nın en iyisiyle',
    splash2: 'keşfedin.',
    splashSub: 'Uçuşunuzu, rotanızı ve yol arkadaşınızı tek yerde planlayın.',
    splashCta: 'Yolculuğa başla',
    splashSkip: 'Zaten üyeyim',
    home: 'Ana Sayfa', srh: 'Ara', mapTab: 'Rota', wallet: 'Cüzdan', meTab: 'Ben',
  },
  en: {
    appName: 'THY ROUTE',
    boardEyebrow: 'FLIGHT BOARD',
    welcome: 'Welcome, Aylin',
    upcomingFlight: 'Your upcoming flight',
    inFlight: 'IN FLIGHT',
    onTime: 'ON TIME',
    boarding: 'BOARDING OPEN',
    gate: 'GATE',
    seat: 'SEAT',
    flight: 'FLIGHT',
    miles: 'Miles',
    classic: 'Classic',
    eliteCard: 'Elite Plus',
    boardingPass: 'Boarding Pass',
    search: 'Search flight',
    from: 'FROM', to: 'TO',
    depart: 'DEPART', return: 'RETURN',
    pax: 'PAX',
    searchCta: 'Search →',
    results: 'Flight Results',
    onlyDirect: 'Direct only',
    sortPrice: 'Price',
    sortTime: 'Time',
    sortDuration: 'Duration',
    boardingNow: 'NOW BOARDING',
    boardingIn: 'Boarding starts',
    cabinCrew: 'Your cabin crew', loungeRoute: 'Lounge directions',
    coPilot: 'Co-Pilot',
    coPilotDesc: 'Plan this trip with someone live.',
    inviteCode: 'PILOT ID',
    sendInvite: 'Send invite',
    msPanel: 'Miles&Smiles',
    msDesc: 'Earn miles across the partner network.',
    partners: 'Partners',
    notifications: 'Notifications',
    today: 'Today',
    earlier: 'Earlier',
    profile: 'Profile',
    settings: 'Settings',
    paymentMethods: 'Payment methods',
    documents: 'Passport & documents',
    privacy: 'Privacy & data',
    language: 'Language',
    signOut: 'Sign out',
    routePlan: 'Your route plan',
    addStop: 'Add stop',
    domesticLeg: 'DOMESTIC LEG',
    splash1: 'Discover with',
    splash2: 'the best in Europe.',
    splashSub: 'Plan your flight, route and travel companion in one place.',
    splashCta: 'Start the journey',
    splashSkip: 'I already have an account',
    home: 'Home', srh: 'Search', mapTab: 'Route', wallet: 'Wallet', meTab: 'Me',
  }
};

// ── Tweak helper: resolves theme + accent for current screen ─
function useThyTweaks(t, screenDefaults) {
  // screenDefaults = { dark: true|false }
  const dark = t.theme === 'dark' ? true : t.theme === 'light' ? false : !!screenDefaults?.dark;
  const accent = ({
    red:   { fg: '#EF2E1F', bg: 'var(--thy-red)', deep: '#8E211D', glow: 'rgba(239,46,31,0.45)' },
    gold:  { fg: '#D9BE84', bg: '#C5A059', deep: '#A0813C', glow: 'rgba(197,160,89,0.5)' },
    blue:  { fg: '#1E6FCB', bg: '#0053A5', deep: '#003E7E', glow: 'rgba(0,83,165,0.5)' },
  })[t.accent || 'red'];
  const lang = t.language || 'tr';
  const c = COPY[lang];
  const font = ({
    outfit: "'Outfit', system-ui, sans-serif",
    inter: "'Inter', system-ui, sans-serif",
    system: "-apple-system, system-ui, sans-serif",
  })[t.font || 'outfit'];
  const density = t.density || 'comfortable';
  const pad = density === 'compact' ? 12 : 16;
  return { dark, accent, lang, c, font, density, pad };
}

// ── Icon set (Lucide-style 2.25px round-cap line icons) ─────
function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 2.25, style = {} }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    style,
  };
  const paths = {
    plane:    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1L15 22v-1.5L13 19v-5.5L21 16z" />,
    search:   (<g><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></g>),
    map:      (<g><path d="M3 6v15l6-3 6 3 6-3V3l-6 3-6-3-6 3z"/><path d="M9 3v15"/><path d="M15 6v15"/></g>),
    wallet:   (<g><path d="M3 7a2 2 0 0 1 2-2h13l3 3v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><path d="M16 13h2"/></g>),
    user:     (<g><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></g>),
    bell:     (<g><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></g>),
    arrowR:   <path d="M5 12h14M13 5l7 7-7 7"/>,
    arrowL:   <path d="M19 12H5M11 5l-7 7 7 7"/>,
    plus:     <path d="M12 5v14M5 12h14"/>,
    chevR:    <path d="m9 6 6 6-6 6"/>,
    check:    <path d="m5 12 5 5L20 7"/>,
    swap:     <path d="M7 7h13l-3-3M17 17H4l3 3"/>,
    calendar: (<g><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></g>),
    user2:    (<g><circle cx="12" cy="8" r="4"/><path d="M6 21a6 6 0 0 1 12 0"/></g>),
    qr:       (<g><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v3M14 17v4M17 17v4M21 21h-2"/></g>),
    copy:     (<g><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></g>),
    shield:   (<g><path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/></g>),
    globe:    (<g><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></g>),
    logout:   (<g><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></g>),
    cardIcon: (<g><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 10h20M6 14h3"/></g>),
    doc:      (<g><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></g>),
    bellAlt:  (<g><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></g>),
    star:     <path d="M12 3l2.6 5.6 6.1.7-4.6 4.1 1.3 6-5.4-3.1L6.6 19.4l1.3-6L3.3 9.3l6.1-.7L12 3z"/>,
    coffee:   (<g><path d="M4 9h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9z"/><path d="M17 11h2a2 2 0 0 1 0 4h-2M7 4v2M11 4v2"/></g>),
    bed:      (<g><path d="M3 18V8M3 14h18v4M21 18v-4a3 3 0 0 0-3-3h-7v3"/><circle cx="7" cy="11" r="1.5"/></g>),
    car:      (<g><path d="M5 17h14M5 17v2M19 17v2M5 17l1.6-5h10.8L19 17M5 17a2 2 0 1 1 0 0M19 17a2 2 0 1 1 0 0"/></g>),
    location: (<g><path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13z"/><circle cx="12" cy="9" r="2.5"/></g>),
    link:     <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1-1"/>,
    mail:     (<g><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></g>),
    moon:     <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>,
    sun:      (<g><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></g>),
    edit:     <path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>,
    trash:    (<g><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></g>),
    swapV:    <path d="M7 3v18l-4-4M17 21V3l4 4"/>,
    wifi:     (<g><path d="M2 9a16 16 0 0 1 20 0"/><path d="M5 12.5a11 11 0 0 1 14 0"/><path d="M8.5 16a6 6 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/></g>),
    headset:  (<g><path d="M3 16v-4a9 9 0 0 1 18 0v4"/><path d="M21 16a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2v2zM3 16a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2v2z"/></g>),
    sparkles: <path d="M12 3v6m0 6v6M3 12h6m6 0h6M5.5 5.5l4 4m5 5 4 4M5.5 18.5l4-4m5-5 4-4"/>,
    history:  (<g><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></g>),
  };
  return <svg {...props}>{paths[name] || null}</svg>;
}

// ── Bottom app tab bar (used inside the phone) ──────────────
function AppTabBar({ active, onChange, dark, accent, c, font }) {
  const items = [
    { id: 'home',   label: c.home,   icon: 'plane' },
    { id: 'search', label: c.srh,    icon: 'search' },
    { id: 'map',    label: c.mapTab, icon: 'map' },
    { id: 'wallet', label: c.wallet, icon: 'wallet' },
    { id: 'me',     label: c.meTab,  icon: 'user' },
  ];
  const bg = dark ? 'rgba(10,22,40,0.92)' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.08)' : '#E2E8F0';
  const dim = dark ? '#7A8EAF' : '#94A3B8';
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch', justifyContent: 'space-around',
      padding: '8px 6px 10px', background: bg,
      borderTop: `1px solid ${border}`,
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      fontFamily: font,
    }}>
      {items.map((it) => {
        const isOn = active === it.id;
        return (
          <button key={it.id} onClick={() => onChange?.(it.id)}
            style={{
              flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '6px 0', position: 'relative',
              color: isOn ? accent.fg : dim,
              fontFamily: font,
              transition: 'color 200ms ease',
            }}>
            <Icon name={it.icon} size={20} strokeWidth={isOn ? 2.6 : 2.1} />
            <span style={{ fontSize: 10, fontWeight: isOn ? 700 : 500, letterSpacing: 0.2 }}>{it.label}</span>
            {isOn && (
              <span style={{
                position: 'absolute', top: -8, width: 24, height: 3,
                background: accent.fg, borderRadius: 999,
                boxShadow: `0 0 8px ${accent.glow}`,
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Status badge (pulsing dot + label) ──────────────────────
function StatusBadge({ kind = 'success', children, dark, style = {} }) {
  const palette = {
    success: { dot: '#22C55E', bg: 'rgba(34,197,94,0.12)', fg: '#16A34A' },
    warning: { dot: '#FF8C00', bg: 'rgba(255,140,0,0.12)', fg: '#C2570A' },
    gold:    { dot: '#C5A059', bg: 'rgba(197,160,89,0.16)', fg: '#9B7E3D' },
    red:     { dot: '#EF2E1F', bg: 'rgba(239,46,31,0.12)', fg: '#B7312C' },
  }[kind];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      fontFamily: 'var(--font-ui)', fontSize: 9, fontWeight: 800,
      letterSpacing: 1.5, textTransform: 'uppercase',
      background: dark ? 'rgba(255,255,255,0.07)' : palette.bg,
      color: dark ? '#fff' : palette.fg,
      border: dark ? `1px solid ${palette.dot}33` : 'none',
      ...style,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: palette.dot,
        animation: 'thy-pulse 1.8s ease-out infinite',
      }} />
      {children}
    </span>
  );
}

// ── Mini stat (label + mono value) ──────────────────────────
function MiniStat({ label, value, dark }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{
        fontSize: 9, fontWeight: 800, letterSpacing: 1.8,
        textTransform: 'uppercase',
        color: dark ? '#7A8EAF' : '#94A3B8',
      }}>{label}</span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 800,
        color: dark ? '#fff' : '#0A1628', letterSpacing: -0.3,
      }}>{value}</span>
    </div>
  );
}

// ── THY crane wordmark (uses logo asset) ────────────────────
function Crane({ dark, size = 28 }) {
  const R = (typeof window !== 'undefined' && window.__resources) || {};
  return (
    <img
      src={dark ? (R.logoLight || 'assets/logo.png') : (R.logoDark || 'assets/logo-dark.png')}
      alt="THY Route"
      style={{ height: size, width: 'auto', display: 'block' }}
    />
  );
}

// ── Route-network world map watermark ───────────────────────
function RouteMapBg({ opacity = 0.18, style = {} }) {
  const R = (typeof window !== 'undefined' && window.__resources) || {};
  return (
    <img
      src={R.routeMap || 'assets/AnaEkran.png'}
      alt=""
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        opacity, pointerEvents: 'none',
        filter: 'saturate(0.4)',
        ...style,
      }}
    />
  );
}

// ── Section eyebrow ─────────────────────────────────────────
function SectionLabel({ children, dark, accent, style = {} }) {
  return (
    <div style={{
      fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 800,
      letterSpacing: 2, textTransform: 'uppercase',
      color: dark ? (accent?.fg || '#C5A059') : '#64748B',
      display: 'flex', alignItems: 'center', gap: 8,
      ...style,
    }}>
      <span style={{ width: 16, height: 1, background: 'currentColor', opacity: 0.5 }} />
      {children}
    </div>
  );
}

// ── Miles pill ──────────────────────────────────────────────
function MileChip({ value, dark }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 999,
      background: dark ? 'rgba(197,160,89,0.16)' : 'rgba(197,160,89,0.16)',
      border: '1px solid rgba(197,160,89,0.3)',
      color: '#9B7E3D',
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
    }}>
      ✦ {value}
    </span>
  );
}

// ── Accented primary CTA (mobile-sized) ─────────────────────
function AccentCTA({ children, onClick, accent, full = true, icon, dark, style = {} }) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setP(false); }}
      onMouseDown={() => setP(true)} onMouseUp={() => setP(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        width: full ? '100%' : 'auto',
        padding: '14px 22px', border: 'none', cursor: 'pointer',
        background: `linear-gradient(135deg, ${accent.deep} 0%, ${accent.bg} 50%, ${accent.fg} 100%)`,
        color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: 0.3,
        fontFamily: 'var(--font-ui)', borderRadius: 12,
        boxShadow: h
          ? `0 10px 30px ${accent.glow}, 0 1px 0 rgba(255,255,255,0.15) inset`
          : `0 4px 16px ${accent.glow}, 0 1px 0 rgba(255,255,255,0.15) inset`,
        transform: p ? 'scale(0.97)' : h ? 'translateY(-1px)' : 'none',
        transition: 'all 220ms cubic-bezier(.4,0,.2,1)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        ...style,
      }}>
      <span style={{
        position: 'absolute', top: 0, left: h ? '120%' : '-40%',
        width: '40%', height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
        transform: 'skewX(-20deg)', transition: h ? 'left 0.6s ease' : 'none',
      }} />
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        {icon && <Icon name={icon} size={16} />}
        {children}
      </span>
    </button>
  );
}

// ── Row divider ─────────────────────────────────────────────
function RowDivider({ dark, style = {} }) {
  return <div style={{
    height: 1,
    background: dark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
    ...style,
  }} />;
}

Object.assign(window, {
  Icon, AppTabBar, StatusBadge, MiniStat, Crane, RouteMapBg,
  SectionLabel, MileChip, COPY, useThyTweaks, AccentCTA, RowDivider,
  BoardingPass: BoardingPassLeg, PartnerItem: PartnerRow,
});

// ── Inlined DS components (avoid auto-mount errors from full bundle) ──
function BoardingPassLeg({
  flightCode = 'TK 2412', fromCode = 'IST', toCode = 'AYT',
  fromCity = 'İstanbul', toCity = 'Antalya', style = {},
}) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(0,83,165,0.18), rgba(0,60,120,0.10))',
      border: '1px solid rgba(0,83,165,0.35)',
      borderRadius: 8, padding: '12px 16px',
      fontFamily: 'var(--font-ui)', ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ textAlign: 'center', minWidth: 48 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: '#fff' }}>{fromCode}</div>
          <div style={{ fontSize: 10, color: '#B2C0D1' }}>{fromCity}</div>
        </div>
        <div style={{ flex: 1, position: 'relative', height: 24 }}>
          <div style={{
            position: 'absolute', top: '50%', left: 0, right: 0, height: 1,
            borderTop: '1px dashed rgba(120,170,230,0.5)',
          }} />
          <span style={{
            position: 'absolute', top: 'calc(50% - 9px)', fontSize: 14,
            color: '#1E6FCB', animation: 'thy-plane 3.2s ease-in-out infinite',
          }}>✈</span>
          <div style={{
            position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
            fontSize: 8, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase',
            color: '#7A8EAF',
          }}>İç Hat</div>
        </div>
        <div style={{ textAlign: 'center', minWidth: 48 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: '#fff' }}>{toCode}</div>
          <div style={{ fontSize: 10, color: '#B2C0D1' }}>{toCity}</div>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
          color: '#C5A059', background: 'rgba(197,160,89,0.12)',
          border: '1px solid rgba(197,160,89,0.3)', borderRadius: 4, padding: '3px 8px',
        }}>{flightCode}</div>
      </div>
    </div>
  );
}

function PartnerRow({ name, offer, icon, actionLabel = 'Haritada Bul', onAction = () => {} }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, padding: '10px 12px', borderRadius: 8,
        background: hover ? 'rgba(255,255,255,0.075)' : 'rgba(255,255,255,0.045)',
        border: '1px solid ' + (hover ? 'rgba(197,160,89,0.3)' : 'rgba(255,255,255,0.085)'),
        transition: 'all 220ms cubic-bezier(.4,0,.2,1)', fontFamily: 'var(--font-ui)',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <span style={{
          width: 36, height: 36, flexShrink: 0, borderRadius: 8,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(183,49,44,0.12)', color: '#EF6F66',
          border: '1px solid rgba(183,49,44,0.2)',
        }}>{icon || '✈'}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{name}</div>
          <div style={{
            fontSize: 11, color: '#B2C0D1',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{offer}</div>
        </div>
      </div>
      <button onClick={onAction} style={{
        flexShrink: 0, padding: '6px 12px', fontSize: 11, fontWeight: 600,
        fontFamily: 'var(--font-ui)', borderRadius: 999, cursor: 'pointer',
        background: 'rgba(255,255,255,0.055)', color: '#D6DEEA',
        border: '1px solid rgba(255,255,255,0.12)', whiteSpace: 'nowrap',
      }}>{actionLabel}</button>
    </div>
  );
}
