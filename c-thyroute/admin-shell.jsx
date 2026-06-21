// admin-shell.jsx — top bar, side nav, and the section pipeline that builds
// the THY Route Executive Cockpit. Mount: <ExecutiveDashboard />.

function ExecutiveDashboard() {
  const [lang, setLang] = React.useState(() => {
    try { return localStorage.getItem('thyAdminLang') || 'tr'; } catch (e) { return 'tr'; }
  });
  React.useEffect(() => {
    try { localStorage.setItem('thyAdminLang', lang); } catch (e) {}
  }, [lang]);

  const copy = ADMIN_COPY[lang];
  const [activeSec, setActiveSec] = React.useState('overview');

  // Scrollspy
  React.useEffect(() => {
    const ids = ['overview','intent','loyalty','partner','marketing','ms','layover','tkpay','ai'];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id.replace('sec-', '');
          setActiveSec(id);
        }
      });
    }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });
    ids.forEach(id => {
      const el = document.getElementById('sec-' + id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  function go(secId) {
    const el = document.getElementById('sec-' + secId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  const now = new Date();
  const ts = now.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div style={{
      minHeight: '100vh', position: 'relative',
      background: `
        radial-gradient(110% 70% at 0% 0%, rgba(183,49,44,0.10) 0%, transparent 55%),
        radial-gradient(110% 70% at 100% 100%, rgba(197,160,89,0.10) 0%, transparent 55%),
        linear-gradient(180deg, #050B14 0%, #0A1628 100%)
      `,
      color: '#fff',
      fontFamily: 'var(--font-ui, "Outfit", system-ui, sans-serif)',
    }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 60,
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        background: 'rgba(10,22,40,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.085)',
      }}>
        <div style={{
          maxWidth: 1480, margin: '0 auto', padding: '14px 28px',
          display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #EF2E1F, #B7312C)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(183,49,44,0.4)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1L15 22v-1.5L13 19v-5.5L21 16z" />
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{
                  fontFamily: 'var(--font-heading, Montserrat)', fontWeight: 900, fontSize: 17,
                  color: '#fff', letterSpacing: 0.4, textTransform: 'uppercase',
                }}>{copy.appName}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, color: '#C5A059',
                  letterSpacing: 2.4, fontWeight: 800,
                }}>· {copy.panel}</span>
              </div>
              <div style={{ fontSize: 11, color: '#7A8EAF', marginTop: 1, letterSpacing: 0.2 }}>
                {copy.subtitle}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              padding: '6px 12px', borderRadius: 999, fontSize: 10, fontWeight: 800,
              color: '#C5A059', background: 'rgba(197,160,89,0.10)',
              border: '1px solid rgba(197,160,89,0.32)',
              fontFamily: 'var(--font-mono)', letterSpacing: 1.5,
            }}>{copy.range}</span>
            <LiveDot>{copy.badge}</LiveDot>
            <span style={{
              fontSize: 11, color: '#7A8EAF', fontFamily: 'var(--font-mono)', letterSpacing: 0.3,
              padding: '6px 10px', borderLeft: '1px solid rgba(255,255,255,0.1)',
            }}>{copy.asOf}: <span style={{ color: '#fff' }}>{ts}</span></span>

            <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.12)', margin: '0 4px' }} />

            <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} style={{
              padding: '7px 12px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
              fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 11, letterSpacing: 0.5,
            }}>{lang === 'tr' ? 'TR · EN' : 'EN · TR'}</button>

            <button onClick={() => window.print()} style={{
              padding: '7px 14px', cursor: 'pointer',
              background: 'linear-gradient(135deg, #E8C97A, #C5A059)',
              color: '#0A1628', border: 'none', borderRadius: 8,
              fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 11.5, letterSpacing: 0.3,
              boxShadow: '0 4px 12px rgba(197,160,89,0.32)',
            }}>{copy.actions.pdf} ↓</button>
          </div>
        </div>
      </header>

      {/* Sidebar + main */}
      <div style={{
        maxWidth: 1480, margin: '0 auto', padding: '24px 28px 80px',
        display: 'grid', gridTemplateColumns: '200px 1fr', gap: 28,
      }}>
        {/* Side nav */}
        <aside style={{
          position: 'sticky', top: 88, alignSelf: 'flex-start',
          maxHeight: 'calc(100vh - 100px)', overflowY: 'auto',
        }}>
          <div style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 2.4, color: '#7A8EAF',
            marginBottom: 12, paddingLeft: 6,
          }}>{lang === 'tr' ? 'BÖLÜMLER' : 'SECTIONS'}</div>
          {Object.keys(copy.sections).map((k, i) => {
            const on = activeSec === k;
            return (
              <button key={k} onClick={() => go(k)} style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '9px 12px', marginBottom: 4, cursor: 'pointer',
                background: on ? 'rgba(197,160,89,0.12)' : 'transparent',
                border: '1px solid ' + (on ? 'rgba(197,160,89,0.45)' : 'transparent'),
                borderRadius: 10, color: on ? '#fff' : '#B2C0D1',
                fontFamily: 'inherit', fontWeight: on ? 800 : 600, fontSize: 12.5,
                textAlign: 'left', letterSpacing: 0.1,
                transition: 'all 200ms cubic-bezier(.16,1,.3,1)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 800,
                  color: on ? '#C5A059' : '#7A8EAF', letterSpacing: 0.4,
                }}>{String(i+1).padStart(2,'0')}</span>
                <span style={{ flex: 1 }}>{copy.sections[k]}</span>
                {on && <span style={{ color: '#C5A059' }}>→</span>}
              </button>
            );
          })}
        </aside>

        {/* Main */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
          <OverviewSection  copy={copy} lang={lang} />
          <IntentSection    copy={copy} lang={lang} />
          <LoyaltySection   copy={copy} lang={lang} />
          <PartnerSection   copy={copy} lang={lang} />
          <MarketingSection copy={copy} lang={lang} />
          <MsSection        copy={copy} lang={lang} />
          <LayoverSection   copy={copy} lang={lang} />
          <TkpaySection     copy={copy} lang={lang} />
          <AiSection        copy={copy} lang={lang} />

          <footer style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)',
            fontSize: 11, color: '#7A8EAF',
          }}>
            <span style={{ letterSpacing: 0.3 }}>
              THY Route · {copy.subtitle} · {copy.range}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: 0.4 }}>
              Mock data · pitch v1.0
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

const __admin_root = ReactDOM.createRoot(document.getElementById('root'));
__admin_root.render(<ExecutiveDashboard />);
