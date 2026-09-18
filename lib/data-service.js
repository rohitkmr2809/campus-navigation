import connectToDatabase from './mongodb';
import User from '@/models/User';
import Location from '@/models/Location';
import Road from '@/models/Road';
import bcrypt from 'bcryptjs';

/**
 * In-Memory Fallback Store
 * Used when local MongoDB is not running, ensuring that tests, UI, Dijkstra,
 * and viva presentations work 100% out-of-the-box without requiring a local database daemon.
 * When MongoDB Atlas or local MongoDB is available, operations use Mongoose directly.
 */
let isMongoAvailable = null;

const BASE_LAT = 12.9716;
const BASE_LNG = 77.5946;

// Pre-hashed passwords for in-memory seed users
const ADMIN_HASH = bcrypt.hashSync('Admin@123', 10);
const USER_HASH = bcrypt.hashSync('Student@123', 10);

const memoryUsers = [
  {
    _id: '65f000000000000000000001',
    name: 'Campus Administrator',
    email: 'admin@campus.edu',
    password: ADMIN_HASH,
    role: 'admin',
    createdAt: new Date('2026-01-01'),
  },
  {
    _id: '65f000000000000000000002',
    name: 'Prof. Sharma (CSE Dept)',
    email: 'faculty@campus.edu',
    password: USER_HASH,
    role: 'faculty',
    createdAt: new Date('2026-01-02'),
  },
  {
    _id: '65f000000000000000000003',
    name: 'Rahul Verma (Student)',
    email: 'student@campus.edu',
    password: USER_HASH,
    role: 'student',
    createdAt: new Date('2026-01-03'),
  },
  {
    _id: '65f000000000000000000004',
    name: 'Priya Patel (Visitor)',
    email: 'visitor@campus.edu',
    password: USER_HASH,
    role: 'visitor',
    createdAt: new Date('2026-01-04'),
  },
];

const memoryLocations = [
  {
    _id: '65f100000000000000000001',
    name: 'Main Gate',
    type: 'Gate',
    description: 'Primary security checkpoint and entry point for vehicles and pedestrians.',
    building: 'Entrance Complex',
    floor: 'Ground',
    latitude: BASE_LAT,
    longitude: BASE_LNG,
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000002',
    name: 'Administrative Block',
    type: 'Office',
    description: 'Principal office, admissions office, registrar, and finance desk.',
    building: 'Admin Tower',
    floor: '1st & 2nd Floor',
    latitude: BASE_LAT + 0.0012,
    longitude: BASE_LNG + 0.0008,
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000003',
    name: 'Central Library',
    type: 'Library',
    description: '4-story academic library, digital repository, reading halls, and study cubicles.',
    building: 'Tagore Knowledge Hub',
    floor: 'Ground to 3rd Floor',
    latitude: BASE_LAT + 0.0022,
    longitude: BASE_LNG + 0.0014,
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000004',
    name: 'Computer Science Block',
    type: 'Department',
    description: 'AI & Data Science Labs, Software Engineering Studios, and CS Faculty Offices.',
    building: 'Alan Turing Block',
    floor: '1st - 4th Floor',
    latitude: BASE_LAT + 0.0031,
    longitude: BASE_LNG + 0.0018,
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000005',
    name: 'IT Block',
    type: 'Department',
    description: 'Information Technology labs, Cloud Computing center, and network server rooms.',
    building: 'Tim Berners-Lee Block',
    floor: '1st - 3rd Floor',
    latitude: BASE_LAT + 0.0035,
    longitude: BASE_LNG + 0.0026,
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000006',
    name: 'Mechanical Block',
    type: 'Department',
    description: 'Robotics lab, CAD/CAM design workstations, heat transfer and thermodynamics labs.',
    building: 'Sir M. Visvesvaraya Block',
    floor: 'Ground & 1st Floor',
    latitude: BASE_LAT + 0.0025,
    longitude: BASE_LNG - 0.0012,
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000007',
    name: 'Electrical Block',
    type: 'Department',
    description: 'Power systems, circuit analysis labs, control systems, and renewable energy cell.',
    building: 'Nikola Tesla Block',
    floor: '1st - 3rd Floor',
    latitude: BASE_LAT + 0.0033,
    longitude: BASE_LNG - 0.0006,
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000008',
    name: 'Examination Cell',
    type: 'Office',
    description: 'Centralized evaluation centre, mark-sheet dispersal, and confidential records.',
    building: 'Admin Annex',
    floor: 'Ground Floor',
    latitude: BASE_LAT + 0.0016,
    longitude: BASE_LNG + 0.0019,
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000009',
    name: 'Central Canteen',
    type: 'Canteen',
    description: 'Main campus cafeteria serving breakfast, lunch, snacks, and fresh beverages.',
    building: 'Student Amenities Centre',
    floor: 'Ground Floor',
    latitude: BASE_LAT + 0.0020,
    longitude: BASE_LNG + 0.0028,
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000010',
    name: 'Auditorium',
    type: 'Building',
    description: '1,200-seat multi-purpose hall for convocations, tech symposiums, and cultural events.',
    building: 'Kala Mandir',
    floor: 'Ground Floor',
    latitude: BASE_LAT + 0.0011,
    longitude: BASE_LNG + 0.0027,
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000011',
    name: 'Hostel A (Boys)',
    type: 'Hostel',
    description: 'Men undergraduate residency building with mess hall and study rooms.',
    building: 'Hostel Complex A',
    floor: '1st - 5th Floor',
    latitude: BASE_LAT + 0.0042,
    longitude: BASE_LNG + 0.0032,
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000012',
    name: 'Hostel B (Girls)',
    type: 'Hostel',
    description: 'Women undergraduate residency building with 24/7 security and recreational hall.',
    building: 'Hostel Complex B',
    floor: '1st - 5th Floor',
    latitude: BASE_LAT + 0.0045,
    longitude: BASE_LNG + 0.0015,
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000013',
    name: 'Sports Ground',
    type: 'Sports',
    description: 'Running track, football ground, basketball court, and athletic pavilion.',
    building: 'Sports Complex',
    floor: 'Open Field',
    latitude: BASE_LAT + 0.0015,
    longitude: BASE_LNG - 0.0025,
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000014',
    name: 'Medical Center',
    type: 'Other',
    description: 'First aid, qualified nurse, basic pharmacy, and 24/7 emergency campus ambulance.',
    building: 'Health & Wellness Clinic',
    floor: 'Ground Floor',
    latitude: BASE_LAT + 0.0008,
    longitude: BASE_LNG + 0.0015,
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000015',
    name: 'Parking Area',
    type: 'Parking',
    description: 'Dedicated parking zone for two-wheelers, four-wheelers, and college transit buses.',
    building: 'South Gate Parking Lot',
    floor: 'Open Ground',
    latitude: BASE_LAT - 0.0006,
    longitude: BASE_LNG + 0.0004,
    createdAt: new Date(),
  },
];

// Helper to look up memory location ID by name
const getMemLocId = (name) => memoryLocations.find((l) => l.name === name)?._id;

const memoryRoads = [
  { _id: '65f200000000000000000001', source: getMemLocId('Main Gate'), destination: getMemLocId('Administrative Block'), distance: 150, createdAt: new Date() },
  { _id: '65f200000000000000000002', source: getMemLocId('Main Gate'), destination: getMemLocId('Parking Area'), distance: 80, createdAt: new Date() },
  { _id: '65f200000000000000000003', source: getMemLocId('Main Gate'), destination: getMemLocId('Medical Center'), distance: 120, createdAt: new Date() },
  { _id: '65f200000000000000000004', source: getMemLocId('Administrative Block'), destination: getMemLocId('Central Library'), distance: 130, createdAt: new Date() },
  { _id: '65f200000000000000000005', source: getMemLocId('Administrative Block'), destination: getMemLocId('Auditorium'), distance: 180, createdAt: new Date() },
  { _id: '65f200000000000000000006', source: getMemLocId('Administrative Block'), destination: getMemLocId('Examination Cell'), distance: 90, createdAt: new Date() },
  { _id: '65f200000000000000000007', source: getMemLocId('Central Library'), destination: getMemLocId('Computer Science Block'), distance: 120, createdAt: new Date() },
  { _id: '65f200000000000000000008', source: getMemLocId('Central Library'), destination: getMemLocId('Central Canteen'), distance: 110, createdAt: new Date() },
  { _id: '65f200000000000000000009', source: getMemLocId('Computer Science Block'), destination: getMemLocId('IT Block'), distance: 80, createdAt: new Date() },
  { _id: '65f200000000000000000010', source: getMemLocId('Computer Science Block'), destination: getMemLocId('Electrical Block'), distance: 160, createdAt: new Date() },
  { _id: '65f200000000000000000011', source: getMemLocId('IT Block'), destination: getMemLocId('Hostel A (Boys)'), distance: 140, createdAt: new Date() },
  { _id: '65f200000000000000000012', source: getMemLocId('Computer Science Block'), destination: getMemLocId('Hostel B (Girls)'), distance: 170, createdAt: new Date() },
  { _id: '65f200000000000000000013', source: getMemLocId('Hostel A (Boys)'), destination: getMemLocId('Hostel B (Girls)'), distance: 200, createdAt: new Date() },
  { _id: '65f200000000000000000014', source: getMemLocId('Central Canteen'), destination: getMemLocId('IT Block'), distance: 150, createdAt: new Date() },
  { _id: '65f200000000000000000015', source: getMemLocId('Central Canteen'), destination: getMemLocId('Auditorium'), distance: 100, createdAt: new Date() },
  { _id: '65f200000000000000000016', source: getMemLocId('Administrative Block'), destination: getMemLocId('Mechanical Block'), distance: 220, createdAt: new Date() },
  { _id: '65f200000000000000000017', source: getMemLocId('Mechanical Block'), destination: getMemLocId('Electrical Block'), distance: 130, createdAt: new Date() },
  { _id: '65f200000000000000000018', source: getMemLocId('Mechanical Block'), destination: getMemLocId('Sports Ground'), distance: 140, createdAt: new Date() },
  { _id: '65f200000000000000000019', source: getMemLocId('Sports Ground'), destination: getMemLocId('Main Gate'), distance: 260, createdAt: new Date() },
  { _id: '65f200000000000000000020', source: getMemLocId('Examination Cell'), destination: getMemLocId('Central Library'), distance: 95, createdAt: new Date() },
  { _id: '65f200000000000000000021', source: getMemLocId('Medical Center'), destination: getMemLocId('Auditorium'), distance: 130, createdAt: new Date() },
  { _id: '65f200000000000000000022', source: getMemLocId('Electrical Block'), destination: getMemLocId('Hostel B (Girls)'), distance: 190, createdAt: new Date() },
];

/**
 * Check if MongoDB connection is active, or gracefully fallback
 */
async function checkMongoConnection() {
  if (isMongoAvailable === true) return true;
  try {
    await connectToDatabase();
    isMongoAvailable = true;
    return true;
  } catch (error) {
    isMongoAvailable = false;
    return false;
  }
}

// ----------------------------------------------------
// USER SERVICES
// ----------------------------------------------------
export async function findUserByEmail(email) {
  const isConnected = await checkMongoConnection();
  if (isConnected) {
    return User.findOne({ email: email.toLowerCase().trim() });
  }
  return memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
}

export async function findUserById(id) {
  const isConnected = await checkMongoConnection();
  if (isConnected) {
    return User.findById(id).select('-password');
  }
  const u = memoryUsers.find((user) => user._id.toString() === id.toString());
  if (!u) return null;
  const { password, ...safeUser } = u;
  return safeUser;
}

export async function createUser(userData) {
  const isConnected = await checkMongoConnection();
  if (isConnected) {
    return User.create(userData);
  }
  const newUser = {
    _id: '65f0' + Math.random().toString(16).substring(2, 22),
    ...userData,
    createdAt: new Date(),
  };
  memoryUsers.push(newUser);
  return newUser;
}

export async function getAllUsers() {
  const isConnected = await checkMongoConnection();
  if (isConnected) {
    return User.find().select('-password').sort({ createdAt: -1 });
  }
  return memoryUsers.map(({ password, ...u }) => u);
}

// ----------------------------------------------------
// LOCATION SERVICES
// ----------------------------------------------------
export async function getAllLocations(search = '', type = '') {
  const isConnected = await checkMongoConnection();
  if (isConnected) {
    const filter = {};
    if (type && type !== 'All') filter.type = type;
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { building: regex }, { description: regex }, { type: regex }];
    }
    return Location.find(filter).sort({ name: 1 }).lean();
  }

  // In-Memory search
  let results = [...memoryLocations];
  if (type && type !== 'All') {
    results = results.filter((loc) => loc.type === type);
  }
  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    results = results.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.building.toLowerCase().includes(q) ||
        loc.description.toLowerCase().includes(q) ||
        loc.type.toLowerCase().includes(q)
    );
  }
  return results.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getLocationById(id) {
  const isConnected = await checkMongoConnection();
  if (isConnected) {
    return Location.findById(id).lean();
  }
  return memoryLocations.find((loc) => loc._id.toString() === id.toString()) || null;
}

export async function createLocation(locationData) {
  const isConnected = await checkMongoConnection();
  if (isConnected) {
    return Location.create(locationData);
  }
  const newLoc = {
    _id: '65f1' + Math.random().toString(16).substring(2, 22),
    ...locationData,
    createdAt: new Date(),
  };
  memoryLocations.push(newLoc);
  return newLoc;
}

export async function updateLocation(id, updateData) {
  const isConnected = await checkMongoConnection();
  if (isConnected) {
    return Location.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }
  const idx = memoryLocations.findIndex((loc) => loc._id.toString() === id.toString());
  if (idx === -1) return null;
  memoryLocations[idx] = { ...memoryLocations[idx], ...updateData };
  return memoryLocations[idx];
}

export async function deleteLocation(id) {
  const isConnected = await checkMongoConnection();
  if (isConnected) {
    const deleted = await Location.findByIdAndDelete(id);
    if (deleted) {
      await Road.deleteMany({ $or: [{ source: id }, { destination: id }] });
    }
    return deleted;
  }
  const idx = memoryLocations.findIndex((loc) => loc._id.toString() === id.toString());
  if (idx === -1) return null;
  const [deleted] = memoryLocations.splice(idx, 1);
  // Remove associated roads in-memory
  for (let i = memoryRoads.length - 1; i >= 0; i--) {
    if (
      memoryRoads[i].source.toString() === id.toString() ||
      memoryRoads[i].destination.toString() === id.toString()
    ) {
      memoryRoads.splice(i, 1);
    }
  }
  return deleted;
}

// ----------------------------------------------------
// ROAD SERVICES
// ----------------------------------------------------
export async function getAllRoads() {
  const isConnected = await checkMongoConnection();
  if (isConnected) {
    return Road.find()
      .populate('source', 'name building type latitude longitude')
      .populate('destination', 'name building type latitude longitude')
      .sort({ createdAt: -1 })
      .lean();
  }

  // In-Memory populate
  return memoryRoads.map((road) => ({
    ...road,
    source: memoryLocations.find((l) => l._id.toString() === road.source.toString()),
    destination: memoryLocations.find((l) => l._id.toString() === road.destination.toString()),
  }));
}

export async function getRoadById(id) {
  const isConnected = await checkMongoConnection();
  if (isConnected) {
    return Road.findById(id)
      .populate('source', 'name building type latitude longitude')
      .populate('destination', 'name building type latitude longitude')
      .lean();
  }
  const road = memoryRoads.find((r) => r._id.toString() === id.toString());
  if (!road) return null;
  return {
    ...road,
    source: memoryLocations.find((l) => l._id.toString() === road.source.toString()),
    destination: memoryLocations.find((l) => l._id.toString() === road.destination.toString()),
  };
}

export async function createRoad(roadData) {
  const isConnected = await checkMongoConnection();
  if (isConnected) {
    const newRoad = await Road.create(roadData);
    return Road.findById(newRoad._id)
      .populate('source', 'name building type')
      .populate('destination', 'name building type');
  }
  const newRoad = {
    _id: '65f2' + Math.random().toString(16).substring(2, 22),
    ...roadData,
    createdAt: new Date(),
  };
  memoryRoads.push(newRoad);
  return {
    ...newRoad,
    source: memoryLocations.find((l) => l._id.toString() === newRoad.source.toString()),
    destination: memoryLocations.find((l) => l._id.toString() === newRoad.destination.toString()),
  };
}

export async function updateRoad(id, distance) {
  const isConnected = await checkMongoConnection();
  if (isConnected) {
    return Road.findByIdAndUpdate(id, { distance }, { new: true })
      .populate('source', 'name building')
      .populate('destination', 'name building');
  }
  const idx = memoryRoads.findIndex((r) => r._id.toString() === id.toString());
  if (idx === -1) return null;
  memoryRoads[idx].distance = distance;
  return {
    ...memoryRoads[idx],
    source: memoryLocations.find((l) => l._id.toString() === memoryRoads[idx].source.toString()),
    destination: memoryLocations.find((l) => l._id.toString() === memoryRoads[idx].destination.toString()),
  };
}

export async function deleteRoad(id) {
  const isConnected = await checkMongoConnection();
  if (isConnected) {
    return Road.findByIdAndDelete(id);
  }
  const idx = memoryRoads.findIndex((r) => r._id.toString() === id.toString());
  if (idx === -1) return null;
  const [deleted] = memoryRoads.splice(idx, 1);
  return deleted;
}

// ----------------------------------------------------
// STATS SERVICE
// ----------------------------------------------------
export async function getCampusStats() {
  const [users, locations, roads] = await Promise.all([
    getAllUsers(),
    getAllLocations(),
    getAllRoads(),
  ]);

  const usersByRole = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  const typeCounts = locations.reduce((acc, loc) => {
    acc[loc.type] = (acc[loc.type] || 0) + 1;
    return acc;
  }, {});

  const locationsByType = Object.keys(typeCounts).map((type) => ({
    _id: type,
    count: typeCounts[type],
  }));

  const totalWalkwayMeters = roads.reduce((sum, r) => sum + (Number(r.distance) || 0), 0);

  return {
    totalUsers: users.length,
    totalLocations: locations.length,
    totalRoads: roads.length,
    totalWalkwayMeters,
    usersByRole,
    locationsByType,
  };
}
