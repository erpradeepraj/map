import { useEffect, useState } from 'react';
import { Map, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Sitapur coordinates
const startPoint = {
  lat: 27.5620,
  lng: 80.6820
};

// Lucknow coordinates
const endPoint = {
  lat: 26.8467,
  lng: 80.9462
};

interface Position {
  lat: number;
  lng: number;
}

function interpolatePosition(start: Position, end: Position, progress: number): Position {
  return {
    lat: start.lat + (end.lat - start.lat) * progress,
    lng: start.lng + (end.lng - start.lng) * progress
  };
}

// Component to handle map center updates
function LocationMarker({ map }: { map: any }) {
  const [position, setPosition] = useState<Position>(startPoint);
  const [routePoints, setRoutePoints] = useState<Position[]>([startPoint]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Center map on start point initially
    map.setView(startPoint, 10);

    // Update position every 3 seconds
    const interval = setInterval(() => {
      if (progress < 1) {
        const newProgress = Math.min(progress + 0.05, 1);
        const newPosition = interpolatePosition(startPoint, endPoint, newProgress);
        
        setPosition(newPosition);
        setRoutePoints(prev => [...prev, newPosition]);
        setProgress(newProgress);
        
        map.panTo(newPosition);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [map, progress]);

  return (
    <>
      {/* Start Marker */}
      <Marker 
        position={startPoint}
        icon={L.divIcon({
          className: 'custom-marker',
          html: '<div class="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })}
      />
      
      {/* Current Position Marker */}
      <Marker 
        position={position}
        icon={L.divIcon({
          className: 'custom-marker',
          html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })}
      />
      
      {/* End Marker */}
      <Marker 
        position={endPoint}
        icon={L.divIcon({
          className: 'custom-marker',
          html: '<div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })}
      />

      {/* Route Line */}
      <Polyline 
        positions={routePoints}
        color="#3B82F6"
        weight={4}
        opacity={0.8}
        lineCap="round"
        lineJoin="round"
      />
    </>
  );
}

function Map() {
  const [map, setMap] = useState(null);

  const mapRef = (ref: any) => {
    if (ref) {
      setMap(ref.leafletElement);
    }
  };

  return (
    <div className="h-full w-full">
      <Map
        center={startPoint}
        zoom={10}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={true}
        whenCreated={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {map && <LocationMarker map={map} />}
      </Map>
    </div>
  );
}

export default Map;