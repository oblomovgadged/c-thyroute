# Arama + Sonuçlar Ekranları — Screen Doc

> ID: `search` (03) + `results` (04)
> Dosya: `web-screens-a.jsx` (satır 777– ve 929–)
> Güncelleme: 2026-06-27

---

## 03 · SEARCH — Uçuş Arama

### Amaç
Kullanıcının rota, tarih, yolcu ve kabin seçerek uçuş araması yapmasını sağlar.

### Nereden Gelinir
| Kaynak | Tetikleyici |
|---|---|
| `board (02)` | Arama formu CTA |
| `results (04)` | "← Aramayı düzenle" butonu |
| `airport (16)` | Şehir seçimi sonrası 500ms |
| `routes (24)` | "+ Yeni Rota" butonu |

### Ekrandan Çıkış
| Tetikleyici | Hedef | Gecikme |
|---|---|---|
| "Ara" CTA (validasyon geçince) | `results (04)` | 350ms (toast sonrası) |
| Nereden / Nereye input odağı | `airport (16)` | — |

### Validasyon
- `fromCode === toCode` → error toast "Kalkış ile varış aynı olamaz"
- `fromCode` veya `toCode` boş → error toast "Lütfen kalkış ve varış noktalarını seçin"
- Geçerse → info toast "Uçuşlar aranıyor…" → 350ms → `nav('results')`

### Layout
HeroBand (240px) + arama kartı (beyaz, `boxShadow: 0 22px 50px rgba(10,22,40,0.18)`, `borderRadius: 14`):

**Seyahat tipi selector:**
Pill toggle (inline-flex): Gidiş-Dönüş · Tek yön · Çoklu
- Aktif: beyaz bg + soft shadow; pasif: transparan

**4'lü form grid:**
| Alan | Bileşen | State |
|---|---|---|
| Nereden | `CityAutocomplete` | `booking.fromCode` |
| Nereye | `CityAutocomplete` | `booking.toCode` |
| Gidiş tarihi | `DatePickerCell` | `booking.depDate` |
| Dönüş tarihi | `DatePickerCell` | `booking.retDate` (Tek yön'de disabled) |

**2. satır grid (1fr 1fr 2fr):**
- Yolcu: "1 Yetişkin" (statik görüntü, state'e bağlı)
- Kabin: "Economy" (statik görüntü)
- `ThyButton variant="search"` fullWidth: "Ara →"

### Veri
`useBooking()` hook'u `thy-booking-v1` localStorage'ını yönetir. Tüm form alanları `setBooking({...})` ile yazılır; ekran kapanınca otomatik persist olur.

### Görsel Kimlik
| Token | Değer |
|---|---|
| Tema | Light |
| active="search" | WebTopNav |
| HeroBand | Accent gradient, 240px |
| Form kartı | `#fff` + ağır shadow |
| Trip toggle | `#F3F5F8` bg, `border-radius: 999` |
| Giriş alanları | `#E2E8F0` border, 10px radius |
| Ara butonu | `ThyButton variant="search"` — accent rengi |

---

## 04 · RESULTS — Uçuş Sonuçları

### Amaç
Seçilen rota için uçuş listesi ve fare/tarife seçimi. Gidiş-Dönüş modunda iki adımlı (gidiş → dönüş seçimi).

### Nereden Gelinir
| Kaynak | Tetikleyici |
|---|---|
| `search (03)` | "Ara" CTA (350ms sonra) |
| `board (02)` | Hızlı arama formu |

### Ekrandan Çıkış
| Tetikleyici | Hedef | Gecikme |
|---|---|---|
| "← Aramayı düzenle" | `search (03)` | — |
| Tek yön uçuş seçildi | `confirm (14)` | 500ms |
| Gidiş+dönüş her ikisi seçildi | `confirm (14)` | 500ms |

### State
| State | Tip | Açıklama |
|---|---|---|
| `sort` | `'price'\|'time'\|'duration'` | Sıralama kriteri |
| `direct` | `boolean` | Sadece direkt uçuşlar filtresi |
| `leg` | `'out'\|'ret'` | Gidiş-Dönüş modunda aktif bacak |

### Uçuş Verisi (Deterministik)
Fiyat ve saat seed'i: `(fromCode + toCode)` char kodları toplamı → sabit ama rota bazında farklı.

**4 uçuş:**
| Tag | Delta | Özellik |
|---|---|---|
| cheap | −380 TL | En ucuz |
| (adsız) | 0 | Referans fiyat |
| gold | +420 TL | Premium saat |
| night | −120 TL | Aktarmalı, gece |

**4 tarife:**
| Tarife | Delta | Renk |
|---|---|---|
| EcoFly | 0 | Teal `#4CA7BB` |
| ExtraFly | +740 TL | Blue `#0066CC` |
| PrimeFly | +2360 TL | Brown `#88594A` |
| BusinessPrime | +8000 TL | Dark `#3F2D24` |

### Layout
2 kolon grid (260px sidebar + 1fr içerik):

**Sidebar (sticky, top: 80):**
- Sıralama: radio butonlar (Fiyata göre / Saate göre / Süreye göre)
- Aktarma: "Sadece direkt" checkbox
- (Tarih filtresi placeholder)

**Ana içerik:**
- Breadcrumb: `IST → FCO · 15 Haz · 1 Yetişkin · Economy`
- Gidiş-Dönüş badge: "Gidiş seçiliyor" / "Dönüş seçiliyor"
- Uçuş kartları listesi: her kart → tarife grid → seçim CTA

### Seçim Akışı
```
Uçuş kartına tıkla → tarife accordion açılır
Tarife seç → toast "Uçuş seçildi"
  Tek yön: → confirm (14) (500ms)
  Gidiş-Dönüş gidiş seçildi: leg='ret' + toast "Şimdi dönüş seçin"
  Dönüş seçildi: → confirm (14) (500ms)
```

### Görsel Kimlik
| Token | Değer |
|---|---|
| Tema | Light |
| active="search" | WebTopNav (arama devam ediyor) |
| Uçuş kartı | `#fff` + `#E2E8F0` border + hover lift |
| Tarife renkleri | EcoFly teal / ExtraFly blue / PrimeFly brown / BusinessPrime koyu |
| Seç butonu | Accent rengi, tam genişlik |
| Sidebar | Sticky, beyaz, `#E2E8F0` border |
