import mongoose from 'mongoose';

export const LOCATION_TYPES = [
  'Building',
  'Department',
  'Classroom',
  'Laboratory',
  'Library',
  'Canteen',
  'Hostel',
  'Parking',
  'Office',
  'Sports',
  'Gate',
  'Other',
];

const LocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a location name'],
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      enum: LOCATION_TYPES,
      default: 'Building',
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    building: {
      type: String,
      trim: true,
      default: 'Main Campus',
    },
    floor: {
      type: String,
      trim: true,
      default: 'Ground',
    },
    latitude: {
      type: Number,
      required: [true, 'Please provide latitude coordinate'],
    },
    longitude: {
      type: Number,
      required: [true, 'Please provide longitude coordinate'],
    },
  },
  {
    timestamps: true,
  }
);

// Search text index for fast location name & description matching
LocationSchema.index({ name: 'text', description: 'text', building: 'text' });

export default mongoose.models.Location || mongoose.model('Location', LocationSchema);
