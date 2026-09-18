import { NextResponse } from 'next/server';
import { getAllLocations, getAllRoads } from '@/lib/data-service';
import { findShortestPath } from '@/lib/dijkstra';

export async function POST(request) {
  try {
    const body = await request.json();
    const { sourceId, destinationId } = body;

    if (!sourceId || !destinationId) {
      return NextResponse.json(
        { error: 'Both start location and destination location must be selected.' },
        { status: 400 }
      );
    }

    // Fetch all locations and roads
    const [locations, roads] = await Promise.all([
      getAllLocations(),
      getAllRoads(),
    ]);

    if (!locations || locations.length === 0) {
      return NextResponse.json(
        { error: 'No campus locations found in database.' },
        { status: 404 }
      );
    }

    // Run Dijkstra's shortest path algorithm
    const result = findShortestPath(sourceId, destinationId, locations, roads);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'No path could be found between the selected locations.',
          pathLocations: [],
          totalDistance: 0,
          walkingTimeMinutes: 0,
        },
        { status: 404 }
      );
    }

    // Format coordinates array for Leaflet Polyline [[lat, lng], [lat, lng], ...]
    const polylineCoordinates = result.pathLocations.map((loc) => [
      loc.latitude,
      loc.longitude,
    ]);

    return NextResponse.json({
      success: true,
      pathIds: result.pathIds,
      pathLocations: result.pathLocations,
      polylineCoordinates,
      totalDistance: result.totalDistance,
      walkingTimeMinutes: result.walkingTimeMinutes,
      turnByTurn: result.turnByTurn,
    });
  } catch (error) {
    console.error('Navigation Shortest-Path API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while calculating shortest route.' },
      { status: 500 }
    );
  }
}
