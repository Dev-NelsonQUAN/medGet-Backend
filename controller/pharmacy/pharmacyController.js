const pharmacyModel = require("../../model/pharmacies/pharmacyModel");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv/config.js");
const crypto = require("crypto");
const { sendverificationEmail } = require("../../service/mail");

const handleError = async (res, error) => {
  return res.status(500).json({
    message: "An error occurred",
    error: error.message || error,
  });
};

exports.registerPharmacy = async (req, res) => {
  try {
    const { pharmacyName, email, password } = req.body;

    const checkIfEmailExists = await pharmacyModel.findOne({ email });

    if (checkIfEmailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashPassword = await argon2.hash(password);
    const verifiedToken = crypto.randomBytes(20).toString("hex");
    const verifiedTokenExpires = Date.now() + 36000000;

    const createPharmacy = await pharmacyModel.create({
      pharmacyName,
      email,
      password: hashPassword,
      verifiedToken,
      verifiedTokenExpires,
    });

    await sendverificationEmail(email, verifiedToken, "pharmacy");
    await createPharmacy.save();

    res.status(201).json({
      message: "Pharmacy registered. Please check your email to verify.",
      data: createPharmacy,
    });
  } catch (err) {
    handleError(res, err);
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const pharmacy = await pharmacyModel.findOne({
      verifiedToken: token,
      verifiedTokenExpires: { $gt: Date.now() },
    });

    if (!pharmacy) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    pharmacy.verified = true;
    pharmacy.verifiedToken = undefined;
    pharmacy.verifiedTokenExpires = undefined;

    await pharmacy.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const pharmacy = await pharmacyModel.findOne({ email });

    if (!pharmacy) {
      return res.status(404).json({ message: "pharmacy  not found" });
    }

    if (pharmacy.verified) {
      return res.status(400).json({ message: "Pharmacy already verified" });
    }

    const verifiedToken = crypto.randomBytes(20).toString("hex");
    const verifiedTokenExpires = Date.now() + 3600000;

    pharmacy.verifiedToken = verifiedToken;
    pharmacy.verifiedTokenExpires = verifiedTokenExpires;
    await pharmacy.save();

    await sendverificationEmail(email, verifiedToken);

    return res
      .status(200)
      .json({ message: "Verification email resent successfully" });
  } catch (err) {
    handleError(res, err);
  }
};

exports.loginPharmacy = async (req, res) => {
  try {
    const { email, password } = req.body;

    const pharmacy = await pharmacyModel.findOne({ email });
    if (!pharmacy) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await argon2.verify(pharmacy.password, password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userId: pharmacy.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME || "1h",
    });

    return res
      .status(200)
      .json({ message: "Login successful", data: pharmacy, token: token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occured", error: err.message, err });
  }
};                                                  

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const pharmacy = await pharmacyModel.findOne({ email });

    if (!pharmacy) {
      return res
        .status(400)
        .json({ msg: "Pharmacy with this email does not exist." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordToken = jwt.sign(
      { resetToken },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    pharmacy.resetPasswordToken = resetPasswordToken;
    pharmacy.resetPasswordExpires = Date.now() + 3600000;
    await pharmacy.save();

    const resetLink = `http://localhost:5000/api/pharmacies/resetpassword/${resetPasswordToken}`;
    const emailContent = `
        <h3>Password Reset Request</h3>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `;

    await sendEmail(pharmacy.email, "Password Reset", emailContent);

    res.status(200).json({ msg: "Password reset link sent to your email." });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const pharmacy = await pharmacyModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!pharmacy) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    const hashedPassword = await argon2.hash(newPassword, 10);
    pharmacy.password = hashedPassword;
    pharmacy.resetPasswordToken = undefined;
    pharmacy.resetPasswordExpires = undefined;
    await pharmacy.save();

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await pharmacyModel
      .find()
      .populate("profile")
      .populate("location");
    res.status(200).json(pharmacies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await pharmacyModel
      .findById(req.params.id)
      .populate("profile")
      .populate("location");

    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found." });
    }

    res.status(200).json(pharmacy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePharmacy = async (req, res) => {
  try {
    const { pharmacyName, email } = req.body;
    const pharmacy = await pharmacyModel.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found." });
    }

    if (pharmacyName) pharmacy.pharmacyName = pharmacyName;
    if (email) pharmacy.email = email;

    await pharmacy.save();
    res
      .status(200)
      .json({ message: "Pharmacy updated successfully.", data: pharmacy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Delete Pharmacy
exports.deletePharmacy = async (req, res) => {
  try {
    const pharmacy = await pharmacyModel.findByIdAndDelete(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({ msg: "Pharmacy not found." });
    }

    res
      .status(200)
      .json({ message: "Pharmacy deleted successfully.", data: pharmacy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const findMe = await pharmacyModel.findById(req.user.id);

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
