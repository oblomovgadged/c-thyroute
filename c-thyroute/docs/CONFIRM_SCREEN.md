# Onay Ekranı — Screen Doc

> ID: `confirm` · Num: 14
> Dosya: `web-screens-c.jsx` (satır 723–)
> Güncelleme: 2026-06-27

---

## Amaç

Seçilen uçuş rezervasyonunun özet onayını gösterir. Vintage/kartpostal estetiğiyle tasarlanmıştır. Buradan rota haritasına geçiş, biniş kartı görüntüleme veya ana sayfaya dönüş yapılabilir.

---

## Nereden Gelinir

| Kaynak | Tetikleyici | Gecikme |
|---|---|---|
| `results (04)` Sonuçlar | Tek yön uçuş seçildi | 500ms |
| `results (04)` Sonuçlar | Gidiş+dönüş her ikisi seçildi | 500ms |
| `baggage (13)` Bagaj | "Onaya geç" CTA | 500ms |
| `seat (11)` → `passenger (12)` → `baggage (13)` zinciri | Son adım tamamlandı | 500ms |

---

## Ekrandan Çıkış

| Tetikleyici | Hedef | Gecikme |
|---|---|---|
| "Rotaya ekle" | `map (06)` | 500ms |
| "Biniş kartını gör" | `boarding (05)` | — (direkt) |
| "Ana sayfaya dön" | `board (02)` | — |
| "Koltuk seç" (eğer varsa) | `seat (11)` | — |
| "Yolcu bilgileri" | `passenger (12)` | — |
| "Yardımcı Pilot davet et" | `copilot (07)` | — |
| "Rotayı kaydet" akışı | `map (06)` | 600ms |
| "Rotayı kaydet + biniş kartı" | `boarding (05)` | 600ms |

---

## Sayfa Anatomisi (Vintage / Kartpostal Estetiği)

Ekran normal portal temasından farklı: **vintage seyahat posteri** görsel dili.

### Üst alan — Uçuş Özet Kartı
- Rota: `IST → FCO` (büyük, klasik serif Playfair Display veya EB Garamond)
- Uçuş kodu, tarih, koltuk, kabin
- Bilet kenarı perforeli çizgi efekti (dashed border)

### Orta alan — CTA Butonları
```
[Rotaya ekle]           → map (06)        #B7312C bg, beyaz metin
[Biniş kartını gör →]   → boarding (05)   #1F1A14 bg + 4px 4px 0 #B7312C box-shadow
[Ana sayfaya dön]       → board (02)      #FFFAEC bg, #1F1A14 metin
```

Butonlar dikdörtgen (border-radius: 0) — vintage bilet estetiği, rounded köşe yok.

### Alt alan (eğer booking'de veriler varsa)
- Koltuk özeti
- Yolcu adları
- Bagaj paketi
- Ödeme durumu

---

## Veri Bağımlılıkları

| Kaynak | Nasıl kullanılır |
|---|---|
| `booking.outbound` (localStorage) | Gidiş uçuş detayları |
| `booking.return` (localStorage) | Dönüş uçuş detayları (varsa) |
| `booking.passengers` | Yolcu sayısı/bilgileri |
| `booking.seat` | Seçilen koltuk (11'den gelinmişse) |
| `booking.baggage` | Bagaj paketi (13'ten gelinmişse) |
| `h.from` / `h.to` | Şehir nesneleri |

---

## Rota Kaydetme Fonksiyonu

`saveToMyRoutes(rec)`:
- `thy-route-selections-v1` localStorage listesine yeni rota ekler
- Toast: "Rota 'Kayıtlı Rotalarım'a eklendi" veya "Saved to your routes"
- 600ms sonra `nav('map')` veya `nav('boarding')`

---

## Görsel Kimlik

| Token | Değer |
|---|---|
| Tema | Light — ama vintage ton |
| Background | `#FFFAEC` (krem/sepia) |
| Font | EB Garamond (serif) — kartpostal/afiş hissi |
| Ana CTA | `#B7312C` kırmızı |
| İkincil CTA | `#1F1A14` koyu + `4px 4px 0 #B7312C` offset shadow (bas-bırak hissi) |
| Üçüncül CTA | `#FFFAEC` krem bg |
| Border-radius | 0 — tüm butonlar keskin köşe |
| Bilet kenarı | Dashed border, perforasyon efekti |

---

## Ekran Zinciri: Seat → Passenger → Baggage → Confirm

Bu 4 ekran sıralı bir checkout akışı oluşturur:

```
results (04)
  └─ confirm (14)   [direkt, basit akış]
  └─ seat (11)      [koltuk seç]
       └─ passenger (12)   [500ms sonra]
            └─ baggage (13)     [500ms sonra]
                 └─ confirm (14)     [500ms sonra]
```

### `seat (11)` Koltuk Haritası
- Uçak koltuk grid'i (pencere/orta/koridor renk kodlu)
- Geri: `results (04)`
- İleri: `passenger (12)` (500ms)
- Toast: "Koltuğunuz: 14F"

### `passenger (12)` Yolcu Bilgileri
- Ad, soyad, pasaport, uyruk formları
- Geri: `seat (11)`
- İleri: `baggage (13)` (500ms)
- Toast: "Yolcu bilgileri kaydedildi"

### `baggage (13)` Bagaj — Pastel / Çıkartma Estetiği
- Bagaj paketi seçimi (playful, pastel renkler)
- Geri: `passenger (12)`
- İleri: `confirm (14)` (500ms)
- Toast: "Bagaj eklendi 🧳"

---

## Bilinen Sınırlamalar

- "Yardımcı Pilot davet et" linki görünür ama Co-Pilot sync gerçek değil
- Ödeme confirmation: `web-screens-c.jsx:594`'te ikinci bir ödeme onayı akışı var (kredi kartı formu) → `confirm (14)`; bu routes/payment akışından farklı (paralel iki yol)
- Vintage font (EB Garamond) Google Fonts'tan yükleniyor — offline'da fallback Georgia
