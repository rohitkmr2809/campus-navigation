/**
 * ============================================================================
 * MODULE 6: DIJKSTRA'S SHORTEST PATH ALGORITHM
 * ============================================================================
 * 
 * ALGORITHM EXPLANATION FOR COLLEGE VIVA / PRESENTATION:
 * 
 * 1. Problem Statement:
 *    Given a weighted, undirected campus graph G = (V, E):
 *    - Vertices (V) represent physical campus locations (e.g., Main Gate, Library, Labs).
 *    - Edges (E) represent walkable roads/pathways connecting pairs of locations.
 *    - Weight w(u, v) represents the physical distance (in meters) of the road between u and v.
 *    Our goal is to find the path with the minimum sum of edge weights from a start node (source)
 *    to an end node (destination).
 * 
 * 2. Dijkstra's Algorithm Overview (Greedy Approach):
 *    - Time Complexity: O((V + E) log V) with Priority Queue / Min-Heap, or O(V^2) with simple array.
 *    - Space Complexity: O(V + E) for adjacency list and distance tracking.
 *    - Invariant: Once a node is marked as "visited", its shortest distance from the source is finalized.
 * 
 * 3. Step-by-Step Procedure:
 *    Step 1: Build an Adjacency List representing the graph from the roads database.
 *    Step 2: Initialize a `distances` map where distance[source] = 0 and distance[v] = Infinity for all v != source.
 *    Step 3: Initialize a `previous` map to store the predecessor of each node along the shortest path.
 *    Step 4: Keep an `unvisited` set of all vertices.
 *    Step 5: While unvisited is not empty:
 *            a. Select node `current` with the minimum distance in `unvisited`.
 *            b. If `current` is the destination, we found the optimal route! Break.
 *            c. If minimum distance is Infinity, remaining nodes are unreachable. Break.
 *            d. Remove `current` from `unvisited`.
 *            e. For each neighbor `v` of `current`:
 *               - Calculate tentative distance: `newDist = distances[current] + weight(current, v)`
 *               - If `newDist < distances[v]`:
 *                 update `distances[v] = newDist`
 *                 update `previous[v] = current`
 *    Step 6: Backtrack from destination to source using `previous` map to reconstruct the ordered path.
 *    Step 7: Compute total walking time based on average human walking speed (approx. 80 meters/min = 4.8 km/h).
 * ============================================================================
 */

/**
 * Average human walking speed on flat campus sidewalks:
 * ~4.8 km/h = ~80 meters per minute (or ~1.33 meters/second)
 */
const WALKING_SPEED_METERS_PER_MIN = 80;

/**
 * Construct an Adjacency List from an array of locations and roads.
 * 
 * @param {Array} locations - Array of location objects with _id
 * @param {Array} roads - Array of road objects with { source, destination, distance }
 * @returns {Map<string, Array<{nodeId: string, distance: number}>>}
 */
export function buildCampusGraph(locations, roads) {
  const graph = new Map();

  // Initialize adjacency list for every registered campus location
  for (const loc of locations) {
    const locId = loc._id.toString();
    graph.set(locId, []);
  }

  // Populate edges. Roads on campus are walkable in both directions (undirected graph).
  for (const road of roads) {
    const u = road.source._id ? road.source._id.toString() : road.source.toString();
    const v = road.destination._id ? road.destination._id.toString() : road.destination.toString();
    const weight = Number(road.distance);

    if (graph.has(u) && graph.has(v) && weight > 0) {
      // Add edge u -> v
      graph.get(u).push({ nodeId: v, distance: weight });
      // Add edge v -> u (bidirectional campus walkway)
      graph.get(v).push({ nodeId: u, distance: weight });
    }
  }

  return graph;
}

/**
 * Run Dijkstra's algorithm to compute the shortest path between source and destination.
 * 
 * @param {string} sourceId - The MongoDB _id of starting location
 * @param {string} destId - The MongoDB _id of target destination location
 * @param {Array} locations - All location documents
 * @param {Array} roads - All road documents
 * @returns {Object} Result object containing pathIds, pathLocations, totalDistance, walkingTimeMinutes
 */
export function findShortestPath(sourceId, destId, locations, roads) {
  // Edge Case 1: Validation
  if (!sourceId || !destId) {
    throw new Error('Both start location and destination are required.');
  }

  // Quick lookup dictionary for location details by ID string
  const locationMap = new Map();
  for (const loc of locations) {
    locationMap.set(loc._id.toString(), loc);
  }

  if (!locationMap.has(sourceId)) {
    throw new Error(`Start location not found in campus database (ID: ${sourceId})`);
  }
  if (!locationMap.has(destId)) {
    throw new Error(`Destination location not found in campus database (ID: ${destId})`);
  }

  // Edge Case 2: Start and Destination are the exact same location
  if (sourceId === destId) {
    const singleLoc = locationMap.get(sourceId);
    return {
      success: true,
      pathIds: [sourceId],
      pathLocations: [singleLoc],
      totalDistance: 0,
      walkingTimeMinutes: 0,
      turnByTurn: [
        {
          from: singleLoc.name,
          to: singleLoc.name,
          distance: 0,
          instruction: `You are already at ${singleLoc.name}.`,
        },
      ],
    };
  }

  // Build the graph
  const graph = buildCampusGraph(locations, roads);

  // Data structures for Dijkstra's Algorithm
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  // Initialization:
  // distance[source] = 0, all others = Infinity
  for (const loc of locations) {
    const id = loc._id.toString();
    distances[id] = Infinity;
    previous[id] = null;
    unvisited.add(id);
  }

  distances[sourceId] = 0;

  // Main Greedy Loop
  while (unvisited.size > 0) {
    // 1. Find the unvisited vertex with the minimum tentative distance
    let current = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        current = nodeId;
      }
    }

    // If all remaining unvisited nodes have distance Infinity, no path exists
    if (current === null || minDistance === Infinity) {
      break;
    }

    // Target reached early optimization
    if (current === destId) {
      break;
    }

    // Remove current node from unvisited set
    unvisited.delete(current);

    // 2. Relax all adjacent edges of current node
    const neighbors = graph.get(current) || [];
    for (const neighbor of neighbors) {
      const neighborId = neighbor.nodeId;

      // Only check neighbors that haven't had their shortest path finalized
      if (unvisited.has(neighborId)) {
        const tentativeDistance = distances[current] + neighbor.distance;

        // Found a shorter path to neighbor
        if (tentativeDistance < distances[neighborId]) {
          distances[neighborId] = tentativeDistance;
          previous[neighborId] = current;
        }
      }
    }
  }

  // Check if destination was reached
  if (distances[destId] === Infinity) {
    return {
      success: false,
      error: `No walkable route found between "${locationMap.get(sourceId).name}" and "${locationMap.get(destId).name}". Road network may be disconnected.`,
      pathIds: [],
      pathLocations: [],
      totalDistance: 0,
      walkingTimeMinutes: 0,
    };
  }

  // Reconstruct the optimal path by backtracking from destId to sourceId
  const pathIds = [];
  let curr = destId;
  while (curr !== null) {
    pathIds.unshift(curr);
    curr = previous[curr];
  }

  const pathLocations = pathIds.map((id) => locationMap.get(id));
  const totalDistance = Math.round(distances[destId]);
  const walkingTimeMinutes = Math.max(1, Math.round(totalDistance / WALKING_SPEED_METERS_PER_MIN));

  // Build step-by-step turn-by-turn navigation instructions for viva demonstration
  const turnByTurn = [];
  for (let i = 0; i < pathLocations.length - 1; i++) {
    const fromLoc = pathLocations[i];
    const toLoc = pathLocations[i + 1];

    // Find the road distance between fromLoc and toLoc
    const edge = (graph.get(fromLoc._id.toString()) || []).find(
      (e) => e.nodeId === toLoc._id.toString()
    );
    const segDist = edge ? edge.distance : 0;

    turnByTurn.push({
      stepNumber: i + 1,
      from: fromLoc.name,
      to: toLoc.name,
      segmentDistance: segDist,
      instruction: `Walk approximately ${segDist}m from ${fromLoc.name} (${fromLoc.building}) towards ${toLoc.name}.`,
    });
  }

  return {
    success: true,
    pathIds,
    pathLocations,
    totalDistance,
    walkingTimeMinutes,
    turnByTurn,
  };
}
