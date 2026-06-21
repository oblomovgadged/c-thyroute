# THY Route — Akış & Buton Haritası

> Web sitesi prototipinin **sayfa akışı**, **buton yönlendirmeleri** ve **state (booking) yönetimi** dokümantasyonu.  
> Her satır gerçekten projeye uygulanmış bağlantılardır.

---

## 1. Ana rezervasyon akışı (Tek yön)

```
Splash (Ana sayfa)
   │  ┌─ Hero "Uçuş ara" → 'search'
   │  ├─ Arama şeridi "Ara" → 'results'    (state'ten okur)
   │  ├─ Türkiye Rotası kartları → 'turkiyeTuru'
   │  └─ Popüler Rotalar kartları → 'results' (state'e yazıp gider)
   ▼
Search ('Uçuş Ara')
   │  ├─ Tek yön / Gidiş-Dönüş tab → tripType
   │  ├─ Nereden / Nereye (CityAutocomplete) → state
   │  ├─ Gidiş / Dönüş (DatePickerCell) → state
   │  └─ "Ara" → 'results'
   ▼
Results ('Sonuçlar')
   │  ├─ Sol panel: sıralama (fiyat/saat/süre), aktarma, fiyat aralığı
   │  ├─ Üst sekme: Gidiş ↔ Dönüş (leg toggle)
   │  ├─ "Aramayı düzenle" → 'search'
   │  └─ Fare seç (EcoFly/ExtraFly/PrimeFly/BusinessPrime):
   │        • leg='out' & tek yön → 'confirm'
   │        • leg='out' & gidiş-dönüş → leg='return' (aynı sayfada kalır)
   │        • leg='return' → 'confirm'
   ▼
Confirmation ('Onay')
   │  ├─ PNR (otomatik üretildi) + dinamik IST→XYZ
   │  ├─ Postcard kart: gidiş + (varsa) dönüş satırı
   │  ├─ "★ Rotaya ekle" → 'map'   ← yeni eklendi
   │  ├─ "Biniş kartını gör →" → 'boarding'
   │  └─ "Ana sayfaya dön" → 'board'
   ▼
Map / Route ('Rota')
       Eklenen rotanın görüntülendiği harita ekranı
```

---

## 1b. Ödeme akışı (Profil > Kayıtlı Rotalarım > Öde)

```
Profile ('Profil')
   │  Hesap sekmesi > 'Kayıtlı Rotalarım' paneli > "AÇ →" → 'routes'
   │  (Ayrıca üst menü 'Daha fazla ▾' > Kayıtlı Rotalarım / Ödeme doğrudan açılabilir)
   ▼
Saved Routes ('Kayıtlı Rotalarım', #23)
   │  ├─ Sekmeler: Tümü / Planlanan / Ödeme bekleyen / Tamamlanan
   │  ├─ Rota kartı × 3 (TRIP-0042 Roma+Antalya, TRIP-0039 Tokyo, TRIP-0037 Kapadokya)
   │  │     • "Paylaş" → toast (bağlantı kopyalandı thy.r/<pnr>)
   │  │     • "Sil" → inline confirm overlay → listeden düşer
   │  │     • "Öde →" → seçilen rotayı localStorage'a yazar → 'payment'
   │  ├─ Sağ kolon: 'Nereden geçilir' rehberi + Miles&Smiles ve TK Pay promo kartları
   │  └─ "+ Yeni rota" → 'search'
   ▼
Payment ('Ödeme', #24)
   │  ├─ "← Rotalarım" breadcrumb → 'routes'
   │  ├─ Önerilen (vurgulu):
   │  │     • Miles&Smiles kartı (altın gradient, 'ÖNERİLEN' rozeti, 48.720 mil bakiye)
   │  │     • TK Pay kartı (kırmızı/navy, 'HIZLI' rozeti, 4.250 TL cüzdan)
   │  ├─ Diğer yöntemler: Kayıtlı kart · Mastercard · Apple Pay · Banka havalesi/FAST
   │  ├─ Sağ özet: rota adı, leg'ler, fare/vergi/iade, KDV dahil toplam
   │  └─ "Miles ile Öde / TK Pay ile Öde / Ödemeyi Tamamla" → toast → 'confirm'
```


---

## 2. State yönetimi — `useBooking()`

`web-booking-store.jsx` içinde tanımlı, `localStorage` ile kalıcı (`thy-route-booking-v1`).

| Alan | Tip | Açıklama |
|---|---|---|
| `fromCode`, `toCode` | string (IATA) | Kalkış / varış havalimanı |
| `depDate`, `retDate` | ISO `YYYY-MM-DD` | Gidiş / dönüş tarihi |
| `tripType` | `round \| one \| multi` | Yolculuk türü |
| `passengers` | `{ adt, chd, inf }` | Yolcu sayıları |
| `cabin` | `economy \| business \| first` | Kabin sınıfı |
| `fareFamily` | string | Seçilen fare ailesi |
| `selectedFlightId` | string | Seçili uçuş kodu (örn. TK 1853) |
| `outbound` | obj veya null | `{ code, dep, arr, dur, plane, fareName, price }` |
| `returnSel` | obj veya null | Dönüş için aynı şekil |
| `pnr` | string | 6 karakterlik onayda üretilir |
| `seat`, `bags` | string, number | Koltuk + bagaj |

`useBooking()` → `[booking, setBooking, helpers]`  
`helpers`: `setRoute(from,to)`, `swap()`, `reset()`, `paxTotal`, `from`, `to`.

---

## 3. Sayfa → buton matrisi

| # | Sayfa | Butonlar | Hedef |
|---|---|---|---|
| 01 | **Splash** | Hero CTA "Uçuş ara" | `search` |
|    |  | "Atla" | `board` |
|    |  | Arama şeridi "Ara" | `results` |
|    |  | Türkiye Rotası kartı × 4 | `turkiyeTuru` |
|    |  | "Tüm rotalar →" | `turkiyeTuru` |
|    |  | Popüler Rotalar × 4 | `results` |
| 02 | **Board** (Pano) | Üst nav: Ana / Uçuş Ara / Rota / M&S / Profil | İlgili ekran |
|    |  | PNR Modal aç | (modal) |
| 03 | **Search** | Tek yön / Gidiş-Dönüş tab | `tripType` |
|    |  | CityAutocomplete (Nereden / Nereye) | state |
|    |  | DatePickerCell (Gidiş / Dönüş) | state |
|    |  | "Ara" | `results` |
|    |  | Son aramalar listesi | (info) |
|    |  | Fiyat takvimi günü | (info) |
| 04 | **Results** | "← Aramayı düzenle" | `search` |
|    |  | Sıralama radyo (fiyat / saat / süre) | filter |
|    |  | "Yalnız direkt" checkbox | filter |
|    |  | Sekme: Gidiş / Dönüş | leg |
|    |  | Fare aile seç (4 buton × N uçuş) | flow: outbound → return → `confirm` |
| 05 | **Boarding Pass** | "Paylaş" | toast |
|    |  | "Check-in" | `checkin` |
|    |  | "Lounge" | `lounge` |
| 06 | **Map / Route** | (Rota görselleştirme — eklenen rota burada) | — |
| 07 | **Co-Pilot** | Davet kodu, partner ekle | (interaktif) |
| 08 | **Miles&Smiles** | Tier kart, partner listesi | (info) |
| 09 | **Notifications** | Bildirim öğeleri | (toast) |
| 10 | **Profile** | "PNR Sorgula" | modal → state |
|    |  | "Çıkış yap" | toast |
| 11 | ~~Seat Map~~ | **Akıştan çıkarıldı** — koltuk seçimi yerine koltuk-oyunu Mobil tarafında, web'de Results → Confirmation akışı | — |
| 12 | **Passenger Info** | Form alanları | state |
|    |  | "Devam" | `baggage` |
| 13 | **Baggage** | Bagaj eklentileri | state |
|    |  | "Devam" | `confirm` |
| 14 | **Confirmation** | "★ Rotaya ekle" | `map` |
|    |  | "Biniş kartını gör →" | `boarding` |
|    |  | "Ana sayfaya dön" | `board` |
| 15 | **Price Alert** | Alarm kur formu | toast |
| 16 | **Airport Picker** | Şehir listesi | (artık autocomplete olduğu için marjinal) |
| 17 | **Türkiye Turu** | 8 tur kartı | `turkiyeRoute` |
| 18 | **Tour Route** | Etap listesi, rota haritası | (info) |
| 19 | **Check-in** | "Check-in yap" | `boarding` |
| 20 | **History** | Geçmiş uçuşlar (damgalı) | (info) |
| 21 | **Help & Support** | SSS açılır kapanır | (info) |
| 22 | **Lounge** | Lounge listesi | (info) |
| 23 | **Saved Routes** (Rotalarım) | Sekme: Tümü / Planlanan / Ödeme bekleyen / Tamamlanan | filter |
|    |  | "Paylaş" | toast (`thy.r/<pnr>` bağlantısı kopyalandı) |
|    |  | "Sil" | inline confirm → listeden düşer |
|    |  | "Öde →" (kart başına) | `localStorage`'a rota yaz → `payment` |
|    |  | "+ Yeni rota" / "Yeni rota" | `search` |
|    |  | Sağ kolon Miles&Smiles / TK Pay promo | (info) |
| 24 | **Payment** (Ödeme) | "← ROTALARIM" breadcrumb | `routes` |
|    |  | Miles&Smiles kartı (vurgulu) | method='miles' |
|    |  | TK Pay kartı (vurgulu) | method='tkpay' |
|    |  | Kayıtlı kart · Mastercard · Apple Pay · Banka havalesi | method=card/mc/applepay/bank |
|    |  | "Miles ile Öde / TK Pay ile Öde / Ödemeyi Tamamla" | toast → `confirm` |

**Ek giriş noktaları** — `routes` ve `payment` ekranlarına:
- **Üst nav > "Daha fazla ▾"** menüsünün üstüne 'Kayıtlı Rotalarım' ve 'Ödeme' (`web-ui-bits.jsx`)
- **Profil > Hesap sekmesi > Kayıtlı Rotalarım paneli** → "AÇ →" butonu (`web-screens-b.jsx`)
- **Ekran seçici** dropdown'ından doğrudan seçilebilir (`web-main.jsx > WEB_SCREENS`)

---

## 4. Yapılan güncellemeler — 15 Haz 2026

### ✅ Tarih seçici
- `DatePickerCell` eklendi (`web-booking-store.jsx`)
- Ay/yıl ileri-geri, geçmiş günler disabled, dönüş ≥ gidiş kuralı
- Splash + Search ekranlarında aktif
- Seçilen tarih: kırmızı dolgu · bugün: altın çerçeve

### ✅ Şehir autocomplete
- `CityAutocomplete` + 30 şehirlik THY destinasyon DB
- Otomatik tamamlama, klavye nav (↑↓ Enter Esc), bölgelere göre gruplanmış (Türkiye / Avrupa / Orta Doğu / Afrika / Asya / Amerikalar)
- Splash arama şeridi + Search sayfasında aktif

### ✅ Sonuçlar canlı
- `priceFor()` great-circle mesafeye göre TL fiyat hesaplar
- `durationFor()` rotaya göre saat-dakika
- Uçuş saatleri rotaya göre deterministik
- Aynı kalkış-varış seçilirse → kırmızı toast, ilerleme yok

### ✅ Akış değişti (bu güncelleme)
- Önce: Sonuçlar → **koltuk** → ... → Onay
- Şimdi: Sonuçlar → (gidiş seç → dönüş seç) → **Onay** → "Rotaya Ekle" → Rota
- `seat` ekranı navigation flow'undan çıkarıldı (mobilde koltuk-oyunu olarak ayrı duruyor)

### ✅ Onay sayfası dinamik
- PNR otomatik üretiliyor (deterministik 6 karakter)
- IST/FCO hardcode değil, seçilen rotadan okuyor
- Dönüş varsa ikinci satır gösteriliyor
- Tarih + saat seçimlere göre

### ✅ State persistance
- `localStorage` key: `thy-route-booking-v1`
- Cross-component sync (her `useBooking()` çağrısı aynı state'i görür)

---

## 5. Henüz yapılacaklar

- [ ] Yolcu sayısı artır/azalt kontrolleri (şu an sabit 1 yetişkin)
- [ ] Passenger Info & Baggage sayfaları state'e bağlanacak
- [ ] Boarding Pass sayfası `booking.outbound`'tan okuyacak
- [ ] Türkiye Turu kartlarına "Bu rotaya ekle" → confirm akışı
- [ ] Profil'deki PNR sorgu modalı sonuçları gerçek state'e yazacak
- [ ] Check-in sayfası gerçekten check-in akışı (form → biniş kartı)
- [ ] Map/Route sayfası eklenen rotaları gerçekten gösterecek (şu an sabit)
- [ ] Saved Routes: gerçek `useBooking()` ile senkron (şu an hardcoded 3 örnek rota)
- [ ] Payment: başarılı ödemeden sonra rota durumunu 'TAMAMLANAN'a geçir
- [ ] TK Pay cüzdan açma / bakiye yükleme alt-akışı
- [ ] Miles&Smiles kısmi mil + kart kombinasyonu (split payment) slider'ı

---

## 6. Ödeme akışı — 20 Haz 2026

### ✅ Kayıtlı Rotalarım sayfası (`web-screens-routes.jsx > WebSavedRoutesScreen`)
- Sol kolon: 3 rota kartı (TRIP-0042 ödeme bekliyor, TRIP-0039 taslak, TRIP-0037 planlanıyor)
- Her kart: durum pill (gold/blue/navy) + leg bar (IST→FCO→AYT) + miles rozet + KDV dahil toplam
- Aksiyonlar: "Öde →" (kırmızı CTA), "Paylaş" (toast), "Sil" (inline confirm)
- Sağ kolon: 'Ödeme sayfasına nereden geçilir' rehberi + Miles&Smiles / TK Pay promo kartları
- Dark glass cockpit estetik (web ile tutarlı)

### ✅ Ödeme sayfası (`web-screens-routes.jsx > WebPaymentOptionsScreen`)
- Üst: 'Ödeme yöntemi seçin' eyebrow + rota adı (Playfair) + breadcrumb
- **Önerilen blok** — yan yana 2 vurgulu kart:
  - **Miles&Smiles** — altın gradient, 'TURKISH AIRLINES' eyebrow, 'ÖNERİLEN' rozeti, 48.720 mil + değer + 'bu rota için yeterli'
  - **TK Pay** — koyu navy + kırmızı glow, 'THY DİJİTAL CÜZDAN' eyebrow, 'HIZLI' rozeti, 4.250 TL bakiye + '%2 mil iadesi'
- **Diğer yöntemler** (vurgusuz liste): Kayıtlı VISA · Mastercard · Apple Pay · FAST havale
- Sağ özet kartı: rota adı + leg bar + bilet/vergi/iade breakdown + toplam (30px Playfair)
- CTA: yönteme göre dinamik label ('Miles ile Öde' / 'TK Pay ile Öde' / 'Ödemeyi Tamamla')
- KVKK · 3D Secure · 256-bit rozet altında

### ✅ Giriş noktaları
- `web-ui-bits.jsx > moreItems` listesinin **başına** 'Kayıtlı Rotalarım' (star) + 'Ödeme' (wallet) eklendi
- `web-screens-b.jsx > WebProfileScreen > Hesap sekmesi` — 'Ödeme yöntemleri' panelinin üstüne 'Kayıtlı Rotalarım' tek-satır CTA paneli eklendi ('AÇ →')
- `web-main.jsx > WEB_SCREENS`: yeni #23 routes ve #24 payment

### ✅ Cross-device senkron
- Seçilen rota `localStorage['thy-route-pay-target-v1']` anahtarında saklanır
- Mobil + web aynı anahtarı kullanır — mobilden bir rotada 'Öde' deyince web'de açılan ödeme sayfası aynı rotayı görür


---

## 7. M&S anlaşmalı yerler — Rota entegrasyonu (20 Haz 2026)

`ms-partners.jsx` modülü ile Rota sayfasına Miles&Smiles anlaşmalı yerler entegre edildi. Hem haritada hem Keşfet listesinde toggle ile gösterilir; tıklayınca rezervasyon akışı M&S sayfasına yönlendirir.

### ✅ Veri modeli (`ms-partners.jsx`)
- `MS_CATEGORIES` — 5 kategori: **Konaklama · Araç Kiralama · Finans · VIP Transfer · Yeme & İçme**
- `MS_PARTNERS` — destinasyon kodu başına ortalama 7–10 partner (FCO/NRT/BCN/AYT özelleştirilmiş + `__GENERIC__` fallback)
- Her partner: `{ id, cat, brand, name, offer, miles, x, y, isMS }` (id'ler `ms_` ile başlar)
- Helper'lar: `getMSPartners(code)`, `getMSPartnersBy(code, cat)`, `isMSPartnerId(id)`, `getMSPartnerById(code, id)`, `msPartnersAsMapPois(code)`
- Veri jenerik — gerçek M&S API'sine ileride bağlanacakmış gibi yapılandırıldı

### ✅ Harita üzeri toggle (`WebMapScreen`)
- Sağ üst köşede altın `<MSMapToggle>` butonu + sayaç chip (örn. `✦ MILES&SMILES · 9`)
- Aktifken: tüm M&S partnerleri altın halka pin olarak haritada görünür; toast: *"9 M&S partners on map"*
- Kapatıldığında: pinler kaybolur

### ✅ Keşfet'te "✦ Sadece M&S" toggle chip
- Kategori chip rail'inin sonuna eklendi (altın `<MSOnlyChip>`)
- Aktifken kategori chip'leri %50 opaklık + liste `<MSGroupedList>` ile değişir: **Konaklama · Araç Kiralama · Finans · VIP Transfer · Yeme & İçme** başlıkları altında gruplandırılır
- Her satır: marka adı + mil teklifi + altın **REZERVASYON →** CTA

### ✅ Partner POI flyout
- Harita pininden veya listeden tıklayınca: **altın çerçeveli dark cockpit flyout** (sol alt) açılır
- İçerik: kategori ikonu + `MILES&SMILES PARTNERİ` eyebrow + marka adı + mil teklifi rozeti + `MSReservationCTA` (altın gradient buton)
- Rezervasyona tıkla → toast (*"M&S üzerinden Hilton otel rezervasyonuna yönlendiriliyorsun…"*) → 900 ms sonra `nav('ms')` ile Miles&Smiles ekranı açılır

### ✅ Akış
```
Rota (06)
   ├─ Harita ✦ MILES&SMILES toggle → altın pinler haritada görünür
   ├─ Pin tıkla → altın flyout → REZERVASYON → → Miles&Smiles (08)
   └─ Sağ panel · Keşfet sekmesi
       ├─ ✦ Sadece M&S chip → kategori grup listesi
       └─ Satır REZERVASYON → → Miles&Smiles (08)
```


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

## 9. Kayıtlı Rotalarım (Web) — Rotaya Git + Mil Kazancı · Haziran 2026

### Değişiklikler
- Her kayıtlı rota kartının aksiyon kolonuna **"Rotaya git →"** butonu eklendi (altın ghost stil) — `nav('map')` ile Web rota ekranı (06) açılır
- Kart hiyerarşisi: **Rotaya git → · Öde → · Paylaş · Sil**
- Sağ alt köşede **"✦ MİL KAZANCI"** label'i + altın pill içinde mil değeri (örn. `+3 960 MİL`)
- Eski "✦ ... mil" mini pill kaldırıldı, daha net "MİL KAZANCI" başlığıyla değiştirildi
- Bilingual: TR "MİL KAZANCI / MİL" · EN "MILES EARNED / MILES"


---

## 10. Web Rota · Co-Pilot'a Gönder · Haziran 2026

### Değişiklik
- Rota sayfası sağ panelinde "🔗 Davet linki kopyala" butonu → **"✈ Co-Pilot'a gönder"** olarak değiştirildi
- Tıklama artık doğrudan clipboard'a değil, **paylaşım popover'ı** açar
- Popover seçenekleri (sırasıyla):
  1. **WhatsApp** — `wa.me?text=...` ile yeni sekmede sohbet
  2. **E-posta** — `mailto:` (Outlook · Gmail) konu + gövdede davet linki
  3. **SMS** — `sms:` mobil cihazda kısa mesaj
  4. **Linki kopyala** — eski davranış (panoya kopyalar)
- Popover gold hairline border, glass background, hover'da altın çerçeve
- Bilingual TR/EN, KAPAT butonu ile dışarı çıkış


---

## 11. Türkiye Turu → Tur Rotası → Rota akışı · 21 Haz 2026

**Temel mantık:** Rota oluşturulduğunda (Türkiye Turu'ndan VEYA normal Uçuş Ara'dan), **Rota (Map) sayfası gidilen yere göre dolar** — destinasyon rehberi, POI'ler, gün planı hepsi seçilen şehre özgü gelir.

### Veri akışı
```
Türkiye Turu (17) — 8 tur kartı
   ↓ tıkla → thyBuildSelection(tour) + window.__thyTourSelection
Tur Rotası (18) — railway timetable, seçilen turun durakları/tarihleri/fiyatı
   ├─ Planı Düzenle çubuğu: tarih · süre · yolcu (inline, canlı yeniler)
   ├─ "Rotayı rezerve et →"
   │     • localStorage['thy-route-extra-saved-v1']'a rota yaz
   │     • setBooking({ fromCode:'IST', toCode: tour.destCode, depDate, retDate, tourId })
   │     • nav('map')
   └─ "✈ Biniş kartını gör →"
         • aynı save + setBooking
         • nav('boarding')
Rota / Map (06) — booking.toCode'u okuyup destinasyonu render eder
```

### Tur → destinasyon eşleşmesi (`WEB_TR_TOURS[i].destCode`)
| Tur | destCode | Map'te açılan şehir |
|---|---|---|
| Klasik Grand Tour | IST | İstanbul |
| Likya Yolu | AYT | Antalya |
| Göbekli Tepe | GZT | Gaziantep (Şanlıurfa hub'ı) |
| Nemrut Dağı | GZT | Gaziantep |
| Ege Antik Rotası | ADB | İzmir |
| Kapadokya Şafağı | AYT | (geçici — NAV/ASR WEB_CITIES'a eklenince güncellenecek) |
| Gelibolu & Truva | IST | İstanbul |
| Karadeniz Yaylaları | TZX | Trabzon |

### Uçuş Ara akışıyla simetri
Normal `search → results → confirm → "Rotaya ekle"` akışı **aynı** `booking.toCode` mekanizmasını kullanır. Yani:
- Tur rezerve = Uçuş ara rezerve, ikisi de aynı state'i besler
- Map sayfası `getDestination(booking.toCode)` ile **tek bir kaynak**tan okur
- Bilinmeyen kodlar için `WEB_DEST_FALLBACK` ile sentezlenmiş rehber gelir

### Booking'e eklenen alanlar (tur akışına özgü)
- `tourId` — Tur kimliği (örn. `'gobekli'`)
- `tourTitle` — Görünür isim (örn. `'Göbekli Tepe'`) — Rota sayfası header'ında "Tur" rozeti için ileride kullanılabilir

### Halen yapılacak (gelecek iterasyonlar)
- [ ] `WEB_CITIES`'a NAV, ASR, GNY, MQM, ADF, RZE, KZR, CKZ ekle ki tur destCode'ları kendi şehirlerini gösterebilsin
- [ ] `WEB_DESTS`'e Türkiye tur şehirleri için özel POI + günlük plan yaz (şu an fallback ile çalışıyor)
- [ ] Map sayfasına "TUR MOD" badge — `booking.tourId` varsa header'da "GÖBEKLİ TEPE TURU · 5 GÜN" göster
- [ ] Tur kayıtlarında çoklu durak gösterimi (şu an tek varış noktası)

---

## 12. Seyahat Tercihleri (Travel Prefs) · 22 Haz 2026

**Yeni ekran:** `travelPrefs` (#28 — web + mobil)
**Detay:** [`SEYAHAT_TERCIHLERI.md`](./SEYAHAT_TERCIHLERI.md)

### Veri akışı
```
Profil (#10)
   ├─ ✦ "Seyahat Tercihleri" öne çıkan kart (Hesap sekmesi başı)
   └─ Sidebar > "Seyahat Tercihleri" menü öğesi
         ↓ nav('travelPrefs')
Seyahat Tercihleri (#28)
   • 6 kategori (hız, ilgi alanları, bütçe, konaklama, tip, esneklik)
   • thySavePrefs() → localStorage['thy-travel-prefs-v1']
   • 'thy-prefs-change' custom event → tüm useTravelPrefs() consumer'lar rerender
   ↓ nav('profile')
Rota / Map (#06)
   • thyHasPrefs() true ise header'da "✦ TERCİHLERİNİZE GÖRE" rozeti
   • Rozet tıklanır → nav('travelPrefs') (düzenleme)
```

### ✅ Giriş noktaları
- `web-screens-b.jsx > WebProfileScreen > Hesap sekmesi` — başa ✦ "Seyahat Tercihleri" kartı
- `web-screens-b.jsx > WebProfileScreen > sidebar` — "Seyahat Tercihleri" menü öğesi (edit ikonu)
- `web-screens-b.jsx > WebMapScreen` — header'a `<TravelPrefsBadge dark />`
- `web-main.jsx > WEB_SCREENS` — yeni #28 travelPrefs
- `Web Sitesi.html` — `<script src="travel-prefs.jsx">`

### Bileşenler (window'a export)
- `thyLoadPrefs() / thySavePrefs(prefs) / thyHasPrefs()`
- `useTravelPrefs()` — React hook, otomatik rerender
- `THY_PREF_CATEGORIES` — 6 kategori, options, i18n
- `WebTravelPrefsScreen` — ekran #28 (light, sidebar layout)
- `TravelPrefsBadge` — küçük ✦ rozet (Map header)
