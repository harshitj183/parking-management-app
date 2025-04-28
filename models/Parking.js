const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  totalSlots: {
    type: Number,
    required: true
  },
  availableSlots: {
    type: Number,
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  amenities: {
    type: [String],
    default: []
  },
  images: [String],
  rating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Create a geospatial index on the location field
parkingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Parking', parkingSchema);