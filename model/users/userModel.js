const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  verifiedToken: { type: String },
  verifiedTokenExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  role: {
    type: Schema.Types.ObjectId,
    ref: "roles",
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: "userProfiles",
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: "location",
  },
});

module.exports = model("users", userSchema);