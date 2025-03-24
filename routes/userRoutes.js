const express = require("express");
const {
  verifyUser,
  createUser,
  resendVerificationEmail,
  loginUser,
  deleteOneUser,
  getMe,
  getAllPharmacies,
} = require("../controller/user/userController");
const { verifyToken } = require("../middleware/middleware");
// const upload = require("../middleware/multerMiddlleware");
const userRoute = express.Router();

userRoute.post("/createuser", createUser);
userRoute.get("/verify", verifyUser);
userRoute.post("/resend-verification-email", resendVerificationEmail);
userRoute.post("/login", loginUser);
userRoute.get("/getMe", getMe);
userRoute.get("/getAllPharms", getAllPharmacies)
// userRoute.delete("/deleteUser", deleteOneUser);

module.exports = userRoute;
