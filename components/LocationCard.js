import React from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Building, Layers } from 'lucide-react';

const TYPE_BADGE_CLASSES = {
  Gate: 'bg-red-100 text-red-800 border-red-200',
  Department: 'bg-blue-100 text-blue-800 border-blue-200',
  Library: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Canteen: 'bg-amber-100 text-amber-800 border-amber-200',
  Hostel: 'bg-purple-100 text-purple-800 border-purple-200',
  Sports: 'bg-green-100 text-green-800 border-green-200',
  Parking: 'bg-slate-100 text-slate-800 border-slate-200',
  Office: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  Laboratory: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Building: 'bg-slate-100 text-slate-700 border-slate-200',
  Other: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function LocationCard({
  location,
  onNavigateHere,
  onViewOnMap,
  isSelected = false,
}) {
  const locId = location._id ? location._id.toString() : location.id;

  return (
    <div
      className={`bg-white rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'border-sky-500 ring-2 ring-sky-100 shadow-sm'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-slate-900 text-base leading-snug">
          {location.name}
        </h3>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            TYPE_BADGE_CLASSES[location.type] || 'bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          {location.type}
        </span>
      </div>

      <div className="space-y-1 mb-3 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{location.building || 'Campus Building'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Floor: {location.floor || 'Ground'}</span>
        </div>
      </div>

      {location.description && (
        <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
          {location.description}
        </p>
      )}

      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        {onViewOnMap && (
          <button
            onClick={() => onViewOnMap(location)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            View on Map
          </button>
        )}

        {onNavigateHere ? (
          <button
            onClick={() => onNavigateHere(location)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            Navigate
          </button>
        ) : (
          <Link
            href={`/navigate?destination=${locId}`}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors text-center"
          >
            <Navigation className="w-3.5 h-3.5" />
            Navigate
          </Link>
        )}
      </div>
    </div>
  );
}
