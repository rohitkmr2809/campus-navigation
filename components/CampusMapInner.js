'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Map Recenter Component
function MapController({ center, zoom, bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 1) {
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
      } catch (e) {
        console.error('fitBounds error:', e);
      }
    } else if (center) {
      map.setView(center, zoom || 17);
    }
  }, [center, zoom, bounds, map]);

  return null;
}

// Marker Color Resolver based on campus location type
const TYPE_COLORS = {
  Gate: '#dc2626', // Red
  Department: '#2563eb', // Blue
  Library: '#059669', // Emerald
  Canteen: '#d97706', // Amber
  Hostel: '#7c3aed', // Purple
  Sports: '#16a34a', // Green
  Parking: '#475569', // Slate
  Office: '#0891b2', // Cyan
  Laboratory: '#4f46e5', // Indigo
  Classroom: '#0284c7', // Sky
  Building: '#334155', // Slate
  Other: '#64748b',
};

// Create a custom styled Leaflet DivIcon
function createMarkerIcon(loc, isStart = false, isDest = false, isSelected = false) {
  let bgColor = TYPE_COLORS[loc.type] || '#0284c7';
  let badgeText = '';

  if (isStart) {
    bgColor = '#16a34a'; // Green for start
    badgeText = 'START';
  } else if (isDest) {
    bgColor = '#dc2626'; // Red for destination
    badgeText = 'END';
  }

  const pulseRing = isSelected || isStart || isDest
    ? '<div class="absolute -inset-1 rounded-full bg-sky-400 animate-ping opacity-75"></div>'
    : '';

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group">
      ${pulseRing}
      <div style="background-color: ${bgColor}" class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold transition-transform transform group-hover:scale-110">
        ${loc.name.charAt(0)}
      </div>
      ${
        badgeText
          ? `<span class="absolute -top-3 px-1.5 py-0.5 rounded text-[9px] font-black text-white ${
              isStart ? 'bg-emerald-600' : 'bg-rose-600'
            } shadow">${badgeText}</span>`
          : ''
      }
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

export default function CampusMapInner({
  locations = [],
  routeCoordinates = [],
  selectedLocation = null,
  startLocationId = null,
  destinationLocationId = null,
  onSelectLocation = () => {},
  onSetStart = () => {},
  onSetDestination = () => {},
  height = '500px',
  center = [12.9716, 77.5946],
  zoom = 16,
}) {
  // Compute bounds if a route polyline exists
  const routeBounds = useMemo(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      return routeCoordinates.map((coord) => [coord[0], coord[1]]);
    }
    return null;
  }, [routeCoordinates]);

  // Determine effective center
  const mapCenter = useMemo(() => {
    if (selectedLocation && selectedLocation.latitude) {
      return [selectedLocation.latitude, selectedLocation.longitude];
    }
    if (locations.length > 0) {
      return [locations[0].latitude, locations[0].longitude];
    }
    return center;
  }, [selectedLocation, locations, center]);

  return (
    <div style={{ height: height, width: '100%' }} className="relative rounded-xl overflow-hidden shadow-md border border-slate-200">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          center={selectedLocation ? [selectedLocation.latitude, selectedLocation.longitude] : null}
          bounds={routeBounds}
          zoom={17}
        />

        {/* Draw shortest route polyline */}
        {routeCoordinates && routeCoordinates.length > 1 && (
          <>
            {/* Outer glow line */}
            <Polyline
              positions={routeCoordinates}
              pathOptions={{ color: '#0284c7', weight: 8, opacity: 0.4 }}
            />
            {/* Primary route line */}
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: '#2563eb',
                weight: 5,
                opacity: 0.95,
                dashArray: '8, 8',
              }}
            />
          </>
        )}

        {/* Render Location Markers */}
        {locations.map((loc) => {
          const locId = loc._id ? loc._id.toString() : loc.id;
          const isStart = startLocationId === locId;
          const isDest = destinationLocationId === locId;
          const isSelected = selectedLocation && (selectedLocation._id?.toString() === locId || selectedLocation.id === locId);

          return (
            <Marker
              key={locId}
              position={[loc.latitude, loc.longitude]}
              icon={createMarkerIcon(loc, isStart, isDest, isSelected)}
              eventHandlers={{
                click: () => onSelectLocation(loc),
              }}
            >
              <Popup className="campus-location-popup">
                <div className="p-1 min-w-[200px] text-slate-800">
                  <div className="flex items-center justify-between gap-2 border-b pb-1.5 mb-1.5">
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {loc.name}
                    </h3>
                    <span
                      style={{ backgroundColor: TYPE_COLORS[loc.type] || '#0284c7' }}
                      className="text-[10px] text-white px-2 py-0.5 rounded-full font-semibold"
                    >
                      {loc.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-1">
                    <span className="font-semibold text-slate-700">Building:</span>{' '}
                    {loc.building || 'Main'}
                  </p>

                  <p className="text-xs text-slate-600 mb-2">
                    <span className="font-semibold text-slate-700">Floor:</span>{' '}
                    {loc.floor || 'Ground'}
                  </p>

                  {loc.description && (
                    <p className="text-xs text-slate-500 italic mb-3 line-clamp-2">
                      {loc.description}
                    </p>
                  )}

                  {/* Popup Actions */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetStart(loc);
                      }}
                      className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-medium border border-emerald-200 transition-colors"
                    >
                      Set as Start
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetDestination(loc);
                      }}
                      className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-xs font-medium border border-rose-200 transition-colors"
                    >
                      Set Destination
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
