const userModel = require("../../model/users/userModel");
const argon2 = require("argon2");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv/config");

const handleError = async (res, error) => {
  return res
    .status(500)
    .json({ message: "An error occurred", error: error.message || error });
};

const sendverificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const baseUrl = process.env.NODE_ENV === 'production'
    ? `http://med-get-global.vercel.app`  // Your production URL
    : `http://localhost:7349`;

  const verificationUrl = `${baseUrl}/verify?token=${token}`;

  const mailOptions = {
    from: `"MedGet, Your medical guy. <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
       <div>
        <p>Click the button below to verify your email:</p>
        <a href="${verificationUrl}" style="text-decoration: none;">
          <button style="background-color: #2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; border: none; cursor: pointer; font-size: 1rem;" onmouseover="this.style.backgroundColor='#1d4ed8'" onmouseout="this.style.backgroundColor='#2563eb'">
            Verify Email
          </button>
        </a>
      </div>

    `,
  };

  await transporter.sendMail(mailOptions);
};

exports.createUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const checkIfEmailExists = await userModel.findOne({ email });

    const hashPassword = await argon2.hash(password);

    if (checkIfEmailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const generateToken = () => {
      return crypto.randomBytes(20).toString("hex");
    };

    const generateExpirationTime = () => {
      return Date.now() + 3600000;
    };

    const verifiedToken = generateToken();
    const verifiedTokenExpires = generateExpirationTime();

    const createUser = await userModel.create({
      fullname,
      email,
      password: hashPassword,
      verifiedToken,
      verifiedTokenExpires,
    });

    await sendverificationEmail(email, verifiedToken);

    return res
      .status(200)
      .json({ message: "User created successfully", data: createUser });
  } catch (err) {
    handleError(res, err.message);
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

    return res.status(200).json({message: "Email verifies Successfully"})
  } catch (err) {
    handleError(res, err.message);
  }
};

exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const generateToken = () => {
      return crypto.randomBytes(20).toString("hex");
    };

    const generateExpirationTime = () => {
      return Date.now() + 3600000; 
    };

    const verifiedToken = generateToken();
    const verifiedTokenExpires = generateExpirationTime();

    user.verifiedToken = verifiedToken;
    user.verifiedTokenExpires = verifiedTokenExpires;
    await user.save();

    await sendverificationEmail(email, verifiedToken);

    return res.status(200).json({ message: "Verification email resent successfully" });
  } catch (err) {
    handleError(res, err.message);
  }
};

exports.getUsers = async (req, res) => {
  const getAllUsers = await userModel.find();

  return res
    .status(200)
    .json({ message: "Gotten all user successfully", data: getAllUsers });
};

exports.getUserById = async (req, res) => {
  const findOne = await userModel.findById(req.params.id);

  if (!findOne) {
    return res.status(404).json({ message: "User not found" });
  }

  return res
    .status(200)
    .json({ message: "User gotten successsfully", data: getUserById });
};

// exports.
