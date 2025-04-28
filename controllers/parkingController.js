const Parking = require('../models/Parking');

// Get all parking locations
exports.getAllParkingLocations = async (req, res) => {
  try {
    const parkingLocations = await Parking.find();
    res.json(parkingLocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get nearby parking locations based on coordinates
exports.getNearbyParkingLocations = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query; // maxDistance in meters (default 5km)
    
    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const parkingLocations = await Parking.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    res.json(parkingLocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get parking location by ID
exports.getParkingLocationById = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);
    if (!parking) {
      return res.status(404).json({ message: 'Parking location not found' });
    }
    res.json(parking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Render the home page with map
exports.renderHomePage = async (req, res) => {
  try {
    res.render('index', { title: 'Find Parking Nearby' });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

// Render the parking details page
exports.renderParkingDetails = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);
    if (!parking) {
      return res.status(404).render('error', { message: 'Parking location not found' });
    }
    res.render('parking-details', { parking, title: parking.name });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};