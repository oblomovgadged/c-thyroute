# Seyahat Tercihleri — Travel Preferences Screen

> Ekran ID: `travelPrefs`
> Dosya: `travel-prefs.jsx` (web + mobil ortak)
> Güncelleme: 2026-06-28
> Kim yaptı: Claude Code (22 Haz 2026)
> Storage: `thy-travel-prefs-v1`

---

## Amaç

Kullanıcının seyahat alışkanlıklarını bir kez kaydedip tüm rotalara otomatik uygulatması. Daha az friction, daha doğru M&S partner önerileri, daha kişisel deneyim.

---

## Ekran Numarası

| Platform | Num | nav() ID |
|---|---|---|
| Web | #28 | `travelPrefs` |
| Mobil | #29 | `travelPrefs` |

---

## Giriş Noktaları

### Web (`WebProfileScreen`)
- Hesap sekmesinin başında altın çerçeveli kart (✦ ikonlu)
- Sol sidebar menü öğesi ("Seyahat Tercihleri")
- Map header'daki `TravelPrefsBadge` (tercihler kaydedilmişse) → tıklayınca düzenleme

### Mobil (`ProfileScreen`)
- Stats şeridinin hemen altında öne çıkan kart (✦ ikonlu)
- "SEYAHAT" bölümünün başında liste satırı (edit ikonlu)
- Map dateline şeridindeki `TravelPrefsBadge`

---

## Ekrandan Çıkış

| Tetikleyici | Hedef | Süre |
|---|---|---|
| Kaydet → | `profile` | 700ms |
| Vazgeç | `profile` | anında |
| × kapat | `profile` | anında |

---

## 6 Kategori

| # | Kategori | Seçim Tipi | Seçenekler |
|---|---|---|---|
| 01 | Seyahat Hızı | Tek | Hızlı (4–5/gün) · Dengeli (3/gün) · Rahat (1–2/gün) |
| 02 | İlgi Alanları | **ÇOKLU** | Kültür ve Tarih · Gastronomi · Gece Hayatı · Doğa · Alışveriş · Fotoğraf |
| 03 | Bütçe ve Konfor | Tek | Ekonomik · Orta · Premium · Miles&Smiles Öncelikli |
| 04 | Konaklama Tercihi | **ÇOKLU** | Partner Oteller · Zincir · Boutique · Merkezi Konum |
| 05 | Seyahat Tipi | Tek | Solo · Çift · Aile · Arkadaş · İş Seyahati |
| 06 | Plan Esnekliği | Tek | Planlı · Dengeli · Spontane |

---

## Veri Şeması

```js
// localStorage['thy-travel-prefs-v1']
{
  speed:         'fast' | 'balanced' | 'slow' | null,
  interests:     ['culture','food','nightlife','nature','shopping','photo'],
  budget:        'eco' | 'mid' | 'premium' | 'miles' | null,
  accommodation: ['partner','chain','boutique','central'],
  travelerType:  'solo' | 'couple' | 'family' | 'friends' | 'work' | null,
  planFlex:      'planned' | 'balanced' | 'spontaneous' | null,
  savedAt:       '2026-06-22T14:00:00.000Z',
}
```

Tüm alanlar opsiyonel — kısmi doldurma geçerli.

---

## API (window exports)

```js
// Storage
thyLoadPrefs()                       // → null | prefs object
thySavePrefs(prefs)                  // localStorage yazar + 'thy-prefs-change' event gönderir
thyHasPrefs()                        // → boolean (en az bir kategori dolu mu)
useTravelPrefs()                     // React hook — 'thy-prefs-change' event'te auto-rerender

// Data
THY_PREF_CATEGORIES                  // 6 kategori objesi [{id, label, multi, options}]
thyPrefChipStyle({ selected, dark }) // Tutarlı chip stil objesi

// Components (window'a export)
WebTravelPrefsScreen                 // Web ekranı (#28)
TravelPrefsScreen                    // Mobil ekranı (#29)
TravelPrefsBadge                     // Map header rozet bileşeni
```

---

## Kaydetme Akışı

```
1. Kullanıcı chip seçer (tek / çoklu)
2. Üst "X / 6 kategori dolu" sayacı güncellenir
3. "Tercihleri kaydet →" CTA tıklanır
4. thySavePrefs() → localStorage + 'thy-prefs-change' event
5. Toast: "✓ Seyahat tercihleriniz kaydedildi"
6. 700ms → nav('profile')
```

---

## Tercihlerin Kullanıldığı Yerler

### Map / Rota Ekranı
- `thyHasPrefs()` true ise dateline şeridinin altında `✦ TERCİHLERİNİZE GÖRE` rozeti
- Rozet tıklanabilir → `nav('travelPrefs')`

### Profil Ekranı
- Kart ve menü öğesinde yeşil **AÇIK / ON** rozeti (`#0E7A5F`)

---

## Görsel Sistem

| Element | Değer |
|---|---|
| Seçili chip border | `#B7312C` (THY Red) |
| Eyebrow / sayaç | `#C5A059` (Gold) + JetBrains Mono |
| Öne çıkan kart bg | `#F1ECDF` (Ivory) |
| Chip geçiş easing | `cubic-bezier(.4,0,.2,1)` 180ms |
| Save buton | THY Red gradient |
| Geometri | Pill chip, 12px kart radius, 10px buton |

---

## Test Senaryosu

1. Profil → "Seyahat Tercihleri" kartı tıkla
2. "Dengeli" hız + "Kültür ve Tarih" + "Gastronomi" + "Premium" + "Çift" + "Dengeli" seç
3. Kaydet → Profil'e döner, kartta "AÇIK" rozeti görünür
4. Rota ekranına git → "✦ TERCİHLERİNİZE GÖRE" rozeti görünür
5. Rozete tıkla → eski seçimler korunmuş olarak tercihler ekranı açılır

---

## Cross-Platform Senkron

`thy-travel-prefs-v1` localStorage key'i web ve mobil'de aynı.
Aynı tarayıcıda web'de kaydet → mobilden aç → tercihler görünür (ve tersi).
`useTravelPrefs()` hook'u `'thy-prefs-change'` custom event dinler → tüm consumer'lar otomatik rerender.

---

## Genişletme

- Yeni kategori: `THY_PREF_CATEGORIES`'a obje ekle → otomatik render
- Tercih bazlı POI önceliklendirme: `web-destinations.jsx` veya `web-route-map.jsx`'te implement edilebilir
- Co-Pilot paylaşımında tercihler: sadece davet edenin tercihleri kalır (bilinçli karar)
