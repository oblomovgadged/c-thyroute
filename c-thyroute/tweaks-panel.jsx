// tweaks-panel.jsx — settings sidebar used by both mobile and web prototypes

function useTweaks(defaults) {
  const [state, setState] = React.useState(defaults);
  const setTweak = React.useCallback((key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);
  return [state, setTweak];
}

function TweaksPanel({ title, children }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 48, height: 48, borderRadius: '50%',
          background: '#0A1628', border: '2px solid #C5A059',
          color: '#C5A059', fontSize: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          transition: 'transform 200ms',
        }}
        title={title}
        aria-label="Tweaks panel"
      >
        ⚙
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(0,0,0,0.3)',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 9999,
        width: 280,
        background: '#0D1E35',
        borderLeft: '1px solid rgba(197,160,89,0.3)',
        padding: '24px 20px',
        overflowY: 'auto',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 260ms cubic-bezier(.16,1,.3,1)',
        boxShadow: open ? '-8px 0 32px rgba(0,0,0,0.5)' : 'none',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20, paddingBottom: 16,
          borderBottom: '1px solid rgba(197,160,89,0.2)',
        }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontWeight: 800,
            fontSize: 11, letterSpacing: 2, color: '#C5A059', textTransform: 'uppercase',
          }}>{title}</span>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: 'none', border: 'none', color: '#C5A059',
              fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: 4,
            }}
            aria-label="Close"
          >×</button>
        </div>
        {children}
      </div>
    </>
  );
}

function TweakSection({ label }) {
  return (
    <div style={{
      fontFamily: 'JetBrains Mono, monospace', fontWeight: 800,
      fontSize: 9, letterSpacing: 2, color: 'rgba(197,160,89,0.6)',
      textTransform: 'uppercase', marginTop: 16, marginBottom: 6,
      paddingTop: 12, borderTop: '1px solid rgba(197,160,89,0.1)',
    }}>
      {label}
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(241,229,204,0.6)',
        marginBottom: 6, fontWeight: 500,
      }}>{label}</div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
              cursor: 'pointer', transition: 'all 180ms',
              fontFamily: 'Inter, sans-serif',
              background: value === opt.value ? '#B7312C' : 'rgba(255,255,255,0.06)',
              color: value === opt.value ? '#fff' : 'rgba(241,229,204,0.7)',
              border: value === opt.value
                ? '1px solid rgba(183,49,44,0.8)'
                : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(241,229,204,0.6)',
        marginBottom: 6, fontWeight: 500,
      }}>{label}</div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '7px 10px', borderRadius: 8,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
          color: '#F1E5CC', fontFamily: 'Inter, sans-serif', fontSize: 12,
          fontWeight: 600, cursor: 'pointer', outline: 'none',
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} style={{ background: '#0D1E35' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
