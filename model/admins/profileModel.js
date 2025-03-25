const { Schema } = require("mongoose");

const adminProfileSchema = new Schema({
    jobTitle: {type: String},
    department: {type: String}
})

module.exports = model("adminProfiles", adminProfileSchema)