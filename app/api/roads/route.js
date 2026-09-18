import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAllRoads, createRoad, getLocationById } from '@/lib/data-service';

/**
 * GET /api/roads
 */
export async function GET() {
  try {
    const roads = await getAllRoads();
    return NextResponse.json({ success: true, count: roads.length, data: roads });
  } catch (error) {
    console.error('Fetch Roads Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campus roads.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/roads
 * Admin only: Create road between two locations
 */
export async function POST(request) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { source, destination, distance } = body;

    if (!source || !destination || distance === undefined) {
      return NextResponse.json(
        { error: 'Source location, destination location, and distance are required.' },
        { status: 400 }
      );
    }

    if (source === destination) {
      return NextResponse.json(
        { error: 'Source and destination cannot be the same location.' },
        { status: 400 }
      );
    }

    const numericDistance = Number(distance);
    if (isNaN(numericDistance) || numericDistance <= 0) {
      return NextResponse.json(
        { error: 'Distance must be a positive number in meters.' },
        { status: 400 }
      );
    }

    const [sourceLoc, destLoc] = await Promise.all([
      getLocationById(source),
      getLocationById(destination),
    ]);

    if (!sourceLoc || !destLoc) {
      return NextResponse.json(
        { error: 'One or both specified locations do not exist in the database.' },
        { status: 404 }
      );
    }

    const allRoads = await getAllRoads();
    const existing = allRoads.find((r) => {
      const s = r.source?._id ? r.source._id.toString() : r.source.toString();
      const d = r.destination?._id ? r.destination._id.toString() : r.destination.toString();
      return (s === source && d === destination) || (s === destination && d === source);
    });

    if (existing) {
      return NextResponse.json(
        {
          error: `A road between "${sourceLoc.name}" and "${destLoc.name}" already exists (${existing.distance}m). Please edit the existing road instead.`,
        },
        { status: 409 }
      );
    }

    const newRoad = await createRoad({
      source,
      destination,
      distance: Math.round(numericDistance),
    });

    return NextResponse.json(
      { success: true, message: 'Road created successfully.', data: newRoad },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Road Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create road.' },
      { status: 500 }
    );
  }
}
