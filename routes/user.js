// filepath: c:\xampp\htdocs\parking-management-app\routes\user.js
const express = require('express');
const router = express.Router();

// Saved Locations Page
router.get('/saved', (req, res) => {
    res.render('saved-locations', { title: 'Saved Locations' });
});

// QR Scanner Page
router.get('/scan', (req, res) => {
    res.render('qr-scanner', { title: 'Scan QR Code' });
});

// User Profile Page
router.get('/profile', (req, res) => {
    res.render('user-profile', { title: 'My Profile' });
});

module.exports = router;