const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  parkingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
    required: true
  },
  slotNumber: {
    type: Number,
    required: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['Car', 'Motorcycle', 'SUV', 'Truck']
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,  // in hours
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  userId: {
    type: String,
    required: true
  },
  extensions: [{
    extendedTime: {
      type: Number, // additional hours
      required: true
    },
    extendedPrice: {
      type: Number,
      required: true
    },
    extendedAt: {
      type: Date,
      default: Date.now
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    }
  }],
  isExtended: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);