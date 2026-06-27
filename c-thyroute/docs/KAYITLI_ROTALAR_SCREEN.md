# Kayıtlı Rotalarım Ekranı — Screen Doc

> ID: `routes` · Num: 24
> Dosya: `web-screens-routes.jsx`
> Güncelleme: 2026-06-27

---

## Amaç

Kullanıcının daha önce kaydettiği çok-şehirli rotaları listeler. Her rota kartından ödeme, alarm kurma, haritada görme ve silme aksiyonları yapılabilir.

---

## Ekrana Kimler Gider / Nereden Gelinir

| Kaynak | Tetikleyici |
|---|---|
| `profile (10)` Profil | "Kayıtlı Rotalarım" kartı |
| `payment (25)` Ödeme | ← Geri butonu |
| `confirm (14)` Onay | "Rotayı kaydet" → otomatik yönlendirme |
| `map (06)` Rota | "Rotayı kaydet" → otomatik yönlendirme |

---

## Ekrandan Çıkış (nav çağrıları)

| Tetikleyici | Hedef | localStorage |
|---|---|---|
| `+ Yeni Rota` butonu | `search (03)` | — |
| `🔔 Fiyat alarmı` butonu | `priceAlert (15)` | `thy-route-alarm-target-v1` yazılır |
| `Rotaya git` butonu | `map (06)` | — |
| `Öde` butonu | `payment (25)` | `thy-route-pay-target-v1` yazılır |

---

## localStorage Akışı

```
OKUYANLAR
  routes (24) → thy-route-selections-v1   (kayıtlı rota listesi, mount'ta okunur)

YAZANLAR
  routes (24) → thy-route-pay-target-v1   (Öde tıklandığında seçili rota)
  routes (24) → thy-route-alarm-target-v1 (🔔 tıklandığında seçili rota)
```

### `thy-route-selections-v1` liste elemanı şeması
```json
{
  "id":       "TRIP-0042",
  "name":     "Roma + Antalya Yaz Turu",
  "legs":     ["IST", "FCO", "AYT"],
  "dates":    "12–19 Tem",
  "pax":      "2 yetişkin",
  "cabin":    "EcoFly",
  "price":    "1284000",
  "savedAt":  "2026-06-15T10:22:00.000Z"
}
```

---

## Bileşenler

### Rota Kartı

Her kayıtlı rota `webKRCard()` stiliyle bir kart içinde render edilir.

**Sol kolon — Rota Bilgisi:**
- Bacaklar: `IST → FCO → AYT` (IATA kodları, büyük mono font)
- Rota adı (Playfair Display, altın rengi)
- Tarih · kabin · yolcu sayısı (küçük gri)
- Toplam fiyat (büyük, beyaz)
- Yatay fare — rota timeline görselleştirmesi

**Sağ kolon — Aksiyon Butonları (yukarıdan aşağıya):**

1. **🔔 Fiyat alarmı** (altın gradient, gold border, notification bell ikonu)
2. **Rotaya git** (altın transparan bg, harita ikonu)
3. **Öde** (THY kırmızısı `#B7312C`, primary CTA)
4. **Paylaş** / **Sil** (ghost butonlar)

### `webKRGhost()` helper
Ghost buton stili: transparan bg, `rgba(255,255,255,0.10)` border, `#F4EBD9` metin.

### `webKRGlassMini()` helper
Küçük cam buton stili: `rgba(255,255,255,0.045)` bg, ince border.

### Filtre Satırı
Kartların üstünde: `Tümü · Yurt içi · Yurt dışı · İş seyahati` chip'leri + `+ Yeni Rota` kırmızı CTA butonu.

---

## Görsel Kimlik

Cockpit tema — koyu glassmorphism:

| Token | Değer |
|---|---|
| Background | `#0A1628` (Airy Premium dark) |
| Kart bg | `rgba(255,255,255,0.035)` |
| Kart border | `rgba(255,255,255,0.08)` |
| Bacak font | JetBrains Mono, 900, büyük |
| Rota adı | Playfair Display, altın `#C5A059` |
| Fiyat | `#F4EBD9`, büyük |
| Fiyat alarmı butonu | `linear-gradient(135deg, rgba(197,160,89,0.16), rgba(197,160,89,0.05))` + `rgba(197,160,89,0.42)` border |
| Fiyat alarmı hover | `rgba(197,160,89,0.28)` bg + `0 0 18px rgba(197,160,89,0.32)` glow |
| Rotaya git butonu | `rgba(197,160,89,0.10)` bg |
| Öde butonu | `#B7312C` bg, beyaz metin |

---

## Boş Durum (Empty State)

Liste boşsa:
- Büyük uçak ikonu (SVG)
- Başlık: "Henüz kayıtlı rotanız yok"
- Alt metin: "Uçuş arayın ve rotanızı kaydedin"
- CTA: "Uçuş Ara →" → `search (03)`

---

## WebPaymentOptionsScreen (Ekran 25)

`web-screens-routes.jsx`'in ikinci ekranı. Rotalarım'dan "Öde" ile gelinir.

### Veri okuma
`thy-route-pay-target-v1` → seçilen rotayı çeker, ödeme detaylarını doldurur.

### Akış
```
payment (25)
  ├─ [← Geri] → routes (24)
  └─ [Ödemeyi Onayla] → 1400ms loading → toast "Ödeme onaylandı" → 700ms → confirm (14)
```

### Ödeme Yöntemleri
- Kredi/Banka kartı (varsayılan)
- Miles&Smiles Mil kullanımı
- TKPAY

### Görsel
Cockpit tema, kart numarası `**** **** **** 4829` maskeli, CVV/tarih alanları.

---

## Test Senaryoları

| Senaryo | Girdi | Beklenen |
|---|---|---|
| Normal liste | `thy-route-selections-v1` = 3 rota | 3 kart listelenir |
| Boş liste | `thy-route-selections-v1` = [] veya null | Empty state görünür |
| Fiyat alarmı | TRIP-0042 kartında 🔔 tıkla | localStorage yazılır → priceAlert açılır |
| Öde | TRIP-0042 kartında Öde tıkla | localStorage yazılır → payment açılır |
| Rotaya git | TRIP-0042 kartında tıkla | map (06) açılır |
| Ödeme onay | payment'ta onayla | confirm (14) açılır (2100ms toplam) |

---

## Bilinen Sınırlamalar / Sonraki Adımlar

- Filtre chip'leri (Yurt içi/dışı/İş) UI'da görünür ama filtreleme aktif değil
- Rota silme: localStorage'dan kaldırma var ama "emin misiniz?" confirm diyaloğu yok
- Paylaş butonu: toast gösterir ama gerçek share API bağlantısı yok
- Ödeme formu: gerçek ödeme gateway bağlantısı yok (demo akış)
- Mil kullanımı: M&S bakiyesi gerçek değil (mock)
