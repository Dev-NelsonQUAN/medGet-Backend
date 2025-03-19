const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {createLocation, getAllLocations, getLocationById, updateLocation, deleteLocation} = require('../controller/pharmacy/locationController');

router.post('/createlocation', authMiddleware, createLocation);
router.get('/getlocation', authMiddleware, getAllLocations);
router.get('/getlocationbyid/:id', authMiddleware, getLocationById);
router.put('/updatelocationbyid/:id', authMiddleware, updateLocation);
router.delete('/deletelocationbyid/:id', authMiddleware, deleteLocation);

module.exports = router;
