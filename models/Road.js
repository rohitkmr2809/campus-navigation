import mongoose from 'mongoose';

const RoadSchema = new mongoose.Schema(
  {
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Please provide source location'],
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Please provide destination location'],
    },
    distance: {
      type: Number,
      required: [true, 'Please provide road distance in meters'],
      min: [1, 'Distance must be at least 1 meter'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast query of edges
RoadSchema.index({ source: 1, destination: 1 });

export default mongoose.models.Road || mongoose.model('Road', RoadSchema);
