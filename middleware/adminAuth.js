// middleware/adminAuth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // accept Authorization: Bearer <token> OR header x-auth-token
  const authHeader = req.header("Authorization") || req.header("authorization");
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.header("x-auth-token")) {
    token = req.header("x-auth-token");
  }

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "SECRET123");
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not an admin" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token" });
  }
};
