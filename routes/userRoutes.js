const express = require("express");
const {
  verifyUser,
  createUser,
  resendVerificationEmail,
  loginUser,
  // getUsers,
  // getUserById,
  // getBaseUrl,
} = require("../controller/user/userController");
const { verifyToken } = require("../middleware/middleware");
const { upload } = require("../config/cloudinary");
const { createProfile, getProfile, updateProfile } = require("../controller/user/profileController");

const userRoute = express.Router();

// userRoute.get("/getUsers", getUsers);
userRoute.post("/createuser", createUser);
userRoute.get("/verify", verifyUser);
userRoute.post("/resend-verification-email", resendVerificationEmail);
userRoute.post("/login", loginUser);
userRoute.post("/createProfile", verifyToken, upload.single("profileImage"), createProfile);
userRoute.get("/getProfile", verifyToken, getProfile);
// userRoute.get("/getProfile", verifyToken, get.single("profileImage"), getProfile);
userRoute.post("/updateProfile", verifyToken, updateProfile);
// userRoute.get("/getOneUser ", getUser ById);
// userRoute.get('/test', getBaseUrl);

// In userRoutes.js (or wherever your routes are)
// userRoute.post("/test-upload", upload.single("profileImage"), (req, res) => {
//   console.log("Test upload - Request file:", req.file);
//   console.log("Test upload - Request body:", req.body);
//   console.log("Test upload - Request headers:", req.headers)  
//   if (req.file) {
//       res.json({ message: "File uploaded successfully", file: req.file });
//   } else {
//       res.status(400).json({ message: "File upload failed" });
//   }
// });



module.exports = userRoute;
