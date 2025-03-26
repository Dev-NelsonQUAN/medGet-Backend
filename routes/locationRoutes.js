const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {createLocation, getAllLocations, getLocationById, updateLocation, deleteLocation, getAllPharmacies, getNearbyPharmacies} = require('../controller/pharmacy/locationController');

router.post('/createlocation', authMiddleware, createLocation);
router.get('/getlocation', authMiddleware, getAllLocations);
router.get('/getlocationbyid/:id', authMiddleware, getLocationById);
router.put('/updatelocationbyid/:id', authMiddleware, updateLocation);
router.delete('/deletelocationbyid/:id', authMiddleware, deleteLocation);
router.get('/pharmacies/all', getAllPharmacies);
router.get('/pharmacies/nearby', getNearbyPharmacies); 

module.exports = router;
