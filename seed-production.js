const mongoose = require('mongoose');
const Parking = require('./models/Parking');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection using MONGODB_URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parking-management';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Use SSL for Atlas connections
  ...(MONGODB_URI.includes('mongodb+srv') ? { ssl: true, sslValidate: true } : {})
})
.then(() => console.log('MongoDB connected for production seeding'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample parking data - same as in seed.js
const parkings = [
  {
    name: "DLF CyberHub Parking",
    address: "DLF Cyber City, Gurugram",
    location: {
      type: "Point",
      coordinates: [77.0893, 28.4947]
    },
    totalSlots: 200,
    availableSlots: 120,
    pricePerHour: 80,
    amenities: ["CCTV", "EV Charging", "Valet"],
    images: ["cyberhub-parking.jpg"],
    rating: 4.5
  },
  {
    name: "Ambience Mall Parking",
    address: "NH-48, Ambience Island, Gurugram",
    location: {
      type: "Point",
      coordinates: [77.0968, 28.5042]
    },
    totalSlots: 350,
    availableSlots: 200,
    pricePerHour: 60,
    amenities: ["CCTV", "Covered", "Security"],
    images: ["ambience-mall-parking.jpg"],
    rating: 4.2
  },
  {
    name: "IGI Airport Parking",
    address: "Terminal 3, IGI Airport, New Delhi",
    location: {
      type: "Point",
      coordinates: [77.0892, 28.5561]
    },
    totalSlots: 500,
    availableSlots: 280,
    pricePerHour: 120,
    amenities: ["CCTV", "Security", "EV Charging", "24/7"],
    images: ["igi-airport-parking.jpg"],
    rating: 4.7
  }
];

// Seed the database
const seedDB = async () => {
  try {
    // Clear existing data
    await Parking.deleteMany({});
    console.log('Cleared existing parking data');
    
    // Insert new data
    await Parking.insertMany(parkings);
    console.log('Successfully seeded production parking data!');
    
    // Close connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error seeding data:', err);
    mongoose.connection.close();
  }
};

// Run the seeding function
seedDB();