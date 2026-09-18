import React from 'react';
import Link from 'next/link';
import { Compass, Heart, Github, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <Compass className="w-6 h-6 text-sky-400" />
              <span className="font-bold text-lg">Campus Navigation System</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An intelligent shortest-path navigation assistant designed for college campuses.
              Implements Dijkstra algorithm, OpenStreetMap integration, and interactive pathfinding.
            </p>
            <div className="flex items-center space-x-2 text-xs text-sky-400 font-medium">
              <GraduationCap className="w-4 h-4" />
              <span>Software Engineering Microproject</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/map" className="hover:text-white transition-colors">
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link href="/navigate" className="hover:text-white transition-colors">
                  Shortest Route Planner
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-white transition-colors">
                  Campus Directory
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  User Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">
              SE Project Details
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <span className="text-slate-300 font-medium">Algorithm:</span> Dijkstra Shortest Path
              </li>
              <li>
                <span className="text-slate-300 font-medium">Mapping:</span> Leaflet + OpenStreetMap
              </li>
              <li>
                <span className="text-slate-300 font-medium">Database:</span> MongoDB + Mongoose
              </li>
              <li>
                <span className="text-slate-300 font-medium">Stack:</span> Next.js & Tailwind CSS
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Campus Navigation System. College SE Microproject.</p>
          <p className="mt-2 sm:mt-0 flex items-center">
            Built with Next.js, React & Leaflet
          </p>
        </div>
      </div>
    </footer>
  );
}
