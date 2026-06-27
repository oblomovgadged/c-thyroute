# Claude Code Sync — Tüm Değişiklikler (Güncel)

> Tarih: 2026-06-28
> Bu dosya hem DC (Claude) hem de Claude Code tarafından yapılan tüm değişiklikleri belgeler.
> Claude Code bu dosyayı referans alarak nelerin değiştiğini anlayabilir.

---

## Dosya Durumu Özeti

| Dosya | Kim değiştirdi | Son durum |
|---|---|---|
| `screens-a.jsx` | DC | Splash CTA → `nav('search')` |
| `screens-b.jsx` | DC | MapScreen: şehir seçici + rotayı kaydet; MilesScreen: 18 partner + filtre |
| `screens-d.jsx` | DC | PriceAlertScreen: routeData; CheckIn: NFC→QR; TurkiyeTuru: tıklanabilir; TurkiyeRoute: AnadoluJet/THY |
| `screens-f.jsx` | DC | InviteAccept: boş sayfa düzeltildi |
| `screens-routes.jsx` | DC | Alarm butonu eklendi |
| `ms-partners.jsx` | DC | v2: 22 marka şablonu, dinamik üretim, 7 kategori |
| `travel-prefs.jsx` | Claude Code | YENİ — Seyahat Tercihleri ekranı |
| `ds-components.jsx` | Claude Code | YENİ — DS bileşen portu |
| `admin-shell.jsx` | Claude Code | YENİ — Executive Dashboard kabuk |
| `admin-sections.jsx` | Claude Code | YENİ — Dashboard bölümleri |
| `admin-charts.jsx` | Claude Code | YENİ — KPI grafikleri |
| `admin-data.jsx` | Claude Code | YENİ — Mock analytics verisi |
| `web-booking-store.jsx` | Claude Code | YENİ — Web'e özgü booking store (web-screens için) |
| `web-screens-tkpay.jsx` | Claude Code | YENİ — TKPay alt-ekranları |
| `Yönetici Ekranı.html` | Claude Code | YENİ — Standalone Executive Dashboard |

---

## DC Değişiklikleri (Buradan Yapılanlar)

### `screens-a.jsx`
**Splash CTA:**
```diff
- onClick={() => nav('board')}
+ onClick={() => nav('search')}
```
Satır ~156. "Rota Yarat" butonu artık arama ekranına götürür.

---

### `screens-b.jsx`

**Değişiklik 1 — MapScreen şehir seçici (2026-06-28)**
- `cityPickerOpen` state eklendi
- `QUICK_DESTS` dizisi (16 şehir: FCO/CDG/LHR/BER/AMS/ATH/DXB/JFK/BKK/IST/GNY/NAV/AYT/ADB/TZX/RZE)
- Header'da `{toC.code} ▾` tıklanabilir → bottom sheet açılır
- Bottom sheet: bölge bazlı gruplandırma, aktif şehir badge'i, `setBooking({ toCode })` çağrısı
- "Yeni rota oluştur →" footer → `nav('search')`

**Değişiklik 2 — MapScreen "Rotanı Kaydet" butonu**
- Plan paneli altına navy+altın buton eklendi
- `thy-route-selections-v1` localStorage'a yazar
- Toast → 700ms → `nav('routes')`

**Değişiklik 3 — MilesScreen partner listesi v2**
- `ALL_PARTNERS` dizisi (18 partner)
- 8 kategori chip: all/hotel/car/vip/lounge/wifi/bank/dining
- `cat` state'e göre `.filter()` → boş kategoride "Bu kategoride partner yok"

---

### `screens-d.jsx`

**PriceAlertScreen — tam yenileme:**
- Mount'ta `thy-route-alarm-target-v1` okunur (route mode)
- `mobileBreakdown(route)` — EcoFly %62/%31/%7, Business %73/%22/%5
- Rota kırılım paneli: ✈ Uçuş / 🏨 Otel / 🚘 VIP
- Adaptif slider: min=total×0.70, max=total×1.05
- `handleSetAlarm()` → `thy-route-alarms-v1` + temizlik + nav
- Geri: route mode→`routes`, default→`search`

**CheckInScreen — pasaport NFC kaldırıldı:**
- "Pasaportunuzu telefona yaklaştırın" → "Biniş kartınızın QR kodunu okutun"
- Buton: "QR'ı Tara"

**TurkiyeTuruScreen — TourCard tıklanabilir:**
- `onSelect` prop + cursor:pointer + hover lift
- `thyBuildSelection(tr)` guard'lı + `nav('turkiyeRoute')`

**TurkiyeRouteScreen — 3 alt değişiklik:**
- `airlineFor(fromCode, toCode, idx)` helper (AnadoluJet kısa hat, THY diğer)
- Duraklar arası uçuş connector satırı (dashed + badge + uçak ikonu)
- "Rotanı rezerve et" → `saveToMyRoutes` + `nav('map')`

---

### `screens-f.jsx`
**InviteAccept boş sayfa:**
- `tripId = React.useMemo(...)` — Math.random() JSX'ten çıkarıldı
- `safeToast` wrapper
- `useToast()` / `useBooking()` guard'lı fallback

---

### `screens-routes.jsx`
**Alarm butonu:**
- `setAlarm(route)` handler
- Her rota kartına 🔔 "Alarm" / "Alert" butonu (altın)

---

### `ms-partners.jsx` (web + mobil ortak)
**v2 güncellemesi:**
- `MS_CATEGORIES`: 5 → 7 kategori (lounge + travel_services eklendi)
- `MS_BRAND_TEMPLATES` (22 marka şablonu)
- `MS_TIER_BRANDS` (8 tier)
- `cityTier()`, `brandXY()`, `generateMSPartnersFor()` fonksiyonları
- `getMSPartners(code)` — 3 katmanlı: curated → dinamik → fallback
- `MSReservationCTA.verb`: lounge + travel_services eklendi
- `MSGroupedList`: logo destekli item render

---

## Claude Code Değişiklikleri (Local'den)

### `travel-prefs.jsx` — YENİ
Seyahat Tercihleri ekranı (web + mobil ortak).
- `thyLoadPrefs()`, `thySavePrefs()`, `thyHasPrefs()`
- `useTravelPrefs()` React hook (auto-rerender)
- `THY_PREF_CATEGORIES` — 6 kategori, i18n
- `WebTravelPrefsScreen` (web ekran #28)
- `TravelPrefsScreen` (mobil ekran #29)
- `TravelPrefsBadge` (Map header rozet)
- Storage key: `thy-travel-prefs-v1`

---

### `ds-components.jsx` — YENİ
THY Route DS bileşenlerinin inline JSX portu (bundle yüklemeye gerek kalmadan).
Export: `ThyButton`, `ThyBadge`, `ThyCard`, `ThyChip`, `ThyTabs`, `ThyInput`,
`ThyToast`, `DSFlightCard`, `ToastHost`, `useToast`

---

### `web-booking-store.jsx` — YENİ
Web'e özgü booking store. `booking-store.jsx`'in web mirror'ı.
- `WEB_CITIES` (30 şehir)
- `useBooking()` → `[booking, setBooking, helpers]`
- `CityAutocomplete`, `DatePickerCell`
- `priceFor()`, `durationFor()`, `distanceFor()`
- Storage key: `thy-route-booking-v1` (mobil ile aynı key — cross-device sync)

---

### `web-screens-tkpay.jsx` — YENİ
TKPay ekranının alt-akışları (cüzdan, bakiye yükle, işlem geçmişi).
`ms` ekranından `nav('tkpay')` ile açılır.

---

### `admin-shell.jsx` + `admin-sections.jsx` + `admin-charts.jsx` + `admin-data.jsx` — YENİ
THY Route Executive Cockpit dashboard sistemi.
Ana dosya: `Yönetici Ekranı.html` (standalone, nav sistemi dışı).
7 bölüm: Overview · Intent · Loyalty · Partner · Marketing · M&S · Layover

**Giriş:** Doğrudan URL (`Yönetici Ekranı.html`) — web/mobil app'tan nav yok.

---

## localStorage Anahtarları — Tam Liste

| Anahtar | Yazan | Okuyan | Ne zaman silinir |
|---|---|---|---|
| `thy-route-booking-v1` | search/results | map, confirm, boarding, priceAlert | Hiçbir zaman (merge) |
| `thy-route-selections-v1` | map, turkiyeRoute, confirm | routes | Hiçbir zaman |
| `thy-route-extra-saved-v1` | turkiyeRoute | routes | Hiçbir zaman |
| `thy-route-pay-target-v1` | routes | payment | Hiçbir zaman |
| `thy-route-alarm-target-v1` | routes (🔔 butonu) | priceAlert | Alarm kurulunca |
| `thy-route-alarms-v1` | priceAlert | priceAlert | Hiçbir zaman (max 50) |
| `thy-tweaks-v1` | main.jsx | Tüm ekranlar | Hiçbir zaman |
| `thy-travel-prefs-v1` | travelPrefs | map (badge), profile | Hiçbir zaman |
| `thyAdminLang` | Yönetici Ekranı | Yönetici Ekranı | Hiçbir zaman |

---

## Yapılacaklar (Açık Görevler)

*MOBIL-FLOW.md §5'ten alındı:*
- [ ] Search: CityAutocomplete + DatePicker mobile entegrasyonu
- [ ] Results: gidiş/dönüş akışı gerçek
- [ ] Confirmation: dinamik PNR + state'ten oku
- [ ] Map: mini biniş kartı üstte
- [ ] Map: Keşfet + Add modal
- [ ] Map: notlar + sil + davet linki
- [ ] BoardingPass: `booking.outbound`'tan oku
- [ ] Saved Routes: gerçek useBooking() sync (şu an hardcoded)
- [ ] Payment: ödeme sonrası durum → 'TAMAMLANAN'
- [ ] TKPay: cüzdan açma / bakiye yükleme alt-akışı
- [ ] M&S: kısmi mil + kart kombinasyonu slider
