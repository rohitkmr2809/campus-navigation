'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  MapPin,
  Route,
  Footprints,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Loader2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-xs">Loading campus metrics...</span>
      </div>
    );
  }

  const userRoles = stats?.usersByRole || {};
  const locationTypes = stats?.locationsByType || [];

  return (
    <div className="space-y-6">
      {/* Top Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Total Users</span>
            <Users className="w-5 h-5 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalUsers || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Students, Faculty & Visitors</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Campus Locations</span>
            <MapPin className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalLocations || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Graph Vertices / Buildings</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Road Segments</span>
            <Route className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalRoads || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Graph Weighted Edges</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Total Network</span>
            <Footprints className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {stats?.totalWalkwayMeters || 0} <span className="text-xs font-normal">m</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Walkable paths mapped</p>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6">
        <h2 className="text-sm font-bold text-purple-900 mb-1">
          Administrator Actions
        </h2>
        <p className="text-xs text-purple-700 mb-4">
          Directly manage graph topology and maintain accurate campus mapping data
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/locations?action=add"
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Location
          </Link>
          <Link
            href="/admin/roads?action=add"
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Connect Road / Edge
          </Link>
          <Link
            href="/navigate"
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Route className="w-4 h-4" />
            Test Dijkstra Route
          </Link>
        </div>
      </div>

      {/* Distributions Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Registered Users by Role
          </h3>
          <div className="space-y-2 text-xs">
            {Object.keys(userRoles).map((role) => (
              <div
                key={role}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50"
              >
                <span className="font-semibold uppercase tracking-wide text-slate-700">
                  {role}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 font-bold text-slate-800">
                  {userRoles[role]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Location Type Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Locations by Category
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-1.5 text-xs pr-1">
            {locationTypes.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50"
              >
                <span className="font-medium text-slate-700">{item._id}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
