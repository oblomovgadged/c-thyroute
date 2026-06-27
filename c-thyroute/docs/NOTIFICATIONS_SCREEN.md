# Bildirimler Ekranı — Screen Doc

> ID: `notifications` · Num: 09
> Dosya: `web-screens-b.jsx` (satır 1554–)
> Güncelleme: 2026-06-27

---

## Amaç

Kullanıcının uçuş, mil, sosyal ve alarm bildirimlerini filtreli liste halinde görüntüler.

---

## Nereden Gelinir

| Kaynak | Tetikleyici |
|---|---|
| `board (02)` | "Tümünü gör" linki |
| `priceAlert (15)` | Alarm kurulunca 700ms sonra (default mode) |
| WebTopNav | `active={null}` — doğrudan menü |

---

## Ekrandan Çıkış

Bildirimler ekranından `nav()` çağrısı yoktur — terminal ekrandır. Kullanıcı üst menüden çıkar.

---

## State

| State | Tip | Açıklama |
|---|---|---|
| `filter` | `'all'\|'flight'\|'miles'\|'social'` | Aktif filtre |

---

## Bildirim Verileri (Mock)

| # | Grup | Tür | Başlık | Zaman | Okunmamış |
|---|---|---|---|---|---|
| 1 | today | flight | TK 1853 için biniş açıldı · Kapı A12 | 12dk | ✓ |
| 2 | today | miles | 2.840 Mil hesabınıza eklendi (TK 1721) | 1sa | ✓ |
| 3 | today | social | Mehmet rotanıza katıldı · TRIP-0042 | 3sa | ✓ |
| 4 | earlier | flight | IST → AMS fiyat alarmı tetiklendi · 4.890 TL ↓750 | Dün | — |
| 5 | earlier | flight | Pasaport süresi 90 gün | 03 Haz | — |

---

## Layout

2 kolon grid (240px sidebar + 1fr içerik), max 1280:

### Sol Sidebar
Filtre butonları (aktif: accent tint):
- Tümü (N)
- Uçuş (N)
- Miles&Smiles (N)
- Sosyal (N)

"Tümünü okundu say" butonu: toast + `filter === 'all'` kalır

### Sağ İçerik
`SectionTitle`: "[N] okunmamış" eyebrow + "Bildirimler" başlık

**Bugün grubu:**
`today` filtrelenmiş bildirimler — `NotifRowWeb` bileşeni

**Daha önce grubu:**
`earlier` filtrelenmiş bildirimler

### `NotifRowWeb` Satır Anatomisi
- Sol: Tint rengi daire ikon (tür'e göre renk: accent/gold/green/blue/slate)
- Orta: Başlık (bold) + body (küçük gri) + zaman etiketi
- Sağ: Okunmamışsa accent rengi nokta

---

## Görsel Kimlik

| Token | Değer |
|---|---|
| Tema | Light |
| active | `null` (menüde aktif değil) |
| Sidebar | Transparan bg, `#E2E8F0` altında tek ayraç |
| Filtre aktif | `accent.bg + '14'` bg + accent renk + 700 weight |
| Satır bg | `#F8FAFC` |
| Okunmamış nokta | Accent rengi, 8px |
| Grup başlık | 10px / 800 / 2 tracking / `#64748B` |

---

## Bilinen Sınırlamalar

- Veriler mock, gerçek bildirim API'si yok
- "Tümünü okundu say" toast gösterir ama unread sayacı state'te güncellenmiyor
- Tekil bildirime tıklama herhangi bir yere navigate etmiyor (deep link yok)
- Alarm bildirimleri `thy-route-alarms-v1`'den çekilmiyor — mock liste statik
- Push notification (ServiceWorker) entegrasyonu yok
