import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '260px',
  borderRadius: '0 0 20px 20px'
};

const defaultCenter = { lat: 13.0827, lng: 80.2707 };

// Fallback lookup if geocoding fails or isn't used
const LOCATION_COORDS = {
  'Anna Nagar':       { lat: 13.0850, lng: 80.2101 },
  'T. Nagar':         { lat: 13.0418, lng: 80.2341 },
  'Adyar':            { lat: 13.0067, lng: 80.2571 },
  'Tambaram':         { lat: 12.9249, lng: 80.1000 },
  'Porur':            { lat: 13.0380, lng: 80.1573 },
  'Perambur':         { lat: 13.1118, lng: 80.2330 },
  'Hope Shelter':     { lat: 13.0720, lng: 80.2350 },
  'Central Station':  { lat: 13.0826, lng: 80.2752 },
};

function getCoords(locationString) {
  if (!locationString) return defaultCenter;
  const lower = locationString.toLowerCase();
  for (const [key, val] of Object.entries(LOCATION_COORDS)) {
    if (lower.includes(key.toLowerCase())) return val;
  }
  // pseudo-random fallback based on string length
  return {
    lat: 13.0827 + (locationString.length * 0.001),
    lng: 80.2707 + (locationString.length * 0.001)
  };
}

const LiveMap = ({
  pickupLocation,
  dropLocation,
  status = 'active',     // 'active' | 'pickup' | 'awaiting'
  mode = 'volunteer',    // 'volunteer' | 'fleet'
  volunteers = [],
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [directions, setDirections] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const startLoc = useMemo(() => getCoords(pickupLocation), [pickupLocation]);
  const endLoc = useMemo(() => getCoords(dropLocation), [dropLocation]);

  const directionsCallback = useCallback((result, statusStr) => {
    if (statusStr === 'OK' && result) {
      setDirections(result);
    }
  }, []);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return (
      <div style={{
        flex: 1, minHeight: '260px', background: 'linear-gradient(135deg,#e0f2fe,#e8f5e9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
      }}>
        <div style={{
          width: '40px', height: '40px', border: '4px solid #16a34a',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: '#16a34a', fontFamily: 'Poppins', fontWeight: 600 }}>Loading Google Maps…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (mode === 'fleet') {
    const center = volunteers.length > 0 ? getCoords(volunteers[0].area) : defaultCenter;

    return (
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {volunteers.map((v, i) => {
          const coords = getCoords(v.area);
          return (
            <Marker 
              key={i} 
              position={coords} 
              label={v.status === 'On delivery' ? '🚴' : '✅'}
              onClick={() => setSelectedVolunteer(v)}
            />
          );
        })}
        {selectedVolunteer && (
          <InfoWindow
            position={getCoords(selectedVolunteer.area)}
            onCloseClick={() => setSelectedVolunteer(null)}
          >
            <div>
              <b>{selectedVolunteer.name}</b><br/>
              📍 {selectedVolunteer.area}<br/>
              <span style={{ fontSize: '12px', color: '#666' }}>{selectedVolunteer.status}</span>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    );
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={startLoc} zoom={13}>
      <DirectionsService
        options={{
          destination: endLoc,
          origin: startLoc,
          travelMode: 'DRIVING'
        }}
        callback={directionsCallback}
      />

      {directions && (
        <DirectionsRenderer
          options={{
            directions: directions,
            suppressMarkers: false,
            polylineOptions: { strokeColor: '#16a34a', strokeWeight: 5 }
          }}
        />
      )}
      
      {/* Animated Volunteer Marker Simulation (Static for now on Directions) */}
      {status === 'pickup' && (
        <Marker 
          position={startLoc} 
          icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/cycling.png' }}
        />
      )}
    </GoogleMap>
  );
};

export default LiveMap;
