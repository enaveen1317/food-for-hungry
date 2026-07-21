import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useApp } from '../context/AppContext';
import { Search, MapPin, AlertCircle, Building2, User, Package, Navigation2, Filter } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '20px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
};

const defaultCenter = { lat: 13.0827, lng: 80.2707 }; // Chennai

const MARKER_ICONS = {
  ngo: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  volunteer: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  donor: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
  task: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
  sos: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
};

const PlacesSearch = ({ onSelect }) => {
  const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: 'in' } }
  });

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onSelect({ lat, lng });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="search-box" style={{ position: 'relative', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '8px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <Search size={18} color="#64748B" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          placeholder="Search district or area..."
          style={{ border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '0.95rem' }}
        />
      </div>
      {status === 'OK' && (
        <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, listStyle: 'none', padding: '8px 0', marginTop: '4px' }}>
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const HungerHeatmap = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  const { ngos, volunteers, donations, requests, tasks } = useApp();

  const [center, setCenter] = useState(defaultCenter);
  const [selectedMarker, setSelectedMarker] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    ngos: true,
    volunteers: true,
    donors: true,
    tasks: true,
    sos: true
  });

  const toggleFilter = (key) => setFilters(prev => ({ ...prev, [key]: !prev[key] }));

  // Parse Live Data
  const mapData = useMemo(() => {
    let data = [];
    
    if (filters.ngos) {
      ngos.forEach(ngo => {
        if (ngo.lat && ngo.lng) data.push({ ...ngo, type: 'ngo', lat: ngo.lat, lng: ngo.lng });
      });
    }

    if (filters.volunteers) {
      volunteers.forEach(vol => {
        if (vol.lat && vol.lng) data.push({ ...vol, type: 'volunteer', lat: vol.lat, lng: vol.lng });
      });
    }

    if (filters.donors) {
      donations.filter(d => d.progress < 5).forEach(don => {
        const rLat = defaultCenter.lat + (Math.random() - 0.5) * 0.1;
        const rLng = defaultCenter.lng + (Math.random() - 0.5) * 0.1;
        data.push({ ...don, type: 'donor', lat: rLat, lng: rLng });
      });
    }

    if (filters.sos) {
      requests.forEach(req => {
        if (req.lat && req.lng) data.push({ ...req, type: 'sos', lat: req.lat, lng: req.lng });
      });
    }

    return data;
  }, [ngos, volunteers, donations, requests, filters]);

  // Directions state for active tasks
  const [directions, setDirections] = useState(null);
  const [activeRouteTask, setActiveRouteTask] = useState(null);

  const calculateRoute = useCallback((origin, destination) => {
    if (!window.google) return;
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, []);

  // When clicking a task or volunteer, show route
  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    if (marker.type === 'volunteer') {
      const task = tasks.find(t => t.volunteer_name === marker.name && t.status === 'active');
      if (task) {
        calculateRoute({ lat: marker.lat, lng: marker.lng }, { lat: marker.lat + 0.05, lng: marker.lng + 0.05 });
        setActiveRouteTask(task);
      } else {
        setDirections(null);
        setActiveRouteTask(null);
      }
    } else {
      setDirections(null);
      setActiveRouteTask(null);
    }
  };

  if (loadError) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Error loading Google Maps. Please check your API Key.</div>;
  if (!isLoaded) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Live Map...</div>;

  return (
    <div className="screen-fit-section" style={{ background: '#F8FAFC', padding: '40px 0', minHeight: '100vh' }}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '2rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Navigation2 size={32} color="var(--primary)" /> Live Map
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '8px' }}>Real-time operations, logistics, and hunger hotspots.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, maxWidth: '500px' }}>
            <PlacesSearch onSelect={(coords) => setCenter(coords)} />
          </div>
        </div>

        <div className="grid-main-aside" style={{ alignItems: 'start', gridTemplateColumns: '1fr 300px' }}>
          
          {/* MAP */}
          <div style={{ position: 'relative' }}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={11}
              options={{ disableDefaultUI: false, mapTypeControl: false, streetViewControl: false }}
            >
              {mapData.map((marker, i) => (
                <Marker
                  key={`${marker.type}-${marker.id || i}`}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  icon={MARKER_ICONS[marker.type]}
                  onClick={() => handleMarkerClick(marker)}
                />
              ))}

              {filters.sos && requests.map((req, i) => req.lat && req.lng && (
                <Circle
                  key={`circle-${req.id || i}`}
                  center={{ lat: req.lat, lng: req.lng }}
                  radius={req.people_count > 50 ? 5000 : req.people_count > 20 ? 3000 : 1500}
                  options={{
                    fillColor: req.urgent ? '#DC2626' : '#EA580C',
                    fillOpacity: 0.35,
                    strokeColor: req.urgent ? '#DC2626' : '#EA580C',
                    strokeWeight: 1,
                  }}
                />
              ))}

              {directions && (
                <DirectionsRenderer directions={directions} options={{ suppressMarkers: true, polylineOptions: { strokeColor: '#4F46E5', strokeWeight: 5 } }} />
              )}

              {selectedMarker && (
                <InfoWindow
                  position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div style={{ padding: '8px', minWidth: '200px' }}>
                    {selectedMarker.type === 'ngo' && (
                      <>
                        <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><Building2 size={16}/> {selectedMarker.name}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{selectedMarker.address}</p>
                      </>
                    )}
                    {selectedMarker.type === 'volunteer' && (
                      <>
                        <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16}/> {selectedMarker.name}</h4>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 'bold', color: selectedMarker.status === 'Available' ? 'green' : 'orange' }}>{selectedMarker.status}</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>ID: {selectedMarker.volunteer_id}</p>
                        {activeRouteTask && <div style={{ marginTop: '10px', padding: '8px', background: '#EEF2FF', borderRadius: '6px', fontSize: '12px' }}>
                          <strong>Active Task:</strong> {activeRouteTask.food}
                        </div>}
                      </>
                    )}
                    {selectedMarker.type === 'donor' && (
                      <>
                        <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><Package size={16}/> {selectedMarker.donor || 'Donor'}</h4>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px' }}><strong>Food:</strong> {selectedMarker.food} ({selectedMarker.qty})</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{selectedMarker.address}</p>
                      </>
                    )}
                    {selectedMarker.type === 'sos' && (
                      <>
                        <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626' }}><AlertCircle size={16}/> {selectedMarker.name}</h4>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 'bold' }}>Needs food for {selectedMarker.people_count} people</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{selectedMarker.loc}</p>
                      </>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>

            {/* Directions Floating Panel */}
            {directions && activeRouteTask && (
              <div style={{
                position: 'absolute', bottom: '24px', left: '24px', background: 'white', padding: '16px 20px', 
                borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 10
              }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '0.9rem' }}>Delivery in Progress</p>
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#475569' }}>
                  <span><strong>ETA:</strong> {directions.routes[0].legs[0].duration.text}</span>
                  <span><strong>Dist:</strong> {directions.routes[0].legs[0].distance.text}</span>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR FILTERS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={20} color="#4F46E5" /> Map Filters
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { key: 'sos', label: 'Hunger Zones / SOS', color: '#DC2626', icon: MARKER_ICONS.sos, count: requests.length },
                  { key: 'ngos', label: 'NGO Centers', color: '#16A34A', icon: MARKER_ICONS.ngo, count: ngos.length },
                  { key: 'volunteers', label: 'Active Volunteers', color: '#2563EB', icon: MARKER_ICONS.volunteer, count: volunteers.length },
                  { key: 'donors', label: 'Pending Donations', color: '#EA580C', icon: MARKER_ICONS.donor, count: donations.filter(d => d.progress < 5).length }
                ].map(f => (
                  <label key={f.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '8px', borderRadius: '8px', background: filters[f.key] ? '#F8FAFC' : 'transparent', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input 
                        type="checkbox" 
                        checked={filters[f.key]} 
                        onChange={() => toggleFilter(f.key)}
                        style={{ width: '18px', height: '18px', accentColor: f.color }}
                      />
                      <img src={f.icon} alt={f.label} style={{ width: '20px', height: '20px' }} />
                      <span style={{ fontSize: '0.95rem', fontWeight: filters[f.key] ? 600 : 400, color: '#334155' }}>{f.label}</span>
                    </div>
                    <span style={{ background: '#E2E8F0', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', color: '#475569' }}>
                      {f.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', borderRadius: '20px', padding: '24px', color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px', color: '#F8FAFC' }}>Live Network Status</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '12px' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Network Latency</span>
                <span style={{ fontWeight: 600, color: '#4ADE80' }}>12ms (Syncing)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Active Connects</span>
                <span style={{ fontWeight: 600 }}>{volunteers.length + ngos.length + requests.length} Nodes</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default HungerHeatmap;
