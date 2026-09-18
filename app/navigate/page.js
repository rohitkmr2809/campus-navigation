'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CampusMap from '@/components/CampusMap';
import RouteDisplay from '@/components/RouteDisplay';
import {
  Route,
  Navigation,
  ArrowUpDown,
  AlertCircle,
  Loader2,
  RotateCcw,
} from 'lucide-react';

function NavigateContent() {
  const searchParams = useSearchParams();
  const queryStart = searchParams.get('start') || '';
  const queryDest = searchParams.get('destination') || '';

  const [locations, setLocations] = useState([]);
  const [startId, setStartId] = useState(queryStart);
  const [destId, setDestId] = useState(queryDest);
  const [loadingLocations, setLoadingLocations] = useState(true);

  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');
  const [routeResult, setRouteResult] = useState(null);

  // Load locations on mount
  useEffect(() => {
    fetch('/api/locations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setLocations(data.data);
          if (queryStart) setStartId(queryStart);
          if (queryDest) setDestId(queryDest);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingLocations(false));
  }, [queryStart, queryDest]);

  // If both start and destination are provided via URL, auto-calculate route
  useEffect(() => {
    if (queryStart && queryDest && queryStart !== queryDest && locations.length > 0) {
      calculateShortestRoute(queryStart, queryDest);
    }
  }, [queryStart, queryDest, locations]);

  const handleSwap = () => {
    setStartId(destId);
    setDestId(startId);
    setRouteResult(null);
    setError('');
  };

  const handleReset = () => {
    setRouteResult(null);
    setError('');
  };

  const calculateShortestRoute = async (sId = startId, dId = destId) => {
    if (!sId || !dId) {
      setError('Please select both a start location and a destination.');
      return;
    }

    if (sId === dId) {
      setError('Start location and destination cannot be identical.');
      return;
    }

    setError('');
    setCalculating(true);

    try {
      const res = await fetch('/api/navigation/shortest-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: sId, destinationId: dId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to calculate shortest path.');
      }

      setRouteResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while running Dijkstra algorithm.');
      setRouteResult(null);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Route className="w-7 h-7 text-emerald-600" />
          Campus Shortest Route Finder
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Dijkstra&apos;s algorithm calculates the optimal walking path and displays it on the interactive map.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Panel (Start/Destination + Route Results) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Route Parameters</span>
              {routeResult && (
                <button
                  onClick={handleReset}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </h2>

            {error && (
              <div className="mb-4 flex items-start gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Start Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Start Location (Origin)
                </label>
                <select
                  value={startId}
                  onChange={(e) => {
                    setStartId(e.target.value);
                    setRouteResult(null);
                  }}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                >
                  <option value="">-- Choose Starting Point --</option>
                  {locations.map((loc) => (
                    <option key={loc._id || loc.id} value={loc._id || loc.id}>
                      {loc.name} ({loc.building})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-1">
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap Origin and Destination"
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors border border-slate-300 shadow-xs"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>

              {/* Destination Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Destination Location
                </label>
                <select
                  value={destId}
                  onChange={(e) => {
                    setDestId(e.target.value);
                    setRouteResult(null);
                  }}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                >
                  <option value="">-- Choose Target Destination --</option>
                  {locations.map((loc) => (
                    <option key={loc._id || loc.id} value={loc._id || loc.id}>
                      {loc.name} ({loc.building})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => calculateShortestRoute()}
                disabled={calculating || !startId || !destId || startId === destId}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {calculating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running Dijkstra Algorithm...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>Find Shortest Route</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Summary Card */}
          {routeResult && (
            <RouteDisplay routeResult={routeResult} onReset={handleReset} />
          )}
        </div>

        {/* Right Side: Interactive Leaflet Map with Route Polyline */}
        <div className="lg:col-span-7">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Route Visualization</span>
              </div>
              {routeResult && (
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-600 font-medium">
                    Distance: <b className="text-slate-900">{routeResult.totalDistance}m</b>
                  </span>
                  <span className="text-slate-600 font-medium">
                    Est. Time: <b className="text-slate-900">{routeResult.walkingTimeMinutes} min</b>
                  </span>
                </div>
              )}
            </div>

            <CampusMap
              locations={locations}
              routeCoordinates={routeResult ? routeResult.polylineCoordinates : []}
              startLocationId={startId}
              destinationLocationId={destId}
              onSetStart={(loc) => setStartId(loc._id ? loc._id.toString() : loc.id)}
              onSetDestination={(loc) => setDestId(loc._id ? loc._id.toString() : loc.id)}
              height="600px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NavigatePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
          <p className="text-xs font-medium">Loading Route Planner...</p>
        </div>
      }
    >
      <NavigateContent />
    </Suspense>
  );
}
