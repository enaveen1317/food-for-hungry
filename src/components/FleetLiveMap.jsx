import React, { useEffect, useRef, useState } from 'react';

const LOCATION_COORDS = {
  'Anna Nagar':       [13.0850, 80.2101],
  'T. Nagar':         [13.0418, 80.2341],
  'T Nagar':          [13.0418, 80.2341],
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
  'Hope Shelter':     [13.0720, 80.2350],
  'Central Depot':    [13.0826, 80.2752],
  'KK Nagar':         [13.0500, 80.1950],
  'Children Home':    [13.0500, 80.1950],
  'Coimbatore':       [11.0168, 76.9558],
  'Madurai':          [9.9252, 78.1198],
  'Trichy':           [10.7905, 78.7047],
  'Salem':            [11.6643, 78.1460],
  'Tirunelveli':      [8.7139, 77.7567],
};

function getCoords(locationStr) {
  if (!locationStr) return [13.0827, 80.2707];
  for (const [key, val] of Object.entries(LOCATION_COORDS)) {
    if (locationStr.toLowerCase().includes(key.toLowerCase())) return val;
  }
  const hash = (locationStr.length * 13 + locationStr.charCodeAt(0)) % 100;
  const hash2 = (locationStr.length * 17 + (locationStr.charCodeAt(locationStr.length - 1) || 0)) % 100;
  return [
    13.0827 + (hash / 100 - 0.5) * 0.1, 
    80.2707 + (hash2 / 100 - 0.5) * 0.1
  ];
}

const TIER_COLORS = {
  Silver: '#64748b', Gold: '#f59e0b', Platinum: '#8b5cf6', Diamond: '#3b82f6',
};

/* ── SVG marker factories ────────────────────────────────────────────────── */
function makeDriverIcon(L, tierColor = '#f59e0b', name = 'Driver') {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        filter: drop-shadow(0 4px 16px rgba(0,0,0,0.30));
      ">
        <!-- Pulsing ring -->
        <div style="
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 72px; height: 72px;
          border-radius: 50%;
          background: ${tierColor}22;
          animation: driverPulse 2s ease-in-out infinite;
        "></div>
        <!-- Avatar circle -->
        <div style="
          width: 52px; height: 52px;
          background: linear-gradient(145deg, ${tierColor}, ${tierColor}bb);
          border-radius: 50%;
          border: 3px solid white;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          position: relative; z-index: 2;
        ">🚴</div>
        <!-- Green online dot -->
        <div style="
          position: absolute; top: 2px; right: 2px;
          width: 14px; height: 14px;
          background: #22c55e; border-radius: 50%;
          border: 2px solid white; z-index: 3;
          animation: dotBlink 1.5s ease-in-out infinite;
        "></div>
        <!-- Name label -->
        <div style="
          background: white;
          color: #1e293b;
          font-family: Poppins, sans-serif;
          font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 10px;
          margin-top: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          white-space: nowrap;
          border: 1px solid rgba(0,0,0,0.07);
        ">${name}</div>
      </div>
    `,
    iconSize:    [80, 80],
    iconAnchor:  [40, 40],
    popupAnchor: [0, -50],
  });
}

function makePickupIcon(L) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        position: relative;
        display: flex; flex-direction: column; align-items: center;
        filter: drop-shadow(0 4px 12px rgba(22,163,74,0.4));
      ">
        <div style="
          width: 42px; height: 42px;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          border-radius: 50% 50% 50% 4px;
          transform: rotate(-45deg);
          border: 3px solid white;
          display: flex; align-items: center; justify-content: center;
        ">
          <div style="transform: rotate(45deg); font-size: 16px;">📦</div>
        </div>
        <div style="
          background: #16a34a; color: white;
          font-family: Poppins,sans-serif; font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 8px; margin-top: 4px;
          white-space: nowrap;
        ">Pickup</div>
      </div>
    `,
    iconSize:    [60, 70],
    iconAnchor:  [30, 48],
    popupAnchor: [0, -55],
  });
}

function makeDestIcon(L) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        position: relative;
        display: flex; flex-direction: column; align-items: center;
        filter: drop-shadow(0 4px 12px rgba(239,68,68,0.4));
      ">
        <div style="
          width: 42px; height: 42px;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          border-radius: 50% 50% 50% 4px;
          transform: rotate(-45deg);
          border: 3px solid white;
          display: flex; align-items: center; justify-content: center;
        ">
          <div style="transform: rotate(45deg); font-size: 16px;">🏠</div>
        </div>
        <div style="
          background: #dc2626; color: white;
          font-family: Poppins,sans-serif; font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 8px; margin-top: 4px;
          white-space: nowrap;
        ">Destination</div>
      </div>
    `,
    iconSize:    [60, 70],
    iconAnchor:  [30, 48],
    popupAnchor: [0, -55],
  });
}

/* ── Main FleetLiveMap ────────────────────────────────────────────────────── */
const FleetLiveMap = ({
  pickupLocation,
  dropLocation,
  driverLat,
  driverLng,
  driverName = 'Rahul S.',
  driverTier = 'Gold',
  driverStatus = 'Delivering',
  gpsTrail = [],        // array of [lat, lng] for the GPS breadcrumb trail
}) => {
  const mapRef          = useRef(null);
  const mapInstanceRef  = useRef(null);
  const driverMarkerRef = useRef(null);
  const trailPolyRef    = useRef(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [cssInjected, setCssInjected]   = useState(false);

  /* ── Load Leaflet CSS once ───────────────────────────────────────────── */
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id   = 'leaflet-css';
      link.rel  = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    /* Inject keyframe CSS for driver marker animations */
    if (!document.getElementById('fleet-map-animations')) {
      const style = document.createElement('style');
      style.id = 'fleet-map-animations';
      style.textContent = `
        @keyframes driverPulse {
          0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
          50%      { transform: translate(-50%,-50%) scale(1.5); opacity: 0; }
        }
        @keyframes dotBlink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }
      `;
      document.head.appendChild(style);
      setCssInjected(true);
    }
    const t = setTimeout(() => setLeafletReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  /* ── Build map once ──────────────────────────────────────────────────── */
  useEffect(() => {
    if (!leafletReady || !mapRef.current) return;

    import('leaflet').then(mod => {
      const L = mod.default || mod;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        driverMarkerRef.current = null;
        trailPolyRef.current = null;
      }

      const pickupCoords  = pickupLocation ? getCoords(pickupLocation) : null;
      const dropCoords    = dropLocation   ? getCoords(dropLocation)   : null;
      const driverCoords  = [
        driverLat || (pickupCoords ? pickupCoords[0] : 13.0650),
        driverLng || (pickupCoords ? pickupCoords[1] : 80.2250),
      ];

      const map = L.map(mapRef.current, {
        zoomControl: false,
        scrollWheelZoom: true,
        attributionControl: true,
        minZoom: 7,
        maxBounds: [[7.5, 75.5], [14.0, 81.0]],
        maxBoundsViscosity: 1.0
      }).setView(driverCoords, 13);
      mapInstanceRef.current = map;

      /* Add zoom control top-right */
      L.control.zoom({ position: 'topright' }).addTo(map);

      /* CartoDB Voyager tiles (clean, professional) */
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CartoDB',
        maxZoom: 19, subdomains: 'abcd',
      }).addTo(map);

      /* Fetch Tamil Nadu GeoJSON to mask outside regions */
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
              fillOpacity: 1, // Completely opaque to hide all other states
              stroke: false
            }).addTo(map);

            // The Tamil Nadu border
            L.geoJSON(geom, {
              style: { color: '#16a34a', weight: 2.5, opacity: 0.5, fill: false }
            }).addTo(map);
          }
        })
        .catch(err => console.log('Mask error:', err));

      /* Route polyline (pickup → destination) */
      if (pickupCoords && dropCoords) {
        L.polyline([pickupCoords, dropCoords], {
          color: '#16a34a', weight: 5, opacity: 0.7,
          dashArray: '14 10', lineJoin: 'round',
        }).addTo(map);

        /* Fit both markers */
        map.fitBounds([pickupCoords, dropCoords, driverCoords], { padding: [55, 55], maxZoom: 15 });

        /* Pickup marker */
        L.marker(pickupCoords, { icon: makePickupIcon(L) })
          .addTo(map)
          .bindPopup(`<b style="font-family:Poppins">📦 Pickup Point</b><br><span style="color:#64748b">${pickupLocation}</span>`);

        /* Destination marker */
        L.marker(dropCoords, { icon: makeDestIcon(L) })
          .addTo(map)
          .bindPopup(`<b style="font-family:Poppins">🏠 Destination</b><br><span style="color:#64748b">${dropLocation}</span>`);
      }

      /* GPS breadcrumb trail polyline */
      const trailPoly = L.polyline(gpsTrail.length > 0 ? gpsTrail : [driverCoords], {
        color: TIER_COLORS[driverTier] || '#f59e0b',
        weight: 3,
        opacity: 0.8,
        lineJoin: 'round',
      }).addTo(map);
      trailPolyRef.current = trailPoly;

      /* Driver marker */
      const tierColor = TIER_COLORS[driverTier] || '#f59e0b';
      const driverMarker = L.marker(driverCoords, {
        icon: makeDriverIcon(L, tierColor, driverName),
        zIndexOffset: 1000,
      }).addTo(map)
        .bindPopup(`
          <div style="font-family:Poppins;min-width:160px;padding:4px">
            <div style="font-weight:800;font-size:0.95rem;margin-bottom:4px">🚴 ${driverName}</div>
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">
              <span style="background:${tierColor}22;color:${tierColor};padding:2px 8px;border-radius:9999px;font-size:0.72rem;font-weight:700">${driverTier} Tier</span>
              <span style="background:${driverStatus === 'Delivering' ? '#fef3c7' : '#dcfce7'};color:${driverStatus === 'Delivering' ? '#b45309' : '#15803d'};padding:2px 8px;border-radius:9999px;font-size:0.72rem;font-weight:700">${driverStatus}</span>
            </div>
            <div style="font-size:0.75rem;color:#94a3b8">
              📍 ${driverLat ? driverLat.toFixed(5) : '—'}, ${driverLng ? driverLng.toFixed(5) : '—'}
            </div>
          </div>
        `);
      driverMarkerRef.current = driverMarker;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        driverMarkerRef.current = null;
        trailPolyRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafletReady, pickupLocation, dropLocation]);

  /* ── Smooth marker move on GPS update ───────────────────────────────── */
  useEffect(() => {
    if (!driverMarkerRef.current || !driverLat || !driverLng) return;

    const newLatLng = [driverLat, driverLng];
    driverMarkerRef.current.setLatLng(newLatLng);

    /* Update trail */
    if (trailPolyRef.current) {
      const latlngs = trailPolyRef.current.getLatLngs();
      latlngs.push(newLatLng);
      trailPolyRef.current.setLatLngs(latlngs);
    }

    /* Update popup content */
    const tierColor = TIER_COLORS[driverTier] || '#f59e0b';
    driverMarkerRef.current.setPopupContent(`
      <div style="font-family:Poppins;min-width:160px;padding:4px">
        <div style="font-weight:800;font-size:0.95rem;margin-bottom:4px">🚴 ${driverName}</div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">
          <span style="background:${tierColor}22;color:${tierColor};padding:2px 8px;border-radius:9999px;font-size:0.72rem;font-weight:700">${driverTier} Tier</span>
          <span style="background:${driverStatus === 'Delivering' ? '#fef3c7' : '#dcfce7'};color:${driverStatus === 'Delivering' ? '#b45309' : '#15803d'};padding:2px 8px;border-radius:9999px;font-size:0.72rem;font-weight:700">${driverStatus}</span>
        </div>
        <div style="font-size:0.75rem;color:#94a3b8">
          📍 ${driverLat.toFixed(5)}, ${driverLng.toFixed(5)}
        </div>
      </div>
    `);
  }, [driverLat, driverLng, driverStatus, driverTier, driverName]);

  /* ── Loading state ───────────────────────────────────────────────────── */
  if (!leafletReady) {
    return (
      <div style={{
        flex:1, minHeight:'380px',
        background:'linear-gradient(135deg,#f0fdf4,#eff6ff)',
        display:'flex', alignItems:'center', justifyContent:'center',
        flexDirection:'column', gap:'14px',
      }}>
        <div style={{
          width:'44px', height:'44px',
          border:'4px solid #16a34a', borderTopColor:'transparent',
          borderRadius:'50%', animation:'spin 0.7s linear infinite',
        }} />
        <p style={{ color:'#16a34a', fontFamily:'Poppins', fontWeight:700, fontSize:'0.9rem' }}>
          Connecting GPS…
        </p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div ref={mapRef} style={{ flex:1, minHeight:'380px', width:'100%', zIndex:0 }} />
  );
};

export default FleetLiveMap;
