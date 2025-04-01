const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pharmacy',
    required: true,
    unique: true,
  },
  name: String,
  address: String,
  localGovernmentArea: String,
  street: String,
  state: String,
  postalCode: String,
  country: String,
  phoneNumber: String,
});

module.exports = mongoose.model('Location', locationSchema);
