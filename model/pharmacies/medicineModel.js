const { Schema, model } = require("mongoose");

const medicineSchema = new Schema({
  pharmacy: { type: Schema.Types.ObjectId, ref: "pharmacy", required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  genericName: { type: String },
  sku: { type: String, unique: true },
  weight: { type: String },
  category: { type: String },
  manufacturer: { type: String },
  price: { type: Number, required: true },
  manufacturerPrice: { type: Number },
  stock: { type: Number, default: 0 },
  expireDate: { type: Date },
  status: { type: String, enum: ['Available', 'Out of Stock'], default: 'Available' },
  details: { type: String }
}, { timestamps: true });

module.exports = model("medicines", medicineSchema);
