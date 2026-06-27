# Fiyat Alarmı Ekranı — Screen Doc

> ID: `priceAlert` · Num: 15
> Dosya: `web-screens-d.jsx`
> Güncelleme: 2026-06-27

---

## Amaç

Kullanıcının belirli bir rota için **hedef fiyat alarmı kurmasını** sağlar. İki modda çalışır:

- **Route mode:** Kayıtlı Rotalarım'dan "🔔 Fiyat alarmı" ile gelinir — rotanın gerçek toplam fiyatı + bileşen kırılımı gösterilir
- **Default mode:** Üst menüden veya Bildirimler'den direkt gelinir — IST·FCO örnek ticker'ı gösterilir

---

## Ekrana Kimler Gider / Nereden Gelinir

| Kaynak | Tetikleyici | Mod |
|---|---|---|
| `routes (24)` Kayıtlı Rotalarım | 🔔 Fiyat alarmı butonu | Route mode |
| `notifications (09)` Bildirimler | Alarm kur CTA | Default mode |
| WebTopNav / doğrudan | Menü tıklama | Default mode |

---

## Ekrandan Çıkış (nav çağrıları)

| Tetikleyici | Hedef | Koşul |
|---|---|---|
| `← ROTALARIM` geri butonu | `routes (24)` | Route mode |
| `← BACK` geri butonu | `search (03)` | Default mode |
| `✦ ALARMI KUR →` CTA | `routes (24)` | Route mode · 700ms sonra |
| `✦ ALARMI KUR →` CTA | `notifications (09)` | Default mode · 700ms sonra |

---

## localStorage Akışı

```
YAZANLAR
  routes (24) → thy-route-alarm-target-v1   (rota objesi, alarm sayfası mount'ta okunur)

OKUYANLAR
  priceAlert (15) → thy-route-alarm-target-v1   (mount'ta; routeMode=true ise parse edilir)
  priceAlert (15) → thy-route-alarms-v1          (mount'ta; kurulu alarmları listeler)

YAZANLAR (alarm kurulunca)
  priceAlert (15) → thy-route-alarms-v1          (yeni alarm unshift edilir, max 50)
  priceAlert (15) → thy-route-alarm-target-v1    (alarm kurulunca removeItem ile silinir)
```

### `thy-route-alarm-target-v1` objesi şeması
```json
{
  "id":       "TRIP-0042",
  "name":     "Roma + Antalya Yaz Turu",
  "legs":     ["IST", "FCO", "AYT"],
  "dates":    "12–19 Tem",
  "pax":      "2 yetişkin",
  "cabin":    "EcoFly",
  "price":    "1284000"   // kuruş cinsinden (÷100 = TL)
}
```

### `thy-route-alarms-v1` liste elemanı şeması
```json
{
  "routeId":   "TRIP-0042",
  "routeName": "Roma + Antalya Yaz Turu",
  "legs":      ["IST", "FCO", "AYT"],
  "currentTL": 12840,
  "targetTL":  11300,
  "savingsTL": 1540,
  "setAt":     "2026-06-27T14:32:08.000Z"
}
```

---

## Bileşenler

### `WebActiveAlarmsList`
Sayfanın en üstünde. `thy-route-alarms-v1`'i okur; liste boşsa render etmez.

**Grid kolonları:** Rota adı (1.4fr) · Güncel fiyat (1fr) · ✦ Hedef (1fr) · Tasarruf (1fr) · × sil (auto)

- Her satır: rota bacakları (IST → FCO) + altında rota adı ve tarih
- Güncel fiyat beyaz, hedef altın (`#E5C97A`), tasarruf yeşil (`#22C55E`)
- × butonu: `rgba(239,111,102,0.32)` border, tıklayınca state + localStorage güncellenir

### `WebElegantSlider`
Custom pointer-event tabanlı kaydırıcı (native `input[type=range]` değil).

| Parça | Stil |
|---|---|
| Rail | `rgba(255,255,255,0.06)` + `rgba(197,160,89,0.18)` border + inset shadow |
| Filled | `kırmızı → altın → açık altın` gradient + gold glow |
| Thumb | 28×28 radial-gradient altın küre + `#1A1206` çerçeve + çift gölge |
| Sürüklenirken | `scale(1.15)` + transition: none |
| Tick noktaları | %0/25/50/75/100'de 1px çizgiler; geçilen tik altına döner |

Eventler: `onPointerDown` → `setDragging(true)` → global `pointermove/pointerup`

### `WebElegantSlider` props
| Prop | Tip | Açıklama |
|---|---|---|
| `min` | number | Slider minimum değer (TL) |
| `max` | number | Slider maximum değer (TL) |
| `step` | number | Adım (50/100/500) |
| `value` | number | Kontrollü değer |
| `onChange` | fn(number) | Değer değişince çağrılır |

### `priceBreakdown(route)`
Toplam fiyatı kabin tipine göre bileşenlere ayırır.

| Kabin | Uçuş | Otel | VIP Transfer |
|---|---|---|---|
| EcoFly (default) | %62 | %31 | %7 |
| BusinessPrime | %73 | %22 | %5 |

Kabin tespiti: `route.cabin`'de "business" veya "prime" geçiyorsa BusinessPrime.

### Adaptif slider aralığı
| Parametre | Formül |
|---|---|
| `sliderMin` | `total × 0.70` → 500 TL'ye yuvarlanır |
| `sliderMax` | `total × 1.05` → 500 TL'ye yuvarlanır |
| `initialTarget` | `total × 0.88` → step'e yuvarlanır (varsayılan -%12) |
| Step | total > 50.000 → 500 · total > 10.000 → 100 · diğer → 50 |

### Fiyat grafiği (SVG)
- ViewBox: 1200×280 (`preserveAspectRatio="none"`, tam genişlik)
- 30 noktalı simüle fiyat hareketi (`data` state)
- Route mode'da son nokta rotanın gerçek toplamına eşitlenir
- Yeşil `polyline` + gradient `polygon` fill + pulsing `circle` (canlı nokta)
- Hedef çizgisi: altın dashed `line` + `#C5A059` renkli `rect` badge ("HEDEF" / "TARGET")
- Yatay grid çizgileri: `#1A3326` dashed

### Stats grid (6 kolon)
`EN DÜŞÜK · EN YÜKSEK · ORTALAMA · GÜNCEL · TASARRUF · HEDEF`
Slider hareket ettikçe TASARRUF ve HEDEF reaktif güncellenir.

---

## Görsel Kimlik

Ekran **Bloomberg terminal** estetiği taşır — Cockpit temasının en koyu varyantı:

| Token | Değer |
|---|---|
| Background | `#08120D` (harita yeşili karanlık) |
| Font | `DM Mono, monospace` |
| Panel bg | `#0B1A14` |
| Border | `#1A3326` |
| Canlı nokta | `#22C55E` + `0 0 8px #22C55E` glow |
| Hedef rengi | `#C5A059` (altın) |
| Primary CTA | `linear-gradient(135deg, #C5A059 → #E5C97A)` + `#1A1206` metin |
| Eyebrow | uppercase · letterSpacing: 1.8 · color: `#C5A059` |

---

## Test Senaryoları

| Senaryo | Girdi | Beklenen |
|---|---|---|
| Route mode açılış | `thy-route-alarm-target-v1` = TRIP-0042 (12.840 TL EcoFly) | Kırılım paneli: Uçuş 7.961 · Otel 3.980 · VIP 899 · Toplam 12.840 TL |
| Slider başlangıç | Yukarıdaki rota | Target ≈ 11.300 TL (×0.88), step 100 TL |
| Tasarruf göstergesi | Target = 10.000 TL, current = 12.840 | −2.840 TL · −22.1% (yeşil) |
| Hedef = mevcut üstünde | Target = 13.000 TL | +160 TL · +1.2% (kırmızı) |
| Alarm kuruldu | CTA tıklama | Toast "Alarm kuruldu · 11.300 TL · tasarruf 1.540 TL" + 700ms → routes |
| Liste görünümü | `thy-route-alarms-v1` = 3 alarm | 3 satır liste, geri butonu `← ROTALARIM` |
| Liste boş | `thy-route-alarms-v1` = [] | `WebActiveAlarmsList` render etmez |
| Default mode | localStorage boş | IST·FCO ticker · slider 3.900–6.800 TL · geri → search |
| Alarm silme | × butonu | State + localStorage güncellenir, liste anında kısalır |

---

## Bilinen Sınırlamalar

- Fiyat grafiği simüle edilmiş (gerçek API bağlantısı yok)
- Kırılım yüzdeleri deterministik (gerçek otel/uçuş fiyatı ayrıştırması yok)
- Bildirim sıklığı (Anında/Günde/Haftada) UI'da seçilir ama state'e bağlı değil — kalıcı değil
- "Anında" butonu varsayılan aktif görünür ama tıklamayla toggle çalışmıyor
