const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const locationSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  name: String,
  address: String,
  localGovernmentArea: String,
  state: String,
  postalCode: String,
  country: String,
  phoneNumber: String,
  email: String,
  latitude: Number,
  longitude: Number,
});

module.exports = model("location", locationSchema);
// module.exports = model("UserLocation", locationSchema);
