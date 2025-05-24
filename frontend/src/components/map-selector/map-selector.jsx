import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';
import SearchBox from './searchbox';

// Fix default icon issues in some build setups
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function LocationSelector({ mode, setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
}

export default function PickupDropoffMap({ onChange }) {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [mode, setMode] = useState('pickup');

  const handleChange = (type, loc) => {
    if (type === 'pickup') setPickup(loc);
    else setDropoff(loc);

    onChange?.({ pickup: type === 'pickup' ? loc : pickup, dropoff: type === 'dropoff' ? loc : dropoff });
  };

  return (
    <div style={{ height: '500px' }}>
      <div style={{ marginBottom: 10 }}>
        <button
          onClick={() => setMode('pickup')}
          style={{ backgroundColor: mode === 'pickup' ? 'green' : 'lightgray', color: mode === 'pickup' ? 'white' : 'black', marginRight: 8 }}
        >
          Set Pickup
        </button>
        <button
          onClick={() => setMode('dropoff')}
          style={{ backgroundColor: mode === 'dropoff' ? 'red' : 'lightgray', color: mode === 'dropoff' ? 'white' : 'black' }}
        >
          Set Dropoff
        </button>
      </div>

      <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%' }}>
        <SearchBox />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationSelector mode={mode} setLocation={(loc) => handleChange(mode, loc)} />
        {pickup && <Marker position={pickup} />}
        {dropoff && <Marker position={dropoff} />}
      </MapContainer>
    </div>
  );
}
