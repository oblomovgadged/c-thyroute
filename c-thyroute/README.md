# THY Route — Türk Hava Yolları için Rota Oluşturma Ekosistemi

> Bir biletten bir seyahat ekosistemine. THY üzerinden uçan kullanıcılar; haritada multi-stop rotalar planlar, ailesi ve arkadaşlarını Co-Pilot olarak davet eder, Miles&Smiles partnerleriyle öncelikli rota kurar, sadakat puanı kazanır — THY ekosistemi organik olarak büyür.

**Durum:** Hi-Fi interaktif prototip · Türkçe + İngilizce · 2026

---

## 📑 İçindekiler

- [Hızlı Tıklanabilir Demo](#-hızlı-tıklanabilir-demo)
- [Üç Yüzey](#-üç-yüzey)
- [Temel Akış](#-temel-akış--hikaye)
- [Özellikler](#-özellikler)
- [Tasarım Sistemi](#-tasarım-sistemi)
- [Yerel Kurulum](#-yerel-kurulum)
- [Dosya Yapısı](#-dosya-yapısı)
- [Dokümantasyon](#-dokümantasyon)
- [Yol Haritası](#-yol-haritası)
- [Ekran Görüntüleri](#-ekran-görüntüleri)

---

## 🌐 Hızlı Tıklanabilir Demo

| Yüzey | Dosya | Aç |
|---|---|---|
| **Kullanıcı Web Sitesi** | [`Web Sitesi.html`](./Web%20Sitesi.html) | masaüstü tarayıcıda |
| **Kullanıcı Mobil Uygulama** | [`Mobil Uygulama.html`](./Mobil%20Uygulama.html) | iPhone / Android boyutunda |
| **Yönetici Ekranı (Executive Cockpit)** | [`Yönetici Ekranı.html`](./Y%C3%B6netici%20Ekran%C4%B1.html) | masaüstü tarayıcıda |

**Tek dosya, sıfır kurulum:** Tüm HTML'ler tek başlarına çalışır (CDN + design system token'ları). İndir, çift tıkla, demo açılır.

> Vercel canlı demo URL'i: deploy sonrası bu kısma eklenecek.

---

## 🧭 Üç Yüzey

### 1. Kullanıcı Web Sitesi (`Web Sitesi.html`)
THY'den uçan kişinin rota planlama portalı. 28 ekran. turkishairlines.com inspired aydınlık temada Booking Portal + koyu glassmorphism Cockpit harmanlanmıştır.

- 28 ekran: Ana Sayfa · Uçuş Ara · Sonuçlar · Rota/Map · Co-Pilot · Türkiye Turu · Tur Rotası · Kayıtlı Rotalarım · Fiyat Alarmı · Geçmiş (Nostaljik Pasaport) · TKPAY · Ödeme · Boarding Pass · Profil · Miles&Smiles · Seyahat Tercihleri · ...
- Üst toolbar'dan ekran seçici (dev), normal akışta tıklama navigasyonu

### 2. Kullanıcı Mobil Uygulama (`Mobil Uygulama.html`)
Web'in mobile-first karşılığı. iOS + Android device çerçevelerinde yan yana 28 ekran.

- Tüm web ekranlarının mobile karşılığı, aynı `booking-store` ve `travel-prefs` state'i ile
- Splash → Onboarding → Ana Ekran → Rota → Co-Pilot → ... → Boarding Pass

### 3. Yönetici Ekranı (`Yönetici Ekranı.html`)
THY ekibinin görmesi gereken executive dashboard. Rota dağılımı, M&S partner geliri, fiyat alarmı yoğunluğu, sadakat KPI'ları.

---

## 🎬 Temel Akış — Hikaye

**Senaryo:** Defne, eşi Mert ve iki arkadaşı için Türkiye turu planlıyor.

```
İstanbul (Ana Sayfa)
   ↓ "Uçuş Ara"
Sonuçlar (IST→AYT, fare ailesi seçimi)
   ↓ rezerve
Bilet alındı, rotaya geçiş
   ↓
Türkiye Turu — Likya Yolu kartını seç
   ↓
Tur Rotası (5 durak, 9 gün)
   ↳ "Planı Düzenle" çubuğundan tarih/süre/yolcu değiştir
   ↳ Co-Pilot daveti gönder (WhatsApp / e-posta / SMS)
   ↓
Map / Rota sayfası — Antalya rehberi yüklenir
   ↳ ✦ TUR MOD rozeti
   ↳ ✦ TERCİHLERİNİZE GÖRE rozeti (varsa)
   ↳ M&S partnerleri öncelik kazanır
   ↓
Kayıtlı Rotalarım → bekletilen rota, fiyat alarmı kur
   ↓ uygun fiyat geldiğinde
TKPAY / Ödeme → Boarding Pass
   ↓
Geçmiş → uçuş pasaport damgası eklenir
```

---

## ✨ Özellikler

### Kullanıcı Tarafı

| Özellik | Açıklama |
|---|---|
| 🗺 **Multi-stop rota planlama** | Bir uçuş bileti, durağa kadar planlanan bir seyahat haline gelir |
| ⤞ **Co-Pilot daveti** | WhatsApp · E-posta · SMS · Link kopyala — herkes düzenleyebilir |
| ✈ **Türkiye Turu** | 8 hazır tur (Likya, Göbekli Tepe, Kapadokya, Nemrut, vs.) + esnek planlama |
| ★ **Miles&Smiles entegrasyonu** | Partner otel/araç/lifestyle öncelikli; her uçuş mil kazandırır |
| 🛎 **Fiyat alarmı** | Bloomberg terminal estetiğinde hedef çizgi takibi |
| 📔 **Nostaljik Pasaport** | Geçmiş seyahatler sepia scrapbook, döner damgalar |
| 💳 **TKPAY + Boarding Pass** | Miles ödeme + Apple Pay + perfore bilet estetiği |
| 🎯 **Seyahat Tercihleri** | Hız · ilgi · bütçe · konaklama · tip · esneklik (web + mobil ortak) |
| 🌐 **Bilingual** | TR (formal "siz") + EN (uppercase) — Türkiye-first |

### Yönetici Tarafı (Executive Cockpit)

- Rota dağılımı haritası, en çok seçilen tur şehirleri
- Co-Pilot çoğaltıcı katsayı (1 bilet → kaç kullanıcı)
- M&S partner geliri ısı haritası
- Fiyat alarmı dönüşüm hunisi
- Sadakat segmenti dağılımı (Classic / Plus / Elite / Elite Plus)

---

## 🎨 Tasarım Sistemi

**THY Route Design System** — Turkish Airlines kurumsal kimliğine yaslanan, iki yüzeyli (Aydınlık Booking Portal + Koyu Glassmorphism Cockpit) sistem.

- **Renk Anahtarı:** THY Kırmızı `#B7312C` (Pantone 7620 C), Fransız Mavi `#0053A5`, Altın `#C5A059` (Miles&Smiles)
- **Tipografi:** Outfit (UI), Montserrat 800 (logo), Inter (gövde), JetBrains Mono (havacılık enstrüman yazısı)
- **Geometri:** 4-8-12-22 yarıçap, 4-8-16-24-32-48 boşluk
- **Motion:** Aerodinamik easing `cubic-bezier(.16,1,.3,1)`, shimmer sweep, pulsing status dot
- **Bileşenler:** `Button`, `Badge`, `Card`, `Input`, `Chip`, `Tabs`, `Toast`, `BoardingPass`, `FlightCard`, `PartnerItem`

Detay: [_ds/](./_ds/) klasörü ve sistem rehberi.

---

## 🛠 Yerel Kurulum

**Hiçbir build adımı yok.** Tüm HTML'ler tarayıcıda direkt çalışır — React + Babel + CSS hep CDN'den yüklenir.

```bash
# 1. Repo klonla
git clone https://github.com/<kullanıcı>/c-thyroute.git
cd c-thyroute

# 2. Basit bir static server başlat (herhangi biri)
npx serve .
# veya
python3 -m http.server 8000

# 3. Tarayıcıda aç:
# http://localhost:8000/Web%20Sitesi.html
# http://localhost:8000/Mobil%20Uygulama.html
# http://localhost:8000/Y%C3%B6netici%20Ekran%C4%B1.html
```

> İpucu: VS Code Live Server eklentisi de yeterli. Static server şart, `file://` üzerinden babel script dosyalarını yükleyemez.

---

## 📁 Dosya Yapısı

```
c-thyroute/
├── README.md                        ← bu dosya
├── FLOW.md                          ← web akışı & buton haritası
├── MOBIL-FLOW.md                    ← mobil akışı & buton haritası
├── SEYAHAT_TERCIHLERI.md            ← Travel Preferences feature spec
├── sunum.md                         ← Sunum planı (dahili)
│
├── Web Sitesi.html                  ← 🌐 Kullanıcı Web (giriş noktası)
├── Mobil Uygulama.html              ← 📱 Kullanıcı Mobil (giriş noktası)
├── Yönetici Ekranı.html             ← 🛫 Executive Cockpit (giriş noktası)
│
├── web-*.jsx                        ← Web ekran kodları (28 ekran + store)
│   ├── web-main.jsx                 ← Web host shell
│   ├── web-screens-{a,b,c,d,e}.jsx  ← Web ekran grupları
│   ├── web-screens-routes.jsx       ← Kayıtlı Rotalar + Ödeme
│   ├── web-screens-tkpay.jsx        ← TKPAY ödeme
│   ├── web-booking-store.jsx        ← Global booking + WEB_CITIES
│   ├── web-destinations.jsx         ← Destinasyon rehberleri (POI + plan)
│   ├── web-destinations-poi.jsx     ← POI seçici flyout
│   ├── web-route-map.jsx            ← Harita SVG renderer
│   └── web-ui-bits.jsx              ← Web UI primitive'leri
│
├── screens-*.jsx · main.jsx         ← Mobil ekran kodları
│   ├── main.jsx                     ← Mobil host shell (iOS + Android)
│   ├── screens-{a,b,c,d,e,f}.jsx    ← Mobil ekran grupları
│   ├── screens-routes.jsx           ← Mobil Kayıtlı Rotalar
│   ├── booking-store.jsx            ← Mobil booking state
│   ├── ios-frame.jsx                ← iOS device çerçevesi
│   ├── android-frame.jsx            ← Android device çerçevesi
│   └── ui-bits.jsx                  ← Mobil UI primitive'leri
│
├── travel-prefs.jsx                 ← ⚡ Web + Mobil ORTAK Seyahat Tercihleri modülü
├── pnr-modal.jsx                    ← PNR sorgulama modali
├── ms-partners.jsx                  ← Miles&Smiles partner verisi
├── mobile-route-collab.jsx          ← Co-Pilot collab modeli
│
├── admin-shell.jsx                  ← Yönetici Ekranı shell
├── admin-sections.jsx               ← Dashboard bölümleri
├── admin-charts.jsx                 ← Grafik bileşenleri
├── admin-data.jsx                   ← Demo veri jeneratörü
│
├── _ds/                             ← THY Route Design System
│   └── thy-route-design-system-.../
│       ├── tokens/                  ← colors, fonts, typography, spacing
│       ├── _ds_bundle.js            ← Tüm bileşenler
│       └── styles.css               ← Ana entry
│
├── deck-stage.js                    ← Slide deck shell (sunumlar için)
├── design-canvas.jsx                ← Tasarım keşfi canvas
└── tweaks-panel.jsx                 ← Tweaks panel shell
```

---

## 📚 Dokümantasyon

| Dosya | İçerik |
|---|---|
| [FLOW.md](./FLOW.md) | Web akışı, sayfa ID'leri, buton yönlendirmeleri, store şeması, 12 bölüm |
| [MOBIL-FLOW.md](./MOBIL-FLOW.md) | Mobil akışı, ekran ID'leri, navigasyon haritası, 13 bölüm |
| [SEYAHAT_TERCIHLERI.md](./SEYAHAT_TERCIHLERI.md) | Travel Preferences özelliği — şema, kategoriler, API, test senaryosu |
| `uploads/THY Route Strateji Raporu.md` | Üst düzey stratejik vizyon, B2B pitch |
| `uploads/Kavramsal Tasarım,BPMN ve Deneysel Parametre .md` | BPMN diyagramları, deneysel parametreler |
| `uploads/Yönetici Ekranı.md` | Yönetici dashboard spec |

---

## 🗺 Yol Haritası

### ✅ Tamamlanan
- 28 web ekran + 28 mobil ekran
- Türkiye Turu → Tur Rotası → Rota akışı (8 tur, dinamik seçim)
- Co-Pilot davet popover'ı (WhatsApp · E-posta · SMS · Link)
- Miles&Smiles partner entegrasyonu, M&S badge'leri
- Seyahat Tercihleri (web + mobil ortak)
- Fiyat Alarmı (Bloomberg terminal estetiği)
- Nostaljik Pasaport (geçmiş seyahatler)
- TKPAY + Boarding Pass
- Yönetici Ekranı (executive cockpit)

### 🚧 Gelecek iterasyonlar
- [ ] `WEB_CITIES`'a NAV, ASR, GNY, MQM, ADF, RZE eklendi — POI rehberleri yazılıyor
- [ ] Map sayfasında "TUR MOD" badge tur adını gösteriyor — multi-stop görünümü
- [ ] Co-Pilot canlı senkronizasyon (Firebase / Yjs)
- [ ] Gerçek Google Maps entegrasyonu (şu an SVG)
- [ ] Backend bağlantısı (THY API)

---

## 📸 Ekran Görüntüleri

> Ekran görüntüleri sonradan eklenecek. Şimdilik HTML dosyalarını direkt çalıştırarak görsel kontrol yapılabilir.

---

## 🔖 Lisans & Atıf

**THY Route** bağımsız, Turkish Airlines'tan **esinlenen** bir kavramsal prototiptir. THY adı, THY tasarım dili, "Miles&Smiles", THY kırmızısı ve crane logosu THY'nin korumalı markalarıdır. Bu prototip THY'ye B2B entegrasyon önerisi olarak hazırlanmıştır.

**Geliştirici:** Bağımsız çalışma — 2026
**Etiket:** thy · turkishairlines · travel-planning · co-pilot · miles-and-smiles · rota · turkey-tour

---

<p align="center">
  <strong>✦ Bir bilet, dört yolcu, sekiz partner durak — tekrar uçuş ✦</strong><br/>
  <em>THY Route — 2026</em>
</p>
