const pharmacyModel = require("../../model/pharmacies/pharmacyModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../../utils/email");

exports.registerPharmacy = async (req, res) => {
  try {
    const { pharmacyName, email, password } = req.body;

    const existing = await pharmacyModel.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifiedToken = crypto.randomBytes(20).toString("hex");

    const pharmacy = new pharmacyModel({
      pharmacyName,
      email,
      password: hashedPassword,
      verifiedToken,
      verifiedTokenExpires: Date.now() + 3600000, 
    });

    await pharmacy.save();

    const verifyLink = `http://localhost:5000/api/pharmacies/verify/${verifiedToken}`;
    await sendEmail(
      email,
      "Verify Your Pharmacy Account",
      `<a href="${verifyLink}">Click to verify</a>`
    );

    res
      .status(201)
      .json({ message: "Pharmacy registered. Please check your email to verify.", data: pharmacy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const pharmacy = await pharmacyModel.findOne({
      verifiedToken: token,
      verifiedTokenExpires: { $gt: Date.now() },
    });

    if (!pharmacy)
      return res.status(400).json({ message: "Invalid or expired token" });

    pharmacy.verified = true;
    pharmacy.verifiedToken = undefined;
    pharmacy.verifiedTokenExpires = undefined;
    await pharmacy.save();

    res.json({ msg: "Email verified successfully!"});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.loginPharmacy = async (req, res) => {
  try {
    const { email, password } = req.body;

    const pharmacy = await pharmacyModel.findOne({ email });
    if (!pharmacy) return res.status(400).json({ msg: "Invalid credentials" });

    if (!pharmacy.verified)
      return res.status(400).json({ msg: "Please verify your email" });

    const isMatch = await bcrypt.compare(password, pharmacy.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: pharmacy._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
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
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
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
    const pharmacies = await pharmacyModel.find()
      .populate("profile")
      .populate("location");
    res.status(200).json(pharmacies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await pharmacyModel.findById(req.params.id)
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
    res.status(200).json({ message: "Pharmacy updated successfully.", data: pharmacy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Pharmacy
exports.deletePharmacy = async (req, res) => {
  try {
    const pharmacy = await pharmacyModel.findByIdAndDelete(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({ msg: "Pharmacy not found." });
    }
 
    res.status(200).json({ message: "Pharmacy deleted successfully.", data: pharmacy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
