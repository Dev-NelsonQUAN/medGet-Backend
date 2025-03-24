const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: true},
  verifiedToken: {type: String, default: null },
  verifiedTokenExpires: { type: Date, default: null },
  resetPasswordToken: {type: String},
  resetPasswordExpires: {type: Date},
    role:{
        type: Schema.Types.ObjectId,
        ref: "roles",
        // required: true,
        // default:  true
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: "adminProfiles",
    },
    permissions: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("admins", adminSchema)
