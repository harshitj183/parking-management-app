const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

// API Routes
router.get('/api/parking', parkingController.getAllParkingLocations);
router.get('/api/parking/nearby', parkingController.getNearbyParkingLocations);
router.get('/api/parking/:id', parkingController.getParkingLocationById);

// View Routes
router.get('/', parkingController.renderHomePage);
router.get('/parking/:id', parkingController.renderParkingDetails);

module.exports = router;