const express =  require("express")
const { verifyToken } = require("../middleware/middleware")
const {  createOrUpdateProfile, getProfile, updateProfile, deleteProfile, createProfile,  } = require("../controller/user/profileController")
const upload = require("../middleware/multerMiddlleware")

const userProfileRoutes = express.Router()


// userProfileRoutes.post("/createProfile", verifyToken, upload.single("profileImage") , createProfile)
userProfileRoutes.post("/createProfile", verifyToken, upload.single("profileImage") , createProfile)
userProfileRoutes.get("/getProfile", verifyToken, getProfile)
// userProfileRoute.get("/getProfile", getProfile)
userProfileRoutes.patch("/updateProfile", verifyToken, updateProfile)
userProfileRoutes.delete("/deleteProfile", verifyToken, deleteProfile)

module.exports = userProfileRoutes