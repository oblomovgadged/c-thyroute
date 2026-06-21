# THY Route — Mobil Akış & Buton Haritası

> Mobil prototipinin **sayfa akışı**, **buton yönlendirmeleri** ve **state (booking) yönetimi**.
> Web'deki `FLOW.md`'nin mobil karşılığı.

---

## 0. Mobil ↔ Web farkları (özet)

| Konu | Web durumu | Mobil mevcut | Yapılacak |
|---|---|---|---|
| Merkezi booking store | ✅ `useBooking` + localStorage | ❌ Yok, hardcoded | **Eklenecek** |
| Şehir autocomplete | ✅ 30 şehir, filtreli | ❌ Sabit IST/FCO | **Eklenecek** |
| Takvim ile tarih seçici | ✅ DatePickerCell | ❌ Sabit "17 Haz" | **Eklenecek** |
| Gerçek mesafe / fiyat | ✅ `priceFor`, `durationFor` | ❌ Sabit fiyat | **Eklenecek** |
| Gidiş-Dönüş akışı | ✅ out → return → confirm | ❌ Sadece tek bilet seçiyor | **Eklenecek** |
| Onay sayfası dinamik | ✅ PNR + rota state'ten | ⚠ Yarı dinamik | **Tamamlanacak** |
| Rota sayfasında Leaflet | ✅ OpenStreetMap | ❌ Sabit SVG harita | **Eklenecek** |
| Wikipedia POI lookup | ✅ Tıkla → kart | ❌ Yok | **Eklenecek** |
| Plan satırına not / sil | ✅ Var | ❌ Yok | **Eklenecek** |
| Davet linki (paylaş) | ✅ URL encoded | ❌ Yok | **Eklenecek** |
| Keşfet sekmesi (kategori) | ✅ 6 kategori | ❌ Yok | **Eklenecek** |
| Add-to-Route modalı | ✅ Gün + vakit seç | ❌ Yok | **Eklenecek** |
| Gün 1 dinamik plan | ✅ İniş saatine göre | ❌ Sabit | **Eklenecek** |
| Mini biniş kartı | ✅ Sağ panelde | — | **Mobil'de map ekranı üstüne** |
| Koltuk oyunu | — | ✅ Mobile özel | (kalır) |
| QR Tara | — | ✅ Mobile özel | (kalır) |
| Geçmiş uçuşlar damgalar | — | ✅ Mobile özel | (kalır) |
| PNR Modal | ✅ Var | ✅ Var | OK |

---

## 1. Ana rezervasyon akışı (mobil)

```
01 Splash
   │ "Atla" / hero CTA → board
   ▼
02 Flight Board (Pano)
   │ ├─ Üst nav (5 sekme): Pano / Uçuş / Rota / M&S / Profil
   │ ├─ "Yeni Uçuş" → search
   │ ├─ PNR Modal aç
   │ └─ "QR Tara" → qrScanner
   ▼
03 Search (Uçuş Ara)
   │ ├─ Tek yön / Gidiş-Dönüş tab → tripType
   │ ├─ Nereden / Nereye (CityAutocomplete) → state           ⏳ YAPILACAK
   │ ├─ Gidiş / Dönüş (DatePickerCell) → state                ⏳ YAPILACAK
   │ ├─ Yolcu sayısı (+/-)
   │ └─ "Uçuşları Ara" → results
   ▼
04 Results (Sonuçlar)
   │ ├─ Sekme: Gidiş ↔ Dönüş (leg toggle)                     ⏳ YAPILACAK
   │ ├─ Filtreler (sırala, direkt)
   │ ├─ "← Düzenle" → search
   │ └─ Fare seç:
   │       • leg='out' + tek yön → confirm
   │       • leg='out' + gidiş-dönüş → leg='return' + üste git
   │       • leg='return' → confirm
   ▼
14 Confirmation (Onay)
   │ ├─ PNR (otomatik) + dinamik IST→XYZ
   │ ├─ Postcard kart: gidiş + (varsa) dönüş
   │ ├─ "★ Rotaya ekle" → map
   │ ├─ "Biniş Kartı" → boarding
   │ └─ "Ana sayfa" → board
   ▼
06 Map / Route (Rota)
   │ ├─ Üst mini biniş kartı (TK kodu, IST→XYZ, saatler)      ⏳ YAPILACAK
   │ ├─ Sekme: Gün 1 / Gün 2 / Gün 3 / ⚑ Keşfet               ⏳ YAPILACAK
   │ ├─ Leaflet harita + numaralı pinler                       ⏳ YAPILACAK
   │ ├─ Haritada tıkla → Wiki kart → Rotaya Ekle              ⏳ YAPILACAK
   │ ├─ POI satırına not / sil                                ⏳ YAPILACAK
   │ ├─ Keşfet → kategori chip → liste → Add modalı           ⏳ YAPILACAK
   │ └─ "🔗 Davet linki kopyala"                              ⏳ YAPILACAK
   ▼
   (kullanıcı serbest gezinir)
```

---

## 1b. Ödeme akışı (Profil > Kayıtlı Rotalarım > Öde)

```
10 Profile (Profil)
   │  Ayarlar listesinde 'Kayıtlı Rotalarım' satırı (kırmızı ★ ikon) → 'routes'
   │  (Tweaks paneli & ekran rayından da direkt erişim mümkün)
   ▼
26 Saved Routes (Rotalarım)
   │  ├─ Sekme: Tümü / Planlanan / Ödeme bekleyen / Tamamlanan
   │  ├─ Rota kartı × 3 (TRIP-0042 Roma+Antalya, TRIP-0039 Tokyo, TRIP-0037 Kapadokya)
   │  │     • "Paylaş" → toast (thy.r/<pnr> bağlantı kopyalandı)
   │  │     • "Sil" → inline confirm overlay → listeden düşer
   │  │     • "Öde →" → seçilen rotayı localStorage'a yazar → 'payment'
   │  └─ "+ Yeni rota oluştur" → 'search'
   ▼
27 Payment (Ödeme)
   │  ├─ "←" geri → 'routes'
   │  ├─ Hero: ÖDENECEK TUTAR + leg bar + rota meta
   │  ├─ Önerilen (vurgulu):
   │  │     • Miles&Smiles kartı (altın gradient, 'ÖNERİLEN' rozeti, 48.720 mil bakiye)
   │  │     • TK Pay kartı (kırmızı/navy, 'HIZLI' rozeti, 4.250 TL cüzdan)
   │  ├─ Diğer yöntemler: Kayıtlı kart · Apple Pay · Banka havalesi/FAST
   │  ├─ Fatura: bilet ücreti + vergi + Miles iadesi + toplam
   │  └─ "Miles ile Öde / TK Pay ile Öde / Ödemeyi Tamamla" → toast → 'confirm'
```

---

## 2. State yönetimi — paylaşılan `useBooking()`

**Plan**: Web'deki `web-booking-store.jsx` modülünü **`booking-store.jsx`** olarak mobile'a port edeceğiz. Aynı API.

`localStorage` key: `thy-route-booking-v1` (web + mobil **aynı** key — kullanıcı mobilde seçtiğini web'de görür, tersine).

| Alan | Tip | Açıklama |
|---|---|---|
| `fromCode`, `toCode` | string (IATA) | Kalkış / varış |
| `depDate`, `retDate` | ISO `YYYY-MM-DD` | Tarihler |
| `tripType` | `round \| one` | Yolculuk türü |
| `passengers` | `{ adt, chd, inf }` | Yolcu sayıları |
| `cabin` | `economy \| business \| first` | Kabin |
| `fareFamily` | string | Seçilen fare |
| `selectedFlightId` | string | Uçuş kodu |
| `outbound` | obj veya null | Gidiş `{ code, dep, arr, dur, plane, fareName, price }` |
| `returnSel` | obj veya null | Dönüş için aynı şekil |
| `pnr` | string | 6 karakter |
| `seat`, `bags` | string, number | Koltuk + bagaj |

---

## 3. Sayfa → buton matrisi (23 ekran)

| # | Ekran | Butonlar | Hedef |
|---|---|---|---|
| 01 | **Splash** | "Atla →" | `board` |
|    |  | Pop-rota CTA × 4 | `results` |
| 02 | **Flight Board (Pano)** | Üst nav: Pano / Uçuş / Rota / M&S / Profil | İlgili ekran |
|    |  | "+ Yeni Uçuş" | `search` |
|    |  | "QR Tara" | `qrScanner` |
|    |  | Mevcut yolculuk kart | `boarding` |
|    |  | "Türkiye Turu" CTA | `turkiyeTuru` |
| 03 | **Search (Uçuş Ara)** | Tek yön / Gidiş-Dönüş tab | `tripType` |
|    |  | Nereden / Nereye (autocomplete) ⏳ | state |
|    |  | Gidiş / Dönüş (datepicker) ⏳ | state |
|    |  | Yolcu +/- | state |
|    |  | "Uçuşları Ara" | `results` |
| 04 | **Results (Sonuçlar)** | "← Düzenle" | `search` |
|    |  | Sekme: Gidiş / Dönüş ⏳ | leg |
|    |  | Sırala / filtre | filter |
|    |  | Fare seç | flow → `results` (return) veya `confirm` |
| 05 | **Boarding Pass (Biniş Kartı)** | "Check-in" | `checkin` |
|    |  | "Paylaş" | toast |
|    |  | "Lounge" | `lounge` |
|    |  | QR alanı tıkla | büyük QR overlay |
| 06 | **Map / Route (Rota)** | Üst mini biniş kartı ⏳ | (info) |
|    |  | Sekme: Gün 1/2/3 / ⚑ Keşfet ⏳ | dayIx / 'discover' |
|    |  | Harita tıkla → Wiki kart ⏳ | (modal) |
|    |  | "Rotaya Ekle" (custom) ⏳ | edits.addCustom |
|    |  | POI satır ✎ not / 🗑 sil ⏳ | edits.addNote / deletePoi |
|    |  | Keşfet → kategori chip ⏳ | filter |
|    |  | Keşfet → POI → Add modal ⏳ | edits.addCustom (slot) |
|    |  | "🔗 Davet linki" ⏳ | clipboard |
| 07 | **Co-Pilot** | "Davet et" | toast |
|    |  | Aktif oturum kartları | (info) |
| 08 | **Miles&Smiles** | Tier kart, partner listesi | (info) |
|    |  | Partner "Haritada Bul" | `map` |
| 09 | **Notifications** | Bildirim öğeleri | (toast) |
|    |  | "Tümünü okundu" | toast |
| 10 | **Profile** | "PNR Sorgula" | PnrModal |
|    |  | "Geçmiş" | `history` |
|    |  | "Çıkış yap" | toast |
| 11 | ~~Seat Map~~ | **Akıştan çıkarıldı** | — |
|    | **Koltuk Oyunu** (özel) | Kart eşleştirme | rozet kazan |
| 12 | **Passenger** | Form alanları | state |
|    |  | "Devam" | `baggage` |
| 13 | **Baggage** | Bagaj eklentileri | state |
|    |  | "Devam" | `confirm` |
| 14 | **Confirmation (Onay)** ⏳ dinamikleştirilecek | "★ Rotaya ekle" | `map` |
|    |  | "Biniş kartı →" | `boarding` |
|    |  | "Ana sayfa" | `board` |
| 15 | **Price Alert** | Form | toast |
| 16 | **Airport Picker** | Şehir tıkla | state + geri |
| 17 | **Türkiye Turu** | 8 tur kartı | `turkiyeRoute` |
| 18 | **Tour Route** | Etap listesi | (info) |
| 19 | **Check-in** | "Check-in yap" | `boarding` |
| 20 | **History** | Damgalı uçuşlar (özel) | (info) |
| 21 | **Help** | SSS açılır | (info) |
| 22 | **Lounge** | Lounge listesi | (info) |
| 23 | **QR Scanner** (özel) | QR tarama animasyonu | toast |
| 26 | **Saved Routes** (Rotalarım) | Sekme: Tümü / Planlanan / Ödeme bekleyen / Tamamlanan | filter |
|    |  | "Paylaş" | toast (`thy.r/<pnr>` bağlantısı kopyalandı) |
|    |  | "Sil" | inline confirm → listeden düşer |
|    |  | "Öde →" (kart başına) | `localStorage`'a rota yaz → `payment` |
|    |  | "+ Yeni rota oluştur" | `search` |
|    |  | Üst geri butonu | `profile` |
| 27 | **Payment** (Ödeme) | Üst geri butonu | `routes` |
|    |  | Miles&Smiles kartı (vurgulu) | method='miles' |
|    |  | TK Pay kartı (vurgulu) | method='tkpay' |
|    |  | Kayıtlı kart · Apple Pay · Banka havalesi | method=card/apple/bank |
|    |  | "Miles ile Öde / TK Pay ile Öde / Ödemeyi Tamamla" | toast → `confirm` |

**Ek giriş noktaları** — `routes` ve `payment` ekranlarına:
- **Profil ekranı ayarlar listesi** — kırmızı ★ ikonlu 'Kayıtlı Rotalarım' satırı (`screens-b.jsx > ProfileScreen`)
- **Ekran rayı** — toolbar'daki 26 / 27 çipleri (`main.jsx > SCREENS`)
- **Tweaks paneli** — 'Aktif ekran' dropdown'ı

---

## 4. Uygulama sırası (sen seçeceksin)

Web'deki güncellemeyi mobile taşımak için sıra önerisi:

1. **Booking store + city DB** — `booking-store.jsx` yaz, `Mobil Uygulama.html`'e ekle
2. **Search ekranı**:
   - Autocomplete (Nereden / Nereye)
   - DatePicker (Gidiş / Dönüş)
   - Tek yön / Gidiş-Dönüş
3. **Results ekranı**:
   - Gidiş ↔ Dönüş sekmesi
   - Gerçek fiyat/süre hesabı
   - Fare seçimi → flow
4. **Confirmation ekranı** — state'ten oku, dinamik PNR
5. **Map (Rota) ekranı**:
   - Leaflet harita
   - Mini biniş kartı (üstte)
   - Gün 1 dinamik plan
   - Notlar + silme
6. **Keşfet sekmesi** — kategori + Add modal
7. **Davet linki paylaşımı**

---

## 5. Henüz yapılacaklar (kalıcı liste)

- [ ] booking-store mobile'a ekle
- [ ] Search: autocomplete + datepicker
- [ ] Results: gidiş/dönüş akışı
- [ ] Confirmation: dinamik PNR + rota
- [ ] Map: Leaflet + POI pinleri
- [ ] Map: mini biniş kartı üstte
- [ ] Map: Keşfet sekmesi + Add modal
- [ ] Map: notlar + sil + davet linki
- [ ] BoardingPass: state'ten oku
- [ ] Profile PNR modal → state'e yaz
- [ ] Saved Routes: gerçek `useBooking()` ile senkron (şu an hardcoded 3 örnek rota)
- [ ] Payment: başarılı ödemeden sonra rota durumunu 'TAMAMLANAN'a geçir
- [ ] TK Pay cüzdan açma / bakiye yükleme alt-akışı (mobil-specific)
- [ ] Miles&Smiles kısmi mil + kart kombinasyonu slider'ı

---

## 6. Ödeme akışı — 20 Haz 2026

### ✅ Kayıtlı Rotalarım (`screens-routes.jsx > SavedRoutesScreen`)
- Light yüzey, mobil app-bar + Playfair başlık + tab chip rail
- 3 rota kartı: durum pill (gold/blue/navy) + leg bar (IST→FCO→AYT) + miles rozet + KDV dahil toplam
- Aksiyonlar (kart içi 3 buton): Paylaş / Sil / Öde →
  - Paylaş → toast ('Bağlantı kopyalandı · thy.r/<pnr>')
  - Sil → inline confirm overlay (Vazgeç / Sil)
  - Öde → → seçilen rotayı `localStorage`'a yaz, `nav('payment')`
- Alt CTA: '+ Yeni rota oluştur' → `search`

### ✅ Ödeme (`screens-routes.jsx > PaymentOptionsScreen`)
- Hero: 'ÖDENECEK TUTAR' eyebrow + 30px Playfair toplam + leg bar + rota meta
- **Önerilen blok** — dikey stack (mobil dar olduğu için):
  - **Miles&Smiles** — altın gradient, 'TURKISH AIRLINES' eyebrow, 'ÖNERİLEN' rozeti, 48.720 mil bakiye + '≈ 13.460 TL'
  - **TK Pay** — koyu navy + kırmızı glow, kanat ikonu chip, 'HIZLI' rozeti, 4.250 TL + '%2 mil iadesi'
- **Diğer yöntemler** (vurgusuz liste): Kayıtlı VISA · Apple Pay · Banka havalesi/FAST
- Fatura kartı: bilet ücreti + vergi + Miles iadesi + toplam
- Sabit alt CTA: yönteme göre dinamik label ('Miles ile Öde' / 'TK Pay ile Öde' / 'Ödemeyi Tamamla')
- KVKK · 3D Secure · 256-bit rozet altında
- 'Ödemeyi Tamamla' → toast 'Ödeme işleniyor…' → 'Ödeme onaylandı' → `confirm`

### ✅ Giriş noktaları
- `screens-b.jsx > ProfileScreen` — ayarlar listesinin **başına** kırmızı ★ ikonlu 'Kayıtlı Rotalarım' satırı eklendi ('3 rota · 1 ödeme bekliyor' alt yazı)
- `main.jsx > SCREENS`: yeni #26 routes ve #27 payment
- Mobil toast helper'ı (`useToast`) entegre — paylaş/sil/ödeme aksiyonlarında kullanılıyor

### ✅ Cross-device senkron
- Seçilen rota `localStorage['thy-route-pay-target-v1']` anahtarında saklanır
- Web + mobil aynı anahtarı kullanır — mobilden 'Öde'ye basılan rota web'de açılan ödeme sayfasında da görünür (ve tersi)


---

## 7. M&S anlaşmalı yerler — Rota entegrasyonu (20 Haz 2026)

`ms-partners.jsx` modülü mobil + web ortak çalışır. Mobil MapScreen'e (06 Rota) aynı toggle + Keşfet chip + flyout REZERVASYON entegrasyonu uygulandı.

### ✅ Veri modeli (`ms-partners.jsx` — web ile paylaşılır)
- 5 kategori: **Konaklama · Araç Kiralama · Finans · VIP Transfer · Yeme & İçme**
- `MS_PARTNERS` — destinasyon başına 7–10 partner (FCO/NRT/BCN/AYT özel + `__GENERIC__` fallback)
- Veri jenerik, ileride gerçek M&S API'sine bağlanacak

### ✅ Harita üzeri toggle (`MapScreen`)
- Sağ alt köşede sm-boyutlu altın `<MSMapToggle>` (haritanın gradient overlay'inin üstünde)
- Aktifken: altın partner pinleri haritada belirir + toast bildirimi
- Kapatıldığında pinler kaybolur

### ✅ Keşfet'te "✦ Sadece M&S" toggle chip
- Yatay scroll kategori rail'inin sonuna eklendi (sm-boyutlu altın `<MSOnlyChip>`)
- Aktifken kategori chip'leri sönükleşir + liste `<MSGroupedList>` ile gruplandırılır
- Her satır: marka adı + mil teklifi + altın **REZERVASYON →** CTA

### ✅ Partner POI bottom sheet
- Pin veya listeden tıklayınca alttan slide-up: **altın krem zeminli sheet**
- İçerik: kategori ikonu + `MILES&SMILES PARTNERİ` eyebrow + Playfair başlık + mil teklifi rozeti + altın `MSReservationCTA`
- Rezervasyona tıkla → toast → 900 ms sonra `nav('ms')` ile #08 Miles&Smiles ekranı açılır

### ✅ Akış
```
06 Rota
   ├─ Harita ✦ MILES&SMILES (sağ alt) → altın pinler haritada
   ├─ Pin tıkla → altın bottom sheet → REZERVASYON → → 08 Miles&Smiles
   └─ Keşfet sekmesi (üst)
       ├─ ✦ Sadece M&S chip → kategori grup listesi
       └─ Satır REZERVASYON → → 08 Miles&Smiles
```

### ✅ Cross-platform uyum
- `ms-partners.jsx` mobil + web aynı script ile çalışır (`Object.assign(window, {...})` ile export)
- HTML script sırası: `web-route-map.jsx` → `ms-partners.jsx` → `screens-b.jsx` (mobil) / `web-screens-b.jsx` (web)


---

## 8. Rota Sayfası — Editorial Map (D) Görsel Reskin · Haziran 2026

**Konsept:** Monocle / Wallpaper magazine-spread estetiği. Tüm rota fonksiyonelliği (booking, useRouteEdits, useRouteCollab, DestLeafletMap, M&S entegrasyonu, gün-1 dinamik plan, Keşfet) tamamen korunur — sadece görsel dil değişir.

### Tipografi sistemi
- **Başlık:** *Playfair Display Italic 700* — şehir adı 48–56px, kursif "Roma" + üst hakkı kırmızı sup numeral (POI sayısı)
- **Eyebrow / Dateline:** JetBrains Mono uppercase 9px, 1.6–1.8 letter-spacing
- **Gövde:** Outfit (UI font) korunur

### Mobil (screens-b.jsx · MapScreen)
- Wrapper zemini cream **#FAF6EE**
- Harita canvas'a alt-sol köşede asimetrik **clip-path** (magazine torn-edge feel)
- Itinerary panel'in üstü artık yumuşak köşeli değil — **2px solid #0A1628** sert kural (Monocle masthead)
- Drag handle yerine **editorial header bloğu**:
  - Dateline strip: `№ 042 · ROMA · ● N STOPS`
  - Italic Playfair `Romaⁿ` headline + sup count
  - Italic Playfair tagline (sağ kenarda)
- Gün chip'leri (yuvarlak altın pill) → **chapter tabs**: italic Roma rakamı (I/II/III/∞) + ad + altta kırmızı 2px underline
- Eyebrow "GÜN 1" → "**BÖLÜM I**" (Roma rakamı)
- Gün başlığı → Playfair italic 22px
- Keşfet eyebrow → "**∞ KEŞFET**"

### Web (web-screens-b.jsx · WebMapScreen)
- Dark cockpit teması korunur (cream'e geçilmedi — koyu navy aviation tonu sürdürülür)
- Sağ panel başlık bloğu (Editorial overlay):
  - Dateline strip: `№ 042 · ROMA · ITALIA · ● N STOPS` (altın + kırmızı)
  - Massive italic Playfair `Romaⁿ` 56px + kırmızı sup numeral
  - Italic altın tagline + summary
- Gün tabs (yuvarlak pill nav) → **editorial chapter tabs**: italic Roma rakamı + GÜN N + altta kırmızı 2px underline
- Aktif gün eyebrow → "**BÖLÜM I**", başlık → Playfair italic 24px

### Korunan fonksiyonlar
- DestLeafletMap entegrasyonu (zoom, POI pin'leri, click-to-add) aynı
- Day-1 dynamic plan logic (arrival time → sabah/öğle/akşam slots) aynı
- M&S harita toggle + ✦ Sadece M&S chip + flyout REZERVASYON akışı aynı
- useRouteEdits (custom POI, note, delete) ve useRouteCollab (paylaşım, votes) aynı
- POI bottom sheet (mobil) ve POI flyout (web) markup'ı korunur


---

## 13. Seyahat Tercihleri (Travel Prefs) · 22 Haz 2026

**Yeni ekran:** `travelPrefs` (#28 — mobil + web ortak)
**Detay:** [`SEYAHAT_TERCIHLERI.md`](./SEYAHAT_TERCIHLERI.md)

### Veri akışı
```
Profil (#10)
   ├─ ✦ "Seyahat Tercihleri" öne çıkan kart (stats şeridinin altında)
   └─ SEYAHAT bölümü > "Seyahat Tercihleri" liste satırı (edit ikonlu)
         ↓ nav('travelPrefs')
Seyahat Tercihleri (#28)
   • 6 kategori: hız · ilgi alanları · bütçe · konaklama · tip · esneklik
   • Chip seçim (tek + çoklu), gold/red accent, sticky save bar
   • thySavePrefs() → localStorage['thy-travel-prefs-v1']
   ↓ nav('profile')
Rota / Map (#06)
   • Dateline strip altında "✦ TERCİHLERİNİZE GÖRE" rozeti
   • Rozet tıklanır → nav('travelPrefs')
```

### ✅ Giriş noktaları (mobil)
- `screens-b.jsx > ProfileScreen` — stats şeridinin altına `✦` ikonlu **Seyahat Tercihleri** kartı
- `screens-b.jsx > ProfileScreen` — SEYAHAT bölümünün başına `edit` ikonlu liste satırı
- `screens-b.jsx > MapScreen` — dateline strip altına `<TravelPrefsBadge>`
- `main.jsx > SCREENS` — yeni #28 travelPrefs
- `Mobil Uygulama.html` — `<script src="travel-prefs.jsx">` eklendi

### Cross-platform sync
- localStorage anahtarı (`thy-travel-prefs-v1`) aynı — **web + mobil aynı tercihleri görür**
- Web'de kaydedilen tercih, aynı tarayıcıdaki mobilde de görünür ve tersi
- `useTravelPrefs()` hook'u `'thy-prefs-change'` custom event ile auto-rerender sağlar

### Tutarlılık
- Web ve mobil ekranlar **aynı `travel-prefs.jsx` dosyasından** yüklenir
- Stil farkları: web sidebar layout + sticky bottom bar, mobil tam yükseklik
- Aynı 6 kategori, aynı i18n stringleri, aynı chip stil sözleşmesi
