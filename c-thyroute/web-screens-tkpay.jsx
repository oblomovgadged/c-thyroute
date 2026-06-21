// web-screens-tkpay.jsx — Screen 23: TKPAY (web)
//
// "Ödemenin İyi / Kolay / Avantajlı Yolu" — Türk Hava Yolları'nın TKPAY
// (tkpay.com) cüzdanını THY Route web sürümünün içine bir landing-vari
// sayfa olarak gömüyoruz. İki segment (Bireysel / Ticari) üzerinden döner:
// Bireysel'de sanal kart + Mil→TL dönüştürücü + son işlemler; Ticari'de
// Sanal POS başvurusu + komisyon tablosu + canlı işlem panosu.
//
// Mobildeki TKPayScreen'in dezimore web karşılığı (1280px kanvası kullanıyor).

function WebTKPayScreen({ t, nav }) {
  const u = useThyTweaks(t, { dark: true });
  const toast = useToast();
  const [segment, setSegment] = React.useState('individual');

  // Döner başlık
  const taglines = u.lang === 'tr'
    ? ['İYİ YOLU', 'KOLAY YOLU', 'AVANTAJLI YOLU']
    : ['SMART WAY', 'EASY WAY', 'REWARDING WAY'];
  const [tagIx, setTagIx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTagIx(i => (i + 1) % taglines.length), 2400);
    return () => clearInterval(id);
  }, [taglines.length]);

  const totalMiles = 12580;
  const convertedTL = Math.round(totalMiles * 0.15);
  const fmtTL = (n) => n.toLocaleString('tr-TR');

  return (
    <PageShell dark style={{
      background: 'linear-gradient(180deg, #050B14 0%, #0A1628 38%, #0F2244 100%)',
    }}>
      <WebTopNav active="tkpay" onNavigate={nav} t={t} accent={u.accent} c={u.c} lang={u.lang} dark />
      <RouteMapBg opacity={0.05} />

      {/* ───── Hero ───── */}
      <section style={{
        position: 'relative', maxWidth: 1280, margin: '0 auto',
        padding: '48px 32px 16px',
        display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 56, alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
            <span style={{
              fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 24,
              color: '#fff', letterSpacing: 3,
            }}>TKPAY</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, color: '#C5A059',
              letterSpacing: 2.5, fontWeight: 800,
            }}>· {u.lang === 'tr' ? 'CÜZDAN & ÖDEME' : 'WALLET & PAYMENTS'}</span>
          </div>

          <div style={{
            fontSize: 11, fontWeight: 800, letterSpacing: 3, color: '#7A8EAF',
            textTransform: 'uppercase', marginBottom: 6,
          }}>
            {u.lang === 'tr' ? 'ÖDEMENİN' : 'PAYMENT,'}
          </div>
          <h1 key={tagIx} style={{
            fontFamily: 'var(--font-heading)', fontWeight: 900,
            fontSize: 88, lineHeight: 0.98, letterSpacing: -2.5, margin: 0,
            background: 'linear-gradient(95deg, #F2D78B 0%, #E8C97A 35%, #C5A059 70%, #A0813C 100%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            animation: 'thy-fadeUp .55s cubic-bezier(.16,1,.3,1)',
          }}>{taglines[tagIx]}</h1>

          <p style={{
            color: '#B2C0D1', fontSize: 16, lineHeight: 1.6,
            maxWidth: 540, margin: '24px 0 32px',
          }}>
            {u.lang === 'tr'
              ? 'Bireysel kullanıcılar için akıllı dijital cüzdan; işletmeler için avantajlı komisyon oranları ile güçlü ödeme altyapısı — tüm finansal işlemlerinizi Türk Hava Yolları güvencesiyle tek bir platformdan yönetin.'
              : 'A smart digital wallet for individuals and a powerful payment infrastructure with attractive commission rates for businesses — manage all your financial flows under the Turkish Airlines guarantee, in one place.'}
          </p>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={() => toast({ type: 'success', icon: '✓', children: u.lang === 'tr' ? 'Cüzdan başvurun alındı' : 'Wallet request received' })} style={{
              padding: '14px 22px', cursor: 'pointer',
              background: 'linear-gradient(135deg, #E8C97A, #C5A059)',
              color: '#0A1628', border: 'none', borderRadius: 10,
              fontFamily: u.font, fontWeight: 800, fontSize: 13,
              letterSpacing: 0.3, boxShadow: '0 8px 24px rgba(197,160,89,0.4)',
            }}>{u.lang === 'tr' ? 'Cüzdan Oluştur' : 'Create Wallet'} →</button>
            <button onClick={() => setSegment('business')} style={{
              padding: '14px 20px', cursor: 'pointer',
              background: 'transparent',
              color: '#fff', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 10,
              fontFamily: u.font, fontWeight: 700, fontSize: 13,
            }}>{u.lang === 'tr' ? 'Sanal POS Başvurusu' : 'Apply for Virtual POS'}</button>
          </div>

          {/* TCMB strip */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginTop: 32, padding: '8px 14px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.085)',
            borderRadius: 999, fontSize: 11, color: '#B2C0D1',
          }}>
            <Icon name="shield" size={13} color="#C5A059" />
            {u.lang === 'tr'
              ? 'TCMB yetkili · Elektronik Para ve Ödeme Hizmetleri Kuruluşu'
              : 'CBRT authorized · Electronic Money Institution'}
          </div>
        </div>

        {/* Hero card — büyük TKPAY virtual card */}
        <div style={{ position: 'relative' }}>
          <TKPayCardLarge segment={segment} u={u} fmtTL={fmtTL} />
          {/* Floating chip — Mil → TL */}
          <div style={{
            position: 'absolute', bottom: -32, left: -28,
            padding: '14px 18px', borderRadius: 14, color: '#0A1628',
            background: 'linear-gradient(135deg, #F2D78B, #C5A059)',
            boxShadow: '0 18px 40px rgba(197,160,89,0.45)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'rgba(10,22,40,0.16)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#0A1628',
            }}>
              <Icon name="sparkles" size={18} strokeWidth={2.5} />
            </span>
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2 }}>
                {u.lang === 'tr' ? 'MİL → TL' : 'MILES → TL'}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 800, marginTop: 2 }}>
                {fmtTL(totalMiles)} mi → {fmtTL(convertedTL)} TL
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Segment switcher ───── */}
      <section style={{ maxWidth: 1280, margin: '64px auto 0', padding: '0 32px' }}>
        <div style={{
          display: 'inline-grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: 5,
          background: 'rgba(255,255,255,0.045)',
          border: '1px solid rgba(255,255,255,0.085)',
          borderRadius: 14,
        }}>
          {[
            { id: 'individual', tr: 'Bireysel', en: 'Individual', sub: { tr: 'Cüzdan + Sanal Kart', en: 'Wallet + Virtual Card' } },
            { id: 'business',   tr: 'Ticari',   en: 'Business',   sub: { tr: 'Sanal POS + Komisyon', en: 'Virtual POS + Rates' } },
          ].map(seg => {
            const on = segment === seg.id;
            return (
              <button key={seg.id} onClick={() => setSegment(seg.id)} style={{
                padding: '12px 22px', cursor: 'pointer', textAlign: 'left',
                background: on ? 'linear-gradient(135deg, #C5A059, #A0813C)' : 'transparent',
                border: 'none', borderRadius: 10, minWidth: 220,
                color: on ? '#0A1628' : '#B2C0D1',
                fontFamily: u.font,
                boxShadow: on ? '0 6px 18px rgba(197,160,89,0.35)' : 'none',
                transition: 'all 250ms cubic-bezier(.16,1,.3,1)',
              }}>
                <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.2 }}>
                  {u.lang === 'tr' ? seg.tr : seg.en}
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 600, opacity: on ? 0.78 : 0.7, marginTop: 1 }}>
                  {u.lang === 'tr' ? seg.sub.tr : seg.sub.en}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ───── Segment content ───── */}
      <section style={{ maxWidth: 1280, margin: '28px auto 0', padding: '0 32px' }}>
        {segment === 'individual'
          ? <IndividualPanel u={u} nav={nav} toast={toast} fmtTL={fmtTL} totalMiles={totalMiles} convertedTL={convertedTL} />
          : <BusinessPanel u={u} nav={nav} toast={toast} fmtTL={fmtTL} />}
      </section>

      {/* ───── Partner brands ───── */}
      <section style={{ maxWidth: 1280, margin: '64px auto 0', padding: '0 32px' }}>
        <SectionTitle
          eyebrow={u.lang === 'tr' ? 'ANLAŞMALI MARKALAR' : 'PARTNER BRANDS'}
          title={u.lang === 'tr' ? 'TKPAY ile her harcamada avantaj' : 'Earn on every spend with TKPAY'}
          accent={u.accent} dark
        />
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12,
          marginTop: 18,
        }}>
          {[
            { n: 'Migros',     d: '%5',  t: u.lang === 'tr' ? 'iade' : 'cashback' },
            { n: 'Shell',      d: '%8',  t: u.lang === 'tr' ? 'akaryakıt' : 'fuel' },
            { n: 'D&R',        d: '%10', t: u.lang === 'tr' ? 'iade' : 'cashback' },
            { n: 'Vodafone',   d: '+250',t: 'mil' },
            { n: 'MediaMarkt', d: '%6',  t: u.lang === 'tr' ? 'iade' : 'cashback' },
            { n: 'BIM',        d: '%4',  t: u.lang === 'tr' ? 'iade' : 'cashback' },
            { n: 'Trendyol',   d: '%3',  t: u.lang === 'tr' ? 'iade' : 'cashback' },
            { n: 'Boyner',     d: '+150',t: 'mil' },
            { n: 'Mavi',       d: '%8',  t: u.lang === 'tr' ? 'iade' : 'cashback' },
            { n: 'IKEA',       d: '%5',  t: u.lang === 'tr' ? 'iade' : 'cashback' },
            { n: 'Starbucks',  d: '+25', t: 'mil' },
            { n: 'Decathlon',  d: '%6',  t: u.lang === 'tr' ? 'iade' : 'cashback' },
          ].map(b => (
            <div key={b.n} style={{
              padding: '18px 12px', borderRadius: 12,
              background: 'rgba(255,255,255,0.045)',
              border: '1px solid rgba(255,255,255,0.085)',
              textAlign: 'center', transition: 'all 220ms cubic-bezier(.16,1,.3,1)',
            }}>
              <div style={{
                width: 40, height: 40, margin: '0 auto', borderRadius: 10,
                background: 'rgba(197,160,89,0.14)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: '#C5A059', fontSize: 17, fontWeight: 800, fontFamily: u.font,
              }}>{b.n[0]}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginTop: 10 }}>{b.n}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#C5A059',
                marginTop: 2, letterSpacing: 0.4, fontWeight: 700,
              }}>{b.d} {b.t}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Nasıl çalışır (3 adım) ───── */}
      <section style={{ maxWidth: 1280, margin: '72px auto 0', padding: '0 32px' }}>
        <SectionTitle
          eyebrow={u.lang === 'tr' ? '3 ADIMDA' : 'IN 3 STEPS'}
          title={u.lang === 'tr' ? 'TKPAY Cüzdan nasıl oluşturulur?' : 'How to set up TKPAY Wallet'}
          accent={u.accent} dark
        />
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 18,
        }}>
          {[
            {
              n: '01', icon: 'user',
              t: u.lang === 'tr' ? 'Miles&Smiles ile giriş' : 'Sign in with Miles&Smiles',
              b: u.lang === 'tr'
                ? 'Türk Hava Yolları uygulamasına Miles&Smiles üyeliğinizle giriş yapın, ana menüden TKPAY Cüzdan bölümüne geçin.'
                : 'Sign into the Turkish Airlines app with your Miles&Smiles ID, then open the TKPAY Wallet section from the menu.',
            },
            {
              n: '02', icon: 'shield',
              t: u.lang === 'tr' ? 'Cüzdanınızı oluşturun' : 'Create your wallet',
              b: u.lang === 'tr'
                ? 'TKPAY\'in tüm avantajlarından yararlanmak için kimlik doğrulama adımlarını tamamlayarak cüzdanınızı yükseltin.'
                : 'Complete identity verification to upgrade your wallet and unlock every TKPAY benefit.',
            },
            {
              n: '03', icon: 'sparkles',
              t: u.lang === 'tr' ? 'Kullanmaya başlayın' : 'Start using it',
              b: u.lang === 'tr'
                ? 'Cüzdanınıza bakiye yükleyin, TKPAY kartınızla ödeme yapın. Anlaşmalı markalardaki özel avantajlardan yararlanın.'
                : 'Top up your balance, pay with your TKPAY card, and enjoy partner brand perks.',
            },
          ].map(step => (
            <div key={step.n} style={{
              padding: 22, borderRadius: 14,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.085)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -10, right: -8,
                fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 120,
                color: 'rgba(197,160,89,0.06)', lineHeight: 1, letterSpacing: -4,
              }}>{step.n}</div>
              <div style={{ position: 'relative' }}>
                <span style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(197,160,89,0.14)',
                  border: '1px solid rgba(197,160,89,0.32)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: '#C5A059',
                }}>
                  <Icon name={step.icon} size={22} strokeWidth={2.25} />
                </span>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 800,
                  letterSpacing: 2, color: '#C5A059', marginTop: 16,
                }}>ADIM {step.n}</div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 19,
                  color: '#fff', letterSpacing: -0.3, margin: '4px 0 10px',
                }}>{step.t}</h3>
                <p style={{
                  fontSize: 13, color: '#B2C0D1', lineHeight: 1.55, margin: 0,
                }}>{step.b}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── App download CTA ───── */}
      <section style={{ maxWidth: 1280, margin: '72px auto 0', padding: '0 32px' }}>
        <div style={{
          padding: '40px 44px', borderRadius: 18,
          background: `
            radial-gradient(120% 80% at 0% 0%, rgba(197,160,89,0.16) 0%, transparent 55%),
            linear-gradient(135deg, #0F2244 0%, #0A1628 50%, #050B14 100%)
          `,
          border: '1px solid rgba(197,160,89,0.25)',
          boxShadow: '0 18px 50px rgba(0,0,0,0.5)',
          display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 800,
              letterSpacing: 2.5, color: '#C5A059',
            }}>{u.lang === 'tr' ? 'MOBİL UYGULAMA' : 'MOBILE APP'}</div>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 32,
              color: '#fff', letterSpacing: -0.6, margin: '8px 0 10px',
            }}>{u.lang === 'tr' ? 'Turkish Airlines uygulamasını indirin' : 'Download the Turkish Airlines app'}</h2>
            <p style={{ fontSize: 14, color: '#B2C0D1', maxWidth: 480, margin: 0, lineHeight: 1.6 }}>
              {u.lang === 'tr'
                ? 'TKPAY Cüzdanınızı oluşturarak hemen kullanmaya başlayın. Mil → TL dönüştürmek, anlaşmalı markalarda harcamak ve sanal kart üretmek için.'
                : 'Set up your TKPAY Wallet and start using it instantly — convert miles to TL, spend with partners, and issue virtual cards.'}
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {[
                { l1: u.lang === 'tr' ? 'Şuradan indir' : 'Download on',  l2: 'App Store',     ic: '' },
                { l1: u.lang === 'tr' ? 'Şuradan indir' : 'Get it on',    l2: 'Google Play',   ic: '▶' },
              ].map(s => (
                <button key={s.l2} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 16px', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 10, color: '#fff', fontFamily: u.font,
                }}>
                  <span style={{ fontSize: 18, color: '#C5A059' }}>{s.ic || '◉'}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 9, opacity: 0.7, letterSpacing: 0.5 }}>{s.l1}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.2 }}>{s.l2}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {/* faux QR */}
            <div style={{
              width: 160, height: 160, borderRadius: 16, padding: 14,
              background: '#fff',
              boxShadow: '0 18px 40px rgba(0,0,0,0.4)',
              display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)',
              gap: 2,
            }}>
              {Array.from({ length: 121 }).map((_, i) => {
                // pseudo-random pattern (deterministic)
                const v = (i * 7 + ((i / 11) | 0) * 13) % 5;
                const filled = v < 2 || i % 11 === 0 || i % 11 === 10 || (i < 11) || (i > 109);
                const corner =
                  (i < 33 && i % 11 < 3) ||
                  (i < 33 && i % 11 > 7) ||
                  (i > 87 && i % 11 < 3);
                return <span key={i} style={{
                  background: corner || filled ? '#0A1628' : 'transparent',
                  borderRadius: 1,
                }} />;
              })}
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 64 }} />
      <WebFooter lang={u.lang} accent={u.accent} />
    </PageShell>
  );
}

// ── Large hero TKPAY card ──────────────────────────────────
function TKPayCardLarge({ segment, u, fmtTL }) {
  const segLabel = segment === 'business'
    ? (u.lang === 'tr' ? 'TİCARİ' : 'BUSINESS')
    : (u.lang === 'tr' ? 'BİREYSEL' : 'INDIVIDUAL');
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      padding: '32px 32px 28px', borderRadius: 22,
      color: '#fff',
      background: `
        radial-gradient(120% 80% at 0% 0%, rgba(197,160,89,0.32) 0%, transparent 55%),
        radial-gradient(110% 70% at 100% 100%, rgba(183,49,44,0.28) 0%, transparent 60%),
        linear-gradient(135deg, #0F2244 0%, #0A1628 45%, #050B14 100%)
      `,
      border: '1px solid rgba(197,160,89,0.4)',
      boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 32px rgba(197,160,89,0.18), 0 1px 0 rgba(255,255,255,0.08) inset',
      transform: 'rotate(-1deg)',
    }}>
      {/* contactless icon */}
      <div aria-hidden style={{
        position: 'absolute', top: 28, right: 28, color: '#C5A059', opacity: 0.9,
        transform: 'rotate(90deg)',
      }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 8a10 10 0 0 1 14 0" />
          <path d="M8 11a6 6 0 0 1 8 0" />
          <path d="M11 14a2 2 0 0 1 2 0" />
        </svg>
      </div>

      {/* shimmer band */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, bottom: 0, left: '-30%', width: '35%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
        transform: 'skewX(-22deg)',
      }} />

      <div style={{ position: 'relative' }}>
        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 3, color: '#C5A059',
        }}>TKPAY · {segLabel}</div>

        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#7A8EAF',
          textTransform: 'uppercase', marginTop: 32,
        }}>{u.lang === 'tr' ? 'BAKİYE' : 'BALANCE'}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 52, fontWeight: 800,
            letterSpacing: -1.2, lineHeight: 1, color: '#fff',
          }}>4.218,75</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700,
            color: '#C5A059', letterSpacing: 0.5,
          }}>TL</span>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginTop: 40, gap: 16,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 18, color: '#B2C0D1',
              letterSpacing: 3, marginBottom: 8,
            }}>5188 ····  ····  4218</div>
            <div style={{
              fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 17,
              color: '#fff', letterSpacing: 0.5, textTransform: 'uppercase',
            }}>Aylin Kaya</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: '#7A8EAF',
            }}>MILES&SMILES</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 800,
              color: '#C5A059', marginTop: 4, letterSpacing: 0.5,
            }}>TK · ELITE+</div>
            <div style={{
              fontSize: 10, color: '#7A8EAF', marginTop: 2, fontFamily: 'var(--font-mono)',
            }}>12/28</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Bireysel panel — wallet, miles converter, transactions
// ───────────────────────────────────────────────────────────
function IndividualPanel({ u, nav, toast, fmtTL, totalMiles, convertedTL }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
      {/* Sol kolon */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Mil → TL converter */}
        <div style={{
          padding: '22px 24px', borderRadius: 14,
          background: `
            linear-gradient(135deg, rgba(197,160,89,0.16) 0%, rgba(197,160,89,0.04) 70%),
            rgba(255,255,255,0.045)
          `,
          border: '1px solid rgba(197,160,89,0.4)',
          boxShadow: '0 0 22px rgba(197,160,89,0.16)',
          display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 18, alignItems: 'center',
        }}>
          <span style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, #F2D78B, #C5A059)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#0A1628', flexShrink: 0,
            boxShadow: '0 8px 20px rgba(197,160,89,0.4)',
          }}>
            <Icon name="sparkles" size={26} strokeWidth={2.5} />
          </span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#C5A059' }}>
              {u.lang === 'tr' ? 'MİL → TL DÖNÜŞTÜRÜCÜ' : 'MILES → TL CONVERTER'}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 22,
              color: '#fff', letterSpacing: -0.3, marginTop: 4,
            }}>{u.lang === 'tr' ? 'Millerini TL\'ye dönüştür' : 'Convert your miles to TL'}</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 13, color: '#B2C0D1',
              marginTop: 4, letterSpacing: 0.3,
            }}>
              {fmtTL(totalMiles)} mil ≈ <span style={{ color: '#C5A059', fontWeight: 700 }}>{fmtTL(convertedTL)} TL</span> · 1 mi ≈ 0,15 TL
            </div>
          </div>
          <button onClick={() => toast({ type: 'success', icon: '✓', children: u.lang === 'tr' ? `${fmtTL(convertedTL)} TL cüzdanına yüklendi` : `${fmtTL(convertedTL)} TL loaded to wallet` })} style={{
            padding: '14px 22px', cursor: 'pointer',
            background: 'linear-gradient(135deg, #E8C97A, #C5A059)',
            color: '#0A1628', border: 'none', borderRadius: 12,
            fontFamily: u.font, fontWeight: 800, fontSize: 13, letterSpacing: 0.3,
            boxShadow: '0 6px 18px rgba(197,160,89,0.45)', flexShrink: 0,
          }}>{u.lang === 'tr' ? 'Hemen Dönüştür' : 'Convert now'} →</button>
        </div>

        {/* Hızlı aksiyonlar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { id: 'topup', icon: 'plus',     tr: 'Yükle',  en: 'Top up' },
            { id: 'send',  icon: 'arrowR',   tr: 'Gönder', en: 'Send' },
            { id: 'pay',   icon: 'cardIcon', tr: 'Öde',    en: 'Pay' },
            { id: 'scan',  icon: 'qr',       tr: 'QR Tara',en: 'Scan QR' },
          ].map(a => (
            <button key={a.id} onClick={() => {
              toast({ type: 'success', icon: '✓', children: u.lang === 'tr' ? `${a.tr} hazırlanıyor` : `${a.en} ready` });
            }} style={{
              padding: '18px 12px', borderRadius: 12, cursor: 'pointer',
              background: 'rgba(255,255,255,0.045)',
              border: '1px solid rgba(255,255,255,0.085)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              color: '#fff', fontFamily: u.font,
              transition: 'all 220ms cubic-bezier(.16,1,.3,1)',
            }}>
              <span style={{
                width: 40, height: 40, borderRadius: 11,
                background: 'rgba(197,160,89,0.14)',
                border: '1px solid rgba(197,160,89,0.32)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: '#C5A059',
              }}>
                <Icon name={a.icon} size={18} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#B2C0D1' }}>
                {u.lang === 'tr' ? a.tr : a.en}
              </span>
            </button>
          ))}
        </div>

        {/* Son işlemler */}
        <div style={{
          padding: '20px 22px', borderRadius: 14,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.085)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#C5A059' }}>
              {u.lang === 'tr' ? 'SON İŞLEMLER' : 'RECENT TRANSACTIONS'}
            </div>
            <span style={{ fontSize: 11, color: '#7A8EAF', fontFamily: 'var(--font-mono)' }}>
              {u.lang === 'tr' ? 'son 7 gün' : 'last 7 days'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { ic: 'plane',    tint: '#1E6FCB', t: 'TK 1853 · IST → FCO',                                        s: u.lang === 'tr' ? 'Uçuş ödemesi · 14:25'  : 'Flight payment · 14:25',  v: -2480, d: u.lang === 'tr' ? 'Bugün' : 'Today' },
              { ic: 'coffee',   tint: '#C5A059', t: 'Starbucks · IST',                                           s: u.lang === 'tr' ? 'Anlaşmalı · +35 mil' : 'Partner · +35 mi',        v: -127,  d: u.lang === 'tr' ? 'Bugün' : 'Today' },
              { ic: 'plus',     tint: '#22C55E', t: u.lang === 'tr' ? 'Cüzdana yükleme' : 'Wallet top-up',         s: 'Garanti BBVA · 1234',                                            v: 2000,  d: u.lang === 'tr' ? 'Dün'   : 'Yesterday' },
              { ic: 'bed',      tint: '#C5A059', t: 'Hilton Rome',                                                s: u.lang === 'tr' ? 'Partner · +500 mil' : 'Partner · +500 mi',       v: -3140, d: '14 Haz' },
              { ic: 'sparkles', tint: '#C5A059', t: u.lang === 'tr' ? 'Mil → TL dönüşümü' : 'Miles → TL convert',  s: '4.500 mi → 675 TL',                                              v: 675,   d: '12 Haz' },
            ].map((tx, i, a) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
                borderBottom: i < a.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <span style={{
                  width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                  background: `${tx.tint}1F`, color: tx.tint,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={tx.ic} size={17} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: -0.1 }}>{tx.t}</div>
                  <div style={{ fontSize: 12, color: '#7A8EAF', marginTop: 2 }}>{tx.s}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 800,
                    color: tx.v > 0 ? '#22C55E' : '#fff', letterSpacing: -0.2,
                  }}>{tx.v > 0 ? '+' : '−'}{fmtTL(Math.abs(tx.v))} TL</div>
                  <div style={{
                    fontSize: 10.5, color: '#7A8EAF', marginTop: 2,
                    fontFamily: 'var(--font-mono)', letterSpacing: 0.4,
                  }}>{tx.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ kolon — benefit kartlar */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <BenefitCard u={u} icon="shield"
          title={u.lang === 'tr' ? 'TCMB güvencesi' : 'CBRT-backed'}
          body={u.lang === 'tr'
            ? '6493 sayılı Kanun çerçevesinde TCMB yetkili bir elektronik para kuruluşu.'
            : 'Authorized as an e-money institution under Law 6493 by the Central Bank.'}
        />
        <BenefitCard u={u} icon="sparkles"
          title={u.lang === 'tr' ? 'Milleri TL\'ye çevir' : 'Convert miles to TL'}
          body={u.lang === 'tr'
            ? 'Miles&Smiles millerini anında TKPAY bakiyesine dönüştür, istediğin yerde harca.'
            : 'Instantly convert Miles&Smiles miles to TKPAY balance and spend anywhere.'}
        />
        <BenefitCard u={u} icon="cardIcon"
          title={u.lang === 'tr' ? 'Sanal kart üret' : 'Generate virtual cards'}
          body={u.lang === 'tr'
            ? 'Online alışverişe özel sınırlı süreli sanal kartlarla güvenle öde.'
            : 'Issue limited-time virtual cards for safer online checkout.'}
        />
        <BenefitCard u={u} icon="bell"
          title={u.lang === 'tr' ? 'Harcama bildirimleri' : 'Spend notifications'}
          body={u.lang === 'tr'
            ? 'Her işlem anında bildirim ve haftalık özet — bütçen şeffaf.'
            : 'Instant notifications on every transaction and a weekly recap.'}
        />
      </aside>
    </div>
  );
}

function BenefitCard({ u, icon, title, body }) {
  return (
    <div style={{
      padding: '18px 20px', borderRadius: 12,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.085)',
      display: 'flex', gap: 14, alignItems: 'flex-start',
    }}>
      <span style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: 'rgba(197,160,89,0.14)',
        border: '1px solid rgba(197,160,89,0.32)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: '#C5A059',
      }}>
        <Icon name={icon} size={18} strokeWidth={2.4} />
      </span>
      <div>
        <div style={{
          fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14,
          color: '#fff', letterSpacing: -0.1,
        }}>{title}</div>
        <div style={{ fontSize: 12, color: '#B2C0D1', marginTop: 4, lineHeight: 1.5 }}>{body}</div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Ticari panel — POS application + commission + live ops
// ───────────────────────────────────────────────────────────
function BusinessPanel({ u, nav, toast, fmtTL }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      {/* Sol — Sanal POS başvuru kart */}
      <div style={{
        padding: '28px 28px 24px', borderRadius: 16,
        background: `
          radial-gradient(120% 80% at 0% 0%, rgba(183,49,44,0.18) 0%, transparent 55%),
          rgba(255,255,255,0.045)
        `,
        border: '1px solid rgba(255,255,255,0.085)',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 800,
          letterSpacing: 2.5, color: '#EF2E1F',
        }}>{u.lang === 'tr' ? 'SANAL POS BAŞVURUSU' : 'VIRTUAL POS APPLICATION'}</div>
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 26,
          color: '#fff', letterSpacing: -0.5, margin: '6px 0 14px',
        }}>{u.lang === 'tr' ? 'İşletmenizi TKPAY altyapısına bağlayın' : 'Connect your business to TKPAY'}</h3>
        <p style={{ fontSize: 13, color: '#B2C0D1', lineHeight: 1.6, margin: '0 0 18px' }}>
          {u.lang === 'tr'
            ? 'Avantajlı komisyon oranları, anlık mutabakat ve THY müşteri kitlesine doğrudan erişim. Online satış, fatura tahsilatı ve abonelik akışları için tek altyapı.'
            : 'Competitive commission rates, instant reconciliation and direct access to the TK audience. One backbone for online sales, billing and subscriptions.'}
        </p>

        {/* form preview */}
        <div style={{
          padding: 14, borderRadius: 10,
          background: 'rgba(0,0,0,0.18)',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {[
            { l: u.lang === 'tr' ? 'Şirket adı'        : 'Company name',  v: 'ROUTE DIGITAL AŞ' },
            { l: u.lang === 'tr' ? 'Vergi no'          : 'Tax ID',        v: '4218072 ····' },
            { l: u.lang === 'tr' ? 'MCC kategorisi'    : 'MCC category',  v: u.lang === 'tr' ? 'E-Ticaret / Hizmet' : 'E-commerce / Services' },
            { l: u.lang === 'tr' ? 'Beklenen aylık ciro' : 'Monthly volume', v: '~ 850.000 TL' },
          ].map(f => (
            <div key={f.l} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              gap: 12, padding: '8px 0',
              borderBottom: '1px dashed rgba(255,255,255,0.08)',
            }}>
              <span style={{ fontSize: 11, color: '#7A8EAF', letterSpacing: 0.3, textTransform: 'uppercase', fontWeight: 700 }}>{f.l}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#fff', fontWeight: 600 }}>{f.v}</span>
            </div>
          ))}
        </div>

        <button onClick={() => toast({ type: 'success', icon: '✓', children: u.lang === 'tr' ? 'POS başvurun alındı · 1 iş günü içinde dönüş' : 'POS application received · we will reply within 1 business day' })} style={{
          marginTop: 18, width: '100%', padding: '14px 18px', cursor: 'pointer',
          background: 'linear-gradient(135deg, #EF2E1F, #B7312C)',
          color: '#fff', border: 'none', borderRadius: 10,
          fontFamily: u.font, fontWeight: 800, fontSize: 13, letterSpacing: 0.3,
          boxShadow: '0 8px 22px rgba(183,49,44,0.4)',
        }}>{u.lang === 'tr' ? 'Başvuruyu gönder' : 'Submit application'} →</button>
      </div>

      {/* Sağ — Komisyon tablosu + canlı metrik */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Komisyon kartı */}
        <div style={{
          padding: '22px 24px', borderRadius: 14,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(197,160,89,0.32)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2.5, color: '#C5A059' }}>
              {u.lang === 'tr' ? 'KOMİSYON ORANLARI' : 'COMMISSION RATES'}
            </div>
            <span style={{ fontSize: 10, color: '#7A8EAF', fontFamily: 'var(--font-mono)' }}>2026 Q2</span>
          </div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
            {[
              { t: u.lang === 'tr' ? 'Tek çekim'             : 'Single charge',  r: '%0,79',  s: u.lang === 'tr' ? 'aylık 250K TL altı' : '<250K TL / month' },
              { t: u.lang === 'tr' ? 'Tek çekim · yüksek hacim' : 'Single · high volume', r: '%0,49', s: u.lang === 'tr' ? 'aylık 1M TL üzeri' : '>1M TL / month' },
              { t: u.lang === 'tr' ? 'Taksit (2-9 ay)'      : 'Instalment (2-9 mo.)', r: '%1,49 + %0,15/ay', s: u.lang === 'tr' ? 'tüm bankalar' : 'all banks' },
              { t: u.lang === 'tr' ? 'Yurtdışı kart'       : 'International card',    r: '%2,19',  s: u.lang === 'tr' ? '3D Secure dahil' : '3D Secure included' },
            ].map((r, i, a) => (
              <div key={r.t} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '12px 0',
                borderBottom: i < a.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{r.t}</div>
                  <div style={{ fontSize: 11, color: '#7A8EAF', marginTop: 2 }}>{r.s}</div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 800,
                  color: '#C5A059', letterSpacing: -0.2,
                }}>{r.r}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Canlı metrik kartları */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { l: u.lang === 'tr' ? 'BUGÜNKÜ CİRO'  : "TODAY'S VOLUME", v: '184.230', u: 'TL',  tr: '+12,4%' },
            { l: u.lang === 'tr' ? 'İŞLEM SAYISI' : 'TRANSACTIONS',   v: '1.284',   u: '',    tr: '+8,1%' },
            { l: u.lang === 'tr' ? 'BAŞARI ORANI' : 'SUCCESS RATE',   v: '99,2',    u: '%',   tr: '+0,3 pp' },
            { l: u.lang === 'tr' ? 'ORT. SEPET'   : 'AVG. BASKET',    v: '143,5',   u: 'TL',  tr: '−2,1%' },
          ].map(m => (
            <div key={m.l} style={{
              padding: '14px 16px', borderRadius: 12,
              background: 'rgba(255,255,255,0.045)',
              border: '1px solid rgba(255,255,255,0.085)',
            }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.8, color: '#7A8EAF' }}>{m.l}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.4 }}>{m.v}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#7A8EAF', fontWeight: 700 }}>{m.u}</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, marginTop: 2,
                color: m.tr.startsWith('−') ? '#EF2E1F' : '#22C55E',
              }}>{m.tr.startsWith('−') ? '▼' : '▲'} {m.tr}</div>
            </div>
          ))}
        </div>

        {/* Entegrasyon */}
        <div style={{
          padding: '16px 18px', borderRadius: 12,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.085)',
        }}>
          <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 2, color: '#C5A059' }}>
            {u.lang === 'tr' ? 'ENTEGRASYON' : 'INTEGRATION'}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {['REST API', 'iOS SDK', 'Android SDK', 'Shopify', 'WooCommerce', 'OpenCart'].map(s => (
              <span key={s} style={{
                padding: '6px 10px', borderRadius: 999, fontSize: 11,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#B2C0D1', fontFamily: 'var(--font-mono)', letterSpacing: 0.3,
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WebTKPayScreen });
