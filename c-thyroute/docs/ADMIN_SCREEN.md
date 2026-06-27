# Yönetici Ekranı — THY Route Executive Cockpit

> Dosya: `Yönetici Ekranı.html`
> Güncelleme: 2026-06-28
> Kim yaptı: Claude Code
> Durum: Standalone HTML — web/mobil app nav sistemine dahil DEĞİL

---

## Amaç

THY Route'un THY'ye sağladığı değeri C-suite seviyesinde göstermek için tasarlanmış executive analytics dashboard. "Bu sistem THY'ye ne kazandırıyor?" sorusunu görsel olarak yanıtlar.

Hedef kitle: THY üst yönetimi (CEO, CMO, CDO, CCO).

---

## Erişim

Doğrudan URL: `Yönetici Ekranı.html`

Web/mobil app'tan navigasyon yok — ayrı standalone sayfa.
TR/EN dil toggle: üst sağ köşede.

---

## Dosya Yapısı

| Dosya | Rol |
|---|---|
| `Yönetici Ekranı.html` | HTML kabuk, script yükleyici |
| `admin-shell.jsx` | `ExecutiveDashboard` bileşeni — topbar + scrollspy sidebar + section pipeline |
| `admin-sections.jsx` | 7 bölüm render'ı |
| `admin-charts.jsx` | KPI grafikleri, sparkline'lar, bar chart'lar |
| `admin-data.jsx` | Mock analytics verisi + `ADMIN_COPY` i18n (TR/EN) |

---

## Bölümler (7 adet)

### 1. Executive Overview (`#sec-overview`)
Üstte 8 büyük KPI kutusu:

| KPI | Değer |
|---|---|
| Aktif Kullanıcı | 4.8 M |
| Ek Yolcu | +185.000 |
| Ek Gelir | $126 M |
| ROI | %1.850 |
| Reklam Tasarrufu | $58 M |
| M&S Aktivasyonu | +%17 |
| Tekrar Uçuş Oranı | +%24 |
| NPS | 63 |

---

### 2. Travel Intent Intelligence (`#sec-intent`) ⭐⭐⭐⭐⭐

- **Top 10 Destinasyon tablosu** — Şehir / Arama / Kaydetme
  - Tokyo: 124k arama / 89k kayıt
  - Bali: 111k / 74k
  - Roma: 92k / 61k
  - Seul: 87k / 54k
- **Gelecek Talep Haritası** — sıcaklık haritası (🔥 Japonya, Bali, Vietnam, Sri Lanka)
- **Popüler Kombinasyonlar** — Tokyo+Kyoto, Roma+Floransa, Paris+Amsterdam, Bali+Singapur

---

### 3. Yolcu & Sadakat (`#sec-loyalty`)

- THY Route kullanıcısı: **2.4 uçuş/yıl** (normal: 1.8)
- Rakiplerden gelen yolcular: Emirates, Qatar, Lufthansa
- Referral katsayısı: **1.34**
- NPS: **63**

---

### 4. Partner Intelligence (`#sec-partner`)

- Partner yoğunluğu (kategori bazlı): Otel / Araç / Restoran / Finans / VIP
- Partner eksik bölgeler: Tokyo, Bali, Marrakech, Tiflis
- Partner Fırsat Skoru: Tokyo 94 / Bali 89 / Seul 85

---

### 5. Marketing Intelligence (`#sec-marketing`)

| Metrik | Önce | Sonra |
|---|---|---|
| CAC | $42 | $31 |
| Reklam Tasarrufu | — | $58 M |
| Push Bildirim Dönüşümü | — | %21 |
| Fiyat Alarmı Satışları | — | $13 M |
| Viral Büyüme | 1 kullanıcı | 1.27 kullanıcı |

---

### 6. Miles&Smiles Intelligence (`#sec-ms`)

- Toplam Harcanan Mil
- Toplam Kazanılan Mil
- Partner bazında mil kullanımı: Hilton / Marriott / Sixt / Avis / Restoranlar / Finans
- Mil yükümlülüğündeki azalma: **-$19 M**

---

### 7. Smart Layover Intelligence (`#sec-layover`)

İstanbul aktarmaları:
- Transit Yolcular
- Touristanbul Katılımı
- VIP Transfer Kullanımı
- Ortalama Harcama
- İstanbul'da Ek Gelir

---

## AI Executive Insights (alt bölüm)

Otomatik yorum üretimi (mock):
- "Japonya talebi son 90 günde %24 arttı."
- "Bali bölgesinde restoran partner eksikliği tespit edildi."
- "Price Alert kullanıcılarının tekrar rezervasyon oranı %18 daha yüksek."
- "THY Route kullanıcılarının CLV'si normal yolculara göre %31 daha yüksek."

---

## Teknik Notlar

**Scrollspy:** `IntersectionObserver` ile aktif bölüm takibi — sol sidebar'da aktif menü öğesi vurgulanır.

**Dil toggle:** `localStorage['thyAdminLang']` — 'tr' veya 'en', sayfa yenilensede korunur.

**Stil:** THY Design System token'ları (`--font-ui`, `#0A1628` bg, `#B7312C` kırmızı, `#C5A059` altın). Dark cockpit estetiği. `backdrop-filter: blur(14px)` sticky topbar.

**Veri:** Tüm veri `admin-data.jsx` içinde mock. Gerçek API entegrasyonu için bu dosyayı değiştirmek yeterli.

---

## Genişletme Planı

- 14 katmanın tamamına drill-down ekranları
- Gerçek Firebase / analytics API entegrasyonu
- CSV / PDF export butonu
- Tarih aralığı filtresi (son 7/30/90 gün)
