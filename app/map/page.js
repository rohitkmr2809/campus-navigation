'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CampusMap from '@/components/CampusMap';
import {
  MapPin,
  Search,
  Building,
  Layers,
  X,
  Compass,
  Navigation,
  Loader2,
} from 'lucide-react';
import { LOCATION_TYPES } from '@/lib/constants';

function MapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSelectId = searchParams.get('select');

  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch locations
  useEffect(() => {
    fetch('/api/locations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setLocations(data.data);
          setFilteredLocations(data.data);

          if (initialSelectId) {
            const matched = data.data.find(
              (l) => l._id?.toString() === initialSelectId || l.id === initialSelectId
            );
            if (matched) setSelectedLocation(matched);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [initialSelectId]);

  // Filter effect
  useEffect(() => {
    let result = [...locations];

    if (selectedType !== 'All') {
      result = result.filter((loc) => loc.type === selectedType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (loc) =>
          loc.name.toLowerCase().includes(q) ||
          loc.building.toLowerCase().includes(q) ||
          loc.description.toLowerCase().includes(q)
      );
    }

    setFilteredLocations(result);
  }, [searchQuery, selectedType, locations]);

  const handleSetStart = (loc) => {
    const locId = loc._id ? loc._id.toString() : loc.id;
    router.push(`/navigate?start=${locId}`);
  };

  const handleSetDestination = (loc) => {
    const locId = loc._id ? loc._id.toString() : loc.id;
    router.push(`/navigate?destination=${locId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-7 h-7 text-sky-600" />
            Interactive Campus Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Powered by OpenStreetMap. Click markers to inspect details or set route points.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search map..."
              className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Types ({locations.length})</option>
            {LOCATION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Leaflet Map */}
        <div className="lg:col-span-3">
          <CampusMap
            locations={filteredLocations}
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            onSetStart={handleSetStart}
            onSetDestination={handleSetDestination}
            height="620px"
          />
        </div>

        {/* Right Side: Selected Location Inspector & Quick List */}
        <div className="space-y-4">
          {selectedLocation ? (
            <div className="bg-white rounded-xl border border-sky-300 p-4 shadow-md">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    {selectedLocation.type}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {selectedLocation.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 my-3">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedLocation.building || 'Campus'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Floor: {selectedLocation.floor || 'Ground'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                  <span>Coordinates: {selectedLocation.latitude?.toFixed(4)}, {selectedLocation.longitude?.toFixed(4)}</span>
                </div>
              </div>

              {selectedLocation.description && (
                <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4 leading-relaxed">
                  {selectedLocation.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSetStart(selectedLocation)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Set Start
                </button>
                <button
                  onClick={() => handleSetDestination(selectedLocation)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Set Dest
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <Compass className="w-8 h-8 text-sky-500 mx-auto mb-2 opacity-80" />
              <h4 className="text-xs font-bold text-slate-800">
                Inspect a Location
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Click any marker on the map or choose a building from the list below.
              </p>
            </div>
          )}

          {/* Location Quick List */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 max-h-[380px] overflow-y-auto space-y-1">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase px-2 py-1 tracking-wider">
              Locations ({filteredLocations.length})
            </h4>
            {filteredLocations.map((loc) => {
              const locId = loc._id ? loc._id.toString() : loc.id;
              const isSelected = selectedLocation && (selectedLocation._id?.toString() === locId || selectedLocation.id === locId);

              return (
                <button
                  key={locId}
                  onClick={() => setSelectedLocation(loc)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-50 text-sky-800 font-bold border border-sky-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{loc.name}</span>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                    {loc.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 mb-2" />
          <p className="text-xs font-medium">Loading Map View...</p>
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
