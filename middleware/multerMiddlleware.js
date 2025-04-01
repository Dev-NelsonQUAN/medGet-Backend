const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');

const upload = multer({ 
  storage,
  limits: { fileSize: 3 * 1024 * 1024 } 
});

module.exports = upload;


// const multer = require('multer');
// const { storage } = require('../config/cloudinaryConfig');

// const upload = multer({
//     storage,
//     limits: { fileSize: 3 * 1024 * 1024 },
// }).single("profileImage");

// module.exports = (req, res, next) => {
//     upload(req, res, (err) => {
//         if (err) {
//             console.error("Multer Error:", err);
//             return res.status(500).json({ message: "File upload error", error: err.message });
//         }
//         next();
//     });
// };