export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAllUsers } from '@/lib/data-service';

/**
 * GET /api/users
 * Admin only: List all users
 */
export async function GET(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const users = await getAllUsers();
    return NextResponse.json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error('Fetch Users Error:', error);
    return NextResponse.json({ error: 'Failed to fetch registered users.' }, { status: 500 });
  }
}
