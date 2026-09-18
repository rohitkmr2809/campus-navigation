'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  MapPin,
  Route,
  Building2,
  Navigation,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [startId, setStartId] = useState('');
  const [destId, setDestId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/locations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setLocations(data.data);
          // Set sensible defaults if available
          const mainGate = data.data.find((l) => l.name === 'Main Gate');
          const cse = data.data.find((l) => l.name.includes('Computer Science'));
          if (mainGate) setStartId(mainGate._id || mainGate.id);
          if (cse) setDestId(cse._id || cse.id);
        }
      })
      .catch((err) => console.error('Error fetching locations:', err));
  }, []);

  const handleQuickRoute = (e) => {
    e.preventDefault();
    if (!startId || !destId) return;
    router.push(`/navigate?start=${startId}&destination=${destId}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/locations?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Software Engineering Microproject
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              College Campus <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-800 bg-clip-text text-transparent">
                Navigation System
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Find the shortest walking paths between academic blocks, libraries, departments, and facilities with Dijkstra&apos;s algorithm and OpenStreetMap.
            </p>

            {/* Quick Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-xl mx-auto flex items-center bg-white rounded-2xl shadow-lg border border-slate-200 p-1.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all"
            >
              <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campus: 'Library', 'CSE Block', 'Canteen'..."
                className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent py-2"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors shrink-0"
              >
                Search
              </button>
            </form>
          </div>

          {/* Quick Route Finder Widget */}
          <div className="mt-12 max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-100 mb-5">
              <Route className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Quick Route Finder (Dijkstra Algorithm)
              </h2>
            </div>

            <form onSubmit={handleQuickRoute} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Starting Location (Source)
                </label>
                <select
                  value={startId}
                  onChange={(e) => setStartId(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                >
                  <option value="">-- Select Origin --</option>
                  {locations.map((loc) => (
                    <option key={loc._id || loc.id} value={loc._id || loc.id}>
                      {loc.name} ({loc.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Destination Location
                </label>
                <select
                  value={destId}
                  onChange={(e) => setDestId(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                >
                  <option value="">-- Select Destination --</option>
                  {locations.map((loc) => (
                    <option key={loc._id || loc.id} value={loc._id || loc.id}>
                      {loc.name} ({loc.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={!startId || !destId || startId === destId}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Calculate Shortest Campus Route</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                {startId && destId && startId === destId && (
                  <p className="text-center text-xs text-rose-500 mt-2 font-medium">
                    Start and destination must be different locations.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Key Project Modules & Capabilities
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Built strictly in accordance with software engineering principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
              <Route className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Dijkstra Shortest Path
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Computes optimal walking paths across campus nodes and weighted roads with real-time distance and estimated walking time calculations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Leaflet + OpenStreetMap
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive map visualization with custom pins, route polyline overlays, responsive zoom controls, and zero reliance on paid API keys.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Admin & Role-Based Auth
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Secure password hashing with bcrypt, JWT session management, and a dedicated admin portal to manage locations, roads, and campus stats.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Locations Quick Browse */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Featured Campus Locations</h2>
            <p className="text-xs text-slate-500">Explore key buildings and departments</p>
          </div>
          <Link
            href="/locations"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            View All Directory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {locations.slice(0, 8).map((loc) => (
            <Link
              key={loc._id || loc.id}
              href={`/map?select=${loc._id || loc.id}`}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {loc.type}
                </span>
                <MapPin className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                {loc.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{loc.building}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
