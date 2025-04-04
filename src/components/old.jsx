import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
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
function LocationMarker() {
  const [position, setPosition] = useState<Position>(startPoint);
  const [routePoints, setRoutePoints] = useState<Position[]>([startPoint]);
  const [progress, setProgress] = useState(0);
  const map = useMap();

  const animateMovement = () => {
    let startTime = performance.now();
  
    const animateStep = (currentTime: number) => {
      const elapsedTime = currentTime - startTime; // Time elapsed since start
      const progressIncrement = Math.min(elapsedTime / 1000, 1); // Normalize (1s duration)
      const newProgress = Math.min(progress + progressIncrement * 0.05, 1);
      const newPosition = interpolatePosition(startPoint, endPoint, newProgress);
  
      setPosition(newPosition);
      setRoutePoints(prev => [...prev, newPosition]);
      setProgress(newProgress);
  
      map.panTo(newPosition, { animate: true, duration: 1 });
  
      if (newProgress < 1) {
        requestAnimationFrame(animateStep);
      }
    };
  
    requestAnimationFrame(animateStep);
  };
  
 
  

  useEffect(() => {
    // Center map on start point initially
    map.setView(position, 10);

    const animateMovement = () => {
      const startTime = performance.now();
    
      const animateStep = (currentTime: number) => {
        const elapsedTime = currentTime - startTime; // Time elapsed since start
        const progressIncrement = Math.min(elapsedTime / 1000, 1); // Normalize (1s duration)
        const newProgress = Math.min(progress + progressIncrement * 0.05, 1);
        const newPosition = interpolatePosition(startPoint, endPoint, newProgress);
    
        setPosition(newPosition);
        setRoutePoints(prev => [...prev, newPosition]);
        setProgress(newProgress);
    
        map.panTo(newPosition, { animate: true, duration: 10 });
    
        if (newProgress < 1) {
          requestAnimationFrame(animateStep);
        }
      };
    
      requestAnimationFrame(animateStep);
    };
    
    // Call this function every 10s
    const interval = setInterval(animateMovement, 10000);
    

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
        pathOptions={{ 
          color: '#3B82F6',
          weight: 4,
          opacity: 0.8,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
    </>
  );
}

function Mtrap() {
  return (
    <div className="h-full w-full">
      <MapContainer
        center={startPoint}
        zoom={10}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}

export default Mtrap;