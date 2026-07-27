import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { LocationPoint, Driver } from '../types';

interface MapViewProps {
  origin?: LocationPoint | null;
  destination?: LocationPoint | null;
  drivers?: Driver[];
  activeDriverLocation?: { lat: number; lng: number } | null;
  height?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  origin,
  destination,
  drivers = [],
  activeDriverLocation,
  height = '100%'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map centered on Maputo, Mozambique
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-25.962, 32.5895], // Maputo Center
        zoom: 14,
        zoomControl: false
      });

      // Dark Mode TileLayer (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
      }).addTo(map);

      // Add custom zoom control in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;

    if (!markersGroup) return;
    markersGroup.clearLayers();

    const boundsPoints: L.LatLngExpression[] = [];

    // Custom Icon Creators
    const createMarkerHtml = (color: string, iconSymbol: string) => {
      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${color};
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: black;
            font-weight: bold;
            box-shadow: 0 4px 14px rgba(0,0,0,0.4);
            border: 3px solid white;
            font-size: 14px;
          ">
            ${iconSymbol}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });
    };

    // Origin Marker (Green)
    if (origin) {
      const originIcon = createMarkerHtml('#00C853', '🟢');
      const originMarker = L.marker([origin.lat, origin.lng], { icon: originIcon })
        .bindPopup(`<b>Origem</b><br/>${origin.name}`);
      markersGroup.addLayer(originMarker);
      boundsPoints.push([origin.lat, origin.lng]);
    }

    // Destination Marker (Orange)
    if (destination) {
      const destIcon = createMarkerHtml('#FF9800', '📍');
      const destMarker = L.marker([destination.lat, destination.lng], { icon: destIcon })
        .bindPopup(`<b>Destino</b><br/>${destination.name}`);
      markersGroup.addLayer(destMarker);
      boundsPoints.push([destination.lat, destination.lng]);
    }

    // Draw route line if both origin & destination exist
    if (origin && destination) {
      const polyline = L.polyline(
        [
          [origin.lat, origin.lng],
          [destination.lat, destination.lng]
        ],
        { color: '#FFB300', weight: 5, dashArray: '8, 8', opacity: 0.9 }
      );
      markersGroup.addLayer(polyline);

      // Add travel badge tooltip along route center
      const midLat = (origin.lat + destination.lat) / 2;
      const midLng = (origin.lng + destination.lng) / 2;

      const badgeIcon = L.divIcon({
        className: 'route-badge',
        html: `
          <div style="
            background: #111827;
            color: #fff;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            border: 1px solid #FFC107;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            white-space: nowrap;
          ">
            ⏱️ 7 min (2,6 km)
          </div>
        `,
        iconSize: [100, 30],
        iconAnchor: [50, 15]
      });

      L.marker([midLat, midLng], { icon: badgeIcon }).addTo(markersGroup);
    }

    // Nearby drivers / Active Driver Location
    if (activeDriverLocation) {
      const bikeIcon = L.divIcon({
        className: 'active-bike-pin',
        html: `
          <div style="
            background: #00C853;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 0 15px rgba(0,200,83,0.8);
            border: 3px solid #111827;
          " class="pulse-glow animate-float">
            🏍️
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
      const driverMarker = L.marker([activeDriverLocation.lat, activeDriverLocation.lng], { icon: bikeIcon })
        .bindPopup('<b>Seu Motorista MOTO GO está a caminho!</b>');
      markersGroup.addLayer(driverMarker);
      boundsPoints.push([activeDriverLocation.lat, activeDriverLocation.lng]);
    } else {
      drivers.forEach((drv) => {
        const bikeIcon = L.divIcon({
          className: 'driver-bike-pin',
          html: `
            <div style="
              background: #1e293b;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              border: 2px solid #00C853;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            ">
              🏍️
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        const drvMarker = L.marker([drv.lat, drv.lng], { icon: bikeIcon })
          .bindPopup(`<b>${drv.name}</b><br/>${drv.motorbike} (${drv.plate})`);
        markersGroup.addLayer(drvMarker);
      });
    }

    // Fit bounds if points exist
    if (boundsPoints.length > 0) {
      const bounds = L.latLngBounds(boundsPoints);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [origin, destination, drivers, activeDriverLocation]);

  return (
    <div className="relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
