# THY Route Web — Navigasyon Haritası

> Güncelleme tarihi: 2026-06-28
> Kaynak: `web-main.jsx` WEB_SCREENS listesi + tüm `nav()` çağrıları + `FLOW.md` (Claude Code)

---

## Ekran Dizini

| ID | Num | TR Adı | EN Adı | Dosya |
|---|---|---|---|---|
| `splash` | 01 | Ana sayfa | Landing | `web-screens-a.jsx` |
| `board` | 02 | Pano | Dashboard | `web-screens-a.jsx` |
| `search` | 03 | Uçuş Ara | Search | `web-screens-a.jsx` |
| `results` | 04 | Sonuçlar | Results | `web-screens-a.jsx` |
| `boarding` | 05 | Biniş Kartı | Boarding Pass | `web-screens-a.jsx` |
| `map` | 06 | Rota | Route (Map Journal) | `web-screens-b.jsx` |
| `copilot` | 07 | Yardımcı Pilot | Co-Pilot | `web-screens-b.jsx` |
| `ms` | 08 | Miles&Smiles | Miles&Smiles | `web-screens-b.jsx` |
| `notifications` | 09 | Bildirimler | Notifications | `web-screens-b.jsx` |
| `profile` | 10 | Profil | Profile | `web-screens-b.jsx` |
| `seat` | 11 | Koltuk | Seat Map | `web-screens-c.jsx` |
| `passenger` | 12 | Yolcu | Passenger Info | `web-screens-c.jsx` |
| `baggage` | 13 | Bagaj | Baggage | `web-screens-c.jsx` |
| `confirm` | 14 | Onay | Confirmation | `web-screens-c.jsx` |
| `priceAlert` | 15 | Fiyat Alarmı | Price Alert | `web-screens-d.jsx` |
| `airport` | 16 | Havalimanı | Airport Picker | `web-screens-d.jsx` |
| `turkiyeTuru` | 17 | Türkiye Turu | Türkiye Tour | `web-screens-d.jsx` |
| `turkiyeRoute` | 18 | Tur Rotası | Tour Route | `web-screens-d.jsx` |
| `checkin` | 19 | Check-in | Check-in | `web-screens-d.jsx` |
| `history` | 20 | Geçmiş | Flight History | `web-screens-d.jsx` |
| `help` | 21 | Yardım | Help & Support | `web-screens-d.jsx` |
| `lounge` | 22 | Lounge | Lounge | `web-screens-d.jsx` |
| `tkpay` | 23 | TKPAY | TKPAY | `web-screens-d.jsx` |
| `routes` | 24 | Rotalarım | Saved Routes | `web-screens-routes.jsx` |
| `payment` | 25 | Ödeme | Payment | `web-screens-routes.jsx` |
| `travelPrefs` | 28 | Tercihler | Travel Prefs | `travel-prefs.jsx` |

> **Ayrı sayfa (nav sistemi dışı):**
> `Yönetici Ekranı.html` — THY Route Executive Cockpit. `Web Sitesi.html`'den bağımsız standalone HTML. Mobil/web app nav'ına dahil değil, doğrudan URL ile açılır.

---

## Navigasyon Grafiği

### Giriş Noktaları (entry points)
```
splash (01)
  └─→ board (02)          [Ana CTA + "Keşfet" butonu]
  └─→ board (02)          [Giriş yap linki]
```

### Ana Akış — Uçuş Rezervasyon
```
board (02)
  └─→ search (03)         [Arama formu header'dan]
  └─→ results (04)        [Arama formundan direkt]
  └─→ boarding (05)       [Upcoming flight kartına tıklama]
  └─→ turkiyeTuru (17)    [Türkiye Turu banner kartı]
  └─→ notifications (09)  [Bildirimler "Tümünü gör"]
  └─→ checkin (19)        [Check-in butonu]
  └─→ lounge (22)         [Lounge butonu]

search (03)
  └─→ airport (16)        [Nereden/Nereye input'una tıklama]
  └─→ results (04)        [Ara CTA (350ms toast sonrası)]

airport (16)
  └─→ search (03)         [Şehir seçilince 500ms sonra]

results (04)
  └─→ search (03)         [Geri butonu]
  └─→ confirm (14)        [Tek yön uçuş seçilince (500ms)]
  └─→ confirm (14)        [Gidiş+dönüş her ikisi seçilince]

confirm (14)
  └─→ seat (11)           [Koltuk seç butonu — eğer varsa]
  └─→ passenger (12)      [Yolcu bilgileri CTA]
  └─→ boarding (05)       [Biniş kartını gör →]
  └─→ copilot (07)        [Yardımcı Pilot davet linki]
  └─→ map (06)            [Rotayı kaydet ve haritada gör (600ms)]
  └─→ boarding (05)       [Rotayı kaydet ve biniş kartı (600ms)]

boarding (05)
  └─→ map (06)            [Rota haritasına git]
  └─→ ms (08)             [M&S avantajlarım CTA]
```

### Rota / Harita Akışı
```
map (06)
  └─→ ms (08)             [M&S partner rezervasyon tıklama (900ms)]
  └─→ travelPrefs (28)    [Seyahat Tercihleri badge tıklama]
  └─→ boarding (05)       [Biniş kartını gör CTA]

ms (08)
  (tek yönlü — buraya gelenir, buradan çıkış yok)
```

### Profil & Yan Menü
```
profile (10)
  └─→ routes (24)         [Kayıtlı Rotalarım kartı]
  └─→ travelPrefs (28)    [Seyahat Tercihleri kartı]
  └─→ tkpay (23)          [TKPAY banner — Miles ekranından da erişim]

travelPrefs (28)
  (tek yönlü — buraya gelenir, buradan çıkış tanımlı değil)
```

### Kayıtlı Rotalar & Ödeme Akışı
```
routes (24)
  └─→ search (03)         [+ Yeni Rota ekle butonu]
  └─→ priceAlert (15)     [🔔 Fiyat alarmı butonu (rota kartı)]
  └─→ map (06)            [Rotaya git butonu]
  └─→ payment (25)        [Öde butonu — thy-route-pay-target-v1 yazıldıktan sonra]

payment (25)
  └─→ routes (24)         [← Geri butonu]
  └─→ confirm (14)        [Ödeme onaylandı (1400ms + 700ms toast sonrası)]

priceAlert (15)
  └─→ routes (24)         [← ROTALARIM butonu (route mode)]
  └─→ search (03)         [← BACK butonu (default mode)]
  └─→ routes (24)         [✦ ALARMI KUR → (700ms, route mode)]
  └─→ notifications (09)  [✦ ALARMI KUR → (700ms, default mode)]
```

### Türkiye Turu Akışı
```
turkiyeTuru (17)
  └─→ turkiyeRoute (18)   [Tur seçilince]

turkiyeRoute (18)
  (kendi içinde kapalı akış — rota haritası)
```

### Yardımcı Ekranlar
```
checkin (19)
  └─→ boarding (05)       [Check-in tamamlandı (500ms)]

lounge (22)
  (tek yönlü — buraya gelenir)

history (20)
  (tek yönlü — buraya gelenir)

help (21)
  (tek yönlü — buraya gelenir)

tkpay (23)
  (tek yönlü — buraya gelenir)

copilot (07)
  (tek yönlü — buraya gelenir)

notifications (09)
  (tek yönlü — buraya gelenir, alarm kurulunca priceAlert'ten yönlenilir)

seat (11) → passenger (12) → baggage (13)
  (sıralı akış — aralarındaki nav henüz tanımlı değil, placeholder)
```

---

## localStorage Anahtarları & Sahiplik

| Anahtar | Yazan ekran | Okuyan ekran | İçerik |
|---|---|---|---|
| `thy-route-pay-target-v1` | `routes (24)` | `payment (25)` | Ödenmek istenen rota objesi |
| `thy-route-alarm-target-v1` | `routes (24)` | `priceAlert (15)` | Alarm kurulacak rota objesi (alarm sonrası silinir) |
| `thy-route-alarms-v1` | `priceAlert (15)` | `priceAlert (15)` | Kurulu alarmlar listesi (max 50) |
| `thy-booking-v1` | `search/results` | `map, confirm, boarding` | Aktif rezervasyon (from/to/dates/pax/cabin) |
| `thy-route-selections-v1` | `confirm/map` | `map, routes` | Kaydedilen rotalar listesi |
| `thy-tweaks-v1` | `web-main.jsx` | Tüm ekranlar | Tema, dil, density, font, viewport ayarları |

---

## WebTopNav Aktif Durumları

`WebTopNav` bileşeni `active` prop alır; aşağıdaki ekranlar kendi ID'lerini geçer:

| active değeri | Hangi ekranlar |
|---|---|
| `'search'` | search, results, airport |
| `'map'` | map, copilot, travelPrefs |
| `'ms'` | ms |
| `'routes'` | routes, payment |
| `'profile'` | profile, history, help |
| `null` | board, splash, priceAlert, boarding, confirm, seat, checkin, lounge, tkpay, turkiyeTuru, turkiyeRoute, notifications |

---

## Dosya Yapısı — Web Tarafı

| Dosya | Açıklama |
|---|---|
| `Web Sitesi.html` | Ana web app — tüm screen'leri yükler |
| `web-main.jsx` | Screen router, WEB_SCREENS dizisi |
| `web-booking-store.jsx` | Web'e özgü booking store (mobil ile ayrı) |
| `web-ui-bits.jsx` | Nav, toast, ortak bileşenler |
| `web-screens-a.jsx` | Ekranlar 01–05 |
| `web-screens-b.jsx` | Ekranlar 06–10 + travelPrefs |
| `web-screens-c.jsx` | Ekranlar 11–14 |
| `web-screens-d.jsx` | Ekranlar 15–23 |
| `web-screens-routes.jsx` | Ekranlar 24–25 (Rotalarım + Ödeme) |
| `web-screens-tkpay.jsx` | TKPAY sub-ekranları (23 altı) |
| `ms-partners.jsx` | M&S partner veritabanı + bileşenler (web+mobil ortak) |
| `web-destinations.jsx` | Destinasyon POI + gün planları |
| `web-destinations-poi.jsx` | POI tür meta + getDestPois helper |
| `web-route-map.jsx` | Leaflet harita entegrasyonu |
| `travel-prefs.jsx` | Seyahat Tercihleri ekranı + hook (web+mobil ortak) |
| `ds-components.jsx` | THY DS bileşenlerinin inline JSX portu |
| `Yönetici Ekranı.html` | **Standalone** Executive Dashboard (nav dışı) |
| `admin-shell.jsx` | Executive Dashboard kabuk + scrollspy nav |
| `admin-sections.jsx` | Dashboard bölüm render'ları |
| `admin-charts.jsx` | KPI grafikleri + sparkline'lar |
| `admin-data.jsx` | Mock analytics verisi + ADMIN_COPY i18n |

---

## Eksik / Tamamlanmamış Bağlantılar

- `seat (11)` → `passenger (12)` → `baggage (13)` zinciri: aralarındaki nav çağrıları henüz aktif değil
- `history (20)` → tekrar rezervasyon akışı planlanabilir
- `notifications (09)` → ilgili uçuşa/rotaya deep link yok
- `copilot (07)` → Pilot ID paylaşımı sonrası nereye döneceği tanımlı değil
- `help (21)` → destek formu sonrası yönlendirme yok
