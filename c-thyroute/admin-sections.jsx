// admin-sections.jsx — each section of the executive dashboard. All render
// inside the cockpit shell and reference data from admin-data.jsx + chart
// primitives from admin-charts.jsx.

// ─ 1) Executive Overview ─────────────────────────────────────
function OverviewSection({ copy, lang }) {
  return (
    <section id="sec-overview" style={{ scrollMarginTop: 120 }}>
      <SectionHeader
        eyebrow="01 · OVERVIEW"
        title={lang==='tr' ? 'Bu sistem THY\'ye ne kazandırıyor?' : 'What is THY Route earning for the airline?'}
        sub={lang==='tr'
          ? '8 ana metrik · CEO / CFO / Dijital Dönüşüm için 30-saniyede özet'
          : '8 hero metrics · a 30-second exec readout'}
        right={<LiveDot>{copy.badge}</LiveDot>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {KPI_TILES.map(t => (
          <KpiTile key={t.key}
            label={copy.kpi[t.key]}
            value={t.value}
            delta={t.deltaText}
            deltaDir={t.deltaDir}
            note={t.note}
            accent={t.accent}
            spark={t.spark}
          />
        ))}
      </div>
    </section>
  );
}

// ─ 2) Travel Intent Intelligence ─────────────────────────────
function IntentSection({ copy, lang }) {
  const maxSearch = Math.max(...TOP_DESTINATIONS.map(d => d.search));
  return (
    <section id="sec-intent" style={{ scrollMarginTop: 120 }}>
      <SectionHeader
        eyebrow="02 · TRAVEL INTENT"
        title={copy.intent.title}
        sub={lang==='tr'
          ? 'Aranan, kaydedilen ve oluşturulan kombinasyonlardan gelecek talebi okuyoruz'
          : 'Reading future demand from searches, saves and built combinations'}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        {/* Top 10 */}
        <AdminCard title={copy.intent.top}
          sub={lang==='tr' ? 'Son 90 gün · arama ve kayıt yoğunluğu' : 'Last 90 days · search & save heat'}
          right={<span style={{ fontSize: 10, color: '#7A8EAF', fontFamily: 'var(--font-mono)' }}>x1000</span>}
          accent="#C5A059"
        >
          {TOP_DESTINATIONS.map((d, i) => (
            <div key={d.code} style={{
              display: 'grid', gridTemplateColumns: '28px 1fr 60px 1fr 60px', gap: 10,
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: i < TOP_DESTINATIONS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#7A8EAF', letterSpacing: 0.4 }}>
                {String(i+1).padStart(2,'0')}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.city}</div>
                <div style={{ fontSize: 10, color: '#7A8EAF', fontFamily: 'var(--font-mono)' }}>{d.code}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#fff',
                fontWeight: 800, textAlign: 'right', letterSpacing: -0.1 }}>{d.search}k</span>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${(d.search/maxSearch)*100}%`,
                  background: 'linear-gradient(90deg, #C5A059, #E8C97A)',
                  borderRadius: 999, boxShadow: '0 0 10px rgba(197,160,89,0.4)',
                  transition: 'width 600ms cubic-bezier(.16,1,.3,1)',
                }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#B2C0D1',
                fontWeight: 700, textAlign: 'right' }}>{d.save}k {copy.intent.save.toLowerCase()}</span>
            </div>
          ))}
        </AdminCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AdminCard title={copy.intent.hot} accent="#EF2E1F"
            sub={lang==='tr' ? 'Yakın gelecekte ısınan bölgeler' : 'Regions heating up'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {HOT_REGIONS.map(r => (
                <div key={r.region} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                  background: 'rgba(255,255,255,0.04)', borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span aria-hidden style={{ color: '#EF2E1F', fontSize: 14, letterSpacing: 1 }}>
                    {'🔥'.repeat(Math.min(r.fire, 5))}
                  </span>
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: '#fff' }}>{r.region}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 800,
                    color: '#22C55E', letterSpacing: -0.2 }}>{r.delta}</span>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard title={copy.intent.combos} accent="#0053A5"
            sub={lang==='tr' ? 'Kullanıcıların kendi eli ile kurduğu rotalar' : 'Combos hand-built by users'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {COMBOS.map(c => (
                <div key={c.a+c.b} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{ fontSize: 12.5, color: '#fff', fontWeight: 700, flex: 1 }}>
                    {c.a} <span style={{ color: '#C5A059', margin: '0 4px' }}>+</span> {c.b}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 800,
                    color: '#0A1628', background: '#C5A059',
                    padding: '2px 8px', borderRadius: 999,
                  }}>{c.count}k</span>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </section>
  );
}

// ─ 3) Loyalty & Passengers ───────────────────────────────────
function LoyaltySection({ copy, lang }) {
  return (
    <section id="sec-loyalty" style={{ scrollMarginTop: 120 }}>
      <SectionHeader
        eyebrow="03 · PAX & LOYALTY"
        title={copy.loyalty.title}
        sub={lang==='tr'
          ? 'Kim bizimle uçmaya başladı, ne kadar daha sık uçuyor?'
          : 'Who started flying with us, how much more often?'}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {/* Flights/yr comparison */}
        <AdminCard title={lang==='tr' ? 'Yıllık Uçuş Frekansı' : 'Annual Flight Frequency'} accent="#C5A059">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginTop: 4 }}>
            <FreqRow label={copy.loyalty.normal} value={1.8} sub={copy.loyalty.flightsYr} color="#7A8EAF" />
            <FreqRow label={copy.loyalty.route}  value={2.4} sub={copy.loyalty.flightsYr} color="#C5A059" highlight />
          </div>
          <div style={{
            marginTop: 14, padding: '10px 12px', borderRadius: 10,
            background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.25)',
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 11, color: '#B2C0D1', fontWeight: 600 }}>
              {lang==='tr' ? 'Fark · Route uplifti' : 'Difference · Route uplift'}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#22C55E', fontSize: 15 }}>
              +0,6 / +33%
            </span>
          </div>
        </AdminCard>

        {/* Stolen-from carriers */}
        <AdminCard title={copy.loyalty.stolen} accent="#EF2E1F"
          sub={lang==='tr' ? 'Rakiplerden bize geçen yolcuların payı' : 'Pax we win, by previous carrier'}>
          {STOLEN_CARRIERS.map(c => (
            <BarRow key={c.name} label={c.name} value={c.share} max={40} suffix="%" color={c.color} />
          ))}
        </AdminCard>

        {/* NPS + referral */}
        <AdminCard title={lang==='tr' ? 'Sadakat Göstergeleri' : 'Loyalty Indicators'} accent="#0053A5">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <NpsGauge value={63} lang={lang} />
            <div style={{
              padding: '12px 14px', borderRadius: 10,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.085)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 2, color: '#7A8EAF' }}>
                  {copy.loyalty.referral.toUpperCase()}
                </div>
                <div style={{ fontSize: 10.5, color: '#7A8EAF', marginTop: 1 }}>{copy.loyalty.uplift}</div>
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 800,
                color: '#fff', letterSpacing: -0.6,
              }}>1,34</div>
            </div>
          </div>
        </AdminCard>
      </div>
    </section>
  );
}
function FreqRow({ label, value, sub, color, highlight = false }) {
  const max = 3;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: '#B2C0D1', fontWeight: highlight ? 800 : 600 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: -0.4 }}>
          {value.toLocaleString('tr-TR')} <span style={{ fontSize: 11, color: '#7A8EAF', fontWeight: 600 }}>{sub}</span>
        </span>
      </div>
      <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(value/max)*100}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          borderRadius: 999, boxShadow: highlight ? `0 0 14px ${color}66` : 'none',
          transition: 'width 700ms cubic-bezier(.16,1,.3,1)' }} />
      </div>
    </div>
  );
}
function NpsGauge({ value, lang }) {
  const pct = Math.max(0, Math.min(100, (value + 100) / 2));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 2, color: '#7A8EAF' }}>
          {(lang==='tr' ? 'NPS' : 'NPS')}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: -0.6 }}>
          {value}
        </span>
      </div>
      <div style={{
        height: 10, borderRadius: 999, overflow: 'hidden',
        background: 'linear-gradient(90deg, #EF2E1F 0%, #C5A059 50%, #22C55E 100%)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: -3, bottom: -3, width: 3, left: `${pct}%`,
          background: '#fff', borderRadius: 2, transform: 'translateX(-50%)',
          boxShadow: '0 0 8px rgba(255,255,255,0.5)',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4,
        fontSize: 9, color: '#7A8EAF', fontFamily: 'var(--font-mono)', letterSpacing: 0.3 }}>
        <span>−100</span><span>0</span><span>+100</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: '#22C55E', fontWeight: 700 }}>
        ★ {lang==='tr' ? 'Dünya standardı 50+' : 'World-class >50'}
      </div>
    </div>
  );
}

// ─ 4) Partner Intelligence ───────────────────────────────────
function PartnerSection({ copy, lang }) {
  const total = PARTNER_DENSITY.reduce((s, x) => s + x.count, 0);
  return (
    <section id="sec-partner" style={{ scrollMarginTop: 120 }}>
      <SectionHeader
        eyebrow="04 · PARTNER INTEL"
        title={copy.partner.title}
        sub={lang==='tr'
          ? 'Hangi sektörde yoğunuz, nerede boşluk var, hangi şehri büyütmeliyiz?'
          : 'Where we are dense, where we have gaps, which city to grow next'}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <AdminCard title={copy.partner.density} accent="#C5A059">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Donut segments={PARTNER_DENSITY.map(p => ({ ...p, pct: p.share }))}
              size={150} thickness={16}
              centerLabel={lang==='tr' ? 'TOPLAM' : 'TOTAL'}
              centerValue={total.toLocaleString('tr-TR')} />
          </div>
          {PARTNER_DENSITY.map(p => (
            <div key={p.k} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />
              <span style={{ flex: 1, fontSize: 12, color: '#fff', fontWeight: 700 }}>{copy.partner[p.k]}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#B2C0D1', fontWeight: 700 }}>{p.count}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7A8EAF' }}>%{p.share}</span>
            </div>
          ))}
        </AdminCard>

        <AdminCard title={copy.partner.gap} accent="#EF2E1F"
          sub={lang==='tr' ? 'Yolcu var, partner az → fırsat' : 'High pax, low partners → opportunity'}>
          {PARTNER_GAPS.map((g, i) => (
            <div key={g.city} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
              borderBottom: i < PARTNER_GAPS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(239,46,31,0.14)', color: '#EF2E1F',
                border: '1px solid #EF2E1F',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 11,
              }}>{i+1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{g.city}</div>
                <div style={{ fontSize: 10.5, color: '#7A8EAF', marginTop: 1 }}>{g.gap}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 800,
                color: '#EF2E1F', letterSpacing: -0.2 }}>{g.score}</span>
            </div>
          ))}
        </AdminCard>

        <AdminCard title={copy.partner.opp} accent="#22C55E"
          sub={lang==='tr' ? 'Fırsat skoru (0-100)' : 'Opportunity score (0-100)'}>
          {[
            { city: 'Tokyo', score: 94 },
            { city: 'Bali',  score: 89 },
            { city: 'Seul',  score: 85 },
            { city: 'Hanoi', score: 78 },
            { city: 'Kyoto', score: 76 },
            { city: 'Colombo', score: 72 },
          ].map(c => (
            <BarRow key={c.city} label={c.city} value={c.score} max={100} color="#22C55E" />
          ))}
        </AdminCard>
      </div>
    </section>
  );
}

// ─ 5) Marketing Intelligence ─────────────────────────────────
function MarketingSection({ copy, lang }) {
  return (
    <section id="sec-marketing" style={{ scrollMarginTop: 120 }}>
      <SectionHeader
        eyebrow="05 · MARKETING"
        title={copy.marketing.title}
        sub={lang==='tr'
          ? 'CAC düşüşü, organik büyüme ve push verimi'
          : 'CAC drop, organic growth & push efficiency'}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 14 }}>
        <AdminCard title={copy.marketing.cac} accent="#22C55E"
          sub={lang==='tr' ? 'THY Route lansmanından sonra' : 'After THY Route launch'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '6px 0 14px' }}>
            <CacBlob v={copy.marketing.cacFrom} muted />
            <div style={{ flex: 1, position: 'relative', height: 50 }}>
              <svg width="100%" height="50" viewBox="0 0 200 50" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cacLine" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#C5A059" />
                    <stop offset="100%" stopColor="#22C55E" />
                  </linearGradient>
                </defs>
                <path d="M 10 12 Q 70 10 100 22 T 190 40" fill="none"
                  stroke="url(#cacLine)" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 3" />
              </svg>
              <span style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                background: 'rgba(34,197,94,0.16)', color: '#22C55E',
                padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 800,
                fontFamily: 'var(--font-mono)', letterSpacing: 0.3, border: '1px solid #22C55E55',
              }}>−26%</span>
            </div>
            <CacBlob v={copy.marketing.cacTo} />
          </div>
          <div style={{ fontSize: 11, color: '#B2C0D1', lineHeight: 1.5 }}>
            {lang==='tr'
              ? 'Organik aramalar ve viral davet sayesinde edinme maliyeti 11$ düştü.'
              : 'Organic search + viral invites pulled per-acquisition cost down by $11.'}
          </div>
        </AdminCard>

        <AdminCard title={copy.marketing.adSave} accent="#C5A059">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800,
              color: '#fff', letterSpacing: -1, lineHeight: 1 }}>$58M</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#22C55E', fontFamily: 'var(--font-mono)' }}>▲ +18%</span>
          </div>
          <div style={{ marginTop: 10, height: 40 }}>
            <Sparkline data={[22,28,34,40,48,54,60,68,76,82,90,100]} color="#C5A059" height={40} />
          </div>
          <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 11, color: '#B2C0D1' }}>{copy.marketing.alarm}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 800, color: '#fff' }}>$13M</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#B2C0D1' }}>{copy.marketing.push}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 800, color: '#fff' }}>%21</span>
            </div>
          </div>
        </AdminCard>

        <AdminCard title={copy.marketing.viral} accent="#7A4988"
          sub={lang==='tr' ? 'Her kullanıcı kaç yeni kullanıcı getiriyor?' : 'How many new users per user?'}>
          <div style={{ padding: '10px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
            <CacBlob v={copy.marketing.viralFrom} muted small />
            <span style={{ color: '#7A4988', fontSize: 16 }}>→</span>
            <CacBlob v={copy.marketing.viralTo} color="#7A4988" />
          </div>
          <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(122,73,136,0.10)',
            border: '1px solid #7A498855', borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: '#B2C0D1', letterSpacing: 1.5, fontWeight: 800 }}>VIRAL K-FACTOR</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 2 }}>K = 1,27</div>
            <div style={{ fontSize: 10.5, color: '#7A8EAF', marginTop: 2 }}>
              {lang==='tr' ? 'K > 1 → kendi kendine büyüyen ürün' : 'K > 1 → self-growing product'}
            </div>
          </div>
        </AdminCard>
      </div>
    </section>
  );
}
function CacBlob({ v, muted = false, small = false, color = '#22C55E' }) {
  return (
    <div style={{
      padding: small ? '8px 14px' : '12px 18px', borderRadius: 12,
      background: muted ? 'rgba(255,255,255,0.04)' : `${color}1A`,
      border: '1px solid ' + (muted ? 'rgba(255,255,255,0.1)' : `${color}55`),
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
      minWidth: small ? 70 : 80,
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: small ? 16 : 22, fontWeight: 800,
        color: muted ? '#B2C0D1' : color, letterSpacing: -0.4,
      }}>{v}</span>
    </div>
  );
}

// ─ 6) Miles & Smiles Intelligence ────────────────────────────
function MsSection({ copy, lang }) {
  const maxMiles = Math.max(...MS_PARTNERS.map(p => p.miles));
  return (
    <section id="sec-ms" style={{ scrollMarginTop: 120 }}>
      <SectionHeader
        eyebrow="06 · MILES & SMILES"
        title={copy.ms.title}
        sub={lang==='tr'
          ? 'Mil yükümlülüğünü azaltırken sadakati besliyoruz'
          : 'Burning mileage liability while feeding loyalty'}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 14 }}>
        <AdminCard title={copy.ms.spent} accent="#C5A059">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>
            2,1<span style={{ fontSize: 18, color: '#C5A059', marginLeft: 4 }}>B mi</span>
          </div>
          <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 700, marginTop: 4 }}>▲ +28% YoY</div>
          <div style={{ marginTop: 10, height: 36 }}>
            <Sparkline data={[20,26,30,34,40,46,54,62,72,80,88,100]} color="#C5A059" height={36} />
          </div>
        </AdminCard>

        <AdminCard title={copy.ms.earned} accent="#0053A5">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>
            3,4<span style={{ fontSize: 18, color: '#0053A5', marginLeft: 4 }}>B mi</span>
          </div>
          <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 700, marginTop: 4 }}>▲ +34% YoY</div>
          <div style={{ marginTop: 10, height: 36 }}>
            <Sparkline data={[18,24,32,40,46,54,62,68,76,82,90,100]} color="#0053A5" height={36} />
          </div>
        </AdminCard>

        <AdminCard title={copy.ms.partner} accent="#C5A059"
          sub={lang==='tr' ? 'Hangi partnerlerde mil yakılıyor?' : 'Where miles get burned'}>
          {MS_PARTNERS.map(p => (
            <BarRow key={p.name} label={p.name} value={p.miles} max={maxMiles} color={p.color} suffix="M mi" />
          ))}
        </AdminCard>
      </div>
      <div style={{ marginTop: 14 }}>
        <AdminCard accent="#22C55E">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 2.2, color: '#22C55E' }}>
                {copy.ms.liab.toUpperCase()}
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 22, color: '#fff',
                marginTop: 4, letterSpacing: -0.3,
              }}>
                {lang==='tr'
                  ? 'Mil yükümlülüğü 19 milyon dolar azaldı'
                  : 'Mileage liability reduced by $19M'}
              </div>
              <div style={{ fontSize: 12, color: '#B2C0D1', marginTop: 4, lineHeight: 1.5 }}>
                {lang==='tr'
                  ? 'Partner kullanımı arttıkça defterdeki mil borcu eriyor — bilançoya doğrudan etki.'
                  : 'As partner burn grows, the on-book liability shrinks — direct balance-sheet impact.'}
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 42, fontWeight: 800,
              color: '#22C55E', letterSpacing: -1.4 }}>−$19M</div>
          </div>
        </AdminCard>
      </div>
    </section>
  );
}

// ─ 7) Smart Layover ──────────────────────────────────────────
function LayoverSection({ copy, lang }) {
  return (
    <section id="sec-layover" style={{ scrollMarginTop: 120 }}>
      <SectionHeader
        eyebrow="07 · SMART LAYOVER"
        title={copy.layover.title}
        sub={lang==='tr'
          ? 'İstanbul aktarmasını fırsata çeviriyoruz: Touristanbul, VIP transfer, ek harcama'
          : 'Turning Istanbul layovers into revenue: Touristanbul, VIP transfer, extra spend'}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        {LAYOVER_KPI.map(t => (
          <AdminCard key={t.key} accent="#C5A059">
            <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 2.2, color: '#7A8EAF' }}>
              {copy.layover[t.key].toUpperCase()}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 800,
              color: '#fff', letterSpacing: -0.6, marginTop: 6 }}>{t.value}</div>
            <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 700, marginTop: 4,
              fontFamily: 'var(--font-mono)' }}>▲ {t.delta}</div>
          </AdminCard>
        ))}
      </div>
      <div style={{ marginTop: 14 }}>
        <AdminCard accent="#B7312C">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 2.2, color: '#B7312C' }}>
                {lang==='tr' ? 'HİKAYE' : 'STORY'}
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18, color: '#fff',
                marginTop: 4, letterSpacing: -0.2, lineHeight: 1.3,
              }}>
                {lang==='tr'
                  ? 'Transit yolcuların %14\'ü Touristanbul\'a katıldı; ortalama harcama $184\'e ulaştı.'
                  : '14% of transit pax joined Touristanbul; average spend climbed to $184.'}
              </div>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
            }}>
              {[
                { l: lang==='tr'?'KATILIM':'JOIN RATE', v: '14%', d: '+3.2 pp' },
                { l: lang==='tr'?'ORT. SÜRE':'AVG TIME', v: '4h 12m', d: '+18m' },
                { l: lang==='tr'?'TEKRAR UÇUŞ':'REBOOK',  v: '+22%',  d: 'vs. baseline' },
              ].map(m => (
                <div key={m.l} style={{
                  padding: '10px 12px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.085)',
                }}>
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.6, color: '#7A8EAF' }}>{m.l}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 800, color: '#fff', marginTop: 4 }}>{m.v}</div>
                  <div style={{ fontSize: 10, color: '#22C55E', marginTop: 2, fontFamily: 'var(--font-mono)' }}>▲ {m.d}</div>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>
      </div>
    </section>
  );
}

// ─ 8) TKPAY Intelligence ─────────────────────────────────────
function TkpaySection({ copy, lang }) {
  return (
    <section id="sec-tkpay" style={{ scrollMarginTop: 120 }}>
      <SectionHeader
        eyebrow="08 · TKPAY"
        title={copy.tkpay.title}
        sub={copy.tkpay.sub}
        right={<span style={{
          padding: '4px 10px', borderRadius: 999, fontSize: 9, fontWeight: 800,
          letterSpacing: 2, color: '#C5A059',
          background: 'rgba(197,160,89,0.12)', border: '1px solid #C5A05955',
          fontFamily: 'var(--font-mono)',
        }}>TCMB · BDDK</span>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
        {TKPAY_KPI.map(t => (
          <AdminCard key={t.key} padding="14px 14px 14px" accent="#C5A059">
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: '#7A8EAF' }}>
              {copy.tkpay[t.key].toUpperCase()}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800,
              color: '#fff', letterSpacing: -0.4, marginTop: 4 }}>{t.value}</div>
            <div style={{ fontSize: 10, color: '#22C55E', fontWeight: 700, marginTop: 2,
              fontFamily: 'var(--font-mono)' }}>▲ {t.delta}</div>
            <div style={{ marginTop: 8, height: 22 }}>
              <Sparkline data={t.spark} color="#C5A059" height={22} />
            </div>
          </AdminCard>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14, marginTop: 14 }}>
        <AdminCard title={copy.tkpay.mix} accent="#B7312C">
          <StackBar segments={TKPAY_MIX} />
        </AdminCard>
        <AdminCard title={copy.tkpay.partners} accent="#C5A059"
          sub={lang==='tr' ? 'Anlaşmalı markalardaki haftalık işlem yoğunluğu' : 'Weekly transaction volume by partner'}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {TKPAY_PARTNERS.map(p => (
              <BarRow key={p.name} label={p.name} value={p.vol} max={100} color="#C5A059" suffix="k" />
            ))}
          </div>
        </AdminCard>
      </div>
    </section>
  );
}

// ─ 9) AI Executive Insights ──────────────────────────────────
function AiSection({ copy, lang }) {
  const items = AI_INSIGHTS[lang] || AI_INSIGHTS.tr;
  return (
    <section id="sec-ai" style={{ scrollMarginTop: 120 }}>
      <SectionHeader
        eyebrow="09 · AI INSIGHTS"
        title={copy.ai.title}
        sub={copy.ai.sub}
      />
      <div style={{
        position: 'relative', overflow: 'hidden', borderRadius: 16, padding: 4,
        background: 'linear-gradient(135deg, #C5A059 0%, #EF2E1F 50%, #0053A5 100%)',
      }}>
        <div style={{
          background: 'linear-gradient(180deg, #0A1628, #050B14)',
          borderRadius: 13, padding: '20px 22px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {items.map((it, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.085)',
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg, #C5A059, #A0813C)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0A1628', fontSize: 16, fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(197,160,89,0.35)',
                }}>{it.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 9.5, fontWeight: 800, letterSpacing: 2, color: '#C5A059',
                  }}>{it.tag}</div>
                  <div style={{ fontSize: 13, color: '#E8EEF6', marginTop: 4, lineHeight: 1.5 }}>{it.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Ask AI input */}
          <div style={{
            marginTop: 16, display: 'flex', gap: 10, padding: 6,
            borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.085)',
          }}>
            <span style={{
              width: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#C5A059',
            }}>✦</span>
            <input type="text" placeholder={copy.ai.askHint} style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontSize: 13, fontFamily: 'var(--font-ui)',
            }} />
            <button style={{
              padding: '8px 16px', cursor: 'pointer', border: 'none',
              background: 'linear-gradient(135deg, #E8C97A, #C5A059)',
              color: '#0A1628', borderRadius: 8,
              fontWeight: 800, fontSize: 12, letterSpacing: 0.3,
              boxShadow: '0 4px 12px rgba(197,160,89,0.32)',
            }}>{copy.ai.askLabel} →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  OverviewSection, IntentSection, LoyaltySection, PartnerSection,
  MarketingSection, MsSection, LayoverSection, TkpaySection, AiSection,
});
