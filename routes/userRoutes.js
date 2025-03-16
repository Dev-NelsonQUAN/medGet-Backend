const express = require("express");
const {
  verifyUser,
  getUsers,
  createUser,
  getUserById,
  resendVerificationEmail,
} = require("../controller/user/userController");
const userRoute = express.Router();

userRoute.get("/getUsers", getUsers);
userRoute.post("/createUser", createUser);
userRoute.get("/verify", verifyUser);
userRoute.post("/resend-verification-email", resendVerificationEmail);
userRoute.get("/getOneUser", getUserById);

module.exports = userRoute;
