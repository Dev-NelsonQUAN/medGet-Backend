const profileModel = require("../../model/pharmacies/profileModel");
const pharmacyModel = require("../../model/pharmacies/pharmacyModel");
const { cloudinary } = require("../../config/cloudinaryConfig");

exports.createProfile = async (req, res) => {
  try {
    const pharmacyId = req.pharmacy._id;
    const { phone, email, pharmacyName, dateOfBirth, age, bio, gender } = req.body;

    const existingProfile = await profileModel.findOne({ pharmacy: pharmacyId });
    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists for this pharmacy" });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = req.file.path;
    }

    const newProfile = new profileModel({
      pharmacy: pharmacyId,
      phone,
      email,
      pharmacyName,
      dateOfBirth,
      gender,
      age,
      bio,
      image: imageUrl,
    });

    await newProfile.save();

    await pharmacyModel.findByIdAndUpdate(pharmacyId, {
      profile: newProfile._id,
    });

    res.status(201).json({ message: "Profile created successfully", data: newProfile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const pharmacyId = req.pharmacy._id;
    const profile = await profileModel.findOne({ pharmacy: pharmacyId })
      .populate("pharmacy", "pharmacyName email");

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const pharmacyId = req.pharmacy._id;
    const profile = await profileModel.findOne({ pharmacy: pharmacyId });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const { phone, email, bio, dateOfBirth, age, pharmacyName, gender } = req.body;

    if (phone) profile.phone = phone;
    if (email) profile.email = email;
    if (bio) profile.bio = bio;
    if (dateOfBirth) profile.dateOfBirth = new Date(dateOfBirth);
    if (age) profile.age = age;
    if (gender) profile.gender = gender
    if (pharmacyName) profile.pharmacyName = pharmacyName;

    if (req.file) {
      if (profile.image) {
        const publicId = profile.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`pharmacyProfiles/${publicId}`);
      }
      profile.image = req.file.path;
    }

    await profile.save();
    res.status(200).json({ message: "Profile updated successfully", data: profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteProfile = async (req, res) => {
  try {
    const pharmacyId = req.pharmacy.id;
    const profile = await profileModel.findOneAndDelete({ pharmacy: pharmacyId });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    if (profile.image) {
      const publicId = profile.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`pharmacyProfiles/${publicId}`);
    }

    await pharmacyModel.findByIdAndUpdate(pharmacyId, {
      $unset: { profile: "" },
    });

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
