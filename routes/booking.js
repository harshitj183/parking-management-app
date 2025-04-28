const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// View Routes - More specific routes first
router.get('/parkings', (req, res) => {
    res.render('my-parkings', { title: 'My Parkings' });
});

router.get('/my-bookings', (req, res) => {
    res.render('my-parkings', { title: 'My Parkings' });
});

// Direct routes for specific parking locations - Fixing the 404 issue
router.get('/form/680b0d7e393a23c4f3811043', (req, res) => {
    // DLF CyberHub hardcoded
    res.render('booking-form', { 
        parking: {
            _id: '680b0d7e393a23c4f3811043',
            name: 'DLF CyberHub Parking',
            address: 'DLF Cyber City, Gurugram',
            pricePerHour: 80,
            availableSlots: 120,
            totalSlots: 200
        },
        title: 'Book Parking Slot',
        vehicleTypes: ['Car', 'Motorcycle', 'SUV', 'Truck']
    });
});

router.get('/form/680b0d7e393a23c4f3811044', (req, res) => {
    // Ambience Mall hardcoded
    res.render('booking-form', { 
        parking: {
            _id: '680b0d7e393a23c4f3811044',
            name: 'Ambience Mall Parking',
            address: 'NH-48, Ambience Island, Gurugram',
            pricePerHour: 60,
            availableSlots: 200,
            totalSlots: 350
        },
        title: 'Book Parking Slot',
        vehicleTypes: ['Car', 'Motorcycle', 'SUV', 'Truck']
    });
});

router.get('/form/680b0d7e393a23c4f3811045', (req, res) => {
    // IGI Airport hardcoded
    res.render('booking-form', { 
        parking: {
            _id: '680b0d7e393a23c4f3811045',
            name: 'IGI Airport Parking',
            address: 'Terminal 3, IGI Airport, New Delhi',
            pricePerHour: 120,
            availableSlots: 280,
            totalSlots: 500
        },
        title: 'Book Parking Slot',
        vehicleTypes: ['Car', 'Motorcycle', 'SUV', 'Truck']
    });
});

// General routes - These should come after the specific hardcoded routes
router.get('/form/:parkingId', bookingController.renderBookingForm);
router.post('/form/:parkingId', bookingController.renderSlotSelection);
router.get('/confirmation/:bookingId', bookingController.renderBookingConfirmation);

// API Routes
router.post('/', bookingController.createBooking);
router.put('/:id/status', bookingController.updateBookingStatus);
router.put('/:id/cancel', bookingController.cancelBooking);
router.post('/:id/extend', bookingController.extendBooking);
router.put('/:bookingId/extensions/:extensionId/payment', bookingController.completeExtensionPayment);
router.get('/:id/extend', bookingController.renderExtendBookingForm);
router.get('/:id/timer', (req, res) => {
    res.render('parking-timer', { 
        title: 'Parking Timer',
        bookingId: req.params.id
    });
});

// This should be last as it's the most generic
router.get('/:id', bookingController.getBookingById);

module.exports = router;