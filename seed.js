const mongoose = require('mongoose');
const Parking = require('./models/Parking');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/parking-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample parking data
const parkings = [
  {
    name: 'DLF CyberHub Parking',
    address: 'DLF Cyber City, Gurugram',
    location: {
      type: 'Point',
      coordinates: [77.0893, 28.4947] // [longitude, latitude]
    },
    totalSlots: 200,
    availableSlots: 120,
    pricePerHour: 80,
    amenities: ['CCTV', 'EV Charging', 'Valet'],
    images: ['cyberhub-parking.jpg'],
    rating: 4.5
  },
  {
    name: 'Ambience Mall Parking',
    address: 'NH-48, Ambience Island, Gurugram',
    location: {
      type: 'Point',
      coordinates: [77.0968, 28.5042]
    },
    totalSlots: 350,
    availableSlots: 200,
    pricePerHour: 60,
    amenities: ['CCTV', 'Covered', 'Security'],
    images: ['ambience-mall-parking.jpg'],
    rating: 4.2
  },


  {
    name: 'IGI Airport Parking',
    address: 'Terminal 3, IGI Airport, New Delhi',
    location: {
      type: 'Point',
      coordinates: [77.0892, 28.5561]
    },
    totalSlots: 500,
    availableSlots: 280,
    pricePerHour: 120,
    amenities: ['CCTV', 'Security', 'EV Charging', '24/7'],
    images: ['igi-airport-parking.jpg'],
    rating: 4.7
  }
];

// Seed the database
const seedDB = async () => {
  try {
    // Clear existing data
    await Parking.deleteMany({});
    console.log('Cleared existing parking data');
    
    // Insert new parking locations
    const createdParkings = await Parking.insertMany(parkings);
    console.log(`Successfully seeded ${createdParkings.length} parking locations`);
    console.log('Created parking IDs:');
    createdParkings.forEach(parking => {
      console.log(`${parking.name}: ${parking._id}`);
    });
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected after seeding');
  }
};

// Run the seed function
seedDB();