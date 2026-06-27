# Profil Ekranı — Screen Doc

> ID: `profile` · Num: 10
> Dosya: `web-screens-b.jsx` (satır 1653–)
> Güncelleme: 2026-06-27

---

## Amaç

Kullanıcı hesap bilgileri, M&S statüsü, KPI'lar ve yan menü üzerinden diğer hesap ekranlarına erişim.

---

## Nereden Gelinir

WebTopNav üzerinden (aktif bayrak yok — `active={null}`).

---

## Ekrandan Çıkış (nav çağrıları)

| Tetikleyici | Hedef |
|---|---|
| Sidebar → "Uçuş geçmişi" | `history (20)` |
| Sidebar → "Seyahat Tercihleri" | `travelPrefs (28)` |
| Sidebar → "Lounge" | `lounge (22)` |
| Sidebar → "Fiyat alarmı" | `priceAlert (15)` |
| Sidebar → "Yardım" | `help (21)` |
| İçerik → "Seyahat Tercihleri" featured kartı | `travelPrefs (28)` |
| İçerik → "Kayıtlı Rotalarım" | `routes (24)` |

---

## State

| State | Tip | Açıklama |
|---|---|---|
| `tab` | `'account'\|'preferences'\|'security'` | Ana içerik sekmesi |
| `pnrOpen` | `boolean` | PNR bağlama modal'ı açık mı |

---

## Layout

HeroBand (200px) + KPI strip + sidebar/içerik 2 kolon grid (240px · 1fr):

### HeroBand
- Eyebrow: "HESAP" / "ACCOUNT"
- Title: "Aylin Kaya"
- Badge'ler: `✦ ELITE PLUS · 87.420 mi` (gold) + `aylin.kaya@example.com` (mono)

### KPI Strip (4 kolon, -30px margin-top)
| Etiket | Değer |
|---|---|
| Uçuş | 42 |
| Ülke | 18 |
| Mil | 87,4K |
| Co-pilot | 3 |

### Sol Sidebar (240px)
**Üst bölüm (tab butonları):**
- Hesap · Tercihler · Güvenlik
- Aktif: `accent.bg` tint bg + accent renk

**Alt bölüm (nav linkleri, `nav()` çağırır):**
- Uçuş geçmişi → `history`
- Seyahat Tercihleri → `travelPrefs`
- Lounge → `lounge`
- Fiyat alarmı → `priceAlert`
- Yardım → `help`

### Sağ İçerik — tab === 'account'

**Seyahat Tercihleri Featured Kartı:**
- `linear-gradient(135deg, #FAFAF6 → #F1ECDF)` + altın border
- `✦` kırmızı gradient ikon (52×52)
- "Seyahat Tercihleri" başlık + `AÇIK` / `ON` mono badge (eğer aktifse)
- Alt metin: "Hız, ilgi alanları, bütçe — rotalarınız bu tercihlere göre özelleştirilir."
- → `travelPrefs (28)`

**Kişisel Bilgi PanelBlock:**
- Ad Soyad: Aylin Kaya
- E-posta: aylin.kaya@example.com
- Telefon: +90 555 432 18 76
- Doğum tarihi: 12.03.1991

**Rezervasyon Bağlama Kartı:**
- Altın ikon (✈, 42×42)
- "Rezervasyonu hesabıma ekle" / "Link a booking to my account"
- `setPnrOpen(true)` → PNR modal açılır

**Kayıtlı Rotalarım Kartı:**
- `border: '1px solid #E2E8F0'`
- "Kayıtlı Rotalarım" + TRIP sayısı
- → `nav('routes')`

---

## Mock Kullanıcı Verisi

| Alan | Değer |
|---|---|
| İsim | Aylin Kaya |
| E-posta | aylin.kaya@example.com |
| Telefon | +90 555 432 18 76 |
| Doğum tarihi | 12.03.1991 |
| M&S statüsü | ELITE PLUS |
| M&S mil | 87.420 |
| Uçuş sayısı | 42 |
| Ülke | 18 |
| Co-pilot | 3 |

---

## Görsel Kimlik

| Token | Değer |
|---|---|
| Tema | Light |
| KPI kartları | `#fff` + `#E2E8F0` border |
| Sidebar nav aktif | `accent.bg + '14'` bg |
| Seyahat Tercihleri kartı | `#FAFAF6 → #F1ECDF` + `#C5A05955` border |
| Rezervasyon kartı | Altın ikon + `#C5A05955` border |
| PNR modal | Overlay + beyaz dialog |

---

## Bilinen Sınırlamalar

- Tercihler ve Güvenlik sekmeleri içerik placeholder — form alanları henüz aktif değil
- PNR bağlama modal'ı: toast "PNR bağlandı" ama gerçek rezervasyon eşleşmesi yok
- Profil fotoğrafı desteği yok (avatar harf initials)
- Çıkış yap (logout) butonu mevcut değil
