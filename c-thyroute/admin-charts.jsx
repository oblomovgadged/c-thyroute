// admin-charts.jsx — minimal SVG chart primitives + KPI tile, used by every
// section of the executive dashboard. Goal: clean, instrument-grade, no slop.

// ── Sparkline (filled area, glow tone) ─────────────────────
function Sparkline({ data = [], color = '#C5A059', height = 32, width = '100%' }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  const area = `0,100 ${pts} 100,100`;
  const id = React.useId();
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ width, height, display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={'spark'+id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={'url(#spark'+id+')'} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ── KPI Tile — hero metric card ────────────────────────────
const ACCENT_HUES = {
  gold:  { fg: '#C5A059', glow: 'rgba(197,160,89,0.22)' },
  red:   { fg: '#EF2E1F', glow: 'rgba(239,46,31,0.22)' },
  green: { fg: '#22C55E', glow: 'rgba(34,197,94,0.22)' },
  blue:  { fg: '#3B82F6', glow: 'rgba(59,130,246,0.22)' },
};
function KpiTile({ label, value, delta, deltaDir = 'up', note, accent = 'gold', spark }) {
  const hue = ACCENT_HUES[accent] || ACCENT_HUES.gold;
  const dirSym = deltaDir === 'up' ? '▲' : '▼';
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      padding: '18px 18px 16px', borderRadius: 14,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.085)',
      transition: 'all 220ms cubic-bezier(.16,1,.3,1)',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none',
        background: `radial-gradient(120% 80% at 100% 0%, ${hue.glow} 0%, transparent 60%)` }} />
      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 10,
        }}>
          <span style={{
            fontSize: 9.5, fontWeight: 800, letterSpacing: 2.2, color: '#7A8EAF',
            textTransform: 'uppercase',
          }}>{label}</span>
          <span style={{
            padding: '2px 6px', borderRadius: 4, fontSize: 9.5, fontWeight: 800,
            background: deltaDir === 'up' ? 'rgba(34,197,94,0.12)' : 'rgba(239,46,31,0.12)',
            color: deltaDir === 'up' ? '#22C55E' : '#EF2E1F',
            fontFamily: 'var(--font-mono)', letterSpacing: 0.3,
          }}>{dirSym} {delta}</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 800,
          color: '#fff', letterSpacing: -1, lineHeight: 1,
        }}>{value}</div>
        {note && <div style={{
          fontSize: 10.5, color: '#7A8EAF', marginTop: 6, fontFamily: 'var(--font-mono)',
          letterSpacing: 0.3,
        }}>{note}</div>}
        {spark && (
          <div style={{ marginTop: 12, height: 28 }}>
            <Sparkline data={spark} color={hue.fg} height={28} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Horizontal bar row ─────────────────────────────────────
function BarRow({ label, sublabel, value, max, color = '#C5A059', suffix = '', tone = 'dark', barH = 6 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const isDark = tone !== 'light';
  return (
    <div style={{ padding: '8px 0', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#fff' : '#0A1628',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
          {sublabel && <span style={{ fontSize: 10, color: '#7A8EAF', fontFamily: 'var(--font-mono)',
            letterSpacing: 0.3 }}>{sublabel}</span>}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 800,
          color: isDark ? '#fff' : '#0A1628', letterSpacing: -0.2 }}>{value}{suffix}</span>
      </div>
      <div style={{ height: barH, background: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
        borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct + '%',
          background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`,
          borderRadius: 999, boxShadow: `0 0 12px ${color}55`,
          transition: 'width 600ms cubic-bezier(.16,1,.3,1)' }} />
      </div>
    </div>
  );
}

// ── Stacked horizontal bar (payment mix etc.) ──────────────
function StackBar({ segments, height = 18, label }) {
  const total = segments.reduce((s, x) => s + x.pct, 0) || 1;
  return (
    <div>
      {label && <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 2.2,
        color: '#7A8EAF', marginBottom: 8 }}>{label}</div>}
      <div style={{ display: 'flex', height, borderRadius: 999, overflow: 'hidden',
        background: 'rgba(255,255,255,0.05)' }}>
        {segments.map((s, i) => (
          <div key={i} style={{
            width: ((s.pct / total) * 100) + '%',
            background: s.color, position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: '#0A1628',
              fontFamily: 'var(--font-mono)' }}>{s.pct >= 10 ? `${s.pct}%` : ''}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 10 }}>
        {segments.map(s => (
          <span key={s.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
            <span style={{ fontSize: 11, color: '#B2C0D1' }}>{s.name}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#fff', fontWeight: 700 }}>{s.pct}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Donut (legend below) ───────────────────────────────────
function Donut({ segments, size = 160, thickness = 18, centerLabel, centerValue }) {
  const total = segments.reduce((s, x) => s + (x.pct || x.share || 0), 0) || 1;
  const radius = (size - thickness) / 2;
  const c = 2 * Math.PI * radius;
  let acc = 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth={thickness} />
          {segments.map((s, i) => {
            const v = s.pct || s.share || 0;
            const arc = (v / total) * c;
            const seg = (
              <circle key={i} cx={size/2} cy={size/2} r={radius} fill="none"
                stroke={s.color} strokeWidth={thickness}
                strokeDasharray={`${arc} ${c - arc}`} strokeDashoffset={-acc}
                strokeLinecap="butt" style={{ transition: 'stroke-dasharray 500ms cubic-bezier(.16,1,.3,1)' }} />
            );
            acc += arc;
            return seg;
          })}
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          {centerLabel && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2,
            color: '#7A8EAF', textTransform: 'uppercase' }}>{centerLabel}</span>}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800,
            color: '#fff', letterSpacing: -0.5, marginTop: 2 }}>{centerValue}</span>
        </div>
      </div>
    </div>
  );
}

// ── Live status pill ───────────────────────────────────────
function LiveDot({ children, color = '#22C55E' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 8px', borderRadius: 999,
      background: 'rgba(34,197,94,0.12)', border: `1px solid ${color}33`,
      fontSize: 10, fontWeight: 800, letterSpacing: 1.6, color,
      fontFamily: 'var(--font-mono)',
    }}>
      <span style={{
        display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
        background: color, boxShadow: `0 0 8px ${color}`,
        animation: 'thy-pulse 1.4s ease-in-out infinite',
      }} />
      {children}
    </span>
  );
}

// ── Section header ─────────────────────────────────────────
function SectionHeader({ eyebrow, title, sub, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      gap: 16, marginBottom: 16, flexWrap: 'wrap',
    }}>
      <div>
        {eyebrow && <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 2.4, color: '#C5A059',
          textTransform: 'uppercase', marginBottom: 4,
        }}>{eyebrow}</div>}
        <h2 style={{
          fontFamily: 'var(--font-heading, Outfit)', fontWeight: 800, fontSize: 26,
          letterSpacing: -0.5, color: '#fff', margin: 0,
        }}>{title}</h2>
        {sub && <div style={{ fontSize: 13, color: '#7A8EAF', marginTop: 4 }}>{sub}</div>}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

// ── Card shell ─────────────────────────────────────────────
function AdminCard({ title, sub, right, children, padding = '18px 20px 20px', accent = null }) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.085)',
      borderRadius: 14, padding,
      transition: 'all 220ms cubic-bezier(.16,1,.3,1)',
    }}>
      {accent && <div aria-hidden style={{
        position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none',
        background: `radial-gradient(110% 70% at 0% 0%, ${accent}33 0%, transparent 55%)`,
      }} />}
      <div style={{ position: 'relative' }}>
        {(title || right) && (
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            gap: 12, marginBottom: 14,
          }}>
            <div>
              {title && <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 16,
                color: '#fff', letterSpacing: -0.2,
              }}>{title}</div>}
              {sub && <div style={{ fontSize: 11.5, color: '#7A8EAF', marginTop: 2 }}>{sub}</div>}
            </div>
            {right}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

Object.assign(window, {
  Sparkline, KpiTile, BarRow, StackBar, Donut, LiveDot, SectionHeader, AdminCard, ACCENT_HUES,
});
