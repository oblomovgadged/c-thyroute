# Mobil — Kayıtlı Rotalarım + Fiyat Alarmı Ekranları

> ID: `routes` (27) + `priceAlert` (16)
> Dosya: `screens-routes.jsx` + `screens-d.jsx`
> Güncelleme: 2026-06-27

---

## 27 · KAYITLI ROTALARIM (SavedRoutesScreen)

### Nereden Gelinir
`profile (10)` → Kayıtlı Rotalarım satırı

### Ekrandan Çıkış
| Tetikleyici | Hedef | localStorage |
|---|---|---|
| 🔔 Alarm butonu | `priceAlert (16)` | `thy-route-alarm-target-v1` yazar |
| Rotaya git | `map (06)` | — |
| Öde | `payment (28)` | `thy-route-pay-target-v1` yazar |
| + Yeni Rota | `search (03)` | — |
| ← | `profile (10)` | — |

### 🔔 Alarm Butonu (2026-06-27 eklendi)
Paylaş / Sil butonlarının solunda, altın rengi:
```jsx
style={{ color: '#C5A059', border: '1px solid rgba(197,160,89,0.45)', background: 'rgba(197,160,89,0.08)' }}
```
Bell SVG ikonu + "Alarm" / "Alert" label.

`setAlarm(route)`:
```js
localStorage.setItem('thy-route-alarm-target-v1', JSON.stringify(route));
nav('priceAlert');
```

### Rota Kartı Anatomisi
- Üst: KRPill (statü) + rota ID (mono)
- Orta: Rota adı + tarih/yolcu/kabin + KRSegBar + mil chip
- Alt: TOPLAM fiyat + eta
- Aksiyon satırı: 🔔 Alarm · Paylaş · Sil · **Öde →** (kırmızı, flex 1.4)
- Sil confirm overlay: blur backdrop + "ROTAYI SİL" + Vazgeç/Sil

---

## 16 · FİYAT ALARMI (PriceAlertScreen)

### Nereden Gelinir
| Kaynak | Mod |
|---|---|
| `routes (27)` 🔔 butonu | **Route mode** — rota verisi okunur |
| `board (02)` quick action | **Default mode** — IST·FCO örneği |
| `notifications (09)` CTA | Default mode |

### Ekrandan Çıkış
| Tetikleyici | Hedef |
|---|---|
| ← ROTALARIM | `routes (27)` (route mode) |
| ← BACK | `search (03)` (default mode) |
| ✦ ALARMI KUR | `routes (27)` 700ms (route mode) |
| ✦ ALARMI KUR | `notifications (09)` 700ms (default mode) |

---

### Route Mode — Rota Kırılımı Paneli

Mount'ta `thy-route-alarm-target-v1` okunur. Varsa `routeMode = true`.

`mobileBreakdown(route)`:
```
EcoFly   → Uçuş %62 · Otel %31 · VIP %7
Business → Uçuş %73 · Otel %22 · VIP %5
```

**Panel görünümü (altın border, koyu bg):**
- "✦ KAYITLI ROTA · TOPLAM" eyebrow
- Rota adı (Playfair Display)
- 3 kolon grid: ✈ Uçuş · 🏨 Otel · 🚘 VIP (TL değerleri)
- Ayraç + "= TOPLAM" altın rakam

---

### Adaptif Slider

| Parametre | Formül |
|---|---|
| `sliderMin` | `total × 0.70` → 500 TL'ye yuvarla |
| `sliderMax` | `total × 1.05` → 500 TL'ye yuvarla |
| `step` | total > 50k → 500 · > 10k → 100 · diğer → 50 |
| `initialTarget` | `total × 0.88` |

Slider: native `input[type=range]` (`accentColor: '#C5A059'`) — mobil için sadelik.

Gerçek zamanlı: slider hareket → tasarruf TL + % güncellenir.

---

### Alarm Kaydetme (`handleSetAlarm`)

```js
localStorage['thy-route-alarms-v1'].unshift({
  routeId, routeName, legs, currentTL, targetTL, savingsTL, setAt
})
localStorage.removeItem('thy-route-alarm-target-v1')
```

Toast: "Alarm kuruldu · X TL · tasarruf Y TL"

---

### Grafik (Bloomberg terminal, mobil)
- `W=320, H=110` SVG, `preserveAspectRatio="none"`
- Yeşil fill gradient + polyline + pulsing dot
- Altın dashed hedef çizgisi + "HEDEF/TARGET" badge
- Son data noktası = rotanın gerçek totali

---

### Görsel
- Background: `#08120D`
- Font: DM Mono
- Panel bg: `#0B1A14`
- Hedef rengi: `#C5A059`
- Canlı dot: `#22C55E` + glow
- CTA: `linear-gradient(135deg, #C5A059, #E5C97A)` + `#1A1206` metin
