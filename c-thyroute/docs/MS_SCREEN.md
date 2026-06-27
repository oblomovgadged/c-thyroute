# Miles & Smiles Ekranı — Screen Doc

> ID: `ms` · Num: 08
> Dosya: `web-screens-b.jsx` (satır 1384–)
> Güncelleme: 2026-06-27

---

## Amaç

Kullanıcının M&S kartı, mil bakiyesi ve statü ilerleme durumunu gösterir. Partner ağından mil kazanma/harcama imkânı sunar. TKPAY cüzdanına köprü görevi görür.

---

## Nereden Gelinir

| Kaynak | Tetikleyici |
|---|---|
| `map (06)` Rota haritası | M&S partner rezervasyon (900ms delay) |
| `boarding (05)` Biniş Kartı | "M&S avantajlarım" CTA |
| WebTopNav | `active="ms"` — üst menü direkt erişim |

---

## Ekrandan Çıkış

| Tetikleyici | Hedef |
|---|---|
| TKPAY banner → butonu | `tkpay (23)` |
| WebTopNav linkleri | Diğer ekranlar |

> M&S ekranı gelen bir ekrandır; kendi içinden başka bir ana ekrana yönlendirme yoktur (TKPAY hariç).

---

## Bileşenler

### Altın M&S Kartı (sol üst)
Fiziksel kredi kartı tasarımı:
- **Statü:** `ELITE PLUS · TK` (uppercase eyebrow)
- **İsim:** Aylin Kaya (Outfit 800, 32px)
- **Kart no:** `4218 ····  ····  2107` (JetBrains Mono, maskelı)
- **Mil:** `87.420` (JetBrains Mono, 44px, bold)
- **Statü çubuğu:** `12.580 mil ile ELITE` + %64 dolu progress bar
- Shimmer sweep animasyonu (skewX dekore şerit)
- Sağ üst: THY turna (`<Crane>` bileşeni)
- Gradient: `#E8C97A → #C5A059 → #A0813C → #C5A059`

### Hızlı Mil Kazanma Grid (sağ üst)
2×2 grid, koyu glass kartlar:
| İkon | Kategori | Örnek değer |
|---|---|---|
| ✈ plane | Uçuş | +2.840 mi |
| 🛏 bed | Otel | +500 mi |
| 🚗 car | Araç | +125 mi |
| ☕ coffee | Yeme | +80 mi |

### TKPAY Banner
Tam genişlik, altın glass banner:
- Sol: TKPAY cüzdan ikonu (52×52, altın radial)
- Orta: "Millerini TL'ye dönüştür" başlık + `87.420 mi → 13.113 TL · 1 mi ≈ 0,15 TL`
- Sağ: `TKPAY Cüzdan →` altın pill butonu
- `nav('tkpay')` çağırır

### Tab Sistemi
`ThyTabs` bileşeni ile 3 sekme:

**1. Genel Bakış (overview)**
Partner grid: tüm M&S partner markaları (Marriott Bonvoy, Hilton Honors, ALL, Rixos, IHG, Booking.com, Rocketmiles, HalalBooking, Kaligo, Avis, Budget, Enterprise, Sixt, ProGo, Plaza Premium, Airport WiFi Rentals, Garanti BBVA, Divan)
Kategori chip filtreleri: Tümü · Konaklama · Araç · VIP Transfer · Lounge · Hizmetler · Banka · Yeme

**2. Mil Kazan (earn)**
Mil kazanım kanalları listesi.

**3. Mil Harca (spend)**
Mil harcama seçenekleri.

### PartnerItem bileşeni
Her partner `PartnerItem` ile render edilir:
- Sol: kategori ikonu (bed/car/shield/coffee/wifi/cardIcon)
- Orta: Marka adı + mil teklifi
- Sağ: "Haritada Bul" veya "Aktifleştir" aksiyon butonu

---

## Veri

### Partner listesi
`web-screens-b.jsx` içindeki `PartnerItem` grid'i — bu **statik bir liste** (map ekranındaki dinamik M&S pinlerinden bağımsız). Güncelleme: 2026-06-27 itibarıyla tüm markalar `MS_PARTNERS_v2_DINAMIK.md`'deki listeyle eşleştirildi.

### Mock kullanıcı verisi
| Alan | Değer |
|---|---|
| İsim | Aylin Kaya |
| Statü | ELITE PLUS |
| Mil | 87.420 |
| Sonraki statü | ELITE (12.580 mil eksik) |
| İlerleme | %64 |
| Kart no | 4218 ···· ···· 2107 |

---

## Görsel Kimlik

| Token | Değer |
|---|---|
| Tema | Dark — en koyu cockpit varyantı |
| Background | `linear-gradient(180deg, #050B14 → #0A1628 → #0F2244)` |
| Kart gradient | `#E8C97A → #C5A059 → #A0813C → #C5A059` |
| Kart metin | `#0A1628` (koyu, kart üstü) |
| Mil rakamı | JetBrains Mono 800 |
| Glass kartlar | `rgba(255,255,255,0.045)` + `rgba(255,255,255,0.085)` border |
| TKPAY banner border | `rgba(197,160,89,0.4)` |
| TKPAY glow | `0 0 22px rgba(197,160,89,0.15)` |

---

## Bilinen Sınırlamalar

- "Haritada Bul" / "Aktifleştir" butonları şu an sadece toast gösterir; map ekranına yönlendirme eklenmedi
- Mil kazanım ve harcama tab'ları placeholder içerik taşıyor
- Partner listesi harita pinleriyle senkronize ama ayrı tutuldu (ileride `getMSPartners('__GENERIC__')` ile dinamik yapılabilir)
- Mock kullanıcı verisi — gerçek API bağlantısı yok
