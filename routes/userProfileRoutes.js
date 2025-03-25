const express =  require("express")
const { verifyToken } = require("../middleware/middleware")
const { createProfile, getProfile, updateProfile, deleteProfile } = require("../controller/user/profileController")
const upload = require("../middleware/multerMiddlleware")

const userProfileRoute = rRouter()

userProfileRoute.post("/createProfile", verifyToken, upload.single("profileImage") , createProfile)
userProfileRoute.get("/getProfile", verifyToken, getProfile)
userProfileRoute.patch("/updateProfile", verifyToken, updateProfile)
userProfileRoute.delete("/deleteProfile", verifyToken, deleteProfile)

module.exports = userProfileRoute 