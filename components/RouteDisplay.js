import React from 'react';
import { Footprints, Clock, ArrowDown, CheckCircle2, Navigation } from 'lucide-react';

export default function RouteDisplay({ routeResult, onReset }) {
  if (!routeResult || !routeResult.success) {
    return null;
  }

  const { pathLocations, totalDistance, walkingTimeMinutes, turnByTurn } = routeResult;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Summary */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-sky-200" />
            <h3 className="font-bold text-base">Shortest Route Calculated</h3>
          </div>
          {onReset && (
            <button
              onClick={onReset}
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded transition-colors"
            >
              Clear Route
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center space-x-2">
            <Footprints className="w-4 h-4 text-sky-200" />
            <div>
              <p className="text-[11px] text-sky-100 uppercase tracking-wider font-medium">
                Total Distance
              </p>
              <p className="text-xl font-extrabold tracking-tight">
                {totalDistance}{' '}
                <span className="text-xs font-normal text-sky-200">meters</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-sky-200" />
            <div>
              <p className="text-[11px] text-sky-100 uppercase tracking-wider font-medium">
                Walking Time
              </p>
              <p className="text-xl font-extrabold tracking-tight">
                ~{walkingTimeMinutes}{' '}
                <span className="text-xs font-normal text-sky-200">
                  {walkingTimeMinutes === 1 ? 'minute' : 'minutes'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Path Breadcrumbs / Node Progression */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Route Sequence ({pathLocations.length} locations)
        </p>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {pathLocations.map((loc, idx) => (
            <React.Fragment key={loc._id || loc.id || idx}>
              <span
                className={`px-2 py-1 rounded-md font-medium ${
                  idx === 0
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : idx === pathLocations.length - 1
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {loc.name}
              </span>
              {idx < pathLocations.length - 1 && (
                <span className="text-slate-400 font-bold">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step-by-Step Directions */}
      <div className="p-4">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Step-by-Step Walking Directions
        </h4>

        {turnByTurn && turnByTurn.length > 0 ? (
          <div className="space-y-3">
            {turnByTurn.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold shrink-0 mt-0.5 border border-sky-200">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {step.instruction}
                  </p>
                  {step.segmentDistance > 0 && (
                    <span className="inline-block mt-0.5 text-[11px] text-slate-500 font-semibold">
                      Segment: {step.segmentDistance} meters
                    </span>
                  )}
                </div>
              </div>
            ))}

            <div className="flex items-center space-x-2 pt-2 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>You have arrived at your destination!</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            Start and destination are identical.
          </p>
        )}
      </div>
    </div>
  );
}
