// pnr-modal.jsx — Shared "Link a booking by PNR" modal used by Profile
// in both mobile and web.
//
// Stage 1: form (6-char PNR pad + last-name input)
// Stage 2: loading (fake fetch)
// Stage 3: result (flight card + 4 actions + "link permanently" toggle)
//
// Props: { open, onClose, lang, accent, dark, nav }
// Renders absolutely-positioned inside its nearest positioned ancestor —
// wrap the host screen with position: relative.

function PNRModal({ open, onClose, lang, accent, dark = false, nav }) {
  const isTR = lang === 'tr';
  const [pnr, setPnr]     = React.useState('');
  const [last, setLast]   = React.useState('');
  const [stage, setStage] = React.useState('form'); // 'form' | 'loading' | 'result'
  const [linkPerm, setLinkPerm] = React.useState(true);
  const hiddenRef = React.useRef(null);

  // Reset when closed
  React.useEffect(() => {
    if (!open) {
      const tId = setTimeout(() => { setStage('form'); setPnr(''); setLast(''); setLinkPerm(true); }, 280);
      return () => clearTimeout(tId);
    } else {
      // Focus PNR input
      const tId = setTimeout(() => hiddenRef.current?.focus(), 220);
      return () => clearTimeout(tId);
    }
  }, [open]);

  // Esc to close
  React.useEffect(() => {
    if (!open) return;
    const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  const valid = pnr.length === 6 && last.trim().length >= 2;
  const submit = () => {
    if (!valid) return;
    setStage('loading');
    setTimeout(() => setStage('result'), 1100);
  };
  const go = (id) => { onClose(); setTimeout(() => nav && nav(id), 200); };

  if (!open) return null;

  // PNR is displayed in 6 cells, but a single hidden input handles entry
  const onPnrChange = (e) => {
    let v = (e.target.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setPnr(v);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 90,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'pnrFade .22s ease-out',
      fontFamily: 'var(--font-ui)',
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(5,11,20,0.62)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      }} />

      {/* Card */}
      <div role="dialog" aria-modal="true" style={{
        position: 'relative', width: 'min(94%, 420px)', maxHeight: '90%',
        background: '#fff', borderRadius: 18,
        boxShadow: '0 30px 80px rgba(5,11,20,0.55), 0 0 0 1px rgba(197,160,89,0.18)',
        overflow: 'hidden', animation: 'pnrPop .32s cubic-bezier(.16,1,.3,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header — navy w/ gold eyebrow */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #0A1628 0%, #0F2244 70%, #1B3868 100%)',
          padding: '18px 20px 16px', color: '#fff',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(80% 60% at 80% 30%, rgba(197,160,89,0.32) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2.4,
                color: '#C5A059', fontWeight: 800,
              }}>✦ MILES&SMILES · PNR</div>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 17,
                marginTop: 4, letterSpacing: -0.2,
              }}>{isTR ? 'Rezervasyonu hesaba ekle' : 'Link booking to account'}</div>
            </div>
            <button onClick={onClose} aria-label="close" style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', width: 28, height: 28, borderRadius: 8, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
            }}>✕</button>
          </div>
        </div>

        {/* ── Stage: FORM ── */}
        {stage === 'form' && (
          <div style={{ padding: '18px 20px 16px' }}>
            <div style={{
              fontSize: 12, color: '#64748B', lineHeight: 1.5,
            }}>{isTR
              ? 'PNR (6 karakter) ve yolcunun soyadını girin. Rezervasyonu hesabınıza bağlayalım.'
              : 'Enter the 6-character PNR and the passenger surname. We will link the booking to your account.'}</div>

            {/* PNR — 6 cells */}
            <div style={{ marginTop: 16 }}>
              <label style={{
                fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 800,
                letterSpacing: 1.8, color: '#94A3B8', textTransform: 'uppercase',
              }}>PNR / {isTR ? 'Rezervasyon Kodu' : 'Record Locator'}</label>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }} onClick={() => hiddenRef.current?.focus()}>
                {Array.from({ length: 6 }).map((_, i) => {
                  const ch = pnr[i] || '';
                  const isActive = pnr.length === i;
                  return (
                    <div key={i} style={{
                      flex: 1, aspectRatio: '1 / 1.2',
                      borderRadius: 10, border: `1.5px solid ${ch ? '#0A1628' : isActive ? '#C5A059' : '#E2E8F0'}`,
                      background: ch ? '#FAFBFC' : '#fff',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800, color: '#0A1628',
                      letterSpacing: 0, transition: 'all 180ms',
                      boxShadow: isActive ? '0 0 0 3px rgba(197,160,89,0.18)' : 'none',
                      position: 'relative',
                    }}>
                      {ch}
                      {isActive && !ch && (
                        <span style={{
                          position: 'absolute', width: 2, height: 22, background: '#C5A059',
                          animation: 'pnrCaret 1.1s steps(2) infinite',
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
              <input ref={hiddenRef} value={pnr} onChange={onPnrChange}
                aria-label="PNR" inputMode="text" autoCapitalize="characters" autoComplete="off"
                maxLength={6}
                style={{
                  position: 'absolute', opacity: 0, pointerEvents: 'none',
                  width: 1, height: 1, left: -9999,
                }} />
              <div style={{
                marginTop: 4, fontSize: 10, color: '#94A3B8', fontFamily: 'var(--font-mono)',
              }}>{isTR ? 'Örn:' : 'e.g.'} <span style={{ color: '#0A1628', fontWeight: 700, letterSpacing: 1 }}>EBHHN3</span></div>
            </div>

            {/* Last name */}
            <div style={{ marginTop: 14 }}>
              <label style={{
                fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 800,
                letterSpacing: 1.8, color: '#94A3B8', textTransform: 'uppercase',
              }}>{isTR ? 'Soyad' : 'Surname'}</label>
              <input value={last} onChange={(e) => setLast(e.target.value.toUpperCase())}
                placeholder={isTR ? 'KAYA' : 'KAYA'}
                style={{
                  width: '100%', marginTop: 6, padding: '12px 14px',
                  border: '1.5px solid #E2E8F0', borderRadius: 10,
                  background: '#fff', outline: 'none',
                  fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600,
                  color: '#0A1628', letterSpacing: 0.5,
                }}
                onFocus={(e) => { e.target.style.borderColor = '#C5A059'; e.target.style.boxShadow = '0 0 0 3px rgba(197,160,89,0.18)'; }}
                onBlur={(e) =>  { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              <button onClick={onClose} style={{
                flex: 1, padding: '12px 14px', cursor: 'pointer',
                background: '#F3F5F8', color: '#0A1628',
                border: '1px solid #E2E8F0', borderRadius: 10,
                fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12.5,
              }}>{isTR ? 'Vazgeç' : 'Cancel'}</button>
              <button onClick={submit} disabled={!valid} style={{
                flex: 1.6, padding: '12px 14px', cursor: valid ? 'pointer' : 'not-allowed',
                background: valid
                  ? 'linear-gradient(135deg, #8E211D 0%, #B7312C 50%, #EF2E1F 100%)'
                  : '#CBD5E1',
                color: '#fff', border: 'none', borderRadius: 10,
                fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 13, letterSpacing: 0.3,
                boxShadow: valid ? '0 6px 16px rgba(183,49,44,0.32)' : 'none',
                transition: 'all 200ms',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>{isTR ? 'Rezervasyonu getir' : 'Retrieve booking'} →</button>
            </div>

            <div style={{
              marginTop: 12, padding: '8px 10px', background: '#FAFBFC',
              border: '1px dashed #CBD5E1', borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 10.5, color: '#64748B',
            }}>
              <span>🛡</span>
              {isTR
                ? 'Veri Gizlilik Politikası uyarınca işlenir · KVKK'
                : 'Data processed per Privacy Policy · GDPR'}
            </div>
          </div>
        )}

        {/* ── Stage: LOADING ── */}
        {stage === 'loading' && (
          <div style={{
            padding: '40px 20px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          }}>
            <div style={{ position: 'relative', width: 60, height: 60 }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '3px solid #E2E8F0', borderTopColor: '#B7312C',
                animation: 'pnrSpin 0.9s linear infinite',
              }} />
              <span style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', fontSize: 22, color: '#C5A059',
              }}>✈</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 2.5,
              color: '#94A3B8', fontWeight: 800,
            }}>{isTR ? 'REZERVASYON SORGULANIYOR' : 'RETRIEVING BOOKING'}</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>
              {isTR ? 'PNR ' : 'PNR '}<span style={{ fontFamily: 'var(--font-mono)', color: '#0A1628', fontWeight: 800, letterSpacing: 1 }}>{pnr}</span>
            </div>
          </div>
        )}

        {/* ── Stage: RESULT ── */}
        {stage === 'result' && (
          <div style={{ padding: '14px 18px 16px', overflow: 'auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(34,197,94,0.12)', color: '#16A34A',
              fontSize: 9.5, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
              {isTR ? 'Rezervasyon bulundu' : 'Booking found'}
            </div>

            {/* Mini flight card */}
            <div style={{
              marginTop: 10, padding: '14px 14px',
              background: 'linear-gradient(180deg, #fff 0%, #FAFBFC 100%)',
              border: '1px solid #E2E8F0', borderRadius: 12,
              boxShadow: '0 6px 18px rgba(10,22,40,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 800,
                  color: '#B7312C', letterSpacing: 1.5,
                  background: 'rgba(183,49,44,0.08)', padding: '3px 8px', borderRadius: 4,
                }}>TK 1853</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: '#64748B', letterSpacing: 1,
                }}>PNR · {pnr}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 26, color: '#0A1628', letterSpacing: -0.4, lineHeight: 1 }}>IST</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 3 }}>{isTR ? 'İstanbul' : 'Istanbul'}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: '#0A1628', marginTop: 4 }}>14:25</div>
                </div>
                <div style={{ flex: 1, position: 'relative', height: 14 }}>
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, borderTop: '1.5px dashed #CBD5E1' }} />
                  <span style={{
                    position: 'absolute', top: -8, left: '38%', fontSize: 14, color: '#B7312C',
                  }}>✈</span>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 26, color: '#0A1628', letterSpacing: -0.4, lineHeight: 1 }}>FCO</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 3 }}>{isTR ? 'Roma' : 'Rome'}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: '#0A1628', marginTop: 4 }}>16:50</div>
                </div>
              </div>
              <div style={{
                marginTop: 10, paddingTop: 10, borderTop: '1px dashed #CBD5E1',
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
                fontSize: 9, fontWeight: 800, letterSpacing: 1.2, color: '#94A3B8',
              }}>
                <PnrMini label="DATE"     value={isTR ? '17 Haz' : '17 Jun'} />
                <PnrMini label="GATE"     value="A12" />
                <PnrMini label="SEAT"     value="14F" />
                <PnrMini label="PAX"      value={last || 'KAYA'} />
              </div>
            </div>

            {/* 4 actions in 2×2 grid */}
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <ActionRow icon="map"     tint="#C5A059" label={isTR ? 'Rotama ekle'    : 'Add to route'}      onClick={() => go('map')} />
              <ActionRow icon="qr"      tint="#B7312C" label={isTR ? 'Check-in yap'   : 'Check-in'}          onClick={() => go('checkin')} />
              <ActionRow icon="edit"    tint="#0053A5" label={isTR ? 'Koltuk değiştir' : 'Change seat'}      onClick={() => go('seat')} />
              <ActionRow icon="doc"     tint="#0E7A5F" label={isTR ? 'Bileti indir'   : 'Download ticket'}   onClick={onClose} />
            </div>

            {/* Permanent link toggle */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginTop: 12, padding: '10px 12px',
              background: '#FAFBFC', border: '1px solid #E2E8F0', borderRadius: 10,
              cursor: 'pointer',
            }}>
              <span onClick={() => setLinkPerm(!linkPerm)} style={{
                width: 36, height: 22, borderRadius: 999, position: 'relative',
                background: linkPerm ? '#16A34A' : '#CBD5E1', transition: 'background 200ms',
                flexShrink: 0,
              }}>
                <span style={{
                  position: 'absolute', top: 2, left: linkPerm ? 16 : 2,
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 200ms',
                }} />
              </span>
              <div style={{ flex: 1 }} onClick={() => setLinkPerm(!linkPerm)}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0A1628' }}>
                  {isTR ? 'Kalıcı olarak hesaba bağla' : 'Link permanently to account'}
                </div>
                <div style={{ fontSize: 10.5, color: '#64748B' }}>
                  {isTR ? 'Sonraki girişlerde otomatik gözükür' : 'Will appear in future sessions'}
                </div>
              </div>
            </label>

            <button onClick={onClose} style={{
              width: '100%', marginTop: 10, padding: '12px 14px',
              background: '#fff', color: '#0A1628',
              border: '1px solid #E2E8F0', borderRadius: 10, cursor: 'pointer',
              fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12.5,
            }}>{isTR ? 'Kapat' : 'Close'}</button>
          </div>
        )}
      </div>
    </div>
  );
}

function PnrMini({ label, value }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ color: '#94A3B8' }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 800,
        color: '#0A1628', letterSpacing: 0.5, marginTop: 1,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{value}</div>
    </div>
  );
}

function ActionRow({ icon, tint, label, onClick }) {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '11px 12px', background: h ? '#fff' : '#FAFBFC',
        border: '1px solid ' + (h ? `${tint}55` : '#E2E8F0'),
        borderRadius: 10, cursor: 'pointer', textAlign: 'left',
        boxShadow: h ? `0 4px 14px ${tint}22` : 'none',
        transition: 'all 200ms', fontFamily: 'var(--font-ui)',
      }}>
      <span style={{
        width: 30, height: 30, borderRadius: 8,
        background: `${tint}1A`, color: tint,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}><Icon name={icon} size={15} /></span>
      <span style={{ flex: 1, fontWeight: 700, fontSize: 12, color: '#0A1628', lineHeight: 1.2 }}>
        {label}
      </span>
    </button>
  );
}

Object.assign(window, { PNRModal });
