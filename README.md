# ParkKaro - Smart Parking Management System

A modern web-based parking management system built with Node.js, Express, and MongoDB, featuring a responsive UI designed for both desktop and mobile devices.

## Features

- Real-time parking slot availability tracking
- Interactive map view of parking locations
- Booking management system
- Dark/Light theme support
- User profiles and preferences
- Saved vehicles functionality
- Mobile-responsive design
- Amenity badges with animations

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS templating, Bootstrap 5
- **Maps**: Leaflet.js
- **UI**: Custom CSS with Font Awesome icons

## Local Development Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running locally)

### Installation

1. Clone this repository:
```bash
git clone https://github.com/harshitj183/parking-management-app.git
cd parking-management-app
```

2. Install dependencies:
```bash
npm install
```

3. Make sure MongoDB is running on your local machine:
   - MongoDB should be accessible at: `mongodb://localhost:27017/`
   - The application will automatically create the `parking-management` database

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

6. Access the application in your browser:
```
http://localhost:3000
```

## Deployment

This application is designed to work with a local MongoDB instance. To use it:

1. Ensure MongoDB is installed and running on your machine
2. Follow the installation steps above

## Using the Application

### Sample Parking Locations

After seeding the database, you'll have access to the following sample parking locations:

- **DLF CyberHub Parking** - Gurugram
- **Ambience Mall Parking** - Gurugram
- **IGI Airport Parking** - New Delhi

### Features Available

- Browse available parking locations on the map
- View amenities and available spots for each location
- Book a parking slot with vehicle details
- Save vehicle information for future bookings
- View and manage your bookings
- Toggle between light and dark theme

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Screenshots

[Add your application screenshots here]