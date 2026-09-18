'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LocationCard from '@/components/LocationCard';
import { LOCATION_TYPES } from '@/models/Location';
import {
  Building2,
  Search,
  X,
  Compass,
  Loader2,
} from 'lucide-react';

function LocationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const querySearch = searchParams.get('search') || '';

  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState(querySearch);
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/locations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setLocations(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = locations.filter((loc) => {
    const matchesType = selectedType === 'All' || loc.type === selectedType;
    const q = search.toLowerCase().trim();
    const matchesQuery =
      !q ||
      loc.name.toLowerCase().includes(q) ||
      loc.building.toLowerCase().includes(q) ||
      loc.description.toLowerCase().includes(q) ||
      loc.type.toLowerCase().includes(q);
    return matchesType && matchesQuery;
  });

  const handleNavigateHere = (loc) => {
    const locId = loc._id ? loc._id.toString() : loc.id;
    router.push(`/navigate?destination=${locId}`);
  };

  const handleViewOnMap = (loc) => {
    const locId = loc._id ? loc._id.toString() : loc.id;
    router.push(`/map?select=${locId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-600" />
            Campus Location Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse and search academic blocks, administrative offices, laboratories, and student facilities.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search directory..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedType('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedType === 'All'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Locations ({locations.length})
        </button>
        {LOCATION_TYPES.map((type) => {
          const count = locations.filter((l) => l.type === type).length;
          if (count === 0) return null;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === type
                  ? 'bg-sky-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {type} ({count})
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Showing {filtered.length} of {locations.length} campus facilities
        </span>
      </div>

      {/* Locations Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Loading campus directory...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No matching locations</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or selecting a different category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((location) => (
            <LocationCard
              key={location._id || location.id}
              location={location}
              onNavigateHere={handleNavigateHere}
              onViewOnMap={handleViewOnMap}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LocationsDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
          <p className="text-xs font-medium">Loading Directory...</p>
        </div>
      }
    >
      <LocationsContent />
    </Suspense>
  );
}
