# Biniş Kartı Ekranı — Screen Doc

> ID: `boarding` · Num: 05
> Dosya: `web-screens-a.jsx` (satır 1073–)
> Güncelleme: 2026-06-27

---

## Amaç

Kullanıcının aktif uçuşuna ait dijital biniş kartını gösterir. Kapı, koltuk, biniş saati, QR kodu ve rota özeti içerir. M&S avantajlarına ve rota haritasına erişim sağlar.

---

## Nereden Gelinir

| Kaynak | Tetikleyici |
|---|---|
| `board (02)` | Yaklaşan uçuş kartı tıklama |
| `confirm (14)` | "Biniş kartını gör →" butonu |
| `confirm (14)` | "Rotayı kaydet + biniş kartı" akışı (600ms) |
| `checkin (19)` | Check-in tamamlandı (500ms) |
| `map (06)` | "Biniş kartını gör" CTA |

---

## Ekrandan Çıkış

| Tetikleyici | Hedef |
|---|---|
| "Rota haritasına git" | `map (06)` |
| "M&S avantajlarım" | `ms (08)` |
| WebTopNav linkleri | Diğer ekranlar |

---

## Bileşenler

### Dijital Biniş Kartı
Ekranın merkezinde, büyük kart bileşeni:

| Alan | İçerik |
|---|---|
| Uçuş kodu | `TK 1854` (JetBrains Mono, büyük) |
| Rota | `FCO → IST` (IATA, mono 48px) |
| Kalkış/Varış şehri | Roma · İstanbul (12px, #B2C0D1) |
| Uçuş süresi | Rota tablosundan |
| Kalkış saati | `booking.outbound.dep` |
| Kapı | A12 |
| Koltuk | 14F |
| Biniş saati | 13:55 |
| Yolcu | Aylin Kaya |
| Kabin | EcoFly / BusinessPrime |

**Rota çizgisi:** Dashed `border-top` + `✈` animasyonu (`thy-plane 3.4s ease-in-out infinite`)

**QR Kodu alanı:** SVG placeholder veya gerçek QR pattern

**Perforasyon ayracı:** Dashed `border-top` — kartı iki bölüme ayırır (üst: uçuş bilgisi, alt: biniş detayları)

### Mini istatistik grid
`MiniStat` bileşenleri: GATE · SEAT · BOARDING — 3 kolon

### Alt CTA'lar
- "Rota haritasına git" → `map (06)`
- "M&S avantajlarım" → `ms (08)`

---

## Veri Bağımlılıkları

| Kaynak | Nasıl kullanılır |
|---|---|
| `booking.outbound` | Uçuş kodu, dep/arr, süre, tarife |
| `booking.return` | Dönüş uçuş bilgisi (varsa) |
| `booking.seat` | Seat map'ten seçilen koltuk |
| `booking.fromCode` / `booking.toCode` | IATA kodları + şehir adları |
| `h.from` / `h.to` | `findCity()` ile zenginleştirilmiş şehir |

---

## Görsel Kimlik

| Token | Değer |
|---|---|
| Tema | Dark — cockpit glassmorphism |
| Kart bg | `rgba(255,255,255,0.05)` + `blur(14px)` |
| Kart border | `rgba(197,160,89,0.3)` altın |
| Kart glow | `0 30px 80px rgba(0,0,0,0.5), 0 0 36px rgba(197,160,89,0.18)` |
| IATA font | JetBrains Mono 800, 48px |
| Rota çizgisi | Dashed altın `rgba(197,160,89,0.45)` |
| Uçak emoji | Accent rengi, animasyonlu |
| QR alanı | Beyaz bg, dark QR pattern |
| Bölüm ayracı | Dashed `rgba(255,255,255,0.18)` |

---

## Bilinen Sınırlamalar

- QR kodu statik SVG placeholder — gerçek biniş kartı barcode üretimi yok
- Çok yolcu desteği: sadece tek yolcu gösteriliyor (Aylin Kaya sabit)
- Apple Wallet / Google Pay ekleme butonu mevcut değil
- Uçuş durumu (gecikme/kapı değişikliği) gerçek zamanlı değil
