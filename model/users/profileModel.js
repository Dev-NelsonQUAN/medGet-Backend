const { Schema, model } = require("mongoose");

const profileSchema = new Schema(
  {
    age: { type: Number },
    dateOfBirth: { type: Date },
    phoneNo: { type: String },
    gender: { type: String, enum: ["Male", "Female"] },
    bio: { type: String },
    profilePicture: { type: String },
    profilePicturePublicId: { type: String },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = model("userProfiles", profileSchema);
