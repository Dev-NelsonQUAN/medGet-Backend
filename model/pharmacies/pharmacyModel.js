const { Schema, model } = require("mongoose");

const pharmacySchema = new Schema(
  {
    pharmacyName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verifiedToken: { type: String },
    verifiedTokenExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    role: { type: Schema.Types.ObjectId, ref: "roles" },
    profile: { type: Schema.Types.ObjectId, ref: "pharmacyProfiles" },
    location: { type: Schema.Types.ObjectId, ref: "Locations" },
  },
  { timestamps: true }
);

module.exports = model("pharmacy", pharmacySchema);
