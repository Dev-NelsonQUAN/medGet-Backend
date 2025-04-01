const UserModel = require("../../model/users/userModel");
const { cloudinary } = require("../../config/cloudinaryConfig");
const profileModel = require("../../model/users/profileModel")

exports.createProfile = async (req, res) => {
    try {
        console.log("req.file after Multer:", req.file); 

        const userId = req.userId;
        const { age, dateOfBirth, phoneNo, gender, bio } = req.body;

        let imageUrl = "";
        let publicId = "";

        if (req.file) {
            // Extract secure_url and public_id from req.file.filename
            // The filename is the cloudinary url that is returned from cloudinary.
            const cloudinaryUrl = req.file.path
            imageUrl = cloudinaryUrl;
            publicId = req.file.filename.split('/').pop().split('.')[0]; 
        }

        let profile = await profileModel.findOne({ userId });

        if (profile) {
            profile.age = age;
            profile.dateOfBirth = dateOfBirth;
            profile.phoneNo = phoneNo;
            profile.gender = gender;
            profile.bio = bio;
            if (imageUrl) {
                profile.profilePicture = imageUrl;
                profile.profilePicturePublicId = publicId;
            }

            await profile.save();

            // console.log("Profile Before Response:", profile);

            return res.status(200).json({
                message: "Profile updated successfully",
                data: profile,
            });
        } else {
            profile = new profileModel({
                userId,
                age,
                dateOfBirth,
                phoneNo,
                gender,
                bio,
                profilePicture: imageUrl,
                profilePicturePublicId: publicId,
            });

            await profile.save();

            await UserModel.findByIdAndUpdate(userId, {
                profile: profile._id,
            });

            console.log("Profile Before Response:", profile); 

            return res.status(201).json({
                message: "Profile created successfully",
                data: profile,
            });
        }
    } catch (err) {
        console.error("Error creating/updating profile:", err);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId; 
    console.log("Decoded userId:", userId); 
    const user = await UserModel.findById(userId, "fullname email profilePicture");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user); 

    const profile = await profileModel.findOne({ userId });

    return res.status(200).json({
      message: "User profile retrieved successfully",
      user,
      profile, 
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "An error occurred", error: err.message });
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
