# Co-Pilot Ekranı — Screen Doc

> ID: `copilot` · Num: 07
> Dosya: `web-screens-b.jsx` (satır 1267–)
> Güncelleme: 2026-06-27

---

## Amaç

Kullanıcının rotasını başka biriyle **canlı eşlemesini** sağlar. Pilot ID paylaşımı veya e-posta daveti ile co-pilot eklenir. Aktif co-pilot listesi görünür.

---

## Nereden Gelinir

| Kaynak | Tetikleyici |
|---|---|
| `confirm (14)` Onay | "Yardımcı Pilot davet et" linki |
| `map (06)` Rota | "Co-Pilot'a gönder" menüsü (`sendOpen` state) |
| WebTopNav | — (şu an active=null; menüde görünmez) |

---

## Ekrandan Çıkış

Co-Pilot ekranından `nav()` çağrısı yoktur — bu bir terminal ekrandır. Kullanıcı üst menüden başka ekrana geçer.

---

## State

| State | Tip | Açıklama |
|---|---|---|
| `copied` | `boolean` | Pilot ID kopyalandı mı (1800ms sonra false) |
| `email` | `string` | Davet e-posta inputu |

---

## Sabit Veri

| Alan | Değer |
|---|---|
| Pilot ID | `PT-4830-RM` |
| Aktif co-pilotlar | Mehmet K. (CANLI · 2h) · Selin A. (Dün) · Ege D. (3 gün) |

---

## Layout

İki kolonlu grid (1.3fr · 1fr, gap 24, max 1280):

### Sol kolon — Pilot ID + E-posta Daveti

**Pilot ID Kartı** (beyaz, 14px border-radius, slate border):
- Eyebrow: "DAVET KODU" / "INVITE CODE" (9px, 800, 2.5 tracking)
- Büyük mono ID kutusu: `PT-4830-RM` (JetBrains Mono 800, 40px, 4 tracking, dashed border, `#F3F5F8` bg)
- Kopyala butonu (60×60, 14px radius): idle = accent tint, kopyalandı = `#16A34A` yeşil + check ikonu → 1800ms sonra geri
- Açıklama metni: "Bu kimliği paylaşın — rotanız iki cihazda da canlı eşlenecek."

**E-posta Davet Kartı** (beyaz):
- `ThyInput` light: "E-POSTA İLE DAVET ET" label, placeholder "mehmet@example.com"
- `ThyButton` primary fullWidth: "Davet Gönder ✈"
- Validasyon: e-posta boşsa error toast "E-posta gerekli"
- Başarıda: toast "Davet [email] adresine gönderildi" + `setEmail('')`

### Sağ kolon — Aktif Co-Pilotlar

**Başlık:** `SectionTitle` — eyebrow "AKTİF", title "Yardımcı pilotlar"

**Co-Pilot Satırları** (`CoPilotRowWeb`):
Her satır: avatar daire (accent gradient, isim baş harfi) · isim + durum metni · canlıysa `ThyBadge variant="status"` CANLI, değilse chevron

**İpucu Kartı** (altın gradient bg, altın border):
- Eyebrow: "İPUCU" / "TIP"
- "Co-Pilot ile rotanız canlı eşlenir. Tarayıcı sekmesi açıkken birlikte düzenleyebilirsiniz."

---

## Görsel Kimlik

| Token | Değer |
|---|---|
| Tema | Light (dark: false) — beyaz kartlar, slate border |
| Hero band | `linear-gradient(135deg, #0A1628 → accent.deep → accent.bg)`, 220px |
| Kartlar | `#fff` bg, `#E2E8F0` border, `0 10px 28px rgba(10,22,40,0.10)` shadow |
| Avatar | Accent gradient, beyaz harf |
| Co-pilot satırı | `#F8FAFC` bg, `#E2E8F0` border |
| İpucu kartı | `linear-gradient(135deg, #FAF6E9, #F4EBD9)` + `#C5A05955` border |
| CANLI badge | `ThyBadge variant="status"` — yeşil pulsing dot |

---

## Bilinen Sınırlamalar / Sonraki Adımlar

- Pilot ID statik (`PT-4830-RM`) — gerçek Firebase session ID bağlantısı yok
- Co-pilot listesi mock — gerçek Firestore sync yok
- E-posta daveti toast gösterir ama gerçek EmailJS/SMTP bağlantısı yok
- Co-Pilot ekranından çıkış yolu yok (geri/vazgeç butonu eksik)
- `map (06)`'daki `sendOpen` menüsü co-pilot'a "gönderi" feature'ı — henüz map → copilot nav ekli değil
