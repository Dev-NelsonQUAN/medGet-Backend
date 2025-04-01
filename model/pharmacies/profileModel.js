const { Schema, model } = require("mongoose");

const pharmacyProfileSchema = new Schema(
  {
    pharmacy: {
      type: Schema.Types.ObjectId,
      ref: "pharmacy",
      required: true,
      unique: true,
    },
    age: { type: Number },
    phone: { type: String },
    email: { type: String },
    pharmacyName: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "others"] },
    bio: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = model("pharmacyProfiles", pharmacyProfileSchema);
