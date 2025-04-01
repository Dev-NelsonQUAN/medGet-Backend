const jwt = require("jsonwebtoken");
require("dotenv/config");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Store userId from decoded JWT payload to req.userId
    req.userId = decoded.userId;  
    // Ensure `userId` is in the JWT payload
    next();
  });
};


// const jwt = require("jsonwebtoken");
// require("dotenv/config");

// exports.verifyToken = (req, res, next) => {
//   const token = req.headers["authorization"]?.split(" ")[1];

//   if (!token) {
//     return res.status(403).json({ message: "No token provided" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Unauthorization" });
//     }

//     req.userId = decoded.userId;
//     next();
//   });
// };
