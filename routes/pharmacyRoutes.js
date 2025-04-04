const express = require('express');
const {
  registerPharmacy,
  verifyPharmacy,
  loginPharmacy,
  resendVerificationEmail,
  verifyEmail,
  // requestPasswordReset,
  // resetPassword,
  // getAllPharmacies,
  // getPharmacyById,
  // updatePharmacy,
  // deletePharmacy,
  // resetPassword,
} = require('../controller/pharmacy/pharmacyController');
// const authMiddleware = require('../middleware/authMiddleware');

const pharmacyRoutes = express.Router();

pharmacyRoutes.post('/register', registerPharmacy);
pharmacyRoutes.get('/pharm-verify', verifyEmail);
// pharmacyRoutes.get('/verify/:token', verifyPharmacy);
pharmacyRoutes.post('/login', loginPharmacy);
pharmacyRoutes.post('/resend-verification-email', resendVerificationEmail);
// pharmacyRoutes.post('/resetpassword/:token', resetPassword);

// Protected routes
// pharmacyRoutes.get('/getallpharmacy', authMiddleware, getAllPharmacies);
// pharmacyRoutes.get('/:id', authMiddleware, getPharmacyById);
// pharmacyRoutes.put('/:id', authMiddleware, updatePharmacy);
// pharmacyRoutes.delete('/:id', authMiddleware, deletePharmacy);

module.exports = pharmacyRoutes;
