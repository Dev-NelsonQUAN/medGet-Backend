const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createLocation, getLocationById, updateLocation, getAllPharmacies } = require('../controller/pharmacy/locationController');


router.post('/createlocation', authMiddleware, createLocation);
router.get('/getlocationbyid', authMiddleware, getLocationById);
router.put('/updatelocation', authMiddleware, updateLocation);
router.get('/pharmacies/all', getAllPharmacies);

module.exports = router;
