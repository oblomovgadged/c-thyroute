# Seyahat Tercihleri — Travel Preferences

> Kullanıcının seyahat alışkanlıklarını önceden kaydetmesi ve rotasını belirlemesi için tasarlanmış paylaşımlı (web + mobil) özellik. **Profil > Seyahat Tercihleri** üzerinden açılır; **Rota / Map** ekranlarında gizli olarak rotayı kişiselleştirir.

**Sürüm:** v1 — 22 Haz 2026
**Dosya:** `travel-prefs.jsx` (web + mobil paylaşımlı)
**Ekran ID:** `travelPrefs`
**Storage Anahtarı:** `localStorage['thy-travel-prefs-v1']`

---

## 1. Amaç

THY Route ekosisteminde kullanıcı her seyahatte aynı tercihleri (hız, ilgi alanları, bütçe, vs.) tekrar tekrar belirtmek zorunda kalmasın. Bir kez kaydedilen tercihler **otomatik olarak** her rotaya uygulanır.

Bu özellik THY'nin ekosistem stratejisini destekler:
- **Daha az friction** → daha çok rota oluşturulur
- **Daha doğru öneriler** → M&S partnerleri öncelikli görünür → daha çok mil
- **Daha kişisel deneyim** → uzun ömürlü kullanıcı ilişkisi

---

## 2. Veri şeması

```js
// localStorage['thy-travel-prefs-v1']
{
  speed:         'fast' | 'balanced' | 'slow' | null,
  interests:     ['culture','food','nightlife','nature','shopping','photo'],  // multi
  budget:        'eco' | 'mid' | 'premium' | 'miles' | null,
  accommodation: ['partner','chain','boutique','central'],                     // multi
  travelerType:  'solo' | 'couple' | 'family' | 'friends' | 'work' | null,
  planFlex:      'planned' | 'balanced' | 'spontaneous' | null,
  savedAt:       '2026-06-22T14:00:00.000Z',
}
```

Tüm alanlar opsiyonel; kullanıcı kısmen dolduruşabilir.

---

## 3. Kategoriler (6 adet)

| # | Kategori | Tip | Seçenekler |
|---|---|---|---|
| 01 | **Seyahat Hızı** | tek | Hızlı (4–5/gün) · Dengeli (3/gün) · Rahat (1–2/gün) |
| 02 | **İlgi Alanları** | ÇOKLU | Kültür ve Tarih · Gastronomi · Gece Hayatı · Doğa · Alışveriş · Fotoğraf Noktaları |
| 03 | **Bütçe ve Konfor** | tek | Ekonomik · Orta · Premium · Miles&Smiles Öncelikli |
| 04 | **Konaklama Tercihi** | ÇOKLU | Partner Oteller · Zincir · Boutique · Merkezi Konum |
| 05 | **Seyahat Tipi** | tek | Solo · Çift · Aile · Arkadaş Grubu · İş Seyahati |
| 06 | **Plan Esnekliği** | tek | Planlı · Dengeli · Spontane |

---

## 4. Akış

### 4.1 Giriş noktaları

**Web:**
- `WebProfileScreen` > "Hesap" sekmesinin başında öne çıkan altın çerçeveli **kart** (✦ ikonlu)
- `WebProfileScreen` > sol sidebar **menü öğesi** ("Seyahat Tercihleri")

**Mobil:**
- `ProfileScreen` > stats şeridinin hemen altında öne çıkan **kart** (✦ ikonlu)
- `ProfileScreen` > "SEYAHAT" bölümünün başında **liste satırı**

### 4.2 Ekran

```
travelPrefs (NO 28)
   • Üst başlık — TERCİHLER · NO 28 · "Seyahat Tercihleri"
   • Doluluk göstergesi — "X / 6 kategori dolu" (gold mono chip)
   • 6 bölüm — her bölüm bir kategori için chip'ler
      • Tek seçim → bir chip seçili olabilir
      • Çoklu seçim → "ÇOKLU" rozeti, birden çok chip seçilebilir
   • Alt sticky save bar
      • Web: Sıfırla · Vazgeç · Kaydet →
      • Mobil: Vazgeç · Tercihleri kaydet → (tam genişlik)
```

### 4.3 Kaydet sonrası

1. `thySavePrefs()` → localStorage + `'thy-prefs-change'` custom event
2. Toast: "✓ Seyahat tercihleriniz kaydedildi"
3. 700ms sonra `nav('profile')`

### 4.4 Tercihler kullanılırken

Rota / Map ekranı (`web-screens-b.jsx > WebMapScreen`, `screens-b.jsx > MapScreen`):
- `thyHasPrefs()` true ise header'da **`✦ TERCİHLERİNİZE GÖRE`** rozeti çıkar
- Rozet tıklanabilir → `nav('travelPrefs')` (düzenlemeye götürür)
- TUR MOD rozetinin yanında uyumlu konumda

Profil ekranı:
- Kartta ve menü öğesinde yeşil **`AÇIK`** / `ON` rozeti çıkar (`#0E7A5F`)

---

## 5. API (window'a export)

```js
// Storage
thyLoadPrefs()                       // → null | prefs object
thySavePrefs(prefs)                  // localStorage + event
thyHasPrefs()                        // → boolean (en az bir kategori dolu mu)
useTravelPrefs()                     // React hook — auto-rerender on save

// Data
THY_PREF_CATEGORIES                  // 6 kategori, options, i18n
thyPrefChipStyle({ selected, dark }) // tutarlı chip stil obj

// Components
WebTravelPrefsScreen                 // ekran #28 (web)
TravelPrefsScreen                    // ekran #28 (mobil)
TravelPrefsBadge                     // küçük rozet bileşeni (Map header için)
```

---

## 6. Tasarım sistemine uyum

- **Renk:** THY Red `#B7312C` (seçili chip border + buton), Gold `#C5A059` (eyebrow, save chip), ivory `#F1ECDF` (öne çıkan kart bg)
- **Geometri:** Pill (chip), 12-14 (kart), 10 (buton)
- **Tipografi:** Outfit (heading/body), JetBrains Mono (eyebrow + sayaç)
- **Easing:** `cubic-bezier(.4,0,.2,1)` 180ms — chip aktif geçişi

---

## 7. Genişletilebilirlik

- Yeni kategori eklemek için `THY_PREF_CATEGORIES`'a obje ekle, `multi`/`options` yeterli.
- Tercihlerin etkilediği POI önceliklendirme `web-destinations.jsx` veya `web-route-map.jsx`'te ileride yapılabilir.
- Co-Pilot davetiyle başkasının da gördüğü "ortak rota" için tercihler **yalnızca davet edenin** kalır (bilinçli karar).

---

## 8. Test senaryosu

1. Profil → "Seyahat Tercihleri" kartına tıkla
2. "Dengeli Gezi" + "Kültür ve Tarih" + "Gastronomi" + "Premium" + "Partner Oteller" + "Çift" + "Dengeli" seç
3. Kaydet → Profile döner, kartta "AÇIK" rozeti görünür
4. Rota sayfasına git → header'da "✦ TERCİHLERİNİZE GÖRE" rozeti görünür
5. Rozete tıkla → tekrar tercihler ekranı açılır, eski seçimler korunmuş olarak gelir
