# Ana Sayfa + Pano Ekranları — Screen Doc

> ID: `splash` (01) + `board` (02)
> Dosya: `web-screens-a.jsx` (satır 4– ve ~580–)
> Güncelleme: 2026-06-27

---

## 01 · SPLASH — Ana Sayfa / Landing

### Amaç
Giriş sayfası. THY Route'u tanıtır, kullanıcıyı `board`'a yönlendirir.

### Nereden Gelinir
Uygulama ilk açıldığında (varsayılan ekran). Kullanıcı başka bir ekrandayken buraya manuel geçiş yoktur.

### Ekrandan Çıkış
| Tetikleyici | Hedef |
|---|---|
| "Keşfet →" ThyButton (primary) | `board (02)` |
| "Geç →" link butonu | `board (02)` |

### Layout
İki kolonlu hero grid (1.1fr · 1fr), `max-width 1280`:

**Sol — Kopya + CTA:**
- Eyebrow: `✈ TURKISH AIRLINES · MILES&SMILES` (JetBrains Mono, 11px, 3 tracking, accent rengi)
- H1: 76px / 900 / -2.2 tracking — iki satır, ikinci satır altın gradient text-clip
- Paragraf: 18px / #B2C0D1, max 520px
- CTA grubu: ThyButton primary ("Keşfet →") + ghost link ("Geç →")

**Sağ — Floating Boarding Pass Art:**
- 420px genişlik, 6° döndürülmüş (`rotate(6deg)`)
- Glassmorphism kart: `rgba(255,255,255,0.05)` bg + `blur(14px)` + altın border
- İçerik: FCO ↔ IST (mono 48px) + dashed dashed rota çizgisi + `✈` animasyonu (thy-plane 3.4s)
- Grid istatistikler: GATE A12 · SEAT 14F · BOARDING 13:55

**Arka plan:**
- `linear-gradient(160deg, #050B14 → #0A1628 → #1B3868)`
- `GlobeNetworkBg` bileşeni (route-network görseli, opacity 0.22)
- Accent rengi radial glow (sağ üst, 0.7 opacity, `thy-drift 12s` animasyonu)

### Görsel Kimlik
| Token | Değer |
|---|---|
| Tema | Dark |
| Background | `#050B14 → #0A1628 → #1B3868` |
| H1 gradient | Accent fg → `#E8C97A` → accent fg |
| Boarding pass | Glass + altın border |
| Uçak animasyonu | `thy-plane 3.4s ease-in-out infinite` |

---

## 02 · BOARD — Pano / Dashboard

### Amaç
Ana hub ekranı. Yaklaşan uçuş, hızlı arama, Türkiye Turu banner, bildirimler özeti ve fiyat trendleri gösterir.

### Nereden Gelinir
| Kaynak | Tetikleyici |
|---|---|
| `splash (01)` | Her iki CTA |
| `confirm (14)` | "Ana sayfaya dön" |

### Ekrandan Çıkış
| Tetikleyici | Hedef |
|---|---|
| Arama formu "Ara" CTA | `results (04)` (350ms) |
| Yaklaşan uçuş kartı tıklama | `boarding (05)` |
| Türkiye Turu banner | `turkiyeTuru (17)` |
| Türkiye rota kartları | `turkiyeTuru (17)` |
| Bildirimler "Tümünü gör" | `notifications (09)` |
| Check-in butonu | `checkin (19)` |
| Lounge butonu | `lounge (22)` |

### Bileşenler

**Hızlı Arama Formu (board içi)**
`booking` state'ini günceller, `nav('results')` çağırır.

**`UpcomingFlightLarge` bileşeni**
- Beyaz kart, 14px radius, tıklanabilir (→ boarding)
- Uçuş kodu + rota + kalkış saati + koltuk + kapı
- Check-in + Lounge hızlı aksiyon butonları

**Türkiye Turu Banner**
- `linear-gradient(120deg, #B7372A → #E5712C → #F4C24C)` ateşli gradient
- Başlık + "Rotayı Gör →" butonu → `turkiyeTuru (17)`

**Türkiye Rota Kartları (TurkiyeRouteCard)**
Her kart tıklanınca → `turkiyeTuru (17)`

**Bildirimler Özeti**
- Son 2 bildirim (`NotifMini`)
- "Tümünü gör" linki → `notifications (09)`

### Görsel Kimlik
| Token | Değer |
|---|---|
| Tema | Light (beyaz kartlar) |
| Yaklaşan uçuş kartı | `#fff` + `#E2E8F0` border + `0 10px 28px rgba(10,22,40,0.08)` shadow |
| Türkiye banner | Turuncu ateş gradient |
| Bildirimler kutusu | `#fff` + `#E2E8F0` border |
