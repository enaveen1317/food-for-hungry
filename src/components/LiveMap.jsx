import React, { useEffect, useRef, useState } from 'react';

// Chennai area coordinate lookup for known locations
const LOCATION_COORDS = {
  'Anna Nagar':       [13.0850, 80.2101],
  'T. Nagar':         [13.0418, 80.2341],
  'Adyar':            [13.0067, 80.2571],
  'Velachery':        [12.9815, 80.2180],
  'Tambaram':         [12.9249, 80.1000],
  'Porur':            [13.0380, 80.1573],
  'Perambur':         [13.1118, 80.2330],
  'Kodambakkam':      [13.0533, 80.2237],
  'Mylapore':         [13.0368, 80.2676],
  'Nungambakkam':     [13.0569, 80.2425],
  'Egmore':           [13.0732, 80.2609],
  'Guindy':           [13.0067, 80.2206],
  'Chromepet':        [12.9516, 80.1462],
  'Ambattur':         [13.1143, 80.1548],
  'Sholinganallur':   [12.9010, 80.2279],
  'OMR':              [12.9010, 80.2279],
  'Besant Nagar':     [13.0002, 80.2665],
  'Thiruvanmiyur':    [12.9827, 80.2584],
  'Kilpauk':          [13.0825, 80.2395],
  'Chetpet':          [13.0726, 80.2390],
  'Hope Shelter':     [13.0720, 80.2350],
  'Grand Hotel':      [13.0478, 80.2526],
  'Marina Beach':     [13.0500, 80.2824],
  'Central Station':  [13.0826, 80.2752],
  'Coimbatore':       [11.0168, 76.9558],
  'Madurai':          [9.9252, 78.1198],
  'Trichy':           [10.7905, 78.7047],
  'Salem':            [11.6643, 78.1460],
  'Tirunelveli':      [8.7139, 77.7567],
};

// Fuzzy match: find best coordinate from a partial string
function getCoords(locationString) {
  if (!locationString) return [13.0827, 80.2707];
  const lower = locationString.toLowerCase();
  for (const [key, val] of Object.entries(LOCATION_COORDS)) {
    if (lower.includes(key.toLowerCase())) return val;
  }
  const hash = (locationString.length * 13 + locationString.charCodeAt(0)) % 100;
  const hash2 = (locationString.length * 17 + (locationString.charCodeAt(locationString.length - 1) || 0)) % 100;
  return [
    13.0827 + (hash / 100 - 0.5) * 0.1, 
    80.2707 + (hash2 / 100 - 0.5) * 0.1
  ];
}

// ─── Custom SVG divIcons ───────────────────────────────────────────────────
function makePickupIcon(L) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:38px;height:38px;
        background:linear-gradient(135deg,#16a34a,#22c55e);
        border-radius:50% 50% 50% 4px;
        transform:rotate(-45deg);
        box-shadow:0 4px 12px rgba(22,163,74,.45);
        display:flex;align-items:center;justify-content:center;
        border:3px solid white;
      ">
        <div style="transform:rotate(45deg);font-size:14px;line-height:1;">📦</div>
      </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -42],
  });
}

function makeDropIcon(L) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:38px;height:38px;
        background:linear-gradient(135deg,#ea580c,#f97316);
        border-radius:50% 50% 50% 4px;
        transform:rotate(-45deg);
        box-shadow:0 4px 12px rgba(234,88,12,.45);
        display:flex;align-items:center;justify-content:center;
        border:3px solid white;
      ">
        <div style="transform:rotate(45deg);font-size:14px;line-height:1;">🏠</div>
      </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -42],
  });
}

function makeVolunteerIcon(L) {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;">
        <div style="
          width:44px;height:44px;
          background:linear-gradient(135deg,#1d4ed8,#3b82f6);
          border-radius:50%;
          box-shadow:0 4px 16px rgba(59,130,246,.55);
          display:flex;align-items:center;justify-content:center;
          border:3px solid white;
          font-size:20px;
          animation:none;
        ">🚴</div>
        <div style="
          position:absolute;
          top:-4px;right:-4px;
          width:14px;height:14px;
          background:#22c55e;
          border-radius:50%;
          border:2px solid white;
          box-shadow:0 0 0 3px rgba(34,197,94,.3);
        "></div>
      </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -26],
  });
}

// ─── Fleet Marker for NGO view ────────────────────────────────────────────
function makeFleetIcon(L, name, status) {
  const isActive = status === 'On delivery';
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background:${isActive ? '#f97316' : '#22c55e'};
        color:white;
        padding:4px 10px;
        border-radius:20px;
        font-size:11px;
        font-weight:700;
        font-family:Poppins,sans-serif;
        white-space:nowrap;
        box-shadow:0 2px 8px rgba(0,0,0,.2);
        border:2px solid white;
        display:flex;
        align-items:center;
        gap:5px;
      ">
        <span>${isActive ? '🚴' : '✅'}</span> ${name}
      </div>`,
    iconSize: [null, null],
    iconAnchor: [40, 14],
    popupAnchor: [0, -18],
  });
}

// ─── Interpolate between two lat/lng positions ────────────────────────────
function lerp(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

// ─── Apply Inverted Mask for Tamil Nadu ───────────────────────────────────
function applyTamilNaduMask(L, map) {
  fetch('https://nominatim.openstreetmap.org/search?state=Tamil%20Nadu&country=India&polygon_geojson=1&format=json')
    .then(res => res.json())
    .then(data => {
      if (data && data[0] && data[0].geojson) {
        const geom = data[0].geojson;
        const worldRing = [
          [90, -180], [90, 180], [-90, 180], [-90, -180]
        ];
        const rings = [worldRing];
        
        const flip = (coords) => coords.map(c => [c[1], c[0]]);

        if (geom.type === 'Polygon') {
          rings.push(flip(geom.coordinates[0]));
        } else if (geom.type === 'MultiPolygon') {
          geom.coordinates.forEach(poly => {
            rings.push(flip(poly[0]));
          });
        }

        // The inverted mask to completely hide neighboring states
        L.polygon(rings, {
          color: '#f8fafc',
          fillColor: '#f8fafc',
          fillOpacity: 1, // Completely opaque
          stroke: false
        }).addTo(map);

        // The Tamil Nadu border
        L.geoJSON(geom, {
          style: { color: '#16a34a', weight: 2.5, opacity: 0.5, fill: false }
        }).addTo(map);
      }
    })
    .catch(err => console.log('Mask error:', err));
}

// ─── Main LiveMap component ───────────────────────────────────────────────
const LiveMap = ({
  pickupLocation,
  dropLocation,
  status = 'active',     // 'active' | 'pickup' | 'awaiting'
  mode = 'volunteer',    // 'volunteer' | 'fleet'
  volunteers = [],
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const volunteerMarkerRef = useRef(null);
  const animFrameRef = useRef(null);
  const progressRef = useRef(0);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // ── Load Leaflet CSS once ──────────────────────────────────────────────
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    // Small delay to ensure CSS loaded
    const t = setTimeout(() => setLeafletLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  // ── Build / rebuild map whenever coords or mode changes ───────────────
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    import('leaflet').then((L) => {
      L = L.default || L;

      // Destroy previous instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      // ── Fleet overview mode ─────────────────────────────────────────
      if (mode === 'fleet') {
        const fleetCoords = volunteers.map(v => getCoords(v.area));
        const center = fleetCoords.length
          ? [
              fleetCoords.reduce((s, c) => s + c[0], 0) / fleetCoords.length,
              fleetCoords.reduce((s, c) => s + c[1], 0) / fleetCoords.length,
            ]
          : [13.0827, 80.2707];

        const map = L.map(mapRef.current, { 
          zoomControl: true, 
          scrollWheelZoom: true,
          minZoom: 7,
          maxBounds: [[7.5, 75.5], [14.0, 81.0]],
          maxBoundsViscosity: 1.0
        }).setView(center, 12);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 19,
        }).addTo(map);

        applyTamilNaduMask(L, map);

        volunteers.forEach((v) => {
          const coords = getCoords(v.area);
          const icon = makeFleetIcon(L, v.name, v.status);
          L.marker(coords, { icon })
            .addTo(map)
            .bindPopup(`
              <b style="font-family:Poppins">${v.name}</b><br>
              📍 ${v.area}<br>
              <span style="font-size:12px;color:#666">${v.status} · ${v.deliveries} deliveries</span>
            `);
        });
        return;
      }

      // ── Volunteer single-route mode ─────────────────────────────────
      const pickupCoords = getCoords(pickupLocation);
      const dropCoords = getCoords(dropLocation);

      const midLat = (pickupCoords[0] + dropCoords[0]) / 2;
      const midLng = (pickupCoords[1] + dropCoords[1]) / 2;

      const map = L.map(mapRef.current, { 
        zoomControl: false, 
        scrollWheelZoom: true,
        minZoom: 7,
        maxBounds: [[7.5, 75.5], [14.0, 81.0]],
        maxBoundsViscosity: 1.0
      }).setView([midLat, midLng], 13);
      mapInstanceRef.current = map;

      // OpenStreetMap tiles — Google-like style via CartoDB
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CartoDB',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      applyTamilNaduMask(L, map);

      // Route polyline (dashed green)
      const routeLine = L.polyline([pickupCoords, dropCoords], {
        color: '#16a34a',
        weight: 5,
        opacity: 0.85,
        dashArray: '12 8',
        lineJoin: 'round',
      }).addTo(map);

      // Fit view to both markers with padding
      map.fitBounds(routeLine.getBounds(), { padding: [45, 45] });

      // Pickup marker
      L.marker(pickupCoords, { icon: makePickupIcon(L) })
        .addTo(map)
        .bindPopup(`<b style="font-family:Poppins">📦 Pickup</b><br>${pickupLocation}`)
        .openPopup();

      // Drop marker
      L.marker(dropCoords, { icon: makeDropIcon(L) })
        .addTo(map)
        .bindPopup(`<b style="font-family:Poppins">🏠 Drop-off</b><br>${dropLocation}`);

      // Animated volunteer marker
      const startCoords = status === 'pickup' ? pickupCoords : pickupCoords;
      const endCoords   = status === 'pickup' ? dropCoords   : dropCoords;

      const volunteerMarker = L.marker(startCoords, { icon: makeVolunteerIcon(L), zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup(`<b style="font-family:Poppins">🚴 Rahul S.</b><br>En route · Gold Tier`);
      volunteerMarkerRef.current = volunteerMarker;

      // Animate volunteer along the route
      let progress = progressRef.current;
      const SPEED = 0.0005;

      const animate = () => {
        progress = Math.min(progress + SPEED, 0.95);
        progressRef.current = progress;
        const pos = lerp(startCoords, endCoords, progress);
        volunteerMarker.setLatLng(pos);
        animFrameRef.current = requestAnimationFrame(animate);
      };
      animFrameRef.current = requestAnimationFrame(animate);
    });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [leafletLoaded, pickupLocation, dropLocation, status, mode, volunteers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (!leafletLoaded) {
    return (
      <div style={{
        flex: 1,
        minHeight: '260px',
        background: 'linear-gradient(135deg,#e0f2fe,#e8f5e9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: '4px solid #16a34a',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: '#16a34a', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem' }}>Loading map…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        flex: 1,
        minHeight: '260px',
        width: '100%',
        zIndex: 0,
        borderRadius: '0 0 20px 20px',
      }}
    />
  );
};

export default LiveMap;
