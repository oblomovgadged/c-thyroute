# Yardımcı Ekranlar — Screen Doc

> ID: `checkin` (19) · `history` (20) · `help` (21) · `lounge` (22) · `tkpay` (23) · `travelPrefs` (28) · `airport` (16)
> Dosya: `web-screens-d.jsx` + `web-screens-b.jsx`
> Güncelleme: 2026-06-27

Bu ekranlar bağımsız, tek yönlü (terminal) ekranlardır. Karmaşık çift-yön navigasyonları yoktur.

---

## 19 · CHECK-IN — Japon Minimal

### Nereden Gelinir
`board (02)` → Check-in butonu

### Ekrandan Çıkış
| Tetikleyici | Hedef | Gecikme |
|---|---|---|
| Check-in tamamlandı | `boarding (05)` | 500ms |

### Akış — 3 Aşamalı
```
intro → [Pasaportunuzu telefona yaklaştırın]
  ↓ "Başla" butonu tıklandı
scan  → [NFC Okunuyor… — 2400ms timeout]
  ↓ otomatik
done  → [Hoş geldiniz, Aylin. Koltuk 14F · biniş 13:55 · kapı A12]
  ↓ "Boarding Pass'ı gör" → boarding (05)
```

### Görsel Kimlik
- Background: `#FAFAFA`, metin `#0A0A0A`
- Font: Space Grotesk
- 3 kolonlu grid (40px sol etiket · içerik · 40px sağ)
- Sol/sağ: "ONLINE · CHECK · IN · TK 1853" dikey yazı (writing-mode: vertical-rl, EB Garamond italic)
- Merkez: 280×280 daire — intro=QR ikon (kırmızı bg) · scan=WiFi ikon + 3 pulsing ring · done=check ikon (altın gradient)
- Ring animasyonu: `nfcRing 2.2s ease-out infinite`, 0/0.7s/1.4s delay

### State
`stage`: `'intro' | 'scan' | 'done'`

---

## 20 · HISTORY — Uçuş Geçmişi

### Nereden Gelinir
`profile (10)` → sidebar "Uçuş geçmişi"

### Ekrandan Çıkış
Nav çağrısı yok — terminal ekran.

### İçerik
Uçuş geçmişi listesi: tarih · rota · uçuş kodu · koltuk · statü (tamamlandı/iptal)
Mil kazanım özeti.

### Görsel Kimlik
Light tema, EB Garamond serif, vintage seyahat günlüğü estetiği.

---

## 21 · HELP — Yardım & Destek

### Nereden Gelinir
`profile (10)` → sidebar "Yardım"

### Ekrandan Çıkış
Nav çağrısı yok — terminal ekran.

### İçerik
- SSS accordion listesi
- Canlı destek butonu (toast)
- E-posta destek formu (toast)
- KVKK bilgilendirme linki

### Görsel Kimlik
Light tema, sade beyaz kartlar.

---

## 22 · LOUNGE — Havalimanı Lounge

### Nereden Gelinir
| Kaynak | Tetikleyici |
|---|---|
| `board (02)` | "Lounge" butonu |
| `profile (10)` | Sidebar "Lounge" |

### Ekrandan Çıkış
Nav çağrısı yok — terminal ekran.

### İçerik
- IST Atatürk ve İstanbul havalimanı lounge bilgileri
- Erişim koşulları (miles, kart tipi, bilet sınıfı)
- M&S lounge hakkı kontrolü
- **Plaza Premium Lounge** entegrasyonu (M&S partner — `ms-partners.jsx` ile uyumlu)
- Oturma kapasitesi, WiFi, yemek servisi, duş detayları

### Görsel Kimlik
Dark cockpit — `#0A1628` bg, altın aksan, glassmorphism kartlar.

---

## 23 · TKPAY — Cüzdan & Ödeme

### Nereden Gelinir
| Kaynak | Tetikleyici |
|---|---|
| `ms (08)` | TKPAY bridge banner |
| `profile (10)` | (planlı, henüz sidebar'da yok) |

### Ekrandan Çıkış
Nav çağrısı yok — terminal ekran.

### İçerik
- Mil → TL dönüşüm hesaplıyıcı (1 mi ≈ 0,15 TL)
- 87.420 mi → 13.113 TL gösterimi
- Bağlantılı banka kartları
- İşlem geçmişi
- Harcama noktaları (market, restoran, online alışveriş)

### Görsel Kimlik
Dark cockpit, altın gradient kart, JetBrains Mono rakamlar.

---

## 28 · TRAVEL PREFS — Seyahat Tercihleri

### Nereden Gelinir
| Kaynak | Tetikleyici |
|---|---|
| `profile (10)` | Sidebar + Featured kart |
| `map (06)` | `TravelPrefsBadge` tıklama |

### Ekrandan Çıkış
Nav çağrısı yok — terminal ekran.

### İçerik
Kullanıcı seyahat profilini özelleştirir — bu veriler `map (06)` rota rehberini kişiselleştirir:

| Tercih | Seçenekler |
|---|---|
| Seyahat hızı | Yavaş · Orta · Hızlı |
| İlgi alanları | Müzeler · Yemek · Doğa · Gece hayatı · Alışveriş |
| Bütçe seviyesi | Ekonomik · Orta · Premium · Lüks |
| Konaklama tipi | Otel · Butik · Hostel |
| Ulaşım tercihi | Toplu taşıma · Araç kiralama · VIP Transfer |

`thyHasPrefs()` → `true` döndüğünde `profile (10)` featured kartında "AÇIK" badge görünür, `map (06)` haritasında `TravelPrefsBadge` bileşeni çıkar.

### Görsel Kimlik
Light, EB Garamond başlıklar, toggle/chip seçim UI.

---

## 16 · AIRPORT PICKER — Havalimanı Seçici

### Nereden Gelinir
`search (03)` → Nereden / Nereye input odağı

### Ekrandan Çıkış
| Tetikleyici | Hedef | Gecikme |
|---|---|---|
| Şehir seçildi | `search (03)` | 500ms |

### İçerik
- Arama input'u (autocomplete)
- Popüler destinasyonlar kısa listesi
- WEB_CITIES listesinden şehirler (grup başlıklarıyla: Türkiye / Avrupa / Asya / Amerika / Afrika / Orta Doğu)
- Her şehir: şehir adı + IATA kodu + ülke bayrağı (emoji)

### Akış
```
Şehir satırına tıkla
  → toast "[Şehir] ([KOD]) seçildi"
  → 500ms → nav('search')
  → booking.fromCode veya booking.toCode güncellenir
```

### Görsel Kimlik
Light, iOS-benzeri modal / full sayfa, sistem font (`-apple-system, system-ui`), mavi link renkleri.

---

## Ortak Notlar — Terminal Ekranlar

- Tüm bu ekranlarda `WebTopNav active={null}` — menüde hiçbiri aktif değil
- Geri gitme: üst menü üzerinden veya tarayıcı geri tuşu
- Hiçbirinden başka bir ekrana `nav()` çağrısı yok (checkin ve airport hariç)
- Gelecek iyileştirme: tüm terminal ekranlara "← Geri" butonu eklenmesi önerilir
