// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");
// require("dotenv/config");

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   cloudinary_key: process.env.CLOUDINARY_KEY,
//   cloudinary_secret: process.env.CLOUDINARY_SECRET,
// });

// console.log("Cloud Name: ", process.env.CLOUD_NAME);

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'ProfilePictures',
//         allowedFormats: ['jpeg', 'png', 'jpg']
//     },
//     transformation: [{
//         height: 500, width: 500, crop: 'limit',  quality: 'auto: good'  
//     }]
// })

// const upload = multer({storage: storage, debug: true})

// module.exports = {cloudinary, upload}
