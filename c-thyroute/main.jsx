// app.jsx — main shell: tweaks panel + screen rail + iOS & Android frames

// BoardingPass + PartnerItem are inlined in ui-bits.jsx (avoids the DS bundle's auto-mount errors)

const SCREENS = [
  // A — DS-faithful core flow (10)
  { id: 'splash',        num: '01', label: 'Splash',         tr: 'Hoş geldin',     comp: () => SplashScreen },
  { id: 'board',         num: '02', label: 'Flight Board',   tr: 'Uçuş Panosu',    comp: () => FlightBoardScreen },
  { id: 'search',        num: '03', label: 'Search',         tr: 'Uçuş Ara',       comp: () => SearchScreen },
  { id: 'results',       num: '04', label: 'Results',        tr: 'Sonuçlar',       comp: () => ResultsScreen },
  { id: 'boarding',      num: '05', label: 'Boarding Pass',  tr: 'Biniş Kartı',    comp: () => BoardingPassScreen },
  { id: 'map',           num: '06', label: 'Route',          tr: 'Rota',           comp: () => MapScreen },
  { id: 'copilot',       num: '07', label: 'Co-Pilot',       tr: 'Yardımcı Pilot', comp: () => CoPilotScreen },
  { id: 'ms',            num: '08', label: 'Miles&Smiles',   tr: 'Miles&Smiles',   comp: () => MilesScreen },
  { id: 'notifications', num: '09', label: 'Notifications',  tr: 'Bildirimler',    comp: () => NotificationsScreen },
  { id: 'profile',       num: '10', label: 'Profile',        tr: 'Profil',         comp: () => ProfileScreen },

  // B — Each screen runs its own visual reference
  { id: 'seat',          num: '11', label: 'Seat Map',       tr: 'Koltuk Seçimi',  comp: () => SeatMapScreen },
  { id: 'passenger',     num: '12', label: 'Passenger',      tr: 'Yolcu Bilgisi',  comp: () => PassengerInfoScreen },
  { id: 'baggage',       num: '13', label: 'Baggage',        tr: 'Bagaj',          comp: () => BaggageScreen },
  { id: 'confirm',       num: '14', label: 'Confirmation',   tr: 'Onay',           comp: () => ConfirmationScreen },
  { id: 'priceAlert',    num: '15', label: 'Price Alert',    tr: 'Fiyat Alarmı',   comp: () => PriceAlertScreen },
  { id: 'airport',       num: '16', label: 'Airport Picker', tr: 'Havalimanı',     comp: () => AirportPickerScreen },
  { id: 'turkiyeTuru',   num: '17', label: 'Türkiye Tour',   tr: 'Türkiye Turu',   comp: () => TurkiyeTuruScreen },
  { id: 'turkiyeRoute',  num: '18', label: 'Tour Route',     tr: 'Tur Rotası',     comp: () => TurkiyeRouteScreen },
  { id: 'checkin',       num: '19', label: 'Check-in',       tr: 'Check-in',       comp: () => CheckInScreen },
  { id: 'history',       num: '20', label: 'Flight History', tr: 'Geçmiş',         comp: () => FlightHistoryScreen },
  { id: 'help',          num: '21', label: 'Help',           tr: 'Yardım',         comp: () => HelpSupportScreen },
  { id: 'lounge',        num: '22', label: 'Lounge',         tr: 'Lounge',         comp: () => LoungeScreen },
  { id: 'qrScanner',     num: '23', label: 'QR Scanner',     tr: 'QR Tara',        comp: () => QRScannerScreen },
  { id: 'tkpay',         num: '24', label: 'TKPAY Wallet',   tr: 'TKPAY Cüzdan',   comp: () => TKPayScreen },
  { id: 'inviteAccept',  num: '25', label: 'Invite Accept',  tr: 'Davet Kabul',    comp: () => InviteAcceptScreen },

  // C — Ödeme akışı (Profil > Kayıtlı Rotalarım > Öde)
  { id: 'routes',        num: '26', label: 'Saved Routes',   tr: 'Rotalarım',      comp: () => SavedRoutesScreen },
  { id: 'payment',       num: '27', label: 'Payment',        tr: 'Ödeme',          comp: () => PaymentOptionsScreen },
  { id: 'travelPrefs',   num: '28', label: 'Travel Prefs',   tr: 'Tercihler',      comp: () => TravelPrefsScreen },
  // Note: CheckoutScreen removed from flow — baggage → confirm directly
];

function PrototypeApp() {
  const [t, setTweak] = useTweaks({
    screen: 'board',
    theme: 'auto',       // 'auto' | 'light' | 'dark'
    accent: 'red',       // 'red' | 'gold' | 'blue'
    language: 'tr',      // 'tr' | 'en'
    density: 'comfortable',
    font: 'outfit',
    frame: 'both',       // 'ios' | 'android' | 'both'
  });

  const screen = SCREENS.find(s => s.id === t.screen) || SCREENS[1];
  const Screen = screen.comp();
  const nav = React.useCallback((id) => setTweak('screen', id), [setTweak]);

  // Lang for the chip rail
  const isTR = t.language === 'tr';

  return (
    <div className="stage">
      {/* Top toolbar — screen rail */}
      <div className="toolbar">
        <div className="toolbar-brand">
          <img src={(typeof window !== 'undefined' && window.__resources?.logoBadge) || 'assets/logo-badge.png'} alt="" />
          <div>
            <div className="toolbar-brand-title">THY ROUTE</div>
            <div className="toolbar-brand-sub">{isTR ? 'MOBİL PROTOTİP' : 'MOBILE PROTOTYPE'}</div>
          </div>
        </div>
        <div className="toolbar-screens">
          {SCREENS.map(s => (
            <button key={s.id}
              className={`screen-chip ${t.screen === s.id ? 'is-active' : ''}`}
              onClick={() => nav(s.id)}>
              <span className="num">{s.num}</span>
              {isTR ? s.tr : s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Device pair */}
      <div className="devices">
        {(t.frame === 'ios' || t.frame === 'both') && (
          <div className="device-frame">
            <span className="device-label">iOS · {screen.num}</span>
            <IOSDevice width={372} height={780} dark={isDarkFor(t, screen.id)}>
              <Screen t={t} setTweak={setTweak} nav={nav} k="ios" />
            </IOSDevice>
          </div>
        )}
        {(t.frame === 'android' || t.frame === 'both') && (
          <div className="device-frame">
            <span className="device-label">Android · {screen.num}</span>
            <AndroidDevice width={372} height={780} dark={isDarkFor(t, screen.id)}>
              <Screen t={t} setTweak={setTweak} nav={nav} k="android" />
            </AndroidDevice>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="meta">
        <div className="meta-eyebrow">{isTR ? 'BU EKRAN' : 'THIS SCREEN'} · {screen.num}</div>
        <h2 className="meta-title">{isTR ? screen.tr : screen.label}</h2>
        <p className="meta-desc">{screenBlurb(screen.id, isTR)}</p>
      </div>

      {/* Tweaks panel (hidden until host opens it) */}
      <TweaksPanel title="Tweaks">
        <TweakSection label={isTR ? 'GÖSTERİM' : 'DISPLAY'} />
        <TweakRadio label={isTR ? 'Cihaz' : 'Frame'}
          value={t.frame} options={[
            { value: 'ios', label: 'iOS' },
            { value: 'android', label: 'Android' },
            { value: 'both', label: isTR ? 'İkisi' : 'Both' },
          ]}
          onChange={(v) => setTweak('frame', v)} />
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
          options={SCREENS.map(s => ({ value: s.id, label: `${s.num} · ${isTR ? s.tr : s.label}` }))}
          onChange={(v) => setTweak('screen', v)} />
      </TweaksPanel>
    </div>
  );
}

// Screens have built-in light/dark default; theme=auto respects that.
// theme=light forces all to light, theme=dark forces all to dark.
function isDarkFor(t, screenId) {
  if (t.theme === 'dark') return true;
  if (t.theme === 'light') return false;
  // auto: per-screen defaults
  if (['splash', 'boarding', 'map', 'ms', 'priceAlert', 'lounge', 'tkpay', 'inviteAccept'].includes(screenId)) return true;
  if (screenId === 'qrScanner') return true;
  return false;
}

function screenBlurb(id, isTR) {
  const tr = {
    splash:        'Onboarding · navy-altın gradient · biniş hevesi yüksek bir karşılama.',
    board:         'Ana sayfa · yaklaşan uçuş kartı header\'ı kırparak öne çıkıyor, hızlı işlemler + popüler rotalar + Türkiye Turu CTA.',
    search:        'Uçuş arama · trip type toggle, takas butonu, tarih kartları, pasajer sayacı.',
    results:       'Sonuçlar · DS FlightCard fare-family kolonlarıyla, gidiş/dönüş tabları, altın chip filtreler.',
    boarding:      'Biniş kartı · cockpit kapısı: QR, perfore kenar, uçak animasyonu, check-in CTA, lounge yönü.',
    map:           'Rota planı · dünya haritasının üstüne glass panel, çoklu durak + iç hat boarding-pass bacağı.',
    copilot:       'Yardımcı Pilot davet · dual avatar, kopyalanabilir Pilot ID, DS Input + Button davet.',
    ms:            'Miles&Smiles · altın metal kart, DS Tabs (genel/partnerler/geçmiş), kategori chip\'leri.',
    notifications: 'Bildirimler · DS Chip filtreler (tümü/uçuş/mil/sosyal), unread dots, "tümünü oku" toast.',
    profile:       'Profil · navy hero, DS Tabs (hesap/tercihler/güvenlik), uçuş geçmişi + lounge + yardım giriş noktaları.',
    seat:          'Swiss/blueprint · paper grid, mono harfli kolon başlıkları, uçak siluetinde koltuk haritası.',
    passenger:     'Editorial · Playfair masthead, EB Garamond underline form, kırmızı drop-cap, double-rule divider.',
    baggage:       'Playful · pastel sticker kartlar, Bebas Neue dev başlık, pill +/− sayaçlar, gold sıçramalar.',
    checkout:      'Fintech · monospaced 36px total, saved cards, Stripe-vari clean form, koyu siyah Pay CTA.',
    confirm:       'Postcard · sepia paper, hardal/kırmızı çift gölge, döner damga, vintage seyahat kartpostalı.',
    priceAlert:    'Bloomberg terminal · yeşil chart fill, hedef çizgisi, mini stats grid, slider ile target set.',
    airport:       'iOS modal · glass blur cards, segmented "near me" pill, recents + popular flag listesi.',
    turkiyeTuru:   'NatGeo cover · sıcak Kapadokya gradient, sarı çerçeve, Playfair masthead, vintage tur kartları.',
    turkiyeRoute:  'Railway timetable · paper texture, double-rule mast, mono tarih kolonu, ✦ THY damgalı toplam.',
    checkin:       'Japon minimalizmi · tek kırmızı sun-disc, NFC ring animation, vertical roman label.',
    history:       'Passport scrapbook · dönmüş round damgalar, sepia paper, Elite Plus altın overlay.',
    help:          'Notion docs · sade Inter, emoji kategoriler, accordion FAQ, ⌘K search, canlı destek strip.',
    lounge:        'Maison · siyah-altın art deco · conic ornament, ✦ ornaments, concierge Sophie kartı.',
    qrScanner:     'QR Tara · siyah viewfinder, taşıyıcı tarama çizgisi, altın köşe braketleri; algıladığında glass sheet ile sonuç ve aksiyon.',
    tkpay:         'TKPAY Cüzdan · ödemenin iyi/kolay/avantajlı yolu; navy-altın sanal kart, mil → TL dönüştürücü, hızlı aksiyonlar, anlaşmalı markalar, son işlemler.',
    inviteAccept:  'Davet Kabul · paylasılan rotaya katılma ekranı; davet eden kişinin avatarı, rota özet kartı, ‘Katıl / Önizle’ CTA stack.',
    routes:        'Kayıtlı Rotalarım · Profil > Rotalarım girişi · her rotada sil/paylaş + Öde CTA\'sı ödeme sayfasını açar.',
    payment:       'Ödeme seçenekleri · Miles&Smiles ve TK Pay vurgulu önerilen yöntemler, kayıtlı kart + Apple Pay + havale; rota özeti ve KVKK rozetli ödeme.',
  };
  const en = {
    splash: 'Onboarding · navy-gold gradient · travel-eager welcome.',
    board: 'Home · upcoming flight crops out of the header, quick actions + popular routes + Türkiye Tour CTA.',
    search: 'Flight search · trip type toggle, swap button, date cards, passenger stepper.',
    results: 'Results · DS FlightCard with fare-family columns, outbound/return tabs, gold chip filters.',
    boarding: 'Boarding pass · cockpit gate: QR, perforated edge, plane animation, check-in CTA, lounge link.',
    map: 'Route plan · glass panel over the world map, multi-stop + domestic boarding-pass leg.',
    copilot: 'Co-pilot invite · dual avatars, copyable Pilot ID, DS Input + Button invite.',
    ms: 'Miles&Smiles · gold metal card, DS Tabs (overview/partners/history), category chips.',
    notifications: 'Notifications · DS Chip filters (all/flight/miles/social), unread dots, mark-all toast.',
    profile: 'Profile · navy hero, DS Tabs (account/prefs/security), entry points to history + lounge + help.',
    seat: 'Swiss/blueprint · paper grid, mono column headers, seat map in fuselage silhouette.',
    passenger: 'Editorial · Playfair masthead, EB Garamond underline form, red drop-cap, double-rule divider.',
    baggage: 'Playful · pastel sticker cards, Bebas Neue display, pill +/− counters, gold splashes.',
    checkout: 'Fintech · 36px mono total, saved cards, Stripe-style clean form, deep-black Pay CTA.',
    confirm: 'Postcard · sepia paper, mustard/red double shadow, rotated stamp, vintage travel.',
    priceAlert: 'Bloomberg terminal · green chart fill, target line, mini stats grid, target slider.',
    airport: 'iOS modal · glass blur cards, "near me" segmented, recents + popular flag list.',
    turkiyeTuru: 'NatGeo cover · warm Cappadocia gradient, yellow border, Playfair masthead, vintage tour cards.',
    turkiyeRoute: 'Railway timetable · paper texture, double-rule mast, mono date column, ✦ THY total stamp.',
    checkin: 'Japanese minimal · single red sun-disc, NFC ring animation, vertical roman label.',
    history: 'Passport scrapbook · rotated round stamps, sepia paper, Elite Plus gold overlay.',
    help: 'Notion docs · clean Inter, emoji categories, accordion FAQ, ⌘K search, live-chat strip.',
    lounge: 'Maison · black-gold art deco · conic ornament, ✦ ornaments, concierge Sophie card.',
    qrScanner: 'QR Scanner · black viewfinder, traveling scan line, gold corner brackets; on detect a glass sheet shows the payload + action.',
    tkpay:     'TKPAY Wallet · the smart way to pay; navy-gold virtual card, miles → TL converter, quick actions, partner brands, recent transactions.',
    inviteAccept: 'Invite Accept · join screen for a shared trip; inviter avatar, trip summary card, ‘Join / Preview’ CTA stack.',
    routes:    'Saved Routes · entered from Profile > Routes · per-route share/delete + Pay CTA opens payment.',
    payment:   'Payment options · Miles&Smiles and TK Pay are the recommended methods, with saved cards / Apple Pay / bank transfer below; trip summary and KVKK-marked checkout.',
  };
  return (isTR ? tr : en)[id] || '';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ToastHost>
    <PrototypeApp />
  </ToastHost>
);
