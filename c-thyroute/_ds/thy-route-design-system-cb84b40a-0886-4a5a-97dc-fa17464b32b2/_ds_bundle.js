/* @ds-bundle: {"format":3,"namespace":"THYRouteDesignSystem_cb84b4","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Tabs","sourcePath":"components/core/Tabs.jsx"},{"name":"Toast","sourcePath":"components/core/Toast.jsx"},{"name":"BoardingPass","sourcePath":"components/travel/BoardingPass.jsx"},{"name":"FlightCard","sourcePath":"components/travel/FlightCard.jsx"},{"name":"PartnerItem","sourcePath":"components/travel/PartnerItem.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"d1337bc62fcc","components/core/Button.jsx":"dfad65ef8599","components/core/Card.jsx":"20955c11cbf4","components/core/Chip.jsx":"0b4f56de5e0b","components/core/Input.jsx":"b1f7ce165e5d","components/core/Tabs.jsx":"c9fe07f94144","components/core/Toast.jsx":"48826cd6632c","components/travel/BoardingPass.jsx":"fceeee521448","components/travel/FlightCard.jsx":"ad47d428b24e","components/travel/PartnerItem.jsx":"14205f789f70","ui_kits/booking_portal/app.jsx":"66088b8c5e8c","ui_kits/cockpit/app.jsx":"98f1aa7ae4b6"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.THYRouteDesignSystem_cb84b4 = window.THYRouteDesignSystem_cb84b4 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * THY Route — Badge
 * Compact status & label pills. `status` shows the live blinking dot
 * used in the flight board; `mono` renders trip codes; `gold`,
 * `outbound`, `inbound` map to fare / leg accents.
 */
function Badge({
  variant = 'status',
  children,
  style = {},
  ...rest
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-ui)',
    fontWeight: 800,
    fontSize: '9px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid transparent',
    whiteSpace: 'nowrap'
  };
  const variants = {
    status: {
      background: '#F8FAFC',
      borderColor: 'var(--thy-red)',
      color: 'var(--thy-red-light)',
      fontSize: '11px',
      letterSpacing: '1.5px',
      fontWeight: 700
    },
    gold: {
      background: 'rgba(197,160,89,0.12)',
      borderColor: 'var(--thy-gold)',
      color: 'var(--thy-gold-light)'
    },
    outbound: {
      background: 'rgba(59,130,246,0.08)',
      borderColor: 'rgba(59,130,246,0.3)',
      color: '#3b82f6'
    },
    inbound: {
      background: 'rgba(197,160,89,0.08)',
      borderColor: 'rgba(197,160,89,0.3)',
      color: 'var(--thy-gold)'
    },
    red: {
      background: 'var(--thy-red)',
      borderColor: 'var(--thy-red)',
      color: '#fff',
      boxShadow: '0 0 6px rgba(183,49,44,0.4)'
    },
    mono: {
      background: 'rgba(197,160,89,0.15)',
      borderColor: 'var(--thy-gold)',
      color: 'var(--thy-gold)',
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      fontWeight: 600,
      borderRadius: 'var(--radius-sm)',
      textTransform: 'none',
      letterSpacing: '0.5px'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), variant === 'status' && /*#__PURE__*/React.createElement("span", {
    style: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: 'var(--thy-red-light)',
      animation: 'thyDotBlink 1.5s ease-in-out infinite'
    }
  }), children, /*#__PURE__*/React.createElement("style", null, `@keyframes thyDotBlink { 0%,100% { opacity: 1 } 50% { opacity: 0.3 } }`));
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * THY Route — Button
 * Aviation-grade buttons with shimmer sweep on hover.
 * Variants mirror the live product: primary (red pill), secondary
 * (glass), gold (business class), and search (square red CTA).
 */
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon = null,
  children,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    fontFamily: 'var(--font-ui)',
    fontWeight: 700,
    letterSpacing: '0.5px',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    whiteSpace: 'nowrap',
    position: 'relative',
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    transition: 'transform var(--transition-base), background var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base), color var(--transition-base)',
    transform: active ? 'scale(0.96)' : hover ? 'translateY(-1px)' : 'none'
  };
  const sizes = {
    sm: {
      padding: '6px 14px',
      fontSize: '11px',
      borderRadius: 'var(--radius-md)'
    },
    md: {
      padding: '11px 28px',
      fontSize: '13px',
      borderRadius: 'var(--radius-xl)'
    },
    lg: {
      padding: '14px 34px',
      fontSize: '15px',
      borderRadius: 'var(--radius-xl)'
    }
  };
  const variants = {
    primary: {
      background: hover ? 'linear-gradient(135deg, #EF2E1F 0%, #D42218 50%, #C9201A 100%)' : 'linear-gradient(135deg, #C9201A 0%, #EF2E1F 50%, #D42218 100%)',
      color: '#fff',
      borderColor: 'rgba(255,255,255,0.12)',
      boxShadow: hover ? '0 6px 22px rgba(183,49,44,0.5), 0 1px 0 rgba(255,255,255,0.1) inset' : '0 3px 14px rgba(183,49,44,0.38), 0 1px 0 rgba(255,255,255,0.1) inset',
      textShadow: '0 1px 2px rgba(0,0,0,0.25)'
    },
    secondary: {
      background: hover ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.055)',
      color: hover ? 'var(--thy-gold-light)' : 'var(--text-secondary)',
      borderColor: hover ? 'rgba(197,160,89,0.35)' : 'rgba(255,255,255,0.12)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)'
    },
    gold: {
      background: 'linear-gradient(135deg, #C5A059 0%, #E8C97A 35%, #C5A059 65%, #A0813C 100%)',
      backgroundSize: '200% 100%',
      backgroundPosition: hover ? '100% 0' : '0 0',
      color: 'var(--thy-navy)',
      fontWeight: 800,
      borderColor: 'rgba(255,255,255,0.2)',
      boxShadow: hover ? '0 6px 28px rgba(197,160,89,0.48), 0 1px 0 rgba(255,255,255,0.2) inset' : '0 3px 16px rgba(197,160,89,0.32), 0 1px 0 rgba(255,255,255,0.2) inset',
      textShadow: '0 1px 2px rgba(255,255,255,0.2)'
    },
    search: {
      background: hover ? 'var(--thy-red)' : 'var(--thy-red-light)',
      color: '#fff',
      borderRadius: 'var(--radius-md)',
      fontWeight: 700
    }
  };
  const disabledStyle = disabled ? {
    background: '#E4E4E4',
    color: '#848484',
    borderColor: '#E4E4E4',
    opacity: 0.5,
    boxShadow: 'none',
    transform: 'none'
  } : {};
  const merged = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...disabledStyle,
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    style: merged,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false)
  }, rest), !disabled && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 0,
      left: hover ? '120%' : '-60%',
      width: '40%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
      transform: 'skewX(-20deg)',
      pointerEvents: 'none',
      opacity: hover ? 1 : 0,
      transition: hover ? 'left 0.55s ease, opacity 0.1s' : 'none'
    }
  }), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      fontSize: '14px'
    }
  }, icon), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * THY Route — Card
 * Glass surface for the dark cockpit panels. `glass` is the ultra-thin
 * default; `solid` is the elevated navy card; `light` is the white
 * booking-portal card. Set `interactive` for the hover-lift + red glow.
 */
function Card({
  variant = 'glass',
  interactive = false,
  children,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const base = {
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    border: '1px solid',
    transition: 'transform var(--transition-base), background-color var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base)'
  };
  const variants = {
    glass: {
      background: hover && interactive ? 'var(--card-glass-hover)' : 'var(--card-glass)',
      borderColor: hover && interactive ? 'var(--card-border-hover)' : 'var(--card-border)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)'
    },
    solid: {
      background: hover && interactive ? 'var(--bg-card-hover)' : 'var(--bg-card)',
      borderColor: hover && interactive ? 'var(--thy-red)' : 'var(--border-subtle)'
    },
    light: {
      background: 'var(--surface-light)',
      borderColor: 'var(--border-light)',
      color: 'var(--text-on-light)',
      boxShadow: 'var(--shadow-light)',
      borderRadius: 'var(--radius-md)'
    }
  };
  const lift = interactive && hover ? {
    transform: 'translateY(-4px)',
    boxShadow: 'var(--shadow-lg), var(--shadow-glow)'
  } : {};
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...base,
      ...variants[variant],
      ...lift,
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * THY Route — Chip
 * Filter / category pill. Toggles to a gold active state. Optional
 * leading icon (line SVG). Used in the Places filter row.
 */
function Chip({
  active = false,
  icon = null,
  children,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const on = active;
  const s = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    fontFamily: 'var(--font-ui)',
    fontSize: '11px',
    fontWeight: 600,
    borderRadius: 'var(--radius-full)',
    cursor: 'pointer',
    border: `1px solid ${on || hover ? 'var(--thy-gold)' : 'var(--border-subtle)'}`,
    color: on || hover ? 'var(--thy-gold-light)' : 'var(--text-secondary)',
    background: on ? 'rgba(197,160,89,0.12)' : hover ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
    boxShadow: on ? '0 2px 8px rgba(197,160,89,0.1)' : 'none',
    transition: 'all var(--transition-base)',
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    style: s,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, icon), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * THY Route — Input
 * Dark-panel text field with gold focus glow. Pair with an optional
 * uppercase gold label. `mono` switches to JetBrains Mono for codes.
 */
function Input({
  label,
  mono = false,
  style = {},
  wrapStyle = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const field = {
    width: '100%',
    padding: '10px 14px',
    background: focus ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.25)',
    border: `1px solid ${focus ? 'var(--thy-gold)' : 'var(--border-subtle)'}`,
    borderRadius: 'var(--radius-sm)',
    color: mono ? 'var(--thy-gold)' : 'var(--text-primary)',
    fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
    fontSize: '13px',
    outline: 'none',
    boxShadow: focus ? '0 0 10px rgba(197,160,89,0.15)' : 'none',
    transition: 'all var(--transition-base)',
    boxSizing: 'border-box',
    ...style
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-xs)',
      ...wrapStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--thy-gold)'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    style: field,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Tabs.jsx
try { (() => {
/**
 * THY Route — Tabs
 * The cockpit panel tab bar. Active tab glows red with an underline
 * sweep. Each item: { id, label, icon? }.
 */
function Tabs({
  items = [],
  value,
  onChange = () => {},
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      background: 'rgba(0,0,0,0.2)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      ...style
    }
  }, items.map(it => {
    const active = it.id === value;
    return /*#__PURE__*/React.createElement(TabButton, {
      key: it.id,
      item: it,
      active: active,
      onClick: () => onChange(it.id)
    });
  }));
}
function TabButton({
  item,
  active,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      flex: 1,
      padding: '10px 4px',
      fontFamily: 'var(--font-ui)',
      fontSize: '9px',
      fontWeight: 700,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      cursor: 'pointer',
      position: 'relative',
      border: 'none',
      color: active ? 'var(--thy-red-light)' : hover ? 'var(--text-primary)' : 'rgba(178,192,209,0.6)',
      background: active ? 'rgba(183,49,44,0.06)' : hover ? 'rgba(255,255,255,0.04)' : 'transparent',
      transition: 'all var(--transition-base)'
    }
  }, item.icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, item.icon), item.label, active && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: '15%',
      right: '15%',
      height: '2px',
      background: 'linear-gradient(90deg, transparent, var(--thy-red), transparent)',
      borderRadius: 'var(--radius-full)'
    }
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/core/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * THY Route — Toast
 * Frosted pill notification. `type` sets the accent border
 * (success/error/info). Render inside a bottom-centered stack.
 */
function Toast({
  type = 'info',
  icon = null,
  children,
  style = {},
  ...rest
}) {
  const accents = {
    success: '#22C55E',
    error: 'var(--thy-red)',
    info: 'var(--thy-gold)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-sm)',
      padding: 'var(--space-sm) var(--space-lg)',
      background: 'var(--bg-glass)',
      border: `1px solid ${accents[type]}`,
      borderRadius: 'var(--radius-full)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-ui)',
      fontSize: '13px',
      fontWeight: 500,
      boxShadow: 'var(--shadow-lg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, icon), children);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Toast.jsx", error: String((e && e.message) || e) }); }

// components/travel/BoardingPass.jsx
try { (() => {
/**
 * THY Route — BoardingPass
 * The domestic-leg connector card shown in the route list when a trip
 * is split across cities. Blue French-Blue gradient with an animated
 * plane gliding left→right along the route.
 */
function BoardingPass({
  flightCode = 'TK 2412',
  fromCode = 'IST',
  toCode = 'AYT',
  fromCity = 'İstanbul',
  toCity = 'Antalya',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(0,83,165,0.18), rgba(0,60,120,0.10))',
      border: '1px solid rgba(0,83,165,0.35)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      minWidth: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 18,
      fontWeight: 800,
      color: 'var(--text-primary)'
    }
  }, fromCode), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--text-muted)'
    }
  }, fromCity)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: 'relative',
      height: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: 2,
      background: 'rgba(0,83,165,0.4)',
      borderTop: '1px dashed rgba(120,170,230,0.5)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 'calc(50% - 9px)',
      fontSize: 14,
      color: 'var(--thy-blue)',
      animation: 'thyPlaneMove 3.2s ease-in-out infinite'
    }
  }, "\u2708"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -14,
      left: '50%',
      transform: 'translateX(-50%)',
      fontFamily: 'var(--font-ui)',
      fontSize: 8,
      fontWeight: 800,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "\u0130\xE7 Hat")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      minWidth: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 18,
      fontWeight: 800,
      color: 'var(--text-primary)'
    }
  }, toCode), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--text-muted)'
    }
  }, toCity)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--thy-gold)',
      background: 'rgba(197,160,89,0.12)',
      border: '1px solid rgba(197,160,89,0.3)',
      borderRadius: 'var(--radius-sm)',
      padding: '3px 8px'
    }
  }, flightCode)), /*#__PURE__*/React.createElement("style", null, `@keyframes thyPlaneMove { 0%,100% { left: 8%; opacity: .6 } 50% { left: 78%; opacity: 1 } }`));
}
Object.assign(__ds_scope, { BoardingPass });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/travel/BoardingPass.jsx", error: String((e && e.message) || e) }); }

// components/travel/FlightCard.jsx
try { (() => {
/**
 * THY Route — FlightCard
 * The light-themed flight result row from the booking portal: big times,
 * IATA codes, a route line with a red arrival dot, and fare-family price
 * columns on the right (EcoFly / BusinessFly etc).
 */
function FlightCard({
  depTime = '09:40',
  arrTime = '12:15',
  depCode = 'IST',
  arrCode = 'FCO',
  depCity = 'İstanbul',
  arrCity = 'Roma',
  duration = '2s 35dk',
  aircraft = 'Airbus A321neo',
  fares = [{
    name: 'EcoFly',
    price: '6.480',
    color: 'var(--fare-ecofly)'
  }, {
    name: 'BusinessFly',
    price: '14.250',
    color: 'var(--fare-businessfly)'
  }],
  currency = 'TL',
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      background: '#fff',
      border: '1px solid #E2E8F0',
      borderRadius: 'var(--radius-sm)',
      boxShadow: hover ? '0 4px 16px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.06)',
      borderColor: hover ? '#CBD5E1' : '#E2E8F0',
      transition: 'box-shadow .2s ease, border-color .2s ease',
      fontFamily: 'var(--font-ui)',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 320px',
      padding: '16px 22px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(TimeBlock, {
    time: depTime,
    code: depCode,
    city: depCity
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 160,
      minWidth: 80,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      color: '#64748B',
      marginBottom: 6
    }
  }, duration), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: 2,
      background: '#CBD5E1'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '50%',
      left: -1,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: '#94A3B8',
      transform: 'translateY(-50%)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '50%',
      right: -1,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--thy-red-bright)',
      transform: 'translateY(-50%)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -8,
      left: 'calc(50% - 6px)',
      fontSize: 11,
      transform: 'rotate(90deg)'
    }
  }, "\u2708")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: '#64748B',
      marginTop: 6
    }
  }, "Aktarmas\u0131z")), /*#__PURE__*/React.createElement(TimeBlock, {
    time: arrTime,
    code: arrCode,
    city: arrCity
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 10,
      fontWeight: 500,
      color: '#64748B'
    }
  }, /*#__PURE__*/React.createElement("span", null, aircraft), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#CBD5E1'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#0066CC',
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "U\xE7u\u015F detaylar\u0131 \u203A"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderLeft: '1px solid #E2E8F0',
      minWidth: 280
    }
  }, fares.map((f, i) => /*#__PURE__*/React.createElement(FareBox, {
    key: i,
    fare: f,
    currency: currency,
    last: i === fares.length - 1
  }))));
}
function TimeBlock({
  time,
  code,
  city
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: 56
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: '#0A1628',
      lineHeight: 1.15,
      letterSpacing: '-0.3px'
    }
  }, time), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: '#0A1628',
      letterSpacing: '0.5px',
      marginTop: 2
    }
  }, code), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 500,
      color: '#64748B',
      marginTop: 1,
      maxWidth: 90,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, city));
}
function FareBox({
  fare,
  currency,
  last
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      flex: 1,
      minWidth: 140,
      border: 'none',
      borderRight: last ? 'none' : '1px solid #E2E8F0',
      background: hover ? '#F8FAFC' : '#fff',
      cursor: 'pointer',
      padding: '12px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'flex-start',
      transition: 'background .15s ease',
      fontFamily: 'var(--font-ui)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      color: fare.color
    }
  }, fare.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: '#0A1628'
    }
  }, fare.price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: '#64748B'
    }
  }, currency)));
}
Object.assign(__ds_scope, { FlightCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/travel/FlightCard.jsx", error: String((e && e.message) || e) }); }

// components/travel/PartnerItem.jsx
try { (() => {
/**
 * THY Route — PartnerItem
 * A Miles&Smiles partner row from the M&S panel: brand icon, name,
 * mileage offer, and a "find on map" action.
 */
function PartnerItem({
  name = 'Avis',
  offer = 'Kiralama başına min. 125 Mil Kazanın',
  icon = null,
  actionLabel = 'Haritada Bul',
  onAction = () => {},
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: hover ? 'var(--bg-card-hover)' : 'var(--card-glass)',
      border: `1px solid ${hover ? 'var(--card-border-hover)' : 'var(--card-border)'}`,
      transition: 'all var(--transition-base)',
      fontFamily: 'var(--font-ui)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      flexShrink: 0,
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(183,49,44,0.12)',
      color: 'var(--thy-red-light)',
      border: '1px solid rgba(183,49,44,0.2)'
    }
  }, icon || '✈'), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--text-primary)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, offer))), /*#__PURE__*/React.createElement("button", {
    onClick: onAction,
    style: {
      flexShrink: 0,
      padding: '6px 12px',
      fontSize: 11,
      fontWeight: 600,
      fontFamily: 'var(--font-ui)',
      borderRadius: 'var(--radius-xl)',
      cursor: 'pointer',
      background: 'rgba(255,255,255,0.055)',
      color: 'var(--text-secondary)',
      border: '1px solid rgba(255,255,255,0.12)',
      whiteSpace: 'nowrap',
      transition: 'all var(--transition-base)'
    }
  }, actionLabel));
}
Object.assign(__ds_scope, { PartnerItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/travel/PartnerItem.jsx", error: String((e && e.message) || e) }); }

// ui_kits/booking_portal/app.jsx
try { (() => {
const {
  useState
} = React;
const DS = window.THYRouteDesignSystem_cb84b4;
const {
  Button,
  FlightCard,
  Badge
} = DS;

/* ---------- Header ---------- */
function Header() {
  const nav = ['Uçuş Bileti', 'Keşfet', 'Seyahat Deneyimi', 'Miles&Smiles'];
  const [active, setActive] = useState(0);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 70,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(10,22,40,0.95)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      position: 'relative',
      zIndex: 10,
      padding: '0 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 1200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/thy-logo-horizontal-ondark.svg",
    alt: "Turkish Airlines",
    style: {
      height: 28,
      width: 'auto',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, nav.map((n, i) => /*#__PURE__*/React.createElement("a", {
    key: n,
    href: "#",
    onClick: e => {
      e.preventDefault();
      setActive(i);
    },
    style: {
      fontSize: 13,
      fontWeight: 600,
      padding: '8px 12px',
      color: i === active ? '#fff' : 'rgba(255,255,255,0.85)',
      borderBottom: `2px solid ${i === active ? 'var(--thy-red-light)' : 'transparent'}`
    }
  }, n))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid var(--border-subtle)',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: 'var(--radius-full)',
      fontSize: 11,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "\uD83C\uDF10 EN"), /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'transparent',
      border: '1.5px solid #fff',
      color: '#fff',
      padding: '6px 22px',
      borderRadius: 'var(--radius-full)',
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "Giri\u015F Yap"))));
}

/* ---------- Booking form cell ---------- */
function Cell({
  label,
  children,
  sub,
  w,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: w,
      padding: '8px 16px 6px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderRight: '1px solid #E2E8F0',
      minHeight: 64,
      position: 'relative',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: '#64748B',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 2
    }
  }, label), children, sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      color: '#64748B',
      lineHeight: 1.2
    }
  }, sub));
}
const cellInput = {
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--thy-navy)',
  width: '100%',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  padding: 0,
  height: 24,
  fontFamily: 'var(--font-ui)'
};
function Radio({
  label,
  checked,
  onClick
}) {
  return /*#__PURE__*/React.createElement("label", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--thy-navy)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      border: `2px solid ${checked ? 'var(--thy-blue)' : '#94A3B8'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: 'var(--thy-blue)',
      transform: checked ? 'scale(1)' : 'scale(0)',
      transition: 'transform var(--transition-fast)'
    }
  })), label);
}
function BookingCard({
  onSearch,
  trip,
  setTrip,
  from,
  to,
  setFrom,
  setTo
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      background: '#fff',
      borderRadius: 8,
      padding: 24,
      boxShadow: 'var(--shadow-light)',
      color: 'var(--thy-navy)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Radio, {
    label: "Gidi\u015F - D\xF6n\xFC\u015F",
    checked: trip === 'round',
    onClick: () => setTrip('round')
  }), /*#__PURE__*/React.createElement(Radio, {
    label: "Tek y\xF6n",
    checked: trip === 'oneway',
    onClick: () => setTrip('oneway')
  }), /*#__PURE__*/React.createElement(Radio, {
    label: "\u0130stanbul'da Stopover",
    checked: trip === 'stop',
    onClick: () => setTrip('stop')
  }), /*#__PURE__*/React.createElement(Radio, {
    label: "\xC7oklu u\xE7u\u015F",
    checked: trip === 'multi',
    onClick: () => setTrip('multi')
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 4,
      border: '2px solid #94A3B8'
    }
  }), "\xD6d\xFCl bilet - Millerinizle bilet al\u0131n")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      position: 'relative',
      background: '#F3F5F8',
      border: '1px solid #E2E8F0',
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement(Cell, {
    label: "Nereden",
    sub: "T\xFCm havalimanlar\u0131",
    w: "24%",
    style: {
      borderTopLeftRadius: 6,
      borderBottomLeftRadius: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: cellInput,
    value: from,
    onChange: e => setFrom(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '24%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setFrom(to);
      setTo(from);
    },
    style: {
      width: 32,
      height: 32,
      background: '#fff',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--thy-navy)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "16",
    height: "16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17 3L21 7L17 11M21 7H9M7 21L3 17L7 13M3 17H15"
  })))), /*#__PURE__*/React.createElement(Cell, {
    label: "Nereye",
    sub: "Gidece\u011Finiz \u015Fehir",
    w: "24%",
    style: {
      paddingLeft: 28
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: cellInput,
    value: to,
    onChange: e => setTo(e.target.value)
  })), /*#__PURE__*/React.createElement(Cell, {
    label: "Tarih",
    w: "22%"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700
    }
  }, "13 Haz ", trip === 'round' ? '— 28 Haz' : '')), /*#__PURE__*/React.createElement(Cell, {
    label: "Yolcu / Kabin S\u0131n\u0131f\u0131",
    w: "16%"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, "1 Yolcu / ECO ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#94A3B8'
    }
  }, "\u25BE"))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '14%'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onSearch,
    style: {
      width: '100%',
      height: '100%',
      background: 'var(--thy-red-light)',
      color: '#fff',
      fontWeight: 700,
      fontSize: 15,
      border: 'none',
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)'
    }
  }, "U\xE7u\u015F ara \u2192"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--thy-navy)'
    }
  }, "\uD83C\uDF10 T\xFCm u\xE7u\u015F noktalar\u0131n\u0131 g\xF6r"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--thy-navy)'
    }
  }, "\uD83D\uDD0D \xD6nceki aramalar\u0131m")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 12,
      color: '#64748B',
      textDecoration: 'underline'
    }
  }, "\uD83D\uDEE1\uFE0F KVKK & Gizlilik Politikas\u0131")));
}

/* ---------- Results ---------- */
function Tracker() {
  const steps = ['Gidiş Uçuşu', 'Dönüş Uçuşu', 'Yolcu bilgileri', 'Ödeme'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 16
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 14px',
      borderRadius: 6,
      background: i === 0 ? 'rgba(183,49,44,0.08)' : '#F3F5F8',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: i === 0 ? 'var(--thy-red)' : '#fff',
      color: i === 0 ? '#fff' : '#64748B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 11,
      fontWeight: 800,
      border: i === 0 ? 'none' : '1px solid #E2E8F0'
    }
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: i === 0 ? 700 : 500,
      color: i === 0 ? 'var(--thy-navy)' : '#64748B'
    }
  }, s))));
}
function Results({
  from,
  to,
  onBack,
  onSelect
}) {
  const flights = [{
    depTime: '07:25',
    arrTime: '09:55',
    depCode: 'IST',
    arrCode: 'FCO',
    depCity: from,
    arrCity: to,
    duration: '2s 30dk',
    aircraft: 'Boeing 737 MAX 8',
    fares: [{
      name: 'EcoFly',
      price: '5.940',
      color: 'var(--fare-ecofly)'
    }, {
      name: 'BusinessFly',
      price: '13.200',
      color: 'var(--fare-businessfly)'
    }]
  }, {
    depTime: '09:40',
    arrTime: '12:15',
    depCode: 'IST',
    arrCode: 'FCO',
    depCity: from,
    arrCity: to,
    duration: '2s 35dk',
    aircraft: 'Airbus A321neo',
    fares: [{
      name: 'EcoFly',
      price: '6.480',
      color: 'var(--fare-ecofly)'
    }, {
      name: 'BusinessFly',
      price: '14.250',
      color: 'var(--fare-businessfly)'
    }]
  }, {
    depTime: '14:10',
    arrTime: '16:45',
    depCode: 'IST',
    arrCode: 'FCO',
    depCity: from,
    arrCity: to,
    duration: '2s 35dk',
    aircraft: 'Airbus A330-300',
    fares: [{
      name: 'ExtraFly',
      price: '7.150',
      color: 'var(--fare-extrafly)'
    }, {
      name: 'BusinessPrime',
      price: '18.900',
      color: 'var(--fare-businessprime)'
    }]
  }, {
    depTime: '19:55',
    arrTime: '22:30',
    depCode: 'IST',
    arrCode: 'FCO',
    depCity: from,
    arrCity: to,
    duration: '2s 35dk',
    aircraft: 'Boeing 787-9 Dreamliner',
    fares: [{
      name: 'FlexFly',
      price: '8.620',
      color: 'var(--fare-flexfly)'
    }, {
      name: 'BusinessFly',
      price: '15.400',
      color: 'var(--fare-businessfly)'
    }]
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      background: '#fff',
      borderRadius: 8,
      padding: 24,
      boxShadow: 'var(--shadow-light)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#F3F5F8',
      borderRadius: 6,
      padding: '12px 16px',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      alignItems: 'center'
    }
  }, [['Nereden', from], ['Nereye', to], ['Gidiş', '13 Haz'], ['Dönüş', '28 Haz'], ['Yolcu', '1, ECO']].map(([l, v], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: '#64748B',
      textTransform: 'uppercase',
      letterSpacing: 0.5
    }
  }, l), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--thy-navy)'
    }
  }, v)))), /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: 'transparent',
      border: '1px solid #E2E8F0',
      color: 'var(--thy-navy)',
      padding: '8px 16px',
      borderRadius: 6,
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)'
    }
  }, "Yeniden u\xE7u\u015F ara \u2192")), /*#__PURE__*/React.createElement(Tracker, null), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 16,
      fontWeight: 800,
      color: 'var(--thy-navy)',
      margin: '4px 0 16px'
    }
  }, from, " - ", to, ", 13 Haziran Cumartesi"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, flights.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onClick: onSelect,
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(FlightCard, f)))));
}

/* ---------- App ---------- */
function App() {
  const [view, setView] = useState('search');
  const [trip, setTrip] = useState('round');
  const [from, setFrom] = useState('İstanbul (IST)');
  const [to, setTo] = useState('Roma (FCO)');
  const [toast, setToast] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      position: 'relative',
      background: 'linear-gradient(165deg, #0A1628 0%, #142D4F 40%, #1A3A60 55%, #B7312C 85%, #E31837 100%)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/AnaEkran.png",
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: 0.22,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 16px 48px'
    }
  }, view === 'search' && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 60,
      marginBottom: 28,
      color: '#fff',
      textShadow: '0 4px 16px rgba(0,0,0,0.4)'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontSize: 40,
      fontWeight: 900,
      letterSpacing: -1,
      margin: '0 0 8px'
    }
  }, "Yaz\u0131 Avrupa'n\u0131n en iyisiyle ke\u015Ffedin"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      margin: '0 0 16px',
      color: 'rgba(255,255,255,0.9)'
    }
  }, "Seyahat plan\u0131n\u0131z\u0131 olu\u015Fturun veya u\xE7u\u015F arayarak hemen biletinizi al\u0131n."), /*#__PURE__*/React.createElement("button", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: '#fff',
      border: '1.5px solid #fff',
      padding: '8px 32px',
      borderRadius: 4,
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(4px)',
      cursor: 'pointer'
    }
  }, "Ke\u015Ffet")), view === 'results' && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 40
    }
  }), view === 'search' ? /*#__PURE__*/React.createElement(BookingCard, {
    onSearch: () => setView('results'),
    trip,
    setTrip,
    from,
    to,
    setFrom,
    setTo
  }) : /*#__PURE__*/React.createElement(Results, {
    from: from,
    to: to,
    onBack: () => setView('search'),
    onSelect: () => {
      setToast(true);
      setTimeout(() => setToast(false), 2600);
    }
  }))), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 60
    }
  }, /*#__PURE__*/React.createElement(DS.Toast, {
    type: "success",
    icon: "\u2713"
  }, "U\xE7u\u015F se\xE7ildi \u2014 yolcu bilgilerine ge\xE7iliyor")));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/booking_portal/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cockpit/app.jsx
try { (() => {
const {
  useState,
  useEffect
} = React;
const DS = window.THYRouteDesignSystem_cb84b4;
const {
  Tabs,
  Badge,
  Button,
  Card,
  Input,
  Chip,
  BoardingPass,
  PartnerItem,
  Toast
} = DS;

/* ---------- inline line icons ---------- */
const Ico = {
  route: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "14",
    height: "14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "3",
    x2: "9",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "15",
    y1: "6",
    x2: "15",
    y2: "21"
  })),
  pin: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "14",
    height: "14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  })),
  mail: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "14",
    height: "14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "22,6 12,13 2,6"
  })),
  trips: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "14",
    height: "14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "7",
    width: "20",
    height: "14",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
  })),
  ms: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "14",
    height: "14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
  })),
  search: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "16",
    height: "16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  }))
};

/* ---------- Flight Board ---------- */
function FlightBoard() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const info = [['Uçuş', 'TK 1986', 'gold'], ['Kalkış', 'IST', ''], ['Varış', 'JFK', ''], ['Kapı', 'A12', '']];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 72,
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(90deg, rgba(8,16,30,0.97), rgba(10,22,40,0.94) 60%, rgba(12,20,36,0.97))',
      borderBottom: '1px solid var(--border-subtle)',
      boxShadow: '0 2px 24px rgba(0,0,0,0.55)',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      background: 'linear-gradient(90deg, transparent, var(--thy-red), var(--thy-gold), var(--thy-red), transparent)',
      animation: 'thyGlow 4s ease-in-out infinite'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 220,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/thy-logo-horizontal-ondark.svg",
    alt: "Turkish Airlines",
    style: {
      height: 32,
      width: 'auto',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 48
    }
  }, info.map(([l, v, g]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, l), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: 1,
      color: g ? 'var(--thy-gold)' : 'var(--text-primary)'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "status"
  }, "PLANLANIYOR")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      padding: '0 24px',
      minWidth: 120
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: 2,
      color: 'var(--thy-gold)'
    }
  }, now.toTimeString().slice(0, 5)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--text-muted)',
      letterSpacing: 1
    }
  }, "06 HAZ 2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingRight: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: '#0A1628',
      color: 'var(--thy-gold)',
      border: '1px solid var(--thy-gold)',
      borderRadius: 9999,
      padding: '6px 12px',
      fontSize: 11,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "\uD83C\uDF10 EN")), /*#__PURE__*/React.createElement("style", null, `@keyframes thyGlow { 0%,100% { opacity:.5 } 50% { opacity:1 } }`));
}

/* ---------- Map ---------- */
function MapArea() {
  const ctrls = ['✏️', '🗑️', '📍', '🔍'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/AnaEkran.png",
    alt: "map",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      filter: 'brightness(0.5) saturate(0.8)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle at 40% 45%, transparent, rgba(5,11,20,0.55))'
    }
  }), /*#__PURE__*/React.createElement("svg", {
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "32%",
    y1: "58%",
    x2: "48%",
    y2: "44%",
    stroke: "#EF2E1F",
    strokeWidth: "2",
    strokeDasharray: "5 5",
    opacity: "0.8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "48%",
    y1: "44%",
    x2: "61%",
    y2: "50%",
    stroke: "#EF2E1F",
    strokeWidth: "2",
    strokeDasharray: "5 5",
    opacity: "0.8"
  })), [['32%', '58%', '1'], ['48%', '44%', '2'], ['61%', '50%', '3']].map(([l, t, n]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      position: 'absolute',
      left: l,
      top: t,
      transform: 'translate(-50%,-50%)',
      width: 26,
      height: 26,
      borderRadius: '50%',
      background: 'var(--thy-red)',
      border: '2px solid #fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 12,
      fontWeight: 700,
      boxShadow: '0 0 14px rgba(239,46,31,0.6)'
    }
  }, n)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, ctrls.map((c, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    style: {
      width: 44,
      height: 44,
      borderRadius: 8,
      background: 'var(--bg-glass)',
      border: '1px solid var(--border-subtle)',
      color: '#fff',
      fontSize: 18,
      cursor: 'pointer',
      backdropFilter: 'blur(16px)',
      boxShadow: 'var(--shadow-md)'
    }
  }, c))));
}

/* ---------- Tab content ---------- */
function RouteTab() {
  const days = [['1', '#EF2E1F'], ['2', '#C5A059'], ['3', '#0053A5']];
  const [day, setDay] = useState('1');
  const wps = [['Sultanahmet', '41.0054, 28.9768'], ['Kapalıçarşı', '41.0108, 28.9680'], ['Galata Kulesi', '41.0256, 28.9744']];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text-primary)',
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--thy-red)'
    }
  }, "\u2708\uFE0F"), " Seyahat Rotas\u0131"), /*#__PURE__*/React.createElement(Badge, {
    variant: "mono"
  }, "TRIP-0001")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      marginBottom: 16,
      background: 'rgba(0,0,0,0.25)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 8,
      padding: 4
    }
  }, days.map(([d, c]) => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => setDay(d),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      fontSize: 11,
      fontWeight: 700,
      borderRadius: 4,
      cursor: 'pointer',
      color: 'var(--text-primary)',
      background: day === d ? 'rgba(183,49,44,0.15)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${day === d ? 'var(--thy-red)' : 'var(--border-subtle)'}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: c,
      boxShadow: `0 0 6px ${c}`
    }
  }), " G\xFCn ", d)), /*#__PURE__*/React.createElement("button", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 4,
      background: 'rgba(197,160,89,0.06)',
      border: '1px dashed rgba(197,160,89,0.4)',
      color: 'var(--thy-gold)',
      cursor: 'pointer'
    }
  }, "+")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginBottom: 14
    }
  }, wps.map(([name, coord], i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    variant: "solid",
    interactive: true,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: 'var(--thy-red)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 11,
      fontWeight: 700,
      flexShrink: 0
    }
  }, i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)'
    }
  }, coord))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(BoardingPass, {
    flightCode: "TK 2412",
    fromCode: "IST",
    toCode: "AYT",
    fromCity: "\u0130stanbul",
    toCity: "Antalya"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    size: "sm"
  }, "Kaydet"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    size: "sm"
  }, "Yeni Trip")), /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    fullWidth: true,
    size: "sm"
  }, "Yeni U\xE7u\u015F Ara / Ana Sayfa")));
}
function PlacesTab() {
  const [active, setActive] = useState('Restoranlar');
  const filters = ['Restoranlar', 'Oteller', 'Turistik', 'Kafeler', 'Alışveriş'];
  const places = [['Mikla Restaurant', 'The Marmara Pera, Beyoğlu', '4.6'], ['Pandeli', 'Mısır Çarşısı, Eminönü', '4.4'], ['Karaköy Lokantası', 'Kemankeş Mah., Karaköy', '4.7']];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Yer ara... (\xF6r. Ramen, Hotel)"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    icon: Ico.search
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      marginBottom: 16
    }
  }, filters.map(f => /*#__PURE__*/React.createElement(Chip, {
    key: f,
    active: f === active,
    onClick: () => setActive(f)
  }, f))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, places.map(([name, addr, rating], i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    variant: "glass",
    interactive: true,
    style: {
      display: 'flex',
      gap: 12,
      padding: 14,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 4,
      background: 'rgba(0,0,0,0.25)',
      border: '1px solid rgba(255,255,255,0.04)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, "\uD83C\uDF7D\uFE0F"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, addr), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--thy-gold)',
      marginTop: 2
    }
  }, "\u2605 ", rating)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: 'rgba(227,24,55,0.1)',
      color: 'var(--thy-red)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      flexShrink: 0
    }
  }, "+")))));
}
function ReportTab() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Al\u0131c\u0131 E-posta",
    type: "email",
    placeholder: "ornek@email.com"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "G\xF6nderen Ad\u0131",
    placeholder: "Gezgin Ad\u0131"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 8,
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden',
      background: 'rgba(10,22,40,0.5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      background: 'linear-gradient(135deg, rgba(183,49,44,0.95), rgba(142,33,29,0.95))',
      borderBottom: '2px solid var(--thy-gold)',
      textAlign: 'center',
      color: '#fff',
      fontWeight: 700,
      fontSize: 14
    }
  }, "\u2708\uFE0F THY Route \u2014 Seyahat Raporu"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      fontSize: 12,
      color: 'var(--text-secondary)',
      lineHeight: 1.6
    }
  }, "\u0130stanbul 3 g\xFCnl\xFCk rota \xB7 3 durak \xB7 TK 1986 IST\u2192JFK. Raporunuz al\u0131c\u0131ya g\xF6nderilmeye haz\u0131r.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    size: "sm",
    icon: "\uD83D\uDD17"
  }, "Davet Linki"), /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    fullWidth: true,
    size: "sm",
    icon: "\uD83D\uDCE7"
  }, "Rapor G\xF6nder")));
}
function TripsTab() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "glass",
    style: {
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      fontWeight: 700,
      letterSpacing: 0.5,
      marginBottom: 8,
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, "Cihaz E\u015Fitleme Kodu ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#10B981',
      display: 'flex',
      gap: 4,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#10B981',
      boxShadow: '0 0 6px #10B981'
    }
  }), "E\u015Fitlendi")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Input, {
    mono: true,
    defaultValue: "PILOT-9F2A-3C71",
    wrapStyle: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "Kopyala"))), [['TRIP-0001', 'İstanbul → Roma', 'TK 1986', true], ['TRIP-0002', 'İstanbul → Antalya', 'TK 2412', false]].map(([id, route, code, act]) => /*#__PURE__*/React.createElement(Card, {
    key: id,
    variant: "glass",
    interactive: true,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)'
    }
  }, id), act && /*#__PURE__*/React.createElement(Badge, {
    variant: "red"
  }, "AKT\u0130F")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text-primary)'
    }
  }, route), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--thy-gold-light)'
    }
  }, code)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    fullWidth: true
  }, "A\xE7"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    fullWidth: true
  }, "Sil")))));
}
function MsTab() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "glass",
    style: {
      fontSize: 12,
      color: 'var(--text-secondary)',
      lineHeight: 1.5
    }
  }, "\uD83D\uDCA1 Partner logolar\u0131na t\u0131klayarak \u015Fubeleri harita \xFCzerinde ke\u015Ffedin ve rotan\u0131za ekleyin."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: 1,
      color: 'var(--text-muted)',
      textTransform: 'uppercase'
    }
  }, "Ara\xE7 Kiralama"), /*#__PURE__*/React.createElement(PartnerItem, {
    name: "Avis",
    offer: "Kiralama ba\u015F\u0131na min. 125 Mil",
    icon: "\uD83D\uDE97"
  }), /*#__PURE__*/React.createElement(PartnerItem, {
    name: "Sixt",
    offer: "Kiralama ba\u015F\u0131na min. 100 Mil",
    icon: "\uD83D\uDE97"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: 1,
      color: 'var(--text-muted)',
      textTransform: 'uppercase'
    }
  }, "Otel"), /*#__PURE__*/React.createElement(PartnerItem, {
    name: "Hilton",
    offer: "Konaklama ba\u015F\u0131na 500 Mil",
    icon: "\uD83C\uDFE8"
  }), /*#__PURE__*/React.createElement(PartnerItem, {
    name: "Rixos",
    offer: "Konaklama ba\u015F\u0131na 750 Mil",
    icon: "\uD83C\uDFE8"
  }));
}

/* ---------- Side Panel ---------- */
function SidePanel() {
  const [tab, setTab] = useState('route');
  const items = [{
    id: 'route',
    label: 'Rota',
    icon: Ico.route
  }, {
    id: 'places',
    label: 'Yerler',
    icon: Ico.pin
  }, {
    id: 'email',
    label: 'Rapor',
    icon: Ico.mail
  }, {
    id: 'trips',
    label: 'Seyahatler',
    icon: Ico.trips
  }, {
    id: 'ms',
    label: 'M&S',
    icon: Ico.ms
  }];
  const content = {
    route: /*#__PURE__*/React.createElement(RouteTab, null),
    places: /*#__PURE__*/React.createElement(PlacesTab, null),
    email: /*#__PURE__*/React.createElement(ReportTab, null),
    trips: /*#__PURE__*/React.createElement(TripsTab, null),
    ms: /*#__PURE__*/React.createElement(MsTab, null)
  };
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'absolute',
      top: 88,
      right: 16,
      bottom: 16,
      width: 380,
      zIndex: 20,
      background: 'linear-gradient(170deg, var(--panel-surface) 0%, #0D1F3A 45%, var(--panel-surface-2) 100%)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      boxShadow: 'var(--shadow-panel)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backdropFilter: 'blur(20px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px',
      height: 40,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'linear-gradient(90deg, rgba(0,0,0,0.45), rgba(0,0,0,0.3))'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontSize: 9,
      fontWeight: 800,
      letterSpacing: 2,
      textTransform: 'uppercase',
      background: 'linear-gradient(90deg, var(--thy-gold), var(--thy-gold-light))',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }, "COCKPIT CONTROL PANEL"), /*#__PURE__*/React.createElement("button", {
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      fontSize: 14,
      width: 28,
      height: 28,
      borderRadius: '50%'
    }
  }, "\u2715")), /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: items
  }), /*#__PURE__*/React.createElement("div", {
    className: "panel-scroll",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 16
    }
  }, content[tab]));
}

/* ---------- App ---------- */
function App() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#050B14'
    }
  }, /*#__PURE__*/React.createElement(FlightBoard, null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(MapArea, null), /*#__PURE__*/React.createElement(SidePanel, null)));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cockpit/app.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.BoardingPass = __ds_scope.BoardingPass;

__ds_ns.FlightCard = __ds_scope.FlightCard;

__ds_ns.PartnerItem = __ds_scope.PartnerItem;

})();
