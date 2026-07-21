import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer, InfoWindow, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '380px',
  zIndex: 0
};

const defaultCenter = { lat: 13.0827, lng: 80.2707 };

const LOCATION_COORDS = {
  'Anna Nagar':       { lat: 13.0850, lng: 80.2101 },
  'T. Nagar':         { lat: 13.0418, lng: 80.2341 },
  'T Nagar':          { lat: 13.0418, lng: 80.2341 },
  'Adyar':            { lat: 13.0067, lng: 80.2571 },
  'Velachery':        { lat: 12.9815, lng: 80.2180 },
  'Tambaram':         { lat: 12.9249, lng: 80.1000 },
  'Porur':            { lat: 13.0380, lng: 80.1573 },
  'Perambur':         { lat: 13.1118, lng: 80.2330 },
  'Hope Shelter':     { lat: 13.0720, lng: 80.2350 },
  'Central Depot':    { lat: 13.0826, lng: 80.2752 },
};

function getCoords(locationStr) {
  if (!locationStr) return defaultCenter;
  for (const [key, val] of Object.entries(LOCATION_COORDS)) {
    if (locationStr.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return {
    lat: 13.0827 + (locationStr.length * 0.001),
    lng: 80.2707 + (locationStr.length * 0.001)
  };
}

const FleetLiveMap = ({
  pickupLocation,
  dropLocation,
  driverLat,
  driverLng,
  driverName = 'Rahul S.',
  driverTier = 'Gold',
  driverStatus = 'Delivering',
  gpsTrail = [], 
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [directions, setDirections] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);

  const startLoc = useMemo(() => pickupLocation ? getCoords(pickupLocation) : null, [pickupLocation]);
  const endLoc = useMemo(() => dropLocation ? getCoords(dropLocation) : null, [dropLocation]);
  const driverLoc = useMemo(() => {
    if (driverLat && driverLng) return { lat: driverLat, lng: driverLng };
    if (startLoc) return startLoc;
    return defaultCenter;
  }, [driverLat, driverLng, startLoc]);

  const mapCenter = driverLoc;

  const directionsCallback = useCallback((result, status) => {
    if (status === 'OK' && result) {
      setDirections(result);
    }
  }, []);

  const mapTrail = useMemo(() => gpsTrail.map(t => ({ lat: t[0], lng: t[1] })), [gpsTrail]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) {
    return (
      <div style={{
        flex:1, minHeight:'380px', background:'linear-gradient(135deg,#f0fdf4,#eff6ff)',
        display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'14px',
      }}>
        <div style={{
          width:'44px', height:'44px', border:'4px solid #16a34a', borderTopColor:'transparent',
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
    <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={13}>
      {startLoc && endLoc && (
        <DirectionsService
          options={{
            destination: endLoc,
            origin: startLoc,
            travelMode: 'DRIVING'
          }}
          callback={directionsCallback}
        />
      )}

      {directions && (
        <DirectionsRenderer
          options={{
            directions: directions,
            suppressMarkers: false,
            polylineOptions: { strokeColor: '#16a34a', strokeWeight: 5 }
          }}
        />
      )}

      {mapTrail.length > 0 && (
        <Polyline path={mapTrail} options={{ strokeColor: '#f59e0b', strokeWeight: 3 }} />
      )}

      <Marker
        position={driverLoc}
        label="🚴"
        onClick={() => setActiveMarker('driver')}
      />

      {activeMarker === 'driver' && (
        <InfoWindow position={driverLoc} onCloseClick={() => setActiveMarker(null)}>
          <div style={{ fontFamily: 'Poppins', minWidth: '160px', padding: '4px' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>🚴 {driverName}</div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{driverTier} Tier</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{driverStatus}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              📍 {driverLoc.lat.toFixed(5)}, {driverLoc.lng.toFixed(5)}
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default FleetLiveMap;
