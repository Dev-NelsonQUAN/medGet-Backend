const express = require("express");
const { createAdmin, loginAdmin, getUsers, getPharmacies, getUserById, getPharmacyById } = require("../controller/admin/adminController");
const { verifyAdminToken } = require("../middleware/adminMiddleware");

const adminRoutes = express.Router();

adminRoutes.post("/createAdmin", createAdmin);
adminRoutes.post('/loginAdmin', loginAdmin)
adminRoutes.get("/getAllUsers", verifyAdminToken, getUsers)
adminRoutes.get("/getAllPharmacies", verifyAdminToken, getPharmacies)
adminRoutes.get("/getOneUser", verifyAdminToken, getUserById)
adminRoutes.get("/getOnePharmacy", verifyAdminToken, getPharmacyById)

module.exports = adminRoutes;
