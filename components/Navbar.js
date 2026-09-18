'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  MapPin,
  Route,
  Building2,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-sky-700 to-indigo-800 bg-clip-text text-transparent block leading-none">
                  CampusNav
                </span>
                <span className="text-xs text-slate-500 font-medium tracking-wide">
                  Navigation System
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              <Link
                href="/map"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/map')
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-4 h-4 mr-1.5 text-sky-500" />
                Campus Map
              </Link>

              <Link
                href="/navigate"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/navigate')
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`}
              >
                <Route className="w-4 h-4 mr-1.5 text-emerald-500" />
                Find Route
              </Link>

              <Link
                href="/locations"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/locations')
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4 mr-1.5 text-indigo-500" />
                Directory
              </Link>

              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname.startsWith('/admin')
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-purple-600" />
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Right Side (Auth controls) */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.name.split(' ')[0]}
                    </p>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium uppercase bg-sky-100 text-sky-800">
                      {user.role}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors title='Sign Out'"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-sky-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            href="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2 text-base font-medium rounded-lg text-slate-700 hover:bg-slate-100"
          >
            <MapPin className="w-5 h-5 mr-3 text-sky-500" />
            Campus Map
          </Link>
          <Link
            href="/navigate"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2 text-base font-medium rounded-lg text-slate-700 hover:bg-slate-100"
          >
            <Route className="w-5 h-5 mr-3 text-emerald-500" />
            Find Route
          </Link>
          <Link
            href="/locations"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2 text-base font-medium rounded-lg text-slate-700 hover:bg-slate-100"
          >
            <Building2 className="w-5 h-5 mr-3 text-indigo-500" />
            Directory
          </Link>
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 text-base font-medium rounded-lg text-purple-700 bg-purple-50"
            >
              <ShieldCheck className="w-5 h-5 mr-3 text-purple-600" />
              Admin Panel
            </Link>
          )}

          <div className="border-t border-slate-200 pt-3 mt-3">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 rounded-lg">
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email} ({user.role})</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left flex items-center px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
