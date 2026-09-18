'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const CampusMapInner = dynamic(() => import('./CampusMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-500 border border-slate-200">
      <Loader2 className="w-8 h-8 animate-spin text-sky-600 mb-2" />
      <p className="text-sm font-medium">Loading Interactive Campus Map...</p>
    </div>
  ),
});

export default function CampusMap(props) {
  return <CampusMapInner {...props} />;
}
