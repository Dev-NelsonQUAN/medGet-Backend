const UserProfile = require("../../model/users/profileModel");
const cloudinary = require("cloudinary").v2;

exports.addOrUpdateProfile = async (req, res) => {
    const userId = req.userId;
    const { age, dateOfBirth, phoneNo, gender, bio } = req.body;

    console.log("Request file:", req.file); // Debugging

    try {
        let profilePictureUrl = null;
        let profilePicturePublicId = null;

        if (req.file) {
            console.log("Uploaded file:", req.file);
            try {
                console.log("Cloudinary upload started");
                const result = await cloudinary.uploader.upload(req.file.path);
                console.log("Cloudinary upload result:", result);
                profilePictureUrl = result.secure_url;
                profilePicturePublicId = result.public_id;
            } catch (cloudinaryError) {
                console.error("Cloudinary error:", cloudinaryError);
                return res.status(500).json({ message: "Cloudinary upload failed", error: cloudinaryError.message });
            }
        } else {
            console.log("No file uploaded");
        }

        let profile = await UserProfile.findOne({ userId });
        console.log("User ID:", userId);
        console.log("Found Profile:", profile);

        if (profile) {
            // Update existing profile
            profile.age = age;
            profile.dateOfBirth = dateOfBirth;
            profile.phoneNo = phoneNo;
            profile.gender = gender;
            profile.bio = bio;

            if (profilePictureUrl && profilePicturePublicId) {
                profile.profilePictureUrl = profilePictureUrl;
                profile.profilePicturePublicId = profilePicturePublicId;
            }

            console.log("Profile before save:", profile);
            await profile.save();
            return res.status(200).json({ message: "Profile updated successfully", data: profile });
        } else {
            // Create new profile
            const newProfileData = {
                userId,
                age,
                dateOfBirth,
                phoneNo,
                gender,
                bio,
                profilePictureUrl,
                profilePicturePublicId,
            };

            console.log("Creating profile with data:", newProfileData);
            console.log("UserProfile Model:", UserProfile);

            try {
                console.log("Attempting to create new profile...");
                const newProfile = await UserProfile.create(newProfileData);
                console.log("New profile created:", newProfile);
                return res.status(201).json({ message: "Profile created successfully", data: newProfile });
            } catch (createError) {
                console.error("Error creating profile:", createError);
                console.error("Create error stack:", createError.stack);
                return res.status(500).json({ message: "Profile creation failed", error: createError.message });
            }
        }

        console.log("Profile picture URL:", profilePictureUrl);
        console.log("Profile picture public ID:", profilePicturePublicId);

    } catch (err) {
        console.error("Error in addOrUpdateProfile:", err);
        console.error(err.stack);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

// const UserProfile = require("../../model/users/profileModel");
// const cloudinary = require("cloudinary").v2;
// const mongoose = require("mongoose");

// exports.addOrUpdateProfile = async (req, res) => {
//     const userId = req.userId;
//     const { age, dateOfBirth, phoneNo, gender, bio } = req.body;

//     try {
//         let profilePictureUrl = null;
//         let profilePicturePublicId = null;

//         if (req.file) {
//             console.log("Uploaded file:", req.file);
//             try {
//                 const result = await cloudinary.uploader.upload(req.file.path);
//                 console.log("Cloudinary upload result:", result);
//                 profilePictureUrl = result.secure_url;
//                 profilePicturePublicId = result.public_id;
//             } catch (cloudinaryError) {
//                 console.error("Cloudinary error:", cloudinaryError);
//                 return res.status(500).json({ message: "Cloudinary upload failed", error: cloudinaryError.message });
//             }
//         } else {
//             console.log("No file uploaded");
//         }

//         let profile = await UserProfile.findOne({ userId });
//         console.log("User ID:", userId);
//         console.log("Found Profile:", profile);

//         if (profile) {
//             // Update existing profile
//             profile.age = age;
//             profile.dateOfBirth = dateOfBirth;
//             profile.phoneNo = phoneNo;
//             profile.gender = gender;
//             profile.bio = bio;

//             if (profilePictureUrl && profilePicturePublicId) {
//                 profile.profilePictureUrl = profilePictureUrl;
//                 profile.profilePicturePublicId = profilePicturePublicId;
//             }

//             console.log("Profile before save:", profile);
//             await profile.save();
//             return res.status(200).json({ message: "Profile updated successfully", data: profile });
//         } else {
//             // Create new profile
//             const newProfileData = {
//                 userId,
//                 age,
//                 dateOfBirth,
//                 phoneNo,
//                 gender,
//                 bio,
//                 profilePictureUrl,
//                 profilePicturePublicId,
//             };

//             console.log("Creating profile with data:", newProfileData);
//             console.log("UserProfile Model:", UserProfile);

//             try {
//                 console.log("Attempting to create new profile...");
//                 const newProfile = await UserProfile.create(newProfileData);
//                 console.log("New profile created:", newProfile);
//                 return res.status(201).json({ message: "Profile created successfully", data: newProfile });
//             } catch (createError) {
//                 console.error("Error creating profile:", createError);
//                 console.error("Create error stack:", createError.stack);
//                 return res.status(500).json({ message: "Profile creation failed", error: createError.message });
//             }
//         }
//     } catch (err) {
//         console.error("Error in addOrUpdateProfile:", err);
//         console.error(err.stack);
//         return res.status(500).json({ message: "An error occurred", error: err.message });
//     }
// };

// // const UserProfile = require("../../model/users/profileModel");
// // const cloudinary = require("cloudinary").v2; // Import Cloudinary

// // exports.addOrUpdateProfile = async (req, res) => {
// //   const userId = req.userId;
// //   const { age, dateOfBirth, phoneNo, gender, bio } = req.body;

// //   try {
// //     let profilePictureUrl = null;
// //     let profilePicturePublicId = null;

// //     if (req.file) {
// //       console.log("Uploaded file:", req.file);
// //       const result = await cloudinary.uploader.upload(req.file.path);
// //       console.log("Cloudinary upload result:", result);

// //       profilePictureUrl = result.secure_url;
// //       profilePicturePublicId = result.public_id;
// //     } else {
// //       console.log("No file uploaded");
// //     }

// //     let profile = await UserProfile.findOne({ userId });
// //     console.log(userId);
// //     console.log(profile);

// //     if (profile) {
// //       // Update existing profile
// //       profile.age = age;
// //       profile.dateOfBirth = dateOfBirth;
// //       profile.phoneNo = phoneNo;
// //       profile.gender = gender;
// //       profile.bio = bio;

// //       if (profilePictureUrl && profilePicturePublicId) {
// //         profile.profilePictureUrl = profilePictureUrl;
// //         profile.profilePicturePublicId = profilePicturePublicId;
// //       }

// //       await profile.save();
// //       return res
// //         .status(200)
// //         .json({ message: "Profile updated successfully", data: profile });
// //     } else {
// //       // Create new profile
// //       const newProfileData = {
// //         userId,
// //         age,
// //         dateOfBirth,
// //         phoneNo,
// //         gender,
// //         bio,
// //         profilePictureUrl, // Directly set from the variables
// //         profilePicturePublicId, // Directly set from the variables
// //       };

// //       const newProfile = await UserProfile.create(newProfileData); // use UserProfile here.

// //       return res
// //         .status(201)
// //         .json({ message: "Profile created successfully", data: newProfile });
// //     }
// //   } catch (err) {
// //     console.error("Error in addOrUpdateProfile:", err);
// //     return res
// //       .status(500)
// //       .json({ message: "An error occurred", error: err.message }); // Send error message
// //   }
// // };
