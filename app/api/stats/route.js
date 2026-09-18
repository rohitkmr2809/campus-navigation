export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getCampusStats } from '@/lib/data-service';

/**
 * GET /api/stats
 * Admin only: Overview counts and distribution statistics
 */
export async function GET(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const stats = await getCampusStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Fetch Stats Error:', error);
    return NextResponse.json({ error: 'Failed to compile statistics.' }, { status: 500 });
  }
}
