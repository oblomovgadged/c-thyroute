// ds-components.jsx — THY Route DS components ported to inline JSX.
// Faithful to the DS source under /projects/.../components/core/.
// Exports to window: ThyButton, ThyBadge, ThyCard, ThyChip, ThyTabs, ThyInput,
//                    ThyToast, DSFlightCard, ToastHost, useToast

// ──────────────────────────────────────────────────────────
// ThyButton — variants: primary | secondary | gold | search
//   sizes: sm | md | lg
// ──────────────────────────────────────────────────────────
function ThyButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon = null,
  children,
  style = {},
  onClick,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, fontFamily: 'var(--font-ui)', fontWeight: 700, letterSpacing: 0.5,
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    whiteSpace: 'nowrap', position: 'relative', overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    transition: 'transform .25s, background .25s, border-color .25s, box-shadow .25s, color .25s',
    transform: active ? 'scale(0.96)' : hover ? 'translateY(-1px)' : 'none',
  };

  const sizes = {
    sm: { padding: '6px 14px', fontSize: 11, borderRadius: 8 },
    md: { padding: '11px 22px', fontSize: 13, borderRadius: 22 },
    lg: { padding: '14px 28px', fontSize: 15, borderRadius: 22 },
  };

  const variants = {
    primary: {
      background: hover
        ? 'linear-gradient(135deg, #EF2E1F 0%, #D42218 50%, #C9201A 100%)'
        : 'linear-gradient(135deg, #C9201A 0%, #EF2E1F 50%, #D42218 100%)',
      color: '#fff', borderColor: 'rgba(255,255,255,0.12)',
      boxShadow: hover
        ? '0 6px 22px rgba(183,49,44,0.5), 0 1px 0 rgba(255,255,255,0.1) inset'
        : '0 3px 14px rgba(183,49,44,0.38), 0 1px 0 rgba(255,255,255,0.1) inset',
      textShadow: '0 1px 2px rgba(0,0,0,0.25)',
    },
    secondary: {
      background: hover ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.055)',
      color: hover ? '#E8C97A' : '#B2C0D1',
      borderColor: hover ? 'rgba(197,160,89,0.35)' : 'rgba(255,255,255,0.12)',
      backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
    },
    gold: {
      background: 'linear-gradient(135deg, #C5A059 0%, #E8C97A 35%, #C5A059 65%, #A0813C 100%)',
      backgroundSize: '200% 100%', backgroundPosition: hover ? '100% 0' : '0 0',
      color: '#0A1628', fontWeight: 800, borderColor: 'rgba(255,255,255,0.2)',
      boxShadow: hover
        ? '0 6px 28px rgba(197,160,89,0.48), 0 1px 0 rgba(255,255,255,0.2) inset'
        : '0 3px 16px rgba(197,160,89,0.32), 0 1px 0 rgba(255,255,255,0.2) inset',
    },
    search: {
      background: hover ? '#B7312C' : '#EF2E1F',
      color: '#fff', borderRadius: 8, fontWeight: 700,
    },
  };

  const disabledStyle = disabled
    ? { background: '#E4E4E4', color: '#848484', borderColor: '#E4E4E4', opacity: 0.5, boxShadow: 'none', transform: 'none' }
    : {};

  const merged = { ...base, ...sizes[size], ...variants[variant], ...disabledStyle, ...style };

  return (
    <button
      style={merged}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      {...rest}
    >
      {!disabled && (
        <span style={{
          position: 'absolute', top: 0, left: hover ? '120%' : '-60%',
          width: '40%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
          transform: 'skewX(-20deg)', pointerEvents: 'none',
          opacity: hover ? 1 : 0,
          transition: hover ? 'left 0.55s ease, opacity 0.1s' : 'none',
        }} />
      )}
      {icon && <span style={{ display: 'inline-flex', fontSize: 14 }}>{icon}</span>}
      {children}
    </button>
  );
}

// ──────────────────────────────────────────────────────────
// ThyBadge — variants: status | gold | outbound | inbound | red | mono
// ──────────────────────────────────────────────────────────
function ThyBadge({ variant = 'status', children, style = {}, ...rest }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 9,
    letterSpacing: 0.5, textTransform: 'uppercase',
    padding: '4px 10px', borderRadius: 9999,
    border: '1px solid transparent', whiteSpace: 'nowrap',
  };
  const variants = {
    status:   { background: '#F8FAFC', borderColor: '#B7312C', color: '#EF2E1F', fontSize: 11, letterSpacing: 1.5, fontWeight: 700 },
    gold:     { background: 'rgba(197,160,89,0.12)', borderColor: '#C5A059', color: '#E8C97A' },
    outbound: { background: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.3)', color: '#3b82f6' },
    inbound:  { background: 'rgba(197,160,89,0.08)', borderColor: 'rgba(197,160,89,0.3)', color: '#C5A059' },
    red:      { background: '#B7312C', borderColor: '#B7312C', color: '#fff', boxShadow: '0 0 6px rgba(183,49,44,0.4)' },
    mono:     { background: 'rgba(197,160,89,0.15)', borderColor: '#C5A059', color: '#C5A059',
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                borderRadius: 4, textTransform: 'none', letterSpacing: 0.5 },
  };
  return (
    <span style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {variant === 'status' && (
        <span style={{
          width: 8, height: 8, borderRadius: '50%', background: '#EF2E1F',
          animation: 'thyDotBlink 1.5s ease-in-out infinite',
        }} />
      )}
      {children}
    </span>
  );
}

// ──────────────────────────────────────────────────────────
// ThyCard — variants: glass | solid | light
// ──────────────────────────────────────────────────────────
function ThyCard({ variant = 'glass', interactive = false, children, style = {}, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const base = {
    borderRadius: 8, padding: 16, border: '1px solid',
    transition: 'transform .25s, background-color .25s, box-shadow .25s, border-color .25s',
  };
  const variants = {
    glass: {
      background: hover && interactive ? 'rgba(255,255,255,0.075)' : 'rgba(255,255,255,0.045)',
      borderColor: hover && interactive ? 'rgba(197,160,89,0.3)' : 'rgba(255,255,255,0.085)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    },
    solid: {
      background: hover && interactive ? '#0F2244' : '#0B1A33',
      borderColor: hover && interactive ? '#B7312C' : '#223754',
    },
    light: {
      background: '#fff', borderColor: '#E2E8F0', color: '#0A1628',
      boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
    },
  };
  const lift = interactive && hover
    ? { transform: 'translateY(-4px)', boxShadow: '0 14px 36px rgba(10,22,40,0.18), 0 0 20px rgba(183,49,44,0.2)' }
    : {};
  return (
    <div style={{ ...base, ...variants[variant], ...lift, ...style }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...rest}>
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// ThyChip — gold active filter pill
// ──────────────────────────────────────────────────────────
function ThyChip({ active = false, icon = null, children, style = {}, light = false, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const on = active;
  const lightS = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 12px', fontFamily: 'var(--font-ui)',
    fontSize: 11, fontWeight: 700, borderRadius: 9999, cursor: 'pointer',
    border: `1px solid ${on ? '#C5A059' : '#E2E8F0'}`,
    color: on ? '#9B7E3D' : '#64748B',
    background: on ? 'rgba(197,160,89,0.16)' : hover ? 'rgba(197,160,89,0.06)' : '#fff',
    boxShadow: on ? '0 2px 8px rgba(197,160,89,0.16)' : 'none',
    transition: 'all .25s', ...style,
  };
  const darkS = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 12px', fontFamily: 'var(--font-ui)',
    fontSize: 11, fontWeight: 600, borderRadius: 9999, cursor: 'pointer',
    border: `1px solid ${on || hover ? '#C5A059' : 'rgba(255,255,255,0.18)'}`,
    color: on || hover ? '#E8C97A' : '#B2C0D1',
    background: on ? 'rgba(197,160,89,0.12)' : hover ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
    boxShadow: on ? '0 2px 8px rgba(197,160,89,0.1)' : 'none',
    transition: 'all .25s', ...style,
  };
  return (
    <button
      style={light ? lightS : darkS}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </button>
  );
}

// ──────────────────────────────────────────────────────────
// ThyTabs — cockpit-style underline sweep
// ──────────────────────────────────────────────────────────
function ThyTabs({ items = [], value, onChange = () => {}, light = false, style = {} }) {
  return (
    <div style={{
      display: 'flex',
      background: light ? '#fff' : 'rgba(0,0,0,0.2)',
      borderBottom: `1px solid ${light ? '#E2E8F0' : 'rgba(255,255,255,0.06)'}`,
      ...style,
    }}>
      {items.map((it) => (
        <ThyTabButton key={it.id} item={it} active={it.id === value}
          onClick={() => onChange(it.id)} light={light} />
      ))}
    </div>
  );
}
function ThyTabButton({ item, active, onClick, light }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: 1, padding: '12px 6px', fontFamily: 'var(--font-ui)',
        fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        cursor: 'pointer', position: 'relative', border: 'none',
        color: active ? '#EF2E1F'
              : light ? (hover ? '#0A1628' : '#64748B')
                      : (hover ? '#fff' : 'rgba(178,192,209,0.7)'),
        background: active
          ? (light ? 'rgba(183,49,44,0.04)' : 'rgba(183,49,44,0.06)')
          : hover ? (light ? '#F3F5F8' : 'rgba(255,255,255,0.04)') : 'transparent',
        transition: 'all .25s',
      }}>
      {item.icon && <span style={{ display: 'inline-flex' }}>{item.icon}</span>}
      {item.label}
      {active && (
        <span style={{
          position: 'absolute', bottom: 0, left: '15%', right: '15%', height: 2,
          background: 'linear-gradient(90deg, transparent, #B7312C, transparent)',
          borderRadius: 9999,
        }} />
      )}
    </button>
  );
}

// ──────────────────────────────────────────────────────────
// ThyInput — dark gold-focus / light light-focus
// ──────────────────────────────────────────────────────────
function ThyInput({ label, mono = false, light = false, icon = null, style = {}, wrapStyle = {}, ...rest }) {
  const [focus, setFocus] = React.useState(false);

  const fieldDark = {
    width: '100%', padding: icon ? '10px 14px 10px 38px' : '10px 14px',
    background: focus ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.25)',
    border: `1px solid ${focus ? '#C5A059' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: 6, color: mono ? '#C5A059' : '#fff',
    fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
    fontSize: 13, outline: 'none',
    boxShadow: focus ? '0 0 10px rgba(197,160,89,0.18)' : 'none',
    transition: 'all .25s', boxSizing: 'border-box', ...style,
  };
  const fieldLight = {
    width: '100%', padding: icon ? '11px 14px 11px 38px' : '11px 14px',
    background: '#fff',
    border: `1px solid ${focus ? '#0053A5' : '#E2E8F0'}`,
    borderRadius: 8, color: mono ? '#0A1628' : '#0A1628',
    fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
    fontSize: 13, outline: 'none',
    boxShadow: focus ? '0 0 0 3px rgba(0,83,165,0.12)' : 'none',
    transition: 'all .25s', boxSizing: 'border-box', ...style,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...wrapStyle }}>
      {label && (
        <label style={{
          fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 800,
          letterSpacing: 1.5, textTransform: 'uppercase',
          color: light ? '#94A3B8' : '#C5A059',
        }}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: light ? '#94A3B8' : '#C5A059', pointerEvents: 'none',
          }}>{icon}</span>
        )}
        <input
          style={light ? fieldLight : fieldDark}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...rest}
        />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// ThyToast + ToastHost + useToast — bottom-centered queue
// ──────────────────────────────────────────────────────────
const ToastCtx = React.createContext({ push: () => {} });

function ToastHost({ children }) {
  const [items, setItems] = React.useState([]);
  const push = React.useCallback((toast) => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [...prev, { id, ttl: 2400, ...toast }]);
    setTimeout(() => setItems((prev) => prev.filter(t => t.id !== id)), toast.ttl || 2400);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      {/* Bottom-centered, fixed to viewport so it floats over phones */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 28,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 8, pointerEvents: 'none', zIndex: 999,
      }}>
        {items.map((t) => (
          <div key={t.id} className="toast-pop" style={{ pointerEvents: 'auto' }}>
            <ThyToast type={t.type} icon={t.icon}>{t.children}</ThyToast>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
function useToast() {
  return React.useContext(ToastCtx).push;
}

function ThyToast({ type = 'info', icon = null, children, style = {}, ...rest }) {
  const accents = { success: '#22C55E', error: '#EF2E1F', info: '#C5A059' };
  return (
    <div
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '10px 18px',
        background: 'rgba(10,22,40,0.92)',
        border: `1px solid ${accents[type]}`,
        borderRadius: 9999, color: '#fff',
        fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500,
        boxShadow: '0 14px 36px rgba(0,0,0,0.4), 0 0 18px ' + (
          type === 'success' ? 'rgba(34,197,94,0.25)' :
          type === 'error'   ? 'rgba(239,46,31,0.30)' :
                               'rgba(197,160,89,0.28)'
        ),
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        whiteSpace: 'nowrap', ...style,
      }}
      {...rest}
    >
      {icon && <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: accents[type],
      }}>{icon}</span>}
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// DSFlightCard — light-themed result row with fare-family columns
// Adapted from the DS source for mobile widths (vertical fare list).
// ──────────────────────────────────────────────────────────
function DSFlightCard({
  depTime, arrTime, depCode, arrCode, depCity, arrCity,
  duration, code, plane, stops = 0, tag,
  fares = [], onSelectFare = () => {}, lang = 'tr',
}) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10,
      padding: 14, fontFamily: 'var(--font-ui)',
      boxShadow: '0 2px 8px rgba(10,22,40,0.04)',
    }}>
      {/* top route bar */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ minWidth: 56 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 18, color: '#0A1628', letterSpacing: -0.3, lineHeight: 1 }}>{depTime}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#64748B', marginTop: 3, fontWeight: 700, letterSpacing: 0.5 }}>{depCode}</div>
        </div>

        <div style={{ flex: 1, paddingTop: 4 }}>
          <div style={{ position: 'relative', height: 18 }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#E2E8F0' }} />
            <span style={{ position: 'absolute', top: -3, left: 0, width: 7, height: 7, borderRadius: '50%', background: '#0A1628' }} />
            <span style={{ position: 'absolute', top: -3, right: 0, width: 7, height: 7, borderRadius: '50%', background: '#EF2E1F' }} />
            <span style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', fontSize: 13, color: '#EF2E1F' }}>✈</span>
            {stops > 0 && (
              <span style={{ position: 'absolute', top: -2, left: '45%', width: 4, height: 4, borderRadius: '50%', background: '#FF8C00' }} />
            )}
          </div>
          <div style={{ textAlign: 'center', fontSize: 10.5, color: '#64748B', marginTop: 4, fontWeight: 600 }}>
            {duration} · {stops === 0 ? (lang === 'tr' ? 'Aktarmasız' : 'Direct') : `${stops} ${lang === 'tr' ? 'aktarma' : 'stop'}`}
          </div>
        </div>

        <div style={{ minWidth: 56, textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 18, color: '#0A1628', letterSpacing: -0.3, lineHeight: 1 }}>{arrTime}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#64748B', marginTop: 3, fontWeight: 700, letterSpacing: 0.5 }}>{arrCode}</div>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginTop: 8, paddingTop: 8, borderTop: '1px dashed #E2E8F0',
        fontSize: 10.5, color: '#64748B',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0A1628' }}>{code}</span>
        <span>·</span><span>{plane}</span>
        {tag && <span style={{ marginLeft: 'auto' }}>{tag}</span>}
      </div>

      {/* fare family rows */}
      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {fares.map((f, i) => (
          <button key={i} onClick={() => onSelectFare(f)} style={{
            cursor: 'pointer', textAlign: 'left',
            padding: '8px 10px', borderRadius: 6,
            border: `1px solid ${f.color}33`,
            background: `${f.color}0E`,
            fontFamily: 'var(--font-ui)',
            transition: 'all .15s',
          }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: f.color }}>{f.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 2 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 14, color: '#0A1628' }}>{f.price}</span>
              <span style={{ fontSize: 10, color: '#64748B' }}>TL</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  ThyButton, ThyBadge, ThyCard, ThyChip, ThyTabs, ThyInput,
  ThyToast, ToastHost, useToast, DSFlightCard,
});
