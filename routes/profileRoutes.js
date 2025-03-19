const express = require('express');
const profileRoutes = express.Router();
const {createProfile, getProfile, updateProfile, deleteProfile} = require('../controller/pharmacy/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddlleware');

profileRoutes.post('/createprofile', authMiddleware, upload.single('image'), createProfile);
profileRoutes.get('/getprofile', authMiddleware, getProfile);
profileRoutes.put('/updateprofile', authMiddleware, upload.single('image'), updateProfile);
profileRoutes.delete('/deleteprofile', authMiddleware, deleteProfile);

module.exports = profileRoutes;
