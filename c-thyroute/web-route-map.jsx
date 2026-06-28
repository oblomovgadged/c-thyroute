// web-route-map.jsx — Leaflet (OpenStreetMap) destination map for the Rota screen.
//
// Provides:
//   CITY_CENTERS        — { code: { lat, lon, zoom } }  for ~14 popular destinations
//   poiLatLon(poi, dest)— derives lat/lon from a poi's x/y% relative to city center
//   <DestLeafletMap>    — full-bleed Leaflet map + numbered POI markers + click handler
//   useRouteEdits(code) — manages notes / deleted / custom POIs, URL-encoded
//   reverseLookup(lat, lon, lang) — Nominatim + Wikipedia summary

// ─── City centers (real coords, used to ground the POI x/y mapping) ─
const CITY_CENTERS = {
  FCO: { lat: 41.9028, lon: 12.4964, zoom: 13 }, // Rome
  CDG: { lat: 48.8566, lon: 2.3522,  zoom: 13 }, // Paris
  LHR: { lat: 51.5074, lon: -0.1278, zoom: 12 }, // London
  BCN: { lat: 41.3851, lon: 2.1734,  zoom: 13 }, // Barcelona
  NRT: { lat: 35.6762, lon: 139.6503,zoom: 12 }, // Tokyo
  AMS: { lat: 52.3676, lon: 4.9041,  zoom: 13 }, // Amsterdam
  DXB: { lat: 25.2048, lon: 55.2708, zoom: 12 }, // Dubai
  JFK: { lat: 40.7580, lon: -73.9855,zoom: 12 }, // New York (Manhattan)
  ATH: { lat: 37.9755, lon: 23.7348, zoom: 13 }, // Athens
  BKK: { lat: 13.7563, lon: 100.5018,zoom: 12 }, // Bangkok
  BER: { lat: 52.5200, lon: 13.4050, zoom: 12 }, // Berlin
  MAD: { lat: 40.4168, lon: -3.7038, zoom: 13 }, // Madrid
  IST: { lat: 41.0082, lon: 28.9784, zoom: 12 }, // Istanbul
  SAW: { lat: 40.9923, lon: 29.0244, zoom: 11 }, // Istanbul (Asian)
  AYT: { lat: 36.8969, lon: 30.7133, zoom: 12 }, // Antalya
  ADB: { lat: 38.4192, lon: 27.1287, zoom: 12 }, // Izmir
  NAV: { lat: 38.6431, lon: 34.8289, zoom: 11 }, // Nevsehir / Cappadocia
  ASR: { lat: 38.7312, lon: 35.4787, zoom: 12 }, // Kayseri
  GZT: { lat: 37.0662, lon: 37.3833, zoom: 12 }, // Gaziantep
  GNY: { lat: 37.1674, lon: 38.7955, zoom: 12 }, // Sanliurfa
  MQM: { lat: 37.3212, lon: 40.7245, zoom: 12 }, // Mardin
  ADF: { lat: 37.7648, lon: 38.2786, zoom: 11 }, // Adiyaman
  TZX: { lat: 41.0027, lon: 39.7168, zoom: 12 }, // Trabzon
  RZE: { lat: 41.0201, lon: 40.5234, zoom: 11 }, // Rize
  DLM: { lat: 36.6515, lon: 29.1225, zoom: 12 }, // Fethiye / Dalaman
  BJV: { lat: 39.1217, lon: 27.1820, zoom: 12 }, // Bergama / Bodrum
  DNZ: { lat: 37.7765, lon: 29.0864, zoom: 12 }, // Denizli / Pamukkale
  CKL: { lat: 40.1553, lon: 26.4142, zoom: 11 }, // Canakkale
  KZR: { lat: 36.1997, lon: 29.6354, zoom: 13 }, // Kas
};
function cityCenterFor(code) {
  return CITY_CENTERS[code] || { lat: 41.0082, lon: 28.9784, zoom: 12 };
}

// Convert poi.x (0–100) and poi.y (0–100) into real lat/lon offset around the
// city center. Spread ≈ ±0.04° lat (~4.4 km) and ±0.05° lon (~4 km at lat 45).
function poiLatLon(poi, code) {
  const c = cityCenterFor(code);
  // Inverse y: y=0 is top of map (north → higher lat)
  const latOffset = (50 - (poi.y || 50)) / 50 * 0.04;
  const lonOffset = ((poi.x || 50) - 50) / 50 * 0.05;
  return { lat: c.lat + latOffset, lon: c.lon + lonOffset };
}

// ─── URL state encoding (notes / deleted / custom POIs) ─────────────
// State format:
//   { v: 1, dst: 'FCO', n: { poiId: 'note' }, d: ['poiId'], c: [{ id, name, lat, lon, day, type, hours, fee, desc }] }
// Encoded with URL-safe base64 in the `route` query param. Survives reload & share.
function encodeRouteState(state) {
  try {
    const json = JSON.stringify(state);
    // URL-safe base64
    const b64 = btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return b64;
  } catch (e) { return ''; }
}
function decodeRouteState(b64) {
  try {
    if (!b64) return null;
    const std = b64.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice(0, (4 - b64.length % 4) % 4);
    const json = decodeURIComponent(escape(atob(std)));
    return JSON.parse(json);
  } catch (e) { return null; }
}
function readUrlState() {
  try {
    const params = new URLSearchParams(window.location.search);
    return decodeRouteState(params.get('route'));
  } catch (e) { return null; }
}
function writeUrlState(state) {
  try {
    const params = new URLSearchParams(window.location.search);
    if (state) params.set('route', encodeRouteState(state));
    else params.delete('route');
    const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '') + window.location.hash;
    window.history.replaceState(null, '', newUrl);
  } catch (e) {}
}

function makeShareLink(state) {
  try {
    const params = new URLSearchParams();
    params.set('route', encodeRouteState(state));
    params.set('view', 'shared');
    return window.location.origin + window.location.pathname + '?' + params.toString() + '#map';
  } catch (e) { return window.location.href; }
}

// ─── React hook: useRouteEdits ─────────────────────────────────────
// Returns { state, addNote, deleteNote, deletePoi, undeletePoi,
//           addCustom, removeCustom, reset, isDeleted, getNote, getCustomById }
function useRouteEdits(destCode) {
  const initial = React.useMemo(() => {
    const fromUrl = readUrlState();
    if (fromUrl && fromUrl.dst === destCode) return fromUrl;
    // fallback to localStorage by dst
    try {
      const raw = localStorage.getItem('thy-route-edits-' + destCode);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { v: 1, dst: destCode, n: {}, d: [], c: [] };
  }, [destCode]);
  const [state, setState] = React.useState(initial);

  // when destCode changes, re-init
  React.useEffect(() => { setState(initial); }, [destCode]);

  // persist on every change
  React.useEffect(() => {
    writeUrlState(state);
    try { localStorage.setItem('thy-route-edits-' + state.dst, JSON.stringify(state)); } catch (e) {}
  }, [state]);

  const api = React.useMemo(() => ({
    state,
    addNote: (poiId, text) => setState(s => ({ ...s, n: { ...s.n, [poiId]: text } })),
    deleteNote: (poiId) => setState(s => { const n = { ...s.n }; delete n[poiId]; return { ...s, n }; }),
    deletePoi: (poiId) => setState(s => ({ ...s, d: [...new Set([...(s.d||[]), poiId])] })),
    undeletePoi: (poiId) => setState(s => ({ ...s, d: (s.d||[]).filter(x => x !== poiId) })),
    addCustom: (poi) => setState(s => ({ ...s, c: [...(s.c||[]), poi] })),
    removeCustom: (id) => setState(s => ({ ...s, c: (s.c||[]).filter(p => p.id !== id) })),
    reset: () => setState({ v: 1, dst: destCode, n: {}, d: [], c: [] }),
    isDeleted: (poiId) => (state.d || []).includes(poiId),
    getNote: (poiId) => state.n?.[poiId] || '',
    getCustomById: (id) => (state.c || []).find(p => p.id === id),
    shareLink: () => makeShareLink(state),
    isShared: () => {
      try { return new URLSearchParams(window.location.search).get('view') === 'shared'; }
      catch (e) { return false; }
    },
  }), [state, destCode]);
  return api;
}

// ─── Reverse lookup: Nominatim + Wikipedia ─────────────────────────
async function reverseLookup(lat, lon, lang = 'tr') {
  const out = { address: '', name: '', desc: '', photo: '', wiki: '' };
  // 1) Nominatim reverse geocoding
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=${lang}&zoom=16`, {
      headers: { 'Accept': 'application/json' },
    });
    if (r.ok) {
      const j = await r.json();
      out.address = j.display_name || '';
      // Try to extract a meaningful name (tourism / amenity / road)
      const a = j.address || {};
      out.name = j.name || a.attraction || a.tourism || a.amenity || a.museum || a.building || a.road || a.suburb || a.city || a.town || '';
      if (!out.name && out.address) out.name = out.address.split(',')[0];
    }
  } catch (e) {}

  // 2) Wikipedia summary (preferred lang, fallback to EN)
  if (out.name) {
    const langs = lang === 'tr' ? ['tr', 'en'] : ['en', 'tr'];
    for (const lg of langs) {
      try {
        const r = await fetch(`https://${lg}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(out.name)}?redirect=true`);
        if (r.ok) {
          const j = await r.json();
          if (j.extract) {
            out.desc = j.extract;
            out.wiki = j.content_urls?.desktop?.page || '';
            if (j.thumbnail?.source) out.photo = j.thumbnail.source;
            break;
          }
        }
      } catch (e) {}
    }
  }
  return out;
}

// ─── Leaflet map component ─────────────────────────────────────────
// Renders OSM tiles, numbered circle pins for each POI, optional highlight
// for current day's POIs (gold ring), and an onMapClick handler for "add to
// route" UX. Click-handler is debounced — single click ignores pan/zoom.
function DestLeafletMap({
  destCode, pois, customPois = [], discoverPois = [], dayPoiIds = [],
  onPoiClick, onMapClick, openPoiId, accent,
  mapStyle = 'voyager',
}) {
  const mapRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const markersRef = React.useRef(new Map());
  const customMarkersRef = React.useRef(new Map());
  const discoverMarkersRef = React.useRef(new Map());
  const tileLayerRef = React.useRef(null);

  // create map once
  React.useEffect(() => {
    if (!window.L || !containerRef.current) return;
    const c = cityCenterFor(destCode);
    const map = window.L.map(containerRef.current, {
      center: [c.lat, c.lon], zoom: c.zoom,
      zoomControl: false, attributionControl: true,
    });
    window.L.control.zoom({ position: 'topright' }).addTo(map);
    mapRef.current = map;

    // click handler
    map.on('click', (e) => { onMapClick?.(e.latlng); });
    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // swap tile layer when style changes
  React.useEffect(() => {
    if (!mapRef.current || !window.L) return;
    if (tileLayerRef.current) tileLayerRef.current.remove();
    const layers = {
      voyager: {
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        attr: '© <a href="https://www.openstreetmap.org/">OSM</a> · © <a href="https://carto.com/">CARTO</a>',
      },
      darkmatter: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attr: '© OSM · © CARTO',
      },
      osm: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attr: '© OSM contributors',
      },
    };
    const cfg = layers[mapStyle] || layers.voyager;
    tileLayerRef.current = window.L.tileLayer(cfg.url, {
      attribution: cfg.attr, maxZoom: 19, subdomains: 'abcd',
    }).addTo(mapRef.current);
  }, [mapStyle]);

  // re-center when dest changes
  React.useEffect(() => {
    if (!mapRef.current) return;
    const c = cityCenterFor(destCode);
    mapRef.current.flyTo([c.lat, c.lon], c.zoom, { animate: true, duration: 1.2 });
  }, [destCode]);

  // Minimal Google-Maps style dot + ring — gold for today's plan, navy otherwise.
  const makeIcon = (n, active) => {
    const accentFg = (accent?.fg || '#C5A059');
    const dotColor   = active ? accentFg : '#0A1628';
    const ringColor  = active ? '#FFE9A8' : accentFg;
    const numColor   = active ? '#0A1628' : '#FFFAEC';
    const html = `
      <div style="
        position: relative; width: 22px; height: 22px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: ${dotColor};
        border: 1.5px solid ${ringColor};
        box-shadow: 0 1px 3px rgba(0,0,0,0.4), 0 0 0 3px ${active ? 'rgba(197,160,89,0.18)' : 'rgba(10,22,40,0.18)'};
        display: flex; align-items: center; justify-content: center;
        font-family: 'JetBrains Mono','DM Mono', monospace; font-weight: 800;
        font-size: ${n > 99 ? 8 : (n > 9 ? 9.5 : 10.5)}px;
        color: ${numColor};
      ">${n}</div>`;
    return window.L.divIcon({
      className: 'thy-poi-icon',
      html, iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -11],
    });
  };
  // (dot/ring makeIcon defined above)

  // render POI markers
  React.useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const map = mapRef.current;
    const dayIds = new Set(dayPoiIds);

    // POIs (built-in)
    pois.forEach((p, i) => {
      const ll = poiLatLon(p, destCode);
      const isDay = dayIds.has(p.id);
      let m = markersRef.current.get(p.id);
      if (!m) {
        m = window.L.marker([ll.lat, ll.lon], { icon: makeIcon(i + 1, isDay) }).addTo(map);
        m.on('click', () => onPoiClick?.(p.id));
        markersRef.current.set(p.id, m);
      } else {
        m.setLatLng([ll.lat, ll.lon]);
        m.setIcon(makeIcon(i + 1, isDay));
      }
    });
    // cleanup removed markers (e.g. destCode changed)
    const currentIds = new Set(pois.map(p => p.id));
    markersRef.current.forEach((mk, id) => {
      if (!currentIds.has(id)) { mk.remove(); markersRef.current.delete(id); }
    });

    // Custom (user-added) POIs — compact red dot+ring with number
    customPois.forEach((cp, i) => {
      let m = customMarkersRef.current.get(cp.id);
      const idx = i + 1;
      const html = `
        <div style="
          position: relative; width: 22px; height: 22px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: #B7312C;
          border: 1.5px solid #FFFAEC;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4), 0 0 0 3px rgba(183,49,44,0.22);
          display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', monospace; font-weight: 800;
          font-size: 10.5px; color: #FFFAEC;
        ">${idx}</div>`;
      const icon = window.L.divIcon({
        className: 'thy-poi-icon thy-poi-custom',
        html, iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -11],
      });
      if (!m) {
        m = window.L.marker([cp.lat, cp.lon], { icon }).addTo(map);
        m.on('click', () => onPoiClick?.(cp.id));
        customMarkersRef.current.set(cp.id, m);
      } else {
        m.setLatLng([cp.lat, cp.lon]); m.setIcon(icon);
      }
    });
    const customIds = new Set(customPois.map(p => p.id));
    customMarkersRef.current.forEach((mk, id) => {
      if (!customIds.has(id)) { mk.remove(); customMarkersRef.current.delete(id); }
    });

    // Discover POIs — colored icon pin, no number
    discoverPois.forEach((dp) => {
      let m = discoverMarkersRef.current.get(dp.id);
      const html = `
        <div style="
          position: relative; width: 28px; height: 28px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: ${dp.color};
          border: 2px solid #FFFAEC;
          box-shadow: 0 1px 3px rgba(0,0,0,0.5), 0 0 0 3px ${dp.color}44;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; line-height: 1;
        ">${dp.icon}</div>`;
      const icon = window.L.divIcon({
        className: 'thy-poi-icon thy-poi-discover',
        html, iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14],
      });
      if (!m) {
        m = window.L.marker([dp.lat, dp.lon], { icon }).addTo(map);
        m.on('click', () => onPoiClick?.(dp.id));
        discoverMarkersRef.current.set(dp.id, m);
      } else {
        m.setLatLng([dp.lat, dp.lon]); m.setIcon(icon);
      }
    });
    const discoverIds = new Set(discoverPois.map(p => p.id));
    discoverMarkersRef.current.forEach((mk, id) => {
      if (!discoverIds.has(id)) { mk.remove(); discoverMarkersRef.current.delete(id); }
    });
  }, [pois, customPois, discoverPois, destCode, dayPoiIds, accent, onPoiClick]);

  // fly to open POI
  React.useEffect(() => {
    if (!mapRef.current || !openPoiId) return;
    const p = pois.find(po => po.id === openPoiId);
    const cp = customPois.find(po => po.id === openPoiId);
    if (p) {
      const ll = poiLatLon(p, destCode);
      mapRef.current.flyTo([ll.lat, ll.lon], Math.max(mapRef.current.getZoom(), 15), { animate: true, duration: 0.8 });
    } else if (cp) {
      mapRef.current.flyTo([cp.lat, cp.lon], Math.max(mapRef.current.getZoom(), 15), { animate: true, duration: 0.8 });
    }
  }, [openPoiId, pois, customPois, destCode]);

  return (
    <div ref={containerRef} style={{
      position: 'absolute', inset: 0, background: '#101a2b',
    }} />
  );
}

Object.assign(window, {
  CITY_CENTERS, cityCenterFor, poiLatLon,
  encodeRouteState, decodeRouteState, readUrlState, writeUrlState, makeShareLink,
  useRouteEdits, reverseLookup, DestLeafletMap,
});
