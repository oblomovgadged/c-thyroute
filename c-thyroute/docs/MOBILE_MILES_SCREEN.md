# Mobil — Miles&Smiles Ekranı

> ID: `ms` · Num: 08
> Dosya: `screens-b.jsx`
> Güncelleme: 2026-06-27

---

## Amaç
M&S kart, mil bakiyesi, TKPAY köprüsü ve partner ağı. Kategori filtrelemeli partner listesi.

---

## Nereden Gelinir
| Kaynak | Tetikleyici |
|---|---|
| `boarding (05)` | M&S avantajlarım CTA |
| `map (06)` | M&S partner rezervasyon 900ms |
| AppTabBar | wallet tab |

---

## Ekrandan Çıkış
| Tetikleyici | Hedef |
|---|---|
| TKPAY banner | `tkpay (25)` |
| AppTabBar | Diğer ekranlar |

---

## Partner Listesi v2 (2026-06-27)

**Önceki:** Hilton + Avis + Garanti (3 partner, filtre çalışmıyor)

**Şimdiki:** 18 partner, `ALL_PARTNERS` dizisi + `cat` state filter

### Kategoriler & Chipler
| Chip ID | Label | Partnerler |
|---|---|---|
| `all` | Tümü | Hepsi |
| `hotel` | Konaklama | Marriott Bonvoy, Hilton, ALL·Accor, Rixos, IHG, Booking.com, Rocketmiles, HalalBooking, Kaligo |
| `car` | Araç | Avis, Budget, Enterprise, Sixt |
| `vip` | VIP Transfer | ProGo VIP Transfer |
| `lounge` | Lounge | Plaza Premium Lounge |
| `wifi` | Hizmetler | Airport WiFi Rentals |
| `bank` | Banka | Garanti BBVA |
| `dining` | Yeme | Divan Brasserie |

### Filtre Mantığı
```jsx
const ALL_PARTNERS = [ { name, offer, icon, cat, action }, ... ];
const visible = cat === 'all' ? ALL_PARTNERS : ALL_PARTNERS.filter(p => p.cat === cat);
return visible.map(p => <PartnerItem ... />);
```
Boş kategoride: "Bu kategoride partner yok" mesajı gösterilir.

---

## Bileşenler

**Altın M&S Kartı:**
- ELITE PLUS · TK · Aylin Kaya · 87.420 Mil
- Shimmer band animasyonu

**Hızlı Mil Kazan (4'lü grid):**
Uçuş / Otel / Araç / Yeme — ikon + kategori adı (değer statik)

**TKPAY Bridge Banner:**
"87.420 mi → 13.113 TL · 1 mi ≈ 0,15 TL" → `nav('tkpay')`

**ThyTabs:** GENEL / PARTNERLER / GEÇMİŞ

---

## Bilinen Sınırlamalar
- "Haritada Bul" / "Aktifleştir" butonları toast gösterir, map navigate yok
- Mil kazanma/harcama tab içeriği placeholder
- Mock kullanıcı verisi (gerçek API yok)
