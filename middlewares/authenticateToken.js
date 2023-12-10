require("dotenv").config();
const { JWT_SECRET_KEY } = process.env;
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const protectedRoutes = ["/protected"];

  if (!protectedRoutes.includes(req.path)) {
    return next();
  }
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
