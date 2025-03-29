const jwt = require('jsonwebtoken');
const Pharmacy = require('../model/pharmacies/pharmacyModel');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const pharmacy = await Pharmacy.findById(decoded.pharmacyId);

    if (!pharmacy) {
      return res.status(404).json({ msg: 'Pharmacy not found' });
    }

    req.pharmacy = pharmacy;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;



