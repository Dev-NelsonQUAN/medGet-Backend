const express = require('express');
const {
  registerPharmacy,
  verifyEmail,
  loginPharmacy,
  requestPasswordReset,
  resetPassword,
  getAllPharmacies,
  getPharmacyById,
  updatePharmacy,
  deletePharmacy,
} = require('../controller/pharmacy/pharmacyController');
const authMiddleware = require('../middleware/authMiddleware');

const pharmacyRoutes = express.Router();

pharmacyRoutes.post('/register', registerPharmacy);
pharmacyRoutes.get('/verify/:token', verifyEmail);
pharmacyRoutes.post('/login', loginPharmacy);
pharmacyRoutes.post('/request-password-reset', requestPasswordReset);
pharmacyRoutes.post('/resetpassword/:token', resetPassword);

// Protected routes
pharmacyRoutes.get('/getallpharmacy', authMiddleware, getAllPharmacies);
pharmacyRoutes.get('/:id', authMiddleware, getPharmacyById);
pharmacyRoutes.put('/:id', authMiddleware, updatePharmacy);
pharmacyRoutes.delete('/:id', authMiddleware, deletePharmacy);

module.exports = pharmacyRoutes;
