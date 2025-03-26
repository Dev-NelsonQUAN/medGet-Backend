  const { Schema, model } = require("mongoose");

  const pharmacyProfileSchema = new Schema(
    {
      pharmacy: {
        type: Schema.Types.ObjectId,
        ref: "pharmacy",
        required: true,
        unique: true,
      },
      age: {type: Number},
      phone: { type: String },
      address: { type: String },
      description: { type: String },
      openingHours: { type: String },
      dateOfbirth: {type: Date },
      bio: {type: String},
      image: { type: String },
    },
    { timestamps: true }
  );

  module.exports = model("pharmacyProfiles", pharmacyProfileSchema);
