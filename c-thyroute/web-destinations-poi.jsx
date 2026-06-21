// web-destinations-poi.jsx — Categorised POI library per destination.
//
// For each city we provide curated lists across 6 categories:
//   restaurant · hotel · museum · cafe · shopping · gallery
// Each entry is approximate (x/y % within the map, like the main `pois`)
// so they slot into the existing Leaflet poiLatLon() machinery and become
// real lat/lon pins.
//
// Schema:
//   { id, cat, name: { tr, en }, x, y, desc: { tr, en }, hours, price }
//
// Use:
//   const cats = getDestPois(code).filter(p => p.cat === 'restaurant');
//   poiLatLon(p, code)  → { lat, lon }

const POI_CATEGORIES = [
  { id: 'restaurant', icon: '🍽', tr: 'Restoranlar', en: 'Restaurants', color: '#B7312C' },
  { id: 'hotel',      icon: '🏨', tr: 'Oteller',     en: 'Hotels',      color: '#0053A5' },
  { id: 'museum',     icon: '🏛', tr: 'Müzeler',     en: 'Museums',     color: '#C5A059' },
  { id: 'cafe',       icon: '☕', tr: 'Kafeler',     en: 'Cafés',       color: '#8B5A2B' },
  { id: 'shopping',   icon: '🛍', tr: 'Alışveriş',   en: 'Shopping',    color: '#7A4988' },
  { id: 'gallery',    icon: '🎨', tr: 'Galeriler',   en: 'Galleries',   color: '#1B7A4F' },
];

// Compact macro: r(cat, x, y, nameTr, nameEn, descTr, descEn, hours, price)
function mk(id, cat, x, y, nameTr, nameEn, descTr, descEn, hours, price) {
  return { id, cat, x, y,
    name: { tr: nameTr, en: nameEn },
    desc: { tr: descTr, en: descEn },
    hours, price };
}

const DEST_POIS = {
  FCO: [ // Rome
    mk('r-pierluigi',  'restaurant', 52, 60, 'Pierluigi',           'Pierluigi',           'Yüzyıllık balıkçı, ortaçağ piazzasında.',  'Centenary seafood on a medieval piazza.',  '12:30–23:00', '€€€'),
    mk('r-armando',    'restaurant', 42, 35, 'Armando al Pantheon', 'Armando al Pantheon', 'Pantheon yanında klasik Roma mutfağı.',     'Classic Roman cooking by the Pantheon.',   '12:30–23:00', '€€'),
    mk('r-roscioli',   'restaurant', 48, 55, 'Roscioli',            'Roscioli',            'Salumeria + restoran, mükemmel carbonara.','Salumeria + restaurant, legendary carbonara.','12:30–23:30','€€'),
    mk('r-flavio',     'restaurant', 35, 78, 'Flavio al Velavevodetto', 'Flavio al Velavevodetto', 'Testaccio\'da geleneksel cacio e pepe.', 'Testaccio classic — cacio e pepe heaven.', '12:00–15:00', '€€'),
    mk('h-hassler',    'hotel',      55, 38, 'Hotel Hassler',       'Hotel Hassler',       'İspanyol Merdivenleri üzerinde lüks.',      'Luxury atop the Spanish Steps.',           '24h',         '€€€€'),
    mk('h-derussie',   'hotel',      52, 28, 'Hotel de Russie',     'Hotel de Russie',     'Borghese\'nin yanında gizli bahçeli otel.', 'Hidden garden hotel beside Villa Borghese.','24h',         '€€€€'),
    mk('h-monti',      'hotel',      62, 50, 'The Hoxton Roma',     'The Hoxton Roma',     'Genç tarz, Monti civarı.',                  'Hip vibe, Monti quarter.',                 '24h',         '€€€'),
    mk('m-vatican',    'museum',     22, 30, 'Vatikan Müzeleri',    'Vatican Museums',     '7 km koridor, Sistina Şapeli ile biter.',   '7 km of art, ends at the Sistine Chapel.', '08:00–18:30', '€'),
    mk('m-borghese',   'museum',     58, 25, 'Galleria Borghese',   'Galleria Borghese',   'Bernini ve Caravaggio için bilet şart.',    'Bernini & Caravaggio — book ahead.',       '09:00–19:00', '€'),
    mk('m-capitoline', 'museum',     50, 62, 'Capitoline Müzeleri', 'Capitoline Museums',  'Dünyanın ilk halka açık müzesi.',           'The world\'s first public museum.',        '09:30–19:30', '€'),
    mk('c-saneustachio','cafe',      45, 50, 'Sant\'Eustachio',     'Sant\'Eustachio',     'Roma\'nın en ünlü espresso\'su.',            'Rome\'s most famous espresso.',             '07:30–01:00', '€'),
    mk('c-tazza',      'cafe',       43, 47, 'Tazza d\'Oro',        'Tazza d\'Oro',        'Pantheon yanında klasik granita.',          'Granita di caffè next to the Pantheon.',   '07:00–20:30', '€'),
    mk('c-marigold',   'cafe',       40, 75, 'Marigold',            'Marigold',            'Ostiense\'de Skandinav esintili kahvaltı.',  'Scandi-style brunch in Ostiense.',         '08:30–17:00', '€€'),
    mk('s-condotti',   'shopping',   53, 33, 'Via dei Condotti',    'Via dei Condotti',    'İspanyol Merdivenleri\'nin lüks caddesi.',  'The luxury street off the Spanish Steps.', 'Caddeler 24h',   '€€€€'),
    mk('s-borgocognac','shopping',   60, 48, 'Via del Corso',       'Via del Corso',       'Roma\'nın ana alışveriş arteri.',           'Rome\'s main shopping artery.',            '10:00–20:00', '€€'),
    mk('s-mercatomonti','shopping',  60, 53, 'Mercato Monti',       'Mercato Monti',       'Hafta sonu tasarımcı pazarı.',              'Weekend designer market.',                 '10:00–20:00', '€€'),
    mk('g-maxxi',      'gallery',    58, 12, 'MAXXI',               'MAXXI',               'Zaha Hadid imzalı çağdaş sanat.',           'Contemporary art in a Zaha Hadid shell.',  '11:00–19:00', '€'),
    mk('g-macro',      'gallery',    65, 30, 'MACRO',               'MACRO',               'Belediye çağdaş sanat müzesi.',             'The city\'s contemporary museum.',         '10:00–20:00', '€'),
  ],

  CDG: [ // Paris
    mk('r-septime',    'restaurant', 70, 50, 'Septime',             'Septime',             'Yeni-bistro hareketinin ikonu.',            'Icon of the néo-bistro movement.',        '12:30–22:00', '€€€'),
    mk('r-bouillon',   'restaurant', 50, 45, 'Bouillon Pigalle',    'Bouillon Pigalle',    'Klasik Fransız mutfağı, makul fiyat.',      'Classic French at gentle prices.',         '12:00–00:00', '€'),
    mk('r-chezjanou',  'restaurant', 58, 56, 'Chez Janou',          'Chez Janou',          'Marais\'de Provençal komün masaları.',       'Provençal communal tables in Le Marais.', '12:00–00:00', '€€'),
    mk('r-clamato',    'restaurant', 70, 55, 'Clamato',             'Clamato',             'Septime\'in deniz mahsulü kardeşi.',        'Septime\'s seafood little sister.',        '19:00–23:00', '€€'),
    mk('h-ritz',       'hotel',      52, 38, 'Ritz Paris',          'Ritz Paris',          'Place Vendôme\'da Belle Époque klasiği.',   'Belle Époque legend on Place Vendôme.',   '24h',         '€€€€'),
    mk('h-grandhotel', 'hotel',      48, 38, 'Le Grand Hôtel',      'Le Grand Hôtel',      'Opéra Garnier karşısında.',                 'Across from the Palais Garnier.',          '24h',         '€€€€'),
    mk('h-jules',      'hotel',      53, 48, 'Hôtel Jules César',   'Hôtel Jules César',   'Bastille civarı tasarım otel.',             'Design hotel near Bastille.',              '24h',         '€€€'),
    mk('m-louvre',     'museum',     54, 42, 'Louvre',              'Louvre',              'Dünyanın en büyük müzesi, Mona Lisa\'nın evi.','World\'s largest museum, home of Mona Lisa.','09:00–18:00', '€'),
    mk('m-orsay',      'museum',     50, 48, 'Musée d\'Orsay',      'Musée d\'Orsay',      'Belle Époque tren istasyonunda Empresyonist.',  'Impressionists in a Belle Époque station.','09:30–18:00', '€'),
    mk('m-orangerie',  'museum',     50, 42, 'Musée de l\'Orangerie','Musée de l\'Orangerie','Monet\'nin nilüferleri.',                   'Monet\'s Water Lilies.',                    '09:00–18:00', '€'),
    mk('m-pompidou',   'museum',     58, 45, 'Centre Pompidou',     'Centre Pompidou',     'Çağdaş sanat + ters çevrilmiş bina.',       'Modern art in an inside-out building.',    '11:00–21:00', '€'),
    mk('c-deuxmagots', 'cafe',       48, 52, 'Les Deux Magots',     'Les Deux Magots',     'Saint-Germain edebiyat kafesi.',            'Saint-Germain literary café.',             '07:30–01:00', '€€'),
    mk('c-angelina',   'cafe',       50, 40, 'Angelina',            'Angelina',            'Rue de Rivoli\'de meşhur sıcak çikolata.',  'Hot chocolate on Rue de Rivoli.',          '07:30–19:00', '€€'),
    mk('c-dupain',     'cafe',       55, 52, 'Du Pain et des Idées','Du Pain et des Idées','Canal Saint-Martin civarı boulangerie.',    'Bakery near Canal Saint-Martin.',          '07:15–19:30', '€'),
    mk('s-fbsthonore', 'shopping',   48, 36, 'Rue du Fbg. Saint-Honoré', 'Rue du Faubourg Saint-Honoré', 'Lüks haute couture caddesi.', 'Luxury haute couture street.', '10:00–19:00', '€€€€'),
    mk('s-marais',     'shopping',   58, 47, 'Le Marais',           'Le Marais',           'Bağımsız butikler, vintage.',               'Indie boutiques, vintage.',                '11:00–20:00', '€€€'),
    mk('s-merci',      'shopping',   60, 48, 'Merci',               'Merci',               'Konsept mağaza, kitap-kafe.',                'Concept store with a book café.',          '10:30–19:30', '€€€'),
    mk('g-palaistokyo','gallery',    40, 35, 'Palais de Tokyo',     'Palais de Tokyo',     'Çağdaş Avrupa sanat merkezi.',              'Contemporary European art hub.',           '12:00–00:00', '€'),
    mk('g-jeudepaume', 'gallery',    52, 40, 'Jeu de Paume',        'Jeu de Paume',        'Fotoğraf ve hareketli görüntü.',            'Photography & moving image.',              '11:00–19:00', '€'),
  ],

  LHR: [ // London
    mk('r-dishoom',    'restaurant', 55, 50, 'Dishoom',             'Dishoom',             'Hindistan-Bombay esintili Londra ikonu.',   'Bombay-café icon of London.',              '08:00–23:00', '€€'),
    mk('r-stjohn',     'restaurant', 60, 45, 'St. JOHN',            'St. JOHN',            'Burun-kuyruk İngiliz mutfağı.',             'Nose-to-tail British cooking.',            '12:00–23:00', '€€€'),
    mk('r-padella',    'restaurant', 58, 56, 'Padella',             'Padella',             'Borough Market\'te taze el yapımı makarna.', 'Fresh handmade pasta at Borough Market.', '12:00–22:00', '€'),
    mk('r-rochelle',   'restaurant', 65, 42, 'Rochelle Canteen',    'Rochelle Canteen',    'Eski okul bahçesinde gizli kantin.',         'Hidden canteen in an old schoolyard.',     '09:00–21:00', '€€'),
    mk('h-ritzlondon', 'hotel',      52, 50, 'The Ritz London',     'The Ritz London',     'Piccadilly\'de Edward dönemi lüksü.',       'Edwardian luxury on Piccadilly.',          '24h',         '€€€€'),
    mk('h-ned',        'hotel',      60, 50, 'The Ned',             'The Ned',             'Banka binasında tasarım otel + 9 restoran.','Bank-turned-hotel with 9 restaurants.',    '24h',         '€€€€'),
    mk('h-shoreditch', 'hotel',      65, 42, 'The Hoxton Shoreditch','The Hoxton Shoreditch','Şehrin sanatsal mahallesinde.',            'In the city\'s creative quarter.',         '24h',         '€€€'),
    mk('m-british',    'museum',     50, 42, 'British Museum',      'British Museum',      'Rosetta Taşı + Parthenon mermerleri.',      'Rosetta Stone + Parthenon marbles.',       '10:00–17:00', 'Free'),
    mk('m-tatemod',    'museum',     55, 56, 'Tate Modern',         'Tate Modern',         'Eski elektrik santralinde çağdaş sanat.',   'Modern art in a former power station.',    '10:00–18:00', 'Free'),
    mk('m-vanda',      'museum',     45, 55, 'V&A',                 'V&A',                 'Sanat, tasarım & moda müzesi.',             'Art, design & fashion museum.',            '10:00–17:45', 'Free'),
    mk('m-natural',    'museum',     46, 55, 'Natural History',     'Natural History',     'Dinozor iskeletleri + büyük baleen.',       'Dinosaur skeletons + great baleen.',       '10:00–17:50', 'Free'),
    mk('c-monmouth',   'cafe',       55, 55, 'Monmouth Coffee',     'Monmouth Coffee',     'Londra\'nın efsane uzman kahvesi.',         'London\'s specialty coffee legend.',       '08:00–18:00', '€'),
    mk('c-ottolenghi', 'cafe',       58, 48, 'Ottolenghi',          'Ottolenghi',          'Yotam Ottolenghi\'nin deli salataları.',    'Yotam Ottolenghi\'s vibrant salads.',      '08:00–22:00', '€€'),
    mk('c-fortnum',    'cafe',       52, 50, 'Fortnum & Mason',     'Fortnum & Mason',     'Klasik ikindi çayı kurumu.',                'Classic afternoon tea institution.',       '10:00–20:00', '€€€'),
    mk('s-harrods',    'shopping',   42, 53, 'Harrods',             'Harrods',             'Knightsbridge\'in efsane mağazası.',        'Knightsbridge\'s legendary department store.', '10:00–21:00', '€€€€'),
    mk('s-libertys',   'shopping',   52, 47, 'Liberty London',      'Liberty London',      'Tudor stili lüks moda evi.',                'Mock-Tudor luxury fashion house.',         '10:00–20:00', '€€€'),
    mk('s-borough',    'shopping',   58, 56, 'Borough Market',      'Borough Market',      'Londra\'nın gurme yemek pazarı.',           'London\'s gourmet food market.',           '10:00–17:00', '€€'),
    mk('g-saatchi',    'gallery',    42, 53, 'Saatchi Gallery',     'Saatchi Gallery',     'Çağdaş Britanya sanatı.',                   'Contemporary British art.',                '10:00–18:00', 'Free'),
    mk('g-whitechapel','gallery',    72, 45, 'Whitechapel Gallery', 'Whitechapel Gallery', 'Pollock\'u ilk gösteren Avrupa galerisi.',  'First European show of Jackson Pollock.',  '11:00–18:00', 'Free'),
  ],

  BCN: [ // Barcelona
    mk('r-tickets',    'restaurant', 35, 60, 'Tickets',             'Tickets',             'Adrià kardeşlerin tapas tiyatrosu.',        'Adrià brothers\' theatrical tapas.',       '19:00–23:00', '€€€'),
    mk('r-elnacional', 'restaurant', 55, 48, 'El Nacional',         'El Nacional',         'Modernist holde dört restoran.',            'Four restaurants in a modernist hall.',    '12:00–01:00', '€€'),
    mk('r-quimet',     'restaurant', 38, 60, 'Quimet & Quimet',     'Quimet & Quimet',     'Klasik montadito ayakta tapas.',            'Stand-up classic montaditos.',             '12:00–22:30', '€'),
    mk('r-cancalent',  'restaurant', 58, 50, 'Can Culleretes',      'Can Culleretes',      'Barselona\'nın en eski restoranı (1786).',  'Barcelona\'s oldest restaurant (1786).',   '13:30–22:00', '€€'),
    mk('h-w',          'hotel',      45, 78, 'W Barcelona',         'W Barcelona',         'Yelken biçimli sahil oteli.',               'Sail-shaped beachfront tower.',            '24h',         '€€€€'),
    mk('h-hotelarts',  'hotel',      55, 70, 'Hotel Arts',          'Hotel Arts',          'Olimpik Liman\'ın sembol oteli.',           'Olympic Port\'s landmark hotel.',          '24h',         '€€€€'),
    mk('h-hoxton',     'hotel',      52, 50, 'The Hoxton Poblenou', 'The Hoxton Poblenou', 'Sanatsal Poblenou\'da hip otel.',           'Hip hotel in artsy Poblenou.',             '24h',         '€€€'),
    mk('m-sagrada',    'museum',     58, 42, 'Sagrada Família',     'Sagrada Família',     'Gaudí\'nin bitmemiş başyapıtı.',            'Gaudí\'s unfinished masterpiece.',         '09:00–19:00', '€€'),
    mk('m-parkguell',  'museum',     55, 25, 'Park Güell',          'Park Güell',          'Mozaik kertenkele + panoramik bakış.',      'Mosaic salamander + panorama.',            '09:30–19:30', '€€'),
    mk('m-picasso',    'museum',     58, 56, 'Museu Picasso',       'Museu Picasso',       'Sanatçının erken dönem çalışmaları.',       'The artist\'s early works.',               '10:00–19:00', '€'),
    mk('m-miro',       'museum',     38, 70, 'Fundació Joan Miró',  'Fundació Joan Miró',  'Montjuïc\'te kapsamlı Miró koleksiyonu.',   'Comprehensive Miró on Montjuïc.',          '10:00–19:00', '€'),
    mk('c-granja',     'cafe',       50, 50, 'Granja M. Viader',    'Granja M. Viader',    'Sıcak çikolata icat eden mekan.',           'Birthplace of Cacaolat.',                  '09:00–13:30', '€'),
    mk('c-satans',     'cafe',       58, 50, 'Satan\'s Coffee',     'Satan\'s Coffee',     'Hipster üçüncü dalga kahve.',               'Hipster third-wave coffee.',               '09:00–18:00', '€'),
    mk('c-bocadejabugo','cafe',      55, 50, 'Bo de Jabugo',        'Bo de Jabugo',        'İberya jambonu + sherry.',                  'Ibérico ham + sherry.',                    '12:00–00:00', '€€'),
    mk('s-passeig',    'shopping',   50, 40, 'Passeig de Gràcia',   'Passeig de Gràcia',   'Gaudí mimarisi + lüks mağazalar.',          'Gaudí architecture + luxury stores.',      '10:00–21:00', '€€€€'),
    mk('s-boqueria',   'shopping',   52, 50, 'La Boqueria',         'La Boqueria',         'Ramblas\'da renkli yemek pazarı.',          'Colorful food market on La Rambla.',       '08:00–20:00', '€'),
    mk('s-elborn',     'shopping',   58, 55, 'El Born',             'El Born',             'Bağımsız tasarımcı butikler.',              'Indie designer boutiques.',                '11:00–21:00', '€€'),
    mk('g-macba',      'gallery',    48, 50, 'MACBA',               'MACBA',               'Çağdaş Katalan sanatı.',                    'Contemporary Catalan art.',                '10:00–20:00', '€'),
    mk('g-cccb',       'gallery',    48, 49, 'CCCB',                'CCCB',                'Kültür + çağdaş tartışma merkezi.',          'Culture + contemporary debate center.',    '11:00–20:00', '€'),
  ],

  NRT: [ // Tokyo
    mk('r-sukiyabashi','restaurant', 55, 55, 'Sukiyabashi Jiro',    'Sukiyabashi Jiro',    'Belge filmle ünlenen efsane suşi.',         'Documentary-famous legendary sushi.',      '11:30–14:00', '€€€€'),
    mk('r-ichiran',    'restaurant', 50, 52, 'Ichiran Shibuya',     'Ichiran Shibuya',     'Tonkotsu ramen, tek kişilik kabinler.',     'Tonkotsu ramen in solo booths.',           '24h',          '€'),
    mk('r-tonkatsumaisen','restaurant',55,50,'Tonkatsu Maisen',     'Tonkatsu Maisen',     'Aoyama\'da kult tonkatsu.',                 'Cult tonkatsu in Aoyama.',                 '11:00–22:00', '€€'),
    mk('r-uobei',      'restaurant', 48, 53, 'Uobei Sushi',         'Uobei Sushi',         'Şinkansen ile suşi servis.',                'Sushi delivered via shinkansen rail.',     '11:00–00:00', '€'),
    mk('h-aman',       'hotel',      55, 42, 'Aman Tokyo',          'Aman Tokyo',          'Çağdaş zen tasarım, gökdelen tepesinde.',   'Contemporary zen atop a skyscraper.',      '24h',         '€€€€'),
    mk('h-andaz',      'hotel',      57, 50, 'Andaz Tokyo',         'Andaz Tokyo',         'Toranomon Hills\'te lüks.',                 'Luxury in Toranomon Hills.',               '24h',         '€€€€'),
    mk('h-trunkho',    'hotel',      52, 52, 'Trunk(Hotel)',        'Trunk(Hotel)',        'Shibuya\'da minimalist butik.',             'Minimalist boutique in Shibuya.',          '24h',         '€€€'),
    mk('m-edotokyo',   'museum',     65, 50, 'Edo-Tokyo Museum',    'Edo-Tokyo Museum',    'Tokyo\'nun 400 yıllık tarihi.',             'Tokyo\'s 400-year history.',               '09:30–17:30', '€'),
    mk('m-mori',       'museum',     50, 56, 'Mori Art Museum',     'Mori Art Museum',     'Roppongi Hills\'te çağdaş sanat.',           'Contemporary art atop Roppongi Hills.',   '10:00–22:00', '€'),
    mk('m-nezu',       'museum',     53, 48, 'Nezu Museum',         'Nezu Museum',         'Kuma Kengo\'nun zen bahçeli müzesi.',       'Kuma Kengo\'s zen-garden museum.',         '10:00–17:00', '€'),
    mk('m-teamlab',    'museum',     65, 65, 'teamLab Planets',     'teamLab Planets',     'Sürükleyici dijital sanat dünyası.',         'Immersive digital art universe.',          '09:00–22:00', '€€'),
    mk('c-blueblood',  'cafe',       50, 52, 'Blue Bottle Aoyama',  'Blue Bottle Aoyama',  'California üçüncü dalga, Tokyo şubesi.',    'California third-wave, Tokyo outpost.',    '08:00–19:00', '€'),
    mk('c-koffeemam',  'cafe',       55, 48, 'Koffee Mameya',       'Koffee Mameya',       'Kahve sommelier mağazası.',                 'A coffee sommelier shop.',                 '10:00–18:00', '€€'),
    mk('c-fuglen',     'cafe',       48, 50, 'Fuglen Tokyo',        'Fuglen Tokyo',        'Norveç filtre kahve + kokteyl.',            'Norwegian filter coffee + cocktails.',     '08:00–01:00', '€'),
    mk('s-ginza',      'shopping',   58, 48, 'Ginza',               'Ginza',               'Tokyo\'nun lüks alışveriş bölgesi.',        'Tokyo\'s luxury shopping district.',       '10:00–20:00', '€€€€'),
    mk('s-harajuku',   'shopping',   48, 50, 'Takeshita Street',    'Takeshita Street',    'Harajuku\'nun kawaii sokağı.',              'Harajuku\'s kawaii street.',               '10:00–20:00', '€'),
    mk('s-akihabara',  'shopping',   60, 48, 'Akihabara',           'Akihabara',           'Elektronik + anime kraliyet.',              'Electronics + anime kingdom.',             '10:00–22:00', '€€'),
    mk('g-21_21',      'gallery',    50, 55, '21_21 Design Sight',  '21_21 Design Sight',  'Tadao Ando + Issey Miyake galerisi.',       'Tadao Ando + Issey Miyake gallery.',       '10:00–19:00', '€'),
    mk('g-spiral',     'gallery',    52, 52, 'Spiral',              'Spiral',              'Çağdaş Japon sanat ve performans.',         'Contemporary Japanese art & performance.', '11:00–20:00', 'Free'),
  ],

  IST: [ // Istanbul
    mk('r-mikla',      'restaurant', 52, 48, 'Mikla',               'Mikla',               'Marmara\'ya bakan Türk yeni-mutfak.',       'Turkish new cuisine over the Marmara.',    '19:00–23:30', '€€€'),
    mk('r-balikci',    'restaurant', 58, 30, 'Balıkçı Sabahattin',  'Balıkçı Sabahattin',  'Sultanahmet\'te efsane balıkçı.',           'Legendary fish house in Sultanahmet.',     '12:00–00:00', '€€'),
    mk('r-cibaliis',   'restaurant', 50, 45, 'Çibalikapı Balıkçısı','Çibalikapı Balıkçısı','Haliç manzaralı meyhane.',                  'Meyhane with Golden Horn view.',           '12:00–01:00', '€€'),
    mk('r-karakoylok', 'restaurant', 52, 50, 'Karaköy Lokantası',   'Karaköy Lokantası',   'Türk klasiği, mavi-beyaz tasarım.',          'Turkish classics, blue tile design.',      '12:00–00:00', '€€'),
    mk('h-pera',       'hotel',      52, 48, 'Pera Palace',         'Pera Palace',         'Agatha Christie\'nin kaldığı yer.',         'Where Agatha Christie stayed.',            '24h',         '€€€€'),
    mk('h-fourseasons','hotel',      58, 30, 'Four Seasons Bosphorus','Four Seasons Bosphorus','Boğaz kenarı Osmanlı sarayı.',       'Ottoman palace on the Bosphorus.',         '24h',         '€€€€'),
    mk('h-soho',       'hotel',      52, 50, 'Soho House',          'Soho House',          'Galata\'da üye kulübü.',                    'Members club in Galata.',                  '24h',         '€€€€'),
    mk('m-topkapi',    'museum',     58, 28, 'Topkapı Sarayı',      'Topkapı Palace',      'Osmanlı padişah sarayı.',                   'Ottoman sultans\' palace.',                '09:00–18:00', '€'),
    mk('m-ayasofya',   'museum',     58, 30, 'Ayasofya',            'Hagia Sophia',        '1500 yıllık imparatorluk anıtı.',           '1500-year imperial monument.',             '24h',         'Free'),
    mk('m-arkeoloji',  'museum',     56, 30, 'Arkeoloji Müzesi',    'Archaeology Museum',  'Klasik antik dönem hazineleri.',            'Classical antiquity treasures.',           '09:00–18:00', '€'),
    mk('m-istanbulmod','museum',     52, 50, 'İstanbul Modern',     'Istanbul Modern',     'Tadao Ando\'nun yeniden tasarımı, Boğaz.',  'Tadao Ando redesign on the strait.',       '10:00–18:00', '€'),
    mk('c-mandabatmaz','cafe',       52, 48, 'Mandabatmaz',         'Mandabatmaz',         'Beyoğlu\'nda klasik Türk kahvesi.',         'Classic Turkish coffee in Beyoğlu.',       '10:00–22:00', '€'),
    mk('c-karabatak',  'cafe',       52, 50, 'Karabatak',           'Karabatak',           'Galata\'da specialty kahve.',               'Specialty coffee in Galata.',              '08:30–18:00', '€'),
    mk('c-mitanis',    'cafe',       58, 30, 'Mitanis Lokumcusu',   'Mitanis Lokumcusu',   'El yapımı lokum + Türk kahvesi.',           'Handmade lokum + Turkish coffee.',         '09:00–19:00', '€'),
    mk('s-kapalicarsi','shopping',   56, 32, 'Kapalıçarşı',         'Grand Bazaar',        'Dünyanın en eski kapalı çarşısı.',          'The world\'s oldest covered market.',      '09:00–19:00', '€€'),
    mk('s-istinye',    'shopping',   60, 18, 'İstinye Park',        'İstinye Park',        'Avrupa yakası lüks alışveriş.',             'European side luxury shopping.',           '10:00–22:00', '€€€€'),
    mk('s-bagdat',     'shopping',   72, 65, 'Bağdat Caddesi',      'Bağdat Caddesi',      'Anadolu yakası alışveriş arteri.',          'Asian-side shopping artery.',              '10:00–22:00', '€€'),
    mk('g-pilevneli',  'gallery',    52, 50, 'Pilevneli',           'Pilevneli',           'Dolapdere\'de çağdaş galeri.',              'Contemporary gallery in Dolapdere.',       '10:00–19:00', 'Free'),
    mk('g-arter',      'gallery',    52, 50, 'Arter',               'Arter',               'Vehbi Koç Vakfı çağdaş sanat.',             'Vehbi Koç Foundation contemporary art.',   '11:00–20:00', '€'),
  ],

  AMS: [ // Amsterdam
    mk('r-degouden',   'restaurant', 55, 50, 'De Gouden Reael',     'De Gouden Reael',     'Westelijke kanal-altın yapısında.',          'In the golden Westelijke canal house.',    '12:00–22:30', '€€€'),
    mk('r-foodhallen', 'restaurant', 40, 55, 'Foodhallen',          'Foodhallen',          '20+ stand, tramvay deposu içinde.',          '20+ stalls in a former tram depot.',       '11:30–23:30', '€'),
    mk('r-cafe-de-jaren','restaurant',55,50, 'Café de Jaren',       'Café de Jaren',       'Kanal terasıyla klasik café.',              'Classic café with canal terrace.',         '10:00–01:00', '€'),
    mk('r-bordewijk',  'restaurant', 50, 55, 'Bordewijk',           'Bordewijk',           'Çekirdek lokal sevgilisi, mevsimsel mutfak.','Local-favorite seasonal cooking.',         '18:00–23:00', '€€€'),
    mk('h-dylan',      'hotel',      52, 52, 'The Dylan',           'The Dylan',           'Keizersgracht\'ta kanal evi otel.',         'Canal-house hotel on Keizersgracht.',      '24h',         '€€€€'),
    mk('h-pulitzer',   'hotel',      48, 50, 'Pulitzer',            'Pulitzer',            '25 birleşik 17. yy kanal evi.',             '25 joined 17th-c. canal houses.',          '24h',         '€€€€'),
    mk('h-zoku',       'hotel',      62, 55, 'Zoku',                'Zoku',                'Tasarım odaklı uzun süreli konaklama.',     'Design-led extended stay.',                '24h',         '€€€'),
    mk('m-rijks',      'museum',     50, 58, 'Rijksmuseum',         'Rijksmuseum',         'Rembrandt\'ın Gece Nöbeti.',                'Rembrandt\'s Night Watch.',                '09:00–17:00', '€'),
    mk('m-vangogh',    'museum',     48, 60, 'Van Gogh Museum',     'Van Gogh Museum',     'Dünyanın en büyük Van Gogh koleksiyonu.',   'World\'s largest Van Gogh collection.',    '09:00–18:00', '€€'),
    mk('m-anne',       'museum',     50, 52, 'Anne Frank House',    'Anne Frank House',    'Saklanma yıllarının evi.',                  'House from her years in hiding.',          '09:00–22:00', '€'),
    mk('m-stedelijk',  'museum',     50, 60, 'Stedelijk',           'Stedelijk',           'Modern ve çağdaş sanat.',                   'Modern and contemporary art.',             '10:00–18:00', '€€'),
    mk('c-cafedejordaan','cafe',     45, 50, 'Café \'t Smalle',     'Café \'t Smalle',     '1786\'dan kalan kanal café.',               'Canal café since 1786.',                   '10:00–01:00', '€'),
    mk('c-cottoncake', 'cafe',       48, 60, 'Cotton Cake',         'Cotton Cake',         'De Pijp\'te tasarımcı brunch.',             'Designer brunch in De Pijp.',              '09:00–18:00', '€'),
    mk('c-publiek',    'cafe',       55, 50, 'Café Publiek',        'Café Publiek',        'Specialty kahve, sade dekor.',               'Specialty coffee, minimal decor.',         '08:00–18:00', '€'),
    mk('s-9straatjes', 'shopping',   45, 52, 'De 9 Straatjes',      'De 9 Straatjes',      'Kanal kavşakta butik 9 sokak.',             'Boutique 9 streets across canals.',        '10:00–18:00', '€€'),
    mk('s-pcholt',     'shopping',   42, 58, 'P.C. Hooftstraat',    'P.C. Hooftstraat',    'Lüks marka caddesi.',                       'Luxury brand boulevard.',                  '10:00–19:00', '€€€€'),
    mk('s-albert',     'shopping',   48, 62, 'Albert Cuypmarkt',    'Albert Cuypmarkt',    'Hollanda\'nın en büyük açık hava pazarı.',  'Holland\'s largest outdoor market.',       '09:30–17:00', '€'),
    mk('g-foam',       'gallery',    52, 55, 'Foam',                'Foam',                'Fotoğraf müzesi.',                          'Photography museum.',                      '10:00–18:00', '€'),
    mk('g-eyefilm',    'gallery',    60, 38, 'Eye Filmmuseum',      'Eye Filmmuseum',      'Mimarlık simgesi sinema müzesi.',           'Iconic architecture film museum.',         '10:00–22:00', '€'),
  ],

  JFK: [ // New York
    mk('r-katzs',      'restaurant', 50, 50, 'Katz\'s Delicatessen', 'Katz\'s Delicatessen','1888\'den pastırma sandviçi.',              'Pastrami since 1888.',                     '08:00–22:45', '€€'),
    mk('r-lebernardin','restaurant', 47, 40, 'Le Bernardin',        'Le Bernardin',        '3 Michelin yıldızlı deniz mahsulü.',         '3 Michelin star seafood.',                 '12:00–22:30', '€€€€'),
    mk('r-shake',      'restaurant', 50, 45, 'Shake Shack Madison', 'Shake Shack Madison', 'New York\'un kult burgeri.',                'NYC\'s cult burger.',                       '11:00–23:00', '€'),
    mk('r-josephleonard','restaurant',45,50, 'Joseph Leonard',      'Joseph Leonard',      'West Village klasik American.',             'West Village classic American.',           '08:00–23:00', '€€'),
    mk('h-plaza',      'hotel',      48, 38, 'The Plaza',           'The Plaza',           'Central Park\'a karşı Belle Époque.',       'Belle Époque facing Central Park.',        '24h',         '€€€€'),
    mk('h-ace',        'hotel',      48, 46, 'Ace Hotel NY',        'Ace Hotel NY',        'NoMad\'da hipster tasarım.',                'Hipster design in NoMad.',                 '24h',         '€€€'),
    mk('h-marlton',    'hotel',      45, 50, 'The Marlton',         'The Marlton',         'West Village butik klasiği.',               'West Village boutique classic.',           '24h',         '€€€'),
    mk('m-met',        'museum',     53, 32, 'The Met',             'The Met',             'Dünyanın en büyük sanat müzesi.',           'World\'s largest art museum.',             '10:00–17:00', '€'),
    mk('m-moma',       'museum',     50, 38, 'MoMA',                'MoMA',                'Modern sanatın merkezi.',                   'The heart of modern art.',                 '10:30–17:30', '€'),
    mk('m-guggenheim', 'museum',     53, 28, 'Guggenheim',          'Guggenheim',          'Wright\'ın spiral müzesi.',                 'Wright\'s spiral museum.',                 '10:00–17:30', '€'),
    mk('m-whitney',    'museum',     45, 50, 'Whitney',             'Whitney',             'Çağdaş Amerikan sanat.',                    'Contemporary American art.',               '10:30–18:00', '€'),
    mk('c-irvingfarm', 'cafe',       48, 48, 'Irving Farm',         'Irving Farm',         'Hudson Valley kavrulmuş kahve.',            'Hudson Valley roasted coffee.',            '07:00–19:00', '€'),
    mk('c-russ',       'cafe',       52, 50, 'Russ & Daughters',    'Russ & Daughters',    'Bagel + lox, 1914\'ten beri.',              'Bagel + lox since 1914.',                  '08:00–17:00', '€'),
    mk('c-toby',       'cafe',       45, 56, 'Toby\'s Estate',      'Toby\'s Estate',      'Williamsburg specialty kahve.',             'Williamsburg specialty coffee.',           '07:00–20:00', '€'),
    mk('s-fifth',      'shopping',   50, 38, 'Fifth Avenue',        'Fifth Avenue',        'Manhattan\'ın amiral caddesi.',             'Manhattan\'s flagship avenue.',            '10:00–21:00', '€€€€'),
    mk('s-soho',       'shopping',   50, 52, 'SoHo',                'SoHo',                'Cast-iron mağazalar + dökme demir.',        'Cast-iron stores + boutiques.',            '11:00–20:00', '€€€'),
    mk('s-chelsea',    'shopping',   46, 45, 'Chelsea Market',      'Chelsea Market',      'Kapalı yemek + alışveriş kompleksi.',       'Indoor food + shopping complex.',          '07:00–23:00', '€€'),
    mk('g-newmuseum',  'gallery',    52, 52, 'New Museum',          'New Museum',          'Sano-Sanaa tasarımı.',                      'SANAA design.',                             '11:00–18:00', '€'),
    mk('g-davidzwirner','gallery',   46, 45, 'David Zwirner',       'David Zwirner',       'Chelsea\'de ünlü ticari galeri.',           'Famed Chelsea gallery.',                   '10:00–18:00', 'Free'),
  ],

  // Fallback for cities we haven't detailed yet — small set so the UI still works.
  // (Used by getDestPois when the city code isn't in DEST_POIS above.)
  __GENERIC__: [
    mk('gen-r1', 'restaurant', 52, 52, 'Yerel Restoran',    'Local Restaurant',    'Şehir merkezinde sevilen bir lokanta.', 'A local favorite in the city center.', '12:00–23:00', '€€'),
    mk('gen-r2', 'restaurant', 48, 50, 'Geleneksel Mutfak', 'Traditional Kitchen', 'Bölgenin klasik tariflerini sunan mekan.', 'Classic regional recipes.', '12:00–23:00', '€€'),
    mk('gen-h1', 'hotel',      55, 45, 'Şehir Oteli',      'City Hotel',         'Merkezi konumda 4 yıldız.',            'Centrally-located 4-star.',           '24h',         '€€€'),
    mk('gen-h2', 'hotel',      50, 45, 'Butik Otel',       'Boutique Hotel',     'Tasarım odaklı küçük otel.',           'Small design-led hotel.',             '24h',         '€€€€'),
    mk('gen-m1', 'museum',     52, 48, 'Şehir Müzesi',     'City Museum',        'Yerel tarih ve sanat.',                 'Local history and art.',              '09:00–18:00', '€'),
    mk('gen-c1', 'cafe',       50, 52, 'Şehir Kafesi',     'City Café',          'Specialty kahve ve tatlı.',             'Specialty coffee and pastries.',      '08:00–20:00', '€'),
    mk('gen-s1', 'shopping',   52, 50, 'Ana Cadde',        'Main Street',        'Şehrin ana alışveriş bölgesi.',         'The city\'s main shopping district.', '10:00–21:00', '€€'),
    mk('gen-g1', 'gallery',    48, 52, 'Çağdaş Galeri',    'Contemporary Gallery','Yerel sanatçılar.',                    'Local artists.',                       '11:00–19:00', 'Free'),
  ],
};

function getDestPois(code) {
  return DEST_POIS[code] || DEST_POIS.__GENERIC__;
}

Object.assign(window, { POI_CATEGORIES, DEST_POIS, getDestPois });
