const { Schema, model } = require("mongoose");

const adminProfileSchema = new Schema({
    jobTitle: { type: String },
    department: { type: String },
    bio: { type: String },
    profilePicture: { type: String },
    phone: { type: String },
    address: { type: String },
}, { timestamps: true });

module.exports = model("adminProfiles", adminProfileSchema);