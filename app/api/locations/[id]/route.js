import { NextResponse } from 'next/server';
import { LOCATION_TYPES } from '@/models/Location';
import { requireAdmin } from '@/lib/auth';
import {
  getLocationById,
  updateLocation,
  deleteLocation,
  getAllLocations,
} from '@/lib/data-service';

/**
 * GET /api/locations/:id
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const location = await getLocationById(id);

    if (!location) {
      return NextResponse.json({ error: 'Location not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: location });
  } catch (error) {
    console.error('Get Location Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve location details.' }, { status: 500 });
  }
}

/**
 * PUT /api/locations/:id
 * Admin only: Update location
 */
export async function PUT(request, { params }) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = params;
    const body = await request.json();
    const { name, type, description, building, floor, latitude, longitude } = body;

    if (type && !LOCATION_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Invalid location type. Allowed types: ${LOCATION_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Check duplicate name
    if (name) {
      const all = await getAllLocations();
      const duplicate = all.find(
        (l) => l.name.toLowerCase() === name.trim().toLowerCase() && l._id.toString() !== id.toString()
      );
      if (duplicate) {
        return NextResponse.json(
          { error: `Another location named "${name.trim()}" already exists.` },
          { status: 409 }
        );
      }
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (type !== undefined) updateFields.type = type;
    if (description !== undefined) updateFields.description = description.trim();
    if (building !== undefined) updateFields.building = building.trim();
    if (floor !== undefined) updateFields.floor = floor;
    if (latitude !== undefined) updateFields.latitude = parseFloat(latitude);
    if (longitude !== undefined) updateFields.longitude = parseFloat(longitude);

    const updated = await updateLocation(id, updateFields);

    if (!updated) {
      return NextResponse.json({ error: 'Location not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Location updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Update Location Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update location.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/locations/:id
 * Admin only: Delete location and cascade-delete connected roads
 */
export async function DELETE(request, { params }) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = params;
    const deleted = await deleteLocation(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Location not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Location "${deleted.name}" deleted successfully.`,
    });
  } catch (error) {
    console.error('Delete Location Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete location.' },
      { status: 500 }
    );
  }
}
