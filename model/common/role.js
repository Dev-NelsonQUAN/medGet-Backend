const { Schema, model } = require("mongoose");

const roleSchema = Schema({
  name: { type: String, required: true },
  entity: { type: String, enum: ["user", "pharmacy", "admin"] },
  permissions: [{ type: String }],
});

module.exports = model("roles", roleSchema)
