const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const compression = require('compression');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https:"],
            "script-src": ["'self'", "'unsafe-inline'", "https:"]
        }
    }
}));

// Enable compression
app.use(compression());

// Connect to MongoDB
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

if (isProduction) {
    mongooseOptions.ssl = true;
    mongooseOptions.sslValidate = true;
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parking-management', mongooseOptions)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Production error handler
if (isProduction) {
    app.set('trust proxy', 1);
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: isProduction ? '1y' : 0
}));

// Set up EJS with layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

// Import routes
const parkingRoutes = require('./routes/parking');
const bookingRoutes = require('./routes/booking');
const userRoutes = require('./routes/user');

// Use routes
app.use('/booking', bookingRoutes);
app.use('/', parkingRoutes); // Home page and parking-related routes
app.use('/', userRoutes);    // User-related routes (saved, scan, profile)

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { 
        title: '404 - Page Not Found',
        message: 'The page you are looking for does not exist.'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Error',
        message: isProduction ? 
            'We\'re experiencing some difficulties. Please try again later.' :
            err.message
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    if (!isProduction) {
        console.log(`Visit http://localhost:${PORT} to access the application`);
    }
});