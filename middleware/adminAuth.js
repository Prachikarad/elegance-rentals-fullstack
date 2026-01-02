const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check header exists
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 2️⃣ Extract token after "Bearer "
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Check admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Not an admin account" });
    }

    req.admin = decoded;
    next();

  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
