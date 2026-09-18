/**
 * ============================================================================
 * DATABASE SEED SCRIPT FOR CAMPUS NAVIGATION SYSTEM
 * ============================================================================
 * 
 * Usage:
 *   node scripts/seed.js
 *   or: npm run seed
 * 
 * Description:
 *   Inserts sample college campus data including:
 *   - 1 Admin user, 1 Faculty user, 1 Student user, 1 Visitor user
 *   - 15 Campus Locations with realistic building types, descriptions, & coordinates
 *   - 22 Bidirectional Campus Roads with measured walking distances (in meters)
 * ============================================================================
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_navigation';

// Base coordinates for sample college campus (Sample coordinates: College Campus Green, Bangalore)
// Latitude: ~12.9716, Longitude: ~77.5946
const BASE_LAT = 12.9716;
const BASE_LNG = 77.5946;

// User Schema definition for standalone seed script
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'visitor', 'admin'], default: 'student' },
}, { timestamps: true });

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  description: { type: String, default: '' },
  building: { type: String, default: 'Main Campus' },
  floor: { type: String, default: 'Ground' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
}, { timestamps: true });

const roadSchema = new mongoose.Schema({
  source: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  distance: { type: Number, required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);
const Road = mongoose.models.Road || mongoose.model('Road', roadSchema);

const sampleLocations = [
  {
    name: 'Main Gate',
    type: 'Gate',
    description: 'Primary security checkpoint and entry point for vehicles and pedestrians.',
    building: 'Entrance Complex',
    floor: 'Ground',
    latitude: BASE_LAT,
    longitude: BASE_LNG,
  },
  {
    name: 'Administrative Block',
    type: 'Office',
    description: 'Principal office, admissions office, registrar, and finance desk.',
    building: 'Admin Tower',
    floor: '1st & 2nd Floor',
    latitude: BASE_LAT + 0.0012,
    longitude: BASE_LNG + 0.0008,
  },
  {
    name: 'Central Library',
    type: 'Library',
    description: '4-story academic library, digital repository, reading halls, and study cubicles.',
    building: 'Tagore Knowledge Hub',
    floor: 'Ground to 3rd Floor',
    latitude: BASE_LAT + 0.0022,
    longitude: BASE_LNG + 0.0014,
  },
  {
    name: 'Computer Science Block',
    type: 'Department',
    description: 'AI & Data Science Labs, Software Engineering Studios, and CS Faculty Offices.',
    building: 'Alan Turing Block',
    floor: '1st - 4th Floor',
    latitude: BASE_LAT + 0.0031,
    longitude: BASE_LNG + 0.0018,
  },
  {
    name: 'IT Block',
    type: 'Department',
    description: 'Information Technology labs, Cloud Computing center, and network server rooms.',
    building: 'Tim Berners-Lee Block',
    floor: '1st - 3rd Floor',
    latitude: BASE_LAT + 0.0035,
    longitude: BASE_LNG + 0.0026,
  },
  {
    name: 'Mechanical Block',
    type: 'Department',
    description: 'Robotics lab, CAD/CAM design workstations, heat transfer and thermodynamics labs.',
    building: 'Sir M. Visvesvaraya Block',
    floor: 'Ground & 1st Floor',
    latitude: BASE_LAT + 0.0025,
    longitude: BASE_LNG - 0.0012,
  },
  {
    name: 'Electrical Block',
    type: 'Department',
    description: 'Power systems, circuit analysis labs, control systems, and renewable energy cell.',
    building: 'Nikola Tesla Block',
    floor: '1st - 3rd Floor',
    latitude: BASE_LAT + 0.0033,
    longitude: BASE_LNG - 0.0006,
  },
  {
    name: 'Examination Cell',
    type: 'Office',
    description: 'Centralized evaluation centre, mark-sheet dispersal, and confidential records.',
    building: 'Admin Annex',
    floor: 'Ground Floor',
    latitude: BASE_LAT + 0.0016,
    longitude: BASE_LNG + 0.0019,
  },
  {
    name: 'Central Canteen',
    type: 'Canteen',
    description: 'Main campus cafeteria serving breakfast, lunch, snacks, and fresh beverages.',
    building: 'Student Amenities Centre',
    floor: 'Ground Floor',
    latitude: BASE_LAT + 0.0020,
    longitude: BASE_LNG + 0.0028,
  },
  {
    name: 'Auditorium',
    type: 'Building',
    description: '1,200-seat multi-purpose hall for convocations, tech symposiums, and cultural events.',
    building: 'Kala Mandir',
    floor: 'Ground Floor',
    latitude: BASE_LAT + 0.0011,
    longitude: BASE_LNG + 0.0027,
  },
  {
    name: 'Hostel A (Boys)',
    type: 'Hostel',
    description: 'Men undergraduate residency building with mess hall and study rooms.',
    building: 'Hostel Complex A',
    floor: '1st - 5th Floor',
    latitude: BASE_LAT + 0.0042,
    longitude: BASE_LNG + 0.0032,
  },
  {
    name: 'Hostel B (Girls)',
    type: 'Hostel',
    description: 'Women undergraduate residency building with 24/7 security and recreational hall.',
    building: 'Hostel Complex B',
    floor: '1st - 5th Floor',
    latitude: BASE_LAT + 0.0045,
    longitude: BASE_LNG + 0.0015,
  },
  {
    name: 'Sports Ground',
    type: 'Sports',
    description: 'Running track, football ground, basketball court, and athletic pavilion.',
    building: 'Sports Complex',
    floor: 'Open Field',
    latitude: BASE_LAT + 0.0015,
    longitude: BASE_LNG - 0.0025,
  },
  {
    name: 'Medical Center',
    type: 'Other',
    description: 'First aid, qualified nurse, basic pharmacy, and 24/7 emergency campus ambulance.',
    building: 'Health & Wellness Clinic',
    floor: 'Ground Floor',
    latitude: BASE_LAT + 0.0008,
    longitude: BASE_LNG + 0.0015,
  },
  {
    name: 'Parking Area',
    type: 'Parking',
    description: 'Dedicated parking zone for two-wheelers, four-wheelers, and college transit buses.',
    building: 'South Gate Parking Lot',
    floor: 'Open Ground',
    latitude: BASE_LAT - 0.0006,
    longitude: BASE_LNG + 0.0004,
  },
];

// Campus road connectivity with realistic walking distances in meters
const roadConnections = [
  { from: 'Main Gate', to: 'Administrative Block', distance: 150 },
  { from: 'Main Gate', to: 'Parking Area', distance: 80 },
  { from: 'Main Gate', to: 'Medical Center', distance: 120 },
  { from: 'Administrative Block', to: 'Central Library', distance: 130 },
  { from: 'Administrative Block', to: 'Auditorium', distance: 180 },
  { from: 'Administrative Block', to: 'Examination Cell', distance: 90 },
  { from: 'Central Library', to: 'Computer Science Block', distance: 120 },
  { from: 'Central Library', to: 'Central Canteen', distance: 110 },
  { from: 'Computer Science Block', to: 'IT Block', distance: 80 },
  { from: 'Computer Science Block', to: 'Electrical Block', distance: 160 },
  { from: 'IT Block', to: 'Hostel A (Boys)', distance: 140 },
  { from: 'Computer Science Block', to: 'Hostel B (Girls)', distance: 170 },
  { from: 'Hostel A (Boys)', to: 'Hostel B (Girls)', distance: 200 },
  { from: 'Central Canteen', to: 'IT Block', distance: 150 },
  { from: 'Central Canteen', to: 'Auditorium', distance: 100 },
  { from: 'Administrative Block', to: 'Mechanical Block', distance: 220 },
  { from: 'Mechanical Block', to: 'Electrical Block', distance: 130 },
  { from: 'Mechanical Block', to: 'Sports Ground', distance: 140 },
  { from: 'Sports Ground', to: 'Main Gate', distance: 260 },
  { from: 'Examination Cell', to: 'Central Library', distance: 95 },
  { from: 'Medical Center', to: 'Auditorium', distance: 130 },
  { from: 'Electrical Block', to: 'Hostel B (Girls)', distance: 190 },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 6000 });
    console.log('Connected to MongoDB successfully.');

    // Clear existing collections
    console.log('Clearing old campus data...');
    await Promise.all([
      User.deleteMany({}),
      Location.deleteMany({}),
      Road.deleteMany({}),
    ]);

    // 1. Seed Users
    console.log('Seeding Users...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const userPassword = await bcrypt.hash('Student@123', salt);

    const users = await User.insertMany([
      {
        name: 'Campus Administrator',
        email: 'admin@campus.edu',
        password: adminPassword,
        role: 'admin',
      },
      {
        name: 'Prof. Sharma (CSE Dept)',
        email: 'faculty@campus.edu',
        password: userPassword,
        role: 'faculty',
      },
      {
        name: 'Rahul Verma (Student)',
        email: 'student@campus.edu',
        password: userPassword,
        role: 'student',
      },
      {
        name: 'Priya Patel (Visitor)',
        email: 'visitor@campus.edu',
        password: userPassword,
        role: 'visitor',
      },
    ]);
    console.log(` Created ${users.length} sample users.`);

    // 2. Seed Locations
    console.log('Seeding Campus Locations...');
    const createdLocations = await Location.insertMany(sampleLocations);
    console.log(` Created ${createdLocations.length} campus locations.`);

    // Map location names to MongoDB ObjectIds
    const locationMap = new Map();
    for (const loc of createdLocations) {
      locationMap.set(loc.name, loc._id);
    }

    // 3. Seed Roads
    console.log('Seeding Campus Roads/Pathways...');
    const roadsToInsert = [];
    for (const conn of roadConnections) {
      const sourceId = locationMap.get(conn.from);
      const destId = locationMap.get(conn.to);

      if (!sourceId || !destId) {
        console.warn(`Warning: Could not link "${conn.from}" and "${conn.to}"`);
        continue;
      }

      roadsToInsert.push({
        source: sourceId,
        destination: destId,
        distance: conn.distance,
      });
    }

    const createdRoads = await Road.insertMany(roadsToInsert);
    console.log(` Created ${createdRoads.length} connected campus roads.`);

    console.log('\n==================================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
    console.log('Credentials for Viva / Demonstration:');
    console.log('  Admin User   : admin@campus.edu   / Admin@123');
    console.log('  Student User : student@campus.edu / Student@123');
    console.log('  Faculty User : faculty@campus.edu / Student@123');
    console.log('  Visitor User : visitor@campus.edu / Student@123');
    console.log('==================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(' Seeding Failed:', error.message);
    if (error.name === 'MongooseServerSelectionError') {
      console.log('\nNOTE: MongoDB does not appear to be running locally on port 27017.');
      console.log('To connect to MongoDB Atlas, set MONGODB_URI in .env.local:');
      console.log('  MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/campus_navigation?retryWrites=true&w=majority"\n');
    }
    process.exit(1);
  }
}

seed();
