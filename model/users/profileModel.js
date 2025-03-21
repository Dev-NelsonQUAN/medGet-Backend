const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
  age: { type: Number },
  dateOfBirth: { type: Date },
  phoneNo: { type: String },
  gender: { type: String, enum: ["male", "female"] },
  bio: { type: String },
  profilePictureUrl: { type: String },
  profilePicturePublicId: { type: String },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true,
  },
});

module.exports = model("userProfiles", profileSchema);
