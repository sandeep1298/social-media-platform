const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { jwtSecret } = require("../config/env");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "You must be logged in" });
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload._id);

    if (!user) {
      return res.status(401).json({ success: false, error: "You must be logged in" });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ success: false, error: "You must be logged in" });
  }
};
