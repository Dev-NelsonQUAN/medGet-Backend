const adminModel = require("../../model/admins/adminModel");
const argon2 = require("argon2");
const crypto = require("crypto");
const { sendverificationEmail } = require("../../service/mail");
const userModel = require("../../model/users/userModel");
const pharmacyModel = require("../../model/pharmacies/pharmacyModel");
const jwt = require("jsonwebtoken");

const handleError = async (res, error) => {
  return res
    .status(500)
    .json({ message: "An error occurred", error: error.message || error });
};

exports.createAdmin = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const checkIfAdmin = await adminModel.findOne({ email });

    if (checkIfAdmin) {
      return res.status(404).json({ message: "Email already in use" });
    }

    const hashPassword = await argon2.hash(password);
    const verifiedToken = crypto.randomBytes(20).toString("hex");
    const verifiedTokenExpires = Date.now() + 3600000;

    const createTheAdmin = new adminModel({
      fullname,
      email,
      password: hashPassword,
      verifiedToken,
      verifiedTokenExpires,
    });

    // await sendverificationEmail(email, verifiedToken)
    await createTheAdmin.save();

    return res
      .status(200)
      .json({ message: "Admin created successfully", data: createTheAdmin });
  } catch (err) {
    handleError(res, err.message);
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findAdmin = await adminModel.findOne({ email });

    if (!findAdmin) {
      return res.status(404).json({ message: "Account does not exist" });
    }

    const checkPassword = await argon2.verify(findAdmin.password, password);

    if (!checkPassword) {
      return res.status(400).json({ message: "Incorrect details" });
    }

    const token = jwt.sign({ adminId: findAdmin.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME || "1h",
    });

    return res
      .status(200)
      .json({
        message: "Admin loggedin successfully",
        data: findAdmin,
        token: token,
      });
  } catch (err) {
    handleError(res, err.message);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    return res.status(200).json({ message: "All users gotten", data: users });
  } catch (err) {
    handleError(res, err.message);
  }
};

exports.getPharmacies = async (req, res) => {
  try {
    const pharmacies = await pharmacyModel
      .find()
      .populate("profile")
      .populate("location");

    return res.status(200).json({
      message: "All pharmacies gotten successfully",
      data: pharmacies,
    });
  } catch (err) {
    handleError(res, err.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const getUser = await userModel
      .findById(req.params.userId)
      .populate("profile")
      .populate("location");

    if (!getUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User gotten successfully" });
  } catch (err) {
    handleError(res, err.message);
  }
};

exports.getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await userModel
      .findById(req.params.pharmacyId)
      .populate("profile")
      .populate("location");

    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    return res
      .status(200)
      .json({ message: "Pharmacy gootten successfully", data: pharmacy });
  } catch (err) {
    handleError(res, err.message);
  }
};

exports.deleteOneUser = async (req, res) => {
  try {
    const deleteUser = await userModel.findByIdAndDelete(req.params.userId);

    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ messsage: "User deleted successfully", data: deleteUser });
  } catch (err) {
    handleError(res, err.message);
  }
};

exports.deletePharmacy = async (req, res) => {
  try {
    const deletePharm = await userModel.findByIdAndDelete(
      req.params.pharmacyId
    );

    if (!deletePharm) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    return res
      .status(200)
      .json({ message: "Pharmacy deleted sucessfully", data: deletePharm });
  } catch (err) {
    handleError(res, err.message);
  }
};

exports.getMe = async (req, res) => {
  try {
    const findMe = await adminModel.findById(req.user.id)

    if (findMe) {
      return res.status(409).json({message: "Admin not found"})
    }

    return res.status(200).json({message: "Admin gotten successfully", data: findMe})
  }
  catch (err) {
    handleError(re, err.message)
  }
}