# Klavye Kısayolları — Keyboard Interactions

> Kaynak: `web-booking-store.jsx`, `web-screens-b.jsx`, `pnr-modal.jsx`
> Güncelleme: 2026-06-27

Aşağıdaki kısayollar kodda aktif olan tüm `keydown` dinleyicilerinin çıkarımıdır. Web uygulaması genel navigasyon için global kısayol tanımlamaz; kısayollar bileşen bazında sınırlıdır.

---

## 1 · CityAutocomplete — Şehir/Havalimanı Arama Dropdown

**Etkin ekranlar:** `search (03)`, `board (02)` hızlı arama, `airport (16)`
**Kaynak:** `web-booking-store.jsx → CityAutocomplete.onKeyDown`

| Tuş | Eylem | localStorage / State |
|---|---|---|
| `↓ ArrowDown` | Dropdown listesinde bir sonraki şehire geç | `active` index +1 |
| `↑ ArrowUp` | Dropdown listesinde bir önceki şehire geç | `active` index −1 |
| `Enter` | Aktif şehri seç → dropdown kapanır | `booking.fromCode` veya `booking.toCode` güncellenir (`thy-booking-v1`) |
| `Escape` | Dropdown'ı kapat, seçim iptal | `open → false` |

**Notlar:**
- `Enter` ile seçim `airport (16)` ekranına gitmez — direkt booking store'a yazar
- Dropdown açıkken `Tab` focus'u input'tan çıkarır, dropdown kapanır (tarayıcı davranışı)

---

## 2 · Map Screen — POI Not Düzenleme

**Etkin ekran:** `map (06)` — bir POI'nin not textarea'sı açıkken
**Kaynak:** `web-screens-b.jsx → editingNote textarea onKeyDown`

| Tuş | Eylem | State / Kayıt |
|---|---|---|
| `Enter` | Notu kaydet | `edits.addNote(poi.id, noteDraft)` — `useRouteEdits` state'ine yazar |
| `Enter` (boş not) | Notu sil | `edits.deleteNote(poi.id)` |
| `Escape` | Düzenlemeyi iptal et, notu kaydetme | `setEditingNote(null)` |

**Notlar:**
- Not state'i `useRouteEdits` hook'unda tutulur; localStorage'a yazılıp yazılmadığı hook implementasyonuna bağlı
- Çok satırlı not yazmak için `Shift+Enter` gerekir (native textarea davranışı) — `Enter` kaydetmeye bağlı olduğu için

---

## 3 · PNR Modal — Rezervasyon Bağlama

**Etkin ekran:** `profile (10)` → "Rezervasyonu hesabıma ekle" → PNR modal açık
**Kaynak:** `pnr-modal.jsx → useEffect keydown`

| Tuş | Eylem | State |
|---|---|---|
| `Escape` | Modal'ı kapat | `pnrOpen → false` |

---

## 4 · WebElegantSlider — Fiyat Alarm Çubuğu

**Etkin ekran:** `priceAlert (15)`
**Kaynak:** `web-screens-d.jsx → WebElegantSlider` (pointer event tabanlı, klavye yok)

> ⚠️ Bu slider şu an **yalnızca mouse/touch** ile çalışır. Klavye erişilebilirliği (`←/→ ArrowKey`) eklenmemiştir. Erişilebilirlik gerekiyorsa `tabIndex={0}` + `onKeyDown` ile step-based değişim eklenmeli.

---

## 5 · Global — Hiç Tanımlı Olmayan Kısayollar

Web uygulamasında aşağıdaki işlevler için global klavye kısayolu **yoktur**:

| İşlev | Mevcut Erişim | Öneri |
|---|---|---|
| Ekranlar arası geçiş | Sadece click | — |
| Arama formunu aç | Sadece click | `Ctrl/Cmd + K` |
| Alarm kur | Sadece click | — |
| Modal kapat (genel) | Sadece ESC (PNR modal'da) | Tüm modal/flyout'lara ESC eklenebilir |
| POI flyout kapat | Sadece dışına tıklama | `Escape` eklenebilir |

---

## Özet Tablosu

| Tuş | Nerede | Ne yapar |
|---|---|---|
| `↓` | Şehir dropdown | Sonraki öğe |
| `↑` | Şehir dropdown | Önceki öğe |
| `Enter` | Şehir dropdown | Seç + kapat → booking güncellenir |
| `Enter` | Map not alanı | Notu kaydet (`edits.addNote`) |
| `Enter` (boş) | Map not alanı | Notu sil (`edits.deleteNote`) |
| `Escape` | Şehir dropdown | Kapat (seçim yok) |
| `Escape` | Map not alanı | İptal (kaydetme) |
| `Escape` | PNR modal | Kapat |
