# Mobil — Rota Haritası Ekranı (MapScreen)

> ID: `map` · Num: 06
> Dosya: `screens-b.jsx`
> Güncelleme: 2026-06-27

---

## Amaç
Seçilen destinasyona ait şehir haritası, 3 günlük plan, Keşfet (POI) rehberi ve Miles&Smiles partner pinleri. Rotayı kaydetme ve Co-Pilot ile paylaşma buradan yapılır.

---

## Nereden Gelinir
| Kaynak | Tetikleyici |
|---|---|
| `board (02)` | Quick action — Rota |
| `confirm (15)` | Rotaya ekle (600ms) |
| `boarding (05)` | Rota haritasına git |
| `turkiyeRoute (19)` | Rotanı rezerve et (600ms) |
| `routes (27)` | Rotaya git |

---

## Ekrandan Çıkış
| Tetikleyici | Hedef | localStorage |
|---|---|---|
| M&S partner rezervasyon | `ms (08)` 900ms | — |
| "Rotanı Kaydet →" butonu | `routes (27)` 700ms | `thy-route-selections-v1` yazar |
| AppTabBar | Diğer ekranlar | — |

---

## "Rotanı Kaydet" Butonu (2026-06-27 eklendi)

Plan panelinin altında, "Yeni durak ekle" butonundan sonra:

```
[💾 Rotanı Kaydet →]
```

**Style:** Koyu navy gradient (`#0A1628 → #1B3868`) + altın border + `#E5C97A` metin + floppy disk SVG ikonu

**Kayıt mantığı:**
```js
id = 'TRIP-' + fromCode + destCode + Date.now().slice(-4)
rec = { id, name: city + ' Rotası', legs: [from, to], dates, pax, miles, price, status, cabin }
thy-route-selections-v1 ← list.unshift(rec)
```
Deduplicate: aynı `id` iki kez eklenmez.

Toast: "Rota kaydedildi → Rotalarım" → 700ms → `nav('routes')`

---

## State

| State | Açıklama |
|---|---|
| `dayIx` | `0\|1\|2\|'discover'` — aktif plan sekmesi |
| `openPoi` | Açık flyout POI id (ms_ prefix = M&S partner) |
| `editingNote` | Not düzenleme modu POI id |
| `noteDraft` | Anlık not taslağı |
| `discoverCat` | Keşfet kategorisi |
| `clickedPoint` | Harita tıklama koordinatı |
| `msMapActive` | M&S harita toggle |
| `msOnly` | Sadece M&S filtresi |

---

## Miles&Smiles Entegrasyonu

`getMSPartners(destCode)` → dinamik partner listesi (ms-partners.jsx v2)

- `msMapActive` toggle → haritada altın `✦` pinler
- M&S pinine tıkla → `MSReservationCTA` flyout → `reserveMS()` → `nav('ms')` 900ms
- `MSOnlyChip` — sadece M&S pinleri göster
- `verb` mapping: stay/car/vip/lounge/travel_services/finance/dining → TR/EN

---

## Harita
`DestLeafletMap` bileşeni — `destCode` bazlı. `booking.toCode || 'FCO'` fallback.

**⚠ Bilinen sorun:** `booking.toCode` set edilmemişse (kullanıcı search yapmadan direkt map'e geldiyse) harita FCO gösterir. Çözüm önerisi: map başlığına şehir picker eklenmeli (todo #15).

---

## Görsel
- Background: `#FAF6EE` (krem)
- Harita: 310px, `clipPath: polygon(...)` köşe kırpması (magazine torn-edge)
- Plan panel: beyaz kartlar, Playfair başlıklar
- Kaydet butonu: navy + altın border + glow
