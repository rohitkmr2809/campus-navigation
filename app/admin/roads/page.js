'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Route,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Footprints,
} from 'lucide-react';

export default function AdminRoadsPage() {
  const searchParams = useSearchParams();
  const autoAdd = searchParams.get('action') === 'add';

  const [roads, setRoads] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(autoAdd);
  const [editingRoad, setEditingRoad] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ error: '', success: '' });

  // Form Fields
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState(100);

  const fetchData = async () => {
    try {
      const [roadsRes, locsRes] = await Promise.all([
        fetch('/api/roads'),
        fetch('/api/locations'),
      ]);

      const [roadsData, locsData] = await Promise.all([
        roadsRes.json(),
        locsRes.json(),
      ]);

      if (roadsData.success) setRoads(roadsData.data);
      if (locsData.success) setLocations(locsData.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingRoad(null);
    setSource('');
    setDestination('');
    setDistance(100);
    setFeedback({ error: '', success: '' });
    setModalOpen(true);
  };

  const openEditModal = (road) => {
    setEditingRoad(road);
    setSource(road.source?._id || road.source?.id || road.source);
    setDestination(road.destination?._id || road.destination?.id || road.destination);
    setDistance(road.distance);
    setFeedback({ error: '', success: '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ error: '', success: '' });
    setFormSubmitting(true);

    try {
      if (editingRoad) {
        // Update distance
        const res = await fetch(`/api/roads/${editingRoad._id || editingRoad.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ distance: Number(distance) }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update road.');
      } else {
        // Create road
        const res = await fetch('/api/roads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source,
            destination,
            distance: Number(distance),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create road.');
      }

      setFeedback({ success: 'Road segment saved successfully!', error: '' });
      fetchData();
      setTimeout(() => setModalOpen(false), 1200);
    } catch (err) {
      setFeedback({ error: err.message, success: '' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (road) => {
    const roadId = road._id || road.id;
    const sourceName = road.source?.name || 'Unknown';
    const destName = road.destination?.name || 'Unknown';

    if (!confirm(`Delete road connecting "${sourceName}" and "${destName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/roads/${roadId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to delete road');
      } else {
        fetchData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Route className="w-5 h-5 text-purple-600" />
            Campus Road Network (Graph Edges)
          </h2>
          <p className="text-xs text-slate-500">
            Weighted connections between campus locations used by Dijkstra algorithm
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Road
        </button>
      </div>

      {/* Roads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Source Node (Origin)</th>
                <th className="px-4 py-3 text-center">Path Direction</th>
                <th className="px-4 py-3">Destination Node</th>
                <th className="px-4 py-3">Weight / Distance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    Loading road network...
                  </td>
                </tr>
              ) : roads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No roads found. Click &quot;Add Road&quot; to connect campus locations.
                  </td>
                </tr>
              ) : (
                roads.map((road) => (
                  <tr key={road._id || road.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {road.source?.name || 'N/A'}
                      <span className="block text-[11px] font-normal text-slate-400">
                        {road.source?.building}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-400 font-bold">
                      ↔
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {road.destination?.name || 'N/A'}
                      <span className="block text-[11px] font-normal text-slate-400">
                        {road.destination?.building}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-sky-50 text-sky-800 px-2.5 py-1 rounded-lg border border-sky-200 text-xs">
                        <Footprints className="w-3.5 h-3.5" />
                        {road.distance} meters
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(road)}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Edit Distance"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(road)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Road"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Road Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingRoad ? 'Edit Road Distance' : 'Connect Two Locations (Add Road)'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Defines a walkable edge in the campus graph
            </p>

            {feedback.error && (
              <div className="mb-4 flex items-center gap-2 p-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{feedback.error}</span>
              </div>
            )}
            {feedback.success && (
              <div className="mb-4 flex items-center gap-2 p-2.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{feedback.success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Source Location *
                </label>
                <select
                  disabled={!!editingRoad}
                  required
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500 disabled:opacity-60"
                >
                  <option value="">-- Select Origin --</option>
                  {locations.map((loc) => (
                    <option key={loc._id || loc.id} value={loc._id || loc.id}>
                      {loc.name} ({loc.building})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination Location *
                </label>
                <select
                  disabled={!!editingRoad}
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500 disabled:opacity-60"
                >
                  <option value="">-- Select Destination --</option>
                  {locations.map((loc) => (
                    <option key={loc._id || loc.id} value={loc._id || loc.id}>
                      {loc.name} ({loc.building})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Road Distance (in meters) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Average walking time: ~{Math.max(1, Math.round(Number(distance || 0) / 80))} min
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting || (!editingRoad && (!source || !destination || source === destination))}
                  className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Road
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
