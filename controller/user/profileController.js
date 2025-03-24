const UserModel = require("../../model/users/userModel");
const { cloudinary } = require("../../config/cloudinaryConfig");
const profileModel = require("../../model/users/profileModel");

exports.createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { age, dateOfBirth, phoneNo, gender, bio } = req.body;

    const existingProfile = await profileModel.findOne({ userId });

    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "Profile already exist5s for this user" });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = req.file.path;
    }

    const newProfile = new profileModel({
      userId,
      age,
      dateOfBirth,
      phoneNo,
      gender,
      bio,
      profilePicture: profilePictureUrl,
    });

    await newProfile.save();

    await UserModel.findByIdAndUpdate(userId, {
      profile: newProfile._id,
    });

    return res
      .status(201)
      .json({ message: "Profile created successfully", data: profile });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", err });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const profile = await profileModel
      .findOne({ userId })
      .populate("users", "fullname email");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({ message: "Profile gotten successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const profile = await profileModel.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (age) profile.age = age;
    if (dateOfBirth) profile.dateOfBirth = dateOfBirth;
    if (phoneNo) profile.phoneNo = phoneNo;
    if (gender) profile.gender = gender;
    if (bio) profile.bio = bio;

    if (req.file) {
      if (profile.profilePicture) {
        const publicId = profile.profilePicture.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`userProfiles/${publicId}`);
      }
      profile.profilePicture = req.file.path;
    }

    await profile.save();

    return res
      .status(200)
      .json({ message: "Profile updated succssfully", data: profile });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: err.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const profile = await profileModel.findByIdAndDelete(userId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.profilePicture) {
      const publicId = profile.profilePicture.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`userProfiles/${publicId}`);
    }

    await userModel.findByIdAndUpdate(userId, { $unset: { profile: "" } });

    return res.status(200).json({ message: "Profile deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error:  err.message });
  }
};
