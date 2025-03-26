const userModel = require("../../model/users/userModel");
const argon2 = require("argon2");
const crypto = require("crypto");
require("dotenv/config");
const { sendverificationEmail } = require("../../service/mail");
const jwt = require("jsonwebtoken");
const pharmacyModel = require("../../model/pharmacies/pharmacyModel");
const { getAllPharmacies } = require("../pharmacy/pharmacyController");

const handleError = async (res, error) => {
  return res.status(500).json({
    message: "An error occurred",
    error: error.message || error,
  });
};

exports.createUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const checkIfEmailExists = await userModel.findOne({ email });

    if (checkIfEmailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashPassword = await argon2.hash(password);
    const verifiedToken = crypto.randomBytes(20).toString("hex");
    const verifiedTokenExpires = Date.now() + 3600000;

    const createUser = await userModel.create({
      fullname,
      email,
      password: hashPassword,
      verifiedToken,
      verifiedTokenExpires,
    });

    await sendverificationEmail(email, verifiedToken, "user");
    await createUser.save();

    return res
      .status(200)
      .json({ message: "User  created successfully", data: createUser });
  } catch (err) {
    handleError(res, err);
  }
};

exports.verifyUser = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await userModel.findOne({
      verifiedToken: token,
      verifiedTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.verified = true;
    user.verifiedToken = undefined;
    user.verifiedTokenExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    handleError(res, err);
  }
};

exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "User  already verified" });
    }

    const verifiedToken = crypto.randomBytes(20).toString("hex");
    const verifiedTokenExpires = Date.now() + 3600000;

    user.verifiedToken = verifiedToken;
    user.verifiedTokenExpires = verifiedTokenExpires;
    await user.save();

    await sendverificationEmail(email, verifiedToken, "user");

    return res
      .status(200)
      .json({ message: "Verification email resent successfully" });
  } catch (err) {
    handleError(res, err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await userModel.findOne({ email });

    if (!findUser) {
      return res.status(404).json({ message: "User  not found" });
    }

    const comparePassword = await argon2.verify(findUser.password, password);

    if (!comparePassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (!findUser.verified) {
      return res.status(400).json({ message: "Kindly verify your email" });
    }

    const token = jwt.sign({ userId: findUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME || "1h",
    });

    return res
      .status(200)
      .json({ message: "Login successful", data: findUser, token: token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occured", error: err.message, err });
  }
};

// exports.getAll = async (req, res) => {
//   try {
//     const getAllUsers = await userModel.find();

//     return res
//       .status(200)
//       .json({ message: "All user gotten successfully", data: getAllUsers });
//   } catch (err) {
//     handleError(res, err.message);
//   }
// };

exports.getMe = async (req, res) => {
  const userId = req.user.id;
  try {
    const findMe = await userModel.findById(userId);

    if (!findOne) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User gotten successfully", data: findMe });
  } catch (err) {
    handleError(res, err.message);
  }
};

exports.deleteOneUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deleteUser = await userModel.findByIdAndDelete(userId);

    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    handleError(res, err.message);
  }
};

exports.getAllPharmacies = async (req, res) => {
  try {
    const getPharmacies = await pharmacyModel
      .find()
      .populate("profile")
      .populate("location");

    return res
      .status(200)
      .json({
        message: "All pharmacies gotten successfully",
        data: getPharmacies,
      });
  } catch (err) {
    handleError(res, err.message);
  }
};
