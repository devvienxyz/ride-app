import { useMap } from 'react-leaflet';
import { useState } from 'react';

export default function SearchBox() {
  const map = useMap();
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (!query) return;
    const results = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
      .then((res) => res.json());

    console.log(results)
    if (results.length > 0) {
      const { lat, lon } = results[0];
      map.setView([parseFloat(lat), parseFloat(lon)], 16);
    }
  };

  return (
    <div className="absolute bottom-4 z-[1000] w-full flex justify-center">
      <div className="flex gap-2 bg-white border rounded-lg p-2 w-full md:w-1/4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location..."
          className="p-2 w-3/4"
        />
        <button onClick={handleSearch} className="min-w-1/5">Go</button>
      </div>
    </div>
  );
}
