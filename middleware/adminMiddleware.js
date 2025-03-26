const jwt = require("jsonwebtoken");
require("dotenv/config");

exports.verifyAdminToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("Received Token:", token);
  if (!token) {
      return res.status(403).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
          console.log("JWT Verification Error:", err, err.message); 
          return res.status(401).json({ messsage: "Unauthorization" });
      }
      console.log("Decoded Token:", decoded); 
      req.adminId = decoded.adminId;
      next();
  });
};

// exports.verifyAdminToken = (req, res, next) => {
//   const token = req.headers["authorization"]?.split(" ")[1];

//   if (!token) {
//     return res.status(403).json({ message: "No token provided" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ messsage: "Unauthorization" });
//     }

//     req.adminId = decoded.adminId;
//     next();
//   });
// };

