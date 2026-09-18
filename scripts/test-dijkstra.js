/**
 * Standalone verification script for Dijkstra algorithm (Module 6)
 */
import { findShortestPath, buildCampusGraph } from '../lib/dijkstra.js';

console.log('--- TESTING DIJKSTRA SHORTEST PATH ALGORITHM ---');

// Mock Campus Locations
const mockLocations = [
  { _id: '1', name: 'Main Gate', building: 'Entrance', latitude: 12.971, longitude: 77.591 },
  { _id: '2', name: 'Admin Block', building: 'Administration', latitude: 12.972, longitude: 77.592 },
  { _id: '3', name: 'Central Library', building: 'Library', latitude: 12.973, longitude: 77.593 },
  { _id: '4', name: 'CSE Block', building: 'Tech Block A', latitude: 12.974, longitude: 77.594 },
  { _id: '5', name: 'Canteen', building: 'Amenities', latitude: 12.972, longitude: 77.595 },
  { _id: '6', name: 'Isolated Tower', building: 'Far Away', latitude: 12.980, longitude: 77.600 },
];

// Mock Roads:
// 1 -> 2 (100m)
// 2 -> 3 (150m)
// 3 -> 4 (120m) => Route 1->2->3->4 = 370m
// Alternative longer route: 1 -> 5 (300m), 5 -> 4 (250m) => Route 1->5->4 = 550m
const mockRoads = [
  { source: '1', destination: '2', distance: 100 },
  { source: '2', destination: '3', distance: 150 },
  { source: '3', destination: '4', distance: 120 },
  { source: '1', destination: '5', distance: 300 },
  { source: '5', destination: '4', distance: 250 },
  // Notice node '6' has no roads connecting it (disconnected)
];

// Test 1: Shortest Path from Main Gate (1) to CSE Block (4)
const result1 = findShortestPath('1', '4', mockLocations, mockRoads);
console.log('\n[TEST 1] Main Gate -> CSE Block');
console.log('Result Success:', result1.success);
console.log('Path Nodes:', result1.pathLocations.map((l) => l.name).join(' -> '));
console.log('Expected Distance: 370m | Actual Distance:', result1.totalDistance + 'm');
console.log('Walking Time:', result1.walkingTimeMinutes + ' min');
console.assert(result1.totalDistance === 370, 'Test 1 Failed: Distance should be 370m');
console.assert(result1.pathIds.join(',') === '1,2,3,4', 'Test 1 Failed: Path should be 1 -> 2 -> 3 -> 4');

// Test 2: Same start and destination
const result2 = findShortestPath('2', '2', mockLocations, mockRoads);
console.log('\n[TEST 2] Admin Block -> Admin Block (Same Location)');
console.log('Result Success:', result2.success);
console.log('Distance:', result2.totalDistance + 'm');
console.assert(result2.totalDistance === 0, 'Test 2 Failed: Distance should be 0');

// Test 3: Disconnected destination
const result3 = findShortestPath('1', '6', mockLocations, mockRoads);
console.log('\n[TEST 3] Main Gate -> Isolated Tower (Disconnected)');
console.log('Result Success:', result3.success);
console.log('Error Message:', result3.error);
console.assert(result3.success === false, 'Test 3 Failed: Should be unsuccessful');

console.log('\n ALL DIJKSTRA ALGORITHM UNIT TESTS PASSED SUCCESSFULLY!');
