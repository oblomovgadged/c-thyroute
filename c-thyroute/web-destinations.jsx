// web-destinations.jsx — Destination guide data: POIs + 3-day itineraries
// for major THY destinations. Used by the Rota / Map screen to render a real
// destination guide when the user selects a route.
//
// Each destination keys off a city's IATA code and contains:
//   summary (TR + EN), tagline (TR + EN)
//   pois: [{ id, name (tr/en), type, x, y, desc (tr/en), hours, fee }]
//     - x/y are 0-100 % positions on the stylized SVG city map (drawn below)
//     - type: monument | museum | view | park | square | religious | shopping
//   days: [{ morning, noon, evening }]  // referring to poi.id's
//   mapPalette: { sea, land, line, accent }  // colors for SVG city art

const WEB_DESTS = {

  FCO: {
    city: 'Roma',
    tagline: { tr: 'Antik şehir, ebedi tatil', en: 'The eternal city' },
    summary: {
      tr: 'Roma, iki bin yıllık katmanlar üzerine kurulmuş canlı bir açık-hava müzesi. Sabah Forum\'da, öğleden sonra Trastevere\'de.',
      en: 'Rome stacks two thousand years of layers into one living open-air museum.',
    },
    mapPalette: { sea: '#A8C8DE', land: '#F4E6C9', line: '#1F1A14', accent: '#B7312C' },
    pois: [
      { id: 'colos', name: { tr: 'Kolezyum',           en: 'Colosseum' },         type: 'monument', x: 60, y: 60, hours: '08:30 — 19:00', fee: '€18', desc: { tr: 'Antik dünyanın en büyük amfitiyatrosu. Gladyatör arenasının taşları hâlâ ayakta.', en: 'The largest amphitheatre of the ancient world; the stones of the gladiator arena still stand.' } },
      { id: 'forum', name: { tr: 'Roma Forumu',        en: 'Roman Forum' },       type: 'monument', x: 54, y: 56, hours: '08:30 — 19:00', fee: '€18 (komb.)', desc: { tr: 'Antik Roma\'nın kalbi. Senato, tapınaklar ve zafer kemerleri.', en: 'The heart of ancient Rome — senate, temples, triumphal arches.' } },
      { id: 'vatic', name: { tr: 'Vatikan & San Pietro', en: 'Vatican & St. Peter\'s' }, type: 'religious', x: 28, y: 38, hours: '07:00 — 18:30', fee: 'Ücretsiz · Müze €20', desc: { tr: 'Hristiyan dünyasının kalbi. Sistine Şapeli\'ndeki Michelangelo freskleri burada.', en: 'The heart of Christendom; Michelangelo\'s Sistine ceiling lives here.' } },
      { id: 'panth', name: { tr: 'Pantheon',           en: 'Pantheon' },          type: 'monument', x: 44, y: 50, hours: '09:00 — 19:00', fee: '€5', desc: { tr: 'M.S. 126\'dan beri ayakta; dünyanın en büyük takviyesiz beton kubbesi.', en: 'Standing since 126 AD — the world\'s largest unreinforced concrete dome.' } },
      { id: 'trevi', name: { tr: 'Trevi Çeşmesi',      en: 'Trevi Fountain' },    type: 'view',     x: 48, y: 46, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Sırtınız dönük, sol omuzdan bir bozuk para. Roma\'ya geri dönüşün garantisi.', en: 'Toss a coin over your left shoulder; tradition says you\'ll return.' } },
      { id: 'trast', name: { tr: 'Trastevere',         en: 'Trastevere' },        type: 'square',   x: 36, y: 60, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Tiber\'in batısı. Sarmaşık kaplı sokaklar, yerel trattoria\'lar, akşam yemeği için Roma\'nın en güzel yeri.', en: 'West of the Tiber — ivy-covered alleys and the city\'s best trattorie for dinner.' } },
    ],
    days: [
      { title: { tr: 'Antik Roma',      en: 'Ancient Rome' },        morning: 'colos', noon: 'forum', evening: 'trast' },
      { title: { tr: 'Kalp ve Kubbeler', en: 'Heart & Domes' },      morning: 'vatic', noon: 'panth', evening: 'trevi' },
      { title: { tr: 'Yavaş bir gün',   en: 'A slower day' },        morning: 'trast', noon: 'trevi', evening: 'panth' },
    ],
  },

  CDG: {
    city: 'Paris',
    tagline: { tr: 'Bulvarlar, müzeler, ışık', en: 'Boulevards, museums, light' },
    summary: {
      tr: 'Paris, kırılgan bir zarafetle yürünür. Sabah Louvre, akşam Seine kenarında.',
      en: 'Paris is best walked — Louvre in the morning, Seine at dusk.',
    },
    mapPalette: { sea: '#9EC3DB', land: '#F0E4CD', line: '#1F2937', accent: '#0F2244' },
    pois: [
      { id: 'eiffel', name: { tr: 'Eyfel Kulesi',    en: 'Eiffel Tower' },   type: 'monument', x: 28, y: 58, hours: '09:30 — 23:45', fee: '€28', desc: { tr: 'Paris\'in demir ikonu. En iyi akşam ışıltısı saat başı.', en: 'Paris\'s iron icon; best at dusk with its hourly sparkle.' } },
      { id: 'louvre', name: { tr: 'Louvre',          en: 'The Louvre' },     type: 'museum',   x: 56, y: 50, hours: '09:00 — 18:00', fee: '€22', desc: { tr: 'Dünyanın en büyük sanat müzesi. Mona Lisa, Venüs ve daha 35.000 eser.', en: 'World\'s largest art museum — Mona Lisa, Venus, plus 35,000 more.' } },
      { id: 'notre',  name: { tr: 'Notre-Dame',      en: 'Notre-Dame' },     type: 'religious',x: 60, y: 60, hours: '08:00 — 18:45', fee: 'Ücretsiz', desc: { tr: '850 yıllık katedral, 2024 restorasyonu sonrası yeniden açık.', en: 'The 850-year-old cathedral, reopened after the 2024 restoration.' } },
      { id: 'mont',   name: { tr: 'Montmartre',      en: 'Montmartre' },     type: 'square',   x: 64, y: 24, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Sacré-Cœur\'un eteğindeki sanatçı mahallesi. Tüm Paris ayakların altında.', en: 'The artists\' hill below Sacré-Cœur — Paris at your feet.' } },
      { id: 'orsay',  name: { tr: 'Musée d\'Orsay',  en: 'Musée d\'Orsay' }, type: 'museum',   x: 48, y: 56, hours: '09:30 — 18:00', fee: '€16', desc: { tr: 'Eski bir tren istasyonunda Empresyonist hazine. Monet, Van Gogh, Renoir.', en: 'Impressionist treasures in a converted train station — Monet, Van Gogh, Renoir.' } },
      { id: 'champs', name: { tr: 'Champs-Élysées',  en: 'Champs-Élysées' }, type: 'shopping', x: 40, y: 44, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Zafer Takı\'ndan Concorde\'a uzanan 2 km\'lik şık bulvar.', en: 'The 2 km grand boulevard from Arc de Triomphe to Concorde.' } },
    ],
    days: [
      { title: { tr: 'Klasik Paris',    en: 'Classic Paris' },        morning: 'louvre', noon: 'notre',  evening: 'eiffel' },
      { title: { tr: 'Sanat ve manzara', en: 'Art & view' },          morning: 'orsay',  noon: 'champs', evening: 'mont' },
      { title: { tr: 'Yürüme günü',     en: 'A walking day' },        morning: 'mont',   noon: 'louvre', evening: 'notre' },
    ],
  },

  LHR: {
    city: 'Londra',
    tagline: { tr: 'Kraliyet, çay, müze', en: 'Royal, tea, museums' },
    summary: {
      tr: 'Londra her semte başka bir karakter taşır — Westminster\'da tarih, Shoreditch\'te grafiti.',
      en: 'London changes character every borough — history in Westminster, graffiti in Shoreditch.',
    },
    mapPalette: { sea: '#A3C2D8', land: '#EFE7D7', line: '#0F172A', accent: '#B7312C' },
    pois: [
      { id: 'big',   name: { tr: 'Big Ben & Parlamento', en: 'Big Ben & Parliament' }, type: 'monument', x: 36, y: 60, hours: '24 saat (dış)', fee: 'Ücretsiz', desc: { tr: 'Thames kenarında Gotik silüet. Saat 12\'de 12 vuruş.', en: 'Gothic silhouette by the Thames — 12 strikes at noon.' } },
      { id: 'london',name: { tr: 'Londra Kulesi',        en: 'Tower of London' },     type: 'monument', x: 64, y: 56, hours: '09:00 — 17:30', fee: '£35', desc: { tr: '950 yıllık kale, Kraliyet Mücevherleri\'nin ev sahibi.', en: '950-year fortress, home of the Crown Jewels.' } },
      { id: 'eye',   name: { tr: 'Londra Gözü',          en: 'London Eye' },          type: 'view',     x: 38, y: 56, hours: '11:00 — 18:00', fee: '£32', desc: { tr: '135 metreden Londra. 30 dakikalık bir tur.', en: 'London from 135 m up — a 30-minute revolution.' } },
      { id: 'brit',  name: { tr: 'British Museum',       en: 'British Museum' },      type: 'museum',   x: 50, y: 40, hours: '10:00 — 17:30', fee: 'Ücretsiz', desc: { tr: 'Rosetta Taşı\'ndan Parthenon mermerlerine — dünyanın hazinesi.', en: 'From Rosetta to the Parthenon marbles — the world\'s treasure house.' } },
      { id: 'buck',  name: { tr: 'Buckingham Sarayı',    en: 'Buckingham Palace' },   type: 'monument', x: 32, y: 52, hours: 'Nöbet 11:00', fee: 'Ücretsiz', desc: { tr: 'Kraliyet rezidansı. Tören için 11:00\'da olun.', en: 'The royal residence — be there for 11:00 Changing of the Guard.' } },
      { id: 'shore', name: { tr: 'Shoreditch',           en: 'Shoreditch' },          type: 'square',   x: 70, y: 30, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Doğu Londra\'nın grafiti, butik, beer-hall mahallesi.', en: 'East London\'s street-art, beer-hall, third-wave coffee district.' } },
    ],
    days: [
      { title: { tr: 'Klasikler',       en: 'The classics' },       morning: 'big',  noon: 'buck',  evening: 'eye' },
      { title: { tr: 'Tarih ve hazine', en: 'History & treasure' }, morning: 'london', noon: 'brit', evening: 'shore' },
      { title: { tr: 'Sıradan bir gün', en: 'An ordinary day' },    morning: 'brit', noon: 'big',   evening: 'shore' },
    ],
  },

  NRT: {
    city: 'Tokyo',
    tagline: { tr: 'Neon, ritüel, kontrast', en: 'Neon, ritual, contrast' },
    summary: {
      tr: 'Tokyo, dakika başı kendini yeniden icat eder; ama tapınaklar yerinde durur.',
      en: 'Tokyo reinvents itself by the minute, while the shrines hold still.',
    },
    mapPalette: { sea: '#9FB8CB', land: '#FBF1E2', line: '#1F1A14', accent: '#E94B3C' },
    pois: [
      { id: 'sensoji', name: { tr: 'Sensō-ji',         en: 'Sensō-ji Temple' },  type: 'religious',x: 60, y: 28, hours: '06:00 — 17:00', fee: 'Ücretsiz', desc: { tr: 'Tokyo\'nun en eski tapınağı. Kırmızı kapı (Kaminarimon) Tokyo\'nun ikonu.', en: 'Tokyo\'s oldest temple; the red Kaminarimon gate is iconic.' } },
      { id: 'shibu',   name: { tr: 'Shibuya Kavşağı',  en: 'Shibuya Crossing' }, type: 'view',     x: 36, y: 62, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Dünyanın en yoğun yaya kavşağı; saatlik 50.000 geçiş.', en: 'World\'s busiest pedestrian crossing — 50,000 crossings an hour.' } },
      { id: 'meiji',   name: { tr: 'Meiji Tapınağı',   en: 'Meiji Shrine' },     type: 'religious',x: 32, y: 52, hours: '05:00 — 18:00', fee: 'Ücretsiz', desc: { tr: 'Yoyogi Parkı\'nda büyük bir torii kapısı altında orman içinde Şintō tapınağı.', en: 'Forest Shinto shrine under a great torii gate, in Yoyogi Park.' } },
      { id: 'imp',     name: { tr: 'İmparatorluk Sarayı', en: 'Imperial Palace' }, type: 'monument', x: 52, y: 42, hours: '09:00 — 16:30 (bahçe)', fee: 'Ücretsiz', desc: { tr: 'İmparatorun yaşadığı kale; sadece bahçeler ziyaret edilir.', en: 'The emperor\'s castle; only the gardens are open.' } },
      { id: 'tsuki',   name: { tr: 'Tsukiji Dış Pazarı', en: 'Tsukiji Outer Market' }, type: 'shopping', x: 56, y: 60, hours: '05:00 — 14:00', fee: 'Ücretsiz', desc: { tr: 'Sushi, tamagoyaki, dashi — sabah saatleri en iyisi.', en: 'Sushi, tamagoyaki, dashi — early morning is best.' } },
      { id: 'sky',     name: { tr: 'Tokyo Skytree',    en: 'Tokyo Skytree' },    type: 'view',     x: 70, y: 34, hours: '10:00 — 21:00', fee: '¥3.100', desc: { tr: 'Japonya\'nın en yüksek yapısı (634m). Berrak günlerde Fuji görünür.', en: 'Japan\'s tallest structure (634 m); on clear days Fuji shows.' } },
    ],
    days: [
      { title: { tr: 'Ritüel & şehir',  en: 'Ritual & city' },       morning: 'meiji', noon: 'shibu', evening: 'sky' },
      { title: { tr: 'Eski Tokyo',      en: 'Old Tokyo' },           morning: 'sensoji', noon: 'tsuki', evening: 'imp' },
      { title: { tr: 'Karışım',         en: 'A mix' },               morning: 'imp', noon: 'shibu', evening: 'sensoji' },
    ],
  },

  BCN: {
    city: 'Barselona',
    tagline: { tr: 'Gaudí, deniz, tapas', en: 'Gaudí, sea, tapas' },
    summary: {
      tr: 'Barselona, Gaudí\'nin imzasını taşıyan bir Akdeniz şehri. Sabah Gotik Kuartet, akşam Barceloneta sahili.',
      en: 'Barcelona is the Mediterranean signed by Gaudí — Gothic Quarter mornings, Barceloneta dusks.',
    },
    mapPalette: { sea: '#9FC4D5', land: '#F8E9C6', line: '#2A1810', accent: '#F4C24C' },
    pois: [
      { id: 'sag',    name: { tr: 'Sagrada Família',    en: 'Sagrada Família' },   type: 'religious', x: 56, y: 32, hours: '09:00 — 19:00', fee: '€26', desc: { tr: 'Gaudí\'nin 140 yıldır biten bazilikası. Vitraylar saatlere göre renk değiştirir.', en: 'Gaudí\'s basilica, still finishing after 140 years; the stained glass changes by the hour.' } },
      { id: 'guell',  name: { tr: 'Park Güell',         en: 'Park Güell' },        type: 'park',      x: 42, y: 18, hours: '09:30 — 19:30', fee: '€10', desc: { tr: 'Mozaik kertenkele ve dalgalı banklar; tüm Barcelona ayaklarınızın altında.', en: 'Mosaic lizard, wavy benches, and Barcelona laid out below.' } },
      { id: 'gothic', name: { tr: 'Gotik Kuartet',      en: 'Gothic Quarter' },    type: 'square',    x: 50, y: 60, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Roma duvarları üstüne kurulmuş ortaçağ labirenti. Plaça Reial kahve molası.', en: 'Medieval maze on Roman walls; coffee in Plaça Reial.' } },
      { id: 'bocq',   name: { tr: 'La Boqueria',        en: 'La Boqueria Market' },type: 'shopping',  x: 48, y: 52, hours: '08:00 — 20:30', fee: 'Ücretsiz', desc: { tr: 'La Rambla\'nın hemen yanı. Jamón, meyve, sucos.', en: 'Off La Rambla — jamón, fruit, fresh juices.' } },
      { id: 'casa',   name: { tr: 'Casa Batlló',        en: 'Casa Batlló' },       type: 'monument',  x: 46, y: 44, hours: '09:00 — 20:00', fee: '€29', desc: { tr: 'Gaudí\'nin ejder kemikli evi. Passeig de Gràcia\'nın incisi.', en: 'Gaudí\'s dragon-bone house on Passeig de Gràcia.' } },
      { id: 'barc',   name: { tr: 'Barceloneta',        en: 'Barceloneta' },       type: 'view',      x: 60, y: 70, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Şehir plajı. Akşam paella + cava.', en: 'The city beach — paella and cava at dusk.' } },
    ],
    days: [
      { title: { tr: 'Gaudí günü',     en: 'Day of Gaudí' },         morning: 'sag',   noon: 'casa',   evening: 'barc' },
      { title: { tr: 'Eski şehir',     en: 'Old town' },             morning: 'gothic', noon: 'bocq',   evening: 'guell' },
      { title: { tr: 'Yavaş bir gün',  en: 'A slower day' },         morning: 'guell', noon: 'gothic', evening: 'barc' },
    ],
  },

  JFK: {
    city: 'New York',
    tagline: { tr: 'Şehrin ritmi', en: 'The pulse of the city' },
    summary: {
      tr: 'New York yürünür, koşulmaz; her sokak başka bir film sahnesi.',
      en: 'New York is walked, not run — every block another film set.',
    },
    mapPalette: { sea: '#9EB7CC', land: '#F1E5CC', line: '#0F172A', accent: '#FFD166' },
    pois: [
      { id: 'liberty', name: { tr: 'Özgürlük Heykeli',  en: 'Statue of Liberty' }, type: 'monument', x: 18, y: 78, hours: '08:30 — 16:00', fee: '$25', desc: { tr: 'Limanda Fransa\'nın armağanı. Feribot ile Liberty Adası\'na.', en: 'France\'s gift in the harbour; ferry to Liberty Island.' } },
      { id: 'empire',  name: { tr: 'Empire State',      en: 'Empire State Bldg' }, type: 'view',     x: 44, y: 50, hours: '10:00 — 22:00', fee: '$44', desc: { tr: '102 katın tepesinden Manhattan. Gün batımı en iyi saat.', en: 'Manhattan from 102 floors up — sunset is the best hour.' } },
      { id: 'central', name: { tr: 'Central Park',      en: 'Central Park' },      type: 'park',     x: 48, y: 32, hours: '06:00 — 01:00', fee: 'Ücretsiz', desc: { tr: 'Manhattan\'ın yeşil kalbi. 3.4 km² park, göller, atlıkarınca.', en: 'Manhattan\'s green heart — 3.4 km² of park, lakes, carousel.' } },
      { id: 'times',   name: { tr: 'Times Meydanı',     en: 'Times Square' },      type: 'view',     x: 42, y: 42, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Neon, ekranlar, kalabalık — Broadway\'in eşiği.', en: 'Neon, screens, crowds — the threshold of Broadway.' } },
      { id: 'met',     name: { tr: 'The Met',           en: 'The Met' },           type: 'museum',   x: 54, y: 30, hours: '10:00 — 17:00', fee: '$30', desc: { tr: 'Amerika\'nın en büyük müzesi; 5.000 yıllık 2 milyon eser.', en: 'America\'s largest museum — 5,000 years, 2 million works.' } },
      { id: 'bridge',  name: { tr: 'Brooklyn Köprüsü',  en: 'Brooklyn Bridge' },   type: 'monument', x: 38, y: 70, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: '140 yıllık asma köprü, yaya geçişi. Brooklyn tarafında DUMBO\'da bitir.', en: '140-year suspension bridge; end on Brooklyn side at DUMBO.' } },
    ],
    days: [
      { title: { tr: 'Klasik Manhattan', en: 'Classic Manhattan' },  morning: 'liberty', noon: 'times', evening: 'empire' },
      { title: { tr: 'Yeşil ve sanat',   en: 'Green & art' },        morning: 'central', noon: 'met',   evening: 'bridge' },
      { title: { tr: 'Yürüme günü',      en: 'A walking day' },      morning: 'bridge',  noon: 'times', evening: 'central' },
    ],
  },

  DXB: {
    city: 'Dubai',
    tagline: { tr: 'Çöl ve cam kuleler', en: 'Desert and glass towers' },
    summary: {
      tr: 'Dubai, çölle gökyüzü arasında bir şehir; sabah safari, akşam Burj rooftop.',
      en: 'Dubai sits between desert and sky — safari at dawn, rooftop at dusk.',
    },
    mapPalette: { sea: '#A8C8DE', land: '#F4D9A4', line: '#2A1810', accent: '#C5A059' },
    pois: [
      { id: 'burj',   name: { tr: 'Burj Khalifa',        en: 'Burj Khalifa' },       type: 'view',     x: 40, y: 52, hours: '09:00 — 24:00', fee: 'AED 169', desc: { tr: 'Dünyanın en yüksek binası, 828 m. 124. kattan görüş ya da 148.', en: 'World\'s tallest, 828 m; observation deck on 124 or 148.' } },
      { id: 'mall',   name: { tr: 'Dubai Mall',          en: 'Dubai Mall' },         type: 'shopping', x: 42, y: 54, hours: '10:00 — 24:00', fee: 'Ücretsiz', desc: { tr: '1.200 mağaza, akvaryum, buz pateni. Çeşme gösterisi her 30 dk.', en: '1,200 shops, aquarium, ice rink; fountain show every 30 min.' } },
      { id: 'palm',   name: { tr: 'Palm Jumeirah',       en: 'Palm Jumeirah' },      type: 'monument', x: 18, y: 36, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Denizden insan yapımı palmiye. Monoray ile uca, Atlantis\'e.', en: 'Man-made palm in the sea; monorail to the tip, Atlantis.' } },
      { id: 'sheikh', name: { tr: 'Sheikh Zayed Camii',  en: 'Sheikh Zayed Mosque' },type: 'religious',x: 60, y: 70, hours: '09:00 — 22:00', fee: 'Ücretsiz', desc: { tr: 'Abu Dabi\'de Beyaz mermerden 82 kubbeli devasa cami.', en: 'In Abu Dhabi — vast white-marble mosque, 82 domes.' } },
      { id: 'souk',   name: { tr: 'Altın Çarşısı',       en: 'Gold Souk' },          type: 'shopping', x: 56, y: 26, hours: '10:00 — 22:00', fee: 'Ücretsiz', desc: { tr: 'Deira\'da geleneksel altın pazarı. 10 ton altın vitrinlerde.', en: 'Traditional gold market in Deira — 10 tonnes on display.' } },
      { id: 'desert', name: { tr: 'Çöl Safari',          en: 'Desert Safari' },      type: 'view',     x: 72, y: 56, hours: '15:00 — 22:00', fee: 'AED 350', desc: { tr: 'Dune bashing + deve + akşam yemeği + Bedu kampı.', en: 'Dune bashing + camel + dinner + Bedouin camp.' } },
    ],
    days: [
      { title: { tr: 'Şehir merkezi',  en: 'Downtown' },             morning: 'burj',   noon: 'mall',   evening: 'desert' },
      { title: { tr: 'Eski + yeni',    en: 'Old + new' },            morning: 'souk',   noon: 'palm',   evening: 'burj' },
      { title: { tr: 'Geziye gün',     en: 'Day trip' },             morning: 'sheikh', noon: 'palm',   evening: 'mall' },
    ],
  },

  AMS: {
    city: 'Amsterdam',
    tagline: { tr: 'Kanal, bisiklet, sanat', en: 'Canals, bikes, art' },
    summary: {
      tr: 'Amsterdam, 17. yüzyıldan kalma kanal şehri; bisikletle dolaşılır.',
      en: 'Amsterdam is a 17th-century canal city, best by bike.',
    },
    mapPalette: { sea: '#A2C5DA', land: '#F1E5CC', line: '#0F2244', accent: '#B7312C' },
    pois: [
      { id: 'rijks', name: { tr: 'Rijksmuseum',     en: 'Rijksmuseum' },     type: 'museum',   x: 50, y: 60, hours: '09:00 — 17:00', fee: '€25', desc: { tr: 'Rembrandt\'ın Gece Nöbeti burada. Hollanda Altın Çağı.', en: 'Rembrandt\'s Night Watch lives here — the Dutch Golden Age.' } },
      { id: 'vang',  name: { tr: 'Van Gogh Müzesi', en: 'Van Gogh Museum' }, type: 'museum',   x: 48, y: 64, hours: '09:00 — 18:00', fee: '€22', desc: { tr: 'Dünyanın en büyük Van Gogh koleksiyonu. 200+ tablo.', en: 'World\'s largest Van Gogh collection — 200+ paintings.' } },
      { id: 'anne',  name: { tr: 'Anne Frank Evi',  en: 'Anne Frank House' },type: 'museum',   x: 42, y: 38, hours: '09:00 — 22:00', fee: '€16', desc: { tr: 'Gizli odanın gerçek hâli. Bilet 2 ay önceden alınır.', en: 'The secret annex itself; book 2 months ahead.' } },
      { id: 'jord',  name: { tr: 'Jordaan',         en: 'Jordaan' },         type: 'square',   x: 38, y: 32, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Kanallı boutique mahallesi. Brown café\'lerde Heineken.', en: 'Boutique canal district; Heineken in brown cafés.' } },
      { id: 'dam',   name: { tr: 'Dam Meydanı',     en: 'Dam Square' },      type: 'square',   x: 50, y: 42, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Kraliyet Sarayı, Yeni Kilise, beyaz Anıt.', en: 'Royal Palace, New Church, white Memorial.' } },
      { id: 'canal', name: { tr: 'Kanal turu',      en: 'Canal cruise' },    type: 'view',     x: 44, y: 50, hours: '10:00 — 22:00', fee: '€18', desc: { tr: '1 saatlik tekne turu, gün batımı versiyonu en iyisi.', en: 'Hour-long boat ride, the sunset version is the best.' } },
    ],
    days: [
      { title: { tr: 'Sanat günü',     en: 'Art day' },              morning: 'rijks',  noon: 'vang',  evening: 'jord' },
      { title: { tr: 'Tarih ve su',    en: 'History & water' },      morning: 'anne',   noon: 'dam',   evening: 'canal' },
      { title: { tr: 'Bisiklet günü',  en: 'A bike day' },           morning: 'jord',   noon: 'dam',   evening: 'canal' },
    ],
  },

  ATH: {
    city: 'Atina',
    tagline: { tr: 'Antik demokrasinin kenti', en: 'Cradle of democracy' },
    summary: {
      tr: 'Atina, 2.500 yıllık taşların altında yaşayan canlı bir başkent.',
      en: 'Athens is a living capital under 2,500-year stones.',
    },
    mapPalette: { sea: '#9DC2D5', land: '#F4E2BD', line: '#1F1A14', accent: '#0053A5' },
    pois: [
      { id: 'acro',   name: { tr: 'Akropolis & Parthenon', en: 'Acropolis & Parthenon' }, type: 'monument', x: 50, y: 56, hours: '08:00 — 20:00', fee: '€20', desc: { tr: 'Pers, Roma, Bizans tüm gelenlerin gördüğü tepe.', en: 'The hill every empire saw — Persians, Romans, Byzantines.' } },
      { id: 'plaka',  name: { tr: 'Plaka',                 en: 'Plaka' },                 type: 'square',   x: 56, y: 60, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Akropolis\'in eteğinde dar sokaklar, taverna ve mezeler.', en: 'Narrow lanes at the foot of the Acropolis — tavernas and meze.' } },
      { id: 'amus',   name: { tr: 'Akropolis Müzesi',      en: 'Acropolis Museum' },      type: 'museum',   x: 52, y: 60, hours: '08:00 — 20:00', fee: '€10', desc: { tr: 'Parthenon\'dan inen heykeller burada; cam zemin antik şehrin üzerinde.', en: 'Sculptures lifted from the Parthenon, glass floor over the ancient city.' } },
      { id: 'plaza',  name: { tr: 'Syntagma Meydanı',      en: 'Syntagma Square' },       type: 'square',   x: 60, y: 44, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Evzon nöbet değişimi her saat başı, fes ve tsarouchi.', en: 'Evzone changing of the guard every hour — fez and tsarouchi.' } },
      { id: 'lyc',    name: { tr: 'Likavittos Tepesi',     en: 'Lycabettus Hill' },       type: 'view',     x: 66, y: 32, hours: '24 saat', fee: '€10 (funicular)', desc: { tr: '277 m\'den Atina ve Ege denizi. Gün batımı için ideal.', en: 'Athens and the Aegean from 277 m — perfect for sunset.' } },
      { id: 'agor',   name: { tr: 'Antik Agora',           en: 'Ancient Agora' },         type: 'monument', x: 44, y: 60, hours: '08:00 — 20:00', fee: '€10', desc: { tr: 'Sokrates\'in dolaştığı pazaryeri. Hephaistos Tapınağı korunmuş.', en: 'The market where Socrates walked — Hephaestus temple still intact.' } },
    ],
    days: [
      { title: { tr: 'Antik gün',      en: 'Ancient day' },          morning: 'acro',  noon: 'agor',  evening: 'plaka' },
      { title: { tr: 'Müze ve şehir',  en: 'Museum & city' },        morning: 'amus',  noon: 'plaza', evening: 'lyc' },
      { title: { tr: 'Yavaş gün',      en: 'A slower day' },         morning: 'plaka', noon: 'plaza', evening: 'lyc' },
    ],
  },

  BKK: {
    city: 'Bangkok',
    tagline: { tr: 'Tapınak, kanal, sokak yemeği', en: 'Temples, canals, street food' },
    summary: {
      tr: 'Bangkok, dakikada bir kontrast değiştirir — altın tapınak, plastik tabak, neon mol.',
      en: 'Bangkok changes contrast by the minute — gold temple, plastic plate, neon mall.',
    },
    mapPalette: { sea: '#A2C5DA', land: '#F5E2BC', line: '#2A1810', accent: '#C19A4E' },
    pois: [
      { id: 'grand', name: { tr: 'Büyük Saray',     en: 'Grand Palace' },      type: 'monument', x: 40, y: 50, hours: '08:30 — 15:30', fee: '฿500', desc: { tr: '1782\'den beri kraliyet ikametgâhı. Zümrüt Buda burada.', en: 'Royal residence since 1782; Emerald Buddha lives here.' } },
      { id: 'pho',   name: { tr: 'Wat Pho',         en: 'Wat Pho' },           type: 'religious',x: 38, y: 56, hours: '08:00 — 18:30', fee: '฿200', desc: { tr: '46 m uzunluğunda altın yatan Buda. Thai masaj akademisi.', en: '46-m reclining gold Buddha; the Thai massage academy.' } },
      { id: 'arun',  name: { tr: 'Wat Arun',        en: 'Wat Arun' },          type: 'religious',x: 34, y: 60, hours: '08:00 — 18:00', fee: '฿100', desc: { tr: 'Şafak Tapınağı; Chao Phraya nehrinin batı yakasında.', en: 'Temple of Dawn — west bank of the Chao Phraya.' } },
      { id: 'chat',  name: { tr: 'Chatuchak Pazarı', en: 'Chatuchak Market' },  type: 'shopping', x: 56, y: 16, hours: 'Cmt-Paz 09:00 — 18:00', fee: 'Ücretsiz', desc: { tr: '8.000 stand; her şey var. Sadece hafta sonu.', en: '8,000 stalls — anything you can think of. Weekends only.' } },
      { id: 'khao',  name: { tr: 'Khao San Yolu',   en: 'Khao San Road' },     type: 'square',   x: 44, y: 42, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Sırt çantalı turistlerin sokak partisi. Akrep mi var? Var.', en: 'Backpacker street party; scorpions on a stick if you dare.' } },
      { id: 'jim',   name: { tr: 'Jim Thompson Evi',en: 'Jim Thompson House' },type: 'museum',   x: 50, y: 38, hours: '09:00 — 18:00', fee: '฿200', desc: { tr: 'Thai ipeği işine hayat veren Amerikalının teak evi.', en: 'Teak house of the American who revived Thai silk.' } },
    ],
    days: [
      { title: { tr: 'Kraliyet günü',  en: 'Royal day' },            morning: 'grand', noon: 'pho',  evening: 'khao' },
      { title: { tr: 'Tapınak & nehir', en: 'Temple & river' },      morning: 'arun',  noon: 'jim',  evening: 'khao' },
      { title: { tr: 'Pazar günü',     en: 'Market day' },           morning: 'chat',  noon: 'jim',  evening: 'pho' },
    ],
  },

  BER: {
    city: 'Berlin',
    tagline: { tr: 'Tarih ve techno', en: 'History and techno' },
    summary: {
      tr: 'Berlin, geçmişi sokakta taşıyan, gece sabaha kadar dans eden çift kişilik bir şehir.',
      en: 'Berlin carries its past on the street and dances until morning.',
    },
    mapPalette: { sea: '#9FB7CC', land: '#F0E4CD', line: '#0F172A', accent: '#B7312C' },
    pois: [
      { id: 'brand',  name: { tr: 'Brandenburg Kapısı', en: 'Brandenburg Gate' }, type: 'monument', x: 40, y: 44, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Birleşmenin sembolü; 1989\'da burada yıkıldı.', en: 'Symbol of reunification; it fell here in 1989.' } },
      { id: 'rich',   name: { tr: 'Reichstag',          en: 'Reichstag' },         type: 'monument', x: 38, y: 38, hours: '08:00 — 22:00 (kubbe)', fee: 'Ücretsiz (rezerv.)', desc: { tr: 'Cam Foster kubbesinden 360° Berlin. Rezervasyon şart.', en: '360° Berlin from Foster\'s glass dome; reservation required.' } },
      { id: 'wall',   name: { tr: 'East Side Gallery',  en: 'East Side Gallery' }, type: 'monument', x: 70, y: 56, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: '1.3 km uzunluğunda Duvar parçası; üzerinde 105 sanatçı eseri.', en: '1.3 km of the Wall, painted by 105 artists.' } },
      { id: 'museum', name: { tr: 'Müze Adası',         en: 'Museum Island' },     type: 'museum',   x: 50, y: 42, hours: '10:00 — 18:00', fee: '€19', desc: { tr: 'UNESCO listesinde 5 müze; Nefertiti büstü burada.', en: '5 museums, UNESCO-listed; the Nefertiti bust lives here.' } },
      { id: 'check',  name: { tr: 'Checkpoint Charlie', en: 'Checkpoint Charlie' },type: 'monument', x: 48, y: 56, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Soğuk Savaş\'ın en ünlü sınır noktası, küçük müze yanı sıra.', en: 'The Cold War\'s most famous crossing, plus a small museum.' } },
      { id: 'tier',   name: { tr: 'Tiergarten',         en: 'Tiergarten' },        type: 'park',     x: 30, y: 42, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Berlin\'in 210 hektar yeşil kalbi.', en: 'Berlin\'s 210-hectare green heart.' } },
    ],
    days: [
      { title: { tr: 'Tarih günü',     en: 'History day' },          morning: 'brand', noon: 'rich',  evening: 'check' },
      { title: { tr: 'Sanat ve duvar', en: 'Art & wall' },           morning: 'museum',noon: 'wall',  evening: 'tier' },
      { title: { tr: 'Yavaş bir gün',  en: 'A slower day' },         morning: 'tier',  noon: 'check', evening: 'wall' },
    ],
  },

  IST: {
    city: 'İstanbul',
    tagline: { tr: 'İki kıtanın şehri', en: 'A city across two continents' },
    summary: {
      tr: 'İstanbul, Bizans ile Osmanlı\'yı, Avrupa ile Asya\'yı bir Boğaz\'ın iki yakasında buluşturur.',
      en: 'Istanbul joins Byzantium and Ottoman, Europe and Asia across one strait.',
    },
    mapPalette: { sea: '#7DB3CC', land: '#F1E5CC', line: '#1F1A14', accent: '#B7312C' },
    pois: [
      { id: 'aya',   name: { tr: 'Ayasofya',         en: 'Hagia Sophia' },     type: 'religious', x: 50, y: 56, hours: '09:00 — 18:00', fee: '€25', desc: { tr: '1.500 yıllık bazilika, sonra cami, müze, yine cami.', en: '1,500-year basilica → mosque → museum → mosque again.' } },
      { id: 'blue',  name: { tr: 'Sultanahmet Camii', en: 'Blue Mosque' },     type: 'religious', x: 52, y: 60, hours: '09:00 — 18:00', fee: 'Ücretsiz', desc: { tr: '21.000 İznik çinisi; altı minare.', en: '21,000 İznik tiles; six minarets.' } },
      { id: 'topk',  name: { tr: 'Topkapı Sarayı',   en: 'Topkapı Palace' },   type: 'monument',  x: 56, y: 50, hours: '09:00 — 18:00', fee: '₺750', desc: { tr: '400 yıl Osmanlı padişahları burada yaşadı. Harem ayrı bilet.', en: 'Ottoman sultans lived here for 400 years; harem is a separate ticket.' } },
      { id: 'grand', name: { tr: 'Kapalıçarşı',      en: 'Grand Bazaar' },     type: 'shopping',  x: 44, y: 54, hours: '09:00 — 19:00 (Pzr kapalı)', fee: 'Ücretsiz', desc: { tr: '4.000 dükkân, 1455\'ten beri. Halı, baharat, gümüş.', en: '4,000 shops since 1455 — carpets, spices, silver.' } },
      { id: 'bosp',  name: { tr: 'Boğaz Vapuru',     en: 'Bosphorus Cruise' }, type: 'view',      x: 64, y: 30, hours: '10:00 — 18:00', fee: '₺175', desc: { tr: 'Avrupa ile Asya arasında 2 saatlik vapur turu.', en: 'Two-hour boat between Europe and Asia.' } },
      { id: 'gala',  name: { tr: 'Galata Kulesi',    en: 'Galata Tower' },     type: 'view',      x: 42, y: 38, hours: '08:30 — 23:00', fee: '€30', desc: { tr: '1348\'den beri ayakta; tüm tarihi yarımada panoraması.', en: 'Standing since 1348; full panorama of the historic peninsula.' } },
    ],
    days: [
      { title: { tr: 'Sultanahmet',     en: 'Sultanahmet' },          morning: 'aya',   noon: 'blue',  evening: 'topk' },
      { title: { tr: 'Bazaar + Boğaz',  en: 'Bazaar + Bosphorus' },   morning: 'grand', noon: 'bosp',  evening: 'gala' },
      { title: { tr: 'İki yaka',        en: 'Two shores' },           morning: 'gala',  noon: 'aya',   evening: 'bosp' },
    ],
  },

  // ── Tour-hub destinations (Türkiye Turu şehirleri) ─────────────────────
  GNY: {
    city: 'Şanlıurfa',
    tagline: { tr: 'Dünyanın en eski tapınağı', en: 'Where the world\'s oldest temple stands' },
    summary: {
      tr: 'Göbeklitepe — 12.000 yıllık anıtlar. Balıklıgöl, Harran kerpiç evleri ve çiğ köfte.',
      en: 'Göbeklitepe — 12,000-year-old monoliths. Balıklıgöl, the beehive houses of Harran, and çiğ köfte.',
    },
    mapPalette: { sea: '#D6BFA1', land: '#EFD9A8', line: '#3A1F0E', accent: '#B6552E' },
    pois: [
      { id: 'gobeklitepe', name: { tr: 'Göbeklitepe',   en: 'Göbeklitepe' },     type: 'monument',  x: 36, y: 58, hours: '08:00 — 18:00', fee: '₺240', desc: { tr: 'Dünyanın bilinen en eski tapınağı — M.Ö. 9.500. T-biçimli megalitler, hayvan kabartmaları.', en: 'The world\'s oldest known temple complex — 9,500 BC. T-shaped megaliths with animal reliefs.' } },
      { id: 'baliklig',    name: { tr: 'Balıklıgöl',     en: 'Balıklıgöl' },       type: 'religious', x: 52, y: 44, hours: '24 saat',         fee: 'Ücretsiz', desc: { tr: 'Hz. İbrahim\'in ateşe atıldığı yer. Kutsal sayılan sazan balıkları burada.', en: 'The legendary spot where Prophet Abraham was cast into fire — home to the sacred carp.' } },
      { id: 'harran',      name: { tr: 'Harran kültürü', en: 'Harran beehive houses' }, type: 'monument', x: 30, y: 72, hours: '09:00 — 18:00', fee: '₺60',  desc: { tr: 'Konik kerpiç evler, 3.000 yıllık Harran Üniversitesi kalıntıları.', en: 'Cone-shaped mudbrick houses and ruins of the 3,000-year-old Harran University.' } },
      { id: 'urfacarsi',   name: { tr: 'Urfa Bedesteni',  en: 'Urfa bazaar' },     type: 'shopping',  x: 60, y: 38, hours: '08:00 — 20:00', fee: 'Ücretsiz', desc: { tr: 'Bakırcılar, kazırı, sahlep ve işlemeli eşarplar.', en: 'Coppersmiths, kazırı wraps, salep, and embroidered scarves.' } },
      { id: 'urfamuze',    name: { tr: 'Şanlıurfa Müzesi', en: 'Urfa Archaeology Museum' }, type: 'museum', x: 50, y: 56, hours: '08:30 — 17:30', fee: '₺120', desc: { tr: 'Göbeklitepe bulguları, dik insan heykeli, Neolitik koleksiyon.', en: 'Göbeklitepe artefacts, the standing Urfa man, Neolithic collection.' } },
      { id: 'cigkofte',    name: { tr: 'Çiğ köfte ocağı',  en: 'Çiğ köfte parlour' },   type: 'square',    x: 66, y: 60, hours: '12:00 — 23:00', fee: '₺80',  desc: { tr: 'Urfa\'nın imza yemeği — yoğurur, halayla servis ederler.', en: 'Urfa\'s signature dish — hand-kneaded, served with halay dancing.' } },
    ],
    days: [
      { title: { tr: 'Antik gizem',     en: 'Ancient mystery' }, morning: 'gobeklitepe', noon: 'urfamuze', evening: 'baliklig' },
      { title: { tr: 'Harran günü',     en: 'Harran day' },     morning: 'harran',     noon: 'cigkofte', evening: 'urfacarsi' },
      { title: { tr: 'Yavaş bir gün',  en: 'A slower day' },   morning: 'baliklig',    noon: 'urfacarsi', evening: 'cigkofte' },
    ],
  },

  NAV: {
    city: 'Kapadokya',
    tagline: { tr: 'Peri bacaları ve gökdeki balonlar', en: 'Fairy chimneys and balloon-dotted skies' },
    summary: {
      tr: 'Göreme vadisi, yeraltı şehirleri ve şafak vakti göğü dolduran balonlar. Avanos\'ta çanak çömlek, Uçhisar\'da kürek manzarası.',
      en: 'Göreme valley, underground cities, and dawn skies filled with balloons. Pottery in Avanos, panoramic ridges at Uçhisar.',
    },
    mapPalette: { sea: '#E4C6A0', land: '#F8E5C2', line: '#3A1F0E', accent: '#E5712C' },
    pois: [
      { id: 'balon',    name: { tr: 'Sıcak hava balonu',    en: 'Hot-air balloon flight' }, type: 'view',     x: 48, y: 18, hours: '05:30 — 07:30', fee: '₺6.800', desc: { tr: 'Vadinin üzerinde 1 saatlik şafak uçuşu. Yılda ~280 gün uçar.', en: 'A one-hour dawn flight over the valley — flies ~280 days a year.' } },
      { id: 'goreme',   name: { tr: 'Göreme Açık Hava Müz.', en: 'Göreme Open-Air Museum' }, type: 'museum', x: 42, y: 42, hours: '08:00 — 19:00', fee: '₺450', desc: { tr: 'Kayaya oyulmuş Bizans kiliseleri, M.S. 10. yüzyıl fresklerle.', en: 'Rock-cut Byzantine churches with 10th-century frescoes.' } },
      { id: 'uchisar',  name: { tr: 'Uçhisar Kalesi',      en: 'Uçhisar Castle' },   type: 'view',     x: 30, y: 50, hours: '08:00 — sunset', fee: '₺85',   desc: { tr: 'Kapadokya\'nın en yüksek noktası (1.450m) — 360° vadi manzarası.', en: 'The highest point in Cappadocia (1,450m) — 360° valley views.' } },
      { id: 'avanos',   name: { tr: 'Avanos çanak çömleği', en: 'Avanos pottery' },  type: 'shopping', x: 56, y: 30, hours: '09:00 — 19:00', fee: 'Ücretsiz', desc: { tr: 'Kızılırmak kilinden 3.000 yıllık çömlekçilik geleneği. Müze + atelye.', en: 'A 3,000-year tradition of throwing pots from Kızılırmak clay — museum + workshop.' } },
      { id: 'derinkuyu',name: { tr: 'Derinkuyu yer altı',  en: 'Derinkuyu underground city' }, type: 'monument', x: 62, y: 70, hours: '08:00 — 19:00', fee: '₺450', desc: { tr: '8 katlı, 20.000 kişilik antik yeraltı şehri.', en: '8 levels, 20,000-person ancient underground city.' } },
      { id: 'kirmizivadi', name: { tr: 'Kırmızı Vadi', en: 'Red Valley' },       type: 'park',     x: 70, y: 52, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Gün batımında pembeleşen kanyon. 2 saatlik yürüyüş rotası.', en: 'A canyon that turns pink at sunset — a 2-hour hiking route.' } },
    ],
    days: [
      { title: { tr: 'Şafak vakti',     en: 'At dawn' },        morning: 'balon',    noon: 'goreme',   evening: 'uchisar' },
      { title: { tr: 'Vadiler günü',    en: 'Valley day' },     morning: 'derinkuyu', noon: 'avanos',  evening: 'kirmizivadi' },
      { title: { tr: 'Yavaş bir gün',  en: 'A slower day' },   morning: 'avanos',    noon: 'uchisar',  evening: 'kirmizivadi' },
    ],
  },

  ADF: {
    city: 'Adıyaman',
    tagline: { tr: 'Tanrı heykellerinin tepesi', en: 'The mountain of the god-statues' },
    summary: {
      tr: 'Nemrut Dağı — Komagene kralı Antiochos\'un 2.150m\'de devasa tanrı başları. Cendere Köprüsü, Karakus Tümülüsü, Atatürk Baraj Gölü.',
      en: 'Mount Nemrut — King Antiochos\' colossal god heads at 2,150m. Cendere Bridge, Karakus tumulus, Atatürk Dam Lake.',
    },
    mapPalette: { sea: '#9FB7CC', land: '#E8DABA', line: '#2C1A08', accent: '#C5A059' },
    pois: [
      { id: 'nemrutdogu', name: { tr: 'Nemrut doğu terası', en: 'Nemrut east terrace' }, type: 'monument', x: 56, y: 24, hours: '04:30 — 09:00', fee: '₺240', desc: { tr: 'Gün doğumunda dünyaca ünlü tanrı heykelleri. 2.150m\'de buz gibi sabah.', en: 'The world-famous god statues at sunrise — 2,150m, icy morning.' } },
      { id: 'nemrutbati', name: { tr: 'Nemrut batı terası', en: 'Nemrut west terrace' }, type: 'monument', x: 50, y: 30, hours: '15:00 — sunset', fee: '₺240', desc: { tr: 'Gün batımında altın rengi alan heykeller. Daha az kalabalık.', en: 'Statues bathed in golden hour light — quieter than dawn.' } },
      { id: 'cendere',  name: { tr: 'Cendere Köprüsü',    en: 'Cendere Roman bridge' }, type: 'monument', x: 36, y: 50, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'M.S. 200 Roma köprüsü — dünyanın hala kullanılan en uzun ikinci tek açıklıklısı.', en: 'A 200 AD Roman bridge — second-largest single-span ancient bridge still in use.' } },
      { id: 'karakus',  name: { tr: 'Karakus Tümülüsü',   en: 'Karakus tumulus' },   type: 'monument', x: 60, y: 56, hours: '08:00 — sunset', fee: 'Ücretsiz', desc: { tr: 'Komagene hanedanının kraliyet kadınları için M.Ö. 36 mezar tepesi.', en: 'A burial mound built 36 BC for the women of the Commagene dynasty.' } },
      { id: 'arsemia',  name: { tr: 'Arsameia kalıntıları', en: 'Arsameia ruins' },    type: 'monument', x: 44, y: 64, hours: '08:00 — 18:00', fee: '₺60',  desc: { tr: 'Komagene\'nin yaz başkenti. Herakles tokalaşma kabartması burada.', en: 'Summer capital of Commagene — the Heracles handshake relief is here.' } },
      { id: 'baraj',    name: { tr: 'Atatürk Baraj Gölü',  en: 'Atatürk Dam Lake' },  type: 'view',     x: 68, y: 76, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Türkiye\'nin en büyük baraj gölü. Kahta\'dan tekne turları.', en: 'Turkey\'s largest dam reservoir — boat tours from Kahta.' } },
    ],
    days: [
      { title: { tr: 'Şafak terası',    en: 'Dawn terrace' },    morning: 'nemrutdogu', noon: 'arsemia', evening: 'nemrutbati' },
      { title: { tr: 'Antik köprüler',  en: 'Ancient bridges' }, morning: 'cendere',    noon: 'karakus', evening: 'baraj' },
      { title: { tr: 'Yavaş bir gün',  en: 'A slower day' },    morning: 'baraj',      noon: 'cendere', evening: 'arsemia' },
    ],
  },

  RZE: {
    city: 'Rize',
    tagline: { tr: 'Sis, yayla ve çay', en: 'Mist, highlands and tea' },
    summary: {
      tr: 'Karadeniz dağlarının yeşil derinliği. Ayder yaylası, Fırtına Vadisi, asma köprüler ve dünyanın en sevilen siyah çayı.',
      en: 'The deep-green Pontic Alps. Ayder plateau, Fırtına Valley, suspension bridges, and the world\'s favourite black tea.',
    },
    mapPalette: { sea: '#7FA98B', land: '#D8E4BD', line: '#1F2E1A', accent: '#1F4D3F' },
    pois: [
      { id: 'ayder',    name: { tr: 'Ayder Yaylası',       en: 'Ayder Plateau' },    type: 'park',     x: 56, y: 32, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: '1.350m\'de şelaleler ve ahşap evler. Sis sabahları efsanevi.', en: 'Waterfalls and wooden chalets at 1,350m — the mist-bound mornings are legendary.' } },
      { id: 'firtina',  name: { tr: 'Fırtına Vadisi',      en: 'Fırtına Valley' },   type: 'view',     x: 38, y: 50, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Asma köprüler, raftıng, taş kemer köprüler.', en: 'Suspension bridges, white-water rafting, Ottoman stone arches.' } },
      { id: 'zilkale',  name: { tr: 'Zil Kalesi',          en: 'Zil Castle' },       type: 'monument', x: 30, y: 40, hours: '09:00 — 18:00', fee: '₺40',  desc: { tr: '13. yüzyıl Gençler kalesi, Fırtına vadisinin üzerinde 1.200m.', en: '13th-century watchtower over the valley at 1,200m.' } },
      { id: 'cayfab',   name: { tr: 'Çay fabrikası',       en: 'Tea factory tour' }, type: 'shopping', x: 64, y: 60, hours: '09:00 — 17:00', fee: '₺80',  desc: { tr: 'Hasattan poset çaya kadar tüm süreç — sonunda tadım.', en: 'Harvest to tea bag — the whole process, with tasting at the end.' } },
      { id: 'pokut',    name: { tr: 'Pokut yaylası',       en: 'Pokut highland' },   type: 'view',     x: 22, y: 26, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Bulutların üzerinde Sertel dağlık manzarası. Ahşap kalınan evler.', en: 'A panoramic ridge above the clouds — wooden serender huts to stay in.' } },
      { id: 'sumela',   name: { tr: 'Sumela Manastırı',    en: 'Sumela Monastery' }, type: 'religious', x: 70, y: 80, hours: '09:00 — 17:00', fee: '₺210', desc: { tr: '386\'da Trabzon yakınında uçurum kenarına yapılmış Rum manastırı.', en: 'A 386 AD cliff-face Greek monastery near Trabzon.' } },
    ],
    days: [
      { title: { tr: 'Yayla günü',      en: 'Highland day' },    morning: 'ayder',  noon: 'pokut',   evening: 'zilkale' },
      { title: { tr: 'Vadi günü',       en: 'Valley day' },      morning: 'firtina', noon: 'sumela',  evening: 'cayfab' },
      { title: { tr: 'Yavaş bir gün',  en: 'A slower day' },    morning: 'cayfab',  noon: 'ayder',   evening: 'firtina' },
    ],
  },

};

// Generic fallback for any code not in the table — small, polite, useful.
const WEB_DEST_FALLBACK = {
  pois: [
    { id: 'old',     name: { tr: 'Tarihi merkez',       en: 'Historic centre' },   type: 'square',    x: 50, y: 50, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Şehrin en eski meydanı; başlangıç noktası.', en: 'The oldest square in town — your starting point.' } },
    { id: 'museum',  name: { tr: 'Şehir Müzesi',        en: 'City Museum' },       type: 'museum',    x: 44, y: 42, hours: '10:00 — 17:00', fee: 'Bil. ofisinden', desc: { tr: 'Yerel tarih, eserler, sergiler.', en: 'Local history, artefacts, exhibitions.' } },
    { id: 'view',    name: { tr: 'Manzara noktası',     en: 'Viewpoint' },         type: 'view',      x: 62, y: 28, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Şehre bakan tepe / kule; gün batımına uygun.', en: 'A hill or tower over the city — sunset friendly.' } },
    { id: 'religious', name: { tr: 'Önemli dini yapı',  en: 'Main place of worship' }, type: 'religious', x: 56, y: 60, hours: '08:00 — 20:00', fee: 'Ücretsiz', desc: { tr: 'Şehrin en önemli dini yapısı; uygun kıyafet.', en: 'The town\'s most important place of worship — modest dress.' } },
    { id: 'market',  name: { tr: 'Yerel pazar',         en: 'Local market' },      type: 'shopping',  x: 40, y: 60, hours: '08:00 — 19:00', fee: 'Ücretsiz', desc: { tr: 'Yerel yemek, hediyelik, atmosfer.', en: 'Local food, souvenirs, atmosphere.' } },
    { id: 'park',    name: { tr: 'Şehir parkı',         en: 'City park' },         type: 'park',      x: 30, y: 36, hours: '24 saat', fee: 'Ücretsiz', desc: { tr: 'Yürüyüş, kahve, mola.', en: 'Walk, coffee, a break.' } },
  ],
  days: [
    { title: { tr: 'Klasik gün',      en: 'Classic day' },       morning: 'old',     noon: 'museum', evening: 'view' },
    { title: { tr: 'Yavaş gün',       en: 'A slower day' },      morning: 'religious', noon: 'market', evening: 'park' },
    { title: { tr: 'Yürüme günü',     en: 'A walking day' },     morning: 'park',    noon: 'old',    evening: 'view' },
  ],
  mapPalette: { sea: '#9FB7CC', land: '#F0E4CD', line: '#0F172A', accent: '#C5A059' },
};

function getDestination(code) {
  if (WEB_DESTS[code]) return WEB_DESTS[code];
  // For unknown cities — synthesize from city info + fallback POIs
  const city = (window.findCity ? window.findCity(code) : null);
  return {
    city: city?.city || code,
    tagline: { tr: city?.country || '', en: city?.country || '' },
    summary: {
      tr: `${city?.city || code} için demo bir rota — şehrin merkezinden başlayın.`,
      en: `A sample route for ${city?.city || code} — start in the centre.`,
    },
    ...WEB_DEST_FALLBACK,
  };
}

// POI type → icon glyph + color (used in pins + list)
const POI_TYPE_META = {
  monument:  { glyph: '⛩', tr: 'Anıt',      en: 'Monument' },
  museum:    { glyph: '⌂', tr: 'Müze',      en: 'Museum' },
  view:      { glyph: '◎', tr: 'Manzara',   en: 'Viewpoint' },
  park:      { glyph: '✦', tr: 'Park',      en: 'Park' },
  square:    { glyph: '□', tr: 'Meydan',    en: 'Square' },
  religious: { glyph: '✚', tr: 'Dini yapı', en: 'Religious' },
  shopping:  { glyph: '◇', tr: 'Çarşı',     en: 'Shopping' },
};

Object.assign(window, { WEB_DESTS, WEB_DEST_FALLBACK, getDestination, POI_TYPE_META });
