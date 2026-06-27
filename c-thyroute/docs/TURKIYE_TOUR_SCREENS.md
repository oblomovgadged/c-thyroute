# Türkiye Turu + Tur Rotası Ekranları — Screen Doc

> ID: `turkiyeTuru` (17) + `turkiyeRoute` (18)
> Dosya: `web-screens-d.jsx`
> Güncelleme: 2026-06-27

---

## 17 · TÜRKİYE TURU — NatGeo Poster

### Amaç
THY Route'un editöryal Türkiye turu ürünü. 8 hazır tur paketi gösterir; kullanıcı seçince rota planlama ekranına geçer.

### Nereden Gelinir
| Kaynak | Tetikleyici |
|---|---|
| `board (02)` | "Türkiye Turu" banner kartı |
| `board (02)` | Türkiye rota kartları |
| `splash (01)` | Türkiye Turu featured kartı |

### Ekrandan Çıkış
| Tetikleyici | Hedef |
|---|---|
| Tur kartı tıklama | `turkiyeRoute (18)` — `thyBuildSelection(tour)` çağrılır |

### Görsel Kimlik — NatGeo / Expedition Estetiği
- Font: EB Garamond (serif), Playfair Display, Bebas Neue
- Renk: `#0E0E0E` bg + `#F4EBD9` metin + `#F4C24C` sarı aksan
- Hero 720px, `#E5712C → #B7372A → #6F1E1A → #1F0907` ateş gradient + route-map overlay (`mix-blend-mode: overlay`)
- Sarı 6px çerçeve: `border: '6px solid #F4C24C'` (20px inset)
- Büyük H1: 168px / 900 Playfair + İtalik 116px sarı alt başlık
- Sağ üst rakam: "8" (Bebas Neue 96px, sarı) + "journeys —" (Playfair İtalik 28px)
- Eyebrow: "THY ROUTE EXPEDITION · VOL. XXIV" (italic, 4 tracking, sarı)
- Route-network image: sepia filtreli, `mixBlendMode: 'overlay'`

### Tur Kartları Grid
8 tur, her kart: tur başlığı + şehirler + gün sayısı + fiyat + "Seç →" CTA

---

## 18 · TUR ROTASI — Railway Timetable

### Amaç
Seçilen Türkiye turunu tren tarifesi estetiğiyle detaylandırır. Tarih, gün sayısı ve yolcu sayısı düzenlenebilir; anlık olarak rota planı (stops) yeniden hesaplanır.

### Nereden Gelinir
`turkiyeTuru (17)` — tur seçilince `thyBuildSelection(tour)` + `nav('turkiyeRoute')`

### Ekrandan Çıkış
| Tetikleyici | Hedef | Koşul |
|---|---|---|
| "Rotayı kaydet" | `map (06)` | 600ms, `saveToMyRoutes(rec)` |
| "Biniş kartını gör" | `boarding (05)` | 600ms, `saveToMyRoutes(rec)` |
| "Co-Pilot davet" | `copilot (07)` | — |

### State
| State | Tip | Açıklama |
|---|---|---|
| `startDate` | `Date` | Başlangıç tarihi (4 preset: 15 Eyl 2026'dan 2 haftada bir) |
| `days` | `number` | Tur gün sayısı (tur default'u veya user seçimi) |
| `pax` | `number` | Yolcu sayısı |

### Veri
`thyBuildSelection(tour, {startISO, days, pax})` → `sel` objesi:
- `sel.stops`: Her durağın kodu, adı, gece sayısı, uçuş bilgisi
- `sel.totalPrice`: Toplam fiyat (TL)
- `sel.startDate` / `sel.endDate`

`startDate`, `days`, `pax` değişince `useMemo` ile `sel` yeniden hesaplanır.

### Rota Kaydı Şeması
`buildSaveRecord()` ile oluşturulan kayıt `thy-route-extra-saved-v1` ve `thy-route-selections-v1`'e eklenir:
```json
{
  "id":      "TRIP-4821",
  "pnr":     "TK-A3X7KQ",
  "name":    "Karadeniz Keşfi · 14 gün",
  "legs":    ["IST", "TZX", "RZE", "IST"],
  "dates":   "15 Eyl – 29 Eyl 2026",
  "pax":     "2 yetişkin",
  "miles":   "+2.840",
  "price":   "24.680,00",
  "status":  { "label": "PLANLANIYOR", "tone": "navy" },
  "cabin":   "EcoFly",
  "tourId":  "karadeniz"
}
```

Deduplicate: aynı `tourId + dates` kombinasyonu ikinci kez eklenmez.

### Layout — Railway Timetable Estetiği
- Light tema, `#FAFAFA` bg
- Font: Space Grotesk

**Üst kontrol satırı:**
- 4 tarih preset chip (2'şer haftalık): tıklanınca `startDate` güncellenir
- Gün sayısı +/− stepper
- Yolcu sayısı +/− stepper
- Anlık toplam fiyat (sağ üst)

**Timetable:**
Her stop satırı: ◉ bağlantı noktası + Şehir / IATA / gece sayısı / uçuş kodu + saat

**Alt CTA'lar:**
- "Rotayı kaydet" → kırmızı
- "Biniş kartını gör" → koyu
- "Co-Pilot davet" → transparan, altın

### Görsel Kimlik (Tur Rotası)
| Token | Değer |
|---|---|
| Tema | Light |
| Bg | `#FAFAFA` |
| Font | Space Grotesk |
| Stop noktası | Accent rengi dolu daire |
| Bağlantı çizgisi | 1px dashed accent |
| Toplam fiyat | Accent rengi, büyük |
| Kaydet CTA | `#B7312C` |
