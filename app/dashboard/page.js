'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  MapPin,
  Route,
  Building2,
  ShieldCheck,
  Navigation,
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch('/api/locations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLocations(data.data);
      })
      .catch((e) => console.error(e));
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  // Pre-configured popular routes for quick one-click navigation
  const quickRoutes = [
    { from: 'Main Gate', to: 'Central Library', label: 'Entrance to Library' },
    { from: 'Main Gate', to: 'Computer Science Block', label: 'Gate to Tech Hub' },
    { from: 'Administrative Block', to: 'Central Canteen', label: 'Admin to Lunch' },
    { from: 'Hostel A (Boys)', to: 'Computer Science Block', label: 'Hostels to CSE' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 uppercase tracking-wider">
              {user.role} Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {user.name}!
          </h1>
          <p className="text-sky-100 text-xs sm:text-sm mt-1">
            Logged in as <span className="font-semibold">{user.email}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/navigate"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-sky-800 font-semibold text-xs hover:bg-sky-50 shadow transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Plan Route
          </Link>
          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 text-white font-semibold text-xs hover:bg-purple-600 shadow transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          )}
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/map"
          className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">
            Live Campus Map
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Open the full OpenStreetMap view with all 15+ buildings, gates, hostels, and markers.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-sky-600">
            Open Map <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        <Link
          href="/navigate"
          className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Route className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">
            Shortest Route Finder
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pick any two campus locations and let Dijkstra calculate the quickest walking route.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600">
            Start Navigating <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        <Link
          href="/locations"
          className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">
            Campus Directory
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Search departments, offices, laboratories, examination cell, and cafeterias.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600">
            Browse Directory <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>
      </div>

      {/* Recommended One-Click Routes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Frequent Campus Routes
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Jump directly to pre-configured Dijkstra shortest route calculations
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickRoutes.map((r, i) => {
            const fromLoc = locations.find((l) => l.name === r.from);
            const toLoc = locations.find((l) => l.name === r.to);
            const url =
              fromLoc && toLoc
                ? `/navigate?start=${fromLoc._id || fromLoc.id}&destination=${toLoc._id || toLoc.id}`
                : '/navigate';

            return (
              <Link
                key={i}
                href={url}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 transition-all"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{r.label}</p>
                  <p className="text-[11px] text-slate-500">
                    {r.from} → {r.to}
                  </p>
                </div>
                <Navigation className="w-4 h-4 text-sky-600" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
