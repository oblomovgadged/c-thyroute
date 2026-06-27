# Mobil — Türkiye Turu + Tur Rotası Ekranları

> ID: `turkiyeTuru` (18) + `turkiyeRoute` (19)
> Dosya: `screens-d.jsx`
> Güncelleme: 2026-06-27

---

## 18 · TÜRKİYE TURU

### Amaç
8 hazır Türkiye turu paketini NatGeo kapak estetiğiyle sunar. Tur kartına tıklayınca seçim yapılır ve `turkiyeRoute`'a geçilir.

### Nereden Gelinir
`board (02)` → Türkiye Turu banner

### Ekrandan Çıkış
Tur kartı `onSelect` → `thyBuildSelection(tour)` + `nav('turkiyeRoute')`

### TourCard (2026-06-27 güncellendi)
- `onSelect` prop eklendi — tıklanabilir
- `cursor: pointer` + hover: `translateY(-2px)` + glow
- `thyBuildSelection(tour)` çağrısı guard'lı: `typeof thyBuildSelection === 'function'`

---

## 19 · TUR ROTASI

### Amaç
Seçilen turun timetable estetiğiyle gösterimi. Duraklar arası havayolu bilgisi, özet ve "Rotanı Rezerve Et" CTA.

### Nereden Gelinir
`turkiyeTuru (18)` → tur kartı tıklama

### Ekrandan Çıkış
| Tetikleyici | Hedef | Koşul |
|---|---|---|
| ← Tur | `turkiyeTuru (18)` | — |
| Rotanı rezerve et | `map (06)` | `saveToMyRoutes` + 600ms |

---

## "Rotanı Rezerve Et" (2026-06-27 güncellendi)
Artık `nav('turkiyeRoute')` değil → **`nav('map')`**

Kaydedilen kayıt (`thy-route-selections-v1`):
```json
{
  "id": "TRIP-INKDAYT123",
  "name": "Türkiye Grand Turu",
  "legs": ["IST","NAV","DNZ","AYT"],
  "dates": "02·06 – 14·06",
  "pax": "1 yetişkin",
  "miles": "+4.820",
  "price": "32 400,00",
  "status": { "label": "PLANLANIYOR", "tone": "navy" },
  "cabin": "EcoFly"
}
```

---

## Duraklar Arası Havayolu (2026-06-27 eklendi)

`airlineFor(fromCode, toCode, idx)` helper — deterministik flight numarası üretir.

### Kural
| Rota çifti | Havayolu | Renk |
|---|---|---|
| NAV-DNZ, DNZ-AYT, AYT-ADB, ADB-AYT, ADB-DNZ | **AnadoluJet (AJ)** | `#E8450A` |
| Diğer tüm (IST-NAV, ADB-TZX vb.) | **THY (TK)** | `#B7312C` |

### Görsel — Connector Satırı
Her iki durak arasında:
- Sol: `2px dashed` havayolu renginde border
- İçerik: `AJ 1100` / `TK 1800` badge + havayolu adı + mini uçak SVG
- Badge: `background: al.color + '14'`, `border: al.color + '44'`

---

## Hardcoded Stops (mevcut)
```
IST → NAV → DNZ → AYT → ADB → TZX
02·06  05·06  07·06  08·06  12·06  14·06
```

Web versiyonundaki `thyBuildSelection` / `thyEnsureSelection` dinamik sistemi —
mobil `turkiyeRoute` şu an hardcoded stops kullanıyor; dinamik hale getirmek ileride yapılabilir.

---

## Görsel Kimlik
- Background: `#F0E4CD` + ruled paper pattern
- Font: EB Garamond (serif), DM Mono, Playfair Display, Bebas Neue
- Footer summary box: `#1F1A14` bg + `5px 5px 0 #B7312C` box-shadow
