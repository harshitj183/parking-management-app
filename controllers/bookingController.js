const Booking = require('../models/Booking');
const Parking = require('../models/Parking');
const mongoose = require('mongoose');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      parkingId,
      slotNumber,
      vehicleType,
      vehicleNumber,
      startTime,
      endTime,
      duration,
      userId
    } = req.body;

    // Validate required fields
    if (!parkingId || !slotNumber || !vehicleType || !vehicleNumber || !startTime || !endTime || !duration) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate vehicle number format
    const vehicleRegex = /^[A-Z0-9]{2,12}$/i;
    if (!vehicleRegex.test(vehicleNumber)) {
      return res.status(400).json({ message: 'Invalid vehicle number format' });
    }

    // Find the parking location to calculate price
    const parking = await Parking.findById(parkingId);
    if (!parking) {
      return res.status(404).json({ message: 'Parking location not found' });
    }

    // Check if slot is already booked for the requested time
    const overlappingBooking = await Booking.findOne({
      parkingId,
      slotNumber,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (overlappingBooking) {
      return res.status(409).json({ message: 'This slot is already booked for the requested time' });
    }

    // Calculate total price
    const totalPrice = parseFloat(parking.pricePerHour) * parseFloat(duration);

    // Create a new booking
    const newBooking = new Booking({
      parkingId,
      slotNumber,
      vehicleType,
      vehicleNumber,
      startTime,
      endTime,
      duration,
      totalPrice,
      userId,
      status: 'pending',
      paymentStatus: 'unpaid',
      bookingDate: new Date()
    });

    // Save the booking
    const savedBooking = await newBooking.save();

    // Update available slots in parking
    await Parking.findByIdAndUpdate(parkingId, {
      $inc: { availableSlots: -1 }
    });

    // TODO: Send booking confirmation email
    // This would be implemented with a proper email service
    console.log(`Booking confirmation email would be sent to user ${userId}`);

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('parkingId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Increase available slots when booking is cancelled
    await Parking.findByIdAndUpdate(booking.parkingId, {
      $inc: { availableSlots: 1 }
    });
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Extend booking duration
exports.extendBooking = async (req, res) => {
  try {
    const { additionalHours } = req.body;
    const bookingId = req.params.id;
    
    if (!additionalHours || additionalHours <= 0) {
      return res.status(400).json({ message: 'Valid additional hours are required' });
    }
    
    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking is active
    if (booking.status !== 'confirmed' && booking.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot extend a completed or cancelled booking' });
    }
    
    // Find the parking location to calculate price
    const parking = await Parking.findById(booking.parkingId);
    if (!parking) {
      return res.status(404).json({ message: 'Parking location not found' });
    }
    
    // Calculate extended price
    const extendedPrice = parseFloat(parking.pricePerHour) * parseFloat(additionalHours);
    
    // Create extension record
    const extension = {
      extendedTime: additionalHours,
      extendedPrice: extendedPrice,
      extendedAt: new Date(),
      paymentStatus: 'pending'
    };
    
    // Calculate new end time
    const currentEndTime = new Date(booking.endTime);
    const newEndTime = new Date(currentEndTime.getTime() + (additionalHours * 60 * 60 * 1000));
    
    // Update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        $push: { extensions: extension },
        endTime: newEndTime,
        duration: booking.duration + additionalHours,
        totalPrice: booking.totalPrice + extendedPrice,
        isExtended: true
      },
      { new: true }
    );
    
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Complete extension payment
exports.completeExtensionPayment = async (req, res) => {
  try {
    const { bookingId, extensionId } = req.params;
    
    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Find the specific extension
    const extension = booking.extensions.id(extensionId);
    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }
    
    // Update the extension payment status
    extension.paymentStatus = 'completed';
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Render booking form
exports.renderBookingForm = async (req, res) => {
  try {
    const parkingId = req.params.parkingId;
    console.log(`Received parkingId parameter: ${parkingId}`);
    
    // First try to find by MongoDB ID
    let parking = null;
    if (mongoose.Types.ObjectId.isValid(parkingId)) {
      console.log('Valid MongoDB ID, searching by ID');
      parking = await Parking.findById(parkingId);
      if (parking) {
        console.log(`Found parking by ID: ${parking.name}`);
      } else {
        console.log('No parking found with this ID');
      }
    } else {
      console.log('Not a valid MongoDB ID, will try to search by name');
    }
    
    // If not found, try to find by slug (converted name)
    if (!parking) {
      // Convert slug back to a name-like format
      const nameQuery = parkingId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      console.log(`Converted slug to name query: "${nameQuery}"`);
      
      // Try to find by name (case insensitive)
      parking = await Parking.findOne({ 
        name: { $regex: new RegExp('^' + nameQuery, 'i') }
      });
      
      if (parking) {
        console.log(`Found parking by name: ${parking.name} with ID: ${parking._id}`);
      } else {
        console.log('No parking found with this name pattern');
      }
    }
    
    // If still not found, return error
    if (!parking) {
      console.log('No parking found by any method, returning 404');
      return res.status(404).render('error', { 
        title: 'Parking Not Found',
        message: 'The parking location you requested could not be found.' 
      });
    }
    
    res.render('booking-form', { 
      parking, 
      title: 'Book Parking Slot',
      vehicleTypes: ['Car', 'Motorcycle', 'SUV', 'Truck']
    });
  } catch (error) {
    console.error('Error in renderBookingForm:', error);
    res.status(500).render('error', { 
      title: 'Error', 
      message: error.message 
    });
  }
};

// Render slot selection page
exports.renderSlotSelection = async (req, res) => {
  try {
    const parkingId = req.params.parkingId;
    
    // First try to find by MongoDB ID
    let parking = null;
    if (mongoose.Types.ObjectId.isValid(parkingId)) {
      parking = await Parking.findById(parkingId);
    }
    
    // If not found, try to find by slug (converted name)
    if (!parking) {
      // Convert slug back to a name-like format
      const nameQuery = parkingId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Try to find by name (case insensitive)
      parking = await Parking.findOne({ 
        name: { $regex: new RegExp('^' + nameQuery, 'i') }
      });
    }
    
    // If still not found, return error
    if (!parking) {
      return res.status(404).render('error', { 
        title: 'Parking Not Found',
        message: 'The parking location you requested could not be found.' 
      });
    }
    
    // Get all bookings for this parking to determine which slots are occupied
    const bookings = await Booking.find({ 
      parkingId: parking._id,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    // Create array of occupied slot numbers
    const occupiedSlots = bookings.map(booking => booking.slotNumber);
    
    res.render('slot-selection', { 
      parking, 
      occupiedSlots,
      title: 'Select Parking Slot',
      formData: req.body // Pass form data from previous step
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      message: error.message 
    });
  }
};

// Render booking confirmation page
exports.renderBookingConfirmation = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId).populate('parkingId');
    
    if (!booking) {
      return res.status(404).render('error', { message: 'Booking not found' });
    }
    
    res.render('booking-confirmation', { 
      booking, 
      title: 'Booking Confirmation'
    });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

// Render extend booking form
exports.renderExtendBookingForm = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId).populate('parkingId');
    
    if (!booking) {
      return res.status(404).render('error', { 
        message: 'Booking not found',
        title: 'Error'
      });
    }
    
    res.render('extend-booking', { 
      booking, 
      title: 'Extend Parking Time',
      pricePerHour: booking.parkingId.pricePerHour
    });
  } catch (error) {
    res.status(500).render('error', { 
      message: error.message,
      title: 'Error'
    });
  }
};