export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { LOCATION_TYPES } from '@/models/Location';
import { requireAdmin } from '@/lib/auth';
import { getAllLocations, createLocation } from '@/lib/data-service';

/**
 * GET /api/locations
 * Query campus locations with optional search and type filter
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';

    const locations = await getAllLocations(search, type);
    return NextResponse.json({ success: true, count: locations.length, data: locations });
  } catch (error) {
    console.error('Fetch Locations Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campus locations.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/locations
 * Admin only: Create a new campus location
 */
export async function POST(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { name, type, description, building, floor, latitude, longitude } = body;

    if (!name || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Name, latitude, and longitude are required fields.' },
        { status: 400 }
      );
    }

    if (type && !LOCATION_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Invalid location type. Allowed types: ${LOCATION_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Check duplicate
    const all = await getAllLocations();
    const existing = all.find((l) => l.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) {
      return NextResponse.json(
        { error: `A campus location named "${name.trim()}" already exists.` },
        { status: 409 }
      );
    }

    const newLocation = await createLocation({
      name: name.trim(),
      type: type || 'Building',
      description: (description || '').trim(),
      building: (building || 'Main Campus').trim(),
      floor: floor !== undefined ? floor : 'Ground',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });

    return NextResponse.json(
      { success: true, message: 'Location created successfully.', data: newLocation },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Location Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create location.' },
      { status: 500 }
    );
  }
}
