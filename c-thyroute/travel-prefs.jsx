// travel-prefs.jsx — Shared Seyahat Tercihleri (Travel Preferences) module
//
// Powers BOTH:
//   • Web Sitesi.html   → WebTravelPrefsScreen  (light, sidebar layout)
//   • Mobil Uygulama.html → TravelPrefsScreen   (mobile-first, full-height)
//
// Storage: localStorage key 'thy-travel-prefs-v1' (single source of truth — web and
// mobile see the same prefs on the same browser).
//
// Schema:
//   {
//     speed:         'fast' | 'balanced' | 'slow'                     // single
//     interests:     ['culture','food','nightlife','nature',
//                     'shopping','photo']                              // multi
//     budget:        'eco' | 'mid' | 'premium' | 'miles'              // single
//     accommodation: ['partner','chain','boutique','central']          // multi
//     travelerType:  'solo' | 'couple' | 'family' | 'friends' | 'work' // single
//     planFlex:      'planned' | 'balanced' | 'spontaneous'            // single
//     savedAt:       ISO timestamp
//   }
//
// Used by: Tur Rotası (web-screens-d) + Rota / Map (web-screens-b, screens-b) which
// show a "✦ Tercihlerinize göre düzenlendi" badge when prefs exist.

// ── Storage helpers ──────────────────────────────────────────────────
const THY_PREFS_KEY = 'thy-travel-prefs-v1';

function thyLoadPrefs() {
  try {
    const raw = localStorage.getItem(THY_PREFS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

function thySavePrefs(prefs) {
  try {
    localStorage.setItem(THY_PREFS_KEY, JSON.stringify({ ...prefs, savedAt: new Date().toISOString() }));
    window.dispatchEvent(new CustomEvent('thy-prefs-change'));
  } catch (_) {}
}

function thyHasPrefs() {
  const p = thyLoadPrefs();
  if (!p) return false;
  // Consider "set" if at least one category has a value
  return !!(p.speed || (p.interests && p.interests.length)
    || p.budget || (p.accommodation && p.accommodation.length)
    || p.travelerType || p.planFlex);
}

// React hook so screens auto-rerender on save
function useTravelPrefs() {
  const [p, setP] = React.useState(() => thyLoadPrefs());
  React.useEffect(() => {
    const on = () => setP(thyLoadPrefs());
    window.addEventListener('thy-prefs-change', on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener('thy-prefs-change', on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return p;
}

// ── Category definitions (i18n + UI glyphs) ─────────────────────────
const THY_PREF_CATEGORIES = [
  {
    key: 'speed', multi: false,
    title: { tr: 'Seyahat Hızı',  en: 'Travel pace' },
    desc:  { tr: 'Günde kaç durak ve ne kadar molayla?', en: 'How many stops per day, how much down-time?' },
    icon: 'speed',
    options: [
      { id: 'fast',     glyph: '⚡', label: { tr: 'Hızlı Gezi',   en: 'Fast pace'     }, hint: { tr: '4–5 durak / gün',  en: '4–5 stops / day'  } },
      { id: 'balanced', glyph: '⚖', label: { tr: 'Dengeli Gezi', en: 'Balanced pace' }, hint: { tr: '3 durak / gün',     en: '3 stops / day'    } },
      { id: 'slow',     glyph: '☕', label: { tr: 'Rahat Gezi',   en: 'Slow pace'     }, hint: { tr: '1–2 durak / gün',   en: '1–2 stops / day'  } },
    ],
  },
  {
    key: 'interests', multi: true,
    title: { tr: 'İlgi Alanları', en: 'Interests' },
    desc:  { tr: 'Birden fazla seçebilirsiniz.', en: 'You can pick multiple.' },
    icon: 'compass',
    options: [
      { id: 'culture',   glyph: '🏛',  label: { tr: 'Kültür ve Tarih',  en: 'Culture & history' } },
      { id: 'food',      glyph: '🍽',  label: { tr: 'Gastronomi',        en: 'Gastronomy'        } },
      { id: 'nightlife', glyph: '🎶',  label: { tr: 'Gece Hayatı',       en: 'Nightlife'         } },
      { id: 'nature',    glyph: '⛰',  label: { tr: 'Doğa',               en: 'Nature'            } },
      { id: 'shopping',  glyph: '🛍',  label: { tr: 'Alışveriş',          en: 'Shopping'          } },
      { id: 'photo',     glyph: '◉',   label: { tr: 'Fotoğraf Noktaları', en: 'Photo spots'      } },
    ],
  },
  {
    key: 'budget', multi: false,
    title: { tr: 'Bütçe ve Konfor', en: 'Budget & comfort' },
    desc:  { tr: 'Fiyat ve konfor dengesini ayarlayın.', en: 'Set your price-to-comfort balance.' },
    icon: 'wallet',
    options: [
      { id: 'eco',      glyph: '$',   label: { tr: 'Ekonomik',                 en: 'Economy'            } },
      { id: 'mid',      glyph: '$$',  label: { tr: 'Orta Seviye',              en: 'Mid-range'          } },
      { id: 'premium',  glyph: '$$$', label: { tr: 'Premium',                  en: 'Premium'            } },
      { id: 'miles',    glyph: '✦',   label: { tr: 'Miles&Smiles Öncelikli',  en: 'Miles&Smiles first' } },
    ],
  },
  {
    key: 'accommodation', multi: true,
    title: { tr: 'Konaklama Tercihi', en: 'Stay preference' },
    desc:  { tr: 'Hangi tür otel öncelik olsun?', en: 'Which hotel types take priority?' },
    icon: 'bed',
    options: [
      { id: 'partner',  glyph: '✦', label: { tr: 'Partner Oteller Öncelikli', en: 'Partner hotels first' } },
      { id: 'chain',    glyph: '◆', label: { tr: 'Zincir Oteller',             en: 'Chain hotels'         } },
      { id: 'boutique', glyph: '✿', label: { tr: 'Boutique Oteller',           en: 'Boutique hotels'      } },
      { id: 'central',  glyph: '📍', label: { tr: 'Merkezi Konum Öncelikli',   en: 'Central location first' } },
    ],
  },
  {
    key: 'travelerType', multi: false,
    title: { tr: 'Seyahat Tipi', en: 'Travel type' },
    desc:  { tr: 'Kiminle seyahat ediyorsunuz?', en: 'Who are you traveling with?' },
    icon: 'users',
    options: [
      { id: 'solo',    glyph: '◐', label: { tr: 'Solo',          en: 'Solo'         } },
      { id: 'couple',  glyph: '♥', label: { tr: 'Çift',          en: 'Couple'       } },
      { id: 'family',  glyph: '◉', label: { tr: 'Aile',          en: 'Family'       } },
      { id: 'friends', glyph: '◈', label: { tr: 'Arkadaş Grubu', en: 'Friends'      } },
      { id: 'work',    glyph: '◌', label: { tr: 'İş Seyahati',   en: 'Work travel'  } },
    ],
  },
  {
    key: 'planFlex', multi: false,
    title: { tr: 'Plan Esnekliği', en: 'Plan flexibility' },
    desc:  { tr: 'Yola çıktıktan sonra ne kadar esnek?', en: 'How flexible are you en route?' },
    icon: 'clock',
    options: [
      { id: 'planned',     glyph: '▢', label: { tr: 'Planlı',    en: 'Planned'     } },
      { id: 'balanced',    glyph: '◐', label: { tr: 'Dengeli',   en: 'Balanced'    } },
      { id: 'spontaneous', glyph: '◯', label: { tr: 'Spontane',  en: 'Spontaneous' } },
    ],
  },
];

// ────────────────────────────────────────────────────────────────────
// Pure UI helper — chip styles for both Web and Mobile (consistent).
// ────────────────────────────────────────────────────────────────────
function thyPrefChipStyle({ selected, dark }) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 16px',
    borderRadius: 999,
    border: selected
      ? '1.5px solid #B7312C'
      : (dark ? '1px solid rgba(255,255,255,0.18)' : '1px solid #E2E8F0'),
    background: selected
      ? (dark ? 'rgba(183,49,44,0.22)' : '#FDECEB')
      : (dark ? 'rgba(255,255,255,0.04)' : '#fff'),
    color: selected ? '#B7312C' : (dark ? '#E2E8F0' : '#0A1628'),
    fontFamily: 'var(--font-ui)', fontSize: 13.5, fontWeight: selected ? 700 : 500,
    cursor: 'pointer', userSelect: 'none',
    transition: 'all 180ms cubic-bezier(.4,0,.2,1)',
    boxShadow: selected ? '0 6px 14px rgba(183,49,44,0.18)' : 'none',
    whiteSpace: 'nowrap',
  };
}

// ────────────────────────────────────────────────────────────────────
// WEB SCREEN  — light, max-width 1100, sidebar header, sticky save bar
// ────────────────────────────────────────────────────────────────────
function WebTravelPrefsScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: false });
  const toast = useToast();
  const [draft, setDraft] = React.useState(() => thyLoadPrefs() || {
    speed: null, interests: [], budget: null,
    accommodation: [], travelerType: null, planFlex: null,
  });
  const isTR = u.lang === 'tr';

  const setOne   = (key, id)  => setDraft(d => ({ ...d, [key]: d[key] === id ? null : id }));
  const toggleMulti = (key, id) => setDraft(d => {
    const arr = Array.isArray(d[key]) ? d[key] : [];
    return { ...d, [key]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] };
  });

  const onSave = () => {
    thySavePrefs(draft);
    toast({ type: 'success', icon: '✓', children: isTR ? 'Seyahat tercihleriniz kaydedildi' : 'Travel preferences saved' });
    setTimeout(() => nav('profile'), 700);
  };

  const onClear = () => {
    setDraft({ speed: null, interests: [], budget: null, accommodation: [], travelerType: null, planFlex: null });
  };

  // Count how many categories the user has filled (for the header chip).
  const filledCount = THY_PREF_CATEGORIES.filter(c =>
    c.multi ? (draft[c.key] || []).length > 0 : !!draft[c.key]
  ).length;

  return (
    <PageShell style={{ position: 'relative', background: '#F8FAFC', minHeight: '100vh' }}>
      <WebTopNav active={null} onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} />

      {/* Hero band */}
      <HeroBand
        eyebrow={isTR ? 'TERCİHLER · NO 28' : 'PREFERENCES · NO 28'}
        title={isTR ? 'Seyahat Tercihleri' : 'Travel Preferences'}
        sub={isTR
          ? 'Rotalarınız ve hazır turlar bu tercihlere göre özelleştirilir. Her zaman güncelleyebilirsiniz.'
          : 'Your routes and prepared tours are tailored to these. You can update them anytime.'}
        accent={u.accent} height={210}
      >
        <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <ThyBadge variant="gold">✦ {filledCount} / {THY_PREF_CATEGORIES.length} {isTR ? 'kategori dolu' : 'categories set'}</ThyBadge>
          <ThyBadge variant="mono">aylin.kaya@example.com</ThyBadge>
        </div>
      </HeroBand>

      <div style={{ maxWidth: 1100, margin: '-28px auto 0', padding: '0 32px 140px' }}>
        <div style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16,
          boxShadow: '0 10px 30px rgba(10,22,40,0.06)',
          padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 36,
        }}>
          {THY_PREF_CATEGORIES.map((cat, idx) => (
            <section key={cat.key} style={{
              borderTop: idx > 0 ? '1px solid #F1F5F9' : 'none',
              paddingTop: idx > 0 ? 28 : 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 800,
                  color: '#C5A059', letterSpacing: 2,
                }}>{String(idx + 1).padStart(2, '0')}</span>
                <h3 style={{
                  margin: 0, fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800,
                  color: '#0A1628', letterSpacing: -0.3,
                }}>{cat.title[u.lang]}</h3>
                {cat.multi && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
                    background: '#0A162810', color: '#475569', padding: '2px 8px', borderRadius: 4,
                    letterSpacing: 1.5,
                  }}>{isTR ? 'ÇOKLU' : 'MULTI'}</span>
                )}
              </div>
              <p style={{ margin: '4px 0 16px', fontSize: 13, color: '#64748B' }}>
                {cat.desc[u.lang]}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {cat.options.map(opt => {
                  const selected = cat.multi
                    ? (draft[cat.key] || []).includes(opt.id)
                    : draft[cat.key] === opt.id;
                  return (
                    <button key={opt.id}
                      onClick={() => cat.multi ? toggleMulti(cat.key, opt.id) : setOne(cat.key, opt.id)}
                      style={thyPrefChipStyle({ selected, dark: false })}>
                      <span style={{ fontSize: 14 }}>{opt.glyph}</span>
                      <span>{opt.label[u.lang]}</span>
                      {opt.hint && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 10,
                          color: selected ? '#B7312C99' : '#94A3B8',
                          fontWeight: 600, letterSpacing: 0.5,
                        }}>· {opt.hint[u.lang]}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Sticky save bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(14px)',
        borderTop: '1px solid #E2E8F0',
        padding: '14px 32px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#64748B' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 800,
              background: filledCount === THY_PREF_CATEGORIES.length ? '#0E7A5F15' : '#C5A05915',
              color: filledCount === THY_PREF_CATEGORIES.length ? '#0E7A5F' : '#A07D2C',
              padding: '4px 9px', borderRadius: 4, letterSpacing: 1.5,
            }}>{filledCount} / {THY_PREF_CATEGORIES.length}</span>
            <span>{isTR ? 'kategori dolduruldu' : 'categories filled'}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClear} style={{
              padding: '12px 20px', border: '1px solid #E2E8F0', background: '#fff',
              borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              color: '#64748B', cursor: 'pointer',
            }}>{isTR ? 'Sıfırla' : 'Reset'}</button>
            <button onClick={() => nav('profile')} style={{
              padding: '12px 20px', border: '1px solid #E2E8F0', background: '#fff',
              borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              color: '#0A1628', cursor: 'pointer',
            }}>{isTR ? 'Vazgeç' : 'Cancel'}</button>
            <button onClick={onSave} style={{
              padding: '12px 24px', border: 'none', background: '#B7312C',
              borderRadius: 10, fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
              color: '#fff', cursor: 'pointer',
              boxShadow: '0 6px 14px rgba(183,49,44,0.32)',
            }}>{isTR ? 'Kaydet →' : 'Save →'}</button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// MOBILE SCREEN — full-height, top app bar, scrollable, sticky save bar
// ────────────────────────────────────────────────────────────────────
function TravelPrefsScreen({ t, nav, k }) {
  const u = useThyTweaks(t, { dark: false });
  const topPad = k === 'ios' ? 50 : 16;
  const toast = useToast();
  const [draft, setDraft] = React.useState(() => thyLoadPrefs() || {
    speed: null, interests: [], budget: null,
    accommodation: [], travelerType: null, planFlex: null,
  });
  const isTR = u.lang === 'tr';

  const setOne      = (key, id) => setDraft(d => ({ ...d, [key]: d[key] === id ? null : id }));
  const toggleMulti = (key, id) => setDraft(d => {
    const arr = Array.isArray(d[key]) ? d[key] : [];
    return { ...d, [key]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] };
  });

  const onSave = () => {
    thySavePrefs(draft);
    toast({ type: 'success', icon: '✓', children: isTR ? 'Tercihler kaydedildi' : 'Preferences saved' });
    setTimeout(() => nav('profile'), 700);
  };

  const filledCount = THY_PREF_CATEGORIES.filter(c =>
    c.multi ? (draft[c.key] || []).length > 0 : !!draft[c.key]
  ).length;

  return (
    <div className="thy-screen screen-enter" style={{
      position: 'relative', minHeight: '100%', background: '#F3F5F8', fontFamily: u.font,
      display: 'flex', flexDirection: 'column', paddingBottom: 84,
    }}>
      {/* Header */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0A1628 0%, #0F2244 80%, #1B3868 100%)',
        padding: `${topPad}px 16px 24px`, color: '#fff',
      }}>
        <RouteMapBg opacity={0.08} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => nav('profile')} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10, padding: '8px 12px', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
          }}><Icon name="arrowL" size={13} /> {isTR ? 'Profil' : 'Profile'}</button>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 800,
            background: 'rgba(197,160,89,0.18)', border: '1px solid rgba(197,160,89,0.45)',
            color: '#F4D589', padding: '4px 9px', borderRadius: 4, letterSpacing: 1.5,
          }}>{filledCount} / {THY_PREF_CATEGORIES.length}</span>
        </div>
        <div style={{ position: 'relative', marginTop: 20 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 800,
            color: '#C5A059', letterSpacing: 3 }}>
            {isTR ? '✦ TERCİHLER ✦' : '✦ PREFERENCES ✦'}
          </div>
          <h1 style={{ margin: '6px 0 4px', fontFamily: 'var(--font-heading)', fontWeight: 800,
            fontSize: 28, letterSpacing: -0.5, lineHeight: 1.1 }}>
            {isTR ? 'Seyahat Tercihleri' : 'Travel Preferences'}
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#B2C0D1', lineHeight: 1.45 }}>
            {isTR
              ? 'Rotalarınız bu tercihlere göre özelleştirilir.'
              : 'Your routes are tailored to these preferences.'}
          </p>
        </div>
      </div>

      {/* Scrollable form */}
      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {THY_PREF_CATEGORIES.map((cat, idx) => (
          <section key={cat.key} style={{
            background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
            padding: '18px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 800,
                color: '#C5A059', letterSpacing: 2,
              }}>{String(idx + 1).padStart(2, '0')}</span>
              <h3 style={{
                margin: 0, fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 800,
                color: '#0A1628', letterSpacing: -0.2, flex: 1,
              }}>{cat.title[u.lang]}</h3>
              {cat.multi && (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700,
                  background: '#0A162810', color: '#475569', padding: '2px 7px', borderRadius: 4,
                  letterSpacing: 1.5,
                }}>{isTR ? 'ÇOKLU' : 'MULTI'}</span>
              )}
            </div>
            <p style={{ margin: '2px 0 12px', fontSize: 11.5, color: '#64748B', lineHeight: 1.4 }}>
              {cat.desc[u.lang]}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {cat.options.map(opt => {
                const selected = cat.multi
                  ? (draft[cat.key] || []).includes(opt.id)
                  : draft[cat.key] === opt.id;
                return (
                  <button key={opt.id}
                    onClick={() => cat.multi ? toggleMulti(cat.key, opt.id) : setOne(cat.key, opt.id)}
                    style={{
                      ...thyPrefChipStyle({ selected, dark: false }),
                      padding: '8px 12px', fontSize: 12.5,
                    }}>
                    <span style={{ fontSize: 13 }}>{opt.glyph}</span>
                    <span>{opt.label[u.lang]}</span>
                    {opt.hint && (
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9,
                        color: selected ? '#B7312C99' : '#94A3B8',
                        fontWeight: 600,
                      }}>· {opt.hint[u.lang]}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        <div style={{ height: 16 }} />
      </div>

      {/* Sticky save bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(14px)',
        borderTop: '1px solid #E2E8F0', padding: '12px 16px',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <button onClick={() => nav('profile')} style={{
          padding: '12px 16px', border: '1px solid #E2E8F0', background: '#fff',
          borderRadius: 10, fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
          color: '#64748B', cursor: 'pointer',
        }}>{isTR ? 'Vazgeç' : 'Cancel'}</button>
        <button onClick={onSave} style={{
          flex: 1, padding: '12px 16px', border: 'none', background: '#B7312C',
          borderRadius: 10, fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
          color: '#fff', cursor: 'pointer',
          boxShadow: '0 6px 14px rgba(183,49,44,0.32)',
        }}>{isTR ? 'Tercihleri kaydet →' : 'Save preferences →'}</button>
      </div>
    </div>
  );
}

// Tiny inline badge component reused by Map screens to show "✦ Tercihlerinize göre"
function TravelPrefsBadge({ lang, dark, onClick }) {
  const isTR = lang === 'tr';
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px',
      background: dark
        ? 'linear-gradient(135deg, rgba(197,160,89,0.16), rgba(183,49,44,0.16))'
        : 'linear-gradient(135deg, rgba(197,160,89,0.18), rgba(183,49,44,0.14))',
      border: '1px solid rgba(197,160,89,0.55)',
      color: dark ? '#F4D589' : '#A07D2C',
      fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 800, letterSpacing: 1.8,
      borderRadius: 4, cursor: onClick ? 'pointer' : 'default',
    }}>
      <span style={{ fontSize: 11 }}>✦</span>
      <span>{isTR ? 'TERCİHLERİNİZE GÖRE' : 'PER YOUR PREFS'}</span>
    </button>
  );
}

// Export to window so other scripts (web-main, main, screen files) can use them
Object.assign(window, {
  thyLoadPrefs, thySavePrefs, thyHasPrefs, useTravelPrefs,
  THY_PREF_CATEGORIES, thyPrefChipStyle,
  WebTravelPrefsScreen, TravelPrefsScreen, TravelPrefsBadge,
});
