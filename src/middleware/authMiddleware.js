const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => {

  return (req, res, next) => {

    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Check if user role is allowed
      if (roles?.length > 0 && !roles?.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden. You do not have access to this resource." });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token!" });
    }
  }
};

module.exports = authMiddleware;
