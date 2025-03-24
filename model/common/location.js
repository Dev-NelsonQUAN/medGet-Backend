const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pharmacy',
    required: true
  },
  name: String,
  address: String,
  LocalGovernmentArea: String,
  state: String,
  postalCode: String,
  country: String,
  phoneNumber: String,
  email: String,
  services: [String],
  latitude: Number,
  longitude: Number
});

module.exports = mongoose.model('Location', locationSchema);
