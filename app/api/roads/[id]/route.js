import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getRoadById, updateRoad, deleteRoad } from '@/lib/data-service';

/**
 * GET /api/roads/:id
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const road = await getRoadById(id);

    if (!road) {
      return NextResponse.json({ error: 'Road not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: road });
  } catch (error) {
    console.error('Get Road Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve road details.' }, { status: 500 });
  }
}

/**
 * PUT /api/roads/:id
 * Admin only: Update road distance
 */
export async function PUT(request, { params }) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = params;
    const body = await request.json();
    const { distance } = body;

    if (distance === undefined || isNaN(Number(distance)) || Number(distance) <= 0) {
      return NextResponse.json(
        { error: 'A valid positive distance in meters is required.' },
        { status: 400 }
      );
    }

    const updatedRoad = await updateRoad(id, Math.round(Number(distance)));

    if (!updatedRoad) {
      return NextResponse.json({ error: 'Road not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Road updated successfully.',
      data: updatedRoad,
    });
  } catch (error) {
    console.error('Update Road Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update road.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/roads/:id
 * Admin only: Delete road
 */
export async function DELETE(request, { params }) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = params;
    const deleted = await deleteRoad(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Road not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Road segment deleted successfully.',
    });
  } catch (error) {
    console.error('Delete Road Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete road.' },
      { status: 500 }
    );
  }
}
