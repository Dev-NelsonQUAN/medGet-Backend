const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log("Cloudinary Config:", process.env.CLOUDINARY_CLOUD_NAME);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async(req, file) =>  {
    let folder = "uploads"; 

    if (file.fieldname === "pharmacyProfiles") folder = "pharmacyProfiles";
    if (file.fieldname === "medicines") folder = "medicines";
    if (file.fieldname === "profileImage") folder = "userProfile";

    return{
      folder,
      allowed_formats: ["jpg", "png", "jpeg"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
      public_id: `${file.fieldname}-${Date.now()}`
    }
  },
});

module.exports = { cloudinary, storage };