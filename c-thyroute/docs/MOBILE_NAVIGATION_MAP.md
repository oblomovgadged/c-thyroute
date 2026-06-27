# Mobil Uygulama — Navigasyon Haritası

> Güncelleme: 2026-06-28
> Kaynak: `main.jsx` SCREENS listesi + tüm `nav()` çağrıları + `MOBIL-FLOW.md` (Claude Code)

---

## Ekran Dizini (29 ekran)

| ID | Num | TR | Dosya |
|---|---|---|---|
| `splash` | 01 | Hoş geldin | screens-a.jsx |
| `board` | 02 | Uçuş Panosu | screens-a.jsx |
| `search` | 03 | Uçuş Ara | screens-a.jsx |
| `results` | 04 | Sonuçlar | screens-a.jsx |
| `boarding` | 05 | Biniş Kartı | screens-a.jsx |
| `map` | 06 | Rota Haritası | screens-b.jsx |
| `copilot` | 07 | Yardımcı Pilot | screens-b.jsx |
| `ms` | 08 | Miles&Smiles | screens-b.jsx |
| `notifications` | 09 | Bildirimler | screens-b.jsx |
| `profile` | 10 | Profil | screens-b.jsx |
| `seat` | 11 | Koltuk | screens-c.jsx |
| `checkout` | 12 | Ödeme (checkout) | screens-c.jsx |
| `passenger` | 13 | Yolcu Bilgileri | screens-c.jsx |
| `baggage` | 14 | Bagaj | screens-c.jsx |
| `confirm` | 15 | Onay | screens-c.jsx |
| `priceAlert` | 16 | Fiyat Alarmı | screens-d.jsx |
| `airport` | 17 | Havalimanı Seçici | screens-d.jsx |
| `turkiyeTuru` | 18 | Türkiye Turu | screens-d.jsx |
| `turkiyeRoute` | 19 | Tur Rotası | screens-d.jsx |
| `checkin` | 20 | Check-in | screens-d.jsx |
| `history` | 21 | Uçuş Geçmişi | screens-e.jsx |
| `help` | 22 | Yardım | screens-e.jsx |
| `lounge` | 23 | Lounge | screens-e.jsx |
| `qrScanner` | 24 | QR Tara | screens-f.jsx |
| `tkpay` | 25 | TKPAY Cüzdan | screens-f.jsx |
| `inviteAccept` | 26 | Davet Kabul | screens-f.jsx |
| `routes` | 27 | Kayıtlı Rotalarım | screens-routes.jsx |
| `payment` | 28 | Ödeme Seçenekleri | screens-routes.jsx |
| `travelPrefs` | 29 | Seyahat Tercihleri | travel-prefs.jsx |

---

## Dosya Yapısı — Mobil Tarafı

| Dosya | Açıklama |
|---|---|
| `Mobil Uygulama.html` | Ana mobil app — tüm screen'leri yükler |
| `main.jsx` | Screen router, SCREENS dizisi, Tweaks |
| `booking-store.jsx` | Mobil booking store (localStorage + cross-component sync) |
| `ui-bits.jsx` | AppTabBar, toast, ortak mobil bileşenler |
| `ds-components.jsx` | THY DS bileşenlerinin inline JSX portu |
| `screens-a.jsx` | Ekranlar 01–05 (Splash, Board, Search, Results, Boarding) |
| `screens-b.jsx` | Ekranlar 06–10 (Map, CoPilot, Miles, Notifications, Profile) |
| `screens-c.jsx` | Ekranlar 11–15 (Seat, Checkout, Passenger, Baggage, Confirm) |
| `screens-d.jsx` | Ekranlar 16–20 (PriceAlert, Airport, TurkiyeTuru, TurkiyeRoute, CheckIn) |
| `screens-e.jsx` | Ekranlar 21–23 (History, Help, Lounge) |
| `screens-f.jsx` | Ekranlar 24–26 (QRScanner, TKPay, InviteAccept) |
| `screens-routes.jsx` | Ekranlar 27–28 (SavedRoutes, Payment) |
| `travel-prefs.jsx` | Ekran 29 + hook (web+mobil ortak) |
| `ms-partners.jsx` | M&S partner veritabanı (web+mobil ortak) |
| `mobile-route-collab.jsx` | Co-Pilot / rota paylaşım mantığı |
| `pnr-modal.jsx` | PNR sorgulama modalı |
| `ios-frame.jsx` / `android-frame.jsx` | Cihaz çerçeveleri |
| `tweaks-panel.jsx` | Tweaks panel (tema/dil/cihaz) |

---

## Navigasyon Grafiği

```
splash (01)
  └→ search (03)    [Rota Yarat CTA — primary button]
  └→ board (02)     [ZATEN ÜYE / SIGN IN link]

board (02)
  └→ boarding (05)  [Upcoming flight card tap]
  └→ map (06)       [Quick action — Rota]
  └→ qrScanner (24) [Quick action — QR Tara]
  └→ priceAlert (16)[Quick action — Alarm]
  └→ turkiyeTuru (18)[Türkiye Turu banner]
  └→ AppTabBar      [search / map / ms / profile]

search (03)
  └→ airport (17)   [Nereden / Nereye input tap]
  └→ results (04)   [Ara CTA (350ms)]

airport (17)
  └→ search (03)    [Şehir seçilince 500ms]

results (04)
  └→ search (03)    [← Geri]
  └→ confirm (15)   [Uçuş + tarife seçilince 500ms]

confirm (15)
  └→ seat (11)      [Koltuk seç]
  └→ passenger (13) [Yolcu bilgileri]
  └→ map (06)       [Rotaya ekle 600ms]
  └→ boarding (05)  [Biniş kartını gör]
  └→ copilot (07)   [Co-Pilot davet]

seat (11) → passenger (13) → baggage (14) → confirm (15)

boarding (05)
  └→ map (06)       [Rota haritasına git]
  └→ ms (08)        [M&S avantajlarım]
  └→ checkin (20)   [Check-in]

map (06)
  └→ ms (08)        [M&S partner rezervasyon 900ms]
  └→ routes (27)    [Rotanı Kaydet → 700ms]

copilot (07)
  └→ inviteAccept (26) [Önizle butonu]

ms (08)
  └→ tkpay (25)     [TKPAY bridge banner]
  └→ AppTabBar

profile (10)
  └→ routes (27)    [Kayıtlı Rotalarım satırı]
  └→ travelPrefs (29) [Seyahat Tercihleri kartı]
  └→ history (21)   [sidebar]
  └→ lounge (23)    [sidebar]
  └→ priceAlert (16)[sidebar]
  └→ help (22)      [sidebar]

routes (27)
  └→ profile (10)   [← Geri]
  └→ priceAlert (16)[🔔 Alarm butonu → thy-route-alarm-target-v1]
  └→ map (06)       [Rotaya git]
  └→ payment (28)   [Öde → thy-route-pay-target-v1]
  └→ search (03)    [+ Yeni Rota]

payment (28)
  └→ routes (27)    [← Geri]
  └→ confirm (15)   [Ödeme onaylandı 700ms]

priceAlert (16)
  └→ routes (27)    [← ROTALARIM (route mode)]
  └→ search (03)    [← BACK (default mode)]
  └→ routes (27)    [✦ ALARMI KUR 700ms (route mode)]
  └→ notifications (09) [✦ ALARMI KUR 700ms (default mode)]

turkiyeTuru (18)
  └→ turkiyeRoute (19) [Tur kartına tıklama → thyBuildSelection]

turkiyeRoute (19)
  └→ turkiyeTuru (18) [← Tur]
  └→ map (06)         [Rotanı rezerve et → saveToMyRoutes + 600ms]

checkin (20)
  └→ boarding (05)    [Check-in tamam 500ms]

inviteAccept (26)
  └→ map (06)         [Rotaya Katıl 600ms]
  └→ map (06)         [Önce Önizle]
  └→ board (02)       [Şimdi değil / × kapat]
```

---

## localStorage Anahtarları

| Anahtar | Yazan | Okuyan | İçerik |
|---|---|---|---|
| `thy-booking-v1` | search/results | map, confirm, boarding, priceAlert | Aktif rezervasyon |
| `thy-route-selections-v1` | map, turkiyeRoute, confirm | routes | Kayıtlı rotalar listesi |
| `thy-route-extra-saved-v1` | turkiyeRoute | routes | Tur rotaları (ayrı key) |
| `thy-route-pay-target-v1` | routes | payment | Ödenmek istenen rota |
| `thy-route-alarm-target-v1` | routes | priceAlert | Alarm kurulacak rota (alarm sonrası silinir) |
| `thy-route-alarms-v1` | priceAlert | priceAlert | Kurulu alarmlar listesi (max 50) |
| `thy-tweaks-v1` | main.jsx | Tüm ekranlar | Tema, dil, ekran, cihaz |

---

## AppTabBar Aktif Durumları

| active | Ekranlar |
|---|---|
| `home` | board, notifications, profile |
| `search` | search, results, airport |
| `map` | map, copilot |
| `wallet` | ms |
| `me` | profile |

---

## Dark / Light Tema Dağılımı

**Dark:** splash, boarding, map, ms, priceAlert, lounge, tkpay, inviteAccept, qrScanner, copilot (hero band)

**Light:** board, search, results, seat, checkout, passenger, baggage, confirm, notifications, profile, airport, turkiyeTuru, turkiyeRoute, checkin, history, help, routes, payment, travelPrefs
