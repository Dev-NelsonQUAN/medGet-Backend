const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const locationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    name: String,
    address: String,
    localGovernmentArea: String,
    state: String,
    postalCode: String,
    country: String, // Corrected "Sting" to "String"
    phoneNumber: String,
    email: String,
    latitude: Number, // Add latitude
    longitude: Number, // Add longitude
});

module.exports = model("location", locationSchema); 
// module.exports = model("UserLocation", locationSchema); 