# Rota / Harita Ekranı — Screen Doc

> ID: `map` · Num: 06
> Dosya: `web-screens-b.jsx` (satır 6–) + `screens-b.jsx` (mobil)
> Güncelleme: 2026-06-28

---

## Amaç

Seçilen destinasyona ait **şehir haritası**, **3 günlük plan** ve **Keşfet** (POI) rehberini gösterir. Miles&Smiles partner pinleri haritaya entegre edilebilir. Co-Pilot ile canlı eşleme buradan başlatılır.

---

## Nereden Gelinir

| Kaynak | Tetikleyici |
|---|---|
| `confirm (14)` Onay | "Rotaya ekle" (500ms) |
| `confirm (14)` Onay | "Rotayı kaydet ve haritada gör" (600ms) |
| `boarding (05)` Biniş Kartı | "Rota haritasına git" butonu |
| `profile (10)` → `routes (24)` Rotalarım | "Rotaya git" butonu |
| `search (02)` Arama | Şehir seçici "+ Yeni rota oluştur" butonu |
| `turkiyeRoute` Türkiye Turu | "Rezerve et" → nav('map') |
| `ms (08)` Miles&Smiles | İlgili şehrin M&S pinleri haritadan çağrılır |

---

## Ekrandan Çıkış

| Tetikleyici | Hedef | Koşul |
|---|---|---|
| M&S partner rezervasyon | `ms (08)` | `reserveMS()` → toast → 900ms sonra |
| Seyahat Tercihleri badge | `travelPrefs (28)` | `thyHasPrefs()` true ise gösterilir |
| Biniş kartını gör CTA | `boarding (05)` | Plan panelindeki CTA |
| Şehir seçici → Yeni rota | `search (02)` | **YENİ (Mobil)** Bottom sheet "+Yeni rota oluştur" |

---

## State

| State | Tip | Açıklama |
|---|---|---|
| `dayIx` | `0\|1\|2\|'discover'` | Aktif plan sekmesi (Gün 1/2/3 veya Keşfet) |
| `openPoi` | `POI \| null` | Açık flyout'un POI'si |
| `editingNote` | `string \| null` | Not düzenleme modundaki POI id |
| `noteDraft` | `string` | Anlık not içeriği |
| `clickedPoint` | `{x,y} \| null` | Haritada tıklanan koordinat |
| `discoverCat` | `string` | Keşfet tab'ındaki aktif kategori |
| `addModal` | `{poi} \| null` | POI rotaya ekle modal'ı |
| `sendOpen` | `boolean` | Co-Pilot'a gönder menüsü açık mı |
| `msMapActive` | `boolean` | M&S pinlerini haritada göster/gizle |
| `msOnly` | `boolean` | Sadece M&S pinlerini göster filtresi |
| `cityPickerOpen` | `boolean` | **YENİ (Mobil)** — Şehir seçici bottom sheet açık mı |

---

## Şehir Seçici (Mobil — YENİ)

**Tetikleyici:** Header'daki `{toC.code} ▾` badge veya şehir adı — her zaman tıklanabilir.

**`QUICK_DESTS` dizisi (16 şehir):**

| Bölge | Şehirler |
|---|---|
| Avrupa | Roma (FCO) · Paris (CDG) · Londra (LHR) · Berlin (BER) · Amsterdam (AMS) · Atina (ATH) |
| Orta Doğu | Dubai (DXB) |
| Amerika | New York (JFK) |
| Asya | Bangkok (BKK) |
| Türkiye | İstanbul (IST) · Şanlıurfa (GNY) · Nevşehir (NAV) · Antalya (AYT) · İzmir (ADB) · Trabzon (TZX) · Rize (RZE) |

**Akış:**
1. `setCityPickerOpen(true)` → bottom sheet açılır
2. Şehir seçilince `setBooking({ toCode: code })` → harita + rehber aninda güncellenir
3. Toast: "🇮🇹 Roma seçildi"
4. Alt buton: "+ Yeni rota oluştur →" → `nav('search')`

**İpucu:** Aktif şehir badge'i kırmızı + ✓ SEÇİLİ ile vurgulanır.

---

## Veri Bağımlılıkları

| Kaynak | Nasıl kullanılır |
|---|---|
| `booking.toCode` (localStorage) | Destinasyon şehir kodu; yoksa FCO fallback |
| `getDestination(code)` | `web-destinations.jsx` — POI'ler + 3 günlük plan |
| `getDestPois(code)` | `web-destinations-poi.jsx` — kategori bazlı Keşfet POI'leri |
| `getMSPartners(code)` | `ms-partners.jsx` — M&S partner pinleri (dinamik üretim) |
| `useRouteEdits(code)` | Silinmiş/eklenmiş POI state'i, Co-Pilot paylaşım bayrağı |
| `durationFor(from, to)` | Uçuş süresinden Day 1 planı hesaplanır |
| `booking.outbound` | Gerçek varış saati; yoksa deterministik hesap |
| `findCity(code)` | Şehir objesi (city, airport, iso, group) |

---

## Plan Sezonu Mantığı (Day 1)

Varış saatine göre Day 1'de hangi plan slotlarının gösterileceği dinamik hesaplanır:

| Varış | Gösterilecek slotlar |
|---|---|
| ≤ 08:30 | VARIŞ · OTEL · Sabah · Öğle · Akşam (tam gün) |
| ≤ 13:30 | VARIŞ · OTEL · Öğle · Akşam |
| ≤ 17:30 | VARIŞ · OTEL · Akşam |
| > 17:30 | VARIŞ · OTEL · Akşam Yemeği (hafif, büyük POI yok) |

Day 2 ve 3 her zaman tam gün: Sabah (09:00) · Öğle (13:00) · Akşam (19:00)

---

## Miles&Smiles Harita Entegrasyonu

`msMapActive` toggle açıldığında `msPartnersAsMapPois(code)` çağrılır — M&S pinleri destinasyon POI'lerinin üstüne altın `✦` simgesiyle bindirilir.

`MSMapToggle` bileşeni: pin sayısını badge olarak gösterir, toggle altın/koyu.
`MSOnlyChip`: sadece M&S pinlerini gösteren filtre chip'i.

Bir M&S pinine tıklandığında `POI flyout` açılır; flyout altında `MSReservationCTA` butonu. CTA tıklanınca `reserveMS(partner)` çağrılır:
1. Toast: "M&S üzerinden [Brand] [verb] rezervasyonuna yönlendiriliyorsun…"
2. `setOpenPoi(null)`
3. 900ms → `nav('ms')`

---

## Rota Rehberi — Keşfet Tab

`discoverCat` state'i kategori chip'lerini yönetir.
Kategoriler: restaurant · museum · nature · nightlife · shopping · cafe · landmark

`getDestPois(code)` bu kategoriye göre filtreli POI listesi döner.
Bilinmeyen şehirde fallback POI seti (`WEB_POI_FALLBACK`) gösterilir.

---

## Görsel Kimlik

| Token | Değer |
|---|---|
| Tema | Dark — Cockpit glassmorphism |
| Background | `#0A1628` (Airy Premium) |
| Harita zemin | `assets/AnaEkran.png` (route-network, dimmed) |
| Panel bg | `rgba(255,255,255,0.045)` glass |
| Panel border | `rgba(255,255,255,0.085)` |
| Aktif gün tab | Accent rengi + glow |
| M&S toggle | Altın `#C5A059` |
| POI pin | Accent rengi küre |
| M&S pin | `#C5A059` altın, `✦` simgesi |
| Flyout | Glass card, backdrop-blur, kırmızı glow hover |

---

## Bilinen Sınırlamalar

- Harita statik görsel (canlı Google Maps yok; koordinatlar %x/%y CSS pozisyon)
- Co-Pilot canlı sync: Pilot ID paylaşımı çalışıyor ama gerçek WebSocket yok (mock state)
- Özel POI ekleme (`addModal`): state'e yazar ama kalıcı değil (localStorage'a geçmedi)
- Not yazma (`editingNote`): anlık render'da görünür ama sayfa kapanınca kaybolur
