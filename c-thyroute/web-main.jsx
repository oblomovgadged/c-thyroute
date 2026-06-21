// web-main.jsx — host shell: viewport switcher + browser frame + tweaks panel
//
// Renders one of the 23 web screens inside a faux browser frame that you can
// resize to desktop / laptop / tablet widths. The Tweaks panel exposes theme,
// accent, language, font, density, viewport — same model as the mobile app.

const WEB_SCREENS = [
  // A — DS-faithful core
  { id: 'splash',        num: '01', label: 'Landing',         tr: 'Ana sayfa',      comp: () => WebSplashScreen },
  { id: 'board',         num: '02', label: 'Dashboard',       tr: 'Pano',           comp: () => WebFlightBoardScreen },
  { id: 'search',        num: '03', label: 'Search',          tr: 'Uçuş Ara',       comp: () => WebSearchScreen },
  { id: 'results',       num: '04', label: 'Results',         tr: 'Sonuçlar',       comp: () => WebResultsScreen },
  { id: 'boarding',      num: '05', label: 'Boarding Pass',   tr: 'Biniş Kartı',    comp: () => WebBoardingPassScreen },
  { id: 'map',           num: '06', label: 'Route',           tr: 'Rota',           comp: () => WebMapScreen },
  { id: 'copilot',       num: '07', label: 'Co-Pilot',        tr: 'Yardımcı Pilot', comp: () => WebCoPilotScreen },
  { id: 'ms',            num: '08', label: 'Miles&Smiles',    tr: 'Miles&Smiles',   comp: () => WebMilesScreen },
  { id: 'notifications', num: '09', label: 'Notifications',   tr: 'Bildirimler',    comp: () => WebNotificationsScreen },
  { id: 'profile',       num: '10', label: 'Profile',         tr: 'Profil',         comp: () => WebProfileScreen },
  // B — each screen its own world
  { id: 'seat',          num: '11', label: 'Seat Map',        tr: 'Koltuk',         comp: () => WebSeatMapScreen },
  { id: 'passenger',     num: '12', label: 'Passenger',       tr: 'Yolcu',          comp: () => WebPassengerInfoScreen },
  { id: 'baggage',       num: '13', label: 'Baggage',         tr: 'Bagaj',          comp: () => WebBaggageScreen },
  { id: 'confirm',       num: '14', label: 'Confirmation',    tr: 'Onay',           comp: () => WebConfirmationScreen },
  { id: 'priceAlert',    num: '15', label: 'Price Alert',     tr: 'Fiyat Alarmı',   comp: () => WebPriceAlertScreen },
  { id: 'airport',       num: '16', label: 'Airport Picker',  tr: 'Havalimanı',     comp: () => WebAirportPickerScreen },
  { id: 'turkiyeTuru',   num: '17', label: 'Türkiye Tour',    tr: 'Türkiye Turu',   comp: () => WebTurkiyeTuruScreen },
  { id: 'turkiyeRoute',  num: '18', label: 'Tour Route',      tr: 'Tur Rotası',     comp: () => WebTurkiyeRouteScreen },
  { id: 'checkin',       num: '19', label: 'Check-in',        tr: 'Check-in',       comp: () => WebCheckInScreen },
  { id: 'history',       num: '20', label: 'History',         tr: 'Geçmiş',         comp: () => WebFlightHistoryScreen },
  { id: 'help',          num: '21', label: 'Help',            tr: 'Yardım',         comp: () => WebHelpSupportScreen },
  { id: 'lounge',        num: '22', label: 'Lounge',          tr: 'Lounge',         comp: () => WebLoungeScreen },
  { id: 'tkpay',         num: '23', label: 'TKPAY',           tr: 'TKPAY',          comp: () => WebTKPayScreen },

  // C — Ödeme akışı (Profil > Kayıtlı Rotalarım > Öde)
  { id: 'routes',        num: '24', label: 'Saved Routes',    tr: 'Rotalarım',      comp: () => WebSavedRoutesScreen },
  { id: 'payment',       num: '25', label: 'Payment',         tr: 'Ödeme',          comp: () => WebPaymentOptionsScreen },
  { id: 'travelPrefs',   num: '28', label: 'Travel Prefs',    tr: 'Tercihler',      comp: () => WebTravelPrefsScreen },
];

const VIEWPORTS = {
  desktop: { w: 1440, label: 'Desktop · 1440' },
  laptop:  { w: 1200, label: 'Laptop · 1200' },
  tablet:  { w: 1024, label: 'Tablet · 1024' },
};

function WebApp() {
  const [t, setTweak] = useTweaks({
    screen:   'splash',
    theme:    'auto',
    accent:   'red',
    language: 'tr',
    density:  'comfortable',
    font:     'outfit',
    viewport: 'desktop',
  });

  const screen = WEB_SCREENS.find(s => s.id === t.screen) || WEB_SCREENS[0];
  const Screen = screen.comp();
  const nav = React.useCallback((id) => {
    if (id && WEB_SCREENS.find(s => s.id === id)) setTweak('screen', id);
  }, [setTweak]);
  const isTR = t.language === 'tr';
  const vp = VIEWPORTS[t.viewport] || VIEWPORTS.desktop;

  // Friendly URL for the chrome
  const urlFor = (id) => {
    const s = WEB_SCREENS.find(x => x.id === id);
    return s ? `thy-route.com/${s.id === 'splash' ? '' : s.id.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}` : 'thy-route.com';
  };

  return (
    <div className="web-stage">
      {/* Toolbar — viewport + screen rail */}
      <div className="viewport-bar">
        <div className="vp-brand">
          <img src={(window.__resources?.logoBadge) || 'assets/logo-badge.png'} alt="" />
          <div>
            <div className="vp-title">THY ROUTE</div>
            <div className="vp-sub">{isTR ? 'WEB PROTOTİP' : 'WEB PROTOTYPE'}</div>
          </div>
        </div>
        <div className="vp-chips">
          {Object.entries(VIEWPORTS).map(([k, v]) => (
            <button key={k} className={`vp-chip ${t.viewport === k ? 'is-active' : ''}`}
              onClick={() => setTweak('viewport', k)}>
              {v.label}
            </button>
          ))}
        </div>
        <div className="vp-screen-select">
          <select
            value={t.screen}
            onChange={(e) => setTweak('screen', e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 999, border: '1px solid #E2E8F0',
              background: '#fff', color: '#0A1628', fontWeight: 700, fontSize: 12,
              fontFamily: 'var(--font-ui)', cursor: 'pointer',
            }}>
            {WEB_SCREENS.map(s => (
              <option key={s.id} value={s.id}>
                {s.num} · {isTR ? s.tr : s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Browser frame */}
      <div className="browser-frame" style={{ maxWidth: vp.w }}>
        <div className="browser-chrome">
          <div className="browser-dots"><span/><span/><span/></div>
          <div className="browser-address">
            <span className="dot" />
            <span>{urlFor(t.screen)}</span>
            <span style={{ flex: 1 }} />
            <span style={{ opacity: 0.5 }}>🔒</span>
          </div>
          <div className="browser-tools">
            <span style={{ width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>↺</span>
            <span style={{ width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>≡</span>
          </div>
        </div>
        <div className="browser-body" key={t.screen}>
          <Screen t={t} setTweak={setTweak} nav={nav} />
        </div>
      </div>

      {/* Tweaks panel — hidden until host opens */}
      <TweaksPanel title="Tweaks">
        <TweakSection label={isTR ? 'GÖSTERİM' : 'DISPLAY'} />
        <TweakRadio label={isTR ? 'Viewport' : 'Viewport'}
          value={t.viewport} options={[
            { value: 'desktop', label: '1440' },
            { value: 'laptop',  label: '1200' },
            { value: 'tablet',  label: '1024' },
          ]}
          onChange={(v) => setTweak('viewport', v)} />
        <TweakRadio label={isTR ? 'Tema' : 'Theme'}
          value={t.theme} options={[
            { value: 'auto',  label: isTR ? 'Oto' : 'Auto' },
            { value: 'light', label: isTR ? 'Açık' : 'Light' },
            { value: 'dark',  label: isTR ? 'Koyu' : 'Dark' },
          ]}
          onChange={(v) => setTweak('theme', v)} />
        <TweakRadio label={isTR ? 'Aksan' : 'Accent'}
          value={t.accent} options={[
            { value: 'red',  label: isTR ? 'Kırmızı' : 'Red' },
            { value: 'gold', label: isTR ? 'Altın'   : 'Gold' },
            { value: 'blue', label: isTR ? 'Mavi'    : 'Blue' },
          ]}
          onChange={(v) => setTweak('accent', v)} />

        <TweakSection label={isTR ? 'İÇERİK' : 'CONTENT'} />
        <TweakRadio label={isTR ? 'Dil' : 'Language'}
          value={t.language} options={[
            { value: 'tr', label: 'TR' },
            { value: 'en', label: 'EN' },
          ]}
          onChange={(v) => setTweak('language', v)} />
        <TweakRadio label={isTR ? 'Yoğunluk' : 'Density'}
          value={t.density} options={[
            { value: 'comfortable', label: isTR ? 'Geniş' : 'Comfort' },
            { value: 'compact',     label: isTR ? 'Sıkı'  : 'Compact' },
          ]}
          onChange={(v) => setTweak('density', v)} />
        <TweakSelect label={isTR ? 'Yazı tipi' : 'Font'}
          value={t.font} options={[
            { value: 'outfit', label: 'Outfit (DS)' },
            { value: 'inter',  label: 'Inter' },
            { value: 'system', label: isTR ? 'Sistem' : 'System' },
          ]}
          onChange={(v) => setTweak('font', v)} />

        <TweakSection label={isTR ? 'EKRAN' : 'SCREEN'} />
        <TweakSelect label={isTR ? 'Aktif ekran' : 'Active screen'}
          value={t.screen}
          options={WEB_SCREENS.map(s => ({ value: s.id, label: `${s.num} · ${isTR ? s.tr : s.label}` }))}
          onChange={(v) => setTweak('screen', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ToastHost>
    <WebApp />
  </ToastHost>
);
