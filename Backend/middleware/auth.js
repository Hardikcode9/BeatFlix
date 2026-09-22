const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token && token !== "null" && token !== "undefined") {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
      }
    }
  } catch (error) {
    // Continue as guest
  }
  next();
}

module.exports = auth;
module.exports.auth = auth;
module.exports.optionalAuth = optionalAuth;